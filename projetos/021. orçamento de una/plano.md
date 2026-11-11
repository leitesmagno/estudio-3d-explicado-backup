# Plano de cenas: 021. orçamento de una (versão 1, para aprovação)

Código `orcamentouna` · Nome `OrcamentoUna` · Perfil @eumagnoleite (acento verde folha, `tema.acento`).
**Vídeo com os dois kits:** o Estúdio 3D monta o vídeo inteiro e encaixa **dois trechos de mapa** do Kit Mapas Animados no começo (satélite do Brasil até Una e o mapa dos repasses).
**Mesma série do 014 e do 017:** o mesmo mundo (maquete redonda com o cofre no meio e pilhas de moedas), para o perfil ficar reconhecível. Muda a cidade (Una tem mar e rio) e a história.
**Regra deste vídeo:** todo número vem dos documentos do município de Una (portal da transparência e Tesouro, IBGE 2932507). Nenhum número, nome, documento ou imagem de Ilhéus ou de Itabuna entra na tela. Só o formato e as peças 3D genéricas são reaproveitados.

## 2.1 Narração

- Arquivo: `audio/narracao-norm.wav` · voz Adam (ElevenLabs v3), a que o Magno gerou · preparo: 1,3x + pausas encurtadas para 0,35 s + volume -15 · original 222,1 s · **final 170,38 s** · `AUDIO_SEG = 170.38` · `QUADROS = 5138` (com 0,9 s de folga).
- 453 palavras (igual ao roteiro v4); a última ("direitos.") termina em 170,12 s. Tempos sempre sobem.
- Ajustes: nenhum no `palavras.json` (cópia em `transcricao/palavras-original.json`). O alinhador casou "54" com "54%", "22" com "22%", "15%" com "15." e "25%" com "25." (só grafia).

**Palavras repetidas** (o `quando()` certo):

| Palavra | Ocorrências (s) | Como chamar |
|---|---|---|
| União | 4,6 | `quando('da Uniao')` (só uma vez) |
| estado | 5,9 · 22,0 | `quando('governo do estado')` · `quando('O estado mandou')` |
| impostos | 6,9 · 18,7 · 26,4 · 157,2 | `quando('dos impostos da propria')` · `quando('impostos federais')` · `quando('E os impostos')` · `quando('dos impostos, e')` |
| prefeitura | 9,2 · 66,0 · 136,7 | `quando('contas da prefeitura')` · `quando('Administracao da prefeitura')` · `quando('junta prefeitura')` |
| educação | 24,4 · 46,4 · 159,1 | `quando('fundo da educacao')` · `quando('Educacao: 59')` · `quando('A educacao, 31%')` |
| saúde | 52,2 · 54,5 · 60,9 · 155,5 | `quando('Saude: 31')` · `quando('posto de saude')` · `quando('administracao da saude')` · `quando('a saude recebeu')` |
| morador | 37,3 · 43,0 | `quando('38 reais')` · `quando('7.300')` |
| mais | 25,0 · 40,8 · 64,2 · 71,9 · 81,0 · 93,0 | sempre com vizinha: `quando('mais 24')` · `quando('Entrou mais')` · `quando('Mais que o dobro')` · `quando('Mais que toda')` · `quando('Vinte vezes')` · `quando('levou mais')` |
| previstos | 57,7 · 79,7 | `quando('14,8')` · `quando('56 mil')` |
| obras | 84,5 · 88,1 | `quando('obras de infraestrutura')` · `quando('obras e equipamentos')` |
| zero | 84,1 · 122,0 | `quando('ficou no zero')` · `quando('linha era zero')` |
| teto | 101,9 · 109,0 · 133,0 · 149,0 | `quando('um teto')` · `quando('59%')` + 1,1 s · `quando('56%')` + 3,3 s · `quando('acima do teto, a lei')` |
| 2024 | 106,1 · 120,5 | `quando('2024:')` · `quando('Em 2024, essa')` |
| 2025 | 2,7 · 109,5 | `quando('reais em 2025')` · `quando('2025:')` |
| demissão | 118,9 · 131,8 · 141,4 · 144,7 | `quando('indenizacao por demissao')` · `quando('sem desconto de demissao')` · `quando('descontados como')` · `quando('que demissoes')` |
| relatório | 116,1 · 128,2 · 134,6 | `quando('o relatorio tirou')` · `quando('relatorio enviado')` · `quando('relatorio do portal')` |
| Câmara | 69,3 · 137,4 | `quando('Camara de Vereadores')` · `quando('prefeitura e Camara')` |
| 22 | 66,7 · 139,7 · 156,2 (22%) | `quando('22 milhoes')` · `quando('Com 22')` · `quando('recebeu 22%')` |
| 2 / Dois | 91,3 · 99,1 · 145,8 | `quando('So 2')` · `quando('2 foram')` · `quando('Dois: qual')` |
| mínimo | 158,0 · 160,9 | `quando('minimo e 15')` · `quando('minimo e 25')` |
| milhões | muitas vezes | nunca sozinho; sempre com o número antes |

## 2.2 Ideia e mundo

**A metáfora: a maquete de Una com o cofre no meio** (a mesma da série). Uma mesa redonda com a cidade em miniatura: **o mar** ocupa a borda da direita (faixa azul com areia clara e coqueiros baixos) e **o rio Una** desce da esquerda até o mar, com uma ponte baixa. Casinhas e morros verdes na borda de trás. No centro, o **cofre da prefeitura**. **Cada 1 milhão de reais é uma pilha de moedas**: os 132 milhões viram **132 pilhas** em volta do cofre. Quando o narrador diz cada área, as pilhas deslizam do cofre para o prédio daquela área e o número digita ao lado.

O que é novo neste vídeo, para cada curiosidade ter uma imagem própria:
- **Pilhas fantasmas do "previsto"** (douradas a 30%) ao lado das do "gasto": orçamento 124,5 × 132; atenção básica 14,8 × 10,4; administração da saúde 6,2 × 13,3; transporte 0,056 × 1,2; obras de infraestrutura 0,097 × 0.
- **O bloco da demissão:** um caixote marsala com a etiqueta "INDENIZAÇÃO POR DEMISSÃO · 16 MI" sai de dentro da régua do teto, e o líquido desce de 67% até 54,35%. Ele volta para a régua na conta "sem o desconto".
- **Os dois relatórios lado a lado:** dois cadernos em pé na mesa, "ENVIADO AO TESOURO" (56%) e "PORTAL DA PREFEITURA" (42%), com a mesma data "MAI A AGO 2026". O do portal tem o caixote "DEMISSÃO · 22 MI" saindo dele. Entre os dois, um "?" grande.

**A unidade fixa:** placar pequeno no canto de cima, da cena 1 até a cena 3: **"1 PILHA = R$ 1 MILHÃO"**.

**Os dois trechos de mapa (Kit Mapas):**

| Trecho | Na narração | Duração | O que mostra |
|---|---|---|---|
| **MAPA 1: "UNA"** | do início (0,00) até `Primeiro, de onde` (11,84) | 11,8 s | Voo do Brasil até o sul da Bahia, descendo no satélite até Una. O contorno do município (IBGE 2932507) acende em verde. Em "132 milhões" digita **R$ 132 MILHÕES** no meio do município; embaixo, "RECEBIDOS EM 2025". Em "da União" um ponto acende em Brasília; em "governo do estado", em Salvador; em "impostos da própria cidade", o próprio contorno de Una pulsa (sem valores ainda, só os três lugares). Em "abri as contas" entra a etiqueta "PREFEITURA DE UNA". |
| **MAPA 2: "DE ONDE VEIO"** | de `Primeiro, de onde` (11,84) até `E os impostos` (25,58) | 13,7 s | O mapa recua até ver Brasília, Salvador e Una no mesmo quadro. Em "governo federal" uma seta curva sai de **Brasília** com **UNIÃO · R$ 72 MI**; em "FPM" um chip menor dentro dela **FPM · R$ 43 MI**; em "O estado" outra seta sai de **Salvador** com **ESTADO · R$ 11 MI**; em "Fundeb" uma etiqueta **FUNDEB · R$ 24 MI** entra junto de Una. |

- Os trechos saem **sem legenda, sem marca d'água e sem som**, em 1080 × 1920, num MP4 só (`projetos/021. orçamento de una/mapas/una.mp4`), e entram no 3D por **um** `OffthreadVideo` dentro de uma `Sequence` (regra do 015), com saída de 0,2 s e whoosh. Selos do 3D por cima do mapa vão no topo (y 470).
- Contorno de Una: malha do IBGE (município 2932507, qualidade máxima). Bahia: malha do estado 29. Brasília e Salvador: pontos das capitais. Satélite: NASA + EOxCloudless (licença do kit), baixado com `npm run tiles`.

**Protagonista:** não há. O "personagem" é o dinheiro (as pilhas). Pessoas só como bonecos genéricos sem rosto.

**Selos de fonte (pedido do Magno: fonte de cada número na tela):** cartão no alto, logo abaixo da pílula, com documento e página, letra média, fundo `tema.painel`. Um por dado, na hora em que o dado é dito, e fica até o próximo.

| Selo | Entra em | Texto |
|---|---|---|
| Total | `132` (0,60), no MAPA 1 | FONTE: RREO DEZ/2025 · PREFEITURA DE UNA · ANEXO 1, P. 1 |
| União, estado, Fundeb | `governo federal` (14,84), no MAPA 2 | FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (RECEITAS) |
| FPM | `FPM` (17,54), no MAPA 2 | FONTE: RREO DEZ/2025 · ANEXO 3, P. 1 (FPM) |
| ISS e IPTU | `E os impostos` (25,58) | FONTE: RREO DEZ/2025 · ANEXO 3, P. 1 (ISS, IPTU) |
| Por morador | `38 reais` (36,54) | CONTA DO VÍDEO: R$ 693.299 ÷ 17.998 MORADORES (IBGE) |
| Previsão | `previa` (38,40) | FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (PREVISÃO INICIAL) |
| Áreas | `Educacao: 59` (46,40) | FONTE: RREO DEZ/2025 · ANEXO 2, P. 1 A 3 |
| Câmara | `Camara de Vereadores` (69,30) | FONTE: TESOURO (SICONFI) · RREO DEZ/2025 · ANEXO 2 (LEGISLATIVA) |
| Assistência e o resto | `assistencia social` (72,70) | FONTE: RREO DEZ/2025 · ANEXO 2, P. 1 A 3 |
| Obras e dívida | `obras e equipamentos` (88,10) | FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (INVESTIMENTOS, AMORTIZAÇÃO) |
| Pessoal | `para pessoal` (99,50) | FONTE: RREO DEZ/2025 · ANEXO 1, P. 1 (PESSOAL E ENCARGOS) |
| O teto | `um teto` (101,80) | LEI DE RESPONSABILIDADE FISCAL · ART. 20 E 23 |
| 2024 | `2024:` (106,10) | FONTE: TESOURO (SICONFI) · RGF DEZ/2024 · PREFEITURA DE UNA |
| 2025 e a demissão | `2025:` (109,50) | FONTE: TESOURO (SICONFI) · RGF DEZ/2025 · ANEXO 1 (DESPESAS NÃO COMPUTADAS) |
| Lei permite | `A lei permite` (119,40) | LRF · ART. 19, § 1º, I |
| Conta nossa | `pelas nossas contas` (123,40) | CONTA DO VÍDEO: (69,1 + 16,2) ÷ 127,2 = 67% |
| Tesouro 2026 | `relatorio enviado` (128,20) | FONTE: TESOURO (SICONFI) · RGF AGO/2026 · PREFEITURA DE UNA |
| Portal 2026 | `relatorio do portal` (134,60) | FONTE: PORTAL DE UNA · RGF AGO/2026 · CONSOLIDADO · P. 1 (LIMITE 60%) |
| Pisos | `O que foi cumprido` (154,24) | FONTE: TESOURO (SICONFI) · RREO DEZ/2025 · ANEXO 14 |

**Paleta:**

| Uso | Campo do tema |
|---|---|
| fundo, céu escuro | `tema.fundo` |
| mesa (madeira escura, fosca) | `tema.objetoEscuro` misturado com `tema.areia` 25% (como no 014 e no 017) |
| chão da maquete | `tema.areia` (tom médio) e `tema.vegetacao` |
| mar e rio Una | `tema.agua` fosco, sem reflexo forte; areia da praia em `tema.areia` claro |
| prédios | `tema.objeto` e `tema.objetoClaro`, letreiros em `tema.objetoEscuro` |
| moedas e pilhas | dourado da paleta de apoio (o mesmo da série), nunca o acento |
| pilhas do "previsto" (fantasmas) | o mesmo dourado a 30% |
| o que passou do limite, o que caiu, o que ficou no zero, o caixote da demissão | marsala da paleta de apoio (`tema.alerta`), fosco |
| o que a cena aponta (número dito em destaque, contorno de Una, 67%, "?") | `tema.acento` (verde) |

**Mapa do mundo** (mesa redonda de raio 9 m; tampo em y = 0; a frente da câmera é z+):

| Lugar ou peça | Posição [x, y, z] | Observação |
|---|---|---|
| Mesa redonda | [0, 0, 0] | `MesaMaquete` (014/017) |
| Mar | faixa da borda direita, x de 6 a 9 | peça nova `MarMaquete`: água fosca com ondinha lenta (sem brilho que pisca), faixa de areia clara e 4 coqueiros baixos ★ |
| Rio Una | faixa curva de [-9, 0, -4] até o mar em [6, 0, -6] | peça nova `RioMaquete`: faixa de água de 1 m com margens verdes; "RIO UNA" como chip 2D só no plano aberto da cena 1 ★ |
| Ponte | [-1,5, 0, -5,2] | `PonteMini` (014/017) |
| Casinhas e morros da borda | anel de raio 7 a 8,5, atrás (z < -3) | `CasaMini` e `Casinha` (catálogo) baixas; morros como meias-esferas verdes |
| Cofre da prefeitura | [0, 0, 0] | `CofreFGTS` (catálogo), escala 1,6; abre em "para onde foi" |
| 132 pilhas | anel de raio 1,8 a 2,6 em volta do cofre | `PilhasDinheiro` (017), 1 pilha = 1 milhão; pilhas pequenas (metade da altura das do 017) para caber 132 |
| Loja (ISS) | [-3,4, 0, 2,6] | peça nova `LojaServicos`: fachada com toldo e letreiro "SERVIÇOS"; pilhas do ISS em [-3,4, 0, 3,8] |
| Casinha do IPTU | [-1,4, 0, 3,4] | `CasaMini` com etiqueta "IPTU"; uma pilha de 0,7 de altura na porta |
| Escola | [-5,0, 0, -2,0] | `Escola` (017), letreiro "EDUCAÇÃO"; pilhas em [-5,0, 0, -0,4] |
| Posto de saúde | [-2,0, 0, -3,8] | `PostoSaude` (017), letreiro "SAÚDE"; dois grupos de pilhas na frente: "ATENÇÃO BÁSICA" e "ADMINISTRAÇÃO DA SAÚDE" |
| Prefeitura | [2,4, 0, -3,8] | `Prefeitura` (017), letreiro "PREFEITURA" |
| Saneamento | [4,6, 0, -1,6] | `EstacaoSaneamento` (017), perto do mar |
| Câmara de Vereadores | [5,2, 0, 1,2] | `CamaraVereadores` (017), letreiro "CÂMARA"; ao lado dela, a assistência, para as duas caberem num plano só |
| Assistência social | [3,4, 0, 2,8] | `PredioAssistencia` (017), letreiro "ASSISTÊNCIA SOCIAL" |
| Turismo | [6,4, 0, 3,6] | peça nova `QuiosqueTurismo`: quiosque de praia com guarda-sol e placa "TURISMO" (na areia do mar) ★ |
| Transporte | [1,0, 0, 5,4] | `Onibus` (catálogo) andando devagar num trecho de estrada; placa "TRANSPORTE" |
| Esporte | [-4,8, 0, 4,8] | peça nova `QuadraMini`: quadra pequena com duas traves e placa "ESPORTE" |
| Lotes do zero | [-6,4, 0, 1,8] · [-6,8, 0, 3,6] · [-5,6, 0, 5,6] | peça nova `LoteVazio`: terreno cercado com placa "R$ 0" e o nome: "OBRAS NA CIDADE", "HABITAÇÃO", "MEIO AMBIENTE" |
| Obra (obras e equipamentos) | [-1,6, 0, 6,0] | material de obra (tijolos, `Cone`, `RoloCompactador`), sem guindaste (regra do 014) |
| Banco da dívida | [3,6, 0, 6,6] | `BancoDivida` (017): prédio com colunas e "PAGAMENTO DA DÍVIDA" (sem nome de banco real) |
| Régua do teto | [0, 0, 0] | `ReguaLimite` (017): coluna de vidro com a faixa do 54%; sobe no lugar do cofre (o cofre afunda) |
| Caixote da demissão | sai da régua para [2,2, 0, 0,8] | peça nova `CaixoteDemissao`: caixote marsala com etiqueta "INDENIZAÇÃO POR DEMISSÃO" e o valor |
| Dois relatórios | [-1,8, 0, 0] e [1,8, 0, 0] | `RelatorioPDF` (017) em pé, maior: "ENVIADO AO TESOURO · MAI A AGO 2026" e "PORTAL DA PREFEITURA · MAI A AGO 2026" |
| Calendário de 8 meses | [0, 0, 2,6] | `CalendarioMeses` (planejado no 017; se não existir, peça nova): 8 folhas que viram uma a uma |
| Placa da punição | [0, 0, 4,2] | `PlacaProibido` (017): "VERBAS EXTRAS" |
| Copos dos pisos | saúde [-1,8, 0, 0] · educação [1,8, 0, 0] | `CopoPiso` (017) |

**Regras visuais:**
- Dinheiro sempre dourado; o verde do acento só no que a cena aponta.
- Cada número dito digita na tela como chip, igual à fala (59 MI, 31 MI...); o valor exato do PDF vai pequeno embaixo (ex.: "R$ 59,06 MI").
- Neutro politicamente: sem nome de prefeito, sem partido, sem cor de partido. As duas perguntas aparecem como perguntas, sem palavra de acusação.
- Nada pisca; tudo acende em pelo menos 0,4 s. Cada número fica pelo menos 1,5 s na tela.

## 2.3 Mapa de palavras-chave

| # | Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|---|
| 1 | `Una recebeu` | 0,00 | MAPA 1 | Brasil visto de cima; câmera já descendo para a Bahia | M1 |
| 2 | `132` | 0,60 | MAPA 1 | contorno de Una acende em verde; selo do total | M1 |
| 3 | `milhoes de reais` | 1,58 | MAPA 1 | **R$ 132 MILHÕES** digita no meio do município | M1 |
| 4 | `reais em 2025` | 2,70 | MAPA 1 | chip "RECEBIDOS EM 2025" | M1 |
| 5 | `da Uniao` | 4,50 | MAPA 1 | ponto acende em Brasília, chip "UNIÃO" | M1 |
| 6 | `governo do estado` | 5,52 | MAPA 1 | ponto acende em Salvador, chip "ESTADO" | M1 |
| 7 | `dos impostos da propria` | 6,74 | MAPA 1 | o contorno de Una pulsa uma vez, chip "IMPOSTOS DA CIDADE" | M1 |
| 8 | `abri as contas` | 8,60 | MAPA 1 | etiqueta "PREFEITURA DE UNA" | M1 |
| 9 | `A pagina` | 9,88 | selo 2D | ★ ícone de página com "P. 1" entra no selo do topo | M1 |
| 10 | `Primeiro, de onde` | 11,84 | MAPA 2 | o mapa recua até ver Brasília, Salvador e Una | M2 |
| 11 | `de fora` | 14,02 | MAPA 2 | ★ seta tracejada fina da borda do mapa para Una | M2 |
| 12 | `governo federal` | 14,84 | MAPA 2 | seta de Brasília com moedinha correndo; selo das receitas | M2 |
| 13 | `72` | 15,68 | MAPA 2 | **UNIÃO · R$ 72 MI** | M2 |
| 14 | `FPM` | 17,54 | MAPA 2 | chip menor dentro da etiqueta: **FPM**; selo do FPM | M2 |
| 15 | `impostos federais` | 18,70 | MAPA 2 | ★ o FPM ganha um ícone de "fatia" saindo de um bolo | M2 |
| 16 | `43` | 20,90 | MAPA 2 | completa: **FPM · R$ 43 MI** | M2 |
| 17 | `O estado mandou` | 21,74 | MAPA 2 | seta de Salvador | M2 |
| 18 | `11` | 22,58 | MAPA 2 | **ESTADO · R$ 11 MI** | M2 |
| 19 | `Fundeb` | 23,36 | MAPA 2 | etiqueta **FUNDEB** junto de Una, com ícone de livro | M2 |
| 20 | `24` | 25,22 | MAPA 2 | completa: **FUNDEB · R$ 24 MI** | M2 |
| 21 | `E os impostos` | 25,58 | troca | whoosh; maquete vista de cima; 132 pilhas em volta do cofre; placar "1 PILHA = R$ 1 MILHÃO"; chips das três origens em fila no topo (UNIÃO 72 · ESTADO 11 · FUNDEB 24) | 1 |
| 22 | `propria cidade` | 26,88 | pilhas | ★ as pilhas que vieram de fora ficam a 50%; sobra destacado o grupo da cidade | 1 |
| 23 | `23` | 27,98 | 23 pilhas | o grupo da cidade sobe um pouco; chip **23 MI**; selo do ISS e IPTU | 1 |
| 24 | `ISS` | 29,98 | loja | `LojaServicos` sobe do chão; 16,5 pilhas deslizam para a frente dela; chip **ISS · 16,5 MI** | 1 |
| 25 | `imposto sobre servicos` | 30,90 | loja | letreiro "SERVIÇOS" acende | 1 |
| 26 | `IPTU` | 32,36 | casinha | casinha do IPTU sobe | 1 |
| 27 | `imposto da casa` | 33,10 | casinha | ★ telhado acende de leve | 1 |
| 28 | `693` | 34,38 | pilha pequena | uma pilha de 0,7 de altura chega na porta; chip **IPTU · 693 MIL** | 1 |
| 29 | `38 reais` | 36,54 | chip | "R$ 38 POR MORADOR"; selo da conta do vídeo | 1 |
| 30 | `O orcamento previa` | 38,02 | fantasmas | câmera sobe; o anel de 132 pilhas ganha, por dentro, 124,5 pilhas fantasmas; selo da previsão | 2 |
| 31 | `124` | 38,92 | chip | **PREVISTO · 124,5 MI** | 2 |
| 32 | `Entrou mais` | 40,56 | 7,5 pilhas | as pilhas que passaram do previsto acendem em verde; chip **RECEBIDO · 132 MI** | 2 |
| 33 | `7.300` | 41,66 | chip | **R$ 7.300 POR MORADOR** | 2 |
| 34 | `Segundo, para onde` | 43,72 | cofre | pílula PARA ONDE FOI; porta do cofre abre | 3 |
| 35 | `maior para o menor` | 45,20 | ★ régua 2D | régua fina na lateral, de "MAIOR" a "MENOR", com um marcador que desce a cada área | 3 |
| 36 | `Educacao: 59` | 46,40 | escola | sobe do chão; letreiro EDUCAÇÃO; selo das áreas | 3 |
| 37 | `59` | 47,10 | 59 pilhas | deslizam do cofre para a escola (em onda); chip **59 MI** | 3 |
| 38 | `Quase metade` | 48,40 | anel | ★ o anel vazio do cofre mostra a metade marcada; as 59 pilhas ocupam quase ela toda | 3 |
| 39 | `3 de cada 4` | 49,70 | pilhas | as 59 se dividem: 44 e 15; chip "ENSINO FUNDAMENTAL · 44 MI" no grupo maior | 3 |
| 40 | `Saude: 31` | 52,20 | posto | sobe; letreiro SAÚDE | 3 |
| 41 | `31` | 52,90 | 31 pilhas | deslizam; chip **31 MI** | 3 |
| 42 | `posto de saude` | 54,10 | grupo 1 | etiqueta "ATENÇÃO BÁSICA (POSTO DO BAIRRO)" | 3 |
| 43 | `14,8` | 56,40 | fantasmas | 14,8 pilhas fantasmas ao lado; chip **PREVISTO 14,8 MI** | 3 |
| 44 | `Gastou 10,4` | 58,50 | 10,4 pilhas | pilhas reais ficam menores que as fantasmas; a diferença (4,4) em marsala; chip **GASTO 10,4 MI** | 3 |
| 45 | `administracao da saude` | 60,30 | grupo 2 | etiqueta "ADMINISTRAÇÃO DA SAÚDE" | 3 |
| 46 | `6,2` | 61,40 | fantasmas | 6,2 pilhas fantasmas; chip **PREVISTO 6,2 MI** | 3 |
| 47 | `Gastou 13,3` | 62,50 | 13,3 pilhas | crescem por cima das fantasmas; chip **GASTO 13,3 MI** | 3 |
| 48 | `Mais que o dobro` | 64,20 | chip | "2×" grande entre os dois grupos | 3 |
| 49 | `Administracao da prefeitura` | 65,30 | prefeitura | sobe; letreiro PREFEITURA | 3 |
| 50 | `22 milhoes` | 66,70 | 22 pilhas | deslizam; chip **22 MI** | 3 |
| 51 | `Saneamento` | 68,00 | estação | sobe | 3 |
| 52 | `5.` | 68,70 | 5 pilhas | deslizam; chip **5 MI** | 3 |
| 53 | `Camara de Vereadores` | 69,30 | Câmara | sobe; letreiro CÂMARA; selo da Câmara | 3 |
| 54 | `3,8` | 70,50 | 3,8 pilhas | deslizam; chip **3,8 MI** | 3 |
| 55 | `Mais que toda` | 71,90 | assistência | o prédio da assistência sobe ao lado | 3 |
| 56 | `assistencia social` | 72,70 | letreiro | "ASSISTÊNCIA SOCIAL" acende; selo das áreas | 3 |
| 57 | `3,2` | 73,70 | 3,2 pilhas | deslizam; chip **3,2 MI**; ★ as duas fileiras lado a lado, a da Câmara mais alta | 3 |
| 58 | `Turismo` | 74,80 | quiosque | sobe na areia | 3 |
| 59 | `2,3` | 75,50 | 2,3 pilhas | chip **2,3 MI** | 3 |
| 60 | `Transporte` | 76,60 | ônibus | ônibus entra devagar na estrada | 3 |
| 61 | `1,2` | 77,40 | 1,2 pilha | chip **GASTO 1,2 MI** | 3 |
| 62 | `56 mil` | 78,70 | fantasma | um disco fininho, quase invisível, ao lado; chip **PREVISTO 56 MIL** | 3 |
| 63 | `Vinte vezes` | 80,50 | chip | "20×" | 3 |
| 64 | `Esporte` | 81,70 | quadra | sobe | 3 |
| 65 | `100 mil` | 82,80 | moedinhas | só 3 moedas soltas (0,1 pilha); chip **MENOS DE 100 MIL** | 3 |
| 66 | `ficou no zero` | 83,60 | lotes | câmera desliza para os três lotes vazios | 3 |
| 67 | `obras de infraestrutura` | 84,50 | lote 1 | placa "OBRAS NA CIDADE · R$ 0" sobe | 3 |
| 68 | `habitacao` | 86,30 | lote 2 | placa "HABITAÇÃO · R$ 0" | 3 |
| 69 | `meio ambiente` | 87,00 | lote 3 | placa "MEIO AMBIENTE · R$ 0" | 3 |
| 70 | `obras e equipamentos` | 88,10 | obra | material de obra aparece; selo das obras e da dívida | 3 |
| 71 | `2,9` | 89,50 | 2,9 pilhas | deslizam para a obra; chip **2,9 MI** | 3 |
| 72 | `So 2` | 90,80 | 100 moedas | ★ grade 10 × 10 de moedinhas na frente; 2 acendem | 3 |
| 73 | `A divida` | 92,30 | banco | `BancoDivida` sobe | 3 |
| 74 | `4,3` | 93,70 | 4,3 pilhas | deslizam para o banco, mais altas que as da obra; chip **4,3 MI** | 3 |
| 75 | `Terceiro, os salarios` | 95,40 | troca | whoosh; pílula OS SALÁRIOS; o que sobrou volta para o cofre | 4 |
| 76 | `maior conta` | 96,80 | pilhas | ★ todas as pilhas gastas voltam ao anel do cofre | 4 |
| 77 | `De cada 3` | 97,60 | 3 pilhas grandes | 3 pilhas grandes na frente | 4 |
| 78 | `2 foram` | 99,10 | 2 delas | ganham um crachá de servidor (boneco sem rosto em cima); chip **2 DE CADA 3 · 88,6 MI**; selo do pessoal | 4 |
| 79 | `um teto` | 101,80 | régua | o cofre afunda; a régua de vidro sobe no lugar; selo da lei | 4 |
| 80 | `54%` | 102,70 | faixa | faixa "TETO · 54%" acende no vidro | 4 |
| 81 | `da receita` | 103,40 | chip | "DA RECEITA" ao lado da faixa | 4 |
| 82 | `ano a ano` | 104,70 | ★ linha do tempo | três marcos no chão na frente: 2024 · 2025 · 2026 | 4 |
| 83 | `2024:` | 106,10 | marco 2024 | acende; selo RGF 2024 | 4 |
| 84 | `59%` | 107,10 | régua | o líquido sobe até 59%; chip **59%** | 4 |
| 85 | `Acima do teto` (1ª) | 108,20 | faixa | a parte acima de 54 fica marsala | 4 |
| 86 | `2025:` | 109,50 | marco 2025 | acende; o líquido desce; selo RGF 2025 | 4 |
| 87 | `54,35%` | 110,70 | régua | para em 54,35, rente à faixa; chip **54,35%** | 4 |
| 88 | `por pouco` | 113,60 | ★ lupa | lupa 2D mostra o fiozinho acima da faixa | 4 |
| 89 | `o relatorio tirou` | 116,10 | caixote | o caixote marsala sai de dentro da régua | 4 |
| 90 | `16 milhoes` | 117,00 | caixote | etiqueta **16 MI** | 4 |
| 91 | `indenizacao por demissao` | 118,10 | caixote | etiqueta "INDENIZAÇÃO POR DEMISSÃO" | 4 |
| 92 | `A lei permite` | 119,40 | chip | "A LEI PERMITE · LRF ART. 19"; selo do artigo | 4 |
| 93 | `Em 2024, essa` | 120,20 | marco 2024 | ao lado do marco 2024, um caixote vazio | 4 |
| 94 | `era zero` | 122,00 | chip | "2024: R$ 0" | 4 |
| 95 | `Sem o desconto` | 122,50 | caixote | o caixote volta para dentro da régua | 4 |
| 96 | `pelas nossas contas` | 123,40 | selo | selo da conta do vídeo | 4 |
| 97 | `67%` | 124,60 | régua | o líquido sobe até 67%; chip **67%** em verde (é o que a cena aponta) | 4 |
| 98 | `2026, ate agosto` | 125,90 | troca | marco 2026 acende; a régua desce; dois relatórios sobem da mesa | 5 |
| 99 | `relatorio enviado` | 128,20 | caderno 1 | "ENVIADO AO TESOURO · MAI A AGO 2026" abre; selo Tesouro 2026 | 5 |
| 100 | `56%` | 129,70 | caderno 1 | número grande **56%** na página | 5 |
| 101 | `sem desconto de demissao` | 130,80 | caderno 1 | chip "DEMISSÃO: R$ 0" | 5 |
| 102 | `Acima do teto` (2ª) | 132,40 | caderno 1 | faixa marsala "ACIMA DO TETO DE 54%" | 5 |
| 103 | `relatorio do portal` | 134,60 | caderno 2 | "PORTAL DA PREFEITURA · MAI A AGO 2026" abre; selo do portal | 5 |
| 104 | `mesmo periodo` | 135,56 | ★ datas | as duas datas acendem juntas | 5 |
| 105 | `junta prefeitura e Camara` | 136,52 | caderno 2 | chip "PREFEITURA + CÂMARA" | 5 |
| 106 | `42%` | 138,20 | caderno 2 | número grande **42%** | 5 |
| 107 | `Com 22` | 139,16 | caixote | caixote marsala **DEMISSÃO · 22 MI** sai de baixo do caderno 2 | 5 |
| 108 | `Duas perguntas` | 141,80 | "?" | um "?" grande entre os dois cadernos, em verde | 5 |
| 109 | `que demissoes` | 144,52 | cartão 1 | cartão "1 · QUE DEMISSÕES FORAM ESSAS?" | 5 |
| 110 | `qual numero vale` | 146,48 | cartão 2 | cartão "2 · QUAL NÚMERO VALE: 56% OU 42%?" | 5 |
| 111 | `Isso importa` | 147,44 | troca | cadernos descem; calendário sobe | 6 |
| 112 | `8 meses` | 149,82 | calendário | 8 folhas viram uma a uma até 151,5; chip **8 MESES** | 6 |
| 113 | `cortar o excesso` | 150,68 | ★ régua pequena | a parte marsala de uma régua mini desce | 6 |
| 114 | `perde verbas extras` | 152,52 | placa | `PlacaProibido` "VERBAS EXTRAS" sobe | 6 |
| 115 | `O que foi cumprido` | 154,24 | troca | dois copos sobem; selo dos pisos | 7 |
| 116 | `22%` | 156,16 | copo saúde | enche até 22%; chip **SAÚDE · 22%** | 7 |
| 117 | `minimo e 15` | 158,02 | risco | risco "MÍNIMO 15%" no copo; folga em verde | 7 |
| 118 | `31%` | 159,70 | copo educação | enche até 31%; chip **EDUCAÇÃO · 31%** | 7 |
| 119 | `minimo e 25` | 160,88 | risco | risco "MÍNIMO 25%" | 7 |
| 120 | `Em qual dessas` | 162,12 | maquete | câmera abre para a maquete inteira, todos os prédios acesos | 8 |
| 121 | `comentarios` | 164,80 | balão | balão de comentário 2D com "?" | 8 |
| 122 | `segue` | 165,66 | assinatura | **@eumagnoleite** em verde (padrão do perfil) | 8 |

122 eventos em 170 s (1 a cada 1,4 s).

## 2.4 Cenas com câmera

### MAPAS 1 e 2 (0,00 a 25,58 s), Kit Mapas
- M1 (0,00 a 11,84): Brasil inteiro → voo (bezier) até Una, enquadrado na faixa do meio (y 760 a 1200), aproximação lenta até 11,8.
- M2 (11,84 a 25,58): recua até a caixa Brasília–Salvador–Una (faixa y 470 a 1220), deriva lenta para a direita.
- Pílula: DE ONDE VEIO (a partir de 11,84). No M1: UNA, BAHIA.

### CENA 1: OS IMPOSTOS DA CIDADE (25,58 a 38,02 s)
Abre em: `quando('E os impostos')` · Sai em: `quando('O orcamento previa')` · Eventos 21 a 29
- 1a (25,58 a 29,9): de cima, maquete inteira · pos [0, 22, 14] · alvo [0, 0, 0] · ângulo 58° · grua descendo para 50°.
- 1b (29,9 a 38,0): arco até a loja e a casinha · alvo [-2,4, 0, 3,2] · enquadrar 7 m · ângulo 38°, girando 15° para a direita.
- Pílula: IMPOSTOS DA CIDADE
- Aha: quase todo o dinheiro vem de fora; a cidade arrecada pouco, e o IPTU quase nada.

### CENA 2: O PLANO (38,02 a 43,72 s)
Abre em: `quando('O orcamento previa')` · Sai em: `quando('Segundo, para onde')` · Eventos 30 a 33
- 2a: grua subindo sobre o cofre · alvo [0, 0, 0] · enquadrar 7 m · ângulo de 40° a 62°.
- Pílula: O PLANO
- Aha: entrou um pouco mais do que o previsto.

### CENA 3: PARA ONDE FOI (43,72 a 95,40 s)
Abre em: `quando('Segundo, para onde')` · Sai em: `quando('Terceiro, os salarios')` · Eventos 34 a 74
- 3a (43,7 a 52,2) escola: alvo [-4,2, 0, -1] · enquadrar 6,5 m · 36°, arco lento da direita para a esquerda.
- 3b (52,2 a 65,3) saúde: alvo [-2,0, 0, -2,6] · enquadrar 6 m · 32°; em "administração da saúde" avança 1 m para o grupo 2.
- 3c (65,3 a 69,3) prefeitura e saneamento: travelling da esquerda para a direita · alvo de [2,4, 0, -3] a [4,6, 0, -1,4] · 38°.
- 3d (69,3 a 74,8) Câmara × assistência: alvo [4,3, 0, 2] · enquadrar 5,5 m · 30° (as duas fileiras lado a lado).
- 3e (74,8 a 83,6) turismo, transporte, esporte: travelling pela frente da mesa · alvo de [6,4, 0, 3,6] a [-4,8, 0, 4,8] · 34°.
- 3f (83,6 a 88,1) lotes do zero: alvo [-6,2, 0, 3,6] · enquadrar 5 m · 44°.
- 3g (88,1 a 95,4) obra × dívida: alvo [1,0, 0, 6,3] · enquadrar 6 m · 30°, arco curto.
- Pílula: PARA ONDE FOI (troca para O QUE FICOU NO ZERO em 83,6 e OBRAS E DÍVIDA em 88,1)
- Aha: a educação leva quase metade; na saúde, a administração cresceu e o posto encolheu; obras quase nada.

### CENA 4: OS SALÁRIOS (95,40 a 125,90 s)
Abre em: `quando('Terceiro, os salarios')` · Sai em: `quando('2026, ate agosto')` · Eventos 75 a 97
- 4a (95,4 a 101,8): de frente para o cofre · alvo [0, 0,5, 0] · enquadrar 6 m · 28°.
- 4b (101,8 a 125,9): régua em pé no centro, linha do tempo no chão · alvo [0, 2, 1] · enquadrar 7 m · 18°, grua bem lenta para cima; em "o relatório tirou" avança para o caixote.
- Pílula: OS SALÁRIOS → O DESCONTO (em 114,3)
- Aha: o número só ficou perto do teto por causa de um desconto que não existia em 2024.

### CENA 5: DOIS RELATÓRIOS (125,90 a 147,44 s)
Abre em: `quando('2026, ate agosto')` · Sai em: `quando('Isso importa')` · Eventos 98 a 110
- 5a: os dois cadernos em pé · alvo [0, 1,2, 0] · enquadrar 6 m · 14°, arco de 20° da esquerda (Tesouro) para a direita (portal); em "Duas perguntas" recua 1 m.
- Pílula: DOIS RELATÓRIOS
- Aha: mesmo período, dois números diferentes.

### CENA 6: O QUE A LEI MANDA (147,44 a 154,24 s)
Eventos 111 a 114 · alvo [0, 0,6, 3,2] · enquadrar 5 m · 30°, avanço lento.
- Pílula: O QUE A LEI MANDA

### CENA 7: OS MÍNIMOS (154,24 a 162,12 s)
Eventos 115 a 119 · alvo [0, 0,8, 0] · enquadrar 5 m · 22°, arco curto.
- Pílula: O QUE FOI CUMPRIDO

### CENA 8: FECHO (162,12 a 171,28 s)
Eventos 120 a 122 · maquete inteira · pos de [0, 14, 16] a [0, 20, 12] · alvo [0, 0, 0] · grua subindo.
- Pílula: E VOCÊ?

## 2.5 Fatos e fontes

Tudo no `audio/fontes.md` (checado em 04/11/2026). Na tela, os números vão arredondados como na fala, e o exato pequeno embaixo:
- Recebido 131,88 · previsto 124,50 · União 72,27 · FPM 42,92 · estado 10,97 · Fundeb 23,94 · impostos 23,30 · ISS 16,54 · IPTU 0,693.
- Educação 59,06 · fundamental 44,11 · saúde 30,63 · atenção básica 14,81 → 10,41 · adm. saúde 6,16 → 13,33 · administração 21,68 · saneamento 5,03 · Câmara 3,77 · assistência 3,18 · turismo 2,26 · transporte 0,056 → 1,16 · esporte 0,097 · infraestrutura urbana 0,097 → 0.
- Investimentos 2,85 · dívida 4,35 · pessoal 88,60 de 131,96.
- Pessoal (RGF): 2024 58,79% · 2025 54,35% (16,25 mi descontados) · conta 67,1% · 2026 Tesouro 56,36% · portal consolidado 42,07% (22,02 mi descontados; limite do consolidado 60%).
- Pisos: saúde 22,44% · educação 31,01%.

**Conferir antes de publicar:** nova versão do RGF do 2º quadrimestre de 2026 no portal ou no Siconfi; explicação pública da prefeitura sobre a linha de demissões; percentuais de 22,44% e 31,01% nos PDFs de saúde e MDE do portal.

## 2.6 Trilha e sons

- `whoosh`: entrada do MAPA 2, troca mapa → 3D (25,58), início das cenas 3, 4, 5, 6, 7 e 8.
- `tique`: cada troca de pílula.
- `pop`: cada chip de número (eventos 13, 16, 18, 20, 23, 28, 29, 31, 33, 37, 41, 50, 52, 54, 57, 59, 61, 65, 71, 74, 84, 87, 100, 106, 116, 118).
- `subida`: pilhas deslizando do cofre (eventos 37, 41, 50) e o líquido subindo na régua (84, 97).
- `baque`: placas "R$ 0" (67, 68, 69), caixote da demissão saindo (89 e 107), placa da punição (114).
- `ding`: 67% (97) e "?" (108).
- `bip`: folhas do calendário (112).
- Trilha de fundo: a mesma usada no 017, se o Magno quiser (sem direitos autorais, em `sfx/trilha.wav`).

## 2.7 Arquivos

**Novos (Estúdio 3D):**
- `src/videos/orcamentouna/OrcamentoUna.tsx`: o vídeo (AUDIO_SEG 170.38, QUADROS 5138), com base no código do 017.
- `src/videos/orcamentouna/pecas.tsx`: cópia das peças do 017 que forem usadas, mais as novas:
  - `MarMaquete`: faixa de mar fosco com areia e coqueiros baixos.
  - `RioMaquete`: faixa curva de água com margens.
  - `LojaServicos`: loja com toldo e letreiro "SERVIÇOS".
  - `QuiosqueTurismo`: quiosque de praia com guarda-sol e placa.
  - `QuadraMini`: quadra pequena com traves.
  - `LoteVazio`: terreno cercado com placa "R$ 0" e nome.
  - `CaixoteDemissao`: caixote marsala com etiqueta e valor.
  - `CalendarioMeses`: 8 folhas que viram (se não houver pronta).
- `src/videos/orcamentouna/palavras.ts` (já pronto).
- `projetos/021. orçamento de una/mapas/una.mp4` (os dois trechos de mapa num MP4 só).

**Novos (Kit Mapas):**
- `src/videos/orcamento-una/` (dados, roteiro com os tempos deste vídeo e index.tsx), com base na estrutura do `orcamento-itabuna`, trocando todos os dados por Una.
- `scripts/dados-orcamento-una.py` (contorno de Una do IBGE 2932507, Bahia, pontos de Brasília e Salvador).
- Satélite em `public/satelite/orcamento-una/` (`npm run tiles -- orcamento-una`).

**Alterados:** `src/Root.tsx` nos dois kits (composições `OrcamentoUna`, `OrcamentoUnaGuia`, `OrcamentoUnaLimpo`, `CapaOrcamentoUna` no Estúdio; `OrcamentoUna` no Kit Mapas).

**Reaproveitados:** `MesaMaquete`, `PonteMini`, `PostoSaude`, `Escola`, `Prefeitura`, `EstacaoSaneamento`, `CamaraVereadores`, `PredioAssistencia`, `BancoDivida`, `PilhasDinheiro`, `RelatorioPDF`, `ReguaLimite`, `PlacaProibido`, `CopoPiso` (017) e `CofreFGTS`, `CasaMini`, `Casinha`, `Onibus`, `Cone`, `RoloCompactador` (catálogo).

Total: 5138 quadros; o `render.mjs` divide em partes.

## 2.8 Origem das escolhas

Das regras do `_aprendizados.md`:
- Vídeo de uma cidade usa só documentos dela (017 e pedido do Magno no 021).
- Fonte de cada informação em evidência na tela, com documento e página (016 e pedido do Magno no 021).
- Formato da série de orçamento e capa "132 milhões. / Para onde / foi cada / real?" (017).
- Dois kits: trechos de mapa do Kit Mapas num só `OffthreadVideo` (015 e 017), pedido de novo pelo Magno no 021.
- Suspeitas como "perguntas sem resposta oficial", numeradas (016).
- Sem rótulo que insinue motivo (017); neutralidade.
- Nada pisca; mínimo de 0,4 s para acender (global).
- Obra sem guindaste (014).

Escolhas minhas como diretor: 1 pilha = 1 milhão (para 132 pilhas caberem no anel, como as 110 do 017); mar e rio Una na maquete; pilhas fantasmas para cada "previsto × gasto"; o caixote da demissão saindo e voltando da régua; os dois cadernos lado a lado com o "?". Os itens ★ são extras sugeridos.

## Ajustes feitos na programação (04/11/2026)
- O anel tem 138 lugares (132 pilhas cheias e quebradas: cada área tem uma pilha incompleta).
- Números com vírgula chamados pela frase ("Vereadores: 3,8"), porque o quando() lê "3,8" como "38".
- Câmera da cena 6 mais perto do calendário; cena 7 mostra os dois copos juntos, com rótulo de 22% e 31%. Copo vai até 36% (a educação passa de 30%).
- Atenção básica: o que faltou gastar (14,8 − 10,4) fica com as pilhas fantasmas em marsala.
