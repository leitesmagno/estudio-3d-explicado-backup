// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSantaLuzia, CapaOrcamentoSantaLuzia, FAIXAS as FAIXAS_SLZ, QUADROS as QUADROS_SLZ, REVISAO as REVISAO_SLZ} from './videos/orcamentosantaluzia/OrcamentoSantaLuzia';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSantaLuzia" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Composition id="OrcamentoSantaLuziaGuia" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Composition id="OrcamentoSantaLuziaLimpo" component={OrcamentoSantaLuzia} durationInFrames={QUADROS_SLZ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SLZ, revisao: REVISAO_SLZ}} />
    <Still id="CapaOrcamentoSantaLuzia" component={CapaOrcamentoSantaLuzia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
