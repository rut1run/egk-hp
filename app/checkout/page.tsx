import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutSummary } from '@/components/shop/checkout-summary'
import { Container, Notice, PageHeader } from '@/components/site/primitives'
import { Field, SubmitButton } from '@/components/site/field'
import { getI18n } from '@/lib/i18n/server'
import { getCartCatalog } from '@/lib/data/catalog'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.checkout.title, robots: { index: false } }
}

export default async function CheckoutPage() {
  const { t, locale } = await getI18n()
  const catalog = await getCartCatalog(locale)
  const methods = ['card', 'paypay', 'konbini', 'bank'] as const

  return (
    <>
      <PageHeader title={t.checkout.title} lead={`${t.checkout.guestNote} ${t.checkout.loginPrompt}`}>
        <Link href="/login?next=/checkout" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">
          {t.nav.login}
        </Link>
      </PageHeader>
      <Container className="grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
        <form className="flex flex-col gap-12" aria-describedby="payment-status">
          <fieldset className="flex flex-col gap-5">
            <legend className="mb-5 w-full border-b-2 border-foreground pb-2 text-lg font-black">{t.checkout.contact}</legend>
            <Field id="email" type="email" autoComplete="email" label={t.checkout.email} required />
            <Field id="phone" type="tel" autoComplete="tel" label={t.checkout.phone} required />
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-5 w-full border-b-2 border-foreground pb-2 text-lg font-black">
              {t.checkout.shippingAddress}
            </legend>
            <Field id="name" autoComplete="name" label={t.checkout.name} required />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="postal" autoComplete="postal-code" inputMode="numeric" label={t.checkout.postalCode} required />
              <Field id="prefecture" autoComplete="address-level1" label={t.checkout.prefecture} required />
            </div>
            <Field id="city" autoComplete="address-line1" label={t.checkout.city} required />
            <Field id="building" autoComplete="address-line2" label={t.checkout.building} />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-5 w-full border-b-2 border-foreground pb-2 text-lg font-black">{t.checkout.payment}</legend>
            {methods.map((m) => (
              <label key={m} className="flex h-14 items-center justify-between border px-4 text-sm font-bold text-muted-foreground">
                <span className="flex items-center gap-3">
                  <input type="radio" name="method" value={m} disabled className="size-4 accent-foreground" />
                  {t.checkout.methods[m]}
                </span>
                <span className="text-xs font-normal">{t.common.notConnected}</span>
              </label>
            ))}
            <div id="payment-status" className="mt-2">
              <Notice tone="warn">{t.checkout.paymentNotConnected}</Notice>
            </div>
          </fieldset>

          <div className="flex flex-col gap-3">
            <p className="text-xs leading-5 text-muted-foreground">
              {t.checkout.agree}{' '}
              <Link href="/terms" className="underline">{t.legal.terms}</Link>
              {' / '}
              <Link href="/commerce" className="underline">{t.legal.commerce}</Link>
            </p>
            <SubmitButton disabled>{t.checkout.placeOrder}</SubmitButton>
          </div>
        </form>

        <aside aria-labelledby="summary" className="self-start border-2 border-foreground p-5 lg:sticky lg:top-24">
          <h2 id="summary" className="mb-4 font-black">
            {t.checkout.summary}
          </h2>
          <CheckoutSummary catalog={catalog} />
        </aside>
      </Container>
    </>
  )
}
