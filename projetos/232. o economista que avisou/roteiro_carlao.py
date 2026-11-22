# Monta o roteiro.json do 232 para o motor Carlão (motor-rs), a partir de palavras.ts e dos números do roteiro (já conferidos no fontes.md).
import json, re
P = 'src/videos/economistaavisou/palavras.ts'
W = json.loads(re.search(r'=\s*(\[.*\])', open(P).read(), re.S).group(1))
def t(frase, depois=0.0):
    """início da primeira ocorrência de 'frase' (palavras seguidas) depois do tempo 'depois'"""
    alvo = [re.sub(r'\W', '', x).lower() for x in frase.split()]
    for i in range(len(W)):
        if W[i]['s'] < depois: continue
        if [re.sub(r'\W', '', w['w']).lower() for w in W[i:i + len(alvo)]] == alvo: return W[i]['s']
    raise SystemExit(f'não achei: {frase}')
fim = W[-1]['e'] + 0.4
# legenda: blocos de até 5 palavras, quebrando no fim de frase
leg, cur = [], []
for w in W:
    cur.append(w)
    if len(cur) >= 5 or re.search(r'[.?!:]$', w['w']):
        leg.append({'inicio': cur[0]['s'], 'fim': cur[-1]['e'], 'texto': ' '.join(x['w'] for x in cur),
                    'palavras': [{'inicio': x['s'], 'fim': x['e'], 'texto': x['w']} for x in cur]}); cur = []
if cur: leg.append({'inicio': cur[0]['s'], 'fim': cur[-1]['e'], 'texto': ' '.join(x['w'] for x in cur), 'palavras': [{'inicio': x['s'], 'fim': x['e'], 'texto': x['w']} for x in cur]})
b = [0.0, t('Pedro Paulo'), t('Primeiro, duas palavras'), t('2015. O governo'), t('O IBGE fechou'), t('Aí veio o Teto'),
     t('E levou números'), t('No lugar dele'), t('Novembro de 2026'), t('E ele volta aos juros'), t('Quem defende a regra'),
     t('E o que ele propõe'), t('Ele acertou ou exagerou'), fim]
N = lambda v, r, d='': {'peca': 'numero', 'dados': {'valor': v, 'rotulo': r, 'detalhe': d}}
L = lambda vs, rs, r, pre='', suf='', c=0: {'peca': 'linha', 'dados': {'valores': vs, 'rotulos': rs, 'rotulo': r, 'prefixo': pre, 'sufixo': suf, 'casas': c}}
cenas = [
    N('R$ 60 bi', 'Ajuste mandado ao Congresso em 2026', 'Nov/2016, no Senado: "a conta do Teto não fecha"'),
    N('Unicamp', 'Pedro Paulo Zahluth Bastos, professor titular de economia', 'Desenvolvimentista · critica a austeridade'),
    N('Primário x juros', 'As regras fiscais limitam o gasto primário', 'Os juros ficam de fora de qualquer limite'),
    N('~3%', 'Queda do PIB que ele previu em out/2015', 'Arrecadação cai, dívida sobe'),
    N('-3,5%', 'IBGE: PIB de 2015', 'Artigo de 2017: recessão, perda de apoio, impeachment (leitura dele)'),
    N('< 1% do PIB', 'Resto do governo em 2036, pela conta dele', 'Teto: 20 anos corrigido só pela inflação · "Inviável"'),
    L([1.70, 0.70], ['Gasto social', 'Juros'], 'Volta para a economia de cada R$ 1 (números que ele atribuiu ao IPEA)', 'R$ ', '', 2),
    N('70%', 'Do que a receita crescer pode virar gasto', 'Entre 0,6% e 2,5% ao ano acima da inflação · maio/2023: alguém vai ser espremido'),
    N('PLP 299', 'Ajuste de 2027, chegou ao Congresso em nov/2026', 'Piso da saúde cresce menos · "2015 de novo", para ele'),
    L([1200, 60], ['Juros em 12 meses', 'Ajuste inteiro'], 'Juros até setembro x ajuste (R$ bilhões)', 'R$ ', ' bi'),
    N('Custo da dívida', 'Para ele, a crise é do custo da dívida, não da dívida', 'Defensores: previsibilidade · governo: não é choque fiscal'),
    N('5 propostas', 'Limite pela saúde e educação · investimento fora da regra', 'Mais imposto de quem ganha muito · meta de 4,5% · reindustrializar'),
    N('Acertou ou exagerou?', 'Comenta aqui', 'Segue @eumagnoleite'),
]
for i, c in enumerate(cenas): c.update(inicio=round(b[i], 2), fim=round(b[i + 1], 2))
r = {'titulo': '232. O economista que avisou (motor Carlão)', 'estilo': 'mesa', 'audio': 'audio/232-economista-narracao.wav',
     'cabecalho': {'titulo': 'O ECONOMISTA QUE AVISOU', 'arroba': '@eumagnoleite', 'fonte': 'FONTES: SENADO, IBGE, EC 95, LC 200, BANCO CENTRAL, PLP 299/2026'},
     'legenda': leg, 'cenas': cenas}
json.dump(r, open('projetos/232. o economista que avisou/roteiro.json', 'w'), ensure_ascii=False, indent=1)
print(len(leg), 'falas ·', len(cenas), 'cenas ·', ' '.join(f"{c['inicio']:.0f}" for c in cenas), '· fim', round(fim, 1))
