// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMonteSanto, CapaOrcamentoMonteSanto, FAIXAS as FAIXAS_MONTESANTO, QUADROS as QUADROS_MONTESANTO, REVISAO as REVISAO_MONTESANTO} from './videos/orcamentomontesanto/OrcamentoMonteSanto';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMonteSanto" component={OrcamentoMonteSanto} durationInFrames={QUADROS_MONTESANTO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MONTESANTO, revisao: REVISAO_MONTESANTO}} />
    <Composition id="OrcamentoMonteSantoGuia" component={OrcamentoMonteSanto} durationInFrames={QUADROS_MONTESANTO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MONTESANTO, revisao: REVISAO_MONTESANTO}} />
    <Composition id="OrcamentoMonteSantoLimpo" component={OrcamentoMonteSanto} durationInFrames={QUADROS_MONTESANTO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MONTESANTO, revisao: REVISAO_MONTESANTO}} />
    <Still id="CapaOrcamentoMonteSanto" component={CapaOrcamentoMonteSanto} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
