import {writeFile} from 'node:fs/promises'
import {pathToFileURL} from 'node:url'
export function cloudflareConfig(values) {
  const id=values.CLOUDFLARE_D1_DATABASE_ID??'', bucket=values.CLOUDFLARE_R2_BUCKET??''
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)||id==='00000000-0000-4000-8000-000000000000') throw Error('Set CLOUDFLARE_D1_DATABASE_ID to your D1 database UUID.')
  if(!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) throw Error('Set CLOUDFLARE_R2_BUCKET to your existing R2 bucket name.')
  return {
    name:'egk-hp', main:'./worker/index.ts', compatibility_date:'2026-05-15',
    compatibility_flags:['nodejs_compat'], workers_dev:true,
    vars:{EGK_HOSTING_MODE:'cloudflare'},
    d1_databases:[{binding:'DB',database_name:'egk-hp',database_id:id,migrations_dir:'./drizzle'}],
    r2_buckets:[{binding:'BUCKET',bucket_name:bucket}],
  }
}
export async function configure() {
  await writeFile('.cloudflare.generated.json',JSON.stringify(cloudflareConfig(process.env),null,2)+'\n')
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) await configure()
