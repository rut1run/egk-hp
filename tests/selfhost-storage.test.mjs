import test from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,rmSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {openDatabase,fileBucket} from '../lib/runtime/storage.mjs'
test('self-hosted transactions roll back bootstrap races and persist queries',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'egk-db-'));let db
 try{
  db=openDatabase(join(dir,'db.sqlite'));db.sqlite.exec('CREATE TABLE marker(id TEXT PRIMARY KEY);CREATE TABLE accounts(id TEXT PRIMARY KEY)')
  await db.batch([db.prepare('INSERT INTO marker VALUES(?)').bind('one'),db.prepare('INSERT INTO accounts VALUES(?)').bind('admin')])
  await assert.rejects(db.batch([db.prepare('INSERT INTO accounts VALUES(?)').bind('intruder'),db.prepare('INSERT INTO marker VALUES(?)').bind('one')]))
  assert.equal(await db.prepare('SELECT id FROM accounts WHERE id=?').bind('intruder').first(),null)
  assert.equal((await db.prepare('UPDATE accounts SET id=? WHERE id=?').bind('owner','admin').run()).meta.changes,1)
  db.close();db=openDatabase(join(dir,'db.sqlite'))
  assert.equal(await db.prepare('SELECT id FROM accounts').first('id'),'owner')
  assert.equal((await db.prepare('SELECT * FROM accounts').all()).results.length,1)
 }finally{db?.close();rmSync(dir,{recursive:true,force:true})}
})
test('self-hosted images persist with correct type/etag and reject path traversal',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'egk-media-'))
 try{
  const bucket=fileBucket(dir),bytes=new Uint8Array([137,80,78,71])
  await bucket.put('sample.png',bytes.buffer,{httpMetadata:{contentType:'image/png'}})
  const file=await fileBucket(dir).get('sample.png'),headers=new Headers();file.writeHttpMetadata(headers)
  assert.deepEqual(file.body,bytes);assert.equal(headers.get('Content-Type'),'image/png');assert.match(file.httpEtag,/^"[a-f0-9]{64}"$/)
  assert.equal(await bucket.get('missing.png'),null)
  await assert.rejects(bucket.get('../sample.png'))
  await assert.rejects(bucket.put('evil.jpg',bytes.buffer,{httpMetadata:{contentType:'text/html'}}))
 }finally{rmSync(dir,{recursive:true,force:true})}
})
