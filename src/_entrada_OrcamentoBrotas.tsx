// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBrotas, CapaOrcamentoBrotas, FAIXAS as FAIXAS_BRO, QUADROS as QUADROS_BRO, REVISAO as REVISAO_BRO} from './videos/orcamentobrotas/OrcamentoBrotas';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBrotas" component={OrcamentoBrotas} durationInFrames={QUADROS_BRO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BRO, revisao: REVISAO_BRO}} />
    <Composition id="OrcamentoBrotasGuia" component={OrcamentoBrotas} durationInFrames={QUADROS_BRO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BRO, revisao: REVISAO_BRO}} />
    <Composition id="OrcamentoBrotasLimpo" component={OrcamentoBrotas} durationInFrames={QUADROS_BRO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BRO, revisao: REVISAO_BRO}} />
    <Still id="CapaOrcamentoBrotas" component={CapaOrcamentoBrotas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
