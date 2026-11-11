// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoSantoAmaro, CapaOrcamentoSantoAmaro, FAIXAS as FAIXAS_SAM, QUADROS as QUADROS_SAM, REVISAO as REVISAO_SAM} from './videos/orcamentosantoamaro/OrcamentoSantoAmaro';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoSantoAmaro" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Composition id="OrcamentoSantoAmaroGuia" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Composition id="OrcamentoSantoAmaroLimpo" component={OrcamentoSantoAmaro} durationInFrames={QUADROS_SAM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_SAM, revisao: REVISAO_SAM}} />
    <Still id="CapaOrcamentoSantoAmaro" component={CapaOrcamentoSantoAmaro} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
