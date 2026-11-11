# Fontes do 107. orçamento de são josé da vitória (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 08:05 e 08:29, pelo navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta SAO-JOSE-DA-VITORIA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-SAO-JOSE-DA-VITORIA/documentos_tcm/` (51 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "SÃO JOSÉ DA VITÓRIA" no cabeçalho, menos os comprovantes bancários de repasse à Câmara (PCMGE007 e PCMGE008), que trazem "P M S J VITORIA" e "CAMARA S S J VITORIA" (não usados para valores).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 360 (SÃO JOSÉ DA VITÓRIA) · Prefeitura UJ 964 · Câmara UJ 409. Não há autarquia com prestação própria (os fundos de Saúde, Educação e Assistência Social estão dentro da Prefeitura). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário de 2024 e 2025; PCMGE016 de 09/2026, igual ao PCMGE066 consolidado).
O Balanço, o Anexo IX e os PCMGE065 consolidados já somam Câmara + Prefeitura + fundos. Em 2024 o PCMGE015 SIGA da Prefeitura traz a ação da Câmara com execução zero, então somei o PCMGE015 da Câmara (sem conta em dobro).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores_sjv.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: PCMGE015 SIGA de 12/2024 da Prefeitura (`2024-12_PCMGE015.pdf`, p.75, Total do Poder, Liquidações até o mês: 31.568.321,81) + Câmara (`2024-12_CAMARA_PCMGE015.pdf`, p.1, Total do Projeto/Atividade: 1.184.628,40) = 32.752.950,21 = Balanço (`2024_PCAGO015.pdf`, p.1, Despesas Liquidadas) = Anexo IX (`2024_PCAGO007.pdf`, p.11, Total). Cada função bate com o Anexo IX.
- 2025: PCMGE065 consolidado de 12/2025 (`2025-12_PCMGE065.pdf`, p.33, TOTAL GERAL DA DESPESA ORÇAMENTÁRIA, Liquidado no ano: 35.674.078,34; empenhado 35.874.536,92). O Balanço (`2025_PCAGO015.pdf`, p.2) traz liquidado 35.673.871,18 e empenhado 35.793.185,41: diferença de 207,16 no liquidado (não muda nenhum número arredondado: os dois dão 35 milhões e 700). O Anexo IX de 2025 (`2025_PCAGO007.pdf`) é por EMPENHADO (total 35.793.185,41), por isso Cultura aparece ali com 2.585.006,42 (empenhado) e no vídeo com 2.535.006,42 (liquidado).
- 2026 (até setembro): PCMGE065 consolidado de 09/2026 (`2026-09_PCMGE065.pdf`, p.34, TOTAL GERAL, Liquidado no ano 30.472.933,09; Empenhado no ano 33.883.724,38). A Câmara está dentro (Poder Legislativo, p.1).
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 25 (urbanismo, saneamento, iluminação) · Administração 04 + 28 (PASEP), menos a ação de dívida · Dívidas = ação "Encargos sociais do município" (2024 e 2025) / "Gestão da dívida pública municipal" (2026), elemento 4.6.90.71 Principal da dívida contratual resgatado · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 35 milhões em 2024 | 34.960.039,66 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.9, TOTAL: arrecadada 35.188.898,94 − anulada 228.859,28) |
| gastou 32 milhões e 800 em 2024 | 32.752.950,21 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (empenhadas = liquidadas = pagas) |
| sobraram 2 milhões e 200 | 2.207.089,45 | 2024_PCAGO015.pdf | p.1 · linha SUPERÁVIT (XVI) |
| arrecadou 34 milhões e 900 em 2025 | 34.929.734,22 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.9, TOTAL: 35.334.863,55 − 405.129,33) |
| gastou 35 milhões e 700 em 2025 | 35.674.078,34 | 2025-12_PCMGE065.pdf | p.33 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no ano (Balanço 2025_PCAGO015.pdf p.2: 35.673.871,18) |
| 744 mil a mais do que arrecadou | 744.344,12 | conta própria | 35.674.078,34 − 34.929.734,22 (pelo Balanço: 744.137,04; o Balanço mostra "Défit (VI) 863.451,19" pelo empenhado, p.1) |
| arrecadou 31 milhões e 700 até setembro de 2026 | 31.679.754,09 | 2026-09_PCMGE016.pdf | p.9 · TOTAL · Arrecadada até o mês, já sem as deduções do Fundeb (= 2026-09_PCMGE066.pdf p.11, TOTAL GERAL DA RECEITA ORÇAMENTÁRIA) |
| gastou 30 milhões e 500 até setembro | 30.472.933,09 | 2026-09_PCMGE065.pdf | p.34 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no ano |
| sobrou 1 milhão e 200 | 1.206.821,00 | conta própria | 31.679.754,09 − 30.472.933,09 |
| já comprometeu 33 milhões e 900 | 33.883.724,38 | 2026-09_PCMGE065.pdf | p.34 · TOTAL GERAL · Empenhado no ano |

## Setores (soma = total do ano; somas das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024_PCAGO007.pdf, Anexo IX) | 2025 liquidado (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 10 e 800 · 11 e 800 · 10 e 500 | 10.808.715,68 (p.6, função 12) | 11.802.630,14 | 10.510.446,63 |
| Saúde | 7 e 200 · 7 milhões · 6 e 800 | 7.206.474,15 (p.4, função 10) | 7.031.965,02 | 6.758.507,48 |
| Obras e serviços urbanos | 1 e 500 · 1 e 400 · 1 e 800 | 1.474.971,98 = 1.441.448,98 (p.7, função 15) + 33.523,00 (p.7, função 25) | 1.380.390,96 | 1.825.381,93 |
| Administração | 6 e 900 · 8 e 600 · 6 e 900 | 6.887.371,19 = função 04 8.378.133,26 (p.11) − dívida 1.773.444,56 + PASEP 282.682,49 (p.5, função 28) | 8.648.796,37 | 6.884.314,25 |
| Dívidas | 1 e 800 · 827 mil · 151 mil | 1.773.444,56 (2024-12_PCMGE015.pdf p.23, ação "Encargos sociais do município", Total do Projeto/Atividade, Liquidações; = Balanço, Amortização da Dívida) | 826.891,54 (p.5, TOTAL DA AÇÃO) | 150.793,78 (p.5, ação "Gestão da dívida pública municipal", TOTAL DA AÇÃO) |
| Assistência social | 1 e 500 · 1 e 200 · 1 e 100 | 1.542.440,39 (p.9, função 08) | 1.202.236,68 (p.23, TOTAL DA SECRETARIA, Liquidado no ano) | 1.122.102,55 |
| Câmara de Vereadores | 1 e 200 · 1 e 600 · 1 e 300 | 1.184.628,40 (p.1, função 01; = 2024-12_CAMARA_PCMGE015.pdf p.1) | 1.600.220,56 (p.1, TOTAL DA AÇÃO) | 1.320.781,31 (p.1, TOTAL DA AÇÃO) |
| Cultura e festas | 1 e 800 · 2 e 500 · 1 e 300 | 1.818.027,26 (p.2, função 13) | 2.535.006,42 (p.2, TOTAL DA AÇÃO) | 1.318.232,50 (p.2, TOTAL DA AÇÃO) |
| Agricultura e meio ambiente | 49 mil · 376 mil · 273 mil | 49.073,00 (p.10, função 20) | 375.560,83 | 273.151,30 |
| Esporte | 7 mil e 800 · 270 mil · 309 mil | 7.803,60 (p.2, função 27) | 270.379,82 | 309.221,36 |

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| a ação de cultura levou 1 milhão e 800 em 2024 | 1.818.027,26 | 2024-12_PCMGE015.pdf | p.71 · ação 13.392 "Manutenção das ações de cultura" (única ação da função 13; tem bandas, palco, serviços, premiações, material e diárias) · Total do Projeto/Atividade · Liquidações até o mês |
| só em bandas e palco, 1 milhão e 200 | 1.226.730,00 | 2024-12_PCMGE015.pdf | p.70 a 71 · mesma ação · bandas 700.200,00 (3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical" 535.200,00 fonte 1500 + 153.000,00 fonte 1701 + 3.3.90.36.04 "Contratação de Banda/Grupo Musical" 12.000,00) + palco 526.530,00 (3.3.90.39.19 "Locação, Confecção e Montagem de Cenários, Palcos") · Liquidações · soma: conta própria |
| em 2025, 2 milhões e 500 (ação de cultura) | 2.535.006,42 | 2025-12_PCMGE065.pdf | p.2 · ação 13.392.8.2.023 "Manutenção das ações de cultura" · TOTAL DA AÇÃO · Liquidado no ano |
| quase tudo em bandas | 2.477.876,50 | 2025-12_PCMGE015.pdf | mesma ação · 3.3.90.39.94 "Serviços de banda ou grupo musical" · Liquidações (o resto: palco 25.700,00, pessoa física 12.160,00, outros 9.769,92, alimentação 8.150,00, diárias 1.350,00) |
| o orçamento previa 1 milhão e 700 | 1.673.800,00 | 2025-12_PCMGE065.pdf | p.2 · mesma linha TOTAL DA AÇÃO · Fixado (dotação inicial) |
| mais que o dobro de toda a assistência social do ano | 1.202.236,68 | 2025-12_PCMGE065.pdf | p.23 · TOTAL DA SECRETARIA de Assistência Social · Liquidado no ano · 2 × 1.202.236,68 = 2.404.473,36, menor que 2.535.006,42 (conta própria) |
| em 2026, até setembro, mais 1 milhão e 300 | 1.318.232,50 | 2026-09_PCMGE065.pdf | p.2 · ação 13.392.8.2.023 · TOTAL DA AÇÃO · Liquidado no ano (empenhado 2.020.928,64) |
| em bandas, 575 mil | 575.000,00 | 2026-09_PCMGE015.pdf | mesma ação · 3.3.90.39.94 "Serviços de banda ou grupo musical" · Liquidações |
| por que as bandas levaram 2 milhões e 500 só em 2025? | 2.477.876,50 | 2025-12_PCMGE015.pdf | 3.3.90.39.94, como acima (arredondado: 2 milhões e 500) |
| rede de esgoto: previsto 591 mil em 2024 | 591.350,00 | 2024-12_PCMGE015.pdf | p.49 · ação 17.512 "Ampliação e manutenção da rede de esgotamento" · Total do Projeto/Atividade · Dotação inicial (empenhado e liquidado 0,00) |
| e em 2025 (591 mil) | 591.350,00 | 2025-12_PCMGE065.pdf | p.8 · mesma ação · TOTAL DO PROJETO · Fixado (empenhado e liquidado 0,00) |
| 660 mil em 2026 | 660.312,00 | 2026-09_PCMGE065.pdf | p.8 · mesma ação · TOTAL DO PROJETO · Fixado (empenhado e liquidado 0,00) |
| gasto: zero nos três anos | 0,00 | os três arquivos acima | É a única ação da função 17 (Saneamento) nos três anos. Procurado "ESGOT", "SANEA" e "ÁGUA" nos nomes de todas as ações: nenhuma outra com gasto. |
| IPTU: zero em 2024 | 0,00 | 2024-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadada até o mês 0,00 (previsto 294.000,00; = 2024_PCAGO008.pdf, Anexo 10, só a previsão) |
| 2 mil e 800 em 2025 | 2.800,00 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até o mês (previsto 560.510,00; = 2025_PCAGO008.pdf) |
| zero até setembro de 2026 | 0,00 | 2026-09_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até o mês 0,00 (= 2026-09_PCMGE066.pdf p.1, todas as sublinhas do IPTU, inclusive dívida ativa, com 0,00) |
| a previsão para este ano era de 786 mil | 786.426,20 | 2026-09_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Receita Prevista |
| a Câmara recebeu 1 milhão e 600 em 2025 | 1.611.549,08 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo atual |
| e devolveu 11 mil | 11.328,52 | 2025-12_CAMARA_PCMGE018.pdf | p.5 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Saldo atual (= 2025-12_PCMGE018.pdf da Prefeitura, 4.5.1.1.2.09.00). Recebeu − devolveu = 1.600.220,56 = gasto da Câmara (conta própria) |
| (folha) 2024: recebeu 1.383.604,64 e devolveu 198.976,24 | 1.383.604,64 · 198.976,24 | 2024-12_CAMARA_PCMGE018.pdf | p.5 · REPASSE RECEBIDO e DEVOLUÇÃO DE TRANSFERÊNCIAS · Saldo atual (diferença = 1.184.628,40 = gasto da Câmara) |
| (folha) 2026 até set: devolveu 62.000,00 | 62.000,00 | 2026-09_PCMGE018.pdf (Prefeitura) | p.11 · 4.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS (o razão da Câmara de 09/2026 é escaneado) |
| em consultoria, 314 mil | 314.000,00 | 2025-12_PCMGE065.pdf | p.1 · Câmara, 3.3.90.35.00 Serviços de Consultoria · Liquidado no ano (2026 até set: 246.900,00, 2026-09_PCMGE065.pdf p.1) |
| a dívida fechou 2024 em 28 milhões e 200 | 28.192.635,10 | 2024_PCAGO012.pdf (Anexo 16, dívida fundada interna) | p.1 · Totais · Saldo Atual |
| fechou 2025 em 43 milhões e 200 | 43.192.717,92 | 2025_PCAGO012.pdf | p.1 · TOTAIS · Saldo Atual |
| mais do que tudo que a cidade arrecadou no ano | 34.929.734,22 | 2025_PCAGO015.pdf | p.1 · receita realizada de 2025 (43.192.717,92 é maior; conta própria) |
| só com o INSS, 38 milhões e 700 | 38.660.480,37 | 2025_PCAGO012.pdf | p.1 · DÍVIDA FUNDADA INSS 2.2.1.4.3.01.01 (longo prazo) 37.654.871,76 + 2.1.1.4.3.01.02 (curto prazo) 1.005.608,61 · Saldo Atual · soma: conta própria (fim de 2024: 24.332.877,57, 2024_PCAGO012.pdf p.1; inscrição em 2025: 15.121.994,19) |

## Detalhe que aparece só nas folhas (subelementos do PCMGE015 SIGA)
| Texto da folha | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| Dívidas 2024: INSS 1.283.359,87 · precatórios 426.460,54 · FGTS 63.624,15 (soma 1.773.444,56) | | 2024_PCAGO012.pdf | p.1 · coluna Baixa de cada parcelamento (= liquidado da ação "Encargos sociais do município"; conta própria) |

## Receita detalhada (folhas de receita; scripts/receita_sjv.py → saida/receita_AAAA.json)
PCMGE016 de 12/2024, 12/2025 e 09/2026 da Prefeitura: arrecadada até o mês + anulada até o mês, por grupo de código. A soma das linhas (mais "Outras receitas") = total do ano dito na fala. Em 2024 a contribuição de iluminação pública (1.2.4.1.50, COSIP) aparece toda em dezembro: 2.225.543,59 (2024-12_PCMGE016.pdf p.2).

## Versões
- v2 (10/11/2026, controladoria, regra 91): "as festas levaram" virou "a ação de cultura levou" (a ação não é só de festas) e entraram os valores de bandas (e palco em 2024) de cada ano; o fecho pergunta pelas bandas (2.477.876,50 em 2025). Voz, sincronia e vídeo refeitos; v1 em antigos/versão 1 (festas)/.

## Pendências e observações
- Liquidado de 2025: PCMGE065 consolidado 35.674.078,34 x Balanço 35.673.871,18 (207,16 a menos no Balanço). Usado o PCMGE065 (é dele que saem as ações e as folhas).
- Razão da Câmara de 09/2026 (2026-09_CAMARA_PCMGE018.pdf) e comprovantes PCMGE007 escaneados: não usados para valores.
- Nenhum nome de gestor no vídeo.
