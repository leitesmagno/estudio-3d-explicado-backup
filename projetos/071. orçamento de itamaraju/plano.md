# Plano · 071 orçamento de Itamaraju

- Perfil @eumagnoleite. Código `orcamentoitamaraju`, composições `OrcamentoItamaraju`, `OrcamentoItamarajuGuia`, `OrcamentoItamarajuLimpo`, `CapaOrcamentoItamaraju` (src/Root.tsx).
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 16 partes com 0,28 s, pausas 0,28 s, atempo 1,137, -15,4 LUFS → 174,24 s. QUADROS = 5254 (175,1 s).
- Molde: 067 Barreiras (código copiado e adaptado) + Teixeira de Freitas aprovado (folha por setor). Regras: 19b (fala só o total), 20 (ritmo), 24b (abertura só com a receita), 28b/28c (folha documento pequena, nunca sobre texto), 29/29b/29d/29e (folha POR SETOR), 30 (comparações), 13/14 (revisão 3D), 15c/18 (SeloArroba), marca d'água.

## Mundo
- Mesa redonda sem rio, cofre no centro, 11 casinhas na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas (banco), Cultura e festas (palco), Assistência social, Agricultura, Esporte, Meio ambiente.
- Escala: 1 moeda = R$ 500 mil, 1 pilha = R$ 5 mi (2024 usa ~66 dos 93 lugares do anel). Dourado 2024, verde 2025, rosa 2026.
- Torre vermelha "A MAIS" no déficit de 2024 (13,1) e nos 4,8 de 2026; torre-fantasma da sobra de 2025 (18,1).
- Miolo: gaveta "A DÍVIDA · 2025" (1 pilha = R$ 10 mi: início 147,4 fantasma, fim 241,1 vermelha com o INSS 208,6 em vermelho cheio); gaveta "FESTEJOS x ASSISTÊNCIA" (1 pilha = R$ 1 mi: previsto 2025 3,3 fantasma, festejos 2025 6,3, assistência 2025 4,8, festejos 2026 9,8, assistência 2026 4,9, agricultura 2026 0,95); gaveta "CÂMARA x ASSISTÊNCIA" (2025: 9,4 x 4,8). Tribunal com 2 pastas: SÃO JOÃO 2025 (carimbo MULTA AO GESTOR) e SÃO JOÃO 2026 (MIN. PÚBLICO, SEM JULGAMENTO).

## Mapa de palavras-chave (quando() conferido: todos existem e em ordem)
| Palavra | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|
| Itamaraju arrecadou 284 / 304 em 2025 / 231 e 900 | 0,00 / 3,28 / 5,28 | mapa + chips | voo do Brasil até Itamaraju; 3 chips da receita | abertura |
| Eu abri | 8,54 | contorno | pulsa | abertura |
| Começa em 2024 | 11,66 | 3D + folha | maquete; folha RECEITA 2024 (Anexo 10, 18 linhas, R$ 284.105.556,55) | 2024 |
| Gastou 297 / Foram 13 / O próprio balanço | 13,14 / 15,36 / 17,50 | cofre, torre vermelha | pilha dourada; déficit | 2024 |
| Educação 104 … Meio ambiente 298 | 19,38–43,02 | casinhas | pilhas voam; uma FOLHA POR SETOR | 2024 |
| No ano seguinte / Arrecadou 304 / Gastou 286 / Sobraram 18 | 45,02 / 46,46 / 48,86 / 51,28 | cofre, folha | receita 2025; pilha verde; sobra | 2025 |
| Educação 127 … Meio ambiente 669 | 53,0–76,7 | casinhas | folha por setor | 2025 |
| E em 2026 / arrecadou 231 / Gastou 236 / De novo 4 / empenhou | 79,14 / 81,36 / 83,50 / 85,80 / 88,14 | cofre | receita 2026; pilha rosa; torre vermelha; chip do empenho | 2026 |
| Educação 96 … Meio ambiente 573 | 92,1–115,7 | casinhas | folha por setor | 2026 |
| Agora três coisas / começou 147 / terminou 241 / INSS / ganhou 102 / não dizem | 118,0 / 122,2 / 124,7 / 126,7 / 129,0 / 131,5 | gaveta da dívida | torres e plaquinhas | achado 1 |
| A segunda / previa 3 / Gastou 6 / Mais que toda / Em 2026 / o dobro / dez vezes | 133,4 / 136,3 / 137,8 / 141,4 / 143,0 / 147,0 / 148,5 | gaveta dos festejos | uma torre por número | achado 2 |
| A terceira / a Câmara custou / Quase o dobro | 149,5 / 151,4 / 153,3 | gaveta da Câmara | Câmara x assistência | achado 3 |
| No Tribunal / rendeu multa / Ministério Público / sem julgamento | 155,0 / 158,3 / 159,8 / 163,2 | Tribunal e pastas | carimbos | Tribunal |
| Festa não é crime / Mas se em dois / a festa precisa / Segue | 164,4 / 165,4 / 169,5 / 171,9 | mesa, dívida, festejos | pergunta e @ | pergunta |

## Câmera
- Igual a Barreiras nos anos (folha fixa à direita, assunto à esquerda; casinha a casinha no mesmo sentido; sobe na virada do ano). Dívida com dir y 2,8; festejos e Câmara com dir y 1,6; Tribunal 1,2; pergunta: mesa → dívida → festejos → mesa.

## Interface
- Pílula por bloco (3 achados), chip do número falado (y 520), selo da fonte e placar da escala (y 400), plaquinhas presas às torres (y ≥ 730, à esquerda da folha). Folha CartaoDocumento escala 0,62 no canto direito: receita do ano e uma folha por setor (números em folhas.ts e folhas_setor.ts, gerados dos JSONs; soma = total). SeloArroba 0–4 s; marca d'água quicando.

## Sons
- whoosh nas trocas de cena, tique nas pílulas e nas folhas de receita, pop em cada setor e número, subida nas pilhas, baque no déficit, ding na sobra; ★ subida na torre de 241,1, impacto no "ganhou mais 102,8", no "mais que toda a assistência" e no "o dobro", baque na multa.

## Arquivos
- Novos: src/videos/orcamentoitamaraju/ (OrcamentoItamaraju.tsx, folhas.ts, folhas_setor.ts, palavras.ts); ~/Kit-Mapas-Animados/src/videos/orcamento-itamaraju/ e scripts/dados-orcamento-itamaraju.py; satélite próprio copiado de Itabela.
- Alterados (só acrescentando): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentoparatinga; SeloArroba; CartaoDocumento.

Aprovado no modo autônomo em 08/11/2026.
