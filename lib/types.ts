export type Localized = { ja: string; en?: string }

/** reviewed: EN approved by admin / needs_review: JP changed or machine draft / none: no EN */
export type TranslationStatus = 'reviewed' | 'needs_review' | 'none'
export type Translatable = { translation: TranslationStatus }

export type PublishStatus = 'draft' | 'published' | 'private'

export type Division = {
  slug: string
  name: Localized
  order: number
}

export type SocialType = 'x' | 'youtube' | 'twitch' | 'tiktok' | 'instagram' | 'other'
export type SocialLink = { type: SocialType; url: string; label?: string }

export type Member = Translatable & {
  slug: string
  handle: string
  divisionSlug: string
  order: number
  iconUrl?: string
  portraitUrl?: string
  bio?: Localized
  achievements?: { year: string; title: Localized }[]
  socials?: SocialLink[]
  isDevData?: boolean
}

export type NewsCategory = 'info' | 'tournament' | 'shop' | 'media'

export type NewsPost = Translatable & {
  slug: string
  title: Localized
  body: Localized
  category: NewsCategory
  publishAt: string
  pinned: boolean
  status: PublishStatus
  memberSlugs: string[]
  imageUrl?: string
  isDevData?: boolean
}

export type Game = 'fortnite' | 'valorant'
export type TournamentStatus = 'upcoming' | 'live' | 'finished'

export type FortniteStanding = {
  rank: number
  team: string
  points: number
  eliminations: number
  matches: number
}

export type ValorantMatch = {
  id: string
  round: Localized
  teamA: string
  teamB: string
  maps: { name: string; scoreA: number; scoreB: number }[]
  winner?: 'A' | 'B'
}

export type TournamentResults =
  | { game: 'fortnite'; recordedAt: string; standings: FortniteStanding[] }
  | { game: 'valorant'; recordedAt: string; matches: ValorantMatch[] }

export type StreamLink = { platform: 'youtube' | 'twitch' | 'other'; url: string; label: string }

export type Tournament = Translatable & {
  slug: string
  title: Localized
  summary: Localized
  game: Game
  status: TournamentStatus
  startAt: string
  endAt: string
  schedule: { at: string; label: Localized }[]
  streams: StreamLink[]
  /** Finalized results stored in our DB. Live data comes from the tournament software feed. */
  results?: TournamentResults
  isDevData?: boolean
}

export type LiveFeedState =
  | { connection: 'not_connected' }
  | { connection: 'connected'; lastUpdatedAt: string; results: TournamentResults }
  | { connection: 'stale'; lastUpdatedAt: string; results: TournamentResults }

export type ProductCategory = 'apparel' | 'goods' | 'gaming'
export type Fulfillment = 'stock' | 'made_to_order'

export type ProductOption = {
  key: string
  name: Localized
  values: { id: string; label: Localized }[]
}

export type ProductVariant = {
  id: string
  options: Record<string, string>
  /** null = not stock-managed (made to order) */
  stock: number | null
}

export type Product = Translatable & {
  slug: string
  name: Localized
  description: Localized
  images: { url: string; alt: Localized }[]
  priceJpy: number
  category: ProductCategory
  fulfillment: Fulfillment
  options: ProductOption[]
  variants: ProductVariant[]
  salesStartAt?: string
  salesEndAt?: string
  preorder: boolean
  memberSlugs: string[]
  featured: boolean
  isNew: boolean
  status: PublishStatus
  isDevData?: boolean
}

export type Availability = 'on_sale' | 'sold_out' | 'coming_soon' | 'ended'

export type Sponsor = Translatable & {
  slug: string
  name: string
  logoUrl: string
  description?: Localized
  url?: string
  order: number
  status: PublishStatus
}

export type Banner = {
  id: string
  imageUrl: string
  alt: Localized
  title: Localized
  href: string
  order: number
  published: boolean
}
