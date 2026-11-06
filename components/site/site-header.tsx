'use client'

import Link from '@/components/site/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, UserRound } from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { useCart } from '@/components/providers/cart-provider'
import { Logo } from './logo'
import { LangSwitch } from './lang-switch'
import { isActive, primaryLinks } from '@/lib/nav'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t } = useI18n()
  const pathname = usePathname()
  const { count, ready } = useCart()

  return (
    <header className="site-header fixed inset-x-0 top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 md:h-16 md:px-8">
        <Logo />
        <nav aria-label={t.nav.mainNav} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {primaryLinks(t).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? 'page' : undefined}
                  className={cn(
                    'relative py-5 transition-colors hover:text-foreground',
                    isActive(pathname, l.href)
                      ? 'text-foreground after:absolute after:inset-x-0 after:bottom-3 after:h-0.5 after:bg-primary'
                      : 'text-muted-foreground',
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:gap-3">
          <Link
            href="/mypage"
            className="hidden size-10 items-center justify-center hover:bg-muted lg:inline-flex"
          >
            <UserRound className="size-5" aria-hidden="true" />
            <span className="sr-only">{t.nav.mypage}</span>
          </Link>
          <Link href="/cart" className="relative inline-flex size-10 items-center justify-center hover:bg-muted">
            <ShoppingBag className="size-5" aria-hidden="true" />
            <span className="sr-only">
              {t.nav.cart}
              {ready && count > 0 ? ` (${count})` : ''}
            </span>
            {ready && count > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1 right-0.5 flex min-w-4 items-center justify-center bg-primary px-1 font-display text-[10px] leading-4 font-bold text-primary-foreground"
              >
                {count}
              </span>
            )}
          </Link>
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
          <LangSwitch />
        </div>
      </div>
    </header>
  )
}
