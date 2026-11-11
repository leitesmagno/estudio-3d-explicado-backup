# Fontes: 065. orçamento de Luís Eduardo Magalhães (BA)

Consulta: 08/11/2026. Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-LUIS-EDUARDO-MAGALHAES/documentos_tcm/` (abaixo, DOC/).
Todos baixados do e-TCM (Consulta Pública, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 235 "LUÍS EDUARDO MAGALHÃES", Prefeitura (UJ 839) e Câmara (UJ 268). Sem autarquia, instituto de previdência ou empresa com conta própria (o Anexo 9 só lista Câmara, Prefeitura e fundos; "Reserva do RPPS" zerada no Balanço; função 09 Previdência zerada).
Conferência automática: `scripts/conferir.py` (51 de 51 valores achados no texto dos PDFs, 1ª conferência em 08/11/2026).

## Documentos
- DOC/2024-13_ANUAL_PCAGO015.pdf: Balanço Orçamentário 2024 (Anexo 12, prestação anual 2024).
- DOC/2024-13_ANUAL_PCAGO007.pdf: Anexo 9 de 2024 (despesa por órgão e função, com a Câmara). PCAGO004 (Anexo 6), PCAGO008 (Anexo 10), PCAGO012 (Anexo 16, dívida fundada interna).
- DOC/2025-13_ANUAL_PCAGO015.pdf, PCAGO007, PCAGO004, PCAGO008, PCAGO011, PCAGO012: os mesmos de 2025 (processo 10369e26).
- DOC/2024-12_PCMGE015.pdf e PCMGE016 (Prefeitura, dez/2024, SIGA); DOC/2025-12_PCMGE015.pdf e PCMGE016 (dez/2025).
- DOC/2026-09_PCMGE015.pdf e PCMGE016 (Prefeitura, set/2026, último mês entregue, enviado em 03/11/2026); DOC/2026-09_PCMGE065.pdf e PCMGE066 (consolidados do município, com a Câmara).
- DOC/2024-12_CAMARA_PCMGE015.pdf, 2025-12_CAMARA_PCMGE015.pdf, 2026-09_CAMARA_PCMGE015.pdf (Câmara; digitalizados, totais lidos no texto do OCR).
- Conferido: soma das funções do Anexo 9 = Balanço, centavo a centavo (2024: 918.330.848,46; 2025: 1.017.926.957,11). PCMGE015 dez/2024 da Prefeitura (883.981.521,69) + Câmara (34.349.326,77) = Balanço 2024. Em 2025 o PCMGE015 dez da Prefeitura (979.915.875,77) fica 9.237,52 acima do Anexo 9 sem a Câmara (979.906.638,25): para ano fechado vale o Balanço/Anexo 9. 2026: Prefeitura 766.018.493,27 + Câmara 32.291.693,50 = 798.310.186,77 (= "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" do PCMGE065, liquidado).

## Crescimento da cidade (fala)
- IBGE, Censo 2022, tabela SIDRA 4709 (https://apisidra.ibge.gov.br/values/t/4709/n6/2919553/v/93,10605/p/all): população 107.909 (2022); taxa de crescimento geométrico 5,00% ao ano, a MAIOR entre os 417 municípios da Bahia (consulta de todos os municípios da BA na mesma tabela, 08/11/2026; 2º lugar Nordestina, 3,3%). População 2010: 60.105 (tabela 202). → fala "a cidade que mais cresceu na Bahia", "Em 12 anos, a população quase dobrou. De 60 mil para 108 mil moradores, segundo o IBGE." Contexto: BNews, "Censo IBGE: população cai em 54,9% dos municípios baianos; LEM foi o que mais cresceu", https://www.bnews.com.br/noticias/cidades/censo-ibge-populacao-cai-em-549-dos-municipios-baianos-lem-foi-o-que-mais-cresceu.html

## V3 (09/11/2026): molde Ubaitaba, GASTOU = LIQUIDADO (regra 32), sem tarifa bancária (regra 60)
Roteiro v3 abre pela receita dos três anos; sem o trecho do IBGE na fala (o crescimento continua anotado acima, só como contexto). Versões antigas do fontes.md: antigos/ e ~/Documents/FONTES/versões antigas/.

## Totais (fala e tela)
- Abertura e anos: arrecadou 922.679.193,21 (2024) / 978.296.118,00 (2025) → Balanços, "SUBTOTAL DAS RECEITAS (III)"; 786.883.171,06 (2026 até set.) → PCMGE016 "Totais", Total Até Mês (= PCMGE066). Receita = total do documento (critério igual nos três anos, ver nota do Fundeb na v1).
- 2024 empréstimo dentro da receita: 95.720.287,72 (Caixa: Anexo 10 l. 1158 + l. 1160) → fala "Desse total, 95 milhões e 700 foram empréstimo da Caixa".
- 2024 gastou 909.727.283,94 → DOC/2024-13_ANUAL_PCAGO015, "SUBTOTAL DAS DESPESAS (XI)", coluna DESPESAS LIQUIDADAS → fala "909 milhões e 700". Confere: PCMGE015 dez/2024 da Prefeitura, liquidado 879.416.814,33 + Câmara 30.310.469,61 = 909.727.283,94.
- 2024 sobra 922.679.193,21 − 909.727.283,94 = 12.951.909,27 (conta própria, receita x liquidado) → fala "Sobraram 13 milhões".
- 2025 empréstimo: 44.000.000,00 (Anexo 10 2025 l. 791, CEF Avançar Cidades) → fala "Desse total, 44 milhões foram empréstimo da Caixa".
- 2025 gastou 1.006.141.151,93 → DOC/2025-13_ANUAL_PCAGO015, "SUBTOTAL DAS DESPESAS (XI)", LIQUIDADAS → fala "1 bilhão e 6 milhões". Confere: Prefeitura 970.070.194,15 + Câmara 36.070.957,78.
- 2025 a mais: 1.006.141.151,93 − 978.296.118,00 = 27.845.033,93 (conta própria) → fala "27 milhões e 800 a mais do que arrecadou". (O "Défit" de 39.630.839,11 do Balanço é pelo empenhado; não é dito na v3.)
- 2026 até set.: empréstimo 80.000.000,00; gastou 798.310.186,77 (liquidado, PCMGE065 TOTAL GERAL); comprometeu (empenhado) 931.386.303,49 → fala "já se comprometeu com 931 milhões e 400" (empenhado chamado de comprometido, regra 32).

## Setores (função, LIQUIDADO; 2024 e 2025 = soma das ações do PCMGE015 de dezembro da Prefeitura + PCMGE015 da Câmara; 2026 = PCMGE015 set/2026 + Câmara)
Conta própria: soma das funções = total liquidado de cada ano, centavo a centavo. Câmara (PDF digitalizado, lido pela imagem: saida/camara_leitura_imagem.md): 30.310.469,61 / 36.070.957,78 / 32.291.693,50.
- Educação (12): 266.652.xxx / 310.345.xxx / 222.254.250,07 → "266 e 700" / "310 e 300" / "222 e 300".
- Saúde (10): 187.758.xxx / 233.467.xxx / 171.475.924,88 → "187 e 800" / "233 e 500" / "171 e 500".
- Administração (04): 52.805.xxx / 65.418.xxx / 51.842.431,73 → "52 e 800" / "65 e 400" / "51 e 800".
- Obras e serviços urbanos (15 + 17 + 25): 254.627.xxx / 206.958.xxx / 174.958.802,77 → "254 e 600" / "207 milhões" / "175 milhões".
- Câmara (01): 30.310.469,61 / 36.070.957,78 / 32.291.693,50 → "30 e 300" / "36 e 100" / "32 e 300".
- Dívidas e juros (28): 35.112.435,19 / 63.969.966,43 / 62.823.626,57 → "35 e 100" / "64 milhões" / "62 e 800".
- Cultura e festas (13): 16.239.xxx / 24.905.xxx / 22.363.795,06 → "16 e 200" / "24 e 900" / "22 e 400".
- Assistência social (08): 23.190.xxx / 23.682.xxx / 16.032.268,67 → "23 e 200" / "23 e 700" / "16 milhões".
- Esporte (27): 10.107.420,47 / 7.372.183,32 / 8.002.026,61 → "10 e 100" / "7 e 400" / "8 milhões".
- Meio ambiente (18): 4.195.897,84 / 4.809.621,13 / 3.813.638,77 → "4 e 200" / "4 e 800" / "3 e 800".
- Valores exatos de cada setor nas folhas por setor (saida/folha-pdf/config-setores.json), cada folha somando o valor falado.

## Pessoal e Câmara x esporte e meio ambiente (2025)
- Salários e encargos 2025, com a Câmara: 384.356.668,53 → DOC/2025-13_ANUAL_PCAGO015, "Pessoal e Encargos Sociais", despesas LIQUIDADAS → fala "384 milhões e 400".
- Câmara 2025: 36.070.957,78 (acima) → fala "Só a Câmara gastou 36 milhões e 100".
- Esporte + meio ambiente 2025: 7.372.183,32 + 4.809.621,13 = 12.181.804,45; 36.070.957,78 ÷ 12.181.804,45 = 2,96 (conta própria) → fala "Quase o triplo de esporte e meio ambiente juntos".

## Duodécimo da Câmara (folha da Câmara)
- 2024: DOC/2024-13_CAMARA_PCAGE062.pdf (Demonstrativo do Fluxo Financeiro, Câmara de Luís Eduardo Magalhães, exercício 2024).
- 2025: DOC/2025-13_CAMARA_PCAGE062.pdf: "Recebimento de Duodécimo" 40.469.349,60; "Devolução de Duodécimo" 2.440.000,00; despesas orçamentárias 36.070.957,78.
- 2026 até set.: DOC/2026-09_CAMARA_PCMGE018.pdf (razão da Câmara, set/2026).
- Valores exatos usados nas folhas: saida/params-setores.json (gerado por tools/lista_pdf/atualiza_params.py).

## Empréstimos (achado principal)
- 2024: 95.720.287,72 → DOC/2024-13_ANUAL_PCAGO015 ("Operações de Crédito", receitas realizadas; previsão 54 mi) e Anexo 10 (DOC/2024-13_ANUAL_PCAGO008, l. 1158 "Operação de Crédito CEF-AVANÇAR CIDADES (Infraestrutura Urbana)" 70.720.287,72 + l. 1160 "Operação de Crédito FINISA c/ CEF_Infra-estrutura Contrato nº 0616096-00" 25.000.000,00) → v3: dito no bloco de 2024 e somado no "quase 220 milhões".
- 2025: 44.000.000,00 → DOC/2025-13_ANUAL_PCAGO015 e Anexo 10 2025, l. 791 "Operação de Crédito CEF-AVANÇAR CIDADES (Infraestrutura Urbana)" → v3: dito no bloco de 2025.
- 2026 até set.: 80.000.000,00 (acima) → v3: dito no bloco de 2026 (o relatório não diz o banco).
- Gancho "quase 220 milhões desde 2024": 95.720.287,72 + 44.000.000,00 + 80.000.000,00 = 219.720.287,72 (conta própria).
- Para onde foi: fonte de recurso 1754 ("Recursos de Operações de Crédito") por ação, conta própria (`scripts/explora2.py`): 2024 96,32 mi (80,23 "Paviment., drenagem, mobilidade e urbanismo em div. ruas", 11,63 "Execução de obras e serviços de paisagismo, urbanismo e praças", 4,40 "Pavimentação, drenagem, urbanização e recuperação de vias"); 2025 44,00 mi (39,73 + 3,04 + 1,23 nas mesmas ações); 2026 até set. 79,29 mi liquidado (43,09 paisagismo/urbanismo/praças, 19,73 e 16,47 pavimentação/drenagem). → fala "Quase todo esse dinheiro foi para as contas de pavimentação, drenagem, urbanismo e praças."
- Dívida fundada interna no fim de 2025: 260.407.021,29 (DOC/2025-13_ANUAL_PCAGO012, "TOTAIS", saldo atual; inclui CEF, Desenbahia, INSS parcelado e precatórios) → não dito na fala (reserva para legenda/tela, se usado).
- Notícias (08/11/2026): nenhuma notícia achada sobre os empréstimos de 2026 (buscas "Luís Eduardo Magalhães empréstimo Caixa", "Avançar Cidades LEM"). Contexto antigo: Jornal Grande Bahia, LEM único da Bahia no Avançar Cidades (contrato de 2018), https://jornalgrandebahia.com.br/?p=703729 → não dito. Obras federais na cidade (acostamento da BR-242, DNIT, Bahia Notícias, https://www.bahianoticias.com.br/municipios/noticia/51179-dnit-abre-licitacao-para-construcao-de-acostamento-na-br-242-em-luis-eduardo-magalhaes) → não atribuídas à prefeitura, não ditas.

## Parcelas e juros de dívidas
- 2024: amortização 14.281.669,76 + juros e encargos 20.830.765,43 = 35.112.435,19 → DOC/2024-13_ANUAL_PCAGO015 ("Amortização da Dívida", "Juros e Encargos da Dívida", empenhadas) = função 28 do Anexo 9 (liquidado = empenhado) → v3: dito como setor "Dívidas e juros" de 2024.
- 2025: 44.524.094,54 + 19.445.871,89 = 63.969.966,43 → DOC/2025-13_ANUAL_PCAGO015 = função 28 → fala "64 milhões em 2025".
- 2026 até set.: 62.823.626,57 → DOC/2026-09_PCMGE015, ação 2.2050.28.843.601.2.2010 "ENCARGOS GERAIS DO MUNICÍPIO", "Total do Projeto/Atividade", liquidada até o mês (elementos 4.6.90: 40,18 mi; 3.2.90: 22,65 mi) → fala "Em 2026, só até setembro, 62 milhões e 800".
- (v1) "Quase quatro vezes a assistência": saiu da fala na v3.
- Fecho "mais de 60 milhões por ano": 63,97 (2025) e 62,82 (só até set/2026).

## Festas x assistência social
- Ação 2.2070.13.392.505.2.2030 "GESTÃO DAS AÇÕES DE APOIO ÀS FESTAS CÍVICAS, POPULARES, RELIGIOSAS E C..." → DOC/2026-09_PCMGE015, "Total do Projeto/Atividade": fixada (dotação inicial) 15.960.000,00; liquidada até o mês 21.328.632,65 → fala "começou 2026 com quase 16 milhões previstos. Até setembro, já gastou 21 milhões e 300."
- Assistência social 2026 até set.: 16.032.268,67 (função 08 inteira, soma das ações, liquidado; conta própria) → "Mais que toda a assistência social, que ficou em 16 milhões." Procurado fora da função 08: só "Bolsa estudantil" (Educação, 54.745,49), CAPS e assistência farmacêutica (Saúde), que não são assistência social; mesmo somando a bolsa, 16,09 < 21,33.
- Mesma ação em anos anteriores (não dito): 2024 14.660.450,25 (previsto 5.950.140,00; DOC/2024-12_PCMGE015); 2025 23.252.922,67 (previsto 17.054.000,00; DOC/2025-12_PCMGE015), mais "Festa de aniversário da cidade" 610.800,00 em 2025. Festas fora da Cultura: "Gestão das ações do Bahia Farm Show" (função 04: 534.900,00 / 550.000,00 / 770.700,00) e "Apoio a eventos dos setores de comércio, indústria, agronegócios" (função 23) → não somados nem ditos.
- Notícias: Arraiá de LEM 2025 com público recorde (Bahia Notícias, https://www.bahianoticias.com.br/municipios/noticia/45978-arraia-de-luis-eduardo-magalhaes-bate-recorde-de-publico-com-100-mil-pessoas-na-ultimo-noite) → contexto, não dito. A fala não diz que a ação paga o Arraiá.

## Tribunal de Contas
TCM-BA › Decisões › Auditoria, município LUIS EDUARDO MAGALHÃES (https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/, consulta 08/11/2026 15:35, 106 processos listados; lista dos de 2024 a 2026 em `decisoes/lista_processos.txt`).
- 26589e24 (Denúncia da empresa Potencial Estrutura e Eventos Ltda contra o Pregão Eletrônico nº 055/2024: produção, locação de equipamentos audiovisuais, de luz e som, elementos decorativos): julgada em 05/08/2025, publicada no DOE de 08/08/2025, "no mérito, pela sua improcedência" (DOC/../decisoes/2024_delib_26589e24.odt.pdf, https://www.tcm.ba.gov.br/sistemas/textos/2024/delib/26589e24.odt.pdf) → fala "uma denúncia de 2024 sobre a estrutura de eventos foi julgada improcedente".
- 17199e26 (Denúncia: "Supostas irregularidades em contratações de atrações artísticas para o evento oficial do Município de Luís Eduardo Magalhães, denominado Arraiá de LEM 2026"): sem data de julgamento nem decisão no detalhe → fala "as contratações de atrações do Arraiá de 2026 também viraram denúncia. Ainda sem julgamento."
- Outros (não ditos): 32298e25 Natal LEM 2025 (sem julgamento); licitações de material escolar, uniformes, saúde, obras (em análise ou julgadas com provimento parcial/não conhecimento). Sem nomes no vídeo.

## 2ª conferência (antes do vídeo final, 08/11/2026)
- Texto de todos os PDFs extraído de novo (saida/conf2/): `scripts/conferir2.py` achou 51 de 51 valores. Ações do PCMGE015 09/2026 idênticas (201 ações; liquidado 766.018.493,27); assistência social 2026 = 16.032.268,67; festas (ação 2030) previsto 15.960.000,00, liquidado 21.328.632,65.
- Decisões do TCM (26589e24 improcedente; 17199e26 sem julgamento) e IBGE conferidos de novo. Notícias de novo (08/11/2026): nada novo sobre empréstimos, festas ou as denúncias; notícias antigas de outra gestão (empréstimo Desenbahia de 2012, Bahia Notícias) não usadas.
