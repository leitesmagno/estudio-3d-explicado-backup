import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Onda, Palco, Particulas, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai, k01} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Trilha, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Cadeira, DiarioOficial, Fantasma, OrgaoPublico} from '../../pecas';
import {Cadeirinha, Calcada, Cerca, Interrogacao, PlacaOrgao, PortaoPlaca, Tablado} from '../mudancasilheus/pecas';
import {PALAVRAS} from './palavras';

// 028. ilhéus volta atrás (perfil @eumagnoleite, série Magno Explica). Continuação do 009.
// Mesma praça do 009, uma semana depois: começa como o 009 terminou. Diário Oficial nº 264 torna sem efeito
// os decretos 670 (Sonilda), 680 (Nal) e 627 (Fabrício). Correções (republicações) e duas nomeações novas.
// Pessoas reais só como boneco genérico sem rosto. Plano: projetos/028. ilhéus volta atrás/plano.md (aprovado em 05/11/2026).

export const FPS = 30;
const AUDIO_SEG = 72.54;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '028. ilhéus volta atrás';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  voltou: 0,
  secSaude: quando('secretária de Saúde ficou'),
  ficou: quando('ficou'),
  nal1: quando('vereador Nal não'),
  naoVai: quando('não vai mais'),
  diario: quando('Diário Oficial'),
  data: quando('4 de novembro'),
  n264: quando('264'),
  valderico: quando('Valderico'),
  semEfeito: quando('tornou sem efeito'),
  tres: quando('três decretos'),
  passada: quando('semana passada'),
  primeiro: quando('Primeiro'),
  exoSon: quando('exoneração de Sonilda'),
  mello: quando('Mello'),
  continua: quando('Ela continua'),
  assinou: quando('assinou'),
  segundo: quando('Segundo'),
  nomEd: quando('nomeação de Ednaldo'),
  ednaldo: quando('Ednaldo'),
  nal2: quando('vereador Nal para'),
  autarquia: quando('Autarquia de Transporte'),
  semNom: quando('Sem a nomeação'),
  segueCam: quando('segue na Câmara'),
  terceiro: quando('Terceiro'),
  fabricio: quando('Fabrício'),
  doTransito: quando('do Trânsito'),
  ouSeja: quando('Ou seja'),
  continuaDir: quando('continua na direção'),
  repara: quando('Mas repara'),
  maramata: quando('Maramata'),
  anulada: quando('não foi anulada'),
  doisDec: quando('dois decretos'),
  correcao: quando('E teve correção'),
  thaise: quando('Thaise'),
  foto: quando('fotografia'),
  republicado: quando('foi republicado'),
  chefe: quando('chefe da Divisão'),
  saidas: quando('As saídas'),
  bruna: quando('Bruna'),
  lucas: quando('Lucas'),
  juliana: quando('Juliana Amaral'),
  fernando: quando('Fernando'),
  republicadas: quando('foram republicadas'),
  d31: quando('31 de outubro'),
  quemChegou: quando('Quem chegou'),
  beatriz: quando('Beatriz'),
  assessora: quando('assessora de gabinete'),
  cezio: quando('Cézio'),
  creche: quando('creche Dom'),
  falta: quando('o que ainda falta'),
  hermano: quando('Hermano'),
  naoSaiu: quando('não saiu'),
  salva: quando('Salva esse'),
  arroba: quando('@eumagnoleite'),
  info: quando('mais informações'),
};

const ESTADOS: [number, string][] = [
  [0, 'VOLTOU ATRÁS'],
  [T.diario - 0.4, 'DIÁRIO OFICIAL Nº 264'],
  [T.primeiro - 0.2, '1. SAÚDE'],
  [T.segundo - 0.2, '2. TRÂNSITO'],
  [T.terceiro - 0.2, '3. TRÂNSITO E MARAMATA'],
  [T.correcao - 0.1, 'CORREÇÕES'],
  [T.quemChegou - 0.1, 'CHEGARAM'],
  [T.falta - 0.2, 'AINDA FALTA'],
  [T.salva - 0.1, 'SALVA ESTE VÍDEO'],
];

// ---------- Praça (igual ao 009) ----------
type Ilha = {x: number; z: number; linhas: string[]};
const DX = 5.6;
const DZ = 5.6;
const fila = (r: number) => -DZ * 3 + DZ * r;
const ILHAS = {
  gab: {x: -DX, z: fila(0), linhas: ['GABINETE', 'ASSESSORIAS']},
  casa: {x: 0, z: fila(0), linhas: ['CASA CIVIL']},
  vice: {x: DX, z: fila(0), linhas: ['GABINETE', 'DA VICE']},
  proc: {x: -DX, z: fila(1), linhas: ['PROCURADORIA']},
  ctrl: {x: 0, z: fila(1), linhas: ['CONTROLADORIA']},
  faz: {x: DX, z: fila(1), linhas: ['FAZENDA']},
  ri: {x: -DX, z: fila(2), linhas: ['RELAÇÕES', 'INSTITUCIONAIS']},
  int: {x: 0, z: fila(2), linhas: ['INTERIOR']},
  proj: {x: DX, z: fila(2), linhas: ['GABINETE', 'PROJETOS']},
  edu: {x: -DX, z: fila(3), linhas: ['EDUCAÇÃO']},
  mul: {x: 0, z: fila(3), linhas: ['POLÍTICAS', 'P/ MULHERES']},
  prom: {x: DX, z: fila(3), linhas: ['PROMOÇÃO', 'SOCIAL']},
  tran: {x: -DX, z: fila(4), linhas: ['TRÂNSITO']},
  mara: {x: 0, z: fila(4), linhas: ['MARAMATA']},
  cult: {x: DX, z: fila(4), linhas: ['CULTURA']},
  saude: {x: -DX, z: fila(5), linhas: ['SAÚDE']},
  serv: {x: 0, z: fila(5), linhas: ['SERVIÇOS', 'URBANOS']},
  dese: {x: DX, z: fila(5), linhas: ['DESENV.', 'ECONÔMICO']},
  tur: {x: -DX, z: fila(6), linhas: ['TURISMO']},
  com: {x: 0, z: fila(6), linhas: ['GABINETE', 'COMUNICAÇÃO']},
  infra: {x: DX, z: fila(6), linhas: ['INFRAESTRUTURA']},
} satisfies Record<string, Ilha>;
type IlhaId = keyof typeof ILHAS;
const IDS = Object.keys(ILHAS) as IlhaId[];
const SEM_CHEFE = new Set<IlhaId>(['gab', 'vice', 'proj', 'com']);

const LARG = 3.2;
const PROF = 3.0;
const CERCA_X = 9;
const CERCA_Z0 = -19.8;
const CERCA_Z1 = 19.8;
const PORTAO_Z = (fila(3) + fila(4)) / 2;
const ENTRADA: V3 = [-CERCA_X, 0, PORTAO_Z];
const SAIDA: V3 = [CERCA_X, 0, PORTAO_Z];
const PREFEITURA: V3 = [0, 0, -25];
const CAMARA: V3 = [-16.4, 0, -3.2];
const PORTA_CAMARA: V3 = [-14.4, 0.05, -3.2];
const ESC = 0.42;
const AZUL = (t: Tema) => (t.festa ?? ESCURO.festa!).azul;
const cinza = (t: Tema) => mistura(t.pessoa, mistura(t.objetoEscuro, t.objeto, 0.4), 0.7);

// Lugares: cadeira grande na frente (z+) e 6 cadeirinhas em 2 fileiras de 3.
const chefeDe = (id: IlhaId) => {
  const il = ILHAS[id];
  return {cadeira: [il.x, 0.12, il.z + 0.82] as V3, frente: [il.x, 0.12, il.z + 1.24] as V3};
};
const lugarDe = (id: IlhaId, j: number) => {
  const il = ILHAS[id];
  const x = il.x + ((j % 3) - 1) * 0.86;
  const z = il.z - 0.18 - Math.floor(j / 3) * 0.84;
  return {cadeira: [x, 0.12, z] as V3, frente: [x, 0.12, z + 0.34] as V3};
};
// Fila de quem chega (esquerda) e calçada de quem ficou de fora (direita), 7 colunas.
const bloco = (lado: 1 | -1, i: number): V3 => [lado * (CERCA_X + 1.8 + (i % 7) * 0.8), 0.08, PORTAO_Z - 1.2 + Math.floor(i / 7) * 0.8];

// Cadeiras reservadas aos personagens (não recebem boneco neutro).
const RESERVA: Record<string, true> = {'com|1': true, 'com|2': true, 'mul|5': true, 'edu|5': true};
const NEUTROS: V3[] = (() => {
  const out: V3[] = [];
  IDS.forEach((id, n) => {
    if (!SEM_CHEFE.has(id) && !['saude', 'serv', 'tran', 'mara'].includes(id)) out.push(chefeDe(id).frente);
    for (let j = 0; j < 6; j++) {
      if (RESERVA[`${id}|${j}`]) continue;
      if ((n * 7 + j * 3) % 5 === 0) continue;
      out.push(lugarDe(id, j).frente);
    }
  });
  return out;
})();
// Calçada: quem ficou de fora no 009 e continua fora (bonecos neutros cinza), mais os personagens.
const CALC = {sonilda: 0, bruna: 3, lucas: 4, juliana: 5, fernando: 6};
const CALC_NEUTROS = [1, 2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// ---------- Movimentos ----------
type Seg = {de: V3; para: V3; a: number; d: number; alto: number};
const angDe = (de: V3, para: V3) => Math.atan2(para[0] - de[0], para[2] - de[2]);
const misturaAng = (a: number, b: number, k: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * k;
};
type Estado = {pos: V3; rot: number; passo: number; voa: number};
const andar = (segs: Seg[], t: number, rotIni: number, rotFim: number): Estado => {
  let pos = segs[0].de;
  let rot = rotIni;
  for (const m of segs) {
    if (t < m.a) break;
    const s = rampa(t, m.a, m.a + m.d);
    if (s < 1) {
      const dir = angDe(m.de, m.para);
      return {pos: curva(m.de, m.para, m.alto, s), rot: misturaAng(rot, dir, k01(s / 0.15)), passo: Math.sin(s * Math.PI * 4), voa: Math.sin(s * Math.PI)};
    }
    pos = m.para;
    rot = dir0(m);
  }
  if (t >= segs[segs.length - 1].a + segs[segs.length - 1].d) rot = misturaAng(rot, rotFim, rampa(t, segs[segs.length - 1].a + segs[segs.length - 1].d, segs[segs.length - 1].a + segs[segs.length - 1].d + 0.3));
  return {pos, rot, passo: 0, voa: 0};
};
const dir0 = (m: Seg) => angDe(m.de, m.para);
const fim = (segs: Seg[]) => segs[segs.length - 1].a + segs[segs.length - 1].d;

const SONILDA: Seg[] = [
  {de: bloco(1, CALC.sonilda), para: [SAIDA[0], 0.05, SAIDA[2]], a: T.continua, d: 0.7, alto: 0.6},
  {de: [SAIDA[0], 0.05, SAIDA[2]], para: chefeDe('saude').frente, a: T.continua + 0.7, d: 1.3, alto: 3.2},
];
const NAL: Seg[] = [
  {de: chefeDe('tran').frente, para: [ENTRADA[0], 0.05, ENTRADA[2]], a: T.segueCam, d: 0.8, alto: 1.0},
  {de: [ENTRADA[0], 0.05, ENTRADA[2]], para: PORTA_CAMARA, a: T.segueCam + 0.8, d: 1.1, alto: 1.4},
];
const FABRICIO: Seg[] = [{de: chefeDe('mara').frente, para: chefeDe('tran').frente, a: T.continuaDir, d: 1.0, alto: 1.8}];
const THAISE: Seg[] = [{de: lugarDe('com', 1).frente, para: lugarDe('com', 2).frente, a: T.chefe, d: 0.7, alto: 0.7}];
const BEATRIZ: Seg[] = [{de: bloco(-1, 0), para: lugarDe('mul', 5).frente, a: T.beatriz + 0.05, d: 1.4, alto: 2.4}];
const CEZIO: Seg[] = [{de: bloco(-1, 1), para: lugarDe('edu', 5).frente, a: T.cezio + 0.05, d: 1.3, alto: 2.0}];

const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));

// Folhas de decreto em pé na frente do Diário (cena 2) e o voo de cada uma até o tablado dela.
const FOLHAS: {n: number; x: number; a: number; voa: number; alvo: V3}[] = [
  {n: 670, x: -2.6, a: T.tres, voa: T.primeiro, alvo: [bloco(1, 0)[0], 2.4, bloco(1, 0)[2]]},
  {n: 680, x: 0, a: T.tres + 0.3, voa: T.segundo, alvo: [chefeDe('tran').cadeira[0], 2.2, chefeDe('tran').cadeira[2]]},
  {n: 627, x: 2.6, a: T.tres + 0.6, voa: T.terceiro, alvo: [chefeDe('tran').cadeira[0], 2.2, chefeDe('tran').cadeira[2]]},
];
const FOLHA_Y = 5.2;
const FOLHA_Z = -15.2;

// ---------- Peças deste vídeo ----------
// Folha de decreto em pé (frente em z+): "DECRETO Nº n" e o carimbo SEM EFEITO por cima.
const FolhaDecreto: React.FC<{tema: Tema; pos: V3; n: number; esc: number; carimbo: number; rotY?: number}> = ({tema, pos, n, esc, carimbo, rotY = 0}) => {
  if (esc < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={esc}>
      <Caixa args={[1.6, 2.1, 0.05]} raio={0.03} cor={tema.objetoClaro} position={[0, 0, 0]} />
      <Placa tema={tema} pos={[0, 0.62, 0.03]} larg={1.4} alt={0.5} linhas={[{t: 'DECRETO', tam: 150, cor: tema.tinta, peso: 900, mono: true}, {t: `Nº ${n}`, tam: 190, cor: tema.tinta, peso: 900, mono: true}]} brilho={0.15} />
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[1.2 - (i % 2) * 0.3, 0.05, 0.01]} raio={0.01} cor={mistura(tema.objetoClaro, tema.tinta, 0.35)} position={[0, 0.1 - i * 0.2, 0.03]} />
      ))}
      {carimbo > 0.01 ? (
        <group position={[0, -0.4, 0.06]} rotation={[0, 0, 0.22]} scale={0.4 + 0.6 * carimbo}>
          <Caixa args={[1.5, 0.5, 0.03]} raio={0.04} cor={tema.acento} emissivo={0.35} position={[0, 0, 0]} />
          <Placa tema={tema} pos={[0, 0, 0.02]} larg={1.4} alt={0.42} linhas={[{t: 'SEM EFEITO', tam: 210, cor: tema.fundo, peso: 900, mono: true}]} brilho={0.5} />
        </group>
      ) : null}
    </group>
  );
};

// Carimbo antigo (EXONERADA, NOMEADO) que ganha um risco e o SEM EFEITO por cima.
const Carimbo: React.FC<{tema: Tema; pos: V3; texto: string; k1: number; k2: number; escala?: number}> = ({tema, pos, texto, k1, k2, escala = 1.0}) => {
  if (k1 < 0.02) return null;
  return (
    <group position={pos} scale={escala}>
      <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={[texto]} escala={k1} alto={1.5} />
      {k2 > 0.02 ? (
        <>
          <mesh position={[0, 1.75 * k1, 0.07]} rotation={[0, 0, 0.32]} scale={[k2, 1, 1]}>
            <boxGeometry args={[1.45, 0.07, 0.02]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.4} />
          </mesh>
          <group position={[0, 0.72, 0.12]}>
            <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['SEM EFEITO']} aceso={1} escala={k2 * 1.05} alto={1.55} />
          </group>
        </>
      ) : null}
    </group>
  );
};

// Folha de calendário em pé (frente em z+).
const Calendario31: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={k} rotation={[0, 0.5, 0]}>
      <Caixa args={[0.08, 0.9, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.45, -0.05]} />
      <Caixa args={[1.3, 1.4, 0.06]} raio={0.04} cor={tema.objetoClaro} position={[0, 1.6, 0]} />
      <Caixa args={[1.3, 0.38, 0.07]} raio={0.04} cor={tema.acento} emissivo={0.3} position={[0, 2.12, 0.01]} />
      <Placa tema={tema} pos={[0, 2.12, 0.05]} larg={1.2} alt={0.34} linhas={[{t: 'OUTUBRO', tam: 200, cor: tema.fundo, peso: 900, mono: true}]} brilho={0.4} />
      <Placa tema={tema} pos={[0, 1.42, 0.04]} larg={1.1} alt={0.9} linhas={[{t: '31', tam: 700, cor: tema.tinta, peso: 900}]} brilho={0.15} />
    </group>
  );
};

// ---------- Mundo ----------
const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const azul = AZUL(tema);
  const gris = cinza(tema);
  // Diário Oficial gigante e as três folhas (cena 2).
  const dk = rampa(t, T.diario - 0.3, T.diario + 0.8, sai) * (1 - rampa(t, T.primeiro + 1.2, T.primeiro + 2.0));
  const destaque = rampa(t, T.n264, T.n264 + 0.5);
  // Personagens.
  const eSon = andar(SONILDA, t, -Math.PI / 2, 0);
  const eNal = andar(NAL, t, 0, -Math.PI / 2);
  const someNal = 1 - rampa(t, fim(NAL) - 0.1, fim(NAL) + 0.5);
  const eFab = andar(FABRICIO, t, 0, 0);
  const eTha = andar(THAISE, t, 0, 0);
  const eBea = andar(BEATRIZ, t, Math.PI / 2, 0);
  const eCez = andar(CEZIO, t, Math.PI / 2, 0);
  // Luzes.
  const camaraLuz = Math.max(janela(t, T.nal2, fim(NAL) + 1.0), 0.15);
  const entradaLuz = Math.max(janela(t, T.segueCam, fim(NAL)), janela(t, T.quemChegou, fim(CEZIO) + 0.3));
  const saidaLuz = janela(t, T.continua - 0.2, T.continua + 1.2);
  const calcLuz = janela(t, T.saidas, T.quemChegou - 0.3);
  const ilhaLuz = (id: IlhaId) => {
    let v = 0;
    if (id === 'saude') v = Math.max(janela(t, T.secSaude, T.diario - 0.4), janela(t, T.primeiro, T.segundo - 0.3));
    if (id === 'tran') v = Math.max(janela(t, T.nal1, T.diario - 0.4), janela(t, T.segundo, T.correcao - 0.3));
    if (id === 'mara') v = janela(t, T.fabricio, T.correcao - 0.3);
    if (id === 'com') v = janela(t, T.thaise, T.saidas);
    if (id === 'mul') v = janela(t, T.beatriz, T.falta - 0.3);
    if (id === 'edu') v = janela(t, T.cezio, T.falta - 0.3);
    if (id === 'serv') v = janela(t, T.falta, T.salva);
    return v;
  };
  // Saúde: "?" do 009 vira a placa FICOU no gancho.
  const kInterSaude = 0.9 * (1 - rampa(t, T.ficou - 0.1, T.ficou + 0.4));
  const kFicou = entra(t, T.ficou, 0.45) * (1 - rampa(t, T.continua + 1.6, T.continua + 2.2));
  const kNaoVai = entra(t, T.naoVai, 0.45) * (1 - rampa(t, T.diario - 0.6, T.diario - 0.2));
  // Carimbos.
  const cSon = [entra(t, T.exoSon, 0.45), entra(t, T.mello, 0.45)] as const;
  const fimSon = 1 - rampa(t, fim(SONILDA) + 0.2, fim(SONILDA) + 0.7);
  const cNal = [entra(t, T.nomEd, 0.45), entra(t, T.semNom, 0.45)] as const;
  const fimNal = 1 - rampa(t, T.segueCam + 0.1, T.segueCam + 0.5);
  const cFab = [entra(t, T.doTransito, 0.45), entra(t, T.ouSeja, 0.45)] as const;
  const fimFab = 1 - rampa(t, fim(FABRICIO) + 0.2, fim(FABRICIO) + 0.7);
  const kPortaria = entra(t, T.assinou, 0.5) * (1 - rampa(t, T.segundo - 0.4, T.segundo));
  // Fabrício: tracejado na Maramata e as duas cadeiras.
  const kFant = rampa(t, T.maramata, T.maramata + 0.7) * (1 - rampa(t, T.correcao, T.correcao + 0.6));
  const k727 = entra(t, T.maramata + 0.15, 0.45) * (1 - rampa(t, T.correcao, T.correcao + 0.5));
  const duas = janela(t, T.doisDec, T.correcao - 0.1);
  // Thaise.
  const kFoto = entra(t, T.thaise, 0.45) * (1 - rampa(t, T.saidas - 0.4, T.saidas));
  const riscoFoto = rampa(t, T.foto, T.foto + 0.4);
  const kJorn = entra(t, T.chefe, 0.45) * (1 - rampa(t, T.saidas - 0.4, T.saidas));
  // Calçada: os quatro da Promoção Social acendem um por nome.
  const acendeCalc = (a: number) => janela(t, a, T.quemChegou - 0.3);
  const kCal = entra(t, T.d31, 0.5) * (1 - rampa(t, T.quemChegou, T.quemChegou + 0.5));
  // Hermano.
  const kHermano = 0.45 * (1 - rampa(t, T.salva + 0.5, T.salva + 1.3));
  const kCreche = entra(t, T.creche, 0.45) * (1 - rampa(t, T.falta, T.falta + 0.5));
  // Valderico na frente da Prefeitura.
  const kVal = entra(t, T.valderico - 0.2, 0.5) * (1 - rampa(t, T.primeiro, T.primeiro + 0.5));
  const placaTran = t >= T.autarquia ? ['AUTARQUIA', 'TRANSP. E TRÂNSITO'] : ILHAS.tran.linhas;
  const bonecoP = (key: string, e: Estado, cor: string, esc = ESC) => (
    <Boneco key={key} tema={tema} pos={e.pos} rotY={e.rot} escala={esc} cor={cor} pose={e.voa > 0 ? {passo: e.passo, ombroD: [0, 0, 0.5 + 0.9 * e.voa], ombroE: [0, 0, -0.5 - 0.9 * e.voa]} : undefined} />
  );
  const rastro = (key: string, segs: Seg[], cor: string) =>
    segs.map((m, i) => {
      const prog = rampa(t, m.a, m.a + m.d);
      const op = 1 - rampa(t, m.a + m.d + 0.3, m.a + m.d + 1.1);
      if (prog <= 0 || op <= 0) return null;
      const f = (s: number): V3 => {
        const q = curva(m.de, m.para, m.alto, s);
        return [q[0], q[1] + 0.12, q[2]];
      };
      return (
        <group key={`${key}${i}`}>
          <Trilha f={f} prog={prog} cor={cor} n={18} raio={0.045} opacidade={op * 0.9} />
          {i === segs.length - 1 ? <Onda pos={[m.para[0], m.para[1] + 0.02, m.para[2]]} k={rampa(t, m.a + m.d - 0.1, m.a + m.d + 0.9)} cor={cor} raio={0.6} /> : null}
        </group>
      );
    });
  const sobre = (p: V3, y = 1.15): V3 => [p[0], p[1] + y, p[2]];
  const cT = chefeDe('tran').cadeira;
  const cM = chefeDe('mara').cadeira;
  return (
    <>
      <Particulas t={t} centro={[0, 3, 0]} raio={18} n={40} />
      {/* Praça, cerca, portões e calçadas */}
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
      <group position={[-CERCA_X - 4.2, 0, PORTAO_Z + 2.6]} rotation={[0, Math.PI, 0]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['CHEGARAM']} escala={1.0} />
      </group>
      {/* Prefeitura */}
      <group position={PREFEITURA}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={1.8} sobe={1} letreiro={0} texto=" " />
        <group scale={1.8}>
          <mesh position={[0, 2.73, 1.185]}>
            <boxGeometry args={[2.56, 0.44, 0.02]} />
            <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.objeto, 0.2)} roughness={0.9} />
          </mesh>
          <Placa tema={tema} pos={[0, 2.73, 1.2]} larg={2.4} alt={0.4} linhas={[{t: 'PREFEITURA', tam: 210, cor: tema.objetoClaro, peso: 900}, {t: 'DE ILHÉUS', tam: 120, cor: tema.objetoClaro, peso: 700, mono: true}]} brilho={0.35} />
        </group>
      </group>
      {/* Câmara Municipal (fora da cerca, virada para a praça) */}
      <group position={CAMARA} rotation={[0, Math.PI / 2, 0]}>
        <OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={1.15} sobe={1} letreiro={0} texto=" " />
        <group scale={1.15}>
          <mesh position={[0, 2.73, 1.185]}>
            <boxGeometry args={[2.56, 0.44, 0.02]} />
            <meshStandardMaterial color={mistura(tema.objetoEscuro, tema.acento, 0.5 * camaraLuz)} emissive={tema.acento} emissiveIntensity={0.2 * camaraLuz} roughness={0.9} />
          </mesh>
          <Placa tema={tema} pos={[0, 2.73, 1.2]} larg={2.4} alt={0.4} linhas={[{t: 'CÂMARA', tam: 210, cor: tema.objetoClaro, peso: 900}, {t: 'MUNICIPAL', tam: 120, cor: tema.objetoClaro, peso: 700, mono: true}]} brilho={0.3 + 0.4 * camaraLuz} />
        </group>
      </group>
      {/* Tablados, cadeiras e placas */}
      {IDS.map((id) => {
        const il = ILHAS[id];
        const a = ilhaLuz(id);
        const chefe = chefeDe(id);
        const acesoChefe = id === 'tran' || id === 'mara' ? Math.max(a * 0.6, duas) : id === 'saude' ? a : 0;
        return (
          <group key={id}>
            <Tablado tema={tema} pos={[il.x, 0, il.z]} larg={LARG} prof={PROF} aceso={a} />
            <PlacaOrgao tema={tema} pos={[il.x, 0, il.z - PROF / 2 - 0.85]} linhas={id === 'tran' ? placaTran : il.linhas} aceso={a} escala={0.85} alto={1.5} />
            {!SEM_CHEFE.has(id) ? <Cadeira tema={tema} pos={chefe.cadeira} escala={0.55} aceso={acesoChefe} /> : null}
            {Array.from({length: 6}, (_, j) => (
              <Cadeirinha key={j} tema={tema} pos={lugarDe(id, j).cadeira} />
            ))}
          </group>
        );
      })}
      {/* Bonecos neutros (a praça cheia) */}
      {NEUTROS.map((p, i) => (
        <Boneco key={`n${i}`} tema={tema} pos={p} escala={ESC} cor={tema.pessoa} />
      ))}
      {CALC_NEUTROS.map((i) => (
        <Boneco key={`c${i}`} tema={tema} pos={bloco(1, i)} rotY={-Math.PI / 2} escala={ESC} cor={gris} />
      ))}
      {/* Personagens */}
      {bonecoP('sonilda', eSon, mistura(gris, tema.acento, rampa(t, T.mello, T.mello + 0.5)))}
      {someNal > 0.02 ? bonecoP('nal', eNal, mistura(azul, tema.acento, 0.6 * janela(t, T.nal1, T.segueCam + 2)), ESC * someNal) : null}
      {bonecoP('fabricio', eFab, mistura(tema.pessoa, tema.acento, janela(t, T.fabricio, T.correcao - 0.3)))}
      {bonecoP('thaise', eTha, mistura(tema.pessoa, tema.acento, janela(t, T.thaise, T.saidas)))}
      {(
        [
          ['bruna', T.bruna],
          ['lucas', T.lucas],
          ['juliana', T.juliana],
          ['fernando', T.fernando],
        ] as const
      ).map(([id, a]) => (
        <Boneco key={id} tema={tema} pos={bloco(1, CALC[id])} rotY={-Math.PI / 2} escala={ESC} cor={mistura(gris, tema.objetoClaro, 0.8 * acendeCalc(a))} />
      ))}
      {bonecoP('beatriz', eBea, azul)}
      {bonecoP('cezio', eCez, azul)}
      {rastro('son', SONILDA, tema.acento)}
      {rastro('nal', NAL, tema.acento)}
      {rastro('fab', FABRICIO, tema.acento)}
      {rastro('tha', THAISE, tema.acento)}
      {rastro('bea', BEATRIZ, azul)}
      {rastro('cez', CEZIO, azul)}
      {/* Hermano tracejado nos Serviços Urbanos, com "?" */}
      {kHermano > 0.01 ? (
        <Fantasma op={kHermano}>
          <Boneco tema={tema} pos={chefeDe('serv').frente} escala={ESC} cor={tema.objetoClaro} />
        </Fantasma>
      ) : null}
      <Interrogacao tema={tema} pos={sobre(chefeDe('serv').cadeira, 1.75)} k={0.55 + 0.35 * janela(t, T.falta, T.salva)} giro={0.35 * Math.sin(t * 0.8)} cor={tema.objetoClaro} />
      {/* Saúde: "?" vira FICOU */}
      <Interrogacao tema={tema} pos={sobre(chefeDe('saude').cadeira, 1.75)} k={kInterSaude} giro={0.35 * Math.sin(t * 0.8)} />
      <group position={[chefeDe('saude').cadeira[0], 0.1, chefeDe('saude').cadeira[2] + 0.2]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['FICOU']} aceso={1} escala={0.75 * kFicou} alto={1.6} />
      </group>
      <group position={[cT[0], 0.1, cT[2] + 0.2]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['NÃO VAI', 'MAIS']} escala={0.75 * kNaoVai} alto={1.6} />
      </group>
      {/* Carimbos que acompanham Sonilda e Nal; o do Fabrício fica na cadeira do Trânsito */}
      <Carimbo tema={tema} pos={sobre(eSon.pos, 0.55)} texto="EXONERADA" k1={cSon[0] * fimSon} k2={cSon[1] * fimSon} />
      <Carimbo tema={tema} pos={sobre(eNal.pos, 0.55)} texto="NOMEADO" k1={cNal[0] * fimNal} k2={cNal[1] * fimNal} />
      <Carimbo tema={tema} pos={[cT[0] + 0.9, 0.12, cT[2] + 0.3]} texto="EXONERADO" k1={cFab[0] * fimFab} k2={cFab[1] * fimFab} />
      {/* Portaria 462 que sobe da mesa da Sonilda */}
      {kPortaria > 0.01 ? (
        <group position={[chefeDe('saude').cadeira[0] + 1.0, 0.9 + 0.5 * kPortaria, chefeDe('saude').cadeira[2] + 0.4]} rotation={[0, -0.3, 0]} scale={0.55 * kPortaria}>
          <Caixa args={[1.6, 2.1, 0.05]} raio={0.03} cor={tema.objetoClaro} position={[0, 0, 0]} />
          <Placa tema={tema} pos={[0, 0.5, 0.03]} larg={1.4} alt={0.6} linhas={[{t: 'PORTARIA', tam: 150, cor: tema.tinta, peso: 900, mono: true}, {t: 'Nº 462', tam: 190, cor: tema.tinta, peso: 900, mono: true}]} brilho={0.15} />
          <Placa tema={tema} pos={[0, -0.45, 0.03]} larg={1.4} alt={0.4} linhas={[{t: 'SECRETÁRIA', tam: 120, cor: tema.tinta, peso: 700, mono: true}, {t: 'DE SAÚDE', tam: 120, cor: tema.tinta, peso: 700, mono: true}]} brilho={0.15} />
        </group>
      ) : null}
      {/* Fabrício tracejado na Maramata e o decreto 727 */}
      {kFant > 0.01 ? (
        <Fantasma op={0.45 * kFant}>
          <Boneco tema={tema} pos={chefeDe('mara').frente} escala={ESC} cor={tema.acento} />
        </Fantasma>
      ) : null}
      <group position={[cM[0] + 0.9, 0.12, cM[2] + 0.3]} scale={0.62}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['NOMEADO', 'DEC. 727']} escala={k727} alto={1.5} />
      </group>
      {duas > 0.01 ? (
        <mesh position={[(cT[0] + cM[0]) / 2, 0.16, cT[2] + 0.5]} scale={[duas, 1, 1]}>
          <boxGeometry args={[Math.abs(cM[0] - cT[0]), 0.04, 0.1]} />
          <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.4} />
        </mesh>
      ) : null}
      {/* Thaise: fotografia riscada, jornalismo aceso */}
      <group position={[lugarDe('com', 1).cadeira[0], 0.12, lugarDe('com', 1).cadeira[2] - 0.35]} scale={0.5}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['FOTOGRAFIA']} escala={kFoto} alto={1.9} />
        {riscoFoto > 0.01 && kFoto > 0.02 ? (
          <mesh position={[0, 2.15 * kFoto, 0.07]} rotation={[0, 0, 0.3]} scale={[riscoFoto * kFoto, 1, 1]}>
            <boxGeometry args={[1.45, 0.08, 0.02]} />
            <meshStandardMaterial color={tema.acento} emissive={tema.acento} emissiveIntensity={0.4} />
          </mesh>
        ) : null}
      </group>
      <group position={[lugarDe('com', 2).cadeira[0] + 0.15, 0.12, lugarDe('com', 2).cadeira[2] - 0.35]} scale={0.5}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['CHEFE', 'JORNALISMO']} aceso={1} escala={kJorn} alto={3.1} />
      </group>
      {/* Calendário 31 de outubro na calçada */}
      <Calendario31 tema={tema} pos={[CERCA_X + 1.6, 0.08, PORTAO_Z + 2.4]} k={kCal} />
      {/* Creche Dom Eduardo, ao lado da Educação */}
      <group position={[ILHAS.edu.x - LARG / 2 - 0.7, 0, ILHAS.edu.z + 0.4]}>
        <PlacaOrgao tema={tema} pos={[0, 0, 0]} linhas={['CRECHE', 'DOM EDUARDO']} aceso={0.5 * kCreche} escala={0.75 * kCreche} alto={0.8} />
      </group>
      {/* Valderico (boneco genérico) na frente da Prefeitura */}
      <Boneco tema={tema} pos={[-3.6, 0.07, -21]} rotY={0.3} escala={0.75 * kVal} cor={tema.pessoa} />
      {/* Diário Oficial gigante e as três folhas */}
      {dk > 0.01 ? (
        <group position={[0, 3.6 + 9 * (1 - dk), -19.6]} rotation={[1.0, 0, 0]} scale={4.2}>
          <DiarioOficial tema={tema} pos={[0, 0, 0]} escala={1} destaque={destaque} />
          <Placa tema={tema} pos={[0.01, 0.068, -0.47]} rot={[-Math.PI / 2, 0, 0]} larg={0.76} alt={0.12} linhas={[{t: 'DIÁRIO OFICIAL', tam: 150, cor: tema.objetoClaro, peso: 900}]} brilho={0.4} />
          <Placa tema={tema} pos={[0.01, 0.068, -0.36]} rot={[-Math.PI / 2, 0, 0]} larg={0.76} alt={0.06} linhas={[{t: 'EDIÇÃO Nº 264 · 04/11/2026', tam: 90, cor: tema.tinta, peso: 800, mono: true}]} brilho={0.2 + 0.5 * rampa(t, T.data, T.data + 0.5)} />
        </group>
      ) : null}
      {FOLHAS.map((f) => {
        const nasce = entra(t, f.a, 0.5);
        const s = rampa(t, f.voa, f.voa + 1.1);
        const chega = 1 - rampa(t, f.voa + 1.0, f.voa + 1.4);
        const ini: V3 = [f.x, FOLHA_Y, FOLHA_Z];
        const pos = s > 0 ? curva(ini, f.alvo, 6, s) : ini;
        const esc = nasce * (s > 0 ? 1 - 0.6 * s : 1) * chega;
        return <FolhaDecreto key={f.n} tema={tema} pos={pos} n={f.n} esc={0.95 * esc} carimbo={entra(t, f.a + 0.25, 0.4)} rotY={s * 0.6} />;
      })}
    </>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const ST = (id: IlhaId): V3 => [ILHAS[id].x, 0.5, ILHAS[id].z];
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {
    ini: 0,
    arco: -0.12,
    chaves: [
      [0, E([0, 0, -1], 15, 28, [0.45, 1.4, 1])],
      [T.secSaude - 0.2, E([-3.5, 0.3, 6.5], 12, 13, [0.15, 1.15, 1])],
      [T.nal1 + 0.3, E([-5.6, 0.5, 8.4], 7.5, 9, [0.2, 1.0, 1])],
      [T.diario - 0.4, E([-5.6, 0.5, 8.4], 7, 8.5, [0.3, 0.95, 1])],
    ],
  },
  {
    ini: T.diario - 0.4,
    chaves: [
      [T.diario - 0.4, E([0, 3.4, -19.2], 8, 8, [0, 0.35, 1])],
      [T.n264 + 0.6, E([0, 3.4, -18.6], 8.5, 8, [0.05, 0.3, 1])],
      [T.semEfeito, E([-1, 3.6, -17], 10, 8.5, [0.08, 0.3, 1])],
      [T.primeiro - 0.4, E([0, 4.4, -16], 9.5, 6.5, [-0.08, 0.25, 1])],
    ],
  },
  {
    ini: T.primeiro - 0.3,
    chaves: [
      [T.primeiro - 0.3, E([11.6, 1.2, 2.4], 7.5, 6.5, [0.35, 0.75, 1])],
      [T.mello + 0.4, E([11.4, 1.4, 2.4], 6.5, 6, [0.25, 0.7, 1])],
      [T.continua + 0.5, E([2.5, 0.3, 7.0], 19, 12, [0.15, 1.2, 1])],
      [T.continua + 1.6, E([-2, 0.4, 9.5], 13, 9, [0.2, 1.05, 1])],
      [T.assinou, E([-5.0, 0.9, 12.0], 5.5, 4.8, [0.3, 0.6, 1])],
      [T.segundo - 0.4, E([-5.0, 0.9, 12.0], 5.2, 4.6, [0.15, 0.6, 1])],
    ],
  },
  {
    ini: T.segundo - 0.3,
    chaves: [
      [T.segundo - 0.3, E([-5.6, 1.0, 6.2], 6.5, 5.5, [0.15, 0.7, 1])],
      [T.nal2, E([-8.5, 0.8, 3.5], 13, 8, [0.25, 0.85, 1])],
      [T.autarquia + 0.3, E([-5.6, 1.2, 6.2], 6, 6, [0.05, 0.7, 1])],
      [T.segueCam - 0.1, E([-5.8, 1.2, 6.2], 6.5, 6.2, [-0.05, 0.7, 1])],
      [T.segueCam + 0.9, E([-9.5, 0.6, 2.5], 12, 8, [-0.15, 0.9, 1])],
      [T.terceiro - 0.4, E([-11.5, 0.8, 0.5], 9, 6.5, [-0.4, 0.75, 1])],
    ],
  },
  {
    ini: T.terceiro - 0.3,
    chaves: [
      [T.terceiro - 0.3, E([-2.8, 0.6, 6.2], 11, 6.5, [0, 0.75, 1])],
      [T.continuaDir + 1.0, E([-2.8, 0.6, 6.2], 10, 6.2, [0.08, 0.75, 1])],
      [T.repara + 0.2, E([-2.8, 0.4, 6.3], 10.5, 7.5, [0.0, 1.3, 1])],
      [T.doisDec, E([-2.8, 0.4, 6.4], 10, 7.5, [-0.06, 1.5, 1])],
      [T.correcao - 0.3, E([-2.8, 0.4, 6.4], 10, 7.5, [-0.1, 1.55, 1])],
    ],
  },
  {
    ini: T.correcao - 0.2,
    chaves: [
      [T.correcao - 0.2, E([0, 0.8, 16.6], 6.5, 5.5, [0.35, 0.8, 1])],
      [T.chefe + 0.8, E([0.2, 0.8, 16.4], 5.5, 5, [0.15, 0.75, 1])],
      [T.saidas - 0.1, E([12.6, 0.4, 2.8], 8.5, 6.5, [0.4, 0.85, 1])],
      [T.d31 + 0.3, E([12.0, 0.6, 3.2], 8.5, 6.5, [0.15, 0.75, 1])],
      [T.quemChegou - 0.3, E([12.0, 0.6, 3.2], 8, 6.2, [0.05, 0.75, 1])],
    ],
  },
  {
    ini: T.quemChegou - 0.2,
    arco: 0.06,
    chaves: [
      [T.quemChegou - 0.2, E([-11, 0.4, 2.0], 9, 7, [-0.5, 0.9, 1])],
      [T.beatriz + 0.3, E([-5.5, 0.3, 1.0], 14, 8, [-0.35, 1.0, 1])],
      [T.cezio + 0.2, E([-5.2, 0.4, 0.4], 11, 7.5, [-0.3, 0.95, 1])],
      [T.creche + 0.3, E([-6.0, 0.6, 0.0], 7.5, 6, [-0.2, 0.8, 1])],
      [T.falta - 0.3, E([-6.0, 0.6, 0.0], 7, 5.8, [-0.1, 0.8, 1])],
    ],
  },
  {
    ini: T.falta - 0.2,
    chaves: [
      [T.falta - 0.2, E([0, 0.8, 11.0], 9, 7, [0.1, 0.9, 1])],
      [T.hermano + 0.4, E([0, 1.0, 11.8], 5.5, 5, [0.15, 0.6, 1])],
      [T.salva - 0.4, E([0, 1.0, 11.8], 5.2, 4.8, [0.25, 0.6, 1])],
    ],
  },
  {ini: T.salva - 0.3, chaves: [[T.salva - 0.3, E([0, 0.6, 11.6], 7, 5.5, [0.2, 0.8, 1])], [FIM, E([0, 0, 0], 15, 31, [0, 2.4, 0.6])]]},
];
const cenaEm = (t: number) => {
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (CENAS[k].ini <= t) i = k;
  return i;
};
const camEm = (t: number): Cam => {
  const i = cenaEm(t);
  const c = CENAS[i];
  const f = i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM;
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (f - c.ini), {arco: c.arco ?? 0.08, grua: 0.03});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean; tam?: number};
const CHIPS: Txt[] = [
  {a: 0.15, b: T.diario - 0.4, texto: 'VOLTOU ATRÁS', destaque: true},
  {a: T.ficou, b: T.diario - 0.4, texto: 'SAÚDE: SONILDA FICOU'},
  {a: T.naoVai, b: T.diario - 0.4, texto: 'NAL: NÃO VAI MAIS PARA O TRÂNSITO'},
  {a: T.tres, b: T.primeiro - 0.2, texto: '3 DECRETOS SEM EFEITO', destaque: true},
  {a: T.anulada, b: T.doisDec, texto: 'DECRETO 727 NÃO FOI ANULADO'},
  {a: T.doisDec, b: T.correcao - 0.2, texto: 'NO PAPEL: OS 2 DECRETOS VALEM', destaque: true},
  {a: T.d31, b: T.quemChegou - 0.2, texto: 'VALEM DESDE 31/10', destaque: true},
  {a: T.naoSaiu, b: T.salva - 0.1, texto: 'AINDA SEM DECRETO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.n264, b: T.primeiro, texto: 'DIÁRIO OFICIAL DE ILHÉUS Nº 264 · 04/11/2026'},
  {a: T.assinou, b: T.segundo, texto: 'PORTARIA Nº 462 · DIÁRIO OFICIAL Nº 263 · 03/11/2026'},
  {a: T.maramata, b: T.correcao, texto: 'DECRETO 727 · DIÁRIO OFICIAL Nº 260 · 29/10/2026'},
  {a: T.naoSaiu, b: T.salva, texto: 'CONFERIDO NOS DIÁRIOS Nº 263 E 264'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Linha = {t: number; nome: string; sub: string; cor: 'acento' | 'azul' | 'cinza' | 'claro'};
const LINHAS: Linha[] = [
  {t: T.exoSon, nome: 'SONILDA SANTANA DE MELLO', sub: 'DEC. 670 SEM EFEITO · SEGUE SECRETÁRIA DE SAÚDE', cor: 'acento'},
  {t: T.ednaldo, nome: 'EDNALDO LOPES DE ARAÚJO FILHO (NAL)', sub: 'DEC. 680 SEM EFEITO · NOMEAÇÃO NO TRÂNSITO', cor: 'acento'},
  {t: T.fabricio, nome: 'MARCOS FABRÍCIO OLIVEIRA NASCIMENTO', sub: 'DEC. 627 SEM EFEITO · SEGUE NO TRÂNSITO', cor: 'acento'},
  {t: T.maramata, nome: 'MARCOS FABRÍCIO OLIVEIRA NASCIMENTO', sub: 'DEC. 727 (MARAMATA) · NÃO FOI ANULADO', cor: 'claro'},
  {t: T.thaise, nome: 'THAISE LISBOA VIEIRA', sub: 'DEC. 689 REPUBLICADO · CHEFE DA DIVISÃO DE JORNALISMO', cor: 'claro'},
  {t: T.bruna, nome: 'BRUNA LORENA DOS SANTOS ANDRADE', sub: 'DEC. 655 REPUBLICADO · EXONERAÇÃO VALE DESDE 31/10', cor: 'cinza'},
  {t: T.lucas, nome: 'LUCAS SANTOS DA ROCHA', sub: 'DEC. 660 REPUBLICADO · EXONERAÇÃO VALE DESDE 31/10', cor: 'cinza'},
  {t: T.juliana, nome: 'JULIANA TELES SANTOS DO AMARAL', sub: 'DEC. 661 REPUBLICADO · EXONERAÇÃO VALE DESDE 31/10', cor: 'cinza'},
  {t: T.fernando, nome: 'FERNANDO REIS DA SILVA', sub: 'DEC. 662 REPUBLICADO · EXONERAÇÃO VALE DESDE 31/10', cor: 'cinza'},
  {t: T.beatriz, nome: 'BEATRIZ DANTAS GONÇALVES NORA', sub: 'DEC. 754 · ASSESSORA III DE GABINETE · MULHERES', cor: 'azul'},
  {t: T.cezio, nome: 'CÉZIO GALO DE SOUZA', sub: 'DEC. 753 · VICE-DIRETOR · CRECHE DOM EDUARDO', cor: 'azul'},
  {t: T.hermano, nome: 'HERMANO FAHNING', sub: 'SERVIÇOS URBANOS · AINDA SEM DECRETO', cor: 'claro'},
];

const PLACAR: {rotulo: string; total: number; marcas: number[]; cor: 'acento' | 'claro' | 'azul'}[] = [
  {rotulo: 'SEM EFEITO', total: 3, marcas: [T.mello, T.semNom, T.ouSeja], cor: 'acento'},
  {rotulo: 'CORRIGIDOS', total: 5, marcas: [T.republicado, T.republicadas, T.republicadas + 0.25, T.republicadas + 0.5, T.republicadas + 0.75], cor: 'claro'},
  {rotulo: 'CHEGARAM', total: 2, marcas: [fim(BEATRIZ), fim(CEZIO)], cor: 'azul'},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const cor = (c: Linha['cor']) => (c === 'acento' ? tema.acento : c === 'azul' ? AZUL(tema) : c === 'cinza' ? cinza(tema) : tema.objetoClaro);
  const chip = CHIPS.filter((c) => t >= c.a && visivel(c, t) > 0.01);
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placar = rampa(t, T.tres, T.tres + 0.5) * (1 - rampa(t, T.salva - 0.3, T.salva));
  const cartao = rampa(t, T.exoSon, T.exoSon + 0.5) * (1 - rampa(t, T.salva - 0.3, T.salva));
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const linhas = LINHAS.filter((l) => l.t <= t + 0.05).slice(-2).reverse();
  const rotulo = (x: number, y: number, txt: string, k: number, c: string) => (
    <div style={{position: 'absolute', left: Math.max(SEGURO.esq + 160, Math.min(SEGURO.botoesX - 160, x)), top: Math.max(560, Math.min(1080, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 11, background: tema.cartao, border: `2px solid ${c}`, fontFamily: FONTE, fontSize: 26, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  // Nome em cima de cada personagem, na hora da fala.
  const eSon = andar(SONILDA, t, 0, 0).pos;
  const eNal = andar(NAL, t, 0, 0).pos;
  const eFab = andar(FABRICIO, t, 0, 0).pos;
  const eTha = andar(THAISE, t, 0, 0).pos;
  const eBea = andar(BEATRIZ, t, 0, 0).pos;
  const eCez = andar(CEZIO, t, 0, 0).pos;
  const rep = (a: number) => (t >= T.republicadas ? ' · REPUBLICADO' : '');
  const NOMES: {id: string; p: V3; a: number; b: number; txt: string; c: string}[] = [
    {id: 'nal1', p: eNal, a: T.nal1, b: T.diario - 0.4, txt: 'NAL', c: tema.acento},
    {id: 'val', p: [-3.6, 0, -21], a: T.valderico, b: T.primeiro - 0.3, txt: 'VALDERICO JÚNIOR · PREFEITO', c: tema.cartaoBorda},
    {id: 'son', p: eSon, a: T.exoSon + 0.3, b: T.segundo - 0.3, txt: 'SONILDA MELLO', c: tema.acento},
    {id: 'nal2', p: eNal, a: T.ednaldo, b: fim(NAL), txt: 'EDNALDO LOPES (NAL)', c: tema.acento},
    {id: 'fab', p: eFab, a: T.fabricio, b: T.correcao + 0.1, txt: 'FABRÍCIO NASCIMENTO', c: tema.acento},
    {id: 'fant', p: chefeDe('mara').frente, a: T.maramata + 0.2, b: T.correcao + 0.1, txt: 'MARAMATA · DEC. 727', c: tema.cartaoBorda},
    {id: 'tha', p: eTha, a: T.thaise, b: T.saidas - 0.2, txt: t >= T.republicado ? 'THAISE · REPUBLICADO' : 'THAISE', c: tema.acento},
    {id: 'bru', p: bloco(1, CALC.bruna), a: T.bruna, b: T.quemChegou - 0.3, txt: 'BRUNA' + rep(0), c: tema.objetoClaro},
    {id: 'luc', p: bloco(1, CALC.lucas), a: T.lucas, b: T.quemChegou - 0.3, txt: 'LUCAS' + rep(0), c: tema.objetoClaro},
    {id: 'jul', p: bloco(1, CALC.juliana), a: T.juliana, b: T.quemChegou - 0.3, txt: 'JULIANA AMARAL' + rep(0), c: tema.objetoClaro},
    {id: 'fer', p: bloco(1, CALC.fernando), a: T.fernando, b: T.quemChegou - 0.3, txt: 'FERNANDO' + rep(0), c: tema.objetoClaro},
    {id: 'bea', p: eBea, a: T.beatriz, b: T.falta - 0.3, txt: 'BEATRIZ NORA', c: AZUL(tema)},
    {id: 'cez', p: eCez, a: T.cezio, b: T.falta - 0.3, txt: 'CÉZIO GALO', c: AZUL(tema)},
    {id: 'her', p: chefeDe('serv').frente, a: T.hermano, b: T.salva - 0.2, txt: 'HERMANO FAHNING', c: tema.cartaoBorda},
  ];
  const vis: {id: string; x: number; y: number; k: number; txt: string; c: string}[] = [];
  for (const n of NOMES) {
    const k = rampa(t, n.a, n.a + 0.35) * (1 - rampa(t, n.b - 0.35, n.b));
    if (k <= 0.01) continue;
    const pj = projetar([n.p[0], n.p[1] + (n.id === 'val' ? 1.7 : 1.05), n.p[2]], cam, W, H);
    if (!pj.visivel) continue;
    let y = pj.y;
    for (const o of vis) if (Math.abs(o.x - pj.x) < 300 && Math.abs(o.y - y) < 50) y = o.y - 52;
    vis.push({id: n.id, x: pj.x, y, k, txt: n.txt, c: n.c});
  }
  return (
    <>
      {/* Placar fixo */}
      {placar > 0.01 ? (
        <div style={{position: 'absolute', top: 400, left: SEGURO.esq, right: W - SEGURO.dir, display: 'flex', justifyContent: 'center', gap: 12, opacity: placar}}>
          {PLACAR.map((g) => {
            const n = g.marcas.filter((m) => t >= m).length;
            const c = g.cor === 'azul' ? AZUL(tema) : g.cor === 'acento' ? tema.acento : tema.objetoClaro;
            return (
              <div key={g.rotulo} style={{display: 'flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 12, background: tema.cartao, border: `2px solid ${n >= g.total ? c : tema.cartaoBorda}`, fontFamily: MONO, fontSize: 21, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>
                <span style={{width: 14, height: 14, borderRadius: 7, background: c}} />
                {g.rotulo}
                <span style={{color: tema.texto, fontSize: 25}}>
                  {n}/{g.total}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
      {/* Chips */}
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
        {chip.map((c) => (
          <div key={c.texto} style={{opacity: Math.min(1, visivel(c, t) * 1.2)}}>
            <Chip tema={tema} texto={c.texto} k={entra(t, c.a, 0.45)} destaque={c.destaque} tam={c.tam ?? 30} />
          </div>
        ))}
      </div>
      {vis.map((v) => (
        <React.Fragment key={v.id}>{rotulo(v.x, v.y, v.txt, v.k, v.c)}</React.Fragment>
      ))}
      {/* Selo de fonte */}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: cartao > 0.01 ? 1088 : 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 18, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {/* Cartão de nomes */}
      {cartao > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, width: SEGURO.botoesX - SEGURO.esq, top: 1146, opacity: cartao}}>
          <div style={{padding: '12px 20px 10px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`}}>
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginBottom: 6}}>{ESTADOS[e][1]} · DIÁRIO OFICIAL Nº 264</div>
            {linhas.map((l, i) => {
              const k = rampa(t, l.t, l.t + 0.3);
              return (
                <div key={l.nome + l.t} style={{display: 'flex', gap: 12, alignItems: 'flex-start', padding: '5px 0', opacity: (i === 0 ? 1 : 0.55) * k, transform: `translateY(${(1 - k) * -12}px)`}}>
                  <span style={{marginTop: 9, width: 12, height: 12, flex: 'none', borderRadius: 6, background: cor(l.cor)}} />
                  <div style={{minWidth: 0}}>
                    <div style={{fontFamily: FONTE, fontSize: 25, fontWeight: 800, color: tema.texto, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{l.nome}</div>
                    <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 0.5, color: tema.textoSuave, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{l.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {/* Final */}
      {t > T.salva - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.salva, T.salva + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SALVA PRA CONSULTAR</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8, opacity: rampa(t, T.info, T.info + 0.4)}}>PARA MAIS INFORMAÇÕES</div>
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
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.2}));
  s.push({t: T.ficou, f: 'ding', v: 0.22});
  s.push({t: T.naoVai, f: 'baque', v: 0.22});
  s.push({t: T.n264, f: 'pop', v: 0.26});
  FOLHAS.forEach((f) => s.push({t: f.a + 0.25, f: 'impacto', v: 0.2}));
  [T.exoSon, T.nomEd, T.doTransito].forEach((t) => s.push({t, f: 'baque', v: 0.22}));
  [T.mello, T.semNom, T.ouSeja].forEach((t) => s.push({t, f: 'impacto', v: 0.26}));
  [fim(SONILDA), fim(FABRICIO), fim(THAISE), fim(BEATRIZ), fim(CEZIO)].forEach((t) => s.push({t: t - 0.05, f: 'pop', v: 0.2}));
  s.push({t: fim(NAL), f: 'tique', v: 0.2});
  s.push({t: T.assinou, f: 'pop', v: 0.2});
  s.push({t: T.doisDec, f: 'ding', v: 0.24});
  [T.republicado, T.republicadas].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.d31, f: 'pop', v: 0.22});
  s.push({t: T.naoSaiu, f: 'bip', v: 0.22});
  s.push({t: T.salva, f: 'ding', v: 0.26});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.5, T.ficou + 0.5, T.naoVai + 0.7, T.n264 + 0.6, T.valderico + 0.5, T.tres + 1.0, T.primeiro + 0.8, T.mello + 0.6, T.continua + 1.2, T.assinou + 0.8,
  T.nomEd + 0.6, T.autarquia + 0.6, T.semNom + 0.7, T.segueCam + 1.3, T.doTransito + 0.6, T.continuaDir + 1.2, T.maramata + 0.6, T.doisDec + 0.6,
  T.thaise + 0.6, T.chefe + 1.0, T.fernando + 0.4, T.d31 + 0.6, T.beatriz + 1.6, T.creche + 0.4, T.hermano + 0.5, T.naoSaiu + 0.8, T.salva + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const IlheusVolta: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
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
      <Marca tema={tema} serie={SERIE} assunto="Ilhéus volta atrás" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Ilhéus', 'voltou atrás.', 'Nal fora,', 'Saúde fica.'];
export const CapaIlheusVolta: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ILHÉUS VOLTA ATRÁS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
