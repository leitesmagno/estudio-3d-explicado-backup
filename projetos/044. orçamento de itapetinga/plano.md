# Plano · 044. orçamento de Itapetinga

Aprovado no modo autônomo (coordenação, 07/11/2026). Molde: 035 Paratinga, pelo código do 045 Cairu.

## Áudio
- `audio/narracao-norm.wav`: **176,21 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 12 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,09, -15 LUFS. `AUDIO_SEG = 176.21` · `QUADROS = 5313`.
- Sincronia: 478 palavras, a última termina em 175,84 s. Whisper inventou "Prefeitura" em 106,8 s (reconferido: a voz diz "Agricultura, dois milhões"); palavra tirada do `palavras.json` (original em `palavras-original.json`).

## Ideia do mundo (regras do molde 035, não escolha minha)
Maquete redonda na mesa (sem rio). Cofre no meio; a pilha de cada ano nasce em volta dele na palavra "gastou" (dourado 2024, verde 2025, rosa 2026). A cada setor falado, as pilhas voam do cofre para a casinha. **1 pilha = R$ 4 mi** (o orçamento é o dobro do de Paratinga, regra do 047). Torre vermelha "A MAIS" na frente do cofre em 2025 e 2026. Plaquinhas pequenas em todos os setores, com as dos anos anteriores na cor de cada ano. Marca d'água @eumagnoleite quicando.

## Mapa do mundo (casinhas na borda, na ordem da fala, ângulo 0,12π + i·0,125π)
0 Educação (Escola) · 1 Saúde (Posto) · 2 Administração (Prefeitura) · 3 Obras, limpeza e iluminação (RuaServicos) · 4 Câmara · 5 Dívidas (Banco) · 6 Cultura (palco) · 7 Assistência social · 8 Água e esgoto (EstacaoSaneamento, o SAAE) · 9 Agricultura (trator) · 10 Esporte (campo) · 11 Meio ambiente (árvores) · 12 Transporte e trânsito (galpão + ônibus ★) · 13 Defesa civil (casinha cinza) · 14 Proteção animal (casinha cinza).
Miolo, depois que o dinheiro some ("Agora repara"): esquerda, base "EVENTOS CULTURAIS" com torres 2024, 2025, 2026 reservado (transparente) e 2026 empenhado (rosa); direita, base "2026 · RESERVADO x USADO" com creches, defesa civil e proteção animal. Aqui 1 pilha = R$ 250 mil (escrito no placar). Fundo do miolo: prédio do TCM e três pastas.

## Palavras-chave (gatilho → tempo → o que acontece)
| palavra (quando) | s | evento | cena |
|---|---|---|---|
| (0 a 11,8 s) | 0 | Kit Mapas: voo até Itapetinga, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 305,9 MI · ARRECADOU EM 2024" | mapa |
| Gastou 297 | 11,80 | cofre sobe, pilha dourada em volta | 2024 cofre |
| Sobraram 8 | 14,04 | plaquinha SOBRARAM R$ 8,7 MI | 2024 cofre |
| Educação ... Transporte e trânsito (1ª) | 16,22–40,68 | pilhas voam, casinha sobe e acende, plaquinha | 2024 borda |
| Defesa civil e proteção | 43,06 | duas casinhas cinzas, "SEM LINHA DE DESPESA" e "NENHUM GASTO" | zeros |
| 2025 Arrecadou / Gastou 339 e 100 / 15 milhões e 800 | 45,44 / 48,48 / 51,14 | sobe; pilha verde; torre vermelha R$ 15,8 MI A MAIS | 2025 cofre |
| setores (2ª) | 53,02–76,58 | verde voa; plaquinhas 2024 + 2025 | 2025 borda |
| 2026 até setembro / Já gastou / 20 milhões e 400 | 79,14 / 83,06 / 85,06 | sobe; pilha rosa; torre vermelha R$ 20,4 MI A MAIS; "DE ONDE VAI SAIR?" | 2026 cofre |
| setores (3ª) | 88,08–110,94 | rosa voa; três plaquinhas por setor | 2026 borda |
| Agora repara | 113,18 | dinheiro do miolo some; base EVENTOS CULTURAIS | festas |
| levaram 4 milhões / e 4 e 400 | 115,44 / 117,64 | torres 2024 e 2025 | festas |
| 496 mil | 122,10 | torre transparente (reservado) | festas |
| 5 milhões e 200 / Mais de dez vezes / só com bandas | 127,56 / 129,01 / 131,97 | torre rosa sobe; chips; plaquinha BANDAS E ARTISTAS R$ 3,7 MI | festas |
| E no mesmo ano / creches / e usou 238 | 133,28 / 134,72 / 137,48 | base da direita; reservado transparente x usado rosa | mesmo ano |
| A defesa civil tinha / foi zerado | 139,12 / 141,58 | torre transparente nasce e some | mesmo ano |
| A proteção animal caiu / para 3 mil e 900 | 142,28 / 144,60 | torre transparente encolhe | mesmo ano |
| No Tribunal de Contas | 145,86 | TCM sobe; pasta SÃO JOÃO 2026 (NÃO SUSPENDEU → EXPLICAR OS CACHÊS → SEM JULGAMENTO) | tribunal |
| também mandou suspender / A prefeitura cancelou | 158,34 / 163,96 | pasta LIXO · 30 ANOS R$ 329 MI: SUSPENSA → CANCELADA | tribunal |
| E o transporte escolar | 165,22 | pasta TRANSPORTE ESCOLAR: SEM JULGAMENTO | tribunal |
| Gastar não / por que a festa / e a creche fica | 168,38 / 170,34 / 172,24 | mesa inteira; festa (10 VEZES O RESERVADO) e creche (R$ 238 MIL DE R$ 3,1 MI) | pergunta |

## Câmera (enquadramento automático; sempre andando no mesmo sentido)
- Cofre: de [0,0,0.8] larg 11 → COFRE (alvo [0,0.4,1.3], 9,6 × 7,6, elevação 1,2).
- Borda: OLHA_SETOR(i) de casinha em casinha, segura 0,55 s; virada de ano sobe (DE_CIMA, 13 × 11, elevação 2,0) e recomeça na escola.
- Zeros de 2024: OLHA_SETOR 13,1 → 13,7 (defesa civil e proteção animal).
- Festas: [-1,9; 0,8; 1,0] larg 7,2 → perto de cada torre da esquerda para a direita (larg 3,6 a 4,0).
- Mesmo ano: [1,4; 0,9; 1,0] larg 5,6 → creches → defesa civil → proteção animal.
- Tribunal: [0; 1,0; -1,4] larg 9,4 → pastas 0, 1, 2.
- Pergunta: mesa inteira (12,5 × 9) → festa → creche → abre (13,5 × 9,6).

## Fontes e selos
Todos os números em `audio/fontes.md` (1ª conferência feita). Selos: Anexo 9 e Balanço 2024/2025; SIGA set/2026 (Prefeitura, Câmara, SAAE e trânsito); despesa por ação; TCM-BA 18340e26 e IDenuncias 05/08/2026; TCM-BA 27482e24 e 02242e25.

## Sons
whoosh em cada troca de cena, tique na pílula, pop em cada setor, subida no "gastou", baque nos "a mais", no zero, no "usou 238", no "zerado" e no "3 mil e 900", impacto no "mais de dez vezes", no lixo suspenso e no cancelou, ding no final.

## Arquivos
- Novos: `src/videos/orcamentoitapetinga/OrcamentoItapetinga.tsx`, `palavras.ts`; `~/Kit-Mapas-Animados/src/videos/orcamento-itapetinga/` (dados IBGE 2916401), `scripts/dados-orcamento-itapetinga.py`; `projetos/044.../mapas/itapetinga.mp4` (12,3 s).
- Alterados (só acrescentei linhas): `src/Root.tsx`, `~/Kit-Mapas-Animados/src/Root.tsx`.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas`, `pecas/escala6x1c` (Onibus ★).

## Capa
"A festa / ganhou 10x / o reservado. / E a creche?" (verdadeiro: empenhado 5.205.397,21 ÷ reservado 496.000 = 10,5). Fundo: quadro da pergunta (festa e creche no miolo).
