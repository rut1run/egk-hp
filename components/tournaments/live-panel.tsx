import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { formatDateTime } from '@/lib/i18n/format'
import type { LiveFeedState, Tournament } from '@/lib/types'
import { FortniteStandings, ValorantMatches } from './results'
import { cn } from '@/lib/utils'

/**
 * Live data is only presented as current when the feed reports "connected".
 * A stale feed keeps its last snapshot but is labelled with its update time and greyed out.
 */
export function LivePanel({
  tournament,
  feed,
  t,
  locale,
}: {
  tournament: Tournament
  feed: LiveFeedState
  t: Dictionary
  locale: Locale
}) {
  const connLabel =
    feed.connection === 'connected'
      ? t.tournaments.live.connected
      : feed.connection === 'stale'
        ? t.tournaments.live.stale
        : t.tournaments.live.disconnected

  return (
    <section aria-labelledby="live" className="border-2 border-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground px-4 py-3 md:px-6">
        <h2 id="live" className="font-black">
          {t.tournaments.live.heading}
        </h2>
        <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <dt className="text-muted-foreground">{t.tournaments.live.connection}</dt>
            <dd className="flex items-center gap-1.5 font-bold">
              <span
                aria-hidden="true"
                className={cn(
                  'size-2 rounded-full',
                  feed.connection === 'connected' && 'bg-success',
                  feed.connection === 'stale' && 'bg-primary',
                  feed.connection === 'not_connected' && 'bg-muted-foreground',
                )}
              />
              {connLabel}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="text-muted-foreground">{t.tournaments.live.lastUpdated}</dt>
            <dd className="font-display font-semibold tabular-nums">
              {feed.connection === 'not_connected' ? '—' : formatDateTime(feed.lastUpdatedAt, locale)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="p-4 md:p-6" aria-live="polite">
        {feed.connection === 'not_connected' && (
          <p className="text-sm leading-7 text-muted-foreground">{t.tournaments.live.notConnectedBody}</p>
        )}
        {feed.connection !== 'not_connected' && (
          <div className={cn(feed.connection === 'stale' && 'opacity-60')}>
            {feed.connection === 'stale' && (
              <p role="status" className="mb-4 bg-accent px-3 py-2 text-sm font-bold">
                {t.tournaments.live.staleBody}
              </p>
            )}
            {feed.results.game === 'fortnite' ? (
              <FortniteStandings standings={feed.results.standings} t={t} />
            ) : (
              <ValorantMatches matches={feed.results.matches} t={t} locale={locale} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
