import 'server-only'
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
  return devBanners.filter((b) => b.published).sort((a, b) => a.order - b.order)
}

export async function getDivisions() {
  return [...devDivisions].sort((a, b) => a.order - b.order)
}

export async function getMembers() {
  return [...devMembers].sort((a, b) => a.order - b.order)
}

export async function getMember(slug: string) {
  return devMembers.find((m) => m.slug === slug) ?? null
}

function isVisiblePost(p: { status: string; publishAt: string }) {
  return p.status === 'published' && new Date(p.publishAt).getTime() <= now()
}

export async function getNews(opts: { category?: string; memberSlug?: string; limit?: number } = {}) {
  let posts = devNews.filter(isVisiblePost)
  if (opts.category) posts = posts.filter((p) => p.category === opts.category)
  if (opts.memberSlug) posts = posts.filter((p) => p.memberSlugs.includes(opts.memberSlug!))
  posts.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime()
  })
  return opts.limit ? posts.slice(0, opts.limit) : posts
}

export async function getNewsPost(slug: string) {
  const post = devNews.find((p) => p.slug === slug)
  return post && isVisiblePost(post) ? post : null
}

export async function getTournaments(filter?: 'active' | 'finished') {
  let list = [...devTournaments]
  if (filter === 'active') list = list.filter((t) => t.status !== 'finished')
  if (filter === 'finished') list = list.filter((t) => t.status === 'finished')
  return list.sort((a, b) =>
    filter === 'finished'
      ? new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      : new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  )
}

export async function getTournament(slug: string) {
  return devTournaments.find((t) => t.slug === slug) ?? null
}

/**
 * Live feed from the dedicated tournament software. The integration contract is decided
 * when that software is designed, so this always reports "not connected" for now.
 * Never return cached results as "connected".
 */
export async function getLiveFeed(_tournament: Tournament): Promise<LiveFeedState> {
  return { connection: 'not_connected' }
}

export async function getProducts(opts: { category?: string; featuredOrNew?: boolean; memberSlug?: string } = {}) {
  let list = devProducts.filter((p) => p.status === 'published')
  if (opts.category) list = list.filter((p) => p.category === opts.category)
  if (opts.featuredOrNew) list = list.filter((p) => p.featured || p.isNew)
  if (opts.memberSlug) list = list.filter((p) => p.memberSlugs.includes(opts.memberSlug!))
  return list
}

export async function getProduct(slug: string) {
  const p = devProducts.find((x) => x.slug === slug)
  return p && p.status === 'published' ? p : null
}

export function getAvailability(p: Product, at = now()): Availability {
  if (p.salesStartAt && at < new Date(p.salesStartAt).getTime()) return 'coming_soon'
  if (p.salesEndAt && at > new Date(p.salesEndAt).getTime()) return 'ended'
  if (p.fulfillment === 'stock' && p.variants.every((v) => (v.stock ?? 0) <= 0)) return 'sold_out'
  return 'on_sale'
}

export async function getSponsors() {
  return devSponsors.filter((s) => s.status === 'published').sort((a, b) => a.order - b.order)
}

export async function getTeamSocials() {
  return devTeamSocials
}
