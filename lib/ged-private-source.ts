import type {GedDocument} from './ged';
const files=import.meta.glob('../private/ged-source.json',{eager:true,import:'default'});
export const gedSource=(Object.values(files)[0]||null) as {source:string;records:GedDocument[];history:{row:number;date:string;dateSource:string;description:string}[];headers:Record<string,Record<string,string>>}|null;
