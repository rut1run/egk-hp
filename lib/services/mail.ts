import 'server-only'
import {env} from '#egk-runtime'
const config=env as unknown as Record<string,string|undefined>
export function mailReady(){return !!config.RESEND_API_KEY&&!!config.MAIL_FROM}
export async function sendMail(to:string,subject:string,body:string,key:string){
 if(!mailReady())throw Error('mail-unconfigured')
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({from:config.MAIL_FROM,to:[to],subject,text:body}),signal:AbortSignal.timeout(15000)})
 if(!response.ok)throw Error('mail-failed')
}
