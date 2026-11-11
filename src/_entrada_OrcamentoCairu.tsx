// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCairu, CapaOrcamentoCairu, FAIXAS as FAIXAS_CAI, QUADROS as QUADROS_CAI, REVISAO as REVISAO_CAI} from './videos/orcamentocairu/OrcamentoCairu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCairu" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Composition id="OrcamentoCairuGuia" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Composition id="OrcamentoCairuLimpo" component={OrcamentoCairu} durationInFrames={QUADROS_CAI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAI, revisao: REVISAO_CAI}} />
    <Still id="CapaOrcamentoCairu" component={CapaOrcamentoCairu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
