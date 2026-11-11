# Regras 32/33/33b: atualiza params-setores.json de uma cidade
#  - setores de 2024/2025 pelo LIQUIDADO (campo liq, com linha "Empenhado ainda não liquidado" se a fala usou o empenhado)
#  - Câmara: custos por grupo (liquidado) + destaque com o duodécimo recebido/devolvido
# uso: python3 -I atualiza_params.py <pasta RECEITAS-DESPESAS-X>
import json, sys, glob, os, re, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import camara_folha as CF

pasta = sys.argv[1].rstrip("/")
docs = pasta + "/documentos_tcm"
P_path = pasta + "/saida/params-setores.json"
P = json.load(open(P_path))
os.makedirs(pasta + "/saida/antigos", exist_ok=True)
json.dump(P, open(pasta + "/saida/antigos/params-setores (antes regras 32-33).json", "w"), ensure_ascii=False, indent=1)

def txt_de(pdf):
    for c in (pdf[:-4] + ".txt", pdf + ".txt"):
        if os.path.exists(c):
            return c
    return None

import unicodedata
def _n(s):
    return re.sub(r"[^a-z]", "", unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower())
CIDADE = os.path.basename(pasta).replace("RECEITAS-DESPESAS-", "").replace("-", " ")
def doc_da_cidade(txt):
    """confere se o nome do município aparece no começo do documento (regra: conferir o município dentro de cada PDF)"""
    head = _n(open(txt, encoding="utf-8", errors="ignore").read()[:3000])
    alvo = _n(CIDADE)
    return alvo in head or alvo.replace("de", "") in head

def duod(ano, mes):
    """duodécimo recebido/devolvido: PCAGE062 anual; se faltar ou vier 0, razão PCMGE018 (conta 'Repasse recebido')."""
    cand = []
    if ano in ("2024", "2025"):
        cand += [txt_de(p) for p in glob.glob(f"{docs}/{ano}-13*CAMARA*PCAGE062*.pdf")]
        cand += [txt_de(p) for p in sorted(glob.glob(f"{docs}/{ano}-12*CAMARA*PCMGE018*.pdf"))]
    if mes:
        cand += [txt_de(p) for p in sorted(glob.glob(f"{docs}/{mes}*CAMARA*PCMGE018*.pdf"))]
    else:
        cand += [txt_de(p) for p in sorted(glob.glob(f"{docs}/{ano}-*CAMARA*PCMGE018*.pdf"), reverse=True)]
    rec = dev = src = None
    for t in [x for x in cand if x]:
        if not doc_da_cidade(t):
            relatorio.append(f"!! {os.path.basename(t)} NÃO é de {CIDADE} (documento ignorado)")
            continue
        r, d = CF.duodecimo(t)
        if dev is None and d:
            dev = d
        if r:
            rec, src = r, t
            break
    return rec, dev, src

def destaque(rec, dev, gasto):
    s = f"Recebeu da prefeitura (duodécimo): R$ {CF.br(rec)}"
    if dev:
        return s + f" · sobrou e devolveu R$ {CF.br(dev)}"
    sobra = round(rec - gasto, 2)
    if sobra > 0.01:
        return s + f" · gastou R$ {CF.br(gasto)}, sobraram R$ {CF.br(sobra)}"
    return s

relatorio = []
for A in P["anos"]:
    ano = A["ano"]
    if ano in ("2024", "2025"):
        A["campo"] = "liq"; A["campo_emp"] = "emp"
    # regra 42: PCMGE015 da Prefeitura do ano (para abrir por elemento as ações únicas)
    cand015 = sorted(p for p in glob.glob(f"{docs}/{ano}-*_PCMGE015.txt") if re.fullmatch(r"\d{4}-\d{2}_PCMGE015\.txt", os.path.basename(p)))
    if cand015:
        A["pcmge015"] = cand015[-1] if ano == "2026" else next((p for p in cand015 if f"{ano}-12_" in p), cand015[-1])
    for S in A["setores"]:
        if "Câmara" not in S["nome"]:
            continue
        cands = sorted(glob.glob(f"{docs}/{ano}-*CAMARA*PCMGE015*.txt") + glob.glob(f"{docs}/{ano}-*CAM*015*.txt"))
        best = None
        for c in set(cands):
            g = CF.custos(c)
            tl = round(sum(v[1] for v in g.values()), 2); te = round(sum(v[0] for v in g.values()), 2)
            if tl <= 0:
                continue
            d = min(abs(tl - S["total"]), abs(te - S["total"]))
            if best is None or d < best[0]:
                best = (d, c, g, tl, te)
        rec, dev, dd = duod(ano, None)
        if not best:
            if rec:
                S["destaque"] = destaque(rec, dev, S["total"])
            relatorio.append(f"{ano} Câmara: SEM PCMGE015 legível (folha de 1 linha) | duodécimo {CF.br(rec) if rec else 'NÃO ACHADO'}")
            continue
        d, c, g, tl, te = best
        lin = sorted(([n, round(v[1], 2)] for n, v in g.items() if abs(v[1]) >= 0.01), key=lambda t: -t[1])
        dif = round(S["total"] - sum(v for _, v in lin), 2)
        if abs(dif) >= 0.01:
            rot = "Empenhado ainda não liquidado" if (dif > 0 and abs((te - tl) - dif) < 0.05) else "Ajuste (diferença entre relatórios do TCM)"
            lin.append([rot, dif])
        mes = os.path.basename(c)[:7]
        rec, dev, dd = duod(ano, mes)
        S.pop("unica", None)
        S["linhas"] = lin
        if rec:
            S["destaque"] = destaque(rec, dev, S["total"])
        S["rodape"] = f"PCMGE015 {mes} da Câmara (liquidado)" + (f" · duodécimo: {os.path.basename(dd).split('.pdf')[0]}" if dd else "") + " · TCM-BA"
        relatorio.append(f"{ano} Câmara: total falado {CF.br(S['total'])} | liquidado {CF.br(tl)} | empenhado {CF.br(te)} | duodécimo {CF.br(rec) if rec else 'NÃO ACHADO'} | devolveu {CF.br(dev) if dev else '-'} | fonte {os.path.basename(c)}")
json.dump(P, open(P_path, "w"), ensure_ascii=False, indent=1)
print("\n".join(relatorio))
