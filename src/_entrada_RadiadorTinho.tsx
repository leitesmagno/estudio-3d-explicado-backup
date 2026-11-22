// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {RadiadorTinho, CapaRadiadorTinho, FAIXAS as FAIXAS_RAD, QUADROS as QUADROS_RAD, REVISAO as REVISAO_RAD} from './videos/radiadortinho/RadiadorTinho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="RadiadorTinho" component={RadiadorTinho} durationInFrames={QUADROS_RAD} {...base} defaultProps={{estilo: 'tinho', faixas: FAIXAS_RAD, revisao: REVISAO_RAD}} />
    <Composition id="RadiadorTinhoGuia" component={RadiadorTinho} durationInFrames={QUADROS_RAD} {...base} defaultProps={{estilo: 'tinho', guia: true, faixas: FAIXAS_RAD, revisao: REVISAO_RAD}} />
    <Composition id="RadiadorTinhoLimpo" component={RadiadorTinho} durationInFrames={QUADROS_RAD} {...base} defaultProps={{estilo: 'tinho', semInterface: true, faixas: FAIXAS_RAD, revisao: REVISAO_RAD}} />
    <Still id="CapaRadiadorTinho" component={CapaRadiadorTinho} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'tinho'}} />
  </>
);
registerRoot(Raiz);
