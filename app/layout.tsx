import type { Metadata, Viewport } from 'next'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { BottomNav } from '@/components/site/bottom-nav'
import { getI18n } from '@/lib/i18n/server'
import { isUsingDevData } from '@/lib/data'
import './fonts.css'
import './globals.css'

const siteUrl = process.env.EGK_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://egk-official-team.sia-rut1run.chatgpt.site'

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getI18n()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t.site.name}（${t.site.fullName}）`, template: `%s | ${t.site.name}` },
    description: t.site.description,
    openGraph: {
      type: 'website',
      siteName: `${t.site.name} ${t.site.fullName}`,
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      images: ['/images/og.png'],
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/icon.svg' },
    robots: isUsingDevData ? { index: false, follow: false } : undefined,
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getI18n()

  return (
    <html lang={locale} className="bg-background">
      <body className="min-h-dvh antialiased">
        <I18nProvider locale={locale} t={t}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:font-bold"
            >
              {t.site.skipToContent}
            </a>
            <SiteHeader />
            <div className="site-header-space" aria-hidden="true" />
            {isUsingDevData && (
              <p className="bg-foreground px-4 py-1.5 text-center text-[11px] leading-5 text-background">
                {t.site.devNotice}
              </p>
            )}
            <main id="main" className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
              {children}
              <SiteFooter t={t} />
            </main>
            <BottomNav />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
