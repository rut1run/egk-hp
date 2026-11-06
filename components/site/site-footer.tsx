import Link from '@/components/site/link'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { legalLinks, primaryLinks } from '@/lib/nav'
import { Logo } from './logo'

export function SiteFooter({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_2fr] md:px-8 md:py-16">
        <div className="flex flex-col gap-3">
          <Logo className="text-secondary-foreground" />
          <p className="text-sm text-secondary-foreground/70">{t.site.fullName}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {primaryLinks(t).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-3 text-sm text-secondary-foreground/70">
            {legalLinks(t).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-5 font-display text-xs tracking-widest text-secondary-foreground/60 md:px-8">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
