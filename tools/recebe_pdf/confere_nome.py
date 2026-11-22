import sys, os, glob, json, re, unicodedata, logging
logging.disable(logging.WARNING)
from pypdf import PdfReader
def norm(s): return re.sub(r'[^A-Z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().upper())
base=os.path.expanduser('~/Documents')
pastas=sys.argv[2:] or [p.split('/')[-3].replace('RECEITAS-DESPESAS-','') for p in glob.glob(base+'/RECEITAS-DESPESAS-*/documentos_tcm/')]
out={'nao_pdf':[],'sem_nome':[],'sem_texto':[],'ok':0,'erro_leitura':[]}
for pasta in sorted(pastas):
    alvo=norm(pasta)
    for f in sorted(glob.glob(f'{base}/RECEITAS-DESPESAS-{pasta}/documentos_tcm/*.pdf')):
        r=f.split('Documents/')[1]
        if open(f,'rb').read(4)!=b'%PDF' or os.path.getsize(f)<2048: out['nao_pdf'].append(r); continue
        try:
            pg=PdfReader(f).pages; t=''.join((p.extract_text() or '') for p in pg[:2])
        except Exception as e: out['erro_leitura'].append(r); continue
        n=norm(t)
        if len(n)<50: out['sem_texto'].append(r)
        elif alvo in n: out['ok']+=1
        else:
            m=re.search(r'MUNICIPIO[^A-Z]{0,3}DE([A-Z]{3,30})',n) or re.search(r'(?:PREFEITURA|CAMARA)MUNICIPALDE([A-Z]{3,30})',n)
            out['sem_nome'].append([r, m.group(1)[:30] if m else '?'])
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
print('ok',out['ok'],'nao_pdf',len(out['nao_pdf']),'sem_nome',len(out['sem_nome']),'sem_texto',len(out['sem_texto']),'erro',len(out['erro_leitura']))
