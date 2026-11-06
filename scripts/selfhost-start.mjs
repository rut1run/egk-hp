import {cpSync,mkdirSync} from 'node:fs'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
// Standalone output needs its public/static assets alongside server.js.
mkdirSync('.next/standalone/.next',{recursive:true})
cpSync('public','.next/standalone/public',{recursive:true})
cpSync('.next/static','.next/standalone/.next/static',{recursive:true})
process.env.EGK_DATA_DIR=resolve(process.env.EGK_DATA_DIR||'.data')
process.env.HOSTNAME='127.0.0.1'
process.env.PORT=process.env.PORT||'3000'
process.env.EGK_SITE_URL=process.env.EGK_SITE_URL||`http://127.0.0.1:${process.env.PORT}`
await import(pathToFileURL(resolve('.next/standalone/server.js')).href)
