# Plano · 043. orçamento de Ibicaraí

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`) em 08/11/2026. Molde: 035 Paratinga, pelo código do 044 Itapetinga.

- `audio/narracao-norm.wav`: **175,93 s** (v2, depois da revisão). Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 13 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,134, -15 LUFS. `AUDIO_SEG = 175.93` · `QUADROS = 5305`.
- Sincronia: 486 palavras do roteiro, última em 175,76 s.
- Código: `src/videos/orcamentoibicarai/OrcamentoIbicarai.tsx` (composições `OrcamentoIbicarai`, `OrcamentoIbicaraiGuia`, `OrcamentoIbicaraiLimpo`, `CapaOrcamentoIbicarai`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-ibicarai` (IBGE 2912103) → `mapas/ibicarai.mp4` (12,5 s).

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano, a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam do cofre para a casinha do setor. **1 pilha = R$ 2 mi.** 13 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras/limpeza/iluminação, Câmara, Dívidas, Cultura, Assistência social, Água e esgoto, Agricultura e meio ambiente, Esporte (cinza até 2026), Defesa civil e Proteção animal (cinzas, "nem aparecem no orçamento"). Câmera anda sempre no mesmo sentido; na virada de ano sobe ao cofre e recomeça.

## Cenas (tempo pela fala, `quando()`)
| palavra | s | o que acontece |
|---|---|---|
| 0 a "Gastou 104" | 0–12,0 | Kit Mapas: voo até Ibicaraí, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 104,7 MI · ARRECADOU EM 2024" |
| Gastou 104 / Sobraram 560 | 12,0 / 13,5 | pilha dourada nasce no cofre; plaquinha "SOBRARAM R$ 564 MIL" |
| Educação… Esporte (2024) | 15,6–39 | pilhas voam setor a setor; plaquinhas em todos (esporte "R$ 0 EM PROGRAMAS") |
| Defesa civil e proteção animal | 39,6 | casinhas cinzas: "NEM APARECE NO ORÇAMENTO" |
| 2025 / Sobraram 6 milhões | 43 / 46,9 | sobe ao cofre, pilha verde, "SOBRARAM R$ 6,7 MI" |
| setores 2025 | 48,6–70 | idem, com as plaquinhas de 2024 junto (cada uma na sua cor) |
| 2026 / já prometeu / Aí passa | 71,4 / 76 / 77,9 | pilha rosa; torre vermelha "R$ 5,5 MI JÁ PROMETIDOS"; chip "PROMETIDO R$ 85,6 MI · ARRECADADO R$ 83 MI" |
| setores 2026 | 79,4–101 | idem |
| Agora repara (obras) | 102–129 | gaveta "2025 · OBRAS": convênio R$ 1,6 mi (branco, não entrou) + R$ 476 mil usados (verde); dia a dia R$ 3,8 mi reservado → R$ 6,8 mi usado. Gaveta "2026": R$ 1,5 mi esperando convênio + R$ 158 mil |
| No esporte | 129–139 | 2026: R$ 700 mil reservados x R$ 20 mil; canil R$ 50 mil → 0; aterro R$ 60 mil → 0 |
| Casas populares | 139,7–153 | torres: 2024 R$ 12 mil reservado x R$ 4,3 mi gasto (dourado); 2025 R$ 1,3 mi (verde); "CONVÊNIO DO ESTADO" |
| Tribunal | 153–168 | prédio do TCM e 4 pastas com carimbo "SEM JULGAMENTO": terceirizados 2025 (denúncia), remédios de alto custo 2024, repasse à Câmara 2025, acúmulo de cargos |
| Gastar não é crime / Mas se sobrou / por que o esporte | 168–173,6 | mesa inteira; câmera passa pelas obras e para no esporte de 2026 (R$ 20 mil de R$ 700 mil) |
| Segue o @eumagnoleite | 173,6 | abre a mesa; fim |

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor, baque nos zeros, subida nos crescimentos, ding nas sobras e no fim. Marca d'água @eumagnoleite pequena (opacidade 0,16) quicando o vídeo todo.

## ★ Cuidados
- Obras de infraestrutura: o reservado era quase todo convênio do Estado (fonte 1701) que não entrou; a fala e a tela dizem isso (não é "reservou e não usou").
- Casas populares pagas com convênio estadual (fonte 1665); explicam a assistência social maior em 2024.
- 2026: empenhado (R$ 85,6 mi) maior que o arrecadado (R$ 83 mi): não se diz "sobrou" em 2026.

## Revisão
- v1 (63 quadros, antigos/revisao v1): pastas do Tribunal pequenas e com o prédio atrás da pílula.
- Depois da checagem do PNCP (asfalto do Sempre Viva por convênio em 2025), a frase "pavimentação ficou no zero" saiu e a pergunta final ficou presa ao esporte. Voz dos parágrafos 8 e 12 regravada.
- v2 aprovada no modo autônomo em 08/11/2026, com o prédio do TCM empurrado para o fundo (z −3,9), câmera do Tribunal mais alta e chip final mais curto.
