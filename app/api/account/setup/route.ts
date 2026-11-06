import { boundedForm } from '@/lib/auth/form'
import { getChatGPTUser } from '@/app/chatgpt-auth'
import { bootstrapComplete, createSession, database, destination, sameOrigin, setupEmail, standaloneHosting, setupToken } from '@/lib/auth/server'
import { validSetupToken } from '@/lib/auth/setup-token'
import { limit, emailAddress } from '@/lib/account'
import { hashPassword } from '@/lib/auth/crypto'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })
  const standalone = standaloneHosting()
  const identity = standalone ? null : await getChatGPTUser()
  if (!standalone && (!setupEmail() || identity?.email.toLowerCase() !== setupEmail())) return new Response('Forbidden', { status: 403 })
  // Account creation may have committed even when the browser cancelled the
  // redirect. Retrying is safe: keep the account and send its owner to sign in.
  if (await bootstrapComplete()) return destination(request, '/login?next=/admin&notice=setup-complete')
  let form: FormData
  try { form = await boundedForm(request, 16000) } catch { return new Response('Request too large', {status:413}) }
  if (standalone) { try { await limit(request, 'bootstrap', 5) } catch { return new Response('Too many attempts', { status: 429 }) } }
  if (standalone && !await validSetupToken(setupToken(), String(form.get('setupToken') ?? ''))) return new Response('Forbidden', { status: 403 })
  const email = standalone ? String(form.get('email') ?? '').trim().toLowerCase() : identity!.email.toLowerCase()
  try { emailAddress(email) } catch { return destination(request, '/admin/setup?error=invalid') }
  const username = String(form.get('userId') ?? '').trim().toLowerCase()
  const name = String(form.get('displayName') ?? '').trim()
  const password = String(form.get('password') ?? '')
  if (!/^[a-z0-9_]{3,20}$/.test(username) || !name || name.length > 80 || password.length < 12 || password.length > 128 || password !== form.get('confirm')) return destination(request, '/admin/setup?error=invalid')
  const db = database(), id = crypto.randomUUID()
  try {
    // The unique bootstrap marker and account are committed together; a race cannot create two initial admins.
    await db.batch([
      db.prepare('INSERT INTO site_settings(key,value) VALUES(?,?)').bind('admin_bootstrap', id),
      db.prepare('INSERT INTO accounts(id,username,display_name,email,password_hash,role,platform_id,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(id, username, name, email, await hashPassword(password), 'admin', standalone ? null : identity!.userId, Date.now()),
      db.prepare('INSERT INTO admin_audit(id,account_id,action,target,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(), id, 'bootstrap', 'account', Date.now()),
    ])
  } catch {
    // Also cover two submissions racing after the initial check.
    if (await bootstrapComplete()) return destination(request, '/login?next=/admin&notice=setup-complete')
    return destination(request, '/admin/setup?error=conflict')
  }
  return createSession(id, request, '/admin')
}
