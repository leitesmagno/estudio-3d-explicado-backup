# Plano · 042. orçamento de Camacan

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`) em 08/11/2026. Molde: 035 Paratinga, pelo código do 043 Ibicaraí (e a casinha de Transportes e as árvores do Meio ambiente do 044 Itapetinga).

- `audio/narracao-norm.wav`: **175,51 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 13 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,1159, -15 LUFS. Parágrafo 7 regravado ("três milhões e quatrocentos", porque "três e quatrocentos" soava "treze"). `AUDIO_SEG = 175.51` · `QUADROS = 5292`.
- Sincronia: 482 palavras do roteiro, última em 175,22 s.
- Código: `src/videos/orcamentocamacan/OrcamentoCamacan.tsx` (composições `OrcamentoCamacan`, `OrcamentoCamacanGuia`, `OrcamentoCamacanLimpo`, `CapaOrcamentoCamacan`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-camacan` (IBGE 2905602) → `mapas/camacan.mp4` (12,2 s).

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano, a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam do cofre para a casinha do setor. **1 pilha = R$ 2 mi.** 14 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras/limpeza/iluminação, Câmara, Dívidas, Cultura, Assistência social, Transportes (galpão + ônibus), Água e saneamento, Agricultura, Esporte, Meio ambiente (árvores), Proteção animal (cinza, "não tem nem uma linha nas contas"). Câmera anda sempre no mesmo sentido; na virada de ano sobe ao cofre e recomeça. Torre vermelha "A MAIS" ao lado do cofre em 2024 (R$ 6 mi) e 2025 (R$ 13,1 mi); em 2026, torre vermelha do que já foi comprometido além do arrecadado (R$ 37,8 mi, conta própria: 135,3 − 97,5).

## Cenas (tempo pela fala, `quando()`)
| palavra | s | o que acontece |
|---|---|---|
| 0 a "Gastou 125" | 0–11,7 | Kit Mapas: voo até Camacan, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 119,2 MI · ARRECADOU EM 2024" |
| Gastou 125 / Gastou 6 milhões a mais | 11,7 / 13,6 | pilha dourada nasce no cofre; torre vermelha "R$ 6 MI A MAIS" |
| Educação… Meio ambiente (2024) | 16–42 | pilhas voam setor a setor; plaquinha em todos (até meio ambiente R$ 185 mil) |
| Proteção animal, zero | 42,8 | casinha cinza "NÃO TEM NEM UMA LINHA NAS CONTAS" |
| 2025 / São 13 milhões a mais | 45,6 / 49,8 | sobe ao cofre, pilha verde, torre vermelha "R$ 13,1 MI A MAIS" |
| setores 2025 | 51–76 | idem, com as plaquinhas de 2024 junto (cada uma na sua cor) |
| 2026 / Já gastou / se comprometeu | 76,7 / 81,1 / 82,8 | pilha rosa; torre vermelha "R$ 37,8 MI COMPROMETIDOS A MAIS"; chip "COMPROMETIDO R$ 135,3 MI · ARRECADADO R$ 97,5 MI" |
| setores 2026 | 85–110,6 | idem |
| Agora repara (festas x assistência) | 110,9–125 | gaveta esquerda "FESTAS x ASSISTÊNCIA": 2024 festas R$ 5,2 mi x assistência R$ 3,6 mi (dourado); 2025 R$ 3,4 mi x R$ 3,4 mi (verde), "EMPATE". 1 pilha = R$ 250 mil |
| Na zona rural | 125,2–141,6 | gaveta direita "ZONA RURAL": estradas vicinais 2024 R$ 1,8 mi usados (dourado); 2025 R$ 1,2 mi reservados (branco) → R$ 183 mil (verde); transportes 2025 R$ 1,5 mi reservado → R$ 3,9 mi usados ("+ R$ 2,4 MI"); plaquinha "AS CONTAS NÃO DIZEM SE FOI PARA AS ESTRADAS" |
| E a agricultura familiar? | 141,9–153,3 | a gaveta da direita afunda e sobe a "AGRICULTURA FAMILIAR · 2025": R$ 727 mil reservados (branco) → R$ 0; feira livre R$ 1 mi → R$ 0; mercado com placa "OBRA DO GOVERNO DO ESTADO" |
| Tribunal | 153,8–167,7 | prédio do TCM no fundo e 5 pastas: EVENTOS 2025/2026 (R$ 2,7 MI), ROÇADEIRAS 2026 ("SUSPENSA", carimbo de alerta), TRANSPARÊNCIA 2024, ACÚMULO DE CARGOS 2025, CONTRATOS 2025; carimbo "SEM JULGAMENTO" nas outras |
| Gastar não é crime / por que a festa / e a agricultura familiar | 168,1–173 | mesa inteira; câmera passa pela gaveta das festas (esquerda) e para na agricultura familiar (direita) |
| Segue o @eumagnoleite | 173,2 | abre a mesa; fim |

## Palavras repetidas (quando)
"Gastou 133" aparece no gancho: usar `quando('Gastou 133 e 100')`. Setores: n-ésima ocorrência por ano (Cultura, Assistência social, Transportes e Agricultura voltam a aparecer depois de 2026: a 4ª ocorrência não é usada pela lista). "2024" e "2025" se repetem: sempre com a palavra vizinha.

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor, baque nos zeros e no "a mais", subida nos crescimentos, ding no fim. Marca d'água @eumagnoleite pequena (opacidade 0,16) quicando o vídeo todo.

## ★ Cuidados
- Receita de 2025 e 2026 dita já sem a dedução do Fundeb, como o Balanço de 2024 (selo na tela: "BALANÇO 2025: R$ 132,1 MI − FUNDEB R$ 12,1 MI").
- Estradas: não se afirma que as estradas ficaram sem manutenção; a tela mostra o setor de transportes ganhando R$ 2,4 mi e diz "as contas não dizem se foi para as estradas".
- Agricultura familiar: o reservado era recurso próprio (fonte 1500), não convênio.
- Sem nome de gestor nem de empresa; segurança pública fora.
