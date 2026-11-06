import Link from '@/components/site/link'
import { Container } from '@/components/site/primitives'
import { EggMark } from '@/components/site/logo'
import { getI18n } from '@/lib/i18n/server'

export default async function NotFound() {
  const { t } = await getI18n()
  return (
    <Container className="flex flex-col items-start gap-5 py-20 md:py-32">
      <EggMark className="h-12 w-9 ring-1 ring-foreground" />
      <p className="font-display text-6xl font-bold tabular-nums">404</p>
      <h1 className="text-2xl font-black">{t.common.notFoundTitle}</h1>
      <p className="text-sm text-muted-foreground">{t.common.notFoundBody}</p>
      <Link href="/" className="inline-flex h-12 items-center bg-primary px-6 text-sm font-black text-primary-foreground">
        {t.common.toHome}
      </Link>
    </Container>
  )
}
