/**
 * DEVELOPMENT DATA ONLY.
 * Every record here is placeholder content for building the UI. None of it describes
 * real people, products, prices, sponsors or results. Replace with database data
 * (see STATUS.md) before launch.
 */
import type { Banner, Division, Member, NewsPost, Product, Sponsor, Tournament } from '@/lib/types'

export const devDivisions: Division[] = [
  { slug: 'fortnite', name: { ja: 'フォートナイト', en: 'Fortnite' }, order: 1 },
  { slug: 'valorant', name: { ja: 'VALORANT', en: 'VALORANT' }, order: 2 },
  { slug: 'streamer', name: { ja: 'ストリーマー', en: 'Streamer' }, order: 3 },
]

const devBio = {
  ja: '【開発用】自己紹介文がここに入ります。管理画面から入力された内容が表示されます。',
  en: '[Dev] The member profile entered in the admin panel appears here.',
}

export const devMembers: Member[] = [
  {
    slug: 'dev-fn-01',
    handle: 'DevFN_01',
    divisionSlug: 'fortnite',
    order: 1,
    bio: devBio,
    achievements: [
      { year: '2026', title: { ja: '【開発用】大会実績の表示例', en: '[Dev] Example achievement entry' } },
    ],
    socials: [{ type: 'x', url: 'https://x.com/', label: 'X' }],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-fn-02',
    handle: 'DevFN_02',
    divisionSlug: 'fortnite',
    order: 2,
    translation: 'none',
    isDevData: true,
  },
  {
    slug: 'dev-vl-01',
    handle: 'DevVL_01',
    divisionSlug: 'valorant',
    order: 1,
    bio: devBio,
    translation: 'reviewed',
    isDevData: true,
  },
  { slug: 'dev-vl-02', handle: 'DevVL_02', divisionSlug: 'valorant', order: 2, translation: 'none', isDevData: true },
  { slug: 'dev-vl-03', handle: 'DevVL_03', divisionSlug: 'valorant', order: 3, translation: 'none', isDevData: true },
  { slug: 'dev-vl-04', handle: 'DevVL_04', divisionSlug: 'valorant', order: 4, translation: 'none', isDevData: true },
  { slug: 'dev-vl-05', handle: 'DevVL_05', divisionSlug: 'valorant', order: 5, translation: 'none', isDevData: true },
  {
    slug: 'dev-st-01',
    handle: 'DevStreamer_01',
    divisionSlug: 'streamer',
    order: 1,
    bio: { ja: '【開発用】英語版が未確認の自己紹介文の表示例です。' },
    socials: [
      { type: 'youtube', url: 'https://www.youtube.com/', label: 'YouTube' },
      { type: 'twitch', url: 'https://www.twitch.tv/', label: 'Twitch' },
    ],
    translation: 'needs_review',
    isDevData: true,
  },
  { slug: 'dev-st-02', handle: 'DevStreamer_02', divisionSlug: 'streamer', order: 2, translation: 'none', isDevData: true },
]

const newsBody = {
  ja: '【開発用】お知らせ本文のサンプルです。管理画面で入力した本文がここに表示されます。\n\n段落は空行で区切られます。動画の埋め込みや高度な装飾は扱いません。',
  en: '[Dev] Sample news body. Text entered in the admin panel appears here.\n\nParagraphs are separated by blank lines.',
}

export const devNews: NewsPost[] = [
  {
    slug: 'dev-important-notice',
    title: { ja: '【開発用】固定表示される重要なお知らせの例', en: '[Dev] Example of a pinned important notice' },
    body: newsBody,
    category: 'info',
    publishAt: '2026-11-01T10:00:00+09:00',
    pinned: true,
    status: 'published',
    memberSlugs: [],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-tournament-news',
    title: { ja: '【開発用】大会出場のお知らせの例', en: '[Dev] Example tournament announcement' },
    body: newsBody,
    category: 'tournament',
    publishAt: '2026-11-03T18:00:00+09:00',
    pinned: false,
    status: 'published',
    memberSlugs: ['dev-fn-01', 'dev-fn-02'],
    imageUrl: '/images/dev/banner-2.png',
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-shop-news',
    title: { ja: '【開発用】新商品発売のお知らせの例', en: '[Dev] Example new item announcement' },
    body: newsBody,
    category: 'shop',
    publishAt: '2026-10-28T12:00:00+09:00',
    pinned: false,
    status: 'published',
    memberSlugs: ['dev-st-01'],
    imageUrl: '/images/dev/product-hoodie.png',
    translation: 'needs_review',
    isDevData: true,
  },
  {
    slug: 'dev-media-news',
    title: { ja: '【開発用】メディア掲載のお知らせの例', en: '[Dev] Example media coverage notice' },
    body: newsBody,
    category: 'media',
    publishAt: '2026-10-15T12:00:00+09:00',
    pinned: false,
    status: 'published',
    memberSlugs: ['dev-vl-01'],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-scheduled-news',
    title: { ja: '【開発用】予約投稿（未来日時のため非表示）', en: '[Dev] Scheduled post (hidden until publish time)' },
    body: newsBody,
    category: 'info',
    publishAt: '2027-01-01T00:00:00+09:00',
    pinned: false,
    status: 'published',
    memberSlugs: [],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-draft-news',
    title: { ja: '【開発用】下書き（非表示）' },
    body: newsBody,
    category: 'info',
    publishAt: '2026-10-01T00:00:00+09:00',
    pinned: false,
    status: 'draft',
    memberSlugs: [],
    translation: 'none',
    isDevData: true,
  },
]

export const devTournaments: Tournament[] = [
  {
    slug: 'dev-fn-live-cup',
    title: { ja: '【開発用】フォートナイト大会（開催中の例）', en: '[Dev] Fortnite tournament (live example)' },
    summary: {
      ja: '【開発用】大会概要のサンプルです。ライブ情報は大会専用ソフトとの連携後に自動反映されます。',
      en: '[Dev] Sample overview. Live data is reflected automatically once the tournament software is connected.',
    },
    game: 'fortnite',
    status: 'live',
    startAt: '2026-11-05T19:00:00+09:00',
    endAt: '2026-11-05T23:00:00+09:00',
    schedule: [
      { at: '2026-11-05T19:00:00+09:00', label: { ja: '第1試合', en: 'Match 1' } },
      { at: '2026-11-05T20:00:00+09:00', label: { ja: '第2試合', en: 'Match 2' } },
      { at: '2026-11-05T21:00:00+09:00', label: { ja: '第3試合', en: 'Match 3' } },
    ],
    streams: [{ platform: 'youtube', url: 'https://www.youtube.com/', label: 'YouTube' }],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-vl-upcoming',
    title: { ja: '【開発用】VALORANT大会（開催予定の例）', en: '[Dev] VALORANT tournament (upcoming example)' },
    summary: { ja: '【開発用】開催予定の大会概要サンプルです。', en: '[Dev] Sample overview for an upcoming tournament.' },
    game: 'valorant',
    status: 'upcoming',
    startAt: '2026-11-21T13:00:00+09:00',
    endAt: '2026-11-22T21:00:00+09:00',
    schedule: [
      { at: '2026-11-21T13:00:00+09:00', label: { ja: 'グループステージ', en: 'Group stage' } },
      { at: '2026-11-22T15:00:00+09:00', label: { ja: 'プレーオフ', en: 'Playoffs' } },
    ],
    streams: [],
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-fn-finished',
    title: { ja: '【開発用】フォートナイト大会（終了の例）', en: '[Dev] Fortnite tournament (finished example)' },
    summary: { ja: '【開発用】終了した大会の表示例です。', en: '[Dev] Example of a finished tournament.' },
    game: 'fortnite',
    status: 'finished',
    startAt: '2026-10-12T19:00:00+09:00',
    endAt: '2026-10-12T23:00:00+09:00',
    schedule: [{ at: '2026-10-12T19:00:00+09:00', label: { ja: '本戦', en: 'Main event' } }],
    streams: [{ platform: 'twitch', url: 'https://www.twitch.tv/', label: 'Twitch' }],
    results: {
      game: 'fortnite',
      recordedAt: '2026-10-12T23:10:00+09:00',
      standings: [
        { rank: 1, team: 'Dev Team A', points: 92, eliminations: 31, matches: 6 },
        { rank: 2, team: 'Dev Team B', points: 85, eliminations: 27, matches: 6 },
        { rank: 3, team: 'Dev Team C', points: 71, eliminations: 22, matches: 6 },
        { rank: 4, team: 'Dev Team D', points: 64, eliminations: 18, matches: 6 },
      ],
    },
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-vl-finished',
    title: { ja: '【開発用】VALORANT大会（終了の例）', en: '[Dev] VALORANT tournament (finished example)' },
    summary: { ja: '【開発用】終了した大会の表示例です。' },
    game: 'valorant',
    status: 'finished',
    startAt: '2026-09-20T13:00:00+09:00',
    endAt: '2026-09-20T22:00:00+09:00',
    schedule: [{ at: '2026-09-20T13:00:00+09:00', label: { ja: 'トーナメント', en: 'Bracket' } }],
    streams: [],
    results: {
      game: 'valorant',
      recordedAt: '2026-09-20T22:15:00+09:00',
      matches: [
        {
          id: 'sf1',
          round: { ja: '準決勝', en: 'Semifinal' },
          teamA: 'Dev Team A',
          teamB: 'Dev Team B',
          maps: [
            { name: 'Map 1', scoreA: 13, scoreB: 9 },
            { name: 'Map 2', scoreA: 11, scoreB: 13 },
            { name: 'Map 3', scoreA: 13, scoreB: 7 },
          ],
          winner: 'A',
        },
        {
          id: 'sf2',
          round: { ja: '準決勝', en: 'Semifinal' },
          teamA: 'Dev Team C',
          teamB: 'Dev Team D',
          maps: [
            { name: 'Map 1', scoreA: 8, scoreB: 13 },
            { name: 'Map 2', scoreA: 10, scoreB: 13 },
          ],
          winner: 'B',
        },
        {
          id: 'f',
          round: { ja: '決勝', en: 'Final' },
          teamA: 'Dev Team A',
          teamB: 'Dev Team D',
          maps: [
            { name: 'Map 1', scoreA: 13, scoreB: 11 },
            { name: 'Map 2', scoreA: 13, scoreB: 10 },
          ],
          winner: 'A',
        },
      ],
    },
    translation: 'needs_review',
    isDevData: true,
  },
]

const sizeOption = {
  key: 'size',
  name: { ja: 'サイズ', en: 'Size' },
  values: ['S', 'M', 'L', 'XL'].map((s) => ({ id: s, label: { ja: s, en: s } })),
}

export const devProducts: Product[] = [
  {
    slug: 'dev-logo-tee',
    name: { ja: '【開発用】ロゴTシャツ', en: '[Dev] Logo T-shirt' },
    description: {
      ja: '【開発用】商品説明のサンプルです。在庫管理される商品の例として、サイズごとに在庫数を持ちます。',
      en: '[Dev] Sample description. As a stock-managed item, each size has its own inventory.',
    },
    images: [{ url: '/images/dev/product-tee.png', alt: { ja: '黒いTシャツ（開発用画像）', en: 'Black T-shirt (dev image)' } }],
    priceJpy: 1000,
    category: 'apparel',
    fulfillment: 'stock',
    options: [sizeOption],
    variants: [
      { id: 'tee-s', options: { size: 'S' }, stock: 0 },
      { id: 'tee-m', options: { size: 'M' }, stock: 12 },
      { id: 'tee-l', options: { size: 'L' }, stock: 3 },
      { id: 'tee-xl', options: { size: 'XL' }, stock: 8 },
    ],
    preorder: false,
    memberSlugs: [],
    featured: true,
    isNew: true,
    status: 'published',
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-hoodie',
    name: { ja: '【開発用】パーカー（受注生産）', en: '[Dev] Hoodie (made to order)' },
    description: {
      ja: '【開発用】受注生産・予約販売の商品例です。販売期間内のご注文を締め切り後にまとめて製造します。',
    },
    images: [{ url: '/images/dev/product-hoodie.png', alt: { ja: '白いパーカー（開発用画像）', en: 'Off-white hoodie (dev image)' } }],
    priceJpy: 2000,
    category: 'apparel',
    fulfillment: 'made_to_order',
    options: [
      sizeOption,
      {
        key: 'color',
        name: { ja: 'カラー', en: 'Color' },
        values: [
          { id: 'white', label: { ja: 'ホワイト', en: 'White' } },
          { id: 'black', label: { ja: 'ブラック', en: 'Black' } },
        ],
      },
    ],
    variants: ['S', 'M', 'L', 'XL'].flatMap((s) =>
      ['white', 'black'].map((c) => ({ id: `hoodie-${s}-${c}`, options: { size: s, color: c }, stock: null })),
    ),
    salesStartAt: '2026-10-28T12:00:00+09:00',
    salesEndAt: '2026-12-15T23:59:00+09:00',
    preorder: true,
    memberSlugs: ['dev-st-01'],
    featured: true,
    isNew: true,
    status: 'published',
    translation: 'needs_review',
    isDevData: true,
  },
  {
    slug: 'dev-cap',
    name: { ja: '【開発用】キャップ', en: '[Dev] Cap' },
    description: { ja: '【開発用】売り切れ商品の表示例です。', en: '[Dev] Example of a sold-out item.' },
    images: [{ url: '/images/dev/product-cap.png', alt: { ja: '黄色いキャップ（開発用画像）', en: 'Yellow cap (dev image)' } }],
    priceJpy: 1500,
    category: 'goods',
    fulfillment: 'stock',
    options: [],
    variants: [{ id: 'cap', options: {}, stock: 0 }],
    preorder: false,
    memberSlugs: [],
    featured: false,
    isNew: false,
    status: 'published',
    translation: 'reviewed',
    isDevData: true,
  },
  {
    slug: 'dev-mousepad',
    name: { ja: '【開発用】マウスパッド', en: '[Dev] Mousepad' },
    description: {
      ja: '【開発用】販売開始前の商品例です。',
      en: '[Dev] Example of an item that is not on sale yet.',
    },
    images: [{ url: '/images/dev/product-mousepad.png', alt: { ja: '黒いマウスパッド（開発用画像）', en: 'Black mousepad (dev image)' } }],
    priceJpy: 3000,
    category: 'gaming',
    fulfillment: 'stock',
    options: [],
    variants: [{ id: 'pad', options: {}, stock: 20 }],
    salesStartAt: '2026-12-01T12:00:00+09:00',
    preorder: false,
    memberSlugs: ['dev-fn-01'],
    featured: true,
    isNew: false,
    status: 'published',
    translation: 'reviewed',
    isDevData: true,
  },
]

/** Intentionally empty: sponsors must never be fabricated. Add real ones via the admin panel. */
export const devSponsors: Sponsor[] = []

export const devBanners: Banner[] = [
  {
    id: 'b1',
    imageUrl: '/images/dev/banner-1.png',
    alt: { ja: '白と黄色の照明のゲーミングルーム（開発用画像）', en: 'Gaming room with white and yellow lighting (dev image)' },
    title: { ja: '【開発用】バナー1：新商品の告知', en: '[Dev] Banner 1: new items' },
    href: '/shop',
    order: 1,
    published: true,
  },
  {
    id: 'b2',
    imageUrl: '/images/dev/banner-2.png',
    alt: { ja: '黄色い照明の大会ステージ（開発用画像）', en: 'Tournament stage with yellow lights (dev image)' },
    title: { ja: '【開発用】バナー2：大会情報', en: '[Dev] Banner 2: tournaments' },
    href: '/tournaments',
    order: 2,
    published: true,
  },
]

/** Official SNS is managed in the admin panel. Left empty until real accounts are provided. */
export const devTeamSocials: { type: string; url: string; label: string }[] = []
