import zipfile,xml.etree.ElementTree as E,json,datetime,collections,sys,re,hashlib
p,out=sys.argv[1:];n={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def date(s):
 try:
  if re.fullmatch(r'\d+(\.\d+)?',s):return (datetime.datetime(1899,12,30)+datetime.timedelta(days=float(s))).date().isoformat()
  m=re.fullmatch(r'\s*(\d{1,2})/(\d{1,2})/(\d{4})\s*',s)
  if m:return datetime.date(int(m[3]),int(m[2]),int(m[1])).isoformat()
 except (ValueError,OverflowError):pass
 return ''
with zipfile.ZipFile(p) as z:
 ss=[''.join(t.text or '' for t in x.findall('.//m:t',n)) for x in E.fromstring(z.read('xl/sharedStrings.xml'))];wb=E.fromstring(z.read('xl/workbook.xml'));rels={r.attrib['Id']:r.attrib['Target'] for r in E.fromstring(z.read('xl/_rels/workbook.xml.rels'))};sheets={}
 for sh in wb.find('m:sheets',n):
  t=rels[sh.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']];root=E.fromstring(z.read(t.lstrip('/') if t.startswith('/') else 'xl/'+t));rows=[]
  for r in root.findall('.//m:sheetData/m:row',n):
   d={}
   for c in r.findall('m:c',n):
    v=c.find('m:v',n);s=v.text if v is not None else ''.join(x.text or '' for x in c.findall('.//m:t',n))
    if c.attrib.get('t')=='s' and s:s=ss[int(s)]
    if s:d[re.sub(r'\d','',c.attrib['r'])]=s
   if d:rows.append((int(r.attrib['r']),d))
  sheets[sh.attrib['name']]=rows
 records=[]
 for sheet in ['LDA','PERIME - OBSOLETES']:
  main=sheet=='LDA';cols={'created':'Y' if main else 'X','updated':'Z' if main else 'Y','active':'AA' if main else 'Z','updateRequired':'AB' if main else 'AA','conform':'AC' if main else 'AB','comment':'AD' if main else 'AC'}
  for row,d in sheets[sheet]:
   if row<12 or not(d.get('D') and d.get('F')):continue
   active=d.get(cols['active'],'').strip().upper();status='Actif' if main and active=='OUI' else 'Obsolète' if active=='NON' else 'À vérifier';issues=[]
   if not main and active=='OUI':issues.append('Document marqué actif dans l’onglet obsolètes')
   if active not in ['OUI','NON']:issues.append('Statut actif non renseigné ou invalide')
   if d.get(cols['conform'],'').strip().upper()=='NON':issues.append('Document déclaré non conforme dans la source')
   record={'id':'ged-'+('lda' if main else 'archive')+'-'+str(row),'revision':0,'ref':d['D'].strip(),'index':d.get('E','').strip(),'title':d['F'].strip(),'type':d.get('A','').strip(),'process':d.get('C','').strip(),'order':d.get('B','').strip(),'scopes':[col for col in 'GHIJKLMNOPQRSTUVWX'[:18 if main else 17] if d.get(col,'').strip().lower()=='x'],'created':date(d.get(cols['created'],'')),'updated':date(d.get(cols['updated'],'')),'catalogStatus':status,'updateRequired':d.get(cols['updateRequired'],'').strip().upper()=='OUI','sourceConform':d.get(cols['conform'],'').strip(),'comment':d.get(cols['comment'],''),'sourceSheet':sheet,'sourceRow':row,'sourceArchive':not main,'issues':issues,'raw':d,'publishedVersionId':''}
   records.append(record)
 dup=collections.Counter((r['ref'].lower(),r['index'].lower()) for r in records)
 for r in records:
  if dup[(r['ref'].lower(),r['index'].lower())]>1:r['issues'].append('Référence et indice présents sur plusieurs lignes')
 history=[{'row':row,'date':date(d.get('A','')),'dateSource':d.get('A',''),'description':d.get('B','')} for row,d in sheets['Historique des MAJ'] if row>1 and d.get('B')]
 data={'source':'Lis1-800c_Liste des documents applicables.xlsx','sha256':hashlib.sha256(open(p,'rb').read()).hexdigest(),'records':records,'history':history,'headers':{s:dict(sheets[s]).get(11,{}) for s in ['LDA','PERIME - OBSOLETES']}}
 open(out,'w').write(json.dumps(data,ensure_ascii=False,separators=(',',':')))
 print(json.dumps({'records':len(records),'issues':sum(bool(r['issues']) for r in records),'history':len(history)},ensure_ascii=False))
