// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCaturama, CapaOrcamentoCaturama, FAIXAS as FAIXAS_CTM, QUADROS as QUADROS_CTM, REVISAO as REVISAO_CTM} from './videos/orcamentocaturama/OrcamentoCaturama';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCaturama" component={OrcamentoCaturama} durationInFrames={QUADROS_CTM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CTM, revisao: REVISAO_CTM}} />
    <Composition id="OrcamentoCaturamaGuia" component={OrcamentoCaturama} durationInFrames={QUADROS_CTM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CTM, revisao: REVISAO_CTM}} />
    <Composition id="OrcamentoCaturamaLimpo" component={OrcamentoCaturama} durationInFrames={QUADROS_CTM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CTM, revisao: REVISAO_CTM}} />
    <Still id="CapaOrcamentoCaturama" component={CapaOrcamentoCaturama} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
