import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Celular, Onda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type Pose, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, k01, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Envelope, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {ArcoPontos, Balanca, Cadeado, Cadeira, Cancela, Candidato, Contracheque, Escudo, Grades, IconeBalao, LivroLei, Martelo, OrgaoPublico, PalcoGiratorio, PilhaMoedas, Porta, PredioColunas, RelogioPonto, Urna, XMarca} from '../../pecas';
import {CelularDenuncia, FolhaCarimbo, ListaLei, MESA_TOPO, MesaTrabalho, PAREDE, ParedeMeio, PlacaChao, TelaoPosts} from './pecas';
import {PALAVRAS} from './palavras';

// 011. demissão por voto (perfil @eumagnoleite, série Magno Explica).
// Mundo único: um palco giratório com uma parede no meio e uma porta. Na frente, A EMPRESA (escritório, patrão, telão dos posts);
// atrás, A LEI (Constituição, Lei 9.029, Justiça do Trabalho e, depois, o MPT). Patrões e políticos em cinza; verde só no que a lei garante.
// Ninguém real aparece com rosto: a deputada e o empresário são bonecos genéricos com etiqueta, sem nome.
// Plano: projetos/011. demissão por voto/plano.md (versão 1, aprovada em 31/10/2026).

export const FPS = 30;
const AUDIO_SEG = 82.2;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '011. demissão por voto';
const FIM = AUDIO_SEG + 0.9;
const PI = Math.PI;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  demite: quando('demite'),
  voceVotou: quando('voce votou'),
  noLula: quando('no Lula esta'),
  quebrando: quando('quebrando'),
  ilegal: quando('lei'),
  depoisTurno: quando('Depois do segundo'),
  turno: quando('turno'),
  politicos: quando('politicos'),
  empresarios: quando('empresarios'),
  pl: quando('PL'),
  pediram: quando('pediram'),
  redes: quando('redes'),
  demita: quando('demita'),
  petista: quando('petista'),
  naoContrate: quando('nao contrate'),
  contrate: quando('contrate'),
  quemVotou: quando('quem votou no'),
  mas: quando('Mas o que'),
  leiDiz: quando('a lei diz'),
  isso: quando('isso'),
  primeiro: quando('Primeiro'),
  constituicao: quando('Constituicao'),
  artigo: quando('artigo'),
  ninguem: quando('ninguem'),
  perdeDireitos: quando('perde direitos'),
  conviccao: quando('conviccao'),
  depoisLei: quando('Depois a Lei'),
  lei9029: quando('Depois a Lei', 1, true),
  proibe: quando('proibe'),
  contratar: quando('contratar'),
  manter: quando('manter o emprego'),
  lista: quando('lista'),
  sexo: quando('sexo'),
  raca: quando('raca'),
  idade: quando('idade'),
  entreOutros: quando('entre outros'),
  justica: quando('Justica do Trabalho'),
  decidiu: quando('decidiu'),
  demitirMotivo: quando('demitir por motivo'),
  politico: quando('politico'),
  discriminacao: quando('discriminacao'),
  repara: quando('Agora repara'),
  patraoPode: quando('O patrao pode'),
  simDemitir: quando('sim demitir'),
  justaCausa: quando('justa causa'),
  eleNaoPode: quando('ele nao pode'),
  podeEDemitir: quando('pode e demitir'),
  causaVoto: quando('causa do voto'),
  seIsso: quando('Se isso acontecer'),
  trabalhador: quando('trabalhador'),
  escolhe: quando('escolhe'),
  voltar: quando('voltar'),
  paraEmprego: quando('para o emprego'),
  salarios: quando('salarios'),
  tempoParado: quando('tempo parado'),
  ouReceber: quando('ou receber'),
  periodo: quando('periodo'),
  dobro: quando('dobro'),
  pedir: quando('pedir'),
  danoMoral: quando('dano moral'),
  aEmpresa: quando('A empresa'),
  multa: quando('multa'),
  dez: quando('10'),
  vezes: quando('vezes'),
  paga: quando('paga'),
  ficarSem: quando('ficar sem'),
  emprestimo: quando('emprestimo'),
  bancoPublico: quando('banco publico'),
  ameacar: quando('E ameacar'),
  funcionario: quando('funcionario'),
  antesEleicao: quando('antes da eleicao'),
  mudarVoto: quando('mudar o voto'),
  podeSerCrime: quando('pode ser crime'),
  eleitoral: quando('eleitoral'),
  ate4: quando('ate 4'),
  prisao: quando('prisao'),
  ministerio: quando('O Ministerio'),
  processou: quando('processou'),
  umaDeputada: quando('uma deputada'),
  umEmpresario: quando('um empresario'),
  deputadaDiz: quando('A deputada diz'),
  vale: quando('E vale'),
  qualquerLado: quando('qualquer lado'),
  patraoEsquerda: quando('patrao de esquerda'),
  tambemNaoPode: quando('tambem nao pode'),
  votouDireita: quando('votou na direita'),
  seAcontecer: quando('Se acontecer'),
  comVoce: quando('com voce'),
  prints: quando('prints'),
  audios: quando('audios'),
  testemunhas: quando('testemunhas'),
  denuncie: quando('denuncie'),
  siteMPT: quando('site do MPT'),
  sigilo: quando('sigilo'),
  voceJa: quando('Voce ja viu'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  magno: quando('Magno Explica'),
  seusDireitos: quando('seus direitos'),
};

const ESTADOS: [number, string][] = [
  [0, 'DEMITIDO PELO VOTO?'],
  [T.depoisTurno, 'NAS REDES'],
  [T.mas, 'O QUE DIZ A LEI'],
  [T.repara, 'A REGRA'],
  [T.seIsso, 'OS DIREITOS'],
  [T.aEmpresa, 'A PUNIÇÃO'],
  [T.ministerio, 'NA JUSTIÇA'],
  [T.vale, 'QUALQUER LADO'],
  [T.seAcontecer, 'O QUE FAZER'],
];

// ---------- Giro do palco ----------
// 0: empresa de frente. π: lei de frente. −π/2 (3,5π): a parede de ponta, os dois lados de uma vez.
const giroEm = (t: number) =>
  PI * rampa(t, T.mas, T.mas + 1.4) +
  PI * rampa(t, T.repara, T.repara + 1.4) +
  PI * rampa(t, T.ministerio, T.ministerio + 1.4) +
  0.5 * PI * rampa(t, T.vale, T.vale + 1.0) +
  0.5 * PI * rampa(t, T.seAcontecer, T.seAcontecer + 1.0) +
  0.25 * PI * rampa(t, T.segue, FIM);
const girando = (t: number) =>
  Math.max(
    ...[
      [T.mas, 1.4],
      [T.repara, 1.4],
      [T.ministerio, 1.4],
      [T.vale, 1.0],
      [T.seAcontecer, 1.0],
    ].map(([a, d]) => rampa(t, a - 0.2, a + 0.3) * (1 - rampa(t, a + d - 0.2, a + d + 0.5))),
  );
const PALCO_Y = 0.06;
// Ponto do palco (coordenada local) para o mundo, com o palco girado de g.
const noPalco = (p: V3, g: number): V3 => [p[0] * Math.cos(g) + p[2] * Math.sin(g), p[1] + PALCO_Y, -p[0] * Math.sin(g) + p[2] * Math.cos(g)];
// O lado da lei é desenhado num grupo girado de π dentro do palco: coordenada desse grupo → coordenada do palco.
const deLei = (p: V3): V3 => [-p[0], p[1], -p[2]];

// ---------- Mapa do mundo ----------
// Palco (coordenadas locais; lado da empresa em z+)
const MESA_P: V3 = [-1.6, 0, 3.2];
const PROT_MESA: V3 = [-2.0, 0, 2.55];
const PROT_MEIO: V3 = [-0.8, 0, 1.5];
const PROT_PORTA: V3 = [0, 0, 0];
const PROT_FORA: V3 = [0, 0, -1.1];
const MESA_A: V3 = [-4.2, 0, 2.6];
const FUNC_A: V3 = [-4.2, 0, 1.95];
const FUNC_B: V3 = [-5.3, 0, 3.7];
const MESA_VAGA: V3 = [2.4, 0, 3.2];
const PATRAO: V3 = [4.6, 0, 1.6];
const PATRAO_PERTO: V3 = [-0.5, 0, 2.35];
const RELOGIO: V3 = [-5.9, 0, 1.3];
const TELAO: V3 = [-3.4, 2.25, 0.22];
const PILHA1: V3 = [0.05, 0, 3.95];
const PILHA2: V3 = [0.6, 0, 3.95];
const CELULAR_G: V3 = [-0.35, 1.7, 3.95];
const PATRAO2: V3 = [4.6, 0, -1.6];
// Lado da lei (coordenadas do grupo da lei; vira o mundo quando o palco está em π)
const CONST: V3 = [-3.4, 0, 3.0];
const LIVRO2: V3 = [0.6, 0, 4.4];
const LISTA_Y = 2.05;
const JUSTICA: V3 = [4.2, 0, 4.0];
const MARTELO: V3 = [3.0, 0, 2.4];
const FOLHA: V3 = [1.8, 0, 2.8];
const MPT: V3 = [-3.4, 0, 4.0];
const DEPUTADA: V3 = [-1.2, 0, 2.6];
const EMPRESARIO: V3 = [1.0, 0, 2.6];
const ESCUDO_LEI: V3 = [0.8, 1.0, 1.0];
// Fora do palco (mundo)
const GRUPO_POL: V3 = [-6.0, 0, 10.0];
const GRUPO_EMP: V3 = [-2.8, 0, 10.6];
const CANDIDATO_DE: V3 = [6.6, 0, 7.2];
const CANDIDATO_ATE: V3 = [2.6, 0, 4.4];
const CHEQUE0: V3 = [-5.4, 0, 9.2];
const BANCO: V3 = [4.4, 0, 11.6];
const URNA: V3 = [1.2, 0, 8.4];

// ---------- Ajudantes ----------
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const andar = (t: number, a: number, b: number) => (t > a && t < b ? Math.sin((t - a) * 9) : 0);
const SEGURA_CEL: Pose = {ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25, cabeca: [0.3, 0, 0]};
const CelNaMao: React.FC<{tema: Tema; brilho: number}> = ({tema, brilho}) => (
  <group position={[0.27, 1.17, 0.42]} rotation={[0.45, PI, 0]} scale={1.7}>
    <Celular tema={tema} pos={[0, 0, 0]} brilho={brilho} />
  </group>
);

// Protagonista ("você"): posição e direção no palco.
const protEm = (t: number): {p: V3; r: number; anda: number} => {
  let p = PROT_MESA;
  if (t >= T.voceVotou) p = lerp3(PROT_MESA, PROT_MEIO, rampa(t, T.voceVotou + 0.2, T.quebrando));
  if (t >= T.mas) p = lerp3(PROT_MEIO, PROT_PORTA, rampa(t, T.mas, T.mas + 0.9));
  if (t >= T.seIsso) p = lerp3(PROT_PORTA, PROT_FORA, rampa(t, T.seIsso + 0.1, T.seIsso + 0.9));
  if (t >= T.paraEmprego - 0.4) {
    const k = rampa(t, T.paraEmprego - 0.4, T.paraEmprego + 1.2);
    p = k < 0.4 ? lerp3(PROT_FORA, PROT_PORTA, k / 0.4) : lerp3(PROT_PORTA, PROT_MESA, (k - 0.4) / 0.6);
  }
  const r = 2.5 * rampa(t, T.voceVotou, T.voceVotou + 0.4) + (PI - 2.5) * rampa(t, T.mas, T.mas + 0.5) + PI * rampa(t, T.patraoPode, T.patraoPode + 0.6) + PI * rampa(t, T.seIsso, T.seIsso + 0.4) + PI * rampa(t, T.paraEmprego - 0.6, T.paraEmprego - 0.2);
  const anda = Math.max(andar(t, T.voceVotou + 0.2, T.quebrando), andar(t, T.mas, T.mas + 0.9), andar(t, T.seIsso + 0.1, T.seIsso + 0.9), andar(t, T.paraEmprego - 0.4, T.paraEmprego + 1.2));
  return {p, r, anda};
};

// Patrão: na mesa dele; em "funcionário" vai até a mesa do protagonista; volta durante o giro da cena 7.
const patraoEm = (t: number): {p: V3; r: number; anda: number} => {
  let p = PATRAO;
  if (t >= T.funcionario - 0.3 && t < T.ministerio + 0.3) p = lerp3(PATRAO, PATRAO_PERTO, rampa(t, T.funcionario - 0.3, T.funcionario + 1.1));
  let r = -1.35;
  if (t >= T.funcionario - 0.3 && t < T.ministerio + 0.3) r = -PI / 2;
  if (t >= T.vale - 0.2) r = PI / 2;
  return {p, r, anda: andar(t, T.funcionario - 0.3, T.funcionario + 1.1)};
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const g = giroEm(t);
  const aro = girando(t);
  const prot = protEm(t);
  const pat = patraoEm(t);
  const aponta = Math.max(janela(t, T.demite, T.depoisTurno, 0.3), janela(t, T.podeEDemitir, T.seIsso, 0.3));
  const poseAponta: Pose = {ombroD: [-1.45 * aponta, 0, 0.05], cotoveloD: -0.2 * (1 - aponta), passo: pat.anda};
  const olhaTelao = janela(t, T.petista, T.mas, 0.4);
  const porta = Math.max(0.85 * janela(t, T.demite, T.seIsso + 0.9, 0.5), 0.85 * rampa(t, T.voltar, T.voltar + 0.5));
  const portaLuz = 0.6 + 0.8 * pulso(t, T.voltar, 1.2);
  // Lado da lei
  const constK = entra(t, T.primeiro, 0.6) * (1 - rampa(t, T.repara + 1.4, T.repara + 2.0));
  const constAbre = rampa(t, T.constituicao, T.constituicao + 0.8);
  const pagina5 = entra(t, T.artigo + 0.28, 0.45);
  const frase = rampa(t, T.ninguem, T.conviccao + 0.4);
  const livro2K = entra(t, T.depoisLei, 0.6) * (1 - rampa(t, T.repara + 1.4, T.repara + 2.0));
  const livro2Abre = rampa(t, T.lei9029 - 0.2, T.lei9029 + 0.6);
  const listaA = entra(t, T.proibe, 0.5) * (1 - rampa(t, T.lista, T.lista + 0.4));
  const listaB = entra(t, T.lista + 0.3, 0.5) * (1 - rampa(t, T.justica + 0.2, T.justica + 0.7));
  const justK = rampa(t, T.justica - 0.2, T.justica + 0.7, sai) * (1 - rampa(t, T.repara + 1.4, T.repara + 2.0));
  const marteloK = entra(t, T.justica + 0.3, 0.5) * (1 - rampa(t, T.repara + 1.4, T.repara + 2.0));
  const bate = rampa(t, T.decidiu - 0.35, T.decidiu) * (1 - rampa(t, T.decidiu + 0.25, T.decidiu + 0.8));
  const folhaK = entra(t, T.demitirMotivo, 0.5) * (1 - rampa(t, T.repara + 1.4, T.repara + 2.0));
  const mptK = rampa(t, T.ministerio + 0.3, T.ministerio + 1.1, sai) * (1 - rampa(t, T.vale, T.vale + 0.8));
  const acaoDep = rampa(t, T.processou, T.umaDeputada + 0.2);
  const acaoEmp = rampa(t, T.processou + 0.3, T.umEmpresario + 0.2);
  const pessoasMPT = 1 - rampa(t, T.vale, T.vale + 0.6);
  // Fora do palco
  const grupos = 1 - rampa(t, T.mas, T.mas + 0.6);
  const celAceso = rampa(t, T.pediram, T.pediram + 0.4);
  const cand = (() => {
    const ida = rampa(t, T.petista - 0.2, T.contrate);
    const volta = rampa(t, T.quemVotou, T.quemVotou + 1.2);
    const p = lerp3(lerp3(CANDIDATO_DE, CANDIDATO_ATE, ida), soma(CANDIDATO_DE, [0, 0, 0.3]), volta);
    const r = volta > 0.02 ? 0.95 : -2.2;
    return {p, r, anda: Math.max(andar(t, T.petista - 0.2, T.contrate), andar(t, T.quemVotou, T.quemVotou + 1.2)), k: entra(t, T.petista - 0.4, 0.45) * (1 - rampa(t, T.mas, T.mas + 0.4))};
  })();
  const vagaFechada = rampa(t, T.contrate + 0.2, T.contrate + 0.6);
  const cena6 = 1 - rampa(t, T.ministerio, T.ministerio + 0.6);
  const grades = rampa(t, T.prisao - 0.1, T.prisao + 0.5) * (1 - rampa(t, T.prisao + 1.3, T.prisao + 1.9));
  const funcA = (() => {
    const k = rampa(t, T.simDemitir, T.simDemitir + 1.4);
    const p = k < 0.5 ? lerp3(FUNC_A, [-2.0, 0, 1.2], k / 0.5) : lerp3([-2.0, 0, 1.2], [0, 0, -0.6], (k - 0.5) / 0.5);
    return {p, r: k > 0.01 ? 2.3 : 0, anda: andar(t, T.simDemitir, T.simDemitir + 1.4), k: 1 - rampa(t, T.simDemitir + 1.1, T.simDemitir + 1.5)};
  })();
  const testemunhas = [0, 1].map((i) => {
    const a = T.testemunhas + i * 0.15;
    const k = rampa(t, a, a + 0.9);
    const ate: V3 = i === 0 ? [-3.0, 0, 3.0] : [-3.5, 0, 3.7];
    return {p: lerp3(soma(ate, [-2.2, 0, 0]), ate, k), anda: andar(t, a, a + 0.9), k: entra(t, a, 0.45)};
  });

  return (
    <group>
      {/* ===== Fora do palco ===== */}
      {grupos > 0.02
        ? [
            {c: GRUPO_POL, a: T.politicos},
            {c: GRUPO_EMP, a: T.empresarios},
          ].map(({c, a}, gi) =>
            [
              [-0.7, 0.1, 0.3],
              [0, -0.4, 0],
              [0.7, 0.1, -0.3],
            ].map(([dx, dz, r], i) => (
              <Boneco key={`${gi}${i}`} tema={tema} pos={[c[0] + dx, 0, c[2] + dz]} rotY={PI + r} escala={0.72 * entra(t, a + i * 0.08, 0.45) * grupos} cor={tema.objeto} pose={SEGURA_CEL}>
                <CelNaMao tema={tema} brilho={0.3 + 0.9 * celAceso} />
              </Boneco>
            )),
          )
        : null}
      {[GRUPO_POL, GRUPO_EMP].map((c, i) => (
        <ArcoPontos key={i} a={soma(c, [0, 1.6, 0])} b={[TELAO[0], TELAO[1] + 0.3, TELAO[2] + 0.4]} k={rampa(t, T.pediram + i * 0.15, T.pediram + 0.9) * (1 - rampa(t, T.mas, T.mas + 0.5))} cor={tema.objetoClaro} alt={2.2} n={24} />
      ))}
      {cand.k > 0.02 ? <Boneco tema={tema} pos={cand.p} rotY={cand.r} escala={0.78 * cand.k} cor={tema.pessoa} pose={{passo: cand.anda}} /> : null}

      {/* Cena 6: contracheques, banco público e urna */}
      {cena6 > 0.02
        ? Array.from({length: 10}).map((_, i) => {
            const k = entra(t, (i === 0 ? T.dez : T.vezes) + i * 0.07, 0.4) * cena6 * (1 - rampa(t, T.ficarSem - 0.2, T.ficarSem + 0.4));
            return <Contracheque key={i} tema={tema} pos={soma(CHEQUE0, [i * 0.95, 0, 0])} escala={0.7 * k} salario={i === 0 ? 1 : 0.6 + 0.4 * pulso(t, T.paga + i * 0.05, 0.8)} piso={0} />;
          })
        : null}
      {entra(t, T.ficarSem, 0.5) * cena6 > 0.02 ? (
        <group position={BANCO} scale={0.9 * Math.min(1, entra(t, T.ficarSem, 0.5)) * cena6}>
          <PredioColunas tema={tema} pos={[0, 0, 0]} aceso={0.55} />
        </group>
      ) : null}
      <PlacaChao tema={tema} pos={[BANCO[0] - 1.6, 0, BANCO[2] + 1.4]} rotY={-0.2} escala={1.15 * entra(t, T.bancoPublico - 0.4, 0.45) * cena6} texto="BANCO PÚBLICO" aceso={0} />
      <Cancela tema={tema} pos={[BANCO[0], 0, BANCO[2] + 1.9]} escala={1.1 * entra(t, T.ficarSem + 0.2, 0.45) * cena6} desce={rampa(t, T.emprestimo, T.emprestimo + 0.5)} />
      {entra(t, T.ameacar, 0.5) * cena6 > 0.02 ? (
        <group>
          <Urna tema={tema} pos={URNA} rotY={-0.2} escala={Math.min(1.05, entra(t, T.ameacar, 0.5)) * cena6} />
          <Caixa args={[0.5, 0.02, 0.03]} raio={0.008} cor={mistura(tema.objetoEscuro, tema.objetoClaro, pulso(t, T.mudarVoto, 1.0))} emissivo={0.6 * pulso(t, T.mudarVoto, 1.0)} sombra={false} position={soma(URNA, [0.085, 0.965 * cena6, 0.425])} rotation={[0, -0.2, 0]} />
        </group>
      ) : null}

      {/* ===== O palco giratório ===== */}
      <group position={[0, PALCO_Y, 0]} rotation={[0, g, 0]}>
        <PalcoGiratorio tema={tema} raio={7.5} aro={aro} />
        <ParedeMeio tema={tema} frente="EMPRESA" fundo="A LEI" luzFrente={janela(t, T.aEmpresa, T.ministerio, 0.5)} luzFundo={Math.max(janela(t, T.leiDiz, T.repara, 0.5), janela(t, T.ministerio, T.vale, 0.5))} />
        <Porta tema={tema} pos={[0, 0, 0]} abertura={porta} luz={portaLuz} />
        <Onda pos={[0, 0.02, 0.5]} k={rampa(t, T.voltar, T.voltar + 1.2)} cor={tema.acento} raio={1.4} />

        {/* ----- Lado da empresa (z+) ----- */}
        <TelaoPosts tema={tema} pos={TELAO} k={rampa(t, T.redes - 0.3, T.redes + 0.3) * (1 - rampa(t, T.mas + 0.6, T.mas + 1.2))} topo={entra(t, T.turno, 0.45) * (1 - rampa(t, T.mas + 0.6, T.mas + 1.2))} posts={[entra(t, T.demita, 0.45) * (1 - rampa(t, T.mas + 0.6, T.mas + 1.2)), entra(t, T.naoContrate, 0.45) * (1 - rampa(t, T.mas + 0.6, T.mas + 1.2))]} />
        <MesaTrabalho tema={tema} pos={MESA_A} />
        <MesaTrabalho tema={tema} pos={MESA_P} tela={0.3 + 0.4 * rampa(t, T.paraEmprego + 1.0, T.paraEmprego + 1.6)} />
        <MesaTrabalho tema={tema} pos={MESA_VAGA} tela={0.05} />
        {/* Placa da vaga: VAGA vira FECHADA */}
        <group position={[MESA_VAGA[0] - 0.25, MESA_TOPO + 0.24, MESA_VAGA[2] + 0.2]}>
          <Caixa args={[0.84, 0.4, 0.04]} raio={0.03} cor={tema.objetoEscuro} />
          {vagaFechada < 0.98 ? (
            <group scale={[1 - vagaFechada, 1, 1]}>
              <Placa tema={tema} pos={[0, 0, 0.025]} larg={0.76} alt={0.32} linhas={[{t: 'VAGA', tam: 230, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
            </group>
          ) : null}
          {vagaFechada > 0.02 ? (
            <group scale={[vagaFechada, 1, 1]}>
              <Placa tema={tema} pos={[0, 0, 0.025]} larg={0.76} alt={0.32} linhas={[{t: 'FECHADA', tam: 170, cor: tema.textoSuave, peso: 900}]} brilho={0.3} />
            </group>
          ) : null}
        </group>
        <RelogioPonto tema={tema} pos={RELOGIO} rotY={0.3} escala={1} visor={1 - rampa(t, T.seIsso + 0.6, T.seIsso + 1.1) + rampa(t, T.tempoParado, T.tempoParado + 0.5)} />
        {funcA.k > 0.02 ? <Boneco tema={tema} pos={funcA.p} rotY={funcA.r || 2.75 * olhaTelao} escala={0.78 * funcA.k} cor={tema.pessoa} pose={{passo: funcA.anda, ombroD: funcA.anda ? undefined : [-0.4, 0, 0.05], cotoveloD: funcA.anda ? undefined : -0.8}} /> : null}
        <Boneco tema={tema} pos={FUNC_B} rotY={2.63 * olhaTelao + 0.3 * (1 - olhaTelao)} escala={0.78} cor={tema.pessoa} pose={{ombroD: [-0.5, 0, 0.1], cotoveloD: -0.9}} />
        {/* Patrão (cinza, sem partido) e a cadeira dele */}
        <Cadeira tema={tema} pos={[PATRAO[0] + 0.2, 0, PATRAO[2] - 0.75]} escala={0.85} />
        <Candidato tema={tema} pos={pat.p} rotY={pat.r} cor={tema.objeto} gravata={tema.objetoEscuro} escala={0.82} pose={poseAponta} />
        <XMarca tema={tema} pos={[3.3, 1.45, 2.1]} escala={0.55 * entra(t, T.causaVoto, 0.45) * (1 - rampa(t, T.seIsso, T.seIsso + 0.4))} />
        <Grades tema={tema} pos={[PATRAO_PERTO[0], 0, PATRAO_PERTO[2] + 0.55]} larg={1.3} alt={2.1} desce={grades} />
        {/* Protagonista ("você") */}
        <Boneco tema={tema} pos={prot.p} rotY={prot.r} escala={0.8} cor={tema.corpo} pose={prot.anda ? {passo: prot.anda} : t < T.voceVotou || (t > T.paraEmprego + 1.2 && t < T.comVoce) ? SEGURA_CEL : {}}>
          {t < T.voceVotou + 0.3 || (t > T.paraEmprego + 1.2 && t < T.comVoce) ? <CelNaMao tema={tema} brilho={0.7} /> : null}
        </Boneco>
        {/* Os direitos: placas, pilhas, envelope */}
        <PlacaChao tema={tema} pos={[-1.15, 0, 1.15]} rotY={0.25} escala={0.8 * entra(t, T.escolhe, 0.45) * (1 - rampa(t, T.aEmpresa, T.aEmpresa + 0.5))} texto="VOLTAR" aceso={janela(t, T.voltar, T.ouReceber, 0.4)} />
        <PlacaChao tema={tema} pos={[1.15, 0, 1.15]} rotY={-0.25} escala={0.8 * entra(t, T.escolhe + 0.15, 0.45) * (1 - rampa(t, T.aEmpresa, T.aEmpresa + 0.5))} texto="EM DOBRO" aceso={janela(t, T.ouReceber, T.aEmpresa, 0.4)} />
        <PilhaMoedas tema={tema} pos={PILHA1} n={9 * rampa(t, T.salarios, T.salarios + 0.9)} cor={tema.objetoClaro} r={0.24} escala={1 - rampa(t, T.aEmpresa, T.aEmpresa + 0.5)} />
        <PilhaMoedas tema={tema} pos={PILHA2} n={9 * rampa(t, T.periodo, T.periodo + 0.7)} cor={tema.objetoClaro} r={0.24} brilho={0.4 * pulso(t, T.dobro, 0.9)} escala={1 - rampa(t, T.aEmpresa, T.aEmpresa + 0.5)} />
        {rampa(t, T.pedir - 0.2, T.pedir + 0.9) > 0.02 && t < T.aEmpresa + 0.5 ? (
          <Envelope tema={tema} pos={curva([3.0, 3.2, 6.5], [MESA_P[0] + 0.45, MESA_TOPO + 0.05, MESA_P[2] + 0.15], 1.4, rampa(t, T.pedir - 0.2, T.pedir + 0.9))} rot={[-PI / 2, 0, 0.2]} escala={1.5 * (1 - rampa(t, T.aEmpresa, T.aEmpresa + 0.5))} brilho={0.6} />
        ) : null}
        {/* O que fazer: celular grande, testemunhas, cadeado, comentário, escudo final */}
        <CelularDenuncia tema={tema} pos={[CELULAR_G[0], CELULAR_G[1] - 1.0 * (1 - Math.min(1, entra(t, T.comVoce, 0.5))), CELULAR_G[2]]} rot={[0, -0.25, 0]} escala={0.92 * entra(t, T.comVoce, 0.5)} linhas={[rampa(t, T.prints, T.prints + 0.3), rampa(t, T.audios, T.audios + 0.3), rampa(t, T.testemunhas, T.testemunhas + 0.3)]} denuncia={rampa(t, T.denuncie, T.denuncie + 0.5)} />
        <group position={[CELULAR_G[0] + 0.05, CELULAR_G[1] - 0.45, CELULAR_G[2] + 0.12]} rotation={[0, -0.25, 0]} scale={1.3}>
          <Cadeado tema={tema} pos={[0, 0, 0]} k={entra(t, T.sigilo - 0.1, 0.4)} fecha={rampa(t, T.sigilo + 0.15, T.sigilo + 0.45)} />
        </group>
        {testemunhas.map((x, i) => (x.k > 0.02 ? <Boneco key={i} tema={tema} pos={x.p} rotY={x.anda ? PI / 2 : 0.5} escala={0.76 * x.k} cor={tema.pessoa} pose={{passo: x.anda}} /> : null))}
        <IconeBalao pos={[CELULAR_G[0] + 0.55, CELULAR_G[1] + 0.95, CELULAR_G[2]]} cor={tema.acento} escala={1.0 * entra(t, T.comentarios, 0.45)} />
        <Escudo tema={tema} pos={[0, 1.3, 0.75]} escala={0.9 * entra(t, T.seusDireitos - 0.5, 0.5)} acende={1} />

        {/* Cena 8: os dois patrões, a balança em cima da parede e o mesmo X */}
        <Candidato tema={tema} pos={PATRAO2} rotY={PI / 2} cor={tema.objeto} gravata={tema.objetoEscuro} escala={0.82 * entra(t, T.patraoEsquerda, 0.5) * (1 - rampa(t, T.seAcontecer + 0.6, T.seAcontecer + 1.0))} />
        {[1, -1].map((s) => (
          <group key={s} position={[PATRAO[0] + 1.0, 1.45, s * 1.6]} rotation={[0, PI / 2, 0]}>
            <XMarca tema={tema} pos={[0, 0, 0]} escala={0.55 * entra(t, T.tambemNaoPode, 0.45) * (1 - rampa(t, T.seAcontecer, T.seAcontecer + 0.5))} />
          </group>
        ))}
        <group position={[PATRAO[0], PAREDE.alt, 0]} rotation={[0, PI / 2, 0]}>
          <Balanca tema={tema} pos={[0, 0, 0]} escala={0.5 * entra(t, T.qualquerLado, 0.5) * (1 - rampa(t, T.seAcontecer, T.seAcontecer + 0.5))} inclina={0.35 * Math.sin((t - T.qualquerLado) * 4) * (1 - rampa(t, T.qualquerLado, T.qualquerLado + 1.6))} brilhoEsq={0.4} brilhoDir={0.4} />
        </group>

        {/* ----- Lado da lei (grupo girado: z+ do grupo = lado de trás do palco) ----- */}
        <group rotation={[0, PI, 0]}>
          {/* Constituição */}
          {constK > 0.02 ? (
            <group position={[CONST[0], -2.6 * (1 - Math.min(1, constK)), CONST[2]]}>
              <Caixa args={[2.0, 0.24, 0.7]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.12, 0]} />
              <group position={[0, 1.36, 0]} scale={2.0 * Math.min(1, constK)}>
                <LivroLei tema={tema} pos={[0, 0, 0]} escala={1} abre={constAbre} capa={1} fitas={[[rampa(t, T.artigo, T.artigo + 0.4), 1]]} />
                {constAbre > 0.9 ? (
                  <group position={[0.41, 0, 0.056]}>
                    <Caixa args={[0.74, 1.02, 0.004]} raio={0.002} cor={tema.objetoClaro} sombra={false} />
                    {pagina5 > 0.02 ? <Placa tema={tema} pos={[0, 0.34, 0.004]} rot={[0, 0, 0]} larg={0.66 * Math.min(1, pagina5)} alt={0.2} linhas={[{t: 'ART. 5º, VIII', tam: 150, cor: tema.acento, peso: 900}]} brilho={0.2} /> : null}
                    {['NINGUÉM SERÁ', 'PRIVADO DE', 'DIREITOS POR', 'CONVICÇÃO', 'POLÍTICA'].map((l, i) => {
                      const k = rampa(frase, i / 5, (i + 1) / 5);
                      return k > 0.02 ? <Placa key={l} tema={tema} pos={[0, 0.14 - i * 0.13, 0.004]} larg={0.66 * k} alt={0.11} linhas={[{t: l, tam: 130, cor: i >= 3 ? tema.acento : tema.objetoEscuro, peso: 900}]} brilho={0.15} /> : null;
                    })}
                  </group>
                ) : null}
              </group>
            </group>
          ) : null}
          {/* Escudo na frente do protagonista (ele está na porta) */}
          <Escudo tema={tema} pos={ESCUDO_LEI} escala={0.5 * entra(t, T.perdeDireitos, 0.5) * (1 - rampa(t, T.depoisLei, T.depoisLei + 0.5))} acende={1} />
          {/* Lei 9.029 e as listas */}
          {livro2K > 0.02 ? (
            <group position={[LIVRO2[0], -2.2 * (1 - Math.min(1, livro2K)), LIVRO2[2]]}>
              <Caixa args={[1.7, 0.2, 0.6]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.1, 0]} />
              <group position={[0, 1.1, 0]} scale={1.6 * Math.min(1, livro2K)}>
                <LivroLei tema={tema} pos={[0, 0, 0]} escala={1} abre={livro2Abre} capa={0} />
                {livro2Abre > 0.9 ? (
                  <group position={[-0.41, 0, 0.056]}>
                    <Caixa args={[0.74, 1.02, 0.004]} raio={0.002} cor={tema.objetoClaro} sombra={false} />
                    <Placa tema={tema} pos={[0, 0.1, 0.004]} larg={0.66} alt={0.4} linhas={[{t: 'LEI', tam: 200, cor: tema.objetoEscuro, peso: 900}, {t: '9.029', tam: 230, cor: tema.objetoEscuro, peso: 900}, {t: '1995', tam: 150, cor: tema.textoSuave, peso: 800, mono: true}]} brilho={0.15} />
                  </group>
                ) : null}
              </group>
              <ListaLei tema={tema} pos={[0, LISTA_Y, 0.05]} escala={0.9 * listaA} titulo="PROIBIDO DISCRIMINAR" itens={['PARA CONTRATAR', 'PARA MANTER O EMPREGO']} acesos={[rampa(t, T.contratar, T.contratar + 0.35), rampa(t, T.manter, T.manter + 0.35)]} destaque={[0, 1]} />
              <ListaLei tema={tema} pos={[0, LISTA_Y, 0.05]} escala={0.9 * listaB} titulo="ART. 1º · MOTIVOS" itens={['SEXO', 'RAÇA', 'IDADE', 'ENTRE OUTROS']} acesos={[rampa(t, T.sexo, T.sexo + 0.3), rampa(t, T.raca, T.raca + 0.3), rampa(t, T.idade, T.idade + 0.3), rampa(t, T.entreOutros, T.entreOutros + 0.4)]} destaque={[3]} />
            </group>
          ) : null}
          {/* Justiça do Trabalho, martelo e a folha carimbada */}
          <OrgaoPublico tema={tema} pos={JUSTICA} escala={0.75} sobe={justK} letreiro={rampa(t, T.justica + 0.3, T.justica + 0.8) * (1 - 0.6 * rampa(t, T.repara, T.repara + 0.6))} texto="JUSTIÇA" />
          <Martelo tema={tema} pos={MARTELO} escala={1.1 * marteloK} bate={bate} rotY={-0.4} />
          <FolhaCarimbo tema={tema} pos={FOLHA} rotY={-0.25} escala={1.05 * folhaK} texto={['DEMITIR POR', 'MOTIVO POLÍTICO']} carimbo={rampa(t, T.discriminacao - 0.3, T.discriminacao + 0.15)} textoCarimbo="DISCRIMINAÇÃO" corCarimbo={tema.acento} />
          {/* MPT, a deputada e o empresário (bonecos genéricos, sem nome) */}
          <OrgaoPublico tema={tema} pos={MPT} escala={0.75} sobe={mptK} letreiro={rampa(t, T.ministerio + 0.5, T.ministerio + 1.0)} texto="MPT" />
          <Boneco tema={tema} pos={DEPUTADA} rotY={0.15} escala={0.8 * entra(t, T.umaDeputada, 0.45) * pessoasMPT} cor={tema.objeto} />
          <Candidato tema={tema} pos={EMPRESARIO} rotY={-0.15} cor={tema.objeto} gravata={tema.objetoEscuro} escala={0.8 * entra(t, T.umEmpresario, 0.45) * pessoasMPT} />
          {[
            {k: acaoDep, ate: soma(DEPUTADA, [0.15, 0, 0.95])},
            {k: acaoEmp, ate: soma(EMPRESARIO, [-0.15, 0, 0.95])},
          ].map((a, i) =>
            a.k > 0.02 ? <FolhaCarimbo key={i} tema={tema} pos={curva([MPT[0], 0.8, MPT[2] + 1.6], a.ate, 1.6, a.k)} escala={0.6 * pessoasMPT} texto={['AÇÃO CIVIL', 'PÚBLICA']} carimbo={rampa(t, (i ? T.umEmpresario : T.umaDeputada) + 0.2, (i ? T.umEmpresario : T.umaDeputada) + 0.6)} textoCarimbo="MPT" corCarimbo={tema.objeto} /> : null,
          )}
        </group>
      </group>
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0.4, 1.2, 2.2], 12, 7, [0.1, 1.05, 1])], [T.voceVotou, E([0, 1.2, 2.0], 9, 5.4, [0.1, 0.6, 1])], [T.ilegal + 0.2, E([-0.4, 1.1, 1.8], 7.2, 4.6, [0.06, 0.42, 1])]]},
  {
    ini: T.depoisTurno - 0.2,
    chaves: [
      [T.depoisTurno - 0.2, E([-3.6, 1.4, 6.4], 10.5, 6, [-0.12, 0.45, 1])],
      [T.pediram, E([-3.8, 1.8, 5.0], 9.5, 6, [-0.1, 0.35, 1])],
      [T.demita - 0.2, E([-2.6, 2.0, 1.6], 5.6, 4.2, [-0.05, 0.22, 1])],
      [T.naoContrate + 0.2, E([-0.6, 1.6, 2.4], 8.4, 4.6, [0.06, 0.26, 1])],
      [T.mas - 0.2, E([-0.4, 1.6, 2.4], 8.2, 4.5, [0.08, 0.26, 1])],
    ],
  },
  {
    ini: T.mas - 0.1,
    arco: 0.05,
    chaves: [
      [T.mas - 0.1, E([0, 1.6, 1.0], 13, 6.5, [0, 0.5, 1])],
      [T.primeiro + 0.3, E([-2.4, 1.4, 2.4], 6.2, 4.2, [0.1, 0.3, 1])],
      [T.constituicao + 0.5, E([-3.4, 1.4, 3.0], 3.0, 2.9, [0.12, 0.2, 1])],
      [T.perdeDireitos + 0.2, E([-1.7, 1.3, 1.9], 5.4, 3.4, [0.08, 0.25, 1])],
      [T.lei9029 - 0.2, E([0.6, 1.4, 4.4], 3.4, 3.4, [0, 0.2, 1])],
      [T.proibe + 0.4, E([0.6, 2.5, 4.4], 3.2, 3.4, [0, 0.15, 1])],
      [T.lista + 0.4, E([0.6, 2.9, 4.4], 3.0, 3.2, [0, 0.12, 1])],
      [T.justica, E([3.6, 1.6, 3.8], 6.8, 4.4, [0.1, 0.3, 1])],
      [T.decidiu + 0.2, E([2.4, 1.1, 2.7], 3.8, 2.8, [0.08, 0.25, 1])],
      [T.repara - 0.3, E([2.3, 1.1, 2.7], 3.6, 2.7, [0.1, 0.25, 1])],
    ],
  },
  {
    ini: T.repara - 0.1,
    chaves: [
      [T.repara - 0.1, E([0.8, 1.3, 1.6], 11, 5.5, [0.15, 0.45, 1])],
      [T.simDemitir, E([-1.4, 1.2, 1.5], 8.4, 4.6, [0.05, 0.38, 1])],
      [T.eleNaoPode, E([2.0, 1.2, 1.2], 7.4, 3.8, [0.15, 0.25, 1])],
      [T.seIsso - 0.3, E([2.0, 1.2, 1.2], 7.0, 3.6, [0.17, 0.25, 1])],
    ],
  },
  {
    ini: T.seIsso - 0.1,
    arco: 0.06,
    chaves: [
      [T.seIsso - 0.1, E([-0.4, 1.1, 1.4], 5.6, 3.6, [0, 0.3, 1])],
      [T.paraEmprego, E([-0.8, 1.0, 2.4], 5.2, 3.4, [0.05, 0.3, 1])],
      [T.salarios, E([-0.5, 0.9, 3.4], 4.6, 3.0, [0.1, 0.35, 1])],
      [T.tempoParado, E([-2.6, 1.1, 2.6], 7.6, 3.8, [0.05, 0.35, 1])],
      [T.ouReceber + 0.2, E([-0.2, 0.9, 3.5], 4.4, 3.0, [0.06, 0.35, 1])],
      [T.pedir + 0.2, E([-0.9, 1.0, 3.3], 4.6, 3.2, [0.05, 0.38, 1])],
      [T.aEmpresa - 0.3, E([-0.9, 1.0, 3.3], 4.4, 3.1, [0.07, 0.38, 1])],
    ],
  },
  {
    ini: T.aEmpresa - 0.1,
    arco: 0.05,
    chaves: [
      [T.aEmpresa - 0.1, E([0, 1.6, 2.6], 14, 7, [0, 0.55, 1])],
      [T.dez + 0.2, E([-1.1, 0.9, 9.2], 10.2, 3.4, [0, 0.42, 1])],
      [T.paga, E([-1.1, 0.9, 9.2], 9.8, 3.3, [0.04, 0.42, 1])],
      [T.ficarSem + 0.2, E([4.0, 1.3, 12.2], 5.6, 4, [-0.08, 0.3, 1])],
      [T.bancoPublico + 0.3, E([4.0, 1.3, 12.2], 5.4, 3.9, [-0.04, 0.3, 1])],
      [T.ameacar + 0.2, E([0.3, 1.1, 5.4], 7.2, 4.6, [0, 0.35, 1])],
      [T.prisao, E([0.1, 1.2, 3.6], 6.0, 4.0, [0, 0.3, 1])],
      [T.ministerio - 0.3, E([0.1, 1.2, 3.6], 5.8, 3.9, [0.03, 0.3, 1])],
    ],
  },
  {
    ini: T.ministerio - 0.1,
    chaves: [
      [T.ministerio - 0.1, E([-1.2, 1.6, 3.4], 9.5, 5.2, [0, 0.42, 1])],
      [T.processou, E([-1.6, 1.4, 3.6], 7.2, 4.4, [0, 0.32, 1])],
      [T.umaDeputada + 0.2, E([-0.2, 1.2, 3.1], 5.6, 3.6, [0, 0.28, 1])],
      [T.vale - 0.3, E([-0.1, 1.2, 3.1], 5.2, 3.4, [0.03, 0.26, 1])],
    ],
  },
  {
    ini: T.vale - 0.1,
    arco: 0.05,
    chaves: [
      [T.vale - 0.1, E([0, 1.9, 3.8], 8, 5.4, [0, 0.4, 1])],
      [T.patraoEsquerda, E([0, 1.9, 4.6], 6.4, 4.8, [0, 0.32, 1])],
      [T.seAcontecer - 0.3, E([0, 1.9, 4.6], 6.0, 4.6, [0.04, 0.3, 1])],
    ],
  },
  {
    ini: T.seAcontecer - 0.1,
    chaves: [
      [T.seAcontecer - 0.1, E([-1.0, 1.3, 3.1], 5.0, 3.4, [0.05, 0.25, 1])],
      [T.comVoce + 0.3, E([-0.9, 1.4, 3.4], 4.0, 3.0, [0.05, 0.22, 1])],
      [T.testemunhas + 0.3, E([-1.9, 1.2, 3.3], 5.2, 3.3, [0.05, 0.25, 1])],
      [T.denuncie, E([-0.9, 1.4, 3.5], 3.8, 3.0, [0.03, 0.2, 1])],
      [T.voceJa + 0.3, E([-0.9, 1.3, 3.2], 5.0, 3.4, [0, 0.26, 1])],
      [T.segue, E([-0.5, 1.4, 2.4], 7.4, 4.6, [0, 0.36, 1])],
      [FIM, E([0, 1.2, 0.5], 16, 9, [0, 0.75, 1])],
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.08, grua: 0.025});
};

// ---------- Interface ----------
type Txt = {a: number; b: number; texto: string; destaque?: boolean};
const CHIPS: Txt[] = [
  {a: T.noLula, b: T.ilegal, texto: 'VOTOU NO LULA?'},
  {a: T.ilegal, b: T.depoisTurno, texto: 'É ILEGAL', destaque: true},
  {a: T.pl, b: T.demita, texto: 'LIGADOS AO PL'},
  {a: T.conviccao, b: T.depoisLei, texto: 'CONVICÇÃO POLÍTICA', destaque: true},
  {a: T.politico, b: T.discriminacao, texto: 'DEMITIR POR POLÍTICA ='},
  {a: T.discriminacao, b: T.repara, texto: 'DEMITIR POR POLÍTICA = DISCRIMINAÇÃO', destaque: true},
  {a: T.tempoParado, b: T.ouReceber, texto: 'SALÁRIOS DO TEMPO PARADO'},
  {a: T.danoMoral, b: T.aEmpresa, texto: '+ DANO MORAL', destaque: true},
  {a: T.multa, b: T.dez, texto: 'MULTA'},
  {a: T.bancoPublico, b: T.ameacar, texto: 'SEM EMPRÉSTIMO EM BANCO PÚBLICO'},
  {a: T.antesEleicao, b: T.eleitoral, texto: 'ANTES DA ELEIÇÃO'},
  {a: T.eleitoral, b: T.ministerio, texto: 'PODE SER CRIME ELEITORAL'},
  {a: T.votouDireita, b: T.seAcontecer, texto: 'A LEI VALE PARA TODOS', destaque: true},
  {a: T.sigilo, b: T.voceJa, texto: 'DÁ PARA PEDIR SIGILO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.pediram, b: T.mas, texto: 'TEXTO DOS POSTS · SEGUNDO O PODER360 · 27/10/2026'},
  {a: T.artigo, b: T.depoisLei, texto: 'CONSTITUIÇÃO · ART. 5º, VIII'},
  {a: T.depoisLei + 0.5, b: T.decidiu, texto: 'LEI 9.029/1995 · ART. 1º'},
  {a: T.decidiu, b: T.repara, texto: 'TRT DA 3ª REGIÃO (MG) · 2026'},
  {a: T.escolhe, b: T.aEmpresa, texto: 'LEI 9.029 · ART. 4º'},
  {a: T.multa, b: T.ameacar, texto: 'LEI 9.029 · ART. 3º'},
  {a: T.podeSerCrime, b: T.ministerio, texto: 'CÓDIGO ELEITORAL · ART. 301'},
  {a: T.processou, b: T.vale, texto: 'SEGUNDO CNN BRASIL E O TEMPO · 27 E 29/10/2026'},
  {a: T.siteMPT, b: T.voceJa, texto: 'MPT.MP.BR/ASSEDIO-ELEITORAL'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '14px 30px 18px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 100, fontWeight: 900, letterSpacing: -4, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

// Rótulos presos a pontos do 3D. `onde`: 'mundo' (fixo), 'palco' (gira com o palco) ou 'lei' (grupo do lado da lei).
type Rot = {a: number; b: number; p: V3; onde: 'mundo' | 'palco' | 'lei'; texto: string; acento?: boolean; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.politicos, b: T.mas, p: soma(GRUPO_POL, [0, 1.7, 0]), onde: 'mundo', texto: 'POLÍTICOS'},
  {a: T.empresarios, b: T.mas, p: soma(GRUPO_EMP, [0, 1.7, 0]), onde: 'mundo', texto: 'EMPRESÁRIOS'},
  {a: T.voceVotou, b: T.depoisTurno, p: soma(PROT_MESA, [0, 1.75, 0]), onde: 'palco', texto: 'VOCÊ', acento: true},
  {a: T.isso, b: T.depoisLei, p: [0, 1.75, 0], onde: 'palco', texto: 'VOCÊ', acento: true},
  {a: T.justica, b: T.repara, p: soma(JUSTICA, [0, 2.9, 0]), onde: 'lei', texto: 'JUSTIÇA DO TRABALHO'},
  {a: T.trabalhador, b: T.aEmpresa, p: [0, 1.7, -0.6], onde: 'palco', texto: 'TRABALHADOR', acento: true, dy: 20},
  {a: T.dez, b: T.ameacar, p: soma(CHEQUE0, [0, 1.4, 0]), onde: 'mundo', texto: 'MAIOR SALÁRIO', dy: 10},
  {a: T.umaDeputada, b: T.vale, p: soma(DEPUTADA, [0, 1.65, 0]), onde: 'lei', texto: 'DEPUTADA ESTADUAL · RJ'},
  {a: T.umEmpresario, b: T.vale, p: soma(EMPRESARIO, [0, 1.65, 0]), onde: 'lei', texto: 'EMPRESÁRIO · AP'},
  {a: T.patraoEsquerda, b: T.seAcontecer, p: soma(PATRAO, [0, 1.75, 0]), onde: 'palco', texto: 'PATRÃO DE DIREITA'},
  {a: T.patraoEsquerda + 0.2, b: T.seAcontecer, p: soma(PATRAO2, [0, 1.75, 0]), onde: 'palco', texto: 'PATRÃO DE ESQUERDA'},
];
const paraMundo = (r: {p: V3; onde: Rot['onde']}, g: number): V3 => (r.onde === 'mundo' ? r.p : noPalco(r.onde === 'lei' ? deLei(r.p) : r.p, g));

// Balão do patrão: o desenho de uma urna e uma porta (a ameaça, sem inventar frase).
const Pictograma: React.FC<{tema: Tema}> = ({tema}) => (
  <svg width={150} height={70} viewBox="0 0 150 70">
    <rect x={8} y={22} width={50} height={40} rx={6} fill={tema.objetoClaro} />
    <rect x={20} y={28} width={26} height={4} rx={2} fill={tema.objetoEscuro} />
    <path d="M70 42 L88 42 M82 35 L90 42 L82 49" stroke={tema.textoSuave} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x={100} y={8} width={38} height={56} rx={4} fill="none" stroke={tema.objetoClaro} strokeWidth={5} />
    <circle cx={130} cy={38} r={3.5} fill={tema.objetoClaro} />
  </svg>
);

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const g = giroEm(t);
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const kPode = entra(t, T.justaCausa, 0.45) * (1 - rampa(t, T.seIsso - 0.3, T.seIsso));
  const kNao = entra(t, T.causaVoto, 0.45) * (1 - rampa(t, T.seIsso - 0.3, T.seIsso));
  const k2 = entra(t, T.dobro, 0.45) * (1 - rampa(t, T.pedir - 0.3, T.pedir));
  const k10 = entra(t, T.vezes, 0.45) * (1 - rampa(t, T.ficarSem - 0.3, T.ficarSem));
  const k4 = entra(t, T.ate4, 0.45) * (1 - rampa(t, T.ministerio - 0.3, T.ministerio));
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 170, Math.min(SEGURO.botoesX - 170, x)), top: Math.max(600, Math.min(1180, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 28, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(paraMundo(r, g), cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 360 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y - 60;
  // Balão da deputada (a resposta dela, do mesmo tamanho do processo)
  const kResp = entra(t, T.deputadaDiz + 0.2, 0.45) * (1 - rampa(t, T.vale - 0.35, T.vale - 0.05));
  const pResp = projetar(noPalco(deLei(soma(DEPUTADA, [0, 2.6, 0])), g), cam, W, H);
  // Balão do patrão (urna → porta)
  const kPic = entra(t, T.funcionario + 0.6, 0.45) * (1 - rampa(t, T.podeSerCrime - 0.3, T.podeSerCrime));
  const pPic = projetar(noPalco(soma(PATRAO_PERTO, [0, 1.95, 0]), g), cam, W, H);
  return (
    <>
      {/* Números grandes */}
      {[
        {k: k2, valor: '× 2', rotulo: 'O PERÍODO PARADO EM DOBRO', cor: tema.acento},
        {k: k10, valor: '× 10', rotulo: 'O MAIOR SALÁRIO DA EMPRESA', cor: undefined},
        {k: k4, valor: 'ATÉ 4 ANOS', rotulo: 'DE PRISÃO', cor: undefined},
      ].map((n, i) => (
        <div key={i} style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center'}}>
          <Numero tema={tema} valor={n.valor} rotulo={n.rotulo} k={n.k} cor={n.cor} />
        </div>
      ))}
      {/* Pode × não pode */}
      {kPode > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, kPode * 1.3)}}>
          <Chip tema={tema} texto="SEM JUSTA CAUSA: PODE" k={kPode} tam={32} />
          {kNao > 0.01 ? <Chip tema={tema} texto="PELO VOTO: NÃO PODE" k={kNao} tam={32} destaque /> : null}
        </div>
      ) : null}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 26 ? 27 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {kResp > 0.01 && pResp.visivel ? (
        <div style={{position: 'absolute', left: Math.max(SEGURO.esq + 200, Math.min(SEGURO.botoesX - 200, pResp.x)), top: Math.max(620, pResp.y), transform: `translate(-50%, -100%) translateY(${(1 - kResp) * 12}px)`, opacity: Math.min(1, kResp)}}>
          <div style={{padding: '12px 22px 14px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>“FOI MAL INTERPRETADA”</div>
            <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: tema.textoSuave, marginTop: 4}}>RESPOSTA DA DEPUTADA</div>
          </div>
        </div>
      ) : null}
      {kPic > 0.01 && pPic.visivel ? (
        <div style={{position: 'absolute', left: Math.max(SEGURO.esq + 110, Math.min(SEGURO.botoesX - 110, pPic.x)), top: Math.max(620, pPic.y), transform: `translate(-50%, -100%) scale(${0.8 + 0.2 * Math.min(1, kPic)})`, opacity: Math.min(1, kPic)}}>
          <div style={{padding: '12px 18px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`}}>
            <Pictograma tema={tema} />
          </div>
        </div>
      ) : null}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: selo.texto.length > 40 ? 16 : 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {/* Final */}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE O</div>
            <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 850, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.magno, T.magno + 0.4)}}>MAGNO EXPLICA</div>
            <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>@eumagnoleite</div>
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
  [T.mas, T.repara, T.ministerio].forEach((t) => s.push({t, f: 'whoosh', v: 0.3}));
  [T.depoisTurno, T.aEmpresa, T.vale, T.seAcontecer].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.18}));
  s.push({t: T.ilegal, f: 'ding', v: 0.3});
  [T.politicos, T.empresarios, T.demita, T.naoContrate].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.contrate + 0.3, f: 'baque', v: 0.22});
  [T.constituicao, T.contratar, T.manter, T.sexo, T.raca, T.idade].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.entreOutros, f: 'ding', v: 0.26});
  s.push({t: T.decidiu, f: 'baque', v: 0.32});
  s.push({t: T.discriminacao, f: 'impacto', v: 0.32});
  s.push({t: T.paraEmprego + 1.0, f: 'ding', v: 0.26});
  s.push({t: T.dobro, f: 'subida', v: 0.26});
  for (let i = 0; i < 10; i++) s.push({t: (i === 0 ? T.dez : T.vezes) + i * 0.07, f: 'pop', v: 0.1});
  s.push({t: T.vezes + 0.2, f: 'subida', v: 0.22});
  s.push({t: T.emprestimo + 0.4, f: 'baque', v: 0.26});
  s.push({t: T.ate4, f: 'subida', v: 0.22});
  s.push({t: T.prisao + 0.4, f: 'baque', v: 0.24});
  [T.umaDeputada, T.umEmpresario].forEach((t) => s.push({t: t + 0.3, f: 'impacto', v: 0.18}));
  s.push({t: T.tambemNaoPode, f: 'pop', v: 0.24});
  [T.prints, T.audios, T.testemunhas].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.denuncie, f: 'bip', v: 0.22});
  s.push({t: T.sigilo + 0.4, f: 'tique', v: 0.3});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.24});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.5, T.quebrando + 0.4, T.pediram + 0.6, T.demita + 0.6, T.contrate + 0.6, T.mas + 0.8, T.constituicao + 0.9, T.conviccao + 0.4, T.lei9029 + 0.6, T.manter + 0.5, T.entreOutros + 0.5,
  T.justica + 0.8, T.discriminacao + 0.5, T.repara + 1.2, T.simDemitir + 0.8, T.causaVoto + 0.5, T.seIsso + 0.9, T.paraEmprego + 1.0, T.salarios + 0.8, T.tempoParado + 0.5, T.dobro + 0.3,
  T.danoMoral + 0.3, T.aEmpresa + 0.6, T.vezes + 0.8, T.emprestimo + 0.6, T.funcionario + 1.0, T.ate4 + 0.4, T.prisao + 0.5, T.ministerio + 1.3, T.umEmpresario + 0.5, T.deputadaDiz + 0.8,
  T.qualquerLado + 0.6, T.tambemNaoPode + 0.5, T.comVoce + 0.6, T.testemunhas + 0.6, T.denuncie + 0.7, T.sigilo + 0.5, T.comentarios + 0.4, T.magno + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const DemissaoVoto: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={18} centro={[0, 0, 3]} />
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
      <Marca tema={tema} serie={SERIE} assunto="Demissão por voto" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Demitido', 'por votar', 'no Lula?', 'É ilegal.'];
export const CapaDemissaoVoto: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · DEMISSÃO POR VOTO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
