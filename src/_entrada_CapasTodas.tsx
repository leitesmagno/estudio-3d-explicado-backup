// Todas as capas de município no modelo novo (gerado por scripts/capas_todas.py, 17/11/2026).
import React from 'react';
import {Still, registerRoot} from 'remotion';
import {ALTURA, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {CapaCidade} from './videos/comum/CapaCidade';
import LISTA from './_capas_todas.json';

const Raiz: React.FC = () => (
  <>
    {(LISTA as any[]).map(({id, ...p}) => (
      <Still key={id} id={id} component={CapaCidade} width={LARGURA} height={ALTURA} defaultProps={{...p, estilo: ATIVO, variante: 'meio' as const}} />
    ))}
  </>
);
registerRoot(Raiz);
