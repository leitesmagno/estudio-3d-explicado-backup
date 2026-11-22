# Fontes · 138. orçamento de Dom Basílio

PESQUISA INICIAL (12/11/2026, ~01:45), antes do e-TCM. Tudo abaixo é CRUZAMENTO, não é a fonte do vídeo: os números ditos no vídeo virão dos PDFs do TCM-BA (Balanço, PCMGE015/016), com arquivo, página e linha. Arquivos guardados em `~/Documents/RECEITAS-DESPESAS-DOM-BASILIO/siconfi/`.

## IBGE

| Dado | Valor | Fonte (API, consultada em 12/11/2026) | Arquivo |
|---|---|---|---|
| Código do município | 2910107 (Dom Basílio, microrregião Livramento do Brumado, Centro Sul Baiano) | servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios | conferido na resposta da API |
| População, Censo 2022 | 11.884 | servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[2910107] | siconfi/ibge_censo2022.json |
| População estimada 2025 | 12.329 | servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2025/variaveis/9324?localidades=N6[2910107] | siconfi/ibge_estimativa2025.json |

## SICONFI (Tesouro Nacional, apidatalake.tesouro.gov.br/ords/siconfi/tt, consultado em 12/11/2026)

Ente: "Prefeitura Municipal de Dom Basílio - BA". Arquivos: siconfi/rreo_2024_b6.json, rreo_2025_b6.json, rreo_2026_b4.json, dca_2024.json, dca_2025.json. O RREO do 5º bimestre de 2026 ainda não estava publicado.

| Item | 2024 (RREO 6º bim.) | 2025 (RREO 6º bim.) | 2026 (RREO 4º bim., até agosto) |
|---|---|---|---|
| Receita realizada (Anexo 01, linha I) | 69.461.463,81 | 81.568.652,32 | 60.340.124,70 |
| Despesa empenhada | 70.398.083,11 | 77.729.404,01 | 69.555.750,35 |
| Despesa liquidada | 70.273.735,58 | 76.944.480,38 | 55.016.719,19 |
| Resultado (receita - liquidado, conta própria) | -812.271,77 (gastou mais do que arrecadou) | +4.624.171,94 | +5.323.405,51 (até agosto) |

Despesa liquidada por função (RREO Anexo 02, coluna "Despesas liquidadas até o bimestre"):

| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Legislativa (Câmara) | 2.038.486,58 | 2.527.144,61 | 1.729.834,88 |
| Administração | 8.556.957,54 | 9.431.768,22 | 7.093.591,39 |
| Assistência social | 1.441.046,31 | 1.658.052,89 | 1.244.464,54 |
| Saúde | 17.804.818,33 | 18.438.812,98 | 14.267.267,42 |
| Educação | 23.855.871,40 | 30.235.747,47 | 21.062.580,35 |
| Cultura (só "Difusão cultural") | 2.381.106,22 | 2.223.822,79 | 2.157.732,00 |
| Urbanismo | 5.471.098,61 | 6.131.074,20 | 4.331.696,65 |
| Saneamento | 272.459,83 | 10.848,00 | 7.616,00 |
| Gestão ambiental | 900.440,52 | 819.512,19 | 476.531,10 |
| Agricultura | 756.595,07 | 644.412,08 | 483.256,40 |
| Energia (iluminação) | 464.578,77 | 437.544,05 | 295.008,28 |
| Transporte | 2.956.781,33 | 1.478.927,97 | 298.484,63 |
| Desporto e lazer | 343.870,83 | 385.930,62 | 205.980,54 |
| Encargos especiais (dívidas) | 3.029.624,24 | 2.520.882,31 | 1.362.675,01 |
| TOTAL | 70.273.735,58 | 76.944.480,38 | 55.016.719,19 |

Receita própria (DCA Anexo I-C, receitas brutas realizadas): impostos, taxas e contribuições 2024 R$ 3.544.014,89 e 2025 R$ 4.345.739,33; ISS 2024 R$ 1.046.364,85 e 2025 R$ 1.095.258,71; IPTU 2025 R$ 147.167,58 (em 2024 não aparece com o código 1.1.1.2.50.0.0, CONFERIR no PCMGE016); FPM cota mensal (bruta) 2024 R$ 23.255.752,07 e 2025 R$ 25.272.034,05.

Para conferir no TCM: (1) se o Balanço de 2024 também mostra gasto maior que a receita; (2) quanto da Cultura é festa (bandas, palco, São João) pela regra 99; (3) o IPTU de 2024; (4) Câmara: duodécimo e devolução.

## Notícias (só conferência interna, regra 25: nada disso entra no vídeo sem documento do TCM)

| Veículo | Data | Título | Link | Uso |
|---|---|---|---|---|
| Jornal Grande Bahia | 08/11/2017 | Contas de Dom Basílio, Presidente Dutra, Umburanas e Cansanção são rejeitadas (indisponibilidade financeira de R$ 1.094.052,64) | https://jornalgrandebahia.com.br/2017/11/contas-de-dom-basilio-presidente-dutra-umburanas-e-cansancao-sao-rejeitadas/ | fora do período do vídeo |
| Jornal Grande Bahia | out/2012 | Tribunal de Contas rejeita contas da Prefeitura de Dom Basílio (exercício 2011) | https://jornalgrandebahia.com.br/?p=109887 | fora do período; cita nome de gestor (não usar) |
| Bahia Notícias | sem data clara | Denúncia contra prefeito de Dom Basílio é julgada improcedente por TCM | https://www.bahianoticias.com.br/municipios/noticia/13912-denuncia-contra-prefeito-de-dom-basilio-e-julgada-improcedente-por-tcm | fora do período |
| A Tarde | sem data clara | TCM denuncia prefeito de Dom Basílio por irregularidades em pregões | https://atarde.com.br/portalmunicipios/portalmunicipiosmunicipios/tcm-denuncia-prefeito-de-dom-basilio-por-irregularidades-em-pregoes-1208213 | fora do período |

Não achei notícia sobre as contas de 2024 a 2026 nem sobre o São João de Dom Basílio em 2025 e 2026. O painel de cachês juninos do MP-BA fica para conferência interna, se for preciso.
