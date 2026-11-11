# Plano de cenas: 023. orçamento de salvador (versão 1, aprovada antecipadamente em 04/11/2026)

A pessoa aprovou seguir sem pausas ("Tudo aprovado! Pode gerar os 3 videos sem parar cada etapa"). Revisão dos quadros feita pelo diretor.

Código `orcamentosalvador` · Nome `OrcamentoSalvador` · Perfil @eumagnoleite. Mesma série do 014, 017 e 020, com os dois kits.
**Regra deste vídeo:** só dados de Salvador. Todo número na tela vem de `audio/fontes.md` (PDFs do Portal da Transparência de Salvador, com página).

## 2.1 Narração
- `audio/narracao-norm.wav`: voz Adam (ElevenLabs v3), 1,3x, volume -15, **147,18 s** · `AUDIO_SEG = 147.18` · `QUADROS = 4442`.
- 402 palavras (igual ao roteiro); a última termina em 147,00 s. Voz completa (conferida frase por frase).
- `quando()` tira vírgula e %: trechos com a palavra de antes (`'gastou 11,9'`, `'2,9 bilhoes'`, `'sido 2,5'`, `'Em 2024 2,6'`, `'em 29,5'`, `'ate 54'`, `'Recebeu 23,2'`).

## 2.2 Ideia e mundo
A maquete redonda da série, com o cofre da prefeitura no meio e **1 pilha = R$ 100 milhões** (119 pilhas). O mar fica no fundo à direita (mesa do 014) e um horizonte de prédios genéricos no fundo à esquerda. Cada área ganha o seu prédio, e as pilhas voam do cofre na palavra do número. Pilhas transparentes mostram o previsto ou o ano anterior. Em "a parte que quase ninguém vê", o centro vira palco: 10 moedas (3 acendem para salários), a grade de obras, esporte e agricultura (com lupa), a régua do teto, os copos dos pisos e o cofre de volta com a sobra.

Trechos de mapa (Kit Mapas, `OrcamentoSalvador`, 31,6 s): A, do Brasil até Salvador (R$ 11,9 BILHÕES, GASTOS DE 2025, PREFEITURA DE SALVADOR); B, na cidade (ARRECADADO EM 2025: R$ 12,4 BI; impostos da cidade, pouco mais de 1 em 3) e depois recua (O RESTO VEM DE FORA: seta de Brasília, UNIÃO · R$ 3,3 BI; a Bahia acende; FUNDEB).

Mapa do mundo, principais: cofre [0,0,0] · saúde [-2,2,-5,6] · escola [-6,2,-2] · previdência [1,-6] · prefeitura [6,2,-2,6] · rua [-3,6,4,7] · ponto e ônibus [1,5,05] · guarda [6,6,0,4] · Câmara [6,2,3] · palco central (moedas z 1,5; obras [0,3]; esporte [-1,8,0,2]; agricultura [1,8,0,2]).

## 2.3 a 2.4 Cenas (pílula · eventos)
SALVADOR 2025 (mapa A) · DE ONDE VEM (mapa B) · PARA ONDE VAI (mesa toda, pilhas nascem) · SAÚDE (2,9 bi; metade, 1,5 bi, acende) · EDUCAÇÃO (2,4 bi; 2024: 2,5 transparentes; −76 mi afunda em marsala) · RUAS E SERVIÇOS (2 bi; 2024: 2,6 transparentes) · PREVIDÊNCIA E ADMINISTRAÇÃO (798 mi com 3 aposentados de bengala; 555 mi × 424 mi de assistência, cultura e meio ambiente) · TRANSPORTE (617 previstos transparentes × 201; ônibus 491 × 128) · SEGURANÇA × CÂMARA (125 × 284, mais que o dobro, guarda e Câmara no mesmo quadro) · SALÁRIOS × OBRAS (10 moedas, 3 acendem: 3,7 bi; obras 930 mi × 1,6 bi previstos) · ESPORTE E AGRICULTURA (29 previstos × 91; 86 mil com lupa, 3 centavos por morador) · O TETO (régua 29,5% de 54%) · OS PISOS (copos 23,2% / 15 e 25,7% / 25; Tribunal de Contas dos Municípios) · A SOBRA (486 mi no cofre) · E VOCÊ? (mesa inteira, prédios acendem, COMENTA AQUI, @eumagnoleite).

## 2.5 Fatos e fontes
Tudo em `audio/fontes.md`. Selo de fonte em cada bloco com anexo e página. Contas próprias na tela: R$ 85.760 ÷ 2.610.987 moradores = R$ 0,03.

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números e pilhas, subida nas grades transparentes e na régua, baque no −76 mi, no "mais que o dobro" e nos 3 centavos, ding no triplo, no "bem abaixo do teto" e nos pisos.

## 2.7 Arquivos
- Estúdio: `src/videos/orcamentosalvador/{OrcamentoSalvador.tsx, palavras.ts}`; peças reaproveitadas de `../orcamentoitabuna/pecas`, `../orcamentoilheus/pecas` (mesa com mar), `../orcamentosp/pecas` (TorresSP, PredioPrevidencia), `../onibusilheus/pecas` e do catálogo.
- Kit Mapas: `src/videos/orcamento-salvador/`, `scripts/dados-orcamento-salvador.py`; saída `mapas/salvador.mp4`.
- 4.442 quadros.

## 2.8 Origem das escolhas
Regras: mesmo mundo da série; só documentos de Salvador; um OffthreadVideo para os trechos de mapa; selos no topo; linha do 014; um número de cada vez; neutro.
Escolhas do diretor: o mar ao fundo para ser Salvador; as 10 moedas para "3 de cada 10"; a lupa nos 86 mil da agricultura.
