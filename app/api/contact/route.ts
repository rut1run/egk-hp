import {boundedForm} from '@/lib/auth/form'
import {currentAccount,database,sameOrigin,destination} from '@/lib/auth/server'
import {text} from '@/lib/admin/validation'
import {emailAddress,limit} from '@/lib/account'
export async function POST(request:Request){if(!sameOrigin(request))return new Response('Forbidden',{status:403});try{
 await limit(request,'contact',5);const f=await boundedForm(request,30000),type=text(f,'type',20,true);if(!['general','product'].includes(type)||text(f,'website',200))throw Error('input')
 const a=await currentAccount(),id=crypto.randomUUID(),now=Date.now();await database().prepare('INSERT INTO contacts(id,account_id,name,email,type,subject,message,order_number,status,assignee,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,a?.id??null,text(f,'name',100,true),emailAddress(text(f,'email',254,true)),type,text(f,'subject',200,true),text(f,'message',20000,true),text(f,'order',100),'new','','',now,now).run();return destination(request,'/contact?sent=1')
 }catch{return destination(request,'/contact?error=invalid')}}
