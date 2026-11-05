'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartLine = { productSlug: string; variantId: string; quantity: number }

type CartContextValue = {
  lines: CartLine[]
  ready: boolean
  count: number
  add: (line: CartLine) => void
  setQuantity: (variantId: string, quantity: number) => void
  remove: (variantId: string) => void
  clear: () => void
}

const STORAGE_KEY = 'egk_cart_v1'
export const MAX_QTY_PER_LINE = 10

const CartContext = createContext<CartContextValue | null>(null)

/**
 * The cart only stores product/variant identifiers and quantities on the device.
 * Prices, stock and totals are always recomputed on the server at checkout.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => l && typeof l.variantId === 'string'))
      }
    } catch {
      // ignore corrupted cart
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, ready])

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId)
      if (existing) {
        return prev.map((l) =>
          l.variantId === line.variantId
            ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, l.quantity + line.quantity) }
            : l,
        )
      }
      return [...prev, { ...line, quantity: Math.min(MAX_QTY_PER_LINE, line.quantity) }]
    })
  }, [])

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    const q = Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(quantity)))
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, quantity: q } : l)))
  }, [])

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(
    () => ({
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, ready, add, setQuantity, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
