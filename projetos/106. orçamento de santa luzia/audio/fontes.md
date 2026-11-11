# Fontes do 106. orçamento de santa luzia (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 07:17 e 07:33, pelo navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta SANTA-LUZIA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-SANTA-LUZIA/documentos_tcm/` (46 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "SANTA LUZIA" no cabeçalho, menos os comprovantes bancários da Câmara (PCMGE007, escaneados, não usados para valores).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 342 (SANTA LUZIA) · Prefeitura UJ 946 · Câmara UJ 375. Não há autarquia com prestação própria (só as duas unidades no filtro; os fundos de Saúde, Educação e Assistência Social estão dentro da Prefeitura). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 aparece "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário de 2024 e 2025; linha "Totais" do PCMGE016 de 09/2026).
O Balanço e o Anexo IX de 2024 e 2025 já são consolidados (Câmara + Prefeitura + fundos). Em 2026 somei Prefeitura + Câmara (a Prefeitura traz o órgão da Câmara com execução zero, então não há conta em dobro).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json do leitor do PCMGE015); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/achar.py). Somas e diferenças estão marcadas como conta própria.

## Como a despesa por setor foi montada (scripts/setores_sl.py → saida/setores.json; soma = total do ano)
- 2024: PCMGE015 SIGA de 12/2024 da Prefeitura (`2024-12_PCMGE015.pdf`, Total do Poder p.67: empenhado = liquidado = 73.271.149,93) + Câmara (`2024-12_CAMARA_PCMGE015.pdf`, p.1, TOTAL DA AÇÃO: 1.987.635,26) = 75.258.785,19 = Balanço (`2024_PCAGO015.pdf`, p.2, Despesas Liquidadas) = Anexo IX (`2024_PCAGO007.pdf`, p.4, Total). Cada setor bate com a função no Anexo IX.
- 2025: PCMGE015 de 12/2025 da Prefeitura (`2025-12_PCMGE015.pdf`, Total do Poder p.69: empenhado 76.126.724,35, liquidado 76.058.981,35) + Câmara (`2025-12_CAMARA_PCMGE015.pdf`, p.1, TOTAL DA AÇÃO: 2.609.980,45) = liquidado 78.668.961,80. O Balanço (`2025_PCAGO015.pdf`, p.2) traz liquidado 78.675.261,80: diferença de 6.300,00 a mais no Balanço, que não aparece no PCMGE015 (anotado; não muda nenhum número arredondado). Empenhado 78.736.704,80 = Balanço = Anexo IX (`2025_PCAGO007.pdf`, p.4).
- 2026 (até setembro): PCMGE015 de 09/2026 da Prefeitura (`2026-09_PCMGE015.pdf`, Total do Poder p.73: empenhado 76.466.441,18, liquidado 66.562.099,38) + Câmara (`2026-09_CAMARA_PCMGE015.pdf`, p.1, Total do Poder: empenhado 2.451.062,70, liquidado 1.931.882,97). Soma: conta própria.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 + 17 · Administração 04 + 23 · Dívidas 28 · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27. (16 Habitação, 17 Saneamento, 18 Defesa civil e 23 Turismo têm execução zero nos três anos.)

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 73 milhões em 2024 | 72.970.378,05 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.12, Totais, Total Até Mês 72.970.378,05) |
| gastou 75 milhões e 300 em 2024 | 75.258.785,19 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhadas = liquidadas) |
| gastou 2 milhões e 300 a mais do que arrecadou | 2.288.407,14 | 2024_PCAGO015.pdf | p.1 · linha "Défit (VI)" · Receitas Realizadas |
| arrecadou 78 milhões e 800 em 2025 | 78.807.556,82 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.12, Totais, Total Até Mês) |
| gastou 78 milhões e 700 em 2025 | 78.675.261,80 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhadas 78.736.704,80) |
| sobraram 130 mil | 132.295,02 | conta própria | 78.807.556,82 − 78.675.261,80 |
| arrecadou 70 milhões e 300 até setembro de 2026 | 70.303.608,71 | 2026-09_PCMGE016.pdf | p.12 · Totais · Total Até Mês (arrecadada 70.320.083,97 − anulada 16.475,26) |
| gastou 68 milhões e 500 até setembro | 68.493.982,35 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | 66.562.099,38 (p.73, Total do Poder, Liquidações Até Mês) + 1.931.882,97 (p.1, Total do Poder) · soma: conta própria |
| sobrou 1 milhão e 800 | 1.809.626,36 | conta própria | 70.303.608,71 − 68.493.982,35 |
| já comprometeu 78 milhões e 900 | 78.917.503,88 | mesmos dois PCMGE015 | 76.466.441,18 (p.73, Empenhos Até Mês) + 2.451.062,70 (p.1) · soma: conta própria |

## Setores (soma = total do ano; somas das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (= Anexo IX, 2024_PCAGO007.pdf) | 2025 liquidado (2025-12_PCMGE015.pdf + Câmara) | 2026 até set (2026-09_PCMGE015.pdf + Câmara) |
|---|---|---|---|---|
| Educação | 29 e 900 · 32 e 200 · 28 e 900 | 29.884.212,38 (p.2, função 12) | 32.222.596,37 | 28.916.499,15 |
| Saúde | 15 e 900 · 15 e 600 · 12 e 500 | 15.927.134,41 (p.2, função 10) | 15.649.254,66 | 12.500.802,75 |
| Obras e serviços urbanos | 6 e 800 · 5 e 500 · 4 e 800 | 6.762.204,19 (p.2, função 15 Urbanismo) | 5.518.359,71 | 4.802.652,74 |
| Administração | 11 e 900 · 14 e 800 · 14 e 600 | 11.860.426,48 (p.1, função 04) | 14.806.032,01 | 14.568.023,23 |
| Dívidas | 3 e 900 · 3 e 100 · 1 e 500 | 3.857.480,68 (p.4, função 28) | 3.077.277,87 | 1.542.667,69 (ação 2.2008 Gestão da dívida pública, p.11 do PCMGE015, única da função 28) |
| Assistência social | 2 e 700 · 2 e 600 · 2 e 100 | 2.689.337,76 (p.1, função 08) | 2.602.296,94 | 2.142.415,31 |
| Câmara de Vereadores | 2 milhões · 2 e 600 · 1 e 900 | 1.987.635,26 (p.1, função 01) | 2.609.980,45 (= 2025_PCAGO007.pdf p.1) | 1.931.882,97 (2026-09_CAMARA_PCMGE015.pdf p.1) |
| Cultura e festas | 1 e 900 · 1 e 600 · 1 e 700 | 1.875.290,19 (p.2, função 13) | 1.633.739,61 | 1.669.309,77 |
| Agricultura e meio ambiente | 390 mil · 540 mil · 410 mil | 386.381,84 (p.3, função 20) | 536.732,18 | 407.495,74 |
| Esporte | 29 mil · 13 mil · 12 mil | 28.682,00 (p.4, função 27) | 12.692,00 | 12.233,00 |

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| as festas levaram 1 milhão e 700 em 2024 | 1.741.331,06 | 2024-12_PCMGE015.pdf | p.64 · ação 5.909.13.392.3.2.2041 "Promoção e realização de eventos culturais e tradicionais" · Total do Projeto/Atividade · Liquidações Até Mês (única ação de eventos do ano) |
| só em bandas, 1 milhão e 240 | 1.240.000,00 | 2024-12_PCMGE015.pdf | p.64 · mesma ação · elemento 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical ou Profissional do Setor Artístico" · Liquidações Até Mês (pago até dez: 565.000,00) |
| em 2025, 1 milhão e 500 | 1.497.826,97 | 2025-12_PCMGE015.pdf | p.66 · ação 2.2041 · Total do Projeto/Atividade · Liquidações Até Mês (festividades e homenagens 400.000,00; cenários, palco e montagem 797.826,97; outros serviços 300.000,00) |
| até setembro de 2026, mais 1 milhão e 700 | 1.669.309,77 | 2026-09_PCMGE015.pdf | p.70 · ação 2.2041 · Total do Projeto/Atividade · Liquidações Até Mês (empenhado 1.745.309,77) |
| apoio à agricultura familiar: zero nos três anos | 0,00 | 2024-12, 2025-12 e 2026-09_PCMGE015.pdf | p.18 dos três · ação 2.1111.20.608.4.2.2047 "Apoio a agricultura familiar" · empenhado e liquidado 0,00 (fixado no início 20.182,50 / 21.797,10 / 25.720,58, quase tudo anulado) |
| o fundo da agricultura, também zero | 0,00 | mesmos três PCMGE015 | p.18 (2024) e p.19 (2025, 2026) · ação 2.2045 "Gerenciamento das ações do FUMAF" · empenhado e liquidado 0,00 |
| o que saiu foi a manutenção da secretaria | 386.381,84 · 536.732,18 · 407.495,74 | mesmos três PCMGE015 | p.17 (2024), p.18 (2025, 2026) · ação 2.2048 "Gestão das ações da Secretaria Municipal de Agricultura" (pessoal, aluguel, energia e serviços) · Liquidações |
| (procura do "zero") | | todos os PCMGE015 e PCMGE016 | Procurado "AGRIC", "RURAL", "FAMILIAR", "PRODUTOR" e "CACAU" nos nomes de todas as ações e receitas: só as três ações acima (despesa) e o ITR, imposto territorial rural (receita). Nenhuma outra ação de apoio ao produtor. |
| IPTU: 120 mil em 2024 | 119.539,10 | 2024-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadada até Mês (previsto 731.313,06) |
| 147 mil em 2025 | 146.507,53 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até Mês (previsto 789.818,10) |
| 92 mil até setembro de 2026 | 92.312,65 | 2026-09_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Arrecadada até Mês |
| a previsão para este ano era de 932 mil | 931.985,36 | 2026-09_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 · Receita Prevista |
| a Câmara gastou 2 milhões em 2024 | 1.987.635,26 | 2024-12_CAMARA_PCMGE015.pdf | p.1 · TOTAL DA AÇÃO · Liquidado No Ano (= 2024_PCAGO007.pdf p.1) |
| e 2 milhões e 600 em 2025 | 2.609.980,45 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · TOTAL DA AÇÃO · Liquidado No Ano (= 2025_PCAGO007.pdf p.1) |
| só em consultoria, 340 mil | 340.500,00 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · 3.3.90.35.00 Serviços de Consultoria · Liquidado No Ano (2024: 233.100,00) |
| em diárias, 47 mil | 46.781,00 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · 3.3.90.14.00 Diárias - Civil · Liquidado No Ano (2024: 44.971,00) |
| a dívida parcelada com o INSS fechou 2024 em 79 milhões e 800 | 79.787.108,12 | 2024_PCAGO012.pdf (Anexo XVI, Dívida Fundada Interna) | p.1 · INSS - Receita Federal - Parcelado · Saldo Atual |
| mais que tudo que a cidade arrecadou naquele ano | 79.787.108,12 > 72.970.378,05 | conta própria | Anexo XVI 2024 x Balanço 2024 |
| em 2025, caiu para 64 milhões e 400 | 64.421.672,02 | 2025_PCAGO012.pdf | p.1 · INSS - Receita Federal - Parcelado* · Saldo Atual |
| foram pagos 3 milhões | 3.012.197,73 | 2025_PCAGO012.pdf | p.1 · nota "*Houveram baixas pelo pagamento no montante R$ 3.012.197,73" |
| o resto saiu por atualização da conta | 12.353.238,37 | 2025_PCAGO012.pdf | p.1 · mesma nota "e baixas pela atualização no valor R$ 12.353.238,37" (baixa total 15.365.436,10) |
| por que as festas levaram quase 5 milhões? | 4.908.467,80 | conta própria | 1.741.331,06 + 1.497.826,97 + 1.669.309,77 (ação 2.2041 nos três anos) |

## Outras informações dos mesmos documentos (legenda e comentário fixado)
- Contribuição de iluminação pública (1.2.4.1.50.0.0): 534.819,35 (2024), 526.601,79 (2025), 380.548,89 até 09/2026 (PCMGE016 de cada ano, p.1).
- Precatórios no Anexo XVI: 23.518,63 no fim de 2024 → 2.098.129,23 no fim de 2025 (2025_PCAGO012.pdf p.1).
- Ação 1.1005 "Construção e melhoria nas redes de drenagem e esgotamento sanitário": 0,00 nos três anos (fixado 88.010, 116.651 e 140.637). Ação 1.1002 "Reforma e construção de casas populares": 0,00 liquidado nos três anos (10.500,00 empenhado em 2026).

## Pendências no TCM
- Comprovantes de repasse à Câmara (PCMGE007 da Câmara de 12/2024, 12/2025 e 09/2026) e o PCMGE018 da Câmara de 12/2025 vieram escaneados, com texto ilegível. Não usados.
- Balanço 2025: liquidado 6.300,00 maior que a soma dos PCMGE015 de dezembro (Prefeitura + Câmara).
