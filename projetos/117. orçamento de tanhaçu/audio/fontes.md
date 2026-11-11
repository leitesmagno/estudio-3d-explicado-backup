# Fontes do 117. orçamento de tanhaçu (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 14:03 e 14:28, navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta TANHACU, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-TANHACU/documentos_tcm/` (73 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "TANHAÇU" ou "TANHACU". Dois PDFs da prestação de 09/2026 da Prefeitura (razão "PMT_09.2026_Razão", classificações PCMGE018 e PCMGE064) são da Prefeitura de BELO CAMPO: ficaram fora da pasta (logs/outra_cidade/) e não foram usados; usado o razão do SIGA (2026-09_PCMGE018_2.pdf).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 383 (TANHAÇU) · Prefeitura UJ 987 · Câmara UJ 416. Sem autarquia com prestação própria (fundos de Saúde, Educação e Assistência dentro da Prefeitura e dos consolidados). Último mês entregue em 2026: 09/2026 (10/2026 "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total do documento do TCM (Balanço Orçamentário de 2024 e 2025, já sem a parte do Fundeb; em 2026, Demonstrativo consolidado da Receita de set/2026 (PCMGE066), já sem a parte do Fundeb e sem as anulações).
PDFs de 2024 do sistema GovNet/SIAFIC: a marca d'água girada se mistura ao texto; páginas e linhas lidas no texto só com as letras na posição normal (scripts/pdf2txt_reto.py, em saida/txt/). Conferido 2 vezes: 1ª depois do roteiro (contra saida/setores.json e os .json dos leitores); 2ª com cada valor exato procurado no texto do PDF citado (scripts/fontes.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/acoes.py e scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: Demonstrativo da Despesa Orçamentária ### CONSOLIDADO ### de dez/2024 (GovNet; veio na classificação PCMGE066: `2024-12_PCMGE066_1.pdf`, p.24, "Total da Despesa", Liquidação Acumulada 84.079.627,52) = Balanço (`2024_PCAGO015_1.pdf`). 66 ações.
- 2025: PCMGE065 consolidado de dez/2025 (`2025-12_PCMGE065_1.pdf`, TOTAL GERAL DA DESPESA ORÇAMENTÁRIA, Liquidado no ano 99.480.697,03) = Balanço (`2025_PCAGO015_1.pdf`). 69 ações.
- 2026 (até setembro): PCMGE065 consolidado de set/2026 (`2026-09_PCMGE065_1.pdf`, TOTAL GERAL, Liquidado no ano 121.457.246,14; Empenhado 127.518.911,27). 72 ações.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 25 + 26 (urbanismo, limpeza, saneamento, iluminação, estradas e transportes) · Administração 02 + 04 + 06 + 28 (menos a amortização) + 99 · Dívidas = ação 2030 "Amortização da dívida contratada" (28.843) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 · Esporte 27 + 23. A ação 2044 "Manutenção das ações da Secretaria e Fundo Municipal de Saúde" está na função 04 (administração) nos três anos (8.142.651,54 em 2024; 3.489.116,54 em 2025; 1.693.774,76 em 2026): fica em Administração, como o documento classifica, e a folha diz isso.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 85 milhões e 900 em 2024 | 85.856.821,94 | 2024_PCAGO015_1.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) = (I + II) · Receitas Realizadas |
| gastou 84 milhões e 100 em 2024 | 84.079.627,52 | 2024_PCAGO015_1.pdf | p.3 · SUBTOTAL DAS DESPESAS (XI) = (VIII + IX + X) · Despesas Liquidadas (= 2024-12_PCMGE066_1.pdf p.24, Total da Despesa) |
| sobrou 1 milhão e 800 | 1.777.194,42 | conta própria | 85.856.821,94 − 84.079.627,52 |
| arrecadou 102 milhões e 800 em 2025 | 102.814.361,03 | 2025_PCAGO015_1.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) = (I + II) · Receitas Realizadas (= 2025-12_PCMGE066_1.pdf, TOTAL GERAL DA RECEITA ORÇAMENTÁRIA) |
| gastou 99 milhões e 500 em 2025 | 99.480.697,03 | 2025_PCAGO015_1.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) = (VII + IX + X) · Despesas Liquidadas |
| sobraram 3 milhões e 300 | 3.333.664,00 | conta própria | 102.814.361,03 − 99.480.697,03 |
| arrecadou 123 milhões e 100 até setembro de 2026 | 123.096.324,32 | 2026-09_PCMGE066_1.pdf | p.8 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês (consolidado) |
| (conferência no SIGA) | 124.009.630,00 | 2026-09_PCMGE016_2.pdf | p.7 · TOTAL · Arrecadada até Mês 124.009.630,00 − Anulada até Mês 913.305,68 = 123.096.324,32 (conta própria). A coluna Arrecadada do SIGA já vem SEM a parte do Fundeb: a coluna Deduções (7.979.441,95) é só informativa, igual a 25% do líquido no FPM (6.154.782,58 ÷ 24.619.131,84) e no ICMS (1.596.504,92 ÷ 6.386.020,44) |
| gastou 121 milhões e 500 até setembro | 121.457.246,14 | 2026-09_PCMGE065_1.pdf | p.31 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no Ano |
| sobrou 1 milhão e 600 | 1.639.078,18 | conta própria | 123.096.324,32 − 121.457.246,14 |
| já comprometeu 127 milhões e 500 | 127.518.911,27 | 2026-09_PCMGE065_1.pdf | p.31 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Empenhado no Ano |
| ajuda da União ao Fundeb: 13 milhões e 400 em 2025 | 13.407.775,26 | 2025-12_PCMGE066_1.pdf | p.4 · 1.7.1.5.00.0.0.00.00 Transferências de Recursos de Complementação da União ao Fu · Arrecadado até Mês (Transferências de Complementação da União ao Fundeb) |
| 35 milhões e 700 só até setembro de 2026 | 35.742.356,17 | 2026-09_PCMGE066_1.pdf | p.5 · 1.7.1.5.00.0.0.00.00 Transferências de Recursos de Complementação da União ao FU · Arrecadado até Mês (= 2026-09_PCMGE016_2.pdf: 35.743.463,66 − 1.107,49 anulados) |

## Setores (soma = total do ano; soma das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado (2024-12_PCMGE066_1.pdf) | 2025 liquidado (2025-12_PCMGE065_1.pdf) | 2026 até set (2026-09_PCMGE065_1.pdf) |
|---|---|---|---|---|
| Educação | 33 e 600 · 43 e 600 · 63 e 800 | 33.621.104,38 (p.19 a 22, 11 ações) | 43.648.220,33 (p.17 a 21, 13 ações) | 63.757.121,83 (p.6 a 29, 12 ações) |
| Saúde | 11 e 400 · 17 e 900 · 21 milhões | 11.355.966,62 (p.10 a 12, 6 ações) | 17.911.181,46 (p.8 a 11, 4 ações) | 21.012.456,41 (p.13 a 17, 7 ações) |
| Obras e serviços urbanos | 11 e 700 · 11 e 900 · 13 e 800 | 11.702.242,16 (p.7 a 24, 5 ações) | 11.903.679,92 (p.3 a 7, 6 ações) | 13.809.459,70 (p.4 a 11, 10 ações) |
| Administração | 17 milhões · 11 e 400 · 8 e 100 | 17.015.918,40 (p.2 a 18, 5 ações) | 11.393.680,86 (p.1 a 8, 6 ações) | 8.122.555,44 (p.1 a 12, 6 ações) |
| Dívidas | 2 e 600 · 3 e 500 · 992 mil | 2.580.975,93 (p.4, 1 ações) | 3.464.699,06 (p.3, 1 ações) | 992.156,28 (p.4, 1 ações) |
| Assistência social | 1 e 900 · 1 e 700 · 1 e 800 | 1.890.837,28 (p.13 a 16, 7 ações) | 1.736.471,31 (p.11 a 15, 9 ações) | 1.836.144,50 (p.18 a 22, 8 ações) |
| Câmara de Vereadores | 3 e 100 · 2 e 900 · 2 e 400 | 3.071.343,53 (p.1, 2 ações) | 2.942.671,09 (p.1, 2 ações) | 2.419.402,58 (p.1, 1 ações) |
| Cultura e festas | 2 e 300 · 4 e 700 · 7 e 200 | 2.305.876,65 (p.5 a 6, 3 ações) | 4.725.884,64 (p.15 a 16, 2 ações) | 7.223.200,25 (p.30, 3 ações) |
| Agricultura e meio ambiente | 380 mil · 1 e 700 · 1 e 800 | 379.873,90 (p.23, 2 ações) | 1.743.433,36 (p.6 a 7, 2 ações) | 1.794.731,63 (p.5, 3 ações) |
| Esporte | 155 mil · 11 mil · 490 mil | 155.488,67 (p.5, 2 ações) | 10.775,00 (p.16 a 17, 2 ações) | 490.017,52 (p.7, 3 ações) |

## Achados (sacadas do fim)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| para 2026 a prefeitura previu 2 milhões e 400 para festas populares | 2.400.000,00 | 2026-09_PCMGE065_1.pdf | p.30 · TOTAL DA AÇÃO · ação 2.027 "PROMOCAO DE FESTAS POPULARES, CULTURAIS E CIVICAS" (função 13, Secretaria de Educação); Fixado (dotação inicial) na linha TOTAL DA AÇÃO; acréscimo no ano 7.171.907,13 |
| só até setembro já gastou 7 milhões e 200 | 7.166.275,25 | 2026-09_PCMGE065_1.pdf | p.30 · TOTAL DA AÇÃO · TOTAL DA AÇÃO da ação 2.027, Liquidado no Ano (dotação atual 7.536.820,69; empenhado 7.427.386,94; 5.936.780,14 + 919.020,00 em serviços de pessoa jurídica) |
| quase três vezes o previsto | 2,99 vezes | conta própria | 7.166.275,25 ÷ 2.400.000,00 |
| a assistência social inteira ficou em 1 milhão e 800 (até setembro) | 1.836.144,50 | conta própria | soma das ações da função 08 no 2026-09_PCMGE065_1.pdf |
| a Câmara recebeu 3 milhões e 700 da prefeitura em 2025 | 3.665.443,21 | 2025-12_PCMGE018_1.pdf | p.11 · 3.5.1.1.2.02.00.02.00.000 REPASSES CONCEDIDOS AO PODER LEGISLATIVO · razão da Prefeitura (PMT_12.2025), Debitado até o mês |
| e devolveu 723 mil | 722.772,12 | 2025-12_PCMGE018_1.pdf | p.12 · 4.5.1.1.2.02.00.02.00.000 REPASSES RECEBIDOS DO PODER LEGISLATIVO · razão da Prefeitura, Creditado até o mês (3.665.443,21 − 722.772,12 = 2.942.671,09, o liquidado da Câmara em 2025, centavo a centavo: conta própria; o razão da própria Câmara veio escaneado) |
| gastou 220 mil com consultoria em 2025 | 219.500,00 | 2025-12_PCMGE065_1.pdf | p.1 · 3.3.90.35.00 - 15000000 Serviços de Consultoria · Câmara, ação 2.001, elemento 3.3.90.35.00, Liquidado no Ano |
| e 241 mil só até setembro de 2026 | 241.325,00 | 2026-09_PCMGE065_1.pdf | p.1 · 3.3.90.35.00 - 15000000 Serviços de Consultoria · Câmara, ação 2.001, elemento 3.3.90.35.00, Liquidado no Ano (empenhado 305.025,00) |
| em diárias, 137 mil em 2025 | 136.780,00 | 2025-12_PCMGE065_1.pdf | p.1 · 3.3.90.14.00 - 15000000 DIÁRIAS - CIVIL · Câmara, ação 2.001, elemento 3.3.90.14.00, Liquidado no Ano |
| e 229 mil até setembro de 2026 | 229.000,00 | 2026-09_PCMGE065_1.pdf | p.1 · 3.3.90.14.00 - 15000000 DIÁRIAS - CIVIL · Câmara, ação 2.001, elemento 3.3.90.14.00, Liquidado no Ano |
| a dívida parcelada com o INSS começou 2024 em 44 milhões e 200 (curto prazo) | 900.000,00 | 2024_PCAGO012_1.pdf | p.1 · 2.1.1.4.1.06.00 - CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - DÉBITO PARCELADO · Anexo 16, Contribuições previdenciárias débito parcelado, Saldo Anterior |
| (longo prazo) | 43.303.213,26 | 2024_PCAGO012_1.pdf | p.1 · 2.2.1.4.1.01.00 - CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - DÉBITO PARCELADO · Saldo Anterior; 900.000,00 + 43.303.213,26 = 44.203.213,26 (conta própria) |
| subiu para 46 milhões e 900 no fim de 2024 | 45.303.444,59 | 2024_PCAGO012_1.pdf | p.1 · 2.2.1.4.1.01.00 - CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - DÉBITO PARCELADO · Saldo Atual; 1.600.000,00 (curto prazo) + 45.303.444,59 = 46.903.444,59 (conta própria) |
| e fechou 2025 de volta em 44 milhões e 200 | 40.981.479,89 | 2025_PCAGO012_1.pdf | p.1 · 2.2.1.4.1.01.00.00.00.000 CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - DÉBITO PARCELADO · Anexo XVI, Saldo Atual; 3.233.694,50 (curto prazo, 2.1.1.4.1.06.01) + 40.981.479,89 = 44.215.174,39 (conta própria). Dívida fundada total: 45.447.165,77 → 48.061.301,30 → 45.533.188,97 |

## Câmara nas folhas
- 2024: recebeu 3.071.454,48 da Prefeitura (2024-12_PCMGE064_1.pdf, razão consolidado: Repasse recebido 19.432.767,56 − 16.361.313,08 da Prefeitura e fundos, conta própria) e gastou 3.071.343,53.
- 2026 até setembro: recebeu 3.168.855,18 e devolveu 552.000,00 (2026-09_CAMARA_PCMGE018_1.pdf, 4.5.1.1.2.02.00 Repasse recebido e 3.5.1.1.2.09.00 Devolução de transferências); gastou 2.419.402,58 (empenhou 3.354.665,96).

## Pendências no TCM
- Prestação 09/2026 da Prefeitura: o razão "PMT_09.2026_Razão" (PCMGE018 e PCMGE064) é da Prefeitura Municipal de Belo Campo (CNPJ 14.237.333/0001-43).
- 12/2024: as classificações PCMGE065 e PCMGE066 da Prefeitura vieram trocadas (receita no 065, despesa no 066).
- Razões da Câmara de 12/2024 e 12/2025 escaneados (texto ilegível): usados os razões da Prefeitura.
