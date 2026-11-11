# Plano de cenas: 014. orçamento de ilhéus (versão 1, aprovada em 02/11/2026)

Código `orcamentoilheus` · Nome `OrcamentoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **três trechos de mapa** do Kit Mapas Animados (satélite de Ilhéus e do Brasil).
**Regra deste vídeo (pedido da pessoa):** todo número vem dos PDFs da prefeitura (portal da transparência) e a página aparece num selo discreto. A única exceção é o 26,17% do Tesouro, que entra lado a lado com o PDF, porque a pessoa pediu.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4) · preparo: 1,2x, pausas de no máximo 0,35 s, volume -15 · duração **155,55 s** · `AUDIO_SEG = 155.55` · `QUADROS = 4694` (com 0,9 s de folga).
- 396 palavras (igual ao roteiro); a última ("informações.") termina em 155,10 s. Tempos sempre sobem, sem buraco maior que 1,5 s. Final conferido.
- Ajustes: o parágrafo dos pisos foi regerado e emendado (a 1ª voz pulou palavras); percentuais quebrados pelo Whisper juntados ("53" + ",2%." → "53,2%."). Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo):

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| educação | 32,26 · 117,88 · 127,64 | `quando('a educacao:')` → use `quando('231')` · `quando('educacao precisa')` · `quando('educacao aparece')` |
| saúde | 40,44 · 108,18 | `quando('vem a saude')` · `quando('saude precisa')` |
| 2024 | 35,06 · 43,40 · 52,98 · 110,98 · 120,26 | `quando('Em 2024 tinham')` · `quando('igual a 2024')` · `quando('milhoes em 2024')` · `quando('Em 2024, o relatorio')` · `quando('Em 2024, 25,9%')` |
| 2025 | 3,04 · 17,12 · 54,58 · 59,46 · 114,86 · 123,58 | `quando('reais em 2025')` · `quando('Em 2025, a')` · `quando('12 em 2025')` · `quando('que em 2025')` · `quando('Em 2025, 15,4%')` · `quando('E 2025 tem')` |
| 2026 | 57,34 · 62,94 · 94,80 | `quando('agosto de 2026.')` · `quando('milhoes em 2026')` · `quando('agosto de 2026, Ilheus')` |
| prefeitura | 5,26 · 10,18 · 18,22 · 45,36 · 89,82 · 126,82 · 134,74 | sempre com trecho longo (`'relatorios da prefeitura'`, `'propria prefeitura publica'`, `'administracao da prefeitura'`, `'PDF da prefeitura'`) |
| portal da transparência | 11,18 · 147,28 | `quando('publica no portal')` · `quando('numero no portal')` |
| lei | 89,24 · 102,94 · 107,48 | `quando('A lei deixa')` · `quando('a lei proibe')` · `quando('pisos da lei')` |
| milhões | 11 vezes | nunca sozinho; sempre o número antes (`'231'`, `'185'`, `'127'`...) |
| relatório(s) | 4,78 · 8,82 · 112,06 | `quando('abri os relatorios')` · `quando('relatorios fiscais')` · `quando('o relatorio mostra')` |
| estado | 28,10 · 71,36 | `quando('do estado e')` · `quando('policia e do estado')` |

## 2.2 Ideia e mundo

**A metáfora: a maquete de Ilhéus com o cofre no meio.** Uma mesa redonda com a cidade em miniatura (chão de areia e verde, o mar num canto, a ponte e casinhas ao fundo). No centro, o **cofre da prefeitura**. Cada 10 milhões de reais são **uma pilha de moedas**: os 790 milhões viram **79 pilhas** em volta do cofre. Conforme o narrador diz cada área, as pilhas deslizam do cofre para o prédio daquela área e o número digita ao lado. Assim a pessoa **vê o tamanho** de cada gasto, comparado com os outros, sem precisar fazer conta. O mesmo mundo depois vira o lugar da **régua do limite de pessoal** e dos **copos dos pisos** (saúde e educação), que sobem do chão no centro da mesa.

**A unidade fixa:** placar pequeno no canto de cima da cena 2 até a cena 5: **"1 PILHA = R$ 10 MILHÕES"**. É a chave do vídeo: a pessoa aprende uma vez e lê todas as cenas.

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: "ILHÉUS"** | do início (0,00) até `Tudo aqui` (7,84) | 7,8 s | Voo do Brasil até o sul da Bahia, descendo no satélite até Ilhéus. O contorno do município (IBGE) acende em verde. Em "790" digita **R$ 790 MILHÕES** no meio do município, e embaixo "GASTOS DE 2025". Em "cada real" o contorno pulsa uma vez. |
| **MAPA 2: "DE ONDE VEM"** | de `Primeiro: de onde` (14,78) até `Agora, para onde` (29,20) | 14,4 s | O mapa recua até ver o Brasil com a Bahia. Em "823" digita **R$ 823 MILHÕES ARRECADADOS** sobre Ilhéus. Em "impostos da cidade" Ilhéus acende e a etiqueta **IPTU + ISS · R$ 201 MI** sai dela. Em "governo federal" uma seta curva vem de **Brasília** com **UNIÃO · R$ 343 MI**; em "estado" outra vem de **Salvador** com **ESTADO · R$ 154 MI**; em "Fundeb" uma terceira etiqueta **FUNDEB · R$ 107 MI** entra junto de Ilhéus. As setas são linhas finas com uma moedinha correndo. |
| **MAPA 3: "É SEU"** | de `O dinheiro e seu` (144,30) até o fim (155,55 + folga) | 12,2 s | Volta ao satélite de Ilhéus, com o contorno verde e a câmera girando devagar. Em "portal" entra a etiqueta **transparencia.ilheus.ba.gov.br**. Em "Em qual area" entram, uma de cada vez, 5 etiquetas pequenas em volta do município: EDUCAÇÃO, SAÚDE, TRANSPORTE, SANEAMENTO, SEGURANÇA ★. |

- Os trechos saem **sem legenda, sem marca d'água e sem som**, em 1080 × 1920, e entram no 3D por `OffthreadVideo` em três `Sequence` (entrada e saída de 0,2 s, whoosh). Selos do 3D por cima do mapa vão no topo (y 470).
- Contorno de Ilhéus: malha do IBGE (município 2913606). Brasília e Salvador: pontos das capitais.

**Protagonista:** não há. O "personagem" é o dinheiro (as pilhas). Pessoas só aparecem como servidores (cena 5) e como guarda (cena 4), bonecos genéricos sem rosto.

**Selos de fonte (discretos, logo abaixo da pílula, letra pequena em `tema.texto` a 70%):**

| Selo | Entra em | Texto |
|---|---|---|
| Os relatórios | `relatorios fiscais` (8,82) | PORTAL DA TRANSPARÊNCIA DE ILHÉUS · RREO E RGF |
| Receitas | no MAPA 2 (`823`, 19,08) | FONTE: RREO DEZ/2025 · P. 1 |
| Educação, saúde, administração | `231` (33,04) | FONTE: RREO DEZ/2025 · P. 3 (2024: RREO DEZ/2024 · P. 5) |
| Transporte | `O transporte subiu` (51,06) | FONTE: RREO DEZ/2024 · P. 6 · DEZ/2025 · P. 4 · AGO/2026 · P. 8 |
| Saneamento | `saneamento` (58,60) | FONTE: RREO DEZ/2025 · P. 4 · AGO/2026 · P. 7 |
| Segurança e Câmara | `31` (66,50) | FONTE: RREO DEZ/2025 · P. 3 |
| Servidores e obras | `De cada 10` (78,48) | FONTE: RREO DEZ/2025 · P. 2 |
| O limite | `A lei deixa` (88,90) | FONTE: RGF AGO/2026 · P. 1 · LRF, ART. 20 E 22 |
| Pisos | `pisos da lei` (106,80) | FONTE: RREO DEZ/2024 · P. 18 E 25 · DEZ/2025 · P. 16 E 22 |
| O Tesouro | `Tesouro Nacional` (132,48) | TESOURO NACIONAL · SICONFI · RREO DEZ/2025, ANEXO 14 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` misturado com `tema.areia` 25% |
| chão da maquete (areia e grama) | `tema.areia` (tom médio) e `tema.vegetacao` |
| mar no canto | `tema.agua` fosco |
| prédios | `tema.objeto` e `tema.objetoClaro` (cinza médio e claro), letreiros em `tema.objetoEscuro` |
| moedas e pilhas | dourado da paleta de apoio (`tema.ouro` ou `mistura(tema.areia, tema.amarelo)`), NUNCA o acento |
| pilha da área que está sendo falada | acende (emissivo leve), sem trocar de cor |
| "o que está acima do limite" (faixa prudencial, copo abaixo do piso, −38 MI) | marsala da paleta de apoio (`tema.alerta`), fosco |
| o que importa na cena (contorno de Ilhéus, número em destaque, "53,2%") | `tema.acento` (verde) |
| fantasmas de 2024 | mesmo dourado a 30% de opacidade |

**Mapa do mundo** (mesa redonda de raio 9 m; chão da mesa em y = 0; frente da câmera é z+):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa redonda (tampo de 9 m) | [0, 0, 0] | peça nova `MesaMaquete`; borda de madeira com 0,4 m |
| Maquete de fundo (casas, ponte, mar) | anel de raio 7 a 8,5, atrás (z < -3) | `CasaMini` e `Casinha` (catálogo) baixas; mar como meia-lua em [5, 0, -7]; ponte genérica (peça nova `PonteMini`) ★ |
| Cofre da prefeitura | [0, 0, 0] | `CofreFGTS` (catálogo), escala 1,6; abre em "para onde vai"; afunda na cena 6 |
| 79 pilhas de moedas | anel de raio 1,6 em volta do cofre | `PilhaMoedas` (catálogo), 1 pilha = 10 mi; 0,35 m de diâmetro, 0,6 m de altura; a última pilha pode ser parcial (ex.: 0,95) |
| Escola | [-4,5, 0, -2,5] | `EscolaSimples` (catálogo) com letreiro "EDUCAÇÃO"; pilhas em grade 6 × 4 à frente, em [-4,5, 0, -0,8] |
| Posto de saúde | [-1,5, 0, -5] | peça nova `PostoSaude`: prédio branco-cinza com faixa e letreiro "SAÚDE" (sem cruz vermelha); pilhas em [-1,5, 0, -3,4] |
| Prefeitura | [2,0, 0, -5] | `OrgaoPublico` (catálogo) com letreiro "PREFEITURA"; pilhas em [2,0, 0, -3,4] |
| Rua do ônibus (transporte) | faixa de x 3 a 7, z -2 | `Onibus` (catálogo) andando devagar; ponto de ônibus; pilhas em [5,0, 0, -0,6] |
| Saneamento | [5,5, 0, 2] | peça nova `EstacaoSaneamento`: caixa-d'água, dois tanques redondos e canos; pilhas em [4,2, 0, 2,4] |
| Guarda municipal | [-5,5, 0, 1,5] | peça nova `PostoGuarda`: guarita com letreiro "GUARDA MUNICIPAL" e um boneco de quepe (`Quepe`); pilhas em [-4,0, 0, 2,2] |
| Câmara de Vereadores | [-3,0, 0, 5] | `PredioColunas` (catálogo) com letreiro "CÂMARA" na altura da parede; pilhas em [-1,8, 0, 3,8] |
| Obra (obras e equipamentos) | [3,5, 0, 5] | `Guindaste` (catálogo) pequeno + `Cone` + `RoloCompactador` ★; pilha em [2,4, 0, 4,0] |
| Mesa dos relatórios | [0, 0, 7] | pilha de 4 cadernos grandes (peça nova `RelatorioPDF`, capa com "RREO" ou "RGF", texto da prefeitura sem brasão) e uma lupa ★ |
| Servidores | 40 bonecos em meia-lua em volta das 47 pilhas (centro) | `Multidao` (catálogo) com crachá; nascem em "servidores" e afundam no fim da cena 5 |
| Régua do limite | [0, 0, 0] | peça nova `ReguaLimite`: coluna de vidro fosco de 5 m com o líquido verde subindo e três faixas (48,6 alerta, 51,3 prudencial, 54 máximo); sobe do chão no lugar do cofre |
| Três placas do "proíbe" | [-2,2 / 0 / 2,2, 0, 2] | peça nova `PlacaProibido`: placa com a palavra e um X fosco que carimba |
| Copos dos pisos | saúde [-1,8, 0, 0] · educação [1,8, 0, 0] | peça nova `CopoPiso`: cilindro de vidro com risco do piso (15% ou 25%) e líquido que sobe; o da educação se divide em dois na cena 7 |
| Prédio do TCM | [0, 0, -3,5] | `PredioColunas` com letreiro "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (sem brasão) e `Lupa` ★ |

**Regras visuais:**
- Dinheiro sempre dourado; o verde do acento só no que a cena aponta (o número dito, o contorno de Ilhéus, o 53,2%).
- Cada número dito digita na tela como chip ao lado das pilhas, igual ao da fala (231 MI, 185 MI...). Valor exato no chip pequeno embaixo (ex.: "R$ 231,15 MI").
- Neutro politicamente: sem nome de prefeito, sem partido, sem cor de partido. 2024 e 2025 com o mesmo tratamento.
- Nada pisca; tudo acende em pelo menos 0,4 s.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Ilheus gastou` | 0,00 | MAPA 1 | Brasil visto de cima; câmera já descendo para a Bahia | M1 |
| 2 | `790` | 0,70 | MAPA 1 | **R$ 790 MILHÕES** digita no meio de Ilhéus; contorno do município acende em verde | M1 |
| 3 | `reais em 2025` | 3,04 | MAPA 1 | chip "GASTOS DE 2025" embaixo do número | M1 |
| 4 | `abri os relatorios` | 4,46 | MAPA 1 | ★ no canto, um PDF 2D pequeno abre (ícone de página com "RREO") | M1 |
| 5 | `cada real` | 7,02 | MAPA 1 | contorno pulsa uma vez (0,5 s) | M1 |
| 6 | `Tudo aqui` | 7,84 | troca | whoosh; entra o 3D: mesa dos relatórios em close | 1 |
| 7 | `relatorios fiscais` | 8,82 | 4 cadernos `RelatorioPDF` | caem um a um na mesa ("RREO DEZ/2024", "RREO DEZ/2025", "RREO AGO/2026", "RGF AGO/2026"); selo do portal | 1 |
| 8 | `propria prefeitura publica` | 10,18 | caderno do topo | ★ a capa mostra "PREFEITURA MUNICIPAL DE ILHÉUS" e acende | 1 |
| 9 | `publica no portal` | 11,18 | chip | "PORTAL DA TRANSPARÊNCIA" sai do caderno | 1 |
| 10 | `A pagina` | 12,50 | caderno | abre e uma página vira (`FolhaVirando`); lupa passa por cima ★ | 1 |
| 11 | `aparece na tela` | 13,54 | selo 2D | o selo-modelo "FONTE: RREO DEZ/2025 · P. 3" pisca devagar uma vez (0,6 s) mostrando onde ele fica | 1 |
| 12 | `Primeiro: de onde` | 14,78 | troca | whoosh; entra o MAPA 2 | M2 |
| 13 | `823` | 19,08 | MAPA 2 | **R$ 823 MILHÕES ARRECADADOS** sobre Ilhéus | M2 |
| 14 | `so 1 de cada 4` | 21,40 | MAPA 2 | ★ 4 moedinhas em fila embaixo do número; 1 acende | M2 |
| 15 | `impostos da cidade` | 23,34 | MAPA 2 | Ilhéus acende | M2 |
| 16 | `IPTU` | 24,64 | MAPA 2 | etiqueta **IPTU + ISS · R$ 201 MI** | M2 |
| 17 | `governo federal` | 27,06 | MAPA 2 | seta de Brasília com moeda correndo; **UNIÃO · R$ 343 MI** | M2 |
| 18 | `do estado e` | 28,00 | MAPA 2 | seta de Salvador; **ESTADO · R$ 154 MI** | M2 |
| 19 | `Fundeb` | 28,84 | MAPA 2 | etiqueta **FUNDEB · R$ 107 MI** | M2 |
| 20 | `Agora, para onde` | 29,20 | troca | whoosh; maquete inteira vista de cima, 79 pilhas em volta do cofre; placar "1 PILHA = R$ 10 MILHÕES" | 2 |
| 21 | `para onde vai` | 30,20 | cofre | porta do cofre abre | 2 |
| 22 | `maior fatia` | 31,32 | escola | escola sobe do chão; letreiro EDUCAÇÃO acende | 2 |
| 23 | `231` | 33,04 | 23 pilhas | deslizam do cofre para a frente da escola (em onda, 0,05 s entre elas); chip **231 MI** | 2 |
| 24 | `Em 2024 tinham` | 34,88 | fantasmas | ao lado, 27 pilhas transparentes de 2024 (269 mi) | 2 |
| 25 | `269` | 36,46 | chip | "2024: 269 MI" | 2 |
| 26 | `Caiu` | 37,92 | as 4 de diferença | ficam marsala e afundam devagar | 2 |
| 27 | `38` | 38,32 | chip | **−38 MI** em marsala | 2 |
| 28 | `vem a saude` | 40,10 | posto de saúde | sobe; letreiro SAÚDE acende; escola volta ao neutro | 2 |
| 29 | `185` | 41,04 | 18,5 pilhas | deslizam; chip **185 MI** | 2 |
| 30 | `quase igual` | 42,82 | fantasmas 2024 | 18 pilhas transparentes do lado, quase da mesma altura; chip "2024: 181 MI" | 2 |
| 31 | `administracao da prefeitura` | 44,68 | prefeitura | sobe; letreiro PREFEITURA | 3 |
| 32 | `127` | 46,20 | 12,7 pilhas | deslizam; chip **127 MI** | 3 |
| 33 | `Mais que` | 47,88 | balança ★ | `Balanca` (catálogo) aparece ao lado da prefeitura | 3 |
| 34 | `seguranca, cultura` | 48,32 | prato direito | 3,1 pilhas (segurança) caem no prato | 3 |
| 35 | `cultura` | 49,00 | prato direito | 0,15 pilha (uma moedinha) cai | 3 |
| 36 | `assistencia social` | 49,50 | prato direito | 1,2 pilha cai | 3 |
| 37 | `juntas` | 50,30 | balança | pende para a prefeitura (12,7 contra 4,4); chip "44 MI JUNTAS" | 3 |
| 38 | `O transporte subiu` | 51,06 | rua e ônibus | o ônibus entra andando; balança afunda | 3 |
| 39 | `3 milhoes em 2024` | 52,28 | pilha | 0,3 pilha (fininha); chip "2024: 3 MI" | 3 |
| 40 | `12 em 2025` | 54,08 | pilha | 1,2 pilha ao lado; chip "2025: 12 MI" | 3 |
| 41 | `32 so` | 55,70 | pilha | 3,2 pilhas; chip **32 MI** | 3 |
| 42 | `ate agosto` | 56,62 | chip | "ATÉ AGO/2026" | 3 |
| 43 | `o saneamento` | 58,50 | estação | sobe; canos acendem de leve | 3 |
| 44 | `zero` | 60,68 | marca no chão | círculo vazio no lugar da pilha; chip "2025: R$ 0" | 3 |
| 45 | `26 milhoes` | 61,64 | 2,6 pilhas | sobem do chão no círculo; chip **26 MI · ATÉ AGO/2026** | 3 |
| 46 | `Agora repara` | 63,94 | câmera | sobe e vira para o lado esquerdo da mesa; tique da pílula | 4 |
| 47 | `seguranca publica` | 65,30 | guarda | posto da guarda sobe; boneco de quepe | 4 |
| 48 | `31` | 66,50 | 3,1 pilhas | deslizam; chip **31 MI** | 4 |
| 49 | `guarda municipal` | 68,74 | boneco | dá um passo à frente; chip "GUARDA MUNICIPAL" | 4 |
| 50 | `defesa civil` | 69,72 | chip | "+ DEFESA CIVIL" | 4 |
| 51 | `A policia` | 70,52 | chip | "POLÍCIA: É DO ESTADO" com seta saindo da mesa ★ | 4 |
| 52 | `Camara de Vereadores` | 72,24 | Câmara | sobe; letreiro CÂMARA | 4 |
| 53 | `29 milhoes e meio` | 73,50 | 2,95 pilhas | deslizam; chip **29,5 MI** | 4 |
| 54 | `Quase o mesmo` | 75,12 | as duas pilhas | se aproximam lado a lado; sinal "≈" grande entre elas | 4 |
| 55 | `quase ninguem ve` | 77,24 | câmera | sobe para o centro; tudo volta ao neutro; os prédios afundam meio metro | 5 |
| 56 | `De cada 10` | 78,48 | 10 moedas grandes | fila de 10 moedas em pé na frente do cofre | 5 |
| 57 | `6 foram` | 79,86 | moedas | 6 acendem | 5 |
| 58 | `salarios e encargos` | 80,48 | chip | "SALÁRIOS + ENCARGOS" | 5 |
| 59 | `servidores` | 81,62 | multidão | 40 servidores de crachá nascem em meia-lua | 5 |
| 60 | `474` | 83,12 | 47,4 pilhas | juntam-se no centro; chip **474 MI** | 5 |
| 61 | `obras e equipamentos` | 84,84 | obra | guindaste levanta; cone e rolo | 5 |
| 62 | `so 8` | 86,36 | 0,8 pilha | uma pilha baixinha; chip **8 MI** | 5 |
| 63 | `1 real em cada` | 87,24 | grade de 100 moedas ★ | 10 × 10 deitadas; 1 acende em verde | 5 |
| 64 | `A lei deixa` | 88,90 | régua | cofre e pilhas afundam; régua sobe no centro; servidores afundam | 6 |
| 65 | `54%` | 90,72 | régua | faixa do topo "54% MÁXIMO" | 6 |
| 66 | `com pessoal` | 92,46 | chip | "GASTO COM PESSOAL ÷ RECEITA" | 6 |
| 67 | `12 meses` | 93,50 | ★ 12 marquinhas | calendário de 12 meses em fila (set/2025 a ago/2026) | 6 |
| 68 | `estava em` | 96,12 | líquido | sobe devagar | 6 |
| 69 | `53,2%` | 96,52 | líquido | para em 53,2%; número **53,2%** em verde | 6 |
| 70 | `limite prudencial` | 99,18 | faixa | faixa entre 51,3 e 54 acende em marsala | 6 |
| 71 | `51,3%` | 100,34 | risco | "51,3% PRUDENCIAL" | 6 |
| 72 | `a lei proibe` | 102,94 | placas | 3 placas sobem na frente | 6 |
| 73 | `aumento` | 103,64 | placa 1 | "AUMENTO" + X carimba | 6 |
| 74 | `cargo` | 104,46 | placa 2 | "CRIAR CARGO" + X | 6 |
| 75 | `contratar` | 105,06 | placa 3 | "CONTRATAR" + X | 6 |
| 76 | `algumas excecoes` | 105,82 | chip | "EXCEÇÃO: REPOR SERVIDOR DE SAÚDE, EDUCAÇÃO E SEGURANÇA" | 6 |
| 77 | `pisos da lei` | 107,08 | copos | régua e placas afundam; dois copos sobem | 7 |
| 78 | `saude precisa` | 108,18 | copo SAÚDE | risco "15%" acende | 7 |
| 79 | `Em 2024, o relatorio` | 110,76 | copo SAÚDE | líquido sobe até 14,6% | 7 |
| 80 | `14,6%` | 112,78 | chip | "2024: 14,6%" e o espaço que faltou em marsala | 7 |
| 81 | `Em 2025, 15,4%` | 114,30 | copo SAÚDE | líquido passa do risco; "2025: 15,4%" | 7 |
| 82 | `educacao precisa` | 117,88 | copo EDUCAÇÃO | risco "25%" | 7 |
| 83 | `Em 2024, 25,9%` | 119,72 | copo EDUCAÇÃO | sobe até 25,9%; chip "2024: 25,9%" | 7 |
| 84 | `E 2025 tem` | 123,16 | copo EDUCAÇÃO | esvazia e se divide em dois copos | 7 |
| 85 | `PDF da prefeitura` | 126,28 | copo da esquerda | caderno RREO na frente; cartão "PDF DA PREFEITURA" | 7 |
| 86 | `24,2%` | 128,62 | copo da esquerda | sobe até 24,18%, abaixo do risco | 7 |
| 87 | `abaixo do minimo` | 130,26 | marsala | faixa que falta acende em marsala | 7 |
| 88 | `Tesouro Nacional` | 132,48 | copo da direita | cartão "TESOURO NACIONAL"; selo do Tesouro | 7 |
| 89 | `dados da propria` | 134,02 | seta ★ | seta fina do caderno da prefeitura até o copo do Tesouro | 7 |
| 90 | `26,2%` | 136,66 | copo da direita | sobe até 26,17%, acima do risco | 7 |
| 91 | `Os dois sao oficiais` | 138,22 | cartões | os dois acendem igual | 7 |
| 92 | `nao batem` | 140,10 | sinal | "≠" grande entre os copos | 7 |
| 93 | `Tribunal de Contas` | 142,44 | prédio do TCM | sobe atrás; lupa por cima dos dois copos | 7 |
| 94 | `O dinheiro e seu` | 144,30 | troca | whoosh; entra o MAPA 3 | M3 |
| 95 | `numero no portal` | 147,08 | MAPA 3 | etiqueta "transparencia.ilheus.ba.gov.br" | M3 |
| 96 | `Em qual area` | 148,46 | MAPA 3 | 5 etiquetas, uma a cada 0,4 s | M3 |
| 97 | `comentarios` | 151,82 | chip 2D | "COMENTA AQUI" com balãozinho | M3 |
| 98 | `@eumagnoleite` | 153,16 | marca | arroba digita no meio, em verde | M3 |

Além dos 98 eventos, cada pilha que desliza é um evento próprio (onda de moedas com som de `pop` baixinho), o que dá mais de 300 movimentos.

## 2.4 Cenas com câmera

Distâncias são referência: o código usa o enquadramento automático (alvo + tamanho + direção).

### MAPA 1: ILHÉUS (0,00 a 7,84 s)
- Kit Mapas: Brasil (zoom 4) → sul da Bahia (zoom 8) → Ilhéus (zoom 10,5), em escala logarítmica, sem parar. Contorno do município em verde.
- Pílula: ILHÉUS 2025

### CENA 1: OS RELATÓRIOS (7,84 a 14,78 s) · Eventos 6 a 11
- 1a (7,84 a 11,0): alvo [0, 0,6, 7] · cabe 3 m · de frente, 30° de cima · grua descendo devagar
- 1b (11,0 a 14,78): alvo [0, 0,5, 7] · cabe 2 m (close no caderno aberto) · arco de 15° para a direita
- Pílula: OS RELATÓRIOS
- Aha: "Os números são da própria prefeitura."

### MAPA 2: DE ONDE VEM (14,78 a 29,20 s)
- Kit Mapas: recua de Ilhéus até ver Brasília, Salvador e Ilhéus no mesmo quadro (zoom 5,5), deriva lenta.
- Pílula: DE ONDE VEM
- Aha: "A maior parte do dinheiro vem de fora da cidade."

### CENA 2: PARA ONDE VAI (29,20 a 44,50 s) · Eventos 20 a 30
- 2a (29,20 a 31,30): alvo [0, 0, 0] · cabe a mesa inteira (19 m) · 55° de cima, de frente · avanço lento
- 2b (31,30 a 39,80): alvo [-3,5, 0,8, -1,5] · cabe 6 m (escola + pilhas + fantasmas) · 35°, vindo da direita · arco de 20°
- 2c (39,80 a 44,50): alvo [-1,5, 0,8, -4] · cabe 5 m (posto de saúde + pilhas) · 32° · arco continua
- Pílula: PARA ONDE VAI
- Aha: "Educação e saúde levam as maiores fatias."

### CENA 3: PREFEITURA E TRANSPORTE (44,50 a 63,94 s) · Eventos 31 a 45
- 3a (44,50 a 51,00): alvo [2,0, 1,0, -3,8] · cabe 6 m (prefeitura + balança) · 35° · arco para a direita
- 3b (51,00 a 58,00): alvo [5,0, 0,6, -1,2] · cabe 6 m (rua, ônibus e as três pilhas) · 30°, olhando ao longo da rua
- 3c (58,00 a 63,94): alvo [4,8, 0,6, 2,2] · cabe 5 m (estação de saneamento) · 33° · grua subindo
- Pílula: PREFEITURA → TRANSPORTE → SANEAMENTO (troca em `O transporte subiu` e `o saneamento`)

### CENA 4: AGORA REPARA (63,94 a 76,38 s) · Eventos 46 a 54
- 4a (63,94 a 71,90): alvo [-4,5, 0,9, 1,8] · cabe 5 m (guarda + pilhas) · 34°, vindo da esquerda
- 4b (71,90 a 76,38): alvo [-3,0, 0,8, 3,0] · cabe 6,5 m (guarda E Câmara no mesmo quadro, com as duas pilhas no meio) · 38° · avanço lento
- Pílula: SEGURANÇA × CÂMARA
- Aha: "A Câmara custa quase o mesmo que a segurança da cidade."

### CENA 5: A FOLHA (76,38 a 88,90 s) · Eventos 55 a 63
- 5a (76,38 a 84,60): alvo [0, 0,8, 0,5] · cabe 8 m (10 moedas, pilhas do centro e servidores) · 40° · arco de 25°
- 5b (84,60 a 88,90): alvo [2,0, 0,6, 3,5] · cabe 6 m (obra, pilha baixinha e grade de 100) · 45° de cima
- Pílula: OS SERVIDORES
- Aha: "6 de cada 10 reais pagam salários; obras recebem 1 de cada 100."

### CENA 6: O LIMITE (88,90 a 106,80 s) · Eventos 64 a 76
- 6a (88,90 a 98,30): alvo [0, 2,5, 0] · cabe 6 m de altura (régua inteira) · 15°, quase de frente · grua subindo junto com o líquido
- 6b (98,30 a 102,00): alvo [0, 4,2, 0] · cabe 2,5 m (faixas 51,3 a 54 em close) · 12°
- 6c (102,00 a 106,80): alvo [0, 1,5, 1,5] · cabe 6 m (régua + 3 placas) · 25° · recua
- Pílula: O LIMITE
- Aha: "Ilhéus está quase no teto da lei, e por isso não pode contratar."

### CENA 7: OS PISOS (106,80 a 144,30 s) · Eventos 77 a 93
- 7a (106,80 a 117,40): alvo [-1,8, 1,2, 0] · cabe 3,5 m (copo da saúde) · 20° · arco lento
- 7b (117,40 a 123,10): alvo [1,8, 1,2, 0] · cabe 3,5 m (copo da educação)
- 7c (123,10 a 138,20): alvo [1,8, 1,2, 0] · cabe 5 m (os dois copos da educação lado a lado) · 22° · avanço lento
- 7d (138,20 a 144,30): alvo [0, 1,5, -1] · cabe 8 m (os copos e o prédio do TCM atrás) · 30° · grua subindo
- Pílula: OS PISOS → PDF × TESOURO (troca em `E 2025 tem`)
- Aha: "Saúde cumpriu em 2025; na educação, os dois números oficiais não batem."

### MAPA 3: É SEU (144,30 a 156,45 s)
- Kit Mapas: Ilhéus em satélite, giro lento de 20° e leve recuo. Contorno verde.
- Pílula: CONFIRA

## 2.5 Fatos e fontes

Tabela completa (arquivo, página e valor exato) em `audio/fontes.md`. Na tela, o número vai arredondado como na fala, e o chip pequeno embaixo traz o valor do PDF (ex.: "R$ 790,52 MI").

**Conferir antes de publicar:**
- Se saiu o RGF ou o RREO de setembro e outubro de 2026 no portal: atualizar o 53,2% e os "até agosto".
- Se a prefeitura ou o TCM-BA falaram sobre o 24,18% da educação em 2025.

## 2.6 Trilha e sons

- `whoosh` nas 8 trocas (mapa ↔ 3D e entre cenas)
- `tique` em cada troca de pílula
- `pop` baixinho (volume 0,25) em cada pilha que desliza, no máximo 1 a cada 0,08 s; `pop` normal em cada chip de número
- `subida` no líquido da régua (eventos 68 e 69) e nos copos
- `baque` nas pilhas que afundam ("Caiu 38") e no "zero"
- `impacto` nos 3 X do "proíbe"
- `ding` em "15,4%" (cumpriu) e no "26,2%"; nada de `ding` no "24,2%" (neutro)
- `bip` nas etiquetas do MAPA 3
- Sem trilha de fundo (o Estúdio não tem música sem direitos).

## 2.7 Arquivos

**Novos (Estúdio 3D):**
- `src/videos/orcamentoilheus/OrcamentoIlheus.tsx`: o vídeo (AUDIO_SEG 155.55, QUADROS 4694)
- `src/videos/orcamentoilheus/pecas.tsx`:
  - `MesaMaquete`: mesa redonda com borda de madeira e chão de areia e grama
  - `PonteMini`: ponte baixa genérica com arcos (fundo da maquete) ★
  - `PostoSaude`: prédio do posto com faixa e letreiro "SAÚDE", sem cruz
  - `EstacaoSaneamento`: caixa-d'água, dois tanques redondos e canos
  - `PostoGuarda`: guarita com letreiro "GUARDA MUNICIPAL"
  - `RelatorioPDF`: caderno grosso em pé ou deitado com capa de texto ("RREO DEZ/2025")
  - `ReguaLimite`: coluna de vidro fosco com líquido e três faixas (48,6 / 51,3 / 54)
  - `PlacaProibido`: placa com texto e X que carimba
  - `CopoPiso`: copo de vidro com risco do piso e líquido que sobe; rótulo embaixo
  - `GradeCem`: 100 moedas deitadas em 10 × 10, uma acesa
  - `PilhasDinheiro`: um grupo de N pilhas (com fração) em grade, que desliza de um ponto a outro em onda
- `src/videos/orcamentoilheus/palavras.ts` (já pronto)
- `projetos/014. orçamento de ilhéus/mapas/ilheus.mp4` (os três trechos num MP4 só, um atrás do outro)

**Novos (Kit Mapas):**
- `src/videos/orcamento-ilheus/` (dados, roteiro com os tempos e index.tsx) e `scripts/dados-orcamento-ilheus.py` (contorno de Ilhéus e da Bahia do IBGE, estados do Brasil, pontos de Brasília e Salvador)
- composição `OrcamentoIlheus`, renderizada com `--muted`

**Alterados:** `src/Root.tsx` (OrcamentoIlheus, OrcamentoIlheusGuia, OrcamentoIlheusLimpo, CapaOrcamentoIlheus); `Root` do Kit Mapas.

**Reaproveitados do catálogo:** `CofreFGTS`, `PilhaMoedas`, `EscolaSimples`, `OrgaoPublico`, `PredioColunas`, `Onibus`, `Balanca`, `Guindaste`, `Cone`, `RoloCompactador`, `Multidao`, `Quepe`, `CasaMini`, `Casinha`, `FolhaVirando`, `Pilula`, legenda e selos da base.

**Render:** 4694 quadros, em partes (o `render.mjs` decide; uns 6 a 8 pedaços).

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- Juntar os kits por OffthreadVideo, com selos no topo (y 470) por cima do mapa (013).
- TagNoMapa sempre com `sai` numérico (013).
- Fonte de prefeitura = PDF com arquivo e página; selo pequeno e discreto; fonte falada uma vez (014, pedido de hoje).
- Uma animação por palavra-chave; o máximo de objetos; extras com ★.
- Multidão (servidores) só nasce na palavra dela e afunda depois.
- Tudo que acende volta ao neutro no fim da cena.
- Vários números lado a lado: um de cada vez (012); por isso cada área tem a sua câmera.
- Dois nomes ditos em menos de 1 s (segurança e Câmara são comparados): um plano que mostra os dois (cena 4b).
- Prédio público com o nome escrito; sem cruz vermelha na saúde; sem brasão.
- Letreiro na altura da parede, não acima dela (011).
- Zoom do mapa em escala logarítmica.
- Tema político: neutro, sem nomes, as duas gestões (2024 e 2025) com o mesmo tratamento.

**Escolhas do diretor:**
- A unidade "1 pilha = 10 milhões" como chave de leitura do vídeo inteiro.
- Maquete redonda de Ilhéus com o cofre no meio (mundo novo, diferente dos três últimos: palco giratório, fábrica, plenário).
- Os fantasmas de 2024 ao lado das pilhas de 2025, para ver a queda sem conta.
- A balança da administração contra as três áreas juntas.
- A régua de vidro para o limite e os copos para os pisos.
- O copo da educação que se divide em dois (PDF e Tesouro), sem dizer qual está certo.
- O marsala para "abaixo do mínimo" e "acima do prudencial", e nenhum `ding` no número abaixo do piso.
