import type { Metadata } from 'next'
import Link from 'next/link'
import { NewsList } from '@/components/news/news-list'
import { Container, EmptyState, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'
import { getNews } from '@/lib/data'
import type { NewsCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORIES: NewsCategory[] = ['info', 'tournament', 'shop', 'media']

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.news.title }
}

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: raw } = await searchParams
  const category = CATEGORIES.includes(raw as NewsCategory) ? (raw as NewsCategory) : undefined
  const { t, locale } = await getI18n()
  const posts = await getNews({ category })

  const tabs = [{ key: undefined, label: t.common.all }, ...CATEGORIES.map((c) => ({ key: c, label: t.news.categories[c] }))]

  return (
    <>
      <PageHeader title={t.news.title}>
        <nav aria-label={t.news.category} className="mt-8 -mb-px overflow-x-auto">
          <ul className="flex gap-6 whitespace-nowrap">
            {tabs.map((tab) => {
              const active = tab.key === category
              return (
                <li key={tab.key ?? 'all'}>
                  <Link
                    href={tab.key ? `/news?category=${tab.key}` : '/news'}
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
      <Container className="py-8 md:py-12">
        {posts.length ? (
          <NewsList posts={posts} t={t} locale={locale} withImages />
        ) : (
          <EmptyState>{t.news.noPosts}</EmptyState>
        )}
      </Container>
    </>
  )
}
