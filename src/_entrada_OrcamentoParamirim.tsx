// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoParamirim, CapaOrcamentoParamirim, FAIXAS as FAIXAS_PMI, QUADROS as QUADROS_PMI, REVISAO as REVISAO_PMI} from './videos/orcamentoparamirim/OrcamentoParamirim';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoParamirim" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Composition id="OrcamentoParamirimGuia" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Composition id="OrcamentoParamirimLimpo" component={OrcamentoParamirim} durationInFrames={QUADROS_PMI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PMI, revisao: REVISAO_PMI}} />
    <Still id="CapaOrcamentoParamirim" component={CapaOrcamentoParamirim} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
