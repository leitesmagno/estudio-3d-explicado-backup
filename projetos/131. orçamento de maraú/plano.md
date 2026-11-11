# Plano de cenas · 131. orçamento de maraú (modo autônomo, aprovado em 10/11/2026)

Molde: 128 Arataca / 093 Ilhéus. Pedido de seguidor: "Entrada e saída da Prefeitura e Câmara Municipal". Narração 174,96 s (Google Algenib).
Código: src/videos/orcamentomarau/OrcamentoMarau.tsx · palavras.ts · tempos por quando() (scripts/checa_quando.py).

## Mundo
- Abertura: Kit Mapas (src/videos/orcamento-marau no ~/Kit-Mapas-Animados, satélite copiado de Itacaré): voo do Brasil até Maraú; tags das três receitas; "PEDIDO DE SEGUIDOR · ENTRADA E SAÍDA: PREFEITURA E CÂMARA"; "PREFEITURA E CÂMARA DE MARAÚ"; TCM-BA; "A MAIOR PARTE VEM DE FORA", FPM 2025 R$ 41,2 mi e Fundeb + União 2025 R$ 54,3 mi; "2024 · R$ 138 MI · ARRECADOU EM 2024". Até "Gastou 132".
- Maquete redonda: cofre no meio; pilha do ano em volta (1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026). 11 casinhas na ordem da fala: Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas, Assistência social, Câmara de Vereadores, Festas e eventos (palco), Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra).
- Cada ano: "Gastou" → pilha do ano nasce; "Sobraram / a mais" → torre verde ou vermelha na frente do cofre; cada setor → as pilhas voam para a casinha, câmera de casinha em casinha.

## Miolo (achados)
| Palavra | Objeto | Escala |
|---|---|---|
| "Agora, a Câmara" | gaveta "CÂMARA: RECEBEU E DEVOLVEU" atrás do cofre, à esquerda; torres recebeu/devolveu de 2024, 2025 e 2026 até set | 1 pilha = R$ 500 mil |
| "Repara nos gastos da Câmara" | gaveta "GASTOS DA CÂMARA" atrás, à direita: consultoria (287 mil, 675 mil), combustível (94 mil, 288 mil), diárias (25 mil, 201 mil) | 1 pilha = R$ 50 mil |
| "E as festas" | gaveta "BANDAS x AJUDA ÀS FAMÍLIAS" na frente: bandas 2025 na ação de convênio (800 mil), bandas 2026 na ação da cultura (834 mil), ajuda de emergência 2025 (264 mil) | 1 pilha = R$ 200 mil |
| "por que as festas e eventos levaram" | torre das festas e eventos de 2025 (3,2 mi) ao lado da ajuda (264 mil) | idem |

## Folhas "PDF" (lista_pdf.py, config em ~/Documents/RECEITAS-DESPESAS-MARAU/saida/folha-pdf/config-setores.json)
3 de receita (2025 em "A maior parte vem de fora", 2024 em "2024. Arrecadou", 2026 em "2026, até setembro") + 33 por setor (11 x 3), soma = valor falado. Câmara com recebeu/devolveu no destaque; Festas e eventos com a origem de cada parte (regra 99).

## Sons, capa, legenda
- Sons: whoosh nas viradas de cena, pop em cada setor e número, baque nos destaques, ding no "Segue o".
- Capa: "Câmara 2025: / R$ 5 mi. / Festas 2025: / R$ 3,2 mi." sobre o quadro 5172 do OrcamentoMarauLimpo.
- ★ Novidade: a Câmara aparece com as três entradas e as três devoluções, como o seguidor pediu.
