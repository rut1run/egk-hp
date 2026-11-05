import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field, SubmitButton } from '@/components/site/field'
import { Notice } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.auth.loginTitle, robots: { index: false } }
}

export default async function LoginPage() {
  const { t } = await getI18n()
  return (
    <AuthShell title={t.auth.loginTitle}>
      <form className="flex flex-col gap-5">
        <Field id="userId" autoComplete="username" label={t.auth.userId} required />
        <Field id="password" type="password" autoComplete="current-password" label={t.auth.password} required />
        <Link href="/password-reset" className="self-start text-sm underline underline-offset-4">
          {t.auth.forgot}
        </Link>
        <Notice tone="warn">{t.auth.notConnected}</Notice>
        <SubmitButton disabled>{t.auth.submitLogin}</SubmitButton>
      </form>
      <p className="border-t pt-6 text-sm">
        {t.auth.noAccount}{' '}
        <Link href="/register" className="font-bold underline underline-offset-4">
          {t.auth.registerTitle}
        </Link>
      </p>
    </AuthShell>
  )
}
