# Plano de cenas · 072. orçamento de Mata de São João (molde Ubaitaba 092 / Gandu 086)

Aprovado no MODO AUTÔNOMO (regra 17 e brief `_brief-molde-ubaitaba.md`), 09/11/2026. Voz: 178,18 s (497 palavras, última em 177,80 s). Código: `src/videos/orcamentomatadesaojoao/OrcamentoMataDeSaoJoao.tsx`.

## Ideia (igual ao molde)
- Abertura com o Kit Mapas (`~/Kit-Mapas-Animados/src/videos/orcamento-matadesaojoao`, satélite copiado do 063 Lauro de Freitas + `npm run tiles`): voo do Brasil até Mata de São João (IBGE 2921005 conferido na API), as três receitas (R$ 428 MI · 2024, R$ 487,5 MI · 2025, R$ 384,7 MI · 2026 até setembro), "PREFEITURA DE MATA DE SÃO JOÃO", "TCM-BA"; trecho B: "2024", "R$ 428 MI · ARRECADOU EM 2024". Fica até "Gastou 448" (19,5 s).
- Maquete redonda: cofre no meio; em cada ano, a pilha do ano em volta do cofre na palavra "gastou" (dourado 2024, verde 2025, rosa 2026); a cada setor falado as pilhas voam para a casinha do setor, na ordem da fala, câmera andando num sentido só. **1 pilha = R$ 10 mi** (cidade grande, ~450 mi por ano).
- Torre na frente do cofre: 2024 vermelha "R$ 20,1 MI A MAIS"; 2025 verde "R$ 23,7 MI SOBRARAM"; 2026 vermelha "R$ 109,4 MI COMPROMETIDOS A MAIS" (empenhado 494,2 menos arrecadado 384,7).
- CabecalhoCidade "MATA DE SÃO JOÃO" (selo do @ grande na abertura, viaja para o cabeçalho, volta no "Segue o"). Marca d'água quicando. Legenda na base. Sem tarifa bancária (regra 60).
- Folhas "PDF" (regras 28b, 29, 42, 42b, 45, 47, 48) aplicadas depois do render com `tools/lista_pdf/lista_pdf.py aplicar` (scripts/folhas.py): 3 de receita + 36 por setor; faixa de pessoal e diárias; Câmara com duodécimo recebido (razão da Câmara).

## Setores (12 casinhas, na ordem da fala; por SECRETARIA, função 28 em Dívidas, esporte = função 27)
| # | Casinha | Peça | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|---|
| 1 | EDUCAÇÃO | Escola | 161,62 | 179,13 | 136,01 |
| 2 | SAÚDE | PostoSaude | 66,53 | 72,57 | 54,80 |
| 3 | ADMINISTRAÇÃO | Prefeitura | 13,27 | 18,73 | 18,17 |
| 4 | OBRAS E SERVIÇOS URBANOS | RuaServicos | 140,68 | 124,34 | 84,00 |
| 5 | CÂMARA DE VEREADORES | CamaraVereadores | 18,44 | 21,06 | 16,43 |
| 6 | DÍVIDAS | BancoDivida | 7,91 | 7,24 | 5,25 |
| 7 | CULTURA E FESTAS | PredioTexto palco "FESTAS" | 18,79 | 20,23 | 19,35 |
| 8 | ASSISTÊNCIA SOCIAL | PredioAssistencia | 13,90 | 11,45 | 7,93 |
| 9 | TURISMO E EMPREGO | PredioTexto casinha "TURISMO" | 2,20 | 3,84 | 5,44 |
| 10 | ESPORTE | PredioTexto quadra | 0,74 | 1,23 | 0,55 |
| 11 | AGRICULTURA | PredioTexto trator | 2,18 | 2,11 | 1,55 |
| 12 | MEIO AMBIENTE E URBANISMO | árvores | 1,77 | 1,93 | 1,58 |
(R$ milhões, liquidado; exatos no fontes.md. Soma de cada ano = total liquidado, diferença 0,00.)

## Palavras-chave (quando) e eventos
| Palavra | Tempo | O que acontece | Cena |
|---|---|---|---|
| Gastou 448 | 19,50 | sai o mapa; cofre sobe; pilha dourada nasce | 2024 cofre |
| 20 milhoes e 100 | 21,40 | torre vermelha 20,1 MI A MAIS | 2024 cofre |
| Educacao (1) … Meio ambiente e urbanismo (1) | 23,3–46 | pilhas voam para cada casinha; plaquinha do valor | 2024 setores |
| 2025 Arrecadou / Gastou 463 / Desta vez | 48,4–54,3 | sobe; pilha verde; torre verde 23,7 MI SOBRARAM | 2025 cofre |
| Educacao (2) … (2) | 56,5–78 | voos; plaquinhas 2024 + 2025 em cada casinha | 2025 setores |
| 2026 ate setembro / Ja gastou 351 / ja comprometeu / Uma parte e folha | 80,7–90 | pilha rosa; torre vermelha 109,4 MI COMPROMETIDOS A MAIS; chip "parte é folha" | 2026 cofre |
| Educacao (3) … (3) | 91,9–113 | voos; plaquinhas dos três anos | 2026 setores |
| Agora repara | 114,9 | dinheiro some; gaveta da esquerda "FESTAS x O PREVISTO · AJUDA ÀS FAMÍLIAS" | festas |
| levou 15 / 18 milhoes e 200 | 116,8–119,3 | torres dourada (15,9) e verde (18,2), 1 pilha = R$ 1 mi | festas |
| O previsto era | 121,5 | torres brancas (previsto 11,7 · 12,6 · 12,1) ao lado de cada ano | festas |
| Em 2026 ate setembro festas / ja somam 17 | 123,7–126,5 | torre rosa 17 MI | festas |
| A ajuda as familias / 4 milhoes e 900 / 5 milhoes e 100 / ate setembro 2 milhoes | 128–133 | fila da frente: 4,9 · 5,1 · 2,9 | festas |
| Na cidade da Praia / 70 mil / 132 mil / 16 mil e 700 | 134,2–141 | gaveta da direita "TURISMO · MEIO AMBIENTE": três torrinhas mínimas | turismo |
| E as acoes de meio ambiente / 199 reais | 142,8–145 | torrinha vermelha R$ 199,28 (2024) | turismo |
| A construcao da unidade / 4 milhoes e 500 | 147–150,4 | torre dourada 4,5 MI (compostagem, Sec. de Obras) | turismo |
| E a Camara de Vereadores gastou / quase o dobro / So em diarias | 151,4–156,2 | gaveta de trás: Câmara 21,1 x assistência 11,4 (2025); diárias 1,5 (2026) | câmara |
| No Tribunal de Contas | 159,4 | prédio do TCM e 3 pastas (trios elétricos, decoração de Natal, buffet da festa dos servidores) "DENÚNCIA NO TCM" | tribunal |
| Gastar nao / Mas se as festas / por que a promocao / e a ajuda as familias com | 166,4–175 | mesa; festas 2026, turismo 2026, ajuda 2026 de novo | pergunta |
| Segue o | 175,6 | selo do @ volta ao centro; plaquinhas da pergunta somem | final |

## Câmera (enquadramento automático da base; distâncias só referência)
- Anos: vista do cofre → casinha em casinha (OLHA_SETOR, um sentido só, segura 0,55 s) → sobe (DE_CIMA) na virada do ano.
- Festas: gaveta da esquerda, da esquerda para a direita, depois a fila da frente. Turismo: gaveta da direita, da esquerda para a direita. Câmara: gaveta de trás, de frente. Tribunal: pastas da esquerda para a direita. Pergunta: mesa inteira, festas 2026, turismo, ajuda; no "Segue o" abre.

## Sons
whoosh em cada troca de cena; pop em cada setor e valor; subida no "gastou"; baque nas torres vermelhas, no previsto, no turismo de 2026, nos R$ 199, no "quase o dobro" e nas diárias; ding no "sobraram" e no "Segue o".

## Escolhas do diretor (★)
- ★ Previsto (branco) ao lado do gasto de festas em cada ano, e a ajuda às famílias na fila da frente, do mesmo ano (comparação de primeira).
- ★ Torre verde "SOBRARAM" em 2025 (o único ano com sobra), em vez da vermelha.

## Arquivos
- Novos: src/videos/orcamentomatadesaojoao/{OrcamentoMataDeSaoJoao.tsx, palavras.ts}; ~/Kit-Mapas-Animados/src/videos/orcamento-matadesaojoao/{index.tsx, roteiro.ts, dados/}; scripts/dados-orcamento-matadesaojoao.py; ~/Documents/RECEITAS-DESPESAS-MATA-DE-SAO-JOAO/scripts/*.
- Alterados (só acrescentando linhas): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentoparatinga; comum/CabecalhoCidade.
