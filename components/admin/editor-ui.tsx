import {TranslateButton} from './translate-button'
import Link from '@/components/site/link'
export function EditorHeading({title,kind}:{title:string;kind:string}) {return <div className="mb-7 flex items-center justify-between"><h1 className="text-2xl font-black">{title}</h1><Link className="bg-primary px-5 py-3 text-sm font-bold" href={`/admin/${kind}?edit=new`}>新規登録</Link></div>}
export function Feedback({saved,error}:{saved?:string;error?:string}){return <>{saved&&<p role="status" className="mb-5 border-l-4 border-primary bg-muted p-4 text-sm">保存しました。公開状態と日時に応じてサイトへ反映されます。</p>}{error&&<p role="alert" className="mb-5 border-l-4 border-destructive p-4 text-sm">保存できませんでした。必須項目・画像の説明・URL・日時・在庫数・識別名の重複を確認してください。保存済みの内容は変更されていません。</p>}</>}
export const inputClass='h-12 w-full border bg-background px-3 text-sm'
export function TranslationReview(){return <><TranslateButton/><label className="flex items-start gap-3 border p-4 text-sm leading-6"><input type="checkbox" name="reviewed" className="mt-1"/><span>今回の日本語と英語を確認し、英語版の公開を承認する。<br/><span className="text-xs text-muted-foreground">チェックせず保存すると英語は未確認の下書きとして扱い、日本語を表示します。自動翻訳はサービス接続後に利用できます。</span></span></label></>}
