import {database} from '@/db/raw';
import type {Account} from '@/lib/access';

export async function accessibleTeams(user:Account,write=false){const db=database();const [teams,settings,members]=await Promise.all([db.prepare('SELECT id FROM teams').all(),db.prepare('SELECT team_id,restricted FROM team_access').all(),db.prepare('SELECT team_id,user_id,level FROM team_members WHERE user_id=?').bind(user.id).all()]);const open=new Set((settings.results as any[]).filter(x=>!x.restricted).map(x=>x.team_id)),levels=new Map((members.results as any[]).map(x=>[x.team_id,x.level]));return new Set((teams.results as any[]).filter(t=>user.role==='admin'||(!write||user.role==='editor')&&(t.id!=='rh'&&open.has(t.id)||levels.get(t.id)==='contributor'||!write&&levels.get(t.id)==='viewer')).map(t=>t.id as string))}
export async function teamsAllowed(user:Account,ids:string[],write=false){if(user.role==='admin')return true;if(write&&user.role!=='editor')return false;const allowed=await accessibleTeams(user,write);return ids.length>0&&ids.every(id=>allowed.has(id))}
// A shared service must never bypass the confidential RH boundary.
export function teamContentVisible(allowed:Set<string>,ids:string[],admin=false){return admin||ids.length>0&&(!ids.includes('rh')||allowed.has('rh'))&&ids.some(id=>allowed.has(id))}
export async function someTeamAllowed(user:Account,ids:string[]){if(user.role==='admin')return true;return teamContentVisible(await accessibleTeams(user),ids)}
