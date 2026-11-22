// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoAbaira, CapaOrcamentoAbaira, FAIXAS as FAIXAS_ABA, QUADROS as QUADROS_ABA, REVISAO as REVISAO_ABA} from './videos/orcamentoabaira/OrcamentoAbaira';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoAbaira" component={OrcamentoAbaira} durationInFrames={QUADROS_ABA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ABA, revisao: REVISAO_ABA}} />
    <Composition id="OrcamentoAbairaGuia" component={OrcamentoAbaira} durationInFrames={QUADROS_ABA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ABA, revisao: REVISAO_ABA}} />
    <Composition id="OrcamentoAbairaLimpo" component={OrcamentoAbaira} durationInFrames={QUADROS_ABA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ABA, revisao: REVISAO_ABA}} />
    <Still id="CapaOrcamentoAbaira" component={CapaOrcamentoAbaira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
