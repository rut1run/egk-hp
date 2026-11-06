'use client'
import { useState } from 'react'
import type { ProductOption,ProductVariant } from '@/lib/types'
import { inputClass } from './editor-ui'
const identity=()=>crypto.randomUUID()
const keyFor=(options:Record<string,string>)=>JSON.stringify(Object.entries(options).sort(([a],[b])=>a.localeCompare(b)))
export function VariantEditor({initialOptions=[],initialVariants=[]}:{initialOptions?:ProductOption[];initialVariants?:ProductVariant[]}){
 const [options,setOptions]=useState(initialOptions)
 const [saved,setSaved]=useState<Record<string,ProductVariant>>(()=>Object.fromEntries(initialVariants.map(v=>[keyFor(v.options),v])))
 const combinations=options.reduce<Record<string,string>[]>((all,o)=>all.flatMap(row=>o.values.map(v=>({...row,[o.key]:v.id}))),[{}])
 const tooMany=combinations.length>100
 const variants=combinations.slice(0,100).map(values=>saved[keyFor(values)]??{id:'',options:values,stock:0})
 // Materialize identifiers only for new combinations and preserve existing cart identifiers.
 const missing=variants.filter(v=>!v.id)
 if(missing.length){const next={...saved};for(const v of missing)next[keyFor(v.options)]={...v,id:`variant-${identity()}`};setSaved(next)}
 const update=(i:number,o:ProductOption)=>setOptions(options.map((x,n)=>n===i?o:x))
 return <fieldset className="space-y-5 border-y py-6"><legend className="text-lg font-black">サイズ・色・在庫</legend><p className="text-xs leading-6 text-muted-foreground">選択項目は3つまで、組み合わせは100種類まで。選択項目がなければ単品です。受注生産を選ぶと在庫数は使用しません。保存だけでは決済・注文は開始されません。</p>
 <input type="hidden" name="variantData" value={JSON.stringify({options,variants:variants.map(v=>saved[keyFor(v.options)]??v)})}/>
 {options.map((o,i)=><div className="space-y-3 border p-4" key={o.key}><div className="flex gap-3"><input aria-label={`選択項目${i+1}の名前（日本語）`} className={inputClass} placeholder="サイズ・色など" value={o.name.ja} required onChange={e=>update(i,{...o,name:{...o.name,ja:e.target.value}})}/><input aria-label={`選択項目${i+1}の名前（英語）`} className={inputClass} placeholder="Size / Color" value={o.name.en??''} onChange={e=>update(i,{...o,name:{...o.name,en:e.target.value}})}/><button type="button" className="shrink-0 text-xs underline" onClick={()=>setOptions(options.filter((_,n)=>n!==i))}>項目を削除</button></div>
 {o.values.map((v,j)=><div className="flex gap-3" key={v.id}><input aria-label={`項目${i+1}の値${j+1}（日本語）`} className={inputClass} placeholder="M・白など" value={v.label.ja} required onChange={e=>update(i,{...o,values:o.values.map((x,n)=>n===j?{...x,label:{...x.label,ja:e.target.value}}:x)})}/><input aria-label={`項目${i+1}の値${j+1}（英語）`} className={inputClass} placeholder="M / White" value={v.label.en??''} onChange={e=>update(i,{...o,values:o.values.map((x,n)=>n===j?{...x,label:{...x.label,en:e.target.value}}:x)})}/><button type="button" className="shrink-0 text-xs underline" disabled={o.values.length===1} onClick={()=>update(i,{...o,values:o.values.filter((_,n)=>n!==j)})}>削除</button></div>)}
 <button type="button" className="border px-3 py-2 text-xs font-bold" disabled={o.values.length>=20} onClick={()=>update(i,{...o,values:[...o.values,{id:identity(),label:{ja:''}}]})}>選択肢を追加</button></div>)}
 <button type="button" className="border px-4 py-3 text-sm font-bold" disabled={options.length>=3} onClick={()=>setOptions([...options,{key:identity(),name:{ja:''},values:[{id:identity(),label:{ja:''}}]}])}>選択項目を追加</button>
 {tooMany?<p role="alert" className="text-destructive">組み合わせが100種類を超えています。選択肢を減らしてください。</p>:<div className="divide-y">{variants.map(v=><label key={keyFor(v.options)} className="flex items-center justify-between gap-4 py-3 text-sm"><span>{options.map(o=>`${o.name.ja}: ${o.values.find(x=>x.id===v.options[o.key])?.label.ja??''}`).join(' / ')||'単品'}<span className="ml-2 text-muted-foreground">在庫</span></span><input aria-label={`${options.map(o=>o.values.find(x=>x.id===v.options[o.key])?.label.ja).join(' / ')||'単品'}の在庫数`} className="h-11 w-24 border px-3" type="number" min={0} max={1000000} value={v.stock??0} onChange={e=>setSaved({...saved,[keyFor(v.options)]:{...v,stock:Number(e.target.value)}})}/></label>)}</div>}
 {tooMany&&<input aria-label="組み合わせ数の上限" value="" required className="sr-only" onChange={()=>{}}/>}
 </fieldset>
}
