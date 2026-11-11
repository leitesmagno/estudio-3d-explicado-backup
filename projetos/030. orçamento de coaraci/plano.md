# Plano de cenas: 030. orçamento de coaraci (versão 1, para aprovação)

Código `orcamentocoaraci` · Nome `OrcamentoCoaraci` · Perfil @eumagnoleite · série Magno Explica.
Mesma linha da série de orçamentos (014, 017, 021, 022 a 027): **Kit Mapas** na abertura e no "de onde vem" + **Estúdio 3D** com a maquete redonda, o cofre no meio e as pilhas de dinheiro. Código base: o 027 (Feira de Santana).

## 1. Narração
- `audio/narracao-norm.wav`: 134,80 s (gravação de 175,3 s acelerada 1,3x, pausas encurtadas) · `AUDIO_SEG = 134.8` · `QUADROS = 4071`.
- 397 palavras, iguais ao roteiro. Última ("direitos.") termina em 134,58 s.
- `quando()` tira vírgula e %: números com vírgula chamados pela palavra de antes (`'estava em'`, `'2025 em'`, `'chegou a'`, `'ate 54'`).

## 2. Ideia e mundo
- **Escala: 1 pilha = R$ 1 milhão** (o gasto de 2025, 91,6 mi, vira cerca de 92 pilhas no anel em volta do cofre). Placar fixo "1 PILHA = R$ 1 MILHÃO".
- Cidade pequena: casinhas e árvores na mesa redonda, sem torres de cidade grande.
- Fase 1 ("para onde vai"): as pilhas voam do anel para cada área, na palavra do número.
- Fase 2 ("a parte que quase ninguém vê"): o dinheiro todo volta ao anel; salários acendem (57 pilhas); obras (2,8), dívida (4,1) e condenações na Justiça (4,0) voam.
- Depois: o posto de combustível de 2024, a comparação de 2026 (receita igual × despesa maior) e a régua do teto (49,8 → 50,6 → 57,1, passando da faixa de 54%).
- **2024 aparece como fantasma**: pilhas transparentes ao lado das de 2025 quando a fala compara (saúde 29, administração 9, urbanismo 8, obras 4,5).

## 3. Trechos de mapa (Kit Mapas, composição `OrcamentoCoaraci`, 0 a 31,6 s)
| trecho | de / até | o que acontece |
|---|---|---|
| A · COARACI | 0 → 11,2 s | voo do Brasil até Coaraci (satélite); contorno do município acende em verde; "R$ 91,6 MILHÕES" digitado + "GASTOS DE 2025"; seta e nome "COARACI"; tag "PREFEITURA DE COARACI" no "abri os relatórios" (4,8 s) |
| B · DE ONDE VEM | 11,2 → 31,6 s | "R$ 98 MI ARRECADADOS EM 2025" (15,4 s); "IMPOSTOS DA CIDADE: 5 DE CADA 100 REAIS" (17,2 s); contorno da Bahia; setas douradas de **Brasília** (23,4 s) e **Salvador** (24,2 s); "UNIÃO · FPM R$ 42,9 MI" (27,2 s); "MAIS DE 8 VEZES OS IMPOSTOS DA CIDADE" (29,3 s) |

O mergulho de satélite já gravado (`mapas/mapa_coaraci.mp4`) fica como reserva; o trecho oficial sai do Kit Mapas, igual aos outros vídeos.

## 4. Pílula (estados) e cenas
COARACI 2024 → 2026 · DE ONDE VEM · PARA ONDE VAI · EDUCAÇÃO E SAÚDE · ADMINISTRAÇÃO × URBANISMO · CULTURA E TRANSPORTE · SEGURANÇA × CÂMARA · SALÁRIOS × OBRAS · O COMBUSTÍVEL · 2026 · O TETO · E VOCÊ?

## 5. Palavras-chave (tabela de eventos)
| palavra (`quando`) | tempo | objeto | o que acontece | cena |
|---|---|---|---|---|
| `gastou 91` | 0,4 | mapa | voo começa; "R$ 91,6 MILHÕES" | mapa A |
| `abri os relatorios` | 4,8 | mapa | tag PREFEITURA DE COARACI | mapa A |
| `Primeiro` | 11,4 | mapa | pílula DE ONDE VEM | mapa B |
| `arrecadou 98` | 15,0 | mapa | R$ 98 MI | mapa B |
| `5 de cada 100` | 17,2 | mapa | município acende; tag 5 DE CADA 100 | mapa B |
| `Brasilia` / `Salvador` | 23,4 / 24,2 | mapa | setas de ouro | mapa B |
| `42 milhoes` | 27,2 | mapa | UNIÃO · FPM R$ 42,9 MI | mapa B |
| `Mais de 8` | 29,3 | mapa | MAIS DE 8 VEZES… | mapa B |
| `para onde vai` | 31,9 | cofre | cofre sobe e abre; 92 pilhas nascem no anel | maquete |
| `32 milhoes` | 33,9 | escola | 32 pilhas voam para a escola; rótulo 32 MI | educação e saúde |
| `com 27` | 35,9 | posto de saúde | 27 pilhas voam; rótulo 27 MI | educação e saúde |
| `tinha 29` | 38,4 | saúde | 29 pilhas fantasma (2024) ao lado | educação e saúde |
| `Caiu 2` | 38,8 | saúde | chip CAIU 2 MILHÕES; baque | educação e saúde |
| `A administracao` | 40,4 | prefeitura | prédio sobe; 9 fantasmas (2024) | adm × urbanismo |
| `para 13` | 42,9 | prefeitura | 13 pilhas voam; chip +46% | adm × urbanismo |
| `o urbanismo` | 44,1 | rua | rua com caminhão de limpeza; 8 fantasmas (2024) | adm × urbanismo |
| `para 3` | 47,1 | rua | 3 pilhas; rótulo 2024: 8 MI → 3 MI | adm × urbanismo |
| `A cultura` | 47,9 | palco cultural | 1,1 pilha | cultura e transporte |
| `O transporte` | 50,0 | ônibus | 0,2 pilha; ônibus passa | cultura e transporte |
| `Agora repara` | 51,9 | posto da guarda | posto sobe **vazio**; chip SEM VERBA PRÓPRIA | segurança × câmara |
| `guarda municipal` | 55,5 | posto | chip PAGA PELA ADMINISTRAÇÃO | segurança × câmara |
| `a Camara de Vereadores` | 57,9 | câmara | 3,3 pilhas voam | segurança × câmara |
| `Mais de 6` | 61,0 | IPTU | meia pilha do IPTU ao lado; chip MAIS DE 6 VEZES O IPTU | segurança × câmara |
| `E tem a parte` | 63,4 | anel | dinheiro todo de volta ao anel (91,6) | salários × obras |
| `56 milhoes` | 67,7 | anel | 57 pilhas acendem; rótulo 56,8 MI | salários × obras |
| `62 de cada` | 69,8 | 2D | chip 62 DE CADA 100 REAIS | salários × obras |
| `temporarios` | 72,2 | 2D | cartão 1,6 MI → 6 MI | salários × obras |
| `Ja obras` | 75,7 | obra | 2,8 pilhas voam para a obra; 4,5 fantasmas (2024) | salários × obras |
| `A divida` | 79,0 | banco | 4,1 pilhas | salários × obras |
| `condenacoes` | 81,1 | martelo | 4 pilhas; martelo bate | salários × obras |
| `Cada uma` | 83,1 | 2D | chip CADA UMA, MAIS QUE TODAS AS OBRAS | salários × obras |
| `um unico fornecedor` | 86,5 | posto de combustível | posto sobe; 5,6 pilhas; ao lado, obras 2024 (4,5) | o combustível |
| `Mais do que tudo` | 90,5 | 2D | chip MAIS QUE TODAS AS OBRAS DE 2024 | o combustível |
| `E agora 2026` | 93,4 | duas colunas | colunas RECEITA e DESPESA (jan–ago) | 2026 |
| `ficou igual` | 96,9 | receita | 66,4 → 66,6 (igual) | 2026 |
| `subiu 21` | 99,0 | despesa | 55,4 → 66,9; chip +21% | 2026 |
| `A lei deixa` | 100,3 | régua | régua sobe; faixa de 54% | o teto |
| `estava em` | 106,6 | régua | líquido até 49,8% | o teto |
| `2025 em` | 110,5 | régua | 50,6% | o teto |
| `chegou a` | 114,2 | régua | 57,1%: passa da faixa; parte acima fica vermelha; cartão grande 57,1% | o teto |
| `abril de 2027` | 118,5 | 2D | cartão PRAZO: ABRIL DE 2027 | o teto |
| `a lei proibe` | 121,7 | 2D | SEM AUMENTO, CARGO NOVO OU CONTRATAÇÃO (COM EXCEÇÕES) | o teto |
| `Em qual area` | 125,8 | 2D | QUAL ÁREA PRECISA DE MAIS? COMENTA AQUI | e você? |
| `E segue` | 129,7 | 2D | @eumagnoleite | e você? |

## 6. Câmera (resumo)
Abertura da maquete inteira de cima (3/4) → close em cada área na hora da fala, com leve arco → volta ao anel na "parte que quase ninguém vê" → posto de combustível → colunas de 2026 → régua bem de perto → mesa inteira no fim. Mesmo jeito do 027.

## 7. Selos de fonte (um por bloco)
DCA 2025 · SICONFI (gasto, áreas, pessoal, obras, dívida, condenações) · DCA 2024 (comparações) · SIOPE 2025 (dedução do Fundeb, receita de 98 mi) · Ordem cronológica de pagamentos 2024 · Portal da Transparência (combustível) · RREO ago/2025 e ago/2026 (2026) · RGF 2024, 2025 e ago/2026 + LRF arts. 20, 22 e 23 (teto).

## 8. Sons
whoosh nas trocas, tique na pílula, pop nos números, baque no "caiu", no "sem verba própria", no "cada uma" e no 57,1%, ding no fim. Sem trilha (igual à série).

## 9. ★ Extras do diretor
- ★ **Marca d'água @eumagnoleite em movimento** (pedido da pessoa): bem transparente, quicando devagar pela tela inteira durante todo o vídeo, para não dar para cortar.
- ★ Pilhas fantasma de 2024 ao lado das de 2025 (mostra a comparação sem precisar de gráfico).

## 10. Arquivos
- Novos: `src/videos/orcamentocoaraci/OrcamentoCoaraci.tsx` (a partir do 027), registro em `src/Root.tsx`; Kit Mapas: `src/videos/orcamento-coaraci/` e `scripts/dados-orcamento-coaraci.py`; mapa em `projetos/030.../mapas/coaraci.mp4`.
- Reaproveitados: peças de `orcamentoitabuna/pecas` (cofre, pilhas, escola, posto de saúde, prefeitura, câmara, posto da guarda, banco, régua), `Posto` (gasolina.tsx), `Martelo` (candidato.tsx), `Onibus`.
