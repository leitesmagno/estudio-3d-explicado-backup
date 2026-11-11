// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoNovaVicosa, CapaOrcamentoNovaVicosa, FAIXAS as FAIXAS_NVI, QUADROS as QUADROS_NVI, REVISAO as REVISAO_NVI} from './videos/orcamentonovavicosa/OrcamentoNovaVicosa';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoNovaVicosa" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Composition id="OrcamentoNovaVicosaGuia" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Composition id="OrcamentoNovaVicosaLimpo" component={OrcamentoNovaVicosa} durationInFrames={QUADROS_NVI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_NVI, revisao: REVISAO_NVI}} />
    <Still id="CapaOrcamentoNovaVicosa" component={CapaOrcamentoNovaVicosa} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
