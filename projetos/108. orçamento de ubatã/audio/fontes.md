# Fontes do 108. orçamento de ubatã (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 08:07 e 08:50, no Chrome do Magno numa aba própria, pelo recebedor 127.0.0.1:8778, pasta UBATA, sem janela, fetch + /salva). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-UBATA/documentos_tcm/` (96 PDFs; "UBATÃ" conferido no texto de todos os usados).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 398 (UBATÃ) · Prefeitura UJ 1002 · Câmara UJ 430 · Fundação Hospitalar UJ 559 (sem prestação de 2024 a 2026 e fora dos anexos). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" (total do ano) = despesa LIQUIDADA (regra 32): Balanço Orçamentário de 2024 e 2025 e PCMGE065 consolidado de set/2026. Receita = total declarado ao TCM (Balanço de 2024 e 2025; em 2026, Demonstrativo da Receita da Prefeitura até setembro, "Total até Mês", já sem a parte do Fundeb e sem as anulações).
Formato: nas prestações mensais de 12/2024 e 12/2025 da Prefeitura, o PCMGE015, 016, 018, 064, 065 e 066 são só a página de capa ("Demonstrativo ... gerado pelo SIGA", 1 página). Por isso 2024 e 2025 saem da prestação anual (2024: sistema FENTech; 2025: SIAFIC). Em 2026 os demonstrativos de set/2026 são gerados pelo SIGA do próprio TCM e vêm completos.
Despesa por setor (scripts/anexo6.py, acoes065.py e setores.py → saida/setores.json; soma = total do documento, diferença 0,00):
- 2024 e 2025: ações do Anexo VI (PCAGO004, Programa de Trabalho), que traz a despesa realizada no ano (= empenhada). A soma das ações é igual ao Anexo IX (PCAGO007) e à coluna "Despesas Empenhadas" do Balanço: 97.275.631,89 (2024) e 129.706.706,51 (2025). A diferença para o liquidado do Balanço é de 4.950,00 em 2024 e de 610.780,01 em 2025 (restos a pagar não processados); os anexos não abrem essa diferença por função, então os setores desses dois anos mostram a despesa realizada do Anexo VI/IX.
- 2026 até set: ações do PCMGE065 consolidado (Prefeitura + fundos + Câmara), coluna Liquidada "Até o Mês": soma = TOTAL 106.956.536,22 (p.93), centavo a centavo.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 + 17 + 26 + 06 · Administração 04 · Dívidas 28 · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27. Em 2026 o pessoal de várias secretarias (Infraestrutura, Cultura, Agricultura, Meio Ambiente) está em ações da função 04 (Administração): a folha de Administração diz isso.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json, receita_*.json, anexo6_*.json, acoes_2026-09.json); 2ª com cada valor exato procurado no texto do PDF citado (scripts/achar.py). As somas estão marcadas como conta própria.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 98 milhões e 300 em 2024 | 98.268.438,83 | 2024_PCAGO015.pdf (Anexo XII, Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 97 milhões e 300 em 2024 | 97.270.681,89 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhadas: 97.275.631,89) |
| sobraram 998 mil em 2024 | 997.756,94 | conta própria | 98.268.438,83 − 97.270.681,89 |
| arrecadou 155 milhões e 800 em 2025 | 155.798.263,37 | 2025_PCAGO015.pdf (Balanço Orçamentário 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| 51 milhões vieram do precatório do Fundef | 51.015.918,40 | conta própria | 18.001.997,35 + 33.013.921,05 (as duas linhas abaixo) |
| 18 do valor principal | 18.001.997,35 | 2025_PCAGO008.pdf (Anexo X 2025) | p.7 · 1.7.1.9.56.0.1.00.0000 Transferências Decorrentes de Decisão Judicial (precatórios) Relativas ao FUNDEF · Arrecadado Ano |
| e 33 de juros | 33.013.921,05 | 2025_PCAGO008.pdf | p.8 · 1.9.9.9.99.2.1.01.0000 Outras Receitas - Juros do Precatório FUNDEF - Fonte 501 · Arrecadado Ano |
| gastou 129 milhões e 100 em 2025 | 129.095.926,50 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhadas: 129.706.706,51) |
| sobraram 26 milhões e 700 | 26.702.336,87 | conta própria | 155.798.263,37 − 129.095.926,50 (Balanço Patrimonial 2025, `2025_PCAGO016.pdf` p.1: caixa e equivalentes 38.259.283,29 no fim de 2025, contra 7.261.906,32 no fim de 2024; não falado) |
| arrecadou 82 milhões e 200 até setembro de 2026 | 82.229.644,72 | 2026-09_PCMGE016.pdf (Demonstrativo da Receita, Prefeitura, set/2026) | p.8 · RESUMO · Totais · Total Até Mês (arrecadada até mês 82.303.674,91, já sem a dedução do Fundeb, menos 74.030,19 anulados) |
| gastou 107 milhões | 106.956.536,22 | 2026-09_PCMGE065.pdf (Demonstrativo Consolidado da Despesa, set/2026) | p.93 · TOTAL · Liquidada Até o Mês |
| 24 milhões e 700 a mais do que arrecadou | 24.726.891,50 | conta própria | 106.956.536,22 − 82.229.644,72 |
| já comprometeu 118 milhões e 400 | 118.361.598,03 | 2026-09_PCMGE065.pdf | p.93 · TOTAL · Empenhada Até o Mês |

## Receita por ano (folha "PDF", não falada; scripts/receita.py → saida/receita_AAAA.json)
2024: Anexo X (`2024_PCAGO008.pdf`, coluna Arrecadada). 2025: Anexo X (`2025_PCAGO008.pdf`, coluna Arrecadado Ano). 2026: `2026-09_PCMGE016.pdf` (Arrecadada até Mês). Nos três, as deduções do Fundeb são linhas filhas do FPM, ICMS, IPVA e ITR, então a linha do imposto já vem líquida. Grupos por código do Tesouro (IPTU 1.1.1.2.50, ITBI 1.1.1.2.53, IR 1.1.1.3, ISS 1.1.1.4.51, taxas 1.1.2, iluminação 1.2.4, rendimentos 1.3.2, FPM 1.7.1.1.51, royalties 1.7.1.2 + 1.7.2.2, SUS 1.7.1.3 + 1.7.2.3 + 2.4.1.1, FNDE 1.7.1.4 + 2.4.1.2, complementação Fundeb 1.7.1.5, assistência 1.7.1.6 + 1.7.2.9.51, ICMS 1.7.2.1.50, IPVA 1.7.2.1.51, Fundeb 1.7.5, precatório do Fundef 1.7.1.9.56 + juros 1.9.9.9.99.2.1.01, convênios e emendas 1.7.1.7 + 1.7.1.8 + 1.7.1.9 (sem o precatório) + 1.7.2.4 + 2.4.1.4 + 2.4.1.9 + 2.4.2); "Outras receitas" fecha o total (em 2026 inclui −74.030,19 de anulações).

## Setores (soma = total do ano, diferença 0,00)
| Setor | Dito (2024 · 2025 · 2026) | 2024 (2024_PCAGO004.pdf, Anexo VI; = Anexo IX 2024_PCAGO007.pdf) | 2025 (2025_PCAGO004.pdf, Anexo VI; = Anexo IX 2025_PCAGO007.pdf) | 2026 até set (2026-09_PCMGE065.pdf, soma das ações, liquidado: conta própria) |
|---|---|---|---|---|
| Educação | 37 e 900 · 43 e 200 · 43 e 700 | 37.874.039,25 (Anexo IX p.1, órgão 209) | 43.241.323,80 (Anexo IX p.2, Educação) | 43.662.566,58 |
| Saúde | 21 e 600 · 26 e 300 · 22 e 700 | 21.636.888,35 (Anexo IX p.1, órgão 210) | 26.305.442,13 (Anexo IX p.2, Saúde) | 22.743.754,19 |
| Obras e serviços urbanos | 13 e 700 · 21 milhões · 12 e 200 | 13.692.930,00 (Anexo IX p.1-2, órgão 211: funções 06, 15, 17 e 26) | 20.977.047,23 (funções 15 + 26 + 17 + 06: 17.850.187,22 + 3.126.860,01) | 12.206.751,14 |
| Administração | 9 milhões · 19 e 900 · 17 e 800 | 9.044.702,19 (função 04) | 19.938.595,69 (Anexo IX p.1, Administração) | 17.770.773,33 (inclui o pessoal de outras secretarias, ver acima) |
| Dívidas | 4 e 900 · 5 e 500 · quase 3 milhões | 4.852.459,67 (Anexo IX p.2, órgão 288) | 5.497.561,44 (Anexo IX p.4, Encargos Especiais) | 2.953.327,39 |
| Assistência social | 4 e 300 · 3 e 100 · 2 e 800 | 4.341.374,87 (Anexo IX p.2, órgão 212) | 3.051.571,37 (Anexo IX p.1) | 2.777.887,10 |
| Câmara de Vereadores | 2 e 900 · quase 4 milhões · 2 e 900 | 2.885.003,95 (Anexo IX p.1, órgão 101; = Anexo II 2024_PCAGO002.pdf p.1, Total do Órgão 10) | 3.955.645,45 (Anexo IX p.1; = 2025-12_CAMARA_PCMGE015.pdf p.2, Total do Órgão, empenhado; liquidado 3.640.664,42) | 2.929.123,75 (2026-09_PCMGE065.pdf p.31, Total do Poder Legislativo) |
| Cultura e festas | 2 e 600 · 6 e 200 · 1 e 800 | 2.556.576,15 (Anexo IX p.1, órgão 207, função 13) | 6.236.520,48 (Anexo IX p.2, Cultura) | 1.831.929,16 |
| Agricultura e meio ambiente | 392 mil · 443 mil · 80 mil | 391.657,46 (189.641,66 + 202.015,80) | 442.998,92 (Anexo IX p.3: 192.967,78 + 250.031,14) | 80.423,58 (o pessoal das duas secretarias está na função 04) |
| Esporte | zero · 60 mil · zero | 0,00 (3 ações de esporte no Anexo VI, todas 0,00) | 60.000,00 (Anexo IX p.4, Desporto e Lazer) | 0,00 (nenhuma ação na função 27; a obra de quadras está na função 13, previsto 140.000,00, gasto 0,00) |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| a ação de festas cívicas e populares levou 900 mil em 2024 | 900.000,00 | 2024_PCAGO004.pdf (Anexo VI 2024) | p.7 · 13.392.004-2.020 REALIZAÇÃO E PROMOÇÃO DE FESTAS CÍVICAS E POPULARES · Total |
| em 2025, 3 milhões | 3.014.432,20 | 2025_PCAGO004.pdf (Anexo VI 2025) | p.7 · 13.392.0004.2.020 REALIZAÇÃO E PROMOÇÃO DE FESTAS CÍVICAS E POPULARES · Total |
| o orçamento daquele ano previa 911 mil para toda a difusão cultural | 911.040,00 | 2025-12_PCMGE063.pdf (RREO Anexo 2, 5º bimestre de 2025, publicado no Diário Oficial de 11/12/2025) | p.6 · CULTURA / Difusão Cultural · Dotação Inicial (dotação atualizada: 3.278.440,00; empenhado até outubro 3.038.387,32 = festas 3.014.432,20 + manifestações artístico-culturais 23.955,12 do Anexo VI 2025, as duas ações da subfunção 392) |
| os 33 milhões de juros entraram como recurso livre | 33.013.921,05 | 2025_PCAGO008.pdf | p.8 · 1.9.9.9.99.2.1.01.0000 "Outras Receitas - Juros do Precatório FUNDEF - Fonte 501" (fonte 501 = outros recursos não vinculados) |
| em 2026, a educação já gastou 11 milhões e 850 mil em indenizações trabalhistas, com dinheiro do precatório do Fundef | 11.850.000,00 | 2026-09_PCMGE065.pdf | p.91 · ação 5.1401.12.366.4.2.2074 "Gestão das ações do fundo e conselho municipal de educação" · 3.1.90.94.00 Indenizações e restituições trabalhistas · fonte 2544 · Liquidada Até o Mês (fonte 544 = precatório do Fundef: no Anexo X 2025, p.2, "Remuneração de Depósitos Bancários - FUNDEF - Fonte 544"; o prefixo 2 = recurso de exercício anterior) |
| a Câmara de Vereadores recebeu 4 milhões e 100 da prefeitura em 2025 | 4.063.911,88 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara, dez/2025) | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 108 mil | 108.266,43 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS · Debitado até o Mês (recebido − devolvido = 3.955.645,45 = despesa empenhada da Câmara, conta própria) |
| o demonstrativo da Câmara registra 50 mil em combustível de aviação | 49.961,49 | 2025-12_CAMARA_PCMGE015.pdf (Despesa da Câmara, dez/2025, SIGA do TCM) | p.1 · 3.3.90.30.02 COMBUSTÍVEIS E LUBRIFICANTES DE AVIAÇÃO · Empenhos e Liquidações Até Mês |
| e 30 mil em alimento para animais | 29.945,94 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · 3.3.90.30.06 ALIMENTOS PARA ANIMAIS · Empenhos e Liquidações Até Mês (no mesmo documento: 3.3.90.30.12 Material de coudelaria ou de uso zootécnico 5.627,12; não falado) |
| a dívida parcelada com o INSS saiu de 71 milhões e 700 no fim de 2024 | 71.672.612,53 | 2024_PCAGO012.pdf (Anexo XVI 2024, Dívida Fundada Interna) | p.1 · 2.2.1.4.1.01.01.00 CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - INSS (P) · Saldo Atual (no Anexo XVI 2025 o mesmo saldo aparece dividido: 66.672.612,53 de longo prazo + 5.000.000,00 de curto prazo) |
| para 86 milhões e 600 no fim de 2025 | 86.579.307,46 | 2025_PCAGO012.pdf (Anexo XVI 2025) | p.1 · 2.2.1.4.1.01.01.00.00.0000 CONTRIBUIÇÕES PREVIDÊNCIÁRIAS - DÉBITO PARCELADO 82.579.307,46 + 2.1.1.4.3.01.02.01.00.0100 DÍVIDA FUNDADA INSS_EXECUTIVO 4.000.000,00 · Saldo Atual (soma: conta própria). Em 2025 o anexo mostra inscrição de 18.541.772,44 no parcelamento |
| por que a dívida com o INSS subiu quase 15 milhões | 14.906.694,93 | conta própria | 86.579.307,46 − 71.672.612,53 |
| se as festas levaram 3 milhões em 2025 | 3.014.432,20 | 2025_PCAGO004.pdf | p.7 (mesma linha acima) |

## Outros valores das folhas (não falados)
- Câmara 2026 até set: recebeu 2.885.688,00 (2026-09_CAMARA_PCMGE018.pdf p.6, 4.5.1.1.2.02.00 Creditado até o Mês); consultoria 247.058,80 e diárias 53.200,00 (2026-09_PCMGE065.pdf, ação 101.2001). Câmara 2024: o razão da Câmara (2024-12_CAMARA_PCMGE018.pdf) veio escaneado e o da Prefeitura de dez/2024 é só a capa; a folha usa o gasto do Anexo IX.
- 2026: calendário de festas 551.100,01 liquidados (848.912,22 empenhados) e promoção artística, cultural e lazer 1.280.829,15 (2026-09_PCMGE065.pdf p.13 e p.15). Manutenção da máquina administrativa 9.457.404,56, dos quais 6.358.479,69 em serviços de empresas com a fonte 2501.
- IPTU (não falado): 486.360,46 (2024_PCAGO008.pdf p.1), 304.009,80 (2025_PCAGO008.pdf p.1), 246.788,59 até set/2026 (2026-09_PCMGE016.pdf).
- Benefícios eventuais 2025 (não falado): 474.265,00 (2025_PCAGO004.pdf p.18).
- PDFs sem o nome da cidade no texto (nenhum usado): capas 2024-12_PCMGE064/065/066, 2024_PCAGO019_2 (documento do consórcio), 2024_PCAGO021 (Anexo XV sem cabeçalho) e 2024_PCAGO026 (inventário).
- Pendências no TCM: os demonstrativos mensais PCMGE015/016/018/064/065/066 da Prefeitura de 12/2024 e 12/2025 têm só a página de capa; o razão da Câmara de 12/2024 está escaneado.
