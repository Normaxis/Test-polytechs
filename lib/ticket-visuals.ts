import {ShieldCheck,Leaf,Factory,FileCheck2,HeartHandshake,Wrench,Lightbulb,Tag,BriefcaseBusiness,CalendarDays,FlaskConical,Truck,HardHat,ShoppingCart,Network,Monitor,Users,type LucideIcon} from 'lucide-react';
export const categoryVisuals: Record<string, {Icon:LucideIcon; tone:string}> = {
  'Sécurité': {Icon:ShieldCheck,tone:'safety'},
  'Environnement': {Icon:Leaf,tone:'environment'},
  'Production': {Icon:Factory,tone:'production'},
  'Qualité': {Icon:FileCheck2,tone:'quality'},
  'Ressources humaines': {Icon:HeartHandshake,tone:'people'},
  'Maintenance': {Icon:Wrench,tone:'maintenance'},
  'R&D': {Icon:Lightbulb,tone:'research'},
  'Autre': {Icon:Tag,tone:'other'},
};

const teamVisuals: Record<string, {Icon:LucideIcon; family:string}> = {
  direction:{Icon:BriefcaseBusiness,family:'management'},
  qsse:{Icon:ShieldCheck,family:'management'},
  commercial:{Icon:BriefcaseBusiness,family:'operations'},
  planification:{Icon:CalendarDays,family:'operations'},
  rd:{Icon:Lightbulb,family:'operations'},
  production:{Icon:Factory,family:'operations'},
  laboratoire:{Icon:FlaskConical,family:'operations'},
  logistique:{Icon:Truck,family:'operations'},
  'travaux-neufs':{Icon:HardHat,family:'support'},
  achats:{Icon:ShoppingCart,family:'support'},
  rh:{Icon:HeartHandshake,family:'support'},
  procedes:{Icon:Network,family:'support'},
  maintenance:{Icon:Wrench,family:'support'},
  informatique:{Icon:Monitor,family:'support'},
};
export function teamVisual(id:string){return teamVisuals[id]??{Icon:Users,family:'support'}}
