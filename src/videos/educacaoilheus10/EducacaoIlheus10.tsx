import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, CasaMini, CofreFGTS, Cone, Lupa, Martelo, Onibus, PapelMulta, Van} from '../../pecas';
import {CamaraVereadores, Escola, MesaMaquete, PilhasDinheiro, PredioTCM, coresOI, type Pilha} from '../orcamentoitabuna/pecas';
import {PlacaObra, PredioTexto, Trabalhador} from '../orcamentocanavieiras/pecas';
import {PastaProcesso} from '../orcamentoparatinga/pecas';
import {PALAVRAS} from './palavras';

// 036. educação de ilhéus (perfil @eumagnoleite, série Magno Explica). Molde: 035 (Paratinga).
// O Kit Mapas abre (voo até Ilhéus: projetos/036.../mapas/ilheus.mp4). Depois, numa mesa só:
// (1) as pastas das contas de 2016 a 2024, com o carimbo do parecer do TCM e o martelo da Câmara em 2016;
// (2) o calendário de 2021 e 2022, com 11 de 12 meses atrasados; (3) a maquete de 2026: cofre no meio,
// o dinheiro voa para a escola e dela para salários e fornecedores; depois cada fornecedor, a merenda e o fecho.
// Sem nome de gestor, sem porcentagem, tom só informativo. Fontes: audio/fontes.md (checagem frase a frase).

export const FPS = 30;
const AUDIO_SEG = 148.99;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '036. educação de ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  primeiro: quando('Primeiro a nota'),
  a16: quando('Em 2016'),
  rej16: quando('pela rejeicao e apontou'),
  abaixo: quando('abaixo do minimo da Constituicao'),
  camara: quando('Mas quem da'),
  aprovou: quando('e ela aprovou'),
  a18: quando('2018 19'),
  rej18: quando('parecer pela rejeicao', 2),
  a21: quando('De 21 a 23'),
  ressalvas: quando('aprovadas com ressalvas'),
  a24: quando('2024 ainda'),
  mensal: quando('E a prestacao'),
  onze: quando('11 de 12'),
  atrasados: quando('chegaram atrasados'),
  varios: quando('Em varios meses'),
  elaboracao: quando('dizia so'),
  multas: quando('aplicou multas'),
  agora: quando('Agora 2026'),
  arrec: quando('arrecadou R$ 573'),
  pagou: quando('A educacao pagou'),
  salarios: quando('quase 134'),
  forn: quando('quase 15 milhoes'),
  forn36: quando('para 36 fornecedores'),
  transp: quando('O maior e'),
  v55: quando('escolar 5,5'),
  agosto: quando('So em agosto'),
  nf1: quando('notas R$ 764'),
  nf2: quando('mais R$ 1,026'),
  desde42: quando('Desde 2020 a mesma'),
  v42: quando('menos R$ 42'),
  caic: quando('A reforma do CAIC'),
  v35: quando('levou R$ 3,5'),
  creche: quando('A construcao de creche'),
  res3: quando('tem R$ 3 milhoes'),
  nenhum: quando('nenhum real pago'),
  merenda: quando('A merenda'),
  contrato: quando('O contrato emergencial'),
  pf: quando('virou alvo'),
  invest: quando('ainda em investigacao'),
  nega: quando('A prefeitura nega'),
  suspendeu: quando('e suspendeu'),
  julho: quando('Em julho'),
  outra: quando('pagar outra empresa'),
  ata: quando('contratada pela ata'),
  v18: quando('Goias R$ 1,8'),
  construtora: quando('uma construtora recebeu'),
  v33: quando('menos R$ 33'),
  predios: quando('manutencao de predios'),
  outubro: quando('Em outubro'),
  devolver: quando('determinou devolver'),
  fundeb: quando('ao FUNDEB'),
  ref14: quando('referentes a 2014'),
  mp: quando('E o Ministerio'),
  v25: quando('se 2025 cumpriu'),
  semJulg: quando('ainda sem julgamento'),
  segue: quando('Segue o'),
};

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const ANDAR = 0.75;
const torre = (c: V3, n: number, lado: number, cor: string, passo = 0.38): Pilha[] => {
  const s: Pilha[] = [];
  const porAndar = lado * lado;
  for (let j = 0; j < Math.ceil(n - 0.0005); j++) {
    const andar = Math.floor(j / porAndar);
    const k = j % porAndar;
    s.push({p: [c[0] + ((k % lado) - (lado - 1) / 2) * passo, c[1] + andar * ANDAR, c[2] + (Math.floor(k / lado) - (lado - 1) / 2) * passo], n: Math.min(1, n - j), cor});
  }
  return s;
};
const altTorre = (n: number, lado: number) => Math.max(1, Math.ceil(n / (lado * lado) - 0.0005)) * ANDAR;

// ---------- Parte 1: as pastas das contas (2016 a 2024) ----------
type Conta = {ano: string; carimbos: [number, string, 'rej' | 'ok' | 'res' | 'neutro'][]; t: number};
const CONTAS: Conta[] = [
  {ano: '2016', t: T.a16, carimbos: [[T.rej16, 'REJEIÇÃO', 'rej'], [T.aprovou, 'CÂMARA APROVOU', 'ok']]},
  {ano: '2017', t: T.a16 + 0.2, carimbos: [[T.ressalvas + 0.3, 'RESSALVAS', 'res']]},
  {ano: '2018', t: T.a16 + 0.4, carimbos: [[T.a18 + 0.1, 'REJEIÇÃO', 'rej']]},
  {ano: '2019', t: T.a16 + 0.6, carimbos: [[T.a18 + 1.2, 'REJEIÇÃO', 'rej']]},
  {ano: '2020', t: T.a16 + 0.8, carimbos: [[T.a18 + 2.1, 'REJEIÇÃO', 'rej']]},
  {ano: '2021', t: T.a16 + 1.0, carimbos: [[T.a21 + 0.2, 'RESSALVAS', 'res']]},
  {ano: '2022', t: T.a16 + 1.2, carimbos: [[T.a21 + 0.5, 'RESSALVAS', 'res']]},
  {ano: '2023', t: T.a16 + 1.4, carimbos: [[T.a21 + 0.8, 'RESSALVAS', 'res']]},
  {ano: '2024', t: T.a16 + 1.6, carimbos: [[T.a24 + 0.2, 'NÃO JULGADO', 'neutro']]},
];
const posConta = (i: number): V3 => [-5.2 + i * 1.3, 0, -1.2 - Math.abs(i - 4) * 0.12];
const CONTAS_VIS = (t: number) => vis(t, T.a16 - 0.6, T.mensal + 0.2);
const CAMARA_POS: V3 = [-5.6, 0, -4.4];
const TCM_POS: V3 = [3.4, 0, -4.6];

// ---------- Parte 2: o calendário de 2021 e 2022 ----------
const NO_PRAZO = [8, 3]; // 2021: setembro; 2022: abril (únicos meses entregues no prazo)
const posMes = (ano: number, m: number): V3 => [-4.4 + m * 0.8, 0, 0.3 + ano * 1.25];
const CAL_VIS = (t: number) => vis(t, T.mensal - 0.2, T.agora + 0.3);
const atrasa = (ano: number, m: number) => {
  // ordem: os 22 meses atrasados acendem um a um a partir do "11 de 12"
  let ordem = 0;
  for (let a = 0; a < 2; a++) for (let k = 0; k < 12; k++) {
    if (k === NO_PRAZO[a]) continue;
    if (a === ano && k === m) return T.onze + ordem * 0.09;
    ordem++;
  }
  return Infinity;
};

// ---------- Parte 3: a maquete de 2026 ----------
type Lugar = {id: string; nome: string};
const LUGARES_2026: Lugar[] = [
  {id: 'esc', nome: 'EDUCAÇÃO'},
  {id: 'sal', nome: 'SALÁRIOS E ENCARGOS'},
  {id: 'for', nome: '36 FORNECEDORES'},
  {id: 'oni', nome: 'TRANSPORTE ESCOLAR'},
  {id: 'caic', nome: 'CAIC'},
  {id: 'cre', nome: 'CRECHE'},
  {id: 'mer', nome: 'MERENDA'},
  {id: 'pre', nome: 'PRÉDIOS PÚBLICOS'},
  {id: 'fun', nome: 'FUNDEB'},
  {id: 'mp', nome: '2025'},
];
const R_M = 6.4;
const angM = (i: number) => 0.08 * Math.PI + i * 0.19 * Math.PI;
const noAnel = (i: number, r = R_M): V3 => [Math.sin(angM(i)) * r, 0, Math.cos(angM(i)) * r];
const iM = (id: string) => LUGARES_2026.findIndex((l) => l.id === id);
const posTorre = (id: string): V3 => {
  const i = iM(id);
  const a = angM(i);
  const r = R_M - 1.9;
  return [Math.sin(a) * r + Math.cos(a) * 0.9, 0, Math.cos(a) * r - Math.sin(a) * 0.9];
};
const MAQ_VIS = (t: number) => rampa(t, T.agora - 0.2, T.agora + 0.7);
const SOBE_M: Record<string, number> = {esc: T.pagou, sal: T.salarios, for: T.forn, oni: T.transp, caic: T.caic, cre: T.creche, mer: T.merenda, pre: T.construtora, fun: T.outubro, mp: T.mp};
const ESC10 = 10; // 1 pilha = R$ 10 milhões (cofre, escola, salários, fornecedores)
const ESC05 = 0.5; // nos fornecedores: 1 pilha = R$ 500 mil
const CEN = {arrec: 57.317, edu: 150.17, sal: 133.61, forn: 14.86, oni: 5.5, caic: 3.47, cre: 3.21, mer: 1.81};
const LUGAR_COFRE: V3[] = (() => {
  const s: V3[] = [];
  ([[1.55, 16], [2.05, 20], [2.55, 24]] as [number, number][]).forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + r;
      s.push([Math.sin(a) * r, 0, Math.cos(a) * r]);
    }
  });
  return s;
})();

const pilhasEm = (t: number, tema: Tema): {solidas: Pilha[]; fantasmas: Pilha[]; voando: Pilha[]} => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const solidas: Pilha[] = [];
  const fantasmas: Pilha[] = [];
  const voando: Pilha[] = [];
  const m = MAQ_VIS(t);
  if (m < 0.01) return {solidas, fantasmas, voando};
  const nasce = rampa(t, T.arrec, T.arrec + 1.0);
  const k0 = rampa(t, T.pagou + 0.1, T.pagou + 1.3); // cofre -> escola
  const k1 = rampa(t, T.salarios + 0.1, T.salarios + 1.2); // escola -> salários
  const k2 = rampa(t, T.forn + 0.1, T.forn + 0.9); // escola -> fornecedores
  // o cofre: 57 pilhas; 15 saem para a escola
  const total = ((CEN.arrec * 10) / ESC10) * nasce; // 573,17 mi = 57,3 pilhas
  const saem = CEN.edu / ESC10;
  for (let j = 0; j < LUGAR_COFRE.length && j < Math.ceil(total - 0.0005); j++) {
    if (j < saem && k0 > 0) continue; // as 15 primeiras saem voando para a escola
    const fora = 1 - rampa(t, T.transp - 0.6, T.transp + 0.2) + rampa(t, T.segue - 0.3, T.segue + 0.6);
    if (fora > 0.01) solidas.push({p: [LUGAR_COFRE[j][0], LUGAR_COFRE[j][1] - 1.2 * (1 - Math.min(1, fora)), LUGAR_COFRE[j][2]], n: Math.min(1, total - j) * Math.min(1, fora), cor: C.ouro});
  }
  // voos: 15 pilhas do cofre para a escola
  const pEsc = posTorre('esc');
  if (k0 > 0 && k0 < 1) for (let j = 0; j < 15; j++) voando.push({p: curva(LUGAR_COFRE[j], soma(pEsc, [0, 0.3, 0]), 2.6, Math.min(1, k0 * 1.2 - j * 0.012)), n: 1, cor: C.ouro});
  const naEscola = saem * (k0 >= 1 ? 1 : 0) - (CEN.sal / ESC10) * k1 - (CEN.forn / ESC10) * k2;
  if (naEscola > 0.02) solidas.push(...torre(pEsc, naEscola, 3, C.ouro));
  const pSal = posTorre('sal');
  const pFor = posTorre('for');
  if (k1 > 0) solidas.push(...torre(pSal, (CEN.sal / ESC10) * k1, 3, mistura(C.ouro, F.azul, 0.55)));
  if (k2 > 0) solidas.push(...torre(pFor, (CEN.forn / ESC10) * k2, 3, mistura(C.ouro, F.rosa, 0.5)));
  if (k1 > 0 && k1 < 1) for (let j = 0; j < 4; j++) voando.push({p: curva(pEsc, pSal, 1.8, Math.min(1, Math.max(0, k1 * 1.3 - j * 0.1))), n: 1, cor: mistura(C.ouro, F.azul, 0.55)});
  if (k2 > 0 && k2 < 1) voando.push({p: curva(pEsc, pFor, 2.4, k2), n: 1, cor: mistura(C.ouro, F.rosa, 0.5)});
  // fornecedores (aqui, 1 pilha = R$ 500 mil)
  const cF = mistura(C.ouro, F.rosa, 0.5);
  const kO = rampa(t, T.v55, T.v55 + 1.2);
  if (kO > 0) solidas.push(...torre(posTorre('oni'), (CEN.oni / ESC05) * kO, 3, cF, 0.34));
  const kC = rampa(t, T.v35, T.v35 + 1.0);
  if (kC > 0) solidas.push(...torre(posTorre('caic'), (CEN.caic / ESC05) * kC, 3, cF, 0.34));
  const kR = rampa(t, T.res3, T.res3 + 0.8);
  if (kR > 0) fantasmas.push(...torre(posTorre('cre'), (CEN.cre / ESC05) * kR, 3, tema.objetoClaro, 0.34));
  const kM = rampa(t, T.v18, T.v18 + 1.0);
  if (kM > 0) solidas.push(...torre(posTorre('mer'), (CEN.mer / ESC05) * kM, 3, cF, 0.34));
  // FUNDEB: quase 5 milhões (10 pilhas de 500 mil) voltam para o cofrinho
  const kF = rampa(t, T.fundeb, T.fundeb + 1.2);
  if (kF > 0) solidas.push(...torre(posTorre('fun'), 9.94 * kF, 3, C.alerta, 0.34));
  return {solidas: solidas.map((s) => ({...s, n: s.n * m})), fantasmas, voando};
};

const ARVORES: V3[] = [
  [-7.4, 0, 2.2],
  [7.3, 0, -2.6],
  [-2.2, 0, -7.4],
];

const MundoContas: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const k = CONTAS_VIS(t);
  const corDe = (tipo: string) => (tipo === 'rej' ? C.alerta : tipo === 'ok' ? mistura(F.verde, tema.texto, 0.2) : tipo === 'res' ? mistura(C.ouro, tema.texto, 0.25) : mistura(tema.objetoClaro, tema.texto, 0.3));
  const cam = vis(t, T.camara - 0.2, T.mensal);
  return (
    <group>
      {CONTAS.map((c, i) => {
        const ativos = c.carimbos.filter(([a]) => t >= a);
        const atual = ativos.length ? ativos[ativos.length - 1] : c.carimbos[0];
        const kc = ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0;
        const prox = CONTAS.map((x) => x.carimbos[x.carimbos.length - 1][0]);
        return (
          <PastaProcesso
            key={c.ano}
            tema={tema}
            pos={posConta(i)}
            rotY={(4 - i) * 0.05}
            escala={0.72}
            sobe={rampa(t, c.t - 0.1, c.t + 0.45) * k}
            titulo={c.ano}
            carimbo={kc}
            textoCarimbo={atual[1]}
            corCarimbo={corDe(atual[2])}
            aceso={janela(t, c.carimbos[0][0], Math.min(...prox.filter((x) => x > c.carimbos[0][0] + 0.5), T.mensal), 0.4)}
          />
        );
      })}
      <CamaraVereadores tema={tema} pos={CAMARA_POS} sobe={cam} aceso={janela(t, T.camara, T.a18, 0.4)} escala={0.62} />
      {cam > 0.05 ? <Martelo tema={tema} pos={soma(CAMARA_POS, [2.0, 0, 1.4])} escala={0.55 * Math.min(1, cam)} bate={janela(t, T.aprovou - 0.2, T.aprovou + 0.3, 0.2)} rotY={0.4} /> : null}
      <PredioTCM tema={tema} pos={TCM_POS} sobe={vis(t, T.primeiro - 0.2, T.agora)} aceso={Math.max(janela(t, T.rej16, T.camara, 0.4), janela(t, T.multas, T.agora, 0.4))} escala={0.48} />
    </group>
  );
};

const MundoCalendario: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const k = CAL_VIS(t);
  if (k < 0.01) return null;
  const s = Math.min(1, k);
  const papel = rampa(t, T.elaboracao - 0.3, T.elaboracao + 1.0);
  const multa = rampa(t, T.multas, T.multas + 1.1);
  return (
    <group position={[0, -1.2 * (1 - s), 0]}>
      {[0, 1].map((a) => (
        <group key={a}>
          <Placa tema={tema} pos={soma(posMes(a, -1.3), [0, 0.35, 0])} larg={1.1} alt={0.42} linhas={[{t: a === 0 ? '2021' : '2022', tam: 220, cor: tema.texto, peso: 900}]} fundo={tema.cartao} brilho={0.3} />
          {Array.from({length: 12}, (_, m) => {
            const ta = atrasa(a, m);
            const vermelho = rampa(t, ta, ta + 0.3);
            const verde = m === NO_PRAZO[a] ? rampa(t, T.onze + 2.2, T.onze + 2.6) : 0;
            const cor = mistura(mistura(tema.objeto, C.alerta, vermelho), mistura(F.verde, tema.objeto, 0.3), verde);
            return <Caixa key={m} args={[0.66, 0.16 + 0.12 * vermelho, 0.9]} raio={0.04} cor={cor} position={soma(posMes(a, m), [0, 0.08 + 0.06 * vermelho, 0])} />;
          })}
        </group>
      ))}
      {papel > 0.01 ? <PapelMulta tema={tema} pos={curva([-2.5, 3.5, -1.0], [-0.6, 0.6, 0.9], 1.2, papel)} rot={[-1.2 * papel, 0.2, 0.1]} escala={0.9} texto="EM ELABORAÇÃO" /> : null}
      {multa > 0.01 ? <PapelMulta tema={tema} pos={curva(soma(TCM_POS, [0, 2.2, 0]), [2.2, 0.5, 1.4], 1.8, multa)} rot={[-1.1 * multa, -0.3, 0]} escala={0.9} texto="MULTA" /> : null}
    </group>
  );
};

const Construcao: React.FC<{tema: Tema; pos: V3; rotY: number; sobe: number; aceso: number; t: number}> = ({tema, pos, rotY, sobe, aceso, t}) => {
  if (sobe < 0.02) return null;
  const C = coresOI(tema);
  return (
    <group>
      <PredioTexto tema={tema} pos={pos} rotY={rotY} escala={0.5} sobe={sobe} aceso={aceso} texto="CAIC" tipo="galpao" />
      {[-0.9, 0.9].map((d, k) => (
        <Cone key={k} tema={tema} pos={soma(pos, [Math.cos(rotY) * d, 0, -Math.sin(rotY) * d + 1.0])} k={Math.min(1, sobe)} />
      ))}
      <Trabalhador tema={tema} pos={soma(pos, [Math.cos(rotY) * 0.4, 0, -Math.sin(rotY) * 0.4 + 1.2])} rotY={rotY + Math.sin(t) * 0.3} passo={(t * 1.5) % 1} cor={C.ouro} />
    </group>
  );
};

const MundoMaquete: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresOI(tema);
  const m = MAQ_VIS(t);
  if (m < 0.01) return null;
  const {solidas, fantasmas, voando} = pilhasEm(t, tema);
  const sobe = (id: string) => rampa(t, SOBE_M[id] - 0.15, SOBE_M[id] + 0.6) * m;
  const rot = (id: string) => angM(iM(id)) + Math.PI;
  const aceso = (id: string, ate: number) => janela(t, SOBE_M[id], ate, 0.4);
  const abre = janela(t, T.arrec, T.forn + 1, 0.6);
  const oniAnda = rampa(t, T.transp, T.transp + 3.5);
  const van = rampa(t, T.outra, T.outra + 2.2);
  const pMer = noAnel(iM('mer'));
  return (
    <group>
      <CofreFGTS tema={tema} pos={[0, -1.6 * (1 - Math.min(1, m * (1 - rampa(t, T.transp - 0.6, T.transp + 0.3) + rampa(t, T.segue - 0.3, T.segue + 0.6)))), 0]} escala={0.6} abre={abre} trava={0} brilho={0.2 * abre} />
      <PilhasDinheiro pilhas={solidas} max={2400} largura={0.75} />
      <PilhasDinheiro pilhas={voando} max={300} largura={0.75} />
      <PilhasDinheiro pilhas={fantasmas} max={200} opacidade={0.28} largura={1.06} />
      <Escola tema={tema} pos={noAnel(iM('esc'))} sobe={sobe('esc')} aceso={Math.max(aceso('esc', T.transp), janela(t, T.mp, FIM + 1, 0.4))} rotY={rot('esc')} escala={0.62} />
      <PredioTexto tema={tema} pos={noAnel(iM('sal'))} rotY={rot('sal')} escala={0.5} sobe={sobe('sal')} aceso={aceso('sal', T.forn)} texto="SALÁRIOS" tipo="colunas" />
      <PredioTexto tema={tema} pos={noAnel(iM('for'))} rotY={rot('for')} escala={0.5} sobe={sobe('for')} aceso={aceso('for', T.transp)} texto="FORNECEDORES" tipo="galpao" />
      {sobe('oni') > 0.05 ? <Onibus tema={tema} pos={soma(noAnel(iM('oni'), R_M + 0.2), [Math.cos(angM(iM('oni'))) * (1.2 - 2.4 * oniAnda), 0, -Math.sin(angM(iM('oni'))) * (1.2 - 2.4 * oniAnda)])} rotY={angM(iM('oni')) + Math.PI / 2} escala={0.5 * Math.min(1, sobe('oni'))} farol={aceso('oni', T.caic)} /> : null}
      {[T.nf1, T.nf2].map((tn, k) => {
        const q = rampa(t, tn, tn + 0.9) * (1 - rampa(t, T.caic, T.caic + 0.4));
        if (q < 0.01) return null;
        const alvo = soma(posTorre('oni'), [-0.9 + k * 0.6, 0.15, 0.9]);
        return <PapelMulta key={k} tema={tema} pos={curva(soma(alvo, [0, 3.2, 0]), alvo, 0.3, q)} rot={[-1.4 * q, 0.3 - 0.6 * k, 0]} escala={0.62} texto={k === 0 ? 'NF R$ 764 MIL' : 'NF R$ 1,026 MI'} />;
      })}
      <Construcao tema={tema} pos={noAnel(iM('caic'))} rotY={rot('caic')} sobe={sobe('caic')} aceso={aceso('caic', T.creche)} t={t} />
      <PlacaObra tema={tema} pos={noAnel(iM('cre'))} rotY={rot('cre')} escala={1.1} sobe={sobe('cre')} carimbo={rampa(t, T.nenhum, T.nenhum + 0.4)} titulo="CRECHE" cor={C.alerta} />
      <PredioTexto tema={tema} pos={pMer} rotY={rot('mer')} escala={0.5} sobe={sobe('mer')} aceso={aceso('mer', T.construtora)} texto="MERENDA" tipo="casinha" />
      {(() => {
        const ativos: [number, string][] = [[T.pf, 'EM INVESTIGAÇÃO'], [T.suspendeu, 'PAGAMENTOS SUSPENSOS']].filter(([a]) => t >= (a as number)) as [number, string][];
        const atual = ativos.length ? ativos[ativos.length - 1] : ([T.pf, 'EM INVESTIGAÇÃO'] as [number, string]);
        return (
          <PastaProcesso
            tema={tema}
            pos={soma(noAnel(iM('mer'), R_M - 2.4), [0, 0, 0])}
            rotY={rot('mer')}
            escala={1.0}
            sobe={vis(t, T.contrato - 0.1, T.julho + 0.2) * m}
            titulo="CONTRATO EMERGENCIAL"
            valor="R$ 15,5 MI"
            carimbo={ativos.length ? rampa(t, atual[0], atual[0] + 0.4) : 0}
            textoCarimbo={atual[1]}
            corCarimbo={mistura(C.ouro, tema.texto, 0.35)}
            aceso={janela(t, T.contrato, T.julho, 0.4)}
          />
        );
      })()}
      {van > 0.01 ? <Van tema={tema} pos={soma(pMer, [Math.cos(angM(iM('mer'))) * (2.6 - 1.8 * van), 0, -Math.sin(angM(iM('mer'))) * (2.6 - 1.8 * van) + 0.9])} rotY={angM(iM('mer')) - Math.PI / 2} escala={0.45} /> : null}
      <PredioTexto tema={tema} pos={noAnel(iM('pre'))} rotY={rot('pre')} escala={0.5} sobe={sobe('pre')} aceso={aceso('pre', T.outubro)} texto="PRÉDIOS" tipo="colunas" />
      {sobe('pre') > 0.05 ? [-0.8, 0.8].map((d, k) => <Cone key={k} tema={tema} pos={soma(noAnel(iM('pre'), R_M - 1.3), [Math.cos(angM(iM('pre'))) * d, 0, -Math.sin(angM(iM('pre'))) * d])} k={Math.min(1, sobe('pre'))} />) : null}
      <PastaProcesso tema={tema} pos={noAnel(iM('fun'))} rotY={rot('fun')} escala={1.0} sobe={sobe('fun')} titulo="FUNDEB · 2014" valor="R$ 4,97 MI" carimbo={rampa(t, T.devolver, T.devolver + 0.4)} textoCarimbo="DEVOLVER" corCarimbo={C.alerta} aceso={aceso('fun', T.mp)} />
      <PastaProcesso tema={tema} pos={noAnel(iM('mp'))} rotY={rot('mp')} escala={1.0} sobe={sobe('mp')} titulo="2025 · MÍNIMO" valor="EDUCAÇÃO" carimbo={rampa(t, T.semJulg, T.semJulg + 0.4)} textoCarimbo="SEM JULGAMENTO" corCarimbo={mistura(C.ouro, tema.texto, 0.35)} aceso={aceso('mp', T.segue)} />
      {sobe('mp') > 0.05 ? <Lupa tema={tema} pos={soma(noAnel(iM('mp'), R_M - 1.2), [0, 1.4 + 0.15 * Math.sin(t * 2), 0])} rot={[0, angM(iM('mp')), 0.3]} escala={0.6 * Math.min(1, sobe('mp'))} /> : null}
    </group>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => (
  <group>
    <MesaMaquete tema={tema} rio={false} />
    <CasaMini tema={tema} pos={[-6.8, 0, -4.8]} rotY={0.6} luz={0.4} escala={0.5} />
    <CasaMini tema={tema} pos={[6.9, 0, 4.2]} rotY={-2.2} luz={0.4} escala={0.5} />
    {ARVORES.map((p, i) => (
      <ArvoreRedonda key={i} tema={tema} pos={p} r={0.55} cresce={0.7} />
    ))}
    <MundoContas t={t} tema={tema} />
    <MundoCalendario t={t} tema={tema} />
    <MundoMaquete t={t} tema={tema} />
  </group>
);

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const OLHA = (id: string, perto = 1, dy = 1.0): Cam => {
  const a = angM(iM(id));
  const alvo: V3 = [Math.sin(a) * (R_M - 0.9) + Math.cos(a) * 0.45, dy, Math.cos(a) * (R_M - 0.9) - Math.sin(a) * 0.45];
  return E(alvo, 3.7 * perto, 3.9 * perto, [-Math.sin(a) * 0.8, 0.85, -Math.cos(a) * 0.8]);
};
const PASTA = (i: number, larg = 4.2) => E(soma(posConta(i), [0, 1.1, 0]), larg, larg, [0.05 * (i - 4), 0.7, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 0.8, -1.2], 14, 9, [0, 1.2, 1])]]},
  {
    ini: T.primeiro - 0.2,
    arco: 0.03,
    chaves: [
      [T.primeiro - 0.2, E([0, 1.0, -1.5], 13, 8.5, [0, 1.0, 1])],
      [T.a16 + 0.2, PASTA(0, 4.6)],
      [T.camara - 0.4, PASTA(0, 4.8)],
      [T.camara + 0.3, E(soma(CAMARA_POS, [1.0, 1.0, 1.2]), 5.4, 5.0, [0.15, 0.75, 1])],
      [T.a18 - 0.3, E(soma(CAMARA_POS, [1.0, 1.0, 1.2]), 5.2, 4.8, [0.2, 0.75, 1])],
      [T.a18 + 0.2, E(soma(posConta(3), [0, 1.1, 0]), 6.0, 5.0, [0, 0.75, 1])],
      [T.a21 - 0.2, E(soma(posConta(3), [0.3, 1.1, 0]), 6.0, 5.0, [0.05, 0.75, 1])],
      [T.a21 + 0.3, E(soma(posConta(6), [0, 1.1, 0]), 6.0, 5.0, [0.05, 0.75, 1])],
      [T.a24 - 0.2, E(soma(posConta(6.5), [0, 1.1, 0]), 6.0, 5.0, [0.08, 0.75, 1])],
      [T.a24 + 0.3, PASTA(8, 4.6)],
      [T.mensal - 0.3, PASTA(8, 4.8)],
    ],
  },
  {
    ini: T.mensal - 0.1,
    arco: 0.04,
    chaves: [
      [T.mensal - 0.1, E([0, 0.3, 1.0], 10.5, 7.5, [0, 1.6, 1])],
      [T.onze, E([0, 0.3, 0.9], 9.6, 6.8, [0.02, 1.7, 1])],
      [T.varios, E([-0.8, 0.5, 0.8], 8.0, 6.4, [-0.05, 1.3, 1])],
      [T.multas, E([1.4, 0.8, -0.8], 9.0, 7.0, [0.12, 1.1, 1])],
      [T.agora - 0.3, E([1.2, 0.8, -0.8], 9.4, 7.2, [0.15, 1.1, 1])],
    ],
  },
  {
    ini: T.agora - 0.1,
    arco: 0.05,
    chaves: [
      [T.agora - 0.1, E([0, 0, 0.5], 13.5, 10, [0, 1.8, 1])],
      [T.arrec, E([0, 0.4, 0.8], 8.8, 7.0, [0, 1.2, 1])],
      [T.pagou - 0.2, E([0, 0.4, 0.8], 9.4, 7.2, [0.05, 1.2, 1])],
      [T.pagou + 1.0, E(soma(noAnel(0, 3.6), [0, 0.6, 0]), 8.6, 7.2, [Math.sin(angM(0)) * 0.6, 1.1, 1])],
      [T.salarios, E(soma(noAnel(1, 3.8), [0, 0.6, 0]), 9.0, 7.4, [Math.sin(angM(1)) * 0.6, 1.1, 1])],
      [T.forn, E(soma(noAnel(1.6, 3.8), [0, 0.6, 0]), 9.0, 7.4, [Math.sin(angM(1.6)) * 0.6, 1.1, 1])],
      [T.transp - 0.4, E(soma(noAnel(1.8, 3.8), [0, 0.6, 0]), 9.0, 7.4, [Math.sin(angM(1.8)) * 0.6, 1.1, 1])],
    ],
  },
  {ini: T.transp - 0.2, arco: 0.03, chaves: [[T.transp - 0.2, OLHA('oni', 1.15)], [T.nf1, OLHA('oni', 1.0)], [T.desde42, OLHA('oni', 1.1)], [T.caic - 0.5, OLHA('oni', 1.15)]]},
  {ini: T.caic - 0.2, arco: 0.03, chaves: [[T.caic - 0.2, OLHA('caic', 1.1)], [T.creche - 0.5, OLHA('caic', 1.05)]]},
  {ini: T.creche - 0.2, arco: 0.03, chaves: [[T.creche - 0.2, OLHA('cre', 1.0)], [T.merenda - 0.5, OLHA('cre', 0.95)]]},
  {ini: T.merenda - 0.2, arco: 0.03, chaves: [[T.merenda - 0.2, OLHA('mer', 1.15)], [T.contrato, OLHA('mer', 1.25, 1.2)], [T.julho, OLHA('mer', 1.3, 1.2)], [T.outra, OLHA('mer', 1.15)], [T.construtora - 0.5, OLHA('mer', 1.1)]]},
  {ini: T.construtora - 0.2, arco: 0.03, chaves: [[T.construtora - 0.2, OLHA('pre', 1.1)], [T.outubro - 0.5, OLHA('pre', 1.05)]]},
  {ini: T.outubro - 0.2, arco: 0.03, chaves: [[T.outubro - 0.2, OLHA('fun', 1.1)], [T.mp - 0.5, OLHA('fun', 1.05)]]},
  {ini: T.mp - 0.2, arco: 0.04, chaves: [[T.mp - 0.2, OLHA('mp', 1.1)], [T.segue - 0.4, OLHA('mp', 1.05)], [T.segue, E([0, 0, 0.4], 13.5, 10, [0.2, 1.5, 1])], [FIM, E([0, 0, 0.4], 14.5, 10.5, [0.35, 1.5, 1])]]},
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
  [0, 'EDUCAÇÃO EM ILHÉUS · 10 ANOS'],
  [T.primeiro, 'A NOTA DAS CONTAS'],
  [T.mensal, 'A PRESTAÇÃO MENSAL'],
  [T.agora, '2026 · ATÉ AGOSTO'],
  [T.merenda, 'A MERENDA'],
  [T.construtora, 'E TEM MAIS'],
];
type Txt = {a: number; b?: number; texto: string; destaque?: boolean};
const CHIPS0: Txt[] = [
  {a: T.primeiro, texto: 'A NOTA DAS CONTAS: PARECER DO TCM'},
  {a: T.a16, texto: '2016: PARECER PELA REJEIÇÃO', destaque: true},
  {a: T.abaixo, texto: 'EDUCAÇÃO ABAIXO DO MÍNIMO DA CONSTITUIÇÃO'},
  {a: T.camara, texto: 'QUEM JULGA É A CÂMARA DE VEREADORES'},
  {a: T.aprovou, texto: '2016: A CÂMARA APROVOU AS CONTAS', destaque: true},
  {a: T.a18, texto: '2018, 2019 E 2020: PARECER PELA REJEIÇÃO', destaque: true},
  {a: T.a21, texto: '2021 A 2023: APROVADAS COM RESSALVAS'},
  {a: T.a24, texto: '2024: AINDA NÃO JULGADO'},
  {a: T.mensal, texto: 'A PRESTAÇÃO DE CONTAS DE CADA MÊS'},
  {a: T.onze, texto: '2021 E 2022: 11 DE 12 MESES ATRASADOS', destaque: true},
  {a: T.varios, texto: 'NO LUGAR DO RELATÓRIO: "EM ELABORAÇÃO"'},
  {a: T.multas, texto: 'O TRIBUNAL APLICOU MULTAS POR ATRASO'},
  {a: T.agora, texto: '2026 · ATÉ AGOSTO'},
  {a: T.arrec, texto: 'ILHÉUS ARRECADOU R$ 573 MILHÕES'},
  {a: T.pagou, texto: 'A EDUCAÇÃO PAGOU R$ 150 MILHÕES', destaque: true},
  {a: T.salarios, texto: 'SALÁRIOS E ENCARGOS: QUASE R$ 134 MI'},
  {a: T.forn, texto: '36 FORNECEDORES: QUASE R$ 15 MI'},
  {a: T.transp, texto: 'TRANSPORTE ESCOLAR: R$ 5,5 MI EM 2026'},
  {a: T.agosto, texto: 'SÓ EM AGOSTO, DUAS NOTAS'},
  {a: T.nf1, texto: 'R$ 764 MIL + R$ 1,026 MI (PROC 1275)', destaque: true},
  {a: T.desde42, texto: 'DESDE 2020: PELO MENOS R$ 42 MI', destaque: true},
  {a: T.caic, texto: 'REFORMA DO CAIC: R$ 3,5 MI EM 2026'},
  {a: T.creche, texto: 'CONSTRUÇÃO DE CRECHE: R$ 3 MI RESERVADOS'},
  {a: T.nenhum, texto: 'PAGO ATÉ AGOSTO: R$ 0', destaque: true},
  {a: T.merenda, texto: 'A MERENDA'},
  {a: T.contrato, texto: 'CONTRATO EMERGENCIAL: R$ 15,5 MI'},
  {a: T.pf, texto: 'OPERAÇÃO DA PF EM MAIO · EM INVESTIGAÇÃO', destaque: true},
  {a: T.nega, texto: 'A PREFEITURA NEGA IRREGULARIDADE'},
  {a: T.suspendeu, texto: 'PAGAMENTOS SUSPENSOS EM JUNHO'},
  {a: T.julho, texto: 'JULHO: OUTRA EMPRESA DE MERENDA'},
  {a: T.ata, texto: 'ATA DE PREÇOS DE UMA CIDADE DE GOIÁS: R$ 1,8 MI'},
  {a: T.construtora, texto: 'UMA CONSTRUTORA, DESDE 2020: PELO MENOS R$ 33 MI'},
  {a: T.predios, texto: 'MANUTENÇÃO DE PRÉDIOS PÚBLICOS'},
  {a: T.outubro, texto: 'TCM: DEVOLVER QUASE R$ 5 MI AO FUNDEB', destaque: true},
  {a: T.ref14, texto: 'REFERENTES A 2014'},
  {a: T.mp, texto: 'MP QUESTIONA O MÍNIMO DA EDUCAÇÃO EM 2025'},
  {a: T.semJulg, texto: 'AINDA SEM JULGAMENTO'},
  {a: T.segue, texto: '@eumagnoleite', destaque: true},
];
const CHIPS: Txt[] = CHIPS0.map((c, i) => ({...c, b: CHIPS0[i + 1]?.a ?? FIM + 1}));
const SELOS: Txt[] = [
  {a: T.primeiro, b: T.mensal, texto: 'FONTE: TCM-BA · CONTAS ANUAIS · PARECERES PRÉVIOS'},
  {a: T.mensal, b: T.agora, texto: 'FONTE: e-TCM CONSULTA PÚBLICA · TCM 16840e21 E 01426e23'},
  {a: T.agora, b: T.pagou, texto: 'FONTE: PCMGE016 AGO/2026 ENVIADO AO TCM-BA'},
  {a: T.pagou, b: T.transp, texto: 'FONTE: PCMGE015 E PCMGE056 · FUNDO DE EDUCAÇÃO · AGO/2026'},
  {a: T.transp, b: T.caic, texto: 'FONTE: PCMGE056 · FUNDO DE EDUCAÇÃO · 2020 A AGO/2026'},
  {a: T.caic, b: T.merenda, texto: 'FONTE: PCMGE015 E PCMGE056 · AGO/2026'},
  {a: T.merenda, b: T.julho, texto: 'FONTE: BAHIA NOTÍCIAS E A TARDE (21/05/2026) · BNEWS (11/06/2026)'},
  {a: T.julho, b: T.construtora, texto: 'FONTE: PCMGE056 · FUNDO DE EDUCAÇÃO · JUL E AGO/2026'},
  {a: T.construtora, b: T.outubro, texto: 'FONTE: PCMGE056 · FUNDO DE EDUCAÇÃO · 2020 A AGO/2026'},
  {a: T.outubro, b: T.mp, texto: 'FONTE: TCM-BA · PROCESSO 22876e21 (06/10/2026)'},
  {a: T.mp, b: T.segue, texto: 'FONTE: TCM-BA · PROCESSO 10561e26 (NÃO JULGADO)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, (x.b ?? FIM) - 0.35, (x.b ?? FIM) - 0.05));

type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: string};
const ROTULOS = (tema: Tema): Rot[] => {
  const C = coresOI(tema);
  const F = tema.festa!;
  const cF = mistura(C.ouro, F.rosa, 0.5);
  const topo = (id: string, n: number, d = 0.35) => soma(posTorre(id), [0, altTorre(n, 3) + d, 0]);
  return [
    {a: T.arrec + 1.0, b: T.pagou + 0.6, p: [0, 1.6, 0], valor: 'R$ 573 MI', sub: 'ARRECADOU · ATÉ AGOSTO', cor: C.ouro},
    {a: T.pagou + 1.3, b: T.salarios + 0.6, p: topo('esc', 15), valor: 'R$ 150 MI', sub: 'EDUCAÇÃO PAGOU', cor: C.ouro},
    {a: T.salarios + 1.0, b: T.transp, p: topo('sal', 13.4), valor: 'R$ 133,6 MI', sub: 'SALÁRIOS E ENCARGOS', cor: mistura(C.ouro, F.azul, 0.55)},
    {a: T.forn + 0.8, b: T.transp, p: topo('for', 1.5), valor: 'R$ 14,9 MI', sub: '36 FORNECEDORES', cor: cF},
    {a: T.v55 + 0.9, b: T.caic, p: topo('oni', 11), valor: 'R$ 5,5 MI', sub: 'TRANSPORTE ESCOLAR · 2026', cor: cF},
    {a: T.v42, b: T.caic, p: soma(noAnel(iM('oni'), R_M - 0.4), [0, 2.0, 0]), valor: 'R$ 42 MI', sub: 'PELO MENOS · DESDE 2020'},
    {a: T.v35 + 0.8, b: T.merenda, p: topo('caic', 6.94), valor: 'R$ 3,5 MI', sub: 'REFORMA DO CAIC · 2026', cor: cF},
    {a: T.res3 + 0.6, b: T.merenda, p: topo('cre', 6.42), valor: 'R$ 3 MI', sub: 'RESERVADO'},
    {a: T.nenhum + 0.3, b: T.merenda, p: soma(noAnel(iM('cre')), [0, 0.6, 0]), valor: 'R$ 0', sub: 'PAGO ATÉ AGOSTO', cor: C.alerta},
    {a: T.v18 + 0.9, b: T.construtora, p: topo('mer', 3.62), valor: 'R$ 1,8 MI', sub: 'NOVA EMPRESA · JUL E AGO', cor: cF},
    {a: T.v33, b: T.outubro, p: soma(noAnel(iM('pre')), [0, 2.4, 0]), valor: 'R$ 33 MI', sub: 'PELO MENOS · DESDE 2020'},
    {a: T.fundeb + 1.0, b: T.mp, p: topo('fun', 9.94), valor: 'R$ 4,97 MI', sub: 'DEVOLVER AO FUNDEB', cor: C.alerta},
  ];
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

const noMapa = (t: number) => t < T.primeiro;
const soMapa = (t: number) => t < T.primeiro - 0.3;
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: 0, ate: q(T.primeiro) + 6};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresOI(tema);
  if (noMapa(t)) return null;
  const seloAtual = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const escala10 = vis(t, T.arrec + 0.4, T.transp - 0.1);
  const escala05 = vis(t, T.transp, T.construtora - 0.1);
  const placar = Math.max(escala10, escala05);
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const rots = ROTULOS(tema)
    .map((r, i) => {
      const k = entra(t, r.a, 0.4) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
      if (k <= 0.01) return null;
      const pj = projetar(r.p, cam, W, H);
      if (!pj.visivel || pj.y > 1330 || pj.y < 420 || pj.x < SEGURO.esq || pj.x > SEGURO.botoesX) return null;
      return {i, x: Math.max(SEGURO.esq + 110, Math.min(SEGURO.botoesX - 110, pj.x)), y: Math.max(760, Math.min(1300, pj.y)), k: Math.min(1, k), r};
    })
    .filter(Boolean) as {i: number; x: number; y: number; k: number; r: Rot}[];
  for (let a = 0; a < rots.length; a++) for (let b = 0; b < a; b++) if (Math.abs(rots[a].x - rots[b].x) < 220 && Math.abs(rots[a].y - rots[b].y) < 80) rots[a].y = rots[b].y + 84;
  return (
    <>
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
        <div style={{opacity: seloAtual ? Math.min(1, visivel(seloAtual, t)) : 0}}>
          {seloAtual ? (
            <div style={{padding: '9px 16px', borderRadius: 11, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: seloAtual.texto.length > 62 ? 14 : seloAtual.texto.length > 52 ? 16 : 19, fontWeight: 700, letterSpacing: 1.1, color: tema.texto, whiteSpace: 'nowrap'}}>{seloAtual.texto}</div>
          ) : null}
        </div>
        {placar > 0.01 ? (
          <div style={{opacity: Math.min(1, placar), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9, background: tema.cartao, border: `1.5px solid ${escala05 > 0.01 ? tema.acento : tema.cartaoBorda}`, whiteSpace: 'nowrap'}}>
            <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
            <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 1.4, color: tema.texto}}>{escala05 > 0.01 ? 'AQUI, 1 PILHA = R$ 500 MIL' : '1 PILHA = R$ 10 MILHÕES'}</div>
          </div>
        ) : null}
      </div>
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 540, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 44 ? 19 : chip.texto.length > 34 ? 23 : 28} />
        </div>
      ) : null}
      {rots.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 10}px) scale(${0.85 + 0.15 * v.k})`, opacity: v.k}}>
          <div style={{padding: v.r.sub ? '7px 14px 8px' : '5px 12px 6px', borderRadius: 12, background: v.r.cor ? mistura(tema.cartao, v.r.cor, 0.22) : tema.cartao, border: `3px solid ${v.r.cor ?? tema.cartaoBorda}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: 32, fontWeight: 900, letterSpacing: -0.5, color: v.r.cor ? mistura(v.r.cor, tema.texto, 0.25) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/ilheus.mp4`)} startFrom={de} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Soquinho: empurrão leve de câmera (0,5 s) em cada número ----------
const SOQUINHOS = [T.rej16, T.aprovou, T.a18, T.onze, T.arrec, T.pagou, T.salarios, T.forn, T.v55, T.nf1, T.nf2, T.v42, T.v35, T.nenhum, T.pf, T.v18, T.v33, T.devolver, T.semJulg];
const soquinho = (t: number) => SOQUINHOS.reduce((acc, a) => (t >= a && t < a + 0.5 ? acc + 0.03 * Math.sin((Math.PI * (t - a)) / 0.5) : acc), 0);

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  CONTAS.forEach((c) => c.carimbos.forEach(([a, , tipo]) => s.push({t: a + 0.3, f: tipo === 'rej' ? 'impacto' : 'tique', v: tipo === 'rej' ? 0.16 : 0.12})));
  s.push({t: T.aprovou, f: 'baque', v: 0.2});
  for (let k = 0; k < 22; k += 3) s.push({t: T.onze + k * 0.09, f: 'tique', v: 0.1});
  s.push({t: T.elaboracao, f: 'whoosh', v: 0.12}, {t: T.multas + 0.9, f: 'baque', v: 0.18});
  s.push({t: T.arrec + 0.2, f: 'subida', v: 0.16}, {t: T.pagou + 0.2, f: 'whoosh', v: 0.16}, {t: T.salarios + 0.2, f: 'pop', v: 0.16}, {t: T.forn + 0.2, f: 'pop', v: 0.16});
  [T.v55, T.nf1, T.nf2, T.v35, T.res3, T.v18, T.fundeb].forEach((t) => s.push({t: t + 0.1, f: 'pop', v: 0.17}));
  [T.nenhum, T.pf, T.suspendeu, T.devolver, T.semJulg].forEach((t) => s.push({t: t + 0.35, f: 'impacto', v: 0.16}));
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  2, 6, 11, T.primeiro + 0.6, T.rej16 + 0.8, T.aprovou + 0.6, T.a18 + 2.6, T.ressalvas + 0.8, T.a24 + 1.0,
  T.onze + 2.4, T.elaboracao + 1.2, T.multas + 1.4, T.arrec + 1.4, T.pagou + 1.6, T.salarios + 1.4, T.forn + 1.4,
  T.v55 + 1.2, T.nf2 + 1.0, T.v42 + 0.6, T.v35 + 1.0, T.res3 + 1.0, T.nenhum + 0.6, T.contrato + 0.8, T.pf + 1.2, T.suspendeu + 0.8,
  T.outra + 1.5, T.v18 + 1.2, T.v33 + 0.6, T.devolver + 0.6, T.fundeb + 1.4, T.mp + 1.0, T.semJulg + 0.6, T.segue + 1.0, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const EducacaoIlheus10: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Marca tema={tema} serie={SERIE} assunto="Educação em Ilhéus" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 150 mi', 'na educação.', 'Para onde', 'foi?'];
export const CapaEducacaoIlheus10: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ILHÉUS`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 116, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
