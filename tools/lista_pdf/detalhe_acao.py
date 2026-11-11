# Pedido do Magno (08/11/2026, regra 42): folha de setor com MAIS DETALHE.
# - Agrupa pelo NOME DA AÇÃO do PCMGE015 (ex.: "Promoção de festas religiosas, culturais e cívicas").
# - Setor com uma ação só: abre a ação pelos ELEMENTOS DE DESPESA (salários, material, serviços, obras...),
#   lidos do PCMGE015 do ano; só usa se a soma bater com o liquidado da ação (senão fica a linha única).
import re, collections

NUM = r"-?\d{1,3}(?:\.\d{3})*,\d{2}"
def f(s): return float(s.replace(".", "").replace(",", "."))

def nome_acao(s):
    s = re.sub(r"\s+", " ", s).strip(" -")
    t = s.lower()
    for a, b in [(" de ", " de "), (" da ", " da "), (" do ", " do "), (" e ", " e ")]:
        pass
    t = t[:1].upper() + t[1:]
    for sig in ["sus", "cras", "creas", "psf", "caps", "fundeb", "pnae", "pnate", "upa", "samu", "eja", "tfd", "pasep", "iptu", "ti"]:
        t = re.sub(rf"\b{sig}\b", sig.upper(), t)
    return t[:46] + ("…" if len(t) > 46 else "")

GRUPOS_EL = [("3.1.90.11", "Salários dos servidores"), ("3.1.90.04", "Contratados por tempo determinado"), ("3.1.90.16", "Salários dos servidores"),
             ("3.1.90.94", "Indenizações trabalhistas"), ("3.1.90.13", "Encargos (INSS e patronais)"), ("3.1.91.13", "Encargos (INSS e patronais)"),
             ("3.1.90.34", "Terceirização de mão de obra"), ("3.3.90.30", "Material e combustível"), ("3.3.90.32", "Material para distribuição"),
             ("3.3.90.14", "Diárias"), ("3.3.90.33", "Passagens"), ("3.3.90.35", "Consultorias"), ("3.3.90.36", "Serviços de pessoa física"),
             ("3.3.90.39", "Serviços de empresas"), ("3.3.90.40", "Sistemas e softwares (TI)"), ("3.3.90.37", "Locação de mão de obra"),
             ("3.3.90.46", "Auxílio-alimentação"), ("3.3.90.48", "Auxílios a pessoas"), ("3.3.90.47", "PASEP, tributos e contribuições"),
             ("3.3.90.92", "Despesas de anos anteriores"), ("3.3.90.93", "Indenizações e restituições"), ("3.3.50", "Repasses a entidades"),
             ("3.3.71", "Consórcios"), ("3.3.91", "Repasses entre órgãos"), ("4.4.90.51", "Obras e instalações"), ("4.4.90.52", "Equipamentos"),
             ("4.4.90.61", "Compra de imóveis"), ("4.6.90.71", "Parcelas da dívida (principal)"), ("3.2.90.21", "Juros da dívida"),
             ("4.6.90.73", "Correção da dívida"), ("3.3.90.91", "Sentenças judiciais"), ("3.3.90.08", "Benefícios assistenciais")]
def grupo_el(el):
    for p, n in sorted(GRUPOS_EL, key=lambda g: -len(g[0])):
        if el.startswith(p):
            return n
    return "Outras despesas"

def elementos_da_acao(txt_linhas, nome, alvo):
    """procura o bloco da ação pelo nome e soma o liquidado por grupo de elemento; devolve None se não fechar com o alvo"""
    chave = re.sub(r"\W", "", nome.upper())[:40]
    todos = []
    for i, l in enumerate(txt_linhas):
        if chave and chave in re.sub(r"\W", "", l.upper()) and not re.match(r"^\s*[34]\.[0-9]\.", l):
            els = _els(txt_linhas, i)
            r = _fecha(els, alvo)
            if r:
                return r
            todos += els
    # a mesma ação aparece em várias unidades (secretarias/fundos): soma os blocos de todas
    return _fecha(todos, alvo) if todos else None

def _bloco(txt_linhas, ini, alvo):
    return _fecha(_els(txt_linhas, ini), alvo)

def _els(txt_linhas, ini):
    els = []
    for l in txt_linhas[ini + 1: ini + 400]:
        u = l.upper()
        if re.search(r"TOTAL D[AO] (AÇÃO|PROJETO|ATIVIDADE)", u) or re.match(r"^\s*\d+\.\d+\.\d+\.\d+\.\d+\.\d+\.\d+\s+\D", l) or re.match(r"^\s*\d{1,2}\.\d{3,4}\.\d{2}\.\d{3}\.", l):
            break
        m = re.match(r"^\s*([34]\.[0-9]\.[0-9]{2}\.[0-9]{2}\.[0-9]{2})", l)
        if not m:  # formato compacto de 11 dígitos (E&L): 33903000000 1500000000 Material de Consumo ...
            m2 = re.match(r"^\s*([34][0-9]{10})\s+[0-9]{6,10}\s+", l)
            if m2:
                d = m2.group(1)
                el = f"{d[0]}.{d[1]}.{d[2:4]}.{d[4:6]}.{d[6:8]}"
                ns = re.findall(NUM, l[m2.end():].replace("(cid:9)", " "))
                if len(ns) >= 3:
                    els.append((el, [f(x) for x in ns]))
                continue
        if m:
            ns = re.findall(NUM, l[m.end():])
            if len(ns) >= 10:
                els.append((m.group(1), [f(x) for x in ns]))
    return els

def _fecha(els, alvo):
    if not els:
        return None
    # descobre a coluna do liquidado: a que, somando os elementos de detalhe, bate com o alvo
    det = [e for e in els if not e[0].endswith(".00")] or els
    for base in (det, els):
        n = min(len(v) for _, v in base)
        # tenta alinhar pela direita (colunas finais) e pela esquerda
        for k in list(range(n)):
            soma = sum(v[-n:][k] for _, v in base)
            if abs(soma - alvo) < 1.0:
                g = collections.defaultdict(float)
                for el, v in base:
                    g[grupo_el(el)] += v[-n:][k]
                return sorted(((a, round(b, 2)) for a, b in g.items() if abs(b) >= 0.01), key=lambda t: -t[1])
        # linhas de tamanhos diferentes (PDF com colunas vazias): usa, em cada linha, o valor que mais se repete
        # entre empenhado/liquidado (o liquidado costuma aparecer repetido nas colunas "até o mês")
        vals = []
        for el, v in base:
            c = collections.Counter(round(x, 2) for x in v if x > 0)
            rep = [x for x, q in c.most_common() if q >= 2]
            vals.append((el, rep[0] if rep else 0.0))
        if abs(sum(x for _, x in vals) - alvo) < 1.0:
            g = collections.defaultdict(float)
            for el, x in vals:
                g[grupo_el(el)] += x
            return sorted(((a, round(b, 2)) for a, b in g.items() if abs(b) >= 0.01), key=lambda t: -t[1])
    return None

def _nada():
    for base in ():
        n = 0
        for k in range(n):
            soma = 0
            if abs(soma - alvo) < 1.0:
                g = collections.defaultdict(float)
                for el, v in base:
                    g[grupo_el(el)] += v[-n:][k]
                return sorted(((a, round(b, 2)) for a, b in g.items() if abs(b) >= 0.01), key=lambda t: -t[1])
    return None

# grupos que contam como gasto com PESSOAL (regra 45)
PESSOAL = {"Salários dos servidores", "Contratados por tempo determinado", "Encargos (INSS e patronais)",
           "Indenizações trabalhistas", "Terceirização de mão de obra", "Auxílio-alimentação"}
