# Fontes do 063. orçamento de Lauro de Freitas

Consulta: 08/11/2026. Fonte principal: e-TCM Consulta Pública (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 231 "LAURO DE FREITAS". Unidades com conta própria: Prefeitura UJ 835 e Câmara UJ 264. Não há autarquia, instituto de previdência nem empresa com conta própria no e-TCM (o select não tem outra unidade de Lauro; os Anexos 9 de 2024 e 2025 só têm os órgãos da Prefeitura e o órgão 50, Câmara).
Pasta: DOC = ~/Documents/RECEITAS-DESPESAS-LAURO-DE-FREITAS/documentos_tcm/ (cada PDF tem um .txt ao lado; "l." = linha do .txt). Scripts: ~/Documents/RECEITAS-DESPESAS-LAURO-DE-FREITAS/scripts/ (anexo6.py, acoes2026.py, setores.py, conferir.py). Saídas: saida/anexo6_2024.json, anexo6_2025.json, acoes_2026-09.json, setores.json.
Critério: 2024 e 2025 = EMPENHADO do Balanço Orçamentário (PCAGO015, "MUNICÍPIO DE LAURO DE FREITAS", já soma Prefeitura e Câmara) e do Anexo 9 (PCAGO007, "Total Geral" = Balanço). Gasto por ação: Anexo 6 (PCAGO004; soma das ações = Balanço, centavo a centavo). 2026 = LIQUIDADO até 09/2026: PCMGE015 da Prefeitura (formato Contabilis, "relDemonstrativoDespesaOrc") + PCMGE015 da Câmara, do mesmo mês.
O PCMGE015 de 09/2026 da Prefeitura não traz a função de cada ação. A função veio do PCMGE015 de 08/2026 (SIGA, código completo "órgão.unidade.função.subfunção.programa.tipo.ação"), casando unidade + código da ação: as 362 ações de setembro acharam uma função única (scripts/acoes2026.py). Os valores são todos de setembro.
Receita: o TOTAL declarado, sem nenhum desconto por conta própria. 2024 e 2025 = "SUBTOTAL DAS RECEITAS (III)", Receitas Realizadas, do Balanço (= "Total:" do Anexo 10). Esse total já vem com as deduções do Fundeb lançadas pelo próprio município (Anexo 10 2024 l.375; 2025 l.367). 2026 = linha "Totais:", Total Até Mês, do PCMGE016 09/2026 (arrecadada até o mês menos anulada; as deduções do Fundeb aparecem em coluna separada, como no Balanço). A Câmara não tem receita.
Divergência anotada: o PCMGE015 SIGA 12/2025 (emitido 05/02/2026, consolidado) soma 975.734.975,66 empenhados; o Balanço (assinado 30–31/03/2026) soma 1.019.423.663,43. Para 2024 e 2025 vale o Balanço/Anexos (versão final do ano).
Valores na fala arredondados para 1 casa de milhão; o exato vai nas plaquinhas.

## Receita e gasto total
- 2024 arrecadou R$ 1.056.120.901,39 → DOC/2024-13_ANUAL_PCAGO015.pdf l.45 "SUBTOTAL DAS RECEITAS (III)", Receitas Realizadas → fala "1 bilhão e 56 milhões", tela.
- 2024 gastou R$ 1.103.814.872,41 → DOC/2024-13_ANUAL_PCAGO015.pdf l.106 "SUBTOTAL DAS DESPESAS (XI)", Despesas Empenhadas; = Anexo 9 "Total Geral" (DOC/2024-13_ANUAL_PCAGO007.pdf l.122) → fala "1 bilhão e 104 milhões", tela.
- 2024 déficit R$ 47.693.971,02 → DOC/2024-13_ANUAL_PCAGO015.pdf l.54 "DÉFICIT (VI)" → fala "O próprio balanço chama isso de déficit: 47 milhões e 700", tela "A MAIS".
- 2025 arrecadou R$ 1.126.986.889,77 → DOC/2025-13_ANUAL_PCAGO015.pdf l.41 → fala "1 bilhão e 127 milhões", tela.
- 2025 gastou R$ 1.019.423.663,43 → DOC/2025-13_ANUAL_PCAGO015.pdf l.104, Despesas Empenhadas; = Anexo 9 (DOC/2025-13_ANUAL_PCAGO007.pdf l.114) → fala "1 bilhão e 19 milhões", tela.
- 2025 superávit R$ 107.563.226,34 → DOC/2025-13_ANUAL_PCAGO015.pdf l.115 "SUPERÁVIT (XIV)" → fala "O balanço fecha com superávit, ou seja, sobra: 107 milhões e 600", tela.
- 2026 (até 09) arrecadou R$ 873.830.268,92 → DOC/2026-09_PCMGE016.pdf l.429 "Totais:", Total Até Mês → fala "873 milhões e 800", tela.
- 2026 (até 09) gastou (liquidado) R$ 903.740.899,33 (conta própria) = Prefeitura 869.449.867,10 (DOC/2026-09_PCMGE015.pdf l.5448 "Total Geral", Liquidações Acumulado) + Câmara 34.291.032,23 (DOC/2026-09_CAMARA_PCMGE015.pdf l.270 "Total do Poder", Liquidações Até Mês) → fala "903 e 700", tela.
- 2026 a mais: 903.740.899,33 − 873.830.268,92 = R$ 29.910.630,41 (conta própria) → fala "29 milhões e 900 a mais", tela.
- 2026 (até 09) empenhado R$ 1.108.665.326,01 (conta própria) = 1.066.467.159,74 (Prefeitura l.5448, Empenhos Acumulado) + 42.198.166,27 (Câmara l.270, Empenhos Até Mês) → fala "já empenhou, ou seja, reservou para pagar, 1 bilhão e 109 milhões" e "uma parte é folha que ainda vai vencer" (regra 054).
- Arrecadação 2025 − 2024 = 70.865.988,38 (conta própria) → fala "subiu quase 71 milhões".

## Setores (script scripts/setores.py; soma dos setores + "fora da fala" = total de cada ano, centavo a centavo)
REGRAS DO MUNICÍPIO (anti-engano): cada ação entra em um setor só, nesta ordem: Câmara (função 01), Educação (12), Saúde (10), Assistência social (08), Cultura e festas (13), Esporte (27), Dívidas, precatórios e encargos (28); depois, "Obras e serviços urbanos" = o resto do ÓRGÃO da Secretaria de Infraestrutura/Serviços Públicos (2024: órgãos 08 Serviços Públicos + 09 Infraestrutura; 2025: órgão 08 Infraestrutura e Serviços Públicos; 2026: órgão 19), com limpeza urbana, resíduos, drenagem (função 17) e iluminação pública e pavimentação (função 15); "Meio ambiente" = o resto do ÓRGÃO da Secretaria de Meio Ambiente (a secretaria lança os salários na função 04: pela função, 2025 daria zero, o que enganaria); "Administração" = o resto das funções 04 e 03 (em 2026 a Procuradoria aparece na função 03 Judiciária). Fora da fala (entram só no total): Segurança e guarda (06), Urbanismo da Sec. de Planejamento (15 fora da Infraestrutura), Direitos da cidadania (14), Transporte e trânsito (26), Habitação (16), Trabalho (11), Comércio (23), Ciência e tecnologia (19).
- Educação (12): 2024 R$ 360.564.553,29 (DOC/2024-13_ANUAL_PCAGO007.pdf l.38) "360 e 600" · 2025 R$ 334.254.947,83 (DOC/2025-13_ANUAL_PCAGO007.pdf l.35) "334 e 300" · 2026 R$ 272.718.628,33 (função 12, saida/acoes_2026-09.json, liquidado) "272 e 700".
- Saúde (10): 2024 R$ 251.374.567,79 (A9 2024 l.117) "251 e 400" · 2025 R$ 211.041.460,81 (A9 2025 l.109) "211 milhões" · 2026 R$ 195.124.790,88 (= órgão 10, DOC/2026-09_PCMGE015.pdf l.1646, Liquidações Acumulado) "195 e 100".
- Administração (regra acima, conta própria): 2024 R$ 147.836.209,78 "147 e 800" · 2025 R$ 98.532.522,98 "98 e 500" · 2026 R$ 98.646.809,35 "98 e 600".
- Obras e serviços urbanos (órgão): 2024 R$ 137.626.658,81 = 107.404.831,27 (A9 2024 l.32, órgão 08) + 30.221.827,54 (l.36, órgão 09) "137 e 600" · 2025 R$ 165.583.319,23 (A9 2025 l.33, órgão 08) "165 e 600" · 2026 R$ 168.784.263,75 (órgão 19 menos as ações de esporte 1102/1103/2108 da unidade 1901, que vão para Esporte) "168 e 800".
- Câmara (01): 2024 R$ 38.198.725,06 (A9 2024 l.120) "38 e 200" · 2025 R$ 43.688.687,77 (A9 2025 l.112) "43 e 700" · 2026 R$ 34.291.032,23 (DOC/2026-09_CAMARA_PCMGE015.pdf l.270) "34 e 300".
- Dívidas, precatórios e encargos (28): 2024 R$ 57.232.500,88 (Fazenda 57.231.836,49 A9 2024 l.29 + Educação 664,39) "57 e 200" · 2025 R$ 89.757.467,12 (Fazenda 88.930.312,11 + Educação 817.249,07 + Desenv. Social 9.905,94, A9 2025) "89 e 800"; inclui "Serviço da dívida interna (juros e amortizações)" 71.25 mi (Anexo 6 2025) · 2026 R$ 42.509.097,93 (função 28; serviço da dívida 26,50 mi liquidado) "42 e 500".
- Cultura e festas (13): 2024 R$ 8.867.854,69 (A9 2024 l.60) "8 e 900" · 2025 R$ 6.962.465,94 (A9 2025 l.40) "7 milhões" · 2026 R$ 14.440.240,07 (função 13) "14 e 400".
- Assistência social (08): 2024 R$ 36.163.922,31 (A9 2024 l.46) "36 e 200" · 2025 R$ 25.314.855,62 (A9 2025 l.44) "25 e 300" · 2026 R$ 18.497.815,86 (função 08) "18 e 500".
- Esporte (27): 2024 R$ 4.332.746,19 (A9 2024 l.43) "4 e 300" · 2025 R$ 1.086.275,88 (A9 2025 l.41) "1 milhão e 100" · 2026 R$ 4.351.775,35 (função 27, Sec. de Cultura/Esporte + quadras da Infraestrutura) "4 e 400".
- Meio ambiente (órgão): 2024 R$ 8.831.379,17 (A9 2024 l.103, órgão 17) "8 e 800" · 2025 R$ 5.287.481,43 (A9 2025 l.58, órgão 17) "5 e 300" · 2026 R$ 6.593.627,25 (órgão 14) "6 e 600".
- Comparação 2024 x 2025 (conta própria): saúde −40.333.106,98 → "40 milhões a menos"; assistência −10.849.066,69 → "quase 11 milhões a menos". Contexto conferido: os repasses do SUS ficaram parecidos (Anexo 10: 2024 R$ 103.757.695,79, l.150; 2025 R$ 105.963.646,86, l.156), e a Secretaria de Saúde de 2024 liquidou 250.560.817,57 dos 251.374.568,79 empenhados (DOC/2024-12_PCMGE015.pdf l.4937): a queda não é só empenho sem pagamento. A fala não diz o motivo.

## Achado: conta de eventos
- 2024: ação 2315 "APOIO E REALIZAÇÃO DE EVENTOS CULTURAIS" (Sec. de Cultura e Turismo), R$ 8.816.239,87 empenhados → DOC/2024-13_ANUAL_PCAGO004.pdf l.1332 → fala "8 milhões e 800 em 2024".
- 2025: mesma ação 2315, R$ 5.318.747,74 → DOC/2025-13_ANUAL_PCAGO004.pdf l.878 → fala "5 milhões e 300".
- 2026 (até 09): ação 2111 "PROMOÇÃO E INCENTIVO A EVENTOS CULTURAIS E DE LAZER" (unidade 1202 Fundo Municipal de Cultura): dotação inicial R$ 10.995.279,94; adição 10.395.768,70; anulação 250.389,36; dotação atualizada R$ 21.140.659,28; empenhado 16.671.428,40; LIQUIDADO R$ 14.373.122,07 → DOC/2026-09_PCMGE015.pdf l.3829 → gancho "já passou de 14 milhões", fala "começou com 11 milhões previstos e subiu para 21 milhões e 100. Até setembro, já pagou 14 milhões e 400".
- "Mais que 2024 e 2025 somados": 8.816.239,87 + 5.318.747,74 = 14.134.987,61 < 14.373.122,07 (conta própria; 2026 pelo LIQUIDADO, critério mais rígido que o empenhado dos anos fechados).
- Procurado em todas as ações dos três anos por EVENT, FEST, CARNAV, JOÃO, JUNIN, SHOW, NATAL, RÉVEILLON, ANIVERS: nos anos fechados não há outra ação de festa; em 2026 há "Fomento a eventos esportivos e de lazer" (179.000,00 liquidado, função 27) e "Festa de Yemanjá" (0,00), fora da conta citada.
- Inexigibilidades de 2026 com produtoras artísticas e de eventos aparecem na prestação de 09/2026 (PCMGE020): contexto, não ditas.

## Maternidade municipal
- 2026: ação 1034 "CONSTRUÇÃO DA MATERNIDADE MUNICIPAL DE LAURO DE FREITAS", dotação inicial e atual R$ 17.439.528,00; empenhado 1.700.000,00; liquidado R$ 684.260,75 → DOC/2026-09_PCMGE015.pdf l.1762 → fala "Dos 17 milhões e 400 previstos para ela neste ano, 684 mil foram pagos até setembro".
- A Tarde, 07/05/2026, "Primeira maternidade: a parceria de R$ 100 milhões que vai beneficiar Lauro de Freitas", https://atarde.com.br/bahia/primeira-maternidade-a-parceria-de-r-100-milhoes-que-vai-beneficiar-lauro-de-freitas-1388193 : ordem de serviço assinada em 07/05/2026; execução pela Prefeitura com financiamento federal; "até dois anos para ficar pronta" → fala "teve ordem de serviço em maio de 2026, segundo o jornal A Tarde. A obra deve levar cerca de dois anos". A fala não diz que a obra está parada.
- A Tarde, 06/05/2026, "Lauro de Freitas ganha primeira maternidade municipal", https://atarde.com.br/politica/lauro-de-freitas-ganha-primeira-maternidade-municipal-1388119 (contexto: 100 leitos, Via Metropolitana).

## Calamidade financeira
- Correio, 08/01/2025, "Prefeitura de Lauro de Freitas decreta estado de calamidade financeira", https://www.correio24horas.com.br/minha-bahia/prefeitura-de-lauro-de-freitas-decreta-estado-de-calamidade-financeira-0125 : Decreto nº 5.432, de 07/01/2025, 90 dias prorrogáveis; a gestão atual fala em dívidas de curto prazo acima de R$ 150 mi (valores da prefeitura, NÃO ditos no vídeo) → gancho, fala "Em janeiro, a prefeitura decretou calamidade financeira, segundo o jornal Correio", pergunta final.
- A Tarde, 16/01/2025, "Cinco cidades baianas decretam estado de calamidade financeira", https://atarde.com.br/economia/cinco-cidades-baianas-decretam-estado-de-calamidade-financeira-1303411 (confirma; contexto).
- Suspensão do carnaval de 2025: só achei o título de uma página do BNews que não abriu (HTTP 403). NÃO entra no vídeo.

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município LAURO DE FREITAS, consulta 08/11/2026, https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/)
- 134 processos listados. Sobre 2024: Representação do Ministério Público 25659e24 ("falta de conduta que afeta o equilíbrio das contas públicas..."), julgada em 04/03/2026, publicada em 12/03/2026: "Representação conhecida e julgada improcedente" (DOC/decisoes/25659e24_delib.pdf, l.84–85 do .txt sem linhas vazias; https://www.tcm.ba.gov.br/sistemas/textos/2024/delib/25659e24.odt.pdf) → fala "uma representação do Ministério Público sobre as contas de 2024 foi julgada improcedente".
- Sobre 2025 e 2026, julgadas improcedentes e arquivadas: 24982e25 (atos de pessoal e despesas, 14/05/2026) e 24290e25 (pintura de prédios, 15/10/2026) (DOC/decisoes/). Não ditas uma a uma.
- Sem julgamento publicado (sem data de julgamento no detalhe do site): 01299e26 (pregão 002/2026, TI), 12189e25 (pregão 005/2025, informática), 14004e26 e 21747e26 (pregão 017/2026, representações do MP), 29497e25 (pregão 023/2025, transporte escolar), 30565e26 (programa "Proteção para Quem Cuida", 2026), 29143e26 (termo de ocorrência, acumulação de vínculos, exercício 2025) → fala "Sete processos sobre 2025 e 2026, a maioria sobre licitações, ainda não têm julgamento publicado" (5 dos 7 são sobre pregões). Sem nomes no vídeo.

## Escala da maquete
- 1 moeda = R$ 2 mi, 1 pilha (10 moedas) = R$ 20 mi (cidade grande, orçamento de R$ 1 bilhão). Só muda o desenho; o placar diz a escala.

## 2ª conferência (08/11/2026, antes do vídeo final)
- Texto de TODOS os 17 PDFs do e-TCM extraído de novo do zero (~/Documents/RECEITAS-DESPESAS-LAURO-DE-FREITAS/saida/conf2/) e conferido com scripts/conferir.py: 37 de 37 valores achados, nas mesmas linhas.
- Ações refeitas a partir do texto novo: PCMGE015 09/2026 (362 ações, liquidado 869.449.867,10 = "Total Geral", função de todas achada no SIGA 08/2026) e Anexos 6 de 2024 e 2025 (162 e 154 ações): arquivos idênticos à 1ª leitura; soma dos setores = 1.103.814.872,41 / 1.019.423.663,43 / 903.740.899,33.
- Notícias conferidas de novo: maternidade (A Tarde 06 e 07/05/2026; nenhuma notícia nova de andamento ou paralisação achada em 08/11/2026: a fala só diz ordem de serviço, prazo e o pago); calamidade (Correio 08/01/2025, A Tarde 16/01/2025). TCM: lista de decisões de 08/11/2026.
- Tela: "R$ 1,056 BI" (1.056.120.901,39); "R$ 1,104 BILHÃO" (1.103.814.872,41); "R$ 1,127 BILHÃO" (1.126.986.889,77); "R$ 1,019 BILHÃO" (1.019.423.663,43); "R$ 1,109 BILHÃO" (1.108.665.326,01); "R$ 40,3 MI A MENOS" (40.333.106,98); "R$ 10,8 MI A MENOS" (10.849.066,69); "R$ 14,1 MI" (14.134.987,61); "R$ 684 MIL" (684.260,75); "R$ 17,4 MI" (17.439.528,00); "R$ 21,1 MI" (21.140.659,28); "R$ 11 MI" (10.995.279,94).

---------------------------------------------------------------------------------------------------------------
# VERSÃO 3 (09/11/2026): molde Ubaitaba, GASTOU = LIQUIDADO (regra 32). Vale esta seção; as de cima ficam como histórico.
Saem da v3: calamidade financeira e maternidade (só tinham notícia como fonte; regra 25), tarifa bancária (regra 60: só Ilhéus).
Scripts novos: scripts/liquidado.py (liquidado por ação; 2024 e 2026 Contabilis, 2025 SIGA), setores_liq.py, elementos_siga.py, folhas_setores.py.

## Receita (total declarado, igual à v2)
- 2024 R$ 1.056.120.901,39 (DOC/2024-13_ANUAL_PCAGO015.pdf l.45) → abertura "1 bilhão e 56 milhões", tag do mapa "R$ 1,056 BI".
- 2025 R$ 1.126.986.889,77 (DOC/2025-13_ANUAL_PCAGO015.pdf l.41) → "1 bilhão e 127 milhões".
- 2026 até set R$ 873.830.268,92 (DOC/2026-09_PCMGE016.pdf l.429, Totais/Total Até Mês) → "873 milhões e 800".
- Folhas de receita (itens IPTU, ISS, FPM etc.): saida/folha-pdf/config-base-v3.json, soma das linhas = total (diferença 0,00).

## Gasto total (LIQUIDADO)
- 2024 R$ 1.102.986.562,98 → DOC/2024-13_ANUAL_PCAGO015.pdf l.106, coluna Despesas Liquidadas (4º valor) → "1 bilhão e 103 milhões". PCMGE015 dez/2024 da Prefeitura (liquidado acumulado 1.064.802.397,13, l.5847 "Total Geral") + Câmara (38.184.166,85, DOC/2024-12_CAMARA_PCMGE015.pdf "Total do Poder") = 1.102.986.563,98: R$ 1,00 a mais que o Balanço (na Saúde); a folha da Saúde 2024 usa o PCMGE015.
- 2024 a mais: 1.102.986.562,98 − 1.056.120.901,39 = R$ 46.865.661,59 (conta própria) → "46 milhões e 900 a mais do que arrecadou".
- 2025 R$ 993.342.358,72 → DOC/2025-13_ANUAL_PCAGO015.pdf l.104, Despesas Liquidadas = PCMGE015 dez/2025 Prefeitura 949.669.220,95 ("Total do Poder", Liquidações Até Mês) + Câmara 43.673.137,77 → "993 milhões e 300".
- 2025 a menos: 1.126.986.889,77 − 993.342.358,72 = R$ 133.644.531,05 (conta própria) → "133 milhões e 600 a menos do que arrecadou".
- 2026 até set R$ 903.740.899,33 (= v2: Prefeitura 869.449.867,10 + Câmara 34.291.032,23, liquidado) → "903 milhões e 700"; a mais R$ 29.910.630,41; empenhado R$ 1.108.665.326,01 → "já se comprometeu com 1 bilhão e 109 milhões".

## Setores (LIQUIDADO; scripts/setores_liq.py; soma = total de cada ano). Mesmas regras de setor da v2 (Obras e Meio ambiente pelo órgão).
| setor | 2024 | 2025 | 2026 até set | fala |
|---|---|---|---|---|
| Educação | 360.564.553,29 | 332.398.169,31 | 272.718.628,33 | 360 e 600 / 332 e 400 / 272 e 700 |
| Saúde | 250.560.817,57 | 207.894.604,81 | 195.124.790,88 | 250 e 600 / 207 e 900 / 195 e 100 |
| Administração | 147.836.209,78 | 96.861.556,07 | 98.646.809,35 | 147 e 800 / 96 e 900 / 98 e 600 |
| Obras e serviços urbanos | 137.626.658,81 | 150.999.894,62 | 168.784.263,75 | 137 e 600 / 151 milhões / 168 e 800 |
| Câmara de Vereadores | 38.184.166,85 | 43.673.137,77 | 34.291.032,23 | 38 e 200 / 43 e 700 / 34 e 300 |
| Dívidas e precatórios (função 28) | 57.232.500,88 | 89.757.467,12 | 42.509.097,93 | 57 e 200 / 89 e 800 / 42 e 500 |
| Cultura e festas (função 13) | 8.867.854,69 | 5.611.895,39 | 14.440.240,07 | 8 e 900 / 5 e 600 / 14 e 400 |
| Assistência social (08) | 36.163.922,31 | 22.790.004,95 | 18.497.815,86 | 36 e 200 / 22 e 800 / 18 e 500 |
| Esporte (27) | 4.332.746,19 | 497.745,54 | 4.351.775,35 | 4 e 300 / 498 mil / 4 e 400 |
| Meio ambiente (órgão) | 8.831.379,17 | 5.284.814,83 | 6.593.627,25 | 8 e 800 / 5 e 300 / 6 e 600 |
Fonte por ano: 2024 DOC/2024-12_PCMGE015.pdf (Contabilis; função das ações pelo Anexo 6 de 2024: empenhado por função = Anexo 9, Saúde com R$ 1,00 de diferença); 2025 DOC/2025-12_PCMGE015.pdf (SIGA); 2026 DOC/2026-09_PCMGE015.pdf (função pelo SIGA 08/2026). Câmara: PCMGE015 da Câmara de cada período.

## Achados (liquidado)
- Saúde 2024 → 2025: 250.560.817,57 − 207.894.604,81 = R$ 42.666.212,76 → "42 milhões e 700 a menos" (pergunta: "42 milhões a menos"). Assistência: 36.163.922,31 − 22.790.004,95 = R$ 13.373.917,36 → "13 milhões e 400 a menos". Arrecadação: +70.865.988,38 → "quase 71 milhões".
- Eventos culturais: 2024 ação 2315 liquidado R$ 8.816.239,87 (PCMGE015 dez/2024) → "8 milhões e 800"; 2025 ação 2315 liquidado R$ 3.968.177,19 (PCMGE015 dez/2025; empenhado 5.318.747,74) → "quase 4 milhões"; 2026 ação 2111 dotação inicial 10.995.279,94 → atualizada 21.140.659,28, liquidado R$ 14.373.122,07 (DOC/2026-09_PCMGE015.pdf l.3829) → "o previsto subiu de 11 para 21 milhões", "já gastou 14 milhões e 400". 2024 + 2025 = 12.784.417,06 < 14.373.122,07 (conta própria) → "Mais que os dois anos anteriores somados".
- Salários e encargos 2025 (todos os elementos 3.1.* liquidados, com as linhas de outra fonte): Prefeitura R$ 567.084.518,58 (DOC/2025-12_PCMGE015.pdf) + Câmara R$ 35.573.751,69 (DOC/2025-12_CAMARA_PCMGE015.pdf) = R$ 602.658.270,27 (scripts/elementos_siga.py; soma de todos os elementos = total liquidado, centavo a centavo) → "602 milhões e 700".
- Câmara 2025 43.673.137,77 → "43 e 700"; Esporte 2025 497.745,54 → "menos de 500 mil".
- Duodécimo da Câmara (folha da Câmara): 2024 recebeu R$ 38.203.516,26, devolveu R$ 2.201,52 do exercício (DOC/2024-13_CAMARA_PCAGE062.pdf, Demonstrativo do Fluxo Financeiro; o texto do PDF junta os números das notas, conferido pelo total R$ 45.030.913,02); 2025 recebeu R$ 43.690.048,82 (DOC/2025-13_CAMARA_PCAGE062.pdf l.21 "Transferências Financeiras Recebidas"), devolveu R$ 2.232,99 (l.31; DOC/2025-13_CAMARA_REPASSE.pdf l.11, 31/01/2025); 2026 até set recebeu R$ 35.422.968,78 (DOC/2026-09_CAMARA_PCMGE018.pdf l.657, conta 4.5.1.1.2.02 Repasse recebido), devolveu R$ 1.631,18 (l.592).
- Tribunal: igual à v2 (25659e24 improcedente; 7 processos de 2025/2026 sem julgamento publicado).
- Fora do vídeo (só levantamento): tarifas bancárias 2025 R$ 991.358,37 (Prefeitura 980.798,70 + Câmara 10.559,67, elemento 3.3.90.39.81 com as linhas de outra fonte); rendimento das aplicações 2025 R$ 21.482.147,69 (PCMGE016 dez/2025, 1.3.2.1.01: arrecadada 22.463.100,40 − anulada 980.952,71). A ferramenta tarifas_bancarias.py dava 977.139,16 + 10.559,67 (não soma a linha de outra fonte) e rendimento 21.436.085,79 (desconta a dedução, que no SIGA de Lauro já está fora da coluna arrecadada).
