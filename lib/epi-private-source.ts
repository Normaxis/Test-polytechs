// The public source repository contains no private stock catalogue.
type Catalog={source:string;duplicateRows:unknown[];items:Array<{code:string;family:string;name:string;specifics:string;sourceRow:number;sourceSheet:string;catalogStatus:string}>};
const files=import.meta.glob('../private/epi-catalog.json',{eager:true,import:'default'});
export const epiCatalog=(Object.values(files)[0]||{source:'',duplicateRows:[],items:[]}) as Catalog;
