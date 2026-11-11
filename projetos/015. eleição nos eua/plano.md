# Plano de cenas: 015. eleição nos eua (versão 1, aprovada em 02/11/2026)

Código `eleicaoeua` · Nome `EleicaoEua` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo feito com os dois kits**, como no 013: o Estúdio 3D monta o vídeo inteiro e encaixa **três trechos de mapa** do Kit Mapas Animados (satélite).

## 2.1 Narração

- `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4) · pausas de no máximo 0,35 s, 1,2x, volume -15 · **101,17 s** · `AUDIO_SEG = 101.17` · `QUADROS = 3062`.
- 318 palavras; a última ("informações.") termina em 100,66 s. Sem ajuste no texto.

**Palavras repetidas:**

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| Trump | 2,74 · 25,72 · 32,24 · 91,06 | `quando('o Trump nem')` · `quando('partido do Trump')` · `quando('o Trump passa')` · `quando('o Trump tera')` |
| 435 | 13,66 · 37,70 | `quando('as 435')` · `quando('em 435')` |
| Senado | 18,48 · 27,94 | `quando('No Senado, sao')` · `quando('No Senado, 53')` |
| meio do mandato | 6,96 · 80,92 | `quando('bem no meio')` · `quando('nao tem eleicao')` |
| Lá | 4,26 · 16,28 · 51,9 · 57,0 · 65,3 | `quando('La, o presidente')` · `quando('La, a eleicao')` · `quando('La, o voto')` · `quando('La, cada')` |
| Aqui | 55,3 · 62,0 · 73,38 | `quando('Aqui, e sempre')` · `quando('Aqui, dos')` · `quando('Aqui, a regra')` |
| estado(s) | 21,64 · 49,1 · 59,6 · 66,0 | trechos longos (`'36 estados'`, `'estado inteiro'`, `'quase todo estado'`, `'cada estado faz'`) |
| Congresso | 11,84 · 33,62 · 91,6 | `quando('manda no Congresso')` · `quando('Congresso dividido')` · `quando('um Congresso')` |
| dois anos | 17,40 · 93,72 | `quando('so dois anos')` · `quando('proximos dois')` |

## 2.2 Ideia e mundo

**A metáfora: a "mesa da comparação".** Uma mesa comprida de maquete, cortada no meio por uma faixa no chão: do lado esquerdo fica **LÁ (EUA)**, do lado direito **AQUI (BRASIL)**, com uma placa de chão em cada lado. Toda vez que a fala diz "lá" a câmera desliza para a esquerda; quando diz "aqui", para a direita. Isso deixa a comparação didática e visível o vídeo inteiro. No fundo da mesa ficam dois prédios: o **Congresso genérico** dos EUA (com letreiro CONGRESSO DOS EUA) e o **prédio do TSE** do lado do Brasil.

O Kit Mapas cuida do **território**, com satélite de verdade:

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: O QUE ESTÁ EM JOGO** | `No Senado, sao` (18,32) até `Ate agora` (23,46) | 5,1 s | Os EUA vistos de cima; em "35" acendem os 35 estados com eleição para o Senado (chip 35 DE 100); em "36 estados" acendem, em outro tom, os 36 estados com eleição para governador (chip 36 GOVERNADORES) |
| **MAPA 2: OS 435 DISTRITOS** | `E como se elege` (34,72) até `Agora repara` (43,50) | 8,8 s | Os EUA; em "cortado" as linhas dos **435 distritos reais** se desenham por cima dos estados (contador digitando até 435); em "Cada distrito" a câmera mergulha num distrito só (um distrito comum, sem destacar partido); em "quem tiver mais votos" duas tags de candidato genéricas aparecem e a mais votada ganha o selo ELEITO |
| **MAPA 3: AQUI É PROPORCIONAL** | `Agora repara` (43,50) até `E nao para` (50,92) | 7,4 s | Voo para o Brasil; os estados aparecem com as divisas; em "estado inteiro" um estado acende inteiro (a Bahia, como no 013, com a bandeira dentro), sem nenhuma linha de distrito; chip O ESTADO TODO É UMA DISPUTA; em "dividem as cadeiras" 39 cadeirinhas (ícones) se repartem em cores neutras no centro do estado |

- Os mapas saem sem legenda, sem marca e sem som (a legenda, a pílula, a marca e os sons vêm do 3D), em 1080 × 1920, e entram no 3D com entrada e saída de 0,2 s, como no 013.
- Dados: estados dos EUA e distritos do Censo dos EUA (domínio público); Brasil e Bahia do IBGE (já baixados no 013).

**Partidos:** **REPUBLICANOS** e **DEMOCRATAS** só como etiqueta de texto, em dois tons neutros da paleta de apoio (`festa.dourado` e `festa.azul`), sem símbolo, sem logo e sem as cores oficiais. O Trump é um **boneco genérico sem rosto** com a etiqueta TRUMP, em `tema.pessoa`.

**Selos de fonte** (no topo, y 470, como aprendido no 013):

| Selo | Entra em | Texto |
|---|---|---|
| Data | `Hoje os Estados` | 3 DE NOVEMBRO DE 2026 |
| Câmara e Senado | `as 435` | 435 DEPUTADOS · 35 SENADORES · 36 GOVERNADORES |
| Placar | `53` | SENADO HOJE: 53 × 47 (47 INCLUI 2 INDEPENDENTES) |
| Distritos | no MAPA 2 | DISTRITOS DO CENSO DOS EUA |
| Brasil | `Aqui, dos` | CONSTITUIÇÃO, ART. 14 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo, chão, mesa | `tema.fundo`, `tema.chao` |
| Lado EUA × lado Brasil | os dois em `tema.objeto`; a placa do lado que está sendo falado acende em `tema.acento` |
| Cadeiras | `tema.objetoEscuro`; acendem em `tema.acento` quando entram "em jogo" |
| Cédulas e papéis | `tema.objetoClaro` |
| Bonecos (eleitores, Trump, candidatos) | `tema.pessoa` |
| Partidos | `festa.dourado` (republicanos) e `festa.azul` (democratas), sempre com o nome escrito |

**Mapa do mundo 3D** (chão em y = 0; frente em z+; esquerda = EUA, direita = Brasil):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Faixa do meio e placas LÁ · EUA / AQUI · BRASIL (`PlacaChao`) | x = 0 · placas em [−4, 0, 5] e [4, 0, 5] | o vídeo todo |
| Congresso dos EUA (`Congresso`, catálogo) | [−6, 0, −10] | acende em "Congresso" |
| Prédio do TSE (`OrgaoPublico`, texto "TSE") | [6, 0, −10] | nasce em "o TSE" |
| Urna de papel dos EUA (peça nova `UrnaPapel`: caixa transparente com cédulas) + cédula grande (`Cedula`, peça nova) | [−3, 0, 2] | gancho e cena das cédulas |
| Boneco TRUMP (`Boneco` + etiqueta) | [−1, 0, 1] | fora da cédula no gancho; volta no fim |
| Linha do mandato: 4 blocos 2025 · 2026 · 2027 · 2028 (`PlacaChao` × 4) | [−6 a 0, 0, 3] | 2026 acende: MIDTERMS |
| Plenário da Câmara, 435 cadeiras (`PlenarioCamara` do 013, instanciado com 435) | [−4, 0, −4] | todas acendem em "435" |
| Placar das duas casas (`Barras`, base) | [−3, 0, 0] | CÂMARA e SENADO, barras dos dois partidos; 53 × 47 |
| Calendários TERÇA (EUA) e DOMINGO (BR) (peça nova `Calendario`, folha que vira) | [−3 / 3, 0, 1] | |
| Relógio de ponto (`RelogioPonto`, catálogo) | [−4,5, 0, 1] | "dia normal de trabalho" |
| Prancheta REGISTRO (`Prancheta`, catálogo) | [−3, 0, 2,5] | "se registrar antes" |
| Placa VOTO OPCIONAL × VOTO OBRIGATÓRIO 18 A 70 | [−3 / 3, 0, 3] | |
| Caixa de correio com cartas (peça nova `CaixaCorreio`) | [−5, 0, 1] | "pelo correio" |
| Pilha de cédulas + calendário virando folhas (CONTAGEM: DIAS) | [−3, 0, 0] | |
| Urna eletrônica (`Urna`, catálogo) + lua/relógio MESMA NOITE | [3, 0, 2] | |
| Linha do tempo Brasil 2026 · 2028 (`PlacaChao`) com cargos | [2 a 6, 0, 4] | PRESIDENTE · GOVERNADOR · SENADOR · DEPUTADOS / PREFEITO · VEREADOR |
| Balança A FAVOR × CONTRA (`Balanca`, catálogo) | [−3, 0, 1] | no fim, o Congresso dos EUA entre os dois pratos |

**Regras visuais:** sem rosto, sem logo, sem bandeira inventada no 3D (bandeira só no mapa, onde o kit usa a oficial); partidos só com nome escrito; o verde só no lado que está sendo falado e no que muda.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Hoje os Estados` | 0,00 | Mesa | A câmera desce sobre o lado EUA; placa LÁ · EUA acende; selo 3 DE NOVEMBRO | 1 |
| 2 | `as urnas` | 1,72 | Urna de papel | Urna nasce, cédulas caindo dentro (pop) | 1 |
| 3 | `o Trump nem` | 2,74 | Boneco TRUMP | Boneco com etiqueta nasce ao lado | 1 |
| 4 | `na cedula` | 3,52 | Cédula | Cédula grande sobe; a linha PRESIDENTE está vazia e ganha um X cinza (baque) | 1 |
| 5 | `quatro anos` | 5,48 | Linha do mandato | 4 blocos 2025 a 2028 nascem um a um | 2 |
| 6 | `bem no meio` | 6,96 | Bloco 2026 | Acende em verde | 2 |
| 7 | `midterms` | 9,72 | Chip | MIDTERMS · ELEIÇÃO DE MEIO DE MANDATO | 2 |
| 8 | `manda no Congresso` | 11,46 | Congresso | Prédio acende ao fundo | 2 |
| 9 | `Na Camara` | 12,52 | Plenário | Câmera vai ao plenário de 435 cadeiras | 3 |
| 10 | `as 435` | 13,66 | Cadeiras | Todas acendem em onda (subida); contador 435 | 3 |
| 11 | `so dois anos` | 17,20 | Chip | MANDATO: 2 ANOS ★ relógio de areia girando | 3 |
| 12 | `No Senado, sao` | 18,32 | **MAPA 1** | 35 estados do Senado, depois 36 de governador | M1 |
| 13 | `Ate agora` | 23,46 | Placar | Volta ao 3D: placar das duas casas nasce | 4 |
| 14 | `republicanos` | 24,50 | Barras | Barras REPUBLICANOS sobem na Câmara e no Senado | 4 |
| 15 | `partido do Trump` | 25,24 | Boneco | TRUMP aparece ao lado das barras republicanas | 4 |
| 16 | `maioria nas duas` | 26,30 | Selos | MAIORIA nas duas casas | 4 |
| 17 | `53` | 28,44 | Senado | 53 digita (pop) | 4 |
| 18 | `47` | 29,30 | Senado | 47 digita; selo do placar | 4 |
| 19 | `democratas virarem` | 30,54 | Câmara | A barra DEMOCRATAS cresce e passa a outra (ilustrativo, com selo SE) | 4 |
| 20 | `Congresso dividido` | 33,62 | Congresso | O prédio fica metade dourado, metade azul ★ | 4 |
| 21 | `E como se elege` | 34,72 | **MAPA 2** | 435 distritos, mergulho num distrito, ELEITO | M2 |
| 22 | `Agora repara` | 43,50 | **MAPA 3** | Brasil, estado inteiro, cadeiras repartidas | M3 |
| 23 | `E nao para` | 50,92 | Mesa | Volta ao 3D: plano aberto da mesa EUA × BRASIL | 5 |
| 24 | `terca-feira` | 53,20 | Calendário EUA | Folha TERÇA (pop) | 5 |
| 25 | `dia normal de trabalho` | 54,10 | Relógio de ponto | Bate o cartão; bonecos com maleta passam ★ | 5 |
| 26 | `Aqui, e sempre` | 55,30 | Câmera | Desliza para o Brasil | 5 |
| 27 | `domingo` | 56,40 | Calendário BR | Folha DOMINGO (pop) | 5 |
| 28 | `La, o voto` | 57,00 | Câmera | Volta para os EUA | 5 |
| 29 | `nao e obrigatorio` | 57,90 | Placa | VOTO OPCIONAL | 5 |
| 30 | `se registrar` | 60,70 | Prancheta | REGISTRO DE ELEITOR, com o carimbo REGISTRADO | 5 |
| 31 | `Aqui, dos` | 62,00 | Câmera | Desliza para o Brasil; selo art. 14 | 5 |
| 32 | `18` | 62,60 | Número | 18 | 5 |
| 33 | `70` | 63,20 | Número | 70 | 5 |
| 34 | `obrigacao` | 64,50 | Placa | VOTO OBRIGATÓRIO (impacto) | 5 |
| 35 | `La, cada` | 65,30 | Câmera | Volta para os EUA | 6 |
| 36 | `faz a sua regra` | 66,30 | Placas | 6 plaquinhas de regras diferentes saltam em volta (REGRA A, B, C...) ★ | 6 |
| 37 | `pelo correio` | 68,30 | Caixa de correio | Cartas entram voando (whoosh leve) | 6 |
| 38 | `antes do dia` | 68,94 | Calendário | Folhas voltam para trás: VOTO ANTECIPADO | 6 |
| 39 | `cedula de papel` | 70,44 | Pilha | Cédulas empilham | 6 |
| 40 | `levar dias` | 72,56 | Calendário | Folhas viram: 1 DIA, 2 DIAS, 3 DIAS (tique) | 6 |
| 41 | `Aqui, a regra` | 73,38 | Câmera | Desliza para o Brasil | 6 |
| 42 | `uma so` | 74,38 | Placa | REGRA ÚNICA | 6 |
| 43 | `o TSE` | 75,18 | Prédio | TSE sobe ao fundo e acende | 6 |
| 44 | `urna e eletronica` | 76,74 | Urna | Urna eletrônica nasce, tela acende (bip) | 6 |
| 45 | `mesma noite` | 78,64 | Céu | Fundo escurece de leve, lua e RESULTADO: MESMA NOITE (ding) | 6 |
| 46 | `nao tem eleicao` | 79,92 | Linha do tempo | Câmera no lado Brasil; trilha 2026 → 2028 | 7 |
| 47 | `A cada quatro` | 81,54 | Linha | 2026 e 2030 marcados (de 4 em 4) | 7 |
| 48 | `de presidente` | 83,32 | Placas | PRESIDENTE · GOVERNADOR · SENADOR · DEPUTADOS saltam em 2026, uma a uma | 7 |
| 49 | `de uma vez` | 84,58 | Placas | Juntam num bloco só | 7 |
| 50 | `Dois anos depois` | 85,24 | Linha | 2028 acende | 7 |
| 51 | `prefeito` | 86,26 | Placa | PREFEITO | 7 |
| 52 | `vereador` | 86,96 | Placa | VEREADOR | 7 |
| 53 | `Entao, hoje` | 87,64 | Câmera | Volta ao lado EUA, Congresso no centro | 8 |
| 54 | `nao escolhem presidente` | 89,02 | Cédula | Linha PRESIDENTE vazia de novo | 8 |
| 55 | `um Congresso` | 91,54 | Balança | Balança nasce na frente do Congresso | 8 |
| 56 | `a favor` | 92,14 | Prato esquerdo | A FAVOR | 8 |
| 57 | `contra` | 92,74 | Prato direito | CONTRA; a balança fica no meio (não toma lado) | 8 |
| 58 | `proximos dois` | 93,28 | Chip | 2027 E 2028 | 8 |
| 59 | `Qual sistema` | 94,44 | Mesa | Grua: os dois lados juntos, EUA × BRASIL | 9 |
| 60 | `o deles` | 95,96 | Placa | LÁ · EUA acende | 9 |
| 61 | `o nosso` | 96,50 | Placa | AQUI · BRASIL acende | 9 |
| 62 | `comentarios` | 97,54 | Ícone | Balão de comentário verde | 9 |
| 63 | `E segue` | 98,18 | Câmera | Sobe devagar; @eumagnoleite | 9 |

Na programação cada cena ganha mais eventos (cédulas caindo uma a uma, cadeiras em onda, bonecos passando), como pede a regra do Estúdio.

## 2.4 Cenas com câmera

### CENA 1: HOJE NOS EUA (0,00 a 4,20 s)
Câmera desce de cima da mesa até a urna de papel no lado EUA (pos [−1, 7, 9] → [−2, 2,4, 6] · alvo [−3, 1, 2]). Pílula: HOJE NOS EUA. Aha: "é eleição, mas não é para presidente".

### CENA 2: MEIO DO MANDATO (4,26 a 12,50 s)
Travelling lateral ao longo da linha 2025 a 2028 e subida até o Congresso (alvo [−3, 0,5, 3] → [−6, 2, −10]). Pílula: MIDTERMS.

### CENA 3: A CÂMARA (12,52 a 18,30 s)
Plenário de 435 cadeiras visto de cima, 40°, com arco lento (alvo [−4, 0, −4]). Pílula: 435 CADEIRAS.

### MAPA 1: O QUE ESTÁ EM JOGO (18,32 a 23,40 s), Kit Mapas
Pílula: SENADO E GOVERNOS.

### CENA 4: QUEM MANDA HOJE (23,46 a 34,60 s)
Placar das duas casas em plano médio, avanço lento; no fim recua para o Congresso dividido (alvo [−3, 1,5, 0] → [−6, 2, −10]). Pílula: QUEM MANDA.

### MAPA 2: OS DISTRITOS (34,72 a 43,40 s), Kit Mapas
Pílula: COMO SE ELEGE LÁ.

### MAPA 3: AQUI É PROPORCIONAL (43,50 a 50,85 s), Kit Mapas
Pílula: COMO SE ELEGE AQUI.

### CENA 5: TERÇA × DOMINGO (50,92 a 65,20 s)
Plano aberto da mesa, depois a câmera desliza de um lado para o outro a cada "lá" e "aqui" (alvo [−3, 1, 2] ⇄ [3, 1, 2], dist 7, ângulo 28°). Pílula: LÁ × AQUI.

### CENA 6: A CONTAGEM (65,30 a 79,30 s)
Mesmo vaivém; no lado Brasil sobe para mostrar o TSE ao fundo. Pílula: A CONTAGEM.

### CENA 7: DE 4 EM 4 ANOS (79,38 a 87,50 s)
Travelling ao longo da linha do tempo do Brasil (alvo [2, 1, 4] → [6, 1, 4]). Pílula: NO BRASIL.

### CENA 8: O QUE ESTÁ EM JOGO (87,64 a 94,30 s)
Balança na frente do Congresso, com avanço lento (alvo [−4, 1,5, −2]). Pílula: O QUE DECIDEM.

### CENA 9: E VOCÊ? (94,44 a 102,07 s)
Grua final mostrando a mesa inteira, os dois lados e os dois prédios. Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 02/11/2026): data e midterms (Britannica, US Vote Foundation); 435 cadeiras com mandato de 2 anos; 35 de 100 vagas no Senado (33 regulares + 2 especiais); 36 governadores (estados, sem os territórios); Senado 53 × 47 (Fox News, Kalshi); maioria republicana na Câmara sem número na tela; distritos de um deputado só; terça-feira por lei federal; voto opcional e registro em quase todos os estados; voto pelo correio e antecipado; proporcional no Brasil (Código Eleitoral); voto obrigatório dos 18 aos 70 (Constituição, art. 14); urna eletrônica e resultado na mesma noite (TSE); eleições gerais em 2026 e municipais em 2028.

**Conferir antes de publicar:** postar na manhã de 03/11 (a fala diz "hoje").

## 2.6 Trilha e sons

Sem trilha. `whoosh` nas trocas de cena, na entrada e saída dos mapas e em cada vaivém lá/aqui (bem baixo); `tique` na pílula; `pop` em cédulas, placas e números; `subida` nas 435 cadeiras e nas barras; `baque` no X da linha PRESIDENTE; `bip` na urna eletrônica; `ding` em MESMA NOITE; `impacto` em VOTO OBRIGATÓRIO. Mapas sem som próprio.

## 2.7 Arquivos

**Kit Mapas (`~/Kit-Mapas-Animados`):**
- `scripts/dados-eleicao-eua.py`: estados dos EUA (Natural Earth, domínio público), os 435 distritos (Censo dos EUA, arquivo cartográfico 1:20 milhões, domínio público), a lista dos 35 estados com Senado e 36 com governador; Brasil e Bahia reaproveitados do `distrital-bahia`.
- `src/videos/eleicao-eua/`: um vídeo só `EleicaoEua` (cerca de 21,3 s: trechos M1, M2 e M3 em sequência), 1080 × 1920, sem legenda, sem marca e sem som, tempos tirados do `palavras.ts` do 3D.
- `npm run tiles -- eleicao-eua` e `npm run render -- EleicaoEua` → `projetos/015. eleição nos eua/mapas/eua.mp4`.

**Estúdio 3D:**
- `src/videos/eleicaoeua/EleicaoEua.tsx` e `pecas.tsx` (peças novas: `UrnaPapel`, `Cedula`, `Calendario`, `CaixaCorreio`).
- Reaproveitados: `Congresso`, `OrgaoPublico`, `Urna`, `Balanca`, `RelogioPonto`, `Prancheta`, `IconeBalao` (catálogo); `PlacaChao` (do 011); `PlenarioCamara` (do 013); `Barras`, `Boneco` (base).
- `src/Root.tsx`: `EleicaoEua`, `EleicaoEuaGuia`, `EleicaoEuaLimpo`, `CapaEleicaoEua`.
- 3.062 quadros, em 4 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:** juntar os kits como no 013 (mapa sem legenda e sem som, encaixado com 0,2 s de entrada e saída; selos por cima do mapa no topo); pessoa real só como boneco genérico com etiqueta; tema político sem tomar lado (balança no meio, partidos em tons neutros com o nome); número sem confirmação fica fora da tela (placar da Câmara); uma animação por palavra-chave; câmera nunca parada; variar o mundo (o 013 foi o plenário; aqui, a mesa dividida LÁ × AQUI).

**Pedidos da pessoa:** explicar a eleição de hoje nos EUA e mostrar de forma didática a diferença para o Brasil, usando os dois kits.

**Escolhas de direção (★):** a câmera indo para a esquerda no "lá" e para a direita no "aqui"; o relógio de areia do mandato de 2 anos; o Congresso pintado de dois tons no "dividido"; as plaquinhas de regras diferentes saltando em "cada estado faz a sua regra"; bonecos de maleta passando no "dia normal de trabalho".
