# Plano de cenas · 134. orçamento de Candiba

Modo autônomo (Lote LARANJA, L23): plano aprovado por mim, igual ao molde 132 Abaíra (que segue o 093 Ilhéus e o 125 Senhor do Bonfim). Narração Google Algenib, 177,72 s; vídeo de 178,6 s (5.358 quadros a 30 fps). Composições: OrcamentoCandiba, OrcamentoCandibaGuia, OrcamentoCandibaLimpo e CapaOrcamentoCandiba.

## Ideia do mundo
Kit Mapas na abertura (voo do Brasil até Candiba, receitas dos 3 anos, contas no TCM-BA e receita de 2025 com plaquinhas na palavra) e, a partir de "Gastou 62", a maquete redonda do molde: cofre no centro, 12 casinhas dos setores em volta da mesa NA ORDEM DA FALA, pilhas do ano em volta do cofre (dourado 2024, verde 2025, rosa 2026; 1 pilha = R$ 1 mi) que voam para a casinha de cada setor na palavra do setor. Torre verde do que sobrou ao lado do cofre. Atrás do cofre, a gaveta da Câmara (1 pilha = R$ 200 mil); na frente, a gaveta "FESTAS x ASSISTÊNCIA SOCIAL" (1 pilha = R$ 250 mil, mesma escala para tudo).

Regras: setor zerado (Cultura 2025 e 2026) com plaquinha vermelha "R$ 0" e chip "CULTURA: R$ 0 FORA AS FESTAS"; plaquinhas dos anos anteriores junto em cada setor; texto a 90 px das laterais; nada some antes da fala; folha "PDF" translúcida por ano (receita) e por setor (despesa), sem fala.

## Mapa do mundo (raio 7,45 da mesa)
Ângulo do setor i = 0,12π + i × 0,152π: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas e encargos, Festas e eventos (palco), Cultura (colunas), Assistência social, Água e saneamento (estação de saneamento, setor novo em relação ao 132), Agricultura (trator), Esporte e lazer (campo). Enfeites (casinha e duas árvores) no vão entre o Esporte e a Educação.
Gaveta da Câmara: z = -2,0, x de -3,0 a 0,75 (recebeu 2024, gastou 2024, devolveu 2024, recebeu 2025, devolveu 2025: em 2025 a voz não diz o gasto, então não há pilha de gasto).
Gaveta das festas: z = 0,2, x de -5,2 a 0,4 (previsto e gasto 2024, 2025, 2026 até set e a assistência social de 2025).

## Palavras-chave (tempo = palavras.ts; conferido com checa_quando.py)
| Palavra (quando) | Tempo | Objeto | O que acontece | Cena |
|---|---|---|---|---|
| "65 milhões em" / "71 milhões e 900 em" / "49 milhões e 900 até" | 0,76 / 3,00 / 5,62 | etiquetas do mapa | entram as três receitas | mapa A |
| "Tudo vem" / "Tribunal" | 8,76 / 10,38 | etiquetas | contas de Candiba no TCM-BA | mapa A |
| "Em 2025, o FPM" … "Só o IPTU" | 12,02 a 34,80 | 8 etiquetas | FPM 28,0 · SUS 10,5 · Fundeb 11,0 · União no Fundeb 7,6 · ICMS 4,7 · impostos e taxas 4,2 · IPTU previsto 184 mil · arrecadado 14 mil (vermelho) | mapa A |
| "2024. Arrecadou 65" | 35,22 / 36,34 | número grande | R$ 65,1 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 62" | 38,02 | cofre e pilha dourada | maquete entra, pilha nasce | 2024 |
| "Sobraram 2 milhões e 800" | 40,14 | torre verde | sobrou | 2024 |
| setores 2024 | 42,26 a 67,78 | casinhas | pilhas voam, plaquinhas | 2024 |
| "2025 Arrecadou 71" / "Gastou 69" / "Sobraram 2 milhões e 100" | 70,06 / 74,10 / 77,00 | cofre | pilha verde, torre verde | 2025 |
| setores 2025 ("os 290 mil" no zero da Cultura, 93,98) | 78,66 a 104,46 | casinhas | plaquinhas 2024 + 2025 | 2025 |
| "2026 até setembro Arrecadou" / "Gastou 49" | 107,18 / 111,24 | cofre | pilha rosa | 2026 |
| setores 2026 | 113,36 a 138,62 | casinhas | plaquinhas dos três anos | 2026 |
| "E a Câmara" / "Em 2024 recebeu" / "gastou 1 milhão e 600" / "e devolveu 875" / "Em 2025 recebeu" / "e devolveu 801" | 140,66 a 151,14 | gaveta da Câmara | pilhas e plaquinhas | Câmara |
| "E as festas" / "previa 1 milhão e 100" / "e gastou 3 milhões" / "previa 1 milhão e 800" / "e gastou 3 milhões e 500" / "Em 2026 previa" / "já foram" | 152,90 a 166,22 | gaveta das festas | previsto (claro) x gasto (cor do ano) | festas |
| "Gastar não" / "Mas se a assistência" / "por que as festas" / "Segue o" | 167,76 / 168,76 / 172,68 / 175,06 | assistência 2025 x festas 2025 | comparação na mesma escala; fecho na mesa | pergunta |

## Câmera (enquadramento automático da base, sempre andando no mesmo sentido)
- Mapa: Brasil → Candiba (Kit Mapas, sem câmera 3D).
- Cada ano: sobe na virada ("DE_CIMA"), vai ao cofre ("COFRE", alvo [0; 0,4; 1,3], 9,6 × 7,6) e passa de casinha em casinha (OLHA_SETOR, alvo a 6,9 do centro, 4,9 × 4,8, segurando 0,55 s em cada uma), na ordem da fala.
- Câmara: alvo [-1,1; 1,0; -2,0], 7,0 × 6,0, depois pares recebeu/gastou/devolveu de perto (3,4 a 3,6 × 5,2).
- Festas: alvo [-2,4; 0,8; 0,6], 9,4 × 7,0, depois cada par previsto x gasto (3,4 × 5,4 a 6,0).
- Pergunta: mesa inteira, assistência 2025 de perto, depois festas 2025 + assistência 2025 juntas (6,4 × 7,0) e fecho aberto.

## Sons
whoosh em cada troca de cena, tique em cada virada, pop em cada número e setor, subida no "gastou", ding no "sobraram", baque nos "devolveu" e nos gastos das festas, ding no "Segue o".

## Fontes
audio/fontes.md (todos os números, PDF, página e linha).

## Arquivos
- Novo: src/videos/orcamentocandiba/OrcamentoCandiba.tsx (cópia adaptada do 132) e palavras.ts; Root.tsx (4 composições).
- Kit Mapas: src/videos/orcamento-candiba/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-candiba.py, satélite copiado de Guanambi; Root.tsx do Kit (OrcamentoCandiba).
- Reaproveitados: peças de orcamentoitabuna (MesaMaquete, PilhasDinheiro, Escola, PostoSaude, Prefeitura, RuaServicos, CamaraVereadores, BancoDivida, PredioAssistencia, EstacaoSaneamento), PredioTexto (canavieiras), BaseGaveta (paratinga), CabecalhoCidade.
- Folhas: ~/Documents/RECEITAS-DESPESAS-CANDIBA/scripts/folhas_cand.py → saida/folha-pdf/config-setores.json.
