// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMucuri, CapaOrcamentoMucuri, FAIXAS as FAIXAS_MUC, QUADROS as QUADROS_MUC, REVISAO as REVISAO_MUC} from './videos/orcamentomucuri/OrcamentoMucuri';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMucuri" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Composition id="OrcamentoMucuriGuia" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Composition id="OrcamentoMucuriLimpo" component={OrcamentoMucuri} durationInFrames={QUADROS_MUC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MUC, revisao: REVISAO_MUC}} />
    <Still id="CapaOrcamentoMucuri" component={CapaOrcamentoMucuri} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
