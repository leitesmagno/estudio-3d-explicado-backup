# Fontes · 083. orçamento de Itambé (BA)

Todos os documentos foram baixados do e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 09/11/2026, entre 10h45 e 11h05, e estão em `~/Documents/RECEITAS-DESPESAS-ITAMBE/documentos_tcm/` (PDF + texto extraído .txt). Em todos, o cabeçalho foi conferido: "Município: ITAMBÉ" ou "PREFEITURA/CAMARA MUNICIPAL DE ITAMBE", CNPJ 13.743.760/0001-30 (Prefeitura) e 16.417.362/0001-12 (Câmara).
e-TCM: município 188 ITAMBÉ · Prefeitura UJ 792 · Câmara UJ 221 · sem autarquias. Último mês entregue de 2026: 09/2026.
"Gastou" = despesa LIQUIDADA (regra 32). Os PCMGE065 (consolidado, sistema Fator) já trazem a Câmara; a soma das ações fecha centavo a centavo com o Balanço Orçamentário de 2024 e de 2025.

## Totais por ano
- 109.518.531,13 (arrecadou 2024) → 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024), linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas; igual ao "Total (a+b+c+d-e)" do 2024-12_PCMGE066.pdf → fala, tela (mapa), folha, legenda.
- 111.936.801,99 (gastou 2024) → 2024-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas; = "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" liquidado no ano do 2024-12_PCMGE065.pdf → fala, tela, legenda.
- 2.418.270,86 a mais em 2024 → conta própria (111.936.801,99 − 109.518.531,13) → fala "2 milhões e 400 a mais", tela.
- 126.681.854,01 (arrecadou 2025) → 2025-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS RECEITAS (III)"; = Total do 2025-12_PCMGE066.pdf → fala, tela, legenda.
- 112.602.435,05 (gastou 2025) → 2025-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS DESPESAS (XI)", Despesas Liquidadas; = total liquidado do 2025-12_PCMGE065.pdf → fala, tela, legenda.
- 14.079.418,96 sobraram em 2025 → conta própria (126.681.854,01 − 112.602.435,05). O Balanço registra "Superávit (XIII)" de 12.227.342,63 calculado sobre o EMPENHADO (114.454.511,38) → fala "Sobraram 14 milhões e 100" (sobre o liquidado), tela.
- 100.628.327,44 (arrecadou 2026 até set) → 2026-09_PCMGE066.pdf, linha "Total ( a + b + c + d - e )", coluna Arrecadado até Mês; = 2026-09_PCMGE016.pdf "Arrecadada até Mês" 100.792.539,01 − "Anulada até Mês" 164.211,57 → fala, tela, legenda.
- 101.776.333,95 (gastou 2026 até set) → 2026-09_PCMGE065.pdf, "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA", coluna Liquidado No Ano → fala, tela, legenda.
- 1.148.006,51 a mais em 2026 → conta própria → fala "1 milhão e 100 a mais", tela.
- 133.559.030,70 empenhado (comprometido) 2026 → 2026-09_PCMGE065.pdf, mesma linha, coluna Empenhado No Ano → fala "já comprometeu 133 milhões e 600", tela.

## Setores (soma do liquidado das ações do PCMGE065 consolidado, por função; script scripts/setores.py)
Mapa: Educação = função 12 · Saúde = 10 · Administração = 04 + 02 (Procuradoria) + 06/11/99 (sem gasto) · Obras, limpeza e iluminação = 15 + 17 (cais e esgotamento) · Transportes = 26 (estradas vicinais) · Câmara = 01 · Dívidas e encargos = 28 · Cultura e festas = 13 · Assistência social = 08 + 14 (Sec. da Mulher e Direitos Humanos, só em 2026: R$ 225.170,42) · Agricultura = 20 (menos a ação de meio ambiente) · Meio ambiente = 18 + ação 20.122.0006.2.018 de 2024 · Esporte = 27 (inclui a reforma do Cine Teatro Fox).
| Setor | 2024 (PCMGE065 dez/2024) | 2025 (PCMGE065 dez/2025) | 2026 até set (PCMGE065 set/2026) |
|---|---|---|---|
| Educação | 45.350.203,34 | 48.214.550,55 | 42.167.721,64 |
| Saúde | 20.299.253,94 | 23.399.622,60 | 20.731.903,46 |
| Administração | 13.323.756,95 | 12.557.761,95 | 10.067.666,17 |
| Obras, limpeza e iluminação | 8.704.280,39 | 7.005.867,54 | 8.220.998,75 |
| Transportes | 1.607.256,91 | 1.700.813,41 | 1.815.182,45 |
| Câmara de Vereadores | 3.680.203,77 | 4.311.348,09 | 3.694.803,09 |
| Dívidas e encargos | 10.868.023,19 | 10.317.178,49 | 7.110.414,99 |
| Cultura e festas | 3.981.470,90 | 1.024.750,09 | 3.939.577,36 |
| Assistência social | 3.706.959,95 | 3.510.246,45 | 3.238.139,30 |
| Agricultura | 176.453,66 | 224.634,95 | 384.014,36 |
| Meio ambiente | 161.438,35 | 308.649,13 | 244.214,11 |
| Esporte | 77.500,64 | 27.011,80 | 161.698,27 |
| TOTAL | 111.936.801,99 | 112.602.435,05 | 101.776.333,95 |
Onde aparece: fala (arredondado a 100 mil; abaixo de 1 milhão, a 10 mil ou mil), plaquinhas, folhas por setor (valor exato), legenda.
Zeros conferidos: nenhum setor falado é zero. Esporte pequeno conferido em todas as funções: as ações de obras esportivas existem com dotação e liquidado 0,00 (ver achados).

## Achados
- Eventos e festejos 2024: previsto (Dotação Fixada) 855.000,00 (ação 13.392.0013.2.044) + 104.500,00 (ação 2.045, "nos distritos") = 959.500,00; liquidado 3.667.375,80 (2.044) + 0,00 (2.045) → 2024-12_PCMGE065.txt linhas 426 e 486, colunas Fixado e Liquidado No Ano → fala "960 mil" / "3 milhões e 700", tela, legenda. A dotação da 2.044 subiu para 3.775.541,55 por crédito adicional; a 2.045 caiu só 95.250,00: o dinheiro não veio de outra ação de festa (regra 211).
- Eventos e festejos 2026: previsto 1.463.400,00 (2.044) + 778.500,00 (2.045) = 2.241.900,00; dotação atual 4.898.600,00 + 9.200,00; liquidado até set 3.657.232,82 → 2026-09_PCMGE065.txt linhas 449 e 505 → fala "2 milhões e 200" / "3 milhões e 700", tela, capa, legenda.
- (2025, só na folha: festas 586.834,70 de 1.631.800,00 previstos.)
- Benefícios eventuais (ajuda de emergência às famílias): 2024 liquidado 101.285,55 (ação 8.244.0016.2.061, 2024-12_PCMGE065.txt linha 1764) → "101 mil"; 2026 até set 93.606,36 (ação 8.246.0016.2.061, 2026-09_PCMGE065.txt) → "94 mil" → fala, tela, capa, legenda.
- Câmara recebeu da prefeitura 2024: 3.680.685,32 ("Recebimento de Duodécimo"), devolveu 481,55 → 2024-13_CAMARA_PCAGE062.pdf (Fluxo Financeiro, Câmara de Itambé, exercício 2024; "Despesas Orçamentárias" 3.680.203,77 = Câmara no PCMGE065) → fala "3 milhões e 700", tela, folha.
- 2025: recebeu 4.311.348,09, devolveu 0,00 → 2025-13_CAMARA_PCAGE062.pdf → folha.
- 2026 até set: repasse concedido ao Poder Legislativo 3.590.393,22 → 2026-09_PCMGE018.pdf (razão da Prefeitura, conta 3.5.1.1.2.02.00.02 "REPASSES CONCEDIDOS AO PODER LEGISLATIVO", acumulado) → folha.
- Diárias da Câmara: 2024 = 561.500,00 + 350.600,00 = 912.100,00 (elemento 3.3.90.14 nas duas ações da Câmara, 2024-12_PCMGE065.pdf, órgão 1) → fala "912 mil"; 2025 = 294.000,00 + 66.300,00 = 360.300,00 (folha); 2026 até set = 339.300,00 + 283.300,00 = 622.600,00 (2026-09_PCMGE065.txt linhas 13 e 20) → fala "622 mil", tela, legenda.
- Obras de esporte 2026 (Dotação Fixada, a lei do orçamento): reforma do estádio Osório Ferraz 1.012.400,00 + areninha 840.000,00 + campos, ginásios e quadras 5.505.000,00 + praça poliesportiva de Cassilândia 10.000,00 + construção e ampliação de praças 1.200.000,00 + quadra coberta de São José 1.480.000,00 = 10.047.400,00; liquidado até set: só a reforma do estádio, 43.633,45 (as outras 0,00) → 2026-09_PCMGE065.pdf, função 27 → fala "10 milhões" / "44 mil", tela, legenda. A frase diz só que "gastaram 44 mil" (liquidado), não que a obra não começou. Notícias (09/11/2026): nada sobre essas obras; a quadra coberta citada na imprensa é do colégio estadual (obra do Estado), não entra.
- Salários e encargos 2025: 72.532.612,71 = liquidado dos elementos 3.1.90.11, 3.1.90.04, 3.1.90.13, 3.1.90.16, 3.1.91.13 e 3.1.90.94 em todas as ações (com a Câmara), 2025-12_PCMGE065.pdf → fala "72 milhões e 500", tela, legenda.
- Sentenças judiciais 2025: 7.344.703,68 (elementos 3.1.90.91 e 3.3.90.91; 7.263.885,02 só na ação 28.843 Administração da Dívida) → 2025-12_PCMGE065.pdf → fala "7 milhões e 300", tela, folha.
- Dívida fundada (Anexo 16, 2025-13_ANUAL_PCAGO012.pdf): saldo 51.340.563,05 → 32.387.174,19 (baixas 21.782.085,38). Não entrou na fala.

## Tribunal de Contas
Consulta em 09/11/2026 ~11h, TCM-BA › Decisões › Auditoria, município ITAMBÉ; texto salvo em ~/Documents/RECEITAS-DESPESAS-ITAMBE/decisoes/decisoes_auditoria.txt (nomes de gestores só ali, nunca no vídeo). A página não mostra decisão para os processos citados.
- 08679E25: "DESPESAS NÃO RAZOÁVEIS E ANTIECONÔMICAS COM DIÁRIAS", Câmara, exercício 2024 → fala "processos sobre as diárias da Câmara de 2024".
- 23038E26: "SUPOSTAS IRREGULARIDADES NO PREGÃO ELETRÔNICO N° 0015/2026", Prefeitura, exercício 2026 → fala "um pregão da prefeitura de 2026".
- (Outros sobre diárias da Câmara de 2021 a 2023: 05563E25, 16152E23, 16220E23, 05601E23, 20455E22; não citados um a um.)

## Receita (folhas, sem detalhe na fala)
PCMGE066 (Fator) de dez/2024, dez/2025 e set/2026, coluna "Arrecadado até Mês"; FPM, ITR, ICMS, IPVA e IPI já líquidos da dedução para o Fundeb (contas 9.1.7.x somadas ao imposto de origem). Script scripts/receita066.py; soma das linhas = total do ano (diferença 0,00), com "Outras receitas" fechando a conta. Destaques 2025: FPM 41.155.489,57; Fundeb 37.560.069,82; SUS da União 13.691.161,49; IPTU 335.220,97; iluminação pública (contribuições) 235.466,70.

## Notícias (só conferência interna)
- ba.gov.br/educacao, "Modernização de colégio estadual em Itambé qualifica ensino em tempo integral" (2025): quadra coberta e campo society são obra do Estado. Não muda nada do vídeo.
