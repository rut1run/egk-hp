import {database} from '@/lib/auth/server'
import {digest} from '@/lib/auth/crypto'
import {AuthShell} from '@/components/site/auth-shell'
import {Field,SubmitButton} from '@/components/site/field'
export const metadata={title:'アカウント確認',robots:{index:false},referrer:'no-referrer'}
export default async function Confirm({searchParams}:{searchParams:Promise<{token?:string;error?:string}>}){
 const p=await searchParams,token=p.token??'',row=/^[a-f0-9]{64}$/.test(token)?await database().prepare('SELECT purpose FROM account_tokens WHERE hash=? AND expires_at>?').bind(await digest(token),Date.now()).first<{purpose:string}>():null
 return <AuthShell title="アカウント確認">{row?<form method="post" action="/api/account/actions" className="space-y-5"><input type="hidden" name="action" value="confirm"/><input type="hidden" name="token" value={token}/>{row.purpose==='reset'?<Field id="password" label="新しいパスワード" type="password" minLength={12} maxLength={128} required autoComplete="new-password" hint="12〜128文字"/>:<p className="text-sm">メールアドレスの本人確認を完了します。</p>}<SubmitButton>{row.purpose==='reset'?'パスワードを更新':'確認する'}</SubmitButton></form>:<p role="alert" className="text-sm">このリンクは無効または期限切れです。再度メールをリクエストしてください。</p>}</AuthShell>
}
