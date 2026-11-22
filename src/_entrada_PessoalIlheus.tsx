// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {PessoalIlheus, CapaPessoalIlheus, FAIXAS as FAIXAS_PI, QUADROS as QUADROS_PI, REVISAO as REVISAO_PI} from './videos/pessoalilheus/PessoalIlheus';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="PessoalIlheus" component={PessoalIlheus} durationInFrames={QUADROS_PI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PI, revisao: REVISAO_PI}} />
    <Composition id="PessoalIlheusGuia" component={PessoalIlheus} durationInFrames={QUADROS_PI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PI, revisao: REVISAO_PI}} />
    <Composition id="PessoalIlheusLimpo" component={PessoalIlheus} durationInFrames={QUADROS_PI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PI, revisao: REVISAO_PI}} />
    <Still id="CapaPessoalIlheus" component={CapaPessoalIlheus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
