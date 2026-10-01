'use client';
import {useId,useState} from 'react';
import {Users} from 'lucide-react';
import {TeamMark} from '@/components/ticket-visuals';
import {teamVisual} from '@/lib/ticket-visuals';
import {Combobox,ComboboxValue,ComboboxChips,ComboboxChip,ComboboxChipsInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty,useComboboxAnchor} from '@/components/ui/combobox';
type Option={id:string;name:string};
function normalize(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim()}
export function TicketSearchPicker({options,value,onChange,disabled=false,label,kind='team'}:{options:Option[];value:string[];onChange:(ids:string[])=>void;disabled?:boolean;label:string;kind?:'team'|'person'}){
  const id=useId(),anchor=useComboboxAnchor(),[query,setQuery]=useState('');
  const selected=value.map(id=>options.find(o=>o.id===id)||{id,name:id});
  const mark=(o:Option)=>kind==='team'?<TeamMark id={o.id} name={o.name}/>:<span className="ticket-visual-label"><Users size={16} aria-hidden="true"/>{o.name}</span>;
  return <div className="ticket-search-picker"><label htmlFor={id}>{label}</label><Combobox multiple items={options} value={selected} onValueChange={items=>{onChange(items.map(o=>o.id));setQuery('')}} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={o=>o.name} isItemEqualToValue={(a,b)=>a.id===b.id} filter={(o,q)=>normalize(o.name).includes(normalize(q))} disabled={disabled}>
    <ComboboxChips ref={anchor} className="ticket-search-chips"><ComboboxValue>{(items:Option[])=>items.map(o=><ComboboxChip key={o.id} showRemove={!disabled} data-team-family={kind==='team'?teamVisual(o.id).family:undefined}>{mark(o)}</ComboboxChip>)}</ComboboxValue><ComboboxChipsInput id={id} aria-label={label} placeholder={kind==='team'?'Rechercher un service…':'Rechercher une personne…'} disabled={disabled}/></ComboboxChips>
    <ComboboxContent anchor={anchor} className="ticket-search-results"><ComboboxEmpty>Aucun résultat pour cette recherche.</ComboboxEmpty><ComboboxList>{(o:Option)=><ComboboxItem key={o.id} value={o}>{mark(o)}</ComboboxItem>}</ComboboxList></ComboboxContent>
  </Combobox><small>{value.length} {kind==='team'?'équipe(s) sélectionnée(s)':'responsable(s) sélectionné(s)'}</small></div>;
}
