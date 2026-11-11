# Fontes do 088. orçamento de castro alves (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 21:42 e 22:05, no navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta CASTRO-ALVES, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-CASTRO-ALVES/documentos_tcm/` (83 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF ("CASTRO ALVES" no cabeçalho); competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026, Prefeitura e Câmara). Não usados: contratos e comprovantes de 12/2024 (PCMGE004 a 009), PCMGE064 de 12/2024 e 12/2025 ("DEMONSTRATIVO EM ELABORAÇÃO"), PCAGO019 (contratos de rateio de consórcios).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 89 (CASTRO ALVES) · Prefeitura UJ 694 ("Prefeitura Municipal de CASTRO ALVES") · Câmara UJ 122 ("Camara Municipal de CASTRO ALVES"). Não há autarquia com prestação própria. Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário em 2024 e 2025; em 2026, PCMGE016 de set/2026, linha "Totais": arrecadada até o mês mais a anulada, que é negativa). A receita já vem sem a parte do Fundeb (ex.: FPM de 2025 41.155.489,57 com 8.915.042,05 de dedução mostrados à parte, 2025-12_PCMGE016.pdf p.2).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: Prefeitura 155.362.816,72 (`2024-12_PCMGE015.pdf` p.85, Total do Poder, Liquidações até Mês) + Câmara 3.608.674,28 (`2024-12_PCMGE065.pdf`, consolidado, ações da função 01: 65.243,00 + 1.205.253,92 + 2.338.177,36) = 158.971.491,00 = consolidado `2024-12_PCMGE065.pdf` p.75 = Balanço (`2024_PCAGO015.pdf` p.2). Observação: o PCMGE015 da própria Câmara de 12/2024 (emitido em 27/01/2025) traz 2.894.838,61 liquidado e 3.934.648,39 empenhado (p.3, Total da Unidade); vale o consolidado, que fecha com o Balanço. Os grupos da folha da Câmara 2024 vêm desse PCMGE015 da Câmara, com a diferença em linha própria.
- 2025: o PCMGE015 de 12/2025 da Prefeitura veio CONSOLIDADO (Prefeitura + Câmara): 177.974.469,47 (`2025-12_PCMGE015.pdf`, Executivo p.77 Total do Poder 173.705.307,11 + Legislativo p.78 Total do Poder 4.269.162,36, coluna Liquidada até o Mês) = `2025-12_PCMGE065.pdf` = Balanço (`2025_PCAGO015.pdf` p.2). Esse arquivo só abre até a modalidade (3.3.90.39.00): em 2025 não dá para separar bandas e palco de outras ações (dito na folha das festas).
- 2026 (até setembro): Prefeitura 161.957.911,98 (`2026-09_PCMGE015.pdf` p.121, Total do Poder) + Câmara 3.547.946,59 (`2026-09_CAMARA_PCMGE015.pdf` p.4, Total da Unidade) = 165.505.858,57 = consolidado `2026-09_PCMGE065.pdf` p.86 (conta própria da soma).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 17 (água), 26 (estradas vicinais, 2026), 23 (mercados e feiras livres) · Administração 02, 04, 19, 28 (PASEP) e a Secretaria de Empreendedorismo (função 23, 2026) · Dívidas = "MANUTENCAO DO SERVICO DA DIVIDA" e "CUMPRIMENTO DE SENTENCAS JUDICIAIS" (função 28) · Assistência social 08 · Câmara 01 · Cultura 13 sem as festas · Agricultura e meio ambiente 18 e 20 · Esporte 27.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação cujo NOME diz evento ("REALIZACAO E APOIO A EVENTOS CULTURAIS", função 13, os três anos) + os elementos de banda/grupo musical e de palco/cenário de QUALQUER outra ação (pelo nome do elemento: em 2024, 3.3.90.39.18 banda e 3.3.90.39.19 "Locação, Confecção e Montagem de Cenário"; em 2026, 3.3.90.39.94 banda e 3.3.90.39.95 "LOCAÇÃO, CONFECÇÃO E MONTAGEM DE CENÁRIOS, PALCOS, SONORIZAÇÃO, TENDAS, CADEIRAS E DESPESAS"; o 3.3.90.39.19 de 2026 é "MANUTENÇÃO E CONSERVAÇÃO DE VEÍCULOS" e não entra). "Eventos e campanhas de preservação ambiental" (meio ambiente) não é festa e está zerada. "Cultura" = o resto da função 13.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Castro Alves arrecadou 160 milhões e 900 em 2024 | 160.858.684,47 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.7, "Totais") |
| 173 milhões e 400 em 2025 | 173.359.461,07 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf, "Totais"); inclui a operação de crédito de 14.500.000,00 |
| 154 milhões e 600 até setembro de 2026 | 154.584.050,91 | 2026-09_PCMGE016.pdf | p.7 · "Totais" · Total Até Mês (arrecadada até mês 154.772.666,78 + anulada até mês −188.615,87) |
| em 2025, o FPM trouxe 41 milhões e 200 | 41.155.489,57 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do Fundo de Participação dos Municípios · Arrecadada até Mês (já sem a parte do Fundeb, 8.915.042,05 em Deduções até Mês) |
| e o Fundeb, com a ajuda da União, 54 milhões | 54.004.652,15 | 2025-12_PCMGE016.pdf | conta própria: p.5 · 1.7.5.0.00.0.0 (retorno do Fundeb) 28.728.404,49 + p.3 · 1.7.1.5.00.0.0 (complementação da União ao Fundeb) 25.276.247,66 · Arrecadada até Mês (anulada 0,00 nas duas) |
| 2024: gastou 159 milhões | 158.971.491,00 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.75) |
| sobraram 1 milhão e 900 | 1.887.193,47 | 2024_PCAGO015.pdf | p.2 · SUPERÁVIT (XIV) (= 160.858.684,47 − 158.971.491,00) |
| 2025: gastou 178 milhões | 177.974.469,47 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhado 178.014.235,14) |
| gastou 4 milhões e 600 a mais do que arrecadou | 4.615.008,40 | conta própria | 177.974.469,47 − 173.359.461,07 (o Balanço mostra DÉFICIT 4.654.774,07 pelo empenhado, p.1) |
| 2026, até setembro: gastou 165 milhões e 500 | 165.505.858,57 | 2026-09_PCMGE065.pdf | p.86 · total · Liquidada até o Mês (= Prefeitura 161.957.911,98, 2026-09_PCMGE015.pdf p.121, + Câmara 3.547.946,59, 2026-09_CAMARA_PCMGE015.pdf p.4) |
| gastou 10 milhões e 900 a mais | 10.921.807,66 | conta própria | 165.505.858,57 − 154.584.050,91 |
| já comprometeu 181 milhões | 180.949.070,67 | 2026-09_PCMGE065.pdf | p.86 · total · Empenhada até o Mês |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json)
Dito na fala: 2024 · 2025 · 2026 (milhões, com "e" = centenas de mil).
- Educação 69 e 100 · 72 e 300 · 79 e 600; Saúde 30 e 900 · 39 e 500 · 29 e 700; Obras e serviços urbanos 22 e 800 · 19 e 400 · 16 e 200; Administração 7 e 900 · 12 e 200 · 8 e 800; Dívidas 10 e 600 · 13 e 900 · 10 e 600; Assistência social 2 e 900 · 3 e 900 · 4 e 100; Câmara 3 e 600 · 4 e 300 · 3 e 500; Festas e eventos 5 e 500 · 7 e 700 · 7 e 900; Cultura 792 mil · 1 e 200 · 1 e 400; Agricultura e meio ambiente 1 e 200 · 825 mil · 606 mil; Esporte 3 e 500 · 2 e 700 · 3 e 100.

| Setor | 2024 liquidado | 2025 liquidado | 2026 até setembro |
|---|---|---|---|
| Educação | 69.146.215,53 (`2024-12_PCMGE015.pdf` p.17 a 32, função 12, 16 ações, menos 18.850,00 de cenário) | 72.301.604,91 (`2025-12_PCMGE015.pdf` consolidado p.16 a 28, função 12, 16 ações) | 79.561.506,09 (`2026-09_PCMGE015.pdf` p.30 a 49, função 12, 14 ações, menos 778.670,00 de palco e 156.250,00 de bandas) |
| Saúde | 30.948.960,18 (`2024-12_PCMGE015.pdf` p.33 a 51, função 10, 17 ações) | 39.526.531,35 (`2025-12_PCMGE015.pdf` consolidado p.29 a 44, função 10, 16 ações) | 29.708.864,39 (`2026-09_PCMGE015.pdf` p.50 a 76, função 10, 15 ações, menos 2.200,00 de palco) |
| Obras e serviços urbanos | 22.804.702,90 (`2024-12_PCMGE015.pdf` p.72 a 81, funções 15, 17 e 23, 11 ações) | 19.414.010,93 (`2025-12_PCMGE015.pdf` consolidado p.64 a 73, funções 15, 17 e 23, 9 ações) | 16.240.702,57 (`2026-09_PCMGE015.pdf` p.101 a 113, funções 15, 17, 23 e 26, 9 ações, menos 145.320,00 de palco) |
| Administração | 7.949.705,33 (`2024-12_PCMGE015.pdf` p.3 a 83, funções 02, 04 e 28 (PASEP), 9 ações) | 12.233.590,50 (`2025-12_PCMGE015.pdf` consolidado p.1 a 76, funções 04 e 28, 7 ações) | 8.837.290,05 (`2026-09_PCMGE015.pdf` p.3 a 119, funções 02, 04, 23 (Sec. de Empreendedorismo) e 28, 12 ações, menos 15.200,00 de palco) |
| Dívidas | 10.584.150,46 (`2024-12_PCMGE015.pdf` p.84: serviço da dívida 10.536.949,62 + sentenças judiciais 47.200,84) | 13.885.136,95 (`2025-12_PCMGE015.pdf` consolidado p.76: serviço da dívida 13.881.466,05 + sentenças 3.670,90) | 10.551.226,23 (`2026-09_PCMGE015.pdf` p.119, "MANUTENCAO DO SERVICO DA DIVIDA") |
| Assistência social | 2.877.912,69 (`2024-12_PCMGE015.pdf` p.52 a 68, função 08, 12 ações) | 3.917.468,72 (`2025-12_PCMGE015.pdf` consolidado p.45 a 61, função 08, 11 ações) | 4.066.103,39 (`2026-09_PCMGE015.pdf` p.78 a 98, função 08, 12 ações) |
| Câmara de Vereadores | 3.608.674,28 (`2024-12_PCMGE065.pdf`, consolidado, ações da função 01) | 4.269.162,36 (`2025-12_PCMGE015.pdf` consolidado p.78, Legislativo) | 3.547.946,59 (`2026-09_CAMARA_PCMGE015.pdf` p.4, Total da Unidade) |
| Festas e eventos | 5.521.803,83 (veja abaixo) | 7.740.975,32 (veja abaixo) | 7.892.819,70 (veja abaixo) |
| Cultura | 791.816,58 (`2024-12_PCMGE015.pdf` p.10 a 13, função 13 sem a ação de eventos e sem 2.500,00 de cenário) | 1.171.857,92 (`2025-12_PCMGE015.pdf` consolidado p.8 a 11, função 13 sem a ação de eventos) | 1.367.765,11 (`2026-09_PCMGE015.pdf` p.18 a 20: gestão da Sec. de Cultura 2.732.875,11 menos 1.365.110,00 de palco, som e tendas) |
| Agricultura e meio ambiente | 1.203.977,70 (`2024-12_PCMGE015.pdf` p.79 a 81, funções 18 e 20) | 824.617,29 (`2025-12_PCMGE015.pdf` consolidado p.72 a 73, funções 18 e 20) | 606.445,81 (`2026-09_PCMGE015.pdf` p.110 a 116, funções 18 e 20, menos 2.400,00 de palco) |
| Esporte | 3.533.571,52 (`2024-12_PCMGE015.pdf` p.14 a 16, função 27, 3 ações, menos 950,00 de cenário) | 2.689.513,22 (`2025-12_PCMGE015.pdf` consolidado p.13 a 15, função 27, 4 ações) | 3.125.188,64 (`2026-09_PCMGE015.pdf` p.25 a 29, função 27, 4 ações, menos 35.550,00 de palco) |

### Festas e eventos <ano> (regra 99: de onde veio cada parte)
- Festas e eventos 2024: R$ 5.521.803,83 = ação 500.501.13.392.7.2.2011 "REALIZACAO E APOIO A EVENTOS CULTURAIS" 5.499.253,83 (`2024-12_PCMGE015.pdf`, Total do Projeto/Atividade, Liquidações até Mês; dentro: 3.3.90.39.18 banda 80.000,00, 3.3.90.39.99 outros serviços de pessoa jurídica 4.826.338,50, 3.3.90.36.99 pessoa física 209.333,50, 3.3.90.48 auxílios 295.700,00) + cenário 3.3.90.39.19 em outras ações: Educação 18.850,00, Cultura (gestão) 2.500,00, Esporte 950,00, Relações Institucionais 250,00.
- Festas e eventos 2025: R$ 7.740.975,32 = ação 500.501.13.392.7.2.2011 "REALIZACAO E APOIO A EVENTOS CULTURAIS" (`2025-12_PCMGE015.pdf` consolidado; 3.3.90.39.00 pessoa jurídica 7.135.797,02). O arquivo de 2025 só abre até a modalidade: bandas e palco de outras ações não aparecem separados (dito na folha).
- Festas e eventos 2026: R$ 7.892.819,70 = ação 800.801.13.392.5.2.2022 "REALIZACAO E APOIO A EVENTOS CULTURAIS" 5.308.119,70 (`2026-09_PCMGE015.pdf` p.22; dentro: festividades e homenagens 3.3.90.39.23 2.741.880,00, bandas 3.3.90.39.94 801.100,00, palco 3.3.90.39.95 539.090,00) + palco, som e tendas (3.3.90.39.95) e bandas (3.3.90.39.94) em outras ações: Sec. de Cultura (gestão) palco 1.365.110,00 (p.19); Sec. de Educação (gestão) palco 778.670,00 (p.32) e bandas 25.000,00 (p.32); capacitação dos profissionais da educação bandas 131.250,00 (p.33); mercados e feiras livres palco 143.160,00; fomento à cultura (Aldir Blanc) palco 84.000,00; Esporte palco 35.550,00; Empreendedorismo 11.800,00; Administração 3.400,00; Agricultura 2.400,00; Saúde 2.200,00; Infraestrutura 2.160,00.

## Câmara (o que entrou e o que saiu)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| em 2024, ela recebeu 3 milhões e 500 da prefeitura | 3.498.359,04 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo Atual Credor (o razão de 12/2024 traz o ano todo no saldo) |
| e gastou 3 milhões e 600 | 3.608.674,28 | 2024-12_PCMGE065.pdf (consolidado) | ações da função 01 · Liquidada até o Mês (conta própria da soma). Devolução no ano: 2.848,04 (2024-12_CAMARA_PCMGE018.pdf p.7, 3.5.1.1.2.09.00), só na folha |
| em 2025, recebeu 4 milhões e 300 | 4.309.555,50 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e gastou 4 milhões e 300 | 4.269.162,36 | 2025-12_PCMGE015.pdf (consolidado) | p.78 · Legislativo · Total do Poder · Liquidada até o Mês (o PCMGE015 da Câmara traz 4.242.262,36, 2025-12_CAMARA_PCMGE015.pdf p.3). Devolução: 2.717,34 (2025-12_CAMARA_PCMGE018.pdf p.7), só na folha |
| em 2026, até setembro, recebeu 3 milhões e 600 | 3.553.894,44 | 2026-09_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Saldo Atual Credor (gastou 3.547.946,59 e empenhou 4.854.478,26, 2026-09_CAMARA_PCMGE015.pdf p.4; devolução 627,47, p.7) |
| os subsídios dos vereadores somaram 1 milhão e 500 em 2025 | 1.544.400,00 | 2025-12_CAMARA_PCMGE015.pdf | p.1 · 3.1.90.11.75 SUBSÍDIOS - AGENTES POLÍTICOS · Liquidações até Mês |
| e a consultoria, 557 mil | 556.800,00 | 2025-12_CAMARA_PCMGE015.pdf | conta própria: p.2 · 3.3.90.35.01 ASSESSORIA E CONSULTORIA TÉCNICA OU JURÍDICA 349.200,00 + p.3 · 3.3.90.35.99 OUTROS SERVIÇOS DE CONSULTORIA 207.600,00 · Liquidações até Mês |

## Empréstimo e dívida
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| em dezembro de 2025, entraram 14 milhões e 500 de uma operação de crédito | 14.500.000,00 | 2025-12_PCMGE016.pdf | p.5 · 2.1.1.2.01.0.0 Operações de Crédito Contratuais - Mercado Interno · Arrecadada no Mês 14.500.000,00 (= Arrecadada até Mês; previsto 1.000.000,00); = 2025_PCAGO015.pdf p.1 · Operações de Crédito - Mercado Interno · Receitas Realizadas |
| mesmo assim, o ano fechou com gasto maior que a arrecadação | 4.615.008,40 | conta própria | acima (2025) |
| só o serviço da dívida levou 13 milhões e 900 em 2025 | 13.881.466,05 | 2025-12_PCMGE015.pdf (consolidado) | p.76 · ação 8800.8888.28.843.0.3.3 "MANUTENCAO DO SERVICO DA DIVIDA" · Liquidada até o Mês |

## Festas (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| até setembro de 2026, 5 milhões e 300 saíram na ação de eventos culturais | 5.308.119,70 | 2026-09_PCMGE015.pdf | p.22 e 23 · ação 800.801.13.392.5.2.2022 "REALIZACAO E APOIO A EVENTOS CULTURAIS" · Total do Projeto/Atividade (p.23) · Liquidações até Mês |
| mais 1 milhão e 400 de palco, som e tendas na secretaria de cultura | 1.365.110,00 | 2026-09_PCMGE015.pdf | p.19 · ação 800.801.13.122.15.2.2015 "GESTAO DAS ACOES DA SEC DE CULTURA, TURISMO, PROM DA IGUALDADE..." · 3.3.90.39.95 LOCAÇÃO, CONFECÇÃO E MONTAGEM DE CENÁRIOS, PALCOS, SONORIZAÇÃO, TENDAS, CADEIRAS E DESPESAS · Liquidações até Mês |
| e a Educação pagou 779 mil de palco, som e tendas | 778.670,00 | 2026-09_PCMGE015.pdf | p.32 · ação 1000.1001.12.122.15.2.2027 "GESTAO DAS ACOES DA SECRETARIA DE EDUCACAO" · 3.3.90.39.95 · Liquidações até Mês |
| e 156 mil de bandas | 156.250,00 | 2026-09_PCMGE015.pdf | conta própria: p.32 · ação 1000.1001.12.122.15.2.2027 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL 25.000,00 + p.33 · ação 1000.1001.12.128.18.2.2034 "PROMOCAO E INCENTIVO A CAPACITACAO DOS PROFISSIONAIS DA EDUCACAO" · 3.3.90.39.94 131.250,00 |
| por que as festas e eventos levaram 7 milhões e 900? | 7.892.819,70 | 2026-09_PCMGE015.pdf | Festas e eventos 2026 (acima), conta própria |

## Regras e conferências
- Nenhum nome de gestor, de empresa contratada, de banco ou de pessoa. Valores sem porcentagem.
- Ano corrente: só até 09/2026, o último mês entregue pela Prefeitura e pela Câmara.
- Fontes do e-TCM só (Guia TCM-BA). Notícias não foram usadas como fonte.
