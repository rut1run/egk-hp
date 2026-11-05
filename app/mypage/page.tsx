import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Notice, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.mypage.title, robots: { index: false } }
}

/** Becomes a session-protected page once auth is connected; signed-out users are redirected to /login. */
export default async function MyPage() {
  const { t } = await getI18n()
  const sections = Object.values(t.mypage.sections)
  return (
    <>
      <PageHeader title={t.mypage.title} lead={t.mypage.loginRequired}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login?next=/mypage" className="inline-flex h-12 items-center bg-primary px-6 text-sm font-black text-primary-foreground">
            {t.nav.login}
          </Link>
          <Link href="/register" className="inline-flex h-12 items-center border border-foreground px-6 text-sm font-bold">
            {t.auth.registerTitle}
          </Link>
        </div>
      </PageHeader>
      <Container className="flex max-w-3xl flex-col gap-6 py-10 md:py-14">
        <Notice tone="warn">{t.auth.notConnected}</Notice>
        <ul className="divide-y border-y" aria-label={t.mypage.title}>
          {sections.map((s) => (
            <li key={s} className="flex items-center justify-between py-4 text-sm font-bold text-muted-foreground">
              {s}
              <span className="text-xs font-normal">{t.common.notConnected}</span>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
