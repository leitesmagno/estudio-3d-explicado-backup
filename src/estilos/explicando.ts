import {ESCURO, type Tema} from '../base/tema';

// Perfil: @explicandodireito.br · Nicho: direito e educação financeira explicados
// Paleta: Ardósia + Marsala. Fundo cinza-azulado frio (mais claro no alto), objetos brancos limpos,
// interface branca e acento vermelho-vinho. É o visual dos vídeos publicados do perfil.

export const SERIE = 'Explicando Direito';

export const EXPLICANDO: Tema = {
  ...ESCURO,
  nome: 'explicando',
  serie: SERIE,
  chamada: 'E segue o Explicando Direito para entender o que muda na sua vida.',
  // Mundo: ardósia fria
  fundo: '#282C32',
  chao: '#2F3237',
  ceu: '#E2E7EE',
  ceuLuz: '#C9D6E8',
  luzCor: '#F6F8FC',
  luz: 1.2,
  // Objetos: brancos limpos, cinza-azulado nos escuros
  objeto: '#E6EAF0',
  objetoClaro: '#F7F9FC',
  objetoEscuro: '#5C6573',
  corpo: '#8C95A3',
  pessoa: '#E3E8EF',
  branco: '#FAFBFD',
  tinta: '#262B33',
  // Interface: branco puro e cinza-azulado
  texto: '#FFFFFF',
  textoSuave: '#8E97A5',
  cartao: '#1C2129',
  cartaoBorda: '#39404B',
  pilulaFundo: '#1B212A',
  pilulaTexto: '#FFFFFF',
  marca: '#97A0AD',
  legendaFundo: 'rgba(24,28,36,0.82)',
  legendaAceso: '#FFFFFF',
  legendaApagado: '#7E8797',
  acento: '#C23B2A', // marsala
};
