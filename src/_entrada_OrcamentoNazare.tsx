// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoNazare, CapaOrcamentoNazare, FAIXAS as FAIXAS_NAZ, QUADROS as QUADROS_NAZ, REVISAO as REVISAO_NAZ} from './videos/orcamentonazare/OrcamentoNazare';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoNazare" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Composition id="OrcamentoNazareGuia" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Composition id="OrcamentoNazareLimpo" component={OrcamentoNazare} durationInFrames={QUADROS_NAZ} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_NAZ, revisao: REVISAO_NAZ}} />
    <Still id="CapaOrcamentoNazare" component={CapaOrcamentoNazare} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
