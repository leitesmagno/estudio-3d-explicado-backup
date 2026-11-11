# Plano · 080. orçamento de Xique-Xique (modo autônomo, molde 112 Pojuca / 110 Catu / 093 Ilhéus)

## Ideia do mundo
- Abertura no Kit Mapas (`src/videos/orcamento-xiquexique` no ~/Kit-Mapas-Animados, IBGE 2933604): voo do Brasil até Xique-Xique, as três receitas, "prefeitura, SAAE e Câmara", o TCM-BA e a receita de 2025 ("quase tudo vem de fora": Fundeb R$ 61,2 mi, FPM R$ 58,8 mi, complementação da União R$ 49 mi, imposto sobre serviços R$ 6,5 mi). Trecho B: "2024 · R$ 232,8 MI · ARRECADOU EM 2024".
- Maquete redonda (igual ao Catu): COFRE no meio, a pilha do ano em volta (1 pilha = R$ 4 mi; dourado 2024, verde 2025, rosa 2026) e 12 casinhas na borda, NA ORDEM DA FALA: Educação, Saúde, Administração, Obras e serviços urbanos, Dívidas e encargos, Assistência social, Água e saneamento (galpão "ÁGUA"), Câmara, Festas e eventos (palco), Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra). Na palavra do setor, as pilhas voam do cofre para a torre do setor.
- Torre do resultado na frente do cofre: 2024 R$ 8,1 MI A MAIS (vermelha) + chip "O BALANÇO DE 2024 REGISTRA DÉFICIT"; 2025 SOBRARAM R$ 11 MI (verde); 2026 SOBRARAM R$ 3,8 MI + chip "JÁ COMPROMETIDO R$ 243,3 MI".

## Miolo (achados)
- Gaveta "CÂMARA: RECEBEU E DEVOLVEU" (atrás, à esquerda; 1 pilha = R$ 1 mi): recebeu 6,4 / devolveu 1,07 (2024); recebeu 7,3 / devolveu 1,2 (2025).
- Gaveta "CONSULTORIA DA CÂMARA" (atrás, à direita; 1 pilha = R$ 50 mil): 220 mil (2024), 273 mil (2025), 282 mil (2026 até set).
- Gaveta "FESTAS x AJUDA ÀS FAMÍLIAS" (frente; 1 pilha = R$ 500 mil): festas 2,4 (2024), 3 (2025), 4,1 (2026 até set); bandas 2,1 e palco 1,7 (2026); ajuda de emergência 262 mil (2026 até set).
- Pergunta final: câmera vai da ajuda (262 mil) às bandas (2,1 mi) de 2026. "Segue o": selo volta ao centro.

## Tempo
Tudo por `quando()` sobre `src/videos/orcamentoxiquexique/palavras.ts` (tabela T no .tsx; todas as frases conferidas com tsx). "Câmara" aparece na abertura: a menção da lista usa a ocorrência n+1.

## Fontes, sons, peças
- Fontes: audio/fontes.md (cada número com PDF, página e linha). Selos de fonte por bloco (Balanço 2024 e 2025, consolidados, PCMGE015 set/2026, razão PCMGE018 da Câmara).
- Sons: whoosh nas viradas de cena, pop nos setores, baque nos achados e no déficit, ding na sobra e no "Segue o".
- Peças: as mesmas do 110 Catu (orcamentoitabuna/pecas, orcamentocanavieiras/pecas, BaseGaveta, CofreFGTS, CabecalhoCidade).
- Folhas PDF (regras 28, 29, 42, 45, 48, 99): 3 de receita + uma por setor falado em cada ano (36), via scripts/folhas.py.
- ★ Melhoria: torres das bandas e do palco de 2026 ao lado da torre das festas, e a torre clarinha da ajuda às famílias logo depois, para comparar no olho.

Plano APROVADO no modo autônomo (11/11/2026).
