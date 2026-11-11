// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItape, CapaOrcamentoItape, FAIXAS as FAIXAS_ITAPE, QUADROS as QUADROS_ITAPE, REVISAO as REVISAO_ITAPE} from './videos/orcamentoitape/OrcamentoItape';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItape" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Composition id="OrcamentoItapeGuia" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Composition id="OrcamentoItapeLimpo" component={OrcamentoItape} durationInFrames={QUADROS_ITAPE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITAPE, revisao: REVISAO_ITAPE}} />
    <Still id="CapaOrcamentoItape" component={CapaOrcamentoItape} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
