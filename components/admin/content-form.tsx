'use client'
import {useEffect,useRef,useState} from 'react'
export function ContentForm({children}:{children:React.ReactNode}){
 const [ready,setReady]=useState(false),[pending,setPending]=useState(false),submitted=useRef(false)
 useEffect(()=>setReady(true),[])
 return <form method="post" action="/api/admin/content" onSubmit={e=>{if(submitted.current){e.preventDefault();return}submitted.current=true;setPending(true)}}>
 <fieldset disabled={!ready} className={pending?'space-y-6 pointer-events-none opacity-70':'space-y-6'}>{children}</fieldset>
 {!ready&&<p role="status" className="mt-4 text-sm text-muted-foreground">入力フォームを準備しています…</p>}
 {pending&&<p role="status" className="mt-4 text-sm font-bold">保存中です。画面が切り替わるまでお待ちください。</p>}
 <noscript>この編集フォームにはJavaScriptが必要です。</noscript>
 </form>
}
