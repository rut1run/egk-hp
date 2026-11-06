import Link from '@/components/site/link'
import { requireChatGPTUser } from '@/app/chatgpt-auth'
import { bootstrapComplete, setupEmail } from '@/lib/auth/server'
import { SetupForm } from '@/components/admin/setup-form'
export default async function Setup({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const identity=await requireChatGPTUser('/admin/setup')
 if (!setupEmail()||identity.email.toLowerCase()!==setupEmail()) return <p>初回設定はサイト所有者のみ利用できます。</p>
 if(await bootstrapComplete()) return <div className="space-y-5"><h1 className="text-2xl font-black">初回設定は完了しています</h1><Link href="/login?next=/admin" className="underline">会員IDでログイン</Link></div>
 const {error}=await searchParams
 return <div className="mx-auto max-w-lg"><h1 className="mb-5 text-2xl font-black">管理者アカウントの初回設定</h1><p className="mb-7 text-sm leading-7">この確認用サイトの所有者として確認されたメールアドレスを使用します。ログインに使う会員IDとパスワードは、ご自身で設定してください。</p><p className="mb-6 border-y py-4 text-sm">{identity.email}</p>{error&&<p role="alert" className="mb-5 text-destructive">入力内容を確認してください。既に設定済みの場合はログインへ進んでください。</p>}<SetupForm/></div>
}
