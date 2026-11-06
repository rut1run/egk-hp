import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {stripTypeScriptTypes} from 'node:module'
const source=stripTypeScriptTypes(await readFile(new URL('../lib/admin/catalog-validation.ts',import.meta.url),'utf8')).replace("'./validation'",JSON.stringify(new URL('../lib/admin/validation.ts',import.meta.url).href)).replace("'../tournament-validation'",JSON.stringify(new URL('../lib/tournament-validation.ts',import.meta.url).href))
const {parseVariants,parseCatalogRecord}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))
const fixture=()=>({options:[{key:'size',name:{ja:'サイズ'},values:[{id:'S',label:{ja:'S'}},{id:'M',label:{ja:'M'}}]}],variants:[{id:'s-id',options:{size:'S'},stock:4},{id:'m-id',options:{size:'M'},stock:0}]})
test('variant identifiers survive validation and made-to-order has no finite stock',()=>{
 const v=fixture();assert.deepEqual(parseVariants(JSON.stringify(v),'stock').variants,v.variants)
 assert.equal(parseVariants(JSON.stringify(v),'made_to_order').variants[0].stock,null)
})
test('invalid inventory, duplicate or missing combinations, unknown values are rejected',()=>{
 const cases=[v=>v.variants[0].stock=-1,v=>v.variants[0].stock=1.5,v=>v.variants.pop(),v=>v.variants[1].options.size='S',v=>v.variants[1].id='s-id',v=>v.variants[0].options.size='XX',v=>v.options.push(v.options[0]),v=>v.variants[0].id='__proto__',v=>v.options[0].key='constructor']
 for(const mutate of cases){const v=fixture();mutate(v);assert.throws(()=>parseVariants(JSON.stringify(v),'stock'))}
 assert.throws(()=>parseVariants(JSON.stringify({options:[],variants:[]}),'stock'))
})
function product(){const f=new FormData();Object.entries({nameJa:'商品',descriptionJa:'説明',priceJpy:'2000',category:'goods',fulfillment:'stock',image0:'/images/dev/product-tee.png',alt0Ja:'Tシャツ',status:'published',variantData:JSON.stringify({options:[],variants:[{id:'one',options:{},stock:1}]})}).forEach(([k,v])=>f.set(k,v));return f}
test('catalog requires images, valid prices, time ranges and explicit translation approval',()=>{
 const f=product();assert.equal(parseCatalogRecord(f,'products','sample',0).published,true)
 for(const price of ['-1','2.3','NaN']){const bad=product();bad.set('priceJpy',price);assert.throws(()=>parseCatalogRecord(bad,'products','sample',0))}
 f.set('image0','');assert.throws(()=>parseCatalogRecord(f,'products','sample',0))
 const dates=product();dates.set('salesStartAt','2026-11-08T12:00');dates.set('salesEndAt','2026-11-07T12:00');assert.throws(()=>parseCatalogRecord(dates,'products','sample',0))
 const english=product();english.set('nameEn','Item');english.set('descriptionEn','Description');english.set('alt0En','Shirt');assert.equal(parseCatalogRecord(english,'products','sample',0).record.translation,'needs_review');english.set('reviewed','on');assert.equal(parseCatalogRecord(english,'products','sample',0).record.translation,'reviewed')
})
test('banner links allow local pages but reject active content and protocol-relative URLs',()=>{
 const f=new FormData();Object.entries({titleJa:'バナー',altJa:'大会',imageUrl:'/images/dev/banner-2.jpg',href:'/news?category=shop',status:'published'}).forEach(([k,v])=>f.set(k,v));assert.equal(parseCatalogRecord(f,'banners','main',0).published,true)
 for(const href of ['javascript:alert(1)','//example.com','/\\example.com','/%2fexample.com']){f.set('href',href);assert.throws(()=>parseCatalogRecord(f,'banners','main',0))}
})
