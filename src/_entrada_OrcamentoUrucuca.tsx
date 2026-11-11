// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoUrucuca, CapaOrcamentoUrucuca, FAIXAS as FAIXAS_URU, QUADROS as QUADROS_URU, REVISAO as REVISAO_URU} from './videos/orcamentourucuca/OrcamentoUrucuca';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoUrucuca" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Composition id="OrcamentoUrucucaGuia" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Composition id="OrcamentoUrucucaLimpo" component={OrcamentoUrucuca} durationInFrames={QUADROS_URU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_URU, revisao: REVISAO_URU}} />
    <Still id="CapaOrcamentoUrucuca" component={CapaOrcamentoUrucuca} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
