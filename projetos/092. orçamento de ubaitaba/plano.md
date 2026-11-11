# Plano · 092. orçamento de ubaitaba (modo autônomo; aprovado pela própria sessão em 08/11/2026)
- Código: `src/videos/orcamentoubaitaba/OrcamentoUbaitaba.tsx` (composições `OrcamentoUbaitaba`, `OrcamentoUbaitabaGuia`, `OrcamentoUbaitabaLimpo`, `CapaOrcamentoUbaitaba`). Molde/REFERÊNCIA: 042 Camacan (regra 43).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-ubaitaba` (IBGE 2932200; satélite reaproveitado de orcamento-camacan) → `mapas/ubaitaba.mp4` (24,4 s), de 0 s até "gastou 102" (23,86 s).
- Áudio: 175,17 s; QUADROS = 5282. Palavras: 465, última em 174,74 s.

## Mundo
Maquete redonda (MesaMaquete sem rio). Cofre no centro; 11 casinhas na borda na ordem da fala: Educação (escola), Saúde (posto), Administração (prefeitura), Obras, limpeza e iluminação (rua com caminhão e gari), Câmara, Dívidas (banco), Cultura (palco), Assistência social, Meio ambiente e turismo (árvores), Esporte (campo), Agricultura (trator; cinza até 2026).
Escala: 1 pilha = R$ 2 mi (dourado 2024, verde 2025, rosa 2026). Miolo dos achados: 1 pilha = R$ 100 mil, branco = reservado.

## Cenas (câmera sempre no mesmo sentido)
| Trecho | Palavra (quando) | Tempo | O que acontece |
|---|---|---|---|
| Abertura (mapa) | início | 0–14,3 | voo Brasil → Ubaitaba; selo grande do @ viaja ao cabeçalho; tags das receitas 2024/2025/2026 na palavra; "TCM-BA" no "Tribunal" |
| 2024 (mapa) | "2024 A prefeitura" | 14,34 | "ARRECADOU EM 2024 R$ 95,7 MI"; "R$ 7,4 MI · VENDA DE IMÓVEIS" (18,64) e "O ORÇAMENTO PREVIA R$ 50 MIL" (21,98) |
| 2024 (3D) | "gastou 102" | 23,86 | cofre e pilha dourada; torre vermelha R$ 6,3 MI A MAIS (25,38); pilhas voam por setor (27,58–52,78); agricultura cinza "NEM UMA AÇÃO" |
| 2025 | "2025 Arrecadou" | 55,2 | de cima → cofre; pilha verde; torre vermelha R$ 677 MIL A MAIS (60,4); setores 62,94–82; agricultura "R$ 150 MIL → R$ 0" |
| 2026 | "2026 até setembro" | 86,54 | pilha rosa; torre "R$ 5,5 MI COMPROMETIDOS A MAIS" (93,92); setores 96,42–116,2; trator acende (305 mil) |
| Festas x ajuda | "Agora repara" | 118,16 | gaveta esquerda: festas 2025 (verde 1,2 mi) x benefícios eventuais (branco 167 mil, usado 26 mil); 2024: festas 1,4 mi x 9,8 mil |
| Câmara x agricultura · Rua 6 | "No mesmo 2025" | 135,86 | gaveta direita: Câmara 3,6 mi x agricultura R$ 0 (reservado 150 mil); três torrinhas brancas da Rua 6 (2024/2025/2026) "R$ 0 GASTO" |
| Tribunal | "No Tribunal de Contas" | 148,76 | prédio do TCM, 4 pastas (Terceirizados·Fundeb, Licitações, Acumulação de cargos, Transparência) com carimbo neutro "NO TCM-BA" |
| Pergunta | "Gastar não" | 162,5 | mesa inteira → festas 2025 x ajuda 26 mil; "Segue o" (172,66): selo do @ volta ao meio |

Repetidas no quando(): "arrecadou 95" (abertura) → usar "A prefeitura arrecadou"; setores com ocorrência 1/2/3; "Agricultura" 4ª vez = "A agricultura zero".
Interface: CabecalhoCidade "UBAITABA" (selo que viaja), marca d'água quicando, chips no topo (y 520), selo da fonte (y 400), plaquinhas presas às torres (y ≥ 730), legenda.
Folhas PDF (depois do render, tools/lista_pdf): receita por ano + folha por setor (ações/elementos) + Câmara com duodécimo; reservar o canto livre.
★ Escolha do diretor: torres brancas fantasma para o "reservado" (167 mil, 150 mil, Rua 6) ao lado do usado, para o zero ficar visível.
