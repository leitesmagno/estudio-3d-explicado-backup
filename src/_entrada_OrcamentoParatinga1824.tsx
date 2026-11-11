// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoParatinga1824, CapaOrcamentoParatinga1824, FAIXAS as FAIXAS_PAR1824, QUADROS as QUADROS_PAR1824, REVISAO as REVISAO_PAR1824} from './videos/orcamentoparatinga1824/OrcamentoParatinga1824';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoParatinga1824" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Composition id="OrcamentoParatinga1824Guia" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Composition id="OrcamentoParatinga1824Limpo" component={OrcamentoParatinga1824} durationInFrames={QUADROS_PAR1824} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PAR1824, revisao: REVISAO_PAR1824}} />
    <Still id="CapaOrcamentoParatinga1824" component={CapaOrcamentoParatinga1824} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
