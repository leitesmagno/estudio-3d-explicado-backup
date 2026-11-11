# Plano: 046. orçamento de potiraguá (v1, aprovado no modo autônomo em 07/11/2026)

Molde: 035 Paratinga, pelo código mais novo do 040 Anagé (maquete redonda, cofre no centro, casinhas na ordem da fala). Código: `src/videos/orcamentopotiragua/OrcamentoPotiragua.tsx`. Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-potiragua/`.

## Narração
- `audio/narracao-norm.wav`: **175,96 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 14 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,05, -15 LUFS. `AUDIO_SEG = 175.96` · `QUADROS = 5306`.
- 479 palavras, iguais ao roteiro v2. Transcrição conferida frase por frase, nada pulado.
- Repetidas: "Gastou 63" 0,52 (gancho) e 41,84 → `quando('Gastou 63', 2)`. "Em 2025" (119,1 achado) e "Ja em 2025" (131,1). "Em 2026" 123,2 e 140,3. "assistencia social" 4 vezes (3 anos + festas).

## Mundo
- Mesa redonda (`MesaMaquete rio={false}`), cofre no centro. 14 casinhas na borda NA ORDEM DA FALA: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura e esporte (palco), Assistência social, Transporte (galpão), Agricultura (trator), Meio ambiente (árvores), Água e saneamento (estação, cinza: é da Embasa), Defesa civil (cinza), Proteção animal (cinza).
- Pilhas: 1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026. A pilha do ano nasce no "gastou" em volta do cofre e voa para a casinha na palavra do setor. Plaquinha em todo setor (até os de R$ 40 mil), com as dos anos anteriores juntas, cada uma na cor do ano.
- Torre vermelha "A MAIS" ao lado do cofre: 2024 R$ 2,4 mi; 2025 R$ 5,3 mi; 2026 R$ 3,5 mi.
- Zeros: câmera nas três casinhas cinza do fim (água/Embasa, defesa civil, proteção animal).
- "Agora repara" (obras): o cofre sai; no miolo, base "CONSTRUIR E REFORMAR" com 3 torres transparentes (reservado 3,9 / 3,0 / 6,1 mi; aqui 1 pilha = R$ 250 mil) e, em cada "Usou", a torre sólida da cor do ano (266 mil / 286 mil / 750 mil). Em "13 milhões no papel" plaquinha "R$ 13 MI NO PAPEL · R$ 1,3 MI USADOS".
- Terceirização: ao lado, base "APOIO ADMINISTRATIVO" com a torre verde de R$ 7,4 mi (2025) em "pagou 7 milhões" e a rosa de R$ 710 mil (2026) em "caiu para".
- Festas 2024: câmera volta à borda entre o palco e a assistência; plaquinhas "2024 · FESTAS R$ 2,7 MI" e "2024 · ASSISTÊNCIA R$ 2,3 MI"; famílias na porta da assistência.
- Tribunal: prédio do TCM e três pastas: "CONTAS DE 2024 · 10 DE 12 MESES" (carimbo FORA DO PRAZO), "CONCURSO 2024" (carimbo EM PROCESSO) e, em "Os dois, sem julgamento", os carimbos trocam para SEM JULGAMENTO; "BALANÇO 2025" (carimbo TOMADA DE CONTAS).
- Pergunta: mesa inteira, depois a base das obras com "?".
- Sem obra do Estado (nada achado em notícias de 2024 a 2026).

## Mapa de palavras-chave (tempo em s)
| palavra (`quando`) | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| (início) | 0 | mapa | voo Brasil → Potiraguá | mapa |
| 2024 A prefeitura | 7,50 | mapa | "2024" | mapa |
| arrecadou 53 | 9,22 | mapa | R$ 53,3 MI · ARRECADOU EM 2024 | mapa |
| Gastou 55 | 11,48 | cofre | pilha dourada nasce | 2024 cofre |
| 2 milhoes e 400 a mais | 13,76 | torre vermelha | R$ 2,4 MI A MAIS | 2024 cofre |
| Educacao … Meio ambiente | 15,84 … 36,70 | 11 casinhas | pilhas voam, plaquinha | 2024 setores |
| 2025 Arrecadou | 38,54 | — | sobe | 2025 |
| Gastou 63 (2ª) | 41,84 | cofre | pilha verde | 2025 |
| 5 milhoes e 300 a mais | 43,48 | torre vermelha | R$ 5,3 MI | 2025 |
| Educacao (2) … Meio ambiente (2) | 45,24 … 68,64 | casinhas | pilhas verdes | 2025 setores |
| 2026 ate setembro | 71,26 | — | sobe | 2026 |
| Ja gastou | 76,02 | cofre | pilha rosa | 2026 |
| 3 milhoes e 500 a mais | 77,96 | torre vermelha | R$ 3,5 MI | 2026 |
| Educacao (3) … Meio ambiente (3) | 79,86 … 99,28 | casinhas | pilhas rosa | 2026 setores |
| Agua e saneamento | 101,36 | estação cinza | EMBASA | zeros |
| Defesa civil tem | 105,08 | base cinza | R$ 0 | zeros |
| Protecao animal | 108,18 | casinha cinza | nem aparece | zeros |
| Agora repara | 109,42 | gavetas | cofre sai, base sobe | obras |
| reservou 3 milhoes e 900 / Usou 266 | 115,5 / 117,4 | gaveta 2024 | reservado / usado | obras |
| reservou 3 milhoes / Usou 286 | 120,3 / 121,4 | gaveta 2025 | idem | obras |
| reservou 6 / usou 750 | 124,3 / 126,6 | gaveta 2026 | idem | obras |
| Sao 13 milhoes | 128,2 | placa | 13 MI × 1,3 MI | obras |
| pagou 7 milhoes | 132,98 | torre verde | R$ 7,4 MI | terceirização |
| Mais de cinco vezes | 137,52 | — | comparação | terceirização |
| caiu para 710 | 141,8 | torre rosa | R$ 710 MIL | terceirização |
| as festas | 145,3 | palco + assistência | plaquinhas | festas |
| ajuda as familias | 151,28 | bonecos | famílias | festas |
| No Tribunal de Contas | 152,76 | TCM | prédio sobe | tribunal |
| fora do prazo | 156,2 | pasta 1 | FORA DO PRAZO | tribunal |
| O concurso publico | 158,42 | pasta 2 | EM PROCESSO | tribunal |
| sem julgamento | 162,02 | pastas 1-2 | SEM JULGAMENTO | tribunal |
| E o balanco de 2025 | 162,8 | pasta 3 | TOMADA DE CONTAS (em "tomada") | tribunal |
| Gastar nao | 168,36 | mesa | vista geral | pergunta |
| promete 13 | 169,94 | gavetas | "?" | pergunta |
| Segue o | 173,44 | — | @eumagnoleite | fim |

## Câmera (sempre no mesmo sentido)
Vista geral → cofre no "Gastou 55" → casinha por casinha (Educação → Meio ambiente) → sobe e volta ao cofre em 2025 → idem → 2026 → zeros (três casinhas do fim, em sequência) → de cima, mergulha no miolo: gaveta 2024 → 2025 → 2026 (esquerda → direita) → base do apoio administrativo (mais à direita) → sobe e mergulha entre palco e assistência → pastas do Tribunal (esquerda → direita) → mesa inteira → gaveta das obras → abre.
- Início das cenas: posição/alvo/distância vêm de `enquadrar()` como no 040 (VISTA_GERAL, COFRE, OLHA_SETOR, GAV_CAM).

## Interface
Pílula: POTIRAGUÁ · PARA ONDE FOI CADA REAL → 2024 → 2025 → 2026 · ATÉ SETEMBRO → OS ZEROS → AGORA REPARA → APOIO ADMINISTRATIVO → AS FESTAS → NO TRIBUNAL DE CONTAS → A PERGUNTA. Selos de fonte por bloco. Marca d'água @eumagnoleite quicando. Placar da escala no alto.

## Mapa (Kit Mapas)
Trecho A: Brasil → Potiraguá (IBGE 2925402), "PARA ONDE FOI CADA REAL?", "PREFEITURA DE POTIRAGUÁ", "TCM-BA". Trecho B: "2024", "R$ 53,3 MI", "ARRECADOU EM 2024". Até "Gastou 55" (11,48 s). Arquivo: `mapas/potiragua.mp4` (conferido: município certo).

## Sons
whoosh nas trocas de cena, tique na pílula, pop em cada setor, baque nos "a mais" e nos zeros, pop em cada "usou", subida no 7,4 mi, impacto nos carimbos, ding no fim.

## Arquivos
- Novos: `src/videos/orcamentopotiragua/OrcamentoPotiragua.tsx`, `palavras.ts`; `~/Kit-Mapas-Animados/src/videos/orcamento-potiragua/`.
- Alterados (só acréscimo): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas`, `src/pecas`.
