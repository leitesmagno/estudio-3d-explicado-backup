// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoPiata, CapaOrcamentoPiata, FAIXAS as FAIXAS_PIA, QUADROS as QUADROS_PIA, REVISAO as REVISAO_PIA} from './videos/orcamentopiata/OrcamentoPiata';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoPiata" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Composition id="OrcamentoPiataGuia" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Composition id="OrcamentoPiataLimpo" component={OrcamentoPiata} durationInFrames={QUADROS_PIA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PIA, revisao: REVISAO_PIA}} />
    <Still id="CapaOrcamentoPiata" component={CapaOrcamentoPiata} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
