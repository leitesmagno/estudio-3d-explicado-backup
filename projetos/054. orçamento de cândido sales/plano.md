# Plano · 054. orçamento de Cândido Sales

Aprovado no modo autônomo (pedido do Magno, `projetos/_coordenacao-sessoes.md`, Lote 2) em 08/11/2026. Molde: 035 Paratinga, pelo código do 053 Caetité.

- `audio/narracao-norm.wav`: **174,07 s**. Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 13 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,075, -15 LUFS. `AUDIO_SEG = 174.07` · `QUADROS = 5249`.
- Sincronia: 459 palavras do roteiro, última em 173,74 s. Whisper inventou "5." em 164,5 s (apagado); "Uma parte é folha" e "arroba eu magno leite" conferidos retranscrevendo o trecho. Original em `transcricao/palavras-original.json`.
- Código: `src/videos/orcamentocandidosales/OrcamentoCandidoSales.tsx` (composições `OrcamentoCandidoSales`, `OrcamentoCandidoSalesGuia`, `OrcamentoCandidoSalesLimpo`, `CapaOrcamentoCandidoSales`).
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-candidosales` (IBGE 2906709, conferido na API: "Cândido Sales") → `mapas/candidosales.mp4` (12,8 s). Etiqueta aponta para o centro do contorno do município.

## Ideia do mundo
Mesa redonda (sem rio). Cofre no centro. Em cada ano a pilha do ano nasce em volta do cofre na palavra "Gastou" (dourado 2024, verde 2025, rosa 2026) e, a cada setor falado, as pilhas voam para a casinha do setor. **1 pilha = R$ 3 mi** (orçamento de R$ 120 a 146 mi; escala no placar). 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e iluminação, Câmara, Dívidas e encargos, Cultura e festas (palco), Assistência social, Água e esgoto, Meio ambiente e desenvolvimento (árvores), Agricultura (trator, cinza) e Esporte (campo, cinza). Na frente do cofre: torre branca "R$ 2,2 MI SOBRARAM" (2024), torre branca "R$ 2,3 MI SOBRARAM" (2025), torre vermelha "EMPENHOU MAIS DO QUE ARRECADOU" (2026; altura = 134,7 − 104,1, número não dito nem escrito).

## Mapa das palavras-chave (tempo pela fala, `quando()`)
| palavra | s | objeto | o que acontece | cena |
|---|---|---|---|---|
| 0 a "Gastou 120" | 0–12,3 | Kit Mapas | voo até Cândido Sales, "PARA ONDE FOI CADA REAL?", "TCM-BA", "R$ 122,6 MI · ARRECADOU EM 2024" | mapa |
| Gastou 120 / Sobraram 2 milhões e 200 | 12,3 / 14,5 | cofre, pilha dourada, torre branca | | 2024 |
| setores 2024 | 16,4–37 | 10 casinhas | pilhas voam setor a setor; plaquinha em todos (água = R$ 0, só chip) | 2024 |
| 2025 / Arrecadou 148 / Gastou 146 e 400 / Sobraram 2 milhões e 300 | 39,1 / 40,3 / 42,7 / 45,2 | pilha verde, torre branca | | 2025 |
| setores 2025 | 47,2–70 | idem, com plaquinhas de 2024 | obras "QUASE R$ 2 MI" | 2025 |
| 2026 / Arrecadou 104 / Gastou 89 / já empenhou / Mais do que / folha | 71,7 / 73,2 / 74,8 / 77,1 / 81,4 / 82,7 | pilha rosa, torre vermelha | chips do empenhado e "PARTE É FOLHA QUE AINDA VAI VENCER" | 2026 |
| setores 2026 | 84,3–106 | idem | | 2026 |
| E os zeros / Água em 2024 / Agricultura / apoio / Esporte | 106,6 / 107,6 / 112,0 / 117,4 / 120,5 | água; trator e campo cinza sobem | chips com o motivo de cada zero | zeros |
| Agora repara / De 54 para 77 / Boa parte / saltou de 7 / quase 18 | 124,3–133 | gaveta "FUNDEB DA UNIÃO (VAAT)", 1 pilha = R$ 1 mi | 2 torres 7,1 e quase 18 | educação |
| E tem a parte / festas 2024, 2025, 2026 / pavimentação 2024, 2025, 2026 / licitação | 133,5–153 | gavetas "FESTAS POPULARES" e "PAVIMENTAÇÃO DE RUAS", 1 pilha = R$ 100 mil | torres 0,5 / 1,8 / 1,6 e 0,96 / 0,44 / R$ 0 | achado |
| No Tribunal / previdência / apuração / assessoria | 153,4 / 156,3 / 158,7 / 162,2 | prédio do TCM e 3 pastas | carimbo "SEM DECISÃO" nas três | tribunal |
| Gastar não é crime / Mas se a festa / e a pavimentação / prioridade | 165,0 / 166,1 / 168,9 / 170,5 | gavetas de volta | "R$ 1,6 MI FESTAS 2026" e "R$ 0 RUAS 2026" | pergunta |
| Segue o @eumagnoleite | 171,6 | mesa inteira | abre; fim | fim |

## Câmera (alvo, tamanho, direção; enquadramento automático da base)
- Cofre de cada ano: `DE_CIMA` → `COFRE` (alvo [0,0.4,1.3], 9,6 x 7,6, dir [0.1,1.2,1]).
- Setores: `OLHA_SETOR(i)` (borda, 4,9 x 4,8, de dentro da mesa, elevação 0,95), segurando 0,55 s em cada casinha, sempre no mesmo sentido.
- Zeros: sobe (`DE_CIMA`) e recomeça na água (índice 8), depois agricultura (10) e esporte (11): mesmo sentido.
- Educação: gaveta do centro 7 x 6,4 → torre 2024 → torre 2025 (PG 3,6–3,8).
- Achado: vista do miolo 10,5 x 7,6 → festas da esquerda para a direita → pavimentação da esquerda para a direita → plano médio na licitação.
- Tribunal: alvo [0,1,-1.4] 10,4 x 7,6 → pasta a pasta (3,3 x 3,2).
- Pergunta: mesa 12,5 x 9 → festa 2026 → pavimentação 2026 → mesa inteira 13,5 x 9,6.

## Fontes
Todas em `audio/fontes.md` (cópia em `~/Documents/FONTES/054. orçamento de cândido sales - fontes.md`). Selos: Balanço e Anexo 9 de 2024 e 2025; SIGA ago/2026; despesa por ação; Anexo 10 (receita); Concorrência 002/2026; TCM › Decisões › Auditoria.

## Sons e marca
Whoosh nas trocas de cena, pop em cada setor e em cada torre, ding nos "sobraram" e no fim, baque na torre vermelha de 2026 e no "R$ 0" da pavimentação 2026, tique nos zeros. Marca d'água @eumagnoleite (opacidade 0,16) quicando o vídeo todo.

## Arquivos
- Novos: `src/videos/orcamentocandidosales/OrcamentoCandidoSales.tsx`, `palavras.ts`; Kit Mapas `src/videos/orcamento-candidosales/` e `scripts/dados-orcamento-candidosales.py`.
- Alterados (só acréscimo de linhas): `src/Root.tsx` do Estúdio e do Kit Mapas.
- Reaproveitados: peças de `orcamentoitabuna/pecas`, `orcamentocanavieiras/pecas`, `orcamentoparatinga/pecas` (`BaseGaveta`, `PastaProcesso`), cofre e árvores de `src/pecas`.

## ★ Cuidados (o que é regra e o que é escolha)
- Regra: sem nome de gestor nem de empresa; sem porcentagem; segurança pública fora; Tribunal só com a fase (sem decisão).
- Regra (037): 2026 empenhado acima do arrecadado → não dizer "sobrou"; dizer "já empenhou… mais do que arrecadou" e, por justiça, "uma parte é folha que ainda vai vencer".
- Regra (044/051): pavimentação 2026 com R$ 0 liquidado → a fala diz "nada gasto até agosto" e cita a licitação de calçamento aberta em junho (não diz que a obra não existe).
- Escolha do diretor: "Obras e iluminação" = função Urbanismo + ação de iluminação e limpeza pública (que estava na Administração); "Meio ambiente e desenvolvimento" = função 23 (as duas secretarias estão lá; a função Gestão Ambiental é zero).
- Escolha do diretor: agricultura dita como "nenhuma ação com esse nome" (a Sec. de Desenvolvimento Econômico pode ter algum gasto no campo que as contas não separam).
- Escolha do diretor: Educação explicada pela complementação da União ao Fundeb (VAAT), para não parecer que a prefeitura "inventou" 23 milhões.
