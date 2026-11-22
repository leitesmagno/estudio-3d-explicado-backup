// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {ArranqueTinho, CapaArranqueTinho, FAIXAS as FAIXAS_ARR, QUADROS as QUADROS_ARR, REVISAO as REVISAO_ARR} from './videos/arranquetinho/ArranqueTinho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="ArranqueTinho" component={ArranqueTinho} durationInFrames={QUADROS_ARR} {...base} defaultProps={{estilo: 'tinho', faixas: FAIXAS_ARR, revisao: REVISAO_ARR}} />
    <Composition id="ArranqueTinhoGuia" component={ArranqueTinho} durationInFrames={QUADROS_ARR} {...base} defaultProps={{estilo: 'tinho', guia: true, faixas: FAIXAS_ARR, revisao: REVISAO_ARR}} />
    <Composition id="ArranqueTinhoLimpo" component={ArranqueTinho} durationInFrames={QUADROS_ARR} {...base} defaultProps={{estilo: 'tinho', semInterface: true, faixas: FAIXAS_ARR, revisao: REVISAO_ARR}} />
    <Still id="CapaArranqueTinho" component={CapaArranqueTinho} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'tinho'}} />
  </>
);
registerRoot(Raiz);
