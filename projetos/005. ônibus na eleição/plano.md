# Plano de cenas: 005. ônibus na eleição (versão 1, aprovada em 25/10/2026)

Código `onibuseleicao` · Nome `OnibusEleicao` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · duração **257,76 s** · `AUDIO_SEG = 257.76` · `QUADROS = 7760` (com 0,9 s de folga).
- 787 palavras; a última ("direitos.") termina em 257,56 s. Sem buraco maior que 1,5 s.
- Ajustes da sincronia: "R $" → `R$` (2x), "71 ,7 %" → `71,7%`, "arroba EumagnoLeite" → `@eumagnoleite`, "17 horas e um minuto," → `17h01,`, "17 horas e dois minutos," → `17h02,`. Áudio emendado com 3 trechos regerados (Alagoas, Sergipe, final).
- Palavras repetidas e o `quando()` certo:

| Palavra | Vezes | Como chamar cada uma |
|---|---|---|
| ônibus | 16 | sempre por trecho único: `quando('Ônibus parados')`, `quando('ônibus que não vieram')`, `quando('achou ônibus')`... |
| frota | 6 | `quando('toda a frota')`, `quando('reduzir a frota')`, `quando('frota já começou')`, `quando('com a frota normal')`, `quando('frota de dia útil')`, `quando('recompor a frota de')` |
| TRE | 5 | `quando('TRE da Bahia')`, `quando('o TRE cobrou')`, `quando('o TRE mandou recompor')`, `quando('TRE negou')`, `quando('TRE deu uma hora')` |
| TSE | 5 | `quando('presidente do TSE')`, `quando('No TSE')`, `quando('TSE pausou')`, `quando('entre o TSE')`, `quando('ministros do TSE')` |
| prefeitura | 5 | por trecho: `quando('A prefeitura diz que é viagem')`, `quando('e a prefeitura diz')`, `quando('Feira, a prefeitura')`, `quando('A prefeitura nega')`, `quando('prefeitura abriu')` |
| Kassio | 3 | `quando('Kassio Nunes')` 158,88 · `quando('omissão de Kassio')` 229,60 · `quando('Kassio orientou')` 234,04 |
| Fachin | 3 | `quando('Edson Fachin')` 175,06 · `quando('Fachin tentava')` 225,60 · `quando('demora de Fachin')` 230,70 |
| Zanin | 3 | `quando('Cristiano Zanin')` 178,26 · `quando('Zanin mandou')` 181,44 · `quando('e Zanin')` 228,02 |
| 17h | 3 | `quando('fechar às 17h')` 167,18 · `quando('depois das 17h')` 205,96 · `quando('fecharam às 17h')` 217,44 |
| 19h | 2 | `quando('até as 19h')` 182,94 · `quando('seguem até')` 237,66 |
| urnas | 4 | `quando('vontade das urnas')`, `quando('as urnas deviam')`, `quando('muitas urnas')`, `quando('não fechar as urnas')` |
| seções | 3 | `quando('21 seções')`, `quando('as seções fecharam')`, `quando('só as seções')` |
| Míriam | 2 | `quando('colunista Míriam')` 171,76 · `quando('segundo Míriam')` 224,32 |
| prisão | 2 | `quando('ordem de prisão')` 1,70 · `quando('Justiça a prisão')` 87,92 |
| Bahia | 3 | `quando('Na Bahia')`, `quando('TRE da Bahia')`, `quando('Ainda na Bahia')` |
| denúncias | 3 | `quando('acompanha as denúncias')`, `quando('apenas denúncias')`, `quando('também houve apenas')` |
| mesários | 2 | `quando('17h14')` + `quando('mesários foram orientados')` · `quando('mesários foram liberados')` |

## 2.2 Ideia e mundo

**A metáfora: o Brasil-tabuleiro no dia da eleição.** O mapa do Brasil fica deitado no chão como um tabuleiro grande e escuro. Cada cidade citada é uma **maquete pop-up**: uma plataforma redonda que sobe num pedestal em cima do lugar dela no mapa, com garagem, ônibus, ponto, rua e a escola de votação. Quando a fala passa para outro estado, a maquete anterior desce até virar só um pino, e uma nova sobe. Na segunda parte ("a corrida contra o relógio"), sobe a maior maquete de todas, em Brasília: a praça com os prédios do **TSE**, do **STF** e do **Ministério Público Eleitoral**, e uma **torre de relógio** no meio. Dali saem os avisos (envelopes em arco) para os estados, e as urnas de cada cidade mostram se estavam abertas ou fechadas quando o aviso chegou.

O mundo não repete os anteriores: 003 foi a casa e a dívida, 004 foi a espiral da trajetória. O mapa como tabuleiro está na lista de mundos que funcionam para "onde fica, de onde vem".

**Protagonista:** não há "você" no gancho. O personagem-exemplo é **a eleitora no ponto** (boneco `tema.corpo`, sem rosto), que aparece no ponto de ônibus de cada maquete, esperando. É a regra de "trânsito e cidade: personagem-exemplo que passa pelo problema".

**Placar fixo (★):** fileira de **8 bolinhas** logo abaixo da pílula, uma por estado do Ministério da Justiça (BA, SP, RJ, PI, AL, SE, PB, PA). Nascem em "oito estados" e cada uma acende quando o vídeo chega ao estado. Some em "Agora repara" (149,42).

**Relógio fixo (★):** na parte 2, um relógio digital no canto direito do topo ("16:40", "17:01", "17:02"...) com a linha "HORÁRIO DE BRASÍLIA". Na parte 1 o mesmo lugar mostra "25/10 · 2º TURNO".

**Selos de fonte** (chip pequeno embaixo do assunto, um por dado, entra na palavra):

| Selo | Entra em | Texto |
|---|---|---|
| S1 | `contou falhas` | SEGUNDO O MINISTÉRIO DA JUSTIÇA |
| S2 | `missão da OEA` | NOTA DA MISSÃO DA OEA · 25/10 |
| S3 | `Procon achou` | PROCON-BA · DECISÃO DO TRE-BA |
| S4 | `PF diz` | POLÍCIA FEDERAL · NOTA DA PREFEITURA |
| S5 | `vereadores mostraram` | SEGUNDO VEREADORES DE ILHÉUS |
| S6 | `presidente do TSE deu` | DESPACHO DO PRESIDENTE DO TSE |
| S7 | `71,7%` | INFOBUS · 13H20 |
| S8 | `campanha de Lula pediu à` | PEDIDO À 1ª ZONA ELEITORAL |
| S9 | `TRE cobrou` | TRE-RJ |
| S10 | `TRE mandou recompor` | TRE-PI |
| S11 | `TRE negou` | TRE-AL |
| S12 | `passageiros relataram` | RELATO DE PASSAGEIROS · TRE-SE |
| S13 | `balsa` | DIÁRIO DO PARÁ |
| S14 | `MP disse não` (`disse não`) | PARECER DO MP ELEITORAL · 17H01 |
| S15 | `colunista Míriam` | SEGUNDO MÍRIAM LEITÃO, O GLOBO |
| S16 | `Zanin mandou` | DECISÃO DE ZANIN (STF) · 17H02 |
| S17 | `Segundo a Folha` | SEGUNDO A FOLHA · RELATO DE MESÁRIOS |
| S18 | `não receberam aviso` | TRE-DF E TRE-MG |
| S19 | `Para ela` | OPINIÃO DA COLUNISTA |
| S20 | `Kassio orientou` | OFÍCIO DO TSE · 18H12 |

**Paleta** (nenhuma cor fixa; tudo do tema):

| Uso | Campo do tema |
|---|---|
| fundo, névoa | `tema.fundo` |
| mar em volta do mapa | `mistura(festa.azulNoite, tema.chao, 0,35)` (igual ao Tabuleiro) |
| mapa do Brasil | `mistura(tema.areia, tema.objetoEscuro, 0,55)` |
| estado citado (disco de luz no mapa) | `mistura(mapa, tema.objetoClaro, k)`, suave |
| plataformas das maquetes | `tema.objetoEscuro`, borda `tema.objeto` |
| ruas | `tom(tema.chao, 0,1)` |
| ônibus | peça `Onibus` (corpo `tema.objeto`, faixa `tema.corpo`) |
| ônibus rodando / frota de volta / urna aberta | **`tema.acento`** (faróis e brilho) |
| ônibus parado na garagem / urna fechada | `tema.objeto`, sem brilho (cinza) |
| eleitora no ponto | `tema.corpo` |
| pessoas comuns, mesários, vereadores | `tema.pessoa` |
| prédios da Justiça (TRE, TSE, STF, MP) | `OrgaoPublico` (parede `tema.objeto`, letreiro) |
| envelopes dos pedidos (Lula e Flávio iguais) | `tema.objetoClaro` |
| decisão/ordem (documento) | `tema.branco` com carimbo `tom(tema.areia, -0,2)` |
| autoridades e políticos (bonecos com placa) | todos `tema.objetoClaro`, mesma cor para todos |
| chuva (pedido do Flávio) | `festa.azul` nas gotas |

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; mapa com `geo(lon, lat) = [lon + 54, 0,36, −(lat + 15)]`, o dobro da escala do `Tabuleiro` antigo):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mapa do Brasil (`MapaTabuleiro`, peça nova) | centro ≈ [0, 0, −1], 40 × 39 m | contorno do `Tabuleiro` (fumaca.tsx) em escala 1,0; sem árvores; topo em y 0,36 |
| Mar em volta | [0, 0,04, −1], 70 × 66 m | plano fosco |
| Pino de cada cidade (`Pino`) | no `geo()` da cidade | nasce quando a cidade é dita; fica até o fim (memória do caminho) |
| Maquete pop-up (`Maquete`, peça nova) | 2,4 a 2,8 m acima do pino, diâmetro 3,2 m | pedestal fino até o pino; sobe na palavra da cidade, desce quando a cena acaba |
| Salvador | pino [15,5, 0,36, −2,0] · maquete [18,0, 2,6, −2,6] | garagem grande (4 vagas), rua, ponto com a eleitora, escola com urna |
| Lauro de Freitas | pino [15,7, 0,36, −2,1] · maquete [16,8, 2,6, −5,6] | ponto com 3 moradores, rua vazia |
| Feira de Santana | pino [15,0, 0,36, −2,7] · maquete [12,6, 2,6, −4,6] | 2 ônibus rodando na rua (frota de dia útil) |
| Ilhéus | pino [15,0, 0,36, −0,2] · maquete [17,6, 2,6, 1,4] | garagem com placa "EMPRESA" (sem nome real) e 3 vereadores |
| São Paulo | pino [7,4, 0,36, 8,6] · maquete [5,6, 2,8, 11,2] | garagem grande com 10 vagas (7 saem, 3 ficam) e prédio "TRE-SP" ao lado |
| Taboão da Serra | pino [7,2, 0,36, 8,6] | só pino (entra na cena dos mesários) |
| Petrópolis / São Gonçalo | pinos [10,8, 0,36, 7,5] / [11,0, 0,36, 7,8] · maquete única [13,2, 2,6, 9,6] | dois pontos de ônibus lado a lado com placas |
| Teresina | pino [11,2, 0,36, −9,9] · maquete [11,2, 2,6, −12,6] | garagem e prédio "TRE-PI" |
| Maceió | pino [18,3, 0,36, −5,3] · maquete [21,0, 2,6, −6,4] | ponto, prédio "TRE-AL" com carimbo NEGADO |
| Aracaju | pino [16,9, 0,36, −4,1] · maquete [20,2, 2,6, −2,4] | rodoviária com fila de 12 bonecos, ônibus de viagem |
| João Pessoa | pino [19,1, 0,36, −7,9] · maquete [21,6, 2,6, −9,6] | ônibus que passa direto pelo ponto |
| Belém / Marajó | pino [5,5, 0,36, −13,5] · maquete [5,0, 2,8, −17,0] | porto (`Cais`), balsa (`NavioMini`) lotada saindo, 20 bonecos no cais |
| Brasília (praça dos poderes) | pino [6,1, 0,36, 0,8] · maquete grande [6,1, 3,2, 0,8], diâmetro 6 m | prédios TSE (esq.), STF (dir.), MP ELEITORAL (fundo), torre do relógio no centro |
| Nova Veneza (GO) | pino [4,7, 0,36, 1,4] | escola com urna fechada |
| Belo Horizonte (TRE-MG) | pino [10,1, 0,36, 4,9] | urna fechada |
| Brasília TRE-DF | pino [6,6, 0,36, 1,4] | urna fechada |
| Seção da USP (cena 9a) | maquete [5,6, 2,8, 11,2] (a de SP troca de conteúdo) | sala com 21 urnas em grade 7 × 3 |
| "Paris" | arco que sai de Salvador para o leste e termina num chip "PARIS" fora do mapa, [34, 3, −6] | `Jatinho` pequeno no fim do arco |

**Regras visuais deste vídeo**
- O vídeo não toma lado. Os dois pedidos de mais tempo (Lula e Flávio) aparecem como **dois envelopes iguais**, lado a lado, com o mesmo tempo de tela. Nenhuma cor de partido.
- Toda acusação na tela diz **quem acusa** ("SEGUNDO VEREADORES", "PEDIDO DA CAMPANHA", "DENÚNCIA") e a resposta entra num chip **RESPOSTA** com o mesmo tamanho. Ilhéus: chip "PREFEITO NÃO SE PRONUNCIOU".
- Pessoas reais só como bonecos genéricos sem rosto, todos da mesma cor neutra, com placa do nome e do cargo (Pablo Souza, Bruno Reis, Ricardo Nunes, Guilherme Boulos, Kassio Nunes Marques, Edson Fachin, Cristiano Zanin). Lula e Flávio não aparecem como bonecos: só os envelopes com "CAMPANHA DE LULA" e "CAMPANHA DE FLÁVIO".
- "Ordem de prisão" é um documento com carimbo, nunca grade, algema ou polícia levando alguém.
- A opinião de Míriam Leitão vai num cartão diferente, com a palavra **OPINIÃO**, nunca com selo de fato.
- O acento verde só marca **o que está funcionando**: ônibus rodando, urna aberta. Ônibus parado e urna fechada ficam cinza.
- Nada de logos (OEA, Procon, TSE, PF, SPTrans, OAB): só nomes escritos na fonte do perfil.

## 2.3 Mapa de palavras-chave

Tempos do `palavras.ts`. ★ = extra sugerido pelo diretor.

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Ônibus parados` | 0,00 | Garagem (maquete de Salvador, sem nome) | Abre em close: 4 ônibus parados lado a lado, faróis apagados | 1 |
| 2 | `parados` | 0,40 | Ônibus | ★ portas fechadas, pó leve de garagem (partículas paradas) | 1 |
| 3 | `secretário` | 1,10 | Boneco com placa "SECRETÁRIO" | Sobe na frente da garagem | 1 |
| 4 | `ordem de prisão` | 1,70 | Documento grande | Desce na frente do boneco e recebe o carimbo "ORDEM DE PRISÃO" | 1 |
| 5 | `votação` | 2,70 | Urna (escola ao lado) | Urna nasce acesa (verde) | 1 |
| 6 | `estendida` | 3,06 | Relógio de mesa | Ponteiro gira de 17h para 19h | 1 |
| 7 | `em cima da hora` | 3,68 | Relógio | ★ pulso suave no aro | 1 |
| 8 | `O que aconteceu` | 4,72 | Câmera | Sobe da garagem e revela o mapa do Brasil inteiro | 1 |
| 9 | `segundo turno` | 5,34 | Chip 2D | "2º TURNO" no topo direito | 1 |
| 10 | `2026?` | 6,00 | Chip 2D | completa "25/10/2026" | 1 |
| 11 | `Neste domingo` | 7,26 | Mapa | A maquete de Salvador desce até virar pino | 2 |
| 12 | `eleitores` | 8,40 | Pontos de ônibus | ★ 12 pontinhos de ônibus nascem espalhados pelo mapa, cada um com um boneco esperando | 2 |
| 13 | `Brasil todo` | 8,88 | Mapa | Contorno do mapa acende suave e volta | 2 |
| 14 | `esperaram` | 9,48 | Bonecos nos pontos | Olham para o lado da rua (cabeça vira) | 2 |
| 15 | `que não vieram` | 10,48 | Pontos | Nenhum ônibus chega; ★ um "?" pequeno sobe de 3 pontos | 2 |
| 16 | `Ministério da Justiça` | 11,62 | Selo S1 | Entra | 2 |
| 17 | `contou falhas` | 12,52 | Placar de 8 bolinhas | Nasce embaixo da pílula, apagado | 2 |
| 18 | `oito estados` | 13,96 | Mapa | 8 discos de luz acendem em sequência (BA, SP, RJ, PI, AL, SE, PB, PA), 0,1 s cada | 2 |
| 19 | `estados.` | 14,20 | Contador 2D | "8 ESTADOS" | 2 |
| 20 | `missão da OEA` | 15,24 | Lupa grande (`Lupa`) | Passa por cima do mapa devagar | 2 |
| 21 | `OEA,` | 15,64 | Selo S2 | Entra | 2 |
| 22 | `observa a eleição` | 16,32 | Lupa | Para em cima do centro do mapa | 2 |
| 23 | `acompanha as denúncias` | 17,74 | Discos dos 8 estados | Pulso suave (a lupa "olha" cada um) | 2 |
| 24 | `respeito à vontade` | 19,24 | Urna gigante (★) | Sobe no centro do mapa, acesa | 2 |
| 25 | `das urnas.` | 20,32 | Chip | "RESPEITEM A VONTADE DAS URNAS" (citação, com crédito OEA) | 2 |
| 26 | `Vamos estado por estado` | 20,96 | Câmera | Lupa e urna somem; câmera mergulha para a Bahia | 2 |
| 27 | `Na Bahia` | 22,84 | Disco BA + bolinha 1 do placar | Acende | 3a |
| 28 | `caso mais grave` | 23,62 | Chip | "O CASO MAIS GRAVE" | 3a |
| 29 | `Salvador.` | 24,66 | Maquete Salvador | Sobe do pino com pedestal | 3a |
| 30 | `Procon` | 25,50 | Boneco com prancheta e placa "PROCON" | Entra na porta da garagem | 3a |
| 31 | `achou ônibus parados` | 25,78 | Garagem | 4 ônibus parados aparecem (luz da garagem acende devagar) | 3a |
| 32 | `garagens.` | 27,04 | Selo S3 | Entra | 3a |
| 33 | `TRE da Bahia` | 28,02 | Prédio "TRE-BA" | Sobe na borda da maquete | 3a |
| 34 | `mandou voltar` | 28,98 | Envelope | Voa do TRE até a garagem | 3a |
| 35 | `toda a frota` | 29,72 | Ônibus | Faróis acendem (acento), motores "ligam" (leve tremor) | 3a |
| 36 | `multa` | 30,82 | Contador 2D | "MULTA" | 3a |
| 37 | `R$ 1 milhão` | 31,20 | Contador 2D + pilha de moedas | "R$ 1 MILHÃO"; pilha de moedas cresce ao lado do TRE | 3a |
| 38 | `por hora` | 31,60 | Relógio de mesa | ★ ponteiro dá uma volta | 3a |
| 39 | `Polícia Federal` | 32,98 | Placa "POLÍCIA FEDERAL" | Entra num cartão 2D | 3a |
| 40 | `prender o secretário` | 33,64 | Documento | "ORDEM DE PRISÃO" com carimbo | 3a |
| 41 | `Pablo Souza` | 35,52 | Boneco com placa "PABLO SOUZA · SECRETÁRIO" | Sobe ao lado do documento | 3a |
| 42 | `PF diz` | 36,74 | Selo S4 | Entra | 3a |
| 43 | `está em Paris` | 37,98 | Arco de pontos + jatinho | Arco sai de Salvador para o leste, fora do mapa; chip "PARIS" | 3a |
| 44 | `Paris.` | 38,10 | Boneco do secretário | ★ fica transparente na maquete (não está lá) | 3a |
| 45 | `prefeitura diz` | 38,82 | Chip RESPOSTA | "PREFEITURA: VIAGEM OFICIAL" | 3a |
| 46 | `volta amanhã` | 40,90 | Chip | "VOLTA NA SEGUNDA (26)" | 3a |
| 47 | `Bruno Reis` | 42,46 | Boneco com placa "BRUNO REIS · PREFEITO" | Sobe ao lado da garagem | 3a |
| 48 | `nega` | 43,04 | Chip RESPOSTA | "NEGA ORDEM PARA REDUZIR" | 3a |
| 49 | `reduzir a frota` | 44,04 | Ônibus | ★ 2 ônibus recuam para a vaga | 3a |
| 50 | `adesivos eleitorais` | 45,40 | Adesivos | Placas pequenas aparecem nas laterais dos ônibus | 3a |
| 51 | `nos ônibus.` | 46,42 | Chip | "CULPA ADESIVOS" | 3a |
| 52 | `frota já começou` | 47,92 | Ônibus | Os 4 saem da garagem pela rua, faróis verdes | 3a |
| 53 | `voltar ao normal` | 48,80 | Ponto | A eleitora embarca no primeiro ônibus | 3a |
| 54 | `Ainda na Bahia` | 50,04 | Maquete Salvador | Desce até virar pino | 3b |
| 55 | `Ilhéus` | 51,16 | Maquete Ilhéus | Sobe | 3b |
| 56 | `vereadores` | 51,68 | 3 bonecos `tema.pessoa` | Entram na porta da garagem | 3b |
| 57 | `mostraram` | 52,14 | Vereadores | Braço apontando para dentro | 3b |
| 58 | `ônibus parados` | 52,66 | Garagem | 5 ônibus parados aparecem | 3b |
| 59 | `garagem de uma empresa` | 53,54 | Letreiro "EMPRESA" | Acende em cima da garagem | 3b |
| 60 | `segundo eles` | 54,82 | Selo S5 | Entra | 3b |
| 61 | `família do prefeito` | 55,64 | Chip | "LIGADA À FAMÍLIA DO PREFEITO (SEGUNDO VEREADORES)" | 3b |
| 62 | `não se pronunciou` | 57,34 | Chip RESPOSTA | "PREFEITO NÃO SE PRONUNCIOU" | 3b |
| 63 | `presidente do TSE` | 58,96 | Prédio "TSE" pequeno em Brasília (pino) | Acende no mapa | 3c |
| 64 | `meia hora` | 60,50 | Ampulheta (`Ampulheta`) | Nasce ao lado do pino de Brasília | 3c |
| 65 | `prefeituras` | 61,22 | Câmera | Abre para mostrar Brasília e a Bahia | 3c |
| 66 | `Salvador,` | 61,82 | Arco de pontos 1 | Brasília → Salvador | 3c |
| 67 | `Feira de Santana` | 62,54 | Arco 2 + pino Feira | Brasília → Feira | 3c |
| 68 | `Lauro de Freitas` | 63,46 | Arco 3 + pino Lauro | Brasília → Lauro | 3c |
| 69 | `explicarem` | 64,16 | Selo S6 | Entra | 3c |
| 70 | `Em Feira de Santana` | 66,28 | Maquetes de Feira e de Lauro | Sobem juntas (duas no mesmo plano) | 3c |
| 71 | `apenas denúncias` | 68,92 | Chips | "DENÚNCIA" em cima das duas; ★ sem carimbo | 3c |
| 72 | `Em Lauro` | 70,36 | Maquete Lauro | Pulso suave | 3c |
| 73 | `moradores` | 70,78 | 3 bonecos no ponto | Nascem | 3c |
| 74 | `não conseguiam pegar ônibus` | 71,84 | Rua de Lauro | Vazia; bonecos olham para a rua | 3c |
| 75 | `prefeitura diz` | 73,98 | Chip RESPOSTA | "PREFEITURA: GRÁTIS O DIA TODO" | 3c |
| 76 | `frota normal` | 76,60 | Ônibus | 1 ônibus passa na rua de Lauro | 3c |
| 77 | `Em Feira` | 77,96 | Maquete Feira | Pulso suave | 3c |
| 78 | `frota de dia útil` | 79,62 | 2 ônibus rodando + chip RESPOSTA | "PREFEITURA: FROTA DE DIA ÚTIL" | 3c |
| 79 | `Em São Paulo` | 80,90 | Maquetes da Bahia | Descem; câmera viaja ao sul | 4 |
| 80 | `São Paulo` | 81,46 | Disco SP + bolinha 2 | Acende | 4 |
| 81 | `13h20` | 82,18 | Relógio fixo 2D | Mostra "13:20" por 2 s | 4 |
| 82 | `71,7%` | 83,22 | Maquete SP: garagem de 10 vagas | 7 ônibus saem (verde), 3 ficam (cinza); chip "71,7% RODANDO" | 4 |
| 83 | `71,7%` | 83,22 | Selo S7 | Entra | 4 |
| 84 | `capital rodavam` | 85,48 | Ônibus | Os 7 rodam pela avenida da maquete | 4 |
| 85 | `campanha de Lula pediu` | 86,82 | Envelope "CAMPANHA DE LULA" | Voa até o prédio "TRE-SP" | 4 |
| 86 | `Justiça a prisão` | 87,92 | Selo S8 | Entra | 4 |
| 87 | `secretário de Mobilidade` | 88,82 | Boneco com placa "SECRETÁRIO DE MOBILIDADE" | Sobe | 4 |
| 88 | `presidente da SPTrans` | 90,32 | Boneco com placa "PRESIDENTE DA SPTRANS" | Sobe ao lado (os dois no mesmo plano) | 4 |
| 89 | `Guilherme Boulos` | 92,24 | Boneco com placa "GUILHERME BOULOS" | Sobe do outro lado | 4 |
| 90 | `vai pedir` | 93,30 | Chip | "VAI PEDIR" (pontilhado: ainda não pediu) | 4 |
| 91 | `Ricardo Nunes` | 94,56 | Boneco com placa "RICARDO NUNES · PREFEITO" | Sobe | 4 |
| 92 | `Ainda não há decisão` | 95,72 | Chip | "SEM DECISÃO" em cima do TRE-SP | 4 |
| 93 | `Nunes diz` | 97,12 | Chip RESPOSTA | "MAIS ÔNIBUS QUE PASSAGEIROS" | 4 |
| 94 | `passageiros.` | 98,74 | ★ Balança pequena | Ônibus num prato, bonecos no outro; a balança pende para os ônibus | 4 |
| 95 | `No Rio de Janeiro` | 99,70 | Disco RJ + bolinha 3 | Acende; maquete de SP desce | 5 |
| 96 | `TRE cobrou` | 101,02 | Prédio "TRE-RJ" + selo S9 | Sobe na maquete RJ | 5 |
| 97 | `mais ônibus` | 101,88 | Ônibus | 2 ônibus entram nos pontos | 5 |
| 98 | `Petrópolis` | 102,60 | Placa do ponto 1 + pino | "PETRÓPOLIS" | 5 |
| 99 | `São Gonçalo` | 103,46 | Placa do ponto 2 + pino | "SÃO GONÇALO" | 5 |
| 100 | `No Piauí` | 104,46 | Disco PI + bolinha 4 | Acende; câmera viaja ao Nordeste | 6a |
| 101 | `TRE mandou recompor` | 105,46 | Maquete Teresina + "TRE-PI" + selo S10 | Sobem | 6a |
| 102 | `frota de Teresina` | 106,88 | Garagem | 4 ônibus saem | 6a |
| 103 | `R$ 1 milhão` (2ª) | 108,50 | Contador 2D | "R$ 1 MILHÃO" | 6a |
| 104 | `por hora.` | 108,90 | Contador | "POR HORA" | 6a |
| 105 | `Em Alagoas` | 110,04 | Disco AL + bolinha 5 | Acende; maquete PI desce | 6b |
| 106 | `PT denunciou` | 111,06 | Envelope "DENÚNCIA DO PT" | Voa até "TRE-AL" | 6b |
| 107 | `Maceió` | 112,62 | Maquete Maceió | Sobe | 6b |
| 108 | `TRE negou` | 113,60 | Documento + carimbo "NEGADO" | Carimbo desce (baque) + selo S11 | 6b |
| 109 | `não havia tempo` | 115,58 | Chip | "SEM TEMPO" | 6b |
| 110 | `nem provas` | 116,22 | Chip | "SEM PROVAS" | 6b |
| 111 | `prefeitura nega` | 117,10 | Chip RESPOSTA | "PREFEITURA NEGA" | 6b |
| 112 | `Em Sergipe` | 118,62 | Disco SE + bolinha 6 | Acende | 6c |
| 113 | `passageiros relataram` | 119,64 | Maquete Aracaju: rodoviária | Sobe; fila de 12 bonecos + selo S12 | 6c |
| 114 | `cerca de duas horas` | 121,12 | Relógio | Ponteiro dá duas voltas; chip "CERCA DE 2 H DE ESPERA" | 6c |
| 115 | `rodoviária de Aracaju` | 122,26 | Placa | "RODOVIÁRIA" | 6c |
| 116 | `TRE deu uma hora` | 123,70 | Prédio "TRE-SE" + ampulheta | Sobe; ampulheta de 1 hora | 6c |
| 117 | `para o interior` | 126,08 | Ônibus de viagem | 2 ônibus saem da rodoviária para fora da maquete | 6c |
| 118 | `governo do estado diz` | 127,08 | Chip RESPOSTA | "GOVERNO: +20 ÔNIBUS" | 6c |
| 119 | `20 ônibus` | 128,62 | ★ 20 mini ônibus | Entram em fila na rodoviária | 6c |
| 120 | `procura foi maior` | 129,76 | Fila | Fila cresce para 20 bonecos; chip "PROCURA MAIOR QUE A ESPERADA" | 6c |
| 121 | `Na Paraíba` | 131,58 | Disco PB + bolinha 7 | Acende | 6d |
| 122 | `João Pessoa` | 132,52 | Maquete JP | Sobe | 6d |
| 123 | `apenas denúncias` (2ª: `também houve apenas`) | 133,28 | Chip | "DENÚNCIA" | 6d |
| 124 | `eleitores disseram` | 134,86 | 3 bonecos no ponto | Acenam | 6d |
| 125 | `não paravam nos pontos` | 136,34 | Ônibus | Passa direto pelo ponto sem parar | 6d |
| 126 | `prefeitura abriu` | 138,00 | Chip RESPOSTA + lupa pequena | "PREFEITURA ABRIU APURAÇÃO" | 6d |
| 127 | `No Pará` | 139,82 | Disco PA + bolinha 8 | Acende; câmera viaja ao Norte | 7 |
| 128 | `balsa` | 140,76 | Maquete Belém: cais + balsa | Sobe; balsa encostada | 7 |
| 129 | `Marajó` | 141,36 | Placa + selo S13 | "PARA O MARAJÓ" | 7 |
| 130 | `saiu lotada` | 141,74 | Balsa | Sai do cais, cheia de bonecos | 7 |
| 131 | `200 pessoas` | 143,08 | 20 bonecos no cais + contador | Ficam no cais; contador "+200 PESSOAS" | 7 |
| 132 | `no porto, em Belém` | 144,28 | Placa | "PORTO · BELÉM" | 7 |
| 133 | `prefeito de Belém` | 145,72 | Envelope "PREFEITO DE BELÉM" | Voa até "TRE-PA" | 7 |
| 134 | `OAB` | 146,76 | Envelope "OAB-PA" | Voa junto | 7 |
| 135 | `contra as empresas` | 148,16 | Chip | "CONTRA AS EMPRESAS" | 7 |
| 136 | `Agora repara` | 149,42 | Câmera + placar | Placar de 8 some; todas as maquetes descem; câmera sobe e vai a Brasília | 8 |
| 137 | `corrida contra o relógio` | 150,42 | Maquete Brasília + torre do relógio | Sobem; relógio fixo 2D liga ("16:00") | 8 |
| 138 | `campanha de Lula pediu mais tempo` | 152,04 | Envelope "CAMPANHA DE LULA" | Voa até o TSE | 8 |
| 139 | `de Flávio também` | 154,68 | Envelope "CAMPANHA DE FLÁVIO" | Voa até o TSE, mesmo tamanho, lado a lado | 8 |
| 140 | `17 cidades` | 155,62 | Contador | "17 CIDADES" | 8 |
| 141 | `com chuva` | 156,70 | Nuvem com chuva (`NuvemChuva`) | Sobre SP, PR e SC no mapa (ao fundo) | 8 |
| 142 | `No TSE` | 157,66 | Prédio "TSE" | Pulso suave | 8 |
| 143 | `Kassio Nunes Marques` | 158,88 | Boneco com placa "KASSIO NUNES MARQUES · PRESIDENTE DO TSE" | Sobe na frente do TSE | 8 |
| 144 | `meia hora` (2ª) | 160,44 | Ampulheta | 30 min | 8 |
| 145 | `Ministério Público Eleitoral` | 161,14 | Prédio "MP ELEITORAL" | Pulso; envelope vai do TSE ao MP | 8 |
| 146 | `17h01` | 163,30 | Relógio fixo + torre | "17:01" | 8 |
| 147 | `disse não` | 165,62 | Documento + carimbo "CONTRA" | Volta ao TSE; selo S14 | 8 |
| 148 | `fechar às 17h` | 167,18 | Urnas do mapa | ★ todas as urnas pequenas nos pinos ficam cinza devagar | 8 |
| 149 | `chegou ao STF` | 169,54 | Prédio "STF" + envelope | Envelope (pedido) voa ao STF | 8 |
| 150 | `colunista Míriam Leitão` | 171,76 | Selo S15 | Entra | 8 |
| 151 | `Edson Fachin` | 175,06 | Boneco com placa "EDSON FACHIN · PRESIDENTE DO STF" | Sobe na frente do STF | 8 |
| 152 | `16h40` | 176,32 | Relógio fixo | Volta para "16:40" (com seta "◀ ANTES") | 8 |
| 153 | `o mandou para` | 177,38 | Envelope | Passa de Fachin para Zanin | 8 |
| 154 | `Cristiano Zanin` | 178,26 | Boneco com placa "CRISTIANO ZANIN · MINISTRO DO STF" | Sobe ao lado de Fachin (os dois no mesmo plano) | 8 |
| 155 | `17h02` | 179,76 | Relógio fixo | "17:02" | 8 |
| 156 | `Zanin mandou` | 181,44 | Documento "ATÉ 19H" | Sobe na mão de Zanin; selo S16 | 8 |
| 157 | `estender a votação` | 182,08 | Torre do relógio | Ponteiro avança de 17h a 19h | 8 |
| 158 | `19h` | 183,38 | Chip | "VOTAÇÃO ATÉ 19H" | 8 |
| 159 | `país todo` | 184,22 | Arcos de pontos | Saem do STF para os 27 estados | 8 |
| 160 | `Mas` | 185,24 | Câmera | Sobe para ver o mapa inteiro | 9a |
| 161 | `muitas urnas` | 185,54 | Urnas nos pinos | Os arcos chegam e encontram urnas já cinza | 9a |
| 162 | `já tinham fechado` | 186,44 | Chip | "URNAS JÁ FECHADAS" | 9a |
| 163 | `Segundo a Folha` | 187,78 | Selo S17 | Entra; maquete de SP sobe como seção eleitoral | 9a |
| 164 | `17h14` | 188,90 | Relógio fixo + celular gigante | "17:14"; celular com mensagem "NÃO FECHEM AS URNAS" | 9a |
| 165 | `mesários foram orientados` | 190,04 | 4 mesários na sala | Olham para o celular | 9a |
| 166 | `não fechar as urnas` | 192,18 | Urnas da sala | Pulso verde nas abertas | 9a |
| 167 | `17h38` | 193,76 | Relógio fixo + celular | "17:38"; nova mensagem | 9a |
| 168 | `seção fechada não reabre` | 196,06 | Celular | "SEÇÃO FECHADA NÃO REABRE" | 9a |
| 169 | `Faculdade de Direito da USP` | 198,12 | Placa | "FACULDADE DE DIREITO · USP" | 9a |
| 170 | `só 7` | 199,78 | Grade de 21 urnas | 7 acendem (verde) uma a uma | 9a |
| 171 | `de 21 seções` | 200,30 | Grade | 14 ficam cinza; contador "7 DE 21 ABERTAS" | 9a |
| 172 | `Taboão da Serra` | 202,94 | Pino Taboão | Acende; chip "TABOÃO DA SERRA" | 9a |
| 173 | `mesários foram liberados` | 203,96 | Mesários | Saem pela porta da sala | 9a |
| 174 | `depois das 17h` | 205,96 | Boneco na porta | Eleitor chega atrasado | 9a |
| 175 | `nome anotado em ata` | 207,68 | Ata (`Documento`) | Uma linha se escreve | 9a |
| 176 | `sem poder votar` | 208,90 | Eleitor | Fica parado na porta; urna dele cinza | 9a |
| 177 | `TREs do Distrito Federal` | 210,46 | Pino DF + urna | Acende; urna cinza | 9b |
| 178 | `e de Minas` | 212,24 | Pino MG + urna | Acende; urna cinza (os dois no mesmo plano) | 9b |
| 179 | `não receberam aviso` | 213,16 | Arcos | Arco do aviso chega atrasado e some; selo S18 | 9b |
| 180 | `Nova Veneza` | 215,66 | Pino GO + escola pequena | Acende | 9b |
| 181 | `fecharam às 17h` | 217,44 | Urna | Porta da seção fecha | 9b |
| 182 | `o aviso não chegou` | 219,20 | Envelope | Para no meio do arco e some | 9b |
| 183 | `TSE pausou` | 220,76 | Painel de apuração (★, `Barras` num telão) | As barras param; chip "CONTAGEM PAUSADA" | 9b |
| 184 | `18h` | 223,54 | Relógio fixo | "18:00" | 10 |
| 185 | `segundo Míriam` | 224,32 | Selo S15 | Volta | 10 |
| 186 | `Fachin tentava resolver` | 225,60 | Balança da Justiça (`BalancaJustica`) | Sobe entre TSE e STF | 10 |
| 187 | `impasse` | 226,70 | Balança | Pende para um lado e para o outro | 10 |
| 188 | `entre o TSE` | 227,36 | Prédio TSE | Pulso | 10 |
| 189 | `e Zanin` | 228,02 | Boneco Zanin | Pulso | 10 |
| 190 | `Para ela` | 228,94 | Cartão OPINIÃO (S19) | Entra, com borda diferente | 10 |
| 191 | `omissão de Kassio` | 229,60 | Cartão | Linha "OMISSÃO DE KASSIO" | 10 |
| 192 | `demora de Fachin` | 230,70 | Cartão | Linha "DEMORA DE FACHIN" | 10 |
| 193 | `criaram a confusão` | 231,44 | Balança | Para no meio; cartão sai | 10 |
| 194 | `18h12` | 233,14 | Relógio fixo | "18:12" | 10 |
| 195 | `Kassio orientou` | 234,04 | Boneco Kassio + ofício | Ofício sobe; selo S20 | 10 |
| 196 | `os TREs` | 234,92 | Arcos | Do TSE para os estados | 10 |
| 197 | `ainda estavam abertas` | 236,84 | Urnas do mapa | As abertas pulsam verde | 10 |
| 198 | `seguem até as 19h` | 237,66 | Chip + torre | "ABERTAS SEGUEM ATÉ 19H" | 10 |
| 199 | `As que fecharam` | 239,28 | Urnas cinza | Ficam cinza | 10 |
| 200 | `não reabrem` | 240,44 | Chip | "FECHADAS NÃO REABREM" | 10 |
| 201 | `ministros do TSE` | 241,68 | Prédio TSE | Bonecos entram | 10 |
| 202 | `portas fechadas` | 243,62 | Porta do TSE | Fecha devagar | 10 |
| 203 | `Ainda falta saber` | 244,70 | Câmera | Sobe para o mapa inteiro com todos os pinos | 11 |
| 204 | `quem será punido` | 245,62 | Chip "?" | Sobe dos pinos com decisão (Salvador, SP, Teresina) | 11 |
| 205 | `falta de ônibus` | 246,64 | Pontos | Os pontos do mapa acendem uma última vez | 11 |
| 206 | `quando a contagem` | 247,78 | Painel de apuração | Barras paradas; chip "CONTAGEM PAUSADA" | 11 |
| 207 | `volta.` | 249,08 | Chip | "?" | 11 |
| 208 | `Na sua cidade` | 249,68 | Eleitora no ponto (close) | A eleitora do primeiro ponto aparece em close | 11 |
| 209 | `o ônibus passou?` | 250,60 | Ônibus | Um ônibus verde para no ponto | 11 |
| 210 | `Me conta nos comentários` | 251,50 | Chip | "COMENTA AQUI" | 11 |
| 211 | `@eumagnoleite` | 253,46 | Assinatura | @eumagnoleite com a marca | 11 |
| 212 | `direitos.` | 257,12 | Tudo | Escurece suave até o fim (0,9 s) | 11 |

Total: 212 eventos em 258 s, cerca de 0,8 evento por segundo.

## 2.4 Cenas com câmera

Coordenadas em metros. "Enq." = `enquadrar(alvo, larg, alt, dir)`. Todas com `cinematizar` (arco, grua e lente leve). Câmera nunca parada.

### CENA 1: O GANCHO (0,00 a 7,26 s)
Abre em 0 · Sai em `quando('Neste domingo')` · Eventos 1 a 10
- 1a (0 a 4,6): close na garagem de Salvador. Pos [19,4, 3,6, 0,4] · alvo [18,0, 3,0, −2,6] · dist 3,6 · ângulo 18°. Avanço lento de lente.
- 1b (4,6 a 7,26): grua para cima até o mapa inteiro. Pos de [19,4, 3,6, 0,4] para [2, 58, 30] · alvo [1, 0, −1] · dist 66 · ângulo 63°. Distância em escala logarítmica (regra do zoom rua → país). `alcance` do Palco: 320 nesta cena.
- Texto: chip "2º TURNO · 25/10/2026" no relógio fixo.
- Pílula: SEGUNDO TURNO
- Aha: alguma coisa grande aconteceu no domingo da eleição, e foi por causa de ônibus.

### CENA 2: O BRASIL TODO (7,26 a 22,84 s)
Abre em `quando('Neste domingo')` · Sai em `quando('Na Bahia')` · Eventos 11 a 26
- 2a (7,26 a 20,96): mapa inteiro de cima, um pouco inclinado. Enq. [1, 0, −1], 42 × 42, dir [0,1, 1, 0,55] · dist ≈ 64 · ângulo 61°. Arco lento de 0,1 rad.
- 2b (20,96 a 22,84): mergulho para a Bahia. Alvo de [1, 0, −1] para [16, 1, −2] · dist de 64 para 14 (log) · ângulo de 61° para 40°.
- Texto: selos S1 e S2, contador "8 ESTADOS", citação da OEA.
- Pílula: O PAÍS TODO
- Aha: não foi um problema de uma cidade; foram oito estados.

### CENA 3: BAHIA (22,84 a 80,90 s)
Abre em `quando('Na Bahia')` · Sai em `quando('Em São Paulo')` · Eventos 27 a 78
- 3a SALVADOR (22,84 a 50,04): Enq. maquete [18,0, 3,0, −2,6], 4,2 × 3,4, dir [0,35, 0,5, 1] · dist ≈ 9 · ângulo 27°. De 37,98 a 38,7, câmera recua para mostrar o arco até "PARIS" (enq. 22 × 8, alvo [26, 3, −4]) e volta. De 47,9 a 50, segue os ônibus saindo (arco de 0,2 rad).
- 3b ILHÉUS (50,04 a 58,52): Enq. maquete [17,6, 3,0, 1,4], 4,0 × 3,2, dir [−0,3, 0,45, 1] · dist ≈ 8,5 · ângulo 25°.
- 3c TSE E AS PREFEITURAS (58,52 a 80,90): 58,5 a 66: plano aberto que mostra Brasília e a Bahia juntas (os 3 nomes ditos em 2 s: um plano só). Enq. [11, 0, −1], 16 × 10, dir [0, 0,9, 0,7] · dist ≈ 26 · ângulo 52°. 66 a 80,9: as duas maquetes (Feira e Lauro) no mesmo plano. Enq. [14,7, 3,0, −5,1], 7,5 × 3,6, dir [0, 0,45, 1] · dist ≈ 13 · ângulo 24°. Em 70,4 e 77,9, desliza o alvo para a maquete citada (±2 m).
- Texto: chips RESPOSTA, selos S3 a S6, contador "R$ 1 MILHÃO POR HORA".
- Pílula: BAHIA
- Aha: em Salvador a Justiça mandou prender o secretário; nas outras cidades, por enquanto, só houve denúncias.

### CENA 4: SÃO PAULO (80,90 a 99,70 s)
Abre em `quando('Em São Paulo')` · Sai em `quando('No Rio de Janeiro')` · Eventos 79 a 94
- 4a (80,90 a 86,5): viagem pelo mapa de [14, 1, −3] até a maquete SP [5,6, 3,0, 11,2] · dist de 16 para 10 · ângulo 30°, olhando ao longo do mapa (Bahia ao fundo).
- 4b (86,5 a 99,70): Enq. [5,6, 3,0, 11,2], 5 × 3,8, dir [0,25, 0,5, 1] · dist ≈ 10 · ângulo 27°. Os 4 bonecos (secretário, presidente da SPTrans, Boulos, Nunes) ficam numa fila na borda da frente da maquete, todos no mesmo plano.
- Pílula: SÃO PAULO
- Aha: só 7 em cada 10 ônibus rodavam; o pedido de prisão foi feito, mas não há decisão.

### CENA 5: RIO DE JANEIRO (99,70 a 104,46 s)
Abre em `quando('No Rio de Janeiro')` · Sai em `quando('No Piauí')` · Eventos 95 a 99
- 5a: Enq. maquete RJ [13,2, 3,0, 9,6], 4 × 3, dir [−0,2, 0,5, 1] · dist ≈ 8 · ângulo 27°. Arco curto de 0,12 rad.
- Pílula: RIO DE JANEIRO
- Aha: o TRE do Rio cobrou mais ônibus em duas cidades.

### CENA 6: NORDESTE (104,46 a 139,82 s)
Abre em `quando('No Piauí')` · Sai em `quando('No Pará')` · Eventos 100 a 126
- 6a PIAUÍ (104,46 a 110,04): viagem do RJ ao Piauí olhando ao longo do mapa (sul → norte). Chega em enq. maquete Teresina [11,2, 3,0, −12,6], 4 × 3, dir [0,2, 0,5, 1] · dist ≈ 8 · ângulo 27°.
- 6b ALAGOAS (110,04 a 118,62): enq. maquete Maceió [21,0, 3,0, −6,4], 4 × 3, dir [−0,4, 0,5, 1] · dist ≈ 8.
- 6c SERGIPE (118,62 a 131,58): enq. maquete Aracaju [20,2, 3,0, −2,4], 4,6 × 3,2, dir [−0,3, 0,45, 1] · dist ≈ 9 · ângulo 25°. Em 128,6 a 131, recua um pouco para caber a fila de 20 ônibus.
- 6d PARAÍBA (131,58 a 139,82): enq. maquete JP [21,6, 3,0, −9,6], 4 × 3, dir [−0,2, 0,5, 1] · dist ≈ 8.
- Entre uma maquete e outra: a câmera sobe para ~16 m de distância, mostra o pino do próximo estado e desce (regra de "segurar e subir antes de trocar").
- Pílula: muda por estado: PIAUÍ, ALAGOAS, SERGIPE, PARAÍBA
- Aha: cada TRE decidiu de um jeito: um mandou recompor, outro negou, outro deu prazo.

### CENA 7: PARÁ (139,82 a 149,42 s)
Abre em `quando('No Pará')` · Sai em `quando('Agora repara')` · Eventos 127 a 135
- 7a: viagem até o Norte, depois enq. maquete Belém [5,0, 3,0, −17,0], 5 × 3,4, dir [0,3, 0,45, 1] · dist ≈ 10 · ângulo 25°. Acompanha a balsa saindo (arco de 0,25 rad).
- Pílula: PARÁ
- Aha: no Pará, o problema foi o barco; 200 pessoas ficaram no porto.

### CENA 8: A CORRIDA CONTRA O RELÓGIO (149,42 a 185,24 s)
Abre em `quando('Agora repara')` · Sai em `quando('Mas muitas')` · Eventos 136 a 159
- 8a (149,42 a 157,04): sobe do Pará (dist 30, ângulo 55°) e desce em Brasília. Enq. maquete grande [6,1, 3,6, 0,8], 7 × 5, dir [0, 0,55, 1] · dist ≈ 15 · ângulo 29°. Os dois envelopes (Lula e Flávio) no mesmo plano.
- 8b (157,04 a 168,66): lado do TSE e do MP. Alvo [4,6, 3,8, 0,4], 4,5 × 3,6, dir [0,35, 0,45, 1] · dist ≈ 9,5.
- 8c (168,66 a 181,44): lado do STF. Alvo [7,6, 3,8, 0,4], 4,5 × 3,6, dir [−0,35, 0,45, 1] · dist ≈ 9,5. Fachin e Zanin no mesmo plano (nomes ditos com 3 s de distância, mas o envelope passa de um para o outro).
- 8d (181,44 a 185,24): grua para cima saindo da torre do relógio; dist de 9 para 40 (log), ângulo de 30° para 55°, para ver os arcos saindo para o país.
- Texto: relógio fixo trocando a hora; selos S14 a S16.
- Pílula: O RELÓGIO
- Aha: o MP disse não às 17h01, e Zanin mandou estender às 17h02, quando muitas urnas já tinham fechado.

### CENA 9: AS URNAS FECHADAS (185,24 a 223,32 s)
Abre em `quando('Mas muitas')` · Sai em `quando('Às 18h')` · Eventos 160 a 183
- 9a SEÇÃO EM SÃO PAULO (185,24 a 209,80): 185,2 a 187,8: mapa inteiro (dist 55) com as urnas cinza. 187,8 a 209,8: maquete SP vira a sala de seção (21 urnas). Enq. [5,6, 3,0, 11,2], 4,6 × 3,4, dir [0,2, 0,6, 1] · dist ≈ 9 · ângulo 31°. Celular gigante à esquerda da sala, em pé.
- 9b OS TRES (209,80 a 223,32): DF, MG e GO no mesmo plano. Enq. [7,4, 0,4, 2,8], 9 × 6, dir [0, 0,85, 0,8] · dist ≈ 18 · ângulo 47°. Em 220,7, painel de apuração sobe atrás de Brasília (fundo, sem tapar).
- Pílula: URNAS FECHADAS
- Aha: o aviso chegou tarde; onde a urna já tinha fechado, quem chegou depois não votou.

### CENA 10: O IMPASSE (223,32 a 244,70 s)
Abre em `quando('Às 18h')` · Sai em `quando('Ainda falta saber')` · Eventos 184 a 202
- 10a (223,32 a 232,86): maquete Brasília inteira, balança no centro. Enq. [6,1, 3,8, 0,8], 7 × 4,6, dir [0, 0,5, 1] · dist ≈ 15 · ângulo 27°. Cartão OPINIÃO na interface 2D, no alto.
- 10b (232,86 a 241,34): sobe para ver Brasília e o mapa em volta. Enq. [6, 1, 2], 20 × 14, dir [0, 0,8, 0,9] · dist ≈ 30 · ângulo 42°.
- 10c (241,34 a 244,70): volta ao prédio do TSE. Enq. [4,6, 3,8, 0,4], 3,6 × 3,0, dir [0,3, 0,4, 1] · dist ≈ 8.
- Pílula: O IMPASSE
- Aha: às 18h12 a regra ficou assim: urna aberta segue até 19h, urna fechada não reabre.

### CENA 11: O QUE FALTA SABER (244,70 a 258,66 s)
Abre em `quando('Ainda falta saber')` · Eventos 203 a 212
- 11a (244,70 a 249,68): mapa inteiro com todos os pinos. Enq. [1, 0, −1], 42 × 42, dir [0,1, 1, 0,55] · dist ≈ 64.
- 11b (249,68 a 258,66): mergulho log até o ponto de Salvador (a eleitora do começo). Alvo [17,2, 3,1, −1,6], 2,2 × 2,2, dir [0,5, 0,35, 1] · dist ≈ 4,5 · ângulo 18°. O ônibus verde para no ponto.
- Pílula: O QUE FALTA
- Aha: ainda não se sabe quem será punido; e a pergunta é a sua.

## 2.5 Fatos e fontes

Tudo em `audio/fontes.md` (checado em 25/10/2026, última conferência às 18h35). Na tela, cada fato aparece arredondado igual à fala:

| Na tela | Fonte |
|---|---|
| 8 ESTADOS | Ministério da Justiça, via Mais Goiás e Tribuna Online |
| RESPEITEM A VONTADE DAS URNAS (OEA) | Bloomberg Línea (17h55); CNN Brasil |
| R$ 1 MILHÃO POR HORA (BA e PI) | Agência Brasil; Exame; Cidade Verde |
| ORDEM DE PRISÃO · PABLO SOUZA | TRE-BA via Agência Brasil, Metrópoles |
| PARIS · VOLTA NA SEGUNDA (26) | PF e prefeitura, via Metrópoles |
| 71,7% RODANDO · 13H20 | Infobus, via Metrópoles |
| PEDIDO DE PRISÃO (SECRETÁRIO E PRESIDENTE DA SPTRANS) | Jornal de Brasília; Conjur |
| NEGADO · SEM TEMPO · SEM PROVAS (AL) | Gazetaweb; Repórter Nordeste |
| CERCA DE 2 H DE ESPERA · +20 ÔNIBUS (SE) | Fan F1 (relato); Poder360 |
| +200 PESSOAS NO PORTO (PA) | Diário do Pará |
| 17 CIDADES COM CHUVA | Metrópoles; O Tempo |
| 17:01 MP CONTRA | Mais Goiás; Bloomberg Línea |
| 16:40 · 17:02 · ATÉ 19H | O Globo (Míriam Leitão); Poder360 (íntegra) |
| 17:14 · 17:38 · 7 DE 21 | Folhapress, via Notícias ao Minuto |
| TRE-DF E TRE-MG · NOVA VENEZA | NDmais; Itatiaia; Portal Veneza |
| 18:12 · ABERTAS SEGUEM, FECHADAS NÃO REABREM | Bloomberg Línea; Agência Brasil |

**Conferir antes de publicar:** se a contagem voltou e o resultado do 2º turno; se o mandado contra Pablo Souza foi cumprido; decisão do TRE-SP sobre os pedidos de prisão; o que Fachin decidiu; resposta de Kassio e de Fachin à crítica da colunista; segunda fonte para Nova Veneza e para o vínculo da empresa de Ilhéus com a família do prefeito. Se algo mudar, a legenda do post traz a atualização (a narração já está gravada).

## 2.6 Trilha e sons

Sem trilha (a pessoa não mandou uma). Efeitos do Estúdio, volume 0,25 a 0,4:

| Efeito | Onde |
|---|---|
| `whoosh` | cada viagem de câmera entre estados (22,8 · 80,9 · 99,7 · 104,5 · 110,0 · 118,6 · 131,6 · 139,8 · 149,4 · 185,2 · 223,3 · 244,7) |
| `tique` | cada troca de pílula e cada bolinha do placar que acende |
| `pop` | maquete que sobe, boneco com placa, envelope que chega, contador |
| `impacto` | carimbos: ORDEM DE PRISÃO (1,7 e 33,6), NEGADO (113,6), CONTRA (165,6) |
| `baque` | "já tinham fechado" (186,4), "não reabrem" (240,4) |
| `bip` | relógio fixo troca de hora (163,3 · 176,3 · 179,8 · 188,9 · 193,8 · 223,5 · 233,1) |
| `subida` | "R$ 1 milhão" (31,2 e 108,5), pilha de moedas |
| `ding` | frota volta ao normal (47,9); "seguem até as 19h" (237,7) |

## 2.7 Arquivos

**Novos**
- `src/videos/onibuseleicao/OnibusEleicao.tsx`: tabela `T`, `ESTADOS` da pílula, câmeras por cena, `FAIXAS`, `REVISAO`, `CapaOnibusEleicao`.
- `src/videos/onibuseleicao/pecas.tsx`, com estas peças novas:
  - `MapaTabuleiro`: mapa do Brasil deitado (contorno do `Tabuleiro`, escala 1,0), mar em volta e discos de luz por estado (`acesos`).
  - `geoE(lon, lat, y)`: a conversão de coordenadas na escala deste vídeo.
  - `Maquete`: plataforma redonda com pedestal que sobe e desce (`sobe` 0..1), com o conteúdo como filhos.
  - `Garagem`: garagem aberta com N vagas, luz interna e letreiro opcional.
  - `PontoOnibus`: ponto com cobertura, banco e placa com o nome da cidade.
  - `Rua`: trecho de rua com faixa, para os ônibus andarem (função de posição ao longo dela).
  - `Rodoviaria`: plataforma com cobertura comprida.
  - `SalaSecao`: sala de seção eleitoral com grade de urnas que acendem ou ficam cinza.
  - `UrnaPino`: urna pequena em cima do pino da cidade (aberta = verde, fechada = cinza).
  - `TorreRelogio`: torre com mostrador de 4 faces e ponteiros (`hora` em horas decimais).
  - `Envelope` com voo em arco: usa `curva()` da base.
  - `PainelApuracao`: telão com barras que param (sem números de votos).
  - `Pessoa` (copiada do 004): boneco genérico com a placa do nome em cima.
- `src/videos/onibuseleicao/palavras.ts` (já pronto).

**Alterados**
- `src/Root.tsx`: `OnibusEleicao`, `OnibusEleicaoGuia`, `OnibusEleicaoLimpo`, `CapaOnibusEleicao`.

**Reaproveitados do catálogo**
- `Onibus` (escala6x1c), `Pino` (fumaca), `OrgaoPublico` (juros) para TRE-BA, TRE-SP, TRE-RJ, TRE-PI, TRE-AL, TRE-SE, TRE-PA, TSE, STF e MP ELEITORAL.
- `Urna` (gasolina), `DocumentoGrande` (bets) com carimbo, `Ampulheta` (intimacao), `RelogioMesa` (intimacao), `Lupa` (imposto).
- `BalancaJustica` (juros), `NuvemChuva` (fumaca), `Cais` e `NavioMini` (cruzeiro), `Jatinho` (candidato), `ArcoPontos` (multas), `PilhaMoedas` (juros), `Documento` (intimacao), `CelularGigante` (mansao).
- Da base: `Boneco`, `Placa`, `Palco`, `Particulas`, `Onda`, `curva`, `Trilha`, `Barras`, `Chip`, `Contador`, `Etiqueta`, `Pilula`, `Marca`, `Legenda`.

**Render:** 7.760 quadros → 10 partes de até 800 quadros (o `render.mjs` decide).

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- Mapa como tabuleiro para "onde fica" e variar o mundo em relação ao 003 e ao 004 (Visual por tema, Variar o mundo).
- Personagem-exemplo no ponto de ônibus (Trânsito e cidade).
- Pessoa real só como boneco genérico com placa; os dois lados com o mesmo tamanho e tempo; sem cor de partido (Política com nomes reais; Tema polêmico).
- Acusação com quem acusa, a fase e a resposta (Roteiro, 004).
- Um plano só quando dois nomes são ditos juntos: Salvador, Feira e Lauro; Fachin e Zanin; DF e MG (Câmera).
- Zoom rua → país em escala logarítmica; plano aberto com `alcance` maior para não cair na névoa (Câmera; Técnica, 003).
- Segurar a câmera e subir antes de trocar de cenário (Câmera).
- Sem desfoque de profundidade; borrado de troca de cena leve (Sempre fazer, 003).
- Uma animação por palavra-chave, com o máximo de eventos (Sempre fazer).
- Multidão (fila, bonecos no cais, 20 ônibus) só nasce na palavra dela (Visual por tema).
- Tudo que acende numa cena volta ao neutro quando ela acaba; maquetes descem (Visual por tema).
- Fio e arco que ligam lugares apagam de todo quando saem de cena (Visual por tema).
- Nome de lugar em chip 2D preso ao ponto, não em placa deitada no chão (002).

**Escolhas do diretor:**
- Maquetes pop-up em cima do mapa: deixam cada cidade grande o bastante para mostrar garagem e ônibus, sem perder o mapa.
- Verde só para "funcionando" (ônibus rodando, urna aberta) e cinza para "parado ou fechado": a pessoa entende sem ler.
- Placar de 8 estados e relógio fixo no topo (★).
- Urna gigante da OEA, balança de ônibus e passageiros em SP, 20 mini ônibus em Sergipe e painel de apuração parado (★).
- A eleitora do primeiro ponto volta no fim, para fechar a pergunta "Na sua cidade, o ônibus passou?".

## Ajustes feitos na programação (25/10/2026)
- Câmera dos closes de maquete mais perto (enquadramento 22% menor) para a garagem e os bonecos ficarem legíveis.
- Salvador: ponto de ônibus passou para a esquerda e o TRE-BA para a direita, para não tapar a garagem. Ônibus saem com 0,75 s de intervalo (antes se embolavam).
- Pino da cidade some enquanto a maquete dela está no ar (o pedestal ocupa o lugar).
- Discos dos estados mais fracos (ficavam como manchas claras nos closes).
- Nuvens de chuva (pedido do Flávio): saíram do mapa (tapavam a câmera em Brasília) e foram para cima do envelope "CAMPANHA DE FLÁVIO", em tamanho pequeno.
- Maquete de Brasília desce na cena das urnas fechadas (9a e 9b) e volta às 18h, para mostrar a sala da USP e os pinos do DF, de MG e de GO. DF e MG ganharam uma escola com a urna cinza.
- Faixa escura suave no topo, para ler a marca, a pílula e o relógio sobre o mapa claro.
- Relógio fixo da parte 2 começa em 17:01 (não há fonte para "16:00"); 16:40 aparece como "ANTES, NO STF".
- Correções de tempo: "os TREs" passou a ser a 2ª ocorrência (234,9 s) e "Em Lauro" passou a "Em Lauro, moradores" (70,4 s). Chips, selos e respostas agora só aparecem depois da palavra (antes, um item do futuro tomava o lugar).
- Pedido da pessoa depois do vídeo pronto (25/10/2026): divisão dos estados no vídeo inteiro. O mapa passou a usar o contorno oficial do IBGE (país e 27 estados, simplificado), com as divisas em linha fina, os 8 estados citados acendendo por inteiro (no lugar dos discos) e mais forte quando são o estado da vez, e as siglas dos estados nos planos abertos. Vídeo gerado de novo; a versão sem divisas ficou como `video final (versão 1).mp4`.
