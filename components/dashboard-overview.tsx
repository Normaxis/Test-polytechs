'use client';
import {useEffect,useMemo,useState} from 'react';
import {CalendarDays,MessageSquareText,Play,ShieldCheck} from 'lucide-react';
import {serviceHref} from '@/lib/navigation';
import {MetricChart,chartModes} from '@/components/metric-chart';
import type {Widget} from '@/lib/unit-dashboard';
import type {Team} from '@/components/team-navigation';
import {occurrenceDates,todayParis,type Routine,type Row} from '@/lib/hub';

type Ticket={id:string;title:string;category:string;status:string;due:string;updated_at:string};
type Count={open:number;closed:number;total:number};
type Communication={id:string;data:{title:string;body:string;teams:string[];sourceTeam:string};created_at:string};
type Run={routine_id?:string;routineId?:string;date:string;data:{completed:boolean}};

export function DashboardOverview({teamId,teamName,teams,refresh}:{teamId:string;teamName:string;teams:Team[];refresh:number}){
  const scopeIds=[teamId];
  const [chartModesByCategory,setChartModesByCategory]=useState<Record<string,Widget['chartType']>>({});
  useEffect(()=>{const stored:Record<string,Widget['chartType']>={};for(const category of ['Sécurité','Qualité','Environnement','Production','Maintenance','R&D','Ressources humaines','Autre']){const mode=localStorage.getItem('polytechs-chart-'+teamId+'-'+category);if(mode&&Object.hasOwn(chartModes,mode))stored[category]=mode as Widget['chartType']}setChartModesByCategory(stored)},[teamId]);
  const [routines,setRoutines]=useState<Row<Routine>[]>([]),[runs,setRuns]=useState<Run[]>([]),[messages,setMessages]=useState<Communication[]>([]),[tickets,setTickets]=useState<Ticket[]>([]),[counts,setCounts]=useState<Record<string,Count>>({}),[statsDate,setStatsDate]=useState(''),[error,setError]=useState(false);
  const today=todayParis(),month=today.slice(0,7),from=month+'-01',to=month+'-'+String(new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate()).padStart(2,'0');
  useEffect(()=>{let live=true;setError(false);setCounts({});setTickets([]);setMessages([]);setRoutines([]);setRuns([]);setStatsDate('');Promise.all([
    fetch('/api/hub?scope=routines&from='+from+'&to='+to+'&team='+encodeURIComponent(teamId)).then(r=>{if(!r.ok)throw Error();return r.json()}),
    fetch('/api/hub?scope=communications&team='+encodeURIComponent(teamId)).then(r=>{if(!r.ok)throw Error();return r.json()}),
    fetch('/api/hub?scope=overview-stats&team='+encodeURIComponent(teamId)).then(r=>{if(!r.ok)throw Error();return r.json()})
  ]).then(([a,b,c]:any[])=>{if(live){setRoutines(a.routines);setRuns(a.runs);setMessages(b.rows);setTickets(c.recent);setCounts(c.counts);setStatsDate(c.updatedAt)}}).catch(()=>{if(live)setError(true)});return()=>{live=false}},[from,to,teamId,refresh]);
  const events=useMemo(()=>routines.filter(r=>r.data.active&&r.data.teams.some(id=>scopeIds.includes(id))).flatMap(r=>occurrenceDates(r.data,from,to).map(date=>({routine:r,date}))),[routines,teamId,teams,from,to]);
  const complete=events.filter(e=>runs.some(r=>(r.routine_id||r.routineId)===e.routine.id&&r.date===e.date&&r.data.completed)).length;
  const next=events.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const message=messages.find(m=>m.data.teams.some(id=>scopeIds.includes(id)));
  const colors:Record<string,string>={'Sécurité':'#fff1e8','Qualité':'#f2edfc','Environnement':'#eaf7ed'};
  const categories=[...new Set(['Sécurité','Qualité','Environnement',...Object.keys(counts)])];
  return <section className="dashboard-overview" aria-label={'Vue d’ensemble de '+teamName}>
    <div className="overview-top">
      <article className="overview-card overview-meeting"><div className="overview-clock" aria-hidden="true"><span>{new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit'}).format(new Date())}</span></div><div><h3>Point d’équipe</h3><p>{teamName}</p><a href={serviceHref('/routines',teamId)}><Play size={15}/> Ouvrir les routines</a></div></article>
      <article className="overview-card"><div className="overview-card-head"><h3><CalendarDays size={17}/> Routines</h3><a href={serviceHref('/routines',teamId)}>Calendrier</a></div><div className="overview-routine"><strong>{error?'—':complete+' / '+events.length}</strong><span>audits terminés ce mois</span></div><p>{error?'Données indisponibles':next?'Prochain audit : '+next.routine.data.title+' · '+new Date(next.date+'T12:00:00').toLocaleDateString('fr-FR'):'Aucun audit à venir pour cette équipe'}</p></article>
      <article className="overview-card"><div className="overview-card-head"><h3><MessageSquareText size={17}/> Communication</h3><a href={serviceHref('/communication',teamId)}>Toutes</a></div>{error?<p>Données indisponibles</p>:message?<><strong className="overview-message-title">{message.data.title}</strong><p className="overview-excerpt">{message.data.body}</p><small>{new Date(message.created_at).toLocaleDateString('fr-FR')}</small></>:<p>Aucune communication adressée à cette équipe.</p>}</article>
    </div>
    <div className="overview-chart-controls"><span>Indicateurs · tickets attribués à {teamName}</span><small>{statsDate?'Actualisé le '+new Date(statsDate).toLocaleString('fr-FR'):'Chargement…'} · depuis le début</small></div><div className="overview-metrics">{categories.map(category=>{const count=counts[category]||{open:0,closed:0,total:0},related=tickets.filter(t=>t.category===category),mode=chartModesByCategory[category]||'bar';return <article className="overview-metric" key={category} style={{'--category-color':colors[category]||'#e7eff5'} as React.CSSProperties}><div className="overview-band"><ShieldCheck size={16}/>{category}</div><div className="overview-metric-body"><span>Tickets ouverts</span><strong>{error?'—':count.open}</strong><label className="overview-mode">Vue <select aria-label={'Type de graphique '+category} value={mode} onChange={e=>{const next=e.target.value as Widget['chartType'];setChartModesByCategory(v=>({...v,[category]:next}));localStorage.setItem('polytechs-chart-'+teamId+'-'+category,next||'bar')}}>{Object.entries(chartModes).filter(([key])=>key!=='line').map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><MetricChart title={'Tickets · '+category} mode={mode} points={error?[]:[{label:'Ouverts',value:count.open},{label:'Clôturés',value:count.closed}]} caption={'Tickets attribués à '+teamName+' · depuis le début · actualisé le '+(statsDate?new Date(statsDate).toLocaleString('fr-FR'):'—')} detailsContent={<div className="overview-ticket-detail"><h3>Tickets de l’équipe</h3>{related.length?related.map(t=><a key={t.id} href={serviceHref('/tickets?id='+encodeURIComponent(t.id),teamId)}><strong>{t.title}</strong><span>{t.status}{t.due?' · échéance '+new Date(t.due+'T12:00:00').toLocaleDateString('fr-FR'):''}</span></a>):<p>Aucun ticket récent dans cette catégorie.</p>}{count.total>related.length&&<p>Les {count.total} tickets sont comptés ; seuls les {related.length} plus récents de cette catégorie sont listés ici.</p>}<a className="overview-all-tickets" href={serviceHref('/tickets',teamId)}>Voir les tickets du service</a></div>}/></div></article>})}</div>
  </section>
}
