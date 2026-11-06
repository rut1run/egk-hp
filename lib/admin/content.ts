import 'server-only'
import { database } from '@/lib/auth/server'
import { devDivisions, devMembers, devNews, devProducts, devSponsors, devBanners, devTournaments } from '@/lib/data/dev-data'
import type { Division, Member, NewsPost } from '@/lib/types'
export type ContentKind = 'members' | 'news' | 'divisions' | 'products' | 'categories' | 'sponsors' | 'banners' | 'team' | 'tournaments' | 'tournament-feed'
export type ManagedMember = Member & { status?: 'published' | 'private' }
export const defaultCategories = [
 {slug:'apparel',name:{ja:'アパレル',en:'Apparel'},order:0},
 {slug:'goods',name:{ja:'グッズ',en:'Goods'},order:1},
 {slug:'gaming',name:{ja:'ゲーミング',en:'Gaming'},order:2},
]
export const defaultBanners = devBanners.map(b=>({...b,slug:b.id}))
export const defaults = { members: devMembers, news: devNews, divisions: devDivisions, products:devProducts, categories:defaultCategories, sponsors:devSponsors, banners:defaultBanners, team:[] as import('@/lib/types').TeamContent[], tournaments:devTournaments, 'tournament-feed':[] as {slug:string}[] }
export async function listContent<T extends { slug: string }>(kind: ContentKind, fallback: T[], includePrivate = false): Promise<T[]> {
  const rows = await database().prepare('SELECT slug,data,published FROM content_records WHERE kind=?').bind(kind).all<{ slug: string; data: string; published: number }>()
  const values = new Map(fallback.map(item => [item.slug, item]))
  for (const row of rows.results) {
    values.delete(row.slug)
    if (includePrivate || row.published) values.set(row.slug, JSON.parse(row.data) as T)
  }
  return [...values.values()]
}
export async function managedMembers() { return listContent<ManagedMember>('members', devMembers, true) }
export async function managedNews() { return listContent<NewsPost>('news', devNews, true) }
export async function managedDivisions() { return listContent<Division>('divisions', devDivisions, true) }

export async function managedProducts(){return listContent('products',devProducts,true)}
export async function managedCategories(){return listContent('categories',defaultCategories,true)}
export async function managedSponsors(){return listContent('sponsors',devSponsors,true)}
export async function managedBanners(){return listContent('banners',defaultBanners,true)}
export async function managedTeam(){return (await listContent('team',defaults.team,true))[0]}

export async function managedTournaments(){return listContent<import('@/lib/types').Tournament&{published?:boolean}>('tournaments',devTournaments,true)}
