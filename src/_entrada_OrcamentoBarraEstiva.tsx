// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBarraEstiva, CapaOrcamentoBarraEstiva, FAIXAS as FAIXAS_BDE, QUADROS as QUADROS_BDE, REVISAO as REVISAO_BDE} from './videos/orcamentobarraestiva/OrcamentoBarraEstiva';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBarraEstiva" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Composition id="OrcamentoBarraEstivaGuia" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Composition id="OrcamentoBarraEstivaLimpo" component={OrcamentoBarraEstiva} durationInFrames={QUADROS_BDE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BDE, revisao: REVISAO_BDE}} />
    <Still id="CapaOrcamentoBarraEstiva" component={CapaOrcamentoBarraEstiva} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
