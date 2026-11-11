# Atualiza projetos/_status-municipios.md sozinho: cidade com mp4 em VIDEOS PRONTOS vira "Pronto · 100"
# e o render em andamento aparece como "Gerando agora". Roda em loop pelo coordenador (regra 61).
import os, re, datetime, unicodedata

RAIZ = os.path.expanduser("~/Estúdio 3D Explicado/projetos")
ARQ = os.path.join(RAIZ, "_status-municipios.md")
PRONTOS = os.path.expanduser("~/Documents/VIDEOS PRONTOS - FOLHA POR SETOR")

def n(s):
    return re.sub(r"[^A-Z ]", "", unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().upper()).strip()

prontos = {n(f[:-4]) for f in os.listdir(PRONTOS) if f.endswith(".mp4") and ".tmp" not in f}
trava = ""
try:
    trava = open(os.path.join(RAIZ, "_render.lock")).read().strip()
except OSError:
    pass

linhas = open(ARQ, encoding="utf-8").read().split("\n")
saida = []
for l in linhas:
    m = re.match(r"^\| (\d+) \| ([^|]+?) \| ([^|]*) \| (\d+) \|$", l)
    if m and "–" not in m.group(1):
        num, cid, st, pc = m.groups()
        if n(cid) in prontos and int(pc) < 100:
            l = f"| {num} | {cid} | Pronto na pasta | 100 |"
        elif trava and n(cid).replace(" ", "") in n(trava).replace(" ", "") and int(pc) < 100 and "Gerando" not in st:
            l = f"| {num} | {cid} | Gerando agora ({trava.split('·')[-1].strip()}) | {pc} |"
    if l.startswith("Atualizado:"):
        l = re.sub(r"^Atualizado: [^·]*", "Atualizado: " + datetime.datetime.now().strftime("%d/%m/%Y %H:%M") + " (automático) ", l)
    saida.append(l)
feitos = sum(1 for l in saida if re.match(r"^\| \d+ \|.*\| 100 \|$", l))
saida = [l for l in saida if not l.startswith("Prontos:")]
saida.insert(2, f"Prontos: {feitos} de 40")
open(ARQ, "w", encoding="utf-8").write("\n".join(saida))
