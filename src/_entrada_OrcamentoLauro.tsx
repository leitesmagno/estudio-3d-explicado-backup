// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoLauro, CapaOrcamentoLauro, FAIXAS as FAIXAS_LDF, QUADROS as QUADROS_LDF, REVISAO as REVISAO_LDF} from './videos/orcamentolauro/OrcamentoLauro';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoLauro" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Composition id="OrcamentoLauroGuia" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Composition id="OrcamentoLauroLimpo" component={OrcamentoLauro} durationInFrames={QUADROS_LDF} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LDF, revisao: REVISAO_LDF}} />
    <Still id="CapaOrcamentoLauro" component={CapaOrcamentoLauro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
