# Plano de cenas: 060. orçamento de Simões Filho

APROVADO no modo autônomo (projetos/_coordenacao-sessoes.md) em 08/11/2026. Molde: 035 Paratinga, pelo código do 059 Jequié (src/videos/orcamentojequie). Código: src/videos/orcamentosimoesfilho/OrcamentoSimoesFilho.tsx · composições OrcamentoSimoesFilho, OrcamentoSimoesFilhoGuia, OrcamentoSimoesFilhoLimpo, CapaOrcamentoSimoesFilho.

- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes unidas com 0,35 s, pausas 0,28 s, atempo 1,1036, -15 LUFS → 174,01 s. AUDIO_SEG = 174.01 · QUADROS = 5247.
- Mapa: Kit Mapas `orcamento-simoesfilho` (IBGE 2930709 conferido na API: "Simões Filho"), voo do Brasil até a cidade, tags PARA ONDE FOI CADA REAL?, PREFEITURA DE SIMÕES FILHO, TCM-BA; depois "R$ 734,4 MI · ARRECADOU EM 2024". → mapas/simoesfilho.mp4 (12,14 s, até "Gastou 735"). AREA_DE_PERTO de 8° (regra 059).
- Escala: 1 moeda = R$ 1 mi, 1 pilha = R$ 10 mi (cidade grande). Nos achados, 1 pilha = R$ 2 mi (placar troca: "AQUI, 1 PILHA = R$ 2 MI · FANTASMA = PREVISTO").

## Ideia do mundo (das regras)
Maquete redonda da série: cofre no meio, a pilha de cada ano nasce em volta dele no "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam para a casinha do setor. Torre vermelha "A MAIS" (2024: R$ 566 mil; 2026: R$ 11,4 mi) e branca "SOBRARAM" (2025: R$ 16,4 mi). Plaquinhas presas às torres; ao falar o setor, as dos anos anteriores voltam.

## Mapa do mundo
- Borda (raio 7,45), na ordem da fala, ângulo 0,12π + i·0,165π: Educação (Escola) · Saúde (Posto) · Administração (Prefeitura) · Obras e serviços urbanos (RuaServicos) · Câmara (CamaraVereadores) · Dívidas (BancoDivida) · Cultura e festas (palco) · Assistência social (PredioAssistencia) · Agricultura (trator, CINZA: R$ 0 nos três anos) · Esporte (campo de futebol) · Meio ambiente (árvores).
- Miolo, fila da frente (z 0,2), da esquerda para a direita: gaveta EMPRÉSTIMO 2024 (previsto R$ 9 mi em fantasma x entrou R$ 83,8 mi, torre 4×4) · gaveta PAVIMENTAÇÃO (R$ 5,9 mi x R$ 40,9 mi) · gaveta CAMPOS E QUADRAS (R$ 1,5 mi x R$ 15,8 mi).
- Miolo, fila de trás (z 2,6): gaveta A CONTA DE 2025 (parcelas R$ 46,9 mi, vermelha, x assistência social R$ 16,3 mi, verde) e, à direita, a pasta LEI DO EMPRÉSTIMO DE R$ 85 MI com carimbo INCONSTITUCIONAL (STF), segundo o Bahia Notícias.
- Fundo (z -3,9): prédio do TCM; pastas em z 1,3: OPERAÇÕES DE CRÉDITO 2018 A 2023 e USO DOS EMPRÉSTIMOS 2024, carimbo SEM JULGAMENTO (neutro). As filas do miolo afundam durante o Tribunal e voltam na pergunta.

## Mapa das palavras-chave (tempo pela fala, quando())
| Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|
| pegou 83 | 0,80 | chip no mapa | "2024: R$ 83,8 MI EMPRESTADOS" (★) + baque | mapa |
| 2024 Arrecadou 734 / Arrecadou 734 | 6,70 / 7,90 | mapa | tag 2024, R$ 734,4 MI | mapa |
| contando o empréstimo | 10,52 | chip | "R$ 83,8 MI DESSE TOTAL: EMPRÉSTIMO" (★) | mapa |
| Gastou 735 | 11,64 | cofre + pilha dourada | cofre sobe, pilhas nascem | 2024 |
| Faltaram 566 | 13,86 | torre vermelha | A MAIS R$ 566 mil | 2024 |
| Educação 201 … Meio ambiente 3 milhões e 200 | 16,0 → 41,8 | 11 casinhas | sobe a casinha, pilhas voam, plaquinha | 2024 |
| 2025 / Gastou 688 / Sobraram 16 | 44,5 / 47,3 / 49,5 | pilha verde, torre branca | | 2025 |
| setores 2025 | 51,6 → 76,2 | | plaquinha do ano + anteriores | 2025 |
| 2026 até setembro / Gastou 567 / 11 milhões e 400 a mais / Já empenhou / folha | 79,0 / 83,0 / 85,1 / 86,8 / 91,3 | pilha rosa, torre vermelha | chips | 2026 |
| setores 2026 | 93,2 → 114,5 | | | 2026 |
| Agora repara no empréstimo / previa 9 / Entraram 83 | 116,6 / 119,1 / 121,0 | gaveta EMPRÉSTIMO | fantasma 9, torre 83,8 sobe (impacto ★) | empréstimo |
| A ação de pavimentação / tinha 5 / Gastou 40 | 124,3 / 125,3 / 127,2 | gaveta PAVIMENTAÇÃO | fantasma x torre | empréstimo |
| A de campos / previsto 1 / Gasto 15 | 128,8 / 130,1 / 131,9 | gaveta CAMPOS | fantasma x torre | empréstimo |
| A maior parte | 133,7 | | chip DINHEIRO DE EMPRÉSTIMO, plano aberto | empréstimo |
| E a conta / pagou 46 / quase o triplo | 136,2 / 139,9 / 141,6 | gaveta A CONTA | torre vermelha 46,9, depois verde 16,3 (baque ★) | conta |
| Em outubro de 2026 / o Supremo derrubou / faltou / As contas não dizem | 143,8 / 146,7 / 151,6 / 153,9 | pasta STF | carimbo INCONSTITUCIONAL | STF |
| No Tribunal de Contas / de 2018 a 2023 / e de 2024 / ainda não foram julgadas | 155,9 / 159,1 / 160,5 / 161,7 | TCM + 2 pastas | carimbos SEM JULGAMENTO | tribunal |
| Pegar empréstimo / Mas se só as parcelas / as obras de 2024 valeram | 163,0 / 164,4 / 168,5 | filas do miolo voltam | câmera: parcelas → obras | pergunta |
| Segue o | 171,5 | | @eumagnoleite, plano aberto | pergunta |

## Câmera (enquadramento automático da base; distância é referência)
- Mapa (0 → 11,3 s): Kit Mapas.
- 2024: entra em E([0,0,0.8], 11, 8.4, dir [0,1.3,1]) no "Gastou", vai ao COFRE (9,6 × 7,6) e passa de casinha em casinha no sentido da fala (OLHA_SETOR, segura 0,55 s em cada).
- 2025 e 2026: sobe (DE_CIMA, 13 × 11, dir y 2) e desce no cofre; de novo casinha por casinha.
- Empréstimo: aberto na fila da frente (9,6 × 7,4, dir y 2,6) → PG de cima em cada torre, da esquerda para a direita → aberto.
- Conta: fila de trás (5,4 × 4,8, dir y 1,8) → PG na torre das parcelas → as duas torres.
- STF: pasta de frente e baixa (3,6 × 3,5, dir y 1,2; regra 059).
- Tribunal: aberto no TCM (10,4 × 7,6) → pasta 1 → pasta 2 → as duas.
- Pergunta: mesa inteira → parcelas → pavimentação e campos → aberto no "Segue".
- Arco 0,02 a 0,06 em todas as cenas; soquinho de 0,5 s nos números.

## Interface
Pílula: SIMÕES FILHO · 2024/2025 · PARA ONDE FOI · 2026 · ATÉ SETEMBRO · AGORA REPARA: O EMPRÉSTIMO · E A CONTA? · NO SUPREMO · NO TRIBUNAL DE CONTAS · A PERGUNTA. Chip do topo com o número dito; selo de fonte (Balanço/Anexo 9 2024, 2025, SIGA set/2026, Balanço + Anexo 16 + despesa por ação 2024, despesa por ação 2025, Bahia Notícias 22/10/2026, TCM Decisões). Marca d'água @eumagnoleite quicando. Legenda da base.

## Sons
whoosh nas trocas de cena, tique na pílula, pop em cada setor e número, subida no "Gastou" de cada ano, baque/ding na torre A MAIS/SOBRARAM; ★ impacto na torre dos R$ 83,8 mi, baque no "quase o triplo", baque leve no gancho.

## O que veio das regras e o que é do diretor
- Regras: maquete, ordem da fala, cores dos anos, plaquinhas, casinha cinza do zero, sem nome de gestor, sem porcentagem, fontes na tela, mesa sem rio.
- Diretor (★): chip do empréstimo no mapa nos 3 primeiros segundos e de novo no "contando o empréstimo"; torre 4×4 do empréstimo; vermelha só nas parcelas; pasta do STF com o crédito do Bahia Notícias e a frase "as contas não dizem se é o mesmo contrato".

## Arquivos
- Novos: src/videos/orcamentosimoesfilho/OrcamentoSimoesFilho.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-simoesfilho/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-simoesfilho.py; projetos/060.../mapas/simoesfilho.mp4.
- Alterados (só acrescentei linhas): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras (PredioTexto), orcamentoparatinga (BaseGaveta, PastaProcesso), CofreFGTS, ArvoreRedonda, CasaMini.
