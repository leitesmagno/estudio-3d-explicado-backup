// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {BielaTinho, CapaBielaTinho, FAIXAS as FAIXAS_BT, QUADROS as QUADROS_BT, REVISAO as REVISAO_BT} from './videos/bielatinho/BielaTinho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="BielaTinho" component={BielaTinho} durationInFrames={QUADROS_BT} {...base} defaultProps={{estilo: 'tinho', faixas: FAIXAS_BT, revisao: REVISAO_BT}} />
    <Composition id="BielaTinhoGuia" component={BielaTinho} durationInFrames={QUADROS_BT} {...base} defaultProps={{estilo: 'tinho', guia: true, faixas: FAIXAS_BT, revisao: REVISAO_BT}} />
    <Composition id="BielaTinhoLimpo" component={BielaTinho} durationInFrames={QUADROS_BT} {...base} defaultProps={{estilo: 'tinho', semInterface: true, faixas: FAIXAS_BT, revisao: REVISAO_BT}} />
    <Still id="CapaBielaTinho" component={CapaBielaTinho} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'tinho'}} />
  </>
);
registerRoot(Raiz);
