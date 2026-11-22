// Capa de município no modelo novo (aprovado 17/11/2026). Uso: scripts/capa_nova.py (passa as props).
import React from 'react';
import {Still, registerRoot} from 'remotion';
import {ALTURA, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {CapaCidade} from './videos/comum/CapaCidade';

const Raiz: React.FC = () => (
  <Still id="CapaCidade" component={CapaCidade} width={LARGURA} height={ALTURA}
    defaultProps={{estilo: ATIVO, variante: 'meio' as const, cidade: 'Cidade', pares: [], fundo: 'fundo.jpg', mapa: 'mapa.svg'}} />
);
registerRoot(Raiz);
