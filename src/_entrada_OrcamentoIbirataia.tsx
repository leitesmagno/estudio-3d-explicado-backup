// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoIbirataia, CapaOrcamentoIbirataia, FAIXAS as FAIXAS_IBR, QUADROS as QUADROS_IBR, REVISAO as REVISAO_IBR} from './videos/orcamentoibirataia/OrcamentoIbirataia';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoIbirataia" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Composition id="OrcamentoIbirataiaGuia" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Composition id="OrcamentoIbirataiaLimpo" component={OrcamentoIbirataia} durationInFrames={QUADROS_IBR} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBR, revisao: REVISAO_IBR}} />
    <Still id="CapaOrcamentoIbirataia" component={CapaOrcamentoIbirataia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
