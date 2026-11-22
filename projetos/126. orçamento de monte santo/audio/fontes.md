# Fontes do 126. orçamento de monte santo (BA)

Consulta: 11/11/2026 (downloads no e-TCM no navegador do app, com a trava _navegador-app.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta MONTE-SANTO, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-MONTE-SANTO/documentos_tcm/` (49 PDFs, cada um com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho de todos os PDFs usados ("MONTE SANTO").
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 260 (MONTE SANTO) · Prefeitura UJ 864 · Câmara UJ 293. Nenhuma autarquia com prestação própria. Último mês entregue em 2026: 09/2026 (Prefeitura enviou em 10/11/2026; Câmara em 03/11/2026). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/monte-santo.json.
"Gastou" = despesa LIQUIDADA. Total de 2024 e 2025 = Balanço Orçamentário (PCAGO015, Prefeitura, fundos e Câmara). 2026 = consolidado PCMGE065 de set/2026. Receita = total do Balanço (2024 e 2025) e PCMGE016 de set/2026 da Prefeitura (a Câmara não arrecada): arrecadada até o mês, já sem a parte do Fundeb, mais a anulada, que é negativa (= PCMGE066 consolidado: 275.508.758,52 − 1.792.228,76).
ATENÇÃO 2024: na prestação de dez/2024 da Prefeitura, os PCMGE015, PCMGE016, PCMGE018, PCMGE065 e PCMGE066 são "DECLARAÇÃO DE NÃO EXISTÊNCIA" (assinada em 10/02/2025). A despesa de 2024 por ação vem do Anexo VI do Balanço (`2024_PCAGO004.pdf`, sistema próprio SIAFIC), que soma 312.745.972,05 = Balanço. No Balanço 2024 o empenhado é igual ao liquidado (312.745.972,05), então o valor de cada ação no Anexo VI é o liquidado.
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: Anexo VI do Balanço (`2024_PCAGO004.pdf`, leitor scripts/anexo6.py; cada unidade confere com a linha "Total" da unidade). Sem a Câmara (unidade 010101), que entra pelo PCMGE015 da Câmara 5.849.844,22 (`2024-12_CAMARA_PCMGE015.pdf` p.4 · Total do Poder · Liquidações até Mês; igual ao Anexo VI). Soma 312.745.972,05 = `2024_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas.
- 2025: Prefeitura 319.792.227,76 (`2025-12_PCMGE015.pdf` p.98 · Total do Poder · Liquidações até Mês) + Câmara 5.435.838,67 (`2025-12_CAMARA_PCMGE015.pdf` p.4) + 1.248.444,12 = 326.476.510,55 = `2025_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas. Os 1.248.444,12: o Anexo VI do Balanço 2025 (`2025_PCAGO004.pdf`) traz o ensino fundamental com 976.116,21 e a pré-escola com 272.327,91 a mais do que o PCMGE015; a diferença entra na Educação (conta própria).
- 2026 (até setembro): Prefeitura 268.952.702,00 (`2026-09_PCMGE015.pdf` p.89) + Câmara 3.639.765,90 (`2026-09_CAMARA_PCMGE015.pdf` p.4) = 272.592.467,90 = `2026-09_PCMGE065.pdf` p.76 · TOTAL · Liquidada até o Mês.
- Setor pela FUNÇÃO da ação: Educação = função 12 · Saúde = 10 · Obras e serviços urbanos = 15 (infraestrutura, limpeza, iluminação, pavimentação, estradas vicinais), 17 (saneamento) e 26 (Secretaria de Transporte) · Administração = 04 e 06 (gabinete, procuradoria, administração, finanças, controladoria, articulação política, segurança) · Dívidas e encargos = 28 (encargos da dívida, sentenças judiciais e PASEP) · Assistência social = 08 · Câmara = PCMGE015 da Câmara · Agricultura e meio ambiente = 18, 19 e 20 · Esporte = 23 e 27 · Cultura = 13 sem a ação de festejos.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "MANUTENÇÃO DOS FESTEJOS E ATIVIDADES CULTURAIS" (2.011) inteira, porque o nome diz festejos (2024: `2024_PCAGO004.pdf` p.18; 2025: `2025-12_PCMGE015.pdf` p.21-22, ação 307.3070.13.392.4.2.2011; 2026: `2026-09_PCMGE015.pdf` p.87-88, ação 5.703.13.392.4.2.2011). Não há elemento de banda ou palco em outras ações. "Cultura" = a ação "MANUTENÇÃO DAS AÇÕES DA CULTURA" (2.013).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Monte Santo arrecadou 318 milhões e 400 em 2024 | 318.402.610,55 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · TOTAL (VII) · Receitas Realizadas |
| 337 milhões e 100 em 2025 | 337.096.339,03 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · TOTAL (VII) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.7 · TOTAL: 337.324.725,14 − 228.386,11, conta própria) |
| 273 milhões e 700 até setembro de 2026 | 273.716.529,76 | 2026-09_PCMGE016.pdf | p.7 · TOTAL · Arrecadada até Mês 275.508.758,52 + Anulada até Mês −1.792.228,76 (conta própria) |
| Em 2025, a complementação da União ao Fundeb mandou 86 milhões e 600 | 86.634.884,15 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.5.00.0.0 Transferências da Complementação da União ao Fundeb · Arrecadada até Mês |
| O Fundeb trouxe 80 milhões e 700 | 80.689.112,32 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.0.00.0.0 Transferências de Outras Instituições Públicas (Fundeb) · Arrecadada até Mês 80.724.999,27 + Anulada até Mês −35.886,95 (conta própria) |
| O FPM, 63 milhões | 62.999.675,19 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem o Fundeb) |
| E o SUS, 44 milhões e 800 | 44.798.632,87 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.3.00.0.0 Transferências da União para o SUS 43.780.495,02 + p.5 · 1.7.2.3.00.0.0 Transferências do Estado para o SUS 1.018.137,85 (conta própria). Não conferido no FNS |
| 2024: gastou 312 milhões e 700 | 312.745.972,05 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 5 milhões e 700 | 5.656.638,50 | conta própria | 318.402.610,55 − 312.745.972,05 |
| 2025: gastou 326 milhões e 500 | 326.476.510,55 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhado 326.501.510,55) |
| Sobraram 10 milhões e 600 | 10.619.828,48 | conta própria | 337.096.339,03 − 326.476.510,55 |
| 2026, até setembro: gastou 272 milhões e 600 | 272.592.467,90 | 2026-09_PCMGE065.pdf | p.76 · TOTAL · Liquidada até o Mês |
| Sobrou 1 milhão e 100 | 1.124.061,86 | conta própria | 273.716.529,76 − 272.592.467,90 |
| E já comprometeu 310 milhões e 700 | 310.667.114,23 | 2026-09_PCMGE065.pdf | p.76 · TOTAL · Empenhada até o Mês |

Receita detalhada (não falada, para conferência): saida/receita_2025.json e receita_2026.json. 2024: só o Balanço (o PCMGE016 de dez/2024 é declaração de não existência); detalhe por natureza no Anexo X (`2024_PCAGO008.pdf`).

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 180 e 600 · 193 e 600 · 156 e 800 | 180.625.484,34 | 193.633.699,66 | 156.782.422,13 |
| Saúde | 59 e 900 · 58 e 800 · 53 e 300 | 59.868.732,64 | 58.823.135,26 | 53.315.710,28 |
| Obras e serviços urbanos | 24 e 600 · 23 e 600 · 24 e 500 | 24.648.096,80 | 23.602.473,07 | 24.468.136,31 |
| Administração | 16 e 200 · 16 e 100 · 13 e 700 | 16.173.241,33 | 16.103.819,62 | 13.732.574,73 |
| Dívidas e encargos | 10 e 700 · 12 e 500 · 9 milhões e 100 | 10.728.870,77 | 12.514.654,54 | 9.099.595,90 |
| Assistência social | 5 milhões e 200 · 6 milhões e 600 · 5 milhões e 400 | 5.226.806,72 | 6.581.944,58 | 5.370.017,45 |
| Câmara de Vereadores | 5 milhões e 800 · 5 milhões e 400 · 3 milhões e 600 | 5.849.844,22 | 5.435.838,67 | 3.639.765,90 |
| Festas e eventos | 6 milhões e 300 · 7 milhões · 3 milhões e 800 | 6.278.002,06 | 7.038.496,33 | 3.819.180,75 |
| Cultura | 388 mil · 62 mil · 33 mil | 388.467,90 | 62.307,92 | 32.859,81 |
| Agricultura e meio ambiente | 2 milhões e 600 · 2 milhões e 600 · 2 milhões | 2.576.413,67 | 2.626.225,50 | 2.042.911,13 |
| Esporte | 382 mil · 54 mil · 289 mil | 382.011,60 | 53.915,40 | 289.293,51 |

- Festas e eventos 2024: R$ 6.278.002,06
- Festas e eventos 2025: R$ 7.038.496,33
- Festas e eventos 2026: R$ 3.819.180,75
Fontes de cada ano: 2024 = `2024_PCAGO004.pdf` (Anexo VI, coluna Total) + `2024-12_CAMARA_PCMGE015.pdf`; 2025 = `2025-12_PCMGE015.pdf` (Liquidações até Mês) + Câmara + ajuste da Educação; 2026 = `2026-09_PCMGE015.pdf` + Câmara.

## A Câmara (repasse da prefeitura, gasto e devolução)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 6 milhões e 100 da prefeitura | 6.068.435,86 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.5 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e gastou 5 milhões e 800 | 5.849.844,22 | 2024-12_CAMARA_PCMGE015.pdf | p.4 · Total do Poder · Liquidações até Mês |
| (folha) devolveu 218 mil | 218.591,64 | 2024-12_CAMARA_PCMGE018.pdf | p.5 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (6.068.435,86 − 218.591,64 = 5.849.844,22, conta própria) |
| Em 2025, recebeu 7 milhões e 500 | 7.466.622,26 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Debitado/Creditado até o Mês (encerramento do ano) |
| gastou 5 milhões e 400 | 5.435.838,67 | 2025-12_CAMARA_PCMGE015.pdf | p.4 · Total do Poder · Liquidações até Mês |
| e devolveu 2 milhões | 2.030.783,59 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.2.2.02.07 DEVOLUÇÃO DE REPASSE CONCEDIDO (o mesmo valor está no razão da Prefeitura, 2025-12_PCMGE018.pdf, conta 4.5.1.2.2.02.07). 7.466.622,26 − 2.030.783,59 = 5.435.838,67 (conta própria) |
| Até setembro de 2026, já recebeu 5 milhões e 900 | 5.904.393,04 | 2026-09_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e gastou 3 milhões e 600 | 3.639.765,90 | 2026-09_CAMARA_PCMGE015.pdf | p.4 · Total do Poder · Liquidações até Mês (empenhado 5.271.715,79) |

## As festas e os benefícios eventuais
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| A ação de festejos e atividades culturais gastou 6 milhões e 300 em 2024 | 6.278.002,06 | 2024_PCAGO004.pdf | p.18 · 13.392.0004.2.011 MANUTENÇÃO DOS FESTEJOS E ATIVIDADES CULTURAIS · Total |
| e 7 milhões em 2025 | 7.038.496,33 | 2025-12_PCMGE015.pdf | p.21-22 · ação 307.3070.13.392.4.2.2011 · Total do Projeto/Atividade · Liquidações até Mês (previsto 7.063.000,00; empenhado 7.063.496,33) |
| Só com bandas, 3 milhões e 700 em 2025 | 3.728.060,00 | 2025-12_PCMGE015.pdf | p.21 · ação 2011 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL · Liquidações até Mês |
| Até setembro de 2026, já foram 3 milhões e 800 | 3.819.180,75 | 2026-09_PCMGE015.pdf | p.87-88 · ação 5.703.13.392.4.2.2011 · Total do Projeto/Atividade · Liquidações até Mês (bandas 1.309.300,00, p.87) |
| Os benefícios eventuais previam 1 milhão em 2025 | 1.009.000,00 | 2025-12_PCMGE015.pdf | p.78 · ação 310.3105.8.244.6.2.2024 GESTÃO DE BENEFÍCIOS EVENTUAIS · Total do Projeto/Atividade · Fixada |
| e gastaram 670 mil | 669.950,75 | 2025-12_PCMGE015.pdf | p.78 · mesma ação · Liquidações até Mês |
| Em 2026, previam 1 milhão e 300 | 1.331.000,00 | 2026-09_PCMGE015.pdf | p.60 · ação 4.1002.8.244.6.2.2024 · Fixada (dotação atual 457.338,29 depois dos remanejamentos) |
| Até setembro, gastaram 222 mil | 221.995,78 | 2026-09_PCMGE015.pdf | p.60 · mesma ação · Liquidações até Mês |
| (folha) Benefícios eventuais 2024 | 581.031,74 | 2024_PCAGO004.pdf | p.16 · 08.244.0006.2.024 MANUTENÇÃO DAS AÇÕES DOS BENEFÍCIOS EVENTUAIS · Total |
| Assistência social inteira em 2025: 6 milhões e 600 | 6.581.944,58 | saida/setores.json (conta própria: função 08 do 2025-12_PCMGE015.pdf) | soma das ações da função 08 |
| Festas 2025: 7 milhões | 7.038.496,33 | ver acima | |

## Pendências
- SUS não conferido no Fundo Nacional de Saúde.
- PCMGE065 de dez/2025 veio vazio no e-TCM (sem município, valores zerados); não usado.
- PCAGO015 de 2016 a 2019 não aparece nas prestações anuais (2020 a 2025 baixados para o ranking do site).
