// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoTanhacu, CapaOrcamentoTanhacu, FAIXAS as FAIXAS_TNH, QUADROS as QUADROS_TNH, REVISAO as REVISAO_TNH} from './videos/orcamentotanhacu/OrcamentoTanhacu';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoTanhacu" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Composition id="OrcamentoTanhacuGuia" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Composition id="OrcamentoTanhacuLimpo" component={OrcamentoTanhacu} durationInFrames={QUADROS_TNH} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_TNH, revisao: REVISAO_TNH}} />
    <Still id="CapaOrcamentoTanhacu" component={CapaOrcamentoTanhacu} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
