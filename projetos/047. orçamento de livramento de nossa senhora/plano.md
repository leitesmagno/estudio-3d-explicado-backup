# Plano de cenas: 047. orçamento de livramento de nossa senhora (versão 1)

Código `orcamentolivramento` · Nome `OrcamentoLivramento` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **035 Paratinga** (`src/videos/orcamentoparatinga/`), aprovado e amado. **Kit Mapas** na abertura + **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena e sutil quicando pela tela o vídeo todo.

Regras que valem aqui: sem porcentagem (só reais), sem nome de gestor (só o ano), sem segurança pública, receita = total declarado ao TCM, plaquinha em TODO setor falado (por menor que seja), plaquinhas dos anos anteriores junto, nunca cartão grande tapando a maquete, sem rio na mesa, nada tapando o setor do final.

## 1. Narração
- `audio/narracao-norm.wav`: **177,15 s** (voz Mário; pausas encurtadas para 0,28 s; acelerada **1,25x**, porque a 1,2x passava de 3 min). `AUDIO_SEG = 177.15` · `QUADROS = 5342`.
- 463 palavras, iguais ao roteiro aprovado. A última ("informações.") termina em 176,8 s. Conferido no Whisper: nenhuma frase pulada.
- Palavras repetidas (usar trecho único no `quando()`): cada setor 3× (Educação 18,8 / 52,4 / 85,2; Saúde 20,9 / 54,6 / 86,5; Administração 23,2 / 56,2 / 87,9; Obras 25,5 / 58,4 / 90,0; Câmara 28,1 / 61,4 / 92,3; Dívidas 30,0 / 63,5 / 94,4; Cultura 31,7 / 64,6 / 96,4 e 118,2 na frase das festas; Assistência 33,9 / 66,2 / 98,5 e 121,9 / 171,6; Água 36,3 / 68,2 / 101,1; Agricultura e meio ambiente 38,4 / 70,3 / 103,2; Esporte 41,2 / 73,1 / 105,9). "Gastou" 4× (1,1 abertura / 14,4 / 46,7 / 80,7). "2025" aparece no 3,5 s (abertura). "melhorias sanitárias" 2× (139,4 / 172,8). Números com vírgula: chamar pela palavra de antes.

## 2. A maquete
- **Mesa redonda**, **cofre no meio**. Em cada ano, a **pilha do ano** nasce em volta do cofre na palavra "Gastou", e a cada setor falado as pilhas voam do cofre para a casinha. Cores: **dourado 2024 · verde 2025 · rosa 2026**.
- **Escala: 1 pilha = R$ 4 milhões** (1 moeda = R$ 400 mil). Livramento gasta quase o dobro de Paratinga; com R$ 2 mi a maquete lotaria (142 pilhas em 2025). Com R$ 4 mi: 2024 = 56 pilhas, 2025 = 71, 2026 até setembro = 52. O placar diz: "1 PILHA = R$ 4 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026". A escala muda só o desenho; todo valor escrito é o exato.
- **Setores na borda, no sentido horário, na ordem da fala** (mesma ordem nos 3 anos):

| # | setor | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 102,8 | 150,9 | 109,0 |
| 2 | Saúde | posto | 43,6 | 54,4 | 44,2 |
| 3 | Administração | prefeitura | 9,2 | 11,8 | 8,5 |
| 4 | Obras e serviços urbanos | rua com caminhão de lixo (e o carro-pipa) | 33,3 | 25,8 | 20,4 |
| 5 | Câmara de Vereadores | prédio com cúpula | 6,0 | 6,9 | 5,3 |
| 6 | Dívidas | pasta com cadeado | 11,1 | 13,0 | 4,9 |
| 7 | Cultura (festas) | palco com bandeirinhas | 7,4 | 9,0 | 8,3 |
| 8 | Assistência social | prédio "ASSISTÊNCIA" | 3,3 | 4,0 | 3,7 |
| 9 | Água e saneamento | caixa d'água | 41 mil | 52 mil | 53 mil |
| 10 | Agricultura e meio ambiente | trator com duas árvores | 430 mil | 860 mil | 480 mil |
| 11 | Esporte e lazer | quadra | 3,5 | 4,5 | 1,4 |
| 12 | Programas do agricultor (o zero) | galpão com trator, **cinza e vazio** | R$ 0 | R$ 0 | R$ 0 |

  Festas (7) e assistência (8) ficam vizinhas, para a comparação. Sem posto da guarda (regra) e sem defesa civil.
- **Torres finas na frente de cada casinha**, uma por ano, lado a lado, com plaquinha da cor do ano. Ao falar um setor, aparecem também as plaquinhas dos anos anteriores daquele setor. Setor pequeno (41 mil) ganha só uma moedinha, mas tem plaquinha.
- **Sobra e "a mais"**: 2024 sobrou R$ 11 mi: 2,75 pilhas douradas **ficam guardadas ao lado do cofre** com a plaquinha "SOBROU R$ 11 MI". 2025: nasce a torre vermelha "A MAIS" (R$ 13,8 mi, 3,5 pilhas) e, em "cobertos com a sobra", as pilhas da sobra deslizam para dentro dela. 2026: torre vermelha "R$ 12,6 MI A MAIS, ATÉ SETEMBRO".
- Paisagem da borda: chão de terra clara com algumas árvores e casinhas (Chapada Diamantina); **sem rio**.

## 3. Mapa (Kit Mapas, 0 → 14,4 s, vira `mapas/livramento.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · LIVRAMENTO | 0 → 9,8 s | voo do Brasil até Livramento de Nossa Senhora, no centro-sul da Bahia (satélite); contorno do município acende em verde; "LIVRAMENTO DE NOSSA SENHORA" com seta na sede; tags "PARA ONDE FOI CADA REAL?" (0,6 s), "PREFEITURA DE LIVRAMENTO" (4,5 s), "TCM-BA · TRIBUNAL DE CONTAS" (6,4 s), "2024" (9,8 s) |
| B · ARRECADOU 2024 | 9,8 → 14,4 s | "R$ 234,6 MI" + "ARRECADOU EM 2024" na cidade (11,5 s); câmera aproxima devagar |
Sem nome de gestor no mapa.

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s).

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Livramento de Nossa` | 0,0 | voo começa | mapa A |
| 2 | `Tribunal de Contas` | 6,4 | tag TCM | mapa A |
| 3 | `2024 A prefeitura` | 9,8 | "2024" | mapa B |
| 4 | `arrecadou 234` | 11,5 | R$ 234,6 MI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 223` | 14,4 | entra a maquete; 56 pilhas douradas sobem em volta do cofre; chip GASTOU EM 2024: R$ 223,6 MI | 2024 |
| 6 | `Sobraram` | 17,2 | 2,75 pilhas douradas se separam e ficam ao lado do cofre: "SOBROU R$ 11 MI" | 2024 |
| 7 a 17 | os 11 setores | 18,8 → 43,1 | escola, posto, prefeitura, rua, Câmara, pasta, palco, assistência, caixa d'água, trator, quadra sobem um a um; pilhas voam do cofre; plaquinha com o valor exato | 2024 |
| 18 | `2025 Arrecadou` | 43,1 | sobe para a vista de cima; pílula 2025 | 2025 |
| 19 | `Arrecadou 270` | 44,4 | chip ARRECADOU EM 2025: R$ 270,2 MI | 2025 |
| 20 | `Gastou 284` | 46,7 | 71 pilhas verdes em volta do cofre; R$ 284 MI | 2025 |
| 21 | `Sao 14` | 48,7 | torre vermelha R$ 13,8 MI A MAIS; baque | 2025 |
| 22 | `cobertos com a sobra` | 50,4 | as pilhas douradas da sobra deslizam para a torre vermelha | 2025 |
| 23 a 33 | os 11 setores | 52,4 → 75,0 | mesmo giro horário; torre verde ao lado da dourada; plaquinhas 2024 e 2025 | 2025 |
| 34 | `2026 ate setembro` | 75,3 | vista de cima; pílula 2026 · ATÉ SETEMBRO | 2026 |
| 35 | `Arrecadou 195` | 77,8 | R$ 195,7 MI (arrecadado até setembro) | 2026 |
| 36 | `Ja gastou` | 80,7 | 52 pilhas rosa; R$ 208,4 MI (PREFEITURA + CÂMARA) | 2026 |
| 37 | `Sao 12` | 83,0 | torre vermelha R$ 12,6 MI A MAIS, ATÉ SETEMBRO; baque | 2026 |
| 38 a 48 | os 11 setores | 85,2 → 107,8 | mesmo giro; terceira torre (rosa) com plaquinhas dourada e verde ao lado | 2026 |
| 49 | `Os zeros` | 107,9 | câmera segue o giro até o fim da mesa: galpão dos programas do agricultor sobe **cinza** | zeros |
| 50 | `so pagou` | 109,4 | trator (setor 10) acende: "SÓ A MANUTENÇÃO DA SECRETARIA" | zeros |
| 51 | `zero nos tres` | 114,9 | no galpão cinza, chip R$ 0 nos 3 anos ("PROGRAMAS, TRATORES E CENTRO DA AGRICULTURA FAMILIAR: R$ 0") | zeros |
| 52 | `Agora repara` | 116,4 | sobe e mergulha entre o palco e a assistência | festas |
| 53 | `vai para festas` | 118,4 | bandeirinhas acendem; plaquinha "FESTAS" | festas |
| 54 | `todo ano a festa` | 119,8 | as 3 torres do palco e as 3 da assistência acendem par a par; em cada par a do palco tem mais do dobro | festas |
| 55 | `mais pobres` | 123,3 | bonecos genéricos na porta da assistência | festas |
| 56 | `Em 2024 a festa` | 124,0 | ao lado do palco, contorno tracejado baixo "RESERVADO R$ 1,2 MI" (2024) | festas |
| 57 | `terminou com 7` | 127,6 | a torre dourada sólida cresce até 7,4: "GASTOU R$ 7,4 MI" | festas |
| 58 | `E tem a seca` | 129,8 | sobe e mergulha no miolo da mesa (o cofre já saiu): chão rachado e seco aparece devagar, placa "SECA" | seca |
| 59 | `emergencia` | 134,1 | placa "EMERGÊNCIA PELA ESTIAGEM · 2025 E 2026" | seca |
| 60 | `dois meses de Sao Joao` | 136,1 | no fundo, o palco acende com faixa "2 MESES DE SÃO JOÃO · 2026" | seca |
| 61 | `melhorias sanitarias` | 139,4 | gaveta "MELHORIAS SANITÁRIAS" no miolo: três contornos tracejados (2024 R$ 1,5 MI · 2025 R$ 1,2 MI · 2026 R$ 1,1 MI), aqui 1 pilha = R$ 200 mil | seca |
| 62 | `nao usou` | 142,7 | dentro dos tracejados, nada; plaquinha "USOU R$ 0" em cada ano; baque | seca |
| 63 | `Embasa` | 144,9 | a caixa d'água (setor 9) ganha placa "ÁGUA E ESGOTO: EMBASA" (só o nome escrito, sem logo) | água |
| 64 | `carropipa` | 145,6 | um carro-pipa genérico sai da rua de obras: "PAGO PELA CONTA DE OBRAS" | água |
| 65 | `esgoto novo` | 147,4 | na borda, trecho de rua com placa genérica "ESGOTO NOVO · GOVERNO DO ESTADO" (sem valor, sem brasão) | água |
| 66 | `No Tribunal` | 149,1 | prédio do Tribunal ao fundo; pílula NO TRIBUNAL | tribunal |
| 67 | `kits escolares` | 150,6 | pasta "KITS ESCOLARES · R$ 3,7 MI" | tribunal |
| 68 | `mandou parar` | 154,4 | carimbo "SUSPENSA"; impacto | tribunal |
| 69 | `prefeitura cancelou` | 155,3 | carimbo troca para "CANCELADA" | tribunal |
| 70 | `ar-condicionado` | 156,8 | pasta "AR-CONDICIONADO E ELETRÔNICOS · R$ 2,7 MI" → "SUSPENSA" em 161,2 | tribunal |
| 71 | `analisa` | 162,3 | pasta "ARTISTAS DO SÃO JOÃO 2026" → "EM ANÁLISE" | tribunal |
| 72 | `Nada foi` | 165,7 | chip "NENHUM PROCESSO JULGADO AINDA" | tribunal |
| 73 | `Gastar nao` | 167,1 | mesa inteira; "GASTAR NÃO É CRIME" | pergunta |
| 74 | `a festa leva` | 170,4 | palco e assistência acendem lado a lado; "?" | pergunta |
| 75 | `ficam no zero` | 173,6 | gaveta vazia das melhorias sanitárias acende; "?" | pergunta |
| 76 | `Segue o` | 174,5 | @eumagnoleite em verde; ding | fim |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 14,4 | Kit Mapas | LIVRAMENTO · PARA ONDE FOI CADA REAL |
| 2024 | 14,4 → 43,1 | começa de cima (cofre, pilha dourada e a sobra); em "Educação" desce na escola e gira no sentido horário, casinha por casinha, segurando 0,55 s em cada uma | 2024 · PARA ONDE FOI |
| virada de ano | 43,1 / 75,3 | sobe para a vista de cima e desce de novo na escola; não volta pela mesa | 2025 / 2026 · ATÉ SETEMBRO |
| zeros | 107,9 → 116,4 | o giro de 2026 segue até o galpão cinza (é o último da mesa, depois da quadra) e olha o trator vizinho | OS ZEROS |
| festas | 116,4 → 129,8 | sobe e mergulha entre o palco e a assistência | AGORA REPARA |
| seca | 129,8 → 144,9 | sobe e mergulha no miolo da mesa (chão seco e a gaveta das melhorias sanitárias), com o palco ao fundo | A SECA |
| água | 144,9 → 149,1 | da caixa d'água desliza para a rua de obras (carro-pipa) e para a borda (esgoto do Estado), sem voltar | ÁGUA E ESGOTO |
| tribunal | 149,1 → 167,1 | recua e mostra o Tribunal ao fundo; pastas da esquerda para a direita | NO TRIBUNAL DE CONTAS |
| pergunta | 167,1 → 178,05 | mesa inteira, arco lento; termina entre o palco aceso e a gaveta vazia | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "FONTE: ANEXO 9 E BALANÇO 2024 (2025) ENVIADOS AO TCM-BA"
- 2026: "FONTE: SIGA SET/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA"
- Zeros, festas e melhorias sanitárias: "FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, SET/2026"
- Seca: "FONTE: A TARDE, 02/06/2025 E 07/04/2026"
- Água: "FONTE: MP-BA (BAHIA NOTÍCIAS, 29/10/2026) · PAGAMENTOS SET/2026 · JORNAL GRANDE BAHIA, 18/03/2026"
- Tribunal: "FONTE: TCM-BA · MEDIDAS CAUTELARES · CONSULTA DE 07/11/2026"

## 7. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro; subida na torre da festa; baque nos dois "a mais", no zero e no "não usou nada"; impacto nos carimbos; ding no fim. Sem trilha, igual à série. Chão seco aparece devagar (mais de 0,4 s), sem piscar.

## 8. Arquivos
- `src/videos/orcamentolivramento/` a partir de `orcamentoparatinga/` (cofre, pilhas, torres finas, plaquinhas por ano, `PastaProcesso`, `RuaPlaca`, `BaseGaveta`). Peças novas: `ChaoSeco` (placa de terra rachada que aparece devagar), `CarroPipa` (caminhão-tanque genérico), `PlacaPalco` (faixa no palco).
- `src/Root.tsx`: `OrcamentoLivramento`, `OrcamentoLivramentoGuia`, `OrcamentoLivramentoLimpo`, `CapaOrcamentoLivramento`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-livramento/` (IBGE 2919504) → `projetos/047.../mapas/livramento.mp4`.
- Capa aprovada: "Em emergência / pela seca. / Dois meses / de festa." Fundo: quadro do chão seco com o palco aceso ao fundo; título sem sumir sobre objeto da mesma cor.
- Entrega: `edicoes/047. orçamento de livramento de nossa senhora/` com `LIVRAMENTO DE NOSSA SENHORA.mp4`, `LIVRAMENTO DE NOSSA SENHORA - capa.jpg` e `LIVRAMENTO DE NOSSA SENHORA - legenda.txt`.
- 5342 quadros; conferir o disco (`df -h ~`) antes do vídeo final; trava `projetos/_render.lock` em todo render pesado.
