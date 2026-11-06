import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { ProductCard } from '@/components/shop/product-card'
import { Container, EmptyState, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'
import { getAvailability, getProducts, getCategories } from '@/lib/data'
import { label } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'



export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.shop.title }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: raw } = await searchParams
  const categories=await getCategories()
  const category = categories.some(c=>c.slug===raw) ? raw : undefined
  const { t, locale } = await getI18n()
  const products = await getProducts({ category })
  const order = { on_sale: 0, coming_soon: 1, sold_out: 2, ended: 3 } as const
  const sorted = products
    .map((p) => ({ p, a: getAvailability(p) }))
    .sort((x, y) => order[x.a] - order[y.a])

  const tabs = [{ key: undefined, label: t.common.all }, ...categories.map((c) => ({ key: c.slug, label: label(c.name,locale) }))]

  return (
    <>
      <PageHeader title={t.shop.title}>
        <nav aria-label={t.news.category} className="mt-8 -mb-px overflow-x-auto">
          <ul className="flex gap-6 whitespace-nowrap">
            {tabs.map((tab) => {
              const active = tab.key === category
              return (
                <li key={tab.key ?? 'all'}>
                  <Link
                    href={tab.key ? `/shop?category=${tab.key}` : '/shop'}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'inline-block border-b-2 pb-3 text-sm font-bold',
                      active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </PageHeader>
      <Container className="py-10 md:py-14">
        {sorted.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {sorted.map(({ p, a }, i) => (
              <li key={p.slug}>
                <ProductCard product={p} availability={a} t={t} locale={locale} priority={i < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>{t.shop.noProducts}</EmptyState>
        )}
      </Container>
    </>
  )
}
