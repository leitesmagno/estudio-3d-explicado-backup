# Plano de cenas: 035. orçamento de paratinga (versão 1)

Código `orcamentoparatinga` · Nome `OrcamentoParatinga` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **Canavieiras v5 (034)**, `src/videos/orcamentocanavieiras/`. Sempre **Kit Mapas** na abertura + **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena quicando pela tela inteira, do início ao fim.

**Pedidos da pessoa para este vídeo (06/11/2026):**
1. Sem porcentagem: só o valor em reais.
2. O cofre fica no meio. Em cada ano, a pilha de dinheiro do ano fica em volta do cofre. Quando a voz fala um setor, o dinheiro sai dessa pilha e voa direto para o setor falado.
3. Sem pular casa e voltar: os setores ficam em volta da mesa **na mesma ordem em que a voz fala**, e a câmera anda sempre no mesmo sentido (horário).
4. Sem nome de prefeito: só o ano, na fala, na tela e na capa.
5. Casinhas fixas: cada setor sobe uma vez e fica até o fim. Só o dinheiro muda. Torres por ano lado a lado, uma cor por ano, com as plaquinhas dos anos anteriores.

## 1. Narração
- `audio/narracao-norm.wav`: **176,28 s** (voz Mário; pausas encurtadas para 0,28 s; acelerada 1,2x, a mesma velocidade da versão final de Canavieiras). `AUDIO_SEG = 176.28` · `QUADROS = 5289`.
- 445 palavras, iguais ao roteiro v2. A última ("informações.") termina em 175,5 s.
- Conferido de novo com o Whisper: "Esporte, 650 mil" (114,2 s) e "Já gastou 141" (92,7 s) estão certos na voz.
- Palavras repetidas (usar um trecho único no `quando()`): "Arrecadou/arrecadou" 3×, "Gastou" 3×, cada setor 3× (Educação 19,1 / 59,3 / 96,7; Saúde 21,4 / 61,6 / 97,9; Administração 23,0 / 63,3 / 99,4; Obras 25,3 / 65,7 / 100,9; Câmara 28,0 / 68,6 / 103,7; Dívidas 30,4 / 70,8 / 105,9; Cultura 32,8 / 72,1 / 107,4; Assistência 35,0 / 73,7 / 109,0; Água 37,6 / 76,2 / 111,0; Agricultura 40,2 / 78,1 / 112,0; Esporte 41,8 / 79,8 / 114,2; Meio ambiente 44,3 / 81,6 / 116,2), "Defesa civil" 2× (46,7 / 83,4), "asfalto" 4× (136,6 / 144,9 / 146,7 / 172,6), "limpeza" 2× (131,6 / 142,4), "festa(s)" 3× (121,8 / 123,8 / 171,7).

## 2. A maquete
- **Mesa redonda** com o **cofre no meio**. Em volta do cofre, a **pilha do ano** (todo o dinheiro gasto naquele ano). Escala fixa: **1 pilha = R$ 2 milhões**. 2024 = 76 pilhas, 2025 = 80 pilhas, 2026 até setembro = 70 pilhas. Valores abaixo de R$ 1 milhão viram moedinhas soltas.
- **Cor por ano** (já existe no código de Canavieiras): dourado 2024 · verde 2025 · rosa 2026. A legenda fica no placar: "1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026".
- **Setores em volta da mesa, no sentido horário, na ordem da fala** (é a mesma ordem nos 3 anos):

| # | setor | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 66 | 72 | 64 |
| 2 | Saúde | posto | 35 | 35 | 30 |
| 3 | Administração | prefeitura | 20,5 | 22,6 | 21 |
| 4 | Obras e serviços urbanos | rua com caminhão de lixo e rolo de asfalto | 12,4 | 13,7 | 10 |
| 5 | Câmara de Vereadores | prédio com cúpula | 3,5 | 4,7 | 3,7 |
| 6 | Dívidas | pasta com cadeado | 4,8 | 3,5 | 3,5 |
| 7 | Cultura (festas) | palco com bandeirinhas | 2,6 | 2,0 | 3,0 |
| 8 | Assistência social | prédio baixo "ASSISTÊNCIA" | 2,2 | 1,8 | 2,0 |
| 9 | Água e saneamento | caixa d'água | 1,7 | 1,5 | quase 1 |
| 10 | Agricultura | trator | 0,8 | 0,7 | quase 1 |
| 11 | Esporte e lazer | quadra | 0,75 | 0,9 | 0,65 |
| 12 | Meio ambiente | árvores | 0,45 | 0,5 | 0,46 |
| 13 | Defesa civil e proteção animal | sirene e casinha de cachorro, **cinza e vazias** | nada no orçamento | nada | (não dito) |

  Os setores grandes (1 a 4) ocupam fatias maiores da borda; os pequenos ficam mais juntos. Sem posto da guarda (regra: sem segurança) e sem ônibus (transporte escolar está na Educação).
- **Torres na frente de cada casinha**: uma torre por ano, lado a lado, finas (como Canavieiras v5). A torre do ano atual cresce enquanto o dinheiro chega; as dos anos anteriores ficam paradas, com a plaquinha da cor do ano.
- **"Faltou"**: torre vermelha ao lado do cofre com as pilhas a mais: 2024 = 4,7 pilhas (R$ 9,4 mi), 2025 = 3 pilhas (R$ 6 mi), 2026 = 7 pilhas (R$ 14 mi).
- **Plaquinhas** pequenas presas à casinha ou à torre, nunca cartão grande por cima da maquete. Rótulos com o valor exato do ano falado; anos anteriores em plaquinhas menores com a cor do ano.
- Paisagem da borda vazia: margem do Rio São Francisco (faixa de água e areia), sem marcas e sem rostos.

## 3. Mapa (Kit Mapas, 0 → 13,9 s, vira `mapas/paratinga.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · PARATINGA | 0 → 9,3 s | voo do Brasil até Paratinga, na margem do Rio São Francisco (oeste da Bahia, satélite); contorno do município acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,6 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (5,4 s), "2024" (9,3 s) |
| B · ARRECADOU 2024 | 9,3 → 13,9 s | "R$ 141,8 MI" + "ARRECADOU EM 2024" na cidade (10,9 s); câmera aproxima devagar |
Sem nome de gestor no mapa.

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s). Sem porcentagem em nenhum lugar.

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Paratinga gastou` | 0,0 | voo começa; tag PARA ONDE FOI CADA REAL? | mapa A |
| 2 | `Tribunal de Contas` | 5,4 | tag TCM | mapa A |
| 3 | `2024` | 9,3 | pílula 2024 | mapa A→B |
| 4 | `arrecadou 141` | 10,9 | R$ 141,8 MI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 151` | 13,9 | entra a maquete; 76 pilhas douradas sobem em volta do cofre; R$ 151,2 MI | 2024 |
| 6 | `a mais do que arrecadou` | 15,7 | torre vermelha nasce ao lado do cofre: GASTOU R$ 9,4 MI A MAIS; baque | 2024 |
| 7 | `Educacao 66` | 19,1 | escola sobe; 33 pilhas voam do cofre para a escola; R$ 66,4 MI | 2024 |
| 8 | `Saude 35` | 21,4 | posto; 17,5 pilhas; R$ 35,0 MI | 2024 |
| 9 | `Administracao da prefeitura` | 23,0 | prefeitura; 10 pilhas; R$ 20,5 MI | 2024 |
| 10 | `Obras e servicos urbanos` | 25,3 | rua com caminhão e rolo; 6 pilhas; R$ 12,4 MI | 2024 |
| 11 | `Camara de Vereadores` | 28,0 | Câmara; 1,7 pilha; R$ 3,5 MI | 2024 |
| 12 | `Dividas` | 30,4 | pasta; 2,4 pilhas; R$ 4,8 MI | 2024 |
| 13 | `Cultura` | 32,8 | palco; 1,3 pilha; R$ 2,6 MI | 2024 |
| 14 | `Assistencia social` | 35,0 | assistência; 1,1 pilha; R$ 2,2 MI | 2024 |
| 15 | `Agua e saneamento` | 37,6 | caixa d'água; R$ 1,7 MI | 2024 |
| 16 | `Agricultura` | 40,2 | trator; moedinhas; R$ 800 MIL | 2024 |
| 17 | `Esporte e lazer` | 41,8 | quadra; R$ 750 MIL | 2024 |
| 18 | `Meio ambiente` | 44,3 | árvores; R$ 450 MIL | 2024 |
| 19 | `Defesa civil e protecao animal` | 46,7 | sirene e casinha de cachorro sobem **cinza** (46,7 / 47,6); nenhuma moeda | 2024 |
| 20 | `zero nem existe uma linha` | 48,5 | chip R$ 0 nas duas; plaquinha "NEM ESTÁ NO ORÇAMENTO" | 2024 |
| 21 | `2025` | 51,4 | vista de cima; pílula 2025; 80 pilhas verdes sobem em volta do cofre (o cofre fica vazio de dourado: o dourado já está nas casinhas) | 2025 |
| 22 | `Arrecadou 153` | 52,5 | R$ 153,7 MI | 2025 |
| 23 | `Gastou 160` | 55,6 | R$ 159,9 MI | 2025 |
| 24 | `De novo 6 milhoes` | 57,1 | 2ª torre vermelha: R$ 6,1 MI A MAIS; baque | 2025 |
| 25 a 36 | os 12 setores | 59,3 → 82,8 | mesmo giro horário; pilhas verdes voam do cofre para cada casinha e formam a torre 2025 ao lado da dourada; plaquinha dourada de 2024 continua visível | 2025 |
| 37 | `Defesa civil ... fora do orcamento` | 83,4 | sirene e casinha ganham contorno cinza que acende devagar (0,5 s); "DE NOVO FORA" | 2025 |
| 38 | `2026 ate setembro` | 87,1 | vista de cima; pílula 2026 · ATÉ SETEMBRO; 70 pilhas rosa em volta do cofre | 2026 |
| 39 | `Arrecadou 126` | 90,0 | R$ 126,6 MI | 2026 |
| 40 | `Ja gastou 141` | 92,7 | R$ 140,9 MI | 2026 |
| 41 | `Sao 14 milhoes` | 94,6 | 3ª torre vermelha, a maior: R$ 14,3 MI A MAIS; baque | 2026 |
| 42 a 52 | os setores de 2026 | 96,7 → 118,2 | mesmo giro; terceira torre (rosa) em cada casinha, com as plaquinhas dourada e verde ao lado; em "Água e saneamento e agricultura" as duas recebem juntas | 2026 |
| 53 | `Agora repara` | 118,7 | câmera chega ao palco e à assistência, que estão vizinhos na mesa | festas |
| 54 | `vai para festas` | 121,3 | bandeirinhas acendem no palco; plaquinha "FESTAS" | festas |
| 55 | `nos tres anos` | 122,6 | as 3 torres do palco e as 3 da assistência acendem par a par (2024, 2025, 2026); em cada par a do palco é maior | festas |
| 56 | `familias mais pobres` | 126,2 | bonecos genéricos na porta da assistência | festas |
| 57 | `Na secretaria de obras` | 127,7 | câmera vai para a rua de obras; a casinha abre em duas gavetas: LIMPEZA (caminhão de lixo) e ASFALTO (rolo) | obras |
| 58 | `limpeza tinha 206 mil` | 131,6 | na gaveta LIMPEZA, contorno tracejado bem baixo "RESERVADO R$ 206 MIL" | obras |
| 59 | `terminou com 6 milhoes e meio` | 134,5 | torre verde sólida cresce até 3,3 pilhas; R$ 6,5 MI | obras |
| 60 | `asfalto ... tinham 2 milhoes` | 136,6 | na gaveta ASFALTO, contorno tracejado de 1 pilha "RESERVADO R$ 2 MI" | obras |
| 61 | `usaram so 120 mil` | 138,9 | dentro do tracejado, só uma moedinha verde; R$ 120 MIL | obras |
| 62 | `2026 a mesma coisa` | 140,6 | torres rosa ao lado: limpeza passa de 2,5 pilhas (R$ 5,2 MI), asfalto só uma moedinha (R$ 50 MIL) | obras |
| 63 | `Volta da Serra` | 146,5 | na borda, um trecho de rua com placa genérica "GOVERNO DO ESTADO · 2024 · R$ 1,5 MI" (sem brasão nem logo) | obras |
| 64 | `No Tribunal de Contas` | 150,8 | prédio do Tribunal (da série) entra ao fundo; pílula NO TRIBUNAL | tribunal |
| 65 | `agua e do esgoto 39` | 152,4 | pasta "ÁGUA E ESGOTO · R$ 39 MI" | tribunal |
| 66 | `mandou parar` | 155,6 | carimbo neutro "SUSPENSA" (0,4 s); impacto | tribunal |
| 67 | `prefeitura cancelou` | 156,8 | o carimbo troca para "CANCELADA" | tribunal |
| 68 | `pneus de 2 milhoes` | 158,4 | pasta "PNEUS · R$ 2 MI" → "CANCELADA" em 161,0 | tribunal |
| 69 | `ainda analisa` | 162,4 | três pastas entram uma por palavra: "ADVOCACIA · R$ 2 MI" (163,2), "REMÉDIOS" (166,2), "TRANSPORTE ESCOLAR" (167,3), com selo "EM ANÁLISE" | tribunal |
| 70 | `Gastar nao e crime` | 168,3 | mesa inteira; texto pequeno no alto "GASTAR NÃO É CRIME" | pergunta |
| 71 | `a festa cresce` | 171,7 | palco acende; "?" | pergunta |
| 72 | `o asfalto nao sai` | 172,6 | gaveta do asfalto acende vazia; "?" | pergunta |
| 73 | `Segue o` | 173,6 | @eumagnoleite em verde; ding | e você? |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 13,9 | Kit Mapas | PARATINGA · ARRECADOU |
| 2024 | 13,9 → 51,4 | começa de cima (cofre e pilha dourada); em "Educação" desce para a escola e gira **no sentido horário**, casinha por casinha, segurando 0,55 s em cada uma; no fim chega à sirene e à casinha cinza | 2024 · PARA ONDE FOI |
| virada de ano | 51,4 / 87,1 | sobe para a vista de cima (o cofre se enche com a cor nova); depois desce de novo na escola. Não volta pela mesa: sobe, recomeça. | 2025 / 2026 · ATÉ SETEMBRO |
| 2025 e 2026 | 59,3 → 118,2 | o mesmo giro horário, um pouco mais rápido | |
| festas | 118,7 → 127,7 | para entre o palco e a assistência (vizinhos, 7 e 8 na ordem) | AGORA REPARA |
| obras | 127,7 → 150,8 | a rua de obras é a casinha 4, que fica para trás no giro. Para não andar de volta pela mesa, a câmera **sobe e mergulha** na rua de obras (o mesmo movimento da virada de ano) e depois desliza para a borda, até Volta da Serra | A SECRETARIA DE OBRAS |
| tribunal | 150,8 → 168,3 | recua e mostra o Tribunal ao fundo da mesa; pastas na frente | NO TRIBUNAL |
| pergunta | 168,3 → 176,3 | mesa inteira, arco lento, termina entre o palco aceso e a gaveta vazia do asfalto | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Anexo 9 e Balanço enviados ao TCM-BA"
- 2026: "Fonte: SIGA de setembro/2026 (Prefeitura e Câmara), TCM-BA · despesa liquidada"
- Festas e obras: "Fonte: despesa por ação (SIGA dez/2024, dez/2025, set/2026), TCM-BA"
- Volta da Serra: "Fonte: Bahia Notícias, 22/12/2024"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 06/11/2026"

## 7. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro; subida na torre da limpeza; baque nos três "a mais" e no zero; impacto nos carimbos; ding no fim. Sem trilha, igual à série.

## 8. Arquivos
- `src/videos/orcamentoparatinga/` a partir de `orcamentocanavieiras/` (mesmas peças: cofre, PilhasDinheiro, torreFina, curva do cofre, plaquinhas por ano). Peças novas: `GavetaObra` (tracejado "RESERVADO" + torre sólida "USADO"), `PalcoFesta` (palco com bandeirinhas), `CaixaDagua`, `Sirene`, `RuaEstado` (placa genérica), `PastaProcesso` com carimbo trocável.
- `src/Root.tsx`: `OrcamentoParatinga`, `OrcamentoParatingaGuia`, `OrcamentoParatingaLimpo`, `CapaOrcamentoParatinga`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-paratinga/` (IBGE 2923704) → `projetos/035.../mapas/paratinga.mp4`.
- Capa proposta: "A festa / cresce. / O asfalto / não sai."
- 5289 quadros; conferir o disco (`df -h ~`) antes do vídeo final.
