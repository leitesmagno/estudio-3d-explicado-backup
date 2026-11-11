// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItagiba, CapaOrcamentoItagiba, FAIXAS as FAIXAS_ITGB, QUADROS as QUADROS_ITGB, REVISAO as REVISAO_ITGB} from './videos/orcamentoitagiba/OrcamentoItagiba';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItagiba" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Composition id="OrcamentoItagibaGuia" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Composition id="OrcamentoItagibaLimpo" component={OrcamentoItagiba} durationInFrames={QUADROS_ITGB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITGB, revisao: REVISAO_ITGB}} />
    <Still id="CapaOrcamentoItagiba" component={CapaOrcamentoItagiba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
