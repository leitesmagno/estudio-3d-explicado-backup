// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSenhorDoBonfim, CapaOrcamentoSenhorDoBonfim, FAIXAS as FAIXAS_SDB, QUADROS as QUADROS_SDB, REVISAO as REVISAO_SDB} from './videos/orcamentosenhordobonfim/OrcamentoSenhorDoBonfim';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSenhorDoBonfim" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Composition id="OrcamentoSenhorDoBonfimGuia" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Composition id="OrcamentoSenhorDoBonfimLimpo" component={OrcamentoSenhorDoBonfim} durationInFrames={QUADROS_SDB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SDB, revisao: REVISAO_SDB}} />
    <Still id="CapaOrcamentoSenhorDoBonfim" component={CapaOrcamentoSenhorDoBonfim} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
