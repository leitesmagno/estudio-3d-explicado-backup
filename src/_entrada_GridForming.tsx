// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {GridForming, CapaGridForming, FAIXAS as FAIXAS_GFM, QUADROS as QUADROS_GFM, REVISAO as REVISAO_GFM} from './videos/gridforming/GridForming';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="GridForming" component={GridForming} durationInFrames={QUADROS_GFM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GFM, revisao: REVISAO_GFM}} />
      <Composition id="GridFormingGuia" component={GridForming} durationInFrames={QUADROS_GFM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GFM, revisao: REVISAO_GFM}} />
      <Composition id="GridFormingLimpo" component={GridForming} durationInFrames={QUADROS_GFM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GFM, revisao: REVISAO_GFM}} />
      <Still id="CapaGridForming" component={CapaGridForming} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
