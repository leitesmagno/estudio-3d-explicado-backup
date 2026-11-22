// Teste da capa nova com o nome da cidade em destaque (17/11/2026).
import React from 'react';
import {Still, registerRoot} from 'remotion';
import {ALTURA, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {CapaCidade, type CapaCidadeProps} from './videos/comum/CapaCidade';

const AMOSTRAS: Record<string, CapaCidadeProps> = {
  Camacan: {cidade: 'Camacan', mapa: 'mapas/Camacan.svg', ano: '2025', fundo: '042. orçamento de camacan/capa/fundo-limpo.jpg', pares: [{rotulo: 'Festa:', valor: 'R$ 3,4 mi.'}, {rotulo: 'Agricultura familiar:', valor: '0.'}]},
  Ubaitaba: {cidade: 'Ubaitaba', mapa: 'mapas/Ubaitaba.svg', ano: '2025', fundo: '092. orçamento de ubaitaba/capa/fundo-limpo.jpg', pares: [{rotulo: 'Festa:', valor: 'R$ 1,2 mi.'}, {rotulo: 'Ajuda social:', valor: 'R$ 26 mil.'}]},
  Ilheus: {cidade: 'Ilhéus', mapa: 'mapas/Ilhéus.svg', ano: '2026', fundo: '093. orçamento de ilhéus/capa/fundo-limpo.jpg', pares: [{rotulo: 'Eventos:', valor: 'R$ 11 mi.'}, {rotulo: 'Ajuda social:', valor: 'R$ 1,97 mi.'}]},
  Jaguarari: {cidade: 'Jaguarari', mapa: 'mapas/Jaguarari.svg', ano: '2026', fundo: '122. orçamento de jaguarari/capa/fundo-limpo.jpg', pares: [{rotulo: 'Festas 2025:', valor: 'R$ 7,3 mi.'}, {rotulo: 'Assistência:', valor: 'R$ 5,7 mi.'}]},
  Longo: {cidade: 'Luís Eduardo Magalhães', mapa: 'mapas/Luís Eduardo Magalhães.svg', ano: '2026', fundo: '122. orçamento de jaguarari/capa/fundo-limpo.jpg', pares: [{rotulo: 'Festas:', valor: 'R$ 7,3 mi.'}, {rotulo: 'Assistência:', valor: 'R$ 5,7 mi.'}]},
};

const Raiz: React.FC = () => (
  <>
    {Object.entries(AMOSTRAS).flatMap(([id, p]) => [
      <Still key={id + 'T'} id={`Capa${id}Topo`} component={CapaCidade} width={LARGURA} height={ALTURA} defaultProps={{...p, estilo: ATIVO, variante: 'topo' as const}} />,
      <Still key={id + 'M'} id={`Capa${id}Meio`} component={CapaCidade} width={LARGURA} height={ALTURA} defaultProps={{...p, estilo: ATIVO, variante: 'meio' as const}} />,
      <Still key={id + 'F'} id={`Capa${id}Faixa`} component={CapaCidade} width={LARGURA} height={ALTURA} defaultProps={{...p, estilo: ATIVO, variante: 'faixa' as const}} />,
    ])}
  </>
);
registerRoot(Raiz);
