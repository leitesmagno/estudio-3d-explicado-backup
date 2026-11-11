# Plano: 085. orçamento de Ituberá (molde 092 Ubaitaba / 070 Valença)

Aprovado no modo autônomo (coordenador, 09/11/2026). Código: src/videos/orcamentoitubera/OrcamentoItubera.tsx.

## Mundo
- Abertura: Kit Mapas (src/videos/orcamento-itubera no Kit) voa do Brasil até Ituberá com as três receitas (132,4 · 138,7 · 113 até set) e, em 2024, "R$ 132,4 MI arrecadou" + "com empréstimo de R$ 7,4 mi". Termina em "Gastou 131" (20,4 s).
- Maquete redonda (MesaMaquete sem rio): cofre no meio, 11 casinhas na borda NA ORDEM DA FALA: Educação, Saúde, Administração, Obras/limpeza/iluminação, Câmara, Dívidas e encargos, Cultura e festas, Assistência social, Agricultura e pesca, Meio ambiente, Esporte.
- 1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026. Na palavra "gastou", a pilha do ano nasce em volta do cofre; a cada setor falado, as pilhas voam até a casinha. Torre verde "SOBROU" (2024), vermelha "A MAIS" (2025) e vermelha do comprometido além do arrecadado (2026).
- Câmera: um sentido só pela mesa; na virada de ano sobe ao cofre e recomeça.

## Achados (miolo, 1 pilha = R$ 250 mil; à direita, 1 pilha = R$ 2 mi)
- "Agora repara": torres das festas 2024 (2,4), 2025 (3,4), 2026 (4,0) ao lado das torres mínimas da ajuda às famílias (183, 122, 93 mil); plaquinha das bandas (2 mi em 2025).
- Agricultura 2026: torre branca (previsto) com "R$ 0" nas ações para produtor e pescador; meio ambiente: R$ 14 mil nas ações x R$ 204 mil de salários da secretaria.
- Pessoal 2025: plaquinha R$ 75,6 mi; torres de contratados (16,4) e Câmara (4,3).
- Tribunal: prédio do TCM e 4 pastas (festejos juninos 2026, advogados Fundef, transporte escolar, limpeza pública), carimbo "NO TCM-BA".
- Pergunta final: festas 2026 (R$ 4 mi) x ajuda às famílias 2026 (R$ 93 mil).

## Interface
- CabecalhoCidade "ITUBERÁ" (selo do @ que viaja), marca d'água quicando, chips no topo, selo da fonte, plaquinhas presas às torres, legenda.
- Folhas "PDF" (depois do render, tools/lista_pdf): 3 de receita (por ano) + 1 por setor e ano (33), soma = valor falado, faixa de pessoal/diárias; Câmara com duodécimo recebido e devolvido.

## Sons
whoosh nas cenas, pop em cada número, subida no "gastou", baque nas torres de falta e no zero, ding no "Segue o".

## Arquivos
Novos: src/videos/orcamentoitubera/{OrcamentoItubera.tsx,palavras.ts}; Kit: src/videos/orcamento-itubera/. Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentoparatinga, comum/CabecalhoCidade.
