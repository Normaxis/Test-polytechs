'use client';
import {useEffect,useState,type CSSProperties} from 'react';
import {LayoutDashboard,Users,BriefcaseBusiness,CalendarDays,FlaskConical,Factory,Truck,HardHat,ShoppingCart,HeartHandshake,Wrench,Monitor,ShieldCheck,Lightbulb,Network} from 'lucide-react';
export type Team={id:string;name:string;rank:number;parent_id:string|null;revision:number};
export type BoardLink={id:string;team_id:string;title:string;unit_code:string};

const icons={direction:BriefcaseBusiness,qsse:ShieldCheck,commercial:BriefcaseBusiness,planification:CalendarDays,rd:Lightbulb,production:Factory,laboratoire:FlaskConical,logistique:Truck,'travaux-neufs':HardHat,achats:ShoppingCart,rh:HeartHandshake,procedes:Network,maintenance:Wrench,informatique:Monitor} as const;
const management=new Set(['direction','qsse']);
const realization=new Set(['commercial','planification','rd','production','laboratoire','logistique']);
function theme(id:string):CSSProperties{
  const [accent,soft]=management.has(id)?['#74369a','#f4eafa']:realization.has(id)?['#0875bb','#e9f5fc']:['#df6924','#fff0e6'];
  return {'--team-accent':accent,'--team-soft':soft} as CSSProperties;
}

export function TeamTree({teams,boards,selected,disabled,onSelect,onTeam}:{teams:Team[];boards:BoardLink[];selected?:string;disabled?:boolean;onSelect?:(id:string)=>void;onTeam?:(team:Team)=>void}){
  function teamNode(t:Team){
    const Icon=icons[t.id as keyof typeof icons]||Users;
    const teamBoards=boards.filter(b=>b.team_id===t.id);
    const children=teams.filter(c=>c.parent_id===t.id&&c.rank===2);
    return <div className={'team-node rank-'+t.rank} key={t.id} style={theme(t.id)}>
      <details>
        <summary aria-label={'Afficher les tableaux de '+t.name}>
          <span className="team-pictogram"><Icon size={17} strokeWidth={2}/></span>
          <span className="team-name">{t.name}</span>
          <small>Rang {t.rank}</small>
        </summary>
        <div className="team-boards">
          {teamBoards.map(b=>onSelect?<button key={b.id} disabled={disabled} aria-current={selected===b.id?'page':undefined} onClick={()=>onSelect(b.id)}><LayoutDashboard size={14}/><span>{b.title}</span></button>:<a key={b.id} href={'/unites?board='+encodeURIComponent(b.id)}><LayoutDashboard size={14}/><span>{b.title}</span></a>)}
          {onTeam&&<button disabled={disabled} className="team-open" onClick={()=>onTeam(t)}>Ouvrir {t.rank===1?'la direction':'le service'}</button>}
          {!teamBoards.length&&<small className="team-no-board">Aucun tableau</small>}
        </div>
      </details>
      {children.map(teamNode)}
    </div>;
  }
  return <nav className="team-tree" aria-label="Services et tableaux de bord">{teams.filter(t=>t.rank===1).map(teamNode)}</nav>;
}
export function HomeTeamNavigation(){const [data,setData]=useState<{teams:Team[];boards:BoardLink[]}|null>(null),[error,setError]=useState(false);useEffect(()=>{const c=new AbortController();fetch('/api/dashboards',{signal:c.signal}).then(async r=>{if(!r.ok)throw Error();setData(await r.json())}).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>c.abort()},[]);return <div className="home-team-navigation"><p className="navlabel">SERVICES ET TABLEAUX</p>{data?<TeamTree teams={data.teams} boards={data.boards}/>:<a href="/unites">{error?'Ouvrir les services':'Chargement des services…'}</a>}</div>}
