import {database,bucket} from '@/db/raw';
import {requireRole} from '@/lib/access';

export async function GET(req:Request){try{const gate=await requireRole(req);if(gate.error)return gate.error;const row=await database().prepare('SELECT photo_key,photo_mime FROM user_profiles WHERE user_id=?').bind(gate.user!.id).first<{photo_key:string;photo_mime:string}>();if(!row?.photo_key)return new Response(null,{status:404});const object=await bucket().get(row.photo_key);if(!object)return new Response(null,{status:404});return new Response(object.body,{headers:{'Content-Type':row.photo_mime,'Content-Disposition':'inline','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}})}catch{return new Response(null,{status:503})}}
