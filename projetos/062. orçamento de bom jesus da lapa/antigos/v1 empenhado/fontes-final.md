# Fontes do 062. orçamento de Bom Jesus da Lapa

Consulta: 08/11/2026. Fonte principal: e-TCM Consulta Pública (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 46 "BOM JESUS DA LAPA". Unidades com conta própria: Prefeitura UJ 651, Câmara UJ 81 e SAAE UJ 1029 ("Serviço Autônomo de Água e Esgoto - BOM JESUS DA LAPA"). Não há instituto de previdência nem outra autarquia com conta mensal.
Pasta: DOC = ~/Documents/RECEITAS-DESPESAS-BOM-JESUS-DA-LAPA/documentos_tcm/ (cada PDF tem um .txt ao lado; "l." = linha do .txt). Scripts: ~/Documents/RECEITAS-DESPESAS-BOM-JESUS-DA-LAPA/scripts/ (acoes_bj.py, setores.py, conferir.py, pega.sh). Saídas: saida/acoes_*.json, saida/setores.json.
Critério: 2024 e 2025 = EMPENHADO do Balanço Orçamentário (PCAGO015) e do Anexo 9 (PCAGO007), que já somam Prefeitura, fundos, Câmara (órgão 14) e SAAE (órgão 31). 2026 = LIQUIDADO até 09/2026: PCMGE015 da Prefeitura + PCMGE015 da Câmara + PCMGE015 do SAAE, do mesmo mês (os três entregaram setembro). Prova de que o PCMGE015 da Prefeitura não inclui Câmara nem SAAE: 2025, Prefeitura 333.965.462,98 (DOC/2025-12_PREF_015.pdf l.7556) + Câmara 10.378.937,71 + SAAE 20.202.364,53 (Anexo 9 2025 l.162-163) = 364.546.765,22 = Balanço.
Receita: o TOTAL declarado. 2024 e 2025 = "SUBTOTAL DAS RECEITAS (III)", Receitas Realizadas, do Balanço. 2026 = linha "Totais" (Total Até Mês) do PCMGE016 09/2026 da Prefeitura + do SAAE. Nada descontado por conta própria. A Câmara não tem receita própria (não há PCMGE016 dela).
Valores na fala arredondados para 1 casa de milhão; o exato vai nas plaquinhas.

## Receita e gasto total
- 2024 arrecadou R$ 345.295.221,74 → DOC/2024-13_ANUAL_PCAGO015.pdf l.24 "SUBTOTAL DAS RECEITAS (III)", Receitas Realizadas → fala "345 milhões e 300", tela.
- 2024 gastou R$ 359.889.029,42 → DOC/2024-13_ANUAL_PCAGO015.pdf l.86 "SUBTOTAL DAS DESPESAS (XI)", Despesas Empenhadas; = Anexo 9 "Total" (DOC/2024-13_ANUAL_PCAGO007.pdf l.164) → fala "359 e 900", tela.
- 2024 déficit R$ 14.593.807,68 → DOC/2024-13_ANUAL_PCAGO015.pdf l.33 "Défit (VI)" → fala "O próprio balanço chama isso de déficit: 14 milhões e 600", tela "A MAIS".
- 2025 arrecadou R$ 400.767.806,42 → DOC/2025-13_ANUAL_PCAGO015.pdf l.24 → fala "400 milhões e 800", tela.
- 2025 gastou R$ 364.546.765,22 → DOC/2025-13_ANUAL_PCAGO015.pdf l.87, Despesas Empenhadas; = Anexo 9 (DOC/2025-13_ANUAL_PCAGO007.pdf l.167) → gancho "364 milhões e 500", fala, tela, capa, legenda.
- 2025 sobra R$ 36.221.041,20 → DOC/2025-13_ANUAL_PCAGO015.pdf l.96 "Superávit (XIII)" → fala "Sobraram 36 milhões e 200", tela.
- 2026 (até 09) arrecadou R$ 355.081.634,20 (conta própria) = Prefeitura 338.583.156,87 (DOC/2026-09_PREF_016.pdf l.483 "Totais:", Total Até Mês; = l.475 TOTAL, arrecadada até mês) + SAAE 16.498.477,33 (DOC/2026-09_SAAE_016.pdf l.66 "Totais:"; PDF digitalizado, linha legível no texto e conferida na imagem) → fala "355 milhões e 100", tela.
- 2026 (até 09) gastou (liquidado) R$ 325.039.264,39 (conta própria) = Prefeitura 301.207.147,86 (DOC/2026-09_PREF_015.pdf l.7241 "Total do Poder", Liquidações Até Mês) + Câmara 7.918.133,48 (DOC/2026-09_CAM_015_desp.pdf l.219 "Total do Poder") + SAAE 15.913.983,05 (DOC/2026-09_SAAE_015.pdf pág. 10, quadro RESUMO "Total / Liquidada até o mês", LIDO NA IMAGEM: o PDF é digitalizado e o texto sai embaralhado) → fala "325 milhões", tela.
- 2026 (até 09) empenhado R$ 354.395.671,22 (conta própria) = 326.571.769,85 + 8.988.553,28 + 18.835.348,09 (SAAE, lido na imagem) → abaixo do arrecadado (355,1); por isso a fala não fala em "a mais". Não dito.

## Setores (2024 e 2025 = Anexo 9 consolidado, empenhado; 2026 = soma das ações do PCMGE015 09/2026 da Prefeitura, liquidado, + Câmara + SAAE; script scripts/setores.py; soma dos setores = total de cada ano, centavo a centavo)
REGRAS DO MUNICÍPIO: Administração = função 04 + função 02 (Procuradoria). Obras e serviços urbanos = função 15 Urbanismo (Secretaria de Infraestrutura: limpeza pública, praças, pavimentação, emendas) + função 25 (iluminação pública, mesma secretaria) + função 16. Dívidas e encargos = função 28 ("Encargos especiais e PASEP, sentenças e dívida pública", Sec. da Fazenda) + PASEP do SAAE. Água e esgoto = função 17, que é só o SAAE (a Prefeitura tem 0 na função 17). Fora da fala (entram só no total): guarda municipal f06 (110.465,00 / 62.195,71 / 105.918,50), transporte f26 (1.320.858,64 / 9.590,00 / 0), desenvolvimento econômico f23 (0 / 0 / 203.408,80).
- Educação (12): 2024 R$ 133.794.091,66 (A9 2024 l.65) "133 e 800" · 2025 R$ 161.368.453,03 (A9 2025 l.66) "161 e 400" · 2026 R$ 134.268.823,04 (função 12, saida/acoes_2026-09.json) "134 e 300".
- Saúde (10): 2024 R$ 105.892.159,09 (A9 2024 l.65) "105 e 900" · 2025 R$ 94.465.508,66 (A9 2025 l.66) "94 e 500" · 2026 R$ 82.124.370,43 "82 e 100".
- Administração (04+02): 2024 20.228.693,11 + 289.620,60 = R$ 20.518.313,71 (A9 2024 l.16) "20 e 500" · 2025 22.076.198,54 + 294.000,00 = R$ 22.370.198,54 (A9 2025 l.16) "22 e 400" · 2026 R$ 20.073.248,67 "20 e 100".
- Obras e serviços urbanos (15+25+16): 2024 R$ 28.981.339,00 (A9 2024 l.65) "29 milhões" · 2025 18.425.788,64 + 30.224,28 = R$ 18.456.012,92 (A9 2025 l.66 e l.167) "18 e 500" · 2026 R$ 25.356.102,19 "25 e 400".
- Câmara (01): 2024 R$ 8.640.056,94 (A9 2024 l.16) "8 e 600" · 2025 R$ 10.378.937,71 (A9 2025 l.16) "10 e 400" · 2026 R$ 7.918.133,48 (DOC/2026-09_CAM_015_desp.pdf l.219) "7 e 900".
- Dívidas e encargos (28): 2024 R$ 17.817.000,92 (A9 2024 l.164) "17 e 800" · 2025 R$ 16.662.296,40 (A9 2025 l.167) "16 e 700" · 2026 14.483.799,47 (Prefeitura, ação 404 "Encargos especiais e PASEP...") + 142.918,19 (PASEP do SAAE, DOC/2026-09_SAAE_015.pdf pág. 9, lido na imagem) = R$ 14.626.717,66 "14 e 600".
- Cultura e festas (13): 2024 R$ 11.781.075,04 (A9 2024 l.65) "11 e 800" · 2025 R$ 10.065.337,74 (A9 2025 l.66) "10 e 100" · 2026 R$ 12.343.234,76 "12 e 300".
- Assistência social (08, Fundo Municipal de Assistência Social): 2024 R$ 7.426.063,09 (A9 2024 l.16) "7 e 400" · 2025 R$ 4.675.509,97 (A9 2025 l.16) "4 e 700" · 2026 R$ 4.962.888,33 "5 milhões". Procurado SOCIAL/CRAS/CREAS/BOLSA/CESTA/IDOSO/CRIANÇA/MULHER/FAMÍLIA fora da função 08: só ações da Saúde (PSF, psicossocial) e agricultura familiar; nenhuma ação de assistência social em outra função.
- Água e esgoto (17, SAAE): 2024 R$ 18.498.560,03 (A9 2024 l.114) "18 e 500" · 2025 R$ 20.003.032,90 (A9 2025 l.116) "20 milhões" · 2026 15.913.983,05 − 142.918,19 (PASEP) = R$ 15.771.064,86 (lido na imagem) "15 e 800".
- Agricultura (20): 2024 R$ 2.158.154,62 "2 milhões e 200" · 2025 R$ 3.356.696,23 "3 milhões e 400" · 2026 R$ 2.693.288,97 "2 e 700".
- Esporte (27): 2024 R$ 1.113.578,36 "1 milhão e 100" · 2025 R$ 818.697,14 "819 mil" · 2026 R$ 1.253.478,73 "1 milhão e 300".
- Meio ambiente (18): 2024 R$ 1.837.313,32 "1 milhão e 800" · 2025 R$ 1.854.298,27 "1 milhão e 900" · 2026 R$ 3.338.585,97 "3 milhões e 300".
- Nenhum setor da fala ficou em zero.

## Achados
- Ação 1.808.13.392.8.2.2023 "GESTÃO DAS ATIVIDADES DE PROMOÇÃO DAS FESTAS CULTURAIS, RELIGIOSOS..." (Secretaria Municipal de Cultura e Turismo):
  - 2024: previsto (dotação inicial, 1ª coluna) R$ 4.259.087,58; gasto (empenhado) R$ 10.108.850,77 → DOC/2024-12_PREF_015.pdf l.1407 "Total do Projeto/Atividade"; gasto igual no Anexo 6 (DOC/2024-13_ANUAL_PCAGO004.pdf l.434). Suplementação de R$ 6.131.642,62 na própria ação (coluna Alterações), a maior parte na fonte 1501 (l.1390); a Secretaria inteira só anulou cerca de R$ 1,5 mi em outras ações: não é troca de linha dentro da secretaria. Em que foi gasto (l.1393-1402): bandas/grupos musicais 750.000,00 + 3.760.000,00; locação e montagem de cenários/estruturas 2.358.140,00 + 2.810.833,00 → fala "4 milhões e 300 previstos. Gasto: 10 e 100. Mais que o dobro" (2,37 vezes, conta própria), tela.
  - 2025: previsto R$ 6.297.896,11; gasto R$ 8.174.568,98 → DOC/2025-12_PREF_015.pdf l.1726; Anexo 6 2025 l.435 → fala "6 e 300", "8 e 200", tela, gancho ("levou mais que toda a assistência social": 8,17 > 4,68).
  - 2026 (até 09): previsto R$ 7.599.000,00; liquidado R$ 9.572.429,61 (empenhado 10.477.386,21) → DOC/2026-09_PREF_015.pdf l.1542 → fala "já são 9 e 600".
  - 2026 bandas: elemento 3.3.90.39.94 "SERVIÇOS DE BANDA OU GRUPO MUSICAL OU PROFISSIONAL", fonte 1500, liquidado R$ 5.892.530,00 (empenhado 5.922.530,00) → DOC/2026-09_PREF_015.pdf l.1531 → fala "Só com bandas e shows, 5 milhões e 900", tela.
  - Comparação com a assistência social (função 08 inteira, acima): 2024 10,11 > 7,43; 2025 8,17 > 4,68; 2026 9,57 > 4,96 → fala "Nos três anos, a ação das festas gastou mais" (conta própria; mesma base: empenhado 2024/2025, liquidado 2026).
  - Os relatórios do TCM não separam a romaria das outras festas culturais e religiosas: a fala diz isso.

## Notícias e leis conferidas (08/11/2026)
- Lei federal nº 15.197, de 5/9/2025 (DOU 8/9/2025), art. 1º: declara a Romaria do Senhor Bom Jesus da Lapa manifestação da cultura nacional. https://planalto.gov.br/ccivil_03/_ato2023-2026/2025/Lei/L15197.htm → fala "Em 2025, uma lei federal reconheceu a romaria como manifestação da cultura nacional".
- A Tarde, 06/08/2023, "Governo inaugura aeroporto de Bom Jesus da Lapa": construído pela Secretaria de Infraestrutura do Estado (Seinfra), investimento de R$ 26,1 milhões (Aeroporto Regional). https://atarde.com.br/portalmunicipios/portalmunicipioscentrosul/governo-inaugura-aeroporto-de-bom-jesus-da-lapa-1237871 → fala "O aeroporto da cidade é obra do Estado: 26 milhões e 100, segundo o jornal A Tarde".
- Correio, 06/08/2019, "Turismo religioso leva 600 mil romeiros a Bom Jesus da Lapa" (contexto; NÃO dito: número antigo e página lida só em parte).
- Bahia Notícias, TCM manteve a rejeição das contas de 2023 (contexto; fora do período do vídeo, não dito).

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município BOM JESUS DA LAPA, consulta 08/11/2026, https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/)
- 14027e26, Denúncia, PM Bom Jesus da Lapa, exercício 2026: "Supostas irregularidades no Pregão Eletrônico nº 023/2026", objeto "produção de eventos, abrangendo a locação, montagem, manutenção e desmontagem". Sem data de julgamento nem decisão na ficha → "em análise" → fala "uma delas sobre o pregão de 2026 para montar estruturas de eventos".
- 21977e26, Denúncia, exercício 2024-2026: "Supostas irregularidades sistêmicas em contratações públicas". Sem julgamento → "há denúncias em análise".
- Outros sem julgamento (não ditos um a um): 01718e25 (falta de pagamento a posto de combustível, 2025), 13697e26 (pregão 022/2026), 32280e26 (brinquedos, 2026), 14927e25, 14112e26 e 29074e26 (termos de ocorrência sobre contratações temporárias e acumulação de cargos), 03581e26 (SAAE, salário abaixo do mínimo), 25902e24 (auditoria de medicamentos 2023-2024), 23327e25.
- Julgados: 14773e24 e 09010e24, "Não Conhecimento" em 17/09/2026 (o Tribunal não analisou o mérito). Não ditos.
- Na fala e na tela: sem nomes de pessoas. "Em análise não é condenação."

## Escala da maquete
- 1 moeda = R$ 1 mi, 1 pilha = R$ 10 mi (orçamento de ~R$ 360 mi, como Jequié/Camaçari). Só muda o desenho.

## 2ª conferência (08/11/2026, antes do vídeo final)
- Texto dos 19 PDFs extraído de novo (cópias em ~/Documents/RECEITAS-DESPESAS-BOM-JESUS-DA-LAPA/saida/conf2/): os 46 valores achados de novo nas mesmas linhas (scripts/conferir2.py). Ações dos três PCMGE015 lidas de novo: idênticas às da 1ª leitura. Setores: soma = 359.889.029,42 / 364.546.765,22 / 325.039.264,39, igual ao total de cada ano.
- Valores do SAAE lidos na imagem (pág. 9 e 10 do PCMGE015 09/2026): 15.913.983,05 liquidado, 18.835.348,09 empenhado, PASEP 142.918,19: conferidos de novo na imagem.
- Valores só da tela também conferidos: previsto 2026 da ação das festas R$ 7.599.000,00 (DOC/2026-09_PREF_015.pdf l.1542, 1ª coluna) no chip "JÁ SÃO R$ 9,6 MI · PREVISTO NO ANO: R$ 7,6 MI".
- Notícias e lei: nada mudou (Lei 15.197/2025 no Planalto; A Tarde 06/08/2023). TCM: 14027e26 e 21977e26 seguem sem julgamento na consulta de 08/11/2026.
