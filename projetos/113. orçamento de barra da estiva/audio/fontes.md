# Fontes do 113. orçamento de barra da estiva (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 09:41 e 10:07, pelo navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta BARRA-DA-ESTIVA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-BARRA-DA-ESTIVA/documentos_tcm/` (54 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "BARRA DA ESTIVA" no cabeçalho, menos o comprovante bancário de repasse à Câmara de 12/2024 (PCMGE007 da Câmara, imagem sem texto; não usado para valores).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 34 (BARRA DA ESTIVA) · Prefeitura UJ 638 · Câmara UJ 68. Não há autarquia com prestação própria (os fundos de Saúde, Educação e Assistência Social estão dentro da Prefeitura). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 aparece como "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário de 2024 e 2025; PCMGE066 consolidado de 09/2026, já sem as deduções do Fundeb).
O Balanço e os PCMGE065 consolidados (Prefeitura + fundos + Câmara) fecham centavo a centavo entre si nos três anos.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: PCMGE065 consolidado SIGA de 12/2024 (`2024-12_PCMGE065.pdf`, p.50, total da despesa, Liquidada até o mês: 110.416.866,77) = Balanço (`2024_PCAGO015.pdf`, p.2, Despesas Liquidadas). Leitor: scripts/acoes_cons.py (81 ações). O Anexo IX de 2024 (`2024_PCAGO007.pdf`, p.4) é por EMPENHADO (110.510.866,77).
- 2025: PCMGE065 consolidado de 12/2025 (`2025-12_PCMGE065.pdf`, p.24, TOTAL GERAL DA DESPESA ORÇAMENTÁRIA, Liquidado no ano: 110.900.911,57) = Balanço (`2025_PCAGO015.pdf`, p.2). Leitor: scripts/acoes065m.py (80 ações).
- 2026 (até setembro): PCMGE065 consolidado de 09/2026 (`2026-09_PCMGE065.pdf`, p.30, TOTAL GERAL, Liquidado no ano 103.068.046,66; Empenhado no ano 138.049.872,88). 100 ações.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 26 (urbanismo, saneamento, transporte) · Administração 02 + 04 · Dívidas 28 (subfunções 843 e 846: parcelamento da dívida e sentenças judiciais) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 113 milhões em 2024 | 113.008.010,35 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024_PCAGO008.pdf, Anexo X) |
| gastou 110 milhões e 400 em 2024 | 110.416.866,77 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.50) |
| sobraram 2 milhões e 600 | 2.591.143,58 | conta própria | 113.008.010,35 − 110.416.866,77 (o Balanço mostra "Superávit (XIII) 2.497.143,58" pelo empenhado, p.2) |
| arrecadou 128 milhões em 2025 | 127.990.169,68 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025_PCAGO008.pdf, Anexo X, TOTAL GERAL) |
| gastou 110 milhões e 900 em 2025 | 110.900.911,57 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.24, TOTAL GERAL, Liquidado no ano) |
| sobraram 17 milhões e 100 | 17.089.258,11 | conta própria | 127.990.169,68 − 110.900.911,57 (o Balanço mostra "Superávit (XIII) 15.048.186,18" pelo empenhado 112.941.983,50, p.2) |
| arrecadou 107 milhões até setembro de 2026 | 106.957.527,93 | 2026-09_PCMGE066.pdf | p.8 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até o mês, já sem as deduções do Fundeb |
| gastou 103 milhões e 100 até setembro | 103.068.046,66 | 2026-09_PCMGE065.pdf | p.30 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no ano |
| sobraram 3 milhões e 900 | 3.889.481,27 | conta própria | 106.957.527,93 − 103.068.046,66 |
| já comprometeu 138 milhões | 138.049.872,88 | 2026-09_PCMGE065.pdf | p.30 · TOTAL GERAL · Empenhado no ano |

## Setores (soma = total do ano; somas das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado (2024-12_PCMGE065.pdf) | 2025 liquidado (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 45 e 300 · 45 e 100 · 40 e 900 | 45.295.672,03 (p.41 a 49, função 12) | 45.059.946,06 (p.20 a 23) | 40.941.455,86 (p.22 a 29) |
| Saúde | 22 e 600 · 23 e 800 · 21 e 400 | 22.567.809,35 (p.22 a 30, função 10) | 23.813.947,42 (p.11 a 14) | 21.379.238,83 (p.12 a 16) |
| Obras e serviços urbanos | 19 e 300 · 17 e 300 · 16 e 900 | 19.331.886,86 (p.6 a 14, funções 15, 17 e 26) | 17.346.405,60 (p.6 a 9) | 16.873.005,62 (p.7 a 11) |
| Administração | 9 e 100 · 10 e 300 · 8 e 900 | 9.102.714,03 (p.1 a 5, função 04) | 10.290.730,75 (p.2 a 6, funções 02 e 04) | 8.929.918,56 (p.2 a 6) |
| Dívidas | 3 e 700 · 3 e 600 · 1 e 700 | 3.651.507,47 (p.6, função 28: parcelamento 3.630.414,06 + sentenças 21.093,41) | 3.583.611,86 (p.5: 3.398.599,52 + 185.012,34) | 1.741.435,98 (p.5 a 6: 1.572.509,09 + 168.926,89) |
| Assistência social | 1 e 600 · 2 milhões · 1 e 700 | 1.606.922,74 (p.33 a 37, função 08) | 1.989.676,95 (p.15 a 18) | 1.684.957,86 (p.20, TOTAL DO ÓRGÃO, Liquidado no ano) |
| Câmara de Vereadores | 3 e 800 · 3 e 300 · 2 e 600 | 3.835.337,11 (p.18 a 19, função 01) | 3.345.938,83 (p.1, Poder Legislativo) | 2.634.316,92 (p.1, Poder Legislativo) |
| Cultura e festas | 3 e 800 · 3 e 700 · 6 e 900 | 3.824.204,39 (p.15 a 16, função 13) | 3.651.758,58 (p.4) | 6.870.016,56 (p.4 a 5) |
| Agricultura e meio ambiente | 1 e 200 · 1 e 700 · 2 milhões | 1.177.655,36 (p.11 a 12, funções 20 e 18) | 1.715.958,66 (p.8 a 9) | 1.985.530,41 (p.9 a 10) |
| Esporte | 23 mil · 103 mil · 28 mil | 23.157,43 (p.16 a 17, função 27) | 102.936,86 (p.4) | 28.170,06 (p.5) |

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| as festas e eventos levaram 3 milhões e 500 em 2024 | 3.456.272,63 | 2024-12_PCMGE065.pdf | p.16 · ação 13.392 "Apoio e realização de eventos culturais e festejos tradicionais" (2.14.13.392.6.2.2020) · Total da Ação de Governo · Liquidada até o mês (serviços de pessoa jurídica 3.217.768,00) |
| e 3 milhões e 500 em 2025 | 3.515.693,12 | 2025-12_PCMGE065.pdf | p.4 · ação 13.392.6.2.020 (mesmo nome) · TOTAL DA AÇÃO · Liquidado no ano (empenhado 3.737.690,62) |
| em 2026, só até setembro, 6 milhões e 600 | 6.580.869,44 | 2026-09_PCMGE065.pdf | p.4 · ação 13.392.0022.2.020 (mesmo nome) · TOTAL DA AÇÃO · Liquidado no ano (empenhado 7.020.609,44; serviços de pessoa jurídica 5.685.839,00 + 510.600,00 + 80.000,00) |
| o orçamento previa 5 milhões e 500 | 5.511.000,00 | 2026-09_PCMGE065.pdf | p.4 · mesma linha TOTAL DA AÇÃO · Fixado (dotação inicial; dotação atual 7.345.000,00) |
| é quase quatro vezes toda a assistência social do ano | 1.684.957,86 | 2026-09_PCMGE065.pdf | p.20 · TOTAL DO ÓRGÃO da Assistência Social · Liquidado no ano · 6.580.869,44 ÷ 1.684.957,86 = 3,9 (conta própria) |
| a ajuda de emergência para as famílias ficou em 46 mil | 45.952,24 | 2026-09_PCMGE065.pdf | p.20 · ação 8.244.0001.2.030 "Gestão de benefícios eventuais" · TOTAL DA AÇÃO · Liquidado no ano (previsto 144.000,00; empenhado 151.804,44). Benefícios eventuais = ajuda em situação de emergência ou vulnerabilidade (cesta, auxílio-funeral, natalidade). |
| pavimentação de vias: previsto 2 milhões e 400 em 2025 | 2.379.700,00 | 2025-12_PCMGE065.pdf | p.6 · ação 15.451.9.1.009 "Pavimentação de vias e melhorias de espaços públicos" · TOTAL DO PROJETO · Fixado (empenhado e liquidado 0,00) |
| e 1 milhão e 100 em 2026 | 1.099.000,00 | 2026-09_PCMGE065.pdf | p.7 · ação 15.451.0027.1.009 (mesmo nome) · TOTAL DO PROJETO · Fixado (dotação atual 0,00; empenhado e liquidado 0,00) |
| gasto: zero nos dois anos | 0,00 | os dois arquivos acima | Empenhado e liquidado 0,00 nos dois anos. Procurado "PAVIM", "ASFALT", "CALÇA" e "VIAS" nos nomes de todas as ações: nenhuma outra ação de pavimentação. Em 2024 a mesma ação teve 1.196.801,46 liquidados (2024-12_PCMGE065.pdf). Obs.: a ação "Obras de infraestrutura" (15.451.9.1.010) teve 69.929,52 em 2025 e 478.384,51 em 2026, e a "Manutenção das estradas vicinais" ficou com zero mas o dinheiro do transporte foi para "Gestão dos serviços de transportes" (por isso as estradas NÃO entraram na fala). |
| a Câmara recebeu 4 milhões e 100 da prefeitura até setembro de 2026 | 4.115.626,74 | 2026-09_CAMARA_PCMGE018.pdf | p.6 · conta 4.5.1.1.2.02 REPASSE RECEBIDO · Saldo atual credor (9 parcelas de 457.291,86; comprovante 2026-09_PCMGE008.pdf: 457.291,86 em 18/09/2026) |
| e já devolveu 1 milhão | 1.011.500,00 | 2026-09_CAMARA_PCMGE018.pdf | p.6 · conta 3.5.1.1.2.09 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o mês (= 2026-09_PCMGE018.pdf da Prefeitura, p.19, 4.5.1.1.2.09 DEVOLUÇÃO DE TRANSFERÊNCIAS recebida, 1.011.500,00) |
| em 2025, gastou 276 mil com consultoria | 276.000,00 | 2025-12_PCMGE065.pdf | p.1 · Poder Legislativo, ação 1.122.1.2.001 "Gestão dos serviços administrativos da Câmara Municipal" · 3.3.90.35.00 SERVIÇOS DE CONSULTORIA · Liquidado no ano |
| a dívida fechou 2024 em 37 milhões e 900 | 37.911.264,66 | 2024_PCAGO012.pdf (Anexo XVI, dívida fundada) | p.1 · TOTAIS · Saldo atual |
| e fechou 2025 em 77 milhões e 500 | 77.538.144,29 | 2025_PCAGO012.pdf (Anexo XVI) | p.1 · TOTAIS · Saldo atual (inscrição no ano 47.397.502,08) |
| mais que o dobro | 2 × 37.911.264,66 = 75.822.529,32 | conta própria | 77.538.144,29 é maior que 75.822.529,32 |
| só com o INSS, 73 milhões e 900 | 73.948.643,37 | 2025_PCAGO012.pdf | p.1 · 2.2.1.4.3.01.01.01 INSS - DÉBITO PARCELADO 70.448.643,37 + 2.1.1.4.3.01.02.00.01 DÉBITO PARCELADO-INSS 3.500.000,00 · Saldo atual (soma: conta própria) |
| (folha) INSS parcelado no fim de 2024 | 33.792.264,18 | 2024_PCAGO012.pdf | p.1 · 30.992.264,18 + 2.800.000,00 (conta própria) |

## Câmara nas folhas (razões da Câmara, PCMGE018)
- 2024: o PCMGE015/018 que a Câmara mandou na prestação de 12/2024 é de NOVEMBRO (título "11_2024"): repasse recebido até novembro 3.584.009,77 (`2024-12_CAMARA_PCMGE018.pdf`, p.7, 4.5.1.1.2.02, 11 × 325.819,07). O gasto do ano (3.835.337,11) vem do consolidado da Prefeitura.
- 2025: repasse recebido 5.343.033,15 (`2025-12_CAMARA_PCMGE018.pdf`, p.5, 4.5.1.1.2.02, Debitado no mês de encerramento; = 13 × 411.002,55) e devolução 1.586.091,77 (p.5, 3.5.1.1.2.09, Debitado até o mês). A Prefeitura registra 1.637.667,97 de devoluções recebidas no ano (`2025-12_PCMGE018.pdf`, 4.5.1.1.2.09), que inclui outras devoluções entre unidades.
- 2026: 4.115.626,74 recebidos e 1.011.500,00 devolvidos até setembro (acima).

## Receita nas folhas (scripts/receita.py → saida/receita_AAAA.json; soma = total)
- 2024 e 2025: Anexo X (`2024_PCAGO008.pdf`, `2025_PCAGO008.pdf`), coluna "Arrecadado Ano". FPM, ICMS e IPVA vêm sem a parte do Fundeb (o total do Anexo X = Balanço).
- 2026: `2026-09_PCMGE066.pdf`, coluna "Arrecadado até Mês" (FPM, ICMS e IPVA já com a linha de dedução do Fundeb).
- "Outras receitas" = total − soma dos grupos (conta própria).

## O que ficou de fora (para não enganar)
- Estradas vicinais: zero na ação própria em 2025 e 2026, mas a dotação foi para "Gestão dos serviços de transportes" (mesma subfunção 782), que dobrou. Não entrou.
- Sem nome de gestor, de empresa ou de pessoa.
