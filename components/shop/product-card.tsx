import Image from 'next/image'
import Link from '@/components/site/link'
import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { formatPrice, pick } from '@/lib/i18n/format'
import type { Availability, Product } from '@/lib/types'
import { Tag } from '@/components/site/primitives'
import { cn } from '@/lib/utils'

export function AvailabilityTags({
  product,
  availability,
  t,
}: {
  product: Product
  availability: Availability
  t: Dictionary
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {availability === 'sold_out' && <Tag tone="ink">{t.shop.soldOut}</Tag>}
      {availability === 'coming_soon' && <Tag>{t.shop.comingSoon}</Tag>}
      {availability === 'ended' && <Tag>{t.shop.ended}</Tag>}
      {availability === 'on_sale' && product.isNew && <Tag tone="yellow">{t.shop.new}</Tag>}
      {product.preorder && <Tag>{t.shop.preorder}</Tag>}
      {product.fulfillment === 'made_to_order' && <Tag>{t.shop.madeToOrder}</Tag>}
    </div>
  )
}

export function ProductCard({
  product,
  availability,
  t,
  locale,
  priority,
}: {
  product: Product
  availability: Availability
  t: Dictionary
  locale: Locale
  priority?: boolean
}) {
  const image = product.images[0]
  const dimmed = availability === 'sold_out' || availability === 'ended'
  return (
    <Link href={`/shop/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image && (
          <Image
            src={image.url || '/placeholder.svg'}
            alt={pick(image.alt, product, locale) ?? ''}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-[1.03]',
              dimmed && 'opacity-50 grayscale',
            )}
          />
        )}
      </div>
      <AvailabilityTags product={product} availability={availability} t={t} />
      <div className="flex flex-col gap-1">
        <p className="line-clamp-2 text-sm font-bold leading-6 group-hover:underline">
          {pick(product.name, product, locale)}
        </p>
        <p className="font-display text-lg font-semibold tabular-nums">
          {formatPrice(product.priceJpy, locale)}
          <span className="ml-1 font-sans text-[11px] font-normal text-muted-foreground">{t.shop.taxIncluded}</span>
        </p>
      </div>
    </Link>
  )
}
