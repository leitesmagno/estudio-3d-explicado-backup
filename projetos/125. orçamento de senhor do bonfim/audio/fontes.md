# Fontes · 125. orçamento de Senhor do Bonfim

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-SENHOR-DO-BONFIM/documentos_tcm/` (PDF e texto extraído). Município 370 SENHOR DO BONFIM · Prefeitura UJ 974 · Câmara UJ 390 (o Consórcio de Saúde da Região, UJ 511, é outra entidade e fica fora). Último mês entregue: 09/2026 (Prefeitura enviou em 03/11/2026). Nome do município conferido no cabeçalho de cada PDF usado.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil; abaixo, o valor exato.

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 314.427.792,80 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "314 milhões e 400", mapa, chip, capa do ano |
| (conferência) R$ 314.427.793,04 | 2024-12_PCMGE016.pdf | p.7, "Total da Receita" | Até Período | folha da receita 2024 (diferença de R$ 0,24 com o Balanço) |
| Receita 2025: R$ 401.250.060,72 | 2025_PCAGO015.pdf (Balanço Orçamentário 2025) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "401 milhões e 300", mapa, chip |
| (conferência) R$ 401.250.330,70 | 2025-12_PCMGE016.pdf | p.7, "Totais:" | Total até mês (arrecadada + anulada) | folha da receita 2025 (linha de ajuste de -R$ 269,98 ao Balanço) |
| Receita 2026 até set: R$ 364.340.795,76 | 2026-09_PCMGE016.pdf | p.7, "Totais:" | Total até mês | fala "364 milhões e 300", mapa, chip |
| FPM 2025: R$ 76.431.623,02 | 2025-12_PCMGE016.pdf | p.2, 1.7.1.1.51 Cota-Parte do FPM | Arrecadada até mês (já sem os R$ 16.556.507,08 do Fundeb, coluna Deduções até mês) | fala "76 milhões e 400", mapa |
| Fundeb 2025: R$ 63.948.153,93 | 2025-12_PCMGE016.pdf | p.5, 1.7.5.0 Transferências de Outras Instituições Públicas (Fundeb) | Arrecadada até mês | fala "63 milhões e 900", mapa |
| Complementação da União ao Fundeb 2025: R$ 62.378.228,55 | 2025-12_PCMGE016.pdf | p.4, 1.7.1.5.00 | Arrecadada até mês | fala "62 milhões e 400", mapa |
| SUS 2025: R$ 60.572.804,34 = União 56.851.606,43 + Estado 3.721.197,91 | 2025-12_PCMGE016.pdf (União: arrecadada 57.351.606,43 menos anulada 500.000,00; igual ao Anexo 2 do Balanço, 2025_PCAGO003.pdf, linha 1.7.1.3) | p.3, 1.7.1.3.00 e p.5, 1.7.2.3.00 | Arrecadada até mês + Anulada até mês | fala "60 milhões e 600", mapa |
| Empréstimo 2025: R$ 45.000.000,00 (arrecadado em dezembro) e Receita Prevista R$ 0,00 | 2025-12_PCMGE016.pdf | p.6, 2.1.0.0.00.0.0 Operações de Crédito | Arrecadada no mês / até mês; Receita Prevista | fala "empréstimo de 45 milhões, sem previsão de receita", mapa |
| (contexto, só no fontes) 2024: previsto R$ 20.000.000,00, entrou R$ 1.350.000,00; 2026: previsto R$ 30.000.000,00, entrou R$ 0,00 até set | 2024-12_PCMGE016.pdf (2.1) e 2026-09_PCMGE016.pdf (2.1, p.6) | linha 2.1 | Orçado / até período | folhas de receita |

Folhas de receita (item a item, soma = total do ano): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (script `scripts/receita_sdb.py`; código de cada linha no campo "codigos").

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 320.696.438,16 | 2024_PCAGO015.pdf | p.1, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas | fala "320 milhões e 700", chip |
| Gastou a mais em 2024: R$ 6.268.645,36 (conta: 320.696.438,16 - 314.427.792,80) | Balanço 2024 | conta própria | | fala "6 milhões e 300 a mais", torre vermelha |
| Prefeitura 2024 (PCMGE015): R$ 310.741.223,09 | 2024-12_PCMGE015.pdf (Demonstrativo de Despesa Analítica) | p.47, "Total :" | Liq Até Per | soma dos setores |
| Câmara 2024: R$ 7.653.006,99 | 2024-12_CAMARA_PCMGE015.pdf | p.4, "Total do Poder" | Liquidações até mês | setor Câmara 2024 |
| Ajuste Educação 2024: R$ 2.302.208,08 | 2024_PCAGO007.pdf (Anexo 9): Fundo Municipal de Educação R$ 115.028.861,35 empenhado (p.3) x PCMGE015 R$ 112.726.653,27 | conta própria: Balanço - (PCMGE015 + Câmara) = 2.302.208,08, igual no empenhado e no liquidado | | Educação 2024 = R$ 110.620.014,67 |
| Gastou 2025: R$ 346.824.539,73 | 2025_PCAGO015.pdf | p.1, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas | fala "346 milhões e 800" |
| = Prefeitura R$ 337.489.477,49 + Câmara R$ 9.335.062,24 | 2025-12_PCMGE015.pdf p.52 "Total :" (Liq Até Per) e 2025-12_CAMARA_PCMGE015.pdf p.4 "Total do Poder" | | | bate centavo a centavo com o Balanço |
| Sobraram 2025: R$ 54.425.520,99 (conta: 401.250.060,72 - 346.824.539,73; inclui o empréstimo) | Balanço 2025 | conta própria | | fala "54 milhões e 400", torre verde |
| Gastou 2026 até set: R$ 297.277.706,54 = Prefeitura R$ 289.866.352,66 + Câmara R$ 7.411.353,88 | 2026-09_PCMGE015.pdf p.208 "Total do Poder" (a Câmara aparece zerada nesse PDF) e 2026-09_CAMARA_PCMGE015.pdf p.4 "Total do Poder" | | Liquidada até mês | fala "297 milhões e 300" |
| Sobraram até set/2026: R$ 67.063.089,22 (conta: 364.340.795,76 - 297.277.706,54) | | conta própria | | só na tela (chip e torre verde) |

## Setores (liquidado; setor pela função da ação; script `scripts/setores.py`, resultado `saida/setores.json`)

Regra do setor: função 12 Educação, 10 Saúde, 8 Assistência social, 28 Dívidas e encargos, 27 Esporte, 18 e 20 Agricultura e meio ambiente, 15, 17 e 26 mais a Secretaria de Infraestrutura (unidade 1101) Obras e serviços urbanos, 13 Cultura (menos as festas), o resto Administração (inclui a guarda municipal, função 6). Festas e eventos (regra 99) = a ação "Promoção de eventos culturais" (2024 e 2025) / "Realizações e apoio de eventos culturais e comemorativos" (2026) inteira + bandas em outra ação da Cultura (2026). Eventos esportivos, educacionais e agropecuários ficam nos seus setores.

| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 110.620.014,67 (com o ajuste) | 144.242.499,00 | 117.265.713,37 |
| Saúde | 97.419.706,85 | 100.605.072,75 | 79.865.281,99 |
| Obras e serviços urbanos | 52.121.731,84 | 38.172.800,78 | 42.757.477,28 |
| Administração | 20.093.137,99 | 18.220.885,40 | 15.594.244,51 |
| Dívidas e encargos | 9.058.871,53 | 14.800.303,74 | 13.449.683,63 |
| Assistência social | 8.960.186,86 | 9.698.236,57 | 6.776.126,56 |
| Câmara de Vereadores | 7.653.006,99 | 9.335.062,24 | 7.411.353,88 |
| Festas e eventos | 10.770.652,61 | 8.491.226,72 | 11.792.568,50 |
| Cultura | 944.984,62 | 1.112.702,64 | 510.889,26 |
| Agricultura e meio ambiente | 1.793.531,51 | 1.612.412,56 | 1.506.544,17 |
| Esporte | 1.260.612,69 | 533.337,33 | 347.823,39 |
| Soma | 320.696.438,16 | 346.824.539,73 | 297.277.706,54 |

Documentos: 2024-12_PCMGE015.pdf, 2025-12_PCMGE015.pdf, 2026-09_PCMGE015.pdf (Prefeitura) e os PCMGE015 da Câmara dos mesmos meses. Ação por ação (com página) em `saida/a015_<mês>.json`. Onde aparece: fala de cada setor, plaquinhas das casinhas e folhas por setor.

## Empréstimo na pavimentação

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| R$ 11.232.415,52 = 8.077.554,06 + 88.652,52 + 149.800,30 (fonte 1754, operação de crédito do ano) + 2.687.806,60 + 228.602,04 (fonte 2754, operação de crédito de anos anteriores) | 2026-09_PCMGE015.pdf | p.170 e 171, ação 11.1101.15.451.13.1.1084 PAVIMENTAÇÃO DE VIAS, elementos 4.4.90.51.91, 4.4.90.92.51 e 4.4.93.51.99 | Liquidada até mês | fala "11 milhões e 200 do empréstimo de 2025", chip |
| (contexto) 2025: dotação com fonte 1754 = R$ 45.028.693,00 (centro administrativo 17,5 mi, pavimentação e drenagem 7,5 mi, pontes 7,5 mi, iluminação 5 mi, frota 2,75 mi, praças 2,5 mi), liquidado R$ 1.933.750,02 nas fontes 1753/1754/2754 | 2025-12_PCMGE015.pdf | unidade 1101 e 0502 | Atualizada / Liq Até Per | só no fontes |

## Câmara (razão da Câmara, PCMGE018)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| 2024: recebeu R$ 8.295.485,98, devolveu R$ 425.000,00, gastou R$ 7.653.006,99 | 2024-12_CAMARA_PCMGE018.pdf p.6, 4.5.1.1.2.02.00 REPASSE RECEBIDO (Creditado até o mês) e 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS (Debitado até o mês) | | | só na folha da Câmara 2024 |
| 2025: recebeu R$ 9.589.288,66 | 2025-12_CAMARA_PCMGE018.pdf | p.7, 4.5.1.1.2.02.00 REPASSE RECEBIDO | Creditado até o mês | fala "recebeu 9 milhões e 600", gaveta |
| 2025: devolveu R$ 254.185,74 | 2025-12_CAMARA_PCMGE018.pdf | p.6, 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS | Debitado até o mês | fala "devolveu 254 mil" |
| 2025: gastou R$ 9.335.062,24 | 2025-12_CAMARA_PCMGE015.pdf | p.4, Total do Poder | Liquidações até mês | fala "gastou 9 milhões e 300" |
| 2026 até set: recebeu R$ 8.296.595,45 | 2026-09_CAMARA_PCMGE018.pdf | p.6, 4.5.1.1.2.02.00 REPASSE RECEBIDO | Saldo atual credor / creditado até o mês | fala "já recebeu 8 milhões e 300" |
| 2026 até set: gastou R$ 7.411.353,88 | 2026-09_CAMARA_PCMGE015.pdf | p.4, Total do Poder | Liquidações até mês | fala "gastou 7 milhões e 400" |
| 2026: devolução de R$ 200.000,00 registrada | 2026-09_CAMARA_PCMGE018.pdf | p.6, 3.5.1.1.2.09.00 | Debitado até o mês | só na folha |

## Festas e eventos

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| 2024 previsto R$ 3.246.566,00 · gasto R$ 10.770.652,61 | 2024-12_PCMGE015.pdf | p.45, 1201.13.392 ação 2059 PROMOÇÃO DE EVENTOS CULTURAIS, "Total da ação" | Fixada / Liq Até Per | fala "previa 3 milhões e 200 ... gastou 10 milhões e 800", gaveta |
| 2025 previsto R$ 6.847.403,00 · gasto R$ 8.491.226,72 | 2025-12_PCMGE015.pdf | p.47, ação 2059 PROMOÇÃO DE EVENTOS CULTURAIS, "Total da ação" | Fixada / Liq Até Per | fala "previa 6 milhões e 800 e gastou 8 milhões e 500" |
| 2026 até set gasto R$ 11.762.568,50 (previsto R$ 12.423.674,00) | 2026-09_PCMGE015.pdf | p.193-194, 12.1201.13.392.6.2.2119 REALIZAÇÕES E APOIO DE EVENTOS CULTURAIS E COMEMORATIVOS | Liquidada até mês | fala "já gastou 11 milhões e 800", pergunta final, capa |
| Bandas 2026 até set: R$ 8.583.934,89 = 6.804.254,89 (fonte 1500) + 1.118.680,00 (1501) + 631.000,00 (1701) na ação 2119 + 30.000,00 na ação 2120 | 2026-09_PCMGE015.pdf | p.193-194, elemento 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL | Liquidada até mês | fala "só com bandas, 8 milhões e 600" |
| Palco 2026: R$ 834.566,21 (3.3.90.39.95) | 2026-09_PCMGE015.pdf | p.193, ação 2119 | Liquidada até mês | folha |
| 2024 e 2025: o PCMGE015 desse sistema não traz subelemento, então não separa bandas e palco (folha diz isso) | | | | folhas 2024 e 2025 |
| Assistência social até set/2026: R$ 6.776.126,56 | setores.json (função 8 do 2026-09_PCMGE015.pdf) | | Liquidada até mês | pergunta final, capa |

## Pendências e observações
- Câmara 2024 fica só na folha (não cabe na fala dos 3 minutos).
- Nada de nome de gestor no vídeo. Assinaturas dos PDFs não citadas.
- Notícias: não usadas como fonte de fato.
