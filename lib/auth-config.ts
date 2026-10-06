import {env} from 'cloudflare:workers';
// Enable only behind the Sites dispatcher, which authenticates and overwrites
// identity headers. A standalone deployment must leave this unset.
export function trustSiteIdentity(){return env.QSE_TRUST_SITES_IDENTITY==='1'}
