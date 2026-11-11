# Plano · 066. orçamento de Rio de Contas

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 3 renumerado: Rio de Contas = 066). TESTE DA RECEITA DETALHADA (regras 19 e 20).
- Código: `src/videos/orcamentoriodecontas/OrcamentoRioDeContas.tsx` (copiado do 064 Teixeira de Freitas, molde 035 Paratinga). Composições: OrcamentoRioDeContas, OrcamentoRioDeContasGuia, OrcamentoRioDeContasLimpo, CapaOrcamentoRioDeContas.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 17 partes unidas com 0,35 s, pausas 0,28 s, atempo 1,07, -15 LUFS → 171,69 s. AUDIO_SEG = 171.69; QUADROS = 5178.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-riodecontas` (IBGE 2926707, conferido na API: "Rio de Contas") → `mapas/riodecontas.mp4` (12,6 s). Satélite em pasta própria (`satelite/orcamento-riodecontas`, copiada da de Caetité, vizinha e já entregue, completada pelo `npm run tiles`). A etiqueta "PREFEITURA DE RIO DE CONTAS" entra em 7,1 s para não encostar nos chips do gancho.
- Selo do @eumagnoleite na abertura: `src/videos/comum/SeloArroba.tsx` (opção B), de 0,15 s a ~4 s. Marca d'água quicando o vídeo todo.

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). Cidade pequena: 1 MOEDA = R$ 200 MIL e 1 PILHA = R$ 2 MI (como o 035). 11 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras/limpeza/estradas (rua), Câmara, Dívidas (banco), Cultura (palco), Assistência social, Agricultura (trator), Esporte (campo; cinza em 2024, quando ficou em zero), Meio ambiente (casinha). Água e esgoto ficou fora da fala (R$ 0 / 758 / 758; só no fontes.md).
- 2024: torre-fantasma "SOBRA: R$ 395 MIL". 2025: torre-fantasma "SOBRA: R$ 10,9 MI". 2026: chip do empenhado "MAIS DO QUE ARRECADOU".
- NOVO (regra 19), 2026 "DE ONDE VEIO": gaveta na frente do cofre com quatro torres rosas que nascem uma de cada vez na palavra (CIDADE R$ 3,95 MI, UNIÃO R$ 41,7 MI, ESTADO R$ 7,2 MI, FUNDEB R$ 8,1 MI). No "O FPM", a plaquinha da União vira "FPM: R$ 23,5 MI · JÁ SEM A PARTE DO FUNDEB"; no "já sem os 5", nasce uma torre-fantasma vermelha "R$ 5,1 MI · DO FPM PARA O FUNDEB", que cresce para "R$ 6,3 MI · FOI PARA O FUNDEB" no "Com o ICMS"; no "Voltaram", a plaquinha do Fundeb acende "R$ 8,1 MI · VOLTOU DO FUNDEB". Tudo em reais, sem porcentagem. No "Gastou 54", a gaveta afunda e a pilha rosa nasce.
- NOVO (regra 20): plaquinha nova fica pelo menos 2,5 s (a do ano falado); as de relembrar saem 0,45 s depois que a voz passa ao próximo setor; no máximo 2 informações novas por vez (chip + 1 plaquinha, ou 2 plaquinhas).
- Achado de despesa (escolha do diretor, gancho): gaveta "CULTURA x ASSIST." no miolo (1 pilha = R$ 1 mi, uma por andar): cultura 2026 R$ 3,5 MI (rosa), a parte do convênio do Estado R$ 1,25 MI (azul) e a assistência social R$ 922 MIL (branca).
- Achado de receita (o único): gaveta "EMENDA PIX" ao lado: R$ 2,05 MI (infraestrutura urbana) e R$ 995 MIL (esporte), em azul; no "zero gasto", as duas plaquinhas saem e entra "R$ 0 · GASTO ATÉ SET/2026" (vermelho).
- Tribunal: prédio do TCM e duas pastas do Ministério Público: "CARNAVAL 2025" e "LIMPEZA · CONTRATO", carimbo "SEM JULGAMENTO" (dourado); no "o Tribunal suspendeu", a pasta da limpeza troca para "AUMENTO SUSPENSO" (vermelho). Sem nomes.
- Pergunta: as duas gavetas voltam lado a lado (cultura R$ 3,5 MI x assistência R$ 922 MIL; emenda R$ 3,04 MI esperando) e a mesa inteira no "Segue".

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "Rio de Contas gastou 2" / "Com toda a assistencia" | 0,0 / 1,30 / 3,98 | mapa Brasil → Rio de Contas; selo do @; chips do gancho (cultura R$ 2,8 MI; assistência R$ 1 MI) | mapa A |
| "Eu abri" / "Tribunal" | 6,0 / 8,02 | PREFEITURA DE RIO DE CONTAS (7,1 s); TCM-BA | mapa A |
| "2024 Arrecadou 65" / "Arrecadou 65" | 8,94 / 10,02 | 2024; R$ 65,2 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 64" / "Sobraram 400" | 12,02 / 14,22 | sai o mapa; cofre e pilha dourada; torre-fantasma | 2024 |
| setores 2024 ("Educacao 24" … "Meio ambiente 100") | 15,6–38,3 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou 72" / "Gastou 61" / "Sobraram 10" | 39,5 / 42,6 / 44,6 | sobe; pilha verde; torre-fantasma | 2025 |
| setores 2025 ("Educacao 21" … "Meio ambiente 200") | 46,6–67,0 | idem, com as plaquinhas de 2024 | 2025 |
| "2026 ate setembro" / "Arrecadou 60" / "De onde veio" | 69,1 / 70,6 / 72,4 | sobe; gaveta DE ONDE VEIO | 2026 |
| "Dos impostos da propria" / "Da Uniao 41" / "Do Estado 7" / "E do Fundeb" | 73,2 / 75,9 / 77,9 / 79,8 | as quatro torres, uma por vez | de onde veio |
| "O FPM maior repasse" / "ja sem os 5" / "Com o ICMS" / "Voltaram 8" | 82,8 / 87,0 / 89,4 / 93,3 | FPM; fantasma 5,1 → 6,3; voltou 8,1 | de onde veio |
| "Gastou 54" / "E ja empenhou" / "Mais do que arrecadou" / "Uma parte e folha" | 95,8 / 98,0 / 102,2 / 103,5 | gaveta afunda; pilha rosa; chips | 2026 |
| setores 2026 ("Educacao quase 20" … "Meio ambiente 170") | 105,5–124,1 | idem, com 2024 e 2025 | 2026 |
| "Agora repara na cultura" / "Quase tudo sai de duas" / "Em 2026 1 milhao e 250" / "Mesmo assim a cultura" | 125,8 / 127,1 / 130,6 / 134,9 | gaveta CULTURA x ASSIST.; torre da cultura; parte do Estado; assistência | cultura |
| "E tem dinheiro esperando" / "Em maio chegaram 3" / "2 milhoes para infraestrutura" / "essa fonte aparece com zero" / "A prefeitura abriu licitacoes" / "as contas nao dizem" | 138,1 / 139,3 / 143,3 / 146,7 / 148,2 / 150,6 | gaveta EMENDA PIX; torres; R$ 0 gasto; chips | emenda |
| "No Tribunal de Contas o Ministerio" / "e o contrato da limpeza" / "ainda sem julgamento" / "Segundo o Bahia Noticias" / "o Tribunal suspendeu" | 152,4 / 156,1 / 157,5 / 158,9 / 160,7 | TCM; pastas; carimbos | tribunal |
| "Cultura importa" / "Mas se ela ja leva" / "e 3 milhoes de emenda esperam" / "Segue o" | 163,6 / 164,6 / 166,7 / 168,9 | mesa; as duas gavetas; @eumagnoleite | pergunta |
Repetições: "Saude 16 milhoes e 100" (2024 e 2025: 2ª ocorrência em 2025); "Obras limpeza e estradas 6 milhoes e 800" (2025 e 2026: 2ª em 2026); "Camara" e "Dividas" pela frase com o número. Todos os gatilhos conferidos com tsx: existem e estão em ordem.

## Câmera
- Abertura: mapa (Kit Mapas) até 12,0 s, depois vista geral da mesa.
- Cada ano: cofre (9,6 x 7,6, dir y 1,2) → casinha a casinha (OLHA_SETOR), sempre no mesmo sentido; virada de ano sobe (DE_CIMA) e recomeça.
- De onde veio, cultura e emenda: câmera alta (dir y 1,7 a 1,8), para o fundo ser a mesa. Tribunal: prédio e as duas pastas (dir y 1,4–1,5), depois a pasta da limpeza de frente. Pergunta: mesa → cultura → as duas gavetas → mesa inteira.

## Fontes na tela (selos, um por bloco)
Balanço e Anexo 9 de 2024; Balanço e Anexo 9 de 2025; SIGA set/2026 receita (PCMGE016); SIGA set/2026 Prefeitura e Câmara; SIGA set/2026 ações da cultura; SIGA set/2026 + TransfereGov + Portal da Transparência (emenda); PNCP (licitações); TCM-BA › Decisões › Auditoria (08/11/2026); Bahia Notícias, 26/10/2026. Todos os números com arquivo e linha em audio/fontes.md.

## Sons
whoosh nas viradas de cena; tique na pílula; pop em cada setor, em cada entrada do "de onde veio" e nos achados; subida no "gastou" de cada ano e no "Voltaram"; ding nas sobras e no "Segue"; baque no "foi para o Fundeb", no "mais do que arrecadou" e no "zero gasto"; impacto no "mais de três vezes" e no "aumento suspenso".

## Arquivos
- Novos: src/videos/orcamentoriodecontas/OrcamentoRioDeContas.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-riodecontas/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-riodecontas.py.
- Alterados (só acrescentei linhas): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de src/videos/orcamentoitabuna/pecas, orcamentocanavieiras/pecas, orcamentoparatinga/pecas (BaseGaveta, PastaProcesso), comum/SeloArroba.

## Revisão (08/11/2026)
- v1 (83 quadros, antigos/revisao v1) → corrigido: (1) com a regra dos 2,5 s, as plaquinhas de relembrar (anos anteriores) do setor de trás ficavam na tela quando a voz já estava no próximo setor: agora só a do ano falado completa 2,5 s; as outras saem 0,45 s depois; (2) nos blocos do miolo a câmera estava baixa (dir y 1,15–1,25) e as casinhas e torres da borda apareciam atrás do cabeçalho e grandes na frente: subiu para 1,7–1,8; (3) no Tribunal a pasta do carnaval quase não aparecia: plano com as duas pastas no "ainda sem julgamento".
- ★ Melhorias de atenção (regra 14): chips do gancho no mapa (cultura x assistência de 2025); as pastas do Ministério Público com carimbo que muda com a fala ("SEM JULGAMENTO" → "AUMENTO SUSPENSO"); impacto no "mais de três vezes"; a fantasma do que foi para o Fundeb que cresce de 5,1 para 6,3.

## Regra 22 (08/11/2026, depois da revisão v3)
- Fala nova nos parágrafos 8 e 9 (IPTU, iluminação pública, saúde da União e do Estado; FPM mais curto). Gatilhos novos: "O IPTU previa" (72,98), "A iluminacao publica" (77,26), "sendo 4 milhoes e 900" (81,22), "com 535" (85,04), "chega sem a parte" (91,80). Todos os tempos do vídeo mudaram (AUDIO_SEG 174,41; QUADROS 5259); mapa refeito.
- Tela: plaquinhas "IPTU: R$ 175 MIL · PREVISTO NO ANO: R$ 298 MIL" e "R$ 13,9 MIL · ILUMINAÇÃO PÚBLICA" na torre da cidade (uma depois da outra, 2,5 s ou mais); "SAÚDE: R$ 4,9 MI · SUS DA UNIÃO" e "SAÚDE: R$ 535 MIL · SUS DO ESTADO" na frente das torres da União e do Estado (azul); chip "SUS DA UNIÃO: R$ 4,9 MI (NO FNS, R$ 5,6 MI: DATA OU CÓDIGO?)". Revisão v4 (87 quadros) aprovada.
