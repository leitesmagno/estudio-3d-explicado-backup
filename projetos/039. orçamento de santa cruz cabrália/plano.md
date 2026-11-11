# Plano de cenas: 039. orçamento de santa cruz cabrália (versão 1, para aprovação)

Código `orcamentocabralia` · Nome `OrcamentoCabralia` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **Paratinga v2 (035)**, `src/videos/orcamentoparatinga/` (cofre no meio, pilhas do ano em volta, dinheiro voando para a casinha na palavra, câmera num sentido só, plaquinhas em todos os setores, campo de futebol do esporte). **Kit Mapas** na abertura + **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena quicando pela tela inteira, do início ao fim.

**Regras que valem aqui:** só valores, sem porcentagem; sem nome de gestor; sem segurança pública; receita = total declarado ao TCM ("arrecadou"); todo setor falado tem plaquinha, por menor que seja; plaquinha do setor sai quando a voz passa para o próximo; nada de cartão grande tapando a maquete; mesa sem rio (`MesaMaquete rio={false}`); tom informativo, sem "crime", "suspeito" ou "irregular" na tela.

## 1. Narração
- `audio/narracao-norm.wav`: **177,89 s** (voz Adam, escolha do Magno; pausas de 0,22 s; 1,27x, porque a 1,2x dava 188 s). `AUDIO_SEG = 177.89` · `QUADROS = 5364`.
- 436 palavras, iguais ao roteiro v4 aprovado. A última ("informações.") termina em 177,5 s. Sem buracos acima de 1,5 s.
- Repetidas: "gastou" no gancho (0,94 s) → os "Gastou" dos anos são as ocorrências 2, 3 e 4 (`quando('Gastou 190')`, `quando('Gastou 211', 2)`, `quando('Gastou 154')`). Cada setor 3×, sempre com o número junto no `quando()` (ex.: `quando('Educacao 95')`) ou com a ocorrência. "Câmara" de 2024 é `Camara de Vereadores`. "Estradas da zona rural" 2× (65,5 / 103,3). "estradas" também nos achados (141,0 / 148,2).

## 2. A maquete
- **Mesa redonda** com o **cofre no meio**. Em volta do cofre, a **pilha do ano**. Escala: **1 pilha = R$ 3 milhões** (10 moedas de R$ 300 mil). O orçamento é 1,3 vez o de Paratinga: com R$ 3 mi o anel fica com 63 a 70 pilhas, perto das 80 de Paratinga, sem lotar. Valor abaixo de R$ 300 mil vira 1 moeda. O placar diz: "1 PILHA = R$ 3 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026".
- **Cor por ano:** dourado 2024 · verde 2025 · rosa 2026.
- **Setores em volta da mesa, sentido horário, na ordem da fala:**

| # | setor | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 95,6 | 102,0 | 68,4 |
| 2 | Saúde | posto | 30,8 | 35,4 | 27,9 |
| 3 | Administração | prefeitura | 23,7 | 26,8 | 19,3 |
| 4 | Obras e serviços urbanos | rua com caminhão de lixo, poste e rolo de asfalto | 15,8 | 13,3 | 10,1 |
| 5 | Estradas da zona rural | ★ estrada de terra com motoniveladora e placa "ZONA RURAL" (peça nova). O lugar fica vazio em 2024 e a estrada sobe em 2025 | (não dito) | 9,0 | 7,3 |
| 6 | Câmara de Vereadores | prédio com cúpula | 5,4 | 6,7 | 5,8 |
| 7 | Dívidas | banco com cadeado | 8,1 | 7,0 | 6,9 |
| 8 | Cultura e esporte | colunas "CULTURA" + **campo de futebol** (peça `quadra`, sem alterar) lado a lado, uma plaquinha só | 1,2 | 1,3 | 0,71 |
| 9 | Turismo | palco com bandeirinhas "TURISMO" (é onde estão as bandas e festas) | 3,2 | 3,5 | 3,7 |
| 10 | Assistência social | prédio "ASSISTÊNCIA" | 4,7 | 4,1 | 3,2 |
| 11 | Agricultura | trator | 0,37 | 0,69 | 0,39 |
| 12 | Meio ambiente | árvores | 1,2 | 0,79 | 0,50 |
| 13 | Assuntos indígenas | prédio baixo com letreiro "ASSUNTOS INDÍGENAS" (`PredioTexto`, sem cocar, sem rosto, sem símbolo de povo) | 0,42 | 0,53 | 0,26 |
| 14 | Água e esgoto | estação de saneamento **cinza**, com placa "EMBASA · ESTADO" | zero | zero | (não dito) |
| 15 | Proteção animal | casinha de cachorro **cinza** | zero | zero | (não dito) |

- Turismo (9) e Assistência (10) ficam vizinhos, para o achado das festas. Obras (4) e Estradas (5) ficam vizinhos, para o achado das ruas.
- **Torres na frente de cada casinha:** uma por ano, lado a lado, finas. Plaquinhas dos anos anteriores na cor do ano ao lado da do ano falado.
- **"A mais":** torre vermelha ao lado do cofre: 2024 = 0,26 pilha (uma pilha baixinha, R$ 770 MIL A MAIS), 2025 = 2,1 pilhas (R$ 6,4 MI A MAIS).
- **2026, "já comprometeu":** ao lado do cofre, um anel **tracejado rosa** (pilhas fantasma, 22 pilhas) com a plaquinha "JÁ COMPROMETIDO: + R$ 67 MI". Sem torre vermelha (a voz não diz "a mais").
- Borda da mesa: mar e areia (Cabrália é litoral), faixa fina, sem rio cruzando a mesa.

## 3. Mapa (Kit Mapas, 0 → 10,8 s, vira `mapas/cabralia.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · SANTA CRUZ CABRÁLIA | 0 → 6,4 s | voo do Brasil até Santa Cruz Cabrália, no litoral sul da Bahia (satélite); contorno do município acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,0 s), "TRIBUNAL DE CONTAS" (5,5 s) |
| B · ARRECADOU 2024 | 6,4 → 10,8 s | tag "2024" (6,4 s); "R$ 189,5 MI · ARRECADOU EM 2024" na cidade (8,2 s); câmera aproxima devagar |
Sem nome de gestor. IBGE do município: 2928109 (conferir no Kit Mapas).

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s).

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Santa Cruz` | 0,00 | voo começa; tag PARA ONDE FOI CADA REAL? | mapa A |
| 2 | `Tribunal de Contas` | 5,48 | tag TCM-BA | mapa A |
| 3 | `2024 A prefeitura` | 6,44 | tag 2024 | mapa B |
| 4 | `arrecadou 189` | 8,20 | R$ 189,5 MI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 190` | 10,78 | entra a maquete; 63 pilhas douradas sobem em volta do cofre; chip GASTOU R$ 190,3 MI | 2024 |
| 6 | `Quase 800` | 12,82 | torre vermelha baixinha ao lado do cofre: R$ 770 MIL A MAIS; baque | 2024 |
| 7 | `Educacao 95` | 14,76 | escola sobe; 32 pilhas voam do cofre para a escola; R$ 95,6 MI | 2024 |
| 8 | `Saude 30` | 17,40 | posto; R$ 30,8 MI | 2024 |
| 9 | `Administracao 23` | 19,34 | prefeitura; R$ 23,7 MI | 2024 |
| 10 | `Obras e servicos` (1) | 21,64 | rua; R$ 15,8 MI | 2024 |
| 11 | `Camara de Vereadores` | 24,32 | Câmara; R$ 5,4 MI (a câmera passa pelo lugar vazio das estradas) | 2024 |
| 12 | `Dividas 8` | 27,00 | banco; R$ 8,1 MI | 2024 |
| 13 | `Cultura e esporte` (1) | 28,10 | colunas e campo de futebol sobem juntos; R$ 1,2 MI | 2024 |
| 14 | `Turismo` (1) | 30,68 | palco com bandeirinhas; R$ 3,2 MI | 2024 |
| 15 | `Assistencia social` (1) | 32,68 | assistência; R$ 4,7 MI | 2024 |
| 16 | `Agricultura` (1) | 35,34 | trator; R$ 370 MIL | 2024 |
| 17 | `Meio ambiente` (1) | 37,44 | árvores; R$ 1,2 MI | 2024 |
| 18 | `Assuntos indigenas` (1) | 39,42 | prédio "ASSUNTOS INDÍGENAS"; R$ 420 MIL | 2024 |
| 19 | `Agua e esgoto` | 41,84 | estação de saneamento sobe **cinza**; chip R$ 0 | 2024 |
| 20 | `quem cuida` | 43,92 | placa "EMBASA · DO ESTADO" acende na estação | 2024 |
| 21 | `Protecao animal` | 45,68 | casinha de cachorro sobe cinza; R$ 0 | 2024 |
| 22 | `nem existe` | 47,08 | plaquinha "NEM ESTÁ NO ORÇAMENTO" | 2024 |
| 23 | `2025 Arrecadou` | 48,22 | vista de cima; pílula 2025; 70 pilhas verdes sobem em volta do cofre | 2025 |
| 24 | `Arrecadou 204` | 49,54 | R$ 204,8 MI | 2025 |
| 25 | `Gastou 211` (2) | 52,10 | R$ 211,2 MI | 2025 |
| 26 | `6 milhoes e 400` | 54,36 | 2ª torre vermelha: R$ 6,4 MI A MAIS; baque | 2025 |
| 27 a 38 | os setores de 2025 | 56,46 → 82,02 | mesmo giro horário; pilhas verdes voam do cofre; torre verde ao lado da dourada; plaquinha dourada de 2024 junto. Em `Estradas da zona rural` (65,46) a **estrada sobe agora**, com 3 pilhas verdes (R$ 9 MI) | 2025 |
| 39 | `Agua esgoto e protecao` | 84,38 | estação e casinha cinza acendem o contorno devagar (0,5 s) | 2025 |
| 40 | `zero de novo` | 86,12 | "R$ 0 DE NOVO" nas duas | 2025 |
| 41 | `2026 ate setembro` | 87,24 | vista de cima; pílula 2026 · ATÉ SETEMBRO; 52 pilhas rosa em volta do cofre | 2026 |
| 42 | `Arrecadou 161` | 89,00 | R$ 161 MI | 2026 |
| 43 | `Gastou 154` | 91,06 | R$ 154,5 MI · LIQUIDADO | 2026 |
| 44 | `ja comprometeu` | 93,04 | anel tracejado rosa ao lado do cofre: "JÁ COMPROMETIDO: + R$ 67 MI" | 2026 |
| 45 a 57 | os setores de 2026 | 95,36 → 120,90 | mesmo giro; terceira torre (rosa) com as plaquinhas dourada e verde | 2026 |
| 58 | `Agora repara` | 123,42 | câmera sobe; ★ no alto da mesa, fora do anel, nasce um **caminhão da União** parado na entrada da mesa, com 4 caixas tracejadas na carroceria | convênios |
| 59 | `previu quase 25` | 125,94 | contorno tracejado de 8 pilhas: "PREVISTO DA UNIÃO: R$ 24,6 MI" | convênios |
| 60 | `escola` / `creche` / `esgoto e drenagem` | 128,80 / 129,38 / 129,90 | as caixas ganham etiqueta uma por palavra: ESCOLA R$ 6,8 MI · CRECHE R$ 3 MI · ESGOTO R$ 3 MI · DRENAGEM R$ 5,7 MI | convênios |
| 61 | `Chegaram 400` | 130,82 | só uma moeda sólida desce do caminhão: "CHEGARAM R$ 400 MIL"; o resto continua tracejado; baque leve | convênios |
| 62 | `Na secretaria de obras` | 132,68 | câmera sobe e mergulha entre a rua (4) e a estrada (5), vizinhas; pílula NA SECRETARIA DE OBRAS | obras |
| 63 | `pavimentacao e drenagem` | 135,58 | gaveta na rua: "PAVIMENTAÇÃO E DRENAGEM" | obras |
| 64 | `tinha 12 milhoes` | 137,24 | contorno tracejado de 4 pilhas: "PREVISTO R$ 11,9 MI" | obras |
| 65 | `usou 1 milhao` | 138,96 | dentro dele, só 0,6 pilha sólida verde: "USOU R$ 1,8 MI" | obras |
| 66 | `estradas vicinais` | 141,04 | gaveta na estrada: "ESTRADAS VICINAIS" | obras |
| 67 | `tinha 650` | 141,80 | contorno tracejado baixinho (0,2 pilha): "PREVISTO R$ 650 MIL" | obras |
| 68 | `recebeu 9` | 143,50 | torre verde sólida cresce até 3 pilhas, bem acima do tracejado: "RECEBEU R$ 9 MI"; subida | obras |
| 69 | `de novo ruas` | 145,86 | torre rosa na rua: R$ 1,7 MI | obras |
| 70 | `estradas 7` | 148,20 | torre rosa na estrada: R$ 7,3 MI | obras |
| 71 | `Bandas palcos` | 150,26 | câmera desliza horário até o palco do turismo (9); luzes e bandeirinhas acendem | festas |
| 72 | `2 milhoes em 2024` | 152,04 | torre dourada no palco: "BANDAS, PALCOS E FESTAS · 2024 · R$ 2,1 MI" | festas |
| 73 | `1 milhao e 900` | 154,08 | torre rosa ao lado: "2026 ATÉ SET · R$ 1,9 MI" | festas |
| 74 | `beneficios eventuais` | 156,46 | a câmera passa para a assistência, vizinha; gaveta "BENEFÍCIOS EVENTUAIS" | festas |
| 75 | `familias pobres` | 158,64 | bonecos genéricos na porta da assistência | festas |
| 76 | `ficaram em 340` | 159,50 | moeda dourada: R$ 340 MIL (2024) | festas |
| 77 | `240 mil` | 161,20 | moeda rosa: R$ 240 MIL (2026); plano mostra palco e assistência juntos, torres altas x moedinhas | festas |
| 78 | `No Tribunal de Contas` | 162,36 | prédio do Tribunal (da série) entra ao fundo; pílula NO TRIBUNAL | tribunal |
| 79 | `9 das 12` | 164,76 | ★ fileira de 12 envelopes "2025", de JAN a DEZ | tribunal |
| 80 | `chegaram atrasadas` | 166,18 | 9 envelopes ganham selo cinza "FORA DO PRAZO" (JAN a JUL, OUT, DEZ), um por um, rápido; AGO, SET e NOV ficam "NO PRAZO" | tribunal |
| 81 | `dois processos` | 167,62 | duas pastas "PRESTAÇÃO DE CONTAS ATRASADA" | tribunal |
| 82 | `transporte escolar` | 168,72 | terceira pasta "TRANSPORTE ESCOLAR · DENÚNCIA" | tribunal |
| 83 | `Nada foi julgado` | 170,48 | carimbo neutro "SEM JULGAMENTO" nas três pastas (0,4 s); impacto | tribunal |
| 84 | `Se a rua` | 171,76 | mesa inteira; tira o Tribunal e as pastas da frente; gaveta da rua acende com o tracejado vazio | pergunta |
| 85 | `dinheiro de Brasilia` | 172,98 | o caminhão da União aparece parado, tracejado; "?" | pergunta |
| 86 | `o palco nao espera` | 174,26 | palco do turismo acende com as torres; "?" | pergunta |
| 87 | `Segue o` | 175,22 | @eumagnoleite em verde; ding | e você? |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 10,8 | Kit Mapas | SANTA CRUZ CABRÁLIA · ARRECADOU |
| 2024 | 10,8 → 48,2 | começa de cima (cofre e pilha dourada); em "Educação" desce para a escola e gira **no sentido horário**, casinha por casinha, segurando 0,55 s em cada uma; olha de dentro da mesa, alto (direção y ~0,95), para a casinha não sair cortada; termina na casinha de cachorro cinza | 2024 · PARA ONDE FOI |
| virada de ano | 48,2 / 87,2 | sobe para a vista de cima (o cofre ganha a cor nova); desce de novo na escola. Não volta pela mesa: sobe e recomeça | 2025 / 2026 · ATÉ SETEMBRO |
| 2025 e 2026 | 56,5 → 120,9 | o mesmo giro horário; em 2026 termina nos assuntos indígenas | |
| convênios | 123,4 → 132,7 | sobe e mostra a mesa inteira com o caminhão da União na entrada; aproxima do caminhão | AGORA REPARA |
| obras | 132,7 → 150,3 | sobe e mergulha entre a rua (4) e a estrada (5); as duas gavetas no mesmo plano (dois nomes em menos de 1 s pedem um plano só); arco lento de 0,012 | NA SECRETARIA DE OBRAS |
| festas | 150,3 → 162,4 | desliza **no sentido horário** de 5 até 9 (palco) e passa para 10 (assistência) | BANDAS X AJUDA |
| tribunal | 162,4 → 171,8 | recua; Tribunal ao fundo, envelopes e pastas na frente | NO TRIBUNAL |
| pergunta | 171,8 → 177,9 | mesa inteira, arco lento, termina com a rua (gaveta vazia) à esquerda e o palco aceso à direita | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Anexo 9 e Balanço enviados ao TCM-BA"
- 2026: "Fonte: SIGA de setembro/2026 (Prefeitura e Câmara), TCM-BA · despesa liquidada; comprometido = empenhado"
- Zeros: "Água e esgoto: operadora Embasa (ANA, Atlas Esgotos)"
- Convênios: "Fonte: Anexo 10 de 2025 (receita prevista x arrecadada), TCM-BA"
- Obras e festas: "Fonte: despesa por ação (SIGA dez/2024, dez/2025, set/2026), TCM-BA"
- Tribunal: "Fonte: e-TCM (datas de entrega) e TCM-BA › Decisões › Auditoria, consulta de 07/11/2026"

## 7. Fatos e o que vai na tela
Tudo em `audio/fontes.md` e na checagem frase por frase (`~/Documents/RECEITAS-DESPESAS-CABRALIA/saida/CHECAGEM_ROTEIRO.md`). Na tela, o valor com uma casa (R$ 95,6 MI), arredondado como na fala; plaquinha do ano corrente mostra só o que a voz já disse. Conferir antes de publicar: nenhum processo julgado até a data da postagem.

## 8. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro; subida na torre das estradas; baque nos "a mais", nos zeros e no "chegaram 400 mil"; impacto no carimbo SEM JULGAMENTO; ding no fim. Sem trilha, igual à série.

## 9. Arquivos
- `src/videos/orcamentocabralia/` a partir de `orcamentoparatinga/` (código livre: `ls src/videos` não tem `orcamentocabralia` além do `palavras.ts`). Peças reaproveitadas: cofre, PilhasDinheiro, torres por ano, `GavetaObra`, `PastaProcesso`, `PredioTexto` (inclusive `quadra` = campo de futebol, sem alterar), `EstacaoSaneamento`, `RuaServicos`, prédio do Tribunal.
- Peças novas em `src/videos/orcamentocabralia/pecas.tsx`: `EstradaRural` (estrada de terra, motoniveladora, placa ZONA RURAL), `CaminhaoUniao` (caminhão genérico com caixas tracejadas e placa "UNIÃO", sem brasão), `EnvelopesMeses` (12 envelopes com selo NO PRAZO / FORA DO PRAZO).
- `src/Root.tsx` (só acrescentar): `OrcamentoCabralia`, `OrcamentoCabraliaGuia`, `OrcamentoCabraliaLimpo`, `CapaOrcamentoCabralia`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-cabralia/` a partir de `orcamento-paratinga/` → `projetos/039.../mapas/cabralia.mp4`.
- Capa aprovada: "A rua / espera. / O palco / não." (fundo: quadro com a rua tracejada e o palco aceso).
- 5364 quadros. Antes de cada render: trava `projetos/_render.lock`, espera com `pgrep -f "[c]hrome-headless-shell"`, `df -h /` e apagar só a cópia `remotion-webpack-bundle-*` que o próprio comando criou.

## 10. Origem das escolhas
- Do molde 035 e das regras do `_aprendizados.md`: cofre e pilhas por ano, cores por ano, câmera num sentido só, casinhas que ficam, plaquinhas em todos os setores (também de R$ 260 mil), plaquinha sai quando a voz passa, zeros cinza com o porquê, gavetas "previsto x usado", carimbo neutro, mesa sem rio, selo de fonte discreto, `quando('Gastou 211', 2)`.
- Escolhas minhas como diretor (★): escala de R$ 3 mi por pilha (para não lotar); a estrada da zona rural subindo só em 2025, quando o setor aparece; o anel tracejado do "já comprometido" em 2026; o caminhão da União com as caixas tracejadas; os 12 envelopes de 2025 no Tribunal; mar e areia na borda (Cabrália é litoral).
