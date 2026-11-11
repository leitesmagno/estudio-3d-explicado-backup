# Plano de cenas (RASCUNHO): 029. educação em ilhéus

Código `educacaoilheus` · Nome `EducacaoIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

> **Rascunho antes da voz.** Pela ordem do Estúdio, o plano oficial (`plano.md`) só fecha depois da narração e da sincronia, porque **o tempo vem da fala**. Aqui já ficam definidos o mundo, as peças, os trechos de mapa, as cenas, as câmeras e a lista de palavras-chave. Na etapa 4, cada palavra ganha o tempo do `palavras.ts`, e a tabela de palavras repetidas entra na seção 2.1.

**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro. O Kit Mapas Animados gera **três trechos de satélite de Ilhéus**, sem legenda, sem marca e sem som, que entram por `OffthreadVideo` dentro de uma `Sequence`, com entrada e saída de 0,2 s. Legenda, pílula e marca do 3D ficam por cima. Selos do 3D sobre o mapa vão no topo (y 470).

## 2.1 Narração (preencher na etapa 4)
- Arquivo `audio/narracao-norm.wav`, 1,2x, pausas de no máximo 0,35 s, volume -15.
- 411 palavras no roteiro, cerca de 160 s (ritmo do 014: 0,39 s por palavra).
- O roteiro passa de 350 palavras: a voz vai em **3 partes** (gancho a "Mais que o dobro" · "Agora, o gasto" a "por vários motivos" · "E 2025?" ao fim), e os dois-pontos das listas viram ponto no texto da voz.
- Palavras que vão se repetir (chamar sempre com trecho longo): **2025** (8 vezes), **2008** (4), **2021** (3), **2019** (3), **25%** (3), **Tribunal** (5), **SIOPE** (3), **relatório** (4), **milhões** (muitas), **Fundeb** (3), **vaquinha** (2), **mínimo** (5). Números com vírgula: `quando('2012, com 22,8')`, `quando('2016, com 22,1')`, `quando('2021, com 22,3')`, `quando('dizia 26,8')`, `quando('mostra 26,2')`, `quando('mostra 24,2')`.

## 2.2 Ideia e mundo

**A metáfora: a mesma maquete de Ilhéus do vídeo 014, agora com a ESCOLA no centro.** Quem viu o orçamento de Ilhéus reconhece a mesa redonda, o mar no canto e a ponte. No lugar do cofre, fica a **Escola** grande. Em volta dela, uma **rua do tempo**: um anel no chão da mesa com 21 marcos de ano (2006 a 2026). Cada ano ganha a sua **pilha de moedas na frente do marco** (1 pilha = R$ 10 milhões), então a pessoa vê a educação crescer ano a ano andando com a câmera em volta da escola.

Do lado esquerdo da mesa fica a **"vaquinha" do Fundeb**: um cofre grande com letreiro FUNDEB, ligado à Prefeitura por uma canaleta de moedas que vai e volta. Do lado direito, ao fundo, o **prédio do Tribunal de Contas** (do 014), com o carimbo que desce.

**As réguas dos 25%:** para cada ano citado, um **copo de piso** (do 014) sobe do chão na frente do marco. A linha dos 25% é um anel verde fixo na altura do copo. Copo abaixo da linha fica em marsala.

**Protagonista:** não há. O personagem é o dinheiro da educação (as pilhas) e a escola. Só aparecem bonecos genéricos sem rosto: alunos entrando na escola (gancho e fecho) e um auditor do TCM com lupa (cena 7), com etiqueta "TCM-BA".

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Na narração | O que mostra |
|---|---|---|
| **MAPA 1: "ILHÉUS"** | do início até `Eu abri os documentos` | Voo do Brasil até o sul da Bahia, descendo no satélite até Ilhéus. O contorno do município (IBGE 2913606) acende em verde. Em "2 bilhões" digita **R$ 2 BILHÕES** no meio do município e, embaixo, **EDUCAÇÃO · 2008 A 2025**. Em "não batem" entram três etiquetas pequenas que não combinam: **26,2%** · **24,2%** · **24%** ★ |
| **MAPA 2: "A VAQUINHA"** | de `E tem o Fundeb` até `Mais que o dobro` | Ilhéus no meio do sul da Bahia. Em "20% de alguns repasses" saem de Ilhéus setas finas com moedinha para um ponto **FUNDO** (sem cidade, um círculo no estado). Em "613 milhões" a etiqueta **ENVIOU R$ 613 MI** sai de Ilhéus. Em "1 bilhão e 360 milhões" uma seta mais grossa volta com **RECEBEU R$ 1,36 BI**. Em "mais que o dobro" as duas etiquetas ficam lado a lado, a de cima em verde |
| **MAPA 3: "É SEU"** | de `O dinheiro é seu` até o fim | Volta ao satélite de Ilhéus com o contorno verde e a câmera girando devagar. Em "portal da transparência" entra a etiqueta **transparencia.ilheus.ba.gov.br**. Em "escola do seu bairro" pontinhos verdes acendem um a um sobre a área urbana ★ (sem nome de escola, só pontos) |

**Selos de fonte** (pedido do 016: maiores e com documento e página, embaixo da pílula):

| Selo | Entra em | Texto |
|---|---|---|
| Documentos | `Eu abri os documentos` | PORTAL DA TRANSPARÊNCIA · RREO, LOA, BALANÇOS · TCM-BA |
| A regra | `pelo menos 25%` | CONSTITUIÇÃO, ART. 212 · RREO ANEXO 8 |
| Fundeb | `613 milhões` | SIOPE/FNDE · 2008 A 2025 · CONTA DO VÍDEO |
| Gasto | `Em 2008, a educação` | SIOPE/FNDE · BALANÇO ANUAL 2024 E 2025 |
| Inflação | `Corrigido pela inflação` | IPCA · BANCO CENTRAL · ATÉ SET/2026 · CONTA DO VÍDEO |
| Abaixo no SIOPE | `No SIOPE` | SIOPE/FNDE · INDICADOR 1.1 |
| 2019 | `Em 2019, o relatório` | RREO DEZ/2019 · ANEXO 14 / PARECER TCM 06442e20 |
| Rejeição | `recomendou rejeitar` | PARECERES TCM 04894e19 · 06442e20 · 07666e24 |
| 2025 | `Três documentos oficiais` | SIOPE · RREO DEZ/2025 ANEXO 8 · BALANÇO 2025 · PORTAL |
| 2006 e 2007 | `De 2006 e 2007` | TESOURO NACIONAL · TRANSFERÊNCIAS CONSTITUCIONAIS |

**Placar fixo** (da cena 4 até a cena 6), no canto de cima: **"1 PILHA = R$ 10 MILHÕES"**.

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` misturado com `tema.areia` 25% (igual ao 014) |
| chão da maquete | `tema.areia` (tom médio) e `tema.vegetacao` |
| mar no canto | `tema.agua` fosco |
| escola, prefeitura, TCM | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| moedas e pilhas | dourado da paleta de apoio (nunca o acento) |
| linha dos 25%, número em destaque, contorno de Ilhéus | `tema.acento` (verde) |
| abaixo do mínimo (copo, carimbo REJEIÇÃO, etiqueta 24%) | marsala da paleta de apoio (`tema.alerta`), fosco |
| anos sem dado (2006 e 2007 sem pilha) | marco em `tema.objeto` a 40%, com "?" ★ |

**Mapa do mundo** (mesa redonda de raio 9 m do 014; chão da mesa em y = 0; frente da câmera é z+):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa da maquete | [0, 0, 0] | `MesaMaquete` (014, reaproveitada) |
| Mar, ponte e casinhas de fundo | anel de raio 7 a 8,5, atrás (z < -3) | `PonteMini`, `CasaMini`, `Casinha` (014 e catálogo) |
| Escola grande | [0, 0, -0,5] | `Escola` (014) em escala 1,6, letreiro "EDUCAÇÃO"; alunos entram pela porta no gancho e no fecho |
| Rua do tempo | anel de raio 4,2 em volta da escola | `LinhaChao` ou `MarcoAno` (catálogo) com 21 marcos (2006 a 2026); de 2006 na esquerda até 2026 na direita, passando pela frente |
| Pilhas de cada ano | 0,8 m para dentro de cada marco | `PilhasDinheiro` (014): 2008 = 4 pilhas e um pedaço; 2024 = 27 pilhas; 2025 = 23 pilhas; 2026 = pilha clara (parcial) |
| Copos dos 25% | ao lado do marco de cada ano citado (2012, 2016, 2019, 2021, 2025) | `CopoPiso` (014) com a linha dos 25% no acento |
| Prefeitura | [-5,5, 0, -3] | `Prefeitura` (014) |
| Cofre FUNDEB (a vaquinha) | [-6, 0, 1,5] | `CofreFGTS` (catálogo) com letreiro "FUNDEB" ★ |
| Canaleta Prefeitura ↔ FUNDEB | entre [-5,5, 0, -3] e [-6, 0, 1,5] | `TrilhoMoedas` (catálogo): moedas indo (20%) e voltando em fluxo maior |
| Tribunal de Contas | [5,5, 0, -3,5] | `PredioTCM` (014), sobe só na cena 7 |
| Relatórios e documentos | flutuam na frente da câmera na cena 2 | `RelatorioPDF` (014): RREO, LOA, BALANÇO, PARECER TCM |
| Auditor do TCM | [4,5, 0, -1,5] | boneco genérico (`Pessoa`) com lupa e etiqueta "TCM-BA" ★ |
| Carimbo | sobre os relatórios de 2018, 2019 e 2020 | carimbo 3D do 028 com texto "PARECER: REJEIÇÃO" em marsala |

**Regras visuais:** o acento só na linha dos 25%, no número que está sendo dito e no contorno de Ilhéus. Tudo que acende volta ao neutro no fim da cena. Pilhas nascem só na palavra do seu ano. Nenhum nome de pessoa, nenhum logo: "PREFEITURA", "FUNDEB", "TCM-BA" só como letreiro na fonte do perfil. Neutralidade: o vídeo mostra os números e quem disse cada um, sem dizer que alguém errou.

## 2.3 Mapa de palavras-chave (tempos na etapa 4)

| # | Palavra (`quando`) | Objeto | O que acontece | Cena |
|---|---|---|---|---|
| 1 | início | MAPA 1 | Voo do Brasil até Ilhéus | 1 |
| 2 | `Em 18 anos` | MAPA 1 | Contorno de Ilhéus acende em verde | 1 |
| 3 | `2 bilhoes com` | MAPA 1 | Digita R$ 2 BILHÕES · EDUCAÇÃO 2008 A 2025 | 1 |
| 4 | `nao batem` | MAPA 1 | Três etiquetas (26,2% · 24,2% · 24%) entram tortas e balançam ★ | 1 |
| 5 | `Eu abri os documentos` | RelatorioPDF | Quatro documentos voam até a frente da câmera, sobre a maquete | 2 |
| 6 | `relatorios, leis` | RelatorioPDF | Acende o RREO, depois a LOA | 2 |
| 7 | `balancos e os pareceres` | RelatorioPDF | Acende o BALANÇO, depois o PARECER TCM | 2 |
| 8 | `A fonte de cada` | Selo | Primeiro selo de fonte aparece embaixo da pílula ★ | 2 |
| 9 | `Primeiro, a regra` | Escola | Câmera desce até a escola no centro; letreiro EDUCAÇÃO acende | 3 |
| 10 | `pelo menos 25%` | Copo | Copo grande sobe ao lado da escola com a linha dos 25% no acento | 3 |
| 11 | `de cada 4 reais` | Moedas | 4 moedas caem na frente da escola | 3 |
| 12 | `1 e da escola` | Moedas | 1 das 4 rola para dentro da porta da escola e acende | 3 |
| 13 | `E tem o Fundeb` | MAPA 2 | Entra o trecho do mapa | 4 |
| 14 | `Pensa numa vaquinha` | MAPA 2 | O ponto FUNDO aparece no estado | 4 |
| 15 | `coloca 20%` | MAPA 2 | Setas saem de Ilhéus para o FUNDO com moedinhas | 4 |
| 16 | `o FPM e o ICMS` | MAPA 2 | Duas etiquetas pequenas FPM e ICMS correm nas setas | 4 |
| 17 | `devolve dinheiro` | MAPA 2 | Seta de volta para Ilhéus | 4 |
| 18 | `613 milhoes` | MAPA 2 | ENVIOU R$ 613 MI | 4 |
| 19 | `1 bilhao e 360` | MAPA 2 | RECEBEU R$ 1,36 BI, seta grossa | 4 |
| 20 | `Mais que o dobro` | MAPA 2 | As duas etiquetas lado a lado, "×2,2" ★ | 4 |
| 21 | `Agora, o gasto` | Rua do tempo | Volta ao 3D; câmera sobe e mostra o anel de 21 marcos | 5 |
| 22 | `Em 2008, a educacao` | Marco 2008 | Marco acende | 5 |
| 23 | `custou 43` | Pilhas 2008 | 4 pilhas e um pedaço nascem; rótulo R$ 43 MI | 5 |
| 24 | ★ entre 2008 e 2024 | Pilhas 2009 a 2023 | Pilhas dos anos do meio crescem em onda, sem número (só altura) | 5 |
| 25 | `bateu o recorde` | Pilhas 2024 | 27 pilhas, a mais alta; brilho leve | 5 |
| 26 | `269` | Rótulo | R$ 269 MI no acento | 5 |
| 27 | `caiu para 231` | Pilhas 2025 | 23 pilhas; 4 pilhas fantasma (30%) mostram a diferença ★ | 5 |
| 28 | `Somando de 2008` | Todas as pilhas | Câmera sobe; todas acendem juntas | 5 |
| 29 | `2 bilhoes e 90` | Contador | Contador grande no topo: R$ 2,09 BI | 5 |
| 30 | `Corrigido pela inflacao` | Pilhas | Pilhas crescem 50% (fantasma dourado em cima) | 5 |
| 31 | `3 bilhoes e 190` | Contador | Contador troca para R$ 3,19 BI HOJE | 5 |
| 32 | `Agora repara` | Câmera | Câmera para e desce até a altura dos copos | 6 |
| 33 | `nem sempre foi cumprido` | Linha 25% | Anel verde dos 25% acende em volta da rua do tempo | 6 |
| 34 | `No SIOPE` | Letreiro | Placa SIOPE · GOVERNO FEDERAL ao lado da prefeitura | 6 |
| 35 | `tres anos ficaram abaixo` | Placar | Placar 0/3 no alto ★ | 6 |
| 36 | `2012, com 22,8` | Copo 2012 | Copo sobe e para abaixo da linha; marsala; 1/3 | 6 |
| 37 | `2016, com 22,1` | Copo 2016 | Idem; 2/3 | 6 |
| 38 | `2021, com 22,3` | Copo 2021 | Idem; 3/3 | 6 |
| 39 | `uma emenda` | Livro | Livro da Constituição (`LivroPopUp` pequeno) abre com "EC 119/2022" | 6 |
| 40 | `por causa da pandemia` | Copo 2021 | Copo de 2021 ganha um selo "PANDEMIA" e volta ao neutro | 6 |
| 41 | `a parte que quase ninguem` | TCM | Prédio do TCM sobe ao fundo | 7 |
| 42 | `dizia 26,8` | Copo 2019 | Copo sobe acima da linha (26,8%), etiqueta "PREFEITURA" | 7 |
| 43 | `conferiu as despesas` | Auditor | Boneco do TCM chega com lupa | 7 |
| 44 | `chegou a 24` | Copo 2019 | Copo esvazia até 24% (abaixo da linha), etiqueta "TCM" | 7 |
| 45 | `Abaixo do minimo` | Copo 2019 | Marsala | 7 |
| 46 | `recomendou rejeitar` | Carimbo | Carimbo "PARECER: REJEIÇÃO" no relatório de 2019 | 7 |
| 47 | `as de 2018` | Carimbo | Mesmo carimbo em 2018 | 7 |
| 48 | `e 2020` | Carimbo | Mesmo carimbo em 2020 | 7 |
| 49 | `por varios motivos` | Selo | Selo dos três pareceres | 7 |
| 50 | `E 2025?` | Marco 2025 | Câmera vai até 2025 | 8 |
| 51 | `Tres documentos oficiais` | 3 placas | Três placas em pé: SIOPE · RELATÓRIO · BALANÇO | 8 |
| 52 | `mostra 26,2` | Copo SIOPE | Copo acima da linha | 8 |
| 53 | `mostra 24,2` | Copo RREO | Copo abaixo da linha, marsala | 8 |
| 54 | `231 milhoes no balanco` | Pilhas | 23 pilhas na frente da placa BALANÇO | 8 |
| 55 | `249 na planilha` | Pilhas | 25 pilhas na frente de PLANILHA DO PORTAL | 8 |
| 56 | `300 no relatorio` | Pilhas | 30 pilhas na frente de RELATÓRIO | 8 |
| 57 | `parecer do Tribunal sobre 2025` | TCM | Letreiro do TCM com "?" pulsando devagar ★ | 8 |
| 58 | `o que falta` | Marcos 2006 e 2007 | Câmera vai ao começo da rua do tempo | 9 |
| 59 | `De 2006 e 2007` | Marcos | Marcos sem pilha, com "?" | 9 |
| 60 | `33 milhoes` | Moedas | Só uma pilhinha pequena FUNDEB (R$ 33 MI) entre os dois | 9 |
| 61 | `nao achei` | Marcos | "?" fica; resto apagado | 9 |
| 62 | `O dinheiro e seu` | MAPA 3 | Entra o satélite de Ilhéus | 10 |
| 63 | `portal da transparencia` | MAPA 3 | Etiqueta do site | 10 |
| 64 | `escola do seu bairro` | MAPA 3 | Pontinhos verdes acendem na cidade ★ | 10 |
| 65 | `Me conta nos comentarios` | Interface | Balão de comentário | 10 |
| 66 | `E segue o` | Assinatura | Assinatura do perfil | 10 |

★ = sugestão do diretor, além do roteiro. Na etapa 4 a densidade sobe para cerca de 1 evento por segundo (mais de 150 eventos), quebrando cada linha acima nos números e nomes ditos.

## 2.4 Cenas com câmera (distâncias são referência; o enquadramento é automático)

| Cena | Trecho da fala | Pílula | Câmera | Aha |
|---|---|---|---|---|
| 1 | gancho | EDUCAÇÃO EM ILHÉUS | MAPA 1 (Kit Mapas) | Muito dinheiro, e as contas não batem |
| 2 | "Eu abri os documentos" | OS DOCUMENTOS | Grua descendo da vista alta da maquete até os 4 documentos (ângulo 40°) | Tudo vem de papel oficial |
| 3 | "Primeiro, a regra" | A REGRA | Avanço lento até a escola, de frente e um pouco alto (37°) | 1 de cada 4 reais de imposto é da escola |
| 4 | "E tem o Fundeb" | A VAQUINHA | MAPA 2 (Kit Mapas) | Ilhéus recebe do fundo mais do que manda |
| 5 | "Agora, o gasto" | O GASTO | Arco em volta da rua do tempo, de 2008 até 2025, olhando ao longo do anel; sobe no "Somando" | A educação cresceu de 43 para 269 milhões |
| 6 | "Agora repara" | O MÍNIMO | Câmera baixa, na altura dos copos, passando por 2012, 2016 e 2021 | Três anos abaixo dos 25% no SIOPE |
| 7 | "a parte que quase ninguém vê" | 2019 | Close no copo de 2019 com o TCM ao fundo; depois sobe para mostrar os três carimbos | O TCM achou menos que a prefeitura |
| 8 | "E 2025?" | 2025 | Plano médio nas três placas, de lado, arco curto | Três números oficiais para o mesmo ano |
| 9 | "o que falta" | O QUE FALTA | Recua até o começo da rua do tempo, câmera alta | Sem dado aberto de gasto em 2006 e 2007 |
| 10 | "O dinheiro é seu" | É SEU | MAPA 3 (Kit Mapas) | Você pode conferir |

## 2.5 Arquivos

- **Reaproveitados do 014** (`src/videos/orcamentoilheus/pecas.tsx`): `MesaMaquete`, `PonteMini`, `Escola`, `Prefeitura`, `PredioTCM`, `PilhasDinheiro`, `RelatorioPDF`, `CopoPiso`.
- **Do catálogo:** `CofreFGTS`, `TrilhoMoedas`, `MarcoAno` ou `LinhaChao`, `Pessoa`, `LivroPopUp`, `CasaMini`, `Casinha`.
- **Do 028:** o carimbo 3D (troca o texto para "PARECER: REJEIÇÃO").
- **Novos:** `src/videos/educacaoilheus/` (`EducacaoIlheus.tsx`, `pecas.tsx`, `palavras.ts`); peça nova pequena `PlacaFonte3D` (placa em pé SIOPE / RELATÓRIO / BALANÇO / PLANILHA) ★.
- **Kit Mapas:** `src/videos/educacao-ilheus/` (molde do `orcamento-ilheus`, que já tem o contorno de Ilhéus), com três composições curtas (MAPA 1, 2 e 3), tempos tirados do `palavras.ts` do 3D.

## Ainda falta (etapa 4)
- Tempos de cada palavra (depois da sincronia).
- Câmera de cada cena com posição, alvo, distância e ângulo no início e no fim.
- Lista final de palavras repetidas.
