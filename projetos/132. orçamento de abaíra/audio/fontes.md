# Fontes · 132. orçamento de Abaíra

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-ABAIRA/documentos_tcm/` (PDF e texto extraído). Município ABAÍRA · Prefeitura UJ 607 · Câmara UJ 36. O SAAE de Abaíra (UJ 1072) não tem prestação de contas mensal no e-TCM nesses anos, e o Anexo 9 de 2024 mostra o órgão "03000 SAAE" com gasto zero.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou para mil, abaixo de 1 milhão); abaixo, o valor exato. Último mês entregue em 2026: setembro (10/2026 "Pendente" no e-TCM em 11/11/2026).

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 37.045.567,92 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024, consolidado) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "37 milhões", mapa, chip |
| (conferência) R$ 37.039.779,73 | 2024-12_PCMGE016.pdf (Prefeitura) | "TOTAL" / "Totais:" | Arrecadada até mês + anulada | folha da receita 2024 (linha de ajuste de R$ 5.788,19 ao Balanço) |
| Receita 2025: R$ 41.565.806,02 | 2025_PCAGO015.pdf (Balanço Orçamentário 2025) e 2025-12_PCMGE016.pdf "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA" (p.9) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas / Arrecadado até mês | fala "41 milhões e 600", mapa, chip |
| Receita 2026 até set: R$ 37.192.952,08 | 2026-09_PCMGE016.pdf | p.9, "Totais:" | Arrecadada até mês 37.193.663,42 + anulada -711,34 | fala "37 milhões e 200", mapa, chip |
| FPM 2025: R$ 17.638.067,12 | 2025-12_PCMGE016.pdf | p.3, 1.7.1.1.51 Cota-Parte do FPM | Arrecadado até mês (linha mãe já líquida: dedução do Fundeb de R$ 3.820.732,12 na cota mensal) | fala "17 milhões e 600", mapa |
| SUS 2025: R$ 7.156.788,87 = União R$ 6.884.626,83 + Estado R$ 272.162,04 | 2025-12_PCMGE016.pdf | p.4, 1.7.1.3 e p.7, 1.7.2.3 | Arrecadado até mês (soma refeita 12/11 22:40: confere 7.156.788,87) | fala "7 milhões e 200 para a saúde", mapa |
| Fundeb 2025: R$ 4.952.887,02 | 2025-12_PCMGE016.pdf | p.7, 1.7.5.0 Transferências de Outras Instituições Públicas (Fundeb) | Arrecadado até mês | fala "quase 5 milhões", mapa |
| Complementação da União ao Fundeb 2025: R$ 2.299.489,37 (VAAT 628.983,15 + VAAF 1.670.506,22; VAAR 0,00) | 2025-12_PCMGE016.pdf | p.5, 1.7.1.5 | Arrecadado até mês | fala "2 milhões e 300", mapa |
| Impostos e taxas da cidade 2025: R$ 1.832.473,36 | 2025-12_PCMGE016.pdf | p.1, 1.1.0.0 Impostos, Taxas e Contribuições de Melhoria | Arrecadado até mês | fala "1 milhão e 800", mapa |
| IPTU 2025: R$ 47.394,85 (previsto R$ 160.665,00) | 2025-12_PCMGE016.pdf | p.1, 1.1.1.2.50 | Arrecadado até mês | fala "Só o IPTU, 47 mil", mapa |

Folhas de receita (item a item, soma = total do ano): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (script `scripts/receita.py`; código de cada linha no campo "codigos").

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 36.196.946,70 | 2024_PCAGO015.pdf | p.3, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas (igual ao empenhado e ao pago) | fala "36 milhões e 200" |
| = Prefeitura R$ 34.803.997,65 + Câmara R$ 1.392.949,05 | 2024-12_PCMGE015.pdf p.54 "Total do Poder" (Liquidações até mês; a Câmara vem zerada nesse PDF) e 2024_PCAGO007.pdf (Anexo 9) coluna Legislativa, órgão 01000 CÂMARA MUNICIPAL | | | bate centavo a centavo |
| Sobraram 2024: R$ 848.621,22 (conta própria: 37.045.567,92 - 36.196.946,70) | Balanço 2024 | conta própria | | fala "849 mil" |
| Gastou 2025: R$ 40.350.956,26 | 2025_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas | fala "40 milhões e 400" |
| (conferência) PCMGE015 dez/2025 (com a Câmara): R$ 40.346.260,87 liquidado | 2025-12_PCMGE015.pdf | p.29, "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" | Liquidado no ano | diferença de R$ 4.695,39 para o Balanço, posta em Administração como "ajuste ao Balanço" (no Anexo 9 a maior diferença é na Administração) |
| Sobrou 2025: R$ 1.214.849,76 (conta própria: 41.565.806,02 - 40.350.956,26) | Balanço 2025 | conta própria | | fala "1 milhão e 200" |
| Gastou 2026 até set: R$ 34.849.172,84 = Prefeitura R$ 33.391.641,13 + Câmara R$ 1.457.531,71 | 2026-09_PCMGE015.pdf p.78 "Total do Poder" (a Câmara vem zerada nesse PDF) e 2026-09_CAMARA_PCMGE015.pdf p.3 "Total do Poder" | | Liquidada até mês | fala "34 milhões e 800" |
| Sobraram até set/2026: R$ 2.343.779,24 (conta própria: 37.192.952,08 - 34.849.172,84) | | conta própria | | só na tela |

## Setores (liquidado; setor pela função da ação; script `scripts/setores.py`, resultado `saida/setores.json`)

Mapa: Educação = função 12; Saúde = 10; Administração = 04 (e o ajuste de 2025); Obras e serviços urbanos = 15 (e 17 Saneamento, R$ 37.876,54 só em 2025); Câmara = 01; Dívidas e encargos = 28 (PASEP e parcelas de dívida contratual); Festas e eventos = ação "PROMOÇÃO DE FESTAS POPULARES" (função 13) inteira; Cultura = o resto da função 13 (Lei Aldir Blanc); Assistência social = 08; Agricultura = 20; Esporte e lazer = 27 (só a manutenção do "Departamento de Cultura, Desporto e Lazer", que o município lança na função Desporto e Lazer). Soma dos setores = total do ano, centavo a centavo.

### 2024
- Educação 2024: R$ 11.958.702,20
- Saúde 2024: R$ 9.712.236,10
- Administração 2024: R$ 4.885.851,49
- Obras e serviços urbanos 2024: R$ 4.188.002,47
- Câmara de Vereadores 2024: R$ 1.392.949,05
- Dívidas e encargos 2024: R$ 1.982.422,16
- Festas e eventos 2024: R$ 1.108.900,00
- Cultura 2024: R$ 0,00
- Assistência social 2024: R$ 734.817,11
- Agricultura 2024: R$ 201.266,12
- Esporte e lazer 2024: R$ 31.800,00
### 2025
- Educação 2025: R$ 11.782.350,49
- Saúde 2025: R$ 9.548.573,51
- Administração 2025: R$ 6.139.296,49
- Obras e serviços urbanos 2025: R$ 4.587.195,05
- Câmara de Vereadores 2025: R$ 1.833.594,49
- Dívidas e encargos 2025: R$ 2.793.753,88
- Festas e eventos 2025: R$ 2.065.874,20
- Cultura 2025: R$ 75.414,26
- Assistência social 2025: R$ 1.096.414,13
- Agricultura 2025: R$ 387.852,02
- Esporte e lazer 2025: R$ 40.637,74
### 2026 (até setembro)
- Educação 2026: R$ 9.368.842,61
- Saúde 2026: R$ 10.087.261,48
- Administração 2026: R$ 5.397.800,18
- Obras e serviços urbanos 2026: R$ 3.847.298,96
- Câmara de Vereadores 2026: R$ 1.457.531,71
- Dívidas e encargos 2026: R$ 828.340,07
- Festas e eventos 2026: R$ 1.644.593,58
- Cultura 2026: R$ 64.007,80
- Assistência social 2026: R$ 1.784.839,54
- Agricultura 2026: R$ 341.215,20
- Esporte e lazer 2026: R$ 27.441,71

Zeros e checagens:
- Cultura 2024 = R$ 0,00 fora as festas: no PCMGE015 de dez/2024, a função 13 (Cultura) só tem a ação 2.3202.13.392.7.2.2019 PROMOÇÃO DE FESTAS POPULARES (R$ 1.108.900,00). Procurei "cultur", "aldir", "biblioteca", "patrim" no texto inteiro do PDF: só aparece a manutenção do Departamento de Cultura, Desporto e Lazer, lançada na função 27 (R$ 31.800,00, em Esporte e lazer). Por isso a fala diz "Cultura, fora as festas, nada: tudo foi para a festa".
- Festas e eventos: só a ação de festas populares tem festa/evento no nome nos três anos. Busca por "banda", "palco", "cenário", "show", "evento", "junin", "São João" e "carnaval" em todas as funções: em 2024 e 2025 o PDF não separa bandas e palco (tudo em 3.3.90.39 "Outros serviços de terceiros"); em 2026 aparecem só dentro da ação de festas (bandas 3.3.90.39.94 e palco 3.3.90.39.95). "Benefícios eventuais" (assistência social) não é festa.
- SAAE: UJ 1072 no e-TCM, sem prestação mensal em 12/2024, 12/2025 e 09/2026 (pesquisado em 11/11/2026); Anexo 9 de 2024 com o órgão do SAAE zerado. Não entra em nenhum setor.

## Achados

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Festas 2024: previa R$ 380.086,26, gastou R$ 1.108.900,00 (dotação atualizada R$ 1.350.450,06) | 2024-12_PCMGE015.pdf | p.5, ação 2.3202.13.392.7.2.2019 PROMOÇÃO DE FESTAS POPULARES, "Total do Projeto/Atividade" | Fixada (inicial) / Liquidações até mês | fala "previa 380 mil e gastou 1 milhão e 100" |
| Festas 2025: previa R$ 399.091,00, gastou R$ 2.065.874,20 (dotação atualizada R$ 2.094.313,52) | 2025-12_PCMGE015.pdf | p.3, ação 13.392.0007.2.019 PROMOÇÃO DE FESTAS POPULARES, "TOTAL DA AÇÃO" | Fixado / Liquidado no ano | fala "previa 399 mil e gastou 2 milhões e 100" |
| Festas 2026: previa R$ 1.538.000,00, gastou R$ 1.644.593,58 até set | 2026-09_PCMGE015.pdf | p.9, ação 2.3202.13.392.10.2.2019 | Fixada / Liquidada até mês | fala "a previsão subiu para 1 milhão e 500, e até setembro já foram 1 milhão e 600" |
| Bandas 2026 até set: R$ 979.178,64 = 565.000,00 (fonte 1500) + 414.178,64 (fonte 1701) | 2026-09_PCMGE015.pdf | p.9, elemento 3.3.90.39.94 Serviços de banda ou grupo musical | Liquidada até mês | fala "Só com bandas, 979 mil" |
| Palco e cenário 2026 até set: R$ 626.832,00 | 2026-09_PCMGE015.pdf | p.9, elemento 3.3.90.39.95 Locação, confecção e montagem de cenários, palcos | Liquidada até mês | fala "Com palco e cenário, 627 mil" |
| Assistência social 2025: R$ 1.096.414,13 | 2025-12_PCMGE015.pdf (função 08) = 2025_PCAGO007.pdf (Anexo 9), coluna Assistência Social | | Liquidado | pergunta final "1 milhão e 100" |
| Câmara 2024: recebeu R$ 1.509.412,86, devolveu R$ 117.079,05, gastou R$ 1.392.949,05 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.5, 4.5.0.0.0 Transferências recebidas (saldo final) e 3.5.1.1.2.02 Repasse concedido | Saldo / movimento até o mês | fala "recebeu 1 milhão e 500, gastou 1 milhão e 400 e devolveu 117 mil" |
| Câmara 2025: recebeu R$ 1.834.209,10, devolveu R$ 614,61, gastou R$ 1.833.594,49 | 2025-12_CAMARA_PCMGE018.pdf p.5 (4.5.0.0.0 e 3.5.1.1.2.02) e 2025-12_CAMARA_PCMGE015.pdf "TOTAL DA UNIDADE" | | | fala "recebeu 1 milhão e 800 ... devolveu 615 reais" |
| Câmara 2026 até set: recebeu R$ 1.459.000,00, gastou R$ 1.457.531,71 | 2026-09_CAMARA_PCMGE018.pdf p.5 (4.5.0.0.0) e 2026-09_CAMARA_PCMGE015.pdf p.3 | | | só na tela/folha |

Não usado no vídeo (pendência ou fora do recorte): PCMGE065/066 consolidados de 12/2025 e 09/2026 (a lista de documentos da Prefeitura passa de 500 itens e o baixador não chegou neles; o Balanço e os PCMGE015/016 bastam). Decisões do TCM (pedem captcha): não consultadas, o vídeo não fala do Tribunal.

Narração: Google Chirp 3 HD Algenib, transcrição conferida com o Whisper local (transcricao/transcript.md).

## Conferência de soma (auditoria Aline, pedido p157, 13/11/2026)
- Gastou 2026 até set R$ 34.849.172,84 é soma e não aparece escrito em nenhum PDF: Prefeitura 33.391.641,13 (2026-09_PCMGE015.pdf p. 78, "Total do Poder", coluna Liquidações Até Mês; a Câmara vem zerada nesse PDF, sem dupla contagem) + Câmara 1.457.531,71 (2026-09_CAMARA_PCMGE015.pdf p. 3, "Total do Poder", Liquidações Até Mês) = 34.849.172,84. As duas parcelas foram lidas de novo nos PDFs; links certos. Número e fala sem mudança.

## Conferência de soma (auditoria, pedido p371, 14/11/2026)
| Soma conferida 14/11/2026: sobrou 2025 | R$ 1.214.849,76 = 41.565.806,02 (receita realizada, "SUBTOTAL DAS RECEITAS (III)") − 40.350.956,26 (despesa liquidada, "SUBTOTAL DAS DESPESAS (XI)"), 2025_PCAGO015.pdf. É conta própria: o número não está escrito em nenhum PDF. Link do site: p. 1 (receita; a despesa está na p. 2) | RECEITAS-DESPESAS-ABAIRA/documentos_tcm/2025_PCAGO015.txt linhas 26 e 70 |

| Conferido 14/11/2026: Receita 2025 R$ 41.565.806,02 | Está em 2025_PCAGO015.pdf p.1 ("SUBTOTAL DAS RECEITAS (III)") e em 2025-12_PCMGE016.pdf p.1 (Receitas Correntes) e na linha "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA"; não na p.9. Link do site já religado para p.1 | RECEITAS-DESPESAS-ABAIRA/documentos_tcm/ |
