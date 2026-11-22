import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Moeda, Onda, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {CalendarioGrande, Carrinho, CelularGigante, Congresso, DocumentoGrande, Lupa, MarcoAno, PilhaPapeis, Prancheta, PredioColunas, Seta, Urninha, XMarca} from '../../pecas';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 146. tablets da câmara (perfil @eumagnoleite, série Magno Explica). Vídeo nacional, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/146.../mapas/camara.mp4, composição TabletsCamara do kit: voo até o Congresso).
// Praça comprida, da esquerda para a direita: a manchete no celular → a licitação (menor preço) → 604 tablets (513 + 91)
// → o teto e a conta → a data do pregão (nada comprado) → para que serve → os 3 modelos e o iPad acima do teto
// → 2013 x hoje → o Senado (comodato) → fevereiro (nova legislatura) → resumo.
// Tablets são caixas genéricas, sem logo de marca. Fontes: projetos/146. tablets da câmara/audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 149.74;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '146. tablets da câmara';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  gancho: quando('A Câmara vai'),
  seis: quando('seis milhões'),
  manchete: quando('Essa manchete'),
  fui: quando('Eu fui'),
  parte: quando('E tem uma'),
  fato: quando('Começa pelo'),
  licitacao: quando('É uma licitação'),
  empresas: quando('As empresas'),
  ganha: quando('ganha quem'),
  pedido: quando('O pedido é'),
  n513: quando('513 com'),
  cada: quando('um pra cada'),
  n91: quando('E mais 91'),
  setores: quando('outros setores'),
  custa: quando('E quanto custa'),
  maximo: quando('preço máximo'),
  p9809: quando('R$ 9.809'),
  p8119: quando('E até'),
  conta: quando('Faz a conta'),
  da: quando('Dá R$'),
  teto: quando('Esse é o teto'),
  disputa: quando('A disputa tá'),
  dia17: quando('dia 17 de'),
  ateAgora: quando('Até agora'),
  trocar: quando('E por que trocar'),
  acesso: quando('acesso rápido'),
  papel: quando('Menos papel'),
  vistoria: quando('E uso em'),
  repara: quando('Agora repara'),
  falaIpad: quando('A manchete fala'),
  tres: quando('três modelos'),
  ipad: quando('o iPad Pro 11, da'),
  galaxy: quando('dois Galaxy'),
  soQue: quando('Só que o'),
  aPartir: quando('a partir de'),
  dobro: quando('Quase o dobro'),
  naoCabe: quando('Pelo preço máximo'),
  menor: quando('E como ganha'),
  pequeno: quando('Isso quer dizer'),
  nao: quando('Não. São'),
  comparar: quando('Pra comparar'),
  a2013: quando('em 2013'),
  n489: quando('489 tablets'),
  p542: quando('R$ 542'),
  correcao: quando('Sem correção'),
  hojeTeto: quando('Hoje o teto'),
  senado: quando('E o Senado'),
  telefonia: quando('pregão de telefonia'),
  emprestados: quando('celulares emprestados'),
  presidente: quando('O presidente do'),
  naoCompra: quando('não é compra'),
  comodato: quando('é comodato'),
  fica: quando('O aparelho fica'),
  devolver: quando('O senador que'),
  calendario: quando('E tem um detalhe'),
  fevereiro: quando('Em fevereiro'),
  novo: quando('Deputado novo'),
  eleicao: quando('E no mesmo'),
  resumindo: quando('Resumindo'),
  r1: quando('É licitação aberta'),
  r2: quando('A disputa é'),
  r3: quando('Nada foi'),
  r4: quando('E o iPad Pro, pelo'),
  qualquer: quando('Qualquer pessoa'),
  volto: quando('E se a compra'),
  voce: quando('Você acha'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'A MANCHETE'],
  [T.fato, 'O QUE É FATO'],
  [T.custa, 'QUANTO CUSTA'],
  [T.trocar, 'PRA QUÊ'],
  [T.repara, 'A PARTE QUE A MANCHETE NÃO CONTA'],
  [T.pequeno, 'É POUCO DINHEIRO?'],
  [T.senado, 'E O SENADO?'],
  [T.calendario, 'O CALENDÁRIO'],
  [T.resumindo, 'RESUMINDO'],
];

// ---------- O trecho de mapa (Kit Mapas) ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: q(T.fato), ate: q(T.licitacao), origem: 0};
const noMapa = (t: number) => t >= T.fato && t < T.licitacao;

// ---------- Mapa do mundo ----------
const CEL: V3 = [0, 0, 0];
const LIC: V3 = [8, 0, 0];
const TAB: V3 = [16, 0, 0];
const TETO: V3 = [24, 0, 0];
const CAL: V3 = [32, 0, 0];
const USO: V3 = [40, 0, 0];
const MOD: V3 = [49, 0, 0];
const COMP: V3 = [58, 0, 0];
const SEN: V3 = [67, 0, -1];
const FEV: V3 = [76, 0, -1.2];
const RES: V3 = [85, 0, 0];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const mix = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

// tablet genérico (sem marca): corpo escuro e tela acesa
const Tablet: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; cor?: string; brilho?: number}> = ({tema, pos, rot = [0, 0, 0], escala, cor, brilho = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[0.9, 1.28, 0.07]} raio={0.06} cor={tema.objetoEscuro} position={[0, 0.64, 0]} />
      <Caixa args={[0.8, 1.16, 0.02]} raio={0.03} cor={mistura(cor ?? tema.acento, tema.objetoEscuro, 0.55)} emissivo={0.25 + 0.5 * brilho} position={[0, 0.64, 0.04]} sombra={false} />
      {[0, 1, 2, 3].map((i) => (
        <Caixa key={i} args={[i === 0 ? 0.56 : 0.6 - 0.12 * (i % 2), 0.07, 0.01]} raio={0.02} cor={i === 0 ? (cor ?? tema.acento) : tema.objetoClaro} emissivo={0.3} position={[-0.04, 1.04 - 0.2 * i, 0.055]} sombra={false} />
      ))}
    </group>
  );

// pilha de tablets deitados
const Pilha: React.FC<{tema: Tema; pos: V3; n: number; k: number; cor: string}> = ({tema, pos, n, k, cor}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      {Array.from({length: n}, (_, i) => (
        <group key={i} position={[0.02 * Math.sin(i * 1.7), 0.05 + 0.09 * i, 0.02 * Math.cos(i * 2.3)]} rotation={[0, 0.08 * Math.sin(i * 2.1), 0]}>
          <Caixa args={[0.9, 0.07, 1.28]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0, 0]} />
          <Caixa args={[0.8, 0.02, 1.16]} raio={0.02} cor={cor} emissivo={0.2} position={[0, 0.04, 0]} sombra={false} />
        </group>
      ))}
    </group>
  );

// coluna de valor (gráfico em 3D)
const Coluna: React.FC<{tema: Tema; pos: V3; alt: number; k: number; cor: string; brilho?: number}> = ({tema, pos, alt, k, cor, brilho = 0}) =>
  k < 0.02 ? null : <Caixa args={[1.1, Math.max(0.02, alt * k), 1.1]} raio={0.05} cor={cor} emissivo={0.12 + 0.4 * brilho} position={[pos[0], (alt * k) / 2, pos[2]]} />;

const Letreiro: React.FC<{tema: Tema; pos: V3; texto: string; k: number; larg?: number; acento?: boolean; brilho?: number}> = ({tema, pos, texto, k, larg = 1.4, acento, brilho = 0}) =>
  k < 0.02 ? null : (
    <group position={pos} scale={k}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={larg} alt={0.4} linhas={[{t: texto, tam: texto.length > 8 ? 170 : 230, cor: acento ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={acento ? tema.acento : tema.objetoEscuro} brilho={0.2 + 0.5 * brilho} />
    </group>
  );

const ESC = 0.22; // metros por mil reais nos gráficos

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const verde = tema.acento;
  const cinza = mistura(tema.objetoClaro, tema.objeto, 0.35);

  // ----- Cena 1: a manchete no celular -----
  const celK = vis(t, 0, T.fato + 0.2);
  const lupaK = entra(t, T.fui, 0.4) * (1 - rampa(t, T.fato, T.fato + 0.3));

  // ----- Cena 2: licitação, ganha quem cobrar menos -----
  const licK = vis(t, T.licitacao - 0.3, T.custa + 0.6);
  const lances = [0, 1, 2].map((i) => entra(t, T.empresas + 0.25 * i, 0.4));
  const vence = janela(t, T.ganha + 0.3, T.custa + 0.4, 0.4);

  // ----- Cena 3: 604 tablets -----
  const congK = entra(t, T.pedido - 0.3, 0.6) * (1 - rampa(t, T.trocar, T.trocar + 0.5));
  const p513 = entra(t, T.n513, 0.5);
  const p91 = entra(t, T.n91, 0.5);

  // ----- Cena 4: o teto e a conta -----
  const tetoK = entra(t, T.custa - 0.2, 0.5) * (1 - rampa(t, T.trocar, T.trocar + 0.4));
  const t5g = entra(t, T.p9809 - 0.2, 0.45);
  const twf = entra(t, T.p8119 - 0.2, 0.45);
  const contaK = entra(t, T.conta - 0.1, 0.45);
  const totalK = entra(t, T.da - 0.1, 0.45);

  // ----- Cena 5: data do pregão, nada comprado -----
  const calK = vis(t, T.disputa - 0.3, T.trocar + 0.4);
  const carK = entra(t, T.ateAgora - 0.2, 0.45);
  const xCar = entra(t, T.ateAgora + 0.6, 0.4);

  // ----- Cena 6: para que serve -----
  const usoK = vis(t, T.trocar - 0.2, T.repara + 0.4);
  const docVai = rampa(t, T.acesso, T.acesso + 1.0);
  const reuniao = entra(t, T.acesso + 0.8, 0.45);
  const papeis = Math.round(8 * (1 - rampa(t, T.papel - 0.1, T.papel + 1.0)));
  const pranK = entra(t, T.vistoria, 0.45);

  // ----- Cena 7: os 3 modelos e o iPad acima do teto -----
  const modK = [T.ipad, T.galaxy, T.galaxy + 0.5].map((a) => entra(t, a - 0.2, 0.45) * (1 - rampa(t, T.soQue - 0.2, T.soQue + 0.4)));
  const tresK = entra(t, T.tres - 0.3, 0.45);
  const graf = entra(t, T.soQue - 0.2, 0.5);
  const barIpad = rampa(t, T.aPartir - 0.2, T.aPartir + 1.6);
  const linhaTeto = entra(t, T.dobro - 0.2, 0.5);
  const xIpad = entra(t, T.naoCabe + 1.4, 0.4);
  const modSai = rampa(t, T.pequeno, T.pequeno + 0.5);

  // ----- Cena 8: 2013 x hoje -----
  const compK = entra(t, T.comparar - 0.2, 0.5) * (1 - rampa(t, T.senado, T.senado + 0.5));
  const c2013 = rampa(t, T.p542 - 0.1, T.correcao + 0.4);
  const c2026 = rampa(t, T.hojeTeto - 0.1, T.hojeTeto + 1.0);
  const moedasK = entra(t, T.pequeno + 0.3, 0.6) * (1 - rampa(t, T.comparar, T.comparar + 0.4));

  // ----- Cena 9: Senado, comodato -----
  const senK = entra(t, T.senado - 0.2, 0.6);
  const senLuz = janela(t, T.presidente, T.calendario, 0.4);
  const celVai = rampa(t, T.emprestados - 0.2, T.emprestados + 0.9);
  const celVolta = rampa(t, T.devolver + 0.4, T.devolver + 1.4);
  const empresaK = entra(t, T.fica - 0.2, 0.45);

  // ----- Cena 10: fevereiro -----
  const fevK = entra(t, T.calendario - 0.2, 0.6);
  const calFev = entra(t, T.fevereiro - 0.1, 0.45);
  const chegam = rampa(t, T.novo - 0.2, T.eleicao + 0.6);
  const urnaK = entra(t, T.eleicao + 0.3, 0.45);

  // ----- Cena 11: resumo -----
  const resK = [T.r1, T.r2, T.r3, T.r4].map((a) => entra(t, a - 0.1, 0.45));

  return (
    <group>
      <Caixa args={[100, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[44, 0.02, 3.6]} sombra={false} />

      {/* Cena 1 */}
      <CelularGigante tema={tema} pos={CEL} rot={[0, 0.25, 0]} escala={0.9 * celK} tela={celK} baloes={entra(t, T.seis, 1.0)} tarja={1} />
      <Lupa tema={tema} pos={soma(CEL, [0.5 + 0.3 * Math.sin(t * 1.6), 2.0, 0.9])} rot={[0.4, 0, 0.3]} escala={0.7 * lupaK} />

      {/* Cena 2: três empresas dão lance; a mais barata acende */}
      {licK > 0.02
        ? [0, 1, 2].map((i) => (
            <group key={i}>
              <Boneco tema={tema} pos={soma(LIC, [-1.6 + 1.6 * i, 0, 0.6])} rotY={0} escala={0.7 * licK * lances[i]} cor={i === 2 && vence > 0.3 ? tema.pessoa : tema.objetoClaro} />
              <group position={soma(LIC, [-1.6 + 1.6 * i, 1.75, 0.6])} scale={licK * lances[i]}>
                <Placa tema={tema} pos={[0, 0, 0]} larg={1.3} alt={0.42} linhas={[{t: ['R$ 9,8 MIL', 'R$ 9,2 MIL', 'R$ 8,7 MIL'][i], tam: 190, cor: i === 2 && vence > 0.3 ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={i === 2 && vence > 0.3 ? verde : tema.objetoEscuro} brilho={0.2 + 0.5 * (i === 2 ? vence : 0)} />
              </group>
            </group>
          ))
        : null}

      {/* Cena 3: o Congresso e as duas pilhas */}
      <Congresso tema={tema} pos={soma(TAB, [0, 0, -3.2])} escala={0.28 * congK} aceso={janela(t, T.cada, T.n91)} />
      <Pilha tema={tema} pos={soma(TAB, [-1.0, 0, 0.8])} n={14} k={p513 * congK} cor={mistura(verde, tema.objetoClaro, 0.3)} />
      <Pilha tema={tema} pos={soma(TAB, [1.2, 0, 0.8])} n={3} k={p91 * congK} cor={cinza} />

      {/* Cena 4: teto de preço e a conta */}
      {tetoK > 0.02 ? (
        <group>
          <Tablet tema={tema} pos={soma(TETO, [-1.2, 0, 0.4])} escala={1.2 * t5g * tetoK} brilho={pulso(t, T.p9809, 1.0)} />
          <Tablet tema={tema} pos={soma(TETO, [1.2, 0, 0.4])} escala={1.2 * twf * tetoK} cor={cinza} brilho={pulso(t, T.p8119, 1.0)} />
          {contaK > 0.02 ? (
            <group position={soma(TETO, [0, 2.75, -0.4])} scale={contaK * tetoK}>
              <Placa tema={tema} pos={[0, 0, 0]} larg={3.6} alt={0.95} linhas={[{t: '513 × 9.809 + 91 × 8.119', tam: 150, cor: tema.objetoClaro, peso: 800}, {t: totalK > 0.3 ? '= R$ 5,77 MILHÕES' : ' ', tam: 190, cor: verde, peso: 900}]} fundo={tema.objetoEscuro} brilho={0.2 + 0.5 * pulso(t, T.da, 1.0)} />
            </group>
          ) : null}
        </group>
      ) : null}

      {/* Cena 5: dia 17, carrinho vazio */}
      <CalendarioGrande tema={tema} pos={soma(CAL, [-1.0, 0, 0])} texto="17" sub="NOV" folha={rampa(t, T.dia17 - 0.2, T.dia17 + 0.6)} escala={0.9 * calK} destaque={pulso(t, T.dia17, 1.0)} />
      {carK * calK > 0.02 ? (
        <group>
          <Carrinho tema={tema} pos={soma(CAL, [1.6, 0, 0.6])} rotY={-0.4} escala={0.9 * carK * calK} />
          <XMarca tema={tema} pos={soma(CAL, [1.6, 1.2, 1.0])} escala={0.45 * xCar * calK} />
        </group>
      ) : null}

      {/* Cena 6: para que serve */}
      {usoK > 0.02 ? (
        <group>
          <Tablet tema={tema} pos={soma(USO, [0, 0, 0])} escala={1.6 * usoK} brilho={0.3} />
          <DocumentoGrande tema={tema} pos={mix(soma(USO, [-2.0, 1.6, 0.8]), soma(USO, [0, 1.05, 0.4]), docVai)} rot={[-0.2, 0.3 * (1 - docVai), 0]} escala={0.45 * usoK * (1 - rampa(t, T.acesso + 1.0, T.acesso + 1.3))} />
          {[0, 1].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(USO, [1.6 + 0.6 * i, 0, 0.8 - 0.3 * i])} rotY={-0.6} escala={0.55 * reuniao * usoK} cor={i ? tema.objetoClaro : tema.pessoa} />
          ))}
          <group position={soma(USO, [-1.9, 0, 0.6])} scale={usoK}>
            <PilhaPapeis tema={tema} pos={[0, 0, 0]} n={papeis} />
          </group>
          <Prancheta tema={tema} pos={soma(USO, [-1.6, 1.1, 1.3])} rot={[0.3, 0.4, 0]} escala={0.7 * pranK * usoK} carimbo={rampa(t, T.vistoria + 0.6, T.vistoria + 1.0)} corCarimbo={verde} />
        </group>
      ) : null}

      {/* Cena 7: 3 modelos de referência e o gráfico do teto */}
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <Caixa args={[1.1, 0.5, 0.9]} raio={0.04} cor={tema.objetoEscuro} position={soma(MOD, [-2.2 + 2.2 * i, 0.25, 1.4])} scale={[modK[i] * (1 - modSai), modK[i] * (1 - modSai), modK[i] * (1 - modSai)]} />
          <Tablet tema={tema} pos={soma(MOD, [-2.2 + 2.2 * i, 0.5, 1.4])} rot={[-0.15, 0, 0]} escala={0.8 * modK[i] * tresK * (1 - modSai)} cor={i === 0 ? cinza : mistura(verde, tema.objetoClaro, 0.4)} />
        </group>
      ))}
      {graf * (1 - modSai) > 0.02 ? (
        <group>
          <Coluna tema={tema} pos={soma(MOD, [-0.8, 0, -1.4])} alt={9.81 * ESC} k={graf * (1 - modSai)} cor={verde} />
          <Coluna tema={tema} pos={soma(MOD, [0.8, 0, -1.4])} alt={17.4 * ESC} k={barIpad * (1 - modSai)} cor={cinza} brilho={pulso(t, T.dobro, 1.2)} />
          <Caixa args={[4.2 * linhaTeto, 0.05, 1.6]} raio={0.02} cor={verde} emissivo={0.6} position={soma(MOD, [0, 9.81 * ESC + 0.03, -1.4])} sombra={false} />
          <XMarca tema={tema} pos={soma(MOD, [0.8, 17.4 * ESC + 0.5, -1.0])} escala={0.5 * xIpad * (1 - modSai)} />
        </group>
      ) : null}

      {/* Cena 8: moedas (dinheiro público) e 2013 x hoje */}
      {moedasK > 0.02
        ? [0, 1, 2].map((c) =>
            Array.from({length: 4 + 2 * c}, (_, i) => (
              <mesh key={`${c}-${i}`} position={soma(MOD, [-0.9 + 0.9 * c, 0.06 + 0.13 * i * moedasK, 2.6])} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.11, 32]} />
                <meshStandardMaterial color="#E3B34A" emissive="#E3B34A" emissiveIntensity={0.18} roughness={0.35} metalness={0.6} />
              </mesh>
            )),
          )
        : null}
      <MarcoAno tema={tema} pos={soma(COMP, [-1.4, 0, 2.8])} ano="2013" k={compK} aceso={janela(t, T.a2013, T.hojeTeto)} />
      <MarcoAno tema={tema} pos={soma(COMP, [1.4, 0, 2.8])} ano="HOJE" k={compK * entra(t, T.hojeTeto - 0.3, 0.4)} aceso={janela(t, T.hojeTeto, T.senado)} />
      {compK > 0.02 ? (
        <group>
          <Coluna tema={tema} pos={soma(COMP, [-1.4, 0, -0.4])} alt={1.109 * ESC} k={c2013 * compK} cor={cinza} />
          <Coluna tema={tema} pos={soma(COMP, [1.4, 0, -0.4])} alt={9.81 * ESC} k={c2026 * compK} cor={verde} brilho={pulso(t, T.hojeTeto + 0.8, 1.0)} />
          <Pilha tema={tema} pos={soma(COMP, [-3.0, 0, 0.6])} n={5} k={entra(t, T.n489, 0.4) * compK} cor={cinza} />
        </group>
      ) : null}

      {/* Cena 9: Senado e o comodato */}
      <PredioColunas tema={tema} pos={SEN} aceso={senLuz} escala={1.0 * senK} />
      <Letreiro tema={tema} pos={soma(SEN, [0, 3.1 * senK, 1.0])} texto="SENADO" k={senK} larg={1.6} acento={senLuz > 0.3} brilho={senLuz} />
      {empresaK > 0.02 ? (
        <group>
          <Caixa args={[1.6, 1.4, 1.2]} raio={0.05} cor={tema.objetoEscuro} position={soma(SEN, [4.4, 0.7, 1.6])} scale={[empresaK, empresaK, empresaK]} />
          <Letreiro tema={tema} pos={soma(SEN, [4.4, 1.7 * empresaK, 2.25])} texto="EMPRESA" k={empresaK} larg={1.5} />
        </group>
      ) : null}
      {senK > 0.02
        ? [0, 1, 2].map((i) => {
            const a = soma(SEN, [4.4, 1.0, 2.4 + 0.1 * i]);
            const b = soma(SEN, [1.4 + 0.5 * i, 1.0, 2.6]);
            // os 3 vão da empresa para o Senado; o último volta (quem não quiser, devolve)
            const p = i === 2 && celVolta > 0 ? curva(b, a, 1.0, celVolta) : curva(a, b, 1.0, celVai);
            const k = entra(t, T.emprestados - 0.2 + 0.1 * i, 0.4);
            return <CelularGigante key={i} tema={tema} pos={p} rot={[0, -0.3, 0]} escala={0.26 * k * senK} tela={1} baloes={0} tarja={0} />;
          })
        : null}
      <Seta tema={tema} pos={soma(SEN, [3.0, 2.0, 2.4])} rotY={Math.PI} escala={0.5 * entra(t, T.comodato, 0.4) * (1 - rampa(t, T.calendario, T.calendario + 0.4))} cor={verde} />

      {/* Cena 10: fevereiro, deputados novos e a eleição */}
      <Congresso tema={tema} pos={FEV} escala={0.3 * fevK} aceso={janela(t, T.eleicao, T.resumindo)} />
      <CalendarioGrande tema={tema} pos={soma(FEV, [-3.4, 0, 2.2])} texto="1º" sub="FEV" folha={calFev} escala={0.75 * calFev} destaque={pulso(t, T.fevereiro, 1.0)} />
      {fevK > 0.02
        ? [0, 1, 2, 3].map((i) => (
            <Boneco key={i} tema={tema} pos={[FEV[0] + 3.6 - 3.0 * chegam + 0.5 * i, 0, 2.4 + 0.3 * (i % 2)]} rotY={chegam > 0 && chegam < 1 ? -Math.PI / 2 : 0.2} escala={0.5 * entra(t, T.novo - 0.2 + 0.1 * i, 0.4)} cor={i % 2 ? tema.objetoClaro : tema.pessoa} pose={{passo: chegam > 0 && chegam < 1 ? Math.sin(t * 8 + i) : 0}} />
          ))
        : null}
      <Urninha tema={tema} pos={soma(FEV, [2.8, 0, 2.2])} escala={0.8 * urnaK} />

      {/* Cena 11: resumo */}
      {['TETO R$ 5,77 MI', 'DISPUTA 17/11', 'NADA COMPRADO', 'iPAD PRO NÃO CABE'].map((txt, i) =>
        resK[i] > 0.02 ? (
          <group key={i} position={soma(RES, [-1.6 + (i % 2) * 3.2, 0, i < 2 ? -0.6 : 1.2])} scale={resK[i]}>
            <Caixa args={[2.8, 0.5, 1.2]} raio={0.04} cor={tema.objetoEscuro} position={[0, 0.25, 0]} />
            <Placa tema={tema} pos={[0, 0.51, 0]} rot={[-Math.PI / 2, 0, 0]} larg={2.6} alt={1.0} linhas={[{t: txt, tam: 170, cor: i === 2 ? tema.fundo : tema.objetoClaro, peso: 900}]} fundo={i === 2 ? verde : tema.objetoEscuro} />
          </group>
        ) : null,
      )}
      {resK[0] > 0.02 ? <Onda pos={soma(RES, [0, 0.03, 0.3])} k={rampa(t, T.r3, T.r3 + 1.4, (x) => x)} cor={verde} raio={2.6} /> : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0.2, 1.6, 0], 3.6, 3.8, [0.15, 0.2, 1])], [T.manchete, E([0.4, 1.6, 0.2], 4.2, 4.0, [0.05, 0.22, 1])], [T.fui, E([0.6, 1.8, 0.6], 3.6, 3.4, [-0.05, 0.3, 1])], [T.fato - 0.1, E([0.6, 1.8, 0.6], 3.4, 3.2, [-0.08, 0.3, 1])]]},
  {ini: T.fato, chaves: [[T.fato, E([0.6, 1.8, 0.6], 3.4, 3.2, [-0.08, 0.3, 1])], [T.licitacao, E([0.6, 1.8, 0.6], 3.4, 3.2, [-0.08, 0.3, 1])]]},
  {ini: T.licitacao, chaves: [[T.licitacao, E(soma(LIC, [0, 1.2, 0.6]), 6.2, 4.4, [0.12, 0.3, 1])], [T.ganha, E(soma(LIC, [0.2, 1.2, 0.6]), 6.0, 4.2, [0.05, 0.3, 1])], [T.pedido - 0.1, E(soma(LIC, [0.6, 1.2, 0.6]), 5.4, 4.0, [-0.05, 0.3, 1])]]},
  {ini: T.pedido, chaves: [[T.pedido, E(soma(TAB, [0, 1.6, -1.2]), 7.6, 5.6, [0.1, 0.35, 1])], [T.n513, E(soma(TAB, [-0.8, 0.9, 0.6]), 4.2, 3.6, [0.06, 0.35, 1])], [T.n91, E(soma(TAB, [1.0, 0.8, 0.6]), 4.2, 3.4, [-0.04, 0.35, 1])], [T.custa - 0.1, E(soma(TAB, [0.2, 1.0, 0.4]), 5.4, 4.0, [-0.06, 0.35, 1])]]},
  {ini: T.custa, chaves: [[T.custa, E(soma(TETO, [0, 1.2, 0.4]), 5.6, 4.4, [0.1, 0.25, 1])], [T.p9809, E(soma(TETO, [-1.2, 0.9, 0.4]), 3.4, 3.2, [0.06, 0.22, 1])], [T.p8119, E(soma(TETO, [1.2, 0.9, 0.4]), 3.4, 3.2, [-0.06, 0.22, 1])], [T.conta, E(soma(TETO, [0, 1.9, 0]), 5.6, 4.2, [0, 0.25, 1])], [T.disputa - 0.1, E(soma(TETO, [0, 1.9, 0]), 5.2, 4.0, [-0.04, 0.25, 1])]]},
  {ini: T.disputa, chaves: [[T.disputa, E(soma(CAL, [-0.6, 1.1, 0]), 4.4, 3.8, [0.1, 0.25, 1])], [T.ateAgora, E(soma(CAL, [0.6, 0.9, 0.4]), 5.2, 3.8, [0, 0.3, 1])], [T.trocar - 0.1, E(soma(CAL, [1.2, 0.9, 0.6]), 4.6, 3.6, [-0.06, 0.3, 1])]]},
  {ini: T.trocar, chaves: [[T.trocar, E(soma(USO, [0, 1.1, 0.4]), 5.8, 4.4, [0.08, 0.25, 1])], [T.acesso, E(soma(USO, [-0.6, 1.1, 0.4]), 4.8, 3.8, [0.06, 0.25, 1])], [T.papel, E(soma(USO, [-1.4, 0.8, 0.6]), 4.2, 3.4, [0.08, 0.35, 1])], [T.vistoria, E(soma(USO, [-1.0, 1.0, 0.8]), 4.6, 3.6, [0.02, 0.3, 1])], [T.repara - 0.1, E(soma(USO, [0, 1.1, 0.4]), 5.6, 4.2, [-0.06, 0.28, 1])]]},
  {ini: T.repara, chaves: [[T.repara, E(soma(MOD, [0, 1.0, 1.4]), 7.0, 4.4, [0.08, 0.3, 1])], [T.ipad, E(soma(MOD, [-1.6, 0.9, 1.4]), 4.4, 3.4, [0.06, 0.3, 1])], [T.galaxy, E(soma(MOD, [0, 0.9, 1.4]), 7.2, 4.2, [-0.04, 0.3, 1])], [T.soQue, E(soma(MOD, [0, 2.0, -1.0]), 5.8, 5.4, [0.04, 0.2, 1])], [T.dobro, E(soma(MOD, [0.3, 2.4, -1.0]), 5.4, 5.6, [0, 0.2, 1])], [T.pequeno - 0.1, E(soma(MOD, [0.3, 2.2, -0.4]), 6.0, 5.6, [-0.04, 0.22, 1])]]},
  {ini: T.pequeno, chaves: [[T.pequeno, E(soma(MOD, [0, 1.0, 2.6]), 4.6, 3.6, [0.06, 0.25, 1])], [T.comparar - 0.5, E(soma(MOD, [0, 0.8, 2.6]), 4.2, 3.4, [0.0, 0.25, 1])], [T.comparar, E(soma(COMP, [-0.4, 1.4, 0.4]), 7.4, 4.8, [0.06, 0.28, 1])], [T.correcao, E(soma(COMP, [-1.2, 1.0, 0.8]), 6.4, 4.2, [0.06, 0.28, 1])], [T.hojeTeto, E(soma(COMP, [0, 1.4, 0.8]), 7.4, 5.0, [-0.02, 0.26, 1])], [T.senado - 0.1, E(soma(COMP, [0.2, 1.4, 0.8]), 7.2, 5.0, [-0.06, 0.26, 1])]]},
  {ini: T.senado, chaves: [[T.senado, E(soma(SEN, [0.4, 1.6, 1.2]), 7.2, 5.4, [0.1, 0.3, 1])], [T.emprestados, E(soma(SEN, [2.2, 1.4, 1.6]), 9.4, 5.4, [0.04, 0.3, 1])], [T.fica, E(soma(SEN, [2.4, 1.4, 1.6]), 9.4, 5.4, [-0.02, 0.3, 1])], [T.calendario - 0.1, E(soma(SEN, [2.4, 1.4, 1.6]), 9.0, 5.2, [-0.06, 0.3, 1])]]},
  {ini: T.calendario, chaves: [[T.calendario, E(soma(FEV, [0, 1.4, 0.6]), 8.0, 5.6, [0.1, 0.3, 1])], [T.fevereiro, E(soma(FEV, [-2.4, 1.0, 1.8]), 4.8, 3.8, [0.08, 0.3, 1])], [T.novo, E(soma(FEV, [0.6, 1.0, 1.8]), 6.4, 4.2, [0, 0.3, 1])], [T.eleicao, E(soma(FEV, [1.6, 1.2, 1.6]), 5.6, 4.2, [-0.06, 0.3, 1])], [T.resumindo - 0.1, E(soma(FEV, [1.8, 1.2, 1.6]), 5.4, 4.0, [-0.08, 0.3, 1])]]},
  {ini: T.resumindo, chaves: [[T.resumindo, E(soma(RES, [0, 0.8, 0.3]), 7.4, 5.0, [0, 0.55, 1])], [T.voce, E(soma(RES, [0, 0.8, 0.3]), 8.0, 5.4, [0, 0.6, 1])], [FIM, E(soma(RES, [0, 0.8, 0.3]), 9.0, 6.0, [0, 0.62, 1])]]},
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
  {a: T.parte, b: T.fato, texto: 'A PARTE QUE A MANCHETE NÃO CONTA', destaque: true},
  {a: T.ganha, b: T.pedido, texto: 'GANHA O MENOR PREÇO', destaque: true},
  {a: T.n513, b: T.custa, texto: '604 TABLETS'},
  {a: T.teto, b: T.disputa, texto: 'TETO, NÃO VALOR PAGO', destaque: true},
  {a: T.ateAgora, b: T.trocar, texto: 'NADA COMPRADO AINDA', destaque: true},
  {a: T.papel, b: T.repara, texto: 'MENOS PAPEL'},
  {a: T.naoCabe, b: T.pequeno, texto: 'PELO TETO, O iPAD PRO 5G NÃO CABE', destaque: true},
  {a: T.nao, b: T.comparar, texto: 'R$ 5,77 MILHÕES DE DINHEIRO PÚBLICO', destaque: true},
  {a: T.hojeTeto, b: T.senado, texto: 'QUASE 9 VEZES (SEM CORREÇÃO)', destaque: true},
  {a: T.comodato, b: T.calendario, texto: 'COMODATO = EMPRÉSTIMO', destaque: true},
  {a: T.qualquer, b: T.voce, texto: 'ACOMPANHE NO PORTAL DE COMPRAS'},
];
const SELOS: Txt[] = [
  {a: T.n513, b: T.custa, texto: 'FONTE: EDITAL, VIA METRÓPOLES E ND · 11/11/2026'},
  {a: T.maximo, b: T.disputa, texto: 'FONTE: EDITAL · CONTA: 513×9.809,86 + 91×8.119,99'},
  {a: T.disputa, b: T.trocar, texto: 'FONTE: ESTADO DE MINAS · 11/11/2026'},
  {a: T.acesso, b: T.repara, texto: 'FONTE: JUSTIFICATIVA DO EDITAL'},
  {a: T.aPartir, b: T.pequeno, texto: 'FONTE: LOJA DA APPLE NO BRASIL · 12/11/2026'},
  {a: T.a2013, b: T.senado, texto: 'FONTE: CÂMARA DOS DEPUTADOS · RELEASE DE 30/04/2013'},
  {a: T.telefonia, b: T.presidente, texto: 'FONTE: SENADO · PREGÃO 290/2026'},
  {a: T.presidente, b: T.calendario, texto: 'FONTE: AGÊNCIA SENADO · 11/11/2026'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.seis, b: T.fui, p: [0.1, -0.1, 1.0], texto: '"R$ 5,7 MI EM iPADS"'},
  {a: T.empresas, b: T.ganha, p: soma(LIC, [0, 2.5, 0.6]), texto: 'AS EMPRESAS DISPUTAM'},
  {a: T.ganha + 0.3, b: T.pedido, p: soma(LIC, [1.6, 2.5, 0.6]), texto: 'GANHA QUEM COBRA MENOS', acento: true},
  {a: T.n513, b: T.custa, p: soma(TAB, [-1.0, 1.9, 0.8]), texto: '513 · COM 5G', acento: true},
  {a: T.cada, b: T.custa, p: soma(TAB, [-1.0, 1.5, 0.8]), texto: 'UM POR DEPUTADO'},
  {a: T.n91, b: T.custa, p: soma(TAB, [1.2, 1.0, 0.8]), texto: '91 · SÓ WI-FI'},
  {a: T.p9809, b: T.conta, p: soma(TETO, [-1.2, 2.0, 0.4]), texto: 'ATÉ R$ 9.809', acento: true},
  {a: T.p8119, b: T.conta, p: soma(TETO, [1.2, 2.0, 0.4]), texto: 'ATÉ R$ 8.119'},
  {a: T.dia17, b: T.ateAgora, p: soma(CAL, [-1.0, 2.4, 0]), texto: 'PREGÃO: TERÇA, 17/11', acento: true},
  {a: T.acesso, b: T.papel, p: soma(USO, [0, 2.6, 0]), texto: 'SISTEMAS, DOCUMENTOS, REUNIÕES'},
  {a: T.vistoria, b: T.repara, p: soma(USO, [-1.6, 2.0, 1.3]), texto: 'VISTORIAS E COLETA DE DADOS'},
  {a: T.ipad, b: T.soQue, p: soma(MOD, [-2.2, 1.9, 1.4]), texto: 'iPAD PRO 11', acento: true},
  {a: T.galaxy, b: T.soQue, p: soma(MOD, [0, 1.9, 1.4]), texto: 'GALAXY TAB S11'},
  {a: T.galaxy + 0.5, b: T.soQue, p: soma(MOD, [2.2, 1.9, 1.4]), texto: 'GALAXY TAB S10+'},
  {a: T.soQue + 0.4, b: T.pequeno, p: soma(MOD, [-0.8, 9.81 * ESC + 0.5, -1.4]), texto: 'TETO R$ 9.809', acento: true},
  {a: T.aPartir, b: T.pequeno, p: soma(MOD, [0.8, 17.4 * ESC + 0.5, -1.4]), texto: 'iPAD PRO 11 5G: R$ 17.399'},
  {a: T.n489, b: T.correcao, p: soma(COMP, [-3.0, 1.2, 0.6]), texto: '489 TABLETS · R$ 542 MIL'},
  {a: T.correcao, b: T.senado, p: soma(COMP, [-1.4, 2.3, 2.8]), texto: '~R$ 1.100 CADA'},
  {a: T.hojeTeto, b: T.senado, p: soma(COMP, [1.4, 9.81 * ESC + 0.5, -0.4]), texto: 'TETO R$ 9.809', acento: true},
  {a: T.telefonia, b: T.presidente, p: soma(SEN, [0, 3.7, 1.0]), texto: 'R$ 6 MI EM 4 ANOS'},
  {a: T.naoCompra, b: T.calendario, p: soma(SEN, [1.8, 2.6, 2.6]), texto: 'NÃO É COMPRA: COMODATO', acento: true},
  {a: T.fica, b: T.calendario, p: soma(SEN, [4.4, 2.4, 1.6]), texto: 'O APARELHO FICA COM A EMPRESA'},
  {a: T.devolver, b: T.calendario, p: soma(SEN, [1.8, 1.9, 2.6]), texto: 'QUEM NÃO QUISER, DEVOLVE'},
  {a: T.fevereiro, b: T.resumindo, p: soma(FEV, [-3.4, 2.2, 2.2]), texto: 'NOVA LEGISLATURA'},
  {a: T.eleicao, b: T.resumindo, p: soma(FEV, [2.8, 1.6, 2.2]), texto: 'ELEIÇÃO DA PRESIDÊNCIA DA CÂMARA', acento: true},
];

// marca d'água @eumagnoleite quicando (regra fixa do perfil)
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
      <div style={{padding: '9px 20px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 42 ? 17 : 21, fontWeight: 700, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const chipEl = chip ? (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 486, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 30 ? 24 : 30} />
    </div>
  ) : null;
  const fimK = rampa(t, T.segue, T.segue + 0.4);
  const fimEl =
    t > T.segue - 0.05 ? (
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', opacity: fimK, transform: `translateY(${(1 - fimK) * 20}px)`}}>
        <div style={{padding: '24px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE</div>
          <div style={{fontFamily: FONTE, fontSize: 64, fontWeight: 800, color: tema.acento, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
          <div style={{fontFamily: MONO, fontSize: 21, letterSpacing: 3, color: tema.textoSuave, marginTop: 8}}>FATO, FONTE E A CONTA FEITA</div>
        </div>
      </div>
    ) : null;
  if (noMapa(t)) return <>{chipEl}</>;
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 190, Math.min(SEGURO.botoesX - 190, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 22 ? 21 : 25, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
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
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 400 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y + 58;
  return (
    <>
      {chipEl}
      {selo ? seloDe(selo) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {fimEl}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/camara.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.fato, T.licitacao, T.pedido, T.custa, T.disputa, T.trocar, T.repara, T.pequeno, T.senado, T.calendario, T.resumindo].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.2}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.13}));
  s.push({t: T.seis, f: 'bip', v: 0.16});
  [0, 1, 2].forEach((i) => s.push({t: T.empresas + 0.25 * i, f: 'pop', v: 0.14}));
  s.push({t: T.ganha + 0.3, f: 'ding', v: 0.18});
  s.push({t: T.n513, f: 'pop', v: 0.16});
  s.push({t: T.n91, f: 'pop', v: 0.14});
  s.push({t: T.p9809, f: 'tique', v: 0.18});
  s.push({t: T.p8119, f: 'tique', v: 0.16});
  s.push({t: T.da, f: 'ding', v: 0.2});
  s.push({t: T.dia17, f: 'pop', v: 0.16});
  s.push({t: T.ateAgora + 0.6, f: 'baque', v: 0.16});
  s.push({t: T.acesso + 0.8, f: 'whoosh', v: 0.12});
  [T.ipad, T.galaxy, T.galaxy + 0.5].forEach((t) => s.push({t, f: 'pop', v: 0.14}));
  s.push({t: T.aPartir, f: 'subida', v: 0.18});
  s.push({t: T.dobro, f: 'impacto', v: 0.18});
  s.push({t: T.naoCabe + 1.4, f: 'baque', v: 0.18});
  s.push({t: T.p542, f: 'tique', v: 0.16});
  s.push({t: T.hojeTeto, f: 'subida', v: 0.16});
  s.push({t: T.comodato, f: 'ding', v: 0.18});
  s.push({t: T.devolver + 0.4, f: 'whoosh', v: 0.12});
  s.push({t: T.fevereiro, f: 'pop', v: 0.16});
  s.push({t: T.eleicao + 0.3, f: 'pop', v: 0.16});
  [T.r1, T.r2, T.r3, T.r4].forEach((t) => s.push({t, f: 'tique', v: 0.18}));
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.seis + 0.6, T.fui + 0.8, T.fato + 2.0, T.empresas + 0.9, T.ganha + 0.8, T.n513 + 0.8, T.n91 + 0.8, T.p9809 + 0.6, T.p8119 + 0.6,
  T.da + 0.8, T.dia17 + 0.6, T.ateAgora + 1.2, T.acesso + 0.6, T.papel + 0.8, T.vistoria + 1.0, T.ipad + 0.4, T.galaxy + 0.8,
  T.aPartir + 1.6, T.naoCabe + 1.8, T.nao + 0.8, T.correcao + 0.6, T.hojeTeto + 1.2, T.emprestados + 0.8, T.comodato + 0.6, T.fica + 0.8,
  T.devolver + 1.6, T.fevereiro + 0.6, T.novo + 0.8, T.eleicao + 1.0, T.r2 + 0.4, T.r4 + 0.8, T.segue + 0.8, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const TabletsCamara: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
        <TrechoMapa {...MAPA} />
      </Sequence>
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Tablets da Câmara" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['R$ 5,7 mi', 'em iPads?', 'O iPad Pro', 'não cabe.'];
export const CapaTabletsCamara: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = linhas.some((l) => l.length > 12) ? 112 : 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · TABLETS DA CÂMARA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap', marginTop: k === 2 ? 28 : 0}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
