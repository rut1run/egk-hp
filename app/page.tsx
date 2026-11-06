import Image from 'next/image'
import Link from '@/components/site/link'
import { BannerCarousel } from '@/components/home/banner-carousel'
import { NewsList } from '@/components/news/news-list'
import { TournamentRows } from '@/components/tournaments/tournament-row'
import { ProductCard } from '@/components/shop/product-card'
import { Container, EmptyState, SectionHeading } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { getI18n } from '@/lib/i18n/server'
import {
  getAvailability,
  getBanners,
  getNews,
  getProducts,
  getSponsors,
  getTeamSocials,
  getTournaments,
} from '@/lib/data'

export default async function HomePage() {
  const { t, locale } = await getI18n()
  const [banners, news, tournaments, products, sponsors, socials] = await Promise.all([
    getBanners(),
    getNews({ limit: 5 }),
    getTournaments('active'),
    getProducts({ featuredOrNew: true }),
    getSponsors(),
    getTeamSocials(),
  ])

  return (
    <>
      <h1 className="sr-only">
        {t.site.name} {t.site.fullName}
      </h1>
      <BannerCarousel banners={banners} />

      <Container className="flex flex-col gap-16 py-14 md:gap-24 md:py-20">
        <Reveal>
          <section aria-labelledby="home-news">
            <SectionHeading id="home-news" title={t.home.latestNews} href="/news" linkLabel={t.common.viewAll} />
            {news.length ? <NewsList posts={news} t={t} locale={locale} /> : <EmptyState>{t.common.empty}</EmptyState>}
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="home-tournaments">
            <SectionHeading id="home-tournaments" title={t.home.tournaments} href="/tournaments" linkLabel={t.common.viewAll} />
            {tournaments.length ? (
              <TournamentRows items={tournaments} t={t} locale={locale} />
            ) : (
              <EmptyState>{t.home.noTournaments}</EmptyState>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="home-shop">
            <SectionHeading id="home-shop" title={t.home.newItems} href="/shop" linkLabel={t.common.viewAll} />
            {products.length ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
                {products.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <ProductCard product={p} availability={getAvailability(p)} t={t} locale={locale} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>{t.shop.noProducts}</EmptyState>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="home-sponsors">
            <SectionHeading id="home-sponsors" title={t.home.sponsors} href="/sponsors" linkLabel={t.common.viewAll} />
            {sponsors.length ? (
              <ul className="grid grid-cols-2 border-t border-l sm:grid-cols-3 md:grid-cols-5">
                {sponsors.map((s) => (
                  <li key={s.slug} className="border-r border-b">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex aspect-[3/2] items-center justify-center p-6"
                    >
                      <Image src={s.logoUrl || '/placeholder.svg'} alt={s.name} fill sizes="200px" className="object-contain p-6" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                action={
                  <Link href="/contact" className="font-bold text-foreground underline underline-offset-4">
                    {t.home.sponsorInquiry}
                  </Link>
                }
              >
                {t.home.noSponsors}
              </EmptyState>
            )}
          </section>
        </Reveal>

        <Reveal>
          <section aria-labelledby="home-sns">
            <SectionHeading id="home-sns" title={t.home.sns} />
            {socials.length ? (
              <ul className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center border border-foreground px-5 text-sm font-bold hover:bg-primary"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>{t.home.noSns}</EmptyState>
            )}
          </section>
        </Reveal>
      </Container>
    </>
  )
}
