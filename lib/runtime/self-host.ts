import { localDatabase, localBucket } from './storage.mjs'
// Lazy bindings: builds must not create or read the production data directory.
export const env = new Proxy({} as Cloudflare.Env, {
  get(_target, name) {
    if (name === 'DB') return localDatabase()
    if (name === 'BUCKET') return localBucket()
    if (name === 'EGK_HOSTING_MODE') return 'selfhost'
    return process.env[String(name)]
  },
})
