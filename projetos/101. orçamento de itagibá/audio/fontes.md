# Fontes do 101. orçamento de itagibá (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 03:57 e 04:35, pelo recebedor 127.0.0.1:8778, pasta ITAGIBA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITAGIBA/documentos_tcm/` (45 PDFs, todos com "ITAGIBA/ITAGIBÁ" conferido no texto).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 181 (ITAGIBÁ) · Prefeitura UJ 785 · Câmara UJ 213 (sem autarquia com prestação própria). Último mês entregue pela Prefeitura em 2026: 08/2026 (a Câmara já entregou 09/2026; usei 08 nas duas).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário de 2024 e 2025; em 2026, PCMGE016 até agosto), como o documento traz.
Despesa por setor (soma das ações = total do ano, diferença 0,00):
- 2024: `2024-12_PCMGE065.pdf` (Demonstrativo das Despesas Analítico, sistema Resolve, consolidado Prefeitura + fundos + Câmara), coluna Liquidadas "até o mês". Soma das 94 ações = 141.275.346,07 = Balanço 2024 (scripts/acoes_resolve.py).
- 2025: `2025-12_PCMGE015.pdf` (Demonstrativo da Despesa Orçamentária SIGA da Prefeitura, Liquidações até o mês, Total do Poder 148.962.776,04, p.90) + Câmara `2025-12_CAMARA_PCMGE015.pdf` (ESCANEADO, lido na imagem, p.2 e p.3: Total do Projeto/Atividade 6.713.088,50, igual ao Anexo 9 de 2025, função 01, `2025_PCAGO007.pdf` p.1). Soma = 155.675.864,54 = Balanço 2025. O PCMGE065 consolidado de dez/2025 que está no e-TCM vem incompleto (40.0 mi liquidados) e NÃO foi usado.
- 2026: `2026-08_PCMGE065.pdf` (Demonstrativo Consolidado da Despesa Orçamentária SIGA), TOTAL p.76, Liquidada até o mês.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 26 (transporte) · Administração 04 + 06, menos a ação 4.392 "Eventos tradicionais" (vai para Cultura e festas) e a 4.843 "Administração da dívida fundada" (vai para Dívidas) · Dívidas = ação 4.843 · Assistência social 08 + 14 (conselho tutelar) · Câmara 01 · Cultura e festas 13 + ação 4.392 · Agricultura e meio ambiente 20 + 18 · Esporte 27.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json, receita_*.json, acoes_*.json); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/pg.py; as somas estão marcadas como conta própria).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 135 milhões e 600 em 2024 | 135.624.201,81 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 141 milhões e 300 em 2024 | 141.275.346,07 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; = soma das ações do 2024-12_PCMGE065.pdf |
| 5 milhões e 700 a mais em 2024 | 5.651.144,26 | conta própria | 141.275.346,07 − 135.624.201,81 |
| arrecadou 151 milhões e 300 em 2025 | 151.274.691,04 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (o PCMGE016 de dez/2025 traz 151.274.986,04, com 146,10 de deduções no mês; vale o Balanço) |
| gastou 155 milhões e 700 em 2025 | 155.675.864,54 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| 4 milhões e 400 a mais em 2025 | 4.401.173,50 | conta própria | 155.675.864,54 − 151.274.691,04 |
| arrecadou 102 milhões e 100 até agosto de 2026 | 102.129.455,41 | 2026-08_PCMGE016.pdf | p.8 · TOTAL · Arrecadada até Mês (igual ao 2026-08_PCMGE066.pdf consolidado, TOTAL) |
| gastou 102 milhões e 600 até agosto de 2026 | 102.584.109,09 | 2026-08_PCMGE065.pdf | p.76 · TOTAL · Liquidada até o Mês |
| 455 mil a mais | 454.653,68 | conta própria | 102.584.109,09 − 102.129.455,41 |
| já comprometeu 127 milhões e 700 | 127.705.125,11 | 2026-08_PCMGE065.pdf | p.76 · TOTAL · Empenhada até o Mês |

## Receita por ano (folha "PDF", não falada; scripts/receita_itag.py → saida/receita_AAAA.json)
2024: Anexo 2 Resumo Geral da Receita (`2024_PCAGO003.pdf`, Total 135.624.201,81 = Balanço). 2025: `2025-12_PCMGE016.pdf` (total do Balanço). 2026: `2026-08_PCMGE016.pdf`. Grupos por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties da mineração 1.7.1.2.51, royalties do petróleo 1.7.1.2.52, SUS 1.7.1.3 + 1.7.2.3 + 2.4.1.1, FNDE 1.7.1.4, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, convênios); "Outras receitas" fecha o total.
Observação: o "Anexo 10" (PCAGO008) que está na prestação anual de 2024 é de 2025 e parcial (arrecadado 30.183.983,94); não usado.

## Setores (soma = total do ano, diferença 0,00) · scripts/setores_itag.py → saida/setores.json
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024-12_PCMGE065.pdf) | 2025 (2025-12_PCMGE015.pdf + Câmara) | 2026 até ago (2026-08_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 48 e 800 · 53 e 400 · 34 e 500 | 48.809.164,74 | 53.434.652,16 | 34.455.312,75 |
| Saúde | 24 e 800 · 26 e 800 · 17 e 400 | 24.829.897,41 | 26.813.746,89 | 17.381.562,36 |
| Obras e serviços urbanos | 22 e 700 · 22 e 400 · 13 e 100 | 22.731.418,97 | 22.362.186,32 | 13.056.126,66 |
| Administração | 16 milhões · 18 e 700 · 15 milhões | 15.953.125,59 | 18.655.826,67 | 14.967.791,02 |
| Dívidas | 1 e 900 · 2 e 200 · 1 e 300 | 1.925.220,58 (ação 4.843.53.2012, p.5 a 6) | 2.213.030,00 | 1.253.800,96 |
| Assistência social | 9 e 800 · 10 e 900 · 7 e 100 | 9.761.439,53 | 10.888.521,84 | 7.089.269,68 |
| Câmara de Vereadores | 5 e 700 · 6 milhões e 700 · 4 milhões e 900 | 5.659.521,47 (ações 1.31.1.1001 + 1.31.1.2001, p.1) | 6.713.088,50 (2025-12_CAMARA_PCMGE015.pdf p.3, lido na imagem) | 4.899.788,59 (ação 01.1.1.31.1.1.2001) |
| Cultura e festas | 5 e 800 · 7 e 300 · 5 e 800 | 5.768.320,67 | 7.301.647,66 | 5.807.366,56 |
| Agricultura e meio ambiente | 3 e 500 · 3 e 600 · 2 e 100 | 3.459.160,87 | 3.641.525,04 | 2.091.140,61 |
| Esporte | 2 e 400 · 3 e 700 · 1 e 600 | 2.378.076,24 | 3.651.639,46 | 1.581.949,90 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| só a ação de eventos tradicionais, as festas: 5 milhões e 200 em 2024 | 5.236.040,12 | 2024-12_PCMGE065.pdf | p.5 · ação 4.392.48.2009 "EVENTOS TRADICIONAIS" · TOTAL DA ATIVIDADE · Liquidadas até o mês |
| 6 milhões e 600 em 2025 | 6.599.743,85 | 2025-12_PCMGE015.pdf | p.8 · ação 301.1.4.392.6.1.2009 "EVENTOS TRADICIONAIS" · Total do Projeto/Atividade · Liquidações até o mês |
| quase o dobro de agricultura e meio ambiente juntos, no mesmo ano | 3.641.525,04 (agricultura 2.654.165,68 + meio ambiente 987.359,36) | 2025-12_PCMGE015.pdf · 2025_PCAGO007.pdf (Anexo 9, funções 20 e 18) | conta própria: 6.599.743,85 ÷ 3.641.525,04 = 1,81 |
| o IPTU da cidade inteira, em 2025, rendeu 307 mil | 307.080,43 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadada até Mês |
| em 2026, até agosto, as festas já levaram 5 milhões e 300 | 5.314.675,79 (empenhado 5.480.272,26) | 2026-08_PCMGE065.pdf | p.6 · ação 301.1.4.392.2.1.2009 "EVENTOS TRADICIONAIS" · Total da Ação de Governo · Liquidada até o Mês |
| quatro obras de escola e creche, somando 2 milhões e 800 previstos, não tiveram um real empenhado | dotação atual 2.762.985,00 (564.301,00 + 1.304.108,00 + 644.576,00 + 250.000,00); Empenhada até o mês = 0,00 em cada uma | 2026-08_PCMGE065.pdf | p.17 ação 304.4.12.361.3.1.1030 "Obras de infra-estrutura para educação fundamental" · p.18 ação 304.4.12.365.3.1.1032 "Construção de unidade escolar do ensino infantil" · p.19 ações 304.4.12.361.3.1.1058 "Infra-estrutura para educação fundamental" e 304.4.12.365.3.1.1059 "Construção, ampliação e reforma de creches/escolas infantis" · Total da Ação de Governo (Dotação Atual; Empenhada até o Mês 0,00); soma: conta própria |
| a Câmara de Vereadores recebeu 7 milhões e 300 da prefeitura em 2025 | 7.255.969,49 | 2025-12_PCMGE018.pdf (Razão da Prefeitura) | p.10 · 3.5.1.1.2.02.00 REPASSE CONCEDIDO · saldo até o mês (12 × 604.664,17, igual ao duodécimo do 2025-12_PCMGE008.pdf) |
| e devolveu 543 mil | 542.880,99 | 2025-12_PCMGE018.pdf | p.14 · 4.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS (recebida da Câmara) · até o mês (7.255.969,49 − 542.880,99 = 6.713.088,50, o gasto da Câmara) |
| só em combustível, 554 mil | 554.260,81 | 2025-12_CAMARA_PCMGE015.pdf (escaneado, lido na imagem) | p.2 · 3.3.90.30.01 Combustíveis e lubrificantes automotivos · Liquidações até Mês |
| em consultoria, 524 mil | 523.800,00 (343.800,00 + 180.000,00) | 2025-12_CAMARA_PCMGE015.pdf (lido na imagem) | p.2 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica + 3.3.90.35.99 Outros serviços de consultoria · Liquidações até Mês (soma: conta própria) |
| em diárias, 283 mil | 283.391,00 | 2025-12_CAMARA_PCMGE015.pdf (lido na imagem) | p.2 · 3.3.90.14.00 Diárias - civil · Liquidações até Mês |
| os royalties da mineração renderam 16 milhões e 200 em 2025 | 16.154.316,29 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.2.51.0.0 Cota-parte da Compensação Financeira pela Exploração de Recursos Minerais (CFEM) · Arrecadada até Mês |
| mais que o dobro de tudo que a cidade gastou com agricultura, meio ambiente e esporte | 7.293.164,50 (3.641.525,04 + 3.651.639,46) | 2025-12_PCMGE015.pdf | conta própria: 16.154.316,29 ÷ 7.293.164,50 = 2,21 |
| se as festas já levaram 5 milhões e 300 este ano | 5.314.675,79 | 2026-08_PCMGE065.pdf | p.6 (acima) |

## Câmara: repasse (duodécimo), nas folhas
| Ano | Recebeu | Devolveu | Arquivo · página |
|---|---|---|---|
| 2024 | 6.107.687,56 | 500.681,68 | 2024-12_PCMGE018.pdf (Razão da Prefeitura) · p.24 3.5.1.1.2.02 Repasse concedido · p.27 4.5.1.1.2.09 Devolução de transferências |
| 2025 | 7.255.969,49 | 542.880,99 | 2025-12_PCMGE018.pdf · p.10 e p.14 |
| 2026 até ago | 5.152.582,80 | 199.588,23 | 2026-08_PCMGE018.pdf · p.8 e p.11 |

## Câmara 2025 por tipo de despesa (folha; 2025-12_CAMARA_PCMGE015.pdf, escaneado, lido na imagem, p.2 e p.3)
Vencimentos e salários 3.205.784,19 · INSS 400.534,51 · indenizações trabalhistas 5.244,30 + 38.155,68 · diárias 283.391,00 · combustíveis 554.260,81 · alimentação 18.609,28 · expediente 22.373,67 · limpeza 20.681,51 · material de veículos 18.832,93 · outros materiais 23.338,15 · terceirização 475.142,37 · assessoria e consultoria 343.800,00 · outras consultorias 180.000,00 · manutenção de veículos 8.194,49 · energia 21.571,34 (o valor fica no pé da p.2, sem rótulo; o rótulo é o 1º da p.3) · água 8.395,93 · publicidade legal 8.400,00 · outros serviços de terceiros PJ 988.593,01 · locação de softwares 12.000,00 · outros TIC 10.000,00 · material permanente 65.785,33. Soma = 6.713.088,50 = Total do Projeto/Atividade (p.3).

## Dívidas (destaque das folhas)
Dívida parcelada com o INSS (RGPS): fim de 2024 29.858.753,36 (2024_PCAGO012.pdf p.1, conta 2.2.1.4; e 2025_PCAGO012.pdf p.1, Saldo Anterior) · fim de 2025 22.892.787,24 (2025_PCAGO012.pdf p.1 · 22143010100000 CONTRIBUIÇÕES AO RGPS - DÉBITO PARCELADO · Saldo Atual).

## Pendências no e-TCM (não usadas)
- `2024_PCAGO008.pdf` (Anexo 10 na prestação de 2024) é de 2025 e parcial.
- `2025-12_PCMGE065.pdf` (consolidado de dez/2025) incompleto.
- PCMGE015/018 da Câmara escaneados (2025 lido na imagem; 2024 e 2026 pelo consolidado).
