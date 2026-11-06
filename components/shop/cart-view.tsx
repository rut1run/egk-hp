'use client'

import Image from 'next/image'
import Link from '@/components/site/link'
import { Minus, Plus, X } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { MAX_QTY_PER_LINE, useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/i18n/format'
import type { CatalogVariant } from '@/lib/data/catalog'
import { EmptyState } from '@/components/site/primitives'

export function CartView({ catalog }: { catalog: Record<string, CatalogVariant> }) {
  const { t, locale } = useI18n()
  const { lines, ready, setQuantity, remove } = useCart()

  if (!ready) {
    return <p className="py-10 text-sm text-muted-foreground" role="status">{t.common.loading}</p>
  }

  const rows = lines.map((l) => ({ line: l, item: catalog[l.variantId] }))
  if (rows.length === 0) {
    return (
      <EmptyState
        action={
          <Link href="/shop" className="inline-flex h-11 items-center bg-primary px-6 text-sm font-black text-primary-foreground">
            {t.cart.continue}
          </Link>
        }
      >
        {t.cart.empty}
      </EmptyState>
    )
  }

  const subtotal = rows.reduce((sum, r) => (r.item?.purchasable ? sum + r.item.priceJpy * r.line.quantity : sum), 0)
  const blocked = rows.some((r) => !r.item?.purchasable)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
      <ul className="divide-y border-y">
        {rows.map(({ line, item }) => {
          const max = Math.min(MAX_QTY_PER_LINE, item?.maxQty ?? MAX_QTY_PER_LINE)
          return (
            <li key={line.variantId} className="grid grid-cols-[5.5rem_1fr] gap-4 py-5 md:grid-cols-[7rem_1fr]">
              <div className="relative aspect-square bg-muted">
                {item?.imageUrl && <Image src={item.imageUrl || '/placeholder.svg'} alt="" fill sizes="112px" className="object-cover" />}
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/shop/${line.productSlug}`} className="line-clamp-2 font-bold hover:underline">
                      {item?.name ?? line.productSlug}
                    </Link>
                    {item?.optionsLabel && <p className="mt-1 text-xs text-muted-foreground">{item.optionsLabel}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.variantId)}
                    className="flex size-9 shrink-0 items-center justify-center hover:bg-muted"
                  >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">{t.cart.remove}</span>
                  </button>
                </div>
                {item?.purchasable ? (
                  <div className="flex items-center justify-between gap-3">
                    <div role="group" aria-label={t.shop.quantity} className="flex h-10 items-center border">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        className="flex size-10 items-center justify-center disabled:text-muted-foreground"
                        aria-label="-1"
                      >
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>
                      <output className="w-8 text-center font-display font-semibold tabular-nums">{line.quantity}</output>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                        disabled={line.quantity >= max}
                        className="flex size-10 items-center justify-center disabled:text-muted-foreground"
                        aria-label="+1"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-display text-lg font-semibold tabular-nums">
                      {formatPrice(item.priceJpy * line.quantity, locale)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-destructive">{t.cart.unavailable}</p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <aside className="flex flex-col gap-5 self-start border-2 border-foreground p-5 lg:sticky lg:top-24">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt>{t.cart.subtotal}</dt>
            <dd className="font-display text-xl font-semibold tabular-nums">{formatPrice(subtotal, locale)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>{t.cart.shipping}</dt>
            <dd>{t.cart.shippingTbd}</dd>
          </div>
        </dl>
        {blocked ? (
          <span className="flex h-14 items-center justify-center bg-muted text-sm font-bold text-muted-foreground">
            {t.cart.unavailable}
          </span>
        ) : (
          <Link
            href="/checkout"
            className="flex h-14 items-center justify-center bg-primary text-base font-black text-primary-foreground hover:bg-foreground hover:text-background"
          >
            {t.cart.checkout}
          </Link>
        )}
        <p className="text-xs leading-5 text-muted-foreground">{t.cart.priceNote}</p>
      </aside>
    </div>
  )
}
