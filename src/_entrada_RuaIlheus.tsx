// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {RuaIlheus, CapaRuaIlheus, FAIXAS as FAIXAS_RI, QUADROS as QUADROS_RI, REVISAO as REVISAO_RI} from './videos/ruailheus/RuaIlheus';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="RuaIlheus" component={RuaIlheus} durationInFrames={QUADROS_RI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_RI, revisao: REVISAO_RI}} />
    <Composition id="RuaIlheusGuia" component={RuaIlheus} durationInFrames={QUADROS_RI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_RI, revisao: REVISAO_RI}} />
    <Composition id="RuaIlheusLimpo" component={RuaIlheus} durationInFrames={QUADROS_RI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_RI, revisao: REVISAO_RI}} />
    <Still id="CapaRuaIlheus" component={CapaRuaIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
