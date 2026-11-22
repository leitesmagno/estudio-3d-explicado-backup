// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {DarkHorse, CapaDarkHorse, FAIXAS as FAIXAS_DKH, QUADROS as QUADROS_DKH, REVISAO as REVISAO_DKH} from './videos/darkhorse/DarkHorse';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="DarkHorse" component={DarkHorse} durationInFrames={QUADROS_DKH} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_DKH, revisao: REVISAO_DKH}} />
      <Composition id="DarkHorseGuia" component={DarkHorse} durationInFrames={QUADROS_DKH} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_DKH, revisao: REVISAO_DKH}} />
      <Composition id="DarkHorseLimpo" component={DarkHorse} durationInFrames={QUADROS_DKH} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_DKH, revisao: REVISAO_DKH}} />
      <Still id="CapaDarkHorse" component={CapaDarkHorse} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
