# Plano de cenas: 028. ilhéus volta atrás (versão 1, aprovada em 05/11/2026)

Código `ilheusvolta` · Nome `IlheusVolta` · Perfil @eumagnoleite (acento verde, `tema.acento`). Continuação do 009.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs, arquivo de 05/11 08:35) · preparo: 1,2x, pausas de no máximo 0,35 s, volume -15 · duração **72,54 s** · `AUDIO_SEG = 72.54` · `QUADROS = 2203`.
- 212 palavras na legenda (215 do roteiro, com "arroba eu magno leite" virando `@eumagnoleite`); a última ("informações.") termina em 72,14 s.
- Ajuste da sincronia: o Whisper inventou uma repetição de 26 palavras com duração zero em 29,98 s (a voz está certa). Apagadas do `palavras.json`; original em `transcricao/palavras-original.json`.
- Palavras repetidas: "Trânsito" (4,68 · 25,82 · 31,40), "nomeação" (21,26 · 26,80 · 35,62), "exoneração" (14,42 · 29,66), "Nal" (3,48 · 23,28 · 27,50), "secretária de Saúde" (1,56 · 16,68), "decretos" (11,98 · 39,74), "republicad" (44,32 · 52,68), "semana" (12,62 · 19,68 · 67,50), "gabinete" (47,14 · 58,00). No código, sempre pelo trecho com a palavra vizinha (`quando('Primeiro')`, `quando('Sem a nomeação')`, `quando('dois decretos')`).

## 2.2 Ideia e mundo

**A mesma praça do 009, uma semana depois.** O tabuleiro com os 21 tablados, a Prefeitura no fundo, a cerca, o portão de ENTRADA, o portão de SAÍDA e a calçada "FICARAM DE FORA" voltam iguais, para quem viu o primeiro vídeo reconhecer na hora. O vídeo **começa do jeito que o 009 terminou**: Nal sentado no Trânsito, Fabrício na Maramata, Sonilda na calçada de fora, a cadeira da Saúde vazia com "?", Hermano tracejado nos Serviços Urbanos. Os outros tablados têm bonecos neutros sentados, para a praça parecer cheia.

**Peça nova:** a **Câmara Municipal**, um prédio público fora da cerca, do lado do portão de ENTRADA, com o letreiro "CÂMARA MUNICIPAL". É para onde o Nal volta.

**O código de cores do 009 continua**, e ganha uma marca nova para este vídeo:

| O que | Cor e movimento |
|---|---|
| Volta atrás (os 3 decretos sem efeito) | **carimbo "SEM EFEITO"** em `tema.acento` sobre o carimbo antigo (EXONERADA ou NOMEADO), que fica riscado; o boneco anda no caminho de volta |
| Correção (republicação) | etiqueta "REPUBLICADO" em `tema.objetoClaro`, sem movimento grande |
| Chegaram agora | azul (`festa.azul`), entram pelo portão de ENTRADA, como no 009 |

**Placar fixo** (a partir da cena 2), no alto: `SEM EFEITO 0/3 · CORRIGIDOS 0/5 · CHEGARAM 0/2`. Cada um soma na hora da fala.

**Cartão de nomes** embaixo (como no 009): nome completo, número do decreto e o que mudou ("DEC. 670 · EXONERAÇÃO SEM EFEITO · SEGUE NA SAÚDE").

**Mapa do mundo** (igual ao 009; 1 unidade = 1 m; tablados a 5,6 m um do outro):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Praça, cerca, portões, calçadas, Prefeitura | as mesmas do 009 | reaproveitadas de `src/videos/mudancasilheus/pecas.tsx` |
| SAÚDE | [−5,6, 0, 11,2] | cadeira grande com "?" no início |
| TRÂNSITO | [−5,6, 0, 5,6] | Nal sentado na cadeira grande |
| MARAMATA | [0, 0, 5,6] | Fabrício sentado na cadeira grande |
| GABINETE · COMUNICAÇÃO | [0, 0, 16,8] | Thaise na cadeira da fotografia |
| POLÍTICAS P/ MULHERES | [0, 0, 0] | recebe Beatriz Nora |
| EDUCAÇÃO | [−5,6, 0, 0] | recebe Cézio Galo (com placa pequena "CRECHE DOM EDUARDO") |
| SERVIÇOS URBANOS | [0, 0, 11,2] | Hermano tracejado com "?" |
| Câmara Municipal (nova) | [−15, 0, −2] | fora da cerca, do lado do portão de ENTRADA, virada para a praça |
| Diário Oficial gigante | na frente da Prefeitura | "EDIÇÃO Nº 264 · 04/11/2026" |
| Três folhas de decreto | em pé na frente do Diário (cena 2) | 670 · 680 · 627 |

**Regras visuais**
- Pessoas reais só como boneco genérico, sem rosto, todos com o mesmo corpo.
- Neutralidade: "sem efeito" é só um carimbo, sem cor de "erro" ou de "vitória". Sem tom de crítica ao prefeito.
- O acento verde vai só nos carimbos SEM EFEITO e nas duas cadeiras do Fabrício na cena 5.
- Nada pisca: carimbos e cores mudam em 0,4 s.

## 2.3 Mapa de palavras-chave

Tempos do `palavras.ts`. ★ = extra sugerido pelo diretor.

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Ilhéus voltou atrás` | 0,00 | praça inteira ★ | a câmera "rebobina": giro rápido e suave para trás sobre o tabuleiro; chip "VOLTOU ATRÁS" | 1 |
| 2 | `secretária de Saúde` | 1,56 | cadeira da SAÚDE | a cadeira vazia acende; o "?" gira | 1 |
| 3 | `ficou` | 2,30 | "?" da Saúde | o "?" vira um ✓; chip "SAÚDE: FICOU" | 1 |
| 4 | `vereador Nal` | 3,12 | Nal no TRÂNSITO | o boneco ganha a etiqueta NAL e fica de pé | 1 |
| 5 | `não vai mais` | 3,76 | cadeira do Trânsito | a cadeira apaga; chip "NAL: NÃO VAI MAIS" | 1 |
| 6 | `Diário Oficial` | 5,74 | Diário gigante | desce na frente da Prefeitura | 2 |
| 7 | `4 de novembro` | 6,54 | Diário | data acende: "04/11/2026" | 2 |
| 8 | `264` | 7,94 | Diário | o número 264 sobe da página; selo S1 | 2 |
| 9 | `Valderico Júnior` | 9,92 | boneco ★ | boneco genérico na porta da Prefeitura, placa "VALDERICO JÚNIOR · PREFEITO" | 2 |
| 10 | `tornou sem efeito` | 11,08 | três folhas | três folhas de decreto saem do Diário e ficam em pé | 2 |
| 11 | `três decretos` | 11,62 | folhas | cada folha ganha o número (670 · 680 · 627) e o carimbo SEM EFEITO, uma por vez; placar "SEM EFEITO 3" aparece | 2 |
| 12 | `semana passada` | 12,62 | ★ | etiqueta pequena "DIÁRIO Nº 260 · 29/10" atrás das folhas | 2 |
| 13 | `Primeiro` | 13,58 | folha 670 | voa até a cadeira da SAÚDE | 3 |
| 14 | `exoneração de Sonilda` | 14,42 | Sonilda na calçada | etiqueta "SONILDA MELLO" e o carimbo EXONERADA aparece em cima dela | 3 |
| 15 | `Mello` | 15,50 | carimbo | carimbo SEM EFEITO cobre o EXONERADA (risco no antigo); placar 1/3 | 3 |
| 16 | `continua secretária` | 16,28 | Sonilda | volta pela SAÍDA, cruza a praça e senta na cadeira grande da SAÚDE | 3 |
| 17 | `assinou portaria` | 18,10 | folha ★ | uma folha pequena "PORTARIA Nº 462" sobe da mesa dela; selo S2 | 3 |
| 18 | `Segundo` | 20,40 | folha 680 | voa até o TRÂNSITO | 4 |
| 19 | `nomeação de Ednaldo` | 21,26 | Nal | carimbo NOMEADO em cima dele; etiqueta "EDNALDO LOPES (NAL)" | 4 |
| 20 | `vereador Nal` (2ª vez) | 22,90 | Câmara ★ | a Câmara Municipal acende fora da cerca | 4 |
| 21 | `Autarquia de Transporte` | 24,60 | placa TRÂNSITO | a placa do tablado vira "AUTARQUIA DE TRANSPORTE E TRÂNSITO" | 4 |
| 22 | `Sem a nomeação` | 26,44 | carimbo | SEM EFEITO cobre o NOMEADO; placar 2/3 | 4 |
| 23 | `segue na Câmara` | 27,72 | Nal | levanta, sai pelo portão de ENTRADA e entra na Câmara; a cadeira do Trânsito fica vazia por um instante | 4 |
| 24 | `Terceiro` | 28,78 | folha 627 | voa até o TRÂNSITO | 5 |
| 25 | `Fabrício Nascimento` | 30,34 | Fabrício na MARAMATA | etiqueta "FABRÍCIO NASCIMENTO" | 5 |
| 26 | `do Trânsito` | 31,40 | cadeira do Trânsito | carimbo EXONERADO aparece na cadeira vazia | 5 |
| 27 | `Ou seja` | 32,00 | carimbo | SEM EFEITO cobre o EXONERADO; placar 3/3 | 5 |
| 28 | `continua na direção` | 32,74 | Fabrício | pula da Maramata de volta para a cadeira grande do TRÂNSITO | 5 |
| 29 | `Mas repara` | 34,80 | câmera | a câmera sobe e mostra os dois tablados lado a lado | 5 |
| 30 | `Maramata` | 36,62 | cadeira da Maramata | um Fabrício **tracejado** fica na cadeira da Maramata, com o carimbo NOMEADO (decreto 727) ainda de pé | 5 |
| 31 | `não foi anulada` | 37,00 | carimbo 727 | o carimbo 727 fica sem risco; chip "DECRETO 727 NÃO FOI ANULADO" | 5 |
| 32 | `dois decretos valem` | 39,54 | as duas cadeiras | as duas acendem em verde, com uma linha no chão entre elas; chip "NO PAPEL: 2 CARGOS" | 5 |
| 33 | `E teve correção` | 40,58 | pílula | pílula "CORREÇÕES"; a câmera vai para GABINETE · COMUNICAÇÃO | 6 |
| 34 | `Thaise` | 41,90 | Thaise | etiqueta "THAISE" na cadeira da fotografia | 6 |
| 35 | `fotografia` | 42,90 | cadeira | a plaquinha "FOTOGRAFIA" ganha um risco | 6 |
| 36 | `republicado` | 44,32 | Thaise | etiqueta REPUBLICADO; placar CORRIGIDOS 1/5 | 6 |
| 37 | `chefe da Divisão de Jornalismo` | 45,64 | Thaise | pula para a cadeira do jornalismo; plaquinha "CHEFE · DIVISÃO DE JORNALISMO · DEC. 689" | 6 |
| 38 | `Bruna` | 48,52 | calçada | os quatro bonecos da Promoção Social na calçada acendem, um por nome (Bruna, Lucas, Juliana Amaral, Fernando) | 6 |
| 39 | `republicadas` (2ª vez) | 52,68 | os quatro | etiqueta REPUBLICADO em cada um; placar 5/5 | 6 |
| 40 | `31 de outubro` | 54,22 | calendário ★ | folha de calendário "31 OUT" em pé na calçada; chip "VALE DESDE 31/10" | 6 |
| 41 | `Quem chegou agora` | 55,56 | portão ENTRADA | portão acende; dois bonecos azuis na fila | 7 |
| 42 | `Beatriz Nora` | 56,58 | azul | entra e senta em POLÍTICAS P/ MULHERES; placar CHEGARAM 1/2 | 7 |
| 43 | `assessora de gabinete` | 57,26 | etiqueta | "ASSESSORA III DE GABINETE · DEC. 754" | 7 |
| 44 | `Cézio Galo` | 59,86 | azul | entra e senta na EDUCAÇÃO; placar 2/2 | 7 |
| 45 | `creche Dom Eduardo` | 61,52 | placa ★ | plaquinha "CRECHE DOM EDUARDO" ao lado da cadeira dele; etiqueta "VICE-DIRETOR · DEC. 753" | 7 |
| 46 | `o que ainda falta` | 62,96 | SERVIÇOS URBANOS | câmera vai até o Hermano tracejado; o "?" gira | 8 |
| 47 | `Hermano Fahning` | 64,50 | Hermano | etiqueta "HERMANO FAHNING" | 8 |
| 48 | `não saiu` | 66,16 | carimbo | chip "AINDA SEM DECRETO"; selo "DIÁRIOS Nº 263 E 264" | 8 |
| 49 | `Salva esse vídeo` | 68,14 | cartão | cartão final "SALVA PRA CONSULTAR" | 9 |
| 50 | `@eumagnoleite` | 70,06 | cartão | "@eumagnoleite" acende | 9 |
| 51 | `mais informações` | 71,42 | cartão | linha "PARA MAIS INFORMAÇÕES" | 9 |

51 eventos em 72 s (cerca de 1 a cada 1,4 s).

## 2.4 Cenas com câmera

Enquadramento automático da base (alvo + tamanho + direção). A câmera nunca para.

| Cena | Pílula | Tempo (s) | Câmera (início → fim) |
|---|---|---|---|
| 1. O gancho | VOLTOU ATRÁS | 0,00 a 5,30 | vista alta do tabuleiro inteiro girando de leve no sentido contrário (o "rebobinar"); desce até enquadrar Saúde e Trânsito juntos (os dois ficam na mesma coluna) |
| 2. O Diário | DIÁRIO OFICIAL Nº 264 | 5,30 a 13,40 | baixa no Diário na frente da Prefeitura (35°), recua para mostrar as três folhas em pé |
| 3. A Saúde | 1. SAÚDE | 13,40 a 20,30 | segue a folha até a SAÚDE; de lado (de x +, 38°) para ver Sonilda vindo da SAÍDA até a cadeira; fecha na cadeira |
| 4. O Nal | 2. TRÂNSITO | 20,30 a 28,70 | TRÂNSITO de frente (32°); no fim, arco para a esquerda acompanhando o Nal até a Câmara |
| 5. O Fabrício | 3. TRÂNSITO E MARAMATA | 28,70 a 40,50 | TRÂNSITO e MARAMATA lado a lado (de frente, 36°), avanço lento; em "Mas repara" sobe para 50° mostrando as duas cadeiras e a linha entre elas |
| 6. Correções | CORREÇÕES | 40,50 a 55,40 | close em GABINETE · COMUNICAÇÃO (de lado, 34°); depois do lado da SAÍDA, na calçada, com os quatro da Promoção Social |
| 7. Chegaram | CHEGARAM | 55,40 a 62,60 | do lado do portão de ENTRADA (de x −, 36°), arco até MULHERES e EDUCAÇÃO |
| 8. Ainda falta | AINDA FALTA | 62,60 a 68,00 | avança para SERVIÇOS URBANOS, de frente, 30° |
| 9. Final | SALVA ESTE VÍDEO | 68,00 a 73,44 | sobe até a vista de cima do tabuleiro todo, devagar |

## 2.5 Fatos e fontes

- Decretos 670, 680 e 627 sem efeito: Diário Oficial nº 264 (04/11/2026), páginas 14 a 16.
- Portaria 462 assinada por Sonilda como Secretária de Saúde: Diário nº 263 (03/11/2026), página 2.
- Fabrício na Maramata: Decreto 727 (Diário nº 260), sem ato anulando nas edições 263 e 264.
- Thaise: republicação do Decreto 689 (Diário nº 264, página 10). Bruna, Lucas, Juliana Amaral e Fernando: Decretos 655, 660, 661 e 662 republicados, valendo desde 31/10 (páginas 6 a 9).
- Beatriz Nora: Decreto 754. Cézio Galo: Decreto 753 (Diário nº 264, páginas 1 e 2).
- "Nal segue na Câmara": informação da pessoa e do vídeo 009; o Diário não fala da Câmara.
- Selos na tela: S1 "DIÁRIO OFICIAL DE ILHÉUS Nº 264 · 04/11/2026"; S2 "PORTARIA Nº 462 · DIÁRIO Nº 263 · 03/11/2026"; S3 "DIÁRIOS Nº 263 E 264".
- **Conferir antes de publicar:** edições 261 e 262; algum ato novo sobre a Maramata; o Nal na Câmara.

## 2.6 Trilha e sons

`whoosh` na troca de cena; `tique` na pílula; `impacto` em cada carimbo SEM EFEITO (3); `baque` nos carimbos antigos (EXONERADA, NOMEADO); `pop` quando alguém senta e nos números do placar; `ding` no "dois decretos valem" e no "Salva esse vídeo"; `bip` no "AINDA SEM DECRETO". Sem trilha de música.

## 2.7 Arquivos

- **Novos:** `src/videos/ilheusvolta/IlheusVolta.tsx` (mundo, pessoas, câmeras, interface, sons, capa) e `palavras.ts` (pronto).
- **Reaproveitados:** do 009, `Tablado`, `PlacaOrgao`, `Cadeirinha`, `PortaoPlaca`, `Cerca`, `Calcada`, `Folha` e `Interrogacao` (`src/videos/mudancasilheus/pecas.tsx`); do catálogo, `Cadeira`, `DiarioOficial`, `Fantasma`, `OrgaoPublico`, `Boneco`, `Placa`, `Trilha`, `Onda`.
- **Alterado:** `src/Root.tsx` (`IlheusVolta`, `IlheusVoltaGuia`, `IlheusVoltaLimpo`, `CapaIlheusVolta`).
- 2.203 quadros, render em partes pelo `render.mjs`.

## 2.8 Origem das escolhas

- **Das regras:** uma animação por palavra-chave; câmera sempre andando; selo de fonte na hora do dado; pessoa real só como boneco genérico; nada piscando; nomes conferidos no Diário antes da voz (009).
- **Do 009 (você amou):** um tablado por órgão, um boneco por pessoa, cores fixas por grupo, placar fixo, cartão de nomes com o número do decreto.
- **Escolha do diretor:** começar do jeito que o 009 terminou; o carimbo SEM EFEITO cobrindo o carimbo antigo; a Câmara Municipal fora da cerca; o Fabrício tracejado na Maramata para mostrar os "dois decretos no papel"; o ✓ no lugar do "?" da Saúde; o calendário "31 OUT".

**Título da capa (aprovado):** "Ilhéus / voltou atrás. / Nal fora, / Saúde fica."
