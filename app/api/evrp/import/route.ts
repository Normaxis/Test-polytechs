import {database} from '@/db/raw';
import {checkOrigin,requireRole} from '@/lib/access';
import {evrpSource} from '@/lib/evrp-private-source';
const CHUNK=25;
const fail=(error:string,status:number)=>Response.json({error},{status});
export async function POST(req:Request){try{if(!checkOrigin(req))return fail('Requête non autorisée.',403);const gate=await requireRole(req,'admin');if(gate.error)return gate.error;if(!evrpSource)return fail('Aucun classeur source préparé sur cette installation.',404);const body=await req.json() as {kind?:string;cursor?:number};const kind=body.kind,cursor=body.cursor;if(!kind||!['units','risks','actions','updates'].includes(kind)||!Number.isInteger(cursor)||cursor!<0)return fail('Import invalide.',400);
const db=database(),now=new Date().toISOString(),list=(evrpSource as any)[kind] as any[],start=cursor as number;const batch=list.slice(start,start+CHUNK).map((item)=>{
if(kind==='units')return db.prepare('INSERT OR IGNORE INTO evrp_units (code,name,roles,source_ref,revision,updated_at) VALUES (?,?,?,?,1,?)').bind(item.code,item.name,JSON.stringify(item.roles),`Définition unités de travail · ligne ${item.sourceRow}`,now);
if(kind==='risks')return db.prepare('INSERT OR IGNORE INTO evrp_risks (id,unit_code,data,original,status,revision,updated_at,updated_by) VALUES (?,?,?,?,?,1,?,?)').bind(item.id,item.unitCode,JSON.stringify(item),JSON.stringify(item),'À vérifier',now,'Import 2026');
if(kind==='actions')return db.prepare('INSERT OR IGNORE INTO evrp_actions (id,unit_code,risk_id,data,revision,updated_at,updated_by) VALUES (?,?,?, ?,1,?,?)').bind(item.id,item.unitCode||'','',JSON.stringify({...item,status:item.status||'À définir'}),now,'Import 2026');
return db.prepare('INSERT OR IGNORE INTO evrp_revisions (id,date,kind,description,author,created_at) VALUES (?,?,?,?,?,?)').bind(`source-${item.sourceRow}`,item.date,item.kind,item.description,'Classeur 2026',now)
});if(batch.length)await db.batch(batch);const next=start+batch.length;return Response.json({kind,imported:next,total:list.length,nextCursor:next<list.length?next:null});
}catch(e){console.error(e);return fail('Import interrompu. Relancez-le : les lignes déjà importées sont conservées.',503)}}
