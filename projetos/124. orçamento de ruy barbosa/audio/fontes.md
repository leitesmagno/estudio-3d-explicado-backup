# Fontes · 124. orçamento de Ruy Barbosa (BA)

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-RUY-BARBOSA/documentos_tcm/`. Município e competência conferidos no cabeçalho de cada PDF usado (Prefeitura Municipal de RUY BARBOSA, CNPJ 13.810.833/0001-60; Câmara Municipal de RUY BARBOSA). Conferido 2 vezes (11/11/2026).

Unidades no e-TCM: município 334, Prefeitura (UJ 938) e Câmara (UJ 367). Sem autarquias. Último mês entregue: 09/2026 (10/2026 "Pendente"). Lista de prestações: `~/Documents/SITE-EUMAGNOLEITE/dados/prestacoes-etcm/ruy-barbosa.json`.

Regras de leitura:
- "Arrecadou" de 2024 e 2025 = Receitas realizadas do Balanço Orçamentário anual (Anexo XII, PCAGO015). 2026 = "Arrecadada até Mês" mais "Anulada até Mês" do PCMGE016 de set/2026 da Prefeitura (= "Totais" do próprio relatório e "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA" do PCMGE066 consolidado). A coluna "Arrecadada" do PCMGE016 já vem sem a parte do Fundeb (a dedução do ICMS é 20% do valor bruto e fica na coluna Deduções).
- "Gastou" = LIQUIDADO. 2024 e 2025 = coluna "Despesas Liquidadas" do Balanço Orçamentário. 2026 = coluna "Liquidada até o Mês" do PCMGE015 da Prefeitura de set/2026, que já vem consolidado (Prefeitura, Câmara e Fundo Municipal de Saúde) e é igual ao PCMGE065 consolidado.
- Setor pela FUNÇÃO de cada ação (script `scripts/setores.py`). Festas e eventos (regra 99) = ação "Fomento às Atividades Festivas e Culturais do Município" (2024 e 2025) e "Manutenção dos Festejos e Atividades Culturais" (2026), função 13, cujo nome diz festas, + o elemento 3.3.90.39.95 "Locação, confecção e montagem de cenário" lançado na ação "Gestão das Ações Administrativas do Município" em 2025 (60.360,00). Cultura = resto da função 13. Obras e serviços urbanos = funções 15, 17 e 26. Administração = funções 04, 06, 11 e 99. Dívidas e encargos = função 28. Assistência social = funções 08 e 16 (habitação, da Sec. de Assistência Social). Agricultura e meio ambiente = funções 18 e 20. Esporte = função 27 (Sec. de Esportes, Cultura, Turismo e Lazer, conjunta).
- Valores falados arredondados a uma casa (milhões) ou a mil; o valor exato está abaixo.

## Receita (o que arrecadou)

- Arrecadou 2024: R$ 119.522.835,40 · `2024_PCAGO015.pdf` (Balanço Orçamentário 2024), p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "119 milhões e 500". Confere com `2024-12_PCMGE016.pdf`, linha "Totais:" (119.758.510,00 arrecadada − 235.674,60 anulada).
- Arrecadou 2025: R$ 130.981.349,87 · `2025_PCAGO015.pdf`, p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "131 milhões". Confere com `2025-12_PCMGE016.pdf`, linha "Totais:".
- Arrecadou 2026 até setembro: R$ 112.067.063,77 = 114.052.185,60 (Arrecadada até Mês) − 1.985.121,83 (Anulada até Mês) · `2026-09_PCMGE016.pdf`, p. 7, linha "Totais:". Fala: "112 milhões e 100". Confere com `2026-09_PCMGE066.pdf`, "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA".

### Receita de 2025, item a item (`2025-12_PCMGE016.pdf`, coluna "Arrecadada até Mês" + "Anulada até Mês")
- FPM 2025: R$ 45.499.765,58 · p. 2, linha 1.7.1.1.51.0.0 Cota-Parte do FPM (já sem a parte do Fundeb). Fala: "45 milhões e 500".
- Fundeb 2025: R$ 24.602.698,14 · p. 5, linha 1.7.5.0.00.0.0 (transferências do Fundeb). Fala: "24 milhões e 600".
- Complementação da União ao Fundeb 2025: R$ 18.771.951,63 · p. 3, linha 1.7.1.5.00.0.0. Fala: "a União completou com mais 18 milhões e 800".
- ICMS 2025: R$ 12.461.398,04 · p. 4, linha 1.7.2.1.50.0.0 Cota-Parte do ICMS (já sem a parte do Fundeb). Fala: "12 milhões e 500".
- SUS 2025: R$ 10.355.854,39 = União R$ 10.025.881,04 (p. 2, linha 1.7.1.3.00.0.0) + Estado R$ 329.973,35 (p. 4, linha 1.7.2.3.00.0.0) + capital R$ 0,00 (p. 6, linha 2.4.1.1.00.0.0). Fala: "10 milhões e 400". Conta própria (soma). Não conferido no Fundo Nacional de Saúde nesta rodada (pendência).
- IPTU 2025: R$ 366.135,40 · p. 1, linha 1.1.1.2.50.0.0. Fala: "366 mil".
- Folhas de receita (não faladas): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (PCMGE016 da Prefeitura de dez/2024, dez/2025 e set/2026), cada uma somando o total do ano centavo a centavo.

## Despesa (o que gastou, liquidado)

- Gastou 2024: R$ 122.918.880,51 · `2024_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "122 milhões e 900". Confere: consolidado `2024-12_PCMGE065.pdf`, p. 76, linha TOTAL (Liquidada até o mês) = Prefeitura 118.608.687,33 (`2024-12_PCMGE015.pdf`, p. 80, "Total do Poder") + Câmara 4.310.193,18.
- Gastou a mais 2024: R$ 3.396.045,11 = 122.918.880,51 − 119.522.835,40 (conta própria; o Balanço mostra o mesmo valor como déficit na linha "TOTAL (VII)"). Fala: "3 milhões e 400 a mais".
- Gastou 2025: R$ 134.559.964,98 · `2025_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "134 milhões e 600". Confere: `2025-12_PCMGE065.pdf`, p. 37, "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" (Liquidado). O PCMGE015 da Prefeitura (p. 87, "Total do Poder", 129.595.849,71) + Câmara (`2025-12_CAMARA_PCMGE015.pdf`, p. 3, 4.964.161,49) dá 46,22 a mais, todos na ação 2065 "Gestão das Ações da Secretaria Municipal de Assistência Social" (liquidado 5.679.003,34 contra empenhado 5.678.957,12); usado o valor do consolidado e do Balanço (5.678.957,12).
- Gastou a mais 2025: R$ 3.578.615,11 = 134.559.964,98 − 130.981.349,87 (conta própria; mesmo valor no Balanço). Fala: "3 milhões e 600 a mais".
- Gastou 2026 até setembro: R$ 123.119.359,05 · `2026-09_PCMGE015.pdf` (consolidado: Prefeitura, Câmara e Fundo de Saúde), p. 81, linha TOTAL, coluna Liquidada até o Mês. Fala: "123 milhões e 100". Confere com `2026-09_PCMGE065.pdf` ("TOTAL GERAL DA DESPESA ORÇAMENTÁRIA", Liquidado no Ano).
- Gastou a mais 2026: R$ 11.052.295,28 = 123.119.359,05 − 112.067.063,77 (conta própria). Fala: "Já são 11 milhões a mais".
- Já comprometeu 2026 (empenhado): R$ 139.593.824,64 · `2026-09_PCMGE015.pdf`, p. 81, linha TOTAL, coluna Empenhada até o Mês. Fala: "139 milhões e 600".

### Setores (liquidado, `saida/setores.json`)
| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 43.254.467,18 | 56.483.338,49 | 52.149.591,47 |
| Saúde | 25.134.969,45 | 25.791.249,56 | 21.178.486,55 |
| Obras e serviços urbanos | 22.347.230,26 | 15.447.375,02 | 12.768.833,12 |
| Administração | 10.399.294,56 | 14.910.376,69 | 13.496.275,90 |
| Dívidas e encargos | 4.632.935,28 | 3.487.209,27 | 1.420.103,75 |
| Assistência social | 5.695.274,67 | 7.781.730,22 | 8.332.742,37 |
| Câmara de Vereadores | 4.310.193,18 | 4.964.161,49 | 4.111.473,36 |
| Festas e eventos | 4.724.011,53 | 2.934.745,44 | 5.660.477,31 |
| Cultura | 0,00 | 0,00 | 67.990,36 |
| Agricultura e meio ambiente | 1.899.240,50 | 2.465.519,39 | 3.485.009,54 |
| Esporte | 521.263,90 | 294.259,41 | 448.375,32 |
| Soma | 122.918.880,51 | 134.559.964,98 | 123.119.359,05 |

Festas e eventos 2024: R$ 4.724.011,53 · Festas e eventos 2025: R$ 2.934.745,44 · Festas e eventos 2026: R$ 5.660.477,31 (até setembro).
Cultura 2024: R$ 0,00 · Cultura 2025: R$ 0,00 · Cultura 2026: R$ 67.990,36 (até setembro).
Origem: cada ação do consolidado `2024-12_PCMGE065.pdf` (2024), do `2025-12_PCMGE015.pdf` da Prefeitura + `2025-12_CAMARA_PCMGE015.pdf` (2025) e do `2026-09_PCMGE015.pdf` consolidado (2026). Falas: Educação "43 e 300 / 56 e 500 / 52 e 100"; Saúde "25 e 100 / 25 e 800 / 21 milhões e 200"; Obras "22 e 300 / 15 e 400 / 12 e 800"; Administração "10 e 400 / 14 e 900 / 13 e 500"; Dívidas "4 e 600 / 3 milhões e 500 / 1 milhão e 400"; Assistência social "5 e 700 / 7 milhões e 800 / 8 milhões e 300"; Câmara "4 e 300 / 5 milhões / 4 milhões e 100"; Festas e eventos "4 e 700 / 2 milhões e 900 / 5 milhões e 700"; Cultura "zero nas ações de cultura / de novo zero / 68 mil"; Agricultura "1 milhão e 900 / 2 milhões e 500 / 3 milhões e 500"; Esporte "521 mil / 294 mil / 448 mil".

Cultura 2024 e 2025 = zero (checagem anti zero): as outras ações da função 13 existem no orçamento e estão com liquidado R$ 0,00 no ano: Implantação de Intercâmbio Cultural e Residência Artística (previsto 50.000,00), Revitalização da Biblioteca Municipal (50.000,00) e Reestruturação da Filarmônica e Fanfarra Municipal (80.000,00) · `2024-12_PCMGE065.pdf` e `2025-12_PCMGE015.pdf`. Procurado "cultur", "bibliot", "filarm", "museu", "patrim", "teatro" em todas as funções: a única outra ação com o nome é "Realização de eventos turísticos culturais" (função 23, previsto 60.000,00, liquidado 0,00 nos dois anos). A manutenção da Secretaria de Esportes, Cultura, Turismo e Lazer (conjunta) está na função 27 e entra em Esporte; por isso a fala diz "zero nas ações de cultura". Cultura 2026 = 67.990,36 da ação "Construção, reforma e ampliação de equipamentos culturais" (obras e instalações, `2026-09_PCMGE015.pdf`).

## Câmara (duodécimo)
Fonte: razão da própria Câmara (`PCMGE018`), conta 4.5.1.1.2.02 REPASSE RECEBIDO (coluna crédito até o mês) e devolução (3.5.1.1.2.09 DEVOLUÇÃO DE TRANSFERÊNCIAS em 2024; 3.5.1.1.2.02 REPASSE CONCEDIDO em 2025). Recebeu − devolveu = liquidado da Câmara, centavo a centavo.
- Câmara recebeu 2024: R$ 4.316.050,53 · `2024-12_CAMARA_PCMGE018.pdf`, p. 6. Fala: "recebeu 4 milhões e 300". Devolveu 2024: R$ 5.857,35 · mesma página, conta 3.5.1.1.2.09. Fala: "devolveu 5 mil e 900". 4.316.050,53 − 5.857,35 = 4.310.193,18 = gasto da Câmara.
- Câmara recebeu 2025: R$ 4.965.220,82 · `2025-12_CAMARA_PCMGE018.pdf`, p. 7. Fala: "recebeu 5 milhões". Devolveu 2025: R$ 1.059,33 · mesma página, conta 3.5.1.1.2.02. Fala: "devolveu mil reais". 4.965.220,82 − 1.059,33 = 4.964.161,49 = gasto da Câmara.
- Câmara recebeu até set/2026: R$ 4.150.646,50 · `2026-09_CAMARA_PCMGE018.pdf`, p. 7. Fala: "já recebeu 4 milhões e 200". Gasto liquidado até set/2026: 4.111.473,36 (empenhado 5.656.293,69) · `2026-09_CAMARA_PCMGE015.pdf`, "Total do Poder".

## Festas (achado)
- 2024, ação "Fomento às Atividades Festivas e Culturais do Município" (2.2100.13.392.6.2.2035) · `2024-12_PCMGE065.pdf`, p. 56: dotação inicial R$ 2.400.000,00 (fala "previa 2 milhões e 400"), dotação atual R$ 5.300.000,00 (fala "o valor autorizado subiu para 5 milhões e 300"), liquidado R$ 4.724.011,53 (fala "gastou 4 milhões e 700"). Elementos: serviços de pessoa jurídica 3.737.774,00; material de consumo 377.709,39; premiações culturais 329.428,14; serviços de pessoa física 279.100,00. O relatório de 2024 não separa bandas de palco (só o elemento 3.3.90.39.00).
- 2025, mesma ação · `2025-12_PCMGE015.pdf`, p. 65 a 66: dotação inicial R$ 4.465.000,00 (fala "previa 4 milhões e 500"), dotação atual 3.055.173,85, liquidado R$ 2.874.385,44 (fala "gastou 2 milhões e 900"; com o cenário de 60.360,00 da ação administrativa, Festas e eventos 2025 = 2.934.745,44, também "2 milhões e 900"). Elementos: outros serviços de pessoa jurídica 2.367.650,00; premiações 228.000,00; bandas (3.3.90.39.94) 90.000,00; pessoa física 64.563,00; material 108.519,50; festividades e homenagens 8.000,00; restituições 7.652,94.
- 2026, ação "Manutenção dos Festejos e Atividades Culturais" (2.1101.13.392.7.2.2035) · `2026-09_PCMGE015.pdf`, p. 54: dotação inicial R$ 2.838.000,00 (fala "previa 2 milhões e 800"), dotação atual R$ 6.855.400,00 (fala "subiu para 6 milhões e 900"), empenhado 5.757.943,14, liquidado R$ 5.660.477,31 (fala "já gastou 5 milhões e 700"). "Quase o dobro do previsto": 5.660.477,31 ÷ 2.838.000,00 = 1,99 (conta própria). Elementos: serviços de pessoa jurídica 5.365.107,72; pessoa física 181.204,42; material de consumo 114.165,17.
- Comparação 2026 (mesmos nove meses, liquidado até set/2026, `2026-09_PCMGE015.pdf`): Agricultura e meio ambiente R$ 3.485.009,54 (fala "a agricultura levou 3 milhões e 500"; funções 18 e 20); Esporte R$ 448.375,32 (fala "o esporte, 448 mil"; função 27).
- "Gastou mais do que arrecadou nos três anos": 2024 (+3.396.045,11), 2025 (+3.578.615,11) e 2026 até setembro (+11.052.295,28), acima.

## Pendências
- SUS não conferido no Fundo Nacional de Saúde.
- PCMGE018 e PCMGE064 de 12/2025 da Prefeitura vieram como "NADA CONSTA" (não usados).
