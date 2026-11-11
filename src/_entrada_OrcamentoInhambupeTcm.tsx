// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoInhambupeTcm, CapaOrcamentoInhambupeTcm, FAIXAS as FAIXAS_INT, QUADROS as QUADROS_INT, REVISAO as REVISAO_INT} from './videos/orcamentoinhambupetcm/OrcamentoInhambupeTcm';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoInhambupeTcm" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Composition id="OrcamentoInhambupeTcmGuia" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Composition id="OrcamentoInhambupeTcmLimpo" component={OrcamentoInhambupeTcm} durationInFrames={QUADROS_INT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_INT, revisao: REVISAO_INT}} />
    <Still id="CapaOrcamentoInhambupeTcm" component={CapaOrcamentoInhambupeTcm} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
