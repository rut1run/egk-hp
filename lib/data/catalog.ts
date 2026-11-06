import 'server-only'
import type { Locale } from '@/lib/i18n/dictionaries'
import { label, pick } from '@/lib/i18n/format'
import { getAvailability, getProducts } from './index'

export type CatalogVariant = {
  productSlug: string
  variantId: string
  name: string
  optionsLabel: string
  imageUrl?: string
  priceJpy: number
  purchasable: boolean
  maxQty: number | null
}

/** Display-only snapshot for the cart UI. Checkout must recompute everything server-side. */
export async function getCartCatalog(locale: Locale): Promise<Record<string, CatalogVariant>> {
  const products = await getProducts()
  const out: Record<string, CatalogVariant> = {}
  for (const p of products) {
    const availability = getAvailability(p)
    for (const v of p.variants) {
      const optionsLabel = p.options
        .map((o) => {
          const val = o.values.find((x) => x.id === v.options[o.key])
          return val ? `${pick(o.name, p, locale)}: ${pick(val.label, p, locale)}` : null
        })
        .filter(Boolean)
        .join(' / ')
      const inStock = p.fulfillment === 'made_to_order' || (v.stock ?? 0) > 0
      out[v.id] = {
        productSlug: p.slug,
        variantId: v.id,
        name: pick(p.name, p, locale) ?? '',
        optionsLabel,
        imageUrl: p.images[0]?.url,
        priceJpy: p.priceJpy,
        purchasable: availability === 'on_sale' && inStock,
        maxQty: p.fulfillment === 'stock' ? (v.stock ?? 0) : null,
      }
    }
  }
  return out
}
