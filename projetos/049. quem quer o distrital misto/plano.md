# Plano de cenas: 049. quem quer o distrital misto (versão 1, aprovada em 07/11/2026; correções da versão 3 no fim)

Código `quemdistrital` · Nome `QuemDistrital` · Perfil @eumagnoleite (acento verde, `tema.acento`).
**Vídeo de opinião** (contra o distrital misto), feito com os dois kits: o Estúdio 3D monta o vídeo inteiro e encaixa **dois trechos de mapa** do Kit Mapas Animados (satélite da Bahia), reaproveitando os dados de distritos ilustrativos do 013.

## 2.1 Narração

- `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4, texto inteiro de uma vez) · pausas de no máximo 0,35 s, **1,23x** (1,2x dava 2:58), volume -15 · **173,63 s** · `AUDIO_SEG = 173.63` · `QUADROS = 5236`.
- 542 palavras; a última ("informações.") termina em 173,22 s. Ajuste: "arroba eu magno leite" → `@eumagnoleite`. Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo):

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| três / oito | 6,98 (três passos) · 11,30 e 83,06 (oito motivos) | números dos motivos sempre com a palavra seguinte: `quando('Um. A')`, `quando('Dois. O')`, `quando('Três. Voto')`, `quando('Quatro. Voto')`, `quando('Cinco. Vereador')`, `quando('Seis. O')`, `quando('Sete. A')`, `quando('Oito. Tem')` |
| hoje | 8,26 · 13,60 · 153,40 | `quando('como é hoje')` · `quando('Primeiro, hoje')` · `quando('Hoje, cada')` |
| distrito(s) | 30,62 · 96,12 · 128,06 · 131,86 | `quando('sai dos distritos')` · `quando('dono do distrito')` · `quando('obra do distrito')` · `quando('Os distritos não')` |
| metade | 29,10 · 37,34 · 85,34 | `quando('Metade das vagas')` · `quando('outra metade')` · `quando('Metade das cadeiras')` |
| partido | 20,78 · 38,62 · 41,62 · 89,32 · 168,16 | `quando('partido dele')` · `quando('o partido monta')` · `quando('vota no partido')` · `quando('cúpula do partido')` · `quando('deixar o partido')` |
| Motta | 52,08 · 71,00 | `quando('Hugo Motta')` · `quando('com Motta')` |
| PSD | 58,66 · 63,72 | `quando('PSD, MDB')` · `quando('do PSD do')` |
| PL | 72,76 · 91,86 | `quando('enquanto? PL')` · `quando('presidente do PL')` |
| PSOL | 74,82 · 102,00 | `quando('e PSOL')` · `quando('líder do PSOL')` |
| PEC / Constituição | 46,68 · 160,30 / 47,84 · 158,56 | `quando('uma PEC')` · `quando('a PEC precisa')` / `quando('mudança na Constituição')` · `quando('mexer na Constituição')` |
| relator | 61,96 · 146,82 | `quando('O relator previsto')` · `quando('o relator marcou')` |
| este ano | 54,38 · 142,72 | `quando('votar ainda este')` · `quando('Querem votar este')` |
| 49 | 108,74 · 113,10 · 162,52 | `quando('fez 49')` · `quando('Os 49')` · `quando('e 49 senadores')` |
| votos / voto | várias | sempre com trecho longo |
| você | várias | `quando('jeito que você')` · `quando('Você vota no')` · `quando('que você não')` · `quando('Para você')` · `quando('Você quer')` |

## 2.2 Ideia e mundo

**A metáfora: a "estrada da PEC".** Uma maquete comprida: no começo, **você** (boneco em `tema.corpo`, com o título de eleitor na mão) e uma urna; no fim, lá longe, o **Congresso**. No meio da estrada, a **mesa do acordo**, onde os defensores sentam. Depois da mesa, **oito cancelas** atravessadas na estrada, uma por motivo. A cada motivo, a câmera chega na cancela, o objeto do motivo sobe ao lado e a cancela **desce com a placa NÃO**. No fim, a câmera chega ao Congresso com as 8 cancelas fechadas atrás: a PEC só passa se derrubar todas.

A câmera anda **num sentido só** (do eleitor até o Congresso), sem voltar.

**Os dois trechos de mapa (Kit Mapas, nova composição `QuemDistritalBahia` com os dados do 013):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA A: "HOJE"** | de `Primeiro, hoje` (13,04) até `quem tem muito` (22,20) | 9,2 s | Voo do Brasil até a Bahia; `Bahia` (14,32) o estado acende; `39` (14,90) "39 VAGAS" digita no centro; `estado inteiro` (17,34) uma única borda verde contorna o estado inteiro com o selo UMA DISPUTA SÓ; `Seu voto` (18,90) pinos de voto caem espalhados (Barreiras, Juazeiro, Conquista, Feira, Salvador, Ilhéus); `candidato` (19,90) tag CANDIDATO; `partido dele` (20,78) a tag ganha a etiqueta PARTIDO A |
| **MAPA B: "OS DISTRITOS"** | de `Metade das vagas` (29,10) até `A outra metade` (36,92) | 7,8 s | `cortado em pedaços` (31,94) as linhas dos 20 distritos ilustrativos se desenham; selo DISTRITOS ILUSTRATIVOS; `cerca de 20` (34,14) "20 DISTRITOS" digita; `em cada um` (34,80) mergulho até o distrito de Ilhéus/Itabuna, que acende; `mais votado` (35,82) três tags de candidatos, a do mais votado ganha ELEITO e as outras apagam |

- Sem legenda, sem marca e sem som (vêm do 3D por cima), 1080 × 1920, entrada e saída de 0,2 s com whoosh.

**Placar fixo ★:** depois de `oito motivos` (83,26), um contador pequeno no topo, embaixo da pílula: **NÃO 0/8**, que soma a cada cancela que desce, até **NÃO 8/8**.

**Selos de fonte:**

| Selo | Entra em | Texto |
|---|---|---|
| A proposta | `voto distrital misto` (28,14) | CONGRESSO EM FOCO E METRÓPOLES · 28 E 31/10/2026 |
| As 39 vagas | no MAPA A | BAHIA · 39 DEPUTADOS FEDERAIS |
| Os distritos | no MAPA B | DISTRITOS ILUSTRATIVOS · CONTA PRÓPRIA (39 ÷ 2) |
| A mesa | `sentaram com ele` (56,46) | REUNIÃO DE 28/10/2026 · GAZETA DO POVO E CONGRESSO EM FOCO |
| Kim | `Kim Kataguiri` (65,06) | O ANTAGONISTA · 28/10/2026 |
| PSB | `PSB de João` (68,60) | GAZETA DO POVO · 28/10/2026 |
| Os contra | `enquanto? PL` (72,76) | POSIÇÕES ATÉ 07/11/2026 · PODEM MUDAR |
| Opinião | `Pra mim` (77,76) | OPINIÃO |
| Valdemar | `Valdemar Costa` (90,22) | A CRÍTICA (MS) · 19/10/2026 |
| PSOL | `líder do PSOL` (101,62) | TARCÍSIO MOTTA (PSOL-RJ) · O ANTAGONISTA |
| 49 × 50 mil | `Imagina` (107,22) | EXEMPLO |
| A professora | `Uma professora` (117,12) | EXEMPLO |
| O mapa | `juntar um bairro` (134,06) | EXEMPLO |
| Novo | `O Novo soube` (145,20) | GILSON MARQUES (NOVO-SC) · O ANTAGONISTA |
| Relator e empresários | `o relator marcou` (146,82) | METRÓPOLES · 04/11/2026 |
| O freio | `mínimo de votos` (155,34) | CÓDIGO ELEITORAL · ART. 108 |
| Quórum | `308` (160,98) | CONSTITUIÇÃO · ART. 60 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo, chão, estrada | `tema.fundo`, `tema.chao`, `tema.objetoEscuro` (asfalto) |
| Você (protagonista) | `tema.corpo` |
| Políticos (bonecos genéricos, sem rosto) | `tema.pessoa`, todos iguais; só a etiqueta muda |
| Lado "centro e direita" da mesa × lado "esquerda" | tons neutros de apoio (`festa.azul` × `festa.dourado`), sem cor de partido real |
| Cancelas | `tema.objetoClaro` com faixas `tema.objetoEscuro` |
| Placa NÃO (cancela fechada) e o contador NÃO | `tema.acento` |
| Votos, cédulas | `tema.objetoClaro` |

**Mapa do mundo 3D** (1 unidade = 1 m; chão em y = 0; a estrada corre no eixo z, do z = 8, onde está você, até z = −70, onde está o Congresso):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Você + urna (`Boneco`, `Urna`) | [0, 0, 8] | abre o vídeo; volta no fim por um "atalho" ★ (boneco pequeno andando no fim da estrada) |
| Placas dos três passos (`PlacaChao` × 3: HOJE · O QUE QUEREM · QUEM SÃO) + placa 8 MOTIVOS | [−2 a 2, 0, 6] | acendem uma por palavra |
| O puxador (`Boneco` grande + `Corda` + 2 colegas, do 013) | [2, 0, 4] | logo depois do MAPA A |
| Duas metades: mini plenário (`PlenarioCamara`, do 013, escala pequena) | [0, 0, 0] | metade esquerda = DISTRITOS, metade direita = LISTA; a `ListaLei` com 1º 2º 3º e cadeado |
| Placas DEPUTADO · VEREADOR e a folha PEC (`FolhaCarimbo`) | [0, 0, −2] | |
| **Mesa do acordo** (mesa redonda, peça nova `MesaAcordo`) | [0, 0, −10] | cadeira da cabeceira HUGO MOTTA · PRESIDENTE DA CÂMARA; lado esquerdo: UNIÃO, PP, PSD, MDB, PODEMOS, PSDB (bonecos com plaquinha na frente); de pé ao lado, DOMINGOS NETO · RELATOR e KIM KATAGUIRI · MISSÃO; lado direito: PSB · JOÃO CAMPOS; um aperto de mãos sobre a mesa no `fechou a articulação` |
| **Calçada do contra** | [5, 0, −10] | do outro lado da estrada, quatro bonecos de braços cruzados: PL · PT · PCdoB · PSOL; uma seta liga os quatro com a frase RIVAIS DO MESMO LADO |
| Cancela 1: A LISTA | [0, 0, −18] | `ListaLei` grande com cadeado, nomes "?" no lugar dos nomes; boneco CÚPULA segurando a caneta; balão de citação do Valdemar |
| Cancela 2: O DONO DO DISTRITO | [0, 0, −25] | distrito em maquete (`TerrenoDistrito`, peça nova: quadrado de chão com cerquinha), prefeitura pequena, boneco grande DONO DO DISTRITO em cima de um palanque, caixas EMENDA chegando; selo do PSOL |
| Cancela 3: VOTO NO LIXO | [0, 0, −32] | duas pilhas de votos (`PilhaVotos`, do 013): 49 MIL × 50 MIL; a de 50 mil ganha ELEITO, a de 49 mil desliza para uma lixeira (`Lixeira`, peça nova) |
| Cancela 4: VOTO ESPALHADO | [0, 0, −39] | tabuleiro da Bahia em relevo baixo (contorno do IBGE, já usado no Kit Mapas) com pontinhos da professora espalhados; ao lado, outro candidato com pontos todos juntos num distrito; boneco PROFESSORA sai do tabuleiro |
| Cancela 5: VEREADOR FEDERAL | [0, 0, −46] | boneco DEPUTADO com capacete de obra ao lado de uma obra pequena (`Obra`, peça nova: cone + muro); atrás, um mapa do Brasil apaga devagar |
| Cancela 6: O MAPA | [0, 0, −53] | prancheta grande com 4 distritos desenhados (peça nova `PranchetaDistritos`); um lápis gigante move a linha: pega um bairro (um quadradinho de casas muda de cor) e corta uma cidade ao meio; boneco com camisa de jogo pintando a linha do campo |
| Cancela 7: A PRESSA | [0, 0, −60] | relógio grande correndo (`Relogio`, catálogo); folha PEC em branco "TEXTO: ?"; jornal (peça nova `Jornal`) com etiqueta NOVO: "SOUBE PELA IMPRENSA"; mesinha com placa EMPRESÁRIOS · SP e o boneco RELATOR; uma cadeira vazia com plaquinha VOCÊ ★ |
| Cancela 8: SAÍDA MAIS SIMPLES | [0, 0, −66] | medidor com ponteiro MÍNIMO DE VOTOS (peça nova `Medidor`), uma mão gira o botão; livro CONSTITUIÇÃO fechado ao lado, intocado |
| Congresso (`Congresso`, catálogo) + contadores 308/513 e 49/81 | [0, 0, −72] | no fundo, do começo ao fim (pequeno e longe no começo) |

**Regras visuais:**
- Nenhum rosto, logo ou cor de partido real. Pessoas reais só como bonecos genéricos iguais, com etiqueta de nome e partido.
- Verde (acento) só no NÃO, no contador e no que a pessoa precisa ver primeiro.
- Todo exemplo com o selo EXEMPLO; toda opinião com o selo OPINIÃO na hora do "Pra mim".
- Plaquinhas pequenas presas aos objetos, nunca cartão grande tapando a maquete.
- Marca d'água @eumagnoleite pequena e sutil, quicando pela tela do primeiro ao último quadro, inclusive sobre os mapas.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Direita e` | 0,00 | Mesa do acordo (vista do alto) | Bonecos do lado azul acendem | 1 |
| 2 | `esquerda brigam` | 0,56 | Mesa | Bonecos do lado dourado acendem; balões de briga ★ | 1 |
| 3 | `quase tudo` | 1,46 | Balões | Raios pequenos entre os dois lados (sem flash) | 1 |
| 4 | `dos dois lados` | 3,00 | Mesa | Uma ponta de cada lado se vira para o centro | 1 |
| 5 | `mudar o jeito` | 4,10 | Urna | A urna na frente gira | 1 |
| 6 | `que você vota` | 4,92 | Você | O boneco com o título aparece na frente | 1 |
| 7 | `eu sou contra` | 5,86 | Placa | Placa NÃO desce na frente da câmera (baque) | 1 |
| 8 | `três passos` | 6,98 | Placas | 3 placas no chão | 2 |
| 9 | `como é hoje` | 7,86 | Placa | HOJE acende | 2 |
| 10 | `eles querem` | 9,00 | Placa | O QUE QUEREM acende | 2 |
| 11 | `quem são` | 9,78 | Placa | QUEM SÃO acende | 2 |
| 12 | `oito motivos` | 11,30 | Estrada | As 8 cancelas aparecem ao longe, uma a uma | 2 |
| 13 | `dizer não` | 12,10 | Cancelas | As plaquinhas NÃO piscam suave nas 8 (0,4 s) | 2 |
| 14 | `Primeiro, hoje` | 13,04 | **MAPA A** | Trecho do Kit Mapas (eventos na tabela acima) | MA |
| 15 | `quem tem muito` | 22,20 | Puxador | Volta ao 3D: boneco grande com pilha de votos | 3 |
| 16 | `leva colegas` | 23,20 | Corda | Puxa 2 colegas até 2 cadeiras | 3 |
| 17 | `o puxador` | 24,64 | Etiqueta | PUXADOR DE VOTOS | 3 |
| 18 | `Segundo, o que` | 25,98 | Placa | O QUE QUEREM acende | 4 |
| 19 | `voto distrital misto` | 28,14 | Mini plenário | Placa VOTO DISTRITAL MISTO; selo da proposta | 4 |
| 20 | `Metade das vagas` | 29,10 | **MAPA B** | Trecho do Kit Mapas | MB |
| 21 | `A outra metade` | 36,92 | Plenário | Volta ao 3D: metade das cadeiras acende LISTA | 5 |
| 22 | `uma lista` | 38,02 | Lista | Sobe com 1º, 2º, 3º | 5 |
| 23 | `monta antes` | 38,86 | Lista | Um boneco escreve os nomes | 5 |
| 24 | `ordem definida` | 39,90 | Cadeado | Fecha a ordem | 5 |
| 25 | `Você vota no partido` | 40,90 | Você | O boneco vota na urna PARTIDO | 5 |
| 26 | `colocou no topo` | 42,98 | Lista | O 1º desce para a cadeira | 5 |
| 27 | `deputado e vereador` | 44,56 | Placas | DEPUTADO · VEREADOR | 5 |
| 28 | `uma PEC` | 46,52 | Folha | PEC sobe | 5 |
| 29 | `mudança na Constituição` | 47,32 | Livro | CONSTITUIÇÃO abre ao lado | 5 |
| 30 | `Terceiro, quem quer` | 48,74 | Câmera | Avança pela estrada até a mesa; placa QUEM SÃO | 6 |
| 31 | `presidente da Câmara` | 50,90 | Cabeceira | Boneco acende; etiqueta PRESIDENTE DA CÂMARA | 6 |
| 32 | `Hugo Motta` | 51,90 | Etiqueta | HUGO MOTTA · REPUBLICANOS | 6 |
| 33 | `votar ainda este` | 53,78 | Calendário | Plaquinha 2026 na mesa | 6 |
| 34 | `Do centro e` | 54,90 | Lado azul | Placa CENTRO E DIREITA | 6 |
| 35 | `União Brasil` | 57,06 | Boneco | UNIÃO | 6 |
| 36 | `PP` | 58,04 | Boneco | PP | 6 |
| 37 | `PSD, MDB` | 58,66 | Boneco | PSD | 6 |
| 38 | `MDB` | 59,52 | Boneco | MDB | 6 |
| 39 | `Podemos` | 60,18 | Boneco | PODEMOS | 6 |
| 40 | `PSDB` | 60,86 | Boneco | PSDB | 6 |
| 41 | `O relator previsto` | 61,96 | Boneco de pé | RELATOR com prancheta | 6 |
| 42 | `Domingos Neto` | 62,82 | Etiqueta | DOMINGOS NETO · PSD-CE | 6 |
| 43 | `Kim Kataguiri` | 65,06 | Boneco | KIM KATAGUIRI · MISSÃO-SP; selo | 6 |
| 44 | `bons olhos` | 66,88 | Ícone | Olho com ✓ sobre ele | 6 |
| 45 | `Da esquerda` | 67,76 | Lado dourado | Placa ESQUERDA | 6 |
| 46 | `PSB de João` | 68,60 | Boneco | PSB · JOÃO CAMPOS; selo | 6 |
| 47 | `fechou a articulação` | 69,84 | Mesa | Aperto de mãos sobre a mesa (pop) | 6 |
| 48 | `E contra` | 71,46 | Câmera | Vira para a calçada do contra | 7 |
| 49 | `enquanto? PL` | 72,76 | Boneco | PL de braços cruzados; selo POSIÇÕES ATÉ 07/11 | 7 |
| 50 | `PT, PCdoB` | 73,42 | Boneco | PT | 7 |
| 51 | `PCdoB` | 73,98 | Boneco | PCdoB | 7 |
| 52 | `e PSOL` | 74,82 | Boneco | PSOL | 7 |
| 53 | `Rivais de sempre` | 75,50 | Seta | Arco liga PL e PT; RIVAIS DE SEMPRE | 7 |
| 54 | `do mesmo lado` | 76,86 | Calçada | Os quatro dão um passo juntos | 7 |
| 55 | `Pra mim` | 77,76 | Selo | OPINIÃO | 7 |
| 56 | `esquerda contra direita` | 78,70 | Placas | ESQUERDA × DIREITA, com um X cinza por cima | 7 |
| 57 | `lá dentro` | 80,70 | Congresso | A câmera mostra o Congresso no fim da estrada | 7 |
| 58 | `mexendo na regra` | 81,18 | Regra | Uma régua no chão é empurrada ★ | 7 |
| 59 | `os oito motivos` | 82,88 | Contador | Aparece NÃO 0/8 | 8 |
| 60 | `Um. A` | 83,80 | Cancela 1 | Câmera chega; placa 1 · A LISTA | 8 |
| 61 | `Metade das cadeiras` | 85,34 | Lista | Lista grande sobe | 8 |
| 62 | `você não escolhe` | 87,08 | Nomes | Nomes viram "?" | 8 |
| 63 | `cúpula do partido` | 88,84 | Boneco | CÚPULA com a caneta, em cima da lista | 8 |
| 64 | `Valdemar Costa` | 90,22 | Boneco | VALDEMAR COSTA NETO · PRESIDENTE DO PL; selo | 8 |
| 65 | `só é bom` | 92,54 | Balão | "SÓ É BOM PARA DIRIGENTE PARTIDÁRIO" | 8 |
| 66 | `partidário.` | 94,08 | Cancela | Desce NÃO; contador 1/8 (baque) | 8 |
| 67 | `Dois. O` | 94,84 | Cancela 2 | 2 · O DONO DO DISTRITO | 9 |
| 68 | `disputa pequena` | 96,96 | Distrito | Cerquinha se fecha | 9 |
| 69 | `a máquina` | 98,52 | Palanque | DONO DO DISTRITO sobe | 9 |
| 70 | `grupo do prefeito` | 99,34 | Prefeitura | Prédio PREFEITURA acende | 9 |
| 71 | `distribui emenda` | 100,40 | Caixas | Caixas EMENDA chegam | 9 |
| 72 | `líder do PSOL` | 101,62 | Selo | Selo do PSOL | 9 |
| 73 | `coronelismo` | 103,48 | Etiqueta | CORONELISMO | 9 |
| 74 | `compra de votos` | 104,38 | Etiqueta | COMPRA DE VOTOS; cancela desce NÃO 2/8 | 9 |
| 75 | `Três. Voto` | 105,42 | Cancela 3 | 3 · VOTO NO LIXO | 10 |
| 76 | `Imagina` | 107,22 | Selo | EXEMPLO | 10 |
| 77 | `fez 49` | 108,74 | Pilha | 49 MIL sobe (subida) | 10 |
| 78 | `fez 50` | 110,78 | Pilha | 50 MIL sobe, um pouco maior | 10 |
| 79 | `primeiro leva` | 112,08 | Etiqueta | ELEITO na de 50 mil (ding) | 10 |
| 80 | `Os 49` | 113,10 | Pilha | Desliza para a lixeira | 10 |
| 81 | `não elegem ninguém` | 113,78 | Cancela | NÃO 3/8 | 10 |
| 82 | `Quatro. Voto` | 115,14 | Cancela 4 | 4 · VOTO ESPALHADO | 11 |
| 83 | `Uma professora` | 117,12 | Boneco | PROFESSORA; selo EXEMPLO | 11 |
| 84 | `estado todo` | 118,58 | Tabuleiro | Pontinhos espalhados pela Bahia | 11 |
| 85 | `sem reduto` | 119,48 | Tabuleiro | Nenhum distrito acende para ela | 11 |
| 86 | `fica de fora` | 120,18 | Boneco | Sai do tabuleiro | 11 |
| 87 | `mulheres` | 122,14 | Bonecos | Plaquinha MULHERES | 11 |
| 88 | `negros` | 122,88 | Bonecos | NEGROS | 11 |
| 89 | `indígenas` | 123,36 | Bonecos | INDÍGENAS; NÃO 4/8 | 11 |
| 90 | `Cinco. Vereador` | 124,18 | Cancela 5 | 5 · VEREADOR FEDERAL | 12 |
| 91 | `O deputado passa` | 126,00 | Boneco | DEPUTADO com capacete | 12 |
| 92 | `obra do distrito` | 127,70 | Obra | Cone e muro sobem | 12 |
| 93 | `O país` | 128,82 | Mapa do Brasil | Apaga devagar | 12 |
| 94 | `para depois` | 129,36 | Cancela | NÃO 5/8 | 12 |
| 95 | `Seis. O` | 130,24 | Cancela 6 | 6 · O MAPA | 13 |
| 96 | `Os distritos não` | 131,58 | Prancheta | Linhas tracejadas, sem cor | 13 |
| 97 | `Quem desenha` | 133,26 | Lápis | Lápis gigante desce | 13 |
| 98 | `juntar um bairro` | 134,06 | Bairro | Quadradinho de casas muda de distrito; selo EXEMPLO | 13 |
| 99 | `cortar uma cidade` | 135,18 | Cidade | A linha corta a cidade ao meio | 13 |
| 100 | `escolher o resultado` | 136,88 | Distrito | ELEITO aparece antes da eleição ★ | 13 |
| 101 | `os políticos` | 138,38 | Boneco | Boneco com camisa de jogo | 13 |
| 102 | `marcando o campo` | 139,62 | Linha | Ele pinta a linha do campo; NÃO 6/8 | 13 |
| 103 | `Sete. A` | 140,54 | Cancela 7 | 7 · A PRESSA | 14 |
| 104 | `Querem votar este` | 141,92 | Relógio | Ponteiros correm | 14 |
| 105 | `nem foi apresentado` | 143,74 | Folha | PEC em branco "TEXTO: ?" | 14 |
| 106 | `O Novo soube` | 144,96 | Jornal | NOVO: SOUBE PELA IMPRENSA; selo | 14 |
| 107 | `o relator marcou` | 146,82 | Mesa | Boneco RELATOR senta | 14 |
| 108 | `empresários em São` | 148,58 | Placa | EMPRESÁRIOS · SÃO PAULO; selo | 14 |
| 109 | `Para você` | 149,96 | Cadeira | Cadeira vazia com plaquinha VOCÊ ★ | 14 |
| 110 | `quem explicou` | 150,58 | Cancela | NÃO 7/8 | 14 |
| 111 | `Oito. Tem` | 151,48 | Cancela 8 | 8 · SAÍDA MAIS SIMPLES | 15 |
| 112 | `Hoje, cada` | 153,40 | Medidor | Medidor MÍNIMO DE VOTOS acende | 15 |
| 113 | `mínimo de votos` | 155,34 | Ponteiro | Ponteiro sobe até a marca; selo art. 108 | 15 |
| 114 | `ajustar esse freio` | 157,04 | Botão | A mão gira o botão; o ponteiro sobe um pouco | 15 |
| 115 | `mexer na Constituição` | 158,12 | Livro | CONSTITUIÇÃO fechado, com ✓; NÃO 8/8 (ding) | 15 |
| 116 | `Para passar` | 159,38 | Câmera | Chega ao Congresso; as 8 cancelas fechadas atrás | 16 |
| 117 | `308` | 160,98 | Contador | 308 / 513 (subida); selo art. 60 | 16 |
| 118 | `49 senadores` | 162,52 | Contador | 49 / 81 | 16 |
| 119 | `cobrar quem você` | 164,76 | Você | O boneco volta, com um megafone ★ | 16 |
| 120 | `Você quer escolher` | 165,96 | Duas urnas | SEU DEPUTADO × LISTA DO PARTIDO | 17 |
| 121 | `deixar o partido` | 167,78 | Lista | Cadeado na urna da lista | 17 |
| 122 | `comentários` | 170,04 | Ícone | Balão de comentário verde | 17 |
| 123 | `E segue` | 170,94 | Câmera | Sobe devagar; @eumagnoleite | 17 |

Na programação, cada cena ganha mais eventos pequenos (cédulas caindo, bonecos acenando, cancelas balançando), para manter cerca de 1 evento por segundo.

## 2.4 Cenas com câmera

### CENA 1: DOIS LADOS (0,00 a 6,70 s)
Do alto da mesa do acordo (pos [0, 14, −2] · alvo [0, 0, −10]) descendo em arco até a urna e você (alvo [0, 1, 8] · dist 7). Pílula: DOIS LADOS. Aha: "esquerda e direita juntas numa coisa".

### CENA 2: O CAMINHO (6,78 a 12,90 s)
Atrás do boneco, olhando a estrada inteira (pos [0, 3, 12] · alvo [0, 1, −30] · ângulo 12°), avanço lento. Pílula: O CAMINHO. Aha: "três passos e oito cancelas até o Congresso".

### MAPA A: HOJE (13,04 a 22,20 s), Kit Mapas
Pílula do 3D: HOJE. Aha: "hoje o estado inteiro é uma disputa só".

### CENA 3: O PUXADOR (22,20 a 25,90 s)
Close no puxador (alvo [2, 1, 4] · dist 5, arco de 20°). Pílula: HOJE.

### CENA 4 + MAPA B + CENA 5: O QUE QUEREM (25,98 a 48,60 s)
Mini plenário (alvo [0, 1, 0] · dist 8), entra o MAPA B de 29,10 a 36,92, volta ao plenário com a lista (alvo [0, 1,2, 0] · dist 6) e termina na folha PEC e no livro. Pílula: O QUE QUEREM. Aha: "metade é distrito, metade é lista do partido".

### CENA 6: QUEM QUER (48,74 a 71,30 s)
Grua avançando pela estrada até a mesa (pos [0, 8, 2] → [3, 6, −4] · alvo [0, 1, −10]), arco lento em volta da mesa conforme cada sigla é dita (um plano que mostra os 6 partidos juntos, porque são ditos a menos de 1 s um do outro). Pílula: QUEM QUER. Aha: "centro, direita e uma parte da esquerda na mesma mesa".

### CENA 7: QUEM É CONTRA (71,46 a 82,10 s)
Câmera vira para a calçada do contra (alvo [5, 1, −10] · dist 7) e depois sobe mostrando a estrada até o Congresso (alvo [0, 0, −40] · ângulo 25°). Pílula: QUEM É CONTRA. Aha: "rivais de sempre do mesmo lado: é o sistema mexendo na regra".

### CENAS 8 a 15: OS OITO MOTIVOS (82,26 a 159,30 s)
Uma cena por cancela, todas com o mesmo movimento: a câmera chega pela estrada (avanço de 3 m), faz um arco curto em volta do objeto do motivo (de 15° a 25°) e, quando a cancela desce, já segue para a próxima. Sempre para frente (alvo de z −18 até z −66). Pílulas: 1 · A LISTA · 2 · O DONO DO DISTRITO · 3 · VOTO NO LIXO · 4 · VOTO ESPALHADO · 5 · VEREADOR FEDERAL · 6 · O MAPA · 7 · A PRESSA · 8 · SAÍDA SIMPLES.

### CENA 16: O QUE FALTA (159,38 a 165,90 s)
Câmera sobe e mostra o Congresso com as 8 cancelas fechadas na estrada atrás (pos [6, 12, −56] · alvo [0, 1, −70]). Pílula: O QUE FALTA. Aha: "308 deputados e 49 senadores, e ainda dá tempo de cobrar".

### CENA 17: E VOCÊ? (165,96 a 174,53 s)
Você entre as duas urnas na frente do Congresso; grua final mostra a estrada inteira. Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Tudo do `audio/fontes.md` (checado em 07/11/2026). Defensores: Hugo Motta e a reunião de 28/10 (Gazeta do Povo, Congresso em Foco, Metrópoles); relator previsto Domingos Neto (Metrópoles); Kim (O Antagonista); PSB e PSD na articulação (Gazeta do Povo). Contra: PL (Cabo Gilberto, via Metrópoles), PT e PCdoB (O Antagonista), PSOL (CNN e O Antagonista). Citações: Valdemar (A Crítica), Tarcísio Motta (O Antagonista), Gilson Marques (O Antagonista). Relator com empresários (Metrópoles, 04/11). Regras: art. 108 do Código Eleitoral e art. 60 da Constituição. Exemplos e distritos com selo EXEMPLO ou CONTA PRÓPRIA.

**Conferir antes de publicar:** se a PEC foi protocolada; se PSB, PSOL, PV ou Novo fecharam posição; se o encontro do relator com empresários já aconteceu (se sim, a fala continua certa: "marcou").

## 2.6 Trilha e sons

Sem trilha. `whoosh` nas trocas de cena e nas entradas e saídas dos mapas; `tique` na pílula; `pop` nas etiquetas dos partidos e nos objetos; `baque` em cada cancela que desce (8 vezes) e no NÃO do gancho; `subida` em 49 mil, 50 mil e 308; `ding` no ELEITO e no NÃO 8/8; `bip` no relógio da pressa. Os mapas entram sem som próprio.

## 2.7 Arquivos

**Kit Mapas (`~/Kit-Mapas-Animados`):** `src/videos/quem-distrital/` (cópia do `distrital-bahia`, com os dados de distritos já prontos e os tempos novos dos trechos A e B) → render → `projetos/049. quem quer o distrital misto/mapas/bahia.mp4`. Registro no Root do Kit Mapas (só acrescentar).

**Estúdio 3D:**
- Novos: `src/videos/quemdistrital/QuemDistrital.tsx`, `pecas.tsx` (peças novas: `MesaAcordo`, `Cancela`, `TerrenoDistrito`, `Lixeira`, `Obra`, `PranchetaDistritos`, `Jornal`, `Medidor`, `ContadorNao`); `palavras.ts` (já pronto).
- Reaproveitados: `Congresso`, `Urna`, `Relogio`, `Cadeado`, `IconeBalao` (catálogo); `PlenarioCamara`, `PilhaVotos`, `Corda` (do 013); `ListaLei`, `PlacaChao`, `FolhaCarimbo` (do 011); `Boneco`, `Placa` (base). Confirmo os nomes exatos no `CATALOGO.md` antes de programar.
- `src/Root.tsx` (só acrescentar): `QuemDistrital`, `QuemDistritalGuia`, `QuemDistritalLimpo`, `CapaQuemDistrital`.
- 5.236 quadros, em 7 partes de até 800 no render (uma por vez, com a trava `_render.lock`).

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md` e da memória:** pessoa real só como boneco genérico com etiqueta; sem cor de partido real; selo em cada dado, EXEMPLO nos exemplos; câmera num sentido só, sem vai e volta; plaquinhas pequenas, sem cartão grande tapando; os dois kits juntos (mapa sem legenda, sem marca e sem som, encaixado com entrada e saída de 0,2 s; selos por cima do mapa no topo); marca d'água @eumagnoleite quicando do primeiro ao último quadro; quando() dos motivos com a palavra seguinte; mundo diferente do 013 (plenário).

**Pedidos da pessoa:** vídeo de opinião contra; mostrar quem defende, da direita e da esquerda; listar os argumentos contra; roteiro didático; Kit Estúdio 3D (com o Kit Mapas).

**Escolhas de direção (★):** a estrada com 8 cancelas e o contador NÃO 0/8 → 8/8; os balões de briga no gancho; a régua da regra empurrada; o ELEITO aparecendo antes da eleição no mapa desenhado; a cadeira vazia VOCÊ na mesa dos empresários; o megafone para cobrar o deputado.

## Correções pedidas em 07/11/2026 (roteiro versão 3, antes do vídeo final)
- Errado no plano e nas cenas: o chip "HOJE: MÍNIMO DE VOTOS PARA ENTRAR" e o medidor "MÍNIMO DE VOTOS" do motivo 8 (na fase três não há mínimo). Trocar por "FASE UM: MÍNIMO DE 10%" e "MÍNIMO DE 10%", com o selo "CÓDIGO ELEITORAL · ART. 108 · LEI COMUM".
- MAPA A fica só em "Primeiro, hoje... uma disputa só" (Bahia, 39 VAGAS, UMA DISPUTA SÓ); sai a tag "CANDIDATO + PARTIDO".
- Cena nova "AS TRÊS FASES" (3D, depois do MAPA A), com a loja de cadeiras do 013 (Cadeira, PilhaVotos, PlacaPreco): fase um, a pilha de votos válidos ÷ vagas vira a etiqueta QUOCIENTE = PREÇO DA CADEIRA; os partidos enchem as cadeiras que pagam; um candidato abaixo de 10% para numa cancelinha "10%". Fase dois, as cadeiras que sobram com régua "PARTIDO 80% · CANDIDATO 20%"; quem não alcança fica de fora. Fase três, a régua some e todos os partidos entram, selo "STF · ADIs 7228, 7263 e 7325 · 2024". Depois, o puxador com a corda.
- Saem as cenas das falas cortadas (placas DEPUTADO/VEREADOR, "Agora, os oito motivos").
- Tempos novos depois da nova sincronia.
