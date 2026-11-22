# Fontes · 134. orçamento de Candiba

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 12/11/2026, entre 00:23 e 00:47, e estão guardados em `~/Documents/RECEITAS-DESPESAS-CANDIBA/documentos_tcm/` (PDF e texto extraído). Município CANDIBA (código 78 no e-TCM) · Prefeitura UJ 683 · Câmara UJ 111. Não há autarquia nem SAAE com prestação própria no e-TCM.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou para mil, abaixo de 1 milhão); abaixo, o valor exato. Último mês entregue em 2026: setembro (10/2026 "Pendente" no e-TCM em 12/11/2026; lista gravada em SITE-EUMAGNOLEITE/dados/prestacoes-etcm/candiba.json).

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 65.101.022,07 | 2024_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "65 milhões", mapa, chip |
| (conferência) R$ 65.106.290,02 | 2024-12_PCMGE016.pdf (Prefeitura) | p.10, "TOTAL" | Arrecadada até mês 67.528.273,98 + anulada -2.421.983,96 | folha da receita 2024 (linha de ajuste de R$ -5.267,95 ao Balanço) |
| Receita 2025: R$ 71.855.079,16 | 2025_ANUAL_PCAGO015.pdf e 2025-12_PCMGE016.pdf | p.1, "SUBTOTAL DAS RECEITAS (III)"; PCMGE016 p.10 "TOTAL" (72.198.703,25 - 343.624,09) | Receitas realizadas / Arrecadada até mês + anulada | fala "71 milhões e 900", mapa, chip |
| Receita 2026 até set: R$ 49.903.198,34 | 2026-09_PCMGE016.pdf | p.9, "TOTAL" | Arrecadada até mês 50.007.532,94 + anulada -104.334,60 | fala "49 milhões e 900", mapa, chip |
| FPM 2025: R$ 27.999.855,94 | 2025-12_PCMGE016.pdf | p.3, 1.7.1.1.51 Cota-Parte do FPM | Arrecadada até mês (já sem os 20% do Fundeb: deduções de R$ 6.065.287,98 na mesma linha) | fala "28 milhões", mapa |
| SUS 2025: R$ 10.524.829,79 = União corrente R$ 6.533.092,11 (6.569.941,50 - 36.849,39) + Estado R$ 358.749,68 (374.949,68 - 16.200,00) + União capital (Bloco de Estruturação) R$ 3.632.988,00 | 2025-12_PCMGE016.pdf | p.3 1.7.1.3; p.6 1.7.2.3; p.8 2.4.1.1 | Arrecadada até mês + anulada | fala "10 milhões e 500 para a saúde", mapa |
| Fundeb 2025: R$ 11.022.790,48 | 2025-12_PCMGE016.pdf | p.7, 1.7.5.0 | Arrecadada até mês | fala "11 milhões", mapa |
| Complementação da União ao Fundeb 2025: R$ 7.617.928,02 | 2025-12_PCMGE016.pdf | p.5, 1.7.1.5 (7.617.964,13 - 36,11) | Arrecadada até mês + anulada | fala "7 milhões e 600", mapa |
| ICMS 2025: R$ 4.686.459,33 | 2025-12_PCMGE016.pdf | p.6, 1.7.2.1.50 Cota-Parte do ICMS | Arrecadada até mês (já sem os 20% do Fundeb: deduções R$ 1.171.614,52) | fala "4 milhões e 700", mapa |
| Impostos e taxas da cidade 2025: R$ 4.246.316,63 = IPTU 14.114,20 + ITBI 89.859,56 + IR retido 2.239.324,31 + ISS 1.854.808,07 + taxas 48.210,49 | 2025-12_PCMGE016.pdf | p.1, 1.1.1.2.50, 1.1.1.2.53, 1.1.1.3, 1.1.1.4.51, 1.1.2 (saida/receita_2025.json) | Arrecadada até mês + anulada | fala "4 milhões e 200", mapa |
| IPTU 2025: R$ 14.114,20 arrecadado; previsto R$ 183.688,00 | 2025-12_PCMGE016.pdf | p.1, 1.1.1.2.50 | Receita prevista / Arrecadada até mês | fala "previa 184 mil e arrecadou 14 mil", mapa. Obs.: o Anexo 10 de 2025 (2025_ANUAL_PCAGO008) traz IPTU de R$ 12.403,35; usei o PCMGE016 (maior, a favor do município) |

Folhas de receita (item a item, soma = total do ano): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (script `scripts/receita.py`).
Conferência no Fundo Nacional de Saúde (consultafns.saude.gov.br): NÃO feita nesta rodada (o navegador ficou só para o e-TCM, regra 113). O vídeo diz só o valor que o município declarou ao TCM.

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 62.343.632,74 | 2024_ANUAL_PCAGO015.pdf | p.1, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas (empenhado 63.215.677,04) | fala "62 milhões e 300" |
| = Prefeitura R$ 60.702.454,12 + Câmara R$ 1.641.178,62 | 2024-12_PCMGE015.pdf p.73 "Total do Poder" (liquidações até mês) | Câmara = Balanço - Prefeitura (o PCMGE015 da Câmara é escaneado, sem texto) | | |
| Sobraram 2024: R$ 2.757.389,33 | conta: 2.757.389,33 = 65.101.022,07 - 62.343.632,74 (2024_ANUAL_PCAGO015.pdf p.1) | | | fala "2 milhões e 800" |
| Gastou 2025: R$ 69.730.537,98 | 2025_ANUAL_PCAGO015.pdf | p.1, "SUBTOTAL DAS DESPESAS (XI)" (o texto cola empenhada 70.975.036,85 e liquidada) | Despesas liquidadas | fala "69 milhões e 700" |
| = Prefeitura R$ 67.638.225,40 + Câmara R$ 2.092.312,58 | 2025-12_PCMGE015.pdf p.90 "Total do Poder" | Câmara = Balanço - Prefeitura | | |
| Sobraram 2025: R$ 2.124.541,18 | conta: 71.855.079,16 - 69.730.537,98 | | | fala "2 milhões e 100" |
| Gastou 2026 até set: R$ 49.783.121,50 = Prefeitura R$ 48.241.888,76 + Câmara R$ 1.541.232,74 | 2026-09_PCMGE015.pdf p.99 "Total do Poder"; Câmara: 2026-09_PCMGE065.pdf (consolidado), seção "1 CÂMARA MUNICIPAL DE CANDIBA", "Total do Poder" | | Liquidada até o mês | fala "49 milhões e 800" (empenhado até set: 66.101.012,85 + 3.119.512,19) |
| (diferença conhecida) | o PCMGE065 de set/2026 soma Executivo 36.308.673,07 + Saúde 11.913.519,31 = 48.222.192,38, R$ 19.696,38 abaixo do PCMGE015 da Prefeitura | | | usado o PCMGE015 (documento por ação) |

## Setores (função da ação, liquidado; script `scripts/setores.py`, soma = total do ano centavo a centavo)

| Setor | 2024 | 2025 | 2026 até set | Como entra |
|---|---|---|---|---|
| Educação | 21.936.363,84 | 24.063.154,54 | 17.165.928,03 | função 12 |
| Saúde | 14.679.467,22 | 16.018.594,15 | 11.914.395,18 | função 10 |
| Administração | 5.188.490,05 | 5.522.804,99 | 4.407.345,15 | funções 4, 2 (indenizações trabalhistas), 6 (manutenção da ordem pública) e 9 (contribuições ao INSS e PASEP) |
| Obras e serviços urbanos | 12.352.739,04 | 14.091.989,46 | 7.660.503,59 | funções 15 (urbanismo), 25 (iluminação pública: 1.513.921,60 / 1.622.567 / 1.428.098) e 26 (estradas e pontes) |
| Câmara de Vereadores | 1.641.178,62 | 2.092.312,58 | 1.541.232,74 | ver acima |
| Dívidas e encargos | 1.002.761,88 | 1.708.169,03 | 548.752,83 | função 28 (amortização da dívida contratada) |
| Festas e eventos | 2.978.986,43 | 3.506.924,38 | 3.955.313,25 | ação 2.117 "Comemoração de Festividades" (função 13) |
| Cultura (fora as festas) | 150.156,49 | 0,00* | 0,00* | resto da função 13 (2024: Aldir Blanc 45.109,56 + Paulo Gustavo 105.046,93) |
| Assistência social | 1.564.242,47 | 1.719.655,55 | 1.478.776,21 | função 8 |
| Água e saneamento | 348.496,26 | 474.843,33 | 478.494,66 | função 17 (rede de abastecimento de água) |
| Agricultura | 209.773,64 | 301.103,47 | 607.453,26 | função 20 (secretaria conjunta de Agricultura, Turismo e Meio Ambiente; função 18, meio ambiente, sem gasto) |
| Esporte e lazer | 290.976,80 | 230.986,50 | 24.926,60 | função 27 |

*Zero da Cultura em 2025 e 2026, conferido: nenhuma ação com "cultur", "artes", "museu", "biblioteca", "patrimônio", "Aldir" ou "Gustavo" teve liquidação fora as festividades (FCBA 0,00; Aldir Blanc dotação 0,00 em 2025 e 314.600,00 sem gasto em 2026; Paulo Gustavo 0,00). No lado da RECEITA, a "Transferência da Política Nacional Aldir Blanc" (1.7.1.9.60) previa R$ 290.310,00 em 2025 (2025-12_PCMGE016 p.6) e R$ 307.300,00 em 2026 (2026-09_PCMGE016 p.5), com arrecadação 0,00. Turismo (ação 2.162, função 20): 0,00 nos dois anos.

## Câmara (duodécimo)

| Valor exato | Documento | Onde aparece |
|---|---|---|
| 2024: recebeu R$ 2.530.215,30; devolveu R$ 875.326,01; gastou (liquidado) R$ 1.641.178,62 | 2024_CAMARA_ANUAL_PCAGE062.pdf (Demonstrativo do Fluxo Financeiro da Câmara), p.1, "Recebimento do Duodécimo" e "Devolução do Duodécimo"; gasto: Balanço - PCMGE015 | fala "recebeu 2 milhões e 500, gastou 1 milhão e 600 e devolveu 875 mil" |
| 2025: recebeu R$ 2.894.660,23; devolveu R$ 800.607,91; gastou R$ 2.092.312,58 | 2025_CAMARA_ANUAL_PCAGE062.pdf, p.1 (o texto cola os números das duas colunas; ordem conferida pela conta 2.894.660,23 - 800.607,91 = 2.094.052,32, perto do empenhado do Anexo 9, 2.094.302,82) | fala "recebeu 2 milhões e 900 e devolveu 801 mil" |
| 2026 até set: liquidado R$ 1.541.232,74 (pessoal 977.539,23, patronais 159.540,18, consultoria 189.900,00, PJ 142.560,64, consumo 32.608,69, diárias 28.420,00, PF 10.264,00, equipamento 400,00); obras e instalações empenhadas R$ 748.161,69 ainda não liquidadas | 2026-09_PCMGE065.pdf, seção da Câmara | folha da Câmara 2026 |

## Festas (achado)

| Valor exato | Documento | Onde aparece |
|---|---|---|
| 2024: previsto (dotação inicial da LOA) R$ 1.146.176,00; dotação atualizada R$ 3.768.309,00; liquidado R$ 2.978.986,43 (serviços de pessoa jurídica 2.707.971,50, dos quais 255.000,00 pela fonte 1701) | 2024-12_PCMGE015.pdf p.26, ação 2.2030.13.392.50.2.2117 | fala "previa 1 milhão e 100 em 2024 e gastou 3 milhões" |
| 2025: previsto R$ 1.792.600,00; atualizada R$ 4.983.829,60; liquidado R$ 3.506.924,38 (pessoa jurídica 3.209.249,90, dos quais 408.000,00 pela fonte 1701) | 2025-12_PCMGE015.pdf p.30 (Total do Projeto/Atividade; conferido 14/11/2026) | fala "previa 1 milhão e 800 e gastou 3 milhões e 500" |
| 2026 até set: previsto R$ 1.890.000,00; atualizada R$ 4.690.000,00; liquidado R$ 3.955.313,25 | 2026-09_PCMGE015.pdf p.32 | fala "previa 1 milhão e 900, e até setembro já foram quase 4 milhões" |
| O PDF não separa bandas e palco: tudo está em "Outros serviços de terceiros - pessoa jurídica" (3.3.90.39.99). | | o vídeo não fala de bandas nem palco |
| Comparação do fecho: assistência social 2025 R$ 1.719.655,55 x festas 2025 R$ 3.506.924,38 | acima | pergunta final |

## O que ficou de fora
- Decisões do TCM (processos, multas, denúncias): não consultadas nesta rodada (a página pede captcha, que fica com o Magno). O vídeo não fala de Tribunal além da origem dos dados.
- Notícias: nenhuma usada.

## Regra 111 (site)
- PCAGO015 de 2017 a 2025 em documentos_tcm (2017, 2018 e 2019 vieram sem código, achados pelo título "Balanço Orçamentário"; 2017 e 2018 escaneados).
- extrai_balancos.py pegou 2019, 2020, 2022, 2023 e 2024. 2017, 2018, 2021 e 2025 anotados à mão em SITE-EUMAGNOLEITE/dados/balancos_manuais.json ("CANDIBA", com página, linha e nota).

## Conferência de soma (auditoria Aline, pedido p158, 13/11/2026)
- Gastou 2026 até set R$ 49.783.121,50 é soma e não aparece escrito em nenhum PDF: Prefeitura 48.241.888,76 (2026-09_PCMGE015.pdf p. 99, "Total do Poder", Liquidações Até Mês) + Câmara 1.541.232,74 (2026-09_PCMGE065.pdf p. 68, seção da Câmara, liquidado; o mesmo valor está em 2026-09_CAMARA_PCMGE015.pdf p. 4) = 49.783.121,50. Parcelas lidas de novo nos PDFs; links certos. Número e fala sem mudança.

## Conferência de soma (auditoria Aline, pedido p241, 14/11/2026)
- Impostos e taxas 2025 R$ 4.246.316,63 = IPTU 14.114,20 + ITBI 89.859,56 + IR 2.239.324,31 (arrecadado 2.239.770,73 − anulado 446,42) + ISS 1.854.808,07 (arrecadado 1.855.220,01 − anulado 411,94) + taxas 48.210,49, 2025-12_PCMGE016.pdf. Link do site: p. 1

- Conferência 14/11 (Antônio): contas refeitas e corretas: 71.855.079,16 − 69.730.537,98 = 2.124.541,18; SUS 6.533.092,11 + 358.749,68 + 3.632.988,00 = 10.524.829,79. Parcelas ligadas ao PCAGO015 p.1 e PCMGE016 p.3/6/8.

- Auditoria 15/11 (Antônio, p633/p634): contas refeitas e corretas: 72.198.703,25 − 343.624,09 = 71.855.079,16 (PCMGE016 p.10 total e anulada; PCAGO015 p.1) e 7.617.964,13 − 36,11 = 7.617.928,02 (PCMGE016 p.5, 1.7.1.5). São valores líquidos (arrecadada − anulada), por isso não aparecem escritos.
