import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field, SubmitButton } from '@/components/site/field'
import { Notice } from '@/components/site/primitives'
import { getI18n } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n()
  return { title: t.auth.resetTitle, robots: { index: false } }
}

export default async function PasswordResetPage({searchParams}:{searchParams:Promise<{sent?:string;error?:string}>}) {
  const { t,locale } = await getI18n();const p=await searchParams
  return (
    <AuthShell title={t.auth.resetTitle} lead={t.auth.resetLead}>
      <form method="post" action="/api/account/actions" className="flex flex-col gap-5">
        <input type="hidden" name="action" value="reset-request"/><Field id="email" type="email" autoComplete="email" label={t.auth.email} required />
        {p.sent&&<Notice>{locale==='ja'?'該当する登録がある場合、再設定メールを送信します。':'If the account exists, a reset email will be sent.'}</Notice>}{p.error&&<Notice tone="warn">{locale==='ja'?'メール送信サービスが未接続です。管理者が接続するまで再設定メールは送れません。':'Email delivery is not configured yet.'}</Notice>}
        <SubmitButton>{t.auth.submitReset}</SubmitButton>
      </form>
      <Link href="/login" className="border-t pt-6 text-sm font-bold underline underline-offset-4">
        {t.auth.loginTitle}
      </Link>
    </AuthShell>
  )
}
