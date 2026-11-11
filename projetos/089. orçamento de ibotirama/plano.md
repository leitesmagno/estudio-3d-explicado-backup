# 089. orçamento de Ibotirama · plano de cenas (aprovado no modo autônomo)

Molde: 112 Pojuca (maquete redonda do 093/110) + Kit Mapas na abertura. Voz Google Algenib, 178,0 s. Só 2024, 2025 e 2026 (até setembro).

## Mundo
- Mesa redonda com o COFRE no meio. Em cada ano, a PILHA DO ANO em volta do cofre (1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026).
- 11 casinhas na borda, na ordem da fala: Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas e encargos, Assistência social, Câmara, Festas e eventos, Cultura, Agricultura e meio ambiente, Esporte.
- Quando a voz diz o setor, as pilhas voam do cofre para a torre do setor (3 torres por setor, uma por ano) e a plaquinha mostra o valor.
- Gavetas dos achados no miolo:
  - atrás, à esquerda (1 pilha = R$ 500 mil): Câmara recebeu 2024 (4,41), obras 2024 (478 mil), recebeu 2025 (5,15), devolveu 2025 (354 mil);
  - atrás, à direita (1 pilha = R$ 100 mil): consultorias da Câmara 2024 (311 mil) e 2025 (400 mil);
  - na frente (1 pilha = R$ 500 mil): eventos 2025 previsto (3 mi) x gasto (5,1 mi), bandas 2025 (3,2 mi), palco 2025 (1,1 mi), bandas até set/2026 (2,7 mi), ajuda de emergência 2024/2025/2026 (162/68/37 mil).

## Tempo (pela fala, quando() no palavras.ts)
| Trecho | Palavra | O que acontece |
|---|---|---|
| 0 a 24,9 s | "Ibotirama arrecadou..." até "1 milhão e 400" | Kit Mapas: voo até Ibotirama, as três receitas, TCM-BA, SUS/FPM/IPTU 2025; selo do @ grande que viaja ao cabeçalho |
| 2024 | "2024. Arrecadou 181" | mapa: R$ 181,1 MI · ARRECADOU EM 2024; folha da receita 2024 |
| | "Gastou 183" | entra a maquete; cofre com a pilha de 2024; "Faltaram 2" torre vermelha |
| | setores | voo das pilhas para as 11 casinhas; folha de cada setor |
| 2025 | "Só em dezembro" / "Em 2024 inteiro" | chips das taxas de fiscalização (9 mi num mês x 1,6 mi no ano de 2024) |
| | "Sobraram 7" | torre verde |
| 2026 | "Faltaram 4" / "E já comprometeu" | torre vermelha; chip do empenhado |
| Câmara | "Agora, a Câmara" | gaveta atrás à esquerda; depois consultorias (atrás à direita) |
| Festas | "E as festas" | gaveta da frente; previsto x gasto, bandas, palco, bandas 2026, ajuda |
| Pergunta | "Gastar não é crime" | mesa inteira; depois ajuda 2025 (68 mil) x bandas 2025 (3,2 mi) em destaque |
| Fim | "Segue o @eumagnoleite" | selo volta para o meio |

## Câmera
- Cada ano: sobe (vista de cima) → cofre → passa de casinha em casinha no mesmo sentido.
- Achados: close em cada gaveta, depois a pergunta com a mesa inteira e os dois números lado a lado.

## Folhas "PDF"
- 3 de receita (uma por ano) + 33 de setor (11 por ano), soma = valor falado. Câmara com recebeu/devolveu do razão. Festas com bandas e palco separados.

## Sons
- whoosh nas cenas, pop nos números, baque nos achados, ding no "Sobraram" e no "Segue o".

## Arquivos
- src/videos/orcamentoibotirama/OrcamentoIbotirama.tsx e palavras.ts; Kit Mapas src/videos/orcamento-ibotirama → mapas/ibotirama.mp4.
- ★ Melhoria: chip "SÓ EM DEZ/2025: R$ 9 MI EM TAXAS DE FISCALIZAÇÃO" com soquinho de câmera (achado da receita).
