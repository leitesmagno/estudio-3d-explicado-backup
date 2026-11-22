// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoFirminoAlves, CapaOrcamentoFirminoAlves, FAIXAS as FAIXAS_FIA, QUADROS as QUADROS_FIA, REVISAO as REVISAO_FIA} from './videos/orcamentofirminoalves/OrcamentoFirminoAlves';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoFirminoAlves" component={OrcamentoFirminoAlves} durationInFrames={QUADROS_FIA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_FIA, revisao: REVISAO_FIA}} />
    <Composition id="OrcamentoFirminoAlvesGuia" component={OrcamentoFirminoAlves} durationInFrames={QUADROS_FIA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_FIA, revisao: REVISAO_FIA}} />
    <Composition id="OrcamentoFirminoAlvesLimpo" component={OrcamentoFirminoAlves} durationInFrames={QUADROS_FIA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_FIA, revisao: REVISAO_FIA}} />
    <Still id="CapaOrcamentoFirminoAlves" component={CapaOrcamentoFirminoAlves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
