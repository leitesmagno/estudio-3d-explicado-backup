# Plano de cenas: 041. orçamento de camaçari (versão 1)

Código `orcamentocamacari` · Nome `OrcamentoCamacari` · Perfil @eumagnoleite · série Magno Explica.
Molde de código: **035 Paratinga v2** (`src/videos/orcamentoparatinga/`), aprovado e elogiado. Abertura no **Kit Mapas** + maquete no **Estúdio 3D**. Marca d'água @eumagnoleite pequena e sutil quicando pela tela inteira, do início ao fim.

**O que vem das regras e pedidos (não muda):** só valores, sem porcentagem; sem nome de gestor; sem segurança pública; cofre no centro e a pilha de cada ano em volta, voando para cada setor na palavra dele; câmera sempre no mesmo sentido (horário); casinhas sobem e ficam; plaquinhas pequenas em TODOS os setores, com as dos anos anteriores na cor do ano; setor zerado em cinza; sem rio na mesa (`MesaMaquete rio={false}`); nada tapando o setor do final.
**Pedido do Magno só para Camaçari (07/11/2026):** **1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI**, escrito no placar. A escala muda só o desenho: todo valor dito ou escrito é o exato do PDF.
**Escolhas do diretor:** marcadas com ★.

## 1. Narração
- `audio/narracao-norm.wav`: **174,26 s** (voz Roger; 1ª frase trocada pelo teste com "Camaçarí" certo; pausas 0,28 s; acelerada 1,444x). `AUDIO_SEG = 174.26` · `QUADROS = 5255`.
- 455 palavras, iguais ao roteiro aprovado. A última ("informações.") termina em 173,96 s.
- Ajuste da sincronia: trecho 43–50 s ("2 bilhões e 216", "2 bilhões e 161") com tempos pelos silêncios do áudio.
- **Palavras repetidas** (usar trecho único ou a ocorrência no `quando()`):
  - "gastou 2 bilhões e 161": abertura 0,42 / 2025 **47,36** → `quando('Gastou 2 bilhoes e 161', 2)`.
  - Cada setor 3×: Educação 16,5 / 51,3 / 83,9 · Saúde 18,6 / 53,0 / 86,2 · Administração 20,4 / 54,6 / 87,7 · Obras 23,0 / 56,6 / 91,7 · Câmara 25,9 / 59,0 / 93,6 · Dívidas 28,5 / 60,8 / 95,0 · Aposentadorias 30,0 / 62,8 / 96,6 · Cultura 32,5 / 64,5 / 98,7 · Assistência 33,8 / 65,8 / 99,9 · Lixo e limpeza 35,5 / 67,6 / 101,7 · Agricultura 37,5 / 69,3 / 103,4 · Esporte 39,8 / 71,3 / 104,4 · Meio ambiente 41,2 / 73,2 / 106,1 (e 144,8 no achado). No código, `quando(setor, k)`.
  - "Tribunal de Contas" 2× (5,76 / 155,28): `quando('No Tribunal de Contas')` para o bloco final.
  - "2025" e "2026" aparecem muitas vezes: sempre com a palavra vizinha (`quando('2025 Arrecadou')`, `quando('2026 ate setembro')`, `quando('reservou 3')`...).
  - Números com vírgula não aparecem na fala (só "e meio", "e 600"), então não há o problema do `quando()` com vírgula.

## 2. A maquete

### 2.1 Mesa, cofre e escala
- **Mesa redonda** com o **cofre no meio** (as peças do 035). Em volta do cofre, a **pilha do ano**. Escala **1 moeda = R$ 1 mi, 1 pilha (10 moedas) = R$ 10 mi**.
- **A conta das pilhas** (para o Magno conferir se não lota):

| ano | gastou | pilhas em volta do cofre | no 035 eram |
|---|---|---|---|
| 2024 | R$ 2,402 bi | **240** | 76 |
| 2025 | R$ 2,161 bi | **216** | 80 |
| 2026 até set | R$ 1,630 bi | **163** | 70 |

  São **cerca de 3 vezes mais pilhas** que em Paratinga. ★ Para não lotar sem mudar a escala: o anel em volta do cofre vira **3 anéis encostados** (raios 1,6 / 2,0 / 2,4) e a torre de cada setor fica mais larga (lado 3 em vez de 2: 9 pilhas por andar). Educação 2024 (53 pilhas) dá 6 andares, a mais alta da mesa. Se na revisão ainda parecer lotado, eu mostro o quadro e peço o seu ok antes de mudar a escala.
- Abaixo de 1 pilha, viram **moedas soltas** (1 moeda = R$ 1 mi): Agricultura 5 / 6 / 5 moedas, Esporte 9 / 2 / 1. Meio ambiente (234 mil, 391 mil, 47 mil) e menos de 1 moeda: **uma moedinha pequena** (¼ de moeda) só para marcar, e a plaquinha diz o valor exato.
- **Cor por ano**: dourado 2024 · verde 2025 · rosa 2026 (iguais ao 035).
- **Placar** (topo, compacto): "1 MOEDA = R$ 1 MI · 1 PILHA = R$ 10 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026".
- **Sobrou em vez de faltou**: Camaçari arrecadou mais do que gastou nos 3 anos, então **não há torre vermelha "A MAIS"**. ★ No lugar, uma **pilha pequena "SOBROU"** ao lado do cofre, na cor do ano e em tom apagado (não acento), quando a voz diz "Sobraram": 2024 = meia pilha (R$ 4,99 mi), 2025 = 5,5 pilhas (R$ 55,6 mi), 2026 = 1 pilha (R$ 9,6 mi).

### 2.2 Setores em volta da mesa (sentido horário, na ordem da fala, igual nos 3 anos)

| # | setor (fala) | casinha | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | Educação | escola | 530,9 | 521,2 | 374,3 |
| 2 | Saúde | posto | 423,2 | 403,6 | 340,0 |
| 3 | Administração | prefeitura (★ com uma gaveta lateral "PROPAGANDA" que só abre no achado) | 293,3 | 266,9 | 256,1 |
| 4 | Obras e serviços urbanos | rua com rolo de asfalto e poste | 354,5 | 164,1 | 97,8 |
| 5 | Câmara de Vereadores | prédio com cúpula | 75,6 | 76,1 | 59,0 |
| 6 | Dívidas | pasta com cadeado (banco) | 161,5 | 267,1 | 144,1 |
| 7 | Aposentadorias dos servidores | ★ peça nova: prédio baixo "APOSENTADORIAS" com dois bonecos genéricos de bengala na porta | 157,2 | 167,8 | 131,5 |
| 8 | Cultura | palco com bandeirinhas | 55,3 | 44,2 | 9,1 |
| 9 | Assistência social | prédio "ASSISTÊNCIA" | 86,9 | 68,6 | 56,9 |
| 10 | Lixo e limpeza urbana | ★ caminhão de lixo e contêineres (peça da rua de obras do 035, sem o rolo) | 179,7 | 137,9 | 109,8 |
| 11 | Agricultura | trator | 5,3 | 6,2 | 5,1 |
| 12 | Esporte | quadra | 9,1 | 2,3 | 1,5 |
| 13 | Meio ambiente | árvores | 0,234 | 0,391 | 0,047 |
| 14 | Proteção animal | casinha de cachorro **cinza** | R$ 0 | R$ 0 | R$ 0 |
| 15 | ★ Casa Melhor (só no achado) | casinha popular **cinza**, baixa, "CASA MELHOR" | | 1 mi reservado, R$ 0 | |

- Os setores grandes (1, 2, 3, 4, 6, 7, 10) ganham fatias maiores da borda; os pequenos (11 a 15) ficam juntos no fim do giro, um do lado do outro.
- **Torres** na frente de cada casinha, uma por ano, lado a lado (dourada, verde, rosa), cada uma com a sua plaquinha.
- **Em 2026, Cultura e Administração**: na palavra "as festas estão dentro dela", ★ um palquinho rosa com bandeirinhas aparece **encostado na prefeitura** (as festas mudaram de linha), e a plaquinha da Cultura 2026 diz "R$ 9,1 MI · SEM AS FESTAS".
- **Borda da mesa** (paisagem): ★ silhuetas genéricas do Polo Industrial (chaminés, tanques, sem marcas) no fundo, atrás dos setores 10 a 15, baixas para não brigar com o topo. Litoral (faixa de areia) no outro lado. Sem rio.

### 2.3 Paleta (tudo do tema do perfil)
| uso | campo |
|---|---|
| fundo, céu | `tema.fundo` |
| mesa | `tema.chao` (tom médio) |
| casinhas | `tema.objeto` |
| setor zerado (proteção animal, Casa Melhor) | `tema.objetoEscuro` com contorno cinza |
| anos | `CA` do 035: dourado, verde, rosa |
| "reservado" (tracejado) | branco, como no 035 |
| destaque (só festas e propaganda no achado, @ no fim) | `tema.acento` |

## 3. Mapa (Kit Mapas, 0 → 12,8 s, vira `mapas/camacari.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · CAMAÇARI | 0 → 8,8 s | voo do Brasil até Camaçari (litoral norte de Salvador, satélite); contorno do município acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,4 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (5,8 s), "2024" (8,8 s). Cidade no litoral: etiquetas com `dx` negativo (lado da terra), regra do 017. |
| B · ARRECADOU 2024 | 8,8 → 12,8 s | "R$ 2,41 BI" + "ARRECADOU EM 2024" na cidade (10,2 s); câmera aproxima devagar |
Sem nome de gestor no mapa. IBGE de Camaçari: 2905701 (conferir na malha antes do render).

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor exato + empurrão leve de câmera (0,5 s). Valores das plaquinhas com 1 casa (R$ 530,9 MI) e "BI" para bilhões com 2 casas (R$ 2,41 BI); os exatos estão no `fontes.md`.

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Camacari gastou` | 0,00 | voo começa; tag PARA ONDE FOI CADA REAL? | mapa A |
| 2 | `Tribunal de Contas` | 5,76 | tag TRIBUNAL DE CONTAS DOS MUNICÍPIOS | mapa A |
| 3 | `2024 O municipio` | 8,82 | tag 2024; pílula 2024 | mapa A→B |
| 4 | `arrecadou 2 bilhoes e 407` | 10,24 | R$ 2,41 BI · ARRECADOU EM 2024 | mapa B |
| 5 | `Gastou 2 bilhoes e 402` | 12,80 | entra a maquete (vista de cima); 240 pilhas douradas sobem em volta do cofre em 3 anéis; chip "GASTOU EM 2024: R$ 2,40 BI" | 2024 |
| 6 | `Sobraram quase 5` | 14,86 | meia pilha apagada "SOBROU R$ 5 MI" ao lado do cofre; pop | 2024 |
| 7 | `Educacao` (1) | 16,54 | escola sobe; 53 pilhas voam do anel para a escola; R$ 530,9 MI | 2024 |
| 8 | `Saude` (1) | 18,64 | posto; 42 pilhas; R$ 423,2 MI | 2024 |
| 9 | `Administracao` (1) | 20,44 | prefeitura; 29 pilhas; R$ 293,3 MI | 2024 |
| 10 | `Obras e servicos` (1) | 22,96 | rua com rolo; 35 pilhas; R$ 354,5 MI | 2024 |
| 11 | `Camara` (1) | 25,88 | Câmara; 7,6 pilhas; R$ 75,6 MI | 2024 |
| 12 | `Dividas` (1) | 28,52 | pasta com cadeado; 16 pilhas; R$ 161,5 MI | 2024 |
| 13 | `Aposentadorias` (1) | 30,00 | prédio APOSENTADORIAS; 16 pilhas; R$ 157,2 MI | 2024 |
| 14 | `Cultura` (1) | 32,46 | palco; 5,5 pilhas; R$ 55,3 MI | 2024 |
| 15 | `Assistencia social` (1) | 33,78 | assistência; 8,7 pilhas; R$ 86,9 MI | 2024 |
| 16 | `Lixo e limpeza` (1) | 35,52 | caminhão de lixo; 18 pilhas; R$ 179,7 MI | 2024 |
| 17 | `Agricultura` (1) | 37,54 | trator; 5 moedas; R$ 5,3 MI | 2024 |
| 18 | `Esporte` (1) | 39,84 | quadra; 9 moedas; R$ 9,1 MI | 2024 |
| 19 | `Meio ambiente` (1) | 41,18 | árvores; 1 moedinha; R$ 234 MIL | 2024 |
| 20 | `2025 Arrecadou` | 43,34 | câmera sobe para a vista de cima; pílula 2025; 216 pilhas verdes nascem no anel | 2025 |
| 21 | `Arrecadou 2 bilhoes e 216` | 44,56 | chip "ARRECADOU EM 2025: R$ 2,22 BI" | 2025 |
| 22 | `Gastou 2 bilhoes e 161`, 2 | 47,36 | chip "GASTOU EM 2025: R$ 2,16 BI" | 2025 |
| 23 | `Sobraram 55` | 49,56 | 5,5 pilhas verdes apagadas "SOBROU R$ 55,6 MI" | 2025 |
| 24–36 | os 13 setores (2) | 51,30 → 73,20 | mesmo giro horário; pilhas verdes voam para cada casinha e formam a torre 2025 ao lado da dourada; plaquinha dourada de 2024 aparece junto (menor) | 2025 |
| 37 | `2026 ate setembro` | 75,02 | sobe para a vista de cima; pílula 2026 · ATÉ SETEMBRO; 163 pilhas rosa no anel | 2026 |
| 38 | `Arrecadou 1 bilhao` | 77,90 | "ARRECADOU ATÉ SET/2026: R$ 1,64 BI" | 2026 |
| 39 | `Gastou 1 bilhao` | 80,36 | "GASTOU ATÉ SET/2026: R$ 1,63 BI" | 2026 |
| 40 | `Sobram quase 10` | 82,28 | 1 pilha rosa apagada "SOBRAM R$ 9,6 MI" | 2026 |
| 41–46 | Educação → Administração (3) | 83,88 → 87,68 | mesmo giro; torre rosa em cada casinha com as plaquinhas dourada e verde ao lado | 2026 |
| 47 | `as festas estao dentro` | 90,10 | ★ palquinho rosa com bandeirinhas encosta na prefeitura; plaquinha "FESTAS AGORA AQUI" | 2026 |
| 48–55 | Obras → Meio ambiente (3) | 91,66 → 106,10 | mesmo giro; Cultura 2026 com "R$ 9,1 MI · SEM AS FESTAS" | 2026 |
| 56 | `Protecao animal` | 107,76 | casinha de cachorro sobe **cinza** | 2026 |
| 57 | `nenhum real gasto` | 108,66 | chip "R$ 0 EM 2024, 2025 E 2026*"; baque leve | 2026 |
| 58 | `Agora repara` | 110,54 | câmera sobe e mergulha no palco (Cultura, casa 8); pílula AGORA REPARA | festas |
| 59 | `Em 2024 o orcamento` | 111,88 | ★ três "gavetas" do palco se abrem lado a lado (2024, 2025, 2026). Aqui, **1 pilha = R$ 1 MI** (placar troca: "AQUI, 1 PILHA = R$ 1 MI · BRANCO = RESERVADO") | festas |
| 60 | `reservou 5` | 113,24 | gaveta 2024: contorno tracejado branco de 5 pilhas "RESERVADO R$ 5 MI" | festas |
| 61 | `gastou 26` | 114,96 | torre dourada sólida sobe até 26,6 pilhas, muito acima do tracejado; R$ 26,6 MI; subida | festas |
| 62 | `reservou 3` | 117,94 | gaveta 2025: tracejado 3,4 pilhas "RESERVADO R$ 3,4 MI" | festas |
| 63 | `gastou 25` | 119,70 | torre verde até 25,8; R$ 25,8 MI | festas |
| 64 | `reservou 12` | 122,52 | gaveta 2026: tracejado 12,5 "RESERVADO R$ 12,5 MI" | festas |
| 65 | `ja foram 23` | 124,60 | torre rosa até 23,9; R$ 23,9 MI · ATÉ SET | festas |
| 66 | `Na propaganda` | 126,48 | câmera sobe e mergulha na prefeitura (casa 3); a gaveta PROPAGANDA abre; pílula A PROPAGANDA | propaganda |
| 67 | `tinha 4 milhoes` | 129,08 | gaveta 2025: tracejado 4 "RESERVADO R$ 4 MI" | propaganda |
| 68 | `usou 14` | 130,54 | torre verde até 14,4; R$ 14,4 MI | propaganda |
| 69 | `tinha 5` | 133,26 | gaveta 2026: tracejado 5 "RESERVADO R$ 5 MI" | propaganda |
| 70 | `usou 11` | 134,08 | torre rosa até 11,7; R$ 11,7 MI · ATÉ SET | propaganda |
| 71 | `Enquanto isso` | 135,66 | câmera desliza (mesmo sentido) até o fim do giro, onde estão juntos meio ambiente, Casa Melhor e proteção animal; pílula ENQUANTO ISSO | cortes |
| 72 | `castracao movel` | 136,44 | ★ uma van genérica "CASTRAÇÃO MÓVEL" (sem marca), cinza, ao lado da casinha de cachorro; tracejado "RESERVADO R$ 2 MI · 2026" | cortes |
| 73 | `cortada para zero` | 139,50 | o tracejado apaga devagar (0,5 s); "CORTADA: R$ 0"; baque | cortes |
| 74 | `A reforma de casas` | 140,50 | casinha CASA MELHOR sobe cinza; tracejado "RESERVADO R$ 1 MI · 2025" | cortes |
| 75 | `nao gastou nada` | 143,64 | dentro do tracejado, nada; "GASTOU R$ 0" | cortes |
| 76 | `E o meio ambiente` | 144,58 | árvores acendem; as 3 moedinhas dos anos | cortes |
| 77 | `polo industrial` | 145,96 | silhuetas do Polo ao fundo acendem de leve | cortes |
| 78 | `nao chegou a 3` | 146,70 | plaquinha "MENOS DE R$ 3 MI POR ANO" | cortes |
| 79 | `limpeza de rios` | 148,92 | sub-plaquinha "COM LIMPEZA DE RIOS E ÁREAS VERDES: R$ 2,8 · 2,6 · 1,4 MI" | cortes |
| 80 | `A restauracao` | 150,44 | na borda, perto das silhuetas, um trecho de avenida com placa genérica "GOVERNO DO ESTADO · 19 VIAS DO POLO · MAIS DE R$ 23 MI" (sem brasão nem logo) | estado |
| 81 | `Governo do Estado` | 154,36 | a placa ganha o selo "NÃO É DA PREFEITURA"; pop | estado |
| 82 | `No Tribunal de Contas` | 155,28 | prédio do Tribunal (da série) entra ao fundo; pílula NO TRIBUNAL | tribunal |
| 83 | `26 processos` | 156,80 | ★ contador de pastas sobe de 0 a 26, empilhadas ao lado do Tribunal; "26 PROCESSOS · 2025 E 2026" | tribunal |
| 84 | `sem julgamento` | 160,02 | selo "SEM JULGAMENTO" na pilha de pastas | tribunal |
| 85 | `a cenografia` | 161,36 | pasta na frente: "CENOGRAFIA JUNINA 2026" | tribunal |
| 86 | `o transporte escolar` | 163,36 | pasta "TRANSPORTE ESCOLAR E UNIVERSITÁRIO" | tribunal |
| 87 | `cestas basicas` | 165,02 | pasta "CESTAS BÁSICAS" | tribunal |
| 88 | `a merenda` | 165,86 | pasta "MERENDA"; todas com "SEM JULGAMENTO" | tribunal |
| 89 | `Gastar nao` | 166,40 | Tribunal e pastas saem da frente; mesa inteira; "GASTAR NÃO É CRIME" pequeno no alto | pergunta |
| 90 | `a festa sempre` | 168,56 | palco acende (acento); "?" | pergunta |
| 91 | `a castracao e as casas` | 170,20 | casinha de cachorro e Casa Melhor acendem cinza; "?" | pergunta |
| 92 | `Segue o` | 171,90 | @eumagnoleite em verde; ding | segue |

Densidade: 92 eventos principais + 1 voo de pilhas por setor (39) + plaquinhas dos anos anteriores ≈ 170 eventos em 174 s.

## 5. Câmera (sempre num sentido só)
Usa o enquadramento automático da base (alvo + tamanho + direção), como no 035; as distâncias são referência.

| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 12,8 | Kit Mapas | CAMAÇARI · ARRECADOU |
| 2024 | 12,8 → 43,3 | início: de cima, alvo cofre [0, 0,5, 0], tamanho 9 m, elevação 62°; em "Educação" desce para a escola (elevação ~40°, alto, olhando de dentro da mesa) e **gira no sentido horário**, casinha por casinha, segurando até 0,55 s antes da próxima; termina no meio ambiente | 2024 · PARA ONDE FOI |
| virada de ano | 43,3 / 75,0 | sobe para a vista de cima (o anel se enche com a cor nova); desce de novo na escola. Não volta pela mesa: sobe e recomeça. | 2025 / 2026 · ATÉ SETEMBRO |
| 2025 e 2026 | 51,3 → 110,3 | o mesmo giro; em 2026 termina na casinha cinza da proteção animal | |
| festas | 110,5 → 126,4 | sobe e mergulha no palco (casa 8); arco lento enquanto as 3 gavetas sobem; enquadra a torre mais alta inteira (26,6 pilhas) | AGORA REPARA |
| propaganda | 126,4 → 135,6 | a prefeitura (casa 3) fica para trás no giro: **sobe e mergulha**, igual à virada de ano | A PROPAGANDA |
| cortes | 135,6 → 150,4 | desliza para a frente no giro até o fim da mesa (13 a 15); um plano só mostra as três casinhas, arco lento horário | ENQUANTO ISSO |
| estado | 150,4 → 155,2 | continua no mesmo sentido até a borda, onde fica a avenida do Polo | OBRA DO ESTADO |
| tribunal | 155,2 → 166,4 | recua e mostra o Tribunal ao fundo; pastas na frente, nada tapando os setores | NO TRIBUNAL |
| pergunta | 166,4 → 175,2 | mesa inteira, arco lento horário, termina entre o palco aceso e as casinhas cinza (sem nada entre a câmera e elas) | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Balanço e Anexo 9 consolidados enviados ao TCM-BA"
- 2026: "Fonte: SIGA set/2026 (Prefeitura, Câmara, ISSM, LIMPEC e STT), TCM-BA · despesa liquidada"
- Festas e propaganda: "Fonte: despesa por ação (SIGA dez/2024, dez/2025, set/2026), TCM-BA"
- Cortes: "Fonte: SIGA dez/2025 e set/2026, TCM-BA"
- Estado: "Fonte: Casa Civil da Bahia, 25/04/2024"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 07/11/2026"
- Proteção animal: asterisco no chip; a nota vai na legenda do post.

## 7. Sons
whoosh nas viradas de ano e de cena; tique na pílula; pop quando cada setor recebe o dinheiro e no "sobrou"; subida nas torres das festas e da propaganda; baque no zero e na castração cortada; impacto no selo SEM JULGAMENTO; ding no fim. Sem trilha, igual à série.

## 8. Arquivos
- `src/videos/orcamentocamacari/` copiado de `orcamentoparatinga/`, trocando dados, `T`, setores (15), escala (`ESCALA = 10`, torre lado 3, anel em 3 camadas), "sobrou" no lugar de "faltou", gavetas (festas, propaganda), cortes, Polo, Tribunal com contador.
- Peças novas em `pecas.tsx`: `PredioAposentadorias`, `CaminhaoLixo` (da rua de obras do 035), `VanCastracao`, `CasaPopular`, `SilhuetaPolo`, `ContadorPastas`. Reaproveitadas: cofre, `PilhasDinheiro` (max em moedas: 2.400 + folga), `MesaMaquete rio={false}`, palco, escola, posto, prefeitura, Câmara, banco, assistência, trator, quadra, árvores, casinha, Tribunal, pastas, gavetas.
- `src/Root.tsx`: `OrcamentoCamacari`, `OrcamentoCamacariGuia`, `OrcamentoCamacariLimpo`, `CapaOrcamentoCamacari` (só acrescentar linhas).
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-camacari/` (copiado de `orcamento-paratinga/`) → `projetos/041.../mapas/camacari.mp4`.
- Capa aprovada: "A festa / passa do / previsto. / Todo ano." (fundo: quadro das gavetas das festas).
- 5255 quadros. Antes do render: trava `projetos/_render.lock`, `df -h ~`, prévia fechada.
