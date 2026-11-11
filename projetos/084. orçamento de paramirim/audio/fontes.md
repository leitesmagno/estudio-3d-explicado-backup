# Fontes · 084 orçamento de Paramirim (BA)

Todos os documentos do e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), baixados em 09/11/2026 entre 11:30 e 11:52, salvos em ~/Documents/RECEITAS-DESPESAS-PARAMIRIM/documentos_tcm/ (PDF + .txt). e-TCM: município 290 PARAMIRIM, Prefeitura UJ 894, Câmara UJ 323 (o "Consórcio Desenv. Sustentável do Território Bacia do Paramirim", UJ 481, é outra entidade). Sem autarquias com prestação própria. Nome do município conferido dentro de cada PDF.
"Gastou" = LIQUIDADO (regra 32). Valores falados arredondados a 100 mil (ou a mil abaixo de 1 milhão).

## Receita (fala: só o total; folha: detalhe)
- 2024 arrecadou 116.179.505,36 → 2024-13_ANUAL_PCAGO015.pdf (Balanço Orçamentário 2024, "SUBTOTAL DAS RECEITAS (III)", coluna Realizadas) = 2024-12_PCMGE066.pdf (Totais até mês, depois das anulações) → fala, mapa, folha, legenda
- 2025 arrecadou 135.590.645,76 → 2025-13_ANUAL_PCAGO015.pdf (Balanço 2025, Receitas Realizadas) = 2025-12_PCMGE066.pdf (Totais até mês) → fala, mapa, folha, legenda
- 2026 até set arrecadou 121.781.515,27 → 2026-09_PCMGE066.pdf (Consolidado SIGA 09/2026, RESUMO "Totais: ... Total até Mês", arrecadada 122.806.932,94 menos anulada 1.025.417,67) → fala, mapa, folha, legenda
- Folhas de receita: tools/lista_pdf/lista_pdf.py receita sobre o PCMGE066 de cada ano (saida/receita_AAAA-MM_066.json); soma das linhas = total (diferença 0,00).
  - 2024: IPTU 152.936; ITBI 65.038; ISS 3.773.678; IR retido 3.202.253; FPM 31.641.313; ICMS 6.583.882; SUS União 21.019.668; Fundeb 29.692.889 (valores inteiros aqui; centavos no json)
  - 2025: FPM 35.276.134; SUS União 25.014.337; Fundeb 39.765.676
  - 2026 até set: FPM 28.196.761; SUS União 20.062.998; Fundeb 36.214.257

## Despesa (liquidado)
- 2024 gastou 115.102.440,33 → 2024-13_ANUAL_PCAGO015.pdf (Balanço 2024, SUBTOTAL DAS DESPESAS (XI), coluna Liquidadas); empenhado 115.259.019,26. Sobrou 1.077.065,03 (conta própria: 116.179.505,36 − 115.102.440,33).
- 2024 POR SETOR: o PCMGE015 e o PCMGE065 de 12/2024 enviados ao TCM têm só a página de capa (1 página, sem números). Os setores de 2024 vêm do Anexo 9 (2024-13_ANUAL_PCAGO007.pdf, Total Geral por função), que é EMPENHADO (soma 115.259.019,26; diferença para o liquidado: 156.578,93 de restos a pagar não processados, Balanço 2024 Anexo 1). Na fala, cada setor arredondado a 100 mil: a diferença não muda nenhum arredondamento acima de 1 milhão. Funções: 01 Câmara 1.987.076,34 · 02 Judiciária 1.333.662,22 · 04 Administração 5.059.281,13 · 06 Segurança 214.726,00 · 08 Assistência 1.865.821,94 · 09 Previdência 1.476.513,97 · 10 Saúde 32.646.754,78 · 12 Educação 45.088.887,22 · 13 Cultura 3.896.517,92 · 15 Urbanismo 17.272.277,70 · 17 Saneamento 288.565,79 · 18 Gestão ambiental 327.408,47 · 20 Agricultura 257.553,73 · 25 Energia 49.245,10 · 26 Transporte 25.750,00 · 27 Desporto 367.057,45 · 28 Encargos especiais 3.101.919,50.
- 2025 gastou 129.167.764,63 → 2025-13_ANUAL_PCAGO015.pdf (Liquidadas) = soma das ações do 2025-12_PCMGE065.pdf (consolidado com a Câmara; script acoes_cons.py, centavo a centavo). Sobraram 6.422.881,13 (conta própria).
- 2026 até set gastou 123.304.537,45 → soma das ações do 2026-09_PCMGE065.pdf (consolidado SIGA, coluna Liquidada até o mês) = PCMGE015 da Prefeitura 121.118.318,94 + Câmara 2.186.218,51. Empenhado 150.309.677,74. A mais: 1.523.022,18 (conta própria).
- Setores (agrupamento por função, scripts/setores.py): Administração = funções 04+02+03+06+99; Obras, limpeza e iluminação = 15+25+16+26+24; Dívidas e encargos = 28+09 (amortização da dívida, PASEP, INSS e FGTS); Cultura e festas = 13+23.
  - 2025: Educação 51.989.285,11 · Saúde 36.559.319,73 · Administração 8.570.128,10 · Obras 15.021.353,68 · Câmara 3.097.151,71 · Dívidas e encargos 5.412.485,90 · Cultura e festas 4.671.052,60 · Assistência 1.780.048,49 · Água e saneamento 143.816,37 · Agricultura 750.750,79 · Meio ambiente 751.048,96 · Esporte 421.323,19
  - 2026 até set: Educação 60.339.356,12 (inclui "Gestão dos recursos de Precatórios - FUNDEF" 10.197.373,43) · Saúde 30.849.520,58 · Administração 6.854.128,26 · Obras 10.183.012,80 · Câmara 2.186.218,51 · Dívidas e encargos 3.266.344,39 · Cultura e festas 5.827.666,01 · Assistência 1.460.955,07 · Água e saneamento 40.884,26 · Agricultura 601.842,88 · Meio ambiente 861.701,92 · Esporte 832.906,65

## Achados
- Festas: ação 2117 "Comemoração de Festividades" (2.2080.13.392.50.2.2117 em 2025; 2.2080.13.392.10.2.2117 em 2026) (Secretaria de Cultura): 2025 liquidado 3.776.139,37 (dotação atualizada 4.566.500,00) → 2025-12_PCMGE065.pdf; 2026 até set 3.604.265,00 (dotação 4.676.500,00) → 2026-09_PCMGE065.pdf → fala, plaquinha, legenda
- Benefícios eventuais: ação 2324 "Gestão de Benefícios Eventuais" (FMAS, 5.2090.8.244): 2025 liquidado 25.780,00 → 2025-12_PCMGE065.pdf; 2026 até set 10.976,40 → 2026-09_PCMGE065.pdf → fala, plaquinha, legenda
- Câmara 2024: Recebimento do Duodécimo 3.453.312,58; Despesas Orçamentárias 1.987.076,34; Devolução do Duodécimo 1.466.236,24 → 2024-13_CAMARA_PCAGE062.pdf (Demonstrativo do Fluxo Financeiro 2024) → fala, folha, legenda
- Câmara 2025: Recebimento do Duodécimo 3.927.779,51; Despesas Orçamentárias 3.097.151,71; Devolução do Duodécimo 830.627,80 → 2025-13_CAMARA_PCAGE062.pdf → fala, folha, legenda
- Câmara 2026 até set: liquidado 2.186.218,51 (2026-09_PCMGE065.pdf). O razão da Câmara (PCMGE018 09/2026) é PDF escaneado com leitura ruim: o duodécimo de 2026 NÃO entra no vídeo.
- Dívida com o INSS: "2.2.1.4.3.01.01.01 INSS - DÉBITO PARCELADO (P)" saldo anterior 70.860.007,51 → saldo atual 141.751.775,75 (inscrição 74.987.327,64) → 2025-13_ANUAL_PCAGO012.pdf (Anexo 16, Dívida Fundada Interna, dez/2025). Comparado com a receita de 2025 (135.590.645,76): conta própria. Total da dívida fundada interna: 84.977.477,26 → 155.283.425,30. → fala, plaquinha, legenda
  - Contexto (só conferência interna, não vai para o vídeo): em 2025 a Emenda Constitucional 136/2025 abriu parcelamento especial de débitos previdenciários dos municípios (até 300 parcelas). Busca 09/11/2026: nenhuma notícia específica de Paramirim.

## Tribunal (fala)
- TCM-BA › Decisões › Auditoria, município PARAMIRIM (https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/ → decisoes-detalhes, consulta 09/11/2026 11:53), lista "Denúncias" salva em ~/Documents/RECEITAS-DESPESAS-PARAMIRIM/decisoes/decisoes_auditoria.txt (30 processos). Citados: 12079E24 (supostas irregularidades na utilização dos recursos do Fundeb, 2024), 12857E24 (supostas irregularidades em contratações públicas, 2023 e 2024), 23130E26 (indícios de irregularidades nas contratações temporárias sem processo seletivo, 1º trimestre de 2026). Na fala: "denúncias" + "Denúncia não é condenação".

## Notícias (conferência interna, 09/11/2026)
- Busca "Paramirim Bahia prefeitura dívida INSS parcelamento 2025": nada específico de Paramirim.
- Busca "Paramirim BA prefeitura festas 2026 TCM denúncia": Correio (sem data visível) cita recomendação do MP-BA sobre cachê de São João em Paramirim; não usada no vídeo (fonte não oficial do guia e sem documento salvo). Nada contradiz os números do vídeo.
