# Fontes do 103. orçamento de itapebi (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 05:42 e 05:55, pelo recebedor 127.0.0.1:8778, pasta ITAPEBI, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITAPEBI/documentos_tcm/` (45 PDFs, todos com "ITAPEBI" conferido no texto).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 193 (ITAPEBI) · Prefeitura UJ 797 · Câmara UJ 225 (sem autarquia com prestação própria; o Fundo Municipal de Saúde e o de Assistência Social vêm no consolidado). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara). IBGE 2916302.
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário de 2024 e 2025; em 2026, Demonstrativo da Receita até setembro), como o documento traz.
Despesa por setor (soma das ações = total do ano, diferença 0,00; scripts/setores_itapebi.py → saida/setores.json):
- 2024: o `2024-12_PCMGE065.pdf` (consolidado) veio INCOMPLETO no e-TCM (62.315.871,42 liquidados contra 62.824.868,30 do Balanço: faltam 407.649,06 da Câmara, 85.755,82 da Educação e 15.592,00 da Saúde). Usado o `2024-12_PCMGE015.pdf` da Prefeitura (SIGA; a ação 2.2055 de Obras sai 31.642,10 menor nele, então a função 15 veio do PCMGE065, que bate com o Anexo IX) + `2024-12_CAMARA_PCMGE015.pdf` (2.441.129,49, p.3). Soma = 62.824.868,30 = Anexo IX (`2024_PCAGO007.pdf`, Total Geral p.4) = Balanço 2024, função por função.
- 2025: `2025-12_PCMGE065.pdf` (Demonstrativo Consolidado da Despesa, SIGA, Prefeitura + Câmara + Fundo de Saúde): liquidado 73.359.827,12 (p.88) = Balanço 2025.
- 2026: `2026-09_PCMGE065.pdf` (consolidado até setembro): liquidado 56.665.437,62, empenhado 67.686.931,59 (p.60). Igual a `2026-09_PCMGE015.pdf` da Prefeitura (54.561.367,56) + `2026-09_CAMARA_PCMGE015.pdf` (2.104.070,06).
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 26 (transporte e estradas) · Administração 02 + 03 + 04 + 06 + 23 (procuradoria, governo, administração, finanças, segurança, indústria, comércio e turismo; PASEP está aqui) · Dívidas 28 + subfunção 843 (em 2026 a ação 1.3001 "Gestão de dívidas, sentenças e obrigações tributárias" está na função 04) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json, receita_*.json, acoes_*.json); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/achar.py; as somas estão marcadas como conta própria).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 63 milhões e 700 em 2024 | 63.708.044,43 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (igual ao Total Geral do 2024_PCAGO008.pdf, Anexo 10, p.10) |
| gastou 62 milhões e 800 em 2024 | 62.824.868,30 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= Anexo IX, Total Geral, 2024_PCAGO007.pdf p.4) |
| sobraram 883 mil em 2024 | 883.176,13 | conta própria | 63.708.044,43 − 62.824.868,30 |
| arrecadou 69 milhões e 400 em 2025 | 69.376.623,01 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (igual ao 2025_PCAGO008.pdf p.9 e ao 2025-12_PCMGE066.pdf: 69.456.747,10 − 80.124,09 anulados) |
| gastou 73 milhões e 400 em 2025 | 73.359.827,12 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.88) |
| quase 4 milhões a mais em 2025 | 3.983.204,11 | conta própria | 73.359.827,12 − 69.376.623,01 |
| arrecadou 58 milhões e 400 até setembro de 2026 | 58.367.184,02 | 2026-09_PCMGE016.pdf (Demonstrativo da Receita, Prefeitura) | p.8 · Totais · Arrecadado até o mês líquido (58.395.044,50 arrecadada − 27.860,48 anulada) |
| gastou 56 milhões e 700 até setembro de 2026 | 56.665.437,62 | 2026-09_PCMGE065.pdf | p.60 · Total Geral · Liquidada até o mês |
| sobraram 1 milhão e 700 | 1.701.746,40 | conta própria | 58.367.184,02 − 56.665.437,62 |
| já comprometeu 67 milhões e 700 | 67.686.931,59 | 2026-09_PCMGE065.pdf | p.60 · Total Geral · Empenhada até o mês |

## Receita por ano (folha "PDF", não falada; scripts/receita_itapebi.py → saida/receita_AAAA.json)
2024: Anexo 10 (`2024_PCAGO008.pdf`, coluna Arrecadado, Total Geral 63.708.044,43 = Balanço). 2025: Anexo 10 (`2025_PCAGO008.pdf`, 69.376.623,01 = Balanço). Nos dois, FPM, ICMS e IPVA aparecem brutos e foram deixados líquidos com as deduções do Fundeb do mesmo anexo (9.1.7.1.15.1 FPM: 4.528.183,54 em 2024 e 4.801.686,24 em 2025; 9.1.7.2.15.0 ICMS: 2.162.071,10 e 2.317.466,51; 9.1.7.2.15.1 IPVA: 63.634,19 e 71.933,01). 2026: `2026-09_PCMGE016.pdf` (Arrecadada até o mês, já líquida, + anulações). Grupos por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties 1.7.1.2 + 1.7.2.2 (usina hidrelétrica, minérios e petróleo; em 2026 os do petróleo chegam pelo Estado, 1.7.2.2.52), SUS 1.7.1.3 + 1.7.2.3 + 2.4.1.1, FNDE 1.7.1.4, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, convênios e emendas 1.7.1.7 + 1.7.1.9 + 1.7.2.4 + 2.4.1.4 + 2.4.1.9 + 2.4.2); "Outras receitas" fecha o total.

## Setores (soma = total do ano, diferença 0,00)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (Anexo IX, 2024_PCAGO007.pdf) | 2025 (2025-12_PCMGE065.pdf, soma das ações: conta própria) | 2026 até set (2026-09_PCMGE065.pdf, soma das ações: conta própria) |
|---|---|---|---|---|
| Educação | 19 e 200 · 22 e 500 · 18 e 600 | 19.156.093,98 (função 12, p.2) | 22.527.649,68 | 18.562.392,38 |
| Saúde | 11 e 400 · 13 e 700 · 10 e 700 | 11.356.682,72 (função 10, p.1) | 13.665.849,79 | 10.718.319,89 |
| Obras e serviços urbanos | 8 e 400 · 6 e 400 · 6 e 300 | 8.381.053,92 (funções 15 + 26: 8.187.205,10 p.2 + 193.848,82 p.3) | 6.410.120,74 | 6.349.345,81 |
| Administração | 10 e 700 · 15 e 700 · 12 e 900 | 10.708.913,52 (funções 04 + 03: 10.488.387,80 + 220.525,72, p.1) | 15.660.274,90 | 12.915.287,49 |
| Dívidas | 5 e 300 · 5 e 500 · 1 e 400 | 5.288.540,75 (função 28, p.4) | 5.459.309,85 (ação 1.8888 Parcelamento e amortização de dívidas: principal 4.563.369,79 + sentenças judiciais 895.940,06) | 1.358.454,81 (ação 1.3001, subfunção 843: principal 765.159,48 + obrigações tributárias e contributivas 593.295,33) |
| Assistência social | 2 e 500 · 2 e 500 · 1 e 200 | 2.516.990,93 (função 08, p.1) | 2.488.214,95 | 1.179.990,95 |
| Câmara de Vereadores | 2 e 400 · 2 e 700 · 2 e 100 | 2.441.129,49 (função 01, p.1; = 2024-12_CAMARA_PCMGE015.pdf p.3) | 2.662.030,99 (= 2025-12_CAMARA_PCMGE015.pdf p.3, Total da Unidade) | 2.104.070,06 (= 2026-09_CAMARA_PCMGE015.pdf p.1) |
| Cultura e festas | 2 e 300 · 4 e 300 · 3 e 200 | 2.277.007,60 (função 13, p.2) | 4.289.255,45 | 3.198.577,87 |
| Agricultura e meio ambiente | 491 mil · 115 mil · 131 mil | 490.946,71 (função 20, p.3) | 115.394,47 (ação 2.2065, só salários, p.12) | 130.671,04 (ação 2.2046) |
| Esporte | 208 mil · 82 mil · 148 mil | 207.508,68 (função 27, p.3) | 81.726,30 | 148.327,32 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| eventos e festejos levaram 2 milhões e 100 em 2024 | 2.074.789,60 | 2024-12_PCMGE015.pdf | p.56 · ação 1.12.13.392.10.2.2060 "Apoio e realização de eventos culturais e festejos tradicionais" · Total do Projeto/Atividade · Liquidações até mês |
| em 2025, 4 milhões e 200 | 4.169.899,29 | 2025-12_PCMGE065.pdf | p.58 · ação 1.3121.13.392.10.2.2060 "Apoio e realização de eventos culturais e festejos tradicionais" · Total da Ação de Governo · Liquidada até o mês (serviços de empresas 3.974.201,29 + indenizações 195.698,00) |
| o dobro | 4.169.899,29 ÷ 2.074.789,60 = 2,01 | conta própria | (acima) |
| 36 vezes o que foi para agricultura e meio ambiente no mesmo ano | 115.394,47 | 2025-12_PCMGE065.pdf | p.12 · ação 1.3060.20.609.18.2.2065 "Manutenção da Secretaria de Agricultura e Meio Ambiente" · 3.1.90.11.00 Pessoal civil · Liquidada (conta própria: 4.169.899,29 ÷ 115.394,47 = 36,1) |
| em 2026, até setembro, eventos e festejos já levaram 3 milhões e 100 | 3.109.048,66 | 2026-09_PCMGE065.pdf | p.21 · ação 2.2090.13.392.7.2.2019 "Apoio e realização de eventos culturais e festejos tradicionais" · Total da Ação de Governo · Liquidada até o mês |
| e tem 4 milhões e 100 comprometidos | 4.119.716,54 | 2026-09_PCMGE065.pdf | p.21 · mesma ação · Empenhada até o mês |
| o IPTU da cidade inteira: 66 mil em 2024 | 65.974,95 | 2024_PCAGO008.pdf (Anexo 10) | p.1 · 1.1.1.2.50.0.0.00.00.000 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadado |
| 112 mil em 2025 | 111.653,65 | 2025_PCAGO008.pdf (Anexo 10) | p.1 · 1.1.1.2.50.0.0.00.00.000 · Arrecadado (previsto 148.155,17) |
| e 67 mil até setembro de 2026 | 67.064,54 | 2026-09_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até o mês (previsto 162.600,00) |
| a Câmara de Vereadores recebeu 2 milhões e 700 da prefeitura em 2025 | 2.680.539,12 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o mês |
| e devolveu 19 mil | 18.713,31 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o mês |
| só em consultoria, 360 mil | 360.240,00 (294.000,00 + 66.240,00) | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.00 Serviços de consultoria e 3.3.90.35.99 Outros serviços de consultoria · Liquidações até mês (soma: conta própria) |
| em diárias, 72 mil | 72.200,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.14.14 Diárias no país · Liquidações até mês |
| a dívida parcelada com o INSS saiu de 60 milhões e 800 no fim de 2024 | 60.826.668,25 (1.535.186,82 + 59.291.481,43) | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna) | p.1 · 2.1.1.4.3.01.02.01 CONTRIBUIÇÕES AO RGPS - DÉBITO PARCELADO e 2.2.1.4.3.01.01.01 INSS - DÉBITO PARCELADO · Saldo Atual (soma: conta própria) |
| para 161 milhões e 400 no fim de 2025 | 161.375.002,41 (5.000.000,00 + 156.375.002,41) | 2025_PCAGO012.pdf (Anexo XVI) | p.1 · 2.1.1.4.3.01.02.01.00.01 DÍVIDA - PARCELAMENTO INSS e 2.2.1.4.3.01.01.00.00.01 INSS - DÉBITO PARCELADO · Saldo Atual (soma: conta própria; o anexo registra inscrição de 105.076.092,03 no ano; TOTAIS do anexo 165.843.468,81 = soma das linhas) |
| mais que o dobro de tudo que a cidade arrecadou naquele ano | 69.376.623,01 | 2025_PCAGO015.pdf | p.1 (acima) · conta própria: 161.375.002,41 ÷ 69.376.623,01 = 2,33 |
| se o IPTU da cidade inteira rendeu 112 mil em 2025, por que eventos e festejos levaram 4 milhões e 200? | 111.653,65 e 4.169.899,29 | (acima) | (acima) |

## Folhas por setor (33: 3 de receita + 30 de setor; ~/Documents/RECEITAS-DESPESAS-ITAPEBI/saida/folha-pdf/config-setores.json)
Cada folha soma o valor falado. Câmara com o repasse do razão da Câmara: 2024 recebeu 2.472.772,80 e devolveu 31.736,29 (2024-12_CAMARA_PCMGE018.pdf); 2025 recebeu 2.680.539,12 e devolveu 18.713,31; 2026 até setembro recebeu 2.170.878,26 e devolveu 100.500,00 (2026-09_CAMARA_PCMGE018.pdf). Dívidas com o saldo da dívida parcelada com o INSS do Anexo 16. Ações sem gasto aparecem com o previsto e "gasto R$ 0,00" (regra 48).

## Pendência no TCM
- `2024-12_PCMGE065.pdf` (Demonstrativo Consolidado da Despesa de dez/2024) incompleto: 508.996,88 a menos que o Balanço e o Anexo IX. Não usado para os totais de 2024.
