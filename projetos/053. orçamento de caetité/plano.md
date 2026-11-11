# Plano · 053. orçamento de Caetité

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`, Lote 2) em 08/11/2026. Molde: 035 Paratinga, pelo código do 052 Barro Preto.

- `audio/narracao-norm.wav`: **174,45 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 12 partes (um parágrafo por pedido; partes 8, 9 e 10 refeitas depois de enxugar 3 frases) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,14, -15 LUFS. `AUDIO_SEG = 174.45` · `QUADROS = 5261`.
- Sincronia: 446 palavras do roteiro, última em 174,16 s. O Whisper se perdeu entre 28 e 60 s (gerou "0.", "3."); o trecho foi retranscrito em janelas e o parágrafo p03 conferido sozinho (os 12 setores de 2024 estão na voz). Números do tipo "881 .000." normalizados antes de alinhar. Original em `transcricao/palavras-original.json`.
- Código: `src/videos/orcamentocaetite/OrcamentoCaetite.tsx` (composições `OrcamentoCaetite`, `OrcamentoCaetiteGuia`, `OrcamentoCaetiteLimpo`, `CapaOrcamentoCaetite`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-caetite` (IBGE 2905206, conferido na API) → `mapas/caetite.mp4` (12,6 s).

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam para a casinha do setor. **1 pilha = R$ 4 mi** (orçamento de R$ 220 a 252 mi; escala escrita no placar). 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura (palco), Assistência social, Água e saneamento, Agricultura (trator), Esporte (campo), Meio ambiente (árvores). Câmera sempre no mesmo sentido; na virada de ano sobe ao cofre e recomeça. Na frente do cofre: torre branca "R$ 16 MI SOBRARAM" (2024), torre branca "R$ 770 MIL SOBRARAM" (2025), torre vermelha "R$ 12,2 MI A MAIS" (2026).

## Mapa das palavras-chave (tempo pela fala, `quando()`)
| palavra | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| 0 a "Gastou 220" | 0–12,1 | Kit Mapas | voo até Caetité, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 236,8 MI · ARRECADOU EM 2024" | mapa |
| Gastou 220 / Sobraram 16 | 12,1 / 14,3 | cofre, pilha dourada, torre branca | pilha nasce; torre "R$ 16 MI SOBRARAM" | 2024 |
| setores 2024 | 15,8–41 | 12 casinhas | pilhas voam setor a setor; plaquinha em todos | 2024 |
| 2025 / Arrecadou 252 / Gastou 252 e 100 / Sobraram só | 42,2 / 43,2 / 45,6 / 47,6 | pilha verde, torre branca | "R$ 770 MIL SOBRARAM" | 2025 |
| setores 2025 | 49,6–75 | idem, com plaquinhas de 2024 | | 2025 |
| 2026 / Arrecadou 195 / Já gastou 207 / São 12 / comprometeu | 75,8 / 78,5 / 80,7 / 82,8 / 85,5 | pilha rosa, torre vermelha | "R$ 12,2 MI A MAIS"; chip "JÁ COMPROMETIDO: R$ 227,2 MI" | 2026 |
| setores 2026 | 87,7–114 | idem | | 2026 |
| Agora repara / festas 2024, 2025, bandas, 2026, já passou | 115–131 | gaveta "AS FESTAS" (1 pilha = R$ 200 mil) | 3 torres: 3,9 (dourado), 4,4 (verde, depois "SÓ BANDAS R$ 1,8 MI"), 5 (rosa) | festas |
| E tem a parte / 43 / 38 / 35 / concurso / seguem | 131,6–146 | gaveta "CONTRATOS TEMPORÁRIOS" (1 pilha = R$ 2 mi) | 3 torres 43 / 38,4 / 35,2; chip "A PREFEITURA FEZ CONCURSO EM 2024" | temporários |
| E isso chegou / julgou / multa / recurso / outros dois | 146,6–167 | prédio do TCM e 3 pastas | pasta 1 carimbo "PROCEDENTE · MULTA" → "CABE RECURSO"; pastas 2 e 3 "SEM DECISÃO" | tribunal |
| Gastar não é crime / Mas se em 2026 / por que a festa | 167,2 / 168,1 / 170,9 | mesa; torre vermelha; gaveta das festas | plaquinhas "R$ 12,2 MI A MAIS · 2026" e "R$ 3,9 → 4,4 → 5 MI" | pergunta |
| Segue o @eumagnoleite | 172,2 | mesa inteira | abre; fim | fim |

## Câmera (alvo, tamanho, direção; enquadramento automático da base)
- Mapa: Kit Mapas.
- Cofre de cada ano: início `E([0,0,0.8], 11, 8.4, [0,1.3,1])` / `DE_CIMA` → fim `COFRE` (alvo [0,0.4,1.3], 9,6 x 7,6, dir [0.1,1.2,1]).
- Setores: `OLHA_SETOR(i)` (alvo na borda, 4,9 x 4,8, dir de dentro da mesa, elevação 0,95), segurando 0,55 s em cada casinha, sempre no mesmo sentido.
- Festas: início alvo [-2.55,0.9,0.2] 7 x 6,4 dir [0,1.9,1] → torre a torre da esquerda para a direita (PG 3,8) → fim na torre de 2026.
- Temporários: início alvo [2.2,0.9,0.2] → torre a torre (PG 3,9) → plano médio 5,6 x 5,0 no "concurso".
- Tribunal: início alvo [0,1,-1.4] 10,4 x 7,6 dir [0,2.1,1] → pasta a pasta (4,2 x 4,0) da esquerda para a direita.
- Pergunta: mesa 12,5 x 9 → torre vermelha (PG 3,8) → gaveta das festas (PG 5,6) → mesa inteira 13,5 x 9,6.

## Fontes
Todas em `audio/fontes.md` (cópia em `~/Documents/FONTES/053. orçamento de caetité - fontes.md`). Selos na tela: Balanço e Anexo 9 de 2024 e 2025; demonstrativos consolidados de set/2026; despesa por ação; despesa por elemento (contrato por tempo determinado); TCM › Decisões › Auditoria.

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor e em cada torre dos achados, ding nos "sobraram" e no fim, baque na torre vermelha de 2026, no "já passou" e no "os temporários seguem". Marca d'água @eumagnoleite pequena (opacidade 0,16) quicando o vídeo todo.

## Arquivos
- Novos: `src/videos/orcamentocaetite/OrcamentoCaetite.tsx`, `palavras.ts`; Kit Mapas `src/videos/orcamento-caetite/` e `scripts/dados-orcamento-caetite.py`.
- Alterados (só acréscimo de linhas): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas` (`BaseGaveta`, `PastaProcesso`), cofre e árvores de `src/pecas`.

## ★ Cuidados (o que é regra e o que é escolha)
- Regra: sem nome de gestor nem de empresa; sem porcentagem; segurança pública fora; Tribunal com a fase (procedente, cabe recurso; sem decisão).
- Escolha do diretor: não usar "poços e cisternas zero" da agricultura, porque a perfuração de poços é da Sec. de Recursos Hídricos (processo TCM 15430e25 sobre contratação de perfuração de poços). Agricultura entra só com o valor.
- Escolha do diretor: parque e rodoviária ficaram fora (a dotação era quase toda de convênio, fonte 1700/1701).
- Contratos temporários: a fala diz o valor do elemento "contratação por tempo determinado" e cita o concurso de 2024, para não dar a entender que não houve concurso.
- 2026: "gastou 12 milhões e 200 a mais do que arrecadou" é liquidado até setembro x arrecadado até setembro, conta própria explicada no fontes.md.
