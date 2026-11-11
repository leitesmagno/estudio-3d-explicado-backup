// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoIpira, CapaOrcamentoIpira, FAIXAS as FAIXAS_IPIRA, QUADROS as QUADROS_IPIRA, REVISAO as REVISAO_IPIRA} from './videos/orcamentoipira/OrcamentoIpira';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoIpira" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Composition id="OrcamentoIpiraGuia" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Composition id="OrcamentoIpiraLimpo" component={OrcamentoIpira} durationInFrames={QUADROS_IPIRA} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IPIRA, revisao: REVISAO_IPIRA}} />
    <Still id="CapaOrcamentoIpira" component={CapaOrcamentoIpira} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
