// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoRuyBarbosa, CapaOrcamentoRuyBarbosa, FAIXAS as FAIXAS_RUYBARBOSA, QUADROS as QUADROS_RUYBARBOSA, REVISAO as REVISAO_RUYBARBOSA} from './videos/orcamentoruybarbosa/OrcamentoRuyBarbosa';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoRuyBarbosa" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Composition id="OrcamentoRuyBarbosaGuia" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Composition id="OrcamentoRuyBarbosaLimpo" component={OrcamentoRuyBarbosa} durationInFrames={QUADROS_RUYBARBOSA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RUYBARBOSA, revisao: REVISAO_RUYBARBOSA}} />
    <Still id="CapaOrcamentoRuyBarbosa" component={CapaOrcamentoRuyBarbosa} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
