// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBarreiras, CapaOrcamentoBarreiras, FAIXAS as FAIXAS_BAR, QUADROS as QUADROS_BAR, REVISAO as REVISAO_BAR} from './videos/orcamentobarreiras/OrcamentoBarreiras';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBarreiras" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Composition id="OrcamentoBarreirasGuia" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Composition id="OrcamentoBarreirasLimpo" component={OrcamentoBarreiras} durationInFrames={QUADROS_BAR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BAR, revisao: REVISAO_BAR}} />
    <Still id="CapaOrcamentoBarreiras" component={CapaOrcamentoBarreiras} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
