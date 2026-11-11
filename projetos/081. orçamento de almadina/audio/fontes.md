# Fontes · 081 Almadina (BA)

Todos os documentos foram baixados do e-TCM (TCM-BA › Consulta Pública) em 09/11/2026, entre 04h35 e 05h00, e salvos em
`~/Documents/RECEITAS-DESPESAS-ALMADINA/documentos_tcm/` (PDF + .txt). Município no e-TCM: ALMADINA (9); Prefeitura UJ 613; Câmara UJ 43;
sem autarquias. Todos os PDFs conferidos pelo nome do município no cabeçalho (regra 41).
"Gastou" = despesa LIQUIDADA (regra 32). Conta feita por mim está marcada como "conta própria".

Avisos de documento:
- A prestação de 12/2025 da Prefeitura traz o PCMGE015 e o PCMGE016 com competência 11/2025 (enviados errado pelo município). Para dezembro de 2025
  usei os consolidados PCMGE065 (despesa) e PCMGE066 (receita) de dezembro/2025, que têm os números ação por ação (Fator/SIAFIC).
- O PCMGE015 de 12/2024 da Câmara é escaneado: lido na imagem (300 a 500 dpi). As linhas fecham com o total da Câmara no Anexo 9.
- 2025: o Balanço diz liquidado R$ 41.653.458,74; o PCMGE065 dez/2025 diz R$ 41.648.050,09 (diferença R$ 5.408,65, na Saúde: Anexo 9 empenhado
  R$ 10.082.222,98 x liquidado R$ 10.076.814,33). Fala usa "41 milhões e 650" (vale para os dois). Folhas por setor usam o PCMGE065.
- 2025: receita do Balanço R$ 38.926.680,77; PCMGE066 dez/2025 R$ 38.934.680,77 (diferença R$ 8.000,00). Fala: "38 milhões e 900" (Balanço).
  Folha de receita 2025 usa as linhas do PCMGE066 (total R$ 38.934.680,77).

## Totais (fala, tela, capa, legenda)
- R$ 34.443.510,07 → 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024), linha "SUBTOTAL DAS RECEITAS (III)", coluna Receitas Realizadas → fala "34 milhões e 400", mapa, chip, legenda.
- R$ 34.859.307,47 → 2024-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS DESPESAS (XI)", coluna Despesas Liquidadas → fala "34 milhões e 900", chip "R$ 34,9 MILHÕES".
- R$ 415.797,40 → conta própria (34.859.307,47 − 34.443.510,07) → fala "416 mil a mais".
- R$ 38.926.680,77 → 2025-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS RECEITAS (III)", Realizadas → fala "38 milhões e 900".
- R$ 41.653.458,74 → 2025-13_ANUAL_PCAGO015.pdf, "SUBTOTAL DAS DESPESAS (XI)", Liquidadas → fala "41 milhões e 650".
- R$ 2.726.777,97 → conta própria (41.653.458,74 − 38.926.680,77) → fala "2 milhões e 700 a mais".
- R$ 42.238.402,60 → 2026-09_PCMGE066.pdf (consolidado set/2026), "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA", Arrecadado até o mês (= PCMGE016 set/2026: 42.246.868,19 − anuladas 8.465,59) → fala "42 milhões e 200", "mais do que o ano inteiro de 2025".
- R$ 38.507.111,73 → 2026-09_PCMGE065.pdf, "TOTAL GERAL DA DESPESA ORÇAMENTÁRIA", Liquidado no ano → fala "38 milhões e 500".
- R$ 43.954.914,18 → 2026-09_PCMGE065.pdf, mesma linha, Empenhado no ano → fala "se comprometeu com 44 milhões".
- R$ 1.716.511,58 → conta própria (43.954.914,18 − 42.238.402,60) → só na torre vermelha "COMPROMETIDOS A MAIS" (sem número na fala).

## Setores (liquidado; soma das ações por função; scripts/setores.py → saida/setores.json; soma = total, diferença 0,00 em 2024 e 2026)
Classificação: Educação = função 12; Saúde = 10; Administração = 04, 06 e 14; Obras, limpeza e iluminação = 15, 16 e 25 (Sec. de Infraestrutura);
Câmara = função 01 / órgão 101; Dívidas = 28; Cultura e festas = 13 e 23; Assistência social = 08; Agricultura e meio ambiente = 20 e 18; Esporte = 27
(inclui, em 2024, a reforma de equipamentos esportivos da Sec. de Infraestrutura, R$ 245.922,57).
- 2024 (2024-12_PCMGE015.pdf da Prefeitura + Câmara pelo Anexo 9/PCMGE015 da Câmara): Educação 11.481.384,88 · Saúde 8.375.340,01 · Administração 5.615.737,06 · Obras 3.728.136,85 · Câmara 1.410.386,18 · Dívidas 1.568.681,12 · Assistência 1.466.384,49 · Cultura e festas 758.044,81 · Esporte 371.506,07 · Agricultura e meio ambiente 83.706,00 → fala, plaquinhas, folhas.
- 2025 (2025-12_PCMGE065.pdf, consolidado com Câmara e fundos): Educação 13.021.623,52 · Saúde 10.076.814,33 · Administração 7.113.455,28 · Obras 4.244.115,56 · Câmara 1.785.060,29 · Dívidas 1.838.678,88 · Assistência 1.907.452,29 · Cultura e festas 1.382.510,34 · Esporte 145.999,10 · Agricultura e meio ambiente 132.340,50.
- 2026 até set. (2026-09_PCMGE065.pdf): Educação 15.642.900,60 · Saúde 8.568.418,39 · Administração 4.386.477,69 · Obras 3.734.072,35 · Câmara 1.306.128,72 · Dívidas 745.662,70 · Cultura e festas 2.618.491,00 · Assistência 1.270.947,26 · Esporte 123.782,54 · Agricultura e meio ambiente 110.230,48.

## Achados (fala no fim, gavetas da maquete, capa, legenda)
- Festejos 2024: R$ 691.219,44 → 2024-12_PCMGE015.pdf, linha 1256, ação 2.3070.13.392.2.2.2019 "APOIO A REALIZACAO DOS FESTEJOS TRADICIONAIS E CALENDARIZADO", Total do Projeto/Atividade, liquidado até o mês → fala "691 mil".
- Festejos 2025: R$ 1.370.310,34 liquidado; dotação inicial R$ 702.400,00; dotação final R$ 1.423.085,34 → 2025-12_PCMGE065.pdf, linha 1129, ação 13.392.002.2.019 (mesmo nome) → fala "1 milhão e 370, quando o orçamento previa 702 mil".
- Festejos 2026 até set.: R$ 2.600.652,00 liquidado; dotação inicial (LOA) R$ 806.600,00; dotação atual R$ 3.015.203,00 → 2026-09_PCMGE065.pdf, linha 1211, ação 13.392.0010.2.019 "MANUTENÇÃO DOS FESTEJOS CULTURAIS, CÍVICOS E RELIGIOSOS" → fala "2 milhões e 600. A previsão da lei era 806 mil"; capa; pergunta final.
  (Outras ações de cultura, separadas das festas: 2025 "Desenvolvimento de atividades da cultura almadinense" R$ 12.200,00; 2026 "Promoção das atividades culturais e tradicionais" R$ 17.839,00. Não somadas na fala dos festejos.)
- Assistência social 2026 até set. (função 08 inteira): R$ 1.270.947,26 → 2026-09_PCMGE065.pdf → fala "1 milhão e 300"; "o dobro": 2.600.652,00 / 1.270.947,26 = 2,05 (conta própria).
- Agricultura 2026: ações "Apoio e incentivo da feira de agricultura familiar" (dot. 16.000), "Construção/recuperação de reservatórios de água (açudes)" (20.000), "Mecanização agrária e agrícola" (20.000), "Construção de mercados e feiras livres" (20.000), "Implementação de ações p/ desenvolvimento da agropecuária" (28.000): liquidado R$ 0,00 em todas → 2026-09_PCMGE065.pdf linhas 1051–1075. A secretaria liquidou R$ 99.402,00 (pessoal) e R$ 10.828,48 (manutenção) → fala "o dinheiro pagou a própria secretaria: as ações de feira, açudes e máquinas gastaram zero". Gaveta: R$ 104 mil previstos (conta própria: soma das dotações atuais) em branco.
- Casas populares (ação "Construção, ampliação e reforma de unidades habitacionais"): 2024 dot. inicial 147.000,00, liquidado 0,00 (2024-12_PCMGE015.pdf linha 1741); 2025 dot. inicial 174.000,00, liquidado 0,00 (2025-12_PCMGE065.pdf linha 887); 2026 dot. inicial 146.000,00, liquidado 2.400,00 (2026-09_PCMGE065.pdf linha 965) → fala "zero em 2024 e 2025, e 2 mil e 400 este ano".
- Salários e encargos 2025 (todos os elementos 3.1.x, Prefeitura + fundos + Câmara): R$ 23.621.945,92 → soma própria dos elementos do 2025-12_PCMGE065.pdf → fala "23 milhões e 600".
- Diárias 2025 (elementos 3.3.90.14.x): R$ 417.155,00 (Prefeitura 224.305,00; Fundo de Saúde 124.520,00; Câmara 40.000,00; Fundo de Assistência 28.330,00) → 2025-12_PCMGE065.pdf → fala "417 mil".
- Agricultura e meio ambiente + Esporte 2025: 132.340,50 + 145.999,10 = R$ 278.339,60 (conta própria) → "mais do que agricultura e esporte juntos".
- Benefícios eventuais 2025: liquidado R$ 38.064,00; dotação inicial R$ 189.000,00 (dotação final 58.553,89) → 2025-12_PCMGE065.pdf linha 1934, ação 08.244.005.2.062 "CONCESSAO DE BENEFICIOS EVENTUAIS" → fala "38 mil, de 189 mil previstos".

## Câmara (folhas)
- 2024: recebeu duodécimo R$ 1.467.421,29; devolveu R$ 57.035,11; despesas orçamentárias R$ 1.410.386,18 → 2024-13_CAMARA_PCAGE062.pdf (Demonstrativo do Fluxo Financeiro). Grupos (lidos na imagem do 2024-12_CAMARA_PCMGE015.pdf): vencimentos 707.816,69; INSS 112.290,56 (ação 2000: 820.107,25); diárias 5.000,00; material e combustível 62.138,71; consultorias 187.400,00; pessoa física 3.950,00; empresas 86.722,72; obras (material) 115.267,50; equipamentos 129.800,00 (ação 2001: 590.278,93).
- 2025: recebeu R$ 1.794.285,36 (conta 4.5.1.1.2.02 Repasse recebido) e devolveu R$ 14.102,78 (4.5.1.1.2.09) → 2025-12_CAMARA_PCMGE018.pdf linhas 480–481; despesas R$ 1.785.060,29 (2025-13_CAMARA_PCAGE062.pdf e 2025-12_CAMARA_PCMGE015.pdf "Total do Poder"). O PCAGE062 de 2025 mostra "Recebimento de Duodécimo 0,00" (lançado como saldo); usei o razão.
- 2026 até set.: repasse recebido R$ 1.396.373,03 → 2026-09_CAMARA_PCMGE018.pdf linha 459; liquidado R$ 1.306.128,72 (PCMGE065 set/2026, órgão 101).

## Receita por item (folhas, sem fala)
saida/receita_2024-12_PCMGE016.json, receita_2025-12_PCMGE066.json, receita_2026-09_PCMGE066.json (tools/lista_pdf/lista_pdf.py receita); soma das linhas = total, diferença 0,00.

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, município ALMADINA, consulta 09/11/2026 04:53; texto salvo em documentos_tcm/decisoes/TCM_auditoria_ALMADINA_2026-11-09.txt)
- 119 processos listados; com exercício de referência 2024 a 2026: 3 → 08415E24 (Prefeitura, Pregão Eletrônico 001/2024), 09845E24 (Prefeitura, Pregão Eletrônico 002/2024), 06948E25 (Câmara, transparência pública, ref. 2025) → fala "três processos sobre 2024 e 2025. Dois tratam de pregões da prefeitura em 2024. O outro, de transparência na Câmara. Estar no tribunal não é condenação." A página não mostra decisão. Nomes de gestores fora do vídeo.

## Notícias (só conferência interna, regra 25)
- Busca em 09/11/2026 ("Almadina Bahia festa 2026"): nenhuma notícia recente específica de Almadina. Nenhum fato do vídeo vem de notícia.

## 2ª conferência (09/11/2026 ~05h35, antes do vídeo final)
- Busca literal de cada valor da fala/tela no texto dos PDFs: 22 de 22 encontrados no arquivo citado (totais dos Balanços, PCMGE066/065 set/2026, festejos 2024/2025/2026 e previstos, benefícios eventuais, casas populares, duodécimos e devoluções da Câmara, Câmara 2024 no Anexo 9). Educação 2024 (11.481.384,88), Saúde 2024 (8.375.340,01) e Educação 2025 (13.021.623,52) também batem com o Anexo 9. Nenhuma correção.
