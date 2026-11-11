// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoPojuca, CapaOrcamentoPojuca, FAIXAS as FAIXAS_POJUCA, QUADROS as QUADROS_POJUCA, REVISAO as REVISAO_POJUCA} from './videos/orcamentopojuca/OrcamentoPojuca';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoPojuca" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Composition id="OrcamentoPojucaGuia" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Composition id="OrcamentoPojucaLimpo" component={OrcamentoPojuca} durationInFrames={QUADROS_POJUCA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_POJUCA, revisao: REVISAO_POJUCA}} />
    <Still id="CapaOrcamentoPojuca" component={CapaOrcamentoPojuca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
