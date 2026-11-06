import { parseCatalogRecord } from '@/lib/admin/catalog-validation'
import { boundedForm } from '@/lib/auth/form'
import { currentAccount, database, destination, sameOrigin } from '@/lib/auth/server'
import { localDateToISO, slug, text, translation, webUrl } from '@/lib/admin/validation'
import { managedDivisions, managedMembers, managedCategories, managedProducts } from '@/lib/admin/content'
import type { Division, NewsPost, Member } from '@/lib/types'

export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Forbidden', { status: 403 })
  const account = await currentAccount()
  if (account?.role !== 'admin') return new Response('Forbidden', { status: 403 })
  if (Number(request.headers.get('content-length') ?? 0) > 100000) return new Response('Too large', { status: 413 })
  let form: FormData
  try { form = await boundedForm(request, 100000) } catch { return new Response('Request too large', {status:413}) }
  const kind = String(form.get('kind'))
  if (!['members', 'news', 'divisions', 'products', 'categories', 'sponsors', 'banners', 'team', 'tournaments'].includes(kind)) return new Response('Bad request', { status: 400 })
  let record: object, published: boolean, id: string
  try {
    id = slug(text(form, 'slug', 80, true))
    const oldSlug = text(form, 'originalSlug', 80)
    if (oldSlug && oldSlug !== id) throw new Error('slug immutable')
    const order = Number(text(form, 'order', 8) || '0')
    if (!Number.isSafeInteger(order) || Math.abs(order) > 100000) throw new Error('order')
    if (['products','categories','sponsors','banners','team','tournaments'].includes(kind)) {
      const parsed=parseCatalogRecord(form,kind,id,order);record=parsed.record;published=parsed.published
      if(kind==='products'){
        const product=record as import('@/lib/types').Product
        const [categories,members,products]=await Promise.all([managedCategories(),managedMembers(),managedProducts()])
        if(!categories.some(c=>c.slug===product.category)||product.memberSlugs.some(m=>!members.some(v=>v.slug===m)))throw Error('references')
        const used=new Set(products.filter(p=>p.slug!==id).flatMap(p=>p.variants.map(v=>v.id)))
        if(product.variants.some(v=>used.has(v.id)))throw Error('variant collision')
      }
    } else if (kind === 'divisions') {
      record = { slug: id, name: { ja: text(form, 'nameJa', 100, true), en: text(form, 'nameEn', 100) || undefined }, order }
      published = true
    } else if (kind === 'members') {
      const divisionSlug = text(form, 'divisionSlug', 80, true)
      if (!(await managedDivisions()).some(d => d.slug === divisionSlug)) throw new Error('division')
      const bioJa = text(form, 'bioJa', 10000), bioEn = text(form, 'bioEn', 10000)
      const achievements = Array.from({ length: 5 }, (_, i) => ({year:text(form, `year${i}`, 20),title:{ja:text(form, `achievementJa${i}`, 300),en:text(form, `achievementEn${i}`, 300)||undefined}})).filter(a => a.title.ja)
      const socials = (['x','youtube','twitch','tiktok','instagram'] as const).flatMap(type => {const url=webUrl(text(form, type, 1000));return url ? [{type,url}] : []})
      published = form.get('status') === 'published'
      record = { slug: id, handle: text(form, 'handle', 80, true), divisionSlug, order, iconUrl: webUrl(text(form, 'iconUrl', 1000)) || undefined, portraitUrl: webUrl(text(form,'portraitUrl',1000))||undefined, bio: bioJa ? { ja: bioJa, en: bioEn||undefined } : undefined, achievements, socials, translation: translation(form, !!bioEn || achievements.some(a => !!a.title.en)), ...{status:published?'published':'private'} }
    } else {
      const category = text(form, 'category', 20, true)
      if (!['info','tournament','shop','media'].includes(category)) throw new Error('category')
      const status = text(form,'status',20,true)
      if (!['draft','published','private'].includes(status)) throw new Error('status')
      const titleJa = text(form,'titleJa',200,true), titleEn=text(form,'titleEn',200)
      const bodyJa=text(form,'bodyJa',30000,true),bodyEn=text(form,'bodyEn',30000)
      const memberSlugs = form.getAll('members').map(String)
      const validMembers = await managedMembers()
      if (memberSlugs.some(m=>!validMembers.some(v=>v.slug===m))) throw new Error('members')
      record = { slug:id,title:{ja:titleJa,en:titleEn||undefined},body:{ja:bodyJa,en:bodyEn||undefined},category:category as NewsPost['category'],status:status as NewsPost['status'],publishAt:localDateToISO(text(form,'publishAt',30,true)),pinned:form.get('pinned')==='on',memberSlugs,translation:translation(form,!!titleEn&&!!bodyEn),imageUrl:webUrl(text(form,'imageUrl',1000))||undefined }
      published = status === 'published'
    }
    const db=database(), now=Date.now()
    // A create never silently overwrites an existing slug (including development examples).
    if (!text(form,'originalSlug',80)) {
      const existing=await db.prepare('SELECT slug FROM content_records WHERE kind=? AND slug=?').bind(kind,id).first()
      const { defaults } = await import('@/lib/admin/content')
      if (existing || defaults[kind as keyof typeof defaults].some(x=>x.slug===id)) throw new Error('duplicate')
    }
    const query = text(form,'originalSlug',80)
      ? db.prepare('INSERT INTO content_records(kind,slug,data,published,updated_at,updated_by) VALUES(?,?,?,?,?,?) ON CONFLICT(kind,slug) DO UPDATE SET data=excluded.data,published=excluded.published,updated_at=excluded.updated_at,updated_by=excluded.updated_by')
      : db.prepare('INSERT INTO content_records(kind,slug,data,published,updated_at,updated_by) VALUES(?,?,?,?,?,?)')
    await db.batch([
      query.bind(kind,id,JSON.stringify(record),published?1:0,now,account.id),
      db.prepare('INSERT INTO admin_audit(id,account_id,action,target,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),account.id,'save',`${kind}/${id}`,now),
    ])
  } catch {
    return destination(request, `/admin/${kind}?error=invalid`)
  }
  return destination(request, `/admin/${kind}?edit=${encodeURIComponent(id!)}&saved=1`)
}
