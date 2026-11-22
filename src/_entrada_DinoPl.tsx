// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {DinoPl, CapaDinoPl, FAIXAS as FAIXAS_DPL, QUADROS as QUADROS_DPL, REVISAO as REVISAO_DPL} from './videos/dinopl/DinoPl';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="DinoPl" component={DinoPl} durationInFrames={QUADROS_DPL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DPL, revisao: REVISAO_DPL}} />
      <Composition id="DinoPlGuia" component={DinoPl} durationInFrames={QUADROS_DPL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DPL, revisao: REVISAO_DPL}} />
      <Composition id="DinoPlLimpo" component={DinoPl} durationInFrames={QUADROS_DPL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DPL, revisao: REVISAO_DPL}} />
      <Still id="CapaDinoPl" component={CapaDinoPl} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
