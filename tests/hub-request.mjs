import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'polytechs-request-'));
const originalFetch=globalThis.fetch;
try{
const file=path.join(dir,'request.mjs');fs.writeFileSync(file,ts.transpileModule(fs.readFileSync('lib/hub-request.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
const {hubRequest}=await import(file);
let count=0,options;
globalThis.fetch=async(_,init)=>{options=init;return ++count===1?new Response('<!DOCTYPE html><html>Gateway</html>',{headers:{'content-type':'text/html'}}):Response.json({records:[{id:'test'}]})};
assert.equal((await hubRequest('/api/dechets')).records[0].id,'test');assert.equal(count,2);assert.equal(options.cache,'no-store');assert.equal(options.headers.Accept,'application/json');
count=0;globalThis.fetch=async()=>{count++;return new Response('<!DOCTYPE html>',{status:502,headers:{'content-type':'text/html'}})};
await assert.rejects(()=>hubRequest('/api/dechets'),e=>!e.message.includes('Unexpected token')&&e.message.includes('Réessayez'));assert.equal(count,2);
count=0;await assert.rejects(()=>hubRequest('/api/dechets',{type:'Carton'}));assert.equal(count,1);
count=0;globalThis.fetch=async()=>{count++;return Response.json({error:'Accès QSSE nécessaire.'},{status:403})};await assert.rejects(()=>hubRequest('/api/dechets'),/Accès QSSE/);assert.equal(count,1);
count=0;globalThis.fetch=async()=>{count++;return new Response('<!DOCTYPE html>',{status:401,headers:{'content-type':'text/html'}})};await assert.rejects(()=>hubRequest('/api/dechets'),/reconnecter/);assert.equal(count,1);
count=0;globalThis.fetch=async()=>{count++;return new Response('{broken',{headers:{'content-type':'application/json'}})};await assert.rejects(()=>hubRequest('/api/dechets'),/incomplètes/);assert.equal(count,2);
console.log('Réponses HTML/JSON, session expirée, lecture récupérable et absence de double écriture vérifiées.');
}finally{globalThis.fetch=originalFetch;fs.rmSync(dir,{recursive:true,force:true})}
