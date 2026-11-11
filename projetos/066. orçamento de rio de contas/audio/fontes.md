# Fontes: 066. orçamento de Rio de Contas (BA)

Consulta: 08/11/2026. Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/documentos_tcm/` (abaixo, DOC/).
Todos baixados do e-TCM (Consulta Pública, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 329 "RIO DE CONTAS", Prefeitura (UJ 933) e Câmara (UJ 362). Sem autarquia, instituto de previdência ou empresa com conta própria: o Anexo 9 de 2025 lista só Câmara, Prefeitura e os fundos de saúde, assistência e educação. Os consórcios "Alto do Rio de Contas" e "CIMURC" são entidades à parte e não entram.
Guia seguido na receita: ~/Downloads/Guia Completo TCM-BA - Receita e Despesa.pdf, Parte 2 (passos 4 a 10).
Scripts (conta própria): `~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/scripts/` acoes066.py (ações do PCMGE015), setores.py (setores do vídeo), rec066.py (resumo da receita).

## Documentos
- DOC/2024-13_ANUAL_PCAGO015.pdf: Balanço Orçamentário 2024 (Anexo 12, "CONSOLIDADO", sistema GovNet). DOC/2024-13_ANUAL_PCAGO007.pdf: Anexo 9 de 2024. PCAGO004 (Anexo 6) e PCAGO008 (Anexo 10).
- DOC/2025-13_ANUAL_PCAGO015.pdf: Balanço Orçamentário 2025 (Anexo XII, SIAFIC, processo 10268e26). PCAGO007 (Anexo IX), PCAGO004 (Anexo VI), PCAGO008 (Anexo X).
- DOC/2024-12_PCMGE015.pdf e PCMGE016 (Prefeitura, dez/2024, SIGA); DOC/2025-12_PCMGE015.pdf e PCMGE016 (dez/2025); DOC/2026-09_PCMGE015.pdf e PCMGE016 (set/2026, último mês entregue, enviado em 29/10/2026; o de 10/2026 está pendente no e-TCM).
- DOC/2024-12_CAMARA_PCMGE015.pdf, 2025-12_CAMARA_PCMGE015.pdf (digitalizado; total conferido pelo Anexo IX 2025), 2026-09_CAMARA_PCMGE015.pdf.
- Conferido: soma das ações do PCMGE015 = "Total do Poder" do PDF, centavo a centavo (2024: 62.420.573,07; 2025: 58.452.212,04 empenhado; 2026: 63.453.407,90 empenhado / 51.871.245,58 liquidado). Prefeitura + Câmara = Balanço (2024: 62.420.573,07 + 2.415.462,50 = 64.836.035,57; 2025: 58.452.212,04 + 2.851.943,77 = 61.304.155,81).
- Receita: Balanço = linha "Totais" do PCMGE016 de dezembro (arrecadada menos anuladas), nos dois anos (2024: 65.231.350,91; 2025: 72.249.177,19). 2026 segue o mesmo critério.

## Totais (fala, tela e mapa)
- 2024 arrecadou 65.231.350,91 → DOC/2024-13_ANUAL_PCAGO015, "SUBTOTAL DAS RECEITAS (III)", receitas realizadas → fala "65 milhões e 200", mapa, tela.
- 2024 gastou 64.836.035,57 → mesmo Balanço, "SUBTOTAL DAS DESPESAS (XI)", empenhadas (= liquidadas) → fala "64 milhões e 800".
- 2024 sobra 395.315,34 → mesmo Balanço, "Superávit (XIV)" → fala "Sobraram 400 mil".
- 2025 arrecadou 72.249.177,19 → DOC/2025-13_ANUAL_PCAGO015, "SUBTOTAL DAS RECEITAS (III)" → fala "72 milhões e 200".
- 2025 gastou 61.304.155,81 → mesmo Balanço, "SUBTOTAL DAS DESPESAS (XI)", empenhadas → fala "61 milhões e 300".
- 2025 sobra 10.945.021,38 → mesmo Balanço, "Superávit (XIII)" → fala "Sobraram 10 milhões e 900".
- 2026 até set. arrecadou 60.949.863,86 → DOC/2026-09_PCMGE016, linha 540 "Totais:", Total até Mês (arrecadada até o mês 60.954.425,61 menos anuladas 4.561,75) → fala "60 milhões e 900". Valor DEPOIS das anulações. A coluna "Arrecadada" já vem líquida do Fundeb (ICMS: dedução 1.007.698,26 ÷ (4.030.793,88 + 1.007.698,26) = 20%), como no Balanço.
- 2026 gastou 54.216.743,30 → DOC/2026-09_PCMGE015 "Total do Poder" (linha 3934), coluna Liquidações até Mês 51.871.245,58 + DOC/2026-09_CAMARA_PCMGE015 "Total do Poder", liquidações até mês 2.345.497,72 → fala "54 milhões e 200".
- 2026 empenhou 66.772.904,71 → 63.453.407,90 (Prefeitura, Empenhos até Mês) + 3.319.496,81 (Câmara) → fala "66 milhões e 800", "mais do que arrecadou" (66,8 > 60,9).

## Setores (2024 = Anexo 9 = liquidado do PCMGE015 dez/2024; 2025 = Anexo IX = empenhado do PCMGE015 dez/2025; 2026 = liquidado do PCMGE015 set/2026; todos + Câmara)
Conta própria: scripts/setores.py (soma dos setores = total de cada ano, diferença 0,00). "Dívidas" = ação 2003 "Gestão da dívida pública contratada e encargos gerais" (dentro da função 04), tirada de Administração. "Obras, limpeza e estradas" = funções 15 Urbanismo + 16 Habitação + 25 Energia + 26 Transporte (estradas vicinais).
- Educação (12): 24.160.141,41 / 21.862.118,43 / 19.960.756,01 → "24 milhões e 200" / "21 milhões e 900" / "quase 20 milhões".
- Saúde (10): 16.084.276,56 / 16.110.587,88 / 13.536.639,39 → "16 e 100" / "16 e 100" / "13 e 500".
- Administração (04 sem a dívida): 4.894.394,37 / 5.903.805,56 / 4.591.167,07 → "4 e 900" / "5 e 900" / "4 e 600".
- Obras, limpeza e estradas: 10.267.553,60 / 6.802.697,75 / 6.819.088,77 → "10 e 300" / "6 e 800" / "6 e 800".
- Câmara (01): 2.415.462,50 / 2.851.943,77 / 2.345.497,72 → "2 e 400" / "2 e 900" / "2 e 300".
- Dívidas (ação 2003): 1.951.611,93 / 3.313.554,42 / 1.086.776,59 → "quase 2 milhões" / "3 e 300" / "1 e 100". DOC/2025-12_PCMGE015 linha 616; DOC/2026-09_PCMGE015 linha 550.
- Cultura (13): 2.983.563,57 / 2.820.790,22 / 3.525.074,37 → "quase 3 milhões" / "2 milhões e 800" (gancho e setor) / "3 milhões e 500".
- Assistência social (08): 1.591.695,88 / 1.017.382,61 / 922.190,06 → "1 milhão e 600" / "1 milhão" (gancho e setor) / "920 mil". Procurado fora da função 08 (CRAS, CREAS, idoso, criança, família, benefícios, conselho tutelar): nenhuma ação com gasto.
- Agricultura (20): 273.703,35 / 241.547,47 / 1.008.819,21 → "270 mil" / "240 mil" / "1 milhão" (2026 inclui 714.761,00 da ação "Manutenção de centros de abastecimento, feiras livres e mat." com fonte 1701).
- Esporte (27): 0,00 / 29.022,63 / 27.735,08 → "zero: nenhuma ação teve gasto" / "29 mil" / "28 mil". Zero de 2024 conferido: ações "Incentivo à prática desportiva" (27), "Construção de praças esportivas" (27) e "Construção de quadras poliesportivas" (12) com R$ 0 empenhado em DOC/2024-12_PCMGE015.
- Meio ambiente (18): 101.244,40 / 202.995,16 / 167.609,05 → "100 mil" / "200 mil" / "170 mil".
- Fora da fala (cabem no total): Água e esgoto (17) 0,00 / 757,76 / 757,76 (dotação inicial 2025 da ação de abastecimento: 6.325,00); Turismo e comércio (23) 112.388,00 / 146.952,15 / 224.632,22.

## De onde veio o dinheiro de 2026 (resumo do PCMGE016 set/2026, guia Parte 2, passo 7)
Planilha: `~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/saida/receita-resumo-2026-09.csv` (e a de dez/2025). Cada linha = Arrecadada até Mês + Anulada até Mês; soma = 60.949.863,86 = "Totais" (diferença 0,00, com a linha "Diversas" de 16.357,65 = 1.7.9 outras transferências 16.085,65 + operação de crédito 272,00). Linha mãe nunca somada com filha.
- Próprias (1.1 impostos e taxas + 1.2 contribuições + 1.3 patrimonial + 1.6 + 1.9): 3.945.193,55 → fala "quase 4 milhões", tela.
- União (1.7.1 + 2.4.1 capital): 41.720.155,53 → fala "41 milhões e 700". Inclui FPM 23.497.300,67, SUS 4.935.713,47, FNDE 1.364.958,49, complementação da União ao Fundeb (VAAT/VAAF/VAAR) 7.674.181,55, FNAS 342.662,34, royalties 588.020,12, emenda Pix 3.044.700,00, outras.
- Estado (1.7.2 + 2.4.2 capital): 7.176.591,60 → fala "7 milhões e 200". Inclui ICMS 4.030.793,88, IPVA/IPI 711.582,68, SUS 535.469,04, convênios correntes 1.230.000,00 (linha 368, 1.7.2.4.99, previsto 2.000,00), convênio de capital 650.000,00, assistência 18.746,00.
- Fundeb principal (1.7.5, linha 376): 8.091.565,53 → fala "8 milhões e 100", "voltaram 8 milhões e 100".

### Regra 22 (pedido do Magno/auditor, 08/11/2026): saúde, IPTU e iluminação pública (DOC/2026-09_PCMGE016, Arrecadada até Mês)
- IPTU (1.1.1.2.50, linha 12): Receita Prevista 298.000,00 (ano inteiro); Arrecadada até Mês 175.076,78 → fala "O IPTU previa 298 mil no ano e arrecadou 175 mil até setembro"; tela "IPTU: R$ 175 MIL · PREVISTO NO ANO: R$ 298 MIL". (Régua do mês, conta própria: 9/12 de 298 mil = 223,5 mil; ficou abaixo. Fora da fala.)
- Contribuição para o custeio da iluminação pública (1.2.4.1.50, linha 81): prevista 30.000,00; arrecadada até setembro 13.856,52 → fala "A iluminação pública, 14 mil"; tela "R$ 13,9 MIL · ILUMINAÇÃO PÚBLICA". (2025, DOC/2025-12_PCMGE016 linha 87: 18.264,82 arrecadados, previstos 1.265,00.)
- SUS da União (1.7.1.3, linha 164): 4.935.713,47 → fala "sendo 4 milhões e 900 para a saúde"; tela "SAÚDE: R$ 4,9 MI · SUS DA UNIÃO". Partes: 1.7.1.3.50.1 3.486.000,21; .50.2 153.562,50; .50.3 433.458,66; .50.4 93.383,70; .50.5 769.308,40; 1.7.1.3.51 (estruturação) 0,00.
- SUS do Estado (1.7.2.3, linha 358): 535.469,04 → fala "com 535 mil para a saúde"; tela "SAÚDE: R$ 535 MIL · SUS DO ESTADO".
- SUS de capital (2.4.1.1): não há linha com valor no PCMGE016 de set/2026 (0,00).
- CONFRONTO OBRIGATÓRIO no Fundo Nacional de Saúde (consultafns.saude.gov.br/#/detalhada; ano 2026, Fundo a Fundo, BA, Rio de Contas, repasse Municipal, Data da OB de 01/01/2026 a 30/09/2026; Fundo Municipal de Saúde CNPJ 10.613.120/0001-18; consulta 08/11/2026): Total Geral 5.585.711,42 x TCM 4.935.713,47 → NÃO BATE (diferença 649.997,95). Por bloco: Assistência farmacêutica FNS 93.383,70 = TCM 50.4 93.383,70; MAC (SAMU) 153.562,50 = TCM 50.2; Gestão do SUS (piso da enfermagem) 769.308,40 = TCM 50.5; Atenção primária FNS 4.399.470,21 x TCM 50.1 3.486.000,21 (FNS +913.470,00; inclui a "EMENDA - Incremento temporário ao custeio da APS" de 800.000,00); Vigilância FNS 169.986,61 x TCM 50.3 433.458,66 (TCM +263.472,05). Vira PERGUNTA, nunca acusação (data de crédito da OB, código ou bloco diferente na contabilidade). Fora da fala (o vídeo já tem 1 achado de receita, a emenda Pix); na tela, chip "SUS DA UNIÃO: R$ 4,9 MI (NO FNS, R$ 5,6 MI: DATA OU CÓDIGO?)" e na legenda.
- FPM (fala nova v3): "O FPM, maior repasse da União, chega sem a parte do Fundeb: 5 milhões e 100 até setembro" → 1.7.1.1.51, Deduções até Mês 5.128.985,38; tela "FPM: R$ 23,5 MI · JÁ SEM A PARTE DO FUNDEB" (arrecadada 23.497.300,67).
- FPM (1.7.1.1.51, linha 141): Arrecadada até Mês 23.497.300,67 (líquida) e Deduções até Mês 5.128.985,38 (Fundeb) → fala "chegou com 23 milhões e 500, já sem os 5 milhões e 100 que foram para o Fundeb". Bruto = 28.626.286,05 (conta própria: arrecadada + deduções, guia passo 6).
- Total de deduções para o Fundeb até set. (1.0.0.0 / 1.7.0.0, coluna Deduções até Mês): 6.307.417,37 (FPM 5.128.985,38 + ICMS 1.007.698,26 + IPVA 169.945,55 + ITR 788,18) → fala "a cidade mandou 6 milhões e 300 ao fundo". "Pelo número de alunos": regra do Fundeb (Lei 14.113/2020, art. 3º e distribuição por matrículas).

## Achado de receita (o único do vídeo): emenda Pix de 2026
- 3.044.700,00 → DOC/2026-09_PCMGE016 linha 486, 2.4.1.9.51 "Transferência Especial da União", Arrecadada até Mês (Receita Prevista 0,00 nessa linha; a linha corrente 1.7.1.9.57 previa 200.000,00 e não recebeu nada) → fala "3 milhões de emenda Pix", fecho.
- Conferência federal: Portal da Transparência (CGU), ação 0EC2 TRANSFERENCIAS ESPECIAIS, 05/2026, R$ 3.044.700,00 (igual) → fala "Em maio". TransfereGov (API pública de transferências especiais, CNPJ 14.263.859/0001-06, ano 2026): 3 planos de ação de investimento, 1.094.500,00 e 955.200,00 em "15-Urbanismo / 451-Infraestrutura Urbana" (soma 2.049.700,00 → "2 milhões para infraestrutura urbana") e 995.000,00 em "27-Desporto e Lazer" (→ "quase 1 milhão para esporte"). Arquivo ~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/federal/te_2026.json. Os nomes dos parlamentares não vão ao vídeo.
- Gasto: fonte 1706 (Transferência Especial da União) no DOC/2026-09_PCMGE015: dotação 50.000,00 (ação Planejamento urbano, 4.4.90.51), empenhado 0,00, liquidado 0,00 em todas as ações → fala "essa fonte aparece com zero gasto". Fonte 1700 (convênios da União): 273.571,00 empenhados, 251.338,00 liquidados na pavimentação; as contas não dizem se é a emenda.
- Licitações: PNCP (API de contratações, CNPJ 14.263.859/0001-06, 2026): 13 concorrências eletrônicas, quase todas de pavimentação/calçamento (nº 01 a 13, de março a setembro/2026; ex.: nº 06 de 01/07/2026, R$ 564.890,77, homologada em 518.995,85; nºs 08, 09 e 10 de 10/09/2026) → fala "A prefeitura abriu licitações de calçamento, e as contas não dizem se usam esse dinheiro". Arquivos federal/pncp_m4.json.

## Achado de despesa: cultura x assistência social
- Duas ações da Cultura: "Incentivo às manifestações artísticas" (ação 2021) e "Preservação das manifestações populares, culturais e cívicas" (ação 2008). 2024: 2.834.866 + 0 de 2.983.563,57; 2025: 1.690.428 + 1.113.662 = 2.804.090 de 2.820.790,22; 2026 (liq.): 1.491.368 + 2.033.706 = 3.525.074 de 3.525.074,37 → fala "Quase tudo sai de duas contas de manifestações artísticas e populares". DOC/2025-12_PCMGE015 linhas 747 e 845; DOC/2026-09_PCMGE015 linhas 668 e 717. Elementos: quase tudo "Outros serviços de terceiros, pessoa jurídica" (3.3.90.39.99).
- Convênio do Estado: fonte 1701 (transferências de convênios dos Estados) na ação 2021 de 2026, elemento 3.3.90.39.99: empenhado e liquidado 1.254.600,00 → fala "Em 2026, 1 milhão e 250 veio de convênio com o Estado". Do lado da receita, 1.7.2.4.99 "Outras transferências de convênios dos Estados" 1.230.000,00 (previsto 2.000,00).
- "já passa de três vezes": 3.525.074,37 ÷ 922.190,06 = 3,8 (conta própria) → fala e fecho "mais que o triplo". Gancho de 2025: 2.820.790,22 x 1.017.382,61.

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município RIO DE CONTAS, consulta 08/11/2026, https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/)
- 31710e25: Representação do Ministério Público, PM Rio de Contas, "Supostas irregularidades em despesas públicas do carnaval 2025", sem data de julgamento → fala "o Ministério Público questiona as despesas do carnaval de 2025... ainda sem julgamento".
- 21143e26: Representação do Ministério Público, PM Rio de Contas, "Supostas irregularidades no Contrato de limpeza pública", sem data de julgamento → fala "e o contrato da limpeza".
- Outros sem julgamento (fora da fala): 00801e25 e 01662e25 (gestão de 2024), 16371e25 (LRF 2024), 32049e25 (contratações temporárias), 31734e25 (Câmara). 00208e24 (pregão 070/2023) julgado em 30/09/2026, provimento parcial.

## Notícias
- Bahia Notícias, 26/10/2026, "Justiça notifica prefeito de Rio de Contas por superfaturamento em contratos de limpeza urbana", https://www.bahianoticias.com.br/municipios/noticia/53096-justica-notifica-prefeito-de-rio-de-contas-por-superfaturamento-em-contratos-de-limpeza-urbana : decisão do TCM publicada no Diário Oficial do TCM em 25/10/2026 manda suspender os repasses do acréscimo de 2026 no contrato de limpeza urbana e voltar ao valor de 2025, até o julgamento → fala "Segundo o Bahia Notícias, em outubro, o Tribunal suspendeu o aumento de 2026 desse contrato". (A matéria fala em "Justiça", mas a decisão é do TCM; os valores mensais citados nela não vão ao vídeo.)
- Estado / Sufotur: página "Carnaval de Rio de Contas 2026" (https://www.ba.gov.br/carnaval/atracoes/cidades/329-rio-de-contas/carnaval-de-rio-de-contas-2026) descrevia o evento como parceria da Prefeitura com o Governo da Bahia via Sufotur (página fora do ar em 08/11/2026 pelo período eleitoral; lida no resumo da busca). Fora da fala.
- Obras do Estado: plano do Governo da Bahia (Bahia Notícias 48912) cita a BA-148 (Rio de Contas a Casa de Telha e Arapiranga, 15,08 km), sem confirmação de início. Fora da fala.

## Conferência nos sites federais (guia Parte 2, passos 8 a 10), consulta 08/11/2026
Arquivo: ~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/federal/portal-transparencia-2026-01a09.txt
- Banco do Brasil (demonstrativos.apps.bb.com.br/arrecadacao-federal): o formulário não respondeu no navegador do app (dois envios, sem resultado). PENDÊNCIA. Substituto: Portal da Transparência (CGU), jan–set/2026, ação 0045 FPM = 20.515.943,32 x TCM 23.497.300,67 líquido (+5.128.985,38 de dedução). Diferença sem explicação no portal: PERGUNTA (data de crédito, código ou bruto x líquido), não entra no vídeo.
- FNS (consultafns.saude.gov.br/#/detalhada, 2026, Fundo a Fundo, Fundo Municipal de Saúde CNPJ 10.613.120/0001-18): Total Geral do ano até a consulta 6.263.049,95 (inclui out/nov). TCM SUS União até set. 4.935.713,47; Portal da Transparência jan–set (ações 219A, 2E89, 00UW, 00UC) 5.044.332,91. Diferença de datas; fora da fala.
- FNDE (fnde.gov.br/pls/simad/internet_fnde.liberacoes_01_pc, 2026, Prefeitura): soma das OBs de jan a set = 1.364.958,49 = TCM 1.7.1.4 (IGUAL).
- MDS (aplicacoes.mds.gov.br/suaswebcons, Parcelas Pagas): pede captcha (hCaptcha). PENDÊNCIA para o Magno. Valor do TCM: FNAS 1.7.1.6 = 342.662,34 (fora da fala).
- Emendas (painel do TCU, sites.tcu.gov.br/painel-de-acompanhamento-da-execucao-de-emendas/): painel em Power BI sem leitura de texto; a emenda Pix foi conferida no Portal da Transparência (0EC2) e no TransfereGov (planos de ação), as duas bases que o painel do TCU usa. Complementação da União ao Fundeb: Portal 7.674.451,55 x TCM 7.674.181,55 (diferença de R$ 270,00). Royalties FEP 569.869,54 e Aldir Blanc 121.454,87: iguais.

## Folha "PDF" na tela (regra 28, 08/11/2026; versão em ~/Documents/PARA O DRIVE - com folha PDF/RIO DE CONTAS.mp4)
- Receita de cada ano: DOC/2024-12_PCMGE016, DOC/2025-12_PCMGE016 e DOC/2026-09_PCMGE016, valor de cada código = arrecadado depois das anulações (previsto + saldo p/ mais − saldo p/ menos), agrupado por tools/lista_pdf/lista_pdf.py; "Outras receitas" = total − itens. Soma = total falado (65.231.350,91 / 72.249.177,19 / 60.949.863,86), diferença 0,00.
- Despesa de cada ano: os mesmos setores desta página (saida/setores.json), soma = gastou (64.836.035,57 / 61.304.155,81 / 54.216.743,30).
- Valores exatos e posição de cada folha: ~/Documents/RECEITAS-DESPESAS-RIO-DE-CONTAS/saida/folha-pdf/config-usada.json.
