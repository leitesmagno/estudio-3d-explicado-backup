# Plano · 057. orçamento de Itabela

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 2).
- Código: `src/videos/orcamentoitabela/OrcamentoItabela.tsx` (copiado do 055 Caravelas, molde 035 Paratinga). Composições: OrcamentoItabela, OrcamentoItabelaGuia, OrcamentoItabelaLimpo, CapaOrcamentoItabela.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 13 partes unidas com 0,35 s, pausas encurtadas para 0,28 s, atempo 1,158, -15 LUFS → 173,99 s. AUDIO_SEG = 173.99 · QUADROS = 5247.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-itabela` (IBGE 2914653, conferido na API: "Itabela") → `mapas/itabela.mp4` (13,35 s). Cidade no interior (perto de Eunápolis): etiqueta sem deslocamento.

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda na mesa (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026; 1 pilha = R$ 3 mi) e, a cada setor falado, as pilhas voam para a casinha do setor. 13 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras/limpeza/iluminação, ★ Aposentadorias dos servidores (novo: a Caixa de Previdência entra no Balanço de Itabela; prédio de colunas "APOSENTADORIAS"), Câmara, Dívidas, Cultura e festas, Assistência social, Saneamento (cinza, zero), Agricultura, Esporte, Meio ambiente. Câmera sempre no mesmo sentido; na virada de ano sobe e recomeça.
- Torre na frente do cofre: 2024 branca "R$ 1 MI SOBROU"; 2025 VERMELHA "R$ 9,2 MI A MAIS DO QUE ARRECADOU"; 2026 fantasma "EMPENHOU R$ 153,1 MI · ARRECADOU R$ 136,3 MI" (branca, não vermelha, porque o liquidado está abaixo do arrecadado e parte é folha a vencer).
- O zero: câmera sobe e desce na casinha cinza do saneamento; plaquinha "R$ 0 · ÁGUA · MONTE PASCOAL · 3 ANOS".
- Miolo (1 pilha = R$ 500 mil): gaveta INDENIZAÇÕES E RESTITUIÇÕES com, da esquerda para a direita, previsto 2024 (fantasma, 348 mil) x gasto 2024 (6,2 mi, dourado), previsto 2025 (fantasma, 389 mil) x gasto 2025 (19,1 mi, verde), gasto 2026 até set (4,6 mi, rosa). Regra 055: previsto em branco-fantasma, nunca na cor do ano.
- Casas populares 2026 (direita do miolo): torre-fantasma do contrato (6,4 mi, 50 casas), torre-fantasma do reservado (1 mi) e casinha cinza "R$ 0 PAGO ATÉ SET", que sobe na palavra "nada foi pago".
- Tribunal: prédio do TCM e 3 pastas: CÂMARA: AMPLIAÇÃO DO PRÉDIO 2024 (ADVERTÊNCIA), CÂMARA: DECORAÇÃO DE SESSÕES 2024 (ADVERTÊNCIA), TRANSPORTE ESCOLAR 2025 (SEM DECISÃO). Sem nome de pessoa.
- Pergunta: torre das indenizações 2025 (R$ 19,1 MI) e, na palavra "água de Monte Pascoal", a câmera vai à casinha cinza do saneamento (R$ 0); a gaveta afunda enquanto a câmera olha a borda (regra 052) e volta no plano aberto do fim.
- Marca d'água @eumagnoleite quicando; selos de fonte no topo (y 400); chip no y 520; plaquinhas presas às torres, de todos os setores, com as dos anos anteriores juntas.

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) | 0,0 | mapa: Brasil → Itabela; PARA ONDE FOI CADA REAL? | mapa A |
| "Eu abri" / "Tribunal" | 4,6 / 6,4 | PREFEITURA DE ITABELA; TCM-BA | mapa A |
| "2024 A prefeitura" | 9,7 | 2024 no mapa | mapa B |
| "arrecadou 154" | 11,2 | R$ 154 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 153" | 12,9 | sai o mapa; cofre e pilha dourada; chip GASTOU 153 | 2024 |
| "Sobrou 1 milhão" | 14,1 | torre branca 1 MI SOBROU | 2024 |
| setores 2024 | 15,1–41,4 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou" / "Gastou 178" (2ª) / "Faltaram 9" | 43,6 / 46,7 / 48,8 | sobe; pilha verde; torre vermelha 9,2 | 2025 |
| setores 2025 | 50,7–76,5 | idem, com plaquinhas de 2024 juntas | 2025 |
| "2026 até setembro" / "arrecadou 136" / "Gastou 133" / "já empenhou" / "Uma parte é folha" | 78,8 / 81,5 / 83,8 / 85,8 / 89,1 | pilha rosa; chips; torre-fantasma do empenhado | 2026 |
| setores 2026 | 91,0–116,8 | idem | 2026 |
| "Saneamento: zero nos três" / "E todo ano" / "Nada foi gasto" | 119,1 / 120,8 / 123,2 | casinha cinza do saneamento; chips de Monte Pascoal | zero |
| "Agora repara numa conta" / "É a conta usada" | 124,1 / 127,3 | gaveta das indenizações | indenizações |
| "Em 2024 previsto" / "Gasto 6 milhões e 200" | 130,1 / 133,2 | fantasma 348 mil; torre dourada 6,2 | indenizações |
| "Em 2025 previsto" / "Gasto 19" / "em educação, saúde e finanças" | 134,6 / 138,0 / 139,6 | fantasma 389 mil; torre verde 19,1 | indenizações |
| "mais 4 milhões e 600" / "Esses relatórios" | 143,1 / 144,6 | torre rosa 4,6; plano aberto | indenizações |
| "Em junho de 2026" / "um contrato de 6" / "A ação das casas" / "Até setembro, nada foi pago" | 146,3 / 148,5 / 151,4 / 153,2 | contrato fantasma 6,4; reservado 1; casinha R$ 0 | casas |
| "No Tribunal" / "duas denúncias" / "com advertência" / "E segue sem decisão" | 155,0 / 156,1 / 159,5 / 161,3 | pastas e carimbos | tribunal |
| "Gastar não" / "Mas se as indenizações" / "e a água de Monte Pascoal nada" / "qual é a prioridade" / "Segue o" | 164,3 / 165,2 / 169,2 / 170,7 / 171,7 | pergunta; @eumagnoleite | pergunta |

## Câmera (enquadramento automático da base)
- Anos: entra alto no cofre → COFRE → OLHA_SETOR de cada casinha (segura 0,55 s antes da próxima).
- Zero: DE_CIMA → saneamento.
- Indenizações: geral do miolo (9,4 × 7,0, dir y 2,3) → PG em cada torre da esquerda para a direita (mais largo nas torres altas) → abre.
- Casas: PG contrato → reservado → casinha R$ 0 (para a direita) → abre.
- Tribunal: geral → pastas 1 e 2 juntas (as duas da Câmara) → pasta 3.
- Pergunta: mesa → torre 19,1 → casinha do saneamento → abre no fim.

## Fontes e sons
Fontes: audio/fontes.md (selos: Balanço e Anexo 9 2024/2025; SIGA set/2026 de Prefeitura, Câmara e CAPREMI; ação por ação; PNCP; TCM-BA Decisões). Sons: whoosh nas trocas de cena, tique nas trocas de pílula, pop em cada setor e achado, ding no "sobrou" e no "Segue", baque no déficit de 2025 e no "nada foi pago".

## Arquivos
Novos: src/videos/orcamentoitabela/OrcamentoItabela.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-itabela/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-itabela.py. Alterados (só acréscimo): src/Root.tsx do Estúdio e do Kit Mapas. Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras (PredioTexto 'colunas'), orcamentoparatinga e src/pecas.
