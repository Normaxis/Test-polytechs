'use client';
import {useEffect,useState,type CSSProperties} from 'react';
import {LayoutDashboard,FileText,ClipboardList,TriangleAlert,HardHat as EpiIcon,Recycle,Leaf,BookOpen,FileCheck2,Sparkles,HeartPulse,ShieldAlert,LayoutList,Users,BriefcaseBusiness,CalendarDays,FlaskConical,Factory,Truck,HardHat,ShoppingCart,HeartHandshake,Wrench,Monitor,ShieldCheck,Lightbulb,Network} from 'lucide-react';
export type Team={id:string;name:string;rank:number;parent_id:string|null;revision:number};
export type BoardLink={id:string;team_id:string;title:string;unit_code:string};

const icons={direction:BriefcaseBusiness,qsse:ShieldCheck,commercial:BriefcaseBusiness,planification:CalendarDays,rd:Lightbulb,production:Factory,laboratoire:FlaskConical,logistique:Truck,'travaux-neufs':HardHat,achats:ShoppingCart,rh:HeartHandshake,procedes:Network,maintenance:Wrench,informatique:Monitor} as const;
const groups=[
  {name:'Management',ids:['direction','qsse'],accent:'#74369a'},
  {name:'Réalisation',ids:['commercial','planification','rd','production','laboratoire','logistique'],accent:'#0875bb'},
  {name:'Support',ids:['travaux-neufs','achats','rh','procedes','maintenance','informatique'],accent:'#df6924'},
];

const qsseSections=[
  {name:'Prévention',links:[
    ['DUERP','/duerp',FileText],
    ['PAPRIPACT','/duerp?tab=program',ClipboardList],
    ['Accidents du travail','/qse#'+encodeURIComponent('Accidents du travail'),HeartPulse],
    ['Situations dangereuses','/qse#'+encodeURIComponent('Situations dangereuses'),TriangleAlert],
    ['Stock EPI · catalogue','/epi-stock',EpiIcon],
    ['Dotations EPI','/qse#EPI',EpiIcon],
    ['Plans de prévention','/qse#'+encodeURIComponent('Plans de prévention'),ShieldAlert],
  ]},
  {name:'Environnement',links:[
    ['Gestion des déchets','/qse#'+encodeURIComponent('Gestion des déchets'),Recycle],
    ['Analyse environnementale','/qse#'+encodeURIComponent('Analyse environnementale'),Leaf],
    ['RSE','/qse#RSE',Sparkles],
  ]},
  {name:'Qualité',links:[
    ['Gestion documentaire','/qse#'+encodeURIComponent('Gestion documentaire'),BookOpen],
    ['Réglementation','/qse#'+encodeURIComponent('Réglementation'),FileCheck2],
    ['Amélioration continue','/qse#'+encodeURIComponent('Amélioration continue'),LayoutList],
  ]},
] as const;
const management=new Set(groups[0].ids);
const realization=new Set(groups[1].ids);
function theme(id:string):CSSProperties{
  const accent=management.has(id)?groups[0].accent:realization.has(id)?groups[1].accent:groups[2].accent;
  return {'--team-accent':accent} as CSSProperties;
}

export function TeamTree({teams,boards,selected,disabled,onSelect,onTeam}:{teams:Team[];boards:BoardLink[];selected?:string;disabled?:boolean;onSelect?:(id:string)=>void;onTeam?:(team:Team)=>void}){
  function teamNode(t:Team){
    const Icon=icons[t.id as keyof typeof icons]||Users;
    const teamBoards=boards.filter(b=>b.team_id===t.id);
    return <div className={'team-node rank-'+t.rank} key={t.id} style={theme(t.id)}>
      <details>
        <summary aria-label={'Afficher les tableaux de '+t.name}>
          <span className="team-pictogram"><Icon size={17} strokeWidth={2}/></span>
          <span className="team-name">{t.name}</span>
          <small>Rang {t.rank}</small>
        </summary>
        <div className="team-boards">
          {t.id==='qsse'&&<div className="qsse-shortcuts">{qsseSections.map(section=><div className="qsse-section" key={section.name}><p>{section.name}</p>{section.links.map(([label,href,LinkIcon])=><a href={href} key={label}><LinkIcon size={15} aria-hidden="true"/><span>{label}</span></a>)}</div>)}</div>}
          {t.id==='qsse'&&teamBoards.length>0&&<p className="qsse-board-label">Tableaux de bord</p>}
          {teamBoards.map(b=>onSelect?<button key={b.id} disabled={disabled} aria-current={selected===b.id?'page':undefined} onClick={()=>onSelect(b.id)}><LayoutDashboard size={14}/><span>{b.title}</span></button>:<a key={b.id} href={'/unites?board='+encodeURIComponent(b.id)}><LayoutDashboard size={14}/><span>{b.title}</span></a>)}
          {onTeam&&<button disabled={disabled} className="team-open" onClick={()=>onTeam(t)}>Ouvrir {t.rank===1?'la direction':'le service'}</button>}
          {!teamBoards.length&&<small className="team-no-board">Aucun tableau</small>}
        </div>
      </details>
    </div>;
  }
  const known=new Set(groups.flatMap(g=>g.ids));
  const sections=groups.map(g=>({...g,items:g.ids.flatMap(id=>teams.filter(t=>t.id===id))}));
  const other=teams.filter(t=>!known.has(t.id)).sort((a,b)=>a.rank-b.rank||a.name.localeCompare(b.name,'fr'));
  if(other.length)sections.push({name:'Autres services',ids:[],accent:groups[2].accent,items:other});
  return <nav className="team-tree" aria-label="Services et tableaux de bord">{sections.filter(g=>g.items.length).map(g=><section className="team-group" key={g.name} style={{'--team-accent':g.accent} as CSSProperties}><h3>{g.name}</h3>{g.items.map(teamNode)}</section>)}</nav>;
}
export function HomeTeamNavigation(){const [data,setData]=useState<{teams:Team[];boards:BoardLink[]}|null>(null),[error,setError]=useState(false);useEffect(()=>{const c=new AbortController();fetch('/api/dashboards',{signal:c.signal}).then(async r=>{if(!r.ok)throw Error();setData(await r.json())}).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>c.abort()},[]);return <div className="home-team-navigation"><p className="navlabel">SERVICES ET TABLEAUX</p>{data?<TeamTree teams={data.teams} boards={data.boards}/>:<a href="/unites">{error?'Ouvrir les services':'Chargement des services…'}</a>}</div>}
