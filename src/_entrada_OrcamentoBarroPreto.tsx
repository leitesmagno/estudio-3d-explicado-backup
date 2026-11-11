// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBarroPreto, CapaOrcamentoBarroPreto, FAIXAS as FAIXAS_BPR, QUADROS as QUADROS_BPR, REVISAO as REVISAO_BPR} from './videos/orcamentobarropreto/OrcamentoBarroPreto';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBarroPreto" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Composition id="OrcamentoBarroPretoGuia" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Composition id="OrcamentoBarroPretoLimpo" component={OrcamentoBarroPreto} durationInFrames={QUADROS_BPR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BPR, revisao: REVISAO_BPR}} />
    <Still id="CapaOrcamentoBarroPreto" component={CapaOrcamentoBarroPreto} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
