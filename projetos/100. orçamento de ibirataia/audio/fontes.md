# Fontes do 100. orçamento de ibirataia (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 03:08 e 03:25, pelo recebedor 127.0.0.1:8778, pasta IBIRATAIA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-IBIRATAIA/documentos_tcm/` (43 PDFs, todos com "IBIRATAIA" conferido no cabeçalho).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 156 (IBIRATAIA) · Prefeitura UJ 760 · Câmara UJ 189 (sem autarquia com prestação própria). Último mês entregue de 2026: 09/2026 (10/2026 "Pendente").
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário de 2024 e 2025; em 2026, PCMGE016 até setembro), já sem a parte que vai para o Fundeb e sem as anulações, como o documento traz.
Despesa por setor: PCMGE065 (Demonstrativo Consolidado da Despesa Orçamentária, SIGA: Executivo, Legislativo e fundos) de dez/2024, dez/2025 e set/2026, coluna Liquidada "até o mês". Soma das ações = linha TOTAL do PDF = Balanço Orçamentário, centavo a centavo (scripts/acoes_cons.py e setores.py). Setor pela FUNÇÃO da ação.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026 ~03:40, cada número contra saida/setores.json, receita_*.json, acoes_*.json e os PDFs); 2ª antes do vídeo final (fim do arquivo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 107 milhões e 500 em 2024 | 107.522.926,39 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas; igual ao 2024-12_PCMGE016.pdf · TOTAL · Arrecadada até Mês + Anulada até Mês |
| gastou 110 milhões e 600 em 2024 | 110.631.546,95 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; = soma das ações do 2024-12_PCMGE065.pdf |
| 3 milhões e 100 a mais em 2024 | 3.108.620,56 | conta própria | 110.631.546,95 − 107.522.926,39 |
| arrecadou 108 milhões e 600 em 2025 | 108.579.034,44 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas; igual ao 2025-12_PCMGE016.pdf TOTAL (110.370.995,84 − 1.791.961,40) |
| gastou 114 milhões em 2025 | 114.010.167,53 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; = soma das ações do 2025-12_PCMGE065.pdf |
| 5 milhões e 400 a mais em 2025 | 5.431.133,09 | conta própria | 114.010.167,53 − 108.579.034,44 |
| arrecadou 100 milhões e 700 até set/2026 | 100.686.222,90 | 2026-09_PCMGE016.pdf | p.7 · TOTAL · Arrecadada até Mês 103.118.246,00 + Anulada até Mês −2.432.023,10 (igual ao 2026-09_PCMGE066.pdf consolidado) |
| gastou 97 milhões até set/2026 | 96.981.740,46 | 2026-09_PCMGE065.pdf | p.78 · TOTAL · Liquidada até o Mês |
| sobraram 3 milhões e 700 | 3.704.482,44 | conta própria | 100.686.222,90 − 96.981.740,46 |
| já comprometeu 102 milhões e 200 | 102.161.472,28 | 2026-09_PCMGE065.pdf | p.78 · TOTAL · Empenhada até o Mês |

## Receita por ano (folha "PDF", não falada; scripts/receita.py → saida/receita_AAAA.json)
PCMGE016 SIGA da Prefeitura (dez/2024, dez/2025, set/2026), "Arrecadada até Mês" + "Anulada até Mês" por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, COSIP 1.2.4, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties 1.7.1.2, SUS 1.7.1.3 + 1.7.2.3 + 2.4.1.1, FNDE 1.7.1.4, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, convênios 1.7.2.4 + 2.4.1.4 + 2.4.1.9 + 2.4.2); "Outras receitas" fecha o total (diferença 0,00).

## Setores (soma = total do ano, diferença 0,00) · scripts/setores.py → saida/setores.json
Função da ação no PCMGE065: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 (habitação) + 17 (drenagem) + 26 (estradas vicinais) · Administração 04 + 06 · Dívidas 28 (encargos gerais / da dívida, PASEP) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 · Esporte 27.
Páginas (PCMGE065): ver ~/Documents/RECEITAS-DESPESAS-IBIRATAIA/saida/paginas_setores.txt (ex.: 2025 Educação p.65 a 74, Câmara p.41 a 42, Dívidas p.40).

| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024-12_PCMGE065.pdf) | 2025 (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 39 e 700 · 44 e 700 · 41 e 200 | 39.677.712,11 | 44.653.916,93 | 41.210.595,60 |
| Saúde | 23 e 400 · 22 e 600 · 21 e 300 | 23.432.359,75 | 22.619.755,39 | 21.281.163,66 |
| Obras e serviços urbanos | 14 e 600 · 16 milhões · 13 e 900 | 14.573.066,81 | 15.969.816,64 | 13.902.093,89 |
| Administração | 12 e 300 · 11 e 800 · 9 e 100 | 12.349.378,50 | 11.783.509,33 | 9.127.184,29 |
| Dívidas | 7 e 700 · 7 milhões · 2 e 700 | 7.684.812,85 | 6.989.828,53 | 2.742.209,69 |
| Assistência social | 3 e 800 · 2 e 900 · 3 e 400 | 3.824.469,20 | 2.897.723,88 | 3.440.899,26 |
| Câmara de Vereadores | quase 3 milhões · 3 milhões e 500 · 2 milhões e 700 | 2.956.402,64 (Total do Poder Legislativo) | 3.503.504,18 (p.42) | 2.735.310,44 (p.34 a 35) |
| Cultura e festas | 3 e 200 · 3 e 900 · 1 e 800 | 3.225.984,19 | 3.887.163,69 | 1.756.639,94 |
| Agricultura e meio ambiente | 2 e 400 · 1 e 400 · 586 mil | 2.416.507,36 | 1.448.972,54 (p.6) | 586.138,91 (p.3) |
| Esporte | 491 mil · 256 mil · 199 mil | 490.853,54 | 255.976,42 | 199.504,78 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| festas e eventos: 3 milhões e 100 em 2024 | 3.149.634,03 | 2024-12_PCMGE065.pdf | p.3 · ação 2.1100.13.392.11.2.2019 "Promoção e realização de eventos culturais e tradicionais" · Total da Ação · Liquidada até o mês |
| 3 milhões e 900 em 2025 | 3.887.163,69 | 2025-12_PCMGE065.pdf | p.9 · mesma ação 2.1100.13.392.11.2.2019 · Total da Ação · Liquidada até o mês |
| mais que o dobro de agricultura e esporte juntos, no mesmo ano | 1.448.972,54 + 255.976,42 = 1.704.948,96 (festas ÷ soma = 2,28) | 2025-12_PCMGE065.pdf | conta própria com os totais dos setores acima |
| o IPTU da cidade inteira, em 2025, rendeu 304 mil | 304.182,26 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadada até Mês |
| em 2026, a agricultura gastou 586 mil, tudo para manter a secretaria | 586.138,91 | 2026-09_PCMGE065.pdf | p.1 a 3 · ação 2.1001.20.122 "Manutenção das ações administrativas da Sec. de Agricultura" (única ação da função 20 com liquidado) |
| poços, máquinas, sementes e apoio à agricultura familiar: nada empenhado | 0,00 empenhado em cada ação (previstos 10.000,00 · 45.800,00 · 10.000,00 · 46.000,00) | 2026-09_PCMGE065.pdf | p.1 a 3 · ações 20.608 "Construção de poços artesianos e barragens", "Aquisição de máquinas e equipamentos agrícolas", "Programa de distribuição de sementes e defensivos", 20.541 "Apoio e fortalecimento da agricultura familiar" · Empenhada até o mês = 0,00 (também 0,00: centro comercial, biofábrica, agricultores e meeiros) |
| no esporte, nove programas previstos, nenhum teve um real empenhado | 0,00 empenhado em 9 ações (previsto somado 483.179,78) | 2026-09_PCMGE065.pdf | p.28 a 32 · ações 27.812: construção de equipamentos 131.000,00; centros comunitários 51.154,78; workshops 33.000,00; comunicação desportiva 30.000,00; esporte adaptado 50.000,00; eventos e competições 38.400,00; esporte amador 51.625,00; bolsa atleta 58.000,00; jogos escolares 40.000,00 · Empenhada até o mês = 0,00 em todas (gasto do esporte: secretaria 193.221,45 e conservação 6.283,33) |
| a Câmara recebeu 3 milhões e 600 da prefeitura em 2025 | 3.647.756,57 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara, escaneado: lido na imagem) | p.8 ("Página 7 de 11") · conta 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês; devolveu 143.333,79 (3.5.1.1.2.02.00 REPASSE CONCEDIDO) |
| só em consultoria, 498 mil | 498.480,00 | 2025-12_PCMGE065.pdf | p.42 · ação 1.1010.1.31 "Gestão do processo legislativo" · elemento 3.3.90.35.00 Serviços de consultoria · Liquidada |
| a Câmara gastou mais que o dobro da agricultura e meio ambiente (2025) | 3.503.504,18 ÷ 1.448.972,54 = 2,42 | conta própria | totais dos setores acima |
| no começo de 2024, a dívida parcelada com o INSS era de 65 milhões | 65.153.987,30 | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna) | p.1 · Saldo Anterior: 2.1.1.4.3.01.02.01 Contribuições ao RGPS - débito parcelado 3.603.186,26 + 2.2.1.4.3.01.01.01 INSS - débito parcelado 61.550.801,04 (conta própria: soma) |
| no fim de 2024, 120 milhões | 120.112.989,87 | 2024_PCAGO012.pdf | p.1 · Saldo Atual: 1.709.389,83 + 118.403.600,04 (inscrição de 60.352.799,00 no ano) |
| no fim de 2025, 107 milhões | 107.314.094,73 | 2025_PCAGO012.pdf | p.1 · Saldo Atual: DÍVIDA FUNDADA INSS_EXECUTIVO 4.534.093,90 + 102.780.000,83 (a linha TOTAIS 107.708.926,80 confere com a soma de todas as linhas) |
| quase tudo o que a cidade arrecadou em um ano | 108.579.034,44 (receita 2025) | 2025_PCAGO015.pdf | p.1 (acima) |
| se as festas já levaram 1 milhão e 800 este ano | 1.756.639,94 | 2026-09_PCMGE065.pdf | p.7 · ação 2.1100.13.392.11.2.2019 "Manutenção das atividades artísticas cívicas e culturais" · Liquidada até o mês |

## Câmara: repasse (duodécimo), nas folhas
| Ano | Recebeu | Devolveu | Arquivo · página |
|---|---|---|---|
| 2024 | 2.958.028,29 | 3.743,69 (3.5.1.1.2.09 Devolução de transferências recebidas) | 2024-12_CAMARA_PCMGE018.pdf · p.7 ("Página 6 de 10") · 4.5.1.1.2.02.00 Repasse recebido · Creditado até o Mês (lido na imagem) |
| 2025 | 3.647.756,57 | 143.333,79 | 2025-12_CAMARA_PCMGE018.pdf · p.8 ("Página 7 de 11") |
| 2026 até set | 2.971.314,78 | 60.000,00 | 2026-09_CAMARA_PCMGE018.pdf · p.7 ("Página 6 de 10") |

## Observações (não ditas)
- Royalties de petróleo (1.7.1.2): 8.037.447,00 (2024), 7.444.840,11 (2025), 7.097.035,82 (2026 até set), na folha de receita.
- 2024: a agricultura teve 1.463.900,00 em equipamentos (4.4.90.52) na ação da secretaria; casas populares 2.010.565,41 (função 16, dentro de Obras); em 2026 a ação de casas populares tem 1.516.500,00 previstos e 2.200,00 empenhados (não falado).
- Nada citado de notícia; nenhum nome de gestor ou de empresa.
