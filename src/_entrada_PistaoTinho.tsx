// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {PistaoTinho, CapaPistaoTinho, FAIXAS as FAIXAS_PIS, QUADROS as QUADROS_PIS, REVISAO as REVISAO_PIS} from './videos/pistaotinho/PistaoTinho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="PistaoTinho" component={PistaoTinho} durationInFrames={QUADROS_PIS} {...base} defaultProps={{estilo: 'tinho', faixas: FAIXAS_PIS, revisao: REVISAO_PIS}} />
    <Composition id="PistaoTinhoGuia" component={PistaoTinho} durationInFrames={QUADROS_PIS} {...base} defaultProps={{estilo: 'tinho', guia: true, faixas: FAIXAS_PIS, revisao: REVISAO_PIS}} />
    <Composition id="PistaoTinhoLimpo" component={PistaoTinho} durationInFrames={QUADROS_PIS} {...base} defaultProps={{estilo: 'tinho', semInterface: true, faixas: FAIXAS_PIS, revisao: REVISAO_PIS}} />
    <Still id="CapaPistaoTinho" component={CapaPistaoTinho} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'tinho'}} />
  </>
);
registerRoot(Raiz);
