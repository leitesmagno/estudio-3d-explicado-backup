# 089. orçamento de Ibotirama · fontes

Consulta: 11/11/2026, e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 159 IBOTIRAMA, Prefeitura UJ 763, Câmara UJ 192 (o Consórcio de Saúde da Região de Barreiras e Ibotirama, UJ 512, é outra entidade e fica fora).
PDFs em ~/Documents/RECEITAS-DESPESAS-IBOTIRAMA/documentos_tcm/ (município e competência conferidos no cabeçalho de cada um). "p." = página do PDF.
Regra: "gastou" = despesa LIQUIDADA. "Arrecadou" = receita arrecadada até o mês menos anulações (já sem a parte do Fundeb, como no Balanço).
Último mês entregue de 2026: 09/2026 (10/2026 "Pendente" no e-TCM).

## Abertura (fala, mapa e chips)
- Arrecadou 2024: 181.069.993,37 → 2024_PCAGO015.pdf (Balanço Orçamentário 2024) p.1, "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas. = PCMGE016 dez/2024 p.7 linha TOTAL: 186.488.458,27 − anulações 5.418.464,90. Fala/mapa: "181 milhões e 100".
- Arrecadou 2025: 216.760.794,16 → 2025_PCAGO015.pdf p.1, "SUBTOTAL DAS RECEITAS (III)". = PCMGE016 dez/2025 p.7 TOTAL 216.832.505,66 − 71.711,50. Fala/mapa: "216 milhões e 800".
- Arrecadou 2026 até set: 177.596.562,33 → 2026-09_PCMGE016.pdf p.7 linha TOTAL: 177.617.934,71 (arrecadada até o mês) − 21.372,38 (anulada até o mês). Fala/mapa: "177 milhões e 600".
- SUS 2025 (União e Estado para a saúde): 74.507.781,47 → 2025-12_PCMGE016.pdf: 1.7.1.3.00 União 64.111.550,85 (p.2) + 1.7.2.3.00 Estado 10.350.576,39 (p.5) + 2.4.1.1.00 União capital 45.654,23 (p.6), coluna Arrecadada até Mês. Fala: "74 milhões e 500".
- FPM 2025: 41.155.489,57 → 2025-12_PCMGE016.pdf p.2, 1.7.1.1.51.0.0 Cota-Parte do FPM, Arrecadada até Mês (já sem a dedução do Fundeb, 8.915.042,05). Fala: "41 milhões e 200".
- IPTU 2025: 1.369.051,52 → 2025-12_PCMGE016.pdf p.1, 1.1.1.2.50.0.0, Arrecadada até Mês. Fala: "1 milhão e 400".

## 2024
- Gastou 2024 (liquidado): 183.169.360,91 → 2024_PCAGO015.pdf p.1, "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. = Prefeitura 178.759.360,91 (2024-12_PCMGE015.pdf p.45, linha "Total :", 8º valor Liq Até Per) + Câmara 4.410.000,00 (2024-12_CAMARA_PCMGE015.pdf p.4, "Total do Poder", liquidado até o mês). Centavo a centavo. Fala: "183 milhões e 200".
- Faltaram 2024: 2.099.367,54 (conta própria: 183.169.360,91 − 181.069.993,37). Fala: "2 milhões e 100". O Balanço mostra "Déficit (VI) 2.132.041,82" na coluna do empenhado.
- Setores 2024 (liquidado; setor pela FUNÇÃO da ação; script ~/Documents/RECEITAS-DESPESAS-IBOTIRAMA/scripts/setores.py; o PCMGE015 da Prefeitura de 2024 é do sistema próprio, não SIGA, lido com scripts/acoes015.py, 116 ações, soma = "Total :" centavo a centavo):
  - Educação (função 12) 61.346.736,33 → "61 e 300"
  - Saúde (10) 64.144.383,51 → "64 e 100"
  - Obras e serviços urbanos (15, 16, 17, 25, 26) 28.566.898,79 → "28 e 600"
  - Administração (03, 04, 06, 11, 23) 11.290.524,29 → "11 e 300" (a função 23 de Ibotirama é "Gestão das Ações dos Consórcios Públicos Multifinalitários", 115.456,72: fica com Administração, junto da ação de consórcios da função 04)
  - Dívidas e encargos (28) 1.766.699,29 → "1 milhão e 800"
  - Assistência social (08, 14) 3.856.830,01 → "3 milhões e 900"
  - Câmara de Vereadores 4.410.000,00 → "4 milhões e 400"
  - Festas e eventos 4.613.433,10 → "4 milhões e 600": ação 2029 "Gestão de Ações na Promoção de Festas Culturais, Religiosas e Tradicionais" (2024-12_PCMGE015.pdf p.42, Total da ação, Liq Até Per). Em 2024 o relatório só detalha até o elemento (3.3.90.39.00), sem separar bandas e palco.
  - Cultura (função 13 sem festas) 767.303,89 → "767 mil"
  - Agricultura e meio ambiente (18, 20) 1.806.508,16 → "1 milhão e 800"
  - Esporte (27) 600.043,54 → "600 mil"
  - Soma = 183.169.360,91.

## 2025
- Taxas de fiscalização: 8.959.086,15 arrecadados SÓ em dezembro/2025 → 2025-12_PCMGE016.pdf p.1, 1.1.2.1.01.0.0 "Taxas de Inspeção, Controle e Fiscalização", coluna Arrecadada no Mês (no ano: 9.767.073,42; previsto no ano: 1.464.500,00). Fala: "quase 9 milhões".
- Todas as taxas de 2024: 1.608.674,09 → 2024-12_PCMGE016.pdf p.1, 1.1.2.0.00.0.0 Taxas, Arrecadada até Mês 1.610.547,77 − Anulada até Mês 1.873,68. Fala: "1 milhão e 600".
- Gastou 2025 (liquidado): 209.127.683,06 → 2025_PCAGO015.pdf p.1, "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas. = Prefeitura 204.354.315,01 (2025-12_PCMGE015.pdf p.148, "Total do Poder", liquidado até o mês) + Câmara 4.765.619,86 (2025-12_CAMARA_PCMGE015.pdf p.5) + 7.748,19 a mais na Saúde que o Balanço traz (2025_PCAGO007.pdf, Anexo 9, p.2: FUNDO MUNICIPAL DE SAÚDE 81.913.943,10 empenhado x 81.906.194,91 no PCMGE015; diferença 7.748,19, igual no empenhado e no liquidado do Balanço). Vale o Balanço; a folha da Saúde 2025 mostra a linha "Ajuste ao Balanço 2025 (Anexo 9)". Fala: "209 milhões e 100".
- Sobraram 2025: 7.633.111,10 (conta própria: 216.760.794,16 − 209.127.683,06). Fala: "7 milhões e 600".
- Setores 2025 (liquidado):
  - Educação 69.227.300,48 → "69 e 200"
  - Saúde 81.699.999,40 (81.692.251,21 do PCMGE015 + 7.748,19 do Balanço) → "81 e 700"
  - Obras e serviços urbanos 28.686.156,91 → "28 e 700"
  - Administração (com a função 23, consórcios, 82.803,02) 11.286.480,32 → "11 e 300"
  - Dívidas e encargos 1.797.773,87 → "1 milhão e 800"
  - Assistência social 3.043.009,31 → "3 milhões"
  - Câmara 4.765.619,86 → "4 milhões e 800"
  - Festas e eventos 5.129.770,01 → "5 milhões e 100": ação 2029 "Promoção de Eventos e Atividades Culturais" 5.120.770,01 (2025-12_PCMGE015.pdf p.146, Total do Projeto/Atividade) + 9.000,00 de palco (3.3.90.39.95) na ação 2006 de Esporte e Lazer.
  - Cultura (função 13 sem festas) 487.015,17 → "487 mil"
  - Agricultura e meio ambiente 2.193.575,11 → "2 milhões e 200"
  - Esporte 810.982,62 (sem os 9.000,00 de palco) → "811 mil"
  - Soma = 209.127.683,06 (= Balanço).

## 2026 até setembro
- Gastou (liquidado): 181.869.804,13 → Prefeitura 177.696.799,89 (2026-09_PCMGE015.pdf p.144, "Total do Poder", liquidado até o mês) + Câmara 4.173.004,24 (2026-09_CAMARA_PCMGE015.pdf p.5). Fala: "181 milhões e 900".
- Faltaram: 4.273.241,80 (conta própria: 181.869.804,13 − 177.596.562,33). Fala: "4 milhões e 300".
- Já comprometeu (empenhado): 228.256.396,49 → Prefeitura 222.807.303,68 (2026-09_PCMGE015.pdf p.144, empenhado até o mês) + Câmara 5.449.092,81 (2026-09_CAMARA_PCMGE015.pdf p.5). Fala: "228 milhões e 300".
- Setores 2026 até set (liquidado):
  - Educação 60.118.105,13 → "60 e 100"
  - Saúde 72.811.277,82 → "72 e 800"
  - Obras e serviços urbanos 25.177.028,14 → "25 e 200"
  - Administração (com a função 23, consórcios e empreendedorismo, 34.952,97) 8.173.945,24 → "8 milhões e 200"
  - Dívidas e encargos 1.984.441,01 → "2 milhões"
  - Assistência social 2.395.131,05 → "2 milhões e 400"
  - Câmara 4.173.004,24 → "4 milhões e 200"
  - Festas e eventos 4.026.014,36 → "4 milhões": ação 2029 "Promoção de Eventos, Festivais e Atividades Culturais" 4.004.182,36 (2026-09_PCMGE015.pdf p.142) + palco (3.3.90.39.95) em outras ações: 13.332,00 (Planejamento), 3.500,00 (Fundo de Saúde), 5.000,00 (Educação).
  - Cultura (função 13 sem festas) 482.949,28 → "483 mil"
  - Agricultura e meio ambiente 1.778.232,97 → "1 milhão e 800"
  - Esporte 749.674,89 → "750 mil"
  - Soma = 181.869.804,13.

## A Câmara
- Recebeu 2024: 4.410.000,00 → 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) p.7, 4.5.1.1.2.02.00 REPASSE RECEBIDO, creditado até o mês. Gastou (liquidado) 4.410.000,00 (2024-12_CAMARA_PCMGE015.pdf p.4): sem devolução lançada no razão de 2024. Fala: "recebeu 4 milhões e 400 ... e gastou tudo".
- Obras na Câmara 2024: 477.558,93 → 2024-12_CAMARA_PCMGE015.pdf p.1, 4.4.90.51.01 "Obras e Instalações (Mão de Obra)", liquidado até o mês. Fala: "478 mil em obras".
- Recebeu 2025: 5.150.000,00 → 2025-12_CAMARA_PCMGE018.pdf p.8, 4.5.1.1.2.02.00 REPASSE RECEBIDO, creditado até o mês. Fala: "5 milhões e 150".
- Devolveu 2025: 354.430,14 → 2025-12_CAMARA_PCMGE018.pdf p.7, 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS, debitado até o mês. (5.150.000,00 − 354.430,14 = 4.795.569,86 = empenhado da Câmara; liquidado 4.765.619,86.) Fala: "devolveu 354 mil".
- Recebeu 2026 até set: 4.233.333,35 → 2026-09_CAMARA_PCMGE018.pdf p.7 (só na folha).
- Consultorias 2024: 310.542,00 → 2024-12_CAMARA_PCMGE015.pdf p.2: 3.3.90.35.01 Consultoria Contábil 101.678,16 + 3.3.90.35.03 Consultoria Jurídica 120.000,00 + 3.3.90.35.99 Outros Serviços de Consultoria 88.863,84 (liquidado até o mês). Fala: "311 mil".
- Consultorias 2025: 399.950,00 → 2025-12_CAMARA_PCMGE015.pdf p.3: 3.3.90.35.01 Assessoria e Consultoria Técnica ou Jurídica 207.950,00 + 3.3.90.35.99 Outros Serviços de Consultoria 120.000,00 + 72.000,00 (liquidado até o mês). Fala: "400 mil".
- Cuidado registrado: na Câmara, o código 3.3.90.30.02 aparece em 2025 como "Combustíveis e lubrificantes de aviação" (78.280,82), mas em 2024 o mesmo código era "Combustíveis e Lubrificantes" comum (149.049,43): o plano de contas mudou. NÃO usado no vídeo.

## As festas
- Ação de eventos 2025, previsto (dotação inicial): 2.967.000,00 → 2025-12_PCMGE015.pdf p.146, ação 7.2091.13.392.27.2.2029 "Promoção de Eventos e Atividades Culturais", Total do Projeto/Atividade, 1ª coluna (Fixada). Fala: "previa 3 milhões". Dotação final depois das alterações: 5.404.300,00.
- Ação de eventos 2025, gasto (liquidado): 5.120.770,01 → mesma linha, liquidado até o mês. Fala: "Gastou 5 milhões e 100".
- Bandas 2025: 3.237.000,00 → 2025-12_PCMGE015.pdf p.146, 3.3.90.39.94 "Serviços de banda ou grupo musical ou profissional", liquidado até o mês. Fala: "3 milhões e 200".
- Palco e estrutura 2025: 1.149.940,00 → 2025-12_PCMGE015.pdf p.146, 3.3.90.39.95 "Locação, confecção e montagem de cenários, palcos...", liquidado até o mês. Fala: "1 milhão e 100".
- Bandas 2026 até set: 2.748.000,00 → 2026-09_PCMGE015.pdf p.142, 3.3.90.39.94, liquidado até o mês (empenhado 4.148.000,00). Fala: "2 milhões e 700".

## A ajuda de emergência (benefícios eventuais)
- 2024: 161.838,41 → 2024-12_PCMGE015.pdf p.27, ação "Manutenção das Ações de Gestão dos Benefícios Eventuais", Total da ação, Liq Até Per. Fala: "162 mil".
- 2025: 67.580,10 → 2025-12_PCMGE015.pdf p.101, ação "Gestão de Benefícios Eventuais", Total do Projeto/Atividade, liquidado até o mês (dotação inicial 112.000,00). Fala: "68 mil".
- 2026 até set: 37.000,69 → 2026-09_PCMGE015.pdf p.100, ação "Benefícios Eventuais às Famílias em Vulnerabilidade", liquidado até o mês (empenhado 64.000,69). Fala: "37 mil".

## Folhas "PDF" (receita por ano e despesa por setor)
- Receita: scripts/receita.py → saida/receita_2024.json, receita_2025.json, receita_2026.json (PCMGE016 de dez/2024, dez/2025 e set/2026; soma = total falado, diferença 0,00).
- Setores: scripts/folhas.py → saida/folha-pdf/config-setores.json (cada folha soma o valor do setor falado).

## Correção na 1ª conferência (11/11/2026)
- Roteiro v1 (em antigos/) somava a função 23 (consórcios públicos e empreendedorismo) à Cultura. Pela regra 99, Cultura é só a função 13 sem as festas: a função 23 foi para Administração. Mudaram Administração (11,2 → 11,3 em 2024 e 2025; 8,1 → 8,2 em 2026) e Cultura (883 → 767 mil; 570 → 487 mil; 518 → 483 mil). Partes 4, 6 e 8 da voz refeitas.

## Pendências no TCM
- PCMGE064/065/066 da Prefeitura não vieram na lista de 500 documentos das prestações mensais (não usados; os totais fecham com o Balanço sem eles).
