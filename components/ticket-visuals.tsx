'use client';
import {categoryVisuals,teamVisual} from '@/lib/ticket-visuals';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
export function CategoryMark({name}:{name:string}){const v=categoryVisuals[name]||categoryVisuals.Autre;return <span className="ticket-visual-label" data-tone={v.tone}><v.Icon size={16} aria-hidden="true"/><span>{name}</span></span>}
export function TeamMark({id,name}:{id:string;name:string}){const v=teamVisual(id);return <span className="ticket-visual-label" data-team-family={v.family}><v.Icon size={16} aria-hidden="true"/><span>{name}</span></span>}
export function TicketVisualSelect({value,onChange,options,label,allLabel,kind='category',disabled=false}:{value:string;onChange:(v:string)=>void;options:{id:string;name:string}[];label:string;allLabel?:string;kind?:'category'|'team';disabled?:boolean}){
return <Select value={value||'__all__'} onValueChange={v=>onChange(v==='__all__'?'':v)} disabled={disabled}><SelectTrigger aria-label={label} className="ticket-visual-select" data-tone={kind==='category'?categoryVisuals[value]?.tone:undefined} data-team-family={kind==='team'&&value?teamVisual(value).family:undefined}><SelectValue/></SelectTrigger><SelectContent className="ticket-visual-options" position="popper">{allLabel&&<SelectItem value="__all__">{allLabel}</SelectItem>}{options.map(o=><SelectItem key={o.id} value={o.id}>{kind==='category'?<CategoryMark name={o.name}/>:<TeamMark id={o.id} name={o.name}/>}</SelectItem>)}</SelectContent></Select>;
}
