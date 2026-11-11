// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoAlmadina, CapaOrcamentoAlmadina, FAIXAS as FAIXAS_ALM, QUADROS as QUADROS_ALM, REVISAO as REVISAO_ALM} from './videos/orcamentoalmadina/OrcamentoAlmadina';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoAlmadina" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Composition id="OrcamentoAlmadinaGuia" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Composition id="OrcamentoAlmadinaLimpo" component={OrcamentoAlmadina} durationInFrames={QUADROS_ALM} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ALM, revisao: REVISAO_ALM}} />
    <Still id="CapaOrcamentoAlmadina" component={CapaOrcamentoAlmadina} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
