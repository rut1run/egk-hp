import {boundedForm} from '@/lib/auth/form'
import {database,sameOrigin,destination,createSession} from '@/lib/auth/server'
import {hashPassword} from '@/lib/auth/crypto'
import {emailAddress,password,limit} from '@/lib/account'
import {text} from '@/lib/admin/validation'
import {sendAccountLink} from '@/lib/services/tokens'
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403})
 try{
  await limit(request,'register',5);const form=await boundedForm(request,16000),username=text(form,'userId',20,true).toLowerCase(),name=text(form,'displayName',80,true),email=emailAddress(text(form,'email',254,true)),pw=password(form.get('password'))
  if(!/^[a-z0-9_]{3,20}$/.test(username)||form.get('agree')!=='on')throw Error('input')
  const id=crypto.randomUUID(),db=database()
  await db.batch([db.prepare('INSERT INTO accounts(id,username,display_name,email,password_hash,role,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,username,name,email,await hashPassword(pw),'member',Date.now()),db.prepare('INSERT INTO account_profiles(account_id,data,email_verified) VALUES(?,?,0)').bind(id,'{}')])
  let notice='registered';try{await sendAccountLink(id,email,'verify',new URL(request.url).origin);notice='verification-sent'}catch{}
  return createSession(id,request,`/mypage?notice=${notice}`)
 }catch{return destination(request,'/register?error=invalid')}
}
