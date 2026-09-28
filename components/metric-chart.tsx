'use client';
import {useState,type ReactNode} from 'react';
import {Bar,BarChart,CartesianGrid,Cell,Line,LineChart,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {Dialog,DialogContent,DialogDescription,DialogTitle} from '@/components/ui/dialog';
import type {Widget} from '@/lib/unit-dashboard';

export type Point={label:string;value:number};
export const chartModes={bar:'Bâtons',pie:'Camembert',donut:'Anneau',line:'Courbe'} as const;
const palette=['#005eaa','#57a5d2','#7d8ed5','#60aa74','#e69b4a','#cb6671','#697c93'];
const number=(n:number)=>n.toLocaleString('fr-FR',{maximumFractionDigits:2});

export function MetricChart({title,points,mode='bar',accent='#005eaa',caption,details,detailsContent}:{title:string;points:Point[];mode?:Widget['chartType'];accent?:string;caption?:string;details?:string;detailsContent?:ReactNode}){
  const [open,setOpen]=useState(false),valid=points.filter(p=>Number.isFinite(p.value)),pie=mode==='pie'||mode==='donut',hasNegative=valid.some(p=>p.value<0),hasPositive=valid.some(p=>p.value>0);
  const canPlot=valid.length>0&&(!pie||(!hasNegative&&hasPositive));
  return <>
    <button type="button" className="metric-chart-trigger" onClick={()=>setOpen(true)} aria-label={'Voir le détail de '+title}>
      {canPlot?<div className="metric-chart-plot" aria-hidden="true"><ResponsiveContainer width="100%" height="100%">
        {pie?<PieChart><Pie data={valid} dataKey="value" nameKey="label" innerRadius={mode==='donut'?'48%':0} outerRadius="85%" stroke="#fff" strokeWidth={2}>{valid.map((_,i)=><Cell key={i} fill={i?palette[i%palette.length]:accent}/>)}</Pie><Tooltip formatter={(value:any)=>number(Number(value))}/></PieChart>:
          mode==='line'?<LineChart data={valid} margin={{top:10,right:12,bottom:0,left:-18}}><CartesianGrid vertical={false} stroke="#e9eef4"/><XAxis dataKey="label" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip formatter={(value:any)=>number(Number(value))}/><Line type="monotone" dataKey="value" stroke={accent} strokeWidth={3} dot={{r:4}}/></LineChart>:
          <BarChart data={valid} margin={{top:10,right:12,bottom:0,left:-18}}><CartesianGrid vertical={false} stroke="#e9eef4"/><XAxis dataKey="label" tick={{fontSize:12}}/><YAxis tick={{fontSize:12}}/><Tooltip formatter={(value:any)=>number(Number(value))}/><Bar dataKey="value" fill={accent} radius={[4,4,0,0]} maxBarSize={55}/></BarChart>}
      </ResponsiveContainer></div>:<div className="metric-chart-empty">{pie&&hasNegative?'Le camembert nécessite des valeurs positives.':'Renseignez des valeurs pour afficher le graphique.'}</div>}
      <span className="metric-chart-hint">Cliquer pour voir le détail →</span>
    </button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="metric-detail-dialog"><DialogTitle>{title}</DialogTitle><DialogDescription>{caption||'Détail des valeurs affichées dans ce graphique.'}</DialogDescription>
      <div className="metric-detail-plot">{canPlot&&<ResponsiveContainer width="100%" height="100%">{pie?<PieChart><Pie data={valid} dataKey="value" nameKey="label" innerRadius={mode==='donut'?'48%':0} outerRadius="85%">{valid.map((_,i)=><Cell key={i} fill={i?palette[i%palette.length]:accent}/>)}</Pie><Tooltip formatter={(value:any)=>number(Number(value))}/></PieChart>:mode==='line'?<LineChart data={valid}><CartesianGrid vertical={false} stroke="#e9eef4"/><XAxis dataKey="label"/><YAxis/><Tooltip formatter={(value:any)=>number(Number(value))}/><Line dataKey="value" stroke={accent} strokeWidth={3}/></LineChart>:<BarChart data={valid}><CartesianGrid vertical={false} stroke="#e9eef4"/><XAxis dataKey="label"/><YAxis/><Tooltip formatter={(value:any)=>number(Number(value))}/><Bar dataKey="value" fill={accent} maxBarSize={70}/></BarChart>}</ResponsiveContainer>}</div>
      <div className="metric-detail-table"><table><thead><tr><th>Élément</th><th>Valeur</th></tr></thead><tbody>{valid.map((p,i)=><tr key={i}><td>{p.label}</td><td>{number(p.value)}</td></tr>)}</tbody></table>{!valid.length&&<p>Aucune valeur renseignée.</p>}</div>{details&&<p className="metric-detail-note">{details}</p>}{detailsContent}
    </DialogContent></Dialog>
  </>
}
