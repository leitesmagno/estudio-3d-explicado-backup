// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoRioDeJaneiro, CapaOrcamentoRioDeJaneiro, FAIXAS as FAIXAS_RIO, QUADROS as QUADROS_RIO, REVISAO as REVISAO_RIO} from './videos/orcamentoriodejaneiro/OrcamentoRioDeJaneiro';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoRioDeJaneiro" component={OrcamentoRioDeJaneiro} durationInFrames={QUADROS_RIO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RIO, revisao: REVISAO_RIO}} />
    <Composition id="OrcamentoRioDeJaneiroGuia" component={OrcamentoRioDeJaneiro} durationInFrames={QUADROS_RIO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RIO, revisao: REVISAO_RIO}} />
    <Composition id="OrcamentoRioDeJaneiroLimpo" component={OrcamentoRioDeJaneiro} durationInFrames={QUADROS_RIO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RIO, revisao: REVISAO_RIO}} />
    <Still id="CapaOrcamentoRioDeJaneiro" component={CapaOrcamentoRioDeJaneiro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
