// Read requests may be retried once. Writes are never retried automatically:
// an interrupted response does not establish whether the write was committed.
export async function hubRequest(path:string,body?:unknown){
  const writing=body!==undefined;
  for(let attempt=0;attempt<(writing?1:2);attempt++){
    let response:Response;
    try{response=await fetch(path,{method:writing?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json',...(writing?{'Content-Type':'application/json'}:{})},...(writing?{body:JSON.stringify(body)}:{})})}
    catch{if(!writing&&attempt===0)continue;throw Error('La connexion au site a été interrompue. Réessayez. Votre saisie est conservée.')}
    const jsonType=/\bapplication\/(?:[\w.-]+\+)?json\b/i.test(response.headers.get('content-type')||'');
    if(!jsonType){
      if(!writing&&attempt===0&&response.status!==401&&response.status!==403)continue;
      if(response.redirected||response.status===401||response.status===403)throw Error('Votre accès doit être renouvelé. Rechargez la page pour vous reconnecter.');
      throw Error('Le site n’a pas renvoyé les données attendues. Réessayez ou rechargez la page.');
    }
    let data:any;
    try{data=await response.json()}catch{if(!writing&&attempt===0)continue;throw Error('Les données reçues sont incomplètes. Réessayez.')}
    if(!response.ok){
      if(!writing&&attempt===0&&[502,503,504].includes(response.status))continue;
      throw Error(typeof data?.error==='string'?data.error:response.status===401?'Votre session a expiré. Rechargez la page pour vous reconnecter.':'Opération indisponible. Réessayez.');
    }
    if(!data||typeof data!=='object')throw Error('Les données reçues sont invalides. Réessayez.');
    return data;
  }
  throw Error('Chargement impossible. Réessayez.');
}
