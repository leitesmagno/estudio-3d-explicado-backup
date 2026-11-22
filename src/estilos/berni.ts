import {ESCURO, type Tema} from '../base/tema';

// Perfil: Berni Advogados (Campinas/SP) · direito empresarial, tributário, família, saúde e previdenciário.
// Paleta tirada do Instagram @berni.advogados (12/11/2026): preto quente com luz dourada,
// título fino em dourado, corpo em branco, rótulo pequeno espaçado em caixa alta.

export const SERIE = 'Berni Advogados';

export const BERNI: Tema = {
  ...ESCURO,
  nome: 'berni',
  serie: SERIE,
  chamada: 'Berni Advogados. Estratégia jurídica para empresas e famílias.',
  fundo: '#100F0E',
  chao: '#171513',
  ceu: '#3B3225',
  ceuLuz: '#E9DCC6',
  luzCor: '#FFE1B5',
  luz: 0.95,
  objeto: '#5D564C',
  objetoClaro: '#ECE4D6',
  objetoEscuro: '#24211D',
  corpo: '#D9CFBF',
  pessoa: '#6E675D',
  branco: '#EFE9DF',
  tinta: '#1A1815',
  areia: '#C9AE84',
  acento: '#BE9A62',
  texto: '#F4EFE7',
  textoSuave: '#B5AB9C',
  cartao: '#1B1916',
  cartaoBorda: '#5A4A31',
  pilulaFundo: '#1B1916',
  pilulaTexto: '#E3C78F',
  marca: '#BE9A62',
  legendaFundo: 'rgba(12,11,10,0.55)',
  legendaAceso: '#F4EFE7',
  legendaApagado: '#8E8576',
};
