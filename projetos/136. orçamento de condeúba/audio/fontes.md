# Fontes · 136. orçamento de Condeúba

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 12/11/2026, entre 01:20 e 02:30, e estão guardados em `~/Documents/RECEITAS-DESPESAS-CONDEUBA/documentos_tcm/` (PDF e texto extraído). Município CONDEÚBA (código 104 no e-TCM) · Prefeitura Municipal de CONDEUBA (UJ 709) · Câmara Municipal de CONDEÚBA (UJ 137). Não há outra unidade (autarquia, SAAE ou instituto) com o nome da cidade no e-TCM.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de ago/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil (ou para mil, abaixo de 1 milhão); abaixo, o valor exato. Último mês entregue em 2026: AGOSTO (a Prefeitura está com 09/2026 e 10/2026 "Pendente" no e-TCM em 12/11/2026; lista gravada em SITE-EUMAGNOLEITE/dados/prestacoes-etcm/condeuba.json).

Sistemas de contabilidade diferentes em cada ano (por isso há três leitores): dez/2024 "Modelo 01" (SIAFIC), dez/2025 SIGA (demonstrativos gerados pelo TCM), ago/2026 e o Balanço 2025 no SAPI.

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 92.605.695,21 | 2024-13_ANUAL_PCAGO015.pdf (Anexo XII, Balanço Orçamentário 2024) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "92 milhões e 600", mapa |
| (conferência) Anexo 10 de 2024: R$ 100.748.694,73 (correntes) + R$ 348.073,21 (capital) - R$ 8.491.072,73 (dedução do Fundeb) = R$ 92.605.695,21 | 2024-13_ANUAL_PCAGO008.pdf | p.1 e últimas linhas | Arrecadada | folha da receita 2024 (item a item) |
| (diferença) PCMGE016 de dez/2024: R$ 90.382.124,97 | 2024-12_PCMGE016.pdf | "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA" | Arrecadado até mês | o Balanço tem R$ 2.223.570,24 a mais (taxas, receitas patrimoniais e "demais receitas" lançadas depois de dezembro); vale o Balanço |
| Receita 2025: R$ 97.546.896,92 | 2025-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2025, SAPI, consolida Prefeitura e Câmara) | p.1, "SUBTOTAL DAS RECEITAS" | Receita realizada | fala "97 milhões e 500", mapa |
| (diferença) PCMGE016 de dez/2025: R$ 97.384.338,26 | 2025-12_PCMGE016.pdf | "TOTAL" | Arrecadada até mês | R$ 162.558,66 a menos que o Balanço; linha de ajuste na folha da receita 2025 |
| Receita 2026 até ago: R$ 76.439.557,65 | 2026-08_PCMGE016.pdf (balancete acumulado 01/01 a 31/08/2026, entidades 001 e 002) | p.1, 01.0.0.0 Receitas Correntes (Receitas de Capital = 0,00) | Rec. Período | fala "76 milhões e 400", mapa |

### De onde veio o dinheiro em 2025 (Anexo 10 do Balanço 2025, 2025-13_ANUAL_PCAGO008.pdf)

| Valor exato | Página / linha | Onde aparece |
|---|---|---|
| União: R$ 64.626.271,75 | p.5, "Transferencias da Uniao e de suas Entidades" | fala "64 milhões e 600", mapa |
| FPM: R$ 35.276.133,94 (já sem a dedução do Fundeb: cota mensal R$ 38.207.325,06 menos R$ 7.641.464,57) | p.5, "Cota-Parte do Fundo de Participacao dos Municipios - FPM" | fala "35 milhões e 300, já sem a parte que vai para o Fundeb", mapa |
| SUS da União: R$ 15.382.195,34 | p.5, "Transferencias de Recursos do Sistema Unico de Saude – SUS" | fala "15 milhões e 400", mapa |
| Estado: R$ 8.274.760,87 (ICMS já sem o Fundeb R$ 5.922.717,93; SUS do Estado R$ 944.484,90) | p.8, "Transferencias dos Estados e do Distrito Federal..." | fala "8 milhões e 300", mapa |
| Fundeb (retorno): R$ 14.540.033,22 | p.10, linha do Fundeb (o total da linha 1.7.5, R$ 20.671.622,31, inclui R$ 6.131.589,09 de precatórios do Fundef) | fala "14 milhões e 500", mapa |
| Impostos, taxas e contribuições da própria cidade: R$ 2.610.315,58 | p.1, "Impostos, Taxas e Contribuicoes de Melhoria" | fala "2 milhões e 600", mapa |
| IPTU: R$ 455.867,20 (previsto R$ 204.000,00) | p.1, "Imposto sobre a Propriedade Predial e Territorial Urbana" | fala "Só o IPTU, 456 mil", mapa |
| (conferência) SUS do PCMGE016 dez/2025: União R$ 15.382.195,34 (1.7.1.3) + Estado R$ 944.484,90 (1.7.2.3) | 2025-12_PCMGE016.pdf | igual ao Anexo 10. Conferência no Fundo Nacional de Saúde (consultafns.saude.gov.br): não feita nesta madrugada (pendência anotada) |

### Precatórios do Fundef (achado de receita)

| Valor exato | Documento | Página / linha | Onde aparece |
|---|---|---|---|
| 2024: R$ 7.076.589,25 | 2024-13_ANUAL_PCAGO008.pdf (Anexo 10) e 2024-12_PCMGE016.pdf | p.5, 1.7.1.9.56 "Transferencias Decorrentes de Decisao Judicial (precatorios) Relativas ao Fundo de Manutencao e Desenvolvimento do Ensino Fundamental" (Principal R$ 6.625.808,51 + R$ 450.780,74) | fala |
| 2025: R$ 6.131.589,09 | 2025-13_ANUAL_PCAGO008.pdf (Anexo 10) | p.10, "TRANSFERENCIAS RECURSOS PRECATÓRIOS - FUNDEF" (dentro da linha do Fundeb) | fala |
| Soma 2024 + 2025: R$ 13.208.178,34 (conta própria) | 2024-13_ANUAL_PCAGO008.pdf p.5 + 2025-13_ANUAL_PCAGO008.pdf p.10 | 13.208.178,34 = 7.076.589,25 (2024) + 6.131.589,09 (2025) | fala "13 milhões e 200" |
| Gasto liquidado com a fonte 1544 "Recursos de Precatórios do FUNDEF" (só conferência, não falado): R$ 5.925.152,56 em 2024 (pago R$ 5.915.101,22), R$ 1.705.536,06 em 2025 e R$ 3.737.557,09 até ago/2026 (2025 e 2026 a reconferir se pago ou liquidado), na Educação ("Manutenção dos serviços técnicos e administrativos" e transporte escolar) | PCMGE015 de 12/2024 (p.39-42), 12/2025 e 08/2026 | 2024: 5.925.152,56 = 398.781,43 (3.3.90.30) + 8.380,46 (3.3.90.33) + 630.314,00 (3.3.90.36) + 76.340,87 (3.3.90.39) + 3.221.955,27 (3.3.90.93) + 26.010,00 (4.4.90.52) + 1.563.370,53 (3.3.90.33), liquidado no ano, fonte 15440000; conferido 14/11/2026 | não falado |

Folhas de receita (item a item, soma = total do ano): `saida/receita_2024.json` (Anexo 10), `receita_2025.json` (PCMGE016 + ajuste ao Balanço), `receita_2026.json` (PCMGE016 SAPI). Script `scripts/receita.py`.

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 92.985.437,30 | 2024-13_ANUAL_PCAGO015.pdf (Balanço 2024) | p.1-2, "SUBTOTAL DAS DESPESAS (XI)" | Empenhadas = Liquidadas = Pagas | fala "93 milhões" |
| = Anexo 9 de 2024 (por função, com a Câmara R$ 2.362.234,21) | 2024-13_ANUAL_PCAGO007.pdf | p.4, coluna "Total" | | setores de 2024 |
| (conferência) PCMGE015 dez/2024 "Modelo 01" (Prefeitura + Câmara): liquidado R$ 93.359.670,56, pago R$ 92.985.437,30 | 2024-12_PCMGE015.pdf | "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA" | | o Balanço fechou o liquidado igual ao pago; a diferença (R$ 374.233,26) vai como "ajuste ao Anexo 9" em cada setor, pela função |
| Gastou a mais em 2024: R$ 379.742,09 (conta própria = 92.985.437,30 - 92.605.695,21; o Balanço mostra o mesmo déficit na linha TOTAL (VII)) | Balanço 2024 | | | fala "380 mil a mais" |
| Gastou 2025: R$ 98.432.344,79 | 2025-13_ANUAL_PCAGO015.pdf | p.1-2, "SUBTOTAL DAS DESPESAS" | Despesas liquidadas | fala "98 milhões e 400" |
| = Prefeitura R$ 95.251.174,39 + Câmara R$ 3.181.170,40 | 2025-12_PCMGE015.pdf p.99 "Total do Poder" e 2025-12_CAMARA_PCMGE015.pdf p.3-4 | | Liquidação até mês | bate centavo a centavo |
| Gastou a mais em 2025: R$ 885.447,87 (o Balanço 2025 traz a linha "DÉFICIT 885.447,87") | Balanço 2025 | p.1 | | fala "885 mil a mais" |
| Gastou 2026 até ago: R$ 80.287.505,88 (Prefeitura + Câmara, "Empresas Consolidadas: 001, 002") | 2026-08_PCMGE015.pdf | p.106, "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA", 2ª linha | Liquidado no ano | fala "80 milhões e 300" |
| Empenhado (comprometido) até ago/2026: R$ 88.563.392,60 | 2026-08_PCMGE015.pdf | p.106, mesma linha | Empenhado no ano | fala "já comprometeu 88 milhões e 600" |
| Gastou a mais até ago/2026: R$ 3.847.948,23 (conta própria = 80.287.505,88 - 76.439.557,65) | | | | fala "3 milhões e 800 a mais" |

## Câmara (duodécimo)

| Valor exato | Documento | Página / linha | Onde aparece |
|---|---|---|---|
| 2024: recebeu R$ 3.005.274,22 | 2024-12_CAMARA_PCMGE018.pdf (razão da Câmara) | p.1, 4.5.1.1.2.02 "REPASSE RECEBIDO", creditado até o mês | fala "recebeu 3 milhões" |
| 2024: devolveu R$ 643.040,01 | mesmo PDF | p.6, 3.5.1.1.2.09 "DEVOLUÇÃO DE TRANSFERÊNCIAS", debitado até o mês | fala "devolveu 643 mil" |
| 2024: gastou R$ 2.362.234,21 (= 3.005.274,22 - 643.040,01) | 2024-12_PCMGE015.pdf p.1 (órgão 1, Câmara) e Anexo 9 | | setor Câmara 2024 |
| 2025: recebeu R$ 3.449.759,97 | 2025-12_CAMARA_PCMGE018.pdf | p.7-8, REPASSE RECEBIDO | fala "3 milhões e 400" |
| 2025: devolveu R$ 268.589,57 | mesmo PDF | p.6-7, DEVOLUÇÃO DE TRANSFERÊNCIAS | fala "devolveu 269 mil" |
| 2025: gastou R$ 3.181.170,40 (= 3.449.759,97 - 268.589,57) | 2025-12_CAMARA_PCMGE015.pdf | p.3-4 | setor Câmara 2025 |
| 2026 até ago: recebeu R$ 2.133.000,00; gastou R$ 2.348.619,34 | 2026-08_CAMARA_PCMGE018.pdf (p.1) e 2026-08_CAMARA_PCMGE015.pdf (p.3-4) | | setor Câmara 2026 (o repasse de 2026 não é falado) |

## Dívidas (ação "Amortização da dívida contratada interna", função 04, Secretaria de Finanças)

| Valor exato | Documento | Página | Onde aparece |
|---|---|---|---|
| 2024: previa R$ 3.405.000,00 · pagou (liquidado) R$ 4.969.280,06 (elemento 4.6.90.71 principal da dívida contratual) | 2024-12_PCMGE015.pdf | p.5 | fala "previa 3 milhões e 400 e pagou 5 milhões" |
| 2025: previa R$ 4.812.000,00 · pagou R$ 5.269.803,38 | 2025-12_PCMGE015.pdf | p.12 | fala "previa 4 milhões e 800 e pagou 5 milhões e 300" |
| 2026: prevê R$ 5.190.185,00 · até ago pagou R$ 569.571,11 | 2026-08_PCMGE015.pdf | p.11-12 | fala "prevê 5 milhões e 200; até agosto, pagou 570 mil" |
| Setor "Dívidas e encargos" = essa ação + precatórios (R$ 8.338,86 em 2024) + elementos 4.6.90.91 da saúde (R$ 2.126,15 em 2025 e R$ 3.096,20 em 2026) | | | setores |

## Setores (liquidado; setor pela função da ação; script `scripts/setores.py`, resultado `saida/setores.json`)

Mapa: Educação = função 12; Saúde = 10; Administração = 03 e 04 (menos a amortização da dívida) e 99; Obras e serviços urbanos = 15 e 26 (transporte); Câmara = 01; Dívidas e encargos = ação "Amortização da dívida contratada" + precatórios + elementos 4.6.90; Festas e eventos = pagamentos de shows, bandas, palco e estrutura da Secretaria de Cultura (abaixo); Cultura = o resto da função 13 (inclui campeonatos e premiações esportivas da secretaria conjunta de Cultura, Esporte e Lazer e a Lei Aldir Blanc); Assistência social = 08; Agricultura = 20; Esporte e lazer = 27. 2024 ajustado ao Anexo 9 do Balanço, função por função. Soma dos setores = total do ano, centavo a centavo.

### 2024
- Educação 2024: R$ 40.365.602,21
- Saúde 2024: R$ 22.389.143,73
- Administração 2024: R$ 10.477.392,44
- Obras e serviços urbanos 2024: R$ 8.155.935,55
- Câmara de Vereadores 2024: R$ 2.362.234,21
- Dívidas e encargos 2024: R$ 4.977.618,92
- Festas e eventos 2024: R$ 912.059,14
- Cultura 2024: R$ 653.650,59
- Assistência social 2024: R$ 2.024.390,31
- Agricultura 2024: R$ 615.155,17
- Esporte e lazer 2024: R$ 52.255,03
### 2025
- Educação 2025: R$ 40.811.703,52
- Saúde 2025: R$ 24.350.813,15
- Administração 2025: R$ 9.187.465,95
- Obras e serviços urbanos 2025: R$ 10.524.507,94
- Câmara de Vereadores 2025: R$ 3.181.170,40
- Dívidas e encargos 2025: R$ 5.271.929,53
- Festas e eventos 2025: R$ 767.728,95
- Cultura 2025: R$ 1.453.960,53
- Assistência social 2025: R$ 1.919.707,97
- Agricultura 2025: R$ 850.747,58
- Esporte e lazer 2025: R$ 112.609,27
### 2026 (até agosto)
- Educação 2026: R$ 34.193.721,26
- Saúde 2026: R$ 20.255.834,35
- Administração 2026: R$ 7.960.550,26
- Obras e serviços urbanos 2026: R$ 8.922.565,62
- Câmara de Vereadores 2026: R$ 2.348.619,34
- Dívidas e encargos 2026: R$ 572.667,31
- Festas e eventos 2026: R$ 945.209,41
- Cultura 2026: R$ 1.832.562,53
- Assistência social 2026: R$ 1.588.246,79
- Agricultura 2026: R$ 1.666.579,01
- Esporte e lazer 2026: R$ 950,00

## Festas e eventos (regra 99)

Total por ano (script `scripts/festas056.py`, lista completa com arquivo, data, valor e histórico em `saida/festas_056_lista.md`):
- Festas e eventos 2024: R$ 912.059,14 (pagamentos de 2024 da Sec. de Cultura, unidade 3100184, com show, banda, apresentação artística, palco, sonorização, painel de LED ou festa/São João/aniversário da cidade no histórico; sem premiações de corrida e campeonato e sem a Lei Aldir Blanc)
- Festas e eventos 2025: R$ 767.728,95 (jan-mai pelo histórico; jun-dez pelo elemento 3.3.90.39.94 "serviço de banda" ou credor de produção artística, banda ou eventos; inclui R$ 373.200,00 pagos a produtoras artísticas lançados no elemento 3.3.90.39.01 "assinaturas de periódicos e anuidades" da ação de fomento à cultura). Conferência: o PCMGE015 de dez/2025 (SIGA) traz R$ 647.000,00 no elemento 3.3.90.39.94 (bandas) e R$ 408.000,00 em "assinaturas de periódicos e anuidades".
- Festas e eventos 2026 até ago: R$ 945.209,41 (jan-fev pelo histórico, fichas da Cultura; mar-ago pelo elemento 3.3.90.39.94 ou credor artístico/de eventos). R$ 244.143,15 disso são contas das festas de 2025 (réveillon, São João, shows) pagas em 2026 como despesa de exercício anterior.
- Não entraram (sem prova de festa no documento): pagamentos de 2026 a empresas de "produções e serviços" e "serviços" no elemento 3.3.90.39.01/99 sem histórico (R$ 408.500,00 e R$ 150.920,00), demonstração aérea (R$ 45.000,00). Por isso os valores de festas são "pelo menos".
- Fala: "912 mil em 2024, 768 mil em 2025 e 945 mil até agosto de 2026, 244 mil disso contas de 2025"; setores "Festas e eventos, 912 mil / 768 mil / 945 mil"; pergunta "quase 1 milhão em 2026" (R$ 945.209,41).

## Não usado no vídeo / pendências

- Esporte e lazer 2026: R$ 950,00 na função 27 (manutenção das ações de lazer); prêmios de campeonatos de futsal e futebol são pagos pela Sec. de Cultura (função 13), por isso a fala diz "os campeonatos saem da cultura".
- Decisões do TCM (pedem captcha): não consultadas; o vídeo não fala do Tribunal.
- SUS conferido só entre o PCMGE016 e o Anexo 10 (iguais); conferência no Fundo Nacional de Saúde fica pendente.
- PCMGE015 de dez/2024 tem R$ 374.233,26 de liquidado a mais que o Balanço 2024 (o Balanço fechou liquidado = pago). Vale o Balanço.
- PCMGE016 de dez/2024 tem R$ 2.223.570,24 a menos que o Balanço 2024 e o de dez/2025 R$ 162.558,66 a menos que o Balanço 2025. Vale o Balanço.

Narração: Google Chirp 3 HD Algenib.
