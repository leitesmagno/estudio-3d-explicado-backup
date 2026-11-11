// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCarinhanha, CapaOrcamentoCarinhanha, FAIXAS as FAIXAS_CARINHANHA, QUADROS as QUADROS_CARINHANHA, REVISAO as REVISAO_CARINHANHA} from './videos/orcamentocarinhanha/OrcamentoCarinhanha';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCarinhanha" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Composition id="OrcamentoCarinhanhaGuia" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Composition id="OrcamentoCarinhanhaLimpo" component={OrcamentoCarinhanha} durationInFrames={QUADROS_CARINHANHA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CARINHANHA, revisao: REVISAO_CARINHANHA}} />
    <Still id="CapaOrcamentoCarinhanha" component={CapaOrcamentoCarinhanha} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
