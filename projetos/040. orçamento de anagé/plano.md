# Plano: 040. orçamento de anagé (v1, aprovado no modo autônomo em 07/11/2026)

Molde: 035 Paratinga (maquete redonda, cofre no centro, casinhas na ordem da fala). Código: `src/videos/orcamentoanage/OrcamentoAnage.tsx`. Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-anage/`.

## Narração
- `audio/narracao-norm.wav`: **177,13 s** (v3: parágrafos 10, 12 e 13 refeitos com a licitação de calçamento e o fecho "ficou no zero"). Voz Google Cloud TTS pt-BR **Chirp 3 HD Algenib**, speakingRate 1,3, 14 partes (um parágrafo por pedido) unidas com 0,35 s, pausas encurtadas a 0,28 s, atempo 1,03, -15,5 LUFS. `AUDIO_SEG = 177.13` · `QUADROS = 5341`.
- 485 palavras, iguais ao roteiro v3. Transcrição conferida frase por frase; "o canal" (108,4 s) e "4" (163,9 s) eram erro do Whisper (retranscrito o trecho: a voz diz "proteção animal nem aparece" e "desde 2024"), corrigidos no palavras.json (original em palavras-original.json).
- Repetidas: "gastou 114" 0,48 (gancho) / 46,84 → `quando('Gastou 114', 2)`.

## Mundo
- Mesa redonda (`MesaMaquete rio={false}`), cofre no centro. 13 casinhas na borda na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas e encargos, Cultura e esporte (palco), Assistência social, Água, Agricultura, Meio ambiente, Defesa civil (cinza), Proteção animal (cinza).
- Pilhas: 1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026. A pilha do ano nasce no "gastou" em volta do cofre e voa para a casinha na palavra do setor. Plaquinha em todo setor, com as dos anos anteriores juntas. As torres da borda ficam até o fim (aprendizado 051).
- 2024 sem torre vermelha (sobraram 700 mil: chip). Torre vermelha "A MAIS": 2025 R$ 5,7 mi; 2026 R$ 1,2 mi.
- Zeros (depois de 2026): câmera nas duas casinhas cinza; chips "TEM LINHA NO ORÇAMENTO, GASTO R$ 0" e "NEM APARECE NO ORÇAMENTO".
- Festas x assistência: palco e assistência acesos, plaquinhas FESTAS (4,1 / 3,4 / 2,5) e ASSISTÊNCIA (2,1 / 2,6 / 1,5); famílias na porta da assistência.
- Asfalto ("E o asfalto?"): o cofre sai; no miolo, base "PAVIMENTAR AS RUAS" com 3 torres transparentes (reservado 630 mil, 630 mil, 520 mil; aqui 1 pilha = R$ 200 mil) que entram em cada valor; em "Gasto nessa linha: zero" a placa vermelha "GASTO: R$ 0"; chips "LICITAÇÃO DE CALÇAMENTO ABERTA EM ABRIL DE 2026" e "NAS CONTAS ATÉ JULHO: R$ 0 PAGO" (selo PNCP). Ao lado, base "LIMPEZA": reservado R$ 1,8 mi (transparente) e, em "terminou com 4", a torre verde de R$ 4,1 mi.
- ★ Obras do Estado: na borda, depois da proteção animal, placa "OBRAS DO ESTADO · COLÉGIO R$ 26 MI · ÁGUA NA ZONA RURAL" com uma escolinha e uma estação de água, acendendo em "colégio" e em "água".
- Tribunal: prédio do TCM e duas pastas: "ACIMA DO CONTRATO · R$ 3,8 MI" (carimbo DEVOLVER, depois CABE RECURSO) e "CONTAS DO MÊS · 2024 A 2026" (carimbo FORA DO PRAZO).
- Pergunta: mesa inteira, palco aceso em "dinheiro para festa", e a base do asfalto com "?" em "linha do asfalto".

## Câmera (sempre no mesmo sentido)
Vista geral → cofre no "Gastou 97" → casinha por casinha (Educação → Meio ambiente) → sobe e volta ao cofre em 2025 → idem → 2026 → zeros → de cima, mergulha entre palco e assistência → miolo das gavetas (asfalto 2024 → 2025 → 2026 → limpeza) → obras do Estado na borda → pastas do Tribunal (esquerda → direita) → mesa inteira → palco → gaveta do asfalto → abre.

## Interface
Pílula: ANAGÉ · PARA ONDE FOI CADA REAL → 2024 → 2025 → 2026 · ATÉ JULHO → OS ZEROS → AGORA REPARA → E O ASFALTO? → OBRAS DO ESTADO → NO TRIBUNAL DE CONTAS → A PERGUNTA. Selos de fonte por bloco (Anexo 9/Balanço, SIGA jul/2026, despesa por ação, Jornal do Sudoeste, Bahia Notícias/A Tarde, e-TCM datas de envio). Marca d'água @eumagnoleite quicando. Placar da escala no alto.

## Mapa (Kit Mapas)
Trecho A: Brasil → Anagé (contorno IBGE 2901205), "PARA ONDE FOI CADA REAL?", "PREFEITURA DE ANAGÉ", "TCM-BA". Trecho B: "2024", "R$ 98,4 MI", "ARRECADOU EM 2024". Até "Gastou 97" (11,72 s). Arquivo: `mapas/anage.mp4`.

## Sons
whoosh nas trocas de cena, tique na pílula, pop em cada setor, baque nos "a mais", nos zeros e no "R$ 0" do asfalto, subida na limpeza, impacto nos carimbos, ding no fim.

## O que veio das regras e o que é escolha do diretor
Regras: molde 035, ordem dos setores, sem porcentagem, sem nome, plaquinha em todo setor, pilha por ano, torre "a mais", zeros cinza, marca d'água, sem rio. Escolhas (★): obras do Estado com escolinha e estação de água; pastas com carimbo que troca para CABE RECURSO.

## Revisão
- v1 (57 quadros): plaquinhas antigas amontoadas e festas cedo demais (`quando('Nos tres anos')` pegava a frase da defesa civil) → corrigido. v2: close na proteção animal. v3 (58 quadros): troca limpeza → obras do Estado rápida demais → câmera segura na limpeza até "colégio" + 0,7 s. Aprovada no modo autônomo em 07/11/2026.
