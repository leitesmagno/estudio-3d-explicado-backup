// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMarau, CapaOrcamentoMarau, FAIXAS as FAIXAS_MAR, QUADROS as QUADROS_MAR, REVISAO as REVISAO_MAR} from './videos/orcamentomarau/OrcamentoMarau';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMarau" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Composition id="OrcamentoMarauGuia" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Composition id="OrcamentoMarauLimpo" component={OrcamentoMarau} durationInFrames={QUADROS_MAR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MAR, revisao: REVISAO_MAR}} />
    <Still id="CapaOrcamentoMarau" component={CapaOrcamentoMarau} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
