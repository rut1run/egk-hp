import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { MemberTile } from '@/components/members/member-avatar'
import { Container, DevBadge, Tag } from '@/components/site/primitives'
import { JaOnlyNotice } from '@/components/site/ja-only-notice'
import { getI18n } from '@/lib/i18n/server'
import { formatDate, pick } from '@/lib/i18n/format'
import { getMembers, getNewsPost } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale } = await getI18n()
  const post = await getNewsPost(slug)
  if (!post) return { title: 'Not found' }
  const title = pick(post.title, post, locale)
  return { title, openGraph: { title, images: post.imageUrl ? [post.imageUrl] : undefined } }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const { t, locale } = await getI18n()
  const post = await getNewsPost(slug)
  if (!post) notFound()
  const members = (await getMembers()).filter((m) => post.memberSlugs.includes(m.slug))
  const body = pick(post.body, post, locale) ?? ''

  return (
    <article>
      <Container className="max-w-3xl pt-6">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.news.title}
        </Link>
        <header className="flex flex-col gap-4 border-b-2 border-foreground py-8">
          <div className="flex flex-wrap items-center gap-3">
            <time dateTime={post.publishAt} className="font-display text-sm font-semibold tabular-nums">
              {formatDate(post.publishAt, locale)}
            </time>
            <Tag>{t.news.categories[post.category]}</Tag>
            {post.pinned && <Tag tone="yellow">{t.common.pinned}</Tag>}
            {post.isDevData && <DevBadge label={t.common.devData} />}
          </div>
          <h1 className="text-2xl font-black leading-snug text-balance md:text-4xl">{pick(post.title, post, locale)}</h1>
        </header>
      </Container>

      <Container className="flex max-w-3xl flex-col gap-8 py-8 md:py-12">
        <JaOnlyNotice record={post} locale={locale} t={t} />
        {post.imageUrl && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <Image src={post.imageUrl || '/placeholder.svg'} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-egk">
          {body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {members.length > 0 && (
          <section aria-labelledby="related-members" className="border-t pt-8">
            <h2 id="related-members" className="mb-4 text-sm font-bold text-muted-foreground">
              {t.news.relatedMembers}
            </h2>
            <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {members.map((m) => (
                <li key={m.slug}>
                  <MemberTile member={m} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </article>
  )
}
