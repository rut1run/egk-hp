async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))
}

// Digest before comparing so the loop has a fixed length. Missing/short secrets
// always fail closed; a public identity header never grants bootstrap access.
export async function validSetupToken(expected: string, supplied: string) {
  if (expected.length < 32 || expected.length > 256 || supplied.length > 256) return false
  const [a, b] = await Promise.all([digest(expected), digest(supplied)])
  let difference = 0
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i]
  return difference === 0
}
