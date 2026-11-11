// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoArataca, CapaOrcamentoArataca, FAIXAS as FAIXAS_ARA, QUADROS as QUADROS_ARA, REVISAO as REVISAO_ARA} from './videos/orcamentoarataca/OrcamentoArataca';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoArataca" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Composition id="OrcamentoAratacaGuia" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Composition id="OrcamentoAratacaLimpo" component={OrcamentoArataca} durationInFrames={QUADROS_ARA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ARA, revisao: REVISAO_ARA}} />
    <Still id="CapaOrcamentoArataca" component={CapaOrcamentoArataca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
