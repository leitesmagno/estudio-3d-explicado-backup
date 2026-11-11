# Plano de cenas · 111. orçamento de dias d'ávila (modo autônomo, aprovado em 10/11/2026)

Molde: 131 Maraú / 093 Ilhéus (lote de 40). Narração 177,23 s (Google Algenib, speakingRate 1,3, atempo 1,06).
Código: src/videos/orcamentodiasdavila/OrcamentoDiasDavila.tsx (gerado do molde por ~/Documents/RECEITAS-DESPESAS-DIAS-D-AVILA/scripts/gera_tsx.py) · palavras.ts · tempos por quando() (scripts/checa_quando.py).

## Mundo
- Abertura: Kit Mapas (src/videos/orcamento-diasdavila no ~/Kit-Mapas-Animados, satélite copiado de Catu, vizinho): voo do Brasil até Dias d'Ávila; tags das três receitas (R$ 386,6 mi 2024, R$ 404,5 mi 2025, R$ 308,7 mi até set/2026); "PREFEITURA E CÂMARA DE DIAS D'ÁVILA"; TCM-BA; "A MAIOR PARTE VEM DE FORA", FPM 2025 R$ 80,5 mi e Fundeb + União 2025 R$ 96,4 mi; "2024 · R$ 386,6 MI · ARRECADOU EM 2024". Até "Gastou 344".
- Maquete redonda: cofre no meio; pilha do ano em volta (1 pilha = R$ 5 mi; dourado 2024, verde 2025, rosa 2026). 11 casinhas na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Dívidas, Assistência social, Câmara de Vereadores, Festas e eventos (palco), Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra).
- Cada ano: "Gastou" → pilha do ano nasce; "Sobraram" → torre verde na frente do cofre (sobrou nos três anos); cada setor → as pilhas voam para a casinha, câmera de casinha em casinha.

## Miolo (achados)
| Palavra | Objeto | Escala |
|---|---|---|
| "Agora, a Câmara" | gaveta "CÂMARA: RECEBEU, GASTOU E DEVOLVEU" atrás do cofre, à esquerda: recebeu 14,3 mi e devolveu 841 reais (2024); recebeu 13,6 mi e gastou 13,5 mi (2025, chip "Assistência social 2025: R$ 11,3 mi"); recebeu 11 mi e devolveu 26 mil (2026 até set) | 1 pilha = R$ 2 mi |
| "Repara nos gastos da Câmara" | gaveta "GASTOS DA CÂMARA" atrás, à direita: consultoria (568 mil, 736 mil), combustível (442 mil, 276 mil até set/2026) | 1 pilha = R$ 100 mil |
| "E as festas" | chip da ação "Realização de eventos culturais" no Gabinete; gaveta "BANDAS x AJUDA ÀS FAMÍLIAS" na frente: bandas 2025 (3,9 mi), bandas até set/2026 (4,9 mi), ajuda de emergência 2025 (1,5 mi) | 1 pilha = R$ 1 mi |
| "por que as festas e eventos levaram" | torre das festas e eventos de 2025 (8,4 mi) ao lado da ajuda (1,5 mi) | idem |

## Folhas "PDF" (lista_pdf.py, config em ~/Documents/RECEITAS-DESPESAS-DIAS-D-AVILA/saida/folha-pdf/config-setores.json)
3 de receita (2025 em "A maior parte vem de fora", 2024 em "2024. Arrecadou", 2026 em "2026, até setembro") + 33 por setor (11 x 3), soma = valor falado. Câmara com recebeu/devolveu no destaque; Festas e eventos com a origem de cada parte (regra 99).

## Sons, capa, legenda
- Sons: whoosh nas viradas de cena, pop em cada setor e número, baque nos destaques, ding nas sobras e no "Segue o".
- Capa: "Câmara 2025: / R$ 13,5 mi. / Festas 2025: / R$ 8,4 mi." sobre um quadro do OrcamentoDiasDavilaLimpo.
- ★ Novidade: em 2025 a Câmara aparece com o que recebeu e o que gastou lado a lado, e o chip compara com a assistência social.
