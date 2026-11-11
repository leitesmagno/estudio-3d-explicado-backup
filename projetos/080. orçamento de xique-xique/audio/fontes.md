# Fontes do 080. orçamento de xique-xique (BA)

Consulta: 11/11/2026, de ~01:35 a ~02:20 (downloads no e-TCM pelo Google Chrome, aba própria fechada no fim, recebedor 127.0.0.1:8778, pasta XIQUE-XIQUE, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-XIQUE-XIQUE/documentos_tcm/`. Município e competência conferidos no cabeçalho de cada PDF.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 417 (XIQUE-XIQUE) · Prefeitura UJ 1021 · Câmara UJ 450 · SAAE UJ 1071 (Serviço Autônomo de Água e Esgoto) · Agência Reguladora de Saneamento Básico UJ 1. A Fundação Mun. do Ensino Superior (562) e a Empresa de Produção Alimentícia (529) não têm prestação mensal em 2026. Último mês entregue: 09/2026 (10/2026 "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total do documento consolidado do município. 2024 e 2025: o Balanço Orçamentário (Anexo 12, "MUNICÍPIO DE XIQUE-XIQUE") já soma Prefeitura, Câmara, SAAE, Agência Reguladora e Fundação Parque Aquático. 2026: somei as unidades (Prefeitura + Câmara + Agência + SAAE).
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026 ~02:40, cada número contra saida/setores.json, saida/receita_*.json e os PDFs); 2ª antes do vídeo final (ver o fim deste arquivo).

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: `2024-12_PCMGE065.pdf` (Demonstrativo Consolidado, todas as unidades), p.80 · TOTAL · Liquidada até o Mês 240.856.501,51 = Balanço `2024_PCAGO015.pdf` p.2 (SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas). O PCMGE015 da Prefeitura (235.192.663,23) não traz Câmara, SAAE, Agência e Fundação.
- 2025: `2025-12_PCMGE015.pdf` (vem como "Demonstrativo Consolidado da Despesa", todas as unidades), 258 ações, liquidado 248.610.849,19 = Balanço `2025_PCAGO015.pdf` p.2 (SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas). O PCMGE065 de 12/2025 é só da Prefeitura (241.859.327,47).
- 2026 (até setembro): Prefeitura 188.980.316,39 (`2026-09_PCMGE015.pdf` p.117, Total do Poder, Liquidações Até Mês) + Câmara 4.764.416,09 (`2026-09_CAMARA_PCMGE015.pdf` p.6, Total do Poder) + Agência Reguladora 226.710,90 (`2026-09_AGENCIA_despesa.pdf` p.4, Total do Poder; arquivo veio em "Documentos Adicionais", SIGA_Demonstrativo da Despesa Orçamentária) + SAAE 98.108,48 (`2026-09_SAAE_PCMGE015.pdf` p.3, ESCANEADO, lido na imagem: Resumo, Liquidada Até o Mês, Total) = 194.069.551,86 (conta própria).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Administração 04, 03, 06, 99 · Obras e serviços urbanos 15, 16, 25, 26 · Dívidas e encargos 28 · Assistência social 08, 14 · Água e saneamento 17 + SAAE (unidade 16.1601) + Agência Reguladora de Saneamento (unidade 6.602), que o Anexo 9 põe em Administração · Câmara = unidade 1.101 / PCMGE015 da Câmara · Cultura 13 e 23 sem as festas · Agricultura e meio ambiente 18, 20 · Esporte 27.
- "Água e saneamento": a função 17 (Saneamento) de Xique-Xique tem só a limpeza pública/urbana (14.1401.17.512, 2024 4.684.661,23; 2025 5.199.895,75; 2026 2.861.054,76), que é saneamento básico pela Lei 11.445/2007 (art. 3º, I, c: limpeza urbana e manejo de resíduos sólidos); somadas a ela as unidades do SAAE e da Agência Reguladora de Saneamento Básico. A folha do setor mostra cada parte.
- Regra 99 (Festas e eventos x Cultura): "Festas e eventos" = ação "REALIZACAO DE EVENTOS CULTURAIS E COMEMORATIVOS" (2024: 8.802.13.392.4.2.2038, `2024-12_PCMGE065.pdf` p.38; 2025: 8.802.13.392.4.2.2038, `2025-12_PCMGE015.pdf` p.36; 2026: 8.801.13.392.11.2.2309, `2026-09_PCMGE015.pdf` p.25). Nenhum elemento de bandas (3.3.90.39.94) ou palco (3.3.90.39.95) fora dessa ação. "Cultura" = o resto da função 13 (fomento às atividades artísticas, audiovisual, manutenção da secretaria). As ações de "eventos" esportivos, educacionais, de saúde e de educação ambiental não são festa (todas com R$ 0,00 liquidado).
- Festas e eventos 2024: R$ 2.435.022,15 (ação 2038 inteira)
- Festas e eventos 2025: R$ 2.977.009,03 (ação 2038 inteira)
- Festas e eventos 2026: R$ 4.143.788,19 (ação 2309 inteira, até setembro)
- Cultura 2024: R$ 735.511,87 · Cultura 2025: R$ 324.595,06 · Cultura 2026: R$ 43.740,00

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Xique-Xique arrecadou 232 milhões e 800 em 2024 | 232.775.379,58 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.10, Totais) |
| 259 milhões e 700 em 2025 | 259.655.485,17 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.9, Totais) |
| 197 milhões e 800 até setembro de 2026 | 197.848.226,47 | 2026-09_PCMGE016.pdf ("Município: XIQUE-XIQUE", inclui SAAE e Agência) | p.9 · Totais · Arrecadação até o Mês 197.848.414,91 + Anulada até o Mês −188,44 |
| Em 2025, o Fundeb trouxe 61 milhões e 200 | 61.223.644,67 | 2025-12_PCMGE016.pdf | p.7 · 1.7.5.1.50.0.1 Transferências de Recursos do Fundeb · Arrecadação até o Mês 61.234.272,35 + restituição −10.627,68 |
| O FPM, 58 milhões e 800 | 58.793.556,21 | 2025-12_PCMGE016.pdf | p.4 · 1.7.1.1.51.1.1 (63.678.875,06 − dedução do Fundeb 12.735.774,58) + 1.7.1.1.51.2.1 (7.850.455,73) (conta própria) |
| A União completou o Fundeb com 49 milhões | 48.957.783,17 | 2025-12_PCMGE016.pdf | p.6 · 1.7.1.5.50.0.1 (26.751.484,71) + 1.7.1.5.51.0.1 (20.344.034,94 − 200,64) + 1.7.1.5.52.0.1 (1.981.919,89 − 119.455,73) (conta própria) |
| O imposto sobre serviços, 6 milhões e 500 | 6.470.013,71 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.4.51.1.1 (6.349.770,18 − 6.831,80) + 1.1.1.4.51.1.2 (127.075,33) (conta própria) |
| 2024: gastou 240 milhões e 900 | 240.856.501,51 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.80) |
| 8 milhões e 100 a mais | 8.081.121,93 | conta própria | 240.856.501,51 − 232.775.379,58 |
| O próprio balanço chama isso de déficit | 8.251.800,27 | 2024_PCAGO015.pdf | p.1 · DÉFICIT (VI) · Receitas Realizadas (o Balanço calcula pelo empenhado 241.027.179,85) |
| 2025: gastou 248 milhões e 600 | 248.610.849,19 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 11 milhões | 11.044.635,98 | conta própria | 259.655.485,17 − 248.610.849,19 |
| 2026, até setembro: gastou 194 milhões e 100 | 194.069.551,86 | soma de 4 PDFs (ver acima) | Liquidações até o Mês |
| Sobraram 3 milhões e 800 | 3.778.674,61 | conta própria | 197.848.226,47 − 194.069.551,86 |
| já comprometeu 243 milhões e 300, mais do que entrou | 243.315.819,32 | 2026-09_PCMGE015.pdf p.117 (236.108.678,08) + 2026-09_CAMARA_PCMGE015.pdf p.6 (6.690.187,60) + 2026-09_AGENCIA_despesa.pdf p.4 (388.380,04) + 2026-09_SAAE_PCMGE015.pdf p.3 (128.573,60, imagem) | Total do Poder · Empenhos Até Mês (conta própria) |

## Setores (soma = total do ano; conta própria em saida/setores.json; liquidado de cada ação na coluna "Liquidada/Liquidações até o Mês")
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 125 e 100 · 130 e 500 · 101 e 700 | 125.097.167,60 | 130.529.310,80 | 101.748.353,17 |
| Saúde | 51 e 100 · 53 e 500 · 43 e 100 | 51.091.445,24 | 53.463.791,83 | 43.136.025,18 |
| Administração | 22 e 200 · 20 e 900 · 19 e 800 | 22.229.026,60 | 20.893.945,53 | 19.750.953,18 |
| Obras e serviços urbanos | 10 e 300 · 11 e 900 · 4 e 300 | 10.263.409,10 | 11.888.710,30 | 4.315.918,65 |
| Dívidas e encargos | 8 e 600 · 8 e 300 · 6 e 300 | 8.625.584,17 | 8.254.211,31 | 6.292.650,93 |
| Assistência social | 7 e 700 · 6 e 800 · 5 e 400 | 7.716.478,28 | 6.765.273,87 | 5.358.610,29 |
| Água e saneamento | 5 e 100 · 5 e 700 · 3 e 200 | 5.082.002,05 | 5.684.456,04 | 3.185.874,14 |
| Câmara de Vereadores | 5 e 200 · 6 e 100 · 4 e 800 | 5.169.657,84 | 6.109.293,13 | 4.764.416,09 |
| Festas e eventos | 2 e 400 · quase 3 milhões · 4 e 100 | 2.435.022,15 | 2.977.009,03 | 4.143.788,19 |
| Cultura | 736 mil · 325 mil · 44 mil | 735.511,87 | 324.595,06 | 43.740,00 |
| Agricultura e meio ambiente | 1 e 500 · 370 mil · 944 mil | 1.537.341,64 | 369.714,32 | 943.914,12 |
| Esporte | 874 mil · 1 e 400 · 385 mil | 873.854,97 | 1.350.537,97 | 385.307,92 |
| **Soma** | | 240.856.501,51 | 248.610.849,19 | 194.069.551,86 |

## Folhas de receita (só na tela, não faladas; soma de cada folha = total do ano, centavo a centavo; leitor scripts/rec_folhas.py + scripts/receita.py, valor = arrecadação até o mês + anulada até o mês, deduções do Fundeb já descontadas)
- Receita 2024 (folha da tela, `2024-12_PCMGE066.pdf`, soma = 232.775.379,58): IPTU 1.118.250,36; ITBI 1.335.429,75; Imposto de renda retido 7.141.066,07; ISS 8.116.871,41; Taxas 1.339.657,19; Iluminação pública (COSIP) 1.469.375,26; Rendimentos de aplicações 1.272.578,98; FPM (já sem a parte do Fundeb) 52.735.521,96; Royalties (petróleo, minérios e água) 1.806.097,97; SUS (União e Estado) 22.989.612,22; FNDE (merenda, transporte, salário-educação) 8.191.988,58; Complementação da União ao Fundeb 46.105.548,05; Assistência social (União e Estado) 2.388.012,37; ICMS (já sem a parte do Fundeb) 15.418.417,22; IPVA (já sem a parte do Fundeb) 1.392.921,44; Fundeb (retorno) 56.978.323,93; Convênios e emendas 1.987.818,21; Água e esgoto (SAAE) 72.558,59; Outras receitas 915.330,02
- Receita 2025 (folha da tela, `2025-12_PCMGE016.pdf`, soma = 259.655.485,17): IPTU 1.235.516,05; ITBI 512.469,25; Imposto de renda retido 8.669.024,20; ISS 6.470.013,71; Taxas 1.300.184,26; Iluminação pública (COSIP) 1.451.272,96; Rendimentos de aplicações 1.958.479,80; FPM (já sem a parte do Fundeb) 58.793.556,21; Royalties (petróleo, minérios e água) 1.853.866,53; SUS (União e Estado) 29.492.188,20; FNDE (merenda, transporte, salário-educação) 8.637.947,49; Complementação da União ao Fundeb 48.957.783,17; Assistência social (União e Estado) 2.008.062,33; ICMS (já sem a parte do Fundeb) 20.804.258,73; IPVA (já sem a parte do Fundeb) 1.513.191,41; Fundeb (retorno) 61.223.644,67; Convênios e emendas 4.025.547,18; Água e esgoto (SAAE) 150.698,61; Outras receitas 597.780,41
- Receita 2026 (folha da tela, `2026-09_PCMGE016.pdf`, soma = 197.848.226,47): IPTU 999.532,50; ITBI 504.282,77; Imposto de renda retido 1.008.265,56; ISS 4.539.395,63; Taxas 1.120.395,87; Iluminação pública (COSIP) 1.007.947,24; Rendimentos de aplicações 2.099.572,64; FPM (já sem a parte do Fundeb) 46.998.293,65; Royalties (petróleo, minérios e água) 1.635.441,55; SUS (União e Estado) 31.008.217,12; FNDE (merenda, transporte, salário-educação) 7.292.346,35; Complementação da União ao Fundeb 34.467.495,23; Assistência social (União e Estado) 1.311.120,45; ICMS (já sem a parte do Fundeb) 18.241.368,84; IPVA (já sem a parte do Fundeb) 1.230.699,45; Fundeb (retorno) 41.401.351,38; Convênios e emendas 2.543.981,93; Água e esgoto (SAAE) 89.302,88; Outras receitas 349.215,43

## A Câmara
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 6 milhões e 400 da prefeitura | 6.416.513,90 | 2024-12_CAMARA_PCMGE018.pdf | p.10 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês |
| devolveu 1 milhão e 100 | 1.071.513,36 | 2024-12_CAMARA_PCMGE018.pdf | p.9 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado Até o Mês (= 2024-12_PCMGE018.pdf da Prefeitura p.22, 4.5.1.1.2.09.00, Creditado Até o Mês) |
| e gastou 5 milhões e 200 | 5.169.657,84 | 2024-12_CAMARA_PCMGE015.pdf | p.4 · Total do Poder · Liquidações Até Mês |
| Em 2025, recebeu 7 milhões e 300 | 7.338.313,07 | 2025-12_CAMARA_PCMGE018.pdf | p.9 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês |
| devolveu 1 milhão e 200 | 1.229.019,94 | 2025-12_CAMARA_PCMGE018.pdf | p.9 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado Até o Mês (= 2025-12_PCMGE018.pdf da Prefeitura p.22, Creditado Até o Mês) |
| e gastou 6 milhões e 100 | 6.109.293,13 | 2025-12_CAMARA_PCMGE015.pdf | p.6 · Total do Poder · Liquidações Até Mês |
| (folha) 2026: recebeu até setembro | 5.055.000,00 | 2026-09_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo Atual Credor |
| Consultoria: 220 mil em 2024 | 220.061,52 | 2024-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.00 Serviços de Consultoria (35.01 contábil 93.411,24 + 35.02 administrativa 15.600,00 + 35.03 jurídica 111.050,28) · Liquidações Até Mês |
| 273 mil em 2025 | 272.540,28 | 2025-12_CAMARA_PCMGE015.pdf | p.3 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica 256.940,28 + 3.3.90.35.99 Outros serviços de consultoria 15.600,00 · Liquidações Até Mês |
| e 282 mil só até setembro de 2026 | 281.768,45 | 2026-09_CAMARA_PCMGE015.pdf | p.3 · 3.3.90.35.01 249.768,45 + 3.3.90.35.99 32.000,00 · Liquidações Até Mês (empenhado 333.024,60 + 48.000,00) |

## As festas e a ajuda de emergência
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| A ação de eventos culturais gastou 2 milhões e 400 em 2024 | 2.435.022,15 | 2024-12_PCMGE065.pdf | p.38 · 8.802.13.392.4.2.2038 REALIZACAO DE EVENTOS CULTURAIS E COMEMORATIVOS · Liquidada até o Mês (previsto 2.450.000,00) |
| e quase 3 milhões em 2025 | 2.977.009,03 | 2025-12_PCMGE015.pdf | p.36 · 8.802.13.392.4.2.2038 · Liquidada até o Mês (previsto 3.115.000,00) |
| Em 2026, só até setembro, já foram 4 milhões e 100 | 4.143.788,19 | 2026-09_PCMGE015.pdf | p.25 · 8.801.13.392.11.2.2309 REALIZACOES DE EVENTOS CULTURAIS E COMEMORATIVOS · Liquidações Até Mês (previsto 4.000.000,00; dotação atual 4.440.000,00; empenhado 4.414.449,00) |
| 2 milhões e 100 em bandas | 2.085.385,00 | 2026-09_PCMGE015.pdf | p.25 · 3.3.90.39.94 Serviços de banda ou grupo musical ou profissional (fonte 1500) · Liquidações Até Mês |
| e 1 milhão e 700 em palco e cenário | 1.700.509,19 | 2026-09_PCMGE015.pdf | p.25 · 3.3.90.39.95 Locação, confecção e montagem de cenários, palcos (fonte 1500) · Liquidações Até Mês |
| A ajuda de emergência para as famílias ficou em 262 mil (até setembro de 2026) | 262.402,36 | 2026-09_PCMGE015.pdf | p.76 · 10.1002.8.244.5.2.2081 BENEFICIOS EVENTUAIS DA ASSISTENCIA SOCIAL · Liquidações Até Mês |
| (legenda) benefícios eventuais 2024 e 2025 | 554.334,11 e 310.212,15 | 2024-12_PCMGE065.pdf p.49 e 2025-12_PCMGE015.pdf p.45 | 10.1001.8.244.8.2.2054 BENEFICIOS EVENTUAIS DA ASSISTENCIA SOCIAL · Liquidada até o Mês |

## Notícias
Nenhum fato de obra ou serviço é citado na fala; nada a conferir em notícia.

## Pendências e observações
- PCMGE015 e PCMGE016 do SAAE (12/2024, 12/2025, 09/2026) são escaneados. Em 2024 e 2025 o SAAE já está no consolidado (unidade 16.1601); em 2026, total lido na imagem.
- A prestação 09/2026 da Agência Reguladora não tem PCMGE015/016 classificados: os demonstrativos vieram em "Documentos Adicionais" (SIGA_Demonstrativo da Despesa/Receita Orçamentária, competência 09/2026, conferido no cabeçalho).
- PCMGE065 de 12/2025 e 09/2026 é só da Prefeitura (Contabilis); o consolidado de 12/2025 veio como PCMGE015.

## 2ª conferência (11/11/2026 ~02:50, antes da entrega)
Cada setor falado conferido de novo contra saida/setores.json (36 de 36 ok); totais, Câmara, consultoria, festas, bandas, palco e benefícios eventuais conferidos de novo nas páginas citadas acima. Capa ("Bandas 2026: R$ 2,1 mi. Ajuda social: R$ 262 mil.") e legenda usam só números desta lista.
