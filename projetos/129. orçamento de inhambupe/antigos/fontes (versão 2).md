# Fontes do 129. orçamento de inhambupe (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 16:27 e 16:47, no navegador do app com a trava _navegador.lock, recebedor 127.0.0.1:8778, pasta INHAMBUPE, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-INHAMBUPE/documentos_tcm/` (PDFs com o texto extraído ao lado em .txt, + a consulta de processos do TCM em `TCM_DECISOES_AUDITORIA_2026-11-10.txt`). Município conferido dentro de cada PDF: todos trazem "INHAMBUPE" no cabeçalho ou no corpo (os PCMGE008/007 são comprovantes escaneados do Banco do Brasil e da Caixa, com "PREF MUN DE INHAMBUPE" na imagem). Competência de cada PDF mensal conferida na linha "Competência:" (Prefeitura e Câmara: 12/2024, 12/2025, 08/2026; PCMGE015 e 016 de 08/2024 e 08/2025) ou no título ("DEZEMBRO/2025", "AGOSTO/2026" nas relações de pagamento).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 165 (INHAMBUPE) · Prefeitura UJ 769 ("Prefeitura Municipal de INHAMBUPE") · Câmara UJ 198 ("Camara Municipal de INHAMBUPE") · "Sociedade de Assistência a Comunidade INHAMBUPE" (UJ 1079) sem prestação mensal em 2026. Fundos de Saúde, Educação e Assistência dentro da Prefeitura.
Último mês: a Prefeitura entregou até 09/2026 (03/11/2026); a Câmara só até 08/2026 (09/2026 "Pendente"). Por isso 2026 vai até AGOSTO em tudo (Prefeitura e Câmara no mesmo mês, como no molde 093).
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário em 2024 e 2025; em 2026, PCMGE016 de ago/2026, linha "Totais": arrecadada até o mês menos anulada). A "Arrecadada" do PCMGE016 já vem SEM a parte do Fundeb (FPM 2025 51.333.068,77 com 12.539.075,34 de dedução mostrada à parte, 2025-12_PCMGE016.pdf; conferido: 2025-12_PCMGE016 TOTAL 189.708.028,25 − 45.031,54 anulada = 189.662.996,71 = Balanço).
Método do auditor no levantamento: receita só da unidade Prefeitura, PCMGE016 do último mês como acumulado, FPM e ICMS líquidos, Fundeb separado (detalhe em `~/Documents/RECEITAS-DESPESAS-INHAMBUPE/saida129/receita_AAAA.json`, que fecha com o total); despesa PCMGE015 de dotação a pago; funil 016 → 056 → 049 conferido para os temas (PCMGE056 de 12/2024, 12/2025 e 08/2026 baixados).
Conferido 2 vezes: 1ª no levantamento (setores.py fecha centavo a centavo com o Balanço e com o Total do Poder + Total da Unidade); 2ª com cada valor exato procurado no texto do PDF citado (scripts129/pag.py, que devolve página e linha). Na 2ª conferência: (a) os códigos de elemento mudaram de 2024 (plano antigo: 30.02 combustível, 39.02 locação de veículos) para 2025 (30.01 e 30.03 combustíveis, 39.12 e 39.14 locação); a soma dos temas foi feita pelo NOME do elemento; (b) o número de processos no TCM foi corrigido de 12 para 14 (contei também os dois abertos em 2025/2026 sobre fatos de 2022); a voz foi refeita nesse trecho.
Somas, diferenças e arredondamentos estão marcados como conta própria.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 190 milhões em 2024 / 190 milhões e 100 | 190.112.164,26 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE016.pdf p.10, TOTAL 190.112.645,05 − 480,79 anulada) |
| 27 milhões foram do precatório do Fundef | 26.981.474,04 | 2024-12_PCMGE016.pdf | p.5 · 1.7.1.9.56.0.0 Transferências Decorrentes de Decisão Judicial · Arrecadada até Mês |
| que só pode ir para a educação | (regra) | Lei 14.113/2020, art. 47-A (incluído pela Lei 14.325/2022) e STF, ADPF 528 (https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14325.htm, consultado em 10/11/2026) | fala |
| gastou 153 milhões e 700 em 2024 | 153.683.730,73 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhado igual) |
| sobraram 36 milhões e 400 | 36.428.433,53 | 2024_PCAGO015.pdf | p.2 · SUPERÁVIT (XIV) (= 190.112.164,26 − 153.683.730,73) |
| arrecadou 189 milhões e 700 em 2025 | 189.662.996,71 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 191 milhões e 700 em 2025 | 191.651.356,06 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (empenhado 191.827.028,19; o Balanço mostra DÉFICIT (VI) 2.164.031,48 pelo empenhado, p.1) |
| gastou 2 milhões a mais do que arrecadou | 1.988.359,35 | conta própria | 191.651.356,06 − 189.662.996,71 |
| 158 milhões até agosto de 2026 / arrecadou 158 milhões e 100 | 158.148.876,53 | 2026-08_PCMGE016.pdf | p.7 · "Totais" · Arrecadada até Mês 158.847.992,14 com Anulada até Mês −699.115,61 |
| gastou 136 milhões e 800 até agosto | 136.769.075,39 | 2026-08_PCMGE015.pdf + 2026-08_CAMARA_PCMGE015.pdf | p.123 Total do Poder, Liquidações até Mês (132.229.130,27) + p.3 Total da Unidade (4.539.945,12), conta própria. O razão consolidado 2026-08_PCMGE064.pdf p.23 dá 136.764.862,51 (liquidado a pagar 12.767.744,27 + pago 123.997.118,24), 4.212,88 a menos: anotado como pendência |
| sobraram 21 milhões e 400 | 21.379.801,14 | conta própria | 158.148.876,53 − 136.769.075,39 |
| já comprometeu 189 milhões e 500 | 189.543.993,23 | 2026-08_PCMGE064.pdf (razão consolidado) | p.23 · 6.2.2.1.3.00.00 CRÉDITO UTILIZADO · saldo (= Prefeitura 183.080.970,30 empenhado, 2026-08_PCMGE015.pdf p.123, + Câmara 6.463.022,93, 2026-08_CAMARA_PCMGE015.pdf p.3) |

## Setores (soma = total do ano, centavo a centavo; somas das ações por função: conta própria)
Leitor: scripts129/acoes015.py (PCMGE015 SIGA, ação por ação; a Câmara vem zerada no da Prefeitura) + PCMGE015 da Câmara. 2024: 148.402.689,41 (2024-12_PCMGE015.pdf p.117, Total do Poder) + 5.281.041,32 (2024-12_CAMARA_PCMGE015.pdf p.2, Total da Unidade) = 153.683.730,73 = Balanço. 2025: 185.583.184,34 (2025-12_PCMGE015.pdf p.149) + 6.068.171,72 (2025-12_CAMARA_PCMGE015.pdf p.3) = 191.651.356,06 = Balanço.
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 17 + 26 · Administração 04 + 02 (Procuradoria, 2026) + 23 (feiras, 2026) · Dívidas 28 · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 + 18 · Esporte 27. Função 06 (segurança) sem gasto nos três anos.
Ditos: Educação 72 e 800 · 94 e 800 · 64 e 100 | Saúde 31 milhões · 36 milhões · 25 e 900 | Obras 14 e 800 · 20 e 700 · 18 e 900 | Administração 11 e 800 · 11 milhões · 9 milhões | Dívidas 8 milhões · 11 e 100 · 2 e 900 | Assistência 5 e 600 · 5 e 200 · 4 e 200 | Câmara 5 e 300 · 6 e 100 · 4 e 500 | Cultura e festas 2 e 500 · 4 e 900 · 4 e 800 | Agricultura e meio ambiente 1 milhão · 1 e 300 · 1 e 300 | Esporte 864 mil · 590 mil · 1 e 300.

| Setor | 2024 liquidado | 2025 liquidado | 2026 até agosto |
|---|---|---|---|
| Educação | 72.755.553,00 (`2024-12_PCMGE015.pdf` p.53 a 74, função 12, 12 ações) | 94.766.953,29 (`2025-12_PCMGE015.pdf` p.74 a 98, função 12, 12 ações) | 64.106.520,25 (`2026-08_PCMGE015.pdf` p.51 a 71, função 12, 16 ações) |
| Saúde | 31.006.131,39 (`2024-12_PCMGE015.pdf` p.21 a 51, função 10, 21 ações) | 36.046.331,79 (`2025-12_PCMGE015.pdf` p.33 a 73, função 10, 21 ações) | 25.868.624,50 (`2026-08_PCMGE015.pdf` p.17 a 49, função 10, 17 ações) |
| Obras e serviços urbanos | 14.803.732,16 (`2024-12_PCMGE015.pdf` p.75 a 85, função 15, 8 ações) | 20.656.521,57 (`2025-12_PCMGE015.pdf` p.99 a 110, função 15, 9 ações) | 18.907.986,56 (`2026-08_PCMGE015.pdf` p.73 a 121, função 15, 17, 26, 13 ações) |
| Administração | 11.840.008,26 (`2024-12_PCMGE015.pdf` p.3 a 18, função 04, 8 ações) | 10.974.149,66 (`2025-12_PCMGE015.pdf` p.3 a 29, função 04, 8 ações) | 8.970.513,91 (`2026-08_PCMGE015.pdf` p.3 a 83, função 02, 04, 23, 7 ações) |
| Dívidas | 7.991.986,46 (`2024-12_PCMGE015.pdf` p.20, função 28, 1 ações) | 11.140.185,80 (`2025-12_PCMGE015.pdf` p.31 a 32, função 28, 1 ações) | 2.887.896,79 (`2026-08_PCMGE015.pdf` p.121 a 122, função 28, 2 ações) |
| Assistência social | 5.620.933,08 (`2024-12_PCMGE015.pdf` p.86 a 106, função 08, 14 ações) | 5.223.937,42 (`2025-12_PCMGE015.pdf` p.111 a 136, função 08, 14 ações) | 4.151.961,56 (`2026-08_PCMGE015.pdf` p.86 a 107, função 08, 12 ações) |
| Câmara de Vereadores | 5.281.041,32 (`2024-12_CAMARA_PCMGE015.pdf` p.1 a 2, função 01, 2 ações) | 6.068.171,72 (`2025-12_CAMARA_PCMGE015.pdf` p.1 a 3, função 01, 2 ações) | 4.539.945,12 (`2026-08_CAMARA_PCMGE015.pdf` p.1 a 3, função 01, 2 ações) |
| Cultura e festas | 2.475.276,53 (`2024-12_PCMGE015.pdf` p.11 a 13, função 13, 3 ações) | 4.910.459,16 (`2025-12_PCMGE015.pdf` p.16 a 21, função 13, 4 ações) | 4.751.393,60 (`2026-08_PCMGE015.pdf` p.117 a 120, função 13, 3 ações) |
| Agricultura e meio ambiente | 1.044.948,22 (`2024-12_PCMGE015.pdf` p.109 a 111, função 18, 20, 2 ações) | 1.274.463,69 (`2025-12_PCMGE015.pdf` p.138 a 142, função 18, 20, 3 ações) | 1.286.061,94 (`2026-08_PCMGE015.pdf` p.83 a 110, função 18, 20, 2 ações) |
| Esporte | 864.120,31 (`2024-12_PCMGE015.pdf` p.113 a 115, função 27, 3 ações) | 590.181,96 (`2025-12_PCMGE015.pdf` p.144 a 147, função 27, 3 ações) | 1.298.171,16 (`2026-08_PCMGE015.pdf` p.114 a 116, função 27, 3 ações) |

**Combustível**
- `2024-08_PCMGE015.pdf`: **1.687.697,40** (3.3.90.30.02 Combustíveis e Lubrificantes: 1.687.697,40)
- `2025-08_PCMGE015.pdf`: **2.512.332,51** (3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS: 2.340.449,01; 3.3.90.30.03 COMBUSTÍVEIS E LUBRIFICANTES PARA OUTRAS: 171.883,50)
- `2024-12_PCMGE015.pdf`: **2.952.431,08** (3.3.90.30.02 Combustíveis e Lubrificantes: 2.952.431,08)
- `2025-12_PCMGE015.pdf`: **4.825.015,06** (3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS: 4.653.131,56; 3.3.90.30.03 COMBUSTÍVEIS E LUBRIFICANTES PARA OUTRAS: 171.883,50)
- `2026-08_PCMGE015.pdf`: **4.166.562,37** (3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS: 4.166.562,37)

**Aluguel de veículos e máquinas**
- `2024-08_PCMGE015.pdf`: **2.255.784,86** (3.3.90.39.17 Locação de Móveis, Utensílios e: 158.067,51; 3.3.90.39.02 Locação de Veículos: 2.097.717,35)
- `2025-08_PCMGE015.pdf`: **3.565.348,96** (3.3.90.39.12 LOCAÇÃO DE MÁQUINAS E EQUIPAMENTOS: 1.247.997,71; 3.3.90.39.14 LOCAÇÃO DE BENS MÓVEIS DE OUTRAS NATUREZAS E: 2.317.351,25)
- `2024-12_PCMGE015.pdf`: **3.577.570,42** (3.3.90.39.17 Locação de Móveis, Utensílios e Equipamentos : 284.643,98; 3.3.90.39.02 Locação de Veículos: 3.292.926,44)
- `2025-12_PCMGE015.pdf`: **6.372.996,75** (3.3.90.39.12 LOCAÇÃO DE MÁQUINAS E EQUIPAMENTOS: 2.263.571,66; 3.3.90.39.14 LOCAÇÃO DE BENS MÓVEIS DE OUTRAS NATUREZAS E: 4.109.425,09)
- `2026-08_PCMGE015.pdf`: **3.925.047,06** (3.3.90.39.12 LOCAÇÃO DE MÁQUINAS E EQUIPAMENTOS: 987.204,99; 3.3.90.39.14 LOCAÇÃO DE BENS MÓVEIS DE OUTRAS NATUREZAS E: 2.937.842,07)

**Limpeza pública (ação)**
- `2024-08_PCMGE015.pdf`: **3.138.844,44** (ação 2090.2092.15.452.208.2.2124Gestao "Gestao e Manutencao das Acoes - Servicos de Limpeza Publica" p.96 a 96, Total do Projeto/Atividade: 3.138.844,44)
- `2025-08_PCMGE015.pdf`: **3.847.883,66** (ação 2090.2092.15.452.208.2.2124Gestao "Gestao e Manutencao das Acoes - Servicos de Limpeza Publica" p.96 a 96, Total do Projeto/Atividade: 3.847.883,66)
- `2024-12_PCMGE015.pdf`: **5.024.213,52** (ação 2090.2092.15.452.208.2.2124Gestao "Gestao e Manutencao das Acoes - Servicos de Limpeza Publica" p.83 a 83, Total do Projeto/Atividade: 5.024.213,52)
- `2025-12_PCMGE015.pdf`: **6.360.868,38** (ação 2090.2092.15.452.208.2.2124Gestao "Gestao e Manutencao das Acoes - Servicos de Limpeza Publica" p.108 a 108, Total do Projeto/Atividade: 6.360.868,38)
- `2026-08_PCMGE015.pdf`: **5.054.593,61** (ação 700.701.15.452.6.2.2049 "MANUTENCAO DOS SERVICOS DE LIMPEZA PUBLICA" p.80 a 80, Total do Projeto/Atividade: 5.054.593,61)

**Festas (ação de promoção de atividades artísticas e culturais)**
- `2024-08_PCMGE015.pdf`: **1.951.987,31** (ação 2040.2041.13.392.206.2.2113Promocao, "Promocao, Apoio e Incentivo as Atividades Artisticas, Cultur" p.15 a 16, Total do Projeto/Atividade: 1.951.987,31)
- `2025-08_PCMGE015.pdf`: **2.958.074,52** (ação 2040.2041.13.392.206.2.2113Promocao, "Promocao, Apoio e Incentivo as Atividades Artisticas, Cultur" p.16 a 16, Total do Projeto/Atividade: 2.958.074,52)
- `2024-12_PCMGE015.pdf`: **1.800.276,47** (ação 2040.2041.13.392.206.2.2113Promocao, "Promocao, Apoio e Incentivo as Atividades Artisticas, Cultur" p.12 a 12, Total do Projeto/Atividade: 1.800.276,47)
- `2025-12_PCMGE015.pdf`: **4.258.027,68** (ação 2040.2041.13.392.206.2.2113Promocao, "Promocao, Apoio e Incentivo as Atividades Artisticas, Cultur" p.18 a 19, Total do Projeto/Atividade: 4.258.027,68)
- `2026-08_PCMGE015.pdf`: **4.313.246,97** (ação 1100.1101.13.392.2.2.2085PROMOCAO, "PROMOCAO, APOIO E INCENTIVO AS ATIVIDADES ARTISTICAS, CULTUR" p.119 a 119, Total do Projeto/Atividade: 4.313.246,97)

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| de janeiro a agosto, combustível: 1 milhão e 700 em 2024 | 1.687.697,40 | 2024-08_PCMGE015.pdf | elemento 3.3.90.30.02 Combustíveis e Lubrificantes, soma de todas as ações (conta própria), Liquidações até Mês |
| 2 milhões e 500 em 2025 | 2.512.332,51 | 2025-08_PCMGE015.pdf | 3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS 2.340.449,01 + 3.3.90.30.03 PARA OUTRAS FINALIDADES 171.883,50, todas as ações (conta própria) |
| e 4 milhões e 200 em 2026 | 4.166.562,37 | 2026-08_PCMGE015.pdf | 3.3.90.30.01, todas as ações (conta própria) |
| aluguel de veículos e máquinas: 2 milhões e 300 (2024, jan a ago) | 2.255.784,86 | 2024-08_PCMGE015.pdf | 3.3.90.39.02 Locação de Veículos 2.097.717,35 + 3.3.90.39.17 Locação de Móveis, Utensílios e Equipamentos 158.067,51 (conta própria) |
| 3 milhões e 600 (2025, jan a ago) | 3.565.348,96 | 2025-08_PCMGE015.pdf | 3.3.90.39.12 LOCAÇÃO DE MÁQUINAS E EQUIPAMENTOS 1.247.997,71 + 3.3.90.39.14 LOCAÇÃO DE BENS MÓVEIS DE OUTRAS NATUREZAS (veículos) 2.317.351,25 (conta própria). Pagamentos do 39.14 para "locação de veículos" conferidos na relação 2026-08_PCMGE056.pdf |
| e 3 milhões e 900 (2026, jan a ago) | 3.925.047,06 | 2026-08_PCMGE015.pdf | 39.12 987.204,99 + 39.14 2.937.842,07 (conta própria) |
| limpeza pública: 3 milhões e 100 (2024, jan a ago) | 3.138.844,44 | 2024-08_PCMGE015.pdf | p.96 · ação 2090.2092.15.452.208.2.2124 "Gestão e Manutenção das Ações - Serviços de Limpeza Pública" · Total do Projeto/Atividade · Liquidações até Mês |
| 3 milhões e 800 (2025, jan a ago) | 3.847.883,66 | 2025-08_PCMGE015.pdf | p.96 · mesma ação |
| e 5 milhões e 100 (2026, jan a ago) | 5.054.593,61 | 2026-08_PCMGE015.pdf | p.80 · ação 700.701.15.452.6.2.2049 "MANUTENÇÃO DOS SERVIÇOS DE LIMPEZA PÚBLICA" |
| o combustível de 2026, só até agosto, já passou o ano inteiro de 2024 | 4.166.562,37 x 2.952.431,08 | 2026-08_PCMGE015.pdf x 2024-12_PCMGE015.pdf | elemento 30.01 (2026) x 30.02 (ano de 2024 inteiro), todas as ações |
| as festas levaram 1 milhão e 800 em 2024 | 1.800.276,47 | 2024-12_PCMGE015.pdf | p.12 · ação 2040.2041.13.392.206.2.2113 "Promoção, Apoio e Incentivo às Atividades Artísticas, Culturais..." · Total do Projeto/Atividade · Liquidações até Mês (bandas 3.3.90.36.04 + 3.3.90.39.18: 867.455,80) |
| e 4 milhões e 300 em 2025 | 4.258.027,68 | 2025-12_PCMGE015.pdf | p.19 · mesma ação · Total do Projeto/Atividade (bandas 3.3.90.39.94: 2.576.700,00) |
| em 2026, só até agosto, já são 4 milhões e 300 | 4.313.246,97 | 2026-08_PCMGE015.pdf | p.119 · ação 1100.1101.13.392.2.2.2085 "PROMOÇÃO, APOIO E INCENTIVO ÀS ATIVIDADES ARTÍSTICAS, CULTURAIS..." · Total do Projeto/Atividade (bandas 2.051.284,00). Mais que o ano inteiro de 2025 |
| até agosto, cultura e festas já passaram toda a assistência social | 4.751.393,60 x 4.151.961,56 | 2026-08_PCMGE015.pdf | função 13 inteira (p.117 a 120, 3 ações) x função 08 inteira (p.86 a 107, 12 ações), mesmo critério (liquidado) |
| a Câmara recebeu 6 milhões e 100 em 2025 | 6.068.563,85 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Debitado no Mês (encerramento: saldo de 5.562.850,15 + 505.713,70 de dezembro; um lançamento de 505.713,65 foi estornado, igual ao "creditado até o mês" do REPASSE CONCEDIDO no razão da Prefeitura, 2025-12_PCMGE018.pdf). Devolveu 22.054,10 (3.5.1.1.2.09.00) |
| gastou 551 mil com consultoria | 551.000,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 ASSESSORIA E CONSULTORIA TÉCNICA OU JURÍDICA 474.000,00 + 3.3.90.35.99 OUTROS SERVIÇOS DE CONSULTORIA 77.000,00 · Liquidações até Mês (conta própria). Fora isso, 3.3.90.39.05 SERVIÇOS TÉCNICOS PROFISSIONAIS 680.600,00 |
| e 365 mil com combustível | 365.339,72 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.30.01 COMBUSTÍVEIS E LUBRIFICANTES AUTOMOTIVOS · Liquidações até Mês (2026 até agosto: 262.090,81, 2026-08_CAMARA_PCMGE015.pdf) |
| e entregou 7 das 8 prestações de 2026 fora do prazo | 01 a 05, 07 e 08/2026 "Entregue fora do prazo"; 06/2026 "Entregue no prazo"; 09/2026 "Pendente" | e-TCM, Consulta Pública, Câmara UJ 198, ano 2026, mensal (consulta de 10/11/2026); gravado em ~/Documents/SITE-EUMAGNOLEITE/dados/prestacoes-etcm/inhambupe.json (campo "outras") | lista de prestações |
| a dívida parcelada com o INSS fechou 2024 em 143 milhões | 143.149.132,60 | 2025_PCAGO012.pdf (Dívida Fundada Interna 2025) | p.1 · Secretaria da Receita Federal - Débitos Previdenciários · Saldo Anterior (= 2024_PCAGO012.pdf p.1: INSS - DÉBITO PARCELADO (P) 137.149.132,60 + CONTRIBUIÇÕES PREVIDENCIÁRIAS - DÉBITO PARCELADO 6.000.000,00) |
| em 2025, entraram mais 81 milhões e 300 | 81.317.903,02 | 2025_PCAGO012.pdf | p.1 · mesma linha · Inscrição (baixa no ano: 8.699.766,32) |
| e ela fechou o ano em 215 milhões e 800 | 215.767.269,30 | 2025_PCAGO012.pdf | p.1 · mesma linha · Saldo Atual (em ago/2026, 2026-08_PCMGE064.pdf p.12: INSS - DÉBITO PARCELADO (P) 210.767.269,30 no longo prazo) |
| é mais do que a cidade arrecadou no ano | 215.767.269,30 x 189.662.996,71 | 2025_PCAGO012.pdf x 2025_PCAGO015.pdf | conta própria |
| 14 processos sobre Inhambupe foram abertos em 2025 e 2026 | 07346e25, 10096e25, 30860e25, 30864e25, 31513e25, 33393e25, 34540e25, 11035e26, 12448e26, 18169e26, 18660e26, 19584e26, 20547e26, 25896e26 | TCM_DECISOES_AUDITORIA_2026-11-10.txt (https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/, dados processados em 10/11/2026 16:48:42) | número do processo com e25 ou e26 |
| um foi julgado improcedente | 11035e26 | decisoes/11035e26_delib.pdf (última página: "julgar IMPROCEDENTE a presente Denúncia", sessão de 19/05/2026) | |
| os outros 13 ainda esperam julgamento | 13 processos sem "Data do Julgamento" no site | TCM_DECISOES_AUDITORIA_2026-11-10.txt | |
| o registro do precatório do Fundef | 07346e25 (Representação do Ministério Público, exercício 2024) | idem | "contabilizações como receita orçamentária dos recursos provenientes do precatório do FUNDEF" |
| e a consultoria e o combustível da Câmara | 34540e25 (gasto com consultorias, 2025) e 12448e26 (gastos com combustíveis, 2026) | idem | denúncias contra a Câmara |

## Pendências no TCM
- Razão consolidado 2026-08_PCMGE064 dá 4.212,88 a menos de liquidado que a soma do PCMGE015 da Prefeitura + Câmara (usei o PCMGE015, que fecha com o Total do Poder e da Unidade).
- Câmara: prestação de 09/2026 "Pendente" no e-TCM; 7 das 8 de 2026 entregues fora do prazo.
- Contas anuais (parecer prévio) pedem captcha: não consultadas.
