'use client'
import {useState} from 'react'
import {Field,SubmitButton} from '@/components/site/field'
export function SetupForm(){
 const [pending,setPending]=useState(false)
 return <form method="post" action="/api/account/setup" className="space-y-5" aria-busy={pending} onSubmit={event=>{if(pending){event.preventDefault();return}setPending(true)}}>
 <Field id="userId" label="会員ID" hint="半角英数字・_、3〜20文字（大文字と小文字は区別しません）" pattern="[A-Za-z0-9_]{3,20}" autoComplete="username" required/>
 <Field id="displayName" label="表示名" autoComplete="nickname" maxLength={80} required/>
 <Field id="password" label="パスワード" type="password" hint="12〜128文字" autoComplete="new-password" minLength={12} maxLength={128} required/>
 <Field id="confirm" label="パスワード（確認）" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/>
 <SubmitButton disabled={pending}>{pending?'登録しています…':'管理者アカウントを作成'}</SubmitButton>
 {pending&&<p role="status" className="text-xs leading-6">登録処理中です。画面が切り替わらない場合は、登録したIDとパスワードでログインしてください。</p>}
 </form>
}
