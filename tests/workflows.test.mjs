import test from 'node:test'
import assert from 'node:assert/strict'
import {cartLines,canTransition} from '../lib/orders.ts'
import {parseResults,feedState} from '../lib/tournament-validation.ts'
import {boundedJson} from '../lib/auth/json.ts'
test('cart accepts only bounded integer quantities and rejects duplicated identifiers',()=>{
 assert.equal(cartLines(JSON.stringify([{productSlug:'tee',variantId:'m',quantity:2}]))[0].quantity,2)
 for(const value of [[],[{productSlug:'tee',variantId:'m',quantity:0}],[{productSlug:'tee',variantId:'m',quantity:1.5}],[{productSlug:'tee',variantId:'m',quantity:11}],[{productSlug:'tee',variantId:'m',quantity:1},{productSlug:'other',variantId:'m',quantity:1}]])assert.throws(()=>cartLines(JSON.stringify(value)))
})
test('payment and shipping states cannot skip manual confirmation stages',()=>{
 assert.equal(canTransition('requested','paid'),false);assert.equal(canTransition('awaiting_payment','paid'),true);assert.equal(canTransition('paid','canceled'),false);assert.equal(canTransition('paid','shipped'),true);assert.equal(canTransition('canceled','paid'),false);assert.equal(canTransition('requested','bad-state'),false)
})
test('a feed becomes stale when source data or receipt time is old',()=>{
 const now=Date.now(),results={game:'fortnite',recordedAt:new Date(now).toISOString(),standings:[]};assert.equal(feedState(null,now).connection,'not_connected');assert.equal(feedState({receivedAt:now,sourceTimestamp:now,results},now).connection,'connected');assert.equal(feedState({receivedAt:now,sourceTimestamp:now-91000,results},now).connection,'stale');assert.equal(feedState({receivedAt:now-91000,sourceTimestamp:now,results},now).connection,'stale')
})
test('standings and results reject mismatched games, invalid scores and duplicate identifiers',()=>{
 const fn={game:'fortnite',recordedAt:new Date().toISOString(),standings:[{rank:1,team:'Team 1',points:20,eliminations:3,matches:1}]};assert.equal(parseResults(JSON.stringify(fn),'fortnite').game,'fortnite');assert.throws(()=>parseResults(JSON.stringify(fn),'valorant'));fn.standings[0].points=-1;assert.throws(()=>parseResults(JSON.stringify(fn),'fortnite'));fn.standings[0].points=2;fn.standings.push({...fn.standings[0]});assert.throws(()=>parseResults(JSON.stringify(fn),'fortnite'))
})
test('JSON stream size is enforced without trusting Content-Length',async()=>{
 const request=new Request('https://example.test',{method:'POST',body:JSON.stringify({slug:'cup'})});assert.deepEqual(await boundedJson(request,100),{slug:'cup'})
 await assert.rejects(()=>boundedJson(new Request('https://example.test',{method:'POST',body:'x'.repeat(100)}),50))
})
