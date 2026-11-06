import Link from '@/components/site/link'
import { requireAdmin } from '@/lib/auth/server'
import { managedDivisions } from '@/lib/admin/content'
import { Field,SubmitButton } from '@/components/site/field'
import { EditorHeading,Feedback } from '@/components/admin/editor-ui'
export default async function Divisions({searchParams}:{searchParams:Promise<{edit?:string;saved?:string;error?:string}>}) {
 await requireAdmin();const params=await searchParams,items=await managedDivisions(),item=items.find(x=>x.slug===params.edit)
 return <><EditorHeading title="部門" kind="divisions"/><Feedback {...params}/><div className="grid gap-10 lg:grid-cols-[1fr_2fr]"><ul className="divide-y border-y">{items.sort((a,b)=>a.order-b.order).map(x=><li key={x.slug}><Link href={`/admin/divisions?edit=${x.slug}`} className="block py-4 text-sm font-bold">{x.name.ja}</Link></li>)}</ul>{params.edit&&(item||params.edit==='new')?<form key={params.edit} action="/api/admin/content" method="post" className="space-y-5"><input type="hidden" name="kind" value="divisions"/><input type="hidden" name="originalSlug" value={item?.slug??''}/><Field id="slug" label="識別名" hint="半角小文字・数字・ハイフン。保存後は変更できません。" defaultValue={item?.slug} readOnly={!!item} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} required/><Field id="nameJa" label="部門名（日本語）" defaultValue={item?.name.ja} required/><Field id="nameEn" label="部門名（英語）" defaultValue={item?.name.en}/><Field id="order" label="表示順" type="number" min={-100000} max={100000} defaultValue={item?.order??0}/><SubmitButton>保存</SubmitButton></form>:<p className="text-sm text-muted-foreground">編集する部門を選択してください。</p>}</div></>
}
