# 096. orçamento de paratinga 2018-2024 todos os setores
- Perfil: @eumagnoleite, parceria com @eugeniodmr (mesmo cabeçalho de dois selos do 094)
- Pedido do Magno (09/11/2026): "um similar a esse [094], só que você vai falar todos os setores públicos durante todos esses anos... trazendo uma plaquinha do PDF... pode ser mais do que 3 minutos".
- Base: 094 (código orcamentoparatinga1824, levantamento ~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/). Não mexer no 094 nem no 035.
- Código: paratingasetores1824 · Nome: ParatingaSetores1824
- Estrutura: por setor (13), os 7 anos em sequência, com uma folha "PDF" por setor e ano (6 a 7 linhas, fechando o total).

## Etapa atual
1. Roteiro v1 escrito (audio/roteiro-falado.txt), esperando aprovação do Magno junto com o título da capa.

## Falta
aprovação → voz Algenib → sincronia → plano → cenas → revisão → render → folhas → capa e legenda → NOVO LOTE.
Dados ainda a completar para as folhas: 2019 por elemento (PDF escaneado), SAAE 2021–2023 (UJ própria no e-TCM), Assistência social 2018 e 2020 (fundo separado).

## 09/11/2026 (tarde)
- Roteiro e capa APROVADOS pelo Magno ("Chat aprovado... trazer a folheta do PDF com todas as descrições, no máximo umas 6, 7... em todos os setores públicos").
- Voz Google Algenib (1,3; pausas 0,28 s; atempo 1,1323; -15 LUFS) = 197,38 s. Transcrição: 450 palavras; palavras.ts 480; CTA "Sigam o arroba EumagnoLeite e o arroba EugênioDMR" em 3:13.
- Código: src/videos/paratingasetores1824/ParatingaSetores1824.tsx (registrado no Root; tsc ok). Mapa novo: ~/Kit-Mapas-Animados/src/videos/orcamento-paratinga-setores1824 → mapas/paratingasetores1824.mp4 ("gastou R$ 735,1 mi de 2018 a 2024").
- Folhas: 86 (scripts/folhas_096.py → saida/folha-pdf-096/config.json; tempos em tempos.json via tempos_096.py). 2019 lido na imagem (el2019_visual.py). SAAE 2021–2023 baixado (UJ 1058).
- Fontes: audio/fontes.md (cópia em ~/Documents/FONTES).
- Revisão 1: árvores do miolo tampavam as torres e o mapa do 094 tinha textos do 094 → corrigido; revisão 2 em geração.
- Revisão APROVADA pelo Magno em 09/11/2026 ("Aprovado, gera").

## ENTREGUE em 09/11/2026
- edicoes/096.../PARATINGA TODOS OS SETORES 2018-2024.mp4 (198,3 s, -15,5 LUFS, 86 folhas; 12 translúcidas onde não havia canto livre), capa ("735 milhões: / para onde / foi cada / setor.") e legenda (1.752 caracteres + comentário fixado).
- Cópia em ~/Documents/NOVO LOTE/PARATINGA 2018-2024 TODOS OS SETORES/.
- CTA falado conferido na transcrição (3:13): "Sigam o arroba EumagnoLeite e o arroba EugênioDMR para mais informações."
- Erro de disco cheio no `npx remotion still` (copia a pasta projetos inteira): fundo e capa feitos com scripts/quadros.mjs --saida (bundle só da composição).

## v2 (09/11/2026, pedido do Magno): vídeo único, sem citar o 1º vídeo
- Abertura nova: "Eu abri as contas que a prefeitura mandou ao Tribunal de Contas e separei todos os setores, ano a ano, com o documento de cada um." (só o 1º parágrafo regravado; v1 em audio/antigos/).
- Mapa sem "NO 1º VÍDEO" (agora "TCM-BA · TRIBUNAL DE CONTAS"); legenda sem "Agora são". Voz 195,2 s; vídeo 196,1 s, -15,5 LUFS, 86 folhas (10 translúcidas).
- CTA conferido no áudio final (beam 5): "Sigam o arroba Eumagnoleite e o arroba Eugênio DMR para mais informações."
- Recopiado para NOVO LOTE. v1 em edicoes/096.../antigos/.
