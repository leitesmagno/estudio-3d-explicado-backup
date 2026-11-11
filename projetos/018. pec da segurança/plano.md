# Plano de cenas: 018. pec da segurança (versão 1, aprovada em 04/11/2026)

**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **três trechos de mapa** do Kit Mapas Animados (Brasil com estados e municípios, malha do IBGE), num MP4 só, como no 015 e no 016. A legenda, a pílula, a marca e os selos de fonte do 3D ficam por cima dos mapas.

**Pedidos da pessoa que valem para o vídeo todo:**
1. Usar o Kit Mapas junto com o Estúdio 3D.
2. Didático: cada termo técnico tem um objeto na tela na hora em que é traduzido (PEC, prisão provisória, promulgar).
3. Nada sobreposto: a tela tem faixas fixas (seção 2.2) e uma coisa por faixa de cada vez, como no 016.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam - Dominant, Firm (ElevenLabs v4) · preparo: 1,2x, pausas de no máximo 0,35 s, -15 LUFS · duração **166,19 s** · `AUDIO_SEG = 166.19` · `QUADROS = 5013` (com 0,9 s de folga).
- 517 palavras (igual ao roteiro v6). A última ("direitos.") termina em 165,94 s. Tempos sempre sobem, sem buraco maior que 1,5 s.
- Ajustes: nenhum no `palavras.json`. Único aviso do alinhador: "10%" casou com "10" (certo). Cópia em `transcricao/palavras-original.json`.
- Palavras repetidas e o `quando()` certo:

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| 75 / zero | 0,00 · 64,98 | `quando('75')` · `quando('ontem 75')` |
| Susp | 32,30 · 75,34 | `quando('cria o Susp')` · `quando('o Susp entra')` |
| Constituição | 42,50 · 76,26 · 136,42 | `quando('própria Constituição')` · `quando('entra na Constituição')` · `quando('a Constituição só')` |
| PEC | 40,30 · 149,58 | `quando('uma PEC')` · `quando('outra PEC')` |
| Câmara | 47,42 · 55,78 | `quando('Na Câmara')` · `quando('A Câmara aprova')` |
| União | 16,26 · 51,32 | `quando('A União')` · `quando('exclusivo da União')` |
| polícia | 14,56 · 78,40 · 83,10 · 143,36 · 158,84 | `quando('Polícia Militar')` · `quando('com polícia')` · `quando('ter polícia')` · `quando('PM e Polícia')` · `quando('quer polícia')` |
| Federal | 16,88 · 30,62 · 91,50 · 94,92 | `quando('na Federal')` · `quando('intervenção federal')` · `quando('Rodoviária Federal')` · `quando('a Federal ganha')` |
| maioridade | 54,50 · 68,34 · 145,76 | `quando('redução da maioridade')` · `quando('deixar a maioridade')` · `quando('a maioridade penal segue')` |
| governador | 13,68 · 144,82 | `quando('O governador')` · `quando('com o governador')` |
| dinheiro | 24,14 · 61,78 · 85,88 · 98,48 | `quando('seu dinheiro')` · `quando('o dinheiro das')` · `quando('dinheiro próprio')` · `quando('dinheiro garantido')` |
| municipal | 83,44 · 159,16 | `quando('polícia municipal')` · `quando('quer polícia municipal')` |
| Congresso | 130,66 · 150,80 | `quando('o Congresso ganha')` · `quando('o Congresso publicar')` |
| dados | 23,50 · 79,98 | `quando('seus dados')` · `quando('dividindo dados')` |
| bens / pena | 115,28 · 139,66 / 111,70 · 138,32 | `quando('perda dos bens')` · `quando('perda de bens')` / `quando('maior a pena')` · `quando('Pena mais dura')` |
| lei | 31,70 · 35,22 · 140,92 | `quando('uma lei cria')` · `quando('lei comum')` · `quando('lei nova')` |

## 2.2 Ideia e mundo

**A metáfora: a Casa da Segurança, que o próprio roteiro diz.** Uma **casa de bonecas cortada**, aberta na frente, com **três cômodos lado a lado separados por paredes grossas**: o cômodo do **GOVERNADOR** (Polícia Militar e Polícia Civil), o da **UNIÃO** (Polícia Federal e Rodoviária Federal) e o da **PREFEITURA** (a guarda, com uma pracinha). Cada cômodo tem a sua mesa, o seu armário de dados e o seu cofrinho: são "os vários donos que não conversam". A casa fica em cima de um **alicerce** com o letreiro **1988**, que vira **CONSTITUIÇÃO** quando o Susp entra nela. Na frente da casa passa **a sua rua**, com o protagonista.

Quando chegam as "cinco coisas", **a casa vai sendo reformada**: portas se abrem nas paredes e um fio de luz liga os cômodos (Susp), o cômodo da prefeitura ganha a polícia municipal, o da União ganha trem e barco no quintal de trás, um cofre com cadeado chega no porão (fundos protegidos) e, do lado da casa, sobe um presídio de segurança máxima. No fim, um **segundo andar em obra** aparece em cima: o Ministério da Segurança Pública, que ainda é só promessa.

**Ao fundo, a Praça dos Três Poderes em maquete:** o **Congresso** (silhueta genérica com as duas cuias), um **placar** para as votações e a **mesa dos governadores**. A câmera vai para lá na parte da história (2024 a 2026) e volta para a casa nas mudanças.

**Protagonista:** "você", um boneco em `tema.corpo`, parado na calçada da sua rua, na frente da casa. Aparece no gancho ("quem cuida da sua rua"), olha para a casa durante o vídeo e fecha o vídeo de novo na rua.

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA A: "CADA UM NO SEU QUADRADO"** | de `Resultado` (21,84) até `Por isso` (36,68) | 14,8 s | Brasil em satélite com os **27 estados** e as divisas (IBGE). Em "cada um com seus dados", os estados se **afastam um pouco uns dos outros**, como peças soltas, cada um com um ícone de pasta e de moeda ★. Em "atravessa a divisa", uma **linha tracejada genérica** (ilustração, sem rota real) corta 4 estados do Norte ao Sudeste, sem parar nas divisas. Em "2018" os estados voltam ao lugar. Em "intervenção federal no Rio" o **RJ acende** e entra a etiqueta **INTERVENÇÃO FEDERAL · 2018**. Em "cria o Susp" **linhas finas ligam as 27 capitais** (uma rede). Em "lei comum" a rede fica tracejada e fraca. |
| **MAPA B: "A SUA CIDADE"** | de `Dois` (81,30) até `Três` (90,36) | 9,1 s | Brasil com os **5.570 municípios** (malha IBGE, qualidade mínima, só as linhas finas). Em "sua cidade" eles acendem numa onda do Norte para o Sul. Em "polícia municipal" entra a etiqueta **PODE CRIAR**. Em "Mas só com" a onda apaga e só ficam acesos alguns municípios espalhados (ilustração: "nem todo mundo vai conseguir"), com o rótulo **SÓ QUEM CUMPRIR AS REGRAS** ★. |
| **MAPA C: "E AÍ?"** | de `E aí, você quer` (157,94) até o fim (167,09) | 9,2 s | Volta aos municípios, câmera girando devagar. Pontinhos verdes acendem um a um em cidades espalhadas (sorteio fixo, sem significado de dado). Em "Me conta" entra a etiqueta **E AÍ, VOCÊ QUER?** |

- Os trechos saem **sem legenda, sem marca e sem som**, 1080 × 1920, num MP4 só (`projetos/018. pec da segurança/mapas/pec.mp4`), e entram no 3D com `OffthreadVideo` em três `Sequence` (`startFrom` de cada trecho), com entrada e saída de 0,2 s e whoosh.
- Dados: malha de estados e municípios do IBGE (API de malhas), capitais da lista oficial do IBGE. A linha "atravessa a divisa" e os pontinhos do MAPA B e C são **ilustração**, sem número e sem rota real; vão escritos assim no `fontes.md`.
- Regra do 013: `TagNoMapa` sempre com `sai` numérico. Regra do 015: os três trechos num MP4 só, encaixados em três Sequences separadas porque não são seguidos.

**Faixas da tela (para nada ficar sobreposto, como no 016)**

| Faixa | Altura (px) | O que vai nela |
|---|---|---|
| Cabeçalho | 286 a 380 | marca d'água e pílula |
| A: selo de fonte | 404 a 470 | um selo por dado, na hora em que é dito |
| B: números e chips | 480 a 640 | `Contador` (placares, 10%, 18 anos) ou chips da cena, um de cada vez |
| 3D | 640 a 1300 | o assunto da cena (e as etiquetas presas a ele) |
| Legenda | até 1524 | legenda |

Nos trechos de mapa, as etiquetas do mapa ficam no meio (faixa 3D) e os selos do 3D ficam na faixa A (regra do 013: em cima, longe das etiquetas e da legenda).

**Selos de fonte** (faixa A, entra com a palavra, fica 2,5 s):

| Selo | Entra em | Texto |
|---|---|---|
| S1 | `75` (0,00) | FONTE: AGÊNCIA SENADO, 03/11/2026 |
| S2 | `Desde 1988` | FONTE: CONSTITUIÇÃO, ART. 144 |
| S3 | `intervenção federal` | FONTE: DECRETO 9.288/2018 |
| S4 | `cria o Susp` | FONTE: LEI 13.675/2018 |
| S5 | `Por isso, em 2024` | FONTE: AGÊNCIA BRASIL, 31/10/2024 |
| S6 | `Na Câmara` | FONTE: AGÊNCIA CÂMARA, 05/03/2026 |
| S7 | `487` | FONTE: AGÊNCIA CÂMARA, 04/03/2026 |
| S8 | `das bets` | FONTE: AGÊNCIA SENADO, 03/11/2026 |
| S9 | `38` | FONTE: AGÊNCIA SENADO, 03/11/2026 |
| S10 | `Agora, o que muda` | FONTE: TEXTO DA PEC 18/2025 (AG. SENADO E AG. CÂMARA) |
| S11 | `prisão provisória` | FONTE: AGÊNCIA CÂMARA, 04/03/2026 |
| S12 | `Lula já avisou` | FONTE: METRÓPOLES, 03/11/2026 |

**Paleta (tudo do tema do perfil, nenhuma cor fixa)**

| Uso | Campo do tema |
|---|---|
| Fundo, névoa | `fundo` |
| Chão do palco, rua | `chao` |
| Paredes da casa, Congresso, mesas | `objeto` |
| Pisos dos cômodos, alicerce, livros | `objetoClaro` (tom médio, regra "superfície clara grande estoura") |
| Telhado, grades, presídio, facção | `objetoEscuro` |
| Policiais e servidores | `pessoa` com quepe em `objetoEscuro` |
| Políticos (governadores, relatores, Lula) | `objeto` (regra do 011: não usar `objetoEscuro`) |
| Protagonista "você" | `corpo` |
| O que está em foco na cena (cômodo aceso, fio do Susp, número do placar) | `acento` (verde folha #2FA36B) |
| Água do rio, telas | `ceuLuz` |
| Moedas | `Moeda` padrão (acento), só no cofre |

**Mapa do mundo** (chão em y = 0, frente em z+)

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Alicerce (laje com letreiro) | [0, 0,25, 0] · 13 × 0,5 × 5 | **peça nova `Alicerce`**: letreiro na frente: "1988" e depois "CONSTITUIÇÃO" (troca suave em 0,6 s, duas `Placa` que se cruzam) |
| Casa cortada, 3 cômodos | [0, 0,5, 0] · 12 × 3 × 4 | **peça nova `CasaSeguranca`**: paredes grossas entre os cômodos com `portas` 0..1 (a parede abre como persiana, regra "interior de prédio") e `luz` por cômodo; telhado em duas águas |
| Cômodo GOVERNADOR | centro [-4, 0,5, 0] | placa na parede de fundo "GOVERNADOR"; 2 bonecos com quepe (PM) e 1 de terno (Polícia Civil) com etiqueta 2D "PM" e "CIVIL" |
| Cômodo UNIÃO | centro [0, 0,5, 0] | placa "UNIÃO"; 2 bonecos (PF e PRF), etiquetas 2D "FEDERAL" e "RODOVIÁRIA" |
| Cômodo PREFEITURA | centro [4, 0,5, 0] | placa "PREFEITURA"; `PostoGuarda` pequeno, 1 boneco guarda, banco de praça e poste (`PosteLampada`) |
| Em cada cômodo: armário de dados + cofrinho | no fundo de cada cômodo | **peça nova `ArmarioDados`** (gavetas com etiqueta "DADOS"); cofrinho = `Cofre` em escala 0,35 |
| Sua rua + calçada | faixa z = 4,5 a 7, x de -9 a 9 | `chao` mais escuro, faixa tracejada no meio |
| Protagonista "você" | [1,5, 0, 5,2] | `Boneco` cor `corpo`, olhando para a casa |
| Quintal de trás da União: trilho e rio | trilho em z = -3,2; rio em z = -4,4, x de -2 a 2 | **peças novas `TremMini`** (locomotiva + 2 vagões genéricos) e faixa de água; `NavioMini` no rio. Nascem só em "ferrovias" e "rios" |
| Porão: cofre dos fundos | [0, 0,25, 2,4] (na frente do alicerce) | `Cofre` escala 0,9 + `Cadeado`; `CanoMoedas` do cofre até o cômodo GOVERNADOR; `PlataformaPetroleo` pequena em [3, 0, 3,4] |
| Presídio de segurança máxima | [10, 0, 0] | **peça nova `PresidioMax`**: muro alto, torre de vigia sem luz piscando, portão; dentro, **pirâmide de 3 degraus** com bonecos `objetoEscuro` (a base com 5, o meio com 3, o topo com 1: o "cargo") e `Grades` que descem por degrau |
| Urna atrás das grades | [10, 0, 3] | `Urna` + `Cadeado`; nasce em "votar" |
| Balança | [7,5, 0, 3,5] | `Balanca` (dois pratos) para "presunção de inocência": inclina para um lado e para o outro e volta ao meio (tema polêmico) |
| Mesa dos governadores | [-11, 0, -8] | mesa redonda + 8 bonecos (`objeto`) + boneco "GOVERNO" levando o documento "PEC" (`DocumentoGrande`) |
| Congresso | [0, 0, -16] escala 1,4 | `Congresso` (silhueta genérica, sem o desenho exato de Brasília em detalhe) |
| Mesa do relator | [-3, 0, -11] | mesa + boneco relator com etiqueta "RELATOR MENDONÇA FILHO"; documento com 3 cartões que saem voando |
| Placar | [4, 0, -11] | **peça nova `PlacarParede`**: duas colunas (SIM, NÃO) que sobem; os números vão no `Contador` 2D |
| Livro da Constituição gigante | [0, 0, 3,8] (sai do alicerce) | `LivroLei` escala 1,6 + **peça nova `PortaLivro`**: uma porta que se abre na capa; atrás, uma placa vazia tracejada "LEI NOVA" |
| Segundo andar em obra | [0, 3,8, 0] | **peça nova `AndarObra`**: só a estrutura (pilares e vigas), tábuas, cones e tijolos (regra do 014: sem guindaste); placa "MINISTÉRIO DA SEGURANÇA PÚBLICA" |
| Diário Oficial | [0, 0, -12] | `DiarioOficial` (na hora de "publicar") |
| Prédios dos conselhos | [6, 0, -14] | 2 `PredioColunas` pequenos com letreiro "CNJ" e "CNMP" |

**Regras visuais deste vídeo**
- O acento verde só no cômodo ou objeto que a fala está explicando. Ao trocar de cena, tudo volta ao neutro.
- Políticos e pessoas reais (Mendonça Filho, Rogério Carvalho, Lula) só como bonecos genéricos com etiqueta de nome, sem rosto e sem cor de partido.
- Facção e milícia: bonecos escuros sem arma, sem sangue. Polícia: sem arma na mão (só quepe e distintivo).
- Nada de bandeira, brasão, logo da PF, da PRF ou das polícias. Os nomes vão escritos nas placas, na fonte do perfil.
- Ponto polêmico (presos provisórios): a balança vai para os dois lados e volta ao meio, com o mesmo tempo.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `75` | 0,00 | Congresso + Plenário | Plenário do Senado (`Plenario`) com as cadeiras acendendo em verde uma a uma, rápido; `Contador` "75 × 0" | 0 |
| 2 | `zero` | 1,02 | Contador | o "0" do lado do NÃO entra com um tique | 0 |
| 3 | `Nenhum senador` | 1,54 | Plenário | nenhuma cadeira cinza: um aro passa pelo plenário inteiro (`Onda`) | 0 |
| 4 | `segurança pública` | 3,56 | chip | chip "SEGURANÇA PÚBLICA" na faixa B | 0 |
| 5 | `mexe com quem` | 4,86 | câmera | grua sobe do Congresso, passa por cima da casa e desce na rua | 0 |
| 6 | `sua rua` | 6,00 | "você" | o protagonista nasce na calçada e olha para a casa; `Onda` verde sob ele | 0 |
| 7 | `Primeiro, como era` | 6,68 | pílula | pílula: COMO ERA | 1 |
| 8 | `Desde 1988` | 8,28 | Alicerce | o alicerce sobe com o letreiro "1988"; selo S2 | 1 |
| 9 | `casa` | 11,24 | CasaSeguranca | as paredes e o telhado sobem do alicerce | 1 |
| 10 | `vários donos` | 11,72 | 3 placas | as 3 placas (GOVERNADOR, UNIÃO, PREFEITURA) entram uma após a outra | 1 |
| 11 | `não conversam` | 12,60 | paredes | as paredes entre os cômodos engrossam um pouco e "fecham" (sobem 10 cm) ★ | 1 |
| 12 | `O governador` | 13,68 | cômodo GOVERNADOR | cômodo acende no acento; placa em destaque | 1 |
| 13 | `Polícia Militar` | 14,56 | 2 bonecos PM | entram com quepe; etiqueta "PM" | 1 |
| 14 | `Civil` | 15,52 | boneco Civil | entra; etiqueta "CIVIL" | 1 |
| 15 | `A União` | 16,26 | cômodo UNIÃO | GOVERNADOR volta ao neutro; UNIÃO acende | 1 |
| 16 | `na Federal` | 16,88 | boneco PF | entra; etiqueta "FEDERAL" | 1 |
| 17 | `Rodoviária` | 17,58 | boneco PRF | entra; etiqueta "RODOVIÁRIA" | 1 |
| 18 | `a prefeitura` | 18,54 | cômodo PREFEITURA | UNIÃO volta ao neutro; PREFEITURA acende | 1 |
| 19 | `guarda` | 19,32 | guarda + guarita | `PostoGuarda` sobe e o boneco guarda entra | 1 |
| 20 | `praça` | 20,30 | banco e poste | banco de praça e poste nascem | 1 |
| 21 | `prédio público` | 20,86 | prédio mini | um prediozinho de colunas nasce ao lado da praça | 1 |
| 22 | `Resultado` | 21,84 | MAPA A | entra o mapa (whoosh); pílula: CADA UM NO SEU QUADRADO | A |
| 23 | `cada um` | 22,62 | mapa | os 27 estados se afastam um pouco | A |
| 24 | `seus dados` | 23,50 | mapa | ícone de pasta em cada estado ★ | A |
| 25 | `seu dinheiro` | 24,14 | mapa | ícone de moeda em cada estado ★ | A |
| 26 | `crime organizado` | 25,62 | mapa | ponto escuro nasce no Norte | A |
| 27 | `atravessa a divisa` | 26,36 | mapa | linha tracejada corre por 4 estados sem parar nas divisas | A |
| 28 | `sem pedir licença` | 27,64 | mapa | as divisas cruzadas piscam suave (pulso de 0,6 s) | A |
| 29 | `Em 2018` | 28,88 | chip + mapa | chip "2018" na faixa B; estados voltam ao lugar | A |
| 30 | `intervenção federal` | 30,16 | mapa | RJ acende; etiqueta INTERVENÇÃO FEDERAL · 2018; selo S3 | A |
| 31 | `cria o Susp` | 32,12 | mapa | linhas ligam as 27 capitais; selo S4 | A |
| 32 | `juntar todo mundo` | 32,94 | mapa | a rede acende inteira de uma vez, suave | A |
| 33 | `lei comum` | 35,22 | mapa | a rede fica tracejada e fraca; chip "SÓ LEI COMUM" | A |
| 34 | `muda fácil` | 35,96 | mapa | um trecho da rede some ★ | A |
| 35 | `Por isso` | 36,68 | 3D | sai o mapa; câmera na mesa dos governadores; pílula: A PEC | 2 |
| 36 | `2024` | 37,44 | Contador | "2024" na faixa B; selo S5 | 2 |
| 37 | `o governo leva` | 38,76 | boneco GOVERNO | anda até a mesa levando o documento | 2 |
| 38 | `governadores` | 39,52 | 8 bonecos | os governadores levantam a cabeça | 2 |
| 39 | `uma PEC` | 40,30 | documento | o documento cresce e mostra "PEC" | 2 |
| 40 | `proposta para mudar` | 41,08 | documento | ele se abre e mostra a capa do livro "CONSTITUIÇÃO" com um lápis ★ | 2 |
| 41 | `própria Constituição` | 42,50 | chip | chip "PEC = PROPOSTA PARA MUDAR A CONSTITUIÇÃO" | 2 |
| 42 | `Parte deles` | 43,42 | 3 governadores | 3 dos 8 dão um passo para trás | 2 |
| 43 | `torce o nariz` | 44,08 | 3 governadores | cabeça vira para o lado | 2 |
| 44 | `controle das suas polícias` | 45,76 | casa ao fundo | o cômodo GOVERNADOR da casa (visto de longe) acende um instante ★ | 2 |
| 45 | `Na Câmara` | 47,42 | câmera | voa para a mesa do relator; selo S6 | 2 |
| 46 | `relator Mendonça Filho` | 48,32 | relator | boneco com etiqueta "RELATOR: MENDONÇA FILHO" | 2 |
| 47 | `tira três coisas` | 49,12 | documento | 3 cartões saltam para fora do documento, parados no ar | 2 |
| 48 | `exclusivo da União` | 50,68 | cartão 1 | "PODER EXCLUSIVO DA UNIÃO" riscado e cai na lixeira ★ | 2 |
| 49 | `troca de nome da PRF` | 51,98 | cartão 2 | "PRF → POLÍCIA VIÁRIA" riscado e cai | 2 |
| 50 | `redução da maioridade` | 53,94 | cartão 3 | "MAIORIDADE 16" riscado e cai | 2 |
| 51 | `A Câmara aprova` | 55,78 | Congresso | cuia da Câmara acende; pílula: AS VOTAÇÕES | 3 |
| 52 | `março de 2026` | 56,54 | chip | chip "MARÇO DE 2026" | 3 |
| 53 | `487` | 58,40 | Placar | coluna SIM sobe; `Contador` "487 × 15"; selo S7 | 3 |
| 54 | `15` | 60,08 | Placar | coluna NÃO sobe pouquinho | 3 |
| 55 | `O Senado` | 60,84 | Congresso | cuia do Senado acende, a da Câmara volta ao neutro | 3 |
| 56 | `o dinheiro das bets` | 61,70 | cartão | cartão "DINHEIRO DAS BETS" sai do documento e cai; selo S8 | 3 |
| 57 | `não ter que devolver` | 62,86 | documento | uma seta de volta para a Câmara aparece e é riscada ★ | 3 |
| 58 | `ontem 75` | 64,98 | Placar | colunas zeram e a SIM sobe inteira; `Contador` "75 × 0" | 3 |
| 59 | `zero` (2ª) | 65,94 | Placar | NÃO fica no chão; `ding` | 3 |
| 60 | `Só um ponto dividiu` | 66,46 | Placar | o placar se divide ao meio | 3 |
| 61 | `deixar a maioridade` | 67,90 | chip | chip "TIRAR A MAIORIDADE DA PEC" | 3 |
| 62 | `38` | 69,98 | Placar | duas colunas quase iguais; `Contador` "38 × 36"; selo S9 | 3 |
| 63 | `36` | 70,78 | Placar | a segunda coluna para logo abaixo da primeira; `baque` leve | 3 |
| 64 | `Agora, o que muda` | 71,76 | câmera | voo de volta para a casa; pílula: O QUE MUDA; selo S10 | 4 |
| 65 | `cinco coisas` | 73,72 | 5 marcadores | 5 bolinhas na faixa B (1 a 5); acendem conforme a fala | 4 |
| 66 | `Um` | 74,70 | marcador 1 | bolinha 1 acende | 4.1 |
| 67 | `o Susp entra` | 75,34 | Alicerce | o letreiro "1988" vira "CONSTITUIÇÃO" | 4.1 |
| 68 | `entra na Constituição` | 76,26 | casa | `Onda` verde sai do alicerce | 4.1 |
| 69 | `Pensa no SUS` | 77,02 | chip | chip "COMO O SUS" | 4.1 |
| 70 | `com polícia` | 78,40 | paredes | as portas das duas paredes se abrem (persiana) | 4.1 |
| 71 | `todo mundo` | 79,00 | bonecos | os policiais dos 3 cômodos viram uns para os outros | 4.1 |
| 72 | `dividindo dados` | 79,98 | ArmarioDados + Trilha | fio de luz verde liga os 3 armários de dados | 4.1 |
| 73 | `operações` | 80,48 | bonecos | um boneco de cada cômodo dá um passo para a porta (força-tarefa) | 4.1 |
| 74 | `Dois` | 81,30 | MAPA B | entra o mapa; marcador 2 acende; pílula: A SUA CIDADE | B |
| 75 | `sua cidade` | 82,06 | mapa | municípios acendem em onda | B |
| 76 | `polícia municipal` | 83,10 | mapa | etiqueta PODE CRIAR | B |
| 77 | `ronda na rua` | 84,34 | mapa | a onda corre de novo, mais fraca ★ | B |
| 78 | `Mas só com` | 85,02 | mapa | a onda apaga; ficam alguns acesos | B |
| 79 | `dinheiro próprio` | 85,88 | chip | chip "✓ DINHEIRO PRÓPRIO" (faixa B, lista que cresce) | B |
| 80 | `treinamento padrão` | 86,72 | chip | "✓ TREINAMENTO PADRÃO" | B |
| 81 | `avaliação regular` | 87,76 | chip | "✓ AVALIAÇÃO REGULAR" | B |
| 82 | `Ministério Público` | 89,00 | chip | "✓ MINISTÉRIO PÚBLICO DE OLHO" | B |
| 83 | `Três` | 90,36 | 3D | sai o mapa; quintal da União; marcador 3 | 4.3 |
| 84 | `Rodoviária Federal` | 91,06 | boneco PRF | acende; cômodo UNIÃO no acento | 4.3 |
| 85 | `ferrovias` | 93,02 | TremMini | trilho e trem nascem atrás da União e o trem anda | 4.3 |
| 86 | `rios federais` | 93,74 | rio + NavioMini | a faixa de água nasce e o barco navega | 4.3 |
| 87 | `a Federal ganha` | 94,92 | boneco PF | acende; `Escudo` nasce na frente dele | 4.3 |
| 88 | `facções` | 96,14 | grupo escuro | 3 bonecos escuros recuam diante do escudo | 4.3 |
| 89 | `crime ambiental` | 96,88 | árvore | uma tora cortada e uma árvore de pé ao lado do rio ★ | 4.3 |
| 90 | `Quatro` | 97,86 | câmera | desce para o porão; marcador 4 | 4.4 |
| 91 | `dinheiro garantido` | 98,48 | Cofre | o cofre sobe do chão, cheio de moedas | 4.4 |
| 92 | `não pode mais bloquear` | 99,96 | Cadeado | um cadeado tenta fechar o cofre e é afastado (sai de lado) | 4.4 |
| 93 | `fundos da segurança` | 101,16 | etiqueta | etiqueta 2D no cofre "FUNDO NACIONAL DE SEGURANÇA" | 4.4 |
| 94 | `presídios` | 102,24 | etiqueta | segunda linha "FUNDO PENITENCIÁRIO" | 4.4 |
| 95 | `Metade` | 102,92 | CanoMoedas | cano acende e moedas correm do cofre até o cômodo GOVERNADOR; `Contador` "50%" | 4.4 |
| 96 | `os estados` | 104,12 | cômodo GOVERNADOR | acende quando as moedas chegam | 4.4 |
| 97 | `10%` | 105,20 | Contador | "10%" na faixa B | 4.4 |
| 98 | `sobra` | 106,14 | PlataformaPetroleo | a plataforma nasce e solta 1 pilha de moedas para o cofre | 4.4 |
| 99 | `pré-sal` | 106,98 | etiqueta | "FUNDO SOCIAL DO PRÉ-SAL" na plataforma | 4.4 |
| 100 | `Cinco` | 107,60 | câmera | voa para o presídio ao lado da casa; marcador 5 | 4.5 |
| 101 | `facção e milícia` | 108,22 | pirâmide | a pirâmide de bonecos escuros sobe; chips "FACÇÃO" e "MILÍCIA" | 4.5 |
| 102 | `mais alto o cargo` | 109,76 | pirâmide | os degraus acendem de baixo para cima | 4.5 |
| 103 | `maior a pena` | 111,26 | Grades | as grades descem, mais grossas no topo | 4.5 |
| 104 | `segurança máxima` | 112,70 | PresidioMax | muro e torre sobem em volta | 4.5 |
| 105 | `menos benefícios` | 113,82 | chip | chip "MENOS BENEFÍCIOS" com risco | 4.5 |
| 106 | `perda dos bens` | 114,80 | carro + casa mini | um carrinho e uma casinha da facção afundam no chão | 4.5 |
| 107 | `a vítima` | 115,98 | boneco vítima | boneco `pessoa` nasce fora do muro | 4.5 |
| 108 | `apoio na Justiça` | 116,88 | BalancaJustica | balança da Justiça pequena ao lado da vítima, acende | 4.5 |
| 109 | `a parte que quase` | 118,98 | pílula | pílula: QUASE NINGUÉM VIU; os 5 marcadores saem | 5 |
| 110 | `preso antes` | 121,00 | boneco | um boneco entra numa cela pequena ao lado do presídio | 5 |
| 111 | `condenação definitiva` | 121,72 | chip | chip "SEM CONDENAÇÃO DEFINITIVA" | 5 |
| 112 | `prisão provisória` | 123,38 | chip | troca para "PRISÃO PROVISÓRIA"; selo S11 | 5 |
| 113 | `direito de votar` | 124,94 | Urna | urna nasce do lado de fora das grades | 5 |
| 114 | `enquanto estiver preso` | 125,72 | Cadeado | cadeado fecha a fenda da urna | 5 |
| 115 | `Especialistas` | 127,08 | Balanca | a balança de dois pratos nasce | 5 |
| 116 | `discutem` | 127,80 | Balanca | inclina para a esquerda | 5 |
| 117 | `fere a presunção` | 128,58 | Balanca | inclina para a direita | 5 |
| 118 | `inocência` | 129,64 | Balanca | volta ao meio (os dois lados com o mesmo tempo) | 5 |
| 119 | `o Congresso ganha` | 130,66 | câmera + Congresso | câmera vira para o fundo; Congresso acende | 5 |
| 120 | `barrar regras` | 131,88 | documento | um documento "REGRA" sai dos prédios CNJ e CNMP | 5 |
| 121 | `juízes e promotores` | 133,34 | prédios | letreiros "CNJ" e "CNMP" acendem; etiqueta "CONSELHOS DE JUÍZES E PROMOTORES" | 5 |
| 122 | `área penal` | 134,56 | Carimbo3D | carimbo cai no documento: "BARRADO" (`impacto`) | 5 |
| 123 | `Mas atenção` | 135,58 | câmera | volta para o alicerce; pílula: SÓ A PORTA | 6 |
| 124 | `a Constituição só` | 136,42 | LivroLei | o livro gigante sai do alicerce, de pé | 6 |
| 125 | `abre a porta` | 137,32 | PortaLivro | a porta da capa se abre | 6 |
| 126 | `Pena mais dura` | 138,32 | placa | atrás da porta, a placa tracejada vazia | 6 |
| 127 | `perda de bens` | 139,24 | placa | dois itens tracejados na placa ★ | 6 |
| 128 | `lei nova` | 140,92 | placa | título "LEI NOVA" aparece; chip "AINDA NÃO ESCRITA" | 6 |
| 129 | `o que não muda` | 141,94 | pílula | pílula: NÃO MUDA; o livro desce | 7 |
| 130 | `PM e Polícia` | 142,64 | cômodo GOVERNADOR | acende; os 3 bonecos (PM e Civil) acenam | 7 |
| 131 | `com o governador` | 144,58 | placa | placa GOVERNADOR acende; chip "CONTINUA IGUAL" | 7 |
| 132 | `a maioridade penal segue` | 145,76 | Contador | "18 ANOS" | 7 |
| 133 | `por enquanto` | 147,66 | Contador | o "18" ganha um asterisco ★ | 7 |
| 134 | `outra PEC` | 149,28 | documento | um segundo documento "OUTRA PEC" sai de lado, para o Congresso | 7 |
| 135 | `Falta só` | 150,10 | câmera | Congresso ao fundo; pílula: PRÓXIMO PASSO | 8 |
| 136 | `o Congresso publicar` | 151,18 | DiarioOficial | o Diário Oficial nasce e abre; chip "PROMULGAR = PUBLICAR" | 8 |
| 137 | `Sem assinatura` | 152,18 | chip | chip "SEM SANÇÃO DO PRESIDENTE" com caneta riscada ★ | 8 |
| 138 | `Lula já avisou` | 153,96 | boneco | boneco genérico com etiqueta "LULA" ao lado da casa; selo S12 | 8 |
| 139 | `próximo passo` | 154,92 | AndarObra | pilares do segundo andar sobem em cima da casa | 8 |
| 140 | `Ministério da Segurança` | 156,16 | AndarObra | placa "MINISTÉRIO DA SEGURANÇA PÚBLICA" e material de obra; chip "AINDA NÃO EXISTE" | 8 |
| 141 | `E aí, você quer` | 157,94 | MAPA C | entra o mapa; pílula: E VOCÊ? | C |
| 142 | `quer polícia municipal` | 158,84 | mapa | pontinhos acendem um a um | C |
| 143 | `Me conta` | 160,34 | mapa | etiqueta E AÍ, VOCÊ QUER? | C |
| 144 | `segue o Magno` | 161,84 | mapa | câmera continua girando; o 3D fica escondido até o fim | C |

**Total: 144 eventos em 166 s** (cerca de 0,9 por segundo). Os ★ são extras meus.

## 2.4 Cenas com câmera

Todas as câmeras usam `enquadrar(alvo, larg, alt, dir)` + `cinematizar` (nunca parada). Distâncias abaixo são referência.

### CENA 0: 75 A ZERO (0,00 a 6,68 s) · Eventos 1 a 6
- 0a (0,00 a 4,86): alvo [0, 1,5, -16] (Congresso + plenário à frente) · tamanho 8 m · direção de z+, 30° · avanço lento
- 0b (4,86 a 6,68): grua: sobe por cima da casa e desce até a rua; alvo final [1,5, 1,0, 5,2] · tamanho 4 m · 38°. Zoom em escala logarítmica (regra "zoom contínuo")
- Pílula: 75 A ZERO
- Aha: todo mundo votou a favor, e isso chega na minha rua.

### CENA 1: COMO ERA (6,68 a 21,84 s) · Eventos 7 a 21
- 1a (6,68 a 13,42): alvo [0, 1,5, 0] (casa inteira + alicerce) · tamanho 14 m · de z+, 34° · arco de 10°
- 1b (13,42 a 16,10): alvo [-4, 1,5, 0] (GOVERNADOR) · tamanho 5 m · 30° · avanço
- 1c (16,10 a 18,28): alvo [0, 1,5, 0] (UNIÃO) · tamanho 5 m · 30° · trilho lateral
- 1d (18,28 a 21,84): alvo [4, 1,3, 0] (PREFEITURA) · tamanho 5 m · 32° · trilho lateral
- Pílula: COMO ERA
- Aha: três donos na mesma casa, cada um no seu cômodo.

### MAPA A (21,84 a 36,68 s) · Eventos 22 a 34
- Kit Mapas: Brasil inteiro, câmera parada no país com zoom lento (3%) e leve giro; no "Rio", aproxima até o Sudeste (escala logarítmica) e volta ao país em "cria o Susp".
- Pílula: CADA UM NO SEU QUADRADO → 2018 (em "Em 2018")
- Aha: o crime não respeita divisa, mas a polícia sim.

### CENA 2: A PEC (36,68 a 55,28 s) · Eventos 35 a 50
- 2a (36,68 a 47,22): alvo [-11, 1,0, -8] (mesa dos governadores) · tamanho 7 m · de cima, 42° (regra "plateia nos cantos": câmera alta) · arco de 15°
- 2b (47,22 a 55,28): alvo [-3, 1,2, -11] (mesa do relator, com os cartões no ar) · tamanho 5 m · 36° · avanço lento
- Pílula: A PEC
- Aha: PEC é mudar a Constituição, e a Câmara tirou três coisas.

### CENA 3: AS VOTAÇÕES (55,28 a 71,76 s) · Eventos 51 a 63
- 3a (55,28 a 64,26): alvo [2, 2, -13] (Congresso + placar no mesmo quadro: regra "dois nomes em menos de 1 s") · tamanho 10 m · 28° · arco
- 3b (64,26 a 71,76): alvo [4, 1,5, -11] (placar) · tamanho 5 m · 24° · avanço
- Pílula: AS VOTAÇÕES
- Aha: unanimidade na PEC, empate quase na maioridade.

### CENA 4: O QUE MUDA (71,76 a 117,96 s, com o MAPA B no meio) · Eventos 64 a 108
- 4.0 (71,76 a 74,70): voo do Congresso de volta à casa (escala logarítmica) · alvo final [0, 1,5, 0] · tamanho 14 m · 34°
- 4.1 (74,70 a 81,30): alvo [0, 1,2, 0] (casa inteira, para ver as portas e o fio) · tamanho 12 m · de cima, 44° (para ver dentro dos cômodos) · grua
- MAPA B (81,30 a 90,36)
- 4.3 (90,36 a 97,86): alvo [0, 1, -3,5] (União + quintal de trás) · tamanho 7 m · por cima do telhado, de z+, 48° · arco
- 4.4 (97,86 a 107,60): alvo [0, 0,8, 2,6] (cofre na frente do alicerce + cano até o GOVERNADOR) · tamanho 9 m · 30° · trilho para a esquerda acompanhando as moedas
- 4.5 (107,60 a 117,96): alvo [10, 1,8, 0,5] (presídio) · tamanho 8 m · 38° · grua subindo com a pirâmide
- Pílulas: O QUE MUDA → 1. SUSP → 2. SUA CIDADE → 3. PRF E PF → 4. DINHEIRO → 5. FACÇÕES
- Aha: cinco reformas na casa.

### CENA 5: QUASE NINGUÉM VIU (117,96 a 135,20 s) · Eventos 109 a 122
- 5a (117,96 a 130,30): alvo [9, 1, 3] (cela, urna e balança) · tamanho 6 m · 34° · arco lento
- 5b (130,30 a 135,20): alvo [4, 2, -14] (Congresso + prédios CNJ e CNMP) · tamanho 10 m · 30° · avanço
- Pílula: QUASE NINGUÉM VIU
- Aha: preso sem condenação não vota; e o Congresso ganha uma trava sobre os conselhos.

### CENA 6: SÓ A PORTA (135,20 a 141,38 s) · Eventos 123 a 128
- 6a: alvo [0, 1,8, 3,8] (livro e porta) · tamanho 4,5 m · 22° (de frente, para ler a placa) · avanço até a porta
- Pílula: SÓ A PORTA
- Aha: muita coisa ainda depende de lei.

### CENA 7: NÃO MUDA (141,38 a 150,10 s) · Eventos 129 a 134
- 7a: alvo [-4, 1,5, 0] (GOVERNADOR) · tamanho 6 m · 30° · arco
- Pílula: NÃO MUDA
- Aha: as polícias dos estados continuam com o governador; maioridade continua 18.

### CENA 8: PRÓXIMO PASSO (150,10 a 157,94 s) · Eventos 135 a 140
- 8a (150,10 a 153,70): alvo [0, 1,5, -13] (Congresso + Diário Oficial) · tamanho 7 m · 30°
- 8b (153,70 a 157,94): alvo [0, 3, 0] (casa com o andar em obra) · tamanho 13 m · 30° · grua subindo
- Pílula: PRÓXIMO PASSO
- Aha: falta publicar, e vem um ministério novo.

### MAPA C (157,94 até o fim) · Eventos 141 a 144
- Kit Mapas: municípios do Brasil, câmera girando devagar.
- Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Tudo no `audio/fontes.md` (checado em 04/11/2026). Na tela:

| Fato | Na tela |
|---|---|
| Senado 73 e 75 votos, nenhum contra | "75 × 0" |
| Câmara, 04/03/2026 | "487 × 15" (1º turno) |
| Desmembramento da maioridade | "38 × 36" |
| Constituição de 1988, art. 144 | letreiro "1988", placas dos cômodos |
| Intervenção no Rio, Susp por lei | "INTERVENÇÃO FEDERAL · 2018", rede de capitais |
| Fundos: 50% para estados, 10% do superávit do Fundo Social | "50%", "10%" |
| 5.570 municípios (IBGE) | o mapa B mostra a malha (o número não vai escrito: não é falado) |
| Presos provisórios sem direitos políticos | urna com cadeado + selo Agência Câmara |
| Ministério da Segurança Pública | "AINDA NÃO EXISTE" |

**Conferir antes de publicar:** se a emenda já foi promulgada (muda "Falta só"); "ontem" só vale postando em 04/11/2026; se o ministério foi criado.

## 2.6 Trilha e sons

- Narração em 1. Sem trilha (o Estúdio não traz música; se você tiver uma sem direitos, vai em `sfx/trilha.wav`).
- `whoosh` (0,3): entrada e saída de cada mapa e os voos de câmera (eventos 5, 22, 35, 45, 64, 74, 83, 90, 100, 119, 123, 135, 141).
- `tique` (0,25): cada troca de pílula e cada marcador de 1 a 5.
- `pop` (0,3): objetos e chips que entram (placas, bonecos, chips do checklist, etiquetas do cofre).
- `subida` (0,3): colunas do placar (53, 58, 62).
- `ding` (0,35): "75 × 0" (2 e 59), portas abertas do Susp (70).
- `baque` (0,3): cartões que caem (48 a 50, 56), "36" (63).
- `impacto` (0,35): carimbo "BARRADO" (122), grades (103).
- `bip` (0,25): ícones do mapa A (24, 25).

## 2.7 Arquivos

**Novos (Estúdio 3D):**
- `src/videos/pecseguranca/PecSeguranca.tsx`: o vídeo.
- `src/videos/pecseguranca/pecas.tsx`: peças novas:
  - `CasaSeguranca`: casa cortada com 3 cômodos, paredes com porta tipo persiana (`portas`), `luz` por cômodo, telhado.
  - `Alicerce`: laje com letreiro que troca de "1988" para "CONSTITUIÇÃO".
  - `ArmarioDados`: armário de gavetas com etiqueta "DADOS".
  - `TremMini`: locomotiva e 2 vagões genéricos, andando num trilho.
  - `PresidioMax`: muro, torre (sem luz piscando), portão e a pirâmide de 3 degraus com grades por degrau.
  - `PlacarParede`: duas colunas SIM e NÃO que sobem.
  - `PortaLivro`: porta na capa do livro + placa tracejada "LEI NOVA".
  - `AndarObra`: estrutura de pilares e vigas, tábuas, cones e tijolos, com placa.
  - `CartaoVoa`: cartão de texto que sai do documento, fica no ar e cai.
- `src/videos/pecseguranca/palavras.ts` (já pronto).

**Novos (Kit Mapas):**
- `src/videos/pec-seguranca/` (`index.tsx`, `roteiro.ts`, `dados/`), com os tempos tirados do `palavras.ts` do 3D.
- `scripts/dados-pec-seguranca.py`: estados e municípios do Brasil (IBGE), capitais.
- Saída: `out/PecSeguranca.mp4` → copiado para `projetos/018. pec da segurança/mapas/pec.mp4`.

**Alterados:** `src/Root.tsx` do Estúdio (4 composições: `PecSeguranca`, `PecSegurancaGuia`, `PecSegurancaLimpo`, `CapaPecSeguranca`) e `src/Root.tsx` do Kit Mapas (1 linha).

**Reaproveitados do catálogo:** `Congresso`, `Plenario`, `PostoGuarda`, `PosteLampada`, `PredioColunas`, `Cofre`, `Cadeado`, `CanoMoedas`, `Moeda`, `PlataformaPetroleo`, `NavioMini`, `Escudo`, `Grades`, `Urna`, `Balanca`, `BalancaJustica`, `Carimbo3D`, `DocumentoGrande`, `LivroLei`, `DiarioOficial`, `Quepe`, `Boneco`, `Placa`, `Trilha`, `Onda`.

**Render:** 5013 quadros, em 7 partes de até 800.

## 2.8 Origem das escolhas

**Das regras (`_aprendizados.md`):**
- Juntar os kits com `OffthreadVideo` em `Sequence`, entrada e saída de 0,2 s; selos do 3D no topo por cima do mapa (013); `TagNoMapa` com `sai` numérico (013).
- Mapa do Brasil com contorno do IBGE, divisas finas e estado citado aceso por inteiro (005).
- Política com nomes reais: boneco genérico com etiqueta, sem rosto; políticos em `objeto` (011).
- Tema polêmico: balança para os dois lados e volta ao meio, mesmo tempo (presos provisórios).
- Interior de prédio: parede sobe como persiana (portas do Susp).
- Obra sem guindaste: material de obra (014).
- Zoom grande em escala logarítmica (voos Congresso ↔ casa).
- Câmera alta com plateia (mesa dos governadores).
- Rótulo de número com pelo menos 1,5 s na tela (014).
- Uma animação por palavra-chave e o máximo de objetos.
- Fonte bem visível e nada sobreposto (pedidos do 016).

**Escolhas minhas (diretor):**
- A casa de bonecas com três cômodos: veio da própria frase do roteiro ("uma casa com vários donos").
- A reforma da casa nas "cinco coisas", para a pessoa ver que é a mesma casa mudando.
- Os 5 marcadores numerados na faixa B (ajudam a contar).
- O andar em obra para o ministério que ainda não existe.
- Os extras ★ da tabela.
