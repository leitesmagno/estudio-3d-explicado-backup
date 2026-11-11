# Fontes · 071. orçamento de Itamaraju (BA)

Consulta: 08/11/2026 (e-TCM, Consulta Pública: município ITAMARAJU; Prefeitura UJ 790, Câmara UJ 219; sem autarquia com conta própria: o Anexo 9 tem só Câmara, Prefeitura, Fundo de Saúde e Fundo de Assistência).
Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-ITAMARAJU/documentos_tcm/` (abreviada abaixo como `doc/`). Texto extraído com pdfplumber (`.txt` ao lado de cada PDF). Conferência automática: `scripts/conferir071.py` (50 de 50 valores achados em 08/11/2026).
Endereço de cada documento: https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam (prestação de contas → documento); cada PDF tem código de validação em https://e.tcm.ba.gov.br/epp/validaDoc.seam.

Formato: valor exato → arquivo → linha → coluna → onde aparece.

## Receita (arrecadou)
- 2024: R$ 284.105.556,55 → doc/2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024) → linha 24 "SUBTOTAL DAS RECEITAS (III)" → Receitas Realizadas → fala (abertura e 2024, "284 milhões" / no bloco do ano "arrecadou" está implícito), folha de receita 2024.
  - Obs.: o PCMGE016 de 12/2024 traz 284.155.200,45 (diferença de 49.643,90, quase toda no ISS). Vale o Balanço (ano fechado).
- 2025: R$ 304.356.025,90 → doc/2025-13_ANUAL_PCAGO015.pdf → linha 24 → Receitas Realizadas → fala ("304", "304 milhões e 400"), folha 2025. Igual ao PCMGE016 12/2025 (Totais, linha 544).
- 2026 até setembro: R$ 231.922.829,77 → doc/2026-09_PCMGE016.pdf → linha 494 "Totais:" → Total até o mês (arrecadada − anuladas) → fala ("231 milhões e 900"), folha 2026. Igual ao consolidado doc/2026-09_PCMGE066.pdf linha 824.

## Despesa total (gastou)
- 2024: R$ 297.215.005,72 → doc/2024-13_ANUAL_PCAGO015.pdf → linha 86 → Despesas Empenhadas → fala "297 milhões e 200". Déficit R$ 13.109.449,17 → mesma folha, linha 33 "Défit (VI)" → fala "13 milhões e 100 a mais… o próprio balanço chama isso de déficit".
- 2025: R$ 286.221.216,81 → doc/2025-13_ANUAL_PCAGO015.pdf → linha 90 → Empenhadas → fala "286 milhões e 200". Superávit R$ 18.134.809,09 → linha 99 → fala "sobraram 18 milhões e 100".
- 2026 até setembro (liquidado): R$ 236.725.008,75 → doc/2026-09_PCMGE065.pdf (consolidado) → linha 2646 "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" → Liquidado até o mês → fala "236 milhões e 700". = Prefeitura R$ 229.425.031,08 (doc/2026-09_PCMGE015.pdf linha 5885 "Total do Poder", liquidado) + Câmara R$ 7.299.977,67 (doc/2026-09_CAMARA_PCMGE015.pdf linha 127, liquidado). Diferença com o arrecadado: 4.802.178,98 (conta própria) → fala "4 milhões e 800 a mais".
- 2026 empenhado: R$ 253.500.978,94 → doc/2026-09_PCMGE065.pdf linha 2646 → Empenhado até o mês → fala "253 milhões e 500".

## Setores (Anexo 9 = soma das ações do Anexo 6, centavo a centavo; 2026 = soma das ações do PCMGE015 09/2026, liquidado)
Regra dos setores (conta própria, `scripts/setores071.py` → `saida/setores.json`): Obras e serviços urbanos = funções 15 Urbanismo + 25 Energia (iluminação) + 26 Transporte. Cultura e festas = função 13 + a ação de festejos de 2024 que estava na função 12. Fora da fala ("outros"): 02 Judiciária (procuradoria), 06 Segurança, 11 Trabalho, 23 Comércio e serviços (orla da lagoa). Setores + outros = total do ano, diferença 0,00.

### 2024 (doc/2024-13_ANUAL_PCAGO007.pdf, Anexo 9, coluna Total; ações em doc/2024-13_ANUAL_PCAGO004.pdf)
- Educação R$ 104.588.403,13 = função 12 R$ 109.757.318,02 (linha 61) − festejos R$ 5.168.914,89 (Anexo 6 linha 416, ação 12.392.0004.2.071 "Manutenção dos festejos e atividades culturais", na Secretaria de Esporte e Cultura) → fala "104 milhões e 600" e "com a festa lançada na conta da educação".
- Saúde R$ 60.352.289,03 (linha 61) · Administração R$ 15.958.031,03 (linha 14) · Obras R$ 76.798.878,58 = 74.262.629,64 (15, linha 61) + 1.895.474,39 (25, linha 156) + 640.774,55 (26, linha 156) · Câmara R$ 7.764.497,35 (linha 14) · Dívidas (28) R$ 10.907.523,56 (linha 156) · Cultura e festas R$ 6.034.323,16 = 865.408,27 (13, linha 61) + 5.168.914,89 · Assistência social R$ 7.139.327,30 (linha 14) · Agricultura R$ 1.723.109,26 (linha 108) · Esporte R$ 2.178.722,69 (linha 156) · Meio ambiente R$ 297.748,83 (linha 108) → fala do bloco 2024.

### 2025 (doc/2025-13_ANUAL_PCAGO007.pdf; ações em doc/2025-13_ANUAL_PCAGO004.pdf)
- Educação R$ 127.936.743,61 (linha 65) · Saúde R$ 61.358.588,42 (65) · Administração R$ 16.433.615,17 (14) · Obras R$ 34.761.755,62 = 34.042.541,50 (15) + 456.738,59 (25) + 262.475,53 (26) · Câmara R$ 9.380.535,72 (14) · Dívidas R$ 18.245.833,42 (168) · Cultura e festas R$ 7.342.841,94 (65) · Assistência social R$ 4.776.790,96 (14) · Agricultura R$ 1.862.830,21 (116) · Esporte R$ 621.808,53 (168) · Meio ambiente R$ 669.491,49 (116) → fala do bloco 2025.
- Obs.: o PCMGE015 de 12/2025 (SIGA) dá empenhado da Prefeitura de R$ 270.436.257,59, menor que o Balanço; vale o Balanço/Anexo 9 (ano fechado).

### 2026 até setembro (doc/2026-09_PCMGE015.pdf, liquidado, soma das ações por função; Câmara doc/2026-09_CAMARA_PCMGE015.pdf linha 127)
- Educação R$ 96.916.030,15 · Saúde R$ 48.659.990,58 · Administração R$ 17.389.018,01 · Obras R$ 34.108.353,97 (15 + 25 + 26) · Câmara R$ 7.299.977,67 · Dívidas R$ 12.223.602,01 · Cultura e festas R$ 10.504.077,03 · Assistência social R$ 4.863.255,42 (= "Total do Órgão" linha 5851) · Agricultura R$ 950.639,49 · Esporte R$ 2.247.690,77 · Meio ambiente R$ 572.581,10 → fala do bloco 2026. Soma das ações da Prefeitura = "Total do Poder" (linha 5885), diferença 0,00.

## Achado 1 · Dívida (Anexo 16 de 2025)
- doc/2025-13_ANUAL_PCAGO012.pdf (Demonstração da Dívida Fundada Interna 2025): TOTAIS linha 14: saldo anterior R$ 147.416.322,72 → fala "147 milhões e 400"; saldo atual R$ 241.071.392,84 → "241 milhões e 100"; baixas (pago) R$ 15.696.227,90 (tela).
- Linha 11: Contribuições previdenciárias, débito parcelado: saldo anterior R$ 111.505.863,95; inscrição R$ 102.803.388,09 → fala "ganhou mais 102 milhões e 800 só naquele ano"; saldo atual R$ 208.586.972,45 → "a maior parte é o parcelamento com o INSS". Outras linhas: FINISA R$ 28.247.169,16; PASEP R$ 4.237.251,23; precatórios R$ 0,00.
- "As contas não dizem de que anos é essa dívida": o Anexo 16 não traz o período de origem. Contexto (só conferência interna, não vai à fala): em 2025 a Emenda Constitucional 136/2025 abriu parcelamento especial de débitos previdenciários dos municípios vencidos até 31/08/2025 (Receita Federal, IN RFB 2283/2025; notícia Jornal Contábil "Aberto prazo para parcelamento histórico de dívidas previdenciárias de municípios", https://jornalcontabil.com.br/noticia/aberto-prazo-para-parcelamento-historico-de-dividas-previdenciarias-de-municipios/). Não achei notícia sobre a adesão de Itamaraju.

## Achado 2 · Festejos x assistência social x agricultura
- 2025: ação 2.2072.13.392.4.2.2071 "Manutenção dos festejos e atividades culturais" (Fundo Municipal de Cultura): dotação inicial R$ 3.347.000,00 → doc/2025-12_PCMGE015.pdf linha 2320 → fala "previa 3 milhões e 300"; gasto R$ 6.274.104,01 → doc/2025-13_ANUAL_PCAGO004.pdf (Anexo 6) linha 503 → fala "gastou 6 milhões e 300". Fonte 1500 (recursos próprios) R$ 5.498.112,17 de R$ 6.274.104,01 (conta própria, soma dos elementos com fonte 1500 no PCMGE015 12/2025) → fala "a maior parte com dinheiro da própria prefeitura". Comparação: assistência social 2025 R$ 4.776.790,96 → "mais que toda a assistência social".
- 2026 até setembro: mesma ação (2.1502.13.392.4.2.2071): dotação inicial R$ 6.164.000,00; liquidado R$ 9.759.973,02 → doc/2026-09_PCMGE015.pdf linha 374 → fala "9 milhões e 800". Bandas (3.3.90.39.94, fonte 1500) liquidado R$ 4.471.000,00 → linha 362 (tela). Assistência social R$ 4.863.255,42 → "o dobro" (9.759.973,02 ÷ 4.863.255,42 = 2,007, conta própria). Agricultura R$ 950.639,49 → "dez vezes" (÷ = 10,27, conta própria).
- 2024: a mesma ação estava na função 12 (Educação): R$ 5.168.914,89 (Anexo 6 linha 416; PCMGE015 12/2024 linha 1635, dotação inicial R$ 3.570.000,00).
- Procurado também: "fest", "evento", "carnav", "junin", "show" nos Anexos 6 e PCMGE015 dos 3 anos; só esta ação e "espaços culturais" (R$ 45.000,00 em 2024).
- Notícia (conferência interna, não vai à fala): Bahia Notícias, "Xô forró? Atrações de outros gêneros aparecem com altos cachês em lista de contratações para São João da Bahia" (2026), cita cachês contratados em Itamaraju. https://www.bahianoticias.com.br/holofote/noticia/84520-xo-forroa-atracoes-de-outros-generos-aparecem-com-altos-caches-em-lista-de-contratacoes-para-sao-joao-da-bahia

## Achado 3 · Câmara x assistência social (2025)
- Câmara R$ 9.380.535,72 (Anexo 9 2025 linha 14) x assistência social R$ 4.776.790,96 → "quase o dobro" (1,96, conta própria).

## Tribunal (TCM-BA › Decisões › Auditoria, Prefeitura de Itamaraju, exportado em 08/11/2026 20:45 → ~/Documents/RECEITAS-DESPESAS-ITAMARAJU/decisoes/2026-11-08_TCM_decisoes_auditoria_PM.txt e _modais_PM.txt; sem nome de pessoa no vídeo)
- 12794e25 (Denúncia): Pregão Eletrônico 032/2025, estrutura e apoio logístico para as festividades juninas de 2025, valor estimado R$ 3.131.625,16 (decisoes/2025_delib_12794e25.pdf linha 35). Julgada em 19/11/2025: procedência parcial, multa de R$ 2.000,00 ao gestor e recomendação (linhas 1466–1471). Reconsideração: não conhecimento, 14/07/2026. → fala "a licitação da estrutura do São João de 2025 rendeu multa ao gestor".
- 17052e26 (Representação do Ministério Público): "ornamentação temática junina… São João 2026". Sem data de julgamento no TCM em 08/11/2026 → fala "o Ministério Público questiona a decoração do São João de 2026, sem julgamento ainda".
- Outros (legenda/comentário, sem julgamento): 24446e25 supostas manipulações de licitações em 2025; 00569e26 licitações e pagamentos (combustível); 23562e26 contratações e liquidação de despesas 2026; 19908e26 dispensa 033/2025 e pregão 051/2025; 27342e24 coleta de lixo (pregão 082/2024); 27499e24 recolhimento ao INSS 2021–2022; 10471e26 descumprimento de notificação do TCM; 30209e25 transparência. 22639e23 (INSS 2019–2022): arquivado em 12/02/2025.

## Fecho
- "em dois desses três anos a cidade gastou mais do que arrecadou": 2024 (déficit do Balanço) e 2026 até setembro (liquidado 236,7 x arrecadado 231,9).
