// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoBomJesus, CapaOrcamentoBomJesus, FAIXAS as FAIXAS_BJL, QUADROS as QUADROS_BJL, REVISAO as REVISAO_BJL} from './videos/orcamentobomjesus/OrcamentoBomJesus';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoBomJesus" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Composition id="OrcamentoBomJesusGuia" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Composition id="OrcamentoBomJesusLimpo" component={OrcamentoBomJesus} durationInFrames={QUADROS_BJL} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_BJL, revisao: REVISAO_BJL}} />
    <Still id="CapaOrcamentoBomJesus" component={CapaOrcamentoBomJesus} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
