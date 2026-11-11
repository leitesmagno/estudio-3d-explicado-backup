# Fontes: 085. orçamento de Ituberá (BA)

Consulta: 09/11/2026 (e-TCM, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam). Pasta dos documentos: ~/Documents/RECEITAS-DESPESAS-ITUBERA/documentos_tcm/ (abreviada DOC/ abaixo; ao lado de cada PDF há o .txt extraído).
e-TCM: município 204 ITUBERÁ, Prefeitura UJ 808, Câmara UJ 237 (sem autarquias; Fundo Municipal de Saúde e demais fundos vêm dentro da Prefeitura). Todos os 26 PDFs conferidos pelo nome do município no cabeçalho (2026-11-09).
"Gastou" = despesa LIQUIDADA (regra 32). Sem porcentagem, sem nome de gestor.

## Receita (fala: "arrecadou")
- 132.406.282,73 → DOC/2024_PCAGO015.pdf (Balanço Orçamentário 2024), linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas → fala abertura e bloco 2024 ("132 milhões e 400"), folha de receita 2024.
- 7.451.932,23 → DOC/2024_PCAGO008.pdf (Anexo 10 2024), código 2.1.0.0.00 Operações de Crédito, coluna Arrecadado Ano → fala 2024 ("empréstimo de 7 milhões e 400"), folha de receita 2024.
- 138.744.065,21 → DOC/2025_PCAGO015.pdf, SUBTOTAL DAS RECEITAS (III), Realizadas; igual ao total do DOC/2025-12_PCMGE016.pdf → fala ("138 milhões e 700"), folha 2025.
- 112.954.289,82 → DOC/2026-09_PCMGE016.pdf, linha TOTAL: arrecadada até o mês 112.970.250,26 menos anulada até o mês 15.960,44 → fala ("113 milhões até setembro"), folha 2026.
- Itens das folhas de receita: 2024 de DOC/2024_PCAGO008.pdf (scripts/anexo10.py e anexo10b.py; Fundeb = 1.7.5 23.105.191,30 + VAAT 9.005.246,54 + VAAF 7.451.892,61 + VAAR 352.888,51); 2025 e 2026 do PCMGE016 (tools/lista_pdf/lista_pdf.py receita). Soma das linhas = total (diferença 0,00, linha "Outras receitas").

## Despesa total (fala: "gastou")
- 2024: liquidado 131.226.658,37 → DOC/2024_PCAGO015.pdf, SUBTOTAL DAS DESPESAS (XI), coluna Despesas Liquidadas → fala "131 milhões e 200"; "sobrou 1 milhão e 200" = 132.406.282,73 − 131.226.658,37 = 1.179.624,36 (conta própria). Empenhado 131.378.319,60 (= Anexo 9 2024, DOC/2024_PCAGO007.pdf, inclui a Câmara 3.801.999,93).
- 2024 por setor: DOC/2024_PCMGE015.pdf (dez/2024, consolidado Câmara + Prefeitura + Fundo de Saúde, coluna Liquidado no Ano), total 131.277.580,76 (diferença de 50.922,39 para o Balanço; os setores somam o PCMGE015).
- 2025: liquidado 143.413.430,88 → DOC/2025_PCAGO015.pdf (XI, Liquidadas) = Prefeitura DOC/2025-12_PCMGE015.pdf 139.108.420,19 ("Total do Poder", Liquidações até mês) + Câmara DOC/2025-12_CAMARA_PCMGE015.pdf 4.305.010,69 → fala "143 milhões e 400"; "4 milhões e 700 a mais" = 143.413.430,88 − 138.744.065,21 = 4.669.365,67 (conta própria).
- 2026 até setembro: liquidado 110.798.773,54 = Prefeitura DOC/2026-09_PCMGE015.pdf 107.551.098,86 + Câmara DOC/2026-09_CAMARA_PCMGE015.pdf 3.247.674,68 (bate com o liquidado do mês do consolidado DOC/2026-09_PCMGE065.pdf) → fala "110 milhões e 800". Empenhado 126.673.289,71 + 4.549.563,10 = 131.222.852,81 → fala "comprometeu 131 milhões e 200".

## Setores (liquidado; leitura em ~/Documents/RECEITAS-DESPESAS-ITUBERA/saida/setores_bruto.json, scripts/setores.py)
Mapa de funções: Educação 12; Saúde 10; Administração 4 + 2 (Procuradoria); Obras, limpeza e iluminação 15 (Urbanismo: limpeza, iluminação, pavimentação, estradas vicinais, prédios); Câmara 1; Dívidas e encargos 28 (amortização de dívida, PASEP, sentenças); Cultura e festas 13 + 23; Assistência social 8 (+14, 16 zerados); Agricultura e pesca 20; Meio ambiente 18 (+17 zerado); Esporte 27.
- 2024: Educação 48.601.536,47 · Saúde 26.362.347,34 · Administração 14.192.545,75 · Obras 26.860.806,23 · Câmara 3.801.999,93 · Dívidas e encargos 2.868.474,14 · Cultura e festas 2.592.932,37 · Assistência 4.490.426,22 · Agricultura e pesca 789.788,05 · Meio ambiente 22.020,00 · Esporte 694.704,26 (DOC/2024_PCMGE015.pdf).
- 2025: Educação 58.447.168,10 · Saúde 29.834.961,07 · Administração 15.197.224,73 · Obras 22.492.630,86 · Câmara 4.305.010,69 · Dívidas e encargos 3.948.287,96 · Cultura e festas 3.377.019,83 · Assistência 3.816.124,80 · Agricultura e pesca 1.074.531,29 · Meio ambiente 45.600,00 · Esporte 874.871,55 (DOC/2025-12_PCMGE015.pdf + CAMARA).
- 2026 até set: Educação 46.157.432,87 · Saúde 22.530.152,16 · Administração 10.621.301,92 · Obras 16.931.468,09 · Câmara 3.247.674,68 · Dívidas e encargos 3.026.238,76 · Cultura e festas 4.201.280,89 · Assistência 2.802.337,11 · Agricultura e pesca 635.493,17 · Meio ambiente 13.544,00 · Esporte 631.849,89 (DOC/2026-09_PCMGE015.pdf + CAMARA).

## Achados (fala no fim)
- Ação "Apoio às celebrações culturais e realização dos eventos" (13.695.11.2.061 / 2061): 2024 2.392.952,55 (DOC/2024_PCMGE015.pdf); 2025 3.372.513,18 (DOC/2025-12_PCMGE015.pdf); 2026 até set 4.018.384,29 liquidado, 5.202.545,52 empenhado, dotação 5.429.000,00 (DOC/2026-09_PCMGE015.pdf) → fala "2 milhões e 400, 3 milhões e 400, já 4 milhões".
- 2025, mesma ação, elemento 3.3.90.39.94 "Serviços de banda ou grupo musical": 2.015.000,00 → fala "bandas e grupos musicais, 2 milhões".
- Ação "Gestão de benefícios eventuais" (8.244.14.2.206 / 2206), elemento 3.3.90.32 material de distribuição gratuita: 2024 182.575,50; 2025 122.387,31; 2026 até set 92.790,19 → fala "183 mil, 122 mil, 93 mil".
- Agricultura e pesca 2026: ações Revitalização da feira (dot 14.000), Mercados agrícola e municipal (10.000), Centro de comercialização da agricultura familiar (67.000), Viveiro municipal (35.000), Agricultura familiar (14.000), Casa do pescador (15.000), Empreendedorismo (16.000): liquidado 0,00 cada. Só liquidaram as ações de pessoal e manutenção das secretarias de Agricultura (361.874,51 + 93.021,52) e de Pesca (172.543,90 + 8.053,24) = 635.493,17 (DOC/2026-09_PCMGE015.pdf). Em 2025 também só pessoal e manutenção. → fala "gastaram zero; só saíram salários e manutenção".
- Meio ambiente 2026: função 18 = Manutenção das ações de meio ambiente 13.544,00; "Adm. de pessoal e encargos da Sec. do Meio Ambiente" (função 4, 2.1501.4.122.15.2.2146) 203.543,72 → fala "14 mil" e "204 mil".
- Pessoal 2025 (todos os elementos 3.1, Prefeitura + Câmara): 75.612.474,81; contratação por tempo determinado 3.1.90.04: 16.394.910,72 (scripts: soma dos elementos de saida/acoes_2025*.json; soma dos elementos = total liquidado, diferença 0,00) → fala "75 milhões e 600, sendo 16 milhões e 400".
- Câmara: recebeu da prefeitura (repasse 4.5.1.1.2.02, creditado no ano) 2024 3.802.376,04 (DOC/2024-12_CAMARA_PCMGE018.pdf), devolveu 3.576,11 (3.5.1.1.2.02); 2025 recebeu 4.504.648,11, devolveu 199.637,42 (DOC/2025-12_CAMARA_PCMGE018.pdf); 2026 até set recebeu 3.558.523,34 (DOC/2026-09_CAMARA_PCMGE018.pdf). → folhas da Câmara.

## Tribunal (fala)
- TCM-BA › Decisões › Auditoria, município ITUBERA (https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/, consulta 09/11/2026 ~05h30), lista salva em DOC/decisoes/TCM_auditoria_ITUBERA_2026-11-09.txt. Processos citados: 18962E26 (contratações artísticas para os festejos juninos, 2026); 14223E26 e 14944E26 (contratação de escritórios de advocacia para recuperar créditos do Fundef/Fundeb, 2026); 23982E25 (transporte escolar, 2025); 23756E24 (pregão eletrônico 009/2024, limpeza pública). Lista sem decisão publicada para esses processos: fala "estar no tribunal não é condenação". Nomes ficam só no arquivo, nunca no vídeo.

## Notícias (conferência interna)
- Busca 09/11/2026 ("Ituberá prefeitura 2026 São João festejos juninos TCM"): nada específico sobre Ituberá; nenhum fato do vídeo depende de notícia.
