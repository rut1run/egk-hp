import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field, SubmitButton } from '@/components/site/field'
import { Notice } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.auth.resetTitle, robots: { index: false } }
}

export default async function PasswordResetPage() {
  const { t } = await getI18n()
  return (
    <AuthShell title={t.auth.resetTitle} lead={t.auth.resetLead}>
      <form className="flex flex-col gap-5">
        <Field id="email" type="email" autoComplete="email" label={t.auth.email} required />
        <Notice tone="warn">{t.auth.notConnected}</Notice>
        <SubmitButton disabled>{t.auth.submitReset}</SubmitButton>
      </form>
      <Link href="/login" className="border-t pt-6 text-sm font-bold underline underline-offset-4">
        {t.auth.loginTitle}
      </Link>
    </AuthShell>
  )
}
