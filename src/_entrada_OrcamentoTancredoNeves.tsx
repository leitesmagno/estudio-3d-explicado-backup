// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoTancredoNeves, CapaOrcamentoTancredoNeves, FAIXAS as FAIXAS_PTN, QUADROS as QUADROS_PTN, REVISAO as REVISAO_PTN} from './videos/orcamentotancredoneves/OrcamentoTancredoNeves';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoTancredoNeves" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Composition id="OrcamentoTancredoNevesGuia" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Composition id="OrcamentoTancredoNevesLimpo" component={OrcamentoTancredoNeves} durationInFrames={QUADROS_PTN} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PTN, revisao: REVISAO_PTN}} />
    <Still id="CapaOrcamentoTancredoNeves" component={CapaOrcamentoTancredoNeves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
