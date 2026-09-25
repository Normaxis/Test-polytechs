import {database} from '@/db/raw';

export type Role='admin'|'editor'|'reader';
export type Account={id:string;username:string;displayName:string;role:Role;mustChangePassword:boolean};
type DbUser={id:string;username:string;display_name:string;role:Role;password_hash:string;must_change_password:number};
const encoder=new TextEncoder();
const COOKIE='qse_session';
const DAYS=7*24*60*60*1000;

function hex(bytes:Uint8Array){return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('')}
function unhex(value:string){return Uint8Array.from(value.match(/.{2}/g)??[],x=>parseInt(x,16))}
async function sha(value:string){return hex(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value))))}
export async function hashPassword(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const derived=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256));return `pbkdf2:100000:${hex(salt)}:${hex(derived)}`}
export async function checkPassword(password:string,stored:string){const [,iterations,salt,wanted]=stored.split(':');if(!iterations||!salt||!wanted)return false;const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const found=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:unhex(salt),iterations:Number(iterations)},key,256));const expected=unhex(wanted);if(found.length!==expected.length)return false;let different=0;for(let i=0;i<found.length;i++)different|=found[i]^expected[i];return different===0}
export function account(user:DbUser):Account{return {id:user.id,username:user.username,displayName:user.display_name,role:user.role,mustChangePassword:!!user.must_change_password}}
export async function bootstrap(){const db=database();for(const [username,displayName] of [['flavien','Flavien Lefebvre'],['karine','Karine']]){const existing=await db.prepare('SELECT id FROM users WHERE username=?').bind(username).first();if(!existing)await db.prepare('INSERT OR IGNORE INTO users (id,username,display_name,role,password_hash,must_change_password,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),username,displayName,'admin',await hashPassword(username),1,new Date().toISOString()).run()}}
function cookieValue(req:Request){return req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||''}
export async function currentUser(req:Request):Promise<Account|null>{const token=cookieValue(req);if(/^[a-f0-9]{64}$/.test(token)){const row=await database().prepare('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(await sha(token),Date.now()).first<DbUser>();if(row)return account(row)}
// The private Sites gateway authenticates the owner before forwarding the request.
// Embedded browsers may reject application cookies, so recognize this exact
// gateway identity as the existing administrator account as well.
if(req.headers.get('oai-authenticated-user-email')?.toLowerCase()==='lefebvre.flavien2018@gmail.com'){const owner=await userByName('flavien');if(owner)return account(owner)}
return null}
export async function requireRole(req:Request,role:Role='reader'){const user=await currentUser(req);if(!user)return {error:Response.json({error:'Connexion nécessaire.'},{status:401})};if(user.mustChangePassword)return {error:Response.json({error:'Changez votre mot de passe avant de continuer.'},{status:403})};if(({reader:0,editor:1,admin:2})[user.role]<({reader:0,editor:1,admin:2})[role])return {error:Response.json({error:'Accès non autorisé pour votre rôle.'},{status:403})};return {user}}
export function checkOrigin(req:Request){const origin=req.headers.get('origin');return !!origin&&origin===new URL(req.url).origin}
export async function issueSession(userId:string){const token=hex(crypto.getRandomValues(new Uint8Array(32)));await database().prepare('INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,?)').bind(await sha(token),userId,Date.now()+DAYS).run();return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${DAYS/1000}`}
export async function endSession(req:Request){const token=cookieValue(req);if(/^[a-f0-9]{64}$/.test(token))await database().prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(token)).run()}
export const clearCookie=`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`;
export async function userByName(username:string){return database().prepare('SELECT * FROM users WHERE username=?').bind(username).first<DbUser>()}
