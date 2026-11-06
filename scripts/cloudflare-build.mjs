import {spawnSync} from 'node:child_process'
import {configure} from './cloudflare-config.mjs'
await configure()
const env={...process.env,EGK_DEPLOY_TARGET:'cloudflare'}
delete env.EGK_SETUP_TOKEN
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{stdio:'inherit',env})
if(result.error) throw result.error
process.exit(result.status??1)
