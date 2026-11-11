# Fontes · 070. orçamento de Valença (BA)

Consulta no e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 09/11/2026, 00h27 a 03h40. Município 405 (VALENÇA), Prefeitura UJ 1009, Câmara UJ 439, SAAE UJ 1069 (o SAAE não tem prestação própria na consulta; ele está dentro do Balanço e do consolidado PCMGE065/066). Todos os PDFs em ~/Documents/RECEITAS-DESPESAS-VALENCA/documentos_tcm/ (com .txt ao lado) e conferidos pelo nome do município na 1ª página. Contas feitas por script estão em ~/Documents/RECEITAS-DESPESAS-VALENCA/scripts/ e saida/.
"Gastou" = despesa LIQUIDADA (regra 32). Sem nome de gestor no vídeo.

## Receita (fala: "arrecadou")
- 2024: R$ 368.965.848,17 → 2024_PCAGO015.pdf (Balanço Orçamentário 2024), linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas → fala "369 milhões" (abertura e 2024), mapa "R$ 369 MI". Folha: 2024_PCAGO008.pdf (Anexo 10), soma dos grupos = 368.965.848,17 (scripts/anexo10.py → saida/receita_2024.json).
- 2025: R$ 398.352.360,32 → 2025_PCAGO015.pdf linha "SUBTOTAL DAS RECEITAS (III)" e 2025_PCAGO008.pdf "Total Geral" → fala "398 milhões" (abertura) e "398 milhões e 400" (2025). Folha: saida/receita_2025.json.
- 2026 até agosto: R$ 270.033.821,85 → 2026-08_PCMGE066.pdf (consolidado, Prefeitura + SAAE + Câmara), linha "Totais", Total até Mês (arrecadado 270.351.735,02 − anulado 317.913,17) → fala "270 milhões". Folha: itens do 2026-08_PCMGE016.pdf da Prefeitura (Totais 245.505.420,00) + linha "SAAE e demais unidades (consolidado)" 24.528.401,85 = diferença.

## Despesa total (fala: "gastou")
- 2024: R$ 408.767.635,27 → 2024_PCAGO015.pdf, "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas (empenhado 408.795.045,07) → "408 milhões e 800"; a mais: 408.767.635,27 − 368.965.848,17 = 39.801.787,10 (conta própria) → "39 milhões e 800".
- 2025: R$ 401.652.623,11 → 2025_PCAGO015.pdf, Despesas Liquidadas (empenhado 404.984.474,36) e 2025-12_PCMGE065.pdf "Total :" Liq Até Per 401.652.623,11 (bate) → "401 milhões e 700"; a mais 3.300.262,79 (conta própria) → "3 milhões e 300".
- 2026 até agosto: liquidado R$ 290.326.759,23; empenhado R$ 423.752.085,99 → 2026-08_PCMGE065.pdf, linha "TOTAL", 2ª linha (até o mês): empenhada, liquidada → "290 milhões e 300", "comprometeu 423 milhões e 800". "Parte disso é folha": empenhado de pessoal (3.1) 244.444.516,03 x liquidado 143.725.448,29 (diferença 100,7 mi dos 133,4 mi) → saida/acoes_2026-08.json.

## Setores (setor = função; SAAE separado; Obras = funções 15, 16 e 17 da Prefeitura; Meio ambiente e turismo = 18, 22, 23)
Scripts: anexo7.py (2024), p015_2025.py (dez/2025, formato próprio), p065.py (ago/2026), setores.py. Soma dos setores = total de cada ano (diferença 0,00).
- 2024 (Anexo 7 2024_PCAGO005.pdf = Anexo 9 2024_PCAGO007.pdf, EMPENHADO por função; o PCMGE015/065 de dez/2024 foi enviado como "Declaração de não existência", arquivo 2024-12_PCMGE015-declaracao.pdf; empenhado − liquidado no ano = R$ 27.409,80): Educação 159.823.004,97 · Saúde 63.757.774,22 · Administração 51.334.302,87 (sem os 8.816.804,63 do SAAE) · Obras, limpeza e iluminação 42.015.578,92 · Estradas e transporte 10.180.483,01 · Água e esgoto (SAAE) 27.054.282,92 · Câmara 10.017.404,50 · Dívidas e sentenças 16.884.485,76 · Cultura e festas 7.293.942,49 · Assistência social 17.149.089,92 · Agricultura 669.407,11 · Meio ambiente e turismo 1.668.970,30 · Esporte 946.318,08.
- 2025 (2025-12_PCMGE065.pdf consolidado, coluna Liq Até Per): Educação 168.210.129,14 · Saúde 54.324.218,76 · Administração 37.188.639,08 · Obras 42.521.553,69 · Estradas 15.203.615,83 · Água e esgoto (SAAE, unidade 70101) 30.440.299,19 · Câmara (10101) 12.466.685,57 · Dívidas e sentenças 20.502.328,44 · Cultura e festas 6.798.014,98 · Assistência 11.101.126,46 · Agricultura 1.036.856,51 · Meio ambiente e turismo 1.474.746,05 · Esporte 384.409,41.
- 2026 até agosto (2026-08_PCMGE065.pdf, liquidada até o mês): Educação 114.010.399,37 · Saúde 44.049.450,85 · Administração 31.445.502,21 · Obras 28.930.641,76 · Estradas 19.926.733,33 · Água e esgoto 21.437.229,57 · Câmara 8.994.190,80 · Dívidas e sentenças 9.296.365,06 · Cultura e festas 2.325.296,50 · Assistência 8.040.637,96 · Agricultura 0,00 (11 ações da função 20, previsto 184.000,00, todas com liquidado 0,00) · Meio ambiente e turismo 1.372.057,70 · Esporte 498.254,12.
- Folhas por setor: ~/Documents/RECEITAS-DESPESAS-VALENCA/saida/folha-pdf/config-setores.json (scripts/folhas.py; ações ou elementos, soma = valor falado).

## Achados
- Festas 2025: ação 2017 "Realização de eventos e festas populares" (Sec. de Cultura) liquidado 5.134.640,20 (dotação atual 6.401.000,00) → 2025-12_PCMGE065.pdf → "5 milhões e 100" (fala e capa). Procurado em todas as funções por "festa/evento/carnaval/são joão" e subfunção 392: as outras ações de evento têm valores pequenos ou zero.
- Festas 2024: mesma ação, empenhado 4.457.781,54 → 2024_PCAGO005.pdf → "4 milhões e 500".
- Agricultura 2025 (função 20 inteira): 1.036.856,51 (só a manutenção da secretaria) · Esporte 2025: 384.409,41.
- Agricultura 2026: as 11 ações da função 20 (assistência técnica, mudas, feiras livres, pesca...) com liquidado 0,00 até agosto; a secretaria (Agricultura, Meio Ambiente e Desenvolvimento) liquidou 967.033,82 na ação 2131 "Manutenção das atividades técnicas e administrativas" (função 18) → 2026-08_PCMGE065.pdf → "967 mil com a própria manutenção". A Sec. de Pesca liquidou 163.164,21 na função 04 (administração), fora das "ações de agricultura".
- Salários e encargos 2025 (todas as unidades): elementos 3.1.90.11 156.727.822,91 + 3.1.90.04 58.553.940,61 + 3.1.90.13 21.104.346,90 + 3.1.90.16 849.748,75 = 237.235.859,17 (conta própria) → "237 milhões"; contratados por tempo determinado (3.1.90.04) 58.553.940,61 → "58 milhões e 600". Fonte: 2025-12_PCMGE065.pdf.
- Câmara 2025: 12.466.685,57 → "12 milhões e 500". Duodécimo recebido 12.466.746,67 → 2025-12_PCMGE018.pdf (razão da Prefeitura), conta 3.5.1.1.2.02.02.00.01 "Repasse Concedido à Câmara Municipal - Duodécimo", até o mês (só na folha).
- Dívidas e sentenças 2025: 20.502.328,44 (serviço da dívida 8.801.088,46; sentenças judiciais 8.353.630,95; PASEP 3.347.609,03) → "20 milhões e 500".

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município VALENÇA, consulta 09/11/2026 ~03h40; texto salvo em documentos_tcm/decisoes/TCM_auditoria_VALENCA_2026-11-09.txt)
- 23 processos com número de 2024 a 2026 (e24, e25, e26) sobre PM, CM e SAAE de Valença (fora o consórcio CSBAIXOSUL): 01965e26, 02510e25, 06494e25, 11537e24, 11865e26, 13313e25, 14777e25, 15177e24, 15676e26, 16462e26, 21606e26, 25044e26, 25993e24, 27816e24, 31426e25, 31501e25, 31617e25, 31676e25, 32263e25, 33522e25, 33527e25, 33531e25, 33695e25 → "23 processos abertos de 2024 a 2026".
- Estacionamento rotativo (Concorrência 005/2025): 33522e25, 33527e25, 33531e25, 33695e25 → "Quatro". Limpeza urbana: 27816e24 (Pregão 043/2024) e 01965e26 (Concorrência 006/2025) → "dois". Terceirização de mão de obra: 16462e26 (Termo de Ocorrência, adesão a ata de outro município, contrato 349/2025). Serviços jurídicos da Câmara: 31676e25 e 15676e26. Sem decisão publicada nesses; a fala diz "Estar no tribunal não é condenação".

## Fora do vídeo (pendências e conferências)
- Duodécimo da Câmara 2024 e 2026: o PCAGE062 da Câmara não foi baixado e o razão da Câmara (2026-08_CAMARA_PCMGE018.pdf) é escaneado (OCR ilegível); as folhas da Câmara 2024 e 2026 ficam sem a faixa do duodécimo. Anotado em projetos/_pendencias-tcm.md.
- 2024 por elemento (pessoal e diárias por setor): não existe PCMGE015 de dez/2024 (declaração), então as folhas de 2024 mostram as ações do Anexo 7, sem a faixa de pessoal.
- Tarifa bancária: fora do vídeo (regra 60).
