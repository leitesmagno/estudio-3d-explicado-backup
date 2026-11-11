// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoRioDeContas, CapaOrcamentoRioDeContas, FAIXAS as FAIXAS_RDC, QUADROS as QUADROS_RDC, REVISAO as REVISAO_RDC} from './videos/orcamentoriodecontas/OrcamentoRioDeContas';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoRioDeContas" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Composition id="OrcamentoRioDeContasGuia" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Composition id="OrcamentoRioDeContasLimpo" component={OrcamentoRioDeContas} durationInFrames={QUADROS_RDC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RDC, revisao: REVISAO_RDC}} />
    <Still id="CapaOrcamentoRioDeContas" component={CapaOrcamentoRioDeContas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
