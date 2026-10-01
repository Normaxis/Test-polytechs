import {database} from '@/db/raw';
import {requireRole} from '@/lib/access';
import {occurrenceDates,todayParis,type Routine} from '@/lib/hub';
import {qualityActions} from '@/lib/quality-server';
import {actionTeam,effectiveness} from '@/lib/quality-actions';
import {accessibleTeams} from '@/lib/team-access';

export type WorkItem={id:string;title:string;source:'Ticket'|'DUERP / PAPRIPACT'|'Fiche QSE'|'Routine'|'Plan consolidé';sourceTitle:string;sourceHref:string;href:string;category:string;teamIds:string[];unitCode:string;pilot:string;pilotId:string;due:string;status:string;closed:boolean;origin:string;updatedAt:string};

export async function GET(req:Request){
  try{
    const gate=await requireRole(req);if(gate.error)return gate.error;
    const db=database();
    const today=todayParis(),end=new Date(today+'T12:00:00Z');end.setUTCDate(end.getUTCDate()+30);const through=end.toISOString().slice(0,10);
    const [tickets,evrp,records,users,routines,runs]=await Promise.all([
      db.prepare('SELECT id,data,updated_at FROM hub_tickets ORDER BY updated_at DESC').all(),
      db.prepare('SELECT id,unit_code,risk_id,data,updated_at FROM evrp_actions ORDER BY updated_at DESC').all(),
      db.prepare(gate.user!.role==='reader'?"SELECT r.id,r.title,r.domain,r.status,r.owner,r.due,r.source_id,r.updated,r.created FROM records r WHERE r.kind='Action' AND NOT EXISTS (SELECT 1 FROM records src WHERE src.id=r.source_id AND src.kind='Accidents du travail') ORDER BY r.created DESC":"SELECT id,title,domain,status,owner,due,source_id,updated,created FROM records WHERE kind='Action' ORDER BY created DESC").all(),
      db.prepare('SELECT id,display_name FROM users').all(),
      db.prepare('SELECT id,data,updated_at FROM hub_routines').all(),
      db.prepare('SELECT routine_id,date,data FROM hub_runs WHERE date>=? AND date<=?').bind(today,through).all()
    ]);
    const names=new Map(users.results.map((u:any)=>[u.id,u.display_name]));
    const items:WorkItem[]=[];
    for(const row of tickets.results as any[]){const t=JSON.parse(row.data);if(t.archivedAt||t.qualityActionId&&!t.actions?.length)continue;const href='/tickets?id='+encodeURIComponent(row.id);const tasks=Array.isArray(t.actions)&&t.actions.length?t.actions:[null];for(const task of tasks){const pilotId=task?.pilot||t.pilot||'';items.push({id:'ticket:'+row.id+(task?':'+task.id:''),title:task?.title||t.title,source:'Ticket',sourceTitle:t.title,sourceHref:href,href,category:t.category,teamIds:t.teams||[],unitCode:'',pilot:String(names.get(pilotId)||''),pilotId,due:task?.due||t.due||'',status:task?(task.done?'Clôturée':t.status==='Clôturé'?'À vérifier':t.status):t.status,closed:task?!!task.done:t.status==='Clôturé',origin:t.source?'Audit · '+t.source.date:'Ticket',updatedAt:row.updated_at})}}
    for(const row of evrp.results as any[]){const a=JSON.parse(row.data),href='/duerp?unit='+encodeURIComponent(row.unit_code)+'&tab=actions&action='+encodeURIComponent(row.id);items.push({id:'evrp:'+row.id,title:a.description,source:'DUERP / PAPRIPACT',sourceTitle:a.description,sourceHref:href,href,category:'Sécurité',teamIds:[],unitCode:row.unit_code,pilot:a.owner||'',pilotId:'',due:a.due||'',status:a.status,closed:a.status==='Clôturée',origin:row.risk_id?'Risque DUERP lié':'Mesure de prévention',updatedAt:row.updated_at})}
    for(const row of records.results as any[]){const href='/qse?record='+encodeURIComponent(row.id);items.push({id:'record:'+row.id,title:row.title,source:'Fiche QSE',sourceTitle:row.title,sourceHref:href,href,category:row.domain,teamIds:[],unitCode:'',pilot:row.owner||'',pilotId:'',due:row.due||'',status:row.status,closed:row.status==='Clôturée',origin:row.source_id?'Fiche QSE liée':'Action QSE',updatedAt:row.updated||row.created})}
    const runMap=new Map((runs.results as any[]).map(r=>[r.routine_id+':'+r.date,JSON.parse(r.data)]));
    for(const row of routines.results as any[]){const r=JSON.parse(row.data) as Routine;for(const date of occurrenceDates(r,today,through)){const href='/routines?routine='+encodeURIComponent(row.id)+'&date='+date,completed=!!runMap.get(row.id+':'+date)?.completed;items.push({id:'routine:'+row.id+':'+date,title:r.title,source:'Routine',sourceTitle:r.title,sourceHref:href,href,category:'Audit',teamIds:r.teams,unitCode:'',pilot:String(names.get(r.pilot)||''),pilotId:r.pilot,due:date,status:completed?'Terminée':'À réaliser',closed:completed,origin:'Audit programmé',updatedAt:row.updated_at})}}
    for(const a of (await qualityActions()).values()){const href='/plan-actions?id='+encodeURIComponent(a.id),effective=effectiveness(a);items.push({id:'quality:'+a.id,title:a.action||a.problem||'Action à définir',source:'Plan consolidé',sourceTitle:a.reference,sourceHref:href,href,category:'Qualité',teamIds:[actionTeam(a)],unitCode:'',pilot:a.pilot,pilotId:a.pilotId,due:a.due,status:['SOLDEE','CLOTUREE'].includes(a.status)&&effective!=='Efficace'?'À vérifier':a.status,closed:a.status==='ANNULEE'||effective==='Efficace',origin:a.origin,updatedAt:a.created})}const allowed=await accessibleTeams(gate.user!);return Response.json({items:items.filter(i=>!i.teamIds.length||i.teamIds.some(id=>allowed.has(id)))},{headers:{'Cache-Control':'no-store'}});
  }catch(e){console.error(e);return Response.json({error:'Plan d’actions indisponible.'},{status:503})}
}
