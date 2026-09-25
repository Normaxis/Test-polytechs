import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'polytechs-evrp-'));
try{
  fs.writeFileSync(path.join(dir,'evrp.mjs'),ts.transpileModule(fs.readFileSync('lib/evrp.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
  const {riskBand,riskScore}=await import(pathToFileURL(path.join(dir,'evrp.mjs')));
  for(const [score,band] of [[null,'unknown'],[7.99,'green'],[8,'yellow'],[19.99,'yellow'],[20,'orange'],[40,'orange'],[40.01,'red']])assert.equal(riskBand(score).key,band,`borne ${score}`);
  assert.equal(riskScore({f:10,g:10,im:.5,detection:1.3,applicable:true}),65);
  assert.equal(riskScore({f:null,g:10,im:.5,detection:1.3,applicable:true}),null);
  assert.equal(riskScore({f:10,g:10,im:1,detection:2,applicable:false}),null);
  console.log('Plages du DUERP et cotation vérifiées.');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
