# Plano · 056. orçamento de Dário Meira

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`, Lote 2) em 08/11/2026. Molde: 035 Paratinga, pelo código do 054 Cândido Sales.

- `audio/narracao-norm.wav`: **174,07 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 13 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,06, -15 LUFS (medido -15,5). `AUDIO_SEG = 174.07` · `QUADROS = 5249`.
- Sincronia: 459 palavras do roteiro, última em 173,68 s. O Whisper pulou "e 600" em "Obras e serviços públicos, 8 milhões e 600" (28–30 s); retranscrevi a janela e a fala está certa no áudio; inseri as duas palavras no palavras.json (original em `transcricao/palavras-original.json`).
- Código: `src/videos/orcamentodariomeira/OrcamentoDarioMeira.tsx` (composições `OrcamentoDarioMeira`, `OrcamentoDarioMeiraGuia`, `OrcamentoDarioMeiraLimpo`, `CapaOrcamentoDarioMeira`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-dariomeira` (IBGE 2910008, conferido na API: "Dário Meira") → `mapas/dariomeira.mp4` (15,1 s). Etiqueta no centro do contorno.

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam para a casinha do setor. **1 pilha = R$ 2 mi** (orçamento de R$ 71 a 93 mi; escala no placar). 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços públicos (rua), Câmara, Dívidas (banco), Cultura e festas (palco), Assistência social, Estradas (galpão), Agricultura (trator), Esgoto (galpão cinza) e Esporte (campo cinza). Na frente do cofre, nos três anos, a torre VERMELHA "A MAIS": R$ 8,4 mi (2024), R$ 11 mi (2025), "MAIS DO QUE ARRECADOU" (2026 até set., altura = 71,0 − 67,6, número não dito nem escrito).

## Mapa das palavras-chave (tempo pela fala, `quando()`)
| palavra | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| 0 a "Gastou 82" | 0–14,6 | Kit Mapas | voo até Dário Meira, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 74,5 MI · ARRECADOU EM 2024" | mapa |
| Gastou 82 / Ou seja 8 milhões / O próprio balanço | 14,6 / 16,9 / 19,8 | cofre, pilha dourada, torre vermelha | chip "O PRÓPRIO BALANÇO CHAMA DE DÉFICIT" | 2024 |
| setores 2024 | 21,7–44 | 10 casinhas | pilhas voam setor a setor; plaquinha em todos | 2024 |
| 2025 / Arrecadou 81 / Gastou 92 e 700 / Desta vez | 45,2 / 46,2 / 48,3 / 50,3 | pilha verde, torre vermelha "R$ 11 MI A MAIS" | | 2025 |
| setores 2025 | 52,4–74 | idem, com plaquinhas de 2024 | | 2025 |
| 2026 / Arrecadou 67 / Já gastou 71 / De novo / empenhou / folha | 74,9 / 76,6 / 78,8 / 80,3 / 81,7 / 85,7 | pilha rosa, torre vermelha | chips do empenhado e "PARTE É FOLHA QUE AINDA VAI VENCER" | 2026 |
| setores 2026 | 87,3–109 | idem | | 2026 |
| E os zeros / Esgoto / Esporte / Em 2026 20 mil | 109,2 / 110,1 / 115,3 / 120,1 | galpão "ESGOTO" e campo cinza sobem | chips com o previsto e o R$ 0 | zeros |
| Agora repara / 2024 / 2025 / Subiram / a arrecadação subiu | 123,1 / 124,9 / 129,3 / 132,4 / 134,6 | gaveta "FOLHA DE PAGAMENTO", 1 pilha = R$ 2 mi | torres 52,9 (dourada), 65,5 (verde), +12,6 (vermelha), +7,2 (branca-fantasma, arrecadação) | folha |
| E tem a parte / Casas populares / Nada gasto / reservou / licitação / nada foi pago | 136,9–148,1 | gaveta "CASAS POPULARES", 1 pilha = R$ 100 mil | R$ 0 2024, R$ 0 2025, torre branca-fantasma R$ 2,25 mi RESERVADOS; 20 casinhas cinza na licitação; "R$ 0 PAGO" | achado |
| No Tribunal / processo de 2025 / sem decisão / multa | 149,4 / 150,6 / 156,1 / 158,9 | prédio do TCM e 2 pastas | carimbos "SEM DECISÃO" e "MULTA MANTIDA" | tribunal |
| Gastar não é crime / Mas se o gasto / 2024 / 2025 / 2026 / quem vai pagar | 163,3–169,8 | gaveta "GASTOU MAIS DO QUE ARRECADOU", 1 pilha = R$ 1 mi | 3 torres vermelhas 8,4 / 11 / "A MAIS" | pergunta |
| Segue o @eumagnoleite | 171,0 | mesa inteira | abre; fim | fim |

## Câmera (alvo, tamanho, direção; enquadramento automático da base)
- Cofre de cada ano: `DE_CIMA` → `COFRE` (alvo [0,0.4,1.3], 9,6 x 7,6, dir [0.1,1.2,1]).
- Setores: `OLHA_SETOR(i)` (borda, 4,9 x 4,8, de dentro da mesa, elevação 0,95), segurando 0,55 s em cada casinha, sempre no mesmo sentido.
- Zeros: sobe (`DE_CIMA`) e recomeça no esgoto (índice 10), depois esporte (11): mesmo sentido.
- Folha: gaveta 9,6 x 7,4 → torre a torre da esquerda para a direita (PG 4,0–4,6).
- Casas: gaveta 8,5 x 6,8 → esquerda para a direita → plano 4,4 x 4,2 sobre a torre de 2026 e as 20 casinhas.
- Tribunal: alvo [0,1,-1.4] 10,4 x 7,6 → pasta a pasta (3,3 x 3,2).
- Pergunta: mesa 12,5 x 9 → torre 2024 → 2025 → 2026 → gaveta 6 x 5,4 → mesa inteira 13,5 x 9,6.

## Fontes
Todas em `audio/fontes.md` (cópia em `~/Documents/FONTES/056. orçamento de dário meira - fontes.md`). Selos: Balanço e Anexo 9 de 2024 e 2025; SIGA set/2026; despesa por ação; Balanço Orçamentário (folha); PNCP (licitação de 23/06/2026); TCM › Decisões › Auditoria.

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor e em cada torre, baque nas torres vermelhas, no "subiram" e no "R$ 0 pago", tique nos zeros e nos carimbos, ding no fim. Marca d'água @eumagnoleite (opacidade 0,16) quicando o vídeo todo.

## Arquivos
- Novos: `src/videos/orcamentodariomeira/OrcamentoDarioMeira.tsx`, `palavras.ts`; Kit Mapas `src/videos/orcamento-dariomeira/` e `scripts/dados-orcamento-dariomeira.py`.
- Alterados (só acréscimo de linhas): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas` (`BaseGaveta`, `PastaProcesso`), cofre, casinhas e árvores de `src/pecas`.

## ★ Cuidados (o que é regra e o que é escolha)
- Regra: sem nome de gestor nem de empresa; sem porcentagem; segurança pública fora (a ação "segurança pública" fica dentro da Administração, sem destaque); Tribunal com a fase e o resultado.
- Regra (055): o "reservado" das casas populares (empenhado, não pago) é torre branca-fantasma, nunca na cor do ano.
- Regra (043): dívidas de 2026 lançadas na função Administração (ação 1.3001) saem da Administração e entram em "Dívidas".
- Escolha do diretor: "Obras e serviços públicos" = função Urbanismo (Sec. de Infraestrutura e Serviços Públicos). A ação de iluminação pública ficou em zero nos três anos, mas a conta de luz aparece em "serviços de energia elétrica" da Administração: por isso iluminação NÃO entra como zero (seria enganoso).
- Escolha do diretor: "Esgoto" fala só da ação "Implantação de esgotamento sanitário" (prevista nos três anos, R$ 0); não dizemos "água zero".
- Escolha do diretor: achado da folha (Balanço: Pessoal e Encargos) em vez de festas, porque as festas são pequenas aqui (R$ 286 mil a R$ 609 mil) e a folha explica melhor o gasto acima da arrecadação. Não falamos de concurso nem de temporários.
