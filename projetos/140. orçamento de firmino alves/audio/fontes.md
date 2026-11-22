# Fontes do 140. orçamento de firmino alves (BA)

Consulta: 13/11/2026 (downloads no e-TCM entre 11:38 e 12:30, pelo Chrome com a trava _navegador-app.lock, recebedor 127.0.0.1:8778, pasta FIRMINO-ALVES, fetch + /salva, sem janela; os PDFs de 12/2024, 12/2025 e 06/2026 vieram em 12/11/2026 10:17 a 11:00). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-FIRMINO-ALVES/documentos_tcm/` (cada PDF com o texto ao lado em .txt; página = ordem do \f no texto). Município e competência conferidos no cabeçalho de cada prestação antes de salvar: FIRMINO ALVES.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 132 · Prefeitura UJ 737 · Câmara UJ 165. Último mês entregue pela Prefeitura em 2026: 06/2026 (enviado 14/09/2026; 07 a 10/2026 "Pendente" em 13/11/2026). A Câmara entregou até 09/2026. Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/firmino-alves.json.
Sistema contábil da Prefeitura: E&L SIAFIC ("Demonstrativo da Despesa por Período" e "Demonstrativo da Receita por Período"). O demonstrativo da despesa NÃO traz a função de cada ação: o setor sai da secretaria (unidade) e, nas secretarias juntas (Educação, Cultura e Esporte; Administração e Infraestrutura), do nome de cada ação. Ações abertas uma a uma (scripts/acoes065_el.py → saida/c_*_PCMGE065.json; scripts/setores_fa.py → saida/setores.json).
"Gastou" = despesa LIQUIDADA. Receita = total do Balanço Orçamentário (2024 e 2025) e do Demonstrativo da Receita de 06/2026 (PCMGE016; em 2024 e 2025 ele é igual, centavo a centavo, ao consolidado PCMGE066: a Câmara não tem receita própria).
Despesa por setor: PCMGE065 consolidado (Prefeitura + Fundo de Saúde + Câmara), que fecha centavo a centavo com o Balanço em 2025 e fica 4,75 abaixo em 2024 (ver Pendências). Conferido com o SICONFI por função em 2024 e 2025: Educação, Saúde, Assistência, Desporto, Cultura, Urbanismo + Transporte + Energia, Administração e Encargos batem centavo a centavo.
Somas, diferenças e arredondamentos: conta própria. Abaixo do TCM fica o CRUZAMENTO por API pública (SICONFI e IBGE): nenhum número dele vai para a tela.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 48 milhões e 800 em 2024 | 48.833.509,46 | 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas (o Demonstrativo da Receita 2024-12_PCMGE016 dá 48.838.777,44; vale o Balanço) |
| gastou 49 milhões e 800 em 2024 | 49.847.915,93 | 2024-13_ANUAL_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (2024-12_PCMGE065 p.21, TOTAL GERAL, liquidada até o período: 49.847.911,18) |
| gastou 1 milhão a mais do que arrecadou | 1.014.406,47 | conta própria | 49.847.915,93 − 48.833.509,46 |
| arrecadou 42 milhões e 900 em 2025 | 42.917.931,74 | 2025-13_ANUAL_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (IV) · Receitas Realizadas (= 2025-12_PCMGE016 p.8, TOTAL, acumulado) |
| gastou 42 milhões e 600 em 2025 | 42.603.301,52 | 2025-13_ANUAL_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XIII) · Despesas Liquidadas (= 2025-12_PCMGE065 p.25, TOTAL GERAL) |
| sobraram 315 mil | 314.630,22 | conta própria | 42.917.931,74 − 42.603.301,52 |
| arrecadou 20 milhões e 700 até junho de 2026 | 20.749.585,93 | 2026-06_PCMGE016.pdf (Demonstrativo da Receita por Período) | p.8 · TOTAL · Receita Arrecadada Acumulado (já sem a dedução do Fundeb) |
| gastou 22 milhões e 100 até junho | 22.123.299,41 | 2026-06_PCMGE065.pdf (Demonstrativo da Despesa, consolidado) | p.25 · TOTAL GERAL · Despesa Liquidada até o Período |
| 1 milhão e 400 a mais do que arrecadou | 1.373.713,48 | conta própria | 22.123.299,41 − 20.749.585,93 |
| já comprometeu 25 milhões e 800 | 25.795.120,99 | 2026-06_PCMGE065.pdf | p.25 · TOTAL GERAL · Despesa Empenhada até o Período |

## Setores (soma = total do ano; soma das ações por secretaria no PCMGE065: conta própria)
Setor pela SECRETARIA e pela AÇÃO (o PDF não traz a função; ações abertas uma a uma e conferidas com o SICONFI por função em 2024 e 2025):
Educação = Secretaria de Educação, Cultura e Esporte, menos festas, esporte e cultura · Saúde = Secretaria de Saúde (Fundo) · Administração = Gabinete + Administração + Finanças (menos a dívida; com o PASEP, 231.920,75 / 64.708,91 / 132.107,94) + a manutenção da Secretaria de Infraestrutura (2025: ação 2.108, 118.900,00; 2026: ação 2.008, 563.618,73; o SICONFI põe essa ação na função Administração) · Obras e serviços urbanos = Infraestrutura (pavimentação, limpeza, iluminação, outros serviços de infraestrutura, estradas) · Câmara = Câmara Municipal · Dívidas e encargos = ação "AMORTIZACAO DA DIVIDA INTERNA" · Festas e eventos = ação "APOIO E REALIZ. DE EVENTOS CULT. E FESTAS TRAD" (regra 99) · Cultura = ações do setor cultural e do FCBA (ações abertas: nenhuma teve gasto liquidado nos três anos; fora as festas, a cultura não teve gasto) · Assistência social = Secretaria de Assistência Social · Agricultura e meio ambiente = Secretaria de Agricultura e Meio Ambiente · Esporte e lazer = eventos esportivos + reforma de campos de futebol + "MANUTENÇÃO DAS ATIVIDADES DA SECRETARIA MU..." da unidade de Educação (2025: ação 2.107, que fecha a função Desporto e Lazer do SICONFI em 107.773,04; 2026: ação 2.041).
Arquivos: 2024-12_PCMGE065.pdf · 2025-12_PCMGE065.pdf · 2026-06_PCMGE065.pdf.

| Setor | Dito (2024 · 2025 · 2026) | 2024 | 2025 | 2026 até jun |
|---|---|---|---|---|
| Educação | 13 e 700 · 12 e 500 · 6 e 700 | 13.702.726,91 | 12.477.380,62 | 6.734.163,83 |
| Saúde | 7 e 100 · 6 e 600 · 3 e 800 | 7.135.904,39 | 6.602.585,69 | 3.815.440,57 |
| Administração | 8 e 200 · 5 e 800 · 4 e 600 | 8.236.700,08 | 5.763.211,98 | 4.581.110,20 |
| Obras e serviços urbanos | 13 e 800 · 9 e 300 · 3 milhões | 13.832.158,08 | 9.275.265,96 | 3.027.941,73 |
| Câmara de Vereadores | 1 e 500 · 1 e 700 · 906 mil | 1.460.571,48 | 1.747.698,71 | 906.401,03 |
| Dívidas e encargos | 2 e 300 · 3 milhões · 563 mil | 2.296.310,72 | 2.986.890,80 | 563.215,77 |
| Festas e eventos | 921 mil · 1 e 600 · 1 e 300 | 920.800,00 | 1.644.445,07 | 1.331.015,87 |
| Cultura (fora as festas) | nenhum gasto nos três anos (ações abertas) | 0,00 | 0,00 | 0,00 |
| Assistência social | 2 milhões · 1 e 700 · 962 mil | 1.994.552,95 | 1.737.336,26 | 961.823,44 |
| Agricultura e meio ambiente | 121 mil · 261 mil · 148 mil | 120.814,48 | 260.713,39 | 147.871,82 |
| Esporte e lazer | 147 mil · 108 mil · 54 mil | 147.372,09 | 107.773,04 | 54.315,15 |
| **Total (soma dos setores)** | | 49.847.911,18 | 42.603.301,52 | 22.123.299,41 |

## Achados
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| a ação de eventos culturais e festas tradicionais previa 470 mil em 2025 | 469.922,03 | 2025-12_PCMGE065.pdf | p.6 · ação 2.020 "APOIO E REALIZ. DE EVENTOS CULT. E FESTAS TRAD" · Despesa Fixada (fixada atual 1.667.313,80) |
| e gastou 1 milhão e 600 | 1.644.445,07 | 2025-12_PCMGE065.pdf | p.6 · mesma ação · Despesa Liquidada até o Período (1.571.045,07 em "Outros Serviços de Terceiros - Pessoa Jurídica" e 73.400,00 em pessoa física) |
| em 2024, previa 520 mil | 519.539,93 | 2024-12_PCMGE065.pdf | p.6 · ação 2.020, mesmo nome · Despesa Fixada (fixada atual 920.800,00) |
| e gastou 921 mil | 920.800,00 | 2024-12_PCMGE065.pdf | p.6 · mesma ação · Despesa Liquidada até o Período |
| em 2026, previa 587 mil para o ano todo | 587.402,54 | 2026-06_PCMGE065.pdf | p.12 · ação 2.036, mesmo nome · Despesa Fixada (fixada atual 1.346.409,27) |
| e até junho já gastou 1 milhão e 300 | 1.331.015,87 | 2026-06_PCMGE065.pdf | p.12 · mesma ação · Despesa Liquidada até o Período (empenhado 1.337.100,00) |
| até junho de 2026, as festas passaram a assistência social em 369 mil | 369.192,43 | conta própria | 1.331.015,87 − 961.823,44 (festas − assistência social, setores acima) |
| em 2024 a prefeitura recebeu 7 milhões e 500 em emendas parlamentares por transferência especial | 7.500.000,00 | 2024-12_PCMGE016.pdf (receita) | p.7 · 24195101002 "Transferências Especiais da União - Emendas Parlamentares" · Acumulado |
| em 2025, 4 milhões em transferência especial (custeio) | 4.041.188,43 | 2025-12_PCMGE016.pdf | p.4 · 17195700000 "Transferência Especial da União" · Acumulado (925.789,43 marcados "Emendas Parlamentares" e 3.115.399,00 "Principal") |
| e mais 1 milhão e 400 em emendas para obras e equipamentos | 1.386.000,00 | 2025-12_PCMGE016.pdf | p.7 · 24195101001 "Transferências Especias da União - Emendas Parlamentares" · Acumulado. Total 2025: 4.041.188,43 + 1.386.000,00 = 5.427.188,43 (conta própria, soma) |
| até junho de 2026, 2 milhões e 600 | 2.600.000,00 | 2026-06_PCMGE016.pdf | p.4 · 17195700000 "Transferência Especial da União" · Acumulado |
| em 2024 entraram 4 milhões e 800 por decisão judicial | 4.771.825,37 | 2024-12_PCMGE016.pdf | p.4 · 17195601001 "Transferências Decorrentes de Decisão Judicial" · Acumulado (não diz a origem; não afirmar que é precatório do Fundef sem documento) |
| a pavimentação gastou 4 milhões e 700 em 2024 | 4.688.673,51 | 2024-12_PCMGE065.pdf | p.3 · ação 1.011 "REALIZAÇÃO DE PAVIMENTACAO" · Despesa Liquidada até o Período (2025: 495.036,96; 2026 até jun, ação 1.006: 175.755,98) |
| "outros serviços de infraestrutura": 6 milhões e 100 em 2024 | 6.106.093,76 | 2024-12_PCMGE065.pdf | p.4 · ação 2.012 "MANUTENCAO DE DE OUTROS SERVIÇOS DE INFRA-E" · Liquidada até o Período |
| e 7 milhões e 900 em 2025 | 7.886.339,90 | 2025-12_PCMGE065.pdf | p.4 · ação 2.012, mesmo nome · Liquidada até o Período (2026 até jun, ação 2.010: 2.839.629,04) |
| estradas municipais: 2 milhões e 600 em 2024 | 2.583.109,15 | 2024-12_PCMGE065.pdf | p.4 · ação 2.013 "CONSERVACAO DE ESTRADAS MUNICIPAIS" · Liquidada até o Período |
| e 185 mil em 2025 | 185.368,60 | 2025-12_PCMGE065.pdf | p.4 · ação 2.013, mesmo nome · Liquidada até o Período |
| a Câmara recebeu 1 milhão e 800 em 2025 | 1.755.243,98 | 2025-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · saldo atual (= 2025-12_PCMGE065 p.26, REPASSE CONCEDIDO - CAMARA, até o período) |
| e devolveu 201 reais | 200,59 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · saldo atual |
| recebeu 7 mil a mais do que gastou | 7.545,27 | conta própria | 1.755.243,98 − 1.747.698,71 (repasse − gasto da Câmara em 2025) |
| em 2024, a Câmara recebeu 1 milhão e 500 | 1.460.776,82 | 2024-12_PCMGE065.pdf | p.22 · 35112020000 REPASSE CONCEDIDO - CAMARA · até o período (o razão da Câmara de 12/2024 não traz as contas de repasse) |
| até junho de 2026, a Câmara recebeu 934 mil | 934.226,62 | 2026-06_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · saldo atual (= 2026-06_PCMGE065 p.26) |
| e devolveu 17 mil | 17.000,00 | 2026-06_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · saldo atual |
| a Câmara gastou 906 mil até junho | 906.401,03 | 2026-06_CAMARA_PCMGE015.pdf (despesa da Câmara, SIGA) | p.1 · ação 2001 "MANUTENCAO DOS SERVICOS ADMINISTRATIVOS DA CAMARA" · Liquidações até o mês (= 2026-06_PCMGE065 p.1, CAMARA MUNICIPAL) |
| a dívida paga em 2025: 3 milhões | 2.986.890,80 | 2025-12_PCMGE065.pdf | p.5 · ação 2.007 "AMORTIZACAO DA DIVIDA INTERNA" · Liquidada até o Período (2024: 2.296.310,72) |

## Receita: de onde veio (só para as folhas PDF; no vídeo, só o total, regra 19b)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| FPM em 2025 (cota mensal, antes do Fundeb) | 19.103.534,69 | 2025-12_PCMGE016.pdf | p.3 · 17115110000 Cota-Parte do FPM - Cota Mensal · Acumulado |
| SUS em 2025 | 4.749.969,01 | 2025-12_PCMGE016.pdf | p.3 · 17135000000 Transferências do SUS - Repasses Fundo a Fundo · Acumulado |
| ICMS em 2025 | 3.564.231,20 | 2025-12_PCMGE016.pdf | p.5 · 17215000000 Cota-Parte do ICMS · Acumulado |
| Fundeb em 2025 | 5.152.495,25 | 2025-12_PCMGE016.pdf | p.5 · 17515000000 Transferências do Fundeb · Acumulado (dedução do Fundeb na mesma receita: 4.574.674,98) |
| impostos e taxas da cidade em 2025 | 2.236.795,82 | 2025-12_PCMGE016.pdf | p.1 · 11000000000 Impostos, Taxas e Contribuições de Melhoria · Acumulado |
| IPTU em 2025 | 26.773,46 | 2025-12_PCMGE016.pdf | p.1 · 11125000000 IPTU · Acumulado (só dívida ativa e multas; o IPTU principal previa 137.622,23 e não teve arrecadação lançada; em 2024 foram 234.218,97) |
Arquivos de leitura: saida/receita_2024.json, receita_2025.json, receita_2026.json (scripts/receita_fa.py; o total de cada ano bate com a linha TOTAL do PDF).

## Pendências e observações
- 2024: a despesa liquidada do Balanço (49.847.915,93) e do SICONFI fica 4,75 acima do PCMGE065 (49.847.911,18). A diferença está na Câmara: SICONFI 1.460.576,23 contra 1.460.571,48 no PCMGE015/065. Na tela vale o total do Balanço; os setores somam o PCMGE065.
- 2024: a receita do Balanço (48.833.509,46) fica 5.267,98 abaixo do Demonstrativo da Receita (48.838.777,44). Vale o Balanço.
- 06/2026: o arquivo enviado como PCMGE066 é o "Balancete da Despesa Extra Orçamentária", não o consolidado da receita. A receita de 2026 vem do PCMGE016 (Poder Executivo), que em 2024 e 2025 foi igual ao consolidado. Anotado em _pendencias-tcm.md.
- PCMGE018 (razão) da Prefeitura de 12/2024 e PCMGE064 de 12/2024 são declarações de "movimento contábil será entregue posteriormente".
- As festas ficam quase todas em "Outros Serviços de Terceiros - Pessoa Jurídica" (837.000,00 em 2024; 1.571.045,07 em 2025; 1.302.915,87 em 2026): o demonstrativo não separa bandas e palco. A relação de pagamentos (PCMGE056) baixada é só do mês (12/2024, 12/2025 e 06/2026), não do ano: em 12/2024 aparecem pagamentos de show musical e de estrutura de palco do aniversário da cidade e do evento "São Julhão" (julho de 2024, distrito de Itaiá). Não dá para somar bandas e palco do ano pelo PDF; no vídeo, só o total da ação.
- Balanços anuais (PCAGO015) baixados de 2020 a 2025 e lidos em SITE-EUMAGNOLEITE/dados/balancos.json (regra 111). O texto do Balanço de 2024 vinha com números grudados: só foram postos espaços entre eles (nenhum dígito mudou). 2016 a 2019 não foram baixados nesta rodada (fora do vídeo; anotado em _pendencias-tcm.md).
- Os PDFs trazem nome e CPF de gestor em declarações: nada disso foi copiado. Nenhum nome de gestor no vídeo. Nenhuma empresa citada.

## Município (IBGE)
| Dado | Valor | Fonte |
|---|---|---|
| Código IBGE | 2910909 (microrregião Ilhéus-Itabuna) | https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios (consulta 12/11/2026) |
| População informada no RREO | 5.925 (RREO 2024 e 2025); 4.993 (RREO 2026) | SICONFI, arquivos siconfi/siconfi_rreo_*.json |

## SICONFI (Tesouro Nacional), RREO e DCA declarados pelo município · cruzamento
API: https://apidatalake.tesouro.gov.br/ords/siconfi/tt (arquivos em ~/Documents/RECEITAS-DESPESAS-FIRMINO-ALVES/siconfi/, consulta 12/11/2026)
| Ano | Receita realizada (RREO Anexo 01, até o bimestre) | Despesa empenhada | Despesa liquidada | Arquivo |
|---|---|---|---|---|
| 2024 | R$ 48.833.509,46 | R$ 49.847.915,93 | R$ 49.847.915,93 | siconfi_rreo_2024_6.json; DCA 2024 (Anexo I-E) igual |
| 2025 | R$ 42.917.931,74 | R$ 42.647.008,59 | R$ 42.603.301,52 | siconfi_rreo_2025_6.json; DCA 2025 (Anexo I-E) igual |
| 2026 até ago (4º bim) | R$ 28.584.150,71 | R$ 32.496.934,93 | R$ 29.048.789,07 | siconfi_rreo_2026_4.json |

Despesa liquidada por função (DCA Anexo I-E), 2024 → 2025: Legislativa 1.460.576,23 → 1.747.698,71; Administração 8.004.779,33 → 5.698.503,07; Assistência Social 1.994.552,95 → 1.737.336,26; Saúde 7.135.904,39 → 6.602.585,69; Educação 13.702.726,91 → 12.477.380,62; Cultura 920.800,00 → 1.644.445,07 (= a ação de festas); Urbanismo 11.211.613,93 → 9.088.297,36; Gestão Ambiental 120.814,48 → 260.713,39; Energia 37.435,00 → 1.600,00; Transporte 2.583.109,15 → 185.368,60; Desporto e Lazer 147.372,09 → 107.773,04; Encargos Especiais 2.528.231,47 → 3.051.599,71 (= amortização + PASEP).

## Notícias (só conferência interna, nunca fonte de fato no vídeo)
- Bahia Notícias: Firmino Alves teve a maior proporção de emendas Pix por habitante da Bahia em 2024 (bahianoticias.com.br/municipios/noticia/40480). O TCM confirma 7.500.000,00 de transferência especial em 2024 (acima).
- Editais de concurso 2026 da Prefeitura (385 vagas, agrobase.com.br e acheconcursos.com.br, out/2026).
- Licitações 2025 no PNCP (alertalicitacao.com.br/!municipios/2910909), ex.: manutenção de máquinas pesadas (abertura 19/12/2025).
- TCM-BA, contas de 2008 aprovadas com ressalvas (jornalgrandebahia.com.br, antigo, fora do recorte).
