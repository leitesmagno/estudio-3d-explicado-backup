import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, Cone, Onibus, RoloCompactador} from '../../pecas';
import {PontoOnibus} from '../onibusilheus/pecas';
import {
  BancoDivida,
  BaseDefesaCivil,
  CamaraVereadores,
  CopoPiso,
  EstacaoSaneamento,
  Escola,
  MesaMaquete,
  PilhasDinheiro,
  PostoSaude,
  PredioTCM,
  Prefeitura,
  ReguaLimite,
  RuaServicos,
  coresOI,
  grade,
  yCopo,
  yRegua,
  type Pilha,
} from '../orcamentoitabuna/pecas';
import {MorrosPlanalto} from './pecas';
import {PALAVRAS} from './palavras';

// 022. orçamento de vitória da conquista (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a maquete redonda da série (014, 017, 020: cofre da prefeitura no meio, pilhas de dinheiro;
// aqui 1 pilha = R$ 10 MILHÕES, 148 pilhas; casinhas e morros do planalto na borda) e encaixa os dois trechos
// de mapa do Kit Mapas (projetos/022.../mapas/conquista.mp4, composição OrcamentoConquista do kit).
// SÓ DADOS DE VITÓRIA DA CONQUISTA: todo número vem dos PDFs do portal da transparência da prefeitura
// (audio/fontes.md, com página). Neutro: sem nome de prefeito nem partido.
// Plano: projetos/022. orçamento de vitória da conquista/plano.md.

export const FPS = 30;
const AUDIO_SEG = 150.19;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '022. orçamento de vitória da conquista';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  bi: quando('gastou 1 bilhao'),
  primeiro: quando('Primeiro'),
  federal: quando('governo federal'),
  paraOnde: quando('para onde vai'),
  maiorFatia: quando('A maior fatia'),
  n520: quando('520', 2),
  quase8: quando('quase 8'),
  fundamental: quando('ensino fundamental'),
  saude: quando('Depois vem a saude'),
  n368: quando('368'),
  metade: quando('Metade foi'),
  hospitais: quando('hospitais'),
  urbanismo: quando('O urbanismo'),
  n240: quando('240'),
  n103: quando('103'),
  onibus: quando('para os onibus'),
  adm: quando('A administracao'),
  n116: quando('116'),
  quaseDobro: quando('Quase o dobro de assistencia'),
  assist: quando('assistencia social'),
  cultura: quando('cultura'),
  ambiente: quando('meio ambiente'),
  esporte: quando('esporte juntos'),
  zero: quando('ficou no zero'),
  saneam: quando('O saneamento'),
  n10mil: quando('10 mil'),
  nada: quando('Nao gastou'),
  em2024: quando('Em 2024'),
  n30: quando('30 milhoes'),
  repara: quando('Agora repara'),
  seg: quando('A seguranca publica'),
  n290: quando('290 mil'),
  guarda: quando('guarda municipal'),
  soDefesa: quando('so apareceu'),
  policia: quando('A policia'),
  camara: quando('a Camara de Vereadores'),
  n37: quando('37 milhoes'),
  n100: quando('Mais de 100'),
  parte: quando('E tem a parte'),
  salarios: quando('para salarios'),
  n713: quando('713'),
  obras: quando('Ja obras'),
  n67: quando('67 milhoes'),
  menos5: quando('Menos de 5'),
  previstos: quando('Estavam previstos 234'),
  divida: quando('a divida levou'),
  n78: quando('78 milhoes'),
  maisObras: quando('Mais do que todas'),
  lei: quando('A lei deixa'),
  n54: quando('ate 54'),
  estaEm: quando('esta em'),
  alerta: quando('limite de alerta'),
  pisos: quando('E os pisos'),
  saudeP: quando('A saude precisa'),
  rec1: quando('Recebeu'),
  eduP: quando('A educacao precisa'),
  rec2: quando('Recebeu', 2),
  pouco: quando('Passou por pouco'),
  tribunal: quando('Tribunal de Contas'),
  fimAno: quando('no fim do ano'),
  n38: quando('38 milhoes'),
  seu: quando('O dinheiro e seu'),
  emQual: quando('Em qual area'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
};

const ESTADOS: [number, string][] = [
  [0, 'VITÓRIA DA CONQUISTA 2025'],
  [T.primeiro, 'DE ONDE VEM'],
  [T.paraOnde, 'PARA ONDE VAI'],
  [T.maiorFatia, 'EDUCAÇÃO'],
  [T.saude, 'SAÚDE'],
  [T.urbanismo, 'URBANISMO'],
  [T.adm, 'ADMINISTRAÇÃO'],
  [T.zero, 'SANEAMENTO'],
  [T.repara, 'SEGURANÇA × CÂMARA'],
  [T.parte, 'SALÁRIOS × OBRAS'],
  [T.lei, 'O TETO'],
  [T.pisos, 'OS PISOS'],
  [T.fimAno, 'A SOBRA'],
  [T.seu, 'E VOCÊ?'],
];

// ---------- O mapa (Kit Mapas): os dois trechos seguidos, com o mesmo relógio do 3D ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.paraOnde) + 6};
const noMapa = (t: number) => t < T.paraOnde;
const soMapa = (t: number) => t < T.paraOnde - 0.3;

// ---------- Mapa do mundo (mesa redonda de 9 m; frente da câmera é z+) ----------
const COFRE: V3 = [0, 0, 0];
const ESCOLA: V3 = [-7.1, 0, -0.9];
const PILHAS_EDU: V3 = [-4.6, 0, -3.3];
const HOSP: V3 = [-0.4, 0, -6.0];
const PILHAS_SAU: V3 = [-0.4, 0, -3.8];
const RUA: V3 = [-3.6, 0, 4.7];
const PILHAS_URB: V3 = [-3.6, 0, 3.1];
const PONTO: V3 = [1.0, 0, 5.05];
const RUA_BUS_Z = 6.0;
const PREF: V3 = [5.4, 0, -3.9];
const PILHAS_ADM: V3 = [3.9, 0, -2.2];
const PILHAS_CMP: V3 = [5.5, 0, -0.9];
const SANEAM: V3 = [6.7, 0, 2.6];
const PILHAS_SAN: V3 = [5.1, 0, 2.3];
const CAMARA: V3 = [-3.6, 0, -6.5];
const PILHAS_CAM: V3 = [-2.6, 0, -5.4];
const DEFESA: V3 = [-6.4, 0, -4.9];
const PILHAS_DEF: V3 = [-5.6, 0, -5.9];
const OBRA: V3 = [-1.6, 0, 3.6];
const PILHAS_OBR: V3 = [0.2, 0, 3.6];
const BANCO: V3 = [5.7, 0, 5.0];
const PILHAS_DIV: V3 = [3.9, 0, 3.6];
const REGUA: V3 = [0, 0, 0];
const COPO_SAU: V3 = [-1.8, 0, 0];
const COPO_EDU: V3 = [1.8, 0, 0];
const PILHAS_SOBRA: V3 = [0, 0, 1.7];
const CASAS: [V3, number][] = [
  [[-6.0, 0, -6.4], 0.6],
  [[3.4, 0, -7.6], -0.3],
  [[7.6, 0, -2.0], -1.2],
  [[-8.1, 0, 1.2], 1.4],
  [[7.4, 0, 4.4], -1.6],
];
const ARVORES: V3[] = [
  [-7.4, 0, 4.0],
  [-5.8, 0, 6.6],
  [-1.6, 0, 8.3],
  [7.6, 0, -0.6],
];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];

// ---------- As pilhas (1 pilha = R$ 10 milhões) ----------
const anel = (desloca = 0): V3[] => {
  const s: V3[] = [];
  (
    [
      [1.5, 26],
      [1.9, 32],
      [2.3, 40],
      [2.7, 50],
    ] as [number, number][]
  ).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r + desloca;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
};
// fase 1: o gasto por área. As pilhas voam do anel para cada área, na palavra do número.
const ANEL: V3[] = anel();
// fase 2 ("a parte que quase ninguém vê"): o dinheiro todo de novo no anel, agora separado em salários, obras e dívida
const ANEL2: V3[] = anel(0.07);

type Faixa2 = {de: number; ate: number; a: number; tom: 'aceso' | 'claro'};
type Voo = {n: number; t: number; centro: V3; cols: number; slots: number; fim: number; cena?: number; faixas?: Faixa2[]; passo?: number};
const VOOS: Voo[] = [
  {n: 51.995, t: T.n520, centro: PILHAS_EDU, cols: 8, slots: 56, fim: T.quase8, cena: T.saude, faixas: [{de: 0, ate: 40.095, a: T.quase8, tom: 'aceso'}]},
  {n: 36.793, t: T.n368, centro: PILHAS_SAU, cols: 8, slots: 40, fim: T.metade, cena: T.urbanismo, faixas: [{de: 0, ate: 18.516, a: T.metade, tom: 'aceso'}]},
  {n: 23.974, t: T.n240, centro: PILHAS_URB, cols: 6, slots: 24, fim: T.n103, cena: T.adm, faixas: [{de: 0, ate: 10.269, a: T.n103, tom: 'aceso'}]},
  {n: 11.628, t: T.n116, centro: PILHAS_ADM, cols: 4, slots: 12, fim: T.zero},
  // as 4 áreas que, juntas, dão 61 milhões: cada uma voa na sua palavra para o mesmo grupo
  {n: 3.402, t: T.assist, centro: PILHAS_CMP, cols: 3, slots: 4, fim: T.zero},
  {n: 1.78, t: T.cultura, centro: soma(PILHAS_CMP, [0, 0, 1.6]), cols: 2, slots: 2, fim: T.zero},
  {n: 0.831, t: T.ambiente, centro: soma(PILHAS_CMP, [0.8, 0, 1.6]), cols: 1, slots: 1, fim: T.zero},
  {n: 0.085, t: T.esporte, centro: soma(PILHAS_CMP, [1.2, 0, 1.6]), cols: 1, slots: 1, fim: T.zero},
  {n: 3.748, t: T.n37, centro: PILHAS_CAM, cols: 2, slots: 4, fim: T.parte},
  {n: 0.029, t: T.n290, centro: PILHAS_DEF, cols: 1, slots: 1, fim: T.parte},
];
const rotas = (base: V3[], voos: Voo[]) => {
  const livres = base.map((_, i) => i);
  return voos.map((v) => {
    const dest = grade(v.centro, v.slots, v.cols);
    const n = Math.ceil(v.n);
    const de: number[] = [];
    for (let j = 0; j < n; j++) {
      livres.sort((a, b) => Math.hypot(base[a][0] - dest[j][0], base[a][2] - dest[j][2]) - Math.hypot(base[b][0] - dest[j][0], base[b][2] - dest[j][2]));
      de.push(livres.shift()!);
    }
    return {de, dest};
  });
};
const ROTAS = rotas(ANEL, VOOS);
const DO_VOO: number[] = ANEL.map(() => -1);
ROTAS.forEach((r, v) => r.de.forEach((i) => (DO_VOO[i] = v)));
// fase 2: obras (6,7 pilhas) e dívida (7,8 pilhas) voam do anel; 71,3 pilhas (salários) acendem no anel
const VOOS2: Voo[] = [
  {n: 6.713, t: T.n67, centro: PILHAS_OBR, cols: 6, slots: 24, fim: T.divida},
  {n: 7.81, t: T.n78, centro: PILHAS_DIV, cols: 3, slots: 9, fim: T.lei},
];
const ROTAS2 = rotas(ANEL2, VOOS2);
const DO_VOO2: number[] = ANEL2.map(() => -1);
ROTAS2.forEach((r, v) => r.de.forEach((i) => (DO_VOO2[i] = v)));
const SALARIO2 = (() => {
  const livres = ANEL2.map((_, i) => i).filter((i) => DO_VOO2[i] < 0);
  return new Set(livres.slice(0, 71));
})();

/** Enche uma grade de pilhas até o total `n` (com fração), na ordem. */
const encher = (pos: V3[], n: number, corP: string): Pilha[] => pos.map((p, j) => ({p, n: Math.max(0, Math.min(1, n - j)), cor: corP})).filter((x) => x.n > 0.0005);

const cofreK = (t: number) => rampa(t, T.paraOnde - 0.1, T.paraOnde + 0.5) * (1 - rampa(t, T.lei - 0.2, T.lei + 0.7)) + rampa(t, T.fimAno - 0.4, T.fimAno + 0.5) * (1 - rampa(t, T.seu + 0.6, T.seu + 1.4));

const pilhasEm = (t: number, tema: Tema) => {
  const C = coresOI(tema);
  const ouro = C.ouro;
  const aceso = (k: number) => mistura(ouro, tema.branco, 0.3 * k);
  const claro = (k: number) => mistura(ouro, tema.objetoClaro, 0.55 * k);
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  // fase 1: as pilhas das áreas afundam na "parte que quase ninguém vê" e voltam no fim
  const afunda = 0.9 * rampa(t, T.parte - 0.2, T.parte + 0.8) * (1 - rampa(t, T.seu, T.seu + 1.2));
  const desce = (p: V3): V3 => [p[0], p[1] - afunda, p[2]];
  if (t >= T.paraOnde - 0.1) {
    ANEL.forEach((p, i) => {
      const nasce = rampa(t, T.paraOnde + 0.1 + i * 0.006, T.paraOnde + 0.5 + i * 0.006);
      const v = DO_VOO[i];
      let corP = ouro;
      if (v >= 0) {
        const voo = VOOS[v];
        const j = ROTAS[v].de.indexOf(i);
        const a = voo.t + j * 0.03;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        let k = janela(t, voo.t, voo.fim, 0.4);
        (voo.faixas ?? []).forEach((f) => {
          if (j >= f.de - 0.001 && j < f.ate) {
            const sep = janela(t, f.a, voo.cena ?? voo.fim, 0.5);
            if (sep > 0.01) {
              corP = f.tom === 'aceso' ? aceso(sep) : claro(sep);
              k = 0;
            }
          }
        });
        // o grupo dos 61 milhões acende junto no "quase o dobro" (as 4 áreas somadas)
        if (v >= 4 && v <= 7) k = Math.max(k, janela(t, voo.t, voo.t + 0.9, 0.3), 0.6 * janela(t, T.esporte + 0.8, T.zero, 0.4));
        if (k > 0) corP = aceso(k);
        solidas.push({p: desce(pos), n, cor: corP});
        return;
      }
      // as pilhas que ficam no anel afundam com o cofre na "parte que quase ninguém vê"
      const fora = rampa(t, T.parte - 0.4, T.parte + 0.6);
      if (fora < 0.99) solidas.push({p: [p[0], p[1] - 0.9 * fora, p[2]], n: n0(nasce) * (1 - fora), cor: corP});
    });
  }
  // saneamento: em 2024 foram 30 milhões (3 pilhas transparentes); em 2025, nada
  const someSan = 1 - rampa(t, T.repara - 0.2, T.repara + 0.5);
  if (t >= T.n30 - 0.2 && someSan > 0.01) fantasmas.push(...encher(grade(PILHAS_SAN, 3, 3), 2.985 * rampa(t, T.n30 - 0.2, T.n30 + 0.6) * someSan, ouro));
  // fase 2: o dinheiro todo de volta no anel; quase metade (salários) acende; obras e dívida voam
  const k2 = rampa(t, T.parte + 0.2, T.parte + 1.0) * (1 - rampa(t, T.lei - 0.2, T.lei + 0.7));
  if (k2 > 0.01) {
    ANEL2.forEach((p, i) => {
      const nasce = k2 * rampa(t, T.parte + 0.2 + i * 0.004, T.parte + 0.6 + i * 0.004);
      const v = DO_VOO2[i];
      if (v >= 0) {
        const voo = VOOS2[v];
        const j = ROTAS2[v].de.indexOf(i);
        const a = voo.t + j * 0.05;
        const kv = rampa(t, a, a + 0.7);
        const pos = curva(p, ROTAS2[v].dest[j], 1.0, kv);
        let n = nasce;
        if (j === Math.ceil(voo.n) - 1) n = nasce * (1 + (voo.n - Math.floor(voo.n) - 1) * kv);
        const k = janela(t, voo.t, voo.fim, 0.4);
        solidas.push({p: pos, n, cor: k > 0.01 ? aceso(k) : ouro});
        return;
      }
      const sal = SALARIO2.has(i) ? janela(t, T.salarios, T.obras, 0.5) : 0;
      solidas.push({p, n: nasce, cor: sal > 0.01 ? aceso(sal) : ouro});
    });
    // obras e equipamentos previstos: 234 milhões (23,4 pilhas transparentes)
    if (t >= T.previstos) fantasmas.push(...encher(grade(PILHAS_OBR, 24, 6), 23.39 * rampa(t, T.previstos, T.previstos + 0.9) * k2, ouro));
  }
  // a sobra do fim do ano: 3,8 pilhas na frente do cofre
  const sobraK = rampa(t, T.n38 - 0.2, T.n38 + 0.6) * (1 - rampa(t, T.seu + 0.6, T.seu + 1.4));
  if (sobraK > 0.01) solidas.push(...encher(grade(PILHAS_SOBRA, 4, 4), 3.839 * sobraK, aceso(janela(t, T.n38, T.seu + 0.6, 0.4))));
  return {solidas, fantasmas};
};
const n0 = (x: number) => x;

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const {solidas, fantasmas} = pilhasEm(t, tema);
  // prédios: sobem na palavra da área, afundam um pouco na "parte que quase ninguém vê" e voltam no fim
  const fora = 0.25 * rampa(t, T.parte - 0.3, T.parte + 0.7) * (1 - rampa(t, T.seu, T.seu + 0.9));
  const predio = (a: number) => Math.max(0, rampa(t, a - 0.2, a + 0.6) - fora);
  const fim = (i: number) => janela(t, T.seu + 0.6 + i * 0.25, FIM + 1, 0.4);
  const ck = cofreK(t);
  const busK = vis(t, T.urbanismo, T.parte);
  const busX = 4.4 - 3.0 * rampa(t, T.n103 - 0.4, T.onibus + 0.6, sai);
  const pontoK = predio(T.urbanismo + 0.3);
  const obraK = vis(t, T.obras - 0.1, T.lei);
  const reguaK = rampa(t, T.lei + 0.2, T.lei + 1.2) * (1 - rampa(t, T.pisos, T.pisos + 0.8));
  const nivel = 46.72 * rampa(t, T.estaEm - 0.2, T.estaEm + 1.4);
  const coposK = rampa(t, T.pisos + 0.2, T.pisos + 1.0) * (1 - rampa(t, T.fimAno - 0.4, T.fimAno + 0.3));
  const nivelSau = 16.43 * rampa(t, T.rec1 - 0.3, T.rec1 + 0.9);
  const nivelEdu = 25.08 * rampa(t, T.rec2 - 0.3, T.rec2 + 0.9);
  const tcmK = rampa(t, T.tribunal - 0.3, T.tribunal + 0.7) * (1 - rampa(t, T.fimAno, T.fimAno + 0.5));

  return (
    <group>
      <MesaMaquete tema={tema} />
      <MorrosPlanalto tema={tema} />
      {CASAS.map(([p, r], i) => (
        <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.55} />
      ))}
      {ARVORES.map((p, i) => (
        <ArvoreRedonda key={i} tema={tema} pos={p} r={0.7} cresce={0.7} />
      ))}

      {/* o cofre da prefeitura */}
      {ck > 0.02 ? <CofreFGTS tema={tema} pos={[COFRE[0], -1.6 * (1 - ck), COFRE[2]]} escala={0.75} abre={t < T.lei ? rampa(t, T.paraOnde + 0.3, T.paraOnde + 1.0) : rampa(t, T.n38, T.n38 + 0.7)} trava={0} brilho={0.3 * Math.max(janela(t, T.paraOnde + 0.3, T.maiorFatia + 0.6), janela(t, T.n38, T.seu, 0.5))} /> : null}

      {/* as pilhas */}
      <PilhasDinheiro pilhas={solidas} max={1800} />
      <PilhasDinheiro pilhas={fantasmas} max={500} opacidade={0.3} largura={1.12} />

      {/* educação e saúde */}
      <Escola tema={tema} pos={ESCOLA} rotY={1.35} escala={0.85} sobe={predio(T.maiorFatia)} aceso={Math.max(janela(t, T.maiorFatia, T.saude, 0.5), fim(0))} />
      <PostoSaude tema={tema} pos={HOSP} rotY={0.05} escala={1.1} sobe={predio(T.saude)} aceso={Math.max(janela(t, T.saude, T.urbanismo, 0.5), fim(1))} />

      {/* urbanismo: rua, ponto e ônibus */}
      <RuaServicos tema={tema} pos={RUA} rotY={0.25} sobe={predio(T.urbanismo)} luz={Math.max(janela(t, T.urbanismo + 0.6, T.adm, 0.5), fim(2))} caminhaoX={2.4 - 4.6 * rampa(t, T.urbanismo, T.urbanismo + 5)} gariX={-1.8 + 0.22 * Math.min(8, Math.max(0, t - T.urbanismo))} />
      {pontoK > 0.02 ? (
        <group position={PONTO} rotation={[0, Math.PI / 2, 0]} scale={0.5}>
          <PontoOnibus tema={tema} pos={[0, 0, 0]} sobe={pontoK} aceso={Math.max(janela(t, T.n103, T.adm, 0.5), fim(3))} />
        </group>
      ) : null}
      {pontoK > 0.02 ? <Caixa args={[4.8, 0.03, 0.9]} raio={0.01} cor={tema.objetoEscuro} position={[1.6, 0.1 - 0.2 * (1 - pontoK), RUA_BUS_Z]} sombra={false} /> : null}
      {busK > 0.02 ? <Onibus tema={tema} pos={[busX, 0.11, RUA_BUS_Z]} rotY={-Math.PI / 2} escala={0.45 * Math.min(1, busK)} farol={0.6} /> : null}

      {/* administração */}
      <Prefeitura tema={tema} pos={PREF} rotY={-0.7} escala={0.85} sobe={predio(T.adm)} aceso={Math.max(janela(t, T.adm, T.zero, 0.5), fim(4))} />

      {/* saneamento: zero */}
      <EstacaoSaneamento tema={tema} pos={SANEAM} rotY={-1.3} escala={0.6} sobe={predio(T.saneam)} aceso={Math.max(0.3 * janela(t, T.saneam, T.repara, 0.5), fim(5))} />

      {/* segurança (só a defesa civil) e Câmara */}
      <BaseDefesaCivil tema={tema} pos={DEFESA} rotY={0.9} escala={0.75} sobe={predio(T.seg)} aceso={Math.max(janela(t, T.seg, T.camara, 0.5), fim(6))} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={0.35} escala={0.8} sobe={predio(T.camara)} aceso={Math.max(janela(t, T.camara, T.parte, 0.5), fim(7))} />

      {/* obras e equipamentos */}
      {obraK > 0.02 ? (
        <group position={OBRA} scale={Math.min(1, obraK) * 0.8}>
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.9 - i * 0.2, 0.22, 0.6 - i * 0.1]} raio={0.03} cor={mistura(C.alerta, C.areia, 0.4)} position={[0, 0.17 + i * 0.22, 0]} />
          ))}
          {[0, 1].map((i) => (
            <Caixa key={i} args={[1.3, 0.06, 0.18]} raio={0.02} cor={C.madeira} position={[0.2, 0.1 + i * 0.07, 0.6 + i * 0.05]} rotation={[0, 0.3, 0]} />
          ))}
        </group>
      ) : null}
      <Cone tema={tema} pos={[OBRA[0] - 0.7, 0.06, OBRA[2] - 0.6]} k={0.7 * obraK} />
      <RoloCompactador tema={tema} pos={[OBRA[0] - 1.0, 0.06, OBRA[2] + 0.5]} rotY={0.6} escala={0.3 * obraK} giro={t * 0.8} />

      {/* dívida */}
      <BancoDivida tema={tema} pos={BANCO} rotY={-0.7} escala={0.85} sobe={predio(T.divida)} aceso={Math.max(janela(t, T.divida, T.lei, 0.5), fim(8))} />

      {/* a régua do teto: 46,7% (alerta 48,6, máximo 54) */}
      <ReguaLimite tema={tema} pos={REGUA} sobe={reguaK} nivel={nivel} prudencial={rampa(t, T.alerta, T.alerta + 0.5)} maximo={rampa(t, T.n54, T.n54 + 0.5)} />

      {/* os copos dos pisos e o Tribunal de Contas dos Municípios */}
      <CopoPiso tema={tema} pos={COPO_SAU} sobe={coposK} piso={15} risco={rampa(t, T.saudeP, T.saudeP + 0.5)} nivel={nivelSau} acima={rampa(t, T.rec1 + 0.6, T.rec1 + 1.1)} />
      <CopoPiso tema={tema} pos={COPO_EDU} sobe={coposK} piso={25} risco={rampa(t, T.eduP, T.eduP + 0.5)} nivel={nivelEdu} acima={rampa(t, T.rec2 + 0.6, T.rec2 + 1.1)} />
      <PredioTCM tema={tema} pos={[0, 0, -3.4]} sobe={tcmK} aceso={janela(t, T.tribunal, T.fimAno, 0.5)} escala={0.9} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const MESA_TODA = E([0, 0, 0.4], 18.5, 11.5, [0, 1.43, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, MESA_TODA]]},
  {
    ini: T.paraOnde - 0.3,
    arco: 0.04,
    chaves: [
      [T.paraOnde - 0.3, E([0, 0, 0.2], 16, 10.5, [0, 1.25, 1])],
      [T.maiorFatia - 0.1, E([0, 0, 0], 15, 9.8, [0.05, 1.2, 1])],
    ],
  },
  {
    ini: T.maiorFatia + 0.3,
    arco: 0.04,
    chaves: [
      [T.maiorFatia + 0.3, E([-4.8, 0.8, -2.8], 6.8, 4.8, [0.5, 0.95, 1])],
      [T.saude - 0.3, E([-4.8, 0.8, -2.7], 6.4, 4.6, [0.7, 0.95, 1])],
    ],
  },
  {
    ini: T.saude - 0.1,
    arco: 0.04,
    chaves: [
      [T.saude - 0.1, E([-0.4, 0.9, -4.6], 6.6, 4.6, [0.25, 0.92, 1])],
      [T.urbanismo - 0.3, E([-0.4, 0.9, -4.5], 6.2, 4.4, [0.1, 0.92, 1])],
    ],
  },
  {
    ini: T.urbanismo - 0.1,
    arco: 0.04,
    chaves: [
      [T.urbanismo - 0.1, E([-2.4, 0.7, 4.2], 7.2, 4.8, [0.15, 0.85, 1])],
      [T.n103, E([-1.4, 0.6, 4.6], 7.2, 4.8, [0.1, 0.8, 1])],
      [T.adm - 0.3, E([-1.2, 0.6, 4.7], 6.8, 4.6, [0.05, 0.8, 1])],
    ],
  },
  {
    ini: T.adm - 0.1,
    arco: 0.04,
    chaves: [
      [T.adm - 0.1, E([4.6, 1.0, -3.0], 6.0, 4.4, [-0.5, 0.92, 1])],
      [T.quaseDobro, E([4.8, 0.9, -1.9], 6.4, 4.6, [-0.5, 0.92, 1])],
      [T.zero - 0.3, E([4.9, 0.9, -1.7], 6.2, 4.4, [-0.6, 0.92, 1])],
    ],
  },
  {
    ini: T.zero - 0.1,
    arco: 0.04,
    chaves: [
      [T.zero - 0.1, E([5.8, 0.8, 2.4], 5.4, 4.0, [-0.55, 0.8, 1])],
      [T.repara - 0.3, E([5.8, 0.8, 2.4], 5.0, 3.8, [-0.4, 0.8, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    arco: 0.04,
    chaves: [
      [T.repara - 0.1, E([-4.6, 0.9, -5.6], 6.6, 4.6, [0.4, 0.95, 1])],
      [T.camara, E([-4.2, 0.9, -5.8], 6.6, 4.6, [0.3, 0.95, 1])],
      [T.parte - 0.3, E([-4.2, 0.9, -5.8], 6.2, 4.4, [0.2, 0.95, 1])],
    ],
  },
  {
    ini: T.parte - 0.1,
    arco: 0.04,
    chaves: [
      [T.parte - 0.1, E([0, 0.4, 0.6], 8.6, 5.8, [0, 1.05, 1])],
      [T.obras + 0.2, E([0.6, 0.5, 2.4], 8.0, 5.4, [0, 0.95, 1])],
      [T.divida + 0.2, E([2.0, 0.5, 2.8], 8.0, 5.4, [-0.15, 0.95, 1])],
      [T.lei - 0.3, E([2.0, 0.5, 2.8], 7.6, 5.2, [-0.25, 0.95, 1])],
    ],
  },
  {
    ini: T.lei - 0.1,
    arco: 0.04,
    chaves: [
      [T.lei - 0.1, E([0, 1.4, 0.6], 7, 5.6, [0, 0.6, 1])],
      [T.lei + 1.2, E([0, 3.1, 0], 3.4, 7.4, [0, 0.3, 1])],
      [T.alerta, E([0, 3.4, 0], 3.0, 6.0, [0.05, 0.28, 1])],
      [T.pisos - 0.2, E([0, 3.4, 0], 3.0, 5.8, [0.1, 0.28, 1])],
    ],
  },
  {
    ini: T.pisos - 0.1,
    arco: 0.04,
    chaves: [
      [T.pisos - 0.1, E([0, 1.9, 0], 6.4, 5.0, [0, 0.4, 1])],
      [T.tribunal - 0.3, E([0, 1.9, -0.6], 7.4, 5.4, [0.05, 0.5, 1])],
      [T.fimAno - 0.3, E([0, 1.9, -0.6], 7.0, 5.2, [0.08, 0.5, 1])],
    ],
  },
  {
    ini: T.fimAno - 0.1,
    arco: 0.04,
    chaves: [
      [T.fimAno - 0.1, E([0, 0.8, 0.8], 5.4, 4.0, [0, 0.7, 1])],
      [T.seu - 0.2, E([0, 0.8, 0.9], 5.0, 3.8, [0.1, 0.7, 1])],
    ],
  },
  {
    ini: T.seu,
    chaves: [
      [T.seu, E([0, 0, 0], 18, 11, [0, 1.3, 1])],
      [FIM, E([0, 0, 0], 19, 11.5, [0.3, 1.35, 1])],
    ],
  },
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.06, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.paraOnde + 0.3, b: T.maiorFatia, texto: 'GASTOS DE 2025: R$ 1,48 BILHÃO'},
  {a: T.maiorFatia, b: T.quase8, texto: 'A MAIOR FATIA'},
  {a: T.quase8, b: T.saude, texto: 'QUASE 8 DE CADA 10 REAIS: ENSINO FUNDAMENTAL', destaque: true},
  {a: T.metade, b: T.urbanismo, texto: 'METADE: HOSPITAIS E ATENDIMENTO ESPECIALIZADO', destaque: true},
  {a: T.urbanismo, b: T.n103, texto: 'RUAS, SERVIÇOS E ÔNIBUS'},
  {a: T.n103, b: T.adm, texto: '103 MILHÕES PARA OS ÔNIBUS', destaque: true},
  {a: T.adm, b: T.quaseDobro, texto: 'ADMINISTRAÇÃO DA PREFEITURA'},
  {a: T.esporte + 0.6, b: T.zero, texto: 'QUASE O DOBRO DAS 4 ÁREAS JUNTAS', destaque: true},
  {a: T.zero, b: T.n10mil, texto: 'TEM ÁREA QUE FICOU NO ZERO'},
  {a: T.nada, b: T.em2024, texto: 'GASTO EM 2025: ZERO', destaque: true},
  {a: T.em2024, b: T.repara, texto: 'EM 2024: 30 MILHÕES'},
  {a: T.repara, b: T.seg, texto: 'AGORA REPARA'},
  {a: T.guarda, b: T.policia, texto: 'NO MUNICÍPIO: GUARDA E DEFESA CIVIL'},
  {a: T.policia, b: T.camara, texto: 'A POLÍCIA É DO ESTADO'},
  {a: T.n100, b: T.parte, texto: 'MAIS DE 100 VEZES A SEGURANÇA', destaque: true},
  {a: T.parte, b: T.salarios, texto: 'O DINHEIRO TODO: R$ 1,48 BILHÃO'},
  {a: T.salarios, b: T.obras, texto: 'QUASE METADE: SALÁRIOS E ENCARGOS', destaque: true},
  {a: T.menos5, b: T.previstos, texto: 'MENOS DE 5 REAIS EM CADA 100'},
  {a: T.previstos, b: T.divida, texto: 'PREVISTO × GASTO'},
  {a: T.maisObras, b: T.lei, texto: 'DÍVIDA: MAIS QUE TODAS AS OBRAS', destaque: true},
  {a: T.lei, b: T.estaEm, texto: 'LEI DE RESPONSABILIDADE FISCAL'},
  {a: T.alerta, b: T.pisos, texto: 'ABAIXO DO LIMITE DE ALERTA (48,6%)', destaque: true},
  {a: T.pisos, b: T.saudeP, texto: 'OS PISOS DA LEI'},
  {a: T.pouco, b: T.tribunal, texto: 'EDUCAÇÃO: PASSOU POR POUCO', destaque: true},
  {a: T.tribunal, b: T.fimAno, texto: 'QUEM ANALISA: TCM DA BAHIA'},
  {a: T.fimAno, b: T.seu, texto: 'RECEITAS − DESPESAS'},
];
const SELOS: Txt[] = [
  {a: T.paraOnde, b: T.maiorFatia, texto: 'FONTE: RREO DEZ/2025 · PREFEITURA DE VITÓRIA DA CONQUISTA · ANEXO 1 · P. 3'},
  {a: T.maiorFatia, b: T.urbanismo, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6'},
  {a: T.urbanismo, b: T.adm, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 7 (URBANISMO)'},
  {a: T.adm, b: T.zero, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6 E 7'},
  {a: T.zero, b: T.repara, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 7 (2024: RREO DEZ/2024 · P. 7 E 8)'},
  {a: T.repara, b: T.parte, texto: 'FONTE: RREO DEZ/2025 · ANEXO 2 · P. 6'},
  {a: T.parte, b: T.lei, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 3 (PESSOAL, INVESTIMENTOS E DÍVIDA)'},
  {a: T.lei, b: T.pisos, texto: 'FONTE: RGF DEZ/2025 · P. 36 DO RREO (DOM 84) · LRF, ART. 20 E 59'},
  {a: T.pisos, b: T.fimAno, texto: 'FONTE: RREO DEZ/2025 · ANEXO 14 · P. 32 (DOM 80)'},
  {a: T.fimAno, b: T.seu, texto: 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 3 (SUPERÁVIT)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.n520, b: T.quase8, p: soma(PILHAS_EDU, [0, 1.1, 0.6]), valor: '520 MI', sub: 'R$ 519,95 MI · EDUCAÇÃO', cor: 'acento'},
  {a: T.quase8, b: T.saude, p: soma(PILHAS_EDU, [0, 1.1, 0.6]), valor: '401 MI', sub: 'ENSINO FUNDAMENTAL · 77%', cor: 'acento'},
  {a: T.n368, b: T.metade, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '368 MI', sub: 'R$ 367,93 MI · SAÚDE', cor: 'acento'},
  {a: T.metade, b: T.urbanismo, p: soma(PILHAS_SAU, [0, 1.1, 0.4]), valor: '185 MI', sub: 'HOSPITAIS E ATENDIMENTO ESPECIALIZADO', cor: 'acento'},
  {a: T.n240, b: T.n103, p: soma(PILHAS_URB, [0, 1.1, 0]), valor: '240 MI', sub: 'R$ 239,74 MI · URBANISMO', cor: 'acento'},
  {a: T.n103, b: T.adm, p: soma(PILHAS_URB, [0, 1.1, 0]), valor: '103 MI', sub: 'R$ 102,69 MI · ÔNIBUS', cor: 'acento'},
  {a: T.n116, b: T.zero, p: soma(PILHAS_ADM, [0, 1.1, 0]), valor: '116 MI', sub: 'R$ 116,28 MI · ADMINISTRAÇÃO', cor: 'acento'},
  {a: T.esporte + 0.6, b: T.zero, p: soma(PILHAS_CMP, [0.4, 1.0, 0.8]), valor: '61 MI', sub: 'AS 4 ÁREAS JUNTAS', dy: 120},
  {a: T.n10mil, b: T.em2024, p: soma(PILHAS_SAN, [0, 0.9, 0]), valor: '10 MIL', sub: 'PREVISTO NO ORÇAMENTO'},
  {a: T.nada, b: T.repara, p: soma(PILHAS_SAN, [0, 0.9, 0]), valor: 'R$ 0', sub: 'GASTO EM 2025 · SANEAMENTO', cor: 'alerta', dy: 120},
  {a: T.n30, b: T.repara, p: soma(PILHAS_SAN, [0, 0.9, 0]), valor: '2024: 30 MI', sub: 'R$ 29,85 MI'},
  {a: T.n290, b: T.parte, p: soma(PILHAS_DEF, [0, 0.6, 0]), valor: '290 MIL', sub: 'SEGURANÇA · SÓ DEFESA CIVIL', cor: 'acento'},
  {a: T.n37, b: T.parte, p: soma(PILHAS_CAM, [0, 1.0, 0]), valor: '37,5 MI', sub: 'R$ 37,48 MI · CÂMARA', cor: 'acento'},
  {a: T.n713, b: T.obras, p: [-1.6, 1.0, -1.6], valor: '713 MI', sub: 'SALÁRIOS E ENCARGOS · 48%', cor: 'acento'},
  {a: T.n67, b: T.divida, p: soma(PILHAS_OBR, [0, 1.0, -0.2]), valor: '67 MI', sub: 'R$ 67,13 MI · OBRAS E EQUIPAMENTOS', cor: 'acento'},
  {a: T.previstos, b: T.divida, p: soma(PILHAS_OBR, [0, 0.9, 0.4]), valor: 'PREVISTO: 234 MI', sub: 'R$ 233,90 MI', dy: 120},
  {a: T.n78, b: T.lei, p: soma(PILHAS_DIV, [0, 1.0, 0]), valor: '78 MI', sub: 'JUROS R$ 41,26 + PARCELAS R$ 36,84 MI', cor: 'acento'},
  {a: T.n54, b: T.pisos - 0.2, p: [-0.9, yRegua(54) + 0.2, 0], valor: '54%', sub: 'MÁXIMO DA LEI'},
  {a: T.rec1, b: T.fimAno, p: soma(COPO_SAU, [0, yCopo(16.4) + 0.3, 0.6]), valor: '16,4%', sub: 'SAÚDE · MÍNIMO 15%', cor: 'acento'},
  {a: T.rec2, b: T.fimAno, p: soma(COPO_EDU, [0, yCopo(25.1) + 0.3, 0.6]), valor: '25,1%', sub: 'EDUCAÇÃO · MÍNIMO 25%', cor: 'acento'},
  {a: T.n38, b: T.seu + 0.6, p: soma(PILHAS_SOBRA, [0, 1.0, 0]), valor: '38 MI', sub: 'R$ 38,39 MI · RECEITAS − DESPESAS', cor: 'acento'},
];

// a soma das 4 áreas (2D): assistência, cultura, meio ambiente e esporte
const SOMA4: {nome: string; valor: string; a: number}[] = [
  {nome: 'ASSISTÊNCIA SOCIAL', valor: '34 MI', a: T.assist},
  {nome: 'CULTURA', valor: '17,8 MI', a: T.cultura},
  {nome: 'MEIO AMBIENTE', valor: '8,3 MI', a: T.ambiente},
  {nome: 'ESPORTE E LAZER', valor: '0,85 MI', a: T.esporte},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const placarK = vis(t, T.paraOnde + 0.4, T.lei);
  const cabecalho = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
      <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
        {seloAtual ? (
          <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 66 ? 14 : seloAtual.texto.length > 56 ? 16 : seloAtual.texto.length > 46 ? 18 : 21, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
            {seloAtual.texto}
          </div>
        ) : null}
      </div>
      {placarK > 0.01 ? (
        <div style={{opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 10 MILHÕES</div>
        </div>
      ) : null}
    </div>
  );
  if (noMapa(t)) {
    const seloMapa = t < T.primeiro ? 'FONTE: RREO DEZ/2025 · PREFEITURA DE VITÓRIA DA CONQUISTA · ANEXO 1 · P. 3' : 'FONTE: RREO DEZ/2025 · ANEXO 1 · P. 2 (RECEITAS)';
    const k = Math.min(entra(t, T.bi, 0.45), 1 - rampa(t, T.paraOnde - 0.6, T.paraOnde - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloMapa.length > 66 ? 14 : 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloMapa}</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 210, Math.min(SEGURO.botoesX - 210, pj.x)), y: Math.max(640, Math.min(1240, pj.y - (r.dy ?? 0))), k: Math.min(1, k), r};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 118) visRot[a].y = visRot[b].y + 122;
  const numeroGrande = (txt: string, sub: string, k: number, corN: string) =>
    k > 0.01 ? (
      <div style={{position: 'absolute', right: W - SEGURO.botoesX + 10, top: 700, display: 'flex', opacity: Math.min(1, k)}}>
        <div style={{padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${corN}`, textAlign: 'center', transform: `translateY(${(1 - Math.min(1, k)) * 20}px)`}}>
          <div style={{fontFamily: FONTE, fontSize: 84, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: corN}}>{txt}</div>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>{sub}</div>
        </div>
      </div>
    ) : null;
  const n467K = entra(t, T.estaEm + 0.3, 0.5) * (1 - rampa(t, T.pisos - 0.3, T.pisos));
  const somaK = entra(t, T.assist, 0.45) * (1 - rampa(t, T.zero - 0.3, T.zero + 0.1));
  const somaCard =
    somaK > 0.01 ? (
      <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.botoesX + 30, top: 600, opacity: Math.min(1, somaK)}}>
        <div style={{background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, borderRadius: 18, padding: '14px 20px 10px'}}>
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: tema.textoSuave, marginBottom: 6}}>AS 4 ÁREAS · 2025</div>
          {SOMA4.filter((l) => t >= l.a - 0.05).map((l) => (
            <div key={l.nome} style={{display: 'flex', justifyContent: 'space-between', padding: '4px 0', opacity: Math.min(1, rampa(t, l.a - 0.05, l.a + 0.4) * 1.5)}}>
              <div style={{fontFamily: MONO, fontSize: 19, fontWeight: 800, letterSpacing: 1, color: tema.texto}}>{l.nome}</div>
              <div style={{fontFamily: FONTE, fontSize: 28, fontWeight: 900, color: tema.texto}}>{l.valor}</div>
            </div>
          ))}
          {t >= T.esporte + 0.6 ? (
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0 2px', borderTop: `1.5px solid ${tema.cartaoBorda}`, marginTop: 6, opacity: rampa(t, T.esporte + 0.6, T.esporte + 1.0)}}>
              <div style={{fontFamily: MONO, fontSize: 19, fontWeight: 800, letterSpacing: 1, color: tema.acento}}>JUNTAS</div>
              <div style={{fontFamily: FONTE, fontSize: 30, fontWeight: 900, color: tema.acento}}>61 MI</div>
            </div>
          ) : null}
        </div>
      </div>
    ) : null;
  const comentaK = vis(t, T.emQual, FIM);
  return (
    <>
      {cabecalho}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 520, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 20 : chip.texto.length > 30 ? 24 : chip.texto.length > 22 ? 28 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.35) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
      {somaCard}
      {numeroGrande('46,7%', 'PESSOAL · RGF 2025', n467K, tema.acento)}
      {comentaK > 0.01 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}>
          <div style={{padding: '18px 36px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: tema.texto}}>QUAL ÁREA PRECISA DE MAIS?</div>
            <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: rampa(t, T.comentarios, T.comentarios + 0.4)}}>COMENTA AQUI</div>
            {t >= T.segue ? <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 900, letterSpacing: -1, color: tema.acento, marginTop: 10, opacity: rampa(t, T.segue + 0.4, T.segue + 0.9)}}>@eumagnoleite</div> : null}
          </div>
        </div>
      ) : null}
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
      <OffthreadVideo src={staticFile(`${P}/mapas/conquista.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  // mapa
  s.push({t: quando('480'), f: 'pop', v: 0.22});
  [quando('520'), quando('1 de cada 5'), quando('587')].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: quando('Quase o dobro de todos'), f: 'ding', v: 0.16});
  // pilhas que deslizam: pop baixinho
  [...VOOS, ...VOOS2].forEach((v) => {
    for (let j = 0; j < Math.ceil(v.n); j += 3) s.push({t: v.t + j * 0.03 + 0.6, f: 'pop', v: 0.06});
  });
  s.push({t: T.paraOnde + 0.3, f: 'subida', v: 0.18});
  [T.n520, T.quase8, T.n368, T.metade, T.n240, T.n103, T.n116, T.n290, T.n37, T.n713, T.n67, T.n78].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.esporte + 0.6, f: 'ding', v: 0.16});
  s.push({t: T.nada + 0.2, f: 'baque', v: 0.24});
  s.push({t: T.n30, f: 'subida', v: 0.12});
  s.push({t: T.n100, f: 'baque', v: 0.2});
  s.push({t: T.parte + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.previstos, f: 'subida', v: 0.14});
  s.push({t: T.maisObras, f: 'baque', v: 0.2});
  // teto e pisos
  s.push({t: T.lei + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.n54, f: 'pop', v: 0.2});
  s.push({t: T.estaEm, f: 'subida', v: 0.22});
  s.push({t: T.alerta, f: 'ding', v: 0.18});
  s.push({t: T.pisos + 0.2, f: 'subida', v: 0.18});
  s.push({t: T.rec1 + 0.6, f: 'ding', v: 0.18});
  s.push({t: T.rec2 + 0.6, f: 'ding', v: 0.18});
  s.push({t: T.tribunal, f: 'subida', v: 0.14});
  // sobra e fim
  s.push({t: T.fimAno, f: 'subida', v: 0.16});
  s.push({t: T.n38, f: 'pop', v: 0.24});
  for (let i = 0; i < 9; i++) s.push({t: T.seu + 0.6 + i * 0.25, f: 'bip', v: 0.07});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.5, 5.0, 10.0, 15.0, 20.0, 24.0, 29.0, 32.0, 34.5, T.paraOnde + 0.8, T.n520 + 1.0, T.quase8 + 0.8, T.n368 + 1.0, T.metade + 0.8, T.n240 + 0.8, T.n103 + 0.8, T.onibus + 0.4,
  T.n116 + 0.8, T.cultura + 0.3, T.esporte + 0.8, T.n10mil + 0.4, T.nada + 0.5, T.n30 + 0.5, T.n290 + 0.6, T.policia + 0.3, T.n37 + 0.8, T.n100 + 0.6,
  T.parte + 1.2, T.n713 + 0.6, T.n67 + 0.8, T.previstos + 0.8, T.n78 + 0.8, T.maisObras + 0.6, T.n54 + 0.6, T.estaEm + 1.0, T.alerta + 0.6,
  T.rec1 + 0.6, T.rec2 + 0.6, T.tribunal + 0.6, T.n38 + 0.6, T.seu + 1.5, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OrcamentoConquista: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const desfoque = i > 1 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
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
      <Marca tema={tema} serie={SERIE} assunto="Orçamento de Vitória da Conquista" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['1,48 bilhão.', 'Para onde', 'foi cada', 'real?'];
export const CapaOrcamentoConquista: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · VITÓRIA DA CONQUISTA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
