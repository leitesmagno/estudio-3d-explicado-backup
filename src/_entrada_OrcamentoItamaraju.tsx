// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItamaraju, CapaOrcamentoItamaraju, FAIXAS as FAIXAS_ITA, QUADROS as QUADROS_ITA, REVISAO as REVISAO_ITA} from './videos/orcamentoitamaraju/OrcamentoItamaraju';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItamaraju" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Composition id="OrcamentoItamarajuGuia" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Composition id="OrcamentoItamarajuLimpo" component={OrcamentoItamaraju} durationInFrames={QUADROS_ITA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITA, revisao: REVISAO_ITA}} />
    <Still id="CapaOrcamentoItamaraju" component={CapaOrcamentoItamaraju} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
