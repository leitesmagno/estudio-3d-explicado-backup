# Fontes do 123. orçamento de morro do chapéu (BA)

Consulta: 11/11/2026 (downloads no e-TCM no Claude in Chrome, com a trava _navegador.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta MORRO-DO-CHAPEU, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-MORRO-DO-CHAPEU/documentos_tcm/` (75 PDFs, cada um com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho de todos os PDFs ("MORRO DO CHAPÉU" / "MORRO DO CHAPEU" / "Morro do Chapéu") e competência dos mensais conferida na linha "Competência:" (12/2024, 12/2025, 08/2026 e 09/2026).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 262 (MORRO DO CHAPÉU) · Prefeitura UJ 866 · Câmara UJ 295 · Instituto de Previdência dos Servidores UJ 578. Último mês entregue pela Prefeitura em 2026: 09/2026 (10/2026 "Pendente"); a Câmara entregou até 08/2026 (09/2026 "Pendente"), mas os demonstrativos CONSOLIDADOS de 09/2026 da Prefeitura já trazem a Câmara até setembro. Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/morro-do-chapeu.json.
"Gastou" = despesa LIQUIDADA. "Arrecadou" = receita realizada. Totais de 2024 e 2025 = Balanço Orçamentário do município (PCAGO015, Anexo 12). 2026 = demonstrativos consolidados de set/2026 (PCMGE015 consolidado SIGA para a despesa; PCMGE066 e PCMGE016 consolidado para a receita).
Os PCMGE015 por unidade da Prefeitura (2024-12_PCMGE015_2 e 2025-12_PCMGE015) não fecham com o Balanço (em 2024 o liquidado da unidade é menor que o pago em vários elementos); por isso a despesa por setor vem do PCMGE015 CONSOLIDADO (Prefeitura, fundos, Câmara e Previdência), que em 2025 bate com o Balanço centavo a centavo.
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e saida/a015_*.json); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; leitor scripts/acoes_cons.py)
- Arquivos: `2024-12_PCMGE015.pdf`, `2025-12_PCMGE015_2.pdf` e `2026-09_PCMGE015.pdf` (todos "Demonstrativo Consolidado da Despesa Orçamentária", SIGA). Valor de cada ação = "Total da Ação de Governo", 2ª linha (Até o Mês), coluna Liquidada.
- Somas: 2024 = 250.328.442,26 (`2024-12_PCMGE015.pdf` p.126, TOTAL, Liquidada até o mês) · 2025 = 266.478.969,91 (`2025-12_PCMGE015_2.pdf` p.133 = Balanço 2025) · 2026 até set = 209.094.811,19 (`2026-09_PCMGE015.pdf` p.141).
- 2024: o Balanço (251.526.035,65) fica 1.197.593,39 acima do consolidado de dezembro (250.328.442,26); a mesma diferença aparece no empenhado (252.663.567,65 x 251.465.974,26). Conta própria. A fala usa o Balanço (gastou 251 milhões e 500); os setores somam o consolidado.
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 17, 25, 26 e a manutenção da Secretaria de Obras, Transportes e Serviços Públicos (função 04) · Administração 02, 04 e 06 (demais secretarias) · Dívidas e encargos 28 (operações especiais: parcelas de empréstimos, juros, precatórios e obrigações) · Previdência dos servidores = Instituto de Previdência (função 09) · Assistência social 08 · Câmara 01 · Cultura 13 e a manutenção da Secretaria de Cultura e Turismo (função 04) · Agricultura e meio ambiente 18 e 20 · Esporte 27 e a manutenção da Secretaria de Esporte e Lazer (função 04).
- Regra 99 (Festas e eventos x Cultura): a única ação com nome de evento, "GESTAO DE EVENTOS DE TURISMO" (2194.2160.4.122.106.2.2122), ficou em R$ 0,00 nos três anos (`2024-12_PCMGE015.pdf` p.38, `2025-12_PCMGE015_2.pdf` p.40, `2026-09_PCMGE015.pdf` p.43); por isso "Festas e eventos" não é dito (nada de "zero"). A ação "PROMOCAO DAS ATIVIDADES CULTURAIS E TRADICIONAIS" (2194.2150.13.392.40.2.2015) não tem festa no nome e o consolidado não abre o subelemento de bandas e palco; fica em "Cultura" e é dita como "ação de atividades culturais e tradicionais". Nos PCMGE015 da unidade Prefeitura há elementos de bandas e palco dentro dela (2025: 3.3.90.39.94 bandas 18.676,00, 3.3.90.39.95 palco 153.224,00, 3.3.90.39.23 festividades 118.850,00), mas esse arquivo não fecha com o Balanço em 2024 e não existe para 2026; por isso não foi usado para separar.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Morro do Chapéu arrecadou 259 milhões em 2024 | 259.246.925,51 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| 293 milhões em 2025 | 293.082.344,83 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| 214 milhões até setembro de 2026 | 214.279.392,60 | 2026-09_PCMGE066.pdf | p.11 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês (= 2026-09_PCMGE016.pdf p.14 · TOTAL · Arrecadação até Mês 227.270.406,34 + Anulada até Mês −12.991.013,74, conta própria) |
| Em 2025, o ICMS, do Estado, mandou 48 milhões e 400 | 48.369.964,02 | 2025-12_PCMGE016.pdf (unidade Prefeitura) | p.4 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês 48.773.223,40 + Anulada até Mês −403.259,38 (já sem o Fundeb: Deduções até Mês 12.193.305,54). Conta própria |
| O FPM, da União, 47 milhões | 47.034.845,14 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês 47.034.846,65 + Anulada −1,51 (Deduções 10.188.619,89) |
| O SUS mandou 44 milhões e 300 | 44.335.783,71 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.3.00.0.0 (União) 48.656.388,15 − 5.190.883,94 + p.5 · 1.7.2.3.00.0.0 (Estado) 979.722,52 − 109.443,02 (soma: conta própria) |
| O Fundeb trouxe 41 milhões e 400 | 41.431.328,34 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.1.50.0.0 Transferências de Recursos do Fundeb · 41.451.875,90 − 20.547,56 |
| e a complementação da União ao Fundeb, mais 34 milhões e 600 | 34.600.639,26 | 2025-12_PCMGE016.pdf | p.4 · 1.7.1.5.00.0.0 · 36.163.107,98 − 1.562.468,72 |
| 2024: arrecadou 259 milhões e 200 | 259.246.925,51 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 251 milhões e 500 | 251.526.035,65 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 7 milhões e 700 | 7.720.889,86 | conta própria | 259.246.925,51 − 251.526.035,65 |
| 2025: arrecadou 293 milhões e 100 | 293.082.344,83 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 266 milhões e 500 | 266.478.969,91 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE015_2.pdf p.133, TOTAL) |
| Sobraram 26 milhões e 600 | 26.603.374,92 | conta própria | 293.082.344,83 − 266.478.969,91 |
| 2026, até setembro: arrecadou 214 milhões e 300 | 214.279.392,60 | 2026-09_PCMGE066.pdf | p.11 · TOTAL GERAL (acima) |
| Gastou 209 milhões e 100 | 209.094.811,19 | 2026-09_PCMGE015.pdf (consolidado) | p.141 · TOTAL · 2ª linha (Até o Mês) · Liquidada |
| Sobraram 5 milhões e 200 | 5.184.581,41 | conta própria | 214.279.392,60 − 209.094.811,19 |
| E já comprometeu 273 milhões e 600 | 273.642.179,61 | 2026-09_PCMGE015.pdf | p.141 · TOTAL · 2ª linha · Empenhada |

## Setores (soma = total do consolidado do ano; somas das ações por setor: conta própria, saida/setores.json)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 75 e 200 · 99 e 300 · 72 e 900 | 75.152.208,03 | 99.310.137,79 | 72.883.357,67 |
| Saúde | 52 e 200 · 58 e 800 · 51 e 600 | 52.177.541,25 | 58.830.375,25 | 51.649.988,98 |
| Obras e serviços urbanos | 66 e 700 · 42 e 700 · 30 e 200 | 66.698.107,46 | 42.650.164,40 | 30.214.723,67 |
| Administração | 14 e 900 · 18 e 800 · 15 e 500 | 14.923.695,89 | 18.766.923,55 | 15.468.318,42 |
| Dívidas e encargos | 15 e 700 · 22 e 300 · 16 e 900 | 15.660.352,98 | 22.338.098,97 | 16.850.914,30 |
| Previdência dos servidores | 5 milhões e 800 · 6 milhões e 700 · 5 milhões e 600 | 5.777.512,68 | 6.741.696,81 | 5.565.502,34 |
| Assistência social | 5 milhões · 6 milhões · 4 milhões e 700 | 4.983.523,76 | 6.025.392,04 | 4.669.580,65 |
| Câmara de Vereadores | 8 milhões e 100 · 9 milhões · 7 milhões e 800 | 8.149.119,89 | 8.962.196,86 | 7.794.128,65 |
| Cultura | 5 milhões e 600 · 1 milhão e 300 · 2 milhões e 300 | 5.594.070,34 | 1.332.644,22 | 2.295.538,84 |
| Agricultura e meio ambiente | 643 mil · 789 mil · 872 mil | 643.144,05 | 789.217,60 | 872.191,80 |
| Esporte | 569 mil · 732 mil · 831 mil | 569.165,93 | 732.122,42 | 830.565,87 |
| Festas e eventos | (não dito: 0 nas ações com nome de evento) | 0,00 | 0,00 | 0,00 |
| **Soma** | | 250.328.442,26 | 266.478.969,91 | 209.094.811,19 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 0,00 (ação "Gestão de eventos de turismo", 2024-12_PCMGE015.pdf p.38; a ação "Promoção das atividades culturais e tradicionais" está em Cultura)
- Festas e eventos 2025: R$ 0,00 (2025-12_PCMGE015_2.pdf p.40)
- Festas e eventos 2026: R$ 0,00 (2026-09_PCMGE015.pdf p.43, até setembro)
- Cultura 2024: R$ 5.594.070,34 · Cultura 2025: R$ 1.332.644,22 · Cultura 2026: R$ 2.295.538,84

## A Câmara (razão da própria Câmara, PCMGE018; em 2026, razão consolidado da Prefeitura, PCMGE064/018 de set/2026)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 8 milhões e 150 | 8.149.969,90 | 2024-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (devolução no ano: 735,62, mesma página, 3.5.1.1.2.09.00, Debitado até o Mês; não dita) |
| Em 2025, 8 milhões e 960 | 8.962.358,90 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 6 mil | 6.437,88 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| Até setembro de 2026, já recebeu 8 milhões e 190 | 8.194.569,11 | 2026-09_PCMGE018.pdf (Demonstrativo Consolidado das Contas do Razão) | p.29 · 4.5.1.1.2.02.00.02 REPASSES RECEBIDOS DO PODER LEGISLATIVO (conta da Câmara no consolidado) · Até o Mês, Crédito (= 7.284.061,32 até agosto + 910.507,79 em setembro; o até agosto confere com 2026-08_CAMARA_PCMGE018.pdf p.5 · REPASSE RECEBIDO 7.284.061,32) |
- Gasto da Câmara (liquidado, para a folha e a fala dos setores): 8.149.119,89 (2024) · 8.962.196,86 (2025) · 7.794.128,65 (2026 até set), do PCMGE015 consolidado.

## Os empréstimos e a pavimentação
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a prefeitura previa pegar 7 milhões e 600 emprestados | 7.620.000,00 | 2024_PCAGO015.pdf | p.1 · Operações de Crédito · Previsão Inicial (= 2024-12_PCMGE016_2.pdf p.6 · 2.1.0.0.00.0.0 · Prevista) |
| Pegou 19 milhões e 700 | 19.682.000,00 | 2024_PCAGO015.pdf | p.1 · Operações de Crédito · Receitas Realizadas (= 2024-12_PCMGE016_2.pdf p.6 · 2.1.0.0.00.0.0 · 19.730.937,53 − 48.937,53) |
| No mesmo ano, a pavimentação de ruas previa 5 milhões e 200 | 5.211.100,00 | 2024-12_PCMGE015.pdf (consolidado) | p.11 · ação 2120.2121.15.451.90.1.1009 "CONSTRUCAO, RESTAURACAO E PAVIMENTACAO DE VIAS PUBLICAS" · Total da Ação de Governo · Dotação Fixada |
| e gastou 34 milhões e 100 | 34.123.954,52 | 2024-12_PCMGE015.pdf | p.11 · mesma ação · 2ª linha (Até o Mês) · Liquidada (dotação atual 36.579.231,29) |
| Em 2025, pegou mais 1 milhão e 350 | 1.350.000,00 | 2025_PCAGO015.pdf | p.1 · Operações de Crédito · Receitas Realizadas (previsão 480.000,00) |
| E o orçamento de 2026 prevê mais 43 milhões e 700 em empréstimos | 43.748.000,00 | 2026-09_PCMGE066.pdf | p.9 · 2.1.0.0.00.0.0 Operações de Crédito · Previsto (arrecadado até setembro: 0,00) |
| (pergunta) se as dívidas já levam mais de 15 milhões por ano | 15.660.352,98 · 22.338.098,97 · 16.850.914,30 | PCMGE015 consolidados | Dívidas e encargos (função 28) de 2024, 2025 e 2026 até set (tabela dos setores). 2025: ação 2070.2070.28.846.105.3.300 p.5: amortização 15.729.810,03, juros 3.845.112,46, obrigações 2.690.364,99 e sentenças 72.811,49 |

## A cultura
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2025, a ação de atividades culturais e tradicionais previa 7 milhões | 7.040.000,00 | 2025-12_PCMGE015_2.pdf (consolidado) | p.37 · ação 2194.2150.13.392.40.2.2015 "PROMOCAO DAS ATIVIDADES CULTURAIS E TRADICIONAIS" · Total da Ação de Governo · Dotação Fixada (dotação atual 1.803.275,30, depois dos cortes no ano) |
| e gastou 473 mil | 472.620,24 | 2025-12_PCMGE015_2.pdf | p.37 · mesma ação · 2ª linha (Até o Mês) · Liquidada (empenhada 775.036,98) |
- Para comparação (não dito): a mesma ação previa 6.699.300,00 e liquidou 4.992.584,16 em 2024 (`2024-12_PCMGE015.pdf` p.35); previa 6.240.600,00 e liquidou 1.711.785,85 até set/2026 (`2026-09_PCMGE015.pdf` p.41).

## Receita detalhada (só nas folhas, não dita)
- saida/receita_2024.json e receita_2025.json: PCMGE016 da Prefeitura (2024-12_PCMGE016_2.pdf, 2025-12_PCMGE016.pdf) + PCMGE016 do Instituto de Previdência (2024-12_IPREV_PCMGE016.pdf, 2025-12_IPREV_PCMGE016.pdf); valor = Arrecadada até Mês + Anulada até Mês. Soma 2024 = 266.152.372,25 (com 7.884.095,82 de contribuição intraorçamentária, que a folha de 2024 não mostra) e 2025 = 293.060.373,23. A linha "Ajuste ao Balanço" fecha cada folha no total do Balanço: +978.649,08 (2024) e +21.971,60 (2025). Conta própria.
- saida/receita_2026.json: 2026-09_PCMGE066.pdf (Arrecadado até Mês; FPM, ICMS e IPVA menos a dedução do Fundeb das linhas 9.1.7). Soma = 214.279.392,60.
- Achado que não entrou na fala: ISS de 25.179.186,97 em 2025 (2025-12_PCMGE016.pdf p.1, 1.1.1.4.51.0.0: 25.297.242,78 − 118.055,81).
