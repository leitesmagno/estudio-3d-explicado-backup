// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCandiba, CapaOrcamentoCandiba, FAIXAS as FAIXAS_CAND, QUADROS as QUADROS_CAND, REVISAO as REVISAO_CAND} from './videos/orcamentocandiba/OrcamentoCandiba';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCandiba" component={OrcamentoCandiba} durationInFrames={QUADROS_CAND} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAND, revisao: REVISAO_CAND}} />
    <Composition id="OrcamentoCandibaGuia" component={OrcamentoCandiba} durationInFrames={QUADROS_CAND} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAND, revisao: REVISAO_CAND}} />
    <Composition id="OrcamentoCandibaLimpo" component={OrcamentoCandiba} durationInFrames={QUADROS_CAND} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAND, revisao: REVISAO_CAND}} />
    <Still id="CapaOrcamentoCandiba" component={CapaOrcamentoCandiba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
