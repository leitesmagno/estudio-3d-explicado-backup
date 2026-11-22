# Fontes · 150. orçamento de Salvador

Documentos baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 12/11/2026, das 15:06 às 18:30, e guardados em `~/Documents/RECEITAS-DESPESAS-SALVADOR/documentos_tcm/` (PDF e texto extraído). Município SALVADOR (código 336 no e-TCM) · Prefeitura UJ 940 · Câmara UJ 369. Último mês entregue em 2026: setembro (10/2026 "Pendente", consulta das 15:05).

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário Consolidado Geral 2024 e 2025; PCMGE066 consolidado de set/2026, coluna "Total Até Mês" = arrecadada menos anulada). "Gastou" = despesa LIQUIDADA do município inteiro (consolidado PCMGE065: Prefeitura, Câmara, fundos, autarquias, fundações e empresas dependentes, como Saltur, Sucop, Limpurb, Transalvador, Guarda Civil). Valores incluem as operações intraorçamentárias, como o Balanço. Valores ditos arredondados (bilhões com 3 algarismos; milhões inteiros); abaixo, o valor exato.

## Receita e totais

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 12.198.672.091,38 | 2024-13_ANUAL_PCAGO015_2.pdf (Balanço Orçamentário, Consolidado Geral) e 2024-12_PCMGE066.pdf | p.1, "SUBTOTAL DAS RECEITAS (IV)"; 066 linha "Totais:" | Receitas realizadas / Total Até Mês | fala "12 bilhões e 200", mapa |
| Despesa 2024: R$ 12.388.275.960,56 (empenhada 12.696.169.055,76) | 2024-13_ANUAL_PCAGO015_2.pdf e 2024-12_PCMGE065.pdf (linha TOTAL) | p.2, "SUBTOTAL DAS DESPESAS (XIII)" | Despesas liquidadas | fala "12 bilhões e 390" |
| Gastou a mais em 2024: R$ 189.603.869,18 | conta própria: 12.388.275.960,56 - 12.198.672.091,38 | | | fala "190 milhões a mais" |
| Receita 2025: R$ 12.385.275.096,37 | 2025-13_ANUAL_PCAGO015_2.pdf e 2025-12_PCMGE066.pdf | p.1, "SUBTOTAL DAS RECEITAS (IV)"; 066 "Totais:" | Receitas realizadas | fala "12 bilhões e 390", mapa |
| Despesa 2025: R$ 11.899.037.498,75 (empenhada 12.301.390.006,89) | 2025-13_ANUAL_PCAGO015_2.pdf e 2025-12_PCMGE065.pdf (TOTAL) | p.2, "SUBTOTAL DAS DESPESAS (XIII)" | Despesas liquidadas | fala "11 bilhões e 900" |
| Sobraram em 2025: R$ 486.237.597,62 | conta própria: 12.385.275.096,37 - 11.899.037.498,75 | | | fala "486 milhões" |
| Receita 2026 até set: R$ 10.893.897.311,81 | 2026-09_PCMGE066.pdf (Demonstrativo Consolidado da Receita) | última página, "Totais:" | Total Até Mês | fala "10 bilhões e 890", mapa |
| Despesa 2026 até set: R$ 9.880.455.414,29 | 2026-09_PCMGE065.pdf (Demonstrativo Consolidado da Despesa) | p.318, linha "TOTAL" (2ª linha) | Liquidada até o mês | fala "9 bilhões e 880" |
| Empenhos 2026 até set: R$ 10.655.737.426,57 | 2026-09_PCMGE065.pdf | p.318, "TOTAL" (2ª linha) | Empenhada até o mês | fala "10 bilhões e 660" |

Obs.: o PCMGE016 só da Prefeitura de set/2026 dá R$ 10.784.948.769,70 (sem as receitas próprias das autarquias e empresas); o vídeo usa o consolidado (066), coerente com o Balanço dos anos fechados. O PCMGE015 só da Prefeitura (set/2026: 8.436.771.650,16; dez/2024: 10.225.451.263,91) não traz as unidades com prestação própria (Câmara, Saltur, Sucop, Transalvador, Guarda Civil, Limpurb, Desal, FGM e outras).

## Câmara (duodécimo)

| Valor exato | Documento | Onde | Coluna |
|---|---|---|---|
| Repasse recebido 2024: R$ 292.656.444,00; devolvido (repasse concedido): R$ 21.470.431,58 | 2024-12_CAMARA_PCMGE018.pdf (razão) | contas 4.5.1.1.2.02.00 e 3.5.1.1.2.02.00 | Creditado / Debitado até o mês |
| Repasse recebido 2025: R$ 344.184.951,00; devolvido: R$ 50.596.314,90 | 2025-12_CAMARA_PCMGE018.pdf | idem | idem |
| Repasse recebido até set/2026: R$ 262.155.750,03 (R$ 29.128.416,67 por mês) | 2026-09_CAMARA_PCMGE018.pdf | conta 4.5.1.1.2.02.00 | Creditado até o mês |
| Liquidado só da Câmara (UJ 369): 2024 R$ 265.832.076,22; 2025 R$ 288.271.798,87; 2026 até set R$ 223.477.771,47 | 20XX_CAMARA_PCMGE015.pdf | "Total do Poder" | Liquidações até mês |

No vídeo, o setor "Câmara" é a função 01 do consolidado (Câmara + Fundação Cosme de Farias, órgão 20): 270.068.462,35 / 292.704.874,22 / 226.532.039,91.

## Setores

Regras (scripts/setores.py): setor pela FUNÇÃO de cada ação do consolidado. Festas e eventos (regra 99) = ações pelo nome: "Salvador Capital da Alegria - Calendário Anual de Eventos e Festas Populares" (2024 e 2025, Saltur, código 2189), "Salvador: Cidade Vibrante o Ano Inteiro" (2026, Saltur, código 2008), "Promoção e Apoio a (Ações e) Eventos Especiais", "Fomento a Parcerias para Eventos Especiais", "Salvador Cidade da Cultura, dos Festivais e das Crianças". Obras e serviços urbanos = funções 15, 16 e 17 (inclui limpeza urbana e iluminação). Transporte = 26. Cultura e turismo = 13 + subfunção 695 (turismo), fora as festas. Esporte e lazer = 27 (inclui a Arena Multiuso). Administração e previdência = 04, 02, 09, 06 (guarda civil e defesa civil, sem falar de segurança no vídeo), 11, 14, 19, 22, 23 fora turismo, 24 (inclui a publicidade). Cada ano fecha centavo a centavo com o total liquidado.

### Setores 2024 (liquidado, soma das ações; script scripts/setores.py sobre saida/acoes065_2024.json)

| Setor | Valor exato | Arquivo | Onde | Coluna | No vídeo |
|---|---|---|---|---|---|
| Educação | R$ 2.691.768.316,85 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.86 a p.113 (19 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Saúde | R$ 3.001.710.668,07 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.28 a p.295 (20 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Administração e previdência | R$ 1.836.049.107,99 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.1 a p.331 (106 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Obras e serviços urbanos | R$ 2.813.268.903,19 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.82 a p.318 (60 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Câmara de Vereadores | R$ 270.068.462,35 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.331 a p.336 (6 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Dívidas e encargos | R$ 659.532.940,10 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.129 a p.329 (16 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Transporte e mobilidade | R$ 308.600.890,08 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.174 a p.304 (14 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Festas e eventos | R$ 219.867.311,19 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.3 a p.319 (8 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Cultura e turismo | R$ 138.798.869,34 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.193 a p.304 (28 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Assistência social | R$ 306.997.042,66 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.13 a p.296 (44 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Meio ambiente | R$ 49.972.792,27 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.74 a p.294 (10 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Agricultura | R$ 457.110,00 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.76 a p.76 (1 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| Esporte e lazer | R$ 91.183.546,47 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.134 a p.305 (9 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2024 |
| TOTAL | R$ 12.388.275.960,56 | 2024-12_PCMGE065.pdf (consolidado dez/2024) = Balanço 2024 (2024-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | linha TOTAL | Liquidada até o mês | fala "gastou" |

### Setores 2025 (liquidado, soma das ações; script scripts/setores.py sobre saida/acoes065_2025.json)

| Setor | Valor exato | Arquivo | Onde | Coluna | No vídeo |
|---|---|---|---|---|---|
| Educação | R$ 2.642.934.577,05 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.80 a p.213 (21 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Saúde | R$ 3.031.009.263,21 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.29 a p.287 (18 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Administração e previdência | R$ 2.058.221.491,63 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.1 a p.317 (109 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Obras e serviços urbanos | R$ 2.106.445.116,37 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.76 a p.298 (63 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Câmara de Vereadores | R$ 292.704.874,22 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.317 a p.322 (6 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Dívidas e encargos | R$ 839.113.896,65 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.122 a p.314 (13 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Transporte e mobilidade | R$ 203.534.196,04 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.161 a p.285 (18 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Festas e eventos | R$ 158.544.959,36 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.3 a p.298 (8 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Cultura e turismo | R$ 127.170.067,01 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.181 a p.285 (25 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Assistência social | R$ 308.959.903,36 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.14 a p.277 (39 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Meio ambiente | R$ 38.815.827,55 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.68 a p.276 (11 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Agricultura | R$ 85.760,00 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.71 a p.71 (1 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| Esporte e lazer | R$ 91.497.566,30 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | ações de p.126 a p.286 (8 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2025 |
| TOTAL | R$ 11.899.037.498,75 | 2025-12_PCMGE065.pdf (consolidado dez/2025) = Balanço 2025 (2025-13_ANUAL_PCAGO015_2.pdf, Consolidado Geral) | linha TOTAL | Liquidada até o mês | fala "gastou" |

### Setores 2026 (liquidado, soma das ações; script scripts/setores.py sobre saida/acoes065_2026.json)

| Setor | Valor exato | Arquivo | Onde | Coluna | No vídeo |
|---|---|---|---|---|---|
| Educação | R$ 2.163.025.633,39 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.76 a p.105 (24 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Saúde | R$ 2.436.698.686,31 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.27 a p.273 (20 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Administração e previdência | R$ 1.719.453.937,01 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.1 a p.312 (110 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Obras e serviços urbanos | R$ 1.701.601.674,48 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.73 a p.294 (61 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Câmara de Vereadores | R$ 226.532.039,91 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.312 a p.317 (6 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Dívidas e encargos | R$ 538.004.930,70 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.121 a p.310 (14 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Transporte e mobilidade | R$ 336.390.071,56 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.165 a p.273 (14 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Festas e eventos | R$ 237.347.758,12 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.60 a p.298 (7 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Cultura e turismo | R$ 93.629.180,49 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.184 a p.274 (25 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Assistência social | R$ 261.907.876,87 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.14 a p.274 (44 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Meio ambiente | R$ 37.324.980,83 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.63 a p.269 (9 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Agricultura | R$ 0,00 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.64 a p.64 (1 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| Esporte e lazer | R$ 128.538.644,62 | 2026-09_PCMGE065.pdf (consolidado set/2026) | ações de p.126 a p.277 (7 págs.) | Liquidada até o mês (2ª linha do "Total da Ação de Governo") | fala e plaquinha 2026 |
| TOTAL | R$ 9.880.455.414,29 | 2026-09_PCMGE065.pdf (consolidado set/2026) | linha TOTAL | Liquidada até o mês | fala "gastou" |

### Ações dos achados

| Ação | Ano | Previsto (dotação inicial) | Gasto (liquidado) | Arquivo e página |
|---|---|---|---|---|
| 43.4300.20.692.10.1.1088 Horta Soteropolitana - Programa de Agricultura Urbana | 2024 | R$ 700.000,00 | R$ 457.110,00 | 2024-12_PCMGE065.pdf p.76 |
| 44.4410.12.365.1.2.2129 Criança Alimentada Aprende Melhor - Pré-Escola | 2024 | R$ 13.762.000,00 | R$ 25.115.054,76 | 2024-12_PCMGE065.pdf p.97 |
| 44.4410.12.361.1.2.2130 Estudante Alimentado Melhor Rendimento Escolar- Ensino Fundamental | 2024 | R$ 94.077.000,00 | R$ 88.993.755,41 | 2024-12_PCMGE065.pdf p.98 |
| 44.4410.12.365.1.2.2131 Criança Alimentada-Criança Feliz - Creche | 2024 | R$ 7.400.000,00 | R$ 20.685.220,39 | 2024-12_PCMGE065.pdf p.98 |
| 52.5200.8.306.14.2.2319 Manutenção da Coordenadoria da Segurança Alimentar - COSAN | 2024 | R$ 312.000,00 | R$ 261.075,93 | 2024-12_PCMGE065.pdf p.142 |
| 54.5470.23.695.6.2.2189 Salvador Capital da Alegria - Calendário Anual de Eventos e Festas Populares | 2024 | R$ 79.986.000,00 | R$ 219.172.129,23 | 2024-12_PCMGE065.pdf p.224 |
| 57.5700.24.131.12.2.2018 Prefeitura Comunica - Publicidade Institucional das Ações de Governo | 2024 | R$ 71.000.000,00 | R$ 61.837.920,42 | 2024-12_PCMGE065.pdf p.244 |
| 61.6160.27.451.4.1.1365 Construção e Implantação de Arena Multiuso - Salvador | 2024 | R$ 152.000.000,00 | R$ 7.964.829,79 | 2024-12_PCMGE065.pdf p.305 |
| 43.4300.20.692.10.1.1088 Horta Soteropolitana - Programa de Agricultura Urbana | 2025 | R$ 600.000,00 | R$ 85.760,00 | 2025-12_PCMGE065.pdf p.71 |
| 44.4410.12.365.1.2.2129 Crianca Alimentada Aprende Melhor - Pre-Escola | 2025 | R$ 35.000.000,00 | R$ 27.927.984,20 | 2025-12_PCMGE065.pdf p.90 |
| 44.4410.12.361.1.2.2130 Estudante Alimentado Melhor Rendimento Escolar- Ensino Fundamental | 2025 | R$ 60.663.000,00 | R$ 78.975.474,75 | 2025-12_PCMGE065.pdf p.91 |
| 44.4410.12.365.1.2.2131 Crianca Alimentada-Crianca Feliz - Creche | 2025 | R$ 35.000.000,00 | R$ 26.224.365,00 | 2025-12_PCMGE065.pdf p.92 |
| 52.5200.8.306.14.2.2319 Manutencao da Coordenadoria da Seguranca Alimentar - COSAN | 2025 | R$ 480.000,00 | R$ 12.054,50 | 2025-12_PCMGE065.pdf p.131 |
| 54.5470.23.695.6.2.2189 Salvador Capital da Alegria - Calendario Anual de Eventos e Festas Populares | 2025 | R$ 138.049.000,00 | R$ 158.244.959,36 | 2025-12_PCMGE065.pdf p.209 |
| 57.5700.24.131.12.2.2018 Prefeitura Comunica - Publicidade Institucional das Acoes de Governo | 2025 | R$ 47.275.000,00 | R$ 90.547.596,36 | 2025-12_PCMGE065.pdf p.227 |
| 61.6160.27.451.4.1.1365 Construcao e Implantacao de Arena Multiuso - Salvador | 2025 | R$ 16.301.000,00 | R$ 58.254.156,43 | 2025-12_PCMGE065.pdf p.286 |
| 43.4300.20.692.8.1.1083 Hortas Soteropolitanas - Programa de Agricultura Urbana | 2026 | R$ 360.000,00 | R$ 0,00 | 2026-09_PCMGE065.pdf p.64 |
| 44.4400.12.365.1.2.2339 Alimentacao Escolar - Creche | 2026 | R$ 24.451.000,00 | R$ 12.850.263,73 | 2026-09_PCMGE065.pdf p.78 |
| 44.4400.12.365.1.2.2340 Alimentacao Escolar - Pre-Escola | 2026 | R$ 24.450.000,00 | R$ 14.593.588,62 | 2026-09_PCMGE065.pdf p.79 |
| 44.4400.12.361.1.2.2342 Alimentacao Escolar - Ensino Fundamental | 2026 | R$ 64.901.000,00 | R$ 25.263.859,54 | 2026-09_PCMGE065.pdf p.80 |
| 44.4410.12.365.1.2.2145 Crianca Alimentada - Crianca Feliz - Creche | 2026 | R$ 16.500.000,00 | R$ 13.329.238,75 | 2026-09_PCMGE065.pdf p.90 |
| 44.4410.12.365.1.2.2146 Crianca Alimentada Aprende Melhor - Pre-Escola | 2026 | R$ 16.500.000,00 | R$ 10.418.774,00 | 2026-09_PCMGE065.pdf p.90 |
| 44.4410.12.361.1.2.2224 Estudante Alimentado Melhor Rendimento Escolar - Ensino Fundamental | 2026 | R$ 20.517.000,00 | R$ 20.825.406,75 | 2026-09_PCMGE065.pdf p.92 |
| 52.5200.8.306.3.2.2179 Salvador Alimenta Mais - Restaurante Popular | 2026 | R$ 26.000.000,00 | R$ 10.924.258,06 | 2026-09_PCMGE065.pdf p.130 |
| 52.5200.8.306.3.2.2640 Gestao da Coordenadoria de Seguranca Alimentar - COSAN | 2026 | R$ 300.000,00 | R$ 9.337,00 | 2026-09_PCMGE065.pdf p.132 |
| 54.5470.23.695.9.2.2008 Salvador: Cidade Vibrante o Ano Inteiro | 2026 | R$ 143.438.000,00 | R$ 233.172.154,12 | 2026-09_PCMGE065.pdf p.211 |
| 57.5700.24.131.10.2.2256 Prefetura Comunica - Publicidade Institucional das Acoes de Governo | 2026 | R$ 52.096.000,00 | R$ 93.811.518,88 | 2026-09_PCMGE065.pdf p.227 |
| 61.6160.27.813.2.1.1322 Construcao e Implantacao da Arena Multiuso - Salvador | 2026 | R$ 83.111.000,00 | R$ 96.576.433,29 | 2026-09_PCMGE065.pdf p.277 |

Contas próprias dos achados:
- Alimentação escolar 2026 até set (6 ações da Educação: 2339, 2340, 2342, 2145, 2146, 2224): R$ 97.281.131,39 → fala "97 milhões". 2025 (3 ações 2129, 2130, 2131): R$ 133.127.823,95. 2024 (2129, 2130, 2131): R$ 134.794.030,56.
- Agricultura 2026 = 0: única ação da função 20 é "Hortas Soteropolitanas" (previa R$ 360.000,00, liquidado 0,00, p.64). Buscado também agric/horta/rural/pesca/abastecimento em todas as ações e na receita: nada mais.
- A ação de eventos mudou de nome e de código com o PPA 2026-2029 (2189 "Calendário Anual de Eventos e Festas Populares" → 2008 "Cidade Vibrante o Ano Inteiro"), mesma unidade Saltur (54.5470), mesma subfunção 695 (turismo). Elementos de 2026: quase tudo em 3.3.90.39 (serviços de terceiros, pessoa jurídica). Dotação atualizada de 2026: R$ 271,7 mi.

## Cruzamento (SICONFI, Tesouro Nacional; só conferência)
- RREO 6º bim. 2024: receitas exceto intra 11.717,48 mi; despesa liquidada total (com intra) 12.388,3 mi = Balanço. RREO 6º bim. 2025: liquidada total 11.899,0 mi = Balanço. RREO 4º bim. 2026: receita 9.377,92 mi até agosto; liquidada 8.384,4 mi até agosto. Arquivos em ~/Documents/RECEITAS-DESPESAS-SALVADOR/siconfi/.

## Tribunal (não entra no vídeo)
- Contas anuais de 2024 e 2025 da Prefeitura: status não conferido (a consulta de Contas Anuais do TCM tem captcha; fica com o Magno). Contas de 2022: parecer prévio pela aprovação com ressalvas, sessão de 22/07/2025, processo 07929e23 (Aratu On, 30/07/2025; BNews, 22/07/2025). Contas de 2023: aprovação com ressalvas e multa de R$ 2 mil (BNews, maio de 2025).
- DOE TCM 12/06/2026 (nº 2.827): dilação de prazo em auditorias de termos de parceria da Prefeitura com OSCs (processos 14446e26, 13547e26, 14606e26) — em análise.
- Notícias só para conferência interna: GAECO/MP investiga empresas com contratos na Prefeitura (Jornal Grande Bahia, jul/2026); LOA 2026 de R$ 14,96 bi (Bahia Notícias 309207). Nada disso vai ao vídeo.

## Correção 12/11/2026 ~19:35 (narração v3)
- Esporte e lazer 2026 até set = R$ 128.538.644,62 → a fala passou de "128 milhões" (arredondado errado) para "129 milhões". Só a parte 7 da voz foi refeita; narração final 166,89 s. Plaquinha e meta.json: "R$ 129 MI".
- Render: no Braniac (decisão do Magno), pelo Xandão Link. braniac-meta.json gerado por scripts/braniac_meta.py com os mesmos valores deste arquivo (setores = saida/acoes065_*.json; folhas = saida/folha-pdf/config-setores.json).
