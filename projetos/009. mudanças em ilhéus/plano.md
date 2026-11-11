# Plano de cenas: 009. mudanças em ilhéus (versão 1, aprovada em 30/10/2026)

Código `mudancasilheus` · Nome `MudancasIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

> Tempos certos, tirados da sincronia. Aprovado pela pessoa ("plano aprovado").

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Lendário (ElevenLabs v3) · preparo: 1,2x, pausas de no máximo 0,35 s, volume -15 · duração **174.64 s** · `AUDIO_SEG = 174.64` · `QUADROS = 5267` (com 0,9 s de folga).
- 451 palavras; a última ("informações.") termina em 174,22 s. Sem buraco maior que 1,5 s, sem palavra fora de ordem. A voz leu o roteiro inteiro, sem pular nem repetir.
- Ajuste da sincronia: "arroba eu magno leite" → `@eumagnoleite`. Cópia do original em `transcricao/palavras-original.json`.
- Roteiro: `audio/roteiro-falado.txt`; texto da voz: `audio/roteiro-tags.txt`. Fala cita só o Diário Oficial (e o O Tabuleiro no Hermano).
- Chamada final pedida pela pessoa: "E segue arroba eu magno leite para mais informações."
- Na fala, os secretários e o Hermano têm nome e sobrenome. Os outros 68 só o primeiro nome. O nome completo de todos vai no cartão de nomes.
- Nomes iguais vão com sobrenome (pedido da pessoa): Juliana Amaral e Juliana Sá Silva; Filipe Levita, Filipe Silveira e Felipe Paraizo. Nomes compostos já se diferenciam: "Paulo" (Roberto, Renan, Cesar, Rogério), "José" (Carlos, Domingos, Antonio), "Carlos" (Alberto, Weslly). `quando()` sempre pelo trecho com a palavra de antes.

## 2.2 Ideia e mundo

**A metáfora: a dança das cadeiras na praça da Prefeitura.** A praça vira um **tabuleiro comprido** com 21 ilhas (tablados), uma por órgão citado; o Gabinete do Prefeito, que tem muitos cargos, vira 3 tablados com a mesma cor de placa (ASSESSORIAS, COMUNICAÇÃO e PROJETOS). Cada ilha é uma plataforma baixa com a placa do órgão, uma **cadeira grande** (o secretário) e cadeiras pequenas (os outros cargos). Cada pessoa citada é um boneco sem rosto, sentado na cadeira dela. A praça tem cerca, com **portão de ENTRADA** à esquerda e **portão de SAÍDA** à direita. Fora da cerca, do lado direito, fica a **calçada "FICARAM DE FORA"**.

Os três grupos do roteiro viram três movimentos, sempre iguais, para a pessoa aprender o código uma vez e ler o vídeo todo:

| Grupo | Movimento | Cor do boneco e do rastro |
|---|---|---|
| **Trocaram de cadeira** (25) | levanta, anda em arco até a cadeira nova e senta | **`tema.acento`** (verde): é a dança das cadeiras, o assunto do vídeo |
| **Chegaram** (26) | sai da fila fora do portão de ENTRADA, entra e senta | `festa.azul` |
| **Ficaram de fora** (28) | levanta, anda até o portão de SAÍDA e fica na calçada de fora | `tema.objeto` (cinza), a cadeira fica vazia |

**Por que assim (didático):**
1. A conta 53 e 51 é a parte que confunde. A cena 3 mostra **uma troca em câmera lenta**: quando o boneco levanta, a cadeira antiga ganha o carimbo EXONERADO; quando senta na nova, ganha NOMEADO. Daí a pessoa entende sozinha por que 25 + 28 = 53 e 25 + 26 = 51.
2. Os secretários formam **duas correntes** lado a lado (Educação → Mulheres → Promoção Social e Trânsito → Maramata → Cultura). Com as ilhas em fila, a corrente aparece como uma linha de setas.
3. **Placar fixo** no alto com os três contadores (TROCARAM 0/25 · CHEGARAM 0/26 · FICARAM DE FORA 0/28). Cada nome dito soma 1 no grupo dele. A pessoa vê o vídeo "andando" e sabe quanto falta.
4. **Cartão de nomes** embaixo, a lista de consulta: cada nome entra numa linha quando é dito, **com o nome completo** do decreto e "de → para". É o que a pessoa vai pausar para ler (por isso o "salva esse vídeo").

**Protagonista:** não há "você". O fio do vídeo são **as cadeiras**: no fim, as duas cadeiras grandes vazias (Saúde e Serviços Urbanos) ficam acesas com "?".

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; 3 colunas em x = −5, 0, 5; 7 fileiras em z de −15 a 15, de 5 em 5):

| Fileira (z) | Esquerda (x −5) | Meio (x 0) | Direita (x 5) |
|---|---|---|---|
| 1 (−15) | GABINETE · ASSESSORIAS | CASA CIVIL | GABINETE DA VICE |
| 2 (−10) | PROCURADORIA | CONTROLADORIA | FAZENDA |
| 3 (−5) | RELAÇÕES INSTITUCIONAIS | INTERIOR | GABINETE · PROJETOS |
| 4 (0) | EDUCAÇÃO | MULHERES | PROMOÇÃO SOCIAL |
| 5 (5) | TRÂNSITO | MARAMATA | CULTURA |
| 6 (10) | SAÚDE | SERVIÇOS URBANOS | DESENV. ECONÔMICO |
| 7 (15) | TURISMO (EVENTOS) | GABINETE · COMUNICAÇÃO | INFRAESTRUTURA |

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Prefeitura (`Predio` com letreiro "PREFEITURA DE ILHÉUS") | [0, 0, −22] | fundo do tabuleiro, vista em todas as cenas de cima |
| Praça (chão claro) e cerca baixa | 18 × 40 m, centro [0, 0, 0] | cerca com 0,6 m de altura, não tapa nada |
| Ilha (`Ilha`, peça nova) | nas posições da tabela, 3,6 × 3,2 m | Promoção Social maior (4,2 × 3,8), porque recebe 19 pessoas |
| Cadeira grande (`Cadeira`, peça nova) | frente de cada ilha | só as ilhas com secretário citado |
| Portão de ENTRADA | [−10, 0, 2,5] | fila de 26 bonecos azuis fora, de x −12 a −18 |
| Portão de SAÍDA | [10, 0, 2,5] | calçada "FICARAM DE FORA" de x 12 a 18, fileiras de 7 |
| Diário Oficial gigante (`Jornal`, peça nova) | [0, 0,05, 0] deitado (cena 2) | "DIÁRIO OFICIAL · Nº 260 · 29/10/2026" |
| Pódio de blocos da conta (cena 3) | [0, 0, 22] | pilhas de cubinhos nas três cores |

**De onde cada um sai (conferido nos decretos):** todos os órgãos de origem e destino vêm do texto de cada decreto (`referencias/decretos.txt`). Cargos do Gabinete do Prefeito: publicidade, jornalismo, mídias e fotografia ficam em GABINETE · COMUNICAÇÃO; Acompanhamento de Projetos em GABINETE · PROJETOS; o resto em GABINETE · ASSESSORIAS. Caio, Thaise e Paulo Renan mudam de cadeira dentro do mesmo tablado. Humberto sai da cadeira grande da Controladoria. O cartão de nomes mostra o cargo exato do decreto e o número dele.

**Regras visuais deste vídeo**
- **Neutralidade.** Valderico Júnior e Jabes Ribeiro aparecem só na cena 2, como dois bonecos iguais, da mesma cor, com placa de nome. Quem fica de fora não é "culpado": cinza é só "sem cadeira nesta edição".
- Nenhum boneco tem rosto, e todos têm o mesmo corpo. O que muda é só a cor do grupo.
- Sem logo de partido, prefeitura ou jornal. Tudo é texto escrito na fonte do perfil.
- O acento verde só aparece na troca de cadeira e nas duas cadeiras vazias do fim.
- Nada pisca: carimbos e cores mudam em 0,4 s.

## 2.3 Mapa de palavras-chave

Tempos do `palavras.ts` (início da palavra, em segundos). ★ = extra sugerido pelo diretor.

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 0.72 | `cinquenta e três` | 1 | todas as cadeiras | os 53 bonecos que vão se mexer levantam juntos; número 53 gigante na tela | 1 |
| 2 | `Quem saiu` | 3.04 | portão SAÍDA | chip "QUEM SAIU?" com seta para o portão | 1 |
| 3 | `Quem entrou` | 3.96 | portão ENTRADA | chip "QUEM ENTROU?" | 1 |
| 4 | `ficou de fora` | 5.18 | calçada | chip "QUEM FICOU DE FORA?" | 1 |
| 5 | `todos os nomes` | 6.32 | cartão de nomes ★ | o cartão abre e rola rápido (só um borrão de linhas) | 1 |
| 6 | `Diário Oficial` | 8.10 | Jornal gigante | o jornal desdobra no chão da praça | 2 |
| 7 | `duzentos e sessenta` | 10.64 | Jornal | o número 260 sobe da página; selo S1 DIÁRIO OFICIAL Nº 260 · 29/10/2026 | 2 |
| 8 | `rompimento` | 13.32 | dois bonecos | os dois bonecos lado a lado se afastam; uma linha fina se abre no chão entre eles | 2 |
| 9 | `Valderico Júnior` | 14.42 | boneco 1 | placa "VALDERICO JÚNIOR · PREFEITO" | 2 |
| 10 | `Jabes Ribeiro` | 16.76 | boneco 2 | placa "JABES RIBEIRO · EX-PREFEITO · PP" | 2 |
| 11 | `Os decretos trazem` | 18.22 | Jornal → pódio | as páginas viram 104 folhinhas (uma por decreto) que voam para o pódio | 3 |
| 12 | `cinquenta e três exonerações` (2ª vez) | 19.20 | pilha 53 | 53 folhinhas formam a pilha EXONERAÇÕES (decretos 627 a 679) | 3 |
| 13 | `cinquenta e uma nomeações` | 20.80 | pilha 51 | 51 folhinhas formam a pilha NOMEAÇÕES (decretos 680 a 730) | 3 |
| 14 | `só trocou de cadeira` | 23.32 | boneco-exemplo | um boneco levanta de uma cadeira e anda em arco até outra (câmera lenta) | 3 |
| 15 | `exonerada do cargo antigo` | 24.88 | cadeira antiga | carimbo EXONERADO na cadeira de onde ele saiu | 3 |
| 16 | `nomeada no novo` | 26.38 | cadeira nova | carimbo NOMEADO na cadeira onde ele sentou | 3 |
| 17 | `três grupos` | 28.06 | pilhas | as duas pilhas se pintam | 3 |
| 18 | `vinte e cinco trocaram` | 28.68 | 25 verdes | 25 folhinhas verdes acendem nas duas pilhas ao mesmo tempo (são as mesmas pessoas) | 3 |
| 19 | `vinte e seis chegaram` | 30.78 | 26 azuis | o topo da pilha NOMEAÇÕES fica azul | 3 |
| 20 | `vinte e oito ficaram` | 31.53 | 28 cinzas | o topo da pilha EXONERAÇÕES fica cinza; as três etiquetas viram o placar fixo no alto | 3 |
| 21 | `Os secretários` | 33.66 | cadeiras grandes | todas as cadeiras grandes ganham um aro claro | 4 |
| 22 | `Vinícius Ibrann` | 34.76 | azul | entra pelo portão e senta na cadeira grande da EDUCAÇÃO (a Evani levanta um instante antes) | 4 |
| 23 | `Evani Cavalcante` | 37.12 | verde | Educação → Mulheres | 4 |
| 24 | `Wanessa Gedeon` | 39.76 | verde | Mulheres → Promoção Social; corrente 1 completa (setas acesas na fileira 4) | 4 |
| 25 | `Davidson Santos` | 42.80 | verde | Maramata → Cultura | 4 |
| 26 | `Fabrício Nascimento` | 45.42 | verde | Trânsito → Maramata | 4 |
| 27 | `vereador Nal` | 49.24 | azul | entra pelo portão e senta no TRÂNSITO; corrente 2 completa | 4 |
| 28 | `Antônio José Moreira` | 51.44 | verde | Fazenda → cadeira grande da Controladoria | 4 |
| 29 | `Humberto Oliveira` | 54.92 | verde | Humberto, que estava na cadeira grande da Controladoria, levanta e dá lugar; corrente 3 (Fazenda → Controladoria → Gabinete) ★ vista de cima com as três correntes | 4 |
| 30 | `Humberto e Érika` | 56.72 | 2 verdes | os dois sentam lado a lado na ilha GABINETE · ASSESSORIAS | 5 |
| 31 | `Railane` | 61.04 | 5 verdes | de "Railane" a "Alecsandro": 5 arcos chegam na PROMOÇÃO SOCIAL (de Gabinete · Comunicação, Mulheres x3 e Serviços Urbanos), um por nome | 5 |
| 32 | `Caio assumiu` | 64.48 | verde | Caio muda de cadeira dentro da CONTROLADORIA, para a cadeira que era do Bruno | 5 |
| 33 | `Bruno foi` | 66.88 | verde | Controladoria → Procuradoria | 5 |
| 34 | `trocaram de lugar` | 69.70 | 2 verdes | Lindiana e Edmarcio cruzam no ar, em dois arcos que se trocam (★ o único "X" do vídeo): Gabinete · Comunicação ↔ Turismo | 5 |
| 35 | `Thaise foi` | 70.92 | verde | muda de cadeira dentro de GABINETE · COMUNICAÇÃO (jornalismo → fotografia) | 5 |
| 36 | `Antônio Cláudio` | 72.48 | verde | Casa Civil → Gabinete · Comunicação | 5 |
| 37 | `Régis` | 74.06 | 7 verdes | de "Régis" a "Filipe Levita": sequência rápida, um arco por nome, câmera alta no meio do tabuleiro | 5 |
| 38 | `Paulo Renan` | 83.66 | verde | muda de cadeira dentro de RELAÇÕES INSTITUCIONAIS; contador 25/25 | 5 |
| 39 | `Quem chegou` | 86.72 | portão ENTRADA | a fila de fora fica azul e o portão acende | 6 |
| 40 | `Além de Vinícius e Nal` | 87.44 | 2 bonecos ★ | os dois já sentados ganham o aro azul (suave, 0,4 s); contador 2/26 | 6 |
| 41 | `José Carlos` | 90.14 | 24 azuis | de "José Carlos" a "Rigerson": cada nome, um boneco sai da fila e vai para a ilha dita; o grupo do mesmo órgão sai junto e cada um senta no seu nome | 6 |
| 42 | `Rigerson` | 116.36 | último azul | contador 26/26, fila vazia, portão apaga | 6 |
| 43 | `Quem ficou de fora` (2ª vez) | 117.04 | portão SAÍDA | portão acende, calçada aparece com a placa FICARAM DE FORA | 7 |
| 44 | `Sayonara Machado` | 119.60 | 4 cinzas | de "Sayonara" a "Sonilda": os 4 secretários saem primeiro; as 4 cadeiras grandes ficam vazias | 7 |
| 45 | `Na Promoção Social, também` | 129.20 | 24 cinzas | até "Felipe Paraizo": por órgão, saem em fila pelo portão; a calçada enche em fileiras de 7; contador 28/28 | 7 |
| 46 | `não quer dizer` | 158.16 | calçada | cada boneco de fora ganha um "?" pequeno em cima (a saída pode não ser definitiva) | 8 |
| 47 | `A Saúde e os Serviços Urbanos` | 160.12 | 2 cadeiras grandes | só as duas cadeiras vazias acendem em verde com um "?" grande cada | 8 |
| 48 | `site O Tabuleiro` | 164.36 | boneco tracejado ★ | na cadeira dos Serviços Urbanos aparece um boneco **contornado, meio transparente**, placa "HERMANO FAHNING · INTERINO"; selo S4 | 8 |
| 49 | `ainda sem decreto` | 168.24 | selo | o selo S4 ganha a linha "AINDA SEM DECRETO"; o "?" da Saúde continua sozinho | 8 |
| 50 | `Salva esse vídeo` | 169.46 | cartão de nomes | o cartão volta mostrando as três colunas; ícone de salvar | 9 |
| 51 | `para mais informações` | 173.38 | — | cartão final "@eumagnoleite" com a linha "PARA MAIS INFORMAÇÕES" | 9 |

## 2.4 Cenas com câmera

Enquadramento automático da base (alvo + tamanho + direção); a distância é só referência. A câmera nunca para.

| Cena | Trecho | Tempo (s) | Câmera (início → fim) |
|---|---|---|---|
| 1. O gancho | parágrafo 1 | 0.00 a 7.70 | de cima, ao longo do tabuleiro, Prefeitura no fundo; grua descendo de 40° para 32°, tabuleiro inteiro |
| 2. O motivo | parágrafo 2 | 7.70 a 17.82 | baixa no jornal (35°), avança para os dois bonecos na frente da Prefeitura, arco lento de lado |
| 3. A conta | parágrafo 3 | 17.82 a 33.26 | close do boneco-exemplo (44°, de lado) → recua para o pódio inteiro; no fim sobe e o placar vai para o alto |
| 4. Os secretários | parágrafo 4 | 33.26 a 56.32 | fileiras 4 e 5 de lado (de x −) a 38°, trilho acompanhando a corrente da esquerda para a direita; termina de cima nas três correntes |
| 5. Trocaram de cadeira | parágrafo 5 | 56.32 a 86.32 | sobe para a vista do tabuleiro todo, ao longo (de z +), 42°; pequenos avanços para cada órgão, sempre voltando para o geral nos nomes rápidos |
| 6. Chegaram | parágrafo 6 | 86.32 a 116.64 | do lado do portão de ENTRADA (de x −, 36°), olhando a fila entrar; arco lento para o centro do tabuleiro |
| 7. Ficaram de fora | parágrafo 7 | 116.64 a 157.76 | do lado do portão de SAÍDA (de x +, 36°), mostrando a calçada enchendo; grua subindo |
| 8. O detalhe | parágrafo 8 | 157.76 a 169.06 | desce na calçada dos "?" → avança para as duas cadeiras vazias (fileira 6), de frente a 30° |
| 9. Final | parágrafo 9 | 169.06 a 175.57 | sobe até a vista de cima do tabuleiro todo, devagar |

**Interface (2D):**
- Pílula no alto: "DIÁRIO OFICIAL Nº 260 · 29/10/2026".
- Placar fixo (a partir da cena 3): três contadores, cada um na cor do grupo, que somam na hora do nome.
- Cartão de nomes (cenas 4 a 7): fica embaixo, com até 6 linhas. A linha nova entra em cima e as velhas descem e apagam. Cada linha tem nome completo + nº do decreto + "de → para" (em "chegaram", só "→ para"; em "ficaram de fora", "saiu de"). A linha da pessoa que está falando fica acesa.
- Nome curto projetado sobre o boneco que se mexe (só o da vez).
- Selos de fonte (pedido da pessoa: só o Diário Oficial, e o O Tabuleiro no Hermano): S1 "DIÁRIO OFICIAL DE ILHÉUS Nº 260 · 29/10" (#7, depois fica pequeno no rodapé do cartão de nomes, com o nº do decreto de cada linha); S4 "SEGUNDO O SITE O TABULEIRO · 30/10" + "AINDA SEM DECRETO" (#46b e #46c). Os selos S2 e S3 (Ilhéus Eventos) saíram.

## 2.5 Fatos e fontes

Nomes e contas: Diário Oficial nº 260 (29/10/2026), decretos 627 a 730, conferidos um a um. Contexto do rompimento e apelidos: Ilhéus Eventos (só no fontes.md, não citado na fala). Hermano Fahning interino: O Tabuleiro (30/10/2026, 9h30), fonte única e sem confirmação oficial, por isso o boneco é tracejado e a fala diz "segundo". Detalhes em `audio/fontes.md`. Conta conferida: 25 + 28 = 53 exonerações; 25 + 26 = 51 nomeações.

## 2.6 Trilha e sons

- Trilha leve de fundo, baixa (a fala é longa e cheia de nomes).
- "tuc" de cadeira em cada boneco que senta, "passo" curto em quem sai pelo portão, "plim" baixinho em cada contador que soma. Nos trechos de nomes rápidos, só o som do contador, para não embolar.

## 2.7 Arquivos

- **Novos:** `src/videos/mudancasilheus/MudancasIlheus.tsx` (cenas, tabela de pessoas, interface), `src/videos/mudancasilheus/pecas.tsx` (Ilha, Cadeira, Cerca, Portao, Jornal, Carimbo, Calcada), `src/videos/mudancasilheus/pessoas.ts` (as 79 pessoas: nome curto, nome completo, grupo, de, para, trecho do `quando()`), `src/videos/mudancasilheus/palavras.ts`.
- **Alterado:** `src/Root.tsx` (MudancasIlheus, Guia, Limpo e a Capa).
- **Reaproveitados:** `Boneco`, `Predio`, `Placa`, `Caixa`, `Palco`, `Camera`/`enquadrar`/`cinematizar`, interface e sons da base.
- **Memória (8 GB):** são uns 80 bonecos. Só fazem sombra os que estão se mexendo; os parados usam o boneco simples. Render em partes, como sempre.

## 2.8 Origem das escolhas

- **Das regras:** uma animação por palavra-chave; câmera sempre em movimento e com enquadramento automático; mundo comprido visto ao longo; selos de fonte na hora do dado; placar fixo da "conta do vídeo"; pessoa real só como boneco genérico; nada piscando.
- **Pedido da pessoa:** a dança das cadeiras, ser didático, citar todos os nomes do site, incluir o O Tabuleiro e citar as fontes no percurso sem repetir.
- **Escolha do diretor:** as três cores e os três movimentos; a troca em câmera lenta com os carimbos EXONERADO e NOMEADO para explicar a conta; o pódio de cubinhos; as duas correntes dos secretários; o cartão de nomes para consulta; o "X" da troca entre Lindiana e Edmarcio; as cadeiras vazias com "?" no fim; o boneco tracejado do interino.

## Ajustes feitos na programação (30/10/2026)
- Os tablados ficaram a 5,6 m um do outro (e não 5), para caber a fila de quem é exonerado atrás de cada um.
- No gancho, os 53 exonerados levantam e vão para a fileira de trás do próprio tablado; as cadeiras ficam livres. Quem troca pula de lá para a cadeira nova; quem sai pula pelo portão de SAÍDA. Isso evita dois bonecos na mesma cadeira (ex.: Sayonara e Wanessa).
- O substituto senta na mesma cadeira do cargo que o decreto diz (ex.: Railane no Setor de Benefícios, que era da Bruna).
- O Diário Oficial sobe em "As trocas vieram", para não tapar Valderico e Jabes; câmera da cena 2 mais alta.
- Planos gerais mais perto (o tabuleiro ficava pequeno) e cartão de nomes 30 px acima, longe da legenda.
- Rótulos de nomes ditos juntos sobem um em cima do outro, sem se cobrir.
- Capa: "Ilhéus: 53 / exonerações. / Quem ficou / de fora?"
