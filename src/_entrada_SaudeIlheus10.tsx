// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {SaudeIlheus10, CapaSaudeIlheus10, FAIXAS as FAIXAS_SI10, QUADROS as QUADROS_SI10, REVISAO as REVISAO_SI10} from './videos/saudeilheus10/SaudeIlheus10';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="SaudeIlheus10" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Composition id="SaudeIlheus10Guia" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Composition id="SaudeIlheus10Limpo" component={SaudeIlheus10} durationInFrames={QUADROS_SI10} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SI10, revisao: REVISAO_SI10}} />
    <Still id="CapaSaudeIlheus10" component={CapaSaudeIlheus10} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
