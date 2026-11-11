// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMaracas, CapaOrcamentoMaracas, FAIXAS as FAIXAS_MRC, QUADROS as QUADROS_MRC, REVISAO as REVISAO_MRC} from './videos/orcamentomaracas/OrcamentoMaracas';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMaracas" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Composition id="OrcamentoMaracasGuia" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Composition id="OrcamentoMaracasLimpo" component={OrcamentoMaracas} durationInFrames={QUADROS_MRC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MRC, revisao: REVISAO_MRC}} />
    <Still id="CapaOrcamentoMaracas" component={CapaOrcamentoMaracas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
