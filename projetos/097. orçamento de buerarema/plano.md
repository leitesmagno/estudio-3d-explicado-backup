# Plano de cenas · 097. orçamento de buerarema

Molde: 093 Ilhéus / 092 Ubaitaba / 079 Nazaré. Aprovado no modo autônomo (brief do lote de 40).
Código: `src/videos/orcamentobuerarema/OrcamentoBuerarema.tsx` · Mapa: Kit Mapas `orcamento-buerarema` (satélite copiado do 042 Camacan + npm run tiles).
Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 14 partes + 0,35 s, pausas 0,28 s, sem atempo, -15 LUFS = 168,82 s.

## Mundo
Mesa redonda (maquete). Cofre no meio. 10 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura e festas, Assistência social, Agricultura e meio ambiente, Esporte (cinza: R$ 0 nos três anos). 1 pilha = R$ 2 mi. Dourado 2024, verde 2025, rosa 2026. Câmera anda num sentido só; na virada de ano sobe e volta ao cofre.

## Cenas (tempo pela fala, quando() no código)
| Fala | Tempo | O que acontece |
|---|---|---|
| abertura "Buerarema arrecadou..." | 0 a 17,7 s | Kit Mapas: voo do Brasil até Buerarema, as três receitas, "R$ 77,0 MI · arrecadou em 2024"; selo do @ grande que viaja ao cabeçalho |
| "Gastou 79" | 17,7 s | cofre sobe, pilha dourada; torre vermelha "R$ 2,9 MI A MAIS" |
| setores 2024 | 22,7 a 45 s | pilhas voam para cada casinha; plaquinha em todos (Esporte "R$ 0 · previsto R$ 0"); folha do setor |
| 2025 | 45,1 s | pilha verde; torre verde "SOBRARAM R$ 2,4 MI"; setores 52 a 73 s (Esporte "previa R$ 16.764") |
| 2026 até set | 73,1 s | pilha rosa; torre "COMPROMETIDOS A MAIS" (70,7 x 68,5); setores 83,8 a 106 s; Esporte "previa R$ 80 mil · gasto R$ 0" |
| "Agora repara" (festas) | 106,3 s | gaveta esquerda (1 pilha = R$ 250 mil): festas 3,2 / 4,6 / 3,4 mi; na frente agricultura e meio ambiente 237 / 304 / 213 mil; esporte R$ 0 |
| "Tem um detalhe" | 126,7 s | pasta "FESTAS POPULARES · AÇÃO 2.046 · 12.365" com carimbo FUNÇÃO EDUCAÇÃO → EDUCAÇÃO INFANTIL |
| Câmara x agricultura · dívida | 133,9 a 148 s | gaveta de trás: Câmara 3,4 mi x agricultura 304 mil (2025); dívida 85 mi (77 do INSS) ao lado de "arrecadou em 2025: 85 mi" (1 pilha = R$ 2 mi) |
| 2026 previsto | 148,7 s | 4 pastas: Natal sem Fome 198 mil, Segurança alimentar 322 mil, Habitação 403 mil, Proteção à criança 322 mil; carimbo "GASTO R$ 0" |
| pergunta final | 158,2 s | mesa; festas 2025 4,6 mi; esporte R$ 0; agricultura 2025 304 mil |
| "Segue o" | 166,2 s | selo do @ volta ao centro |

## Folhas (sem fala)
Receita de cada ano (até 17 linhas, soma = total) + uma por setor por ano (ações/elementos do PCMGE065; faixa de pessoal e diárias; Câmara com o repasse recebido). Esporte com as ações previstas e "gasto R$ 0,00" (regra 48). Margem de 90 px nas laterais (regra 73).

## Sons
whoosh nas viradas de cena, pop nos setores, subida no "gastou", baque nos números que caem (agricultura, esporte, 11 vezes, INSS), ding no "sobraram" e no "Segue o", tique nos carimbos.

## ★ Ideias extras
- Casinha do esporte cinza o vídeo inteiro (R$ 0 nos três anos), para o olho já estranhar antes da sacada.
- Dívida e receita de 2025 lado a lado, do mesmo tamanho: mostra sem conta que a dívida é quase um ano inteiro de arrecadação.
