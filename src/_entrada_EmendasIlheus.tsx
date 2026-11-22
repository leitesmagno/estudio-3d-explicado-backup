// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {EmendasIlheus, CapaEmendasIlheus, FAIXAS as FAIXAS_EMI, QUADROS as QUADROS_EMI, REVISAO as REVISAO_EMI} from './videos/emendasilheus/EmendasIlheus';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="EmendasIlheus" component={EmendasIlheus} durationInFrames={QUADROS_EMI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_EMI, revisao: REVISAO_EMI}} />
      <Composition id="EmendasIlheusGuia" component={EmendasIlheus} durationInFrames={QUADROS_EMI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_EMI, revisao: REVISAO_EMI}} />
      <Composition id="EmendasIlheusLimpo" component={EmendasIlheus} durationInFrames={QUADROS_EMI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_EMI, revisao: REVISAO_EMI}} />
      <Still id="CapaEmendasIlheus" component={CapaEmendasIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
