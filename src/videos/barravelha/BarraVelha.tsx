import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, BalancaJustica, Cadeado, CalendarioGrande, Caneta, Carro, Casinha, DocumentoGrande, Lupa, MarcoAno, Martelo, Megafone, OrgaoPublico} from '../../pecas';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 147. barra velha pataxó (perfil @eumagnoleite, série Magno Explica). Vídeo regional, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/147.../mapas/barravelha.mp4, composição BarraVelha do kit: o lugar, a terra, as duas operações).
// Neutro: versão da polícia e versão do movimento com o mesmo peso; nenhum nome de pessoa presa; status exato
// ("inquérito em andamento", "ninguém julgado"). Bonecos genéricos, sem rosto e sem adereço étnico.
// Fontes: projetos/147. barra velha pataxó/audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 138.85;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '147. barra velha pataxó';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  entrou: quando('A polícia entrou'),
  prendeu: quando('prendeu a vice-cacica'),
  crime: quando('Uns dizem'),
  persegue: quando('Outros dizem'),
  fui: quando('Eu fui atrás'),
  mostrar: quando('Vou te mostrar'),
  lugar: quando('Primeiro, o lugar'),
  quarta: quando('Na quarta'),
  civil: quando('a Polícia Civil fez'),
  diz: quando('O que a polícia diz'),
  grupo: quando('grupo armado'),
  n40: quando('mais de 40'),
  maio: quando('desde maio'),
  ameaca: quando('com ameaça'),
  usar: quando('E de usar'),
  tambem: quando('A polícia também'),
  homem: quando('homem de 32'),
  operacao: quando('Na operação'),
  segundo: quando('Segundo a polícia'),
  outra: quando('Outra liderança'),
  bloquear: quando('acusada de bloquear'),
  inquerito: quando('O inquérito'),
  ninguem: quando('Ninguém foi'),
  outroLado: quando('Agora o outro'),
  movimento: quando('O movimento indígena'),
  frageis: quando('alegações frágeis'),
  criminal: quando('Diz que é'),
  afirma: quando('E afirma que'),
  mpi: quando('O Ministério dos'),
  defensoria: quando('E a Defensoria'),
  porque: quando('E por que essa'),
  terra: quando('A Terra Indígena'),
  estudo: quando('O estudo da'),
  a2008: quando('saiu em 2008'),
  falta: quando('Só que falta'),
  portaria: quando('a portaria do'),
  anos18: quando('Já são 18'),
  mpf: quando('O Ministério Público'),
  justica: quando('E a Justiça'),
  repara: quando('Agora repara'),
  dezembro: quando('Em dezembro'),
  duas: quando('saíram duas'),
  uma: quando('Uma, sobre'),
  casos: quando('São casos'),
  regua: quando('Mas é por'),
  torta: quando('régua torta'),
  ms: quando('E não é'),
  diaAntes: quando('Um dia antes'),
  terena: quando('prendeu lideranças'),
  contestou: quando('A Defensoria contestou'),
  fato: quando('Então, o que'),
  hOp: quando('Houve operação'),
  hPr: quando('Houve prisões'),
  acusacao: quando('A acusação'),
  demarc: quando('E a demarcação'),
  apura: quando('Crime se apura'),
  direito: quando('E direito'),
  voce: quando('E você'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'OS DOIS LADOS'],
  [T.lugar, 'O LUGAR'],
  [T.quarta, 'O QUE A POLÍCIA DIZ'],
  [T.outroLado, 'O QUE O MOVIMENTO DIZ'],
  [T.porque, 'A TERRA'],
  [T.repara, 'A RÉGUA'],
  [T.ms, 'NÃO É SÓ AQUI'],
  [T.fato, 'O QUE É FATO'],
];

// ---------- Os trechos de mapa (Kit Mapas) ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.lugar), ate: q(T.quarta), origem: 0};
const MAPA_B = {de: q(T.terra), ate: q(T.estudo), origem: q(T.quarta) - q(T.lugar)};
const MAPA_C = {de: q(T.uma), ate: q(T.casos), origem: q(T.quarta) - q(T.lugar) + q(T.estudo) - q(T.terra)};
const noMapa = (t: number) => (t >= T.lugar && t < T.quarta) || (t >= T.terra && t < T.estudo) || (t >= T.uma && t < T.casos);

// ---------- Mapa do mundo ----------
const ALD: V3 = [0, 0, 0];
const OP: V3 = [11, 0, 0];
const PRI: V3 = [21, 0, 0];
const LADO: V3 = [31, 0, 0];
const DEM: V3 = [41, 0, 0];
const RG: V3 = [52, 0, 0];
const MS: V3 = [62, 0, -0.8];
const RES: V3 = [71, 0, 0];

const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

const Letreiro: React.FC<{tema: Tema; pos: V3; texto: string; k: number; larg?: number; acento?: boolean; brilho?: number}> = ({tema, pos, texto, k, larg = 1.4, acento, brilho = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={larg} alt={0.4} linhas={[{t: texto, tam: texto.length > 8 ? 170 : 230, cor: acento ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={acento ? tema.acento : tema.objetoEscuro} brilho={0.2 + 0.5 * brilho} />
    </group>
  );

// casinhas da aldeia com árvores
const Vila: React.FC<{tema: Tema; pos: V3; k: number; n?: number; apaga?: number}> = ({tema, pos, k, n = 5, apaga = 0}) =>
  k < 0.02 ? null : (
    <group position={pos}>
      {Array.from({length: n}, (_, i) => (
        <Casinha key={i} tema={tema} pos={[-2.4 + 1.2 * i, 0, -0.6 * (i % 2)]} cor={mistura(i % 2 ? tema.objetoClaro : tema.objeto, tema.objetoEscuro, 0.5 * apaga * (i < Math.round(n * 0.6) ? 1 : 0))} escala={0.75 * k} />
      ))}
      {[-3.4, 3.4, 0.4].map((x, i) => (
        <ArvoreRedonda key={`a${i}`} tema={tema} pos={[x, 0, -2.2 - 0.3 * i]} r={0.42} cresce={k} />
      ))}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const verde = tema.acento;

  // ----- Cena 1: chegada da polícia, os dois lados, os documentos -----
  const vilaK = entra(t, 0, 0.6) * (1 - rampa(t, T.lugar, T.lugar + 0.4));
  const carroAnda = rampa(t, 0.2, 2.4);
  const balK = vis(t, T.crime - 0.2, T.lugar);
  const balY = 0;
  const docK = entra(t, T.fui - 0.1, 0.45) * (1 - rampa(t, T.lugar, T.lugar + 0.3));

  // ----- Cena 2: a operação (versão da polícia) -----
  const opK = entra(t, T.quarta - 0.3, 0.6) * (1 - rampa(t, T.outroLado, T.outroLado + 0.5));
  const casasK = entra(t, T.grupo - 0.4, 0.6) * (1 - rampa(t, T.outroLado, T.outroLado + 0.5));
  const saem = rampa(t, T.n40, T.maio + 1.0);
  const calMaio = entra(t, T.maio - 0.1, 0.45) * (1 - rampa(t, T.usar, T.usar + 0.4));
  const caixaK = entra(t, T.usar, 0.45) * (1 - rampa(t, T.tambem + 0.2, T.tambem + 0.6));
  const lupaK = entra(t, T.tambem, 0.45) * (1 - rampa(t, T.operacao, T.operacao + 0.4));

  // ----- Cena 3: as prisões e o status -----
  const priK = entra(t, T.operacao - 0.2, 0.5) * (1 - rampa(t, T.inquerito - 0.2, T.inquerito + 0.3));
  const p2 = entra(t, T.outra - 0.1, 0.45);
  const cad1 = entra(t, T.segundo, 0.4);
  const cad2 = entra(t, T.bloquear, 0.4);
  const passos = entra(t, T.inquerito - 0.2, 0.45);

  // ----- Cena 4: o outro lado -----
  const ladoK = entra(t, T.outroLado - 0.2, 0.6) * (1 - rampa(t, T.terra, T.terra + 0.5));
  const megaK = entra(t, T.movimento, 0.45);
  const orgK = [T.mpi, T.defensoria].map((a) => entra(t, a - 0.2, 0.6));

  // ----- Cena 5: a demarcação parada -----
  const demK = entra(t, T.estudo - 0.3, 0.6) * (1 - rampa(t, T.repara, T.repara + 0.5));
  const m2008 = entra(t, T.a2008 - 0.2, 0.45);
  const mPort = entra(t, T.falta, 0.45);
  const docPort = entra(t, T.portaria - 0.2, 0.45);
  const canetaVai = 0.5 + 0.5 * Math.sin(t * 1.6);
  const mpfK = entra(t, T.mpf - 0.2, 0.6);
  const martK = entra(t, T.justica - 0.1, 0.45);

  // ----- Cena 6: as duas operações e a régua -----
  const calDez = vis(t, T.dezembro - 0.2, T.uma + 0.2);
  const rgK = entra(t, T.casos - 0.3, 0.6) * (1 - rampa(t, T.ms, T.ms + 0.5));
  const cadeados = [0, 1, 2, 3, 4, 5].map((i) => entra(t, T.casos + 0.1 * i, 0.4));
  const lupas = [0, 1].map((i) => entra(t, T.casos + 0.6 + 0.15 * i, 0.4));

  // ----- Cena 7: Mato Grosso do Sul -----
  const msK = entra(t, T.ms - 0.2, 0.6) * (1 - rampa(t, T.fato, T.fato + 0.5));
  const terK = entra(t, T.terena - 0.2, 0.45);
  const dpuK = entra(t, T.contestou - 0.1, 0.45);

  // ----- Cena 8: o que é fato -----
  const resK = [T.hOp, T.hPr, T.acusacao, T.demarc].map((a) => entra(t, a - 0.1, 0.45));
  const fimBal = entra(t, T.apura - 0.2, 0.6);

  return (
    <group>
      <Caixa args={[90, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[36, 0.02, 3.6]} sombra={false} />

      {/* Cena 1 */}
      <Vila tema={tema} pos={soma(ALD, [0, 0, -1.2])} k={vilaK} />
      {vilaK > 0.02 ? [0, 1].map((i) => <Carro key={i} tema={tema} pos={soma(ALD, [-9 + 5.0 * carroAnda + 1.8 * i, 0, 2.6 + 0.4 * i])} rotY={Math.PI / 2} escala={0.55} cor={tema.objetoClaro} farol={0.6} anda={carroAnda < 1 ? 1 : 0} />) : null}
      <BalancaJustica tema={tema} pos={soma(ALD, [0, 0, 1.6])} escala={0.8 * balK} inclina={0.25 * Math.sin(t * 1.4) * balK} brilhoEsq={pulso(t, T.crime, 1.0)} brilhoDir={pulso(t, T.persegue, 1.0)} />
      {docK > 0.02 ? <Caixa args={[1.5, 0.5, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(ALD, [3.0, 0.25, 1.4])} scale={[docK, docK, docK]} /> : null}
      <DocumentoGrande tema={tema} pos={soma(ALD, [3.0, 0.55, 1.4])} rot={[-0.9, -0.2, 0]} escala={0.7 * docK} />
      <Lupa tema={tema} pos={soma(ALD, [3.2 + 0.3 * Math.sin(t * 1.6), 1.3, 1.7])} rot={[0.4, 0, 0.3]} escala={0.65 * entra(t, T.mostrar, 0.4) * docK} />

      {/* Cena 2: a operação */}
      <OrgaoPublico tema={tema} pos={soma(OP, [-3.4, 0, -1.6])} escala={0.75} sobe={opK} letreiro={opK} porta={rampa(t, T.civil, T.civil + 0.8)} texto="POLÍCIA" />
      {opK > 0.02 ? <Carro tema={tema} pos={soma(OP, [-3.4, 0, 1.0])} rotY={0.3} escala={0.55 * opK} cor={tema.objetoClaro} farol={0.5} /> : null}
      <Vila tema={tema} pos={soma(OP, [2.0, 0, -1.0])} k={casasK} apaga={saem} />
      {casasK > 0.02
        ? [0, 1, 2, 3].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(OP, [0.6 + 0.6 * i + 3.4 * saem, 0, 1.0 + 0.3 * (i % 2)])} rotY={saem > 0 && saem < 1 ? Math.PI / 2 : 0.3} escala={0.5 * casasK * entra(t, T.n40 - 0.2 + 0.1 * i, 0.4)} cor={i % 2 ? tema.objetoClaro : tema.pessoa} pose={{passo: saem > 0 && saem < 1 ? Math.sin(t * 8 + i) : 0}} />
          ))
        : null}
      <CalendarioGrande tema={tema} pos={soma(OP, [-0.6, 0, 1.8])} texto="MAIO" sub="2026" folha={calMaio} escala={0.6 * calMaio} />
      {caixaK > 0.02 ? (
        <group position={soma(OP, [1.4, 0, 1.6])} scale={caixaK}>
          <Caixa args={[1.2, 0.8, 0.9]} raio={0.05} cor={tema.objetoEscuro} position={[0, 0.4, 0]} />
          <Placa tema={tema} pos={[0, 0.81, 0]} rot={[-Math.PI / 2, 0, 0]} larg={1.0} alt={0.6} linhas={[{t: '?', tam: 420, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} />
        </group>
      ) : null}
      <Lupa tema={tema} pos={soma(OP, [4.2 + 0.4 * Math.sin(t * 1.3), 1.2, 1.4])} rot={[0.4, 0, 0.3]} escala={0.8 * lupaK} />

      {/* Cena 3: as prisões */}
      {priK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(PRI, [-1.6, 0, 0.8])} rotY={0.2} escala={0.75 * priK} cor={tema.pessoa} />
          <Cadeado tema={tema} pos={soma(PRI, [-1.0, 0.6, 1.3])} k={cad1 * priK} fecha={rampa(t, T.segundo + 0.3, T.segundo + 0.8)} />
          <Boneco tema={tema} pos={soma(PRI, [0.6, 0, 0.8])} rotY={-0.2} escala={0.75 * priK * p2} cor={tema.objetoClaro} />
          <Cadeado tema={tema} pos={soma(PRI, [1.2, 0.6, 1.3])} k={cad2 * priK} fecha={rampa(t, T.bloquear + 0.3, T.bloquear + 0.8)} />
        </group>
      ) : null}
      {['INQUÉRITO', 'DENÚNCIA', 'JULGAMENTO'].map((n, i) => (
        <MarcoAno key={n} tema={tema} pos={soma(PRI, [-1.8 + 1.8 * i, 0, 2.8])} ano={n} k={passos * (1 - rampa(t, T.outroLado, T.outroLado + 0.5)) * entra(t, T.inquerito - 0.2 + 0.15 * i, 0.4)} aceso={i === 0 ? pulso(t, T.inquerito, 2.0) * 0.5 + 0.5 : 0} />
      ))}

      {/* Cena 4: o outro lado */}
      {ladoK > 0.02
        ? [0, 1, 2, 3, 4].map((i) => <Boneco key={i} tema={tema} pos={soma(LADO, [-1.6 + 0.8 * i, 0, 0.8 - 0.4 * (i % 2)])} rotY={0.1 * (2 - i)} escala={0.6 * ladoK * entra(t, T.outroLado + 0.1 * i, 0.4)} cor={i % 2 ? tema.objetoClaro : tema.pessoa} />)
        : null}
      <Megafone tema={tema} pos={soma(LADO, [0, 1.2, 1.4])} rot={[0, 0, 0.3]} escala={0.6 * megaK * ladoK} />
      <OrgaoPublico tema={tema} pos={soma(LADO, [-3.4, 0, -2.2])} escala={0.55} sobe={orgK[0] * ladoK} letreiro={orgK[0] * ladoK} texto="MPI" />
      <OrgaoPublico tema={tema} pos={soma(LADO, [3.4, 0, -2.2])} escala={0.55} sobe={orgK[1] * ladoK} letreiro={orgK[1] * ladoK} texto="DPU" />

      {/* Cena 5: a demarcação parada */}
      <MarcoAno tema={tema} pos={soma(DEM, [-2.2, 0, 1.4])} ano="2008" k={m2008 * demK} aceso={janela(t, T.a2008, T.falta)} />
      <MarcoAno tema={tema} pos={soma(DEM, [1.6, 0, 1.4])} ano="PORTARIA" k={mPort * demK} aceso={pulso(t, T.anos18, 1.6)} />
      {demK > 0.02 ? <Caixa args={[3.6 * rampa(t, T.falta, T.anos18 + 0.8), 0.05, 0.2]} raio={0.02} cor={verde} emissivo={0.4} position={soma(DEM, [-2.2 + 1.8 * rampa(t, T.falta, T.anos18 + 0.8), 0.04, 1.4])} sombra={false} /> : null}
      {docPort * demK > 0.02 ? <Caixa args={[1.5, 0.5, 1.1]} raio={0.04} cor={tema.objetoEscuro} position={soma(DEM, [1.6, 0.25, -0.4])} scale={[docPort * demK, docPort * demK, docPort * demK]} /> : null}
      <DocumentoGrande tema={tema} pos={soma(DEM, [1.6, 0.55, -0.4])} rot={[-0.9, 0, 0]} escala={0.7 * docPort * demK} carimbo={0} />
      <Caneta tema={tema} pos={soma(DEM, [2.1, 1.3 + 0.25 * canetaVai, -0.2])} rot={[0.3, 0, 0.6]} escala={0.8 * docPort * demK} />
      <OrgaoPublico tema={tema} pos={soma(DEM, [-3.6, 0, -2.4])} escala={0.55} sobe={mpfK * demK} letreiro={mpfK * demK} texto="MPF" />
      <Martelo tema={tema} pos={soma(DEM, [3.8, 0, 0.8])} escala={0.7 * martK * demK} bate={pulso(t, T.justica + 0.4, 0.8)} rotY={-0.4} />

      {/* Cena 6: dezembro de 2025 e a régua */}
      <CalendarioGrande tema={tema} pos={soma(RG, [0, 0, 0.6])} texto="9" sub="DEZ 2025" folha={calDez} escala={0.85 * calDez} destaque={pulso(t, T.duas, 1.0)} />
      <BalancaJustica tema={tema} pos={soma(RG, [0, 0, -0.6])} escala={1.1 * rgK} inclina={0} brilhoEsq={pulso(t, T.torta, 1.2)} brilhoDir={pulso(t, T.torta, 1.2)} />
      {rgK > 0.02 ? cadeados.map((k, i) => <Cadeado key={i} tema={tema} pos={soma(RG, [-3.3 + 0.55 * (i % 3), 0.35 + 0.0, 1.4 + 0.6 * Math.floor(i / 3)])} k={k * rgK} fecha={1} />) : null}
      {rgK > 0.02 ? lupas.map((k, i) => <Lupa key={i} tema={tema} pos={soma(RG, [2.7 + 0.8 * i, 0.6, 1.6])} rot={[0.3, 0, 0.3]} escala={0.6 * k * rgK} />) : null}

      {/* Cena 7: Mato Grosso do Sul */}
      <OrgaoPublico tema={tema} pos={soma(MS, [-2.0, 0, -0.8])} escala={0.75} sobe={msK} letreiro={msK} texto="PF" />
      {msK > 0.02 ? [0, 1, 2].map((i) => <Boneco key={i} tema={tema} pos={soma(MS, [0.8 + 0.8 * i, 0, 1.2])} rotY={-0.3} escala={0.6 * terK * msK} cor={i % 2 ? tema.objetoClaro : tema.pessoa} />) : null}
      <OrgaoPublico tema={tema} pos={soma(MS, [3.6, 0, -1.6])} escala={0.5} sobe={dpuK * msK} letreiro={dpuK * msK} texto="DPU" />

      {/* Cena 8: o que é fato */}
      {['OPERAÇÃO: HOUVE', 'PRISÕES: HOUVE', 'JULGAMENTO: AINDA NÃO', 'DEMARCAÇÃO: PARADA'].map((txt, i) =>
        resK[i] > 0.02 ? (
          <group key={i} position={soma(RES, [-1.7 + (i % 2) * 3.4, 0, i < 2 ? -0.6 : 1.2])} scale={resK[i]}>
            <Caixa args={[3.0, 0.5, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
            <Placa tema={tema} pos={[0, 0.51, 0]} rot={[-Math.PI / 2, 0, 0]} larg={2.8} alt={1.0} linhas={[{t: txt, tam: txt.length > 16 ? 140 : 160, cor: i >= 2 ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={i >= 2 ? verde : tema.objetoEscuro} />
          </group>
        ) : null,
      )}
      <BalancaJustica tema={tema} pos={soma(RES, [0, 0, -3.2])} escala={1.0 * fimBal} inclina={0} brilhoEsq={pulso(t, T.apura + 0.8, 1.2)} brilhoDir={pulso(t, T.apura + 0.8, 1.2)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ALD, [-1.0, 1.0, 0]), 8.4, 5.4, [0.15, 0.32, 1])], [T.crime - 0.2, E(soma(ALD, [0, 1.1, 0.6]), 7.0, 5.0, [0.08, 0.3, 1])], [T.fui, E(soma(ALD, [1.4, 1.1, 1.0]), 6.4, 4.4, [-0.02, 0.32, 1])], [T.lugar - 0.1, E(soma(ALD, [2.6, 1.0, 1.4]), 4.4, 3.6, [-0.08, 0.4, 1])]]},
  {ini: T.lugar, chaves: [[T.lugar, E(soma(ALD, [2.6, 1.0, 1.4]), 4.4, 3.6, [-0.08, 0.4, 1])], [T.quarta, E(soma(ALD, [2.6, 1.0, 1.4]), 4.4, 3.6, [-0.08, 0.4, 1])]]},
  {ini: T.quarta, chaves: [[T.quarta, E(soma(OP, [-2.4, 1.6, -0.4]), 6.6, 5.0, [0.12, 0.3, 1])], [T.grupo, E(soma(OP, [0.4, 1.2, 0]), 9.4, 5.4, [0.06, 0.3, 1])], [T.n40, E(soma(OP, [2.0, 1.0, 0.2]), 7.4, 4.6, [0.02, 0.3, 1])], [T.maio, E(soma(OP, [1.0, 1.0, 0.8]), 7.4, 4.6, [0, 0.3, 1])], [T.usar, E(soma(OP, [1.4, 0.9, 1.2]), 5.2, 3.8, [-0.02, 0.32, 1])], [T.tambem, E(soma(OP, [3.0, 1.0, 1.0]), 5.6, 4.0, [-0.05, 0.32, 1])], [T.operacao - 0.1, E(soma(OP, [3.6, 1.0, 1.0]), 5.4, 3.8, [-0.08, 0.32, 1])]]},
  {ini: T.operacao, chaves: [[T.operacao, E(soma(PRI, [-0.8, 1.2, 0.8]), 5.4, 4.2, [0.1, 0.25, 1])], [T.outra, E(soma(PRI, [-0.4, 1.2, 0.8]), 6.0, 4.4, [0.02, 0.25, 1])], [T.inquerito, E(soma(PRI, [0, 1.0, 1.8]), 7.0, 4.6, [0, 0.32, 1])], [T.outroLado - 0.1, E(soma(PRI, [0.2, 1.0, 1.8]), 6.8, 4.4, [-0.05, 0.32, 1])]]},
  {ini: T.outroLado, chaves: [[T.outroLado, E(soma(LADO, [0, 1.2, 0.6]), 6.6, 4.6, [0.1, 0.25, 1])], [T.frageis, E(soma(LADO, [0, 1.2, 0.8]), 5.6, 4.2, [0.04, 0.25, 1])], [T.mpi, E(soma(LADO, [-1.6, 1.4, -0.6]), 6.0, 4.6, [0.06, 0.28, 1])], [T.defensoria, E(soma(LADO, [1.6, 1.4, -0.6]), 6.0, 4.6, [-0.06, 0.28, 1])], [T.terra - 0.1, E(soma(LADO, [0, 1.4, -0.4]), 8.6, 5.6, [0, 0.28, 1])]]},
  {ini: T.terra, chaves: [[T.terra, E(soma(LADO, [0, 1.4, -0.4]), 8.6, 5.6, [0, 0.28, 1])], [T.estudo, E(soma(LADO, [0, 1.4, -0.4]), 8.6, 5.6, [0, 0.28, 1])]]},
  {ini: T.estudo, chaves: [[T.estudo, E(soma(DEM, [-1.4, 1.2, 1.0]), 5.6, 4.2, [0.1, 0.3, 1])], [T.falta, E(soma(DEM, [0, 1.1, 1.0]), 6.6, 4.4, [0.03, 0.3, 1])], [T.portaria, E(soma(DEM, [1.6, 1.0, 0.2]), 4.6, 3.8, [0, 0.35, 1])], [T.anos18, E(soma(DEM, [0, 1.1, 1.0]), 6.8, 4.4, [0, 0.3, 1])], [T.mpf, E(soma(DEM, [-2.4, 1.4, -1.2]), 5.6, 4.4, [0.06, 0.28, 1])], [T.justica, E(soma(DEM, [3.0, 1.0, 0.6]), 5.0, 4.0, [-0.05, 0.3, 1])], [T.repara - 0.1, E(soma(DEM, [2.6, 1.0, 0.6]), 5.4, 4.0, [-0.08, 0.3, 1])]]},
  {ini: T.repara, chaves: [[T.repara, E(soma(RG, [0, 1.2, 0.6]), 4.6, 4.0, [0.08, 0.25, 1])], [T.uma - 0.1, E(soma(RG, [0, 1.2, 0.6]), 4.2, 3.8, [0, 0.25, 1])]]},
  {ini: T.uma, chaves: [[T.uma, E(soma(RG, [0, 1.4, 0.4]), 8.4, 5.4, [0, 0.3, 1])], [T.casos, E(soma(RG, [0, 1.4, 0.4]), 8.4, 5.4, [0, 0.3, 1])]]},
  {ini: T.casos, chaves: [[T.casos, E(soma(RG, [-0.2, 1.4, 0.6]), 9.8, 5.8, [0.06, 0.3, 1])], [T.regua, E(soma(RG, [-0.2, 1.6, 0.4]), 9.4, 5.8, [0, 0.3, 1])], [T.ms - 0.1, E(soma(RG, [-0.2, 1.6, 0.4]), 9.0, 5.6, [-0.06, 0.3, 1])]]},
  {ini: T.ms, chaves: [[T.ms, E(soma(MS, [0, 1.4, 0]), 8.0, 5.4, [0.1, 0.3, 1])], [T.terena, E(soma(MS, [0.6, 1.2, 0.4]), 7.0, 4.8, [0.03, 0.3, 1])], [T.contestou, E(soma(MS, [2.4, 1.2, 0]), 6.4, 4.6, [-0.05, 0.3, 1])], [T.fato - 0.1, E(soma(MS, [2.4, 1.2, 0]), 6.2, 4.4, [-0.08, 0.3, 1])]]},
  {ini: T.fato, chaves: [[T.fato, E(soma(RES, [0, 0.8, 0.3]), 8.0, 5.2, [0, 0.55, 1])], [T.apura, E(soma(RES, [0, 1.2, -1.2]), 8.4, 6.2, [0, 0.42, 1])], [FIM, E(soma(RES, [0, 1.2, -1.0]), 9.6, 6.8, [0, 0.5, 1])]]},
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
  {a: T.mostrar, b: T.lugar, texto: 'OS DOIS LADOS, COM FONTE', destaque: true},
  {a: T.diz, b: T.operacao, texto: 'VERSÃO DA POLÍCIA'},
  {a: T.inquerito, b: T.outroLado, texto: 'INQUÉRITO EM ANDAMENTO · NINGUÉM JULGADO', destaque: true},
  {a: T.movimento, b: T.porque, texto: 'VERSÃO DO MOVIMENTO INDÍGENA'},
  {a: T.anos18, b: T.mpf, texto: '18 ANOS ESPERANDO A PORTARIA', destaque: true},
  {a: T.casos, b: T.regua, texto: 'CASOS DIFERENTES, PROVAS DIFERENTES'},
  {a: T.regua, b: T.ms, texto: '"RÉGUA TORTA": O QUE O MOVIMENTO DIZ', destaque: true},
  {a: T.apura, b: T.voce, texto: 'PROVA DOS DOIS LADOS · PORTARIA ASSINADA', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.civil, b: T.operacao, texto: 'FONTE: POLÍCIA CIVIL, VIA CORREIO E ARATU ON · 11/11/2026'},
  {a: T.operacao, b: T.outroLado, texto: 'FONTE: PAUTA DAS 7 E CORREIO · 11/11/2026'},
  {a: T.movimento, b: T.mpi, texto: 'FONTE: NOTA DO MUPOIBA · ALMA PRETA E JORNAL MASSA'},
  {a: T.mpi, b: T.porque, texto: 'FONTE: MPI E DPU, VIA PAUTA DAS 7'},
  {a: T.estudo, b: T.justica, texto: 'FONTE: MPF · NOTA TÉCNICA 01/2026'},
  {a: T.justica, b: T.repara, texto: 'FONTE: JUSTIÇA FEDERAL · ACP 1004568-06.2021.4.01.3310'},
  {a: T.dezembro, b: T.uma, texto: 'FONTE: POLÍCIA CIVIL DA BAHIA · 12/2025'},
  {a: T.diaAntes, b: T.fato, texto: 'FONTE: CORREIO DO ESTADO E CAMPO GRANDE NEWS · 10/11/2026'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.crime, b: T.fui, p: soma(ALD, [-1.3, 2.5, 1.6]), texto: '"É CRIME"'},
  {a: T.persegue, b: T.fui, p: soma(ALD, [1.3, 2.5, 1.6]), texto: '"É PERSEGUIÇÃO"'},
  {a: T.grupo, b: T.n40, p: soma(OP, [2.0, 2.2, -1.0]), texto: 'GRUPO ARMADO SUSPEITO'},
  {a: T.n40, b: T.usar, p: soma(OP, [2.6, 1.6, 1.0]), texto: 'MAIS DE 40 MORADORES SAÍRAM', acento: true},
  {a: T.ameaca, b: T.usar, p: soma(OP, [-0.6, 2.0, 1.8]), texto: 'AMEAÇA COM ARMA'},
  {a: T.usar, b: T.tambem, p: soma(OP, [1.4, 1.5, 1.6]), texto: 'CASAS PRA GUARDAR ARMAS E DROGAS'},
  {a: T.homem, b: T.operacao, p: soma(OP, [4.2, 2.0, 1.4]), texto: 'HOMEM DE 32 ANOS SUMIU EM OUTUBRO'},
  {a: T.operacao, b: T.inquerito, p: soma(PRI, [-1.6, 2.5, 0.8]), texto: 'VICE-CACICA · PRESA', acento: true},
  {a: T.segundo, b: T.inquerito, p: soma(PRI, [-1.6, 1.7, 0.8]), texto: 'SUSPEITA: ASSOCIAÇÃO AO TRÁFICO'},
  {a: T.outra, b: T.inquerito, p: soma(PRI, [0.8, 2.5, 0.8]), texto: 'OUTRA LIDERANÇA · FLAGRANTE', acento: true},
  {a: T.bloquear, b: T.inquerito, p: soma(PRI, [0.8, 1.9, 0.8]), texto: 'ACUSADA DE BLOQUEAR VIATURA'},
  {a: T.frageis, b: T.mpi, p: soma(LADO, [-2.0, 2.3, 0.8]), texto: '"ALEGAÇÕES FRÁGEIS"', acento: true},
  {a: T.criminal, b: T.mpi, p: soma(LADO, [2.0, 2.3, 0.8]), texto: '"CRIMINALIZAÇÃO"', acento: true},
  {a: T.afirma, b: T.mpi, p: soma(LADO, [0, 1.6, 0.8]), texto: 'SAÍRAM NÃO INDÍGENAS DA TERRA, DIZ O MOVIMENTO'},
  {a: T.mpi, b: T.terra, p: soma(LADO, [-3.4, 2.6, -2.2]), texto: 'ACOMPANHA O CASO'},
  {a: T.defensoria, b: T.terra, p: soma(LADO, [3.4, 2.6, -2.2]), texto: 'ACOMPANHA O CASO'},
  {a: T.a2008, b: T.repara, p: soma(DEM, [-2.2, 2.2, 1.4]), texto: 'ESTUDO DA FUNAI', acento: true},
  {a: T.portaria, b: T.repara, p: soma(DEM, [1.6, 2.4, 1.4]), texto: 'FALTA ASSINAR'},
  {a: T.mpf, b: T.justica, p: soma(DEM, [-3.6, 2.8, -2.4]), texto: 'COBRA A ASSINATURA'},
  {a: T.justica, b: T.repara, p: soma(DEM, [3.8, 1.6, 0.8]), texto: 'MANDOU CONCLUIR'},
  {a: T.duas, b: T.uma, p: soma(RG, [0, 2.2, 0.6]), texto: 'DUAS OPERAÇÕES NO MESMO DIA'},
  {a: T.casos, b: T.ms, p: soma(RG, [-2.8, 1.4, 1.4]), texto: 'FAZENDA: 6 DE PRISÃO'},
  {a: T.casos + 0.6, b: T.ms, p: soma(RG, [3.1, 1.4, 1.6]), texto: 'ALDEIA: 0 DE PRISÃO'},
  {a: T.diaAntes, b: T.fato, p: soma(MS, [-2.0, 2.8, -0.8]), texto: 'MATO GROSSO DO SUL · 10/11'},
  {a: T.terena, b: T.fato, p: soma(MS, [1.6, 1.8, 1.2]), texto: 'LIDERANÇAS TERENA PRESAS'},
  {a: T.contestou, b: T.fato, p: soma(MS, [3.6, 2.4, -1.6]), texto: 'CONTESTOU AS PRISÕES', acento: true},
];

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

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 404, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 16 : 21, fontWeight: 700, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 30 ? 22 : 30} />
    </div>
  ) : null;
  const fimK = rampa(t, T.segue, T.segue + 0.4);
  const fimEl =
    t > T.segue - 0.05 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: fimK, transform: `translateY(${(1 - fimK) * 20}px)`}}>
        <div style={{padding: '24px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE</div>
          <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>FATO, FONTE E OS DOIS LADOS</div>
        </div>
      </div>
    ) : null;
  if (noMapa(t)) return <>{selo ? seloDe(selo) : null}</>;
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 200, Math.min(SEGURO.botoesX - 200, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 30 ? 18 : txt.length > 22 ? 21 : 25, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y, k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  visRot.sort((a, b) => a.i - b.i);
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 420 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y + 58;
  return (
    <>
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {fimEl}
    </>
  );
};

const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/barravelha.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.lugar, T.quarta, T.operacao, T.outroLado, T.terra, T.estudo, T.repara, T.uma, T.casos, T.ms, T.fato].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.crime, f: 'pop', v: 0.14});
  s.push({t: T.persegue, f: 'pop', v: 0.14});
  s.push({t: T.n40, f: 'tique', v: 0.16});
  s.push({t: T.maio, f: 'pop', v: 0.14});
  s.push({t: T.segundo + 0.5, f: 'baque', v: 0.16});
  s.push({t: T.bloquear + 0.5, f: 'baque', v: 0.14});
  s.push({t: T.inquerito, f: 'ding', v: 0.16});
  s.push({t: T.frageis, f: 'pop', v: 0.14});
  s.push({t: T.criminal, f: 'pop', v: 0.14});
  s.push({t: T.a2008, f: 'tique', v: 0.16});
  s.push({t: T.anos18, f: 'subida', v: 0.16});
  s.push({t: T.justica + 0.4, f: 'baque', v: 0.16});
  s.push({t: T.duas, f: 'pop', v: 0.14});
  s.push({t: T.torta, f: 'ding', v: 0.16});
  s.push({t: T.contestou, f: 'tique', v: 0.14});
  [T.hOp, T.hPr, T.acusacao, T.demarc].forEach((t) => s.push({t, f: 'tique', v: 0.16}));
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, 2.6, T.crime + 0.8, T.persegue + 0.8, T.mostrar + 0.8, T.lugar + 3.0, T.civil + 1.0, T.grupo + 0.6, T.n40 + 1.0, T.maio + 0.8, T.usar + 1.0,
  T.homem + 0.6, T.segundo + 1.0, T.bloquear + 0.8, T.ninguem + 0.6, T.frageis + 0.6, T.afirma + 1.2, T.mpi + 0.8, T.defensoria + 0.8, T.porque + 1.0,
  T.terra + 5.0, T.a2008 + 0.6, T.portaria + 0.8, T.anos18 + 0.8, T.mpf + 0.8, T.justica + 0.8, T.dezembro + 1.2, T.uma + 8.0,
  T.casos + 1.2, T.torta + 0.5, T.terena + 0.8, T.contestou + 0.8, T.acusacao + 0.6, T.demarc + 1.0, T.apura + 1.0, T.segue + 0.8, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const BarraVelha: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const ini = CENAS[i].ini;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = camEm(t);
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.25], [3, 0], clamp) : 0;
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={200} sombraArea={24} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {[MAPA_A, MAPA_B, MAPA_C].map((m, k) => (
        <Sequence key={k} from={m.de} durationInFrames={m.ate - m.de} layout="none">
          <TrechoMapa {...m} />
        </Sequence>
      ))}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Barra Velha" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const TITULO_CAPA = ['Prisão na', 'aldeia-mãe', 'Pataxó:', 'os 2 lados'];
export const CapaBarraVelha: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.some((l) => l.length > 12) ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · BARRA VELHA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap', marginTop: k === 3 ? 28 : 0}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
