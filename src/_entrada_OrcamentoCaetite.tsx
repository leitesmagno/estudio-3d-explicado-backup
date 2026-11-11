// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCaetite, CapaOrcamentoCaetite, FAIXAS as FAIXAS_CAE, QUADROS as QUADROS_CAE, REVISAO as REVISAO_CAE} from './videos/orcamentocaetite/OrcamentoCaetite';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCaetite" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Composition id="OrcamentoCaetiteGuia" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Composition id="OrcamentoCaetiteLimpo" component={OrcamentoCaetite} durationInFrames={QUADROS_CAE} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAE, revisao: REVISAO_CAE}} />
    <Still id="CapaOrcamentoCaetite" component={CapaOrcamentoCaetite} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
