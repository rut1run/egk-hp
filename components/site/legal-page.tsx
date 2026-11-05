import type { Dictionary, Locale } from '@/lib/i18n/dictionaries'
import { Container, Notice, PageHeader } from './primitives'

export type LegalSection = { heading: string; body: string[] }

const DRAFT_NOTICE = {
  ja: 'この文書は公開前のドラフトです。【要記入】の項目は運営者が記入し、公開前に専門家の確認を受けてください。',
  en: 'This document is a pre-launch draft, currently available in Japanese only. Items marked 【要記入】 must be completed by the operator and reviewed by a professional before launch.',
}

export function LegalPage({
  title,
  sections,
  locale,
}: {
  title: string
  sections: LegalSection[]
  locale: Locale
  t: Dictionary
}) {
  return (
    <>
      <PageHeader title={title} />
      <Container className="flex max-w-3xl flex-col gap-10 py-10 md:py-14">
        <Notice tone="warn">{DRAFT_NOTICE[locale]}</Notice>
        <div lang="ja" className="flex flex-col gap-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-3 border-b pb-2 text-lg font-black">{s.heading}</h2>
              <div className="prose-egk text-muted-foreground">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  )
}
