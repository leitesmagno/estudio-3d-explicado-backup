// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoIbotirama, CapaOrcamentoIbotirama, FAIXAS as FAIXAS_IBO, QUADROS as QUADROS_IBO, REVISAO as REVISAO_IBO} from './videos/orcamentoibotirama/OrcamentoIbotirama';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoIbotirama" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Composition id="OrcamentoIbotiramaGuia" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Composition id="OrcamentoIbotiramaLimpo" component={OrcamentoIbotirama} durationInFrames={QUADROS_IBO} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_IBO, revisao: REVISAO_IBO}} />
    <Still id="CapaOrcamentoIbotirama" component={CapaOrcamentoIbotirama} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
