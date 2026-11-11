// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCatu, CapaOrcamentoCatu, FAIXAS as FAIXAS_CATU, QUADROS as QUADROS_CATU, REVISAO as REVISAO_CATU} from './videos/orcamentocatu/OrcamentoCatu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCatu" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Composition id="OrcamentoCatuGuia" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Composition id="OrcamentoCatuLimpo" component={OrcamentoCatu} durationInFrames={QUADROS_CATU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CATU, revisao: REVISAO_CATU}} />
    <Still id="CapaOrcamentoCatu" component={CapaOrcamentoCatu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
