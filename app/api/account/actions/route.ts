import {requestOrigin} from '@/lib/auth/server'
import {boundedForm} from '@/lib/auth/form'
import {currentAccount,database,sameOrigin,destination} from '@/lib/auth/server'
import {digest,hashPassword,verifyPassword} from '@/lib/auth/crypto'
import {emailAddress,password,profile,limit} from '@/lib/account'
import {text,webUrl} from '@/lib/admin/validation'
import {sendAccountLink} from '@/lib/services/tokens'
import {mailReady} from '@/lib/services/mail'
import {getMember} from '@/lib/data'
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403})
 const db=database(),account=await currentAccount();let action=''
 try{
  const form=await boundedForm(request,24000);action=text(form,'action',30,true)
  if(action==='reset-request'){
   if(!mailReady())return destination(request,'/password-reset?error=mail')
   await limit(request,'reset',5);const email=emailAddress(text(form,'email',254,true)),row=await db.prepare('SELECT id FROM accounts WHERE email=?').bind(email).first<{id:string}>()
   if(row)await sendAccountLink(row.id,email,'reset',requestOrigin(request)).catch(()=>{})
   return destination(request,'/password-reset?sent=1')
  }
  if(action==='confirm'){
   await limit(request,'confirm',10);const token=text(form,'token',64,true);if(!/^[a-f0-9]{64}$/.test(token))throw Error('token')
   const hash=await digest(token),row=await db.prepare('SELECT account_id,purpose,payload FROM account_tokens WHERE hash=? AND expires_at>?').bind(hash,Date.now()).first<{account_id:string;purpose:string;payload:string}>();if(!row)throw Error('token')
   const exists='EXISTS(SELECT 1 FROM account_tokens WHERE hash=? AND expires_at>?)',now=Date.now()
   if(row.purpose==='reset'){
    const pw=password(form.get('password'))
    const result=await db.batch([db.prepare(`DELETE FROM account_sessions WHERE account_id=? AND ${exists}`).bind(row.account_id,hash,now),db.prepare(`UPDATE accounts SET password_hash=? WHERE id=? AND ${exists}`).bind(await hashPassword(pw),row.account_id,hash,now),db.prepare('DELETE FROM account_tokens WHERE hash=?').bind(hash)])
    if(!result[1].meta.changes)throw Error('token')
    return destination(request,'/login?notice=password-changed')
   }
   // Verification is tied to the email in the one-use token, never a browser-supplied address.
   const result=await db.batch([db.prepare(`UPDATE accounts SET email=? WHERE id=? AND ${exists}`).bind(row.payload,row.account_id,hash,now),db.prepare(`INSERT INTO account_profiles(account_id,data,email_verified) SELECT ?,'{}',1 WHERE ${exists} ON CONFLICT(account_id) DO UPDATE SET email_verified=1`).bind(row.account_id,hash,now),db.prepare(`UPDATE orders SET account_id=? WHERE account_id IS NULL AND email=? AND ${exists}`).bind(row.account_id,row.payload,hash,now),db.prepare('DELETE FROM account_tokens WHERE hash=?').bind(hash)])
   if(!result[0].meta.changes)throw Error('token');return destination(request,'/mypage?notice=verified')
  }
  if(!account)return destination(request,'/login')
  await limit(request,`account:${account.id}`,60)
  const p=await profile(account.id)
  if(action==='profile'){
   p.data.iconUrl=webUrl(text(form,'iconUrl',1000));await db.batch([db.prepare('UPDATE accounts SET display_name=? WHERE id=?').bind(text(form,'displayName',80,true),account.id),db.prepare('INSERT INTO account_profiles(account_id,data,email_verified) VALUES(?,?,?) ON CONFLICT(account_id) DO UPDATE SET data=excluded.data').bind(account.id,JSON.stringify(p.data),p.verified?1:0)])
  }else if(action==='address'){
   p.data.address={name:text(form,'name',100,true),postal:text(form,'postal',20,true),prefecture:text(form,'prefecture',30,true),city:text(form,'city',200,true),building:text(form,'building',200),phone:text(form,'phone',30,true)}
   await db.prepare('INSERT INTO account_profiles(account_id,data,email_verified) VALUES(?,?,?) ON CONFLICT(account_id) DO UPDATE SET data=excluded.data').bind(account.id,JSON.stringify(p.data),p.verified?1:0).run()
  }else if(action==='address-delete'){
   delete p.data.address;await db.prepare('UPDATE account_profiles SET data=? WHERE account_id=?').bind(JSON.stringify(p.data),account.id).run()
  }else if(action==='favorite'){
   const member=text(form,'member',80,true);if(!await getMember(member))throw Error('member')
   if(form.get('remove')==='1')await db.prepare('DELETE FROM account_favorites WHERE account_id=? AND member_slug=?').bind(account.id,member).run()
   else await db.prepare('INSERT OR IGNORE INTO account_favorites(account_id,member_slug) VALUES(?,?)').bind(account.id,member).run()
   return destination(request,`/members/${member}`)
  }else if(action==='verify'||action==='email'){
   if(!mailReady())return destination(request,'/mypage?error=mail')
   if(action==='email'){
    const stored=await db.prepare('SELECT password_hash FROM accounts WHERE id=?').bind(account.id).first<{password_hash:string}>();if(!stored||!await verifyPassword(String(form.get('currentPassword')??''),stored.password_hash))throw Error('password')
   }
   const email=action==='email'?emailAddress(text(form,'email',254,true)):account.email
   await limit(request,`mail:${account.id}`,3);await sendAccountLink(account.id,email,'verify',requestOrigin(request))
   return destination(request,'/mypage?notice=verification-sent')
  }else if(action==='password'||action==='delete'){
   const stored=await db.prepare('SELECT password_hash FROM accounts WHERE id=?').bind(account.id).first<{password_hash:string}>();if(!stored||!await verifyPassword(String(form.get('currentPassword')??''),stored.password_hash))throw Error('password')
   if(action==='password')await db.batch([db.prepare('UPDATE accounts SET password_hash=? WHERE id=?').bind(await hashPassword(password(form.get('password'))),account.id),db.prepare('DELETE FROM account_sessions WHERE account_id=?').bind(account.id)])
   else{
    if(account.role==='admin'||form.get('confirmDelete')!=='on')throw Error('admin')
    // Retire the account and remove personal profile data; order/contact records retain their own business records.
    await db.batch([db.prepare('DELETE FROM account_sessions WHERE account_id=?').bind(account.id),db.prepare('DELETE FROM account_tokens WHERE account_id=?').bind(account.id),db.prepare('DELETE FROM account_profiles WHERE account_id=?').bind(account.id),db.prepare('DELETE FROM account_favorites WHERE account_id=?').bind(account.id),db.prepare('UPDATE orders SET account_id=NULL WHERE account_id=?').bind(account.id),db.prepare('UPDATE contacts SET account_id=NULL WHERE account_id=?').bind(account.id),db.prepare("UPDATE accounts SET username=?,display_name='退会済み',email=?,password_hash='disabled' WHERE id=?").bind(`deleted_${account.id}`,`deleted-${account.id}@invalid.example`,account.id)])
   }
   const response=destination(request,'/login?notice=account-updated');response.headers.append('Set-Cookie','egk_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');return response
  }else throw Error('action')
  return destination(request,'/mypage?saved=1')
 }catch{return destination(request,action==='confirm'?'/account-confirm?error=invalid':'/mypage?error=invalid')}
}
