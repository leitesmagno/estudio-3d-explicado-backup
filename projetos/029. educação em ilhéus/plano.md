# Plano de cenas: 029. educação em ilhéus (versão 2, roteiro 7, aprovada em 05/11/2026)

Código `educacaoilheus` · Nome `EducacaoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo e encaixa **três trechos de satélite** do Kit Mapas Animados (`OffthreadVideo` em `Sequence`, entrada e saída de 0,2 s). Legenda, pílula, selos e a marca d'água do 3D ficam por cima de tudo.
**Regras deste vídeo (pedidos da pessoa):** dados só do levantamento `~/Documents/EDUCACAO-ILHEUS` e das notícias reunidas em `NOTICIAS_EDUCACAO_ILHEUS.md`; todos os anos de 2006 a 2026, ano a ano, com a fonte dentro de cada bloco; investigação dita como investigação, com a resposta da prefeitura no mesmo tamanho; o valor exato de cada número arredondado na fala aparece no selo; **marca d'água @euMagnoLeite do primeiro ao último quadro**.
## 2.1 Narração
- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4, arquivo de 05/11 18:41) · preparo: **1,318x** (pedido da pessoa: até 3 min), pausas de no máximo 0,35 s, volume -15 · duração **179,06 s** · `AUDIO_SEG = 179.06` · `QUADROS = 5399` (com 0,9 s de folga).
- 443 palavras no `palavras.ts` (igual ao roteiro); a última ("informações.") termina em 178,62 s. Nenhuma pausa maior que 1,5 s. Final conferido.
- Ajustes da sincronia: o Whisper pulou "2020. Terceira rejeição seguida. 2021." (a voz falou; tempos medidos no trecho isolado, 85,50 a 88,40 s) e repetiu "2016" (apagado); "R$" inventado nos números retirado; números juntados separados ("2,90 bilhões" → "2 bilhões e 90 milhões", "15,5", "3,19", "1,360"). "Siópe" vira "SIOPE" na legenda. Cópia em `transcricao/palavras-original.json`; a narração da versão 4 está em `antigos/narração versão 4/`.

**Palavras repetidas** (o `quando()` pega a primeira; use o trecho indicado):

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| 2008 | 22,84 · 159,26 | `quando('2008.')` (bloco) · `quando('de 2008 a 2025')` (conta) |
| 2009 | 28,44 · 32,64 | `quando('2009 e 2010')` · `quando('Em 2009, 32%')` |
| 2015 | 51,48 · 55,54 | `quando('2013 a 2015')` · `quando('bem abaixo dos 105')` |
| 2020 | 85,50 · 96,32 | `quando('2020.')` · `quando('como em 2020')` |
| 2023 | 98,26 · 103,74 | `quando('2022 e 2023')` · `quando('Em 2023, quase 43')` |
| 2025 | 122,98 · 160,06 | `quando('2025.')` · `quando('de 2008 a 2025')` |
| camara | 20,18 · 42,98 | `quando('A Camara reprovou')` (2007) · `quando('A Camara reprovou.', 2)` (2011) |
| minimo | 48,52 · 54,94 · 83,88 · 92,22 · 102,38 · 137,46 | sempre com a palavra vizinha (`'Abaixo do minimo, e nova'`, `'acima do minimo. Em 2015'`, `'abaixo do minimo. Rejeicao'`...) |
| fundeb | 7,88 · 16,34 · 18,44 · 77,54 · 88,98 | `'E o Fundeb'` · `'Nasce o Fundeb'` · `'falhas no Fundeb'` · `'O Fundeb sobe'` |
| siope | 24,22 · 36,52 · 63,20 · 91,22 · 132,88 | `'Comeca o SIOPE'` · `'O SIOPE mostra mais de 25%'` · `'O SIOPE diz 22%'` · `'No SIOPE, abaixo'` · `'O SIOPE diz 26'` |
| tribunal | 39,02 · 49,94 · 71,46 · 81,68 · 103,12 | sempre com o verbo (`'O Tribunal achou menos'`, `'O Tribunal achou 24'`, `'nova rejeicao do Tribunal'`) |
| 24 | 82,26 · 135,78 | `quando('O Tribunal achou 24')` (2019) · `quando('24%, abaixo', 2)` (2025) |
| prefeitura | 65,18 · 79,36 · 111,32 · 135,18 · 155,04 | `'A prefeitura informou'` · `'prefeitura, 27%'` · `'A prefeitura pagou 51'` · `'prefeitura, 24'` · `'A prefeitura nega'` |
| milhoes | 14,90 · 19,36 · 26,02 · 31,76 · 45,34 · 53,80 · 60,94 · 68,80 … | nunca sozinho; sempre o número antes |

> Lembrete da base: `quando()` tira vírgula e % dos números ("22,8" vira "228"). Os números com vírgula foram tirados da fala; os percentuais são chamados pela palavra de antes.

## 2.2 Ideia e mundo

**A metáfora: a maquete de Ilhéus do vídeo 014 com a ESCOLA no centro e uma RUA DO TEMPO em volta.** Agora **todos os anos** têm o seu marco aceso na fala (os vizinhos sem novidade acendem juntos: 2009 e 2010, 2013 a 2015, 2022 e 2023). A mesma mesa redonda, o mar no canto, a ponte e as casinhas, para quem viu o orçamento de Ilhéus reconhecer na hora. Em volta da escola corre um anel no chão com **21 marcos de ano (2006 a 2026)**. O vídeo anda pela rua **na mesma ordem da fala**: cada ano acende o seu marco e ganha o que aconteceu nele. Cada ano vira **uma coluna de moedas**, com altura proporcional ao gasto (**1 fatia = R$ 10 milhões**), formando um gráfico de barras em volta da escola. No fim, a câmera sobe e mostra a história inteira de uma vez.

**As marcas da rua do tempo (uma linguagem só, o vídeo inteiro):**

| O que | Como aparece | Cor |
|---|---|---|
| Gasto do ano | coluna de moedas no marco (0,12 m por R$ 10 mi) | dourado |
| Previsto na lei do orçamento | contorno transparente da coluna, um pouco maior | dourado a 30% |
| % dos impostos na educação | copo de piso do lado de fora do marco, com a linha dos 25% | acima: neutro · abaixo: marsala |
| Quando as fontes discordam | dois copos lado a lado, com etiqueta SIOPE, PREFEITURA ou TCM | idem |
| Parecer do TCM ou julgamento da Câmara | carimbo em cima do marco | rejeição: marsala · aprovação: `tema.objetoClaro` |
| Investigação ou apuração (2026) | lupa sobre as caixas de merenda e balança com "SEGUNDO A PF" de um lado e "PREFEITURA NEGA" do outro, mesmo tamanho | lupa e balança em `tema.objetoClaro`; nada em marsala, porque não há conclusão |
| Ano sem dado de gasto | "?" no marco | `tema.objeto` a 40% |

**Protagonista:** não há. O personagem é o dinheiro da educação (as colunas) e a escola. Pessoas só como bonecos genéricos sem rosto: alunos na porta da escola, o auditor do TCM (etiqueta "TCM-BA") e os trabalhadores da educação que recebem os precatórios em 2024. Nenhum nome de prefeito, secretário ou empresário na tela.

**Marca d'água:** "MAGNO EXPLICA · @euMagnoLeite" na marca do topo (`Marca`, `CABECALHO.marca`), **de 0 a 179,06 s**, por cima do 3D e dos três mapas (opacidade 0,5, `tema.texto`). O Kit Mapas sai sem a marca do `marca.json`, para não duplicar.

**Placar fixo:** "1 FATIA = R$ 10 MILHÕES", no alto, de `quando('2008.')` (22,84 s) até `quando('Confira no portal')` (171,52 s).

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Tempo | O que mostra |
|---|---|---|
| **MAPA 1: ILHÉUS** | 0,00 a 4,64 s | Brasil visto de cima, descida no satélite até Ilhéus; contorno do município (IBGE 2913606) acende em verde; R$ 2 BILHÕES · EDUCAÇÃO 2008 A 2025; três etiquetas que não batem (26,2% · 24,2% · 24%). Câmera sempre descendo devagar. Trecho curto: só o gancho. |
| **MAPA 2: O FUNDEB** | 7,60 a 12,18 s | Ilhéus no sul da Bahia; círculo FUNDO no estado; setas finas de Ilhéus ao FUNDO (20%, FPM, ICMS) e seta grossa de volta. Câmera em arco lento. (Valores da vaquinha ficam para a conta final, no 3D.) |
| **MAPA 3: É SEU** | 171,52 a 179,06 s | Satélite de Ilhéus, contorno verde, câmera girando devagar; etiqueta transparencia.ilheus.ba.gov.br; pontinhos verdes na área urbana. |

- Os trechos saem sem legenda, sem marca e sem som (1080 × 1920), com os tempos tirados deste `palavras.ts`. Selos do 3D por cima do mapa vão no topo (y 470). Nomes em sequência no mesmo lugar: o anterior sai 6 quadros antes do próximo.

**Selos de fonte** (maiores, com documento e número exato, embaixo da pílula; um por bloco):

| Entra em | Tempo | Texto do selo |
|---|---|---|
| `A regra` | 4,64 | CONSTITUIÇÃO, ART. 212 · RREO ANEXO 8 |
| `20% de` | 9,70 | RREO DEZ/2023 · ANEXO 8, LINHA 4 · FPM, ICMS, IPI, ITR, IPVA |
| `2006.` | 12,18 | TESOURO NACIONAL · TRANSF. CONSTITUCIONAIS · R$ 14,09 MI |
| `2007.` | 16,94 | TESOURO · R$ 19,14 MI · CÂMARA, DEC. LEG. 001/2010 (JAN-AGO/2007) |
| `2008.` | 22,84 | SIOPE/FNDE 2008 · R$ 42,66 MI · 25,24% · CÂMARA, DEC. LEG. 001/2011 |
| `2009 e 2010` | 28,44 | SIOPE · R$ 54,20 MI (32,33%) · R$ 66,78 MI (25,42%) · CÂMARA, DEC. LEG. 002/2011 |
| `2011.` | 35,50 | SIOPE 2011: 25,75% · TCM: 22,43% (JORNAL GRANDE BAHIA, 05/12/2012) · CÂMARA, DEC. LEG. 001/2014 |
| `2012.` | 44,00 | SIOPE 2012: R$ 69,44 MI, 22,79% · LOA 2012: R$ 83,24 MI · TCM REJEITA CONTAS DE 2012 (BNEWS) |
| `2013 a 2015` | 50,52 | SIOPE E RREO 2013-2015 · LOA 2015: R$ 104,68 MI · CÂMARA, DEC. LEG. 002/2016 E 001/2016 |
| `2016.` | 58,38 | LOA 2016 (LEI 3775/2016): R$ 119,44 MI · SIOPE 22,10% · RREO DEZ/2016: 27,46% |
| `2017.` | 66,88 | SIOPE 2017 · R$ 108,28 MI |
| `2018.` | 70,32 | PARECER TCM-BA 04894e19 · 22,89% → 25,60% |
| `2019.` | 78,16 | RREO DEZ/2019: 26,77% · PARECER TCM-BA 06442e20: 24,03% |
| `2020.` | 85,50 | PARECER TCM-BA 09984e21 |
| `2021.` | 87,86 | SIOPE 2021: 22,32% · EC 119/2022 · RREO DEZ/2020 E DEZ/2021 |
| `2022 e 2023` | 97,18 | PARECERES TCM-BA 07770e23 (26,93%) E 07666e24 (29,32%) · SIOPE 2023: PRECATÓRIOS R$ 42,94 MI |
| `2024.` | 107,36 | BALANÇO 2024: R$ 269,27 MI · BAHIA NOTÍCIAS 04/10/2024 (PREFEITURA) · RREO DEZ/2024 ANEXO 14: 11,43% E 1,81% |
| `2025.` | 122,98 | LOA 2025: R$ 276,86 MI · BALANÇO R$ 231,19 MI · PLANILHA R$ 248,95 MI · RREO R$ 300,23 MI · SIOPE 26,23% · RREO 24,18% |
| `2026, ate agosto` | 140,60 | LOA 2026: R$ 239,86 MI · RREO 4º BIM/2026 |
| `Em maio` | 147,46 | OPERAÇÃO MERENDA DIGNA (PF E CGU, 21/05/2026) · JORNAL GRANDE BAHIA, A TARDE, BAHIA NOTÍCIAS · INVESTIGAÇÃO, SEM CONDENAÇÃO |
| `Ministerio Publico apura` | 156,10 | A TARDE, 09/10/2026 · 6ª PROMOTORIA DE ILHÉUS |
| `A conta` | 158,42 | SIOPE 2008-2025 · IPCA/BANCO CENTRAL ATÉ SET/2026 · CONTA DO VÍDEO |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` + `tema.areia` 25% (igual ao 014) |
| chão da maquete | `tema.areia` (médio) e `tema.vegetacao` |
| mar | `tema.agua` fosco |
| escola, prefeitura, TCM, marcos | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| moedas e colunas | dourado da paleta de apoio (nunca o acento) |
| ano falado, linha dos 25%, contorno de Ilhéus, número em destaque | `tema.acento` (verde) |
| abaixo do mínimo, carimbo de rejeição, barras do VAAT | marsala (`tema.alerta`), fosco |
| lupa, balança e caixas de merenda (investigação) | `tema.objetoClaro` e `tema.objeto`; sem marsala |
| precatórios (fatias extras de 2023) | `tema.objetoClaro` |

**Mapa do mundo** (mesa redonda de raio 9 m do 014; chão da mesa em y = 0; frente da câmera é z+; ângulo dos marcos: 2006 em 200°, 11° por ano, 2016 bem na frente):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa da maquete | [0, 0, 0] | `MesaMaquete` (014) |
| Mar, ponte e casinhas | anel de raio 7 a 8,5, atrás (z < -3) | `PonteMini`, `CasaMini`, `Casinha` |
| Escola grande | [0, 0, 0] | `Escola` (014), escala 1,6, letreiro "EDUCAÇÃO"; alunos na porta ★ |
| Marco 2006 | [-3,9, 0,0, -1,4] | `MarcoAno`; coluna em [-3,3, 0,0, -1,2]; copo em [-4,7, 0,0, -1,7] |
| Marco 2008 | [-4,2, 0,0, 0,1] | `MarcoAno`; coluna em [-3,5, 0,0, 0,1]; copo em [-5,0, 0,0, 0,2] |
| Marco 2009 | [-4,1, 0,0, 0,9] | `MarcoAno`; coluna em [-3,4, 0,0, 0,8]; copo em [-4,9, 0,0, 1,1] |
| Marco 2011 | [-3,4, 0,0, 2,4] | `MarcoAno`; coluna em [-2,9, 0,0, 2,0]; copo em [-4,1, 0,0, 2,9] |
| Marco 2013 | [-2,3, 0,0, 3,5] | `MarcoAno`; coluna em [-1,9, 0,0, 2,9]; copo em [-2,7, 0,0, 4,2] |
| Marco 2016 | [0,0, 0,0, 4,2] | `MarcoAno`; coluna em [0,0, 0,0, 3,5]; copo em [0,0, 0,0, 5,0] |
| Marco 2018 | [1,6, 0,0, 3,9] | `MarcoAno`; coluna em [1,3, 0,0, 3,2]; copo em [1,9, 0,0, 4,6] |
| Marco 2019 | [2,3, 0,0, 3,5] | `MarcoAno`; coluna em [1,9, 0,0, 2,9]; copo em [2,7, 0,0, 4,2] |
| Marco 2021 | [3,4, 0,0, 2,4] | `MarcoAno`; coluna em [2,9, 0,0, 2,0]; copo em [4,1, 0,0, 2,9] |
| Marco 2024 | [4,2, 0,0, 0,1] | `MarcoAno`; coluna em [3,5, 0,0, 0,1]; copo em [5,0, 0,0, 0,2] |
| Marco 2025 | [4,1, 0,0, -0,7] | `MarcoAno`; coluna em [3,5, 0,0, -0,5]; copo em [4,9, 0,0, -0,8] |
| Marco 2026 | [3,9, 0,0, -1,4] | `MarcoAno`; coluna em [3,3, 0,0, -1,2]; copo em [4,7, 0,0, -1,7] |
| Demais marcos | mesmo anel, 11° entre eles | colunas dos anos não citados crescem em onda, sem número |
| Segundo copo (2011, 2016, 2019, 2025) | 0,7 m mais para fora, ex. 2019: [3,1, 0,0, 4,8] | etiqueta SIOPE / PREFEITURA / TCM na base |
| Prefeitura | [-5,5, 0,0, -3,0] | `Prefeitura` (014) |
| Cofre FUNDEB | [-6,0, 0,0, 1,5] | `CofreFGTS` com letreiro "FUNDEB"; sobe só na conta final |
| Canaleta | entre prefeitura e cofre | `TrilhoMoedas` (ida fina, volta grossa) |
| Tribunal de Contas | [5,5, 0,0, -3,5] | `PredioTCM` (014); sobe em 2018 e fica |
| Auditor do TCM | [3,4, 0,0, 5,3] | boneco genérico (`Pessoa`) com lupa e etiqueta "TCM-BA" ★ |
| Placas de 2025 (BALANÇO, PLANILHA, RELATÓRIO) | em arco de raio 6,5 em volta de [4,1, 0,0, -0,7] | peça nova `PlacaFonte3D` |
| Barras do VAAT (2024) | [6,0, 0,0, 0,2] | `ContadorVagas` (catálogo), duas barras com marca de 50% e 15% |
| Material de obra (2025) | [1,8, 0, 1,4] | tijolos, tábuas e cones (regra do 014: nada de guindaste) |
| Caixas de merenda (2026) | [-1,8, 0, 1,4] | peça nova `CaixasMerenda`: pilha de caixas de alimento com etiqueta "MERENDA" |
| Lupa da investigação | sobre as caixas, 1,5 m acima | peça nova `LupaGrande` (aro, cabo e lente fosca) |
| Balança | [-2,6, 0, 2,8] | `Balanca` (catálogo), um cartão em cada prato; volta ao meio no fim do bloco |
| Bonecos dos trabalhadores (2024) | perto do marco 2024, do lado de fora | `Pessoa` (catálogo), 6 bonecos genéricos |
| Folhas dos relatórios 2020 e 2021 | flutuando sobre os marcos | `RelatorioPDF` (014) |

**Regras visuais:** o acento só no ano falado, na linha dos 25% e no contorno de Ilhéus. Tudo que acende volta ao neutro no bloco seguinte. Nada aparece antes do seu ano. Nenhum nome de pessoa nem logo: PREFEITURA, FUNDEB, TCM-BA e SIOPE só como letreiro na fonte do perfil. Neutralidade: cada número aparece com quem disse, sem dizer que alguém errou.

## 2.3 Mapa de palavras-chave (134 eventos, 1 a cada 1,34 s)

| # | Palavra (`quando`) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `quando('Em 18 anos')` | 0,00 | MAPA 1 | Abre no Brasil visto de cima; câmera começa a descer para a Bahia | 1 |
| 2 | `quando('anos')` | 0,56 | MAPA 1 | Contador pequeno "2008 → 2025" no topo ★ | 1 |
| 3 | `quando('Ilheus gastou')` | 1,32 | MAPA 1 | Satélite chega em Ilhéus; contorno do município acende em verde | 1 |
| 4 | `quando('2 bilhoes com')` | 1,82 | MAPA 1 | Digita R$ 2 BILHÕES no meio do município | 1 |
| 5 | `quando('educacao.')` | 2,72 | MAPA 1 | Linha de baixo: EDUCAÇÃO · 2008 A 2025 | 1 |
| 6 | `quando('Mas os numeros')` | 3,26 | MAPA 1 | Três etiquetas tortas em volta: 26,2% · 24,2% · 24% ★ | 1 |
| 7 | `quando('nao batem')` | 3,96 | MAPA 1 | As etiquetas balançam e não se encaixam | 1 |
| 8 | `quando('A regra')` | 4,64 | Maquete + Escola | Corte para o 3D: maquete de Ilhéus do alto; câmera desce até a escola; letreiro EDUCAÇÃO acende | 2 |
| 9 | `quando('25% dos impostos')` | 5,22 | Copo dos 25% | Copo grande sobe ao lado da escola; linha dos 25% no acento | 2 |
| 10 | `quando('sao da educacao')` | 6,78 | Moedas | 4 moedas caem; 1 rola para dentro da escola e acende | 2 |
| 11 | `quando('E o Fundeb')` | 7,60 | MAPA 2 | Corte para o mapa: Ilhéus no sul da Bahia | 3 |
| 12 | `quando('uma vaquinha')` | 8,34 | MAPA 2 | Círculo "FUNDO" aparece no estado com moedinha girando | 3 |
| 13 | `quando('A cidade poe')` | 9,08 | MAPA 2 | Ilhéus acende em verde | 3 |
| 14 | `quando('20% de')` | 9,70 | MAPA 2 | Setas finas de Ilhéus até o FUNDO; etiqueta "20%" | 3 |
| 15 | `quando('alguns repasses')` | 10,40 | MAPA 2 | Etiquetas FPM e ICMS correm nas setas ★ | 3 |
| 16 | `quando('o fundo devolve')` | 11,16 | MAPA 2 | Seta grossa volta para Ilhéus; ponto da escola acende | 3 |
| 17 | `quando('2006.')` | 12,18 | Marco 2006 | Volta ao 3D no começo da rua do tempo; marco 2006 acende; selo TESOURO | 4 |
| 18 | `quando('So o Tesouro')` | 13,16 | Placa | Plaquinha TESOURO NACIONAL ao lado do marco ★ | 4 |
| 19 | `quando('14 milhoes')` | 14,44 | Coluna FUNDEF 2006 | Coluninha "FUNDEF · R$ 14 MI" | 4 |
| 20 | `quando('o antigo Fundeb')` | 15,96 | Letreiro | Letreiro FUNDEF com seta "→ FUNDEB" ★ | 4 |
| 21 | `quando('2007.')` | 16,94 | Marco 2007 | Câmera anda um passo; marco 2007 acende | 4 |
| 22 | `quando('Nasce o Fundeb')` | 18,06 | Letreiro | FUNDEF gira e vira FUNDEB ★ | 4 |
| 23 | `quando('19 milhoes')` | 18,98 | Coluna FUNDEB 2007 | Coluninha "FUNDEB · R$ 19 MI" | 4 |
| 24 | `quando('A Camara reprovou')` | 20,00 | Carimbo | Carimbo marsala "CÂMARA: REPROVADA · JAN A AGO/2007" | 4 |
| 25 | `quando('O gasto, nao achei')` | 21,54 | Marcos 2006 e 2007 | "?" sobe nos dois marcos | 4 |
| 26 | `quando('2008.')` | 22,84 | Marco 2008 | Marco acende; placar fixo "1 FATIA = R$ 10 MILHÕES" entra no alto | 4 |
| 27 | `quando('Comeca o SIOPE')` | 23,74 | Placa SIOPE | Placa SIOPE · GOVERNO FEDERAL sobe ao lado da rua | 4 |
| 28 | `quando('43 milhoes')` | 25,54 | Coluna 2008 | Coluna até 4 fatias e um pedaço; R$ 43 MI | 4 |
| 29 | `quando('no limite')` | 26,76 | Copo 2008 | Copo para encostado na linha dos 25% (25,24%) | 4 |
| 30 | `quando('Contas aprovadas.')` | 27,42 | Carimbo | Carimbo claro "CÂMARA: APROVADA" | 4 |
| 31 | `quando('2009 e 2010')` | 28,44 | Marcos 2009 e 2010 | Os dois marcos acendem juntos (um plano só) | 5 |
| 32 | `quando('54 e 67')` | 29,84 | Colunas | Colunas de 5,4 e 6,7 fatias; R$ 54 MI e R$ 67 MI | 5 |
| 33 | `quando('67 milhoes')` | 31,16 | Etiqueta | R$ 67 MI acende na coluna de 2010 | 5 |
| 34 | `quando('Em 2009, 32%')` | 32,46 | Copo 2009 | Copo bem acima da linha; 32,33% no acento | 5 |
| 35 | `quando('o maior da serie')` | 34,14 | Copo 2009 | Copo brilha; selo "MAIOR DA SÉRIE" ★ | 5 |
| 36 | `quando('2011.')` | 35,50 | Marco 2011 | Câmera anda; marco acende; coluna R$ 76 MI cresce | 5 |
| 37 | `quando('O SIOPE mostra mais de 25%')` | 36,36 | Copo SIOPE 2011 | Copo acima da linha; etiqueta SIOPE 25,75% | 5 |
| 38 | `quando('Mas o Tribunal de Contas')` | 38,36 | TCM | Prédio do Tribunal de Contas sobe ao fundo | 5 |
| 39 | `quando('achou 22%')` | 39,76 | Copo TCM 2011 | Segundo copo abaixo da linha; marsala; etiqueta TCM 22,43% | 5 |
| 40 | `quando('recomendou rejeitar as contas.')` | 41,24 | Carimbo | Carimbo marsala "TCM: REJEIÇÃO" | 5 |
| 41 | `quando('A Camara reprovou.', 2)` | 42,80 | Carimbo | Segundo carimbo "CÂMARA: REPROVADA" ★ | 5 |
| 42 | `quando('2012.')` | 44,00 | Marco 2012 | Marco acende | 5 |
| 43 | `quando('69 milhoes')` | 44,92 | Coluna 2012 | Coluna até 7 fatias; R$ 69 MI | 5 |
| 44 | `quando('menos que os 83')` | 46,22 | Coluna fantasma 2012 | Contorno até 8 fatias; "PREVISTO R$ 83 MI" | 5 |
| 45 | `quando('Abaixo do minimo, e nova')` | 47,92 | Copo 2012 | Copo abaixo da linha; marsala; 22,79% | 5 |
| 46 | `quando('nova rejeicao do Tribunal')` | 49,14 | Carimbo | Carimbo "TCM: REJEIÇÃO" no marco 2012 | 5 |
| 47 | `quando('2013 a 2015')` | 50,52 | Marcos 2013 a 2015 | Câmera faz travelling pelos três marcos; acendem em sequência | 6 |
| 48 | `quando('De 81 para 88')` | 52,34 | Colunas | Colunas de 8,1 · 8,0 · 8,8 fatias crescem em onda | 6 |
| 49 | `quando('acima do minimo. Em 2015')` | 54,42 | Copos | Três copos acima da linha, em neutro; carimbos claros da Câmara em 2013 e 2014 ★ | 6 |
| 50 | `quando('bem abaixo dos 105')` | 56,34 | Coluna fantasma 2015 | Contorno até 10,5 fatias; "PREVISTO R$ 105 MI" | 6 |
| 51 | `quando('2016.')` | 58,38 | Marco 2016 | Marco acende (bem na frente da escola) | 6 |
| 52 | `quando('Previsto: 119')` | 59,64 | Coluna fantasma 2016 | Contorno até 12 fatias; "PREVISTO R$ 119 MI" | 6 |
| 53 | `quando('Gasto: 96')` | 61,60 | Coluna 2016 | Coluna real até 9,6 fatias; R$ 96 MI | 6 |
| 54 | `quando('O SIOPE diz 22%')` | 62,98 | Copo SIOPE 2016 | Copo abaixo da linha; marsala; SIOPE 22,10% | 6 |
| 55 | `quando('prefeitura, 27%')` | 65,18 | Copo RREO 2016 | Segundo copo acima da linha; PREFEITURA 27,46%; linha tracejada liga os dois ★ | 6 |
| 56 | `quando('2017.')` | 66,88 | Marco 2017 | Marco acende | 6 |
| 57 | `quando('Passa dos 100')` | 68,14 | Linha dos 100 mi | Anel fino "R$ 100 MILHÕES" acende na altura de 10 fatias | 6 |
| 58 | `quando('108.')` | 69,42 | Coluna 2017 | Coluna passa a linha; R$ 108 MI | 6 |
| 59 | `quando('2018.')` | 70,32 | Marco 2018 | Câmera sobe um pouco; o TCM aparece ao fundo | 7 |
| 60 | `quando('O Tribunal achou menos')` | 71,34 | Copo 2018 + auditor | Auditor com lupa (etiqueta TCM-BA) chega; copo abaixo da linha (22,89%) | 7 |
| 61 | `quando('aceitou a defesa')` | 73,58 | Copo 2018 | Copo sobe devagar e passa da linha (25,60%) | 7 |
| 62 | `quando('Mesmo assim')` | 74,56 | Câmera | Câmera recua para mostrar o prédio do TCM | 7 |
| 63 | `quando('rejeitar as contas, tambem')` | 75,64 | Carimbo | Carimbo "TCM: REJEIÇÃO" no marco 2018 | 7 |
| 64 | `quando('falhas no Fundeb')` | 77,16 | Etiqueta | "SEM PARECER DO CONSELHO DO FUNDEB · RESTITUIÇÃO PENDENTE" | 7 |
| 65 | `quando('2019.')` | 78,16 | Marco 2019 | Marco acende; câmera fecha nos copos | 7 |
| 66 | `quando('A prefeitura informou')` | 79,22 | Copo RREO 2019 | Copo acima da linha; PREFEITURA 26,77% | 7 |
| 67 | `quando('O Tribunal achou 24')` | 81,24 | Copo TCM 2019 | Auditor ergue a lupa; segundo copo abaixo; marsala; TCM 24,03% | 7 |
| 68 | `quando('abaixo do minimo. Rejeicao')` | 83,24 | Linha 25% | Linha dos 25% pulsa sobre o copo | 7 |
| 69 | `quando('Rejeicao de novo')` | 84,38 | Carimbo | Carimbo "TCM: REJEIÇÃO" no marco 2019 | 7 |
| 70 | `quando('2020.')` | 85,50 | Marco 2020 | Marco acende | 7 |
| 71 | `quando('Terceira rejeicao')` | 86,34 | Carimbo | Terceiro carimbo seguido; placar "3 SEGUIDAS" ★ | 7 |
| 72 | `quando('2021.')` | 87,86 | Marco 2021 | Câmera anda; o que acendeu volta ao neutro | 7 |
| 73 | `quando('O Fundeb sobe')` | 88,96 | Coluna 2021 | Coluna até 12,9 fatias | 7 |
| 74 | `quando('98 milhoes')` | 89,76 | Etiqueta | "FUNDEB R$ 98 MI" (2020: R$ 76 MI) ★ | 7 |
| 75 | `quando('No SIOPE, abaixo')` | 91,06 | Copo 2021 | Copo abaixo da linha; marsala; 22,32% | 7 |
| 76 | `quando('a pandemia livrou')` | 92,82 | Livro | Livrinho da Constituição abre "EC 119/2022"; copo volta ao neutro | 7 |
| 77 | `quando('saiu incompleto')` | 95,18 | Folhas RREO | Folha do relatório de dez/2021 sobe com o total "0,00" | 7 |
| 78 | `quando('como em 2020')` | 96,10 | Folhas RREO | Folha de dez/2020 sobe ao lado, com metade em branco | 7 |
| 79 | `quando('2022 e 2023')` | 97,18 | Marcos 2022 e 2023 | Os dois marcos acendem juntos (um plano só) | 8 |
| 80 | `quando('170 e 195')` | 99,32 | Colunas | Colunas até 17 e 19,5 fatias; R$ 170 MI e R$ 195 MI | 8 |
| 81 | `quando('195 milhoes')` | 100,42 | Etiqueta | R$ 195 MI acende | 8 |
| 82 | `quando('Acima do minimo, segundo')` | 101,88 | Copos | Dois copos acima da linha (26,93% e 29,32%) | 8 |
| 83 | `quando('segundo o Tribunal.')` | 102,84 | Carimbos | Dois carimbos claros "TCM: APROVAÇÃO C/ RESSALVAS" | 8 |
| 84 | `quando('Em 2023, quase 43')` | 103,62 | Coluna extra 2023 | 4,3 fatias de outra cor (cinza claro) em cima da coluna de 2023 | 8 |
| 85 | `quando('43 milhoes de precatorios')` | 104,92 | Coluna extra 2023 | Fatias extras brilham de leve | 8 |
| 86 | `quando('precatorios do Fundef.')` | 106,14 | Etiqueta | "PRECATÓRIOS DO FUNDEF · R$ 42,9 MI" | 8 |
| 87 | `quando('2024.')` | 107,36 | Marco 2024 | Câmera chega; grua começa a subir | 8 |
| 88 | `quando('Recorde')` | 108,66 | Coluna 2024 | Coluna sobe até 27 fatias, a mais alta da rua | 8 |
| 89 | `quando('269')` | 109,28 | Etiqueta | R$ 269 MI no acento | 8 |
| 90 | `quando('A prefeitura pagou 51')` | 111,20 | Moedas | Moedas saem da coluna extra de 2023 para um grupo de bonecos (trabalhadores da educação) | 8 |
| 91 | `quando('Fundef aos trabalhadores')` | 113,64 | Bonecos | Grupo de bonecos genéricos (trabalhadores da educação) recebe as moedas | 8 |
| 92 | `quando('aos trabalhadores')` | 113,98 | Etiqueta | "R$ 51 MI · PRECATÓRIOS PAGOS · SEGUNDO A PREFEITURA" | 8 |
| 93 | `quando('ajuda federal')` | 115,76 | Barra 1 | Barra em pé com marca de 50% e etiqueta "VAAT · EDUCAÇÃO INFANTIL" | 8 |
| 94 | `quando('educacao infantil')` | 117,68 | Barra 1 | Etiqueta da barra acende | 8 |
| 95 | `quando('foi 11%')` | 118,42 | Barra 1 | Enche só até 11,43%; marsala | 8 |
| 96 | `quando('15% para obras')` | 119,98 | Barra 2 | Segunda barra, marca de 15%, "OBRAS E EQUIPAMENTOS" | 8 |
| 97 | `quando('menos de 2%')` | 121,74 | Barra 2 | Enche até 1,81%; marsala | 8 |
| 98 | `quando('2025.')` | 122,98 | Marco 2025 | Barras somem; câmera desce para 2025 | 9 |
| 99 | `quando('Previsto: 277')` | 124,40 | Coluna fantasma 2025 | Contorno até 27,7 fatias; "PREVISTO R$ 277 MI" | 9 |
| 100 | `quando('277 milhoes')` | 125,70 | Etiqueta | Valor do previsto digita no contorno | 9 |
| 101 | `quando('O balanco mostra')` | 127,10 | Placa BALANÇO | Placa BALANÇO ANUAL e coluna de 23 fatias | 9 |
| 102 | `quando('a planilha do portal')` | 129,12 | Placa PLANILHA | Placa PLANILHA DO PORTAL e coluna de 25 fatias | 9 |
| 103 | `quando('o relatorio 300')` | 131,48 | Placa RELATÓRIO | Placa RREO DEZ/2025 e coluna de 30 fatias | 9 |
| 104 | `quando('O SIOPE diz 26')` | 132,62 | Copo SIOPE 2025 | Copo acima da linha; 26,23% | 9 |
| 105 | `quando('26%. O relatorio')` | 133,42 | Câmera | Câmera vira do copo SIOPE para o copo do relatório | 9 |
| 106 | `quando('prefeitura, 24')` | 135,18 | Copo RREO 2025 | Copo abaixo da linha; marsala; 24,18% | 9 |
| 107 | `quando('24%, abaixo', 2)` | 135,78 | Linha 25% | Linha dos 25% pulsa sobre o copo de 2025 | 9 |
| 108 | `quando('Obras saltam')` | 138,08 | Material de obra | Tijolos, tábuas e cones crescem ao lado da escola; "OBRAS R$ 51 MI" (2024: R$ 2,5 MI) | 9 |
| 109 | `quando('2026, ate agosto')` | 140,60 | Marco 2026 | Marco claro; barra de meses enche até AGO | 10 |
| 110 | `quando('Previstos 240')` | 142,60 | Coluna fantasma 2026 | Contorno até 24 fatias | 10 |
| 111 | `quando('213 empenhados')` | 145,04 | Coluna 2026 | 21 fatias meio transparentes (empenhado) | 10 |
| 112 | `quando('150 pagos')` | 146,26 | Coluna 2026 | 15 delas ficam sólidas (pago) | 10 |
| 113 | `quando('Em maio')` | 147,46 | Caixas de merenda | Pilha de caixas de merenda sobe ao lado da escola | 10 |
| 114 | `quando('Policia Federal investigou')` | 148,26 | Lupa | Lupa grande desce sobre as caixas; selo "INVESTIGAÇÃO · PF E CGU · MAIO/2026" | 10 |
| 115 | `quando('contrato de merenda')` | 149,34 | Etiqueta | "CONTRATO R$ 15,5 MI" | 10 |
| 116 | `quando('com sobrepreco')` | 151,44 | Balança | Balança sobe: prato esquerdo "SEGUNDO A PF: SOBREPREÇO > R$ 1,7 MI" | 10 |
| 117 | `quando('1,7 milhao')` | 152,52 | Balança | Prato da PF desce | 10 |
| 118 | `quando('segundo a PF')` | 153,88 | Selo | "SEGUNDO A PF" no prato, sem afirmar crime | 10 |
| 119 | `quando('A prefeitura nega')` | 154,90 | Balança | Prato direito "PREFEITURA NEGA", mesmo tamanho; balança volta ao meio | 10 |
| 120 | `quando('Ministerio Publico apura')` | 156,10 | Etiqueta | "MP-BA APURA FALTA DE MERENDA E ÁGUA NAS ESCOLAS" | 10 |
| 121 | `quando('A conta')` | 158,42 | Rua do tempo | Câmera sobe; a rua inteira à vista; caixas e balança afundam | 11 |
| 122 | `quando('de 2008 a 2025')` | 159,06 | Colunas | Colunas de 2008 a 2025 acendem em onda | 11 |
| 123 | `quando('2 bilhoes e 90')` | 161,24 | Contador | Contador grande: R$ 2,09 BI | 11 |
| 124 | `quando('Com a inflacao')` | 162,88 | Colunas | Fantasma dourado cresce em cima de cada coluna | 11 |
| 125 | `quando('3 bilhoes e 190')` | 163,80 | Contador | Contador troca para R$ 3,19 BI · EM VALORES DE HOJE | 11 |
| 126 | `quando('a vaquinha devolveu')` | 165,54 | Cofre FUNDEB | Cofre FUNDEB sobe ao lado da prefeitura; canaleta liga os dois | 11 |
| 127 | `quando('mais que o dobro')` | 166,30 | Rótulo | "×2,2" no acento ★ | 11 |
| 128 | `quando('Ilheus pos 613')` | 167,26 | Canaleta | Fluxo fino indo; POS R$ 613 MI | 11 |
| 129 | `quando('recebeu 1 bilhao')` | 169,30 | Canaleta | Fluxo grosso voltando; RECEBEU R$ 1,36 BI | 11 |
| 130 | `quando('Confira no portal')` | 171,52 | MAPA 3 | Corte para o satélite de Ilhéus; etiqueta transparencia.ilheus.ba.gov.br | 12 |
| 131 | `quando('Esse dinheiro chegou')` | 173,02 | MAPA 3 | Pontinhos verdes acendem sobre a área urbana ★ | 12 |
| 132 | `quando('escola do seu bairro')` | 174,10 | MAPA 3 | Pontinhos pulsam juntos | 12 |
| 133 | `quando('Me conta')` | 174,98 | Interface | Balão de comentário | 12 |
| 134 | `quando('E segue o')` | 175,90 | Interface | Assinatura; @euMagnoLeite grande; a marca d’água do topo continua | 12 |

★ = sugestão do diretor, além do roteiro.

## 2.4 Cenas com câmera

A distância é referência; no código, a câmera usa o enquadramento automático da base (alvo + o que precisa caber + direção). A câmera nunca fica parada.

### CENA 1: GANCHO (0,00 a 4,64 s)
Abre em: `quando('Em 18 anos')` · Eventos 1 a 7 · Pílula: **EDUCAÇÃO EM ILHÉUS**
- Câmera: Voo do Brasil até Ilhéus, descida contínua em escala logarítmica.
- Aha: Ilhéus gastou 2 bilhões, e os números não batem.

### CENA 2: A REGRA (4,64 a 7,60 s)
Abre em: `quando('A regra')` · Eventos 8 a 10 · Pílula: **A REGRA**
- Câmera:
  - **2a** (4,64 a 7,60 s), grua descendo da maquete inteira até a escola e o copo
    - início: pos [0,0, 16,4, 12,3] · alvo [0,0, 0,6, 0,0] · dist 20 · ângulo 52°
    - fim: pos [1,8, 5,9, 7,4] · alvo [0,0, 1,1, 0,0] · dist 9 · ângulo 32°
- Aha: 25% dos impostos são da escola.

### CENA 3: A VAQUINHA (7,60 a 12,18 s)
Abre em: `quando('E o Fundeb')` · Eventos 11 a 16 · Pílula: **O FUNDEB**
- Câmera: Arco lento sobre o sul da Bahia.
- Aha: A cidade põe no fundo e o fundo devolve.

### CENA 4: 2006–2008 (12,18 a 28,44 s)
Abre em: `quando('2006.')` · Eventos 17 a 30 · Pílula: **2006–2008**
- Câmera:
  - **4a** (12,18 a 22,84 s), travelling baixo do lado de fora da rua
    - início: pos [-9,1, 4,3, -4,6] · alvo [-3,9, 0,8, -1,4] · dist 7 · ângulo 30°
    - fim: pos [-9,8, 3,9, -1,3] · alvo [-4,0, 0,8, -1,0] · dist 6.5 · ângulo 28°
  - **4b** (22,84 a 28,44 s), arco curto no marco 2008
    - início: pos [-10,9, 4,3, -0,3] · alvo [-4,2, 0,9, 0,1] · dist 7.5 · ângulo 27°
    - fim: pos [-10,4, 4,0, 1,0] · alvo [-4,2, 0,9, 0,1] · dist 7 · ângulo 26°
- Aha: Antes de 2008, só o dinheiro do fundo; 2008 fica no limite.

### CENA 5: 2009–2012 (28,44 a 50,52 s)
Abre em: `quando('2009 e 2010')` · Eventos 31 a 46 · Pílula: **2009–2012**
- Câmera:
  - **5a** (28,44 a 35,50 s), um plano só para 2009 e 2010
    - início: pos [-11,2, 5,0, 3,2] · alvo [-4,0, 1,0, 1,3] · dist 8.5 · ângulo 28°
    - fim: pos [-10,5, 4,8, 4,0] · alvo [-4,0, 1,0, 1,3] · dist 8 · ângulo 28°
  - **5b** (35,50 a 44,00 s), mostra o TCM subir e fecha nos dois copos de 2011
    - início: pos [-5,9, 7,7, 5,8] · alvo [0,6, 1,2, -0,2] · dist 11 · ângulo 36°
    - fim: pos [-8,8, 4,1, 6,4] · alvo [-4,3, 0,9, 3,0] · dist 6.5 · ângulo 30°
  - **5c** (44,00 a 50,52 s), travelling
    - início: pos [-8,2, 4,8, 7,7] · alvo [-2,9, 1,0, 3,0] · dist 8 · ângulo 28°
    - fim: pos [-7,2, 4,4, 8,1] · alvo [-2,9, 1,0, 3,0] · dist 7.5 · ângulo 27°
- Aha: 2011: o SIOPE diz que cumpriu, o Tribunal diz que não; 2012 abaixo.

### CENA 6: 2013–2017 (50,52 a 70,32 s)
Abre em: `quando('2013 a 2015')` · Eventos 47 a 58 · Pílula: **2013–2017**
- Câmera:
  - **6a** (50,52 a 58,38 s), travelling pelos três marcos, olhando ao longo do anel
    - início: pos [-7,2, 4,9, 10,0] · alvo [-2,3, 1,0, 3,5] · dist 9 · ângulo 26°
    - fim: pos [-2,1, 4,9, 12,1] · alvo [-0,8, 1,0, 4,1] · dist 9 · ângulo 26°
  - **6b** (58,38 a 66,88 s), chega nos dois copos de 2016
    - início: pos [-0,4, 4,1, 10,9] · alvo [0,0, 1,0, 4,6] · dist 7 · ângulo 26°
    - fim: pos [0,4, 3,3, 10,8] · alvo [0,0, 0,9, 5,3] · dist 6 · ângulo 24°
  - **6c** (66,88 a 70,32 s), grua leve até a linha dos 100 milhões
    - início: pos [2,4, 5,1, 12,2] · alvo [0,8, 1,4, 4,1] · dist 9 · ângulo 24°
    - fim: pos [3,4, 5,2, 12,5] · alvo [0,8, 1,6, 4,1] · dist 9.5 · ângulo 22°
- Aha: Anos acima do mínimo; 2016 com fontes que discordam; 2017 passa dos 100 milhões.

### CENA 7: 2018–2021 (70,32 a 97,18 s)
Abre em: `quando('2018.')` · Eventos 59 a 78 · Pílula: **2018–2021**
- Câmera:
  - **7a** (70,32 a 78,16 s), plano médio com o TCM ao fundo (de cima)
    - início: pos [8,1, 8,0, 7,5] · alvo [3,5, 1,2, 0,2] · dist 11 · ângulo 38°
    - fim: pos [4,8, 6,3, 10,4] · alvo [1,6, 1,0, 3,9] · dist 9 · ângulo 36°
  - **7b** (78,16 a 85,50 s), close nos copos de 2019 e no auditor
    - início: pos [5,2, 3,9, 9,1] · alvo [2,9, 0,9, 4,4] · dist 6 · ângulo 30°
    - fim: pos [5,9, 3,5, 8,2] · alvo [2,9, 0,9, 4,4] · dist 5.5 · ângulo 28°
  - **7c** (85,50 a 87,86 s), recua para mostrar os três carimbos
    - início: pos [7,5, 5,7, 7,8] · alvo [2,9, 1,2, 3,0] · dist 8 · ângulo 34°
    - fim: pos [6,5, 7,4, 10,1] · alvo [2,2, 1,2, 3,5] · dist 10 · ângulo 38°
  - **7d** (87,86 a 97,18 s), travelling; folhas dos relatórios sobem
    - início: pos [8,9, 4,8, 6,9] · alvo [3,4, 1,0, 2,4] · dist 8 · ângulo 28°
    - fim: pos [9,8, 5,4, 6,1] · alvo [3,4, 1,2, 2,4] · dist 8.5 · ângulo 30°
- Aha: Três pareceres seguidos pela rejeição; a pandemia livra 2021.

### CENA 8: 2022–2024 (97,18 a 122,98 s)
Abre em: `quando('2022 e 2023')` · Eventos 79 a 97 · Pílula: **2022–2024**
- Câmera:
  - **8a** (97,18 a 107,36 s), um plano só para 2022 e 2023
    - início: pos [11,2, 5,8, 4,3] · alvo [4,0, 1,3, 1,3] · dist 9 · ângulo 30°
    - fim: pos [11,5, 5,9, 3,3] · alvo [4,0, 1,4, 1,3] · dist 9 · ângulo 30°
  - **8b** (107,36 a 115,76 s), grua subindo com a coluna recorde; mostra os bonecos recebendo
    - início: pos [12,8, 4,4, 0,4] · alvo [4,2, 1,6, 0,1] · dist 9 · ângulo 18°
    - fim: pos [13,9, 7,2, -0,2] · alvo [5,6, 1,6, 0,2] · dist 10 · ângulo 34°
  - **8c** (115,76 a 122,98 s), arco curto nas duas barras
    - início: pos [12,3, 4,3, -0,4] · alvo [6,0, 1,2, 0,2] · dist 7 · ângulo 26°
    - fim: pos [11,7, 3,8, -1,0] · alvo [6,0, 1,0, 0,2] · dist 6.5 · ângulo 26°
- Aha: Acima do mínimo; precatórios pagos; recorde, mas regras do Fundeb abaixo.

### CENA 9: 2025 (122,98 a 140,60 s)
Abre em: `quando('2025.')` · Eventos 98 a 108 · Pílula: **2025**
- Câmera:
  - **9a** (122,98 a 140,60 s), desce no meio das placas; arco curto
    - início: pos [14,0, 6,6, -1,3] · alvo [5,5, 1,3, -0,9] · dist 10 · ângulo 32°
    - fim: pos [13,0, 5,6, -3,2] · alvo [5,5, 1,1, -0,9] · dist 9 · ângulo 30°
- Aha: Três números oficiais para o mesmo ano.

### CENA 10: 2026 (140,60 a 158,42 s)
Abre em: `quando('2026, ate agosto')` · Eventos 109 a 120 · Pílula: **2026**
- Câmera:
  - **10a** (140,60 a 147,46 s), avanço lento até o marco claro
    - início: pos [10,7, 4,8, -3,4] · alvo [3,9, 1,0, -1,4] · dist 8 · ângulo 28°
    - fim: pos [9,7, 4,1, -4,0] · alvo [3,9, 1,0, -1,4] · dist 7 · ângulo 26°
  - **10b** (147,46 a 158,42 s), arco curto nas caixas, na lupa e na balança (os dois pratos no quadro)
    - início: pos [-4,6, 5,2, 8,6] · alvo [-2,2, 1,2, 2,1] · dist 8 · ângulo 30°
    - fim: pos [-3,3, 4,3, 8,5] · alvo [-2,4, 1,0, 2,4] · dist 7 · ângulo 28°
- Aha: O ano está em andamento; a merenda está sob investigação, e a prefeitura nega.

### CENA 11: A CONTA (158,42 a 171,52 s)
Abre em: `quando('A conta')` · Eventos 121 a 129 · Pílula: **A CONTA**
- Câmera:
  - **11a** (158,42 a 165,54 s), grua subindo até ver a rua inteira
    - início: pos [0,0, 14,8, 11,6] · alvo [0,0, 1,0, 0,0] · dist 18 · ângulo 50°
    - fim: pos [3,9, 22,4, 10,6] · alvo [0,0, 1,2, 0,0] · dist 24 · ângulo 62°
  - **11b** (165,54 a 171,52 s), desliza até a prefeitura e o cofre do Fundeb
    - início: pos [-11,0, 8,7, 6,8] · alvo [-5,8, 1,0, -0,8] · dist 12 · ângulo 40°
    - fim: pos [-11,9, 6,9, 4,5] · alvo [-5,8, 1,0, -0,8] · dist 10 · ângulo 36°
- Aha: 2 bilhões gastos; o fundo devolveu mais que o dobro.

### CENA 12: É SEU (171,52 a 179,06 s)
Abre em: `quando('Confira no portal')` · Eventos 130 a 134 · Pílula: **É SEU**
- Câmera: Giro lento sobre Ilhéus.
- Aha: Você pode conferir.

## 2.5 Fatos e fontes

Todas as fontes estão em `audio/fontes.md` (documento, página ou linha, valor exato), na ordem da fala. A fala arredonda os decimais e o selo de cada bloco mostra o valor exato (tabela no fim do `fontes.md`).

**Conferir antes de publicar:** andamento da Operação Merenda Digna e da apuração do MP-BA (se houver denúncia, arquivamento ou nova nota da prefeitura, atualizar o bloco de 2026); RREO do 5º bimestre de 2026; parecer do TCM sobre 2024 ou 2025.

## 2.6 Trilha e sons

| Som | Onde |
|---|---|
| `whoosh` | toda troca de cena (12) e entrada e saída dos mapas |
| `tique` | pílula muda (cada bloco de ano) |
| `pop` | cada número ou etiqueta que entra |
| `subida` | colunas crescendo; contador R$ 2,09 BI → R$ 3,19 BI |
| `impacto` | carimbos (Câmara e TCM) |
| `bip` | lupa descendo sobre as caixas (suave) |
| `baque` | copo que para abaixo da linha dos 25% (leve, sem tom de ameaça) |
| `ding` | "mais que o dobro" e coluna recorde de 2024 |
| `bip` | barra de meses de 2026 |

Trilha de fundo: nenhuma, salvo se a pessoa mandar uma sem direitos autorais em `sfx/trilha.wav`.

## 2.7 Arquivos

- **Novos:** `src/videos/educacaoilheus/EducacaoIlheus.tsx` (mundo, câmeras, interface, `FAIXAS` de som, `REVISAO`, capa); `src/videos/educacaoilheus/pecas.tsx` com: `RuaDoTempo` (anel com 21 `MarcoAno`), `ColunaAno` (coluna de moedas com fatias e contorno do previsto), `CopoFonte` (copo de piso com etiqueta da fonte), `CarimboParecer` (carimbo do 028 com texto livre), `PlacaFonte3D` (placa em pé), `BarraMeses` (2026), `CaixasMerenda` (pilha de caixas de alimento), `LupaGrande` (lupa da investigação); `palavras.ts` (pronto).
- **Kit Mapas:** `src/videos/educacao-ilheus/` (molde do `orcamento-ilheus`, que já tem o contorno de Ilhéus) com três composições curtas: `EducacaoIlheusMapa1`, `Mapa2`, `Mapa3`, sem legenda, sem marca e sem som; MP4 copiados para `projetos/029. educação em ilhéus/`.
- **Alterados:** `src/Root.tsx` (composições `EducacaoIlheus`, `EducacaoIlheusGuia`, `EducacaoIlheusLimpo`, `CapaEducacaoIlheus`).
- **Reaproveitados:** do 014 (`src/videos/orcamentoilheus/pecas.tsx`): `MesaMaquete`, `PonteMini`, `Escola`, `Prefeitura`, `PredioTCM`, `RelatorioPDF`, `CopoPiso`; do catálogo: `MarcoAno`, `PilhaMoedas`, `CofreFGTS`, `TrilhoMoedas`, `ContadorVagas`, `Pessoa`, `LivroPopUp`, `Balanca`, `CasaMini`, `Casinha`; da base: `Marca`, `Palco`, legenda e área segura.
- **Total:** 5399 quadros a 30 fps. Vídeo acima de 2,5 min: render com `--quadros-por-parte=400` e a prévia do Studio fechada (regra do 018).

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- Vídeo de uma cidade usa só documentos dessa cidade; dados de prefeitura com selo de documento e página (014, 016).
- Linha do tempo com o ano abrindo cada bloco e a fonte dentro do bloco (016, 029).
- Juntar os dois kits: mapa em MP4 sem legenda, marca e som, encaixado em `OffthreadVideo`; selos sobre o mapa no topo (013, 015).
- Marca d'água @euMagnoLeite do começo ao fim, uma só (029).
- Mesmo assunto em série mantém o mundo (maquete do 014); guindaste não, material de obra sim (014).
- Dois nomes ditos a menos de 1 s: um plano só (2022 e 2023).
- Prédio que olha para a rua: filmar de cima (TCM em 2018).
- Rótulo 2D com pelo menos 1,5 s na tela; número com vírgula chamado pela palavra de antes (014, 020).
- Sem flash; tudo acende e apaga em pelo menos 0,4 s; o que acende volta ao neutro.
- Tema polêmico: balança com os dois lados no mesmo tamanho, número com "segundo" quem disse, pessoa real nunca na tela (investigação da merenda).
- Em série histórica, todo ano entra; anos sem novidade acendem juntos (029).

**Escolhas do diretor:** colunas de moedas no lugar de grades de pilhas (as grades de anos vizinhos se encostariam com marcos a 0,8 m); contorno do previsto da lei atrás da coluna real; dois copos lado a lado quando as fontes discordam; carimbos com cores por tipo de parecer; barra de meses em 2026; os extras marcados com ★.
