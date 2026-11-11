// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoValenca, CapaOrcamentoValenca, FAIXAS as FAIXAS_VAL, QUADROS as QUADROS_VAL, REVISAO as REVISAO_VAL} from './videos/orcamentovalenca/OrcamentoValenca';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoValenca" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Composition id="OrcamentoValencaGuia" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Composition id="OrcamentoValencaLimpo" component={OrcamentoValenca} durationInFrames={QUADROS_VAL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_VAL, revisao: REVISAO_VAL}} />
    <Still id="CapaOrcamentoValenca" component={CapaOrcamentoValenca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
