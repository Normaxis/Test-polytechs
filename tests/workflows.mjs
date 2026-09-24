import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'qse-rules-'));
try {
for(const name of ['modules','workflows']){let source=fs.readFileSync(`lib/${name}.ts`,'utf8').replace("'./modules'","'./modules.mjs'");fs.writeFileSync(path.join(dir,name+'.mjs'),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText)}
const {blank,normalize,validate,dueEvents,closed}=await import(pathToFileURL(path.join(dir,'workflows.mjs')));
const action={...blank,title:'Vérifier une protection',status:'Clôturée',owner:'QSE',due:'2026-01-01',details:{measure:'Contrôle terrain'}};
assert(validate(action).some(e=>e.includes('Vérifié par')),'Clôture sans vérification refusée');
const finished={...action,details:{...action.details,result:'Contrôle réalisé',verifiedBy:'QSE',verifiedDate:'2026-01-01',effectiveness:'Protection testée'}};
assert.equal(validate(finished).length,0);assert.equal(dueEvents(finished).length,0);
const source={...blank,id:'source',kind:'Situations dangereuses',status:'Clôturée',owner:'QSE',title:'Danger',details:{date:'2026-01-01',place:'Atelier',danger:'Danger',immediate:'Balisage'}};
assert(validate(source,[{...action,id:'a',sourceId:'source',status:'En cours'}]).some(e=>e.includes('actions liées')));
assert(validate({...finished,id:undefined,sourceId:'source'},[source]).some(e=>e.includes('Rouvrez')));
const document={...blank,kind:'Gestion documentaire',domain:'Qualité',status:'Approuvé',title:'Instruction',owner:'QSE',due:'2026-12-01',url:'https://example.com/document',details:{reference:'INS01',version:'1',category:'Instruction',approver:'QSE',approved:'2026-01-01'}};
assert.equal(validate(document).length,0);assert.equal(dueEvents(document).length,1,'Révision visible même après approbation');
assert(validate({...document,url:''}).some(e=>e.includes('lien')));
const pdp={...blank,kind:'Plans de prévention',title:'Maintenance',status:'À préparer',details:{contractor:'EE',operation:'Maintenance',place:'Atelier',start:'2026-10-10',end:'2026-10-01'}};
assert(validate(pdp).some(e=>e.includes('précède')));
assert(validate({...blank,title:'Date invalide',due:'2026-02-30',details:{measure:'Faire'}}).some(e=>e.includes('Échéance invalide')));
assert(validate({...blank,title:'A',sourceId:'inconnu',details:{measure:'Faire'}}).some(e=>e.includes('origine')));
const old=normalize({...blank,status:'Terminé',kind:'Gestion documentaire',details:JSON.stringify({validation:'Approuvé',review:'2026-12-01'})});assert.equal(old.status,'Approuvé');assert.equal(old.due,'2026-12-01');assert.equal(closed(old),false);
assert(validate({...blank,title:'Audit',kind:'Audit',status:'Planifié',owner:'QSE',details:{scope:'Atelier',reference:'Interne'}}).some(e=>e.includes('date prévue')));
console.log('12 contrôles métier réussis : clôture, liens, dates, révisions, compatibilité des anciennes fiches.');
}finally{fs.rmSync(dir,{recursive:true,force:true})}
