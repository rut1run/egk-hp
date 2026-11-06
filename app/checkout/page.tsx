import Link from '@/components/site/link'
import {CheckoutSummary} from '@/components/shop/checkout-summary'
import {OrderForm} from '@/components/shop/order-form'
import {Container,PageHeader} from '@/components/site/primitives'
import {getCartCatalog} from '@/lib/data/catalog'
import {getI18n} from '@/lib/i18n/server'
import {currentAccount} from '@/lib/auth/server'
import {profile} from '@/lib/account'
export const metadata={title:'注文内容の受付',robots:{index:false}}
export default async function Checkout({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {locale}=await getI18n(),a=await currentAccount(),p=a?await profile(a.id):null,catalog=await getCartCatalog(locale),q=await searchParams,ja=locale==='ja'
 return <><PageHeader title={ja?'注文内容の受付':'Order request'}/><Container className="grid gap-10 py-10 lg:grid-cols-[3fr_2fr]"><div>{!a&&<p className="mb-6 text-sm">{ja?'ゲストでも送信できます。':'Guests can submit requests.'} <Link href="/login?next=/checkout" className="underline">{ja?'ログイン':'Sign in'}</Link></p>}{q.error&&<p role="alert" className="mb-6 border-l-4 border-destructive p-4 text-sm">{ja?'送信できませんでした。入力・販売期間・在庫・カート内容を確認してください。':'Unable to submit. Check your details, the sale period, stock and cart.'}</p>}<OrderForm email={a?.email} address={p?.data.address}/></div><aside className="self-start border-2 border-foreground p-5"><h2 className="mb-4 font-black">{ja?'注文内容':'Summary'}</h2><CheckoutSummary catalog={catalog}/></aside></Container></>
}
