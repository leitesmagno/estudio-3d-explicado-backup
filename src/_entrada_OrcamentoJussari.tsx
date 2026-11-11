// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoJussari, CapaOrcamentoJussari, FAIXAS as FAIXAS_JUS, QUADROS as QUADROS_JUS, REVISAO as REVISAO_JUS} from './videos/orcamentojussari/OrcamentoJussari';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoJussari" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Composition id="OrcamentoJussariGuia" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Composition id="OrcamentoJussariLimpo" component={OrcamentoJussari} durationInFrames={QUADROS_JUS} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JUS, revisao: REVISAO_JUS}} />
    <Still id="CapaOrcamentoJussari" component={CapaOrcamentoJussari} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
