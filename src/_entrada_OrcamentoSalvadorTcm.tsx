// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSalvadorTcm, CapaOrcamentoSalvadorTcm, FAIXAS as FAIXAS_SSA, QUADROS as QUADROS_SSA, REVISAO as REVISAO_SSA} from './videos/orcamentosalvadortcm/OrcamentoSalvadorTcm';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSalvadorTcm" component={OrcamentoSalvadorTcm} durationInFrames={QUADROS_SSA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SSA, revisao: REVISAO_SSA}} />
    <Composition id="OrcamentoSalvadorTcmGuia" component={OrcamentoSalvadorTcm} durationInFrames={QUADROS_SSA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SSA, revisao: REVISAO_SSA}} />
    <Composition id="OrcamentoSalvadorTcmLimpo" component={OrcamentoSalvadorTcm} durationInFrames={QUADROS_SSA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SSA, revisao: REVISAO_SSA}} />
    <Still id="CapaOrcamentoSalvadorTcm" component={CapaOrcamentoSalvadorTcm} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
