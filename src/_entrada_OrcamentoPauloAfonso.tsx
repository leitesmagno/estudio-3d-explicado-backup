// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoPauloAfonso, CapaOrcamentoPauloAfonso, FAIXAS as FAIXAS_PAULOAFONSO, QUADROS as QUADROS_PAULOAFONSO, REVISAO as REVISAO_PAULOAFONSO} from './videos/orcamentopauloafonso/OrcamentoPauloAfonso';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoPauloAfonso" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Composition id="OrcamentoPauloAfonsoGuia" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Composition id="OrcamentoPauloAfonsoLimpo" component={OrcamentoPauloAfonso} durationInFrames={QUADROS_PAULOAFONSO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_PAULOAFONSO, revisao: REVISAO_PAULOAFONSO}} />
    <Still id="CapaOrcamentoPauloAfonso" component={CapaOrcamentoPauloAfonso} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
