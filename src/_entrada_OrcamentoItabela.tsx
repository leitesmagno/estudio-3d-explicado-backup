// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItabela, CapaOrcamentoItabela, FAIXAS as FAIXAS_ITB, QUADROS as QUADROS_ITB, REVISAO as REVISAO_ITB} from './videos/orcamentoitabela/OrcamentoItabela';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItabela" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Composition id="OrcamentoItabelaGuia" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Composition id="OrcamentoItabelaLimpo" component={OrcamentoItabela} durationInFrames={QUADROS_ITB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITB, revisao: REVISAO_ITB}} />
    <Still id="CapaOrcamentoItabela" component={CapaOrcamentoItabela} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
