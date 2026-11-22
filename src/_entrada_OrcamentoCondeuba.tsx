// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCondeuba, CapaOrcamentoCondeuba, FAIXAS as FAIXAS_CDB, QUADROS as QUADROS_CDB, REVISAO as REVISAO_CDB} from './videos/orcamentocondeuba/OrcamentoCondeuba';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCondeuba" component={OrcamentoCondeuba} durationInFrames={QUADROS_CDB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CDB, revisao: REVISAO_CDB}} />
    <Composition id="OrcamentoCondeubaGuia" component={OrcamentoCondeuba} durationInFrames={QUADROS_CDB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CDB, revisao: REVISAO_CDB}} />
    <Composition id="OrcamentoCondeubaLimpo" component={OrcamentoCondeuba} durationInFrames={QUADROS_CDB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CDB, revisao: REVISAO_CDB}} />
    <Still id="CapaOrcamentoCondeuba" component={CapaOrcamentoCondeuba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
