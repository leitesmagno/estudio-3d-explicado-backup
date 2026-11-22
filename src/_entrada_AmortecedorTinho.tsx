// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.
import React from 'react';
import {Composition, Still, registerRoot} from 'remotion';
import {ALTURA, FPS, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {AmortecedorTinho, CapaAmortecedorTinho, FAIXAS as FAIXAS_AMT, QUADROS as QUADROS_AMT, REVISAO as REVISAO_AMT} from './videos/amortecedortinho/AmortecedorTinho';

const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;
const Raiz: React.FC = () => (
  <>
    <Composition id="AmortecedorTinho" component={AmortecedorTinho} durationInFrames={QUADROS_AMT} {...base} defaultProps={{estilo: 'tinho', faixas: FAIXAS_AMT, revisao: REVISAO_AMT}} />
    <Composition id="AmortecedorTinhoGuia" component={AmortecedorTinho} durationInFrames={QUADROS_AMT} {...base} defaultProps={{estilo: 'tinho', guia: true, faixas: FAIXAS_AMT, revisao: REVISAO_AMT}} />
    <Composition id="AmortecedorTinhoLimpo" component={AmortecedorTinho} durationInFrames={QUADROS_AMT} {...base} defaultProps={{estilo: 'tinho', semInterface: true, faixas: FAIXAS_AMT, revisao: REVISAO_AMT}} />
    <Still id="CapaAmortecedorTinho" component={CapaAmortecedorTinho} width={LARGURA} height={ALTURA} defaultProps={{estilo: 'tinho'}} />
  </>
);
registerRoot(Raiz);
