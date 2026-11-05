import type { Metadata } from 'next'
import { Container, Notice, PageHeader } from '@/components/site/primitives'
import { Field, SubmitButton, TextareaField } from '@/components/site/field'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.contact.title }
}

export default async function ContactPage() {
  const { t } = await getI18n()
  return (
    <>
      <PageHeader title={t.contact.title} lead={t.contact.lead} />
      <Container className="max-w-2xl py-10 md:py-14">
        <form className="flex flex-col gap-6">
          <fieldset>
            <legend className="mb-3 text-sm font-bold">
              {t.contact.type}
              <span aria-hidden="true" className="ml-1 text-destructive">*</span>
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { v: 'general', l: t.contact.typeGeneral },
                { v: 'product', l: t.contact.typeProduct },
              ].map((o, i) => (
                <label
                  key={o.v}
                  className="flex h-12 cursor-pointer items-center gap-3 border px-4 text-sm font-bold has-[:checked]:border-foreground has-[:checked]:bg-accent"
                >
                  <input type="radio" name="type" value={o.v} defaultChecked={i === 0} required className="size-4 accent-foreground" />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>
          <Field id="name" autoComplete="name" label={t.checkout.name} required />
          <Field id="email" type="email" autoComplete="email" label={t.checkout.email} required />
          <Field id="order" label={t.contact.orderNumber} />
          <Field id="subject" label={t.contact.subject} required />
          <TextareaField id="message" label={t.contact.message} required />
          <p className="text-xs leading-5 text-muted-foreground">{t.contact.note}</p>
          <Notice tone="warn">{t.contact.notConnected}</Notice>
          <SubmitButton disabled>{t.contact.submit}</SubmitButton>
        </form>
      </Container>
    </>
  )
}
