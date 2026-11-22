// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCordeiros, CapaOrcamentoCordeiros, FAIXAS as FAIXAS_CRD, QUADROS as QUADROS_CRD, REVISAO as REVISAO_CRD} from './videos/orcamentocordeiros/OrcamentoCordeiros';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCordeiros" component={OrcamentoCordeiros} durationInFrames={QUADROS_CRD} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CRD, revisao: REVISAO_CRD}} />
    <Composition id="OrcamentoCordeirosGuia" component={OrcamentoCordeiros} durationInFrames={QUADROS_CRD} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CRD, revisao: REVISAO_CRD}} />
    <Composition id="OrcamentoCordeirosLimpo" component={OrcamentoCordeiros} durationInFrames={QUADROS_CRD} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CRD, revisao: REVISAO_CRD}} />
    <Still id="CapaOrcamentoCordeiros" component={CapaOrcamentoCordeiros} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
