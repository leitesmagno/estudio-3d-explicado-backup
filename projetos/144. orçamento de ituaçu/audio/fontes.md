# Fontes · 144. orçamento de Ituaçu

PESQUISA INICIAL (12/11/2026, ~04:55), antes do e-TCM. Tudo abaixo é CRUZAMENTO, não é a fonte do vídeo: os números ditos no vídeo virão dos PDFs do TCM-BA (Balanço, PCMGE015/016/065/066), com arquivo, página e linha. Arquivos guardados em `~/Documents/RECEITAS-DESPESAS-ITUACU/siconfi/`.

## IBGE

| Dado | Valor | Fonte (API, consultada em 12/11/2026) | Arquivo |
|---|---|---|---|
| Código do município | 2917201 (Ituaçu, microrregião Brumado, Centro Sul Baiano) | servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios | conferido na resposta da API |
| População, Censo 2022 | 17.914 | servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[2917201] | siconfi/ibge_censo2022.json |
| População estimada 2025 | 18.506 | servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2025/variaveis/9324?localidades=N6[2917201] | siconfi/ibge_estimativa2025.json |

## SICONFI (Tesouro Nacional, apidatalake.tesouro.gov.br/ords/siconfi/tt, consultado em 12/11/2026)

Ente: "Prefeitura Municipal de Ituaçu - BA". Arquivos: siconfi/rreo_2024_b6.json, rreo_2025_b6.json, rreo_2026_b4.json, dca_2024.json, dca_2025.json. O RREO do 5º bimestre de 2026 ainda não estava publicado.

| Item | 2024 (RREO 6º bim.) | 2025 (RREO 6º bim.) | 2026 (RREO 4º bim., até agosto) |
|---|---|---|---|
| Receita realizada (Anexo 01, linha I) | 104.177.833,96 | 111.959.481,80 | 73.802.294,79 |
| Despesa empenhada | 99.615.374,40 | 110.452.346,18 | 94.806.937,40 |
| Despesa liquidada | 99.596.475,14 | 110.339.912,36 | 75.226.750,92 |
| Resultado (receita - liquidado, conta própria) | +4.581.358,82 | +1.619.569,44 | -1.424.456,13 (até agosto: gastou mais do que arrecadou) |

Despesa liquidada por função (RREO Anexo 02, "Despesas liquidadas até o bimestre"):

| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Legislativa (Câmara) | 1.123.495,90 | 1.871.678,41 | 2.266.592,28 |
| Administração | 10.553.049,55 | 12.093.578,93 | 9.228.777,74 |
| Segurança pública | 0,00 | 0,00 | 120.121,89 |
| Assistência social | 2.752.688,55 | 2.513.900,51 | 1.682.433,45 |
| Saúde | 22.596.819,06 | 25.688.117,19 | 17.395.500,76 |
| Educação | 39.377.607,78 | 46.196.966,78 | 30.820.462,69 |
| Cultura | 2.261.163,14 | 3.028.232,96 | 2.747.046,62 |
| Urbanismo | 12.507.655,46 | 13.472.100,23 | 9.004.447,44 |
| Saneamento | 1.471.582,29 | 1.192.474,85 | 679.667,27 |
| Agricultura | 206.857,26 | 284.951,37 | 201.129,00 |
| Transporte | 4.198.857,97 | 352.519,48 | 1.038.355,80 |
| Desporto e lazer | 34.438,98 | 75.626,68 | 42.215,98 |
| Encargos especiais (dívidas) | 2.512.259,20 | 3.569.764,97 | 0,00 (conferir) |
| TOTAL | 99.596.475,14 | 110.339.912,36 | 75.226.750,92 |

Receita própria (DCA Anexo I-C, receitas brutas realizadas): impostos, taxas e contribuições 2024 R$ 4.275.908,56 e 2025 R$ 4.817.171,11; IPTU 2024 R$ 72.520,92 e 2025 R$ 73.917,42; ISS 2024 R$ 1.228.919,70 e 2025 R$ 1.452.951,61; FPM cota mensal (bruta) 2024 R$ 28.033.186,99 e 2025 R$ 30.674.185,06.

Para conferir no TCM: (1) se 2026 até setembro também mostra gasto acima da receita; (2) quanto da Cultura é festa (regra 99); (3) a Câmara (Legislativa) subiu de 1,1 mi para 1,9 mi e já 2,3 mi até agosto/2026: conferir duodécimo e a classificação; (4) Encargos especiais zerado em 2026 (dívida lançada em outra função?); (5) Transporte caiu de 4,2 para 0,35 mi (troca de classificação?).

## Notícias (só conferência interna, regra 25: nada disso entra no vídeo sem documento do TCM)

| Veículo | Data | Título | Link | Uso |
|---|---|---|---|---|
| BNews | sem data clara | Ituaçu: ex-prefeito é denunciado ao MP por irregularidade em pagamento a médico (termo de ocorrência no TCM, R$ 411.161,49) | https://www.bnews.com.br/noticias/cidades/239879-ituacu-ex-prefeito-e-denunciado-ao-mp-por-irregularidade-em-pagamento-a-medico.html | fora do período; cita nome de gestor (não usar) |

Não achei notícia sobre as contas de 2024 a 2026 nem sobre o São João de Ituaçu em 2025 e 2026.
