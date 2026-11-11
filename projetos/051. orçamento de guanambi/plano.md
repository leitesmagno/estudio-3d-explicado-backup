# Plano de cenas: 051. orçamento de guanambi (versão 1, aprovada em 07/11/2026)

Código `orcamentoguanambi` · Nome `OrcamentoGuanambi` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **035 Paratinga** (`src/videos/orcamentoparatinga/`), com as melhorias do 047 Livramento e do 041 Camaçari (escala maior, plaquinhas que procuram altura livre). **Kit Mapas** na abertura + **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena e sutil quicando pela tela o vídeo todo.

Regras que valem aqui: sem porcentagem (só reais; "6 de cada 10 reais" é a regra da lei, dita assim), sem nome de gestor (só o ano), sem segurança pública, receita = total declarado ao TCM, plaquinha em TODO setor falado (por menor que seja), plaquinhas dos anos anteriores junto, nunca cartão grande tapando a maquete, sem rio na mesa, nada tapando o setor do final, tom informativo (sem "crime", "suspeito", "irregular" na tela).

## 1. Narração
- `audio/narracao-norm.wav`: **176,64 s**. Voz do Google Cloud (pt-BR Chirp 3 HD **Algenib**, escolhida pelo Magno), speakingRate 1,3, pausas encurtadas a 0,28 s, atempo 1,15, -15 LUFS. `AUDIO_SEG = 176.64` · `QUADROS = 5326`.
- 497 palavras, iguais ao roteiro v2 aprovado. A última ("informações.") termina em 176,30 s. Transcrição conferida frase por frase; "dezesseis e meio" e "noventa e cinco centavos" conferidos à parte.
- Palavras repetidas (usar trecho único ou ocorrência no `quando()`):
  - "Gastou 474" aparece no gancho (0,40 s): usar `quando('Gastou 474', 2)` = 41,88. "474" 0,68 / 42,20.
  - Setores 3×: Educação 12,38 / 45,24 / 81,02 · Saúde 14,30 / 47,56 / 82,78 · Administração 16,04 / 49,22 / 84,14 · Obras 17,82 / 50,74 / 86,22 · Câmara 20,12 / 53,08 / 88,56 (4ª vez 161,42 é "Câmara dos Deputados") · Dívidas 21,72 / 55,00 / 90,54 · Cultura 23,50 / 56,82 / 92,28 · Assistência 24,98 / 58,18 / 93,68 (4ª em 115,18 "da assistência social") · Água 27,28 / 61,23 / 96,00 · Agricultura 30,78 / 65,62 / 98,50 · Esporte 32,62 / 67,98 / 100,52 · Meio ambiente 34,46 / 69,74 / 102,06.
  - "2025" 2,12 (gancho) / 36,42 / 110,72 · "2026" 72,24 / 120,58 · "2024" 5,48 / 168,84 · "Tribunal" 4,60 / 167,24 · "canal" 117,86 / 173,54 · "dívida" 140,98 / 147,56 / 157,24 · "juros" 142,32 / 152,18 / 162,70.
  - Números com vírgula ou "e meio": chamar pela palavra de antes (`quando('Gastou 416')`, `quando('Cultura 16')`).

## 2. A maquete
- **Mesa redonda** (`MesaMaquete rio={false}`), **cofre no meio**. Em cada ano, a **pilha do ano** nasce em volta do cofre na palavra "Gastou"/"Já gastou", e a cada setor falado as pilhas voam do cofre para a casinha. Cores: **dourado 2024 · verde 2025 · rosa 2026**.
- **Escala: 1 moeda = R$ 500 mil · 1 pilha = R$ 5 mi.** Guanambi gasta quase o triplo de Paratinga: com R$ 2 mi por pilha seriam 237 pilhas em 2025. Com R$ 5 mi: **2024 = 83 pilhas, 2025 = 95, 2026 até setembro = 73**, em duas voltas em volta do cofre, espalhadas por igual (aprendizado do 041). O placar diz: "1 MOEDA = R$ 500 MIL · 1 PILHA = R$ 5 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026". A escala muda só o desenho; todo valor escrito é o exato. ★ Se no quadro de revisão a mesa lotar, mostro a conta ao Magno antes de subir para R$ 10 mi.
- **Setores na borda, no sentido horário, na ordem da fala** (mesma ordem nos 3 anos):

| # | setor | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 138,1 | 163,4 | 134,2 |
| 2 | Saúde | posto (letreiro SAÚDE, sem cruz) | 129,0 | 144,9 | 107,0 |
| 3 | Administração | prefeitura | 16,6 | 20,0 | 15,4 |
| 4 | Obras e serviços urbanos | rua com caminhão de lixo, poste e tijolos | 54,5 | 61,2 | 33,1 |
| 5 | Câmara | prédio com cúpula "CÂMARA" | 10,1 | 13,0 | 10,9 |
| 6 | Dívidas | pasta com cadeado | 21,2 | 25,5 | 21,8 |
| 7 | Cultura | palco com bandeirinhas | 11,1 | 16,5 | 12,5 |
| 8 | Assistência social | prédio "ASSISTÊNCIA" | 7,7 | 7,4 | 6,7 |
| 9 | Água e saneamento | caixa d'água + 3 bonequinhos de colete (os terceirizados de 2024) | 12,9 | 1,9 | 6,8 |
| 10 | Agricultura | trator | 4,3 | 3,3 | 2,6 |
| 11 | Esporte | **campo de futebol de verdade** (tipo 'quadra' do PredioTexto do 034/035: gramado listrado, linhas, traves com rede, bola, arquibancada, refletores que acendem na fala), erguido acima da mesa | 0,56 | 0,26 | 0,14 |
| 12 | Meio ambiente | três árvores com placa | 1,9 | 2,1 | 1,3 |
| 13 | Defesa civil (o zero) | casinha **cinza** com sirene apagada, placa "DEFESA CIVIL" | R$ 0 | R$ 0 | R$ 0 |
| 14 | Proteção animal (fora do orçamento) | só o contorno tracejado de um canil, **cinza**, sem plaquinha de valor | nem existe | | |

  Cultura (7) e assistência (8) ficam vizinhas, para a comparação das festas. Sem posto da guarda (regra).
- **Torres finas na frente de cada casinha**, uma por ano, lado a lado, com plaquinha da cor do ano. Ao falar um setor, aparecem também as plaquinhas dos anos anteriores daquele setor. Setor pequeno (esporte, R$ 140 mil) ganha só uma fração de moeda, mas tem plaquinha. As plaquinhas procuram altura livre e saem quando a voz passa para o próximo setor (aprendizado do 041).
- **"A mais"**: 2024 torre vermelha "R$ 10,9 MI A MAIS" (2,2 pilhas) ao lado do cofre. 2025 torre vermelha cresce para "R$ 17,3 MI A MAIS" (3,5 pilhas) e, em "empréstimo de 15 milhões", 3 pilhas com etiqueta "EMPRÉSTIMO R$ 15 MI" entram no cofre por um banco genérico na borda. 2026: não há torre "a mais" (o gasto pago ficou abaixo do arrecadado); em "comprometeu mais 67", nasce ao lado do cofre um **contorno tracejado rosa** de 13 pilhas: "COMPROMETIDO R$ 67 MI".
- **Precatórios na receita de 2026**: em "com quase 29 milhões dos precatórios", 6 pilhas de **cor própria (azul-claro, do tema)** chegam de uma caixa-forte com a placa "UNIÃO" (só o nome escrito, sem brasão) e entram no cofre: "PRECATÓRIOS R$ 28,9 MI". Essa caixa-forte fica na borda, atrás da escola, e volta na cena dos precatórios.
- Paisagem da borda: sertão produtivo (chão de terra clara, algumas árvores e casinhas). **Sem rio.**

## 3. Mapa (Kit Mapas, 0 → 9,18 s, vira `mapas/guanambi.mp4`)
IBGE **2911709** (conferido na API do IBGE em 07/11/2026: "Guanambi". O código de memória 2911105 era Formosa do Rio Preto).

| trecho | de / até | o que acontece |
|---|---|---|
| A · GUANAMBI | 0 → 5,48 s | voo do Brasil até Guanambi, no sudoeste da Bahia (satélite); contorno do município acende em verde; "GUANAMBI" com seta na sede; tags "GASTOU R$ 474 MI EM 2025" (0,68 s), "TCM-BA · TRIBUNAL DE CONTAS" (4,6 s) |
| B · ARRECADOU 2024 | 5,48 → 9,18 s | "2024" (5,48 s); "R$ 405,7 MI" + "ARRECADOU EM 2024" na cidade (7,06 s); câmera aproxima devagar |

Sem nome de gestor no mapa. Tags em sequência no mesmo lugar: a anterior sai 6 quadros antes (aprendizado do 019).

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s).

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Guanambi gastou` | 0,00 | voo começa | mapa A |
| 2 | `474` | 0,68 | tag GASTOU R$ 474 MI EM 2025 | mapa A |
| 3 | `Tribunal de Contas` | 4,60 | tag TCM-BA | mapa A |
| 4 | `2024 A prefeitura` | 5,48 | "2024" | mapa B |
| 5 | `arrecadou 405` | 7,06 | R$ 405,7 MI · ARRECADOU EM 2024 | mapa B |
| 6 | `Gastou 416` | 9,18 | entra a maquete; 83 pilhas douradas sobem em volta do cofre; chip GASTOU EM 2024: R$ 416,5 MI | 2024 |
| 7 | `Quase 11` | 10,94 | torre vermelha "R$ 10,9 MI A MAIS"; baque | 2024 |
| 8 a 19 | os 12 setores (1ª ocorrência) | 12,38 → 36,10 | escola, posto, prefeitura, rua, Câmara, pasta, palco, assistência, caixa d'água, trator, campo, árvores sobem um a um; pilhas voam do cofre; plaquinha com o valor exato | 2024 |
| 13b | `maior parte em contratos` | 29,24 | ★ 3 bonequinhos de colete genéricos aparecem ao lado da caixa d'água: "TERCEIRIZADOS E SERVIÇOS" | 2024 |
| 18b | `Esporte 560` | 32,62 | refletores do campo acendem devagar (0,4 s) | 2024 |
| 20 | `2025 Arrecadou` | 36,42 | sobe para a vista de cima; pílula 2025 | 2025 |
| 21 | `Arrecadou 456` | 37,56 | chip ARRECADOU EM 2025: R$ 456,9 MI | 2025 |
| 22 | `contando um empréstimo` | 40,08 | banco genérico na borda manda 3 pilhas para o cofre: "EMPRÉSTIMO R$ 15 MI" | 2025 |
| 23 | `Gastou 474`, 2 | 41,88 | 95 pilhas verdes em volta do cofre; R$ 474,2 MI | 2025 |
| 24 | `São 17` | 43,46 | torre vermelha cresce: "R$ 17,3 MI A MAIS"; baque | 2025 |
| 25 a 36 | os 12 setores (2ª ocorrência) | 45,24 → 71,90 | mesmo giro horário; torre verde ao lado da dourada; plaquinhas 2024 e 2025 | 2025 |
| 33b | `esses contratos saíram` | 63,70 | os 3 bonequinhos de colete saem andando da caixa d'água e somem devagar | 2025 |
| 37 | `2026 até setembro` | 72,24 | vista de cima; pílula 2026 · ATÉ SETEMBRO | 2026 |
| 38 | `Arrecadou 380` | 73,50 | chip ARRECADOU ATÉ SET: R$ 380,5 MI | 2026 |
| 39 | `com quase 29` | 75,30 | a caixa-forte "UNIÃO" abre e 6 pilhas azul-claro voam para o cofre: "PRECATÓRIOS R$ 28,9 MI" | 2026 |
| 40 | `Já gastou` | 77,44 | 73 pilhas rosa; R$ 365,7 MI (PREFEITURA + CÂMARA, PAGO ATÉ SET) | 2026 |
| 41 | `comprometeu mais` | 79,64 | contorno tracejado rosa ao lado do cofre: "COMPROMETIDO R$ 67 MI" | 2026 |
| 42 a 53 | os 12 setores (3ª ocorrência) | 81,02 → 103,70 | mesmo giro; terceira torre (rosa) com plaquinhas dourada e verde ao lado | 2026 |
| 54 | `Defesa civil` | 104,02 | o giro segue até a casinha cinza da defesa civil | zeros |
| 55 | `nenhum real gasto` | 106,66 | chip "RESERVADO NOS 3 ANOS · GASTO R$ 0"; baque | zeros |
| 56 | `Proteção animal` | 107,76 | ao lado, o contorno tracejado de um canil aparece, cinza | zeros |
| 57 | `nem aparece` | 108,50 | chip "NENHUMA LINHA NO ORÇAMENTO" | zeros |
| 58 | `Repara em` | 109,96 | sobe e mergulha entre o palco e a assistência; pílula AGORA REPARA | festas |
| 59 | `5 milhões e 600` | 112,20 | ao lado do palco, contorno tracejado baixo "RESERVADO R$ 5,6 MI" (2025) | festas |
| 60 | `levaram 13` | 113,96 | torre verde sólida cresce até 13,4 por cima do tracejado: "FESTAS GASTARAM R$ 13,4 MI"; subida | festas |
| 61 | `Quase o dobro` | 115,18 | a torre verde da assistência (7,4) acende ao lado; plaquinha "QUASE O DOBRO DA ASSISTÊNCIA" | festas |
| 62 | `drenagem do Canal` | 117,40 | a câmera desliza para o miolo da mesa (o cofre afunda): um canal de concreto seco com placa "CANAL DO BELÉM · DRENAGEM" | canal |
| 63 | `750 reservados` | 119,30 | contorno tracejado "RESERVADO R$ 8,75 MI · 2026" (gaveta, 1 pilha = R$ 1 mi) | canal |
| 64 | `e nada gasto` | 121,44 | dentro do tracejado, nada; plaquinha "GASTO R$ 0 ATÉ SET"; baque | canal |
| 65 | `Agora o pedido` | 122,38 | pílula PEDIDO DE SEGUIDOR; a câmera vai para a caixa-forte "UNIÃO" na borda, com a escola ao lado | precatórios |
| 66 | `Precatório é` | 126,68 | ★ um papel grande com martelo de juiz genérico pousa na caixa-forte: "PRECATÓRIO = DÍVIDA QUE A JUSTIÇA MANDOU PAGAR" | precatórios |
| 67 | `A União deixou` | 128,58 | da caixa-forte sai uma fita do tempo "1998 → 2006" até a escola | precatórios |
| 68 | `três parcelas` | 134,08 | três caixas fechadas na fila: "2026 · 2027 · 2028" | precatórios |
| 69 | `A primeira chegou` | 136,06 | a caixa "2026" abre: "R$ 28,9 MI"; pop | precatórios |
| 70 | `são a dívida` | 140,64 | o dinheiro se divide em duas pilhas (gaveta, 1 pilha = R$ 1 mi): azul-claro "DÍVIDA R$ 12,7 MI" | precatórios |
| 71 | `juros pelo atraso` | 142,32 | ao lado, pilha cinza-azulada "JUROS R$ 16,2 MI" | precatórios |
| 72 | `6 de cada` | 144,26 | ★ fileira de 10 moedas grandes na frente: 6 acendem no acento com bonequinhos de professor (genéricos, com lousa); "A LEI: 6 DE CADA 10 REAIS AOS PROFESSORES" | precatórios |
| 73 | `rateou 7` | 148,08 | da pilha "DÍVIDA", R$ 7,65 mi voam para a escola: "RATEIO R$ 7,65 MI" | precatórios |
| 74 | `95` | 149,66 | plaquinha na escola "R$ 0,95 POR HORA TRABALHADA" | precatórios |
| 75 | `Os juros ficaram` | 151,90 | a pilha "JUROS" ganha cadeado aberto: "LIVRE PARA A PREFEITURA" | precatórios |
| 76 | `O site` | 153,34 | ★ uma telinha de celular genérica (sem logo) com a manchete "R$ 12,7 MI PARA OS PROFESSORES" e o selo "SITE iGUANAMBI, 27/10/2026" | precatórios |
| 77 | `mas esse é` | 156,50 | uma seta liga a manchete à pilha "DÍVIDA R$ 12,7 MI"; plaquinha "É A DÍVIDA INTEIRA" | precatórios |
| 78 | `E quem tem` | 157,72 | balança da Justiça genérica sobe no meio; pílula QUEM TEM RAZÃO? | precatórios |
| 79 | `O Supremo` | 158,52 | prato esquerdo desce: "STF: JURO NÃO FICA PRESO À EDUCAÇÃO" | precatórios |
| 80 | `Mas um projeto` | 160,74 | prato direito desce: "PROJETO NA CÂMARA DOS DEPUTADOS: JUROS NA CONTA" | precatórios |
| 81 | `Aí seriam` | 163,24 | do lado direito, pilhas tracejadas "+ R$ 9,7 MI AOS PROFESSORES" | precatórios |
| 82 | `Quem decide` | 165,80 | a balança volta ao meio, devagar; chip "QUEM DECIDE É A JUSTIÇA" | precatórios |
| 83 | `No Tribunal` | 167,08 | prédio do Tribunal genérico ao fundo; pílula NO TRIBUNAL | tribunal |
| 84 | `22 processos` | 167,80 | 22 pastas pequenas empilhadas com carimbo "EM ANÁLISE"; chip "22 PROCESSOS DESDE 2024 · SEM JULGAMENTO" | tribunal |
| 85 | `Gastar não` | 170,38 | mesa inteira (Tribunal e balança já saíram); "GASTAR NÃO É CRIME" | pergunta |
| 86 | `por que a festa` | 172,60 | palco aceso com a torre de 13,4; "?" | pergunta |
| 87 | `e o canal` | 173,44 | canal seco acende ao lado com "R$ 0"; "?" | pergunta |
| 88 | `Segue o` | 174,32 | @eumagnoleite em verde; ding | fim |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 9,18 | Kit Mapas | GUANAMBI · PARA ONDE FOI CADA REAL |
| 2024 | 9,18 → 36,42 | começa de cima (cofre, pilha dourada e torre vermelha); em "Educação" desce na escola e gira no sentido horário, casinha por casinha, segurando 0,55 s em cada uma (direção y ~0,95, olhando de dentro da mesa) | 2024 · PARA ONDE FOI |
| virada de ano | 36,42 / 72,24 | sobe para a vista de cima e desce de novo na escola; não volta pela mesa | 2025 / 2026 · ATÉ SETEMBRO |
| zeros | 104,02 → 109,96 | o giro de 2026 segue até a defesa civil e o canil (os últimos da mesa, depois das árvores) | OS ZEROS |
| festas | 109,96 → 117,40 | sobe e mergulha entre o palco e a assistência | AGORA REPARA |
| canal | 117,40 → 122,38 | desliza para o miolo (cofre afundado, aprendizado do 048), com o palco ao fundo | O CANAL |
| precatórios | 122,38 → 167,08 | vai para a caixa-forte da União (na borda, entre o canil e a escola, fechando a volta sem pular casa); avanço lento até as duas pilhas e a escola; em "quem tem razão" recua para mostrar a balança no meio | PEDIDO DE SEGUIDOR / QUEM TEM RAZÃO? |
| tribunal | 167,08 → 170,38 | recua e mostra o Tribunal ao fundo com as 22 pastas | NO TRIBUNAL DE CONTAS |
| pergunta | 170,38 → 177,54 | mesa inteira, arco lento; termina entre o palco aceso e o canal seco | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "FONTE: BALANÇO E ANEXO 9 DE 2024 (2025) ENVIADOS AO TCM-BA"
- 2026: "FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA"
- Zeros, festas e canal: "FONTE: DESPESA POR AÇÃO · ANEXO 6 E SIGA DEZ/2025, SET/2026"
- Precatórios: "FONTES: NOTA DA PREFEITURA (05/11/2026) · RECEITA SIGA SET/2026 · AGÊNCIA SERTÃO (07/04/2025) · iGUANAMBI (27/10/2026)"; na balança: "STF, ADPF 528 E RE 1.428.399 · PL 6399/2025"
- Tribunal: "FONTE: TCM-BA · DECISÕES › AUDITORIA · CONSULTA DE 07/11/2026"

## 7. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro e quando a caixa de 2026 abre; subida na torre da festa; baque nos "a mais", no zero da defesa civil e no "nada gasto" do canal; ding quando a balança volta ao meio e no fim. Sem trilha, igual à série. Refletores, contornos e sirene acendem devagar (mais de 0,4 s), sem piscar.

## 8. Arquivos
- `src/videos/orcamentoguanambi/` a partir de `orcamentoparatinga/` e do 047/041 (cofre, pilhas em duas voltas, torres finas, plaquinhas por ano com altura livre, `PastaProcesso`, `BaseGaveta`, campo de futebol 'quadra'). `palavras.ts` já pronto.
- Peças novas em `pecas.tsx`: `CaixaForteUniao` (caixa-forte com placa "UNIÃO" e três caixas de parcela), `CanalSeco` (canal de concreto com placa), `BalancaJustica` (genérica, pratos que descem e voltam devagar), `CelularManchete` (telinha genérica sem logo), `MoedasLei` (fileira de 10 moedas grandes), `BonecoColete` (terceirizado genérico), `CanilTracejado`.
- `src/Root.tsx` (só acrescentar): `OrcamentoGuanambi`, `OrcamentoGuanambiGuia`, `OrcamentoGuanambiLimpo`, `CapaOrcamentoGuanambi`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-guanambi/` (IBGE 2911709) → `projetos/051.../mapas/guanambi.mp4`.
- Capa proposta: "A festa / cresce. / O canal / não sai." Fundo: quadro do palco aceso com o canal seco ao lado; título sem sumir sobre objeto da mesma cor.
- Entrega: `edicoes/051. orçamento de guanambi/` com `GUANAMBI.mp4`, `GUANAMBI - capa.jpg` e `GUANAMBI - legenda.txt`.
- 5326 quadros; conferir o disco (`df -h ~`) antes do vídeo final; trava `projetos/_render.lock` em todo render pesado e apagar a cópia temporária `remotion-webpack-bundle-*` que o próprio comando criar.

## 9. Origem das escolhas
- **Das regras e do molde**: maquete com cofre e casinhas na ordem da fala, pilhas que voam, cores por ano, plaquinhas em todo setor, câmera num sentido só, campo de futebol no esporte, setor zerado cinza com o motivo, gaveta reservado x usado, pastas do Tribunal, marca d'água quicando, sem rio, Tribunal e pastas saem antes da pergunta final, selos de fonte discretos, `quando()` na 2ª ocorrência do "Gastou 474".
- **Escolhas minhas (diretor)**: escala de R$ 5 mi por pilha; pilhas azul-claro do precatório; caixa-forte da União com 3 caixas de parcela; balança da Justiça que volta ao meio (neutralidade); telinha da manchete com a correção; bonequinhos de colete no saneamento de 2024. Os extras estão marcados com ★.

## Ajustes feitos na programação (07/11/2026)
- Meio ambiente: três árvores pequenas e uma base com o nome (o plano dizia "três árvores com placa").
- Esporte: a ação está na função Cultura em 2024 e 2025, então a Cultura na tela é sem o esporte (11,1 e 16,5).
- Precatórios: tudo no miolo da mesa (o cofre afunda no canal e não volta); a caixa da União é o caixote "FUNDEF" do Itabuna, em 3 parcelas.
- Tribunal: uma pilha de 22 pastas finas "22 EM ANÁLISE" e uma pasta "DENÚNCIAS E FISCALIZAÇÕES" com carimbo, ao lado do prédio.
- Na pergunta final, o cofre não volta (ficaria em cima do canal); as torres de cada setor ficam na borda o vídeo todo.
