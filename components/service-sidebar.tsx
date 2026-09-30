'use client';
import {useState,type ReactNode} from 'react';
import {Menu,PanelLeftClose,LayoutDashboard} from 'lucide-react';
export function ServiceSidebar({children}:{children:ReactNode}){
  const [expanded,setExpanded]=useState(false);
  return <aside className="team-sidebar"><a className="team-brand" href="/unites" aria-label="Accueil Polytechs QSE"><img src="/polytechs-logo.png" alt="Polytechs"/></a><button type="button" className="service-menu-toggle" aria-expanded={expanded} aria-controls="service-navigation" onClick={()=>setExpanded(!expanded)}>{expanded?<PanelLeftClose size={19}/>:<Menu size={19}/>} Services et modules</button><div id="service-navigation" className={'service-sidebar-content '+(expanded?'is-open':'')}><a className="team-home" href="/unites"><LayoutDashboard size={17}/> Tableaux de bord</a>{children}</div></aside>;
}
