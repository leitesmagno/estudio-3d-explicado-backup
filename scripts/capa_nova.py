"""Capa de município no modelo novo (aprovado pelo Magno em 17/11/2026).
Uso:
  python3 scripts/capa_nova.py "Cidade" "linha1|linha2|linha3|linha4" fundo.jpg saida.jpg [uf]
- As 4 linhas são o título antigo da capa (TITULO_CAPA ou capa.linhas do meta.json).
- fundo.jpg: o projetos/<NNN>/capa/fundo-limpo.jpg ou, sem ele, um quadro do vídeo.
Usa uma pasta pública mínima (o disco do Mac está cheio para copiar a pasta projetos/ inteira)."""
import json, re, shutil, subprocess, sys, tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
from mapa_capa import main as faz_mapa

def pares(linhas):
    out = []
    for a, b in [(0, 1), (2, 3)]:
        t = ' '.join(x for x in linhas[a:b + 1] if x).strip()
        if not t:
            continue
        m = re.match(r'^(.*?:)\s*(.*)$', t)
        v = re.match(r'^(.*?),\s*((?:R\$|\d).*)$', t)
        if m:
            out.append({'rotulo': m.group(1), 'valor': m.group(2)})
        elif v:
            out.append({'rotulo': v.group(1) + ':', 'valor': v.group(2)})
        else:
            out.append({'rotulo': t, 'valor': ''})
    return out

def main(cidade, linhas, fundo, saida, uf='ba'):
    with tempfile.TemporaryDirectory() as tmp:
        pub = Path(tmp) / 'pub'
        (pub / '_estudio').mkdir(parents=True)
        shutil.copytree(RAIZ / 'projetos/_estudio/fontes', pub / '_estudio/fontes')
        shutil.copy(fundo, pub / 'fundo.jpg')
        faz_mapa(cidade, pub / 'mapa.svg', uf)
        props = {'cidade': cidade, 'uf': {'ac': 'ACRE', 'al': 'ALAGOAS', 'ap': 'AMAPÁ', 'am': 'AMAZONAS', 'ba': 'BAHIA', 'ce': 'CEARÁ', 'df': 'DISTRITO FEDERAL', 'es': 'ESPÍRITO SANTO', 'go': 'GOIÁS', 'ma': 'MARANHÃO', 'mt': 'MATO GROSSO', 'ms': 'MATO GROSSO DO SUL', 'mg': 'MINAS GERAIS', 'pa': 'PARÁ', 'pb': 'PARAÍBA', 'pr': 'PARANÁ', 'pe': 'PERNAMBUCO', 'pi': 'PIAUÍ', 'rj': 'RIO DE JANEIRO', 'rn': 'RIO GRANDE DO NORTE', 'rs': 'RIO GRANDE DO SUL', 'ro': 'RONDÔNIA', 'rr': 'RORAIMA', 'sc': 'SANTA CATARINA', 'sp': 'SÃO PAULO', 'se': 'SERGIPE', 'to': 'TOCANTINS'}.get(uf, uf.upper()),
                 'pares': pares(linhas.split('|')), 'fundo': 'fundo.jpg', 'mapa': 'mapa.svg', 'variante': 'meio'}
        pj = Path(tmp) / 'props.json'
        pj.write_text(json.dumps(props, ensure_ascii=False))
        subprocess.run(['nice', 'npx', 'remotion', 'still', 'src/_entrada_CapaCidade.tsx', 'CapaCidade', str(Path(saida).resolve()),
                        f'--props={pj}', f'--public-dir={pub}', '--log=error'], cwd=RAIZ, check=True)
    print('capa nova:', saida, props['pares'])

if __name__ == '__main__':
    main(*sys.argv[1:])
