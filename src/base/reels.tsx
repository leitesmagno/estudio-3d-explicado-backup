// Estúdio 3D Explicado · base/reels
// Medidas do quadro vertical (1080 × 1920, 30 fps) e a área segura do Reels/TikTok/Shorts.
// Tudo que é texto importante fica dentro de SEGURO. A legenda encosta em LEGENDA_BAIXO.

import React from 'react';
import {AbsoluteFill} from 'remotion';

export const LARGURA = 1080;
export const ALTURA = 1920;
export const FPS = 30;

/**
 * Área segura em pixels do quadro 1080 × 1920.
 * - topo: abaixo do cabeçalho do app.
 * - baixo: acima do nome do perfil e da descrição do post.
 * - esq / dir: margens laterais.
 * - botoesX: onde começa a coluna de botões (curtir, comentar...). Texto longo não passa daqui.
 */
export const SEGURO = {
  topo: 132,
  baixo: 1560,
  esq: 60,
  dir: 1015,
  botoesX: 930,
} as const;

/** Linha de baixo da legenda (y em px). A caixa da legenda termina aqui. */
export const LEGENDA_BAIXO = 1524;

/** Cabeçalho do vídeo (px): topo da marca d'água da série e topo da pílula de estado logo abaixo. */
export const CABECALHO = {marca: 286, pilula: 330} as const;

/** Faixa útil para o 3D: o assunto principal deve ficar entre estas alturas (px). */
export const FAIXA_3D = {cima: 380, baixo: 1180} as const;

/** Guia de conferência: pinta as zonas cobertas pelo app. Só para revisão (prop `guia`). */
export const GuiaReels: React.FC<{opacidade?: number}> = ({opacidade = 0.35}) => {
  const zona = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', background: `rgba(255,40,80,${opacidade * 0.5})`, ...s});
  const linha = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', borderColor: `rgba(255,255,255,${opacidade + 0.3})`, borderStyle: 'dashed', borderWidth: 0, ...s});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={zona({left: 0, right: 0, top: 0, height: SEGURO.topo})} />
      <div style={zona({left: 0, right: 0, top: SEGURO.baixo, bottom: 0})} />
      <div style={zona({left: SEGURO.botoesX, right: 0, top: 980, bottom: 0})} />
      <div style={zona({left: 0, width: SEGURO.esq, top: SEGURO.topo, bottom: 0})} />
      <div style={zona({left: SEGURO.dir, right: 0, top: SEGURO.topo, height: 980 - SEGURO.topo})} />
      <div style={linha({left: 0, right: 0, top: LEGENDA_BAIXO, borderTopWidth: 3})} />
      <div style={linha({left: 0, right: 0, top: FAIXA_3D.cima, borderTopWidth: 2})} />
      <div style={linha({left: 0, right: 0, top: FAIXA_3D.baixo, borderTopWidth: 2})} />
      <div style={{position: 'absolute', left: SEGURO.esq + 8, top: LEGENDA_BAIXO + 8, color: 'white', fontFamily: 'monospace', fontSize: 22}}>LEGENDA_BAIXO</div>
    </AbsoluteFill>
  );
};
