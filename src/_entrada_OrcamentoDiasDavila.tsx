// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoDiasDavila, CapaOrcamentoDiasDavila, FAIXAS as FAIXAS_DDA, QUADROS as QUADROS_DDA, REVISAO as REVISAO_DDA} from './videos/orcamentodiasdavila/OrcamentoDiasDavila';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoDiasDavila" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Composition id="OrcamentoDiasDavilaGuia" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Composition id="OrcamentoDiasDavilaLimpo" component={OrcamentoDiasDavila} durationInFrames={QUADROS_DDA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DDA, revisao: REVISAO_DDA}} />
    <Still id="CapaOrcamentoDiasDavila" component={CapaOrcamentoDiasDavila} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
