// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoEntreRios, CapaOrcamentoEntreRios, FAIXAS as FAIXAS_ER, QUADROS as QUADROS_ER, REVISAO as REVISAO_ER} from './videos/orcamentoentrerios/OrcamentoEntreRios';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoEntreRios" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Composition id="OrcamentoEntreRiosGuia" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Composition id="OrcamentoEntreRiosLimpo" component={OrcamentoEntreRios} durationInFrames={QUADROS_ER} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ER, revisao: REVISAO_ER}} />
    <Still id="CapaOrcamentoEntreRios" component={CapaOrcamentoEntreRios} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
