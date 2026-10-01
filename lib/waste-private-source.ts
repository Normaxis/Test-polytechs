import type {WasteRecord} from './waste';
type WasteSource={source:string;sha256:string;headers:string[];records:WasteRecord[];adrReference:{row:number;raw:Record<string,string>}[];treatments:string[]};
// Deliberately imported by server routes only: never expose source data in client bundles.
const files=import.meta.glob('../private/waste-source.json',{eager:true,import:'default'});
export const wasteSource=(Object.values(files)[0]||null) as WasteSource|null;
