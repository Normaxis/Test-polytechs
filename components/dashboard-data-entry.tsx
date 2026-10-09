"use client";
import {useState} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {hubRequest} from '@/lib/hub-request';
import type {Widget} from '@/lib/unit-dashboard';
export function DashboardDataEntry({id,revision,widgets,onSaved}:{id:string;revision:number;widgets:Widget[];onSaved:()=>void}){
 const [open,setOpen]=useState(false),[values,setValues]=useState<{id:string;title:string;value:string;date:string;text:string}[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const indicators=widgets.filter(w=>w.type==='indicator');if(!indicators.length)return null;
 async function save(){setBusy(true);setError('');try{await hubRequest('/api/dashboards',{action:'indicator-values',id,revision,values:values.map(({title,...v})=>v)});setOpen(false);onSaved()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <><button className="outline" onClick={()=>{setValues(indicators.map(({id,title,value,date,text})=>({id,title,value,date,text})));setError('');setOpen(true)}}>Renseigner les indicateurs</button><Dialog open={open} onOpenChange={v=>{if(!busy)setOpen(v)}}><DialogContent className="team-settings-dialog"><DialogTitle>Saisie des indicateurs</DialogTitle><DialogDescription>Renseignez les valeurs et leur date. Les objectifs et la présentation sont gérés par le coordinateur.</DialogDescription>{error&&<p className="error" role="alert">{error}</p>}<fieldset disabled={busy}>{values.map((v,i)=><section key={v.id}><h3>{v.title}</h3>{(['value','date','text'] as const).map(key=><label key={key}>{{value:'Valeur',date:'Date de mesure',text:'Commentaire'}[key]}<input type={key==='date'?'date':'text'} maxLength={key==='text'?4000:120} value={v[key]} onChange={e=>setValues(items=>items.map((item,j)=>j===i?{...item,[key]:e.target.value}:item))}/></label>)}</section>)}</fieldset><button className="primary" disabled={busy} onClick={save}>{busy?'Enregistrement…':'Enregistrer les valeurs'}</button></DialogContent></Dialog></>
}
