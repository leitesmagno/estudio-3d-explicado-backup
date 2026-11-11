# Plano de cenas: 017. orçamento de itabuna (versão 1, aprovada em 04/11/2026)

Código `orcamentoitabuna` · Nome `OrcamentoItabuna` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **dois trechos de mapa** do Kit Mapas Animados no começo (satélite de Itabuna e do Brasil).
**Mesma série do 014 (orçamento de Ilhéus):** mesmo mundo (maquete redonda com o cofre no meio e pilhas de moedas), para o perfil ficar reconhecível. Muda a cidade (rio Cachoeira atravessando a maquete, sem mar) e a história.
**Regra deste vídeo:** todo número vem dos PDFs da Prefeitura de Itabuna (portal da transparência). Nenhum número, nome ou documento de Ilhéus entra na tela.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v3) · preparo: 1,3x (pedido do Magno para caber nos 2:50), volume -15 · duração **171,04 s** · `AUDIO_SEG = 171.04` · `QUADROS = 5158` (com 0,9 s de folga).
- 486 palavras (igual ao roteiro); a última ("direitos.") termina em 170,84 s. Tempos sempre sobem, sem buraco maior que 1,5 s.
- Ajustes: nenhum. Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas** (o `quando()` certo):

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| saúde | 26,6 · 33,2 · 152,0 | `quando('Saude')` (1ª, 26,6) · `quando('reais da saude')` · `quando('A saude recebeu')` |
| educação | 15,1 · 36,0 · 125,3 · 155,7 | `quando('fundo da educacao')` · `quando('236')` · `quando('pagar a educacao')` · `quando('A educacao, 25,8%')` |
| Câmara | 44,5 · 71,9 | `quando('A Camara de Vereadores')` · `quando('a Camara inteira')` |
| segurança pública | 47,9 · 76,4 | `quando('toda a seguranca')` · `quando('Seguranca publica: 13')` |
| 27 | 45,6 · 73,9 | `quando('27')` · `quando('27', 2)` |
| 13 | 38,8 · 77,4 | `quando('13 milhoes')` · `quando('13.')` → `quando('publica: 13')` |
| obras | 54,8 · 85,4 | `quando('As obras de')` · `quando('obras e equipamentos')` |
| teto | 99,2 · 106,9 · 136,3 | `quando('um teto')` · `quando('Passou do teto')` · `quando('Colado no teto')` |
| 54% | 100,3 · 134,1 | `quando('maximo 54%')` · `quando('perto de 54%')` |
| 2025 | 2,6 · 103,2 | `quando('reais em 2025')` · `quando('Em 2025, Itabuna')` |
| dívida | 91,7 · 123,4 | `quando('a divida levou')` · `quando('uma divida que')` |
| receita | 101,5 · 129,0 | `quando('da receita')` · `quando('inflou a receita')` |
| pessoal | 102,4 · 133,0 | `quando('para pessoal')` · `quando('com pessoal ficaria')` |
| prefeitura | 4,8 · 42,3 | `quando('contas da prefeitura')` · `quando('administracao da prefeitura')` |
| impostos | 17,1 · 23,9 · 153,7 | `quando('os impostos da')` · `quando('dos impostos da')` · `quando('dos impostos, e')` |
| União | 22,3 · 124,6 | `quando('A Uniao manda')` · `quando('a Uniao pagar')` |
| transporte | 61,5 · 66,3 | `quando('conta do transporte')` · `quando('transporte coletivo')` |
| professores | 137,3 · 144,8 | `quando('os professores')` · `quando('professores com direito')` |
| mínimo | 154,5 · 158,4 | `quando('minimo e 15')` · `quando('minimo e 25')` |
| previstos | 80,7 · 87,8 | `quando('previstos no')` · `quando('milhoes previstos')` |
| milhões | 20 vezes | nunca sozinho; sempre com o número antes |
| agora | 25,0 · 59,3 · 94,5 | `quando('para onde foi')` · `quando('uma curiosidade')` · `quando('maior conta')` |

## 2.2 Ideia e mundo

**A metáfora: a maquete de Itabuna com o cofre no meio** (a mesma do 014, para a série). Uma mesa redonda com a cidade em miniatura: o **rio Cachoeira** atravessa a mesa ao fundo, com duas pontes baixas; casinhas e morros verdes na borda. No centro, o **cofre da prefeitura**. **Cada 10 milhões de reais são uma pilha de moedas**: os 1,1 bilhão viram **110 pilhas** em volta do cofre. Quando o narrador diz cada área, as pilhas deslizam do cofre para o prédio daquela área e o número digita ao lado. Assim a pessoa vê o tamanho de cada gasto sem fazer conta.

O que é novo neste vídeo, para cada curiosidade ter uma imagem própria:
- **Pilhas fantasmas do "previsto"** (douradas a 30%) ao lado das pilhas do "gasto": obras de infraestrutura (128 × 36), defesa civil (71 × quase nada), obras e equipamentos (218 × 33).
- **A gaveta escondida do relatório:** o caderno do RREO abre na página 8 e mostra, dentro de "Encargos especiais", a linha "TRANSPORTES COLETIVOS URBANOS"; é de lá que saem as pilhas do ônibus.
- **A caixa do Fundef:** um caixote grande com o carimbo "SÓ PARA O ENSINO", com 21 pilhas dentro, que entra no lado da receita da régua e faz o líquido baixar. Depois a caixa sai e o líquido volta a subir.

**A unidade fixa:** placar pequeno no canto de cima, da cena 1 até a cena 7: **"1 PILHA = R$ 10 MILHÕES"**.

**Os dois trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: "ITABUNA"** | do início (0,00) até `Primeiro, de onde` (7,50) | 7,5 s | Voo do Brasil até o sul da Bahia, descendo no satélite até Itabuna. O contorno do município (IBGE 2914802) acende em verde. Em "1 bilhão" digita **R$ 1,1 BILHÃO** no meio do município; embaixo, "GASTOS DE 2025". Em "abri as contas" entra a etiqueta "PREFEITURA DE ITABUNA". |
| **MAPA 2: "DE ONDE VEIO"** | de `Primeiro, de onde` (7,50) até `para onde foi` (25,00) | 17,5 s | O mapa recua até ver Brasília, Salvador e Itabuna no mesmo quadro. Em "governo federal" uma seta curva sai de **Brasília** com **UNIÃO · R$ 543 MI**; em "estado" outra sai de **Salvador** com **ESTADO · R$ 127 MI**; em "Fundeb" uma etiqueta **FUNDEB · R$ 108 MI** entra junto de Itabuna; em "impostos da cidade" Itabuna acende e sai **IPTU + ISS · R$ 169 MI** (a menor). Em "triplo" as etiquetas da União e dos impostos ficam lado a lado com "3×" entre elas. |

- Os trechos saem **sem legenda, sem marca d'água e sem som**, em 1080 × 1920, num MP4 só, e entram no 3D por **um** `OffthreadVideo` dentro de uma `Sequence` (regra do 015), com saída de 0,2 s e whoosh. Selos do 3D por cima do mapa vão no topo (y 470).
- Contorno de Itabuna: malha do IBGE (município 2914802). Brasília e Salvador: pontos das capitais.

**Protagonista:** não há. O "personagem" é o dinheiro (as pilhas). Pessoas só como bonecos genéricos sem rosto: gari (ruas), passageiros no ponto, guarda, professores (cena 10).

**Selos de fonte (mais em evidência, pedido do 016):** cartão no alto, logo abaixo da pílula, com documento e página, letra média, fundo `tema.painel`. Um por dado, na hora em que o dado é dito.

| Selo | Entra em | Texto |
|---|---|---|
| Total | `1 bilhao` (0,70), no MAPA 1 | FONTE: RREO DEZ/2025 · PREFEITURA DE ITABUNA · P. 3 |
| Receitas | `governo federal` (9,50), no MAPA 2 | FONTE: RREO DEZ/2025 · P. 1 (RECEITAS) |
| Saúde, educação, administração, Câmara, segurança, assistência, cultura | `366` (28,00) | FONTE: RREO DEZ/2025 · P. 6 E 7 (2024: RREO DEZ/2024 · P. 7) |
| Ruas | `111` (50,50) | FONTE: RREO DEZ/2025 · P. 7 (URBANISMO) |
| Ônibus | `outra parte do relatorio` (64,10) | FONTE: RREO DEZ/2025 · P. 8 · ENCARGOS ESPECIAIS |
| Defesa civil | `defesa civil` (78,90) | FONTE: RREO DEZ/2025 · P. 6 (DOTAÇÃO INICIAL × LIQUIDADO) |
| Obras e dívida | `obras e equipamentos` (85,40) | FONTE: RREO DEZ/2025 · P. 3 (INVESTIMENTOS, JUROS E AMORTIZAÇÃO) |
| O teto | `um teto` (99,20) | FONTE: RGF DEZ/2025 · P. 1 · LRF, ART. 20 E 23 |
| 2026 | `caiu para 44%` (114,80) | FONTE: RGF AGO/2026 · P. 2 |
| Fundef | `208` (120,60) | FONTE: RREO AGO/2026 · P. 10 (FEV/26) · EC 114/2021 |
| Conta nossa | `pelas nossas contas` (131,50) | CONTA DO VÍDEO: 532,7 ÷ (1.200,7 − 208) = 53,7% |
| Professores | `40 milhoes` (139,50) | FONTE: LEI MUNICIPAL 2.163/2026 · EDITAL 03/2026 (DOM 21/09) |
| Pisos | `minimos da lei` (150,30) | FONTE: RREO DEZ/2025 · P. 41 E 42 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` misturado com `tema.areia` 25% (como no 014) |
| chão da maquete | `tema.areia` (tom médio) e `tema.vegetacao` |
| rio Cachoeira | `tema.agua` fosco, sem reflexo forte |
| prédios | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| moedas e pilhas | dourado da paleta de apoio (o mesmo do 014), nunca o acento |
| pilhas do "previsto" (fantasmas) | o mesmo dourado a 30% de opacidade |
| o que passou do limite, o que caiu, o que não saiu do papel | marsala da paleta de apoio (`tema.alerta`), fosco |
| caixa do Fundef | madeira clara (`tema.areia`) com carimbo em `tema.objetoEscuro`; nunca o acento |
| o que a cena aponta (número dito em destaque, contorno de Itabuna, 57%, 53,7%) | `tema.acento` (verde) |

**Mapa do mundo** (mesa redonda de raio 9 m; tampo em y = 0; a frente da câmera é z+):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa redonda | [0, 0, 0] | `MesaMaquete` (014) |
| Rio Cachoeira | faixa curva de x -9 a 9, em z ≈ -7 | peça nova `RioMaquete`: faixa de água fosca, 1,2 m de largura, com margens verdes; "RIO CACHOEIRA" como chip 2D só no plano aberto da cena 1 ★ |
| Duas pontes | [-3, 0, -7] e [3,5, 0, -7] | `PonteMini` (014) |
| Casinhas e morros da borda | anel de raio 7 a 8,5, atrás (z < -3) | `CasaMini` e `Casinha` (catálogo) baixas; morros como meias-esferas verdes ★ |
| Cofre da prefeitura | [0, 0, 0] | `CofreFGTS` (catálogo), escala 1,6; abre em "para onde foi"; afunda na cena 8 |
| 110 pilhas | anel de raio 1,8 em volta do cofre | `PilhasDinheiro` (014), 1 pilha = 10 mi |
| Hospital (saúde) | [-2,0, 0, -4,8] | `PostoSaude` (014) maior (escala 1,4) e com letreiro "SAÚDE"; ao lado, ambulância genérica branca sem cruz ★; pilhas em [-2,0, 0, -3,0] |
| Escola | [-5,0, 0, -2,4] | `Escola` (014), letreiro "EDUCAÇÃO"; pilhas em [-5,0, 0, -0,8] |
| Prefeitura | [2,4, 0, -4,8] | `Prefeitura` (014), letreiro "PREFEITURA"; pilhas em [2,4, 0, -3,1] |
| Câmara de Vereadores | [5,4, 0, -2,6] | `CamaraVereadores` (014), letreiro "CÂMARA"; pilhas em [4,2, 0, -1,4] |
| Guarda municipal | [6,2, 0, 0,8] | `PostoGuarda` (014) + boneco de quepe; pilhas em [5,0, 0, 1,2] (fica ao lado da Câmara, para o "dobro" caber num plano só) |
| Rua da cidade | faixa de x -6,5 a -2, z 2,5 | peça nova `RuaServicos`: rua com dois postes de luz, um gari com carrinho, um caminhão de lixo pequeno e cones de obra ★; pilhas em [-4,2, 0, 4,0] |
| Ponto e ônibus | [1,5, 0, 5,8] | `Onibus` (catálogo) andando devagar num trecho de rua; `PontoOnibus` (016) com 3 passageiros; pilhas em [3,2, 0, 4,6] |
| Placa "TRANSPORTE" | [0, 0, 4,6] | placa pequena com uma pilha quase vazia (0,2) |
| Assistência social | [-6,4, 0, 0,6] | peça nova `PredioAssistencia`: prédio baixo com letreiro "ASSISTÊNCIA SOCIAL" e banco na frente |
| Cultura | [-4,6, 0, -5,4] | peça nova `TeatroMini`: fachada com arco e letreiro "CULTURA" |
| Defesa civil | [6,8, 0, 3,4] | peça nova `BaseDefesaCivil`: galpão com letreiro "DEFESA CIVIL" e uma viatura genérica laranja-escura ★ |
| Obra (obras e equipamentos) | [-1,2, 0, 3,0] | material de obra (tijolos, tábuas, `Cone`, `RoloCompactador`), sem guindaste (regra do 014) |
| Banco da dívida | [4,0, 0, 7,0] | peça nova `BancoDivida`: prédio com colunas e letreiro "PAGAMENTO DA DÍVIDA" (sem nome de banco real) |
| Mesa dos relatórios | [0, 0, 7,4] | `RelatorioPDF` (014): "RREO DEZ/2025", "RREO DEZ/2024", "RGF DEZ/2025", "RREO AGO/2026" |
| Régua do teto | [0, 0, 0] | `ReguaLimite` (014): coluna de vidro com as faixas 48,6, 51,3 e 54; sobe no lugar do cofre |
| Placas da punição | [-1,6 / 1,6, 0, 2] | `PlacaProibido` (014): "VERBAS EXTRAS" e "NOVOS EMPRÉSTIMOS" |
| Calendário de 8 meses | [0, 0, 2,6] | peça nova `CalendarioMeses`: 8 folhas em fila que viram uma a uma ★ |
| Caixa do Fundef | entra de [-6, 0, 2] até [-2,2, 0, 0,6] | peça nova `CaixaFundef`: caixote com tampa, carimbo "FUNDEF · SÓ PARA O ENSINO" e 21 pilhas dentro |
| Balança da Justiça | [-3,6, 0, -1] | `Balanca` (catálogo) pequena, só no "a Justiça mandou" |
| Professores | 24 bonecos em meia-lua em [0, 0, 3] | `Multidao` (catálogo) com crachá; nascem em "os professores"; afundam no fim da cena 10 |
| Prancheta da lista | [2,2, 0, 3,4] | peça nova `ListaHabilitados`: prancheta em pé com linhas e "2.236" |
| Copos dos pisos | saúde [-1,8, 0, 0] · educação [1,8, 0, 0] | `CopoPiso` (014) |
| Tribunal de Contas | [0, 0, -3,6] | `PredioTCM` (014) |

**Regras visuais:**
- Dinheiro sempre dourado; o verde do acento só no que a cena aponta.
- Cada número dito digita na tela como chip ao lado das pilhas, igual à fala (366 MI, 236 MI...); o valor exato do PDF vai pequeno embaixo (ex.: "R$ 365,60 MI").
- Neutro politicamente: sem nome de prefeito, sem partido, sem cor de partido, sem "ano de eleição".
- Nada pisca; tudo acende em pelo menos 0,4 s. Cada número fica pelo menos 1,5 s na tela.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Itabuna gastou` | 0,00 | MAPA 1 | Brasil visto de cima; câmera já descendo para a Bahia | M1 |
| 2 | `1 bilhao` | 0,70 | MAPA 1 | contorno de Itabuna acende em verde; selo do total | M1 |
| 3 | `100 milhoes` | 1,40 | MAPA 1 | **R$ 1,1 BILHÃO** digita no meio do município | M1 |
| 4 | `reais em 2025` | 2,20 | MAPA 1 | chip "GASTOS DE 2025" embaixo do número | M1 |
| 5 | `abri as contas` | 4,20 | MAPA 1 | etiqueta "PREFEITURA DE ITABUNA" | M1 |
| 6 | `A pagina` | 5,40 | selo 2D | ★ ícone de página com "P. 3" entra no selo do topo, mostrando onde a fonte fica | M1 |
| 7 | `Primeiro, de onde` | 7,50 | MAPA 2 | o mapa recua até ver Brasília, Salvador e Itabuna | M2 |
| 8 | `governo federal` | 9,50 | MAPA 2 | seta de Brasília com moedinha correndo; selo das receitas | M2 |
| 9 | `543` | 10,40 | MAPA 2 | **UNIÃO · R$ 543 MI** | M2 |
| 10 | `O estado` | 12,10 | MAPA 2 | seta de Salvador | M2 |
| 11 | `127` | 12,90 | MAPA 2 | **ESTADO · R$ 127 MI** | M2 |
| 12 | `Fundeb` | 14,10 | MAPA 2 | etiqueta **FUNDEB** junto de Itabuna | M2 |
| 13 | `108` | 16,00 | MAPA 2 | completa: **FUNDEB · R$ 108 MI** | M2 |
| 14 | `os impostos da` | 17,00 | MAPA 2 | Itabuna acende | M2 |
| 15 | `IPTU` | 18,30 | MAPA 2 | chip "IPTU + ISS" | M2 |
| 16 | `169` | 20,40 | MAPA 2 | **R$ 169 MI**, a menor das quatro etiquetas | M2 |
| 17 | `A Uniao manda` | 21,70 | MAPA 2 | etiquetas da União e dos impostos ficam lado a lado | M2 |
| 18 | `triplo` | 23,40 | MAPA 2 | "3×" grande entre as duas | M2 |
| 19 | `para onde foi` | 25,60 | troca | whoosh; maquete inteira vista de cima, 110 pilhas em volta do cofre; placar "1 PILHA = R$ 10 MILHÕES" | 1 |
| 20 | `foi.` (fim da frase) | 26,00 | cofre | porta do cofre abre | 1 |
| 21 | `Saude:` → `quando('Saude')` | 26,60 | hospital | sobe do chão; letreiro SAÚDE acende; ambulância chega ★ | 1 |
| 22 | `366` | 28,00 | 36,6 pilhas | deslizam do cofre para a frente do hospital (em onda); chip **366 MI**; selo das áreas | 1 |
| 23 | `maior fatia` | 29,50 | pilhas | ★ coroa leve de luz em volta do grupo (0,6 s) | 1 |
| 24 | `1 de cada 3` | 30,40 | 3 moedas grandes | em pé na frente; 1 acende | 1 |
| 25 | `7 de cada 10` | 31,90 | pilhas da saúde | dividem-se em dois grupos: 25,9 pilhas (7 de 10) e o resto | 1 |
| 26 | `hospital e atendimento` | 33,80 | chip | "HOSPITAL E ATENDIMENTO ESPECIALIZADO · 259 MI" no grupo maior | 1 |
| 27 | `Educacao:` → `quando('Educacao')` | 36,00 | escola | sobe; letreiro EDUCAÇÃO; hospital volta ao neutro | 2 |
| 28 | `236` | 37,30 | 23,6 pilhas | deslizam; chip **236 MI** | 2 |
| 29 | `13 milhoes` | 38,80 | fantasmas | ao lado, 24,9 pilhas transparentes de 2024 | 2 |
| 30 | `a menos` | 39,70 | 1,3 pilha | a diferença fica marsala e afunda; chip **−13 MI** | 2 |
| 31 | `em 2024` | 40,10 | chip | "2024: 249 MI" | 2 |
| 32 | `administracao da prefeitura` | 41,60 | prefeitura | sobe; letreiro PREFEITURA | 3 |
| 33 | `97` | 42,90 | 9,7 pilhas | deslizam; chip **97 MI** | 3 |
| 34 | `A Camara de Vereadores` | 44,30 | Câmara | sobe; letreiro CÂMARA | 3 |
| 35 | `27` | 45,60 | 2,7 pilhas | deslizam; chip **27 MI** | 3 |
| 36 | `o dobro` | 47,00 | guarda | posto da guarda sobe ao lado | 3 |
| 37 | `toda a seguranca` | 47,60 | 1,3 pilha | desliza para a guarda; chip "SEGURANÇA · 13 MI"; as duas pilhas lado a lado, a da Câmara com o dobro da altura | 3 |
| 38 | `Ruas e servicos` | 49,00 | rua | rua sobe; postes acendem devagar; gari anda | 4 |
| 39 | `111` | 50,50 | 11,1 pilhas | deslizam; chip **111 MI**; selo das ruas | 4 |
| 40 | `limpeza` | 52,50 | caminhão de lixo ★ | anda pela rua | 4 |
| 41 | `iluminacao` | 53,20 | postes | luz amarela suave sobe | 4 |
| 42 | `manutencao` | 53,90 | 6,7 pilhas | separam-se: chip "LIMPEZA, LUZ, MANUTENÇÃO · 67 MI" | 4 |
| 43 | `As obras de` | 54,50 | cones e tábuas | material de obra aparece na rua | 4 |
| 44 | `previstas em 128` | 56,00 | 12,8 fantasmas | pilhas transparentes ao lado da obra; chip "PREVISTO: 128 MI" | 4 |
| 45 | `Sairam 36` | 58,10 | 3,6 pilhas | só 3,6 enchem de ouro; o resto continua fantasma; chip **36 MI** em verde | 4 |
| 46 | `uma curiosidade` | 59,90 | câmera | sobe e vai para a frente da mesa; tique | 5 |
| 47 | `conta do transporte` | 61,10 | placa | placa "TRANSPORTE" sobe | 5 |
| 48 | `so 2 milhoes` | 62,50 | 0,2 pilha | uma pilha fininha; chip **2 MI** | 5 |
| 49 | `outra parte do relatorio` | 64,10 | caderno | o RREO DEZ/2025 desliza para a frente e abre na página 8; selo do ônibus | 5 |
| 50 | `linha chamada` | 65,80 | linha do caderno | uma linha da página acende: "ENCARGOS ESPECIAIS" | 5 |
| 51 | `transporte coletivo` | 66,30 | linha | embaixo dela acende "TRANSPORTES COLETIVOS URBANOS" | 5 |
| 52 | `44` | 68,10 | 4,4 pilhas | saem da página e deslizam até o ponto; chip **44 MI** | 5 |
| 53 | `onibus da cidade` | 70,30 | ônibus | entra andando e para no ponto; passageiros sobem ★ | 5 |
| 54 | `a Camara inteira` | 71,90 | comparação | as 2,7 pilhas da Câmara aparecem (cópia transparente) ao lado das 4,4 do ônibus | 5 |
| 55 | `Assistencia social` | 72,80 | prédio | `PredioAssistencia` sobe | 6 |
| 56 | `27` (2ª) | 73,90 | 2,7 pilhas | deslizam; chip **27 MI** | 6 |
| 57 | `Cultura` | 75,20 | teatro | `TeatroMini` sobe | 6 |
| 58 | `14` | 75,70 | 1,4 pilha | chip **14 MI** | 6 |
| 59 | `Seguranca publica: 13` | 76,40 | guarda | acende de novo; chip **13 MI** | 6 |
| 60 | `E repara` | 77,70 | câmera | vira para a base da defesa civil; tique | 6 |
| 61 | `defesa civil` | 78,90 | galpão | `BaseDefesaCivil` sobe; selo da defesa civil | 6 |
| 62 | `71` | 79,70 | 7,1 fantasmas | pilhas transparentes enfileiradas; chip "PREVISTO: 71 MI" | 6 |
| 63 | `Gastou 105` | 82,00 | 1 moeda | uma moedinha só enche de ouro (105 mil é 1% de uma pilha); chip **105 MIL** em verde; as fantasmas ficam marsala | 6 |
| 64 | `Somando todas` | 84,10 | câmera | sobe para ver a mesa inteira; todos os prédios acendem de leve juntos | 7 |
| 65 | `obras e equipamentos` | 85,40 | obra | material de obra no centro da frente; selo das obras | 7 |
| 66 | `218` | 86,70 | 21,8 fantasmas | grade de pilhas transparentes; chip "PREVISTO: 218 MI" | 7 |
| 67 | `33 gastos` | 88,60 | 3,3 pilhas | só 3,3 enchem de ouro; chip **33 MI** | 7 |
| 68 | `Nem 1 real em cada 6` | 89,80 | 6 moedas grandes ★ | em pé; nenhuma acende inteira (a 1ª enche só 90%) | 7 |
| 69 | `a divida levou` | 91,60 | banco | `BancoDivida` sobe | 7 |
| 70 | `62` | 92,20 | 6,2 pilhas | deslizam do cofre para o banco; chip **62 MI** | 7 |
| 71 | `Quase o dobro` | 93,50 | comparação | as 6,2 pilhas da dívida ao lado das 3,3 das obras; "≈ 2×" | 7 |
| 72 | `maior conta` | 95,30 | câmera | sobe para o centro; tudo volta ao neutro; prédios afundam meio metro | 8 |
| 73 | `os salarios` | 96,50 | régua | cofre e pilhas afundam; a régua sobe no centro | 8 |
| 74 | `Lei de Responsabilidade` | 97,70 | chip | "LEI DE RESPONSABILIDADE FISCAL" | 8 |
| 75 | `um teto` | 99,10 | régua | tampa no alto da régua; selo do teto | 8 |
| 76 | `maximo 54%` | 99,90 | faixa | faixa do topo "54% MÁXIMO" | 8 |
| 77 | `da receita` | 101,50 | chip | "GASTO COM PESSOAL ÷ RECEITA" | 8 |
| 78 | `Em 2025, Itabuna` | 103,00 | líquido | sobe devagar | 8 |
| 79 | `57%` | 105,10 | líquido | passa da faixa de 54% e para em 57%; a parte acima do teto fica marsala; número **57%** em verde | 8 |
| 80 | `Passou do teto` | 106,30 | tampa | a tampa balança (sem flash) | 8 |
| 81 | `8 meses` | 107,90 | calendário | 8 folhas sobem na frente | 8 |
| 82 | `cortar o excesso` | 108,70 | calendário | as folhas viram uma a uma (0,15 s cada) | 8 |
| 83 | `verbas extras` | 110,70 | placa 1 | "VERBAS EXTRAS DO GOVERNO" + X carimba | 8 |
| 84 | `novos emprestimos` | 112,50 | placa 2 | "NOVOS EMPRÉSTIMOS" + X | 8 |
| 85 | `Em 2026` | 113,50 | placas, calendário | afundam; chip "2026 (ATÉ AGOSTO)" | 9 |
| 86 | `caiu para 44%` | 114,80 | líquido | desce até 44%; número **44%**; selo de 2026 | 9 |
| 87 | `Parece resolvido` | 116,10 | ★ selo "OK?" | aparece pequeno, com ponto de interrogação | 9 |
| 88 | `nao e bem assim` | 117,70 | selo | o "OK?" some devagar | 9 |
| 89 | `Em fevereiro` | 119,00 | calendário ★ | uma folha "FEV/2026" sobe ao lado | 9 |
| 90 | `de uma vez` | 120,20 | caixa | a `CaixaFundef` entra deslizando pelo chão | 9 |
| 91 | `208` | 120,60 | caixa | tampa abre: 21 pilhas dentro; chip **208 MI**; selo do Fundef | 9 |
| 92 | `precatorio do Fundef` | 122,00 | carimbo | "FUNDEF" carimba na lateral (sem flash) | 9 |
| 93 | `a Justica mandou` | 123,90 | balança | balança da Justiça sobe ao lado e desce devagar | 9 |
| 94 | `a Uniao pagar` | 124,60 | chip | "UNIÃO → EDUCAÇÃO DE ITABUNA" | 9 |
| 95 | `so pode ir` | 127,00 | carimbo | "SÓ PARA O ENSINO" carimba na tampa | 9 |
| 96 | `inflou a receita` | 128,50 | caixa e régua | a caixa encosta na base da régua e a régua fica mais larga embaixo (a receita cresce) | 9 |
| 97 | `porcentagem caiu` | 129,70 | líquido | ★ mostra de novo a descida até 44% em câmera lenta | 9 |
| 98 | `Sem ele` | 130,80 | caixa | a caixa se afasta da régua | 9 |
| 99 | `pelas nossas contas` | 131,50 | selo | "CONTA DO VÍDEO" | 9 |
| 100 | `perto de 54%` | 134,10 | líquido | sobe até 53,7%; número **53,7%** em verde | 9 |
| 101 | `Colado no teto` | 135,40 | câmera | close na linha dos 54% com o líquido logo embaixo | 9 |
| 102 | `os professores` | 137,20 | multidão | 24 professores de crachá nascem em meia-lua; régua afunda | 10 |
| 103 | `reserva` | 138,60 | caixa | 4 das 21 pilhas saem da caixa e vão para a frente dos professores | 10 |
| 104 | `40 milhoes` | 139,50 | chip | **40 MI PARA OS PROFESSORES**; selo dos professores | 10 |
| 105 | `saiu a lista` | 142,40 | prancheta | `ListaHabilitados` sobe | 10 |
| 106 | `2.236` | 143,00 | prancheta | número **2.236** digita; os professores acendem de leve | 10 |
| 107 | `a categoria parou` | 146,20 | professores | ficam parados virados para a prefeitura ★ (sem placa de protesto com texto inventado) | 10 |
| 108 | `nao havia data` | 148,80 | calendário | ★ um calendário vazio com "?" | 10 |
| 109 | `minimos da lei` | 150,30 | copos | professores e caixa afundam; dois copos sobem; selo dos pisos | 11 |
| 110 | `A saude recebeu` | 151,80 | copo SAÚDE | risco "15%" acende | 11 |
| 111 | `17%` | 152,70 | copo SAÚDE | líquido sobe até 17%; chip **17%** | 11 |
| 112 | `minimo e 15` | 154,50 | chip | "MÍNIMO: 15%" | 11 |
| 113 | `A educacao, 25,8%` | 155,50 | copo EDUCAÇÃO | risco "25%"; líquido sobe até 25,8% | 11 |
| 114 | `25,8%` | 156,40 | chip | **25,8%** | 11 |
| 115 | `minimo e 25` | 158,40 | chip | "MÍNIMO: 25%"; ★ o espaço entre o risco e o líquido fica em evidência (passou por pouco) | 11 |
| 116 | `Tribunal de Contas` | 161,00 | prédio do TCM | sobe atrás; lupa por cima dos copos | 11 |
| 117 | `Em qual dessas` | 162,70 | câmera | sobe para a mesa inteira; copos afundam; prédios sobem de novo | 12 |
| 118 | `areas` | 163,30 | prédios | acendem um de cada vez (saúde, educação, ruas, ônibus, assistência, cultura, segurança, defesa civil), 0,25 s entre eles | 12 |
| 119 | `gastar mais` | 164,80 | chip | "QUAL ÁREA PRECISA DE MAIS?" | 12 |
| 120 | `comentarios` | 166,20 | chip 2D | "COMENTA AQUI" com balãozinho | 12 |
| 121 | `Magno Explica` | 167,40 | marca | assinatura do perfil | 12 |

Além dos 121 eventos, cada pilha que desliza é um movimento próprio (onda de moedas com `pop` baixinho), o que passa de 300 movimentos.

## 2.4 Cenas com câmera

As distâncias são referência: o código usa o enquadramento automático (alvo + tamanho + direção).

### MAPA 1: ITABUNA (0,00 a 7,50 s)
- Kit Mapas: Brasil (zoom 4) → sul da Bahia (zoom 8) → Itabuna (zoom 10,5), em escala logarítmica, sem parar.
- Pílula: ITABUNA 2025

### MAPA 2: DE ONDE VEIO (7,50 a 25,00 s)
- Kit Mapas: recua de Itabuna até ver Brasília, Salvador e Itabuna no mesmo quadro (zoom 5,5), deriva lenta. Volta a aproximar de Itabuna em "impostos da cidade" (17,0) e recua de novo em "A União manda" (21,7).
- Pílula: DE ONDE VEIO
- Aha: "A maior parte do dinheiro vem de fora da cidade."

### CENA 1: PARA ONDE FOI / SAÚDE (25,00 a 36,00 s) · Eventos 19 a 26
- 1a (25,0 a 26,6): alvo [0, 0, 0] · cabe a mesa inteira (19 m) · 55° de cima, de frente · avanço lento
- 1b (26,6 a 36,0): alvo [-2,0, 0,9, -3,6] · cabe 6 m (hospital, pilhas e as 3 moedas) · 34°, vindo da direita · arco de 20°
- Pílula: SAÚDE
- Aha: "A saúde leva 1 de cada 3 reais, e quase tudo vai para hospital."

### CENA 2: EDUCAÇÃO (36,00 a 41,40 s) · Eventos 27 a 31
- 2a: alvo [-4,6, 0,8, -1,2] · cabe 5,5 m (escola, pilhas e fantasmas de 2024) · 33°, vindo da direita · arco continua
- Pílula: EDUCAÇÃO
- Aha: "A educação caiu 13 milhões de um ano para o outro."

### CENA 3: PREFEITURA, CÂMARA E SEGURANÇA (41,40 a 49,00 s) · Eventos 32 a 37
- 3a (41,4 a 44,3): alvo [2,4, 1,0, -3,8] · cabe 5 m (prefeitura e pilhas) · 34° · arco para a direita
- 3b (44,3 a 49,0): alvo [5,2, 0,9, -0,6] · cabe 6,5 m (Câmara e guarda no mesmo quadro, com as duas pilhas no meio) · 37° · avanço lento
- Pílula: PREFEITURA → CÂMARA (troca em `A Camara de Vereadores`)
- Aha: "A Câmara custa o dobro da segurança da cidade."

### CENA 4: RUAS (49,00 a 59,30 s) · Eventos 38 a 45
- 4a (49,0 a 54,5): alvo [-4,2, 0,8, 3,0] · cabe 6 m (rua, postes, gari e pilhas) · 30°, olhando ao longo da rua
- 4b (54,5 a 59,3): alvo [-3,6, 0,7, 3,6] · cabe 5 m (obra e pilhas fantasmas) · 36° · grua subindo devagar
- Pílula: RUAS E SERVIÇOS
- Aha: "Das obras de infraestrutura previstas, saiu menos de um terço."

### CENA 5: A CURIOSIDADE DO ÔNIBUS (59,30 a 72,80 s) · Eventos 46 a 54
- 5a (59,3 a 64,1): alvo [0,6, 0,7, 4,8] · cabe 5 m (placa "TRANSPORTE" com a pilha fininha) · 32° · arco lento
- 5b (64,1 a 68,1): alvo [0, 0,5, 7,2] · cabe 2,5 m (caderno aberto na página 8) · 50° de cima, quase lendo a página · avanço lento
- 5c (68,1 a 72,8): alvo [2,4, 0,8, 5,2] · cabe 6 m (ponto, ônibus, as 4,4 pilhas e a cópia da Câmara) · 30°, olhando ao longo da rua
- Pílula: O ÔNIBUS
- Aha: "O dinheiro do ônibus não está na conta do transporte; está em outra linha, e é maior que a Câmara."

### CENA 6: AS OUTRAS ÁREAS E A DEFESA CIVIL (72,80 a 84,10 s) · Eventos 55 a 63
- 6a (72,8 a 77,7): alvo [-5,4, 0,8, -1,8] · cabe 6,5 m (assistência e teatro no mesmo quadro) · 35°, vindo da esquerda · arco
- 6b (77,7 a 84,1): alvo [6,0, 0,8, 3,0] · cabe 6 m (galpão, 7,1 fantasmas e a moedinha) · 34° · avanço lento
- Pílula: OUTRAS ÁREAS → DEFESA CIVIL (troca em `E repara`)
- Aha: "A defesa civil tinha 71 milhões previstos e gastou quase nada."

### CENA 7: OBRAS E DÍVIDA (84,10 a 94,50 s) · Eventos 64 a 71
- 7a (84,1 a 85,4): alvo [0, 0, 0] · cabe a mesa inteira · 55° · recuo leve
- 7b (85,4 a 91,3): alvo [-1,0, 0,8, 3,2] · cabe 6 m (grade de 21,8 fantasmas, as 3,3 reais e as 6 moedas) · 38°
- 7c (91,3 a 94,5): alvo [1,6, 0,8, 5,0] · cabe 7 m (obra e banco no mesmo quadro) · 35° · arco para a direita
- Pílula: OBRAS × DÍVIDA
- Aha: "A dívida levou quase o dobro do que foi investido em obras."

### CENA 8: O TETO (94,50 a 113,50 s) · Eventos 72 a 84
- 8a (94,5 a 103,0): alvo [0, 2,5, 0] · cabe 6 m de altura (régua inteira) · 15°, quase de frente · grua subindo
- 8b (103,0 a 107,2): alvo [0, 4,5, 0] · cabe 2,5 m (faixa dos 54% e o líquido passando dela) · 12° · avanço lento
- 8c (107,2 a 113,5): alvo [0, 1,6, 1,6] · cabe 6 m (régua, calendário e as 2 placas) · 25° · recua
- Pílula: O TETO
- Aha: "Em 2025, Itabuna passou do teto da lei com pessoal."

### CENA 9: O FUNDEF (113,50 a 137,20 s) · Eventos 85 a 101
- 9a (113,5 a 119,9): alvo [0, 2,8, 0] · cabe 6 m (régua, líquido descendo) · 18° · arco lento
- 9b (119,9 a 127,0): alvo [-2,0, 1,0, 0,8] · cabe 6 m (caixa, balança e a base da régua) · 30°, vindo da esquerda
- 9c (127,0 a 134,1): alvo [-0,8, 2,0, 0,4] · cabe 6,5 m (caixa encostada e a régua inteira) · 22° · avanço lento
- 9d (134,1 a 137,2): alvo [0, 4,4, 0] · cabe 2 m (close na linha dos 54%) · 12°
- Pílula: O FUNDEF
- Aha: "O gasto com pessoal só caiu porque entrou um dinheiro de uma vez só, que nem pode pagar salário."

### CENA 10: OS PROFESSORES (137,20 a 150,00 s) · Eventos 102 a 108
- 10a: alvo [0,6, 0,9, 3,0] · cabe 7 m (professores, pilhas, prancheta e caixa) · 36° · arco de 25°
- Pílula: OS PROFESSORES
- Aha: "Os 40 milhões dos professores ainda não têm data."

### CENA 11: OS PISOS (150,00 a 162,70 s) · Eventos 109 a 116
- 11a (150,0 a 155,5): alvo [-1,8, 1,2, 0] · cabe 3,5 m (copo da saúde) · 20° · arco lento
- 11b (155,5 a 160,8): alvo [1,8, 1,2, 0] · cabe 3,5 m (copo da educação)
- 11c (160,8 a 162,7): alvo [0, 1,5, -1] · cabe 8 m (os copos e o TCM atrás) · 30° · grua subindo
- Pílula: OS MÍNIMOS
- Aha: "Os dois mínimos foram cumpridos, a educação por pouco."

### CENA 12: E VOCÊ? (162,70 a 171,94 s) · Eventos 117 a 121
- 12a: alvo [0, 0, 0] · cabe a mesa inteira (19 m) · 50° de cima · giro lento de 25°
- Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Tabela completa (arquivo, página e valor exato) em `audio/fontes.md`. Na tela, o número vai arredondado como na fala, e o chip pequeno embaixo traz o valor do PDF.

**Conferir antes de publicar:**
- Se o rateio do Fundef já foi pago aos professores (Diário Oficial do Município).
- Se saiu o RREO ou o RGF até outubro de 2026 no portal, que mudaria o 44%.

## 2.6 Trilha e sons

- `whoosh` nas trocas (mapa → 3D e entre cenas)
- `tique` em cada troca de pílula
- `pop` baixinho (volume 0,25) em cada pilha que desliza, no máximo 1 a cada 0,08 s; `pop` normal em cada chip de número
- `subida` no líquido da régua (eventos 78, 79 e 100) e nos copos
- `baque` nas pilhas que afundam (−13 MI), no "105 mil" e quando o líquido passa do teto
- `impacto` nos 2 X das placas e nos dois carimbos da caixa do Fundef
- `bip` nas linhas do relatório que acendem (cena 5)
- `ding` só nos dois mínimos cumpridos (17% e 25,8%)
- Sem trilha de fundo.

## 2.7 Arquivos

**Novos (Estúdio 3D):**
- `src/videos/orcamentoitabuna/OrcamentoItabuna.tsx`: o vídeo (AUDIO_SEG 171.04, QUADROS 5158), com base no código do 014
- `src/videos/orcamentoitabuna/pecas.tsx`, peças novas:
  - `RioMaquete`: o rio Cachoeira em faixa curva com margens verdes
  - `RuaServicos`: rua com postes, gari com carrinho, caminhão de lixo pequeno e cones
  - `PredioAssistencia`: prédio baixo com letreiro "ASSISTÊNCIA SOCIAL"
  - `TeatroMini`: fachada com arco e letreiro "CULTURA"
  - `BaseDefesaCivil`: galpão com letreiro "DEFESA CIVIL" e viatura genérica
  - `BancoDivida`: prédio com colunas e letreiro "PAGAMENTO DA DÍVIDA"
  - `CalendarioMeses`: fila de folhas de calendário que viram
  - `CaixaFundef`: caixote com tampa, carimbos e pilhas dentro
  - `ListaHabilitados`: prancheta em pé com linhas e número
  - `PaginaRelatorio`: a página 8 do RREO aberta, com as linhas que acendem
- `src/videos/orcamentoitabuna/palavras.ts` (já pronto)
- `projetos/017. orçamento de itabuna/mapas/itabuna.mp4` (os dois trechos de mapa num MP4 só)

**Novos (Kit Mapas):**
- `src/videos/orcamento-itabuna/` (dados, roteiro com os tempos e index.tsx), com base no `orcamento-ilheus`, e `scripts/dados-orcamento-itabuna.py` (contorno de Itabuna do IBGE, estados, pontos de Brasília e Salvador)
- composição `OrcamentoItabuna` no Kit Mapas, renderizada com `--muted`

**Alterados:** `src/Root.tsx` (OrcamentoItabuna, OrcamentoItabunaGuia, OrcamentoItabunaLimpo, CapaOrcamentoItabuna); `Root` do Kit Mapas.

**Reaproveitados:**
- do 014 (`src/videos/orcamentoilheus/pecas.tsx`): `MesaMaquete`, `PonteMini`, `PostoSaude`, `Escola`, `Prefeitura`, `PostoGuarda`, `CamaraVereadores`, `PredioTCM`, `PilhasDinheiro`, `grade`, `RelatorioPDF`, `ReguaLimite`, `PlacaProibido`, `CopoPiso`, `coresOI`
- do 016 (`src/videos/onibusilheus/pecas.tsx`): `PontoOnibus`
- do catálogo: `CofreFGTS`, `Onibus`, `Balanca`, `Cone`, `RoloCompactador`, `Multidao`, `Quepe`, `CasaMini`, `Casinha`, `Pilula`, legenda e selos da base

**Render:** 5158 quadros, em partes (o `render.mjs` decide; uns 7 a 9 pedaços).

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- Mesmo assunto em série: manter o mesmo mundo do 014 e mudar a história.
- Vídeo de uma cidade usa só documentos dessa cidade (017).
- Sem rótulo que insinua motivo ("ano de eleição") (017).
- Fonte de prefeitura = PDF com arquivo e página (014); selo mais em evidência, com documento e página (016).
- Juntar os kits com um `OffthreadVideo` só para trechos seguidos (015); selos no topo (y 470) por cima do mapa (013); `TagNoMapa` com `sai` numérico (013).
- Uma animação por palavra-chave; o máximo de objetos; extras com ★.
- Vários números lado a lado: um de cada vez (012); cada área tem a sua câmera.
- Dois nomes comparados em menos de 1 s (Câmara e segurança): um plano que mostra os dois (cena 3b).
- Cada número pelo menos 1,5 s na tela (014).
- Multidão (professores) só nasce na palavra dela e afunda depois.
- Sem guindaste na maquete (014); sem cruz vermelha na saúde; sem brasão; letreiro na altura da parede (011).
- Neutro: sem nome de prefeito, sem partido.

**Escolhas do diretor:**
- O rio Cachoeira e as pontes, para a maquete ser de Itabuna e não de Ilhéus.
- As pilhas fantasmas do "previsto" ao lado do "gasto" (infraestrutura, defesa civil, obras), para a pessoa ver o que não saiu do papel.
- O caderno que abre na página 8 para mostrar onde estava o dinheiro do ônibus.
- A caixa do Fundef com o carimbo "SÓ PARA O ENSINO", que encosta na régua e faz o líquido baixar; depois sai e o líquido volta, para explicar o "inflou a receita" sem conta.
- O calendário de 8 meses e as duas placas da punição.
- Os professores parados virados para a prefeitura, sem cartaz com frase inventada.
