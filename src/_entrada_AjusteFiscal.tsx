// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {AjusteFiscal, CapaAjusteFiscal, FAIXAS as FAIXAS_AJF, QUADROS as QUADROS_AJF, REVISAO as REVISAO_AJF} from './videos/ajustefiscal/AjusteFiscal';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
      <Composition id="AjusteFiscal" component={AjusteFiscal} durationInFrames={QUADROS_AJF} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_AJF, revisao: REVISAO_AJF}} />
      <Composition id="AjusteFiscalGuia" component={AjusteFiscal} durationInFrames={QUADROS_AJF} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_AJF, revisao: REVISAO_AJF}} />
      <Composition id="AjusteFiscalLimpo" component={AjusteFiscal} durationInFrames={QUADROS_AJF} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_AJF, revisao: REVISAO_AJF}} />
      <Still id="CapaAjusteFiscal" component={CapaAjusteFiscal} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
