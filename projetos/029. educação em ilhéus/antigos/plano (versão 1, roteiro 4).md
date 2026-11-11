# Plano de cenas: 029. educação em ilhéus (versão 1, para aprovação)

Código `educacaoilheus` · Nome `EducacaoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo e encaixa **três trechos de satélite** do Kit Mapas Animados (`OffthreadVideo` em `Sequence`, entrada e saída de 0,2 s). Legenda, pílula, selos e a marca d'água do 3D ficam por cima de tudo.
**Regras deste vídeo (pedidos da pessoa):** dados só do levantamento `~/Documents/EDUCACAO-ILHEUS`; linha do tempo ano a ano, com a fonte dentro de cada bloco; o valor exato de cada número arredondado na fala aparece no selo; **marca d'água @euMagnoLeite do primeiro ao último quadro**.
## 2.1 Narração
- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4, arquivo de 05/11 18:04) · preparo: **1,253x** (pedido da pessoa para 2 min 58 s), pausas de no máximo 0,35 s, volume -15 · duração **178,15 s** · `AUDIO_SEG = 178.15` · `QUADROS = 5372` (com 0,9 s de folga).
- 438 palavras no `palavras.ts` (igual ao roteiro); a última ("informações.") termina em 177,74 s. Nenhuma pausa maior que 1,5 s. Final conferido.
- Ajustes: transcrição limpa na velocidade final (sem palavras inventadas, sem "R$" a mais). "Siópe" da voz vira "SIOPE" na legenda (`"Siópe=>SIOPE"` no alinhamento). Cópia em `transcricao/palavras-original.json`; a versão de 1,2x está em `antigos/`.

**Palavras repetidas** (o `quando()` pega a primeira; use o trecho indicado):

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| 2008 | 29,38 · 156,32 | `quando('2008.')` (bloco) · `quando('de 2008 a 2025')` (conta) |
| 2023 | 102,14 · 108,08 | `quando('2022 e 2023')` · `quando('Em 2023, quase 43')` |
| 2025 | 123,90 · 157,12 | `quando('2025.')` · `quando('de 2008 a 2025')` |
| minimo | 34,88 · 48,44 · 56,54 · 82,38 · 94,50 · 106,52 · 139,04 · 153,82 | sempre com a palavra de antes ou depois (`'limite do minimo'`, `'Ficou abaixo'`, `'abaixo do minimo. De novo'`...) |
| fundeb | 12,18 · 22,52 · 24,64 · 75,58 · 91,16 · 117,04 | `quando('E tem o Fundeb')` · `quando('Nasce o Fundeb')` · `quando('O Fundeb sobe')` · `quando('ajuda federal ao Fundeb')` |
| siope | 31,22 · 48,86 · 54,46 · 93,52 · 134,22 | `quando('Comeca o SIOPE')` · `quando('O SIOPE diz 22')` · `quando('No SIOPE, abaixo')` · `quando('O SIOPE diz 26')` |
| tribunal | 67,20 · 72,18 · 79,98 · 98,72 · 107,38 · 142,42 | sempre com o verbo (`'O Tribunal achou'`, `'recomendou rejeitar'`, `'Parecer do Tribunal'`) |
| relatorio | 57,12 · 87,96 · 96,78 · 132,78 · 136,24 | `'relatorio da prefeitura, 27'` · `'relatorio de dezembro saiu incompleto'` · `'saiu zerado'` · `'o relatorio 300'` · `'relatorio da prefeitura, 24'` |
| 24 | 80,60 · 137,26 | `quando('24%')` (2019) · `quando('24%, abaixo', 2)` (2025) |
| milhoes | 20,54 · 25,62 · 33,58 · 38,40 · 44,98 · 52,08 · 63,98 · 92,46 … | nunca sozinho; sempre o número antes |

> Lembrete da base: `quando()` tira vírgula e % dos números ("22,8" vira "228"). Os números com vírgula foram tirados da fala; os percentuais são chamados pela palavra de antes.

## 2.2 Ideia e mundo

**A metáfora: a maquete de Ilhéus do vídeo 014 com a ESCOLA no centro e uma RUA DO TEMPO em volta.** A mesma mesa redonda, o mar no canto, a ponte e as casinhas, para quem viu o orçamento de Ilhéus reconhecer na hora. Em volta da escola corre um anel no chão com **21 marcos de ano (2006 a 2026)**. O vídeo anda pela rua **na mesma ordem da fala**: cada ano acende o seu marco e ganha o que aconteceu nele. Cada ano vira **uma coluna de moedas**, com altura proporcional ao gasto (**1 fatia = R$ 10 milhões**), formando um gráfico de barras em volta da escola. No fim, a câmera sobe e mostra a história inteira de uma vez.

**As marcas da rua do tempo (uma linguagem só, o vídeo inteiro):**

| O que | Como aparece | Cor |
|---|---|---|
| Gasto do ano | coluna de moedas no marco (0,12 m por R$ 10 mi) | dourado |
| Previsto na lei do orçamento | contorno transparente da coluna, um pouco maior | dourado a 30% |
| % dos impostos na educação | copo de piso do lado de fora do marco, com a linha dos 25% | acima: neutro · abaixo: marsala |
| Quando as fontes discordam | dois copos lado a lado, com etiqueta SIOPE, PREFEITURA ou TCM | idem |
| Parecer do TCM ou julgamento da Câmara | carimbo em cima do marco | rejeição: marsala · aprovação: `tema.objetoClaro` |
| Ano sem dado de gasto | "?" no marco | `tema.objeto` a 40% |

**Protagonista:** não há. O personagem é o dinheiro da educação (as colunas) e a escola. Pessoas só como bonecos genéricos sem rosto: alunos na porta da escola e o auditor do TCM (etiqueta "TCM-BA").

**Marca d'água:** "MAGNO EXPLICA · @euMagnoLeite" na marca do topo (`Marca`, `CABECALHO.marca`), **de 0 a 178,15 s**, por cima do 3D e dos três mapas (opacidade 0,5, `tema.texto`). O Kit Mapas sai sem a marca do `marca.json`, para não duplicar.

**Placar fixo:** "1 FATIA = R$ 10 MILHÕES", no alto, de `quando('2008.')` (29,38 s) até `quando('O dinheiro e seu')` (169,30 s).

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Tempo | O que mostra |
|---|---|---|
| **MAPA 1: ILHÉUS** | 0,00 a 4,90 s | Brasil visto de cima, descida no satélite até Ilhéus; contorno do município (IBGE 2913606) acende em verde; R$ 2 BILHÕES · EDUCAÇÃO 2008 A 2025; três etiquetas que não batem (26,2% · 24,2% · 24%). Câmera sempre descendo devagar. |
| **MAPA 2: O FUNDEB** | 11,76 a 17,76 s | Ilhéus no sul da Bahia; círculo FUNDO no estado; setas finas de Ilhéus ao FUNDO (20%, FPM, ICMS) e seta grossa de volta. Câmera em arco lento. |
| **MAPA 3: É SEU** | 169,30 a 178,15 s | Satélite de Ilhéus, contorno verde, câmera girando devagar; etiqueta transparencia.ilheus.ba.gov.br; pontinhos verdes na área urbana. |

- Os trechos saem sem legenda, sem marca e sem som (1080 × 1920), com os tempos tirados deste `palavras.ts`. Selos do 3D por cima do mapa vão no topo (y 470). Nomes em sequência no mesmo lugar: o anterior sai 6 quadros antes do próximo.

**Selos de fonte** (maiores, com documento e número exato, embaixo da pílula; um por bloco):

| Entra em | Tempo | Texto do selo |
|---|---|---|
| `A fonte aparece` | 6,92 | PORTAL DA TRANSPARÊNCIA · SIOPE/FNDE · TCM-BA |
| `25% dos impostos` | 9,08 | CONSTITUIÇÃO, ART. 212 |
| `20% de` | 14,12 | RREO DEZ/2023 · ANEXO 8, LINHA 4 · FPM, ICMS, IPI, ITR, IPVA |
| `2006.` | 17,76 | TESOURO NACIONAL · TRANSF. CONSTITUCIONAIS · R$ 14,09 MI |
| `2007.` | 23,26 | TESOURO NACIONAL · R$ 19,14 MI · CÂMARA, DEC. LEG. 001/2010 |
| `2008.` | 29,38 | SIOPE/FNDE 2008 · R$ 42,66 MI · 25,24% · CÂMARA, DEC. LEG. 001/2011 |
| `2009.` | 36,98 | SIOPE 2009 · R$ 54,20 MI · 32,33% · CÂMARA, DEC. LEG. 002/2011 |
| `2012.` | 43,10 | SIOPE 2012 · R$ 69,44 MI · 22,79% · LOA 2012 (LEI 3593/2011): R$ 83,24 MI |
| `2016.` | 49,50 | LOA 2016 (LEI 3775/2016) · SIOPE 22,10% · RREO DEZ/2016 ANEXO 14: 27,46% |
| `2017.` | 62,24 | SIOPE 2017 · R$ 108,28 MI |
| `2018.` | 65,54 | PARECER TCM-BA 04894e19 · 22,89% → 25,60% |
| `2019.` | 76,30 | RREO DEZ/2019: 26,77% · PARECER TCM-BA 06442e20: 24,03% |
| `2020.` | 84,82 | PARECER TCM-BA 09984e21 · RREO DEZ/2020 INCOMPLETO |
| `2021.` | 90,02 | SIOPE 2021: 22,32% · EC 119/2022 · RREO DEZ/2021 · PARECER TCM 11985e22 |
| `2022 e 2023` | 101,04 | PARECERES TCM-BA 07770e23 (26,93%) E 07666e24 (29,32%) · SIOPE |
| `2024.` | 111,90 | SIOPE · BALANÇO 2024: R$ 269,27 MI · RREO DEZ/2024 ANEXO 14: VAAT 11,43% E 1,81% |
| `2025.` | 123,90 | LOA 2025: R$ 276,86 MI · BALANÇO R$ 231,19 MI · PLANILHA R$ 248,95 MI · RREO R$ 300,23 MI · SIOPE 26,23% · RREO 24,18% |
| `2026, ate agosto` | 144,24 | LOA 2026: R$ 239,86 MI · RREO 4º BIM/2026 (JAN-AGO): 18,52% |
| `A conta` | 155,36 | SIOPE 2008-2025 · IPCA/BANCO CENTRAL ATÉ SET/2026 · CONTA DO VÍDEO |

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
| precatórios (fatias extras de 2023) | `tema.objetoClaro` |

**Mapa do mundo** (mesa redonda de raio 9 m do 014; chão da mesa em y = 0; frente da câmera é z+; ângulo dos marcos: 2006 em 200°, 11° por ano, 2016 bem na frente):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa da maquete | [0, 0, 0] | `MesaMaquete` (014) |
| Mar, ponte e casinhas | anel de raio 7 a 8,5, atrás (z < -3) | `PonteMini`, `CasaMini`, `Casinha` |
| Escola grande | [0, 0, 0] | `Escola` (014), escala 1,6, letreiro "EDUCAÇÃO"; alunos na porta ★ |
| Marco 2006 | [-3,9, 0,0, -1,4] | `MarcoAno`; coluna em [-3,3, 0,0, -1,2]; copo em [-4,7, 0,0, -1,7] |
| Marco 2008 | [-4,2, 0,0, 0,1] | `MarcoAno`; coluna em [-3,5, 0,0, 0,1]; copo em [-5,0, 0,0, 0,2] |
| Marco 2012 | [-2,9, 0,0, 3,0] | `MarcoAno`; coluna em [-2,4, 0,0, 2,5]; copo em [-3,5, 0,0, 3,6] |
| Marco 2016 | [0,0, 0,0, 4,2] | `MarcoAno`; coluna em [0,0, 0,0, 3,5]; copo em [0,0, 0,0, 5,0] |
| Marco 2018 | [1,6, 0,0, 3,9] | `MarcoAno`; coluna em [1,3, 0,0, 3,2]; copo em [1,9, 0,0, 4,6] |
| Marco 2019 | [2,3, 0,0, 3,5] | `MarcoAno`; coluna em [1,9, 0,0, 2,9]; copo em [2,7, 0,0, 4,2] |
| Marco 2024 | [4,2, 0,0, 0,1] | `MarcoAno`; coluna em [3,5, 0,0, 0,1]; copo em [5,0, 0,0, 0,2] |
| Marco 2025 | [4,1, 0,0, -0,7] | `MarcoAno`; coluna em [3,5, 0,0, -0,5]; copo em [4,9, 0,0, -0,8] |
| Marco 2026 | [3,9, 0,0, -1,4] | `MarcoAno`; coluna em [3,3, 0,0, -1,2]; copo em [4,7, 0,0, -1,7] |
| Demais marcos | mesmo anel, 11° entre eles | colunas dos anos não citados crescem em onda, sem número |
| Segundo copo (2016, 2019, 2025) | 0,7 m mais para fora, ex. 2019: [3,1, 0,0, 4,8] | etiqueta SIOPE / PREFEITURA / TCM na base |
| Prefeitura | [-5,5, 0,0, -3,0] | `Prefeitura` (014) |
| Cofre FUNDEB | [-6,0, 0,0, 1,5] | `CofreFGTS` com letreiro "FUNDEB"; sobe só na conta final |
| Canaleta | entre prefeitura e cofre | `TrilhoMoedas` (ida fina, volta grossa) |
| Tribunal de Contas | [5,5, 0,0, -3,5] | `PredioTCM` (014); sobe em 2018 e fica |
| Auditor do TCM | [3,4, 0,0, 5,3] | boneco genérico (`Pessoa`) com lupa e etiqueta "TCM-BA" ★ |
| Placas de 2025 (BALANÇO, PLANILHA, RELATÓRIO) | em arco de raio 6,5 em volta de [4,1, 0,0, -0,7] | peça nova `PlacaFonte3D` |
| Barras do VAAT (2024) | [6,0, 0,0, 0,2] | `ContadorVagas` (catálogo), duas barras com marca de 50% e 15% |
| Material de obra (2025) | [1,8, 0, 1,4] | tijolos, tábuas e cones (regra do 014: nada de guindaste) |
| Folhas dos relatórios 2020 e 2021 | flutuando sobre os marcos | `RelatorioPDF` (014) |

**Regras visuais:** o acento só no ano falado, na linha dos 25% e no contorno de Ilhéus. Tudo que acende volta ao neutro no bloco seguinte. Nada aparece antes do seu ano. Nenhum nome de pessoa nem logo: PREFEITURA, FUNDEB, TCM-BA e SIOPE só como letreiro na fonte do perfil. Neutralidade: cada número aparece com quem disse, sem dizer que alguém errou.

## 2.3 Mapa de palavras-chave (133 eventos, 1 a cada 1,34 s)

| # | Palavra (`quando`) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `quando('Em 18 anos')` | 0,00 | MAPA 1 | Abre no Brasil visto de cima; câmera começa a descer para a Bahia | 1 |
| 2 | `quando('anos')` | 0,52 | MAPA 1 | Contador "18 ANOS" pequeno no topo, digitando 2008 → 2025 ★ | 1 |
| 3 | `quando('Ilheus gastou')` | 1,28 | MAPA 1 | Satélite chega em Ilhéus; contorno do município acende em verde | 1 |
| 4 | `quando('2 bilhoes com')` | 1,78 | MAPA 1 | Digita R$ 2 BILHÕES no meio do município | 1 |
| 5 | `quando('educacao.')` | 2,76 | MAPA 1 | Linha de baixo: EDUCAÇÃO · 2008 A 2025 | 1 |
| 6 | `quando('Mas os numeros')` | 3,36 | MAPA 1 | Três etiquetas surgem tortas em volta: 26,2% · 24,2% · 24% ★ | 1 |
| 7 | `quando('nao batem')` | 4,04 | MAPA 1 | As três etiquetas balançam e não se encaixam; selo "SIOPE · RREO · TCM" ★ | 1 |
| 8 | `quando('Abri os documentos')` | 4,90 | Maquete + RelatorioPDF | Corte para o 3D: maquete de Ilhéus vista do alto; quatro documentos sobem e flutuam sobre a mesa | 2 |
| 9 | `quando('documentos oficiais')` | 5,16 | RelatorioPDF | Etiquetas nos documentos: RREO · LOA · BALANÇO · PARECER TCM | 2 |
| 10 | `quando('ano a ano')` | 6,24 | Rua do tempo | O anel de 21 marcos (2006 a 2026) acende de uma ponta à outra em onda | 2 |
| 11 | `quando('A fonte aparece')` | 6,92 | Selo | Primeiro selo de fonte embaixo da pílula: PORTAL DA TRANSPARÊNCIA · SIOPE/FNDE · TCM-BA | 2 |
| 12 | `quando('A regra')` | 8,38 | Escola | Câmera desce até a escola no centro; letreiro EDUCAÇÃO acende | 2 |
| 13 | `quando('25% dos impostos')` | 9,08 | Copo dos 25% | Copo grande sobe ao lado da escola; linha dos 25% no acento | 2 |
| 14 | `quando('vao para a educacao')` | 10,72 | Moedas | 4 moedas caem na frente da escola; 1 rola para dentro da porta e acende | 2 |
| 15 | `quando('E tem o Fundeb')` | 11,76 | MAPA 2 | Corte para o mapa: Ilhéus no sul da Bahia | 3 |
| 16 | `quando('uma vaquinha')` | 12,68 | MAPA 2 | Círculo "FUNDO" aparece no estado, com moedinha girando | 3 |
| 17 | `quando('a cidade poe')` | 13,44 | MAPA 2 | Ilhéus pisca uma vez em verde | 3 |
| 18 | `quando('20% de')` | 14,12 | MAPA 2 | Setas finas saem de Ilhéus até o FUNDO; etiqueta "20%" | 3 |
| 19 | `quando('alguns repasses')` | 14,88 | MAPA 2 | Etiquetas FPM e ICMS correm nas setas ★ | 3 |
| 20 | `quando('o fundo devolve')` | 15,90 | MAPA 2 | Seta mais grossa volta do FUNDO para Ilhéus | 3 |
| 21 | `quando('para a educacao.', 2)` | 16,70 | MAPA 2 | Ponto da escola acende em Ilhéus no fim da seta ★ | 3 |
| 22 | `quando('2006.')` | 17,76 | Marco 2006 | Volta ao 3D no começo da rua; marco 2006 acende; selo TESOURO NACIONAL | 4 |
| 23 | `quando('So o Tesouro')` | 18,76 | Placa | Plaquinha TESOURO NACIONAL ao lado do marco ★ | 4 |
| 24 | `quando('14 milhoes')` | 20,10 | Coluna FUNDEF 2006 | Coluninha baixa de moedas com etiqueta "FUNDEF · R$ 14 MI" | 4 |
| 25 | `quando('fundo anterior')` | 21,76 | Letreiro | Letreiro FUNDEF ao lado da coluna | 4 |
| 26 | `quando('2007.')` | 23,26 | Marco 2007 | Câmera anda um passo; marco 2007 acende; 2006 volta ao neutro | 4 |
| 27 | `quando('Nasce o Fundeb')` | 24,26 | Letreiro | FUNDEF vira FUNDEB (letreiro gira) ★ | 4 |
| 28 | `quando('19 milhoes')` | 25,22 | Coluna FUNDEB 2007 | Coluninha "FUNDEB · R$ 19 MI" | 4 |
| 29 | `quando('A Camara reprovou')` | 26,30 | Carimbo | Carimbo marsala "CÂMARA: REPROVADA · JAN A AGO/2007" desce no marco | 4 |
| 30 | `quando('O gasto desses anos')` | 27,88 | Marcos 2006 e 2007 | "?" sobe nos dois marcos (sem coluna de gasto) | 4 |
| 31 | `quando('nao achei')` | 28,96 | Marcos | Os "?" balançam; resto em neutro | 4 |
| 32 | `quando('2008.')` | 29,38 | Marco 2008 | Câmera anda; marco 2008 acende; placar fixo "1 FATIA = R$ 10 MILHÕES" entra no alto | 5 |
| 33 | `quando('Comeca o SIOPE')` | 30,76 | Placa SIOPE | Placa SIOPE · GOVERNO FEDERAL sobe ao lado da rua | 5 |
| 34 | `quando('43 milhoes')` | 33,06 | Coluna 2008 | Coluna de moedas cresce até 4 fatias e um pedaço; etiqueta R$ 43 MI | 5 |
| 35 | `quando('no limite do minimo')` | 34,30 | Copo 2008 | Copo sobe e para encostado na linha dos 25% (25,24%) | 5 |
| 36 | `quando('A Camara aprovou')` | 35,30 | Carimbo | Carimbo claro "CÂMARA: APROVADA" | 5 |
| 37 | `quando('2009.')` | 36,98 | Marco 2009 | Marco acende; 2008 volta ao neutro | 5 |
| 38 | `quando('54 milhoes')` | 37,88 | Coluna 2009 | Coluna cresce até 5 fatias e um pedaço; R$ 54 MI | 5 |
| 39 | `quando('maior percentual')` | 39,38 | Copo 2009 | Copo sobe bem acima da linha | 5 |
| 40 | `quando('32%')` | 41,24 | Copo 2009 | Número 32,33% acende no acento | 5 |
| 41 | `quando('Contas aprovadas')` | 41,84 | Carimbo | Carimbo claro "CÂMARA: APROVADA" | 5 |
| 42 | `quando('2012.')` | 43,10 | Rua do tempo | Câmera anda pela rua; colunas de 2010 e 2011 crescem no caminho (sem número) | 6 |
| 43 | `quando('Gastou 69')` | 44,18 | Coluna 2012 | Coluna até 7 fatias; R$ 69 MI | 6 |
| 44 | `quando('menos que os 83')` | 45,88 | Coluna fantasma 2012 | Contorno transparente até 8 fatias (o previsto) atrás da coluna real ★ | 6 |
| 45 | `quando('previstos')` | 46,82 | Etiqueta | "PREVISTO R$ 83 MI · LOA 2012" | 6 |
| 46 | `quando('Ficou abaixo')` | 47,70 | Copo 2012 | Copo para abaixo da linha; marsala; 22,79% | 6 |
| 47 | `quando('2016.')` | 49,50 | Rua do tempo | Câmera segue; colunas de 2013 a 2015 crescem no caminho | 6 |
| 48 | `quando('Previsto: 119')` | 50,66 | Coluna fantasma 2016 | Contorno até 12 fatias; "PREVISTO R$ 119 MI" | 6 |
| 49 | `quando('Gasto: 96')` | 52,82 | Coluna 2016 | Coluna real até 10 fatias; R$ 96 MI | 6 |
| 50 | `quando('O SIOPE diz 22%')` | 54,26 | Copo SIOPE 2016 | Copo abaixo da linha; marsala; etiqueta SIOPE 22,10% | 6 |
| 51 | `quando('abaixo do minimo. O relatorio')` | 55,68 | Copo SIOPE 2016 | Copo marsala pulsa uma vez | 6 |
| 52 | `quando('O relatorio da prefeitura, 27%')` | 56,98 | Copo RREO 2016 | Segundo copo ao lado, acima da linha; etiqueta PREFEITURA 27,46% | 6 |
| 53 | `quando('Guarda isso')` | 59,38 | Copos 2016 | Os dois copos balançam; selo "2 FONTES, 2 NÚMEROS" ★ | 6 |
| 54 | `quando('nem sempre concordam')` | 60,90 | Copos 2016 | Linha tracejada liga os dois topos ★ | 6 |
| 55 | `quando('2017.')` | 62,24 | Coluna 2017 | Coluna cresce até 11 fatias | 6 |
| 56 | `quando('Passa dos 100')` | 63,28 | Linha dos 100 mi | Anel fino "R$ 100 MILHÕES" acende na altura de 10 fatias em volta da rua ★ | 6 |
| 57 | `quando('pela primeira vez')` | 64,24 | Coluna 2017 | Topo da coluna passa a linha; R$ 108 MI | 6 |
| 58 | `quando('2018.')` | 65,54 | TCM | Prédio do Tribunal de Contas sobe ao fundo; câmera chega em 2018 | 7 |
| 59 | `quando('Os tecnicos')` | 66,48 | Auditor | Boneco genérico com lupa e etiqueta "TCM-BA" sai do prédio ★ | 7 |
| 60 | `quando('menos de 25%')` | 68,30 | Copo 2018 | Copo para abaixo da linha (22,89%), marsala | 7 |
| 61 | `quando('Apos a defesa')` | 69,58 | Copo 2018 | Copo sobe devagar e passa da linha (25,60%); volta ao neutro | 7 |
| 62 | `quando('Mesmo assim')` | 71,40 | Câmera | Câmera recua um pouco para mostrar o prédio do TCM | 7 |
| 63 | `quando('recomendou rejeitar')` | 72,48 | Carimbo | Carimbo marsala "TCM: REJEIÇÃO" no marco 2018 | 7 |
| 64 | `quando('problemas nas contas')` | 74,60 | Etiquetas | Duas etiquetas pequenas: "SEM PARECER DO CONSELHO DO FUNDEB" · "RESTITUIÇÃO AO FUNDEB PENDENTE" | 7 |
| 65 | `quando('2019.')` | 76,30 | Marco 2019 | Marco acende; câmera fecha nos copos | 7 |
| 66 | `quando('A prefeitura informou')` | 77,32 | Copo RREO 2019 | Copo acima da linha; etiqueta PREFEITURA 26,77% | 7 |
| 67 | `quando('O Tribunal achou')` | 79,48 | Auditor | Boneco do TCM ergue a lupa sobre o copo | 7 |
| 68 | `quando('24%')` | 80,60 | Copo TCM 2019 | Segundo copo abaixo da linha; marsala; etiqueta TCM 24,03% | 7 |
| 69 | `quando('abaixo do minimo. De novo')` | 81,66 | Copo TCM 2019 | Linha dos 25% pulsa uma vez sobre o copo | 7 |
| 70 | `quando('De novo')` | 82,92 | Carimbo | Carimbo "TCM: REJEIÇÃO" no marco 2019 | 7 |
| 71 | `quando('2020.')` | 84,82 | Marco 2020 | Marco acende | 7 |
| 72 | `quando('Terceiro parecer')` | 85,72 | Carimbo | Terceiro carimbo "TCM: REJEIÇÃO"; placar pequeno "3 SEGUIDAS" ★ | 7 |
| 73 | `quando('relatorio de dezembro saiu incompleto')` | 87,96 | Folha RREO 2020 | Folha do relatório sobe com metade em branco; etiqueta "RREO DEZ/2020" | 7 |
| 74 | `quando('2021.')` | 90,02 | Marco 2021 | Câmera anda; o que acendeu volta ao neutro | 8 |
| 75 | `quando('O Fundeb sobe')` | 91,00 | Coluna 2021 | Coluna cresce até 13 fatias | 8 |
| 76 | `quando('98 milhoes')` | 92,02 | Etiqueta | "FUNDEB R$ 98 MI" (em 2020: R$ 76 MI) ★ | 8 |
| 77 | `quando('No SIOPE, abaixo')` | 93,30 | Copo 2021 | Copo abaixo da linha; marsala; 22,32% | 8 |
| 78 | `quando('a pandemia livrou')` | 95,12 | Livro | Livrinho da Constituição abre com "EC 119/2022" | 8 |
| 79 | `quando('de punicao')` | 95,94 | Copo 2021 | Selo "PANDEMIA"; copo volta ao neutro | 8 |
| 80 | `quando('saiu zerado')` | 97,66 | Folha RREO 2021 | Folha do relatório sobe com "0,00" no lugar do total | 8 |
| 81 | `quando('recomendou aprovar')` | 99,02 | Carimbo | Carimbo claro "TCM: APROVAÇÃO C/ RESSALVAS" | 8 |
| 82 | `quando('2022 e 2023')` | 101,04 | Marcos 2022 e 2023 | Os dois marcos acendem juntos; um plano só | 8 |
| 83 | `quando('170 e 195')` | 103,28 | Colunas | Colunas até 17 e 20 fatias | 8 |
| 84 | `quando('195')` | 104,48 | Rótulos | R$ 170 MI e R$ 195 MI nas colunas | 8 |
| 85 | `quando('Acima do minimo')` | 105,98 | Copos | Dois copos acima da linha (26,93% e 29,32%) | 8 |
| 86 | `quando('segundo o Tribunal.')` | 107,02 | Carimbos | Dois carimbos claros "TCM: APROVAÇÃO C/ RESSALVAS" | 8 |
| 87 | `quando('Em 2023, quase 43')` | 107,96 | Coluna extra 2023 | 4 fatias extras de outra cor (cinza claro) em cima da coluna de 2023 | 8 |
| 88 | `quando('precatorios do Fundef')` | 110,60 | Etiqueta | "PRECATÓRIOS DO FUNDEF · R$ 42,9 MI" | 8 |
| 89 | `quando('2024.')` | 111,90 | Marco 2024 | Câmera chega; grua começa a subir | 9 |
| 90 | `quando('Recorde')` | 113,10 | Coluna 2024 | Coluna sobe até 27 fatias, a mais alta da rua | 9 |
| 91 | `quando('269')` | 114,34 | Etiqueta | R$ 269 MI no acento | 9 |
| 92 | `quando('ajuda federal ao Fundeb')` | 116,26 | Barra 1 | Barra em pé com marca de 50% e etiqueta "VAAT · EDUCAÇÃO INFANTIL" | 9 |
| 93 | `quando('metade devia ir')` | 117,68 | Barra 1 | Marca de 50% acende | 9 |
| 94 | `quando('foi 11%')` | 119,76 | Barra 1 | Enche só até 11,43%; marsala | 9 |
| 95 | `quando('15% para obras')` | 121,06 | Barra 2 | Segunda barra com marca de 15% e etiqueta "OBRAS E EQUIPAMENTOS" | 9 |
| 96 | `quando('menos de 2%')` | 122,60 | Barra 2 | Enche até 1,81%; marsala | 9 |
| 97 | `quando('2025.')` | 123,90 | Marco 2025 | Barras somem; câmera desce para 2025 | 9 |
| 98 | `quando('Previsto: 277')` | 125,20 | Coluna fantasma 2025 | Contorno até 28 fatias; "PREVISTO R$ 277 MI · LOA 2025" | 9 |
| 99 | `quando('277 milhoes')` | 126,70 | Etiqueta | Valor do previsto digita no contorno | 9 |
| 100 | `quando('O balanco mostra')` | 128,04 | Placa BALANÇO | Placa em pé BALANÇO ANUAL | 9 |
| 101 | `quando('231')` | 129,08 | Coluna BALANÇO | Coluna de 23 fatias na frente da placa | 9 |
| 102 | `quando('a planilha do portal')` | 130,28 | Placa PLANILHA | Placa PLANILHA DO PORTAL | 9 |
| 103 | `quando('249')` | 131,24 | Coluna PLANILHA | Coluna de 25 fatias | 9 |
| 104 | `quando('o relatorio 300')` | 132,70 | Placa e coluna RELATÓRIO | Placa RREO DEZ/2025 e coluna de 30 fatias | 9 |
| 105 | `quando('O SIOPE diz 26')` | 134,02 | Copo SIOPE 2025 | Copo acima da linha; 26,23% | 9 |
| 106 | `quando('O relatorio da prefeitura, 24')` | 135,86 | Placa RREO | Placa RREO DEZ/2025 acende; câmera vira para o segundo copo | 9 |
| 107 | `quando('24%, abaixo', 2)` | 137,26 | Copo RREO 2025 | Copo abaixo da linha; marsala; 24,18% | 9 |
| 108 | `quando('Obras saltaram')` | 139,70 | Material de obra | Tijolos, tábuas e cones crescem ao lado da escola | 9 |
| 109 | `quando('51 milhoes')` | 140,60 | Etiqueta | "OBRAS R$ 51 MI" (em 2024: R$ 2,5 MI) ★ | 9 |
| 110 | `quando('Parecer do Tribunal')` | 141,96 | TCM | "?" sobre o prédio do Tribunal, pulsando devagar | 9 |
| 111 | `quando('2026, ate agosto')` | 144,24 | Marco 2026 | Marco claro (ano em andamento); barra de meses enche até AGO (8 de 12) | 10 |
| 112 | `quando('Previstos 240')` | 145,92 | Coluna fantasma 2026 | Contorno até 24 fatias | 10 |
| 113 | `quando('213 empenhados')` | 148,12 | Coluna 2026 | 21 fatias meio transparentes (empenhado) | 10 |
| 114 | `quando('150 pagos')` | 149,74 | Coluna 2026 | 15 delas ficam sólidas (pago) | 10 |
| 115 | `quando('quase 19%')` | 152,00 | Copo 2026 | Copo enchendo, abaixo da linha, em neutro (ano não fechou) | 10 |
| 116 | `quando('mas o minimo so conta')` | 153,14 | Linha dos 25% | Linha dos 25% pulsa sobre o copo de 2026 | 10 |
| 117 | `quando('fim do ano')` | 154,70 | Barra de meses | Mês DEZ pulsa ★ | 10 |
| 118 | `quando('A conta')` | 155,36 | Rua do tempo | Câmera sobe devagar; a rua inteira à vista, de 2006 a 2026 | 11 |
| 119 | `quando('de 2008 a 2025')` | 156,04 | Colunas | Colunas de 2008 a 2025 acendem em onda | 11 |
| 120 | `quando('2 bilhoes e 90')` | 158,30 | Contador | Contador grande no topo: R$ 2,09 BI | 11 |
| 121 | `quando('Com a inflacao')` | 160,20 | Colunas | Fantasma dourado cresce em cima de cada coluna (IPCA) | 11 |
| 122 | `quando('3 bilhoes')` | 161,10 | Contador | Contador troca para R$ 3,19 BI · EM VALORES DE HOJE | 11 |
| 123 | `quando('a vaquinha devolveu')` | 162,98 | Cofre FUNDEB | Cofre FUNDEB sobe ao lado da prefeitura; canaleta liga os dois | 11 |
| 124 | `quando('mais que o dobro')` | 163,78 | Rótulo | "×2,2" no acento ★ | 11 |
| 125 | `quando('Ilheus pos 613')` | 164,84 | Canaleta | Fluxo fino de moedas indo; etiqueta POS R$ 613 MI | 11 |
| 126 | `quando('recebeu 1 bilhao')` | 167,02 | Canaleta | Fluxo grosso voltando; etiqueta RECEBEU R$ 1,36 BI | 11 |
| 127 | `quando('O dinheiro e seu')` | 169,30 | MAPA 3 | Corte para o satélite de Ilhéus com o contorno verde; câmera girando | 12 |
| 128 | `quando('Confira no portal')` | 170,40 | MAPA 3 | Etiqueta transparencia.ilheus.ba.gov.br | 12 |
| 129 | `quando('portal da transparencia')` | 170,96 | MAPA 3 | Etiqueta do site acende no acento | 12 |
| 130 | `quando('Esse dinheiro chegou')` | 171,88 | MAPA 3 | Pontinhos verdes acendem um a um sobre a área urbana ★ | 12 |
| 131 | `quando('escola do seu bairro')` | 173,08 | MAPA 3 | Pontinhos pulsam juntos | 12 |
| 132 | `quando('Me conta')` | 173,98 | Interface | Balão de comentário | 12 |
| 133 | `quando('E segue o')` | 174,94 | Interface | Assinatura do perfil e @euMagnoLeite grande; a marca d’água do topo continua | 12 |

★ = sugestão do diretor, além do roteiro.

## 2.4 Cenas com câmera

A distância é referência; no código, a câmera usa o enquadramento automático da base (alvo + o que precisa caber + direção). A câmera nunca fica parada.

### CENA 1: GANCHO (0,00 a 4,90 s)
Abre em: `quando('Em 18 anos')` · Eventos 1 a 7 · Pílula: **EDUCAÇÃO EM ILHÉUS**
- Câmera: Voo do Brasil até Ilhéus, descida contínua em escala logarítmica.
- Aha: Ilhéus gastou 2 bilhões, e os números não batem.

### CENA 2: FONTES E REGRA (4,90 a 11,76 s)
Abre em: `quando('Abri os documentos')` · Eventos 8 a 14 · Pílula: **A REGRA**
- Câmera:
  - **2a** (4,90 a 8,38 s), grua descendo sobre a maquete
    - início: pos [0,0, 20,9, 12,7] · alvo [0,0, 0,5, 0,0] · dist 24 · ângulo 58°
    - fim: pos [1,7, 14,2, 11,9] · alvo [0,0, 0,8, 0,0] · dist 18 · ângulo 48°
  - **2b** (8,38 a 11,76 s), avanço lento até a escola e o copo
    - início: pos [1,2, 7,7, 8,8] · alvo [0,0, 1,2, 0,0] · dist 11 · ângulo 36°
    - fim: pos [2,3, 5,2, 7,0] · alvo [0,0, 1,0, 0,0] · dist 8.5 · ângulo 30°
- Aha: Tudo vem de documento oficial; 25% dos impostos vão para a escola.

### CENA 3: A VAQUINHA (11,76 a 17,76 s)
Abre em: `quando('E tem o Fundeb')` · Eventos 15 a 21 · Pílula: **O FUNDEB**
- Câmera: Arco lento sobre o sul da Bahia.
- Aha: A cidade põe no fundo e o fundo devolve.

### CENA 4: 2006–2007 (17,76 a 29,38 s)
Abre em: `quando('2006.')` · Eventos 22 a 31 · Pílula: **2006–2007**
- Câmera:
  - **4a** (17,76 a 29,38 s), travelling baixo do lado de fora da rua, de 2006 para 2007
    - início: pos [-9,1, 4,3, -4,6] · alvo [-3,9, 0,8, -1,4] · dist 7 · ângulo 30°
    - fim: pos [-9,8, 3,9, -1,3] · alvo [-4,0, 0,8, -1,0] · dist 6.5 · ângulo 28°
- Aha: Antes de 2008, só se sabe o dinheiro do fundo.

### CENA 5: 2008–2009 (29,38 a 43,10 s)
Abre em: `quando('2008.')` · Eventos 32 a 41 · Pílula: **2008–2009**
- Câmera:
  - **5a** (29,38 a 43,10 s), travelling seguindo a rua
    - início: pos [-10,9, 4,3, -0,3] · alvo [-4,2, 0,9, 0,1] · dist 7.5 · ângulo 27°
    - fim: pos [-10,4, 4,4, 3,1] · alvo [-4,1, 1,0, 0,9] · dist 7.5 · ângulo 27°
- Aha: A série começa; um ano no limite e outro folgado.

### CENA 6: 2012–2017 (43,10 a 65,54 s)
Abre em: `quando('2012.')` · Eventos 42 a 57 · Pílula: **2012–2017**
- Câmera:
  - **6a** (43,10 a 49,50 s), travelling; colunas de 2010 e 2011 crescem no caminho
    - início: pos [-8,2, 4,8, 7,7] · alvo [-2,9, 1,0, 3,0] · dist 8 · ângulo 28°
    - fim: pos [-4,2, 4,6, 10,5] · alvo [-1,6, 1,0, 3,9] · dist 8 · ângulo 27°
  - **6b** (49,50 a 62,24 s), chega nos dois copos de 2016 (olhar ao longo do anel)
    - início: pos [-0,4, 4,1, 10,5] · alvo [0,0, 1,0, 4,2] · dist 7 · ângulo 26°
    - fim: pos [0,4, 3,3, 10,8] · alvo [0,0, 0,9, 5,3] · dist 6 · ângulo 24°
  - **6c** (62,24 a 65,54 s), grua leve até a linha dos 100 milhões
    - início: pos [2,4, 5,1, 12,2] · alvo [0,8, 1,4, 4,1] · dist 9 · ângulo 24°
    - fim: pos [3,4, 5,2, 12,5] · alvo [0,8, 1,6, 4,1] · dist 9.5 · ângulo 22°
- Aha: Gastou menos que o previsto, e as fontes discordam.

### CENA 7: 2018–2020 (65,54 a 90,02 s)
Abre em: `quando('2018.')` · Eventos 58 a 73 · Pílula: **2018–2020**
- Câmera:
  - **7a** (65,54 a 76,30 s), plano médio com o TCM ao fundo (de cima, regra do 008)
    - início: pos [8,1, 8,0, 7,5] · alvo [3,5, 1,2, 0,2] · dist 11 · ângulo 38°
    - fim: pos [4,8, 6,3, 10,4] · alvo [1,6, 1,0, 3,9] · dist 9 · ângulo 36°
  - **7b** (76,30 a 84,82 s), close nos dois copos de 2019 e no auditor
    - início: pos [5,2, 3,9, 9,1] · alvo [2,9, 0,9, 4,4] · dist 6 · ângulo 30°
    - fim: pos [5,9, 3,5, 8,2] · alvo [2,9, 0,9, 4,4] · dist 5.5 · ângulo 28°
  - **7c** (84,82 a 90,02 s), recua para mostrar os três carimbos
    - início: pos [7,5, 5,7, 7,8] · alvo [2,9, 1,2, 3,0] · dist 8 · ângulo 34°
    - fim: pos [6,5, 7,4, 10,1] · alvo [2,2, 1,2, 3,5] · dist 10 · ângulo 38°
- Aha: Três pareceres seguidos pela rejeição.

### CENA 8: 2021–2023 (90,02 a 111,90 s)
Abre em: `quando('2021.')` · Eventos 74 a 88 · Pílula: **2021–2023**
- Câmera:
  - **8a** (90,02 a 101,04 s), travelling
    - início: pos [8,9, 4,8, 6,9] · alvo [3,4, 1,0, 2,4] · dist 8 · ângulo 28°
    - fim: pos [9,1, 4,5, 5,9] · alvo [3,4, 1,0, 2,4] · dist 7.5 · ângulo 28°
  - **8b** (101,04 a 111,90 s), um plano só para os dois anos
    - início: pos [11,2, 5,8, 4,3] · alvo [4,0, 1,3, 1,3] · dist 9 · ângulo 30°
    - fim: pos [11,5, 5,9, 3,3] · alvo [4,0, 1,4, 1,3] · dist 9 · ângulo 30°
- Aha: A pandemia livrou 2021; depois o mínimo foi cumprido.

### CENA 9: 2024–2025 (111,90 a 144,24 s)
Abre em: `quando('2024.')` · Eventos 89 a 110 · Pílula: **2024–2025**
- Câmera:
  - **9a** (111,90 a 116,26 s), grua subindo junto com a coluna recorde
    - início: pos [12,8, 4,4, 0,4] · alvo [4,2, 1,6, 0,1] · dist 9 · ângulo 18°
    - fim: pos [12,5, 7,6, -0,3] · alvo [4,2, 2,0, 0,1] · dist 10 · ângulo 34°
  - **9b** (116,26 a 123,90 s), arco curto nas duas barras
    - início: pos [12,3, 4,3, -0,4] · alvo [6,0, 1,2, 0,2] · dist 7 · ângulo 26°
    - fim: pos [11,7, 3,8, -1,0] · alvo [6,0, 1,0, 0,2] · dist 6.5 · ângulo 26°
  - **9c** (123,90 a 144,24 s), desce no meio das placas; arco curto
    - início: pos [14,0, 6,6, -1,3] · alvo [5,5, 1,3, -0,9] · dist 10 · ângulo 32°
    - fim: pos [13,0, 5,6, -3,2] · alvo [5,5, 1,1, -0,9] · dist 9 · ângulo 30°
- Aha: Recorde em 2024, mas regras do Fundeb abaixo; três números para 2025.

### CENA 10: 2026 (144,24 a 155,36 s)
Abre em: `quando('2026, ate agosto')` · Eventos 111 a 117 · Pílula: **2026**
- Câmera:
  - **10a** (144,24 a 155,36 s), avanço lento até o marco claro
    - início: pos [10,7, 4,8, -3,4] · alvo [3,9, 1,0, -1,4] · dist 8 · ângulo 28°
    - fim: pos [9,3, 3,8, -3,8] · alvo [3,9, 1,0, -1,4] · dist 6.5 · ângulo 26°
- Aha: O ano ainda está em andamento.

### CENA 11: A CONTA (155,36 a 169,30 s)
Abre em: `quando('A conta')` · Eventos 118 a 126 · Pílula: **A CONTA**
- Câmera:
  - **11a** (155,36 a 162,98 s), grua subindo até ver a rua inteira
    - início: pos [0,0, 14,8, 11,6] · alvo [0,0, 1,0, 0,0] · dist 18 · ângulo 50°
    - fim: pos [3,9, 22,4, 10,6] · alvo [0,0, 1,2, 0,0] · dist 24 · ângulo 62°
  - **11b** (162,98 a 169,30 s), desliza até a prefeitura e o cofre do Fundeb
    - início: pos [-11,0, 8,7, 6,8] · alvo [-5,8, 1,0, -0,8] · dist 12 · ângulo 40°
    - fim: pos [-11,9, 6,9, 4,5] · alvo [-5,8, 1,0, -0,8] · dist 10 · ângulo 36°
- Aha: 2 bilhões gastos; o fundo devolveu mais que o dobro.

### CENA 12: É SEU (169,30 a 178,15 s)
Abre em: `quando('O dinheiro e seu')` · Eventos 127 a 133 · Pílula: **É SEU**
- Câmera: Giro lento sobre Ilhéus.
- Aha: Você pode conferir.

## 2.5 Fatos e fontes

Todas as fontes estão em `audio/fontes.md` (documento, página ou linha, valor exato), na ordem da fala. A fala arredonda os decimais e o selo de cada bloco mostra o valor exato (tabela no fim do `fontes.md`).

**Conferir antes de publicar:** se sair o RREO do 5º bimestre de 2026 (setembro e outubro), atualizar o bloco de 2026; se sair parecer do TCM sobre 2024 ou 2025, atualizar os blocos.

## 2.6 Trilha e sons

| Som | Onde |
|---|---|
| `whoosh` | toda troca de cena (12) e entrada e saída dos mapas |
| `tique` | pílula muda (cada bloco de ano) |
| `pop` | cada número ou etiqueta que entra |
| `subida` | colunas crescendo; contador R$ 2,09 BI → R$ 3,19 BI |
| `impacto` | carimbos (Câmara e TCM) |
| `baque` | copo que para abaixo da linha dos 25% (leve, sem tom de ameaça) |
| `ding` | "mais que o dobro" e coluna recorde de 2024 |
| `bip` | barra de meses de 2026 |

Trilha de fundo: nenhuma, salvo se a pessoa mandar uma sem direitos autorais em `sfx/trilha.wav`.

## 2.7 Arquivos

- **Novos:** `src/videos/educacaoilheus/EducacaoIlheus.tsx` (mundo, câmeras, interface, `FAIXAS` de som, `REVISAO`, capa); `src/videos/educacaoilheus/pecas.tsx` com: `RuaDoTempo` (anel com 21 `MarcoAno`), `ColunaAno` (coluna de moedas com fatias e contorno do previsto), `CopoFonte` (copo de piso com etiqueta da fonte), `CarimboParecer` (carimbo do 028 com texto livre), `PlacaFonte3D` (placa em pé), `BarraMeses` (2026); `palavras.ts` (pronto).
- **Kit Mapas:** `src/videos/educacao-ilheus/` (molde do `orcamento-ilheus`, que já tem o contorno de Ilhéus) com três composições curtas: `EducacaoIlheusMapa1`, `Mapa2`, `Mapa3`, sem legenda, sem marca e sem som; MP4 copiados para `projetos/029. educação em ilhéus/`.
- **Alterados:** `src/Root.tsx` (composições `EducacaoIlheus`, `EducacaoIlheusGuia`, `EducacaoIlheusLimpo`, `CapaEducacaoIlheus`).
- **Reaproveitados:** do 014 (`src/videos/orcamentoilheus/pecas.tsx`): `MesaMaquete`, `PonteMini`, `Escola`, `Prefeitura`, `PredioTCM`, `RelatorioPDF`, `CopoPiso`; do catálogo: `MarcoAno`, `PilhaMoedas`, `CofreFGTS`, `TrilhoMoedas`, `ContadorVagas`, `Pessoa`, `LivroPopUp`, `CasaMini`, `Casinha`; da base: `Marca`, `Palco`, legenda e área segura.
- **Total:** 5372 quadros a 30 fps. Vídeo acima de 2,5 min: render com `--quadros-por-parte=400` e a prévia do Studio fechada (regra do 018).

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

**Escolhas do diretor:** colunas de moedas no lugar de grades de pilhas (as grades de anos vizinhos se encostariam com marcos a 0,8 m); contorno do previsto da lei atrás da coluna real; dois copos lado a lado quando as fontes discordam; carimbos com cores por tipo de parecer; barra de meses em 2026; os extras marcados com ★.
