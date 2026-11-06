import { env } from '#egk-runtime'
export async function GET(_request: Request, {params}: {params:Promise<{key:string}>}) {
  const {key}=await params
  if(!/^[a-z0-9-]+\.(png|jpg|webp)$/.test(key)||!env.BUCKET)return new Response('Not found',{status:404})
  const file=await env.BUCKET.get(key)
  if(!file)return new Response('Not found',{status:404})
  const headers=new Headers({'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'",'Cache-Control':'public, max-age=31536000, immutable'})
  file.writeHttpMetadata(headers)
  headers.set('ETag',file.httpEtag)
  return new Response(file.body,{headers})
}
