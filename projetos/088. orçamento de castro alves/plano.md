# Plano de cenas · 088. orçamento de castro alves (modo autônomo, aprovado em 10/11/2026)

Molde: 131 Maraú / 093 Ilhéus. Narração 177,37 s (Google Algenib). Vídeo 178,27 s.
Código: src/videos/orcamentocastroalves/OrcamentoCastroAlves.tsx · palavras.ts · tempos por quando() (scripts/checa_quando.py: todos os gatilhos achados).

## Mundo
- Abertura: Kit Mapas (src/videos/orcamento-castroalves no ~/Kit-Mapas-Animados, satélite copiado de Santo Antônio de Jesus, vizinha, + npm run tiles): voo do Brasil até Castro Alves; tags das três receitas; "PREFEITURA E CÂMARA DE CASTRO ALVES"; TCM-BA; "A MAIOR PARTE VEM DE FORA", FPM 2025 R$ 41,2 mi e Fundeb + União 2025 R$ 54 mi; "2024 · R$ 160,9 MI · ARRECADOU EM 2024". Até "Gastou 159".
- Maquete redonda: cofre no meio; pilha do ano em volta (1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026). 11 casinhas na ordem da fala: Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas, Assistência social, Câmara de Vereadores, Festas e eventos (palco), Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra).
- Cada ano: "Gastou" → pilha do ano nasce; "Sobraram / a mais" → torre verde (2024) ou vermelha (2025 e 2026) na frente do cofre; cada setor → as pilhas voam para a casinha, câmera de casinha em casinha.

## Miolo (achados)
| Palavra | Objeto | Escala |
|---|---|---|
| "Agora, a Câmara" | gaveta "CÂMARA: RECEBEU E GASTOU" atrás do cofre, à esquerda: recebeu 3,5 / gastou 3,6 (2024), recebeu 4,3 / gastou 4,3 (2025), recebeu 3,6 (2026 até set) | 1 pilha = R$ 500 mil |
| "Os subsídios dos vereadores" | gaveta "CÂMARA 2025" atrás, à direita: subsídios 1,5 mi e consultoria 557 mil | 1 pilha = R$ 100 mil |
| "Repara no empréstimo" | gaveta "EMPRÉSTIMO E DÍVIDA" na frente, à direita: empréstimo dez/2025 14,5 mi; gastou a mais em 2025 4,6 mi (vermelho); serviço da dívida 2025 13,9 mi | 1 pilha = R$ 1 milhão |
| "E as festas" | gaveta "FESTAS 2026 (ATÉ SET)" na frente, à esquerda: ação de eventos 5,3 mi; palco na Sec. de Cultura 1,4 mi; palco na Educação 779 mil e bandas na Educação 156 mil (vermelho) | 1 pilha = R$ 500 mil |
| "Mas se até setembro" / "por que as festas" | torre vermelha do gasto a mais de 2026 (10,9 mi) ao lado das festas e eventos de 2026 (7,9 mi) | idem |

## Folhas "PDF" (lista_pdf.py, config em ~/Documents/RECEITAS-DESPESAS-CASTRO-ALVES/saida/folha-pdf/config-setores.json)
3 de receita (2025 em "A maior parte vem de fora", com o empréstimo em linha própria; 2024 em "2024. Arrecadou"; 2026 em "2026, até setembro") + 33 por setor (11 x 3), soma = valor falado. Câmara com recebeu/devolveu (razão) no destaque; Festas e eventos com a origem de cada parte (regra 99); 2025 avisa que o PDF consolidado não separa bandas e palco de outras ações.

## Sons, capa, legenda
- Sons: whoosh nas viradas de cena, pop em cada setor e número, baque nos destaques, ding no "Segue o".
- Capa: "Empréstimo: / R$ 14,5 mi. / Festas 2026: / R$ 7,9 mi." sobre um quadro do OrcamentoCastroAlvesLimpo no fim.
- ★ Novidade: a gaveta do empréstimo mostra, lado a lado, o dinheiro que entrou emprestado, o gasto a mais do mesmo ano e o que saiu para pagar dívida.
