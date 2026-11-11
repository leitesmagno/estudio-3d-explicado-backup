# Fontes · 118. orçamento de Carinhanha (BA)

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-CARINHANHA/documentos_tcm/`. Município conferido no cabeçalho de cada PDF usado (PREFEITURA MUNICIPAL DE CARINHANHA, CNPJ 14.105.209/0001-24; Câmara Municipal de CARINHANHA; Serviço Autônomo de Água e Esgoto, SAAE). Conferido 2 vezes (11/11/2026).

Unidades no e-TCM: Prefeitura (UJ 692), Câmara (UJ 120) e SAAE (UJ 1033, autarquia de água e esgoto). Último mês entregue: 09/2026 (10/2026 "Pendente"). Lista de prestações: `~/Documents/SITE-EUMAGNOLEITE/dados/prestacoes-etcm/carinhanha.json`.

Regras de leitura:
- "Arrecadou" de 2024 e 2025 = Receitas realizadas do Balanço Orçamentário anual (Anexo XII, PCAGO015), que soma Prefeitura e SAAE. 2026 = "Arrecadada até Mês" do PCMGE016 de set/2026 da Prefeitura mais a do SAAE (já sem a parte do Fundeb).
- "Gastou" = LIQUIDADO. Não existe PCMGE065 consolidado em Carinhanha (os arquivos 2024-12, 2025-12 e 2026-09_PCMGE065.pdf são declarações de "não existência"). Por isso a despesa é a soma: Prefeitura (PCMGE015) + SAAE (PCMGE015) + Câmara (razão PCMGE018). Em 2025 a soma fecha centavo a centavo com o Balanço.
- Setor pela FUNÇÃO de cada ação (script `scripts/setores.py`). Festas e eventos (regra 99) = ação "Comemoração de festividades" (função 13) + elementos de bandas (3.3.90.39.94) lançados em outras ações. Cultura = resto da função 13 + desporto amador (função 27). Água e esgoto = SAAE. Obras e serviços urbanos = funções 15, 25 (iluminação) e 23 (parque de exposição e vaquejada). Administração = funções 02, 04, 06 e 09.
- Valores falados arredondados a uma casa (milhões) ou a mil; o valor exato está abaixo.

## Receita (o que arrecadou)

- Arrecadou 2024: R$ 142.177.615,26 · `2024_PCAGO015.pdf` (Balanço Orçamentário 2024), p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "142 milhões e 200".
- Arrecadou 2025: R$ 155.752.881,34 · `2025_PCAGO015.pdf`, p. 1, linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. Fala: "155 milhões e 800".
- Arrecadou 2026 até setembro: R$ 124.517.690,71 = Prefeitura R$ 117.605.831,89 (`2026-09_PCMGE016.pdf`, p. 9, linha TOTAL, coluna Arrecadada até Mês) + SAAE R$ 6.911.858,82 (`2026-09_SAAE_PCMGE016.pdf`, p. 2, linha TOTAL, coluna Arrecadada até Mês). Fala: "124 milhões e 500". Conta própria (soma das duas unidades).

### Receita de 2025, item a item (`2025-12_PCMGE016.pdf`, coluna "Arrecadada até Mês" + "Anulada até Mês")
- FPM 2025: R$ 41.155.489,57 · p. 2, linha 1.7.1.1.51.0.0 Cota-Parte do FPM (já sem os 20% do Fundeb, que ficam na coluna Deduções). Fala: "41 milhões e 200".
- Fundeb 2025: R$ 53.781.546,41 = retorno do Fundeb R$ 30.833.730,26 (p. 6, linha 1.7.5.0.00.0.0) + complementação da União R$ 22.947.816,15 (p. 4, linha 1.7.1.5.00.0.0: arrecadada 23.006.072,60 e anulada -58.256,45). Fala: "53 milhões e 800". Conta própria (soma das duas linhas).
- SUS 2025: R$ 12.026.129,53 = União R$ 11.702.114,00 (p. 3, linha 1.7.1.3.00.0.0) + Estado R$ 324.015,53 (p. 5, linha 1.7.2.3.00.0.0) + capital R$ 0,00 (linha 2.4.1.1.00.0.0). Fala: "12 milhões". Ainda não conferido no Fundo Nacional de Saúde nesta rodada (pendência).
- IPTU 2025: R$ 318.468,70 · p. 1, linha 1.1.1.2.50.0.0 (previsto 828.880,00). Fala: "318 mil".
- Folhas de receita (não faladas): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (Prefeitura + SAAE, PCMGE016 de dez/2024, dez/2025 e set/2026). A linha "Outras receitas" fecha com o total do Balanço (em 2024 inclui -338.533,84 de diferença entre o Balanço e a soma dos PCMGE016).

## Despesa (o que gastou, liquidado)

- Gastou 2024: R$ 162.964.458,70 · `2024_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "163 milhões".
- Faltaram 2024: R$ 20.786.843,44 = 162.964.458,70 − 142.177.615,26 (conta própria). Fala: "20 milhões e 800". O próprio Balanço mostra "Déficit (VI)" de 21.362.494,66 (sobre o empenhado) e superávit financeiro de anos anteriores de 13.574.173,17 usado em créditos adicionais (p. 1).
- Gastou 2025: R$ 152.459.049,37 · `2025_PCAGO015.pdf`, p. 2, linha "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. Fala: "152 milhões e 500". Confere: Prefeitura 140.556.490,11 (`2025-12_PCMGE015.pdf`, p. 88, "Total do Poder", Liquidado até o mês) + SAAE 7.881.314,54 (`2025-12_SAAE_PCMGE015.pdf`, p. 8) + Câmara 4.021.244,72 (`2025-12_CAMARA_PCMGE018.pdf`, p. 7, conta 6.2.2.1.3.03/04 crédito empenhado liquidado).
- Sobraram 2025: R$ 3.293.831,97 = 155.752.881,34 − 152.459.049,37 (conta própria). Fala: "3 milhões e 300".
- Gastou 2026 até setembro: R$ 129.887.107,91 = Prefeitura 120.497.573,98 (`2026-09_PCMGE015.pdf`, p. 89, "Total do Poder", Liquidado até o mês) + SAAE 6.150.410,45 (`2026-09_SAAE_PCMGE015.pdf`, p. 8, "Total do Poder") + Câmara 3.239.123,48 (`2026-09_CAMARA_PCMGE018.pdf`, p. 6: crédito utilizado 4.687.304,51 menos empenhado a liquidar 1.448.181,03). Fala: "129 milhões e 900". Conta própria (soma).
- Faltaram 2026: R$ 5.369.417,20 = 129.887.107,91 − 124.517.690,71 (conta própria). Fala: "5 milhões e 400".
- Já comprometeu 2026 (empenhado): R$ 147.919.719,37 = Prefeitura 135.868.453,56 (`2026-09_PCMGE015.pdf`, p. 89, Empenhado até o mês) + SAAE 7.363.961,30 (`2026-09_SAAE_PCMGE015.pdf`, p. 8) + Câmara 4.687.304,51 (`2026-09_CAMARA_PCMGE018.pdf`, p. 6, conta 6.2.2.1.3.00.00). Fala: "147 milhões e 900".
- Câmara 2024 (liquidado) = Balanço menos Prefeitura e SAAE: 162.964.458,70 − 152.829.551,42 (`2024-12_PCMGE015.pdf`, p. 86) − 6.469.749,56 (`2024-12_SAAE_PCMGE015.pdf`, p. 8) = 3.665.157,72. O Anexo XI de 2024 (`2024_PCAGO010.pdf`, p. 1, Unidade 0101 Câmara) dá o empenhado 3.678.993,78.

### Setores (liquidado, `saida/setores.json`)
| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 69.891.106,86 | 66.987.569,41 | 60.287.018,38 |
| Saúde | 26.408.420,84 | 27.492.701,76 | 23.233.306,23 |
| Obras e serviços urbanos | 26.048.669,50 | 18.625.827,08 | 15.195.742,58 |
| Administração | 19.633.415,12 | 13.095.695,08 | 9.401.293,17 |
| Água e esgoto (SAAE) | 6.469.749,56 | 7.881.314,54 | 6.150.410,45 |
| Assistência social | 3.411.302,27 | 2.632.326,76 | 2.340.115,32 |
| Câmara de Vereadores | 3.665.157,72 | 4.021.244,72 | 3.239.123,48 |
| Festas e eventos | 3.367.756,03 | 5.816.470,15 | 4.954.137,15 |
| Cultura | 848.403,88 | 512.663,60 | 611.778,05 |
| Dívidas e encargos | 757.344,71 | 3.245.838,22 | 2.543.150,70 |
| Agricultura e meio ambiente | 2.463.132,21 | 2.147.398,05 | 1.931.032,40 |
| Soma | 162.964.458,70 | 152.459.049,37 | 129.887.107,91 |

Festas e eventos 2024: R$ 3.367.756,03 · Festas e eventos 2025: R$ 5.816.470,15 · Festas e eventos 2026: R$ 4.954.137,15 (até setembro).
Cultura 2024: R$ 848.403,88 · Cultura 2025: R$ 512.663,60 · Cultura 2026: R$ 611.778,05 (até setembro).
Origem: cada ação do PCMGE015 de dez/2024 (p. 1 a 86), dez/2025 (p. 1 a 88) e set/2026 (p. 1 a 89) da Prefeitura, PCMGE015 do SAAE e razão da Câmara. Falas: Educação "69 e 900 / 67 milhões / 60 e 300"; Saúde "26 e 400 / 27 e 500 / 23 e 200"; Obras "26 milhões / 18 e 600 / 15 e 200"; Administração "19 e 600 / 13 e 100 / 9 e 400"; Água e esgoto "6 e 500 / 7 e 900 / 6 e 200"; Assistência social "3 e 400 / 2 e 600 / 2 e 300"; Câmara "3 e 700 / 4 milhões / 3 e 200"; Festas e eventos "3 e 400 / 5 e 800 / 5 milhões"; Cultura "848 mil / 513 mil / 612 mil"; Dívidas "757 mil / 3 e 200 / 2 e 500"; Agricultura "2 e 500 / 2 e 100 / 1 e 900".

## Câmara (duodécimo)
- Recebeu 2024: R$ 3.870.040,32 · `2024-12_CAMARA_PCMGE018.pdf` (razão da Câmara, documento escaneado), p. 6, conta 4.5.1.1.2 Transferências recebidas para a execução orçamentária, coluna Creditado até o Mês. Fala: "3 milhões e 900".
- Devolveu 2024: R$ 191.046,54 · `2024-12_CAMARA_PCMGE018.pdf`, p. 7, conta "Devolução de repasse concedido"; comprovante do Banco do Brasil de 30/12/2024 em `2024-13_CAMARA_PCAGE021.pdf`, p. 1, "VALOR TOTAL 191.046,54" para a conta da Prefeitura. Fala: "191 mil". Confere: 3.870.040,32 − 191.046,54 = 3.678.993,78 = empenhado da Câmara no Anexo XI.
- Recebeu 2025: R$ 4.959.714,41 · `2025-12_CAMARA_PCMGE018.pdf`, p. 6, conta 4.5.1.1.2.02.00 Repasse recebido, Creditado até o Mês. Fala: "4 milhões e 960 mil".
- Devolveu 2025: R$ 2.229,34 · `2025-12_CAMARA_PCMGE018.pdf`, p. 5, conta 3.5.1.1.2 Devolução de transferências. Fala: "2 mil e 200".
- Recebeu 2026 até setembro: R$ 3.848.906,86 · `2026-09_CAMARA_PCMGE018.pdf`, p. 4, conta 4.5.1.1.2.02.00 Repasse recebido. Fala: "3 milhões e 800".
- Folha da Câmara (não falada): contas de despesa do razão (3.1 pessoal e encargos, 3.3.1 material, 3.3.2.1 diárias, 3.3.2.2 pessoa física, 3.3.2.3 pessoa jurídica) e uma linha com o resto do liquidado.

## Iluminação pública
- Contribuição para o custeio da iluminação pública (código 1.2.4.0.00.0.0), arrecadada R$ 0,00 nos três anos: prevista R$ 158.000,00 (`2024-12_PCMGE016.pdf`, p. 2, linha 1.2.4.0.00.0.0), R$ 166.000,00 (`2025-12_PCMGE016.pdf`, p. 1) e R$ 155.000,00 (`2026-09_PCMGE016.pdf`, p. 1). Conferido também no PCMGE016 do SAAE (linha zerada) e procurado "ilumina" em todas as linhas de receita: não há outra linha. Fala: "estava prevista nos três anos, mas a prefeitura não declarou nenhum real arrecadado".
- Manutenção da rede de iluminação pública 2025: R$ 1.586.716,69 · `2025-12_PCMGE015.pdf`, p. 40, ação 2.1101.25.752.5.2.2188, Liquidado até o mês. Fala: "1 milhão e 600". (2024: 1.346.727,60; 2026 até set: 1.085.473,92.)

## Festas
- Comemoração de festividades (ação 2.701.13.392.x.2.2117, Sec. de Cultura, Esportes e Lazer):
  - 2024: previsto (fixada) R$ 3.519.500,00; gasto (liquidado) R$ 3.367.756,03 · `2024-12_PCMGE015.pdf`, p. 27, "Total do Projeto/Atividade". Falas: "3 milhões e 500" e "3 milhões e 400".
  - 2025: previsto R$ 3.858.331,00; gasto R$ 5.810.470,15 · `2025-12_PCMGE015.pdf`, p. 26, "Total do Projeto/Atividade" (dotação atualizada por créditos adicionais: 6.308.531,70). Falas: "3 milhões e 900" e "5 milhões e 800".
  - Bandas 2025: R$ 2.283.500,00 = 2.183.500,00 + 100.000,00 (elemento 3.3.90.39.94, mesma ação, p. 26). Fala: "2 milhões e 300".
  - Palco e cenário 2025: R$ 3.086.470,00 = 2.931.470,00 + 155.000,00 (elemento 3.3.90.39.95, mesma ação, p. 26). Fala: "3 milhões e 100".
  - Bandas e palco 2025: R$ 5.369.970,00 (conta própria, soma dos dois). Fala: "5 milhões e 400".
  - 2026: previsto R$ 3.751.800,00; gasto até setembro R$ 4.954.137,15 · `2026-09_PCMGE015.pdf`, p. 13. Falas: "3 milhões e 800" e "5 milhões".
- Ajuda de emergência para as famílias = ação "Manutenção dos benefícios eventuais" (4.1001.8.244.7.2.2328, Fundo Municipal de Assistência Social), 2025: previsto R$ 374.737,00; gasto (liquidado) R$ 88.967,78 · `2025-12_PCMGE015.pdf`, p. 81, "Total do Projeto/Atividade" (dotação reduzida para 170.142,31). Falas: "375 mil" e "89 mil".

## O que NÃO entrou e por quê
- Nenhum setor com zero. Nenhum processo do TCM citado (Decisões do TCM pedem captcha; fora do vídeo).
- Câmara: os anexos anuais 2024/2025 (Anexo II por elemento) não baixaram (falha no e-TCM a partir do PCAGE069); a folha usa o razão.
