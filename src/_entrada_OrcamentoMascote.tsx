// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMascote, CapaOrcamentoMascote, FAIXAS as FAIXAS_MSC, QUADROS as QUADROS_MSC, REVISAO as REVISAO_MSC} from './videos/orcamentomascote/OrcamentoMascote';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMascote" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Composition id="OrcamentoMascoteGuia" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Composition id="OrcamentoMascoteLimpo" component={OrcamentoMascote} durationInFrames={QUADROS_MSC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MSC, revisao: REVISAO_MSC}} />
    <Still id="CapaOrcamentoMascote" component={CapaOrcamentoMascote} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
