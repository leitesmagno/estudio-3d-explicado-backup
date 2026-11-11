# Fontes do 105. orçamento de mascote (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 06:54 e 07:06, pelo recebedor 127.0.0.1:8778, pasta MASCOTE, sem janela, fetch + /salva). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-MASCOTE/documentos_tcm/` (53 PDFs, todos com "MASCOTE" conferido no texto).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 252 (MASCOTE) · Prefeitura UJ 856 · Câmara UJ 285 (sem autarquia com prestação própria; os fundos vêm no consolidado). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário de 2024 e 2025; em 2026, Demonstrativo Consolidado da Receita até setembro), como o documento traz.
Despesa por setor (soma das ações = total do ano, diferença 0,00; scripts/acoes065m.py + scripts/setores.py → saida/setores.json):
- Os três anos pelo PCMGE065 consolidado (Prefeitura + fundos + Câmara), layout "Especificações / Códigos / Fontes", ação "função.subfunção.programa.tipo.ação": soma das ações = TOTAL GERAL da Despesa Orçamentária, centavo a centavo (2024: 76.470.590,42, p.32; 2025: 84.445.940,63, p.33; 2026: 65.091.026,03, p.31).
- 2ª conferência: 2025 igual ao Anexo IX (`2025_PCAGO007.pdf`, liquidado) função por função. 2024: o Anexo IX traz o EMPENHADO (76.663.225,94); a única função diferente é a Educação (26.525.838,61 empenhados, 26.333.203,07 liquidados: 192.635,54 de restos a pagar não processados). O Balanço 2024 dá 76.470.590,40 liquidados (2 centavos de arredondamento contra o PCMGE065).
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 + 17 · Administração 04 (e 11, sem gasto) · Dívidas 28 (subfunções 843 e 846) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json, receita_*.json, acoes_*.json); 2ª com cada valor exato procurado no texto do PDF citado (scripts/achar.py) e com o Anexo IX. As somas estão marcadas como conta própria.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 77 milhões e 400 em 2024 | 77.352.286,68 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 76 milhões e 500 em 2024 | 76.470.590,40 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.32, 76.470.590,42) |
| sobraram 882 mil em 2024 | 881.696,28 | conta própria | 77.352.286,68 − 76.470.590,40 |
| arrecadou 83 milhões e 200 em 2025 | 83.185.855,91 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 84 milhões e 400 em 2025 | 84.445.940,63 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.33) |
| 1 milhão e 300 a mais do que arrecadou | 1.260.084,72 | conta própria | 84.445.940,63 − 83.185.855,91 (o Balanço mostra o mesmo valor como déficit, linha VI) |
| arrecadou 71 milhões e 800 até setembro de 2026 | 71.824.451,00 | 2026-09_PCMGE066.pdf (Demonstrativo Consolidado da Receita, set/2026) | p.10 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês (já sem a dedução do Fundeb) |
| gastou 65 milhões e 100 até setembro de 2026 | 65.091.026,03 | 2026-09_PCMGE065.pdf | p.31 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado No Ano |
| sobraram 6 milhões e 700 | 6.733.424,97 | conta própria | 71.824.451,00 − 65.091.026,03 |
| já comprometeu 81 milhões e 300 | 81.294.831,98 | 2026-09_PCMGE065.pdf | p.31 · TOTAL GERAL · Empenhado No Ano |

## Receita por ano (folha "PDF", não falada; scripts/receita.py → saida/receita_AAAA.json)
2024: Anexo 10 (`2024_PCAGO008.pdf`, coluna Arrecadado Ano). 2025: Anexo 10 (`2025_PCAGO008.pdf`). 2026: `2026-09_PCMGE066.pdf` (Arrecadado até Mês). Nos três, FPM, ICMS e IPVA aparecem brutos e foram deixados líquidos com as deduções do Fundeb do mesmo documento (9.1.7.1.15.1 FPM, 9.1.7.2.15.0 ICMS, 9.1.7.2.15.1 IPVA); a dedução do ITR e do IPI fica em "Outras receitas". Grupos por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, iluminação 1.2.4, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties 1.7.1.2 + 1.7.2.2 (quase tudo do petróleo, 1.7.1.2.52), SUS 1.7.1.3 + 1.7.2.3 + 2.4.1.1, FNDE 1.7.1.4, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, convênios e emendas 1.7.1.7 + 1.7.1.9 + 1.7.2.4 + 2.4.1.4 + 2.4.1.9 + 2.4.2); "Outras receitas" fecha o total.

## Setores (soma = total do ano, diferença 0,00)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024-12_PCMGE065.pdf, soma das ações: conta própria) | 2025 (2025_PCAGO007.pdf, Anexo IX) | 2026 até set (2026-09_PCMGE065.pdf, soma das ações: conta própria) |
|---|---|---|---|---|
| Educação | 26 e 300 · 31 e 200 · 23 e 400 | 26.333.203,07 | 31.192.942,88 (função 12, p.2) | 23.444.172,33 |
| Saúde | 16 e 400 · 16 e 900 · 13 e 200 | 16.355.393,61 (= Anexo IX 2024 p.2) | 16.887.849,16 (função 10, p.2) | 13.167.760,62 |
| Obras e serviços urbanos | 5 e 700 · 6 e 100 · 1 e 300 | 5.660.778,10 (função 15) | 6.095.137,14 (função 15, p.2) | 1.291.533,89 (funções 15 + 16; 2.452.561,99 empenhados) |
| Administração | 18 e 700 · 17 e 800 · 16 e 600 | 18.710.746,73 (função 04, = Anexo IX 2024 p.1) | 17.814.195,38 (função 04, p.1) | 16.588.989,46 |
| Dívidas | 2 e 200 · 2 e 800 · 1 e 100 | 2.151.334,08 (função 28, = Anexo IX 2024 p.4) | 2.827.279,69 (função 28, p.4) | 1.104.325,40 (subfunção 843: 539.698,90 + 846: 564.626,50) |
| Assistência social | 2 e 700 · 3 e 100 · 2 e 700 | 2.677.512,52 | 3.056.041,49 (função 08, p.1) | 2.693.401,56 |
| Câmara de Vereadores | quase 2 milhões · 2 e 500 · 2 e 400 | 1.973.457,61 (= 2024-12_CAMARA_PCMGE015.pdf p.2 e Anexo IX 2024 p.1) | 2.453.880,28 (função 01, p.1; = 2025-12_CAMARA_PCMGE015.pdf p.2) | 2.383.019,96 (2026-09_PCMGE065.pdf p.1, Total da Unidade; = 2026-09_CAMARA_PCMGE015.pdf p.3) |
| Cultura e festas | 2 e 400 · 3 e 300 · 3 e 800 | 2.368.811,56 (p.10, Total da Unidade Cultura) | 3.295.742,64 (função 13, p.2) | 3.768.326,15 |
| Agricultura e meio ambiente | 239 mil · 740 mil · 422 mil | 239.353,14 (= Anexo IX 2024 p.3: 141.940,00 + 97.413,14) | 740.003,30 (p.3: 172.900,00 + 567.103,30) | 422.043,76 |
| Esporte | zero · 83 mil · 227 mil | 0,00 (4 ações de esporte, todas com empenho 0,00) | 82.868,67 (função 27, p.4) | 227.452,90 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| a ação de eventos culturais e tradicionais levou 2 milhões em 2024 | 1.998.647,19 | 2024-12_PCMGE065.pdf | p.9 · ação 13.392.0010.2.010 "Promoção e realização de eventos culturais e tradicionais" · TOTAL DA AÇÃO · Liquidado No Ano |
| em 2025, 3 milhões | 2.995.364,00 | 2025-12_PCMGE065.pdf | p.9 · ação 13.392.0010.2.010 · TOTAL DA AÇÃO · Liquidado No Ano |
| e o orçamento daquele ano previa 492 mil | 492.031,65 | 2025-12_PCMGE065.pdf | p.9 · mesma ação · TOTAL DA AÇÃO · Dotação Fixado (inicial) |
| em 2026, até setembro, os eventos já levaram 3 milhões e 500 | 3.540.175,00 | 2026-09_PCMGE065.pdf | p.5 · ação 13.392.0006.2.114 "Promoção e realização de eventos culturais e tradicionais" · TOTAL DA AÇÃO · Liquidado No Ano |
| e tem 4 milhões e 300 comprometidos | 4.251.575,00 | 2026-09_PCMGE065.pdf | p.5 · mesma ação · Empenhado No Ano |
| no mesmo 2025, os benefícios eventuais ficaram em 28 mil | 27.770,00 | 2025-12_PCMGE065.pdf | p.30 · ação 8.244.0006.2.077 "Gestão das ações do bloco de benefícios eventuais" · TOTAL DA AÇÃO · Liquidado No Ano (todo em 3.3.90.32.00 material de distribuição gratuita, p.29) |
| o orçamento previa 556 mil | 555.831,21 | 2025-12_PCMGE065.pdf | p.30 · mesma ação · Dotação Fixado (inicial) |
| o IPTU da cidade inteira: 79 mil em 2024 | 78.593,82 | 2024_PCAGO008.pdf (Anexo 10) | p.1 · 1.1.1.2.50.0.0.00.00.00 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadado Ano (previsto 793.864,00) |
| 116 mil em 2025 | 116.371,59 | 2025_PCAGO008.pdf (Anexo 10) | p.1 · 1.1.1.2.50.0.0.00.00.00 · Arrecadado Ano (previsto 857.373,12) |
| e 110 mil até setembro de 2026 | 109.773,21 | 2026-09_PCMGE066.pdf | p.1 · 1.1.1.2.50.0.0.00.00.00 · Arrecadado até Mês (previsto 156.000,00) |
| a Câmara recebeu quase 3 milhões da prefeitura em 2025 | 2.985.374,22 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o mês (= 2025-12_PCMGE018.pdf da Prefeitura, 3.5.1.1.2.02 Repasse concedido) |
| e devolveu 531 mil | 531.493,94 | 2025-12_CAMARA_PCMGE018.pdf | p.5 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o mês (recebido − devolvido = 2.453.880,28 = gasto da Câmara, conta própria) |
| só em consultoria, 392 mil | 392.400,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.00 Serviços de consultoria · Liquidações até mês (= 2025-12_PCMGE065.pdf p.1) |
| em diárias, 112 mil | 112.200,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.14.00 Diárias - civil · Liquidações até mês |
| a dívida parcelada com o INSS saiu de 43 milhões e 600 no fim de 2024 | 43.619.555,45 | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna) | p.1 · 1-INSS - Receita Federal - Parcelado · Saldo Atual |
| para 66 milhões e 700 no fim de 2025 | 66.747.138,48 (63.247.138,48 + 3.500.000,00) | 2025_PCAGO012.pdf (Anexo 16) | p.1 · 2.2.1.4.3.01.01.01 INSS - DÉBITO PARCELADO e 2.1.1.4.3.01.02 CONTRIBUIÇÕES AO RGPS - DÉBITO PARCELADO · Saldo Atual (soma: conta própria; a soma das linhas fecha com o TOTAIS 67.076.503,46). Em 2025 o anexo mostra inscrição de 25.954.426,29 + 4.127.279,69 no parcelamento |

## Outros valores das folhas (não falados)
- Câmara 2024: recebeu 2.585.369,64 e devolveu 611.912,03 (2024-12_CAMARA_PCMGE018.pdf p.4; recebido − devolvido = 1.973.457,61). 2026 até set: recebeu 2.539.673,73 e devolveu 149.500,00 (2026-09_CAMARA_PCMGE018.pdf p.6). Consultoria 2026 até set: 541.800,00 (2026-09_PCMGE065.pdf p.1).
- Pendência no TCM: nenhuma. O razão da Prefeitura de 2024 registra 542.912,03 de devolução recebida e o da Câmara 611.912,03 de devolução feita (diferença de 69.000,00 entre os dois razões, sem explicação nos documentos); o vídeo usa o da Câmara, que fecha com o gasto dela.
