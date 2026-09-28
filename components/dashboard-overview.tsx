'use client';
import {useEffect,useMemo,useState} from 'react';
import {CalendarDays,MessageSquareText,Play,ShieldCheck} from 'lucide-react';
import {MetricChart,chartModes} from '@/components/metric-chart';
import type {Widget} from '@/lib/unit-dashboard';
import {occurrenceDates,todayParis,type Routine,type Row} from '@/lib/hub';

type Ticket={id:string;data:{title:string;category:string;status:string;teams:string[];due:string;pilot:string}};
type Communication={id:string;data:{title:string;body:string;teams:string[];sourceTeam:string};created_at:string};
type Run={routine_id?:string;routineId?:string;date:string;data:{completed:boolean}};

export function DashboardOverview({teamId,teamName,refresh}:{teamId:string;teamName:string;refresh:number}){
  const [chartMode,setChartMode]=useState<Widget['chartType']>('bar');
  useEffect(()=>{const saved=localStorage.getItem('polytechs-overview-chart');if(saved&&Object.hasOwn(chartModes,saved))setChartMode(saved as Widget['chartType'])},[]);
  const [routines,setRoutines]=useState<Row<Routine>[]>([]),[runs,setRuns]=useState<Run[]>([]),[messages,setMessages]=useState<Communication[]>([]),[tickets,setTickets]=useState<Ticket[]>([]),[error,setError]=useState(false);
  const today=todayParis(),month=today.slice(0,7),from=month+'-01',to=month+'-'+String(new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate()).padStart(2,'0');
  useEffect(()=>{let live=true;setError(false);Promise.all([
    fetch('/api/hub?scope=routines&from='+from+'&to='+to).then(r=>{if(!r.ok)throw Error();return r.json()}),
    fetch('/api/hub?scope=communications').then(r=>{if(!r.ok)throw Error();return r.json()}),
    fetch('/api/hub?scope=tickets').then(r=>{if(!r.ok)throw Error();return r.json()})
  ]).then(([a,b,c]:any[])=>{if(live){setRoutines(a.routines);setRuns(a.runs);setMessages(b.rows);setTickets(c.rows)}}).catch(()=>{if(live)setError(true)});return()=>{live=false}},[from,to,refresh]);
  const events=useMemo(()=>routines.filter(r=>r.data.active&&r.data.teams.includes(teamId)).flatMap(r=>occurrenceDates(r.data,from,to).map(date=>({routine:r,date}))),[routines,teamId,from,to]);
  const complete=events.filter(e=>runs.some(r=>(r.routine_id||r.routineId)===e.routine.id&&r.date===e.date&&r.data.completed)).length;
  const next=events.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const message=messages.find(m=>m.data.teams.includes(teamId));
  const open=tickets.filter(t=>t.data.teams.includes(teamId)&&t.data.status!=='Clôturé');
  const categories=[['Sécurité','#d9f0df'],['Qualité','#e6e4f5'],['Environnement','#dceef6']] as const;
  return <section className="dashboard-overview" aria-label={'Vue d’ensemble de '+teamName}>
    <div className="overview-top">
      <article className="overview-card overview-meeting"><div className="overview-clock" aria-hidden="true"><span>{new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit'}).format(new Date())}</span></div><div><h3>Point d’équipe</h3><p>{teamName}</p><a href="/routines"><Play size={15}/> Ouvrir les routines</a></div></article>
      <article className="overview-card"><div className="overview-card-head"><h3><CalendarDays size={17}/> Routines</h3><a href="/routines">Calendrier →</a></div><div className="overview-routine"><strong>{error?'—':complete+' / '+events.length}</strong><span>audits terminés ce mois</span></div><p>{error?'Données indisponibles':next?'Prochain audit : '+next.routine.data.title+' · '+new Date(next.date+'T12:00:00').toLocaleDateString('fr-FR'):'Aucun audit à venir pour cette équipe'}</p></article>
      <article className="overview-card"><div className="overview-card-head"><h3><MessageSquareText size={17}/> Communication</h3><a href="/communication">Toutes →</a></div>{error?<p>Données indisponibles</p>:message?<><strong className="overview-message-title">{message.data.title}</strong><p className="overview-excerpt">{message.data.body}</p><small>{new Date(message.created_at).toLocaleDateString('fr-FR')}</small></>:<p>Aucune communication adressée à cette équipe.</p>}</article>
    </div>
    <div className="overview-chart-controls"><span>Indicateurs · tickets de {teamName}</span><label>Graphique <select value={chartMode} onChange={e=>{const mode=e.target.value as Widget['chartType'];setChartMode(mode);localStorage.setItem('polytechs-overview-chart',mode||'bar')}}>{Object.entries(chartModes).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div><div className="overview-metrics">{categories.map(([category,color])=>{const related=tickets.filter(t=>t.data.teams.includes(teamId)&&t.data.category===category),opened=related.filter(t=>t.data.status!=='Clôturé').length,closed=related.length-opened;return <article className="overview-metric" key={category} style={{'--category-color':color} as React.CSSProperties}><div className="overview-band"><ShieldCheck size={16}/>{category}</div><div className="overview-metric-body"><span>Tickets ouverts</span><strong>{error?'—':opened}</strong><MetricChart title={'Tickets · '+category} mode={chartMode} points={error?[]:[{label:'Ouverts',value:opened},{label:'Clôturés',value:closed}]} caption={'Tickets attribués à '+teamName} detailsContent={<div className="overview-ticket-detail"><h3>Tickets de l’équipe</h3>{related.length?related.map(t=><a key={t.id} href={'/tickets?id='+encodeURIComponent(t.id)}><strong>{t.data.title}</strong><span>{t.data.status}{t.data.due?' · échéance '+new Date(t.data.due+'T12:00:00').toLocaleDateString('fr-FR'):''}</span></a>):<p>Aucun ticket dans cette catégorie.</p>}<a className="overview-all-tickets" href="/tickets">Ouvrir le plan d’action →</a></div>}/></div></article>})}</div>
  </section>
}
