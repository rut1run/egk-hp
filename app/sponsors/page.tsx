import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/site/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, EmptyState, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'
import { pick } from '@/lib/i18n/format'
import { getSponsors } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.sponsors.title }
}

export default async function SponsorsPage() {
  const { t, locale } = await getI18n()
  const sponsors = await getSponsors()

  return (
    <>
      <PageHeader title={t.sponsors.title} />
      <Container className="py-10 md:py-14">
        {sponsors.length ? (
          <ul className="divide-y border-y">
            {sponsors.map((s) => (
              <li key={s.slug} className="grid gap-6 py-8 md:grid-cols-[16rem_1fr] md:gap-12">
                <div className="relative aspect-[3/2] border">
                  <Image src={s.logoUrl || '/placeholder.svg'} alt={s.name} fill sizes="256px" className="object-contain p-6" />
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-black">{s.name}</h2>
                  {s.description && <p className="leading-7">{pick(s.description, s, locale)}</p>}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 self-start text-sm font-bold underline underline-offset-4">
                      {s.url.replace(/^https?:\/\//, '')}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            action={
              <Link href="/contact" className="font-bold text-foreground underline underline-offset-4">
                {t.nav.contact}
              </Link>
            }
          >
            {t.sponsors.empty} {t.sponsors.inquiry}
          </EmptyState>
        )}
      </Container>
    </>
  )
}
