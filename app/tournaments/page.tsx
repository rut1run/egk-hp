import type { Metadata } from 'next'
import { TournamentRows } from '@/components/tournaments/tournament-row'
import { Container, EmptyState, PageHeader, SectionHeading } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'
import { getTournaments } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.tournaments.title }
}

export default async function TournamentsPage() {
  const { t, locale } = await getI18n()
  const [active, finished] = await Promise.all([getTournaments('active'), getTournaments('finished')])

  return (
    <>
      <PageHeader title={t.tournaments.title} />
      <Container className="flex flex-col gap-16 py-12 md:py-16">
        <section aria-label={t.tournaments.sectionUpcoming}>
          <SectionHeading title={t.tournaments.sectionUpcoming} />
          {active.length ? (
            <TournamentRows items={active} t={t} locale={locale} />
          ) : (
            <EmptyState>{t.home.noTournaments}</EmptyState>
          )}
        </section>
        <section aria-label={t.tournaments.sectionFinished}>
          <SectionHeading title={t.tournaments.sectionFinished} />
          {finished.length ? (
            <TournamentRows items={finished} t={t} locale={locale} />
          ) : (
            <EmptyState>{t.common.empty}</EmptyState>
          )}
        </section>
      </Container>
    </>
  )
}
