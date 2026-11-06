import type { Metadata } from 'next'
import { Container, Notice, PageHeader } from '@/components/site/primitives'
import { Field, SubmitButton, TextareaField } from '@/components/site/field'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.contact.title }
}

export default async function ContactPage({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}) {
  const { t,locale } = await getI18n();const p=await searchParams
  return (
    <>
      <PageHeader title={t.contact.title} lead={t.contact.lead} />
      <Container className="max-w-2xl py-10 md:py-14">
        <form action="/api/contact" method="post" className="flex flex-col gap-6">
          <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true"/><fieldset>
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
          {p.sent&&<Notice>{locale==='ja'?'お問い合わせを受け付けました。管理者が内容を確認します。':'Your message has been received.'}</Notice>}{p.error&&<Notice tone="warn">{locale==='ja'?'送信できませんでした。入力内容を確認するか、時間をおいて再度お試しください。':'Unable to submit. Check the form or try again later.'}</Notice>}
          <SubmitButton>{t.contact.submit}</SubmitButton>
        </form>
      </Container>
    </>
  )
}
