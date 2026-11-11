# Fontes do 077. orçamento de ipirá (BA)

Consulta: 11/11/2026 (downloads no e-TCM pelo Claude in Chrome, com a trava _navegador.lock, fetch + recebedor 127.0.0.1:8778 /salva, pasta IPIRA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-IPIRA/documentos_tcm/` (cada PDF com o texto extraído ao lado em .txt; 0 falhas). Município conferido no cabeçalho dos PDFs ("IPIRA" / "IPIRÁ") e competência de cada PDF mensal conferida na linha "Competência:" (12/2024, 12/2025 e 09/2026).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 168 (IPIRÁ) · Prefeitura UJ 772 · Câmara UJ 201. Sem autarquia com prestação própria (não há função 09 Previdência no PCMGE015; Prefeitura + Câmara fecham com o Balanço, centavo a centavo). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 "Pendente"). Lista de prestações: SITE-EUMAGNOLEITE/dados/prestacoes-etcm/ipira.json (22 linhas + Câmara).
"Gastou" = despesa LIQUIDADA. Total de 2024 e 2025 = Balanço Orçamentário do município (PCAGO015). 2026 = PCMGE015 de set/2026 da Prefeitura + PCMGE015 de set/2026 da Câmara. Receita = total do Balanço (2024 e 2025) e PCMGE016 de set/2026 da Prefeitura (Arrecadada até Mês, já sem a parte do Fundeb, mais a Anulada até Mês, que é negativa).
Conferido 2 vezes: 1ª depois do roteiro (11/11/2026, cada número contra saida/setores.json, saida/receita_AAAA.json e o texto dos PDFs); 2ª antes do vídeo final, com cada valor exato procurado no texto do PDF citado (scripts/pag.py, página e linha). Somas, diferenças e arredondamentos marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- Prefeitura e fundos: PCMGE015 SIGA da Prefeitura de cada ano (leitor scripts/acoes015.py). Câmara: PCMGE015 da própria Câmara (no da Prefeitura ela vem zerada).
- 2024: soma 253.575.739,04 = `2024-12_PCMGE015.pdf` p.95 · Total do Poder · Liquidações Até Mês 246.687.429,24 + `2024-12_CAMARA_PCMGE015.pdf` p.3 · Total do Poder · 6.888.309,80 = `2024_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 253.575.739,04.
- 2025: soma 243.628.431,31 = `2025-12_PCMGE015.pdf` p.105 · Total do Poder · 235.253.833,25 + `2025-12_CAMARA_PCMGE015.pdf` p.3 · 8.374.598,06 = `2025_PCAGO015.pdf` p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas 243.628.431,31.
- 2026 (até setembro): `2026-09_PCMGE015.pdf` p.107 · Total do Poder · Liquidações Até Mês 185.950.727,67 + `2026-09_CAMARA_PCMGE015.pdf` p.3 · 6.381.266,29 = 192.331.993,96 (conta própria). Empenhado: 229.940.616,39 + 8.343.818,41 = 238.284.434,80 (conta própria).
- Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15, 25 (iluminação), 26 (transporte e estradas vicinais) e as ações da Secretaria de Infraestrutura (unidade 2044) nas funções 04 (pessoal e encargos), 17 (esgoto) e 18 (abastecimento de água, barragens) · Administração 04 e 06 (segurança pública) · Dívidas e encargos 28 · Assistência social 08 · Câmara 01 · Cultura 13 sem as festas · Agricultura e meio ambiente 18, 20 e a Secretaria de Agricultura e Meio Ambiente lançada na função 04 (unidade 2099: 4.074.081,98 em 2024, 3.790.054,17 em 2025, 4.781.826,47 até set/2026) · Esporte 27.
- Regra 99, Festas e eventos x Cultura: "Festas e eventos" = a ação "APOIO AS FESTIVIDADES CIVIS, CULTURAIS E TRADICIONAIS" (2.2022.13.392.3.2.4005) inteira, mais os elementos de bandas e palco pagos em outras ações (escolhidos pelo NOME do elemento): 2024: 3.3.90.39.18 "Contratação de Empresa/Banda/Grupo Musical" 309.806,00 na ação "FOMENTO DAS AÇÕES CULTURAIS E ARTISTICAS" (2.2022.13.392.3.2.4004, `2024-12_PCMGE015.pdf` p.8). 2025: bandas 3.3.90.39.94 na Assistência social 8.000,00 (2.2055.8.122.2.2.4039), na Educação 30.000,00 (2.2077.12.361.10.2.4070) e 15.000,00 (2.2077.12.365.10.2.4075); palco 3.3.90.39.95 na Educação 5.500,00 (2.2078.12.122.10.2.4079) e na Secretaria de Agricultura 17.500,00 (2.2099.4.122.2.2.4095). 2026: nenhum elemento de banda ou palco fora da ação de festas. "Cultura" = o resto da função 13 (ação de fomento cultural).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| Ipirá arrecadou 253 milhões em 2024 | 252.610.640,58 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.7 · TOTAL: Arrecadada até Mês 265.655.311,36 + Anulada até Mês −13.044.670,78, conta própria) |
| 292 milhões em 2025 | 291.729.644,25 | 2025_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE016.pdf p.7 · TOTAL: 292.610.405,79 − 880.761,54, conta própria) |
| 226 milhões até setembro de 2026 | 225.969.425,82 | 2026-09_PCMGE016.pdf | p.7 · TOTAL · Arrecadada até Mês 226.472.620,98 + Anulada até Mês −503.195,16 (conta própria) |
| Em 2025, o FPM, da União, mandou 68 milhões e 800 | 68.832.978,37 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.1.51.0.0 Cota-Parte do FPM · Arrecadada até Mês (já sem a parte do Fundeb) |
| O Fundeb trouxe 58 milhões e 400 | 58.366.951,04 | 2025-12_PCMGE016.pdf | p.5 · 1.7.5.1.50.0.0 Transferências de Recursos do Fundo de Manutenção e Desenvolvimento da Educação Básica (Fundeb) · Arrecadada até Mês |
| a complementação da União ao Fundeb, mais 51 milhões e 200 | 51.153.995,00 | 2025-12_PCMGE016.pdf | p.3 · 1.7.1.5.00.0.0 Complementação da União ao Fundeb · Arrecadada até Mês |
| O SUS mandou 40 milhões e 400 | 40.359.157,31 | 2025-12_PCMGE016.pdf | p.2 · 1.7.1.3.00.0.0 (União) Arrecadada até Mês 35.553.041,87 + Anulada até Mês −400.000,00 = 35.153.041,87 + p.4 · 1.7.2.3.00.0.0 (Estado) 1.573.127,44 + p.6 · 2.4.1.1.00.0.0 (capital do SUS) 3.632.988,00 (soma: conta própria) |
| E o ICMS, do Estado, 19 milhões | 18.956.340,57 | 2025-12_PCMGE016.pdf | p.4 · 1.7.2.1.50.0.0 Cota-Parte do ICMS · Arrecadada até Mês (já sem a parte do Fundeb) |
| 2024: arrecadou 252 milhões e 600 | 252.610.640,58 | 2024_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 253 milhões e 600 | 253.575.739,04 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas |
| Gastou 965 mil a mais do que arrecadou | 965.098,46 | conta própria | 253.575.739,04 − 252.610.640,58 |
| 2025: arrecadou 291 milhões e 700 | 291.729.644,25 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) |
| Gastou 243 milhões e 600 | 243.628.431,31 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (Empenhadas 257.908.064,08) |
| Sobraram 48 milhões e 100 | 48.101.212,94 | conta própria | 291.729.644,25 − 243.628.431,31 |
| 2026, até setembro: arrecadou 226 milhões | 225.969.425,82 | 2026-09_PCMGE016.pdf | p.7 · TOTAL (acima) |
| Gastou 192 milhões e 300 | 192.331.993,96 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.107 e p.3 · Total do Poder · Liquidações Até Mês (soma: conta própria) |
| Sobraram 33 milhões e 600 | 33.637.431,86 | conta própria | 225.969.425,82 − 192.331.993,96 |
| E já comprometeu 238 milhões e 300 | 238.284.434,80 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.107 e p.3 · Total do Poder · Empenhos Até Mês 229.940.616,39 + 8.343.818,41 (conta própria) |

## Setores (soma = total do ano; somas das partes por setor: conta própria, saida/setores.json; liquidado de cada ação na coluna "Liquidações Até Mês" do PCMGE015 da Prefeitura e da Câmara)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado | 2025 liquidado | 2026 até set |
|---|---|---|---|---|
| Educação | 101 milhões e 600 · 116 milhões e 700 · 85 e 700 | 101.610.009,35 | 116.663.590,20 | 85.716.646,01 |
| Saúde | 51 e 200 · 54 milhões · 44 milhões | 51.233.921,24 | 54.038.315,08 | 43.959.354,33 |
| Obras e serviços urbanos | 54 e 300 · 27 e 600 · 22 e 700 | 54.263.646,82 | 27.557.048,42 | 22.669.154,71 |
| Administração | 12 e 700 · 11 e 800 · 9 milhões e 200 | 12.726.328,60 | 11.789.234,74 | 9.160.959,86 |
| Dívidas e encargos | 7 milhões e 200 · 8 milhões e 200 · 4 milhões e 500 | 7.210.020,79 | 8.192.948,13 | 4.487.999,60 |
| Assistência social | 7 milhões e 100 · 7 milhões · 6 milhões e 100 | 7.095.805,00 | 6.972.408,92 | 6.061.883,03 |
| Câmara de Vereadores | 6 milhões e 900 · 8 milhões e 400 · 6 milhões e 400 | 6.888.309,80 | 8.374.598,06 | 6.381.266,29 |
| Festas e eventos | 5 milhões e 900 · 5 milhões e 100 · 7 milhões | 5.865.303,78 | 5.139.108,49 | 7.046.880,64 |
| Cultura | 607 mil · 67 mil · 565 mil | 607.451,79 | 67.356,22 | 565.040,13 |
| Agricultura e meio ambiente | 4 milhões e 800 · 4 milhões e 100 · 5 milhões e 900 | 4.797.661,42 | 4.102.654,65 | 5.903.042,04 |
| Esporte | 1 milhão e 300 · 731 mil · 380 mil | 1.277.280,45 | 731.168,40 | 379.767,32 |
| Soma | | 253.575.739,04 | 243.628.431,31 | 192.331.993,96 |

Festas e eventos 2024: R$ 5.865.303,78 · Festas e eventos 2025: R$ 5.139.108,49 · Festas e eventos 2026 (até set): R$ 7.046.880,64.
Cultura 2025 (67 mil): a ação de fomento cultural tinha dotação de 1.176.259,60 e liquidou 67.356,22 (`2025-12_PCMGE015.pdf` p.8 · Total do Projeto/Atividade 2.2022.13.392.3.2.4004). Não é "zero".

## A Câmara (razão da própria Câmara, PCMGE018; duodécimo = repasse mensal da Prefeitura)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, recebeu 6 milhões e 890 | 6.888.358,52 | 2024-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e gastou praticamente tudo | 6.888.309,80 | 2024-12_CAMARA_PCMGE015.pdf | p.3 · Total do Poder · Liquidações Até Mês (sobra de 48,72: conta própria; não há conta de devolução no razão de 12/2024) |
| Em 2025, recebeu 8 milhões e 400 | 8.413.946,21 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 39 mil | 39.348,15 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês. Conferência: 8.413.946,21 − 39.348,15 = 8.374.598,06 = gasto liquidado da Câmara em 2025 (conta própria) |
| Até setembro de 2026, já recebeu 6 milhões e 800 | 6.824.504,17 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês (758.278,24 em setembro) |

## As festas (ação 2.2022.13.392.3.2.4005 "APOIO AS FESTIVIDADES CIVIS, CULTURAIS E TRADICIONAIS"; "previa" = Dotação Fixada inicial; "gastou" = Liquidações Até Mês)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| Em 2024, a ação de festas previa 3 milhões e 350 | 3.354.174,00 | 2024-12_PCMGE015.pdf | p.10 · Total do Projeto/Atividade 2.2022.13.392.3.2.4005 · Fixada (dotação atualizada 6.049.377,92) |
| Gastou 5 milhões e 600 | 5.555.497,78 | 2024-12_PCMGE015.pdf | p.10 · mesma linha · Liquidações Até Mês (bandas 3.3.90.39.18: 2.879.640,00 + 481.500,00; palco 3.3.90.39.19: 1.225.900,00) |
| Em 2025, previa 6 milhões e 600 | 6.599.000,00 | 2025-12_PCMGE015.pdf | p.10 · Total do Projeto/Atividade 2.2022.13.392.3.2.4005 · Fixada |
| e gastou 5 milhões e 100 | 5.063.108,49 | 2025-12_PCMGE015.pdf | p.10 · mesma linha · Liquidações Até Mês (bandas 3.3.90.39.94: 2.482.787,26 + 588.500,00; palco 3.3.90.39.95: 1.282.126,44) |
| Em 2026, previa 5 milhões e 900 | 5.890.000,00 | 2026-09_PCMGE015.pdf | p.10 · Total do Projeto/Atividade 2.2022.13.392.3.2.4005 · Fixada (dotação atualizada 8.823.100,00) |
| e até setembro já gastou 7 milhões | 7.046.880,64 | 2026-09_PCMGE015.pdf | p.10 · mesma linha · Liquidações Até Mês |
| Só com bandas, 4 milhões e 400 | 4.438.567,73 | 2026-09_PCMGE015.pdf | p.9 · 3.3.90.39.94 SERVIÇOS DE BANDA OU GRUPO MUSICAL OU PROFISSIONAL, três linhas: 837.967,73 (fonte 1500, recursos próprios) + 597.600,00 (fonte 1701) + 3.003.000,00 (fonte 1706, transferência especial da União, a "emenda Pix"; linha 401 do texto) (soma: conta própria). A fonte 1706 não é dita na fala |

## A pergunta final
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| até setembro a assistência social inteira ficou em 6 milhões e 100 | 6.061.883,03 | 2026-09_PCMGE015.pdf | soma das ações da função 08 · Liquidações Até Mês (conta própria, saida/setores.json) |
| as festas já levaram 7 milhões em 2026 | 7.046.880,64 | 2026-09_PCMGE015.pdf | p.10 · ação 2.2022.13.392.3.2.4005 · Liquidações Até Mês |
