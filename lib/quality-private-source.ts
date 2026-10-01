import type {QualityAction} from './quality-actions';
const files=import.meta.glob('../private/quality-actions-source.json',{eager:true,import:'default'});
export const qualitySource=(Object.values(files)[0]||{source:"Plan d’actions",records:[],owners:{},guide:[],trace:[],methods:[],origins:[]}) as {source:string;records:QualityAction[];owners:Record<string,string>;guide:{row:number;raw:Record<string,string>}[];trace:{row:number;raw:Record<string,string>}[];methods:string[];origins:string[]};
