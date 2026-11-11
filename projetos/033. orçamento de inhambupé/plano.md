# Plano de cenas: 033. orçamento de inhambupé (versão 1, aprovada em 06/11/2026)

Código `orcamentoinhambupe` · Nome `OrcamentoInhambupe` · Perfil @eumagnoleite · série Magno Explica.
Mesma linha da série de orçamentos e de **Belmonte versão 2 (032)**: **Kit Mapas** na abertura e no "de onde vem" de 2024, e **Estúdio 3D** com a maquete redonda, o **cofre no meio** e as **pilhas de dinheiro em volta**. Código base: `src/videos/orcamentobelmonte/OrcamentoBelmonte.tsx` (versão 2, com plaquinhas e empurrões de câmera).

Novidade deste vídeo, pedida pela pessoa: o miolo é **combustível, aluguel de carros e limpeza**, com três lugares novos na maquete e a comparação **2024 × 2026 lado a lado**.

## 2.1 Narração
- `audio/narracao-norm.wav`: 137,20 s (voz Mário, gerada pela pessoa; silêncio das pontas cortado e acelerada 1,15x, como Belmonte v2) · `AUDIO_SEG = 137.2` · `QUADROS = 4143`.
- 315 palavras, iguais ao roteiro. A última ("informações.") termina em 136,90 s. Sem ajustes no `palavras.json` (original guardado).
- Repetidas (usar trecho único no `quando()`): "Entrou" 3× (`'Entrou 190'`, `'Entrou 190 milhoes de novo'`, `'Entrou 163'`), "Saiu" 3× (`'Saiu 154'`, `'Saiu 192'`, `'Saiu a prefeitura'`), "Da União" 3× (`'Uniao 121'`, `'Uniao 111'`, `'Uniao 101'`), "Fundeb" 3× (`'Fundeb 52'`, `'Fundeb 56'`, `'Fundeb 44'`), "Educação" e "Saúde" 2× (com o número), "2024" 3×, "2026" 5×, "setembro" 6×, "Combustível" 2× (`'Combustivel em'`, `'o combustivel de 2026'`), "dobro" 3×.

## 2.2 Ideia e mundo
- **Escala principal: 1 pilha = R$ 1 milhão** (placar fixo no canto). O anel em volta do cofre muda de tamanho a cada ano: 2024 = 154 pilhas (gasto) sobre 190 que entraram; 2025 = 192; 2026 = 190 comprometidas sobre 163,5 que entraram.
- **De onde vem (2025 e 2026)**: pilhas do anel ganham três cores na proporção certa: azul (União), roxo (Estado e Fundeb), dourado (próprio município). 2024 fica no mapa.
- **Os três temas** ganham três lugares novos, lado a lado na borda da mesa, que só sobem no "Agora repara":
  1. **Posto de combustível** (bomba, cobertura com letreiro genérico "POSTO", sem marca real) com um carro abastecendo.
  2. **Garagem de locação** com carros e uma retroescavadeira enfileirados (letreiro "LOCAÇÃO").
  3. **Caminhão de lixo e garis** numa rua com lixeiras (letreiro "LIMPEZA").
- Em cada lugar, **duas pilhas lado a lado: 2024 (cinza) × 2026 (acento)**. Aqui a escala muda e a plaquinha avisa: **"AQUI, 1 BLOCO = R$ 100 MIL"**. Combustível 21 × 55 blocos; locação 28 × 48; limpeza 41 × 64.
- **Empresas**: boneco-caixa genérico com etiqueta (sem logo): "VIEIRA & PINHEIRO (POSTO)", "TJ TRANSPORTES + RIBEIRO E ANJOS" saindo e "YDM2" entrando, "MOTA CONSTRUÇÕES" saindo e "CONSÓRCIO GRASF · ABERTO EM 06/2025" entrando.
- **Prédios da série** que sobem na hora da fala: escola (educação), posto de saúde (saúde), posto da guarda (segurança, vazio), prédio do Tribunal de Contas com letreiro "TCM-BA".
- Cidade do interior (agreste): casinhas, umbuzeiros/árvores baixas e estrada de terra na borda da mesa, só no arco vazio (regra 029: nada na frente da câmera).

**Paleta** (tudo do tema do perfil eumagnoleite, nada fixo): fundo → `fundo`; mesa → `chao`; prédios → `objeto`; pilhas → `dinheiro`; União/Estado/município → `apoio.azul`/`apoio.roxo`/`apoio.dourado` (as mesmas de Belmonte); 2024 nas comparações → `objetoEscuro`; 2026 → `acento`; alerta (gastou mais do que entrou) → `alerta`.

**Mapa do mundo** (mesa redonda, raio 9, chão em y = 0)
| lugar | posição [x, y, z] | observação |
|---|---|---|
| cofre + anel de pilhas | [0, 0, 0] | peça da série (Belmonte); anel de raio 3,2 |
| escola | [-5, 0, -3] | peça da série; sobe em "Educação, 73" |
| posto de saúde | [5, 0, -3] | peça da série; sobe em "Saúde, 31" |
| posto de combustível | [-5,5, 0, 3,5] | peça nova (bomba + cobertura + carro) |
| garagem de locação | [0, 0, 6] | peça nova (galpão aberto + 3 carros + retroescavadeira) |
| rua da limpeza | [5,5, 0, 3,5] | peça da série "rua de serviços" com caminhão de lixo + garis |
| posto da guarda | [6,5, 0, -6] | peça da série; sobe vazio no "zero" |
| Tribunal TCM-BA | [-6,5, 0, -6] | peça de Belmonte; sobe em "No Tribunal" |

**Regras visuais**: acento só no que dobrou (pilhas de 2026, plaquinhas de "VEZES"). Pessoas reais só como texto (prefeitos como tag de gestão, sem boneco). Nada pisca; carimbos entram em 0,4 s.

## 2.3 Trechos de mapa (Kit Mapas, composição `OrcamentoInhambupe`, 0 a 21,7 s)
| trecho | de / até | o que acontece |
|---|---|---|
| A · INHAMBUPÉ | 0 → 12,2 s | voo do Brasil até Inhambupé, no nordeste da Bahia (satélite); contorno do município acende em verde; seta e nome "INHAMBUPÉ"; tags "COMBUSTÍVEL · ALUGUEL DE CARROS · LIMPEZA" (1,6 s), "QUASE DOBROU" (4,3 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (7,9 s), "2024 · GESTÃO NENA" (9,9 s) |
| B · DE ONDE VEM (2024) | 12,2 → 21,7 s | "ENTROU R$ 190 MI" (12,9 s); seta de **Brasília** com "UNIÃO R$ 121 MI" (14,8 s); contorno da Bahia e seta de **Salvador** com "ESTADO + FUNDEB R$ 52 MI" (17,1 s); município acende com "PRÓPRIO MUNICÍPIO: SÓ R$ 17,5 MI" (19,0 s) |

O mapa sai do Kit Mapas sem legenda, marca e som; a marca d'água e a legenda vêm do 3D por cima (regra 029).

## 2.4 Palavras-chave (tabela de eventos)
Em cada número: **plaquinha de comparação no topo** + **rótulo com valor exato embaixo** + **empurrão leve de câmera (0,5 s)** (regra global do 032).

| # | palavra (`quando`) | tempo | objeto | o que acontece | plaquinha no topo | cena |
|---|---|---|---|---|---|---|
| 1 | `Em Inhambupe` | 0,0 | mapa | voo começa do Brasil | | A |
| 2 | `combustivel aluguel` | 1,6 | mapa | tags dos três temas entram uma a uma (1,6 / 2,4 / 3,3) | | A |
| 3 | `quase dobrou` | 3,8 | mapa | tag "QUASE DOBROU" em acento | | A |
| 4 | `Eu abri` | 5,8 | mapa | tag PREFEITURA DE INHAMBUPÉ | | A |
| 5 | `Tribunal de Contas` | 7,9 | mapa | tag TRIBUNAL DE CONTAS DOS MUNICÍPIOS | | A |
| 6 | `2024 gestao` | 9,9 | mapa | tag 2024 · GESTÃO NENA; pílula 2024 | | A |
| 7 | `Entrou 190` | 12,2 | mapa | R$ 190 MI | | B |
| 8 | `Uniao 121` | 14,8 | mapa | seta de Brasília; UNIÃO R$ 121 MI | ★ MAIS DE 6 DE CADA 10 REAIS | B |
| 9 | `Fundeb 52` | 17,1 | mapa | seta de Salvador; ESTADO + FUNDEB R$ 52 MI | | B |
| 10 | `proprio municipio` | 19,0 | mapa | município acende; SÓ R$ 17,5 MI | SÓ 1 DE CADA 11 REAIS | B |
| 11 | `Saiu 154` | 21,7 | cofre | maquete aparece; cofre abre; 154 pilhas no anel; 36 pilhas sobram ao lado | | 2024 |
| 12 | `Educacao 73` | 24,4 | escola | escola sobe; 73 pilhas voam; R$ 72,8 MI | QUASE METADE DO GASTO | 2024 |
| 13 | `Saude 31` | 26,2 | posto de saúde | 31 pilhas; R$ 31 MI | | 2024 |
| 14 | `Sobraram 36` | 27,6 | anel | as 36 pilhas de fora brilham; R$ 36,4 MI | SOBROU 1 DE CADA 5 REAIS | 2024 |
| 15 | `2025 gestao` | 29,3 | anel | pilhas voltam; pílula 2025; tag GESTÃO HUGO DE LEÔNIDAS | | 2025 |
| 16 | `Entrou 190 milhoes de novo` | 32,8 | anel | anel com 190 pilhas; R$ 189,7 MI | IGUAL A 2024 | 2025 |
| 17 | `Uniao 111` | 35,5 | anel | 111 azuis; R$ 111 MI | | 2025 |
| 18 | `Fundeb 56` | 37,7 | anel | 56 roxas; R$ 56 MI | | 2025 |
| 19 | `municipio 22` | 39,4 | anel | 22,5 douradas; R$ 22,6 MI | | 2025 |
| 20 | `Saiu 192` | 41,6 | anel | 192 pilhas (2 em vermelho fora do anel); R$ 191,8 MI | 38 MILHÕES A MAIS QUE 2024 | 2025 |
| 21 | `Educacao 95` | 44,1 | escola | 95 pilhas; R$ 94,8 MI | | 2025 |
| 22 | `Saude 36` | 45,9 | posto de saúde | 36 pilhas; R$ 36,1 MI | | 2025 |
| 23 | `Faltaram 2` | 47,5 | anel | 2 pilhas vermelhas pulsam devagar; R$ 2,2 MI; baque | DE SOBRA PARA FALTA | 2025 |
| 24 | `2026 ate` | 49,6 | anel | pílula 2026 · ATÉ SETEMBRO | | 2026 |
| 25 | `Entrou 163` | 51,6 | anel | anel com 163,5 pilhas; R$ 163,6 MI | | 2026 |
| 26 | `Uniao 101` | 54,6 | anel | azuis; R$ 100,9 MI | | 2026 |
| 27 | `Fundeb 44` | 56,6 | anel | roxas; R$ 44,5 MI | | 2026 |
| 28 | `municipio 18` | 58,3 | anel | douradas; R$ 18,2 MI | | 2026 |
| 29 | `ja comprometeu` | 61,3 | anel | +27 pilhas nascem em vermelho fora do anel; R$ 190,4 MI | | 2026 |
| 30 | `27 a mais` | 63,7 | 2D | chip R$ 27 MI A MAIS DO QUE ENTROU; baque | EM SÓ 9 MESES | 2026 |
| 31 | `Agora repara` | 65,7 | mesa | câmera abre; os três lugares novos sobem na borda (whoosh) | | o que dobrou |
| 32 | `janeiro a setembro` | 66,8 | 2D | selo "JAN–SET DE CADA ANO" fixo até o 46 | | o que dobrou |
| 33 | `Combustivel em` | 69,0 | posto | close no posto; carro abastecendo | AQUI, 1 BLOCO = R$ 100 MIL | combustível |
| 34 | `2 milhoes e 100` | 71,0 | posto | pilha cinza "2024" com 21 blocos; R$ 2,1 MI | | combustível |
| 35 | `5 milhoes e meio` | 73,4 | posto | pilha acento "2026" sobe até 55 blocos (subida) | | combustível |
| 36 | `Duas vezes e meia` | 74,9 | 2D | plaquinha grande | **2,6 VEZES** | combustível |
| 37 | `mesmo posto` | 76,5 | boneco | caixa-etiqueta VIEIRA & PINHEIRO na bomba | | combustível |
| 38 | `286` | 79,6 | posto | nota "SET/2024: R$ 286 MIL" | | combustível |
| 39 | `732` | 83,1 | posto | nota "SET/2026: R$ 732 MIL" ao lado | 2,6 VEZES NO MESMO MÊS | combustível |
| 40 | `Aluguel de carros` | 85,0 | garagem | close na garagem; carros e retroescavadeira | | locação |
| 41 | `2 milhoes e 800` | 87,2 | garagem | pilha cinza 28 blocos; R$ 2,8 MI | | locação |
| 42 | `4 milhoes e 800` | 88,9 | garagem | pilha acento 48 blocos; R$ 4,8 MI | +74% | locação |
| 43 | `empresa mudou` | 90,3 | bonecos | caixas TJ TRANSPORTES e RIBEIRO E ANJOS saem; YDM2 entra | | locação |
| 44 | `680` | 92,2 | garagem | nota "SET/2026: R$ 680 MIL" | | locação |
| 45 | `dobro das duas antigas` | 95,2 | garagem | nota cinza "SET/2024, AS DUAS: R$ 312 MIL" ao lado | **2,2 VEZES** | locação |
| 46 | `Limpeza publica` | 97,3 | rua | close na rua; caminhão de lixo anda devagar | | limpeza |
| 47 | `de 4` | 99,0 | rua | pilha cinza 41 blocos; R$ 4,1 MI | | limpeza |
| 48 | `6 milhoes e 400` | 100,1 | rua | pilha acento 64 blocos; R$ 6,4 MI | +57% | limpeza |
| 49 | `trocou de empresa` | 102,0 | bonecos | MOTA CONSTRUÇÕES sai | | limpeza |
| 50 | `consorcio aberto` | 103,4 | bonecos | CONSÓRCIO GRASF entra; selo "ABERTO EM 09/06/2025" | | limpeza |
| 51 | `Somando os tres` | 106,0 | mesa | câmera abre nos três lugares; as três pilhas de cada ano se juntam no meio | | somando |
| 52 | `de 9` | 107,5 | pilha | pilha cinza 2024: R$ 9 MI | | somando |
| 53 | `quase 17` | 108,8 | pilha | pilha acento 2026: R$ 16,7 MI | | somando |
| 54 | `Quase o dobro` | 109,5 | 2D | plaquinha grande; ding | **QUASE O DOBRO** | somando |
| 55 | `parte que quase ninguem` | 110,8 | posto | câmera volta ao posto | | ninguém vê |
| 56 | `o combustivel de 2026` | 113,9 | posto | pilha 2026 (55 blocos) | | ninguém vê |
| 57 | `ano inteiro de 2025` | 116,1 | posto | pilha fantasma "2025 INTEIRO" (47 blocos) aparece ao lado, menor | JÁ PASSOU O ANO TODO | ninguém vê |
| 58 | `seguranca publica` | 118,1 | guarda | posto da guarda sobe vazio | | ninguém vê |
| 59 | `recebeu zero` | 119,4 | 2D | chip SEGURANÇA PÚBLICA: R$ 0 · 2024, 2025, 2026; baque | ZERO NOS 3 ANOS | ninguém vê |
| 60 | `No Tribunal` | 121,3 | Tribunal | prédio TCM-BA sobe na borda | | o tribunal |
| 61 | `seis processos` | 122,0 | 2D | seis pastas cinza com "EM ANÁLISE" entram uma a uma | 6 SEM JULGAMENTO | o tribunal |
| 62 | `unico ja julgado` | 125,4 | 2D | uma 7ª pasta | | o tribunal |
| 63 | `improcedente` | 127,1 | 2D | carimbo IMPROCEDENTE (neutro, cinza); impacto | | o tribunal |
| 64 | `Gastar mais` | 128,2 | mesa | câmera abre na mesa inteira | | a pergunta |
| 65 | `nao e crime` | 129,3 | 2D | texto "GASTAR MAIS NÃO É CRIME" | | a pergunta |
| 66 | `a frota dobrou` | 131,3 | garagem | carros da garagem acendem; "?" | A FROTA DOBROU? | a pergunta |
| 67 | `duas vezes mais limpa` | 133,1 | rua | caminhão acende; "?" | A CIDADE FICOU 2X MAIS LIMPA? | a pergunta |
| 68 | `Segue o` | 134,3 | 2D | @eumagnoleite em verde; ding | | e você? |

68 eventos principais (mais as tags e notas), cerca de 1 a cada 2 s, e com os empurrões de câmera e as plaquinhas fica perto de 1 por segundo.

## 2.4 Cenas com câmera (resumo)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa A e B | 0 → 21,7 | Kit Mapas | INHAMBUPÉ 2024 → 2026 · DE ONDE VEM |
| 2024 | 21,7 → 29,3 | mesa de cima (3/4) → close escola → close saúde → anel com as 36 de sobra; arco 0,08 | 2024 · PARA ONDE FOI |
| 2025 | 29,3 → 49,6 | anel de cima (44°, para ver as cores) com aproximação durante o "de onde vem" → escola → saúde → anel com as 2 vermelhas | 2025 · DE ONDE VEM · PARA ONDE FOI |
| 2026 | 49,6 → 65,7 | anel de cima → as 27 vermelhas fora do anel | 2026 · DE ONDE VEM · COMPROMETEU |
| o que dobrou | 65,7 → 69,0 | grua sobe e mostra os três lugares novos na borda | O QUE DOBROU |
| combustível | 69,0 → 85,0 | close no posto, leve arco; pilhas ao lado da bomba (do lado para onde a câmera olha) | COMBUSTÍVEL |
| locação | 85,0 → 97,3 | travelling até a garagem | ALUGUEL DE CARROS |
| limpeza | 97,3 → 106,0 | travelling até a rua; caminhão anda | LIMPEZA |
| somando | 106,0 → 110,8 | abre para os três lugares | SOMANDO |
| ninguém vê | 110,8 → 121,3 | volta ao posto, depois guarda | O QUE NINGUÉM VÊ |
| o tribunal | 121,3 → 128,2 | prédio TCM-BA de baixo para cima | O TRIBUNAL |
| a pergunta / e você? | 128,2 → 137,2 | mesa inteira, arco lento | A PERGUNTA · E VOCÊ? |

## 2.5 Selos de fonte (discretos, um por bloco)
- 2024: "Fonte: Balanço 2024 enviado ao TCM-BA"
- 2025: "Fonte: Balanço 2025 enviado ao TCM-BA (proc. 10095e26)"
- 2026: "Fonte: Demonstrativos SIGA de set/2026, TCM-BA"
- Três temas: "Fonte: PCMGE015 (jan–set 2024 e 2026) e PCMGE056 (set/2024 e set/2026), TCM-BA"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 06/11/2026"
Valores exatos e conta própria: `audio/fontes.md`.

**Conferir antes de publicar:** se saiu a prestação de 10/2026 (vence 30/11) e se algum dos seis processos foi julgado.

## 2.6 Sons
whoosh nas trocas de cena; tique na pílula; pop nos números; subida nas pilhas de 2026 dos três temas; baque no "27 a mais", no "Faltaram" e no "zero"; impacto no carimbo IMPROCEDENTE; ding no "Quase o dobro" e no fim. Sem trilha, igual à série.

## 2.7 Arquivos
- Novos: `src/videos/orcamentoinhambupe/OrcamentoInhambupe.tsx` (a partir do de Belmonte v2) e `pecas.tsx` com 3 peças novas: `PostoCombustivel` (bomba + cobertura + carro), `GaragemLocacao` (galpão + 3 carros + retroescavadeira), `CaixaEmpresa` (bloco com etiqueta de nome, para as empresas que saem e entram). A rua com caminhão de lixo vem da peça "rua de serviços" da série (checar no catálogo se há caminhão de lixo; se não, monto com as primitivas).
- Registro em `src/Root.tsx`: `OrcamentoInhambupe`, `OrcamentoInhambupeGuia`, `OrcamentoInhambupeLimpo`, `CapaOrcamentoInhambupe`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-inhambupe/` (dados do IBGE 2913705) → `projetos/033.../mapas/inhambupe.mp4`.
- 4143 quadros; o `render.mjs` divide em partes.

## 2.8 Origem das escolhas
- Da pessoa: foco nos três gastos que dobraram; formato igual a Belmonte v2 (1,15x, plaquinhas, empurrões, legenda padrão); marca d'água @eumagnoleite quicando; só Estúdio 3D + Kit Mapas.
- Do `_aprendizados.md`: pilhas ao lado do objeto (nunca atrás); prédios só sobem na palavra deles; acento só no que importa; selo de fonte discreto; marca d'água desenhada pelo 3D por cima do mapa; nada piscando; casas e árvores só no arco vazio; selo de cada bloco sai quando o bloco termina.
- Do diretor (★): a escala troca para "1 bloco = R$ 100 mil" nos três temas, avisada na plaquinha, para as pilhas de 2024 × 2026 ficarem visíveis; a pilha fantasma "2025 inteiro" ao lado do combustível de 2026; as 27 pilhas vermelhas fora do anel em 2026; empresas como caixas com etiqueta saindo e entrando.
