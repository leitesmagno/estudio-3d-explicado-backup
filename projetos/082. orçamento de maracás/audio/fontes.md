# Fontes · 082. orçamento de Maracás (BA)

Todos os documentos foram baixados do e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 09/11/2026, entre 09h27 e 10h05, e estão salvos em PDF (com o texto em .txt ao lado) em `~/Documents/RECEITAS-DESPESAS-MARACAS/documentos_tcm/`. Conferido o nome "MARACAS/MARACÁS" dentro de cada PDF. e-TCM: município 248; Prefeitura UJ 852; Câmara UJ 281; nenhuma autarquia com prestação própria.
"Gastou" = despesa LIQUIDADA (regra 32). Valores arredondados na fala; exatos na tela e nas folhas. "linha" = linha do .txt do mesmo nome.

## Totais do ano (fala, tela, capa e legenda)
| Valor no documento | Arquivo | Onde | Coluna | No vídeo |
|---|---|---|---|---|
| 160.957.838,13 | 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024) | linha 20 "SUBTOTAL DAS RECEITAS"; igual ao PCMGE016 dez/2024 linha 632 | Receitas realizadas | "arrecadou 161 milhões" (abertura e 2024) |
| 158.984.731,19 | 2024-13_ANUAL_PCAGO015.pdf | linha 102 | Despesas liquidadas | "gastou 159 milhões"; diferença 1.973.106,94 ("quase 2 milhões a menos", conta própria) |
| 166.617.799,89 | 2025-13_ANUAL_PCAGO015.pdf (Balanço 2025) | linha 27; igual ao PCMGE016 dez/2025 linha 466 | Receitas realizadas | "166 milhões e 600" |
| 160.434.660,08 | 2025-13_ANUAL_PCAGO015.pdf | linha 65; = Prefeitura 154.108.789,34 (2025-12_PCMGE015 linha "Total:") + Câmara 6.325.870,74 (2025-12_CAMARA_PCMGE015 linha 210) | Liquidadas | "gastou 160 milhões e 400"; diferença 6.183.139,81 ("6 milhões e 200 a menos") |
| 131.634.975,43 | 2026-09_PCMGE066.pdf (consolidado receita set/2026) | linha 627 e 635 | Arrecadação até mês | "131 milhões e 600 até setembro" (o PCMGE016 da Prefeitura dá 131.634.975,42, linha 366) |
| 133.355.274,26 | 2026-09_PCMGE015.pdf (Prefeitura, set/2026) | linha 8496 | Liquidações até mês | parte do "já gastou 138 milhões" |
| 4.605.136,35 | 2026-09_CAMARA_PCMGE015.pdf (Câmara set/2026, escaneado) | linha 187 / página 4 | Liquidações até mês | parte do "já gastou 138 milhões" (133.355.274,26 + 4.605.136,35 = 137.960.410,61; 6.325.435,18 a mais do que arrecadou, conta própria) |
| empenhado 2026: 170.759.530,39 + 6.580.064,25 = 177.339.594,64 | os dois PCMGE015 acima | linhas 8496 e 187 | Empenhos até mês | só na legenda |

## Setores (fala, plaquinhas e folhas)
Método: soma do LIQUIDADO de cada ação do PCMGE015 de dezembro/2024 (Betha consolidado, inclui a Câmara), dezembro/2025 e setembro/2026 (SIGA, Prefeitura + Câmara), classificada pela SECRETARIA (órgão), porque em 2026 a manutenção de cada secretaria passou para a função 04 (Administração). Regras (scripts/setores.py):
- Câmara = função 01. Dívidas e encargos = função 28 (dívida, PASEP, precatórios, INSS, restituições), menos o Garantia-Safra.
- Saúde = função 10. Água = subfunção 544 (sistema de abastecimento de água; em 2026 poços artesianos e cisternas, função 17).
- Agricultura e feira = resto da Sec. de Desenvolvimento Econômico, Agricultura, Abastecimento, Meio Ambiente e Turismo (manutenção da secretaria, feira livre, sementes, Garantia-Safra).
- Cultura e festas = função 13 (+ manutenção da nova Sec. de Cultura em 2026). Esporte = função 27. Educação = função 12 (+ função 04 da Sec. de Educação em 2026).
- Assistência social = funções 08, 14 (conselho tutelar) e 16 (habitação) e a Sec. de Desenvolvimento Social.
- Obras, limpeza e estradas = Sec. de Infraestrutura (urbanismo, limpeza, iluminação, estradas vicinais, defesa civil, manutenção). Administração = o resto (gabinete, administração e finanças, planejamento, procuradoria, guarda municipal).
Soma dos 11 setores = total liquidado do ano (diferença 0,00 nos três anos).

| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 57.012.517,91 | 62.759.935,55 | 52.044.880,14 |
| Saúde | 40.191.799,20 | 46.179.660,49 | 38.732.001,83 |
| Administração | 7.665.883,11 | 9.546.175,65 | 5.371.754,61 |
| Obras, limpeza e estradas | 27.716.639,55 | 20.003.229,64 | 18.894.678,93 |
| Câmara | 4.699.899,19 | 6.325.870,74 | 4.605.136,35 |
| Dívidas e encargos | 1.908.414,47 | 3.659.529,55 | 3.367.394,46 |
| Cultura e festas | 4.327.528,80 | 2.405.035,66 | 3.754.572,15 |
| Assistência social | 7.275.625,12 | 6.107.331,77 | 6.907.161,71 |
| Água | 1.893.091,34 | 760.899,99 | 667.414,95 |
| Agricultura e feira | 4.222.774,71 | 1.763.698,94 | 3.329.153,20 |
| Esporte | 2.070.557,79 | 923.292,10 | 286.262,28 |
| TOTAL | 158.984.731,19 | 160.434.660,08 | 137.960.410,61 |
Arquivos: saida/acoes_2024-12_PCMGE015.json, acoes_2025-12_PCMGE015.json, acoes_2025-12_CAMARA_PCMGE015.json, acoes_2026-09_PCMGE015.json, acoes_2026-09_CAMARA_PCMGE015.json (Câmara 2026 lida da imagem do PDF, conferida pelas colunas empenhado − não pago e pelo total 4.605.136,35).

## Achados (fala e tela)
| Valor | Arquivo | Linha | Coluna | No vídeo |
|---|---|---|---|---|
| 3.329.096,22 liquidado; inicial 1.742.600,00 | 2024-12_PCMGE015.pdf | 1474 (ação 13.392.0008.2.020 "Promoção e realização de atividades culturais e festejos tradicionais") | Liq. até o mês / Dotação inicial | "ação de festejos levou 3 milhões e 300, a lei previa 1 milhão e 700" |
| 3.690.693,94 liquidado; fixada 1.372.086,11 | 2026-09_PCMGE015.pdf | 2926 (ação 2044 "Realizações de eventos culturais e comemorativos", Sec. de Educação, Cultura, Esporte e Lazer) | Liquidações até mês / Fixada | "eventos já levou 3 milhões e 700; previsão 1 milhão e 400"; "passaram do dobro" (3.690.693,94 ÷ 1.372.086,11 = 2,69, conta própria). A mesma ação na nova Sec. de Cultura (linha 8389) tinha fixada 0,00 e liquidado 0,00 |
| bandas 2026: 1.130.000,00 + 631.000,00 + 718.680,00 = 2.479.680,00 | 2026-09_PCMGE015.pdf | 2914, 2916, 2918 (elemento 3.3.90.39.94 "Serviços de banda ou grupo musical") | Liquidações até mês | "só com bandas, 2 milhões e 500" |
| 1.801.894,84 | 2025-12_PCMGE015.pdf | 328 (ação "Manutenção Gabinete do Prefeito", elemento 3.3.90.39.95 "Locação, confecção e montagem de cenários, palcos...") | Liquidações até mês | "gabinete do prefeito pagou 1 milhão e 800 em montagem de palcos e cenários" |
| 998.082,00 | 2026-09_PCMGE015.pdf | 7449 (Sec. de Agricultura, ação "Manutenção dos serviços técnicos e apoio administrativo", elemento 3.3.90.39.95) | Liquidações até mês | "a agricultura pagou quase 1 milhão em palcos" |
| 726.000,00 inicial; 0,00 liquidado | 2026-09_PCMGE015.pdf | 7781 a 7787 (ação 2111 "Incentivo ao agricultor familiar"; dotação reduzida para 196.000,00) | Fixada / Liquidações até mês | "previa 726 mil, gasto zero" |
| 10.387,56 | 2026-09_PCMGE015.pdf | 7740 (ação 2100 "Distribuição de sementes, mudas e insumos") | Liquidações até mês | "sementes e mudas: 10 mil" |
| habitação 2026: 260.000,00 + 350.000,00 + 1.000.000,00 = 1.610.000,00 fixados; 0,00 liquidado | 2026-09_PCMGE015.pdf | 2516/2521, 2522/2527, 7049/7051 (função 16: "Qualificação das políticas habitacionais", "Gestão das políticas habitacionais", "Construção de unidades habitacionais") | Fixada / Liquidações até mês | "três ações de moradia somavam 1 milhão e 600; gasto zero". Conferido: não há outra ação de habitação com gasto em 2026 (funções 08 e 16) |
| Câmara 2025 6.325.870,74 x assistência 2025 6.107.331,77 | 2025-12_CAMARA_PCMGE015 linha 210; 2025-12_PCMGE015 linha 2718 (Total do Órgão Sec. Desenvolvimento Social) | | Liquidações até mês | "Câmara gastou mais do que toda a assistência social" |

## Câmara: duodécimo (folhas)
| Valor | Arquivo | Linha | No vídeo |
|---|---|---|---|
| recebeu 5.409.844,20; devolveu 628.548,27 (2024) | 2024-13_CAMARA_PCAGE062.pdf | 7 (Transferência financeira recebida / concedida). Documento sem nome da cidade: confirmado pela Despesa Orçamentária 4.699.899,19 = Câmara de Maracás no PCMGE015 consolidado | folha Câmara 2024 |
| recebeu 6.615.483,03; devolveu 283.111,80 (2025) | 2025-13_CAMARA_PCAGE062.pdf | 8 (Despesa orçamentária 6.325.870,74 confere) | folha Câmara 2025 |
| recebeu 5.045.627,34 até setembro (2026) | 2026-09_CAMARA_PCMGE018.pdf | 333/375 (4.5.1.1.2.02 Repasse recebido, 9 parcelas de 560.625,26) | folha Câmara 2026 |

## Receita (só nas folhas; na fala só o total)
saida/receita_2024-12_PCMGE016.json (Betha, coluna Arrec. até o mês, deduções do Fundeb 9.1.x somadas), receita_2025-12_PCMGE016.json e receita_2026-09_PCMGE016.json (SIGA, arrecadada + anulada até o mês). Cada folha soma o total do ano (diferença 0,00). Royalties = Compensação Financeira pela Exploração de Recursos Minerais (CFEM) + petróleo + recursos hídricos (1.7.1.2). Emendas Pix 2026 = 2.4.1.9.51 Transferência Especial da União 2.288.500,00.

## Tribunal de Contas
TCM-BA › Consulta › Decisões › Auditoria, município MARACÁS, consulta 09/11/2026 ~10h05. Texto salvo em ~/Documents/RECEITAS-DESPESAS-MARACAS/decisoes/decisoes_2026-11-09.txt. 10 processos com exercício 2024, 2025 ou 2026 (9 da Prefeitura, 1 da Câmara), entre eles 20891E24 (contrato de pavimentação asfáltica), 06342E26 (edital de pavimentação em paralelepípedo), 22771E25 e 15090E26 (contratos de escritórios de advocacia). Resultado de cada processo não aberto: o vídeo diz só "constam" e "estar no tribunal não é condenação".

## Conferências
- 1ª conferência (09/11/2026 ~10h40): cada número do roteiro achado na linha citada acima (grep no .txt).
- 2ª conferência (09/11/2026 ~11h30, antes da entrega): valores da fala, das plaquinhas, da capa (3,7 mi e 1,4 mi) e da legenda conferidos de novo nas linhas acima; folhas somam o total de cada ano e setor (diferença 0,00).
