import {requestOrigin} from '@/lib/auth/server'
import {boundedForm} from '@/lib/auth/form'
import {database,currentAccount,sameOrigin,destination} from '@/lib/auth/server'
import {digest,randomToken} from '@/lib/auth/crypto'
import {emailAddress,limit} from '@/lib/account'
import {text} from '@/lib/admin/validation'
import {cartLines,type OrderData} from '@/lib/orders'
import {getProducts,getAvailability} from '@/lib/data'
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403})
 try{
  await limit(request,'orders',10);const f=await boundedForm(request,24000),account=await currentAccount(),db=database(),idempotency=text(f,'idempotency',80,true)
  if(!/^[a-f0-9-]{36}$/.test(idempotency)||f.get('agree')!=='on')throw Error('order')
  const existing=await db.prepare('SELECT id,account_id FROM orders WHERE idempotency=?').bind(idempotency).first<{id:string;account_id:string|null}>()
  if(existing){if(account&&existing.account_id===account.id)return destination(request,`/orders/${existing.id}`);return destination(request,'/checkout?error=duplicate')}
  const lines=cartLines(text(f,'lines',16000,true)),products=await getProducts()
  const items=lines.map(line=>{const p=products.find(x=>x.slug===line.productSlug),v=p?.variants.find(x=>x.id===line.variantId);if(!p||!v||getAvailability(p)!=='on_sale'||(p.fulfillment==='stock'&&(v.stock??0)<line.quantity))throw Error('stock');return {slug:p.slug,variantId:v.id,name:p.name.ja,options:p.options.map(o=>`${o.name.ja}: ${o.values.find(x=>x.id===v.options[o.key])?.label.ja??''}`).join(' / '),quantity:line.quantity,price:p.priceJpy}})
  const subtotal=items.reduce((sum,i)=>sum+i.quantity*i.price,0);if(!Number.isSafeInteger(subtotal)||subtotal>100000000)throw Error('total')
  const data:OrderData={name:text(f,'name',100,true),postal:text(f,'postal',20,true),prefecture:text(f,'prefecture',30,true),city:text(f,'city',200,true),building:text(f,'building',200),phone:text(f,'phone',30,true),items,subtotal,shipping:null},email=emailAddress(text(f,'email',254,true)),id=`EGK-${crypto.randomUUID()}`,token=randomToken(),now=Date.now()
  await db.prepare('INSERT INTO orders(id,account_id,email,status,data,total,guest_hash,idempotency,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,account?.id??null,email,'requested',JSON.stringify(data),subtotal,await digest(token),idempotency,now,now).run()
  const response=destination(request,`/orders/${id}`);response.headers.append('Set-Cookie',`egk_order_access=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(requestOrigin(request)).protocol==='https:'?'; Secure':''}`);return response
 }catch{return destination(request,'/checkout?error=invalid')}
}
