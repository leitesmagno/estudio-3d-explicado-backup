// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {VoosParados, CapaVoosParados, FAIXAS as FAIXAS_VP, QUADROS as QUADROS_VP, REVISAO as REVISAO_VP} from './videos/voosparados/VoosParados';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="VoosParados" component={VoosParados} durationInFrames={QUADROS_VP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_VP, revisao: REVISAO_VP}} />
    <Composition id="VoosParadosGuia" component={VoosParados} durationInFrames={QUADROS_VP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_VP, revisao: REVISAO_VP}} />
    <Composition id="VoosParadosLimpo" component={VoosParados} durationInFrames={QUADROS_VP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_VP, revisao: REVISAO_VP}} />
    <Still id="CapaVoosParados" component={CapaVoosParados} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
