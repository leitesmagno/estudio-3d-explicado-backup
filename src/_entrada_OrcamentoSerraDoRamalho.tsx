// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSerraDoRamalho, CapaOrcamentoSerraDoRamalho, FAIXAS as FAIXAS_SERRARAMALHO, QUADROS as QUADROS_SERRARAMALHO, REVISAO as REVISAO_SERRARAMALHO} from './videos/orcamentoserradoramalho/OrcamentoSerraDoRamalho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSerraDoRamalho" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Composition id="OrcamentoSerraDoRamalhoGuia" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Composition id="OrcamentoSerraDoRamalhoLimpo" component={OrcamentoSerraDoRamalho} durationInFrames={QUADROS_SERRARAMALHO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SERRARAMALHO, revisao: REVISAO_SERRARAMALHO}} />
    <Still id="CapaOrcamentoSerraDoRamalho" component={CapaOrcamentoSerraDoRamalho} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
