# Plano de cenas: 038. orçamento de itapitanga (versão 1, aprovada em 07/11/2026)

Código `orcamentoitapitanga` · Nome `OrcamentoItapitanga` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **035 Paratinga v2** (`src/videos/orcamentoparatinga/`, aprovado e amado). Kit Mapas na abertura + Estúdio 3D na maquete. Marca d'água @eumagnoleite pequena e sutil quicando pela tela o vídeo todo.

## 1. Narração
- `audio/narracao-norm.wav`: **178,56 s** (voz Mário, pausas encurtadas para 0,22 s, 1,2x). `AUDIO_SEG = 178.56` · `QUADROS = 5384` (com 0,9 s de folga).
- 456 palavras, iguais ao roteiro aprovado. A última ("informações.") termina em 178,14 s. Sem ajuste manual.
- Números falados em pedaços ("4 milhões e 100", "11 e 700") têm palavras de duração quase zero: o gatilho é sempre o NOME do setor (`quando('Saude 11')`), nunca o número sozinho.
- Repetidas: cada setor 3× (Educação 17,4 / 53,1 / 84,9; Saúde 20,1 / 55,5 / 87,6; Administração 21,9 / 57,1 / 88,9; Obras 23,9 / 59,2 / 91,1; Câmara 26,9 / 61,2 / 93,3; Dívidas 29,6 / 62,6 / 94,6; Cultura 31,3 / 64,4 / 95,9; Assistência 33,1 / 65,7 / 97,9; Água 35,2 / 68,1 / 99,5; Agricultura e meio ambiente 39,1 / 69,8 / 101,2; Esporte 42,6 / 72,9 / 104,1 e 130,4), "Arrecadou" 3×, "Gastou" 3×, "Tribunal de Contas" 2× (5,8 / 151,5), "quase 1 milhão" 2× (120,1 / 128,x), "terceiriz-" 4× (108,1 / 162,5 / 172,6), "Governo do Estado" / "do Estado" 2× (37,7 Embasa / 150,4).

## 2. A maquete (igual ao 035, com os dados de Itapitanga)
- **Mesa redonda** com o **cofre no meio**; em volta, a **pilha do ano**. Escala fixa: **1 pilha = R$ 2 milhões** (moedinhas soltas abaixo de R$ 1 mi). 2024 = 33,6 pilhas · 2025 = 35,8 · 2026 até setembro = 28,7.
- **Cor por ano**: dourado 2024 · verde 2025 · rosa 2026. Placar: "1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026".
- **Setores em volta da mesa, sentido horário, na ordem da fala** (mesma ordem nos 3 anos), casinhas sobem na palavra e ficam até o fim:

| # | setor | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 26,6 | 27,8 | 23,4 |
| 2 | Saúde | posto | 14,5 | 13,7 | 11,7 |
| 3 | Administração | prefeitura | 8,6 | 11,3 | 9,3 |
| 4 | Obras e serviços urbanos | rua com rolo de asfalto e caminhão | 9,4 | 9,5 | 7,0 |
| 5 | Câmara de Vereadores | prédio com cúpula | 1,8 | 2,1 | 1,5 |
| 6 | Dívidas | pasta com cadeado | 1,3 | 2,5 | 1,1 |
| 7 | Cultura | palco com bandeirinhas | 1,6 | 1,6 | 0,55 |
| 8 | Assistência social | prédio baixo "ASSISTÊNCIA" | 3,0 | 2,7 | 2,2 |
| 9 | Água e saneamento | caixa d'água **cinza**, plaquinha "ÁGUA: EMBASA (ESTADO)" | zero | zero | zero |
| 10 | Agricultura e meio ambiente | trator + 3 árvores na mesma base, plaquinha "1 SECRETARIA" | 0,30 | 0,47 | 0,59 |
| 11 | Esporte | quadra **cinza** com traves, plaquinha "ZERO EM PROGRAMAS" | zero | zero | zero |
| 12 ★ | Mão de obra terceirizada (cena do achado) | galpão "MÃO DE OBRA" com bonecos de colete na porta, logo depois do esporte, na borda | só entra em "Agora repara" | | |

- **Torres por ano** na frente de cada casinha, finas, lado a lado (como 035). Plaquinha pequena em TODOS os setores falados, por menor que seja; ao falar um setor, aparecem também as plaquinhas dos anos anteriores, cada uma na sua cor. Zero: casinha cinza com chip "R$ 0" e o motivo, sem torre.
- **2024 sobrou dinheiro** ★: em "Sobraram", 1,5 pilha dourada fica dentro do cofre com plaquinha "SOBROU R$ 2,9 MI" (sem torre vermelha).
- **Torre vermelha "A MAIS"** ao lado do cofre: 2025 = 1,1 pilha (R$ 2,2 MI A MAIS) · 2026 = 2 pilhas (R$ 4,1 MI A MAIS).
- Borda da mesa: roça de cacau (árvores baixas genéricas do sul da Bahia), sem rio, sem marcas, sem rostos. Nada tapando o último setor.

## 3. Mapa (Kit Mapas, 0 → 13,0 s → `projetos/038.../mapas/itapitanga.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · ITAPITANGA | 0 → 9,7 s | voo do Brasil até Itapitanga (sul da Bahia, IBGE 2916609, satélite); contorno do município acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,6 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (5,8 s), "2024" (9,7 s) |
| B · ARRECADOU 2024 | 9,7 → 13,0 s | "R$ 70 MI" + "ARRECADOU EM 2024" na cidade (11,4 s); câmera aproxima devagar |
Sem nome de gestor no mapa.

## 4. Eventos (`quando` → tempo → o que acontece)
Em cada número: plaquinha com o valor + empurrão leve de câmera (0,5 s). Sem porcentagem.

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Itapitanga gastou` | 0,0 | voo começa; PARA ONDE FOI CADA REAL? | mapa A |
| 2 | `Tribunal de Contas` | 5,8 | tag TCM | mapa A |
| 3 | `2024 A prefeitura` | 9,7 | pílula 2024 | mapa A→B |
| 4 | `arrecadou 70` | 11,4 | R$ 70 MI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 67` | 13,0 | entra a maquete; 33,6 pilhas douradas sobem em volta do cofre; R$ 67,2 MI | 2024 |
| 6 | `Sobraram 2` | 15,3 | ★ 1,5 pilha fica no cofre: SOBROU R$ 2,9 MI; ding curto | 2024 |
| 7 | `Educacao 26` | 17,4 | escola sobe; 13,3 pilhas voam para a escola; R$ 26,6 MI | 2024 |
| 8 | `Saude 14` | 20,1 | posto; 7,2 pilhas; R$ 14,5 MI | 2024 |
| 9 | `Administracao 8` | 21,9 | prefeitura; 4,3 pilhas; R$ 8,6 MI | 2024 |
| 10 | `Obras e servicos urbanos` | 23,9 | rua de obras; 4,7 pilhas; R$ 9,4 MI | 2024 |
| 11 | `Camara de Vereadores` | 26,9 | Câmara; 0,9 pilha; R$ 1,8 MI | 2024 |
| 12 | `Dividas 1 e 300` | 29,6 | pasta com cadeado; R$ 1,3 MI | 2024 |
| 13 | `Cultura 1 e 600` | 31,3 | palco; R$ 1,6 MI | 2024 |
| 14 | `Assistencia social 3` | 33,1 | assistência; 1,5 pilha; R$ 3 MI | 2024 |
| 15 | `Agua e saneamento zero` | 35,2 | caixa d'água sobe cinza; chip R$ 0; baque leve | 2024 |
| 16 | `da Embasa` | 37,7 | plaquinha "ÁGUA: EMBASA (ESTADO)" na caixa | 2024 |
| 17 | `Agricultura e meio ambiente numa` | 39,1 | trator + árvores na mesma base; "1 SECRETARIA"; moedinhas; R$ 300 MIL | 2024 |
| 18 | `Esporte zero em programas` | 42,6 | quadra sobe cinza; chip R$ 0 · ZERO EM PROGRAMAS | 2024 |
| 19 | `2025 Arrecadou` | 44,6 | sobe para a vista de cima; pílula 2025; 35,8 pilhas verdes em volta do cofre | 2025 |
| 20 | `Arrecadou 69` | 46,0 | R$ 69,5 MI | 2025 |
| 21 | `Gastou 71 e 700` | 48,4 | R$ 71,7 MI | 2025 |
| 22 | `2 milhoes e 200 a mais` | 50,6 | torre vermelha: R$ 2,2 MI A MAIS; baque | 2025 |
| 23 a 33 | os 11 setores de 2025 | 53,1 → 72,9 | mesmo giro horário; pilhas verdes voam para cada casinha; plaquinha dourada de 2024 aparece junto em cada setor; água e esporte acendem o "R$ 0" de novo ("DE NOVO") | 2025 |
| 34 | `2026 ate setembro` | 74,6 | sobe; pílula 2026 · ATÉ SETEMBRO; 28,7 pilhas rosa | 2026 |
| 35 | `Arrecadou 53` | 77,9 | R$ 53,3 MI | 2026 |
| 36 | `Ja gastou 57` | 80,0 | R$ 57,4 MI | 2026 |
| 37 | `Sao 4 milhoes` | 82,6 | 2ª torre vermelha, maior: R$ 4,1 MI A MAIS; baque | 2026 |
| 38 a 48 | os 11 setores de 2026 | 84,9 → 104,1 | mesmo giro; torre rosa ao lado da dourada e da verde, com as 3 plaquinhas | 2026 |
| 49 | `Agora repara` | 105,2 | câmera segue o giro e chega ao galpão "MÃO DE OBRA" (logo depois da quadra); pílula AGORA REPARA | terceirização |
| 50 | `mao de obra terceirizada` | 108,1 | porta do galpão abre; fila de bonecos genéricos de colete sai e se espalha pela mesa em direção à escola, prefeitura e obras ★ | terceirização |
| 51 | `Uma empresa recebeu` | 109,7 | plaquinha "EMPRESA 1" | terceirização |
| 52 | `cinco meses` | 112,1 | torre dourada 2,4 pilhas: R$ 4,9 MI · 5 MESES DE 2024 | terceirização |
| 53 | `8 e 700 em 2025` | 114,2 | torre verde 4,3 pilhas: R$ 8,7 MI · 2025 | terceirização |
| 54 | `outra empresa` | 117,2 | plaquinha troca para "EMPRESA 2" (0,4 s) | terceirização |
| 55 | `8 e 700 ate setembro` | 118,5 | torre rosa 4,3 pilhas: R$ 8,7 MI · ATÉ SET/2026 | terceirização |
| 56 | `Quase 1 milhao por mes` | 120,1 | ★ calendário com 9 folhas (jan a set) atrás do galpão, cada folha recebe uma pilha meia-altura; "QUASE R$ 1 MI POR MÊS"; subida | terceirização |
| 57 | `As festas levaram` | 121,7 | sobe para a vista de cima; palco acende (bandeirinhas); plaquinhas FESTAS R$ 1,5 MI (2024) | comparação |
| 58 | `quase 1 e 600` | 125,1 | FESTAS R$ 1,6 MI (2025) | comparação |
| 59 | `A pavimentacao de ruas` | 127,3 | rua de obras acende só o rolo de asfalto: PAVIMENTAÇÃO R$ 500 MIL (2024) e R$ 1 MI (2025) | comparação |
| 60 | `Os programas de esporte` | 130,4 | quadra cinza acende devagar: R$ 0 | comparação |
| 61 | `pavimentacao das ruas previa` | 133,4 | câmera mergulha na rua de obras; abre em 2 gavetas: PAVIMENTAÇÃO DAS RUAS (tracejado rosa 1 pilha "PREVIA R$ 1,9 MI") | obras 2026 |
| 62 | `e usou 290` | 136,4 | dentro do tracejado, só moedinhas: USOU R$ 290 MIL | obras 2026 |
| 63 | `estradas vicinais` | 139,0 | 2ª gaveta ESTRADAS VICINAIS (estrada de terra com motoniveladora genérica): tracejado mínimo "PREVIA R$ 96 MIL" | obras 2026 |
| 64 | `ja usaram 1 e 300` | 141,6 | torre rosa sólida sobe até 0,65 pilha: USOU R$ 1,3 MI | obras 2026 |
| 65 | `E 5 milhoes` | 142,9 | câmera sobe para o cofre; 2,5 pilhas rosa ganham envelopes "CONTA ANTIGA" | contas antigas |
| 66 | `contas de anos anteriores` | 146,1 | os envelopes voam para uma bandeja ao lado do cofre: CONTAS DE ANOS ANTERIORES · R$ 5 MI (2026) | contas antigas |
| 67 | `O colegio estadual` | 147,6 | na borda, colégio de 2 andares com placa genérica "COLÉGIO ESTADUAL · R$ 20 MI" (sem brasão nem logo) | Estado |
| 68 | `Governo do Estado` | 150,4 | placa ganha a faixa "OBRA DO GOVERNO DO ESTADO" | Estado |
| 69 | `No Tribunal de Contas` | 151,5 | prédio do Tribunal (da série) ao fundo; pílula NO TRIBUNAL | tribunal |
| 70 | `484 temporarios` | 153,5 | pasta "TEMPORÁRIOS" + fila de 10 bonecos claros (cada um = 48): 484 | tribunal |
| 71 | `389 concursados` | 156,4 | fila ao lado, 8 bonecos escuros: 389 CONCURSADOS (segundo a denúncia) | tribunal |
| 72 | `decisao provisoria` | 158,6 | carimbo neutro "DECISÃO PROVISÓRIA" (0,4 s); impacto | tribunal |
| 73 | `sem selecao` | 161,5 | faixa sobre a fila clara: "SEM NOVOS TEMPORÁRIOS SEM SELEÇÃO" | tribunal |
| 74 | `analisa a terceirizacao` | 162,5 | 3 pastas entram uma por palavra com selo EM ANÁLISE: TERCEIRIZAÇÃO (162,5) | tribunal |
| 75 | `o combustivel` | 164,0 | COMBUSTÍVEL · R$ 4,5 MI | tribunal |
| 76 | `limpeza urbana` | 166,1 | LIMPEZA URBANA · R$ 2,4 MI | tribunal |
| 77 | `Gastar nao e crime` | 167,5 | mesa inteira; texto pequeno no alto "GASTAR NÃO É CRIME" | pergunta |
| 78 | `vai para terceirizados` | 172,6 | galpão MÃO DE OBRA acende; "?" | pergunta |
| 79 | `o asfalto das ruas` | 173,8 | gaveta da pavimentação acende quase vazia; "?" | pergunta |
| 80 | `Segue o` | 175,7 | @eumagnoleite em verde; ding | fim |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 13,0 | Kit Mapas | ITAPITANGA · ARRECADOU |
| 2024 | 13,0 → 44,6 | começa de cima (cofre e pilha dourada); em "Educação" desce para a escola e gira **no sentido horário**, casinha por casinha, segurando 0,55 s em cada; termina na quadra cinza | 2024 · PARA ONDE FOI |
| viradas de ano | 44,6 / 74,6 | sobe para a vista de cima (cofre se enche com a cor nova), desce de novo na escola. Não volta pela mesa | 2025 / 2026 · ATÉ SETEMBRO |
| 2025 e 2026 | 53,1 → 104,1 | mesmo giro, um pouco mais rápido | |
| terceirização | 105,2 → 121,7 | continua o giro: da quadra passa ao galpão (casinha 12), arco lento em volta do galpão e do calendário | AGORA REPARA |
| comparação | 121,7 → 133,4 | sobe para a vista de cima, levemente inclinada, mostrando palco, rua de obras e quadra juntos | FESTA × ASFALTO |
| obras 2026 | 133,4 → 142,9 | mergulha na rua de obras (de cima, sem andar de volta pela borda) | O ASFALTO |
| contas antigas | 142,9 → 147,6 | sobe de novo e para em cima do cofre | CONTAS ANTIGAS |
| Estado | 147,6 → 151,5 | desliza do cofre para a borda, até o colégio | OBRA DO ESTADO |
| tribunal | 151,5 → 167,5 | recua e mostra o Tribunal ao fundo; filas e pastas na frente | NO TRIBUNAL |
| pergunta | 167,5 → 179,5 | mesa inteira, arco lento, termina entre o galpão aceso e a gaveta do asfalto | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Anexo 9 e Balanço enviados ao TCM-BA"
- 2026: "Fonte: SIGA de setembro/2026 (Prefeitura e Câmara), TCM-BA · despesa liquidada"
- Terceirização: "Fonte: pagamentos do Portal da Transparência, conferidos com a relação de pagamentos do TCM-BA"
- Festas, asfalto, vicinais e contas antigas: "Fonte: despesa por ação (SIGA dez/2024, dez/2025, set/2026), TCM-BA"
- Colégio: "Fonte: Jornal Grande Bahia, 22/01/2026"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 07/11/2026"

## 7. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro e em cada boneco que sai do galpão (bem baixo); subida no calendário e na torre das vicinais; baque nos dois "a mais" e nos zeros; impacto no carimbo; ding no "sobrou" e no fim. Sem trilha.

## 8. Arquivos
- `src/videos/orcamentoitapitanga/` copiado de `orcamentoparatinga/` (cofre, pilhas, torres finas, plaquinhas por ano, gavetas, palco, caixa d'água, pastas com carimbo, Tribunal). Trocar dados, `T` (tempos) e setores.
- Peças novas (em `pecas.tsx`): `GalpaoMaoDeObra` (galpão com porta e bonecos genéricos de colete), `CalendarioMeses` (9 folhas), `QuadraEsporte` cinza (se o 035 não tiver), `ColegioEstado` com placa genérica, `FilaBonecos` (temporários x concursados), `BandejaContas` (envelopes).
- Tirar do molde: sirene/casinha de cachorro (defesa civil), rua do Estado de Volta da Serra, limpeza.
- `src/Root.tsx` (só acrescentar): `OrcamentoItapitanga`, `OrcamentoItapitangaGuia`, `OrcamentoItapitangaLimpo`, `CapaOrcamentoItapitanga`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-itapitanga/` (copiado de `orcamento-paratinga`, IBGE 2916609) → `projetos/038.../mapas/itapitanga.mp4`.
- Capa aprovada: "R$ 1 mi / por mês em / mão de obra / terceirizada" sobre o quadro do galpão com o calendário.
- 5384 quadros; render só com a trava `projetos/_render.lock`.

## 9. Origem das escolhas
- Do Magno / `_aprendizados.md`: estrutura e câmera do 035; cofre central com pilhas por ano voando para o setor; câmera num sentido só (sobe e recomeça); plaquinha em todo setor, com os anos anteriores; zero com casinha cinza e motivo; sem porcentagem; sem nome de gestor nem em processo; marca d'água quicando; nada de cartão grande; sem rio fora de Itabuna.
- Minhas (★): pilha "SOBROU" no cofre em 2024 (em vez da torre vermelha); galpão da mão de obra como 12ª casa no fim do giro (assim a câmera não volta); calendário de 9 meses para "quase 1 milhão por mês"; filas de bonecos para 484 x 389; envelopes "CONTA ANTIGA" saindo do cofre.
