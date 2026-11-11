# Fontes do 130. orçamento de são francisco do conde (BA)

Consulta: 10/11/2026, no e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), Google Chrome (Claude in Chrome), recebedor 127.0.0.1:8778, pasta SAO-FRANCISCO-DO-CONDE, fetch + /salva, sem janela. Pasta: `~/Documents/RECEITAS-DESPESAS-SAO-FRANCISCO-DO-CONDE/documentos_tcm/` (cada PDF com o texto ao lado em .txt).
e-TCM: município 357 (SÃO FRANCISCO DO CONDE) · Prefeitura UJ 961 · Câmara UJ 406 · Instituto de Previdência Municipal UJ 591 (as contas do Instituto, dos fundos de Saúde, Educação e Assistência e do consórcio SOMAR já vêm dentro do PCMGE015/016 CONSOLIDADO da Prefeitura e do Balanço do MUNICÍPIO). Último mês entregue de 2026: 09/2026 (Prefeitura e Câmara, entregue em 03/11/2026; 10/2026 ainda não aparece).
Município conferido no cabeçalho de cada PDF ("SÃO FRANCISCO DO CONDE" / "MUNICIPIO DE SAO FRANCISCO DO CONDE"). Competência conferida na linha "Competência:" de cada PDF mensal (Prefeitura 12/2025 e 09/2026; Câmara 12/2024, 12/2025 e 09/2026). Os PDFs de dez/2024 da Prefeitura (PCMGE015, 016, 018 e 065) são ESCANEADOS (imagem): por isso 2024 vem dos anuais em texto (Balanço, Anexo 6, Anexo 10 e relação de restos a pagar).
"Gastou" = despesa LIQUIDADA, de todas as unidades (Prefeitura, fundos, Instituto de Previdência e Câmara). Receita = total do município no documento do TCM (Balanço em 2024 e 2025; PCMGE016 consolidado de set/2026, linha "Totais"), já sem a parte do Fundeb e com a receita intraorçamentária da previdência, como no Balanço.
Conferido 2 vezes: 1ª nos leitores (scripts/acoes015.py, acoes2024.py, receita.py, setores.py), que fecham centavo a centavo com o Balanço; 2ª com cada valor exato procurado no texto do PDF citado (scripts/fontes.py, que acha a página). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2025 e 2026: PCMGE015 SIGA CONSOLIDADO, ação por ação (Executivo + Instituto de Previdência + Câmara), coluna Liquidada "Até o Mês". 2025: Executivo 559.023.135,60 + Legislativo 34.107.870,57 = 593.131.006,17 = Balanço 2025. 2026: Executivo 458.696.547,43 + Legislativo 21.418.602,43 = 480.115.149,86.
- 2024: empenhado de cada ação no Anexo 6 (2024_PCAGO004) menos os restos a pagar NÃO processados inscritos no ano (2024_PCAGO041_02, Total Geral 18.535.575,40, ligado à ação pelo código da dotação). Soma = 847.166.818,73 = Balanço 2024 (empenhado 865.702.394,13 − 18.535.575,40).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Assistência social 08 + 14 · Aposentadorias e pensões 09 (Previdência) · Obras e habitação 15 + 16 + 06 + 25 · Limpeza urbana 17 · Transporte 26 · Administração 04 + 23 (+ 99 reserva, sem gasto; inclui a parte administrativa de cada secretaria) · Dívidas 28 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27.
- Agricultura e meio ambiente 2025: TODAS as ações das funções 20 e 18 (Secretaria de Agricultura e Pesca, Infraestrutura e Meio Ambiente e Serviços) com liquidado 0,00 em 2025-12_PCMGE015.pdf; a Secretaria de Agricultura e Pesca gastou 1.587.847,85 com ela mesma (função 04, administração), por isso a fala diz "nada nas ações da área".

## Totais
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| 2024: arrecadou 679 milhões e 700 | 679.742.539,05 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024_PCAGO008, Anexo 10, Total) |
| Disso, 90 milhões foram de empréstimo | 90.000.000,00 | 2024_PCAGO015.pdf | p.1 · Receitas de Capital · Operações de Crédito - Mercado Interno (contrato FINISA de Infraestrutura e Saneamento: 2024_PCAGO012, Anexo 16, conta 2223101980102, inscrição 90.000.000,00) |
| Gastou 847 milhões e 200 | 847.166.818,73 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Gastou 167 milhões e 400 a mais do que arrecadou | 167.424.279,68 | conta própria | 847.166.818,73 − 679.742.539,05 |
| 2025: arrecadou 534 milhões e 900 | 534.933.761,92 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf, Totais, Total até Mês) |
| Gastou 593 milhões e 100 | 593.131.006,17 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Gastou 58 milhões e 200 a mais | 58.197.244,25 | conta própria | 593.131.006,17 − 534.933.761,92 |
| 2026 até setembro: arrecadou 575 milhões e 100 | 575.089.444,15 | 2026-09_PCMGE016.pdf | p.12 · RESUMO · Totais · Total até Mês (arrecadada 584.276.920,46 menos anulada 9.187.476,31) |
| Disso, 117 milhões e 700 foram royalties do petróleo | 117.716.404,72 | conta própria | soma das linhas 1712521…, 1712522… e 1712524… (compensação financeira pela produção de petróleo, excedente da produção e FEP) e 1712510… (CFEM, 8.452,32) do 2026-09_PCMGE016.pdf, Arrecadada até Mês + Anulada até Mês (scripts/receita.py → saida/receita_2026.json) |
| Gastou 480 milhões e 100 | 480.115.149,86 | 2026-09_PCMGE015.pdf | p.130 · Total do Poder (Executivo) 458.696.547,43 + Total do Poder (Legislativo) 21.418.602,43 · Liquidada Até o Mês (conta própria da soma) |
| Sobraram 95 milhões | 94.974.294,29 | conta própria | 575.089.444,15 − 480.115.149,86 |

## Setores (liquidado; valor exato de saida/setores.json, soma = total do ano)
| Ano | Setor dito | Valor exato | Fonte |
|---|---|---|---|
| 2024 | Educação | 177.678.480,16 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Saúde | 174.440.369,89 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Assistência social | 54.862.566,37 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Aposentadorias e pensões | 57.566.943,67 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Obras e habitação | 70.804.203,52 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Limpeza urbana | 27.596.243,88 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Transporte | 46.460.654,47 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Administração | 134.134.147,33 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Dívidas | 39.916.366,38 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Câmara de Vereadores | 37.079.119,77 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Cultura e festas | 13.132.208,48 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Agricultura e meio ambiente | 1.457.333,52 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2024 | Esporte | 12.038.181,29 | 2024_PCAGO004.pdf (Anexo 6) − 2024_PCAGO041_02.pdf (RPNP), ações da função |
| 2025 | Educação | 142.490.808,14 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Saúde | 92.428.341,31 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Assistência social | 16.677.407,64 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Aposentadorias e pensões | 65.882.883,79 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Obras e habitação | 12.484.309,95 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Limpeza urbana | 20.921.078,73 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Transporte | 19.338.812,56 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Administração | 91.152.820,03 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Dívidas | 96.117.749,14 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Câmara de Vereadores | 34.107.870,57 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Cultura e festas | 610.156,46 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Agricultura e meio ambiente | 0,00 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2025 | Esporte | 918.767,85 | 2025-12_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Educação | 116.181.965,85 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Saúde | 84.884.216,19 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Assistência social | 22.756.933,54 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Aposentadorias e pensões | 49.637.159,39 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Obras e habitação | 5.639.178,09 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Limpeza urbana | 19.067.724,99 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Transporte | 24.704.799,99 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Administração | 97.819.810,68 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Dívidas | 32.740.700,04 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Câmara de Vereadores | 21.418.602,43 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Cultura e festas | 1.193.096,00 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Agricultura e meio ambiente | 3.977.973,35 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |
| 2026 | Esporte | 92.989,32 | 2026-09_PCMGE015.pdf, ações da função, Liquidada Até o Mês |

## Achados (sacadas)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| ICMS 253 milhões e 500 em 2024 | 253.483.140,71 | 2024_PCAGO008.pdf | p.3 · 172150000000 Cota-Parte do ICMS 316.853.925,60 menos 172150000000 Dedução Fundeb −63.370.784,89 (conta própria da diferença) · Arrecadação |
| ICMS 205 milhões e 500 em 2025 | 205.513.312,98 | 2025-12_PCMGE016.pdf | linhas 172150… Cota-Parte do ICMS (já sem a parte do Fundeb), Arrecadada até Mês + Anulada até Mês, somadas em saida/receita_2025.json (conta própria) |
| a saúde caiu de 174 milhões (2024) | 174.440.369,89 | conta própria | setores.json 2024, função 10 (Anexo 6 2024_PCAGO004 Secretaria da Saúde 178.131.321,26 empenhado − RPNP da função 10) |
| para 92 (2025) | 92.428.341,31 | conta própria | setores.json 2025, função 10, 2025-12_PCMGE015.pdf |
| Os eventos artísticos e culturais levaram 13 milhões em 2024 | 13.063.834,22 | 2024_PCAGO004.pdf | p.16 · ação 10.1002.13.392.0006.2027 PROMOÇÃO DE EVENTOS ARTÍSTICO-CULTURAIS · Total (sem restos a pagar não processados no 2024_PCAGO041_02) |
| Em 2025, 393 mil | 393.318,00 | 2025-12_PCMGE015.pdf | p.68 · ação 10.1002.13.392.6.2.2027 PROMOCAO DE EVENTOS ARTISTICO-CULTURAIS · Total da Ação · Liquidada Até o Mês |
| O subsídio do transporte coletivo: 15 milhões e 600 em 2024 | 15.630.503,00 | 2024_PCAGO004.pdf | p.23 · ação 16.1601.26.453.0009.2160 CONCESSÃO DE SUBSIDIO DO TRANSPORTE COLETIVO · Total (sem RPNP) |
| 19 milhões e 300 em 2025 | 19.338.812,56 | 2025-12_PCMGE015.pdf | p.116 · ação 16.1601.26.453.9.2.2160 CONCESSAO DE SUBSIDIO DO TRANSPORTE COLETIVO · Liquidada Até o Mês |
| mais que toda a assistência social (2025) | 16.677.407,64 | conta própria | setores.json 2025, funções 08 + 14, 2025-12_PCMGE015.pdf (19.338.812,56 > 16.677.407,64) |
| A Câmara recebeu 53 milhões em 2024 | 53.041.338,37 | 2024-12_CAMARA_PCMGE018.pdf | p.11 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês |
| e devolveu 15 milhões e 900 | 15.888.516,36 | 2024-12_CAMARA_PCMGE018.pdf | p.10 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado Até o Mês |
| Em 2025, recebeu 35 milhões e 100 | 35.078.599,07 | 2025-12_CAMARA_PCMGE018.pdf | p.11 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês |
| e devolveu 785 mil | 784.954,21 | 2025-12_CAMARA_PCMGE018.pdf | p.10 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado Até o Mês |
| A dívida parcelada com o INSS começou 2024 em 213 milhões e 200 | 213.180.149,90 | 2024_PCAGO012.pdf | p.1 · 221430100 CONTRIBUIÇÃO AO RGPS (débito parcelado, longo prazo) · Saldo Anterior |
| E fechou 2025 em 229 milhões e 700 | 229.721.299,22 | 2025_PCAGO012.pdf | p.1 · 221430100 CONTRIBUIÇÃO AO RGPS (débito parcelado, longo prazo) · Saldo Atual |
| se em 2025 a assistência social ficou em 16 milhões e 700 | 16.677.407,64 | conta própria | setores.json 2025 (funções 08 + 14), 2025-12_PCMGE015.pdf |
| por que a Câmara gastou 34 milhões e 100? | 34.107.870,57 | 2025-12_CAMARA_PCMGE015.pdf | p.6 · Total do Poder · Liquidações Até o Mês (= Legislativo do 2025-12_PCMGE015.pdf e do Balanço 2025) |

## Fora do vídeo (pendências)
- Processos do TCM (Decisões › Auditoria, https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/): a pesquisa de SÃO FRANCISCO DO CONDE travou a página no Chrome e no navegador do app em 10/11/2026 ~16:55; nada foi dito sobre processos no vídeo.
- PCMGE015, 016, 018 e 065 de dez/2024 da Prefeitura escaneados (imagem): 2024 montado com os anuais em texto (Balanço, Anexo 6, Anexo 10, restos a pagar), que fecham com o Balanço.
- Pessoal por setor de 2024 não sai dos anuais em texto (o Anexo 6 não abre por elemento): a faixa de pessoal das folhas de 2024 fica sem valor.
