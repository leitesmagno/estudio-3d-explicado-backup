import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Palco, Placa, Vapor, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, k01, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura, tom} from '../../base/cores';
import {Envelope, curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {CalendarioGrande, Chamine, CofreFGTS, Engrenagem, EsteiraOitoHoras, IconeBalao, Lojinha, Lupa, OrgaoPublico, PrediozinhoFumaca} from '../../pecas';
import {Arquivo, CAMPO, CampoFake, Canhao, CartazFake, CartazinhoVoa, Galpao, Garra, Portico, Prensa, Borracha, TrilhoAlto, bocaCanhao, corFake} from '../fabricafake/pecas';
import {BombaNoticia, BombaPosto, Botijao, Escola, FatiaMoeda, MESA_R, MesaRedonda, SIGLAS, anguloLugar, lugarMesa} from './pecas';
import {PALAVRAS} from './palavras';

// 012. fake do icms (perfil @eumagnoleite, série Magno Explica). Segundo episódio da fábrica de fake do 010.
// Mundo: à esquerda a FÁBRICA DE FAKE (laranja) do 010; à direita a CHECAGEM (verde): a mesa do Confaz com 27 lugares,
// o posto (gasolina, diesel e botijão) e, na frente, o caminho do dinheiro (estado, prefeituras, escola e Fundeb).
// O nome do presidente só aparece escrito no cartaz (TEXTO DO POST) e na etiqueta do boneco genérico, sem rosto.
// Plano: projetos/012. fake do icms/plano.md (versão 1, aprovada em 31/10/2026).

export const FPS = 30;
const AUDIO_SEG = 99.21;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '012. fake do icms';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  fakeNews: quando('fake news'),
  voltou: quando('voltou a funcionar'),
  produto: quando('Agora o produto'),
  icmsGas: quando('o ICMS da gasolina'),
  receita: quando('A receita'),
  pega: quando('pega uma noticia'),
  esconde: quando('esconde quem decidiu'),
  cola: quando('cola a culpa'),
  lula: quando('culpa no Lula'),
  redes: quando('Nas redes'),
  deNovo: quando('de novo'),
  federal: quando('governo federal'),
  mas: quando('Mas o ICMS'),
  dosEstados: quando('imposto dos estados'),
  repara: quando('Repara na data'),
  d27: quando('27'),
  turno: quando('segundo turno'),
  secretarios: quando('secretarios de Fazenda'),
  e26: quando('26 estados'),
  df: quando('Distrito Federal'),
  votaram: quando('votaram'),
  confaz: quando('Confaz'),
  ministerio: quando('Ministerio da Fazenda'),
  quemDecide: quando('quem decide o ICMS'),
  saoEstados: quando('sao os estados'),
  aprovaram: quando('E eles aprovaram'),
  gasolinaPassa: quando('gasolina passa'),
  v157: quando('1,57'),
  v164: quando('1,64'),
  doDiesel: quando('O do diesel'),
  v117: quando('1,17'),
  v130: quando('1,30'),
  gas: quando('gas de cozinha'),
  v091: quando('0,91'),
  fevereiro: quando('Comeca em fevereiro'),
  marco: quando('Em marco'),
  pedido: quando('pedido'),
  baixarem: quando('baixarem'),
  disseramNao: quando('disseram nao'),
  eles: quando('Eles dizem'),
  agoraVem: quando('Agora vem'),
  naoConta: quando('a fabrica nao conta'),
  paraOnde: quando('para onde vai'),
  deCada: quando('De cada R$'),
  c75: quando('75 centavos'),
  comEstado: quando('com o estado'),
  c25: quando('25 centavos'),
  prefeituras: quando('prefeituras'),
  divisao: quando('E a divisao'),
  naoSorte: quando('nao e sorte'),
  p65: quando('65%'),
  produz: quando('produz e vende'),
  p10: quando('10%'),
  aprendizado: quando('aprendizado das escolas'),
  escolaMelhora: quando('a escola melhora'),
  maisIcms: quando('mais ICMS'),
  deCadaReal: quando('E de cada real'),
  c20: quando('20 centavos'),
  fundeb: quando('Fundeb'),
  educacao: quando('educacao basica'),
  entao: quando('Entao'),
  quemDecideE: quando('quem decide e'),
  antes: quando('Antes de compartilhar'),
  confere: quando('confere quem decidiu'),
  voceSabia: quando('Voce sabia'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
  informacoes: quando('informacoes'),
};

const ESTADOS: [number, string][] = [
  [0, 'A FÁBRICA VOLTOU'],
  [T.receita, 'A RECEITA'],
  [T.mas, 'QUEM DECIDIU'],
  [T.aprovaram, 'QUANTO SOBE'],
  [T.marco, 'O PEDIDO'],
  [T.agoraVem, 'PARA ONDE VAI'],
  [T.divisao, 'NÃO É SORTE'],
  [T.deCadaReal, 'O FUNDEB'],
  [T.antes, 'CONFERE QUEM DECIDIU'],
];

// ---------- Mapa do mundo ----------
const PISO_Y = 0.1;
const FAB: V3 = [-6.5, 0, 0];
const CHEC: V3 = [7, 0, -2.25];
const ESTEIRA_Z = 0.6;
const ESTEIRA_Y = 0.8;
const X_ARQ = -10.3;
const X_BOR = -8.0;
const X_PRE = -5.5;
const X_CAN = -2.6;
const ARQ: V3 = [X_ARQ, PISO_Y, -2.2];
const CANHAO: V3 = [-1.9, PISO_Y, -1.5];
const CAMPO_POS: V3 = [-6, 0, -24];
const BOMBA_ESC = 0.6;
// Checagem
const MESA: V3 = [6, PISO_Y, -3.5];
const FAZENDA: V3 = [6, PISO_Y, -7.6];
const CAL: V3 = [2.2, PISO_Y, -0.6];
const BOMBA_G: V3 = [9.0, PISO_Y, 1.6];
const BOMBA_D: V3 = [10.6, PISO_Y, 1.6];
const BOTIJAO: V3 = [12.0, PISO_Y, 2.0];
const PRESIDENTE: V3 = [2.4, PISO_Y, 2.4];
// Caminho do dinheiro (na frente do galpão)
const MOEDA: V3 = [7, 2.2, 6.5];
const ESTADO: V3 = [3.4, 0, 6.2];
const PREFS: V3[] = [
  [9.6, 0, 6.0],
  [11.1, 0, 5.4],
  [12.6, 0, 6.2],
];
const LOJA: V3 = [9.2, 0, 7.6];
const ESCOLA: V3 = [13.2, 0, 8.6];
const MOEDA2: V3 = [7.4, 2.2, 8.8];
const FUNDEB: V3 = [5.2, 0, 9.6];

// ---------- Ajudantes ----------
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const anda = (t: number, a: number, d: number, dist: number) => dist * rampa(t, a, a + d);

// A bomba da notícia: no arquivo; a garra põe na esteira; passa pela borracha, pela prensa e para no canhão.
const bombaEm = (t: number): V3 => {
  const naPrateleira: V3 = [X_ARQ, PISO_Y + 1.53, ARQ[2]];
  const noAlto: V3 = [X_ARQ, 2.6, ARQ[2]];
  const naEsteira: V3 = [X_ARQ, ESTEIRA_Y, ESTEIRA_Z];
  if (t < T.pega + 0.3) return naPrateleira;
  if (t < T.pega + 0.6) return lerp3(naPrateleira, noAlto, rampa(t, T.pega + 0.3, T.pega + 0.6));
  if (t < T.esconde) return lerp3(lerp3(noAlto, [X_ARQ, 2.6, ESTEIRA_Z], rampa(t, T.pega + 0.6, T.pega + 0.95)), naEsteira, rampa(t, T.pega + 0.95, T.esconde - 0.05));
  const x = X_ARQ + anda(t, T.esconde, 0.35, X_BOR - X_ARQ) + anda(t, T.cola, 0.3, X_PRE - X_BOR) + anda(t, T.redes, 0.45, X_CAN - X_PRE);
  return [x, ESTEIRA_Y, ESTEIRA_Z];
};
const descendo = (t: number, a: number, b: number) => rampa(t, a, a + 0.3) * (1 - rampa(t, b, b + 0.35));
const ligada = (t: number) => rampa(t, T.fakeNews, T.fakeNews + 0.6) * (1 - rampa(t, T.mas, T.mas + 1.0));
const GIRO = (() => {
  const out: number[] = [];
  let g = 0;
  for (let q = 0; q <= Math.ceil(FIM * 30) + 2; q++) {
    out.push(g);
    g += (ligada(q / 30) * 1.6) / 30;
  }
  return out;
})();
const giroEm = (t: number) => GIRO[Math.max(0, Math.min(GIRO.length - 1, Math.round(t * 30)))];
const andaEsteira = (t: number) => 100 + 0.4 * Math.max(0, Math.min(t, T.mas) - T.voltou) + anda(t, T.esconde, 0.35, 2.3) + anda(t, T.cola, 0.3, 2.5) + anda(t, T.redes, 0.45, 2.9);

// Os 27 secretários de pé atrás das cadeiras, de frente para a mesa.
const SECRETARIOS = SIGLAS.map((_, i) => ({p: lugarMesa(MESA, i, MESA_R + 0.85), r: anguloLugar(i) + Math.PI}));
const ALVOS = [12, 40, 77, 100, 140, 170, 200, 230, 260, 300, 330, 360].map((i) => CAMPO[i % CAMPO.length]);
const BOCA = bocaCanhao(CANHAO);

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const laranja = corFake(tema);
  const lig = ligada(t);
  const luzFab = 0.35 + 0.65 * Math.max(lig, janela(t, T.fakeNews, T.mas, 0.5)) - 0.35 * rampa(t, T.segue, T.segue + 1.0);
  const luzChec = rampa(t, T.mas, T.mas + 0.8);
  const giro = giroEm(t);
  const bomba = bombaEm(t);
  const portico = (i: number) => {
    const marcos = [T.pega, T.esconde, T.cola, T.redes];
    const fim = i < 3 ? marcos[i + 1] : T.mas;
    return Math.max(0.3 * rampa(t, T.receita + i * 0.15, T.receita + i * 0.15 + 0.3), janela(t, marcos[i], fim, 0.25)) * (1 - rampa(t, T.mas, T.mas + 0.6));
  };
  // Máquinas
  const garraDesce = rampa(t, T.pega, T.pega + 0.3) * (1 - rampa(t, T.pega + 0.3, T.pega + 0.6)) + rampa(t, T.pega + 0.95, T.esconde - 0.15) * (1 - rampa(t, T.esconde - 0.1, T.esconde + 0.2));
  const garraZ = ARQ[2] + (ESTEIRA_Z - ARQ[2]) * rampa(t, T.pega + 0.6, T.pega + 0.95) * (1 - rampa(t, T.esconde + 0.1, T.esconde + 0.8));
  const garraBaixo = garraZ > 0 ? ESTEIRA_Y + 0.85 : PISO_Y + 1.53 + 0.85;
  const borrY = 3.0 - 1.55 * descendo(t, T.esconde + 0.35, T.cola - 0.25);
  const borrVai = 0.16 * Math.sin((t - T.esconde) * 10) * janela(t, T.esconde + 0.55, T.cola - 0.3, 0.15);
  const apaga = rampa(t, T.esconde + 0.6, T.cola - 0.2);
  const preDesce = descendo(t, T.cola + 0.3, T.lula + 0.1);
  const cartazSobe = rampa(t, T.lula, T.lula + 0.4, sai);
  const cartazLinhas = 3 * rampa(t, T.lula, T.redes);
  const recuo = pulso(t, T.redes + 0.5, 0.5);
  const luzCampo = (c: {d: number}) => rampa(t, T.redes + 0.7 + c.d * 0.05, T.redes + 1.2 + c.d * 0.05) * (1 - 0.7 * rampa(t, T.mas, T.mas + 1.0));
  const cartazCinza = rampa(t, T.confere, T.confere + 0.6);
  const carimbo = rampa(t, T.confere + 0.3, T.confere + 0.7);
  const lupaK = entra(t, T.antes + 0.3, 0.5) * (1 - rampa(t, T.voceSabia, T.voceSabia + 0.5));
  // Checagem
  const mesaSobe = rampa(t, T.dosEstados - 0.2, T.dosEstados + 0.8, sai);
  const sigla = (i: number) => Math.max(rampa(t, T.e26 + i * 0.03, T.e26 + i * 0.03 + 0.3) * (i < 26 ? 1 : 0), i === 26 ? rampa(t, T.df, T.df + 0.4) : 0, 0.7 * rampa(t, T.quemDecideE, T.quemDecideE + 0.5));
  const mesaVerde = Math.max(janela(t, T.quemDecide, T.aprovaram + 1, 0.5), janela(t, T.quemDecideE, T.antes, 0.5));
  const fazendaK = rampa(t, T.ministerio - 0.2, T.ministerio + 0.6, sai);
  const calK = entra(t, T.repara, 0.5) * (1 - rampa(t, T.marco, T.marco + 0.5));
  const bombaGK = entra(t, T.gasolinaPassa - 0.3, 0.5);
  const bombaDK = entra(t, T.doDiesel - 0.2, 0.5);
  const botijaoK = entra(t, T.gas - 0.1, 0.5);
  const presK = entra(t, T.marco, 0.5) * (1 - rampa(t, T.agoraVem, T.agoraVem + 0.5));
  const envVai = rampa(t, T.pedido, T.baixarem + 0.8);
  const envVolta = rampa(t, T.disseramNao + 0.3, T.eles + 0.6);
  const mao: V3 = [PRESIDENTE[0] + 0.25, 1.1, PRESIDENTE[2] + 0.35];
  const naMesa: V3 = [MESA[0], 1.0, MESA[2] + 0.4];
  const envPos = envVolta > 0 ? curva(naMesa, mao, 1.4, envVolta) : curva(mao, naMesa, 1.8, envVai);
  const naoK = rampa(t, T.disseramNao - 0.1, T.disseramNao + 0.2);
  // Dinheiro
  const moedaK = rampa(t, T.paraOnde, T.paraOnde + 0.9);
  const moedaPos = curva(soma(BOMBA_G, [0, 2.6, 0]), MOEDA, 2.5, moedaK);
  const dinheiroK = 1 - rampa(t, T.antes, T.antes + 0.6);
  const parte75 = rampa(t, T.comEstado, T.comEstado + 0.9);
  const sep = rampa(t, T.c75, T.c75 + 0.4);
  const estadoK = rampa(t, T.comEstado - 0.3, T.comEstado + 0.5, sai);
  const prefK = (i: number) => rampa(t, T.prefeituras - 0.3 + i * 0.12, T.prefeituras + 0.4 + i * 0.12, sai);
  const parte25 = rampa(t, T.prefeituras, T.prefeituras + 0.9);
  const lojaK = entra(t, T.produz, 0.45);
  const escolaK = entra(t, T.aprendizado - 0.2, 0.5);
  const escolaLuz = Math.max(rampa(t, T.escolaMelhora, T.escolaMelhora + 0.6), 0);
  const moeda2K = entra(t, T.deCadaReal, 0.5);
  const parte20 = rampa(t, T.c20 + 0.2, T.fundeb + 0.4);
  const fundebK = rampa(t, T.fundeb - 0.5, T.fundeb + 0.3, sai);
  // Moedinhas: 3 para as prefeituras; 2 extras para a da loja (produz e vende); 2 extras para a da escola
  const moedinhas: {de: V3; ate: V3; a: number}[] = [
    ...PREFS.map((p, i) => ({de: soma(MOEDA, [0.5, -0.3, 0]), ate: soma(p, [0, 2.2, 0.4]), a: T.prefeituras + 0.4 + i * 0.15})),
    ...[0, 1].map((i) => ({de: soma(MOEDA, [0.3, 0, 0]), ate: soma(PREFS[0], [0, 2.4 + 0.15 * i, 0.4]), a: T.produz + 0.3 + i * 0.2})),
    ...[0, 1].map((i) => ({de: soma(MOEDA, [0.3, 0, 0]), ate: soma(PREFS[2], [0, 2.4 + 0.15 * i, 0.4]), a: T.maisIcms + i * 0.2})),
  ];

  return (
    <group>
      {/* ===== Fábrica (a mesma do 010) ===== */}
      <Galpao tema={tema} pos={FAB} larg={11} prof={8} altFundo={5} altLado={2.5} cor={tom(tema.chao, -0.12)} corParede={mistura(tema.objetoEscuro, laranja, 0.06 * luzFab)} />
      <group position={[FAB[0], 4.3, -3.7]}>
        <Caixa args={[7.4, 0.95, 0.08]} raio={0.04} cor={mistura(tema.objetoEscuro, laranja, 0.75 * luzFab)} emissivo={0.45 * luzFab} />
        <Placa tema={tema} pos={[0, 0, 0.045]} larg={7.0} alt={0.75} linhas={[{t: 'FÁBRICA DE FAKE', tam: 140, cor: tema.fundo, peso: 900}]} brilho={0.3} />
      </group>
      <Chamine tema={tema} pos={[-10.6, 0, -5.8]} alt={9} sobe={1} />
      {lig > 0.05 ? <Vapor pos={[-9.8, 9.1, -6.2]} t={t} cor={tema.objeto} escala={1.6 * Math.max(0.3, lig)} n={7} /> : null}
      {[
        [-9.4, 2.3, 0.9],
        [-7.7, 3.3, 0.6],
        [-3.6, 2.6, 0.75],
      ].map(([x, y, r], i) => (
        <Engrenagem key={i} tema={tema} pos={[x, y, -3.62]} r={r} giro={(i % 2 ? -1 : 1) * giro * (0.9 / r)} cor={mistura(tema.objeto, laranja, 0.2 * luzFab)} />
      ))}
      <EsteiraOitoHoras tema={tema} pos={[FAB[0], PISO_Y, ESTEIRA_Z]} comp={10} anda={andaEsteira(t)} />
      <Arquivo tema={tema} pos={ARQ} />
      <TrilhoAlto tema={tema} x={X_ARQ} y={3.4} z0={ARQ[2]} z1={ESTEIRA_Z} />
      <Garra tema={tema} pos={[X_ARQ, garraBaixo, garraZ]} topo={2.9} desce={garraDesce} fecha={rampa(t, T.pega + 0.2, T.pega + 0.35) * (1 - rampa(t, T.esconde - 0.2, T.esconde))} />
      {[X_ARQ, X_BOR, X_PRE, X_CAN].map((x, i) => (
        <Portico key={i} tema={tema} pos={[x, PISO_Y, ESTEIRA_Z]} larg={1.7} alt={i === 2 ? 4.0 : 3.3} numero={String(i + 1)} aceso={portico(i)} luz={laranja} />
      ))}
      <Borracha tema={tema} pos={[X_BOR - 0.08, 0, ESTEIRA_Z + 0.25]} y={borrY} vai={borrVai} luz={laranja} aceso={portico(1)} />
      <Prensa tema={tema} pos={[X_PRE, 0, ESTEIRA_Z]} topo={3.3} baixo={ESTEIRA_Y + 1.25} desce={preDesce} luz={laranja} aceso={portico(2)} />
      <Canhao tema={tema} pos={CANHAO} recuo={recuo} luz={laranja} aceso={portico(3)} />
      {[
        [-9.0, -1.4, 0.25],
        [-6.8, -1.5, 0],
        [-4.3, -1.4, -0.2],
      ].map(([x, z, r], i) => (
        <Boneco key={i} tema={tema} pos={[x, PISO_Y, z]} rotY={r} escala={0.72} cor={tema.pessoa} pose={{cabeca: [0.25, 0, 0], ombroD: [-0.4, 0, 0.05], cotoveloD: -0.6, tronco: 0.08}} />
      ))}
      {/* A bomba da notícia e o cartaz da fake */}
      <BombaNoticia tema={tema} pos={bomba} escala={BOMBA_ESC} apaga={apaga} luz={pulso(t, T.icmsGas, 1.0)} />
      <CartazFake tema={tema} pos={soma(bomba, [0, 1.25, -0.2])} escala={0.62} textos={['LULA AUMENTOU', 'O ICMS DA', 'GASOLINA']} linhas={cartazLinhas} sobe={cartazSobe} cinza={cartazCinza} />
      {carimbo > 0.02 ? (
        <group position={soma(bomba, [0.1, 2.15, -0.1])} rotation={[0, 0, 0.12]} scale={0.62 * (0.6 + 0.4 * carimbo)}>
          <Caixa args={[2.0, 0.5, 0.03]} raio={0.04} cor={tema.acento} emissivo={0.35} sombra={false} />
          <Placa tema={tema} pos={[0, 0, 0.02]} larg={1.9} alt={0.4} linhas={[{t: 'FOI O ESTADO', tam: 200, cor: tema.fundo, peso: 900}]} brilho={0.35} />
        </group>
      ) : null}
      <Lupa tema={tema} pos={lerp3([X_CAN + 1.6, 3.2, ESTEIRA_Z + 1.4], [X_CAN + 0.2, 2.05, ESTEIRA_Z + 0.7], rampa(t, T.antes + 0.3, T.confere + 0.2, sai))} rot={[0, 0, 0.12]} escala={1.2 * lupaK} />
      {/* Cópias voando e a planície de celulares */}
      {ALVOS.map((c, i) => {
        const a = T.redes + 0.5 + i * 0.07;
        const s = rampa(t, a, a + 1.1);
        if (s <= 0 || s >= 1) return null;
        const alvo: V3 = [CAMPO_POS[0] + c.x, 0.3, CAMPO_POS[2] + c.z];
        return <CartazinhoVoa key={i} tema={tema} pos={curva(BOCA, alvo, 5, s)} rot={[0.4 + s * 2, i * 0.7 + s * 3, 0.3]} escala={1.1 - 0.3 * s} />;
      })}
      <CampoFake tema={tema} pos={CAMPO_POS} luz={luzCampo} cor={laranja} />

      {/* ===== Checagem ===== */}
      <Galpao tema={tema} pos={CHEC} larg={13} prof={12.5} altFundo={1.0} altLado={0.7} cor={mistura(tom(tema.chao, 0.1), tema.acento, 0.06 * luzChec)} corParede={mistura(tema.objetoEscuro, tema.objeto, 0.3)} faixa={tema.acento} kFaixa={luzChec} />
      {/* Mesa do Confaz e os 27 secretários */}
      <MesaRedonda tema={tema} pos={MESA} sobe={mesaSobe} acesas={SIGLAS.map((_, i) => sigla(i))} verde={mesaVerde} centro={Math.max(rampa(t, T.confaz, T.confaz + 0.4), mesaVerde)} />
      {SECRETARIOS.map((s, i) => {
        const k = entra(t, T.secretarios + i * 0.025, 0.4);
        if (k < 0.02) return null;
        const vota = rampa(t, T.votaram + i * 0.03, T.votaram + i * 0.03 + 0.35) * (1 - rampa(t, T.ministerio, T.ministerio + 0.6));
        return <Boneco key={i} tema={tema} pos={[s.p[0], PISO_Y, s.p[2]]} rotY={s.r} escala={0.55 * Math.min(1, k)} cor={mistura(tema.pessoa, tema.acento, 0.5 * vota)} pose={{ombroD: [-2.7 * vota, 0, 0.1], cotoveloD: -0.2 * vota}} />;
      })}
      <OrgaoPublico tema={tema} pos={FAZENDA} escala={0.75} sobe={fazendaK} letreiro={rampa(t, T.ministerio + 0.2, T.ministerio + 0.6) * (1 - 0.7 * rampa(t, T.quemDecide, T.quemDecide + 0.6))} texto="FAZENDA" />
      <CalendarioGrande tema={tema} pos={CAL} rotY={0.4} escala={0.9 * calK} texto={t < T.fevereiro + 0.35 ? '27 OUT 2026' : 'FEV 2027'} folha={rampa(t, T.fevereiro, T.fevereiro + 0.7)} destaque={pulso(t, T.fevereiro + 0.4, 0.8)} />
      {/* Posto */}
      <BombaPosto tema={tema} pos={BOMBA_G} escala={0.9 * bombaGK} nome="GASOLINA" luz={pulso(t, T.v164, 1.0)} />
      <BombaPosto tema={tema} pos={BOMBA_D} escala={0.9 * bombaDK} nome="DIESEL" luz={pulso(t, T.v130, 1.0)} />
      <Botijao tema={tema} pos={BOTIJAO} escala={1.1 * botijaoK} luz={pulso(t, T.v091, 1.0)} />
      {/* O pedido */}
      {presK > 0.02 ? <Boneco tema={tema} pos={PRESIDENTE} rotY={0.7} escala={0.72 * Math.min(1, presK)} cor={tema.objeto} pose={{ombroD: [-0.75 * rampa(t, T.pedido - 0.3, T.pedido), 0, 0.07], cotoveloD: -0.6}} /> : null}
      {envVai > 0.01 && t < T.agoraVem + 0.4 ? (
        <group position={envPos}>
          <Envelope tema={tema} pos={[0, 0, 0]} rotY={0.3} escala={1.6 * (1 - rampa(t, T.agoraVem, T.agoraVem + 0.4))} brilho={0.3} />
          {naoK > 0.02 ? (
            <group position={[0, 0.25, 0.05]} rotation={[0, 0.3, 0.15]} scale={0.45 * naoK}>
              <Caixa args={[1.0, 0.45, 0.03]} raio={0.04} cor={tema.objeto} sombra={false} />
              <Placa tema={tema} pos={[0, 0, 0.02]} larg={0.9} alt={0.36} linhas={[{t: 'NÃO', tam: 300, cor: tema.fundo, peso: 900}]} brilho={0.3} />
            </group>
          ) : null}
        </group>
      ) : null}

      {/* ===== O caminho do dinheiro ===== */}
      {dinheiroK > 0.02 ? (
        <group>
          {/* Moeda de R$ 1: inteira, depois 75 + 25 */}
          {moedaK > 0.02 ? (
            <group>
              <FatiaMoeda tema={tema} pos={parte75 > 0 ? curva(soma(moedaPos, [-0.12 * sep, 0, 0]), soma(ESTADO, [0, 2.6, 0.6]), 1.2, parte75) : soma(moedaPos, [-0.12 * sep, 0, 0])} r={1.0} de={0} ate={0.75} brilho={pulso(t, T.c75, 0.8)} escala={(1 - 0.4 * parte75) * (1 - rampa(t, T.divisao, T.divisao + 0.5))} />
              <FatiaMoeda tema={tema} pos={soma(moedaPos, [0.12 * sep, 0, 0])} r={1.0} de={0.75} ate={1} brilho={pulso(t, T.c25, 0.8)} escala={1 - parte25} />
            </group>
          ) : null}
          <OrgaoPublico tema={tema} pos={ESTADO} escala={0.65} sobe={estadoK} letreiro={rampa(t, T.comEstado, T.comEstado + 0.5)} texto="ESTADO" />
          {PREFS.map((p, i) => {
            const k = prefK(i);
            if (k < 0.02) return null;
            const extra = i === 0 ? rampa(t, T.produz, T.produz + 0.5) : i === 2 ? rampa(t, T.maisIcms, T.maisIcms + 0.5) : 0;
            return (
              <group key={i}>
                <PrediozinhoFumaca tema={tema} pos={[p[0], -1.6 * (1 - k), p[2]]} alt={1.5 + 0.2 * i} larg={0.9} luz={0.3 + 0.7 * extra} />
                <group position={[p[0], 1.5 + 0.2 * i + 0.35 - 1.6 * (1 - k), p[2] + 0.46]}>
                  <Caixa args={[1.1, 0.26, 0.04]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.8 * extra)} emissivo={0.3 * extra} />
                  <Placa tema={tema} pos={[0, 0, 0.025]} larg={1.02} alt={0.2} linhas={[{t: 'PREFEITURA', tam: 150, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
                </group>
              </group>
            );
          })}
          {moedinhas.map((m, i) => {
            const s = rampa(t, m.a, m.a + 0.8);
            if (s < 0.02) return null;
            return <Moeda key={i} tema={tema} pos={curva(m.de, m.ate, 1.0, s)} rot={[Math.PI / 2, 0, 0]} r={0.22} brilho={0.4} escala={s < 0.98 ? 1 : 1 - rampa(t, m.a + 0.8, m.a + 1.2)} />;
          })}
          <Lojinha tema={tema} pos={LOJA} rotY={0.2} escala={0.55 * lojaK} toldo={1} />
          <Escola tema={tema} pos={ESCOLA} rotY={-0.45} escala={0.75 * escolaK} luz={escolaLuz} seta={rampa(t, T.escolaMelhora, T.escolaMelhora + 0.8)} />
          {/* Segunda moeda: 20 centavos para o Fundeb */}
          {moeda2K > 0.02 ? (
            <group>
              <FatiaMoeda tema={tema} pos={parte20 > 0 ? curva(MOEDA2, soma(FUNDEB, [0, 1.9, 0.4]), 1.0, parte20) : MOEDA2} r={0.9} de={0} ate={0.2} brilho={pulso(t, T.c20, 0.8)} escala={Math.min(1, moeda2K) * (1 - 0.5 * parte20)} />
              <FatiaMoeda tema={tema} pos={soma(MOEDA2, [0.08 * rampa(t, T.c20, T.c20 + 0.3), 0, 0])} r={0.9} de={0.2} ate={1} escala={Math.min(1, moeda2K) * (1 - rampa(t, T.entao, T.entao + 0.6))} cor={mistura(tema.acento, tema.objeto, 0.5)} />
            </group>
          ) : null}
          {fundebK > 0.02 ? (
            <group position={[FUNDEB[0], -1.6 * (1 - fundebK), FUNDEB[2]]}>
              <CofreFGTS tema={tema} pos={[0, 0, 0]} abre={0.6 * janela(t, T.c20 + 0.6, T.educacao, 0.4)} trava={0} brilho={pulso(t, T.fundeb + 0.4, 0.9)} />
              <group position={[0, 2.35, 0.2]}>
                <Caixa args={[1.5, 0.36, 0.06]} raio={0.03} cor={tema.acento} emissivo={0.3} />
                <Placa tema={tema} pos={[0, 0, 0.04]} larg={1.4} alt={0.28} linhas={[{t: 'FUNDEB', tam: 230, cor: tema.fundo, peso: 900}]} brilho={0.3} />
              </group>
              {[0, 1, 2].map((i) => (
                <Caixa key={i} args={[0.7 - 0.06 * i, 0.12, 0.5]} raio={0.02} cor={[tema.objetoClaro, tema.acento, tema.areia][i]} position={[0.95, 0.06 + i * 0.13, 0.2]} rotation={[0, 0.2 * i, 0]} scale={entra(t, T.educacao + i * 0.1, 0.4)} />
              ))}
            </group>
          ) : null}
        </group>
      ) : null}
      <Escola tema={tema} pos={ESCOLA} rotY={-0.45} escala={0.75 * (1 - dinheiroK) * rampa(t, T.voceSabia - 0.4, T.voceSabia + 0.2)} luz={1} seta={1} />
      <IconeBalao pos={soma(ESCOLA, [-0.4, 2.6, 0.6])} cor={tema.acento} escala={1.1 * entra(t, T.comentarios, 0.45)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {
    ini: 0,
    chaves: [
      [0, E([-7.2, 4.0, -3.2], 7, 7.5, [0.25, 1.1, 1])],
      [T.fakeNews, E([-6.6, 3.2, -2.2], 8.5, 6.5, [0.15, 0.8, 1])],
      [T.voltou + 0.3, E([-7.5, 2.0, -0.8], 10, 6, [0.05, 0.5, 1])],
      [T.produto + 0.3, E([-10.2, 2.0, -1.8], 4.4, 3.8, [0.3, 0.35, 1])],
      [T.receita - 0.2, E([-10.0, 1.8, -1.4], 4.6, 3.6, [0.3, 0.3, 1])],
    ],
  },
  {
    ini: T.receita - 0.1,
    arco: 0.05,
    chaves: [
      [T.receita - 0.1, E([-8.4, 1.8, 0], 8.6, 4.8, [0.15, 0.3, 1])],
      [T.pega + 0.3, E([-10.1, 1.8, -0.4], 5.6, 4.6, [0.25, 0.34, 1])],
      [T.esconde + 0.4, E([-8.0, 1.8, 0.7], 5.0, 4.2, [0.05, 0.28, 1])],
      [T.cola + 0.4, E([-5.5, 2.4, 0.6], 5.4, 5.0, [0, 0.24, 1])],
      [T.redes + 0.2, E([-2.8, 2.2, 0.3], 5, 4.8, [-0.2, 0.35, 1])],
      [T.redes + 1.2, E([-5.0, 0.5, -15], 14, 16, [0.2, 0.75, 1])],
      [T.federal + 0.4, E([-6.0, 0.3, -21], 17, 13, [0.15, 1.0, 1])],
      [T.mas - 0.3, E([-6.0, 0.3, -21], 16, 12, [0.05, 1.05, 1])],
    ],
  },
  {
    ini: T.mas - 0.2,
    arco: 0.05,
    chaves: [
      [T.mas - 0.2, E([1.5, 1.8, -1.5], 12, 6, [0, 0.5, 1])],
      [T.dosEstados + 0.3, E([6, 1.0, -3.5], 7, 4.5, [0, 0.6, 1])],
      [T.repara + 0.2, E([2.6, 1.0, -1.0], 3.6, 2.8, [0.1, 0.3, 1])],
      [T.turno + 0.2, E([2.8, 1.0, -1.2], 3.8, 3.0, [0.12, 0.32, 1])],
      [T.secretarios + 0.3, E([6, 0.8, -3.5], 6.6, 4.2, [0, 1.0, 1])],
      [T.votaram + 0.3, E([6, 0.8, -3.5], 6.2, 4.0, [0.1, 0.95, 1])],
      [T.ministerio + 0.3, E([6, 1.4, -5.6], 7.6, 5, [0, 0.45, 1])],
      [T.aprovaram - 0.3, E([6, 1.4, -5.4], 7.4, 4.8, [0.05, 0.45, 1])],
    ],
  },
  {
    ini: T.aprovaram - 0.1,
    arco: 0.05,
    chaves: [
      [T.aprovaram - 0.1, E([10.2, 1.4, 1.7], 5.4, 3.6, [0.1, 0.3, 1])],
      [T.gasolinaPassa + 0.2, E([9.2, 1.4, 1.6], 3.2, 3.0, [0.05, 0.2, 1])],
      [T.doDiesel - 0.4, E([9.3, 1.4, 1.6], 3.2, 3.0, [0.05, 0.2, 1])],
      [T.doDiesel + 0.4, E([10.7, 1.4, 1.6], 3.2, 3.0, [0.05, 0.2, 1])],
      [T.gas + 0.2, E([11.6, 1.0, 1.9], 3.4, 2.6, [0.05, 0.25, 1])],
      [T.fevereiro, E([8.0, 1.2, 0.8], 9, 4.2, [0.05, 0.35, 1])],
      [T.marco - 0.3, E([7.6, 1.2, 0.8], 9.4, 4.2, [0.05, 0.35, 1])],
    ],
  },
  {
    ini: T.marco - 0.1,
    chaves: [
      [T.marco - 0.1, E([3.4, 1.2, 0.6], 6.5, 4.2, [0.1, 0.4, 1])],
      [T.baixarem, E([4.6, 1.0, -1.0], 8, 4.6, [0, 0.6, 1])],
      [T.disseramNao, E([5.6, 1.0, -2.6], 6, 4.0, [0, 0.55, 1])],
      [T.eles + 0.4, E([3.8, 1.2, 0.6], 7.6, 4.4, [0.05, 0.45, 1])],
      [T.agoraVem - 0.3, E([3.8, 1.2, 0.6], 7.4, 4.3, [0.08, 0.45, 1])],
    ],
  },
  {
    ini: T.agoraVem - 0.1,
    chaves: [
      [T.agoraVem - 0.1, E([-2.8, 2.2, 0.2], 4.8, 4.4, [-0.1, 0.3, 1])],
      [T.naoConta + 0.3, E([-2.8, 2.2, 0.2], 4.6, 4.2, [-0.12, 0.3, 1])],
      [T.paraOnde + 0.5, E([7, 2.0, 6.5], 5, 4, [0, 0.25, 1])],
      [T.c75 + 0.3, E([6.4, 1.8, 6.4], 6.4, 4.2, [0, 0.28, 1])],
      [T.comEstado + 0.5, E([5.4, 1.6, 6.4], 8.4, 4.4, [0, 0.3, 1])],
      [T.prefeituras + 0.5, E([8.6, 1.4, 6.2], 10, 4.6, [0, 0.35, 1])],
      [T.divisao - 0.3, E([8.8, 1.4, 6.2], 9.6, 4.5, [0.03, 0.35, 1])],
    ],
  },
  {
    ini: T.divisao - 0.1,
    arco: 0.05,
    chaves: [
      [T.divisao - 0.1, E([11, 1.2, 6.4], 6.6, 4, [0, 0.4, 1])],
      [T.produz + 0.3, E([10.2, 1.2, 6.8], 6.0, 3.8, [0, 0.38, 1])],
      [T.aprendizado + 0.2, E([12.6, 1.1, 8.4], 5.6, 3.6, [-0.1, 0.3, 1])],
      [T.maisIcms + 0.4, E([11.6, 1.4, 7.2], 6.8, 4.4, [0, 0.36, 1])],
      [T.deCadaReal - 0.3, E([11.6, 1.4, 7.2], 6.6, 4.3, [0.03, 0.36, 1])],
    ],
  },
  {
    ini: T.deCadaReal - 0.1,
    chaves: [
      [T.deCadaReal - 0.1, E([6.6, 1.8, 8.8], 5.4, 4, [0, 0.3, 1])],
      [T.fundeb + 0.2, E([5.6, 1.2, 9.4], 4.4, 3.4, [0, 0.3, 1])],
      [T.entao + 0.3, E([5, 1, 2], 18, 10, [0, 0.7, 1])],
      [T.antes - 0.3, E([5, 1, 2], 17, 9.5, [0.03, 0.7, 1])],
    ],
  },
  {
    ini: T.antes - 0.1,
    chaves: [
      [T.antes - 0.1, E([-2.6, 2.4, 0.4], 4.6, 4.6, [-0.1, 0.25, 1])],
      [T.confere + 0.4, E([-2.6, 2.4, 0.4], 4.2, 4.2, [-0.08, 0.22, 1])],
      [T.voceSabia, E([-2.6, 2.4, 0.4], 4.1, 4.1, [-0.06, 0.22, 1])],
      [T.voceSabia + 1.3, E([12.6, 1.1, 8.4], 5.0, 3.6, [-0.1, 0.3, 1])],
      [T.segue, E([5, 1.5, 2], 20, 11, [0, 0.6, 1])],
      [FIM, E([2, 1, -2], 26, 14, [0, 0.8, 1])],
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
  {a: T.voltou, b: T.produto, texto: 'DE NOVO?'},
  {a: T.pega, b: T.esconde, texto: 'PASSO 1 · PEGA UMA NOTÍCIA VERDADEIRA'},
  {a: T.esconde, b: T.cola, texto: 'PASSO 2 · ESCONDE QUEM DECIDIU'},
  {a: T.cola, b: T.redes, texto: 'PASSO 3 · COLA A CULPA'},
  {a: T.turno, b: T.secretarios, texto: '2 DIAS DEPOIS DO 2º TURNO'},
  {a: T.saoEstados, b: T.aprovaram, texto: 'QUEM DECIDE: OS ESTADOS', destaque: true},
  {a: T.v164, b: T.doDiesel, texto: '+ R$ 0,07 POR LITRO'},
  {a: T.v130, b: T.gas, texto: '+ R$ 0,13 POR LITRO'},
  {a: T.v091, b: T.fevereiro, texto: '+ R$ 0,91 POR BOTIJÃO'},
  {a: T.fevereiro, b: T.marco, texto: 'A PARTIR DE 1º DE FEVEREIRO DE 2027'},
  {a: T.naoConta, b: T.deCada, texto: 'O QUE A FÁBRICA NÃO CONTA', destaque: true},
  {a: T.naoSorte, b: T.p65, texto: 'NÃO É SORTE'},
  {a: T.escolaMelhora, b: T.deCadaReal, texto: 'ESCOLA MELHOR = MAIS ICMS', destaque: true},
  {a: T.quemDecideE, b: T.antes, texto: 'QUEM DECIDE O ICMS: O ESTADO', destaque: true},
  {a: T.confere, b: T.voceSabia, texto: 'ANTES DE COMPARTILHAR, CONFERE QUEM DECIDIU', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.lula, b: T.deNovo, texto: 'TEXTO DO POST QUE CIRCULA'},
  {a: T.deNovo, b: T.mas, texto: 'A MESMA FAKE FOI CHECADA EM 2025 · AOS FATOS'},
  {a: T.votaram, b: T.aprovaram, texto: 'CONVÊNIOS ICMS 127 E 128/2026 · DOU 28/10/2026'},
  {a: T.aprovaram, b: T.marco, texto: 'CONVÊNIOS ICMS 127 E 128/2026 · CONFAZ'},
  {a: T.marco, b: T.eles, texto: 'INFOMONEY · 17/03/2026'},
  {a: T.eles, b: T.agoraVem, texto: 'SEGUNDO O COMSEFAZ (OS ESTADOS)'},
  {a: T.deCada, b: T.deCadaReal, texto: 'CONSTITUIÇÃO · ART. 158'},
  {a: T.c20, b: T.antes, texto: 'LEI 14.113/2020 · ART. 3º (FUNDEB)'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.e26, b: T.votaram, p: soma(MESA, [0, 1.6, 0]), texto: '26 ESTADOS + DF'},
  {a: T.ministerio + 0.3, b: T.aprovaram, p: soma(FAZENDA, [0, 2.9, 0]), texto: 'MINISTÉRIO DA FAZENDA'},
  {a: T.marco, b: T.agoraVem, p: soma(PRESIDENTE, [0, 1.5, 0]), texto: 'PRESIDENTE'},
  {a: T.pedido, b: T.disseramNao, p: soma(MESA, [0, 1.8, 0]), texto: 'BAIXAR O ICMS DO DIESEL?'},
  {a: T.deCada, b: T.c75, p: soma(MOEDA, [0, 1.2, 0]), texto: 'R$ 1 DE ICMS', acento: true},
  {a: T.comEstado + 0.6, b: T.divisao, p: soma(ESTADO, [0, 3.2, 0]), texto: '75 CENTAVOS', acento: true},
  {a: T.prefeituras + 0.6, b: T.divisao, p: soma(PREFS[1], [0, 2.7, 0]), texto: '25 CENTAVOS', acento: true},
  {a: T.produz, b: T.p10, p: soma(LOJA, [0, 1.5, 0]), texto: 'O QUE A CIDADE PRODUZ E VENDE'},
  {a: T.c20 + 0.4, b: T.entao, p: soma(FUNDEB, [0, 2.4, 0]), texto: '20 CENTAVOS', acento: true},
];

// Visores das bombas: o número troca na hora da palavra.
const VISORES: {a: number; b: number; p: V3; antes: string; depois: string; troca: number}[] = [
  {a: T.gasolinaPassa, b: T.doDiesel, p: soma(BOMBA_G, [0, 1.6 * 0.9, 0.33 * 0.9]), antes: 'R$ 1,57', depois: 'R$ 1,64', troca: T.v164},
  {a: T.doDiesel, b: T.gas, p: soma(BOMBA_D, [0, 1.6 * 0.9, 0.33 * 0.9]), antes: 'R$ 1,17', depois: 'R$ 1,30', troca: T.v130},
  {a: T.v091 - 0.2, b: T.fevereiro, p: soma(BOTIJAO, [0, 1.5, 0]), antes: '+ R$ 0,91', depois: '+ R$ 0,91', troca: T.v091},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 170, Math.min(SEGURO.botoesX - 170, x)), top: Math.max(600, Math.min(1180, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 28, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 360 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y - 60;
  // Balão do argumento dos estados
  const kArg = entra(t, T.eles + 0.2, 0.45) * (1 - rampa(t, T.agoraVem - 0.35, T.agoraVem - 0.05));
  // Barra da divisão entre as cidades
  const kBarra = entra(t, T.p65 - 0.1, 0.45) * (1 - rampa(t, T.escolaMelhora - 0.3, T.escolaMelhora));
  const b65 = rampa(t, T.p65, T.p65 + 0.6);
  const b10 = rampa(t, T.p10, T.p10 + 0.6);
  return (
    <>
      {VISORES.map((v, i) => {
        const k = entra(t, v.a, 0.45) * (1 - rampa(t, v.b - 0.35, v.b - 0.05));
        if (k <= 0.01) return null;
        const pj = projetar(v.p, cam, W, H);
        if (!pj.visivel) return null;
        const depois = t >= v.troca;
        const brilho = pulso(t, v.troca, 0.9);
        return (
          <div key={`v${i}`} style={{position: 'absolute', left: Math.max(SEGURO.esq + 120, Math.min(SEGURO.botoesX - 120, pj.x)), top: Math.max(600, Math.min(1200, pj.y)), transform: 'translate(-50%, -50%)', opacity: Math.min(1, k)}}>
            <div style={{padding: '8px 18px', borderRadius: 12, background: tema.fundo, border: `3px solid ${depois ? tema.acento : tema.cartaoBorda}`, boxShadow: `0 0 ${24 * brilho}px ${tema.acento}`, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: tema.textoSuave}}>ICMS</div>
              <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 800, color: depois ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>{depois ? v.depois : v.antes}</div>
            </div>
          </div>
        );
      })}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 30 ? 24 : chip.texto.length > 24 ? 27 : 32} />
        </div>
      ) : null}
      {kBarra > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.dir + 10, top: 550, opacity: Math.min(1, kBarra), padding: '14px 18px 12px', borderRadius: 18, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`}}>
          <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: tema.textoSuave, marginBottom: 8, textAlign: 'center'}}>COMO OS 25 CENTAVOS SE DIVIDEM ENTRE AS CIDADES</div>
          <div style={{display: 'flex', height: 64, borderRadius: 14, overflow: 'hidden', border: `2px solid ${tema.cartaoBorda}`, background: tema.cartao}}>
            <div style={{width: `${65 * b65}%`, background: tema.objeto, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE, fontWeight: 800, fontSize: 24, color: tema.texto, whiteSpace: 'nowrap', overflow: 'hidden'}}>65% PRODUÇÃO</div>
            <div style={{width: `${25}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, color: tema.textoSuave, whiteSpace: 'nowrap', overflow: 'hidden', opacity: b65}}>LEI DO ESTADO</div>
            <div style={{width: `${10 * b10}%`, background: tema.acento, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE, fontWeight: 900, fontSize: 22, color: tema.fundo, whiteSpace: 'nowrap', overflow: 'hidden'}}>10%</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: tema.textoSuave}}>
            <span>PELO MENOS 65%</span>
            <span style={{color: tema.acento, opacity: b10}}>PELO MENOS 10% · ESCOLAS</span>
          </div>
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {kArg > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center', opacity: Math.min(1, kArg), transform: `translateY(${(1 - Math.min(1, kArg)) * 12}px)`}}>
          <div style={{padding: '14px 24px 16px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', maxWidth: 760}}>
            <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 800, color: tema.texto, lineHeight: 1.15}}>“CORTAR O ICMS NÃO BAIXA O PREÇO NA BOMBA”</div>
            <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: tema.textoSuave, marginTop: 6}}>O ARGUMENTO DOS ESTADOS</div>
          </div>
        </div>
      ) : null}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: selo.texto.length > 40 ? 16 : 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>CONFERE QUEM DECIDIU</div>
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
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.22}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.18}));
  [0, 1, 2, 3].forEach((i) => s.push({t: T.receita + i * 0.15, f: 'pop', v: 0.15}));
  s.push({t: T.pega + 0.3, f: 'pop', v: 0.22});
  s.push({t: T.esconde + 0.6, f: 'tique', v: 0.22});
  s.push({t: T.cola + 0.6, f: 'baque', v: 0.3});
  s.push({t: T.lula, f: 'pop', v: 0.26});
  s.push({t: T.redes + 0.5, f: 'whoosh', v: 0.3});
  for (let i = 0; i < 6; i++) s.push({t: T.e26 + i * 0.12, f: 'pop', v: 0.09});
  for (let i = 0; i < 6; i++) s.push({t: T.votaram + i * 0.12, f: 'pop', v: 0.09});
  s.push({t: T.saoEstados, f: 'ding', v: 0.26});
  [T.v164, T.v130].forEach((t) => s.push({t, f: 'subida', v: 0.24}));
  s.push({t: T.v091, f: 'pop', v: 0.24});
  s.push({t: T.disseramNao, f: 'impacto', v: 0.3});
  s.push({t: T.c75, f: 'pop', v: 0.24});
  s.push({t: T.c25, f: 'pop', v: 0.24});
  [0, 1, 2].forEach((i) => s.push({t: T.prefeituras + 0.9 + i * 0.15, f: 'pop', v: 0.12}));
  s.push({t: T.p65, f: 'subida', v: 0.2});
  s.push({t: T.maisIcms + 0.7, f: 'ding', v: 0.28});
  s.push({t: T.c20, f: 'pop', v: 0.24});
  s.push({t: T.fundeb + 0.4, f: 'tique', v: 0.24});
  s.push({t: T.confere + 0.5, f: 'impacto', v: 0.26});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.24});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.5, T.voltou + 0.6, T.icmsGas + 0.6, T.pega + 0.9, T.esconde + 0.9, T.lula + 0.5, T.redes + 1.4, T.deNovo + 1.0, T.dosEstados + 0.8, T.d27 + 0.5,
  T.e26 + 0.8, T.votaram + 0.6, T.ministerio + 0.8, T.saoEstados + 0.3, T.v164 + 0.5, T.v130 + 0.4, T.v091 + 0.5, T.fevereiro + 0.8, T.pedido + 0.6, T.baixarem + 0.8,
  T.disseramNao + 0.4, T.eles + 1.0, T.naoConta + 0.4, T.deCada + 0.5, T.c75 + 0.5, T.comEstado + 1.0, T.prefeituras + 1.2, T.p65 + 0.6, T.produz + 0.8, T.p10 + 0.6,
  T.escolaMelhora + 0.6, T.maisIcms + 0.9, T.c20 + 0.5, T.fundeb + 0.8, T.entao + 1.0, T.confere + 0.8, T.voceSabia + 0.8, T.comentarios + 0.3, T.arroba + 0.6, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const FakeIcms: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={260} sombraArea={26} centro={[2, 0, 0]} />
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
      <Marca tema={tema} serie={SERIE} assunto="Fake do ICMS" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Lula subiu', 'o ICMS?', 'Não. Foram', 'os estados.'];
export const CapaFakeIcms: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 380}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · FÁBRICA DE FAKE`} t={1} troca={0} y={SEGURO.topo + 160} />
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
