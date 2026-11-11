# Fontes do 122. orçamento de jaguarari (BA)

Consulta: 11/11/2026 (downloads no e-TCM no Chrome, com a trava _navegador.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta JAGUARARI, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-JAGUARARI/documentos_tcm/` (76 PDFs, cada um com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho dos PDFs ("JAGUARARI") e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 210 (JAGUARARI) · Prefeitura UJ 814 · Câmara UJ 243. Nenhuma autarquia com prestação própria. Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara, enviado em 03/11/2026). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/jaguarari.json.
"Gastou" = despesa LIQUIDADA. Total de 2024 e 2025 = Balanço Orçamentário (PCAGO015: Prefeitura, fundos e Câmara). 2026 = consolidado PCMGE065 de set/2026. Receita = total do Balanço (2024 e 2025) e PCMGE016 de set/2026 da Prefeitura (a Câmara não arrecada): arrecadada até o mês, já sem a parte do Fundeb, mais a anulada, que é negativa (= PCMGE066 "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA").
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- Prefeitura e fundos (órgãos 2 a 5): PCMGE015 da Prefeitura de cada ano (leitor scripts/acoes015.py; soma das ações = "Total do Poder", centavo a centavo). Câmara (órgão 1): PCMGE015 da própria Câmara (no PCMGE015 da Prefeitura ela vem zerada).
- 2024: Prefeitura 213.054.587,79 (`2024-12_PCMGE015.pdf` p.92 · Total do Poder · Liquidações Até Mês) + Câmara 6.453.576,22 (`2024-12_CAMARA_PCMGE015.pdf` p.2 · Total da Unidade) + 54.195,13 = 219.562.359,14 = `2024_PCAGO015.pdf` p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas. Os 54.195,13: o Balanço conta a amortização da dívida liquidada em 8.064.521,17 (p.1, linha Amortização da Dívida); o PCMGE015 traz 8.010.326,04 no elemento 4.6.90.71 dos Encargos Gerais (p.92 do 015, saldo 54.195,13). A diferença entra em "Dívidas e encargos" (conta própria).
- 2025: Prefeitura 221.216.370,51 (`2025-12_PCMGE015.pdf` p.105 · Total do Poder) + Câmara 7.009.930,95 (`2025-12_CAMARA_PCMGE015.pdf` p.3) = 228.226.301,46 = `2025_PCAGO015.pdf` p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas.
- 2026 (até setembro): Prefeitura 167.776.642,89 (`2026-09_PCMGE015.pdf` p.117) + Câmara 6.063.163,80 (`2026-09_CAMARA_PCMGE015.pdf` p.2) = 173.839.806,69 = `2026-09_PCMGE065.pdf` p.41 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado.
- Setor pela SECRETARIA (unidade orçamentária) da ação: Educação = Fundo Municipal de Educação (4.902) · Saúde = Fundo Municipal de Saúde (3.1202) · Obras e serviços urbanos = Secretaria de Infraestrutura e Obras (2.801, todas as funções) + Coordenação de Limpeza Pública (2.601, função 15) · Administração = Gabinete do Prefeito e do Vice, Procuradoria, Controladoria, Governo, Administração e Planejamento (2.601 sem a limpeza), Finanças (sem os Encargos Gerais), ações distritais de Pilar e Desenvolvimento Econômico e Turismo · Dívidas e encargos = ação ENCARGOS GERAIS DO MUNICÍPIO (8888: principal da dívida, sentenças judiciais e obrigações tributárias e contributivas) · Assistência social = Fundo Municipal de Assistência Social (5.1302) e os fundos da criança e da segurança alimentar · Câmara = PCMGE015 da Câmara · Agricultura e meio ambiente = Secretarias de Agricultura e Recursos Hídricos (2.1001) e de Meio Ambiente (2.1101) · Esporte = função 27 da Secretaria de Cultura, Esporte, Lazer e Juventude · Cultura = o resto dessa secretaria (a manutenção da secretaria, função 04).
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "MANUTENCAO DOS FESTEJOS TRADICIONAIS, CULTURAIS E RELIGIOSOS" (2.901.13.122.8.2.2034 em 2024 e 2025; 2.901.13.392.8.2.2034 em 2026) inteira, mais os elementos de bandas e de palco (pelo NOME do elemento) em outras ações: 2024: 3.3.90.39.18 bandas 25.000,00 e 3.3.90.39.19 palco 8.600,00 + 25.200,00 na Secretaria de Desenvolvimento Econômico e Turismo (2.1401.4.122.2.2.2005) e palco 7.900,00 no Fundo de Educação (4.902.12.361.4.2.2038); 2025: nenhum; 2026: palco (3.3.90.39.95) 78.507,00 no Fundo de Educação (4.902.12.361.4.2.2038). "Cultura" = a ação "MANUTENCAO DA SECRETARIA DE CULTURA, ESPORTE, LAZER E JUVENTUDE" (2.901.4.813.8.2.2035; em 2026 2.901.4.813.9.2.2035). Não há outra ação na função 13 (Cultura) além da de festejos.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Jaguarari arrecadou 218 milhões e 500 em 2024 | 218.489.600,88 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf, Totais: Total até Mês) |
| 226 milhões e 300 em 2025 | 226.317.249,64 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas. O PCMGE016 de 12/2025 dá 226.232.234,92 (diferença 85.014,72, conta própria); vale o Balanço |
| 173 milhões e 400 até setembro de 2026 | 173.381.685,43 | 2026-09_PCMGE016.pdf | p.7 · TOTAL · Arrecadada até Mês 175.105.263,26 + Anulada até Mês −1.723.577,83 (conta própria) = 2026-09_PCMGE066.pdf p.11 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês 173.381.685,43 |
| Em 2025, o FPM, da União, mandou 47 milhões | 47.034.845,14 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 10.188.619,52) |
| O ICMS, do Estado, 43 milhões e 700 | 43.725.104,97 | 2025-12_PCMGE016.pdf | p.4 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês (já sem o Fundeb: Deduções até Mês 10.931.275,96) |
| O Fundeb trouxe 29 milhões | 28.974.212,82 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.1.50.0.0 Transferências de Recursos do Fundeb · Arrecadada até Mês |
| E a compensação da mineração, 18 milhões e 100 | 18.125.608,21 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.2.51.0.0 Cota-parte da Compensação Financeira pela Exploração de Recursos Minerais (CFEM) · Arrecadada até Mês |
| 2024: gastou 219 milhões e 600 | 219.562.359,14 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Gastou 1 milhão e 100 a mais do que arrecadou | 1.072.758,26 | conta própria | 219.562.359,14 − 218.489.600,88 |
| 2025: gastou 228 milhões e 200 | 228.226.301,46 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Foi 1 milhão e 900 a mais | 1.909.051,82 | conta própria | 228.226.301,46 − 226.317.249,64 |
| 2026, até setembro: gastou 173 milhões e 800 | 173.839.806,69 | 2026-09_PCMGE065.pdf | p.41 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado |
| Foram 458 mil a mais | 458.121,26 | conta própria | 173.839.806,69 − 173.381.685,43 |
| E já comprometeu 195 milhões e 100 | 195.131.446,31 | 2026-09_PCMGE065.pdf | p.41 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Empenhado |

Receita detalhada dos três anos (não falada, para conferência): saida/receita_2024.json, receita_2025.json e receita_2026.json (inclui operação de crédito de 15.000.000,00 em 2024, `2024-12_PCMGE016.pdf` p.5 · 2.1.1.2.52.0.0, e 2.479.448,39 − 12.210,32 em 2025).

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidações Até Mês" do PCMGE015)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 68 e 800 · 72 e 600 · 55 e 300 | 68.791.155,74 | 72.647.059,85 | 55.310.631,98 |
| Saúde | 50 e 900 · 60 e 600 · 46 e 500 | 50.889.888,83 | 60.625.067,63 | 46.471.577,01 |
| Obras e serviços urbanos | 32 e 400 · 25 e 300 · 13 e 200 | 32.408.346,41 | 25.263.744,14 | 13.153.026,29 |
| Administração | 24 e 100 · 20 e 500 · 16 e 700 | 24.066.880,48 | 20.459.505,15 | 16.738.496,66 |
| Dívidas e encargos | 11 e 900 · 18 milhões · 12 e 800 | 11.862.712,56 | 17.992.768,54 | 12.762.945,53 |
| Assistência social | 6 milhões e 200 · 5 milhões e 700 · 5 milhões e 100 | 6.247.048,20 | 5.741.532,58 | 5.129.947,10 |
| Câmara de Vereadores | 6 milhões e 500 · 7 milhões · 6 milhões e 100 | 6.453.576,22 | 7.009.930,95 | 6.063.163,80 |
| Festas e eventos | 7 milhões · 7 milhões e 300 · 7 milhões e 600 | 7.024.490,69 | 7.303.837,90 | 7.627.311,97 |
| Cultura | 3 milhões e 400 · 2 milhões e 200 · 1 milhão e 700 | 3.373.743,58 | 2.246.086,51 | 1.724.362,21 |
| Agricultura e meio ambiente | 8 milhões e 100 · 8 milhões e 600 · 8 milhões e 100 | 8.135.350,83 | 8.578.468,87 | 8.113.209,18 |
| Esporte | 309 mil · 358 mil · 745 mil | 309.165,60 | 358.299,34 | 745.134,96 |
| **Soma** | | 219.562.359,14 | 228.226.301,46 | 173.839.806,69 |

Linhas do fontes.md para o site:
- Festas e eventos 2024: R$ 7.024.490,69 (ação 2.901.13.122.8.2.2034, 2024-12_PCMGE015.pdf p.30, Total do Projeto/Atividade, Liquidações até Mês 6.957.790,69 + bandas e palco de outras ações 66.700,00)
- Festas e eventos 2025: R$ 7.303.837,90 (ação 2.901.13.122.8.2.2034, 2025-12_PCMGE015.pdf p.34, Total do Projeto/Atividade, Liquidações até Mês)
- Festas e eventos 2026: R$ 7.627.311,97 (ação 2.901.13.392.8.2.2034, 2026-09_PCMGE015.pdf p.38, 7.548.804,97 + palco no Fundo de Educação 78.507,00, até setembro)
- Cultura 2024: R$ 3.373.743,58 · Cultura 2025: R$ 2.246.086,51 · Cultura 2026: R$ 1.724.362,21

## A Câmara (recebeu da prefeitura e gastou)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 8 milhões e 900 da prefeitura | 8.862.675,16 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês (duodécimo de dez/2024: 732.722,93, comprovante 2024-12_PCMGE008.pdf) |
| e gastou 6 milhões e 500 | 6.453.576,22 | 2024-12_CAMARA_PCMGE015.pdf | p.2 · Total da Unidade · Liquidações Até Mês |
| Em 2025, recebeu 10 milhões e 200 | 10.168.154,64 | 2025-12_PCMGE018.pdf (razão da PREFEITURA) | 3.5.1.1.2.02.00.02.00.01.00 REPASSES CONCEDIDOS AO PODER LEGISLATIVO · Débito até o Mês (= 12 x 847.346,22; comprovante de 16/12/2025 no 2025-12_PCMGE008.pdf). O razão da própria Câmara de 12/2025 (2025-12_CAMARA_PCMGE018.pdf p.6) mostra 8.363.838,91, sem o lançamento de dezembro: anotado em projetos/_pendencias-tcm.md |
| e gastou 7 milhões | 7.009.930,95 | 2025-12_CAMARA_PCMGE015.pdf | p.3 · Total da Unidade · Liquidações Até Mês |
| Até setembro de 2026, já recebeu 7 milhões e 700 | 7.747.048,44 | 2026-09_CAMARA_PCMGE018.pdf | p.6 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado Até o Mês (9 x 860.783,16) |
| e gastou 6 milhões e 100 | 6.063.163,80 | 2026-09_CAMARA_PCMGE015.pdf | p.2 · Total da Unidade · Liquidações Até Mês |

## As festas e os benefícios eventuais (PCMGE015 da Prefeitura, ação por ação)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| A ação de festejos tradicionais, culturais e religiosos gastou 7 milhões em 2024 | 6.957.790,69 | 2024-12_PCMGE015.pdf | p.30 · ação 2.901.13.122.8.2.2034 MANUTENCAO DOS FESTEJOS TRADICIONAIS, CULTURAIS E RELIGIOSOS · Total do Projeto/Atividade · Liquidações Até Mês (dotação inicial 7.233.000,00) |
| e 7 milhões e 300 em 2025 | 7.303.837,90 | 2025-12_PCMGE015.pdf | p.34 · mesma ação · Total do Projeto/Atividade · Liquidações Até Mês (dotação inicial 13.752.000,00) |
| Até setembro de 2026, já gastou 7 milhões e 500, mais do que no ano passado inteiro | 7.548.804,97 | 2026-09_PCMGE015.pdf | p.38 · ação 2.901.13.392.8.2.2034 · Total do Projeto/Atividade · Liquidações Até Mês (dotação inicial 13.744.000,00). 7.548.804,97 > 7.303.837,90 (conta própria) |
| Só com bandas, 2 milhões e 900 em 2024 | 2.881.037,01 | 2024-12_PCMGE015.pdf | p.29 · ação 2.901.13.122.8.2.2034 · 3.3.90.39.18 Contratação de Empresa/Banda/Grupo Musical 780.000,00 (FR 1500) + 1.972.103,99 (FR 1708) + 3.3.90.36.04 Contratação de Banda/Grupo Musical 56.581,33 (FR 1500) + 72.351,69 (FR 1708) · Liquidações Até Mês (soma: conta própria). Fora dessa ação, mais 25.000,00 de banda na Sec. de Desenvolvimento Econômico e Turismo (não somado na fala) |
| Em 2025, os benefícios eventuais previam 1 milhão | 1.026.000,00 | 2025-12_PCMGE015.pdf | p.101 · ação 5.1302.8.244.6.2.2090 GESTÃO DE BENEFÍCIOS EVENTUAIS · Total do Projeto/Atividade · Fixada (dotação inicial) |
| e gastaram 195 mil | 195.025,15 | 2025-12_PCMGE015.pdf | p.101 · mesma ação · Total do Projeto/Atividade · Liquidações Até Mês |
| se a assistência social inteira ficou em 5 milhões e 700 em 2025 | 5.741.532,58 | saida/setores.json | soma das ações do Fundo de Assistência Social (5.1302) no 2025-12_PCMGE015.pdf (conta própria) |
| por que as festas levaram 7 milhões e 300 | 7.303.837,90 | 2025-12_PCMGE015.pdf | p.34 · "Festas e eventos 2025" (a ação de festejos inteira; nenhum elemento de banda ou palco em outra ação em 2025) |

## O que foi procurado antes de afirmar
- "Festas": só a ação cujo nome diz FESTEJOS; bandas e palco em outras ações procurados pelo nome do elemento em todas as ações dos três anos (listados acima). A função 13 (Cultura) só tem a ação de festejos; a manutenção da Secretaria de Cultura, Esporte, Lazer e Juventude está na função 04 e foi chamada de "Cultura".
- Nenhum "zero" no vídeo. Nenhuma porcentagem, nenhum nome de gestor ou de empresa.
- Câmara: a devolução de saldo aparece de forma diferente no razão da Câmara (3.5.1.1.2.09) e no da Prefeitura (4.5.1.1.2.09): por isso a fala usa só "recebeu" e "gastou".
