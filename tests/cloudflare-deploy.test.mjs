import test from 'node:test'
import assert from 'node:assert/strict'
import {cloudflareConfig} from '../scripts/cloudflare-config.mjs'
import {validSetupToken} from '../lib/auth/setup-token.ts'
test('standalone bootstrap fails closed and accepts only the configured secret',async()=>{
 const key='test-only-token-32-characters-or-more'
 assert.equal(await validSetupToken('',key),false)
 assert.equal(await validSetupToken('short','short'),false)
 assert.equal(await validSetupToken(key,key+'x'),false)
 assert.equal(await validSetupToken(key,key),true)
 assert.equal(await validSetupToken(key,'x'.repeat(257)),false)
})
test('production config rejects missing/placeholder bindings and enables standalone auth',()=>{
 assert.throws(()=>cloudflareConfig({}))
 assert.throws(()=>cloudflareConfig({CLOUDFLARE_D1_DATABASE_ID:'00000000-0000-4000-8000-000000000000',CLOUDFLARE_R2_BUCKET:'egk-media'}))
 const config=cloudflareConfig({CLOUDFLARE_D1_DATABASE_ID:'12345678-1234-4234-8234-123456789abc',CLOUDFLARE_R2_BUCKET:'egk-media'})
 assert.equal(config.vars.EGK_HOSTING_MODE,'cloudflare')
 assert.equal(config.d1_databases[0].binding,'DB')
 assert.equal(config.r2_buckets[0].binding,'BUCKET')
 assert.equal(JSON.stringify(config).includes('EGK_SETUP_TOKEN'),false)
})
