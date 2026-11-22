# 137. orçamento de cordeiros: fontes

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 12/11/2026 e estão em `~/Documents/RECEITAS-DESPESAS-CORDEIROS/documentos_tcm/` (PDF e texto extraído). Município 107 CORDEIROS · Prefeitura UJ 712 · Câmara UJ 140 (nenhuma outra unidade com o nome da cidade). Último mês entregue: 09/2026 (Prefeitura enviou em 26/10/2026; Câmara em 20/10/2026). Nome do município conferido no cabeçalho de cada PDF usado.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE066 consolidado de set/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou mil); abaixo, o valor exato. Sem nome de gestor. Notícias só para conferência interna.

## 1. Receita (arrecadou)

| Valor exato | Documento | Página / linha | Onde aparece |
|---|---|---|---|
| 2024: R$ 44.096.473,27 | 2024-13_ANUAL_PCAGO015.pdf (Anexo XII, Balanço Orçamentário 2024) | p.1, "Receitas Correntes (I)", coluna Receitas Realizadas (receita de capital 0,00) | fala "44 milhões e 100", tela, legenda |
| 2024 (conferência) | 2024-12_PCMGE016.pdf | TOTAL: arrecadada até mês 44.096.922,93 + anulada até mês -449,66 = 44.096.473,27 | não falado |
| 2025: R$ 45.926.522,56 | 2025-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2025) | p.1, "Receitas Correntes (I)", Receitas Realizadas | fala "45 milhões e 900", tela, legenda |
| 2025 (conferência) | 2025-12_PCMGE016.pdf | p.7 TOTAL: 46.366.625,81 + anulada -440.103,25 = 45.926.522,56 | não falado |
| 2026 até set: R$ 40.631.962,99 | 2026-09_PCMGE066.pdf (Demonstrativo da Receita consolidado, setembro/2026) | p.9, "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA", Arrecadado até Mês (correntes 44.017.796,02 + capital 350.000,00 − dedução Fundeb 3.735.833,03) | fala "40 milhões e 600", tela, legenda |

- O arquivo enviado ao TCM como PCMGE016 de set/2026 é, na verdade, uma cópia do demonstrativo consolidado da DESPESA (o mesmo conteúdo do PCMGE015). Por isso a receita de 2026 vem do PCMGE066 (receita consolidada). Anotado em _pendencias-tcm.md.
- 2025: o PCMGE066 consolidado de dez/2025 traz R$ 45.726.522,56, R$ 200.000,00 a menos que o PCMGE016 da Prefeitura e o Balanço: falta nele a linha 1.7.1.7.52 "Convênios da União destinados a programas de assistência social" (200.000,00). Vale o Balanço (45.926.522,56), que é igual ao PCMGE016 e ao SICONFI.

### De onde veio o dinheiro em 2025 (PCMGE016 dez/2025; valor = arrecadada até mês + anulada até mês, já sem a parte do Fundeb)

| Valor exato | Linha | Página | Onde aparece |
|---|---|---|---|
| União: R$ 31.996.296,97 | 1.7.1.0.00.0.0 (32.432.031,53 − 435.734,56 anulada) | p.2 | fala "32 milhões", mapa |
| FPM: R$ 17.638.067,12 (bruto 21.458.799,24; dedução Fundeb 3.820.732,12) | 1.7.1.1.51.0.0 (17.812.931,20 − 174.864,08 anulada) | p.2 | fala "17 milhões e 600, já sem a parte do Fundeb" |
| SUS da União: R$ 5.813.337,20 | 1.7.1.3.00.0.0 (6.074.207,68 − 260.870,48 anulada); previsto 8.807.000,00 | p.3 | fala "5 milhões e 800"; achado "previu 8 milhões e 800" |
| Estado: R$ 4.922.977,59 | 1.7.2.0.00.0.0 (ICMS 3.217.403,81 já sem o Fundeb) | p.4 | fala "4 milhões e 900" |
| Fundeb (retorno): R$ 6.959.118,00 | 1.7.5.0.00.0.0 | p.5 | fala "7 milhões" |
| Impostos e taxas da cidade: R$ 1.209.121,49 | 1.1.0.0.00.0.0 (1.213.490,18 − 4.368,69) | p.1 | fala "1 milhão e 200" |
| IPTU: R$ 80.276,10 | 1.1.1.2.50.0.0 (80.425,58 − 149,48) | p.1 | fala "80 mil" |
| Soma dos grupos = 45.926.522,56 (diferença 0,00) | scripts/receita.py | | conferência |

- Previsto para 2025: R$ 65.840.000,00 (Balanço 2025, p.1, "SUBTOTAL DAS RECEITAS", Previsão Atualizada). Arrecadou 45.926.522,56: R$ 19.913.477,44 a menos (coluna "Saldo"). Fala: "previu arrecadar 65 milhões e 800. Arrecadou 45 milhões e 900."
- Iluminação pública (CIP, 1.2.4): não existe linha de receita com esse nome em 2024, 2025 nem 2026. Só "Contribuição de melhoria para expansão da rede de iluminação" prevista (2.000 a 3.000 por ano) e não arrecadada. Não falado.
- SUS conferido entre o PCMGE016, o Balanço e o SICONFI (DCA 2025, 1.7.1.3.50.0.0 = 5.813.337,20). Conferência no Fundo Nacional de Saúde fica pendente.

## 2. Despesa (gastou, liquidado)

| Valor exato | Documento | Página / linha | Onde aparece |
|---|---|---|---|
| 2024: R$ 46.371.977,68 (empenhado 46.511.977,68) | 2024-13_ANUAL_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)", Despesas Liquidadas | fala "46 milhões e 400", tela |
| = Prefeitura 45.499.826,82 + Câmara 872.150,86 | 2024-12_PCMGE015.pdf p.95 "Total do Poder" + 2024-12_CAMARA_PCMGE015.pdf p.3 "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" | | conferência |
| 2024 a mais: R$ 2.275.504,41 (conta própria: 46.371.977,68 − 44.096.473,27) [13/11/2026: soma conferida; despesa 46.371.977,68 em 2024-13_ANUAL_PCAGO015.pdf p. 2, receita 44.096.473,27 na p. 1] | | | fala "2 milhões e 300 a mais" |
| 2025: R$ 45.743.757,31 (empenhado 45.747.757,31) | 2025-13_ANUAL_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)", Despesas Liquidadas | fala "45 milhões e 700" |
| = Prefeitura 44.100.749,94 + Câmara 1.643.007,37 | 2025-12_PCMGE015.pdf p.84 "Total do Poder" + 2025-12_CAMARA_PCMGE015.pdf "Total da Unidade" | | conferência |
| 2025 sobraram: R$ 182.765,25 (conta própria: 45.926.522,56 − 45.743.757,31; o Balanço mostra superávit de 178.765,25 sobre o EMPENHADO) | 2025-13_ANUAL_PCAGO015.pdf | p.1 e 2: receita 45.926.522,56 (p.1/2) − despesa liquidada 45.743.757,31 (p.2) = 182.765,25, conta refeita 12/11 22:40 | fala "Sobraram 183 mil" |
| 2026 até set: R$ 34.191.655,39 liquidado; R$ 50.641.764,93 empenhado | 2026-09_PCMGE015.pdf (Demonstrativo CONSOLIDADO da Despesa, Prefeitura + fundos + Câmara) | p.102, TOTAL, linha "Até o Mês" | fala "34 milhões e 200" e "já empenhou 50 milhões e 600" |

Regra do 037: em 2026 o empenhado (50,6 mi) passa do arrecadado (40,6 mi), por isso a fala não diz "sobrou"; diz "gastou 34 milhões e 200, mas já empenhou, ou seja, reservou para pagar, 50 milhões e 600".

### Setores (função da ação; scripts/setores.py; soma = total do ano, diferença 0,00)

Exceção pelo NOME: em 2024 a ação "MANUTENCAO DO DEPARTAMENTO DE CULTURA" (5.156.27.813.28.2.2144) está na função 27 (lazer) e foi contada em Cultura (o departamento é da cultura); em 2025 e 2026 a mesma ação é "MANUTENCAO DO FUNDO MUNICIPAL DE CULTURA" na função 13. Festas e eventos saem dessa ação pela relação de pagamentos (seção 4).

| Setor | 2024 (dez, PCMGE015 Prefeitura e Câmara) | 2025 (dez, PCMGE015 Prefeitura e Câmara) | 2026 até set (PCMGE015 consolidado) | Fala |
|---|---|---|---|---|
| Educação | 15.494.375,24 | 16.485.574,39 | 14.163.284,93 | 15 milhões e 500 / 16 e 500 / 14 e 200 |
| Saúde | 11.233.074,46 | 10.797.244,50 | 8.041.061,08 | 11 e 200 / 10 e 800 / 8 milhões |
| Administração | 10.853.622,56 | 10.326.293,83 | 6.407.326,57 | 10 e 900 / 10 e 300 / 6 e 400 |
| Obras e serviços urbanos | 2.767.149,85 | 926.979,44 | 1.081.257,41 | 2 milhões e 800 / 927 mil / 1 milhão e 100 |
| Câmara de Vereadores | 872.150,86 | 1.643.007,37 | 1.185.797,47 | 872 mil / 1 milhão e 600 / 1 milhão e 200 |
| Dívidas e encargos | 2.176.438,93 | 2.617.044,53 | 597.189,87 | 2 milhões e 200 / 2 milhões e 600 / 597 mil |
| Festas e eventos | 1.075.050,34 | 905.595,06 | 822.798,55 | 1 milhão e 100 / 906 mil / 823 mil |
| Cultura | 130.339,04 | 257.587,20 | 273.764,53 | 130 mil / 258 mil / 274 mil |
| Assistência social | 1.163.781,74 | 1.123.882,30 | 1.062.809,97 | 1 milhão e 200 / 1 milhão e 100 / 1 milhão e 100 |
| Agricultura | 244.036,40 | 252.461,37 | 339.382,56 | 244 mil / 252 mil / 339 mil |
| Esporte e lazer | 361.958,26 | 408.087,32 | 216.982,45 | 362 mil / 408 mil / 217 mil |
| TOTAL | 46.371.977,68 | 45.743.757,31 | 34.191.655,39 | = Balanço / Balanço / consolidado |


- Câmara 2024 = PCMGE015 da Câmara (872.150,86); 2025 = PCMGE015 da Câmara (1.643.007,37, igual ao RREO/DCA "Legislativa"); 2026 = função 01 do consolidado (1.185.797,47 = soma dos "Total do Projeto/Atividade" do PCMGE015 da Câmara de set/2026: 45.486,01 + 689.071,71 + 451.239,75).
- Obras e serviços urbanos = funções 15 (urbanismo), 17 (saneamento) e 26 (transporte). Administração = funções 03 e 04. Agricultura = 18 e 20.
- Esporte e lazer inclui obras de praças esportivas e quadras (5.159/2.159.27.812...1032).

## 3. Câmara: recebeu, gastou e devolveu

| Valor exato | Documento | Linha | Onde aparece |
|---|---|---|---|
| 2024 recebeu R$ 1.519.869,23 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.4, 4.5.1.1.2.02 "REPASSE RECEBIDO", crédito até o mês; 12 parcelas de 126.655,77 (comprovante 2024-12_PCMGE008.pdf) | fala "1 milhão e 500" |
| 2024 gastou R$ 872.150,86 | 2024-12_CAMARA_PCMGE015.pdf | p.3, TOTAL GERAL | fala "872 mil" |
| 2024 devolveu R$ 647.718,37 | 2024-12_CAMARA_PCMGE018.pdf | p.3, 3.5.1.1.2.09 "DEVOLUÇÃO DE TRANSFERÊNCIAS RECEBIDAS" (= 1.519.869,23 − 872.150,86) | fala "648 mil" |
| 2025 recebeu R$ 1.754.161,20 | 2025-12_CAMARA_PCMGE018.pdf | p.6, REPASSE RECEBIDO | fala "1 milhão e 800" |
| 2025 gastou R$ 1.643.007,37 | 2025-12_CAMARA_PCMGE015.pdf | Total da Unidade | fala "1 milhão e 600" |
| 2025 devolveu R$ 111.153,83 | 2025-12_CAMARA_PCMGE018.pdf | p.6, DEVOLUÇÃO DE TRANSFERÊNCIAS (= 1.754.161,20 − 1.643.007,37) | fala "111 mil" |
| 2026 até set recebeu R$ 1.422.864,45 (9 × 158.096,05) | 2026-09_CAMARA_PCMGE018.pdf | p.6, REPASSE RECEBIDO | folha da Câmara (não falado) |

## 4. Festas e eventos (regra 99)

Fonte: relação de pagamentos (PCMGE056) de todos os meses de 2024, 2025 e jan-set/2026, ação de cultura (2024: unidade 0156, ação 2.144 "Manutenção do Departamento de Cultura", código 5.156.27.813.28.2.2144; 2025/2026: unidade 0178, ação 2.144 "Manutenção do Fundo Municipal de Cultura", 5.178.13.392.28.2.2144). Entra o pagamento cujo histórico fala de show, banda, apresentação artística, estrutura/locação de infraestrutura para eventos, som, palco, ou de festejos juninos, São Pedro, cavalgada, aniversário/emancipação da cidade (scripts/festas056.py). Lei Aldir Blanc, Paulo Gustavo, tarifas e enfeites de Natal ficam na Cultura. Lista completa, pagamento por pagamento (arquivo, data, empenho, credor, valor, histórico): ~/Documents/RECEITAS-DESPESAS-CORDEIROS/saida/festas_056_lista.md; o que ficou fora: festas_056_fora.md.

| Valor exato | Conferência | Onde aparece |
|---|---|---|
| 2024: R$ 1.075.050,34 (São João/São Pedro 594.954,13; aniversário 26.620,00; outros eventos e estrutura 452.996,21; Natal 480,00) | todos os pagamentos da ação em 2024 somam 1.130.226,02 = liquidado do 2024-12_PCMGE015.pdf p. 94 [13/11/2026: soma conferida: 594.954,13 + 26.620,00 + 452.996,21 + 480,00 = 1.075.050,34 = 1.130.226,02 − 55.175,68; 1.130.226,02 está no PCMGE015 p. 94] | fala "1 milhão e 100", tela, legenda, capa |
| 2025: R$ 905.595,06 (São João/São Pedro 476.770,60; aniversário 108.617,00) | pagamentos achados da ação: 1.047.409,84 x liquidado 1.161.553,86: a relação de set/2025 enviada ao TCM só tem 193 pagamentos (incompleta). 905.595,06 é o MÍNIMO achado | fala "906 mil" |
| 2026 até set: R$ 822.798,55 (São João/São Pedro 439.233,74; 65 anos de emancipação 86.772,20) | pagamentos da ação = 1.034.550,08 = liquidado (consolidado set/2026) | fala "823 mil" |
| 2024: ação de cultura liquidou R$ 1.130.226,02; não-festa R$ 55.175,68 (conta própria: 1.130.226,02 − 1.075.050,34) | PCMGE015 dez/2024 p.37 + relação de pagamentos | fala "gastou 1 milhão e 130 mil. Só 55 mil não foram festa" |
| "a maior parte no São João e no São Pedro": 2024 595 mil de 1.075 mil; 2025 477 de 906; 2026 439 de 823 (conta própria pelo histórico) | | fala |

- Parte dos shows de 2025 (380 mil) e 2026 (357 mil) foi paga com a fonte 1701 (convênio). Não falado.
- Pergunta final: festa 2024 R$ 1.075.050,34 x agricultura 2024 R$ 244.036,40 (setores.py) e gastou a mais em 2024 R$ 2.275.504,41.

## 5. Cruzamento (SICONFI e IBGE; não é número de tela)

- IBGE 2909000 (API de localidades), Censo 2022 7.546 habitantes; estimativa 2026 7.735. Região imediata Vitória da Conquista.
- SICONFI (apidatalake.tesouro.gov.br, consultado 12/11/2026, JSON em ~/Documents/RECEITAS-DESPESAS-CORDEIROS/siconfi/): RREO 6º bim 2024 receita 44.096.473,27 e liquidado 46.371.977,68; RREO 6º bim 2025 receita 45.926.522,56 e liquidado 45.743.757,31; DCA 2024 e 2025 iguais. Batem com o TCM centavo a centavo. RREO 4º bim 2026 (até agosto): receita 35.755.017,81, liquidado 30.004.456,93.

## 6. O que ficou de fora
- Decisões do TCM (processos, multas, denúncias): não consultadas (a página pede captcha, que fica com o Magno). O vídeo não fala do Tribunal além da origem dos dados.
- Notícias (lista interna em referencias/noticias.md): nenhuma usada no vídeo. Reforma do estádio (Sudesb, 2024) e BA-148 são obras do Estado.
- Tarifa bancária: fora (regra do lote).

## Regra 111 (site)
- PCAGO015 de 2015 a 2025 em documentos_tcm (2015 a 2019 achados pelo título "Balanço orçamentário, conforme definido no MCASP", depois de corrigir o baixador). extrai_balancos.py leu 2016 e 2018 a 2025 (dados/balancos.json; 2024 e 2025 = valores do vídeo). 2015 e 2017 são digitalizados: lidos à mão na p.1 e anotados em dados/balancos_manuais.json ("CORDEIROS": 2015 receita 18.187.130,36 / liquidado 18.472.366,69; 2017 receita 18.731.704,13 / liquidado 18.563.269,23).
