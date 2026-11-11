// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBotupora, CapaOrcamentoBotupora, FAIXAS as FAIXAS_BTP, QUADROS as QUADROS_BTP, REVISAO as REVISAO_BTP} from './videos/orcamentobotupora/OrcamentoBotupora';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBotupora" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Composition id="OrcamentoBotuporaGuia" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Composition id="OrcamentoBotuporaLimpo" component={OrcamentoBotupora} durationInFrames={QUADROS_BTP} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BTP, revisao: REVISAO_BTP}} />
    <Still id="CapaOrcamentoBotupora" component={CapaOrcamentoBotupora} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
