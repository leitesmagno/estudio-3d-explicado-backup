# Plano de cenas: 009. mudanças em ilhéus (versão 0, rascunho de 30/10/2026)

Código `mudancasilheus` · Nome `MudancasIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

> Rascunho feito antes da narração, a pedido da pessoa. Os tempos (≈) são estimativa de 2,9 palavras por segundo. Depois da sincronia, cada tempo vira o valor certo do `palavras.ts` e o plano vai para aprovação.

## 2.1 Narração

- Roteiro aprovado: `audio/roteiro-falado.txt` (613 palavras, com as fontes ditas na fala). Duração estimada: **≈ 211 s (3 min 30 s)**.
- Texto do ElevenLabs em duas partes (o v3 aceita no máximo uns 3.000 caracteres por vez): `audio/roteiro-tags parte 1.txt` (1.959) e `audio/roteiro-tags parte 2.txt` (1.970). As duas são emendadas no preparo.
- Palavras repetidas que vão precisar de `quando()` com trecho único: "Promoção Social" (5x), "Serviços Urbanos" (4x), "Mulheres" (5x), "Controladoria" (4x), "Cultura" (4x), "Educação" (4x), "Desenvolvimento Econômico" (3x), "Relações Institucionais" (3x), "gabinete do prefeito" (2x), "Silva" (muitas). Regra: sempre o nome da pessoa junto (`quando('Simone Silva')`).

## 2.2 Ideia e mundo

**A metáfora: a dança das cadeiras na praça da Prefeitura.** A praça vira um **tabuleiro comprido** com 21 ilhas, uma por órgão citado. Cada ilha é uma plataforma baixa com a placa do órgão, uma **cadeira grande** (o secretário) e cadeiras pequenas (os outros cargos). Cada pessoa citada é um boneco sem rosto, sentado na cadeira dela. A praça tem cerca, com **portão de ENTRADA** à esquerda e **portão de SAÍDA** à direita. Fora da cerca, do lado direito, fica a **calçada "FICARAM DE FORA"**.

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
4. **Cartão de nomes** embaixo, a lista de consulta: cada nome entra numa linha quando é dito, **com o nome completo** do site e "de → para". É o que a pessoa vai pausar para ler (por isso o "salva esse vídeo").

**Protagonista:** não há "você". O fio do vídeo são **as cadeiras**: no fim, as duas cadeiras grandes vazias (Saúde e Serviços Urbanos) ficam acesas com "?".

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; 3 colunas em x = −5, 0, 5; 7 fileiras em z de −15 a 15, de 5 em 5):

| Fileira (z) | Esquerda (x −5) | Meio (x 0) | Direita (x 5) |
|---|---|---|---|
| 1 (−15) | GABINETE DO PREFEITO | CASA CIVIL | GABINETE DA VICE |
| 2 (−10) | PROCURADORIA | CONTROLADORIA | FAZENDA |
| 3 (−5) | RELAÇÕES INSTITUCIONAIS | INTERIOR | PROJETOS |
| 4 (0) | EDUCAÇÃO | MULHERES | PROMOÇÃO SOCIAL |
| 5 (5) | TRÂNSITO | MARAMATA | CULTURA |
| 6 (10) | SAÚDE | SERVIÇOS URBANOS | DESENV. ECONÔMICO |
| 7 (15) | TURISMO (EVENTOS) | COMUNICAÇÃO | INFRAESTRUTURA |

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

**Assentos de origem das pessoas sem órgão claro no site:** quem vem de "Assessoria de Gabinete" sem dizer de qual (Caio Nobre, Érika Tabosa) começa na ilha GABINETE DO PREFEITO; Thaise Vieira, Railane Santos e Lindiana Rocha começam em COMUNICAÇÃO (publicidade, jornalismo e mídias); Roque Matos e Paulo Renan começam em RELAÇÕES INSTITUCIONAIS (o site põe Associações Comunitárias e Articulação Social lá). O cartão de nomes sempre mostra o cargo exato do site, então a escolha da ilha só afeta o desenho.

**Regras visuais deste vídeo**
- **Neutralidade.** Valderico Júnior e Jabes Ribeiro aparecem só na cena 2, como dois bonecos iguais, da mesma cor, com placa de nome. Quem fica de fora não é "culpado": cinza é só "sem cadeira nesta edição".
- Nenhum boneco tem rosto, e todos têm o mesmo corpo. O que muda é só a cor do grupo.
- Sem logo de partido, prefeitura ou jornal. Tudo é texto escrito na fonte do perfil.
- O acento verde só aparece na troca de cadeira e nas duas cadeiras vazias do fim.
- Nada pisca: carimbos e cores mudam em 0,4 s.

## 2.3 Mapa de palavras-chave

Tempos ≈ estimados. ★ = extra sugerido pelo diretor.

| # | Palavra (quando) | Tempo ≈ | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `cinquenta e três` | 1 | todas as cadeiras | os 53 bonecos que vão se mexer levantam juntos; número 53 gigante na tela | 1 |
| 2 | `Quem saiu` | 4 | portão SAÍDA | chip "QUEM SAIU?" com seta para o portão | 1 |
| 3 | `Quem entrou` | 5 | portão ENTRADA | chip "QUEM ENTROU?" | 1 |
| 4 | `ficou de fora` | 6 | calçada | chip "QUEM FICOU DE FORA?" | 1 |
| 5 | `todos os nomes` ★ | 7 | cartão de nomes | o cartão abre vazio e rola rápido (só um borrão de linhas) | 1 |
| 6 | `Diário Oficial` | 9 | Jornal gigante | o jornal desdobra no chão da praça | 2 |
| 7 | `duzentos e sessenta` | 12 | Jornal | o número 260 sobe da página; selo DIÁRIO OFICIAL Nº 260 · 29/10/2026 | 2 |
| 8 | `rompimento político` | 15 | dois bonecos | os dois bonecos lado a lado se afastam; uma linha fina se abre no chão entre eles | 2 |
| 9 | `Valderico Júnior` | 17 | boneco 1 | placa "VALDERICO JÚNIOR · PREFEITO" | 2 |
| 10 | `Jabes Ribeiro` | 19 | boneco 2 | placa "JABES RIBEIRO · EX-PREFEITO · PP" | 2 |
| 11 | `uma conta` | 22 | pódio | a câmera desce até o pódio de blocos | 3 |
| 11b | `site Ilhéus Eventos` | 24 | selo | selo S2 "LEVANTAMENTO DO ILHÉUS EVENTOS"; o mesmo nome fica escrito pequeno no rodapé do cartão de nomes até o fim da cena 7 (a fonte da lista toda, sem repetir na fala) | 3 |
| 12 | `cinquenta e três exonerações` | 24 | pilha 53 | 53 cubinhos caem e formam a pilha EXONERAÇÕES | 3 |
| 13 | `cinquenta e uma nomeações` | 27 | pilha 51 | 51 cubinhos formam a pilha NOMEAÇÕES | 3 |
| 14 | `trocou de cadeira` | 30 | boneco-exemplo | um boneco levanta de uma cadeira e anda em arco até outra (câmera lenta) | 3 |
| 15 | `exonerado do antigo` | 32 | cadeira antiga | carimbo EXONERADO na cadeira de onde ele saiu | 3 |
| 16 | `nomeado no novo` | 34 | cadeira nova | carimbo NOMEADO na cadeira onde ele sentou | 3 |
| 17 | `três grupos` | 35 | pilhas | as duas pilhas se pintam: os cubinhos verdes descem para a base das duas | 3 |
| 18 | `vinte e cinco trocaram` | 36 | 25 verdes | 25 cubinhos verdes acendem nas duas pilhas ao mesmo tempo (são as mesmas pessoas) | 3 |
| 19 | `vinte e seis chegaram` | 38 | 26 azuis | o topo da pilha NOMEAÇÕES fica azul | 3 |
| 20 | `vinte e oito ficaram` | 40 | 28 cinzas | o topo da pilha EXONERAÇÕES fica cinza; as três etiquetas viram o placar fixo no alto | 3 |
| 21 | `secretários` | 41 | cadeiras grandes | todas as cadeiras grandes ganham um aro claro | 4 |
| 22 | `Vinícius Ibrann` | 43 | azul | entra pelo portão e senta na cadeira grande da EDUCAÇÃO (ela já estava vazia porque a Evani levanta antes, em #23) | 4 |
| 23 | `Evani Cavalcante` | 45 | verde | Educação → Mulheres | 4 |
| 24 | `Wanessa Gedeon` | 48 | verde | Mulheres → Promoção Social; corrente 1 completa (setas acesas na fileira 4) | 4 |
| 25 | `Davidson Santos` | 52 | verde | Maramata → Cultura | 4 |
| 26 | `Fabrício Nascimento` | 55 | verde | Trânsito → Maramata | 4 |
| 27 | `vereador Nal` | 58 | azul | entra pelo portão e senta no TRÂNSITO; corrente 2 completa | 4 |
| 28 | `Antônio José Moreira` | 60 | verde | Fazenda → Controladoria | 4 |
| 29 | `Fazenda` ★ | 62 | as duas correntes | vista de cima com as duas linhas de setas lado a lado | 4 |
| 30 | `Railane Santos` … `Alecsandro Ferreira` | 66 a 72 | 5 verdes | 5 arcos chegam na PROMOÇÃO SOCIAL, de COMUNICAÇÃO, MULHERES (3) e SERVIÇOS URBANOS, um por nome | 5 |
| 31 | `Humberto Oliveira` | 74 | verde | Controladoria → Gabinete do Prefeito | 5 |
| 32 | `Érika Tabosa` | 77 | verde | anda junto, na cadeira ao lado | 5 |
| 33 | `Caio Nobre` | 81 | verde | Gabinete → Controladoria | 5 |
| 34 | `Bruno Rosário` | 83 | verde | Controladoria → Procuradoria | 5 |
| 35 | `trocaram de lugar` | 88 | 2 verdes | Lindiana e Edmarcio cruzam no ar, em dois arcos que se trocam (★ o único "X" do vídeo) | 5 |
| 36 | `Thaise Vieira` / `Antônio Prucoli` | 91 / 93 | 2 verdes | fotografia (dentro de COMUNICAÇÃO) e Casa Civil → Comunicação | 5 |
| 37 | `Régis Leite` … `Filipe Levita` | 95 a 105 | 7 verdes | sequência rápida, um arco por nome, câmera alta parada no meio do tabuleiro; contador chega a 25/25 | 5 |
| 38 | `quem chegou` | 106 | portão ENTRADA | a fila de fora fica azul e o portão acende | 6 |
| 39 | `Além de Vinícius e Nal` ★ | 108 | 2 bonecos | os dois já sentados piscam o aro (suave, 0,4 s) e o contador mostra 2/26 | 6 |
| 40 | um nome por boneco (24 nomes) | 110 a 140 | 24 azuis | cada nome: um boneco sai da fila e vai para a ilha dita; em grupo do mesmo órgão, saem juntos e um a um sentam no nome | 6 |
| 41 | `vice-prefeita` | 141 | último azul | contador 26/26, fila vazia, portão apaga | 6 |
| 42 | `ficou de fora` (2ª vez) | 142 | portão SAÍDA | portão acende, calçada aparece com a placa FICARAM DE FORA | 7 |
| 43 | `Sayonara Machado` … `Sonilda Mello` | 145 a 150 | 4 cinzas | os 4 secretários saem primeiro; as 4 cadeiras grandes ficam vazias | 7 |
| 44 | 24 nomes de fora | 152 a 180 | 24 cinzas | por órgão, saem em fila pelo portão; a calçada enche em fileiras de 7; contador 28/28 | 7 |
| 45 | `próprio Ilhéus Eventos` / `não quer dizer` | 183 / 187 | calçada | selo S3; cada boneco de fora ganha um "?" pequeno em cima (a saída pode não ser definitiva) | 8 |
| 46 | `a Saúde e os Serviços Urbanos` | 191 | 2 cadeiras grandes | só as duas cadeiras vazias acendem em verde com um "?" grande cada | 8 |
| 46b | `site O Tabuleiro` | 194 | boneco tracejado ★ | na cadeira dos Serviços Urbanos aparece um boneco **contornado, meio transparente** ("provisório"), placa "HERMANO FAHNING · INTERINO"; selo S4 | 8 |
| 46c | `sem confirmação oficial` | 198 | selo | o selo S4 ganha a linha "SEM CONFIRMAÇÃO OFICIAL"; o "?" da Saúde continua sozinho | 8 |
| 47 | `Salva esse vídeo` | 202 | cartão de nomes | o cartão volta mostrando as três colunas; ícone de salvar | 9 |
| 48 | `arroba eu magno leite` | 206 | — | cartão final @eumagnoleite | 9 |

## 2.4 Cenas com câmera

Enquadramento automático da base (alvo + tamanho + direção); a distância é só referência. A câmera nunca para.

| Cena | Trecho | Tempo ≈ | Câmera (início → fim) |
|---|---|---|---|
| 1. O gancho | parágrafo 1 | 0 a 9 | de cima, ao longo do tabuleiro, Prefeitura no fundo; grua descendo de 40° para 32°, tabuleiro inteiro |
| 2. O motivo | parágrafo 2 | 9 a 21 | baixa no jornal (35°), avança para os dois bonecos na frente da Prefeitura, arco lento de lado |
| 3. A conta | parágrafo 3 | 21 a 40 | close do boneco-exemplo (44°, de lado) → recua para o pódio inteiro; no fim sobe e o placar vai para o alto |
| 4. Os secretários | parágrafo 4 | 40 a 63 | fileiras 4 e 5 de lado (de x −) a 38°, trilho acompanhando a corrente da esquerda para a direita; termina de cima nas duas correntes |
| 5. Trocaram de cadeira | parágrafo 5 | 63 a 106 | sobe para a vista do tabuleiro todo, ao longo (de z +), 42°; pequenos avanços para cada órgão, sempre voltando para o geral nos nomes rápidos |
| 6. Chegaram | parágrafo 6 | 106 a 142 | do lado do portão de ENTRADA (de x −, 36°), olhando a fila entrar; arco lento para o centro do tabuleiro |
| 7. Ficaram de fora | parágrafo 7 | 142 a 181 | do lado do portão de SAÍDA (de x +, 36°), mostrando a calçada enchendo; grua subindo |
| 8. O detalhe | parágrafo 8 | 181 a 202 | desce na calçada dos "?" → avança para as duas cadeiras vazias (fileira 6), de frente a 30° |
| 9. Final | parágrafo 9 | 202 a 211 | sobe até a vista de cima do tabuleiro todo, devagar |

**Interface (2D):**
- Pílula no alto: "DIÁRIO OFICIAL Nº 260 · 29/10/2026".
- Placar fixo (a partir da cena 3): três contadores, cada um na cor do grupo, que somam na hora do nome.
- Cartão de nomes (cenas 4 a 7): fica embaixo, com até 6 linhas. A linha nova entra em cima e as velhas descem e apagam. Cada linha tem nome completo + "de → para" (em "chegaram", só "→ para"; em "ficaram de fora", "saiu de"). A linha da pessoa que está falando fica acesa.
- Nome curto projetado sobre o boneco que se mexe (só o da vez).
- Selos de fonte, um por fonte e só quando ela é dita (sem repetir): S1 "DIÁRIO OFICIAL DE ILHÉUS Nº 260 · 29/10" (#7), S2 "LEVANTAMENTO DO ILHÉUS EVENTOS" (#11b, depois fica pequeno no rodapé do cartão de nomes), S3 "OBSERVAÇÃO DO ILHÉUS EVENTOS" (#45), S4 "SEGUNDO O SITE O TABULEIRO · 30/10" + "SEM CONFIRMAÇÃO OFICIAL" (#46b e #46c).

## 2.5 Fatos e fontes

Nomes e contas: Ilhéus Eventos (30/10/2026), sobre o Diário Oficial nº 260 (29/10/2026). Hermano Fahning interino: O Tabuleiro (30/10/2026, 9h30), fonte única e sem confirmação oficial, por isso o boneco é tracejado e a fala diz "segundo". Detalhes em `audio/fontes.md`. Conta conferida: 25 + 28 = 53 exonerações; 25 + 26 = 51 nomeações.

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
