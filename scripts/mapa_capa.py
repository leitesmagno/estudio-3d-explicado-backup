"""Mapinha do estado com o município em destaque, para a capa (17/11/2026).
Uso: python3 scripts/mapa_capa.py "Nome da Cidade" saida.svg [uf]
Malhas do IBGE já baixadas na pasta do site (dados/<uf>-municipios.json)."""
import os, json, math, sys, unicodedata
from pathlib import Path

DADOS = Path.home() / 'Documents/SITE-EUMAGNOLEITE/dados'
ACENTO, ESTADO, PINO = '#E5484D', '#9A96A0', '#2FA36B'

def norm(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().strip()

def main(nome, saida, uf='ba'):
    malha = json.load(open(DADOS / f'{uf}-municipios.json'))
    nomes = {str(m['id']): m['nome'] for m in json.load(open(DADOS / f'ibge_{uf}_municipios.json'))}
    alvo = [k for k, v in nomes.items() if norm(v) == norm(nome)]
    if not alvo:
        sys.exit(f'municipio nao achado: {nome}')
    alvo = alvo[0]
    aneis = []  # (codigo, anel)
    for f in malha['features']:
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        for p in polys:
            aneis.append((f['properties']['codarea'], p[0]))
    xs = [x for _, a in aneis for x, _ in a]; ys = [y for _, a in aneis for _, y in a]
    k = math.cos(math.radians((min(ys) + max(ys)) / 2))
    larg, alt = (max(xs) - min(xs)) * k, max(ys) - min(ys)
    L = 1000; esc = (L - 80) / max(larg, alt)
    ox = (L - larg * esc) / 2; oy = (L - alt * esc) / 2
    pt = lambda x, y: ((x - min(xs)) * k * esc + ox, (max(ys) - y) * esc + oy)
    caminho = lambda a: 'M' + 'L'.join(f'{px:.1f},{py:.1f}' for px, py in (pt(x, y) for x, y in a)) + 'Z'
    base = ''.join(caminho(a) for c, a in aneis)
    cid = [a for c, a in aneis if c == alvo]
    dcid = ''.join(caminho(a) for a in cid)
    # 21/11/2026 (pedido do Magno): a ponta do alfinete fica no CENTRO do território (centro de área; se cair fora do contorno, o ponto interno
    # mais afastado das bordas), e não na média dos vértices, que desloca o alfinete quando um lado da divisa tem mais pontos.
    def centro_area(an):
        A = Cx = Cy = 0.0
        for a in an:
            q = [pt(x, y) for x, y in a]
            for (x1_, y1_), (x2_, y2_) in zip(q, q[1:] + q[:1]):
                c = x1_ * y2_ - x2_ * y1_; A += c; Cx += (x1_ + x2_) * c; Cy += (y1_ + y2_) * c
        return (Cx / (3 * A), Cy / (3 * A)) if A else None
    def dentro(px, py, an):
        n = False
        for a in an:
            q = [pt(x, y) for x, y in a]
            for (x1_, y1_), (x2_, y2_) in zip(q, q[1:] + q[:1]):
                if (y1_ > py) != (y2_ > py) and px < (x2_ - x1_) * (py - y1_) / (y2_ - y1_) + x1_:
                    n = not n
        return n
    def dist_borda(px, py, an):
        m = 1e9
        for a in an:
            q = [pt(x, y) for x, y in a]
            for (x1_, y1_), (x2_, y2_) in zip(q, q[1:] + q[:1]):
                dx, dy = x2_ - x1_, y2_ - y1_; t = max(0, min(1, ((px - x1_) * dx + (py - y1_) * dy) / (dx * dx + dy * dy or 1)))
                m = min(m, math.hypot(px - (x1_ + t * dx), py - (y1_ + t * dy)))
        return m
    cx, cy = centro_area(cid)
    if not dentro(cx, cy, cid):
        pts = [pt(x, y) for a in cid for x, y in a]
        bx0, bx1 = min(p[0] for p in pts), max(p[0] for p in pts); by0, by1 = min(p[1] for p in pts), max(p[1] for p in pts)
        melhor = (-1, cx, cy)
        for i in range(40):
            for j in range(40):
                gx, gy = bx0 + (bx1 - bx0) * i / 39, by0 + (by1 - by0) * j / 39
                if dentro(gx, gy, cid):
                    d_ = dist_borda(gx, gy, cid)
                    if d_ > melhor[0]: melhor = (d_, gx, gy)
        cx, cy = melhor[1], melhor[2]
    # 19/11: o alfinete tem ~165 de altura e ~60 de meia largura; município na borda do mapa (ex.: Abaré) o cortava. Amplia o quadro só quando precisa.
    x0, y0 = min(0, cx - 62), min(0, cy - 170); x1, y1 = max(L, cx + 62), max(L, cy + 12)
    lado = max(x1 - x0, y1 - y0); x0 -= (lado - (x1 - x0)) / 2; y0 -= (lado - (y1 - y0)) / 2
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {lado:.1f} {lado:.1f}">'
           f'<path d="{base}" fill="{ESTADO}" stroke="{ESTADO}" stroke-width="2" stroke-linejoin="round"/>'
           + (f'<path d="{dcid}" fill="{PINO}" stroke="#16151A" stroke-width="3" stroke-linejoin="round"/>' if os.environ.get('MAPA_DESTAQUE') else '') +
           f'<g transform="translate({cx:.1f},{cy:.1f}) scale(5.2)">'
           f'<path d="M0 0C-3-6-11-12-11-20A11 11 0 1 1 11-20C11-12 3-6 0 0Z" fill="{PINO}" stroke="#16151A" stroke-width="2.2"/>'
           f'<circle cx="0" cy="-20" r="4.6" fill="#FFFFFF"/></g>'
           f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="9" fill="#16151A"/></svg>')
    Path(saida).write_text(svg)
    print('ok', nomes[alvo], saida)

if __name__ == '__main__':
    main(*sys.argv[1:])
