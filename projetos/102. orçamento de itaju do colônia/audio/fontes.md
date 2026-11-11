# Fontes do 102. orçamento de itaju do colônia (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 04:56 e 05:15, pelo recebedor 127.0.0.1:8778, pasta ITAJU-DO-COLONIA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITAJU-DO-COLONIA/documentos_tcm/` (47 PDFs, todos com "ITAJU DO COLONIA/COLÔNIA" conferido no texto).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 184 (ITAJU DO COLÔNIA) · Prefeitura UJ 788 · Câmara UJ 217 (sem autarquia com prestação própria). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara). IBGE 2915403.
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário de 2024 e 2025; em 2026, Demonstrativo da Receita até setembro), como o documento traz.
Despesa por setor (soma das ações = total do ano, diferença 0,00; scripts/setores_itaju.py → saida/setores.json):
- 2024: `2024-12_PCMGE015.pdf` (Demonstrativo da Despesa por Período, sistema E&L, Prefeitura: TOTAL GERAL liquidado 45.847.309,27, p.19) + Câmara `2024-12_CAMARA_PCMGE015.pdf` (SIGA, 1.480.222,35). Soma = 47.327.531,62 = Balanço 2024. O PCMGE015 E&L não traz a função: cada ação foi posta no setor pela unidade e conferida função a função com o Anexo IX (`2024_PCAGO007.pdf`, despesa por órgão e função), que bate centavo a centavo.
- 2025: `2025-12_PCMGE015.pdf` (SIGA, Prefeitura, Total do Poder liquidado 44.390.429,85, p.78) + Câmara no `2025-12_ADIC03_DESPESA_CONSOLIDADO.pdf` (TOTAL DO PODER LEGISLATIVO 1.947.502,69, p.1). Soma = 46.337.932,54 = Balanço 2025 = TOTAL GERAL do consolidado (p.35).
- 2026: `2026-09_PCMGE015.pdf` (SIGA, Prefeitura, 51.840.288,73) + Câmara no `2026-09_ADIC03_DESPESA_CONSOLIDADO.pdf` (TOTAL DO PODER LEGISLATIVO 1.507.848,54, p.1). Soma = 53.348.137,27 = TOTAL GERAL DA DESPESA ORÇAMENTÁRIA do consolidado (p.38).
Setor: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 26 (transporte e estradas) · Administração 04 + 06 (precatórios e PASEP ficam aqui, função 04) · Dívidas 28 · Assistência social 08 + 14 · Câmara 01 · Cultura e festas 13 + (2026) ação 2.2123 "Manutenção das Ações de Turismo" (função 18, subfunção 392 difusão cultural: bandas, palco e fogos) · Agricultura e meio ambiente 20 + 18 · Esporte 27 (2024: ações 2.037, 2.027, 2.028 e 1.015, todas sem gasto).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json, receita_*.json, acoes_*.json); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/pg.py; as somas estão marcadas como conta própria).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 46 milhões e 500 em 2024 | 46.527.187,07 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas |
| gastou 47 milhões e 300 em 2024 | 47.327.531,62 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (empenhado = liquidado = pago) |
| 800 mil a mais em 2024 | 800.344,55 | 2024_PCAGO015.pdf | p.1 · DÉFICIT (VII) (= 47.327.531,62 − 46.527.187,07) |
| arrecadou 50 milhões e 600 em 2025 | 50.594.877,79 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (igual ao TOTAL do 2025-12_PCMGE016.pdf) |
| gastou 46 milhões e 300 em 2025 | 46.337.932,54 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| sobraram 4 milhões e 300 em 2025 | 4.256.945,25 | conta própria | 50.594.877,79 − 46.337.932,54 |
| arrecadou 52 milhões e 200 até setembro de 2026 | 52.204.589,82 | 2026-09_ADIC02_RECEITA_CONSOLIDADO.pdf | p.11 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês (igual ao 2026-09_PCMGE016.pdf: 52.208.955,05 arrecadada − 4.365,23 anulada) |
| gastou 53 milhões e 300 até setembro de 2026 | 53.348.137,27 | 2026-09_ADIC03_DESPESA_CONSOLIDADO.pdf | p.38 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no Ano |
| 1 milhão e 100 a mais | 1.143.547,45 | conta própria | 53.348.137,27 − 52.204.589,82 |
| já comprometeu 58 milhões e 300 | 58.284.953,06 | 2026-09_ADIC03_DESPESA_CONSOLIDADO.pdf | p.38 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Empenhado no Ano |

## Receita por ano (folha "PDF", não falada; scripts/receita_itaju.py → saida/receita_AAAA.json)
2024: Anexo 2 Resumo Geral da Receita (`2024_PCAGO003.pdf`, Total Líquido da Receita 46.527.187,07 = Balanço; FPM, ICMS e IPVA aparecem brutos e foram deixados líquidos com o "Total Dedução" do Fundeb do mesmo anexo: 3.503.103,35, 1.204.834,68 e 33.468,70). 2025: `2025-12_PCMGE016.pdf` (TOTAL 50.594.877,79). 2026: `2026-09_PCMGE016.pdf`. Grupos por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties 1.7.1.2.51/52, SUS 1.7.1.3 + 1.7.2.3, FNDE 1.7.1.4, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, convênios); "Outras receitas" fecha o total.

## Setores (soma = total do ano, diferença 0,00)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024-12_PCMGE015 + Anexo IX) | 2025 (2025-12_PCMGE015 + consolidado) | 2026 até set (2026-09_PCMGE015 + consolidado) |
|---|---|---|---|---|
| Educação | 16 e 600 · 15 e 800 · 19 e 300 | 16.609.165,18 (Anexo IX função 12, 2024_PCAGO007.pdf) | 15.808.184,66 | 19.341.675,37 |
| Saúde | 9 e 300 · 10 e 400 · 11 e 600 | 9.256.691,76 (função 10) | 10.362.642,38 | 11.610.774,20 |
| Obras e serviços urbanos | 3 e 900 · 2 e 400 · 7 e 900 | 3.923.910,71 (funções 15 + 26: 1.891.728,61 + 2.032.182,10) | 2.405.444,00 | 7.943.409,57 |
| Administração | 9 e 100 · 8 e 600 · 7 e 200 | 9.105.237,74 (funções 04 + 06: 9.040.173,68 + 65.064,06) | 8.623.773,41 | 7.245.932,35 |
| Dívidas | 3 e 500 · 2 e 500 · 800 mil | 3.521.922,05 (ação 2.023 Amortização da dívida interna, p.4 do 2024-12_PCMGE015) | 2.491.892,43 (ação 2.2023) | 800.160,83 (ação 2.2023) |
| Assistência social | 1 e 800 · 2 e 200 · 2 milhões | 1.829.753,16 (funções 08 + 14) | 2.166.141,56 | 1.951.983,14 |
| Câmara de Vereadores | 1 e 500 · 1 milhão e 900 · 1 e 500 | 1.480.222,35 (Anexo IX p.1, Total; = 2024-12_CAMARA_PCMGE015.pdf) | 1.947.502,69 (2025-12_ADIC03_DESPESA_CONSOLIDADO.pdf p.1, TOTAL DO PODER LEGISLATIVO) | 1.507.848,54 (2026-09_ADIC03_DESPESA_CONSOLIDADO.pdf p.1) |
| Cultura e festas | 1 e 400 · 2 e 400 · 2 e 800 | 1.382.852,41 (função 13) | 2.424.634,79 (ação 2.2112 Secretaria Municipal de Cultura e Turismo, p.15) | 2.801.527,42 (ação 2.2123 Turismo 2.756.404,96, p.19 + Lei Aldir Blanc 45.122,46) |
| Agricultura e meio ambiente | 218 mil · 108 mil · 112 mil | 217.776,26 (função 20) | 107.716,62 (ação 2.2016) | 112.385,65 (ações 2.2016 e 2.2125) |
| Esporte | nenhum real · nenhum real · 32 mil | 0,00 (ações previstas R$ 31.989,00, todas sem gasto) | 0,00 (ações 1.1015 campo, ginásio e quadra R$ 99.823,00; 2.2037; 2.2027; 2.2028; todas com liquidado 0,00, p.67) | 32.440,20 (ação 2.2037 Divisão de Esporte e Lazer) |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| só com bandas e palco, a prefeitura gastou 2 milhões e 100 em 2025 | 2.064.553,20 (bandas 845.077,76 + 411.922,24; palco 707.475,44 + 100.077,76) | 2025-12_PCMGE015.pdf | p.15 · ação 2.9.13.392.6.2.2112 "Secretaria Municipal de Cultura e Turismo" · elementos 3.3.90.39.94 Serviços de banda ou grupo musical e 3.3.90.39.95 Locação, confecção e montagem de cenários, palcos · Liquidações até o mês (soma: conta própria) |
| quase 20 vezes o que foi para agricultura e meio ambiente no mesmo ano | 107.716,62 | 2025-12_PCMGE015.pdf | ação 2.2016 Manutenção da Secr. Agricultura, Indústria, Comércio e Meio Ambiente (funções 20 e 18 somadas) · conta própria: 2.064.553,20 ÷ 107.716,62 = 19,2 |
| o esporte, que tinha campo, ginásio e quadra no orçamento, não teve um real gasto | dotação 99.823,00; liquidado 0,00 (esporte inteiro em 2025: 0,00) | 2025-12_PCMGE015.pdf | p.67 · ação 5.13.27.812.2.1.1015 "Constr.Ampl. Refor Campo Futebol, Ginásio e Quadra" · Total do Projeto/Atividade |
| em 2026, até setembro, bandas e palco já levaram 2 milhões e 700 | 2.660.657,84 (bandas 1.310.560,74 + 699.439,26; palco 439.097,10 + 211.560,74) | 2026-09_PCMGE015.pdf | p.19 · ação 2.1600.18.392.6.2.2123 "Manutenção das Ações de Turismo" · elementos 3.3.90.39.94 e 3.3.90.39.95 · Liquidações até o mês (soma: conta própria; empenhado nas bandas 2.410.000,00) |
| o IPTU da cidade inteira: 2 mil reais em 2024 | 2.080,03 | 2024_PCAGO003.pdf | p.1 · 11125000000 Imposto sobre a Propriedade Predial e Territorial Urbana |
| 521 reais em 2025 | 521,52 | 2025-12_ADIC02_RECEITA_CONSOLIDADO.pdf | p.1 · 1.1.1.2.50.0.0.00000 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadado até Mês (previsto 18.907,71) |
| e mil e 100 até setembro de 2026 | 1.108,08 | 2026-09_ADIC02_RECEITA_CONSOLIDADO.pdf | p.1 · 1.1.1.2.50.0.0.00000 · Arrecadado até Mês (previsto 64.000,00) |
| a Câmara de Vereadores recebeu 1 milhão e 900 da prefeitura em 2025 | 1.947.535,80 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o mês |
| e devolveu 33 reais | 33,11 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.02.00 REPASSE CONCEDIDO · até o mês (1.947.535,80 − 33,11 = 1.947.502,69, o gasto da Câmara) |
| só em consultoria, 163 mil | 163.060,00 | 2025-12_ADIC03_DESPESA_CONSOLIDADO.pdf | p.1 · Câmara · ação 01.031.0001.2.002 · 3.3.90.35.00 Serviços de Consultoria · Liquidado no Ano |
| em diárias, 67 mil | 67.003,00 (383,00 + 66.620,00) | 2025-12_ADIC03_DESPESA_CONSOLIDADO.pdf | p.1 · Câmara · 3.3.90.14.00 Diárias - Civil nas ações 2.001 e 2.002 · Liquidado no Ano (soma: conta própria) |
| a dívida parcelada com a previdência chegou a 22 milhões e 800 no fim de 2025 | 22.820.213,48 (2.100.000,00 + 20.720.213,48) | 2025_PCAGO012.pdf (Anexo XVI, Dívida Fundada Interna) | p.1 · 2.1.1.4.3.01.02.01.00.010 DÍVIDA FUNDADA INSS_EXECUTIVO_P e 2.2.1.4.1.01.00.00.00.000 CONTRIBUIÇÕES PREVIDENCIÁRIAS - DÉBITO PARCELADO · Saldo Atual (soma: conta própria) |
| quase metade de tudo que a cidade arrecadou naquele ano | 50.594.877,79 | 2025_PCAGO015.pdf | p.1 (acima) · conta própria: 22.820.213,48 ÷ 50.594.877,79 = 0,45 |
| se o IPTU da cidade inteira rendeu 521 reais em 2025, por que bandas e palco levaram 2 milhões e 100? | 521,52 e 2.064.553,20 | (acima) | (acima) |

## Câmara: repasse, nas folhas
| Ano | Recebeu | Devolveu | Arquivo · página |
|---|---|---|---|
| 2024 | 1.555.345,56 | (na folha só o recebido) | 2024-12_CAMARA_PCMGE018.pdf · p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO (p.6 traz 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS 92.501,56, com saldo anterior, não usado) |
| 2025 | 1.947.535,80 | 33,11 | 2025-12_CAMARA_PCMGE018.pdf · p.8 e p.7 |
| 2026 até set | 1.572.379,38 | não | 2026-09_CAMARA_PCMGE018.pdf (ESCANEADO, lido na imagem) · p.11 saldo anterior credor 1.397.670,56 + creditado no mês 174.708,82 · p.12 Creditado até o mês 1.572.379,38 |

## Câmara 2025 por tipo de despesa (folha; 2025-12_ADIC03_DESPESA_CONSOLIDADO.pdf p.1, Liquidado no Ano)
Vencimentos 913.824,67 + 175.813,19 · obrigações patronais 141.652,83 · diárias 383,00 + 66.620,00 · material de consumo 83.937,43 · terceirização (3.3.90.34) 228.480,00 · consultoria 163.060,00 · pessoa física 28.652,00 · pessoa jurídica 120.019,57 · equipamentos 25.060,00. Soma = 1.947.502,69.

## Dívidas (destaque das folhas)
Dívida parcelada com a previdência: fim de 2024 23.683.939,61 (2024_PCAGO012.pdf p.1: 211430102000 CONTRIBUIÇÕES AO RGPS - DEBITO PARCELADO 7.591.459,39 + 221410100000 CONTRIBUIÇÕES PREVIDENCIÁRIAS - DÉBITO PARCELADO 16.092.480,22) · fim de 2025 22.820.213,48 (acima).
2024, ação 2.023 Amortização da dívida interna: principal resgatado 1.872.416,84 (fonte 1500) + 1.649.505,21 (fonte 1754, empréstimo interno quitado; o Anexo XVI de 2024 mostra a baixa de 1.649.505,21 em OUTROS CONTRATOS - EMPRÉSTIMOS INTERNOS).

## Festas (folhas de Cultura e festas)
2024: ação 2.112 Secretaria Municipal de Cultura e Turismo 1.317.929,44 (Outros serviços de terceiros PJ 1.113.790,24 + 204.139,20; o E&L não abre o subelemento). 2025 e 2026: elementos acima.

## Pendências e observações
- `2024-12_PCMGE018.pdf` da Prefeitura (Razão) chegou com o mesmo conteúdo do PCMGE015 (Despesa.pdf); não usado.
- `2026-09_CAMARA_PCMGE015.pdf` e `2026-09_CAMARA_PCMGE018.pdf` escaneados: gasto da Câmara 2026 pelo consolidado da Prefeitura; repasse lido na imagem.
- Nenhum nome de gestor, empresa ou banda no vídeo.
