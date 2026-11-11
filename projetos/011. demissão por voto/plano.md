# Plano de cenas: 011. demissão por voto (versão 1, aprovada em 31/10/2026)

Código `demissaovoto` · Nome `DemissaoVoto` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Lendário (ElevenLabs v3) · preparo: pausas de no máximo 0,35 s, 1,2x, volume -15 · duração **82,20 s** · `AUDIO_SEG = 82.2` · `QUADROS = 2493` (com 0,9 s de folga).
- 276 palavras; a última ("direitos.") termina em 81,98 s. Sem buraco maior que 1,5 s, tempos sempre subindo. A voz leu o roteiro inteiro, sem pular nem repetir.
- Ajustes da sincronia: "9" + ".029." juntados em "9.029."; o "discriminação." que o Whisper partiu em dois virou uma palavra só (29,80 a 30,52 s). Cópia do original em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo para cada uma):

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| Lula | 1,56 · 9,78 | `quando('no Lula esta')` · `quando('votou no Lula', 2)` |
| lei | 2,72 · 10,76 · 17,76 | `quando('quebrando')` · `quando('a lei diz')` · `quando('a Lei 9.029')` |
| patrão | 0,00 · 31,94 · 64,64 | `quando('Patrao que')` · `quando('O patrao pode')` · `quando('patrao de esquerda')` |
| votou | 1,18 · 9,46 · 66,66 | `quando('voce votou')` · `quando('quem votou no')` · `quando('votou na direita')` |
| demitir | 28,12 · 32,96 · 35,46 · 66,12 | `quando('decidiu')` + `quando('demitir por motivo')` · `quando('sim, demitir')` · `quando('pode e demitir')` · `quando('pode demitir quem')` |
| voto | 36,40 · 52,74 · 76,04 | `quando('causa do voto')` · `quando('mudar o voto')` · `quando('ameacado')` |
| pode | 6 vezes | sempre com trecho longo: `quando('O patrao pode')`, `quando('ele nao pode')`, `quando('ainda pode')`, `quando('empresa pode')`, `quando('pode ser crime')`, `quando('tambem nao pode')` |
| emprego | 22,20 · 39,78 | `quando('manter o emprego')` · `quando('voltar para o emprego')` |
| Trabalho | 26,88 · 57,16 | `quando('Justica do Trabalho')` · `quando('Ministerio Publico')` |
| deputada | 58,48 · 61,24 | `quando('uma deputada')` · `quando('A deputada diz')` |
| direitos | 15,22 · 81,56 | `quando('perde direitos')` · `quando('seus direitos')` |
| você | 0,92 · 68,36 · 74,08 | `quando('voce votou')` · `quando('com voce')` · `quando('Voce ja viu')` |

## 2.2 Ideia e mundo

**A metáfora: um palco giratório com dois lados separados por uma parede com uma porta no meio.** Na frente fica **A EMPRESA**: um escritório aberto com mesas, funcionários, o relógio de ponto e a mesa do patrão. Atrás fica **A LEI**: o livro da Constituição, o livro da Lei 9.029, o prédio da Justiça do Trabalho e, mais tarde, o do MPT. O palco gira para a lei quando a fala pergunta "o que a lei diz" e volta para a empresa quando a regra se aplica. Em "vale para qualquer lado", a câmera vai para a ponta da parede e mostra os dois lados de uma vez. A **porta do meio** é o símbolo do vídeo: é por ela que se demite, se deixa de contratar e se volta para o emprego.

**Protagonista:** "você", um boneco na cor `tema.corpo`, que começa sentado na mesa dele com o celular. Ele é levado até a porta no gancho, fica na porta (visível dos dois lados) durante a parte da lei, volta para a mesa em "voltar para o emprego" e fecha o vídeo em close, com o celular grande da denúncia.

**Placar e selos de fonte** (um por dado, na hora em que é dito):

| Selo | Entra em | Texto |
|---|---|---|
| Os posts | `pediram` (6,28) | TEXTO DOS POSTS · SEGUNDO O PODER360 · 27/10/2026 |
| Constituição | `artigo` (13,52) | CONSTITUIÇÃO · ART. 5º, VIII |
| Lei | `a Lei 9.029` (17,76) | LEI 9.029/1995 · ART. 1º |
| Decisão | `decidiu` (27,44) | TRT DA 3ª REGIÃO (MG) · 2026 |
| Direitos | `escolhe` (38,52) | LEI 9.029 · ART. 4º |
| Punição | `multa` (45,92) | LEI 9.029 · ART. 3º |
| Crime | `crime eleitoral` (53,68) | CÓDIGO ELEITORAL · ART. 301 |
| Processos | `processou` (57,90) | SEGUNDO CNN BRASIL E O TEMPO · 27 E 29/10/2026 |
| Denúncia | `site do MPT` (71,74) | MPT.MP.BR/ASSEDIO-ELEITORAL |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo e névoa | `tema.fundo` |
| Chão fora do palco | `tema.chao` |
| Palco, parede, mesas, livros | `tema.objeto`, `tema.objetoEscuro`, `tema.objetoClaro` |
| Protagonista ("você") | `tema.corpo` |
| Funcionários, candidatos, testemunhas | `tema.pessoa` |
| Patrões, políticos, empresários, deputada | `tema.objetoEscuro` (cinza; ninguém com cor de partido) |
| **O que a lei garante** (escudo, página do artigo, item "entre outros", porta reaberta, cadeado do sigilo) | **`tema.acento`** (verde) |
| Posts que pedem demissão, multa, cancela, grade | cinza (`tema.objeto`); nada de vermelho de alarme |
| Dinheiro (salários, dobro) | `tema.objetoClaro` (moedas com `PilhaMoedas`, cor livre) |

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; frente em z+; o palco gira em volta de [0, 0, 0]):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Palco (`PalcoGiratorio`, catálogo) | centro [0, 0, 0], raio 7,5 | `rotY` 0 = empresa de frente; π = lei de frente. Aro acende em verde só quando gira |
| Parede do meio (`Caixa`) | [0, 1,4, 0], 13 × 2,8 × 0,3 | gira com o palco |
| Porta do meio (`Porta`, catálogo) | [0, 0, 0] na parede | abre, fecha e acende por trás; é o lugar do protagonista |
| Letreiro EMPRESA (`Placa`) | [0, 3,1, 0,16], face da empresa | nome genérico, sem logo |
| Letreiro O QUE DIZ A LEI (`Placa`) | [0, 3,1, −0,16], face da lei | |
| **Lado EMPRESA (z+, no palco)** | | |
| Mesas (`Mesa`, catálogo) | [−4, 0, 3] · [−1,6, 0, 4,4] · [2,4, 0, 3,4] | a do meio é a do protagonista |
| Funcionários (`Boneco`) | 3, junto das mesas da ponta e em [−5,4, 0, 1,4] | `tema.pessoa`, sem rosto |
| Protagonista (`Boneco`, `tema.corpo`) + `Celular` na mão | começa em [−1,6, 0, 3,6] | anda até a porta e volta |
| Patrão (`Candidato`, catálogo, cor `objetoEscuro`, gravata `objeto`) + `Cadeira` | [4,6, 0, 1,8] | é o "patrão" das cenas; sem partido |
| Relógio de ponto (`RelogioPonto`, catálogo) | [−6, 0, 1] | visor apaga quando alguém é demitido ★ |
| Telão dos posts (`TelaoPosts`, peça nova) | na parede, [−3,6, 2,1, 0,2], 3 × 1,7 | 2 cartões de post em cinza, com rótulo TEXTO DO POST |
| Placa VAGA (`Placa`) na mesa vazia | [2,4, 1,1, 3,4] | vira FECHADA em "não contrate" |
| Candidato à vaga (`Boneco`, `tema.pessoa`) | entra por [6, 0, 6] | para diante da mesa e volta |
| Grades (`Grades`, catálogo) | sobre o patrão, [4,6, 0, 1,8], 1,6 × 2,4 | descem devagar em "prisão" e sobem logo depois |
| **Lado LEI (z−, no palco)** | | |
| Livro da Constituição (`LivroLei`, `capa` = 1) | [−3,4, 0, −3,4], escala 2,4 | abre em "Constituição"; fita no art. 5º; afunda na cena 4 |
| Página ART. 5º (`Placa` na folha) | sobre o livro | "NINGUÉM SERÁ PRIVADO DE DIREITOS POR CONVICÇÃO POLÍTICA" |
| Livro da Lei 9.029 (`LivroLei`) | [0,8, 0, −4,4], escala 2,2 | abre em "Lei 9.029" |
| Lista do art. 1º (`ListaLei`, peça nova, como a `ListaContran`) | sobe do livro, [0,8, 2,6, −4,2] | linhas SEXO, RAÇA, IDADE, ENTRE OUTROS acendem uma a uma |
| Justiça do Trabalho (`OrgaoPublico`, texto "JUSTIÇA DO TRABALHO") | [4,4, 0, −4,6], escala 0,9 | sobe do chão em "Justiça" |
| Martelo (`Martelo`) + `DocumentoGrande` | [3,4, 0, −2,4] | bate em "decidiu"; carimbo DISCRIMINAÇÃO |
| MPT (`OrgaoPublico`, texto "MINISTÉRIO PÚBLICO DO TRABALHO") | [−3,4, 0, −3,8] | sobe no lugar da Constituição, na cena 7 |
| Deputada e empresário (`Boneco`, `objetoEscuro`) | [−1,2, 0, −2,4] e [1,2, 0, −2,4] | etiquetas DEPUTADA ESTADUAL · RJ e EMPRESÁRIO · AP; sem rosto |
| Patrão 2 (`Candidato`, cinza) | [5,6, 0, −1,6] | só na cena 8, etiqueta PATRÃO DE ESQUERDA |
| **Fora do palco (chão fixo, na frente)** | | |
| Grupo POLÍTICOS (`Boneco` × 3, cinza, com `Celular`) | [−6, 0, 9] | nascem em "políticos", somem na cena 3 |
| Grupo EMPRESÁRIOS (`Boneco` × 3, cinza, com `Celular`) | [−3, 0, 10] | nascem em "empresários" |
| Banco público (`PredioColunas`, letreiro BANCO PÚBLICO em `Placa`) + `Cancela` | [6, 0, 9] | só na cena 6 |
| Pilhas de salário (`PilhaMoedas`) | [−3, 0, 6,5] e [−1,8, 0, 6,5] | uma pilha e depois o dobro |
| Contracheques ×10 (`Contracheque`) | fileira em [−6..3, 0, 7,5] | cena 6, a multa de 10 vezes ★ |
| Urna (`Urna`, catálogo) | [0, 0, 6,8] | cena 6, ameaça antes da eleição |
| Balança (`Balanca`) | [0, 3,6, 0], em cima da parede | cena 8, fica equilibrada ★ |
| Celular grande (`Celular`, escala 9) | [0,6, 1,8, 5,2] | cena 9: PRINTS · ÁUDIOS · TESTEMUNHAS e a tela do MPT |
| Testemunhas (`Boneco` × 2, `tema.pessoa`) | ao lado do protagonista no fim | ★ |

**Regras visuais deste vídeo:**
- Verde só no que a lei garante. Quem pede demissão e quem pune ficam em cinza.
- Nenhum boneco representa político de verdade com rosto. A deputada e o empresário são bonecos genéricos com etiqueta, sem nome na tela. A resposta da deputada aparece num balão do mesmo tamanho do processo.
- Os posts são mostrados como **texto**, sempre com o rótulo TEXTO DOS POSTS e a fonte.
- "Lula", "esquerda" e "direita" só aparecem escritos (posts e etiquetas), nunca como cor, bandeira ou estrela de partido.
- A grade da prisão desce devagar e sobe logo depois: é um aviso de pena, não uma cena de prisão.
- Nada pisca: a porta acende em 0,5 s, o aro do palco acende e apaga em 0,6 s.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Patrao que` | 0,00 | Empresa | Já montada; câmera alta descendo sobre o escritório | 1 |
| 2 | `demite` | 0,40 | Patrão | Levanta da cadeira e aponta para a porta | 1 |
| 3 | `voce votou` | 0,92 | Protagonista | Acende em `tema.corpo`, levanta da mesa com o celular | 1 |
| 4 | `no Lula esta` | 1,56 | Chip 2D | VOTOU NO LULA? (cinza) | 1 |
| 5 | `quebrando` | 2,16 | Porta | Para no meio do caminho; o protagonista para ★ | 1 |
| 6 | `quebrando a lei` | 2,72 | Chip 2D | É ILEGAL em verde (ding) | 1 |
| 7 | `Depois do segundo` | 3,06 | Câmera | Recua e mostra a frente do palco e o chão de fora | 2 |
| 8 | `turno` | 3,82 | Urna | Pequena urna passa no telão com "2º TURNO · 25/10" ★ | 2 |
| 9 | `politicos` | 4,44 | Grupo POLÍTICOS | 3 bonecos nascem com celular; etiqueta POLÍTICOS | 2 |
| 10 | `empresarios` | 5,00 | Grupo EMPRESÁRIOS | 3 bonecos nascem; etiqueta EMPRESÁRIOS | 2 |
| 11 | `PL` | 5,98 | Chip 2D | LIGADOS AO PL (cinza) | 2 |
| 12 | `pediram` | 6,28 | Celulares dos grupos | Acendem; arcos pontilhados (`ArcoPontos`) até o telão; selo dos posts | 2 |
| 13 | `redes` | 6,94 | Telão | Acende | 2 |
| 14 | `demita` | 7,44 | Telão, post 1 | "DEMITA PETISTA" entra (pop) | 2 |
| 15 | `petista` | 7,96 | Funcionários | Os 3 olham para o telão ★ | 2 |
| 16 | `nao contrate` | 8,64 | Telão, post 2 | "NÃO CONTRATE QUEM VOTOU NO LULA" | 2 |
| 17 | `contrate` | 8,82 | Placa VAGA | Candidato chega à mesa; a placa vira FECHADA (baque baixo) | 2 |
| 18 | `quem votou no` | 9,46 | Candidato | Dá meia-volta ★ | 2 |
| 19 | `Mas o que` | 10,16 | Palco | Começa a girar 180° (whoosh); aro acende; grupos de fora somem | 3 |
| 20 | `a lei diz` | 10,76 | Letreiro | O QUE DIZ A LEI aparece de frente | 3 |
| 21 | `isso` | 11,24 | Protagonista | Fica na porta, de frente para a lei | 3 |
| 22 | `Primeiro` | 11,78 | Livro da Constituição | Sobe do palco | 3 |
| 23 | `Constituicao` | 12,46 | Livro | Abre; a faixa da capa fica verde | 3 |
| 24 | `artigo` | 13,52 | Fita | Fita marcadora desce; selo CONSTITUIÇÃO · ART. 5º, VIII | 3 |
| 25 | `5º` | 13,80 | Página | "ART. 5º" grande na folha | 3 |
| 26 | `ninguem` | 14,62 | Página | Frase do inciso VIII aparece linha a linha | 3 |
| 27 | `perde direitos` | 14,86 | Escudo | `Escudo` verde nasce na frente do protagonista | 3 |
| 28 | `conviccao` | 15,78 | Chip 2D | CONVICÇÃO POLÍTICA (verde) | 3 |
| 29 | `Depois,` | 17,04 | Câmera | Desliza para o segundo livro | 3 |
| 30 | `a Lei 9.029` | 17,76 | Livro 9.029 | Abre; selo LEI 9.029/1995 · ART. 1º | 3 |
| 31 | `proibe` | 19,38 | Lista | `ListaLei` sobe do livro, com título PROIBIDO DISCRIMINAR | 3 |
| 32 | `contratar` | 20,70 | Lista | Linha PARA CONTRATAR acende; mini porta abrindo ao lado ★ | 3 |
| 33 | `manter o emprego` | 21,80 | Lista | Linha PARA MANTER O EMPREGO acende; `CarteiraTrabalho` ao lado ★ | 3 |
| 34 | `lista` | 22,98 | Lista | Vira a página para os motivos | 3 |
| 35 | `sexo` | 23,48 | Lista | SEXO acende (pop) | 3 |
| 36 | `raca` | 24,20 | Lista | RAÇA acende (pop) | 3 |
| 37 | `idade` | 24,80 | Lista | IDADE acende (pop) | 3 |
| 38 | `entre outros` | 25,30 | Lista | ENTRE OUTROS acende em verde e cresce | 3 |
| 39 | `Justica do Trabalho` | 26,42 | Prédio | JUSTIÇA DO TRABALHO sobe do palco; letreiro acende | 3 |
| 40 | `decidiu` | 27,44 | Martelo | Bate (baque); selo TRT DA 3ª REGIÃO (MG) · 2026 | 3 |
| 41 | `demitir por motivo` | 28,12 | Documento | `DocumentoGrande` sobe na frente do prédio | 3 |
| 42 | `politico` | 29,02 | Chip 2D | DEMITIR POR POLÍTICA = | 3 |
| 43 | `discriminacao` | 29,80 | Carimbo | DISCRIMINAÇÃO carimbado no documento (impacto); chip completa | 3 |
| 44 | `Agora repara` | 30,74 | Palco | Gira de volta para a empresa (whoosh); livros e prédio afundam | 4 |
| 45 | `O patrao pode` | 31,94 | Patrão | Acende de leve (contorno), ainda cinza | 4 |
| 46 | `sim, demitir` | 32,96 | Funcionário da ponta | Levanta e sai pela porta ★ | 4 |
| 47 | `justa causa` | 33,50 | Chip 2D | SEM JUSTA CAUSA: PODE ✓ | 4 |
| 48 | `ele nao pode` | 34,76 | Câmera | Avança até a porta e o protagonista | 4 |
| 49 | `pode e demitir` | 35,46 | Patrão | Aponta para o protagonista | 4 |
| 50 | `causa do voto` | 36,02 | `XMarca` + chip | X cinza sobre o gesto do patrão; chip PELO VOTO: NÃO PODE ✗ | 4 |
| 51 | `Se isso acontecer` | 36,84 | Porta | Protagonista passa pela porta para fora (cena da demissão) | 5 |
| 52 | `trabalhador` | 38,12 | Etiqueta | TRABALHADOR no protagonista | 5 |
| 53 | `escolhe` | 38,52 | Placas | Duas placas no chão: VOLTAR · EM DOBRO; selo LEI 9.029 · ART. 4º | 5 |
| 54 | `voltar` | 38,94 | Porta | Acende em verde e abre | 5 |
| 55 | `voltar para o emprego` | 39,78 | Protagonista | Anda de volta e senta na mesa dele (ding) | 5 |
| 56 | `salarios` | 40,60 | Pilha 1 | `PilhaMoedas` cresce ao lado da mesa | 5 |
| 57 | `tempo parado` | 40,96 | Relógio de ponto | Visor volta a acender ★; chip SALÁRIOS DO TEMPO PARADO | 5 |
| 58 | `ou receber` | 41,58 | Placa EM DOBRO | Acende | 5 |
| 59 | `periodo` | 42,38 | Pilha 2 | Segunda pilha igual nasce ao lado | 5 |
| 60 | `dobro` | 42,78 | Contador 2D | × 2 (subida) | 5 |
| 61 | `pedir` | 43,88 | `Envelope` | Envelope com selo verde voa até a mesa ★ | 5 |
| 62 | `dano moral` | 44,16 | Chip 2D | + DANO MORAL | 5 |
| 63 | `A empresa` | 44,88 | Câmera | Sobe e mostra a empresa inteira; letreiro EMPRESA acende | 6 |
| 64 | `multa` | 45,92 | Selo + chip | LEI 9.029 · ART. 3º; chip MULTA | 6 |
| 65 | `10` | 46,38 | Contracheques | Nasce o 1º contracheque com MAIOR SALÁRIO | 6 |
| 66 | `vezes` | 46,60 | Contracheques | Mais 9 em fila, um atrás do outro (pops rápidos); contador × 10 | 6 |
| 67 | `paga` | 47,86 | Contracheques | Fila acende de leve e volta ★ | 6 |
| 68 | `ficar sem` | 48,48 | Banco público | Prédio BANCO PÚBLICO sobe ao lado | 6 |
| 69 | `emprestimo` | 48,92 | Cancela | Braço desce na frente do banco (baque) | 6 |
| 70 | `banco publico` | 49,46 | Chip 2D | SEM EMPRÉSTIMO EM BANCO PÚBLICO | 6 |
| 71 | `E ameacar` | 50,22 | Urna | Sobe no chão da frente | 6 |
| 72 | `funcionario` | 50,98 | Patrão + protagonista | Patrão vai até a mesa do protagonista; balão com o desenho de uma urna e uma porta ★ | 6 |
| 73 | `antes da eleicao` | 51,44 | Chip 2D | ANTES DA ELEIÇÃO | 6 |
| 74 | `mudar o voto` | 52,42 | Urna | Fenda acende e apaga devagar ★ | 6 |
| 75 | `pode ser crime` | 53,08 | Selo | CÓDIGO ELEITORAL · ART. 301 | 6 |
| 76 | `eleitoral` | 53,88 | Chip 2D | PODE SER CRIME ELEITORAL | 6 |
| 77 | `ate 4` | 54,68 | Contador 2D | ATÉ 4 ANOS | 6 |
| 78 | `prisao` | 55,62 | Grades | Descem devagar sobre o patrão (baque) e sobem em 1 s | 6 |
| 79 | `O Ministerio` | 56,06 | Palco | Gira para o lado da lei (whoosh); o prédio do MPT sobe | 7 |
| 80 | `Ministerio Publico` | 56,32 | Prédio MPT | Letreiro MINISTÉRIO PÚBLICO DO TRABALHO acende | 7 |
| 81 | `processou` | 57,90 | 2 documentos | `DocumentoGrande` × 2 saem do prédio; selo SEGUNDO CNN BRASIL E O TEMPO | 7 |
| 82 | `uma deputada` | 58,48 | Boneco | Nasce; documento pousa na frente; etiqueta DEPUTADA ESTADUAL · RJ | 7 |
| 83 | `um empresario` | 59,88 | Boneco | Nasce; documento pousa na frente; etiqueta EMPRESÁRIO · AP | 7 |
| 84 | `A deputada diz` | 60,98 | Balão 2D | "FOI MAL INTERPRETADA" com crédito "RESPOSTA DA DEPUTADA" | 7 |
| 85 | `E vale` | 63,08 | Câmera | Vai para a ponta da parede e mostra os dois lados de uma vez | 8 |
| 86 | `qualquer lado` | 63,74 | Balança | Nasce em cima da parede e fica equilibrada ★ | 8 |
| 87 | `patrao de esquerda` | 64,64 | Patrão 2 | Nasce no lado da lei; etiqueta PATRÃO DE ESQUERDA; o patrão 1 ganha PATRÃO DE DIREITA | 8 |
| 88 | `tambem nao pode` | 65,68 | `XMarca` × 2 | Um X cinza na frente de cada patrão, ao mesmo tempo | 8 |
| 89 | `votou na direita` | 66,66 | Chip 2D | A LEI VALE PARA TODOS (verde) | 8 |
| 90 | `Se acontecer` | 67,56 | Câmera | Close no protagonista na mesa | 9 |
| 91 | `com voce` | 68,36 | Celular grande | Sobe na frente dele | 9 |
| 92 | `prints` | 69,30 | Celular | Linha PRINTS ✓ | 9 |
| 93 | `audios` | 69,88 | Celular | Linha ÁUDIOS ✓ | 9 |
| 94 | `testemunhas` | 70,26 | Testemunhas | 2 bonecos chegam ao lado; linha TESTEMUNHAS ✓ | 9 |
| 95 | `denuncie` | 71,18 | Celular | Tela vira DENÚNCIA · MPT | 9 |
| 96 | `site do MPT` | 71,74 | Selo | MPT.MP.BR/ASSEDIO-ELEITORAL | 9 |
| 97 | `sigilo` | 73,48 | `Cadeado` | Cadeado verde fecha sobre a tela (tique); chip DÁ PARA PEDIR SIGILO | 9 |
| 98 | `Voce ja viu` | 74,08 | Câmera | Recua devagar | 9 |
| 99 | `ameacado` | 75,06 | Urna e porta | Pequenas no fundo, lembrando o vídeo ★ | 9 |
| 100 | `comentarios` | 77,18 | Ícone | `IconeBalao` verde (pop) | 9 |
| 101 | `E segue` | 77,90 | Câmera | Grua sobe, o palco gira devagar até o fim | 9 |
| 102 | `Magno Explica` | 78,56 | Chip 2D | MAGNO EXPLICA em verde | 9 |
| 103 | `seus direitos` | 81,42 | Escudo | Escudo verde volta sobre a porta | 9 |

103 eventos em 82 s (1,25 por segundo).

## 2.4 Cenas com câmera

A câmera usa `enquadrar` + `cinematizar` (nunca parada). Posições aproximadas; o código ajusta pelo enquadramento automático. Coordenadas do mundo com o palco em `rotY` 0.

### CENA 1: DEMITIDO PELO VOTO? (0,00 a 3,00 s)
Abre em: início · Sai em: `quando('Depois do segundo')` · Eventos 1 a 6
- 1a: pos [1, 11, 13] → [0, 5,5, 10] · alvo [0, 1, 2,6] · dist 13 → 10 · ângulo 40° → 28°, descendo sobre o escritório
- Pílula: DEMITIDO PELO VOTO?
- Aha: "o patrão quer demitir pelo voto, e isso é ilegal"

### CENA 2: NAS REDES (3,06 a 10,10 s)
Abre em: `quando('Depois do segundo')` · Sai em: `quando('Mas o que')` · Eventos 7 a 18
- 2a (3,06 a 7,2): pos [−7, 4,5, 16] · alvo [−3, 1,2, 6] · dist 11 · ângulo 20°, grupos de fora e o telão ao fundo
- 2b (7,2 a 10,1): pos [−1, 3,2, 9] · alvo [−1, 1,8, 1,5] · dist 8 · ângulo 12°, telão e mesa da vaga, avanço lento
- Pílula: NAS REDES
- Aha: "o pedido apareceu nas redes depois do segundo turno"

### CENA 3: O QUE DIZ A LEI (10,16 a 30,60 s)
Abre em: `quando('Mas o que')` · Sai em: `quando('Agora repara')` · Eventos 19 a 43
- 3a (10,16 a 11,7): palco girando; pos [0, 7, 14] · alvo [0, 1,5, 0] · dist 14 · ângulo 26°
- 3b (11,78 a 17,0): Constituição; pos [−2,6, 3,4, 5] · alvo [−3,4, 1,8, 3,4] · dist 6 · ângulo 14° (o lado da lei já está virado para z+)
- 3c (17,04 a 26,2): livro 9.029 e lista; pos [0,8, 3,6, 9] · alvo [0,8, 2,4, 4,2] · dist 5,5 · ângulo 12°, avanço lento
- 3d (26,42 a 30,6): Justiça do Trabalho e martelo; pos [3, 4, 9,5] · alvo [3,8, 2, 3,8] · dist 7 · ângulo 18°, arco para a direita
- Pílula: O QUE DIZ A LEI
- Aha: "a Constituição e a Lei 9.029 protegem a opinião política, e a Justiça já decidiu assim"

### CENA 4: A REGRA (30,74 a 36,80 s)
Abre em: `quando('Agora repara')` · Sai em: `quando('Se isso acontecer')` · Eventos 44 a 50
- 4a (30,74 a 34,7): palco volta; pos [3, 4, 11] · alvo [2, 1,2, 2] · dist 10 · ângulo 18°
- 4b (34,76 a 36,8): pos [1,6, 2,4, 5] · alvo [0,6, 1,3, 0,6] · dist 4,8 · ângulo 12°, porta, protagonista e patrão no mesmo plano
- Pílula: A REGRA
- Aha: "demitir pode; demitir pelo voto, não"

### CENA 5: OS DIREITOS (36,84 a 44,72 s)
Abre em: `quando('Se isso acontecer')` · Sai em: `quando('A empresa')` · Eventos 51 a 62
- 5a (36,84 a 40,5): pos [−2, 3,6, 9] · alvo [−0,8, 1,2, 3] · dist 7 · ângulo 18°, porta e mesa do protagonista
- 5b (40,6 a 44,7): pos [−3, 2,8, 10,5] · alvo [−2,4, 0,8, 6,5] · dist 4,5 · ângulo 16°, as pilhas e o relógio de ponto, arco lento
- Pílula: OS DIREITOS
- Aha: "o trabalhador escolhe: volta com os salários ou recebe em dobro, e ainda pede dano moral"

### CENA 6: A PUNIÇÃO (44,88 a 56,00 s)
Abre em: `quando('A empresa')` · Sai em: `quando('O Ministerio')` · Eventos 63 a 78
- 6a (44,88 a 48,4): pos [−1, 7, 17] · alvo [−1,5, 0,8, 7,5] · dist 11 · ângulo 30°, fila de contracheques
- 6b (48,48 a 50,1): pos [4, 3,5, 15] · alvo [6, 1,2, 9] · dist 7 · ângulo 18°, banco e cancela
- 6c (50,22 a 56,0): pos [2, 4, 12] · alvo [2, 1,2, 4] · dist 9 · ângulo 20°, urna na frente, patrão e grades atrás, avanço lento
- Pílula: A PUNIÇÃO
- Aha: "a empresa paga multa e perde crédito; ameaçar para mudar o voto pode dar prisão"

### CENA 7: NA JUSTIÇA (56,06 a 62,96 s)
Abre em: `quando('O Ministerio')` · Sai em: `quando('E vale')` · Eventos 79 a 84
- 7a: palco girando de novo; pos [0, 4,5, 10] → [0,4, 3,2, 7,5] · alvo [0, 1,4, 2,6] · dist 8 → 6 · ângulo 20°, prédio do MPT e os dois bonecos lado a lado (dois nomes em menos de 2 s: um plano só)
- Pílula: NA JUSTIÇA
- Aha: "o MPT já está processando, e a deputada se defende"

### CENA 8: QUALQUER LADO (63,08 a 67,40 s)
Abre em: `quando('E vale')` · Sai em: `quando('Se acontecer')` · Eventos 85 a 89
- 8a: pos [11, 6, 2] · alvo [3, 1,6, 0] · dist 10 · ângulo 24°, olhando ao longo da parede: empresa de um lado, lei do outro, balança no alto
- Pílula: QUALQUER LADO
- Aha: "a regra protege a esquerda e a direita do mesmo jeito"

### CENA 9: O QUE FAZER (67,56 a 83,10 s)
Abre em: `quando('Se acontecer')` · Sai em: fim · Eventos 90 a 103
- 9a (67,56 a 74,0): pos [−1, 2,6, 9] · alvo [−0,8, 1,6, 5] · dist 4,2 · ângulo 10°, celular grande e protagonista
- 9b (74,08 a 77,8): recua até pos [−1, 4, 12] · dist 8
- 9c (77,9 a fim): grua sobe até pos [0, 10, 15] · alvo [0, 1, 0] · dist 18 · ângulo 32°, palco girando devagar
- Pílula: O QUE FAZER
- Aha: "guarde as provas e denuncie no MPT, com sigilo"

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 31/10/2026):

| Fato | Fonte | Na tela |
|---|---|---|
| Posts "demita petista" / "não contrate quem votou no Lula" depois do 2º turno | Poder360, 27/10/2026 | TEXTO DOS POSTS · LIGADOS AO PL |
| Ninguém perde direitos por convicção política | Constituição, art. 5º, VIII | ART. 5º e a frase do inciso |
| Lei 9.029: contratar e manter emprego; sexo, raça, idade, entre outros | Lei 9.029/1995, art. 1º | a lista com ENTRE OUTROS |
| Demitir por motivo político é discriminação | TRT da 3ª Região (MG), notícia de 13/08/2026 | TRT DA 3ª REGIÃO (MG) · 2026 · DISCRIMINAÇÃO |
| Voltar com salários ou receber em dobro, mais dano moral | Lei 9.029, art. 4º | VOLTAR · EM DOBRO · × 2 · + DANO MORAL |
| Multa de 10 vezes o maior salário, sem empréstimo em banco público | Lei 9.029, art. 3º | × 10 · SEM EMPRÉSTIMO EM BANCO PÚBLICO |
| Ameaçar para mudar o voto pode ser crime, até 4 anos | Código Eleitoral, art. 301 | PODE SER CRIME ELEITORAL · ATÉ 4 ANOS |
| MPT processou deputada estadual do RJ e empresário do AP; ela diz que foi mal interpretada | CNN Brasil (27/10) e O Tempo (29/10) | etiquetas sem nome e o balão da resposta |
| Denúncia no site do MPT, com sigilo | MPT | MPT.MP.BR/ASSEDIO-ELEITORAL · SIGILO |

**Conferir antes de publicar:** se saiu balanço oficial do MPT, se a Justiça decidiu a liminar do Amapá e se o empresário respondeu, e se a "lista suja" do MTE foi publicada.

## 2.6 Trilha e sons

Sem trilha (o Estúdio não traz música). Efeitos do Estúdio, volume 0,25 a 0,45:

| Evento | Som |
|---|---|
| Palco gira (19, 44, 79) e troca de cena (7, 63, 85, 90) | `whoosh` |
| Pílula muda | `tique` |
| Posts, linhas da lista, contracheques, bonecos nascendo | `pop` (baixo) |
| Placa FECHADA (17), martelo (40), cancela (69), grades (78) | `baque` |
| Carimbo DISCRIMINAÇÃO (43) | `impacto` |
| × 2 (60), × 10 (66), ATÉ 4 ANOS (77) | `subida` |
| É ILEGAL (6), protagonista volta à mesa (55), ENTRE OUTROS (38) | `ding` |
| Cadeado do sigilo (97) | `tique` |
| Tela do celular muda (95) | `bip` |

## 2.7 Arquivos

- **Novos:** `src/videos/demissaovoto/DemissaoVoto.tsx` · `src/videos/demissaovoto/pecas.tsx` com:
  - `ParedeMeio`: parede com vão para a `Porta` e dois letreiros (um de cada face)
  - `TelaoPosts`: tela na parede com até 2 cartões de post (texto fixo) e o rótulo TEXTO DOS POSTS
  - `ListaLei`: folha que sobe do livro, com título e linhas que acendem (como a `ListaContran`, com texto livre)
  - `PlacaChao`: plaquinha de pé no chão (VOLTAR, EM DOBRO)
  - `palavras.ts` (já pronto)
- **Alterados:** `src/Root.tsx`, registrando `DemissaoVoto`, `DemissaoVotoGuia`, `DemissaoVotoLimpo` e `CapaDemissaoVoto`.
- **Reaproveitados do catálogo:**
  - mundo: `PalcoGiratorio`, `Porta`;
  - empresa: `Mesa`, `Cadeira`, `Candidato` (patrões, cinza), `RelogioPonto`, `CarteiraTrabalho`, `Contracheque`, `PilhaMoedas`, `Envelope`;
  - lei e Justiça: `LivroLei`, `OrgaoPublico`, `Martelo`, `DocumentoGrande`, `Escudo`, `Balanca`, `Grades`;
  - eleição e banco: `Urna`, `PredioColunas`, `Cancela`;
  - símbolos: `XMarca`, `ArcoPontos`, `Cadeado`, `IconeBalao`;
  - da base: `Boneco`, `Placa`, `Celular`, `Onda`.
- 2.493 quadros, em 4 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- "Variar o mundo": o 009 foi uma praça com tablados e o 010 uma fábrica em corte. Aqui é o palco giratório (frente e fundo), da lista de mundos sugeridos.
- Tema polêmico: o vídeo explica a lei; o "qualquer lado" ganha uma cena própria, com os dois patrões do mesmo tamanho e com o mesmo X.
- Política com nomes reais: a deputada e o empresário são bonecos genéricos com etiqueta, sem nome na tela e sem rosto; a resposta dela tem o mesmo destaque do processo. Todos os patrões e políticos em cinza.
- Acusação contra pessoa real: diz quem acusa (o MPT), a fase (processo) e a resposta da deputada.
- Selos de fonte: um por dado, na hora em que é dito.
- Objetos reconhecíveis: livro da lei, martelo, prédio com o nome do órgão, urna, cancela, carteira de trabalho.
- Gancho com "você": o protagonista em `tema.corpo` conduz o vídeo.
- Nada piscando: aro do palco, porta e urna acendem e apagam em pelo menos 0,5 s; grade desce devagar.
- Dois nomes ditos a menos de 1,5 s (deputada e empresário): um plano só.
- Multidão só nasce na palavra: os grupos de fora nascem em "políticos" e "empresários".

**Escolhas de direção (★):**
- o protagonista parando no meio do caminho em "quebrando";
- a urna do 2º turno no telão;
- os funcionários olhando o telão e o candidato dando meia-volta;
- a mini porta e a carteira de trabalho ao lado da lista;
- o funcionário que sai na demissão sem justa causa;
- o relógio de ponto que apaga e reacende;
- o envelope do dano moral;
- a fila de 10 contracheques;
- o balão com urna e porta (a ameaça sem inventar frase);
- a balança equilibrada em cima da parede;
- as testemunhas e o escudo final sobre a porta.

## Ajustes feitos na programação (31/10/2026)
- Letreiros EMPRESA e A LEI desceram para a parede, em cima da porta (em cima da parede eles brigavam com a pílula e os chips).
- Patrões, políticos, deputada e empresário em `tema.objeto` (cinza médio): o cinza escuro sumia no fundo.
- O telão dos posts apaga quando o palco gira para a lei, para "DEMITA PETISTA" não ficar no fundo do resto do vídeo.
- O prédio da Justiça afunda quando o palco volta para a empresa (o telhado aparecia por cima da parede); a lista dos motivos sai em "Justiça do Trabalho".
- Escudo da cena 3 menor e ao lado do protagonista (tapava ele).
- Banco público mais perto do centro e contracheques saindo em "ficar sem".
- Etiqueta VOCÊ já no gancho; mesa do protagonista com o monitor de lado; celular da cena 9 maior.
- Ficaram de fora dois extras ★ do plano: a mini porta e a carteira de trabalho ao lado da lista, e a urna pequena em "ameaçado". O X da regra ficou no verde da peça do catálogo.
