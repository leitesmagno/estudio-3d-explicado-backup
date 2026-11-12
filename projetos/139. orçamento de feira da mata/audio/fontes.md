# Fontes do 139. orçamento de feira da mata (BA)

Consulta: 12/11/2026 (pode pesquisar às 04:16; downloads no e-TCM entre 04:18 e 05:00, pelo navegador do app com a trava _navegador-app.lock, recebedor 127.0.0.1:8778, pasta FEIRA-DA-MATA, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-FEIRA-DA-MATA/documentos_tcm/` (cada PDF com o texto ao lado em .txt; página = ordem do \f no texto). Município conferido no cabeçalho de cada prestação antes de salvar: FEIRA DA MATA.
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 129 · Prefeitura UJ 734 · Câmara UJ 162 · SAAE UJ 1044 (o SAAE entra no consolidado, ação 6.1101.17.512 "Manutenção do SAAE"). Último mês entregue em 2026: 09/2026 (enviado 04/11/2026). Lista de prestações gravada (SITE-EUMAGNOLEITE/dados/prestacoes-etcm/feira-da-mata.json, 34 linhas).
"Gastou" = despesa LIQUIDADA. Receita = total do Balanço Orçamentário (2024 e 2025) e do Demonstrativo Consolidado da Receita de 09/2026.
Despesa por setor: Demonstrativo Consolidado da Despesa (PCMGE065 SIGA: Prefeitura + fundos + SAAE + Câmara), que fecha centavo a centavo com o Balanço em 2024 e 2025 e com o SICONFI (scripts/acoes065c.py e scripts/setores_fdm.py → saida/setores.json).
Conferido 2 vezes: 1ª depois do roteiro (cada número contra saida/setores.json e os .json do leitor); 2ª antes do vídeo final (cada valor exato procurado no texto do PDF com scripts/pag.py). Somas, diferenças e arredondamentos: conta própria.
Abaixo do TCM fica o CRUZAMENTO feito antes, por API pública (SICONFI e IBGE): nenhum número dele vai para a tela.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 38 milhões e 300 em 2024 | 38.333.829,14 | 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (o SICONFI dá 38.325.551,77; vale o Balanço) |
| gastou 37 milhões e 100 em 2024 | 37.099.492,39 | 2024-13_ANUAL_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.77, TOTAL, liquidada até o mês) |
| sobrou 1 milhão e 200 | 1.234.336,75 | conta própria | 38.333.829,14 − 37.099.492,39 |
| arrecadou 46 milhões e 800 em 2025 | 46.829.862,35 | 2025-13_ANUAL_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 44 milhões e 600 em 2025 | 44.628.817,09 | 2025-13_ANUAL_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.86, TOTAL) |
| sobraram 2 milhões e 200 | 2.201.045,26 | conta própria | 46.829.862,35 − 44.628.817,09 |
| arrecadou 40 milhões e 800 até setembro de 2026 | 40.759.277,88 | 2026-09_PCMGE066_2.pdf (Demonstrativo Consolidado da Receita, SIGA) | p.17 · Totais · arrecadação até o mês 40.768.688,95 − anulada até o mês 9.411,07 (= 2026-09_PCMGE066.pdf p.12, TOTAL GERAL DA RECEITA ORÇAMENTÁRIA) |
| gastou 40 milhões e 100 até setembro | 40.077.976,28 | 2026-09_PCMGE065_2.pdf (Demonstrativo Consolidado da Despesa, SIGA) | p.87 · TOTAL · Liquidada até o mês |
| sobraram 681 mil | 681.301,60 | conta própria | 40.759.277,88 − 40.077.976,28 |
| já comprometeu 46 milhões e 900 | 46.857.200,04 | 2026-09_PCMGE065_2.pdf | p.87 · TOTAL · Empenhada até o mês |

## Setores (soma = total do ano; soma das ações por função no PCMGE065: conta própria)
Setor pela FUNÇÃO: Educação 12 · Saúde 10 · Administração 04 + 02 (assessoria jurídica) + 06 (apoio à segurança) + 09 (PASEP) + 24 (comunicação) · Obras e serviços urbanos 15 + 16 + 17 (SAAE) + 25 (iluminação e energia solar) + 26 (transportes) · Câmara 01 · Dívidas e encargos 28 · Festas e eventos = ações "Comemorações Festivas" e "Manutenção da Festa de Vaquejada" (13.392) · Esporte e lazer = 27 + "Gestão das ações de desporto e lazer" (lançada em 13.392) · Cultura = o resto da função 13 · Assistência social 08 · Agricultura e meio ambiente 20 + 18.
Arquivos: 2024-12_PCMGE065.pdf · 2025-12_PCMGE065.pdf · 2026-09_PCMGE065_2.pdf.

| Setor | Dito (2024 · 2025 · 2026) | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|


| Educação | 12 e 200 · 17 e 400 · 15 e 800 | 12.188.125,41 | 17.353.295,47 | 15.824.245,28 |
| Saúde | 9 e 400 · 10 e 700 · 8 e 900 | 9.364.082,26 | 10.679.662,77 | 8.934.898,41 |
| Administração | 4 e 800 · 5 e 400 · 4 e 200 | 4.840.813,69 | 5.353.653,96 | 4.163.137,02 |
| Obras e serviços urbanos | 4 e 600 · 5 milhões · 5 e 400 | 4.619.183,34 | 4.998.308,76 | 5.380.316,65 |
| Câmara de Vereadores | 1 e 500 · 1 e 900 · 1 e 400 | 1.512.450,47 | 1.884.430,45 | 1.409.224,15 |
| Dívidas e encargos | 1 e 100 · 973 mil · 769 mil | 1.102.049,33 | 972.854,90 | 769.221,82 |
| Festas e eventos | 747 mil · 680 mil · 703 mil | 746.718,31 | 680.460,26 | 703.486,19 |
| Cultura | 134 mil · 58 mil · 118 mil | 133.889,64 | 58.121,24 | 117.786,40 |
| Assistência social | 1 e 100 · 1 e 200 · 1 milhão | 1.128.008,87 | 1.167.931,88 | 1.040.531,76 |
| Agricultura e meio ambiente | 1 e 300 · 1 e 300 · 1 e 600 | 1.309.393,05 | 1.304.879,26 | 1.613.742,08 |
| Esporte e lazer | 155 mil · 175 mil · 121 mil | 154.778,02 | 175.218,14 | 121.386,52 |

## Achados
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| a Câmara recebeu 1 milhão e 900 em 2025 | 1.901.293,21 | 2025-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · saldo atual |
| e devolveu 17 mil | 16.862,76 | 2025-12_CAMARA_PCMGE018.pdf | p.6 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · saldo atual. Recebeu − devolveu = 1.884.430,45 = gasto da Câmara em 2025 (conta própria) |
| em 2025 a prefeitura pegou 1 milhão e 200 emprestado | 1.211.707,18 | 2025-12_PCMGE016.pdf (receita da Prefeitura) | p.7 · 2.1.1.2.54.0.0 "Operações de Crédito Internas para Programas de Modernização da Administração Pública" · arrecadada até o mês (= 2025-12_PCMGE066.pdf p.13, 21000000 Operações de Crédito) |
| a energia solar nos prédios públicos previa 48 mil para 2026 | 48.000,00 | 2026-09_PCMGE065_2.pdf | p.16 · ação 2.1001.25.752.11.1.1063 "Implantação de sistemas de energia solar fotovoltaica em prédios públicos" · Total da Ação de Governo · Dotação Fixada (dotação atual 945.071,00) |
| até setembro já foram 931 mil | 930.870,71 | 2026-09_PCMGE065_2.pdf | p.16 · mesma ação · 4.4.90.52.00 Equipamentos e material permanente, fonte 1754 · Liquidada até o mês |
| pagos com o dinheiro do empréstimo | fonte 1754 | 2026-09_PCMGE065_2.pdf p.16 e 2025-12_PCMGE065.pdf p.15 | a ação só tem a fonte de recurso 1754 (em 2025, 180.018,64 na mesma ação e fonte). Código 754 = recursos de operações de crédito (classificação das fontes, Anexo II do PLDO 2025 da Bahia: https://www.ba.gov.br/seplan/sites/site-seplan/files/migracao_2024/arquivos/wp-content/uploads/PLDO-2025-ANEXO-II-CLASSIFICACAO-DAS-FONTES-DE-RECURSOS-Padronizacao-FTBAxFTFE-Ordenada-FTBA.pdf, consulta 12/11/2026). Pagamento de 12/12/2025 no documento 2025-12_PCMGE056 (conta "PM FEIRA DA MATA - PEM", fonte de pagamento 1754, 180.018,64). 180.018,64 + 930.870,71 = 1.110.889,35, menos que o empréstimo (conta própria) |
| a ação de comemorações festivas previa 606 mil em 2024 | 605.978,00 | 2024-12_PCMGE065.pdf | p.25 · ação 7.1701.13.392.3.2.2021 "Comemorações Festivas" · Total da Ação de Governo · Dotação Fixada |
| e gastou 747 mil | 746.718,31 | 2024-12_PCMGE065.pdf | p.25 · mesma ação · Liquidada até o mês |
| em 2025, gastou 680 mil | 680.460,26 | 2025-12_PCMGE065.pdf | p.25 · ação 7.1701.13.392.3.2.2021 "Comemorações Festivas" · Liquidada até o mês |
| em 2026, a previsão subiu para 1 milhão e 100 | 1.132.800,00 | 2026-09_PCMGE065_2.pdf | p.84 · ação 7.1701.13.392.10.2.2021 "Comemorações Festivas" · Dotação Fixada (dotação atual 1.145.800,00) |
| e até setembro já foram 703 mil | 703.486,19 | 2026-09_PCMGE065_2.pdf | p.84 · mesma ação · Liquidada até o mês (empenhado 789.342,40) |
| benefícios eventuais: 24 mil em 2025 | 23.549,58 | 2025-12_PCMGE065.pdf | p.80 · ação 5.801.8.244.6.2.2104 "Gestão de Benefícios Eventuais" · Liquidada até o mês (previsto 40.000,00). Em 2024 não há ação com esse nome |
| e 20 mil até setembro de 2026 | 20.179,74 | 2026-09_PCMGE065_2.pdf | p.78 · mesma ação · Liquidada até o mês (previsto 60.400,00) |
| (folha) festas sem subelemento de banda ou palco | | PCMGE065 dos três anos | a ação lança quase tudo em 3.3.90.39.00 "Outros serviços de terceiros, pessoa jurídica" (667.223,00 em 2024; 654.490,99 em 2025; 655.390,75 em 2026), parte na fonte 1701: não dá para separar bandas e palco pelo PDF |

## Pendências e observações
- O Demonstrativo Consolidado da Receita SIGA de 12/2024 está incompleto (previsão 45.628.761,00 contra 47.396.000,00 do Balanço) e alguns subtotais do de 12/2025 vêm errados (ex.: linha 17125200): a folha de receita soma só as linhas de detalhe, que fecham com o total em 2025 e 2026; em 2024 usa o Demonstrativo da Receita da Prefeitura (2024-12_PCMGE066_2) e a diferença para o Balanço fica em "Outras receitas".
- Razão da Câmara de 12/2024 sem as contas de repasse no texto: o repasse da Câmara só é dito para 2025.
- e-TCM fora do ar a partir de ~04:52: os Balanços (PCAGO015) de 2016 a 2020 não baixaram (2021 a 2025 baixaram). Regra 111: ver andamento.md.
- Nenhum nome de gestor no vídeo. Nenhuma empresa citada.

## Município (IBGE)
| Dado | Valor | Fonte |
|---|---|---|
| Código IBGE | 2910776 (microrregião Bom Jesus da Lapa, Vale São-Franciscano da Bahia) | https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios (consulta 12/11/2026) |
| População (Censo 2022) | 5.631 | https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[2910776] (arquivo siconfi/ibge_censo2022.json) |

## SICONFI (Tesouro Nacional), RREO declarado pelo município · cruzamento
API: https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo?id_ente=2910776 (arquivos em ~/Documents/RECEITAS-DESPESAS-FEIRA-DA-MATA/siconfi/, consulta 12/11/2026)
| Ano | Receita realizada (Anexo 01, linha "RECEITAS (EXCETO INTRA) (I)", Até o Bimestre) | Despesa liquidada (Anexo 01, "TOTAL DAS DESPESAS (XII)", liquidadas até o bimestre) | Empenhada |
|---|---|---|---|
| 2024 (6º bimestre) | 38.325.551,77 | 37.099.492,39 | 37.099.492,39 |
| 2025 (6º bimestre) | 46.829.862,35 | 44.628.817,09 | 44.861.930,23 |
| 2026 (4º bimestre, até agosto) | 34.817.628,03 | 35.403.818,22 (com 28.014,72 intraorçamentárias) | 44.206.605,51 |

Despesa liquidada por função (RREO Anexo 02), para guiar a pesquisa no TCM:
| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Educação | 12.188.125,41 | 17.353.295,47 | 13.640.961,49 |
| Saúde | 9.364.082,26 | 10.679.662,77 | 7.926.586,03 |
| Administração | 4.143.956,88 | 4.561.033,12 | 3.093.735,26 |
| Urbanismo | 3.591.476,22 | 3.535.232,28 | 2.424.160,93 |
| Legislativa (Câmara) | 1.512.450,47 | 1.884.430,45 | 1.251.274,56 |
| Assistência social | 1.128.008,87 | 1.167.931,88 | 934.560,28 |
| Cultura (difusão cultural) | 1.035.385,97 | 913.799,64 | 927.885,78 |
| Encargos especiais (dívida) | 1.102.049,33 | 972.854,90 | 700.296,02 |
| Agricultura | 644.940,42 | 612.041,05 | 1.005.221,65 |
| Gestão ambiental | 664.452,63 | 692.838,21 | 486.030,11 |
| Saneamento | 454.514,28 | 615.838,70 | 393.818,04 |
| Transporte | 471.602,40 | 580.886,00 | 818.647,38 |
| Energia (iluminação) | 101.590,44 | 266.351,78 | 979.355,77 |
A conferir no TCM: se a "difusão cultural" é festa (ação e elementos de bandas 3.3.90.39.94 e palco 3.3.90.39.19), e a assistência por ação (benefícios eventuais).

## Notícias públicas (só conferência interna, nunca fonte de fato no vídeo)
- Bahia Notícias, notícia 52508: lei municipal cria bônus de desempenho para professores se os índices da educação melhorarem; Ideb de 5,6 para 5,8 em 2025. https://www.bahianoticias.com.br/municipios/noticia/52508-feira-da-mata-cria-bonus-de-desempenho-para-professores-em-caso-de-melhora-de-indices-de-educacao
- Lei Municipal 524/2025 (Plano Municipal de Segurança Alimentar e Nutricional), 09/05/2025. https://www.procedebahia.com.br/publica/documentos/PR9FFINTVA13M-20250509-095119--!--Lei_Municipal_524.2025.pdf
- Alerta Licitação: avisos de 2026 (obra e reparos de unidades de saúde em Várzea da Cruz). https://alertalicitacao.com.br/!municipios/2910776
- Buscas por "Feira da Mata" + TCM, denúncia e São João não trouxeram nada do município (os resultados eram de Mata de São João, outra cidade).
