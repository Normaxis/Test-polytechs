'use client';
import {useHubMeta} from '@/components/hub-layout';
import {SearchSelect} from '@/components/search-select';
export function PersonAssignment({id,name,onChange,disabled=false,label='Pilote'}:{id:string;name:string;onChange:(id:string,name:string)=>void;disabled?:boolean;label?:string}){
 const {meta,error}=useHubMeta();const options=meta.users.map(u=>({id:u.id,name:u.display_name+(meta.users.filter(v=>v.display_name===u.display_name).length>1?' · '+u.id:'')}));
 return <div className="person-assignment"><SearchSelect label={label+' · compte utilisateur'} value={id} options={options} disabled={disabled} onChange={next=>onChange(next,meta.users.find(u=>u.id===next)?.display_name||'')} placeholder="Rechercher une personne…"/>{!id&&<label>Nom ou service sans compte<input maxLength={150} disabled={disabled} value={name} onChange={e=>onChange('',e.target.value)}/></label>}{!id&&name&&<small>Choisissez un compte pour rattacher cette action personnellement. Le texte historique est conservé tant que vous ne le modifiez pas.</small>}{error&&<small role="alert">Annuaire indisponible : {error}</small>}</div>
}
