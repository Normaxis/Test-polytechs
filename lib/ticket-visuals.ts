export const categoryVisuals: Record<string, {emoji:string; tone:string}> = {
  'Sécurité': {emoji:'🛡️',tone:'safety'},
  'Environnement': {emoji:'🌿',tone:'environment'},
  'Production': {emoji:'🏭',tone:'production'},
  'Qualité': {emoji:'✅',tone:'quality'},
  'Ressources humaines': {emoji:'🤝',tone:'people'},
  'Maintenance': {emoji:'🔧',tone:'maintenance'},
  'R&D': {emoji:'💡',tone:'research'},
  'Autre': {emoji:'📌',tone:'other'},
};

const teamVisuals: Record<string, {emoji:string; family:string}> = {
  direction:{emoji:'🧭',family:'management'},
  qsse:{emoji:'🛡️',family:'management'},
  commercial:{emoji:'🤝',family:'operations'},
  planification:{emoji:'📅',family:'operations'},
  rd:{emoji:'💡',family:'operations'},
  production:{emoji:'🏭',family:'operations'},
  laboratoire:{emoji:'🧪',family:'operations'},
  logistique:{emoji:'🚚',family:'operations'},
  'travaux-neufs':{emoji:'🏗️',family:'support'},
  achats:{emoji:'🛒',family:'support'},
  rh:{emoji:'👥',family:'support'},
  procedes:{emoji:'⚙️',family:'support'},
  maintenance:{emoji:'🔧',family:'support'},
  informatique:{emoji:'💻',family:'support'},
};
export function teamVisual(id:string){return teamVisuals[id]??{emoji:'👥',family:'support'}}
