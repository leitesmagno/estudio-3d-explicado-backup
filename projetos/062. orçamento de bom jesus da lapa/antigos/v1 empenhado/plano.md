# Plano · 062. orçamento de Bom Jesus da Lapa

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 3).
- Código: `src/videos/orcamentobomjesus/OrcamentoBomJesus.tsx` (copiado do 061 Uruçuca, molde 035 Paratinga). Composições: OrcamentoBomJesus, OrcamentoBomJesusGuia, OrcamentoBomJesusLimpo, CapaOrcamentoBomJesus.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 18 partes (4 e 8 refeitas: a sigla SAAE virou "a autarquia da água") unidas com 0,35 s, pausas 0,28 s, atempo 1,1193, -15 LUFS → 174,91 s. AUDIO_SEG = 174.9.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-bomjesus` (IBGE 2903904, conferido na API: "Bom Jesus da Lapa") → `mapas/bomjesus.mp4`. Satélite em pasta própria (`satelite/orcamento-bomjesus`, copiada da de Paratinga e completada pelo `npm run tiles`).

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). Orçamento de R$ 325 a 365 mi: 1 MOEDA = R$ 500 MIL e 1 PILHA = R$ 5 MI (escolha do diretor: com R$ 10 mi por pilha sobravam só 36 pilhas; com R$ 5 mi o ano usa ~80 dos 93 lugares do anel). Placar diz a escala. A cada setor falado, as pilhas voam para a casinha. 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua), Câmara, Dívidas e encargos (banco), Cultura e festas (palco), Assistência social, Água e esgoto (estação de saneamento: o SAAE), Agricultura (trator), Esporte (campo), Meio ambiente (casinha). Nenhum setor zerado.
- 2024: torre VERMELHA "DÉFICIT: R$ 14,6 MI" (o Balanço chama de "Défit"). 2025: torre-fantasma "SOBRARAM R$ 36,2 MI" (Balanço: superávit). 2026: sem torre (a voz não fala de diferença; liquidado 325,0 x arrecadado 355,1).
- Miolo (1 pilha = R$ 1 mi, torres de 2 x 2), da esquerda para a direita na ordem da fala:
  - placa "ROMARIA DO BOM JESUS · LEI FEDERAL 15.197/2025 · CULTURA NACIONAL" (sobe em "Aqui é a cidade da romaria", afunda quando a gaveta das festas sobe);
  - gaveta FESTAS (ação "festas culturais e religiosas"): três pares previsto (fantasma) x gasto (cor do ano): 2024 4,3 x 10,1; 2025 6,3 x 8,2; 2026 7,6 x 9,6 (até set.); plaquinha "SÓ BANDAS E SHOWS: R$ 5,9 MI" no gasto de 2026;
  - gaveta ASSISTÊNCIA SOCIAL: três torres sólidas 7,4 / 4,7 / 5,0, cada uma na palavra do ano;
  - em "Nos três anos", as duas gavetas acesas, plano aberto.
- Obra do Estado: placa "AEROPORTO · GOVERNO DO ESTADO · R$ 26,1 MI" (A Tarde, 06/08/2023).
- Tribunal: prédio do TCM aceso, chip "DENÚNCIAS EM ANÁLISE · UMA SOBRE O PREGÃO 2026 DE ESTRUTURA DE EVENTOS" e "EM ANÁLISE NÃO É CONDENAÇÃO".
- Pergunta: volta às duas gavetas: FESTAS 2025 R$ 8,2 MI x ASSISTÊNCIA 2025 R$ 4,7 MI.
- ★ Melhorias de atenção (regra 14): no gancho, os chips "2025: GASTOU R$ 364,5 MI" e "FESTAS R$ 8,2 MI × ASSISTÊNCIA R$ 4,7 MI" entram no mapa junto da fala, com baque leve; impacto no "Mais que o dobro" e no "Nos três anos"; pulso de luz na gaveta das festas no "Só com bandas e shows".

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "gastou 364" / "So a conta das festas" | 0,0 / 1,1 / 3,9 | mapa Brasil → Bom Jesus da Lapa; chips do gancho | mapa A |
| "Eu abri" / "Tribunal" | 6,7 / 8,2 | PREFEITURA DE BOM JESUS DA LAPA; TCM-BA | mapa A |
| "2024 A prefeitura" / "arrecadou 345" | 9,3 / 10,9 | 2024; R$ 345,3 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 359" / "O proprio balanco" / "deficit 14" | 13,1 / 15,7 / 17,1 | sai o mapa; cofre e pilha dourada; torre vermelha | 2024 |
| setores 2024 ("Educacao 133" … "Meio ambiente 1 milhao e 800") | 19,3–46,7 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou" / "Arrecadou 400" / "Gastou 364" (2ª) / "Sobraram 36" | 47,9 / 48,2 / 50,9 / 53,0 | sobe; pilha verde; torre-fantasma da sobra | 2025 |
| setores 2025 | 55,3–81,2 | idem, com as plaquinhas de 2024 juntas | 2025 |
| "2026 ate setembro Somando" / "arrecadou 355" / "Gastou 325" | 81,4 / 85,9 / 87,9 | pilha rosa; chips | 2026 |
| setores 2026 | 90,0–115,2 | idem | 2026 |
| "Agora repara" / "Aqui e a cidade da romaria" / "uma lei federal" | 115,8 / 116,8 / 119,2 | placa da romaria | romaria |
| "Nas contas as festas" / "Os relatorios nao separam" | 122,3 / 125,5 | sobe a gaveta FESTAS | festas |
| "Em 2024 essa acao" / "Gasto 10 e 100" / "Mais que o dobro" | 127,8 / 131,6 / 132,9 | par 2024 | festas |
| "Em 2025 previsto" / "Gasto 8 e 200" | 134,3 / 137,5 | par 2025 | festas |
| "Em 2026 ate setembro ja sao" / "So com bandas" | 139,6 / 143,5 | par 2026; plaquinha das bandas | festas |
| "A assistencia social inteira" / "teve 7 e 400" / "4 e 700 em 2025" / "5 milhoes ate setembro" | 146,1 / 147,4 / 149,8 / 152,0 | gaveta ASSISTÊNCIA, torre a torre | assistência |
| "Nos tres anos" | 154,3 | as duas gavetas acesas | comparação |
| "O aeroporto da cidade" / "26 milhoes e 100 segundo" | 156,6 / 158,6 | placa do aeroporto | Estado |
| "No Tribunal de Contas ha" / "uma delas sobre o pregao" / "Em analise nao e condenacao" | 160,9 / 163,1 / 166,5 | prédio do TCM | tribunal |
| "Gastar com festa" / "Mas se a festa" / "qual e a prioridade" / "Segue o" | 168,2 / 169,6 / 171,6 / 172,6 | pergunta; @eumagnoleite | pergunta |

Palavras repetidas: "gastou 364" (gancho e 2025: usar a 2ª), "2025"/"2024"/"2026" (sempre com a palavra vizinha), "Câmara" (com o número), "assistência social" (gancho, setores, achado e pergunta: sempre com o número ou "inteira"), "festas" (idem).

## Câmera (enquadramento automático da base)
- Anos: entra alto no cofre → COFRE → OLHA_SETOR de cada casinha (segura 0,55 s antes da próxima), sempre no mesmo sentido; na virada de ano sobe (DE_CIMA) e recomeça.
- Achados: geral do miolo → placa da romaria → gaveta FESTAS par a par (esquerda → direita) → gaveta ASSISTÊNCIA → plano aberto das duas, câmera baixa (dir y 1,1) para ver a altura das torres.
- Estado: placa do aeroporto de frente. Tribunal: prédio do TCM. Pergunta: duas gavetas → abre no fim.

## Fontes e sons
Fontes: audio/fontes.md (selos: Balanço e Anexo 9 2024/2025; SIGA set/2026 Prefeitura, Câmara e SAAE; despesa por ação e Anexo 6; Lei 15.197/2025; A Tarde 06/08/2023; TCM-BA Decisões). Sons: whoosh nas trocas de cena, tique nas trocas de pílula, pop em cada setor e achado, baque no déficit, ding na sobra, impacto no "mais que o dobro" e no "nos três anos", ding no "Segue".

## Arquivos
Novos: src/videos/orcamentobomjesus/OrcamentoBomJesus.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-bomjesus/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-bomjesus.py. Alterados (só acréscimo): src/Root.tsx do Estúdio e do Kit Mapas. Reaproveitados: peças de orcamentoitabuna (EstacaoSaneamento e as demais), orcamentocanavieiras (PredioTexto), orcamentoparatinga (BaseGaveta, RuaPlaca) e src/pecas.
