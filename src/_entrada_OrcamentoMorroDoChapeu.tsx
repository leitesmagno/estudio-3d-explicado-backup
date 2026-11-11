// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMorroDoChapeu, CapaOrcamentoMorroDoChapeu, FAIXAS as FAIXAS_MORROCHAPEU, QUADROS as QUADROS_MORROCHAPEU, REVISAO as REVISAO_MORROCHAPEU} from './videos/orcamentomorrodochapeu/OrcamentoMorroDoChapeu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMorroDoChapeu" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Composition id="OrcamentoMorroDoChapeuGuia" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Composition id="OrcamentoMorroDoChapeuLimpo" component={OrcamentoMorroDoChapeu} durationInFrames={QUADROS_MORROCHAPEU} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MORROCHAPEU, revisao: REVISAO_MORROCHAPEU}} />
    <Still id="CapaOrcamentoMorroDoChapeu" component={CapaOrcamentoMorroDoChapeu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
