import 'server-only'
import {database} from './auth/server'
import {digest} from './auth/crypto'
export async function profile(id:string){const row=await database().prepare('SELECT data,email_verified FROM account_profiles WHERE account_id=?').bind(id).first<{data:string;email_verified:number}>();return {data:row?JSON.parse(row.data):{},verified:!!row?.email_verified}}
export async function limit(request:Request,scope:string,max=10){
 const key=await digest(`${scope}:${request.headers.get('cf-connecting-ip')??'local'}`),now=Date.now(),db=database()
 await db.prepare('INSERT INTO login_attempts(key,count,window_end) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN window_end<? THEN 1 ELSE count+1 END,window_end=CASE WHEN window_end<? THEN excluded.window_end ELSE window_end END').bind(key,now+900000,now,now).run()
 const r=await db.prepare('SELECT count FROM login_attempts WHERE key=?').bind(key).first<{count:number}>();if((r?.count??0)>max)throw Error('rate')
}
export function emailAddress(value:string){const email=value.trim().toLowerCase();if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('email');return email}
export function password(value:FormDataEntryValue|null){if(typeof value!=='string'||value.length<12||value.length>128)throw Error('password');return value}
