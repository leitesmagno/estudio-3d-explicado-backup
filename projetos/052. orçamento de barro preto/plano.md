# Plano · 052. orçamento de Barro Preto

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`) em 08/11/2026. Molde: 035 Paratinga, pelo código do 042 Camacan.

- `audio/narracao-norm.wav`: **176,25 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 12 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,065, -15 LUFS. `AUDIO_SEG = 176.25` · `QUADROS = 5315`.
- Sincronia: 464 palavras do roteiro, última em 175,84 s (um "mil" repetido pelo Whisper em 30,0 s foi tirado do palavras.json antes de alinhar; a voz está certa).
- Código: `src/videos/orcamentobarropreto/OrcamentoBarroPreto.tsx` (composições `OrcamentoBarroPreto`, `OrcamentoBarroPretoGuia`, `OrcamentoBarroPretoLimpo`, `CapaOrcamentoBarroPreto`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-barro-preto` (IBGE 2903300) → `mapas/barropreto.mp4` (12,4 s).

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano, a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam do cofre para a casinha do setor. **1 pilha = R$ 1 mi** (cidade pequena, orçamento de R$ 50 a 58 mi). 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras de rua e iluminação, Câmara, Dívidas, Cultura (palco), Assistência social, Água e saneamento, Agricultura (cinza, "R$ 0 EM PROGRAMAS"), Esporte (campo), Meio ambiente (árvores). Câmera anda sempre no mesmo sentido; na virada de ano sobe ao cofre e recomeça. Na frente do cofre: torre vermelha "R$ 1 MI A MAIS" (2024), torre branca transparente "R$ 3,6 MI SOBRARAM · CONTANDO O EMPRÉSTIMO" (2025), torre vermelha "R$ 11 MI COMPROMETIDOS A MAIS" (2026, conta própria 59,8 − 48,9).

## Cenas (tempo pela fala, `quando()`)
| palavra | s | o que acontece |
|---|---|---|
| 0 a "Gastou 50" | 0–11,9 | Kit Mapas: voo até Barro Preto, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 49,7 MI · ARRECADOU EM 2024" |
| Gastou 50 / Gastou 1 milhão a mais | 11,9 / 13,8 | pilha dourada nasce no cofre; torre vermelha "R$ 1 MI A MAIS" |
| Educação… Meio ambiente (2024) | 15,8–44 | pilhas voam setor a setor; plaquinha em todos; Agricultura: casinha cinza e "R$ 0 EM PROGRAMAS · SÓ SALÁRIOS" |
| 2025 / empréstimo / Sobraram | 45,3 / 48,3 / 52,1 | sobe ao cofre, pilha verde, chip do empréstimo de R$ 1,5 mi, torre branca "R$ 3,6 MI SOBRARAM" |
| setores 2025 | 54–78 | idem, com as plaquinhas de 2024 junto (cada uma na sua cor) |
| 2026 / Já gastou / se comprometeu | 78,3 / 83,2 / 85,8 | pilha rosa; torre vermelha "R$ 11 MI COMPROMETIDOS A MAIS"; chip "COMPROMETIDO R$ 59,8 MI · ARRECADADO R$ 48,9 MI" |
| setores 2026 | 88,4–112 | idem |
| Agora repara na cultura | 112,2–135,5 | gaveta esquerda "ONDE ESTÁ A FESTA" (1 pilha = R$ 100 mil): 2024 R$ 1,06 mi "NA EDUCAÇÃO" (dourado), 2025 São João R$ 545 mil "NA ADMINISTRAÇÃO" (verde) e depois "PREVISTO: R$ 0 · LINHA CRIADA DEPOIS", 2026 R$ 1,02 mi "NA CULTURA" (rosa) |
| E as ruas? | 135,6–151,4 | gaveta direita "AS RUAS x AS FESTAS": pavimentação 2025 R$ 0, praças 2025 R$ 0, festas 2025 R$ 859 mil (verde), praças 2026 R$ 592 mil "EMPRÉSTIMO" (rosa) |
| Tribunal | 151,4–168,9 | prédio do TCM no fundo e 4 pastas com carimbo "SEM DECISÃO": EVENTO 2025, ALUGUEL E COMBUSTÍVEL (educação, 2023 a 2025), SERVIÇOS JURÍDICOS 2026, JUROS DA PREVIDÊNCIA 2021 |
| Gastar não é crime / se a festa / por que a agricultura | 168,9–173,7 | mesa inteira; câmera passa pela gaveta da festa e para na casinha cinza da Agricultura ("R$ 0 EM PROGRAMAS · 2024, 2025 E 2026") |
| Segue o @eumagnoleite | 173,8 | abre a mesa; fim |

## Palavras repetidas (quando)
"Gastou 55" aparece no gancho: usar `quando('Gastou 55 milhoes Sobraram')`. Setores: n-ésima ocorrência por ano (Educação, Administração, Cultura, Obras de rua e Agricultura voltam a aparecer depois de 2026, fora da lista). Todos os tempos conferidos com `npx tsx` (crescentes, um por ano).

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor, baque nos zeros (agricultura, previsto R$ 0, pavimentação e praças), ding no "sobraram" e no fim. Marca d'água @eumagnoleite pequena (opacidade 0,16) quicando o vídeo todo.

## ★ Cuidados (o que é regra e o que é escolha)
- Regra: sem nome de gestor nem de empresa; sem porcentagem; segurança pública fora; zero só com o porquê (agricultura: as ações da função 20 têm R$ 0 nos três anos; a secretaria só pagou salários, na conta da Administração).
- Escolha do diretor: mostrar onde a festa foi lançada em cada ano (educação, administração, cultura), porque a "Cultura" de 2024 (R$ 70 mil) enganaria quem viu o São João. A fala só descreve a conta do documento, sem dizer que está errado.
- Ruas: a fala diz só o que as contas de 2025 mostram (R$ 0 na pavimentação e nas praças) e o que foi pago em 2026; há licitação de calçamento aberta em 2026 (fontes.md), por isso nada de "não fez obra".
- Tribunal: só o assunto e "sem decisão publicada"; nenhum processo é tratado como condenação.
