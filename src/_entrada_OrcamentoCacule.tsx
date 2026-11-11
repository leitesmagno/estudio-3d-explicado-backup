// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoCacule, CapaOrcamentoCacule, FAIXAS as FAIXAS_CAC, QUADROS as QUADROS_CAC, REVISAO as REVISAO_CAC} from './videos/orcamentocacule/OrcamentoCacule';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoCacule" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Composition id="OrcamentoCaculeGuia" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Composition id="OrcamentoCaculeLimpo" component={OrcamentoCacule} durationInFrames={QUADROS_CAC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_CAC, revisao: REVISAO_CAC}} />
    <Still id="CapaOrcamentoCacule" component={CapaOrcamentoCacule} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
