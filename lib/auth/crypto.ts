const ITERATIONS = 100_000
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
export function randomToken() { return hex(crypto.getRandomValues(new Uint8Array(32))) }
export async function digest(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))))
}
async function derive(password: string, salt: string, iterations: number) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  return hex(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations, hash: 'SHA-256' }, key, 256)))
}
export async function hashPassword(password: string) {
  const salt = randomToken()
  return `pbkdf2-sha256$${ITERATIONS}$${salt}$${await derive(password, salt, ITERATIONS)}`
}
export async function verifyPassword(password: string, hash: string) {
  const [algorithm, iterations, salt, expected] = hash.split('$')
  if (algorithm !== 'pbkdf2-sha256' || Number(iterations) !== ITERATIONS || !/^[a-f0-9]{64}$/.test(salt ?? '') || !/^[a-f0-9]{64}$/.test(expected ?? '')) return false
  const actual = await derive(password, salt, ITERATIONS)
  let difference = 0
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ actual.charCodeAt(i)
  return difference === 0
}
