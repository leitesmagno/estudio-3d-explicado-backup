# Plano de cenas · 104. orçamento de jussari (modo autônomo)

Molde: 103 Itapebi (mesma maquete, mesma câmera, mesmo cabeçalho). Narração 170,77 s + 0,9 s de folga. Tudo entra na palavra pelo `quando()` do palavras.ts.

## Mundo
- Abertura: Kit Mapas (src/videos/orcamento-jussari, satélite de Camacan + Itapebi) voa do Brasil até Jussari, com as três receitas (R$ 58,9 MI · 2024 / R$ 68,4 MI · 2025 / R$ 53,6 MI · 2026 ATÉ AGOSTO), "PREFEITURA DE JUSSARI" e "TCM-BA". Trecho B: 2024 e "R$ 58,9 MI ARRECADOU EM 2024". O mapa sai em "Gastou 57".
- Maquete redonda: cofre no meio, 10 casinhas na borda na ordem da fala (Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas, Assistência social, Câmara, Cultura e festas, Agricultura e meio ambiente, Esporte). 1 pilha = R$ 1 mi (dourado 2024, verde 2025, rosa 2026). No "gastou" a pilha do ano nasce em volta do cofre; em cada setor as pilhas voam para a casinha. Torre verde "SOBROU/SOBRARAM" nos três anos.
- Achados no miolo:
  - Gaveta da frente (1 pilha = R$ 200 mil): festas 2024 (147 mil), 2025 (2,16 mi), 2026 até agosto (2,67 mi, empenhado 2,78 mi em fantasma), programas de agricultura 2026 (R$ 396), IPTU 2024 (R$ 6 mil), 2025 (R$ 0) e 2026 (R$ 0) com a previsão (575 mil) em fantasma branco ao lado.
  - Atrás, à esquerda (1 pilha = R$ 100 mil): Câmara 2025 recebeu 1,74 mi, devolveu 86 mil, consultoria 174 mil, diárias 20 mil.
  - Atrás, à direita (1 pilha = R$ 10 mi): INSS parcelado fim de 2024 (39,6 mi), fim de 2025 (72,5 mi) x tudo que a cidade arrecadou em 2025 (68,4 mi).
- Pergunta final: IPTU 2025 R$ 0 e festas 2025 R$ 2,2 mi; "Segue o @eumagnoleite" com o selo voltando ao centro.

## Câmera
Igual ao 103: vista geral → cofre em cada ano → casinha por casinha num sentido só (segura 0,55 s em cada) → gaveta das festas (pares de torres) → IPTU → Câmara → dívida → mesa inteira → pergunta → afasta.

## Interface
Selo da fonte no topo (Balanço/Anexos do TCM-BA), placar de escala, chip do número dito, plaquinhas presas às torres (todos os setores, anos anteriores na sua cor), margem de 90 px nas laterais, legenda na base, marca d'água @eumagnoleite quicando. Folhas "PDF" (receita por ano e uma por setor) aplicadas depois do render (tools/lista_pdf).

## Sons
whoosh nas viradas de cena, tique nos estados, pop nos números, subida no "gastou", ding no que sobrou, baque nos achados, ding no "Segue o".

## Fontes
audio/fontes.md (cópia em ~/Documents/FONTES).

Aprovado no modo autônomo (10/11/2026).
