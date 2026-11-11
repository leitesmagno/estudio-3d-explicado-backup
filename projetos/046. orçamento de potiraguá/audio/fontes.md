# Fontes: 046. orçamento de potiraguá (checado em 07/11/2026)

Documentos baixados do e-TCM (Consulta Pública, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam; município POTIRAGUÁ, código 312; Prefeitura UJ 916; Câmara UJ 343), salvos em `~/Documents/RECEITAS-DESPESAS-POTIRAGUA/documentos_tcm/` (prefixo AAAA-MM; anual = AAAA-13). Cada PDF foi aberto e conferido (cabeçalho "POTIRAGUÁ"/"POTIRAGUA" e competência certa).
Sistema: SIAFIC/GovNet (anual 2024) e SIGA do TCM (PCMGE015/016 mensais). Scripts: `scripts/acoes015a.py` (ações do SIGA), `porfuncao.py`, `listar.py` (tabela em `saida/acoes_listadas.txt`), `elem.py`, `elemtodos.py`, `obras51.py`.
IBGE 2925402. Grafia oficial: Potiraguá.

## Entregas ao TCM (e-TCM, status em 07/11/2026)
- Prefeitura: último mês entregue 09/2026 (enviado 26/10/2026, no prazo). 2024: 10 dos 12 meses "Entregue fora do prazo" (só 01/2024 e 05/2024 no prazo).
- Anual 2025 (tipo Governo): enviado 30/06/2026, status **"Tomada de Contas"**; só 10 arquivos "Duodécimo" (repasses à Câmara), **sem Balanço, sem Anexo 9 e sem anexos da Lei 4.320**. Anual 2024: entregue no prazo (03/04/2025), com todos os anexos.
- Câmara: mensais até 09/2026 entregues.

## Receita (só o total declarado ao TCM, "arrecadou")
| ano | valor | documento |
|---|---|---|
| 2024 | R$ 53.305.500,17 | PCAGO015 Balanço Orçamentário 2024, "SUBTOTAL DAS RECEITAS (III)", Realizadas (= PCMGE016 12/2024 "Total Até Mês" 53.160.707,89 + 144.792,28) |
| 2025 | R$ 57.913.590,18 | PCMGE016 12/2025, resumo "Total Até Mês" (arrecadada 59.570.702,13 − anulada 1.657.111,95). Não há Balanço 2025 no e-TCM |
| 2026 jan–set | R$ 54.929.708,94 | PCMGE016 09/2026, resumo "Total Até Mês" (corrente 54.432.208,94 + capital 497.500,00) |

## Despesa
- 2024: empenhada, PCAGO007 Anexo IX consolidado (Prefeitura + Câmara) = R$ 55.741.110,28. Balanço 2024: "Déficit (VI)" R$ 2.435.610,11 → "2 milhões e 400 a mais".
- 2025: empenhada, PCMGE015 12/2025 da Prefeitura (R$ 60.776.065,48) + PCMGE015 12/2025 da Câmara (R$ 2.426.960,61) = R$ 63.203.026,09 (sem Balanço 2025). 63,20 − 57,91 = R$ 5,29 mi a mais (conta própria).
- 2026 jan–set: liquidada, PCMGE015 09/2026 Prefeitura (R$ 56.330.191,97) + Câmara (R$ 2.103.810,28) = R$ 58.434.002,93. 58,43 − 54,93 = R$ 3,50 mi a mais (conta própria).

## Setores (R$ milhões) e como foram agrupados
| setor (fala) | o que entra | 2024 | 2025 | 2026 até set (liq.) |
|---|---|---|---|---|
| Educação | função 12 | 22,600 | 22,616 | 24,358 |
| Saúde | função 10 | 10,761 | 13,389 | 13,966 |
| Administração | função 04 menos as ações de dívida (abaixo) | 7,099 | 12,619 | 8,283 |
| Obras e serviços urbanos | função 15 Urbanismo + 25 Energia (só 2024: 63 mil, Sec. de Obras) | 6,797 | 4,741 | 3,800 |
| Câmara | função 01 (2024 Anexo 9; 2025 e 2026 PCMGE015 da Câmara) | 1,765 | 2,427 | 2,104 |
| Dívidas | ações "Amortização e encargos da dívida interna" e "Precatórios" (função 04, subfunção 123) + "Contribuição para o PASEP" (função 11); 2026: "Gestão de dívidas, sentenças e obrigações tributárias e contributivas" (04.843) | 1,119 (0,636+0,008+0,475) | 2,741 (2,146+0,594) | 1,817 |
| Cultura e esporte | funções 13 + 27 (em 2026 a secretaria é conjunta: Juventude, Cultura, Esporte, Turismo e Lazer) | 2,757 (2,731+0,026) | 0,843 (0,794+0,049) | 0,911 |
| Assistência social | função 08 | 2,318 | 2,960 | 2,246 |
| Transporte | função 26 (Secretaria de Transportes; o transporte escolar fica na Educação) | 0,426 | 0,619 | 0,671 |
| Agricultura | função 20 | 0,040 | 0,171 | 0,214 |
| Meio ambiente | função 18 | 0,057 | 0,078 | 0,062 |
| **Total** | | **55,74** | **63,20** | **58,43** |
Na fala, valores arredondados: 2024 22,6 / 10,8 / 7,1 / 6,8 / 1,8 / 1,1 / 2,8 / 2,3 / 430 mil / 40 mil / 57 mil; 2025 22,6 / 13,4 / 12,6 / 4,7 / 2,4 / 2,7 / 840 mil / 3 / 620 mil / 170 mil / 78 mil; 2026 24,4 / 14 / 8,3 / 3,8 / 2,1 / 1,8 / 910 mil / 2,2 / 670 mil / 210 mil / 62 mil.

## Os zeros (onde foi procurado)
- **Água e saneamento**: função 17 com ações "Implantação e manutenção de sistemas de abastecimento de água (e poços artesianos)" e "esgotamento sanitário", dotação de R$ 5 mil a R$ 30 mil, **gasto zero nos três anos** (PCMGE015 12/2024, 12/2025, 09/2026). A prefeitura só paga contas de água dos prédios (elemento 3.3.90.39.44, poucos milhares de reais, dentro de outras secretarias). Receita: nenhuma linha de saneamento no PCMGE016. Operadora do serviço de água e esgoto em Potiraguá: **Embasa** (Infosanbas, https://infosanbas.org.br/municipio/potiragua-ba/ ; Instituto Água e Saneamento, https://www.aguaesaneamento.org.br/municipios-e-saneamento/ba/potiragua ; o portal da prefeitura lista "Certidão Negativa de Débitos junto à EMBASA").
- **Defesa civil**: linha existe todo ano, gasto zero: 2024 "Coordenadoria de Defesa Civil" R$ 28.800 fixados; 2025 R$ 29.952; 2026 "Ações de proteção e defesa civil" R$ 135.000 fixados e anulados por inteiro. Nenhuma linha de receita com o nome.
- **Proteção animal**: nenhuma ação, subfunção ou elemento com "animal" (só "Promoção da produção animal", da agricultura), "zoonose" ou "bem-estar" nos três anos, nem na receita.
- Segurança pública não entra (regra). Transporte não é zero.

## Achado 1: construir e reformar (elemento 4.4.90.51 "Obras e instalações", todas as ações)
| ano | reservado no orçamento (dotação inicial) | usado | documento |
|---|---|---|---|
| 2024 | R$ 3.866.000 aprox. (3,866 mi; inclui 1,125 mi na Sec. de Obras, 0,589 mi em centros comunitários, 0,485 mi em estradas vicinais) | R$ 265.700 aprox. (0,266 mi: 0,143 pavimentação de vias + 0,122 FNDE) | PCMGE015 12/2024, empenhado |
| 2025 | R$ 2,981 mi | R$ 0,286 mi (reforma de escolas) | PCMGE015 12/2025, empenhado |
| 2026 até set | R$ 6,126 mi (4,102 mi na ação "Obras de infraestrutura", 0,400 mi "Praça Getúlio Vargas", 0,405 mi estradas vicinais...) | R$ 0,750 mi liquidado (0,352 UBS, 0,270 obras de infraestrutura, 0,128 ensino infantil) | PCMGE015 09/2026 |
| Soma | R$ 12,97 mi ("13 milhões no papel") | R$ 1,30 mi ("1 milhão e 300") | conta própria |
- Conferido: a Secretaria de Obras gasta em salários, combustível, material de manutenção e locação de máquinas (fora desta conta); o vídeo fala só da "conta para construir e reformar". Notícias (07/11/2026): nenhuma ordem de serviço, obra do Estado ou da União em Potiraguá em 2024–2026 achada (buscas por pavimentação, calçamento, praça Getúlio Vargas, Governo da Bahia). A fala não diz que nenhuma obra começou, só quanto saiu dessa conta.

## Achado 2: apoio administrativo, técnico e operacional (elemento 3.3.90.39.79, pessoa jurídica)
- 2025: R$ 7.398.698,72 empenhados no elemento 3.3.90.39.79 (Administração 3,741; Ensino fundamental 2,010; Saúde 0,737 + 0,090 + 0,031; Obras 0,500; Ação social 0,238; Educação 0,052). PCMGE015 12/2025. (Na 1ª conta eu tinha somado também 29 mil do elemento 3.3.90.36.35, de pessoa física; corrigido na 2ª conferência: continua "7 milhões e 400 mil".)
- 2026 até set: R$ 710 mil liquidados (0,615 Administração; 0,095 Cultura). PCMGE015 09/2026. Em 2026 cresceram as "contratações por tempo determinado" (ex.: 0,633 mi na Administração, 0,859 mi em Obras); a fala só pergunta "O que mudou?".
- 7,399 / 1,302 = 5,7 → "mais de cinco vezes o que foi para obras nos três anos" (conta própria).

## Achado 3: festas de 2024 x assistência social
- Ação "Preservação das manifestações populares, culturais e cívicas" (13.392): R$ 2.673 mil empenhados em 2024, todo em serviços de pessoa jurídica (PCMGE015 12/2024). PCMGE056 de 06/2024 da Prefeitura: pagamentos de "shows artísticos musicais" na festividade de São João de Bairro e Dia do Evangélico, e "estrutura física e equipamentos para realização do Micarjão, São João dos Bairros e Vaquejada"; PCMGE009 06/2024: inexigibilidade IL026/2024 (show do São João de Bairro, 21/06/2024).
- Assistência social 2024: R$ 2.318.471,81 (Anexo 9). 2,673 > 2,318.
- Em 2025 e 2026 a assistência foi maior que as festas (2025: festas 0,885 mi, incluindo R$ 518 mil de palcos na Administração; 2026 até set: R$ 658 mil liquidados com bandas). Por isso a fala diz só 2024.

## Tribunal (TCM-BA › Decisões › Auditoria, Prefeitura de Potiraguá, consulta em 07/11/2026)
- 06251E25: "Ausência de prestação de contas de gestão no tempo devido...", exercício 2024. Sem deliberação publicada (não julgado).
- 25552E25: "Supostas irregularidades no concurso público nº 001/2024", exercício 2025. Sem deliberação (não julgado).
- Outros recentes, não usados: 02441E25 (ausência de resposta a notificação, 2024), 15668E25 (notificação do 3º quadrimestre de 2024), 21957E25 (execução de serviços, 2021), 22513E25 (concurso, 2021), 03718E26 (notas explicativas, 2022).
- Contas anuais (parecer prévio): a página pede "não sou robô"; não consultado.

## Notícias (07/11/2026)
- Nenhuma obra estadual ou federal em Potiraguá achada de 2024 a 2026 (Bahia Notícias, ba.gov.br, buscas gerais).
- Concurso: sites de concurso citam suspensão judicial e retomada, com datas inconsistentes; não usado.

## 2ª conferência, direto no texto dos PDFs, com arquivo e linha (07/11/2026, antes do vídeo final)
Arquivos em `~/Documents/RECEITAS-DESPESAS-POTIRAGUA/documentos_tcm/` (o .txt é o texto extraído do PDF de mesmo nome). Tabela completa por ação em `saida/conferencia_linhas.md` e achados em `saida/conferencia_achados.md`.

**Receita**
- 2024: `2024-13_ANUAL_PCAGO015.txt:25` SUBTOTAL DAS RECEITAS (III) Realizadas 53.305.500,17 → "53 milhões e 300 mil", "R$ 53,3 MI" (mapa). Déficit: linha 60, 2.435.610,11 → "2 milhões e 400 a mais".
- 2025: `2025-12_PCMGE016.txt:419` Receita Corrente, Total Até Mês 57.913.590,18 (+ capital linha 420: 0,00) → "57 milhões e 900".
- 2026: `2026-09_PCMGE016.txt:388` 54.432.208,94 + linha 389 capital 497.500,00 = 54.929.708,94 → "54 milhões e 900".

**Despesa total**
- 2024: `2024-13_ANUAL_PCAGO007.txt:245` total 55.741.110,28 → "55 milhões e 700".
- 2025: Prefeitura `2025-12_PCMGE015.txt` "Total do Órgão", coluna Empenhada Até Mês, linhas 2050 (21.810.754,27), 2868 (13.388.708,82), 4199 (2.960.297,92), 5329 (22.616.304,47) = 60.776.065,48 + Câmara `2025-12_CAMARA_PCMGE015.txt:177` 2.426.960,61 = 63.203.026,09 → "63 e 200"; 63,20 − 57,91 = 5,29 → "5 milhões e 300 a mais".
- 2026: Prefeitura `2026-09_PCMGE015.txt` "Total do Órgão", coluna Liquidada Até Mês, linhas 1679 (15.715.091,24), 2416 (13.966.474,55), 3176 (2.242.086,62), 4341 (24.406.540,24) = 56.330.192,65 + Câmara `2026-09_CAMARA_PCMGE015.txt:160` 2.103.810,28 = 58.434.002,93 → "58 e 400"; 58,43 − 54,93 = 3,50 → "3 milhões e 500".

**Setores 2024** (`2024-13_ANUAL_PCAGO007.txt`, linhas "Total"): Legislativa 1.764.686,09 e Administração 7.743.455,96 (linha 20); Assistência 2.318.471,81 e Saúde 10.761.322,97 (65); Trabalho/PASEP 474.870,48, Educação 22.600.497,82, Cultura 2.730.608,40, Urbanismo 6.734.249,20 (110); Gestão ambiental 57.088,68 e Agricultura 40.074,41 (155); Energia 63.320,00 (200); Transporte 426.301,46 e Desporto 26.163,00 (245). Dívidas: `2024-12_PCMGE015.txt:248` amortização 635.690,16 + `:253` precatórios 8.164,23 + PASEP 474.870,48 = 1.118.724,87 → "1 milhão e 100"; Administração 7.743.455,96 − 643.854,39 = 7.099.601,57 → "7 milhões e 100". Obras 6.734.249,20 + 63.320,00 = 6.797.569,20 → "6 milhões e 800". Cultura e esporte 2.756.771,40 → "2 milhões e 800".

**Setores 2025 e 2026**: somas por ação conferidas linha a linha em `saida/conferencia_linhas.md` (todas batem com a fala): 2025 Educação 22.616.304,47; Saúde 13.388.708,82; Administração 12.619.111,98; Obras 4.741.469,91; Câmara 2.426.960,61; Dívidas 2.740.269,77; Cultura e esporte 842.145,31; Assistência 2.960.297,92; Transporte 618.524,87; Agricultura 171.232,43; Meio ambiente 78.000,00. 2026 (liq.) Educação 24.358.278,92; Saúde 13.966.474,55; Administração 8.283.274,82; Obras 3.800.308,27; Câmara 2.103.810,28; Dívidas 1.817.153,72; Cultura e esporte 911.116,56; Assistência 2.246.390,83; Transporte 670.953,10; Agricultura 213.941,88; Meio ambiente 62.300,00.

**Construir e reformar (4.4.90.51)** — fala, tela, capa ("R$ 13 mi no papel, R$ 1,3 mi usado") e legenda:
- 2024 reservado 3.866.323,74 (46 linhas .00 do `2024-12_PCMGE015.txt`, 1ª coluna); usado `:904` 122.436,39 + `:1775` 143.336,38 = 265.772,77 → "266 mil".
- 2025 reservado 2.980.534,00 (`2025-12_PCMGE015.txt`, 42 linhas); usado `:4269` 21.597,54 + `:4270` 151.124,89 + `:4271` 113.690,30 = 286.412,73 → "286 mil".
- 2026 reservado 6.126.300,00 (`2026-09_PCMGE015.txt`, 48 linhas); usado (liq.) `:1058` 270.306,90 + `:2002` 352.000,00 + `:3991` 128.022,13 = 750.329,03 → "750 mil".
- Soma: 12.973.157,74 → "13 milhões"; 1.302.514,53 → "1 milhão e 300".

**Apoio administrativo (3.3.90.39.79)**: 2025 `2025-12_PCMGE015.txt` linhas 474, 1372, 2184, 2400, 2566, 3091, 4439, 4869 = 7.398.698,72 → "7 milhões e 400 mil"; 2026 `2026-09_PCMGE015.txt:245` 614.950,00 + `:657` 94.600,00 = 709.550,00 → "710 mil". 7.398.698,72 ÷ 1.302.514,53 = 5,68 → "mais de cinco vezes".

**Festas 2024**: `2024-12_PCMGE015.txt:1059` "Preservação das manifestações populares, culturais e cívicas" 2.673.420,00 → "2 milhões e 700"; assistência `2024-13_ANUAL_PCAGO007.txt:65` 2.318.471,81 → "2 milhões e 300".

**Defesa civil**: `2024-12_PCMGE015.txt:3028` fixado 28.800,00, empenhado 0; `2025-12_PCMGE015.txt:111` inicial 29.952,00, empenhado 0; `2026-09_PCMGE015.txt:306` inicial 135.000,00, empenhado 0.

**Tribunal**: datas de envio de 2024 na lista do e-TCM (10 "Entregue fora do prazo": 02, 03, 04, 06, 07, 08, 09, 10, 11, 12/2024); processos 06251E25 e 25552E25 na página TCM-BA › Decisões › Auditoria, sem link de deliberação; status "Tomada de Contas" do anual 2025 na lista do e-TCM.
Resultado: todos os números da fala, da tela, da capa e da legenda batem com os PDFs. Nenhum número saiu.
