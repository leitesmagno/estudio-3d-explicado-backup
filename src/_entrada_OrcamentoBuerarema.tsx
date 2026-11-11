// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBuerarema, CapaOrcamentoBuerarema, FAIXAS as FAIXAS_BUE, QUADROS as QUADROS_BUE, REVISAO as REVISAO_BUE} from './videos/orcamentobuerarema/OrcamentoBuerarema';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBuerarema" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Composition id="OrcamentoBueraremaGuia" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Composition id="OrcamentoBueraremaLimpo" component={OrcamentoBuerarema} durationInFrames={QUADROS_BUE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BUE, revisao: REVISAO_BUE}} />
    <Still id="CapaOrcamentoBuerarema" component={CapaOrcamentoBuerarema} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
