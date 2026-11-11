// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItambe, CapaOrcamentoItambe, FAIXAS as FAIXAS_IBE, QUADROS as QUADROS_IBE, REVISAO as REVISAO_IBE} from './videos/orcamentoitambe/OrcamentoItambe';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItambe" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Composition id="OrcamentoItambeGuia" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Composition id="OrcamentoItambeLimpo" component={OrcamentoItambe} durationInFrames={QUADROS_IBE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBE, revisao: REVISAO_IBE}} />
    <Still id="CapaOrcamentoItambe" component={CapaOrcamentoItambe} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
