# Fontes do 111. orçamento de dias d'ávila (BA)

Lote de 40 (brief projetos/_brief-lote-40.md), molde 093 Ilhéus / 131 Maraú. Só 2024, 2025 e 2026 (regra 87).
Consulta: 10/11/2026 (downloads no e-TCM entre 22:31 e 22:49, no navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta DIAS-D-AVILA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-DIAS-D-AVILA/documentos_tcm/` (56 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF ("DIAS D'ÁVILA", "DIAS DAVILA" ou "DIAS D-ÁVILA" no cabeçalho); competência de cada PDF mensal conferida na linha "Competência:" ou no cabeçalho "DEZEMBRO/2024" (12/2024, 12/2025 e 09/2026, Prefeitura e Câmara). Sem texto (imagens, não usados para números): os PCMGE007 da Câmara (extratos do repasse), os PCMGE009 a 014 da Câmara de 2026 ("não houve movimento"), 2025-12_PCMGE064.pdf (razão consolidado de 2025 só em imagem) e 2026-09_ADIC_FMS_CRP.pdf.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 118 (DIAS DÁVILA) · Prefeitura UJ 723 ("Prefeitura Municipal de DIAS DAVILA") · Câmara UJ 152 ("Camara Municipal de DIAS DAVILA"). Não há autarquia com prestação própria. Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente"). Lista de prestações mensais gravada em dados/prestacoes-etcm/dias-d-avila.json (regra 89).
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário em 2024 e 2025; em 2026, PCMGE016 de set/2026, linha "Totais": arrecadada até o mês mais a anulada, que é negativa; igual ao consolidado PCMGE066). A receita já vem sem a parte do Fundeb (ex.: FPM de dez/2025 80.510.847,34 com 18.859.899,54 de dedução mostrada à parte, 2025-12_PCMGE016.pdf p.2).
2024 veio de outro sistema contábil (Contabilis): os demonstrativos de 2024 não trazem a função de cada ação. A função foi tirada da MESMA ação (mesma unidade e mesmo número) no PCMGE015 SIGA de 2025 (scripts/acoes2024.py; os nomes batem nas 234 ações com par; 4 sem par, classificadas à mão: Clube de Mães = assistência; audiovisual e fomento às demais áreas da cultura = cultura).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: `2024-12_PCMGE065.pdf` (Despesa Orçamentária, Demonstrativo Consolidado, Prefeitura + Câmara) p.44, "Total Geral", Liquidações Acumulado 344.159.075,14 = Balanço (`2024_PCAGO015.pdf` p.2). O demonstrativo de 2024 só abre até a modalidade (3.3.90.39.00): bandas e palco não aparecem separados nesse ano.
- 2025: Prefeitura 383.605.895,76 (`2025-12_PCMGE015.pdf` p.174, Total do Poder, Liquidações até Mês) + Câmara 13.487.923,45 (`2025-12_CAMARA_PCMGE015.pdf` p.3, Total da Unidade) = 397.093.819,21 = Balanço (`2025_PCAGO015.pdf` p.2) = consolidado `2025-12_PCMGE065.pdf` p.104.
- 2026 (até setembro): Prefeitura 284.174.535,63 (`2026-09_PCMGE015.pdf` p.181, Total do Poder) + Câmara 10.910.247,68 (`2026-09_CAMARA_PCMGE015.pdf` p.3, Total da Unidade) = 295.084.783,31 = consolidado `2026-09_PCMGE065.pdf` p.110.
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 16, 17 e 26 · Administração 03, 04 e 11 · Dívidas 28 (encargos especiais: juros e amortização, obrigações tributárias e contributivas, precatórios, restituições) · Assistência social 08 e 14 · Câmara 01 · Cultura 13 (sem as festas) · Agricultura e meio ambiente 18 · Esporte 27.
- Ajuste (visível nas folhas): a administração das secretarias de Obras (órgão 7), de Esporte (órgão 16) e de Meio Ambiente (órgão 14) lançada na função 04 vai para a área do órgão (pessoal e manutenção da secretaria).
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "REALIZAÇÃO DE EVENTOS CULTURAIS" (Gabinete do Prefeito, função 13; o nome diz "eventos") + os elementos de banda (3.3.90.39.94) e de palco/cenário (3.3.90.39.95 "Locação, confecção e montagem de cenários, palcos") de QUALQUER outra ação. O 3.3.90.39.19 em Dias d'Ávila é "Manutenção e conservação de veículos" e não entra. Não são festa e ficam nas suas áreas: "Realização de eventos esportivos" (Esporte), "Realização de eventos educacionais" (Educação), "Realização de conferência e eventos de saúde" (Saúde), "Realização de eventos de educação ambiental" (sem gasto). "Cultura" = o resto da função 13 (Secretaria de Cultura: pessoal, fomento às atividades artísticas, Cultura Viva).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Dias d'Ávila arrecadou 386 milhões e 600 em 2024 | 386.620.692,20 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.11, TOTAL DA RECEITA, Arrecadação Acumulado) |
| 404 milhões e 500 em 2025 | 404.462.258,55 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf e 2025-12_PCMGE066.pdf, "Totais") |
| 308 milhões e 700 até setembro de 2026 | 308.708.189,92 | 2026-09_PCMGE016.pdf | p.7 · "Totais" · Total Até Mês (arrecadada até mês 335.525.085,87 + anulada até mês −26.816.895,95; = 2026-09_PCMGE066.pdf p.11) |
| em 2025, o FPM trouxe 80 milhões e 500 | 80.499.584,72 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do Fundo de Participação dos Municípios · Arrecadada até Mês 80.510.847,34 + Anulada até Mês −11.262,62 (conta própria; já sem a parte do Fundeb, 18.859.899,54 em Deduções até Mês) |
| e o Fundeb, com a ajuda da União, 96 milhões e 400 | 96.416.333,58 | 2025-12_PCMGE016.pdf | conta própria: p.4 · 1.7.5.0.00.0.0 (retorno do Fundeb) 65.314.338,86 + p.3 · 1.7.1.5.00.0.0 (complementação da União ao Fundeb) 31.106.449,19 − 4.454,47 anulada = 31.101.994,72 |
| 2024: gastou 344 milhões e 200 | 344.159.075,14 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.44 Total Geral) |
| sobraram 42 milhões e 500 | 42.461.617,06 | conta própria | 386.620.692,20 − 344.159.075,14 (o Balanço mostra superávit de 35.667.753,49 sobre o EMPENHADO 350.952.938,71, p.2) |
| 2025: gastou 397 milhões e 100 | 397.093.819,21 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| sobraram 7 milhões e 400 | 7.368.439,34 | conta própria | 404.462.258,55 − 397.093.819,21 (sobre o EMPENHADO, 405.791.600,07, o Balanço mostra déficit de 1.329.341,52, p.1) |
| 2026, até setembro: gastou 295 milhões e 100 | 295.084.783,31 | 2026-09_PCMGE065.pdf | p.110 · TOTAL · Liquidada até o Mês (= 2026-09_PCMGE015.pdf p.181 Total do Poder 284.174.535,63 + 2026-09_CAMARA_PCMGE015.pdf p.3 Total da Unidade 10.910.247,68, conta própria) |
| sobraram 13 milhões e 600 | 13.623.406,61 | conta própria | 308.708.189,92 − 295.084.783,31 |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json e saida/fontes_setores.json)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 117 milhões e 100 · 166 e 600 · 112 e 500 | 117.067.251,27 (2024-12_PCMGE065.pdf p.13 a 19, Sec. de Educação, função 12) | 166.636.020,23 (2025-12_PCMGE015.pdf p.48 a 77, função 12, menos 95.124,20 de palco) | 112.517.272,62 (2026-09_PCMGE015.pdf p.43 a 84, função 12, menos 38.060,10 de palco) |
| Saúde | 83 milhões · 87 e 400 · 69 milhões | 83.049.778,67 (2024-12_PCMGE065.pdf p.20 a 29, função 10) | 87.359.484,28 (2025-12_PCMGE015.pdf p.78 a 114, função 10) | 68.993.877,35 (2026-09_PCMGE015.pdf p.86 a 125, função 10) |
| Administração | 46 e 900 · 49 e 500 · 38 e 400 | 46.944.844,99 (2024-12_PCMGE065.pdf, funções 04 e 11, sem Obras, Esporte e Meio Ambiente) | 49.474.655,73 (2025-12_PCMGE015.pdf p.3 a 166, idem) | 38.386.713,22 (2026-09_PCMGE015.pdf p.3 a 175, funções 03, 04 e 11, idem) |
| Obras e serviços urbanos | 43 e 400 · 38 e 500 · 29 e 600 | 43.436.846,14 (2024-12_PCMGE065.pdf p.6 a 41: funções 15, 16 e 17 + administração da Sec. de Obras na função 04) | 38.482.927,67 (2025-12_PCMGE015.pdf p.26 a 157: funções 15, 16, 17 e 26 + Sec. de Obras na função 04) | 29.629.211,44 (2026-09_PCMGE015.pdf p.22 a 168: idem; inclui pessoal da Sec. de Obras 10.185.898,38, ação 7.701.4.122.2.2.2012) |
| Dívidas | 16 e 400 · 17 e 400 · 10 e 500 | 16.444.367,14 (2024-12_PCMGE065.pdf p.39, Encargos Gerais do Município, função 28) | 17.366.867,00 (2025-12_PCMGE015.pdf p.150, função 28: juros e amortização 12.477.616,20; obrigações tributárias 3.883.622,13; precatórios 717.543,93; restituições 288.084,74) | 10.479.371,02 (2026-09_PCMGE015.pdf p.161, função 28) |
| Assistência social | 10 e 600 · 11 e 300 · 8 e 700 | 10.647.767,94 (2024-12_PCMGE065.pdf p.30 a 35, função 08) | 11.336.408,80 (2025-12_PCMGE015.pdf p.116 a 137, função 08) | 8.731.412,80 (2026-09_PCMGE015.pdf p.127 a 148, funções 08 e 14) |
| Câmara de Vereadores | 14 e 300 · 13 e 500 · 10 e 900 | 14.290.050,59 (2024-12_CAMARA_PCMGE015.pdf p.3, Total da Unidade; = 2024-12_PCMGE065.pdf p.1, órgão 01) | 13.487.923,45 (2025-12_CAMARA_PCMGE015.pdf p.3, Total da Unidade) | 10.910.247,68 (2026-09_CAMARA_PCMGE015.pdf p.3, Total da Unidade) |
| Festas e eventos | 7 e 900 · 8 e 400 · 10 e 300 | 7.907.937,42 (veja abaixo) | 8.377.077,15 (veja abaixo) | 10.332.264,95 (veja abaixo) |
| Cultura | 500 mil · 570 mil · 729 mil | 500.118,04 (2024-12_PCMGE065.pdf p.42 a 43: fomento às atividades artísticas 189.250,00, Cultura Viva 136.535,04, audiovisual 101.619,88, reforma de equipamentos culturais 69.713,12, outras áreas da cultura 3.000,00) | 569.822,31 (2025-12_PCMGE015.pdf p.169 a 173, Sec. de Cultura: pessoal 407.538,12, fomento 129.906,27, Cultura Viva 32.377,92) | 729.331,35 (2026-09_PCMGE015.pdf p.176 a 179, Sec. de Cultura: pessoal 526.282,28, fomento 201.839,07, manutenção 1.210,00) |
| Agricultura e meio ambiente | 1 milhão e 500 · 1 milhão e 500 · 1 milhão e 100 | 1.468.069,96 (2024-12_PCMGE065.pdf p.39 a 40, Sec. de Meio Ambiente) | 1.541.885,32 (2025-12_PCMGE015.pdf p.151 a 153, função 18) | 1.094.940,01 (2026-09_PCMGE015.pdf p.162 a 164, função 18) |
| Esporte | 2 milhões e 400 · 2 milhões e 500 · 3 milhões e 300 | 2.402.042,98 (2024-12_PCMGE065.pdf p.42 a 43: função 27 + administração da Sec. de Esporte na função 04) | 2.460.747,27 (2025-12_PCMGE015.pdf p.159 a 164: eventos esportivos 250.891,51 + Sec. de Esporte na função 04) | 3.280.140,87 (2026-09_PCMGE015.pdf p.170 a 174, função 27: pessoal 1.342.050,45, espaço esportivo 1.301.218,91, eventos esportivos 302.098,10, manutenção e TI 334.773,41) |

### Festas e eventos <ano> (regra 99: de onde veio cada parte)
- Festas e eventos 2024: R$ 7.907.937,42 = ação 2002 "REALIZAÇÃO DE EVENTOS CULTURAIS" (órgão 02 Gabinete do Prefeito, unidade 0201) 7.907.937,42 (2024-12_PCMGE065.pdf p.1, linha da ação, Liquidações Acumulado; = 2024-12_PCMGE015.pdf p.1). Em 2024 o demonstrativo só abre até a modalidade 3.3.90.39.00 (serviços de terceiros, 7.830.015,72): não dá para separar bandas e palco nesse ano. Procurado nas outras ações de 2024: nenhuma outra ação com festa ou evento cultural no nome.
- Festas e eventos 2025: R$ 8.377.077,15 = ação 2.201.13.392.6.2.2002 "REALIZACAO DE EVENTOS CULTURAIS" 8.281.952,95 (2025-12_PCMGE015.pdf p.8, Total do Projeto/Atividade, Liquidações até Mês; dentro, p.7: bandas 3.3.90.39.94 2.818.020,00 (fonte 1500) + 1.055.820,00 (fonte 2500) = 3.873.840,00; palco e cenário 3.3.90.39.95 2.034.377,83; exposições e eventos 3.3.90.39.22 2.083.521,12; banheiros químicos 192.243,00) + palco 3.3.90.39.95 95.124,20 na ação 8.801.12.122.2.2.2003 "MANUTENCAO DOS SERVICOS TECNICOS E APOIO ADMINISTRATIVO" da Sec. de Educação (p.50).
- Festas e eventos 2026: R$ 10.332.264,95 = ação 2.201.13.392.11.2.2006 "REALIZACAO DE EVENTOS CULTURAIS" 10.294.204,85 (2026-09_PCMGE015.pdf p.7, Total do Projeto/Atividade; dentro, p.6: bandas 3.3.90.39.94 1.883.200,00 (fonte 1500) + 577.000,00 (fonte 1501) + 2.457.680,00 (fonte 2500) = 4.917.880,00; palco e cenário 2.713.868,66; exposições e eventos 1.741.854,39) + palco 3.3.90.39.95 38.060,10 na manutenção da Sec. de Educação (8.801.12.122.2.2.2003, p.47). Procurado em todas as ações de 2025 e 2026: nenhum outro elemento de banda ou palco com liquidação.

## Câmara (o que entrou e o que saiu)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| em 2024, ela recebeu 14 milhões e 300 da prefeitura | 14.292.839,33 | 2024-12_PCMGE064.pdf (razão consolidado da Prefeitura) | p.29 · 351120202 REPASSE CONCEDIDO AO PODER LEGISLATIVO - DUODÉCIMO · Saldo Atual (débitos 15.483.909,27 − estorno 1.191.069,94). No razão da Câmara (2024-12_CAMARA_PCMGE018.pdf p.8, 4.5.1.1.2.02.00 REPASSE RECEBIDO) o mesmo estorno aparece: saldo anterior 13.101.769,34 + creditado no mês 1.191.069,99 = 14.292.839,33, valor encerrado no mês |
| e devolveu 841 reais | 840,84 | 2024-12_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| (gasto da Câmara 2024, na folha) | 14.290.050,59 | 2024-12_CAMARA_PCMGE015.pdf | p.3 · Total da Unidade · Liquidações até Mês |
| em 2025, recebeu 13 milhões e 600 | 13.566.737,91 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (sem conta de devolução em 2025) |
| e gastou 13 milhões e 500 | 13.487.923,45 | 2025-12_CAMARA_PCMGE015.pdf | p.3 · Total da Unidade · Liquidações até Mês |
| mais do que a assistência social | 11.336.408,80 | 2025-12_PCMGE015.pdf | Assistência social 2025, linha da tabela de setores acima (conta própria) |
| em 2026, até setembro, recebeu 11 milhões | 11.004.703,90 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 26 mil | 26.141,92 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| (gasto da Câmara 2026 até set, na folha) | 10.910.247,68 | 2026-09_CAMARA_PCMGE015.pdf | p.3 · Total da Unidade |

## Gastos da Câmara
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Consultoria e assessoria: 568 mil em 2024 | 567.500,00 | 2024-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.03 Consultoria Jurídica 366.000,00 + 3.3.90.35.01 Consultoria Contábil 201.500,00 · Liquidações até Mês (conta própria) |
| e 736 mil em 2025 | 735.500,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 ASSESSORIA E CONSULTORIA TÉCNICA OU JURÍDICA 639.500,00 + 3.3.90.35.99 OUTROS SERVIÇOS DE CONSULTORIA 96.000,00 (conta própria) |
| Combustível: 442 mil em 2024 | 441.727,56 | 2024-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.30.02 Combustíveis e Lubrificantes · Liquidações até Mês |
| e 276 mil só até setembro de 2026 | 275.649,15 | 2026-09_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS · Liquidações até Mês (em 2025: 74.419,91, 2025-12_CAMARA_PCMGE015.pdf p.2) |

## Festas e ajuda às famílias
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| A ação de eventos culturais fica no gabinete do prefeito | órgão 2 (GABINETE DO PREFEITO- GAPRE), unidade 201 | 2026-09_PCMGE015.pdf | p.6 · 2.201.13.392.11.2.2006 REALIZACAO DE EVENTOS CULTURAIS (2025: 2.201.13.392.6.2.2002, 2025-12_PCMGE015.pdf p.7; 2024: 2002, órgão 02, 2024-12_PCMGE065.pdf p.1) |
| Só com bandas, foram 3 milhões e 900 em 2025 | 3.873.840,00 | 2025-12_PCMGE015.pdf | p.7 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL OU PROFISSIONAL · fonte 1500 2.818.020,00 + fonte 2500 1.055.820,00 · Liquidações até Mês (conta própria) |
| e 4 milhões e 900 até setembro de 2026 | 4.917.880,00 | 2026-09_PCMGE015.pdf | p.6 · 3.3.90.39.94 · fontes 1500 1.883.200,00 + 1501 577.000,00 + 2500 2.457.680,00 (conta própria) |
| A ajuda de emergência para as famílias ficou em 1 milhão e 500 em 2025 | 1.468.816,48 | 2025-12_PCMGE015.pdf | p.136 · ação 10.1003.8.244.5.2.2104 BENEFICIOS EVENTUAIS DA ASSISTENCIA SOCIAL · Total do Projeto/Atividade · Liquidações até Mês (2024: 1.687.988,33, 2024-12_PCMGE065.pdf p.35; 2026 até set: 1.051.868,26) |
| por que as festas e eventos levaram 8 milhões e 400 em 2025 | 8.377.077,15 | 2025-12_PCMGE015.pdf | Festas e eventos 2025 (acima): p.8 ação de eventos culturais 8.281.952,95 + p.50 palco na Educação 95.124,20 (conta própria) |

## Linhas para o site
- Festas e eventos 2024: R$ 7.907.937,42
- Festas e eventos 2025: R$ 8.377.077,15
- Festas e eventos 2026: R$ 10.332.264,95 (até setembro)
- Cultura 2024: R$ 500.118,04 · Cultura 2025: R$ 569.822,31 · Cultura 2026: R$ 729.331,35 (até setembro)

## Receita por ano (folhas de receita; scripts/receita2024.py e scripts/receita.py → saida/receita_<ano>.json)
- 2024: 2024-12_PCMGE016.pdf (Contabilis): cada grupo = receita bruta + "Dedução para o FUNDEB" + "Restituição" do mesmo código (coluna Arrecadação Acumulado). Total 386.620.692,20 (p.11, TOTAL DA RECEITA) = Balanço 2024.
- 2025: 2025-12_PCMGE016.pdf (SIGA): Arrecadada até Mês + Anulada até Mês. Total 404.462.258,55 = Balanço 2025.
- 2026: 2026-09_PCMGE016.pdf (SIGA): idem. Total 308.708.189,92 = consolidado PCMGE066.
- Nas folhas, "Transferência da União por decisão judicial" é a conta 1.7.1.9.56 (Transferências Decorrentes de Decisão Judicial): 25.367.381,74 (2024), 18.869.137,36 (2025), 19.270.566,59 (2026 até set). Não foi falada.
