# Fontes · 053. orçamento de Caetité (BA)
Consulta: 08/11/2026. Fonte principal: e-TCM Consulta Pública (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 64 "CAETITÉ", Prefeitura UJ 669 ("Prefeitura Municipal de CAETITE"), Câmara UJ 98 ("Camara Municipal de CAETITÉ"). Não há outra unidade de Caetité no e-TCM (sem SAAE ou instituto próprio). CNPJ da Prefeitura nos PDFs: 13.811.476/0001-54.
Sistema: SIAFIC Fator Sistemas. Balanço e Anexo 9 já somam Prefeitura + Câmara + fundos (saúde, assistência, educação).
Pasta: ~/Documents/RECEITAS-DESPESAS-CAETITE/documentos_tcm/ (abreviada DOC/). "linha" = linha do .txt gerado do PDF (pdfplumber) com o mesmo nome. Todos os PDFs abertos e conferidos por dentro: município CAETITÉ e competência certos.
Último mês entregue em 2026: 09/2026 (Prefeitura enviada 03/11/2026; Câmara 04/11/2026).

ATENÇÃO, documento substituto: o PCMGE015 e o PCMGE016 da Prefeitura de 08/2026 e 09/2026 vieram como DECLARAÇÃO ("será anexado posteriormente... inconsistências entre o Sistema Contábil e o SIGA", DOC/2026-09_PCMGE015_DECLARACAO.pdf). Usei os demonstrativos CONSOLIDADOS da mesma prestação de 09/2026, entregues ao TCM pela própria prefeitura: PCMGE065 (despesa, Prefeitura + Câmara, ação por ação) e PCMGE066 (receita). A soma das ações do PCMGE065 bate centavo a centavo com a linha "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" e o Legislativo do PCMGE065 bate com o PCMGE015 próprio da Câmara de 09/2026.

## Receita ("arrecadou"), mesmo critério nos três anos: já sem a parte do Fundeb
- 2024: R$ 236.845.895,65 → DOC/2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário), linha 27 "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas → fala "236 milhões e 800 mil" · tela · legenda. Confere com DOC/2024-12_PCMGE016.pdf linha 630 "Total (a+b+c+d-e)" (já descontadas as deduções do Fundeb, linha 629).
- 2025: R$ 252.891.003,24 → DOC/2025-13_ANUAL_PCAGO015.pdf linha 27 "SUBTOTAL DAS RECEITAS (III)", Receitas Realizadas → fala "252 milhões e 900" · tela · legenda. Confere com DOC/2025-12_PCMGE016.pdf linha 583 "Totais" (arrecadada 258.168.737,76 − anulada 5.277.734,52). Coluna "Arrecadada" do SIGA já vem líquida do Fundeb (FPM cota mensal 55.488.741,50 com dedução 14.009.352,12 = 20,2% do bruto, linha 114).
- 2026 jan–set: R$ 195.578.244,82 → DOC/2026-09_PCMGE066.pdf linha 642 "Total (a+b+c+d-e)", coluna Arrecadado até Mês (= linha 629 "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA"; deduções do Fundeb 17.565.830,56 já tiradas, linha 641) → fala "195 milhões e 600" · tela · legenda. A Câmara não arrecada.

## Despesa total ("gastou")
- 2024: R$ 220.806.963,19 → DOC/2024-13_ANUAL_PCAGO015.pdf linha 93 "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Empenhadas (= soma do Anexo 9, DOC/2024-13_ANUAL_PCAGO007.pdf) → fala "220 e 800". Sobra (conta própria): 236.845.895,65 − 220.806.963,19 = 16.038.932,46 → "Sobraram 16 milhões".
- 2025: R$ 252.121.090,23 → DOC/2025-13_ANUAL_PCAGO015.pdf linha 94 "SUBTOTAL DAS DESPESAS (XI)", Empenhadas (= soma do Anexo 9) → gancho "252 milhões" e fala "252 e 100". Sobra (conta própria): 252.891.003,24 − 252.121.090,23 = 769.913,01 → "Sobraram só 770 mil".
- 2026 jan–set, liquidado: R$ 207.786.124,68 → DOC/2026-09_PCMGE065.pdf linha 3429 "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA", coluna Liquidado No Ano (Prefeitura + Câmara) → "Já gastou 207 e 800".
- 2026 a mais (conta própria): 207.786.124,68 − 195.578.244,82 = 12.207.879,86 → "12 milhões e 200 a mais do que arrecadou" · tela (torre vermelha).
- 2026 empenhado: R$ 227.226.899,63 → mesma linha 3429, coluna Empenhado No Ano → "já se comprometeu com 227 milhões".

## Despesa por setor (função). 2024 e 2025: Anexo 9, empenhado. 2026: soma das ações do PCMGE065 por função (conta própria, liquidado no ano; soma total = linha 3429)
Anexo 9 2024 = DOC/2024-13_ANUAL_PCAGO007.pdf, linhas "Total" 21 (funções 01–09), 95 (10–17), 169 (18–25), 243 (26–28). Anexo 9 2025 = DOC/2025-13_ANUAL_PCAGO007.pdf, linhas 23, 97, 171, 245. Leitor: scripts/anexo9ct.py (soma = Balanço nos dois anos).
- Educação (12): 2024 R$ 81.099.079,03 (l.95) "81 e 100" · 2025 R$ 94.093.267,01 (l.97) "94 e 100" · 2026 R$ 79.402.422,63 "79 e 400" (= "TOTAL DO ÓRGÃO" Sec. de Educação, PCMGE065 linha 3392, Liquidado)
- Saúde (10): 2024 R$ 60.391.664,27 (l.95) "60 e 400" · 2025 R$ 68.648.876,04 (l.97) "68 e 600" · 2026 R$ 50.951.205,57 "51 milhões"
- Administração (04): 2024 R$ 29.552.705,95 (l.21) "29 e 600" · 2025 R$ 27.743.078,28 (l.23) "27 e 700" · 2026 R$ 24.608.900,20 "24 e 600". Inclui a gestão da Sec. de Serviços Públicos, PASEP, gabinete e trânsito.
- Obras e serviços urbanos (15 Urbanismo: limpeza pública, pavimentação, obras, gestão da Sec. de Recursos Hídricos): 2024 R$ 11.793.068,30 (l.95) "11 e 800" · 2025 R$ 17.655.201,81 (l.97) "17 e 700" · 2026 R$ 15.859.589,45 "15 e 900"
- Câmara (01): 2024 R$ 7.881.269,12 (l.21; = DOC/2024-12_CAMARA_PCMGE015.pdf linha 184) "7 e 900" · 2025 R$ 9.213.964,76 (l.23) "9 e 200" (o PCMGE015 da Câmara 12/2025 linha 187 traz 9.214.117,06; diferença de R$ 152,30, uso o Balanço) · 2026 R$ 7.322.895,10 (DOC/2026-09_CAMARA_PCMGE015.pdf linha 170 e PCMGE065 linha 42) "7 e 300"
- Dívidas (28 Encargos Especiais, ação "Gestão da dívida pública municipal"): 2024 R$ 7.258.990,50 (l.243) "7 e 300" · 2025 R$ 6.418.096,20 (l.245) "6 e 400" · 2026 R$ 5.761.765,50 "5 e 800"
- Cultura (13): 2024 R$ 5.319.248,55 (l.95) "5 e 300" · 2025 R$ 5.137.223,49 (l.97) "5 e 100" · 2026 R$ 5.146.085,42 "5 e 100"
- Assistência social (08): 2024 R$ 5.620.889,65 (l.21) "5 e 600" · 2025 R$ 6.673.096,00 (l.23) "6 e 700" · 2026 R$ 6.169.091,19 "6 e 200"
- Água e saneamento (17): 2024 R$ 2.502.284,39 (l.95) "2 e 500" · 2025 R$ 2.834.871,55 (l.97) "2 e 800" · 2026 R$ 2.762.581,48 "2 e 800"
- Agricultura (20): 2024 R$ 904.076,40 (l.169) "904 mil" · 2025 R$ 913.929,27 (l.171) "914 mil" · 2026 R$ 881.110,42 "881 mil". Quase tudo na ação de gestão da Sec. de Desenvolvimento Econômico; não usado no roteiro como "zero" porque poços e água rural ficam na Sec. de Recursos Hídricos (ver processo TCM 15430e25).
- Esporte (27): 2024 R$ 879.466,45 (l.243) "879 mil" · 2025 R$ 1.227.870,62 (l.245) "1 e 200" (fala) · 2026 R$ 519.286,46 "519 mil"
- Meio ambiente (18): 2024 R$ 2.269.064,43 (l.169) "2 e 300" · 2025 R$ 2.131.665,39 (l.171) "2 e 100" · 2026 R$ 1.345.916,85 "1 e 300"
- Fora da fala (para a legenda, se couber): Transporte (26) 2.926.440,60 / 3.175.030,52 / 3.756.915,02; Previdência (09) 516.000,00 / 2.155.058,43 / 1.842.438,53; Judiciária (02, sentenças trabalhistas) 580.631,73 / 1.998.410,64 / 28.731,70; Energia (25, iluminação pública) 1.300.489,39 / 2.081.121,52 / 1.368.356,62; Habitação (16) 0 / 0 / 0 (ações previstas de melhoria habitacional e programas de habitação, empenhado zero nos três anos).

## Achado 1: festas (ação 13.392 "Comemoração de festividades cívicas, educativas e folclóricas", Sec. de Cultura, Esporte, Lazer e Turismo)
- 2024: R$ 3.908.327,66 empenhado → DOC/2024-12_PCMGE015.pdf linha 1037 "TOTAL DA AÇÃO" (ação na linha 1026) → "3 milhões e 900". Previsto no início: 3.662.118,28.
- 2025: R$ 4.411.285,55 empenhado → DOC/2025-12_PCMGE015.pdf linha 2568 "Total do Projeto/Atividade" (ação 1.6000.13.392.18.2.2050, linha 2543) → "4 milhões e 400".
- 2025 bandas: R$ 1.836.000,00 → mesmo arquivo linha 2561, elemento 3.3.90.39.94 "Serviços de banda ou grupo musical", Empenhos Até Mês → "Só em bandas, 1 milhão e 800".
- 2026 jan–set: R$ 4.958.790,85 liquidado (empenhado 5.023.974,20; previsto 6.256.532,00) → DOC/2026-09_PCMGE065.pdf linha 1087 "TOTAL DA AÇÃO" (ação na linha 1076) → "já são 5 milhões" e "Já passou o ano inteiro de 2025" (4.958.790,85 > 4.411.285,55).
- "A maior parte do dinheiro dela": festas ÷ cultura = 73% (2024), 86% (2025), 96% (2026). Conta própria.
- Fonte de recurso: 1500 (recursos livres da prefeitura) nas linhas da ação.

## Achado 2: contratos por tempo determinado (elemento 3.1.90.04 "Contratação por tempo determinado", todas as ações da Prefeitura; a Câmara empenhou 0 nesse elemento) · CONTA PRÓPRIA, script scripts/elem_temp.py
- 2024: R$ 42.976.039,28 empenhado → soma das 95 linhas 3.1.90.04 de DOC/2024-12_PCMGE015.pdf (coluna Empenhado No Ano) → "43 milhões".
- 2025: R$ 38.371.624,58 empenhado → soma das linhas 3.1.90.04.xx de DOC/2025-12_PCMGE015.pdf (Empenhos Até Mês) → "38 milhões e 400".
- 2026 jan–set: R$ 35.176.505,85 liquidado (empenhado 37.980.410,15) → soma das 94 linhas 3.1.90.04 de DOC/2026-09_PCMGE065.pdf (Liquidado No Ano) → "35 milhões e 200".
- Concurso de 2024: ação 04.128.002.2.045 "Realização de concurso público" R$ 669.991,00 empenhado → DOC/2024-12_PCMGE015.pdf linha 656. Notícias: Concursos no Brasil, 07/02/2024, "Concurso Prefeitura de Caetité – BA abre 154 vagas" (Edital 01/2024, IBAM), https://concursosnobrasil.com/concursos/ba/2024/02/07/concurso-prefeitura-de-caetite ; e 20/04/2024, "Concurso Prefeitura de Caetité – BA: ganhos de até R$ 4,5 mil" (Edital 02/2024, 63 vagas, IBAM), https://concursosnobrasil.com/concursos/ba/2024/04/20/concurso-prefeitura-de-caetite-ba/ → "A prefeitura fez concurso em 2024".

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município CAETITE, consulta 08/11/2026 03:48)
- 10528e23 · Representação do Ministério Público · PM Caetité · "Suposta contratação exacerbada de pessoal sem concurso público, nos exercícios financeiros de 2021 a 2023" · julgamento 07/10/2026, publicação no DOE 15/10/2026 · Deliberação: "PROCEDÊNCIA", "multa no valor de R$ 1.500,00" ao gestor, determinação de não fazer novas contratações temporárias sem seleção e de deflagrar concurso público → DOC/decisoes/2023_delib_10528e23.pdf (texto linhas 618–655), https://www.tcm.ba.gov.br/sistemas/textos/2023/delib/10528e23.odt.pdf → fala "julgou procedente... multa de 1.500 reais... mandou fazer concurso. Cabe recurso." (sem nome).
- 09108e26 · Tomada de Contas Especial · "Recolhimento em atraso das obrigações patronais previdenciárias com retenção de multa e juros no FPM..." · exercício 2021 · sem decisão publicada → "um sobre atraso no pagamento da previdência" (em análise). Também 32941e25 (previdência 2021–2023, sem decisão).
- 31092e26 · Termo de Ocorrência · "Pagamento a maior de servidores da Assessoria Jurídica Municipal" · exercício 2025 · sem decisão publicada → "outro sobre pagamento a mais na assessoria jurídica, em 2025".
- Também listados (fora da fala): 13491e25 (advogados da assessoria jurídica 2021–2025; julgado 27/08/2025, "Provimento Parcial"); 15430e25 (perfuração e limpeza de poços pela Sec. de Recursos Hídricos, 2025, sem decisão); 26047e24 (Câmara, transparência, 2024; julgado 29/04/2026, "Provimento Parcial").

## Notícias conferidas (08/11/2026)
- Busca de obra do Estado em Caetité em 2026: nenhuma obra estadual com notícia confirmada; a FIOL (ferrovia) é federal. Nada de obra do Estado no roteiro.
- Busca de São João/festas de Caetité 2026 na imprensa: sem matéria específica; o roteiro só usa os valores das contas.
- Concurso: ver Achado 2.
