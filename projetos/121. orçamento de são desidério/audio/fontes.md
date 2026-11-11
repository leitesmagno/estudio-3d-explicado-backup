# Fontes · 121. orçamento de São Desidério (BA)

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-SAO-DESIDERIO/documentos_tcm/`. Município e competência conferidos no cabeçalho de cada PDF usado (Prefeitura Municipal de SÃO DESIDÉRIO, CNPJ 13.655.436/0001-60; Câmara Municipal de SÃO DESIDÉRIO). Conferido 2 vezes (11/11/2026).

Unidades no e-TCM: município 352, Prefeitura (UJ 956) e Câmara (UJ 401). Sem autarquias. Último mês entregue: 09/2026 (10/2026 "Pendente"). Lista de prestações: `~/Documents/SITE-EUMAGNOLEITE/dados/prestacoes-etcm/sao-desiderio.json`.

Regras de leitura:
- "Arrecadou" de 2024 e 2025 = Receitas realizadas do Balanço Orçamentário anual (Anexo XII, PCAGO015). 2026 = "Arrecadada até Mês" mais "Anulada até Mês" do PCMGE016 de set/2026 da Prefeitura (a Câmara não tem receita própria). A coluna "Arrecadada" do PCMGE016 já vem sem a parte do Fundeb (a dedução do ICMS é 25% exatos do arrecadado líquido).
- "Gastou" = LIQUIDADO. Prefeitura (PCMGE015) + Câmara (PCMGE015 da Câmara) = Demonstrativo Consolidado da Despesa (PCMGE015 consolidado) = Balanço, centavo a centavo em 2024 e 2025.
- Setor pela FUNÇÃO de cada ação (script `scripts/setores.py`). Festas e eventos (regra 99) = ação "Gestão das ações de apoio às festas cívicas, populares, religiosas e culturais" (função 13, o nome diz festas) + elementos de bandas (3.3.90.39.94) lançados em outras ações (Sec. de Meio Ambiente e Turismo: 8.400,00 em 2025 e 13.200,00 em 2026). Cultura = resto da função 13 (Aldir Blanc, Paulo Gustavo, fundo de cultura, museu e teatro). Esporte e lazer = função 27: a Secretaria de Esporte, Cultura e Lazer é uma só e a manutenção dela (salários e contas) está lançada na função 27. Obras e serviços urbanos = funções 15, 16, 17 (limpeza pública, drenagem, água nas comunidades) e 25 (iluminação). Estradas e transporte = função 26 (estradas vicinais e rodoviária). Administração = funções 03, 04, 19 e 28 (encargos gerais). Agricultura e meio ambiente = funções 18 e 20.
- Valores falados arredondados a uma casa (milhões) ou a mil; o valor exato está abaixo.

## Receita (o que arrecadou)

- Arrecadou 2024: R$ 382.897.073,50 · `2024_PCAGO015.pdf` (Balanço Orçamentário 2024), p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "382 milhões e 900". Confere com o PCMGE066 consolidado de dez/2024 ("TOTAL GERAL DA RECEITA ORÇAMENTÁRIA").
- Arrecadou 2025: R$ 437.143.151,80 · `2025_PCAGO015.pdf`, p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "437 milhões e 100". Confere com `2025-12_PCMGE066.pdf`.
- Arrecadou 2026 até setembro: R$ 321.094.654,68 = 321.242.720,44 (Arrecadada até Mês) − 148.065,76 (Anulada até Mês) · `2026-09_PCMGE016.pdf`, p. 7, linha TOTAL. Fala: "321 milhões e 100". Conta própria (arrecadada menos anulada).

### Receita de 2025, item a item (`2025-12_PCMGE016.pdf`, coluna "Arrecadada até Mês" + "Anulada até Mês")
- ICMS 2025: R$ 213.344.191,71 · p. 4, linha 1.7.2.1.50.0.0 Cota-Parte do ICMS (já sem a parte do Fundeb, que fica na coluna Deduções). Fala: "213 milhões e 300".
- FPM 2025: R$ 47.034.845,14 · p. 2, linha 1.7.1.1.51.0.0 Cota-Parte do FPM (já sem a parte do Fundeb). Fala: "47 milhões".
- Fundeb 2025: R$ 37.226.070,21 · p. 5, linha 1.7.5.0.00.0.0 (transferências do Fundeb). Fala: "37 milhões e 200". A complementação da União ao Fundeb (R$ 11.191.899,58, p. 4, linha 1.7.1.5.00.0.0) aparece só na folha, em linha própria.
- SUS 2025: R$ 12.908.291,33 = União R$ 12.343.761,14 (p. 2, linha 1.7.1.3.00.0.0) + Estado R$ 564.530,19 (p. 5, linha 1.7.2.3.00.0.0) + capital R$ 0,00 (p. 6, linha 2.4.1.1.00.0.0). Fala: "12 milhões e 900". Conta própria (soma). Ainda não conferido no Fundo Nacional de Saúde nesta rodada (pendência).
- IPTU 2025: R$ 3.344.899,73 · p. 1, linha 1.1.1.2.50.0.0 (previsto 5.090.000,00). Fala: "3 milhões e 300".
- Folhas de receita (não faladas): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (PCMGE016 da Prefeitura de dez/2024, dez/2025 e set/2026). Destaques que só aparecem na folha: ITBI 12,6 mi (2024), 37,1 mi (2025) e 23,8 mi (até set/2026); ITR 11,8 / 12,3 / 1,4 mi.

## Despesa (o que gastou, liquidado)

- Gastou 2024: R$ 400.515.454,20 · `2024_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "400 milhões e 500". Confere: Prefeitura 378.319.797,09 (`2024-12_PCMGE015.pdf`, p. 106, "Total do Poder", Liquidado até o mês) + Câmara 22.195.657,11 (`2024-12_CAMARA_PCMGE015.pdf`, p. 4, "Total do Poder").
- Faltaram 2024: R$ 17.618.380,70 = 400.515.454,20 − 382.897.073,50 (conta própria). Fala: "17 milhões e 600". O Balanço registra superávit financeiro de anos anteriores de 18.621.662,00 usado em créditos adicionais (p. 1).
- Gastou 2025: R$ 433.009.662,66 · `2025_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "433 milhões". Confere: Prefeitura 406.750.266,48 (`2025-12_PCMGE015.pdf`, p. 120, "Total do Poder") + Câmara 26.259.396,18 (`2025-12_CAMARA_PCMGE015.pdf`, p. 4, "Total do Poder").
- Sobraram 2025: R$ 4.133.489,14 = 437.143.151,80 − 433.009.662,66 (conta própria). Fala: "4 milhões e 100".
- Gastou 2026 até setembro: R$ 329.440.701,44 · `2026-09_PCMGE015_2.pdf` (Demonstrativo Consolidado da Despesa, set/2026), p. 124, linha TOTAL, coluna Liquidada até o Mês. Fala: "329 milhões e 400". Confere: Prefeitura 308.532.447,22 (`2026-09_PCMGE015.pdf`, p. 125, "Total do Poder") + Câmara 20.908.254,22 (`2026-09_CAMARA_PCMGE015.pdf`, p. 4, "Total do Poder").
- Faltaram 2026: R$ 8.346.046,76 = 329.440.701,44 − 321.094.654,68 (conta própria). Fala: "8 milhões e 300".
- Já comprometeu 2026 (empenhado): R$ 368.535.674,33 · `2026-09_PCMGE015_2.pdf`, p. 124, linha TOTAL, coluna Empenhada até o Mês. Fala: "368 milhões e 500".

### Setores (liquidado, `saida/setores.json`)
| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 109.633.297,36 | 119.075.389,37 | 102.093.408,93 |
| Saúde | 108.701.888,28 | 130.327.964,50 | 88.620.993,26 |
| Obras e serviços urbanos | 57.423.602,54 | 51.284.764,98 | 39.695.582,66 |
| Estradas e transporte | 36.173.190,82 | 32.914.270,47 | 20.854.592,03 |
| Administração | 29.833.836,85 | 33.203.841,48 | 24.466.268,24 |
| Assistência social | 11.738.032,58 | 13.621.289,05 | 11.230.970,18 |
| Câmara de Vereadores | 22.195.657,11 | 26.259.396,18 | 20.908.254,22 |
| Festas e eventos | 8.338.409,86 | 10.529.715,58 | 9.220.328,73 |
| Cultura | 291.078,05 | 71.019,76 | 0,00 |
| Esporte e lazer | 8.980.745,13 | 8.640.414,54 | 6.857.430,22 |
| Agricultura e meio ambiente | 7.205.715,62 | 7.081.596,75 | 5.492.872,97 |
| Soma | 400.515.454,20 | 433.009.662,66 | 329.440.701,44 |

Festas e eventos 2024: R$ 8.338.409,86 · Festas e eventos 2025: R$ 10.529.715,58 · Festas e eventos 2026: R$ 9.220.328,73 (até setembro).
Cultura 2024: R$ 291.078,05 · Cultura 2025: R$ 71.019,76 · Cultura 2026: R$ 0,00 (até setembro).
Origem: cada ação do PCMGE015 da Prefeitura de dez/2024 (p. 1 a 106), dez/2025 (p. 1 a 120) e set/2026 (p. 1 a 125) e o PCMGE015 da Câmara. Falas: Educação "109 e 600 / 119 e 100 / 102 milhões e 100"; Saúde "108 e 700 / 130 e 300 / 88 e 600"; Obras "57 e 400 / 51 e 300 / 39 e 700"; Estradas "36 e 200 / 32 e 900 / 20 milhões e 900"; Administração "29 e 800 / 33 e 200 / 24 e 500"; Assistência social "11 e 700 / 13 e 600 / 11 e 200"; Câmara "22 e 200 / 26 e 300 / 20 milhões e 900"; Festas e eventos "8 e 300 / 10 e 500 / 9 e 200"; Cultura "291 mil / 71 mil / zero nas ações de cultura"; Esporte "9 milhões / 8 e 600 / 6 e 900"; Agricultura "7 e 200 / 7 e 100 / 5 e 500".

Cultura 2026 = zero (checagem anti zero, regras 32/034/035): as ações de cultura da função 13 existem no orçamento de 2026 e todas estão com liquidado R$ 0,00 até setembro: Modernização do museu municipal (dotação 200.000,00, p. 41), Construção do teatro municipal (270.000,00, p. 42), Fundo de cultura (41.000,00, empenhado 9.750,00, liquidado 0,00), Lei Paulo Gustavo (3.000,00) e Política Nacional Aldir Blanc (771.000,00) · `2026-09_PCMGE015.pdf`. Procurado "cultur", "teatro", "museu", "patrim", "bibliot" em todas as funções: nenhuma outra ação de cultura. A manutenção da Secretaria de Esporte, Cultura e Lazer (secretaria conjunta) está na função 27 (ação "Gestão das ações da Sec. Mun. de Esporte, Cultura e Lazer", 5.681.496,26 até set/2026) e entra em Esporte e lazer; por isso a fala diz "zero nas ações de cultura", e não "zero em cultura".

## Câmara (duodécimo)
Fonte: razão consolidado do município (`PCMGE064`), conta 3.5.1.1.2.02 REPASSE CONCEDIDO e 3.5.1.1.2.09.00.01 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS · DUODÉCIMO.
- Recebeu 2024: R$ 22.200.000,00 · `2024-12_PCMGE064.pdf`, p. 16, conta 3.5.1.1.2.02 (débito até o mês) e 4.5.1.1.2.02 REPASSE RECEBIDO (crédito até o mês). Fala: "22 milhões e 200".
- Devolveu 2024: R$ 8.084,81 · `2024-12_PCMGE064.pdf`, p. 16, conta 3.5.1.1.2.09.00.01. Fala: "8 mil".
- Recebeu 2025: R$ 26.269.000,00 · `2025-12_PCMGE064.pdf`, p. 16 (sendo 3.169.000,00 só em dezembro). Fala: "26 milhões e 300".
- Devolveu 2025: R$ 5.861,87 · `2025-12_PCMGE064.pdf`, p. 16. Fala: "5 mil e 900".
- Recebeu 2026 até setembro: R$ 20.690.000,00 · `2026-09_PCMGE064.pdf`, p. 16. Fala: "20 milhões e 700". Devolução até setembro: R$ 0,00.
- Gasto (liquidado) da Câmara: 22.195.657,11 (2024), 26.259.396,18 (2025), 20.908.254,22 (até set/2026), no PCMGE015 da Câmara (p. 4 de cada um).

## Empréstimo de 2026
- Operação de crédito: R$ 10.000.000,00 · `2026-09_PCMGE016.pdf`, p. 6, linha 2.1.0.0.00.0.0 Operações de Crédito: Receita Prevista 0,00; Arrecadada no Mês 10.000.000,00 (setembro); Arrecadada até Mês 10.000.000,00. Partes: 8.820.000,00 (2.1.1.2.01, contratuais), 380.000,00 (2.1.1.2.50, programas de educação) e 800.000,00 (2.1.1.2.52, programas de saneamento). Fala: "Em setembro de 2026, a prefeitura recebeu um empréstimo de 10 milhões, que não estava previsto no orçamento." O PDF não diz o banco nem a finalidade completa.
- Uso do empréstimo (só na folha de Estradas 2026): fonte 754 = "OP. DE CRÉDITO-INTERNA" (razão `2026-09_PCMGE064.pdf`, contas 8.2.1.1.x com fonte 754). Na despesa de set/2026 (`2026-09_PCMGE015.pdf`) a fonte 1754 tinha dotação INICIAL R$ 0,00 em todas as ações (crédito aberto durante o ano: 8.508.000,00) e liquidou 6.629.456,28 até setembro: estradas vicinais 6.142.874,89 (p. 29), drenagem 348.004,67 (p. 25) e pavimentação de vias 138.576,72 (p. 18).

## Festas
Ação "Gestão das ações de apoio às festas cívicas, populares, religiosas e culturais" (2.2070.13.392.8.2.2070), coluna Fixada (inicial) e Liquidado até o mês:
- 2024: previa R$ 6.220.000,00; gastou R$ 8.338.409,86 · `2024-12_PCMGE015.pdf`, p. 38. Bandas: R$ 2.212.000,00 (elemento 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical ou Profissional...", p. 38). Falas: "6 milhões e 200", "8 milhões e 300", "Bandas, 2 milhões e 200".
- 2025: previa R$ 6.720.000,00; gastou R$ 10.521.315,58 · `2025-12_PCMGE015.pdf`, p. 40. Bandas: R$ 4.415.000,00 (elemento 3.3.90.39.94 "Serviços de banda ou grupo musical ou profissional", p. 40). Falas: "6 milhões e 700", "10 milhões e 500", "Bandas, 4 milhões e 400".
- 2026 até setembro: previa R$ 8.720.000,00; gastou R$ 9.207.128,73 (empenhado 11.113.596,24) · `2026-09_PCMGE015.pdf`, p. 42. Bandas: R$ 5.319.000,00 (3.3.90.39.94, p. 42). Falas: "8 milhões e 700", "9 milhões e 200", "Bandas, 5 milhões e 300".
- Bandas em outras ações (só na folha, regra 99): Sec. de Meio Ambiente e Turismo 8.400,00 (2025, p. 35) e 13.200,00 (2026, p. 37).

## Teatro municipal
- Ação "Construção do teatro municipal" (2.2070.13.392.8.1.1044): Fixada (inicial) R$ 270.000,00 em 2024 (`2024-12_PCMGE015.pdf`, p. 38), 2025 (`2025-12_PCMGE015.pdf`, p. 40) e 2026 (`2026-09_PCMGE015.pdf`, p. 42); empenhado e liquidado R$ 0,00 nos três (em 2024 e 2025 a dotação foi reduzida a zero ao longo do ano; em 2026 a dotação atual segue 270.000,00). Procurado "teatro" em todas as ações dos três anos (Prefeitura e Câmara): só esta ação. Falas: "previa 270 mil em cada um dos três anos" e "Nenhum real foi gasto nessa ação". A fala fala da AÇÃO do orçamento; a relação de pagamentos (PCMGE056) não foi baixada nesta rodada.

## Pergunta final
"Gastar não é crime. Mas se o teatro ficou sem nenhum real, por que as bandas levaram 4 milhões e 400 em 2025?" · teatro R$ 0,00 (acima) e bandas 2025 R$ 4.415.000,00 (acima).

## Pendências
- SUS 2025 não conferido no Fundo Nacional de Saúde.
- Relação de pagamentos (PCMGE056) não baixada.
