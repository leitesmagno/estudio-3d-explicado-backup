# Fontes do 073. orçamento de itaberaba (BA)

Consulta: 11/11/2026 (downloads no e-TCM no navegador do app, com a trava _navegador-app.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta ITABERABA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITABERABA/documentos_tcm/` (cada PDF com o texto extraído ao lado em .txt). Município conferido no cabeçalho dos PDFs ("ITABERABA") e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 176 (ITABERABA) · Prefeitura UJ 780 · Câmara UJ 209 · Itaberaba Previdência (ITAPREV) UJ 602 · Superintendência Municipal de Trânsito e Transporte (SMTT): no consolidado como órgão 16. O Consórcio de Saúde da Região de Itaberaba e Seabra (UJ 515) é outra entidade (não entra). Último mês entregue em 2026: 09/2026 (Prefeitura, Câmara e ITAPREV; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/itaberaba.json.
"Gastou" = despesa LIQUIDADA. Totais de 2024 e 2025 = Balanço Orçamentário consolidado do município (Anexo 12, PCAGO015: Prefeitura, fundos, ITAPREV, SMTT e Câmara). 2026 = consolidado PCMGE065 de set/2026. Receita = total do Balanço (2024 e 2025; detalhe pelo Anexo 10, PCAGO008, que fecha centavo a centavo com o Balanço) e, em 2026, o "Totais" do consolidado PCMGE066 de set/2026 (Arrecadada até o Mês mais a Anulada até o Mês, que é negativa). A receita inclui a contribuição da prefeitura e dos servidores ao instituto de previdência (intraorçamentária), como no Balanço.
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/fontes.py acha a página). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: o consolidado PCMGE065 de dez/2024 NÃO fecha com o Balanço (traz a ITAPREV com 23,8 mi, e o Anexo 9 do Balanço traz 28,3 mi), por isso não foi usado. Prefeitura e fundos = `2024-12_PCMGE015.pdf` da Prefeitura (Liquidações Até Mês, soma das ações 298.550.817,13; Câmara, SMTT e ITAPREV vêm zeradas nele) · Câmara = `2024-12_CAMARA_PCMGE015.pdf` (7.716.685,40, igual ao Anexo 9, função 01) · SMTT = `2024_PCAGO007.pdf` (Anexo 9) função 26 Transporte 3.137.876,43 · ITAPREV = conta própria: 337.731.807,29 (Balanço) − 298.550.817,13 − 7.716.685,40 − 3.137.876,43 = 28.326.428,33 (o Anexo 9 traz 28.328.148,33 empenhados; a diferença de 1.720,00 é o que não foi liquidado). Soma = `2024_PCAGO015.pdf` p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 337.731.807,29.
- 2025: `2025-12_PCMGE065.pdf` (consolidado FATOR "Modelo 01", leitor scripts/le015.py; TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado no Ano 357.203.666,47) = `2025_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 357.203.666,47, centavo a centavo.
- 2026 (até setembro): Prefeitura e fundos = `2026-09_PCMGE015.pdf` (leitor scripts/acoes015.py) · Câmara, SMTT e ITAPREV = `2026-09_PCMGE065.pdf` (leitor scripts/acoes_cons.py). Soma = `2026-09_PCMGE065.pdf` p.154 · TOTAL · Liquidada até o Mês 312.539.529,54 (Empenhada até o Mês 352.153.934,18).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Previdência dos servidores 09 (ITAPREV) · Obras e serviços urbanos 15, 16, 17, 25, 26 (SMTT) · Administração 04, 06, 99 · Dívidas e encargos 28 · Assistência social 08 e 14 · Câmara 01 · Cultura 13 sem os eventos · Agricultura e meio ambiente 18 e 20 · Esporte 27. SECRETARIA INTEIRA no setor dela (precedente 069 Paulo Afonso / 082 Maracás), porque estas secretarias lançam o pessoal e a gestão na função 04: Secretaria de Infraestrutura e Desenvolvimento Urbano (unidade 1301) → Obras e serviços urbanos; Agricultura, Indústria e Comércio (1401) e Meio Ambiente (1901) → Agricultura e meio ambiente; Desporto e Lazer (1001) → Esporte; Cultura, Turismo e Economia Criativa, Fundo de Cultura e Fundo de Turismo (1501, 1502, 1503) → Cultura.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "Promoção e Realização de Eventos Culturais" (código 2219) inteira; nenhum elemento de bandas (3.3.90.39.94) aparece nos PDFs; o único elemento de palco fora dela é 3.3.90.39.95 "Locação, confecção e montagem de cenários, palco..." de 12.411,52 numa ação de gestão da Saúde em 2026 (somado aos eventos). "Cultura" = o resto das secretarias e fundos de cultura e turismo. Dentro da ação de eventos, quase tudo é "Outros serviços de terceiros, pessoa jurídica" (3.3.90.39.99), sem o subelemento: não dá para separar bandas e palco pelo PDF.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Itaberaba arrecadou 339 milhões e 800 em 2024 | 339.841.130,55 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024_PCAGO008.pdf, Anexo 10, Total Geral: Arrecadado no Ano, e = 2024-12_PCMGE066.pdf, Totais) |
| 371 milhões em 2025 | 371.075.073,00 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (371.075.073,00 arredonda para 371 milhões e 100; dito "371 milhões") |
| 313 milhões até setembro de 2026 | 313.070.765,56 | 2026-09_PCMGE066.pdf (receita consolidada) | p.14 · Totais · Total até Mês (Arrecadada até Mês 329.313.584,45 + Anulada até Mês −16.242.818,89). Prefeitura (2026-09_PCMGE016.pdf) 282.379.015,26 + ITAPREV (2026-09_PREV_PCMGE016.pdf) 29.601.325,78 + SMTT (2026-09_SMTT_PCMGE016.pdf, Superintendência Municipal de Trânsito e Transporte, UJ 1098 no e-TCM, Totais: Total até Mês) 1.090.424,52 (soma: conta própria, = consolidado) |
| 2024: gastou 337 milhões e 700 | 337.731.807,29 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 2 milhões e 100 | 2.109.323,26 | conta própria | 339.841.130,55 − 337.731.807,29 |
| 2025: gastou 357 milhões e 200 | 357.203.666,47 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Sobraram 13 milhões e 900 | 13.871.406,53 | conta própria | 371.075.073,00 − 357.203.666,47 |
| 2026, até setembro: gastou 312 milhões e 500 | 312.539.529,54 | 2026-09_PCMGE065.pdf | p.154 · TOTAL · Liquidada até o Mês |
| Sobraram 531 mil | 531.236,02 | conta própria | 313.070.765,56 − 312.539.529,54 |
| E já comprometeu 352 milhões e 200 | 352.153.934,18 | 2026-09_PCMGE065.pdf | p.154 · TOTAL · Empenhada até o Mês |
| Em 2025, o FPM, da União, mandou 70 milhões e 500 | 70.524.366,52 | 2025_PCAGO008.pdf (Anexo 10) | p.5 · 1.7.1.1.51.0.0.00.00 Cota-Parte do FPM · Arrecadado no ano 85.835.197,00 − p.10 · 9.7.1.1.51.1.0.00.00 Dedução do FPM para o Fundeb 15.310.830,48 (conta própria: já sem a parte do Fundeb) |
| O Fundeb trouxe 61 milhões e 800 | 61.814.231,94 | 2025_PCAGO008.pdf | p.8 · 1.7.5.1.50.0.0.00.00 Transferências de Recursos do Fundeb · Arrecadado no ano |
| e a complementação da União ao Fundeb, mais 54 milhões e 800 | 54.813.182,55 | 2025_PCAGO008.pdf | p.6 · 1.7.1.5.00.0.0.00.00 Complementação da União ao Fundeb · Arrecadado no ano |
| E o SUS mandou 53 milhões e 500 | 53.519.412,03 | 2025_PCAGO008.pdf | p.5 · 1.7.1.3.00.0.0.00.00 (União) 51.106.980,72 + p.7 · 1.7.2.3.00.0.0.00.00 (Estado) 2.412.431,31 (soma: conta própria) |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json)
| Setor | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|
| Educação | 123.866.617,42 | 134.118.613,33 | 135.773.781,68 |
| Saúde | 75.024.610,17 | 83.093.180,46 | 64.171.561,66 |
| Previdência dos servidores | 28.326.428,33 | 33.537.511,56 | 31.475.315,71 |
| Obras e serviços urbanos | 52.074.155,24 | 27.505.819,71 | 25.931.205,81 |
| Administração | 20.348.508,34 | 28.121.701,74 | 16.511.664,34 |
| Dívidas e encargos | 11.281.839,18 | 21.779.287,34 | 15.839.403,33 |
| Assistência social | 7.372.737,97 | 8.015.282,40 | 6.364.395,91 |
| Câmara de Vereadores | 7.716.685,40 | 9.476.388,00 | 7.910.195,02 |
| Festas e eventos | 3.958.419,89 | 5.770.555,08 | 3.253.702,55 |
| Cultura | 1.029.809,67 | 1.485.847,73 | 753.749,65 |
| Agricultura e meio ambiente | 5.081.413,00 | 3.580.586,42 | 3.476.027,08 |
| Esporte | 1.650.582,68 | 718.892,70 | 1.078.526,80 |
| **Soma** | 337.731.807,29 | 357.203.666,47 | 312.539.529,54 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 3.958.419,89
- Cultura 2024: R$ 1.029.809,67
- Festas e eventos 2025: R$ 5.770.555,08
- Cultura 2025: R$ 1.485.847,73
- Festas e eventos 2026: R$ 3.253.702,55 (até setembro)
- Cultura 2026: R$ 753.749,65

## A Câmara (razão da própria Câmara, PCMGE018)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 8 milhões e 180 | 8.181.685,40 | 2024-12_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 465 mil | 465.000,00 | 2024-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS · Debitado até o Mês. Conferência: 8.181.685,40 − 465.000,00 = 7.716.685,40 = gasto da Câmara em 2024 (Anexo 9, função 01) |
| Em 2025, recebeu 9 milhões e 780 | 9.775.887,72 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Debitado/Creditado até o Mês |
| e devolveu 299 mil | 299.499,72 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS · Debitado até o Mês. Conferência: 9.775.887,72 − 299.499,72 = 9.476.388,00 = gasto da Câmara em 2025 (Anexo 9, função 01) |
| Até setembro de 2026, já recebeu 8 milhões e 280 | 8.282.106,63 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (não falamos de devolução em 2026: o razão de setembro não traz a conta 3.5.1.1.2.09.00) |
- Gasto da Câmara (liquidado, para a folha): 7.716.685,40 (2024, PCMGE015 da Câmara) · 9.476.388,00 (2025, consolidado) · 7.910.195,02 (2026 até set, consolidado).
- Conferência do duodécimo (regra do 122): 2025-12_PCMGE008.pdf é o comprovante da transferência de dez/2025 à Câmara, R$ 814.657,31 (TEV da conta da Prefeitura para a conta da Câmara, 19/12/2025); 814.657,31 x 12 = 9.775.887,72, igual ao repasse recebido no razão da Câmara. Set/2026: 920.234,07 no mês (razão), 8.282.106,63 até setembro. Dez/2024: 681.807,08 no mês, 8.181.685,40 no ano.

## As dívidas
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a prefeitura pegou um empréstimo de 21 milhões e 500 | 21.510.000,00 | 2024_PCAGO008.pdf (Anexo 10) | p.10 · 2.1.1.2.01.0.1.00.00 Operações de Crédito Contratuais - Mercado Interno - Principal · Arrecadado no ano (previsto 10.720.000,00) |
| Em 2025, pagou 21 milhões e 100 em parcelas e juros | 21.130.353,79 | 2025-12_PCMGE065.pdf | ação 28.843 Operação Especial - Encargos da Dívida Pública (Secretaria da Fazenda), Liquidado no Ano: 4.6.90.71 Principal da Dívida Contratual Resgatado 18.850.089,00 + 4.6.90.92 (no PCMGE015 da Prefeitura, 4.6.90.92.71 Principal da Dívida Contratual Resgatado, de anos anteriores) 920.584,62 + 3.2.90.21 Juros sobre a Dívida por Contrato 1.359.680,17 (soma: conta própria). O setor Dívidas e encargos (21.779.287,34) soma ainda 648.933,55 de sentenças judiciais |
| Até setembro de 2026, mais 13 milhões e 700 | 13.718.403,33 | 2026-09_PCMGE015.pdf | p.27 · ação 2.801.28.843.4.2.2015 Encargos da Dívida Pública · 4.6.90.71.01 AMORTIZAÇÃO DA DÍVIDA CONTRATUAL · Liquidações até Mês |

## Os eventos (ação "Promoção e Realização de Eventos Culturais", PCMGE015 da Prefeitura)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a ação de eventos culturais previa 1 milhão e 600 | 1.645.387,87 | 2024-12_PCMGE015.pdf | ação 2.1501.13.391.15.2.2219 · Total do Projeto/Atividade · Fixada (dotação inicial) |
| Gastou 4 milhões | 3.958.419,89 | 2024-12_PCMGE015.pdf | mesma ação · Liquidações até Mês |
| Em 2025, previa 3 milhões e 800 | 3.829.869,72 | 2025-12_PCMGE015.pdf | ação 2.1501.13.391.15.2.2219 · Total do Projeto/Atividade · Fixada (no consolidado 2025-12_PCMGE065.pdf, ação 13.391.015.2.219, Fixado 3.829.869,72) |
| Gastou 5 milhões e 800 | 5.770.555,08 | 2025-12_PCMGE065.pdf | ação 13.391.015.2.219 Promoção e Realização de Eventos Culturais · Liquidado no Ano (= 2025-12_PCMGE015.pdf, Liquidações até Mês) |
| Em 2026, previa 6 milhões e 500 | 6.549.000,00 | 2026-09_PCMGE015.pdf | ações 2.1502.13.391.13.2.2219 (Fundo de Cultura) 6.390.000,00 + 2.1501.13.391.13.2.2219 (Secretaria) 159.000,00 · Fixada (soma: conta própria) |
| e até setembro já gastou 3 milhões e 200 | 3.241.291,03 | 2026-09_PCMGE015.pdf | ação 2.1502.13.391.13.2.2219 · Liquidações até Mês (a da Secretaria: 0,00). O setor Festas e eventos 2026 (3.253.702,55) soma ainda 12.411,52 de palco numa ação da Saúde |

## A pergunta final
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| se a agricultura e o meio ambiente ficaram em 3 milhões e 600 em 2025 | 3.580.586,42 | 2025-12_PCMGE065.pdf | setor Agricultura e meio ambiente 2025 (Secretaria de Agricultura, Indústria e Comércio e Secretaria de Meio Ambiente inteiras, funções 18 e 20): conta própria em saida/setores.json |
| por que os eventos levaram 5 milhões e 800? | 5.770.555,08 | 2025-12_PCMGE065.pdf | ação 13.391.015.2.219 · Liquidado no Ano |

## Fora do vídeo (só para responder perguntas)
- Receita detalhada por ano: saida/receita_2024.json e receita_2025.json (Anexo 10) e receita_2026.json (PCMGE016 da Prefeitura e da ITAPREV). Em 2025 entrou 4.030.000,00 de "Cessão do Direito de Operacionalização de Pagamentos" (venda da folha de pagamento a banco), 2025_PCAGO008.pdf, código 1.3.6.1.01.1.1.
- Pendências no TCM: o PCMGE015 de 12/2024 da ITAPREV (UJ 602) é uma lista vazia de "despesas orçamentárias pagas" (não usado); o consolidado PCMGE065 de 12/2024 não fecha com o Balanço (não usado).
