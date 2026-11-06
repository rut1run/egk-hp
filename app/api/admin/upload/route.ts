import { boundedForm } from '@/lib/auth/form'
import { env } from '#egk-runtime'
import { currentAccount, sameOrigin } from '@/lib/auth/server'
export async function POST(request: Request) {
  if (!sameOrigin(request) || (await currentAccount())?.role !== 'admin') return new Response('Forbidden',{status:403})
  if (!env.BUCKET) return Response.json({ error: '画像保存が未設定です。' },{status:503})
  if (Number(request.headers.get('content-length')??0)>6*1024*1024) return Response.json({error:'画像は5MB以下にしてください。'},{status:413})
  let form: FormData;try{form=await boundedForm(request,6291456)}catch{return new Response('Request too large',{status:413})}
 const  file=form.get('image')
  if (!(file instanceof File) || file.size<12 || file.size>5*1024*1024) return Response.json({error:'画像は5MB以下にしてください。'},{status:400})
  const data=await file.arrayBuffer(),b=new Uint8Array(data)
  let ext='',type=''
  if (b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10) {ext='png';type='image/png'}
  else if(b[0]===255&&b[1]===216&&b[2]===255){ext='jpg';type='image/jpeg'}
  else if(new TextDecoder().decode(b.slice(0,4))==='RIFF'&&new TextDecoder().decode(b.slice(8,12))==='WEBP'){ext='webp';type='image/webp'}
  if (!ext) return Response.json({error:'PNG・JPEG・WebPを選んでください。'},{status:400})
  const key=`${crypto.randomUUID()}.${ext}`
  await env.BUCKET.put(key,data,{httpMetadata:{contentType:type,cacheControl:'public, max-age=31536000, immutable'}})
  return Response.json({url:`/media/${key}`})
}
