// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {BarraVelha, CapaBarraVelha, FAIXAS as FAIXAS_BVP, QUADROS as QUADROS_BVP, REVISAO as REVISAO_BVP} from './videos/barravelha/BarraVelha';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="BarraVelha" component={BarraVelha} durationInFrames={QUADROS_BVP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BVP, revisao: REVISAO_BVP}} />
      <Composition id="BarraVelhaGuia" component={BarraVelha} durationInFrames={QUADROS_BVP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BVP, revisao: REVISAO_BVP}} />
      <Composition id="BarraVelhaLimpo" component={BarraVelha} durationInFrames={QUADROS_BVP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BVP, revisao: REVISAO_BVP}} />
      <Still id="CapaBarraVelha" component={CapaBarraVelha} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
