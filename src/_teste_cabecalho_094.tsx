// Quadro de teste do cabeçalho com os dois selos (094). Entrada própria, fora do Root.tsx (regra 54).
import React from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {MEU_ESTILO} from './estilo';
import {CabecalhoDuplo, MarcaDaguaDupla} from './videos/orcamentoparatinga1824/CabecalhoDuplo';

const FPS = 30;
const FINAL = 10; // simula o "Sigam o..." em 10 s

const Teste: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tema = MEU_ESTILO;
  return (
    <AbsoluteFill style={{background: tema.fundo}}>
      <Img src={staticFile('035. orçamento de paratinga/capa/fundo-limpo.jpg')} style={{width: 1080, height: 1920}} />
      <MarcaDaguaDupla tema={tema} t={t} />
      <CabecalhoDuplo tema={tema} cidade="PARATINGA" t={t} final={FINAL} />
    </AbsoluteFill>
  );
};

const Raiz: React.FC = () => (
  <Composition id="TesteCabecalho094" component={Teste} durationInFrames={14 * FPS} fps={FPS} width={1080} height={1920} />
);
registerRoot(Raiz);
