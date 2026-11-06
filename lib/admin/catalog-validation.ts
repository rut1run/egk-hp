import {parseResults} from '../tournament-validation'
import { text, slug, webUrl, linkUrl, localDateToISO, translation } from './validation'
import type { ProductOption, ProductVariant } from '../types'
export function parseVariants(raw:string, fulfillment:string):{options:ProductOption[];variants:ProductVariant[]} {
 const parsed=JSON.parse(raw)
 const short=(x:unknown,max=100)=>{if(typeof x!=='string'||!x.trim()||x.length>max)throw Error('option');return x.trim()}
 if(!Array.isArray(parsed.options)||parsed.options.length>3||!Array.isArray(parsed.variants)||parsed.variants.length<1||parsed.variants.length>100)throw Error('variants')
 const identifier=(v:unknown,max=100)=>{const id=short(v,max);if(!/^[a-zA-Z0-9_-]+$/.test(id)||['__proto__','prototype','constructor'].includes(id))throw Error('identifier');return id}
 const options:ProductOption[]=parsed.options.map((o:any)=>({key:identifier(o.key),name:{ja:short(o.name?.ja),en:o.name?.en?short(o.name.en):undefined},values:(()=>{if(!Array.isArray(o.values)||!o.values.length||o.values.length>20)throw Error('values');return o.values.map((v:any)=>({id:identifier(v.id),label:{ja:short(v.label?.ja),en:v.label?.en?short(v.label.en):undefined}}))})()}))
 if(new Set(options.map(o=>o.key)).size!==options.length)throw Error('keys')
 for(const o of options){if(new Set(o.values.map(v=>v.id)).size!==o.values.length||new Set(o.values.map(v=>v.label.ja)).size!==o.values.length)throw Error('duplicate values')}
 const combos=new Set<string>(),ids=new Set<string>()
 const variants:ProductVariant[]=parsed.variants.map((v:any)=>{
  const id=identifier(v.id,160);if(ids.has(id))throw Error('id');ids.add(id)
  if(!v.options||typeof v.options!=='object'||Array.isArray(v.options)||Object.keys(v.options).length!==options.length)throw Error('options')
  const values:Record<string,string>={};for(const o of options){if(!o.values.some(x=>x.id===v.options[o.key]))throw Error('value');values[o.key]=v.options[o.key]}
  const key=JSON.stringify(values);if(combos.has(key))throw Error('duplicate');combos.add(key)
  if(fulfillment==='stock'&&(!Number.isSafeInteger(v.stock)||v.stock<0||v.stock>1000000))throw Error('stock')
  return {id,options:values,stock:fulfillment==='made_to_order'?null:v.stock}
 })
 const combinations=options.reduce((n,o)=>n*o.values.length,1)
 if(combinations!==variants.length)throw Error('missing combinations')
 return {options,variants}
}
export function parseCatalogRecord(form:FormData,kind:string,id:string,order:number){
 const status=text(form,'status',20)||'draft';if(!['draft','private','published'].includes(status))throw Error('status')
 const localized=(name:string,max:number,required=false)=>({ja:text(form,`${name}Ja`,max,required),en:text(form,`${name}En`,max)||undefined})
 const reviewed=(english:boolean)=>translation(form,english)
 if(kind==='tournaments'){
  const title=localized('title',200,true),summary=localized('summary',20000,true),game=text(form,'game',20,true),status=text(form,'tournamentStatus',20,true)
  if(!['fortnite','valorant'].includes(game)||!['upcoming','live','finished'].includes(status))throw Error('tournament')
  const startAt=localDateToISO(text(form,'startAt',30,true)),endAt=localDateToISO(text(form,'endAt',30,true));if(startAt>=endAt)throw Error('dates')
  const schedule=Array.from({length:5},(_,i)=>{const at=text(form,`scheduleAt${i}`,30),label=text(form,`scheduleLabel${i}`,200);if(!at&&!label)return null;if(!at||!label)throw Error('schedule');return {at:localDateToISO(at),label:{ja:label}}}).filter(Boolean)
  const streams=(['youtube','twitch'] as const).flatMap(platform=>{const url=webUrl(text(form,platform,1000));if(!url)return [];const host=new URL(url).hostname;if(platform==='youtube'&&!['youtube.com','www.youtube.com','youtu.be'].includes(host))throw Error('stream');if(platform==='twitch'&&!['twitch.tv','www.twitch.tv'].includes(host))throw Error('stream');return [{platform,url,label:platform==='youtube'?'YouTube':'Twitch'}]})
  const raw=text(form,'results',50000);const result=raw?parseResults(raw,game):undefined
  if(result)result.recordedAt=new Date().toISOString()
  const hasResult=result&&(result.game==='fortnite'?result.standings.length:result.matches.length)
  const published=form.get('published')==='on'
  return {record:{slug:id,title,summary,game,status,startAt,endAt,schedule,streams,results:hasResult?result:undefined,published,translation:reviewed(!!title.en&&!!summary.en)},published}
 }
 if(kind==='categories')return {record:{slug:id,name:localized('name',100,true),order},published:true}
 if(kind==='banners'){
  const title=localized('title',200,true),alt=localized('alt',300,true),imageUrl=webUrl(text(form,'imageUrl',1000,true)),href=linkUrl(text(form,'href',1000,true))
  return {record:{slug:id,id,imageUrl,mobileImageUrl:webUrl(text(form,'mobileImageUrl',1000))||undefined,title,alt,href,order,published:status==='published',translation:reviewed(!!title.en&&!!alt.en)},published:status==='published'}
 }
 if(kind==='sponsors'){
  const description=localized('description',10000)
  return {record:{slug:id,name:text(form,'name',100,true),logoUrl:webUrl(text(form,'logoUrl',1000,true)),description,url:webUrl(text(form,'url',1000))||undefined,order,status,translation:reviewed(!!description.en)},published:status==='published'}
 }
 if(kind==='team'){
  if(id!=='main')throw Error('team')
  const body=localized('body',20000,true)
  const socials=['x','youtube','twitch','tiktok','instagram'].flatMap(type=>{const url=webUrl(text(form,type,1000));return url?[{type,url,label:({x:'X',youtube:'YouTube',twitch:'Twitch',tiktok:'TikTok',instagram:'Instagram'} as Record<string,string>)[type]}]:[]})
  return {record:{slug:id,body,socials,translation:reviewed(!!body.en)},published:true}
 }
 if(kind!=='products')throw Error('kind')
 const name=localized('name',200,true),description=localized('description',20000,true),priceJpy=Number(text(form,'priceJpy',10,true)),fulfillment=text(form,'fulfillment',30,true)
 if(!Number.isSafeInteger(priceJpy)||priceJpy<0||priceJpy>100000000||!['stock','made_to_order'].includes(fulfillment))throw Error('price')
 const {options,variants}=parseVariants(text(form,'variantData',50000,true),fulfillment)
 const images=Array.from({length:6},(_,i)=>({url:webUrl(text(form,`image${i}`,1000)),alt:localized(`alt${i}`,300)})).filter(x=>x.url)
 if(!images.length||images.some(x=>!x.alt.ja))throw Error('images')
 const start=text(form,'salesStartAt',30),end=text(form,'salesEndAt',30),salesStartAt=start?localDateToISO(start):undefined,salesEndAt=end?localDateToISO(end):undefined
 if(salesStartAt&&salesEndAt&&salesStartAt>=salesEndAt)throw Error('dates')
 const english=!!name.en&&!!description.en&&images.every(i=>!!i.alt.en)&&options.every(o=>!!o.name.en&&o.values.every(v=>!!v.label.en))
 return {record:{slug:id,name,description,images,priceJpy,category:slug(text(form,'category',80,true)),fulfillment,options,variants,salesStartAt,salesEndAt,preorder:form.get('preorder')==='on',memberSlugs:form.getAll('members').map(String),featured:form.get('featured')==='on',isNew:form.get('isNew')==='on',status,translation:reviewed(english)},published:status==='published'}
}
