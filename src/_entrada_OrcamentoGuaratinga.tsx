// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoGuaratinga, CapaOrcamentoGuaratinga, FAIXAS as FAIXAS_GRT, QUADROS as QUADROS_GRT, REVISAO as REVISAO_GRT} from './videos/orcamentoguaratinga/OrcamentoGuaratinga';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoGuaratinga" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Composition id="OrcamentoGuaratingaGuia" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Composition id="OrcamentoGuaratingaLimpo" component={OrcamentoGuaratinga} durationInFrames={QUADROS_GRT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GRT, revisao: REVISAO_GRT}} />
    <Still id="CapaOrcamentoGuaratinga" component={CapaOrcamentoGuaratinga} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
