import { boundedForm } from '@/lib/auth/form'
import { createSession, database, destination, sameOrigin } from '@/lib/auth/server'
import { digest, verifyPassword } from '@/lib/auth/crypto'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })
  let form: FormData
  try { form = await boundedForm(request, 16000) } catch { return new Response('Request too large', {status:413}) }
  const username = String(form.get('userId') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')
  if (!/^[a-z0-9_]{3,20}$/.test(username) || password.length > 128) return destination(request, '/login?error=credentials')
  const db = database(), now = Date.now()
  const key = await digest(`${request.headers.get('cf-connecting-ip') ?? 'local'}:${username}`)
  await db.prepare('DELETE FROM login_attempts WHERE window_end<?').bind(now - 86400000).run()
  await db.prepare('INSERT INTO login_attempts(key,count,window_end) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_end<? THEN 1 ELSE count+1 END,window_end=CASE WHEN window_end<? THEN excluded.window_end ELSE window_end END').bind(key, now + 900000, now, now).run()
  const attempt = await db.prepare('SELECT count FROM login_attempts WHERE key=?').bind(key).first<{ count: number }>()
  if ((attempt?.count ?? 0) > 10) return destination(request, '/login?error=rate')
  const account = await db.prepare('SELECT id,password_hash,role FROM accounts WHERE username=?').bind(username).first<{ id: string; password_hash: string; role: string }>()
  const hash = account?.password_hash ?? `pbkdf2-sha256$100000$${'0'.repeat(64)}$${'0'.repeat(64)}`
  if (!await verifyPassword(password, hash) || !account) return destination(request, '/login?error=credentials')
  await db.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run()
  const requested=String(form.get('next')??'');const next=/^\/(mypage|checkout|members\/[a-z0-9-]+)$/.test(requested)?requested:requested==='/admin'&&account.role==='admin'?'/admin':'/mypage'
  return createSession(account.id, request, next)
}
