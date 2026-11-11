# Plano · 112. orçamento de Pojuca (modo autônomo, molde 110 Catu / 093 Ilhéus)

## Ideia do mundo
- Abertura no Kit Mapas (`src/videos/orcamento-pojuca` no ~/Kit-Mapas-Animados): voo do Brasil até Pojuca (IBGE 2925204), as três receitas, "prefeitura e Câmara de Pojuca", o TCM-BA e a receita de 2025 (royalties do petróleo R$ 60,6 mi, ICMS R$ 70 mi, imposto sobre serviços R$ 43,4 mi). Trecho B: "2024 · R$ 254,9 MI · ARRECADOU EM 2024".
- Maquete redonda (igual ao Catu): COFRE no meio, a pilha do ano em volta (1 pilha = R$ 4 mi; dourado 2024, verde 2025, rosa 2026) e 11 casinhas na borda, NA ORDEM DA FALA: Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas e encargos, Assistência social, Câmara, Festas e eventos (palco), Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra). Na palavra do setor, as pilhas voam do cofre para a torre do setor.
- Torre do resultado na frente do cofre: 2024 FALTARAM R$ 25,1 mi (vermelha), 2025 SOBRARAM R$ 9,2 mi (verde, com chip do empréstimo de R$ 12,5 mi), 2026 FALTARAM R$ 7,6 mi (vermelha) + chip "JÁ COMPROMETIDO R$ 270,3 MI".

## Miolo (achados)
- Gaveta "CÂMARA: RECEBEU E DEVOLVEU" (atrás, à esquerda; 1 pilha = R$ 1 mi): recebeu 10,9 / devolveu 211 mil (2024); recebeu 12,9 / devolveu R$ 721 (2025).
- Gaveta "GASTOS DA CÂMARA" (atrás, à direita; 1 pilha = R$ 100 mil): diárias 444 mil (2024), 1,2 mi (2025), 1,2 mi (2026 até set); combustível R$ 0 com esse nome (2024) e 558 mil (2025).
- Gaveta "EVENTOS x AJUDA ÀS FAMÍLIAS" (frente; 1 pilha = R$ 1 mi): previsto 5,6 x gasto 9,4 e bandas 5,4 (2024); previsto 5,8 x gasto 9,9 e bandas 4,9 (2025); ajuda de emergência 2,4 (2025).
- Pergunta final: câmera vai da ajuda (2,4) às bandas (4,9) de 2025. "Segue o": selo volta ao centro.

## Tempo
Tudo por `quando()` sobre `src/videos/orcamentopojuca/palavras.ts` (tabela T no .tsx). Câmara aparece na abertura: as menções da lista usam a ocorrência n+1.

## Fontes, sons, peças
- Fontes: audio/fontes.md (cada número com PDF, página e linha). Selos de fonte por bloco (Balanço 2024 e 2025, PCMGE015/016/065 set/2026, razão PCMGE018 da Câmara e da Prefeitura).
- Sons: whoosh nas viradas de cena, pop nos setores, baque nos achados, ding na sobra de 2025 e no "Segue o".
- Peças: as mesmas do 110 Catu (orcamentoitabuna/pecas, orcamentocanavieiras/pecas, BaseGaveta, CofreFGTS, CabecalhoCidade).
- ★ Melhoria: torre do previsto ao lado da do gasto (regra do 114) e torre das bandas ao lado, para ver que só as bandas passam da metade do gasto.
