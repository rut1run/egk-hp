import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container, PageHeader, SectionHeading } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { getI18n } from '@/lib/i18n/server'
import { label } from '@/lib/i18n/format'
import { getDivisions, getMembers } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.team.title }
}

export default async function TeamPage() {
  const { t, locale } = await getI18n()
  const [divisions, members] = await Promise.all([getDivisions(), getMembers()])

  return (
    <>
      <PageHeader title={t.team.title} />
      <Container className="flex flex-col gap-16 py-12 md:py-20">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            <p className="font-display text-5xl font-bold leading-none tracking-tight md:text-7xl">
              EGK
              <span className="mt-2 block text-xl font-semibold tracking-widest text-muted-foreground md:text-2xl">
                EggKingdom
              </span>
            </p>
            <p className="border-l-4 border-primary pl-5 text-sm leading-8 text-muted-foreground md:text-base">
              {t.team.aboutPlaceholder}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <section aria-labelledby="divisions">
            <div id="divisions">
              <SectionHeading title={t.team.divisions} />
            </div>
            <ul className="divide-y border-b">
              {divisions.map((d, i) => {
                const n = members.filter((m) => m.divisionSlug === d.slug).length
                return (
                  <li key={d.slug}>
                    <Link
                      href={`/members#${d.slug}`}
                      className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6"
                    >
                      <span className="font-display text-2xl font-bold tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xl font-black md:text-2xl">{label(d.name, locale)}</span>
                      <span className="flex items-center gap-3 text-sm text-muted-foreground">
                        {n} {t.team.memberCount}
                        <ArrowRight className="size-4 text-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        </Reveal>
      </Container>
    </>
  )
}
