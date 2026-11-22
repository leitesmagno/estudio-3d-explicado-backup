// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoDomBasilio, CapaOrcamentoDomBasilio, FAIXAS as FAIXAS_DBS, QUADROS as QUADROS_DBS, REVISAO as REVISAO_DBS} from './videos/orcamentodombasilio/OrcamentoDomBasilio';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoDomBasilio" component={OrcamentoDomBasilio} durationInFrames={QUADROS_DBS} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DBS, revisao: REVISAO_DBS}} />
    <Composition id="OrcamentoDomBasilioGuia" component={OrcamentoDomBasilio} durationInFrames={QUADROS_DBS} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DBS, revisao: REVISAO_DBS}} />
    <Composition id="OrcamentoDomBasilioLimpo" component={OrcamentoDomBasilio} durationInFrames={QUADROS_DBS} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DBS, revisao: REVISAO_DBS}} />
    <Still id="CapaOrcamentoDomBasilio" component={CapaOrcamentoDomBasilio} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
