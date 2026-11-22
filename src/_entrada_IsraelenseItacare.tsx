// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {IsraelenseItacare, CapaIsraelenseItacare, FAIXAS as FAIXAS_ISR, QUADROS as QUADROS_ISR, REVISAO as REVISAO_ISR} from './videos/israelenseitacare/IsraelenseItacare';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="IsraelenseItacare" component={IsraelenseItacare} durationInFrames={QUADROS_ISR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ISR, revisao: REVISAO_ISR}} />
      <Composition id="IsraelenseItacareGuia" component={IsraelenseItacare} durationInFrames={QUADROS_ISR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ISR, revisao: REVISAO_ISR}} />
      <Composition id="IsraelenseItacareLimpo" component={IsraelenseItacare} durationInFrames={QUADROS_ISR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ISR, revisao: REVISAO_ISR}} />
      <Still id="CapaIsraelenseItacare" component={CapaIsraelenseItacare} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
