import {database} from '@/db/raw';
import {qualitySource} from './quality-private-source';
import type {QualityAction} from './quality-actions';
export async function qualityActions(){const records=new Map<string,QualityAction>(qualitySource.records.map(a=>[a.id,a]));for(const r of (await database().prepare('SELECT * FROM quality_actions').all()).results as any[]){const source=records.get(r.id);records.set(r.id,{...JSON.parse(r.data),id:r.id,revision:r.revision,raw:source?.raw,sourceRow:source?.sourceRow||0})}return records}
