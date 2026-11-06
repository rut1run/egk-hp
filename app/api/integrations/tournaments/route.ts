import {database} from '@/lib/auth/server'
import {digest} from '@/lib/auth/crypto'
import {boundedJson} from '@/lib/auth/json'
import {parseResults} from '@/lib/tournament-validation'
import {getTournament} from '@/lib/data'
export async function POST(request:Request){
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'')??'',db=database()
 if(!/^[a-f0-9]{64}$/.test(token))return new Response('Unauthorized',{status:401})
 const key=await db.prepare("SELECT value FROM site_settings WHERE key='tournament_feed_hash'").first<{value:string}>();if(!key||await digest(token)!==key.value)return new Response('Unauthorized',{status:401})
 try{
  const data=await boundedJson(request),t=typeof data.slug==='string'?await getTournament(data.slug):null;if(!t)return new Response('Not found',{status:404})
  const results=parseResults(JSON.stringify(data.results),t.game),timestamp=new Date(results.recordedAt).getTime(),now=Date.now();if(timestamp>now+30000||timestamp<now-86400000)throw Error('time')
  const record={slug:t.slug,sourceTimestamp:timestamp,receivedAt:now,results,final:data.final===true},response=await db.prepare("INSERT INTO content_records(kind,slug,data,published,updated_at,updated_by) VALUES('tournament-feed',?,?,1,?,'tournament-software') ON CONFLICT(kind,slug) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at WHERE json_extract(content_records.data,'$.sourceTimestamp')<json_extract(excluded.data,'$.sourceTimestamp')").bind(t.slug,JSON.stringify(record),now).run()
  return Response.json({accepted:!!response.meta.changes},{headers:{'Cache-Control':'no-store'}})
 }catch{return Response.json({error:'Invalid tournament results'},{status:400})}
}
