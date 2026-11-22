# Fontes · 138. orçamento de Dom Basílio

Documentos baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 12/11/2026, das 03:41 às 04:16, e guardados em `~/Documents/RECEITAS-DESPESAS-DOM-BASILIO/documentos_tcm/` (PDF e texto extraído). Município DOM BASÍLIO (código 119 no e-TCM) · Prefeitura UJ 724 · Câmara UJ 153 · SAAE UJ 1042. Último mês entregue em 2026: setembro (10/2026 "Pendente"; lista em SITE-EUMAGNOLEITE/dados/prestacoes-etcm/dom-basilio.json).

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE066 consolidado de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou para mil, abaixo de 1 milhão); abaixo, o valor exato.

Atenção: o PCMGE015 e o PCMGE065 de dez/2024 da Prefeitura são "declaração de inexistência de documento" (assinada pelo gestor). Por isso a despesa de 2024 por ação vem do Anexo VI do Balanço 2024 (PCAGO004), que dá o EMPENHADO (70.398.083,11). A diferença para o liquidado do Balanço (124.347,53) está só em Urbanismo (123.750,83) e Administração (596,70), conforme o RREO do 6º bimestre de 2024 (SICONFI, Anexo 02); entra como ajuste nesses dois setores. O sistema de 2026 (E&L) não traz a função: o setor foi dado pela função da MESMA ação nos Anexos VI de 2024 e 2025 (script `scripts/setores.py`).

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 69.461.463,81 | 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024, consolidado) | p.1, "SUBTOTAL DAS RECEITAS (IV)" | Receitas realizadas | fala "69 milhões e 500", mapa |
| (conferência) R$ 69.650.720,90 | 2024-12_PCMGE066.pdf (consolidado) | "TOTAL", coluna Acumulado | | folha 2024 com ajuste de R$ -189.257,09 ao Balanço |
| Receita 2025: R$ 81.568.652,32 | 2025-13_ANUAL_PCAGO015.pdf p.1 "SUBTOTAL DAS RECEITAS (IV)" e 2025-12_PCMGE066.pdf "TOTAL" (acumulado) | | Receitas realizadas | fala "81 milhões e 600", mapa |
| Receita 2026 até set: R$ 67.961.966,37 | 2026-09_PCMGE066.pdf (consolidado, E&L) | "TOTAL" da receita orçamentária (anterior 60.340.124,70 + no período 7.621.841,67) | Acumulado | fala "68 milhões", mapa |
| FPM 2025: R$ 28.387.619,61 (bruto; dedução do Fundeb na linha 9517115100000) | 2025-12_PCMGE066.pdf | p.4, 17115100000 | Acumulado | fala "28 milhões e 400, antes do desconto para o Fundeb", mapa |
| Fundeb 2025: R$ 13.194.609,39 | 2025-12_PCMGE066.pdf | p.8, 17500000000 | Acumulado | fala "13 milhões e 200", mapa |
| Complementação da União ao Fundeb 2025: R$ 12.285.013,25 (previsto 6.263.739,85) | 2025-12_PCMGE066.pdf | p.6, 17150000000 | Acumulado | fala "12 milhões e 300", mapa |
| SUS 2025: R$ 11.113.661,56 = União R$ 10.425.530,35 + Estado R$ 688.131,21 | 2025-12_PCMGE066.pdf | p.5, 17130000000 (União 10.425.530,35); p.7, 17230000000 (Estado 688.131,21) | Acumulado | fala "11 milhões e 100 para a saúde", mapa. Soma conferida 14/11: 11.113.661,56 = 10.425.530,35 + 688.131,21. Link do site: p. 5. Não conferido no Fundo Nacional de Saúde (pendência) |
| Impostos, taxas e contribuições da cidade 2025: R$ 4.345.739,33 | 2025-12_PCMGE066.pdf | p.1, 11000000000 | Acumulado | fala "4 milhões e 300", mapa |
| IPTU 2025: R$ 147.167,58 | 2025-12_PCMGE066.pdf | p.1, 11125000000 | Acumulado | fala "147 mil", mapa |

Folhas de receita (valores brutos por grupo + a dedução do Fundeb, soma = total): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (scripts `el_receita.py` e `receita.py`).

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 70.273.735,58 | 2024-13_ANUAL_PCAGO015.pdf | p.1, "SUBTOTAL DAS DESPESAS (XIII)" | Despesas liquidadas (empenhado 70.398.083,11) | fala "70 milhões e 300" |
| Gastou a mais em 2024: R$ 812.271,77 (conta própria: 70.273.735,58 - 69.461.463,81) | Balanço 2024 | conta própria | | fala "812 mil a mais", torre vermelha |
| Gastou 2025: R$ 76.944.480,38 = Prefeitura 72.638.287,36 + Câmara 2.527.144,61 + SAAE 1.779.048,41 | 2025-13_ANUAL_PCAGO015.pdf p.1 "SUBTOTAL DAS DESPESAS (XIII)"; 2025-12_PCMGE015.pdf p.93 "Total do Poder"; 2025-12_CAMARA_PCMGE015.pdf p.4; SAAE no Anexo VI 2025 (2025-13_ANUAL_PCAGO004.pdf, órgão 310) | | Liquidado | fala "76 milhões e 900" (bate centavo a centavo) |
| Sobraram 2025: R$ 4.624.171,94 (conta própria) | | | | fala "4 milhões e 600" |
| Gastou 2026 até set: R$ 63.938.358,55 | 2026-09_PCMGE065.pdf (consolidado: Prefeitura, fundos, Câmara e SAAE) | "TOTALTOTAL GERAL" da despesa orçamentária | Liquidada até o período | fala "63 milhões e 900" |
| Empenhado 2026 até set: R$ 76.127.530,27 | mesmo PDF e linha | | Empenhada até o período | fala "já reservou, em empenhos, 76 milhões e 100" (regra 37) |

## Setores (liquidado; resultado em `saida/setores.json`)

| Setor | 2024 | 2025 | 2026 até set | Fala |
|---|---|---|---|---|
| Educação | 23.855.871,40 | 30.287.562,32 | 25.682.698,39 | 23,9 · 30,3 · 25,7 mi |
| Saúde | 17.804.818,33 | 18.390.669,37 | 15.904.124,98 | 17,8 · 18,4 · 15,9 mi |
| Administração | 5.017.834,91 | 5.624.436,02 | 5.058.708,97 | 5 · 5,6 · 5,1 mi |
| Obras e serviços urbanos (inclui SAAE, iluminação, limpeza, praças, transporte) | 12.704.041,17 | 11.898.470,03 | 8.570.531,70 | 12,7 · 11,9 · 8,6 mi |
| Câmara de Vereadores | 2.038.486,58 | 2.527.144,61 | 1.951.708,77 | 2 · 2,5 · quase 2 mi |
| Dívidas e encargos | 3.029.624,24 | 2.485.419,31 | 1.708.408,20 | 3 · 2,5 · 1,7 mi |
| Festas e eventos | 2.165.810,45 | 2.197.444,97 | 2.378.916,89 | 2,2 · 2,2 · 2,4 mi |
| Cultura (sem as festas) | 215.295,77 | 26.377,82 | 0,00 | 215 mil · 26 mil · nada |
| Assistência social | 1.441.046,31 | 1.658.052,89 | 1.416.830,71 | 1,4 · 1,7 · 1,4 mi |
| Agricultura e meio ambiente | 1.657.035,59 | 1.462.972,42 | 1.041.537,78 | 1,7 · 1,5 · 1 mi |
| Esporte, lazer e turismo | 343.870,83 | 385.930,62 | 224.892,16 | 344 · 386 · 225 mil |
| Soma | 70.273.735,58 | 76.944.480,38 | 63.938.358,55 | = total do ano (diferença 0,00) |

Cultura 2026 = zero: as ações "Lei Paulo Gustavo" (previsto 117.976,26), "Lei Aldir Blanc" (6.956,00) e "Incentivo à produção artística" (2.464,00) estão com empenhado e liquidado 0,00 em 2026-09_PCMGE065.pdf (p.17 e 18). Esporte 2026 = ação de turismo (170.045,32), coordenação esportiva (2.523) e eventos esportivos; as demais ações de esporte com 0,00.

## Festas e eventos (achado)

| Valor exato | Documento | Linha | Coluna | Onde aparece |
|---|---|---|---|---|
| 2024: R$ 2.165.810,45 | 2024-13_ANUAL_PCAGO004.pdf (Anexo VI) | 133920162.613 "Custear despesas com eventos festivos, shows e comemorações" | Valor (= liquidado: a função Cultura soma 2.381.106,22, igual ao liquidado do RREO) | fala "2 milhões e 200 em 2024" |
| 2025: R$ 2.197.444,97 (previsto 3.590.664,29; autorizado 3.657.260,02) | 2025-12_PCMGE015.pdf | p.59, ação 305.3.13.392.16.2.2613 | Liquidações até mês | fala "e de novo em 2025" |
| 2026: previsto R$ 2.257.132,52; autorizado R$ 3.744.101,92 (anulações 816.012,00 e suplementações 2.302.981,40); empenhado R$ 2.642.016,89; liquidado R$ 2.378.916,89 | 2026-09_PCMGE065.pdf | p.17, ação 2.613 | Fixada / Atual / Empenhada / Liquidada até o período | fala "previa 2 milhões e 300... subiu para 3 milhões e 700... já foram 2 milhões e 400" |
| 2026 por elemento: serviços de empresas 1.900.816,89; despesas de exercícios anteriores 450.000,00; pessoa física 28.100,00 | mesmo PDF | elementos 33903900000, 33909200000, 33903600000 | Liquidada | só na folha |

Pergunta final: assistência social 2026 R$ 1.416.830,71 (Fundo Municipal de Assistência Social 1.344.749,09 + Sec. de Assistência Social 72.081,62); esporte, lazer e turismo 2026 R$ 224.892,16; festas 2026 R$ 2.378.916,89.

## Câmara (só nas folhas, não falado)

| Valor exato | Documento | Linha |
|---|---|---|
| 2024: repasse recebido R$ 2.173.597,39; devolução de transferências R$ 135.110,81; gastou R$ 2.038.486,58 | 2024-12_CAMARA_PCMGE018.pdf (razão SIGA) e 2024-12_CAMARA_PCMGE015.pdf | 4.5.1.1.2.02 (creditado até o mês) e 3.5.1.1.2.09 (debitado até o mês) |
| 2025: repasse R$ 2.544.717,33; devolução R$ 17.572,72; gastou R$ 2.527.144,61 | 2025-12_CAMARA_PCMGE018.pdf e PCMGE015 | idem |
| 2026 até set: repasse R$ 2.140.849,98; devolução R$ 50.000,00; gastou R$ 1.951.708,77 | 2026-09_CAMARA_PCMGE018.pdf; 2026-09_PCMGE065.pdf (transferências concedidas da Câmara 50.000,00) | idem |

## Pendências

- Balanço anual de 2018 não baixou (2 tentativas): fora do ranking do site (linha em _pendencias-tcm.md).
- PCMGE015 e PCMGE065 de dez/2024 da Prefeitura: declaração de inexistência (usado o Anexo VI do Balanço). PCMGE018 de dez/2025 da Prefeitura também é declaração. PCMGE015 de dez/2025 do SAAE escaneado (usado o Anexo VI 2025).
- SUS não conferido no FNS. Decisões do TCM não consultadas (captcha); o vídeo não fala de Tribunal.
- Sincronia: o Whisper não escreveu o "400" de "Festas e eventos, 2 milhões e 400" (2026); a voz fala (conferido com o Whisper small no trecho 133,8 a 137,6 s: "400" em 135,72 s), tempo corrigido à mão no palavras.ts.

---

# Cruzamento (pesquisa inicial, antes do TCM)

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

## Conferência de soma (auditoria Aline, pedido p160, 13/11/2026)
- Sobraram 2025 R$ 4.624.171,94 é conta própria e não aparece escrito no PDF: 2025-13_ANUAL_PCAGO015.pdf p. 1, receita realizada "SUBTOTAL DAS RECEITAS (IV)" 81.568.652,32 − despesa liquidada "SUBTOTAL DAS DESPESAS (XIII)" 76.944.480,38 = 4.624.171,94. Os dois números lidos de novo na p. 1; link certo. (O "SUPERÁVIT (XVI)" de 3.839.248,31 da mesma página é calculado sobre o empenhado 77.729.404,01; o vídeo usa o liquidado, regra 32.) Número e fala sem mudança.
