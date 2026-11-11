# Plano de cenas: 020. orçamento de são paulo (versão 1, aprovada antecipadamente em 04/11/2026)

A pessoa autorizou o plano e o vídeo final junto com o roteiro ("pode elaborar o plano de cena, que vou aprovar tbm, e pode gerar o video final"). Revisão dos quadros feita pelo diretor.

Código `orcamentosp` · Nome `OrcamentoSp` · Perfil @eumagnoleite. Vídeo com os dois kits, mesma série do 014 e do 017.

## 2.1 Narração
- `audio/narracao-norm.wav`: voz Adam (ElevenLabs v3), 1,3x, volume -15, **180,41 s** · `AUDIO_SEG = 180.41` · `QUADROS = 5439`.
- A primeira geração pulou trechos em 7 lugares. Foram gerados 3 blocos novos e emendados nos silêncios (95,13 s, 121,10 s, 146,15 s, 153,57 s e 188,28 s do original). Original com falhas em `audio/antigos/`.
- 501 palavras (igual ao roteiro); a última termina em 180,26 s.
- Repetidas e números com vírgula (o `quando()` tira a vírgula: "2,3" vira "23"): `'levou 2,3'`, `'ate 54'`, `'1,3 bilhao', 2` (saneamento), `'15 bilhoes previstos'`, `'6 bilhoes'` (a sobra).

## 2.2 Ideia e mundo
A maquete redonda da série, com o cofre da prefeitura no meio e **1 pilha = R$ 1 bilhão** (117 pilhas). Ao fundo, um horizonte de torres (peça nova `TorresSP`, sem prédio real) e o rio da maquete. Cada área ganha o seu prédio e as suas pilhas voam do cofre na palavra do número. As áreas menores ficam numa **vitrine de 10 pedestais** no centro, com uma lista de barras em 2D por cima. "O que ficou no papel" usa pilhas transparentes do previsto ao lado das pilhas do gasto. Depois vêm a régua do teto (27% de 54%), os copos dos mínimos e o cofre de volta com a sobra de 6 bilhões.

Trechos de mapa (Kit Mapas, `OrcamentoSp`, 42,4 s): A, do Brasil até o município de São Paulo (R$ 117 BILHÕES, quase R$ 10 mil por morador, as duas perguntas da abertura); B, seta de Brasília (União ≈ 5 bi), estado de SP aceso (12 bi), Fundeb (8 bi), volta para a cidade (impostos 67 bi, 6 de cada 10, ISS 39 bi, IPTU 18 bi).

Mapa do mundo, principais: cofre [0,0,0] · escola [-6,2,-2] · saúde [-1,2,-5,7] · previdência [2,6,-5,5] · ponto e ônibus [1,0,5,05] · rua [-3,6,4,6] · prefeitura [5,3,-3,8] · banco da dívida [5,6,5] · assistência [-7,1,6] · guarda [6,6,-1,1] · defesa civil [6,8,1,9] · Câmara [-4,-5,8] · TCM [-6,6,-4,4] · vitrine em arco de raio 2,5 no centro · habitação [-1,9,-1] · saneamento [2,3,-1,1] · obras [0,2,7].

## 2.3 a 2.4 Cenas (pílula · de onde a onde)
SÃO PAULO 2025 (mapa A) · QUEM PAGA (mapa B) · PARA ONDE FOI · EDUCAÇÃO (24 bi; creches 12; fundamental quase 7) · SAÚDE (23; previsto 22; postos 9,5; hospitais quase 10) · A 3ª MAIOR CONTA (previdência 15 bi, com as 11,5 pilhas do transporte transparentes ao lado) · TRANSPORTE (11,5; ônibus quase 10) · RUAS E SERVIÇOS (quase 9; 6,5 em serviços urbanos) · ADMINISTRAÇÃO E DÍVIDA (3; 2,3) · ASSISTÊNCIA SOCIAL (2,6) · SEGURANÇA (1,7; defesa civil 47 mi) · CÂMARA E TRIBUNAL (1,3) · AS OUTRAS ÁREAS (vitrine: cultura a comunicações; 194 mi de comunicação social) · AS CONTAS PEQUENAS (relações exteriores, agricultura, C&T com lupa; R$ 0,47 por morador) · O QUE FICOU NO PAPEL (habitação 5,4 × 3,2, 2024 4,8; saneamento 1,3, 2024 2; obras 15 × 8) · OS SALÁRIOS (régua 27% de 54%) · OS MÍNIMOS (copos 24% e 25,2%) · A SOBRA (cofre e 6 bi) · E VOCÊ? (mesa inteira, prédios acendem um a um, comentário e @eumagnoleite).
Câmeras por cena em `CENAS` no código, com enquadramento automático e arco leve.

## 2.5 Fatos e fontes
Tudo em `audio/fontes.md`, com PDF e página. Selo de fonte em cada bloco. Conta própria na tela: 117 bi ÷ 12,2 mi de moradores; 5,7 mi ÷ 12,2 mi = R$ 0,47.

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números e nas pilhas, subida nas grades e na régua, baque no "em 2024", no "no ano anterior" e no 5,7 mi, ding no "metade do teto" e nos mínimos. Sem trilha.

## 2.7 Arquivos
- Estúdio: `src/videos/orcamentosp/{OrcamentoSp.tsx, pecas.tsx, palavras.ts}`; peças novas `TorresSP`, `PredioPrevidencia`, `Pedestal`, `ConjuntoHabitacao`; o resto reaproveitado de `../orcamentoitabuna/pecas` e do catálogo. `src/Root.tsx`: OrcamentoSp, OrcamentoSpGuia, OrcamentoSpLimpo, CapaOrcamentoSp.
- Kit Mapas: `src/videos/orcamento-sp/`, `scripts/dados-orcamento-sp.py`, tiles em `public/satelite/orcamento-sp`; saída `projetos/020.../mapas/sao-paulo.mp4`.
- Render: 5.439 quadros em partes de 400.

## 2.8 Origem das escolhas
Regras: mesmo mundo da série; só documentos de São Paulo; um OffthreadVideo para os trechos de mapa; selos no topo; cada número com o seu objeto; números lado a lado um de cada vez; neutro (sem prefeito nem partido; a pergunta final é do público).
Escolhas do diretor: torres ao fundo para ser São Paulo; vitrine para as áreas menores; lupa na ciência e tecnologia; as pilhas do transporte transparentes ao lado da previdência; o cofre volta com a sobra.
