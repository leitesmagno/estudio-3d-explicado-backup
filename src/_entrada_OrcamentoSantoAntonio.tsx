// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSantoAntonio, CapaOrcamentoSantoAntonio, FAIXAS as FAIXAS_SAJ, QUADROS as QUADROS_SAJ, REVISAO as REVISAO_SAJ} from './videos/orcamentosantoantonio/OrcamentoSantoAntonio';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSantoAntonio" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Composition id="OrcamentoSantoAntonioGuia" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Composition id="OrcamentoSantoAntonioLimpo" component={OrcamentoSantoAntonio} durationInFrames={QUADROS_SAJ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAJ, revisao: REVISAO_SAJ}} />
    <Still id="CapaOrcamentoSantoAntonio" component={CapaOrcamentoSantoAntonio} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
