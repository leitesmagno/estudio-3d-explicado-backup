// Estúdio 3D Explicado · base/tema
// O "tema" é a paleta de um estilo visual. Toda peça recebe `tema` e tira dele as cores.
// Regra de ouro: um único acento (tema.acento) para o que importa; o resto é neutro e fosco.
//
import "./fontes";

// Todas as cores usadas em 3D (e em mistura()) são hexadecimais "#RRGGBB".

/** Cores extras para cenas festivas ou com mais de uma cor de destaque (use com moderação). */
export type Festa = {
  azul: string;
  azulNoite: string;
  dourado: string;
  loiro: string;
  pele: string;
  rosa: string;
  roxo: string;
  roxoEscuro: string;
  turquesa: string;
  verde: string;
};

export type Tema = {
  /** Nome curto do estilo (id, aparece na amostra). */
  nome?: string;
  /** Nome da série (marca do topo e chamada final). */
  serie?: string;
  /** Frase da chamada final ("E segue o Explicando Direito..."). */
  chamada?: string;
  // ---- Mundo ----
  /** Fundo do vídeo e cor da névoa. */
  fundo: string;
  /** Chão do palco. */
  chao: string;
  /** Cor do céu na luz ambiente (hemisfério). */
  ceu: string;
  /** Tom frio e claro (vidro, gelo, telas). */
  ceuLuz: string;
  /** Cor da luz principal. */
  luzCor: string;
  /** Força geral da luz (1 = padrão). */
  luz?: number;
  // ---- Objetos ----
  objeto: string;
  objetoClaro: string;
  objetoEscuro: string;
  /** Protagonista ("você"). */
  corpo: string;
  /** Pessoas comuns, multidão. */
  pessoa: string;
  branco: string;
  /** Tinta: traços, linhas e texto escuro em 3D. */
  tinta: string;
  areia: string;
  /** O único destaque. */
  acento: string;
  // ---- Interface 2D ----
  texto: string;
  textoSuave: string;
  cartao: string;
  cartaoBorda: string;
  pilulaFundo: string;
  pilulaTexto: string;
  /** Cor da marca d'água do topo (nome da série). */
  marca: string;
  legendaFundo: string;
  legendaAceso: string;
  legendaApagado: string;
  // ---- Extras ----
  /** Troca a fonte principal só deste estilo (CSS font-family). A fonte precisa estar carregada. */
  fonte?: string;
  /** Troca a fonte mono só deste estilo. */
  fonteMono?: string;
  festa?: Festa;
};

/** Fonte principal (títulos, legenda). */
export const FONTE = "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
/** Fonte mono (rótulos, números, pílulas). */
export const MONO = "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace";

const FESTA_PADRAO: Festa = {
  azul: '#3F6FB5',
  azulNoite: '#1E2B4A',
  dourado: '#D9A441',
  loiro: '#E6C987',
  pele: '#D8A888',
  rosa: '#D9779A',
  roxo: '#7B4FA8',
  roxoEscuro: '#3D2759',
  turquesa: '#3FB5A8',
  verde: '#4F9A5B',
};

/** Tema escuro neutro: grafite quente, creme e acento laranja. É a base dos estilos. */
export const ESCURO: Tema = {
  nome: 'escuro',
  fundo: '#16151A',
  chao: '#1D1C21',
  ceu: '#3A3842',
  ceuLuz: '#BFCAD8',
  luzCor: '#FFF2E2',
  luz: 1,
  objeto: '#8C8882',
  objetoClaro: '#F0EBE1',
  objetoEscuro: '#3A383E',
  corpo: '#E2DCD0',
  pessoa: '#817D80',
  branco: '#E9E5DD',
  tinta: '#2A282E',
  areia: '#C6B497',
  acento: '#E07A3C',
  texto: '#F0EBE1',
  textoSuave: '#A29D95',
  cartao: '#222127',
  cartaoBorda: '#3A3840',
  pilulaFundo: '#222127',
  pilulaTexto: '#F0EBE1',
  marca: '#8E8981',
  legendaFundo: 'rgba(18,17,21,0.82)',
  legendaAceso: '#F0EBE1',
  legendaApagado: '#7D7973',
  festa: FESTA_PADRAO,
};

/** Tema claro: fundo creme, objetos em cinza quente, acento laranja. */
export const CLARO: Tema = {
  nome: 'claro',
  fundo: '#F0EBE1',
  chao: '#E8E2D6',
  ceu: '#FFFFFF',
  ceuLuz: '#D6DEE8',
  luzCor: '#FFF6EA',
  luz: 1,
  objeto: '#B9B3A9',
  objetoClaro: '#FBF8F2',
  objetoEscuro: '#5B5860',
  corpo: '#3A383E',
  pessoa: '#9C978F',
  branco: '#FFFFFF',
  tinta: '#2A282E',
  areia: '#D8C7A8',
  acento: '#E07A3C',
  texto: '#24222A',
  textoSuave: '#6F6A63',
  cartao: '#FBF8F2',
  cartaoBorda: '#DDD5C7',
  pilulaFundo: '#FBF8F2',
  pilulaTexto: '#24222A',
  marca: '#8A847B',
  legendaFundo: 'rgba(36,34,42,0.86)',
  legendaAceso: '#FBF8F2',
  legendaApagado: '#9A958D',
  festa: FESTA_PADRAO,
};

/**
 * Catálogo de estilos por nome. Os vídeos fazem `ESTILOS[estilo] || MEU_ESTILO`.
 * Estilos do usuário entram aqui por registrarEstilo() (veja src/estilo.ts).
 */
export const ESTILOS: Record<string, Tema> = {
  escuro: ESCURO,
  claro: CLARO,
};

/** Registra (ou substitui) um estilo pelo nome. Devolve o próprio tema. */
export const registrarEstilo = (nome: string, tema: Tema): Tema => {
  ESTILOS[nome] = {...tema, nome};
  return ESTILOS[nome];
};

/** Cria um tema novo a partir de outro, trocando só o que você passar. */
export const derivarTema = (base: Tema, troca: Partial<Tema>): Tema => ({
  ...base,
  ...troca,
  festa: {...(base.festa ?? FESTA_PADRAO), ...(troca.festa ?? {})},
});
