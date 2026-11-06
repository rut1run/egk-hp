import { currentAccount,database } from '@/lib/auth/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Heart } from 'lucide-react'
import { MemberAvatar, MemberTile } from '@/components/members/member-avatar'
import { NewsList } from '@/components/news/news-list'
import { ProductCard } from '@/components/shop/product-card'
import { Container, DevBadge, SectionHeading } from '@/components/site/primitives'
import { JaOnlyNotice } from '@/components/site/ja-only-notice'
import { getI18n } from '@/lib/i18n/server'
import { label, pick } from '@/lib/i18n/format'
import { getAvailability, getDivisions, getMember, getMembers, getNews, getProducts } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const member = await getMember(slug)
  return { title: member?.handle ?? 'Not found' }
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params
  const { t, locale } = await getI18n()
  const member = await getMember(slug)
  if (!member) notFound()

  const [divisions, all, news, products] = await Promise.all([
    getDivisions(),
    getMembers(),
    getNews({ memberSlug: slug, limit: 5 }),
    getProducts({ memberSlug: slug }),
  ])
  const division = divisions.find((d) => d.slug === member.divisionSlug)
  const others = all.filter((m) => m.divisionSlug === member.divisionSlug && m.slug !== member.slug)
  const bio = pick(member.bio, member, locale)
  const account=await currentAccount(),favorite=account?!!await database().prepare('SELECT 1 FROM account_favorites WHERE account_id=? AND member_slug=?').bind(account.id,member.slug).first():false

  return (
    <>
      <Container className="pt-6">
        <Link href="/members" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.members.title}
        </Link>
      </Container>

      <Container className="grid gap-10 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:py-12">
        <div className="relative">
          {member.portraitUrl ? (
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image src={member.portraitUrl || '/placeholder.svg'} alt="" fill priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <MemberAvatar member={member} sizes="(min-width: 768px) 40vw, 100vw" className="w-full" />
          )}
        </div>

        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4 border-b-2 border-foreground pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {division && (
                <span className="bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {label(division.name, locale)}
                </span>
              )}
              {member.isDevData && <DevBadge label={t.common.devData} />}
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">{member.handle}</h1>
            <div>
              {account?<form method="post" action="/api/account/actions"><input type="hidden" name="action" value="favorite"/><input type="hidden" name="member" value={member.slug}/><input type="hidden" name="remove" value={favorite?'1':'0'}/><button className="inline-flex h-11 items-center gap-2 border border-foreground px-5 text-sm font-bold hover:bg-primary"><Heart className="size-4" fill={favorite?'currentColor':'none'}/>{locale==='ja'?(favorite?'推し登録を解除':'推しに登録'):(favorite?'Remove favourite':'Add favourite')}</button></form>:<><Link href={`/login?next=/members/${member.slug}`} className="inline-flex h-11 items-center gap-2 border border-foreground px-5 text-sm font-bold hover:bg-primary"><Heart className="size-4"/>{t.members.oshiAdd}</Link><p className="mt-2 text-xs text-muted-foreground">{t.members.oshiLoginRequired}</p></>}
            </div>
          </header>

          <JaOnlyNotice record={member} locale={locale} t={t} />

          {bio && (
            <section aria-labelledby="bio">
              <h2 id="bio" className="mb-3 text-sm font-bold text-muted-foreground">
                {t.members.bio}
              </h2>
              <div className="prose-egk">
                {bio.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {member.achievements && member.achievements.length > 0 && (
            <section aria-labelledby="achievements">
              <h2 id="achievements" className="mb-3 text-sm font-bold text-muted-foreground">
                {t.members.achievements}
              </h2>
              <dl className="divide-y border-y">
                {member.achievements.map((a, i) => (
                  <div key={i} className="grid grid-cols-[4rem_1fr] gap-4 py-3 text-sm">
                    <dt className="font-display font-semibold tabular-nums">{a.year}</dt>
                    <dd>{pick(a.title, member, locale)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {member.socials && member.socials.length > 0 && (
            <section aria-labelledby="links">
              <h2 id="links" className="mb-3 text-sm font-bold text-muted-foreground">
                {t.members.links}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {member.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 border px-4 text-sm font-bold hover:border-foreground"
                    >
                      {s.label ?? s.type}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>

      <Container className="flex flex-col gap-16 pb-16 md:pb-24">
        {news.length > 0 && (
          <section aria-labelledby="related-news">
            <SectionHeading id="related-news" title={t.members.relatedNews} as="h2" />
            <NewsList posts={news} t={t} locale={locale} />
          </section>
        )}
        {products.length > 0 && (
          <section aria-labelledby="related-products">
            <SectionHeading id="related-products" title={t.members.relatedProducts} as="h2" />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {products.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} availability={getAvailability(p)} t={t} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        )}
        {others.length > 0 && (
          <section aria-labelledby="others">
            <SectionHeading id="others" title={t.members.otherMembers} as="h2" />
            <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6 md:gap-x-5">
              {others.map((m) => (
                <li key={m.slug}>
                  <MemberTile member={m} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  )
}
