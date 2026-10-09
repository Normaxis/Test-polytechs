import {database} from '@/db/raw';
import type {Account} from '@/lib/access';

export type TeamCapability='coordinate'|'contribute'|'manage';
export async function accessibleTeams(user:Account,write=false,capability:TeamCapability='coordinate'){
 const db=database();const [teams,settings,members]=await Promise.all([db.prepare('SELECT id FROM teams').all(),db.prepare('SELECT team_id,restricted FROM team_access').all(),db.prepare('SELECT team_id,user_id,level FROM team_members WHERE user_id=?').bind(user.id).all()]);
 const open=new Set((settings.results as any[]).filter(x=>!x.restricted).map(x=>x.team_id)),levels=new Map((members.results as any[]).map(x=>[x.team_id,x.level]));
 return new Set((teams.results as any[]).filter(t=>{
  if(user.role==='admin')return true;
  const level=levels.get(t.id),known=['viewer','user','contributor','team_admin'].includes(level);
  if(!write)return known||(t.id!=='rh'&&open.has(t.id));
  if(user.role!=='editor')return false;
  if(capability==='manage')return level==='team_admin';
  if(level)return level==='team_admin'||level==='contributor'||capability==='contribute'&&level==='user';
  // Existing explicitly open services retain their contributor access.
  return t.id!=='rh'&&open.has(t.id);
 }).map(t=>t.id as string))
}
export async function teamsAllowed(user:Account,ids:string[],write=false,capability:TeamCapability='coordinate'){if(user.role==='admin')return true;if(write&&user.role!=='editor')return false;const allowed=await accessibleTeams(user,write,capability);return ids.length>0&&ids.every(id=>allowed.has(id))}
// A shared service must never bypass the confidential RH boundary.
export function teamContentVisible(allowed:Set<string>,ids:string[],admin=false){return admin||ids.length>0&&(!ids.includes('rh')||allowed.has('rh'))&&ids.some(id=>allowed.has(id))}
export async function someTeamAllowed(user:Account,ids:string[]){if(user.role==='admin')return true;return teamContentVisible(await accessibleTeams(user),ids)}
