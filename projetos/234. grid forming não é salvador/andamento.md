# 234. grid forming não é salvador
- Código: gridforming · Nome: GridForming · Estúdio 3D + Kit Mapas (motor original, escolha de 19/11/2026).
- Vídeo técnico de engenharia elétrica, NÃO é prefeitura, NÃO vai para o site.
- SEM MARCA (pedido de 19/11/2026): sem logo, sem @, sem série "Magno Explica", sem marca d'água, sem fecho. Feito com `semMarca: true` no Config (comum/Explicativo.tsx, opção nova).
- Pedido: diferenças GFL x GFM, foco nas desvantagens (rede forte, curto, energia guardada). Público: setor elétrico, sem formação em controle. Roteiro base em ~/Documents/VIDEO-GRID-FORMING/roteiro.md; pediram para fazer direto (modo autônomo, Claude confere os quadros).

## Etapas (19/11/2026)
- Roteiro falado: 452 palavras (audio/roteiro-falado.txt). Voz Google Algenib 1,3 (grid fórming / grid fólouin / pê éle éle no texto da voz), 134,02 s.
- Sincronia: Groq perdeu palavras (391); refeito com Whisper local, 452 = 452.
- Mapa (Kit Mapas): src/videos/gridforming-234, composição MapaGridForming, 9,3 a 23,3 s → mapas/mapa.mp4.
- Cenas: src/videos/gridforming (GridForming.tsx, pecas.tsx: Inversor, Torre, Fio, Senoide, Gerador, PainelSolar, Turbina, Subestacao, Coluna).
- Revisão: 42 quadros, 2 rodadas. Corrigido: coluna tapando inversor (rede forte) e gerador (curto), painéis de costas, torre e baterias cortadas.
- Vídeo final 19/11 23:11: 135,2 s, 1080x1920, 41 MB, 11 partes, média -18,4 dB, pico -3,7 dB, sem tela preta.
- Capa (frame 3950, os dois inversores) e legenda feitas. ENTREGUE em edicoes/234. grid forming não é salvador/. NÃO postado. Fora do site.
- Obs.: `npx remotion still` copia a pasta pública inteira (7 GB) e encheu o disco; capa feita com scripts/quadros.mjs (não copia).
