# Plano de cenas: 034. orçamento de canavieiras (versão 1, para aprovação)

Código `orcamentocanavieiras` · Nome `OrcamentoCanavieiras` · Perfil @eumagnoleite · série Magno Explica.
Molde: **Belmonte versão 2 (032)** e **Inhambupé (033)**. **Kit Mapas** na abertura e no "de onde vem" de 2024; **Estúdio 3D** com a maquete redonda, o **cofre no meio** e as **pilhas de dinheiro em volta**. Código base: `src/videos/orcamentoinhambupe/OrcamentoInhambupe.tsx`. Marca d'água @eumagnoleite pequena quicando pela tela inteira, do início ao fim.

Novidade deste vídeo: o miolo é o **contrato de mão de obra terceirizada** (CH Serviços), com a fila de trabalhadores genéricos saindo da empresa para o hospital, a escola e a assistência, e depois o **Ministério Público**, o **MPF e o Fundeb**, **turismo × esporte**, **segurança zero** e as **contas atrasadas** no Tribunal.

## 2.1 Narração
- `audio/narracao-norm.wav`: 130,82 s (voz Mário, gerada pela pessoa; silêncio das pontas cortado e acelerada 1,15x, como Belmonte v2 e Inhambupé) · `AUDIO_SEG = 130.82` · `QUADROS = 3952`.
- 328 palavras, iguais ao roteiro. A última ("informações.") termina em 130,42 s.
- Ajustes: nenhum no `palavras.json` (original guardado). A transcrição escreveu "4,6 milhões" no esporte, mas conferi o áudio de novo: a voz fala "quatro mil e seiscentos reais". A voz disse "Com o esporte" (a legenda segue o roteiro: "Com esporte").
- Repetidas (usar trecho único no `quando()`): "Entrou" 3× (15,08 / 32,78 / 51,78), "Saiu" 3× (23,02 / 40,70 / 58,66), "União" 3× (17,38 / 35,32 / 53,84), "Fundeb" 4× (19,50 / 37,54 / 55,96 / 102,08), "Educação" e "Saúde" 2× com o número, "2024" 3× (12,50 / 106,04 / 116,96), "2025" 3× (30,00 / 70,06 / 80,94), "2026" 2× (48,38 / 73,72), "Faltaram" 2× (28,68 / 46,58), "Ministério" 2× (81,96 / 98,48), "Tribunal" 3×, "contrato" 4×.

## 2.2 Ideia e mundo
- **Escala principal: 1 pilha = R$ 1 milhão** (placar fixo no canto). O anel em volta do cofre muda a cada ano: 2024 = 143 pilhas gastas sobre 130 que entraram (13 em vermelho fora do anel); 2025 = 157 sobre 147 (10,5 vermelhas); 2026 = 74 comprometidas sobre 61 (13 vermelhas).
- **De onde vem (2025 e 2026)**: as pilhas do anel ganham três cores na proporção certa: azul (União), roxo (Estado e Fundeb), dourado (próprio município). 2024 fica no mapa.
- **Lugares novos** (sobem só na hora da fala, na borda da mesa):
  1. **Empresa terceirizada**: galpão genérico com letreiro "CH SERVIÇOS" (texto na fonte do perfil, sem logo) e uma **fila de bonecos genéricos com crachá** que caminham para o hospital, a escola e o prédio da assistência.
  2. **Ministério Público**: prédio genérico com letreiro "MINISTÉRIO PÚBLICO"; mais tarde troca o letreiro para "MPF" (mesmo prédio, sem cortar a cena).
  3. **Palco de eventos** com letreiro "TURISMO" e, ao lado, uma **quadra de esporte** vazia.
  4. **Posto da guarda** (peça da série), vazio.
  5. **Tribunal TCM-BA** (peça de Belmonte) com uma **prateleira de pastas mensais**.
- **Comparações do contrato**: aqui a escala muda e a plaquinha avisa **"AQUI, 1 BLOCO = R$ 100 MIL"**. Maio/2025: 14 blocos; maio/2026: 21 blocos; ao lado, pilha cinza "FOLHA DA SAÚDE · MAIO/2026": 21 blocos.
- **Prédios da série** que sobem na hora da fala: escola (educação), posto de saúde/hospital (saúde), prédio da assistência.
- Cidade do litoral sul (Canavieiras fica na costa, entre Una e Belmonte): coqueiros, casinhas baixas, um pedaço de mangue e de rio na borda da mesa, só no arco vazio (regra 029: nada na frente da câmera).

**Paleta** (tudo do tema do perfil eumagnoleite): fundo → `fundo`; mesa → `chao`; prédios → `objeto`; pilhas → `dinheiro`; União/Estado/município → `apoio.azul`/`apoio.roxo`/`apoio.dourado` (as mesmas de Belmonte); 2025 nas comparações → `objetoEscuro`; 2026 → `acento`; falta de dinheiro → `alerta`.

**Mapa do mundo** (mesa redonda, raio 9, chão em y = 0)
| lugar | posição [x, y, z] | observação |
|---|---|---|
| cofre + anel de pilhas | [0, 0, 0] | peça da série; anel de raio 3,2 |
| escola | [-5, 0, -3] | sobe em "Educação, 54" |
| hospital / posto de saúde | [5, 0, -3] | sobe em "Saúde, 33" |
| empresa terceirizada | [0, 0, 6] | peça nova (galpão + letreiro + fila de bonecos) |
| prédio da assistência | [-5,5, 0, 3,5] | peça da série (prédio baixo com letreiro "ASSISTÊNCIA") |
| Ministério Público / MPF | [5,5, 0, 3,5] | peça nova (prédio com colunas + letreiro trocável) |
| palco TURISMO + quadra | [-6,5, 0, -6] | peças novas, lado a lado |
| posto da guarda | [6,5, 0, -6] | peça da série; sobe vazio no "zero" |
| Tribunal TCM-BA | [0, 0, -7] | peça de Belmonte + prateleira de pastas |

**Regras visuais**: acento só no que cresceu (pilha de maio/2026 do contrato, plaquinhas de "+50%"). Pessoas reais só como texto (prefeito como tag de gestão, sem boneco). Nada pisca; carimbos entram em 0,4 s. Plaquinhas pequenas e separadas, nunca cartão grande sobre a maquete (regra do 032).

## 2.3 Trechos de mapa (Kit Mapas, composição `OrcamentoCanavieiras`, 0 a 23,0 s)
| trecho | de / até | o que acontece |
|---|---|---|
| A · CANAVIEIRAS | 0 → 15,1 s | voo do Brasil até Canavieiras, no litoral sul da Bahia (satélite); contorno do município acende em verde; seta e nome "CANAVIEIRAS"; tags "GASTOU MAIS DO QUE ARRECADOU" (1,3 s), "2024 E 2025" (2,8 s), "JUN–SET/2026: NÃO ENTREGUE" (5,9 s), "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (9,1 s), "2024 · GESTÃO PAULO CARVALHO" (12,5 s) |
| B · DE ONDE VEM (2024) | 15,1 → 23,0 s | "ENTROU R$ 130 MI" (15,1 s); seta de **Brasília** com "UNIÃO R$ 81 MI" (17,4 s); contorno da Bahia e seta de **Salvador** com "ESTADO + FUNDEB R$ 39 MI" (19,5 s); município acende com "PRÓPRIO MUNICÍPIO: SÓ R$ 9 MI" (21,1 s) |

O mapa sai do Kit Mapas sem legenda, marca e som; a marca d'água e a legenda vêm do 3D por cima (regra 029).

## 2.4 Palavras-chave (tabela de eventos)
Em cada número: **plaquinha de comparação no topo** + **rótulo com valor exato embaixo** + **empurrão leve de câmera (0,5 s)** (regra global do 032).

| # | palavra (`quando`) | tempo | objeto | o que acontece | plaquinha no topo | cena |
|---|---|---|---|---|---|---|
| 1 | `Em Canavieiras` | 0,0 | mapa | voo começa do Brasil | | A |
| 2 | `gastou mais` | 1,3 | mapa | tag GASTOU MAIS DO QUE ARRECADOU (alerta) | | A |
| 3 | `em 2024 e em 2025` | 2,8 | mapa | tag 2024 E 2025 | | A |
| 4 | `junho a setembro` | 5,9 | mapa | tag JUN–SET/2026: NÃO ENTREGUE | | A |
| 5 | `Tribunal de Contas` | 9,1 | mapa | tag TRIBUNAL DE CONTAS DOS MUNICÍPIOS | | A |
| 6 | `2024 gestao` | 12,5 | mapa | tag 2024 · GESTÃO PAULO CARVALHO; pílula 2024 | | A |
| 7 | `Entrou 130` | 15,1 | mapa | R$ 129,8 MI | | B |
| 8 | `Uniao 81` | 17,4 | mapa | seta de Brasília; UNIÃO R$ 81 MI | ★ MAIS DE 6 DE CADA 10 REAIS | B |
| 9 | `Fundeb 39` | 19,5 | mapa | seta de Salvador; ESTADO + FUNDEB R$ 39 MI | 3 DE CADA 10 | B |
| 10 | `proprio municipio` | 21,1 | mapa | município acende; SÓ R$ 9 MI | SÓ 7 DE CADA 100 REAIS | B |
| 11 | `Saiu 143` | 23,0 | cofre | maquete aparece; cofre abre; 130 pilhas no anel + 13 vermelhas fora; R$ 143,1 MI | | 2024 |
| 12 | `Educacao 54` | 25,4 | escola | escola sobe; 54 pilhas voam; R$ 54,3 MI | 38% DO GASTO | 2024 |
| 13 | `Saude 33` | 27,0 | hospital | 33 pilhas; R$ 33,3 MI | 23% DO GASTO | 2024 |
| 14 | `Faltaram 13` | 28,7 | anel | as 13 vermelhas pulsam devagar; R$ 13,3 MI; baque | FALTA DE 1 EM CADA 10 REAIS | 2024 |
| 15 | `2025 Paulo` | 30,0 | anel | pilhas voltam; pílula 2025; tag PAULO CARVALHO DE NOVO | | 2025 |
| 16 | `Entrou 147` | 32,8 | anel | anel com 147 pilhas; R$ 146,8 MI | +13% QUE 2024 | 2025 |
| 17 | `Uniao 93` | 35,3 | anel | 93 azuis; R$ 93,4 MI | | 2025 |
| 18 | `Fundeb 43` | 37,5 | anel | 43 roxas; R$ 42,8 MI | | 2025 |
| 19 | `municipio 10` | 39,2 | anel | 10 douradas; R$ 9,9 MI | AINDA SÓ 7 DE CADA 100 | 2025 |
| 20 | `Saiu 157` | 40,7 | anel | 157 pilhas (10,5 vermelhas fora); R$ 157,4 MI | | 2025 |
| 21 | `Educacao 63` | 43,3 | escola | 63 pilhas; R$ 62,7 MI | 40% DO GASTO | 2025 |
| 22 | `Saude 38` | 45,1 | hospital | 38 pilhas; R$ 37,7 MI | 24% DO GASTO | 2025 |
| 23 | `Faltaram mais` | 46,6 | anel | vermelhas pulsam; R$ 10,6 MI; baque | 2º ANO NO VERMELHO | 2025 |
| 24 | `2026 ate maio` | 48,4 | anel | pílula 2026 · ATÉ MAIO | | 2026 |
| 25 | `ultimo mes entregue` | 50,6 | 2D | selo "ÚLTIMO MÊS ENTREGUE AO TCM: MAIO" | | 2026 |
| 26 | `Entrou 61` | 51,8 | anel | anel com 61 pilhas; R$ 60,8 MI | | 2026 |
| 27 | `Uniao 37` | 53,8 | anel | azuis; R$ 37,1 MI | | 2026 |
| 28 | `Fundeb 17` | 56,0 | anel | roxas; R$ 16,6 MI | | 2026 |
| 29 | `municipio 7` | 57,5 | anel | douradas; R$ 7,1 MI | | 2026 |
| 30 | `ja comprometeu` | 60,3 | anel | +13 pilhas nascem em vermelho fora do anel; R$ 73,8 MI | | 2026 |
| 31 | `13 a mais` | 62,9 | 2D | chip R$ 13 MI A MAIS DO QUE ENTROU; baque | EM SÓ 5 MESES | 2026 |
| 32 | `Agora repara` | 64,2 | mesa | câmera abre; galpão da empresa terceirizada sobe na borda (whoosh) | | o contrato |
| 33 | `mao de obra terceirizada` | 66,3 | empresa | fila de bonecos com crachá sai do galpão | | o contrato |
| 34 | `CH Servicos` | 68,0 | empresa | letreiro CH SERVIÇOS acende; selo "PREGÃO · SERVIÇOS DE FACILITIES" | AQUI, 1 BLOCO = R$ 100 MIL | o contrato |
| 35 | `maio de 2025` | 69,7 | empresa | pilha cinza "MAIO/2025" com 14 blocos; R$ 1,40 MI | | o contrato |
| 36 | `maio de 2026` | 73,3 | empresa | pilha acento "MAIO/2026" sobe até 21 blocos (subida); R$ 2,10 MI | +50% | o contrato |
| 37 | `Num mes so` | 75,9 | 2D | selo "EM UM ÚNICO MÊS" | | o contrato |
| 38 | `folha inteira da saude` | 77,8 | hospital | pilha cinza "FOLHA DA SAÚDE · MAIO/2026" (21 blocos) sobe ao lado do hospital, mesma altura | PRATICAMENTE IGUAL | o contrato |
| 39 | `outubro de 2025` | 80,5 | MP | prédio MINISTÉRIO PÚBLICO sobe; selo OUT/2025 | | o MP |
| 40 | `recomendou suspender` | 82,7 | 2D | carimbo neutro "RECOMENDOU SUSPENDER" sobre um papel na frente do galpão; impacto | | o MP |
| 41 | `funcoes de concurso` | 85,8 | bonecos | os bonecos com crachá chegam ao hospital (86,7), à escola (87,4) e à assistência (88,2), um grupo por palavra | | o MP |
| 42 | `O contrato continuou` | 90,9 | empresa | o papel com o carimbo sai de lado; a fila continua andando | | o MP |
| 43 | `subiu 50 por cento` | 92,7 | empresa | pilha de maio/2026 brilha devagar | **+50%** | o MP |
| 44 | `uma denuncia` | 95,0 | Tribunal | prédio TCM-BA sobe ao fundo; pasta "DENÚNCIA 25448e25 · EM ANÁLISE" | SEM JULGAMENTO | o MP |
| 45 | `E tem mais` | 97,5 | MP | câmera volta ao prédio | | o Fundeb |
| 46 | `Publico Federal` | 99,2 | MP | letreiro troca para "MPF" (fade de 0,4 s) | | o Fundeb |
| 47 | `devolucao de 2` | 100,0 | escola | 22 blocos saem da escola e voltam para o MPF; R$ 2,2 MI | DEVOLVER R$ 2,2 MI | o Fundeb |
| 48 | `educacao infantil` | 104,0 | escola | uma creche pequena aparece ao lado da escola; selo "VAAT 2022 A 2024" | | o Fundeb |
| 49 | `Secretaria de Turismo` | 107,1 | palco | palco TURISMO sobe; luzes acendem devagar; 44 blocos; R$ 4,37 MI | | turismo × esporte |
| 50 | `Com esporte` | 110,9 | quadra | quadra sobe vazia; 1 moedinha só | R$ 4.600 | turismo × esporte |
| 51 | `600 reais` | 112,8 | 2D | plaquinha | **950 VEZES MENOS** | turismo × esporte |
| 52 | `seguranca publica` | 113,7 | guarda | posto da guarda sobe vazio | | segurança |
| 53 | `recebeu zero` | 115,0 | 2D | chip SEGURANÇA PÚBLICA: R$ 0 · 2024, 2025, 2026; baque | ZERO NOS 3 ANOS | segurança |
| 54 | `Desde 2024` | 116,7 | Tribunal | câmera vai à prateleira de pastas do TCM | | o prazo |
| 55 | `prestacoes de contas` | 118,6 | Tribunal | as pastas de 2024, 2025 e 2026 entram uma a uma, todas com etiqueta "FORA DO PRAZO"; as de jun a set/2026 ficam vazias, "NÃO ENTREGUE" | 30 DE 30 FORA DO PRAZO | o prazo |
| 56 | `Gastar nao e crime` | 121,4 | mesa | câmera abre na mesa inteira; texto "GASTAR NÃO É CRIME" | | a pergunta |
| 57 | `falta dinheiro` | 124,4 | anel | as pilhas vermelhas dos três anos aparecem juntas | | a pergunta |
| 58 | `so cresce` | 127,1 | empresa | pilha do contrato acende; "?" | FALTA DINHEIRO, E O CONTRATO CRESCE? | a pergunta |
| 59 | `Segue o` | 127,9 | 2D | @eumagnoleite em verde; ding | | e você? |

59 eventos principais (mais tags e notas), cerca de 1 a cada 2 s; com os empurrões e as plaquinhas fica perto de 1 por segundo.

Contas próprias das plaquinhas: 81/130 = 62%; 39/130 = 30%; 9/130 = 7%; 54,3/143,1 = 38%; 33,3/143,1 = 23%; 13,3/129,8 = 10%; 146,8/129,8 = +13%; 9,9/146,8 = 6,8%; 62,7/157,4 = 40%; 37,7/157,4 = 24%; 2,10/1,40 = 1,50; 4.364.972/4.600 ≈ 949 vezes; 30 de 30 prestações (12 de 2024, 12 de 2025, 1 de transição e 5 de 2026).

## 2.5 Cenas com câmera (resumo)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa A e B | 0 → 23,0 | Kit Mapas | CANAVIEIRAS 2024 → 2026 · DE ONDE VEM |
| 2024 | 23,0 → 30,0 | mesa de cima (3/4) → close escola → close hospital → anel com as 13 vermelhas; arco 0,08 | 2024 · PARA ONDE FOI |
| 2025 | 30,0 → 48,4 | anel de cima (44°) com aproximação no "de onde vem" → escola → hospital → anel com as vermelhas | 2025 · DE ONDE VEM · PARA ONDE FOI |
| 2026 | 48,4 → 64,2 | anel de cima → as 13 vermelhas fora do anel | 2026 · ATÉ MAIO |
| o contrato | 64,2 → 80,1 | grua sobe e desce no galpão; pilhas ao lado do galpão (do lado para onde a câmera olha); travelling até o hospital no "folha da saúde" | O CONTRATO |
| o MP | 80,1 → 97,5 | prédio do MP → acompanha a fila de bonecos até hospital, escola e assistência → volta ao galpão → Tribunal ao fundo | O MINISTÉRIO PÚBLICO |
| o Fundeb | 97,5 → 105,9 | MP → escola | O FUNDEB |
| turismo × esporte | 105,9 → 113,6 | palco e quadra lado a lado, leve arco | TURISMO × ESPORTE |
| segurança | 113,6 → 116,7 | posto da guarda | SEGURANÇA |
| o prazo | 116,7 → 121,4 | prateleira do Tribunal, de lado | O PRAZO |
| a pergunta / e você? | 121,4 → 130,8 | mesa inteira, arco lento, termina no galpão | A PERGUNTA · E VOCÊ? |

## 2.6 Selos de fonte (discretos, um por bloco)
- 2024: "Fonte: Balanço 2024 enviado ao TCM-BA"
- 2025: "Fonte: Balanço 2025 enviado ao TCM-BA"
- 2026: "Fonte: Demonstrativos SIGA de maio/2026, TCM-BA"
- Contrato: "Fonte: PCMGE056 (maio/2025 e maio/2026), TCM-BA"
- MP: "Fonte: MP-BA, recomendação de 10/2025 (Bahia Notícias, 02/10/2025)"
- Tribunal: "Fonte: TCM-BA, Decisões › Auditoria e e-TCM, consulta de 06/11/2026"
- MPF: "Fonte: MPF, recomendação de 30/07/2026 (Bahia Notícias, 31/07/2026)"
- Turismo e segurança: "Fonte: Anexo 9 de 2024 e 2025 e PCMGE015 de maio/2026, TCM-BA"
Valores exatos e contas próprias: `audio/fontes.md`.

**Conferir antes de publicar:** se as prestações de junho a setembro de 2026 chegaram ao TCM e se a denúncia 25448e25 foi julgada.

## 2.7 Sons
whoosh nas trocas de cena; tique na pílula; pop nos números; subida na pilha de maio/2026 do contrato; baque nos dois "Faltaram", no "13 a mais" e no "zero"; impacto no carimbo RECOMENDOU SUSPENDER; ding no fim. Sem trilha, igual à série.

## 2.8 Arquivos
- Novos: `src/videos/orcamentocanavieiras/OrcamentoCanavieiras.tsx` (a partir do de Inhambupé) e `pecas.tsx` com peças novas: `GalpaoEmpresa` (galpão + letreiro), `FilaTrabalhadores` (bonecos genéricos com crachá, andando por um caminho), `PredioMP` (colunas + letreiro trocável), `PalcoEventos`, `QuadraEsporte`, `PrateleiraPastas` (pastas mensais com etiqueta). Reaproveitar `CaixaEmpresa` do 033 se servir.
- Registro em `src/Root.tsx`: `OrcamentoCanavieiras`, `OrcamentoCanavieirasGuia`, `OrcamentoCanavieirasLimpo`, `CapaOrcamentoCanavieiras`.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/orcamento-canavieiras/` (contorno do IBGE de Canavieiras, código a conferir no Kit) → `projetos/034.../mapas/canavieiras.mp4`.
- 3952 quadros; o `render.mjs` divide em partes. Conferir o disco (`df -h ~`) antes do vídeo final (regra do 033).

## 2.9 Origem das escolhas
- Da pessoa: estilo de Belmonte (032) com as peculiaridades de Canavieiras; irregularidades e sem licitação em destaque; comparação 2024/2025/2026; só Estúdio 3D + Kit Mapas; marca d'água @eumagnoleite.
- Do `_aprendizados.md`: plaquinhas pequenas presas aos objetos (nunca cartão grande); pilhas ao lado do objeto; prédios só sobem na palavra deles; acento só no que importa; selo de fonte discreto; marca d'água por cima do mapa; nada piscando; casas e árvores só no arco vazio.
- Do diretor (★): a fila de trabalhadores com crachá chegando ao hospital, à escola e à assistência na hora em que cada palavra é dita; a pilha do contrato de um mês ao lado da folha da saúde do mesmo mês, com a mesma altura; o mesmo prédio trocando o letreiro de MINISTÉRIO PÚBLICO para MPF; as pastas vazias de junho a setembro de 2026 na prateleira do Tribunal.
