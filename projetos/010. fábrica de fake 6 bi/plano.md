# Plano de cenas: 010. fábrica de fake 6 bi (versão 1, aprovada em 31/10/2026)

Código `fabricafake` · Nome `FabricaFake` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Lendário (ElevenLabs v3) · preparo: 1,2x, pausas de no máximo 0,35 s, volume -15 · duração **105,41 s** · `AUDIO_SEG = 105.41` · `QUADROS = 3189` (com 0,9 s de folga).
- 281 palavras; a última ("informações.") termina em 104,92 s. Sem buraco maior que 1,5 s, sem palavra fora de ordem. A voz leu o roteiro inteiro, sem pular nem repetir.
- Ajustes da sincronia: valores que o Whisper quebrou em pedaços foram juntados ("R" + "$", "4" + ",4", "1" + ",3", "5" + ",2", "4" + ",7"); "arroba eu magno leite" → `@eumagnoleite`. Cópia do original em `transcricao/palavras-original.json`.
- A duração passou da faixa de 55 a 95 s (deu 105 s). O 009 teve 175 s e funcionou, então seguimos.

**Palavras repetidas** (o `quando()` certo para cada uma):

| Palavra | Ocorrências | Como chamar |
|---|---|---|
| fábrica | 0,74 · 82,92 | `quando('fabrica')` · `quando('senao a fabrica')` |
| reportagem | 4,74 · 24,88 | `quando('reportagem velha')` · `quando('a reportagem e')` |
| julho de 2024 | 5,94 · 26,36 | `quando('julho')` · `quando('31 de julho')` |
| Saúde | 15,30 · 33,72 · 86,80 · 90,02 · 94,76 | `quando('Saude e Educacao')` · `quando('Da Saude')` · `quando('por na Saude')` · `quando('propria Saude')` · `quando('a Saude ficou')` |
| Educação | 16,08 · 36,68 | `quando('e Educacao')` · `quando('Da Educacao')` |
| quase 6 bilhões | 13,54 · 40,50 | `quando('cortar quase')` · `quando('os quase')` |
| orçamento | 31,32 · 46,84 | `quando('do orcamento')` · `quando('no orcamento')` |
| governo | 29,30 · 53,68 | `quando('governo segurou')` · `quando('governo remanejou')` |
| Segundo | 23,06 · 75,46 | `quando('Segundo a checagem')` · `quando('Segundo o ICL')` |
| militares | 74,16 · 85,82 | `quando('dos militares da')` · `quando('tiraram dos militares')` |
| remédios | 65,32 · 88,10 | `quando('para remedios')` · `quando('dos remedios')` |
| data | 8,96 · 99,14 | `quando('esconde a data')` · `quando('procura a data')` |
| Passo | 3,56 · 7,46 · 9,54 · 16,84 | `quando('Passo um')`, `'Passo dois'`, `'Passo tres'`, `'Passo quatro'` |

## 2.2 Ideia e mundo

**A metáfora: uma fábrica de brinquedo vista em corte, como uma casa de bonecas aberta, com duas alas lado a lado.** À esquerda fica a **FÁBRICA DE FAKE**: um galpão escuro com chaminé, engrenagens e uma esteira com 4 máquinas numeradas, uma para cada passo do roteiro. Pela esteira passa uma TV velha, e cada máquina faz uma coisa com ela: pega, apaga a data, carimba o título e dispara. Atrás da fábrica fica a **planície de celulares**, que são as redes sociais. À direita fica a **CHECAGEM**: uma sala clara e verde, com uma lupa gigante num braço mecânico, a mesa do Diário Oficial, os tanques para onde o dinheiro vai e a prateleira dos órgãos de onde ele saiu. O vídeo vai da esquerda para a direita (da mentira para a checagem) e, na virada, a câmera volta à fábrica para impedir a segunda fake.

**Protagonista:** a **TV velha** com a etiqueta da data. Ela nasce na fábrica, perde a data, ganha o título falso, é checada, recupera a data e fecha o vídeo em close.

**Placar e selos de fonte:**

| Selo | Entra em | Texto |
|---|---|---|
| Fonte da checagem | `Segundo a checagem` (23,06) | SEGUNDO O AOS FATOS · 27/10/2026 |
| Documento oficial | `Diario Oficial` (51,44) | DIÁRIO OFICIAL DA UNIÃO · PORTARIA Nº 485 |
| Fonte do salário | `Segundo o ICL` (75,46) | SEGUNDO O ICL NOTÍCIAS |
| Conta própria | `No saldo` (93,78) | CONTA FEITA COM OS NÚMEROS DO DIÁRIO OFICIAL |
| Texto da fake | `Gravissimo` (11,44) | TEXTO DO POST (o cartaz sempre leva este rótulo) |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| Fundo e névoa | `tema.fundo` |
| Chão, piso das duas alas | `tema.chao` (fábrica com `tom(tema.chao, -0.15)`, checagem com `tom(tema.chao, 0.12)`) |
| Máquinas, esteira, prateleira | `tema.objeto` e `tema.objetoEscuro` |
| **A fake** (cartaz, fumaça, luz da fábrica, celulares acesos) | **laranja do tema base**, `ESCURO.acento` (lido de `base/tema`, sem cor escrita no código) |
| **A checagem e o que é verdade** (lupa, data recuperada, tanques, selo) | **`tema.acento`** (verde) |
| Dinheiro (blocos de R$ 1 bi) | `tema.objetoClaro` |
| Bonecos operários e militares | `tema.pessoa` (sem rosto) |
| Saldo negativo da Saúde | `tema.objeto` (cinza; nada de vermelho de alarme) |

**Mapa do mundo** (1 unidade = 1 m; chão em y = 0; frente em z+):

| Lugar / peça | Posição [x, y, z] | Observação |
|---|---|---|
| Galpão da FÁBRICA (`Galpao`, peça nova) | centro [−6,5, 0, 0], 11 × 8 m | piso, parede do fundo (z −4) com 5 m de altura, meia parede lateral, sem teto (casa de bonecas) |
| Letreiro FÁBRICA DE FAKE (`Placa`) | [−6,5, 4,4, −3,9] | acende em laranja no gancho, apaga no fim |
| Chaminé (`Chamine`, catálogo) | [−11, 0, −3,2], alt 8 | fumaça cinza em bolinhas lentas, para quando a esteira para |
| Engrenagens (`Engrenagem`, catálogo) | 3 na parede do fundo, x −9, −6,5, −4 | giram com a esteira |
| Esteira (`EsteiraOitoHoras`, catálogo) | [−6,5, 0, 0,6], comp 10 | anda para a direita; anda de ré na cena 3 |
| Máquina 1: arquivo + garra (`Arquivo` e `Garra`, peças novas) | arquivo [−11,3, 0, −1,6] · garra x −10 | estante com TVs velhas empilhadas; garra num trilho |
| Máquina 2: borracha (`Borracha`, peça nova) | x −8 | borracha gigante num braço que desce |
| Máquina 3: prensa (`Prensa`, peça nova) | x −5,5 | prensa com carimbo que desce e levanta o cartaz |
| Máquina 4: canhão (`Canhao`, peça nova) | x −2,6, apontado para trás e para cima | dispara cópias do cartaz |
| Placas 1-2-3-4 das máquinas (`Placa`) | em cima de cada máquina, y 3 | acendem uma a uma |
| TV velha (`TVVelha`, peça nova) | anda na esteira, y 0,9 | tela "TELEJORNAL" genérica, etiqueta "31 JUL 2024" na frente |
| Cartaz da fake (`CartazFake`, peça nova) | preso em cima da TV | laranja, 4 linhas que entram uma por vez; rótulo TEXTO DO POST |
| Planície de celulares (`CampoCelulares`, catálogo) | grupo em [−6, 0, −24] | celulares acendem em onda laranja |
| Operários (`Boneco`) | 3, em [−9, 0, 2,4], [−6, 0, 2,4], [−3,5, 0, 2,4] | cinza, sem rosto; olham para a esteira |
| Sala da CHECAGEM (`Galpao` claro) | centro [7, 0, −1], 12 × 10 m | piso claro, faixa verde no chão, parede baixa |
| Mesa da lupa + braço (`Lupa`, catálogo, num `BracoLupa` novo) | mesa [3, 0, 0,8] | a lupa desce sobre a TV; na virada ela gira até a prensa |
| Calendário (`CalendarioGrande`, catálogo) | [1,8, 0, −1,4] | "JUL 2024", troca para "OUT 2026" |
| Pilha de 15 blocos (`BlocoBi`, peça nova) | [5,6, 0, 1,8] | 1 bloco = R$ 1 bi; a fatia de 0,4 e a de 0,3 são blocos finos |
| Cofre (`CofreFGTS`, catálogo) | [8, 0, 2,2] | porta abre e fecha, cadeado trava e destrava |
| Ampulheta (`Ampulheta`, catálogo) | em cima do cofre | escorre devagar (temporário) |
| Mesa do Diário + Diário (`DiarioOficial`, catálogo) | [6,5, 0, −2,6], escala 3 | placa "PORTARIA Nº 485 · 28/10/2026" |
| Tanque BPC (`Tanque`, peça nova: cilindro de vidro com nível) | [11, 0, −2], Ø 1,8, alt 3,2 | enche até 91% (4,7 de 5,2) |
| Tanque REMÉDIOS SUS (`Tanque`) | [9,2, 0, −0,6], Ø 0,9, alt 1,4 | caixinhas de remédio sem marca e sem cruz caem dentro |
| Cartão de benefício (`CartaoBeneficio`, catálogo) + boneco | [12,4, 0, −0,4] | ao lado do tanque BPC |
| Canos (`CanoMoedas`, catálogo) | do Diário aos tanques; da prateleira ao Diário | líquido/moedas correm na hora da fala |
| Prateleira dos órgãos (`Prateleira` + `CaixaOrgao`, peças novas) | [7, 0, −6,5], 3 andares × 8 caixas | 22 caixas com nome curto (DEFESA, SAÚDE, EDUCAÇÃO, ENERGIA, FAZENDA...); 2 vagas vazias |
| Contracheque (`Contracheque`, catálogo) | [4,4, 0, −4] | aparece na fala do salário |
| Folha AUTORIZAÇÃO DE GASTO (`Documento`, catálogo) + carimbo (`Carimbo3DIntimacao`) | [5,4, 1,2, −4] | carimbo CANCELADA |
| Balança (`Balanca`, catálogo) | [4,2, 0, 2,8] | prato SAIU 450 / prato ENTROU 388 |
| Celular grande do fim (`Celular`, escala 9) | [−1, 1,6, 4] | a fake em cinza com carimbo É DE 2024 |

**Regras visuais deste vídeo:**
- Laranja só na fake, verde só na checagem e no que é verdade. Um olhar e a pessoa sabe de que lado está.
- O nome "Lula" só aparece **escrito no cartaz**, sempre com o rótulo TEXTO DO POST. Nenhum boneco representa político.
- Sem logo de emissora nem do Aos Fatos ou do ICL: os nomes vão escritos nos selos, na fonte do perfil.
- Sem cruz vermelha nos remédios e sem símbolo de acessibilidade: caixinhas com a palavra REMÉDIO e um cartão genérico.
- O dinheiro "segurado" nunca vai para o lixo nem some: fica visível no cofre.
- A fábrica nunca explode, nada pisca. A prensa travando é só parar no meio e ficar cinza.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Isso aqui` | 0,00 | Fábrica toda | Já montada; câmera alta descendo pela chaminé, fumaça subindo | 1 |
| 2 | `fabrica` | 0,74 | Letreiro | FÁBRICA DE FAKE acende em laranja (0,5 s) | 1 |
| 3 | `fake news` | 1,36 | Engrenagens | Começam a girar | 1 |
| 4 | `Olha` | 2,08 | Esteira | Começa a andar; câmera desce para o plano lateral | 1 |
| 5 | `trabalha` | 2,78 | Placas 1 a 4 | Acendem uma a uma (0,15 s entre elas) ★ | 1 |
| 6 | `Passo um` | 3,56 | Placa 1 | Fica acesa forte; chip PASSO 1 | 2 |
| 7 | `pega` | 4,40 | Garra | Desce até o arquivo | 2 |
| 8 | `reportagem velha` | 4,74 | TV velha | Garra levanta a TV (poeirinha ★) e põe na esteira | 2 |
| 9 | `julho` | 5,94 | Etiqueta da TV | "31 JUL 2024" acende; chip JUL 2024 | 2 |
| 10 | `Passo dois` | 7,46 | Esteira, placa 2 | TV anda até a borracha | 2 |
| 11 | `esconde` | 8,40 | Borracha | Desce sobre a etiqueta | 2 |
| 12 | `esconde a data` | 8,96 | Etiqueta | Some em 0,5 s, vira um borrão cinza | 2 |
| 13 | `Passo tres` | 9,54 | Esteira, placa 3 | TV anda até a prensa | 2 |
| 14 | `escreve` | 10,34 | Prensa | Desce (baque) | 2 |
| 15 | `Gravissimo` | 11,44 | Cartaz da fake | Levanta preso na TV com "GRAVÍSSIMO!"; `Exclama` laranja pula ao lado ★; rótulo TEXTO DO POST | 2 |
| 16 | `Lula acaba` | 12,50 | Cartaz | Linha 2: "LULA ACABA DE CORTAR" | 2 |
| 17 | `cortar quase` | 13,54 | Cartaz | Linha 3: "QUASE R$ 6 BILHÕES" (maior) | 2 |
| 18 | `Saude e Educacao` | 15,30 | Cartaz | Linha 4: "DA SAÚDE E EDUCAÇÃO" | 2 |
| 19 | `Passo quatro` | 16,84 | Esteira, placa 4 | TV com cartaz chega ao canhão | 2 |
| 20 | `espalha` | 17,82 | Canhão | Dispara 12 cópias do cartaz em arco para a planície (whoosh); câmera sobe e olha para trás | 2 |
| 21 | `Essa passou` | 18,58 | Planície de celulares | Celulares acendem em onda laranja | 2 |
| 22 | `154 mil` | 19,28 | Contador 2D | "154 MIL" sobe de 0 (subida) | 2 |
| 23 | `compartilhamentos` | 20,54 | Ícones | Setas de compartilhar (`IconeSeta`) saem dos celulares ★; rótulo COMPARTILHAMENTOS | 2 |
| 24 | `Agora vamos` | 21,56 | Fábrica | Engrenagens freiam, luz laranja baixa; ala da checagem acende | 3 |
| 25 | `desmontar` | 22,24 | Esteira | Anda de ré; a garra passa a TV para a mesa da lupa; câmera vai para a direita | 3 |
| 26 | `Segundo a checagem` | 23,06 | Selo | SEGUNDO O AOS FATOS · 27/10/2026 | 3 |
| 27 | `Aos Fatos` | 24,00 | Lupa | Desce sobre a TV | 3 |
| 28 | `a reportagem e` | 24,88 | Etiqueta | O borrão se desfaz debaixo da lente | 3 |
| 29 | `31 de julho` | 25,70 | Etiqueta | "31 JUL 2024" volta, grande e em verde (ding); chip É DE 2024 | 3 |
| 30 | `Naquela epoca` | 28,20 | Calendário | Nasce com "JUL 2024" ★ | 3 |
| 31 | `governo segurou` | 29,30 | Pilha de blocos | 15 blocos nascem um sobre o outro (pops rápidos) | 3 |
| 32 | `15 bilhoes` | 29,94 | Etiqueta 3D | "R$ 15 BI · ORÇAMENTO 2024" | 3 |
| 33 | `regra fiscal` | 32,66 | Linha no chão | `LinhaLimite` desenha um retângulo em volta da pilha: REGRA FISCAL ★ | 3 |
| 34 | `Da Saude` | 33,52 | Blocos | 4 blocos e uma fatia de 0,4 deslizam para o lado com a etiqueta SAÚDE | 3 |
| 35 | `4,4` | 34,40 | Chip | SAÚDE · R$ 4,4 BI | 3 |
| 36 | `Da Educacao` | 36,50 | Blocos | 1 bloco e uma fatia de 0,3 deslizam com a etiqueta EDUCAÇÃO | 3 |
| 37 | `1,3` | 38,17 | Chip | EDUCAÇÃO · R$ 1,3 BI | 3 |
| 38 | `Somando` | 39,58 | Blocos | Os dois grupos se juntam numa pilha só | 3 |
| 39 | `os quase` | 40,50 | Contador + cartaz | "R$ 5,7 BI" ao lado do cartaz "QUASE R$ 6 BI" (pequeno), ligados por um arco pontilhado (`ArcoPontos`) | 3 |
| 40 | `E repara` | 41,98 | Câmera | Aproxima da pilha de 5,7 | 4 |
| 41 | `segurar` | 42,98 | Cofre | Nasce ao lado, porta abre | 4 |
| 42 | `nao e cortar` | 43,50 | Chips 2D | CORTAR riscado; SEGURAR em verde | 4 |
| 43 | `bloqueio` | 44,62 | Blocos + cofre | Blocos entram no cofre, porta fecha, cadeado trava (tique); placa BLOQUEIO TEMPORÁRIO | 4 |
| 44 | `temporario` | 44,98 | Ampulheta | Nasce em cima do cofre e começa a escorrer ★ | 4 |
| 45 | `continua` | 46,24 | Cofre | Porta entreaberta (0,15): blocos visíveis e acesos lá dentro; chip CONTINUA NO ORÇAMENTO | 4 |
| 46 | `liberado` | 48,02 | Cadeado | Destrava e a porta abre um pouco mais (ding suave) | 4 |
| 47 | `E o que aconteceu` | 49,06 | Câmera | Vira para a mesa do Diário (whoosh) | 5 |
| 48 | `nesta semana` | 50,26 | Calendário | Folha vira para "OUT 2026" ★ | 5 |
| 49 | `Diario Oficial` | 51,44 | Diário | Desce na mesa; selo DIÁRIO OFICIAL DA UNIÃO | 5 |
| 50 | `28 de outubro` | 52,30 | Placa | "PORTARIA Nº 485 · 28/10/2026" sobe do Diário | 5 |
| 51 | `remanejou` | 53,94 | Setas | `SetasTroca` giram sobre o Diário ★ | 5 |
| 52 | `5,2` | 54,52 | Contador 2D | R$ 5,2 BI · REMANEJADOS | 5 |
| 53 | `Quase tudo` | 56,20 | Cano grosso | Sai do Diário até o tanque BPC | 5 |
| 54 | `4,7` | 57,82 | Tanque BPC | Enche até 91% (subida); chip R$ 4,7 BI | 5 |
| 55 | `BPC` | 59,88 | Placa do tanque | "BPC" acende em verde | 5 |
| 56 | `pessoas com deficiencia` | 61,48 | Cartão + boneco | `CartaoBeneficio` e um boneco ao lado; etiqueta BENEFÍCIO DE PESSOAS COM DEFICIÊNCIA | 5 |
| 57 | `E R$ 388` | 63,00 | Cano fino | Liga o Diário ao tanque pequeno | 5 |
| 58 | `388` | 63,28 | Tanque REMÉDIOS | Enche; chip R$ 388 MI | 5 |
| 59 | `remedios do SUS` | 65,32 | Caixinhas | 6 caixinhas REMÉDIO caem no tanque; placa REMÉDIOS · SUS | 5 |
| 60 | `De onde saiu` | 66,50 | Câmera | Recua e sobe, mostra a prateleira atrás | 6 |
| 61 | `mais de vinte` | 67,70 | Prateleira | 22 caixas acendem em onda (pops); chip 22 ÓRGÃOS | 6 |
| 62 | `orgaos` | 68,38 | Canos finos | Moedas correm de cada caixa até o Diário | 6 |
| 63 | `Um deles` | 69,16 | Prateleira | Todas apagam, menos uma | 6 |
| 64 | `Defesa` | 69,82 | Caixa DEFESA | Acende em verde e avança para a frente; câmera aproxima | 6 |
| 65 | `226` | 70,58 | Etiqueta | DEFESA · R$ 226 MI | 6 |
| 66 | `sendo R$ 108` | 72,38 | Caixa DEFESA | Abre em duas partes; a parte de R$ 108 MI fica marcada | 6 |
| 67 | `dos militares da` | 74,16 | Bonecos | 3 bonecos genéricos com quepe simples, sem farda real ★; rótulo MILITARES DA ATIVA. Outra parte: RESERVA DA DEFESA E OUTROS | 6 |
| 68 | `Segundo o ICL` | 75,46 | Selo | SEGUNDO O ICL NOTÍCIAS | 6 |
| 69 | `nao reduz salario` | 77,70 | Contracheque | Aparece ao lado dos bonecos e fica igual; chip SALÁRIO NÃO MUDA ★ | 6 |
| 70 | `autorizacao de gasto` | 79,16 | Documento | Folha AUTORIZAÇÃO DE GASTO aparece | 6 |
| 71 | `cancelada` | 80,46 | Carimbo | Bate CANCELADA na folha (impacto) | 6 |
| 72 | `Agora segura` | 81,28 | Câmera | Gira de volta para a fábrica (whoosh); luz laranja volta | 7 |
| 73 | `senao a fabrica` | 82,50 | Esteira | Volta a andar; prensa sobe | 7 |
| 74 | `outra fake` | 83,48 | Prensa | Começa a carimbar um cartaz novo: "TIRARAM DOS MILITARES PRA SAÚDE" (rótulo TEXTO DA PRÓXIMA FAKE) | 7 |
| 75 | `Nao da` | 84,08 | Lupa + prensa | A lupa vira até a prensa; a prensa trava no meio (baque baixo), engrenagens param, cartaz fica cinza | 7 |
| 76 | `tiraram dos militares` | 85,34 | Arco pontilhado | Sai da caixa DEFESA em direção à caixa SAÚDE | 7 |
| 77 | `por na Saude` | 86,52 | X | O arco para no meio e ganha um `XMarca` cinza | 7 |
| 78 | `dos remedios` | 87,64 | Câmera | Volta para a checagem, tanque REMÉDIOS em foco | 7 |
| 79 | `propria Saude` | 89,68 | Caixa SAÚDE | Acende na prateleira e avança; o cano dela até o Diário brilha | 7 |
| 80 | `cedeu` | 90,86 | Cano | Moedas saem da caixa SAÚDE; etiqueta SAÚDE CEDEU · R$ 450 MI | 7 |
| 81 | `outras contas` | 92,82 | Chips | 3 CONTAS DA SAÚDE (remédios, unidades especializadas, atenção primária) ★ | 7 |
| 82 | `No saldo` | 93,78 | Balança | Nasce: prato SAIU R$ 450 MI, prato ENTROU R$ 388 MI; selo CONTA FEITA COM OS NÚMEROS DO DIÁRIO OFICIAL | 7 |
| 83 | `a Saude ficou` | 94,76 | Balança | Pende para SAIU | 7 |
| 84 | `62` | 95,50 | Contador 2D | "− R$ 62 MI" em cinza claro | 7 |
| 85 | `Antes de compartilhar` | 97,32 | Câmera | Volta à TV, close | 8 |
| 86 | `procura a data` | 98,58 | Lupa + etiqueta | A lupa passa na frente da etiqueta "31 JUL 2024", que brilha em verde (ding) | 8 |
| 87 | `Voce ja recebeu` | 99,60 | Celular grande | Sobe com a fake em cinza e o carimbo É DE 2024 ★ | 8 |
| 88 | `comentarios` | 101,52 | Ícone | Balão de comentário (`IconeBalao`) pop | 8 |
| 89 | `E segue` | 102,26 | Letreiro | FÁBRICA DE FAKE apaga devagar (1 s); fumaça para | 8 |
| 90 | `@eumagnoleite` | 102,86 | Chip | @eumagnoleite em verde | 8 |
| 91 | `informacoes` | 104,54 | Câmera | Sobe devagar até o fim | 8 |

91 eventos em 105 s (0,9 por segundo).

## 2.4 Cenas com câmera

A câmera usa `enquadrar` + `cinematizar` (nunca parada). Posições aproximadas; o código ajusta pelo enquadramento automático.

### CENA 1: A FÁBRICA (0,00 a 3,50 s)
Abre em: início · Sai em: `quando('Passo um')` · Eventos 1 a 5
- 1a (0 a 2,1): pos [−9, 14, 6] · alvo [−8, 5, −2] · dist 13 · ângulo 55°, descendo junto da fumaça
- 1b (2,1 a 3,5): grua até pos [−6, 4,5, 13] · alvo [−6,5, 1,5, 0] · dist 13 · ângulo 15°
- Pílula: A FÁBRICA
- Aha: "isso é uma fábrica e ela tem passos"

### CENA 2: PASSO A PASSO (3,56 a 21,45 s)
Abre em: `quando('Passo um')` · Sai em: `quando('Agora vamos')` · Eventos 6 a 23
- 2a (3,56 a 9,5): acompanha a TV, pos [−9,5, 2,8, 7] → [−7,5, 2,8, 7] · alvo na TV · dist 7 · ângulo 12°
- 2b (9,5 a 16,8): prensa e cartaz, pos [−5,5, 3, 6,5] · alvo [−5,5, 2, 0,6] · dist 6,5 · ângulo 10°, avanço lento
- 2c (16,8 a 18,6): canhão, pos [−1, 3, 6] · alvo [−3, 2, 0] · dist 6
- 2d (18,6 a 21,45): grua para trás e para cima, pos [−3, 9, 4] · alvo [−6, 0, −22] · dist 26 · ângulo 22°, planície de celulares inteira
- Pílula: PASSO A PASSO
- Aha: "uma notícia velha vira fake só tirando a data e trocando o título"

### CENA 3: A CHECAGEM (21,56 a 41,90 s)
Abre em: `quando('Agora vamos')` · Sai em: `quando('E repara')` · Eventos 24 a 39
- 3a (21,56 a 24,9): travelling da fábrica para a checagem, pos [−2, 4, 9] → [3, 3,2, 7] · alvo [3, 1,2, 0,8] · dist 6,5
- 3b (24,9 a 29,2): close na lupa e na etiqueta, pos [3, 2,2, 4] · alvo [3, 1,3, 0,8] · dist 3,5 · ângulo 12°
- 3c (29,2 a 41,9): pilha de blocos e chips, pos [5, 4, 9] · alvo [5,4, 1,4, 1,8] · dist 7,5 · ângulo 25°, arco lento para a esquerda
- Pílula: A CHECAGEM
- Aha: "a reportagem é de julho de 2024, e os 6 bi são 4,4 + 1,3"

### CENA 4: NÃO É CORTE (41,98 a 48,95 s)
Abre em: `quando('E repara')` · Sai em: `quando('E o que aconteceu')` · Eventos 40 a 46
- 4a: pos [7, 3, 7,5] → [7,6, 2,6, 6] · alvo [7,4, 1, 2] · dist 5,5 · ângulo 18°, avanço lento até o cofre
- Pílula: NÃO É CORTE
- Aha: "o dinheiro foi segurado, não sumiu"

### CENA 5: O QUE É VERDADE (49,06 a 66,30 s)
Abre em: `quando('E o que aconteceu')` · Sai em: `quando('De onde saiu')` · Eventos 47 a 59
- 5a (49,06 a 56,2): Diário na mesa, pos [6, 4,5, 4] · alvo [6,5, 0,8, −2,6] · dist 7,5 · ângulo 32°
- 5b (56,2 a 66,3): tanques, pos [9,5, 4, 6] · alvo [10, 1,4, −1,4] · dist 8 · ângulo 20°, arco para a direita
- Pílula: O QUE É VERDADE
- Aha: "o dinheiro foi quase todo para o BPC"

### CENA 6: DE ONDE SAIU (66,50 a 81,10 s)
Abre em: `quando('De onde saiu')` · Sai em: `quando('Agora segura')` · Eventos 60 a 71
- 6a (66,5 a 69,8): plano aberto da prateleira, pos [7, 6, 6] · alvo [7, 1,8, −6] · dist 12 · ângulo 22°
- 6b (69,8 a 81,1): caixa DEFESA, bonecos e folha, pos [5,6, 3, 0] · alvo [5,4, 1,4, −4,6] · dist 5,5 · ângulo 18°, avanço lento
- Pílula: DE ONDE SAIU
- Aha: "a Defesa foi uma das fontes, e não é corte de salário"

### CENA 7: OUTRA FAKE? (81,28 a 97,10 s)
Abre em: `quando('Agora segura')` · Sai em: `quando('Antes de compartilhar')` · Eventos 72 a 84
- 7a (81,28 a 87,4): plano geral das duas alas, pos [0, 9, 16] · alvo [−1, 1,5, −2] · dist 19 · ângulo 28°, prensa à esquerda e lupa entrando
- 7b (87,4 a 93,7): caixa SAÚDE e tanque REMÉDIOS, pos [8, 4, 4] · alvo [8, 1,6, −4] · dist 8,5
- 7c (93,7 a 97,1): balança em close, pos [4,2, 2,4, 7,5] · alvo [4,2, 1,1, 2,8] · dist 4,8 · ângulo 14°
- Pílula: OUTRA FAKE?
- Aha: "dizer que tiraram dos militares para a Saúde também seria fake"

### CENA 8: PROCURE A DATA (97,32 a 106,30 s)
Abre em: `quando('Antes de compartilhar')` · Sai em: fim · Eventos 85 a 91
- 8a (97,32 a 102,2): close na TV e na etiqueta, pos [3, 1,8, 3,4] · alvo [3, 1,3, 0,8] · dist 2,7
- 8b (102,2 a fim): grua sobe e recua, pos [2, 7, 12] · alvo [0, 1,5, −1] · dist 14 · ângulo 30°, as duas alas, fábrica apagando
- Pílula: PROCURE A DATA
- Aha: "antes de compartilhar, procure a data"

## 2.5 Fatos e fontes

Resumo do `audio/fontes.md` (checado em 31/10/2026):

| Fato | Fonte | Na tela |
|---|---|---|
| Texto do post, 154 mil compartilhamentos | Aos Fatos, 27/10/2026 | cartaz com TEXTO DO POST · 154 MIL |
| Reportagem de 31/07/2024, contenção de R$ 15 bi, Saúde 4,4 e Educação 1,3 | Aos Fatos | 31 JUL 2024 · R$ 15 BI · R$ 4,4 BI · R$ 1,3 BI · R$ 5,7 BI |
| Bloqueio temporário, pode ser liberado | Aos Fatos | BLOQUEIO TEMPORÁRIO · CONTINUA NO ORÇAMENTO |
| Portaria 485, DOU 28/10/2026, R$ 5,2 bi | DOU | PORTARIA Nº 485 · 28/10/2026 · R$ 5,2 BI |
| R$ 4,7 bi ao BPC, R$ 388 mi à Saúde | DOU, Anexo I | R$ 4,7 BI · R$ 388 MI |
| 22 órgãos cancelados | DOU, Anexo II | 22 ÓRGÃOS |
| Defesa R$ 226 mi, militares da ativa R$ 108 mi | DOU, Anexo II (conta própria) + ICL | R$ 226 MI · R$ 108 MI |
| Não reduz salário | ICL Notícias, 30/10/2026 | SALÁRIO NÃO MUDA |
| Saúde cedeu R$ 450 mi, saldo − R$ 62 mi | DOU, Anexos I e II (conta própria) | R$ 450 MI · R$ 388 MI · − R$ 62 MI |

**Conferir antes de publicar:** se o Aos Fatos atualizou os compartilhamentos e se o governo ou o Ministério da Saúde publicou nota sobre o remanejamento.

## 2.6 Trilha e sons

Sem trilha (o Estúdio não traz música). Efeitos do Estúdio, volume 0,25 a 0,45:

| Evento | Som |
|---|---|
| Troca de cena (eventos 4, 25, 47, 60, 72, 85) | `whoosh` |
| Pílula muda | `tique` |
| Placas das máquinas, blocos nascendo, caixas acendendo | `pop` (baixo) |
| Prensa desce (14), prensa trava (75) | `baque` |
| Carimbo CANCELADA (71) | `impacto` |
| Canhão (20) | `whoosh` |
| Contadores 154 mil, tanque BPC enchendo | `subida` |
| Data volta (29), cadeado destrava (46), data no fim (86) | `ding` |
| Cadeado trava (43) | `tique` |

## 2.7 Arquivos

- **Novos:** `src/videos/fabricafake/FabricaFake.tsx` · `src/videos/fabricafake/pecas.tsx` com:
  - `Galpao`: piso, parede do fundo e meia parede lateral, sem teto
  - `TVVelha`: TV de tubo com tela TELEJORNAL e etiqueta de data que some e volta
  - `CartazFake`: cartaz com até 4 linhas que entram uma por vez
  - `Arquivo` e `Garra`: estante com TVs velhas e garra num trilho
  - `Borracha`: borracha gigante num braço
  - `Prensa`: prensa com carimbo que desce, sobe e pode travar no meio
  - `Canhao`: canhão que dispara cartazinhos
  - `BracoLupa`: braço mecânico que segura a `Lupa` do catálogo
  - `BlocoBi`: bloco de dinheiro (1 = R$ 1 bi), com espessura livre para as fatias
  - `Tanque`: cilindro de vidro com nível e placa
  - `CaixaRemedio`: caixinha escrita REMÉDIO
  - `Prateleira` e `CaixaOrgao`: estante de 3 andares e caixa com nome
  - `palavras.ts` (já pronto)
- **Alterados:** `src/Root.tsx`, registrando `FabricaFake`, `FabricaFakeGuia`, `FabricaFakeLimpo` e `CapaFabricaFake`.
- **Reaproveitados do catálogo:**
  - fábrica: `Chamine`, `Engrenagem`, `EsteiraOitoHoras`;
  - redes: `CampoCelulares`, `IconeSeta`, `IconeBalao`;
  - checagem e cofre: `Lupa`, `CalendarioGrande`, `CofreFGTS`, `Ampulheta`, `LinhaLimite`;
  - Diário e dinheiro: `DiarioOficial`, `SetasTroca`, `CanoMoedas`, `CartaoBeneficio`;
  - Defesa: `Contracheque`, `Documento`, `Carimbo3DIntimacao`;
  - símbolos e balança: `Exclama`, `XMarca`, `ArcoPontos`, `Balanca`;
  - da base: `Boneco`, `Placa`, `Celular`.
- 3.189 quadros, em 4 partes de até 800 no render.

## 2.8 Origem das escolhas

**Das regras do `_aprendizados.md`:**
- "Variar o mundo": o 009 foi uma praça com tablados. Aqui é uma fábrica em corte, tipo casa de bonecas, mais a planície de celulares para as redes.
- Política com nome real: nenhum boneco de político. O nome aparece só no texto do post, com o rótulo TEXTO DO POST.
- Sem logos: telejornal genérico, nomes das fontes escritos.
- Símbolo protegido: sem cruz nos remédios, sem símbolo de acessibilidade.
- Citar cada fonte uma vez, no ponto em que ela sustenta o dado: selos do Aos Fatos, do Diário e do ICL.
- Número aproximado igual na fala e na tela (R$ 5,2 BI, R$ 226 MI, R$ 108 MI); conta própria com selo.
- Nada piscando: a etiqueta some e volta em 0,5 s, letreiro apaga em 1 s, a prensa só trava.
- A regra nova do 010: "senão a fábrica faz outra fake" vira a virada.

**Escolhas de direção (★):**
- placas 1 a 4 acendendo;
- poeira na TV velha;
- exclamação pulando;
- setas de compartilhar;
- calendário JUL 2024 / OUT 2026;
- linha da regra fiscal;
- ampulheta no cofre;
- setas de troca no Diário;
- bonecos com quepe;
- contracheque igual;
- 3 contas da Saúde;
- celular do fim com o carimbo.

A cor laranja da fake vem do tema base do Estúdio, para separar mentira (laranja) de checagem (verde).

## Ajustes feitos na programação (31/10/2026)
- Estante com 22 órgãos (o Anexo II tem 22, não 23); 2 vagas vazias.
- O cartaz da fake encolhe quando a TV vai para a checagem e sai de cena em "governo segurou", para não tapar a pílula, a Defesa e o final. A fake volta no fim no celular grande, com o carimbo É DE 2024.
- A planície de celulares é uma peça nova (`CampoFake`), com as telas acendendo em laranja; a `CampoCelulares` do catálogo tem telas de várias cores.
- A placa da portaria sai de cena na cena 6, para não esconder a folha CANCELADA.
- Na cena da Defesa, a mesa com a TV afunda no chão e volta na virada, para não ficar na frente.
- Câmeras dos passos mais baixas e pórticos mais baixos, para os números das máquinas não brigarem com a marca do topo. Câmera dos blocos mais de cima.
- Na virada, a lupa fica ao lado da prensa (não na frente), para o texto da segunda fake aparecer.
