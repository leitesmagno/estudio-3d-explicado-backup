// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {ZumbiPalmares, CapaZumbiPalmares, FAIXAS as FAIXAS_ZUM, QUADROS as QUADROS_ZUM, REVISAO as REVISAO_ZUM} from './videos/zumbipalmares/ZumbiPalmares';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="ZumbiPalmares" component={ZumbiPalmares} durationInFrames={QUADROS_ZUM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ZUM, revisao: REVISAO_ZUM}} />
      <Composition id="ZumbiPalmaresGuia" component={ZumbiPalmares} durationInFrames={QUADROS_ZUM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ZUM, revisao: REVISAO_ZUM}} />
      <Composition id="ZumbiPalmaresLimpo" component={ZumbiPalmares} durationInFrames={QUADROS_ZUM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ZUM, revisao: REVISAO_ZUM}} />
      <Still id="CapaZumbiPalmares" component={CapaZumbiPalmares} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
