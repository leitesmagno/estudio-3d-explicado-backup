# Fontes do 104. orçamento de jussari (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 06:24 e 06:52, pelo recebedor 127.0.0.1:8778, pasta JUSSARI, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-JUSSARI/documentos_tcm/` (56 PDFs com "JUSSARI" conferido no texto). O arquivo `2024_PCAGO003.pdf` que veio na prestação anual de 2024 é de IBICARAÍ (cabeçalho "PREFEITURA MUNICIPAL DE IBICARAI"): separado em `~/Documents/RECEITAS-DESPESAS-JUSSARI/fora_do_municipio/` e não usado.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 221 (JUSSARI) · Prefeitura UJ 825 · Câmara UJ 254 · SAAE (Serviço Autônomo de Água e Esgoto) UJ 1052, que presta contas mensais próprias. Último mês entregue em 2026: 08/2026 pela Prefeitura (09/2026 aparece "Pendente"); usado 08/2026 nas três unidades.
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz para o município (consolidado Prefeitura + Câmara + SAAE).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/achar.py). Somas e divisões estão marcadas como conta própria.

## Como a despesa por setor foi montada (scripts/setores_jussari.py → saida/setores.json; soma = total do ano, diferença 0,00)
- 2024: Anexo VI consolidado PM/CM/SAAE (`2024_PCAGO004.pdf`, valor por ação, Total 57.445.000,24 na p.15) = Anexo IX consolidado (`2024_PCAGO007.pdf`, Total 57.445.000,24 na p.12). O Balanço Orçamentário de 2024 enviado (`2024_PCAGO015.pdf`) é só da Prefeitura (empenhado = liquidado = 55.283.394,26, p.1). A Câmara (1.361.505,83) e o SAAE (800.100,15) também tiveram tudo liquidado: razão consolidado `2024-12_PCMGE064.pdf`, p.21, contas 6.2.2.1.3.03 / 6.2.2.1.3.04 (liquidado a pagar e pago). Por isso, em 2024, empenhado = liquidado = 57.445.000,24.
- 2025: Anexo VI consolidado (`2025_PCAGO004.pdf`, Total 60.790.235,81 na p.12 = empenhado do Balanço). Liquidado = empenhado menos 20.336,48 ainda não liquidados, ação por ação, lidos nos elementos do `2025-12_PCMGE065.pdf` (Demonstrativo Consolidado da Despesa, sistema E&L; leitor scripts/el065.py). Total liquidado 60.769.899,33 = Balanço 2025 (`2025_PCAGO015.pdf`, p.1).
- 2026 (até agosto): PCMGE015 SIGA da Prefeitura (`2026-08_PCMGE015.pdf`, Total do Poder p.98: empenhado 62.620.966,35, liquidado 51.777.476,88) + Câmara (`2026-08_CAMARA_PCMGE015.pdf`, p.3: 1.637.504,03 / 1.064.887,04) + SAAE (`2026-08_SAAE_PCMGE015.pdf`, p.4: 738.358,60 / 518.179,96). Soma: conta própria.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + SAAE (água e esgoto) · Administração 04 · Dívidas 28 · Assistência social 08 · Câmara 01 · Cultura e festas 13 (+ manutenção da Sec. de Cultura na função 04) · Agricultura e meio ambiente 20 + 18 (+ manutenção da Sec. de Agricultura na função 04, nos três anos) · Esporte 27.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 58 milhões e 900 em 2024 | 58.900.810,50 | 2024_PCAGO008.pdf (Anexo X consolidado PM/CM/SAAE) | p.11 · Total Geral · Arrecadado (o Balanço só da Prefeitura, 2024_PCAGO015.pdf p.1, traz 58.146.752,12) |
| gastou 57 milhões e 400 em 2024 | 57.445.000,24 | 2024_PCAGO007.pdf (Anexo IX consolidado) | p.12 · Total (= 2024_PCAGO004.pdf p.15; liquidado, ver acima) |
| sobrou 1 milhão e 500 em 2024 | 1.455.810,26 | conta própria | 58.900.810,50 − 57.445.000,24 |
| arrecadou 68 milhões e 400 em 2025 | 68.395.091,36 | 2025_PCAGO015.pdf (Balanço Orçamentário consolidado) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025_PCAGO008.pdf, Total Geral) |
| gastou 60 milhões e 800 em 2025 | 60.769.899,33 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhadas 60.790.235,81) |
| sobraram 7 milhões e 600 em 2025 | 7.625.192,03 | conta própria | 68.395.091,36 − 60.769.899,33 |
| arrecadou 53 milhões e 600 até agosto de 2026 | 53.579.458,59 | 2026-08_PCMGE016.pdf + 2026-08_SAAE_PCMGE016.pdf | Prefeitura p.9 · TOTAL · Arrecadada até mês 53.076.530,59 + SAAE p.1 · Receitas Correntes · 502.928,00 (soma: conta própria; o 2026-08_PCMGE066.pdf consolidado traz 53.579.251,93, diferença de 206,66) |
| gastou 53 milhões e 400 até agosto de 2026 | 53.360.543,88 | 2026-08_PCMGE015.pdf + CAMARA + SAAE | 51.777.476,88 (p.98) + 1.064.887,04 (p.3) + 518.179,96 (p.4) · Liquidações até mês (soma: conta própria) |
| sobraram 220 mil | 218.914,71 | conta própria | 53.579.458,59 − 53.360.543,88 |
| já comprometeu 65 milhões | 64.996.828,98 | mesmos três PCMGE015 | 62.620.966,35 + 1.637.504,03 + 738.358,60 · Empenhos até mês (soma: conta própria) |

## Setores (soma = total do ano, diferença 0,00; somas das ações: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024_PCAGO004.pdf) | 2025 (2025_PCAGO004.pdf − não liquidado) | 2026 até ago (PCMGE015 das 3 unidades) |
|---|---|---|---|---|
| Educação | 24 e 800 · 28 e 300 · 22 e 700 | 24.845.216,58 | 28.313.587,32 | 22.724.431,57 |
| Saúde | 11 milhões · 10 e 100 · 8 e 700 | 10.998.024,28 | 10.119.925,33 | 8.687.871,61 |
| Obras e serviços urbanos | 4 e 500 · 2 e 100 · 4 e 500 | 4.514.574,00 (inclui SAAE 800.100,15 e saneamento 1.185.126,38) | 2.093.689,01 (inclui SAAE 818.599,73) | 4.505.966,27 (inclui SAAE 518.179,96 e estradas vicinais 1.142.185,00) |
| Administração | 11 e 700 · 11 e 700 · 9 e 100 | 11.701.179,09 | 11.715.994,00 | 9.071.133,24 |
| Dívidas | 980 mil · 1 e 800 · 1 e 200 | 981.531,19 (PASEP 449.091,63 + amortização 532.439,56) | 1.836.822,63 | 1.230.836,60 |
| Assistência social | 2 e 600 · 2 e 300 · 3 milhões e 100 | 2.607.951,33 | 2.258.513,03 | 3.068.579,99 |
| Câmara de Vereadores | 1 e 400 · 1 e 700 · 1 e 100 | 1.361.505,83 (= 2024_PCAGO007.pdf, órgão Câmara) | 1.655.457,38 (= 2025-12_CAMARA_PCMGE015.pdf p.3, Total do Poder) | 1.064.887,04 (2026-08_CAMARA_PCMGE015.pdf p.3) |
| Cultura e festas | 240 mil · 2 e 300 · 2 e 700 | 240.318,49 | 2.291.651,26 | 2.729.431,79 |
| Agricultura e meio ambiente | 100 mil · 450 mil · 220 mil | 104.678,53 (só a manutenção da secretaria, ação 2.010, p.6) | 454.125,77 (= órgão 0209 no 2025_PCAGO007.pdf) | 222.385,64 (manutenção 221.989,64 p.78 + fomento 396,00 p.79) |
| Esporte | 90 mil · 30 mil · 55 mil | 90.020,92 | 30.133,60 | 55.020,13 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| as festas levaram 147 mil em 2024 | 146.908,15 | 2024_PCAGO004.pdf | p.3 · ação 1339200072.023 "Prom. e realização de festas tradicionais e lazer" (única ação de festas do ano) |
| em 2025, 2 milhões e 200 | 2.157.692,07 | 2025_PCAGO004.pdf | ação 1339200072.023 na Educação (260.630,00, p.3) + na Sec. de Cultura (1.692.780,28, p.7) + ação 1339200072.257 "Realização dos festejos juninos" (204.281,79, p.7); tudo liquidado (soma: conta própria) |
| quase 15 vezes mais | 14,69 | conta própria | 2.157.692,07 ÷ 146.908,15 |
| em 2026, até agosto, as festas já levaram 2 milhões e 700 | 2.669.316,29 | 2026-08_PCMGE015.pdf | p.91 · ação 215.15.13.392.7.2.2023 "Prom e realização de festas tradicionais e lazer" · Total do Projeto/Atividade · Liquidações até mês 2.256.485,27 + p.95 · ação 2257 "Realização dos festejos juninos" 412.831,02 (soma: conta própria; empenhado 2.365.393,46 + 412.831,02 = 2.778.224,48) |
| mais que o ano inteiro de 2025 | 2.669.316,29 > 2.157.692,07 | conta própria | (acima) |
| os programas de agricultura: 396 reais | 396,00 | 2026-08_PCMGE015.pdf | p.79 · ação 1.1001 "Fomento à produção agrícola", 3.3.90.32.99 Outros materiais de distribuição gratuita · Liquidações até mês (todas as outras ações da função 20 e a 18: 0,00 empenhado e liquidado) |
| o resto foi a manutenção da secretaria | 221.989,64 | 2026-08_PCMGE015.pdf | p.78 · ação 2.2010 "Gestão rec. manut. da Secretaria de Agricultura" · Total do Projeto/Atividade · Liquidações até mês (empenhado 301.805,26) |
| o IPTU: 6 mil em 2024 | 6.376,06 | 2024_PCAGO008.pdf (Anexo X) | p.1 · 11125000000 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadado (previsto 105.000,00) |
| zero em 2025 | 0,00 | 2025_PCAGO008.pdf (Anexo X) | p.1 · 11125000000 · coluna Arrecadado em branco; Orçado 575.000,00 e Diferença 575.000,00. Procurado também "Predial", "IPTU", "Territorial Urbana" em todo o Anexo X e no 2025-12_PCMGE066.pdf: nenhuma outra linha |
| e zero até agosto de 2026 | 0,00 | 2026-08_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até mês 0,00 (previsto 577.000,00); igual no 2026-08_PCMGE066.pdf |
| a previsão era de 575 mil | 575.000,00 | 2025_PCAGO008.pdf | p.1 · 11125000000 · Orçado |
| a Câmara recebeu 1 milhão e 700 da prefeitura em 2025 | 1.741.784,32 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.5 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o mês |
| e devolveu 86 mil | 86.326,94 | 2025-12_CAMARA_PCMGE018.pdf | p.5 · 4.5.1.1.2.02.00 · Debitado até o mês (recebido − devolvido = 1.655.457,38 = gasto da Câmara) |
| só em consultoria, 174 mil | 173.900,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica 146.400,00 + 3.3.90.35.99 Outros serviços de consultoria 27.500,00 · Liquidações até mês (soma: conta própria) |
| em diárias, 20 mil | 20.350,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.14.14 Diárias no país · Liquidações até mês |
| a dívida parcelada com o INSS: 39 milhões e 600 no fim de 2024 | 39.630.220,67 | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna) | p.1 · PARCELAMENTO - DÍVIDA - INSS · Saldo Atual |
| 72 milhões e 500 no fim de 2025 | 72.480.952,21 | 2025_PCAGO012.pdf (Anexo 16) | p.1 · 221430101000 CONTRIBUIÇÕES AO RGPS - DÉBITO PARCELADO · Saldo Atual (inscrição no ano 33.515.099,95; baixa 664.368,41) |
| mais que tudo que a cidade arrecadou naquele ano | 72.480.952,21 > 68.395.091,36 | conta própria | Anexo 16 x Balanço 2025 |
| se a cidade não arrecadou nada de IPTU em 2025, por que as festas levaram 2 milhões e 200? | 0,00 e 2.157.692,07 | (acima) | (acima) |

## Pendências no TCM
- `2024_PCAGO003.pdf` da prestação anual de 2024 da Prefeitura de Jussari é de Ibicaraí.
- `2024-12_SAAE_PCMGE015.pdf` (prestação 12/2024 do SAAE) traz a competência 09/2024. Não usado (o SAAE de 2024 veio do Anexo VI/IX consolidado e do razão consolidado).
- `2024-12_CAMARA_PCMGE015.pdf` escaneado (texto por OCR). Não usado para valores (a Câmara de 2024 veio do Anexo VI/IX).
- Prestação 12/2025 da Prefeitura sem PCMGE015/016/018 (só os consolidados PCMGE065/066 do E&L); o PCMGE064 dela é declaração de inexistência.
