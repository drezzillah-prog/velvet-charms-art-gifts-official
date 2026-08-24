import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import contact from '../api/contact.js';

function res(){return{statusCode:200,payload:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.statusCode=c;return this;},json(p){this.payload=p;return this;}};}
const baseReq={method:'POST',headers:{host:'preview.test'},body:{name:'Test Customer',email:'test@example.com',message:'Custom idea',referencePhotos:['custom-orders/reference-test.jpg']}};
const contactHtml=readFileSync('contact.html','utf8');
assert.match(contactHtml,/fetch\('\/api\/contact'/,'contact form must call the extensionless Vercel contact route');
assert.match(contactHtml,/fetch\('\/api\/upload-photo'/,'contact photo upload must call the extensionless Vercel upload route');
assert.doesNotMatch(contactHtml,/fetch\('\/api\/(?:contact|upload-photo)\.js'/,'browser must never call Vercel API routes with .js suffixes');

const oldEndpoint=process.env.FORMSPREE_ENDPOINT,oldId=process.env.FORMSPREE_FORM_ID,oldSecret=process.env.ORDER_REFERENCE_SECRET;
delete process.env.FORMSPREE_ENDPOINT; delete process.env.FORMSPREE_FORM_ID;
process.env.ORDER_REFERENCE_SECRET='contact-test-secret';
let response=res(); await contact(baseReq,response);
assert.equal(response.statusCode,503,'contact API must never claim success when Formspree is not configured');

process.env.FORMSPREE_ENDPOINT='https://formspree.io/f/testForm123';
let sentBody=null;
global.fetch=async(url,options)=>{sentBody=JSON.parse(options.body);return{ok:true,status:200,json:async()=>({ok:true})};};
response=res(); await contact(baseReq,response);
assert.equal(response.statusCode,200); assert.equal(response.payload.ok,true);
assert.equal(sentBody.reference_photo_count,1);
assert.match(sentBody.reference_photos,/https:\/\/preview\.test\/api\/order-reference\?/,'seller must receive a signed private viewer link');
assert.match(sentBody.reference_photos,/pathname=custom-orders%2Freference-test\.jpg/,'signed viewer must point to the uploaded private reference');
assert.match(sentBody.reference_photos,/sig=[a-f0-9]{64}/,'signed viewer must include an HMAC signature');

response=res(); await contact({method:'POST',headers:{host:'preview.test'},body:{name:'Test',message:'Bad reference',referencePhotos:['https://evil.example/file.jpg']}},response);
assert.equal(response.statusCode,400,'external/untrusted photo references must be rejected');

if(oldEndpoint===undefined) delete process.env.FORMSPREE_ENDPOINT; else process.env.FORMSPREE_ENDPOINT=oldEndpoint;
if(oldId===undefined) delete process.env.FORMSPREE_FORM_ID; else process.env.FORMSPREE_FORM_ID=oldId;
if(oldSecret===undefined) delete process.env.ORDER_REFERENCE_SECRET; else process.env.ORDER_REFERENCE_SECRET=oldSecret;
console.log('PASS: Art & Gifts Contact uses correct Vercel routes, fails honestly without Formspree, and forwards signed private reference links only.');
