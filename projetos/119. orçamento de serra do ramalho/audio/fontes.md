# Fontes do 119. orçamento de serra do ramalho (BA)

Consulta: 11/11/2026 (downloads no e-TCM no navegador do app, com a trava _navegador.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta SERRA-DO-RAMALHO, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-SERRA-DO-RAMALHO/documentos_tcm/` (112 PDFs, cada um com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho dos PDFs ("SERRA DO RAMALHO") e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026). Os PDFs da Câmara de 12/2024 (PCMGE015 e PCMGE018) vieram escaneados: lidos com o OCR do Mac (scripts/ocr.swift) e conferidos na imagem.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 372 (SERRA DO RAMALHO) · Prefeitura UJ 976 · Câmara UJ 392 · Instituto Municipal de Previdência (IMUP) UJ 600 · Agência Reguladora de Serviços de Saneamento Básico UJ 8 · SAAE UJ 1074 (todas as prestações de 2025 e 2026 "Pendente", sem documentos; não entra). Último mês entregue em 2026: 09/2026 (Prefeitura, Câmara, IMUP e Agência; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/serra-do-ramalho.json.
"Gastou" = despesa LIQUIDADA. Total de 2024 e 2025 = Balanço Orçamentário consolidado do município (PCAGO015: Prefeitura, fundos, IMUP, Agência e Câmara). 2026 = consolidado PCMGE065 de set/2026. Receita = total do Balanço (2024 e 2025) e soma dos PCMGE016 de set/2026 da Prefeitura, do IMUP e da Agência (arrecadada até o mês, já sem a parte do Fundeb, mais a anulada, que é negativa). A receita inclui a contribuição da prefeitura ao instituto de previdência (intraorçamentária), como no Balanço.
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do consolidado, centavo a centavo)
- Prefeitura e fundos (órgãos 2 a 5): PCMGE015 da Prefeitura de cada ano (leitor scripts/acoes015.py; traz o subelemento: bandas 3.3.90.39.18/39.94, palco 3.3.90.39.19/39.95). Câmara (órgão 1), IMUP (órgão 6) e Agência (órgão 7): consolidado PCMGE065 (leitor scripts/acoes_cons.py), porque no PCMGE015 da Prefeitura essas unidades vêm zeradas.
- 2024: soma 178.182.374,07 = `2024-12_PCMGE065.pdf` (Total do Poder: Prefeitura 40.531.280,78 + Câmara 4.552.631,92 + IMUP e Agência 15.233.200,38 + fundos 117.865.260,99) = `2024_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 178.182.374,07.
- 2025: soma 212.669.913,13 = `2025-12_PCMGE065.pdf` (soma das ações, Liquidada até o Mês). O Balanço `2025_PCAGO015.pdf` p.2 traz 212.669.745,17 (diferença de 167,96, conta própria). Na fala e na tela vale o Balanço: 212 milhões e 700 (os dois arredondam igual).
- 2026 (até setembro): `2026-09_PCMGE065.pdf` p.132 · Liquidada até o Mês 176.781.209,56 (Empenhada até o Mês 206.563.574,47).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Previdência dos servidores 09 (IMUP: aposentadorias, pensões e a gestão do instituto) · Obras e serviços urbanos 15, 16, 17, 25 (iluminação pública), 26 (transporte e estradas vicinais) · Administração 04 (inclui a Agência Reguladora), 06 (segurança pública), 99 · Dívidas e encargos 28 (encargos gerais: obrigações tributárias e contributivas e principal da dívida contratual) · Assistência social 08 · Câmara 01 · Cultura 13 sem as festas · Agricultura e meio ambiente 18 e 20 · Esporte 27.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "REALIZAÇÕES E MANUTENÇÃO DE FESTAS CULTURAIS, RELIGIOSAS..." (2.701.13.392.19.2.2014 em 2024 e 2025; 2.701.13.392.12.2.2014 em 2026) inteira, mais os elementos de bandas e de palco (escolhidos pelo NOME do elemento) em outras ações: 2024: 3.3.90.39.18 bandas 91.000,00 e 3.3.90.39.19 palco 207.755,00 na ação de gestão da Secretaria de Administração (2.501.4.122.5.2.2006) e palco 35.918,25 na ação de apoio à cultura (2.701.13.392.19.2.2089); 2025: palco (39.95) 4.680,00 + 6.350,00 + 4.953,00 em três ações da assistência social; 2026: palco (39.95) 4.699,87 + 6.225,00 em duas ações da assistência social. "Cultura" = o resto da função 13 (apoio à cultura, Fundo de Cultura, banda marcial, biblioteca).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Serra do Ramalho arrecadou 184 milhões em 2024 | 184.019.152,47 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.14, Totais: Total até Mês) |
| 221 milhões em 2025 | 221.021.063,42 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas. O consolidado 2025-12_PCMGE066.pdf p.15 dá 221.021.364,64 (diferença 301,22, conta própria) |
| 182 milhões até setembro de 2026 | 181.987.976,97 | 2026-09_PCMGE016.pdf (Prefeitura) + 2026-09_PREV_PCMGE016.pdf (IMUP) + 2026-09_AGENCIA_PCMGE016.pdf | Prefeitura p.8 · TOTAL · Arrecadada até Mês 163.693.690,88 + Anulada até Mês −18,38; IMUP p.2 · TOTAL 18.647.123,28 − 519.377,40; Agência p.1 · TOTAL 166.558,59 (soma: conta própria). O consolidado 2026-09_PCMGE066.pdf p.15 dá 181.986.574,06 (diferença 1.402,91 nas linhas de impostos e rendimentos; conta própria) |
| Em 2025, o FPM, da União, mandou 47 milhões | 47.034.845,14 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 10.188.619,52) |
| O Fundeb trouxe 45 milhões e 200 | 45.215.270,34 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.1.50.0.0 Transferências de Recursos do Fundeb · Arrecadada até Mês |
| e a complementação da União ao Fundeb, mais 38 milhões e 900 | 38.930.040,78 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.5.00.0.0 Transferências de Recursos de Complementação da União ao Fundeb · Arrecadada até Mês |
| E o SUS mandou 21 milhões | 20.973.837,87 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.3.00.0.0 (União) 21.457.788,49 − Anulada até Mês 1.016.254,00 + p.5 · 1.7.2.3.00.0.0 (Estado) 412.303,38 + 2.4.1.1.00.0.0 (capital) 120.000,00 (soma: conta própria) |
| 2024: gastou 178 milhões e 200 | 178.182.374,07 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 5 milhões e 800 | 5.836.778,40 | conta própria | 184.019.152,47 − 178.182.374,07 |
| 2025: gastou 212 milhões e 700 | 212.669.745,17 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 8 milhões e 400 | 8.351.318,25 | conta própria | 221.021.063,42 − 212.669.745,17 |
| 2026, até setembro: gastou 176 milhões e 800 | 176.781.209,56 | 2026-09_PCMGE065.pdf | p.132 · total · Liquidada até o Mês |
| Sobraram 5 milhões e 200 | 5.206.767,41 | conta própria | 181.987.976,97 − 176.781.209,56 |
| E já comprometeu 206 milhões e 600 | 206.563.574,47 | 2026-09_PCMGE065.pdf | p.132 · total · Empenhada até o Mês |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidações Até Mês" do PCMGE015 da Prefeitura ou "Liquidada até o Mês" do PCMGE065)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 82 e 900 · 100 milhões e 600 · 75 e 100 | 82.877.247,62 | 100.583.821,66 | 75.119.901,31 |
| Saúde | 31 e 500 · 37 e 500 · 31 e 900 | 31.487.229,90 | 37.519.318,94 | 31.881.787,83 |
| Previdência dos servidores | 15 milhões · 18 e 300 · 14 e 100 | 15.032.880,29 | 18.296.059,24 | 14.081.808,18 |
| Obras e serviços urbanos | 13 e 500 · 15 milhões · 18 e 700 | 13.474.547,36 | 14.982.802,72 | 18.716.922,69 |
| Administração | 13 e 300 · 14 e 400 · 12 e 500 | 13.279.455,19 | 14.444.912,68 | 12.489.209,41 |
| Dívidas e encargos | 4 milhões e 600 · 5 milhões e 100 · 3 milhões e 400 | 4.559.544,23 | 5.139.937,40 | 3.446.525,97 |
| Assistência social | 3 milhões e 500 · 4 milhões e 300 · 3 milhões e 700 | 3.500.783,47 | 4.319.198,74 | 3.650.796,35 |
| Câmara de Vereadores | 4 milhões e 600 · 4 milhões e 800 · 3 milhões e 600 | 4.552.631,92 | 4.837.841,97 | 3.600.268,84 |
| Festas e eventos | 4 milhões e 700 · 6 milhões e 300 · 6 milhões e 800 | 4.702.480,32 | 6.338.301,88 | 6.843.045,84 |
| Cultura | 1 milhão e 400 · 1 milhão e 900 · 1 milhão e 500 | 1.350.243,37 | 1.925.874,92 | 1.495.935,23 |
| Agricultura e meio ambiente | 3 milhões e 200 · 4 milhões e 200 · 5 milhões e 300 | 3.205.041,70 | 4.172.797,47 | 5.335.213,40 |
| Esporte | 160 mil · 109 mil · 120 mil | 160.288,70 | 109.045,51 | 119.794,51 |
| **Soma** | | 178.182.374,07 | 212.669.913,13 | 176.781.209,56 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 4.702.480,32 (ação 2.701.13.392.19.2.2014, 2024-12_PCMGE015.pdf p.16, Total do Projeto/Atividade, Liquidações até Mês 4.367.807,07 + bandas e palco de outras ações 334.673,25)
- Festas e eventos 2025: R$ 6.338.301,88 (ação 2.701.13.392.19.2.2014, 2025-12_PCMGE015.pdf p.21, 6.322.318,88 + palco em ações da assistência 15.983,00)
- Festas e eventos 2026: R$ 6.843.045,84 (ação 2.701.13.392.12.2.2014, 2026-09_PCMGE015.pdf p.23, 6.832.120,97 + palco em ações da assistência 10.924,87, até setembro)
- Cultura 2024: R$ 1.350.243,37 · Cultura 2025: R$ 1.925.874,92 · Cultura 2026: R$ 1.495.935,23

## A Câmara (razão da própria Câmara, PCMGE018)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 4 milhões e 600 da prefeitura | 4.610.000,02 | 2024-12_CAMARA_PCMGE018.pdf (escaneado; lido com OCR e conferido na imagem) | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO / 4.5.0.0.0.00.00 TRANSFERÊNCIAS E DELEGAÇÕES RECEBIDAS · Creditado até o Mês |
| e devolveu 57 mil | 57.368,10 | 2024-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (56.000,00 até novembro + 1.368,10 em dezembro). Conferência: 4.610.000,02 − 57.368,10 = 4.552.631,92 = gasto liquidado da Câmara em 2024 (conta própria) |
| Em 2025, recebeu 5 milhões e 450 | 5.450.000,02 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 612 mil | 612.158,05 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês. Conferência: 5.450.000,02 − 612.158,05 = 4.837.841,97 = gasto liquidado da Câmara em 2025 (conta própria) |
| Até setembro de 2026, já recebeu 4 milhões e 300 | 4.312.500,12 | 2026-09_CAMARA_PCMGE018.pdf (imagem) | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (479.166,67 em setembro) |
| e devolveu 250 mil | 250.000,00 | 2026-09_CAMARA_PCMGE018.pdf (imagem) | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (150.000,00 até agosto + 100.000,00 em setembro) |
- Gasto da Câmara (liquidado, para a folha): 4.552.631,92 (2024) · 4.837.841,97 (2025) · 3.600.268,84 (2026 até set), dos consolidados PCMGE065 (função 01).

## As festas (ação "Realizações e manutenção de festas culturais, religiosas...", PCMGE015 da Prefeitura)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a ação de festas previa 389 mil | 388.963,79 | 2024-12_PCMGE015.pdf | p.16 · ação 2.701.13.392.19.2.2014 · Total do Projeto/Atividade · Fixada (a lei do orçamento) |
| Gastou 4 milhões e 400 | 4.367.807,07 | 2024-12_PCMGE015.pdf | p.16 · mesma linha · Liquidações até Mês (alterações 4.204.276,60; total fixada 4.375.683,88) |
| Em 2025, previa 1 milhão e 700 | 1.655.524,25 | 2025-12_PCMGE015.pdf | p.21 · ação 2.701.13.392.19.2.2014 · Total do Projeto/Atividade · Fixada |
| Gastou 6 milhões e 300 | 6.322.318,88 | 2025-12_PCMGE015.pdf | p.21 · mesma linha · Liquidações até Mês (alterações 5.199.203,00; total fixada 6.336.259,25) |
| Em 2026, previa 2 milhões e 500 | 2.481.743,22 | 2026-09_PCMGE015.pdf | p.23 · ação 2.701.13.392.12.2.2014 · Total do Projeto/Atividade · Fixada |
| e até setembro já gastou 6 milhões e 800 | 6.832.120,97 | 2026-09_PCMGE015.pdf | p.23 · mesma linha · Liquidações até Mês (total fixada 7.346.743,22; empenhado 7.218.234,77) |
| Só com bandas e palco, 5 milhões e 800 | 5.795.617,23 | 2026-09_PCMGE015.pdf | p.23 · ação 2014 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL 2.972.000,00 + 3.3.90.39.95 LOCAÇÃO, CONFECÇÃO E MONTAGEM DE CENÁRIOS, PALCOS fonte 1500 2.411.617,23 + fonte 1701 412.000,00 · Liquidações até Mês (soma: conta própria) |
| Em 2025, os benefícios eventuais ficaram em 481 mil | 481.387,28 | 2025-12_PCMGE015.pdf | p.79 · ação 4.1102.8.244.15.2.2055 "GESTÃO DE BENEFÍCIOS EVENTUAIS" · Total do Projeto/Atividade · Liquidações até Mês |
| se a assistência social inteira ficou em 4 milhões e 300 | 4.319.198,74 | setores.json | Assistência social 2025 (função 08, sem os 15.983,00 de palco que foram para Festas e eventos; função 08 inteira 4.335.181,74, 2025-12_PCMGE065.pdf). Os dois arredondam para 4 milhões e 300 |
| por que as festas levaram 6 milhões e 300 em 2025? | 6.322.318,88 | 2025-12_PCMGE015.pdf | p.21 (ação de festas, mesma linha acima; o setor Festas e eventos 2025 = 6.338.301,88, também 6 e 300) |
- Bandas e palco em 2024 e 2025 (só na folha e na legenda): 2024 ação 2014: bandas (39.18) 1.765.000,00 + palco (39.19) 2.231.209,50 + 153.183,28; 2025 ação 2014: bandas (39.94) 2.020.000,00 + 75.000,00 + palco (39.95) 677.210,31.
- Bandas e palco em todas as ações até set/2026 (folha das festas): 5.806.542,10 = os 5.795.617,23 da ação de festas + palco 10.924,87 em duas ações da assistência social (conta própria).
- Esporte (função 27): 160.288,70 (2024) · 109.045,51 (2025) · 119.794,51 (até set/2026).

## Receita por ano (folha "PDF" de receita; scripts/receita.py → saida/receita_AAAA.json)
Itens pelo PCMGE016 da Prefeitura, do IMUP e da Agência (Arrecadada até Mês + Anulada até Mês), já sem o Fundeb (ICMS 2025: Deduções até Mês 3.785.925,96 = 25% da arrecadada 15.143.705,14). A soma das três unidades é igual ao "Totais" do PCMGE066 consolidado em 2024 (184.019.152,47) e 2025 (221.021.364,64). "Outras receitas" fecha com o total do Balanço (2024, 2025) e com a soma dos PCMGE016 (2026). A receita traz a contribuição da prefeitura ao IMUP (intraorçamentária, código 7): 2.430.654,16 (2024) · 7.714.407,09 (2025) · 8.004.444,52 (até set/2026).

## Notícias (conferência interna)
- Nenhum fato de obra ou serviço é dito na fala; só números do TCM. Sem notícia usada como fonte.

## Pendências
- SAAE de Serra do Ramalho (UJ 1074): prestações de 2025 e 2026 todas "Pendente" no e-TCM (não entra; nada declarado).
- Razão (PCMGE018) e PCMGE015 da Câmara de 12/2024 e razão de 09/2026 escaneados (lidos na imagem).
