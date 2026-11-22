import {ESCURO, type Tema} from '../base/tema';

// Perfil: Tinho Auto Peças (@tinhoautopecasni, Nova Iguaçu/RJ) · peças só para carro.
// Paleta tirada da logo do Instagram (14/11/2026): azul-marinho de fundo, vermelho dos anéis e das chaves,
// letras brancas. Série de vídeos "cada peça explicada".

export const SERIE = 'Tinho Auto Peças';

export const TINHO: Tema = {
  ...ESCURO,
  nome: 'tinho',
  serie: SERIE,
  chamada: 'Precisou de peça? Chama a Tinho Auto Peças.',
  fundo: '#0A1033',
  chao: '#0F1740',
  ceu: '#2A3A80',
  ceuLuz: '#DCE6FF',
  luzCor: '#FFF4E6',
  luz: 1.35,
  objeto: '#97A2B6',
  objetoClaro: '#E9EDF3',
  objetoEscuro: '#3A4362',
  corpo: '#C9D1DE',
  pessoa: '#6D7891',
  branco: '#F5F6F8',
  tinta: '#0B0D14',
  areia: '#D9A85B',
  acento: '#E3262E',
  texto: '#FFFFFF',
  textoSuave: '#B9C3DD',
  cartao: '#111A4A',
  cartaoBorda: '#E3262E',
  pilulaFundo: '#E3262E',
  pilulaTexto: '#FFFFFF',
  marca: '#FFFFFF',
  legendaFundo: 'rgba(8,12,40,0.62)',
  legendaAceso: '#FFFFFF',
  legendaApagado: '#8E9AC0',
};
