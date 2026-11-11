# Plano de cenas: 019. resultado midterms eua (versão 1, para aprovação)

Código `midtermsresultado` · Nome `MidtermsResultado` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Continuação do 015** (mesma série): o mesmo Capitólio, o mesmo plenário de 435 cadeiras, os mesmos tons dos partidos e o mesmo boneco TRUMP. Um trecho de mapa do Kit Mapas Animados (o mesmo mapa dos EUA do 015).

## 2.1 Narração

- `audio/narracao-norm.wav` · voz Adam (ElevenLabs v3) · 1,3x, volume -15, silêncio das pontas cortado · **96,61 s** · `AUDIO_SEG = 96.61` · `QUADROS = 2925`.
- 315 palavras (igual ao roteiro); a última ("informações.") termina em 96,32 s. Nenhum ajuste no texto. O Whisper ouviu "arroba EuMagnolate": é só a escrita dele, a legenda usa o roteiro. **Ouvir o fim para conferir a pronúncia.**

**Palavras repetidas:**

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| Trump | 1,20 · 8,44 · 50,04 · 71,56 · 76,74 · 87,76 | `'partido do Trump perdeu'` · `'o partido do Trump, mandavam'` · `'O Trump disse'` · `'pelo Trump'` · `'Mas o Trump'` · `'o Trump nao governa'` |
| Câmara | 16,12 · 25,70 · 64,96 · 74,18 | `'a Camara inteira'` · `'viraram a Camara'` · `'da Camara e do Senado'` · `'A Camara pode'` |
| Senado | 10,42 · 20,42 · 28,58 · 65,54 · 72,86 | `'No Senado, eram'` · `'cadeiras do Senado'` · `'tambem o Senado'` · `'e do Senado'` · `'sim do Senado'` |
| Congresso | 2,44 · 57,06 · 81,44 · 89,60 | `'controle do Congresso'` · `'novo Congresso'` · `'leis do Congresso'` · `'E o Congresso'` |
| 47 | 12,08 · 44,08 | `'contra 47'` · `'de 47'` |
| 2 | 47,54 · 83,66 | `'faltam 2'` · `'2 tercos'` |
| veto | 78,18 · 82,64 | `'o veto'` · `'derrubar um veto'` |
| Um / Dois / Três | 61,50 · 67,88 · 73,44 | **com a palavra seguinte** (regra do 018): `'Um Nenhuma'` · `'Dois Ministros'` · `'Tres A Camara'` ("um senador" e "três coisas" vêm antes) |

## 2.2 Ideia e mundo

**A metáfora: a "noite da apuração" na frente do Capitólio.** É o mesmo lado EUA da mesa do 015, agora à noite. No fundo fica o **Capitólio** do 015. Na frente dele, as duas casas em maquete: o **plenário da Câmara** (435 cadeiras, à esquerda) e o **plenário do Senado** (100 cadeiras, à direita). No primeiro plano corre uma **linha do tempo no chão**, com 7 marcos: ANTES · TERÇA · NOITE · MADRUGADA · REAÇÕES · 3 JAN 2027 · ATÉ 2029. Cada marco acende quando a fala chega nele, e a câmera anda da esquerda para a direita ao longo da linha. Isso deixa a ordem dos fatos visível o vídeo inteiro. As cadeiras **trocam de cor** à medida que os resultados saem: é ali que a pessoa vê o Congresso virar.

**Trecho de mapa (Kit Mapas, mapa dos EUA do 015):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA: AS 7 VIRADAS** | `De madrugada` (31,12) até `Faz a conta` (42,34) | 11,2 s | Os EUA vistos de cima. Em "7 cadeiras" os 7 estados acendem um a um no tom dos democratas, com o nome digitado (CAROLINA DO NORTE, CAROLINA DO SUL, TEXAS, OHIO, KANSAS, IOWA, MAINE) e o contador 1 a 7. Em "Texas" a câmera chega no Texas: MAIS DE 30 ANOS. Em "Kansas" voa para o Kansas: MAIS DE 90 ANOS |

- Sai sem legenda, sem marca e sem som, em 1080 × 1920; entra com 0,2 s de entrada e saída, num OffthreadVideo só (regras do 013 e do 015). Selos por cima do mapa vão no topo (y 470).
- Dados: os `estados-eua.json` já baixados no 015 (domínio público).

**Partidos (iguais ao 015):** REPUBLICANOS em `festa.dourado` e DEMOCRATAS em `festa.azul`, sempre com o nome escrito, sem símbolo, sem logo e sem as cores oficiais. TRUMP é o boneco genérico sem rosto do 015, em `tema.objeto`, com etiqueta. Os democratas: um boneco genérico com a etiqueta DEMOCRATAS, mesmo tamanho e mesmo tempo de tela.

**Selos de fonte** (no topo, y 470, pequenos):

| Selo | Entra em | Texto |
|---|---|---|
| Antes | `53` | SENADO ANTES: 53 × 47 (47 INCLUI 2 INDEPENDENTES) |
| Projeção | `grandes redes` | PROJEÇÃO DAS REDES (CBS, NBC, ABC, CNN), NÃO É O RESULTADO OFICIAL |
| Viradas | no MAPA | SEGUNDO A CBS, 04/11/2026 |
| Conta | `pelo menos 54` | CONTA DO VÍDEO: 47 + 7 = 54 |
| Faltam | `faltam 2` | ALASCA E MISSISSIPPI SEM PROJEÇÃO (4H DE 04/11, HORA DE WASHINGTON) |
| Trump | `O Trump disse` | TRUMP À CBS, 04/11/2026 |
| Posse | `3 de janeiro` | CONSTITUIÇÃO DOS EUA, 20ª EMENDA |
| Veto | `2 tercos` | CONSTITUIÇÃO DOS EUA, ART. I, SEÇÃO 7 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo, chão, mesa | `tema.fundo`, `tema.chao`; céu de noite com a `Lua` pequena |
| Linha do tempo | marcos em `tema.objeto`; o marco da vez em `tema.acento` e volta ao neutro depois |
| Cadeiras | `tema.objetoEscuro` (neutras) → `festa.dourado` (republicanas) ou `festa.azul` (democratas); "em jogo" acendem em `tema.objetoClaro` |
| Bonecos | TRUMP e DEMOCRATAS em `tema.objeto` (regra do 011) |
| Papéis (lei, orçamento) | `tema.objetoClaro` |
| Carimbo VETO | `tema.objetoEscuro` com texto claro (sem vermelho, sem acento) |

**Mapa do mundo 3D** (chão em y = 0; frente em z+):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Capitólio (`Capitolio`, do 015) | [0, 0, −10] | fundo do vídeo todo; ganha luz azul por dentro no gancho |
| Plenário da Câmara (`PlenarioEua`, do 015, 435 cadeiras) | [−5, 0, −3] | cor por cadeira via `cor(ordem)` |
| Plenário do Senado (peça nova `PlenarioSenado`, 100 cadeiras em meia-lua, 4 fileiras) | [5, 0, −3] | linha de maioria (51) e de 2/3 (67) desenhadas no chão |
| Linha do tempo (peça nova `MarcoTempo` × 7: bloco baixo com texto, como os blocos do 015) | x de −9 a 9, z = 5 | nascem em `na ordem`; o da vez acende |
| Lua (`Lua`) | [−8, 9, −14] | gancho até o mapa; some ao amanhecer ★ |
| Placar do Senado (`PlacarCasa`, do 015) | [5, 0, 1] | 53 × 47, depois 47 → 54 |
| Urna de papel (`UrnaPapel`, do 015) | [−2, 0, 3] | marco TERÇA |
| Câmera de TV (`CameraTV`) | [−1, 0, 2] | marco NOITE: "as grandes redes" ★ |
| Relógio (`RelogioMesa`) | [1, 0, 3] | "Uma hora depois": ponteiro anda 1 h ★ |
| Bonecos TRUMP e DEMOCRATAS (`Boneco` + etiqueta) | [−2, 0, 2] e [2, 0, 2] | marco REAÇÕES; voltam na balança |
| Cartazes das falas (`Cartaz` × 2, mesmo tamanho) | sobre cada boneco | texto curto com crédito |
| Calendário (`CalendarioGrande`) 3 JAN 2027 | [4, 0, 3] | marco 3 JAN 2027 |
| Projeto de lei (`DocumentoGrande`) | sai da Câmara, vai ao Senado | "nenhuma lei passa" |
| Pilha de dinheiro (`PilhaMoedas`) + etiqueta ORÇAMENTO | junto do documento | "orçamento do governo" |
| 3 bonecos MINISTRO · EMBAIXADOR · JUIZ (`Boneco` + etiqueta) | fila até o Senado | "Dois" |
| Lupa (`Lupa`) + pasta GOVERNO (`PastaIntimacao`) | na frente da Câmara | "Três" |
| Carimbo VETO (`Carimbo3DIntimacao` + face com texto) | sobre o documento | "o veto" |
| Balança (`Balanca`) | [0, 0, 2] | no fim: TRUMP num prato, CONGRESSO no outro, no meio |
| Balão de comentário (`IconeBalao`) | [0, 3, 2] | chamada |

**Regras visuais:** sem rosto, sem logo, sem bandeira no 3D; os partidos só com o nome escrito; o verde só no marco da vez e no que muda; os dois lados com o mesmo tamanho e tempo nas reações; "projeção" escrita sempre que aparece um resultado.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Em uma noite` | 0,00 | Céu, Lua | Abre de cima, à noite: o Capitólio ao fundo, a Lua acende devagar | 1 |
| 2 | `partido do Trump perdeu` | 0,78 | Boneco TRUMP | Boneco nasce na frente do Capitólio, etiqueta TRUMP | 1 |
| 3 | `perdeu` | 1,44 | Plenários | As cadeiras douradas das duas casas apagam em onda (baque leve) | 1 |
| 4 | `controle do Congresso` | 2,00 | Capitólio | Ganha luz azul por dentro; chip CONGRESSO DOS EUA | 1 |
| 5 | `Eu te conto` | 3,28 | Câmera | Recua e mostra a linha do tempo no chão | 1 |
| 6 | `na ordem` | 4,22 | Linha do tempo | 7 marcos nascem da esquerda para a direita (tique em cada) ★ | 1 |
| 7 | `o que muda agora` | 4,98 | Marco 3 JAN 2027 | Pisca de leve (0,4 s) e volta: "isso vem depois" ★ | 1 |
| 8 | `Primeiro` | 5,84 | Marco ANTES | Acende; câmera vai ao começo da linha | 2 |
| 9 | `Os republicanos` | 7,00 | Etiqueta | REPUBLICANOS em dourado ao lado da Câmara | 2 |
| 10 | `o partido do Trump, mandavam` | 8,02 | Boneco | TRUMP anda até o meio das duas casas | 2 |
| 11 | `nas duas casas` | 9,28 | Plenários | Câmara e Senado acendem em dourado (subida); chips CÂMARA e SENADO | 2 |
| 12 | `No Senado, eram` | 10,28 | Câmera | Vai ao Senado | 2 |
| 13 | `53` | 11,06 | Senado | 53 cadeiras douradas; placar digita 53 (pop); selo "Antes" | 2 |
| 14 | `contra 47` | 12,08 | Senado | 47 cadeiras azuis; placar 47 (pop) | 2 |
| 15 | `democratas` | 12,70 | Etiqueta | DEMOCRATAS em azul do lado das cadeiras azuis | 2 |
| 16 | `Terca-feira` | 13,60 | Marco TERÇA | Acende; câmera anda para a direita na linha (whoosh) | 3 |
| 17 | `dia de votar` | 14,34 | Urna de papel | Urna nasce; cédulas caem dentro, uma a uma | 3 |
| 18 | `Os americanos` | 15,08 | Bonecos | Fila de 8 eleitores genéricos chega à urna ★ | 3 |
| 19 | `a Camara inteira` | 16,02 | Câmera | Vai à Câmara | 3 |
| 20 | `435` | 16,94 | Câmara | As 435 cadeiras ficam claras ("em jogo") em onda (subida); contador 435 | 3 |
| 21 | `35 das 100` | 18,94 | Senado | Só 35 das 100 cadeiras ficam claras; contador 35 / 100 | 3 |
| 22 | `cadeiras do Senado` | 19,96 | Chip | 35 DE 100 EM JOGO | 3 |
| 23 | `Ainda na noite` | 20,94 | Marco NOITE | Acende; Lua sobe um pouco; câmera anda (whoosh) | 4 |
| 24 | `a primeira noticia` | 22,16 | Câmera de TV | Nasce virada para o Capitólio, luz vermelha suave acesa ★ | 4 |
| 25 | `grandes redes` | 23,38 | Selo | "Projeção" no topo | 4 |
| 26 | `projetaram` | 23,94 | Chip | PROJEÇÃO 1 · CÂMARA | 4 |
| 27 | `viraram a Camara` | 25,20 | Câmara | Cadeiras passam de claras a azul em onda, a maioria azul (subida); chip CÂMARA: DEMOCRATAS | 4 |
| 28 | `Uma hora depois` | 26,20 | Relógio | Nasce; o ponteiro anda uma hora (tique) ★ | 4 |
| 29 | `a segunda` | 27,06 | Chip | PROJEÇÃO 2 · SENADO | 4 |
| 30 | `tambem o Senado` | 28,12 | Senado | Cadeiras azuis crescem e passam da linha do meio (subida) | 4 |
| 31 | `51 votos` | 29,76 | Linha 51 | A linha de maioria acende no chão do Senado; contador 51 (pop) | 4 |
| 32 | `manda` | 30,64 | Chip | 51 = MAIORIA | 4 |
| 33 | `De madrugada` | 31,12 | **MAPA** | Entra o mapa dos EUA à noite (whoosh); pílula A MADRUGADA | M |
| 34 | `a lista cresceu` | 31,98 | Mapa | Contador de viradas aparece: 0 | M |
| 35 | `7 cadeiras` | 33,60 | Mapa | Carolina do Norte acende em azul, nome digitado; contador 1 | M |
| 36 | `dos republicanos` | 34,52 | Mapa | Carolina do Sul, Ohio e Iowa acendem em sequência (pop a cada); 2, 3, 4 | M |
| 37 | `onde quase nunca ganham` | 35,80 | Mapa | Kansas, Texas e Maine acendem; contador 7 | M |
| 38 | `O Texas` | 37,16 | Mapa | Câmera chega no Texas | M |
| 39 | `30 anos` | 39,58 | Mapa | Etiqueta TEXAS · MAIS DE 30 ANOS | M |
| 40 | `O Kansas` | 40,40 | Mapa | Câmera voa para o Kansas | M |
| 41 | `mais de 90` | 41,32 | Mapa | Etiqueta KANSAS · MAIS DE 90 ANOS | M |
| 42 | `Faz a conta` | 42,34 | Senado | Volta ao 3D, no Senado (whoosh); marco MADRUGADA aceso | 5 |
| 43 | `de 47` | 43,98 | Senado | As 47 azuis acendem; placar 47 | 5 |
| 44 | `pelo menos 54` | 44,96 | Senado | 7 cadeiras douradas viram azuis, uma a uma; placar 47 → 54 (subida); selo "Conta" | 5 |
| 45 | `senadores` | 45,98 | Chip | PELO MENOS 54 DE 100 | 5 |
| 46 | `faltam 2` | 47,20 | Senado | 2 cadeiras ficam cinza com "?"; rótulos ALASCA e MISSISSIPPI; selo "Faltam" | 5 |
| 47 | `Depois, as reacoes` | 48,54 | Marco REAÇÕES | Acende; câmera anda (whoosh) | 6 |
| 48 | `O Trump disse` | 49,86 | Boneco TRUMP | Entra à esquerda; cartaz sobe; selo "Trump" | 6 |
| 49 | `trabalhem com ele` | 51,56 | Cartaz | "ESPERO QUE TRABALHEM COMIGO" digita | 6 |
| 50 | `Senao, vai vetar` | 52,38 | Cartaz | 2ª linha "SENÃO, VETO TUDO" (baque) | 6 |
| 51 | `Os democratas prometeram` | 53,70 | Boneco DEMOCRATAS | Entra à direita, mesmo tamanho; cartaz sobe | 6 |
| 52 | `custo de vida` | 55,20 | Cartaz | "FOCO NO CUSTO DE VIDA" digita | 6 |
| 53 | `E agora` | 55,94 | Marco 3 JAN 2027 | Acende; os dois bonecos e cartazes saem; câmera anda (whoosh) | 7 |
| 54 | `novo Congresso` | 56,88 | Capitólio | A luz azul de dentro fica mais forte | 7 |
| 55 | `toma posse` | 57,40 | Calendário | Nasce e vira a folha | 7 |
| 56 | `3 de janeiro` | 58,06 | Calendário | 3 JAN 2027 (pop); selo "Posse" | 7 |
| 57 | `mudam tres coisas` | 60,40 | Placas | 3 plaquinhas 1 · 2 · 3 saltam no chão (tique em cada) | 7 |
| 58 | `Um Nenhuma` | 61,50 | Placa 1 | Acende; chip LEIS | 8 |
| 59 | `lei passa` | 62,32 | Documento | PROJETO DE LEI nasce na Câmara | 8 |
| 60 | `sem os democratas` | 63,00 | Plenários | As cadeiras azuis das duas casas pulsam juntas | 8 |
| 61 | `da Camara e do Senado` | 64,96 | Documento | Viaja da Câmara para o Senado num arco (whoosh) | 8 |
| 62 | `inclui o orcamento` | 66,36 | Moedas | Pilha de moedas e etiqueta ORÇAMENTO entram junto do documento (pop) | 8 |
| 63 | `Dois Ministros` | 67,88 | Placa 2 | Acende; chip INDICAÇÕES | 9 |
| 64 | `Ministros` | 68,52 | Boneco | MINISTRO entra na fila do Senado | 9 |
| 65 | `embaixadores` | 69,08 | Boneco | EMBAIXADOR | 9 |
| 66 | `juizes da Suprema Corte` | 69,84 | Boneco | JUIZ DA SUPREMA CORTE (pop) | 9 |
| 67 | `pelo Trump` | 71,38 | Boneco TRUMP | Aparece atrás da fila, apontando ★ | 9 |
| 68 | `sim do Senado` | 72,54 | Senado | Placa SIM? no Senado, com os três esperando (tique) | 9 |
| 69 | `Tres A Camara` | 73,44 | Placa 3 | Acende; chip INVESTIGAÇÕES | 10 |
| 70 | `investigacoes` | 74,94 | Lupa | Lupa nasce sobre a pasta GOVERNO na frente da Câmara, passando devagar | 10 |
| 71 | `Mas o Trump` | 76,44 | Marco ATÉ 2029 | Acende; câmera anda até o fim da linha (whoosh) | 11 |
| 72 | `uma arma` | 77,40 | Boneco TRUMP | Ergue o carimbo | 11 |
| 73 | `o veto` | 78,00 | Carimbo | Face VETO aparece (impacto); chip O VETO | 11 |
| 74 | `ate 2029` | 79,10 | Chip | MANDATO ATÉ 2029 | 11 |
| 75 | `barrar as leis` | 80,68 | Documento | O PROJETO DE LEI volta; o carimbo bate: VETADO (baque) | 11 |
| 76 | `derrubar um veto` | 82,20 | Câmera | Plano das duas casas | 11 |
| 77 | `2 tercos` | 83,66 | Linhas 2/3 | Linha 2/3 acende nas duas: 290 DE 435 e 67 DE 100; selo "Veto" | 11 |
| 78 | `das duas casas` | 84,32 | Plenários | As azuis sobem até a linha... | 11 |
| 79 | `nao chegaram nisso` | 86,04 | Senado | ...e param antes: 54 < 67 (baque) | 11 |
| 80 | `Ou seja` | 87,02 | Balança | Nasce no meio da linha do tempo | 12 |
| 81 | `o Trump nao governa` | 87,68 | Prato esquerdo | TRUMP no prato; a balança pende para ele... | 12 |
| 82 | `sozinho` | 88,92 | Prato direito | ...e o CONGRESSO (Capitólio pequeno) cai no outro prato | 12 |
| 83 | `E o Congresso tambem nao` | 89,32 | Balança | Volta ao meio e fica parada no equilíbrio (ding) | 12 |
| 84 | `Voce acha` | 90,62 | Câmera | Grua sobe: a linha do tempo inteira, os 7 marcos acesos | 13 |
| 85 | `para o Brasil` | 92,04 | Chip | E NO BRASIL? | 13 |
| 86 | `comentarios` | 93,14 | Balão | Balão de comentário verde (pop) | 13 |
| 87 | `E segue` | 93,76 | Câmera | Sobe devagar; @eumagnoleite no cartão final | 13 |

87 eventos em 96 s (perto de 1 por segundo). Na programação cada cena ganha mais (cédulas uma a uma, cadeiras em onda, eleitores andando).

## 2.4 Cenas com câmera

Distâncias são referência: no código, enquadramento automático (alvo + tamanho + direção). Câmera sempre em movimento.

### CENA 1: EM UMA NOITE (0,00 a 5,80 s)
Abre em `Em uma noite` · Eventos 1 a 7
- 1a (0,00 a 3,20): de cima, pos [0, 14, 8] → [0, 9, 10] · alvo [0, 1, −5] · dist 18 → 14 · 50° → 40°. Capitólio, as duas casas e o TRUMP.
- 1b (3,28 a 5,80): grua recua e mostra a linha do tempo, alvo [0, 0, 2] · dist 20 · 42°.
- Pílula: O RESULTADO · Aha: "o Congresso mudou de mãos numa noite".

### CENA 2: ANTES (5,84 a 13,50 s)
Abre em `Primeiro` · Eventos 8 a 15
- 2a (5,84 a 10,20): plano das duas casas desde o marco ANTES, alvo [0, 0,5, −3] · dist 15 · 38°, deslizando para a esquerda.
- 2b (10,28 a 13,50): Senado com o placar, alvo [5, 0,5, −2] · dist 9 · 40°, arco lento.
- Pílula: ANTES · Aha: "os republicanos mandavam nas duas casas".

### CENA 3: TERÇA (13,60 a 20,90 s)
Abre em `Terca-feira` · Eventos 16 a 22
- 3a (13,60 a 16,00): urna e fila, alvo [−2, 1, 3] · dist 8 · 32°.
- 3b (16,02 a 18,90): Câmara de cima, alvo [−5, 0, −3] · dist 11 · 48°, arco.
- 3c (18,94 a 20,90): Senado de cima, alvo [5, 0, −3] · dist 10 · 48°.
- Pílula: TERÇA, A VOTAÇÃO.

### CENA 4: A NOITE (20,94 a 31,00 s)
Abre em `Ainda na noite` · Eventos 23 a 32
- 4a (20,94 a 26,10): da câmera de TV para a Câmara virando, alvo [−3, 0,5, −1] · dist 12 · 40°, avanço lento.
- 4b (26,20 a 31,00): relógio e Senado virando, alvo [4, 0,5, −2] · dist 11 · 42°.
- Pílula: A NOITE · Aha: "primeiro a Câmara, uma hora depois o Senado".

### MAPA: AS 7 VIRADAS (31,12 a 42,30 s), Kit Mapas
Eventos 33 a 41 · Pílula: A MADRUGADA.
- Câmera: EUA inteiros (31,1 a 37,1) → Texas (37,2 a 40,3) → Kansas (40,4 a 42,3), com zoom em escala logarítmica.

### CENA 5: A CONTA (42,34 a 48,50 s)
Abre em `Faz a conta` · Eventos 42 a 46
- Senado com o placar, alvo [5, 0,5, −2] · dist 9 → 8 · 44°, avanço lento. Pílula: A CONTA · Aha: "47 + 7 = pelo menos 54".

### CENA 6: AS REAÇÕES (48,54 a 55,90 s)
Abre em `Depois, as reacoes` · Eventos 47 a 52
- Dois bonecos lado a lado, mesmo enquadramento para os dois, alvo [0, 1,5, 2] · dist 8 · 22°, deslizando de leve da esquerda para a direita. Pílula: AS REAÇÕES.

### CENA 7: A POSSE (55,94 a 61,40 s)
Abre em `E agora` · Eventos 53 a 57
- Calendário com o Capitólio atrás, alvo [3, 1,5, 0] · dist 12 · 30°, grua leve. Pílula: E AGORA?

### CENAS 8 a 10: O QUE MUDA (61,50 a 76,40 s)
Eventos 58 a 70 · Pílula: O QUE MUDA (com 1/3, 2/3, 3/3 no chip)
- 8 (61,50 a 67,80): plano das duas casas, o documento cruzando, alvo [0, 0,5, −3] · dist 15 · 40°.
- 9 (67,88 a 73,40): fila no Senado, alvo [4, 1, −1] · dist 9 · 30°.
- 10 (73,44 a 76,40): lupa na frente da Câmara, alvo [−4, 0,8, 0] · dist 7 · 38°.

### CENA 11: O VETO (76,44 a 86,95 s)
Abre em `Mas o Trump` · Eventos 71 a 79
- 11a (76,44 a 82,10): TRUMP e o carimbo no marco ATÉ 2029, alvo [6, 1,2, 3] · dist 7 · 26°.
- 11b (82,20 a 86,95): as duas casas com as linhas 2/3, alvo [0, 0,3, −3] · dist 16 · 52° (de cima, para ver as linhas). Pílula: O LIMITE · Aha: "o veto continua, e os democratas não têm 2/3".

### CENA 12: O EQUILÍBRIO (87,02 a 90,50 s)
Abre em `Ou seja` · Eventos 80 a 83
- Balança na frente do Capitólio, alvo [0, 1,5, 2] · dist 8 · 18°, avanço lento. Pílula: O EQUILÍBRIO.

### CENA 13: E VOCÊ? (90,62 a 97,51 s)
Abre em `Voce acha` · Eventos 84 a 87
- Grua sobe do chão até a vista de cima da linha inteira, alvo [0, 0, 0] · dist 20 → 26 · 30° → 55°. Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 04/11/2026):
- **Antes da eleição:** Senado 53 × 47 (NBC, ABC). O 47 inclui 2 independentes que votam com os democratas.
- **O que se votou:** 435 cadeiras da Câmara e 35 de 100 no Senado (NBC, Al Jazeera).
- **Projeções:** Câmara às 22h39 e Senado às 23h44, hora de Washington (CBS).
- **As 7 viradas:** lista da CBS. O Maine também saiu na NBC e no Washington Post.
- **Texas e Kansas:** "primeiros senadores democratas em décadas" (CBS). Os anos (1988 e 1932) vêm da história eleitoral.
- **54:** conta própria (47 + 7); o MS NOW mostra 54 × 44 com 2 em aberto.
- **Alasca e Mississippi:** sem projeção às 4h22, hora de Washington (CBS).
- **Reações:** Trump à CBS; democratas e o custo de vida (NBC, CNBC).
- **Constituição dos EUA:** posse em 3 de janeiro (20ª Emenda); veto e 2/3 (art. I, seção 7); indicações (art. II, seção 2).

**Na tela:**
- "PROJEÇÃO" em todo resultado.
- O número da Câmara não aparece: as redes ainda divergem. As cadeiras azuis passam da metade, mas sem contador.
- As linhas de 2/3 (290 e 67) são conta própria: 2/3 de 435 = 290; 2/3 de 100 = 66,7, ou seja, 67.

**Conferir antes de publicar:**
- Alasca e Mississippi: se algum virar, o 54 muda na fala e na tela.
- Os anos do Texas e do Kansas, numa segunda fonte.
- Se algum resultado das 7 viradas mudou na contagem.

## 2.6 Trilha e sons

Sem trilha.
- `whoosh`: entrada e saída do mapa, e cada vez que a câmera anda para o próximo marco (bem baixo).
- `tique`: pílula, marcos nascendo, ponteiro do relógio, plaquinhas 1 · 2 · 3.
- `pop`: números, cédulas, nomes, bonecos.
- `subida`: as cadeiras virando em onda e o 47 → 54.
- `baque`: "perdeu", "SENÃO, VETO TUDO", VETADO e "não chegaram".
- `impacto`: o carimbo VETO.
- `ding`: a balança no equilíbrio.
- Mapa sem som próprio.

## 2.7 Arquivos

**Kit Mapas (`~/Kit-Mapas-Animados`):**
- `src/videos/midterms-resultado/` (roteiro.ts, index.tsx, dados/index.ts com os `estados-eua.json` do `eleicao-eua`).
- Um vídeo só, `MidtermsResultado`, de cerca de 11,2 s (336 quadros), em 1080 × 1920, sem legenda, sem marca e sem som. Os tempos vêm do `palavras.ts` do 3D.
- Tiles reaproveitados do `eleicao-eua`.
- Saída: `projetos/019. resultado midterms eua/mapas/viradas.mp4`.

**Estúdio 3D:**
- `src/videos/midtermsresultado/MidtermsResultado.tsx` e `pecas.tsx`. Peças novas:
  - `PlenarioSenado`: 100 cadeiras em meia-lua, cor por cadeira, com as linhas de 51 e de 67 no chão.
  - `MarcoTempo`: bloco baixo da linha do tempo, com texto e brilho.
  - `CarimboVeto`: carimbo de mão com a face VETO.
- **Reaproveitados do 015** (importados de `../eleicaoeua/pecas`): `Capitolio`, `PlenarioEua`, `PlacarCasa`, `UrnaPapel`, `PlaquinhaRegra`.
- **Reaproveitados do catálogo:** `Lua`, `CameraTV`, `RelogioMesa`, `CalendarioGrande`, `DocumentoGrande`, `PilhaMoedas`, `Lupa`, `PastaIntimacao`, `Cartaz`, `Balanca`, `IconeBalao`. Da base: `Boneco`.
- `src/Root.tsx`: `MidtermsResultado`, `MidtermsResultadoGuia`, `MidtermsResultadoLimpo` e `CapaMidtermsResultado`.
- 2.925 quadros, em 4 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- Mesmo assunto em série, mesmo mundo: Capitólio, plenário, cores dos partidos e boneco TRUMP do 015.
- Resultado de notícia em ordem cronológica: a linha do tempo com os 7 marcos.
- Prédio de outro país com o desenho de lá: o Capitólio, não o `Congresso` do catálogo.
- Kit Mapas num OffthreadVideo só, com selos no topo.
- Política com nomes reais: boneco sem rosto, citação em cartaz com crédito, o outro lado com o mesmo tamanho e tempo; boneco de político em `tema.objeto`.
- Tema polêmico sem tomar lado: a balança fica no meio no fim.
- Número sem confirmação fica fora: o placar da Câmara.
- Lista contada chamada pela palavra seguinte (`'Um Nenhuma'`, `'Dois Ministros'`, `'Tres A Camara'`).
- Uma animação por palavra, câmera nunca parada, zoom do mapa em escala logarítmica.

**Pedidos da pessoa:** roteiro didático e na ordem dos fatos; continuar a série do 015; fecho "para ter mais informações" só neste vídeo.

**Escolhas de direção (★):**
- Os 7 marcos nascendo em "na ordem".
- O marco 3 JAN 2027 piscando de leve em "o que muda agora".
- A fila de eleitores na urna.
- A câmera de TV no "as grandes redes".
- O relógio andando uma hora no "Uma hora depois".
- O TRUMP apontando para a fila das indicações.
- A Lua que acompanha a noite até a madrugada.

## Ajustes feitos na programação (04/11/2026)

- Marcos da linha do tempo: reaproveitada a plaquinha de chão do 011 (`PlacaChao`), que já acende no acento e volta ao neutro. Não foi preciso a peça nova `MarcoTempo`.
- Peças novas: `PlenarioSenado` (100 cadeiras, com as linhas de 51 e de 2/3), `LinhaPlenario` (também usada para a linha de 2/3 da Câmara), `CarimboVeto` e `MarcaVetado`.
- O Capitólio afunda nos planos fechados e volta nos abertos (gancho, posse, as linhas de 2/3 e o fim), porque invadia a marca e a pílula do topo.
- A Lua foi para a direita do céu (em cima da marca, à esquerda, ela tapava o texto).
- Câmeras do Senado e da fila das indicações mais altas na tela, para o cartão de número e os rótulos não taparem as cadeiras.
- O placar do Senado foi para a esquerda do plenário, longe da legenda das cores.
- Reações: câmera mais perto e mais alta; cartazes maiores e acima das cabeças.
- Balança, projeto de lei, moedas, lupa e plaquinhas 1 · 2 · 3 maiores.
- O carimbo VETO fica na mão do TRUMP (braço para a frente) e desce sobre o projeto em "barrar as leis".
- Mapa (Kit Mapas): Maine fora da coluna de botões (o enquadramento corta a ponta oeste dos EUA, onde não houve virada); o nome por extenso de cada estado sai antes do próximo entrar; "1 CADEIRA VIRADA" no singular.
