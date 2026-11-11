// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCastroAlves, CapaOrcamentoCastroAlves, FAIXAS as FAIXAS_CAV, QUADROS as QUADROS_CAV, REVISAO as REVISAO_CAV} from './videos/orcamentocastroalves/OrcamentoCastroAlves';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCastroAlves" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Composition id="OrcamentoCastroAlvesGuia" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Composition id="OrcamentoCastroAlvesLimpo" component={OrcamentoCastroAlves} durationInFrames={QUADROS_CAV} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAV, revisao: REVISAO_CAV}} />
    <Still id="CapaOrcamentoCastroAlves" component={CapaOrcamentoCastroAlves} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
