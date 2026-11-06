'use client'

import Link from '@/components/site/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Menu, ShoppingBag, UserRound } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { isActive, legalLinks, primaryLinks } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const items = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/shop', label: t.nav.shop, icon: ShoppingBag },
    { href: '/mypage', label: t.nav.mypage, icon: UserRound },
  ]

  return (
    <>
      <nav
        aria-label={t.nav.bottomNav}
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid h-16 grid-cols-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  <span className={cn('flex h-6 w-10 items-center justify-center', active && 'bg-primary')}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-haspopup="dialog"
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
            >
              <span className="flex h-6 w-10 items-center justify-center">
                <Menu className="size-5" aria-hidden="true" />
              </span>
              {t.nav.menu}
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-none pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="px-5 pt-5">
            <SheetTitle className="font-display text-sm tracking-widest text-muted-foreground">
              {t.nav.menu}
            </SheetTitle>
          </div>
          <nav aria-label={t.nav.mainNav} className="px-5">
            <ul className="divide-y border-y">
              {primaryLinks(t).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                    className="flex items-center justify-between py-4 text-base font-bold"
                  >
                    {l.label}
                    {isActive(pathname, l.href) && (
                      <span aria-hidden="true" className="egg h-3 w-2.5 bg-primary" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 py-5 text-xs text-muted-foreground">
              {legalLinks(t).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
