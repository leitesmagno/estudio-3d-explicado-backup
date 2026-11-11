# Plano de cenas: 034. orçamento de canavieiras (versão 2, para aprovação)

Código `orcamentocanavieiras` · Nome `OrcamentoCanavieiras` · Perfil @eumagnoleite · série Magno Explica.
Molde: **Belmonte v2 (032)** e **Inhambupé (033)**. **Kit Mapas** na abertura; **Estúdio 3D** com a maquete redonda, o **cofre no meio** e as **pilhas de dinheiro em volta**. Código base: `src/videos/orcamentoinhambupe/OrcamentoInhambupe.tsx`. Marca d'água @eumagnoleite pequena quicando pela tela inteira, do início ao fim. (Plano v1 em `antigos/`.)

Novidade desta versão, pedida pela pessoa: **100% do dinheiro de cada ano, setor por setor**. O anel de pilhas em volta do cofre vira um **anel de 100%**: cada setor dito pinta a sua fatia, com a porcentagem presa a ela, e o prédio do setor sobe na borda da mesa **e fica lá até o fim do vídeo** (pedido da pessoa em 06/11/2026: as casinhas não somem como em Inhambupé). Em 2025 e 2026 os mesmos prédios só ganham um contorno de luz quando o setor é dito de novo. Só o dinheiro muda: na frente de cada casinha fica uma pilha por ano (2024, 2025, 2026) lado a lado, para comparar, enquanto o anel de 100% se refaz a cada ano.

## 2.1 Narração
- `audio/narracao-norm.wav`: 172,83 s (voz Mário, gerada de uma vez; silêncio das pontas cortado e acelerada 1,15x) · `AUDIO_SEG = 172.83` · `QUADROS = 5212`.
- 419 palavras, iguais ao roteiro. A última ("informações.") termina em 172,40 s. Tempos sempre sobem, nenhum buraco maior que 1,5 s.
- Ajustes: nenhum no `palavras.json` (original guardado). Ouvi de novo o trecho das 110,7 s: a voz fala "entre um milhão e um milhão e meio cada", certo.
- Repetidas (usar trecho único no `quando()`): "Entrou" 3× (8,96 / 54,82 / 93,96), "Gastou" 2× (13,6 / 56,5), "Faltaram" 2× (15,4 / 58,1), "Educação" 3× (16,5 / 59,9 / 97,0), "Saúde" 3× (20,0 / 63,4 / 100,4), "Obras" 2× + "obras" em 2026 (22,8 / 68,7 / 112,5), "Administração" 3× (26,1 / 66,1 / 102,7), "Assistência" 3× (29,2 / 74,3 / 107,5), "Turismo" 3× (32,0 / 79,3 / 112,0), "Câmara" 4× (35,5 / 76,3 / 92,2 / 108,8), "Dívidas" 3× (39,4 / 78,0 / 110,7), "Cultura" 3× (41,7 / 82,9 / 116,6), "Agricultura" 3× (43,0 / 80,0 / 115,3), "Esporte" 3× (45,5 / 84,5 / 118,8), "zero" 3× (51,6 / 87,7 / 120,1), "Ministério" 2× (147,4 / 159,5).

## 2.2 Ideia e mundo
- **Anel de 100%**: 100 pilhas em volta do cofre, cada pilha = 1% do gasto do ano (o valor em reais vai no rótulo). Quando um setor é dito, as pilhas da fatia dele ganham a cor do setor, uma faixa curva liga a fatia ao prédio do setor e a plaquinha "38%" fica presa na fatia. No fim de cada ano o anel está todo colorido e o selo "100%" aparece no chip do topo.
- **Falta de dinheiro**: em 2024 e 2025, as pilhas a mais (13 e 10,5 milhões) nascem em vermelho fora do anel, ao lado do cofre ("FALTARAM R$ 13 MI").
- **Setores** (cor do tema, prédio genérico com letreiro na fonte do perfil):
  | setor | prédio | cor (tema) |
  |---|---|---|
  | Educação | escola | `apoio.azul` |
  | Saúde | posto/hospital | `apoio.vermelhoSuave` (se não existir, `alerta` com opacidade) |
  | Obras e serviços urbanos | rua com caminhão, poste, caminhão de lixo | `apoio.dourado` |
  | Administração da prefeitura | prédio da prefeitura | `objetoEscuro` |
  | Assistência social | prédio baixo "ASSISTÊNCIA" | `apoio.roxo` |
  | Turismo | palco | `apoio.laranja` (ou acento suave) |
  | Câmara de Vereadores | prédio com cúpula "CÂMARA" | `apoio.verdeClaro` |
  | Dívidas | pasta com cadeado | `objeto` |
  | Cultura, agricultura, esporte | pequenos (teatro, trator, quadra) | tons claros do tema |
  | Segurança, defesa civil, transporte, proteção animal | posto da guarda, sirene, ônibus, casinha de cachorro, **vazios e cinza** | `objetoEscuro` |
  Cores exatas: as que já existem em `src/estilos/eumagnoleite.ts`; nenhuma cor nova escrita no código.
- **Obras paradas** ("Agora repara"): oito terrenos vazios na borda com placa "PREVISTO · R$ 0 GASTO": 3 postos de saúde, creche, 2 ambulâncias (carcaças cinza), viatura da guarda, pista de skate e píer dos pescadores. Entram um por um na palavra.
- **Contrato terceirizado**: galpão "CH SERVIÇOS" com fila de bonecos genéricos com crachá; pilhas "MAIO/2025" (14 blocos) × "MAIO/2026" (21 blocos), escala avisada "AQUI, 1 BLOCO = R$ 100 MIL", e ao lado a pilha cinza "FOLHA DA SAÚDE · MAIO/2026" (21 blocos).
- **MP / MPF**: prédio com colunas, letreiro "MINISTÉRIO PÚBLICO" que troca para "MPF".
- **Tribunal TCM-BA**: prédio de Belmonte ao fundo, com a pasta "DENÚNCIA · EM ANÁLISE".
- Cidade do litoral sul: coqueiros, mangue e rio só no arco vazio da borda.

**Regras visuais**: plaquinhas pequenas presas à fatia ou ao prédio, nunca cartão grande sobre a maquete; acento só no que importa (falta de dinheiro, contrato que cresce, zero); nada pisca; carimbos em 0,4 s; prefeito só como tag de texto.

## 2.3 Trechos de mapa (Kit Mapas, composição `OrcamentoCanavieiras`, 0 a 13,6 s)
| trecho | de / até | o que acontece |
|---|---|---|
| A · CANAVIEIRAS | 0 → 9,0 s | voo do Brasil até Canavieiras, litoral sul da Bahia (satélite); contorno acende em verde; tags "PARA ONDE FOI CADA REAL?" (0,6 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (4,2 s), "2024 · GESTÃO PAULO CARVALHO" (6,2 s) |
| B · O QUE ENTROU (2024) | 9,0 → 13,6 s | "ENTROU R$ 130 MI" (9,0 s); setas de Brasília e Salvador entram juntas; município acende com "DA PRÓPRIA CIDADE: SÓ R$ 9 MI" (11,1 s) |

## 2.4 Palavras-chave (tabela de eventos)
Em cada número: **plaquinha no topo** + **rótulo com valor exato embaixo** + **empurrão leve de câmera (0,5 s)** (regra do 032). Nos setores, a plaquinha é a **porcentagem presa à fatia**.

| # | `quando` | tempo | o que acontece | plaquinha no topo | cena |
|---|---|---|---|---|---|
| 1 | `Para onde` | 0,0 | voo começa; tag PARA ONDE FOI CADA REAL? | | A |
| 2 | `Tribunal de Contas` | 4,2 | tag TCM | | A |
| 3 | `2024 gestao` | 6,2 | tag 2024 · GESTÃO PAULO CARVALHO; pílula 2024 | | A |
| 4 | `Entrou 130` | 9,0 | ENTROU R$ 129,8 MI; setas de Brasília e Salvador | | B |
| 5 | `So 9` | 10,9 | município acende; SÓ R$ 8,9 MI | ★ SÓ 7 DE CADA 100 REAIS | B |
| 6 | `Gastou 143` | 13,6 | maquete aparece; anel de 100 pilhas cinza; R$ 143,1 MI | | 2024 |
| 7 | `Faltaram 13` | 15,4 | 13 pilhas vermelhas fora do anel; baque | FALTOU 1 DE CADA 10 REAIS | 2024 |
| 8 | `Educacao 54` | 16,5 | escola sobe; fatia de 38 pilhas pinta; R$ 54,3 MI | 38% | 2024 |
| 9 | `Saude 33` | 20,0 | posto sobe; 23 pilhas; R$ 33,3 MI | 23% | 2024 |
| 10 | `Obras e servicos urbanos 20` | 22,8 | rua com caminhão sobe; 14 pilhas; R$ 19,6 MI | 14% | 2024 |
| 11 | `Administracao da prefeitura` | 26,1 | prefeitura sobe; 11 pilhas; R$ 16,1 MI | 11% | 2024 |
| 12 | `Assistencia social 6` | 29,2 | assistência; 4 pilhas; R$ 6,0 MI | 4% | 2024 |
| 13 | `Turismo 4` | 32,0 | palco; 3 pilhas; R$ 4,4 MI | 3% | 2024 |
| 14 | `Camara de Vereadores` | 35,5 | Câmara sobe; 3 pilhas; R$ 4,3 MI | 3% | 2024 |
| 15 | `Dividas 3` | 39,4 | pasta com cadeado; 3 pilhas; R$ 3,7 MI | 2,6% | 2024 |
| 16 | `Cultura 1` | 41,7 | teatro pequeno; 1 pilha; R$ 1,0 MI | 0,7% | 2024 |
| 17 | `Agricultura e meio ambiente` | 43,0 | trator; meia pilha; R$ 0,5 MI | 0,4% | 2024 |
| 18 | `Esporte e lazer` | 45,5 | quadra vazia; uma moedinha; R$ 4.600 | 0,003% | 2024 |
| 19 | `Seguranca defesa civil` | 48,3 | guarda, sirene, ônibus e casinha sobem **cinza e vazios**, um por palavra (48,3 / 49,1 / 49,9 / 50,5) | | 2024 |
| 20 | `animal zero` | 51,6 | chip R$ 0 nos quatro; selo 100% no topo; baque | ZERO | 2024 |
| 21 | `2025 Paulo` | 52,3 | anel volta a cinza; pílula 2025; tag PAULO CARVALHO DE NOVO | | 2025 |
| 22 | `Entrou 147` | 54,8 | R$ 146,8 MI | +13% QUE 2024 | 2025 |
| 23 | `Gastou 157` | 56,5 | R$ 157,4 MI | | 2025 |
| 24 | `Faltaram mais` | 58,1 | 10,5 pilhas vermelhas; R$ 10,6 MI; baque | 2º ANO NO VERMELHO | 2025 |
| 25 | `Educacao 63` | 59,9 | 40 pilhas; R$ 62,7 MI | 40% | 2025 |
| 26 | `Saude 38` | 63,4 | 24 pilhas; R$ 37,7 MI | 24% | 2025 |
| 27 | `Administracao 20` | 66,1 | 13 pilhas; R$ 19,8 MI | 13% | 2025 |
| 28 | `Obras e servicos urbanos 16` | 68,7 | 10 pilhas; R$ 16,1 MI | 10% | 2025 |
| 29 | `so limpeza` | 72,0 | caminhão de lixo acende; metade da fatia muda de tom; R$ 6,9 MI | QUASE METADE | 2025 |
| 30 | `Assistencia social 6 e meio` | 74,3 | 4 pilhas; R$ 6,5 MI | 4% | 2025 |
| 31 | `Camara 5` | 76,3 | 3 pilhas; R$ 5,1 MI | 3% | 2025 |
| 32 | `Dividas 5` | 78,0 | 3 pilhas; R$ 4,9 MI | 3% | 2025 |
| 33 | `Turismo 3` | 79,3 | 2 pilhas; R$ 3,1 MI | 2% | 2025 |
| 34 | `Agricultura e pesca` | 80,0 | R$ 0,9 MI | 0,6% | 2025 |
| 35 | `Cultura 600` | 82,9 | R$ 0,6 MI | 0,4% | 2025 |
| 36 | `Esporte seguranca` | 84,5 | os cinco prédios vazios ganham um contorno cinza que acende devagar (0,5 s) | | 2025 |
| 37 | `animal zero` (2ª) | 87,7 | chip R$ 0; selo 100% | ZERO DE NOVO | 2025 |
| 38 | `2026 ate maio` | 88,8 | pílula 2026 · ATÉ MAIO | | 2026 |
| 39 | `ultimo mes que a prefeitura` | 90,4 | prefeitura com selo "ENTREGOU ATÉ MAIO" (alerta) | | 2026 |
| 40 | `Camara ja entregou` | 92,2 | Câmara com selo "ENTREGOU ATÉ SETEMBRO" (verde) | | 2026 |
| 41 | `Entrou 61` | 94,0 | R$ 60,8 MI | | 2026 |
| 42 | `ja pagou 56` | 95,7 | anel de 100 pilhas = R$ 56,4 MI pagos (Prefeitura + Câmara) | | 2026 |
| 43 | `Educacao 23` | 97,0 | 40 pilhas; R$ 22,6 MI | 40% | 2026 |
| 44 | `Saude 13` | 100,4 | 23 pilhas; R$ 13,2 MI | 23% | 2026 |
| 45 | `Administracao 8` | 102,7 | 15 pilhas; R$ 8,2 MI | 15% | 2026 |
| 46 | `Limpeza 2` | 105,0 | 5 pilhas; R$ 2,9 MI | 5% | 2026 |
| 47 | `Assistencia 2 e 400` | 107,5 | 4 pilhas; R$ 2,4 MI | 4% | 2026 |
| 48 | `Camara 2 e 300` | 108,8 | 4 pilhas; R$ 2,3 MI | 4% | 2026 |
| 49 | `Dividas turismo e obras` | 110,7 | 3 fatias de ~2 pilhas, uma por palavra; R$ 1,4 / 1,1 / 1,5 MI | ~2% CADA | 2026 |
| 50 | `Agricultura 500` | 115,3 | R$ 0,5 MI | 0,9% | 2026 |
| 51 | `Cultura 340` | 116,6 | R$ 0,34 MI | 0,6% | 2026 |
| 52 | `Esporte e seguranca zero` | 118,8 | quadra e guarda vazias; chip R$ 0; selo 100% | ZERO DE NOVO | 2026 |
| 53 | `Agora repara` | 121,1 | câmera abre; borda da mesa com terrenos vazios | | obras paradas |
| 54 | `Tres postos de saude` | 122,1 | 3 placas "POSTO DE SAÚDE · PREVISTO" | | obras paradas |
| 55 | `uma creche` | 123,6 | placa CRECHE | | obras paradas |
| 56 | `duas ambulancias` | 124,5 | 2 carcaças cinza de ambulância | | obras paradas |
| 57 | `a viatura da guarda` | 125,5 | carcaça de viatura | | obras paradas |
| 58 | `pista de skate` | 126,7 | placa PISTA DE SKATE | | obras paradas |
| 59 | `pier dos pescadores` | 127,9 | placa PÍER | | obras paradas |
| 60 | `nenhum real` | 131,5 | carimbo "R$ 0 GASTO" em cada placa, um atrás do outro; impacto | 2024, 2025 E 2026 | obras paradas |
| 61 | `Enquanto isso` | 133,4 | galpão CH SERVIÇOS sobe; fila de bonecos com crachá | | o contrato |
| 62 | `recebeu 2 milhoes` | 138,3 | pilha acento MAIO/2026 sobe até 21 blocos; R$ 2,10 MI | AQUI, 1 BLOCO = R$ 100 MIL | o contrato |
| 63 | `folha da saude` | 142,0 | pilha cinza FOLHA DA SAÚDE · MAIO/2026 ao lado, mesma altura | PRATICAMENTE IGUAL | o contrato |
| 64 | `Um ano antes` | 144,3 | pilha cinza MAIO/2025 com 14 blocos; R$ 1,40 MI | | o contrato |
| 65 | `Ministerio Publico recomendou` | 147,4 | prédio MP sobe; carimbo neutro RECOMENDOU SUSPENDER; impacto | | o MP |
| 66 | `funcoes de concurso` | 150,9 | bonecos chegam ao posto, à escola e à assistência | | o MP |
| 67 | `contrato continuou` | 152,9 | papel do carimbo sai de lado; fila continua | | o MP |
| 68 | `subiu 50` | 154,9 | pilha MAIO/2026 brilha devagar | **+50%** | o MP |
| 69 | `uma denuncia` | 156,3 | Tribunal TCM-BA ao fundo; pasta "DENÚNCIA · EM ANÁLISE" | SEM JULGAMENTO | o MP |
| 70 | `Publico Federal` | 159,5 | letreiro troca para MPF (fade 0,4 s) | | o Fundeb |
| 71 | `devolucao de 2` | 161,1 | 22 blocos saem da escola rumo ao MPF; R$ 2,2 MI | DEVOLVER R$ 2,2 MI | o Fundeb |
| 72 | `Gastar nao e crime` | 163,9 | mesa inteira; texto pequeno no alto "GASTAR NÃO É CRIME" | | a pergunta |
| 73 | `posto de saude nao sai` | 167,5 | placa do posto acende; "?" | | a pergunta |
| 74 | `contrato so cresce` | 168,9 | pilha do contrato acende; "?" | O POSTO NÃO SAI. O CONTRATO CRESCE. | a pergunta |
| 75 | `Segue o` | 170,0 | @eumagnoleite em verde; ding | | e você? |

75 eventos principais (mais tags e rótulos), cerca de 1 a cada 2,3 s; com empurrões e plaquinhas, perto de 1 por segundo.

## 2.5 Cenas com câmera (resumo)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa A e B | 0 → 13,6 | Kit Mapas | CANAVIEIRAS · O QUE ENTROU |
| 2024 | 13,6 → 52,3 | anel de cima (44°) com o cofre; a câmera gira devagar de fatia em fatia, acompanhando o prédio que sobe; no fim abre para mostrar o anel todo colorido | 2024 · PARA ONDE FOI |
| 2025 | 52,3 → 88,8 | mesmo giro, mais rápido; close no caminhão de lixo no "só limpeza" | 2025 · PARA ONDE FOI |
| 2026 | 88,8 → 121,1 | prefeitura × Câmara lado a lado nos selos de entrega, depois giro no anel | 2026 · ATÉ MAIO |
| obras paradas | 121,1 → 133,4 | travelling lateral pela borda da mesa, placa por placa | O QUE NÃO SAIU DO PAPEL |
| o contrato | 133,4 → 147,2 | grua no galpão; pilhas do lado para onde a câmera olha | O CONTRATO |
| o MP | 147,2 → 159,2 | MP → acompanha os bonecos → galpão → Tribunal ao fundo | O MINISTÉRIO PÚBLICO |
| o Fundeb | 159,2 → 163,9 | MPF → escola | O FUNDEB |
| a pergunta / e você? | 163,9 → 172,8 | mesa inteira, arco lento, termina entre o posto vazio e o galpão | A PERGUNTA · E VOCÊ? |

## 2.6 Selos de fonte (discretos, um por bloco)
- 2024 e 2025: "Fonte: Anexo 9 e Balanço enviados ao TCM-BA"
- 2026: "Fonte: SIGA de maio/2026 (Prefeitura e Câmara), TCM-BA · valores pagos"
- Obras paradas: "Fonte: SIGA de dez/2024, dez/2025 e mai/2026, TCM-BA"
- Contrato: "Fonte: PCMGE056 de maio/2025 e maio/2026, TCM-BA"
- MP: "Fonte: MP-BA, recomendação de out/2025 (Bahia Notícias, 02/10/2025)"
- MPF: "Fonte: MPF, 30/07/2026 (Bahia Notícias, 31/07/2026)"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria, consulta de 06/11/2026"
Valores exatos e contas próprias: `audio/fontes.md`.

**Conferir antes de publicar:** se as prestações de junho a setembro de 2026 da prefeitura chegaram ao TCM e se a denúncia sobre o contrato foi julgada.

## 2.7 Sons
whoosh nas trocas de cena; tique na pílula; pop em cada fatia que pinta; subida na pilha do contrato; baque nos dois "Faltaram" e nos três "zero"; impacto no carimbo R$ 0 GASTO e no RECOMENDOU SUSPENDER; ding no fim. Sem trilha, igual à série.

## 2.8 Arquivos
- `src/videos/orcamentocanavieiras/OrcamentoCanavieiras.tsx` (a partir do de Inhambupé) e `pecas.tsx` com peças novas: `AnelPorcentagem` (100 pilhas com fatias coloridas e plaquinha presa), `PlacaObraPrevista`, `CarcacaVeiculo`, `GalpaoEmpresa`, `FilaTrabalhadores`, `PredioMP` (letreiro trocável), `CasinhaAnimal`. Reaproveitar escola, posto, prefeitura, Câmara, guarda, palco, quadra e Tribunal da série.
- `src/Root.tsx`: `OrcamentoCanavieiras`, `OrcamentoCanavieirasGuia`, `OrcamentoCanavieirasLimpo`, `CapaOrcamentoCanavieiras`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-canavieiras/` → `projetos/034.../mapas/canavieiras.mp4`.
- 5212 quadros; conferir o disco (`df -h ~`) antes do vídeo final.

## 2.9 Origem das escolhas
- Da pessoa: 100% de cada ano por setor, com Câmara, cultura, obras, serviços, esporte, segurança, defesa civil, proteção animal e transporte; introdução curta; ~2:50; Belmonte como referência; Kit Mapas + Estúdio 3D; marca d'água @eumagnoleite.
- Do `_aprendizados.md`: plaquinhas pequenas presas à fatia ou ao prédio; prédios só sobem na palavra deles; acento só no que importa; nada piscando; selos de fonte discretos; marca d'água por cima do mapa.
- Do diretor (★): o anel de 100 pilhas que se pinta fatia por fatia, deixando visível quanto sobra para os setores pequenos; os prédios zerados sobem cinza e vazios; os terrenos com placa "PREVISTO · R$ 0 GASTO"; a pilha do contrato de um mês ao lado da folha da saúde.
