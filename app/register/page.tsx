import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field, SubmitButton } from '@/components/site/field'
import { Notice } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.auth.registerTitle, robots: { index: false } }
}

export default async function RegisterPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const { t,locale } = await getI18n();const params=await searchParams
  return (
    <AuthShell title={t.auth.registerTitle}>
      <form method="post" action="/api/account/register" className="flex flex-col gap-5">
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
          minLength={12} maxLength={128}
          label={t.auth.password}
          hint={locale==='ja'?'12〜128文字で設定してください。':'Use 12–128 characters.'}
          required
        />
        <p className="text-xs leading-5 text-muted-foreground">
          <Link href="/terms" className="underline">{t.legal.terms}</Link>
          {' / '}
          <Link href="/privacy" className="underline">{t.legal.privacy}</Link>
        </p>
        {params.error&&<Notice tone="warn">{locale==='ja'?'入力内容、同意欄、ID・メールの重複を確認してください。':'Check the fields, agreement, and whether the ID or email is already used.'}</Notice>}<label className="flex gap-3 text-sm"><input type="checkbox" name="agree" required/>{locale==='ja'?'利用規約・プライバシーポリシーに同意する':'I agree to the terms and privacy policy.'}</label>
        <SubmitButton>{t.auth.submitRegister}</SubmitButton>
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
