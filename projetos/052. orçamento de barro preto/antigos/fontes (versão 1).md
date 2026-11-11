# Fontes · 052. orçamento de Barro Preto (BA)
Consulta: 08/11/2026. Fonte principal: e-TCM Consulta Pública (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 140 (listado como "GOVERNADOR LOMANTO JUNIOR", nome antigo), Prefeitura UJ 644 ("Prefeitura Municipal de BARRO PRETO (ex GOV.LOMANTO JUNIOR)"), Câmara UJ 74, SAAE UJ 1028 ("Serviço Autônomo de Água e Esgoto - BARRO PRETO"). IBGE 2903300 "Barro Preto". CNPJ da Prefeitura no Balanço: 14.147.458/0001-82.
Todos os PDFs abertos e conferidos por dentro: município BARRO PRETO e competência certos.
Último mês entregue em 2026: 09/2026 (Prefeitura enviada 26/10/2026 no prazo; Câmara 21/10/2026; SAAE 19/10/2026).
Sistema: Balanços E&L/SIAFIC "CONSOLIDADO MUNICIPIO BARRO PRETO" (já somam Prefeitura + Câmara + SAAE). PCMGE015/016 do SIGA (leitor scripts/acoes015bp.py, conferido centavo a centavo com a soma dos "Total do Órgão").
Pasta: ~/Documents/RECEITAS-DESPESAS-BARRO-PRETO/documentos_tcm/ (abreviada abaixo como DOC/). Linhas = linha do .txt gerado do PDF (pdfplumber) com o mesmo nome.

## Receita ("arrecadou")
- 2024: R$ 49.737.477,66 → DOC/2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário), linha 26 "SUBTOTAL DAS RECEITAS (IV)", coluna Receitas Realizadas → fala "49 milhões e 700 mil" · tela · legenda. Critério: já sem a dedução do Fundeb (no PCMGE016 a coluna "Arrecadada" vem líquida: ICMS 2.904.431,32 com dedução 726.107,55 = 20%).
- 2025: R$ 58.574.741,15 → DOC/2025-13_ANUAL_PCAGO015.pdf linha 27 "SUBTOTAL DAS RECEITAS (IV)", Receitas Realizadas → fala "58 milhões e 600 mil" · tela · legenda. Mesmo critério (confere: Prefeitura DOC/2025-12_PCMGE016.pdf linha 510 "Totais" 58.425.688,07 + SAAE DOC/2025-12_SAAE_PCMGE016.pdf linha 12 149.053,08 = 58.574.741,15).
- Empréstimo 2025: R$ 1.500.000,00 → DOC/2025-12_PCMGE016.pdf linha 413 "2.1.0.0.00.0.0 Operações de Crédito", coluna Arrecadada até Mês (previsão 0,00) → fala "contando um empréstimo de 1 milhão e meio" · tela. Também no Balanço 2025 (Receitas de Capital 1.600.917,27).
- 2026 jan–set: R$ 48.859.141,33 (CONTA PRÓPRIA: soma das unidades, mesmo critério do Balanço) = Prefeitura R$ 48.752.277,52 (DOC/2026-09_PCMGE016.pdf linha 469 "Totais", Arrecadada − Anulada até o mês) + SAAE R$ 106.863,81 (DOC/2026-09_SAAE_PCMGE016.pdf linha 15 "Receitas Correntes", arrecadada até o mês; anulada 0) → fala "48 milhões e 900" · tela · legenda. A Câmara não arrecada (não tem PCMGE016).

## Despesa total ("gastou")
- 2024: R$ 50.758.400,62 → DOC/2024-13_ANUAL_PCAGO015.pdf linha 43 "SUBTOTAL DAS DESPESAS (XIII)", coluna Despesas Empenhadas (= Anexo 9 DOC/2024-13_ANUAL_PCAGO007.pdf linha 877 "Total") → fala "50 e 800". A mais: R$ 1.020.922,96 (linha 28 "DÉFICIT (VII)") → "1 milhão a mais".
- 2025: R$ 54.989.625,21 → DOC/2025-13_ANUAL_PCAGO015.pdf linha 43 "SUBTOTAL DAS DESPESAS (XIII)", Empenhadas (= Anexo 9) → gancho "55 milhões" e fala "Gastou 55 milhões". Sobra (conta própria): 58.574.741,15 − 54.989.625,21 = 3.585.115,94 → "Sobraram 3 milhões e 600".
- 2026 jan–set: liquidado R$ 46.420.680,66 (CONTA PRÓPRIA) = Prefeitura 45.090.058,35 (DOC/2026-09_PCMGE015.pdf, soma dos 11 "Total do Órgão", coluna Liquidações Até Mês; a Câmara e o SAAE aparecem ali com 0 executado) + Câmara 1.219.253,40 (DOC/2026-09_CAMARA_PCMGE015.pdf linha 96 "Total do Órgão", Liquidações Até Mês) + SAAE 111.368,91 (DOC/2026-09_SAAE_PCMGE015.pdf linha 39 "Total da Unidade", Liquidações Até Mês) → "46 e 400".
- 2026 empenhado ("já se comprometeu"): R$ 59.819.972,90 (CONTA PRÓPRIA) = Prefeitura 57.983.992,46 (soma dos "Total do Órgão", Empenhos Até Mês) + Câmara 1.701.375,44 (linha 96) + SAAE 134.605,00 (linha 39) → "59 milhões e 800".
- 2026 comprometido além do arrecadado (só na tela, torre vermelha): 59.819.972,90 − 48.859.141,33 = 10.960.831,57 (CONTA PRÓPRIA) → tela "R$ 11 MI COMPROMETIDOS A MAIS".
- 2025 sobra (tela): "R$ 3,6 MI SOBRARAM · CONTANDO O EMPRÉSTIMO" (mesma conta da fala).

## Despesa por setor (uma linha por número dito)
### 2024: DOC/2024-13_ANUAL_PCAGO007.pdf (Anexo 9, bloco final de totais do município, linhas 851–877) → empenhado. Confere com a soma das ações do DOC/2024-12_PCMGE015.pdf + Câmara + SAAE.
- Educação: R$ 25.340.268,59 (linha 859) → "25 e 300"
- Saúde: R$ 9.697.230,75 (linha 249 / bloco final) → "9 e 700"
- Administração: R$ 9.718.280,91 (linha 851) → "9 e 700" (inclui R$ 2.918.993 de salários da Secretaria de Infraestrutura, ação 16.1601.4.122.1.2.2005)
- Obras de rua e iluminação (função 15 Urbanismo): R$ 195.689,29 (linha 862) → "196 mil" (= pavimentação de vias 138.281,08 + iluminação 57.408,21)
- Câmara de Vereadores: R$ 1.400.239,13 (linha 468; = DOC/2024-12_CAMARA_PCMGE015.pdf linha 101) → "1 e 400"
- Dívidas (Encargos Especiais): R$ 1.897.610,44 (linha 875) → "1 e 900"
- Cultura: R$ 70.356,00 (linha 784, órgão 18 Sec. de Desenvolvimento Econômico, salários) → "70 mil"
- Assistência social: R$ 1.953.777,81 (linha 323) → "1 milhão e 950 mil"
- Água e saneamento (SAAE): R$ 135.874,53 (linha 28) → "136 mil"
- Agricultura (função 20): R$ 0,00 (função não aparece no Anexo 9; no PCMGE015 12/2024 as ações da função 20 têm empenhado 0: PRONAF, barragens e poços, produção rural, infraestrutura produtiva etc., dotação inicial somada R$ 255 mil). A Secretaria de Agricultura só empenhou R$ 97.301,74 de salários e diárias na função Administração (ação 17.1701.4.122.1.2.2016) → "zero em programas: a secretaria só pagou salários"
- Esporte (Desporto e Lazer): R$ 66.506,46 (linha 874) → "67 mil"
- Meio ambiente (Gestão Ambiental): R$ 282.566,71 (linha 865) = ação 16.1601.18.543.10.1.1073 "PROGRAMA DE URBANIZAÇÃO DO BONFIMZÃO" 282.566,71 (DOC/2024-12_PCMGE015.pdf) → "283 mil, tudo na urbanização do Bonfimzão"
### 2025: DOC/2025-13_ANUAL_PCAGO007.pdf (Anexo 9, bloco final) → empenhado
- Educação: R$ 27.386.083,45 (linha 847) → "27 e 400"
- Saúde: R$ 10.378.416,99 (linha 245) → "10 e 400"
- Administração: R$ 10.609.986,35 (linha 839) → "10 e 600" (inclui o São João, 545.178,60)
- Obras de rua e iluminação (Urbanismo): R$ 63.075,59 (linha 850) → "63 mil" (só iluminação)
- Câmara: R$ 1.800.337,42 (linha 461; = DOC/2025-12_CAMARA_PCMGE015.pdf linha 13) → "1 e 800"
- Dívidas: R$ 2.223.082,55 (linha 863) → "2 e 200"
- Cultura: R$ 114.250,31 (linha 773) → "114 mil"
- Assistência social: R$ 2.018.722,77 (linha 318) → "2 milhões"
- Água e saneamento (SAAE): R$ 143.857,61 (linha 27) → "144 mil"
- Agricultura: R$ 0,00 em programas (ações da função 20 com empenhado 0 no DOC/2025-12_PCMGE015.pdf; secretaria: salários R$ 138.904,41 na Administração, ação 2016) → "zero em programas"
- Esporte: R$ 43.743,00 (linha 862) → "44 mil"
- Meio ambiente: R$ 208.069,17 (linha 853; = urbanização do Bonfimzão) → "208 mil"
### 2026 jan–set: DOC/2026-09_PCMGE015.pdf (soma das ações por função, coluna Liquidações Até Mês) + Câmara + SAAE
- Educação: R$ 22.881.407,55 → "22 e 900"
- Saúde: R$ 9.186.396,98 (= "Total do Órgão" da Secretaria de Saúde) → "9 e 200"
- Administração: R$ 8.114.945,15 → "8 e 100"
- Obras de rua e iluminação (Urbanismo): R$ 671.636,41 → "672 mil" (praças 591.675,91 + pavimentação 79.947,23 + iluminação 13,27)
- Câmara: R$ 1.219.253,40 (DOC/2026-09_CAMARA_PCMGE015.pdf linha 96) → "1 e 200"
- Dívidas: R$ 1.256.593,13 (ação 109.901.28.843.15.2.2066 Amortização) → "1 e 300"
- Cultura: R$ 1.019.837,06 (Festejos Juninos 811.883,45 + Fomento às manifestações culturais 207.953,61) → "1 milhão" e "já passa de 1 milhão"
- Assistência social: R$ 1.396.356,80 (= "Total do Órgão" da Assistência) → "1 e 400"
- Água e saneamento (SAAE): R$ 111.368,91 (DOC/2026-09_SAAE_PCMGE015.pdf linha 39) → "111 mil"
- Agricultura: R$ 0,00 em programas (ações da função 20, liquidado 0; secretaria: salários R$ 116.607 na Administração, ação 111.1101.4.122.1.2.2078) → "zero em programas"
- Esporte: R$ 61.070,00 (ação 811.8.2.2025) → "61 mil"
- Meio ambiente: R$ 440.165,27 (= urbanização do Bonfimzão, ação 110.1001.18.543.10.1.1033) → "440 mil"
- Não dito: Trabalho R$ 61.650,00 (salários da Sec. de Desenvolvimento Econômico).

## Achados
- Eventos culturais 2024 na Educação: R$ 1.056.299,57 → DOC/2024-12_PCMGE015.pdf, ação 4.401.12.392.18.2.2087 "FOMENTO AS MANIFESTAÇÕES E ATIVIDADES CULTURAIS" (função 12 Educação, subfunção 392 Difusão Cultural), empenhado → "1 milhão e 56 mil de eventos culturais foram lançados dentro da conta da educação" · tela.
- São João 2025: R$ 545.178,60 → DOC/2025-12_PCMGE015.pdf, ação 4.401.4.392.18.2.2170 "Realizações dos Festejos Juninos" (função 04 Administração), dotação inicial 0,00, dotação atualizada 545.178,60, empenhado 545.178,60 → "o São João custou 545 mil, lançados na administração. E ele não estava no orçamento: a linha foi criada depois" · tela · capa? · legenda.
- Eventos culturais 2025 (Educação): R$ 313.392,52 (ação 4.401.12.392.18.2.2087). Festas 2025 somadas (conta própria): 545.178,60 + 313.392,52 = 858.571,12 → "859 mil".
- Cultura 2024 "no nome": R$ 70.356,00 (Anexo 9) → "No nome, ela levou 70 mil".
- 2026: Festejos Juninos R$ 811.883,45 (ação 106.603.13.392.8.2.2023) + Fomento R$ 207.953,61 (ação 106.603.13.392.8.2.2024), função 13 Cultura → "a festa foi para a conta da cultura: já passa de 1 milhão".
- Pavimentação 2025: R$ 0,00 → DOC/2025-12_PCMGE015.pdf ação 16.1601.15.452.24.2.2047 "CONSTRUÇÃO E PAVIMENTAÇÃO DE VIAS PÚBLICAS" (inicial 595.000,00; atualizada 5.000,00; empenhado 0,00) → "a conta de pavimentação de vias gastou zero".
- Praças 2025: R$ 0,00 → ação 16.1601.15.452.24.2.2050 "REFORMA E/OU CONSTRUÇÃO DE PRAÇAS, JARDINS E PONTES" (inicial 822.000,00; empenhado 0,00) → "A de praças e jardins, zero".
- Praças 2026: R$ 591.675,91 liquidado → DOC/2026-09_PCMGE015.pdf ação 110.1001.15.452.14.2.2077, elemento 4.4.90.51.99 "OUTRAS OBRAS E INSTALAÇÕES", fonte 1754 (Recursos de Operações de Crédito, código 754 da tabela de fontes da STN usada pelo TCM-BA; o PDF só traz o código) → "592 mil numa ação de praças, jardins e pontes, paga com dinheiro de empréstimo". Pavimentação 2026: R$ 79.947,23 (ação 2074).
- Checagem de notícias (08/11/2026): busca na web não achou notícia sobre obras de pavimentação em 2025. Em 2026 aparecem avisos de licitação da prefeitura (Diário Oficial da União, via alertalicitacao.com.br): calçamento da Avenida Rivaldo Jovita (abertura 28/07/2026), reforma e ampliação da Feira Livre (convênio 0110/2026, sessão 12/05/2026) e conclusão de escola no bairro Belo Monte (convênio estadual 30111, Concorrência 8/2026). Por isso a fala não diz que não houve obra: diz só o que as contas de 2025 mostram e o que foi pago em 2026 até setembro. Link: https://alertalicitacao.com.br/!licitacao/DOU-057cc956760d7e14cf61 · https://alertalicitacao.com.br/!licitacao/DOU-f5aab52b792766748a8d (consultados por busca em 08/11/2026).

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, Prefeitura de Barro Preto, consulta 08/11/2026, https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/)
Sem decisão publicada (deliberação e voto não encontrados em tcm.ba.gov.br/sistemas/textos/<ano>/delib|voto/<processo>.odt.pdf, todos 404):
- 06072e25 · Denúncia · "Supostas irregularidades na contratação de empresa para evento, no exercício financeiro de 2025" (denunciados: o prefeito e uma empresa de estruturas e produções artísticas) → "contratação de uma empresa para evento em 2025".
- 30519e26 · Denúncia · "Supostas irregularidades no pagamento da locação pelo valor integral e pagamento do combustível, com recursos do FUNDEB 30% e do MDE 25%, nos exercícios financeiros de 2023 a 2025" → "aluguel e combustível pagos com dinheiro da educação, de 2023 a 2025".
- 22051e26 · Denúncia · "Supostas irregularidades em contratações de serviços jurídicos" (2026; aparece também na página de medida cautelar, com o campo Decisão vazio) → "serviços jurídicos".
- 22926e25 · Tomada de Contas Especial · "pagamento de subsídios; despesa com juros e multa por atraso no pagamento de contribuições previdenciárias" (exercício 2021) → "juros por atraso na previdência".
Na fala e na tela, sem nome de pessoa nem de empresa.
