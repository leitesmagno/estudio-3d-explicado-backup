// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMacaubas, CapaOrcamentoMacaubas, FAIXAS as FAIXAS_MCB, QUADROS as QUADROS_MCB, REVISAO as REVISAO_MCB} from './videos/orcamentomacaubas/OrcamentoMacaubas';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMacaubas" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Composition id="OrcamentoMacaubasGuia" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Composition id="OrcamentoMacaubasLimpo" component={OrcamentoMacaubas} durationInFrames={QUADROS_MCB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MCB, revisao: REVISAO_MCB}} />
    <Still id="CapaOrcamentoMacaubas" component={CapaOrcamentoMacaubas} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
