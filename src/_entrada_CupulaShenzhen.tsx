// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {CupulaShenzhen, CapaCupulaShenzhen, FAIXAS as FAIXAS_CSZ, QUADROS as QUADROS_CSZ, REVISAO as REVISAO_CSZ} from './videos/cupulashenzhen/CupulaShenzhen';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="CupulaShenzhen" component={CupulaShenzhen} durationInFrames={QUADROS_CSZ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CSZ, revisao: REVISAO_CSZ}} />
      <Composition id="CupulaShenzhenGuia" component={CupulaShenzhen} durationInFrames={QUADROS_CSZ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CSZ, revisao: REVISAO_CSZ}} />
      <Composition id="CupulaShenzhenLimpo" component={CupulaShenzhen} durationInFrames={QUADROS_CSZ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CSZ, revisao: REVISAO_CSZ}} />
      <Still id="CapaCupulaShenzhen" component={CapaCupulaShenzhen} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
