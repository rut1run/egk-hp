import { boundedForm } from '@/lib/auth/form'
import {currentAccount,database,destination,sameOrigin} from '@/lib/auth/server'
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403})
 const me=await currentAccount();if(me?.role!=='admin')return new Response('Forbidden',{status:403})
 let form: FormData;try{form=await boundedForm(request,16000)}catch{return new Response('Request too large',{status:413})}
 const id=String(form.get('accountId')??''),role=String(form.get('role')??'')
 if(id===me.id||!['member','admin'].includes(role)||id.length>100)return destination(request,'/admin/accounts?error=invalid')
 const db=database()
 const results=await db.batch([
  db.prepare("UPDATE accounts SET role=? WHERE id=? AND id<>? AND EXISTS(SELECT 1 FROM accounts WHERE id=? AND role='admin')").bind(role,id,me.id,me.id),
  db.prepare('INSERT INTO admin_audit(id,account_id,action,target,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),me.id,'role_change_attempt',`${id}/${role}`,Date.now()),
 ])
 return destination(request,results[0].meta.changes?'/admin/accounts?saved=1':'/admin/accounts?error=invalid')
}
