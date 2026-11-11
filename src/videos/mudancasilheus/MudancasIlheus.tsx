import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Onda, Palco, Particulas, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, k01, pulso, rampa, sai} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Trilha, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Cadeira, DiarioOficial, Fantasma, OrgaoPublico} from '../../pecas';
import {Cadeirinha, Calcada, Cerca, Folha, Interrogacao, PlacaOrgao, PortaoPlaca, Tablado} from './pecas';
import {PALAVRAS} from './palavras';

// 009. mudanças em ilhéus (perfil @eumagnoleite, série Magno Explica).
// Mundo único: a dança das cadeiras na praça da Prefeitura. Um tablado por órgão, um boneco por pessoa do Diário Oficial nº 260.
// Trocaram de cadeira = verde (acento) e pulam para a cadeira nova; chegaram = azul e vêm da fila do portão de ENTRADA;
// ficaram de fora = cinza e saem pelo portão de SAÍDA para a calçada. Pessoas reais só como boneco genérico sem rosto.
// Plano: projetos/009. mudanças em ilhéus/plano.md (versão 1, aprovada em 30/10/2026).

export const FPS = 30;
const AUDIO_SEG = 174.64;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '009. mudanças em ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  n53: quando('cinquenta e três'),
  quemSaiu: quando('Quem saiu'),
  quemEntrou: quando('Quem entrou'),
  quemFora1: quando('E quem ficou de fora'),
  todos: quando('Com todos os nomes'),
  diario: quando('Diário Oficial'),
  edicao: quando('duzentos e sessenta'),
  trocas: quando('As trocas vieram'),
  rompimento: quando('rompimento'),
  valderico: quando('Valderico'),
  jabes: quando('Jabes'),
  pp: quando('PP'),
  decretos: quando('Os decretos trazem'),
  e53: quando('cinquenta e três exonerações', 2),
  n51: quando('cinquenta e uma'),
  soTrocou: quando('só trocou'),
  exonerada: quando('exonerada do cargo'),
  nomeada: quando('nomeada no novo'),
  grupos: quando('três grupos'),
  g25: quando('vinte e cinco'),
  g26: quando('vinte e seis'),
  g28: quando('vinte e oito'),
  secretarios: quando('Os secretários'),
  humbertoDito: quando('Humberto Oliveira'),
  maisTrocas: quando('Mais trocas'),
  trocaramLugar: quando('trocaram de lugar'),
  quemChegou: quando('Quem chegou'),
  alemDe: quando('Além de Vinícius'),
  quemFora: quando('Quem ficou de fora', 2),
  quatroSec: quando('Quatro secretários'),
  promoTambem: quando('Promoção Social também'),
  atencao: quando('Atenção'),
  naoQuer: quando('não quer dizer'),
  semSec: quando('A Saúde e os Serviços'),
  tabuleiro: quando('O Tabuleiro'),
  hermano: quando('Hermano'),
  semDecreto: quando('ainda sem decreto'),
  salva: quando('Salva esse'),
  arroba: quando('@eumagnoleite'),
  informacoes: quando('para mais informações'),
};

const ESTADOS: [number, string][] = [
  [0, 'DIÁRIO OFICIAL Nº 260'],
  [T.trocas, 'O MOTIVO'],
  [T.decretos, 'A CONTA'],
  [T.secretarios, 'OS SECRETÁRIOS'],
  [T.maisTrocas, 'TROCARAM DE CADEIRA'],
  [T.quemChegou, 'CHEGARAM'],
  [T.quemFora, 'FICARAM DE FORA'],
  [T.atencao, 'ATENÇÃO'],
  [T.salva, 'SALVA ESTE VÍDEO'],
];

// ---------- Órgãos (tablados), do fundo (perto da Prefeitura) para a frente ----------
type Ilha = {x: number; z: number; linhas: string[]; nome: string};
const DX = 5.6;
const DZ = 5.6;
const fila = (r: number) => -DZ * 3 + DZ * r;
const ILHAS = {
  gab: {x: -DX, z: fila(0), linhas: ['GABINETE', 'ASSESSORIAS'], nome: 'GABINETE DO PREFEITO'},
  casa: {x: 0, z: fila(0), linhas: ['CASA CIVIL'], nome: 'CASA CIVIL'},
  vice: {x: DX, z: fila(0), linhas: ['GABINETE', 'DA VICE'], nome: 'GABINETE DA VICE'},
  proc: {x: -DX, z: fila(1), linhas: ['PROCURADORIA'], nome: 'PROCURADORIA'},
  ctrl: {x: 0, z: fila(1), linhas: ['CONTROLADORIA'], nome: 'CONTROLADORIA'},
  faz: {x: DX, z: fila(1), linhas: ['FAZENDA'], nome: 'FAZENDA'},
  ri: {x: -DX, z: fila(2), linhas: ['RELAÇÕES', 'INSTITUCIONAIS'], nome: 'RELAÇÕES INSTITUCIONAIS'},
  int: {x: 0, z: fila(2), linhas: ['INTERIOR'], nome: 'INTERIOR'},
  proj: {x: DX, z: fila(2), linhas: ['GABINETE', 'PROJETOS'], nome: 'GABINETE · PROJETOS'},
  edu: {x: -DX, z: fila(3), linhas: ['EDUCAÇÃO'], nome: 'EDUCAÇÃO'},
  mul: {x: 0, z: fila(3), linhas: ['POLÍTICAS', 'P/ MULHERES'], nome: 'POLÍTICAS PARA MULHERES'},
  prom: {x: DX, z: fila(3), linhas: ['PROMOÇÃO', 'SOCIAL'], nome: 'PROMOÇÃO SOCIAL'},
  tran: {x: -DX, z: fila(4), linhas: ['TRÂNSITO'], nome: 'TRÂNSITO'},
  mara: {x: 0, z: fila(4), linhas: ['MARAMATA'], nome: 'MARAMATA'},
  cult: {x: DX, z: fila(4), linhas: ['CULTURA'], nome: 'CULTURA'},
  saude: {x: -DX, z: fila(5), linhas: ['SAÚDE'], nome: 'SAÚDE'},
  serv: {x: 0, z: fila(5), linhas: ['SERVIÇOS', 'URBANOS'], nome: 'SERVIÇOS URBANOS'},
  dese: {x: DX, z: fila(5), linhas: ['DESENV.', 'ECONÔMICO'], nome: 'DESENV. ECONÔMICO'},
  tur: {x: -DX, z: fila(6), linhas: ['TURISMO'], nome: 'TURISMO'},
  com: {x: 0, z: fila(6), linhas: ['GABINETE', 'COMUNICAÇÃO'], nome: 'GABINETE · COMUNICAÇÃO'},
  infra: {x: DX, z: fila(6), linhas: ['INFRAESTRUTURA'], nome: 'INFRAESTRUTURA'},
} satisfies Record<string, Ilha>;
type IlhaId = keyof typeof ILHAS;
const IDS = Object.keys(ILHAS) as IlhaId[];

const CERCA_X = 9;
const CERCA_Z0 = -19.8;
const CERCA_Z1 = 19.8;
const PORTAO_Z = (fila(3) + fila(4)) / 2;
const ENTRADA: V3 = [-CERCA_X, 0, PORTAO_Z];
const SAIDA: V3 = [CERCA_X, 0, PORTAO_Z];
const PREFEITURA: V3 = [0, 0, -25];
const PODIO_Z = 23.5;
const ESC = 0.42; // bonecos do tabuleiro
const AZUL = (t: Tema) => (t.festa ?? ESCURO.festa!).azul;

// ---------- Pessoas (Diário Oficial nº 260, decretos 627 a 730) ----------
type G = 'troca' | 'chega' | 'fora';
type Posto = [IlhaId, string, number]; // órgão, cargo (curto), decreto
type Pes = {id: string; curto: string; nome: string; g: G; de?: Posto; para?: Posto; diz: string; vai?: string};
const CHEFE = new Set(['titular', 'diretoria-geral', 'presidência']);
const PESSOAS: Pes[] = [
  // Os secretários
  {id: 'vinicius', curto: 'VINÍCIUS IBRANN', nome: 'VINICIUS IBRANN DANTAS ANDRADE OLIVEIRA', g: 'chega', para: ['edu', 'titular', 729], diz: 'Vinícius Ibrann'},
  {id: 'evani', curto: 'EVANI CAVALCANTE', nome: 'EVANI CAVALCANTE DE SOUZA ROCHA', g: 'troca', de: ['edu', 'titular', 648], para: ['mul', 'titular', 706], diz: 'Evani'},
  {id: 'wanessa', curto: 'WANESSA GEDEON', nome: 'WANESSA ROCHA BONFIM GEDEON', g: 'troca', de: ['mul', 'titular', 654], para: ['prom', 'titular', 715], diz: 'Wanessa'},
  {id: 'davidson', curto: 'DAVIDSON SANTOS', nome: 'DAVIDSON LEANDRO SOUSA SANTOS', g: 'troca', de: ['mara', 'presidência', 678], para: ['cult', 'titular', 697], diz: 'Davidson'},
  {id: 'fabricio', curto: 'FABRÍCIO NASCIMENTO', nome: 'MARCOS FABRÍCIO OLIVEIRA NASCIMENTO', g: 'troca', de: ['tran', 'diretoria-geral', 627], para: ['mara', 'presidência', 727], diz: 'Fabrício'},
  {id: 'nal', curto: 'NAL', nome: 'EDNALDO LOPES DE ARAÚJO FILHO (NAL)', g: 'chega', para: ['tran', 'diretoria-geral', 680], diz: 'Ednaldo'},
  {id: 'antonio', curto: 'ANTÔNIO JOSÉ MOREIRA', nome: 'ANTONIO JOSE MATOS MOREIRA', g: 'troca', de: ['faz', 'orçamento', 642], para: ['ctrl', 'titular', 683], diz: 'Antônio José'},
  {id: 'humberto', curto: 'HUMBERTO OLIVEIRA', nome: 'HUMBERTO NASCIMENTO DE OLIVEIRA', g: 'troca', de: ['ctrl', 'titular', 630], para: ['gab', 'representação', 691], diz: 'Humberto e'},
  // Mais trocas
  {id: 'erika', curto: 'ÉRIKA', nome: 'ERIKA JANAINA SOARES DA SILVA TABOSA', g: 'troca', de: ['gab', 'assessoria de gabinete', 638], para: ['gab', 'representação', 692], diz: 'Érika'},
  {id: 'railane', curto: 'RAILANE', nome: 'RAILANE BATISTA DOS SANTOS', g: 'troca', de: ['com', 'mídias', 635], para: ['prom', 'benefícios', 708], diz: 'Railane'},
  {id: 'simone', curto: 'SIMONE', nome: 'SIMONE PEREIRA SILVA', g: 'troca', de: ['mul', 'apoio a políticas', 651], para: ['prom', 'contratos', 709], diz: 'Simone'},
  {id: 'carla', curto: 'CARLA', nome: 'CARLA FREITAS CAETANO', g: 'troca', de: ['mul', 'assessoria de gabinete', 653], para: ['prom', 'supervisão administrativa', 710], diz: 'Carla'},
  {id: 'edilena', curto: 'EDILENA', nome: 'EDILENA MARIA VAZ LINS', g: 'troca', de: ['mul', 'centro de referência', 652], para: ['prom', 'alta complexidade', 711], diz: 'Edilena'},
  {id: 'alecsandro', curto: 'ALECSANDRO', nome: 'ALECSANDRO DOS SANTOS FERREIRA', g: 'troca', de: ['serv', 'divisão administrativa', 675], para: ['prom', 'média complexidade', 714], diz: 'Alecsandro'},
  {id: 'caio', curto: 'CAIO', nome: 'CAIO VINICIUS DA SILVA NOBRE', g: 'troca', de: ['ctrl', 'assessoria de gabinete', 628], para: ['ctrl', 'auditoria', 682], diz: 'Caio'},
  {id: 'bruno', curto: 'BRUNO', nome: 'BRUNO RODRIGUES DANTAS DO ROSÁRIO', g: 'troca', de: ['ctrl', 'auditoria', 629], para: ['proc', 'cálculos', 693], diz: 'Bruno'},
  {id: 'lindiana', curto: 'LINDIANA', nome: 'LINDIANA MELO ROCHA', g: 'troca', de: ['com', 'publicidade', 632], para: ['tur', 'eventos', 726], diz: 'Lindiana', vai: 'trocaram de lugar'},
  {id: 'edmarcio', curto: 'EDMARCIO', nome: 'EDMARCIO FRANÇA SANTANA', g: 'troca', de: ['tur', 'eventos', 677], para: ['com', 'publicidade', 685], diz: 'Edmarcio', vai: 'trocaram de lugar'},
  {id: 'thaise', curto: 'THAISE', nome: 'THAISE LISBOA VIEIRA', g: 'troca', de: ['com', 'jornalismo', 634], para: ['com', 'fotografia', 689], diz: 'Thaise'},
  {id: 'prucoli', curto: 'ANTÔNIO CLÁUDIO', nome: 'ANTONIO CLAUDIO PRUCOLI', g: 'troca', de: ['casa', 'adm. de bairro II', 639], para: ['com', 'mídias', 684], diz: 'Antônio Cláudio'},
  {id: 'regis', curto: 'RÉGIS', nome: 'REGIS ARAGÃO LEITE', g: 'troca', de: ['casa', 'assuntos estratégicos', 641], para: ['dese', 'superintendência', 701], diz: 'Régis'},
  {id: 'tarcisio', curto: 'TARCÍSIO', nome: 'TARCISIO BOVE DA SILVA', g: 'troca', de: ['proj', 'acompanhamento de projetos', 636], para: ['saude', 'contas médicas', 720], diz: 'Tarcísio'},
  {id: 'pauloRoberto', curto: 'PAULO ROBERTO', nome: 'PAULO ROBERTO DOS SANTOS', g: 'troca', de: ['casa', 'adm. de bairro II', 640], para: ['int', 'assessoria de gabinete', 703], diz: 'Paulo Roberto'},
  {id: 'roque', curto: 'ROQUE', nome: 'ROQUE EDUARDO CAVALCANTI DE MATOS', g: 'troca', de: ['ri', 'associações comunitárias', 665], para: ['proj', 'acompanhamento de projetos', 688], diz: 'Roque'},
  {id: 'raquel', curto: 'RAQUEL', nome: 'RAQUEL VIEIRA DIAS', g: 'troca', de: ['ri', 'processo legislativo', 667], para: ['mul', 'apoio a políticas', 704], diz: 'Raquel'},
  {id: 'filipeL', curto: 'FILIPE LEVITA', nome: 'FILIPE CUNHA ROSARIO LEVITA', g: 'troca', de: ['vice', 'assessoria de projetos', 679], para: ['infra', 'fiscalização', 702], diz: 'Filipe Levita'},
  {id: 'pauloRenan', curto: 'PAULO RENAN', nome: 'PAULO RENAN SILVA SANTOS', g: 'troca', de: ['ri', 'articulação social', 666], para: ['ri', 'assessoria de gabinete', 719], diz: 'Paulo Renan'},
  // Quem chegou
  {id: 'joseCarlos', curto: 'JOSÉ CARLOS', nome: 'JOSE CARLOS DOS SANTOS', g: 'chega', para: ['serv', 'varrição', 721], diz: 'José Carlos'},
  {id: 'juciene', curto: 'JUCIENE', nome: 'JUCIENE FERREIRA DA SILVA', g: 'chega', para: ['serv', 'limpeza de praias', 722], diz: 'Juciene'},
  {id: 'ronaldo', curto: 'RONALDO', nome: 'RONALDO PEREIRA DA SILVA', g: 'chega', para: ['serv', 'seção de altos', 723], diz: 'Ronaldo'},
  {id: 'nicolas', curto: 'NICOLAS', nome: 'NICOLAS BORGES PINHEIRO', g: 'chega', para: ['serv', 'material e pessoal', 724], diz: 'Nicolas'},
  {id: 'jonilson', curto: 'JONILSON', nome: 'JONILSON DE SOUZA SILVA', g: 'chega', para: ['serv', 'divisão administrativa', 725], diz: 'Jonilson'},
  {id: 'jackeline', curto: 'JACKELINE', nome: 'JACKELINE SOUZA RIBEIRO', g: 'chega', para: ['prom', 'igualdade racial', 707], diz: 'Jackeline'},
  {id: 'katia', curto: 'KÁTIA', nome: 'KATIA RIBEIRO SIMOES ARAUJO', g: 'chega', para: ['prom', 'bolsa família', 712], diz: 'Kátia'},
  {id: 'jonatha', curto: 'JONATHA', nome: 'JONATHA CARLOS PEREIRA SILVA', g: 'chega', para: ['prom', 'proteção social básica', 713], diz: 'Jonatha'},
  {id: 'joseDomingos', curto: 'JOSÉ DOMINGOS', nome: 'JOSE DOMINGOS FONTES BISPO', g: 'chega', para: ['ri', 'associações comunitárias', 716], diz: 'José Domingos'},
  {id: 'juvenal', curto: 'JUVENAL', nome: 'JUVENAL MENDES CRUZ', g: 'chega', para: ['ri', 'articulação social', 717], diz: 'Juvenal'},
  {id: 'walther', curto: 'WALTHER', nome: 'WALTHER DANYELL DE OLIVEIRA SANTOS', g: 'chega', para: ['ri', 'processo legislativo', 718], diz: 'Walther'},
  {id: 'stephanie', curto: 'STEPHANIE', nome: 'STEPHANIE SOUZA DE JESUS', g: 'chega', para: ['dese', 'prestação de contas', 698], diz: 'Stephanie'},
  {id: 'pauloCesar', curto: 'PAULO CESAR', nome: 'PAULO CESAR CALASANS DOS SANTOS', g: 'chega', para: ['dese', 'informação e controle', 699], diz: 'Paulo Cesar'},
  {id: 'sandy', curto: 'SANDY', nome: 'SANDY SILVA ARAUJO', g: 'chega', para: ['dese', 'planejamento urbano', 700], diz: 'Sandy'},
  {id: 'francielle', curto: 'FRANCIELLE', nome: 'FRANCIELLE REIS ARAUJO', g: 'chega', para: ['com', 'comunicação de RI', 686], diz: 'Francielle'},
  {id: 'gessica', curto: 'GÉSSICA', nome: 'GESSICA SANTOS COSTA', g: 'chega', para: ['com', 'jornalismo', 687], diz: 'Géssica'},
  {id: 'roselito', curto: 'ROSELITO', nome: 'ROSELITO CARES DE SOUSA', g: 'chega', para: ['gab', 'assessoria de gabinete', 690], diz: 'Roselito'},
  {id: 'mariaJose', curto: 'MARIA JOSÉ', nome: 'MARIA JOSE DOS SANTOS MELO', g: 'chega', para: ['casa', 'adm. de bairro II', 694], diz: 'Maria José'},
  {id: 'george', curto: 'GEORGE', nome: 'GEORGE SANTOS FLORENÇO', g: 'chega', para: ['casa', 'adm. de bairro II', 730], diz: 'George'},
  {id: 'ysis', curto: 'YSIS', nome: 'YSIS CLAIR MARIA BISPO', g: 'chega', para: ['cult', 'casa de cultura', 695], diz: 'Ysis'},
  {id: 'pauloRogerio', curto: 'PAULO ROGÉRIO', nome: 'PAULO ROGÉRIO SILVA', g: 'chega', para: ['cult', 'superintendência', 696], diz: 'Paulo Rogério'},
  {id: 'anderson', curto: 'ANDERSON', nome: 'ANDERSON DE OLIVEIRA NABUCO', g: 'chega', para: ['ctrl', 'assessoria de gabinete', 681], diz: 'Anderson'},
  {id: 'talita', curto: 'TALITA', nome: 'TALITA BARBOSA DOS SANTOS PIRES', g: 'chega', para: ['mul', 'centro de referência', 705], diz: 'Talita'},
  {id: 'rigerson', curto: 'RIGERSON', nome: 'RIGERSON SILVA DE JESUS', g: 'chega', para: ['vice', 'assessoria de projetos', 728], diz: 'Rigerson'},
  // Quem ficou de fora
  {id: 'sayonara', curto: 'SAYONARA MACHADO', nome: 'SAYONARA SILVA SANTANA MACHADO', g: 'fora', de: ['prom', 'titular', 664], diz: 'Sayonara'},
  {id: 'caca', curto: 'CACÁ COLCHÕES', nome: 'CARLOS MACHADO DE ANDRADE FILHO (CACÁ COLCHÕES)', g: 'fora', de: ['serv', 'titular', 676], diz: 'Carlos Machado'},
  {id: 'anarleide', curto: 'ANARLEIDE MENEZES', nome: 'ANARLEIDE CRUZ MENEZES', g: 'fora', de: ['cult', 'titular', 645], diz: 'Anarleide'},
  {id: 'sonilda', curto: 'SONILDA MELLO', nome: 'SONILDA SANTANA DE MELLO', g: 'fora', de: ['saude', 'titular', 670], diz: 'Sonilda'},
  {id: 'bruna', curto: 'BRUNA', nome: 'BRUNA LORENA DOS SANTOS ANDRADE', g: 'fora', de: ['prom', 'benefícios', 655], diz: 'Bruna'},
  {id: 'rafael', curto: 'RAFAEL', nome: 'RAFAEL DE JESUS SANTOS', g: 'fora', de: ['prom', 'igualdade racial', 656], diz: 'Rafael'},
  {id: 'camilla', curto: 'CAMILLA', nome: 'CAMILLA CARVALHO ALCANTARA', g: 'fora', de: ['prom', 'contratos', 657], diz: 'Camilla'},
  {id: 'lohaine', curto: 'LOHAINE', nome: 'LOHAINE TAINA DE SOUZA RIBEIRO', g: 'fora', de: ['prom', 'supervisão administrativa', 658], diz: 'Lohaine'},
  {id: 'ionara', curto: 'IONARA', nome: 'IONARA MELO DA SILVA SANTANA', g: 'fora', de: ['prom', 'alta complexidade', 659], diz: 'Ionara'},
  {id: 'lucas', curto: 'LUCAS', nome: 'LUCAS SANTOS DA ROCHA', g: 'fora', de: ['prom', 'média complexidade', 660], diz: 'Lucas'},
  {id: 'julianaA', curto: 'JULIANA AMARAL', nome: 'JULIANA TELES SANTOS DO AMARAL', g: 'fora', de: ['prom', 'proteção social básica', 661], diz: 'Juliana Amaral'},
  {id: 'fernando', curto: 'FERNANDO', nome: 'FERNANDO REIS DA SILVA', g: 'fora', de: ['prom', 'bolsa família', 662], diz: 'Fernando'},
  {id: 'joseAntonio', curto: 'JOSÉ ANTONIO', nome: 'JOSE ANTONIO CHAGOURI OCKE', g: 'fora', de: ['prom', 'superintendência financeira', 663], diz: 'José Antonio'},
  {id: 'marcio', curto: 'MARCIO', nome: 'MARCIO DOS SANTOS AZEVEDO', g: 'fora', de: ['serv', 'seção de altos', 671], diz: 'Marcio'},
  {id: 'silvio', curto: 'SILVIO', nome: 'SILVIO MARIO BARBOSA DA SILVA', g: 'fora', de: ['serv', 'limpeza de praias', 672], diz: 'Silvio'},
  {id: 'beatriz', curto: 'BEATRIZ', nome: 'BEATRIZ NEVES DOS SANTOS', g: 'fora', de: ['serv', 'varrição', 673], diz: 'Beatriz'},
  {id: 'carlosAlberto', curto: 'CARLOS ALBERTO', nome: 'CARLOS ALBERTO MARQUES CAMPOS', g: 'fora', de: ['serv', 'material e pessoal', 674], diz: 'Carlos Alberto'},
  {id: 'rosane', curto: 'ROSANE', nome: 'ROSANE DO CARMO AMORIM DE ALMEIDA', g: 'fora', de: ['cult', 'casa de cultura', 643], diz: 'Rosane'},
  {id: 'jorge', curto: 'JORGE', nome: 'JORGE MARON NETO', g: 'fora', de: ['cult', 'superintendência', 644], diz: 'Jorge'},
  {id: 'julianaS', curto: 'JULIANA SÁ SILVA', nome: 'JULIANA SÁ SILVA', g: 'fora', de: ['saude', 'contas médicas', 669], diz: 'Juliana Sá'},
  {id: 'milva', curto: 'MILVA', nome: 'MILVA LUCIENE BENEVIDES PRADO', g: 'fora', de: ['dese', 'informação e controle', 646], diz: 'Milva'},
  {id: 'ailton', curto: 'AILTON', nome: 'AILTON MARQUES RODRIGUES', g: 'fora', de: ['dese', 'prestação de contas', 647], diz: 'Ailton'},
  {id: 'weslly', curto: 'CARLOS WESLLY', nome: 'CARLOS WESLLY SANTOS CEO', g: 'fora', de: ['gab', 'seção de gabinete', 631], diz: 'Carlos Weslly'},
  {id: 'alexia', curto: 'ALEXIA', nome: 'ALEXIA VICTORIA SALES FRANCO DE BRITO', g: 'fora', de: ['com', 'comunicação de RI', 633], diz: 'Alexia'},
  {id: 'filipeS', curto: 'FILIPE SILVEIRA', nome: 'FILIPE NEVES BRASILEIRO COSTA SILVEIRA', g: 'fora', de: ['gab', 'segurança', 637], diz: 'Filipe Silveira'},
  {id: 'ariana', curto: 'ARIANA', nome: 'ARIANA GUSMÃO PELIZZONE', g: 'fora', de: ['edu', 'assessoria jurídica', 649], diz: 'Ariana'},
  {id: 'edmilson', curto: 'EDMILSON', nome: 'EDMILSON DE JESUS NOVAIS', g: 'fora', de: ['int', 'assessoria de gabinete', 650], diz: 'Edmilson'},
  {id: 'felipeP', curto: 'FELIPE PARAIZO', nome: 'FELIPE SÁ BARRETTO PARAIZO', g: 'fora', de: ['ri', 'assessoria de gabinete', 668], diz: 'Felipe Paraizo'},
];

// ---------- Cadeiras de cada tablado (montadas a partir dos cargos) ----------
type Lugar = {cadeira: V3; frente: V3; chefe: boolean};
type Mesa = {larg: number; prof: number; lugares: Map<string, Lugar>; fundo: (i: number, n: number) => V3; chefe: boolean; nFundo: number};
const chave = (cargo: string, n: number) => `${cargo}#${n}`;
const MESAS: Record<IlhaId, Mesa> = (() => {
  const out = {} as Record<IlhaId, Mesa>;
  for (const id of IDS) {
    const conta = new Map<string, {de: number; para: number}>();
    const ordem: string[] = [];
    for (const p of PESSOAS) {
      for (const [lado, posto] of [['de', p.de], ['para', p.para]] as const) {
        if (!posto || posto[0] !== id) continue;
        const c = conta.get(posto[1]) ?? {de: 0, para: 0};
        if (!conta.has(posto[1])) ordem.push(posto[1]);
        c[lado]++;
        conta.set(posto[1], c);
      }
    }
    const chefe = ordem.some((c) => CHEFE.has(c));
    const pequenas: string[] = [];
    for (const c of ordem) if (!CHEFE.has(c)) for (let n = 0; n < Math.max(conta.get(c)!.de, conta.get(c)!.para); n++) pequenas.push(chave(c, n));
    const cols = pequenas.length > 8 ? 5 : Math.max(3, Math.min(4, pequenas.length));
    const linhas = Math.ceil(pequenas.length / cols);
    const larg = Math.max(3.0, cols * 0.82 + 0.5);
    const topo = chefe ? 1.0 : 0.3;
    const prof = topo + linhas * 0.8 + 0.4;
    const ilha = ILHAS[id];
    const lugares = new Map<string, Lugar>();
    const mundo = (x: number, z: number): V3 => [ilha.x + x, 0.12, ilha.z + z];
    if (chefe) {
      const z = prof / 2 - 0.62;
      for (const c of ordem) if (CHEFE.has(c)) lugares.set(chave(c, 0), {cadeira: mundo(0, z), frente: mundo(0, z + 0.42), chefe: true});
    }
    pequenas.forEach((k, i) => {
      const r = Math.floor(i / cols);
      const nLinha = Math.min(cols, pequenas.length - r * cols);
      const col = i % cols;
      const x = (col - (nLinha - 1) / 2) * 0.82;
      const z = prof / 2 - topo - 0.42 - r * 0.8;
      lugares.set(k, {cadeira: mundo(x, z), frente: mundo(x, z + 0.34), chefe: false});
    });
    const nFundo = PESSOAS.filter((p) => p.de?.[0] === id).length;
    const fundo = (i: number, n: number): V3 => {
      const passo = Math.min(0.46, (larg - 0.3) / Math.max(1, n));
      return [ilha.x + (i - (n - 1) / 2) * passo, 0, ilha.z - prof / 2 - 0.38];
    };
    out[id] = {larg, prof, lugares, fundo, chefe, nFundo};
  }
  return out;
})();

// Lugar de cada pessoa: n-ésimo com o mesmo cargo no mesmo órgão.
const lugarDe = (() => {
  const de = new Map<string, Lugar>();
  const para = new Map<string, Lugar>();
  const fundo = new Map<string, V3>();
  const usadosDe = new Map<string, number>();
  const usadosPara = new Map<string, number>();
  const nFundo = new Map<IlhaId, number>();
  for (const p of PESSOAS) {
    if (p.de) {
      const k = `${p.de[0]}|${p.de[1]}`;
      const n = usadosDe.get(k) ?? 0;
      usadosDe.set(k, n + 1);
      de.set(p.id, MESAS[p.de[0]].lugares.get(chave(p.de[1], CHEFE.has(p.de[1]) ? 0 : n))!);
      const f = nFundo.get(p.de[0]) ?? 0;
      nFundo.set(p.de[0], f + 1);
      fundo.set(p.id, MESAS[p.de[0]].fundo(f, MESAS[p.de[0]].nFundo));
    }
    if (p.para) {
      const k = `${p.para[0]}|${p.para[1]}`;
      const n = usadosPara.get(k) ?? 0;
      usadosPara.set(k, n + 1);
      para.set(p.id, MESAS[p.para[0]].lugares.get(chave(p.para[1], CHEFE.has(p.para[1]) ? 0 : n))!);
    }
  }
  return {de, para, fundo};
})();

// Fila de quem chega (fora do portão de ENTRADA) e calçada de quem sai (fora do portão de SAÍDA): 7 colunas × 4 fileiras.
const bloco = (lado: 1 | -1, i: number): V3 => [lado * (CERCA_X + 1.8 + (i % 7) * 0.8), 0.08, PORTAO_Z - 1.2 + Math.floor(i / 7) * 0.8];

// ---------- Movimentos ----------
type Mov = {de: V3; para: V3; a: number; d: number; alto: number; rotFim: number};
type Plano = {p: Pes; dito: number; ini: V3; rotIni: number; levanta?: Mov; vai?: Mov; chega: number};
const angDe = (de: V3, para: V3) => Math.atan2(para[0] - de[0], para[2] - de[2]);
const dist = (a: V3, b: V3) => Math.hypot(b[0] - a[0], b[2] - a[2]);
const PLANOS: Plano[] = (() => {
  const chegam = PESSOAS.filter((p) => p.g === 'chega').sort((a, b) => quando(a.diz) - quando(b.diz));
  const saem = PESSOAS.filter((p) => p.g === 'fora').sort((a, b) => quando(a.diz) - quando(b.diz));
  return PESSOAS.map((p, idx) => {
    const dito = quando(p.diz);
    const a = (p.vai ? quando(p.vai) : dito) + 0.05;
    if (p.g === 'chega') {
      const ini = bloco(-1, chegam.indexOf(p));
      const fim = lugarDe.para.get(p.id)!.frente;
      const d = Math.min(1.5, 0.75 + dist(ini, fim) * 0.035);
      return {p, dito, ini, rotIni: Math.PI / 2, vai: {de: ini, para: fim, a, d, alto: 1.2 + dist(ini, fim) * 0.12, rotFim: 0}, chega: a + d};
    }
    const ini = lugarDe.de.get(p.id)!.frente;
    const atras = lugarDe.fundo.get(p.id)!;
    const t0 = T.n53 + 0.35 + (idx % 17) * 0.05;
    const levanta: Mov = {de: ini, para: atras, a: t0, d: 0.8, alto: 0.25, rotFim: 0};
    const fim = p.g === 'troca' ? lugarDe.para.get(p.id)!.frente : bloco(1, saem.indexOf(p));
    const d = Math.min(1.6, 0.75 + dist(atras, fim) * 0.035);
    const alto = Math.min(4.2, 0.9 + dist(atras, fim) * 0.12);
    return {p, dito, ini, rotIni: 0, levanta, vai: {de: atras, para: fim, a, d, alto, rotFim: p.g === 'fora' ? -Math.PI / 2 : 0}, chega: a + d};
  });
})();

const misturaAng = (a: number, b: number, k: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * k;
};
const noMov = (m: Mov, s: number): V3 => curva(m.de, m.para, m.alto, s);

type Estado = {pos: V3; rot: number; passo: number; voa: number};
const estado = (pl: Plano, t: number): Estado => {
  let pos = pl.ini;
  let rot = pl.rotIni;
  for (const m of [pl.levanta, pl.vai]) {
    if (!m || t < m.a) break;
    const s = rampa(t, m.a, m.a + m.d);
    if (s < 1) {
      const dir = angDe(m.de, m.para);
      const r1 = misturaAng(rot, dir, k01(s / 0.15));
      return {pos: noMov(m, s), rot: misturaAng(r1, m.rotFim, k01((s - 0.8) / 0.2)), passo: Math.sin(s * Math.PI * 4), voa: Math.sin(s * Math.PI)};
    }
    pos = m.para;
    rot = m.rotFim;
  }
  return {pos, rot, passo: 0, voa: 0};
};

const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));

// Cor de cada boneco: cinza neutro até "três grupos"; depois a cor do grupo; cheia enquanto se mexe.
const corPessoa = (tema: Tema, pl: Plano, t: number) => {
  const g = pl.p.g;
  const cor = g === 'troca' ? tema.acento : g === 'chega' ? AZUL(tema) : mistura(tema.objetoEscuro, tema.objeto, 0.4);
  const tGrupo = g === 'troca' ? T.g25 : g === 'chega' ? T.g26 : T.g28;
  const base = 0.45 * rampa(t, tGrupo, tGrupo + 0.6);
  const vivo = pl.vai ? janela(t, pl.dito - 0.1, pl.chega + 0.4) : 0;
  const depois = g === 'fora' ? 0.7 : 0.75;
  const k = pl.vai && t > pl.chega + 0.4 ? Math.max(depois, vivo) : Math.max(base, vivo);
  return mistura(tema.pessoa, cor, k);
};

// Tablado aceso: quem chega nele ou sai dele, perto da hora.
const ACESOS: [IlhaId, number, number][] = PLANOS.flatMap((pl) => {
  const v = pl.vai!;
  const out: [IlhaId, number, number][] = [];
  if (pl.p.para) out.push([pl.p.para[0], v.a - 0.2, v.a + v.d + 0.5]);
  if (pl.p.g === 'fora' && pl.p.de) out.push([pl.p.de[0], v.a - 0.3, v.a + 0.6]);
  return out;
});
const acesoIlha = (id: IlhaId, t: number) => {
  let v = 0;
  for (const [i, a, b] of ACESOS) if (i === id && t > a - 0.5 && t < b + 0.5) v = Math.max(v, janela(t, a, b));
  return v;
};

// O boneco de exemplo da conta (cena 3) e as cadeiras dele.
const EX_A: V3 = [-1.1, 0, PODIO_Z - 1.6];
const EX_B: V3 = [1.1, 0, PODIO_Z - 1.6];
const PILHA_E: V3 = [-3.0, 0, PODIO_Z];
const PILHA_N: V3 = [3.0, 0, PODIO_Z];

// ---------- Mundo ----------
const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const azul = AZUL(tema);
  // Diário Oficial gigante: desce na frente da Prefeitura e sobe de volta na conta.
  const dk = rampa(t, T.diario - 0.3, T.diario + 0.8, sai) * (1 - rampa(t, T.trocas - 0.2, T.trocas + 0.9));
  const destaque = rampa(t, T.edicao, T.edicao + 0.5);
  const letreiro = 0.25 + 0.5 * pulso(t, T.diario, 1.0);
  // Valderico e Jabes (cena 2): nascem na fala e se afastam no rompimento.
  const kVal = entra(t, T.valderico - 0.2, 0.5) * (1 - rampa(t, T.decretos, T.decretos + 0.5));
  const kJab = entra(t, T.jabes - 0.2, 0.5) * (1 - rampa(t, T.decretos, T.decretos + 0.5));
  const afasta = rampa(t, T.rompimento, T.rompimento + 1.2);
  const racha = rampa(t, T.rompimento + 0.2, T.rompimento + 1.4);
  // Cena 3: pilhas de decretos, troca de exemplo e carimbos.
  const cena3 = rampa(t, T.decretos - 0.6, T.decretos) * (1 - rampa(t, T.secretarios + 0.6, T.secretarios + 1.4));
  const exK = entra(t, T.soTrocou - 0.5, 0.5) * cena3;
  const exS = rampa(t, T.soTrocou + 0.1, T.soTrocou + 1.7);
  const carimboE = entra(t, T.exonerada, 0.45) * cena3;
  const carimboN = entra(t, T.nomeada, 0.45) * cena3;
  const exPos = curva([EX_A[0], 0, EX_A[2] + 0.4], [EX_B[0], 0, EX_B[2] + 0.4], 1.1, exS);
  const exRot = exS > 0 && exS < 1 ? Math.PI / 2 : 0;
  // Portões e calçada.
  const entradaLuz = Math.max(janela(t, T.quemEntrou, T.diario), janela(t, T.quemChegou, PLANOS.filter((p) => p.p.g === 'chega').reduce((m, p) => Math.max(m, p.chega), 0)));
  const saidaLuz = Math.max(janela(t, T.quemSaiu, T.diario), janela(t, T.quemFora, T.atencao));
  const calcLuz = Math.max(janela(t, T.quemFora1, T.diario), janela(t, T.quemFora, T.semSec));
  // Fim: as duas cadeiras grandes vazias e o interino.
  const vazias = janela(t, T.semSec, FIM);
  const kHermano = rampa(t, T.tabuleiro, T.tabuleiro + 0.8);
  const kDuvida = entra(t, T.naoQuer, 0.5) * (1 - rampa(t, T.semSec + 0.4, T.semSec + 1.2));
  const secAro = janela(t, T.secretarios, T.secretarios + 1.6);
  return (
    <>
      <Particulas t={t} centro={[0, 3, 0]} raio={18} n={40} />
      {/* Praça, cerca e portões */}
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[2 * CERCA_X, 0.07, CERCA_Z1 - CERCA_Z0]} />
        <meshStandardMaterial color={mistura(tema.chao, tema.objeto, 0.18)} roughness={0.95} />
      </mesh>
      <Cerca tema={tema} x0={-CERCA_X} x1={CERCA_X} z0={CERCA_Z0} z1={CERCA_Z1} vaos={[[-CERCA_X, PORTAO_Z - 1.5, PORTAO_Z + 1.5], [CERCA_X, PORTAO_Z - 1.5, PORTAO_Z + 1.5]]} />
      <PortaoPlaca tema={tema} pos={ENTRADA} rotY={-Math.PI / 2} larg={2.8} texto="ENTRADA" aceso={entradaLuz} cor={azul} />
      <PortaoPlaca tema={tema} pos={SAIDA} rotY={Math.PI / 2} larg={2.8} texto="SAÍDA" aceso={saidaLuz} cor={tema.objetoClaro} />
      <Calcada tema={tema} pos={[CERCA_X + 4.2, 0, PORTAO_Z + 0.1]} larg={6.6} prof={4.0} aceso={calcLuz} cor={tema.objetoClaro} />
      <Calcada tema={tema} pos={[-CERCA_X - 4.2, 0, PORTAO_Z + 0.1]} larg={6.6} prof={4.0} aceso={entradaLuz} cor={azul} />
      <group position={[CERCA_X + 4.2, 0, PORTAO_Z - 2.6]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['FICARAM', 'DE FORA']} aceso={0.6 * calcLuz} escala={1.2} />
      </group>
      <group position={[-CERCA_X - 4.2, 0, PORTAO_Z - 2.6]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['CHEGARAM']} escala={1.2} />
      </group>
      {/* Prefeitura com letreiro próprio */}
      <group position={PREFEITURA}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={1.8} sobe={1} letreiro={0} texto=" " />
        <group scale={1.8}>
          <mesh position={[0, 2.73, 1.185]}>
            <boxGeometry args={[2.56, 0.44, 0.02]} />
            <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objeto, 0.2)} emissive={tema.objetoClaro} emissiveIntensity={0.08 * letreiro} roughness={0.9} />
          </mesh>
          <Placa tema={tema} pos={[0, 2.73, 1.2]} larg={2.4} alt={0.4} linhas={[{t: 'PREFEITURA', tam: 210, cor: tema.objetoClaro, peso: 900}, {t: 'DE ILHÉUS', tam: 120, cor: tema.objetoClaro, peso: 700, mono: true}]} brilho={0.3 + 0.5 * letreiro} />
        </group>
      </group>
      {/* Tablados, cadeiras e placas */}
      {IDS.map((id) => {
        const il = ILHAS[id];
        const m = MESAS[id];
        const a = acesoIlha(id, t);
        return (
          <group key={id}>
            <Tablado tema={tema} pos={[il.x, 0, il.z]} larg={m.larg} prof={m.prof} aceso={a} />
            <PlacaOrgao tema={tema} pos={[il.x, 0, il.z - m.prof / 2 - 0.85]} linhas={il.linhas} aceso={a} escala={0.85} alto={1.5} />
            {[...m.lugares.values()].map((l, i) => {
              const vazia = (id === 'saude' || id === 'serv') && l.chefe ? vazias : 0;
              return l.chefe ? (
                <Cadeira key={i} tema={tema} pos={l.cadeira} escala={0.55} aceso={Math.max(0.8 * secAro, vazia)} />
              ) : (
                <Cadeirinha key={i} tema={tema} pos={l.cadeira} />
              );
            })}
          </group>
        );
      })}
      {/* As pessoas */}
      {PLANOS.map((pl) => {
        const e = estado(pl, t);
        return <Boneco key={pl.p.id} tema={tema} pos={e.pos} rotY={e.rot} escala={ESC} cor={corPessoa(tema, pl, t)} pose={e.voa > 0 ? {passo: e.passo, ombroD: [0, 0, 0.5 + 0.9 * e.voa], ombroE: [0, 0, -0.5 - 0.9 * e.voa]} : undefined} />;
      })}
      {/* Rastro de cada pulo (verde na troca, azul na chegada, cinza na saída) e onda na chegada */}
      {PLANOS.map((pl) => {
        const m = pl.vai!;
        const prog = rampa(t, m.a, m.a + m.d);
        const op = 1 - rampa(t, m.a + m.d + 0.3, m.a + m.d + 1.1);
        if (prog <= 0 || op <= 0) return null;
        const cor = pl.p.g === 'troca' ? tema.acento : pl.p.g === 'chega' ? azul : tema.objetoClaro;
        const f = (s: number): V3 => {
          const q = noMov(m, s);
          return [q[0], q[1] + 0.12, q[2]];
        };
        return (
          <group key={pl.p.id}>
            <Trilha f={f} prog={prog} cor={cor} n={18} raio={0.045} opacidade={op * (pl.p.g === 'fora' ? 0.6 : 0.9)} />
            {pl.p.g !== 'fora' ? <Onda pos={[m.para[0], m.para[1] + 0.02, m.para[2]]} k={rampa(t, m.a + m.d - 0.1, m.a + m.d + 0.9)} cor={cor} raio={0.6} /> : null}
          </group>
        );
      })}
      {/* "?" pequeno em cima de quem ficou de fora (a saída pode não ser definitiva) */}
      {kDuvida > 0.02
        ? PLANOS.filter((pl) => pl.p.g === 'fora').map((pl) => {
            const e = estado(pl, t);
            return <Interrogacao key={pl.p.id} tema={tema} pos={[e.pos[0], e.pos[1] + 1.25, e.pos[2]]} k={0.62 * kDuvida} giro={-Math.PI / 2 + 0.5} cor={tema.objetoClaro} />;
          })
        : null}
      {/* As duas cadeiras grandes vazias e o interino tracejado */}
      {(['saude', 'serv'] as IlhaId[]).map((id) => {
        const l = [...MESAS[id].lugares.values()].find((x) => x.chefe)!;
        return <Interrogacao key={id} tema={tema} pos={[l.cadeira[0], l.cadeira[1] + 1.75, l.cadeira[2]]} k={0.9 * entra(t, T.semSec + (id === 'serv' ? 0.4 : 0), 0.5) * (id === 'serv' ? 1 - 0.5 * kHermano : 1)} giro={0.35 * Math.sin(t * 0.8)} />;
      })}
      {kHermano > 0.01 ? (
        <Fantasma op={0.45 * kHermano}>
          <Boneco tema={tema} pos={[...MESAS.serv.lugares.values()].find((x) => x.chefe)!.frente} escala={ESC} cor={tema.objetoClaro} />
        </Fantasma>
      ) : null}
      {/* Cena 2: Valderico e Jabes, iguais, na frente da Prefeitura */}
      <Boneco tema={tema} pos={[-0.7 - 0.9 * afasta, 0.07, -21]} rotY={0.25 * (1 - afasta) - 0.15 * afasta} escala={0.75 * kVal} cor={tema.pessoa} />
      <Boneco tema={tema} pos={[0.7 + 0.9 * afasta, 0.07, -21]} rotY={-0.25 * (1 - afasta) + 0.15 * afasta} escala={0.75 * kJab} cor={tema.pessoa} />
      {racha > 0.01 && kVal > 0.02 ? <Caixa3 tema={tema} k={racha * Math.min(1, kVal)} /> : null}
      {/* Diário Oficial gigante */}
      {dk > 0.01 ? (
        <group position={[0, 3.6 + 9 * (1 - dk), -19.2]} rotation={[1.0, 0, 0]} scale={4.2}>
          <DiarioOficial tema={tema} pos={[0, 0, 0]} escala={1} destaque={destaque} />
          <Placa tema={tema} pos={[0.01, 0.068, -0.47]} rot={[-Math.PI / 2, 0, 0]} larg={0.76} alt={0.12} linhas={[{t: 'DIÁRIO OFICIAL', tam: 150, cor: tema.objetoClaro, peso: 900}]} brilho={0.4} />
          <Placa tema={tema} pos={[0.01, 0.068, -0.36]} rot={[-Math.PI / 2, 0, 0]} larg={0.76} alt={0.06} linhas={[{t: 'EDIÇÃO Nº 260 · 29/10/2026', tam: 90, cor: tema.tinta, peso: 800, mono: true}]} brilho={0.2} />
        </group>
      ) : null}
      {/* Cena 3: as pilhas de decretos (53 exonerações e 51 nomeações) */}
      {cena3 > 0.01 ? (
        <group>
          <Calcada tema={tema} pos={[0, 0, PODIO_Z - 0.8]} larg={9.6} prof={5.0} />
          <Pilha tema={tema} t={t} pos={PILHA_E} n={53} base={25} a={T.e53 - 0.3} cor2={mistura(tema.objetoEscuro, tema.objeto, 0.4)} t2={T.g28} sobe={cena3} />
          <Pilha tema={tema} t={t} pos={PILHA_N} n={51} base={25} a={T.n51 - 0.3} cor2={azul} t2={T.g26} sobe={cena3} />
          <PlacaOrgao tema={tema} pos={[PILHA_E[0], 0, PILHA_E[2] + 0.75]} linhas={['53', 'EXONERAÇÕES']} escala={0.75 * entra(t, T.e53, 0.5) * cena3} alto={0.45} />
          <PlacaOrgao tema={tema} pos={[PILHA_N[0], 0, PILHA_N[2] + 0.75]} linhas={['51', 'NOMEAÇÕES']} escala={0.75 * entra(t, T.n51, 0.5) * cena3} alto={0.45} />
          <Cadeirinha tema={tema} pos={[EX_A[0], 0.08, EX_A[2]]} aceso={0.8 * carimboE} luz={tema.objetoClaro} />
          <Cadeirinha tema={tema} pos={[EX_B[0], 0.08, EX_B[2]]} aceso={0.8 * carimboN} />
          <Boneco tema={tema} pos={[exPos[0], exPos[1] + 0.08, exPos[2]]} rotY={exRot} escala={0.6 * exK} cor={mistura(tema.pessoa, tema.acento, rampa(t, T.soTrocou, T.soTrocou + 0.5))} pose={exS > 0 && exS < 1 ? {passo: Math.sin(exS * Math.PI * 4)} : undefined} />
          <PlacaOrgao tema={tema} pos={[EX_A[0], 0, EX_A[2] - 0.45]} linhas={['EXONERADO']} escala={0.6 * carimboE} alto={0.95} />
          <PlacaOrgao tema={tema} pos={[EX_B[0], 0, EX_B[2] - 0.45]} linhas={['NOMEADO']} aceso={carimboN} escala={0.6 * carimboN} alto={0.95} />
        </group>
      ) : null}
    </>
  );
};

// Linha que se abre no chão entre Valderico e Jabes.
const Caixa3: React.FC<{tema: Tema; k: number}> = ({tema, k}) => (
  <mesh position={[0, 0.1, -21 + 0.6 - 1.2 * k * 0.5]} scale={[1, 1, k]}>
    <boxGeometry args={[0.06, 0.02, 1.4]} />
    <meshStandardMaterial color={tema.objetoClaro} emissive={tema.objetoClaro} emissiveIntensity={0.25} roughness={0.9} />
  </mesh>
);

// Pilha de folhinhas que caem uma a uma; as `base` de baixo ficam verdes (as mesmas pessoas nas duas pilhas) em "vinte e cinco".
const Pilha: React.FC<{tema: Tema; t: number; pos: V3; n: number; base: number; a: number; cor2: string; t2: number; sobe: number}> = ({tema, t, pos, n, base, a, cor2, t2, sobe}) => {
  const verde = rampa(t, T.g25, T.g25 + 0.6);
  const topo = rampa(t, t2, t2 + 0.6);
  return (
    <group position={pos} scale={[1, Math.max(0.02, sobe), 1]}>
      {Array.from({length: n}, (_, i) => {
        const ti = a + (i / n) * 1.4;
        const k = rampa(t, ti, ti + 0.35, sai);
        if (k <= 0) return null;
        const y = 0.04 + i * 0.062 + (1 - k) * 4;
        const cor = i < base ? mistura(tema.objetoClaro, tema.acento, verde) : mistura(tema.objetoClaro, cor2, topo);
        return <Folha key={i} pos={[0, y, 0]} rot={[0, (i % 5) * 0.06 - 0.12, 0]} cor={cor} brilho={i < base ? 0.25 * verde : 0} />;
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const ilhaCam = (id: IlhaId, larg = 7, alt = 5.5, dir: V3 = [0, 0.95, 1]) => E([ILHAS[id].x, 0.4, ILHAS[id].z], larg, alt, dir);
const entre = (a: IlhaId, b: IlhaId, larg = 10, alt = 6, dir: V3 = [0, 0.95, 1]) => E([(ILHAS[a].x + ILHAS[b].x) / 2, 0.4, (ILHAS[a].z + ILHAS[b].z) / 2], larg, alt, dir);
const GERAL = E([0, 0, -1], 15, 27, [0, 1.3, 1]);
const tDiz = (id: string) => PLANOS.find((p) => p.p.id === id)!.dito;
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 0.3, 2.8], 13, 15, [0, 1.15, 1])], [T.quemFora1, E([0, 0.2, 1.5], 17, 24, [0.06, 1.2, 1])], [T.diario - 0.4, E([0, 0, -2], 17, 34, [0.08, 1.25, 1])]]},
  {
    ini: T.diario - 0.4,
    chaves: [
      [T.diario - 0.4, E([0, 3.4, -19.2], 8, 8, [0, 0.35, 1])],
      [T.edicao + 0.6, E([0, 3.2, -19.2], 7, 7, [0.05, 0.3, 1])],
      [T.trocas + 0.4, E([0, 0.9, -21], 6, 4.6, [0.2, 0.75, 1])],
      [T.decretos - 0.5, E([0, 0.9, -21], 5.4, 4.2, [-0.15, 0.7, 1])],
    ],
  },
  {
    ini: T.decretos - 0.4,
    chaves: [
      [T.decretos - 0.4, E([0, 1.6, PODIO_Z - 0.6], 8.5, 6, [0, 0.35, 1])],
      [T.soTrocou - 0.2, E([0, 1.4, PODIO_Z - 0.6], 8, 5.5, [0.1, 0.35, 1])],
      [T.soTrocou + 0.6, E([0, 0.6, EX_A[2]], 3.6, 2.6, [0.15, 0.4, 1])],
      [T.nomeada + 0.6, E([0, 0.6, EX_A[2]], 3.8, 2.8, [-0.15, 0.4, 1])],
      [T.grupos, E([0, 1.6, PODIO_Z - 0.6], 8.5, 6, [0, 0.4, 1])],
      [T.secretarios - 0.5, E([0, 1.7, PODIO_Z - 0.6], 9, 6.5, [0, 0.55, 1])],
    ],
  },
  {
    ini: T.secretarios - 0.4,
    arco: 0.05,
    chaves: [
      [T.secretarios - 0.4, E([0, 0.4, 2.8], 16, 14, [-0.2, 1.0, 1])],
      [tDiz('vinicius') - 0.2, E([-6.8, 0.5, 1.8], 8, 6, [-0.35, 0.9, 1])],
      [tDiz('evani') + 0.4, entre('edu', 'mul', 10, 6.5)],
      [tDiz('wanessa') + 0.4, entre('mul', 'prom', 10, 6.5)],
      [tDiz('davidson') + 0.4, entre('mara', 'cult', 10, 6.5)],
      [tDiz('fabricio') + 0.4, entre('tran', 'mara', 10, 6.5)],
      [tDiz('nal') + 0.3, E([-7.0, 0.5, 4.4], 8, 6, [-0.35, 0.9, 1])],
      [tDiz('antonio') + 0.3, entre('ctrl', 'faz', 10, 6.5)],
      [T.humbertoDito + 0.2, E([-2.8, 0.4, -13.2], 10, 8, [0, 1.0, 1])],
      [T.maisTrocas - 0.6, E([0, 0, -6], 15, 26, [0, 1.6, 0.8])],
    ],
  },
  {
    ini: T.maisTrocas - 0.4,
    arco: 0.05,
    chaves: [
      [T.maisTrocas - 0.4, E([-2.8, 0.4, -16.8], 10, 6.5, [0, 1.0, 1])],
      [tDiz('erika') + 0.6, E([-2.8, 0.4, -16.8], 9.5, 6.2, [0.1, 1.0, 1])],
      [tDiz('railane') + 0.3, E([2.8, 0, 7.5], 13, 20, [0.25, 1.4, 1])],
      [tDiz('alecsandro') + 1.0, E([2.8, 0, 7.0], 12, 18, [0.15, 1.4, 1])],
      [tDiz('caio') + 0.2, entre('proc', 'ctrl', 10, 6.5)],
      [tDiz('bruno') + 1.2, entre('proc', 'ctrl', 10, 6.5, [-0.1, 0.95, 1])],
      [T.trocaramLugar + 0.2, entre('tur', 'com', 10, 6.5)],
      [tDiz('thaise') + 0.4, entre('tur', 'com', 9, 6, [0.1, 0.9, 1])],
      [tDiz('prucoli') + 0.2, GERAL],
      [tDiz('pauloRenan') + 1.0, E([0, 0, -1], 15, 26, [0.06, 1.3, 1])],
    ],
  },
  {
    ini: T.quemChegou - 0.4,
    arco: 0.06,
    chaves: [
      [T.quemChegou - 0.4, E([-9.5, 0.4, 2.8], 12, 9, [-0.6, 0.9, 1])],
      [tDiz('joseCarlos') + 0.3, E([-3.5, 0, 6.5], 15, 15, [-0.45, 1.2, 1])],
      [tDiz('jackeline') + 0.3, E([-1.5, 0, 3.0], 17, 12, [-0.35, 1.2, 1])],
      [tDiz('joseDomingos') + 0.3, E([-5.5, 0, -2.0], 13, 14, [-0.4, 1.2, 1])],
      [tDiz('stephanie') + 0.3, E([-1.0, 0, 6.5], 17, 15, [-0.3, 1.25, 1])],
      [tDiz('francielle') + 0.3, E([-3.0, 0, 9.5], 15, 15, [-0.3, 1.25, 1])],
      [tDiz('mariaJose') + 0.3, E([-3.5, 0, -6.5], 15, 22, [-0.3, 1.3, 1])],
      [tDiz('ysis') + 0.3, E([-1.5, 0, 4.0], 17, 12, [-0.3, 1.2, 1])],
      [tDiz('anderson') + 0.2, E([-2.0, 0, -4.0], 15, 26, [-0.25, 1.35, 1])],
      [T.quemFora - 0.6, E([0, 0, -2.0], 15, 27, [-0.1, 1.35, 1])],
    ],
  },
  {
    ini: T.quemFora - 0.4,
    arco: 0.06,
    chaves: [
      [T.quemFora - 0.4, E([9.5, 0.4, 2.8], 12, 9, [0.6, 0.9, 1])],
      [tDiz('sayonara') + 0.3, E([7.0, 0, 6.0], 13, 14, [0.45, 1.15, 1])],
      [tDiz('sonilda') + 0.8, E([4.0, 0, 7.0], 16, 16, [0.4, 1.2, 1])],
      [tDiz('bruna') + 0.3, E([8.5, 0, 2.2], 11, 9, [0.5, 1.0, 1])],
      [tDiz('marcio') + 0.3, E([6.0, 0, 6.5], 14, 12, [0.45, 1.1, 1])],
      [tDiz('rosane') + 0.3, E([7.5, 0, 4.0], 12, 10, [0.45, 1.1, 1])],
      [tDiz('milva') + 0.3, E([7.5, 0, 7.0], 12, 11, [0.45, 1.1, 1])],
      [tDiz('weslly') + 0.3, E([2.0, 0, -6.0], 17, 28, [0.35, 1.35, 1])],
      [tDiz('felipeP') + 0.8, E([3.0, 0, -3.0], 17, 30, [0.3, 1.35, 1])],
      [T.atencao - 0.4, E([12.5, 0.4, 2.8], 9, 7, [0.5, 0.75, 1])],
    ],
  },
  {
    ini: T.atencao - 0.4,
    chaves: [
      [T.atencao - 0.4, E([12.5, 0.4, 2.8], 8.5, 6.5, [0.45, 0.75, 1])],
      [T.semSec - 0.3, E([12.5, 0.4, 2.8], 8, 6, [0.35, 0.7, 1])],
      [T.semSec + 1.0, entre('saude', 'serv', 8.5, 5.5, [0, 0.7, 1])],
      [T.tabuleiro + 0.3, ilhaCam('serv', 5.5, 4.2, [0.15, 0.6, 1])],
      [T.salva - 0.5, ilhaCam('serv', 5.2, 4.0, [0.25, 0.6, 1])],
    ],
  },
  {ini: T.salva - 0.4, chaves: [[T.salva - 0.4, ilhaCam('serv', 7, 5, [0.2, 0.8, 1])], [FIM, E([0, 0, 0], 15, 31, [0, 2.4, 0.6])]]},
];
const cenaEm = (t: number) => {
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (CENAS[k].ini <= t) i = k;
  return i;
};
const camEm = (t: number): Cam => {
  const i = cenaEm(t);
  const c = CENAS[i];
  const fim = i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM;
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.1, grua: 0.03});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.quemSaiu, b: T.diario, texto: 'QUEM SAIU?'},
  {a: T.quemEntrou, b: T.diario, texto: 'QUEM ENTROU?'},
  {a: T.quemFora1, b: T.diario, texto: 'QUEM FICOU DE FORA?'},
  {a: T.todos, b: T.diario, texto: 'COM TODOS OS NOMES', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.edicao, b: T.decretos, texto: 'DIÁRIO OFICIAL DE ILHÉUS Nº 260 · 29/10/2026'},
  {a: T.decretos, b: T.secretarios, texto: 'DECRETOS Nº 627 A 730 · DIÁRIO OFICIAL Nº 260'},
  {a: T.tabuleiro, b: T.salva, texto: 'SEGUNDO O SITE O TABULEIRO · 30/10/2026'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '14px 30px 18px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 116, fontWeight: 900, letterSpacing: -4, lineHeight: 1.0, color: cor ?? tema.texto}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

const GRUPOS: {g: G; rotulo: string; total: number}[] = [
  {g: 'troca', rotulo: 'TROCARAM', total: 25},
  {g: 'chega', rotulo: 'CHEGARAM', total: 26},
  {g: 'fora', rotulo: 'DE FORA', total: 28},
];
const corGrupo = (tema: Tema, g: G) => (g === 'troca' ? tema.acento : g === 'chega' ? AZUL(tema) : tema.objetoClaro);
const orgaoNome = (posto?: Posto) => (posto ? `${ILHAS[posto[0]].nome} (${posto[1].toUpperCase()})` : '');
const LISTA = [...PLANOS].sort((a, b) => a.dito - b.dito);

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const chip = CHIPS.filter((c) => t >= c.a && visivel(c, t) > 0.01);
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const conta = Math.round(53 * rampa(t, T.n53, T.n53 + 1.0));
  const kGancho = entra(t, T.n53, 0.45) * (1 - rampa(t, T.diario - 0.4, T.diario));
  const fimConta = 1 - rampa(t, T.grupos - 0.3, T.grupos);
  const k53 = entra(t, T.e53, 0.45) * fimConta;
  const k51 = entra(t, T.n51, 0.45) * fimConta;
  const kG = [T.g25, T.g26, T.g28].map((a) => entra(t, a, 0.45) * (1 - rampa(t, T.secretarios - 0.4, T.secretarios)));
  const placar = rampa(t, T.secretarios - 0.2, T.secretarios + 0.4);
  const cartao = rampa(t, T.secretarios, T.secretarios + 0.5) * (1 - rampa(t, T.atencao - 0.3, T.atencao + 0.2));
  const kVal = rampa(t, T.valderico, T.valderico + 0.4) * (1 - rampa(t, T.decretos - 0.4, T.decretos));
  const kJab = rampa(t, T.jabes, T.jabes + 0.4) * (1 - rampa(t, T.decretos - 0.4, T.decretos));
  const kRomp = entra(t, T.rompimento, 0.45) * (1 - rampa(t, T.valderico - 0.3, T.valderico));
  const kExN = Math.max(entra(t, T.soTrocou, 0.4), 0) * (1 - rampa(t, T.grupos - 0.3, T.grupos));
  const kDuvida = entra(t, T.naoQuer, 0.45) * (1 - rampa(t, T.semSec - 0.3, T.semSec));
  const kSemSec = entra(t, T.semSec, 0.45) * (1 - rampa(t, T.tabuleiro - 0.3, T.tabuleiro));
  const kSemDec = entra(t, T.semDecreto, 0.45) * (1 - rampa(t, T.salva - 0.35, T.salva - 0.05));
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  // Linhas do cartão: as 3 últimas pessoas ditas.
  const ditas = LISTA.filter((pl) => pl.dito <= t + 0.05 && pl.dito >= T.secretarios - 0.1);
  const linhas = ditas.slice(-3).reverse();
  const contagem = (g: G) => PLANOS.filter((pl) => pl.p.g === g && t >= pl.chega).length;
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string) => (
    <div style={{position: 'absolute', left: Math.max(SEGURO.esq + 150, Math.min(SEGURO.botoesX - 150, x)), top: Math.max(560, Math.min(1130, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 11, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 26, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const pVal = projetar([-1.3, 1.7, -21], cam, W, H);
  const pJab = projetar([1.3, 1.7, -21], cam, W, H);
  return (
    <>
      {/* Gancho */}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center'}}>
        <Numero tema={tema} valor={String(conta)} rotulo="EXONERAÇÕES NUM DIA" k={kGancho} cor={tema.acento} />
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        {chip.map((c) => (
          <div key={c.texto} style={{opacity: Math.min(1, visivel(c, t) * 1.2)}}>
            <Chip tema={tema} texto={c.texto} k={entra(t, c.a, 0.45)} destaque={c.destaque} tam={32} />
          </div>
        ))}
      </div>
      {/* Cena 2 */}
      {kRomp > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kRomp * 1.3)}}>
          <Chip tema={tema} texto="ROMPIMENTO POLÍTICO" k={kRomp} tam={32} />
        </div>
      ) : null}
      {kVal > 0.01 && pVal.visivel ? rotulo(pVal.x, pVal.y - 70, 'VALDERICO JÚNIOR · PREFEITO', kVal, tema.cartaoBorda) : null}
      {kJab > 0.01 && pJab.visivel ? rotulo(pJab.x, pJab.y, 'JABES RIBEIRO · EX-PREFEITO · PP', kJab, tema.cartaoBorda) : null}
      {/* Cena 3: as duas pilhas e os três grupos */}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center', gap: 26}}>
        <Numero tema={tema} valor="53" rotulo="EXONERAÇÕES" k={k53} />
        <Numero tema={tema} valor="51" rotulo="NOMEAÇÕES" k={k51} />
      </div>
      {kExN > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 700, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kExN * 1.3)}}>
          <Chip tema={tema} texto="1 TROCA = 1 EXONERAÇÃO + 1 NOMEAÇÃO" k={kExN} tam={28} />
        </div>
      ) : null}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 440, display: 'flex', justifyContent: 'center', gap: 16}}>
        {GRUPOS.map((gr, i) => (
          <Numero key={gr.g} tema={tema} valor={String(gr.total)} rotulo={gr.rotulo} k={kG[i]} cor={corGrupo(tema, gr.g)} />
        ))}
      </div>
      {/* Placar fixo */}
      {placar > 0 ? (
        <div style={{position: 'absolute', top: 400, left: SEGURO.esq, right: W - SEGURO.dir, display: 'flex', justifyContent: 'center', gap: 12, opacity: placar}}>
          {GRUPOS.map((gr) => {
            const n = contagem(gr.g);
            const cheio = n >= gr.total;
            return (
              <div key={gr.g} style={{display: 'flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cheio ? corGrupo(tema, gr.g) : tema.cartaoBorda}`, fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>
                <span style={{width: 14, height: 14, borderRadius: 7, background: corGrupo(tema, gr.g)}} />
                {gr.rotulo}
                <span style={{color: tema.texto, fontSize: 26}}>
                  {n}/{gr.total}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
      {/* Nome curto em cima de quem se mexe agora */}
      {(() => {
        const vis: {id: string; x: number; y: number; k: number; txt: string; cor: string}[] = [];
        for (const pl of PLANOS) {
          const m = pl.vai!;
          const k = rampa(t, pl.dito - 0.05, pl.dito + 0.3) * (1 - rampa(t, m.a + m.d + 0.2, m.a + m.d + 0.6));
          if (k <= 0.01) continue;
          const e = estado(pl, t);
          const pj = projetar([e.pos[0], e.pos[1] + 1.05, e.pos[2]], cam, W, H);
          if (!pj.visivel) continue;
          let y = pj.y;
          for (const o of vis) if (Math.abs(o.x - pj.x) < 280 && Math.abs(o.y - y) < 48) y = o.y - 50;
          vis.push({id: pl.p.id, x: pj.x, y, k, txt: pl.p.curto, cor: corGrupo(tema, pl.p.g)});
        }
        return vis.map((v) => <React.Fragment key={v.id}>{rotulo(v.x, v.y, v.txt, v.k, v.cor)}</React.Fragment>);
      })()}
      {/* Cartão de nomes (a lista para consultar) */}
      {cartao > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, width: SEGURO.botoesX - SEGURO.esq, top: 1136, opacity: cartao}}>
          <div style={{padding: '12px 20px 10px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`}}>
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginBottom: 6}}>{ESTADOS[e][1]} · DIÁRIO OFICIAL Nº 260</div>
            {linhas.map((pl, i) => {
              const k = rampa(t, pl.dito, pl.dito + 0.3);
              const sub =
                pl.p.g === 'troca'
                  ? `DEC. ${pl.p.de![2]}/${pl.p.para![2]} · ${orgaoNome(pl.p.de)} → ${orgaoNome(pl.p.para)}`
                  : pl.p.g === 'chega'
                    ? `DEC. ${pl.p.para![2]} · NOMEADO(A): ${orgaoNome(pl.p.para)}`
                    : `DEC. ${pl.p.de![2]} · EXONERADO(A): ${orgaoNome(pl.p.de)}`;
              return (
                <div key={pl.p.id} style={{display: 'flex', gap: 12, alignItems: 'flex-start', padding: '5px 0', opacity: (i === 0 ? 1 : 0.55) * k, transform: `translateY(${(1 - k) * -12}px)`}}>
                  <span style={{marginTop: 9, width: 12, height: 12, flex: 'none', borderRadius: 6, background: corGrupo(tema, pl.p.g)}} />
                  <div style={{minWidth: 0}}>
                    <div style={{fontFamily: FONTE, fontSize: 25, fontWeight: 800, color: tema.texto, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{pl.p.nome}</div>
                    <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 0.5, color: tema.textoSuave, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* Cena 8 */}
      {kDuvida > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kDuvida * 1.3)}}>
          <Chip tema={tema} texto="SEM NOVA NOMEAÇÃO ≠ SAÍDA DEFINITIVA" k={kDuvida} tam={28} />
        </div>
      ) : null}
      {kSemSec > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kSemSec * 1.3)}}>
          <Chip tema={tema} texto="SAÚDE E SERVIÇOS URBANOS: SEM SECRETÁRIO NOMEADO" k={kSemSec} tam={24} destaque />
        </div>
      ) : null}
      {t > T.hermano - 0.1 && t < T.salva ? rotulo(W / 2, 1000, 'HERMANO FAHNING · INTERINO', rampa(t, T.hermano, T.hermano + 0.4) * (1 - rampa(t, T.salva - 0.35, T.salva)), tema.cartaoBorda) : null}
      {kSemDec > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kSemDec * 1.3)}}>
          <Chip tema={tema} texto="AINDA SEM DECRETO" k={kSemDec} tam={30} />
        </div>
      ) : null}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {/* Final */}
      {t > T.salva - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.salva, T.salva + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SALVA PRA CONSULTAR OS NOMES</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8, opacity: rampa(t, T.informacoes, T.informacoes + 0.4)}}>PARA MAIS INFORMAÇÕES</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.22}));
  s.push({t: T.n53, f: 'subida', v: 0.26});
  s.push({t: T.rompimento, f: 'baque', v: 0.26});
  [T.e53, T.n51].forEach((t) => s.push({t, f: 'pop', v: 0.28}));
  [T.exonerada, T.nomeada].forEach((t) => s.push({t, f: 'baque', v: 0.24}));
  [T.g25, T.g26, T.g28].forEach((t) => s.push({t, f: 'pop', v: 0.26}));
  // Um "pop" baixinho em cada chegada (a cadeira ocupada); nas listas rápidas fica abaixo de 0,2.
  PLANOS.forEach((pl) => s.push({t: pl.chega - 0.05, f: pl.p.g === 'fora' ? 'tique' : 'pop', v: 0.16}));
  s.push({t: T.semSec, f: 'ding', v: 0.24});
  s.push({t: T.tabuleiro, f: 'bip', v: 0.2});
  s.push({t: T.salva, f: 'ding', v: 0.26});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.4, T.n53 + 1.2, T.todos + 0.4, T.edicao + 0.6, T.rompimento + 1.0, T.jabes + 0.8, T.n51 + 0.9, T.soTrocou + 0.9, T.nomeada + 0.6, T.g28 + 0.8,
  tDiz('vinicius') + 0.8, tDiz('wanessa') + 0.7, tDiz('fabricio') + 0.7, tDiz('antonio') + 0.9, T.humbertoDito + 2.0, tDiz('railane') + 1.6, tDiz('bruno') + 0.6, T.trocaramLugar + 0.6,
  tDiz('regis') + 3.5, T.alemDe + 0.6, tDiz('jackeline') + 0.8, tDiz('francielle') + 0.8, tDiz('rigerson') + 0.9, tDiz('sayonara') + 0.8, tDiz('bruna') + 2.5, tDiz('weslly') + 0.8,
  tDiz('felipeP') + 1.2, T.naoQuer + 0.6, T.semSec + 0.8, T.semDecreto + 0.3, T.salva + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const MudancasIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  // Sem desfoque de profundidade (aprendizado 003): tudo nítido; só o borrado leve na troca de cena.
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={360} sombraArea={34} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Mudanças em Ilhéus" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Ilhéus: 53', 'exonerações.', 'Quem ficou', 'de fora?'];
export const CapaMudancasIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · MUDANÇAS EM ILHÉUS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
