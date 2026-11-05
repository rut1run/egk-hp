import type { Dictionary } from '@/lib/i18n/dictionaries'

export function primaryLinks(t: Dictionary) {
  return [
    { href: '/team', label: t.nav.team },
    { href: '/members', label: t.nav.members },
    { href: '/news', label: t.nav.news },
    { href: '/tournaments', label: t.nav.tournaments },
    { href: '/shop', label: t.nav.shop },
    { href: '/sponsors', label: t.nav.sponsors },
    { href: '/contact', label: t.nav.contact },
  ]
}

export function legalLinks(t: Dictionary) {
  return [
    { href: '/terms', label: t.legal.terms },
    { href: '/privacy', label: t.legal.privacy },
    { href: '/commerce', label: t.legal.commerce },
  ]
}

export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}
