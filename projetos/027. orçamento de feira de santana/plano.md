# Plano de cenas: 027. orçamento de feira de santana (versão 1, aprovada antecipadamente em 05/11/2026)

A pessoa autorizou o plano e o vídeo final ("pode gerar os vídeos finais"). Revisão dos quadros feita pelo diretor.

Código `orcamentofeira` · Nome `OrcamentoFeira` · Perfil @eumagnoleite. Dois kits, mesma série do 014, 017, 020 e 022 (código base: o 022).

## 2.1 Narração
- `audio/narracao-norm.wav`: 161,80 s (1,3x) · `AUDIO_SEG = 161.8` · `QUADROS = 4881`. 453 palavras, igual ao roteiro.
- `quando()` tira vírgula e %: trechos com a palavra de antes (`'ate 54'`, `'esta em'`, `'limite prudencial'`, `'Recebeu', 2`).

## 2.2 Ideia e mundo
Maquete redonda da série com o cofre no meio. **1 pilha = R$ 20 milhões** (116 pilhas), porque o orçamento é grande (com R$ 10 milhões seriam 232 pilhas, pesado demais). Torres de cidade grande ao fundo (`TorresSP`, genéricas). Fase 1: as pilhas voam do cofre para cada área na palavra do número. Fase 2 ("a parte que quase ninguém vê"): o dinheiro todo volta ao anel; salários acendem; obras e dívida voam; o previsto de obras em pilhas transparentes. Depois: régua do teto (51,9%, faixa do prudencial acende), copos dos pisos, cofre com a sobra.
Trechos de mapa (Kit Mapas `OrcamentoFeira`, 35,6 s): A, voo até Feira de Santana, R$ 2,32 BILHÕES; B, arrecadou R$ 2,43 BI, menos de 1 em 4 dos impostos, setas de Brasília (UNIÃO · R$ 661 MI) e de Salvador (ESTADO), Fundeb, "MAIS QUE TODOS OS IMPOSTOS DA CIDADE".

## 2.3 a 2.4 Cenas (pílula)
FEIRA DE SANTANA 2025 · DE ONDE VEM · PARA ONDE VAI · SAÚDE (686; 405 hospitais) · EDUCAÇÃO (587; fundamental 307; creches 158; 2024: 601) · URBANISMO (295; ônibus 50 × 27 previstos) · ADMINISTRAÇÃO (126 × 4 áreas 68) · FICOU NO PAPEL (trabalho 4,3 mi × 16 mil; habitação 3 mi × 90 mil) · SEGURANÇA × CÂMARA (337 mil × 51 mi) · SALÁRIOS × OBRAS (735; obras 65 × 284; dívida 86) · O TETO (51,9%; prudencial 51,3; máximo 54; proibições) · OS PISOS (34,9 / 15; 25,8 / 25) · A SOBRA (107) · E VOCÊ?

## 2.5 Fatos e fontes
Todos em `audio/fontes.md` (PDFs do portal de Feira de Santana, com página). Selo de documento e página em cada bloco. Só dados de Feira de Santana.

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números, baque no "caiu", nos 16 mil, nos 90 mil, no "150 vezes" e no prudencial, ding no fim. Sem trilha.

## 2.7 Arquivos
Estúdio: `src/videos/orcamentofeira/OrcamentoFeira.tsx` (peças de ../orcamentoitabuna/pecas e ../orcamentosp/pecas). Kit: `src/videos/orcamento-feira/`, `scripts/dados-orcamento-feira.py`, mapa em `projetos/027.../mapas/feira.mp4`.
