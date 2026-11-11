// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {OrcamentoJaguarari, CapaOrcamentoJaguarari, FAIXAS as FAIXAS_JAGUARARI, QUADROS as QUADROS_JAGUARARI, REVISAO as REVISAO_JAGUARARI} from './videos/orcamentojaguarari/OrcamentoJaguarari';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="OrcamentoJaguarari" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Composition id="OrcamentoJaguarariGuia" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Composition id="OrcamentoJaguarariLimpo" component={OrcamentoJaguarari} durationInFrames={QUADROS_JAGUARARI} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JAGUARARI, revisao: REVISAO_JAGUARARI}} />
    <Still id="CapaOrcamentoJaguarari" component={CapaOrcamentoJaguarari} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
  </>
);
registerRoot(Raiz);
