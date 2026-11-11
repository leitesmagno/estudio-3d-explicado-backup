# Plano de cenas: 032. orçamento de belmonte (versão 1, para aprovação)

Código `orcamentobelmonte` · Nome `OrcamentoBelmonte` · Perfil @eumagnoleite · série Magno Explica.
Mesma linha da série de orçamentos (014, 017, 021 a 027, 030): **Kit Mapas** na abertura e no "de onde vem" de 2024, e **Estúdio 3D** com a maquete redonda, o **cofre no meio** e as **pilhas de dinheiro em volta**. Cada área surge na maquete na hora em que é falada. Código base: o 030 (Coaraci).

## 1. Narração
- `audio/narracao-norm.wav`: 142,67 s (voz Roger, gerada pela pessoa; sem acelerar, só volume e silêncio das pontas) · `AUDIO_SEG = 142.67` · `QUADROS = 4307`.
- 280 palavras, iguais ao roteiro. A última ("informações.") termina em 141,9 s.
- Ajustes no `palavras.json` (original guardado): "R$ 1.500,00" virou "1.500 reais", "R$ 4" virou "4", "arroba Magnolate" virou "@eumagnoleite".
- Palavras repetidas (usar trecho único no `quando()`): "Entrou" (3×), "Saiu" (3×), "Da União" (3×), "Do Estado e do Fundeb" (3×), "Educação" (3×), "Saúde" (3×), "O destaque" (3×), "Segurança pública" (3×), "Tribunal" (3×). Números com vírgula chamados pela palavra de antes (`'Uniao 58'`, `'Fundeb 33'`, `'so 13'`).

## 2. Ideia e mundo
- **Escala: 1 pilha = R$ 1 milhão.** Placar fixo "1 PILHA = R$ 1 MILHÃO".
- **Cada ano, o anel muda de tamanho**: 2024 = 105 pilhas, 2025 = 126 pilhas, 2026 = 121 pilhas (comprometidas) sobre 111,5 que entraram.
- **De onde vem (2025 e 2026)**: as pilhas do anel ganham três cores na hora da fala: azul (União), roxo (Estado e Fundeb), dourado (o próprio município), na proporção certa. Em 2024 isso acontece no mapa.
- **Para onde foi**: as pilhas voam do anel para cada prédio da maquete na palavra do número.
- Prédios na mesa (sobem só na hora deles): escola (educação), posto de saúde, prefeitura (administração), Câmara de Vereadores, posto da guarda (segurança pública), rua com caminhão de limpeza (limpeza, ruas e obras), **palco de shows** (Secretaria de Turismo), **prédio do Tribunal de Contas** com letreiro "TCM-BA" na borda da mesa.
- Cidade pequena do litoral: casinhas, coqueiros e um rio na borda da mesa (Belmonte fica na foz do Jequitinhonha).

## 3. Trechos de mapa (Kit Mapas, composição `OrcamentoBelmonte`, 0 a 23,6 s)
| trecho | de / até | o que acontece |
|---|---|---|
| A · BELMONTE | 0 → 11,7 s | voo do Brasil até Belmonte, no litoral sul da Bahia (satélite); contorno do município acende em verde; seta e nome "BELMONTE" (etiqueta puxada para o lado da terra, regra do litoral); tag "TRIBUNAL DE CONTAS DOS MUNICÍPIOS" no "Tribunal de Contas" (6,1 s); tag "2024 · GESTÃO CARLOS GAMA" (8,5 s) |
| B · DE ONDE VEM (2024) | 11,7 → 23,6 s | "ENTROU R$ 104,5 MI" (12,7 s); seta dourada de **Brasília** com "UNIÃO R$ 58,7 MI" (15,1 s); contorno da Bahia e seta de **Salvador** com "ESTADO + FUNDEB R$ 32,4 MI" (18,0 s); município acende com "PRÓPRIO MUNICÍPIO: SÓ R$ 13,4 MI" (20,8 s) |

## 4. Pílula (estados) e cenas
BELMONTE 2024 → 2026 · DE ONDE VEM · 2024 · PARA ONDE FOI · 2025 · DE ONDE VEM · PARA ONDE FOI · 2026 · DE ONDE VEM · PARA ONDE FOI · O TURISMO · O TRIBUNAL · JUNHO · RESUMO · E VOCÊ?

## 5. Palavras-chave (tabela de eventos)
| palavra (`quando`) | tempo | objeto | o que acontece | cena |
|---|---|---|---|---|
| `Quanto Belmonte` | 0,0 | mapa | voo começa do Brasil inteiro | mapa A |
| `abri as contas` | 4,0 | mapa | tag PREFEITURA DE BELMONTE | mapa A |
| `Tribunal de Contas` | 6,1 | mapa | tag TRIBUNAL DE CONTAS DOS MUNICÍPIOS | mapa A |
| `2024 gestao` | 8,5 | mapa | tag 2024 · GESTÃO CARLOS GAMA; pílula 2024 | mapa A |
| `Entrou 104` | 11,7 | mapa | "R$ 104,5 MI" | mapa B |
| `Uniao 58` | 15,1 | mapa | seta de Brasília; UNIÃO R$ 58,7 MI | mapa B |
| `Estado e do Fundeb 32` | 18,0 | mapa | seta de Salvador; ESTADO + FUNDEB R$ 32,4 MI | mapa B |
| `proprio municipio` | 20,8 | mapa | município acende; SÓ R$ 13,4 MI | mapa B |
| `Saiu 105` | 23,6 | cofre | maquete aparece; cofre sobe e abre; 105 pilhas nascem no anel | 2024 para onde foi |
| `Educacao 45` | 26,4 | escola | escola sobe; 45 pilhas voam; rótulo R$ 44,9 MI | 2024 |
| `Saude 21` | 28,3 | posto de saúde | posto sobe; 21 pilhas voam; R$ 21,2 MI | 2024 |
| `destaque seguranca` | 30,2 | posto da guarda | posto sobe **vazio** | 2024 |
| `recebeu zero` | 32,7 | 2D | chip SEGURANÇA PÚBLICA: R$ 0; baque | 2024 |
| `2025 gestao` | 34,1 | anel | pilhas voltam ao anel; pílula 2025; tag GESTÃO IÊDO ELIAS | 2025 |
| `Entrou 125` | 37,3 | anel | anel cresce para 126 pilhas; R$ 125,8 MI | 2025 de onde vem |
| `Uniao 71` | 41,3 | anel | 72 pilhas ficam azuis; UNIÃO R$ 71,6 MI | 2025 de onde vem |
| `Fundeb 33` | 44,0 | anel | 34 ficam roxas; ESTADO + FUNDEB R$ 33,7 MI | 2025 de onde vem |
| `municipio 20` | 47,5 | anel | 20 ficam douradas; MUNICÍPIO R$ 20,5 MI | 2025 de onde vem |
| `Saiu 126` | 49,3 | anel | cores voltam ao neutro; R$ 126,4 MI | 2025 para onde foi |
| `Educacao 52` | 52,3 | escola | 52 pilhas; R$ 52,1 MI | 2025 |
| `Saude 25` | 54,3 | posto de saúde | 25 pilhas; R$ 25,2 MI | 2025 |
| `a administracao` | 57,3 | prefeitura | prefeitura sobe; 6,7 pilhas fantasma (2024) | 2025 |
| `quase 11` | 59,1 | prefeitura | 11 pilhas voam; R$ 10,9 MI | 2025 |
| `60%` | 60,3 | 2D | chip +60% (2024 → 2025) | 2025 |
| `2026 ate` | 63,3 | anel | pílula 2026 · ATÉ SETEMBRO | 2026 |
| `Entrou 111` | 65,6 | anel | anel com 111,5 pilhas; R$ 111,5 MI | 2026 de onde vem |
| `Uniao 69` | 68,6 | anel | azuis; UNIÃO R$ 69,1 MI | 2026 de onde vem |
| `Fundeb 27` | 70,4 | anel | roxas; ESTADO + FUNDEB R$ 27,1 MI | 2026 de onde vem |
| `municipio 15` | 73,0 | anel | douradas; MUNICÍPIO R$ 15,3 MI | 2026 de onde vem |
| `ja comprometeu` | 76,3 | anel | +10 pilhas nascem em vermelho fora do anel; R$ 121,3 MI | 2026 para onde foi |
| `10 a mais` | 79,0 | 2D | chip R$ 10 MI A MAIS DO QUE ENTROU; baque | 2026 |
| `Educacao 53` | 80,3 | escola | 53 pilhas; R$ 53 MI | 2026 |
| `Saude 25` (2ª) | 82,0 | posto de saúde | 25 pilhas; R$ 25 MI | 2026 |
| `Limpeza ruas` | 84,0 | rua | rua sobe com caminhão de limpeza; 13 pilhas; R$ 13,1 MI | 2026 |
| `Camara quase` | 86,7 | Câmara | Câmara sobe; 5 pilhas; R$ 4,9 MI | 2026 |
| `Secretaria de Turismo` | 90,1 | palco | palco de shows sobe (luz acende devagar, sem piscar) | o turismo |
| `com 700` | 92,3 | palco | 0,7 pilha transparente; ORÇAMENTO INICIAL R$ 715 MIL | o turismo |
| `gastou 4` | 93,8 | palco | 4,8 pilhas voam; R$ 4,8 MI; som de subida | o turismo |
| `Mais da metade foi` | 96,3 | 2D | chip 57%: BANDAS E PRODUTORAS SEM LICITAÇÃO | o turismo |
| `Seguranca publica recebeu 137` | 100,9 | posto da guarda | um pedacinho de pilha; R$ 137 MIL | o turismo |
| `E o Tribunal` | 104,3 | Tribunal | prédio TCM-BA sobe na borda da mesa | o tribunal |
| `Multou` | 106,1 | martelo | martelo bate; carimbo MULTA R$ 1.500 na prefeitura; baque | o tribunal |
| `material grafico` | 111,3 | 2D | cartão: material gráfico sem entrega comprovada · contratação de R$ 3,9 mi | o tribunal |
| `Advertiu` | 115,2 | 2D | carimbo ADVERTÊNCIA: CONTAS FORA DO PRAZO | o tribunal |
| `limpeza emergencial` | 119,7 | rua | chip EM ANÁLISE na rua | o tribunal |
| `transporte escolar` | 121,1 | ônibus | ônibus escolar passa; chip EM ANÁLISE | o tribunal |
| `sem julgamento` | 122,7 | 2D | SEM JULGAMENTO | o tribunal |
| `Em junho` | 124,0 | papel | folha grande "LISTA DE PAGAMENTOS · JUNHO" sai da prefeitura | junho |
| `resumo bancario` | 127,7 | papel | folha vira; carimbo É UM RESUMO BANCÁRIO | junho |
| `Resumo` | 130,7 | maquete | câmera abre na mesa inteira | resumo |
| `vem da Uniao` | 133,1 | anel | pilhas da União acendem em azul (mais da metade) | resumo |
| `quase 5 milhoes para show` | 135,9 | palco × guarda | 4,8 pilhas do palco ao lado do pedacinho da guarda | resumo |
| `nada para seguranca` | 138,2 | 2D | "?" grande | resumo |
| `Segue o` | 139,6 | 2D | @eumagnoleite em verde | e você? |

## 6. Câmera (resumo)
Mesa inteira de cima (3/4) na entrada do 3D → close em cada prédio na hora da fala, com leve arco → volta ao anel em cada "Entrou" e "de onde vem" (vista de cima, 44°, para ver as três cores) → palco de shows de perto → Tribunal na borda → folha de junho bem de perto → mesa inteira no resumo. Igual ao 030.

## 7. Selos de fonte (um por bloco, discretos)
- 2024: "Fonte: Balanço 2024 enviado ao TCM-BA (proc. 13610e25)"
- 2025: "Fonte: Balanço 2025 enviado ao TCM-BA (proc. 09982e26)"
- 2026: "Fonte: Demonstrativos SIGA de set/2026, TCM-BA"
- Turismo: "Fonte: Relação de pagamentos (PCMGE056) e contratos por inexigibilidade, TCM-BA"
- Tribunal: "Fonte: TCM-BA, acórdãos 32484e25 e 10859e25; denúncias 08808e26 e 15247e26"
- Junho: "Fonte: e-TCM, competência 06/2026, pasta PCMGE056"

## 8. Sons
whoosh nas trocas, tique na pílula, pop nos números, baque no "zero", no "10 a mais", na multa e no "resumo bancário", subida no gasto do turismo, ding no fim. Sem trilha (igual à série).

## 9. ★ Extras do diretor
- ★ Marca d'água @eumagnoleite pequena e leve quicando pela tela inteira o vídeo todo (pedido da pessoa).
- ★ Pilhas fantasma de 2024 ao lado da prefeitura de 2025 (mostra o +60% sem gráfico).
- ★ As 10 pilhas a mais de 2026 nascem fora do anel, em vermelho: mostra "gastou mais do que entrou" na própria maquete.

## 10. Arquivos
- Novos: `src/videos/orcamentobelmonte/OrcamentoBelmonte.tsx` (a partir do 030), registro em `src/Root.tsx`; Kit Mapas: `src/videos/orcamento-belmonte/` e dados; mapa em `projetos/032.../mapas/belmonte.mp4`.
- Reaproveitados: peças de `orcamentoitabuna/pecas` (mesa, cofre, pilhas, escola, posto de saúde, prefeitura, câmara, posto da guarda, rua de serviços), `Martelo`, `Onibus`. A checar no catálogo: palco de shows e prédio do Tribunal (se não houver, monto com as primitivas da base).
