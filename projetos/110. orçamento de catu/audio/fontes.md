# Fontes do 110. orçamento de catu (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 21:58 e 23:00, no Google Chrome, aba própria, recebedor 127.0.0.1:8778, pasta CATU, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-CATU/documentos_tcm/` (cada PDF com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF ("CATU"/"CATÚ" no cabeçalho) e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026; Prefeitura, Câmara e SAAE).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 91 (CATU) · Prefeitura UJ 696 ("Prefeitura Municipal de CATU") · Câmara UJ 125 ("Camara Municipal de CATÚ") · SAAE UJ 1036 ("Serviço Autônomo de Água e Esgoto - CATU"). Último mês entregue em 2026: 09/2026 (Prefeitura, Câmara e SAAE; 10/2026 "Pendente").
"Gastou" = despesa LIQUIDADA. O total de cada ano junta Prefeitura + SAAE (autarquia de água e esgoto) + Câmara, que é o que o TCM consolida (PCMGE065 e PCMGE066 "Consolidado", Balanço Orçamentário). Receita = total que o documento traz (Balanço 2024; consolidado PCMGE066 em 2025 e 2026: arrecadada até o mês mais a anulada, que é negativa). A receita já vem sem a parte do Fundeb.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: Prefeitura 217.637.818,51 (`2024-12_PCMGE015.pdf` p.136, Total do Poder, Liquidações até Mês) + SAAE 13.312.136,13 (`2024-12_SAAE_PCMGE015.pdf` p.4, Total da Unidade) + Câmara 7.112.592,37 (`2024-12_CAMARA_PCMGE015.pdf` p.5, Total do Poder) = 238.062.547,01 = consolidado `2024-12_PCMGE065.pdf` p.116 = Balanço `2024_PCAGO015.pdf` p.2.
- 2025: Prefeitura 243.219.839,94 (`2025-12_PCMGE015.pdf` p.156, Total do Poder) + SAAE 15.091.040,26 (`2025-12_SAAE_PCMGE015.pdf` p.1, linha "0702 - SERVIÇO AUTÔNOMO DE ÁGUA E ESGOTO", Liquidações Acumulado) + Câmara 10.419.759,00 (`2025-12_CAMARA_PCMGE015.pdf` p.6, Total do Poder) = 268.730.639,20 = consolidado `2025-12_PCMGE065.pdf` p.121.
- 2026 (até setembro): Prefeitura 181.961.603,36 (`2026-09_PCMGE015.pdf` p.170, Total do Poder) + SAAE 12.516.086,14 (`2026-09_SAAE_PCMGE015.pdf` p.6, Total do Poder) + Câmara 8.928.810,06 (`2026-09_CAMARA_PCMGE015_2.pdf` p.5, Total do Poder) = 203.406.499,56 = consolidado `2026-09_PCMGE065.pdf` p.131.
- A unidade 7.702 (SAAE) aparece também no PCMGE015 da Prefeitura, só com o orçado; a execução dela vem do PCMGE015 do próprio SAAE (não há dupla contagem: Prefeitura + SAAE = linha "Total do Poder" do Executivo no consolidado).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 17 (limpeza pública e resíduos), 26 (estradas vicinais e trânsito) e a ação de contenção de encostas da Defesa Civil (função 06) · Administração 02, 04, 06 (guarda municipal), 22 · Dívidas e encargos 28 (serviço da dívida, PASEP, sentenças judiciais) · Assistência social 08 · Água e esgoto = SAAE inteiro · Câmara 01 (PCMGE015 da Câmara) · Cultura 13 + 23 sem as festas · Agricultura e meio ambiente 18 + 20 · Esporte 27 + a manutenção da Secretaria da Juventude, Esporte e Lazer (lançada na função 04).
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = ações cujo NOME diz festa, festejo ou evento ("REALIZACAO E PROMOCAO DE FESTEJOS, EVENTOS CULTURAIS E TRADICIONAIS", 4.401.13.392.x.2.2026; "REALIZACAO DE EVENTOS CULTURAIS E FESTIVAIS", sem gasto) + os elementos de banda/grupo musical (3.3.90.39.94, 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo", 3.3.90.36.04) e de palco/cenário (3.3.90.39.95 e 3.3.90.39.19 com o nome "Locação, Confecção e Montagem de Cenários, Palcos") de QUALQUER outra ação. A ação "REALIZACAO DE EVENTOS DE VALORIZACAO E CONSCIENTIZACAO" (função 04, sem gasto) não é festa e ficou fora. "Cultura" = o resto da função 13.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Catu arrecadou 242 milhões em 2024 | 241.997.020,57 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.14, "Totais", Total até Mês) |
| 271 milhões em 2025 | 270.988.505,86 | 2025-12_PCMGE066.pdf (Receita Consolidada; = Balanço `2025_PCAGO015.pdf` p.1, SUBTOTAL DAS RECEITAS (III)) | p.15 · "Totais" · Total até Mês (arrecadada até mês 271.005.606,24 + anulada −17.100,38) |
| 217 milhões até setembro de 2026 | 217.036.411,28 | 2026-09_PCMGE066.pdf | p.14 · "Totais" · Total até Mês (arrecadada 217.055.826,89 + anulada −19.415,61) |
| Em 2025, o imposto sobre serviços trouxe 50 milhões e 500 | 50.513.404,85 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.4.51.0.0 Impostos sobre Serviços · Arrecadada até Mês |
| O FPM, 63 milhões | 63.002.191,10 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem a parte do Fundeb, 15.066.278,75 em Deduções até Mês) |
| E os royalties do petróleo, 12 milhões | 11.972.210,10 | 2025-12_PCMGE016.pdf | conta própria: p.2 · 1.7.1.2.00.0.0 Compensações Financeiras (União) 11.878.847,76 + p.5 · 1.7.2.2.00.0.0 Royalties (Estado) 93.362,34 |
| 2024: gastou 238 milhões e 100 | 238.062.547,01 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.116) |
| sobraram 3 milhões e 900 | 3.934.473,56 | conta própria | 241.997.020,57 − 238.062.547,01 (o Balanço mostra superávit de 3.750.339,90 pelo empenhado) |
| 2025: gastou 268 milhões e 700 | 268.730.639,20 | 2025-12_PCMGE065.pdf | p.121 · TOTAL · Liquidada até o Mês (o Balanço `2025_PCAGO015.pdf` traz 268.730.492,14 em SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas, 147,06 a menos; o valor dito é o mesmo) |
| sobraram 2 milhões e 300 | 2.257.866,66 | conta própria | 270.988.505,86 − 268.730.639,20 |
| 2026, até setembro: gastou 203 milhões e 400 | 203.406.499,56 | 2026-09_PCMGE065.pdf | p.131 · TOTAL · Liquidada até o Mês |
| sobraram 13 milhões e 600 | 13.629.911,72 | conta própria | 217.036.411,28 − 203.406.499,56 |
| já comprometeu 262 milhões | 262.094.388,08 | 2026-09_PCMGE065.pdf | p.131 · TOTAL · Empenhada até o Mês |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 66 e 200 · 77 milhões · 57 e 900 | 66.150.798,23 (2024-12_PCMGE015.pdf, função 12) | 77.022.565,54 (2025-12_PCMGE015.pdf, função 12) | 57.889.426,70 (2026-09_PCMGE015.pdf, função 12) |
| Saúde | 53 e 100 · 63 e 600 · 47 e 300 | 53.083.775,85 (2024-12_PCMGE015.pdf, função 10) | 63.623.854,92 (2025-12_PCMGE015.pdf, função 10) | 47.341.042,56 (2026-09_PCMGE015.pdf, função 10) |
| Obras e serviços urbanos | 47 e 500 · 44 e 500 · 35 e 500 | 47.527.508,72 (2024-12_PCMGE015.pdf, funções 15, 17, 26 + encostas) | 44.493.686,37 (2025-12_PCMGE015.pdf, idem; encostas 584.838,10) | 35.504.914,84 (2026-09_PCMGE015.pdf, idem) |
| Administração | 14 e 700 · 18 e 400 · 16 e 200 | 14.747.403,57 (funções 02, 04, 06 e 22, sem a Sec. de Esporte e sem 1.117.610,00 de palco do Gabinete) | 18.352.417,64 | 16.156.017,94 (sem 4.480,00 de palco do Gabinete) |
| Dívidas e encargos | 11 e 400 · 14 e 300 · 8 milhões | 11.449.238,98 (função 28) | 14.278.106,66 (2025-12_PCMGE015.pdf, função 28: serviço da dívida 11.705.967,04 + PASEP 1.784.066,99 + sentenças 788.072,63) | 7.954.129,30 (função 28) |
| Assistência social | 10 e 600 · 8 e 700 · 7 e 300 | 10.642.245,54 (função 08, sem 52.800,00 de banda e cenário) | 8.736.582,64 (função 08) | 7.309.629,56 (função 08) |
| Água e esgoto | 13 e 300 · 15 e 100 · 12 e 500 | 13.312.136,13 (2024-12_SAAE_PCMGE015.pdf p.4) | 15.091.040,26 (2025-12_SAAE_PCMGE015.pdf p.1) | 12.516.086,14 (2026-09_SAAE_PCMGE015.pdf p.6) |
| Câmara de Vereadores | 7 e 100 · 10 e 400 · 8 e 900 | 7.112.592,37 (2024-12_CAMARA_PCMGE015.pdf p.5) | 10.419.759,00 (2025-12_CAMARA_PCMGE015.pdf p.6) | 8.928.810,06 (2026-09_CAMARA_PCMGE015_2.pdf p.5) |
| Festas e eventos | 6 e 300 · 8 e 300 · 3 e 300 | Festas e eventos 2024: R$ 6.328.163,75 (veja abaixo) | Festas e eventos 2025: R$ 8.337.785,86 | Festas e eventos 2026: R$ 3.254.738,78 |
| Cultura | 1 milhão · 1 e 700 · 1 e 200 | 997.424,06 (função 13 sem a ação de festejos) | 1.711.016,36 (função 13 sem festejos e sem 60.759,86 de banda) | 1.247.808,70 (função 13 sem festejos) |
| Agricultura e meio ambiente | 3 e 600 · 4 e 100 · 3 e 600 | 3.608.842,54 (funções 18 e 20) | 4.090.478,18 | 3.580.553,70 |
| Esporte | 3 e 100 · 2 e 600 · 1 e 700 | 3.102.417,27 (função 27 + Sec. da Juventude, Esporte e Lazer na função 04) | 2.573.345,77 (idem; Sec. 1.802.131,52 + função 27, sem 8.330,00 de palco) | 1.723.341,28 |

### Festas e eventos (regra 99: de onde veio cada parte)
- Festas e eventos 2024: R$ 6.328.163,75 = ação 4.401.13.392.6.2.2026 "REALIZACAO E PROMOCAO DE FESTEJOS, EVENTOS CULTURAIS E TRADICIONAIS" 5.157.333,75 (`2024-12_PCMGE015.pdf` p.33, Total do Projeto/Atividade, Liquidações até Mês; dentro: bandas 3.3.90.39.18 3.088.300,00 e 3.3.90.36.04 292.500,00, cenário 3.3.90.39.19 650.981,00) + palco e cenário do Gabinete do Prefeito 1.117.610,00 (ação 2.201.4.122.3.2.2005, 3.3.90.39.19 "Locação, Confecção e Montagem de Cenários, Palcos", p.5) + banda e cenário em ações da assistência social 52.800,00 (3.301 e 3.302/3.303, elementos 39.18, 39.19 e 36.04) + cenário no Fundo de Apoio ao Esporte 420,00.
- Festas e eventos 2025: R$ 8.337.785,86 = ação 4.401.13.392.6.2.2026 8.268.696,00 (`2025-12_PCMGE015.pdf` p.45; dentro: festividades e homenagens 3.3.90.39.23 3.849.800,00; bandas 3.3.90.39.94 1.625.000,00, p.44; palco 3.3.90.39.95 1.458.580,00 + 105.000,00 = 1.563.580,00, p.44) + bandas 3.3.90.39.94 na ação "EXECUCAO DAS ACOES DE FOMENTO A CULTURA POR MEIO DA POLITICA..." 60.759,86 + palco 3.3.90.39.95 no Fundo de Apoio ao Esporte 8.330,00.
- Festas e eventos 2026 (até setembro): R$ 3.254.738,78 = ação 4.401.13.392.9.2.2026 3.250.258,78 (`2026-09_PCMGE015.pdf`) + palco 3.3.90.39.95 do Gabinete 4.480,00.

## Câmara, festas e ajuda às famílias (achados)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a Câmara recebeu 8 milhões e 600 da prefeitura | 8.622.938,52 | 2024-12_CAMARA_PCMGE018.pdf (Razão) | p.12 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| devolveu 1 milhão e 450 | 1.450.000,00 | 2024-12_CAMARA_PCMGE018.pdf | p.11 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (2024-12_CAMARA_PCMGE007.pdf: devoluções de 500.000,00 e 150.000,00 em dezembro) |
| e gastou 7 milhões e 100 | 7.112.592,37 | 2024-12_CAMARA_PCMGE015.pdf | p.5 · Total do Poder · Liquidações até Mês |
| Em 2025, recebeu 10 milhões e 700 | 10.692.948,90 | 2025-12_CAMARA_PCMGE018_2.pdf | p.10 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| devolveu só 32 mil | 32.042,96 | 2025-12_CAMARA_PCMGE018_2.pdf | p.10 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| e gastou 10 e 400 | 10.419.759,00 | 2025-12_CAMARA_PCMGE015.pdf | p.6 · Total do Poder · Liquidações até Mês |
| (só na tela) 2026 até setembro: recebeu 9 milhões | 9.032.150,70 | 2026-09_CAMARA_PCMGE018_2.pdf | p.9 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (sem lançamento de devolução até setembro) |
| Consultoria e assessoria: 812 mil em 2025 | 811.900,00 | 2025-12_CAMARA_PCMGE015.pdf | conta própria: p.2 · 3.3.90.35.01 ASSESSORIA E CONSULTORIA TÉCNICA OU JURÍDICA 515.900,00 + 3.3.90.35.99 OUTROS SERVIÇOS DE CONSULTORIA 296.000,00 (Liquidações até Mês) |
| nenhum lançamento com esse nome em 2024 | 0,00 | 2024-12_CAMARA_PCMGE015.pdf | conferidas todas as 8 ações: nenhum elemento 3.3.90.35 (consultoria) com valor; os serviços de terceiros de 2024 estão em 3.3.90.39.99 (320.961,14), sem o nome consultoria |
| Diárias: de 57 mil | 57.125,00 | 2024-12_CAMARA_PCMGE015.pdf | conta própria: 3.3.90.14.00 Diárias - Civil 2.975,00 + 54.150,00 (duas ações) |
| para 274 mil | 273.510,00 | 2025-12_CAMARA_PCMGE015.pdf | p.5 · 3.3.90.14.14 DIÁRIAS NO PAÍS · Liquidações até Mês |
| Em 2024, o orçamento previa 2 milhões e 300 para os festejos | 2.280.000,00 | 2024-12_PCMGE015.pdf | p.33 · ação 4.401.13.392.6.2.2026 · Total do Projeto/Atividade · Fixada (dotação inicial) |
| Gastou 5 milhões e 200 | 5.157.333,75 | 2024-12_PCMGE015.pdf | p.33 · mesma linha · Liquidações até Mês |
| o gabinete do prefeito pagou mais 1 milhão e 100 em palco e cenário | 1.117.610,00 | 2024-12_PCMGE015.pdf | p.5 · ação 2.201.4.122.3.2.2005 MANUTENCAO DAS ACOES DO GABINETE DO PREFEITO · 3.3.90.39.19 Locação, Confecção e Montagem de Cenários, Palcos · Liquidações até Mês |
| Em 2025, previa 4 milhões | 4.043.000,00 | 2025-12_PCMGE015.pdf | p.45 · ação 4.401.13.392.6.2.2026 · Total do Projeto/Atividade · Fixada |
| Gastou 8 milhões e 300 | 8.268.696,00 | 2025-12_PCMGE015.pdf | p.45 · mesma linha · Liquidações até Mês (Festas e eventos 2025 inteiro: 8.337.785,86, também "8 e 300") |
| com 1 milhão e 600 em bandas | 1.625.000,00 | 2025-12_PCMGE015.pdf | p.44 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL · Liquidações até Mês |
| e 1 milhão e 600 em palco | 1.563.580,00 | 2025-12_PCMGE015.pdf | conta própria: p.44 · 3.3.90.39.95 LOCAÇÃO, CONFECÇÃO E MONTAGEM DE CENÁRIOS, PALCOS 1.458.580,00 (fonte 1500) + 105.000,00 (fonte 1501) |
| A ajuda de emergência para as famílias ficou em 345 mil em 2025 | 344.690,78 | 2025-12_PCMGE015.pdf | p.25 · ação 3.302.8.244.12.2.2020 GESTAO DE BENEFICIOS EVENTUAIS · Total do Projeto/Atividade · Liquidações até Mês |
| (só na legenda) benefícios eventuais 2024 e 2026 | 477.025,20 · 194.833,05 | 2024-12_PCMGE015.pdf · 2026-09_PCMGE015.pdf | ação 3.302.8.244.12.2.2020 (2024 "MANUTENCAO DOS BENEFICIOS EVENTUAIS") e 3.302.8.244.1.2.2020 (2026) · Liquidações até Mês |

## Receita por ano (folha da receita, scripts/receita.py → saida/receita_<ano>.json)
- Linhas do PCMGE016 da Prefeitura (Arrecadada até Mês + Anulada até Mês) e a linha "Água e esgoto (SAAE)" = consolidado PCMGE066 − PCMGE016 da Prefeitura (2024: 13.687.526,04; 2025: 15.104.675,23; 2026: 12.169.449,16). O resto vai em "Outras receitas".

## Sem nome de gestor, sem percentual, sem nome de empresa contratada. Tom só informativo.
