// Capas novas (modelo CapaCidade, aprovado pelo Magno em 17/11/2026) para os posts já no Instagram.
import React from 'react';
import {Still, registerRoot} from 'remotion';
import {ALTURA, LARGURA} from './base/reels';
import {ATIVO} from './estilo';
import {CapaCidade, type CapaCidadeProps} from './videos/comum/CapaCidade';

type Item = Omit<CapaCidadeProps, 'fundo' | 'mapa'> & {pasta: string};
const P = (rotulo: string, valor = '') => ({rotulo, valor});
export const LISTA: Record<string, Item> = {
  Botupora: {cidade: 'Botuporã', pasta: '114. orçamento de botuporã', pares: [P('Festas:', 'R$ 4,6 mi.'), P('Açudes:', 'R$ 0.')]},
  BarraDaEstiva: {cidade: 'Barra da Estiva', pasta: '113. orçamento de barra da estiva', pares: [P('Festas:', 'R$ 6,6 mi.'), P('Pavimentação:', 'R$ 0.')]},
  PresidenteTancredoNeves: {cidade: 'Presidente Tancredo Neves', pasta: '109. orçamento de presidente tancredo neves', pares: [P('Festas:', 'R$ 10,9 mi.'), P('Esporte:', 'R$ 0.')]},
  Cacule: {cidade: 'Caculé', pasta: '115. orçamento de caculé', pares: [P('Festas:', 'R$ 9,3 mi.'), P('Emergência:', 'R$ 16 mil.')]},
  Almadina: {cidade: 'Almadina', pasta: '081. orçamento de almadina', pares: [P('Festa 2026:', 'R$ 2,6 mi.'), P('Previsto:', 'R$ 806 mil.')]},
  DarioMeira: {cidade: 'Dário Meira', pasta: '056. orçamento de dário meira', pares: [P('2025: gastou', 'R$ 11 mi'), P('a mais do que arrecadou.')]},
  SaoJoseDaVitoria: {cidade: 'São José da Vitória', pasta: '107. orçamento de são josé da vitória', pares: [P('Bandas:', 'R$ 2,5 mi.'), P('Esgoto:', 'R$ 0.')]},
  Cairu: {cidade: 'Cairu', pasta: '045. orçamento de cairu', pares: [P('O turista paga.'), P('Para onde', 'vai?')]},
  Itagiba: {cidade: 'Itagibá', pasta: '101. orçamento de itagibá', pares: [P('Festas:', 'R$ 6,6 mi.'), P('IPTU:', 'R$ 307 mil.')]},
  Macaubas: {cidade: 'Macaúbas', pasta: '074. orçamento de macaúbas', pares: [P('Eventos:', 'R$ 6,3 mi.'), P('Usina de cana:', 'R$ 0.')]},
  Jussari: {cidade: 'Jussari', pasta: '104. orçamento de jussari', pares: [P('IPTU:', 'R$ 0.'), P('Festas:', 'R$ 2,2 mi.')]},
  Ubata: {cidade: 'Ubatã', pasta: '108. orçamento de ubatã', pares: [P('Precatório:', 'R$ 51 mi.'), P('Festas:', 'R$ 3 mi.')]},
};

const Raiz: React.FC = () => (
  <>
    {Object.entries(LISTA).map(([id, {pasta, ...p}]) => (
      <Still key={id} id={`CapaNova${id}`} component={CapaCidade} width={LARGURA} height={ALTURA}
        defaultProps={{...p, estilo: ATIVO, variante: 'meio' as const, fundo: `${pasta}/capa/fundo-limpo.jpg`, mapa: `mapas/${p.cidade}.svg`}} />
    ))}
  </>
);
registerRoot(Raiz);
