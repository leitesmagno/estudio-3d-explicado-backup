// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoIlheusTcm, CapaOrcamentoIlheusTcm, FAIXAS as FAIXAS_ILT, QUADROS as QUADROS_ILT, REVISAO as REVISAO_ILT} from './videos/orcamentoilheustcm/OrcamentoIlheusTcm';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoIlheusTcm" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Composition id="OrcamentoIlheusTcmGuia" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Composition id="OrcamentoIlheusTcmLimpo" component={OrcamentoIlheusTcm} durationInFrames={QUADROS_ILT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ILT, revisao: REVISAO_ILT}} />
    <Still id="CapaOrcamentoIlheusTcm" component={CapaOrcamentoIlheusTcm} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
