import type { MetadataRoute } from 'next'
import { getMembers, getNews, getProducts, getTournaments } from '@/lib/data'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://egk-official-team.sia-rut1run.chatgpt.site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [members, news, tournaments, products] = await Promise.all([
    getMembers(),
    getNews(),
    getTournaments(),
    getProducts(),
  ])
  const statics = ['', '/team', '/members', '/news', '/tournaments', '/shop', '/sponsors', '/contact', '/terms', '/privacy', '/commerce']
  return [
    ...statics.map((p) => ({ url: `${base}${p}` })),
    ...members.map((m) => ({ url: `${base}/members/${m.slug}` })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: n.publishAt })),
    ...tournaments.map((x) => ({ url: `${base}/tournaments/${x.slug}` })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}` })),
  ]
}
