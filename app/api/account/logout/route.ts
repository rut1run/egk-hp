import { cookies } from 'next/headers'
import { database, destination, sameOrigin, SESSION_COOKIE } from '@/lib/auth/server'
import { digest } from '@/lib/auth/crypto'
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (token) await database().prepare('DELETE FROM account_sessions WHERE token_hash=?').bind(await digest(token)).run()
  const response = destination(request, '/login')
  response.headers.set('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`)
  return response
}
