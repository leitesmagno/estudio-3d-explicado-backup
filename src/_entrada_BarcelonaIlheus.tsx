// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {BarcelonaIlheus, CapaBarcelonaIlheus, FAIXAS as FAIXAS_BI, QUADROS as QUADROS_BI, REVISAO as REVISAO_BI} from './videos/barcelonailheus/BarcelonaIlheus';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="BarcelonaIlheus" component={BarcelonaIlheus} durationInFrames={QUADROS_BI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BI, revisao: REVISAO_BI}} />
    <Composition id="BarcelonaIlheusGuia" component={BarcelonaIlheus} durationInFrames={QUADROS_BI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BI, revisao: REVISAO_BI}} />
    <Composition id="BarcelonaIlheusLimpo" component={BarcelonaIlheus} durationInFrames={QUADROS_BI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BI, revisao: REVISAO_BI}} />
    <Still id="CapaBarcelonaIlheus" component={CapaBarcelonaIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
