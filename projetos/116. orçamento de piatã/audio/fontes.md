# Fontes do 116. orçamento de piatã (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 13:38 e 14:03, no navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta PIATA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-PIATA/documentos_tcm/` (50 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "PIATÃ" ou "PIATA" no cabeçalho, menos `2025_PCAGO018.pdf` (declaração "NÃO HOUVE" da prestação anual da Prefeitura de Piatã, sem cabeçalho; não usada para valores). Competência de cada PDF mensal conferida na linha "Competência:" ou "Mês:".
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 298 (PIATÃ) · Prefeitura UJ 902 ("Prefeitura Municipal de PIATA") · Câmara UJ 330 ("Camara Municipal de PIATÃ"). Não há autarquia com prestação própria (os fundos de Saúde, Educação e Assistência Social estão dentro da Prefeitura e dos consolidados). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 aparece como "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz, já sem a parte do Fundeb (Balanço Orçamentário de 2024 e 2025; em 2026, Demonstrativo da Receita consolidado de set/2026).
O Balanço e os PCMGE065 consolidados (Prefeitura + fundos + Câmara) fecham centavo a centavo entre si em 2024 e 2025. Em 2026, o PCMGE065 consolidado fecha com o PCMGE015 da Prefeitura (Câmara zerada nele) + o PCMGE015 da Câmara: 80.021.241,56 + 2.259.691,91 = 82.280.933,47.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json do leitor); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- Leitor: scripts/acoes065p.py (lê o "Demonstrativo da Despesa Orçamentária" consolidado pela posição das colunas; a marca d'água de assinatura, que vem espelhada no PDF, é descartada). 90 ações por ano; a soma dos elementos de cada ação bate com a linha "Total por Ação".
- 2024: PCMGE065 consolidado de 12/2024 (`2024-12_PCMGE065.pdf`, p.34, Total Geral, Liquidado até o mês: 110.506.417,35; Empenhado 110.587.057,35) = Balanço (`2024_PCAGO015.pdf`, p.1, SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas). Os PCMGE015/016/018 de 12/2024 da Prefeitura no e-TCM são só um "COMUNICADO" (1 página, demonstrativo "encaminhado posteriormente"): não usados.
- 2025: PCMGE065 consolidado de 12/2025 (`2025-12_PCMGE065.pdf`, p.35, Total Geral, Liquidado: 127.482.107,14; Empenhado 128.405.752,18) = Balanço (`2025_PCAGO015.pdf`, p.1).
- 2026 (até setembro): PCMGE065 consolidado de 09/2026 (`2026-09_PCMGE065.pdf`, p.37, Total Geral, Liquidado até o mês 82.280.933,47; Empenhado até o mês 86.835.247,01).
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 + 17 + 26 + 06 · Administração 04 + 23 (+ 99, reserva, sem gasto) · Dívidas 28 (encargos especiais) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 112 milhões em 2024 | 111.966.678,05 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.10 a 11: bruta 121.467.552,65 − deduções do Fundeb 9.500.874,60, "Total Geral") |
| gastou 110 milhões e 500 em 2024 | 110.506.417,35 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.34, Total Geral) |
| sobrou 1 milhão e 500 | 1.460.260,70 | conta própria | 111.966.678,05 − 110.506.417,35 |
| arrecadou 123 milhões e 400 em 2025 | 123.393.118,09 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE066.pdf p.10, total) |
| gastou 127 milhões e 500 em 2025 | 127.482.107,14 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.35, Total Geral) |
| gastou 4 milhões e 100 a mais do que arrecadou | 4.088.989,05 | conta própria | 127.482.107,14 − 123.393.118,09 (o Balanço mostra "Déficit (VI) 5.012.634,09" pelo empenhado, p.1) |
| arrecadou 82 milhões e 600 até setembro de 2026 | 82.596.706,34 | 2026-09_PCMGE066.pdf (Receita consolidada, Líquido) | p.11 · Total Geral · Arrecadada até o Período (= 2026-09_PCMGE016.pdf p.7, "Total Até Mês"; os valores já vêm sem a parte do Fundeb: ICMS 5.806.753,84 com dedução de 1.451.688,26 mostrada à parte, p.4) |
| gastou 82 milhões e 300 até setembro | 82.280.933,47 | 2026-09_PCMGE065.pdf | p.37 · Total Geral · Liquidado até o mês |
| sobraram 316 mil | 315.772,87 | conta própria | 82.596.706,34 − 82.280.933,47 |
| já comprometeu 86 milhões e 800 | 86.835.247,01 | 2026-09_PCMGE065.pdf | p.37 · Total Geral · Empenhado até o mês |

## Setores (soma = total do ano; somas das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado (2024-12_PCMGE065.pdf) | 2025 liquidado (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 47 e 900 · 50 e 400 · 32 e 200 | 47.943.186,18 (p.7 a 12, função 12, 10 ações) | 50.413.638,56 (p.7 a 12, função 12, 10 ações) | 32.194.010,62 (p.8 a 13, função 12, 10 ações) |
| Saúde | 23 e 700 · 27 e 300 · 23 e 900 | 23.698.612,55 (p.13 a 16, função 10, 12 ações) | 27.295.372,64 (p.13 a 16, função 10, 12 ações) | 23.857.500,31 (p.14 a 17, função 10, 11 ações) |
| Obras e serviços urbanos | 13 e 700 · 19 e 200 · 7 e 900 | 13.735.783,40 (p.5 a 30, função 06, 15, 16, 17, 26, 17 ações) | 19.200.539,03 (p.5 a 31, função 06, 15, 16, 17, 26, 17 ações) | 7.890.893,67 (p.27 a 32, função 06, 15, 16, 17, 26, 14 ações) |
| Administração | 7 e 500 · 11 milhões · 5 e 400 | 7.495.961,93 (p.2 a 32, função 04, 23, 99, 12 ações) | 10.964.711,24 (p.2 a 33, função 04, 23, 99, 12 ações) | 5.441.292,24 (p.2 a 34, função 04, 23, 99, 13 ações) |
| Dívidas | 5 e 600 · 9 e 300 · 4 e 300 | 5.588.456,09 (p.3 a 3, função 28, 2 ações) | 9.254.947,06 (p.3 a 3, função 28, 2 ações) | 4.348.357,42 (p.4 a 4, função 28, 3 ações) |
| Assistência social | 4 e 600 · 2 e 900 · 2 e 200 | 4.582.091,07 (p.17 a 22, função 08, 18 ações) | 2.929.728,96 (p.17 a 22, função 08, 18 ações) | 2.232.400,24 (p.18 a 24, função 08, 19 ações) |
| Câmara de Vereadores | 2 e 300 · 3 milhões · 2 e 300 | 2.349.695,79 (p.1 a 1, função 01, 4 ações) | 2.990.992,19 (p.1 a 1, função 01, 4 ações) | 2.259.691,91 (p.1 a 1, função 01, 4 ações) |
| Cultura e festas | 3 e 900 · 3 e 100 · 2 e 800 | 3.891.551,63 (p.33 a 34, função 13, 3 ações) | 3.126.095,18 (p.34 a 35, função 13, 3 ações) | 2.802.894,17 (p.35 a 36, função 13, 4 ações) |
| Agricultura e meio ambiente | 903 mil · 979 mil · 1 milhão e 100 | 903.022,77 (p.23 a 25, função 18, 20, 8 ações) | 978.718,27 (p.24 a 26, função 18, 20, 8 ações) | 1.065.830,52 (p.25 a 27, função 18, 20, 8 ações) |
| Esporte | 318 mil · 327 mil · 188 mil | 318.055,94 (p.31 a 31, função 27, 3 ações) | 327.364,01 (p.32 a 32, função 27, 3 ações) | 188.062,37 (p.33 a 33, função 27, 4 ações) |

Câmara: 2024 = 2024-12_CAMARA_PCMGE015.pdf p.5, Total do Poder, Liquidações até Mês 2.349.695,79 · 2025 = Balanço 127.482.107,14 − PCMGE015 da Prefeitura 124.491.114,95 (2025-12_PCMGE015.pdf p.84, Total do Poder; a Câmara vem zerada nele) = 2.990.992,19 (conta própria; = soma das 4 ações da função 01 no 2025-12_PCMGE065.pdf p.1; o PCMGE015 da Câmara de 12/2025 veio com o texto embaralhado) · 2026 = 2026-09_CAMARA_PCMGE015.pdf p.4, Total do Poder, Liquidações até Mês 2.259.691,91.

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| as festas culturais, cívicas e religiosas levaram 3 milhões e 500 em 2024 | 3.482.890,01 | 2024-12_PCMGE065.pdf | p.33 · ação 13.392.0019.2.022 "MANUTENÇÃO DAS FESTAS CULTURAIS CÍVICAS E RELIGIOSAS" · Total por Ação · Liquidado até o mês (previsto 2.359.100,00, autorizado 4.041.851,69) |
| e 2 milhões e 900 em 2025 | 2.915.904,63 | 2025-12_PCMGE065.pdf | p.34 · ação 13.392.0019.2.022 · Total por Ação · Liquidado (previsto 4.616.800,00) |
| em 2026, só até setembro, 2 milhões e 500 | 2.477.601,79 | 2026-09_PCMGE065.pdf | p.35 · ação 13.392.0019.2.022 · Total por Ação · Liquidado até o mês (empenhado 3.305.029,81; previsto 2.480.900,00, autorizado 4.041.600,00) |
| somando, 8 milhões e 900 em festas | 8.876.396,43 | conta própria | 3.482.890,01 + 2.915.904,63 + 2.477.601,79 |
| até setembro, só as festas já passaram toda a assistência social | 2.477.601,79 x 2.232.400,24 | 2026-09_PCMGE065.pdf | p.35 (ação das festas) x p.24 (Total por Órgão da assistência social, Liquidado até o mês; = soma das 19 ações da função 08, conta própria) |
| a ajuda de emergência para as famílias ficou em 60 mil | 59.546,45 | 2026-09_PCMGE065.pdf | p.20 a 21 · ação 08.244.0011.2.031 "GESTÃO DE BENEFÍCIOS EVENTUAIS (BE)" · Total por Ação · Liquidado até o mês (empenhado 70.202,45; previsto 98.200,00). Arredondado para 60 mil (conta própria) |
| a construção de quadras nas escolas estava prevista: 135 mil (2024) | 134.900,00 | 2024-12_PCMGE065.pdf | p.7 · ação 12.361.0005.1.003 "CONSTRUÇÃO DE QUADRA POLIESPORTIVA ESCOLAR" · Total por Ação · Dotação Inicial (empenhado 0,00, liquidado 0,00) |
| 630 mil (2025) | 630.000,00 | 2025-12_PCMGE065.pdf | p.7 · ação 12.361.0005.1.003 · Dotação Inicial (autorizada 120.000,00; empenhado 0,00) |
| e 665 mil (2026) | 665.200,00 | 2026-09_PCMGE065.pdf | p.8 · ação 12.361.0005.1.003 "CONSTRUÇÃO DE QUADRAS POLIESPORTIVAS ESCOLARES" · Dotação Inicial e Autorizada (empenhado até o mês 0,00) |
| nada foi empenhado, zero | 0,00 | os três PCMGE065 | coluna Empenhado da mesma ação nos três anos. Conferido também: as outras ações de quadras e ginásios (27.812.0017.1.040 "Const. e ampl. de estádio, ginásio, quadras" e, em 2026, 27.812.0017.2.100 "Reforma de quadras de esportes") também têm empenho 0,00 nos três anos. Não há outra ação de quadra em nenhuma função |
| a Câmara recebeu 3 milhões e 950 em 2025 | 3.953.238,32 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 974 mil | 973.518,21 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (3.953.238,32 − 973.518,21 = 2.979.720,11; o liquidado da Câmara foi 2.990.992,19, conta própria) |
| gastou 335 mil com consultoria em 2025 | 335.000,00 | 2025-12_PCMGE065.pdf | p.1 · ação 01.031.0001.2.001 "MANUTENÇÃO DA CÂMARA MUNICIPAL" · elemento 3.3.90.35.00 Serviços de Consultoria · Liquidado até o mês |
| e 257 mil só até setembro de 2026 | 256.500,00 | 2026-09_PCMGE065.pdf | p.1 · ação 01.031.0001.2.001 · elemento 3.3.90.35.00 Serviços de Consultoria · Liquidado até o mês (empenhado 342.000,00). Arredondado para 257 mil (conta própria) |
| a dívida com o INSS começou 2024 em 31 milhões e 900 | 31.850.099,90 | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna) | p.1 · linha INSS · Saldo Anterior |
| fechou 2024 em 39 milhões | 38.970.641,21 | 2024_PCAGO012.pdf | p.1 · linha INSS · Saldo Atual (inscrição no ano 9.060.709,69; baixas 1.940.168,38) |
| e fechou 2025 em 37 milhões e 600 | 37.580.138,94 | 2025_PCAGO012.pdf (Anexo 16) | p.1 · linha INSS · Saldo Atual (baixas 1.390.502,27). Dívida fundada total: 41.001.029,03 (início de 2024), 48.887.610,68 (fim de 2024) e 45.105.710,35 (fim de 2025) |
| (folha da Câmara 2024) recebeu 3.426.714,00 e devolveu 1.059.434,00 | 3.426.714,00 / 1.059.434,00 | 2024-12_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês · p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |
| (folha da Câmara 2026) recebeu 2.295.000,00 e devolveu 7.246,13 até setembro | 2.295.000,00 / 7.246,13 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês · p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês |

## Receita por ano (folhas de receita)
- PCMGE066 consolidado (Prefeitura e fundos) de 12/2024, 12/2025 e 09/2026, "Comparativo orçado/arrecadado (Líquido)", coluna "Arrecadada até o Período". Em 2024 as deduções do Fundeb vêm no fim do relatório (mesmo código, valor negativo) e entram na linha do imposto, que fica "já sem a parte do Fundeb"; em 2025 e 2026 os valores já vêm líquidos. Total = Balanço (2024 e 2025). Script scripts/receita.py → saida/receita_AAAA.json.

## Pendências no TCM
- PCMGE015, PCMGE016 e PCMGE018 de 12/2024 da Prefeitura: só um "COMUNICADO" de 1 página (demonstrativo "encaminhado posteriormente"); a prestação de 01/2025 também não traz o de dezembro. Usado o PCMGE065 consolidado de 12/2024, que fecha com o Balanço.
- PCMGE015 e PCMGE018 da Câmara de 12/2025 com o texto embaralhado (o repasse e a devolução se leem no razão; o gasto sai do consolidado).
