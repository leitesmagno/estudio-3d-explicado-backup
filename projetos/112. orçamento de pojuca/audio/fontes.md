# Fontes do 112. orçamento de pojuca (BA)

Consulta: 10/11/2026 e 11/11/2026 (downloads no e-TCM entre ~23:40 e ~00:40, no Google Chrome, aba própria fechada no fim, recebedor 127.0.0.1:8778, pasta POJUCA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-POJUCA/documentos_tcm/` (cada PDF com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF ("POJUCA" no cabeçalho) e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026; Prefeitura e Câmara).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 309 (POJUCA) · Prefeitura UJ 913 ("Prefeitura Municipal de POJUCA") · Câmara UJ 340 ("Camara Municipal de POJUCA"). Sem autarquia com conta própria (o PCMGE015 da Prefeitura traz só órgãos e fundos). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/pojuca.json.
"Gastou" = despesa LIQUIDADA. O total de cada ano junta Prefeitura + Câmara, que é o que o TCM consolida (PCMGE065 "Consolidado" e Balanço Orçamentário). Receita = total que o documento traz (Balanço 2024 e 2025; PCMGE016 da Prefeitura em set/2026: arrecadada até o mês mais a anulada, que é negativa). A receita já vem sem a parte do Fundeb (o SIGA desconta na coluna "Arrecadada": a dedução do ICMS de 2025 é 25% exatos da arrecadada).
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json e os .json dos leitores; nessa conferência a frase do combustível foi corrigida: em 2024 o elemento 3.3.90.30.01 da Câmara é "Suprimentos de Informática", não combustível); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: Prefeitura 269.316.437,46 (`2024-12_PCMGE015.pdf` p.104, Total do Poder, Liquidações Até Mês) + Câmara 10.698.210,61 (`2024-12_CAMARA_PCMGE015.pdf` p.4, Total do Poder) = 280.014.648,07. O consolidado `2024-12_PCMGE065.pdf` p.38 (TOTAL GERAL DA DESPESA ORÇAMENTÁRIA, Liquidado no Ano) e o Balanço `2024_PCAGO015.pdf` p.2 (SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas) trazem 279.985.259,55. A diferença (29.388,52) está toda numa ação: "PROMOÇÃO DE ATIVIDADES E EVENTOS CULTURAIS" (2.3090.13.392.6.2.2040), liquidado 9.441.739,22 no PCMGE015 (p.23) e 9.412.350,70 no consolidado (p.9, TOTAL DA AÇÃO). Vale o Balanço: a ação entra com 9.412.350,70 (o empenhado é igual nos três documentos: 280.961.790,68).
- 2025: Prefeitura 307.612.951,49 (`2025-12_PCMGE015.pdf` p.132, Total do Poder) + Câmara 12.906.969,98 (`2025-12_CAMARA_PCMGE015.pdf` p.6, Total do Poder) = 320.519.921,47 = consolidado `2025-12_PCMGE065.pdf` p.89 = Balanço `2025_PCAGO015.pdf` p.2 (SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas).
- 2026 (até setembro): Prefeitura 224.389.092,80 (`2026-09_PCMGE015.pdf` p.134, Total do Poder) + Câmara 11.116.547,50 (`2026-09_CAMARA_PCMGE015.pdf` p.5, Total do Poder) = 235.505.640,30 = consolidado `2026-09_PCMGE065.pdf` p.94.
- A unidade 1.1010 (Câmara) aparece também no PCMGE015 da Prefeitura, sem execução; a execução vem do PCMGE015 da própria Câmara (sem dupla contagem).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 17 (limpeza urbana e pavimentação), 26 · Administração 04 (inclui a Guarda Municipal, a Assessoria Jurídica e a Sec. de Desenvolvimento Econômico), 06 (Defesa Civil), 11 (Pojuca Invest e cursos) · Dívidas e encargos 28 ("Encargos gerais do município": parcelas e juros de contratos de dívida, PASEP e contribuições, sentenças judiciais) · Assistência social 08 · Câmara 01 (PCMGE015 da Câmara) · Cultura 13 + 23 sem as festas · Agricultura e meio ambiente 18 + 20 · Esporte 27 sem as ações de eventos.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = ações cujo NOME diz evento ("PROMOÇÃO DE ATIVIDADES E EVENTOS CULTURAIS (E TRADICIONAIS)", 2.3090.13.392.6.2.2040; "APOIO E INCENT. AOS EVENTOS LIGADOS À CULTURA AO ESPORTE", 2.3090.27.812.6.2.2071; "PROMOÇÃO DE EVENTOS DE PARCERIAS GOV E NÃO GOV.", sem gasto) + os elementos de banda/grupo musical (3.3.90.39.94; em 2024 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical") e de palco/cenário (3.3.90.39.95; em 2024 3.3.90.39.19 "Locação, Confecção e Montagem de Cenários, Palcos") de QUALQUER outra ação. De 2025 em diante o 3.3.90.39.19 é "Manutenção e conservação de veículos" e NÃO entra. "Cultura" = o resto da função 13 (manutenção da Secretaria de Cultura, Esporte, Lazer e Juventude, Aldir Blanc, Paulo Gustavo, juventude) + função 23 (turismo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Pojuca arrecadou 254 milhões e 900 em 2024 | 254.906.963,64 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.12, TOTAL GERAL DA RECEITA ORÇAMENTÁRIA) |
| 329 milhões e 800 em 2025 | 329.766.640,82 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf, TOTAL: arrecadada até mês 333.501.845,73 + anulada até mês −3.735.204,91) |
| 227 milhões e 900 até setembro de 2026 | 227.924.264,24 | 2026-09_PCMGE016.pdf | p.8 · TOTAL · Arrecadada até Mês 229.665.867,74 + Anulada até Mês −1.741.603,50 (conta própria). O razão consolidado 2026-09_PCMGE064.pdf (6.2.1.2 Receita Realizada 248.722.286,44 menos as deduções do Fundeb 20.799.519,42) dá 227.922.767,02. O consolidado 2026-09_PCMGE066.pdf traz 227.233.087,77: a única diferença é o convênio estadual 1.7.2.4.01 (1.870.000,00 no PCMGE016 p.5; 1.170.000,00 no PCMGE066 p.11). Anotado em _pendencias-tcm.md. |
| Em 2025, os royalties do petróleo trouxeram 60 milhões e 600 | 60.575.809,30 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.2.52.0.0 Cota-parte da Compensação Financeira pela Produção de Petróleo · Arrecadada até Mês (com o 1.7.1.2.51 e os royalties do Estado 1.7.2.2, a folha mostra 60.868.752,52) |
| O ICMS, 70 milhões | 70.025.773,33 | 2025-12_PCMGE016.pdf | p.4 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 17.506.443,00 = 25% exatos) |
| E o imposto sobre serviços, 43 milhões e 400 | 43.446.214,02 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.4.51.0.0 Impostos sobre Serviços · Arrecadada até Mês 43.477.952,47 + Anulada até Mês −31.738,45 (conta própria) |
| 2024: gastou 280 milhões | 279.985.259,55 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.38) |
| Faltaram 25 milhões e 100 | 25.078.295,91 | conta própria | 279.985.259,55 − 254.906.963,64 |
| pagos com sobras de anos anteriores | 27.616.085,96 | 2024_PCAGO015.pdf | p.1 · Saldos de Exercícios Anteriores (Utilizados Para Créditos Adicionais) · Superávit Financeiro · Previsão Atualizada |
| 2025: contando um empréstimo de 12 milhões e 500 | 12.500.000,00 | 2025_PCAGO015.pdf | p.1 · Operações de Crédito · Receitas Realizadas (= 2025-12_PCMGE016.pdf 2.1.1.2.01.0.0) |
| 2025: gastou 320 milhões e 500 | 320.519.921,47 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.89) |
| Sobraram 9 milhões e 200 | 9.246.719,35 | conta própria | 329.766.640,82 − 320.519.921,47 |
| 2026, até setembro: gastou 235 milhões e 500 | 235.505.640,30 | 2026-09_PCMGE065.pdf | p.94 · TOTAL GERAL · Liquidada até o Mês |
| Faltaram 7 milhões e 600 | 7.581.376,06 | conta própria | 235.505.640,30 − 227.924.264,24 |
| já comprometeu 270 milhões e 300 | 270.286.400,29 | 2026-09_PCMGE065.pdf | p.94 · TOTAL GERAL · Empenhada até o Mês (= 256.310.210,81 da Prefeitura + 13.976.189,48 da Câmara) |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidações Até Mês" do PCMGE015 de cada ano)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 74 e 200 · 82 e 400 · 62 e 100 | 74.207.425,13 | 82.443.891,10 | 62.053.399,97 |
| Saúde | 62 e 300 · 65 e 600 · 48 e 400 | 62.344.008,37 | 65.600.440,72 | 48.422.333,91 |
| Obras e serviços urbanos | 47 e 500 · 54 e 800 · 35 e 800 | 47.547.345,97 | 54.779.500,65 | 35.827.572,33 |
| Administração | 36 e 800 · 47 e 500 · 34 e 100 | 36.830.317,88 | 47.490.824,72 | 34.139.329,43 |
| Dívidas e encargos | 12 e 800 · 20 e 900 · 16 e 100 | 12.821.008,11 | 20.867.427,40 | 16.087.066,57 |
| Assistência social | 10 e 900 · 10 e 100 · 8 milhões | 10.917.287,45 | 10.092.701,52 | 7.960.072,14 |
| Câmara de Vereadores | 10 e 700 · 12 e 900 · 11 e 100 | 10.698.210,61 | 12.906.969,98 | 11.116.547,50 |
| Festas e eventos | 9 e 800 · 10 milhões · 7 e 400 | 9.766.211,12 | 10.026.865,17 | 7.442.202,91 |
| Cultura | 4 e 500 · 5 e 100 · 3 e 900 | 4.483.183,54 | 5.147.940,43 | 3.884.029,65 |
| Agricultura e meio ambiente | 9 e 400 · 10 milhões · 7 e 600 | 9.392.147,58 | 10.025.475,69 | 7.562.053,53 |
| Esporte | 978 mil · 1 e 100 · 1 milhão | 978.113,79 | 1.137.884,09 | 1.011.032,36 |
| **Soma** | | 279.985.259,55 | 320.519.921,47 | 235.505.640,30 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 9.766.211,12 (ação 2040 com o valor do Balanço 9.412.350,70 + ação 2071 132.186,22 + bandas e palco em outras ações 221.674,20)
- Festas e eventos 2025: R$ 10.026.865,17 (ação 2040 9.933.387,65 + ação 2071 74.077,52 + palco em outras ações 19.400,00)
- Festas e eventos 2026: R$ 7.442.202,91 (ação 2040 6.990.455,63 + ação 2071 330.227,28 + bandas e palco em outras ações 121.520,00)
- Cultura 2024: R$ 4.483.183,54 · Cultura 2025: R$ 5.147.940,43 · Cultura 2026: R$ 3.884.029,65

## A Câmara
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 10 milhões e 900 da prefeitura | 10.908.637,37 | 2024-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês (= 2024-12_PCMGE018.pdf da Prefeitura, 3.5.1.1.2.02.00 REPASSE CONCEDIDO) |
| devolveu 211 mil | 210.567,84 | 2024-12_CAMARA_PCMGE018.pdf | p.8 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado Até o Mês (= 2024-12_PCMGE064.pdf p.15) |
| e gastou 10 milhões e 700 | 10.698.210,61 | 2024-12_CAMARA_PCMGE015.pdf | p.4 · Total do Poder · Liquidações Até Mês (= consolidado 2024-12_PCMGE065.pdf, TOTAL DO PODER LEGISLATIVO) |
| Em 2025, recebeu 12 milhões e 900 | 12.907.691,08 | 2025-12_PCMGE018.pdf (razão da Prefeitura) | p.14 · 3.5.1.1.2.02.00 REPASSE CONCEDIDO · Debitado Até o Mês. O PCMGE018 da Câmara de 12/2025 não foi enviado (2025-12_CAMARA_PCMGE018.pdf é uma declaração de que vai com a prestação anual). |
| devolveu 721 reais | 721,10 | 2025-12_PCMGE018.pdf (razão da Prefeitura) | p.17 · 4.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Creditado Até o Mês |
| gastou quase tudo | 12.906.969,98 | 2025-12_CAMARA_PCMGE015.pdf | p.6 · Total do Poder · Liquidações Até Mês (recebeu − devolveu = 12.906.969,98, conta própria) |
| Diárias: 444 mil em 2024 | 443.565,43 | 2024-12_CAMARA_PCMGE015.pdf | conta própria: 3.3.90.14.00 Diárias - Civil, p.2 (ação 4001) 117.849,00 + p.3 (ação 4002) 325.716,43 |
| 1 milhão e 200 em 2025 | 1.194.205,50 | 2025-12_CAMARA_PCMGE015.pdf | conta própria: p.2 (ação 4001) 3.3.90.14.00 6.355,55 + 3.3.90.14.14 Diárias no País 745.077,05 + p.5 (ação 4002) 3.3.90.14.14 442.772,90 |
| e mais 1 milhão e 200 só até setembro de 2026 | 1.188.457,00 | 2026-09_CAMARA_PCMGE015.pdf | conta própria: p.2 (ação 4001) 3.3.90.14.14 734.457,00 + p.4 (ação 4002) 454.000,00 |
| Combustível: nenhum lançamento com esse nome em 2024 | 0,00 | 2024-12_CAMARA_PCMGE015.pdf | nenhum elemento com "combustível" no nome em 2024 (o 3.3.90.30.01 de 2024 é "Suprimentos de Informática", 65.846,00, p.2). Em 2024 a Câmara pagou "Locação de Veículos" (3.3.90.39.02), 619.320,00. |
| e 558 mil em 2025 | 557.591,60 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS · Liquidações Até Mês (2026 até setembro: 620.672,95, p.2, na folha) |
| 2026 (folha): recebeu 11 milhões e 200 até setembro | 11.203.385,36 | 2026-09_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês |

## As festas e a ajuda às famílias (PCMGE015 da Prefeitura, ação 2.3090.13.392.6.2.2040 "PROMOÇÃO DE ATIVIDADES E EVENTOS CULTURAIS")
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a ação de eventos culturais previa 5 milhões e 600 | 5.551.000,00 | 2024-12_PCMGE015.pdf | p.23 · Total do Projeto/Atividade · Fixada (dotação inicial) |
| Gastou 9 milhões e 400 | 9.412.350,70 | 2024-12_PCMGE065.pdf (consolidado; = Balanço) | p.9 · TOTAL DA AÇÃO · Liquidado no Ano (o PCMGE015 p.23 traz 9.441.739,22) |
| Em 2025, previa 5 milhões e 800 | 5.770.000,00 | 2025-12_PCMGE015.pdf | p.25 · Total do Projeto/Atividade · Fixada |
| Gastou 9 milhões e 900 | 9.933.387,65 | 2025-12_PCMGE015.pdf | p.25 · Total do Projeto/Atividade · Liquidações Até Mês |
| Só em bandas, 5 milhões e 400 em 2024 | 5.389.600,00 | 2024-12_PCMGE015.pdf | conta própria: 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical" da ação 2040, p.22 (fonte 1500) 5.106.300,00 + p.22 (fonte 1701) 200.000,00 + p.23 83.300,00 |
| e 4 milhões e 900 em 2025 | 4.889.000,00 | 2025-12_PCMGE015.pdf | conta própria: 3.3.90.39.94 "Serviços de banda ou grupo musical" da ação 2040, p.24: fonte 1500 1.197.000,00 + fonte 1701 300.000,00 + fonte 1720 3.392.000,00 |
| A ajuda de emergência para as famílias ficou em 2 milhões e 400 em 2025 | 2.443.218,47 | 2025-12_PCMGE015.pdf | p.126 · ação 5.3121.8.244.9.2.2090 "BENEFÍCIOS EVENTUAIS" · Total do Projeto/Atividade · Liquidações Até Mês |
| (folha) palco e cenário da ação 2040 em 2025 | 2.049.243,78 | 2025-12_PCMGE015.pdf | p.24 · 3.3.90.39.95 (fontes 1500, 1701 e 1720) |

## Observações
- Nada de nome de gestor, empresa ou pessoa. Sem porcentagens. Tom informativo: "Gastar não é crime" é o fechamento aprovado.
- Benefícios eventuais = "ajuda de emergência" (auxílio por morte, nascimento, calamidade e vulnerabilidade temporária, Lei 8.742/1993, art. 22).
