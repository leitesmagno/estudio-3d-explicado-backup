# Plano · 063. orçamento de Lauro de Freitas

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 3, renumerado: Lauro = 063).
- Código: `src/videos/orcamentolauro/OrcamentoLauro.tsx` (copiado do 062 Bom Jesus da Lapa, molde 035 Paratinga). Composições: OrcamentoLauro, OrcamentoLauroGuia, OrcamentoLauroLimpo, CapaOrcamentoLauro.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 16 partes (3, 4, 5, 12 e 14 refeitas depois de enxugar o texto) unidas com 0,35 s, pausas 0,28 s, atempo 1,136, -15 LUFS → 174,81 s. AUDIO_SEG = 174.81; QUADROS = 5271.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-lauro` (IBGE 2919207, conferido na API: "Lauro de Freitas") → `mapas/lauro.mp4` (13,5 s). Satélite em pasta própria (`satelite/orcamento-lauro`, copiada da de Simões Filho, vizinha, e completada pelo `npm run tiles`).
- Selo do @eumagnoleite na abertura: componente `src/videos/comum/SeloArroba.tsx` (opção B aprovada, regra 15c), de 0,15 s a 3,9 s. Marca d'água quicando o vídeo todo.

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). Cidade grande (R$ 0,9 a 1,1 bilhão): 1 MOEDA = R$ 2 MI e 1 PILHA = R$ 20 MI (escolha do diretor, pedido do coordenador: "moeda de valor maior"; cada ano usa de 47 a 57 dos 93 lugares do anel). O placar diz a escala. A cada setor falado, as pilhas voam para a casinha. 10 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua), Câmara, Dívidas e precatórios (banco), Cultura e festas (palco), Assistência social, Esporte (campo), Meio ambiente (casinha). Água e agricultura ficaram fora da fala (cidade sem zona rural relevante; água da Embasa), nenhum setor zerado.
- 2024: torre VERMELHA "DÉFICIT: R$ 47,7 MI" (o Balanço chama de déficit). 2025: torre-fantasma "SOBRA: R$ 107,6 MI" (Balanço: superávit) e chip "JAN/2025: DECRETO DE CALAMIDADE FINANCEIRA" com selo do Correio. 2026: torre VERMELHA "R$ 29,9 MI A MAIS" e chip do empenhado.
- Agora repara: a câmera volta à casinha da SAÚDE (torres de 2024 e 2025 lado a lado, plaquinhas) com "SAÚDE: R$ 40,3 MI A MENOS" e depois à da ASSISTÊNCIA ("R$ 10,8 MI A MENOS").
- Miolo (1 pilha = R$ 1 mi, torres de 2 x 2): gaveta "EVENTOS CULTURAIS": 2024 R$ 8,8 mi (dourado), 2025 R$ 5,3 mi (verde), 2026 previsto (fantasma) que CRESCE de R$ 11 mi para R$ 21,1 mi na palavra "subiu para 21", e o pago até setembro R$ 14,4 mi (rosa); em "Mais que os dois anos anteriores somados" aparece a plaquinha vermelha "R$ 14,1 MI · 2024 + 2025".
- Maternidade: placa "MATERNIDADE MUNICIPAL · ORDEM DE SERVIÇO: MAIO/2026 · OBRA DE CERCA DE 2 ANOS" e, ao lado, previsto 2026 R$ 17,4 mi (fantasma) x pago R$ 684 mil (rosa). A fala e a tela não dizem que a obra está parada.
- Tribunal: prédio do TCM aceso, chips "REPRESENTAÇÃO DO MP SOBRE AS CONTAS DE 2024 · JULGADA IMPROCEDENTE (MARÇO/2026)" e "7 PROCESSOS DE 2025 E 2026 SEM JULGAMENTO PUBLICADO". Sem nomes.
- Pergunta: volta à gaveta dos eventos: "EVENTOS 2024 + 2025: R$ 14,1 MI" x "EVENTOS 2026 ATÉ SET: R$ 14,4 MI".
- ★ Melhorias de atenção (regra 14): no gancho, os chips "DECRETO Nº 5.432, DE 7/1/2025" e "EVENTOS 2026: R$ 14,4 MI · 2024 + 2025: R$ 14,1 MI" entram no mapa junto da fala, com baque leve; a torre do previsto de 2026 CRESCE na palavra "subiu" com som de subida; impacto no pago e no "somados".

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "decretou calamidade" / "a conta de eventos ja passou" | 0,0 / 0,8 / 4,4 | mapa Brasil → Lauro de Freitas; selo do @ (0,15–3,9 s); tags e chips do gancho | mapa A |
| "Eu abri" / "Tribunal" | 6,5 / 8,2 | PREFEITURA DE LAURO DE FREITAS; TCM-BA | mapa A |
| "2024 A prefeitura" / "arrecadou 1 bilhao e 56" | 9,1 / 10,8 | 2024; R$ 1,056 BI ARRECADOU EM 2024 | mapa B |
| "Gastou 1 bilhao e 104" / "O proprio balanco" / "deficit 47" | 13,0 / 14,9 / 16,3 | sai o mapa; cofre e pilha dourada; torre vermelha | 2024 |
| setores 2024 ("Educacao 360" … "Meio ambiente 8") | 18,7–42,1 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Em janeiro" / "Em janeiro a prefeitura" / "arrecadou 1 bilhao e 127" / "Gastou 1 bilhao e 19" / "O balanco fecha com sobra" | 44,2 / 45,5 / 50,1 / 52,2 / 54,2 | sobe; chip da calamidade; pilha verde; torre-fantasma da sobra | 2025 |
| setores 2025 ("Educacao 334" … "Meio ambiente 5") | 57,2–77,8 | idem, com as plaquinhas de 2024 juntas | 2025 |
| "2026 ate setembro Arrecadou" / "Gastou 903" / "Sao 29" / "E ja empenhou" / "Uma parte e folha" | 80,2 / 84,2 / 86,5 / 88,4 / 92,0 | sobe; pilha rosa; torre vermelha; chips | 2026 |
| setores 2026 ("Educacao 272" … "Meio ambiente 6") | 93,9–115,5 | idem, com 2024 e 2025 juntas | 2026 |
| "Agora repara" / "a arrecadacao subiu" / "a saude gastou 40" / "A assistencia social quase 11" | 117,6 / 120,4 / 123,5 / 125,4 | vista de cima; casinha da saúde; casinha da assistência | repara |
| "E as festas" / "A conta de eventos culturais gastou" / "Em 2025 5 milhoes" / "Em 2026 comecou" / "subiu para 21" / "ja pagou 14" / "Mais que os dois anos" | 127,7 / 128,3 / 132,1 / 134,4 / 137,2 / 139,6 / 141,3 | gaveta; torres 2024, 2025; previsto 11 → 21,1; pago 14,4; plaquinha 2024+2025 | eventos |
| "A maternidade municipal" / "A obra deve levar" / "Dos 17 milhoes" / "684 mil" | 143,1 / 148,2 / 150,4 / 153,8 | placa da obra; previsto 17,4 x pago 684 mil | maternidade |
| "No Tribunal de Contas uma" / "foi julgada improcedente" / "Sete processos" | 155,6 / 159,3 / 160,8 | prédio do TCM; chips | tribunal |
| "Gastar com festa" / "Mas numa cidade" / "por que a conta" / "Segue o" | 165,1 / 166,4 / 168,8 / 172,5 | mesa; gaveta dos eventos; @eumagnoleite | pergunta |
Repetições: "Gastou" (gancho não tem "gastou" de ano, sem risco); "a conta de eventos" aparece no gancho e na pergunta (gatilho do gancho usa "a conta de eventos ja passou", 1ª ocorrência; pergunta usa "por que a conta"); setores achados pela frase nome + número.

## Câmera
- Abertura: mapa (Kit Mapas) até 13,0 s, depois vista geral da mesa (dir [0, 1,4, 1]).
- Cada ano: cofre (enquadrar [0, 0,4, 1,3], 9,6 x 7,6, dir [dx, 1,2, 1]) → casinha a casinha (OLHA_SETOR, alvo na borda, 4,9 x 4,8, dir de dentro da mesa, y 0,95), sempre no mesmo sentido, segurando 0,55 s em cada uma; na virada de ano sobe (DE_CIMA, dir y 2,0) e recomeça.
- Repara: DE_CIMA → saúde (OLHA_SETOR 1,25) → assistência (1,15).
- Eventos: PB (dir y 1,1, baixa) na gaveta, torre a torre, abre para a gaveta inteira no "somados".
- Maternidade: placa de frente (dir y 0,95) → torres (PB).
- Tribunal: prédio (dir y 1,3). Pergunta: mesa → gaveta → mesa inteira.

## Fontes na tela (selos, um por bloco)
Balanço e Anexo 9 de 2024; Correio 08/01/2025 (decreto 5.432); Balanço e Anexo 9 de 2025; SIGA set/2026 (Prefeitura e Câmara); Anexo 9 de 2024 e 2025 (repara); Anexo 6 e SIGA set/2026 (eventos); A Tarde 07/05/2026 e SIGA set/2026 (maternidade); TCM-BA › Decisões › Auditoria (08/11/2026). Todos os números com arquivo e linha em audio/fontes.md.

## Sons
whoosh nas viradas de cena; tique na pílula; pop em cada setor e nos achados; subida no "gastou" de cada ano e no previsto que cresce; baque no déficit, na saúde e na assistência; ding na sobra e no "Segue"; impacto no pago e no "somados".

## Arquivos
- Novos: src/videos/orcamentolauro/OrcamentoLauro.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-lauro/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-lauro.py.
- Alterados (só acrescentei linhas): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de src/videos/orcamentoitabuna/pecas, orcamentocanavieiras/pecas, orcamentoparatinga/pecas (BaseGaveta, RuaPlaca), comum/SeloArroba.
