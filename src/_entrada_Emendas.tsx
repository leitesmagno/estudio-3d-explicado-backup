// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {Emendas, CapaEmendas, FAIXAS as FAIXAS_EMD, QUADROS as QUADROS_EMD, REVISAO as REVISAO_EMD} from './videos/emendas/Emendas';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="Emendas" component={Emendas} durationInFrames={QUADROS_EMD} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EMD, revisao: REVISAO_EMD}} />
      <Composition id="EmendasGuia" component={Emendas} durationInFrames={QUADROS_EMD} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EMD, revisao: REVISAO_EMD}} />
      <Composition id="EmendasLimpo" component={Emendas} durationInFrames={QUADROS_EMD} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EMD, revisao: REVISAO_EMD}} />
      <Still id="CapaEmendas" component={CapaEmendas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
