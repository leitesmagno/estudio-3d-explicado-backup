// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {ObrasIlheus10, CapaObrasIlheus10, FAIXAS as FAIXAS_OI10, QUADROS as QUADROS_OI10, REVISAO as REVISAO_OI10} from './videos/obrasilheus10/ObrasIlheus10';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="ObrasIlheus10" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Composition id="ObrasIlheus10Guia" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Composition id="ObrasIlheus10Limpo" component={ObrasIlheus10} durationInFrames={QUADROS_OI10} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_OI10, revisao: REVISAO_OI10}} />
    <Still id="CapaObrasIlheus10" component={CapaObrasIlheus10} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
