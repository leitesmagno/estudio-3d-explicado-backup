// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {TabletsCamara, CapaTabletsCamara, FAIXAS as FAIXAS_TBC, QUADROS as QUADROS_TBC, REVISAO as REVISAO_TBC} from './videos/tabletscamara/TabletsCamara';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="TabletsCamara" component={TabletsCamara} durationInFrames={QUADROS_TBC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_TBC, revisao: REVISAO_TBC}} />
      <Composition id="TabletsCamaraGuia" component={TabletsCamara} durationInFrames={QUADROS_TBC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_TBC, revisao: REVISAO_TBC}} />
      <Composition id="TabletsCamaraLimpo" component={TabletsCamara} durationInFrames={QUADROS_TBC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_TBC, revisao: REVISAO_TBC}} />
      <Still id="CapaTabletsCamara" component={CapaTabletsCamara} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
