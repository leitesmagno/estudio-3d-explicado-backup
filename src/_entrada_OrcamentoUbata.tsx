// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoUbata, CapaOrcamentoUbata, FAIXAS as FAIXAS_UBTA, QUADROS as QUADROS_UBTA, REVISAO as REVISAO_UBTA} from './videos/orcamentoubata/OrcamentoUbata';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoUbata" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Composition id="OrcamentoUbataGuia" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Composition id="OrcamentoUbataLimpo" component={OrcamentoUbata} durationInFrames={QUADROS_UBTA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_UBTA, revisao: REVISAO_UBTA}} />
    <Still id="CapaOrcamentoUbata" component={CapaOrcamentoUbata} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
