// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {Cbs2027Berni, CapaCbs2027Berni, FAIXAS as FAIXAS_CBB, QUADROS as QUADROS_CBB, REVISAO as REVISAO_CBB} from './videos/cbs2027berni/Cbs2027Berni';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="Cbs2027Berni" component={Cbs2027Berni} durationInFrames={QUADROS_CBB} {...base} defaultProps={{estilo: 'berni', faixas: FAIXAS_CBB, revisao: REVISAO_CBB}} />
      <Composition id="Cbs2027BerniGuia" component={Cbs2027Berni} durationInFrames={QUADROS_CBB} {...base} defaultProps={{estilo: 'berni', guia: true, faixas: FAIXAS_CBB, revisao: REVISAO_CBB}} />
      <Composition id="Cbs2027BerniLimpo" component={Cbs2027Berni} durationInFrames={QUADROS_CBB} {...base} defaultProps={{estilo: 'berni', semInterface: true, faixas: FAIXAS_CBB, revisao: REVISAO_CBB}} />
      <Still id="CapaCbs2027Berni" component={CapaCbs2027Berni} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'berni'}} />
  </>
);
registerRoot(Raiz);
