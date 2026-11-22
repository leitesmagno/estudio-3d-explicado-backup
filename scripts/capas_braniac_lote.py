"""Refaz no modelo novo todas as capas de vídeos do site que ainda não têm capa nova (vindas do Braniac).
Uso: python3 scripts/capas_braniac_lote.py   -> grava em ~/Documents/CAPAS NOVAS - INSTAGRAM/<slug>.jpg"""
import glob, json, os, sys, traceback
from pathlib import Path
H = os.path.expanduser('~'); SAIDA = f'{H}/Documents/CAPAS NOVAS - INSTAGRAM'
sys.path.insert(0, str(Path(__file__).resolve().parent))
import capa_da_capa

def pendentes():
    L = []
    for f in sorted(glob.glob(f'{H}/Documents/SITE-EUMAGNOLEITE/dados/videos/*.json')):
        try: v = json.load(open(f))
        except Exception: continue
        s = v.get('slug')
        if s and not os.path.exists(f'{SAIDA}/{s}.jpg') and os.path.exists(v.get('capa_src', '')): L.append(v)
    return L

def uma(v):
    cidade = v['titulo'].split(':')[0].strip()
    capa_da_capa.main(cidade, v['capa_src'], f"{SAIDA}/{v['slug']}.jpg", (v.get('uf') or 'BA').lower())

if __name__ == '__main__':
    ok, falhou = [], []
    for v in pendentes():
        try: uma(v); ok.append(v['slug'])
        except BaseException as e: falhou.append((v['slug'], str(e)[:120]))
    print('FEITAS', len(ok)); print('FALHARAM', falhou)
