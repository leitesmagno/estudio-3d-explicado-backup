# Fontes do 097. orçamento de buerarema (BA)

Consulta: 10/11/2026 (downloads no e-TCM entre 23:58 de 09/11 e 00:22 de 10/11, pelo recebedor 127.0.0.1:8778, pasta BUERAREMA). Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-BUERAREMA/documentos_tcm/` (todos com o nome do município conferido no cabeçalho).
e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam): município 56 (BUERAREMA) · Prefeitura UJ 661 · Câmara UJ 91 (sem autarquia com prestação própria). Último mês entregue de 2026: 09/2026 (Prefeitura e Câmara).
"Gastou" = despesa LIQUIDADA (regra 32). Receita = total declarado ao TCM (Balanço / PCMGE066), já sem a parte que vai para o Fundeb e sem as anulações, como o documento traz.
O PCMGE065 (demonstrativo consolidado da despesa, sistema Fator, "Modelo 01") traz Câmara + Prefeitura + fundos e fecha centavo a centavo com o Balanço Orçamentário em 2024 e 2025.
Conferido 2 vezes: 1ª depois do roteiro (10/11/2026 ~01:30); 2ª antes do vídeo final (ver fim do arquivo).

## Totais (fala, tela, capa, legenda)
| Valor dito | Valor exato | Arquivo (documentos_tcm) | Página · linha · coluna |
|---|---|---|---|
| arrecadou 77 mi em 2024 | 77.028.398,51 | 2024_PCAGO015.pdf (Anexo 12, Balanço Orçamentário 2024) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas |
| gastou 79,9 mi em 2024 | 79.909.447,50 | 2024_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; igual ao TOTAL GERAL do 2024-12_PCMGE065.pdf (p.29, coluna Liquidado até o mês) |
| 2,9 mi a mais em 2024 | 2.881.048,99 | conta própria | 79.909.447,50 − 77.028.398,51 |
| arrecadou 85 mi em 2025 | 84.966.122,49 | 2025_PCAGO015.pdf (Balanço 2025) | p.1 · SUBTOTAL DAS RECEITAS (III) · Receitas Realizadas; igual ao 2025-12_PCMGE016 (p.7, TOTAL 86.532.683,12 − anuladas 1.566.560,63) |
| gastou 82,6 mi em 2025 | 82.564.590,27 | 2025_PCAGO015.pdf | p.2 · SUBTOTAL DAS DESPESAS (XI) · Despesas Liquidadas; igual ao TOTAL GERAL do 2025-12_PCMGE065.pdf |
| sobraram 2,4 mi em 2025 | 2.401.532,22 | conta própria | 84.966.122,49 − 82.564.590,27 |
| arrecadou 68,5 mi até set/2026 | 68.481.065,24 | 2026-09_PCMGE066.pdf (consolidado) | p.8 · TOTAL GERAL DA RECEITA ORÇAMENTÁRIA · Arrecadado até Mês; igual ao 2026-09_PCMGE016.pdf p.7 "Totais" (68.553.539,72 − 72.474,48 anuladas) |
| já gastou 64,7 mi até set/2026 | 64.719.084,50 | 2026-09_PCMGE065.pdf (consolidado) | p.29 · TOTAL GERAL DA DESPESA ORÇAMENTÁRIA · Liquidado até o mês (8ª coluna) |
| já comprometeu 70,7 mi | 70.703.501,22 | 2026-09_PCMGE065.pdf | p.29 · mesma linha · Empenhado até o mês (6ª coluna) |

## Setores (soma = total do ano, diferença 0,00) · scripts/setores.py → saida/setores.json
Setor = unidade orçamentária do PCMGE065 consolidado (coluna Liquidado até o mês). Dívidas = ação 2.034 "Administração da dívida pública" (Sec. de Finanças); Esporte = ações 2.049 "Manutenção das ações do esporte e lazer" e 2.093 "Calendário esportivo"; Administração = Gabinete, Administração, Finanças (sem a dívida) e Planejamento.
Arquivos: 2024-12_PCMGE065.pdf (76 ações) · 2025-12_PCMGE065.pdf (77 ações) · 2026-09_PCMGE065.pdf (76 ações).

| Setor (dito) | 2024 | 2025 | 2026 até set | Páginas no PCMGE065 |
|---|---|---|---|---|
| Educação (28,7 · 30,2 · 24,7 mi) | 28.742.886,82 | 30.221.305,93 | 24.651.230,15 | p.16 a 21 (Sec. de Educação, Fundo de Educação, transporte escolar) |
| Saúde (19,4 · 19,3 · 16,2 mi) | 19.400.415,47 | 19.339.378,07 | 16.177.108,24 | p.12 a 16 (Sec. de Saúde e Fundo Municipal de Saúde) |
| Administração (8,2 · 9,5 · 7,5 mi) | 8.229.752,61 | 9.475.111,53 | 7.451.231,08 | p.2 a 5 e 9 |
| Obras e serviços urbanos (8,3 · 7,4 · 6,1 mi) | 8.326.406,27 | 7.443.250,73 | 6.097.384,16 | p.5 a 8 (Sec. de Infraestrutura) |
| Câmara de Vereadores (3 · 3,4 · 2,8 mi) | 2.981.907,14 | 3.407.762,00 | 2.830.850,46 | p.1; igual ao "Total do Órgão" do PCMGE015 da Câmara (2024 p.3, 2025 p.4, 2026 p.3) |
| Dívidas (5,1 · 4,8 · 1,5 mi) | 5.082.758,06 | 4.761.346,44 | 1.473.559,30 | p.5, ação 4.843.0007.2.034 |
| Cultura e festas (4,4 · 5,7 · 3,7 mi) | 4.404.507,34 | 5.707.363,36 | 3.693.268,27 | p.10 a 12 (Sec. da Cultura, Turismo, Esporte e Lazer, sem as ações de esporte) |
| Assistência social (2,5 · 1,9 · 2,1 mi) | 2.503.935,11 | 1.904.979,34 | 2.131.410,66 | p.21 a 27 (Sec. e Fundo de Assistência Social, Fundo da Criança) |
| Agricultura e meio ambiente (237 · 304 · 213 mil) | 236.878,68 | 304.092,87 | 213.042,18 | p.8 e 10 |
| Esporte (zero) | 0,00 | 0,00 | 0,00 | p.11 · previsto (dotação atual): 2024 0,00 · 2025 16.764,31 · 2026 80.287,81 (76.787,81 + 3.500,00) |

## Achados (fim do vídeo)
| Valor dito | Valor exato | Arquivo | Página · linha |
|---|---|---|---|
| festas populares 3,2 mi em 2024 | 3.199.586,17 | 2024-12_PCMGE065.pdf | p.11 · ação 12.365.0002.2.046 "Manutenção das ações de cultura e festas populares" · total da ação, Liquidado (elemento 3.3.90.39 serviços de pessoa jurídica, fonte 1500) |
| festas 4,6 mi em 2025 | 4.556.570,57 | 2025-12_PCMGE065.pdf | p.11 · mesma ação (3.3.90.39 = 4.437.654,87; 3.3.90.36 = 57.433,00; 3.3.90.30 = 61.482,70) |
| festas 3,4 mi até set/2026 | 3.373.274,54 | 2026-09_PCMGE065.pdf | p.11 · mesma ação (3.3.90.39 = 3.291.474,54; 3.3.90.36 = 81.800,00) |
| agricultura e meio ambiente 237 / 304 / 213 mil | 236.878,68 · 304.092,87 · 213.042,18 | PCMGE065 dez/2024, dez/2025, set/2026 | p.8 (2.024 Sec. de Agricultura) + p.10 (2.037 Sec. do Meio Ambiente) |
| esporte, nada em três anos | 0,00 · 0,00 · 0,00 | idem | p.11 · ações 2.049 e 2.093, Liquidado |
| festas registradas na função Educação, parte de educação infantil | código 12.365 | PCMGE065 dos três anos, p.11 | o código da ação começa com 12 (função Educação) e 365 (subfunção Educação Infantil); a ação 2.045 da mesma secretaria está em 12.361 (Ensino Fundamental). Fato do documento, sem juízo |
| Câmara 3,4 mi em 2025, mais de 11 vezes agricultura e meio ambiente | 3.407.762,00 ÷ 304.092,87 = 11,2 | setores 2025 | conta própria |
| deve 85 mi | 85.030.493,37 | 2025_PCAGO012.pdf (Anexo 16, dívida fundada) | p.1 · linha TOTAIS · Saldo Atual |
| 77 mi do INSS | 77.002.939,19 | 2025_PCAGO012.pdf | p.1 · INSS débito parcelado 71.983.270,04 + Dívida parcelamento INSS 5.000.000,00 + Contribuições ao RGPS 19.669,15 (conta própria) |
| praticamente tudo o que arrecadou em 2025 | 85.030.493,37 x 84.966.122,49 | Anexo 16 e Balanço 2025 | comparação |
| 2026: Natal sem Fome, segurança alimentar, habitação e proteção à criança previam 1,2 mi; gasto até setembro zero | 1.246.098,63 | 2026-09_PCMGE065.pdf | p.22 ação 1.022 Campanha Natal sem Fome, dotação atual 198.243,00 · p.23 ação 2.057 Segurança alimentar, 322.000,45 · p.24 ação 2.062 Habitação de interesse social, 403.492,11 · p.27 ação 14.243.0003.2.033 Proteção, atendimento e orientação à criança e ao adolescente (Fundo da Criança), 322.363,07. Nas quatro: empenhado 0,00, liquidado 0,00, pago 0,00 (linha TOTAL DA AÇÃO/PROJETO). Soma: conta própria |
| (fora do vídeo) caminhão da agricultura | 748.617,00 previsto · 700.000,00 empenhado · 0,00 liquidado | 2026-09_PCMGE065.pdf p.8, ação 1.026 | estava no roteiro v1; tirado na 2ª conferência porque já tem R$ 700 mil EMPENHADOS (compra comprometida): dizer "gasto zero" ao lado dele induziria a erro |

## Câmara (folhas)
| Valor | Arquivo | Página · linha |
|---|---|---|
| recebeu da prefeitura 2.982.132,75 em 2024 | 2024-12_CAMARA_PCMGE018.pdf (razão) | p.7 · 4.5.1.1.2.02.00 REPASSE RECEBIDO · Creditado até o mês |
| sobrou 225,61 em 2024 | conta própria | 2.982.132,75 − 2.981.907,14 (liquidado) |
| recebeu 3.423.866,97 em 2025 | 2025-12_CAMARA_PCMGE018.pdf | p.8 · REPASSE RECEBIDO · Creditado até o mês |
| devolveu 16.118,97 em 2025 | 2025-12_CAMARA_PCMGE018.pdf | p.7 · 3.5.1.1.2.09.00 DEVOLUÇÃO DE TRANSFERÊNCIAS · Debitado até o mês |
| recebeu 2.818.603,71 até set/2026 | 2026-09_CAMARA_PCMGE018.pdf | p.7 · REPASSE RECEBIDO · Creditado até o mês |
| comprovantes de repasse mensal | 2024-12/2025-12/2026-09_PCMGE008.pdf (Prefeitura) | 1 página cada |

## Receita (folhas, sem fala) · scripts/receita2.py → saida/receita_AAAA.json
2024 e 2025: 2024_PCAGO008.pdf e 2025_PCAGO008.pdf (Anexo 10, coluna "Arrecadado Ano"; deduções do Fundeb 9.7.x somadas à linha do imposto: FPM, ITR, ICMS, IPVA). 2026: 2026-09_PCMGE016.pdf (SIGA, "Arrecadada até Mês" + "Anulada até Mês", já sem a parte do Fundeb). Cada linha soma os códigos listados em saida/receita_AAAA.json ("codigos"); "Outras receitas" fecha o total (diferença 0,00).
- 2025 (exemplo): FPM 33.833.159,19 (1.7.1.1.51, p.3, menos a dedução 9.7.1.1.51 de 7.328.889,63); Fundeb (retorno) 13.441.009,40 (1.7.5); SUS União e Estado 11.895.529,94 (1.7.1.3 + 1.7.2.3); complementação da União ao Fundeb 8.945.751,46 (1.7.1.5); ICMS 5.460.874,84; IPTU 313.728,78; ISS 1.843.691,85.

## Pessoal (faixa das folhas)
Elementos 3.1.90.04/11/13/16, 3.1.91.13, 3.1.90.94 somados por setor (scripts/pessoal.py → saida/pessoal_setor.json). Total com a Câmara: 2024 38.373.822,74 · 2025 42.608.565,66 · 2026 até set 34.906.499,07 (não dito na fala).

## Notícias
Não usadas no vídeo. Nenhuma obra ou serviço é citado como feito ou não feito.

## Não conferido
- Decisões do TCM (www.tcm.ba.gov.br › Decisões): a busca pede verificação (captcha), que fica com o Magno. O vídeo não cita processo do Tribunal.
- 2024-12_PCMGE066.pdf veio com o conteúdo da DESPESA (mesmo do PCMGE065); a receita de 2024 usa o Anexo 10 e o Balanço. 2024-12_PCMGE018.pdf (razão da Prefeitura) veio com 1 página sem texto. Nenhum dos dois é usado.

## 2ª conferência (antes do vídeo final, 10/11/2026 ~02:30)
- Totais: relidos no PDF (Balanço 2024 p.1/p.2, Balanço 2025 p.1/p.2, PCMGE066 set/2026 p.8, PCMGE065 set/2026 p.29): iguais.
- Setores: conferidos por outro caminho no Anexo 9 de 2025 (2025_PCAGO007.pdf, empenhado por função): Legislativa 3.407.762,00 = Câmara; Assistência Social 1.904.979,34 = setor; Agricultura 216.010,11 = ação 2.024; Saúde 19.345.238,10 empenhado x 19.339.378,07 liquidado; Educação (função 12) 35.816.614,15 = Educação 30,22 mi + Cultura 5,59 mi (a cultura está na função 12), diferenças só entre empenhado e liquidado. Câmara dos três anos = "Total do Órgão" do PCMGE015 da própria Câmara.
- Festas (ação 2.046) e esporte (2.049/2.093): linha TOTAL DA AÇÃO relida nos três PCMGE065 (p.11): iguais.
- 2026 sem gasto: relidas as linhas TOTAL das ações 1.022, 2.057, 2.062 e 2.033 (empenhado, liquidado e pago 0,00). CORREÇÃO: o caminhão da agricultura (ação 1.026) tinha liquidado 0,00 mas 700.000,00 EMPENHADOS; foi trocado no roteiro pela proteção à criança (2.033) e a voz do parágrafo foi refeita (roteiro v1 guardado em "roteiro-falado (versão 1).txt").
- Dívida: Anexo 16 de 2025 relido (TOTAIS 85.030.493,37; INSS 71.983.270,04 + 5.000.000,00 + 19.669,15).
- Câmara (folhas): razão PCMGE018 dos três anos relido (repasse recebido e devolução).
