import { DatabaseSync } from 'node:sqlite'
import {mkdirSync,readFileSync,writeFileSync,renameSync,existsSync,statSync} from 'node:fs'
import {resolve,join} from 'node:path'
import {createHash,randomUUID} from 'node:crypto'
export function dataDirectory(){return resolve(process.env.EGK_DATA_DIR||'.data')}
export function openDatabase(filename){
 mkdirSync(resolve(filename,'..'),{recursive:true,mode:0o700})
 const sqlite=new DatabaseSync(filename)
 sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;')
 const statement=(sql,params=[])=>({
  bind(...values){return statement(sql,values)},
  execute(){const query=sqlite.prepare(sql);if(query.columns().length)return {results:query.all(...params),success:true,meta:{changes:0}};const result=query.run(...params);return {results:[],success:true,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)}}},
  async run(){return this.execute()},
  async all(){return this.execute()},
  async first(column){const row=sqlite.prepare(sql).get(...params);return row?(column?row[column]:row):null},
 })
 return {
  prepare:statement,
  async batch(statements){
   sqlite.exec('BEGIN IMMEDIATE')
   try{const results=statements.map(s=>s.execute());sqlite.exec('COMMIT');return results}
   catch(error){sqlite.exec('ROLLBACK');throw error}
  },
  close(){sqlite.close()},
  sqlite,
 }
}
let db
export function localDatabase(){return db??=openDatabase(join(dataDirectory(),'egk.sqlite'))}
export function fileBucket(directory){
 function location(key){if(!/^[a-z0-9-]+\.(png|jpg|webp)$/.test(key))throw Error('Invalid media key');return join(directory,key)}
 return {
  async put(key,value,options={}){
   mkdirSync(directory,{recursive:true,mode:0o700})
   const target=location(key),bytes=Buffer.from(value),temporary=target+'.'+randomUUID()+'.tmp'
   const type=options.httpMetadata?.contentType
   if(!['image/png','image/jpeg','image/webp'].includes(type))throw Error('Invalid media type')
   writeFileSync(temporary,bytes,{mode:0o600,flag:'wx'});renameSync(temporary,target)
  },
  async get(key){
   const target=location(key)
   if(!existsSync(target)||!statSync(target).isFile())return null
   const bytes=readFileSync(target),type=key.endsWith('.png')?'image/png':key.endsWith('.jpg')?'image/jpeg':'image/webp'
   return {body:new Uint8Array(bytes),httpEtag:'"'+createHash('sha256').update(bytes).digest('hex')+'"',writeHttpMetadata(headers){headers.set('Content-Type',type)}}
  },
 }
}
export function localBucket(){return fileBucket(join(dataDirectory(),'media'))}
