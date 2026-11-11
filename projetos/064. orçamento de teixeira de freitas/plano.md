# Plano · 064. orçamento de Teixeira de Freitas

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 3, renumerado: Teixeira = 064).
- Código: `src/videos/orcamentoteixeira/OrcamentoTeixeira.tsx` (copiado do 063 Lauro de Freitas, molde 035 Paratinga). Composições: OrcamentoTeixeira, OrcamentoTeixeiraGuia, OrcamentoTeixeiraLimpo, CapaOrcamentoTeixeira.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 16 partes unidas com 0,35 s, pausas 0,28 s, atempo 1,112, -15 LUFS → 173,88 s. AUDIO_SEG = 173.88; QUADROS = 5243.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-teixeira` (IBGE 2931350, conferido na API: "Teixeira de Freitas") → `mapas/teixeira.mp4` (13,3 s). Satélite em pasta própria (`satelite/orcamento-teixeira`, copiada da de Caravelas, vizinha e já entregue, mesma AREA_DE_PERTO, completada pelo `npm run tiles`).
- Selo do @eumagnoleite na abertura: `src/videos/comum/SeloArroba.tsx` (opção B, regra 15c/18), de 0,15 s a ~4 s. Marca d'água quicando o vídeo todo.

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). Cidade grande (R$ 0,5 a 0,7 bilhão): 1 MOEDA = R$ 1 MI e 1 PILHA = R$ 10 MI (como Camaçari e Jequié; cada ano usa de 52 a 71 dos 93 lugares do anel). O placar diz a escala. A cada setor falado, as pilhas voam para a casinha. 10 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua), Câmara, Dívidas e encargos (banco), Cultura e festas (palco), Assistência social, Esporte (campo), Meio ambiente (casinha). Agricultura ficou fora da fala (1,1 a 1,4 mi, por tempo); segurança e trânsito fora pela regra do perfil; água é da Embasa. Nenhum setor zerado.
- 2024: torre-fantasma "SOBRA: R$ 25,5 MI" (Balanço: superávit). 2025: torre-fantasma "SOBRA: QUASE R$ 19 MI". 2026: torre VERMELHA "R$ 99 MI DE EMPRÉSTIMO" na frente do cofre (na fala "Desse total, 99 milhões são empréstimo"), chip do empenhado "MAIS DO QUE ENTROU".
- ★ Escolha do diretor: o achado é a dívida, não as festas (festas somam até R$ 1,3 mi). Três gavetas no miolo, uma de cada vez, no mesmo lugar (1 pilha = R$ 5 mi, torres de 2 x 2):
  1. "EMPRÉSTIMOS": 2024 R$ 32,5 mi (dourado); placa "LEIS 1.360 E 1.361 · ABRIL/2025 · ATÉ R$ 50 MI CAIXA · ATÉ R$ 50 MI BANCO DO BRASIL" na frente, só enquanto a voz fala delas; 2026 R$ 99 mi (rosa) com impacto. Chip "AS CONTAS NÃO DIZEM DE QUAL BANCO".
  2. "PAVIMENTAÇÃO 2026": previsto (fantasma) que CRESCE de R$ 40,1 para R$ 92,1 mi na palavra "Subiu", gasto até setembro R$ 58,3 mi (rosa) e a parte com dinheiro de empréstimo R$ 46,2 mi (vermelho).
  3. "PARCELAS DE DÍVIDAS": 2024 quase R$ 42 mi, 2025 R$ 48,5 mi, 2026 até set. R$ 43,5 mi; ao lado do 2025, a assistência social de 2025 (R$ 9,2 mi, branca) em "mais de cinco vezes".
- Tribunal: prédio do TCM aceso, chips "LICITAÇÃO DA LIMPEZA URBANA 2026: 5 DENÚNCIAS", "30/07/2026: RELATORA SUSPENDE", "10/08/2026: SUSPENSÃO REVOGADA", "SEM JULGAMENTO". Sem nomes.
- Pergunta: volta à gaveta das parcelas e, ao lado, a "dívida nova" (R$ 99 mi, fantasma vermelho) nasce no "quanto vai custar".
- ★ Melhorias de atenção (regra 14): no gancho, os chips "2026: R$ 99 MI DE EMPRÉSTIMO" e "PARCELAS DE DÍVIDAS: MAIS DE R$ 40 MI POR ANO" entram no mapa junto da fala, com baque leve; a torre do previsto da pavimentação CRESCE na palavra "Subiu" com som de subida; impacto nos 99 mi e na parte de empréstimo.

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "recebeu 99" / "E todo ano paga" | 0,0 / 0,98 / 3,46 | mapa Brasil → Teixeira; selo do @; chips do gancho | mapa A |
| "Eu abri" / "Tribunal" | 6,2 / 7,74 | PREFEITURA DE TEIXEIRA DE FREITAS; TCM-BA | mapa A |
| "2024 A prefeitura" / "arrecadou 666" | 8,76 / 10,30 | 2024; R$ 666,6 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 641" / "Sobrou 25" | 12,78 / 14,96 | sai o mapa; cofre e pilha dourada; torre-fantasma | 2024 |
| setores 2024 ("Educacao 190" … "Meio ambiente 2 milhoes e 900") | 17,0–39,2 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou 706" / "Gastou 687" / "Sobra de quase 19" | 41,7 / 45,1 / 47,7 | sobe; pilha verde; torre-fantasma | 2025 |
| setores 2025 ("Educacao 226" … "Meio ambiente 2 milhoes e 200") | 49,8–72,0 | idem, com as plaquinhas de 2024 juntas | 2025 |
| "2026 ate setembro Arrecadou" / "Desse total 99" / "Gastou 534" / "E ja empenhou" / "Mais do que entrou" / "Uma parte e folha" | 74,5 / 78,8 / 80,8 / 82,9 / 87,0 / 88,1 | sobe; torre vermelha do empréstimo; pilha rosa; chips | 2026 |
| setores 2026 ("Educacao 170" … "Meio ambiente 2 milhoes e 200", 2ª) | 89,9–110,0 | idem, com 2024 e 2025 juntas | 2026 |
| "Agora repara" / "Em 2024 entraram 32" / "Em abril de 2025" / "Ate 50 … Caixa" / "ate 50 … Banco" / "Em 2026 entraram 99" / "As contas nao dizem" | 111,9 / 113,3 / 116,0 / 119,1 / 120,9 / 123,9 / 126,5 | gaveta EMPRÉSTIMOS; torre 2024; placa das leis; torre 2026 | empréstimos |
| "A conta de pavimentacao" / "Subiu para 92" / "gastou 58" / "Desse valor 46" | 128,9 / 133,2 / 135,4 / 137,0 | gaveta PAVIMENTAÇÃO; previsto 40,1 → 92,1; gasto 58,3; empréstimo 46,2 | pavimentação |
| "E a divida tem preco" / "a prefeitura pagou quase 42" / "Em 2025 48" / "Em 2026 ate setembro 43" / "as parcelas foram mais de cinco" | 141,0 / 143,4 / 146,1 / 148,8 / 153,6 | gaveta PARCELAS; 3 torres; assistência 2025 | parcelas |
| "No Tribunal de Contas a licitacao" / "Em julho" / "Em agosto liberou" / "As denuncias ainda" | 156,4 / 160,8 / 162,4 / 165,2 | prédio do TCM; chips | tribunal |
| "Emprestimo nao e crime" / "Mas se as parcelas" / "quanto vai custar" / "Segue o" | 167,0 / 168,1 / 170,3 / 171,6 | mesa; gaveta das parcelas; dívida nova; @eumagnoleite | pergunta |
Repetições: "Meio ambiente 2 milhões e 200" (2025 e 2026: a de 2026 usa a 2ª ocorrência); "Câmara" (4 vezes: cada ano pela frase com o número); "Em 2024"/"Em 2025"/"Em 2026" (achados pela frase completa); "99" (gancho, 2026 e empréstimos: frases únicas). Todos os 69 gatilhos conferidos com tsx: existem e estão em ordem.

## Câmera
- Abertura: mapa (Kit Mapas) até 12,8 s, depois vista geral da mesa.
- Cada ano: cofre (9,6 x 7,6, dir y 1,2) → casinha a casinha (OLHA_SETOR), sempre no mesmo sentido, segurando 0,55 s; virada de ano sobe (DE_CIMA) e recomeça. 2026: cofre com a torre vermelha na frente.
- Achados: câmera alta (dir y 2,1, para o fundo ser a mesa), torre a torre; placa das leis de frente (dir y 1,9).
- Tribunal: prédio (dir y 1,3). Pergunta: mesa → gaveta das parcelas → mesa inteira.

## Fontes na tela (selos, um por bloco)
Balanço e Anexo 9 de 2024; Balanço e Anexo 9 de 2025; SIGA set/2026 (Prefeitura e Câmara); Balanço e Anexo 10 de 2024 (empréstimo de 2024); Leis 1.360 e 1.361 de 11/04/2025; SIGA set/2026 receita consolidada; SIGA set/2026 ação de pavimentação; Balanços 2024/2025 e SIGA set/2026 (parcelas); TCM-BA › Decisões › Auditoria (08/11/2026). Todos os números com arquivo e linha em audio/fontes.md.

## Sons
whoosh nas viradas de cena; tique na pílula; pop em cada setor e nos achados; subida no "gastou" de cada ano e no previsto que cresce; ding nas sobras e no "Segue"; baque no empréstimo de 2026 (torre), no "mais do que entrou" e no "cinco vezes"; impacto nos 99 mi e nos 46,2 mi.

## Arquivos
- Novos: src/videos/orcamentoteixeira/OrcamentoTeixeira.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-teixeira/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-teixeira.py.
- Alterados (só acrescentei linhas): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de src/videos/orcamentoitabuna/pecas, orcamentocanavieiras/pecas, orcamentoparatinga/pecas (BaseGaveta, RuaPlaca), comum/SeloArroba.

## Ajustes feitos na programação (revisão, 08/11/2026)
- v1 (75 quadros, antigos/revisao v1) → corrigido: a placa das leis (RuaPlaca) saía pequena e ilegível atrás da torre de 2024: placa movida para z 2,3, câmera baixa e de frente (alvo na placa, 3,1 de largura, dir y 0,8) e a gaveta dos empréstimos afunda enquanto a placa está na tela; no "cinco vezes" as 4 plaquinhas se empilhavam: ficam só a de 2025 e a da assistência; câmera da pergunta mais perto (5,4 a 5,8 em vez de 7,2); plaquinha de 2024 das parcelas com o valor exato "R$ 41,97 MI" (a fala diz "quase 42").
- ★ Melhoria de atenção (regra 14): no Tribunal entrou a pasta "LIMPEZA URBANA 2026 · 5 DENÚNCIAS" ao lado do prédio, com o carimbo que muda junto com a fala: SUSPENSA (vermelho) → LIBERADA (verde) → EM ANÁLISE (dourado). Antes, a cena era só o prédio.
- v2 (22 quadros refeitos nos trechos corrigidos) aprovada no modo autônomo. Abertura (0 a 4 s): o selo do @ fica acima da cidade e dos chips do gancho, sem tapar nada.
