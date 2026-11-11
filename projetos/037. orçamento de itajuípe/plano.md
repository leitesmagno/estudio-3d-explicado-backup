# Plano de cenas: 037. orçamento de itajuípe (versão 1, aprovada em 07/11/2026)

Código `orcamentoitajuipe` · Nome `OrcamentoItajuipe` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **035 Paratinga v2** (`src/videos/orcamentoparatinga/`), aprovado e amado. Mesma maquete, mesma câmera, mesmas plaquinhas; só troca os dados e as cenas dos achados. **Kit Mapas** na abertura + **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena e sutil quicando pela tela o vídeo todo.

**Regras que valem aqui:** sem porcentagem; sem nome de gestor (só o ano; no tribunal "o gestor"); sem segurança pública; receita = total declarado ao TCM; casinhas sobem uma vez e ficam; câmera num sentido só; plaquinha em TODO setor falado, por menor que seja; setor zerado em cinza com o porquê; nada de cartão grande tapando a maquete; mesa sem rio (`MesaMaquete rio={false}`).

## 1. Narração
- `audio/narracao-norm.wav`: **177,03 s** (voz Mário; pausas encurtadas para 0,28 s; acelerada **1,25x**, porque a 1,2x dava 184 s e o Reels aceita até 3:00). `AUDIO_SEG = 177.03` · `QUADROS = 5338`.
- 459 palavras, iguais ao roteiro aprovado. A última ("informações.") termina em 176,68 s.
- Ajuste: o Whisper ouviu "esse..." no lugar de "SAAE" (33,7 s); o alinhador casou certo.
- Palavras repetidas (usar trecho único ou ocorrência no `quando()`):
  - cada setor 3×: Educação 14,9 / 59,9 / 93,6 · Saúde 17,4 / 62,3 / 96,2 · Administração 18,7 / 64,4 / 97,3 · Obras 20,3 / 66,0 / 99,2 · Câmara 23,0 / 68,6 / 102,3 · Dívidas 25,3 / 70,7 / 103,8 · Cultura 28,0 / 72,5 / 105,8 · Assistência 29,7 / 74,6 / 108,2 · Água 32,6 / 77,2 / 110,8 · Agricultura 36,5 / 79,6 / 113,2 · Esporte 38,3 / 81,6 / 114,7 · Meio ambiente 40,5 / 83,8 / 117,0
  - "Gastou" 3× (10,3 / 54,9 / 90,2) · "2024" 4× (6,3 / 136,1 / 152,2 / 161,5) · "2026" 3× (86,0 / 120,1 / 171,0) · "festa" 3× (121,2 / 169,2 / 172,2) · "assistência social" 5× · "1.500" 2× (150,4 / 155,2) · "em análise" 2× (153,7 / 165,6).
  - Cuidado: "Itajuípe gastou 136" (0,9 s) x "Gastou 136" (55,9 s) → `quando('Gastou 136', 2)`.

## 2. A maquete
- **Mesa redonda** com o **cofre no meio**. Em volta do cofre, a **pilha do ano** (tudo o que foi gasto no ano). Escala fixa: **1 pilha = R$ 2 milhões** (placar: "1 PILHA = R$ 2 MI"). 2024 = 61 pilhas, 2025 = 68 pilhas, 2026 até setembro = 53 pilhas. Abaixo de R$ 1 milhão, moedinhas soltas.
- **Cor por ano**: dourado 2024 · verde 2025 · rosa 2026 (como no 035).
- **Setores em volta da mesa, sentido horário, na ordem da fala** (igual nos 3 anos):

| # | setor (como a voz fala) | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 44,5 | 48,8 | 39,6 |
| 2 | Saúde | posto (letreiro "SAÚDE", sem cruz) | 20 | 20,1 | 15,3 |
| 3 | Administração | prefeitura | 25 | 32 | 26 |
| 4 | Obras e serviços urbanos | rua com caminhão de lixo e betoneira | 6,5 | 10,9 | 5,7 |
| 5 | Câmara de Vereadores | prédio com cúpula | 3,1 | 3,6 | 3,0 |
| 6 | Dívidas e encargos | pasta com cadeado | 9,4 | 9,1 | 3,8 |
| 7 | Cultura | palco com bandeirinhas e letreiro "MICAPEDRO" | 4,1 | 2,9 | 5,4 |
| 8 | Assistência social | prédio baixo "ASSISTÊNCIA" | 3,8 | 4,3 | 2,9 |
| 9 | Água e esgoto (SAAE) | caixa d'água com letreiro "SAAE" | 3,8 | 4,2 | 3,2 |
| 10 | Agricultura | trator, **cinza** | zero em programas | zero | zero |
| 11 | Esporte | quadra | 0,94 | 0,37 | 0,35 |
| 12 | Meio ambiente | árvores, **cinza** | zero em programas | zero | zero |
| 13 | Defesa civil e proteção animal | sirene e casinha de cachorro, **cinza e vazias** | nem existe linha | (não dito) | (não dito) |

  Agricultura e meio ambiente ficam cinza nos três anos com plaquinha "R$ 0 EM PROGRAMAS"; em 2024, na frase "As duas dividem uma secretaria", uma placa pequena liga o trator às árvores: "MESMA SECRETARIA · SÓ MANUTENÇÃO". Sem posto da guarda (regra) e sem ônibus (o transporte escolar está na educação).
- **Torres na frente de cada casinha**: uma torre fina por ano, lado a lado. A do ano falado cresce enquanto o dinheiro chega; as dos anos anteriores ficam paradas com a plaquinha da cor do ano.
- **Sobra (no lugar da torre vermelha "A MAIS" do 035)**: ao lado do cofre, uma pilha **"SOBROU"** na cor do ano: 2024 = 2,6 pilhas (R$ 5,3 MI), 2025 = 0,9 pilha (R$ 1,8 MI). Em 2026 não há "sobrou": nasce uma pilha só de **contorno tracejado** "JÁ COMPROMETIDO · R$ 8 MI" (4 pilhas tracejadas), que mostra o dinheiro empenhado e ainda não pago.
- **Plaquinhas** pequenas presas à casinha ou à torre, com o valor exato que a voz diz; anos anteriores em plaquinhas menores na cor do ano.
- **Borda da mesa**: paisagem de cacau (pés de cacau sob árvores altas, como a cabruca da região), uma estrada de terra para a zona rural e o colégio estadual. Sem rio (regra: rio só em Itabuna), sem marcas, sem rostos.

## 3. Mapa (Kit Mapas, 0 → 10,3 s, vira `mapas/itajuipe.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · ITAJUÍPE | 0 → 6,3 s | voo do Brasil até Itajuípe (IBGE 2915502, Litoral Sul da Bahia, perto de Itabuna, satélite); contorno do município acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,6 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (5,3 s) |
| B · ARRECADOU 2024 | 6,3 → 10,3 s | tag "2024" (6,3 s); "R$ 126,5 MI" + "ARRECADOU EM 2024" na cidade (8,0 s); aproxima devagar |
Sem nome de gestor no mapa. Tags em sequência saem 6 quadros antes da próxima entrar.

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s). Sem porcentagem em lugar nenhum.

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Itajuípe gastou` | 0,0 | voo começa; tag PARA ONDE FOI CADA REAL? | mapa A |
| 2 | `Tribunal de Contas` | 5,3 | tag TCM | mapa A |
| 3 | `2024` | 6,3 | tag 2024 | mapa B |
| 4 | `arrecadou 126` | 8,0 | R$ 126,5 MI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 121` | 10,3 | entra a maquete; 61 pilhas douradas sobem em volta do cofre; R$ 121,3 MI | 2024 |
| 6 | `Sobraram 5` | 12,9 | pilha dourada "SOBROU · R$ 5,3 MI" ao lado do cofre; ding suave | 2024 |
| 7 | `Educação 44` | 14,9 | escola sobe; 22 pilhas voam do cofre; R$ 44,5 MI | 2024 |
| 8 | `Saúde 20` | 17,4 | posto; 10 pilhas; R$ 20 MI | 2024 |
| 9 | `Administração 25` | 18,7 | prefeitura; 12,5 pilhas; R$ 25 MI | 2024 |
| 10 | `Obras e serviços urbanos` | 20,3 | rua com caminhão e betoneira; 3,3 pilhas; R$ 6,5 MI | 2024 |
| 11 | `Câmara de Vereadores` | 23,0 | Câmara; 1,6 pilha; R$ 3,1 MI | 2024 |
| 12 | `Dívidas e encargos` | 25,3 | pasta com cadeado; 4,7 pilhas; R$ 9,4 MI | 2024 |
| 13 | `Cultura 4` | 28,0 | palco; 2 pilhas; R$ 4,1 MI | 2024 |
| 14 | `Assistência social 3` | 29,7 | assistência; 1,9 pilha; R$ 3,8 MI | 2024 |
| 15 | `Água e esgoto pelo` | 32,6 | caixa d'água "SAAE"; 1,9 pilha; R$ 3,8 MI | 2024 |
| 16 | `Agricultura zero` | 36,5 | trator sobe **cinza**; nenhuma moeda; "R$ 0 EM PROGRAMAS"; baque leve | 2024 |
| 17 | `Esporte 940` | 38,3 | quadra; moedinhas; R$ 940 MIL | 2024 |
| 18 | `Meio ambiente zero` | 40,5 | árvores sobem **cinza**; "R$ 0 EM PROGRAMAS" | 2024 |
| 19 | `As duas dividem` | 42,4 | placa pequena entre trator e árvores: "MESMA SECRETARIA · SÓ MANUTENÇÃO" | 2024 |
| 20 | `Defesa civil e proteção` | 45,7 | sirene e casinha de cachorro sobem cinza (45,7 / 46,5) | 2024 |
| 21 | `zero nos três anos` | 47,5 | "R$ 0" nas duas; "NEM ESTÁ NO ORÇAMENTO" | 2024 |
| 22 | `2025 Arrecadou` | 50,9 | vista de cima; pílula 2025; 68 pilhas verdes sobem em volta do cofre | 2025 |
| 23 | `Arrecadou 137` | 52,1 | R$ 137,9 MI | 2025 |
| 24 | `Gastou 136`, 2 | 54,9 | R$ 136,2 MI | 2025 |
| 25 | `Sobrou 1` | 57,9 | pilha verde "SOBROU · R$ 1,8 MI" ao lado da dourada | 2025 |
| 26 a 37 | os 12 setores de 2025 | 59,9 → 85,0 | mesmo giro horário; pilhas verdes voam para cada casinha e formam a torre 2025 ao lado da dourada; plaquinha dourada de 2024 continua visível; agricultura e meio ambiente de novo "R$ 0 EM PROGRAMAS" | 2025 |
| 38 | `2026 até setembro` | 86,0 | vista de cima; pílula 2026 · ATÉ SETEMBRO; 53 pilhas rosa em volta do cofre | 2026 |
| 39 | `Arrecadou 110` | 87,7 | R$ 110,6 MI | 2026 |
| 40 | `Gastou 105` | 90,2 | R$ 105,5 MI | 2026 |
| 41 | `já comprometeu` | 91,8 | 4 pilhas de contorno rosa tracejado: "JÁ COMPROMETIDO · R$ 8 MI" (acende em 0,5 s) | 2026 |
| 42 a 53 | os 12 setores de 2026 | 93,6 → 118,4 | mesmo giro; terceira torre (rosa) em cada casinha, com as plaquinhas dourada e verde ao lado | 2026 |
| 54 | `Agora repara` | 119,0 | câmera chega ao palco e à assistência (vizinhos, 7 e 8) | festa |
| 55 | `Micapedro` | 121,6 | letreiro MICAPEDRO acende no palco; torre rosa "R$ 4,5 MI" | festa |
| 56 | `São Sebastião` | 124,3 | segunda bandeirinha "SÃO SEBASTIÃO"; o total sobe para "R$ 5,3 MI" | festa |
| 57 | `toda a assistência social` | 127,1 | a torre rosa da assistência acende ao lado: "R$ 2,9 MI"; as duas lado a lado, a do palco maior | festa |
| 58 | `reserva da ajuda temporária` | 129,4 | na porta da assistência, uma gaveta com contorno tracejado "RESERVA AJUDA TEMPORÁRIA · R$ 1,9 MI" | festa |
| 59 | `caiu de 1` | 131,2 | o tracejado encolhe devagar (0,6 s) até "R$ 970 MIL"; baque leve | festa |
| 60 | `Nas obras de infraestrutura` | 134,7 | câmera sobe e mergulha na rua de obras (casinha 4); gaveta "OBRAS DE INFRAESTRUTURA · 2024" | obras |
| 61 | `quase 11 milhões previstos` | 137,5 | contorno dourado tracejado de 5,5 pilhas: "PREVISTO R$ 11 MI" | obras |
| 62 | `Usou 2` | 139,4 | dentro do tracejado, 1 pilha dourada sólida: "USADO R$ 2 MI" | obras |
| 63 | `zona rural` | 141,2 | câmera desliza para a borda: estrada de terra com placa genérica "ACESSO À ZONA RURAL" e três tracejados pequenos (dourado, verde, rosa) | obras |
| 64 | `não gastou nada` | 143,2 | "R$ 0 NOS 3 ANOS"; baque leve | obras |
| 65 | `colégio estadual` | 144,3 | colégio na borda com placa genérica "GOVERNO DO ESTADO" (sem brasão nem logo) | obras |
| 66 | `13 milhões e 900` | 146,1 | "R$ 13,9 MI · OBRA DO ESTADO" | obras |
| 67 | `No Tribunal de Contas` | 148,2 | prédio do Tribunal (da série) entra ao fundo; pílula NO TRIBUNAL | tribunal |
| 68 | `gestor levou multa` | 149,3 | pasta "CONTAS ATRASADAS · 2024" | tribunal |
| 69 | `1.500 reais` | 150,4 | carimbo neutro "MULTA R$ 1.500" (0,4 s); impacto | tribunal |
| 70 | `recurso em análise` | 153,3 | selinho "RECURSO EM ANÁLISE" | tribunal |
| 71 | `contrato da frota` | 156,0 | pasta "FROTA · CONTRATO R$ 44 MIL" (157,3) | tribunal |
| 72 | `chegaram a 67` | 158,9 | "PAGOU R$ 67 MIL" + carimbo "MULTA R$ 1.500" | tribunal |
| 73 | `duas obras de 2024` | 160,9 | duas pastas pequenas "PISTA DE CAMINHADA" e "REFORMA DA SEDE" | tribunal |
| 74 | `tirar do edital` | 163,1 | carimbo "EDITAL CORRIGIDO" nas duas | tribunal |
| 75 | `Em análise os` | 165,6 | pastas "TERCEIRIZADOS" (166,6) e "ÔNIBUS ESCOLARES" (167,6) com selo "EM ANÁLISE" | tribunal |
| 76 | `Gastar com festa` | 168,6 | o Tribunal e as pastas saem da mesa; mesa inteira; texto pequeno no alto "GASTAR COM FESTA NÃO É CRIME" | pergunta |
| 77 | `em 2026`, 3 | 171,0 | torres rosa do palco e da assistência acendem | pergunta |
| 78 | `a festa já leva` | 172,2 | palco "R$ 5,3 MI" x assistência "R$ 2,9 MI"; "?" | pergunta |
| 79 | `Segue o` | 174,4 | @eumagnoleite em verde; ding | e você? |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 10,3 | Kit Mapas | ITAJUÍPE · ARRECADOU |
| 2024 | 10,3 → 50,9 | começa de cima (cofre e pilha dourada); em "Educação" desce para a escola e gira **no sentido horário**, casinha por casinha, segurando 0,55 s em cada uma; termina na sirene e na casinha cinza | 2024 · PARA ONDE FOI |
| viradas de ano | 50,9 / 86,0 | sobe para a vista de cima (o cofre se enche com a cor nova); desce de novo na escola. Não volta pela mesa: sobe e recomeça | 2025 / 2026 · ATÉ SETEMBRO |
| 2025 e 2026 | 59,9 → 118,4 | o mesmo giro horário, um pouco mais rápido | |
| festa | 119,0 → 134,7 | para entre o palco e a assistência, plano que mostra as duas torres juntas | AGORA REPARA |
| obras | 134,7 → 148,2 | a rua de obras (4) ficou para trás no giro: a câmera **sobe e mergulha** nela; depois desliza para a borda (estrada rural, colégio) | AS OBRAS |
| tribunal | 148,2 → 168,6 | recua e mostra o Tribunal ao fundo da mesa, pastas na frente | NO TRIBUNAL |
| pergunta | 168,6 → 177,9 | mesa inteira, arco lento; termina entre o palco e a assistência acesos, nada entre a câmera e eles | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Balanço e Anexo 9 enviados ao TCM-BA"
- 2026: "Fonte: SIGA set/2026 (Prefeitura, Câmara e SAAE), TCM-BA · despesa liquidada e empenhada"
- Festa, ajuda temporária e obras: "Fonte: despesa por ação (SIGA dez/2024 e set/2026), TCM-BA"
- Colégio: "Fonte: Casa Civil da Bahia, 17/04/2026"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 07/11/2026"

## 7. Fatos na tela (todos conferidos em `audio/fontes.md` e `~/Documents/RECEITAS-DESPESAS-ITAJUIPE/saida/CHECAGEM_ROTEIRO.md`)
Os valores da tela são os da fala, arredondados do mesmo jeito. Conferir antes de publicar: nada.

## 8. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro; ding suave nas duas "SOBROU"; baque leve nos zeros e no corte da reserva; impacto nos carimbos; ding no fim. Sem trilha, igual à série.

## 9. Arquivos
- **Novos**: `src/videos/orcamentoitajuipe/OrcamentoItajuipe.tsx` e `pecas.tsx`, copiados do 035 e trocados os dados. Peças novas ou mudadas: `PilhaSobrou` (no lugar da torre vermelha), `PilhaTracejada` (comprometido, previsto, reserva: reaproveita o tracejado da `GavetaObra` do 035), `CasaCinza` (trator e árvores em cinza), `CacauBorda` (pés de cacau), `EstradaRural` (placa genérica), `ColegioEstado` (placa genérica), letreiro `MICAPEDRO` no `PalcoFesta`, letreiro `SAAE` na `CaixaDagua`. Reaproveitados do 035: cofre, PilhasDinheiro, torre fina, curva do cofre, plaquinhas por ano, `GavetaObra`, `PalcoFesta`, `CaixaDagua`, `Sirene`, `PastaProcesso` com carimbo, prédio do Tribunal, marca d'água quicando.
- `palavras.ts`: pronto.
- **Alterados** (só acrescentar linhas): `src/Root.tsx` do Estúdio (`OrcamentoItajuipe`, `OrcamentoItajuipeGuia`, `OrcamentoItajuipeLimpo`, `CapaOrcamentoItajuipe`) e `src/Root.tsx` do Kit Mapas.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-itajuipe/` (IBGE 2915502) → `projetos/037.../mapas/itajuipe.mp4`.
- Capa (aprovada): "Em 2026, / festa levou / mais que a / assistência", sobre um quadro do palco aceso ao lado da assistência.
- 5338 quadros, render em partes de 400 quadros; trava `projetos/_render.lock` antes de cada render pesado.

## 10. Origem das escolhas
- Do Magno (035 e prompt): cofre no meio, pilhas por ano voando para os setores, cores por ano, câmera num sentido, plaquinha em todo setor, zeros em cinza com motivo, achados comparados, tribunal com o resultado, pergunta final, marca d'água quicando, sem rio fora de Itabuna, nada entre a câmera e o setor do final.
- Meu, como diretor (★): pilha "SOBROU" no lugar da torre vermelha (Itajuípe teve sobra em 2024 e 2025); pilha tracejada "JÁ COMPROMETIDO" em 2026; gaveta da reserva da ajuda temporária encolhendo; estrada rural e colégio na borda; paisagem de cacau na borda da mesa (região cacaueira).
