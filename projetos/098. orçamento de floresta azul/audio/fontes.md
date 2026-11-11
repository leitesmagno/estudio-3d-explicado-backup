# Fontes do 098. orçamento de floresta azul (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 01:18 e 01:31, pelo recebedor 127.0.0.1:8778, pasta FLORESTA-AZUL, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-FLORESTA-AZUL/documentos_tcm/` (36 PDFs, todos com "FLORESTA AZUL" conferido no cabeçalho).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 133 (FLORESTA AZUL) · Prefeitura UJ 738 · Câmara UJ 166 (sem autarquia com prestação própria). Último mês entregue de 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário anual; em 2026, PCMGE066/016 até setembro), já sem a parte que vai para o Fundeb e sem as anulações, como o documento traz.
O PCMGE065 (demonstrativo consolidado da despesa, SIGA) traz Prefeitura + fundos + Câmara e fecha centavo a centavo com o Balanço Orçamentário em 2024 e 2025 (scripts/acoes_cons.py: soma das 100 / 102 / 97 ações = linha TOTAL).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026 ~02:00, cada número do roteiro contra saida/setores.json, receita_*.json e os PDFs); 2ª antes do vídeo final (ver fim do arquivo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 50 milhões e 300 em 2024 | 50.346.352,65 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas; igual ao 2024_PCAGO008.pdf (Anexo 10) Total Receita 55.905.078,79 − dedução do Fundeb 5.558.726,14 |
| gastou 49 milhões e 900 em 2024 | 49.892.026,20 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas; igual ao TOTAL do 2024-12_PCMGE065.pdf (p.89, Liquidada até o mês) e ao Anexo 9 (2024_PCAGO007.pdf, Total) |
| sobraram 454 mil em 2024 | 454.326,45 | conta própria | 50.346.352,65 − 49.892.026,20 |
| arrecadou 54 milhões e 900 em 2025 | 54.888.857,83 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas; igual ao Anexo 10 (2025_PCAGO008.pdf) 60.945.511,66 − Fundeb 6.056.653,83 |
| gastou 59 milhões em 2025 | 58.973.421,21 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas; igual ao TOTAL do 2025-12_PCMGE065.pdf (p.96) |
| 4 milhões e 100 a mais em 2025 | 4.084.563,38 | conta própria | 58.973.421,21 − 54.888.857,83 (o Balanço usa "saldos de exercícios anteriores" para cobrir) |
| arrecadou 44 milhões e 300 até set/2026 | 44.305.068,48 | 2026-09_PCMGE066.pdf (consolidado) | p.13 · Totais · Arrecadada até o mês 44.379.409,14 − anuladas 74.340,66; igual ao 2026-09_PCMGE016.pdf p.7 |
| já gastou 48 milhões e 200 até set/2026 | 48.241.662,88 | 2026-09_PCMGE065.pdf (consolidado) | p.92 · TOTAL · Liquidada até o mês |
| 3 milhões e 900 a mais | 3.936.594,40 | conta própria | 48.241.662,88 − 44.305.068,48 |
| já comprometeu 55 milhões e 900 | 55.878.891,64 | 2026-09_PCMGE065.pdf | p.92 · TOTAL · Empenhada até o mês |

Observação (não dita): no Balanço de 2024 a contribuição de iluminação pública (COSIP) aparece com R$ 5.108.732,15 (Anexo 10, código 12415001000); no PCMGE066 de dez/2024 (SIGA), com R$ 1.470.720,16. A diferença (3.638.011,99) é a única entre os dois totais de 2024. Usamos o Balanço, que é o documento anual oficial. A folha de receita de 2024 mostra a COSIP do Balanço.

## Setores (soma = total do ano, diferença 0,00) · scripts/setores.py → saida/setores.json
Setor = unidade orçamentária do PCMGE065 consolidado (coluna Liquidada até o mês). Dívidas = ação "Pagamento de financiamentos e contratos" (elemento 4.6.90.71 Principal da dívida contratual resgatado) + "Pagamento de precatórios" (R$ 0 nos três anos). Administração = Gabinete, Procuradoria, Secretaria de Administração e Finanças (sem a dívida) e Secretaria de Indústria, Comércio e Energia. Cultura = função 13 (Fundo de Cultura e atividades culturais). Esporte = Secretaria/Unidade de Esporte, Turismo e Lazer.
Arquivos: 2024-12_PCMGE065.pdf (100 ações, 89 p.) · 2025-12_PCMGE065.pdf (102 ações, 96 p.) · 2026-09_PCMGE065.pdf (97 ações, 92 p.).

| Setor (dito) | 2024 | 2025 | 2026 até set | Páginas no PCMGE065 (2024 · 2025 · 2026) |
|---|---|---|---|---|
| Educação (18,6 · 18,4 · 16,9 mi) | 18.630.235,94 | 18.417.795,01 | 16.891.036,72 | p.9 a 33 · p.9 a 34 · p.11 a 35 |
| Saúde (12 · 13,8 · 12,4 mi) | 12.006.213,43 | 13.765.992,00 | 12.371.017,01 | p.35 a 54 · p.39 a 61 · p.41 a 60 |
| Administração (6,6 · 10,9 · 7,3 mi) | 6.631.295,56 | 10.872.141,31 | 7.335.152,73 | p.1 a 8 e 57 · p.1 a 8 e 64 · p.1 a 9 e 62 |
| Obras e serviços urbanos (6,2 · 7,4 · 5,5 mi) | 6.217.381,16 | 7.427.385,69 | 5.517.532,27 | p.58 a 66 · p.65 a 73 · p.63 a 71 |
| Câmara de Vereadores (1,9 · 2,2 · 1,5 mi) | 1.906.520,70 | 2.158.182,92 | 1.494.881,71 | p.87 e 88 · p.94 e 95 · p.90 e 91; igual ao Anexo 9 função 01 (2024: 1.906.520,70; 2025: 2.158.182,92) |
| Dívidas (86 mil · 2 mi · 1,1 mi) | 85.568,30 | 2.011.533,71 | 1.112.668,79 | p.5 e 7 · p.5 e 7 · p.4 e 8 (ações 2012/2013, elemento 4.6.90.71) |
| Assistência social (3 · 3,4 · 2,7 mi) | 2.959.720,67 | 3.423.033,11 | 2.714.206,82 | p.67 a 84 · p.74 a 91 · p.72 a 89; 2024 igual ao Anexo 9 (Assistência Social 2.959.720,67) |
| Agricultura e meio ambiente (212 · 455 · 417 mil) | 212.490,37 | 455.401,68 | 417.234,99 | p.85 a 87 · p.92 a 94 · p.9 a 11 |
| Cultura (160 · 433 · 387 mil) | 159.652,88 | 433.118,78 | 386.931,84 | p.34 · p.35 a 39 · p.38 a 40; 2025 igual ao Anexo 9 função 13 (433.118,78) |
| Esporte (1,1 mi · 8,8 mil · mil reais) | 1.082.947,19 | 8.837,00 | 1.000,00 | p.54 a 56 · p.61 a 63 · p.35 e 36 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| esporte levou 1 milhão e 100 em 2024, quase tudo em quadras | 1.082.947,19; quadras 1.070.210,19 | 2024-12_PCMGE065.pdf | p.54 · ação 11.11.27.812.4.1.1017 "Construção e recuperação de quadras poliesportivas" · Total da Ação, Liquidada; p.55 ação 2030 (1.000,00); p.56 ação 2051 (11.737,00) |
| esporte 8 mil e 800 em 2025 | 8.837,00 | 2025-12_PCMGE065.pdf | p.63 · ação 2051 "Gerenc. das ações da Sec. de Esportes, Turismo e Lazer" (as ações 1017 e 2030, p.61 e 62, com dotação e liquidado 0,00) |
| esporte mil reais até set/2026 | 1.000,00 | 2026-09_PCMGE065.pdf | p.36 · ação 106.603…2034, elemento 3.3.90.14 Diárias; ações 1008 (p.35) e 2035 (p.36) com 0,00 |
| a administração foi de 6 milhões e 600 para 10 milhões e 900 | 6.631.295,56 → 10.872.141,31 | PCMGE065 dez/2024 e dez/2025 | setor Administração (tabela acima) |
| serviços de consultoria, prefeitura e Câmara, 2 milhões em 2025 | 2.044.443,71 | 2025-12_PCMGE065.pdf | elemento 3.3.90.35 "Serviços de consultoria", Liquidada: p.6 ação 6.6…2010 Sec. de Administração e Finanças 1.068.913,71 · p.12 ação 7.7…2024 Educação 258.000,00 · p.43 ação 9.10…2034 Saúde 157.880,00 + 70.150,00 · p.74 ação 14.14…2050 Assistência social 55.000,00 · p.95 ação 1.101…2002 Câmara 434.500,00. Soma: conta própria (scripts/paginas.py) |
| em 2024 tinham sido 169 mil | 169.000,00 | 2024-12_PCMGE065.pdf | p.88 · ação 1.101…2002 Manutenção das ações legislativas (Câmara), elemento 3.3.90.35; nenhuma outra ação de 2024 tem liquidado nesse elemento |
| Câmara 2 milhões e 200 em 2025, quase 5 vezes agricultura e meio ambiente | 2.158.182,92 ÷ 455.401,68 = 4,74 | setores 2025 | conta própria |
| IPTU: 3 mil e 300 reais em 2025 inteiro | 3.327,84 | 2025_PCAGO008.pdf (Anexo 10, receita 2025) | p.1 · código 11125000000 "Imposto sobre a Propriedade Predial e Territorial Urbana" · coluna Até o Período (orçado 95.000,00) |
| deve 50 milhões | 50.405.371,40 | 2025_PCAGO012.pdf (Anexo 16, dívida fundada 2025) | p.1 · linha Totais · Saldo Atual |
| 38 milhões são do INSS | 38.070.616,67 | 2025_PCAGO012.pdf | p.1 · Parcelamento INSS (P) 499.162,04 + 37.571.454,63 (conta própria) |
| 8 milhões e 800 da Embasa | 8.834.588,82 | 2025_PCAGO012.pdf | p.1 · 222310198001 Parcelamento Dívida EMBASA (P) · Saldo Atual |
| quase tudo o que arrecadou em 2025 | 50.405.371,40 x 54.888.857,83 | Anexo 16 e Balanço 2025 | comparação |
| a consultoria levou 2 milhões em 2025 · esporte 8 mil e 800 | 2.044.443,71 · 8.837,00 | acima | acima |

## Câmara (folhas)
| Valor | Arquivo | Página · linha |
|---|---|---|
| recebeu da prefeitura 1.906.959,76 em 2024 · devolveu 472,77 | 2024-12_CAMARA_PCMGE018.pdf (razão) | 451120200000 REPASSE RECEBIDO · Saldo atual; 351120900000 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS |
| recebeu 2.171.273,27 em 2025 · devolveu 13.053,69 | 2025-12_CAMARA_PCMGE018.pdf | 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo atual credor; 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Saldo atual |
| recebeu 1.782.899,32 até set/2026 (creditado 1.832.899,32 − debitado 50.000,00) · devolveu 166.700,00 | 2026-09_CAMARA_PCMGE018.pdf | 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo atual credor; 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Saldo atual |

## Dívida (folhas de Dívidas)
| Valor | Arquivo | Página · linha |
|---|---|---|
| dívida no fim de 2024: 50.831.988,49 · INSS 38.273.565,81 | 2024_PCAGO012.pdf | p.1 · Totais · Saldo Atual; 221430101001 Parcelamento INSS |
| dívida no fim de 2025: 50.405.371,40 · INSS 38.070.616,67 | 2025_PCAGO012.pdf | p.1 · Totais; INSS curto + longo prazo (conta própria) |

## Receita (folhas de receita) · scripts/anexo10.py + receita.py → saida/receita_*.json
2024 e 2025: Anexo 10 (PCAGO008), coluna "Até o Período" lida por posição no PDF; FPM, ICMS e IPVA já sem a dedução do Fundeb (códigos 95…). 2026: PCMGE016 set/2026 (arrecadada até o mês, já sem o Fundeb, mais as anulações). Linha "Outras receitas" = total − soma das linhas (ITR, IPI, CIDE, multas, restituições e outras transferências). Soma de cada folha = total do ano.

## Pendências no TCM
- PCMGE018 (razão) de dez/2024 e de dez/2025 da Prefeitura vieram com 1 página escrita "Em Elaboração" (não usados; o repasse à Câmara foi conferido pelo razão da própria Câmara).
- Decisões do TCM: não consultadas (a busca pede captcha; o molde 093 também não tem Tribunal).
