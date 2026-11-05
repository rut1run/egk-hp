import type { Metadata } from 'next'
import { MemberTile } from '@/components/members/member-avatar'
import { Container, EmptyState, PageHeader } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { getI18n } from '@/lib/i18n/server'
import { label } from '@/lib/i18n/format'
import { getDivisions, getMembers } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.members.title }
}

export default async function MembersPage() {
  const { t, locale } = await getI18n()
  const [divisions, members] = await Promise.all([getDivisions(), getMembers()])

  return (
    <>
      <PageHeader title={t.members.title}>
        <nav aria-label={t.team.divisions} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {divisions.map((d) => (
              <li key={d.slug}>
                <a href={`#${d.slug}`} className="inline-flex h-9 items-center border px-4 text-sm font-bold hover:border-foreground">
                  {label(d.name, locale)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Container className="flex flex-col gap-16 py-12 md:py-16">
        {divisions.map((d) => {
          const list = members.filter((m) => m.divisionSlug === d.slug)
          return (
            <Reveal key={d.slug}>
              <section id={d.slug} aria-labelledby={`${d.slug}-h`}>
                <h2
                  id={`${d.slug}-h`}
                  className="mb-6 flex items-baseline gap-3 border-b-2 border-foreground pb-3 text-xl font-black md:text-2xl"
                >
                  {label(d.name, locale)}
                  <span className="font-display text-sm font-semibold text-muted-foreground tabular-nums">
                    {list.length}
                  </span>
                </h2>
                {list.length ? (
                  <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 md:gap-x-5">
                    {list.map((m) => (
                      <li key={m.slug}>
                        <MemberTile member={m} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState>{t.common.empty}</EmptyState>
                )}
              </section>
            </Reveal>
          )
        })}
      </Container>
    </>
  )
}
