import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, RoloCompactador} from '../../pecas';
import {BancoDivida, BaseDefesaCivil, CamaraVereadores, Escola, EstacaoSaneamento, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, PredioTCM, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {BaseGaveta, PastaProcesso, RuaPlaca} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 040. orçamento de anagé (perfil @eumagnoleite, série Magno Explica). MOLDE: 035 Paratinga.
// O Kit Mapas abre (voo até Anagé e o que a prefeitura arrecadou em 2024: projetos/040.../mapas/anage.mp4) e o Estúdio 3D
// monta a maquete redonda: o COFRE no meio e, em cada ano, a PILHA DO ANO em volta dele (1 pilha = R$ 2 milhões). Quando a voz
// fala um setor, as pilhas saem dali e voam para a casinha do setor. As casinhas ficam na borda NA ORDEM DA FALA, então a
// câmera anda sempre no mesmo sentido; na virada de ano ela sobe e recomeça.
// Sem porcentagem e sem nome de gestor. SÓ DADOS DE ANAGÉ, todos do TCM-BA: audio/fontes.md. Plano: plano.md.

export const FPS = 30;
const AUDIO_SEG = 177.13; // narração Google Chirp 3 HD Algenib, speakingRate 1,3, pausas 0,28 s, atempo 1,03, -15 LUFS
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '040. orçamento de anagé';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  ano24: quando('2024 A prefeitura'),
  arrec24: quando('arrecadou 98'),
  gastou24: quando('Gastou 97'),
  sobrou: quando('Sobraram quase'),
  ano25: quando('2025 Arrecadou'),
  arrec25: quando('Arrecadou 108'),
  gastou25: quando('Gastou 114', 2), // a 1ª vez é a frase de abertura ("Anagé gastou 114 milhões")
  falt25: quando('5 milhoes e 700 a mais'),
  ano26: quando('2026 ate julho'),
  arrec26: quando('Arrecadou 61'),
  gastou26: quando('Ja gastou'),
  falt26: quando('1 milhao e 200 a mais'),
  defesa: quando('Defesa civil tem'),
  animal: quando('Protecao animal'),
  repara: quando('Agora repara'),
  festas: quando('Com eventos e festas'),
  tresAnos: quando('Nos tres anos', 2), // a 1ª é "gasto zero nos três anos" (defesa civil)
  familias: quando('ajuda as familias'),
  prioridade: quando('Festa tambem e cultura'),
  asfalto: quando('E o asfalto'),
  plano: quando('O orcamento e o plano'),
  a630: quando('630 mil em 2024'),
  b630: quando('630 mil em 2025'),
  c520: quando('520 mil em 2026'),
  zero: quando('Gasto nessa linha'),
  limpeza: quando('Ja a limpeza'),
  terminou: quando('terminou com 4'),
  colegio: quando('O colegio de tempo'),
  agua: quando('a agua das comunidades'),
  governo: quando('Governo do Estado'),
  tribunal: quando('No Tribunal de Contas'),
  devolver: quando('ordem de devolver'),
  acima: quando('acima do contrato'),
  recurso: quando('Cabe recurso'),
  meses: quando('contas de todos os meses'),
  prazo: quando('fora do prazo'),
  licit: quando('Uma licitacao de calcamento'),
  pago: quando('nada foi pago'),
  gastar: quando('Gastar nao'),
  festaTodo: quando('dinheiro para festa'),
  asfZero: quando('linha do asfalto'),
  segue: quando('Segue o'),
};

// ---------- Os setores: 13 casinhas na borda da mesa, NA ORDEM EM QUE A VOZ FALA ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | 'defesa' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA, ESPORTE E LAZER', tipo: 'palco', texto: 'CULTURA E ESPORTE'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
  {id: 'def', nome: 'DEFESA CIVIL', tipo: 'defesa'},
  {id: 'ani', nome: 'PROTEÇÃO ANIMAL', tipo: 'casinha', texto: 'ANIMAIS'},
];
const R_PREDIO = 7.45;
const ZERADOS = ['def', 'ani'];
const ANGS: number[] = (() => {
  const a: number[] = [];
  let x = 0.12 * Math.PI;
  SETORES.forEach((s, i) => {
    a.push(x);
    const zeroAgora = ZERADOS.includes(s.id);
    const zeroProx = i + 1 < SETORES.length && ZERADOS.includes(SETORES[i + 1].id);
    x += zeroAgora && zeroProx ? 0.1 * Math.PI : zeroAgora || zeroProx ? 0.125 * Math.PI : 0.14 * Math.PI;
  });
  return a;
})();
const ang = (i: number) => (i % 1 === 0 ? ANGS[i] : ANGS[Math.floor(i)] + (ANGS[Math.ceil(i)] - ANGS[Math.floor(i)]) * (i % 1));
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi = 0): V3 => {
  const a = ang(i);
  const tan = [1.0, 1.85, 1.42][yi];
  const r = R_PREDIO - [0.45, 0.45, 1.5][yi];
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);

// ---------- Os três anos ----------
type Entrada = {s: string; t: number; v: number};
type Ano = {ini: number; fim: number; gastou: number; total: number; rotulo: string; entradas: Entrada[]; falta?: {t: number; v: number}};
const ANOS: Ano[] = [
  {
    ini: T.gastou24,
    fim: T.ano25,
    gastou: T.gastou24,
    total: 97.71,
    rotulo: '2024',
    entradas: [
      {s: 'edu', t: quando('Educacao'), v: 37.246},
      {s: 'sau', t: quando('Saude'), v: 21.753},
      {s: 'adm', t: quando('Administracao'), v: 9.265},
      {s: 'obr', t: quando('Obras e servicos'), v: 10.141},
      {s: 'cam', t: quando('Camara'), v: 3.22},
      {s: 'div', t: quando('Dividas'), v: 4.857},
      {s: 'cul', t: quando('Cultura'), v: 4.357},
      {s: 'ass', t: quando('Assistencia social'), v: 2.142},
      {s: 'agu', t: quando('Agua 440'), v: 0.444},
      {s: 'agr', t: quando('Agricultura'), v: 0.678},
      {s: 'mam', t: quando('Meio ambiente'), v: 3.608},
    ],
  },
  {
    ini: T.ano25 + 0.3,
    fim: T.ano26,
    gastou: T.gastou25,
    total: 114.21,
    rotulo: '2025',
    falta: {t: T.falt25, v: 5.72},
    entradas: [
      {s: 'edu', t: quando('Educacao', 2), v: 40.68},
      {s: 'sau', t: quando('Saude', 2), v: 26.219},
      {s: 'adm', t: quando('Administracao', 2), v: 11.927},
      {s: 'obr', t: quando('Obras e servicos', 2), v: 14.21},
      {s: 'cam', t: quando('Camara', 2), v: 3.995},
      {s: 'div', t: quando('Dividas', 2), v: 5.838},
      {s: 'cul', t: quando('Cultura', 2), v: 3.567},
      {s: 'ass', t: quando('Assistencia social', 2), v: 2.631},
      {s: 'agu', t: quando('Agua 530'), v: 0.526},
      {s: 'agr', t: quando('Agricultura', 2), v: 0.91},
      {s: 'mam', t: quando('Meio ambiente', 2), v: 3.709},
    ],
  },
  {
    ini: T.ano26 + 0.3,
    fim: T.defesa,
    gastou: T.gastou26,
    total: 62.23,
    rotulo: '2026 · ATÉ JUL',
    falta: {t: T.falt26, v: 1.19},
    entradas: [
      {s: 'edu', t: quando('Educacao', 3), v: 20.411},
      {s: 'sau', t: quando('Saude', 3), v: 15.817},
      {s: 'adm', t: quando('Administracao', 3), v: 7.355},
      {s: 'obr', t: quando('Obras e servicos', 3), v: 7.75},
      {s: 'cam', t: quando('Camara', 3), v: 2.449},
      {s: 'div', t: quando('Dividas', 3), v: 1.528},
      {s: 'cul', t: quando('Cultura', 3), v: 2.791},
      {s: 'ass', t: quando('Assistencia social', 3), v: 1.542},
      {s: 'agu', t: quando('Agua 320'), v: 0.321},
      {s: 'agr', t: quando('Agricultura', 3), v: 0.555},
      {s: 'mam', t: quando('Meio ambiente', 3), v: 1.714},
    ],
  },
];
const SOBE: Record<string, number> = Object.fromEntries(SETORES.map((s) => [s.id, ANOS[0].entradas.find((e) => e.s === s.id)?.t ?? (s.id === 'def' ? T.defesa : T.animal)]));
const valorDe = (id: string, yi: number) => ANOS[yi].entradas.find((e) => e.s === id)?.v ?? 0;
const ANO_SUB = ['2024', '2025', '2026 · ATÉ JUL'];
const FESTAS = [4.144, 3.432, 2.53]; // ação "eventos culturais, tradicionais e esportivos" (PCMGE015)

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

const ANDAR = 0.75;
const PASSO_T = 0.38;
const torre = (c: V3, n: number, lado: number, cor: string, passo = PASSO_T): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    const x = (k % lado) - (lado - 1) / 2;
    const z = Math.floor(k / lado) - (lado - 1) / 2;
    s.push({p: [c[0] + x * passo, c[1] + andar * ANDAR, c[2] + z * passo], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.ceil(n / (lado * lado) - 0.0005) * ANDAR;
const LADO = 3;
const ESCALA = 2; // 1 pilha = R$ 2 milhões
const PASSO_FINO = 0.27;
const altFina = (v: number) => Math.max(1, Math.ceil(v / ESCALA / (LADO * LADO) - 0.0005)) * ANDAR;
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, mistura(C.ouro, F.turquesa, 0.8), mistura(C.ouro, F.rosa, 0.8)];
};

// ---------- A pilha do ano em volta do cofre ----------
const LUGARES: V3[] = (() => {
  const s: {p: V3; a: number}[] = [];
  (
    [
      [1.75, 26],
      [2.25, 31],
      [2.75, 36],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r * 0.31;
      const rel = (a - (ANGS[0] - 0.12 * Math.PI) + Math.PI * 8) % (Math.PI * 2);
      s.push({p: [Math.sin(a) * r, 0, Math.cos(a) * r], a: rel});
    }
  });
  return s.sort((x, y) => x.a - y.a).map((x) => x.p);
})();
type Voo = {de: V3; para: V3; n: number; t0: number; yi: number};
const VOOS: Voo[][] = ANOS.map((y, yi) => {
  const v: Voo[] = [];
  let lugar = 0;
  const totalAno = y.entradas.reduce((a, e) => a + Math.ceil(e.v / ESCALA - 0.0005), 0);
  y.entradas.forEach((e) => {
    const n = e.v / ESCALA;
    if (n < 0.003) return;
    const i = idx(e.s);
    const fila = Math.ceil(n - 0.0005);
    for (let j = 0; j < fila; j++) {
      const c = posTorre(i, yi);
      const porAndar = LADO * LADO;
      const andar = Math.floor(j / porAndar);
      const k = j % porAndar;
      const para: V3 = [c[0] + ((k % LADO) - 1) * PASSO_FINO, andar * ANDAR, c[2] + (Math.floor(k / LADO) - 1) * PASSO_FINO];
      v.push({de: LUGARES[Math.floor((lugar * LUGARES.length) / totalAno) % LUGARES.length], para, n: Math.min(1, n - j), t0: e.t + 0.1 + j * 0.035, yi});
      lugar++;
    }
  });
  return v;
});

const SOME_DINHEIRO = (t: number) => 1 - rampa(t, T.asfalto - 0.2, T.asfalto + 0.6);
const FALTA_POS: V3 = [0, 0, 3.65];

// ---------- As gavetas do asfalto (3 anos) e da limpeza (2025), no miolo da mesa, depois que o cofre sai ----------
const ESC_OBRA = 0.2; // aqui, 1 pilha = R$ 200 mil
const GAV = {
  asf24: [-2.75, 0, 1.25] as V3,
  asf25: [-1.65, 0, 1.25] as V3,
  asf26: [-0.55, 0, 1.25] as V3,
  limp25: [1.75, 0, 1.25] as V3,
};
const OBRA = {asf24: {res: 0.633, usou: 0}, asf25: {res: 0.626, usou: 0}, asf26: {res: 0.523, usou: 0}, limp25: {res: 1.8, usou: 4.142}};
const LADO_G: Record<keyof typeof GAV, number> = {asf24: 2, asf25: 2, asf26: 2, limp25: 3};
const GAVETAS_VIS = (t: number) => vis(t, T.asfalto + 0.2, T.colegio + 0.9) + vis(t, T.gastar, FIM + 2);
const TCM_POS: V3 = [0, 0, -2.35];
type Carimbo = [number, string, 'alerta' | 'neutro'];
const PASTAS: {titulo: string; valor?: string; t: number; carimbos: Carimbo[]}[] = [
  {titulo: 'ACIMA DO CONTRATO', valor: 'R$ 3,8 MI', t: T.devolver, carimbos: [[T.devolver + 0.5, 'DEVOLVER', 'alerta'], [T.recurso, 'CABE RECURSO', 'neutro']]},
  {titulo: 'CONTAS DO MÊS', valor: '2024 A 2026', t: T.meses, carimbos: [[T.prazo, 'FORA DO PRAZO', 'alerta']]},
];
const posPasta = (i: number): V3 => [-1.05 + i * 2.1, 0, -0.45];
const PASTAS_VIS = (t: number) => vis(t, T.tribunal, T.gastar - 0.1);
const ANG_ESTADO = ANGS[ANGS.length - 1] + 0.22 * Math.PI;
const POS_ESTADO: V3 = [Math.sin(ANG_ESTADO) * 7.0, 0, Math.cos(ANG_ESTADO) * 7.0];

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; torres: Pilha[]} => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const torres: Pilha[] = [];
  const some = SOME_DINHEIRO(t);
  // a pilha de cada ano nasce em volta do cofre no "gastou" e cada pilha voa para o setor na palavra dele.
  // As torres que já chegaram à borda ficam até o fim (aprendizado do 051); só o que está no miolo some.
  ANOS.forEach((y, yi) => {
    VOOS[yi].forEach((v, j) => {
      const nasce = rampa(t, y.gastou + 0.1 + (j % 31) * 0.012, y.gastou + 0.7 + (j % 31) * 0.012);
      if (nasce <= 0.01) return;
      const k = rampa(t, v.t0, v.t0 + 0.75);
      if (k <= 0) {
        if (some > 0.01) torres.push({p: v.de, n: v.n * nasce * some, cor: CA[yi]});
      } else torres.push({p: k >= 1 ? v.para : curva(v.de, v.para, 2.4, k), n: v.n, cor: CA[yi]});
    });
  });
  if (some > 0.01) {
    // o que foi gasto a mais: torre vermelha na frente do cofre
    ANOS.forEach((y) => {
      if (!y.falta) return;
      const k = janela(t, y.falta.t, y.fim - 0.2, 0.5) * some;
      if (k > 0.01) solidas.push(...torre(FALTA_POS, (y.falta.v / ESCALA) * rampa(t, y.falta.t, y.falta.t + 0.9) * k, LADO, C.alerta));
    });
  }
  // gavetas: claro e transparente = reservado; cor do ano = usado. Aqui 1 pilha = R$ 200 mil
  const g = GAVETAS_VIS(t);
  if (g > 0.01) {
    const par = (chave: keyof typeof GAV, tRes: number, tUsou: number, cor: string) => {
      const o = OBRA[chave];
      const r = rampa(t, tRes, tRes + 0.6) * g;
      const u = rampa(t, tUsou, tUsou + 1.3) * g;
      if (r > 0.01) fantasmas.push(...torre(GAV[chave], (o.res / ESC_OBRA) * r, LADO_G[chave], tema.objetoClaro));
      if (u > 0.01 && o.usou > 0) solidas.push(...torre(GAV[chave], (o.usou / ESC_OBRA) * u, LADO_G[chave], cor));
    };
    par('asf24', T.a630, T.zero, CA[0]);
    par('asf25', T.b630, T.zero, CA[1]);
    par('asf26', T.c520, T.zero, CA[2]);
    par('limp25', T.limpeza, T.terminou, CA[1]);
  }
  return {solidas, fantasmas, torres};
};

const CASAS: [V3, number][] = [
  [[0.6, 0, 8.5], 0.2],
  [[-6.6, 0, 5.6], -0.6],
];
const ARVORES: V3[] = [
  [-1.2, 0, 8.2],
  [-5.6, 0, 6.6],
  [-7.6, 0, 3.6],
];

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, SOBE[s.id] - 0.15, SOBE[s.id] + 0.65);
  const ditas = ANOS.flatMap((y) => y.entradas.filter((e) => e.s === s.id).map((e) => janela(t, e.t, e.t + 2.6, 0.4)));
  let aceso = Math.max(0, ...ditas);
  if (s.id === 'cul') aceso = Math.max(aceso, janela(t, T.festas, T.asfalto, 0.4), janela(t, T.festaTodo, FIM + 1, 0.4));
  if (s.id === 'ass') aceso = Math.max(aceso, janela(t, T.tresAnos, T.asfalto, 0.4));
  const zerado = ZERADOS.includes(s.id);
  const e = 0.5;
  const props = {tema, pos: p, sobe, aceso: zerado ? 0 : aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.6 - 3.2 * rampa(t, T.limpeza - 0.5, T.limpeza + 5)} gariX={-1.6 + 0.2 * Math.min(6, Math.max(0, t - T.limpeza))} />;
    case 'prefeitura':
      return <Prefeitura {...props} />;
    case 'assist':
      return <PredioAssistencia {...props} />;
    case 'camara':
      return <CamaraVereadores {...props} />;
    case 'banco':
      return <BancoDivida {...props} />;
    case 'agua':
      return <EstacaoSaneamento {...props} />;
    case 'defesa':
      return <BaseDefesaCivil {...props} />;
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.45 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
          ))}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} cinza={zerado ? 1 : 0} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas, torres} = pilhasEm(t, tema);
  const ck = rampa(t, T.gastou24 - 0.1, T.gastou24 + 0.5) * SOME_DINHEIRO(t);
  const abre = Math.max(...ANOS.map((y) => janela(t, y.gastou + 0.2, y.fim - 0.2, 0.6)));
  const g = GAVETAS_VIS(t);
  const pk = PASTAS_VIS(t);
  const pAss = noAnel(idx('ass'), R_PREDIO - 1.35);
  const est = vis(t, T.colegio - 0.2, FIM + 2);
  const tgE: V3 = [Math.cos(ANG_ESTADO), 0, -Math.sin(ANG_ESTADO)];
  return (
    <group>
      <MesaMaquete tema={tema} rio={false} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.7} />
      ))}

      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[0, -1.4 * (1 - Math.min(1, ck)), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} /> : null}

      <PilhasDinheiro pilhas={solidas} max={3000} />
      <PilhasDinheiro pilhas={torres} max={4000} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={800} opacidade={0.28} largura={1.06} />

      {SETORES.map((s, i) => (
        <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
      ))}

      {/* famílias na porta da assistência social */}
      {[0, 1, 2].map((k) => {
        const a = rampa(t, T.familias + k * 0.15, T.familias + k * 0.15 + 0.4) * (1 - rampa(t, T.asfalto, T.asfalto + 0.4));
        if (a < 0.02) return null;
        const tg: V3 = [Math.cos(ang(idx('ass'))), 0, -Math.sin(ang(idx('ass')))];
        return <Boneco key={k} tema={tema} pos={soma(pAss, [tg[0] * (k - 1) * 0.42, 0.04, tg[2] * (k - 1) * 0.42])} rotY={ang(idx('ass'))} escala={0.3 * a} cor={mistura(tema.festa!.verde, tema.objeto, 0.25 + 0.2 * k)} />;
      })}

      {/* as gavetas: asfalto nos três anos e a limpeza de 2025 */}
      <BaseGaveta tema={tema} pos={[-1.65, 0, 1.25]} sobe={g} larg={3.5} texto="PAVIMENTAR AS RUAS" aceso={Math.max(janela(t, T.asfalto, T.limpeza, 0.4), janela(t, T.asfZero, FIM + 1, 0.4))} />
      <BaseGaveta tema={tema} pos={[1.75, 0, 1.25]} sobe={g} larg={2.0} texto="LIMPEZA" aceso={janela(t, T.limpeza, T.colegio, 0.4)} />
      {g > 0.05 ? <RoloCompactador tema={tema} pos={[-1.65, 0, 0.15]} rotY={-0.2} escala={0.3 * Math.min(1, g)} giro={0} /> : null}

      {/* obras do Governo do Estado: o colégio de tempo integral e a água da zona rural */}
      <RuaPlaca tema={tema} pos={POS_ESTADO} rotY={ANG_ESTADO + Math.PI} escala={0.95} sobe={est} linhas={['OBRAS DO ESTADO', 'COLÉGIO · R$ 26 MI', 'ÁGUA NA ZONA RURAL']} aceso={janela(t, T.colegio, T.tribunal, 0.4)} />
      {est > 0.05 ? <Escola tema={tema} pos={soma(POS_ESTADO, [-Math.sin(ANG_ESTADO) * 1.6 + tgE[0] * 1.1, 0, -Math.cos(ANG_ESTADO) * 1.6 + tgE[2] * 1.1])} rotY={ANG_ESTADO + Math.PI} sobe={est} aceso={janela(t, T.colegio, T.agua, 0.4)} escala={0.38} /> : null}
      {est > 0.05 ? <EstacaoSaneamento tema={tema} pos={soma(POS_ESTADO, [-Math.sin(ANG_ESTADO) * 1.6 - tgE[0] * 1.2, 0, -Math.cos(ANG_ESTADO) * 1.6 - tgE[2] * 1.2])} rotY={ANG_ESTADO + Math.PI} sobe={est} aceso={janela(t, T.agua, T.tribunal, 0.4)} escala={0.38} /> : null}

      {/* o Tribunal e as pastas */}
      <PredioTCM tema={tema} pos={TCM_POS} escala={0.5} sobe={vis(t, T.tribunal - 0.1, T.gastar)} aceso={janela(t, T.tribunal, T.gastar, 0.5)} />
      {PASTAS.map((pa, i) => {
        const ativos = pa.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : pa.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        return (
          <PastaProcesso
            key={i}
            tema={tema}
            pos={posPasta(i)}
            rotY={(0.5 - i) * 0.12}
            escala={0.85}
            sobe={rampa(t, pa.t - 0.1, pa.t + 0.45) * pk}
            titulo={pa.titulo}
            valor={pa.valor}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={atual[2] === 'alerta' ? C.alerta : mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, pa.t, (PASTAS[i + 1]?.t ?? T.gastar) - 0.1, 0.4)}
          />
        );
      })}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const VISTA_GERAL = (dx = 0) => E([0, 0, 0.3], 14.5, 10.5, [dx, 1.4, 1]);
const DE_CIMA = (dx = 0) => E([0, 0, 0], 13, 11, [dx, 2.0, 1]);
const COFRE = (dx = 0) => E([0, 0.4, 1.3], 9.2, 7.2, [dx, 1.2, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.9 + Math.cos(a) * 0.7, 1.0, Math.cos(a) * 6.9 - Math.sin(a) * 0.7];
  return E(alvo, 4.9 * perto, 4.8 * perto, [-Math.sin(a) * 0.85, 0.95, -Math.cos(a) * 0.85]);
};
// passa de casinha em casinha, sempre no mesmo sentido, segurando 0,55 s em cada uma
const passaSetores = (ents: Entrada[], fim: number, perto = 1): [number, Cam][] =>
  ents.flatMap((e, k): [number, Cam][] => {
    const prox = k + 1 < ents.length ? ents[k + 1].t : fim;
    const segura = Math.max(e.t + 0.25, prox - 0.55);
    const pp = perto * (idx(e.s) >= 8 ? 1.1 : 1);
    return [
      [e.t - 0.05, OLHA_SETOR(idx(e.s), pp)],
      [segura, OLHA_SETOR(idx(e.s), pp * 0.97)],
    ];
  });
const GAV_CAM = (c: V3, perto = 1): Cam => E(soma(c, [0, 1.0, 0.05]), 3.8 * perto, 4.4 * perto, [0, 0.75, 1]);
const [Y0, Y1, Y2] = ANOS;
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, VISTA_GERAL()]]},
  // 2024: o cofre com a pilha do ano; depois de casinha em casinha
  {ini: T.gastou24 - 0.3, arco: 0.05, chaves: [[T.gastou24 - 0.3, E([0, 0, 0.8], 10.5, 8, [0, 1.3, 1])], [T.sobrou + 0.6, COFRE(0.05)], [Y0.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y0.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y0.entradas[0].t - 0.3, OLHA_SETOR(0)], ...passaSetores(Y0.entradas, T.ano25 - 0.2)]},
  // 2025: sobe, o cofre ganha a pilha verde, desce de novo na escola
  {ini: T.ano25 - 0.1, arco: 0.06, chaves: [[T.ano25 - 0.1, DE_CIMA(0.15)], [T.gastou25 + 0.3, COFRE(0.05)], [Y1.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y1.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y1.entradas[0].t - 0.3, OLHA_SETOR(0, 1.12)], ...passaSetores(Y1.entradas, T.ano26 - 0.2, 1.12)]},
  // 2026
  {ini: T.ano26 - 0.1, arco: 0.06, chaves: [[T.ano26 - 0.1, DE_CIMA(0.15)], [T.gastou26 + 0.3, COFRE(0.05)], [Y2.entradas[0].t - 0.4, COFRE(0.1)]]},
  {ini: Y2.entradas[0].t - 0.3, arco: 0.03, chaves: [[Y2.entradas[0].t - 0.3, OLHA_SETOR(0, 1.2)], ...passaSetores(Y2.entradas, T.defesa - 0.2, 1.2)]},
  // os zeros: defesa civil e proteção animal, as duas últimas casinhas
  {ini: T.defesa - 0.1, arco: 0.04, chaves: [[T.defesa - 0.1, OLHA_SETOR(11, 0.95)], [T.animal - 0.3, OLHA_SETOR(11.2, 0.95)], [T.animal + 0.1, OLHA_SETOR(12, 0.9)], [T.repara - 0.2, OLHA_SETOR(12, 0.95)]]},
  // festas: sobe e mergulha entre o palco e a assistência (vizinhos na mesa)
  {ini: T.repara - 0.1, arco: 0.05, chaves: [[T.repara - 0.1, DE_CIMA(-0.1)], [T.festas - 0.2, OLHA_SETOR(6.5, 1.5)], [T.familias, OLHA_SETOR(6.6, 1.45)], [T.asfalto - 0.2, OLHA_SETOR(6.7, 1.5)]]},
  // asfalto: sobe e mergulha no miolo; da esquerda (2024) para a direita (limpeza)
  {
    ini: T.asfalto - 0.1,
    arco: 0.03,
    chaves: [
      [T.asfalto - 0.1, E([0, 0.6, 1.2], 8.4, 6.6, [0, 1.25, 1])],
      [T.plano, E([-0.4, 0.6, 1.2], 8.0, 6.4, [-0.05, 1.15, 1])],
      [T.a630 - 0.2, GAV_CAM(GAV.asf24)],
      [T.b630 - 0.2, GAV_CAM(GAV.asf25)],
      [T.c520 - 0.2, GAV_CAM(GAV.asf26)],
      [T.zero - 0.1, E([-1.65, 0.8, 1.25], 5.4, 5.0, [0, 0.8, 1])],
      [T.limpeza - 0.3, E([-1.4, 0.8, 1.25], 5.4, 5.0, [0.02, 0.8, 1])],
      [T.limpeza + 0.3, GAV_CAM(GAV.limp25, 1.25)],
      [T.colegio + 0.6, GAV_CAM(GAV.limp25, 1.2)],
    ],
  },
  // obras do Estado, na borda da mesa
  {ini: T.colegio + 0.7, arco: 0.04, chaves: [[T.colegio + 0.7, E(soma(POS_ESTADO, [0, 0.9, 0]), 4.6, 4.2, [-Math.sin(ANG_ESTADO) * 0.8, 0.75, -Math.cos(ANG_ESTADO) * 0.8])], [T.tribunal - 0.3, E(soma(POS_ESTADO, [0, 0.9, 0]), 4.3, 4.0, [-Math.sin(ANG_ESTADO) * 0.8, 0.75, -Math.cos(ANG_ESTADO) * 0.8])]]},
  // tribunal: as duas pastas, da esquerda para a direita
  {
    ini: T.tribunal - 0.2,
    arco: 0.03,
    chaves: [
      [T.tribunal - 0.2, E([0, 1.0, -1.4], 8.6, 6.8, [0, 0.9, 1])],
      [T.devolver - 0.2, E(soma(posPasta(0), [0.2, 0.9, 0]), 4.4, 4.2, [-0.1, 0.55, 1])],
      [T.recurso + 0.3, E(soma(posPasta(0), [0.3, 0.9, 0]), 4.4, 4.2, [-0.08, 0.55, 1])],
      [T.meses, E(soma(posPasta(1), [0, 0.9, 0]), 4.4, 4.2, [0.05, 0.55, 1])],
      [T.gastar - 0.2, E(soma(posPasta(1), [-0.2, 0.9, 0]), 4.8, 4.4, [0.08, 0.6, 1])],
    ],
  },
  // a pergunta: mesa inteira, depois o palco e a gaveta vazia do asfalto
  {ini: T.gastar - 0.1, arco: 0.05, chaves: [[T.gastar - 0.1, E([0, 0, 0.6], 12.5, 9, [0, 1.3, 1])], [T.festaTodo - 0.3, OLHA_SETOR(6, 1.12)], [T.asfZero - 0.4, OLHA_SETOR(6.05, 1.1)], [T.asfZero - 0.1, E([-1.65, 0.9, 1.25], 5.4, 5.0, [0.05, 0.8, 1])], [T.segue, E([-1.4, 0.9, 1.25], 5.8, 5.2, [0.1, 0.85, 1])], [FIM, E([0, 0, 0.4], 13.5, 9.6, [0.3, 1.3, 1])]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.04});
};

// ---------- Interface ----------
const ESTADOS: [number, string][] = [
  [0, 'ANAGÉ · PARA ONDE FOI CADA REAL'],
  [T.gastou24, '2024 · PARA ONDE FOI'],
  [T.ano25, '2025 · PARA ONDE FOI'],
  [T.ano26, '2026 · ATÉ JULHO'],
  [T.defesa, 'OS ZEROS'],
  [T.repara, 'AGORA REPARA'],
  [T.asfalto, 'E O ASFALTO?'],
  [T.colegio, 'OBRAS DO ESTADO'],
  [T.tribunal, 'NO TRIBUNAL DE CONTAS'],
  [T.gastar, 'A PERGUNTA'],
];
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 100) * 10} MIL` : `R$ ${v.toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [
    {a: T.gastou24 + 0.2, b: T.sobrou, texto: 'GASTOU EM 2024: R$ 97,7 MILHÕES'},
    {a: T.sobrou, b: Y0.entradas[0].t, texto: 'SOBRARAM QUASE R$ 700 MIL'},
    {a: T.ano25, b: T.arrec25, texto: '2025'},
    {a: T.arrec25, b: T.gastou25, texto: 'ARRECADOU EM 2025: R$ 108,5 MI'},
    {a: T.gastou25, b: T.falt25, texto: 'GASTOU EM 2025: R$ 114,2 MILHÕES'},
    {a: T.falt25, b: Y1.entradas[0].t, texto: 'R$ 5,7 MI A MAIS DO QUE ARRECADOU', destaque: true},
    {a: T.ano26, b: T.arrec26, texto: '2026 · ATÉ JULHO, O ÚLTIMO MÊS ENTREGUE'},
    {a: T.arrec26, b: T.gastou26, texto: 'ARRECADOU ATÉ JULHO: R$ 61 MI'},
    {a: T.gastou26, b: T.falt26, texto: 'JÁ GASTOU: R$ 62,2 MI (PREFEITURA + CÂMARA)'},
    {a: T.falt26, b: Y2.entradas[0].t, texto: 'R$ 1,2 MI A MAIS, ATÉ JULHO', destaque: true},
    {a: T.defesa, b: T.animal, texto: 'DEFESA CIVIL: TEM LINHA NO ORÇAMENTO, GASTO R$ 0', destaque: true},
    {a: T.animal, b: T.repara, texto: 'PROTEÇÃO ANIMAL: NEM APARECE NO ORÇAMENTO', destaque: true},
  ];
  ANOS.forEach((y) => {
    y.entradas.forEach((e, k) => {
      const prox = k + 1 < y.entradas.length ? y.entradas[k + 1].t : y.fim;
      c.push({a: e.t, b: prox, texto: `${nomeDe(e.s)}: ${fmtV(e.v)}`});
    });
  });
  c.push(
    {a: T.festas, b: T.tresAnos, texto: 'EVENTOS E FESTAS: R$ 4,1 MI · R$ 3,4 MI · R$ 2,5 MI'},
    {a: T.tresAnos, b: T.prioridade, texto: 'NOS 3 ANOS: FESTAS LEVARAM MAIS QUE A ASSISTÊNCIA SOCIAL', destaque: true},
    {a: T.prioridade, b: T.asfalto, texto: 'FESTA TAMBÉM É CULTURA. É A PRIORIDADE CERTA?'},
    {a: T.asfalto, b: T.plano, texto: 'E O ASFALTO?'},
    {a: T.plano, b: T.a630, texto: 'O ORÇAMENTO É O PLANO DO ANO'},
    {a: T.a630, b: T.b630, texto: '2024: RESERVADO R$ 630 MIL PARA PAVIMENTAR'},
    {a: T.b630, b: T.c520, texto: '2025: RESERVADO R$ 630 MIL'},
    {a: T.c520, b: T.zero, texto: '2026: RESERVADO R$ 520 MIL'},
    {a: T.zero, b: T.licit, texto: 'GASTO NESSA LINHA: R$ 0 NOS TRÊS ANOS', destaque: true},
    {a: T.licit, b: T.pago, texto: 'LICITAÇÃO DE CALÇAMENTO ABERTA EM ABRIL DE 2026'},
    {a: T.pago, b: T.limpeza, texto: 'NAS CONTAS ATÉ JULHO: R$ 0 PAGO', destaque: true},
    {a: T.limpeza, b: T.terminou, texto: 'LIMPEZA PÚBLICA 2025: RESERVADO R$ 1,8 MI'},
    {a: T.terminou, b: T.colegio, texto: 'TERMINOU COM R$ 4,1 MI', destaque: true},
    {a: T.colegio, b: T.agua, texto: 'COLÉGIO DE TEMPO INTEGRAL: R$ 26 MI'},
    {a: T.agua, b: T.tribunal, texto: 'COLÉGIO E ÁGUA RURAL: OBRAS DO GOVERNO DO ESTADO'},
    {a: T.tribunal, b: T.devolver, texto: 'NO TRIBUNAL DE CONTAS · OUTUBRO DE 2025'},
    {a: T.devolver, b: T.recurso, texto: 'ORDEM DE DEVOLVER R$ 3,8 MI · PAGAMENTOS DE 2021 E 2022', destaque: true},
    {a: T.recurso, b: T.meses, texto: 'CABE RECURSO'},
    {a: T.meses, b: T.gastar, texto: 'CONTAS DE TODOS OS MESES, DESDE 2024: FORA DO PRAZO', destaque: true},
    {a: T.gastar, b: T.festaTodo, texto: 'GASTAR NÃO É CRIME'},
    {a: T.festaTodo, b: T.asfZero, texto: 'DINHEIRO PARA FESTA TODO ANO...', destaque: true},
    {a: T.asfZero, b: T.segue, texto: '...POR QUE O ASFALTO FICOU NO ZERO?', destaque: true},
    {a: T.segue, b: FIM + 1, texto: '@eumagnoleite', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T.gastou24, b: T.ano25, texto: 'FONTE: ANEXO 9 E BALANÇO 2024 ENVIADOS AO TCM-BA'},
  {a: T.ano25, b: T.ano26, texto: 'FONTE: ANEXO 9 E BALANÇO 2025 ENVIADOS AO TCM-BA'},
  {a: T.ano26, b: T.defesa, texto: 'FONTE: SIGA JUL/2026 · PREFEITURA E CÂMARA · DESPESA LIQUIDADA'},
  {a: T.defesa, b: T.licit, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2024, DEZ/2025, JUL/2026'},
  {a: T.licit, b: T.limpeza, texto: 'FONTE: PNCP · CONCORRÊNCIA 001/2026 · SIGA JUL/2026'},
  {a: T.limpeza, b: T.colegio, texto: 'FONTE: DESPESA POR AÇÃO · SIGA DEZ/2025'},
  {a: T.colegio, b: T.tribunal, texto: 'FONTE: JORNAL DO SUDOESTE, 14/07/2025'},
  {a: T.tribunal, b: T.meses, texto: 'FONTE: BAHIA NOTÍCIAS E A TARDE, OUTUBRO DE 2025'},
  {a: T.meses, b: T.gastar, texto: 'FONTE: E-TCM · DATAS DE ENVIO DAS CONTAS MENSAIS'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const CA = coresAno(tema);
  const r: Rot[] = [];
  ANOS.forEach((y, yi) => {
    y.entradas.forEach((e, ei) => {
      if (e.v <= 0) return;
      const i = idx(e.s);
      const sai = ei + 1 < y.entradas.length ? Math.min(e.t + 3.2, y.entradas[ei + 1].t + 0.5) : e.t + 3.2;
      for (let k = 0; k <= yi; k++) {
        const v = valorDe(e.s, k);
        if (v <= 0) continue;
        r.push({a: e.t + (k === yi ? 0.55 : 0.3 + k * 0.1), b: Math.max(sai, e.t + 2.1), p: soma(posTorre(i, k), [0, altFina(v) + 0.35, 0]), valor: fmtV(v), sub: ANO_SUB[k], cor: CA[k]});
      }
    });
    if (y.falta) r.push({a: y.falta.t + 0.4, b: y.fim - 0.2, p: soma(FALTA_POS, [0, altTorre(y.falta.v / ESCALA, LADO) + 0.3, 0]), valor: `${fmtV(y.falta.v)} A MAIS`, cor: C.alerta});
  });
  // festas x assistência social, nos três anos
  [0, 1, 2].forEach((k) => {
    r.push({a: T.tresAnos + 0.3 + k * 0.45, b: T.asfalto, p: soma(posTorre(idx('cul'), k), [0, altFina(valorDe('cul', k)) + 0.35, 0]), valor: fmtV(FESTAS[k]), sub: `${ANO_SUB[k]} · FESTAS`, cor: CA[k]});
    r.push({a: T.tresAnos + 0.5 + k * 0.45, b: T.asfalto, p: soma(posTorre(idx('ass'), k), [0, altFina(valorDe('ass', k)) + 0.35, 0]), valor: fmtV(valorDe('ass', k)), sub: `${ANO_SUB[k]} · ASSISTÊNCIA`, cor: CA[k]});
  });
  // gavetas do asfalto e da limpeza
  const topo = (chave: keyof typeof GAV) => soma(GAV[chave], [0, altTorre(Math.max(OBRA[chave].usou, OBRA[chave].res) / ESC_OBRA, LADO_G[chave]) + 0.3, 0]);
  r.push(
    {a: T.a630 + 0.4, b: T.colegio - 0.1, p: topo('asf24'), valor: 'R$ 630 MIL', sub: '2024 · RESERVADO'},
    {a: T.b630 + 0.4, b: T.colegio - 0.1, p: topo('asf25'), valor: 'R$ 630 MIL', sub: '2025 · RESERVADO'},
    {a: T.c520 + 0.4, b: T.colegio - 0.1, p: topo('asf26'), valor: 'R$ 520 MIL', sub: '2026 · RESERVADO'},
    {a: T.zero + 0.3, b: T.colegio - 0.1, p: soma(GAV.asf25, [0, 0.35, 0.5]), valor: 'GASTO: R$ 0', sub: 'NOS TRÊS ANOS', cor: C.alerta},
    {a: T.limpeza + 0.5, b: T.terminou + 0.2, p: soma(GAV.limp25, [0, altTorre(OBRA.limp25.res / ESC_OBRA, 3) + 0.3, 0]), valor: 'RESERVADO R$ 1,8 MI', sub: '2025 · LIMPEZA'},
    {a: T.terminou + 0.5, b: T.colegio + 0.75, p: topo('limp25'), valor: 'R$ 4,1 MI', sub: '2025 · LIMPEZA', cor: CA[1]},
    {a: T.asfZero, b: FIM + 1, p: topo('asf25'), valor: '?', cor: tema.acento},
  );
  return r;
};

// a marca d'água @eumagnoleite: pequena e leve, quica devagar pela tela inteira
const MARCA_W = 250;
const MARCA_H = 36;
const vaiVolta = (u: number) => 1 - Math.abs((u % 2) - 1);
const MarcaDagua: React.FC<{tema: Tema; t: number}> = ({tema, t}) => {
  const x = 24 + vaiVolta(t / 11.3) * (W - MARCA_W - 48);
  const y = 24 + vaiVolta(t / 15.7) * (H - MARCA_H - 48);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MARCA_W, height: MARCA_H, fontFamily: FONTE, fontSize: 30, fontWeight: 800, letterSpacing: 0.5, color: tema.texto, opacity: 0.16, whiteSpace: 'nowrap', pointerEvents: 'none'}}>
      @eumagnoleite
    </div>
  );
};

const noMapa = (t: number) => t < T.gastou24;
const soMapa = (t: number) => t < T.gastou24 - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.gastou24) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.gastou24 + 0.4, T.repara);
  const obraK = vis(t, T.a630, T.colegio - 0.2);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 || obraK > 0.01 ? (
        <div style={{opacity: Math.min(1, Math.max(placarK, obraK)), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${obraK > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{obraK > 0.01 ? 'AQUI, 1 PILHA = R$ 200 MIL · BRANCO = RESERVADO' : '1 PILHA = R$ 2 MI · DOURADO 2024 · VERDE 2025 · ROSA 2026'}</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const k = Math.min(entra(t, T.arrec24, 0.45), 1 - rampa(t, T.gastou24 - 0.6, T.gastou24 - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇO 2024 ENVIADO AO TCM-BA</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 90, Math.min(SEGURO.botoesX - 90, pj.x)), y: Math.max(730, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < 150 && Math.abs(rots[a].y - rots[b].y) < 62) rots[a].y = rots[b].y - 64;
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 60 ? 16 : chip.texto.length > 44 ? 19 : chip.texto.length > 32 ? 24 : 30} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 30 : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.3, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/anage.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.falt25, T.falt26, ...ANOS.flatMap((y) => y.entradas.filter((e) => e.v >= 3).map((e) => e.t)), T.zero, T.terminou, T.devolver, T.prazo];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.arrec24, f: 'pop', v: 0.2});
  ANOS.forEach((y) => s.push({t: y.gastou + 0.2, f: 'subida', v: 0.16}));
  ANOS.forEach((y) => y.entradas.forEach((e) => s.push({t: e.t + 0.05, f: 'pop', v: 0.18})));
  [T.defesa, T.animal].forEach((t) => s.push({t: t + 0.9, f: 'baque', v: 0.2}));
  ANOS.forEach((y) => (y.falta ? s.push({t: y.falta.t, f: 'baque', v: 0.22}) : null));
  s.push({t: T.sobrou + 0.2, f: 'ding', v: 0.14});
  s.push({t: T.tresAnos + 0.3, f: 'pop', v: 0.16});
  [T.a630, T.b630, T.c520].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.15}));
  s.push({t: T.zero + 0.2, f: 'baque', v: 0.2});
  s.push({t: T.terminou, f: 'subida', v: 0.18});
  s.push({t: T.governo, f: 'pop', v: 0.16});
  s.push({t: T.devolver + 0.5, f: 'impacto', v: 0.18});
  s.push({t: T.recurso + 0.1, f: 'tique', v: 0.14});
  s.push({t: T.prazo + 0.1, f: 'impacto', v: 0.16});
  s.push({t: T.festaTodo, f: 'pop', v: 0.18});
  s.push({t: T.asfZero, f: 'pop', v: 0.18});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, T.ano24 + 0.6, T.arrec24 + 0.8, T.gastou24 + 0.9, T.sobrou + 0.9,
  ...Y0.entradas.map((e) => e.t + 0.9),
  T.ano25 + 1.0, T.gastou25 + 0.9, T.falt25 + 0.8, Y1.entradas[0].t + 0.9, Y1.entradas[3].t + 0.9, Y1.entradas[6].t + 0.9, Y1.entradas[10].t + 0.9,
  T.ano26 + 1.0, T.falt26 + 0.8, Y2.entradas[0].t + 0.9, Y2.entradas[4].t + 0.9, Y2.entradas[8].t + 0.6, Y2.entradas[10].t + 0.8,
  T.defesa + 1.0, T.animal + 0.8,
  T.repara + 0.6, T.festas + 0.8, T.tresAnos + 1.6, T.familias + 0.6, T.prioridade + 0.6,
  T.asfalto + 0.6, T.a630 + 0.8, T.b630 + 0.8, T.c520 + 0.8, T.zero + 0.9, T.licit + 0.8, T.pago + 0.8, T.limpeza + 0.9, T.terminou + 1.2, T.colegio + 0.4,
  T.colegio + 0.6, T.agua + 0.8,
  T.tribunal + 0.4, T.devolver + 1.0, T.recurso + 0.6, T.meses + 0.6, T.prazo + 0.6,
  T.gastar + 0.5, T.festaTodo + 0.4, T.asfZero + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoAnage: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const zoom = (1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}))) * (1 + soquinho(t));
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [2.5, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = soMapa(t) ? null : (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={12} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
    </ThreeCanvas>
  );
  const mapas = (
    <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
      <TrechoMapa {...MAPA} />
    </Sequence>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Anagé" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Festa', 'tem.', 'Asfalto,', 'zero.'];
export const CapaOrcamentoAnage: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 760}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ANAGÉ`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 120, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
