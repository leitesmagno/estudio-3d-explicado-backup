// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoItajuDoColonia, CapaOrcamentoItajuDoColonia, FAIXAS as FAIXAS_ITJC, QUADROS as QUADROS_ITJC, REVISAO as REVISAO_ITJC} from './videos/orcamentoitajudocolonia/OrcamentoItajuDoColonia';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoItajuDoColonia" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Composition id="OrcamentoItajuDoColoniaGuia" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Composition id="OrcamentoItajuDoColoniaLimpo" component={OrcamentoItajuDoColonia} durationInFrames={QUADROS_ITJC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_ITJC, revisao: REVISAO_ITJC}} />
    <Still id="CapaOrcamentoItajuDoColonia" component={CapaOrcamentoItajuDoColonia} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
