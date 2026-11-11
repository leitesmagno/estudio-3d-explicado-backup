# Fontes do 099. orçamento de guaratinga (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 02:22 e 02:36, pelo recebedor 127.0.0.1:8778, pasta GUARATINGA, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-GUARATINGA/documentos_tcm/` (32 PDFs, todos com "GUARATINGA" conferido no cabeçalho).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 144 (GUARATINGA) · Prefeitura UJ 748 · Câmara UJ 177 (sem autarquia com prestação própria). Último mês entregue de 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço Orçamentário anual de 2024 e 2025; em 2026, PCMGE016 até setembro), já sem a parte que vai para o Fundeb e sem as anulações, como o documento traz.
Despesa por setor: PCMGE015 (Demonstrativo da Despesa Orçamentária, SIGA) da Prefeitura (a Câmara aparece nele zerada) + PCMGE015 da Câmara. Soma das ações da Prefeitura = linha "Total do Poder" (liquidado) e Prefeitura + Câmara = Balanço Orçamentário, centavo a centavo (scripts/acoes015c.py e setores.py).
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026 ~02:40, cada número do roteiro contra saida/setores.json, receita_*.json e os PDFs); 2ª antes do vídeo final (ver fim do arquivo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 87 milhões em 2024 | 86.964.790,45 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas; igual ao 2024-12_PCMGE016.pdf p.6 · Totais · Total Até Mês |
| gastou 92 milhões e 300 em 2024 | 92.306.459,17 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; = 2024-12_PCMGE015.pdf p.58 (Total do Poder, Liquidações até mês 88.998.666,98) + 2024-12_CAMARA_PCMGE015.pdf p.3 (Total do Poder, 3.307.792,19) |
| 5 milhões e 300 a mais em 2024 | 5.341.668,72 | 2024_PCAGO015.pdf | p.1 · linha DÉFICIT (VI); conta própria igual: 92.306.459,17 − 86.964.790,45 |
| arrecadou 95 milhões e 900 em 2025 | 95.882.106,80 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (o PCMGE016 dez/2025 traz 95.885.532,48; usado o Balanço, documento anual) |
| gastou 93 milhões e 100 em 2025 | 93.114.984,10 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; = 2025-12_PCMGE015.pdf p.63 (89.121.055,57) + 2025-12_CAMARA_PCMGE015.pdf p.3 (3.993.928,53) |
| sobraram 2 milhões e 800 em 2025 | 2.767.122,70 | conta própria | 95.882.106,80 − 93.114.984,10 |
| arrecadou 79 milhões e 700 até set/2026 | 79.746.195,85 | 2026-09_PCMGE016.pdf | p.7 · Totais · Total Até Mês (arrecadada 79.758.190,44 − anulada 11.994,59) |
| já gastou 81 milhões e 800 até set/2026 | 81.836.334,08 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.90 · Total do Poder · Liquidações até mês 78.694.929,95 + Câmara p.3 · Total do Poder 3.141.404,13 (conta própria: soma) |
| 2 milhões e 100 a mais | 2.090.138,23 | conta própria | 81.836.334,08 − 79.746.195,85 |
| já comprometeu 90 milhões e 800 | 90.788.179,73 | 2026-09_PCMGE015.pdf + 2026-09_CAMARA_PCMGE015.pdf | p.90 · Total do Poder · Empenhos até mês 86.671.583,15 + Câmara p.3 · 4.116.596,58 (conta própria: soma) |

Observação (não dita): o Anexo 16 de 2025 (2025_PCAGO012.pdf) traz a linha "DÍVIDA FUNDADA INSS" com inscrição de 123.302.495,09 e saldo de 184.910.464,83, mas a linha TOTAIS do mesmo anexo (113.150.749,76) não bate com a soma das linhas (193,1 mi). Por não fechar, o vídeo usa só o saldo do fim de 2024 (Anexo 16 de 2024, que fecha).

## Setores (soma = total do ano, diferença 0,00) · scripts/setores.py → saida/setores.json
Setor pela ação do PCMGE015 (coluna Liquidações até mês). Dívidas = ação 28.843 "Administração da dívida pública" (principal da dívida contratual + sentenças judiciais). Cultura e festas = função 13 (fomento à cultura) + ação 2007 "Manutenção das ações das festas tradicionais" (em 2025 ela está na função 04.392). Esporte = função 27 (Secretaria da Juventude, Cultura e Esporte e ações de esporte). Administração = Gabinete, Procuradoria, Controladoria, Secretarias de Governo, Administração e Finanças (com o PASEP). Obras e serviços urbanos = Secretaria de Infraestrutura, Departamento de Transporte e Rodagens, iluminação pública, pavimentação. Agricultura e meio ambiente = Secretarias de Agricultura, Desenvolvimento Rural e Meio Ambiente e Turismo. Assistência social = Fundo de Assistência Social, Fundo da Criança e do Adolescente, Fundo de Habitação. Câmara = PCMGE015 da própria Câmara (UJ 177).
Arquivos: 2024-12_PCMGE015.pdf (68 ações, 58 p.) · 2025-12_PCMGE015.pdf (66 ações, 63 p.) · 2026-09_PCMGE015.pdf (122 ações, 90 p.) · Câmara: 2024-12, 2025-12 e 2026-09_CAMARA_PCMGE015.pdf.

| Setor | Dito (2024 · 2025 · 2026) | 2024 | 2025 | 2026 até set | Páginas no PCMGE015 (2024 · 2025 · 2026) |
|---|---|---|---|---|---|
| Educação | 38 e 800 · 38 e 400 · 33 e 300 | 38.825.685,61 | 38.386.515,18 | 33.332.705,15 | p.46 a 56 · p.50 a 61 · p.73 a 89 |
| Saúde | 20 e 200 · 21 e 600 · 19 e 700 | 20.203.595,25 | 21.558.646,50 | 19.722.736,21 | p.24 a 34 · p.26 a 35 · p.40 a 54 |
| Administração | 8 e 400 · 10 e 400 · 7 e 400 | 8.407.088,27 | 10.351.927,84 | 7.363.176,81 | p.2 a 10 · p.2 a 12 · p.2 a 17 |
| Obras e serviços urbanos | 10 e 400 · 7 e 700 · 8 e 800 | 10.444.067,80 | 7.691.195,95 | 8.814.129,03 | p.14 a 20 · p.15 a 21 · p.23 a 33 |
| Câmara de Vereadores | 3 milhões e 300 · 4 milhões · 3 milhões e 100 | 3.307.792,19 | 3.993.928,53 | 3.141.404,13 | CAMARA_PCMGE015 p.3 (Total do Poder) nos três anos |
| Dívidas | 6 e 500 · 4 e 600 · 1 e 700 | 6.509.811,30 | 4.640.124,49 | 1.669.696,10 | p.10 · p.11 · p.16 |
| Assistência social | 2 e 600 · 2 e 600 · 3 milhões e 100 | 2.639.693,57 | 2.581.827,03 | 3.118.089,09 | p.35 a 45 · p.36 a 49 · p.55 a 73 |
| Agricultura e meio ambiente | 1 e 200 · 1 e 300 · 1 e 200 | 1.198.585,60 | 1.295.765,62 | 1.157.469,76 | p.21 a 24 · p.22 a 25 · p.34 a 39 |
| Cultura e festas | 209 mil · 1 e 700 · 2 e 500 | 208.723,05 | 1.685.952,27 | 2.510.225,04 | p.3 a 12 · p.4 a 13 · p.8 a 21 |
| Esporte | 561 mil · 929 mil · 1 milhão | 561.416,53 | 929.100,69 | 1.006.702,76 | p.13 · p.14 · p.19 a 54 |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| em 2024, as festas tradicionais não tiveram gasto | 0,00 (empenhado 0,00; previsto 750.000,00) | 2024-12_PCMGE015.pdf | p.3 · ação 201.2010.4.392.134.2.2007 "Manuntenção das ações das festas tradicionais" · Total do Projeto/Atividade · Empenhos e Liquidações até mês |
| em 2025, foram 1 milhão e 500 | 1.520.274,51 | 2025-12_PCMGE015.pdf | p.4 · ação 2.2010.4.392.134.2.2007 · Total do Projeto/Atividade · Liquidações até mês (festividades e homenagens 1.039.940,00; cenários e palco 479.889,44) |
| em 2026, até setembro, já são 2 milhões e 300 | 2.322.703,23 (empenhado 2.580.113,23) | 2026-09_PCMGE015.pdf | p.8 · ação 2.2010.13.392.160.2.2007 · Total do Projeto/Atividade · Liquidações até mês |
| em 2025, o IPTU da cidade inteira rendeu 334 mil | 334.278,42 | 2025-12_PCMGE016.pdf | p.1 · 1.1.1.2.50.0.0 Imposto sobre a Propriedade Predial e Territorial Urbana · Arrecadada até Mês |
| o milhão de 2026 do esporte foi todo para manter a secretaria | 1.006.702,76 | 2026-09_PCMGE015.pdf | p.19 · ação 27.122 "Gestão das ações da Sec. Mun. da Juventude, Cultura, Esporte" · Liquidações até mês (única ação do esporte com gasto) |
| a maior parte em salários | 698.531,07 | 2026-09_PCMGE015.pdf | p.19 · mesma ação · elementos 3.1.90.11 e 3.1.90.13 (pessoal) · Liquidações até mês |
| para quadras, ginásio e eventos esportivos, nada empenhado | 0,00 empenhado em cada ação (previstos 25.000,00; 25.000,00; 26.100,00) | 2026-09_PCMGE015.pdf | p.20 · ações 27.813 "Construção, ampliação e reforma do ginásio de esporte", "Reforma e melhoria das quadras, campos e ginásio esportivo", "Gestão das ações dos eventos esportivos" · Empenhos até mês = 0,00 |
| a Câmara foi de 3 milhões e 300 em 2024 | 3.307.792,19 | 2024-12_CAMARA_PCMGE015.pdf | p.3 · Total do Poder · Liquidações até mês |
| para 4 milhões em 2025 | 3.993.928,53 | 2025-12_CAMARA_PCMGE015.pdf | p.3 · Total do Poder · Liquidações até mês |
| só em consultoria, 489 mil | 489.500,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica 204.000,00 + 3.3.90.35.99 Outros serviços de consultoria 285.500,00 (conta própria: soma) |
| a Câmara gastou mais de 3 vezes o que foi para agricultura e meio ambiente (2025) | 3.993.928,53 ÷ 1.295.765,62 = 3,08 | conta própria | agricultura e meio ambiente 2025 = Sec. de Agricultura 558.064,50 + Meio Ambiente e Turismo 419.007,56 + Desenvolvimento Rural 318.693,56 (2025-12_PCMGE015.pdf p.22 a 25) |
| em 2024 e 2025, a prefeitura pagou 11 milhões e 100 entre parcelas de empréstimo e sentenças judiciais | 11.149.935,79 | 2024-12_PCMGE015.pdf e 2025-12_PCMGE015.pdf | 2024 p.10 · ação 28.843 Total 6.509.811,30 (principal 4.577.226,62 + sentenças 1.932.584,68); 2025 p.11 · ação 28.843 Total 4.640.124,49 (amortização 2.544.537,29 + sentenças 2.086.347,20 + 9.240,00) (conta própria: soma) |
| no fim de 2024, a dívida parcelada com o INSS era de 63 milhões e 500 | 63.543.257,11 | 2024_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna, Consolidado) | p.1 · 22143010101 INSS - DÉBITO PARCELADO (P) · Saldo Atual |
| festas já levaram 2 milhões e 300 este ano | 2.322.703,23 | 2026-09_PCMGE015.pdf | p.8 (mesma linha acima) |

## Câmara: repasse (duodécimo), nas folhas
| Ano | Recebeu da prefeitura | Devolveu | Arquivo · página · conta |
|---|---|---|---|
| 2024 | 3.324.018,77 | 16.226,58 | 2024-12_CAMARA_PCMGE018.pdf p.1 · 4.5.1.1.2.02.00 REPASSE RECEBIDO; 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS |
| 2025 | 3.993.997,32 | 68,79 | 2025-12_CAMARA_PCMGE018.pdf p.1 · mesmas contas |
| 2026 até set | 3.135.430,92 | não houve | 2026-09_CAMARA_PCMGE018.pdf p.6 · 4.5.1.1.2.02.00 |

## Receita por ano (folhas de receita) · scripts/receita.py → saida/receita_AAAA.json
PCMGE016 de dez/2024 (p.1 a 6), dez/2025 (p.1 a 7) e set/2026 (p.1 a 7), coluna Arrecadada até Mês + Anulada até Mês, linhas por código (FPM 1.7.1.1.51, ICMS 1.7.2.1.50, Fundeb 1.7.5, complementação da União 1.7.1.5, SUS 1.7.1.3 + 1.7.2.3, IPTU 1.1.1.2.50, ISS 1.1.1.4.51 etc.). Em 2025, os 3.425,68 de diferença entre o PCMGE016 e o Balanço ficam em "Outras receitas".


## 2ª conferência (antes do vídeo final, 10/11/2026)
82 valores exatos deste arquivo procurados no texto dos 32 PDFs: 66 achados literalmente; os outros 16 são somas (setores, totais de 2026, sobra e diferenças, 11,1 mi das dívidas, 1.039.940,00 das festividades de 2025, 3,08 vezes), refeitas a partir das linhas citadas e marcadas como conta própria.
