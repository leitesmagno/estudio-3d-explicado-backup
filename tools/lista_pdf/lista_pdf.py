# Listinha "PDF" discreta de receita e despesa por ano (pedido do Magno, 08/11/2026)
#
# Uso:
#   python3 -I lista_pdf.py receita <PCMGE016.txt> <ano-rotulo>      -> imprime JSON das linhas (SIGA)
#   python3 -I lista_pdf.py palavras <palavras.json> <texto>         -> mostra onde a expressão aparece (tempo)
#   python3 -I lista_pdf.py aplicar <config.json>                    -> gera as folhas e cola no vídeo
#
# config.json:
# {"entrada": "video.mp4", "saida": "VIDEO.mp4", "pasta_tmp": "...",
#  "folhas": [{"tipo": "receita"|"despesa", "titulo": "RECEITA ARRECADADA · 2024",
#              "total": 65231350.91, "linhas": [["IPTU", 221516.57], ...],
#              "rodape": "Balanço e PCMGE016 enviados ao TCM-BA", "de": 12.3, "ate": 19.8}]}
# Regra: a soma das linhas tem que ser igual ao total (diferença até R$ 0,05), senão para.
import json, re, subprocess, sys, os, html, pathlib

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
num = r"-?[\d\.]+,\d\d"
val = lambda s: float(s.replace(".", "").replace(",", "."))

# ---------------- receita (PCMGE016 do SIGA) ----------------
GRUPOS = [
    ("IPTU", ["1.1.1.2.50.0.0"]),
    ("ITBI", ["1.1.1.2.53.0.0"]),
    ("ISS", ["1.1.1.4.51.0.0"]),
    ("Imposto de Renda retido", ["1.1.1.3.00.0.0"]),
    ("Taxas", ["1.1.2.0.00.0.0"]),
    ("Iluminação pública (COSIP)", ["1.2.4.0.00.0.0"]),
    ("Multas", ["1.9.1.0.00.0.0"]),
    ("FPM", ["1.7.1.1.51.0.0"]),
    ("ICMS", ["1.7.2.1.50.0.0"]),
    ("IPVA", ["1.7.2.1.51.0.0"]),
    ("Saúde · SUS da União", ["1.7.1.3.00.0.0", "2.4.1.1.00.0.0"]),
    ("Saúde · SUS do Estado", ["1.7.2.3.00.0.0"]),
    ("Educação · FNDE", ["1.7.1.4.00.0.0", "2.4.1.2.00.0.0"]),
    ("Fundeb", ["1.7.5.0.00.0.0", "1.7.1.5.00.0.0"]),
    ("Assistência social", ["1.7.1.6.00.0.0", "1.7.2.9.51.0.0"]),
    ("Emendas Pix (transf. especial)", ["1.7.1.9.57.0.0", "2.4.1.9.51.0.0"]),
    ("Convênios (União e Estado)", ["1.7.1.7.00.0.0", "1.7.2.4.00.0.0", "2.4.1.4.00.0.0", "2.4.2.2.00.0.0"]),
    ("Empréstimos (operações de crédito)", ["2.1.0.0.00.0.0"]),
]

SEMPRE = ("IPTU", "ITBI", "ISS", "Taxas", "Iluminação pública (COSIP)", "Multas")

def receita(txt):
    L = open(txt, encoding="utf-8", errors="ignore").read().split("\n")
    R = {}
    for l in L:
        m = re.match(r"^\s*(\d\.\d\.\d\.\d\.\d\d\.\d\.\d)\s+(.*)$", l)
        if not m:
            continue
        ns = [val(x) for x in re.findall(num, m.group(2))]
        if len(ns) < 8:
            continue
        # arrecadado líquido (depois das anulações) = previsto + saldo p/ mais - saldo p/ menos
        R.setdefault(m.group(1), round(ns[0] + ns[-2] - ns[-1], 2))
    DED = {}
    if not R:
        # layout "Receita Orçamentária - Demonstrativo" (código de 12 dígitos; colunas: prev. inicial, prev. atualizada, no mês, ACUMULADO, diferenças)
        for l in L:
            m = re.match(r"^\s*(\d{12})\s+(.*)$", l)
            if not m:
                continue
            ns = [val(x) for x in re.findall(num, m.group(2))]
            if len(ns) < 5:
                continue
            c = m.group(1); k = f"{c[0]}.{c[1]}.{c[2]}.{c[3]}.{c[4:6]}.{c[6]}.{c[7]}"
            if c[8:] != "0000":
                continue
            if "dedu" in m.group(2).lower():
                DED[k] = DED.get(k, 0.0) + ns[-2]   # vem negativa
            else:
                R.setdefault(k, ns[-2])
        for k, v in DED.items():
            if k in R:
                R[k] = round(R[k] + v, 2)
    if not R:
        # layout "Demonstrativo Consolidado da Receita Orçamentária" (SIGA, código de 8 dígitos). As linhas de grupo mais
        # altas saem desalinhadas no texto; as linhas de 8 dígitos MAIS ESPECÍFICAS são corretas, já líquidas, e somam o total.
        def sig(c):
            p = [c[0], c[1], c[2], c[3], c[4:6], c[6], c[7]]
            while p and set(p[-1]) == {"0"}:
                p.pop()
            return "".join(p)
        A8 = {}
        for l in L:
            m = re.match(r"^\s*(\d{8})\s+(.*)$", l)
            if not m:
                continue
            ns = [val(x) for x in re.findall(num, m.group(2))]
            if len(ns) < 8:
                continue
            A8[m.group(1)] = ns[4] + ns[5]
        if A8:
            S8 = {c: sig(c) for c in A8}
            folha8 = [c for c in A8 if not any(o != c and len(S8[o]) > len(S8[c]) and S8[o].startswith(S8[c]) for o in A8)]
            for nome, cods in GRUPOS:
                for cd in cods:
                    pref = sig(cd.replace(".", ""))
                    R[cd] = round(sum(A8[c] for c in folha8 if S8[c].startswith(pref)), 2)
    if not R:
        # layout "DEMONSTRATIVO DA RECEITA ORÇAMENTÁRIA" com código de 10 grupos (x.x.x.x.xx.x.x.xx.xx.xx); colunas: previsto,
        # no mês, ATÉ O MÊS, para mais, para menos; deduções do Fundeb nas linhas 9.x (mesmo código com 9 no lugar do 1)
        TOPO = 0.0; achou = False
        for l in L:
            m = re.match(r"^\s*(\d)\.(\d)\.(\d)\.(\d)\.(\d\d)\.(\d)\.(\d)\.00\.00\.00\s+(.*)$", l)
            if not m:
                continue
            ns = [val(x) for x in re.findall(num, m.group(8))]
            if len(ns) < 5:
                continue
            achou = True
            g = list(m.groups()[:7]); v = ns[2]
            if g[1:] == ["0", "0", "0", "00", "0", "0"]:
                TOPO += v
            if g[0] == "9":
                k = ".".join(["1"] + g[1:]); DED.setdefault(k, v)
            else:
                R.setdefault(".".join(g), v)
        if achou:
            for k, v in DED.items():
                if k in R:
                    R[k] = round(R[k] + v, 2)
            TOT10 = round(TOPO, 2)
    if not R:
        # layout "Demonstrativo da receita por período" (código de 11 dígitos; dedução com prefixo 95 e valores entre parênteses)
        def acum(ns):
            est, dif = ns[0], ns[-1]
            for x in reversed(ns[1:-1]):
                if abs(abs(est - x) - dif) < 0.02:
                    return x
            if len(ns) == 2 and abs(est - dif) < 0.02:
                return 0.0
            return ns[-2]
        for l in L:
            m = re.match(r"^\s*(95)?(\d{11})\s+(.*)$", l)
            if not m:
                continue
            c = m.group(2)
            if c[8:] != "000":
                continue
            ns = [val(x) for x in re.findall(num, m.group(3))]
            if len(ns) < 2:
                continue
            k = f"{c[0]}.{c[1]}.{c[2]}.{c[3]}.{c[4:6]}.{c[6]}.{c[7]}"
            v = acum(ns)
            if m.group(1):
                DED.setdefault(k, -abs(v))
            else:
                R.setdefault(k, v)
        for k, v in DED.items():
            if k in R:
                R[k] = round(R[k] + v, 2)
        tg = [l for l in L if l.strip().startswith("TOTAL ")]
        if tg:
            TOT11 = acum([val(x) for x in re.findall(num, tg[0])])
    tl = [l for l in L if l.strip().startswith("Totais")]
    if "TOT11" in dir():
        total = TOT11
    elif "TOT10" in dir():
        total = TOT10
    elif tl:
        total = val(re.findall(num, tl[0])[-1])
    else:
        tg = [l for l in L if l.strip().startswith("TOTAL DA RECEITA")]
        total = val(re.findall(num, tg[0])[-2]) if tg else None
    linhas, soma = [], 0.0
    for nome, cods in GRUPOS:
        v = round(sum(R.get(c, 0.0) for c in cods), 2)
        if abs(v) >= 0.01 or nome in SEMPRE:
            linhas.append([nome, v]); soma += v
    linhas.append(["Outras receitas", round(total - soma, 2)])
    return dict(total=total, linhas=linhas, codigos_achados=len(R))

# ---------------- tempos ----------------
def palavras(pj, expr):
    W = json.load(open(pj))
    ws = [w["w"].lower().strip(".,:;!?") for w in W]
    alvo = [x.lower().strip(".,:;!?") for x in expr.split()]
    for i in range(len(ws) - len(alvo) + 1):
        if ws[i:i + len(alvo)] == alvo:
            print(f"{W[i]['s']:8.2f}  ...{' '.join(w['w'] for w in W[max(0,i-3):i+8])}")

# ---------------- folha ----------------
def br(v):
    s = f"{abs(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return ("-" if v < 0 else "") + s

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:transparent;width:%dpx}
.f{width:%dpx;margin:14px;background:rgba(251,250,245,.86);border-radius:10px;box-shadow:0 8px 26px rgba(0,0,0,.45);
   font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#1d232c;overflow:hidden;position:relative}
.top{height:7px;background:%s}
.h{padding:12px 16px 8px;border-bottom:1px solid #d9d6cc}
.k{font-size:15px;letter-spacing:.14em;font-weight:800;color:%s;text-transform:uppercase}
.t{font-size:31px;font-weight:800;margin-top:2px;font-variant-numeric:tabular-nums}
.t small{font-size:15px;font-weight:600;color:#6b7280;margin-left:4px}
table{width:100%%;border-collapse:collapse;font-size:19px}
td{padding:4px 16px;border-bottom:1px dashed #e2dfd6;line-height:1.18}
td.v{text-align:right;font-family:Menlo,'SF Mono',monospace;font-size:17.5px;white-space:nowrap;font-weight:600}
tr.o td{color:#6b7280}
.dq{font-size:17px;font-weight:700;color:#1d232c;background:#e8efe9;padding:7px 16px;border-bottom:1px solid #d9d6cc}
.r{font-size:13px;color:#6b7280;padding:7px 16px 10px;letter-spacing:.02em}
.fold{position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:0 26px 26px 0;border-color:transparent #d8d3c4 transparent transparent}
"""

def folha_png(f, png, largura=450):
    cor = "#2a8a57" if f["tipo"] == "receita" else "#b5452f"
    rows = "".join(
        f'<tr class="{"o" if n.startswith("Outr") or n.startswith("Demais") else ""}"><td>{html.escape(n)}</td><td class="v">{br(v)}</td></tr>'
        for n, v in f["linhas"])
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS % (largura+28, largura, cor, cor)}</style></head><body>
<div class="f"><div class="top"></div><div class="fold"></div><div class="h"><div class="k">{html.escape(f['titulo'])}</div>
<div class="t">R$ {br(f['total'])}</div></div>{('<div class="dq">' + html.escape(f['destaque']) + '</div>') if f.get('destaque') else ''}<table>{rows}</table>
<div class="r">{html.escape(f.get('rodape',''))}</div></div></body></html>"""
    h = pathlib.Path(png).with_suffix(".html"); h.write_text(doc)
    altura = 140 + 30 * len(f["linhas"]) + 60 + sum(24 for n, _ in f["linhas"] if len(n) > 24)
    if f.get("destaque"):
        altura += 40 + (24 if len(f["destaque"]) > 42 else 0)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
                    f"--window-size={largura+28},{altura}", f"--screenshot={png}", f"file://{h}"],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return png


def tamanho(png, esc):
    o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width,height", "-of", "csv=p=0", png],
                       capture_output=True, text=True).stdout.strip().split(",")
    return int(int(o[0]) * esc), int(int(o[1]) * esc)

# regra 71 (Magno, 09/11/2026): no celular o Instagram corta ~60-70 px de cada lado do vídeo (tela mais alta que 9:16);
# a folha cortou na lateral em Ubaitaba. Margem lateral de 90 px e escala menor (0,58).
MARG = 90
# lugares possíveis (1080x1920): fora dos selos do topo, da legenda (y~1340+) e dos botões do Instagram (direita, y>1080)
def candidatos(w, h):
    # abaixo do chip de cada cena (y~520-570), acima da legenda (y~1330) e longe dos botões do Instagram (direita, y>1120)
    c = [(MARG, y) for y in (600, 680, 760, 840) if y + h <= 1320]
    c += [(1080 - w - MARG, y) for y in (600,) if y + h <= 1120]
    return c or [(MARG, 600)]

def movimento(video, de, ate, x, y, w, h):
    # quanto "acontece" naquele retângulo: média das bordas (texto, plaquinha, objeto), 1 quadro por segundo do trecho
    o = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{de:.2f}", "-t", f"{ate-de:.2f}", "-i", video,
                        "-vf", f"fps=1,crop={w}:{h}:{x}:{y},edgedetect=low=0.08:high=0.2,signalstats,"
                               "metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"],
                       capture_output=True, text=True).stdout
    m = sorted(float(v) for v in re.findall(r"YAVG=([\d\.]+)", o))
    if not m:
        return 99.0
    pior = m[int(len(m) * 0.7):] or m[-1:]          # os 30% piores segundos (plaquinha passando) pesam mais
    return 0.4 * sum(m) / len(m) + 0.6 * sum(pior) / len(pior)

def melhor_lugar(video, de, ate, w, h):
    notas = [(movimento(video, de, ate, x, y, w, h), (x, y)) for x, y in candidatos(w, h)]
    notas.sort()
    print("   notas:", " | ".join(f"{x},{y}={n:.2f}" for n, (x, y) in notas))
    return notas[0][1]

def previa(cfg_path, saida_jpg):
    # um quadro no meio de cada folha, já na posição escolhida, lado a lado (para conferir antes do render)
    cfg = json.load(open(cfg_path)); tmp = pathlib.Path(cfg["pasta_tmp"]); tmp.mkdir(parents=True, exist_ok=True)
    esc = cfg.get("escala", 0.58); q = []
    for i, f in enumerate(cfg["folhas"]):
        p = folha_png(f, str(tmp / f"folha{i:02d}.png"), cfg.get("largura", 450)); w, h = tamanho(p, esc)
        x, y = melhor_lugar(cfg["entrada"], f["de"], f["ate"], w, h)
        t = (f["de"] + f["ate"]) / 2; j = str(tmp / f"previa{i:02d}.jpg")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", cfg["entrada"], "-i", p, "-filter_complex",
                        f"[1:v]scale=iw*{esc}:-1[f];[0:v][f]overlay={x}:{y},scale=360:-2", "-frames:v", "1", j], check=True)
        q.append(j); print(f"folha {i} x={x} y={y} t={t:.1f}")
    ins = sum([["-i", j] for j in q], [])
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", f"hstack=inputs={len(q)}", saida_jpg], check=True)

# ---------------- lugar livre, momento a momento ----------------
GY0, GY1, CEL, PASSO, TXT = 480, 1380, 30, 0.5, 20

def mapa_bordas(video, de, ate):
    """Para cada meio segundo do trecho, a densidade de bordas em células de 30 px (y 480-1380)."""
    nx, ny = 1080 // CEL, (GY1 - GY0) // CEL
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{de:.2f}", "-t", f"{ate-de:.2f}", "-i", video, "-vf",
        f"fps={1/PASSO},crop=1080:{GY1-GY0}:0:{GY0},edgedetect=low=0.08:high=0.2,format=gray,scale={nx}:{ny}:flags=area",
        "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    n = nx * ny
    return [raw[i:i + n] for i in range(0, len(raw) - n + 1, n)], nx

def info_mask(quadro, nx):
    """Células com TEXTO (plaquinha, selo, chip): faixa horizontal de 3+ células seguidas com borda forte; com margem de 1 célula."""
    ny = len(quadro) // nx
    m = [[False] * nx for _ in range(ny)]
    for r in range(ny):
        c = 0
        while c < nx:
            if quadro[r * nx + c] >= TXT:
                j = c
                while j < nx and quadro[r * nx + j] >= TXT:
                    j += 1
                if j - c >= 3:
                    for k in range(c, j):
                        m[r][k] = True
                c = j
            else:
                c += 1
    d = [[False] * nx for _ in range(ny)]
    for r in range(ny):
        for c in range(nx):
            if m[r][c]:
                for rr in range(max(0, r - 1), min(ny, r + 2)):
                    for cc in range(max(0, c - 1), min(nx, c + 2)):
                        d[rr][cc] = True
    return d

def limpo(mask, nx, x, y, w, h):
    c0, c1 = x // CEL, min(nx, -(-(x + w) // CEL))
    r0, r1 = (y - GY0) // CEL, min(len(mask), -(-(y + h - GY0) // CEL))
    return not any(mask[r][c] for r in range(r0, r1) for c in range(c0, c1))

def candidatos2(w, h):
    c = [(MARG, y) for y in range(600, 1321 - h, 30)]
    c += [(1080 - w - MARG, y) for y in range(600, 1121 - h, 30)]
    return c

def agenda(video, de, ate, w, h, minimo=2.5):
    """Pedaços (início, fim, x, y) em que a folha fica num lugar sem nada embaixo; troca de lugar ou some quando precisa."""
    Q, nx = mapa_bordas(video, de, ate)
    C = candidatos2(w, h)
    M = [info_mask(q, nx) for q in Q]
    ok = [[limpo(m, nx, x, y, w, h) for (x, y) in C] for m in M]
    n = len(ok)
    ok2 = [[all(ok[j][k] for j in range(max(0, i - 1), min(n, i + 2))) for k in range(len(C))] for i in range(n)]  # margem de 0,5 s
    pedacos, i = [], 0
    while i < n:
        melhor, fim = None, i
        for k in range(len(C)):
            j = i
            while j < n and ok2[j][k]:
                j += 1
            if j > fim:
                melhor, fim = k, j
        if melhor is None:
            i += 1; continue
        t0, t1 = de + i * PASSO, min(ate, de + fim * PASSO)
        if t1 - t0 >= minimo:
            pedacos.append((round(t0, 2), round(t1, 2)) + C[melhor])
        i = fim
    if not pedacos and n:
        # regra 34 (Magno): nenhuma folha some. Sem canto livre, ela fica translúcida no canto que menos cobre texto.
        def cobre(k):
            x, y = C[k]
            c0, c1 = x // CEL, min(nx, -(-(x + w) // CEL))
            r0, r1 = (y - GY0) // CEL, -(-(y + h - GY0) // CEL)
            return sum(m[r][c] for m in M for r in range(r0, min(len(m), r1)) for c in range(c0, c1))
        k = min(range(len(C)), key=cobre)
        pedacos.append((round(de, 2), round(ate, 2)) + C[k] + ("translucida",))
    return pedacos

def aplicar(cfg_path):
    cfg = json.load(open(cfg_path))
    tmp = pathlib.Path(cfg["pasta_tmp"]); tmp.mkdir(parents=True, exist_ok=True)
    esc = cfg.get("escala", 0.58)
    ins, parts, last, k = ["-i", cfg["entrada"]], [], "0:v", 0
    for i, f in enumerate(cfg["folhas"]):
        soma = round(sum(v for _, v in f["linhas"]), 2)
        if abs(soma - f["total"]) > 0.05:
            sys.exit(f"PARADO: folha {i} ({f['titulo']}) soma {soma} ≠ total {f['total']}")
        p = folha_png(f, str(tmp / f"folha{i:02d}.png"), cfg.get("largura", 450))
        w, h = tamanho(p, esc)
        ped = agenda(cfg["entrada"], f["de"], f["ate"], w, h, f.get("min", 2.5))
        f["pedacos"] = ped
        print(f"folha {i}: {f['titulo']} ({w}x{h}) {f['ate']-f['de']:.1f}s -> " +
              (" | ".join(f"{pc[0]:.1f}-{pc[1]:.1f} em {pc[2]},{pc[3]}" + (" TRANSLÚCIDA" if len(pc) > 4 else "") for pc in ped) or "SEM LUGAR LIVRE (não aparece)"))
        for pc in ped:
            a, b, x, y = pc[:4]
            k += 1; d = min(0.35, (b - a) / 3)
            op = ",colorchannelmixer=aa=0.82" if len(pc) > 4 else ""
            ins += ["-loop", "1", "-t", str(b + 1), "-i", p]
            parts.append(f"[{k}:v]format=rgba,scale=iw*{esc}:-1{op},fade=t=in:st={a}:d={d}:alpha=1,fade=t=out:st={b-d}:d={d}:alpha=1[f{k}]")
            parts.append(f"[{last}][f{k}]overlay=x={x}:y={y}:enable='between(t,{a},{b})'[v{k}]")
            last = f"v{k}"
    json.dump(cfg, open(str(tmp / "config-usada.json"), "w"), ensure_ascii=False, indent=1)
    if cfg.get("so_agenda"):
        return
    cmd = ["ffmpeg", "-loglevel", "error", "-y", *ins, "-filter_complex", ";".join(parts) or "null", "-map", f"[{last}]", "-map", "0:a?",
           "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart",
           cfg["saida"][:-4] + ".tmp.mp4"]
    subprocess.run(cmd, check=True)
    dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                         capture_output=True, text=True).stdout.strip() or 0)
    a, b = dur(cfg["entrada"]), dur(cfg["saida"][:-4] + ".tmp.mp4")
    if abs(a - b) > 0.2:
        sys.exit(f"PARADO: duração {b:.2f}s diferente do original {a:.2f}s; arquivo provisório mantido")
    os.replace(cfg["saida"][:-4] + ".tmp.mp4", cfg["saida"])   # só aparece com o nome final quando está completo
    print("ok", cfg["saida"], f"{b:.2f}s")

if __name__ == "__main__":
    c = sys.argv[1]
    if c == "receita":
        print(json.dumps(receita(sys.argv[2]), ensure_ascii=False, indent=1))
    elif c == "palavras":
        palavras(sys.argv[2], " ".join(sys.argv[3:]))
    elif c == "aplicar":
        aplicar(sys.argv[2])
    elif c == "previa":
        previa(sys.argv[2], sys.argv[3])
