// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {EconomistaAvisou, CapaEconomistaAvisou, FAIXAS as FAIXAS_ECA, QUADROS as QUADROS_ECA, REVISAO as REVISAO_ECA} from './videos/economistaavisou/EconomistaAvisou';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="EconomistaAvisou" component={EconomistaAvisou} durationInFrames={QUADROS_ECA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ECA, revisao: REVISAO_ECA}} />
      <Composition id="EconomistaAvisouGuia" component={EconomistaAvisou} durationInFrames={QUADROS_ECA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ECA, revisao: REVISAO_ECA}} />
      <Composition id="EconomistaAvisouLimpo" component={EconomistaAvisou} durationInFrames={QUADROS_ECA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ECA, revisao: REVISAO_ECA}} />
      <Still id="CapaEconomistaAvisou" component={CapaEconomistaAvisou} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
