import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/site/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MemberTile } from '@/components/members/member-avatar'
import { AvailabilityTags } from '@/components/shop/product-card'
import { PurchasePanel } from '@/components/shop/purchase-panel'
import { Container, DevBadge, Notice } from '@/components/site/primitives'
import { JaOnlyNotice } from '@/components/site/ja-only-notice'
import { getI18n } from '@/lib/i18n/server'
import { formatDateTime, formatPrice, pick } from '@/lib/i18n/format'
import { getAvailability, getMembers, getProduct } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getI18n()
  const p = await getProduct(slug)
  if (!p) return { title: 'Not found' }
  const title = pick(p.name, p, locale)
  return { title, openGraph: { title, images: p.images[0] ? [p.images[0].url] : undefined } }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const { t, locale } = await getI18n()
  const p = await getProduct(slug)
  if (!p) notFound()
  const availability = getAvailability(p)
  const members = (await getMembers()).filter((m) => p.memberSlugs.includes(m.slug))
  const description = pick(p.description, p, locale) ?? ''

  return (
    <>
      <Container className="pt-6">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.shop.title}
        </Link>
      </Container>
      <Container className="grid gap-10 py-8 md:grid-cols-2 md:gap-14 md:py-12">
        <div className="flex flex-col gap-3">
          {p.images.map((img, i) => (
            <div key={img.url} className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={img.url || '/placeholder.svg'}
                alt={pick(img.alt, p, locale) ?? ''}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 md:sticky md:top-24 md:self-start">
          <div className="flex flex-col gap-4 border-b-2 border-foreground pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityTags product={p} availability={availability} t={t} />
              {p.isDevData && <DevBadge label={t.common.devData} />}
            </div>
            <h1 className="text-2xl font-black leading-snug text-balance md:text-3xl">{pick(p.name, p, locale)}</h1>
            <p className="font-display text-3xl font-semibold tabular-nums">
              {formatPrice(p.priceJpy, locale)}
              <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">{t.shop.taxIncluded}</span>
            </p>
          </div>

          {(p.salesStartAt || p.salesEndAt) && (
            <dl className="flex gap-4 text-sm">
              <dt className="font-bold">{t.shop.salesPeriod}</dt>
              <dd className="font-display tabular-nums text-muted-foreground">
                {p.salesStartAt && formatDateTime(p.salesStartAt, locale)}
                {' – '}
                {p.salesEndAt && formatDateTime(p.salesEndAt, locale)}
              </dd>
            </dl>
          )}

          {p.fulfillment === 'made_to_order' && <Notice tone="warn">{t.shop.madeToOrderNote}</Notice>}

          <PurchasePanel product={p} availability={availability} />

          <JaOnlyNotice record={p} locale={locale} t={t} />
          <div className="prose-egk border-t pt-6">
            {description.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {members.length > 0 && (
            <section aria-labelledby="pm" className="border-t pt-6">
              <h2 id="pm" className="mb-4 text-sm font-bold text-muted-foreground">
                {t.shop.relatedMembers}
              </h2>
              <ul className="grid grid-cols-4 gap-3">
                {members.map((m) => (
                  <li key={m.slug}>
                    <MemberTile member={m} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </>
  )
}
