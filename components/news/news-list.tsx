import Image from 'next/image'
import Link from 'next/link'
import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { formatDate, pick } from '@/lib/i18n/format'
import type { NewsPost } from '@/lib/types'
import { Tag } from '@/components/site/primitives'

export function NewsList({
  posts,
  t,
  locale,
  withImages = false,
}: {
  posts: NewsPost[]
  t: Dictionary
  locale: Locale
  withImages?: boolean
}) {
  return (
    <ul className="divide-y border-b">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/news/${p.slug}`} className="group flex gap-4 py-5 md:items-center md:gap-6">
            {withImages && (
              <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-muted md:w-40">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span aria-hidden="true" className="egg h-8 w-6 bg-primary/70" />
                  </div>
                )}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-6">
              <div className="flex shrink-0 items-center gap-3">
                <time dateTime={p.publishAt} className="font-display text-sm font-semibold tracking-wide tabular-nums">
                  {formatDate(p.publishAt, locale)}
                </time>
                <Tag>{t.news.categories[p.category]}</Tag>
                {p.pinned && <Tag tone="yellow">{t.common.pinned}</Tag>}
              </div>
              <p className="line-clamp-2 font-bold leading-7 group-hover:underline">{pick(p.title, p, locale)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
