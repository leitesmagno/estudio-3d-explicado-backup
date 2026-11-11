# Plano de cenas (RASCUNHO, versão 4, cronológica em 3 minutos): 029. educação em ilhéus

Código `educacaoilheus` · Nome `EducacaoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

> **Rascunho antes da voz.** Pela ordem do Estúdio, o plano oficial (`plano.md`) só fecha depois da narração e da sincronia, porque **o tempo vem da fala**. Aqui ficam definidos o mundo, as peças, os trechos de mapa, as cenas, as câmeras e as palavras-chave. Na etapa 4, cada palavra ganha o tempo do `palavras.ts`. A versão 1 está em `antigos/`.

**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro. O Kit Mapas Animados gera **três trechos de satélite de Ilhéus**, sem legenda, sem marca e sem som, que entram por `OffthreadVideo` dentro de uma `Sequence`, com entrada e saída de 0,2 s. Legenda, pílula e marca do 3D ficam por cima. Selos do 3D sobre o mapa vão no topo (y 470).

## 2.1 Narração (preencher na etapa 4)
- Arquivo `audio/narracao-norm.wav`, 1,2x, pausas de no máximo 0,35 s, volume -15.
- Narração pronta: `narracao-norm.wav` com **178,15 s (2 min 58 s)** (voz Adam, ElevenLabs v4, acelerada 1,253x a pedido da pessoa, pausas de no máximo 0,35 s, volume -15); 438 palavras no `palavras.ts`, a última termina em 177,74 s. Transcrição limpa (sem palavras inventadas). Versão de 1,2x guardada em `antigos/`.
- Versão 4 do roteiro: 452 palavras, cerca de **3 min 00 s** na estimativa (medido por sílabas da fala por extenso, calibrado no 014: 1.125 sílabas = 180 s). A fala arredonda os decimais; o selo de cada bloco mostra o valor exato (tabela no fim do `fontes.md`).
- Mais de 350 palavras: a voz vai em **4 partes** (introdução · 2006 a 2017 · 2018 a 2023 · 2024 ao fim). No texto da voz, os dois-pontos das listas viram ponto e cada ano que abre bloco ganha reticências depois ("Dois mil e doze...").
- Cada ano abre um bloco: `quando('2006. So achei')`, `quando('2007. Nasce')`, `quando('2008. Comeca')`, `quando('2009. 54')`, `quando('2012. O gasto')`, `quando('2016. A lei')`, `quando('2017. A educacao')`, `quando('2018. A area')`, `quando('2019. O relatorio')`, `quando('2020. Terceira')`, `quando('2021. O Fundeb')`, `quando('2022 e 2023')`, `quando('2024. Recorde')`, `quando('2025. A lei')`, `quando('2026, ate agosto')`. Números com vírgula sempre com a palavra de antes (`quando('SIOPE: 22,8')`, `quando('diz 27,5')`, `quando('defesa: 25,6')`, `quando('dizia 26,8')`, `quando('mostra 22,3')`, `quando('26,9% e 29,3')`, `quando('mostra 26,2')`, `quando('prefeitura, 24,2')`).

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

**Marca d'água (pedido da pessoa, 05/11/2026):** o @euMagnoLeite fica na tela **do primeiro ao último quadro**, inclusive em cima dos três trechos de mapa. Ela vai na marca do topo da base (`Marca`, em `CABECALHO.marca`), com o texto **"MAGNO EXPLICA · @euMagnoLeite"**, desenhada pela camada do 3D, que fica por cima do vídeo do Kit Mapas. Assim só existe uma marca, sempre no mesmo lugar e dentro da área segura. Os trechos do Kit Mapas continuam saindo **sem** a marca do `marca.json`, para não aparecerem duas marcas. Opacidade parecida com a do Kit Mapas (cerca de 0,4 a 0,6), na cor `tema.texto`.

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
| 5 | `Abri os documentos` | RelatorioPDF | Documentos voam sobre a maquete (RREO, LOA, BALANÇO, TCM) | 2 |
| 6 | `A fonte aparece` | Selo | Primeiro selo de fonte | 2 |
| 7 | `A regra: 25%` | Escola + copo | Câmera chega na escola; copo sobe com a linha dos 25% | 2 |
| 8 | `uma vaquinha` | Cofre FUNDEB | Cofre FUNDEB sobe ao lado da prefeitura | 2 |
| 9 | `poe 20%` | Canaleta | Moedas saem da prefeitura para o cofre; etiquetas FPM e ICMS | 2 |
| 10 | `devolve para a educacao` | Canaleta | Moedas voltam do cofre para a escola | 2 |
| 11 | `2006. So achei` | Marco 2006 | Câmera chega ao começo da rua; marco acende | 3 |
| 12 | `14 milhoes do Fundef` | Moedas | Pilhinha FUNDEF (R$ 14 MI) | 3 |
| 13 | `2007. Nasce` | Marco 2007 | Marco acende; letreiro FUNDEB troca o FUNDEF ★ | 3 |
| 14 | `19 milhoes` | Moedas | Pilhinha FUNDEB (R$ 19 MI) | 3 |
| 15 | `Camara de Vereadores reprovou` | Carimbo | Carimbo "CÂMARA: REPROVADA" no marco 2007 | 3 |
| 16 | `nao achei em dado aberto` | Marcos | "?" nos dois marcos, sem pilha de gasto | 3 |
| 17 | `2008. Comeca` | Marco 2008 | Placa SIOPE ao lado da rua ★ | 4 |
| 18 | `43 milhoes e 25,2` | Pilhas + copo | 4 pilhas e um pedaço; copo na linha | 4 |
| 19 | `No limite` | Copo 2008 | Copo balança encostado na linha ★ | 4 |
| 20 | `A Camara aprovou` | Carimbo | Carimbo claro "CÂMARA: APROVADA" | 4 |
| 21 | `2009. 54` | Pilhas + copo 2009 | 5 pilhas; copo bem acima da linha | 4 |
| 22 | `maior percentual` | Copo 2009 | Copo acende no acento | 4 |
| 23 | `Contas aprovadas pela Camara` | Carimbo | Carimbo claro | 4 |
| 24 | `2012. O gasto caiu` | Pilhas 2010 a 2012 | 2010 e 2011 crescem no caminho; 2012 menor que 2011 | 5 |
| 25 | `83 previstos` | Pilha fantasma | Contorno de 8 pilhas (o previsto) atrás das 7 reais ★ | 5 |
| 26 | `SIOPE: 22,8` | Copo 2012 | Abaixo da linha, marsala | 5 |
| 27 | `2016. A lei previu 119` | Pilha fantasma | Contorno de 12 pilhas | 5 |
| 28 | `Foram gastos 96` | Pilhas 2016 | 10 pilhas reais | 5 |
| 29 | `SIOPE, 22,1` | Copo SIOPE 2016 | Abaixo da linha, marsala | 5 |
| 30 | `diz 27,5` | Copo PREFEITURA 2016 | Segundo copo, acima da linha | 5 |
| 31 | `Guarda isso` | Copos 2016 | Os dois copos balançam; selo "2 FONTES, 2 NÚMEROS" ★ | 5 |
| 32 | `2017. A educacao passa` | Pilhas 2017 | 11 pilhas; linha "100 MILHÕES" na altura de 10 pilhas ★ | 5 |
| 33 | `2018. A area tecnica` | TCM + copo 2018 | Prédio do TCM sobe; copo em 22,9%, abaixo | 6 |
| 34 | `aceitou 25,6` | Copo 2018 | Copo sobe devagar e passa da linha | 6 |
| 35 | `recomendou rejeitar as contas,` | Carimbo | "TCM: REJEIÇÃO" | 6 |
| 36 | `conselho do Fundeb` | Etiqueta | Etiqueta "SEM PARECER DO CONSELHO" | 6 |
| 37 | `nao voltou para o fundo` | Canaleta | Moedas que deviam ir ao cofre FUNDEB param no meio ★ | 6 |
| 38 | `2019. O relatorio` | Copo PREFEITURA 2019 | 26,8%, acima da linha | 6 |
| 39 | `chegou a 24` | Copo TCM 2019 + auditor | Boneco com lupa; segundo copo abaixo, marsala | 6 |
| 40 | `Recomendou rejeitar de novo` | Carimbo | "TCM: REJEIÇÃO" | 6 |
| 41 | `2020. Terceira` | Carimbo | Terceiro carimbo; placar "3 SEGUIDAS" ★ | 6 |
| 42 | `saiu incompleto` | Relatório | Folha do RREO 2020 com metade em branco ★ | 6 |
| 43 | `2021. O Fundeb sobe` | Canaleta | Fluxo de volta engrossa; R$ 98 MI | 7 |
| 44 | `SIOPE, 22,3` | Copo 2021 | Abaixo, marsala | 7 |
| 45 | `por causa da pandemia` | Livro + selo | Livro pequeno "EC 119/2022"; copo volta ao neutro | 7 |
| 46 | `educacao zerada` | Relatório | Folha do RREO 2021 com "0,00" ★ | 7 |
| 47 | `aprovar, com ressalvas` (1ª) | Carimbo | Carimbo claro "TCM: APROVAÇÃO C/ RESSALVAS" | 7 |
| 48 | `2022 e 2023` | Pilhas | 17 e 19 pilhas, num plano só | 7 |
| 49 | `26,9% e 29,3` | Copos | Dois copos acima da linha | 7 |
| 50 | `aprovar, com ressalvas` (2ª) | Carimbos | Dois carimbos claros | 7 |
| 51 | `42,9 milhoes de precatorios` | Moedas | 4 pilhas extras com etiqueta "PRECATÓRIOS FUNDEF" | 7 |
| 52 | `2024. Recorde` | Pilhas 2024 | 27 pilhas, a mais alta | 8 |
| 53 | `25,9% no relatorio` | Copo 2024 | Acima da linha | 8 |
| 54 | `metade na educacao infantil` | Barra | Barra com marca de 50% e etiqueta "EDUCAÇÃO INFANTIL" | 8 |
| 55 | `Foi 11,4` | Barra | Enche só até 11,4%, marsala | 8 |
| 56 | `15% em obras` | Barra | Segunda barra, marca de 15% | 8 |
| 57 | `Foi 1,8` | Barra | Enche até 1,8%, marsala | 8 |
| 58 | `2025. A lei previu 277` | Pilha fantasma | Contorno de 28 pilhas | 8 |
| 59 | `balanco mostra 231` | Pilhas | 23 pilhas na placa BALANÇO | 8 |
| 60 | `planilha do portal 249` | Pilhas | 25 pilhas na placa PLANILHA | 8 |
| 61 | `relatorio 300` | Pilhas | 30 pilhas na placa RELATÓRIO | 8 |
| 62 | `No SIOPE, 26,2` | Copo SIOPE 2025 | Acima da linha | 8 |
| 63 | `prefeitura, 24,2` | Copo RELATÓRIO 2025 | Abaixo, marsala | 8 |
| 64 | `saltaram para 51` | Obra | Material de obra (tijolos, tábuas, cones) cresce ao lado da escola | 8 |
| 65 | `ainda nao ha nos documentos` | TCM | "?" sobre o prédio | 8 |
| 66 | `2026, ate agosto` | Marco 2026 | Marco claro; barra de progresso do ano até agosto (8 de 12) | 9 |
| 67 | `prevê 240` | Pilha fantasma | Contorno de 24 pilhas | 9 |
| 68 | `213 milhoes empenhados` | Pilhas | 21 pilhas meio transparentes (empenhado) | 9 |
| 69 | `150 pagos` | Pilhas | 15 delas ficam sólidas (pago) | 9 |
| 70 | `mandou 104` | Canaleta | Fluxo de volta; R$ 104 MI | 9 |
| 71 | `18,5% dos impostos` | Copo 2026 | Copo enchendo, abaixo da linha, em neutro (ano não fechou) | 9 |
| 72 | `fim do ano` | Barra do ano | Barra de progresso pulsa em "DEZ" ★ | 9 |
| 73 | `A conta final` | Rua do tempo | Câmera sobe; a rua inteira | 10 |
| 74 | `2 bilhoes e 90` | Contador | Todas as pilhas acendem; R$ 2,09 BI | 10 |
| 75 | `Corrigido pela inflacao` | Pilhas | Fantasma dourado em cima | 10 |
| 76 | `3 bilhoes e 190` | Contador | R$ 3,19 BI | 10 |
| 77 | `poe 613` | Canaleta | Fluxo fino indo; R$ 613 MI | 10 |
| 78 | `recebeu 1 bilhao` | Canaleta | Fluxo grosso voltando; R$ 1,36 BI | 10 |
| 79 | `Mais que o dobro` | Rótulo | "×2,2" no acento ★ | 10 |
| 80 | `O dinheiro e seu` | MAPA 3 | Satélite de Ilhéus | 11 |
| 81 | `portal da transparencia` | MAPA 3 | Etiqueta do site | 11 |
| 82 | `escola do seu bairro` | MAPA 3 | Pontinhos verdes na cidade ★ | 11 |
| 83 | `Me conta` | Interface | Balão de comentário | 11 |
| 84 | `E segue o` | Assinatura | Assinatura do perfil | 11 |

★ = sugestão do diretor. Na etapa 4 a densidade sobe para cerca de 1 evento por segundo.

## 2.4 Cenas com câmera (distâncias são referência; o enquadramento é automático)

| Cena | Trecho da fala | Pílula | Câmera | Aha |
|---|---|---|---|---|
| 1 | gancho | EDUCAÇÃO EM ILHÉUS | MAPA 1 (Kit Mapas) | Muito dinheiro, e as contas não batem |
| 2 | introdução (fontes, regra, vaquinha) | A REGRA | Grua da vista alta até a escola; arco curto até a prefeitura e o cofre | 25% dos impostos, e o Fundeb devolve |
| 3 | 2006 e 2007 | 2006–2007 | Desce até o começo da rua, de lado | Só o dinheiro do fundo; sem gasto conhecido |
| 4 | 2008 e 2009 | 2008–2009 | Travelling baixo pela rua (olhando ao longo do anel) | Começa a série; um ano no limite, outro folgado |
| 5 | 2012 a 2017 | 2012–2017 | Travelling continua, parando em 2012 e 2016 | Gastou menos que o previsto; fontes discordam |
| 6 | 2018 a 2020 | 2018–2020 | Plano médio com o TCM ao fundo (38°); close nos copos de 2019 | Três recomendações seguidas de rejeição |
| 7 | 2021 a 2023 | 2021–2023 | Travelling; um plano com 2022 e 2023 juntos | Pandemia livrou 2021; depois acima do mínimo |
| 8 | 2024 e 2025 | 2024–2025 | Grua na pilha recorde; desce no meio das placas de 2025 | Recorde, mas regras do Fundeb abaixo; 3 números em 2025 |
| 9 | 2026 até agosto | 2026 | Câmera chega no marco claro, devagar | Ano em andamento |
| 10 | conta final | A CONTA | Sobe até ver a rua inteira; desliza até o cofre do Fundeb | 2 bilhões; o fundo devolveu mais que o dobro |
| 11 | fecho | É SEU | MAPA 3 (Kit Mapas) | Você pode conferir |

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
