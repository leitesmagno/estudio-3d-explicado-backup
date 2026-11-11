// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoJequie, CapaOrcamentoJequie, FAIXAS as FAIXAS_JEQ, QUADROS as QUADROS_JEQ, REVISAO as REVISAO_JEQ} from './videos/orcamentojequie/OrcamentoJequie';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoJequie" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Composition id="OrcamentoJequieGuia" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Composition id="OrcamentoJequieLimpo" component={OrcamentoJequie} durationInFrames={QUADROS_JEQ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JEQ, revisao: REVISAO_JEQ}} />
    <Still id="CapaOrcamentoJequie" component={CapaOrcamentoJequie} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
