import test from 'node:test'
import assert from 'node:assert/strict'
import {spawn,spawnSync} from 'node:child_process'
import {mkdtempSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,resolve} from 'node:path'
import {createServer} from 'node:net'
import {randomBytes} from 'node:crypto'
import {openDatabase} from '../lib/runtime/storage.mjs'

test('standalone server protects bootstrap, creates accounts, persists sessions and serves public pages', {timeout:45000}, async()=>{
 const directory=mkdtempSync(join(tmpdir(),'egk-runtime-')),secret=randomBytes(32).toString('hex')
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const origin=`http://127.0.0.1:${port}`,env={...process.env,EGK_DATA_DIR:directory,EGK_SETUP_TOKEN:secret,EGK_SITE_URL:origin,HOSTNAME:'127.0.0.1',PORT:String(port),NODE_ENV:'production'}
 const migration=spawnSync(process.execPath,['scripts/selfhost-migrate.mjs'],{env,encoding:'utf8'});assert.equal(migration.status,0,migration.stderr)
 const second=spawnSync(process.execPath,['scripts/selfhost-migrate.mjs'],{env,encoding:'utf8'});assert.equal(second.status,0,second.stderr);assert.equal(second.stdout,'')
 const child=spawn(process.execPath,[resolve('.next/standalone/server.js')],{env,stdio:'ignore'})
 async function post(path,data,cookie='',extra={}){return fetch(origin+path,{method:'POST',redirect:'manual',headers:{origin,cookie,...extra},body:new URLSearchParams(data)})}
 try{
  let ready=false
  for(let i=0;i<100;i++){try{if((await fetch(origin+'/login')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,150))}
  assert.equal(ready,true,'standalone server did not become ready')
  assert.equal((await fetch(origin+'/')).status,200)
  assert.ok((await (await fetch(origin+'/sitemap.xml')).text()).includes(origin))
  assert.equal((await fetch(origin+'/admin/setup')).status,200)
  const account={userId:'runtime_owner',displayName:'Runtime test',email:'fixture@example.test',password:'runtime-test-password-2026',confirm:'runtime-test-password-2026'}
  assert.equal((await post('/api/account/setup',account,'',{'oai-authenticated-user-id':'spoofed','oai-authenticated-user-email':'fixture@example.test'})).status,403)
  const created=await post('/api/account/setup',{...account,setupToken:secret});assert.equal(created.status,303)
  assert.equal(new URL(created.headers.get('location')).origin,origin)
  const cookie=created.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie)
  assert.equal((await fetch(origin+'/admin',{headers:{cookie},redirect:'manual'})).status,200)
  const retry=await post('/api/account/setup',{...account,userId:'second_owner',setupToken:secret});assert.equal(retry.status,303);assert.match(retry.headers.get('location'),/setup-complete/)
  const login=await post('/api/account/login',{userId:account.userId,password:account.password,next:'/admin'});assert.equal(login.status,303);assert.ok(login.headers.get('set-cookie'))
  const member=await post('/api/account/register',{userId:'runtime_member',displayName:'Member fixture',email:'member@example.test',password:account.password,agree:'on'});assert.equal(member.status,303);assert.ok(member.headers.get('set-cookie'))
  assert.equal((await fetch(origin+'/api/admin/backup',{headers:{cookie:member.headers.get('set-cookie').split(';')[0]},redirect:'manual'})).status,403)
  const saved=join(directory,'snapshot')
  const backup=spawnSync(process.execPath,['scripts/selfhost-backup.mjs',saved],{env,encoding:'utf8'});assert.equal(backup.status,0,backup.stderr)
  const snapshot=openDatabase(join(saved,'egk.sqlite'));try{assert.equal(await snapshot.prepare('SELECT COUNT(*) AS n FROM accounts').first('n'),2)}finally{snapshot.close()}
 }finally{
  if(child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r))}rmSync(directory,{recursive:true,force:true})
 }
})
