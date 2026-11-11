// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSaoJoseVitoria, CapaOrcamentoSaoJoseVitoria, FAIXAS as FAIXAS_SJV, QUADROS as QUADROS_SJV, REVISAO as REVISAO_SJV} from './videos/orcamentosaojosevitoria/OrcamentoSaoJoseVitoria';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSaoJoseVitoria" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Composition id="OrcamentoSaoJoseVitoriaGuia" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Composition id="OrcamentoSaoJoseVitoriaLimpo" component={OrcamentoSaoJoseVitoria} durationInFrames={QUADROS_SJV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SJV, revisao: REVISAO_SJV}} />
    <Still id="CapaOrcamentoSaoJoseVitoria" component={CapaOrcamentoSaoJoseVitoria} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
