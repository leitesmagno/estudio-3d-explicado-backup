# 021. orçamento de una
- Perfil: @eumagnoleite (id: eumagnoleite)
- Código: orcamentouna · Nome: OrcamentoUna
- Etapa atual: entregue (vídeo final, capa e legenda em 04/11/2026)
- Título da capa: "132 milhões. / Para onde / foi cada / real?"
- Aprovações: revisão aprovada e vídeo final pedido em 04/11/2026 · plano v1 aprovado em 04/11/2026 · roteiro v4 aprovado em 04/11/2026 (453 palavras) e título da capa "132 milhões. / Para onde / foi cada / real?"
- Seguir sem pausas: não
- Formato: igual ao 014 e ao 017 (de onde vem, para onde vai cada área, salários e teto da LRF, mínimos). Maquete 3D no mesmo estilo.
- Regra do Magno (04/11/2026): só dados do município de Una (BA). Nada de Ilhéus nem de Itabuna.
- Fontes: portal una-ba.portaltp.com.br (PDFs) e Tesouro (Siconfi, IBGE 2932507).
- Pedido para o plano de cenas (04/11/2026): pôr a fonte de cada número na tela, em selo com documento e página (ex.: "Fonte: RREO 6º bim. 2025, Anexo 2, p. 1, Prefeitura de Una"), como no 016 e no 017. Na fala de 2026, mostrar os dois relatórios lado a lado (Tesouro 56% e portal 42%).

## Narração e sincronia (04/11/2026)
- Áudio: ElevenLabs, voz Adam (o Magno gerou), original 222,1 s; preparo 1,3x + pausas de 0,35 s + volume -15 → 170,38 s · QUADROS = 5138 (AUDIO_SEG 170.38).
- 453 palavras (igual ao roteiro), última "direitos." em 170,12 s. Sem ajustes no palavras.json (cópia em palavras-original.json).
- Kits: Estúdio 3D + Kit Mapas (pedido do Magno em 04/11/2026), mapas de 0 a 25,58 s.

## Programação e revisão (04/11/2026)
- Kit Mapas: src/videos/orcamento-una/ (contorno IBGE 2932507) → mapas/una.mp4 (26,1 s).
- Estúdio: src/videos/orcamentouna/ (OrcamentoUna.tsx, pecas.tsx). 62 quadros de revisão em revisao/; folha "aprovacao - 12 quadros.jpg".

## Vídeo final (04/11/2026)
- edicoes/021. orçamento de una/Orçamento de Una 2025.mp4: 5138 quadros, 171,27 s, 7 partes de 800 quadros, volume médio -19,2 dB e pico -3,3 dB; emendas conferidas, sem salto.
- Orçamento de Una 2025 - capa.jpg (fundo: quadro 1500 do Limpo) e Orçamento de Una 2025 - legenda do post.txt (1.863 caracteres, com as fontes dentro da legenda, pedido do Magno).
- Mínimos conferidos nos PDFs do portal antes do render: saúde 22,44% (Anexo 12, p. 1), educação 31,01% (Anexo 8, p. 3).
