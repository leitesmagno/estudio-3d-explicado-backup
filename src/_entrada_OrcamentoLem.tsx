// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoLem, CapaOrcamentoLem, FAIXAS as FAIXAS_LEM, QUADROS as QUADROS_LEM, REVISAO as REVISAO_LEM} from './videos/orcamentolem/OrcamentoLem';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoLem" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Composition id="OrcamentoLemGuia" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Composition id="OrcamentoLemLimpo" component={OrcamentoLem} durationInFrames={QUADROS_LEM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_LEM, revisao: REVISAO_LEM}} />
    <Still id="CapaOrcamentoLem" component={CapaOrcamentoLem} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
