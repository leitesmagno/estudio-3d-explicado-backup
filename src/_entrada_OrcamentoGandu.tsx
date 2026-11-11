// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoGandu, CapaOrcamentoGandu, FAIXAS as FAIXAS_GND, QUADROS as QUADROS_GND, REVISAO as REVISAO_GND} from './videos/orcamentogandu/OrcamentoGandu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoGandu" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Composition id="OrcamentoGanduGuia" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Composition id="OrcamentoGanduLimpo" component={OrcamentoGandu} durationInFrames={QUADROS_GND} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_GND, revisao: REVISAO_GND}} />
    <Still id="CapaOrcamentoGandu" component={CapaOrcamentoGandu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
