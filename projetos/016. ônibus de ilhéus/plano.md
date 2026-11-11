# Plano de cenas: 016. ônibus de ilhéus (versão 1, aprovada em 03/11/2026)

Código `onibusilheus` · Nome `OnibusIlheus` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **três trechos de mapa** do Kit Mapas Animados (satélite de Ilhéus), feitos num MP4 só, como no 014.

**Três pedidos da pessoa valem para o vídeo todo:**
1. **Fonte sempre na tela, bem visível.** É maior que no 014 e traz o documento e a página. Tem gente na internet duvidando dos dados (seção 2.2, "Cartão da fonte").
2. **Nada sobreposto.** A tela é dividida em faixas fixas, uma coisa por faixa de cada vez (seção 2.2, "Faixas da tela"). Na revisão, um script confere caixa por caixa ★.
3. **Linha do tempo clara.** Cada data falada vira um título grande e depois fica na pílula do topo.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v4) · preparo: 1,2x, pausas de no máximo 0,35 s, -15,7 LUFS · duração **152,19 s** · `AUDIO_SEG = 152.19` · `QUADROS = 4593` (com 0,9 s de folga).
- 438 palavras (igual ao roteiro). A última ("direitos.") termina em 151,90 s. Os tempos sempre sobem, sem buraco maior que 1,5 s.
- Ajustes: 2 parágrafos regerados e emendados ("Maio de 2026..." e "Outubro de 2026..."). Cópia em `transcricao/palavras-original.json`.

**Palavras repetidas (o `quando()` certo):**

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| Viametro | 11,24 · 71,08 · 122,70 · 127,56 | `quando('A Viametro ganha uma')` · `quando('executivo da Viametro')` · `quando('a Viametro assume')` · `quando('A Viametro ganha mais')` |
| 2003 | 10,06 · 130,92 | `quando('2003.')` · `quando('contrato de 2003')` |
| 2024 | 4,86 · 21,62 · 33,22 · 140,18 · 144,54 | `quando('inteiro de 2024')` · `quando('2024.', 2)` → use `quando('A conta do transporte fecha')` − 1,1 s · `quando('balanco de 2024')` · `quando('dinheiro de 2024')` · `quando('de 2024 para')` |
| 2025 | 37,22 · 40,68 · 78,08 | `quando('Abril de 2025')` · `quando('Maio de 2025')` · `quando('em 2025, a conta')` |
| 2026 | 0,84 · 81,52 · 99,02 · 116,06 | `quando('meses de 2026')` · `quando('Maio de 2026')` · `quando('Agosto de 2026')` · `quando('Outubro de 2026')` |
| subsídio | 48,84 · 58,88 · 103,34 · 136,36 | `quando('aprova o subsidio')` · `quando('Sem o subsidio')` · `quando('sao do subsidio')` · `quando('Por que o subsidio')` |
| licitação | 12,12 · 20,44 · 43,54 · 85,50 · 132,32 · 142,22 | sempre com trecho longo: `'uma licitacao para'`, `'sem licitacao nova. 2024'` → use `quando('2033')`+0,9, `'lugar, sem licitacao'`, `'Sem licitacao, ela'`, `'Sem licitacao nova', 2`, `'sai a licitacao'` |
| Atlântico | 41,98 · 84,12 · 95,40 · 119,48 | `quando('A Atlantico entra')` · `quando('emergencia da Atlantico')` · `quando('Ja a Atlantico')` · `quando('tira a Atlantico')` |
| milhões | 8 vezes | nunca sozinho; sempre o número antes (`'3 milhoes'`, `'26,4'`, `'2,2'`, `'12 milhoes'`, `'3,5'`, `'16 milhoes'`, `'32 milhoes'`, `'8,6'`) |
| conta | 23,04 · 79,36 · 100,38 · 146,24 | `quando('A conta do transporte')` · `quando('a conta vai')` · `quando('A conta chega')` · `quando('Me conta')` |
| prefeitura | 9,16 · 29,14 · 55,44 · 76,46 · 121,82 | `quando('propria prefeitura')` · `quando('A prefeitura diz que ja')` · `quando('A prefeitura diz que rodar')` · `quando('resposta da prefeitura')` · `quando('segundo a prefeitura')` |
| Maio | 40,26 · 81,06 | `quando('Maio de 2025')` · `quando('Maio de 2026')` |
| orçamento | 107,30 · 113,56 | `quando('1,4')` · `quando('milhoes no orcamento')` |
| lei | 45,32 · 104,96 · 137,66 | `quando('A lei so')` · `quando('ritmo da lei.')` · `quando('ritmo da lei?')` |
| contrato | 14,50 · 94,28 · 130,34 | `quando('O contrato tem')` · `quando('fim do contrato')` · `quando('Naquele contrato')` |
| Únicas | TCM 89,82 · Brisa 125,78 · Sutram 26,92 · Guarda 35,86 · aditivo 129,24 | direto |

## 2.2 Ideia e mundo

**A metáfora: a Avenida do Tempo.** O vídeo inteiro acontece numa **avenida em maquete**, comprida, que some no horizonte. Cada **ponto de ônibus** da avenida é uma **data** da história: 2003, 2024, abril de 2025, maio de 2025, maio de 2026, agosto de 2026, outubro e novembro de 2026. Um **ônibus** (o protagonista) anda pela avenida e para em cada ponto na hora em que a data é falada. Dos lados da avenida estão os personagens da história: a prefeitura, a Câmara e as garagens das três empresas (São Miguel, Atlântico e Viametro), do lado esquerdo. Do lado direito fica **a conta do transporte**: pilhas de moedas que crescem de um ano para o outro (3, 12 e 32 pilhas). A pessoa **anda no tempo junto com o ônibus** e vê o dinheiro crescer. No fim da avenida, três **pontos de interrogação** grandes guardam as perguntas sem resposta.

**A unidade fixa (placar pequeno no canto, das cenas 3 a 7):** **"1 PILHA = R$ 1 MILHÃO"**.

**Protagonista:** o ônibus, genérico, em cinza claro com faixa verde-acinzentada (`tema.objetoClaro` e `tema.objeto`). Não tem nome nem a pintura de nenhuma empresa. Gente só como bonecos genéricos sem rosto: passageiros nos pontos, rodoviários na greve (não falada, então sai), servidores. As duas pessoas reais (o diretor da Viametro e o prefeito) aparecem como bonecos genéricos cinza com etiqueta de nome, sem rosto (regra de política com nomes reais).

**Os três trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: "O SALTO"** | do início (0,00) até `Como chegamos` (6,02) | 6,0 s | Satélite descendo em Ilhéus; o contorno do município (IBGE 2913606) acende em verde. Em "8 meses" entra a etiqueta **2026 (ATÉ AGOSTO): R$ 32 MI** no alto do município. Em "dez vezes" entra o **10×** grande no meio. Em "de 2024" entra a etiqueta pequena **2024 (ANO INTEIRO): R$ 3 MI**, embaixo. |
| **MAPA 2: "QUEM FICA COM O QUÊ"** | de `Em novembro` (120,72) até `A Viametro ganha mais` (127,18) | 6,5 s | Ilhéus visto de cima, com o mar à direita. Em "a Viametro assume a cidade", a mancha da cidade (sede) acende em verde e a etiqueta **CIDADE: VIAMETRO · 30 ÔNIBUS NOVOS** sai dela. Em "Brisa", pinos acendem nos distritos (Castelo Novo, Aritaguá, Inema, Japu, Olivença...) e entra a etiqueta **ZONA RURAL: BRISA**. |
| **MAPA 3: "SEU BAIRRO"** | de `O onibus do seu` (142,84) até o fim (152,19 + folga) | 10,3 s | Volta ao satélite da cidade, com a câmera girando devagar. Em "seu bairro" acendem, um de cada vez, pontinhos verdes nas ruas da cidade ★. Em "Me conta" entra a etiqueta **E AÍ, MELHOROU?** |

- Os trechos saem **sem legenda, sem marca d'água e sem som**, em 1080 × 1920, e entram no 3D com `OffthreadVideo` em três `Sequence` (`startFrom` de cada trecho), com entrada e saída de 0,2 s e whoosh.
- Pinos dos distritos: nomes da lista oficial do IBGE (distritos de 2913606) e posições do OpenStreetMap (ODbL, conferidas). A mancha da cidade vem da área urbanizada do IBGE; se não der para baixar, sai um círculo suave em volta da sede, sem contorno.

**Cartão da fonte (pedido da pessoa: bem visível)**
- Fica logo abaixo da pílula, na faixa fixa B (y 404 a 500), da margem esquerda até a direita (`SEGURO.esq` a `SEGURO.dir`).
- Duas linhas: em cima, **"FONTE"** em `tema.acento` (mono 20 px, negrito); embaixo, o documento e a página em `tema.texto` (mono 24 px, contra 16 px no 014). O fundo é `tema.cartao`, com borda de 2 px em `tema.cartaoBorda`.
- Troca junto com a fala, com esmaecer de 0,45 s. Nunca some: entre um dado e outro, fica o último.
- Por cima dos mapas, fica no mesmo lugar.

| # | Entra em | Texto do cartão |
|---|---|---|
| F1 | 0,00 | RREO DA PREFEITURA · DEZ/2024 P. 6 · AGO/2026 P. 8 |
| F2 | `Ano a ano` (7,18) | PORTAL DA TRANSPARÊNCIA DE ILHÉUS · TESOURO NACIONAL (SICONFI) |
| F3 | `2003.` (10,06) | CONTRATO DE CONCESSÃO DE 30/10/2003 · CLÁUSULA 6ª |
| F4 | `A conta do transporte fecha` (22,76) | RREO DEZ/2024 · P. 6 · LOA 2024 (LEI 4.247) · P. 9 |
| F5 | `A prefeitura diz que ja` (28,68) | NOTA DA PREFEITURA · PIMENTA, 14/05/2025 |
| F6 | `Mas o balanco` (32,32) | BALANÇO ANUAL 2024 DA PREFEITURA (DCA) · P. 38 |
| F7 | `Abril de 2025` (36,78) | CLASSE POLÍTICA, 12/04/2025 |
| F8 | `A Atlantico entra` (41,76) | PNCP · DISPENSA 014/2025 · LEI 14.133, ART. 75, VIII |
| F9 | `aprova o subsidio` (47,86) | PL 034/2025 · A TARDE, 22/05/2025 |
| F10 | `A prefeitura diz que rodar` (55,28) | NOTA DA PREFEITURA · PIMENTA, 14/05/2025 |
| F11 | `A oposicao` (62,46) | VEREADOR MAURÍCIO GALVÃO · NOTÍCIAS DA BAHIA, 14/05/2025 |
| F12 | `segundo os sites` (67,92) | PIMENTA, 14/05/2025 · A TARDE, 15/05/2025 |
| F13 | `Resultado` (77,26) | RREO DEZ/2025 · P. 4 · BALANÇO ANUAL 2025 |
| F14 | `Maio de 2026` (81,06) | ILHÉUS NET, 26/05/2026 · LEI 14.133, ART. 75 |
| F15 | `Segundo a vereadora` (87,38) | VEREADORA ENILDA MENDONÇA · DADOS DO E-TCM · 01/09/2026 |
| F16 | `Ja a Atlantico` (95,08) | A EMPRESA, VIA ILHÉUS EVENTOS, 21/10/2026 |
| F17 | `Agosto de 2026` (98,36) | RREO AGO/2026 · P. 8 · SUBFUNÇÃO 453 |
| F18 | `Outros 11` (108,90) | RREO AGO/2026 · P. 8 · LOA 2026 (LEI 4.369) · P. 101 |
| F19 | `Outubro de 2026` (115,42) | MPBA · ACORDO DE 19/10/2026 |
| F20 | `Em novembro` (120,72) | PREFEITURA DE ILHÉUS · ANÚNCIO DE 01/11/2026 |
| F21 | `A Viametro ganha mais` (127,18) | DIÁRIO OFICIAL DE ILHÉUS, 29/10/2026 · ADITIVO |
| F22 | `Ficam tres` (133,38) | TODOS OS DOCUMENTOS ESTÃO NA LEGENDA DO POST |
| F23 | `O onibus do seu` (142,84) | PORTAL DA TRANSPARÊNCIA DE ILHÉUS |

**Faixas da tela (para nada ficar sobreposto)**

| Faixa | Altura (y, px) | O que vai | Regra |
|---|---|---|---|
| A | 286 a 390 | marca d'água (286) e pílula (330) | fixas |
| B | 404 a 500 | cartão da fonte | um por vez, sempre presente |
| C | 520 a 610 | **data grande** (2,5 s depois de cada data) **ou** um chip de cena | um por vez; a data tem prioridade e o chip espera |
| D | 640 a 1340 | o 3D e os rótulos presos aos objetos (`Etiqueta`, números) | no máximo 2 rótulos ao mesmo tempo, um à esquerda e outro à direita, com 40 px de folga; rótulo que passaria da faixa é preso na borda |
| E | 1370 a 1524 | legenda | fixa |
| canto | y 640, à direita, até `SEGURO.botoesX` | placar "1 PILHA = R$ 1 MILHÃO" | só nas cenas 3 a 7; quando há rótulo à direita, o placar vai para a esquerda |

- Nos mapas, as etiquetas do Kit ficam dentro da faixa D.
- ★ No `<Nome>Guia`, as faixas aparecem desenhadas. No passo da revisão, um script mede as caixas 2D quadro a quadro e avisa qualquer encontro.

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| asfalto da avenida (fosco) | `tema.objetoEscuro` |
| calçadas e faixas do asfalto | `tema.objeto` e `tema.objetoClaro` |
| canteiros e árvores | `tema.vegetacao` |
| prédios | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| ônibus protagonista | `tema.objetoClaro`, com faixa em `tema.objeto` |
| moedas e pilhas do subsídio | dourado da paleta de apoio (`coresOI(tema).ouro`, a mesma do 014) |
| pilhas da administração e da Sutram | cinza-azulado (`tema.agua` misturado com `tema.objeto`), para separar do subsídio |
| o que deu errado ou não tem resposta (prazo vencido, "?", "SEM RESPOSTA") | marsala (`coresOI(tema).alerta`), fosco |
| o que a cena aponta (o número dito, o ponto de ônibus da data) | `tema.acento` |
| bonecos das pessoas reais | `tema.objeto` (cinza médio), os dois iguais |

**Mapa do mundo** (a avenida corre ao longo de z, do perto, z = 6, até o fundo, z = −64; chão em y = 0; câmera olhando de z+ para z−):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Avenida (asfalto com faixa tracejada) | x de −1,6 a 1,6, z de 6 a −64 | peça nova `Avenida`: asfalto, meio-fio, calçadas de 1,2 m, tracejado no centro |
| Ônibus protagonista | começa em [0,6, 0, 4], anda para z− | `Onibus` (catálogo), escala 1; anda e para em cada ponto, com freio suave (0,6 s); setas piscando não (sem pisca) |
| Ponto 1: **2003** | [2,4, 0, 0] | peça nova `PontoOnibus` (abrigo com banco e teto) + `PlacaAno` (catálogo) "2003" |
| Ponto 2: **2024** | [2,4, 0, −10] | `PontoOnibus` + `PlacaAno` "2024" |
| Ponto 3: **ABR 2025** | [2,4, 0, −18] | idem |
| Ponto 4: **MAI 2025** | [2,4, 0, −25] | idem |
| Ponto 5: **MAI 2026** | [2,4, 0, −35] | idem |
| Ponto 6: **AGO 2026** | [2,4, 0, −43] | idem |
| Ponto 7: **OUT/NOV 2026** | [2,4, 0, −52] | idem |
| Garagem da Viametro | [−4,5, 0, 1] | peça nova `Garagem`: galpão com portão de enrolar e letreiro "VIAMETRO" (nome escrito na fonte do perfil, sem logo); fica até o fim |
| Contrato de 2003 | [−2,4, 0, 2,5] | `RelatorioPDF` (do 014) em pé, título "CONTRATO DE CONCESSÃO", sub "30/10/2003 · CLÁUSULA 6ª" |
| Régua do contrato | ao longo da calçada direita, z de 1 a −4 | peça nova `ReguaContrato`: 6 blocos de 5 anos (2003 a 2008, ..., 2028 a 2033) que acendem um a um; marcador "HOJE" em 2026 ★ |
| Sutram (órgão de trânsito) | [−4,5, 0, −9] | peça nova `PredioSutram`: prédio baixo com letreiro "SUTRAM" e um semáforo na frente |
| Pilhas de 2024 | [4,6, 0, −10] | `PilhasDinheiro` (do 014): 3 pilhas cinza-azuladas (é a Sutram, não ônibus) |
| Balanço 2024 | [−2,4, 0, −12] | `RelatorioPDF` "BALANÇO 2024", com `Lupa` (catálogo) passando ★ |
| Garagem da São Miguel | [−4,5, 0, −17] | `Garagem` "SÃO MIGUEL"; o portão desce e o letreiro apaga em "deixa a cidade" |
| Garagem da Atlântico | [−4,5, 0, −24] | `Garagem` "ATLÂNTICO"; a ampulheta fica na frente |
| Ampulheta de 1 ano | [−2,6, 0, −24] | peça nova `Ampulheta`: areia que desce de maio de 2025 a maio de 2026 (cheia na cena 4, vazia na cena 5) |
| Câmara de Vereadores | [−4,8, 0, −28] | `CamaraVereadores` (do 014), letreiro "CÂMARA" |
| Lei do subsídio | [−2,4, 0, −28] | `RelatorioPDF` "LEI DO SUBSÍDIO", sub "R$ 26,4 MI POR ANO" |
| Prefeitura | [−4,8, 0, −31,5] | `Prefeitura` (do 014) |
| Dois lados (prefeitura e oposição) | 2D, faixa C | dois cartões iguais, lado a lado, mesmo tamanho e tempo (ver cena 4) |
| Os dois bonecos das pessoas reais | [−2,0, 0, −32] e [−0,8, 0, −32] | `Boneco` (base) cinza, sem rosto, com etiqueta de nome 2D |
| Pilhas de 2025 | [4,6, 0, −25] | 12 pilhas: 4,65 cinza-azuladas (Sutram) e 7,35 douradas (subsídio), em grade 4 × 3 |
| TCM | [−4,8, 0, −37] | `PredioTCM` (do 014), letreiro "TCM" |
| Pilhas de 2026 | [4,6, 0, −43] | 32 pilhas: 21 douradas (subsídio) e 11 cinza-azuladas (administração), em grade 8 × 4 |
| Orçamento do subsídio de 2026 | [3,0, 0, −46] | peça nova `CaixaOrcamento`: caixa transparente com 22,6 "pilhas" que esvazia até sobrar 1,4 ★ |
| Ministério Público | [−4,8, 0, −50] | `PredioColunas` (catálogo) com letreiro "MINISTÉRIO PÚBLICO" |
| Ônibus novos | na avenida, z de −54 a −60 | 6 `Onibus` em fila, representando os 30 (o chip diz 30) |
| Três perguntas | [−2, 0, −62], [0, 0, −62], [2, 0, −62] | peça nova `Interrogacao`: "?" grande em pé, fosco, que acende em marsala com a pergunta |
| Trânsito vivo | avenida inteira | 4 `Carro` (catálogo) andando devagar na outra mão; somem nos closes ★ |
| Passageiros | nos pontos | 2 a 4 `Pessoa` (catálogo) em cada ponto; nascem quando o ônibus chega ★ |

**Regras visuais:**
- O subsídio é sempre dourado. A Sutram e a administração são cinza-azulado. Assim a pessoa vê que, em 2024, não era dinheiro de ônibus.
- O verde do acento só vai no que a cena aponta: o ponto da data, o número dito, o contorno de Ilhéus.
- Marsala só no que deu errado ou não tem resposta: o prazo da emergência vencido, os "?", o chip "SEM RESPOSTA".
- **Neutro:** a prefeitura e a oposição aparecem com o mesmo tamanho e o mesmo tempo. Os dois bonecos ficam iguais e em cinza. Sem partido e sem cor de partido.
- Toda acusação vem com quem fala ("SEGUNDO A VEREADORA", "SEGUNDO A EMPRESA").
- Nada pisca: tudo acende em pelo menos 0,4 s.

## 2.3 Mapa de palavras-chave

Pílula = data da cena. Data grande = título 2D na faixa C, por 2,5 s.

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Em 8 meses` | 0,00 | MAPA 1 | satélite de Ilhéus descendo; cartão F1 | M1 |
| 2 | `meses de 2026` | 0,84 | MAPA 1 | etiqueta **2026 (ATÉ AGOSTO): R$ 32 MI** | M1 |
| 3 | `Ilheus gastou` | 2,10 | MAPA 1 | contorno do município acende em verde | M1 |
| 4 | `dez vezes` | 3,28 | MAPA 1 | **10×** grande no meio de Ilhéus | M1 |
| 5 | `inteiro de 2024` | 4,86 | MAPA 1 | etiqueta pequena **2024 (ANO INTEIRO): R$ 3 MI** | M1 |
| 6 | `Como chegamos` | 6,02 | troca | whoosh; entra o 3D: a avenida vista do alto, de ponta a ponta, com os 7 pontos | 1 |
| 7 | `Ano a ano` | 7,18 | pontos | os 7 `PlacaAno` sobem um a um, de perto para longe (0,25 s cada); cartão F2 | 1 |
| 8 | `documentos` | 8,26 | chip C | "DOCUMENTOS OFICIAIS DA PREFEITURA" | 1 |
| 9 | `2003.` | 10,06 | ponto 1 | **data grande 2003**; pílula "2003"; o ponto 1 acende; o ônibus entra no quadro; cartão F3 | 2 |
| 10 | `A Viametro ganha uma` | 11,00 | garagem Viametro | sobe do chão; letreiro "VIAMETRO" acende | 2 |
| 11 | `uma licitacao para` | 12,12 | contrato | o contrato cai em pé ao lado da garagem; chip "VENCEU UMA LICITAÇÃO" | 2 |
| 12 | `operar onibus` | 12,84 | ônibus | sai da garagem para a avenida ★ | 2 |
| 13 | `O contrato tem` | 14,26 | contrato | abre; câmera chega perto | 2 |
| 14 | `renova sozinho` | 16,08 | régua | aparece a régua do contrato, só o 1º bloco aceso (2003 a 2008) | 2 |
| 15 | `5 em 5 anos` | 17,20 | régua | blocos 2 a 5 acendem em sequência (2013, 2018, 2023, 2028) | 2 |
| 16 | `2033` | 19,10 | régua | o 6º bloco acende; rótulo **ATÉ 2033 · 30 ANOS**; marcador "HOJE" em 2026 ★ | 2 |
| 17 | `sem licitacao nova` | 20,04 | chip C | "SEM NOVA LICITAÇÃO" | 2 |
| 18 | `2024.` (21,62) | 21,62 | ponto 2 | **data grande 2024**; pílula "2024"; o ônibus anda até o ponto 2 | 3 |
| 19 | `A conta do transporte` | 22,76 | pilhas 2024 | o placar "1 PILHA = R$ 1 MILHÃO" entra; cartão F4 | 3 |
| 20 | `3 milhoes` | 24,36 | pilhas 2024 | 3 pilhas cinza-azuladas sobem; rótulo **3 MI** (sub "R$ 3,02 MI · 2024") | 3 |
| 21 | `orgao de transito` | 25,94 | Sutram | o prédio da Sutram sobe; semáforo acende devagar | 3 |
| 22 | `Sutram` | 26,92 | pilhas 2024 | uma linha liga as pilhas à Sutram; rótulo **ERA SÓ A SUTRAM** | 3 |
| 23 | `O onibus nem` | 27,52 | ônibus | o ônibus passa sem parar nas pilhas; chip "ÔNIBUS: R$ 0 NESSA CONTA" | 3 |
| 24 | `A prefeitura diz que ja` | 28,68 | chip C | "A PREFEITURA DIZ: JÁ PAGAVA, POR ACORDO NA JUSTIÇA"; cartão F5 | 3 |
| 25 | `acordo na Justica` | 31,30 | ★ | balança da Justiça pequena ao lado do balanço (`BalancaJustica`, se houver no catálogo; senão, só o chip) | 3 |
| 26 | `Mas o balanco` | 32,32 | balanço 2024 | o caderno "BALANÇO 2024" sobe; a lupa passa; cartão F6 | 3 |
| 27 | `nao mostra` | 33,92 | balanço | rótulo **REPASSE A EMPRESA (BALANÇO 2024): R$ 0** em marsala | 3 |
| 28 | `Guarda isso` | 35,86 | balanço | um "?" pequeno marsala fica pendurado em cima do caderno até o fim do vídeo (é o gancho que volta no fecho) ★ | 3 |
| 29 | `Abril de 2025` | 36,78 | ponto 3 | **data grande ABRIL DE 2025**; pílula; ônibus anda; cartão F7 | 4 |
| 30 | `A Sao Miguel` | 38,26 | garagem São Miguel | sobe com o letreiro aceso | 4 |
| 31 | `deixa a cidade` | 38,98 | garagem São Miguel | o portão desce e o letreiro apaga (0,6 s); um ônibus velho sai e some no fundo ★ | 4 |
| 32 | `Maio de 2025` | 40,26 | ponto 4 | **data grande MAIO DE 2025**; pílula | 4 |
| 33 | `A Atlantico entra` | 41,76 | garagem Atlântico | sobe com o letreiro "ATLÂNTICO"; cartão F8 | 4 |
| 34 | `sem licitacao, por` | 43,28 | chip C | "SEM LICITAÇÃO · EMERGÊNCIA" | 4 |
| 35 | `A lei so permite` | 45,04 | ampulheta | sobe cheia; rótulo **PRAZO MÁXIMO: 1 ANO** | 4 |
| 36 | `No mesmo mes` | 47,06 | Câmara | a Câmara sobe; letreiro acende; cartão F9 | 4 |
| 37 | `aprova o subsidio` | 48,36 | lei | a lei cai na frente da Câmara com um carimbo "APROVADO" ★ | 4 |
| 38 | `26,4` | 49,74 | pilhas 2025 (fantasma) | rótulo **R$ 26,4 MI POR ANO** | 4 |
| 39 | `empresas de onibus` | 52,06 | garagens | as garagens da Viametro e da Atlântico acendem juntas | 4 |
| 40 | `2,2` | 53,38 | moedas | ★ uma moeda grande gira; rótulo **R$ 2,2 MI POR MÊS** | 4 |
| 41 | `A prefeitura diz que rodar` | 55,28 | 2D, faixa C | cartão à esquerda "PREFEITURA" com "RODAR CUSTA MAIS QUE AS PASSAGENS"; cartão F10 | 4 |
| 42 | `Sem o subsidio` | 58,30 | 2D, faixa C | no mesmo cartão: "SEM SUBSÍDIO, A PASSAGEM DE R$ 4,80 SUBIRIA" | 4 |
| 43 | `4,80` | 60,32 | ★ catraca/placa | placa de tarifa "R$ 4,80" no ponto 4 (`PlacaRodovia` com texto) | 4 |
| 44 | `A oposicao` | 62,46 | 2D, faixa C | cartão à direita "OPOSIÇÃO", mesmo tamanho: "SEM PLANILHA DE CUSTOS"; cartão F11 | 4 |
| 45 | `sem garantia` | 65,40 | 2D | no mesmo cartão: "SEM GARANTIA DE ÔNIBUS MELHOR"; os dois cartões ficam lado a lado até 66,9 | 4 |
| 46 | `E mais` | 66,96 | troca de plano | câmera vai para a frente da prefeitura | 4 |
| 47 | `segundo os sites` | 67,92 | chip C | "SEGUNDO OS SITES PIMENTA E A TARDE"; cartão F12 | 4 |
| 48 | `executivo da Viametro` | 70,18 | boneco 1 | sobe; etiqueta **PAULO CARLETTO · DIRETOR-EXECUTIVO DA VIAMETRO** | 4 |
| 49 | `e cunhado` | 72,50 | linha | linha tracejada fina entre os dois lugares; rótulo **CUNHADOS** | 4 |
| 50 | `do prefeito` | 73,26 | boneco 2 | sobe; etiqueta **VALDERICO JÚNIOR · PREFEITO** | 4 |
| 51 | `As reportagens` | 74,70 | chip C | "AS REPORTAGENS NÃO TRAZEM RESPOSTA DA PREFEITURA" (marsala) | 4 |
| 52 | `Resultado` | 77,26 | câmera | sobe para ver as pilhas de 2024 e de 2025 juntas; cartão F13 | 4 |
| 53 | `em 2025, a conta` | 77,92 | pilhas 2025 | sobem: 4,65 cinza (Sutram) e 7,35 douradas (subsídio, desde julho) | 4 |
| 54 | `12 milhoes` | 79,94 | pilhas 2025 | rótulo **12 MI** (sub "7,35 SUBSÍDIO + 4,65 SUTRAM"); as 3 de 2024 ficam visíveis ao lado | 4 |
| 55 | `Maio de 2026` | 81,06 | ponto 5 | **data grande MAIO DE 2026**; pílula; cartão F14 | 5 |
| 56 | `emergencia da Atlantico` | 82,84 | ampulheta | a última areia cai; ampulheta fica marsala; rótulo **PRAZO VENCIDO** | 5 |
| 57 | `Sem licitacao, ela` | 85,24 | ônibus da Atlântico | segue rodando na avenida; chip "SEM LICITAÇÃO, SEGUE RODANDO" | 5 |
| 58 | `Segundo a vereadora` | 87,38 | TCM | o prédio do TCM sobe; cartão F15 | 5 |
| 59 | `dados do TCM` | 89,14 | TCM | letreiro acende; chip "SEGUNDO A VEREADORA ENILDA" | 5 |
| 60 | `3,5` | 91,78 | moedas | 3,5 moedas grandes douradas correm pela calçada até a garagem da Atlântico; rótulo **R$ 3,5 MI DEPOIS DO CONTRATO** (sub "29/05 A 31/07/2026") | 5 |
| 61 | `Ja a Atlantico` | 95,08 | garagem Atlântico | acende; cartão F16 | 5 |
| 62 | `16 milhoes` | 96,54 | rótulo | **SEGUNDO A EMPRESA: R$ 16 MI A RECEBER** (do lado oposto ao rótulo 60, mesmo tamanho) | 5 |
| 63 | `Agosto de 2026` | 98,36 | ponto 6 | **data grande AGOSTO DE 2026**; pílula; cartão F17 | 6 |
| 64 | `A conta chega` | 100,12 | pilhas 2026 | as 32 pilhas sobem em ondas | 6 |
| 65 | `32 milhoes` | 101,12 | pilhas 2026 | rótulo **32 MI** (sub "ATÉ AGO/2026 · R$ 32,36 MI"); câmera recua e mostra as 3, as 12 e as 32 em fila ★ | 6 |
| 66 | `21 sao` | 102,52 | pilhas 2026 | as 21 douradas acendem; rótulo **21 MI · SUBSÍDIO** | 6 |
| 67 | `Acima do ritmo` | 104,00 | ★ régua de ritmo | uma linha no chão marca o "ritmo da lei" (2,2 × 8 = 17,6 pilhas); as douradas passam dela; rótulo **LEI: 17,6 EM 8 MESES** | 6 |
| 68 | `1,4` | 105,96 | caixa do orçamento | a caixa esvazia até sobrar 1,4; rótulo **SOBROU R$ 1,4 MI PARA SET A DEZ** | 6 |
| 69 | `Outros 11` | 108,90 | pilhas 2026 | as 11 cinza-azuladas acendem; rótulo **11 MI · ADMINISTRAÇÃO**; cartão F18 | 6 |
| 70 | `8,6` | 112,02 | rótulo | **ORÇAMENTO: 8,6 MI** | 6 |
| 71 | `chegou a 19` | 114,26 | rótulo | **→ 19 MI** (o 8,6 fica riscado) | 6 |
| 72 | `Outubro de 2026` | 115,42 | ponto 7 | **data grande OUTUBRO DE 2026**; pílula; cartão F19 | 7 |
| 73 | `Ministerio Publico` | 118,16 | MP | o prédio sobe com o letreiro aceso | 7 |
| 74 | `tira a Atlantico` | 118,96 | garagem Atlântico | o portão desce e o letreiro apaga (0,6 s) | 7 |
| 75 | `Em novembro` | 120,72 | troca | whoosh; entra o MAPA 2; pílula "NOVEMBRO DE 2026"; cartão F20 | M2 |
| 76 | `a Viametro assume` | 122,52 | MAPA 2 | a cidade acende em verde; etiqueta **CIDADE: VIAMETRO** | M2 |
| 77 | `30 onibus` | 124,10 | MAPA 2 | a etiqueta ganha **30 ÔNIBUS NOVOS** | M2 |
| 78 | `Brisa` | 125,78 | MAPA 2 | pinos dos distritos acendem; etiqueta **ZONA RURAL: BRISA** | M2 |
| 79 | `A Viametro ganha mais` | 127,18 | troca | whoosh; volta ao 3D na garagem da Viametro; cartão F21 | 8 |
| 80 | `mais linhas` | 128,26 | ônibus novos | os 6 ônibus novos saem em fila da garagem; chip "30 ÔNIBUS NOVOS (SEGUNDO A PREFEITURA)" | 8 |
| 81 | `aditivo` | 129,24 | contrato 2003 | uma folha nova encaixa no contrato de 2003 com o carimbo "ADITIVO" ★ | 8 |
| 82 | `Naquele contrato` | 130,00 | régua do contrato | a régua acende de novo até 2033 | 8 |
| 83 | `Sem licitacao nova` (2ª) | 132,04 | chip C | "SEM LICITAÇÃO NOVA" | 8 |
| 84 | `Ficam tres` | 133,38 | perguntas | câmera voa até o fim da avenida; os 3 "?" sobem; cartão F22 | 9 |
| 85 | `Por que o subsidio` | 135,92 | "?" 1 | acende em marsala; chip "POR QUE O SUBSÍDIO PASSOU DO RITMO DA LEI?" | 9 |
| 86 | `Onde foi parar` | 138,14 | "?" 2 | acende; o "?" pequeno do balanço de 2024 (evento 28) voa até ele ★; chip "ONDE ESTÁ O DINHEIRO DE 2024 NO BALANÇO?" | 9 |
| 87 | `quando sai` | 141,66 | "?" 3 | acende; chip "QUANDO SAI A LICITAÇÃO?" | 9 |
| 88 | `O onibus do seu` | 142,84 | troca | whoosh; entra o MAPA 3; pílula "E VOCÊ?"; cartão F23 | M3 |
| 89 | `seu bairro` | 143,54 | MAPA 3 | pontinhos verdes acendem nas ruas, um de cada vez ★ | M3 |
| 90 | `Me conta` | 145,90 | MAPA 3 | etiqueta **E AÍ, MELHOROU?** | M3 |
| 91 | `E segue` | 147,38 | 2D | a assinatura do perfil entra embaixo da etiqueta (faixa C) | M3 |
| 92 | `direitos` | 151,44 | fim | escurece em 0,7 s depois da última palavra | M3 |

★ Eventos extras de ritmo (sem palavra própria, para manter cerca de 1 evento por segundo): passageiros que nascem em cada ponto quando o ônibus chega; carros na outra mão; as rodas do ônibus girando; luz das janelas da prefeitura e da Câmara acendendo devagar quando são citadas.

## 2.4 Cenas com câmera

A avenida é comprida e o vídeo é vertical, então os planos abertos olham **ao longo da avenida** (de perto para o fundo), um pouco de cima (36° a 44°). A câmera usa sempre o enquadramento automático da base (alvo + tamanho + direção). Cada cena tem um movimento lento: grua, arco ou avanço.

### MAPA 1: O SALTO (0,00 a 6,02 s) · Eventos 1 a 5
- Kit Mapas: satélite descendo da Bahia até Ilhéus (zoom em escala logarítmica).
- Pílula: O SALTO
- Aha: 2026 já gastou dez vezes 2024.

### CENA 1: A AVENIDA DO TEMPO (6,02 a 10,06 s) · Eventos 6 a 8
- 1a: alvo [0, 0, −28] · tamanho 70 m ao longo de z · direção de cima, de z+ (ângulo 55°) · grua descendo para 44°
- Pílula: ANO A ANO
- Aha: cada ponto de ônibus é uma data.

### CENA 2: 2003 (10,06 a 21,62 s) · Eventos 9 a 17
- 2a (10,06 a 14,26): alvo [−1, 0,8, 1] · tamanho 9 m · direção de z+, 38° · arco de 15° para a esquerda (a garagem e o ônibus no quadro)
- 2b (14,26 a 21,62): alvo [1,5, 0,6, −1] (contrato + régua) · tamanho 7 m · 40° · avanço lento ao longo da régua
- Pílula: 2003
- Aha: o contrato da Viametro se renova sozinho até 2033.

### CENA 3: 2024 (21,62 a 36,78 s) · Eventos 18 a 28
- 3a (21,62 a 28,68): alvo [2, 0,6, −10] (pilhas e Sutram) · tamanho 11 m · 40° · arco da direita para o centro
- 3b (28,68 a 36,78): alvo [−2, 0,8, −12] (balanço) · tamanho 6 m · 36° · avanço lento até o caderno
- Pílula: 2024
- Aha: em 2024, a conta do transporte era só o órgão de trânsito.

### CENA 4: 2025 (36,78 a 81,06 s) · Eventos 29 a 54
- 4a (36,78 a 47,06): alvo [−3, 0,8, −21] (garagens da São Miguel e da Atlântico) · tamanho 12 m · 38° · grua que acompanha o ônibus
- 4b (47,06 a 55,28): alvo [−3, 1, −28] (Câmara + lei) · tamanho 9 m · 40° · arco
- 4c (55,28 a 66,96): alvo [0, 0,8, −27] · tamanho 12 m · 44° · grua subindo devagar (os dois cartões 2D ficam na faixa C, o 3D desce na faixa D)
- 4d (66,96 a 77,26): alvo [−1,6, 1, −32] (os dois bonecos e a prefeitura) · tamanho 6 m · 30° · avanço lento
- 4e (77,26 a 81,06): alvo [4,6, 0,6, −17] · tamanho 18 m · 44° · grua subindo para ver as pilhas de 2024 (z −10) e de 2025 (z −25)
- Pílula: ABRIL DE 2025 → MAIO DE 2025
- Aha: a Atlântico entrou por emergência e o subsídio foi aprovado. A prefeitura e a oposição têm o mesmo espaço.

### CENA 5: MAIO DE 2026 (81,06 a 98,36 s) · Eventos 55 a 62
- 5a (81,06 a 87,38): alvo [−3, 0,8, −26] (garagem e ampulheta) · tamanho 8 m · 38° · arco
- 5b (87,38 a 98,36): alvo [−4, 1, −31] (TCM e garagem da Atlântico) · tamanho 14 m · 40° · grua lenta
- Pílula: MAIO DE 2026
- Aha: o prazo venceu e a empresa seguiu rodando.

### CENA 6: AGOSTO DE 2026 (98,36 a 115,42 s) · Eventos 63 a 71
- 6a (98,36 a 102,52): alvo [4,6, 0,8, −27] · tamanho 38 m ao longo de z · 44° · recuo (as 3, as 12 e as 32 pilhas em fila)
- 6b (102,52 a 108,90): alvo [4, 0,8, −44] (pilhas de 2026 + caixa do orçamento) · tamanho 9 m · 40° · arco
- 6c (108,90 a 115,42): alvo [5, 0,8, −43] · tamanho 8 m · 38° · avanço lento
- Pílula: AGOSTO DE 2026
- Aha: dos 32 milhões, 21 são subsídio, acima do ritmo, e 11 são administração.

### CENA 7: OUTUBRO DE 2026 (115,42 a 120,72 s) · Eventos 72 a 74
- 7a: alvo [−4, 1, −50] (MP e, ao fundo, a garagem da Atlântico) · tamanho 12 m · 38° · grua
- Pílula: OUTUBRO DE 2026

### MAPA 2: QUEM FICA COM O QUÊ (120,72 a 127,18 s) · Eventos 75 a 78
- Kit Mapas: Ilhéus inteiro, com a cidade e os distritos.
- Pílula: NOVEMBRO DE 2026

### CENA 8: O ADITIVO (127,18 a 133,38 s) · Eventos 79 a 83
- 8a: alvo [−3, 0,8, 1] (garagem da Viametro + contrato) · tamanho 10 m · 40° · arco. Como é "no contrato de 2003", a câmera volta ao começo da avenida, num voo rápido de 1 s em escala logarítmica.
- Pílula: NOVEMBRO DE 2026
- Aha: a Viametro ganhou mais linhas sem licitação nova, no contrato de 2003.

### CENA 9: AS PERGUNTAS (133,38 a 142,84 s) · Eventos 84 a 87
- 9a (133,38 a 135,92): voo ao longo da avenida inteira até o fim (escala logarítmica)
- 9b (135,92 a 142,84): alvo [0, 1,4, −62] · tamanho 7 m · 30° · avanço lento
- Pílula: SEM RESPOSTA

### MAPA 3: SEU BAIRRO (142,84 a 152,19 s) · Eventos 88 a 92
- Kit Mapas: satélite da cidade girando devagar.
- Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Todos os números estão em `audio/fontes.md`, com documento, página e link, checados em 03/11/2026. Na tela, cada número aparece como é falado e com o valor exato no sub (ex.: "3 MI", sub "R$ 3,02 MI · 2024"). O cartão da fonte (F1 a F23) troca junto com a fala.

**Conferir antes de publicar:** o texto e a data da Lei Municipal 4.337; se saiu o edital da licitação; o nome da empresa da zona rural (o Diário Oficial diz Cactos, a prefeitura diz Brisa) e o número de ônibus novos (o aditivo diz 20, a prefeitura diz 30; o vídeo usa a versão da prefeitura, com "segundo a prefeitura"); a resposta da prefeitura à denúncia da vereadora e ao parentesco; o RREO do 5º bimestre de 2026, se já saiu.

## 2.6 Trilha e sons

- `whoosh`: as 6 trocas entre mapa e 3D (eventos 6, 75, 79, 88) e os dois voos de câmera (79 e 84).
- `tique`: cada troca de pílula ou data (9, 18, 29, 32, 55, 63, 72).
- `pop`: cada número que entra (20, 38, 40, 54, 60, 62, 65, 66, 68, 69, 70, 71, 77).
- `subida`: as pilhas que sobem (53, 64) e a régua do contrato (15 e 16).
- `baque`: os portões que descem (31, 74) e o "R$ 0" do balanço (27).
- `impacto`: os carimbos "APROVADO" (37) e "ADITIVO" (81).
- `bip`: a ampulheta que zera (56).
- `ding`: não usar (o vídeo não tem virada boa).
- Sem trilha (não há trilha própria na pasta `sfx/`).

## 2.7 Arquivos

**Novos:**
- `src/videos/onibusilheus/OnibusIlheus.tsx`: as tabelas `T` (`quando()`), `FONTES`, `DATAS`, `CHIPS`, `ROTULOS`, as câmeras, a interface com as faixas, `FAIXAS` de som, `REVISAO` e a capa.
- `src/videos/onibusilheus/pecas.tsx`:
  - `Avenida`: asfalto, meio-fio, calçadas e tracejado;
  - `PontoOnibus`: abrigo com teto, banco e poste;
  - `Garagem`: galpão com portão de enrolar e letreiro;
  - `PredioSutram`: prédio baixo com letreiro e semáforo;
  - `ReguaContrato`: 6 blocos de 5 anos com marcador "HOJE";
  - `Ampulheta`: vidro com areia que desce;
  - `CaixaOrcamento`: caixa transparente que esvazia;
  - `Interrogacao`: "?" grande, fosco.
- `src/videos/onibusilheus/palavras.ts` (já pronto).
- `projetos/016. ônibus de ilhéus/mapas/onibus.mp4`: os 3 trechos do Kit Mapas, sem som, com legenda e marca desligadas.
- Kit Mapas: `src/videos/onibus-ilheus/` (composição `OnibusIlheus`, tempos tirados do `palavras.ts` do 3D) e `scripts/dados-onibus-ilheus.py` (contorno de Ilhéus, distritos, mancha urbana).

**Alterados:** `src/Root.tsx`, para registrar `OnibusIlheus`, `OnibusIlheusGuia`, `OnibusIlheusLimpo` e `CapaOnibusIlheus`.

**Reaproveitados:**
- do catálogo: `Onibus`, `PlacaAno`, `Carro`, `Pessoa`, `PredioColunas`, `Lupa` (se houver; senão, a do 014), `PlacaRodovia`, `Boneco` (base);
- do 014: `PilhasDinheiro`, `grade`, `RelatorioPDF`, `Prefeitura`, `CamaraVereadores`, `PredioTCM`, `coresOI`.

**Render:** 4593 quadros, em partes pelo `scripts/render.mjs`. Com `soMapa` (como no 014), o 3D não é desenhado enquanto o mapa cobre a tela.

## 2.8 Origem das escolhas

**Veio dos pedidos da pessoa neste vídeo:**
- o cartão da fonte grande, sempre presente, com documento e página;
- nada sobreposto, com as faixas fixas e a conferência na revisão;
- os dois kits juntos;
- a linha do tempo clara, com data grande e pílula;
- os números da prefeitura (30 ônibus, Brisa) com "segundo a prefeitura";
- o parentesco, com quem noticiou e "sem resposta".

**Veio do `_aprendizados.md`:**
- uma animação por palavra-chave, com cerca de 1 evento por segundo;
- tema de trânsito: mundo vivo, com carros e passageiros, e um personagem (o ônibus);
- mundo comprido no vertical: olhar ao longo do comprimento;
- zoom longo em escala logarítmica;
- pessoa real como boneco genérico, sem rosto, com etiqueta de nome;
- tema polêmico com os dois lados iguais;
- "segundo quem" em cada acusação;
- pilhas ao lado do assunto;
- fantasma e acento só no que importa;
- chão próprio somado na altura das peças (a avenida tem 0,05 m);
- selo de cada dado na hora dele;
- rótulo com pelo menos 1,5 s na tela;
- kits juntos com `OffthreadVideo`;
- selos do 3D no topo por cima do mapa;
- nada de `Guindaste`;
- placa de identificação nas laterais, nunca na frente.

**Escolha do diretor:**
- a Avenida do Tempo, com os pontos de ônibus como datas;
- o ônibus protagonista;
- as duas cores de pilha (subsídio dourado e Sutram ou administração cinza-azulado), para mostrar que 2024 não era ônibus;
- a régua do contrato de 6 blocos;
- a ampulheta do prazo de 1 ano;
- a linha do "ritmo da lei";
- a caixa do orçamento que esvazia;
- o "?" do "Guarda isso" que volta no fecho;
- os ★ marcados na tabela.
