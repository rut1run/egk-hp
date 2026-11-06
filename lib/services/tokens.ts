import 'server-only'
import {database} from '@/lib/auth/server'
import {randomToken,digest} from '@/lib/auth/crypto'
import {sendMail,mailReady} from './mail'
export async function sendAccountLink(id:string,email:string,purpose:string,origin:string){
 if(!mailReady())throw Error('mail-unconfigured')
 const token=randomToken(),hash=await digest(token),db=database()
 await db.batch([db.prepare('DELETE FROM account_tokens WHERE expires_at<? OR (account_id=? AND purpose=?)').bind(Date.now(),id,purpose),db.prepare('INSERT INTO account_tokens(hash,account_id,purpose,payload,expires_at) VALUES(?,?,?,?,?)').bind(hash,id,purpose,email,Date.now()+1800000)])
 try{await sendMail(email,'EGK アカウントの確認',`次のページで手続きを続けてください。有効期限は30分です。\n${origin}/account-confirm?token=${token}\n\n心当たりがない場合は操作しないでください。`,hash)}catch(e){await db.prepare('DELETE FROM account_tokens WHERE hash=?').bind(hash).run();throw e}
}
