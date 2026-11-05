import type { Metadata } from 'next'
import { CartView } from '@/components/shop/cart-view'
import { Container, PageHeader } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'
import { getCartCatalog } from '@/lib/data/catalog'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.cart.title, robots: { index: false } }
}

export default async function CartPage() {
  const { t, locale } = await getI18n()
  const catalog = await getCartCatalog(locale)
  return (
    <>
      <PageHeader title={t.cart.title} />
      <Container className="py-10 md:py-14">
        <CartView catalog={catalog} />
      </Container>
    </>
  )
}
