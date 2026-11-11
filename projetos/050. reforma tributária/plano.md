# Plano de cenas: 050. reforma tributária (versão 1, aprovada em 07/11/2026)

**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **três trechos de mapa** do Kit Mapas Animados (Brasil com estados e municípios, malha do IBGE), todos num MP4 só, como no 018. A legenda, a pílula, a marca d'água quicando e os selos de fonte do 3D ficam por cima dos mapas.

Pedidos da pessoa que valem aqui:
1. Histórico, situação hoje, próximos anos e repartição de competências, bem didático (07/11/2026).
2. Kit Mapas + Estúdio 3D.
3. Marca d'água @eumagnoleite pequena, sutil, quicando pela tela inteira (regra fixa).
4. Dado em plaquinha pequena presa ao objeto, nunca cartão grande tapando a maquete (regra fixa).
5. Vídeo explicativo e neutro: sem dizer se a reforma é boa ou ruim (regra 9 do CLAUDE.md).

---

## 2.1 Narração

- Arquivo: `projetos/050. reforma tributária/audio/narracao-norm.wav` (de `narracao-original.mp3`, ElevenLabs 07/11/2026 16:28, voz Adam - Dominant, Firm, v4).
- Preparo: 1,2x, pausas acima de 0,35 s encurtadas (script de silencedetect + atrim, regra do 047), -15 LUFS, mono 44100 Hz.
- Original 223,16 s → final **185,62 s** · `AUDIO_SEG = 185.62` · `QUADROS = 5596` (arredondar((185,62 + 0,9) × 30)).
- **549 palavras** no roteiro e no `palavras.ts`; última ("direitos.") termina em 185,30 s.
- Ajustes da sincronia: o Whisper inventou texto nos primeiros 30 s; esse trecho foi transcrito de novo com o roteiro como dica e emendado (0 a 29,86 s). "Três:" (140,20 s) não tinha saído e foi posto na mão, conferido pelo volume do áudio. Avisos aceitos: "Pensa"≈"cabeça", "0,9%", "0,1%", "11,3%," (números quebrados). Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas, para o `quando()`** (ocorrência: segundo):
- Cinco: 0,00 · 50,22 — pãozinho: 6,00 · 63,22 — padaria: 9,60 · 28,14 — farinha: 8,78 · 30,92
- União: 15,82 · 53,86 · 98,16 — ICMS: 19,38 · 24,38 · 58,86 · 143,76 · 151,28 — ISS: 21,34 · 26,40 · 59,82 · 144,64 · 152,16
- Cofins: 17,76 · 55,32 · 129,58 — PIS: 17,28 · 54,88 · 129,32 — CBS: 53,10 · 120,70 · 127,46 — IBS: 56,14 · 122,74 · 147,36
- cascata: 31,92 · 69,72 — guerra fiscal: 35,78 · 89,14 — fábrica: 34,52 · 84,66 · 85,48 — Bahia: 86,92 · 88,50
- Comitê Gestor: 77,34 · 170,60 — Senado: 42,98 · 133,56 — leis: 23,70 · 45,88 — 2026: 47,42 · 115,98
- herança: 105,94 · 110,60 — IPVA: 103,10 · 108,38 — nota: 118,58 · 162,92 — bolso: 154,58 · 183,68
- Três: 14,70 (três donos) · 37,42 (três décadas) · 140,20 (marco 3) — Dois: 52,38 · 125,38 · 169,04 — Quatro: 114,22 · 148,98

---

## 2.2 Ideia e mundo

**A metáfora: a rua do pãozinho e os três donos.** O vídeo inteiro acontece numa maquete só: uma rua que leva o pão do **campo de trigo** ao **moinho**, à **padaria** e à **casa de você** (o protagonista, boneco na cor de acento). Atrás da rua ficam os **três donos do imposto**: o prédio da **UNIÃO**, o **ESTADO** e a **PREFEITURA**. Em cada etapa da rua nasce uma **ficha de imposto**, que voa para o dono dela. No modelo novo, as fichas param de se empilhar (fim da cascata) e o dinheiro de estado e cidade cai num **cofre do meio, o COMITÊ GESTOR**, que reparte por canos. No fim, a câmera sai da rua e anda por uma **estrada do tempo** com quatro marcos (2026, 2027, 2029 a 2032, 2033), que fica na frente da maquete. Os mapas entram três vezes: o país dos 27 estados e 5.570 cidades (cada um com sua lei), a guerra fiscal e a grande virada (imposto saindo de São Paulo e indo para a Bahia).

**Protagonista:** "você", boneco no acento, na porta da casa do fim da rua. Ele compra o pão no gancho, recebe o cashback no bolso e aparece no fecho segurando a nota.

**Cores dos impostos** (todas do tema do perfil eumagnoleite, nenhuma cor escrita no código):

| Uso | Campo do tema |
|---|---|
| fundo, chão da maquete | `fundo`, `chao` |
| prédios, rua, campo, moinho | `objeto`, `objetoEscuro` |
| impostos velhos (IPI, PIS, Cofins, ICMS, ISS) | `objetoEscuro` com letra clara (ficam "cinza") |
| CBS (União) | `acento` (verde folha) |
| IBS (estados e cidades) | `acento` mais claro (`acentoSuave`) |
| cofre do Comitê Gestor, canos | `objeto` com brilho do acento quando o dinheiro passa |
| "você" | `acento` |
| alertas (teto, estimativa acima) | `alerta` do tema, só na cena do teto |

**Selos de fonte** (faixa A, pequenos, entram e saem com 0,4 s):

| Selo | Entra em | Texto |
|---|---|---|
| S1 | `entrou na Constituição` (43,58) | EMENDA CONSTITUCIONAL 132 · 20/12/2023 |
| S2 | `2025` (46,24) | LEI COMPLEMENTAR 214/2025 |
| S3 | `2026.` (47,42) | LEI COMPLEMENTAR 227/2026 · COMITÊ GESTOR |
| S4 | `até 2077` (93,98) | EC 132 · ADCT ART. 131 |
| S5 | `TCU calculou` (130,96) | TCU · 28/10/2026 · SENADO DECIDE ATÉ DEZEMBRO |
| S6 | `estimativa` (170,02) | COMITÊ GESTOR · RESOLUÇÃO 14/2026 · 27,91% |

**Mapa do mundo** (chão em y = 0, frente em z+; a rua corre da esquerda para a direita, na frente)

| Lugar ou peça | Posição | Observação |
|---|---|---|
| Campo de trigo | [-9, 0, 4] | `Campo` + fileiras de espigas (peça nova `Trigo`) · nasce em `trigo` |
| Moinho | [-4, 0, 4] | peça nova `Moinho` (pás girando devagar) com saco FARINHA · nasce em `farinha` |
| Padaria | [1, 0, 4] | `Lojinha` com letreiro PADARIA (texto livre) · nasce em `padaria` |
| Casa de você | [6, 0, 4] | `Casa` + boneco `Pessoa` no acento |
| Rua | x -11 a 9, z 5,5 | `Ruazinha` |
| Fichas de imposto | sobre cada etapa, y 2,5 | `Ficha` com texto; voam em arco (`SetaArco`) até o dono |
| Prédio UNIÃO | [-6, 0, -6] | `OrgaoPublico` texto "UNIÃO" (o mais alto) · sobe em `União` |
| Prédio ESTADO | [0, 0, -6] | `OrgaoPublico` texto "ESTADO" · sobe em `O estado` |
| Prédio PREFEITURA | [6, 0, -6] | `OrgaoPublico` texto "PREFEITURA" · sobe em `A prefeitura` |
| Congresso | [0, 0, -14] (fundo) | `Congresso` · só acende na cena da história |
| Cofre COMITÊ GESTOR | [3, 0, -2] | peça nova `CofreComite` (cofre grande com letreiro) · nasce em `caixa único` |
| Canos | cofre → ESTADO e → PREFEITURA | `CanoMoedas` |
| Objetos do "o que continua" | na frente de ESTADO e PREFEITURA, z -3 | `Carro` (IPVA), `Casinha` (IPTU), `Chave` (ITBI), `Documento` "HERANÇA" (ITCMD), `Jatinho` + lancha (peça nova `Lancha`) |
| Estrada do tempo | x -10 a 10, z 10 | `LinhaTempo` + 4 `MarcoAno` (2026, 2027, 2029-32, 2033) |
| Nota fiscal grande | [-6, 0, 11] | `NotaFiscal` (com `tributos` e `separa`) |
| Cigarro e bebida | [-1, 0, 11] | `MacoCigarro` (genérico, sem marca) e `Garrafa` |
| Barras ICMS/ISS x IBS | [3, 0, 11] | `BarrasDuplas` · 4 degraus |
| Cesta, família, medidor do teto | [8, 0, 11] a [10, 0, 7] | `Cesta`, `Pessoas` (família), `Medidor` com `LinhaLimite` no 26,5% |

**Regras visuais deste vídeo**
- Imposto velho em cinza; imposto novo no verde. O olho entende quem sai e quem entra só pela cor.
- Nada de boneco de político, partido ou nome de pessoa. Prédios só com letreiro (UNIÃO, ESTADO, PREFEITURA, COMITÊ GESTOR).
- Cigarro e garrafa genéricos, sem marca.
- Neutro: o "mais leve ou mais pesada?" do fim é uma balança equilibrada, sem pender para lado nenhum.

---

## 2.3 Mapa de palavras-chave

Eventos ★ são extras meus. Densidade: 132 eventos em 185 s (cerca de 1 a cada 1,4 s).

### Cena 1: GANCHO (0,00 a 5,66)
| # | Palavra | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Cinco impostos` | 0,00 | etiqueta de preço do pão | `EtiquetaPreco` gigante "R$ 1,00" ★ abre a tela; 5 fichas cinza saem de dentro dela, uma por vez | 1 |
| 2 | `escondidos` | 0,78 | fichas | as fichas mostram os nomes: IPI · PIS · COFINS · ICMS · ISS | 1 |
| 3 | `preço de tudo` | 1,54 | `PacoteImposto` | 3 pacotes de compra (pão, leite, remédio ★) aparecem ao lado da etiqueta, com a mesma etiqueta | 1 |
| 4 | `trocados` | 3,24 | fichas | as 5 fichas giram e viram 2 fichas verdes "CBS" e "IBS" (`SetasTroca`) | 1 |
| 5 | `já começou` | 4,84 | chip | chip "DESDE 2026" na faixa B; pílula: A TROCA | 1 |

### Cena 2: O PÃOZINHO (5,66 a 12,22)
| 6 | `pãozinho` | 6,00 | pão | o pão pousa na mão do boneco "você" na porta da casa; câmera recua e mostra a rua | 2 |
| 7 | `chegar em você` | 7,12 | você | o boneco acende no acento | 2 |
| 8 | `trigo` | 8,12 | campo | o campo de trigo nasce do chão (onda das espigas) | 2 |
| 9 | `farinha` | 8,78 | moinho | o moinho sobe, as pás começam a girar; saco FARINHA | 2 |
| 10 | `padaria` | 9,60 | padaria | a padaria sobe, letreiro PADARIA acende | 2 |
| 11 | `cada etapa` | 10,58 | rua | um caminhãozinho ★ leva o saco do campo ao moinho e à padaria | 2 |
| 12 | `imposto.` | 11,38 | fichas | uma ficha cinza "IMPOSTO" nasce em cima de cada etapa (3 fichas, pop) | 2 |

### Cena 3: OS TRÊS DONOS (12,22 a 22,32)
| 13 | `1988` | 12,40 | chip | chip "1988 · CONSTITUIÇÃO" na faixa B | 3 |
| 14 | `três donos` | 14,70 | prédios | três terrenos acendem atrás da rua; câmera sobe em grua | 3 |
| 15 | `União` | 15,82 | prédio UNIÃO | o prédio da União sobe | 3 |
| 16 | `IPI` | 16,44 | ficha | ficha IPI voa da padaria ★ para a União | 3 |
| 17 | `PIS` | 17,28 | ficha | ficha PIS voa para a União | 3 |
| 18 | `Cofins` | 17,76 | ficha | ficha COFINS voa para a União | 3 |
| 19 | `O estado` | 18,54 | prédio ESTADO | o prédio do Estado sobe | 3 |
| 20 | `ICMS` | 19,38 | ficha | ficha ICMS voa do moinho e da padaria para o Estado | 3 |
| 21 | `A prefeitura` | 20,38 | prédio PREFEITURA | a prefeitura sobe | 3 |
| 22 | `ISS` | 21,34 | ficha | ficha ISS voa para a prefeitura (serviço: a entrega do pão ★) | 3 |

### MAPA A1: CADA UM COM SUA LEI (22,32 a 27,26)
| 23 | `O problema` | 22,32 | MAPA A | entra o mapa (whoosh); pílula: CADA UM COM SUA LEI | A |
| 24 | `27 leis` | 23,26 | mapa | os 27 estados acendem um a um, cada um com um livrinho; contador "27" | A |
| 25 | `ICMS` | 24,38 | mapa | etiqueta "27 LEIS DE ICMS" | A |
| 26 | `5 mil` | 25,58 | mapa | os 5.570 municípios acendem em onda do Norte para o Sul; contador sobe a 5.570 | A |
| 27 | `ISS` | 26,40 | mapa | etiqueta "5.570 LEIS DE ISS" | A |

### Cena 4: A CASCATA (27,26 a 32,88)
| 28 | `Muitas vezes` | 27,26 | 3D | sai o mapa; close na padaria; pílula: A CASCATA | 4 |
| 29 | `padaria paga` | 28,52 | fichas | a ficha da padaria cai em cima do saco de farinha | 4 |
| 30 | `imposto em cima do imposto` | 28,76 | fichas | a ficha que veio na farinha fica embaixo; a nova empilha em cima; a pilha cresce ★ | 4 |
| 31 | `já veio na farinha` | 30,58 | farinha | o saco de farinha acende, com a ficha velha grudada | 4 |
| 32 | `efeito cascata` | 31,92 | pilha | a torre de fichas balança e escorre um pouco, como cascata; plaquinha "IMPOSTO SOBRE IMPOSTO" | 4 |

### MAPA A2: GUERRA FISCAL (32,88 a 36,92)
| 33 | `E estados` | 32,88 | MAPA A | volta o mapa (whoosh); pílula: GUERRA FISCAL | A |
| 34 | `dão desconto` | 33,58 | mapa | dois estados vizinhos (ilustração genérica) ganham etiquetas "-%" | A |
| 35 | `roubar fábrica` | 34,22 | mapa | um ícone de fábrica pula de um estado para o outro (arco) | A |
| 36 | `guerra fiscal` | 35,78 | mapa | etiqueta GUERRA FISCAL; as divisas dos dois pulsam suave | A |

### Cena 5: A HISTÓRIA (36,92 a 48,66)
| 37 | `três décadas` | 37,42 | Congresso | sai o mapa; câmera vai ao fundo; o Congresso acende; chip "+ DE 30 ANOS" | 5 |
| 38 | `tentativas` | 38,42 | papéis | 4 propostas (`Documento`) entram pela porta ★ | 5 |
| 39 | `morreram` | 39,22 | papéis | as 4 apagam e caem numa gaveta "ARQUIVADO" ★ | 5 |
| 40 | `2023` | 40,76 | chip | chip "2023" | 5 |
| 41 | `Câmara` | 42,38 | Congresso | a cúpula da Câmara acende | 5 |
| 42 | `Senado` | 42,98 | Congresso | a cuia do Senado acende | 5 |
| 43 | `entrou na Constituição` | 43,58 | `LivroLei` | o livro CONSTITUIÇÃO abre e ganha uma página verde; selo S1 | 5 |
| 44 | `regras` | 45,10 | livros | dois livrinhos nascem ao lado | 5 |
| 45 | `2025` | 46,24 | livro 1 | etiqueta "LEI DOS NOVOS IMPOSTOS"; selo S2 | 5 |
| 46 | `2026.` | 47,42 | livro 2 | etiqueta "LEI DO COMITÊ GESTOR"; selo S3 | 5 |

### Cena 6: COMO FICA (48,66 a 62,98)
| 47 | `como fica` | 48,66 | 3D | câmera volta aos três donos; pílula: COMO FICA | 6 |
| 48 | `Os cinco` | 50,22 | fichas | as 5 fichas cinza se juntam no meio da maquete | 6 |
| 49 | `um imposto só` | 51,06 | bloco | as 5 viram um bloco só, verde, "IVA" | 6 |
| 50 | `dividido em dois` | 51,86 | bloco | o bloco se parte em dois: CBS e IBS | 6 |
| 51 | `CBS` | 53,10 | CBS | metade CBS ganha o nome | 6 |
| 52 | `da União` | 53,80 | CBS | a CBS voa para a União; o prédio acende verde | 6 |
| 53 | `PIS e Cofins` | 54,88 | fichas | as fichas PIS e COFINS do teto da União apagam (cinza → some) | 6 |
| 54 | `IBS` | 56,14 | IBS | metade IBS ganha o nome | 6 |
| 55 | `estados e cidades juntos` | 56,90 | IBS | o IBS se estica entre ESTADO e PREFEITURA, uma ponte entre os dois ★ | 6 |
| 56 | `ICMS` | 58,86 | ficha | a ficha ICMS do Estado apaga | 6 |
| 57 | `ISS` | 59,82 | ficha | a ficha ISS da prefeitura apaga | 6 |
| 58 | `IPI zera` | 60,86 | ficha | a ficha IPI vira "0%" | 6 |
| 59 | `Zona Franca` | 62,22 | plaquinha | plaquinha "MENOS NA ZONA FRANCA DE MANAUS" presa na ficha | 6 |

### Cena 7: O PÃOZINHO DE NOVO (62,98 a 70,46)
| 60 | `pãozinho?` | 63,22 | rua | câmera desce de volta à rua; pílula: SEM CASCATA | 7 |
| 61 | `Cada etapa` | 63,92 | etapas | campo, moinho e padaria acendem | 7 |
| 62 | `acrescentou` | 65,40 | fatias | em cada etapa, só uma fatia nova de valor acende (cubo fatiado, `CuboFatias`) | 7 |
| 63 | `desconta` | 66,18 | seta | seta verde de volta: "DESCONTA O QUE JÁ VEIO PAGO" | 7 |
| 64 | `uma vez só` | 68,60 | fichas | a torre de fichas da cascata desmonta e vira uma camada só | 7 |
| 65 | `sem cascata` | 69,48 | plaquinha | plaquinha "COBRADO UMA VEZ SÓ"; ding | 7 |

### Cena 8: QUEM MANDA EM QUÊ (70,46 a 80,58)
| 66 | `quem manda` | 70,58 | 3D | câmera sobe para o ESTADO e a PREFEITURA; pílula: QUEM MANDA | 8 |
| 67 | `Cada estado` | 71,70 | dial | botão de girar "%" na fachada do Estado | 8 |
| 68 | `cada cidade` | 72,38 | dial | botão "%" na fachada da prefeitura | 8 |
| 69 | `percentual` | 73,42 | dials | os dois giram para lados diferentes ★ | 8 |
| 70 | `a lei é uma só` | 74,46 | livro | um livro só "LEI NACIONAL" cobre os dois prédios por cima | 8 |
| 71 | `dinheiro` | 75,68 | moedas | moedas verdes saem da rua | 8 |
| 72 | `caixa único` | 76,32 | cofre | o cofre COMITÊ GESTOR nasce no meio | 8 |
| 73 | `Comitê Gestor` | 77,34 | cofre | letreiro acende; as moedas entram no cofre | 8 |
| 74 | `estados e municípios` | 78,36 | cofre | duas bandeirinhas no cofre: ESTADOS · MUNICÍPIOS | 8 |
| 75 | `reparte` | 79,58 | canos | dois canos ligam o cofre ao Estado e à prefeitura; moedas correm | 8 |
| 76 | `bolo` | 80,06 | cofre | uma pizza de fatias em cima do cofre se divide ★ | 8 |

### MAPA B: A GRANDE VIRADA (80,58 a 101,96)
| 77 | `Agora repara` | 80,58 | MAPA B | entra o mapa (whoosh); pílula: A GRANDE VIRADA | B |
| 78 | `fica onde você compra` | 82,88 | mapa | um carrinho de compras acende num estado (ilustração) | B |
| 79 | `não onde a fábrica está` | 84,18 | mapa | uma fábrica em outro estado fica cinza | B |
| 80 | `São Paulo` | 85,98 | mapa | SP acende com ícone de fábrica | B |
| 81 | `Bahia?` | 86,92 | mapa | BA acende com o carrinho | B |
| 82 | `vai para a Bahia` | 87,96 | mapa | uma moeda verde sai de SP e voa até a BA; etiqueta "IMPOSTO FICA NO DESTINO" | B |
| 83 | `perde o sentido` | 89,74 | mapa | as etiquetas "-%" do MAPA A2 aparecem e apagam ★ | B |
| 84 | `nenhum estado quebrar` | 91,12 | mapa | todos os estados acendem em cinza, firmes | B |
| 85 | `devagar` | 93,26 | barra | barra de transição no topo do mapa: "ARRECADAÇÃO ANTIGA" (cinza) x "DESTINO" (verde) | B |
| 86 | `até 2077` | 93,98 | barra | a barra anda de 2029 a 2077, o verde cresce; selo S4 | B |
| 87 | `arrecadação antiga` | 96,88 | barra | plaquinha "ATÉ 2077, PARTE AINDA SEGUE O SISTEMA ANTIGO" | B |
| 88 | `União põe` | 98,16 | mapa | moedas caem sobre todos os estados | B |
| 89 | `fundo regional` | 99,04 | mapa | etiqueta FUNDO REGIONAL | B |
| 90 | `R$ 60 bilhões` | 99,80 | mapa | etiqueta "ATÉ R$ 60 BI POR ANO" | B |

### Cena 9: O QUE CONTINUA (101,96 a 112,82)
| 91 | `continua igual` | 102,16 | 3D | sai o mapa; câmera na frente de ESTADO e PREFEITURA; pílula: O QUE CONTINUA | 9 |
| 92 | `IPVA` | 103,10 | carro | `Carro` nasce na frente do Estado, plaquinha IPVA | 9 |
| 93 | `IPTU` | 103,86 | casinha | `Casinha` na frente da prefeitura, plaquinha IPTU | 9 |
| 94 | `ITBI` | 104,62 | chave | `Chave` na frente da prefeitura, plaquinha ITBI (compra de imóvel) | 9 |
| 95 | `herança` | 105,94 | documento | `Documento` "HERANÇA" na frente do Estado | 9 |
| 96 | `seguem com estados e cidades` | 106,28 | prédios | os dois prédios acendem juntos | 9 |
| 97 | `jatinho` | 109,28 | jatinho | `Jatinho` pousa ao lado do carro, plaquinha "IPVA PODE PEGAR" | 9 |
| 98 | `lancha` | 109,90 | lancha | a lancha desliza ao lado | 9 |
| 99 | `herança paga mais` | 110,60 | degraus | 3 pilhas de moedas em escada: herança pequena, média, grande; a fatia de imposto cresce em cada uma | 9 |
| 100 | `maior o valor` | 111,70 | plaquinha | plaquinha "QUANTO MAIOR, MAIOR O PERCENTUAL" | 9 |

### Cena 10: O CALENDÁRIO (112,82 a 154,28)
| 101 | `calendário` | 113,40 | estrada | câmera desce para a frente da maquete; a estrada do tempo se desenha; pílula: O CALENDÁRIO | 10 |
| 102 | `quatro datas` | 114,22 | marcos | 4 marcos sobem: 2026 · 2027 · 2029-32 · 2033 | 10 |
| 103 | `Um:` | 115,28 | marco 1 | o marco 2026 acende; a cabeça da linha anda até ele | 10 |
| 104 | `hoje` | 116,96 | marco 1 | plaquinha "HOJE" ★ | 10 |
| 105 | `Ano de teste` | 117,54 | carimbo | carimbo "TESTE" ao lado do marco | 10 |
| 106 | `nota` | 118,58 | nota | `NotaFiscal` desenrola | 10 |
| 107 | `0,9%` | 119,54 | nota | linha "CBS 0,9%" | 10 |
| 108 | `0,1%` | 121,46 | nota | linha "IBS 0,1%" | 10 |
| 109 | `não paga` | 124,52 | nota | plaquinha "QUEM CUMPRE AS REGRAS NÃO PAGA" | 10 |
| 110 | `Dois:` | 125,38 | marco 2 | marco 2027 acende; cabeça anda | 10 |
| 111 | `vale de verdade` | 127,84 | bloco CBS | o bloco verde CBS cresce ao lado do marco | 10 |
| 112 | `PIS e Cofins acabam` | 129,32 | fichas | fichas cinza PIS e COFINS caem e somem | 10 |
| 113 | `TCU calculou` | 130,96 | chip | chip "TCU"; selo S5 | 10 |
| 114 | `11,3%` | 131,80 | bloco | plaquinha "CBS 2027: 11,3%" no bloco | 10 |
| 115 | `Senado ainda confirma` | 133,56 | plaquinha | plaquinha "SENADO CONFIRMA" com reticências | 10 |
| 116 | `Imposto Seletivo` | 135,44 | ficha | ficha nova "SELETIVO" | 10 |
| 117 | `saúde` | 137,40 | ícone | coração ★ ao lado da ficha | 10 |
| 118 | `meio ambiente` | 138,10 | ícone | árvore ★ ao lado | 10 |
| 119 | `cigarro` | 138,92 | maço | `MacoCigarro` genérico | 10 |
| 120 | `bebida` | 139,54 | garrafa | `Garrafa` genérica | 10 |
| 121 | `Três:` | 140,20 | marco 3 | marco 2029-32 acende; cabeça anda | 10 |
| 122 | `2029` | 140,92 | barras | `BarrasDuplas`: ICMS e ISS (cinza) altas, IBS (verde) baixa | 10 |
| 123 | `diminuem` | 145,02 | barras | as cinzas descem em 4 degraus: 9/10, 8/10, 7/10, 6/10 | 10 |
| 124 | `IBS cresce` | 147,70 | barras | a verde sobe no mesmo ritmo | 10 |
| 125 | `Quatro:` | 148,98 | marco 4 | marco 2033 acende; cabeça chega ao fim | 10 |
| 126 | `deixam de existir` | 152,56 | barras | as cinzas somem; só a verde fica; carimbo "FIM DO ICMS E DO ISS"; ding | 10 |

### Cena 11: NO SEU BOLSO (154,28 a 164,88)
| 127 | `seu bolso?` | 154,58 | você | câmera encontra o boneco "você"; pílula: NO SEU BOLSO | 11 |
| 128 | `Cesta básica` | 155,40 | cesta | `Cesta` com pão, arroz e feijão genéricos | 11 |
| 129 | `imposto zero` | 156,64 | cesta | plaquinha "IMPOSTO ZERO" | 11 |
| 130 | `baixa renda` | 158,26 | família | família `Pessoas` ao lado | 11 |
| 131 | `de volta` | 160,74 | moedas | moedas voltam em arco para a família; plaquinha "CASHBACK · CADÚNICO" | 11 |
| 132 | `separado na nota` | 162,22 | nota | a nota fiscal destaca a linha do imposto (`separa`) | 11 |
| 133 | `enxerga` | 163,66 | lupa | `Lupa` passa sobre a linha | 11 |

### Cena 12: O TETO (164,88 a 175,92)
| 134 | `atenção` | 165,36 | medidor | `Medidor` nasce; pílula: O TETO | 12 |
| 135 | `teto` | 166,70 | linha | linha de limite no medidor | 12 |
| 136 | `26,5%` | 167,08 | linha | plaquinha "TETO 26,5%" | 12 |
| 137 | `os dois juntos` | 169,04 | blocos | blocos CBS e IBS se empilham no medidor | 12 |
| 138 | `estimativa` | 170,02 | ponteiro | o ponteiro sobe; selo S6 | 12 |
| 139 | `quase 28%` | 171,58 | ponteiro | o ponteiro passa um pouco do teto: plaquinha "QUASE 28% (ESTIMATIVA)" | 12 |
| 140 | `propor ajuste` | 174,90 | plaquinha | plaquinha "GOVERNO TERÁ QUE PROPOR AJUSTE" | 12 |

### Cena 13: E AÍ? (175,92 a 186,52)
| 141 | `sua conta` | 176,98 | balança | `Balanca` com um carrinho em cada prato, equilibrada; pílula: E AÍ? | 13 |
| 142 | `leve` | 177,90 | balança | etiqueta MAIS LEVE no prato esquerdo | 13 |
| 143 | `pesada` | 178,70 | balança | etiqueta MAIS PESADA no prato direito (a balança não pende) | 13 |
| 144 | `comentários` | 179,84 | chip | chip "ME CONTA NOS COMENTÁRIOS" | 13 |
| 145 | `segue` | 180,78 | cartão | cartão "SEGUE @eumagnoleite" no fim (como no 018) | 13 |

---

## 2.4 Cenas com câmera

A câmera usa o enquadramento automático da base. Nunca fica parada.

### CENA 1: A TROCA (0,00 a 5,66) · eventos 1 a 5
- 1a (0 a 3,2): close na etiqueta, alvo [0, 3, 6] · tamanho 6 · ângulo 15° · avanço lento.
- 1b (3,2 a 5,66): arco de 20° para a direita enquanto as fichas viram CBS e IBS.
- Pílula: A TROCA · Aha: "o imposto está escondido no preço e vai mudar".

### CENA 2: O PÃOZINHO (5,66 a 12,22) · eventos 6 a 12
- 2a: da porta da casa [6, 1, 4], recua em grua até mostrar a rua inteira (x -11 a 9), ângulo 35°.
- 2b: travelling da direita para a esquerda acompanhando trigo → moinho → padaria (um sentido só).
- Pílula: O PÃOZINHO · Aha: "cada etapa tem imposto".

### CENA 3: OS TRÊS DONOS (12,22 a 22,32) · eventos 13 a 22
- 3a: grua subindo da rua para ver a rua e os três prédios atrás, alvo [0, 2, -1] · ângulo 45°.
- 3b: arco lento da esquerda (União) para a direita (prefeitura), na ordem da fala.
- Pílula: OS TRÊS DONOS · Aha: "cada dono tem seus impostos".

### MAPA A1 e A2 (22,32 a 27,26 e 32,88 a 36,92)
- No Kit Mapas: Brasil inteiro, câmera girando devagar (A1); aproximação em dois estados do Sudeste/Centro-Oeste genéricos (A2), sem nomear.

### CENA 4: A CASCATA (27,26 a 32,88) · eventos 28 a 32
- close na padaria [1, 2, 4] · tamanho 4 · ângulo 25°, avanço lento até a torre de fichas.
- Pílula: A CASCATA · Aha: "imposto sobre imposto".

### CENA 5: A HISTÓRIA (36,92 a 48,66) · eventos 37 a 46
- 5a: a câmera passa por cima dos prédios e chega ao Congresso no fundo [0, 3, -14], ângulo 25°.
- 5b: avanço até o livro da Constituição e os dois livrinhos.
- Pílula: A HISTÓRIA · Aha: "décadas de tentativa; em 2023 passou".

### CENA 6: COMO FICA (48,66 a 62,98) · eventos 47 a 59
- volta em arco sobre a maquete: alvo [0, 3, -4] · ângulo 40°; arco da esquerda para a direita (União → Estado → prefeitura).
- Pílula: COMO FICA · Aha: "5 viram 2: CBS da União e IBS de estados e cidades".

### CENA 7: SEM CASCATA (62,98 a 70,46) · eventos 60 a 65
- desce para a rua na mesma altura da cena 2, agora da esquerda para a direita.
- Pílula: SEM CASCATA · Aha: "cada um paga só o que acrescentou".

### CENA 8: QUEM MANDA (70,46 a 80,58) · eventos 66 a 76
- grua subindo do cofre para mostrar cofre + Estado + prefeitura, alvo [3, 2, -4] · ângulo 50°.
- Pílula: QUEM MANDA · Aha: "o percentual é de cada um, a lei é uma só, o caixa é único".

### MAPA B (80,58 a 101,96)
- Brasil inteiro; aproxima no eixo SP → BA na viagem da moeda; afasta para o país inteiro na barra de 2077 e no fundo regional.

### CENA 9: O QUE CONTINUA (101,96 a 112,82) · eventos 91 a 100
- avanço baixo na frente de Estado e prefeitura, alvo [3, 1, -3] · ângulo 20° · arco curto.
- Pílula: O QUE CONTINUA · Aha: "IPVA, IPTU, ITBI e herança ficam".

### CENA 10: O CALENDÁRIO (112,82 a 154,28) · eventos 101 a 126
- a câmera desce para a estrada do tempo e anda da esquerda para a direita, um marco por vez (travelling contínuo, sem voltar), ângulo 30°.
- Pílula: O CALENDÁRIO · Aha: "2026 testa, 2027 começa a CBS, 2029 a 2032 troca devagar, 2033 acabou".

### CENA 11: NO SEU BOLSO (154,28 a 164,88) · eventos 127 a 133
- continua o travelling até o fim da estrada, onde está o "você" com a cesta, a família e a nota.
- Pílula: NO SEU BOLSO.

### CENA 12: O TETO (164,88 a 175,92) · eventos 134 a 140
- close no medidor, subindo junto com o ponteiro.
- Pílula: O TETO · Aha: "a lei põe um limite, e a estimativa está um pouco acima".

### CENA 13: E AÍ? (175,92 a 186,52) · eventos 141 a 145
- recua devagar até mostrar a maquete inteira, com a balança na frente.
- Pílula: E AÍ?

---

## 2.5 Fatos e fontes (resumo do `audio/fontes.md`)

Na tela, os números vão escritos como na fala: 1988 · 27 leis · 5.570 leis · + de 30 anos · 2023 · R$ 60 bi por ano · 2077 · 0,9% · 0,1% · 11,3% · 26,5% · quase 28%. "27 leis" e "5.570" são conta própria (26 estados + DF; municípios do IBGE). O exemplo SP → BA, a fábrica pulando de estado e as etiquetas "-%" são **ilustração**, sem dado real, e ficam marcados assim no `fontes.md`.

**Conferir antes de publicar:** se o Senado já fixou a CBS de 2027 (se sim, trocar a plaquinha "SENADO CONFIRMA"); os valores do fundo regional no texto do DOU; qualquer adiamento do Comitê Gestor.

## 2.6 Trilha e sons

- `whoosh`: entrada e saída dos mapas e trocas de cena.
- `tique`: cada troca de pílula.
- `pop`: fichas, prédios, objetos e plaquinhas.
- `baque`: fichas apagando (PIS/Cofins/ICMS/ISS) e propostas arquivadas.
- `ding`: "sem cascata", "deixam de existir".
- `subida`: contadores 27 e 5.570, barra até 2077, ponteiro do medidor.
- `impacto`: carimbos TESTE e FIM.
- Sem trilha de fundo (o Estúdio não traz música).

## 2.7 Arquivos

- **Novos:** `src/videos/reformatrib/ReformaTrib.tsx`, `src/videos/reformatrib/pecas.tsx` (peças novas: `Trigo` campo de espigas; `Moinho` com pás; `CofreComite` cofre com letreiro e bandeirinhas; `Lancha`; `Dial` botão de percentual na fachada; `TorreFichas` pilha que balança), `palavras.ts` (pronto).
- **Kit Mapas:** `~/Kit-Mapas-Animados/src/videos/reforma-tributaria/` → `projetos/050. reforma tributária/mapas/reforma.mp4` (trechos A1, A2 e B, sem legenda, marca nem som).
- **Alterados:** `src/Root.tsx` (só acrescentar `ReformaTrib`, `ReformaTribGuia`, `ReformaTribLimpo`, `CapaReformaTrib`); `Root.tsx` do Kit Mapas (só acrescentar).
- **Reaproveitados:** `EtiquetaPreco`, `PacoteImposto`, `SetasTroca`, `Ficha`, `SetaArco`, `Campo`, `Lojinha`, `Casa`, `Casinha`, `Pessoa`, `Pessoas`, `Ruazinha`, `OrgaoPublico`, `Congresso`, `Documento`, `LivroLei`, `CuboFatias`, `CanoMoedas`, `MoedaPilha`, `Carro`, `Chave`, `Jatinho`, `LinhaTempo`, `MarcoAno`, `NotaFiscal`, `MacoCigarro`, `Garrafa`, `BarrasDuplas`, `Cesta`, `Lupa`, `Medidor`, `LinhaLimite`, `Balanca`, `Carrinho`; `MarcaDagua` quicando copiada do 035.
- 5.596 quadros; render em partes pelo `render.mjs`, com a trava `projetos/_render.lock` (um render pesado por vez).

## 2.8 Origem das escolhas

- **Das regras:** plaquinhas pequenas presas aos objetos, nunca cartão grande (feedback do Belmonte); marca d'água quicando; os objetos que nascem ficam na maquete até o fim e só acendem de novo (o pãozinho volta na cena 7, os prédios ficam); câmera num sentido só, sem vai-e-volta; Kit Mapas encaixado num MP4 só (018); selos de fonte na faixa A, longe das etiquetas do mapa (013); sem logo nem marca (cigarro e bebida genéricos); neutralidade (balança equilibrada no fim); sem flash (tudo acende em 0,4 s ou mais).
- **Escolhas minhas como diretor:** o mundo da rua do pãozinho (o mesmo exemplo do roteiro vira o cenário); cinza para imposto velho e verde para o novo; a estrada do tempo na frente da maquete para o calendário; os extras ★.

## Ajustes feitos na programação (07/11/2026)
- Congresso, propostas, Constituição e as duas leis foram para o lado esquerdo da maquete (x ≈ -17 a -11), menores: no fundo, atrás dos prédios, tapavam e dominavam as outras cenas.
- Câmeras mais perto em quase todas as cenas (o formato vertical deixava tudo miniatura); calendário com a câmera parada em cada data; cofre e herança filmados mais de cima (a padaria tapava).
- Fichas de imposto maiores nos telhados e no IVA/CBS/IBS; etiqueta do gancho maior; herança na frente do Estado, longe do letreiro do Comitê Gestor.
- Plaquinhas do 3D feitas como rótulos 2D presos aos objetos (como no 018), não placas 3D.
