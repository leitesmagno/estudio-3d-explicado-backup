# Fontes do 115. orçamento de caculé (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 10:44 e 11:25, no Chrome do Magno numa aba própria, fechada no fim, recebedor 127.0.0.1:8778, pasta CACULE, fetch + /salva, sem janela). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-CACULE/documentos_tcm/` (43 PDFs, cada um com o texto extraído ao lado em .txt). Município conferido dentro de cada PDF: todos trazem "CACULÉ" ou "CACULE" no cabeçalho, menos os comprovantes bancários escaneados de repasse à Câmara (PCMGE008 da Prefeitura de 12/2024 e 09/2026; não usados para valores).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 61 (CACULÉ) · Prefeitura UJ 666 · Câmara UJ 96. Não há autarquia com prestação própria (os fundos de Saúde, Educação e Assistência Social estão dentro da Prefeitura e dos consolidados). Último mês entregue em 2026: 09/2026 (Prefeitura e Câmara; 10/2026 aparece como "Pendente").
"Gastou" = despesa LIQUIDADA. Receita = total que o documento do TCM traz (Balanço Orçamentário de 2024 e 2025; em 2026, Demonstrativo da Receita da Prefeitura de set/2026, já sem a parte do Fundeb e sem as anulações).
O Balanço e os PCMGE065 consolidados (Prefeitura + fundos + Câmara) fecham centavo a centavo entre si em 2024 e 2025. Em 2026 o PCMGE065 consolidado (gerado pelo SIGA) fecha com a soma das ações.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026, cada número contra saida/setores.json e os .json dos leitores); 2ª com cada valor exato procurado no texto do PDF citado (scripts/pag.py, que devolve página e linha). Somas, diferenças e arredondamentos estão marcados como conta própria.

## Como a despesa por setor foi montada (scripts/setores.py → saida/setores.json; soma = total do ano, centavo a centavo)
- 2024: PCMGE065 consolidado de 12/2024 (`2024-12_PCMGE065.pdf`, SIAFIC Fator "Modelo 04", p.91, TOTAL GERAL DA DESPESA ORÇAMENTÁRIA, Liquidado: 119.488.509,41) = Balanço (`2024_PCAGO015.pdf`, p.2, Despesas Liquidadas). Leitor: scripts/acoes065c.py (123 ações, 1.235 elementos).
- 2025: PCMGE065 consolidado de 12/2025 (`2025-12_PCMGE065.pdf`, p.92, TOTAL GERAL, Liquidado: 128.696.949,83; Empenhado 129.415.936,31) = Balanço (`2025_PCAGO015.pdf`, p.2). Leitor: scripts/acoes065c.py (123 ações, 1.240 elementos).
- 2026 (até setembro): PCMGE065 consolidado de 09/2026 gerado pelo SIGA (`2026-09_PCMGE065.pdf`, p.99, soma dos três "Total do Poder", Liquidada até o mês 24.442.943,32 + 2.695.749,43 + 77.878.895,89 = 105.017.588,64; Empenhada até o mês 136.905.058,51). Leitor: scripts/acoes_cons.py (123 ações).
Setor pela FUNÇÃO da ação: Educação 12 · Saúde 10 · Obras e serviços urbanos 15 + 16 + 17 + 25 + 06 (urbanismo, casas populares, água, iluminação pública e ordem pública) · Administração 04 + 11 · Dívidas 28 (encargos especiais: parcelamentos, PASEP e sentenças) · Assistência social 08 · Câmara 01 · Cultura e festas 13 · Agricultura e meio ambiente 20 · Esporte 27.

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 114 milhões em 2024 | 114.135.830,32 | 2024_PCAGO015.pdf (Balanço Orçamentário) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2024-12_PCMGE066.pdf p.8, TOTAL GERAL DA RECEITA ORÇAMENTÁRIA, Arrecadado até Mês) |
| gastou 119 milhões e 500 em 2024 | 119.488.509,41 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2024-12_PCMGE065.pdf p.91) |
| gastou 5 milhões e 400 a mais do que arrecadou | 5.352.679,09 | conta própria | 119.488.509,41 − 114.135.830,32 |
| arrecadou 135 milhões e 600 em 2025 | 135.587.869,22 | 2025_PCAGO015.pdf | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas (= 2025-12_PCMGE066.pdf p.9, TOTAL GERAL) |
| gastou 128 milhões e 700 em 2025 | 128.696.949,83 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas (= 2025-12_PCMGE065.pdf p.92) |
| sobraram 6 milhões e 900 | 6.890.919,39 | conta própria | 135.587.869,22 − 128.696.949,83 (o Balanço mostra "Superávit (XIII) 6.171.932,91" pelo empenhado, p.2) |
| arrecadou 97 milhões e 500 até setembro de 2026 | 97.517.520,70 | 2026-09_PCMGE016.pdf (Demonstrativo da Receita, Prefeitura, SIGA) | p.8 · TOTAL · Arrecadada até Mês 106.538.940,43 − Deduções até Mês (Fundeb) 9.020.848,34 − Anulada até Mês 571,39 (conta própria) |
| gastou 105 milhões até setembro | 105.017.588,64 | 2026-09_PCMGE065.pdf | p.99 · RESUMO · Liquidada Até o Mês (soma dos três "Total do Poder": p.29, p.30 e p.99) |
| 7 milhões e 500 a mais do que arrecadou | 7.500.067,94 | conta própria | 105.017.588,64 − 97.517.520,70 |
| já comprometeu 136 milhões e 900 | 136.905.058,51 | 2026-09_PCMGE065.pdf | p.99 · RESUMO · Empenhada Até o Mês |

## Setores (soma = total do ano; somas das ações por função: conta própria)
| Setor | Dito (2024 · 2025 · 2026) | 2024 liquidado (2024-12_PCMGE065.pdf) | 2025 liquidado (2025-12_PCMGE065.pdf) | 2026 até set (2026-09_PCMGE065.pdf) |
|---|---|---|---|---|
| Educação | 49 milhões · 58 e 400 · 48 e 400 | 49.010.636,20 (p.28 a 46, função 12) | 58.390.689,22 (p.29 a 46) | 48.355.343,31 (p.32 a 58) |
| Saúde | 25 e 200 · 26 e 500 · 21 e 200 | 25.213.987,58 (p.57 a 73, função 10) | 26.458.675,59 (p.57 a 73) | 21.175.438,08 (p.61 a 81) |
| Obras e serviços urbanos | 22 e 300 · 17 e 500 · 15 milhões | 22.326.271,34 (p.9 a 23, funções 06, 15, 16, 17 e 25) | 17.475.274,44 (p.9 a 23) | 15.047.359,98 (p.7 a 24) |
| Administração | 7 e 500 · 9 e 100 · 6 e 700 | 7.534.659,11 (p.2 a 27, funções 04 e 11) | 9.131.233,43 (p.2 a 27) | 6.734.427,49 (p.1 a 29) |
| Dívidas | 2 e 600 · 4 e 700 · 1 e 900 | 2.633.820,31 (p.28, função 28, "ENCARGOS ESPECIAIS DO MUNICÍPIO") | 4.663.437,94 (p.28) | 1.881.514,76 (p.9) |
| Assistência social | 4 e 600 · 4 e 700 · 3 e 800 | 4.575.839,85 (p.74 a 90, função 08) | 4.700.529,82 (p.74 a 90) | 3.836.326,67 (p.82 a 98) |
| Câmara de Vereadores | 2 e 800 · 3 e 400 · 2 e 700 | 2.774.871,97 (p.1 a 2, função 01) | 3.384.250,16 (p.1 a 2; = 2025-12_CAMARA_PCMGE015.pdf p.5, Total do Poder, Liquidações até Mês) | 2.695.749,43 (p.30, Total do Poder Legislativo, Liquidada até o mês) |
| Cultura e festas | 4 milhões · 2 e 900 · 4 milhões | 4.018.575,10 (p.50 a 53, função 13) | 2.944.202,88 (p.50 a 53) | 3.991.320,33 (p.35 a 59) |
| Agricultura e meio ambiente | 861 mil · 916 mil · 780 mil | 861.148,16 (p.23 a 27, função 20) | 916.046,90 (p.23 a 27) | 779.641,09 (p.24 a 28) |
| Esporte | 539 mil · 633 mil · 520 mil | 538.699,79 (p.55 a 56, função 27) | 632.609,45 (p.55 a 56) | 520.467,50 (p.34 a 48) |

## Achados (miolo e fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha · coluna |
|---|---|---|---|
| comemoração de festividades levou 3 milhões e 600 em 2024 | 3.582.138,35 | 2024-12_PCMGE065.pdf | p.51 · ação 13.392.0010.2.117 "Comemoração de Festividades" · TOTAL DA AÇÃO · Liquidado (previsto 3.654.200,00) |
| e 2 milhões e 700 em 2025 | 2.651.129,26 | 2025-12_PCMGE065.pdf | p.51 · ação 13.392.0010.2.117 "Comemoração de Festividades" · TOTAL DA AÇÃO · Liquidado (previsto 3.577.000,00) |
| em 2026, só até setembro, 3 milhões e 100 | 3.112.282,93 | 2026-09_PCMGE065.pdf | p.47 a 48 · ação 3.2040.13.392.10.2.2117 "Comemoração de Festividades" · Total da Ação de Governo · Liquidada até o mês |
| o orçamento do ano prevê 4 milhões e 600 | 4.579.000,00 | 2026-09_PCMGE065.pdf | p.47 a 48 · mesma ação · Dotação atual (Total da Ação de Governo) |
| somando, 9 milhões e 300 em festas | 9.345.550,54 | conta própria | 3.582.138,35 + 2.651.129,26 + 3.112.282,93 |
| até setembro, cultura e festas já passaram toda a assistência social | 3.991.320,33 x 3.836.326,67 | 2026-09_PCMGE065.pdf | soma das ações da função 13 (p.35 a 59) x soma das ações da função 08 (p.82 a 98), Liquidada até o mês (conta própria) |
| a ajuda de emergência para as famílias ficou em 16 mil | 16.010,00 | 2026-09_PCMGE065.pdf | p.97 · ação 5.2070.8.244.2.2.2328 "Benefícios Eventuais" · Total da Ação de Governo · Liquidada até o mês (previsto 69.000,00) |
| a Câmara recebeu 4 milhões e 400 da prefeitura em 2025 | 4.445.508,26 | 2025-12_CAMARA_PCMGE018.pdf (Razão da Câmara) | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o Mês |
| e devolveu 1 milhão e 100 | 1.061.258,10 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o Mês (4.445.508,26 − 1.061.258,10 = 3.384.250,16, o liquidado da Câmara, centavo a centavo: conta própria) |
| gastou 392 mil com consultoria em 2025 | 391.800,00 | 2025-12_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica 198.000,00 + linha seguinte (3.3.90.35.99) 193.800,00 · Liquidações até Mês (conta própria; = 2025-12_PCMGE065.pdf p.1, 3.3.90.35.00 Serviços de Consultoria da Câmara) |
| e 328 mil só até setembro de 2026 | 328.050,00 | 2026-09_CAMARA_PCMGE015.pdf | p.2 · 3.3.90.35.01 Assessoria e consultoria técnica ou jurídica 283.500,00 + 3.3.90.35.99 Outros serviços de consultoria 44.550,00 · Liquidações até Mês (conta própria) |
| a dívida parcelada com o INSS começou 2024 em 18 milhões e 100 | 18.078.834,49 | 2024_PCAGO012.pdf (Anexo XVI, Dívida Fundada Interna) | p.1 · Contribuições ao RGPS, débito parcelado: 2.000.000,00 (curto prazo) + 16.078.834,49 (longo prazo) · Saldo Anterior (conta própria) |
| fechou 2024 em 42 milhões e 600 | 42.554.954,36 | 2024_PCAGO012.pdf | p.1 · as mesmas duas linhas · Saldo Atual: 2.000.000,00 + 40.554.954,36 (conta própria; no ano entraram 26.011.581,52 de novo parcelamento) |
| e fechou 2025 em 45 milhões e 500 | 45.497.002,96 | 2025_PCAGO012.pdf (Anexo XVI) | p.1 · Contribuições ao RGPS, débito parcelado · Saldo Atual: 3.561.608,63 + 41.935.394,33 (conta própria). Dívida fundada total: 46.923.516,50 (fim de 2024) e 48.337.098,51 (fim de 2025), linha TOTAIS |
| (folha da Câmara 2024) recebeu 3.961.819,68 e devolveu 1.186.947,71 | 3.961.819,68 / 1.186.947,71 | 2024-12_CAMARA_PCMGE018.pdf | p.5 · 4.5.1.1.2.02.01 Repasses recebidos do Poder Executivo · p.4 · 3.5.1.1.2.09.00 Devolução de transferências recebidas |
| (folha da Câmara 2026) recebeu 3.717.864,72 e devolveu 486.615,00 até setembro | 3.717.864,72 / 486.615,00 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · 4.5.1.1.2.02.00 Repasse recebido · 3.5.1.1.2.09.00 Devolução de transferências |

## Receita por ano (folhas de receita)
- 2024 e 2025: PCMGE066 consolidado de dezembro (SIAFIC Fator), coluna "Arrecadado até Mês"; as deduções do Fundeb (grupo 9.7) entram na linha do imposto, que fica "já sem a parte do Fundeb". Total = TOTAL GERAL DA RECEITA ORÇAMENTÁRIA = Balanço. Script scripts/receita.py → saida/receita_AAAA.json.
- 2026: PCMGE016 da Prefeitura de set/2026 (SIGA), "Arrecadada até Mês" menos "Deduções até Mês" e "Anulada até Mês".

## Pendências no TCM
- PCMGE008 (comprovante de repasse à Câmara) de 12/2024 e 09/2026 só em imagem (não usados).
- O PCMGE066 consolidado de 09/2026 (SIGA) repete o valor do grupo-pai em algumas linhas de detalhe (ex.: 11130300, 17115100): não usado; a receita de 2026 saiu do PCMGE016 da Prefeitura.
