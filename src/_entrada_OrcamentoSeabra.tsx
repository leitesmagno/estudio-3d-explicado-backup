// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSeabra, CapaOrcamentoSeabra, FAIXAS as FAIXAS_SEA, QUADROS as QUADROS_SEA, REVISAO as REVISAO_SEA} from './videos/orcamentoseabra/OrcamentoSeabra';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSeabra" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Composition id="OrcamentoSeabraGuia" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Composition id="OrcamentoSeabraLimpo" component={OrcamentoSeabra} durationInFrames={QUADROS_SEA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SEA, revisao: REVISAO_SEA}} />
    <Still id="CapaOrcamentoSeabra" component={CapaOrcamentoSeabra} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
