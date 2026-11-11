# Fontes do 079. orçamento de nazaré (BA)

Consulta: 09/11/2026 (downloads no e-TCM entre 13:30 e 23:02). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-NAZARE/documentos_tcm/`.
e-TCM: município 272 (NAZARÉ) · Prefeitura UJ 876 · Câmara UJ 305 (sem autarquia com prestação própria; fundos de educação, saúde, assistência e cultura vêm nos consolidados).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço / PCMGE016), já sem a parte que vai para o Fundeb, como o documento traz.
Conferido 2 vezes: 1ª depois do roteiro (09/11/2026 ~23:40); 2ª antes do vídeo final (ver fim do arquivo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo | Linha / coluna |
|---|---|---|---|
| arrecadou 181,7 mi em 2024 | 181.728.870,73 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | SUBTOTAL DAS RECEITAS (III), coluna Receitas Realizadas |
| gastou 191,4 mi em 2024 | 191.378.362,76 | 2024_PCAGO015.pdf | SUBTOTAL DAS DESPESAS (XI), coluna Despesas Liquidadas; igual ao TOTAL GERAL do 2024-12_PCMGE065.pdf (consolidado, liquidado no ano) |
| 9,6 mi a mais em 2024 | 9.649.492,03 | 2024_PCAGO015.pdf | linha "Défit (VI)" |
| arrecadou 142,3 mi em 2025 | 142.328.064,82 | 2025_PCAGO015.pdf (Balanço 2025) | SUBTOTAL DAS RECEITAS (III); igual ao "Total Geral" do 2025_PCAGO008 (Anexo 10) |
| gastou 136,9 mi em 2025 | 136.853.703,29 | 2025_PCAGO015.pdf | SUBTOTAL DAS DESPESAS (XI), Despesas Liquidadas; igual à soma das ações do 2025-12_PCMGE065.pdf |
| sobraram 5,5 mi em 2025 | 5.474.361,53 | conta própria | 142.328.064,82 − 136.853.703,29 (liquidado) |
| arrecadou 102,8 mi até set/2026 | 102.756.994,86 | 2026-09_PCMGE016.pdf (Prefeitura, SIGA) | linha "Totais", última coluna (arrecadada até o mês − anulada até o mês); o 2026-09_PCMGE066 consolidado dá 102.756.994,85 |
| já gastou 98,1 mi até set/2026 | 98.056.997,30 | 2026-09_PCMGE065.pdf (consolidado, Prefeitura + fundos + Câmara) | soma das 92 ações, coluna Liquidada até o mês |
| comprometeu 145,6 mi | 145.565.945,83 | 2026-09_PCMGE065.pdf | soma das ações, coluna Empenhada até o mês |

## Setores (soma = total do ano, diferença 0,00) · scripts/setores.py → saida/setores.json
Setor = secretaria/fundo (unidade orçamentária); função 28 em Dívidas; função 27 em Esporte; função 23 em Comércio e turismo. Liquidado. 2024: 2024-12_PCMGE065.pdf (consolidado Fator, 103 ações); 2025: 2025-12_PCMGE065.pdf (consolidado SIGA, 105 ações); 2026: 2026-09_PCMGE065.pdf (92 ações).

| Setor | 2024 | 2025 | 2026 até set |
|---|---|---|---|
| Educação | 103.000.376,45 | 60.095.032,46 | 37.560.749,03 |
| Saúde | 24.277.754,06 | 22.886.692,02 | 17.512.436,95 |
| Administração | 8.730.437,31 | 8.036.313,91 | 6.404.978,48 |
| Obras e serviços urbanos | 31.570.208,35 | 18.894.638,31 | 16.437.787,01 |
| Câmara de Vereadores | 4.026.485,21 | 4.340.946,65 | 3.688.298,06 |
| Dívidas | 6.966.975,68 | 7.356.048,11 | 4.668.569,95 |
| Cultura e festas | 4.166.395,58 | 5.308.679,60 | 3.089.798,44 |
| Assistência social | 2.964.840,89 | 4.006.685,25 | 4.262.428,67 |
| Ordem pública e trânsito | 4.092.956,28 | 4.246.279,62 | 2.334.374,24 |
| Comércio e turismo | 727.744,46 | 695.998,03 | 0,00 |
| Agricultura e meio ambiente | 643.633,80 | 521.707,57 | 889.170,10 |
| Esporte | 210.554,69 | 464.681,76 | 1.208.406,37 |

- Comércio e turismo 2026 = 0,00: única ação "FOMENTO E PROMOÇÃO AO TURISMO" (Unidade de Gestão do Turismo, função 23) com dotação 181.000,00 e liquidado 0,00 (2026-09_PCMGE065). A Sec. de Comércio de 2024/2025 não existe mais em 2026; a nova Sec. de Planejamento e Desenvolvimento Econômico (função 04, R$ 727.760,87 com a própria manutenção) ficou em Administração, e suas 4 ações de fomento/estudos (dotação 215 mil) tiveram 0,00.
- Esporte 2026 inclui a ação "Gestão das ações técnicas e administrativas da Secretaria de Cultura..." do Fundo Municipal de Cultura lançada na função 27 (desporto e lazer): R$ 865.311,04.

## Achados
| Valor dito | Valor exato | Arquivo | Linha |
|---|---|---|---|
| Fundeb 92 mi em 2024 | 92.215.621,27 | 2024_PCAGO008.pdf (Anexo 10) | 1.7.1.5.00 Complementação da União ao Fundeb 41.787.468,08 + 1.7.5.1.50 Transferências do FUNDEB 50.428.153,19 (coluna arrecadada) |
| Fundeb 48 mi em 2025 | 48.054.684,63 | 2025_PCAGO008.pdf (Anexo 10) | 1.7.1.5.00 16.101.669,55 + 1.7.5.1.50 31.953.015,08 |
| (tela) VAAT da União | 23.006.871,98 → 3.864.300,73 | Anexo 10 2024 e 2025 | 1.7.1.5.50 |
| Fundeb até set/2026 (folha) | 7.317.952,15 + 17.898.301,14 | 2026-09_PCMGE016 | 1.7.1.5 e 1.7.5 (arrecadada até o mês − anulada) |
| educação infantil 22,3 mi → 9,5 mi | 22.282.882,04 → 9.466.492,93 | PCMGE065 dez/2024 e dez/2025 | soma das ações da subfunção 365 (creche, pré-escola, alimentação e obras de ensino infantil), liquidado |
| (folha) EJA | 7.310.833,89 → 917.114,63 | PCMGE065 dez/2024 e dez/2025 | subfunção 366 |
| festas 3,1 / 3,8 / 2,9 mi | 3.070.680,74 · 3.801.313,51 · 2.851.621,64 | PCMGE065 dez/2024, dez/2025, set/2026 | ação "Manutenção das festas culturais, cívicas e religiosas" (2024, 2025, Sec. de Cultura e Turismo) e "Realização de festas e eventos populares" (2026, Fundo Municipal de Cultura), liquidado |
| ajuda às famílias 34 / 149 / 233 mil | 33.664,58 · 148.545,95 · 232.509,88 | idem | ações "Gestão dos benefícios eventuais" (2025 = 147.129,35 do FMAS + 1.416,60 da Sec. de Desenvolvimento Social) |
| Câmara 4,3 mi em 2025, mais de 8 vezes a agricultura | 4.340.946,65 ÷ 521.707,57 = 8,3 | setores 2025 | conta própria |
| deve 94,6 mi | 94.641.117,15 | 2025_PCAGO012.pdf (Anexo 16, dívida fundada, dez/2025) | linha Total, Saldo Atual |
| quase tudo ao INSS | 84.645.910,86 | idem | INSS débito parcelado 3.937.584,32 (circulante) + 80.708.326,54 (não circulante); Banco do Brasil 9.995.206,29 |
| dívida subiu | 89.576.875,11 → 91.249.714,47 → 94.641.117,15 | 2024_PCAGO012 e 2025_PCAGO012 | saldo anterior 2024 → saldo atual 2024 → saldo atual 2025 |
| pagando quase 12 mi em dois anos | 11.959.271,35 | idem | baixas 5.719.329,73 (2024) + 6.239.941,62 (2025) |

## Câmara (folha)
| Valor | Arquivo | Linha |
|---|---|---|
| recebeu da prefeitura 2024: 4.026.741,90 | 2024-12_CAMARA_PCMGE018.pdf | 4.5.1.1.2.02.00 Repasse recebido, saldo |
| recebeu 2025: 4.515.262,80 | 2025-12_CAMARA_PCMGE018.pdf | 4.5.1.1.2.02.00 |
| recebeu até set/2026: 3.690.456,84 | 2026-09_PCMGE018.pdf (Prefeitura) | 3.5.1.1.2.02.00 Repasse concedido (igual ao recebido no razão da Câmara) |

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, consulta 09/11/2026, texto salvo em decisoes/TCM_auditoria_NAZARE_2026-11-09.txt; 117 processos)
- Processo 12662e22 (Termo de Ocorrência, exercício 2020): juros e multas pagos ao INSS por atraso no recolhimento (R$ 74.942,81). Julgado em 05/02/2026: procedência parcial, multa de R$ 1.500,00 à gestora da época. Recurso Ordinário 06315e26 julgado em 22/10/2026: não provido, multa mantida. PDFs: decisoes/2022_delib_12662e22.pdf e 2022_pedrec_12662e22.pdf (tcm.ba.gov.br/sistemas/textos/2022/...).
- Processo 08852e24 (Auditoria operacional coordenada do Programa Nacional de Imunização, exercício 2024): julgado em 13/10/2026, "procedência das conclusões do relatório de auditoria, com recomendações", irregularidades identificadas e falhas no controle interno. PDF: decisoes/2024_delib_08852e24.pdf.
- Sem nome de gestor no vídeo.

## Receita por ano (folhas, sem fala) · scripts/receita.py → saida/receita_AAAA.json
2024 e 2025: Anexo 10 (PCAGO008), coluna arrecadada; FPM, ICMS e IPVA já sem a dedução do Fundeb (9.7.x). 2026: PCMGE016 set/2026, arrecadada até o mês menos anuladas (a coluna já vem líquida do Fundeb). Soma de cada folha = total falado (diferença 0,00, linha "Outras receitas" fecha).

## Notícias
Não usadas como fonte de fato dito no vídeo (regra 25).

## 2ª conferência (09/11/2026, antes do vídeo final)
- 36 valores de setor da fala comparados com saida/setores.json (soma das ações do PCMGE065 de cada ano): 0 diferença acima do arredondamento dito.
- Achados conferidos no texto dos PDFs: festas 3.070.680,74 (2024-12_PCMGE065), 3.801.313,51 (2025-12_PCMGE065), 2.851.621,64 (2026-09_PCMGE065); benefícios eventuais 33.664,58 · 147.129,35 + 1.416,60 · 232.509,88 (mesmos arquivos); Fundeb 41.787.468,08 e 50.428.153,19 (2024_PCAGO008), 16.101.669,55 e 31.953.015,08 (2025_PCAGO008); dívida 94.641.117,15 (2025_PCAGO012); receitas 181.728.870,73 (2024_PCAGO015), 142.328.064,82 (2025_PCAGO015), 102.756.994,86 (2026-09_PCMGE016). Tudo bate.
- Capa "Fundeb caiu R$ 44 mi": 92.215.621,27 − 48.054.684,63 = 44.160.936,64 (conta própria, Anexo 10 2024 e 2025). "Festas: R$ 3,8 mi" = 3.801.313,51 (2025).
