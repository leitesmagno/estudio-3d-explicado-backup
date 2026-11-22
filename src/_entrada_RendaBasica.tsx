// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {RendaBasica, CapaRendaBasica, FAIXAS as FAIXAS_RBU, QUADROS as QUADROS_RBU, REVISAO as REVISAO_RBU} from './videos/rendabasica/RendaBasica';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="RendaBasica" component={RendaBasica} durationInFrames={QUADROS_RBU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RBU, revisao: REVISAO_RBU}} />
      <Composition id="RendaBasicaGuia" component={RendaBasica} durationInFrames={QUADROS_RBU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RBU, revisao: REVISAO_RBU}} />
      <Composition id="RendaBasicaLimpo" component={RendaBasica} durationInFrames={QUADROS_RBU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RBU, revisao: REVISAO_RBU}} />
      <Still id="CapaRendaBasica" component={CapaRendaBasica} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
