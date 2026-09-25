// L'import original est limité au Worker du Site privé. Le dépôt de code public
// reste fonctionnel sans ce fichier : un administrateur pourra l'ajouter à une autre installation.
type Seed={source:string;method:string;units:Array<any>;risks:Array<any>;actions:Array<any>;updates:Array<any>};
const files=import.meta.glob('../private/duerp-source.json',{eager:true,import:'default'});
export const evrpSource=(Object.values(files)[0]||null) as Seed|null;
