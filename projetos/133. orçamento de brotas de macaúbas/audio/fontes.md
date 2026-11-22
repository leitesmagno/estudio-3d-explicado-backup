# Fontes · 133. orçamento de Brotas de Macaúbas

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) entre 11/11/2026, 23:21, e 12/11/2026, 00:17. Estão guardados em `~/Documents/RECEITAS-DESPESAS-BROTAS-DE-MACAUBAS/documentos_tcm/` (PDF e texto extraído). Município BROTAS DE MACAÚBAS (código 54 no e-TCM) · Prefeitura UJ 659 · Câmara UJ 89. Não há autarquia nem fundo com prestação própria no e-TCM. Todos os 88 PDFs trazem o nome de Brotas de Macaúbas no texto (conferido em 12/11/2026).

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou para mil, abaixo de 1 milhão); abaixo, o valor exato. Último mês entregue em 2026: setembro (10/2026 "Pendente" no e-TCM em 11/11/2026, lista gravada em SITE-EUMAGNOLEITE/dados/prestacoes-etcm/brotas-de-macaubas.json).

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 70.462.569,68 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024, consolidado) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "70 milhões e 500", mapa, folha |
| (conferência) R$ 70.476.201,81 | 2024-12_PCMGE016.pdf (Prefeitura) | p.10, "Totais:" (arrecadada 70.478.334,56 + anulada -2.132,75) | Arrecadada até mês | folha da receita 2024 (linha de ajuste de R$ -13.632,13 ao Balanço) |
| Receita 2025: R$ 76.438.590,95 | 2025_PCAGO015.pdf p.1 "SUBTOTAL DAS RECEITAS (III)" e 2025-12_PCMGE016.pdf p.10 "Totais:" (76.463.996,57 - 25.405,62) | | Receitas realizadas / Arrecadada até mês | fala "76 milhões e 400", mapa, folha |
| Receita 2026 até set: R$ 62.866.860,56 | 2026-09_PCMGE016.pdf | p.10, "Totais:" (arrecadada 62.866.955,81 + anulada -95,25) | Arrecadada até mês | fala "62 milhões e 900", mapa, folha |
| FPM 2025: R$ 23.517.422,81 | 2025-12_PCMGE016.pdf | p.3, 1.7.1.1.51 Cota-Parte do FPM (já sem a parte do Fundeb) | Arrecadada até mês | fala "23 milhões e 500", mapa |
| Fundeb 2025: R$ 12.371.352,58 | 2025-12_PCMGE016.pdf | p.6, 1.7.5.1.50 Transferências do Fundeb | Arrecadada até mês | fala "12 milhões e 400", mapa |
| SUS 2025: R$ 5.651.273,30 (União; Estado 1.7.2.3 = R$ 0,00 de R$ 27.462,66 previstos) | 2025-12_PCMGE016.pdf | p.4, 1.7.1.3; p.6, 1.7.2.3 | Arrecadada até mês | fala "5 milhões e 700 para a saúde", mapa. Não conferido no Fundo Nacional de Saúde (pendência, como nas cidades anteriores) |
| Impostos, taxas e contribuições da cidade 2025: R$ 8.774.536,03 (8.775.393,25 - anulada 857,22) | 2025-12_PCMGE016.pdf | p.1, 1.1.0.0 | Arrecadada até mês | fala "8 milhões e 800", mapa |
| ISS 2025: previsto R$ 1.954.682,10; arrecadado R$ 6.581.713,37 (6.582.033,20 - anulada 319,83) | 2025-12_PCMGE016.pdf | p.1, 1.1.1.4.51 Impostos sobre Serviços | Previsão inicial / Arrecadada até mês | fala "previa 2 milhões e arrecadou 6 milhões e 600", mapa |
| IPTU 2025: R$ 45.198,78 (45.220,28 - anulada 21,50; previsto R$ 21.714,69) | 2025-12_PCMGE016.pdf | p.1, 1.1.1.2.50 | Arrecadada até mês | fala "45 mil", mapa |

Folhas de receita (item a item, soma = total do ano): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (script `scripts/receita.py`; código de cada linha no campo "codigos"). FPM, ICMS e IPVA vêm líquidos (20% do Fundeb já descontado).

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 67.272.895,05 | 2024_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas (empenhado 68.165.346,65; pago 67.001.771,66) | fala "67 milhões e 300" |
| (conferência) R$ 67.157.358,64 = Prefeitura 65.016.947,92 + Câmara 2.140.410,72 | 2024-12_PCMGE065.pdf (consolidado) p.100 "TOTAL" e 2024-12_PCMGE015.pdf p.99 "Total do Poder" + 2024-12_CAMARA_PCMGE015.pdf "Total Geral" | | Liquidado até mês (o PAGO do consolidado, 67.001.771,67, bate com o Balanço) | diferença de R$ 115.536,41 entre o liquidado do Balanço e o do PCMGE065, posta em Educação como "ajuste ao Balanço" (no Anexo 9, 2024_PCAGO007.pdf, a Educação é a função com a maior diferença para o PCMGE015: 25.674.367,04 x 25.557.276,55 empenhados) |
| Sobraram 2024: R$ 3.189.674,63 (conta própria: 70.462.569,68 - 67.272.895,05) | Balanço 2024 | conta própria | | fala "3 milhões e 200" |
| Gastou 2025: R$ 73.013.044,95 = Prefeitura 70.184.784,21 + Câmara 2.828.260,74 | 2025_PCAGO015.pdf p.2 "SUBTOTAL DAS DESPESAS (XI)"; 2025-12_PCMGE015.pdf p.123 e 2025-12_CAMARA_PCMGE015.pdf p.3 "Total do Poder" | | Despesas liquidadas | fala "73 milhões" (bate centavo a centavo) |
| Sobraram 2025: R$ 3.425.546,00 (conta própria: 76.438.590,95 - 73.013.044,95) | | conta própria | | fala "3 milhões e 400" |
| Gastou 2026 até set: R$ 56.774.331,85 = Prefeitura 54.333.524,53 + Câmara 2.440.807,32 | 2026-09_PCMGE015.pdf p.115 e 2026-09_CAMARA_PCMGE015.pdf p.3 "Total do Poder" | | Liquidações até mês | fala "56 milhões e 800" |
| Empenhado 2026 até set: R$ 72.878.693,35 = Prefeitura 69.655.007,59 + Câmara 3.223.685,76 | mesmos PDFs, "Total do Poder" | | Empenhos até mês | fala "já reservou, em empenhos, 72 milhões e 900" (regra 37: empenhado acima do arrecadado, não se diz "sobrou") |

## Setores (liquidado; setor pela função da ação e, em Obras e transporte, pela secretaria; script `scripts/setores.py`, resultado `saida/setores.json`)

Mapa: Educação = função 12 (+ ajuste de 2024); Saúde = 10; Administração = funções 04 e 23 do Gabinete, Controladoria, Administração, Finanças e Desenvolvimento Econômico e Turismo; Obras e transporte = órgãos 10 (Sec. de Obras e Serviços Públicos: manutenção, pavimentação, limpeza, iluminação) e 11 (Sec. de Transporte: manutenção, frota, estradas), todas as funções menos a 18; Câmara = PCMGE015 da própria Câmara (2024 sistema Contabilis, `scripts/cam2024.py`; 2025 e 2026 SIGA); Dívidas e encargos = 28; Festas e eventos = elementos de bandas e grupos musicais (3.3.90.39.18, 3.3.90.36.04, 3.3.90.39.94), cenário e palco (3.3.90.39.19, 3.3.90.39.95) e festividades e homenagens (3.3.90.39.23) dentro das ações da função 13 (regra 99; NÃO há ação com festa ou evento no nome); Cultura = resto da função 13; Assistência social = 08; Agricultura e meio ambiente = 18 e 20 (Sec. de Agricultura e Recursos Hídricos: água, poços, aguadas; meio ambiente); Esporte e lazer = 27.

| Setor | 2024 | 2025 | 2026 até set | Fala |
|---|---|---|---|---|
| Educação | 25.627.904,52 (25.512.368,11 + ajuste 115.536,41) | 27.979.189,35 | 21.104.938,02 | 25,6 · 28 · 21,1 mi |
| Saúde | 15.013.416,47 | 16.041.153,72 | 11.630.372,14 | 15 · 16 · 11,6 mi |
| Administração | 6.474.492,94 | 7.375.939,48 | 6.309.719,60 | 6,5 · 7,4 · 6,3 mi |
| Obras e transporte | 12.448.618,70 | 11.352.982,36 | 8.864.297,69 | 12,4 · 11,4 · 8,9 mi |
| Câmara de Vereadores | 2.140.410,72 | 2.828.260,74 | 2.440.807,32 | 2,1 · 2,8 · 2,4 mi |
| Dívidas e encargos | 1.200.232,17 | 2.698.590,65 | 2.552.441,80 | 1,2 · 2,7 · 2,6 mi |
| Festas e eventos | 1.380.404,41 | 1.598.322,25 | 1.840.251,62 | 1,4 · 1,6 · 1,8 mi |
| Cultura (sem as festas) | 297.540,94 | 510.919,62 | 462.250,71 | 298 · 511 · 462 mil |
| Assistência social | 1.538.653,63 | 1.548.558,40 | 1.118.488,41 | 1,5 · 1,5 · 1,1 mi |
| Agricultura e meio ambiente | 822.797,43 | 1.038.982,79 | 427.548,15 | 823 mil · 1 mi · 428 mil |
| Esporte e lazer | 328.423,12 | 40.145,59 | 23.216,39 | 328 · 40 · 23 mil |
| Soma | 67.272.895,05 | 73.013.044,95 | 56.774.331,85 | = total do ano (diferença 0,00) |

Esporte 2025: a unidade 5.503 (Esporte) ficou com liquidado zero; o gasto de R$ 40.145,59 está na nova unidade 12.1202 (requalificação de espaços esportivos 2.117,59 + eventos de esporte e lazer 38.028,00), conferido em 2025-12_PCMGE015.pdf. Por isso não se diz "zero".

## Festas e eventos (achado)

| Valor exato | Documento | Linha / código | Coluna | Onde aparece |
|---|---|---|---|---|
| Ação 2031 "INCENTIVO A CULTURA COMO ESTRATEGIA PARA O DESENVOLVIMENTO", 2026: previsto R$ 853.080,72; autorizado R$ 2.309.682,79; gasto R$ 2.098.617,33 | 2026-09_PCMGE015.pdf | p.109 (conferido no PDF em 14/11/2026; antes constava p.106), ação 12.1201.13.392.12.2.2031 | Fixada inicial / Total fixada / Liquidações até mês | fala "previa 853 mil... já gastou 2 milhões e 100" |
| Bandas 2026: R$ 1.188.900,00 | 2026-09_PCMGE015.pdf | ação 2031, elemento 3.3.90.39.94 Serviços de banda ou grupo musical | Liquidações até mês | fala "Só com bandas, 1 milhão e 200" |
| Palco e cenário 2026: R$ 568.001,62 | 2026-09_PCMGE015.pdf | ação 2031, elemento 3.3.90.39.95 Locação, confecção e montagem de cenário | Liquidações até mês | fala "568 mil" |
| Festividades e homenagens 2026: R$ 83.350,00 | 2026-09_PCMGE015.pdf | ação 2031, elemento 3.3.90.39.23 | Liquidações até mês | só na folha (soma das festas 2026 = 1.840.251,62) |
| Bandas 2025 R$ 998.000,00; palco R$ 517.622,25; festividades R$ 82.700,00 | 2025-12_PCMGE015.pdf | ação 2031 (unidades 5.502 e 12.1201), elementos 39.94, 39.95, 39.23 | Liquidações até mês | folha de Festas 2025 |
| Bandas 2024 R$ 886.282,25 (39.18 767.468,25 + 36.04 118.814,00); palco R$ 494.122,16 (39.19) | 2024-12_PCMGE015.pdf | ação 5.502.13.392.5.2.2031 | Liquidações até mês | folha de Festas 2024 |
| Previsto da ação 2031: 2024 R$ 1.177.916,16 (gastou 1.472.176,73); 2025 R$ 1.162.981,18 (gastou 411.150,50 na unid. 5.502 + 1.399.423,22 na 12.1201) | 2024-12 e 2025-12_PCMGE015.pdf | ação 2031 | Fixada inicial / Liquidações | conferência interna |

Pequenos elementos de banda ou cenário fora da função 13 (de R$ 700 a R$ 4.550, em Administração, Saúde, Agricultura e Assistência) ficaram nos seus setores: não dá para saber se são festa.

Pergunta final: assistência social 2026 R$ 1.118.488,41; esporte e lazer 2026 R$ 23.216,39; festas e eventos 2026 R$ 1.840.251,62 (tabela acima).

## Câmara (só nas folhas, não falado)

| Valor exato | Documento | Linha | Onde aparece |
|---|---|---|---|
| 2024: repasse recebido do Executivo (duodécimo) R$ 2.279.462,03; devolução de transferências recebidas (duodécimo) R$ 346.269,77 | 2024-12_CAMARA_PCMGE018.pdf (razão, Contabilis, "MOVIMENTO 14/2024") | contas 4511202010004 e 35112090100 | folha da Câmara 2024 |
| 2025: repasse recebido R$ 3.287.015,93 (creditado até o mês); devolução de transferências R$ 213.026,66 | 2025-12_CAMARA_PCMGE018.pdf (razão SIGA) | 4.5.1.1.2.02 e 3.5.1.1.2.09 | folha da Câmara 2025. O razão também tem débito de R$ 245.694,17 em 4.5.1.2 (transferências recebidas independentes de execução); como não está claro o que foi devolvido, a fala NÃO cita devolução |
| 2026 até set: repasse recebido R$ 2.513.903,76 = 9 x R$ 279.322,64 | 2026-09_CAMARA_PCMGE018.pdf (4.5.1.1.2.02) e 2026-09_PCMGE008.pdf (nota de repasse de set/2026: R$ 279.322,64) | | folha da Câmara 2026 |
| Câmara liquidado: 2024 R$ 2.140.410,72; 2025 R$ 2.828.260,74; 2026 até set R$ 2.440.807,32 | PCMGE015 da Câmara | "Total Geral" / "Total do Poder" | fala e folha |

## O que foi procurado e ficou de fora

- Decisões do TCM (auditorias, denúncias): não consultadas nesta rodada (página com captcha); o vídeo não fala de Tribunal.
- Notícias: o roteiro não cita obra nem serviço, por isso não houve fato de notícia a conferir.
- SUS no Fundo Nacional de Saúde: não conferido (pendência).
- 2024_PCAGO010 (Anexo 11) baixado na 2ª tentativa; não usado.

## Regra 111 (site)

Balanços (PCAGO015) de 2016 a 2025 em `documentos_tcm/` (2016 a 2019 com o título "Balanço orçamentário, conforme definido no MCASP", salvos como AAAA_PCAGO015.pdf).

## Conferência de soma (auditoria Aline, pedidos p239 e p240, 14/11/2026)
- Bandas 2025 R$ 998.000,00 = 155.000,00 (fonte 1500, p. 38) + 51.000,00 (fonte 1701, p. 38) + 520.000,00 (fonte 1500, p. 116) + 272.000,00 (fonte 1701, p. 117), elemento 3.3.90.39.94, ação 2031, Liquidações até mês, 2025-12_PCMGE015.pdf. Link do site: p. 116
- Palco 2025 R$ 517.622,25 = 105.340,00 (fonte 1500, p. 38) + 51.220,00 (fonte 1701, p. 39) + 361.062,25 (fonte 1500, p. 117), elemento 3.3.90.39.95, ação 2031, Liquidações até mês, 2025-12_PCMGE015.pdf (mesma afirmação das bandas).
- Bandas 2024 R$ 886.282,25 = 767.468,25 (3.3.90.39.18) + 118.814,00 (3.3.90.36.04), ação 5.502.13.392.5.2.2031, Liquidações até mês, 2024-12_PCMGE015.pdf. Link do site: p. 34

- Auditoria 15/11 (Antônio, p632): 56.774.331,85 é soma (Prefeitura 54.333.524,53 + Câmara 2.440.807,32), conta refeita e correta; não aparece escrito numa página só (PCMGE015 p.115 + CAMARA p.3 "Total do Poder").
