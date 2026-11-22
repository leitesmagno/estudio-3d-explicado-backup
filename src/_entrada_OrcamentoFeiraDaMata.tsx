// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoFeiraDaMata, CapaOrcamentoFeiraDaMata, FAIXAS as FAIXAS_FDM, QUADROS as QUADROS_FDM, REVISAO as REVISAO_FDM} from './videos/orcamentofeiradamata/OrcamentoFeiraDaMata';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoFeiraDaMata" component={OrcamentoFeiraDaMata} durationInFrames={QUADROS_FDM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FDM, revisao: REVISAO_FDM}} />
    <Composition id="OrcamentoFeiraDaMataGuia" component={OrcamentoFeiraDaMata} durationInFrames={QUADROS_FDM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FDM, revisao: REVISAO_FDM}} />
    <Composition id="OrcamentoFeiraDaMataLimpo" component={OrcamentoFeiraDaMata} durationInFrames={QUADROS_FDM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FDM, revisao: REVISAO_FDM}} />
    <Still id="CapaOrcamentoFeiraDaMata" component={CapaOrcamentoFeiraDaMata} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
