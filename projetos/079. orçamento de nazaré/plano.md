# Plano de cenas · 079. orçamento de nazaré

Molde: 072 Mata de São João / 092 Ubaitaba. Aprovado no modo autônomo (brief Ubaitaba/Camacan, item 11).
Código: `src/videos/orcamentonazare/OrcamentoNazare.tsx` · Mapa: Kit Mapas `orcamento-nazare` (satélite copiado do 068 Santo Antônio de Jesus).
Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, atempo 1,115, -15 LUFS = 178,16 s.

## Mundo
Mesa redonda (maquete). Cofre no meio. 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura e festas, Assistência social, Ordem pública e trânsito, Comércio e turismo, Agricultura e meio ambiente, Esporte. 1 pilha = R$ 4 mi. Dourado 2024, verde 2025, rosa 2026. Câmera anda num sentido só; na virada de ano sobe e volta ao cofre.

## Cenas (tempo pela fala, quando() no código)
| Fala | Tempo | O que acontece |
|---|---|---|
| abertura "Nazaré arrecadou..." | 0 a 18,7 s | Kit Mapas: voo do Brasil até Nazaré, as três receitas, etiqueta "R$ 181,7 MI · arrecadou em 2024"; selo do @ grande que viaja ao cabeçalho |
| "Gastou 191" | 18,7 s | cofre sobe, pilha dourada nasce; torre vermelha "R$ 9,6 MI A MAIS" |
| setores 2024 | 22,9 a 47,5 s | pilhas voam do cofre para cada casinha; plaquinha em todos; folha do setor |
| 2025 | 47,5 s | pilha verde; torre verde "SOBRARAM R$ 5,5 MI"; setores 55 a 79 s |
| 2026 até set | 79,7 s | pilha rosa; torre "COMPROMETIDOS A MAIS" (145,6 x 102,8); setores 89 a 117 s; Comércio e turismo com plaquinha "R$ 0 · turismo previa R$ 181 mil" |
| "Agora repara" (Fundeb) | 117,4 s | gaveta esquerda (1 pilha = R$ 2 mi): Fundeb 92,2 x 48,1; educação infantil 22,3 x 9,5 |
| festas x ajuda | 130,9 s | gaveta direita (1 pilha = R$ 250 mil): festas 3,1 / 3,8 / 2,9; na frente, ajuda 34 / 149 / 233 mil |
| Câmara x agricultura · dívida | 143 a 155 s | gaveta de trás: Câmara 4,3 x agricultura 522 mil (2025); dívida 89,6 → 94,6 mi |
| Tribunal | 155,4 s | prédio do TCM e 2 pastas: juros e multas ao INSS (2020, MULTA → MULTA MANTIDA), auditoria da vacinação (2024, FALHAS · RECOMENDAÇÕES) |
| pergunta final | 167,6 s | mesa; Fundeb 92,2 x 48,1; festas 3,8; ajuda 149 mil |
| "Segue o" | 175,7 s | selo do @ volta ao centro |

## Folhas (sem fala)
39 folhas (tools/lista_pdf): receita de cada ano (17 linhas, soma = total) + uma por setor por ano (ações/elementos do PCMGE065; faixa de pessoal e diárias; Câmara com o duodécimo). Margem de 90 px nas laterais (regra 73).

## Sons
whoosh nas viradas de cena, pop nos setores, subida no "gastou", baque nos números que caem, ding no "sobraram" e no "Segue o".

## ★ Ideias extras
- Placar de escala muda por gaveta (R$ 2 mi x R$ 250 mil) para não enganar no tamanho das torres.
