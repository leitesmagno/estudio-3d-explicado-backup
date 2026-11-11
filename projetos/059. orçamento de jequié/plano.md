# Plano · 059. orçamento de Jequié

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 2).
- Código: `src/videos/orcamentojequie/OrcamentoJequie.tsx` (copiado do 057 Itabela, molde 035 Paratinga). Composições: OrcamentoJequie, OrcamentoJequieGuia, OrcamentoJequieLimpo, CapaOrcamentoJequie.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 12 partes (6 e 7 refeitas: "51 milhões e 800") unidas com 0,35 s, pausas 0,28 s, atempo 1,141, -15 LUFS → 174,02 s. AUDIO_SEG = 174.02 · QUADROS = 5248.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-jequie` (IBGE 2918001, conferido na API: "Jequié") → `mapas/jequie.mp4` (12,28 s). Cidade no Centro-Sul, longe do litoral: etiqueta sem deslocamento. Satélite baixado (312 blocos).

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda na mesa (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). ★ Cidade grande: 1 MOEDA = R$ 1 MI e 1 PILHA = R$ 10 MI (como Camaçari), escrito no placar. A cada setor falado, as pilhas voam para a casinha. 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua com caminhão e gari), Aposentadorias (casinha com letreiro), Câmara, Dívidas, Cultura e festas (palco), Assistência social, Agricultura, Esporte (campo), Meio ambiente (3 árvores, nenhuma pilha: menos de R$ 1 mil por ano). Sem casinha de saneamento: limpeza e saneamento estão juntos em Obras (a limpeza trocou de função em 2026; ver fontes.md).
- Torre na frente do cofre: 2024 VERMELHA "R$ 32,6 MI A MAIS DO QUE ARRECADOU" (Balanço "Déficit"); 2025 branca "QUASE R$ 11 MI SOBRARAM"; 2026 VERMELHA "R$ 51,75 MI A MAIS DO QUE ARRECADOU" (liquidado 691,0 x arrecadado 639,3; o empenhado 860,4 vai no chip).
- Miolo 1 (1 pilha = R$ 1 mi): gaveta FESTAS POPULARES: previsto 2024 (fantasma 8,7) x gasto 2024 (dourado 10,7), previsto 2025 (fantasma 11,9) x gasto 2025 (verde 13,9). Previsto sempre em branco-fantasma (regra 055).
- Meio ambiente: a câmera vai à casinha das árvores (plaquinha R$ 931), depois à gaveta RIOS E LAGOAS 2025 (1 pilha = R$ 100 mil): torre-fantasma de R$ 295 mil previstos e UMA moedinha verde do gasto (R$ 371). Pasta "LAGOA DO DERBA · DEZ/2025" com carimbo "CONDENADA · 1ª INSTÂNCIA" e selo "FONTE: A TARDE, 20/01/2026".
- Tribunal: prédio do TCM e 2 pastas: PREGÃO DO SÃO JOÃO 2025 (IMPROCEDENTE, carimbo neutro), FOLHA DE PAGAMENTO INÍCIO DE 2024 (ADVERTÊNCIA). Sem nome de pessoa.
- Pergunta: torre das festas 2025 (R$ 13,9 MI) e, em "o meio ambiente 931 reais", a câmera vai à casinha das árvores (R$ 931); a gaveta afunda enquanto a câmera olha a borda e volta no plano aberto do fim.
- Marca d'água @eumagnoleite quicando; selos de fonte no topo (y 400); chip no y 520; plaquinhas presas às torres, de todos os setores, com as dos anos anteriores juntas.
- ★ Melhorias de atenção (regra 14): no gancho, "2025: GASTOU R$ 819,1 MI" e "MEIO AMBIENTE EM 2025: R$ 931" entram no mapa junto da fala, com baque leve no "menos de mil reais"; impacto nos R$ 13,9 mi das festas e baque no "Gasto: 371 reais".

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "gastou 819" / "menos de mil reais" | 0,0 / 0,4 / 4,1 | mapa Brasil → Jequié; chips do gancho | mapa A |
| "Eu abri" / "Tribunal" | 5,1 / 6,8 | PREFEITURA DE JEQUIÉ; TCM-BA | mapa A |
| "2024 A prefeitura" / "arrecadou 764" | 7,7 / 9,3 | 2024; R$ 764,7 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 797" / "Faltaram 32" | 11,8 / 14,3 | sai o mapa; cofre e pilha dourada; torre vermelha 32,6 | 2024 |
| setores 2024 | 16,5–43,7 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou" / "Gastou 819" (2ª) / "Sobraram quase" | 46,3 / 49,2 / 51,3 | sobe; pilha verde; torre branca 11 | 2025 |
| setores 2025 | 52,9–79,5 | idem, com plaquinhas de 2024 juntas | 2025 |
| "2026 até setembro" / "arrecadou 639" / "Gastou 691" / "São 51" / "já empenhou" / "Uma parte" | 81,6 / 85,9 / 88,1 / 89,4 / 92,7 / 96,4 | pilha rosa; torre vermelha 51,75; chips | 2026 |
| setores 2026 | 98,2–123,7 | idem | 2026 |
| "Agora repara" / "Em 2024 previsto" / "Gasto 10" / "Em 2025 previsto" / "Gasto 13" | 125,8 / 127,9 / 131,4 / 133,5 / 136,7 | gaveta das festas: fantasma 8,7; dourado 10,7; fantasma 11,9; verde 13,9 | festas |
| "E o meio ambiente" / "A secretaria" / "A ação de preservar" / "tinha 295" / "Gasto 371" | 138,5 / 139,6 / 141,5 / 143,4 / 146,5 | casinha das árvores; gaveta rios; fantasma 295 mil; moedinha | meio ambiente |
| "Em dezembro de 2025" / "a Justiça condenou" | 148,0 / 150,2 | pasta LAGOA DO DERBA; carimbo | meio ambiente |
| "No Tribunal" / "pregão do São João" / "improcedente" / "A auditoria" / "advertência" | 154,9 / 156,7 / 158,6 / 159,9 / 162,7 | pastas e carimbos | tribunal |
| "Gastar não" / "Mas se as festas" / "e o meio ambiente 931" / "qual é a prioridade" / "Segue o" | 164,3 / 165,2 / 168,3 / 170,8 / 171,8 | pergunta; @eumagnoleite | pergunta |

## Câmera (enquadramento automático da base)
- Anos: entra alto no cofre → COFRE → OLHA_SETOR de cada casinha (segura 0,55 s antes da próxima).
- Festas: geral do miolo → PG em cada torre da esquerda para a direita → abre.
- Meio ambiente: casinha das árvores → gaveta dos rios → moedinha → pasta da Lagoa (sempre para a direita).
- Tribunal: geral → pasta 1 → pasta 2.
- Pergunta: mesa → torre 13,9 → casinha do meio ambiente → abre no fim.

## Fontes e sons
Fontes: audio/fontes.md (selos: Balanço e Anexo 9 2024/2025; SIGA set/2026 das cinco unidades; ação por ação; A Tarde; TCM-BA Decisões). Sons: whoosh nas trocas de cena, tique nas trocas de pílula, pop em cada setor e achado, ding no "sobraram" e no "Segue", baque nos dois "a mais", no "menos de mil reais" e no "371 reais", impacto nos 13,9 mi.

## Arquivos
Novos: src/videos/orcamentojequie/OrcamentoJequie.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-jequie/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-jequie.py. Alterados (só acréscimo): src/Root.tsx do Estúdio e do Kit Mapas. Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras (PredioTexto), orcamentoparatinga (BaseGaveta, PastaProcesso) e src/pecas.
