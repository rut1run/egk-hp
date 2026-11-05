import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field, SubmitButton } from '@/components/site/field'
import { Notice } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.auth.registerTitle, robots: { index: false } }
}

export default async function RegisterPage() {
  const { t } = await getI18n()
  return (
    <AuthShell title={t.auth.registerTitle}>
      <form className="flex flex-col gap-5">
        <Field
          id="userId"
          autoComplete="username"
          label={t.auth.userId}
          hint={t.auth.userIdHint}
          pattern="[A-Za-z0-9_]{3,20}"
          required
        />
        <Field id="displayName" autoComplete="nickname" label={t.auth.displayName} hint={t.auth.displayNameHint} required />
        <Field id="email" type="email" autoComplete="email" label={t.auth.email} hint={t.auth.emailHint} required />
        <Field
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          label={t.auth.password}
          hint={t.auth.passwordHint}
          required
        />
        <p className="text-xs leading-5 text-muted-foreground">
          <Link href="/terms" className="underline">{t.legal.terms}</Link>
          {' / '}
          <Link href="/privacy" className="underline">{t.legal.privacy}</Link>
        </p>
        <Notice tone="warn">{t.auth.notConnected}</Notice>
        <SubmitButton disabled>{t.auth.submitRegister}</SubmitButton>
      </form>
      <p className="border-t pt-6 text-sm">
        {t.auth.hasAccount}{' '}
        <Link href="/login" className="font-bold underline underline-offset-4">
          {t.auth.loginTitle}
        </Link>
      </p>
    </AuthShell>
  )
}
