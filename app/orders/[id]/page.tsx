import {cookies} from 'next/headers'
import {notFound} from 'next/navigation'
import Link from '@/components/site/link'
import {currentAccount,database} from '@/lib/auth/server'
import {digest} from '@/lib/auth/crypto'
import {orderLabels,type OrderData} from '@/lib/orders'
import {Container,PageHeader} from '@/components/site/primitives'
export const dynamic='force-dynamic'
export const metadata={title:'注文の確認',robots:{index:false}}
export default async function Order({params}:{params:Promise<{id:string}>}){
 const {id}=await params,account=await currentAccount(),token=(await cookies()).get('egk_order_access')?.value??''
 const row=await database().prepare('SELECT id,account_id,email,status,data,total,guest_hash,created_at FROM orders WHERE id=?').bind(id).first<{id:string;account_id:string|null;email:string;status:string;data:string;total:number;guest_hash:string;created_at:number}>()
 if(!row||!(account?.role==='admin'||(account&&row.account_id===account.id)||(/^[a-f0-9]{64}$/.test(token)&&await digest(token)===row.guest_hash)))notFound()
 const data=JSON.parse(row.data) as OrderData
 return <><PageHeader title="注文の確認"/><Container className="max-w-3xl space-y-7 py-10"><div className="border-l-4 border-primary bg-muted p-5"><p className="font-black">{orderLabels[row.status]??row.status}</p><p className="mt-2 text-sm leading-7">{row.status==='requested'?'内容を受け付けました。支払い・購入確定・在庫確保はまだ行われていません。送料・在庫・支払い方法は運営から案内します。':'運営が更新した受付状況を表示しています。入金済みは運営による確認記録です。'}</p></div><p className="break-all text-sm">受付番号：{row.id}</p><ul className="divide-y border-y">{data.items.map(item=><li key={item.variantId} className="flex justify-between gap-4 py-4 text-sm"><span>{item.name}<span className="block text-xs text-muted-foreground">{item.options} ×{item.quantity}</span></span><span>¥{(item.quantity*item.price).toLocaleString()}</span></li>)}</ul><dl className="space-y-3 text-sm"><div className="flex justify-between"><dt>商品小計</dt><dd>¥{data.subtotal.toLocaleString()}</dd></div><div className="flex justify-between"><dt>送料</dt><dd>{data.shipping===null?'確認後に案内':`¥${data.shipping.toLocaleString()}`}</dd></div>{data.shipping!==null&&<div className="flex justify-between border-t pt-3 font-bold"><dt>合計</dt><dd>¥{row.total.toLocaleString()}</dd></div>}</dl><p className="whitespace-pre-line text-sm leading-7">{data.paymentInstructions}</p>{data.tracking&&<p className="break-all text-sm">発送情報：{data.tracking}</p>}<section className="border-t pt-6 text-sm leading-7"><h2 className="font-bold">連絡先・配送先</h2><p>{row.email}<br/>{data.name}<br/>〒{data.postal} {data.prefecture}{data.city} {data.building}<br/>{data.phone}</p></section><Link href="/contact" className="inline-block text-sm underline">商品について問い合わせる</Link><p className="text-xs leading-6 text-muted-foreground">ゲストの受付内容は、この端末のCookieで確認できます。受付番号を控えてください。会員への紐づけは確認済みメールを使用した本人確認が必要です。</p></Container></>
}
