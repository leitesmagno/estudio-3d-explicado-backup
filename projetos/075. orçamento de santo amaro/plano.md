# Plano: 075. orçamento de Santo Amaro (molde 129 Inhambupe / 093 Ilhéus / 092 Ubaitaba)

Aprovado no modo autônomo (10/11/2026). Código: src/videos/orcamentosantoamaro/OrcamentoSantoAmaro.tsx (tempos todos por quando() sobre palavras.ts).

## Mundo
Mesa redonda (maquete do 035): COFRE no meio, 12 casinhas na borda NA ORDEM DA FALA (Educação, Saúde, Administração, Obras e limpeza urbana, Transportes, Câmara, Dívidas e devoluções, Festas e eventos, Cultura, Assistência social, Agricultura e meio ambiente, Esporte). 1 pilha = R$ 4 mi (Santo Amaro gasta 240 a 278 mi por ano). Cores: 2024 dourado, 2025 verde, 2026 rosa.
Cabeçalho fixo CabecalhoCidade "SANTO AMARO" com o selo do @ que viaja (abertura) e volta no "Segue o". Marca d'água quicando.

## Cenas (palavra → o que acontece)
1. 0 a 18,5 s, "Santo Amaro arrecadou…" até "Gastou 240": mapa do Kit Mapas (voo Brasil → Santo Amaro, no Recôncavo; tags R$ 242,4 MI · R$ 275,4 MI · R$ 253,6 MI; PREFEITURA DE SANTO AMARO; TCM-BA; 2024 R$ 242,4 MI ARRECADOU).
2. "Gastou 240": cofre abre com a pilha dourada; "Sobraram 2 milhões e 400" torre verde.
3. Setores 2024: as pilhas voam do cofre para cada casinha na hora da fala; câmera de casinha em casinha num sentido só; plaquinha ≥ 2,5 s.
4. 2025: pilha verde; "2 milhões e 200 a mais" torre vermelha; setores 2025 com as plaquinhas de 2024 ao lado. Cultura 2025 = R$ 0 (plaquinha vermelha).
5. 2026 até setembro: pilha rosa; "Sobraram 9 milhões e 500" torre verde; chip "JÁ COMPROMETIDO (EMPENHADO): R$ 306,4 MI"; setores 2026.
6. "Agora repara": gaveta esquerda FESTAS E EVENTOS 2025 (1 pilha = R$ 1 mi): previsto R$ 2,7 mi (branco), gasto R$ 11,9 mi (verde), só bandas R$ 6,7 mi (vermelho).
7. "Enquanto isso": gaveta direita (mesma escala): ajuda de emergência às famílias R$ 305 mil, Garantia Safra R$ 58 mil, meio ambiente R$ 0 (pilha fantasma).
8. "Os contratos temporários": atrás do cofre (1 pilha = R$ 5 mi) R$ 74,7 mi.
9. "A Câmara recebeu": (1 pilha = R$ 500 mil) recebeu R$ 8,9 mi; consultoria R$ 548 mil.
10. "E a dívida parcelada com o INSS": (1 pilha = R$ 20 mi) R$ 84,9 mi (fim de 2024) → R$ 228,7 mi (fim de 2025).
11. "No Tribunal de Contas": 6 pastas (temporários 2025 e 2026, pregão do transporte escolar, concorrência de infraestrutura, advogados sem licitação, + 5 processos), carimbo SEM JULGAMENTO; chip "9 DE 9 PRESTAÇÕES DE 2026 FORA DO PRAZO".
12. "Gastar com festa não é crime": voltam festas 2025 (R$ 11,9 mi) e ajuda às famílias 2025 (R$ 305 mil) lado a lado.
13. "Segue o @eumagnoleite": selo volta ao centro; plano aberto; fim em 178,9 s.

## Folhas "PDF" (depois do render, tools/lista_pdf aplicar)
Receita de cada ano (soma = total falado) e uma folha por setor falado (ações ou tipos de despesa, faixa de pessoal e diárias, Câmara com duodécimo recebido/devolvido, festas por tipo de despesa com previsto x gasto, dívidas por tipo, setor zerado com as ações previstas): 39 folhas. Scripts: ~/Documents/RECEITAS-DESPESAS-SANTOAMARO/scripts/folhas.py + folhas_fix.py.

## Sons
whoosh nas viradas de cena, tique nos estados, pop em cada número, ding nas sobras de 2024 e 2026 e no "Segue o", baque em gasto de festa, bandas, ajuda às famílias, meio ambiente zero, temporários, consultoria, INSS 2025, "nenhum foi julgado" e prestações fora do prazo.

## Escolhas do diretor
★ Previsto (branco) ao lado do gasto das festas: a diferença aparece de primeira.
★ Meio ambiente como pilha fantasma (transparente) com "R$ 0": o zero fica visível.
