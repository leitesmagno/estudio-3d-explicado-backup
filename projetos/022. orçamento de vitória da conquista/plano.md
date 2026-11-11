# Plano de cenas: 022. orçamento de vitória da conquista (versão 1, aprovada antecipadamente em 04/11/2026)

A pessoa aprovou o plano e o vídeo final sem pausas ("Tudo aprovado! Pode gerar os 3 videos sem parar cada etapa"). Revisão dos quadros feita pelo diretor.

Código `orcamentoconquista` · Nome `OrcamentoConquista` · Perfil @eumagnoleite. Vídeo com os dois kits, mesma série do 014, 017 e 020.
**Regra deste vídeo:** só dados de Vitória da Conquista (PDFs do portal da transparência da prefeitura, `audio/fontes.md`). Nenhum número, nome ou documento de outra cidade.

## 2.1 Narração
- `audio/narracao-norm.wav`: voz Adam (ElevenLabs v3), 1,3x, volume -15, **150,19 s** · `AUDIO_SEG = 150.19` · `QUADROS = 4533`.
- 432 palavras (igual ao roteiro); a última termina em 150,02 s. Voz conferida frase por frase: completa.
- `quando()` tira vírgula e %: "46,7%" vira "467", "54%" vira "54". Trechos usados: `'520', 2` (o 1º "520" é da arrecadação), `'ate 54'`, `'esta em'`, `'Recebeu'` e `'Recebeu', 2`, `'Depois vem a saude'`, `'A seguranca publica'`, `'a Camara de Vereadores'`.

## 2.2 Ideia e mundo
A maquete redonda da série, com o cofre da prefeitura no meio e **1 pilha = R$ 10 milhões** (148 pilhas). Na borda, casinhas e morros baixos do planalto (peça nova `MorrosPlanalto`), sem mar. Cada área ganha o seu prédio, e as pilhas voam do cofre na palavra do número. Na "parte que quase ninguém vê", as pilhas das áreas afundam e o dinheiro todo volta ao anel: quase metade acende (salários), 6,7 pilhas voam para a obra (com as 23,4 do previsto transparentes) e 7,8 para o banco da dívida. Depois vêm a régua do teto (46,7%, alerta 48,6, máximo 54), os copos dos pisos com o prédio do TCM e o cofre com a sobra de 38 milhões.

Trechos de mapa (Kit Mapas, `OrcamentoConquista`, 37 s): A, do Brasil até Vitória da Conquista (R$ 1,48 BILHÃO, GASTOS DE 2025, PREFEITURA DE VITÓRIA DA CONQUISTA); B, arrecadado R$ 1,52 BI e "impostos da cidade: 1 de cada 5 reais" na cidade; depois recua para Brasília e Salvador: setas da União e do estado, Fundeb, UNIÃO · R$ 587 MI e "quase o dobro dos impostos da cidade".

Mapa do mundo, principais: cofre [0,0,0] · escola [-7,1,-0,9] (pilhas [-4,6,-3,3]) · saúde [-0,4,-6] (pilhas [-0,4,-3,8]) · rua [-3,6,4,7] e ponto/ônibus [1,5,05] · prefeitura [5,4,-3,9] (pilhas [3,9,-2,2]; as 4 áreas em [5,5,-0,9]) · saneamento [6,7,2,6] · Câmara [-3,6,-6,5] · defesa civil [-6,4,-4,9] · obra [-1,6,3,6] (pilhas [0,2,3,6]) · banco da dívida [5,7,5] · régua, copos e TCM no centro.

## 2.3 a 2.4 Cenas (pílula · o que acontece)
VITÓRIA DA CONQUISTA 2025 (mapa A) · DE ONDE VEM (mapa B) · PARA ONDE VAI (mesa inteira, 148 pilhas) · EDUCAÇÃO (52 pilhas; 40 acendem: fundamental) · SAÚDE (36,8; 18,5 acendem: hospitais) · URBANISMO (24; 10,3 acendem: ônibus, que entra andando) · ADMINISTRAÇÃO (11,6 pilhas; as 4 áreas voam uma a uma para o lado, cartão com a soma: 61 MI, "quase o dobro") · SANEAMENTO (estação sobe, R$ 0, 2024 em 3 pilhas transparentes) · SEGURANÇA × CÂMARA (defesa civil com um pedacinho de pilha; Câmara com 3,7; "mais de 100 vezes") · SALÁRIOS × OBRAS (anel inteiro; 71 acendem; obras 6,7 × previsto 23,4; dívida 7,8) · O TETO (régua) · OS PISOS (copos e TCM) · A SOBRA (cofre e 38 mi) · E VOCÊ? (mesa inteira, prédios acendem, comentário e @eumagnoleite).
Câmeras por cena em `CENAS` no código (enquadramento automático, arco leve).

## 2.5 Fatos e fontes
Tudo em `audio/fontes.md`, com PDF e página. Selo de fonte em cada bloco (Anexo 1 p. 2 e 3, Anexo 2 p. 6 e 7, RGF p. 36, Anexo 14 p. 32).

## 2.6 Sons
whoosh nas trocas, tique na pílula, pop nos números e nas pilhas, subida nos anéis e na régua, baque no "não gastou", no "mais de 100 vezes" e no "mais do que todas as obras", ding no "quase o dobro", no limite de alerta e nos pisos. Sem trilha.

## 2.7 Arquivos
- Estúdio: `src/videos/orcamentoconquista/{OrcamentoConquista.tsx, pecas.tsx, palavras.ts}`; o resto de `../orcamentoitabuna/pecas`, `../onibusilheus/pecas` e do catálogo.
- Kit Mapas: `src/videos/orcamento-conquista/`, `scripts/dados-orcamento-conquista.py`; saída `mapas/conquista.mp4`.
- Render: 4.533 quadros.

## 2.8 Origem das escolhas
Regras: mesmo mundo da série; só documentos da cidade; um OffthreadVideo para os mapas; selos no topo; cada número com o seu objeto; linha do 014 no roteiro. Escolhas do diretor: morros do planalto; as 4 áreas voando uma a uma para o lado da administração; o dinheiro todo voltando ao anel para mostrar salários × obras.
