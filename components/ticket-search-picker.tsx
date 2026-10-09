'use client';
import {useId,useState} from 'react';
import {PersonAvatar} from '@/components/person-avatar';
import {TeamMark} from '@/components/ticket-visuals';
import {teamVisual} from '@/lib/ticket-visuals';
import {Combobox,ComboboxInput,ComboboxValue,ComboboxChips,ComboboxChip,ComboboxChipsInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty,useComboboxAnchor} from '@/components/ui/combobox';
type Option={id:string;name:string};
function normalize(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').trim()}
export function TicketSearchPicker({options,value,onChange,disabled=false,label,kind='team',compact=false}:{options:Option[];value:string[];onChange:(ids:string[])=>void;disabled?:boolean;label:string;kind?:'team'|'person';compact?:boolean}){
  const id=useId(),anchor=useComboboxAnchor(),[query,setQuery]=useState('');
  const selected=value.map(id=>options.find(o=>o.id===id)||{id,name:id});
  const mark=(o:Option)=>kind==='team'?<TeamMark id={o.id} name={o.name}/>:<span className="ticket-visual-label"><PersonAvatar id={o.id} name={o.name} size={24}/>{o.name}</span>;
  return <div className={'ticket-search-picker'+(compact?' ticket-search-compact':'')}><label className={compact?'sr-only':undefined} htmlFor={id}>{label}</label><Combobox multiple items={options} value={selected} onValueChange={items=>{onChange(items.map(o=>o.id));setQuery('')}} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={o=>o.name} isItemEqualToValue={(a,b)=>a.id===b.id} filter={(o,q)=>normalize(o.name).includes(normalize(q))} disabled={disabled}>
    <ComboboxChips ref={anchor} className="ticket-search-chips"><ComboboxValue>{(items:Option[])=>items.map(o=><ComboboxChip key={o.id} showRemove={!disabled} data-team-family={kind==='team'?teamVisual(o.id).family:undefined}>{mark(o)}</ComboboxChip>)}</ComboboxValue>{compact&&disabled&&!value.length&&<span className="ticket-picker-empty">{kind==='team'?'Aucun service attribué':'Aucun responsable supplémentaire'}</span>}<ComboboxChipsInput id={id} aria-label={label} placeholder={kind==='team'?'Rechercher un service…':'Rechercher une personne…'} disabled={disabled}/></ComboboxChips>
    <ComboboxContent anchor={anchor} className="ticket-search-results"><ComboboxEmpty>Aucun résultat pour cette recherche.</ComboboxEmpty><ComboboxList>{(o:Option)=><ComboboxItem key={o.id} value={o}>{mark(o)}</ComboboxItem>}</ComboboxList></ComboboxContent>
  </Combobox>{!compact&&<small>{value.length} {kind==='team'?'équipe(s) sélectionnée(s)':'responsable(s) sélectionné(s)'}</small>}</div>;
}

export function TicketPilotPicker({options,value,onChange,disabled=false,label,className=''}:{options:Option[];value:string;onChange:(id:string)=>void;disabled?:boolean;label:string;className?:string}){
  const selected=options.find(o=>o.id===value)||(value?{id:value,name:value}:null);
  return <div className={'ticket-pilot-picker '+className}><Combobox items={options} value={selected} onValueChange={o=>onChange(o?.id||'')} itemToStringLabel={o=>o.name} isItemEqualToValue={(a,b)=>a.id===b.id} filter={(o,q)=>normalize(o.name).includes(normalize(q))} disabled={disabled}>
    <div style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}>{selected&&<PersonAvatar id={selected.id} name={selected.name} size={24}/>}<ComboboxInput aria-label={label} placeholder="Rechercher un pilote…" showClear={!!value} disabled={disabled}/></div>
    <ComboboxContent className="ticket-search-results"><ComboboxEmpty>Aucun pilote trouvé.</ComboboxEmpty><ComboboxList>{(o:Option)=><ComboboxItem key={o.id} value={o}><PersonAvatar id={o.id} name={o.name} size={24}/><span data-no-translate>{o.name}</span></ComboboxItem>}</ComboboxList></ComboboxContent>
  </Combobox></div>;
}
