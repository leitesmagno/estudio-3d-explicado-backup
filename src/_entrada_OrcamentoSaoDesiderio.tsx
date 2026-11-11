// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSaoDesiderio, CapaOrcamentoSaoDesiderio, FAIXAS as FAIXAS_SAODESIDERIO, QUADROS as QUADROS_SAODESIDERIO, REVISAO as REVISAO_SAODESIDERIO} from './videos/orcamentosaodesiderio/OrcamentoSaoDesiderio';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSaoDesiderio" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Composition id="OrcamentoSaoDesiderioGuia" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Composition id="OrcamentoSaoDesiderioLimpo" component={OrcamentoSaoDesiderio} durationInFrames={QUADROS_SAODESIDERIO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAODESIDERIO, revisao: REVISAO_SAODESIDERIO}} />
    <Still id="CapaOrcamentoSaoDesiderio" component={CapaOrcamentoSaoDesiderio} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
