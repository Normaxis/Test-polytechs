import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qse-board-'));
try{const p=path.join(dir,'board.mjs');fs.writeFileSync(p,ts.transpileModule(fs.readFileSync('lib/unit-dashboard.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);const {defaultBoard,boardError,actionSummary}=await import(p);const b=defaultBoard();assert.equal(boardError(b),'');assert.ok(boardError({...b,widgets:[b.widgets[0],b.widgets[0]]}));assert.ok(boardError({...b,widgets:[{...b.widgets[0],type:'unknown'}]}));assert.ok(boardError({...b,widgets:[{...b.widgets[0],date:'2026-02-30'}]}));assert.deepEqual(actionSummary([{status:'À faire',due:'2026-09-24',programYear:2026},{status:'En cours',due:'2026-09-25',programYear:2026},{status:'Clôturée',due:'2026-01-01',programYear:2026},{status:'À vérifier',due:'',programYear:2027}],'2026-09-25',2026),{open:3,late:1,undated:1,verify:1,total:3,closed:1});console.log('Configuration, dates limites et périmètre annuel vérifiés.')}finally{fs.rmSync(dir,{recursive:true,force:true})}
