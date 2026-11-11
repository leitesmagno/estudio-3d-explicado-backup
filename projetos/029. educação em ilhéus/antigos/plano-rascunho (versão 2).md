# Plano de cenas (RASCUNHO, versão 2, cronológica): 029. educação em ilhéus

Código `educacaoilheus` · Nome `EducacaoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

> **Rascunho antes da voz.** Pela ordem do Estúdio, o plano oficial (`plano.md`) só fecha depois da narração e da sincronia, porque **o tempo vem da fala**. Aqui ficam definidos o mundo, as peças, os trechos de mapa, as cenas, as câmeras e as palavras-chave. Na etapa 4, cada palavra ganha o tempo do `palavras.ts`. A versão 1 está em `antigos/`.

**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro. O Kit Mapas Animados gera **três trechos de satélite de Ilhéus**, sem legenda, sem marca e sem som, que entram por `OffthreadVideo` dentro de uma `Sequence`, com entrada e saída de 0,2 s. Legenda, pílula e marca do 3D ficam por cima. Selos do 3D sobre o mapa vão no topo (y 470).

## 2.1 Narração (preencher na etapa 4)
- Arquivo `audio/narracao-norm.wav`, 1,2x, pausas de no máximo 0,35 s, volume -15.
- 431 palavras, cerca de 168 s (ritmo do 014: 0,39 s por palavra). Limite da pessoa: 2:50.
- Mais de 350 palavras: a voz vai em **3 partes** (gancho até "Agora, ano a ano." · "2006 e 2007" até "2021" · "2022 e 2023" até o fim). No texto da voz, os dois-pontos das listas viram ponto e cada ano que abre bloco ganha reticências depois ("Dois mil e doze...").
- Cada ano abre um bloco: `quando('2006 e 2007. Segundo')`, `quando('2008. Comecam')`, `quando('2012. Primeiro')`, `quando('2016. De novo')`, `quando('2018. O Tribunal')`, `quando('2019. O relatorio')`, `quando('2020. Terceira')`, `quando('2021. O SIOPE')`, `quando('2022 e 2023')`, `quando('2024. Recorde')`, `quando('2025. Tres')`. Números com vírgula sempre com a palavra de antes (`quando('SIOPE: 22,8')`, `quando('diz 27,5')`, `quando('defesa: 25,6')`, `quando('dizia 26,8')`, `quando('mostra 22,3')`, `quando('26,9% e 29,3')`, `quando('mostra 26,2')`, `quando('prefeitura, 24,2')`).

## 2.2 Ideia e mundo

**A metáfora: a mesma maquete de Ilhéus do vídeo 014, com a ESCOLA no centro e uma RUA DO TEMPO em volta.** A rua é um anel no chão da mesa com um marco para cada ano, de 2006 a 2025, e um marco claro para 2026. **O vídeo anda pela rua, ano a ano, na mesma ordem da fala.** Cada ano que é falado acende o seu marco e ganha o que aconteceu nele: a pilha de moedas do gasto, o copo dos 25% ou o carimbo do Tribunal. O que já foi dito fica no lugar, em tom neutro. Assim, no fim, a câmera sobe e a pessoa vê a história inteira de uma vez, sem voltar no tempo.

**As três marcas da rua do tempo (uma linguagem só, o vídeo inteiro):**

| O que | Como aparece | Cor |
|---|---|---|
| Gasto do ano | pilhas de moedas na frente do marco (1 pilha = R$ 10 milhões) | dourado |
| Percentual da educação | copo de piso ao lado do marco, com a linha dos 25% | acima da linha: neutro · abaixo: marsala |
| Parecer do Tribunal | carimbo em cima do marco ("REJEIÇÃO" ou "APROVAÇÃO C/ RESSALVAS") | rejeição: marsala · aprovação: `tema.objetoClaro` |
| Fonte do número | etiqueta pequena na base do copo: SIOPE, PREFEITURA ou TCM | `tema.texto` a 70% |

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Na narração | O que mostra |
|---|---|---|
| **MAPA 1: "ILHÉUS"** | do início até `Eu abri os documentos` | Voo do Brasil até Ilhéus no satélite. O contorno do município (IBGE 2913606) acende em verde. Em "2 bilhões" digita **R$ 2 BILHÕES** e, embaixo, **EDUCAÇÃO · 2008 A 2025**. Em "não batem" entram três etiquetas pequenas que não combinam: **26,2%** · **24,2%** · **24%** ★ |
| **MAPA 2: "A VAQUINHA"** | de `Segunda: o Fundeb` até `Agora, ano a ano` | Ilhéus no sul da Bahia. Em "20% de alguns repasses" saem de Ilhéus setas finas com moedinha até um círculo **FUNDO**. Em "FPM e o ICMS" duas etiquetas correm nas setas. Em "devolve dinheiro" uma seta volta para Ilhéus. (Os valores do Fundeb ficam para a conta final.) |
| **MAPA 3: "É SEU"** | de `O dinheiro e seu` até o fim | Satélite de Ilhéus com o contorno verde, câmera girando devagar. Em "portal da transparência" entra a etiqueta **transparencia.ilheus.ba.gov.br**. Em "escola do seu bairro" pontinhos verdes acendem sobre a área urbana ★ |

**Selos de fonte, um por bloco, entrando junto com o ano** (pedido do 016: maiores e com documento e página):

| Bloco | Entra em | Texto do selo |
|---|---|---|
| Documentos | `Eu abri os documentos` | PORTAL DA TRANSPARÊNCIA · SIOPE/FNDE · TCM-BA |
| Regra dos 25% | `pelo menos 25%` | CONSTITUIÇÃO, ART. 212 |
| Fundeb | `Segunda: o Fundeb` | RREO DEZ/2023 · ANEXO 8, LINHA 4 |
| 2006 e 2007 | `2006 e 2007. Segundo` | TESOURO NACIONAL · TRANSFERÊNCIAS CONSTITUCIONAIS |
| 2008 | `2008. Comecam` | SIOPE/FNDE 2008 |
| 2012 | `2012. Primeiro` | SIOPE/FNDE · INDICADOR 1.1 |
| 2016 | `2016. De novo` | SIOPE 2016 · RREO DEZ/2016, ANEXO 14 |
| 2018 | `2018. O Tribunal` | PARECER TCM-BA 04894e19 |
| 2019 | `2019. O relatorio` | RREO DEZ/2019 · PARECER TCM-BA 06442e20 |
| 2020 | `2020. Terceira` | PARECER TCM-BA 09984e21 |
| 2021 | `2021. O SIOPE` | SIOPE 2021 · EC 119/2022 · PARECER TCM-BA 11985e22 |
| 2022 e 2023 | `2022 e 2023` | PARECERES TCM-BA 07770e23 E 07666e24 |
| 2024 | `2024. Recorde` | SIOPE 2024 · BALANÇO ANUAL 2024 |
| 2025 | `2025. Tres` | SIOPE · RREO DEZ/2025, ANEXO 8 · BALANÇO 2025 · PORTAL |
| Conta final | `A conta final` | SIOPE 2008–2025 · IPCA/BANCO CENTRAL · CONTA DO VÍDEO |

**Placar fixo** (de "Agora, ano a ano" até a conta final), no canto de cima: **"1 PILHA = R$ 10 MILHÕES"**.

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` misturado com `tema.areia` 25% (igual ao 014) |
| chão da maquete | `tema.areia` (tom médio) e `tema.vegetacao` |
| mar no canto | `tema.agua` fosco |
| escola, prefeitura, TCM, marcos | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| moedas e pilhas | dourado da paleta de apoio (nunca o acento) |
| linha dos 25%, ano que está sendo falado, contorno de Ilhéus | `tema.acento` (verde) |
| abaixo do mínimo, carimbo de rejeição | marsala da paleta de apoio (`tema.alerta`), fosco |
| anos sem dado de gasto (2006 e 2007) | marco a 40%, com "?" ★ |

**Mapa do mundo** (mesa redonda de raio 9 m do 014; chão da mesa em y = 0; frente da câmera é z+):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa da maquete | [0, 0, 0] | `MesaMaquete` (014) |
| Mar, ponte e casinhas de fundo | anel de raio 7 a 8,5, atrás (z < -3) | `PonteMini`, `CasaMini`, `Casinha` |
| Escola grande | [0, 0, -0,5] | `Escola` (014) em escala 1,6, letreiro "EDUCAÇÃO"; alunos entram pela porta ★ |
| Rua do tempo | anel de raio 4,2 em volta da escola, começando à esquerda (2006) e girando pela frente até a direita (2026) | `MarcoAno` (catálogo), 21 marcos; o ano falado acende em verde e volta ao neutro no bloco seguinte |
| Pilhas de cada ano | 0,8 m para dentro de cada marco | `PilhasDinheiro` (014). Anos citados nascem na fala; os anos do meio crescem juntos em onda ★ |
| Copos dos 25% | do lado de fora do marco dos anos citados (2012, 2016, 2018, 2019, 2021, 2022, 2023, 2025) | `CopoPiso` (014); em 2016, 2019 e 2025 sobem **dois copos lado a lado** (um por fonte) |
| Carimbos do Tribunal | em cima dos marcos de 2018 a 2023 | carimbo 3D do 028 com o texto do parecer |
| Prefeitura | [-5,5, 0, -3] | `Prefeitura` (014) |
| Cofre FUNDEB (a vaquinha) | [-6, 0, 1,5] | `CofreFGTS` (catálogo) com letreiro "FUNDEB", aparece só na conta final ★ |
| Canaleta Prefeitura ↔ FUNDEB | entre a prefeitura e o cofre | `TrilhoMoedas` (catálogo): fluxo fino indo, fluxo grosso voltando |
| Tribunal de Contas | [5,5, 0, -3,5] | `PredioTCM` (014), sobe em "2018" e fica até o fim |
| Auditor do TCM | perto do marco 2019 | boneco genérico (`Pessoa`) com lupa e etiqueta "TCM-BA" ★ |
| Documentos | flutuam na frente da câmera na cena 2 | `RelatorioPDF` (014): RREO, LOA, BALANÇO, PARECER TCM |
| Placas das três fontes de 2025 | em volta do marco 2025 | peça nova `PlacaFonte3D`: SIOPE · RELATÓRIO · BALANÇO · PLANILHA |

**Regras visuais:** o acento só no ano que está sendo falado, na linha dos 25% e no contorno de Ilhéus. Tudo que acende volta ao neutro no bloco seguinte. Nada aparece antes do seu ano. Nenhum nome de pessoa, nenhum logo: "PREFEITURA", "FUNDEB", "TCM-BA" só como letreiro na fonte do perfil. Neutralidade: o vídeo mostra cada número e quem disse, sem dizer que alguém errou.

## 2.3 Mapa de palavras-chave (tempos na etapa 4)

| # | Palavra (`quando`) | Objeto | O que acontece | Cena |
|---|---|---|---|---|
| 1 | início | MAPA 1 | Voo do Brasil até Ilhéus | 1 |
| 2 | `Em 18 anos` | MAPA 1 | Contorno de Ilhéus acende | 1 |
| 3 | `2 bilhoes com` | MAPA 1 | Digita R$ 2 BILHÕES · EDUCAÇÃO 2008 A 2025 | 1 |
| 4 | `nao batem` | MAPA 1 | Três etiquetas de percentual entram tortas ★ | 1 |
| 5 | `Eu abri os documentos` | RelatorioPDF | Quatro documentos voam sobre a maquete | 2 |
| 6 | `do governo federal` | RelatorioPDF | Acende SIOPE | 2 |
| 7 | `do Tribunal de Contas` | RelatorioPDF | Acende PARECER TCM | 2 |
| 8 | `A fonte de cada` | Selo | Primeiro selo de fonte | 2 |
| 9 | `Antes, duas regras` | Escola | Câmera desce até a escola; placa "REGRA 1" ★ | 3 |
| 10 | `pelo menos 25%` | Copo | Copo grande sobe ao lado da escola, linha dos 25% acende | 3 |
| 11 | `De cada 4 reais` | Moedas | 4 moedas caem na frente da escola | 3 |
| 12 | `1 e da escola` | Moedas | 1 delas rola para dentro da porta e acende | 3 |
| 13 | `Segunda: o Fundeb` | MAPA 2 | Entra o mapa | 4 |
| 14 | `Pensa numa vaquinha` | MAPA 2 | Círculo FUNDO aparece | 4 |
| 15 | `coloca 20%` | MAPA 2 | Setas saem de Ilhéus com moedinhas | 4 |
| 16 | `o FPM e o ICMS` | MAPA 2 | Etiquetas FPM e ICMS correm nas setas | 4 |
| 17 | `devolve dinheiro` | MAPA 2 | Seta de volta para Ilhéus | 4 |
| 18 | `Agora, ano a ano` | Rua do tempo | Volta ao 3D; câmera alta mostra o anel de marcos; placar "1 PILHA = R$ 10 MI" | 5 |
| 19 | `2006 e 2007. Segundo` | Marcos 2006 e 2007 | Câmera chega no começo da rua; os dois marcos acendem | 5 |
| 20 | `33 milhoes do Fundef` | Moedas | Pilhinha FUNDEB entre os dois marcos, R$ 33 MI | 5 |
| 21 | `nao achei em dado aberto` | Marcos | "?" sobe nos dois marcos, sem pilha | 5 |
| 22 | `2008. Comecam` | Marco 2008 | Marco acende; placa SIOPE ao lado ★ | 6 |
| 23 | `custou 43` | Pilhas 2008 | 4 pilhas e um pedaço; rótulo R$ 43 MI | 6 |
| 24 | `2012. Primeiro` | Marco 2012 | Câmera anda pela rua; pilhas de 2009 a 2011 crescem no caminho | 6 |
| 25 | `SIOPE: 22,8` | Copo 2012 | Copo sobe e para abaixo da linha; marsala; etiqueta SIOPE | 6 |
| 26 | `2016. De novo` | Marco 2016 | Pilhas de 2013 a 2015 crescem no caminho | 6 |
| 27 | `SIOPE: 22,1` | Copo SIOPE 2016 | Abaixo da linha, marsala | 6 |
| 28 | `diz 27,5` | Copo PREFEITURA 2016 | Segundo copo ao lado, acima da linha | 6 |
| 29 | `Guarda isso` | Copos 2016 | Os dois copos balançam de leve; selo "2 FONTES, 2 NÚMEROS" ★ | 6 |
| 30 | `2018. O Tribunal` | TCM | Prédio do Tribunal sobe ao fundo; câmera chega em 2018 | 7 |
| 31 | `recomendou rejeitar as contas da` | Carimbo 2018 | Carimbo "REJEIÇÃO" desce no marco | 7 |
| 32 | `depois da defesa` | Copo 2018 | Copo sobe devagar de 22,9% até 25,6% e passa da linha ★ | 7 |
| 33 | `2019. O relatorio` | Copo PREFEITURA 2019 | Copo acima da linha (26,8%) | 7 |
| 34 | `conferiu as despesas` | Auditor | Boneco do TCM chega com lupa | 7 |
| 35 | `chegou a 24` | Copo TCM 2019 | Segundo copo, abaixo da linha, marsala | 7 |
| 36 | `rejeitar as contas de novo` | Carimbo 2019 | Carimbo "REJEIÇÃO" | 7 |
| 37 | `2020. Terceira` | Carimbo 2020 | Terceiro carimbo; placar "3 SEGUIDAS" ★ | 7 |
| 38 | `2021. O SIOPE` | Marco 2021 | Câmera anda; marco acende | 8 |
| 39 | `mostra 22,3` | Copo 2021 | Abaixo da linha, marsala | 8 |
| 40 | `uma emenda` | Livro | Livro da Constituição pequeno abre "EC 119/2022" | 8 |
| 41 | `por causa da pandemia` | Copo 2021 | Selo "PANDEMIA"; copo volta ao neutro | 8 |
| 42 | `aprovar as contas, com ressalvas` | Carimbo 2021 | Carimbo claro "APROVAÇÃO C/ RESSALVAS" | 8 |
| 43 | `2022 e 2023` | Marcos | Os dois marcos acendem juntos (dois nomes em menos de 1 s: um plano só) | 8 |
| 44 | `26,9% e 29,3` | Copos | Dois copos acima da linha | 8 |
| 45 | `42,9 milhoes de precatorios` | Moedas | Pilha extra de 4 pilhas com etiqueta "PRECATÓRIOS FUNDEF" no marco 2023 | 8 |
| 46 | `2024. Recorde` | Pilhas 2024 | 27 pilhas, a mais alta; brilho leve | 9 |
| 47 | `269` | Rótulo | R$ 269 MI no acento | 9 |
| 48 | `2025. Tres` | Marco 2025 | Câmera chega; quatro placas sobem em volta | 9 |
| 49 | `mostra 26,2` | Copo SIOPE 2025 | Acima da linha | 9 |
| 50 | `prefeitura, 24,2` | Copo RELATÓRIO 2025 | Abaixo da linha, marsala | 9 |
| 51 | `231 milhoes no balanco` | Pilhas | 23 pilhas na placa BALANÇO | 9 |
| 52 | `249 na planilha` | Pilhas | 25 pilhas na placa PLANILHA | 9 |
| 53 | `300 no relatorio` | Pilhas | 30 pilhas na placa RELATÓRIO | 9 |
| 54 | `ainda nao ha nos documentos` | TCM | "?" sobre o prédio do Tribunal ★ | 9 |
| 55 | `A conta final` | Rua do tempo | Câmera sobe; a rua inteira à vista, de 2006 a 2025 | 10 |
| 56 | `2 bilhoes e 90` | Contador | Todas as pilhas acendem; contador R$ 2,09 BI | 10 |
| 57 | `Corrigido pela inflacao` | Pilhas | Fantasma dourado cresce em cima das pilhas | 10 |
| 58 | `3 bilhoes e 190` | Contador | Contador troca para R$ 3,19 BI | 10 |
| 59 | `E a vaquinha` | Cofre FUNDEB | Cofre sobe ao lado da prefeitura; canaleta liga os dois | 10 |
| 60 | `colocou 613` | Canaleta | Fluxo fino de moedas indo; R$ 613 MI | 10 |
| 61 | `recebeu de volta` | Canaleta | Fluxo grosso voltando; R$ 1,36 BI | 10 |
| 62 | `Mais que o dobro` | Rótulos | "×2,2" no acento ★ | 10 |
| 63 | `O dinheiro e seu` | MAPA 3 | Entra o satélite | 11 |
| 64 | `portal da transparencia` | MAPA 3 | Etiqueta do site | 11 |
| 65 | `escola do seu bairro` | MAPA 3 | Pontinhos verdes na cidade ★ | 11 |
| 66 | `Me conta nos comentarios` | Interface | Balão de comentário | 11 |
| 67 | `E segue o` | Assinatura | Assinatura do perfil | 11 |

★ = sugestão do diretor, além do roteiro. Na etapa 4 a densidade sobe para cerca de 1 evento por segundo.

## 2.4 Cenas com câmera (distâncias são referência; o enquadramento é automático)

| Cena | Trecho da fala | Pílula | Câmera | Aha |
|---|---|---|---|---|
| 1 | gancho | EDUCAÇÃO EM ILHÉUS | MAPA 1 (Kit Mapas) | Muito dinheiro, e as contas não batem |
| 2 | "Eu abri os documentos" | AS FONTES | Grua descendo da vista alta da maquete até os documentos (40°) | Tudo vem de papel oficial |
| 3 | "Antes, duas regras" | A REGRA | Avanço lento até a escola, de frente e alto (37°) | 1 de cada 4 reais de imposto é da escola |
| 4 | "Segunda: o Fundeb" | A VAQUINHA | MAPA 2 (Kit Mapas) | A cidade põe no fundo e o fundo devolve |
| 5 | "Agora, ano a ano" e 2006/2007 | 2006–2007 | Vista alta do anel, depois desce até o começo da rua | O começo não tem dado de gasto |
| 6 | 2008 a 2016 | 2008–2016 | Câmera anda pela rua como num travelling, baixa e de lado (olhando ao longo do anel), parando em 2008, 2012 e 2016 | O gasto cresce e o mínimo falha duas vezes |
| 7 | 2018 a 2020 | 2018–2020 | Plano médio com o Tribunal ao fundo (filmar de cima, 38°); close no par de copos de 2019 | Três recomendações seguidas de rejeição |
| 8 | 2021 a 2023 | 2021–2023 | Continua o travelling; plano que mostra 2022 e 2023 juntos | A pandemia livrou 2021; depois o mínimo foi cumprido |
| 9 | 2024 e 2025 | 2024–2025 | Grua sobe na pilha recorde de 2024 e desce no meio das quatro placas de 2025, arco curto | Três números oficiais para o mesmo ano |
| 10 | "A conta final" | A CONTA | Câmera sobe até ver a rua inteira; depois desliza até a prefeitura e o cofre do Fundeb | 2 bilhões gastos; o Fundeb devolveu mais que o dobro |
| 11 | "O dinheiro é seu" | É SEU | MAPA 3 (Kit Mapas) | Você pode conferir |

## 2.5 Arquivos

- **Reaproveitados do 014** (`src/videos/orcamentoilheus/pecas.tsx`): `MesaMaquete`, `PonteMini`, `Escola`, `Prefeitura`, `PredioTCM`, `PilhasDinheiro`, `RelatorioPDF`, `CopoPiso`.
- **Do catálogo:** `MarcoAno`, `CofreFGTS`, `TrilhoMoedas`, `Pessoa`, `LivroPopUp`, `CasaMini`, `Casinha`.
- **Do 028:** o carimbo 3D (texto trocado para o parecer de cada ano).
- **Novos:** `src/videos/educacaoilheus/` (`EducacaoIlheus.tsx`, `pecas.tsx`, `palavras.ts`); peça nova pequena `PlacaFonte3D` ★.
- **Kit Mapas:** `src/videos/educacao-ilheus/` (molde do `orcamento-ilheus`, que já tem o contorno de Ilhéus), com as três composições curtas, tempos tirados do `palavras.ts` do 3D.

## Ainda falta (etapa 4)
- Tempos de cada palavra (depois da sincronia).
- Câmera de cada cena com posição, alvo, distância e ângulo no início e no fim.
- Lista final de palavras repetidas.
