// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoFlorestaAzul, CapaOrcamentoFlorestaAzul, FAIXAS as FAIXAS_FLA, QUADROS as QUADROS_FLA, REVISAO as REVISAO_FLA} from './videos/orcamentoflorestaazul/OrcamentoFlorestaAzul';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoFlorestaAzul" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Composition id="OrcamentoFlorestaAzulGuia" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Composition id="OrcamentoFlorestaAzulLimpo" component={OrcamentoFlorestaAzul} durationInFrames={QUADROS_FLA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FLA, revisao: REVISAO_FLA}} />
    <Still id="CapaOrcamentoFlorestaAzul" component={CapaOrcamentoFlorestaAzul} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
