# Plano · 058. orçamento de Itacaré

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`, Lote 2) em 08/11/2026. Molde: 035 Paratinga, pelo código do 056 Dário Meira.

- `audio/narracao-norm.wav`: **173,96 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 14 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,138, -15 LUFS (medido -15,5, pico -1,5). `AUDIO_SEG = 173.96` · `QUADROS = 5246`.
- Sincronia: 473 palavras do roteiro, última em 173,66 s. O Whisper escreveu os milhões como "13 .200 .000"; normalizei para "13 milhões e 200" no palavras.json (original em `transcricao/palavras-original.json`). O "em em" de 2:20 é só do Whisper (retranscrito: a voz diz uma vez).
- Código: `src/videos/orcamentoitacare/OrcamentoItacare.tsx` (composições `OrcamentoItacare`, `OrcamentoItacareGuia`, `OrcamentoItacareLimpo`, `CapaOrcamentoItacare`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-itacare` (IBGE 2914901, conferido na API: "Itacaré") → `mapas/itacare.mp4` (12,35 s). Etiqueta no centro do contorno. "R$ 165,7 MI · ARRECADOU EM 2024".

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam para a casinha do setor. **1 pilha = R$ 4 mi** (orçamento de R$ 132 a 176 mi; escala no placar). 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua), Câmara, Dívidas e encargos (banco), Turismo e cultura (palco), Assistência social, Transporte e estradas (galpão), Agricultura (trator), Esporte (campo) e Saneamento (galpão cinza, o zero). Na frente do cofre: 2024 torre VERMELHA "R$ 3,3 MI A MAIS" (déficit do Balanço); 2025 torre BRANCA-FANTASMA "SOBROU R$ 4,7 MI" (superávit); 2026 torre vermelha "EMPENHOU MAIS DO QUE ARRECADOU" (altura = 139,4 − 134,3, número não dito nem escrito).

## Mapa das palavras-chave (tempo pela fala, `quando()`)
| palavra | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| 0 a "Gastou 169" | 0–11,8 | Kit Mapas | voo até Itacaré, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 165,7 MI · ARRECADOU EM 2024" | mapa |
| Gastou 169 / Ou seja 3 milhões / O próprio balanço | 11,8 / 13,6 / 16,3 | cofre, pilha dourada, torre vermelha | chip "O PRÓPRIO BALANÇO CHAMA DE DÉFICIT" | 2024 |
| setores 2024 | 18,2–43,5 | 11 casinhas | pilhas voam setor a setor; plaquinha em todos | 2024 |
| 2025 / Arrecadou 180 / Gastou 176 (2ª vez) / Desta vez | 45,0 / 46,2 / 48,3 / 50,3 | pilha verde, torre branca "SOBROU R$ 4,7 MI" | | 2025 |
| setores 2025 | 52,9–75,8 | idem, com plaquinhas de 2024 | | 2025 |
| 2026 até agosto / Arrecadou 134 / Já gastou 132 / empenhou / Mais do que arrecadou | 78,3 / 79,8 / 81,9 / 84,1 / 87,9 | pilha rosa, torre vermelha | chips do empenhado | 2026 |
| setores 2026 | 89,6–112,2 | idem | | 2026 |
| E os zeros / Saneamento / Embasa / drenagem | 114,4 / 115,4 / 117,0 / 119,2 | galpão "SANEAMENTO" cinza sobe | chips R$ 0, Embasa, R$ 32 mil previstos | zeros |
| Agora repara / 2024 / 2025 / 2026 / previa | 124,4 / 128,0 / 130,5 / 134,3 / 136,5 | gaveta "EVENTOS CULTURAIS E TRADICIONAIS", 1 pilha = R$ 200 mil | torres 2,7 (dourada), 3,7 (verde), 4,9 (rosa), 3,5 previsto (branca) | festas |
| Já a ação / 2024 / 2025 / 441 mil / previstos | 138,8 / 141,7 / 143,8 / 145,3 / 148,2 | gaveta "ESTRADAS VICINAIS (ZONA RURAL)", 1 pilha = R$ 200 mil | torres 1,9 / 0,9 / 0,441 / 2,7 previsto (branca) | estradas |
| E tem a parte / autarquia / não gastou nada / receitas | 150,0 / 151,7 / 155,0 / 156,2 | gaveta "AUTARQUIA DE TURISMO", 1 pilha = R$ 10 mil | torre branca R$ 24 mil; "R$ 0 GASTO"; chip "TAXA DE TURISMO: NENHUMA" | achado |
| No Tribunal / denúncia / sem decisão | 158,3 / 159,4 / 164,4 | prédio do TCM e 1 pasta | "ESTRUTURA E GERADOR PARA EVENTOS", carimbo "SEM DECISÃO" | tribunal |
| Gastar com festa / Mas se o evento / e a estrada / quem escolheu | 165,6 / 167,9 / 169,1 / 170,3 | gaveta "EVENTOS × ESTRADAS VICINAIS" | 3 torres de eventos (esquerda) e 3 de estradas (direita) | pergunta |
| Segue o @eumagnoleite | 171,4 | mesa inteira | abre; fim | fim |

## Câmera (alvo, tamanho, direção; enquadramento automático da base)
- Cofre de cada ano: `DE_CIMA` → `COFRE` (alvo [0,0.4,1.3], 9,6 x 7,6, dir [0.1,1.2,1]).
- Setores: `OLHA_SETOR(i)` (borda, 4,9 x 4,8, de dentro da mesa, elevação 0,95), segurando 0,55 s em cada casinha, sempre no mesmo sentido.
- Zeros: sobe (`DE_CIMA`) e vai ao saneamento (índice 11, a última casinha): mesmo sentido.
- Eventos e estradas: gaveta 9,6 x 7,4 → torre a torre da esquerda para a direita (PG 4,0–5,0).
- Autarquia: gaveta 8,5 x 6,8 → torre branca (PG 3,8–4,2).
- Tribunal: alvo [0,1,-1.4] 10,4 x 7,6 → pasta (3,4–3,6).
- Pergunta: mesa 12,5 x 9 → eventos (esquerda) → estradas (direita) → gaveta 9,2 x 6,6 → mesa inteira 13,5 x 9,6.

## Fontes
Todas em `audio/fontes.md` (cópia em `~/Documents/FONTES/058. orçamento de itacaré - fontes.md`). Selos: Balanço e Anexo 9 de 2024 e 2025; SIGA ago/2026; despesa por ação; Atlas Esgotos (ANA); Anexo 6; SIGA set/2026 da Itacaré-Tur; TCM › Decisões › Auditoria.

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor e em cada torre, baque nas torres de 2026 dos achados e no "R$ 0 gasto", tique nos zeros e no carimbo, ding no fim. Marca d'água @eumagnoleite (opacidade 0,16) quicando o vídeo todo.

## Arquivos
- Novos: `src/videos/orcamentoitacare/OrcamentoItacare.tsx`, `palavras.ts`; Kit Mapas `src/videos/orcamento-itacare/` e `scripts/dados-orcamento-itacare.py`.
- Alterados (só acréscimo de linhas): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas` (`BaseGaveta`, `PastaProcesso`), cofre, casinhas e árvores de `src/pecas`.

## ★ Cuidados (o que é regra e o que é escolha)
- Regra: sem nome de gestor nem de empresa; sem porcentagem; segurança pública fora; Tribunal com a fase ("ainda sem decisão").
- Regra (055): previsto que não virou gasto (eventos 2026, estradas 2026, autarquia) é torre branca-fantasma, nunca na cor do ano.
- Regra (037): frases dos achados presas ao nome da AÇÃO ("a ação de promover eventos culturais e tradicionais", "a ação de conservar as estradas vicinais").
- Escolha do diretor: 2026 até AGOSTO (e não setembro) porque a Câmara não mandou a despesa orçamentária de setembro (pendência anotada); assim Prefeitura e Câmara ficam no mesmo mês.
- Escolha do diretor: "Obras e serviços urbanos" = ação 2.031 "Gestão da Secretaria de Desenvolvimento Urbano" (lançada na função Administração) + função 15 Urbanismo. "Turismo e cultura" = ação 2.016 da Secretaria de Turismo + função 13 Cultura. Administração = função 04 sem essas duas ações.
- Escolha do diretor: achado festas x estradas vicinais porque Itacaré é cidade turística e a pergunta é de prioridade, não de ilegalidade ("gastar com festa não é crime, e ela atrai turista"). Não dizemos "X vezes o previsto": conferido que o aumento não foi só troca dentro da Secretaria de Turismo.
- Escolha do diretor: Meio ambiente saiu da fala para caber em 3 min (fica no fontes.md).
