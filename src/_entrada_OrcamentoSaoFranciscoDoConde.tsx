// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSaoFranciscoDoConde, CapaOrcamentoSaoFranciscoDoConde, FAIXAS as FAIXAS_SFC, QUADROS as QUADROS_SFC, REVISAO as REVISAO_SFC} from './videos/orcamentosaofranciscodoconde/OrcamentoSaoFranciscoDoConde';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSaoFranciscoDoConde" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Composition id="OrcamentoSaoFranciscoDoCondeGuia" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Composition id="OrcamentoSaoFranciscoDoCondeLimpo" component={OrcamentoSaoFranciscoDoConde} durationInFrames={QUADROS_SFC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SFC, revisao: REVISAO_SFC}} />
    <Still id="CapaOrcamentoSaoFranciscoDoConde" component={CapaOrcamentoSaoFranciscoDoConde} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
