# Fontes do 135. orçamento de caturama (BA)

Consulta: 12/11/2026 (downloads no e-TCM entre 00:48 e 01:19, pelo navegador do app com a trava _navegador-app.lock, recebedor 127.0.0.1:8778, pasta CATURAMA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-CATURAMA/documentos_tcm/` (63 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido no texto de cada PDF: todos trazem "CATURAMA".
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 92 (CATURAMA) · Prefeitura UJ 697 · Câmara UJ 124 (sem autarquia com prestação própria; os fundos de Saúde e de Assistência Social estão dentro dos consolidados). Último mês entregue em 2026: 09/2026.
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário de 2024 e 2025; PCMGE016 de 09/2026).
A despesa por setor sai do Demonstrativo Consolidado da Despesa (PCMGE065, SIGA do TCM: Prefeitura + fundos + Câmara), que fecha centavo a centavo com o Balanço em 2024 e 2025 (scripts/acoes065c.py e scripts/setores_ctm.py → saida/setores.json).
Conferido 2 vezes: 1ª depois do roteiro (12/11/2026, cada número contra saida/setores.json e os .json do leitor); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF citado com scripts/pag.py). Somas, diferenças e arredondamentos: conta própria.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 46 milhões e 200 em 2024 | 46.236.855,68 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 46 milhões e 500 em 2024 | 46.472.128,68 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.102, TOTAL, liquidado até o mês) |
| 235 mil a mais do que arrecadou | 235.273,00 | conta própria | 46.472.128,68 − 46.236.855,68 |
| arrecadou 60 milhões e 900 em 2025 | 60.914.825,69 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf, TOTAL: arrecadada 66.384.938,96 − anulada 5.470.113,27) |
| gastou 58 milhões e 800 em 2025 | 58.816.920,34 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.106, TOTAL) |
| sobraram 2 milhões e 100 | 2.097.905,35 | conta própria | 60.914.825,69 − 58.816.920,34 |
| arrecadou 55 milhões até setembro de 2026 | 54.954.765,37 | 2026-09_PCMGE016.pdf | p.9 · TOTAL · Arrecadada até o mês 55.228.827,83 − Anulada até o mês 274.062,46 (= 2026-09_PCMGE066.pdf p.16: 55.227.998,63 − 273.233,26); conta própria |
| gastou 52 milhões e 600 até setembro | 52.637.192,66 | 2026-09_PCMGE065.pdf | p.112 · TOTAL · Liquidada até o mês |
| sobraram 2 milhões e 300 | 2.317.572,71 | conta própria | 54.954.765,37 − 52.637.192,66 |
| já comprometeu 60 milhões e 600 | 60.561.268,30 | 2026-09_PCMGE065.pdf | p.112 · TOTAL · Empenhada até o mês |

## Setores (soma = total do ano; soma das ações por função no PCMGE065: conta própria)
Setor pela FUNÇÃO: Educação 12 · Saúde 10 · Administração 04 + 02 (indenizações trabalhistas) + 06 + 09 (PASEP) · Obras e serviços urbanos 15 + 16 (melhorias habitacionais) + 17 (rede de água) + 25 (iluminação) + 26 (estradas e pontes) · Câmara 01 · Dívidas e encargos 28 · Festas e eventos = ação "Comemoração de Festividades" (13.392) · Cultura = o resto da função 13 · Assistência social 08 · Agricultura e meio ambiente 20 + 18 + 23 · Esporte e lazer 27.

| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024-12_PCMGE065.pdf) | 2025 (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 20 e 400 · 27 e 300 · 27 e 900 | 20.402.080,36 (= 2024_PCAGO007.pdf p.2) | 27.255.938,08 | 27.865.543,70 |
| Saúde | 11 e 100 · 13 e 300 · 10 e 300 | 11.099.050,84 | 13.316.208,10 | 10.306.488,55 |
| Administração | 3 e 600 · 5 milhões · 3 e 600 | 3.595.481,66 | 4.967.434,76 | 3.592.567,09 |
| Obras e serviços urbanos | 6 e 700 · 7 e 800 · 5 e 300 | 6.694.380,43 | 7.754.969,49 | 5.312.656,70 |
| Câmara de Vereadores | 1 e 500 · 1 e 800 · 1 e 300 | 1.512.488,78 (p.55 e 56) | 1.789.919,12 (p.61 e 62) | 1.320.805,90 (p.64) |
| Dívidas e encargos | 824 mil · 1 e 900 · 1 e 100 | 824.333,51 | 1.885.081,72 | 1.123.185,32 |
| Festas e eventos | 856 mil · 27 mil · 1 e 700 | 855.672,61 (p.20) | 26.677,78 (p.58) | 1.672.425,30 (p.57) |
| Cultura (sem as festas) | 18 mil · 117 mil · 116 mil | 17.929,57 | 117.397,53 | 116.088,43 |
| Assistência social | 1 e 100 · 1 e 100 · 775 mil | 1.103.757,12 | 1.090.893,97 | 774.612,74 |
| Agricultura e meio ambiente | 326 mil · 572 mil · 488 mil | 326.449,16 | 571.852,13 | 487.880,63 |
| Esporte e lazer | 41 mil · 41 mil · 65 mil | 40.504,64 | 40.547,66 | 64.938,30 |

## Achados
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| a Câmara recebeu 1 milhão e 800 em 2025 | 1.818.468,07 | 2025-12_CAMARA_PCMGE018.pdf (escaneado, lido com OCR do Mac e conferido) | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo atual (credor) |
| e devolveu 28 mil | 28.548,95 | 2025-12_PCMGE018.pdf (razão da Prefeitura) | p.12 · 4.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Saldo atual (= razão da Câmara p.7, 3.5.1.1.2.09.00). Recebeu − devolveu = 1.789.919,12 = gasto da Câmara (conta própria) |
| a ação de festividades previa 615 mil em 2024 | 615.200,00 | 2024-12_PCMGE065.pdf | p.20 · ação 2.2030.13.392.50.2.2117 "Comemoração de Festividades" · Total da Ação de Governo · Dotação Fixada |
| e gastou 856 mil | 855.672,61 | 2024-12_PCMGE065.pdf | p.20 · mesma linha (2ª linha) · Liquidada até o mês (= 2024-12_PCMGE015.pdf p.1 a 2, mesma ação) |
| em 2025, gastou 27 mil | 26.677,78 | 2025-12_PCMGE065.pdf | p.58 · ação 2.2210.13.392.50.2.2319 "Comemoração de Festividades" · Liquidada até o mês (empenhado 135.677,78). A ação antiga 2.2117 (p.19) tinha 491.270,00 previstos e 0,00 gastos. Procurado "FEST", "EVENT", "JUN", "CARNAV", "SHOW" e "TURISM" em todas as ações: nenhuma outra de festa |
| em 2026, a previsão era de 601 mil | 601.000,00 | 2026-09_PCMGE065.pdf | p.57 · ação 2.2210.13.392.10.2.2117 "Comemoração de Festividades" · Dotação Fixada (a dotação atualizada subiu para 2.130.500,00) |
| e até setembro já foram 1 milhão e 700 | 1.672.425,30 | 2026-09_PCMGE065.pdf | p.57 · mesma ação · Liquidada até o mês (empenhado 1.754.324,46) |
| mais que o dobro de toda a assistência social do ano | 774.612,74 | 2026-09_PCMGE065.pdf | soma das ações da função 08 (conta própria); 2 × 774.612,74 = 1.549.225,48 < 1.672.425,30 |
| benefícios eventuais: 316 reais em 2024 | 316,00 | 2024-12_PCMGE065.pdf | p.92 a 93 · ação 5.2070.8.243.27.2.2296 "Benefícios Eventuais" · Liquidada até o mês (previsto 51.900,00) |
| 12 mil em 2025 | 12.184,00 | 2025-12_PCMGE065.pdf | p.96 · ação 7.2070.8.243.27.2.2296 "Gestão dos Benefícios Eventuais" · Liquidada até o mês (previsto 189.460,00) |
| e 62 mil até setembro de 2026 | 61.765,60 | 2026-09_PCMGE065.pdf | p.102 · ação 7.2070.8.243.6.2.2296 "Gestão dos Benefícios Eventuais" · Liquidada até o mês (previsto 200.900,00) |
| (folha) festas sem subelemento de banda ou palco | | 2024-12_PCMGE015.pdf e 2026-09_PCMGE015.pdf | a ação de festividades lança tudo em 3.3.90.39.99 "Outros serviços de pessoa jurídica" (748.969,00 em 2024; 1.608.084,84 em 2026), 3.3.90.36.99 pessoa física, 3.3.90.30.99 material e 3.3.90.33.99 locomoção: não dá para separar bandas e palco pelo PDF |

## Pendências e observações
- 2024-12_PCMGE018_2.pdf é de competência 01/2025 (enviado na prestação de 12/2024): não usado.
- Razão da Câmara de 12/2024 (2024-12_CAMARA_PCMGE018.pdf) só tem a capa; o de 09/2026 é escaneado e o OCR não pegou a linha inteira do repasse: o repasse da Câmara só é dito para 2025.
- Receita de 2024: PCMGE016 de 12/2024 dá 46.237.567,68 (arrecadada − anulada), 712,00 acima do Balanço; usado o Balanço.
- Nenhum nome de gestor no vídeo.
