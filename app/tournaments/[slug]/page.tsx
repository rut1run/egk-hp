import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { LivePanel } from '@/components/tournaments/live-panel'
import { FortniteStandings, ValorantMatches } from '@/components/tournaments/results'
import { StatusTag } from '@/components/tournaments/tournament-row'
import { Container, DevBadge, EmptyState, SectionHeading } from '@/components/site/primitives'
import { JaOnlyNotice } from '@/components/site/ja-only-notice'
import { getI18n } from '@/lib/i18n/server'
import { formatDateTime, label, pick } from '@/lib/i18n/format'
import { getLiveFeed, getTournament } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getI18n()
  const x = await getTournament(slug)
  return { title: x ? pick(x.title, x, locale) : 'Not found' }
}

export default async function TournamentDetailPage({ params }: Props) {
  const { slug } = await params
  const { t, locale } = await getI18n()
  const x = await getTournament(slug)
  if (!x) notFound()
  const feed = x.status === 'live' ? await getLiveFeed(x) : null
  const resultsHeading = x.game === 'fortnite' ? t.tournaments.standings : t.tournaments.bracket

  return (
    <>
      <div className="border-b">
        <Container className="pt-6 pb-10 md:pb-14">
          <Link href="/tournaments" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.tournaments.title}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="font-display text-sm font-semibold tracking-widest uppercase">{t.tournaments.game[x.game]}</span>
            <StatusTag status={x.status} t={t} />
            {x.isDevData && <DevBadge label={t.common.devData} />}
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-balance md:text-5xl">{pick(x.title, x, locale)}</h1>
          <p className="mt-4 font-display text-base tabular-nums text-muted-foreground">
            <time dateTime={x.startAt}>{formatDateTime(x.startAt, locale)}</time>
            {' – '}
            <time dateTime={x.endAt}>{formatDateTime(x.endAt, locale)}</time>
          </p>
        </Container>
      </div>

      <Container className="grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-12">
          <JaOnlyNotice record={x} locale={locale} t={t} />

          {feed && <LivePanel tournament={x} feed={feed} t={t} locale={locale} />}

          {x.status !== 'live' && (
            <section aria-label={resultsHeading}>
              <SectionHeading title={resultsHeading} />
              {x.results ? (
                <>
                  <p className="mb-4 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{t.tournaments.finalized}</span>
                    <span>
                      {t.tournaments.recordedAt}{' '}
                      <time dateTime={x.results.recordedAt} className="font-display tabular-nums">
                        {formatDateTime(x.results.recordedAt, locale)}
                      </time>
                    </span>
                  </p>
                  {x.results.game === 'fortnite' ? (
                    <FortniteStandings standings={x.results.standings} t={t} />
                  ) : (
                    <ValorantMatches matches={x.results.matches} t={t} locale={locale} />
                  )}
                </>
              ) : (
                <EmptyState>{t.tournaments.beforeStart}</EmptyState>
              )}
            </section>
          )}

          <section aria-label={t.tournaments.overview}>
            <SectionHeading title={t.tournaments.overview} />
            <p className="leading-8">{pick(x.summary, x, locale)}</p>
          </section>
        </div>

        <aside className="flex flex-col gap-10">
          <section aria-labelledby="schedule">
            <h2 id="schedule" className="mb-3 border-b-2 border-foreground pb-2 font-black">
              {t.tournaments.schedule}
            </h2>
            <ol className="divide-y">
              {x.schedule.map((s) => (
                <li key={s.at} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <span className="font-bold">{label(s.label, locale)}</span>
                  <time dateTime={s.at} className="font-display tabular-nums text-muted-foreground">
                    {formatDateTime(s.at, locale)}
                  </time>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="streams">
            <h2 id="streams" className="mb-3 border-b-2 border-foreground pb-2 font-black">
              {t.tournaments.streams}
            </h2>
            {x.streams.length ? (
              <ul className="flex flex-col gap-2">
                {x.streams.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center justify-between border px-4 text-sm font-bold hover:border-foreground hover:bg-primary"
                    >
                      {s.label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t.tournaments.noStreams}</p>
            )}
          </section>
        </aside>
      </Container>
    </>
  )
}
