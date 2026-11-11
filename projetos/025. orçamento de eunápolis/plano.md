# Plano de cenas: 025. orçamento de eunápolis (versão 1, aprovada antecipadamente em 05/11/2026)

A pessoa autorizou o plano e o vídeo final ("pode gerar os vídeos finais"). Revisão dos quadros feita pelo diretor.

Código `orcamentoeunapolis` · Nome `OrcamentoEunapolis` · Perfil @eumagnoleite. Mesma série do 014, 017, 020 e 022 a 024. **Só dados de Eunápolis.**

## 2.1 Narração
- `audio/narracao-norm.wav`: voz Adam (ElevenLabs v3), 1,3x, volume -15, **142,00 s** · `AUDIO_SEG = 142.0` · `QUADROS = 4287`.
- A 1ª frase e a pergunta final foram regeradas pela pessoa e emendadas nos silêncios (original guardado em `audio/antigos/`).
- 422 palavras (igual ao roteiro); a última termina em 141,86 s.
- quando(): números com vírgula ou ponto vão com a palavra de antes (`'esta em 45,7'`, `'Gastou 2.761'`, `'Recebeu 30,8'`).

## 2.2 Ideia e mundo
A maquete redonda da série com o cofre da prefeitura no meio; **1 pilha = R$ 5 milhões** (108 pilhas). Eunápolis não fica no mar: no fundo, morros verdes e uma faixa de mata (peça nova `MesaEunapolis`). As pilhas voam do cofre para o prédio de cada área na palavra do número; o previsto e o ano anterior aparecem em pilhas transparentes. Na "parte que quase ninguém vê" as pilhas das áreas afundam e o dinheiro volta agrupado: salários × obras. Depois, a régua do teto (45,7%), os copos dos pisos e o cofre com a sobra.

Mapa (Kit Mapas, `OrcamentoEunapolis`, 34,4 s): A, voo até Eunápolis, "R$ 539 MILHÕES", "GASTOS DE 2025", "PREFEITURA DE EUNÁPOLIS"; B, "R$ 550 MI ARRECADADOS", "IMPOSTOS DA CIDADE: MENOS DE 1 EM 5 REAIS", recua para ver Brasília e Salvador, setas, "UNIÃO · R$ 229 MI", "ESTADO", "FUNDEB", "MAIS QUE O DOBRO DOS IMPOSTOS DA CIDADE".

Mapa do mundo, principais: cofre [0,0,0] · escola [-6,3,-1,6] · saúde [-1,6,-5,6] · prefeitura [2,8,-5,4] · saneamento [6,7,-1,4] · rua [1,2,6,6] · meio ambiente [-5,4,4,4] · quadra de esporte [-4,0,6,0] · placa "?" da segurança [6,4,2,2] · Câmara [5,2,5,2].

## 2.3 a 2.4 Cenas (pílula)
EUNÁPOLIS 2025 e DE ONDE VEM (mapa) · PARA ONDE VAI · EDUCAÇÃO (189; fundamental 129 acende; 2024 170 transparente) · SAÚDE (166; previstos 123 transparentes; hospitais 100 em tom claro) · RUAS E SANEAMENTO (39 e 30) · ADMINISTRAÇÃO (50 × 26 das 5 áreas) · O QUE NÃO SAIU DO PAPEL (meio ambiente 12 × 3; esporte 69 mil × R$ 2.761, com lupa) · SEGURANÇA × CÂMARA (placa "?"; Câmara 17) · SALÁRIOS × OBRAS (274 × 33; previsto 7) · O TETO (45,7%; alerta 48,6; máximo 54) · OS PISOS (saúde 30,8 com o copo cheio; educação 26,3) · A SOBRA (11 mi) · E VOCÊ?

## 2.5 Fontes
Tudo em `audio/fontes.md` (PDF do portal de Eunápolis, com página). Selo em cada bloco.

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números, subida nas grades e na régua, baque no "gastou 3" e nos R$ 2.761, bip no "nem aparece", ding no alerta e nos pisos. Sem trilha.

## 2.7 Arquivos
Estúdio: `src/videos/orcamentoeunapolis/{OrcamentoEunapolis.tsx, pecas.tsx, palavras.ts}` (peças novas `MesaEunapolis`, `PlacaInterrogacao`, `QuadraMini`; o resto de `../orcamentoitabuna/pecas` e do catálogo; código-base do 024). Kit: `src/videos/orcamento-eunapolis/`, `scripts/dados-orcamento-eunapolis.py`; saída `projetos/025.../mapas/eunapolis.mp4`.
