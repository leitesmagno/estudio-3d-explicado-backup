# Fontes: arrecadação de Belmonte 2018–2026 (série Belmonte, vídeo 1)

Todos os documentos vêm do e-TCM, Consulta Pública do TCM-BA (Prefeitura Municipal de Belmonte, UJ 646), baixados em 07/11/2026 e guardados em `~/Documents/RECEITAS-DESPESAS-BELMONTE/documentos_tcm/`.

- 2018 a 2025: Anexo 10 da Lei 4.320/64 (Comparativo da Receita Orçada com a Arrecadada) da prestação anual "Governo". Conferido com o Anexo 12 (Balanço Orçamentário), linha "Subtotal das receitas".
- 2026: Demonstrativo da Receita Orçamentária do SIGA (PCMGE016) de 09/2026, "Arrecadada até mês" menos "Anulada até mês".
- Contas: `scripts/receita_a10.py`, `scripts/receita_siga.py` e `scripts/receita_resumo.py`. Tabela completa: `saida/arrecadacao_resumo.csv` (cópia em `referencias/`).

**Valores nominais**, como estão no documento, sem correção pela inflação (decisão do Magno em 07/11/2026). A legenda precisa dizer isso.

**Desconto do Fundeb:** de 2018 a 2024, o Anexo 10 mostra o FPM, o ICMS, o IPVA e o ITR cheios e, numa linha à parte, a "Dedução para formação do FUNDEB". Em 2025 e 2026, esses repasses já vêm descontados. Para comparar igual com igual, o vídeo usa sempre o valor já descontado, que é também o que soma o total do documento. Exemplo: FPM 2018 cheio R$ 21.331.604,81, menos a dedução de R$ 3.922.279,63, dá R$ 17,41 mi.

**Complementação da União ao Fundeb:** de 2018 a 2020 ela vem dentro do grupo "Transferências de outras instituições (Fundeb)". Aqui ela foi contada como União, como nos anos seguintes.

**Total arrecadado (R$):** 2018 61.013.194,43 · 2019 66.071.601,36 · 2020 68.502.508,38 · 2021 73.436.640,30 · 2022 90.919.639,94 · 2023 89.559.780,09 (soma do Anexo 10: correntes 95.899.306,59 + capital 3.426.965,44 − dedução 9.766.491,94) · 2024 104.487.271,93 · 2025 125.810.696,91 · 2026 (jan–set) 111.517.122,04.
Atenção: em 2022 e 2023 a linha "TOTAL (VII)" do Anexo 12 (93,6 e 93,9 mi) soma o déficit. Arrecadação é a linha "SUBTOTAL DAS RECEITAS (III)".

| Frase do roteiro | Valor exato | Documento |
|---|---|---|
| 2018 arrecadou "61 milhões" | 61.013.194,43 | Anexo 10/12 de 2018 (proc. 07358e19) |
| 2025 "125 milhões e 800" | 125.810.696,91 | Anexo 10 de 2025 |
| 2026 até setembro "111 milhões e meio" | 111.517.122,04 | PCMGE016 09/2026 |
| 2025: União "71 e 600", Fundeb "20 e 300", Estado "13 e 400", município "20 e meio" | 71.612.175,26 · 20.306.893,45 · 13.371.685,19 · 20.519.943,01 | Anexo 10 de 2025 |
| FPM "17 e 400" (2018) → "39 e 700" (2025) | 17,41 mi (já sem a dedução) · 39.666.462,22 | Anexo 10 de 2018 e 2025 |
| SUS "4 e meio" → "11 e 700" | 4,49 mi (corrente 4.441.909,94 + capital 45.654,23) · 11.721.999,52 | Anexo 10 |
| Ajuda da União ao Fundeb "4 e 600" → "12 e 700"; 2026 "passou de 19" | 4.625.486,09 · 12.662.084,30 · 19.088.536,40 (até set/2026, antes de 402,46 de anulação) | Anexo 10; PCMGE016 09/2026 |
| ICMS "7 e 900" → "11 e meio" | 7,93 mi (9.915.915,60 − dedução 1.983.182,90) · 11.489.466,30 | Anexo 10 |
| Tributos do município "5 e 800" (2018), "entre 6 e 7 e meio" até 2023, "8 e 800" (2024), "15 e 400" (2025) | 5,80 · 6,52 · 6,17 · 7,10 · 7,47 · 6,50 (inclui 440.895,68 de contribuição de melhoria da iluminação) · 8,82 · 15,35 mi. Soma: grupo 1.1 (impostos, taxas e contribuição de melhoria) + contribuição de iluminação (COSIP) | Anexo 10, conta própria |
| "Quase três vezes 2018" | 15,35 ÷ 5,80 = 2,65 | conta própria |
| ISS "3 e meio" → "4 e 200" | 3.477.526,89 · 4.165.810,88 | Anexo 10 |
| ITBI "420 mil" → "870 mil" | 415.019,23 · 870.923,24 | Anexo 10 |
| Imposto de renda retido "1 e 700" → "5 e 800" | 1.697.080,46 · 5.811.177,20 | Anexo 10 |
| Taxas "180 mil" → "1 e 300" | 175.330,79 · 1.344.130,40 | Anexo 10 |
| Iluminação "zero até 2021", "660 mil" | 2018 a 2021: 0,00 · 2025: 664.777,29 | Anexo 10 |
| IPTU "36 mil" → "2 milhões e 500"; "2 e 100" de dívida ativa; "320 mil" do ano | 36.345,77 · 2.492.264,18 (principal 324.434,18; dívida ativa 2.121.362,16; juros da dívida ativa 40.749,84; multas 5.718,00) | Anexo 10 de 2018 e 2025 |
| "De cada 100 reais, só 16 vieram do próprio município" | 20.519.943,01 ÷ 125.810.696,91 = 16,3% | conta própria |

**Cuidados (não entram na fala):**
- O imposto de renda retido caiu para R$ 790.546,52 em 2023 e voltou a R$ 3,63 mi em 2024. O documento não explica, então o roteiro compara só 2018 com 2025.
- "Outras receitas correntes" de R$ 4,07 mi (2024), R$ 3,49 mi (2025, restituições e ressarcimentos) e R$ 4,30 mi (2026, "outras indenizações") estão no total do município, mas não são impostos. O documento não diz de onde vêm.
- A prestação anual de 2020 aparece no e-TCM com o status "Tomada de Contas" (enviada em 10/09/2021). Não usar no vídeo sem conferir o que isso significou.
