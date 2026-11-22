"""Refaz no modelo novo (17/11/2026) a capa de TODOS os vídeos de município prontos.
Uso: python3 scripts/capas_todas.py   (gera em ~/Documents/CAPAS NOVAS - INSTAGRAM)
Separa: 1 - JÁ NO INSTAGRAM (do post mais novo ao mais antigo) e 2 - AINDA NÃO POSTADOS."""
import json, re, shutil, subprocess, sys, unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
from mapa_capa import main as faz_mapa, DADOS
from capa_nova import pares

SAIDA = Path.home() / 'Documents/CAPAS NOVAS - INSTAGRAM'
PUB = Path.home() / 'Documents/CAPAS-NOVAS-AMOSTRA/pub-todas'
B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
norm = lambda s: unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().strip()

def nomes(uf):
    try:
        return {norm(m['nome']): m['nome'] for m in json.load(open(DADOS / f'ibge_{uf}_municipios.json'))}
    except FileNotFoundError:
        return {}

def ordem_instagram():
    d = json.load(open(Path.home() / 'Documents/SITE-EUMAGNOLEITE/dados/instagram.json'))
    def n(u):
        c = re.search(r'/(?:reel|p)/([^/]+)', u).group(1)[:11]; v = 0
        for ch in c: v = v * 64 + B64.index(ch)
        return v
    lst = sorted(d.items(), key=lambda x: -n(x[1]))
    return {k.split('-')[0]: i for i, (k, _) in enumerate(lst)}

def main():
    ba, rj = nomes('ba'), nomes('rj')
    ig = ordem_instagram()
    tsx = {}
    for f in (RAIZ / 'src/videos').glob('*/*.tsx'):
        t = f.read_text(errors='ignore')
        m = re.search(r"const P = '([^']+)'", t); c = re.search(r'TITULO_CAPA\s*=\s*\[([^\]]*)\]', t)
        if m and c:
            tsx[m.group(1)] = re.findall(r"'([^']*)'", c.group(1))
    itens = []
    for p in sorted((RAIZ / 'projetos').iterdir()):
        mm = re.match(r'^(\d{3})\. orçamento de (.+)$', unicodedata.normalize('NFC', p.name))
        fundo = p / 'capa/fundo-limpo.jpg'
        if not mm or not fundo.exists() or p.name not in tsx:
            continue
        num, cid = mm.groups()
        uf, nome = ('ba', ba.get(norm(cid))) if norm(cid) in ba else ('rj', rj.get(norm(cid)))
        if not nome:
            print('sem IBGE:', p.name); continue
        itens.append(dict(num=num, pasta=p.name, nome=nome, uf=uf, linhas=tsx[p.name], fundo=fundo))
    if PUB.exists(): shutil.rmtree(PUB)
    (PUB / '_estudio').mkdir(parents=True)
    shutil.copytree(RAIZ / 'projetos/_estudio/fontes', PUB / '_estudio/fontes')
    lista = []
    for it in itens:
        shutil.copy(it['fundo'], PUB / f"f{it['num']}.jpg")
        faz_mapa(it['nome'], PUB / f"m{it['num']}.svg", it['uf'])
        lista.append({'id': f"C{it['num']}", 'cidade': it['nome'], 'uf': 'BAHIA' if it['uf'] == 'ba' else 'RIO DE JANEIRO',
                      'pares': pares(it['linhas']), 'fundo': f"f{it['num']}.jpg", 'mapa': f"m{it['num']}.svg"})
    (RAIZ / 'src/_capas_todas.json').write_text(json.dumps(lista, ensure_ascii=False))
    bundle = PUB.parent / '.bundle-todas'
    if bundle.exists(): shutil.rmtree(bundle)
    subprocess.run(['npx', 'remotion', 'bundle', 'src/_entrada_CapasTodas.tsx', f'--public-dir={PUB}', f'--out-dir={bundle}', '--log=error'], cwd=RAIZ, check=True)
    # nome do arquivo = slug do site (<slug>.jpg); cópia numerada na ordem do perfil para o Magno trocar à mão
    slugs = {}
    for f in sorted((Path.home() / 'Documents/SITE-EUMAGNOLEITE/dados/videos').glob('*-orcamento*.json')):
        n = f.stem.split('-')[0].zfill(3)
        if n not in slugs or f.stem.endswith('-orcamento'):
            slugs[n] = f.stem
    try:
        sys.path.insert(0, str(Path.home() / 'Documents/ESCRITORIO-VIRTUAL'))
        import fila_metricool
        fila = [x['slug'].split('-')[0] for x in fila_metricool.candidatos(gravar=False)]
    except Exception as e:
        print('fila indisponível:', e); fila = []
    pos = {n: i for i, n in enumerate(fila)}
    itens.sort(key=lambda it: (pos.get(it['num'], 999), it['num']))
    ja = SAIDA / 'JÁ NO INSTAGRAM - ordem do perfil (1 = mais novo)'
    ja.mkdir(parents=True, exist_ok=True)
    for it in itens:
        slug = slugs.get(it['num'], f"{it['num']}-{norm(it['nome']).replace(' ', '-')}-orcamento")
        alvo = SAIDA / f'{slug}.jpg'
        r = subprocess.run(['nice', '-n', '15', 'npx', 'remotion', 'still', str(bundle), f"C{it['num']}", str(alvo), '--log=error'], cwd=RAIZ)
        print(('ok ' if r.returncode == 0 else 'FALHOU ') + alvo.name, flush=True)
        if r.returncode == 0 and it['num'] in ig:
            shutil.copy(alvo, ja / f"{ig[it['num']] + 1:03d} - {it['nome'].upper()}.jpg")
    shutil.rmtree(bundle); shutil.rmtree(PUB)
    print('FIM', len(itens))

if __name__ == '__main__':
    main()
