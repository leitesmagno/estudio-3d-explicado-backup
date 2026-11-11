# Plano de cenas · 098. orçamento de floresta azul

Molde: 097 Buerarema / 093 Ilhéus / 092 Ubaitaba. Aprovado no modo autônomo (brief do lote de 40).
Código: `src/videos/orcamentoflorestaazul/OrcamentoFlorestaAzul.tsx` · Mapa: Kit Mapas `orcamento-florestaazul` (IBGE 2911006; satélite copiado do 097 Buerarema + npm run tiles: 37 compostos).
Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, sem atempo, -15 LUFS = 166,30 s.

## Mundo
Mesa redonda (maquete). Cofre no meio. 10 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Assistência social, Agricultura e meio ambiente, Cultura, Esporte. 1 pilha = R$ 1 mi. Dourado 2024, verde 2025, rosa 2026. Câmera anda num sentido só; na virada de ano sobe e volta ao cofre.

## Cenas (tempo pela fala, quando() no código)
| Fala | Tempo | O que acontece |
|---|---|---|
| abertura "Floresta Azul arrecadou..." | 0 a 20,7 s | Kit Mapas: voo do Brasil até Floresta Azul, as três receitas, "R$ 50,3 MI · arrecadou em 2024"; selo do @ grande que viaja ao cabeçalho |
| "Gastou 49" | 20,7 s | cofre sobe, pilha dourada; torre verde "R$ 454 MIL SOBRARAM" |
| setores 2024 | 25,6 a 47 s | pilhas voam para cada casinha; plaquinha em todos; folha do setor |
| 2025 | 47,5 s | pilha verde; torre vermelha "R$ 4,1 MI A MAIS"; setores 55,5 a 78 s; casinha do esporte fica cinza no "8 mil e 800" |
| 2026 até set | 78,6 s | pilha rosa; torre vermelha "R$ 3,9 MI A MAIS"; chip "já comprometido R$ 55,9 MI"; setores 89,3 a 113 s |
| "Agora repara" (esporte) | 113,6 s | gaveta da frente (1 pilha = R$ 250 mil): esporte 1,08 mi (2024, quadras) · 8,8 mil (2025) · 1 mil (2026) |
| "No mesmo tempo, a administração" | 124,0 s | câmera na casinha da Administração: torres e plaquinhas 6,6 mi (2024) e 10,9 mi (2025) |
| consultoria | 128,7 s | mesma gaveta da frente: consultoria 2,04 mi (2025) e 169 mil (2024) |
| Câmara x agricultura | 136,4 s | gaveta de trás: Câmara 2,2 mi x agricultura e meio ambiente 455 mil (2025) |
| IPTU | 142,8 s | pasta "IPTU · 2025 INTEIRO · R$ 3.327", carimbo "ARRECADADO NO ANO" |
| dívida | 148,3 s | gaveta de trás (1 pilha = R$ 1 mi): dívida 50,4 mi (INSS 38 mi, Embasa 8,8 mi) ao lado de "arrecadou em 2025: 54,9 mi" |
| pergunta final | 157,0 s | mesa; consultoria 2025 2 mi; esporte 2025 8,8 mil |
| "Segue o" | 163,6 s | selo do @ volta ao centro |

## Folhas (sem fala)
Receita de cada ano (soma = total) + uma por setor por ano (ações/elementos do PCMGE065; faixa de pessoal e diárias; Câmara com o repasse recebido e o devolvido). Margem de 90 px nas laterais (regra 73).

## Sons
whoosh nas viradas de cena, pop nos setores, subida no "gastou", baque nos números que caem (esporte 2025 e 2026, consultoria 2025, 5 vezes, IPTU, INSS, Embasa), ding no "sobraram" e no "Segue o", tique no carimbo.

## ★ Ideias extras
- Casinha do esporte fica cinza quando a voz diz "8 mil e 800" e segue cinza até o fim.
- Esporte e consultoria na MESMA gaveta e na mesma escala: a torre da consultoria de 2025 fica alta ao lado de um esporte quase invisível, sem precisar de conta.
- Dívida e receita de 2025 lado a lado, na mesma escala.
