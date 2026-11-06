import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { Container, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.complete.title, robots: { index: false } }
}

/**
 * Once payments are connected this page looks up the order by a signed, unguessable
 * reference and shows only its number, payment state and next steps.
 */
export default async function CheckoutCompletePage() {
  const { t } = await getI18n()
  return (
    <>
      <PageHeader title={t.complete.notFound} lead={t.complete.notFoundBody} />
      <Container className="py-12">
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="inline-flex h-12 items-center bg-primary px-6 text-sm font-black text-primary-foreground">
            {t.cart.continue}
          </Link>
          <Link href="/" className="inline-flex h-12 items-center border border-foreground px-6 text-sm font-bold">
            {t.common.toHome}
          </Link>
        </div>
      </Container>
    </>
  )
}
