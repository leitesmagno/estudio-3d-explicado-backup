// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoXiqueXique, CapaOrcamentoXiqueXique, FAIXAS as FAIXAS_XIQUEXIQUE, QUADROS as QUADROS_XIQUEXIQUE, REVISAO as REVISAO_XIQUEXIQUE} from './videos/orcamentoxiquexique/OrcamentoXiqueXique';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoXiqueXique" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Composition id="OrcamentoXiqueXiqueGuia" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Composition id="OrcamentoXiqueXiqueLimpo" component={OrcamentoXiqueXique} durationInFrames={QUADROS_XIQUEXIQUE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_XIQUEXIQUE, revisao: REVISAO_XIQUEXIQUE}} />
    <Still id="CapaOrcamentoXiqueXique" component={CapaOrcamentoXiqueXique} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
