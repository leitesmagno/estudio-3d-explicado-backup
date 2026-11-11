# Plano de cenas: 032. orçamento de belmonte (versão 4, aprovada em 06/11/2026)

Código `orcamentobelmonte` · Nome `OrcamentoBelmonte` · Perfil @eumagnoleite · série Magno Explica.
Molde: **034 Canavieiras, versão mais nova** (código `src/videos/orcamentocanavieiras/`, só leitura: copio para `orcamentobelmonte` e troco os dados). Kit Mapas na abertura + Estúdio 3D na maquete. Versão 3 em `antigos/plano (versão 3).md`.

Pedidos da pessoa para esta versão (06/11/2026): sem segurança pública; só dados do TCM-BA; receita = só o total arrecadado; 100% da despesa por setor nos três anos, com a Câmara; **pilhas de cada ano na frente de cada setor**, poucas e proporcionais; maquete arrumada; **mais didático e mais dinâmico**.

## 2.1 Narração
- Roteiro v4: `audio/roteiro-falado.txt`, 421 palavras (mesmo tamanho de Canavieiras: 419 palavras = 172,8 s). Previsão: cerca de 2:53 com a fala a 1,15x.
- Tempos, quadros e palavras repetidas: preencho depois da sincronia. Repetidas já previstas: "Educação", "Saúde", "Obras", "Administração", "Dívidas", "Câmara", "Assistência", "Cultura", "Turismo", "Esporte", "Agricultura" (3x cada), "zero" (3x), "Arrecadou" (3x), "Gastou" (2x), "Tribunal" (2x), "sem licitação" (2x). No `quando()`, sempre com a palavra seguinte (`quando('Educacao 45')`, `quando('Turismo 2 milhoes e 100')`).

## 2.2 Ideia e mundo
**A maquete de Belmonte na mesa redonda.** O cofre da prefeitura fica no meio. Em volta, na borda, os prédios dos setores sobem um por um na hora em que cada setor é dito, e **ficam até o fim**. Cada ano tem uma cor (2024 dourado, 2025 verde-azulado, 2026 rosado). Quando um setor é dito, **as pilhas daquele ano saem voando do cofre** e pousam numa torre na frente do prédio. Assim, no fim de 2026, cada prédio tem **três torres lado a lado**, uma por ano, e dá para comparar só olhando.

- **Escala:** 1 pilha = R$ 2 milhões, igual a Canavieiras. Educação, o maior setor, fica com cerca de 27 pilhas (3 andares de 3x3). Setor com menos de R$ 2 milhões ganha uma pilha baixinha, proporcional (ex.: R$ 400 mil = 1/5 de pilha). Setor zerado: sem pilha, prédio cinza.
- ★ **Didático 1: a barra dos 100 reais.** Uma barrinha compacta no alto da tela (y ~600, sem tapar a maquete), dividida em 100 quadradinhos. A cada setor dito, a fatia dele pinta na cor do setor, e a plaquinha diz "DE CADA 100 REAIS, 43 FORAM PARA A EDUCAÇÃO". No fim do ano, ela chega a 100 e aparece "100% CONTADO". Ela zera na virada do ano. Assim a pessoa vê que nada ficou de fora.
- ★ **Didático 2: arrecadou x gastou.** Na abertura de cada ano, o cofre se enche com o que a prefeitura arrecadou (chip "ARRECADOU R$ 104,5 MI"), e a tampa abre no "Gastou". Em 2026 sobram **5 pilhas vermelhas fora do cofre** (quase R$ 10 milhões a mais do que arrecadou), com a plaquinha "COMPROMETEU QUASE R$ 10 MI A MAIS".
- ★ **Didático 3: comparação na hora.** Quando um setor é dito em 2025 ou 2026, as plaquinhas dos anos anteriores dele aparecem juntas, cada uma na cor do ano (ex.: em 2026, "2024: R$ 44,9 MI · 2025: R$ 52,1 MI · 2026: R$ 53,0 MI"). Nos números que mudaram muito, uma plaquinha esperta no topo ("ADMINISTRAÇÃO: +62% EM 1 ANO").
- ★ **Didático 4: a secretaria que mudou de casa.** Em 2024, o teatro (cultura) e o palco (turismo) sobem colados, com uma placa só por cima: "UMA SECRETARIA SÓ". As pilhas de 2024 ficam entre os dois. Em 2025 e 2026, cada um ganha a sua torre. Em 2025, embaixo da plaquinha do turismo, uma linha pequena: "NO BALANÇO, ESTAVA EM ESPORTE" (é a verdade do documento e mostra que conferimos).
- **Zeros:** sirene da defesa civil, ônibus e casinha de bicho sobem **cinza e vazios**, cada um com a plaquinha "R$ 0".
- **Selos de fonte** (um por bloco, pequenos no alto): "FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA"; o mesmo para 2025; "FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · VALORES EMPENHADOS"; "FONTE: SIGA SET/2026 · SEC. DE TURISMO E DE CULTURA"; "FONTE: TCM-BA · ACÓRDÃOS 32484e25 E 10859e25".
- Legenda no padrão da série, pílula no topo e marca d'água @eumagnoleite pequena quicando pela tela, do primeiro ao último quadro.

**Paleta (tudo do tema `eumagnoleite`, nada de cor escrita no código):** fundo `fundo`; mesa `MesaMaquete`; prédios `objeto`; setores `festa.*` (como no 034); anos `coresAno` do 034; falta de dinheiro e "R$ 0" em `alerta`; acento só no reforço do turismo, no "quase 10 a mais" e na pergunta final.

### Mapa do mundo (mesa de raio ~8,5; chão da mesa em y = 0)
| lugar | posição | observação |
|---|---|---|
| Cofre da prefeitura | [0, 0, 0] | `CofreFGTS`, escala 0,6; sai de cena no "Agora repara" |
| Pilhas vermelhas de 2026 | [0, 0, 4,25] | 5 pilhas, na frente do cofre |
| 14 prédios dos setores | anel de raio 7,45 | ordem na borda: Educação, Saúde, Obras, Dívidas, Administração, Cultura + Turismo (colados), Assistência, Câmara, Esporte, Agricultura, e no fim, juntinhos, Defesa civil, Transporte, Proteção animal |
| Torres por ano | ao lado de cada prédio | 2024 e 2025 lado a lado, 2026 um passo à frente, entre as duas (fórmula `posTorre` do 034) |
| Miolo do "Agora repara" | centro da mesa | palco do turismo em close e teatro da cultura, vistos juntos |
| Tribunal (TCM-BA) | [2,2, 0, 1,25] | `PredioTCM`; sobe no "O Tribunal" |
| Caixas de material gráfico | [0,8, 0, 0,4] | pilha de caixas de papel com "?"; carimbo "ENTREGA NÃO COMPROVADA" |
| Pastas das denúncias | [-1,2, 0, 0,6] | duas pastas "LIMPEZA" e "TRANSPORTE ESCOLAR" com "EM ANÁLISE" |
| Casas, coqueiros e rio | arco vazio da borda | Belmonte é litoral sul, foz do Jequitinhonha; nunca na frente da câmera |

## 2.3 Trechos de mapa (Kit Mapas, `orcamento-belmonte`)
| trecho | o que acontece |
|---|---|
| A · BELMONTE | voo do Brasil até Belmonte, no litoral sul da Bahia; contorno acende; tags "PARA ONDE FOI CADA REAL?", "TRIBUNAL DE CONTAS DOS MUNICÍPIOS", "2024 · GESTÃO CARLOS GAMA" |
| B · ARRECADOU 2024 | fica na cidade e aproxima devagar; só "R$ 104,5 MI · ARRECADOU EM 2024". **Sem setas de União e Estado** (tiro as setas da v3) |

## 2.4 Mapa de palavras-chave (tempos depois da sincronia)
Em todo número: plaquinha pequena + valor exato + empurrão leve de câmera (0,5 s) + som.

| # | `quando` | objeto | o que acontece | plaquinha | cena |
|---|---|---|---|---|---|
| 1 | `Para onde` | mapa | voo começa | PARA ONDE FOI CADA REAL? | A |
| 2 | `Tribunal de Contas` | mapa | tag do TCM | | A |
| 3 | `2024 gestao` | mapa | tag do ano e do gestor | 2024 · GESTÃO CARLOS GAMA | A |
| 4 | `arrecadou 104` | mapa | valor na cidade | R$ 104,5 MI · ARRECADOU EM 2024 | B |
| 5 | `Gastou 105` | maquete | maquete aparece; cofre abre; barra de 100 zerada | GASTOU R$ 105,1 MI | 2024 |
| 6 | `Educacao 45` | escola | escola sobe; 22 pilhas douradas voam do cofre | 43 DE CADA 100 REAIS | 2024 |
| 7 | `Saude 21` | posto | sobe; 11 pilhas | 20 DE CADA 100 | 2024 |
| 8 | `Obras e servicos urbanos 11` | rua com caminhão de lixo | sobe; 6 pilhas | 11% | 2024 |
| 9 | `Dividas 9` | banco com cadeado | sobe; 5 pilhas | 9% | 2024 |
| 10 | `Administracao 6` | prefeitura | sobe; 3,4 pilhas | 6% | 2024 |
| 11 | `Cultura e turismo` | teatro + palco | sobem colados; placa "UMA SECRETARIA SÓ"; 2,1 pilhas | 4% | 2024 |
| 12 | `Assistencia social 3` | assistência | sobe; 1,8 pilha | 3% | 2024 |
| 13 | `Camara de Vereadores` | Câmara | sobe; 1,7 pilha | 3% | 2024 |
| 14 | `Esporte e lazer` | quadra | sobe; pilha baixinha | R$ 223 MIL | 2024 |
| 15 | `Agricultura e meio ambiente 220` | trator | sobe; pilha baixinha | R$ 223 MIL | 2024 |
| 16 | `Defesa civil transporte` | sirene, ônibus, casinha | sobem cinza, um por palavra | R$ 0 em cada | 2024 |
| 17 | `animal zero` | barra | barra fecha 100 | 100% CONTADO | 2024 |
| 18 | `2025 gestao` | pílula | troca de ano; legenda das cores dos anos | 2025 · GESTÃO IÊDO ELIAS | 2025 |
| 19 | `Arrecadou 125` | cofre | cofre enche | ARRECADOU R$ 125,8 MI | 2025 |
| 20 | `Gastou 126` | cofre | tampa abre | GASTOU R$ 126,4 MI | 2025 |
| 21 a 31 | cada setor de 2025 | prédio já de pé | o prédio acende, as pilhas verde-azuladas voam; a plaquinha de 2024 aparece junto | % do ano + comparação | 2025 |
| 24 | `62 por cento a mais` | prefeitura | as duas torres lado a lado, a de 2025 cresce | ADMINISTRAÇÃO: +62% EM 1 ANO | 2025 |
| 28 | `Turismo 2 milhoes e 100` | palco | primeira torre só dele | NO BALANÇO, ESTAVA EM ESPORTE | 2025 |
| 30 | `Esporte 280` | quadra | pilha baixinha | R$ 278 MIL | 2025 |
| 32 | `2026 ate setembro` | pílula | troca de ano | 2026 · ATÉ SETEMBRO | 2026 |
| 33 | `Arrecadou 111` | cofre | cofre enche | ARRECADOU R$ 111,5 MI | 2026 |
| 34 | `comprometeu 121` | cofre | o cofre não dá conta: 5 pilhas vermelhas nascem fora | COMPROMETEU R$ 121,3 MI | 2026 |
| 35 | `quase 10 a mais` | pilhas vermelhas | baque | QUASE R$ 10 MI A MAIS | 2026 |
| 36 a 46 | cada setor de 2026 | prédios | pilhas rosadas voam; as plaquinhas de 2024 e 2025 aparecem juntas | % + três anos | 2026 |
| 41 | `Turismo 4 milhoes e 800` | palco | a torre de 2026 passa as outras | MAIS QUE O DOBRO DE 2025 | 2026 |
| 47 | `Agora repara` | câmera | cofre e torres dos outros setores se apagam; câmera vai ao palco e ao teatro, lado a lado | | REPARA |
| 48 | `700 mil previstos` | palco | placa "PREVISTO NO ORÇAMENTO" com 1/3 de pilha | R$ 715 MIL PREVISTOS | REPARA |
| 49 | `4 milhoes e 900 de reforco` | palco | pilhas de reforço chegam voando em acento | +R$ 4,9 MI DE REFORÇO | REPARA |
| 50 | `ja gastou quase` | palco | torre fica em 4,8 | R$ 4,79 MI GASTOS | REPARA |
| 51 | `bandas e produtoras` | palco | bonequinhos genéricos de banda sobem no palco (sem rosto) | SEM LICITAÇÃO: R$ 2,28 MI PAGOS | REPARA |
| 52 | `a Cultura tinha` | teatro | placa "PREVISTO" com 2,3 pilhas | R$ 4,6 MI PREVISTOS | REPARA |
| 53 | `2 milhoes e 900 cortados` | teatro | 1,45 pilha fica cinza e afunda na mesa | R$ 2,9 MI CORTADOS | REPARA |
| 54 | `gastou 400` | teatro | sobra 1/5 de pilha | R$ 400 MIL GASTOS · 12 VEZES MENOS QUE O TURISMO | REPARA |
| 55 | `O Tribunal multou` | TCM | prédio do Tribunal sobe | | TCM |
| 56 | `1.500 reais` | carimbo | carimbo "MULTA R$ 1.500" | | TCM |
| 57 | `material grafico` | caixas | caixas de papel aparecem | COMPRA DE R$ 3,9 MI | TCM |
| 58 | `nao comprovou` | caixas | "?" sobe nas caixas | ENTREGA NÃO COMPROVADA | TCM |
| 59 | `Advertiu` | pasta | carimbo "ADVERTÊNCIA" | PAPÉIS FORA DO PRAZO | TCM |
| 60 | `limpeza e o transporte` | duas pastas | caminhão de lixo e ônibus escolar em miniatura ao lado | DENÚNCIAS EM ANÁLISE | TCM |
| 61 | `Gastar nao` | câmera | abre a maquete inteira | GASTAR NÃO É CRIME | PERGUNTA |
| 62 | `show ganhou reforco` | palco | palco acende em acento | | PERGUNTA |
| 63 | `cultura perdeu` | teatro | teatro fica cinza | | PERGUNTA |
| 64 | `Segue o` | tela | @eumagnoleite em verde | | FIM |

## 2.5 Cenas e câmera (enquadramento automático da base, sempre com arco ou grua)
- **A e B · MAPA** (Kit Mapas, até "Gastou 105"): voo Brasil → Belmonte, depois aproxima devagar. Pílula BELMONTE · PARA ONDE FOI CADA REAL.
- **2024 · PARA ONDE FOI**: abre na mesa inteira, de frente e alta (~37°); na primeira pilha, câmera vai de prédio em prédio por dentro da mesa, alta (direção y ~0,95), segurando parada em cada prédio até 0,55 s antes do próximo (regra do 034). Zeros: plano largo dos três juntos. Aha: "a pessoa vê o dinheiro saindo do cofre e indo para cada setor".
- **2025 · PARA ONDE FOI**: abre de cima, gira de prédio em prédio, com as torres de 2024 e 2025 lado a lado no quadro. Aha: "comparo na hora com o ano anterior".
- **2026 · ATÉ SETEMBRO**: close no cofre com as pilhas vermelhas, depois de prédio em prédio com as três torres. Aha: "2026 já passou do que arrecadou".
- **O QUE MUDOU** (Agora repara): câmera desce para o palco e o teatro lado a lado, olhando de dentro da mesa, perto (5 m); arco lento entre os dois.
- **O TRIBUNAL**: plano médio do TCM com as caixas e as pastas; empurrão em cada carimbo.
- **A PERGUNTA**: abre a maquete inteira, de cima, com o palco aceso e o teatro cinza.

## 2.6 Fatos e fontes
Todos conferidos em `audio/fontes.md` (revisão de 06/11/2026). Na tela vai o valor exato; na fala, arredondado. Conferir antes de publicar: se as denúncias 08808e26 e 15247e26 continuam sem julgamento.

## 2.7 Sons
`whoosh` na troca de cena; `tique` na pílula; `pop` em cada setor e em cada pilha que pousa (bem baixo); `subida` no reforço do turismo; `baque` nos zeros, nas pilhas vermelhas e no corte da cultura; `impacto` nos carimbos; `ding` no "Segue o".

## 2.8 Arquivos
- **Novos ou trocados:** `src/videos/orcamentobelmonte/OrcamentoBelmonte.tsx` (refeito a partir do 034; o antigo vai para `antigos/`), `pecas.tsx` (caixas de papel, bonequinhos de banda, placa "UMA SECRETARIA SÓ", pastas de denúncia), `palavras.ts` (da sincronia).
- **Reaproveitados:** do 034, `PredioTexto`, `PlacaObra`, `Trabalhador`; da Itabuna, `Escola`, `PostoSaude`, `RuaServicos`, `Prefeitura`, `PredioAssistencia`, `CamaraVereadores`, `BancoDivida`, `TeatroMini`, `BaseDefesaCivil`, `PredioTCM`, `MesaMaquete`, `PilhasDinheiro`; do catálogo, `CofreFGTS`, `Onibus`, `CasaMini`, `ArvoreRedonda`.
- **Kit Mapas:** `src/videos/orcamento-belmonte` (tirar as setas de origem, deixar só o total arrecadado) e mapa novo em `projetos/032.../mapas/belmonte.mp4`.
- Render em partes de 400 quadros (vídeo acima de 2,5 min).

## 2.9 Origem das escolhas
- **Das regras e pedidos:** sem segurança; só TCM; "arrecadou"; 100% por ano com a Câmara; prédios sobem e ficam; dinheiro voa do cofre; 1 pilha = R$ 2 mi; uma cor por ano; plaquinhas dos anos anteriores juntas; plaquinhas pequenas, nunca cartão grande; câmera segurando em cada prédio; marca d'água quicando; vídeo até 2:55.
- **Escolhas minhas (★):** barra dos 100 reais; cofre que enche e as pilhas vermelhas de 2026; placa "UMA SECRETARIA SÓ" e a nota "NO BALANÇO, ESTAVA EM ESPORTE"; corte da cultura afundando na mesa; caixas com "?" na multa; palco aceso e teatro cinza na pergunta.
