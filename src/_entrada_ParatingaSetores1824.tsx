// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {ParatingaSetores1824, CapaParatingaSetores1824, FAIXAS as FAIXAS_PS1824, QUADROS as QUADROS_PS1824, REVISAO as REVISAO_PS1824} from './videos/paratingasetores1824/ParatingaSetores1824';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="ParatingaSetores1824" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Composition id="ParatingaSetores1824Guia" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Composition id="ParatingaSetores1824Limpo" component={ParatingaSetores1824} durationInFrames={QUADROS_PS1824} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PS1824, revisao: REVISAO_PS1824}} />
    <Still id="CapaParatingaSetores1824" component={CapaParatingaSetores1824} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
