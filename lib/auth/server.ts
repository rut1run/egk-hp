import 'server-only'
import { env } from '#egk-runtime'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { digest, randomToken } from './crypto'

export type Account = { id: string; username: string; display_name: string; email: string; role: string }
export const SESSION_COOKIE = 'egk_session'
export function database() {
  if (!env.DB) throw new Error('Database is not configured')
  return env.DB
}
export async function currentAccount(): Promise<Account | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null
  return database().prepare(`SELECT a.id,a.username,a.display_name,a.email,a.role FROM account_sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>? AND a.password_hash<>'disabled'`).bind(await digest(token), Date.now()).first<Account>()
}
export async function requireAdmin() {
  const account = await currentAccount()
  if (!account) redirect('/login?next=/admin')
  if (account.role !== 'admin') redirect('/mypage')
  return account
}
export function requestOrigin(request: Request) {
  if ((env as unknown as Record<string, unknown>).EGK_HOSTING_MODE === 'selfhost') {
    const configured = String((env as unknown as Record<string, unknown>).EGK_SITE_URL ?? '')
    if (!configured) throw new Error('EGK_SITE_URL is required for self-hosting')
    const url = new URL(configured)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Invalid EGK_SITE_URL')
    return url.origin
  }
  return new URL(request.url).origin
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === requestOrigin(request)
}
export function destination(request: Request, path: string) {
  const response = new Response(null, { status: 303, headers: { Location: new URL(path, requestOrigin(request)).href, 'Cache-Control': 'no-store' } })
  return response
}
export async function createSession(accountId: string, request: Request, path: string) {
  const token = randomToken()
  const db = database()
  await db.batch([
    db.prepare('DELETE FROM account_sessions WHERE expires_at<?').bind(Date.now()),
    db.prepare('INSERT INTO account_sessions(token_hash,account_id,expires_at) VALUES(?,?,?)').bind(await digest(token), accountId, Date.now() + 7 * 86400000),
  ])
  const response = destination(request, path)
  const secure = new URL(requestOrigin(request)).protocol === 'https:' ? '; Secure' : ''
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`)
  return response
}
export async function bootstrapComplete() {
  return !!await database().prepare("SELECT key FROM site_settings WHERE key='admin_bootstrap'").first()
}
export function setupEmail() { return String((env as unknown as Record<string, unknown>).EGK_BOOTSTRAP_EMAIL ?? '').trim().toLowerCase() }

export function standaloneHosting() {
  const mode = (env as unknown as Record<string, unknown>).EGK_HOSTING_MODE
  return mode === 'cloudflare' || mode === 'selfhost'
}
export function setupToken() { return String((env as unknown as Record<string, unknown>).EGK_SETUP_TOKEN ?? '') }
