import type { Metadata } from 'next'
import Link from '@/components/site/link'
import { AuthShell } from '@/components/site/auth-shell'
import { Field,SubmitButton } from '@/components/site/field'
import { getI18n } from '@/lib/i18n/server'
export const dynamic='force-dynamic'
export async function generateMetadata():Promise<Metadata>{const {t}=await getI18n();return {title:t.auth.loginTitle,robots:{index:false}}}
export default async function Login({searchParams}:{searchParams:Promise<{error?:string;next?:string;notice?:string}>}){
 const {t,locale}=await getI18n(),params=await searchParams
 return <AuthShell title={t.auth.loginTitle}>{params.notice==='setup-complete'&&<p role="status" className="border-l-4 border-primary bg-muted p-4 text-sm leading-7">{locale==='ja'?'管理者アカウントの作成は完了しています。設定した会員IDとパスワードでログインしてください。':'Administrator setup is complete. Sign in with the ID and password you chose.'}</p>}{params.error&&<p role="alert" className="border-l-4 border-destructive p-3 text-sm">{locale==='ja'?(params.error==='rate'?'試行回数が多いため、15分ほど待ってからお試しください。':'会員IDまたはパスワードを確認してください。'):'Check your ID and password, or try again in 15 minutes.'}</p>}<form method="post" action="/api/account/login" className="space-y-5"><input type="hidden" name="next" value={params.next??'/mypage'}/><Field id="userId" label={t.auth.userId} autoComplete="username" required/><Field id="password" label={t.auth.password} type="password" autoComplete="current-password" maxLength={128} required/><SubmitButton>{t.auth.submitLogin}</SubmitButton><Link href="/password-reset" className="block text-sm underline">{t.auth.forgot}</Link></form><div className="space-y-3 border-t pt-5 text-xs leading-6"><p>{locale==='ja'?'登録した会員IDとパスワードでログインしてください。':'Sign in with your account ID and password.'}</p><Link href="/register" className="block underline">{locale==='ja'?'新規会員登録':'Create an account'}</Link><Link href="/admin/setup" className="block underline">{locale==='ja'?'所有者向け：初回管理者設定':'Owner: initial administrator setup'}</Link></div></AuthShell>
}
