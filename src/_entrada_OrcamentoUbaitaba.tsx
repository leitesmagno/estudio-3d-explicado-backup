// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoUbaitaba, CapaOrcamentoUbaitaba, FAIXAS as FAIXAS_UBT, QUADROS as QUADROS_UBT, REVISAO as REVISAO_UBT} from './videos/orcamentoubaitaba/OrcamentoUbaitaba';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoUbaitaba" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Composition id="OrcamentoUbaitabaGuia" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Composition id="OrcamentoUbaitabaLimpo" component={OrcamentoUbaitaba} durationInFrames={QUADROS_UBT} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_UBT, revisao: REVISAO_UBT}} />
    <Still id="CapaOrcamentoUbaitaba" component={CapaOrcamentoUbaitaba} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
