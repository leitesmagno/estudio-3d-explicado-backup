// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {AgroBb, CapaAgroBb, FAIXAS as FAIXAS_AGB, QUADROS as QUADROS_AGB, REVISAO as REVISAO_AGB} from './videos/agrobb/AgroBb';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="AgroBb" component={AgroBb} durationInFrames={QUADROS_AGB} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_AGB, revisao: REVISAO_AGB}} />
      <Composition id="AgroBbGuia" component={AgroBb} durationInFrames={QUADROS_AGB} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_AGB, revisao: REVISAO_AGB}} />
      <Composition id="AgroBbLimpo" component={AgroBb} durationInFrames={QUADROS_AGB} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_AGB, revisao: REVISAO_AGB}} />
      <Still id="CapaAgroBb" component={CapaAgroBb} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
