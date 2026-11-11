# Fontes do 069. orçamento de paulo afonso (BA)

Consulta: 11/11/2026 (downloads no e-TCM no navegador do app, com a trava _navegador.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta PAULO-AFONSO, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-PAULO-AFONSO/documentos_tcm/` (98 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF ("PAULO AFONSO" no cabeçalho de todos os 98) e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026; Prefeitura e Câmara).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 294 (PAULO AFONSO) · Prefeitura UJ 898 · Câmara UJ 327. O Consórcio Interfederativo de Saúde da Região de Paulo Afonso (UJ 518) é de vários municípios e NÃO entra. Sem autarquia própria: os fundos (Educação, Saúde, Assistência) estão dentro da Prefeitura e do consolidado. Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/paulo-afonso.json.
"Gastou" = despesa LIQUIDADA. O total de cada ano é o consolidado do município (PCMGE065: Executivo, fundos e Câmara), que é igual ao Balanço Orçamentário centavo a centavo em 2024 e 2025. Receita = total do Balanço (2024 e 2025) e do PCMGE016 da Prefeitura em set/2026 (arrecadada até o mês mais a anulada, que é negativa), já sem a parte do Fundeb (FPM 2026: dedução 17.438.551,15 = 25% exatos do 1.7.1.1.51.1.0).
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto bruto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- Tudo pelo consolidado PCMGE065 de cada ano (leitor scripts/acoes_cons.py; soma dos elementos = total de cada ação, 0 diferenças).
- 2024: `2024-12_PCMGE065.pdf` p.107 (TOTAL GERAL, Liquidada até o Mês) 545.065.658,89 = `2024_PCAGO015.pdf` p.4 (SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas). Executivo 528.058.900,91 + Legislativo 17.006.757,98. (O PCMGE015 da Prefeitura de 12/2024 traz o mesmo "Total do Poder" 528.058.900,91, mas o texto da ação de encargos gerais, 24,4 mi, sai fora do leitor; por isso o 065.)
- 2025: `2025-12_PCMGE065.pdf` p.122 (TOTAL GERAL, Liquidada até o Mês) 523.186.200,98 = `2025_PCAGO015.pdf` p.3 (SUBTOTAL DAS DESPESAS (XI)). Prefeitura 156.679.426,83 + fundos 348.171.886,36 (= PCMGE015 da Prefeitura, Total do Poder 504.851.313,19) + Câmara 18.334.887,79.
- 2026 (até setembro): `2026-09_PCMGE065.pdf` p.92 (TOTAL GERAL, Liquidada até o Mês) 455.409.041,66 = Executivo 441.406.859,31 + Câmara 14.002.182,35. O PCMGE015 de 09/2026 enviado pela Prefeitura traz o mesmo demonstrativo consolidado (mesmos totais).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 16, 17, 26 (limpeza de lixo e logradouros, iluminação pública, pavimentação, edificações, esgoto, aterro, defesa civil de 2025) · Administração 04, 06 (guarda civil e defesa civil), 22 e 23 (Sec. de Turismo, Indústria e Comércio), 99 · Dívidas e encargos 28 · Assistência social 08 e 14 (Sec. de Políticas para a Mulher em 2026) · Câmara 01 · Cultura 13 sem as ações de eventos · Agricultura e meio ambiente 18 e 20.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = ação cujo NOME diz evento: "GESTÃO DO CALENDÁRIO DE EVENTOS COMEMORATIVOS, CULTURAIS E ESPORTIVOS" (8011, 2024 e 2025) e "PROMOCAO, APOIO E REALIZACAO DE EVENTOS TRADICIONAIS E CULTURAIS" (2078, 2026). O consolidado só traz o elemento até a modalidade (3.3.90.39.00), sem o subelemento de bandas (39.94) ou palco (39.19/39.95): procurado em todas as ações dos três anos, nenhum elemento com banda, palco, cenário, show ou som no nome. "Cultura" = o resto da função 13 (manutenção da Secretaria de Cultura e Esporte, Fundo de Cultura, investimento nos equipamentos de cultura e esporte).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Paulo Afonso arrecadou 548 milhões e 800 em 2024 | 548.789.153,18 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.3 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf, Totais: Total Até Mês) |
| 564 milhões e 100 em 2025 | 564.107.684,39 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.3 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas. O PCMGE016 da Prefeitura de 12/2025 dá 563.591.459,68; a diferença (516.224,71) é receita patrimonial (14.243,26) e transferências de capital (501.981,45) que só aparecem no Balanço consolidado (conta própria, linha a linha do Balanço p.3) |
| 451 milhões e 400 até setembro de 2026 | 451.354.819,54 | 2026-09_PCMGE016.pdf | p.8 · TOTAL · Arrecadada até Mês 451.447.708,54 + Anulada até Mês −92.889,00 (= linha "Totais: Total Até Mês" do resumo) |
| Em 2025, o SUS mandou 109 milhões e 100 | 109.143.289,15 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.3.00.0.0 (União) 94.887.932,61 + 1.7.2.3.00.0.0 (Estado) 5.978.356,54 + 2.4.1.1.00.0.0 (capital, União) 8.277.000,00 · Arrecadada até Mês (soma: conta própria) |
| O FPM, da União, 99 milhões e 900 | 99.949.045,31 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem o Fundeb) |
| O ICMS, do Estado, 95 milhões | 95.037.007,32 | 2025-12_PCMGE016.pdf | p.5 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 23.759.251,45 = 25%) |
| a compensação pela água usada nas usinas hidrelétricas trouxe 11 milhões e 200 | 11.154.406,22 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.2.50.0.0 Cota-parte da Compensação Financeira pela Exploração de Recursos Hídricos · Arrecadada até Mês. 2024: 11.809.858,09 (2024-12_PCMGE016.pdf); 2026 até set: 9.170.128,22 (2026-09_PCMGE016.pdf p.2). A compensação financeira pelo uso de recursos hídricos para geração de energia elétrica é a da Lei nº 7.990/1989 (https://www.planalto.gov.br/ccivil_03/leis/l7990.htm, consultado em 11/11/2026). Não há linha de royalties de energia do Estado (1.7.2.2) nos três anos. |
| 2024: gastou 545 milhões e 100 | 545.065.658,89 | 2024_PCAGO015.pdf | p.4 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.107) |
| Sobraram 3 milhões e 700 | 3.723.494,29 | conta própria | 548.789.153,18 − 545.065.658,89 |
| 2025: gastou 523 milhões e 200 | 523.186.200,98 | 2025_PCAGO015.pdf | p.3 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.122) |
| Sobraram 40 milhões e 900 | 40.921.483,41 | conta própria | 564.107.684,39 − 523.186.200,98 |
| 2026, até setembro: gastou 455 milhões e 400 | 455.409.041,66 | 2026-09_PCMGE065.pdf | p.92 · TOTAL GERAL · Liquidada até o Mês |
| Faltaram 4 milhões e 100 | 4.054.222,12 | conta própria | 455.409.041,66 − 451.354.819,54 |
| já comprometeu 503 milhões e 800 | 503.758.516,78 | 2026-09_PCMGE065.pdf | p.92 · TOTAL GERAL · Empenhada até o Mês |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidada até o Mês" do PCMGE065 de cada ano)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 167 e 100 · 178 e 800 · 142 e 500 | 167.123.665,69 | 178.773.757,12 | 142.546.817,38 |
| Saúde | 161 e 800 · 152 e 400 · 139 e 500 | 161.799.718,54 | 152.420.080,44 | 139.543.144,55 |
| Obras e serviços urbanos | 53 e 300 · 42 e 500 · 41 e 300 | 53.305.285,27 | 42.509.355,23 | 41.347.652,31 |
| Administração | 63 milhões · 50 e 900 · 45 e 900 | 62.957.676,98 | 50.903.722,63 | 45.881.819,52 |
| Dívidas e encargos | 24 e 400 · 27 e 600 · 25 e 200 | 24.385.485,64 | 27.569.429,96 | 25.165.725,72 |
| Assistência social | 20 milhões e 400 · 17 milhões · 16 e 700 | 20.388.502,36 | 16.978.048,80 | 16.663.623,29 |
| Câmara de Vereadores | 17 milhões · 18 e 300 · 14 milhões | 17.006.757,98 | 18.334.887,79 | 14.002.182,35 |
| Festas e eventos | 13 e 600 · 21 milhões · 16 e 400 | 13.649.691,44 | 21.010.771,76 | 16.443.653,53 |
| Cultura | 5 e 500 · 3 milhões e 200 · 4 e 400 | 5.535.112,41 | 3.190.044,25 | 4.371.035,67 |
| Agricultura e meio ambiente | 18 e 900 · 11 e 500 · 9 e 400 | 18.913.762,58 | 11.496.103,00 | 9.443.387,34 |
| **Soma** | | 545.065.658,89 | 523.186.200,98 | 455.409.041,66 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 13.649.691,44 (ação 3160.16.13.392.9.2.8011, 2024-12_PCMGE065.pdf p.98, Total da Ação de Governo, Liquidada até o Mês)
- Festas e eventos 2025: R$ 21.010.771,76 (ação 2.1616.13.392.9.2.8011, 2025-12_PCMGE065.pdf p.11)
- Festas e eventos 2026: R$ 16.443.653,53 (ação 17.1700.13.392.5.2.2078, 2026-09_PCMGE065.pdf p.82, até setembro)
- Cultura 2024: R$ 5.535.112,41 · Cultura 2025: R$ 3.190.044,25 · Cultura 2026: R$ 4.371.035,67

## A Câmara
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 17 milhões e 300 da prefeitura | 17.289.402,32 | 2024-12_PCMGE064.pdf (razão consolidado) | p.21 · 3.5.1.1.2.02.00.02.06.01 REPASSES CONCEDIDOS - CAMARA MUNICIPAL · Débito até o mês (= 4.5.1.1.2.02.00.02.00.01 REPASSE RECEBIDO - DUODECIMO) |
| e devolveu 226 mil | 226.304,50 | 2024-12_PCMGE064.pdf | p.21 · 3.5.1.1.2.09.00.01.00.00 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS - DUO(DÉCIMO) |
| Em 2025, recebeu 18 milhões e 300 | 18.336.019,14 | 2025-12_PCMGE064.pdf | p.34 · 3.5.1.1.2.02.00.02.01.00.00.00 Repasse Concedido à Câmara Municipal - Duodécimo |
| e devolveu 8 mil e 700 | 8.654,80 | 2025-12_PCMGE064.pdf | p.34 · 3.5.1.1.2.09.01 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS - DUODÉCIMO (= 2025-12_PCMGE018.pdf 4.5.1.1.2.09.00) |
| Até setembro de 2026, já recebeu 14 milhões e 600 | 14.615.504,73 | 2026-09_PCMGE064.pdf | p.31 · 3.5.1.1.2.02.02.00 REPASSES CONCEDIDOS AO PODER LEGISLATIVO |
| Locação de mão de obra: nenhum lançamento com esse nome em 2024 | sem linha | 2024-12_PCMGE065.pdf | Câmara (função 01): elementos 3.1.90.11, 3.1.90.13, 3.3.90.14, 30, 35, 36, 39, 40, 47, 93, 4.4.90.51 e 52; nenhum 3.3.90.37 |
| e 1 milhão e 200 em 2025 | 1.225.011,96 | 2025-12_PCMGE065.pdf | p.49 · Câmara, 3.3.90.37.00 LOCAÇÃO DE MÃO DE OBRA · Liquidada até o Mês (até set/2026: 1.195.420,06, 2026-09_PCMGE065.pdf) |
- Gasto da Câmara (liquidado, para a folha): 17.006.757,98 (2024) · 18.334.887,79 (2025) · 14.002.182,35 (2026 até set), dos consolidados PCMGE065. Diárias da Câmara (3.3.90.14): 225.434,40 · 297.175,70 · 220.709,81. O razão da própria Câmara (PCMGE018) está escaneado (texto ilegível em 2024 e 2026); por isso o repasse vem do razão consolidado da Prefeitura (PCMGE064).

## As festas (calendário de eventos)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, o calendário de eventos previa 5 milhões | 5.010.900,00 | 2024-12_PCMGE065.pdf | p.98 · ação 8011 "GESTÃO DO CALENDÁRIO DE EVENTOS COMEMORATIVOS, CULTURAIS E ESPORTIVOS" · Total da Ação de Governo · Dotação Fixada (a lei do orçamento) |
| Gastou 13 milhões e 600 | 13.649.691,44 | 2024-12_PCMGE065.pdf | p.98 · mesma linha · Liquidada até o Mês (dotação atual 14.284.896,83 depois de suplementações) |
| Em 2025, previa 8 milhões e 700 | 8.654.336,00 | 2025-12_PCMGE065.pdf | p.11 · ação 8011 · Total da Ação de Governo · Dotação Fixada |
| Gastou 21 milhões | 21.010.771,76 | 2025-12_PCMGE065.pdf | p.11 · mesma linha · Liquidada até o Mês (adições até o mês 13.636.060,76; dotação atual 21.465.846,76; empenhado 21.453.446,76) |
| Em 2026, previa 14 milhões e 900 | 14.859.000,00 | 2026-09_PCMGE065.pdf | p.82 · ação 2078 "PROMOCAO, APOIO E REALIZACAO DE EVENTOS TRADICIONAIS E CULTURAIS" · Total da Ação de Governo · Dotação Fixada |
| e até setembro já gastou 16 milhões e 400 | 16.443.653,53 | 2026-09_PCMGE065.pdf | p.82 · mesma linha · Liquidada até o Mês (dotação atual 18.199.882,99) |
| Em 2025, a ajuda de emergência para as famílias ficou em 1 milhão e 100 | 1.089.428,18 | 2025-12_PCMGE065.pdf | p.110 · ação 5.1151.8.244.8.2.2143 "Manutenção dos Benefícios Eventuais" · Total da Ação de Governo · Liquidada até o Mês |
| O programa de renda da cidade previa 3 milhões e gastou 914 mil | 3.000.000,00 e 913.600,00 | 2025-12_PCMGE065.pdf | p.112 · ação 5.1151.8.244.8.2.6026 "Manutenção do Prog. de Transferência de Rendas - Paulo Afonso Cidadania" · Total da Ação de Governo · Dotação Fixada e Liquidada até o Mês (anulações até o mês 783.600,00) |
| por que os eventos levaram 21 milhões em 2025? | 21.010.771,76 | 2025-12_PCMGE065.pdf | p.11 (mesma linha acima) |

## Só na legenda
- Benefícios eventuais (ajuda de emergência): 934.945,77 (2024, 2024-12_PCMGE065.pdf, ação 3110.11.8.244.8.2.2143) · 1.089.428,18 (2025) · 1.075.491,14 (até set/2026, 2026-09_PCMGE065.pdf, ação 11.1101.8.244.9.2.2043), Liquidada até o Mês.
- Compensação das usinas: 11.809.858,09 (2024-12_PCMGE016.pdf, 1.7.1.2.50.0.0) e 9.170.128,22 (2026-09_PCMGE016.pdf p.2), Arrecadada até Mês.

## Receita por ano (folha "PDF" de receita; scripts/receita.py → saida/receita_AAAA.json; soma = total do ano)
Itens pelo PCMGE016 da Prefeitura (Arrecadada até Mês + Anulada até Mês), já sem o Fundeb. "Outras receitas" fecha com o total do Balanço (2024, 2025) ou do PCMGE016 (2026); em 2025 inclui os 516.224,71 que só estão no Balanço. Destaques: 2024 traz 26.018.383,54 em 1.9.2.2.06 "Restituição de Despesas de Exercícios Anteriores" (só na folha, não dito na fala).

## Notícias (conferência interna)
- Nenhum fato de obra ou serviço é dito na fala; só números do TCM. Sem notícia usada como fonte.

## Pendências
- Razão (PCMGE018) da Câmara de 12/2024 e 09/2026 escaneado; PCMGE015 da Câmara de 12/2024 é capa "gerado pelo SIGA" (não usados; a Câmara vem do consolidado).
