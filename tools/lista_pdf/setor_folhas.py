# Regra 29: uma folha por SETOR falado, com o detalhamento (subfunção) do PCMGE015 daquele ano; valores somam o total dito.
# uso: python3 -I setor_folhas.py params.json   -> grava config.json (receita do ano + folhas de setor)
# params: {"config_base": ".../folha-pdf/config.json"  (já tem as folhas de receita e a de despesa única por ano),
#          "palavras": "...", "saida": "...mp4",
#          "anos": [{"ano": "2024", "acoes": ".../acoes_2024-12.json", "campo": "emp", "despesa_de": 16.9, "despesa_ate": 41.55,
#                    "setores": [{"fala": "Educação", "nome": "Educação", "funcs": ["12"], "total": 190535578.27,
#                                 "extra_acoes": [["23","2036"]], "unica": "texto da linha única (Câmara)"}, ...]}]}
import json, sys, collections, os

SUBF = {"031": "Ação legislativa", "032": "Conselhos municipais", "061": "Ação judiciária", "092": "Representação judicial", "122": "Administração geral (pessoal e manutenção)",
 "123": "Administração financeira", "124": "Controle interno", "125": "Fiscalização", "126": "Tecnologia da informação", "128": "Formação de servidores",
 "129": "Arrecadação de tributos", "131": "Comunicação social", "182": "Defesa civil", "241": "Assistência ao idoso", "242": "Pessoa com deficiência",
 "243": "Criança e adolescente", "244": "Assistência comunitária", "301": "Atenção básica (postos e PSF)", "302": "Hospital e média/alta complexidade",
 "303": "Medicamentos", "304": "Vigilância sanitária", "305": "Vigilância epidemiológica", "306": "Alimentação e nutrição", "331": "Proteção ao trabalhador",
 "361": "Ensino fundamental", "362": "Ensino médio", "364": "Ensino superior", "365": "Educação infantil (creches e pré-escola)",
 "366": "Educação de jovens e adultos", "367": "Educação especial", "368": "Educação básica", "391": "Patrimônio histórico", "392": "Difusão cultural e eventos",
 "422": "Direitos individuais", "451": "Obras de infraestrutura urbana", "452": "Serviços urbanos (limpeza e manutenção)", "453": "Transporte coletivo",
 "482": "Habitação", "511": "Saneamento rural", "512": "Saneamento urbano e drenagem", "541": "Preservação ambiental", "542": "Controle ambiental",
 "543": "Recuperação de áreas degradadas", "544": "Recursos hídricos", "601": "Produção vegetal", "605": "Abastecimento", "606": "Extensão rural",
 "608": "Produção agropecuária", "695": "Turismo", "752": "Iluminação pública (energia)", "782": "Transporte rodoviário", "811": "Esporte de rendimento",
 "812": "Esporte comunitário", "813": "Lazer", "841": "Refinanciamento da dívida", "843": "Parcelas e juros da dívida", "846": "Outros encargos (PASEP, sentenças)",
 "272": "Previdência dos servidores", "091": "Procuradoria (defesa jurídica)", "751": "Iluminação pública (energia)", "245": "Outras ações de assistência (subfunção 245)", "273": "Previdência complementar", "845": "Outras transferências",
 "181": "Policiamento (guarda municipal)", "183": "Informação e inteligência", "121": "Planejamento e orçamento", "127": "Ordenamento territorial",
 "130": "Normatização", "184": "Segurança pública (outras)", "246": "Assistência (outras)", "271": "Previdência básica", "274": "Previdência especial",
 "332": "Relações de trabalho", "333": "Empregabilidade", "334": "Fomento ao trabalho", "363": "Ensino profissional",
 "421": "Custódia e reintegração social", "423": "Assistência aos povos indígenas", "481": "Habitação rural", "602": "Produção animal",
 "603": "Defesa sanitária vegetal", "604": "Defesa sanitária animal", "607": "Irrigação", "631": "Reforma agrária", "661": "Promoção industrial",
 "691": "Promoção comercial", "692": "Comercialização", "722": "Telecomunicações", "781": "Transporte aéreo", "784": "Transporte hidroviário",
 "785": "Transportes especiais", "571": "Desenvolvimento científico", "573": "Difusão do conhecimento", "545": "Meteorologia", "662": "Produção industrial"}

P = json.load(open(sys.argv[1]))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import detalhe_acao as DA
DET = P.get("detalhe", "acao") == "acao"   # regra 42: detalhe por ação (e elementos quando só há uma ação)
_cache = {}
def TXT(p):
    if p not in _cache:
        _cache[p] = open(p, encoding="utf-8", errors="ignore").read().splitlines()
    return _cache[p]
W = json.load(open(P["palavras"]))
cfg = json.load(open(P["config_base"]))
receitas = [f for f in cfg["folhas"] if f["tipo"] == "receita"]

def tempo(expr, de, ate):
    alvo = [x.lower().strip(".,:;!?") for x in expr.split()]
    ws = [w["w"].lower().strip(".,:;!?") for w in W]
    for i in range(len(ws) - len(alvo) + 1):
        if ws[i:i + len(alvo)] == alvo and de - 0.3 <= W[i]["s"] <= ate:
            return W[i]["s"]
    sys.exit(f"PARADO: não achei '{expr}' entre {de} e {ate}")

def br(v):
    return f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

novas = []
for A in P["anos"]:
    acs = sum((json.load(open(a)) for a in (A["acoes"] if isinstance(A["acoes"], list) else [A["acoes"]])), [])
    k = A["campo"]
    marcas = [(tempo(s["fala"], A["despesa_de"], A["despesa_ate"]), s) for s in A["setores"]]
    marcas.sort(key=lambda m: m[0])
    for j, (t0, S) in enumerate(marcas):
        t1 = marcas[j + 1][0] if j + 1 < len(marcas) else A["despesa_ate"]
        if S.get("linhas"):
            linhas = [list(l) for l in S["linhas"]]
        elif "unica" in S and not (abs(S["total"]) < 0.01 and S.get("funcs")):
            linhas = [[S["unica"], round(S["total"], 2)]]
        else:
            g = collections.defaultdict(float)
            acoes_sel = {}
            emp_sel, liq_sel = [0.0], [0.0]
            EX = {(e[0], e[1]): (e[2] if len(e) > 2 else None) for e in S.get("extra_acoes", [])}
            SEM = [list(e) for e in S.get("sem_acoes", [])]
            for x in acs:
                fa = [x["func"], x["acao"]]
                org = str(x.get("org", ""))
                if org in S.get("sem_orgaos", []) and tuple(fa) not in EX:
                    continue
                if (x["func"] in S["funcs"] and fa not in SEM) or tuple(fa) in EX or org in S.get("orgaos", []):
                    nome = SUBF.get(x["subf"].zfill(3), f"Subfunção {x['subf'].zfill(3)}")
                    if x["func"] == "12" and x["subf"].zfill(3) == "782":
                        nome = "Transporte escolar"
                    if DET:
                        nome = DA.nome_acao(x["nome"])
                        acoes_sel[nome] = x["nome"]
                    if tuple(fa) in EX:
                        nome = EX[tuple(fa)] or x["nome"].capitalize()[:40]
                        if DET:
                            acoes_sel[nome] = x["nome"]
                    g[nome] += x[k]
                    if A.get("campo_emp"):
                        emp_sel[0] += x[A["campo_emp"]]; liq_sel[0] += x[k]
            itens = sorted(((n, round(v, 2)) for n, v in g.items() if abs(v) >= 0.01), key=lambda t: -t[1])
            # regra 48: setor zerado também tem folha, com as ações que o PDF lista e gasto R$ 0,00
            if not itens and g:
                zer = sorted(g)[:6]
                linhas = [[n, 0.0] for n in zer]
                if len(g) > 6:
                    linhas.append([f"Outras {len(g) - 6} ações", 0.0])
                if A.get("campo_emp") and emp_sel[0] >= 0.01:
                    linhas.append(["Empenhado ainda não liquidado", round(emp_sel[0], 2)])
                S = dict(S); S.setdefault("destaque", "Ações previstas no orçamento, sem nenhum real gasto (liquidado R$ 0,00)")
                ano = A["ano"]
                novas.append(dict(tipo="despesa", titulo=f"{S['nome']} · {ano} · onde foi", total=round(S["total"], 2), linhas=linhas,
                                  rodape=S.get("rodape", A["rodape"]), destaque=S["destaque"], de=round(t0 - 0.1, 2), ate=round(t1 - 0.15, 2), min=1.5))
                print(f"{ano} {S['nome']:28s} {t0:6.1f}-{t1:6.1f} ZERADO  " + " | ".join(n for n, _ in linhas))
                continue
            # regra 42b: setor com até 2 ações abre pelos ELEMENTOS (onde exatamente foi: salários, juros, precatórios, material...)
            if DET and 1 <= len(itens) <= 2 and A.get("pcmge015"):
                junta = collections.defaultdict(float); ok = True
                for nm, v in itens:
                    el = DA.elementos_da_acao(TXT(A["pcmge015"]), acoes_sel[nm], v) if nm in acoes_sel else None
                    if not el:
                        ok = False; break
                    for a, b in el:
                        junta[a] += b
                if ok and len(junta) >= len(itens):
                    itens = sorted(((a, round(b, 2)) for a, b in junta.items() if abs(b) >= 0.01), key=lambda t: -t[1])
            # regra 45: faixa de destaque com o PESSOAL do setor (salários + encargos + contratados) e as DIÁRIAS,
            # somando os elementos de todas as ações do setor (só se todas fecharem com o liquidado)
            if DET and A.get("pcmge015") and not S.get("destaque") and acoes_sel:
                tot_el = collections.defaultdict(float); ok = True
                for nm, v in g.items():
                    if nm not in acoes_sel or abs(v) < 0.01:
                        continue
                    el = DA.elementos_da_acao(TXT(A["pcmge015"]), acoes_sel[nm], v)
                    if not el:
                        ok = False; break
                    for a, b in el:
                        tot_el[a] += b
                if ok and tot_el:
                    pes = sum(b for a, b in tot_el.items() if a in DA.PESSOAL)
                    dia = tot_el.get("Diárias", 0.0)
                    if pes >= 0.01 or dia >= 0.01:
                        S = dict(S)
                        S["destaque"] = "Pessoal (salários e encargos): R$ " + br(pes) + (f" · diárias: R$ {br(dia)}" if dia >= 0.01 else "")
            linhas = [list(t) for t in itens[:6]]
            resto = round(sum(v for _, v in itens[6:]), 2)
            if itens[6:]:
                linhas.append([f"Outras {len(itens) - 6} áreas", resto])
            if A.get("campo_emp"):
                nl = round(emp_sel[0] - liq_sel[0], 2)
                d0 = round(S["total"] - sum(v for _, v in linhas), 2)
                if nl >= 0.01 and abs(d0 - nl) < abs(d0):
                    linhas.append(["Empenhado ainda não liquidado", nl])
            dif = round(S["total"] - sum(v for _, v in linhas), 2)
            if abs(dif) >= 0.01:
                linhas.append([S.get("rotulo_ajuste", "Ajuste ao Anexo 9 (classificação)"), dif])
        ano = A["ano"]
        novas.append(dict(tipo="despesa", titulo=f"{S['nome']} · {ano} · onde foi", total=round(S["total"], 2), linhas=linhas,
                          rodape=S.get("rodape", A["rodape"]), **({"destaque": S["destaque"]} if S.get("destaque") else {}), de=round(t0 - 0.1, 2), ate=round(t1 - 0.15, 2), min=1.5))
        print(f"{ano} {S['nome']:28s} {t0:6.1f}-{t1:6.1f} total {br(S['total']):>16s}  " + " | ".join(f"{n} {br(v)}" for n, v in linhas))
cfg["folhas"] = receitas + novas
cfg["saida"] = P["saida"]
json.dump(cfg, open(P["config_saida"], "w"), ensure_ascii=False, indent=1)
print("config:", P["config_saida"], len(cfg["folhas"]), "folhas")
