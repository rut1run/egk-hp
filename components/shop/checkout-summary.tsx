'use client'

import Link from 'next/link'
import { useI18n } from '@/components/providers/i18n-provider'
import { useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/i18n/format'
import type { CatalogVariant } from '@/lib/data/catalog'

export function CheckoutSummary({ catalog }: { catalog: Record<string, CatalogVariant> }) {
  const { t, locale } = useI18n()
  const { lines, ready } = useCart()

  if (!ready) return <p role="status" className="text-sm text-muted-foreground">{t.common.loading}</p>
  if (lines.length === 0) {
    return (
      <div className="flex flex-col gap-3 text-sm">
        <p>{t.cart.empty}</p>
        <Link href="/shop" className="font-bold underline underline-offset-4">
          {t.cart.continue}
        </Link>
      </div>
    )
  }

  const rows = lines.map((l) => ({ l, item: catalog[l.variantId] })).filter((r) => r.item?.purchasable)
  const subtotal = rows.reduce((s, r) => s + r.item.priceJpy * r.l.quantity, 0)

  return (
    <div className="flex flex-col gap-4">
      <ul className="divide-y text-sm">
        {rows.map(({ l, item }) => (
          <li key={l.variantId} className="flex justify-between gap-4 py-3">
            <span className="min-w-0">
              <span className="block truncate font-bold">{item.name}</span>
              <span className="text-xs text-muted-foreground">
                {item.optionsLabel && `${item.optionsLabel} · `}×{l.quantity}
              </span>
            </span>
            <span className="shrink-0 font-display tabular-nums">{formatPrice(item.priceJpy * l.quantity, locale)}</span>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-2 border-t-2 border-foreground pt-4 text-sm">
        <div className="flex justify-between">
          <dt>{t.cart.subtotal}</dt>
          <dd className="font-display text-xl font-semibold tabular-nums">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <dt>{t.cart.shipping}</dt>
          <dd>{t.cart.shippingTbd}</dd>
        </div>
      </dl>
    </div>
  )
}
