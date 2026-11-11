# 094. orçamento de paratinga 2018-2024 · fontes (versão 1, 09/11/2026, roteiro v1)

Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/documentos_tcm/` (e-TCM, Consulta Pública, município 291, Prefeitura UJ 895). 2024: `~/Documents/RECEITAS-DESPESAS-PARATINGA/documentos_tcm/` (baixados no 035). Decisões: `.../2018-2024/decisoes/`. Consulta em 09/11/2026.
Regra: "gastou" = LIQUIDADO (regra 32). Receita = total arrecadado declarado (Balanço Orçamentário, "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas).
Conferência 1 (09/11/2026, depois do roteiro): feita linha a linha abaixo. Conferência 2: antes do vídeo final (pendente).

## Receita e gasto por ano (fala, plaquinha, folha, legenda)
| ano | arrecadou (valor exato) | gastou = liquidado (valor exato) | a mais | documento |
|---|---|---|---|---|
| 2018 | 70.623.693,53 | 77.066.164,77 | 6.442.471,24 (conta própria: liquidado − arrecadado) | 2018_PCAGO015.pdf (Anexo 12, Betha; lido por OCR do Mac e conferido com SICONFI DCA 2018) |
| 2019 | 71.212.202,66 | 79.951.758,83 | 8.739.556,17 | 2019_PCAGO015.pdf (fonte embaralhada, lido por OCR; = SICONFI DCA) |
| 2020 | 79.633.500,38 | 82.667.424,67 | 3.033.924,29 | 2020_PCAGO015.pdf (OCR; = SICONFI DCA) |
| 2021 | 91.405.963,04 | 93.649.770,65 | 2.243.807,61 | 2021_PCAGO015.pdf, linhas 27 e 96 (texto) |
| 2022 | 113.388.095,77 | 120.057.247,99 | 6.669.152,22 | 2022_PCAGO015.pdf, linhas 27 e 96 |
| 2023 | 122.661.417,73 | 130.537.365,66 | 7.875.947,93 | 2023_PCAGO015.pdf, linhas 27 e 97 |
| 2024 | 141.827.540,46 | 151.212.427,23 | 9.384.886,77 | 035: 2024_TCM_ANUAL__PCAGO015.pdf |
| soma | 690.752.413,57 | 735.142.159,80 | 44.389.746,23 | conta própria (etiqueta do mapa e legenda) |
Fala do gancho: "Paratinga gastou 151 milhões em 2024" = 151.212.427,23 liquidado.

## Setores falados (liquidado por função; Prefeitura + fundos + Câmara + SAAE)
Fonte: demonstrativo da despesa de dezembro do e-TCM (2018: 2018-12_DESPESA_CONSOLIDADA; 2020: 2020-12_PCMGE065; 2021: 2021-12_PCMGE065; 2022: 2022-12_PCMGE015), coluna "Liquidado até o mês", somado por função (script `2018-2024/scripts/acoes.py`); 2019, 2023, 2024: Anexo 9 (PCAGO007), onde empenhado = liquidado no total do Balanço (2023, 2024) ou igual ao SICONFI DCA liquidado (2019). Câmara (função 01) e SAAE (função 17) de 2021 e 2022 pelo Anexo 9 / DCA (não estão no consolidado).
| ano | Educação (12) | Saúde (10) | Obras e serviços urbanos (15) | Câmara (01) | Administração (04, só tela) |
|---|---|---|---|---|---|
| 2018 | 39.541.045,02 | 12.921.691,73 | 6.854.xxx (conferir: DCA 6.855.009,16) | 2.116.789,13 | 9.649.836,39 |
| 2019 | 44.238.483,80 | 13.480.196,96 | 8.546.671,21 | 2.337.138,25 | 5.051.095,64 |
| 2020 | 37.260.864,88 (2020-12_PCMGE065 linha 824, "Total do Órgão Orçamentário" da Sec. de Educação, coluna liquidado até o mês) | 18.621.983,29 | 8.239.461,25 | 2.449.814,99 | 8.932.232,79 |
| 2021 | 42.659.760,49 (TCM; SICONFI diz 41,95) | 19.956.xxx (TCM; SICONFI 20,67) | 10.487.733,36 | 2.507.114,54 | 11.351.396,18 |
| 2022 | 58.464.368,77 | 21.802.638,09 | 11.492.839,01 | 3.044.263,53 | 16.018.015,17 |
| 2023 | 60.324.450,51 | 25.585.982,06 | 11.232.008,18 | 3.391.289,32 | 17.215.573,17 |
| 2024 | 66.384.616,52 | 35.001.897,28 | 12.430.493,06 | 3.452.274,56 | 20.481.472,82 |
Pendente para a conferência 2: valores exatos marcados "xxx"/"conferir" lidos na imagem da página do PDF.

## Gênesis Inovações Empresariais Ltda (CNPJ 04.490.299/0001-60)
- Fonte: PCMGE056 (relação de processos de pagamento das despesas orçamentárias) de TODOS os meses de 2023 e 2024 (Prefeitura, Fundo de Saúde, Fundo de Educação, Fundo de Assistência), arquivos `MM_AAAA_PCMGE056_N.pdf` e `2023-12_PCMGE056_*.pdf`, `2024-12_PCMGE056.pdf`. Soma do valor BRUTO pago por linha com o CNPJ da empresa: script `2018-2024/scripts/genesis.py`, linhas em `2018-2024/saida/genesis_pagamentos.tsv`.
- 2023: 14.215.240,34 (Educação 7.971.467,22 · Saúde 3.955.138,01 · Prefeitura 2.288.635,11); primeiro pagamento em fev/2023 (jan/2023 sem pagamento). Fala: "14 milhões e 200".
- 2024: 24.181.285,55 (Saúde 9.056.876,62 · Educação 8.913.029,10 · Prefeitura 6.211.379,83). Fala: "24 milhões e 200".
- Serviço (histórico dos pagamentos): "serviços de gestão e execução de atividades hospitalares, ambulatoriais no âmbito do SUS no Hospital Municipal Semirames Alves Brandão"; "serviços continuados de apoio administrativo e operacional" (Fundo de Educação, escolas e creches; Prefeitura). Elementos 3.3.90.34 (terceirização) e 3.3.90.39.
- Comparação 2024 (conta própria): obras 12.430.493,06 + Câmara 3.452.274,56 + assistência social 2.173.449,92 = 18.056.217,54 < 24.181.285,55.
- Antes de 2023: nenhum pagamento à empresa nos PCMGE056/relações de empenho de dezembro de 2018 a 2022 (só dezembro foi conferido nesses anos; por isso a fala não diz "começou em 2023").
- TCM, Decisões › Auditoria: processo 00384e23 (Prefeito e a empresa GENESIS INOVAÇÕES EMPRESARIAIS LTDA), "supostas irregularidades no Pregão Eletrônico nº 065/2022", exercício 2023. Sem deliberação publicada (sistemas/textos/2023/delib/00384e23.odt.pdf devolve 404 em 09/11/2026). Fala: "ainda sem decisão publicada". Arquivo: decisoes/TCM_auditoria_Prefeitura_Paratinga_2026-11-09.txt, linha 33.
- PNCP (consulta 09/11/2026): nenhum contrato da empresa com Paratinga publicado (saida/pncp_genesis.json). Notícias (só conferência interna, não usadas): BNews e Farol da Bahia, out/2026, contratos da empresa com outros municípios.

## Transporte escolar e merenda (ação do programa nacional, liquidado)
| ano | PNATE (transporte escolar) | PNAE (merenda) | documento |
|---|---|---|---|
| 2018 | 2.797.999,00 | 1.029.536,01 | 2018-12_DESPESA_CONSOLIDADA, linhas 632–663 (ação 2.024 e 2.027) |
| 2019 | 2.421.367,49 (OCR) | 672.924,52 (OCR) | 2019-12_DESPESA_CONSOLIDADA.ocr.txt linhas 612–626 |
| 2020 | 714.037,29 | 0,00 na ação (merenda pode estar em outra ação: não usado na fala) | 2020-12_PCMGE065 |
| 2021 | 34.043,00 | 713.410,11 | 2021-12_PCMGE015 |
| 2022 | 3.325.464,47 | 861.016,08 | 2022-12_PCMGE015 |
| 2023 | 1.641.546,99 | 874.632,76 | 2023-12_PCMGE015 linhas 4568 e 4931 |
| 2024 | 1.337.682,98 | 863.730,69 | 035: acoes_2024-12.json (PCMGE015 dez/2024) |
Fala: "2 milhões e 800 em 2018, só 34 mil em 2021, na pandemia, e 1 e 300 em 2024"; "merenda, 1 milhão em 2018 e 860 mil em 2024". A fala diz "na ação do programa nacional": pode haver gasto de transporte em outras ações da Educação.
TCM: nenhum processo de 2018 a 2024 com transporte escolar ou merenda no assunto (lista de auditoria). Há o 19909e26 (pregão 017/2026 de transporte escolar), fora do período.

## Festas x assistência social
- Ação "Manutenção das ações de festas tradicionais, culturais e religiosos" (liquidado): 2018 1.439.475,50 · 2019 990.728,74 (OCR) · 2020 277.030,00 · 2021 121.795,44 · 2022 393.371,06 + 1.064.075,43 (duas ações) = 1.457.446,49 · 2023 1.965.477,02 · 2024 2.646.048,44.
- Assistência social (função 08) 2024: 2.173.449,92 (Anexo 9 2024). Fala: "2 milhões e 600" x "2 milhões e 200".
- Benefícios eventuais (só referência, não usado na fala porque a ajuda pode sair por outra ação): 2021 155.614,00 · 2022 30.966,00 · 2023 0,00 · 2024 0,00.

## Tribunal de Contas (Decisões › Auditoria, Prefeitura de Paratinga, consulta 09/11/2026)
Multas ao gestor (valor do dispositivo da deliberação):
- 00660e19 (2019, denúncia sobre edital): procedente, multa R$ 2.000,00.
- 14863e19 (2019, Pregão Presencial 36/2019): procedente em parte, multa R$ 4.000,00.
- 14566e20 (2020, representação, Pregão 029/2019 e outros, materiais de construção): procedente em parte, multa R$ 8.000,00 (deliberação assinada em 08 e 14/07/2026).
- 15139e21 (2021, Pregão Eletrônico 033/2021): procedente em parte, multa R$ 1.000,00.
- 22991e21 (2017–2018, juros e multas, R$ 208.819,33): procedente em parte, multa R$ 5.000,00.
- 30936e23 (2022, acumulação de cargos): multa R$ 1.000,00.
Advertência: 00945e22 (2020, atraso nas guias previdenciárias).
Improcedentes/arquivados: 02719e22, 05346e23 (bandas 2018: improcedente), 22656e23, 25882e24.
Em análise (sem deliberação publicada): 14551e20 (precatórios do Fundef 2019/2020), 00384e23 (pregão 065/2022, Gênesis), 14960e22, 30711e23, 12148e25, 13898e26, 09318e26, 22920e21 (sigiloso).
Fala: "seis multas, de mil a 8 mil reais, por licitações, juros e multas por atraso e acúmulo de cargos"; "ainda está em análise o uso do dinheiro dos precatórios do Fundef".

## Notícia (pedido do Magno em 09/11/2026: "alguma notícia escandalosa... confirma umas duas, três vezes"; o nome do site vai na TELA, não na fala)
Fala: "E fora das contas: em junho de 2025, a Polícia Federal fez buscas em Paratinga, na Operação Overclean, que apura desvio de dinheiro de emendas parlamentares mandadas para a cidade de 2021 a 2024. O ex-prefeito foi um dos alvos." + "Ser investigado ou estar no tribunal não é condenação."
Tela (selo da fonte): "FONTES: CNN BRASIL E BAHIA NOTÍCIAS · 27/06/2025".
Confirmado em 7 veículos (consulta 09/11/2026):
- CNN Brasil, 27/06/2025 08:25, "STF afasta prefeitos por desvio de emendas; deputado tem sigilo quebrado", https://www.cnnbrasil.com.br/politica/operacao-contra-desvio-de-emendas-afasta-prefeitos-da-bahia/ (lida na íntegra: ex-prefeito de Paratinga "alvo de busca e apreensão"; emendas para Boquira, Ibipitanga e Paratinga "entre 2021 e 2024"; PF com apoio da Receita; autorizada pelo ministro Nunes Marques, STF; "A CNN tenta contato com os demais citados").
- Bahia Notícias, 27/06/2025 08:45, "Prefeitos de Boquira e Ibipitanga são afastados em 4ª fase da Overclean; assessor de Félix e ex-gestor de Paratinga também são alvos", https://www.bahianoticias.com.br/municipios/noticia/45893-... (lida na íntegra: PF, CGU e Receita Federal; 16 mandados; Paratinga entre os municípios).
- Bahia Notícias, 27/06/2025 09:17, "Com ex-prefeito alvo de operação, Paratinga recebeu quase R$ 5 mi em emendas pix no período investigado pela Overclean" (valores calculados pelo próprio site: NÃO usados no vídeo).
- A Tarde, Diário do Nordeste, bahia.ba, Bahia Já, Agência Sertão (todas 27/06/2025, mesma operação, citam Paratinga).
- Nota oficial da PF em gov.br/pf: não localizada pela busca do site em 09/11/2026 (pendência: procurar antes do final).
- O que NÃO entra: nome do ex-prefeito, valores das emendas (cálculo de jornal), afastamento (foi dos prefeitos de Boquira e Ibipitanga, não de Paratinga). Nenhuma resposta do ex-prefeito publicada nas duas matérias; o espaço de resposta fica no aviso da legenda.
- Fora do vídeo (referência): MP-BA, procedimento sobre transporte escolar de Paratinga (portaria de 2026, gestão atual); MPF, inquérito sobre venda de lotes em área da União (out/2025).
- Saiu da fala (vai para a legenda): "No Tribunal, não achei processo sobre transporte escolar ou merenda de 2018 a 2024."
