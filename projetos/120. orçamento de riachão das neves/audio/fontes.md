# Fontes do 120. orçamento de riachão das neves (BA)

Consulta: 11/11/2026 (downloads no e-TCM no navegador do app, com a trava própria _navegador-app.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta RIACHAO-DAS-NEVES, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-RIACHAO-DAS-NEVES/documentos_tcm/` (71 PDFs, cada um com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho dos PDFs ("RIACHAO DAS NEVES" / "RIACHÃO DAS NEVES") e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026). Dois anexos da prestação anual de 2025 (2025_PCAGO019 e 2025_PCAGO019_4) são páginas do jornal "Gazeta do Oeste" com atos oficiais, sem o nome do município no topo; não usados.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 323 (RIACHÃO DAS NEVES) · Prefeitura UJ 927 · Câmara UJ 357. Sem autarquia com prestação própria (o PCMGE015 da Prefeitura mais o da Câmara fecham com o Balanço, centavo a centavo). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/riachao-das-neves.json.
"Gastou" = despesa LIQUIDADA. Total de 2024 e 2025 = Balanço Orçamentário do município (PCAGO015). 2026 = PCMGE015 de set/2026 da Prefeitura + PCMGE015 de set/2026 da Câmara. Receita = total do Balanço (2024 e 2025) e PCMGE016 de set/2026 da Prefeitura (Arrecadada até Mês, já sem a parte do Fundeb, mais a Anulada até Mês, que é negativa).
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- Prefeitura e fundos: PCMGE015 SIGA da Prefeitura de cada ano (leitor scripts/acoes015.py; traz o subelemento: bandas 3.3.90.39.18 em 2024 e 3.3.90.39.94 em 2025). Câmara: PCMGE015 da própria Câmara (no da Prefeitura ela vem zerada).
- 2024: soma 158.002.789,98 = `2024-12_PCMGE015.pdf` p.102 · Total do Poder · Liquidações Até Mês 150.051.722,18 + `2024-12_CAMARA_PCMGE015.pdf` p.3 · Total do Poder · 7.951.067,80 = `2024_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 158.002.789,98.
- 2025: soma 171.571.451,89 = `2025-12_PCMGE015.pdf` p.115 · Total do Poder · 162.567.847,42 + `2025-12_CAMARA_PCMGE015.pdf` p.5 · 9.003.604,47 = `2025_PCAGO015.pdf` · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 171.571.451,89 (no texto do PDF as colunas saem coladas: "174.819.558,91174.819.558,91171.571.451,89167.571.437,62"; a liquidada confere com a soma de Pessoal 94.881.226,20 + Outras Despesas Correntes 71.224.738,28 + Capital 5.465.487,41, conta própria).
- 2026 (até setembro): `2026-09_PCMGE015.pdf` p.114 · Total do Poder · Liquidações Até Mês 121.166.516,79 + `2026-09_CAMARA_PCMGE015.pdf` p.4 · 6.867.664,20 = 128.034.180,99 (conta própria). Empenhado: 140.265.537,74 + 9.521.095,08 = 149.786.632,82 (conta própria).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 17 (limpeza pública, abastecimento de água, drenagem), 25 (iluminação pública), 26 e a Secretaria de Transportes (função 04, subfunção 782, transporte rodoviário: 883.283,70 em 2024, 2.729.647,35 em 2025, 1.961.263,75 até set/2026) · Administração 03 (procuradoria), 04, 06 (guarda municipal e segurança pública: 0 em 2024, 3.201.966,76 em 2025, 4.020.900,18 até set/2026) · Dívidas e encargos 28 (encargos gerais do município: amortização da dívida, = "Amortização da Dívida" do Balanço 2025, 2.548.291,06) · Assistência social 08 e 14 (a Secretaria de Políticas das Mulheres, Diversidade e Juventude: 0 / 219.996,79 / 362.015,91) · Câmara 01 · Cultura 13 sem as festas · Agricultura e meio ambiente 18, 20 e a Secretaria de Agricultura lançada na função 04 em 2026 · Esporte 27.
- Esporte: em 2024 não há ação na função 27; o esporte ficava na "Secretaria de Cultura, Esporte, Lazer e Turismo" (ação 2.2040.13.392.7.2.2065, função 13). Por isso a fala de 2024 não cita o esporte (nada de "zero").
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "GESTÃO DAS AÇÕES DE APOIO ÀS FESTAS CÍVICAS, POPULARES, RELIGIOSAS E CULTURAIS" (2.2040.13.392.7.2.2069 em 2024 e 2025; 2.2080.13.392.7.2.2069 em 2026) inteira, mais os elementos de bandas pagos em outras ações da cultura (escolhidos pelo NOME do elemento): 2024: 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical" 1.502.473,00 na ação da Secretaria de Cultura, Esporte, Lazer e Turismo (2.2040.13.392.7.2.2065, `2024-12_PCMGE015.pdf` p.16) e 96.491,00 na ação do Fundo de Cultura (2.2040.13.392.7.2.2071, p.18). 2025 e 2026: nenhum elemento de banda ou palco fora da ação de festas. "Cultura" = o resto da função 13 (secretaria, Fundo de Cultura, Lei Aldir Blanc, Lei Paulo Gustavo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Riachão das Neves arrecadou 156 milhões em 2024 | 156.442.957,09 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.7 · TOTAL: Arrecadada até Mês 156.494.554,57 + Anulada até Mês −51.597,48, conta própria) |
| 179 milhões em 2025 | 178.827.169,49 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.7 · TOTAL: 178.852.210,75 − 25.041,26, conta própria) |
| 130 milhões até setembro de 2026 | 129.583.952,55 | 2026-09_PCMGE016.pdf | p.7 · TOTAL · Arrecadada até Mês 129.633.392,28 + Anulada até Mês −49.439,73 (conta própria) |
| Em 2025, o ICMS, do Estado, mandou 65 milhões e 300 | 65.342.088,08 | 2025-12_PCMGE016.pdf | p.4 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 16.335.521,69 = 25% da arrecadada) |
| O FPM, da União, 35 milhões e 300 | 35.276.134,25 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (Deduções até Mês 7.641.464,26) |
| O Fundeb trouxe 23 milhões e 400 | 23.404.298,71 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.1.50.0.0 Transferências de Recursos do Fundeb · Arrecadada até Mês |
| e a complementação da União ao Fundeb, mais 13 milhões e 200 | 13.219.536,74 | 2025-12_PCMGE016.pdf | p.4 · 1.7.1.5.00.0.0 Transferências de Recursos de Complementação da União ao Fundeb · Arrecadada até Mês |
| E o SUS mandou 11 milhões e 800 | 11.797.361,19 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.3.00.0.0 (União) 11.326.782,96 − Anulada até Mês 22.866,80 + p.4 · 1.7.2.3.00.0.0 (Estado) 493.445,03 (soma: conta própria) |
| 2024: arrecadou 156 milhões e 400 | 156.442.957,09 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 158 milhões | 158.002.789,98 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Gastou 1 milhão e 600 a mais do que arrecadou | 1.559.832,89 | conta própria | 158.002.789,98 − 156.442.957,09 |
| 2025: arrecadou 178 milhões e 800 | 178.827.169,49 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 171 milhões e 600 | 171.571.451,89 | 2025_PCAGO015.pdf | SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 7 milhões e 300 | 7.255.717,60 | conta própria | 178.827.169,49 − 171.571.451,89 |
| 2026, até setembro: arrecadou 129 milhões e 600 | 129.583.952,55 | 2026-09_PCMGE016.pdf | p.7 · TOTAL (acima) |
| Gastou 128 milhões | 128.034.180,99 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.114 e p.4 · Total do Poder · Liquidações Até Mês (soma: conta própria) |
| Sobraram 1 milhão e 500 | 1.549.771,56 | conta própria | 129.583.952,55 − 128.034.180,99 |
| E já comprometeu 149 milhões e 800 | 149.786.632,82 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.114 e p.4 · Total do Poder · Empenhos Até Mês 140.265.537,74 + 9.521.095,08 (conta própria) |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidações Até Mês" do PCMGE015 da Prefeitura e da Câmara)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 52 e 500 · 69 e 500 · 49 e 200 | 52.487.230,85 | 69.484.257,99 | 49.212.241,30 |
| Saúde | 43 e 400 · 39 e 300 · 27 e 100 | 43.441.685,78 | 39.265.244,63 | 27.114.530,08 |
| Obras e serviços urbanos | 19 e 500 · 17 e 700 · 16 e 500 | 19.503.865,10 | 17.731.389,53 | 16.451.598,85 |
| Administração | 18 e 500 · 21 e 300 · 16 e 800 | 18.545.104,96 | 21.302.773,11 | 16.793.405,84 |
| Dívidas e encargos | 2 milhões e 100 · 2 milhões e 500 · 2 milhões e 800 | 2.107.977,45 | 2.548.291,06 | 2.776.597,03 |
| Assistência social | 5 milhões e 200 · 3 milhões e 800 · 2 milhões e 600 | 5.226.840,52 | 3.758.976,62 | 2.599.428,49 |
| Câmara de Vereadores | 8 milhões · 9 milhões · 6 milhões e 900 | 7.951.067,80 | 9.003.604,47 | 6.867.664,20 |
| Festas e eventos | 2 milhões e 800 · 5 milhões e 400 · 4 milhões e 200 | 2.833.435,00 | 5.419.725,13 | 4.157.207,50 |
| Cultura | 5 milhões e 400 · 1 milhão e 700 · 546 mil | 5.392.860,24 | 1.745.818,64 | 545.511,38 |
| Agricultura e meio ambiente | 513 mil · 1 milhão e 200 · 1 milhão e 100 | 512.722,28 | 1.229.329,15 | 1.114.350,76 |
| Esporte | (não dito em 2024) · 82 mil · 402 mil | 0,00 (ver acima) | 82.041,56 | 401.645,56 |
| **Soma** | | 158.002.789,98 | 171.571.451,89 | 128.034.180,99 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 2.833.435,00 (ação 2.2040.13.392.7.2.2069, 2024-12_PCMGE015.pdf p.17, Total do Projeto/Atividade, Liquidações até Mês 1.234.471,00 + bandas em outras ações da cultura 1.502.473,00 (p.16) + 96.491,00 (p.18))
- Festas e eventos 2025: R$ 5.419.725,13 (ação 2.2040.13.392.7.2.2069, 2025-12_PCMGE015.pdf p.20, Total do Projeto/Atividade, Liquidações até Mês)
- Festas e eventos 2026: R$ 4.157.207,50 (ação 2.2080.13.392.7.2.2069, 2026-09_PCMGE015.pdf p.37, Total do Projeto/Atividade, Liquidações até Mês, até setembro)
- Cultura 2024: R$ 5.392.860,24 · Cultura 2025: R$ 1.745.818,64 · Cultura 2026: R$ 545.511,38

## A Câmara (razão da própria Câmara, PCMGE018; duodécimo = repasse mensal da Prefeitura, comprovantes PCMGE008 da Prefeitura)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 7 milhões e 980 | 7.980.000,00 | 2024-12_CAMARA_PCMGE018.pdf | p.5 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 29 mil | 28.932,20 | 2024-12_CAMARA_PCMGE018.pdf | p.5 · 4.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês. Conferência: 7.980.000,00 − 28.932,20 = 7.951.067,80 = gasto liquidado da Câmara em 2024 (conta própria) |
| Em 2025, recebeu 9 milhões | 9.023.614,08 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 2 mil | 2.075,62 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| Até setembro de 2026, já recebeu 7 milhões e 500 | 7.495.650,92 | 2026-09_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (855.959,32 em setembro). Não há conta de devolução (3.5.1.1.2.09) no razão de 09/2026; a fala não cita devolução em 2026 |
- Gasto da Câmara (liquidado, para a folha): 7.951.067,80 (2024) · 9.003.604,47 (2025) · 6.867.664,20 (2026 até set), dos PCMGE015 da Câmara.

## As festas (ação "Gestão das ações de apoio às festas cívicas, populares, religiosas e culturais", PCMGE015 da Prefeitura)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, festas e eventos somaram 2 milhões e 800, contando as bandas pagas pela secretaria de cultura | 2.833.435,00 | 2024-12_PCMGE015.pdf | p.17 · ação 2.2040.13.392.7.2.2069 · Total do Projeto/Atividade · Liquidações até Mês 1.234.471,00 + p.16 · 3.3.90.39.18 bandas na ação da Secretaria de Cultura, Esporte, Lazer e Turismo 1.502.473,00 + p.18 · 3.3.90.39.18 bandas no Fundo de Cultura 96.491,00 (soma: conta própria) |
| Em 2025, a ação de festas previa 2 milhões e 500 | 2.469.000,00 | 2025-12_PCMGE015.pdf | p.20 · ação 2.2040.13.392.7.2.2069 · Total do Projeto/Atividade · Fixada (a lei do orçamento; alterações 3.406.200,00; total fixada 5.799.200,00) |
| Gastou 5 milhões e 400 | 5.419.725,13 | 2025-12_PCMGE015.pdf | p.20 · mesma linha · Liquidações até Mês (empenhado 5.442.225,13; bandas 3.3.90.39.94 320.000,00 e "Festividades e homenagens" 3.3.90.39.23 150.000,00 dentro dela) |
| Em 2026, previa 4 milhões e 600 | 4.567.200,00 | 2026-09_PCMGE015.pdf | p.37 · ação 2.2080.13.392.7.2.2069 · Total do Projeto/Atividade · Fixada |
| e até setembro já gastou 4 milhões e 200 | 4.157.207,50 | 2026-09_PCMGE015.pdf | p.37 · mesma linha · Liquidações até Mês (total fixada 5.557.200,00; empenhado 4.344.900,00) |
| Em 2025, os benefícios eventuais ficaram em 78 mil | 77.867,22 | 2025-12_PCMGE015.pdf | p.90 · ação 4.2061.8.244.8.2.2057 "GESTÃO DE BENEFÍCIOS EVENTUAIS" · Total do Projeto/Atividade · Liquidações até Mês (previa 32.000,00) |
| se a assistência social inteira ficou em 3 milhões e 800 | 3.758.976,62 | setores.json | Assistência social 2025: função 08 (3.538.979,83, 2025-12_PCMGE015.pdf) + função 14, Secretaria de Políticas das Mulheres (219.996,79). Conta própria |
| por que as festas levaram 5 milhões e 400 em 2025? | 5.419.725,13 | 2025-12_PCMGE015.pdf | p.20 (ação de festas, mesma linha acima; é também o setor Festas e eventos 2025 inteiro) |
- Em 2024 a ação de festas previa 2.469.000,00 e liquidou 1.234.471,00 (p.17); as bandas daquele ano foram pagas em outras ações da cultura (acima). Só na folha.

## Receita por ano (folha "PDF" de receita; scripts/receita.py → saida/receita_AAAA.json)
Itens pelo PCMGE016 da Prefeitura (Arrecadada até Mês + Anulada até Mês), já sem o Fundeb (ICMS 2025: Deduções até Mês 16.335.521,69 = 25% da arrecadada 65.342.088,08). O total do PCMGE016 de dezembro é igual ao do Balanço em 2024 (156.442.957,09) e 2025 (178.827.169,49). "Outras receitas" fecha com o total.

## Notícias (conferência interna)
- Nenhum fato de obra ou serviço é dito na fala; só números do TCM. Sem notícia usada como fonte.

## Pendências
- Prestação mensal da Prefeitura com mais de 500 documentos: os consolidados PCMGE064/065/066 não vieram no lote (não foram necessários: PCMGE015 Prefeitura + Câmara = Balanço, centavo a centavo).
- 2025_PCAGO019 e 2025_PCAGO019_4: páginas de jornal com atos oficiais, sem o nome do município no cabeçalho (não usados).
