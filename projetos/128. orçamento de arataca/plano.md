# Plano de cenas · 128. orçamento de arataca (modo autônomo, molde 116 Piatã / 115 Caculé / 093 Ilhéus)

Narração: 177,06 s (Algenib). Vídeo: 177,06 + 0,9 s = 5.339 quadros. Código: `src/videos/orcamentoarataca/OrcamentoArataca.tsx`.

## Mundo
A mesma maquete redonda do lote: o COFRE no meio, a pilha do ano em volta dele (1 pilha = R$ 1 mi, ~55 a 77 mi por ano) e as 10 casinhas dos setores na borda, na ordem da fala. Quando a voz diz um setor, as pilhas voam para a casinha e a câmera anda num sentido só, segurando 0,55 s em cada casinha.

## Abertura (0 a 21,4 s): Kit Mapas `OrcamentoArataca` → `mapas/arataca.mp4`
Brasil → sul da Bahia → contorno de Arataca (IBGE 2902252). Tags: R$ 75 MI 2024, R$ 61,9 MI 2025, R$ 57,5 MI 2026 até set, PREFEITURA DE ARATACA, TCM-BA; depois "2024" e "R$ 75 MI ARRECADOU EM 2024" e, no "16 milhões e 800", "R$ 16,8 MI DO PRECATÓRIO DO FUNDEF". Selo grande do @eumagnoleite nos primeiros segundos (CabecalhoCidade).

## Os três anos (21,4 s a "Agora repara")
| Palavra | O que acontece |
|---|---|
| Gastou 77 milhões e 400 | pilha dourada nasce em volta do cofre; chip GASTOU EM 2024 |
| Gastou 2 milhões e 400 a mais | torre vermelha na frente do cofre, plaquinha R$ 2,4 MI A MAIS |
| Educação … Esporte (2024) | as pilhas voam para cada casinha; plaquinha com o valor |
| 2025 … Gastou 5 milhões e 800 a mais | pilha verde; torre vermelha; setores de 2025 (plaquinhas de 2024 relembradas ao lado) |
| 2026 … Sobraram 2 milhões e 600 · já comprometeu 58,3 | pilha rosa; torre verde do que sobrou; chip do empenhado; setores de 2026 |

## Achados (miolo)
| Palavra | Objeto | Escala |
|---|---|---|
| As festas tradicionais 3,3 (2024) / 3,2 (2025) | gaveta FESTAS x AJUDA ÀS FAMÍLIAS (frente, à esquerda): torre dourada e verde | 1 pilha = R$ 200 mil |
| 1 milhão e 100 … na conta da educação | torre verde-clara dos festejos juninos com plaquinha NA CONTA DA EDUCAÇÃO | idem |
| só as festas passaram toda a assistência social | torre azul da assistência social 2025 (3,1) ao lado das festas de 2025 | idem |
| ajuda de emergência 90 mil / 368 mil / 1,4 mi (2026) | três torrinhas vermelhas crescendo | idem |
| e as festas caíram para 167 mil | torrinha rosa das festas de 2026 | idem |
| A Câmara recebeu 2,6 / devolveu 232 mil / consultoria 212,5 mil e 153 mil | gaveta CÂMARA (atrás do cofre, à esquerda) | 1 pilha = R$ 200 mil |
| INSS 31,8 → 35,4 → 34 | gaveta DÍVIDA COM O INSS (atrás, à direita) | 1 pilha = R$ 5 mi |
| 7 processos … ainda esperam julgamento | ★ fila de 7 pastas de processo (PastaProcesso) no meio da mesa, cada uma sobe na palavra do assunto, carimbo SEM JULGAMENTO; câmera de frente e baixa, de duas em duas | sem valores |
| Gastar não é crime … por que as festas levaram 3 milhões e 200? | volta às festas: ajuda 2025 (368 mil) x festas 2025 (3,2 mi) | |

## Câmera
Igual ao molde: vista geral, cofre em cada ano, de casinha em casinha; achados com enquadramento de perto por par de torres; pastas filmadas de frente (dir y 1,2).

## Fontes e sons
Selos de fonte por trecho (Balanço, PCMGE015, Anexo 16, consulta de processos do TCM). Sons do molde (pop nos números, baque nos contrastes, ding no fim).

## Arquivos
Peças: MesaMaquete, PilhasDinheiro, CofreFGTS, casinhas do orcamentoitabuna/canavieiras, BaseGaveta e PastaProcesso do orcamentoparatinga, CabecalhoCidade. Folhas "PDF": 3 de receita + 30 por setor (scripts/folhas.py).

Aprovado no modo autônomo (10/11/2026).
