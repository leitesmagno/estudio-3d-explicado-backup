// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItapebi, CapaOrcamentoItapebi, FAIXAS as FAIXAS_ITPB, QUADROS as QUADROS_ITPB, REVISAO as REVISAO_ITPB} from './videos/orcamentoitapebi/OrcamentoItapebi';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItapebi" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Composition id="OrcamentoItapebiGuia" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Composition id="OrcamentoItapebiLimpo" component={OrcamentoItapebi} durationInFrames={QUADROS_ITPB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITPB, revisao: REVISAO_ITPB}} />
    <Still id="CapaOrcamentoItapebi" component={CapaOrcamentoItapebi} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
