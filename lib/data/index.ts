import 'server-only'
import { database } from '@/lib/auth/server'
import {feedState} from '@/lib/tournament-validation'
import { listContent, defaultBanners, defaultCategories, defaults } from '@/lib/admin/content'
import type { Availability, LiveFeedState, Product, Tournament } from '@/lib/types'
import {
  devBanners,
  devDivisions,
  devMembers,
  devNews,
  devProducts,
  devSponsors,
  devTeamSocials,
  devTournaments,
} from './dev-data'

/**
 * Single read boundary for the public site. Pages only call these functions, so the
 * development data source can be swapped for the database without touching UI code.
 */

export const isUsingDevData = true

const now = () => Date.now()

export async function getBanners() {
  return (await listContent('banners',defaultBanners)).filter((b) => b.published).sort((a, b) => a.order - b.order)
}

export async function getDivisions() {
  return (await listContent('divisions', devDivisions)).sort((a, b) => a.order - b.order)
}

export async function getMembers() {
  return (await listContent('members', devMembers)).sort((a, b) => a.order - b.order)
}

export async function getMember(slug: string) {
  return (await getMembers()).find((m) => m.slug === slug) ?? null
}

function isVisiblePost(p: { status: string; publishAt: string }) {
  return p.status === 'published' && new Date(p.publishAt).getTime() <= now()
}

export async function getNews(opts: { category?: string; memberSlug?: string; limit?: number } = {}) {
  let posts = (await listContent('news', devNews)).filter(isVisiblePost)
  if (opts.category) posts = posts.filter((p) => p.category === opts.category)
  if (opts.memberSlug) posts = posts.filter((p) => p.memberSlugs.includes(opts.memberSlug!))
  posts.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime()
  })
  return opts.limit ? posts.slice(0, opts.limit) : posts
}

export async function getNewsPost(slug: string) {
  const post = (await listContent('news', devNews)).find((p) => p.slug === slug)
  return post && isVisiblePost(post) ? post : null
}

export async function getTournaments(filter?: 'active' | 'finished') {
  let list = (await listContent('tournaments',devTournaments))
  const updates=await database().prepare("SELECT f.slug,f.data,f.updated_at,(SELECT c.updated_at FROM content_records c WHERE c.kind='tournaments' AND c.slug=f.slug) AS content_updated FROM content_records f WHERE f.kind='tournament-feed'").all<{slug:string;data:string;updated_at:number;content_updated:number|null}>()
  list=list.map(t=>{const row=updates.results.find(f=>f.slug===t.slug);if(!row||(row.content_updated??0)>row.updated_at)return t;const feed=JSON.parse(row.data);return feed.final?{...t,status:'finished' as const,results:feed.results}:{...t,status:'live' as const}})

  if (filter === 'active') list = list.filter((t) => t.status !== 'finished')
  if (filter === 'finished') list = list.filter((t) => t.status === 'finished')
  return list.sort((a, b) =>
    filter === 'finished'
      ? new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      : new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  )
}

export async function getTournament(slug: string) {
  return (await getTournaments()).find((t) => t.slug === slug) ?? null
}

/**
 * Live feed from the dedicated tournament software. The integration contract is decided
 * by the documented ingestion API. A result older than 90 seconds is stale;
 * stored final results are separate from the live connection state.
 */
export async function getLiveFeed(_tournament: Tournament): Promise<LiveFeedState> {
  const row=await database().prepare("SELECT data FROM content_records WHERE kind='tournament-feed' AND slug=?").bind(_tournament.slug).first<{data:string}>()
  return feedState(row?JSON.parse(row.data):null)
}

export async function getProducts(opts: { category?: string; featuredOrNew?: boolean; memberSlug?: string } = {}) {
  let list = (await listContent('products',devProducts)).filter((p) => p.status === 'published')
  if (opts.category) list = list.filter((p) => p.category === opts.category)
  if (opts.featuredOrNew) list = list.filter((p) => p.featured || p.isNew)
  if (opts.memberSlug) list = list.filter((p) => p.memberSlugs.includes(opts.memberSlug!))
  return list
}

export async function getProduct(slug: string) {
  const p = (await getProducts()).find((x) => x.slug === slug)
  return p && p.status === 'published' ? p : null
}

export function getAvailability(p: Product, at = now()): Availability {
  if (p.salesStartAt && at < new Date(p.salesStartAt).getTime()) return 'coming_soon'
  if (p.salesEndAt && at > new Date(p.salesEndAt).getTime()) return 'ended'
  if (p.fulfillment === 'stock' && p.variants.every((v) => (v.stock ?? 0) <= 0)) return 'sold_out'
  return 'on_sale'
}

export async function getSponsors() {
  return (await listContent('sponsors',devSponsors)).filter((s) => s.status === 'published').sort((a, b) => a.order - b.order)
}

export async function getTeamSocials() {
  return (await getTeamIntro())?.socials ?? devTeamSocials
}

export async function getCategories(){return (await listContent('categories',defaultCategories)).sort((a,b)=>a.order-b.order)}
export async function getTeamIntro(){return (await listContent('team',defaults.team))[0]}
