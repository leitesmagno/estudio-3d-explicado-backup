// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItaberaba, CapaOrcamentoItaberaba, FAIXAS as FAIXAS_ITABERABA, QUADROS as QUADROS_ITABERABA, REVISAO as REVISAO_ITABERABA} from './videos/orcamentoitaberaba/OrcamentoItaberaba';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItaberaba" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Composition id="OrcamentoItaberabaGuia" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Composition id="OrcamentoItaberabaLimpo" component={OrcamentoItaberaba} durationInFrames={QUADROS_ITABERABA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITABERABA, revisao: REVISAO_ITABERABA}} />
    <Still id="CapaOrcamentoItaberaba" component={CapaOrcamentoItaberaba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
