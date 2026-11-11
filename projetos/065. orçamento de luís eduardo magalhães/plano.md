# Plano de cenas: 065. orçamento de Luís Eduardo Magalhães

- Código: `orcamentolem` · Componentes: `OrcamentoLem`, `OrcamentoLemGuia`, `OrcamentoLemLimpo`, `CapaOrcamentoLem`.
- Molde: 035 Paratinga, pelo código do 063 Lauro de Freitas (mesma escala de cidade grande). Aprovado no modo autônomo (coordenação, item 5 e 17).
- Narração: Google Chirp 3 HD Algenib, 17 partes, speakingRate 1,3, pausas 0,28 s, atempo 1,163, -15,6 LUFS → 174,37 s. AUDIO_SEG = 174.37; QUADROS = 5258.
- Escala: 1 moeda = R$ 2 mi, 1 pilha = R$ 20 mi (anel de 93 lugares; cada ano usa 43 a 55 pilhas). Achados no miolo: 1 pilha = R$ 4 mi. Cores: dourado 2024, verde 2025, rosa 2026; previsto em branco-fantasma; assistência social em verde-grama.

## Mundo (mapa da mesa, vista de cima, +z = frente)
- Centro: cofre (0, 0, 0) com o anel de pilhas do ano (raios 1,75 / 2,25 / 2,75). Torre da sobra/déficit na frente (0, 0, 4,1).
- Borda (raio 7,45), na ordem da fala, ângulos 0,11π + i·0,18π: Educação (escola), Saúde (posto), Administração (prefeitura), Obras e serviços urbanos (rua com caminhão e gari), Câmara, Dívidas e juros (banco), Cultura e festas (palco), Assistência social, Esporte (campo), Meio ambiente (casinha). Torres por ano ao lado de cada casinha.
- Miolo (depois do "Agora repara", quando o cofre e o anel somem): gaveta EMPRÉSTIMOS (−2, 0, 0,2) com 3 torres 3×3 (95,7 · 44 · 80); gaveta PARCELAS E JUROS (2, 0, 0,2) com 3 torres (35,1 · 64 · 62,8) e a torre da assistência 2026 (16) em (4,25, 0, 0,2) no "quase quatro vezes"; gaveta 2026 · ATÉ SET (0, 0, 1,9) com previsto das festas (15,96, fantasma), gasto (21,3, rosa) e assistência (16, verde). Fundo: Tribunal (0, 0, −2,6) com duas pastas (−2,4 / 2,4, 0, −1,3).

## Mapa das palavras-chave (tempo do palavras.ts)
| Palavra (`quando`) | s | Objeto / evento | Cena |
|---|---|---|---|
| "Luís Eduardo Magalhães" (0) | 0,0 | Kit Mapas: Brasil → LEM; selo do @ (0,15 a 4,4 s) | mapa |
| "quase 220" | 3,16 | tag "DESDE 2024: R$ 219,7 MI EMPRESTADOS" + baque ★ | mapa |
| "Eu abri" / "Tribunal" | 5,8 / 7,48 | tags PREFEITURA e TCM-BA | mapa |
| "Em 12 anos" / "60" / "108" | 8,36 / 10,56 / 11,24 | selo IBGE; tags Censo 2010 e 2022; "maior crescimento da Bahia" ★ | mapa |
| "2024" / "arrecadou 922" | 13,44 / 15,04 | tag 2024; "R$ 922,7 MI" | mapa |
| "Gastou 918" | 17,22 | entra o 3D: cofre e pilha dourada | 2024 |
| "Sobrou 4" | 19,46 | torre-fantasma e plaquinha SOBROU | 2024 |
| setores 2024 (10) | 21,0 a 44,3 | pilhas voam para cada casinha; plaquinha | 2024 |
| "2025 Arrecadou" / "Gastou 1 bilhão e 18" | 46,0 / 49,6 | pilha verde | 2025 |
| "Foram 39" / "O próprio balanço" | 51,4 / 53,7 | torre vermelha; chip DÉFICIT | 2025 |
| setores 2025 (10) | 55,5 a 76,8 | idem, com as plaquinhas de 2024 | 2025 |
| "2026 até setembro" / "Arrecadou 786" / "Desse total 80" | 79,2 / 80,9 / 83,9 | chips; baque | 2026 |
| "Gastou 798" / "mais do que arrecadou" | 86,3 / 88,1 | pilha rosa; torre vermelha (sem número) | 2026 |
| "E já empenhou" / "Uma parte é folha" | 89,6 / 94,3 | chips | 2026 |
| setores 2026 (10) | 96,0 a 115,9 | idem | 2026 |
| "Agora repara" / "Em 2024 entraram" / "Em 2025" / "Em 2026" | 117,8 / 119,5 / 123,1 / 126,3 | gaveta EMPRÉSTIMOS, torres crescem uma a uma | empréstimos |
| "As contas não dizem" | 129,2 | chip "não diz o banco" | empréstimos |
| "Quase todo esse dinheiro" | 130,8 | câmera na casinha de Obras (acende) com as plaquinhas dos 3 anos | obras |
| "E a dívida tem preço" / "Parcelas e juros" / "64" / "só até setembro 62" | 135,0 / 136,2 / 139,3 / 142,3 | gaveta PARCELAS; torres; impacto ★ | parcelas |
| "Quase quatro vezes" | 144,6 | torre verde da assistência ao lado | parcelas |
| "A conta das festas" / "com quase 16" / "já gastou 21" / "Mais que toda" | 147,9 / 149,5 / 152,1 / 153,8 | gaveta 2026: previsto, gasto, assistência | festas |
| "No Tribunal" / "improcedente" / "E as contratações" / "Ainda sem julgamento" | 156,6 / 160,0 / 161,1 / 164,6 | Tribunal; pasta EVENTOS 2024 (carimbo IMPROCEDENTE); pasta ARRAIÁ 2026 (EM ANÁLISE) ★ | tribunal |
| "Crescer custa caro" / "Mas se a dívida" / "a festa precisa" / "Segue o" | 165,7 / 167,6 / 169,8 / 171,9 | mesa; parcelas voltam; festas voltam; @ | pergunta |

## Câmera (enquadramento automático; distância só referência)
- Mapa: Kit Mapas, Brasil → cidade (4,8 s) e aproximação lenta.
- Cofre de cada ano: de E([0,0,0,8], 11×8,4, dir [0,1,3,1]) para COFRE (alvo [0,0,4,1,3], 9,6×7,6, dir [dx,1,2,1]).
- Setores: OLHA_SETOR(i) de dentro da mesa, dir y 0,95, segura 0,55 s em cada casinha, sempre no mesmo sentido; na virada de ano sobe (DE_CIMA, dir y 2,0) e recomeça.
- Achados no miolo: PM (dir y 2,1; festas 1,6), largura 4 a 6 m; casinha de Obras com OLHA_SETOR perto 1,35.
- Tribunal: alvo no prédio, 6,2 → 7,6 m, dir y 1,2. Fim: mesa inteira 13,5 m.

## O que veio das regras e o que é escolha
- Regras: ordem dos setores, uma cor por ano, plaquinhas em todos os setores e dos anos anteriores, torre vermelha "a mais", só total arrecadado, sem porcentagem, sem nome de gestor, sem segurança pública, selo do @ (opção B), marca d'água quicando, selos de fonte.
- Escolhas do diretor (★): tags do gancho e do censo no mapa; obras acendem quando a voz diz para onde foi o empréstimo; torre da assistência ao lado das parcelas; duas pastas no Tribunal com carimbos que mudam com a fala; sons de impacto nas revelações.

## Sons
whoosh nas viradas de cena, tique nas trocas da pílula, pop em cada setor e número, subida no "gastou" de cada ano, baque no déficit, no "mais do que arrecadou", no empréstimo de 2026 e no "quase quatro vezes", impacto nas parcelas de 2026 e no "mais que toda a assistência", ding no "Segue".

## Arquivos
- Novos: `src/videos/orcamentolem/OrcamentoLem.tsx`, `palavras.ts`; Kit Mapas `~/Kit-Mapas-Animados/src/videos/orcamento-lem/` (roteiro.ts, index.tsx, dados/), `scripts/dados-orcamento-lem.py`, satélite `public/satelite/orcamento-lem` (cópia do de Bom Jesus da Lapa + tiles novos).
- Alterados (só acrescentado): `src/Root.tsx` (Estúdio e Kit Mapas).
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas` (BaseGaveta, PastaProcesso), `comum/SeloArroba`.
