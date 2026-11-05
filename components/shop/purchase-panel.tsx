'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { MAX_QTY_PER_LINE, useCart } from '@/components/providers/cart-provider'
import { label } from '@/lib/i18n/format'
import type { Availability, Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const LOW_STOCK = 3

export function PurchasePanel({ product, availability }: { product: Product; availability: Availability }) {
  const { t, locale } = useI18n()
  const { add } = useCart()
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    product.options.length === 0 ? {} : {},
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const variant = useMemo(() => {
    if (product.options.some((o) => !selected[o.key])) return undefined
    return product.variants.find((v) => product.options.every((o) => v.options[o.key] === selected[o.key]))
  }, [product, selected])

  const isStock = product.fulfillment === 'stock'
  const variantSoldOut = !!variant && isStock && (variant.stock ?? 0) <= 0
  const maxQty = variant && isStock ? Math.min(MAX_QTY_PER_LINE, variant.stock ?? 0) : MAX_QTY_PER_LINE
  const canBuy = availability === 'on_sale' && !!variant && !variantSoldOut

  function valueSoldOut(optionKey: string, valueId: string) {
    if (!isStock) return false
    const candidates = product.variants.filter(
      (v) =>
        v.options[optionKey] === valueId &&
        Object.entries(selected).every(([k, val]) => k === optionKey || v.options[k] === val),
    )
    return candidates.length > 0 && candidates.every((v) => (v.stock ?? 0) <= 0)
  }

  if (availability !== 'on_sale') {
    const msg =
      availability === 'sold_out' ? t.shop.soldOut : availability === 'coming_soon' ? t.shop.comingSoon : t.shop.ended
    return (
      <div className="flex h-14 items-center justify-center bg-muted text-sm font-bold text-muted-foreground">{msg}</div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {product.options.map((o) => (
        <fieldset key={o.key}>
          <legend className="mb-2 text-sm font-bold">
            {label(o.name, locale)}
            {selected[o.key] && (
              <span className="ml-2 font-normal text-muted-foreground">
                {label(o.values.find((v) => v.id === selected[o.key])!.label, locale)}
              </span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => {
              const soldOut = valueSoldOut(o.key, v.id)
              const active = selected[o.key] === v.id
              return (
                <label
                  key={v.id}
                  className={cn(
                    'relative flex h-11 min-w-12 cursor-pointer items-center justify-center border px-4 text-sm font-bold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                    active ? 'border-foreground bg-foreground text-background' : 'hover:border-foreground',
                    soldOut && 'cursor-not-allowed text-muted-foreground line-through hover:border-border',
                  )}
                >
                  <input
                    type="radio"
                    name={o.key}
                    value={v.id}
                    checked={active}
                    disabled={soldOut}
                    onChange={() => {
                      setSelected((s) => ({ ...s, [o.key]: v.id }))
                      setQty(1)
                      setAdded(false)
                    }}
                    className="sr-only"
                  />
                  {label(v.label, locale)}
                  {soldOut && <span className="sr-only">（{t.shop.soldOut}）</span>}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      {variant && isStock && (
        <p className="text-sm font-bold" role="status">
          {variantSoldOut
            ? t.shop.soldOut
            : (variant.stock ?? 0) <= LOW_STOCK
              ? t.shop.lowStock
              : t.shop.inStock}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <span id="qty-label" className="text-sm font-bold">
          {t.shop.quantity}
        </span>
        <div role="group" aria-labelledby="qty-label" className="flex h-11 w-36 items-center border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex size-11 items-center justify-center disabled:text-muted-foreground"
            aria-label="-1"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <output aria-live="polite" className="flex-1 text-center font-display text-lg font-semibold tabular-nums">
            {qty}
          </output>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty || 1, q + 1))}
            disabled={qty >= (maxQty || 1)}
            className="flex size-11 items-center justify-center disabled:text-muted-foreground"
            aria-label="+1"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={!canBuy}
          onClick={() => {
            if (!variant) return
            add({ productSlug: product.slug, variantId: variant.id, quantity: qty })
            setAdded(true)
          }}
          className="flex h-14 items-center justify-center bg-primary text-base font-black text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          {!variant && product.options.length > 0 ? t.shop.selectOption : t.shop.addToCart}
        </button>
        <div aria-live="polite">
          {added && (
            <p className="flex items-center justify-between gap-3 border px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-bold">
                <Check className="size-4" aria-hidden="true" />
                {t.shop.added}
              </span>
              <Link href="/cart" className="font-bold underline underline-offset-4">
                {t.cart.title}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
