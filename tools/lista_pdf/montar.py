# Monta o config.json das folhas a partir de uma ficha curta da cidade e confere tudo.
# uso: python3 -I montar.py ficha.json saida_config.json
# ficha: {"video": "...mp4", "saida": "...mp4", "palavras": ".../palavras.json", "tmp": "...",
#   "anos": [{"ano": "2024", "receita_txt": ".../2024-12_PCMGE016.txt", "receita_total": 107949274.49,
#             "receita_rodape": "...", "despesa_total": 108667514.28, "despesa": [["Educação", 41495157.48], ...],
#             "despesa_rodape": "...", "receita_de": ["2024.", 1], "despesa_de": ["Educação,", 1], "despesa_ate": ["2025.", 1]}]}
# Âncoras: [expressão, ocorrência] procuradas no palavras.json; "despesa_ate" pode ser ["FIM_SETORES", seg] (tempo).
import json, sys, os, subprocess
T = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lista_pdf.py")
F = json.load(open(sys.argv[1]))
W = json.load(open(F["palavras"]))
ws = [w["w"].lower().strip(".,:;!?") for w in W]

def acha(expr, occ):
    alvo = [x.lower().strip(".,:;!?") for x in expr.split()]
    n = 0
    for i in range(len(ws) - len(alvo) + 1):
        if ws[i:i + len(alvo)] == alvo:
            n += 1
            if n == occ:
                return W[i]["s"]
    sys.exit(f"PARADO: não achei '{expr}' (ocorrência {occ})")

def tempo(a):
    return float(a) if isinstance(a, (int, float)) else acha(a[0], a[1])

folhas = []
for A in F["anos"]:
    r = json.loads(subprocess.run(["python3", "-I", T, "receita", A["receita_txt"], "x"], capture_output=True, text=True).stdout)
    linhas = [l for l in r["linhas"]]
    tot = round(A["receita_total"], 2)
    dif = round(tot - r["total"], 2)
    if abs(dif) >= 0.01:
        linhas.append([A.get("rotulo_ajuste", "Outros lançamentos do Balanço anual"), dif])
    folhas.append(dict(tipo="receita", titulo=f"Receita arrecadada · {A['ano']}", total=tot, linhas=linhas,
                       rodape=A["receita_rodape"], de=round(tempo(A["receita_de"]) - 0.1, 2), ate=round(tempo(A["despesa_de"]) - 0.15, 2)))
    d = [[n, round(v, 2)] for n, v in A["despesa"]]
    sd = round(sum(v for _, v in d), 2)
    if abs(round(A["despesa_total"] - sd, 2)) >= 0.01:
        d.append(["Demais funções", round(A["despesa_total"] - sd, 2)])
    folhas.append(dict(tipo="despesa", titulo=f"Despesa por setor · {A['ano']}", total=round(A["despesa_total"], 2), linhas=d,
                       rodape=A["despesa_rodape"], de=round(tempo(A["despesa_de"]) - 0.1, 2), ate=round(tempo(A["despesa_ate"]) - 0.15, 2)))
for f in folhas:
    s = round(sum(v for _, v in f["linhas"]), 2)
    neg = [n for n, v in f["linhas"] if v < -0.005 and not n.startswith("Outros lançamentos do Balanço")]
    print(f"{f['titulo']:42s} {f['de']:7.2f}-{f['ate']:7.2f} ({f['ate']-f['de']:5.1f}s) total {f['total']:>16,.2f} soma {s:>16,.2f} linhas {len(f['linhas'])}" + (f"  NEGATIVO: {neg}" if neg else ""))
cfg = dict(entrada=F["video"], saida=F["saida"], pasta_tmp=F["tmp"], folhas=folhas)
json.dump(cfg, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
