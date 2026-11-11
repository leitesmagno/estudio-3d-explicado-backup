# Plano de cenas: 013. voto distrital misto (versão 1, aprovada em 02/11/2026)

Código `distritalmisto` · Nome `DistritalMisto` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo feito com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **dois trechos de mapa** gerados no Kit Mapas Animados (satélite da Bahia).

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Roger (ElevenLabs v4) · preparo: pausas de no máximo 0,35 s, 1,2x, volume -15 · duração **124,23 s** · `AUDIO_SEG = 124.23` · `QUADROS = 3754` (com 0,9 s de folga). Mais longo que a faixa de 55 a 95 s, de propósito: a pessoa pediu um roteiro mais didático.
- 388 palavras; a última ("informações.") termina em 123,84 s. Tempos sempre sobem, sem buraco maior que 1,5 s. Áudio completo (o final foi conferido).
- Ajuste: "arroba EuMagnoleite" → `@eumagnoleite`. Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo):

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| Câmara | 3,24 · 5,48 · 113,32 | `quando('a Camara quer')` · `quando('presidente da Camara')` · `quando('votos na Camara')` |
| PEC | 8,42 · 96,70 · 111,34 | `quando('uma PEC')` · `quando('votar a PEC')` · `quando('a PEC precisa')` |
| estado | 14,54 · 21,52 · 69,20 | `quando('o estado inteiro')` · `quando('no estado todo')` · `quando('o estado e cortado')` |
| Bahia | 16,56 · 77,98 | `quando('Na Bahia, por')` · `quando('Na Bahia, metade')` |
| 39 | 17,68 · 79,00 | `quando('sao 39')` · `quando('metade de 39')` |
| 300 mil | 33,40 · 41,28 | `quando('somou 300')` · `quando('fez 300')` |
| 3 cadeiras | 35,06 · 43,68 | `quando('leva 3')` · `quando('garante as 3')` |
| puxador | 47,78 · 75,32 | `quando('o puxador')` · `quando('Sem puxador')` |
| metade | 76,58 · 78,46 · 84,98 | `quando('preenche metade')` · `quando('metade de 39')` · `quando('outra metade')` |
| 2026 | 56,48 · 97,34 | `quando('deputados em 2026')` · `quando('ainda em 2026')` |
| distrital misto | 65,52 · 100,72 | `quando('o voto distrital')` · `quando('usar o distrital')` |
| partido(s) | várias | sempre com trecho longo (`'ganha a vaga primeiro'`, `'voto, no partido'`, `'dos partidos.'`, `'cada partido preenche'`) |
| você | 0,00 · 70,90 · 82,40 · 106,30 · 117,30 | `quando('Voce votou')` · `quando('Voce vota num')` · `quando('voce da um')` · `quando('perto de voce')` · `quando('Voce prefere')` |

## 2.2 Ideia e mundo

**A metáfora: o "plenário de brinquedo" e o mapa de verdade.** O Estúdio 3D cuida da **regra** (as contas, as cadeiras, o puxador, as duas urnas, a lista, o calendário e os 308 votos), num mundo só: o **plenário da Câmara em miniatura**, um semicírculo de cadeiras, com uma "loja de cadeiras" na frente onde cada cadeira tem **preço em votos**. O Kit Mapas cuida do **território**: a Bahia de verdade, vista do satélite, primeiro como **um campo só** (como é hoje) e depois **cortada em cerca de 20 distritos** (como querem).

**Os dois trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: "HOJE"** | de `Hoje, o estado` (13,90) até `E quem ganha` (22,34) | 8,4 s | Voo do Brasil até a Bahia; o estado acende inteiro, com a bandeira dentro do contorno; "39 VAGAS" digita no centro; em "todo candidato pode pedir voto no estado todo", pinos de campanha caem espalhados do Oeste ao litoral, em cidades longe umas das outras (Barreiras, Juazeiro, Vitória da Conquista, Feira de Santana, Salvador, Ilhéus) |
| **MAPA 2: "OS DISTRITOS"** | de `Primeira parte` (68,20) até `Segunda parte` (81,58) | 13,4 s | A Bahia volta; em "cortado em distritos" as linhas dos distritos se desenham (uns 20 pedaços de cores claras, com o selo DISTRITOS ILUSTRATIVOS); em "seu distrito" a câmera mergulha até o distrito de Ilhéus, que acende em verde; em "quem tiver mais votos ali leva a vaga" três tags de candidatos genéricos aparecem no distrito e a do mais votado ganha o selo ELEITO; em "Sem puxador" as outras apagam; em "metade de 39" a câmera recua e o número "20 DISTRITOS" digita |

- Os distritos são **ilustrativos**: municípios do IBGE agrupados em cerca de 20 blocos vizinhos com população parecida (conta feita por script). O desenho real ainda não existe.
- Os trechos são gerados **sem legenda e sem marca d'água** (a legenda, a pílula e a marca vêm do vídeo 3D, por cima), em 1080 × 1920, e encaixados no 3D com a mesma entrada e saída de cena (borrão curto e whoosh).

**Protagonista:** "você", um boneco em `tema.corpo` com um papelzinho de voto na mão, que abre o vídeo, vota na urna e reaparece nas duas urnas do distrital misto.

**Selos de fonte:**

| Selo | Entra em | Texto |
|---|---|---|
| A PEC | `uma PEC` (8,42) | CONGRESSO EM FOCO E METRÓPOLES · 28 E 31/10/2026 |
| As 39 vagas | no MAPA 1 | BAHIA · 39 DEPUTADOS FEDERAIS |
| A conta | `Imagina` (29,60) | EXEMPLO COM NÚMEROS REDONDOS · REGRA DO TSE |
| Os puxadores | `Segundo o Correio` (49,14) | SEGUNDO O CORREIO BRAZILIENSE · 02/11/2026 |
| O PL | `O PL fez` (57,22) | RESULTADO DAS ELEIÇÕES DE 2026 |
| Os distritos | no MAPA 2 | DISTRITOS ILUSTRATIVOS · O DESENHO REAL AINDA NÃO EXISTE |
| O quórum | `308` (112,04) | CONSTITUIÇÃO · ART. 60 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo, chão | `tema.fundo`, `tema.chao` |
| Cadeiras do plenário | `tema.objetoEscuro`; acendem em `tema.acento` quando são "ganhas" ou votam |
| Votos (cédulas e pilhas) | `tema.objetoClaro` |
| Protagonista | `tema.corpo` |
| Deputados, candidatos, puxadores | `tema.pessoa` (todos iguais, sem rosto, sem cor de partido) |
| Partidos do exemplo | **Partido A** e **Partido B**, em dois tons neutros da paleta de apoio (`festa.azul` e `festa.dourado`), sem sigla real |
| O que muda com a proposta (distrito, segunda urna, lista) | `tema.acento` |

**Mapa do mundo 3D** (1 unidade = 1 m; chão em y = 0; frente em z+):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Plenário em semicírculo (`Plenario`, catálogo) | centro [0, 0, −6], escala para 513 lugares | acende em onda; na cena final, 308 cadeiras acendem |
| Prédio do Congresso (`Congresso`, catálogo) | [0, 0, −14] | no fundo, do começo ao fim |
| Urna (`Urna`, catálogo) + protagonista | [0, 0, 3] | o voto entra; dois votos na cena do distrital misto |
| "Loja de cadeiras" (`Cadeira` × 3 com `EtiquetaPreco`, catálogo) | [−3 a 3, 0, 0] | cada cadeira com a etiqueta "100 MIL VOTOS" |
| Pilhas de votos (`PilhaVotos`, peça nova: blocos de cédulas) | ao lado das cadeiras | a pilha do Partido A cresce até 300 mil e se divide em 3 de 100 mil |
| Fila do partido (`Boneco` × 5, etiquetas 1º a 5º) | [−4, 0, 2] | os 3 mais votados sobem nas cadeiras |
| O puxador (`Boneco` grande, escala 1,2) + 2 colegas pequenos e uma corda (`Corda`, peça nova) | [2, 0, 2] | ele "puxa" os dois até as cadeiras |
| Três puxadores com etiqueta (NIKOLAS FERREIRA, LUCAS PAVANATO, ERIKA HILTON) + 23 bonecos pequenos | [0, 0, 1] | todos em `tema.pessoa`; os 23 sobem para o plenário em fila |
| Barras das bancadas (`Barras`, base) | [5, 0, −2] | PL subindo até 121; o bloco do Centrão diminuindo (sem número, como no roteiro) |
| Duas urnas lado a lado: DISTRITO e PARTIDO (`Urna` × 2 com placas) | [−1,2 e 1,2, 0, 3] | o protagonista vota duas vezes |
| Lista do partido (`ListaLei`, do 011) | [3, 0, 1] | "1º · 2º · 3º · 4º", com a ordem já definida; as linhas descem para as cadeiras |
| Placas FEDERAL / ESTADUAL / VEREADOR (`PlacaChao`, do 011) | [−3 a 3, 0, 4] | |
| Linha do tempo 2026 → 2030 → 2034 (`PlacaChao` × 3 e uma trilha) | [−3 a 3, 0, 5] | 2034 acende em verde |
| Balança (`Balanca`, catálogo) | [0, 0, 2] | prato "MAIS BARATA, MAIS PERTO" × prato "PODER DA CÚPULA"; fica no meio |
| Contador 308 / 513 e 49 / 81 (2D) | tela | o plenário acende 308 cadeiras |
| Documento PEC (`FolhaCarimbo`, do 011) | [0, 0, 2] | carimbo AINDA NÃO APRESENTADA em cinza |

**Regras visuais:**
- Nenhum boneco com rosto. Os puxadores são bonecos genéricos com etiqueta de nome, todos da mesma cor; Hugo Motta só como etiqueta no prédio do Congresso ("PRESIDENTE DA CÂMARA").
- Nada de cor ou sigla de partido real: o exemplo usa "PARTIDO A" e "PARTIDO B".
- Verde só no que muda com a proposta.
- Toda conta de exemplo leva o selo EXEMPLO.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Voce votou` | 0,00 | Protagonista + urna | Ele põe o voto na urna (pop) | 1 |
| 2 | `num deputado` | 0,72 | Cédula | Etiqueta CANDIDATO X no voto | 1 |
| 3 | `eleito outro` | 1,78 | Seta | O voto sai da urna e acende OUTRO boneco no plenário ★ | 1 |
| 4 | `a Camara quer` | 3,24 | Congresso | Prédio acende ao fundo | 1 |
| 5 | `mudar essa regra` | 3,64 | Chip | VAI MUDAR? | 1 |
| 6 | `presidente da Camara` | 4,92 | Etiqueta | PRESIDENTE DA CÂMARA · HUGO MOTTA no prédio | 2 |
| 7 | `partidos do Centrao` | 6,72 | Etiqueta | CENTRÃO | 2 |
| 8 | `uma PEC` | 8,42 | Documento | Folha PEC sobe; selo das fontes | 2 |
| 9 | `Entao vamos entender` | 10,88 | Divisão da tela | Duas placas: HOJE · COMO QUEREM | 2 |
| 10 | `Hoje, o estado` | 13,90 | **MAPA 1** | Trecho do Kit Mapas (Bahia inteira, 39 VAGAS, pinos pelo estado) | M1 |
| 11 | `E quem ganha` | 22,34 | Câmera | Volta ao 3D: a "loja de cadeiras" | 3 |
| 12 | `o partido` | 23,82 | Placa | PARTIDO A acende | 3 |
| 13 | `soma todos os votos` | 25,36 | Pilha | Cédulas caem numa pilha só | 3 |
| 14 | `divide pelas vagas` | 27,04 | Pilha | A pilha se divide em fatias iguais ★ | 3 |
| 15 | `o preco de uma cadeira` | 28,80 | Etiqueta | PREÇO DE UMA CADEIRA aparece nas cadeiras | 3 |
| 16 | `Imagina` | 29,60 | Selo | EXEMPLO | 3 |
| 17 | `100 mil votos` | 31,44 | Etiquetas | 100 MIL VOTOS em cada cadeira (pop) | 3 |
| 18 | `somou 300` | 33,40 | Pilha do Partido A | Cresce até 300 MIL (subida) | 3 |
| 19 | `leva 3` | 35,06 | Cadeiras | 3 cadeiras acendem em verde, uma a uma | 3 |
| 20 | `os 3 candidatos` | 36,68 | Fila | Os 3 primeiros da fila do partido sobem nas cadeiras | 3 |
| 21 | `Agora repara` | 39,04 | Câmera | Aproxima | 4 |
| 22 | `unico candidato` | 40,28 | Puxador | Um boneco maior se destaca da fila | 4 |
| 23 | `fez 300` | 41,28 | Pilha | Toda a pilha de 300 MIL vai para ele | 4 |
| 24 | `garante as 3` | 43,50 | Cadeiras | As 3 cadeiras acendem | 4 |
| 25 | `leva junto dois` | 44,72 | Corda | A corda se estica; ele puxa 2 colegas pequenos (com etiqueta "POUCOS VOTOS") até as cadeiras | 4 |
| 26 | `o puxador` | 47,78 | Etiqueta | PUXADOR DE VOTOS | 4 |
| 27 | `Segundo o Correio` | 49,14 | Selo | SEGUNDO O CORREIO BRAZILIENSE | 5 |
| 28 | `Nikolas` | 50,70 | Boneco | Etiqueta NIKOLAS FERREIRA | 5 |
| 29 | `Lucas Pavanato` | 51,58 | Boneco | Etiqueta LUCAS PAVANATO | 5 |
| 30 | `Erika Hilton` | 52,56 | Boneco | Etiqueta ERIKA HILTON | 5 |
| 31 | `ajudaram a eleger` | 53,16 | Cordas | Os três puxam uma fila | 5 |
| 32 | `outros 23` | 54,90 | 23 bonecos | Sobem para o plenário em fila; contador + 23 | 5 |
| 33 | `O PL fez` | 57,22 | Barras | Barra do PL nasce | 5 |
| 34 | `121` | 58,50 | Barra | Sobe até 121 (subida); selo do resultado | 5 |
| 35 | `maior bancada` | 60,14 | Barra | Ganha a etiqueta MAIOR BANCADA DESDE 1988 | 5 |
| 36 | `Centrao encolheu` | 63,18 | Barra | A barra CENTRÃO diminui (sem número) | 5 |
| 37 | `o voto distrital` | 65,22 | Placa | VOTO DISTRITAL MISTO acende em verde | 6 |
| 38 | `duas partes` | 67,30 | Placas | PARTE 1 · PARTE 2 | 6 |
| 39 | `Primeira parte` | 68,20 | **MAPA 2** | Trecho do Kit Mapas (distritos ilustrativos, Ilhéus, ELEITO, 20 DISTRITOS) | M2 |
| 40 | `Segunda parte` | 81,58 | Câmera | Volta ao 3D: as duas urnas | 7 |
| 41 | `segundo voto` | 82,92 | Urna PARTIDO | O protagonista vota na segunda urna | 7 |
| 42 | `outra metade` | 84,76 | Plenário | Metade das cadeiras acende em verde claro | 7 |
| 43 | `votos dos partidos` | 86,66 | Plenário | As cadeiras se dividem entre PARTIDO A e PARTIDO B | 7 |
| 44 | `uma lista` | 89,84 | Lista | Sobe com 1º, 2º, 3º, 4º | 7 |
| 45 | `ordem ja definida` | 91,34 | Lista | Cadeado fecha a ordem; os nomes da lista descem para as cadeiras na ordem | 7 |
| 46 | `deputado federal` | 93,36 | Placas | FEDERAL · ESTADUAL · VEREADOR, uma por palavra | 8 |
| 47 | `votar a PEC` | 96,28 | Linha do tempo | 2026 acende | 8 |
| 48 | `transicao em 2030` | 98,76 | Linha do tempo | 2030 acende (TRANSIÇÃO) | 8 |
| 49 | `2034` | 101,58 | Linha do tempo | 2034 acende em verde | 8 |
| 50 | `Quem defende` | 102,78 | Balança | Nasce no meio | 9 |
| 51 | `mais barata` | 104,54 | Prato esquerdo | Moeda menor; etiqueta CAMPANHA MAIS BARATA | 9 |
| 52 | `mais perto` | 105,60 | Prato esquerdo | Etiqueta DEPUTADO MAIS PERTO | 9 |
| 53 | `Quem e contra` | 106,84 | Prato direito | Lista com cadeado; etiqueta PODER DA CÚPULA | 9 |
| 54 | `cupula dos partidos` | 109,12 | Balança | Volta ao meio (os dois lados iguais) | 9 |
| 55 | `Para virar regra` | 110,00 | Plenário | Câmera recua para o plenário inteiro | 10 |
| 56 | `308` | 112,04 | Plenário | 308 de 513 cadeiras acendem (subida); contador 308 / 513 | 10 |
| 57 | `49 no Senado` | 113,84 | Contador | 49 / 81 | 10 |
| 58 | `o texto ainda nem` | 115,40 | Documento | Folha PEC com carimbo AINDA NÃO APRESENTADA (cinza) | 10 |
| 59 | `Voce prefere` | 117,30 | Duas urnas | DISTRITO × PARTIDO, o protagonista no meio olhando as duas ★ | 11 |
| 60 | `comentarios` | 120,72 | Ícone | Balão de comentário verde | 11 |
| 61 | `E segue` | 121,40 | Câmera | Sobe devagar; @eumagnoleite | 11 |

Na programação, cada cena ganha mais eventos (cédulas caindo, cadeiras em onda, os 23 bonecos um a um), como pede a regra do Estúdio.

## 2.4 Cenas com câmera

### CENA 1: VOCÊ VOTOU (0,00 a 4,60 s)
Câmera de cima do plenário descendo até a urna e o protagonista (pos [2, 6, 10] → [1, 2,4, 7] · alvo [0, 1, 3]). Pílula: VOCÊ VOTOU. Aha: "meu voto pode eleger outra pessoa".

### CENA 2: A PROPOSTA (4,70 a 13,80 s)
Recua e mostra o Congresso ao fundo com o documento da PEC na frente (alvo [0, 2, −6] · dist 14). Pílula: A PROPOSTA. Aha: "a Câmara quer mudar a regra".

### MAPA 1: HOJE (13,90 a 22,30 s), Kit Mapas
Voo Brasil → Bahia (borrão radial), estado aceso com a bandeira, "39 VAGAS", pinos pelo estado inteiro. A pílula do 3D muda para HOJE. Aha: "hoje o estado inteiro é uma disputa só".

### CENA 3: O PREÇO DA CADEIRA (22,34 a 38,90 s)
Loja de cadeiras e pilhas de votos, plano médio (alvo [0, 1, 0] · dist 8 · ângulo 22°), com avanço lento até as 3 cadeiras. Pílula: HOJE: O PARTIDO PRIMEIRO. Aha: "cada cadeira custa X votos, e o partido enche as cadeiras com os mais votados".

### CENA 4: O PUXADOR (39,04 a 48,90 s)
Close no puxador e na corda (alvo [2, 1, 2] · dist 5). Pílula: O PUXADOR. Aha: "um campeão de votos leva colegas junto".

### CENA 5: EM 2026 (49,14 a 64,10 s)
Os três puxadores e a fila dos 23 subindo; depois as barras das bancadas (alvo [2, 1,2, −1] · dist 11). Pílula: EM 2026. Aha: "isso mudou o tamanho das bancadas".

### CENA 6: A PROPOSTA (64,24 a 68,10 s)
Placa VOTO DISTRITAL MISTO e as duas partes (alvo [0, 2, 2] · dist 7). Pílula: DISTRITAL MISTO.

### MAPA 2: OS DISTRITOS (68,20 a 81,50 s), Kit Mapas
Bahia cortada em distritos ilustrativos, mergulho em Ilhéus, ELEITO, recuo e 20 DISTRITOS. Pílula: PARTE 1: O DISTRITO. Aha: "metade das vagas sai dos distritos, sem puxador".

### CENA 7: PARTE 2: O PARTIDO (81,58 a 92,50 s)
Duas urnas, depois o plenário dividido e a lista (alvo [0, 1,5, 1] · dist 8). Pílula: PARTE 2: O PARTIDO. Aha: "a outra metade vem do voto no partido, pela lista que ele montou antes".

### CENA 8: QUANDO (92,56 a 102,70 s)
Placas e linha do tempo (alvo [0, 1, 4,5] · dist 8, travelling lateral de 2026 a 2034). Pílula: QUANDO VALE.

### CENA 9: OS DOIS LADOS (102,78 a 109,90 s)
Balança em close (alvo [0, 1,4, 2] · dist 4,5). Pílula: OS DOIS LADOS. Aha: "mais perto e mais barato × mais poder para a cúpula".

### CENA 10: O QUE FALTA (110,00 a 117,20 s)
Plenário inteiro de cima, 308 cadeiras acendendo, depois o documento PEC (alvo [0, 0, −6] · dist 16, ângulo 45°). Pílula: O QUE FALTA.

### CENA 11: E VOCÊ? (117,30 a 125,13 s)
Protagonista entre as duas urnas; grua final mostra plenário, urnas e Congresso. Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 02/11/2026): PEC articulada por Hugo Motta e partidos do Centrão (Congresso em Foco, Metrópoles, Correio Braziliense); sistema proporcional e quocientes (TSE), com a conta de exemplo e o selo EXEMPLO; 23 eleitos com os puxadores (Correio Braziliense, fonte única, citado na fala); PL com 121 (Correio da Manhã); Centrão menor (sem número); distrital misto meio a meio com dois votos e lista ordenada (Correio e Metrópoles); vale para federal, estadual e vereador (Congresso em Foco); 2026 / 2030 / 2034 (Motta); 308 e 49 em dois turnos (Constituição, art. 60); texto ainda não apresentado. Bahia com 39 vagas (Bahia Notícias, Congresso em Foco); 20 distritos é conta própria (39 ÷ 2).

**Conferir antes de publicar:** se a PEC foi apresentada e se o desenho mudou; se a votação foi marcada.

## 2.6 Trilha e sons

Sem trilha. Efeitos do Estúdio: `whoosh` nas trocas de cena e nas entradas e saídas dos mapas; `tique` na pílula; `pop` em cédulas, cadeiras, etiquetas e placas; `subida` em 300 mil, 121 e 308; `baque` na corda do puxador se esticando; `ding` em 2034 e no ELEITO; `impacto` no carimbo AINDA NÃO APRESENTADA. Os trechos do Kit Mapas entram **sem som próprio** (o som é todo do 3D), para não dobrar.

## 2.7 Arquivos

**No Kit Mapas Animados (`~/Kit-Mapas-Animados`):**
- `scripts/dados-distrital-bahia.py`: baixa do IBGE o contorno da Bahia e os 417 municípios com população; agrupa em cerca de 20 distritos vizinhos com população parecida; salva os contornos e os pontos (cidades dos pinos, Ilhéus).
- `src/videos/distrital-bahia/`: duas composições curtas, `DistritalBahiaHoje` (8,4 s) e `DistritalBahiaDistritos` (13,4 s), 1080 × 1920, sem legenda e sem marca d'água, com os tempos tirados da fala do 3D; peças do kit: `MapCamera`, `ImagemNaForma` + `bandeira("ba")`, `RegiaoDestaque`, `TextoDigitado`, `PinoRotulo`, `TagNoMapa`, `BorraoRadial`.
- `npm run tiles -- distrital-bahia` (satélite) e `npm run render` das duas composições → copiadas para `projetos/013. voto distrital misto/mapas/hoje.mp4` e `distritos.mp4`.

**No Estúdio 3D:**
- `src/videos/distritalmisto/DistritalMisto.tsx` e `pecas.tsx` (peças novas: `PilhaVotos`, `Corda`); os mapas entram com `<OffthreadVideo>` do Remotion nos tempos das cenas M1 e M2.
- Reaproveitados: `Plenario`, `Congresso`, `Urna`, `Cadeira`, `EtiquetaPreco`, `Balanca`, `Cadeado`, `IconeBalao` (catálogo); `ListaLei`, `PlacaChao`, `FolhaCarimbo` (do 011); `Barras`, `Boneco`, `Placa` (base).
- `src/Root.tsx`: `DistritalMisto`, `DistritalMistoGuia`, `DistritalMistoLimpo`, `CapaDistritalMisto`.
- 3.754 quadros, em 5 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:** tema político sem tomar lado (os dois lados no mesmo tamanho, na balança); pessoa real só como boneco genérico com etiqueta; sem cor de partido real (Partido A e B); selo em cada dado, e EXEMPLO na conta; mapa do Brasil com contorno do IBGE (aqui, do Kit Mapas); variar o mundo (o 011 foi palco giratório, o 012 a fábrica; aqui, o plenário em miniatura).

**Pedidos da pessoa:** roteiro mais didático; usar o Kit Mapas junto com o Estúdio 3D para mostrar como é hoje e como querem.

**Escolhas de direção (★):** o voto que acende "outro" no plenário logo no gancho; a pilha se dividindo em fatias; o protagonista entre as duas urnas na pergunta final.

## Ajustes feitos na programação (02/11/2026)
- Mapas: um vídeo só no Kit Mapas (`DistritalBahia`, 22,2 s: trecho A de 0 a 8,6 s e trecho B de 8,6 a 22,2 s), encaixado com `OffthreadVideo` nos tempos da fala, com entrada e saída de 0,2 s. Distritos: 20 blocos vizinhos crescendo a partir de 20 cidades, sempre o menor pegando o vizinho (Salvador ficou sozinha num distrito; Ilhéus no distrito de Itabuna).
- Sobreposições corrigidas: número 121 × etiqueta PL · 121; contador 308 DE 513 foi para baixo (não cobre mais o plenário acendendo); selos dos mapas e o do art. 60 no topo (batiam na legenda e nas etiquetas do mapa); etiquetas dos candidatos espaçadas, com ELEITO em cima; cadeado preso ao canto da lista; folha da PEC sai antes das urnas finais; Congresso menor e mais longe.
- O plenário de 513 cadeiras é uma peça nova instanciada (`PlenarioCamara`); a peça `Plenario` do catálogo é a do Senado (81).
