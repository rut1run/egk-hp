import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Noto_Sans_JP } from 'next/font/google'
import { I18nProvider } from '@/components/providers/i18n-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { BottomNav } from '@/components/site/bottom-nav'
import { getI18n } from '@/lib/i18n/server'
import { isUsingDevData } from '@/lib/data'
import './globals.css'

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
    <html lang={locale} className={`${notoSansJp.variable} ${barlow.variable} bg-background`}>
      <body className="min-h-dvh antialiased">
        <I18nProvider locale={locale} t={t}>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:font-bold"
            >
              {t.site.skipToContent}
            </a>
            {isUsingDevData && (
              <p className="bg-foreground px-4 py-1.5 text-center text-[11px] leading-5 text-background">
                {t.site.devNotice}
              </p>
            )}
            <SiteHeader />
            <main id="main" className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
              {children}
              <SiteFooter t={t} />
            </main>
            <BottomNav />
          </CartProvider>
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
