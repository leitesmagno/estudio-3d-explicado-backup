# Regra 51 (Magno, 09/11/2026): sacada final "tarifas bancárias x dinheiro rendendo no banco".
# Soma, por ano, o LIQUIDADO do elemento 3.3.90.39.81 (Serviços bancários) no PCMGE015 da Prefeitura e da Câmara,
# e a receita "Remuneração de Depósitos Bancários" (1.3.2.1.01, líquida das anulações) no PCMGE016 da Prefeitura.
# uso: python3 -I tarifas_bancarias.py <pasta RECEITAS-DESPESAS-X>
# Saída: tabela por ano + linhas brutas para conferência (formato do PDF pode variar: confira sempre as linhas).
import sys, glob, os, re

NUM = r"-?\d{1,3}(?:\.\d{3})*,\d{2}"
def f(s): return float(s.replace(".", "").replace(",", "."))
def br(v): return f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

pasta = sys.argv[1].rstrip("/")
docs = pasta + "/documentos_tcm"

def escolhe(ano, padrao, rx):
    c = sorted(p for p in glob.glob(f"{docs}/{ano}-*{padrao}") if re.fullmatch(rx, os.path.basename(p)))
    if not c:
        return None
    dez = [p for p in c if f"/{ano}-12_" in p]
    return dez[0] if (dez and ano != "2026") else c[-1]

def tarifas(txt):
    tot, brutas = 0.0, []
    for l in open(txt, encoding="utf-8", errors="ignore"):
        if re.match(r"^\s*3\.3\.90\.39\.81", l) or re.match(r"^\s*33903981\d*\s", l):
            ns = re.findall(NUM, l)
            if len(ns) >= 12:                      # SIGA: fixada, alt, anul, total, emp mês, emp até, liq mês, LIQ ATÉ...
                tot += f(ns[-12:][7])
            brutas.append(l.rstrip()[:200])
    return tot, brutas

def rendimentos(txt):
    for l in open(txt, encoding="utf-8", errors="ignore"):
        if re.match(r"^\s*1\.3\.2\.1\.01", l) or "Remuneração de Depósitos Bancários" in l.replace("R e mun", "Remun"):
            ns = re.findall(NUM, l)
            if len(ns) >= 9:                       # prevista, arrec mês, ded mês, anul mês, ARREC ATÉ, DED ATÉ, ANUL ATÉ, ...
                v = [f(x) for x in ns[-9:]]
                return v[4] - abs(v[5]) - abs(v[6]), l.rstrip()[:200]
    return None, None

for ano in ("2024", "2025", "2026"):
    p015 = escolhe(ano, "_PCMGE015.txt", r"\d{4}-\d{2}_PCMGE015\.txt")
    c015 = escolhe(ano, "_CAMARA_PCMGE015*.txt", r"\d{4}-\d{2}_CAMARA_PCMGE015(\.pdf)?\.txt")
    p016 = escolhe(ano, "_PCMGE016.txt", r"\d{4}-\d{2}_PCMGE016\.txt")
    tp, bp = tarifas(p015) if p015 else (None, [])
    tc, bc = tarifas(c015) if c015 else (None, [])
    rd, lr = rendimentos(p016) if p016 else (None, None)
    print(f"== {ano}")
    print(f"  tarifas Prefeitura: {br(tp) if tp is not None else 'SEM PCMGE015'}  ({os.path.basename(p015) if p015 else '-'}, {len(bp)} linhas)")
    print(f"  tarifas Câmara:     {br(tc) if tc is not None else 'SEM PCMGE015'}  ({os.path.basename(c015) if c015 else '-'}, {len(bc)} linhas)")
    print(f"  rendeu no banco:    {br(rd) if rd is not None else 'NÃO ACHADO'}  ({os.path.basename(p016) if p016 else '-'})")
    for b in bp + bc:
        print("    ", b)
    if lr:
        print("    ", lr)
