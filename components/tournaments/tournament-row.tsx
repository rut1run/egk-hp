import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { formatDateTime, pick } from '@/lib/i18n/format'
import type { Tournament } from '@/lib/types'
import { Tag } from '@/components/site/primitives'

export function StatusTag({ status, t }: { status: Tournament['status']; t: Dictionary }) {
  return (
    <Tag tone={status === 'live' ? 'live' : status === 'upcoming' ? 'yellow' : 'default'}>
      {t.tournaments.status[status]}
    </Tag>
  )
}

export function TournamentRows({ items, t, locale }: { items: Tournament[]; t: Dictionary; locale: Locale }) {
  return (
    <ul className="divide-y border-y">
      {items.map((x) => (
        <li key={x.slug}>
          <Link
            href={`/tournaments/${x.slug}`}
            className="group grid gap-3 py-5 md:grid-cols-[9rem_1fr_auto] md:items-center md:gap-8"
          >
            <span className="font-display text-sm font-semibold tracking-widest uppercase">
              {t.tournaments.game[x.game]}
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <StatusTag status={x.status} t={t} />
                <time dateTime={x.startAt} className="font-display text-sm tabular-nums text-muted-foreground">
                  {formatDateTime(x.startAt, locale)}
                </time>
              </div>
              <p className="font-bold leading-7 group-hover:underline">{pick(x.title, x, locale)}</p>
            </div>
            <ArrowRight
              className="hidden size-5 transition-transform group-hover:translate-x-1 md:block"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
