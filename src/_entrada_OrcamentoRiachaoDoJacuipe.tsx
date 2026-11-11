// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoRiachaoDoJacuipe, CapaOrcamentoRiachaoDoJacuipe, FAIXAS as FAIXAS_RIACHAODOJACUIPE, QUADROS as QUADROS_RIACHAODOJACUIPE, REVISAO as REVISAO_RIACHAODOJACUIPE} from './videos/orcamentoriachaodojacuipe/OrcamentoRiachaoDoJacuipe';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoRiachaoDoJacuipe" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Composition id="OrcamentoRiachaoDoJacuipeGuia" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Composition id="OrcamentoRiachaoDoJacuipeLimpo" component={OrcamentoRiachaoDoJacuipe} durationInFrames={QUADROS_RIACHAODOJACUIPE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RIACHAODOJACUIPE, revisao: REVISAO_RIACHAODOJACUIPE}} />
    <Still id="CapaOrcamentoRiachaoDoJacuipe" component={CapaOrcamentoRiachaoDoJacuipe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
