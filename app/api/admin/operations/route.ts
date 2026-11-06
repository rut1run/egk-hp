import {env} from '#egk-runtime'
import {boundedForm} from '@/lib/auth/form'
import {currentAccount,database,sameOrigin,destination} from '@/lib/auth/server'
import {text} from '@/lib/admin/validation'
import {orderLabels,canTransition,type OrderData} from '@/lib/orders'
import {sendMail} from '@/lib/services/mail'
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response('Forbidden',{status:403});const a=await currentAccount();if(a?.role!=='admin')return new Response('Forbidden',{status:403})
 let section='support',id='';try{
 const f=await boundedForm(request,50000),action=text(f,'action',30,true),db=database(),now=Date.now();id=text(f,'id',100,true)
 if(action==='contact'){
  const status=text(f,'status',20,true),assignee=text(f,'assignee',100);if(!['new','active','done'].includes(status))throw Error('status')
  if(assignee&&!await db.prepare("SELECT 1 FROM accounts WHERE id=? AND role='admin'").bind(assignee).first())throw Error('assignee')
  await db.batch([db.prepare('UPDATE contacts SET status=?,assignee=?,note=?,updated_at=? WHERE id=?').bind(status,assignee,text(f,'note',20000),now,id),db.prepare('INSERT INTO admin_audit(id,account_id,action,target,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),a.id,'contact',id,now)])
 }else if(action==='reply'||action==='retry'){
  const contact=await db.prepare('SELECT email,subject FROM contacts WHERE id=?').bind(id).first<{email:string;subject:string}>();if(!contact)throw Error('contact')
  let replyId=crypto.randomUUID(),body=''
  if(action==='retry'){
   replyId=text(f,'replyId',80,true);const old=await db.prepare("SELECT body,state,created_at FROM contact_replies WHERE id=? AND contact_id=?").bind(replyId,id).first<{body:string;state:string;created_at:number}>();if(!old||old.state!=='failed'||now-old.created_at>23*3600000)throw Error('retry');body=old.body
   const claimed=await db.prepare("UPDATE contact_replies SET state='sending',error='' WHERE id=? AND state='failed'").bind(replyId).run();if(!claimed.meta.changes)throw Error('retry')
  }else{
   body=text(f,'body',20000,true);if(f.get('sendConfirm')!=='on')throw Error('confirm');await db.prepare('INSERT INTO contact_replies(id,contact_id,author_id,body,state,error,created_at) VALUES(?,?,?,?,?,?,?)').bind(replyId,id,a.id,body,'sending','',now).run()
  }
  try{await sendMail(contact.email,`Re: ${contact.subject}`,body,`contact-${replyId}`);await db.prepare("UPDATE contact_replies SET state='sent' WHERE id=?").bind(replyId).run()}catch{await db.prepare("UPDATE contact_replies SET state='failed',error='メール設定または送信応答を確認してください。送信完了とは扱っていません。' WHERE id=?").bind(replyId).run();return destination(request,`/admin/support?edit=${id}&error=mail`)}
 }else if(action==='order'){
  section='orders';const order=await db.prepare('SELECT data,status FROM orders WHERE id=?').bind(id).first<{data:string;status:string}>(),status=text(f,'status',30,true)
  if(!order||!orderLabels[status]||!canTransition(order.status,status))throw Error('transition')
  const data=JSON.parse(order.data) as OrderData,shipping=text(f,'shipping',10);if(shipping){const n=Number(shipping);if(!Number.isSafeInteger(n)||n<0||n>1000000)throw Error('shipping');data.shipping=n}
  data.paymentInstructions=text(f,'paymentInstructions',10000);data.tracking=text(f,'tracking',1000);data.note=text(f,'note',20000)
  if(['awaiting_payment','paid','production','shipped','completed'].includes(status)&&(data.shipping===null||!data.paymentInstructions))throw Error('quote')
  if(status==='paid'&&order.status!=='paid'&&f.get('paymentConfirmed')!=='on')throw Error('payment')
  if(status==='shipped'&&!data.tracking)throw Error('tracking')
  const update=await db.prepare('UPDATE orders SET status=?,data=?,total=?,updated_at=? WHERE id=? AND status=? AND data=?').bind(status,JSON.stringify(data),data.subtotal+(data.shipping??0),now,id,order.status,order.data).run();if(!update.meta.changes)throw Error('conflict')
  await db.prepare('INSERT INTO admin_audit(id,account_id,action,target,created_at) VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),a.id,`order:${status}`,id,now).run()
 }else throw Error('action')
 return destination(request,`/admin/${section}?edit=${encodeURIComponent(id)}&saved=1`)
 }catch{return destination(request,`/admin/${section}?edit=${encodeURIComponent(id)}&error=invalid`)}
}
