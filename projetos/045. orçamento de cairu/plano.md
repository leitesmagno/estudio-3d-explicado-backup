# Plano: 045. orçamento de cairu (v1, aprovado no modo autônomo em 07/11/2026)

Molde: 035 Paratinga, pelo código mais novo do 046 Potiraguá (maquete redonda, cofre no centro, casinhas na ordem da fala). Código: `src/videos/orcamentocairu/OrcamentoCairu.tsx`. Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-cairu/`.

## Narração
- `audio/narracao-norm.wav`: **176,09 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 13 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,161, -15 LUFS. `AUDIO_SEG = 176.09` · `QUADROS = 5310`.
- 505 palavras, iguais ao roteiro v2. Transcrição conferida frase a frase, nada pulado.
- Repetidas: "gastou" 2,02 (gancho "Cairu... gastou 183") / "Gastou 164" 13,74 / "Gastou 183" 47,32 (usar `quando('Gastou 183', 2)`, a 1ª é o gancho) / "Já gastou" 80,54. "Educação," 18,24 / 50,32 / 85,56. "Esporte," 41,38 / 72,48 / 107,21 e "Esporte zerado" 114,00. "TUPA" 124,84 / 132,86 / 154,72. "assistência" 4 vezes (3 anos + 147,14 + 151,94). "2024" e "2026" também no achado (144,86; 149,16; 150,20).

## Mundo
- Mesa redonda (`MesaMaquete rio={false}`), cofre no centro. 15 casinhas na borda NA ORDEM DA FALA: Educação (escola), Saúde (posto), Administração (prefeitura), Limpeza e saneamento (rua com caminhão de lixo e gari), Obras e serviços urbanos (galpão "OBRAS"), Turismo e eventos (palco "TURISMO E EVENTOS"), Câmara, Dívidas (banco), Cultura (colunas "CULTURA"), Assistência social, Agricultura e pesca (trator "AGRICULTURA E PESCA"), Esporte (quadra), Meio ambiente (árvores), Defesa civil (base), Proteção animal (casinha cinza "ANIMAIS").
- Pilhas: 1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026. A pilha do ano nasce no "gastou" em volta do cofre (anel com 4 voltas, cabe até 134 pilhas; 2025 usa 97) e voa para a casinha na palavra do setor. Plaquinha em todo setor (até os de R$ 15 mil), com as dos anos anteriores juntas, cada uma na cor do ano.
- 2024 e 2025 SOBRARAM (3,6 e 3,9 mi): plaquinha verde-clara "SOBRARAM" ao lado do cofre, sem torre vermelha. 2026: torre vermelha "R$ 18,5 MI A MAIS" ao lado do cofre.
- Zeros (fim da lista): câmera passa pela quadra (esporte zerado, "quadras de escola saíram pela educação", plaquinhas 2024 R$ 2,2 MI e 2025 R$ 1,1 MI na escola, cor do ano), pela defesa civil (plaquinha 2025 R$ 620 MIL) e pela casinha cinza dos animais.
- "Agora repara" (TUPA): o cofre e as pilhas do miolo saem; no miolo sobe um pórtico "TUPA · R$ 70" com turistas (bonecos) passando por baixo. Duas gavetas: à esquerda "TUPA, SEGUNDO A PREFEITURA" com torre transparente de R$ 7,7 mi (jan–abr/2026) e à direita "NAS CONTAS: OUTROS SERVIÇOS" com torre rosa de R$ 7,1 mi. Aqui 1 pilha = R$ 250 mil. Em "não existe linha com o nome TUPA", carimbo "SEM LINHA COM ESSE NOME" na gaveta da esquerda.
- "Para onde vai?": segunda base no miolo, "2024", com três torres (1 pilha = R$ 500 mil): LIMPEZA R$ 13,3 MI (dourada) sobe em "lixo"/"13 milhões e 300"; ASSISTÊNCIA R$ 3,1 MI em "toda a assistência"; EVENTOS R$ 3,3 MI em "E os eventos". Em "2026": torres rosa EVENTOS R$ 3,2 MI e ASSISTÊNCIA R$ 2,7 MI ao lado.
- Tribunal: prédio do TCM e três pastas: "TUPA · DENÚNCIA" (carimbo SEM JULGAMENTO), "ESCRITÓRIO · ATÉ R$ 8,76 MI" (carimbo PAGAMENTOS SUSPENSOS), "EMPRÉSTIMO R$ 21 MI" (carimbo MP INVESTIGA; fora do tribunal, por isso o selo diz "MINISTÉRIO PÚBLICO").
- Pergunta: mesa inteira, depois o pórtico da TUPA com "?".
- Sem obra do Estado no vídeo (acessos, UBS e píer são do Estado ou parceria: não entram).

## Mapa de palavras-chave (tempo em s)
| palavra (`quando`) | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| (início) | 0 | mapa | voo Brasil → Cairu (arquipélago), "MORRO DE SÃO PAULO" | mapa |
| 2024 A prefeitura | 9,42 | mapa | "2024" | mapa |
| arrecadou 167 | 11,14 | mapa | R$ 167,9 MI · ARRECADOU EM 2024 | mapa |
| Gastou 164 | 13,74 | cofre | pilha dourada nasce | 2024 cofre |
| Sobraram 3 milhões e 600 | 16,14 | plaquinha | SOBRARAM R$ 3,6 MI | 2024 cofre |
| Educação … Meio ambiente | 18,24 … 42,64 | 13 casinhas | pilhas voam, plaquinha | 2024 setores |
| 2025 Arrecadou | 44,42 | — | sobe | 2025 |
| Gastou 183 (2ª) | 47,32 | cofre | pilha verde | 2025 |
| Sobraram 3 milhões e 900 | 48,90 | plaquinha | SOBRARAM R$ 3,9 MI | 2025 |
| Educação (2) … Meio ambiente (2) | 50,32 … 73,78 | casinhas | pilhas verdes | 2025 setores |
| 2026 até setembro | 76,30 | — | sobe | 2026 |
| Já gastou | 80,54 | cofre | pilha rosa | 2026 |
| 18 milhões e meio a mais | 82,66 | torre vermelha | R$ 18,5 MI A MAIS | 2026 |
| De onde vai sair | 83,80 | — | "?" | 2026 |
| Educação (3) … Meio ambiente (3) | 85,56 … 110,06 | casinhas | pilhas rosa | 2026 setores |
| Esporte zerado | 114,00 | quadra | 2024 e 2025: R$ 0 | zeros |
| as quadras de escola | 115,84 | escola | QUADRAS DE ESCOLA 2,2 / 1,1 MI | zeros |
| Defesa civil | 117,70 | base | 2025 R$ 620 MIL | zeros |
| Proteção animal | 120,72 | casinha cinza | nem aparece | zeros |
| Agora repara | 122,38 | pórtico | cofre sai, pórtico sobe | TUPA |
| Quem entra | 123,30 | turistas | passam pelo pórtico | TUPA |
| rendeu 7 | 128,94 | gaveta esq. | R$ 7,7 MI (transparente) | TUPA |
| com o nome TUPA | 132,46 | gaveta esq. | carimbo SEM LINHA COM ESSE NOME | TUPA |
| outros serviços | 134,82 | gaveta dir. | R$ 7,1 MI (rosa) | TUPA |
| Para onde vai | 137,84 | base 2024 | sobe | limpeza |
| pagou o lixo | 140,60 | torre limpeza | sobe | limpeza |
| 13 milhões e 300 | 143,62 | torre limpeza | R$ 13,3 MI | limpeza |
| toda a assistência | 146,72 | torre assistência | R$ 3,1 MI | limpeza |
| E os eventos | 148,12 | torre eventos 2024 | R$ 3,3 MI | eventos |
| em 2026 | 150,12 | torres rosa | eventos 3,2 × assistência 2,7 | eventos |
| No Tribunal de Contas | 152,56 | TCM | prédio sobe | tribunal |
| uma denúncia | 153,56 | pasta 1 | TUPA · DENÚNCIA | tribunal |
| espera julgamento | 156,90 | pasta 1 | SEM JULGAMENTO | tribunal |
| mandou suspender | 158,30 | pasta 2 | ESCRITÓRIO | tribunal |
| podiam chegar | 162,36 | pasta 2 | PAGAMENTOS SUSPENSOS | tribunal |
| Ministério Público | 165,02 | pasta 3 | MP INVESTIGA | tribunal |
| Gastar não | 168,56 | mesa | vista geral | pergunta |
| se o turista paga | 169,90 | pórtico | "?" | pergunta |
| Segue o | 173,68 | — | @eumagnoleite | fim |

## Câmera (sempre no mesmo sentido)
Vista geral → cofre no "Gastou 164" → casinha por casinha (Educação → Meio ambiente) → sobe e volta ao cofre em 2025 → idem → 2026 → zeros (quadra/escola, defesa civil, animais) → de cima, mergulha no miolo: pórtico → gaveta da prefeitura (esquerda) → gaveta das contas (direita) → base 2024 (limpeza, assistência, eventos; da esquerda para a direita) → pastas do Tribunal (esquerda → direita) → mesa inteira → pórtico → abre. Na volta da quadra à escola (zeros), plano aberto de cima, sem vai e volta perto.

## Interface
Pílula: CAIRU · MORRO DE SÃO PAULO → 2024 → 2025 → 2026 · ATÉ SETEMBRO → OS ZEROS → AGORA REPARA: A TUPA → PARA ONDE VAI → NO TRIBUNAL DE CONTAS → A PERGUNTA. Selos de fonte por bloco. Marca d'água @eumagnoleite quicando. Placar da escala no alto.

## Mapa (Kit Mapas)
Trecho único: Brasil → Bahia → Cairu (IBGE 2905909), rótulos "CAIRU", "MORRO DE SÃO PAULO", "PREFEITURA DE CAIRU", "TCM-BA"; depois "2024", "R$ 167,9 MI", "ARRECADOU EM 2024". Até "Gastou 164" (13,74 s). Arquivo: `mapas/cairu.mp4` (conferir: município certo).

## Sons
whoosh nas trocas de cena, tique na pílula, pop em cada setor, subida em cada "gastou", baque no "a mais" de 2026 e nos zeros, pop nas torres da TUPA, impacto no carimbo "SEM LINHA", subida na torre da limpeza, impacto nos carimbos do Tribunal, ding no fim.

## Arquivos
- Novos: `src/videos/orcamentocairu/OrcamentoCairu.tsx`, `palavras.ts`; `~/Kit-Mapas-Animados/src/videos/orcamento-cairu/`.
- Alterados (só acréscimo): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas`, `src/pecas` (Portico, Boneco).
