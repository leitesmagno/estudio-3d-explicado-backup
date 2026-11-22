import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import itens from './itens.json';

export const FPS_P = 30;
export const QUADROS = Math.round(179.2 * FPS_P);
const FADE = 4;

export const ProvaFontes125: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS_P;
  let i = itens.findIndex((x) => t >= x.inicio && t < x.fim);
  if (i < 0) i = t < itens[0].inicio ? 0 : itens.length - 1;
  const atual = itens[i];
  const ant = i > 0 ? itens[i - 1] : null;
  const ini = Math.round(atual.inicio * FPS_P);
  const op = ant ? interpolate(f, [ini, ini + FADE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const v = staticFile('_prova125/original.mp4');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, overflow: 'hidden'}}>
        <OffthreadVideo src={v} muted style={{position: 'absolute', left: -60, top: -540, width: 1200, height: 2133, objectFit: 'cover', filter: 'blur(40px) brightness(0.6)'}} />
        <OffthreadVideo src={v} muted style={{position: 'absolute', left: 270, top: 0, width: 540, height: 960}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden'}}>
        {ant && <Cam it={ant} f={f} />}
        <div style={{opacity: op}}><Cam it={atual} f={f} /></div>
        <div style={{position: 'absolute', left: 0, top: 876, width: 1080, height: 84, overflow: 'hidden'}}>
          {ant && <img src={staticFile('_prova125/' + ant.imagem)} style={{position: 'absolute', top: -876, width: 1080, height: 960}} />}
          <img src={staticFile('_prova125/' + atual.imagem)} style={{position: 'absolute', top: -876, width: 1080, height: 960, opacity: op}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cam: React.FC<{it: (typeof itens)[number]; f: number}> = ({it, f}) => {
  const a = it.inicio * FPS_P, b = it.fim * FPS_P;
  const z = it.zoom;
  const e = interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease)});
  const esc = Math.max(1, z.de + (z.ate - z.de) * e);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 876, overflow: 'hidden'}}>
      <Img src={staticFile('_prova125/' + it.imagem)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, transformOrigin: `${z.foco[0]}px ${z.foco[1]}px`, transform: `scale(${esc})`}} />
    </div>
  );
};
