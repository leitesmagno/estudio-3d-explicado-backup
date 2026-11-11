import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini} from '../../pecas';
import {BancoDivida, CamaraVereadores, EstacaoSaneamento, Escola, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, RuaServicos, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto, type TipoPredio} from '../orcamentocanavieiras/pecas';
import {CabecalhoDuplo, MarcaDaguaDupla} from '../orcamentoparatinga1824/CabecalhoDuplo';
import {PALAVRAS} from './palavras';

// 096. orçamento de Paratinga (BA) 2018–2024, TODOS OS SETORES (perfil @eumagnoleite, parceria @eugeniodmr).
// Continuação do 094 (mesma mesa e as mesmas 12 casinhas). A voz fala setor por setor, os 7 anos em sequência:
// a câmera vai até a casinha do setor e, a cada número falado, a torre daquele ano nasce na frente dela (cor do ano).
// Cada setor tem a sua escala (escrita na tela); na soma final todas as torres voltam para a mesma escala (1 pilha = R$ 4 mi).
// "Gastou" = LIQUIDADO. Sem porcentagem, sem nome de gestor. Dados: projetos/096.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 195.2; // Algenib 1,3, pausas 0,28 s, atempo 1,1323, -15 LUFS (v2: abertura sem citar o 1º vídeo)
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '096. orçamento de paratinga 2018-2024 todos os setores';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
// a primeira vez que o trecho é falado DEPOIS de t0 (os números se repetem muito)
const depois = (tr: string, t0: number): number => {
  for (let n = 1; n < 80; n++) {
    const v = quando(tr, n);
    if (v >= t0 - 0.01) return v;
  }
  throw new Error(`não achei "${tr}" depois de ${t0}`);
};
const T0 = {
  primeiro: quando('Eu abri as contas'),
  todos: quando('e separei todos os setores'),
  documento: quando('com o documento'),
};

// ---------- Os setores: 12 casinhas na borda da mesa (mesmo anel do 094) ----------
type Tipo = 'escola' | 'posto' | 'prefeitura' | 'rua' | 'camara' | 'banco' | 'assist' | 'agua' | 'arvores' | TipoPredio;
type Setor = {id: string; nome: string; tipo: Tipo; texto?: string};
const SETORES: Setor[] = [
  {id: 'edu', nome: 'EDUCAÇÃO', tipo: 'escola'},
  {id: 'sau', nome: 'SAÚDE', tipo: 'posto'},
  {id: 'adm', nome: 'ADMINISTRAÇÃO', tipo: 'prefeitura'},
  {id: 'obr', nome: 'OBRAS E SERVIÇOS URBANOS', tipo: 'rua'},
  {id: 'cam', nome: 'CÂMARA DE VEREADORES', tipo: 'camara'},
  {id: 'div', nome: 'DÍVIDAS E ENCARGOS', tipo: 'banco'},
  {id: 'cul', nome: 'CULTURA E FESTAS', tipo: 'palco', texto: 'CULTURA E FESTAS'},
  {id: 'ass', nome: 'ASSISTÊNCIA SOCIAL', tipo: 'assist'},
  {id: 'agu', nome: 'ÁGUA E SANEAMENTO', tipo: 'agua'},
  {id: 'agr', nome: 'AGRICULTURA', tipo: 'trator', texto: 'AGRICULTURA'},
  {id: 'esp', nome: 'ESPORTE', tipo: 'quadra', texto: 'ESPORTE'},
  {id: 'mam', nome: 'MEIO AMBIENTE', tipo: 'arvores'},
];
const R_PREDIO = 7.5;
const ANGS: number[] = SETORES.map((_, i) => 0.13 * Math.PI + i * 0.1585 * Math.PI);
const ang = (i: number) => ANGS[Math.max(0, Math.min(ANGS.length - 1, i))];
const noAnel = (i: number, r: number): V3 => [Math.sin(ang(i)) * r, 0, Math.cos(ang(i)) * r];
const posTorre = (i: number, yi: number): V3 => {
  const a = ang(i);
  const frente = yi < 4;
  const tan = frente ? [-0.84, -0.28, 0.28, 0.84][yi] : [-0.56, 0, 0.56][yi - 4];
  const r = R_PREDIO - (frente ? 1.75 : 1.15);
  return [Math.sin(a) * r + Math.cos(a) * tan, 0, Math.cos(a) * r - Math.sin(a) * tan];
};
const idx = (id: string) => SETORES.findIndex((s) => s.id === id);
const ROT_ANO = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// ---------- A fala, setor por setor (valores em R$ milhões, LIQUIDADO, exatos no fontes.md) ----------
type Def = {id: string; cabeca: string; falas: string[]; v: number[]; esc: number; det?: string; detTxt?: string; rotulo?: (string | null)[]};
const DEFS: Def[] = [
  {id: 'edu', cabeca: 'Educacao 39', falas: ['39 e 500', '44 e 200', '37 e 300', '42 e 700', '58 e 500', '60 e 300', '66 e 400'], v: [39.541045, 44.238484, 37.260865, 42.65976, 58.464369, 60.324451, 66.384617], esc: 4, det: 'So de salarios', detTxt: 'SÓ DE SALÁRIOS EM 2024: R$ 31,4 MI'},
  {id: 'sau', cabeca: 'Saude 12', falas: ['12 e 900', '13 e 500', '18 e 600', '20 milhoes', '21 e 800', '25 e 600', '35 milhoes'], v: [12.921692, 13.480197, 18.621983, 19.955736, 21.802638, 25.585982, 35.001897], esc: 4, det: 'Desses 10 e 900', detTxt: 'PAGOS A EMPRESAS EM 2024: R$ 10,9 MI'},
  {id: 'adm', cabeca: 'Administracao 9', falas: ['9 e 600', '5 e 100', '8 e 900', '11 e 400', '16 milhoes', '17 e 200', '20 e 500'], v: [9.649836, 5.051096, 8.932233, 11.351396, 16.018015, 17.215573, 20.481473], esc: 2, det: 'Em 2024 6 e 500', detTxt: '2024: EMPRESAS R$ 6,5 MI · CONTAS DE ANOS ANTERIORES R$ 2,6 MI'},
  {id: 'obr', cabeca: 'Obras e servicos urbanos 6', falas: ['6 e 900', '8 e 500', '8 e 200', '10 e 500', '11 e 500', '11 e 200', '12 e 400'], v: [6.855009, 8.546671, 8.239461, 10.487733, 11.492839, 11.232008, 12.430493], esc: 2, det: 'Calcamento e asfalto', detTxt: 'CALÇAMENTO E ASFALTO EM 2024: R$ 343 MIL'},
  {id: 'div', cabeca: 'Dividas e encargos', falas: ['809 mil', '1 e 200', '1 e 100', '1 e 900', '1 e 200', '4 milhoes', '4 e 800'], v: [0.809253, 1.194044, 1.073482, 1.879209, 1.150244, 4.019141, 4.837904], esc: 0.5, det: 'as parcelas da divida', detTxt: '2018: PARCELAS DA DÍVIDA DENTRO DA ADMINISTRAÇÃO', rotulo: ['R$ 809 MIL (NA ADM.)', null, null, null, null, null, null]},
  {id: 'cam', cabeca: 'Camara de Vereadores 2', falas: ['2 e 100', '2 e 300', '2 e 400', '2 e 500', '3 milhoes', '3 e 400', '3 e 500'], v: [2.116789, 2.337138, 2.449815, 2.507115, 3.044264, 3.391289, 3.452275], esc: 0.5, det: 'Salarios 2 milhoes', detTxt: '2024: SALÁRIOS R$ 2 MI · CONSULTORIA R$ 492 MIL'},
  {id: 'cul', cabeca: 'Cultura e festas 1', falas: ['1 e 700', '1 e 200', '1 e 300', '386 mil', '1 e 500', '2 milhoes', '2 e 600'], v: [1.661131, 1.231916, 1.320631, 0.385851, 1.457446, 1.965477, 2.646048], esc: 0.25, det: 'tudo na acao de festas', detTxt: '2024: TUDO NA AÇÃO DE FESTAS'},
  {id: 'ass', cabeca: 'Assistencia social 1', falas: ['1 e 500', '1 e 300', '1 e 200', '1 e 500', '2 e 900', '2 milhoes', '2 e 200'], v: [1.522164, 1.284638, 1.219032, 1.512431, 2.87559, 2.039728, 2.17345], esc: 0.25, det: 'Menos do que as festas', detTxt: '2024: MENOS DO QUE AS FESTAS (R$ 2,6 MI)'},
  {id: 'agu', cabeca: 'Agua e saneamento', falas: ['1 e 500', '1 e 400', '1 e 200', '1 e 200', '1 e 400', '1 e 500', '1 e 700'], v: [1.474265, 1.370783, 1.229575, 1.234253, 1.418931, 1.509542, 1.689589], esc: 0.25, det: 'So a operacao', detTxt: 'OPERAÇÃO DO SISTEMA DE ÁGUA EM 2024: R$ 1,2 MI'},
  {id: 'agr', cabeca: 'Agricultura', falas: ['618 mil', '600 mil', '508 mil', '699 mil', '899 mil', '914 mil', '809 mil'], v: [0.618398, 0.600504, 0.507874, 0.69943, 0.898798, 0.913532, 0.809301], esc: 0.1, det: 'Acudes aguadas', detTxt: 'AÇUDES, AGUADAS E BARRAGENS EM 2024: R$ 268 MIL', rotulo: [null, 'R$ 600,5 MIL', null, null, null, null, null]},
  {id: 'esp', cabeca: 'Esporte', falas: ['190 mil', '214 mil', '221 mil', '185 mil', '549 mil', '872 mil', '746 mil'], v: [0.190412, 0.214356, 0.220872, 0.184757, 0.548847, 0.871581, 0.74611], esc: 0.1},
  {id: 'mam', cabeca: 'Meio ambiente', falas: ['316 mil', '236 mil', '398 mil', '575 mil', '336 mil', '466 mil', '446 mil'], v: [0.315917, 0.236402, 0.398009, 0.575375, 0.336231, 0.465605, 0.446402], esc: 0.1},
];
type Sec = Def & {t: number; tv: number[]; tDet: number; fim: number};
const SECS: Sec[] = (() => {
  let t0 = T0.documento;
  return DEFS.map((d) => {
    const t = depois(d.cabeca, t0);
    const tv: number[] = [];
    let a = t;
    d.falas.forEach((f) => {
      a = depois(f, a);
      tv.push(a);
      a += 0.05;
    });
    // o detalhe da Dívida vem ANTES dos números (as parcelas de 2018 dentro da administração)
    const tDet = d.det ? depois(d.det, d.id === 'div' ? t : a) : -1;
    t0 = Math.max(a, tDet) + 0.1;
    return {...d, t, tv, tDet, fim: 0};
  });
})();
const T = {
  resto: depois('E o resto', SECS[SECS.length - 1].tv[6]),
  somando: quando('Somando os sete anos'),
  sEdu: quando('educacao 349'),
  sSau: quando('Saude 147'),
  sAdm: quando('Administracao 89'),
  sAss: depois('Assistencia social 12', quando('Somando os sete anos')),
  sCul: depois('Cultura e festas 10', quando('Somando os sete anos')),
  qual: quando('Qual desses setores'),
  segue: quando('Sigam o'),
};
SECS.forEach((s, k) => (s.fim = k + 1 < SECS.length ? SECS[k + 1].t : T.resto));
const secDe = (id: string) => SECS.find((s) => s.id === id)!;

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const r1 = (v: number) => Math.round(v * 10 + 1e-9) / 10;
const fmtV = (v: number) => (v === 0 ? 'R$ 0' : v < 1 ? `R$ ${Math.round(v * 1000 + 1e-9)} MIL` : `R$ ${r1(v).toFixed(1).replace('.', ',').replace(/,0$/, '')} MI`);
const fmtCurto = (v: number) => (v === 0 ? '0' : v < 1 ? `${Math.round(v * 1000 + 1e-9)} mil` : r1(v).toFixed(1).replace('.', ','));
const fmtEsc = (e: number) => (e >= 1 ? `R$ ${e} MI` : `R$ ${Math.round(e * 1000)} MIL`);

const ANDAR = 0.75;
const LADO_S = 2;
const PASSO_S = 0.27;
const torre = (c: V3, n: number, lado: number, cor: string, passo: number): Pilha[] => {
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
const altTorre = (n: number) => Math.max(1, Math.ceil(n / (LADO_S * LADO_S) - 0.0005)) * ANDAR;
// na soma final todas as torres vão para a mesma escala (1 pilha = R$ 4 mi)
const ESC_FINAL = 4;
const escEm = (s: Sec, t: number) => {
  const k = rampa(t, T.somando - 0.1, T.somando + 1.2);
  return s.esc + (ESC_FINAL - s.esc) * k;
};
const coresAno = (tema: Tema): string[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  return [C.ouro, F.verde, F.rosa, tema.objeto, tom(tema.objetoEscuro, -0.55), mistura(F.dourado, F.rosa, 0.42), tom(mistura(F.rosa, F.dourado, 0.12), -0.12)];
};
const corTexto = (tema: Tema, yi: number) => (yi === 4 ? tema.textoSuave : coresAno(tema)[yi]);

const pilhasEm = (t: number, tema: Tema): Pilha[] => {
  const CA = coresAno(tema);
  const out: Pilha[] = [];
  SECS.forEach((s) => {
    const i = idx(s.id);
    const e = escEm(s, t);
    s.tv.forEach((tv, yi) => {
      const k = rampa(t, tv, tv + 0.75);
      if (k <= 0.01) return;
      out.push(...torre(posTorre(i, yi), Math.max(0.06, (s.v[yi] / e) * k), LADO_S, CA[yi], PASSO_S));
    });
  });
  return out;
};

const CASAS: [V3, number][] = [
  [[0.4, 0, 8.6], 0.2],
  [[-1.6, 0, 8.4], -0.3],
];
const ARVORES: V3[] = [
  [-0.7, 0, 8.9],
  [1.6, 0, 8.4],
];

const ativo = (id: string, t: number) => {
  const s = secDe(id);
  const fala = janela(t, s.t - 0.1, s.fim - 0.2, 0.4);
  const intro = janela(t, T0.todos + 0.25 * idx(id) * 0.3, T0.todos + 2.6, 0.3);
  const fimK = id === 'edu' ? janela(t, T.sEdu, T.qual, 0.4) : id === 'sau' ? janela(t, T.sSau, T.qual, 0.4) : id === 'adm' ? janela(t, T.sAdm, T.qual, 0.4) : id === 'ass' ? janela(t, T.sAss, T.qual, 0.4) : id === 'cul' ? janela(t, T.sCul, T.qual, 0.4) : 0;
  return Math.min(1, fala + intro + fimK);
};

const Predio: React.FC<{tema: Tema; s: Setor; i: number; t: number}> = ({tema, s, i, t}) => {
  const p = noAnel(i, R_PREDIO);
  const rot = ang(i) + Math.PI;
  const sobe = rampa(t, T0.primeiro - 0.6 + i * 0.05, T0.primeiro + 0.3 + i * 0.05);
  const aceso = ativo(s.id, t);
  const e = 0.45;
  const props = {tema, pos: p, sobe, aceso, rotY: rot, escala: e};
  switch (s.tipo) {
    case 'escola':
      return <Escola {...props} />;
    case 'posto':
      return <PostoSaude {...props} />;
    case 'rua':
      return <RuaServicos tema={tema} pos={p} rotY={rot} sobe={sobe} luz={Math.max(0.2, aceso)} caminhaoX={1.2} gariX={-1.4} />;
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
    case 'arvores': {
      if (sobe < 0.02) return null;
      const tg: V3 = [Math.cos(ang(i)), 0, -Math.sin(ang(i))];
      return (
        <group>
          {[-0.7, 0, 0.7].map((d, k) => (
            <ArvoreRedonda key={k} tema={tema} pos={soma(p, [tg[0] * d - Math.sin(ang(i)) * 0.25 * (k % 2), 0, tg[2] * d - Math.cos(ang(i)) * 0.25 * (k % 2)])} r={0.42 + 0.1 * (k % 2)} cresce={Math.min(1, sobe) * (0.75 + 0.15 * aceso)} />
          ))}
        </group>
      );
    }
    default:
      return <PredioTexto tema={tema} pos={p} rotY={rot} escala={e} sobe={sobe} aceso={aceso} texto={s.texto ?? s.nome} tipo={s.tipo as TipoPredio} />;
  }
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => (
  <group>
    <MesaMaquete tema={tema} rio={false} />
    {CASAS.map(([p, r], i) => (
      <CasaMini key={i} tema={tema} pos={p} rotY={r} luz={0.4} escala={0.5} />
    ))}
    {ARVORES.map((p, i) => (
      <ArvoreRedonda key={i} tema={tema} pos={p} r={0.5} cresce={0.7} />
    ))}
    <PilhasDinheiro pilhas={pilhasEm(t, tema)} max={12000} largura={0.75} />
    {SETORES.map((s, i) => (
      <Predio key={s.id} tema={tema} s={s} i={i} t={t} />
    ))}
  </group>
);

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const DE_CIMA = (dx = 0, perto = 1) => E([0, 0, 0], 13.5 * perto, 11.5 * perto, [dx, 2.0, 1]);
const OLHA_SETOR = (i: number, perto = 1): Cam => {
  const a = ang(i);
  const alvo: V3 = [Math.sin(a) * 6.2, 1.2, Math.cos(a) * 6.2];
  return E(alvo, 3.9 * perto, 4.4 * perto, [-Math.sin(a) * 0.62, 2.1, -Math.cos(a) * 0.62]);
};
const PERTO: Record<string, number> = {edu: 1.35, sau: 1.25, adm: 1.2, obr: 1.15};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, DE_CIMA()]]},
  {ini: T0.primeiro - 0.2, arco: 0.06, chaves: [[T0.primeiro - 0.2, DE_CIMA(0.05)], [T0.todos, DE_CIMA(0.12, 0.98)], [SECS[0].t - 0.3, DE_CIMA(0.2, 0.95)]]},
  ...SECS.map((s): Cena => {
    const i = idx(s.id);
    const pp = PERTO[s.id] ?? 1.05;
    return {ini: s.t - 0.25, arco: 0.03, chaves: [[s.t - 0.25, OLHA_SETOR(i, pp * 1.06)], [s.tv[3], OLHA_SETOR(i, pp)], [s.fim - 0.3, OLHA_SETOR(i, pp * 0.97)]]};
  }),
  {ini: T.resto - 0.2, arco: 0.04, chaves: [[T.resto - 0.2, DE_CIMA(-0.05, 0.95)], [T.somando - 0.2, DE_CIMA(0.02, 0.93)]]},
  {ini: T.somando - 0.1, arco: 0.05, chaves: [[T.somando - 0.1, DE_CIMA(0.0, 0.92)], [T.qual, DE_CIMA(0.1, 0.88)], [T.segue + 0.6, DE_CIMA(0.2, 0.9)], [FIM, DE_CIMA(0.3, 0.95)]]},
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
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const nomeDe = (id: string) => SETORES[idx(id)].nome;
const CHIPS: Txt[] = (() => {
  const c: Txt[] = [{a: T0.todos, b: SECS[0].t, texto: 'TODOS OS SETORES · 2018 A 2024'}];
  SECS.forEach((s) => {
    const detAntes = s.id === 'div';
    if (detAntes) {
      c.push({a: s.t, b: s.tDet, texto: `${nomeDe(s.id)} · 2018 A 2024`}, {a: s.tDet, b: s.tv[1], texto: s.detTxt!, destaque: true}, {a: s.tv[1], b: s.fim, texto: `${nomeDe(s.id)} · 2018 A 2024`});
    } else {
      c.push({a: s.t, b: s.tDet > 0 ? s.tDet : s.fim, texto: `${nomeDe(s.id)} · 2018 A 2024`});
      if (s.tDet > 0) c.push({a: s.tDet, b: s.fim, texto: s.detTxt!, destaque: true});
    }
  });
  c.push(
    {a: T.resto, b: T.somando, texto: 'OUTROS (JURÍDICO, TRANSPORTE): DE R$ 113 MIL A R$ 1,2 MI POR ANO'},
    {a: T.somando, b: T.qual, texto: 'SOMA DE 2018 A 2024: R$ 735,1 MI', destaque: true},
    {a: T.qual, b: T.segue, texto: 'QUAL SETOR TE SURPREENDEU?', destaque: true},
  );
  return c.sort((x, y) => x.a - y.a);
})();
const SELOS: Txt[] = [
  {a: T0.todos, b: SECS[0].t, texto: 'FONTE: DESPESA DE DEZ/2018 A DEZ/2024 · TCM-BA'},
  ...SECS.map((s) => ({a: s.t, b: s.fim, texto: `FONTE: DESPESA DE DEZ/2018 A DEZ/2024 · TCM-BA · LIQUIDADO`})),
  {a: T.resto, b: T.qual, texto: 'FONTE: BALANÇOS E DESPESA DE DEZ/2018 A DEZ/2024 · TCM-BA'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string; hist?: {txt: string; cor: string}[]};
const ROTULOS = (tema: Tema): Rot[] => {
  const CA = coresAno(tema);
  const r: Rot[] = [];
  SECS.forEach((s) => {
    const i = idx(s.id);
    s.tv.forEach((tv, yi) => {
      const b = yi + 1 < 7 ? Math.max(s.tv[yi + 1] + 0.45, tv + 1.2) : s.fim + 0.1;
      const hist = yi === 0 ? undefined : Array.from({length: yi}, (_, k) => ({txt: `${ROT_ANO[k].slice(2)} ${fmtCurto(s.v[k])}`, cor: corTexto(tema, k)}));
      const valor = s.rotulo?.[yi] ?? fmtV(s.v[yi]);
      r.push({a: tv + 0.4, b, p: soma(posTorre(i, yi), [0, altTorre(s.v[yi] / s.esc) + 0.35, 0]), valor, sub: `${nomeDe(s.id)} · ${ROT_ANO[yi]}`, cor: CA[yi], hist});
    });
  });
  // a soma dos sete anos, em cima das casinhas
  (
    [
      ['edu', T.sEdu, 348.873590],
      ['sau', T.sSau, 147.370126],
      ['adm', T.sAdm, 88.699622],
      ['ass', T.sAss, 12.627032],
      ['cul', T.sCul, 10.6685],
    ] as [string, number, number][]
  ).forEach(([id, a, v]) => r.push({a: a + 0.3, b: T.segue + 0.4, p: soma(noAnel(idx(id), R_PREDIO), [0, 2.4, 0]), valor: fmtV(v), sub: `${nomeDe(id)} · 7 ANOS`, cor: tema.acento}));
  return r;
};

const soMapa = (t: number) => t < T0.todos - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T0.todos) + 6};
const TOPO_SELO = 440;
const TOPO_CHIP = 545;

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const CA = coresAno(tema);
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const sec = SECS.filter((s) => t >= s.t - 0.1 && t < s.fim).pop();
  const escalaTxt = t >= T.somando ? `MESMA ESCALA: 1 PILHA = ${fmtEsc(ESC_FINAL)}` : sec ? `AQUI, 1 PILHA = ${fmtEsc(sec.esc)}` : '';
  const escK = sec ? janela(t, sec.t, sec.fim - 0.2, 0.4) : janela(t, T.somando + 0.3, T.segue, 0.4);
  const anoAtual = sec ? sec.tv.filter((tv) => t >= tv - 0.05).length - 1 : 6;
  if (t < T0.todos) {
    const k = Math.min(entra(t, 4.8, 0.45), 1 - rampa(t, T0.todos - 0.6, T0.todos - 0.2));
    return (
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, opacity: k}}>
        <div style={{display: 'inline-block', padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 17, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>FONTE: BALANÇOS 2018 A 2024 ENVIADOS AO TCM-BA</div>
      </div>
    );
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 200 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 120, Math.min(SEGURO.botoesX - 120, pj.x)), y: Math.max(760, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  const larg = (r: Rot) => Math.max(r.valor.length * 17, (r.sub ?? '').length * 10, (r.hist ?? []).reduce((a, h) => a + h.txt.length * 10 + 10, 0)) + 34;
  const alt = (r: Rot) => (r.hist ? 92 : r.sub ? 72 : 56);
  const bate = (a: number, y: number) => rots.slice(0, a).some((o) => Math.abs(rots[a].x - o.x) < (larg(rots[a].r) + larg(o.r)) / 2 + 8 && Math.abs(y - o.y) < Math.max(alt(o.r), alt(rots[a].r)));
  for (let a = 1; a < rots.length; a++) {
    if (!bate(a, rots[a].y)) continue;
    const y0 = rots[a].y;
    const tentativas = [-70, 70, -140, 140, -210, 210, 280].map((d) => y0 + d).filter((y) => y >= 740 && y <= 1330);
    rots[a].y = tentativas.find((y) => !bate(a, y)) ?? y0;
  }
  return (
    <>
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_SELO, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
        <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
          {seloAtual ? (
            <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 56 ? 14 : seloAtual.texto.length > 48 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>
              {seloAtual.texto}
            </div>
          ) : null}
        </div>
        {escK > 0.01 && escalaTxt ? (
          <div style={{opacity: Math.min(1, escK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
            {ROT_ANO.map((r, k) => (
              <div key={k} style={{width: 14, height: 14, borderRadius: 7, background: CA[k], border: `1.5px solid ${k <= anoAtual ? tema.texto : 'transparent'}`, opacity: k <= anoAtual ? 1 : 0.35}} />
            ))}
            <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escalaTxt}</div>
          </div>
        ) : null}
      </div>
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: TOPO_CHIP, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 52 ? 15 : chip.texto.length > 44 ? 18 : chip.texto.length > 32 ? 22 : 28} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.sub ? 30 : 26, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 14, fontWeight: 700, letterSpacing: 1.3, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
            {v.r.hist ? (
              <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4}}>
                {v.r.hist.map((h, k) => (
                  <div key={k} style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, color: h.cor}}>
                    {h.txt}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
};

// ---------- O mapa do Kit Mapas (o mesmo do 094), por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/paratingasetores1824.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera no maior número de cada setor (2024) ----------
const SOQUINHOS = [...SECS.map((s) => s.tv[6]), T.somando];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.025 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.15}));
  SECS.forEach((x) => {
    x.tv.forEach((tv) => s.push({t: tv + 0.08, f: 'pop', v: 0.13}));
    if (x.tDet > 0) s.push({t: x.tDet + 0.1, f: 'tique', v: 0.15});
  });
  [T.sEdu, T.sSau, T.sAdm, T.sAss, T.sCul].forEach((a) => s.push({t: a + 0.1, f: 'pop', v: 0.16}));
  s.push({t: T.somando + 0.2, f: 'subida', v: 0.15}, {t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

// quadros de revisão: todas as viradas de fala
export const REVISAO: number[] = [
  0.6, 3.0, 5.6, T0.todos + 0.8, T0.documento + 1.0,
  ...SECS.flatMap((s) => [s.t + 0.4, s.tv[0] + 0.9, s.tv[3] + 0.9, s.tv[6] + 0.9, ...(s.tDet > 0 ? [s.tDet + 1.0] : []), s.fim - 0.4]),
  T.resto + 1.0, T.somando + 1.5, T.sSau + 0.8, T.sAss + 0.8, T.sCul + 0.8, T.qual + 0.8, T.segue + 0.4, T.segue + 1.5, FIM - 0.4,
];
// tempos para as folhas "PDF" (lidos pelo config das folhas)
export const TEMPOS_FOLHAS = {secs: SECS.map((s) => ({id: s.id, t: s.t, tv: s.tv, tDet: s.tDet, fim: s.fim})), resto: T.resto, somando: T.somando, qual: T.qual};

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const ParatingaSetores1824: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
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
      <CabecalhoDuplo tema={tema} cidade="PARATINGA" t={t} final={T.segue} yAbertura={470} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDaguaDupla tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['735 milhões:', 'para onde', 'foi cada', 'setor.'];
export const CapaParatingaSetores1824: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 820}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo} 0px, ${tema.fundo} ${desce + 10}px, ${tema.fundo}00 ${desce + 300}px)`}} />
      <CabecalhoDuplo tema={tema} cidade="PARATINGA · 2018–2024" t={10} />
      <div style={{position: 'absolute', left: SEGURO.esq + 30, right: W - SEGURO.dir + 30, top: SEGURO.topo + 300}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: l.length > 10 ? 110 : 128, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
