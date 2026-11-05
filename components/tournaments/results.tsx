import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { label } from '@/lib/i18n/format'
import type { FortniteStanding, ValorantMatch } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FortniteStandings({ standings, t }: { standings: FortniteStanding[]; t: Dictionary }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <caption className="sr-only">{t.tournaments.standings}</caption>
        <thead>
          <tr className="border-b-2 border-foreground text-left text-xs text-muted-foreground">
            <th scope="col" className="w-16 py-3 font-bold">{t.tournaments.table.rank}</th>
            <th scope="col" className="py-3 font-bold">{t.tournaments.table.team}</th>
            <th scope="col" className="py-3 text-right font-bold">{t.tournaments.table.matches}</th>
            <th scope="col" className="py-3 text-right font-bold">{t.tournaments.table.eliminations}</th>
            <th scope="col" className="py-3 text-right font-bold">{t.tournaments.table.points}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {standings.map((s) => (
            <tr key={s.team} className={cn(s.rank === 1 && 'bg-accent')}>
              <td className="py-3 font-display text-lg font-bold tabular-nums">{s.rank}</td>
              <th scope="row" className="py-3 text-left font-bold">{s.team}</th>
              <td className="py-3 text-right font-display tabular-nums">{s.matches}</td>
              <td className="py-3 text-right font-display tabular-nums">{s.eliminations}</td>
              <td className="py-3 text-right font-display text-lg font-bold tabular-nums">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ValorantMatches({ matches, t, locale }: { matches: ValorantMatch[]; t: Dictionary; locale: Locale }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {matches.map((m) => {
        const winsA = m.maps.filter((x) => x.scoreA > x.scoreB).length
        const winsB = m.maps.filter((x) => x.scoreB > x.scoreA).length
        return (
          <li key={m.id} className="border">
            <p className="border-b bg-muted px-4 py-2 text-xs font-bold">{label(m.round, locale)}</p>
            <div className="divide-y">
              {(['A', 'B'] as const).map((side) => (
                <div key={side} className={cn('flex items-center justify-between px-4 py-3', m.winner === side && 'font-bold')}>
                  <span className="flex items-center gap-2">
                    {m.winner === side && (
                      <span aria-hidden="true" className="egg h-3 w-2.5 bg-primary" />
                    )}
                    {side === 'A' ? m.teamA : m.teamB}
                    {m.winner === side && <span className="sr-only">（{t.tournaments.table.winner}）</span>}
                  </span>
                  <span className="font-display text-2xl tabular-nums">{side === 'A' ? winsA : winsB}</span>
                </div>
              ))}
            </div>
            <dl className="flex flex-wrap gap-x-5 gap-y-1 border-t px-4 py-2 text-xs text-muted-foreground">
              {m.maps.map((x) => (
                <div key={x.name} className="flex gap-1.5">
                  <dt>{x.name}</dt>
                  <dd className="font-display tabular-nums">
                    {x.scoreA}-{x.scoreB}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        )
      })}
    </ul>
  )
}
