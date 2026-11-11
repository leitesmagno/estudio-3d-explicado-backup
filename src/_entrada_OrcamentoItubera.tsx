// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItubera, CapaOrcamentoItubera, FAIXAS as FAIXAS_ITU, QUADROS as QUADROS_ITU, REVISAO as REVISAO_ITU} from './videos/orcamentoitubera/OrcamentoItubera';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItubera" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Composition id="OrcamentoItuberaGuia" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Composition id="OrcamentoItuberaLimpo" component={OrcamentoItubera} durationInFrames={QUADROS_ITU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITU, revisao: REVISAO_ITU}} />
    <Still id="CapaOrcamentoItubera" component={CapaOrcamentoItubera} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
