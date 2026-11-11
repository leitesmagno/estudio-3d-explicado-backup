# Plano de cenas: 048. arrecadação de belmonte (versão 2: fileira dos 9 anos em cada item)

Código `arrecadacaobelmonte` · Nome `ArrecadacaoBelmonte` · Perfil @eumagnoleite · Série Belmonte, vídeo 1.
Molde de código: **035 Paratinga** (`src/videos/orcamentoparatinga/`), com o cofre, as pilhas, as torres finas e as plaquinhas por ano. **Kit Mapas** na abertura e **Estúdio 3D** na maquete. Marca d'água @eumagnoleite pequena, quicando pela tela do início ao fim.

**A grande diferença deste vídeo:** nos vídeos de orçamento, o dinheiro **sai** do cofre para os setores. Aqui ele **entra**: vem de quatro lugares da borda da mesa (União, Fundeb, Estado e o bairro do próprio município) e corre para o cofre de Belmonte.

## 1. Narração
- `audio/narracao-norm.wav`: **170,02 s** (voz Adam; pausas encurtadas para 0,35 s; acelerada 1,033x para fechar em 2:50). `AUDIO_SEG = 170.02` · `QUADROS = 5128` (com 0,9 s de folga).
- 410 palavras, iguais ao roteiro aprovado. A última ("informações.") termina em 169,48 s. A transcrição tem todas as frases, sem nada pulado.
- Palavras repetidas (usar trecho único no `quando()`): "2018" 9×, "2025" 9×, "União" 5×, "Fundeb" 4×, "IPTU" 3×, "próprio município" 3×, "salto" 2×, "arrecadou" 4×.

## 2. A maquete
- **Mesa redonda** com o **cofre de Belmonte no meio**.
- **Quatro fontes na borda, no sentido horário, na ordem da fala**:

| # | fonte | peça | posição na mesa |
|---|---|---|---|
| 1 | União | prédio de colunas com placa "UNIÃO" (genérico, sem brasão) | 10 h |
| 2 | Fundeb | prédio baixo com livro na fachada, placa "FUNDEB · FUNDO DA EDUCAÇÃO" | 1 h |
| 3 | Estado | prédio com placa "ESTADO" (genérico, sem brasão) | 4 h |
| 4 | Município | **bairro de Belmonte**: seis casinhas, uma por tributo (abaixo) | 7 h |

- De cada fonte sai uma **trilha** até o cofre. Na palavra do valor, as pilhas correm pela trilha e entram no cofre.
- **Escala:**
  - para os repasses, **1 pilha = R$ 2 milhões** (10 moedas de R$ 200 mil);
  - no bairro, a escala muda para **1 moeda = R$ 100 mil**, porque os tributos são pequenos. O placar avisa a troca ("NO BAIRRO: 1 MOEDA = R$ 100 MIL").
- **Cor por ano:** dourado 2018 · verde 2025 · rosa 2026. Os anos do meio (2019 a 2024) ficam em cinza-claro. Legenda no placar.
- **Escadaria dos anos ★**, atrás do cofre: 9 torres finas, uma por ano de 2018 a 2026, com a arrecadação total.
  - Em pilhas: 30,5 · 33 · 34 · 36,7 · 45,5 · 44,8 · 52 · 63 · 55,8 (a de 2026 é rosa, com etiqueta "ATÉ SET").
  - A fala cita 2018, 2025 e 2026. As outras torres sobem em sequência no "mais que o dobro", com plaquinhas pequenas, para mostrar a subida. Valores no fontes.md.
- **Fileira dos 9 anos (pedido do Magno, 07/11/2026):** na frente de cada fonte e de cada casinha fica uma **fileira de 9 torrinhas finas, de 2018 a 2026**, cada uma com uma plaquinha pequena com o valor do ano.
  - Cores: 2018 dourada, 2019 a 2024 cinza-claro, 2025 verde, 2026 rosa com "ATÉ SET".
  - Quando a voz começa o item, as 9 sobem em sequência da esquerda para a direita (0,15 s cada). Na palavra do valor de 2018, a dourada acende; na de 2025, a verde.
  - A voz não muda: os anos do meio aparecem só na tela.
- **Valores de cada fileira** (R$ milhões, do Anexo 10 de cada ano e do PCMGE016 de 09/2026; FPM e ICMS já sem a parte do Fundeb):

| item | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|---|---|---|---|
| FPM (União) | 17,41 | 18,95 | 19,78 | 24,29 | 30,63 | 31,67 | 36,18 | 39,67 | 31,12 |
| SUS (União) | 4,49 | 5,88 | 7,75 | 5,52 | 5,17 | 6,57 | 9,10 | 11,72 | 13,96 |
| Ajuda da União ao Fundeb | 4,63 | 4,83 | 4,82 | 5,52 | 10,38 | 8,33 | 7,31 | 12,66 | 19,09 |
| ICMS (Estado) | 7,93 | 7,11 | 6,85 | 9,34 | 10,05 | 10,24 | 11,16 | 11,49 | 8,22 |
| Impostos do município (soma) | 5,80 | 6,52 | 6,17 | 7,10 | 7,47 | 6,50 | 8,82 | 15,35 | 10,21 |
| ISS | 3,48 | 3,51 | 3,10 | 2,92 | 3,02 | 4,11 | 3,32 | 4,17 | 3,42 |
| ITBI | 0,42 | 0,37 | 0,24 | 0,86 | 1,42 | 0,67 | 0,85 | 0,87 | 0,58 |
| Imposto de renda retido | 1,70 | 2,16 | 2,39 | 2,66 | 2,21 | 0,79 | 3,63 | 5,81 | 4,22 |
| Taxas | 0,18 | 0,38 | 0,42 | 0,55 | 0,39 | 0,36 | 0,39 | 1,34 | 0,84 |
| Iluminação pública | 0 | 0 | 0 | 0 | 0,32 | 0,44 | 0,08 | 0,66 | 0,53 |
| IPTU | 0,036 | 0,09 | 0,03 | 0,11 | 0,11 | 0,12 | 0,55 | 2,49 | 0,63 |

  Iluminação 2023: R$ 440.895,68 lançados como "contribuição de melhoria para expansão da rede de iluminação" (no Anexo 10 de 2023 a contribuição de iluminação ficou zerada). O imposto de renda de 2023 (R$ 790 mil) é o valor do documento; a plaquinha mostra só o número, sem comentário.
- **O bairro do município**: seis casinhas, cada uma com a sua fileira de 9 anos na frente (escala do bairro: 1 moeda = R$ 100 mil):

| casinha | tributo | 2018 (dito) | 2025 (dito) |
|---|---|---|---|
| oficina com ferramentas | ISS | 35 moedas (R$ 3,5 mi) | 42 (R$ 4,2 mi) |
| casa com placa "VENDE-SE" | ITBI | 4 (R$ 420 mil) | 9 (R$ 870 mil) |
| prédio da folha, com envelope de contracheque | imposto de renda retido | 17 (R$ 1,7 mi) | 58 (R$ 5,8 mi) |
| balcão com carimbo e alvará | taxas | 2 (R$ 180 mil) | 13 (R$ 1,3 mi) |
| poste de luz | iluminação pública | nada (R$ 0) | 7 (R$ 660 mil) |
| casa com telhado | IPTU | menos de meia moeda (R$ 36 mil) | 25 (R$ 2,5 mi): 21 cinza-escuras "DÍVIDA ATIVA" + 3 verdes "DO ANO" |

- **Plaquinhas** pequenas presas à torre ou à casinha, nunca cartão grande por cima da maquete.
- **Regras visuais:**
  - só valores na tela, sem porcentagem (o "de cada 100" é mostrado com 100 moedas);
  - nada de nome de prefeito;
  - prédios da União e do Estado sem brasão, logo ou bandeira.

## 3. Mapa (Kit Mapas, 0 → 11,0 s, vira `mapas/belmonte-arrecadacao.mp4`)
| trecho | de / até | o que acontece |
|---|---|---|
| A · BELMONTE | 0 → 7,1 s | voo do Brasil até Belmonte (sul da Bahia, satélite); contorno acende; tags "QUANTO BELMONTE ARRECADOU?" (0,3 s) e "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" (5,1 s) |
| B · 2018 | 7,1 → 11,0 s | tag "2018" (7,1 s); "R$ 61,0 MI · ARRECADOU EM 2018" na cidade (9,0 s) |

## 4. Eventos (tabela de `quando`)
Em cada número: plaquinha com o valor e um empurrão leve de câmera (0,5 s).
**Regra da fileira:** em todo item (FPM, SUS, ajuda ao Fundeb, ICMS, soma dos impostos, ISS, ITBI, imposto de renda, taxas, iluminação, IPTU), a palavra que abre o item faz subir as 9 torrinhas de 2018 a 2026. "Torre dourada 2018" e "torre verde 2025" nesta tabela querem dizer: acende a torrinha daquele ano, que já está de pé na fileira. Sempre que uma fileira termina de subir, as plaquinhas de todos os anos ficam visíveis.

| # | `quando` | tempo | o que acontece | cena |
|---|---|---|---|---|
| 1 | `Quanto Belmonte` | 0,0 | voo começa; tag QUANTO BELMONTE ARRECADOU? | mapa |
| 2 | `Tribunal de Contas` | 5,1 | tag TCM-BA | mapa |
| 3 | `Em 2018` | 7,1 | tag 2018 | mapa |
| 4 | `arrecadou 61` | 9,0 | R$ 61,0 MI · ARRECADOU EM 2018 | mapa |
| 5 | `Em 2025 125` | 11,0 | entra a maquete; o cofre e a torre dourada de 2018 já estão de pé (30,5 pilhas); a torre verde de 2025 sobe até 63 pilhas; R$ 125,8 MI | total |
| 6 | `Mais que o dobro` | 15,1 | ★ as torres cinza de 2019 a 2024 sobem uma por uma entre as duas (0,3 s cada), com plaquinha pequena; seta curva "MAIS QUE O DOBRO" | total |
| 7 | `E em 2026` | 16,4 | pílula 2026 · ATÉ SETEMBRO | total |
| 8 | `111 milhoes` | 19,5 | torre rosa sobe até 55,8 pilhas; R$ 111,5 MI · ATÉ SET | total |
| 9 | `De onde vem` | 21,5 | câmera sobe; as 4 fontes acendem na borda; as trilhas aparecem | de onde vem |
| 10 | `vem de fora` | 24,0 | as três fontes de fora (União, Fundeb, Estado) ganham contorno claro | de onde vem |
| 11 | `a Uniao mandou` | 26,4 | 36 pilhas verdes correm da União para o cofre; R$ 71,6 MI | de onde vem |
| 12 | `O Fundeb o fundo` | 29,3 | 10 pilhas do Fundeb; R$ 20,3 MI | de onde vem |
| 13 | `O Estado 13` | 33,4 | 6,7 pilhas do Estado; R$ 13,4 MI | de onde vem |
| 14 | `proprio municipio arrecadou` | 36,4 | 10 pilhas do bairro; R$ 20,5 MI | de onde vem |
| 15 | `Comecando pela Uniao` | 39,4 | câmera desce na União; pílula UNIÃO | união |
| 16 | `O FPM` | 40,3 | etiqueta FPM · FUNDO DE PARTICIPAÇÃO DOS MUNICÍPIOS na fachada | união |
| 17 | `foi de 17` | 44,1 | torre dourada 2018: 8,7 pilhas; R$ 17,4 MI | união |
| 18 | `para 39` | 46,9 | torre verde 2025: 19,8 pilhas; R$ 39,7 MI | união |
| 19 | `O SUS` | 50,6 | segunda dupla de torres, etiqueta SUS | união |
| 20 | `de 4 milhoes e meio` | 51,6 | 2018: 2,2 pilhas; R$ 4,5 MI | união |
| 21 | `para 11` | 52,8 | 2025: 5,9 pilhas; R$ 11,7 MI | união |
| 22 | `ajuda da Uniao ao Fundeb` | 55,3 | terceira dupla, etiqueta AJUDA AO FUNDEB; uma trilha curta liga a União ao Fundeb ★ | união |
| 23 | `de 4 milhoes e 600` | 56,8 | 2018: 2,3 pilhas; R$ 4,6 MI | união |
| 24 | `para 12` | 58,3 | 2025: 6,3 pilhas; R$ 12,7 MI | união |
| 25 | `passou de 19` | 64,1 | torre rosa 2026 ao lado: 9,5 pilhas; R$ 19,1 MI · ATÉ SET | união |
| 26 | `Do Estado quase` | 65,6 | câmera gira (horário) para o Estado; pílula ESTADO; etiqueta ICMS | estado |
| 27 | `7 milhoes e 900` | 69,2 | 2018: 4 pilhas; R$ 7,9 MI | estado |
| 28 | `11 milhoes e meio em` | 71,9 | 2025: 5,7 pilhas; R$ 11,5 MI | estado |
| 29 | `Agora os impostos` | 74,5 | câmera segue o giro até o bairro; pílula IMPOSTOS DO MUNICÍPIO; placar troca a escala: 1 MOEDA = R$ 100 MIL | bairro |
| 30 | `Somando impostos` | 77,3 | as seis casinhas acendem uma a uma até "iluminação" (79,9) | bairro |
| 31 | `5 milhoes e 800` | 81,7 | na praça do bairro, linha de 9 torres pequenas (2018 a 2026); sobe a de 2018: 58 moedas; R$ 5,8 MI | bairro |
| 32 | `Ate 2023` | 84,6 | sobem 2019 a 2023 quase iguais (65 · 62 · 71 · 75 · 65 moedas); chip "ENTRE R$ 6 E 7,5 MI" | bairro |
| 33 | `Ai veio o salto` | 88,5 | câmera abaixa na linha das torres | bairro |
| 34 | `8 milhoes e 800` | 90,3 | 2024: 88 moedas; R$ 8,8 MI | bairro |
| 35 | `15 milhoes e 400` | 93,0 | 2025: 154 moedas, sobe rápido; R$ 15,4 MI; som de subida. Logo depois sobe a rosa de 2026: 102 moedas, R$ 10,2 MI · ATÉ SET | bairro |
| 36 | `Quase tres vezes` | 95,6 | sombra da torre de 2018 copiada 3 vezes ao lado da de 2025 (fica quase da altura) | bairro |
| 37 | `Imposto por imposto` | 98,4 | pílula IMPOSTO POR IMPOSTO; câmera passeia pelas casinhas no sentido horário | tributos |
| 38 | `O ISS` | 99,9 | oficina; 2018: 35 moedas; R$ 3,5 MI | tributos |
| 39 | `para 4 milhoes e 200` | 104,7 | 2025: 42 moedas; R$ 4,2 MI | tributos |
| 40 | `O ITBI` | 105,8 | casa VENDE-SE; 2018: 4 moedas; R$ 420 MIL | tributos |
| 41 | `para 870` | 109,8 | 2025: 9 moedas; R$ 870 MIL | tributos |
| 42 | `O imposto de renda` | 111,9 | prédio da folha com envelope; 2018: 17 moedas; R$ 1,7 MI | tributos |
| 43 | `para 5 milhoes` | 116,7 | 2025: 58 moedas; R$ 5,8 MI | tributos |
| 44 | `As taxas` | 119,1 | balcão com carimbo; 2018: 2 moedas; R$ 180 MIL | tributos |
| 45 | `para 1 milhao e 300` | 121,1 | 2025: 13 moedas; R$ 1,3 MI | tributos |
| 46 | `iluminacao publica` | 124,0 | poste apagado | tributos |
| 47 | `era zero` | 125,2 | chip R$ 0 · 2018 A 2021 ao pé do poste | tributos |
| 48 | `chegou a 660` | 127,0 | poste acende devagar (0,6 s); 7 moedas verdes; R$ 660 MIL | tributos |
| 49 | `E o IPTU` | 129,3 | pílula O IPTU; câmera chega à casa com telhado | iptu |
| 50 | `36 mil` | 132,0 | 2018: um pedacinho de moeda dourada; R$ 36 MIL | iptu |
| 51 | `2 milhoes e 500` | 135,4 | 2025: 25 moedas sobem; R$ 2,5 MI | iptu |
| 52 | `Mas repara` | 137,2 | câmera aproxima | iptu |
| 53 | `divida ativa` | 140,2 | as 21 moedas de baixo ficam cinza-escuras; plaquinha "DÍVIDA ATIVA · R$ 2,1 MI · ANOS ANTERIORES" | iptu |
| 54 | `IPTU atrasado` | 141,3 | ★ calendários de anos antigos atrás da casa | iptu |
| 55 | `do proprio ano` | 145,0 | as 3 moedas de cima acendem em verde | iptu |
| 56 | `320 mil` | 146,5 | plaquinha "DO ANO · R$ 320 MIL" | iptu |
| 57 | `Mesmo com o salto` | 147,8 | câmera sobe para a mesa inteira; pílula DE CADA R$ 100 | 100 reais |
| 58 | `de cada 100` | 149,5 | 100 moedas em fila sobre a mesa, na frente do cofre | 100 reais |
| 59 | `so 16` | 153,1 | 16 moedas deslizam para o bairro e acendem; "R$ 16" | 100 reais |
| 60 | `O resto veio` | 155,8 | as outras 84 vão para as fontes de fora: 57 para a União (157,0), 11 para o Estado (157,7) e 16 para o Fundeb (158,5) | 100 reais |
| 61 | `Arrecadar mais` | 159,3 | cofre cheio no meio; pílula A PERGUNTA | pergunta |
| 62 | `para onde foi` | 162,4 | ★ a tampa do cofre abre e algumas moedas saem por uma trilha que some no escuro; "?" | pergunta |
| 63 | `proximo video` | 165,1 | chip "PRÓXIMO VÍDEO: PARA ONDE FOI" | pergunta |
| 64 | `Segue o` | 166,7 | @eumagnoleite em verde; ding | fim |

## 5. Câmera (sempre num sentido só)
| cena | tempo | câmera | pílula |
|---|---|---|---|
| mapa | 0 → 11,0 | Kit Mapas | BELMONTE · ARRECADAÇÃO |
| total | 11,0 → 21,5 | começa na escadaria dos anos, atrás do cofre; arco lento da torre de 2018 para a de 2026 | 2018 A 2026 |
| de onde vem | 21,5 → 39,4 | sobe para a vista de cima da mesa inteira, com as 4 fontes visíveis | DE ONDE VEM |
| união | 39,4 → 65,6 | desce na União (10 h); passa pelas três duplas de torres, da esquerda para a direita | UNIÃO |
| estado | 65,6 → 74,5 | continua o giro horário até o Estado (4 h). O Fundeb (1 h) fica no caminho, e a câmera passa por ele sem parar | ESTADO |
| bairro e tributos | 74,5 → 129,3 | continua o giro até o bairro (7 h); desce na praça das 8 torres; depois passeia pelas casinhas em sentido horário | IMPOSTOS DO MUNICÍPIO / IMPOSTO POR IMPOSTO |
| iptu | 129,3 → 147,8 | a casa do IPTU é a última do bairro; avanço lento até a torre | O IPTU |
| 100 reais | 147,8 → 159,3 | sobe para a vista de cima; acompanha as moedas indo para cada fonte | DE CADA R$ 100 |
| pergunta | 159,3 → 170,0 | aproxima do cofre e segue a trilha que some no escuro | A PERGUNTA |

## 6. Selos de fonte (discretos, um por bloco)
- 2018 a 2025: "Fonte: Anexo 10 (receita arrecadada) enviado ao TCM-BA"
- 2026: "Fonte: SIGA de setembro/2026 (PCMGE016), TCM-BA"
- FPM e ICMS: "Valor já sem a parte que vai para formar o Fundeb, como no Anexo 10"
- Rodapé fixo ★: "Valores do documento, sem correção pela inflação"

## 7. Sons
- whoosh na troca de cena;
- tique na pílula;
- pop quando as pilhas entram no cofre e quando cada torre termina;
- subida na torre de 15,4 mi;
- baque no "era zero";
- ding no fim.
- Sem trilha, igual à série.

## 8. Arquivos
- `src/videos/arrecadacaobelmonte/` a partir de `orcamentoparatinga/`. Ficam o cofre, PilhasDinheiro, torreFina, a curva (com o sentido trocado: da fonte para o cofre) e as plaquinhas por ano.
- Peças novas:
  - `PredioFonte`: prédio genérico de colunas, com placa trocável (União, Estado, Fundeb);
  - `Oficina`, `CasaVendeSe`, `PredioFolha`, `BalcaoTaxa`, `PosteLuz`, `CasaIPTU`;
  - `TrilhaMoedas`: caminho da fonte até o cofre;
  - `FilaCemMoedas`;
  - `Calendarios`.
- `src/Root.tsx`: acrescentar `ArrecadacaoBelmonte`, `ArrecadacaoBelmonteGuia`, `ArrecadacaoBelmonteLimpo` e `CapaArrecadacaoBelmonte`. Só acrescentar, sem reescrever o arquivo.
- Kit Mapas: `~/Kit-Mapas-Animados/src/videos/arrecadacao-belmonte/` (IBGE 2903409) → `projetos/048.../mapas/belmonte-arrecadacao.mp4`.
- Capa aprovada: "Arrecadou / o dobro. / Para onde / foi?". Fundo: a escadaria dos anos com as torres de 2018 e 2025 acesas.
- 5128 quadros. Render só com a trava `_render.lock` livre; conferir o disco (`df -h ~`) antes.

## 9. Origem das escolhas
- Das regras: cofre, pilhas e torres por ano, plaquinhas pequenas presas aos objetos, câmera num sentido só, só valores, sem nome de gestor, marca d'água quicando, Kit Mapas na abertura, selos de fonte e todo número com fonte (molde Paratinga, `_aprendizados.md`). O IPTU separado em dívida ativa e IPTU do ano vem da regra anti fake news.
- Escolhas minhas como diretor: o dinheiro entrando no cofre em vez de sair, a escadaria dos anos, o bairro com uma casinha por tributo, a escala própria do bairro, as 100 moedas e a trilha que some no escuro puxando o próximo vídeo.
