# Plano de cenas · 086. orçamento de Gandu (molde Ubaitaba 092)

Aprovado no MODO AUTÔNOMO (regra 17 e brief `_brief-molde-ubaitaba.md`), 09/11/2026. Voz: 178,51 s (491 palavras, última em 178,14 s). Código: `src/videos/orcamentogandu/OrcamentoGandu.tsx`.

## Ideia (igual ao molde)
- Abertura com o Kit Mapas (`~/Kit-Mapas-Animados/src/videos/orcamento-gandu`, satélite copiado do 070): voo do Brasil até Gandu, as três receitas (R$ 220,1 MI · 2024, R$ 231,1 MI · 2025, R$ 183,1 MI · 2026 até agosto), "PREFEITURA DE GANDU", "TCM-BA"; trecho B na cidade: "2024", "R$ 220,1 MI · ARRECADOU EM 2024" e, novo, "R$ 10 MI DISSO: EMPRÉSTIMO". Fica até "Gastou 231" (18,1 s).
- Maquete redonda: cofre no meio; em cada ano, a pilha do ano em volta do cofre na palavra "gastou" (dourado 2024, verde 2025, rosa 2026); a cada setor falado as pilhas voam para a casinha do setor, na ordem da fala, câmera andando num sentido só. **1 pilha = R$ 4 mi** (Gandu gasta cerca de 230 mi por ano; 2024 usa 64 pilhas dos 134 lugares).
- Torre vermelha "A MAIS" na frente do cofre: 2024 R$ 11,6 mi; 2025 R$ 6,1 mi; 2026 "COMPROMETIDOS A MAIS" R$ 52,6 mi (empenhado 235,7 menos arrecadado 183,1).
- CabecalhoCidade "GANDU" (selo do @ grande na abertura, viaja para o cabeçalho, volta no "Segue o"). Marca d'água quicando. Legenda na base.
- Folhas "PDF" (regras 28b, 29, 42, 42b, 45, 47, 48) aplicadas depois do render com `tools/lista_pdf/lista_pdf.py aplicar`: 3 de receita + 33 por setor; faixa de pessoal e diárias; Câmara com duodécimo recebido (razão da Câmara). Canto reservado: lado oposto ao setor falado, y ≥ 600.

## Setores (11 casinhas, na ordem da fala; por SECRETARIA, função 28 em Dívidas e devoluções, esporte = função 27)
| # | Casinha | Peça | 2024 | 2025 | 2026 até ago |
|---|---|---|---|---|---|
| 1 | EDUCAÇÃO | Escola | 92,76 | 120,45 | 74,32 |
| 2 | SAÚDE | PostoSaude | 43,24 | 40,49 | 34,76 |
| 3 | ADMINISTRAÇÃO | Prefeitura | 15,50 | 19,41 | 10,59 |
| 4 | OBRAS, LIMPEZA E ILUMINAÇÃO | RuaServicos | 46,57 | 24,45 | 22,51 |
| 5 | CÂMARA DE VEREADORES | CamaraVereadores | 4,37 | 5,56 | 4,41 |
| 6 | DÍVIDAS E DEVOLUÇÕES | BancoDivida | 14,20 | 13,11 | 7,12 |
| 7 | CULTURA E EVENTOS | PredioTexto palco | 6,30 | 5,26 | 5,18 |
| 8 | ASSISTÊNCIA SOCIAL | PredioAssistencia | 5,76 | 5,34 | 3,32 |
| 9 | MEIO AMBIENTE E EMPREGO | árvores | 1,01 | 1,09 | 0,49 |
| 10 | ESPORTE | PredioTexto quadra | 0,37 | 0,27 | 0,49 |
| 11 | AGRICULTURA | PredioTexto trator | 1,64 | 1,79 | 1,03 |
(R$ milhões, liquidado; exatos no fontes.md. Soma de cada ano = total liquidado, diferença 0,00.)

## Palavras-chave (quando) e eventos
| Palavra | Tempo | O que acontece | Cena |
|---|---|---|---|
| Gastou 231 | 18,10 | sai o mapa; cofre sobe; pilha dourada nasce | 2024 cofre |
| 11 milhoes e 600 | 20,44 | torre vermelha 11,6 MI A MAIS | 2024 cofre |
| Educacao (1) … Agricultura (1) | 22,4–46 | pilhas voam para cada casinha; plaquinha do valor | 2024 setores |
| 2025 Arrecadou / Gastou 237 / De novo | 46,7–52 | sobe; pilha verde; torre 6,1 MI A MAIS | 2025 cofre |
| Educacao (2) … Agricultura (2) | 54–76 | voos; plaquinhas 2024 + 2025 em cada casinha | 2025 setores |
| 2026 ate agosto / Ja gastou 164 / ja comprometeu | 77–87 | pilha rosa; torre vermelha 52,6 MI COMPROMETIDOS A MAIS | 2026 cofre |
| Educacao (3) … Agricultura (3) | 87,7–110 | voos; plaquinhas dos três anos | 2026 setores |
| Agora repara | 110,5 | dinheiro some; gaveta da esquerda "EVENTOS x O PREVISTO" | eventos |
| levaram 5 milhoes / 4 milhoes e 500 | 112–115 | torres dourada (5,4) e verde (4,5) | eventos |
| O previsto era | 116 | torres brancas (previsto 2,0 e 2,1) ao lado de cada uma | eventos |
| ja foram 4 / a reserva subiu | 120–123 | torre rosa 4,2 e branca da reserva 7,8 | eventos |
| Em 2025 as acoes | 124 | gaveta da direita "O QUE FICOU PEQUENO · 2025" | 2025 |
| produtor rural / O esporte 266 | 125–128 | torres verdes 261 mil e 266 mil | 2025 |
| A fiscalizacao ambiental / gastou zero | 130–132 | torre branca 134 mil, plaquinha R$ 0 | 2025 |
| A secretaria gastou | 133,5 | torre verde 1,1 mi | 2025 |
| E tem a divida | 138,3 | gaveta de trás "DÍVIDA PARCELADA"; torres vermelhas 77,6 (fim 2023) e 107,7 (fim 2025) | dívida |
| o parcelamento com o INSS | 148 | torres 50,7 e 69,2 do INSS | dívida |
| E os salarios e encargos | 153,7 | plaquinha R$ 99,6 MI · SALÁRIOS E ENCARGOS 2025 | dívida |
| No Tribunal de Contas | 158 | prédio do TCM e 3 pastas (São João 2026, acumulação de vínculos, piso dos professores) | tribunal |
| Gastar nao / por que os eventos / e o produtor rural | 165–176 | mesa inteira; eventos e produtor rural de novo | pergunta |
| Segue o | 176,0 | selo do @ volta ao centro; plaquinhas da pergunta somem | final |

## Câmera (enquadramento automático da base; distâncias só referência)
- 2024/2025/2026: vista do cofre (alvo [0,0.4,1.3], 9,6 × 7,6, elev. 1,2) → casinha em casinha (OLHA_SETOR, sempre no mesmo sentido, segura 0,55 s) → sobe (DE_CIMA) na virada do ano.
- Eventos: gaveta da esquerda, da esquerda para a direita (2024 → 2025 → 2026). 2025: gaveta da direita, da esquerda para a direita. Dívida: gaveta de trás, de frente, depois INSS. Tribunal: pastas da esquerda para a direita. Pergunta: mesa inteira, eventos, produtor rural; no "Segue o" abre.

## Sons
whoosh em cada troca de cena; pop em cada setor e valor; subida no "gastou"; baque nas torres vermelhas, no "gastou zero" e no INSS; tique nos carimbos; ding no "Segue o".

## Arquivos
- Novos: `src/videos/orcamentogandu/OrcamentoGandu.tsx`, `palavras.ts`; Kit Mapas `src/videos/orcamento-gandu/` + `scripts/dados-orcamento-gandu.py`.
- Alterados: `src/Root.tsx` (Estúdio, só depois do tsc ok, regra 54) e `src/Root.tsx` do Kit Mapas (acrescentada a linha).
- Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentoparatinga; `comum/CabecalhoCidade`.

★ Escolhas do diretor: etiqueta do empréstimo no mapa; gaveta da dívida com o INSS lado a lado (antes e depois).
