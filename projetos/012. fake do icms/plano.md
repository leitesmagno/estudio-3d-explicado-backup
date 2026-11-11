# Plano de cenas: 012. fake do icms (versão 1, aprovada em 31/10/2026)

Código `fakeicms` · Nome `FakeIcms` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Lendário (ElevenLabs v3) · preparo: pausas de no máximo 0,35 s, 1,2x, volume -15 · duração **99,21 s** · `AUDIO_SEG = 99.21` · `QUADROS = 3003` (com 0,9 s de folga).
- 304 palavras; a última ("informações.") termina em 98,88 s. Tempos sempre sobem, sem buraco maior que 1,5 s.
- A duração passou um pouco da faixa de 55 a 95 s. O 010 teve 105 s e foi bem, então seguimos.
- Ajustes da sincronia: o último parágrafo foi regerado e emendado (a primeira voz parou em "magno leite p..."); "ICM esse" → ICMS; valores em reais juntados; "R$ 0,75 / 0,25 / 0,20" → "75 / 25 / 20 centavos"; "arroba e o Magno Leite" → `@eumagnoleite`. Cópia do original em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo para cada uma):

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| fábrica | 0,18 · 55,24 | `quando('fabrica de fake')` · `quando('a fabrica nao conta')` |
| ICMS | 10 vezes | sempre com trecho longo: `quando('o ICMS da gasolina')`, `quando('Mas o ICMS')`, `quando('decide o ICMS')`, `quando('aprovaram')` + 0,4 etc. |
| estados | 16,32 · 23,04 · 29,78 · 47,24 · 49,78 | `quando('imposto dos estados')` · `quando('26 estados')` · `quando('sao os estados')` · `quando('os estados baixarem')` · `quando('Os estados disseram')` |
| Lula | 9,86 · 46,20 | `quando('culpa no Lula')` · `quando('o Lula tinha')` |
| decidiu / decide | 8,32 · 90,66 / 28,12 · 87,54 | `quando('esconde quem decidiu')` · `quando('confere quem decidiu')` / `quando('quem decide o')` · `quando('quem decide e')` |
| R$ | 33,58 · 35,18 · 38,24 · 39,62 · 41,85 · 58,16 | pelos valores: `quando('1,57')`, `quando('1,64')`, `quando('1,17')`, `quando('1,30')`, `quando('0,91')`, `quando('De cada R$')` |
| centavos | 60,02 · 62,40 · 81,42 | `quando('75 centavos')` · `quando('25 centavos')` · `quando('20 centavos')` |
| cada | 57,92 · 69,08 · 79,68 | `quando('De cada R$')` · `quando('cada cidade')` · `quando('E de cada real')` |
| cidade | 69,34 · 78,24 · 92,58 | `quando('cada cidade produz')` · `quando('a cidade pode')` · `quando('da sua cidade')` |
| escola | 76,18 · 92,06 | `quando('a escola melhora')` · `quando('a escola da sua')` |
| diesel | 37,52 · 48,98 | `quando('O do diesel')` · `quando('ICMS do diesel')` |
| não | 50,58 · 52,54 · 55,56 · 65,82 | `quando('disseram nao')` · `quando('nao baixa')` · `quando('nao conta')` · `quando('nao e sorte')` |

## 2.2 Ideia e mundo

**A metáfora: a mesma fábrica de fake do 010, agora num segundo episódio.** O mundo é o do 010: à esquerda a **FÁBRICA DE FAKE** (laranja), com esteira, máquinas numeradas, canhão e a planície de celulares atrás; à direita, a **CHECAGEM** (verde). A fábrica liga de novo e o "produto" que entra na esteira é uma **bomba de gasolina com a notícia verdadeira** ("ESTADOS AUMENTAM ICMS"). As máquinas fazem a receita do roteiro: pegam a notícia, **apagam quem decidiu** ("ESTADOS") e **carimbam a culpa** ("LULA AUMENTOU O ICMS", sempre com o rótulo TEXTO DO POST). Na virada, a câmera vai para a checagem, que neste episódio tem três lugares novos: a **mesa redonda do Confaz** com 27 cadeiras, o **posto** (bombas de gasolina e diesel e o botijão) e o **caminho do dinheiro** (a moeda de R$ 1 que se divide entre o prédio do ESTADO, as prefeituras, a escola e o cofre do FUNDEB).

**Protagonista:** a **moeda de R$ 1 de ICMS**. Ela nasce na bomba da gasolina, passa pela mesa do Confaz e, na parte "para onde vai esse dinheiro?", se divide em 75 + 25 e depois em 20 para o Fundeb.

**Selos de fonte** (um por dado, na hora em que é dito):

| Selo | Entra em | Texto |
|---|---|---|
| A fake | `culpa no Lula` (9,54) | TEXTO DO POST (o cartaz sempre leva este rótulo) |
| A fake de novo | `de novo` (11,10) | A MESMA FAKE FOI CHECADA EM 2025 · AOS FATOS |
| A decisão | `votaram no Confaz` (24,42) | CONVÊNIOS ICMS 127 E 128/2026 · DOU 28/10/2026 |
| O pedido | `Em marco` (45,30) | INFOMONEY · 17/03/2026 |
| O argumento dos estados | `Eles dizem` (51,00) | SEGUNDO O COMSEFAZ (ESTADOS) |
| A divisão | `De cada R$` (57,46) | CONSTITUIÇÃO · ART. 158 |
| O Fundeb | `20 centavos` (81,20) | LEI 14.113/2020 · ART. 3º |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo e névoa | `tema.fundo` |
| Piso das duas alas | como no 010 (`tom(tema.chao, -0.12)` e `tom(tema.chao, 0.1)`) |
| **A fake** (cartaz, letreiro, luz da fábrica, celulares) | laranja do tema base, `ESCURO.acento` (`corFake` do 010) |
| **O que é verdade** (mesa do Confaz votando, a moeda do ICMS, a escola que melhora, o carimbo final) | **`tema.acento`** (verde) |
| Bombas, botijão, prédios, cadeiras | `tema.objeto`, `tema.objetoEscuro`, `tema.objetoClaro` |
| Secretários de Fazenda (27 bonecos) | `tema.pessoa` (sem rosto) |
| Boneco do presidente (só na cena 5) | `tema.objeto`, etiqueta PRESIDENTE, sem rosto |

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; frente em z+). As posições da fábrica são as do 010.

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Galpão da FÁBRICA, letreiro, chaminé, engrenagens, esteira, pórticos 1-2-3 | como no 010 (centro [−6,5, 0, 0]) | reaproveitados de `fabricafake/pecas.tsx`; só 3 máquinas acendem (pega, apaga, carimba) e o canhão |
| Bomba da notícia (`BombaNoticia`, peça nova) | anda na esteira, y 0,8 | bomba de gasolina pequena com a placa "ESTADOS AUMENTAM ICMS"; a palavra ESTADOS é apagada pela borracha |
| Cartaz da fake (`CartazFake`, do 010) | preso em cima da bomba | linhas "LULA AUMENTOU" / "O ICMS DA GASOLINA"; rótulo TEXTO DO POST |
| Canhão e planície de celulares (`Canhao`, `CampoFake`, do 010) | como no 010 | dispara cópias do cartaz em "Nas redes" |
| Sala da CHECAGEM (`Galpao` claro) | centro [7, 0, −2,25] | como no 010 |
| Mesa redonda do CONFAZ (`MesaRedonda`, peça nova) | [5, 0, −3], raio 2,6 | mesa com 27 cadeiras; placa CONFAZ no centro; uma placa com sigla em cada lugar (AC, AL... DF) |
| 27 secretários (`Boneco`, instanciados se pesar) | em volta da mesa | levantam o braço em "votaram" (onda de verde) |
| Prédio MINISTÉRIO DA FAZENDA (`OrgaoPublico`, texto "FAZENDA") | [5, 0, −8] | atrás da mesa; fica cinza quando a fala diz "quem decide são os estados" |
| Calendário (`CalendarioGrande`, catálogo) | [2, 0, −1,2] | "27 OUT 2026"; depois "FEV 2027" |
| Posto: bomba de gasolina e bomba de diesel (`BombaPosto`, peça nova) | [9, 0, 1,5] e [10,6, 0, 1,5] | visor 2D mostra R$ 1,57 → R$ 1,64 e R$ 1,17 → R$ 1,30 |
| Botijão de gás (`Botijao`, peça nova) | [12, 0, 2] | etiqueta + R$ 0,91 |
| Boneco PRESIDENTE + envelope (`Envelope`, base) | [1,5, 0, 2,5] | o envelope "BAIXAR ICMS DO DIESEL" voa até a mesa do Confaz e volta com o carimbo NÃO |
| Moeda grande de R$ 1 (`Moeda` da base, escala grande) | nasce em cima da bomba de gasolina | protagonista da cena 6 |
| Prédio do ESTADO (`OrgaoPublico`, texto "ESTADO") | [4, 0, 4] | recebe 75 centavos |
| Prefeituras (`PrediozinhoFumaca` × 3 com placa PREFEITURA) | [9 a 12, 0, 5] | recebem 25 centavos, divididos entre elas |
| Fábrica e loja da cidade (`Lojinha`, catálogo) | ao lado das prefeituras | acendem em "produz e vende" (65%) |
| Escola (`Escola`, peça nova: prédio baixo com bandeirinha e placa ESCOLA) | [11, 0, 7] | um boletim com seta subindo; a escola acende em "melhora" e chegam mais moedas |
| Cofre FUNDEB (`CofreFGTS`, catálogo, com placa FUNDEB) + livros | [6,5, 0, 6] | recebe 20 centavos de cada real |
| Lupa (`Lupa`, catálogo) | na volta para a fábrica | passa sobre o cartaz da fake; o cartaz fica cinza e ganha o carimbo FOI O ESTADO |

**Regras visuais deste vídeo:**
- Laranja só na fake, verde só no que é verdade, como no 010.
- O nome "Lula" só aparece **escrito no cartaz** (TEXTO DO POST) e na etiqueta do boneco genérico PRESIDENTE, sem rosto. Os 27 secretários são bonecos sem nome; os estados aparecem só pela sigla na mesa.
- Sem logo de posto, de emissora, do Aos Fatos ou do Comsefaz: os nomes vão escritos nos selos.
- A fábrica nunca explode, nada pisca.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `A fabrica` | 0,00 | Fábrica | Câmera alta descendo pela chaminé; a fumaça volta | 1 |
| 2 | `fake news` | 0,68 | Letreiro | FÁBRICA DE FAKE acende em laranja | 1 |
| 3 | `voltou a funcionar` | 1,12 | Engrenagens e esteira | Começam a girar; chip DE NOVO? ★ | 1 |
| 4 | `Agora o produto` | 2,38 | Esteira | A bomba da notícia sai do arquivo e entra na esteira | 1 |
| 5 | `ICMS da gasolina` | 3,60 | Placa da bomba | "ESTADOS AUMENTAM ICMS" acende | 1 |
| 6 | `A receita` | 5,18 | Pórticos 1-2-3 | Acendem um a um | 2 |
| 7 | `pega uma noticia` | 6,32 | Garra | Pega a bomba; chip PASSO 1 · PEGA UMA NOTÍCIA VERDADEIRA | 2 |
| 8 | `esconde quem decidiu` | 7,78 | Borracha | Desce e apaga ESTADOS; chip PASSO 2 · ESCONDE QUEM DECIDIU | 2 |
| 9 | `cola a culpa` | 9,10 | Prensa | Desce (baque) e levanta o cartaz LULA AUMENTOU O ICMS; selo TEXTO DO POST | 2 |
| 10 | `Nas redes` | 10,32 | Canhão | Dispara cópias para a planície; celulares acendem em laranja | 2 |
| 11 | `de novo` | 11,10 | Selo | A MESMA FAKE FOI CHECADA EM 2025 · AOS FATOS ★ | 2 |
| 12 | `governo federal` | 12,46 | Cartaz | Pisca de leve no laranja (pulso de 0,6 s) | 2 |
| 13 | `Mas o ICMS` | 14,34 | Câmera | Vira para a checagem (whoosh); fábrica escurece | 3 |
| 14 | `imposto dos estados` | 15,72 | Mesa do Confaz | Sobe do chão com as 27 cadeiras | 3 |
| 15 | `Repara na data` | 17,00 | Calendário | Nasce | 3 |
| 16 | `27 de outubro` | 18,34 | Calendário | "27 OUT 2026" | 3 |
| 17 | `segundo turno` | 20,56 | Chip | 2 DIAS DEPOIS DO 2º TURNO | 3 |
| 18 | `secretarios de Fazenda` | 21,40 | Bonecos | 27 secretários sentam nas cadeiras (onda) | 3 |
| 19 | `26 estados` | 22,64 | Placas | As 26 siglas acendem em volta da mesa; contador 26 + DF | 3 |
| 20 | `Distrito Federal` | 23,72 | Placa DF | Acende por último | 3 |
| 21 | `votaram` | 24,42 | Bonecos | Braços levantam em onda verde; selo CONVÊNIOS 127 E 128/2026 | 3 |
| 22 | `Confaz` | 25,00 | Placa CONFAZ | Acende no centro da mesa | 3 |
| 23 | `Ministerio da Fazenda` | 26,60 | Prédio FAZENDA | Sobe atrás da mesa | 3 |
| 24 | `quem decide o ICMS` | 27,92 | Prédio e mesa | O prédio fica cinza; a mesa acende em verde | 3 |
| 25 | `sao os estados` | 29,62 | Chip | QUEM DECIDE: OS ESTADOS (verde) | 3 |
| 26 | `E eles aprovaram` | 30,00 | Câmera | Vai para o posto | 4 |
| 27 | `ICMS da gasolina passa` | 31,74 | Bomba de gasolina | Sobe; visor ICMS R$ 1,57 | 4 |
| 28 | `1,64` | 35,76 | Visor | Troca para R$ 1,64 (subida); chip + R$ 0,07 POR LITRO | 4 |
| 29 | `O do diesel` | 37,24 | Bomba de diesel | Sobe; visor R$ 1,17 | 4 |
| 30 | `1,30` | 39,76 | Visor | Troca para R$ 1,30 | 4 |
| 31 | `gas de cozinha` | 40,96 | Botijão | Sobe | 4 |
| 32 | `0,91` | 41,85 | Etiqueta | + R$ 0,91 POR BOTIJÃO | 4 |
| 33 | `Comeca em fevereiro` | 44,18 | Calendário | Vira para "FEV 2027" | 4 |
| 34 | `Em marco` | 45,30 | Boneco PRESIDENTE | Nasce ao lado do posto; selo INFOMONEY · 17/03/2026 | 5 |
| 35 | `pedido` | 46,56 | Envelope | Sai da mão dele com "BAIXAR ICMS DO DIESEL" | 5 |
| 36 | `baixarem` | 47,54 | Envelope | Voa até a mesa do Confaz | 5 |
| 37 | `disseram nao` | 50,16 | Carimbo | NÃO no envelope (impacto); o envelope volta | 5 |
| 38 | `Eles dizem` | 51,00 | Balão 2D | "CORTAR O ICMS NÃO BAIXA O PREÇO NA BOMBA" com crédito SEGUNDO O COMSEFAZ (ESTADOS) | 5 |
| 39 | `Agora vem` | 54,16 | Câmera | Volta rápido para a fábrica: a fábrica "esconde" uma gaveta ★ | 6 |
| 40 | `a fabrica nao conta` | 55,24 | Gaveta | Fecha; chip O QUE A FÁBRICA NÃO CONTA | 6 |
| 41 | `para onde vai` | 56,30 | Moeda | A moeda grande de R$ 1 sai da bomba de gasolina e voa para o meio da checagem | 6 |
| 42 | `De cada R$` | 57,46 | Moeda | Gira de frente; selo CONSTITUIÇÃO · ART. 158 | 6 |
| 43 | `75 centavos` | 59,66 | Moeda | Divide-se: um pedaço de 3/4 acende | 6 |
| 44 | `com o estado` | 61,36 | Prédio ESTADO | Sobe; o pedaço de 75 voa até ele; etiqueta 75 CENTAVOS | 6 |
| 45 | `25 centavos` | 62,14 | Pedaço de 1/4 | Acende | 6 |
| 46 | `prefeituras` | 63,82 | 3 prefeituras | Sobem; o pedaço de 25 se divide em 3 moedinhas que voam até elas | 6 |
| 47 | `nao e sorte` | 65,82 | Chip | NÃO É SORTE | 7 |
| 48 | `65%` | 67,22 | Barra | Barra de 65% aparece sobre as prefeituras (`Barras`) | 7 |
| 49 | `produz e vende` | 69,66 | Lojinha e fábrica | Acendem perto da prefeitura maior; ela recebe mais moedas | 7 |
| 50 | `10%` | 71,56 | Barra | Fatia de 10% em verde | 7 |
| 51 | `aprendizado das escolas` | 73,38 | Escola | Sobe; boletim com seta para cima | 7 |
| 52 | `a escola melhora` | 76,18 | Escola | Acende em verde, a seta sobe mais | 7 |
| 53 | `mais ICMS` | 77,24 | Moedas | Duas moedinhas extras voam para a prefeitura da escola (ding) | 7 |
| 54 | `E de cada real` | 79,36 | Moeda nova | Outra moeda de R$ 1 aparece | 8 |
| 55 | `20 centavos` | 81,20 | Moeda | Um pedaço de 1/5 sai; selo LEI 14.113/2020 · ART. 3º | 8 |
| 56 | `Fundeb` | 82,54 | Cofre FUNDEB | Sobe e recebe o pedaço | 8 |
| 57 | `educacao basica` | 84,18 | Livros | Pilha de livros em cima do cofre ★ | 8 |
| 58 | `Entao` | 84,94 | Câmera | Recua e mostra a checagem inteira | 8 |
| 59 | `quem decide e` | 87,54 | Mesa do Confaz | Acende de novo | 8 |
| 60 | `Antes de compartilhar` | 88,92 | Câmera | Volta para o cartaz da fake na fábrica | 9 |
| 61 | `confere quem decidiu` | 90,12 | Lupa | Passa sobre o cartaz; ele fica cinza e ganha o carimbo FOI O ESTADO em verde | 9 |
| 62 | `Voce sabia` | 91,36 | Escola | Close na escola acesa ★ | 9 |
| 63 | `comentarios` | 95,50 | Ícone | `IconeBalao` verde | 9 |
| 64 | `E segue` | 95,92 | Letreiro | FÁBRICA DE FAKE apaga devagar | 9 |
| 65 | `@eumagnoleite` | 96,64 | Chip | @eumagnoleite em verde | 9 |
| 66 | `informacoes` | 98,46 | Câmera | Sobe devagar até o fim | 9 |

66 linhas, com mais de 100 eventos contando as ondas (27 bonecos, 26 siglas, moedinhas). Na programação eu encho mais cada cena, como pede a regra do Estúdio.

## 2.4 Cenas com câmera

A câmera usa `enquadrar` + `cinematizar` (nunca parada). Posições aproximadas; o código ajusta pelo enquadramento automático.

### CENA 1: A FÁBRICA VOLTOU (0,00 a 5,10 s)
Abre em: início · Sai em: `quando('A receita')` · Eventos 1 a 5
- 1a: pos [−9, 14, 6] → [−6, 4,5, 12] · alvo [−7, 4, −2] → [−6,5, 1,5, 0] · descendo pela chaminé até a esteira
- Pílula: A FÁBRICA VOLTOU
- Aha: "é a fábrica de fake de novo, e agora o produto é o ICMS"

### CENA 2: A RECEITA (5,18 a 14,22 s)
Abre em: `quando('A receita')` · Sai em: `quando('Mas o ICMS')` · Eventos 6 a 12
- 2a (5,18 a 10,2): acompanha a bomba pelas máquinas, pos [−9,5, 2,8, 7] → [−5,5, 3, 6,5] · dist 6,5 · ângulo 12°
- 2b (10,3 a 14,2): grua para trás e para cima, a planície de celulares acendendo
- Pílula: A RECEITA
- Aha: "pegaram uma notícia verdadeira, apagaram quem decidiu e colaram a culpa"

### CENA 3: QUEM DECIDIU (14,34 a 29,98 s)
Abre em: `quando('Mas o ICMS')` · Sai em: `quando('E eles aprovaram')` · Eventos 13 a 25
- 3a (14,3 a 21,3): travelling até a mesa do Confaz, pos [3, 5, 6] · alvo [5, 0,8, −3] · dist 9 · ângulo 30°
- 3b (21,4 a 26,5): de cima da mesa, pos [5, 8, 3] · alvo [5, 0,6, −3] · dist 8 · ângulo 50°, arco lento (as 27 cadeiras numa roda)
- 3c (26,6 a 30): recua e mostra o prédio da Fazenda atrás, pos [5, 4, 5] · alvo [5, 2, −6] · dist 11
- Pílula: QUEM DECIDIU
- Aha: "quem votou foram os 26 estados e o DF"

### CENA 4: QUANTO SOBE (30,00 a 45,10 s)
Abre em: `quando('E eles aprovaram')` · Sai em: `quando('Em marco')` · Eventos 26 a 33
- 4a: posto, pos [10, 2,6, 7] · alvo [10,4, 1,2, 1,7] · dist 5,5 · ângulo 14°, desliza da gasolina para o diesel e o botijão
- Pílula: QUANTO SOBE
- Aha: "R$ 0,07 na gasolina, R$ 0,13 no diesel, R$ 0,91 no botijão, a partir de fevereiro"

### CENA 5: O PEDIDO (45,30 a 54,00 s)
Abre em: `quando('Em marco')` · Sai em: `quando('Agora vem')` · Eventos 34 a 38
- 5a: plano que mostra o presidente e a mesa do Confaz juntos, pos [3, 5, 8] · alvo [3,5, 1, 0] · dist 10 · ângulo 26°; segue o envelope
- Pílula: O PEDIDO
- Aha: "o governo pediu para baixar, os estados disseram não, e eles explicam o porquê"

### CENA 6: PARA ONDE VAI (54,16 a 65,60 s)
Abre em: `quando('Agora vem')` · Sai em: `quando('E a divisao')` · Eventos 39 a 46
- 6a (54,2 a 56,2): vislumbre da fábrica fechando a gaveta
- 6b (56,3 a 65,6): a moeda no centro, pos [7, 3, 10] → [7, 4, 11] · alvo [7, 1,5, 4,5] · dist 7 → 9, abrindo para mostrar o ESTADO à esquerda e as prefeituras à direita
- Pílula: PARA ONDE VAI
- Aha: "75 centavos ficam no estado, 25 vão para as prefeituras"

### CENA 7: NÃO É SORTE (65,82 a 79,20 s)
Abre em: `quando('E a divisao')` · Sai em: `quando('E de cada real')` · Eventos 47 a 53
- 7a: prefeituras e barra, pos [10,5, 4, 11] · alvo [10,5, 1,4, 5,5] · dist 7
- 7b (73,4 a 79,2): escola, pos [11, 2,6, 10,5] · alvo [11, 1,2, 7] · dist 4,5 · avanço lento
- Pílula: NÃO É SORTE
- Aha: "a cidade recebe pelo que produz e pela melhora da escola"

### CENA 8: O FUNDEB (79,36 a 88,80 s)
Abre em: `quando('E de cada real')` · Sai em: `quando('Antes de compartilhar')` · Eventos 54 a 59
- 8a: cofre FUNDEB, pos [6,5, 3, 10] · alvo [6,5, 1,2, 6] · dist 5
- 8b (84,9 a 88,8): recua para a checagem inteira, pos [6, 9, 16] · alvo [6, 1, 1] · dist 18
- Pílula: O FUNDEB
- Aha: "20 centavos de cada real vão para a educação básica"

### CENA 9: CONFERE (88,92 a 100,11 s)
Abre em: `quando('Antes de compartilhar')` · Sai em: fim · Eventos 60 a 66
- 9a (88,9 a 91,3): close no cartaz da fake e na lupa, na fábrica
- 9b (91,4 a 95,9): close na escola acesa
- 9c (95,9 a fim): grua sobe e recua mostrando as duas alas, a fábrica apagando
- Pílula: CONFERE QUEM DECIDIU
- Aha: "antes de compartilhar, confere quem decidiu"

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 31/10/2026):

| Fato | Fonte | Na tela |
|---|---|---|
| A fake se repete ("de novo") | Aos Fatos (29/01/2025) + comentários de 2026 (Quenty) | A MESMA FAKE FOI CHECADA EM 2025 · AOS FATOS |
| 27/10, 26 estados + DF no Confaz | Exame (28/10/2026), Despacho 50/2026 no DOU | 27 OUT 2026 · 26 + DF · CONVÊNIOS 127 E 128/2026 |
| Confaz no Ministério da Fazenda, decisão dos estados | Aos Fatos, LC 192/2022 | QUEM DECIDE: OS ESTADOS |
| Gasolina 1,57 → 1,64; diesel 1,17 → 1,30; botijão + 0,91; fevereiro | Convênios 127 e 128/2026 | os valores nos visores e FEV 2027 |
| Pedido de março e o "não" dos estados | InfoMoney (17/03/2026), Comsefaz | BAIXAR ICMS DO DIESEL · NÃO · SEGUNDO O COMSEFAZ |
| 75/25, 65%, 10% | Constituição, art. 158, IV e § 1º | 75 CENTAVOS · 25 CENTAVOS · 65% · 10% |
| 20 centavos no Fundeb | Lei 14.113/2020, art. 3º | 20 CENTAVOS · FUNDEB |

**Conferir antes de publicar:** se saiu checagem de um post de 2026 (Aos Fatos, Lupa, Estadão Verifica) e se algum estado anunciou que não vai aplicar o reajuste.

## 2.6 Trilha e sons

Sem trilha. Efeitos do Estúdio, volume 0,25 a 0,45:

| Evento | Som |
|---|---|
| Trocas de cena | `whoosh` |
| Pílula muda | `tique` |
| Pórticos, bombas, siglas acendendo, moedinhas | `pop` (baixo) |
| Prensa (9), carimbo NÃO (37) | `baque` / `impacto` |
| Visores subindo (28, 30) | `subida` |
| Braços votando (21) | `pop` em onda |
| Escola melhora (53), carimbo FOI O ESTADO (61) | `ding` |
| Canhão (10) | `whoosh` |

## 2.7 Arquivos

- **Novos:** `src/videos/fakeicms/FakeIcms.tsx` · `src/videos/fakeicms/pecas.tsx` com:
  - `BombaNoticia`: bomba pequena com placa de texto (a palavra ESTADOS pode sumir)
  - `BombaPosto`: bomba de posto com visor (o número fica na interface 2D, presa ao visor)
  - `Botijao`: botijão de gás de 13 kg
  - `MesaRedonda`: mesa do Confaz com 27 cadeiras e uma placa de sigla em cada lugar
  - `Escola`: prédio baixo com placa ESCOLA e um boletim com seta
  - `MoedaPartida`: moeda grande que se divide em fatias (3/4 + 1/4, e 1/5)
  - `palavras.ts` (já pronto)
- **Alterados:** `src/Root.tsx`, registrando `FakeIcms`, `FakeIcmsGuia`, `FakeIcmsLimpo` e `CapaFakeIcms`.
- **Reaproveitados:**
  - do 010 (`src/videos/fabricafake/pecas.tsx`): `Galpao`, `Arquivo`, `Garra`, `Borracha`, `Prensa`, `Canhao`, `CartazFake`, `CartazinhoVoa`, `CampoFake`, `Portico`, `TrilhoAlto`, `corFake`;
  - do catálogo: `Chamine`, `Engrenagem`, `EsteiraOitoHoras`, `Lupa`, `CalendarioGrande`, `OrgaoPublico`, `CofreFGTS`, `Lojinha`, `PrediozinhoFumaca`, `IconeBalao`, `Barras`;
  - da base: `Boneco`, `Placa`, `Moeda`, `Envelope`, `Trilha`.
- 3.003 quadros, em 4 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- "Mesmo assunto em série: manter o mesmo mundo": o 010 e o 012 são vídeos de desmentir fake; a fábrica volta, e o perfil fica reconhecível. Pedido da pessoa: "coloque algo de fábrica de fake news".
- "Vídeo que desmente fake": o vídeo mostra também o argumento do outro lado (os estados), com o crédito.
- Política com nome real: o nome do presidente só escrito no cartaz (TEXTO DO POST) e na etiqueta do boneco genérico, sem rosto. Os estados aparecem só pela sigla.
- Sem logos: posto e bombas genéricos.
- Selos de fonte: um por dado, na hora em que é dito.
- Nada piscando: o cartaz só ganha um pulso de 0,6 s; o letreiro apaga em 1 s.
- Multidão só nasce na palavra: os 27 secretários nascem em "secretários de Fazenda".

**Escolhas de direção (★):**
- chip DE NOVO? quando a fábrica liga;
- selo da fake checada em 2025;
- a gaveta que a fábrica fecha em "a parte que a fábrica não conta";
- a pilha de livros no cofre do Fundeb;
- o close final na escola acesa (puxa a pergunta dos comentários).

## Ajustes feitos na programação (31/10/2026)
- A divisão 65% / lei do estado / 10% ficou numa barra 2D (com fundo), em vez das `Barras` 3D: lê melhor no celular.
- Os visores das bombas aparecem um de cada vez (no plano aberto eles se encavalavam).
- Câmeras dos passos da fábrica mais abertas, para os números das máquinas não brigarem com a pílula.
- O close no cartaz da fake segura até "Você sabia", para o carimbo FOI O ESTADO ser lido.
- Rótulo "R$ 1 DE ICMS" na moeda; placa do Fundeb mais alta (ficava atrás do cofre).
- Ficou de fora o extra ★ da gaveta que a fábrica fecha; o chip O QUE A FÁBRICA NÃO CONTA faz esse papel.
