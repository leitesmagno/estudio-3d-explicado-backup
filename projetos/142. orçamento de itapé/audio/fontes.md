# Fontes do 142. orçamento de itapé (BA)

Pedido de seguidor (e-mail do site, 10/11/2026 16:51): quanto a prefeitura gastou com transporte escolar e com a manutenção dos aparelhos de ar-condicionado das secretarias e dos postos de saúde.

Consulta: 10 e 11/11/2026 (downloads no e-TCM entre 23:59 e 00:36, navegador do app, recebedor 127.0.0.1:8778, pasta ITAPE, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITAPE/documentos_tcm/` (cada PDF com o texto extraído ao lado, .txt).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 192 (ITAPÉ) · Prefeitura UJ 796 ("Prefeitura Municipal de ITAPE", com o Fundo Municipal de Saúde dentro da mesma prestação) · Câmara UJ 229 ("Camara Municipal de ITAPÉ"). Último mês entregue: 09/2026 (10/2026 "Pendente"). Município e competência conferidos dentro de cada PDF.
"Gastou" = despesa LIQUIDADA. O total de cada ano junta Prefeitura (com o Fundo de Saúde) + Câmara, que é o que o TCM consolida (PCMGE065/PCMGE066 consolidados e Balanço Orçamentário). Receita = total que o documento traz (Balanço 2024 e 2025; consolidado de 09/2026). Atenção: o Balanço de Itapé mostra a receita BRUTA, sem tirar a parte que vai para o Fundeb (5.631.781,95 em 2024 e 6.128.776,68 em 2025, coluna "Deduções até Mês" do PCMGE016); o vídeo segue o Balanço.
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, receita_*.json e ar_condicionado.json); 2ª com cada valor exato procurado no texto do PDF (scripts/pag.py, que devolve página e linha) ou lido a olho na imagem (PCMGE056 escaneados). Somas, diferenças e arredondamentos marcados como "conta própria".

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Itapé arrecadou 59 milhões e 400 em 2024 | 59.418.863,16 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.8, TOTAL: arrecadada 59.540.884,20 − anulada 122.021,04) |
| 61 milhões e 600 em 2025 | 61.619.243,75 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas |
| 51 milhões e 100 até setembro de 2026 | 51.124.777,34 | 2026-09_PCMGE066.pdf | p.11 · TOTAL · arrecadada até mês 51.130.776,77 − anulada 5.999,43 (conta própria) |
| Em 2025, o FPM trouxe 23 milhões e 500 | 23.517.422,81 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (bruto; dedução do Fundeb 5.094.309,54) |
| E o Fundeb, com a ajuda da União, 20 milhões e 600 | 20.576.111,09 | 2025-12_PCMGE016.pdf | conta própria: p.5 · 1.7.5.0.00.0.0 (Fundeb) 11.110.538,19 + p.4 · 1.7.1.5.00.0.0 (Complementação da União) 9.465.572,90 |
| 2024: gastou 55 milhões e 100 | 55.147.501,09 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf: Executivo 43.039.042,12 p.65 + Legislativo 1.760.330,15 p.67 + Fundo de Saúde 10.348.128,82 p.85) |
| sobraram 4 milhões e 300 | 4.271.362,07 | conta própria | 59.418.863,16 − 55.147.501,09 |
| 2025: gastou 63 milhões e 200 | 63.151.562,32 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.70, p.71 e p.89) |
| gastou 1 milhão e 500 a mais do que arrecadou | 1.532.318,57 | 2025_PCAGO015.pdf | p.1 · DÉFICIT (VII) (= 63.151.562,32 − 61.619.243,75) |
| 2026, até setembro: gastou 51 milhões e 500 | 51.519.742,71 | 2026-09_PCMGE065.pdf | p.94 · TOTAL · Liquidada até o Mês (Executivo 40.484.060,45 p.71 + Legislativo 1.784.803,29 p.72 + Fundo de Saúde 9.250.878,97 p.94) |
| gastou 395 mil a mais | 394.965,37 | conta própria | 51.519.742,71 − 51.124.777,34 |
| já comprometeu 55 milhões e 600 | 55.561.975,92 | 2026-09_PCMGE065.pdf | p.94 · TOTAL · Empenhada até o Mês |

## Setores (soma = total do ano, centavo a centavo; scripts/setores.py → saida/setores.json, conta própria)
Prefeitura: 2024-12_PCMGE015.pdf p.80 (Total do Poder, Liquidações até Mês 53.387.170,94) · 2025-12_PCMGE015.pdf p.81 (60.868.409,79) · 2026-09_PCMGE015.pdf p.88 (49.734.939,42). Câmara: 2024-12_CAMARA_PCMGE015.pdf p.4 (1.760.330,15) · 2025-12_CAMARA_PCMGE015.pdf p.1 (TOTAL GERAL, Despesa Liquidada até o Período 2.283.152,53) · 2026-09_CAMARA_PCMGE015.pdf p.3 (1.784.803,29).
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set | Como |
|---|---|---|---|---|---|
| Educação | 25 e 200 · 27 milhões · 23 e 800 | 25.176.712,22 | 26.975.342,12 | 23.797.634,65 | função 12 (com a ação de transporte escolar e sem 17.029,61 de palco em 2024) |
| Saúde | 10 e 300 · 11 e 700 · 9 e 300 | 10.348.128,82 | 11.721.524,54 | 9.250.878,97 | função 10 (Fundo Municipal de Saúde) |
| Administração | 8 e 400 · 8 e 100 · 7 e 700 | 8.370.836,50 | 8.133.955,37 | 7.675.050,74 | funções 02 e 04 (sem obras, esporte e cultura; sem 681.728,58 de palco em 2024 e 50.676,45 em 2026) |
| Obras e serviços urbanos | 4 e 200 · 5 milhões · 3 e 900 | 4.181.104,03 | 4.977.779,92 | 3.932.874,82 | funções 15 e 26 + Diretoria de Obras e Planejamento / Infraestrutura e Planejamento Urbano / Desenvolvimento Urbano (função 04 ou 20) |
| Dívidas e encargos | 1 e 800 · 3 e 700 · 1 e 300 | 1.844.663,49 | 3.725.288,52 | 1.272.012,88 | função 28 (amortização da dívida interna) |
| Assistência social | 1 e 800 · 1 e 200 · 973 mil | 1.811.509,96 | 1.200.075,26 | 973.273,14 | função 08 |
| Câmara de Vereadores | 1 e 800 · 2 e 300 · 1 e 800 | 1.760.330,15 | 2.283.152,53 | 1.784.803,29 | PCMGE015 da Câmara |
| Festas e eventos | 1 e 400 · 3 e 400 · 2 e 100 | 1.405.897,69 | 3.408.408,64 | 2.060.982,20 | regra 99 (abaixo) |
| Cultura | nada (fora as festas) · 51 reais · 97 mil | 0,00 | 50,71 | 96.639,44 | função 13 sem as ações de festas + Diretoria da Cultura e Turismo (função 04) |
| Agricultura e meio ambiente | 237 mil · 721 mil · 553 mil | 237.018,23 | 721.084,71 | 553.451,78 | funções 18 e 20 |
| Esporte | 11 mil · 4 mil e 900 · 122 mil | 11.300,00 | 4.900,00 | 122.140,80 | função 27 + Diretoria de Esporte(s) (função 04) |

### Festas e eventos (regra 99: de onde veio cada parte)
- Festas e eventos 2024: R$ 1.405.897,69 = ação 6.17.13.392.2000.2.2019 "Promoção e Realização de Festas Populares" 707.139,50 (2024-12_PCMGE015.pdf p.40, Total do Projeto/Atividade, Liquidações até Mês) + palco 3.3.90.39.19 "Locação, Confecção e Montagem de Cenários, Palcos" 681.728,58 na Manutenção dos Serviços Administrativos (p.6) + palco 17.029,61 na Secretaria de Educação e Cultura (p.21). (No plano de contas de 2024, 3.3.90.39.19 é palco; de 2025 em diante o mesmo código é "Manutenção e conservação de veículos" e NÃO entra.)
- Festas e eventos 2025: R$ 3.408.408,64 = ação 6.17.13.392.2000.2.2019 1.908.676,73 (2025-12_PCMGE015.pdf p.32) + ação 6.17.13.392.2000.2.2114 "Realização dos Festejos Juninos" 1.499.731,91 (p.33). Previsto no início do ano: 1.220.200,00 + 0,00.
- Festas e eventos 2026 (até setembro): R$ 2.060.982,20 = ação 106.604.13.392.2.2.2038 "Realização dos Festejos Juninos" 1.954.661,05 (2026-09_PCMGE015.pdf p.50; dentro: bandas 3.3.90.39.94 1.414.161,65 e palco 3.3.90.39.95 451.329,72) + ação 106.604.13.392.2.2.2037 "Promoção e Realização de Festas Populares" 55.644,70 (p.49) + palco 3.3.90.39.95 da Secretaria de Gestão 50.676,45 (p.11).
- Cultura: 2024 nenhuma ação própria de cultura com gasto (a secretaria é de Educação e Cultura; só a ação de festas, que está em Festas e eventos); 2025 50,71 (Manutenção da Diretoria da Cultura e Turismo, 2025-12_PCMGE015.pdf); 2026 96.639,44 (Lei Aldir Blanc 90.511,49 + Diretoria da Cultura e Turismo 6.127,95).

## Câmara
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| A Câmara recebeu 1 milhão e 800 da prefeitura em 2024 | 1.770.116,30 | 2024-12_PCMGE064.pdf (razão consolidado) | p.13 · 3.5.1.1.2.02.00.002 REPASSES CONCEDIDOS AO PODER LEGISLATIVO · até o mês |
| e 2 milhões e 300 em 2025 | 2.293.218,01 | 2025-12_CAMARA_PCMGE053.pdf (Disponibilidades financeiras) | p.1 · conta 253523-8 Banco do Brasil · Entrada Até (2.102.116,50 até novembro no 2025-12_CAMARA_PCMGE058.pdf + 191.101,51 em dezembro). O PCMGE018/064 da Prefeitura de 12/2025 veio só com a capa. |
| Devolveu 8 mil e 900 (2024) | 8.853,13 | 2024-12_PCMGE064.pdf | p.13 · 3.5.1.1.2.09.00.000 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS |
| e 8 mil e 300 (2025) | 8.250,44 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · TRANSFERÊNCIAS FINANCEIRAS CONCEDIDAS · 35112090000 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS |
| (tela) 2026 até set: recebeu 1 milhão e 900 | 1.928.266,20 | 2026-09_PCMGE064.pdf | p.13 · 3.5.1.1.2.02.00.002 REPASSES CONCEDIDOS AO PODER LEGISLATIVO |
| (folha) consultoria da Câmara | 161.000,00 (2024) · 248.500,00 (2025) · 156.500,00 (2026 até set) | 2024-12_CAMARA_PCMGE015.pdf (3.3.90.35.01 78.000,00 + 3.3.90.35.03 83.000,00) · 2025-12_CAMARA_PCMGE015.pdf p.1 (33903500000) · 2026-09_CAMARA_PCMGE015.pdf (3.3.90.35.99) | Liquidado até o mês |

## Transporte escolar (pergunta do seguidor)
A despesa está na ação "Manutenção do Transporte Escolar do Ensino Fundamental" (Educação). A do Ensino Infantil não teve gasto nos três anos. Conferência anti fake news: em dez/2024 (PCMGE056 digital), os pagamentos com histórico "TRANSPORTE DE ALUNOS DA ZONA RURAL E DISTRITOS (LINHA ...) ATÉ A SEDE" somam 61.487,99, iguais aos pagamentos do mês na ação (2024-12_PCMGE015.pdf p.27, elemento 3.3.90.39.99, Pagamentos no Mês). Nenhum transporte de alunos ou universitários achado fora dessa ação nos PCMGE056 de 2024 a 2026.
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Em 2024, 457 mil | 456.843,40 | 2024-12_PCMGE015.pdf | p.27 · 6.10.12.361.4000.2.2093 · Total do Projeto/Atividade · Liquidações até Mês (combustível PNATE 18.889,18 + serviços 437.954,22) |
| Em 2025, 314 mil | 313.904,33 | 2025-12_PCMGE015.pdf | p.19 · 6.10.12.361.4000.2.2093 · 3.3.90.39.99 · Liquidações até Mês (único elemento com gasto) |
| Em 2026, até setembro, 280 mil | 280.209,63 | 2026-09_PCMGE015.pdf | p.29 · 106.601.12.361.9.2.2022 · Total do Projeto/Atividade · Liquidações até Mês (dotação inicial 878.400,00, atual 311.200,00) |
| (pergunta final) se o transporte escolar ficou em 314 mil em 2025 | 313.904,33 | idem | idem |
| por que as festas e eventos levaram 3 milhões e 400 | 3.408.408,64 | 2025-12_PCMGE015.pdf | p.32 + p.33 (conta própria, acima) |

## Ar-condicionado (pergunta do seguidor)
Fonte: PCMGE056 (Relação de pagamentos) de todos os meses de jan/2024 a set/2026 (`AAAA-MM_PCMGE056.pdf`). Quase todos escaneados: lidos com OCR do macOS e CADA pagamento conferido a olho na imagem (valor, data, processo, secretaria). Credor: prestadora de "limpeza, manutenção preventiva e corretiva e instalação de ar condicionado, do sistema de climatização, das secretarias do município" (CNPJ 19.529.935/0001-98; Processo Adm. 018/2024, Dispensa de Licitação 018/2024, Contrato 026/2024 e aditivos). O nome da prestadora não vai ao vídeo. O PDF NÃO separa limpeza, manutenção e instalação (dito na fala e na folha). Os pagamentos de ar-condicionado de VEÍCULOS (ex.: 2024-04 p.28, oficina mecânica) ficaram de fora.
Validação: em 2026 a soma por secretaria bate centavo a centavo com o elemento 3.3.90.39.17 "Manutenção e conservação de máquinas e equipamentos" do 2026-09_PCMGE015.pdf (Gestão 7.605,00 p.11 · Educação 13.780,00 p.26 · Saúde 4.765,00 p.65); em 2025, a Educação também (10.060,00, 2025-12_PCMGE015.pdf p.16); em 2025 a Gestão e a Saúde foram lançadas em 3.3.90.39.99.
| Valor dito | Valor exato | Composição (conta própria; lista completa em saida/ar_condicionado.py) |
|---|---|---|
| Foram 38 mil e 900 em 2024 | 38.890,00 | Administração 14.915,00 + Saúde 16.920,00 + Bem-Estar Social 4.590,00 + Educação 2.465,00 |
| 33 mil em 2025 | 33.010,00 | Gestão 15.140,00 + Educação 10.060,00 + Saúde 7.810,00 |
| 26 mil e 200 até setembro de 2026 | 26.150,00 | Gestão 7.605,00 + Educação 13.780,00 + Saúde 4.765,00 |
| Só na saúde, 16 mil e 900 (2024) | 16.920,00 | 2024-06 p.32 proc. 594 6.140,00 · 2024-07 p.27 proc. 708 4.480,00 · 2024-08 p.26 proc. 829 1.935,00 · 2024-10 p.30 proc. 1055 1.755,00 · 2024-11 p.33 proc. 1185 2.610,00 |
| 7 mil e 800 (2025) | 7.810,00 | 2025-04 p.32 proc. 353 2.565,00 · 2025-05 p.27 proc. 449 885,00 · 2025-07 p.32 proc. 677 640,00 · 2025-09 p.37 proc. 853 900,00 · 2025-10 p.32 proc. 1058 1.375,00 · 2025-12 p.36 proc. 1244 1.445,00 |
| e 4 mil e 800 (2026 até set) | 4.765,00 | 2026-02 p.23 proc. 202 1.775,00 · 2026-04 p.34 proc. 430 860,00 · 2026-05 p.37 proc. 532 795,00 · 2026-07 p.53 proc. 817 1.335,00 |
| A partir de junho de 2024 | 1º pagamento achado: 10/06/2024 | 2024-06_PCMGE056.pdf p.6 · proc. 1667 · 3.040,00 (Administração); nenhum de jan a mai/2024 |

Demais pagamentos (página do PDF · processo · valor · secretaria): 2024-06 p.6 1667 3.040,00 Adm · p.11 1737 2.465,00 Educação · p.12 1746 1.290,00 Bem-Estar · 2024-08 p.8 2359 2.735,00 Adm · 2024-09 p.7 2659 2.490,00 Adm · p.8 2667 1.300,00 Adm · 2024-10 p.8 2986 1.060,00 Adm · 2024-11 p.15 3421 1.865,00 Adm · 3422 1.500,00 Bem-Estar · 3423 1.800,00 Bem-Estar · 3424 2.425,00 Adm · 2025-02 p.9 261 3.770,00 Gestão · 2025-03 p.10 560 3.720,00 Gestão · 2025-04 p.14 889 1.695,00 Gestão · 2025-05 p.11 1175 1.040,00 Gestão · p.12 1181 1.630,00 Educação · 2025-07 p.15 1792 2.145,00 Educação · 1793 1.505,00 Gestão · 2025-09 p.9 2261 1.345,00 Gestão · 2263 2.565,00 Educação · 2025-10 p.14 2802 2.600,00 Educação · p.15 2803 1.200,00 Gestão · 2025-12 p.3 3275 865,00 Gestão · 3276 1.120,00 Educação · 2026-02 p.14 527 1.930,00 Gestão · p.15 541 3.570,00 Educação · 2026-04 p.11 1163 1.290,00 Gestão · p.12 1166 2.555,00 Educação · 2026-05 p.5 1462 2.785,00 Gestão · p.8 1495 4.330,00 Educação · 2026-07 p.18 2171 3.325,00 Educação · p.22 2111 1.600,00 Gestão.

## Pendências no TCM (não mudam números ditos)
- PCMGE018 e PCMGE064 da Prefeitura de 12/2025: só a capa (sem o razão). O repasse de 2025 à Câmara saiu do PCMGE053 da Câmara.
- PCMGE058 da Câmara na prestação de 12/2025 fala de novembro de 2025.
- PCMGE056 da Prefeitura escaneados (quase todos os meses), com páginas em sentidos diferentes.
- Receita PNATE (1.7.1.4.53) zerada em 2024 e 2025 no PCMGE016 (não usada no vídeo).
