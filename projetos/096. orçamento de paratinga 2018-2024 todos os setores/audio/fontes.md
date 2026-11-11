# Fontes · 096. orçamento de paratinga 2018-2024 todos os setores
Checagem: 09/11/2026. "Gastou" = despesa LIQUIDADA. Mesma base do 094 (~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/), ver também o fontes.md do 094.

## Totais por setor e ano (saida/despesa_ano.json)
Fonte: Balanço/Anexo 9 e demonstrativo de despesa de dezembro enviados ao TCM-BA (e-TCM, município 291, Prefeitura UJ 895, Câmara UJ 324, SAAE UJ 1058) e SICONFI/DCA, conferidos com o total do Balanço.

| setor | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | soma 7 anos (conta própria) |
|---|---|---|---|---|---|---|---|---|
| Educação | 39.541.045,02 | 44.238.483,80 | 37.260.864,88 | 42.659.760,49 | 58.464.368,77 | 60.324.450,51 | 66.384.616,52 | 348.873.589,99 |
| Saúde | 12.921.691,73 | 13.480.196,96 | 18.621.983,29 | 19.955.736,15 | 21.802.638,09 | 25.585.982,06 | 35.001.897,28 | 147.370.125,56 |
| Administração | 9.649.836,39 | 5.051.095,64 | 8.932.232,79 | 11.351.396,18 | 16.018.015,17 | 17.215.573,17 | 20.481.472,82 | 88.699.622,16 |
| Obras e serviços urbanos | 6.855.009,16 | 8.546.671,21 | 8.239.461,25 | 10.487.733,36 | 11.492.839,01 | 11.232.008,18 | 12.430.493,06 | 69.284.215,23 |
| Câmara de Vereadores | 2.116.789,13 | 2.337.138,25 | 2.449.814,99 | 2.507.114,54 | 3.044.263,53 | 3.391.289,32 | 3.452.274,56 | 19.298.684,32 |
| Dívidas e encargos | 0,00 | 1.194.043,73 | 1.073.481,57 | 1.879.209,25 | 1.150.244,20 | 4.019.141,32 | 4.837.903,89 | 14.154.023,96 |
| Cultura e festas | 1.661.130,68 | 1.231.915,90 | 1.320.630,88 | 385.851,03 | 1.457.446,49 | 1.965.477,02 | 2.646.048,44 | 10.668.500,44 |
| Assistência social | 1.522.163,77 | 1.284.637,90 | 1.219.031,69 | 1.512.430,88 | 2.875.589,69 | 2.039.728,33 | 2.173.449,92 | 12.627.032,18 |
| Água e saneamento | 1.474.264,50 | 1.370.782,62 | 1.229.574,69 | 1.234.252,96 | 1.418.931,06 | 1.509.542,07 | 1.689.589,32 | 9.926.937,22 |
| Agricultura | 618.397,57 | 600.503,75 | 507.874,39 | 699.429,51 | 898.798,28 | 913.532,27 | 809.301,39 | 5.047.837,16 |
| Esporte | 190.411,50 | 214.356,23 | 220.872,04 | 184.757,46 | 548.847,20 | 871.580,63 | 746.109,96 | 2.976.935,02 |
| Meio ambiente | 315.916,62 | 236.401,76 | 398.008,66 | 575.375,04 | 336.231,00 | 465.605,45 | 446.402,07 | 2.773.940,60 |
| Outros | 199.508,70 | 165.531,08 | 1.193.593,55 | 216.723,80 | 549.035,50 | 1.003.455,33 | 112.868,00 | 3.440.715,96 |
| TOTAL GASTO | 77.066.164,77 | 79.951.758,83 | 82.667.424,67 | 93.649.770,65 | 120.057.247,99 | 130.537.365,66 | 151.212.427,23 | 735.142.159,80 |

## Detalhes falados (2024, por tipo de despesa = elemento; el_2024.json, PCMGE015 dez/2024)
- Educação, salários (3.1.90.11): 31.414.762 → "31 milhões e 400".
- Saúde, serviços de empresas (3.3.90.39): 10.851.842 → "10 e 900".
- Administração: serviços de empresas 6.545.270 → "6 e 500"; despesas de anos anteriores (3.3.90.92 + 3.1.90.92) 2.615.268,69 + 6.019,98 = 2.621.288,67 → "2 e 600".
- Obras: ação "Pavimentação asfáltica e paralelepípedos de vias públicas" 343.436 → "calçamento e asfalto 343 mil".
- Dívidas 2018: função 28 sem liquidado no DCA; as parcelas da dívida (4.6.90.71) estão na função 04 (Administração): 809.252,50 → "809 mil".
- Câmara 2024: salários 1.997.719,42 → "2 milhões"; consultoria 492.000,00.
- Cultura e festas 2024: uma só ação, "Manutenção das ações de festas tradicionais, culturais e religiosas", 2.646.048,44 → "tudo na ação de festas".
- Água 2024: ação "Operação e manutenção do sistema de água" 1.159.874 → "1 e 200".
- Agricultura 2024: ação "Construção, ampliação e reforma de açudes, aguadas, barragens" 267.504 → "268 mil".
- Outros (jurídico, transporte, indústria, segurança em 2018): de 112.868,00 (2024) a 1.193.593,55 (2020) → "entre 113 mil e 1 milhão e 200".

## Folhas "PDF" (86): scripts/folhas_096.py → saida/folha-pdf-096/config.json
- Educação, Saúde, Obras, Câmara: as mesmas do 094 (folhas_setor.json + folhas_extra.py).
- Demais setores: tipos de despesa (elementos) do demonstrativo de dezembro de cada ano; quando há menos de 6 tipos, ação + tipo.
- 2019: 2019-12_DESPESA_CONSOLIDADA.pdf (escaneado) LIDO NA IMAGEM, coluna "Liquidado até o mês" (saida/el2019_visual.py); cada ação conferida com o "Total do Projeto Atividade". O PDF tem 38 das 41 páginas: na Assistência social faltam R$ 351.215,14 de detalhe (linha "Outras ações (páginas fora do PDF)") e a ação CRAS/CREAS (56.871,15) só tem o total.
- Água e saneamento 2021 a 2023: Prefeitura (função 17: 20.500,00 / 33.181,00 / 4.960,00) + SAAE (PCMGE015 da UJ 1058: 1.213.752,96 / 1.385.750,06 / 1.504.582,07), somas exatas.
- 2018: retirada uma linha de dotação anulada lida como liquidado (SCPV, material de consumo, 20.000,00). 2020: Assistência social com 14.049,00 sem elemento legível (OCR) na linha "Outras despesas e ajustes".
- Mapa: satélite NASA e EOxCloudless (CC BY 4.0), malhas do IBGE.
