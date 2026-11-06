import {boundedForm} from '../lib/auth/form.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import {hashPassword,verifyPassword,digest,randomToken} from '../lib/auth/crypto.ts'
import {slug,webUrl,localDateToISO,translation,text} from '../lib/admin/validation.ts'

test('salted passwords verify only the matching password and reject malformed hashes',async()=>{
 const hash=await hashPassword('a-test-only-password-2026')
 assert.equal(await verifyPassword('a-test-only-password-2026',hash),true)
 assert.equal(await verifyPassword('different-password',hash),false)
 assert.notEqual(await hashPassword('a-test-only-password-2026'),hash)
 assert.equal(await verifyPassword('a-test-only-password-2026','broken'),false)
 assert.equal(await verifyPassword('a-test-only-password-2026',hash.replace('$100000$','$1$')),false)
})
test('session tokens are random and are stored as digests',async()=>{
 const a=randomToken(),b=randomToken();assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);assert.notEqual(await digest(a),a);assert.equal(await digest(a),await digest(a))
})
test('unsafe URLs and invalid slugs cannot be saved',()=>{
 for(const value of ['javascript:alert(1)','data:text/html,test','http://example.com','https://user:password@example.com'])assert.throws(()=>webUrl(value))
 assert.equal(webUrl('/media/test-id.png'),'/media/test-id.png')
 assert.equal(webUrl('https://example.com/profile'),'https://example.com/profile')
 for(const value of ['../x','A B','<script>','test--slug'])assert.throws(()=>slug(value))
 assert.equal(slug('new-member-1'),'new-member-1')
})
test('scheduled publish time is interpreted as JST and rejects normalized invalid dates',()=>{
 assert.equal(localDateToISO('2026-11-06T12:00'),'2026-11-06T03:00:00.000Z')
 for(const value of ['2026-02-31T12:00','2026-13-01T12:00','invalid'])assert.throws(()=>localDateToISO(value))
})
test('English is never marked reviewed without an explicit approval',()=>{
 const form=new FormData();assert.equal(translation(form,true),'needs_review');form.set('reviewed','on');assert.equal(translation(form,true),'reviewed');assert.equal(translation(form,false),'none');form.set('body','x'.repeat(20));assert.throws(()=>text(form,'body',10));assert.throws(()=>text(form,'missing',10,true))
})

test('form parsing bounds actual bytes even without Content-Length',async()=>{
 const valid=new Request('https://example.test',{method:'POST',body:new URLSearchParams({name:'EGK'})})
 assert.equal((await boundedForm(valid,100)).get('name'),'EGK')
 const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(9));c.enqueue(new Uint8Array(9));c.close()}})
 const tooLarge=new Request('https://example.test',{method:'POST',body:stream,duplex:'half',headers:{'Content-Type':'application/x-www-form-urlencoded'}})
 await assert.rejects(()=>boundedForm(tooLarge,10),/too large/)
})
