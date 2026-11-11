# Fontes · 087. orçamento de Entre Rios

Todos os documentos foram baixados do e-TCM (Consulta Pública do Tribunal de Contas dos Municípios da Bahia, e.tcm.ba.gov.br) em 11/11/2026 e estão guardados em `~/Documents/RECEITAS-DESPESAS-ENTRE-RIOS/documentos_tcm/` (PDF e texto extraído). Município 123 ENTRE RIOS · Prefeitura UJ 728 · Câmara UJ 158 (não há autarquia nem fundo com UJ própria no e-TCM). Último mês entregue pela Prefeitura: 06/2026 (enviado em 05/11/2026; 07 a 10/2026 "Pendente"). Nome do município conferido no cabeçalho de cada PDF usado.

Regra: "arrecadou" = total declarado ao TCM (Balanço Orçamentário 2024 e 2025; PCMGE016 de jun/2026). "Gastou" = despesa LIQUIDADA. Valores ditos arredondados para 100 mil; abaixo, o valor exato. Conferência 1 (depois do roteiro): 11/11/2026, todos os números do roteiro batidos com o texto dos PDFs (scripts/pg.py). Conferência 2 (antes do vídeo final): 11/11/2026, setores de 2025 contra o Anexo 9 do Balanço (2025_PCAGO007.pdf): Saúde 47.632.495,04, Assistência Social 3.733.579,69, Cultura 6.120.793,45 (= Festas 5.802.700,00 + Cultura 318.093,45 da função 13; o setor Cultura soma ainda 376.547,89 da administração da secretaria) e Desporto e Lazer 0,00 iguais; totais do ano iguais ao Balanço e ao consolidado.

## Abertura e receita

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Receita 2024: R$ 196.323.607,49 | 2024_PCAGO015.pdf (Balanço Orçamentário 2024) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "196 milhões e 300", mapa, chip |
| (conferência) R$ 196.323.607,49 | 2024-12_PCMGE016.pdf | "TOTAL" | Arrecadada até mês + Anulada até mês | folha da receita 2024 (igual ao Balanço) |
| Receita 2025: R$ 215.281.676,20 | 2025_PCAGO015.pdf (Balanço Orçamentário 2025) | p.1, "SUBTOTAL DAS RECEITAS (III)" | Receitas realizadas | fala "215 milhões e 300", mapa, chip |
| (conferência) R$ 215.281.676,20 | 2025-12_PCMGE016.pdf e 2025_PCAGO008.pdf (Anexo 10) | "TOTAL" / total do Anexo 10 | Arrecadada até mês + Anulada | folha da receita 2025 (igual ao Balanço) |
| Receita 2026 até jun: R$ 117.772.182,30 | 2026-06_PCMGE016.pdf | p.6, "TOTAL" | Arrecadada até mês 118.197.184,19 + Anulada até mês -425.001,89 | fala "117 milhões e 800", mapa, chip |
| FPM 2025: R$ 52.914.200,63 | 2025-12_PCMGE016.pdf | p.2, 1.7.1.1.51.0.0 Cota-Parte do FPM | Arrecadada até mês (já sem os R$ 11.462.197,09 do Fundeb, coluna Deduções até mês) | fala "52 milhões e 900", mapa |
| Fundeb 2025: R$ 35.770.668,67 | 2025-12_PCMGE016.pdf | p.4, 1.7.5.0.00.0.0 Transferências de Outras Instituições Públicas (Fundeb) | Arrecadada até mês | fala "35 milhões e 800", mapa |
| Complementação da União ao Fundeb 2025: R$ 22.613.072,15 | 2025-12_PCMGE016.pdf | p.3, 1.7.1.5.00.0.0 | Arrecadada até mês | fala "22 milhões e 600", mapa |
| SUS 2025: R$ 28.812.631,40 = União 1.7.1.3 (28.469.784,57 - 3.714.588,00 anulados) + Estado 1.7.2.3 (342.846,83) + capital 2.4.1.1 (3.714.588,00) | 2025-12_PCMGE016.pdf | p.2 (1.7.1.3.00), p.4 (1.7.2.3.00), p.5 (2.4.1.1.00) | Arrecadada até mês + Anulada até mês | fala "28 milhões e 800", mapa |
| Royalties do petróleo 2025: R$ 12.247.494,76 | 2025-12_PCMGE016.pdf | p.2, 1.7.1.2.52.0.0 Cota-parte da Compensação Financeira pela Produção de Petróleo | Arrecadada até mês | fala "12 milhões e 200", mapa (a folha soma ainda 24.701,40 da 1.7.1.2.51: R$ 12.272.196,16 "royalties do petróleo e minérios") |
| (contexto) Royalties 2024: R$ 13.086.444,05; 2026 até jun: R$ 6.581.019,25 | 2024-12 e 2026-06_PCMGE016.pdf | 1.7.1.2 + 1.7.2.2 | Arrecadada até mês | só nas folhas de receita |

Folhas de receita (item a item, soma = total do ano, diferença 0,00): `saida/receita_2024.json`, `receita_2025.json`, `receita_2026.json` (script `scripts/receita.py`; código de cada linha no campo "codigos").

## Despesa por ano (liquidado)

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Gastou 2024: R$ 203.479.230,72 | 2024_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas | fala "203 milhões e 500", chip |
| = Prefeitura R$ 197.907.697,55 + Câmara R$ 5.571.533,17 | 2024-12_PCMGE015.pdf p.92 "Total do Poder" e 2024-12_CAMARA_PCMGE015.pdf p.4 "Total do Poder" | | Liquidações até mês | bate centavo a centavo com o Balanço |
| Gastou a mais em 2024: R$ 7.155.623,23 (conta própria: 203.479.230,72 - 196.323.607,49) | Balanço 2024 | | | fala "7 milhões e 200 a mais", torre vermelha |
| Gastou 2025: R$ 221.692.281,27 | 2025_PCAGO015.pdf | p.2, "SUBTOTAL DAS DESPESAS (XI)" | Despesas liquidadas | fala "221 milhões e 700" |
| = Prefeitura R$ 214.389.211,38 + Câmara R$ 7.303.069,89 | 2025-12_PCMGE015.pdf p.104 "Total do Poder" e 2025-12_CAMARA_PCMGE015.pdf p.4 | | Liquidações até mês | bate com o Balanço e com o consolidado 2025-12_PCMGE065.pdf |
| Gastou a mais em 2025: R$ 6.410.605,07 (conta própria: 221.692.281,27 - 215.281.676,20) | Balanço 2025 | | | fala "6 milhões e 400 a mais", torre vermelha |
| Gastou 2026 até jun: R$ 112.799.084,53 = Prefeitura R$ 108.886.900,79 + Câmara R$ 3.912.183,74 | 2026-06_PCMGE015.pdf p.125 "Total do Poder" (a Câmara aparece zerada nesse PDF) e 2026-06_CAMARA_PCMGE015.pdf p.4; igual ao consolidado 2026-06_PCMGE065_2.pdf (liquidada até o mês) | | Liquidada até mês | fala "112 milhões e 800" |
| Sobraram até jun/2026: R$ 4.973.097,77 (conta própria: 117.772.182,30 - 112.799.084,53) | | | | só na tela (chip e torre verde) |

## Setores (liquidado; setor pela secretaria de Obras/Transporte, Agricultura/Meio Ambiente, Cultura e Esporte, e pela função no resto; script `scripts/setores.py`, resultado `saida/setores.json`; soma dos 11 setores = total do ano, diferença 0,00)

### 2024

| Setor | Valor exato | Ações (código · página do PCMGE015 · liquidado até o mês) |
|---|---|---|
| Educação 2024: R$ 72.251.839,00 | 2024-12_PCMGE015.pdf | 11.1101.12.361.4.2.2041 FUNCIONAMENTO DA REDE DE EDUCAÇÃO BÁSI p.67 58.710.686,05; 11.1101.12.368.4.2.2044 GESTÃO DO SERVIÇO DE TRANSPORTE ESCOLA p.72 3.419.695,00; 11.1101.12.365.4.2.2039 FUNCIONAMENTO DA REDE DE ENSINO INFANT p.69 3.090.857,10; 11.1101.12.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.61 2.816.666,42; e mais 9 ações |
| Saúde 2024: R$ 49.442.941,75 | 2024-12_PCMGE015.pdf | 12.1201.10.302.3.2.2031 FUNCIONAMENTO DOS SERVIÇOS DE ATENÇÃO p.82 17.844.358,79; 12.1201.10.301.3.2.2026 FUNCIONAMENTO DOS SERVIÇOS DE ATENÇÃO p.79 12.439.466,65; 12.1201.10.304.3.2.2028 FUNCIONAMENTO DA VIGILÂNCIA SANITÁRIA p.87 7.168.848,67; 12.1201.10.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.74 4.034.230,50; e mais 11 ações |
| Obras e serviços urbanos 2024: R$ 40.535.429,91 | 2024-12_PCMGE015.pdf | 5.501.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.18 21.095.879,22; 5.501.17.512.8.2.2083 MANUTENÇÃO DOS SERVIÇOS DE LIMPEZA PÚB p.25 5.382.592,72; 5.501.15.452.8.2.2084 MANUTENÇÃO E CONSERVAÇÃO DE VIAS PÚBLI p.21 4.262.687,85; 5.501.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.16 2.996.822,04; e mais 6 ações |
| Administração 2024: R$ 18.294.343,51 | 2024-12_PCMGE015.pdf | 3.301.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.7 5.837.832,76; 3.301.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.9 5.484.695,07; 2.201.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.2 3.004.008,23; 4.401.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.12 1.232.830,80; e mais 9 ações |
| Dívidas e encargos 2024: R$ 7.705.529,99 | 2024-12_PCMGE015.pdf | 4.401.28.843.99.3.3 SERVIÇO DA DÍVIDA INTERNA (JUROS, ENCA p.14 4.002.280,09; 4.401.28.846.99.3.5 OBRIGAÇÕES TRIBUTÁRIAS E CONTRIBUTIVAS p.15 2.099.063,38; 4.401.28.843.2.3.2 SENTENÇAS JUDICIAIS TRANSITADAS EM JUL p.13 1.086.646,80; 4.401.28.845.99.3.4 RESTITUIÇÕES DE RECURSOS RECEBIDOS p.14 317.920,27; e mais 3 ações |
| Assistência social 2024: R$ 3.746.328,47 | 2024-12_PCMGE015.pdf | 9.902.8.244.5.2.2049 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.50 918.070,58; 9.902.8.244.5.2.2050 BENEFÍCIOS EVENTUAIS DA ASSISTÊNCIA SO p.50 679.277,17; 9.901.8.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.42 556.649,47; 9.902.8.244.5.2.2097 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.54 473.884,70; e mais 8 ações |
| Câmara de Vereadores 2024: R$ 5.571.533,17 | 2024-12_CAMARA_PCMGE015.pdf | 1.101.1.31.1.2.2001 GESTÃO DAS AÇÕES DA CÂMARA LEGISLATIVA p.3 5.565.402,45; 1.101.1.31.1.1.1001 AMPLIACAO E REFORMA DO PREDIO DO LEGIS p.1 6.130,72 |
| Festas e eventos 2024: R$ 2.508.150,00 | 2024-12_PCMGE015.pdf | 8.801.13.392.6.2.2066 REALIZAÇÃO DE EVENTOS E FESTAS CULTURA p.37 2.508.150,00 |
| Cultura 2024: R$ 812.843,19 | 2024-12_PCMGE015.pdf | 8.801.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.35 749.945,69; 8.801.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.35 38.897,50; 8.801.13.845.6.2.2068 AÇÕES INTEGRADAS E ARTICULADAS EM PARC p.38 24.000,00 |
| Agricultura e meio ambiente 2024: R$ 2.400.377,97 | 2024-12_PCMGE015.pdf | 7.701.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.31 1.199.695,48; 7.701.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.30 719.220,04; 10.1001.18.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.57 431.101,42; 7.701.20.544.7.2.2079 MANUTENÇÃO DOS POÇOS ARTESIANOS p.32 50.228,25; e mais 1 ações |
| Esporte 2024: R$ 209.913,76 | 2024-12_PCMGE015.pdf | 8.801.27.812.6.2.2070 MANUTENÇÃO E CONSERVAÇÃO DE QUADRAS PO p.39 209.913,76 |

### 2025

| Setor | Valor exato | Ações (código · página do PCMGE015 · liquidado até o mês) |
|---|---|---|
| Educação 2025: R$ 73.313.947,79 | 2025-12_PCMGE015.pdf | 11.1101.12.361.4.2.2041 FUNCIONAMENTO DA REDE DE EDUCAÇÃO BÁSI p.71 43.876.892,27; 11.1101.12.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.65 10.409.116,65; 11.1101.12.365.4.2.2039 FUNCIONAMENTO DA REDE DE ENSINO INFANT p.73 8.850.063,36; 11.1101.12.782.4.2.2044 GESTÃO DO SERVIÇO DE TRANSPORTE ESCOLA p.77 5.017.065,66; e mais 9 ações |
| Saúde 2025: R$ 47.632.495,04 | 2025-12_PCMGE015.pdf | 12.1201.10.302.3.2.2031 FUNCIONAMENTO DOS SERVIÇOS DE ATENÇÃO p.90 16.120.440,63; 12.1201.10.301.3.2.2026 FUNCIONAMENTO DOS SERVIÇOS DE ATENÇÃO p.86 10.138.758,34; 12.1201.10.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.81 7.040.470,06; 12.1201.10.304.3.2.2028 FUNCIONAMENTO DA VIGILÂNCIA SANITÁRIA p.98 6.458.634,22; e mais 10 ações |
| Obras e serviços urbanos 2025: R$ 54.228.333,85 | 2025-12_PCMGE015.pdf | 5.501.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.19 29.095.408,22; 5.501.17.512.8.2.2083 MANUTENÇÃO DOS SERVIÇOS DE LIMPEZA PÚB p.26 10.590.184,30; 5.501.15.452.8.2.2087 MANUTENÇÃO E CONSERVAÇÃO DE PRAÇAS, PA p.24 5.852.046,38; 5.501.15.452.8.2.2085 MANUTENÇÃO DA REDE MUNICIPAL DE ILUMIN p.23 5.513.233,90; e mais 7 ações |
| Administração 2025: R$ 16.508.582,63 | 2025-12_PCMGE015.pdf | 3.301.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.10 6.206.028,45; 3.301.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.8 3.253.074,23; 4.401.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.13 2.054.246,04; 2.201.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.2 1.341.883,99; e mais 11 ações |
| Dívidas e encargos 2025: R$ 10.331.127,57 | 2025-12_PCMGE015.pdf | 4.401.28.843.99.3.3 SERVIÇO DA DÍVIDA INTERNA (JUROS, ENCA p.15 4.544.295,38; 4.401.28.843.99.3.2 SENTENÇAS JUDICIAIS TRANSITADAS EM JUL p.15 4.342.478,17; 4.401.28.846.99.3.5 OBRIGAÇÕES TRIBUTÁRIAS E CONTRIBUTIVAS p.16 1.437.294,02; 4.401.28.846.99.3.1 SENTENÇAS JUDICIAIS TRANSITADAS EM JUL p.16 7.060,00 |
| Assistência social 2025: R$ 3.733.579,69 | 2025-12_PCMGE015.pdf | 9.902.8.245.5.2.2049 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.56 1.842.324,69; 9.902.8.244.5.2.2050 BENEFÍCIOS EVENTUAIS DA ASSISTÊNCIA SO p.52 800.533,04; 9.901.8.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.46 371.383,50; 9.902.8.245.5.2.2097 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.57 258.830,60; e mais 8 ações |
| Câmara de Vereadores 2025: R$ 7.303.069,89 | 2025-12_CAMARA_PCMGE015.pdf | 1.101.1.31.1.2.2001 GESTÃO DAS AÇÕES DA CÂMARA LEGISLATIVA p.3 7.297.133,48; 1.101.1.31.1.1.1001 AMPLIACAO E REFORMA DO PREDIO DO LEGIS p.1 5.936,41 |
| Festas e eventos 2025: R$ 5.802.700,00 | 2025-12_PCMGE015.pdf | 8.801.13.392.6.2.2066 REALIZAÇÃO DE EVENTOS E FESTAS CULTURA p.40 5.802.700,00 |
| Cultura 2025: R$ 694.641,34 | 2025-12_PCMGE015.pdf | 8.801.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.37 306.501,89; 8.801.13.392.6.2.2131 FOMENTO ÀS ATIVIDADES ARTÍSTICAS E CUL p.41 306.093,45; 8.801.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.38 70.046,00; 8.801.13.845.6.2.2068 AÇÕES INTEGRADAS E ARTICULADAS EM PARC p.41 12.000,00 |
| Agricultura e meio ambiente 2025: R$ 2.143.803,47 | 2025-12_PCMGE015.pdf | 7.701.4.122.2.2.2011 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.33 1.504.096,91; 7.701.4.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.32 450.381,25; 10.1001.18.122.2.2.2010 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.61 169.068,89; 10.1001.18.542.9.2.2091 MONITORAMENTO E FISCALIZAÇÃO EM ÁREAS p.63 20.256,42 |
| Esporte 2025: R$ 0,00 | 2025-12_PCMGE015.pdf | nenhuma ação com liquidado |

### 2026 até junho

| Setor | Valor exato | Ações (código · página do PCMGE015 · liquidado até o mês) |
|---|---|---|
| Educação 2026: R$ 35.311.100,72 | 2026-06_PCMGE015.pdf | 6.601.12.361.3.2.2030 FUNCIONAMENTO DA REDE DE EDUCAÇÃO BÁSI p.29 21.262.515,81; 6.601.12.365.3.2.2028 FUNCIONAMENTO DA REDE DE EDUCAÇÃO BÁSI p.32 5.446.837,66; 6.601.12.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.22 3.144.594,03; 6.601.12.782.3.2.2037 GESTÃO DO SERVIÇO DE TRANSPORTE ESCOLA p.37 1.517.091,93; e mais 7 ações |
| Saúde 2026: R$ 22.291.797,04 | 2026-06_PCMGE015.pdf | 7.701.10.301.4.2.2044 FUNCIONAMENTO DOS SERVIÇOS DA REDE DE p.46 4.222.347,00; 7.701.10.302.4.2.2060 CONTRATUALIZAÇÃO DOS SERVIÇOS DE ATENÇ p.52 4.005.021,24; 7.701.10.302.4.2.2045 FUNCIONAMENTO DOS SERVIÇOS ATENÇÃO ESP p.49 3.895.148,45; 7.701.10.304.4.2.2049 FUNCIONAMENTO DOS SERVIÇOS DA VIGILÂNC p.56 3.855.612,90; e mais 9 ações |
| Obras e serviços urbanos 2026: R$ 29.685.930,86 | 2026-06_PCMGE015.pdf | 16.1601.4.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.110 12.543.509,87; 16.1601.17.512.9.2.2128 MANUTENÇÃO DOS SERVIÇOS DE LIMPEZA PÚB p.119 8.836.524,55; 16.1601.15.451.9.2.2124 CONSERVAÇÃO DE PRAÇAS, PARQUES E JARDI p.115 2.932.455,44; 16.1601.4.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.108 1.967.873,46; e mais 5 ações |
| Administração 2026: R$ 10.833.874,80 | 2026-06_PCMGE015.pdf | 3.301.4.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.11 4.188.583,52; 3.301.4.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.9 2.409.563,45; 4.401.14.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.17 1.504.833,46; 2.201.4.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.2 882.975,83; e mais 12 ações |
| Dívidas e encargos 2026: R$ 4.154.390,09 | 2026-06_PCMGE015.pdf | 4.401.28.843.99.3.6 SERVIÇO DA DÍVIDA INTERNA (JUROS E AMO p.18 2.632.250,04; 4.401.28.843.99.3.4 SENTENÇAS JUDICIAIS TRANSITADAS EM JUL p.18 600.577,42; 4.401.28.846.99.3.8 OBRIGAÇÕES TRIBUTÁRIAS E CONTRIBUTIVAS p.19 503.238,33; 8.802.28.845.99.3.7 RESTITUIÇÕES DE RECURSOS RECEBIDOS p.76 306.118,28; e mais 5 ações |
| Assistência social 2026: R$ 1.891.926,25 | 2026-06_PCMGE015.pdf | 8.802.8.245.5.2.2072 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.74 926.679,60; 8.802.8.245.5.2.2070 FUNCIONAMENTO DOS SERVIÇOS DE PROTEÇÃO p.72 372.257,43; 8.802.8.244.5.2.2073 BENEFÍCIOS EVENTUAIS DA ASSISTÊNCIA SO p.68 368.410,19; 8.802.8.246.5.2.2076 GESTÃO DESCENTRALIZADA DO PROGRAMA BOL p.75 131.919,38; e mais 2 ações |
| Câmara de Vereadores 2026: R$ 3.912.183,74 | 2026-06_CAMARA_PCMGE015.pdf | 1.101.1.31.1.2.2001 GESTÃO DAS AÇÕES DA CÂMARA LEGISLATIVA p.3 3.912.183,74 |
| Festas e eventos 2026: R$ 3.392.718,10 | 2026-06_PCMGE015.pdf | 11.1101.13.392.8.2.2095 REALIZAÇÃO DE EVENTOS CULTURAIS E COME p.87 3.392.718,10 |
| Cultura 2026: R$ 270.083,10 | 2026-06_PCMGE015.pdf | 11.1101.4.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.83 262.083,10; 11.1101.13.845.8.3.13 AÇÕES INTEGRADAS E ARTICULADAS EM PARC p.88 8.000,00 |
| Agricultura e meio ambiente 2026: R$ 902.407,83 | 2026-06_PCMGE015.pdf | 15.1501.4.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.103 410.327,92; 15.1501.4.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.104 356.230,51; 14.1401.18.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.101 107.731,49; 14.1401.18.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.102 15.917,91; e mais 1 ações |
| Esporte 2026: R$ 152.672,00 | 2026-06_PCMGE015.pdf | 12.1201.27.122.2.2.2003 MANUTENÇÃO DOS SERVIÇOS TÉCNICOS E APO p.89 101.372,00; 12.1201.27.122.2.2.2002 ADMINISTRAÇÃO DE PESSOAL, ENCARGOS E B p.89 51.300,00 |

- Esporte 2025 = R$ 0,00: as 6 ações de esporte do orçamento (8.801.27.812..., 2025-12_PCMGE015.pdf p.42 e 43) previam R$ 172.000,00 na dotação inicial (120.000 + 10.000 + 5.000 + 8.000 + 14.000 + 15.000) e tiveram tudo anulado (coluna Anulações = Fixada; Total Fixada 0,00; liquidado 0,00). Anexo 9 de 2025 (2025_PCAGO007.pdf p.4), coluna "Desporto e Lazer": 0,00. Fala "Esporte, nada: os 172 mil previstos foram cancelados".
- Bandas e palco FORA da ação de festas (ficam nos seus setores, só na folha de Festas como observação): 2024 R$ 818.778,00 (3.3.90.39.19 "Locação, confecção e montagem de cenários" na ação 3.301.4.122.2.2.2011 da Administração); 2025 R$ 533.859,00 (39.95 Gabinete 191.000,00; 39.95 Administração 178.800,00; 39.94 bandas na Planejamento e Finanças 44.434,00; 39.95 Obras 119.625,00).

## Achados

| Valor exato | Documento | Página / linha | Coluna | Onde aparece |
|---|---|---|---|---|
| Ação de Obras "Manutenção dos serviços técnicos e apoio administrativo" 2025: R$ 29.095.408,22 (previa R$ 16.956.000,00) | 2025-12_PCMGE015.pdf | p.18 e 19, 5.501.4.122.2.2.2011, "Total do Projeto/Atividade" | Liquidações até mês; Fixada (inicial) | fala "29 milhões e 100", plaquinha |
| Combustíveis nessa ação 2025: R$ 11.824.696,83 (fonte 1500: 8.543.592,77 + fonte 1704: 3.281.104,06) | 2025-12_PCMGE015.pdf | p.18, 3.3.90.30.01 Combustíveis e lubrificantes automotivos | Liquidações até mês | fala "11 milhões e 800 de combustível" |
| Locação de máquinas nessa ação 2025: R$ 8.245.789,26 (7.579.920,76 + 665.868,50) | 2025-12_PCMGE015.pdf | p.18, 3.3.90.39.12 Locação de máquinas e equipamentos | Liquidações até mês | fala "8 milhões e 200 de aluguel de máquinas" |
| Câmara 2024: recebeu R$ 6.424.748,26 | 2024-12_CAMARA_PCMGE018.pdf (razão) | p.6, 4.5.1.1.2.02.00 REPASSE RECEBIDO | saldo do ano | fala "recebeu 6 milhões e 400" |
| Câmara 2024: devolveu R$ 853.455,57 (853.000,00 em dez/2024 + 455,57) | 2024-12_CAMARA_PCMGE018.pdf p.6, 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS; comprovantes 2024-12_PCMGE008.pdf (9.000,00 e 844.000,00, "devolução duodécimo") | | | fala "devolveu 853 mil" |
| Câmara 2024: gastou R$ 5.571.533,17 | 2024-12_CAMARA_PCMGE015.pdf p.4 "Total do Poder" | | Liquidações até mês | fala "gastou 5 milhões e 600" |
| Câmara 2025: recebeu R$ 7.303.069,89 e gastou R$ 7.303.069,89 | 2025-12_CAMARA_PCMGE018.pdf p.6 (4.5.1.1.2.02.00 REPASSE RECEBIDO) e 2025-12_CAMARA_PCMGE015.pdf p.4 "Total do Poder" (liquidado) | | | fala "recebeu 7 milhões e 300 e gastou os mesmos 7 milhões e 300" |
| Câmara 2025: devolveu R$ 215,09 | 2025-12_CAMARA_PCMGE018.pdf p.6, 3.5.1.1.2.09.00 | | | fala "Devolveu 215 reais" |
| (só tela/folha) Câmara 2026 até jun: recebeu R$ 3.870.349,17, gastou R$ 3.912.183,74 | 2026-06_CAMARA_PCMGE018.pdf p.5 e 2026-06_CAMARA_PCMGE015.pdf p.4 | | | folha da Câmara 2026 |
| Ação "Realização de eventos e festas culturais" 2025: previa R$ 2.100.000,00, dotação final R$ 5.802.700,00, liquidou R$ 5.802.700,00 | 2025-12_PCMGE015.pdf | p.40, 8.801.13.392.6.2.2066 | Fixada (inicial), Total Fixada, Liquidações até mês | fala "previa 2 milhões e 100 em 2025 e gastou 5 milhões e 800" |
| Bandas nessa ação 2025: R$ 5.356.500,00 (3.3.90.39.94: fonte 1500 5.196.500,00 + 1501 20.000,00 + 1720 140.000,00) | 2025-12_PCMGE015.pdf | p.40, 3.3.90.39.94 Serviços de banda ou grupo musical | Liquidações até mês | fala "Só com bandas, 5 milhões e 400" |
| Palco nessa ação 2025: R$ 446.190,00 | 2025-12_PCMGE015.pdf | p.40, 3.3.90.39.95 | Liquidações até mês | folha |
| (folha) 2024: previa R$ 2.803.248,00, liquidou R$ 2.508.150,00 (bandas 1.080.000,00; palco 1.281.600,00; exercícios anteriores 146.550,00) | 2024-12_PCMGE015.pdf | p.37, 8.801.13.392.6.2.2066 | | folha de Festas 2024 |
| (folha) 2026 até jun: previa R$ 5.784.022,00, liquidou R$ 3.392.718,10 (bandas 2.019.600,00; palco 296.644,97; despesas de exercícios anteriores 1.076.420,81) | 2026-06_PCMGE015.pdf | p.87, 11.1101.13.392.8.2.2095 | | folha de Festas 2026 |
| Pergunta final: assistência social 2025 R$ 3.733.579,69 x festas 2025 R$ 5.802.700,00 | 2025-12_PCMGE015.pdf (função 08, igual ao Anexo 9 2025_PCAGO007.pdf p.1, coluna Assistência Social 3.733.579,69) | | Liquidado | fala final |

Notícias: não usadas (o vídeo não fala de obra específica; regra 25: fonte única = TCM).
