# Plano · 055. orçamento de Caravelas

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 2).
- Código: `src/videos/orcamentocaravelas/OrcamentoCaravelas.tsx` (copiado do 054 Cândido Sales, molde 035 Paratinga). Composições: OrcamentoCaravelas, OrcamentoCaravelasGuia, OrcamentoCaravelasLimpo, CapaOrcamentoCaravelas.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes unidas com 0,35 s, pausas encurtadas para 0,28 s, atempo 1,124, -15 LUFS → 174,01 s. AUDIO_SEG = 174.01 · QUADROS = 5247.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-caravelas` (IBGE 2906907, conferido na API: "Caravelas") → `mapas/caravelas.mp4` (13,45 s). Litoral: etiqueta do nome puxada para a terra (dx −120).

## Ideia do mundo (regras do molde, sem mudança)
Maquete redonda na mesa (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026; 1 pilha = R$ 3 mi) e, a cada setor falado, as pilhas voam para a casinha do setor. 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras/limpeza/iluminação, Câmara, Dívidas, Cultura e festas, Assistência social, Saneamento (cinza, zero), Agricultura, Esporte, Meio ambiente. Câmera sempre no mesmo sentido; na virada de ano sobe e recomeça.
- Torre na frente do cofre: 2024 VERMELHA "R$ 8,3 MI A MAIS DO QUE ARRECADOU" (déficit do Balanço); 2025 branca "R$ 8,5 MI SOBRARAM"; 2026 branca fina "EMPENHOU R$ 117,8 DE R$ 118,3 MI".
- Miolo (1 pilha = R$ 200 mil): esquerda, gaveta FESTAS com 3 torres (3,7 / 4,1 / 3,7); direita, gaveta ASSISTÊNCIA SOCIAL (2,2 em 2025; 1,9 em 2026) na frase "a festa levou mais do que toda a assistência social". Depois, no mesmo lugar, gaveta CASAS POPULARES 2026: torre-fantasma do previsto (2,9) e casinha cinza com "R$ 0 GASTO ATÉ SET". ★ escolha do diretor: a casinha cinza sobe na palavra "nada gasto".
- Tribunal: prédio do TCM e 3 pastas: TRANSPARÊNCIA DA CÂMARA 2025 (carimbo vermelho MULTA R$ 1.500, depois CABE RECURSO); REPRESENTAÇÃO DO MP 2020 A 2024 (SEM DECISÃO); TEMPORÁRIOS SEM SELEÇÃO 2026 (SEM DECISÃO). Sem nome de pessoa.
- Pergunta: festa de 2026 (R$ 3,7 MI) e casas populares 2026 (R$ 0).
- Marca d'água @eumagnoleite quicando; selos de fonte no topo (y 400); chip no y 520; plaquinhas presas às torres, de todos os setores, com as dos anos anteriores juntas.

## Mapa de palavras (quando() → tempo aproximado → o que acontece)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) | 0,0 | mapa: Brasil → Caravelas; PARA ONDE FOI CADA REAL? | mapa A |
| "Eu abri" / "Tribunal" | 4,6 / 6,2 | PREFEITURA DE CARAVELAS; TCM-BA | mapa A |
| "2024 A prefeitura" | 9,3 | 2024 no mapa | mapa B |
| "arrecadou 132" | 10,9 | R$ 132,3 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 140 e 600" | 13,0 | sai o mapa; cofre e pilha dourada; chip GASTOU 140,6 | 2024 |
| "Faltaram 8" | 14,8 | torre vermelha 8,3 A MAIS | 2024 |
| setores 2024 (Educação … Meio ambiente) | 16,5–42,2 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou" / "Gastou 128" / "Sobraram 8" | 42,4 / 45,2 / 47,5 | sobe; pilha verde; torre branca 8,5 | 2025 |
| setores 2025 | 49,2–76,2 | idem, com plaquinhas de 2024 juntas | 2025 |
| "2026 até setembro" / "Gastou 111" / "já empenhou" / "Quase tudo" | 76,5 / 80,5 / 82,6 / 86,1 | pilha rosa; chips 111,3 e 117,8; torre branca fina | 2026 |
| setores 2026 | 87,4–111,9 | idem | 2026 |
| "E os zeros" / "Saneamento a conta" / "Fora dela" / "Esporte em 2025" / "voltou com uma obra" | 112,0 / 112,9 / 116,0 / 120,1 / 124,0 | saneamento cinza; agricultura; esporte | zeros |
| "Agora repara" / "A ação de festas" / "4 milhões e 100 em 2025" / "E 3 milhões e 700 em 2026" | 125,1 / 126,5 / 129,8 / 131,5 | torres das festas | festas |
| "a festa levou mais" | 137,3 | torres da assistência social ao lado | festas |
| "E tem a parte" / "a construção de casas" / "Até setembro nada gasto" / "O contrato da obra" | 139,6 / 142,0 / 146,5 / 148,1 | gaveta casas 2026, fantasma 2,9, casinha R$ 0, chip contrato | casas |
| "No Tribunal" / "o presidente da Câmara" / "Cabe recurso" / "uma representação" / "E contratações temporárias" | 149,9 / 150,8 / 156,0 / 158,3 / 161,8 | pastas e carimbos | tribunal |
| "Gastar não" / "Mas se a festa" / "e as casas populares nada" / "qual é a prioridade" / "Segue o" | 165,2 / 166,2 / 169,3 / 170,6 / 171,7 | pergunta; @eumagnoleite | pergunta |

## Câmera (enquadramento automático da base; alvo, largura × altura, direção)
- 2024/2025/2026: entra alto no cofre (E([0,0,0.8], 11 × 8,4, [0,1.3,1]) → COFRE 9,6 × 7,6), depois OLHA_SETOR de cada casinha (alvo na borda, 4,9 × 4,8, dir y 0,95), segurando 0,55 s antes do próximo.
- Zeros: DE_CIMA → saneamento → agricultura → esporte (mesmo sentido).
- Festas: geral do miolo (10,5 × 7,6, dir y 1,9) → PG em cada torre da esquerda para a direita → abre (8,6 × 6,6) para festas + assistência.
- Casas: PG previsto → PG casinha R$ 0 (para a direita) → abre.
- Tribunal: geral (10,4 × 7,6, dir y 2,1) → pasta 1 → 2 → 3.
- Pergunta: mesa inteira → festa 2026 → casas 2026 → abre no fim.

## Fontes e sons
Fontes: audio/fontes.md (selos: Balanço e Anexo 9 2024/2025; SIGA set/2026; ação por ação; PNCP; TCM-BA Decisões). Sons: whoosh nas trocas de cena, tique nas trocas de pílula, pop em cada setor e achado, baque no déficit de 2024 e no "nada gasto", ding no "sobraram" e no "Segue".

## Arquivos
Novos: src/videos/orcamentocaravelas/OrcamentoCaravelas.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-caravelas/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-caravelas.py. Alterados (só acréscimo): src/Root.tsx do Estúdio e do Kit Mapas. Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentoparatinga e src/pecas (CofreFGTS, CasaMini, ArvoreRedonda).
