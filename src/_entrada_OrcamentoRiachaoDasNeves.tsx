// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoRiachaoDasNeves, CapaOrcamentoRiachaoDasNeves, FAIXAS as FAIXAS_RIACHAONEVES, QUADROS as QUADROS_RIACHAONEVES, REVISAO as REVISAO_RIACHAONEVES} from './videos/orcamentoriachaodasneves/OrcamentoRiachaoDasNeves';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoRiachaoDasNeves" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Composition id="OrcamentoRiachaoDasNevesGuia" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Composition id="OrcamentoRiachaoDasNevesLimpo" component={OrcamentoRiachaoDasNeves} durationInFrames={QUADROS_RIACHAONEVES} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RIACHAONEVES, revisao: REVISAO_RIACHAONEVES}} />
    <Still id="CapaOrcamentoRiachaoDasNeves" component={CapaOrcamentoRiachaoDasNeves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
