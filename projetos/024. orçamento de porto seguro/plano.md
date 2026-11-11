# Plano de cenas: 024. orçamento de porto seguro (versão 1, aprovada antecipadamente em 04/11/2026)

A pessoa aprovou o plano e o vídeo final sem pausas ("Pode gerar os 3 videos sem parar cada etapa"). Revisão dos quadros feita pelo diretor.

Código `orcamentoportoseguro` · Nome `OrcamentoPortoSeguro` · Perfil @eumagnoleite. Mesma série do 014, 017 e 020. **Só dados de Porto Seguro** (PDF do portal: "RREO 6º bim. 2025 e RGF 3º quadr. 2025", Diário Oficial de 30/01/2026; RREO 6º bim. 2024 para as comparações).

## 2.1 Narração
- `audio/narracao-norm.wav`: voz gerada de uma vez, 1,3x, volume -15, **130,25 s** · `AUDIO_SEG = 130.25` · `QUADROS = 3934`.
- 387 palavras (igual ao roteiro); a última termina em 130,08 s. Voz conferida frase por frase (completa).
- Números com vírgula ou % no `quando()`: `'Recebeu 15,8'`, `'ficou com 2,6'`, `'ate 54'`, `'esta em 48'`, `'Perto do limite'` (o 48,6).

## 2.2 Ideia e mundo
Maquete redonda da série com o cofre no meio e **1 pilha = R$ 10 milhões** (115 pilhas). Ao fundo, a faixa de praia, o mar e coqueiros (peças novas `MesaPortoSeguro`, `Coqueiro`). Cada área ganha o seu prédio e as suas pilhas; o previsto aparece em pilhas transparentes ao lado do gasto. Em "a parte que quase ninguém vê", as pilhas das áreas afundam e o mesmo dinheiro reaparece por tipo de gasto: salários (55,4 pilhas), obras e equipamentos (13,8) e dívida (6,7, com 2,4 transparentes de 2024). Depois vêm a régua do teto (48%, alerta 48,6, máximo 54), os copos dos pisos e o cofre de volta com a sobra (meia pilha).

Trechos de mapa (Kit Mapas, `OrcamentoPortoSeguro`, 34,6 s): A, do Brasil até Porto Seguro (R$ 1,15 BILHÃO, GASTOS DE 2025, PREFEITURA DE PORTO SEGURO); B, na cidade (R$ 1,155 BILHÃO ARRECADADOS EM 2025; IMPOSTOS DA CIDADE: 1 DE CADA 4 REAIS) e recuo para Brasília (GOVERNO FEDERAL) e Salvador (ESTADO), FUNDEB, EMPRÉSTIMOS: R$ 100 MI, PREVISTO: R$ 30 MI.

Mapa do mundo: cofre [0,0,0] · escola [-6,3,-1,6] · saúde [-1,6,-5,6] · prefeitura [2,6,-5,4] · saneamento [6,7,-1,4] · turismo (quiosque novo) [-6,8,2,4] · guarda [6,8,2,2] · Câmara [5,2,5,2] · cultura [1,2,6,6] · banco da dívida [4,2,-1,4] · salários/obras/dívida no centro · régua e copos no centro.

## 2.3 a 2.4 Cenas (pílula)
PORTO SEGURO 2025 (mapa A) · DE ONDE VEM (mapa B) · PARA ONDE VAI · EDUCAÇÃO (quase 400; 3 moedas, 1 acesa) · SAÚDE (195; previstos 150) · ADMINISTRAÇÃO (128 × 45 das quatro áreas) · SANEAMENTO (85; previsto 39) · TURISMO (previstos 15 × 44) · SEGURANÇA × CÂMARA (R$ 0; policiamento 808 mil na administração; Câmara 26, cultura 2,6) · SALÁRIOS × OBRAS (554, 138, dívida 67, 2024: 24) · O TETO (48%) · OS PISOS (26% e 15,8%) · A SOBRA (5 mi) · E VOCÊ? (mesa inteira, prédios acendem, comentário e @eumagnoleite). Câmeras em `CENAS` no código.

## 2.5 Fontes
Tudo em `audio/fontes.md`, com página. Selos na tela: Anexo 1 p. 1 e 2; Anexo 2 p. 4 a 8; RGF p. 44; mínimos p. 41 e 42; 2024 p. 22.

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números e nas pilhas, subida no previsto e na régua, baque no "zero", no "10 vezes" e no 2024, ding no "quase o triplo" e nos pisos.

## 2.7 Arquivos
- Estúdio: `src/videos/orcamentoportoseguro/{OrcamentoPortoSeguro.tsx, pecas.tsx, palavras.ts}`; peças novas `MesaPortoSeguro`, `Coqueiro`, `QuiosqueTurismo`; o resto do 017 e do catálogo.
- Kit Mapas: `src/videos/orcamento-porto-seguro/`, `scripts/dados-orcamento-porto-seguro.py`; saída `mapas/porto-seguro.mp4`.

## 2.8 Origem das escolhas
Regras: mesmo mundo da série; só documentos de Porto Seguro; um OffthreadVideo para os trechos de mapa; selos no topo; cidade no litoral com etiquetas puxadas para a terra; números lado a lado um de cada vez; neutro. Escolhas do diretor: praia e coqueiros para ser Porto Seguro; quiosque de turismo; o dinheiro reagrupado por tipo de gasto na "parte que quase ninguém vê".
