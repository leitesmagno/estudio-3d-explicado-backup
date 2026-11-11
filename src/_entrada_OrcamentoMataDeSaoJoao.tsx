// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoMataDeSaoJoao, CapaOrcamentoMataDeSaoJoao, FAIXAS as FAIXAS_MSJ, QUADROS as QUADROS_MSJ, REVISAO as REVISAO_MSJ} from './videos/orcamentomatadesaojoao/OrcamentoMataDeSaoJoao';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoMataDeSaoJoao" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Composition id="OrcamentoMataDeSaoJoaoGuia" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Composition id="OrcamentoMataDeSaoJoaoLimpo" component={OrcamentoMataDeSaoJoao} durationInFrames={QUADROS_MSJ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_MSJ, revisao: REVISAO_MSJ}} />
    <Still id="CapaOrcamentoMataDeSaoJoao" component={CapaOrcamentoMataDeSaoJoao} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
