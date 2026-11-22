// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoNovaIguacu, CapaOrcamentoNovaIguacu, FAIXAS as FAIXAS_NIG, QUADROS as QUADROS_NIG, REVISAO as REVISAO_NIG} from './videos/orcamentonovaiguacu/OrcamentoNovaIguacu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoNovaIguacu" component={OrcamentoNovaIguacu} durationInFrames={QUADROS_NIG} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_NIG, revisao: REVISAO_NIG}} />
    <Composition id="OrcamentoNovaIguacuGuia" component={OrcamentoNovaIguacu} durationInFrames={QUADROS_NIG} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_NIG, revisao: REVISAO_NIG}} />
    <Composition id="OrcamentoNovaIguacuLimpo" component={OrcamentoNovaIguacu} durationInFrames={QUADROS_NIG} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_NIG, revisao: REVISAO_NIG}} />
    <Still id="CapaOrcamentoNovaIguacu" component={CapaOrcamentoNovaIguacu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
