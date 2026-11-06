import {env} from '#egk-runtime'
import {currentAccount,sameOrigin} from '@/lib/auth/server'
import {boundedJson} from '@/lib/auth/json'
import {limit} from '@/lib/account'
export async function POST(request:Request){if(!sameOrigin(request))return new Response('Forbidden',{status:403});const a=await currentAccount();if(a?.role!=='admin')return new Response('Forbidden',{status:403});const config=env as unknown as Record<string,string|undefined>;if(!config.DEEPL_API_KEY)return Response.json({error:'自動翻訳サービスが未接続です。英語は手入力して保存できます。'},{status:503});try{
 await limit(request,`translate:${a.id}`,30);const data=await boundedJson(request,90000),entries=Object.entries(data.fields??{}).filter(([k,v])=>/^[a-zA-Z0-9_]+Ja$/.test(k)&&typeof v==='string'&&v.length>0&&v.length<=30000);if(!entries.length||entries.length>50)throw Error('fields')
 const endpoint=config.DEEPL_PLAN==='pro'?'https://api.deepl.com/v2/translate':'https://api-free.deepl.com/v2/translate',r=await fetch(endpoint,{method:'POST',headers:{Authorization:`DeepL-Auth-Key ${config.DEEPL_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({text:entries.map(([,v])=>v),source_lang:'JA',target_lang:'EN'}),signal:AbortSignal.timeout(20000)})
 if(!r.ok)throw Error('translation');const result=await r.json() as {translations:{text:string}[]};if(result.translations.length!==entries.length)throw Error('translation');return Response.json({fields:Object.fromEntries(entries.map(([k],i)=>[k.replace(/Ja$/,'En'),result.translations[i].text]))},{headers:{'Cache-Control':'no-store'}})
 }catch{return Response.json({error:'翻訳できませんでした。設定・文字数を確認してください。元の内容は変更されていません。'},{status:400})}}
