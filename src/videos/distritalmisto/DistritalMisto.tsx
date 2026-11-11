import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, Placa, Caixa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type Pose, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Balanca, Cadeado, Cadeira, Congresso, IconeBalao, Urna} from '../../pecas';
import {FolhaCarimbo, ListaLei, PlacaChao} from '../demissaovoto/pecas';
import {Corda, N_CADEIRAS, PilhaVotos, PlacaPreco, PlenarioCamara} from './pecas';
import {PALAVRAS} from './palavras';

// 013. voto distrital misto (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta o vídeo (o plenário em miniatura, a "loja de cadeiras", o puxador, as duas urnas,
// a lista, o calendário e os 308 votos) e encaixa dois trechos de mapa do Kit Mapas Animados
// (projetos/013.../mapas/bahia.mp4, composição DistritalBahia do kit): "HOJE" (a Bahia inteira,
// 39 vagas) e "OS DISTRITOS" (a Bahia em ~20 distritos ilustrativos, Ilhéus, o ELEITO).
// Ninguém real com rosto: os puxadores são bonecos genéricos com etiqueta; o exemplo usa PARTIDO A e B.
// Plano: projetos/013. voto distrital misto/plano.md (versão 1, aprovada em 02/11/2026).

export const FPS = 30;
const AUDIO_SEG = 124.23;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '013. voto distrital misto';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  voceVotou: quando('Voce votou'),
  numDeputado: quando('num deputado'),
  eleitoOutro: quando('eleito outro'),
  camaraQuer: quando('a Camara quer'),
  mudar: quando('mudar essa regra'),
  presidente: quando('presidente da Camara'),
  centrao: quando('partidos do Centrao'),
  pec: quando('uma PEC'),
  entao: quando('Entao vamos'),
  hoje: quando('Hoje o estado'),
  quemGanha: quando('E quem ganha'),
  partido: quando('primeiro e o partido'),
  soma: quando('soma todos'),
  divide: quando('divide pelas'),
  preco: quando('o preco de uma'),
  imagina: quando('Imagina'),
  mil100: quando('100 mil'),
  somou: quando('somou 300'),
  leva3: quando('leva 3'),
  os3: quando('os 3 candidatos'),
  repara: quando('Agora repara'),
  unico: quando('unico candidato'),
  fez300: quando('fez 300'),
  garante: quando('garante as 3'),
  levaJunto: quando('leva junto'),
  puxador: quando('o puxador'),
  correio: quando('Segundo o Correio'),
  nikolas: quando('Nikolas'),
  pavanato: quando('Lucas Pavanato'),
  erika: quando('Erika Hilton'),
  ajudaram: quando('ajudaram a eleger'),
  outros23: quando('outros 23'),
  plFez: quando('O PL fez'),
  n121: quando('121'),
  maior: quando('maior bancada'),
  encolheu: quando('Centrao encolheu'),
  distrital: quando('o voto distrital'),
  duasPartes: quando('duas partes'),
  primeira: quando('Primeira parte'),
  segunda: quando('Segunda parte'),
  segundoVoto: quando('segundo voto'),
  outraMetade: quando('A outra metade'),
  votosPartidos: quando('pelos votos dos partidos'),
  lista: quando('uma lista'),
  ordem: quando('a ordem ja'),
  federal: quando('para deputado federal'),
  estadual: quando('estadual'),
  vereador: quando('vereador'),
  votarPec: quando('votar a PEC'),
  transicao: quando('transicao'),
  n2034: quando('2034'),
  defende: quando('Quem defende'),
  barata: quando('mais barata'),
  perto: quando('mais perto'),
  contra: quando('Quem e contra'),
  cupula: quando('cupula'),
  virar: quando('Para virar'),
  n308: quando('308'),
  n49: quando('49'),
  texto: quando('o texto ainda'),
  prefere: quando('Voce prefere'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'VOCÊ VOTOU'],
  [T.presidente, 'A PROPOSTA'],
  [T.hoje, 'HOJE: UMA DISPUTA SÓ'],
  [T.quemGanha, 'HOJE: O PARTIDO PRIMEIRO'],
  [T.repara, 'O PUXADOR'],
  [T.correio, 'EM 2026'],
  [T.distrital, 'DISTRITAL MISTO'],
  [T.primeira, 'PARTE 1: O DISTRITO'],
  [T.segunda, 'PARTE 2: O PARTIDO'],
  [T.federal, 'QUANDO VALE'],
  [T.defende, 'OS DOIS LADOS'],
  [T.virar, 'O QUE FALTA'],
  [T.prefere, 'E VOCÊ?'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.hoje), ate: q(T.quemGanha), origem: 0};
const MAPA_B = {de: q(T.primeira), ate: q(T.segunda), origem: q(8.6)};
const noMapa = (t: number) => (t >= T.hoje && t < T.quemGanha) || (t >= T.primeira && t < T.segunda);

// ---------- Mapa do mundo ----------
const PLEN: V3 = [0, 0, -6];
const CONGRESSO: V3 = [0, 0, -21];
const URNA: V3 = [0.4, 0, 3];
const PROT: V3 = [-0.9, 0, 3.2];
const CAD: V3[] = [
  [-1.6, 0, 0.6],
  [0, 0, 0.6],
  [1.6, 0, 0.6],
];
const PILHA: V3 = [0, 0, 2.2];
const FATIAS: V3[] = [-2.4, -1.2, 0, 1.2, 2.4].map((x) => [x, 0, 2.2] as V3);
const FILA: V3[] = [0, 1, 2, 3, 4].map((i) => [-3.9 + i * 0.55, 0, 1.6] as V3);
const PUX: V3 = [2.9, 0, 2.2];
const COLEGAS: V3[] = [
  [4.1, 0, 2.6],
  [4.6, 0, 1.9],
];
const PUXADORES: V3[] = [
  [-1.8, 0, 2.4],
  [0, 0, 2.6],
  [1.8, 0, 2.4],
];
const BARRAS: V3 = [4.6, 0, -1.4];
const URNA_D: V3 = [-1.3, 0, 3];
const URNA_P: V3 = [1.3, 0, 3];
const LISTA: V3 = [3.3, 0, 1.2];
const BALANCA: V3 = [0, 0, 2.2];
const PEC: V3 = [2.2, 0, 2.6];

// ---------- Ajudantes ----------
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const andar = (t: number, a: number, b: number) => (t > a && t < b ? Math.sin((t - a) * 9) : 0);
const VOTANDO: Pose = {ombroD: [-0.9, 0, 0.07], cotoveloD: -0.4};
const assento = (c: V3): V3 => [c[0], 0, c[2] - 0.15];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const corA = F.azul;
  const corB = F.dourado;
  // Plenário: cada cena pinta as cadeiras de um jeito
  const corCadeira = (o: number): string => {
    const base = tema.objetoEscuro;
    if (t >= T.virar) {
      const k = rampa(t, T.n308 + (o / N_CADEIRAS) * 1.4, T.n308 + (o / N_CADEIRAS) * 1.4 + 0.25);
      return o < 308 ? mistura(base, tema.acento, k) : mistura(base, tema.objeto, 0.3 * k);
    }
    if (t >= T.outraMetade && t < T.federal + 0.5) {
      if (o % 2 === 1) return mistura(base, tema.objeto, 0.2);
      const meio = rampa(t, T.outraMetade, T.outraMetade + 0.8);
      const part = rampa(t, T.votosPartidos, T.votosPartidos + 0.9);
      const lado = (o / 2) % 5 < 3 ? corA : corB;
      return mistura(mistura(base, tema.acento, 0.6 * meio), lado, part);
    }
    if (t >= T.outros23 && t < T.distrital) {
      const k = rampa(t, T.outros23 + 0.6 + (o % 23) * 0.05, T.outros23 + 0.9 + (o % 23) * 0.05);
      return o > 240 && o <= 263 ? mistura(base, tema.pessoa, k) : base;
    }
    if (t < T.camaraQuer + 0.5) {
      return o === 300 ? mistura(base, tema.acento, rampa(t, T.eleitoOutro, T.eleitoOutro + 0.4)) : base;
    }
    return base;
  };
  const sobeCadeira = (o: number) => (t < T.camaraQuer + 0.5 && o === 300 ? pulso(t, T.eleitoOutro, 1.0) : 0);
  // Votos: o gancho
  const votoK = rampa(t, T.voceVotou + 0.1, T.voceVotou + 0.8);
  const votoSai = rampa(t, T.eleitoOutro - 0.2, T.eleitoOutro + 0.8);
  // Cena 3: a loja de cadeiras
  const lojaK = rampa(t, T.quemGanha, T.quemGanha + 0.6) * (1 - rampa(t, T.correio, T.correio + 0.6));
  const precoK = entra(t, T.mil100, 0.45);
  const pilhaTodos = 5 * rampa(t, T.soma, T.soma + 1.2) * 4; // 20 blocos (1 milhão de votos no exemplo, 5 fatias de 100 mil)
  const dividir = rampa(t, T.divide, T.divide + 0.9);
  const partidoK = rampa(t, T.somou, T.somou + 0.8);
  const vaiCadeira = rampa(t, T.leva3, T.leva3 + 1.0);
  const cadeiraAcesa = (i: number) => Math.max(rampa(t, T.leva3 + i * 0.25, T.leva3 + i * 0.25 + 0.3) * (1 - rampa(t, T.repara, T.repara + 0.4)), rampa(t, T.garante + i * 0.2, T.garante + i * 0.2 + 0.3) * (1 - rampa(t, T.correio, T.correio + 0.4)));
  const filaK = entra(t, T.partido, 0.5) * (1 - rampa(t, T.repara, T.repara + 0.5));
  const sobem = rampa(t, T.os3, T.os3 + 1.2);
  // Cena 4: o puxador
  const puxK = entra(t, T.unico, 0.5) * (1 - rampa(t, T.correio, T.correio + 0.5));
  const pilhaPux = 15 * rampa(t, T.fez300, T.fez300 + 0.9);
  const cordaK = rampa(t, T.levaJunto, T.levaJunto + 0.5);
  const puxa = rampa(t, T.levaJunto + 0.5, T.puxador + 0.4);
  // Cena 5
  const pxK = (a: number) => entra(t, a, 0.45) * (1 - rampa(t, T.distrital, T.distrital + 0.5));
  const filaPx = rampa(t, T.ajudaram, T.ajudaram + 0.6);
  const sobe23 = rampa(t, T.outros23, T.outros23 + 1.6);
  const barrasK = rampa(t, T.plFez - 0.2, T.plFez + 0.4) * (1 - rampa(t, T.distrital, T.distrital + 0.5));
  const plAlt = 3.0 * rampa(t, T.n121, T.n121 + 1.0, sai);
  const centraoAlt = 2.6 - 0.9 * rampa(t, T.encolheu, T.encolheu + 0.8);
  // Cena 6 e 7
  const placaDM = entra(t, T.distrital, 0.5) * (1 - rampa(t, T.primeira, T.primeira + 0.3));
  const urnasK = entra(t, T.segunda, 0.5) * (1 - rampa(t, T.federal, T.federal + 0.5)) + entra(t, T.prefere, 0.5);
  const listaK = entra(t, T.lista, 0.5) * (1 - rampa(t, T.federal, T.federal + 0.5));
  // Cena 8
  const placas = (a: number) => entra(t, a, 0.45) * (1 - rampa(t, T.defende, T.defende + 0.5));
  // Cena 9
  const balK = entra(t, T.defende, 0.5) * (1 - rampa(t, T.virar, T.virar + 0.5));
  const inclina = 0.35 * rampa(t, T.barata, T.perto + 0.5) - 0.7 * rampa(t, T.contra, T.contra + 0.8) + 0.35 * rampa(t, T.cupula, T.cupula + 0.7);
  // Cena 10
  const pecK = entra(t, T.pec, 0.5) * (1 - rampa(t, T.entao, T.entao + 0.5)) + entra(t, T.texto - 0.2, 0.5) * (1 - rampa(t, T.prefere - 0.3, T.prefere + 0.2));
  // Protagonista
  const protVis = t < T.presidente + 0.5 || (t >= T.segunda && t < T.federal + 0.4) || t >= T.prefere;
  let protPos: V3 = PROT;
  let protR = Math.PI / 2;
  if (t >= T.segunda && t < T.federal + 0.4) {
    protPos = lerp3([-2.2, 0, 3.6], [0, 0, 3.6], rampa(t, T.segundoVoto - 0.6, T.segundoVoto));
    protR = rampa(t, T.segundoVoto - 0.6, T.segundoVoto) > 0.95 ? 0.9 : Math.PI / 2;
  }
  if (t >= T.prefere) {
    protPos = [0, 0, 3.7];
    protR = Math.PI + 0.4 * Math.sin((t - T.prefere) * 1.5);
  }
  const protPose: Pose = t < T.numDeputado + 0.6 || Math.abs(t - T.segundoVoto) < 0.6 ? VOTANDO : {passo: andar(t, T.segundoVoto - 0.6, T.segundoVoto)};

  return (
    <group>
      {/* Fundo: plenário e Congresso, sempre */}
      <PlenarioCamara tema={tema} pos={PLEN} escala={1} cor={corCadeira} sobe={sobeCadeira} />
      <Congresso tema={tema} pos={CONGRESSO} escala={1.0} aceso={Math.max(janela(t, T.camaraQuer, T.entao, 0.5), janela(t, T.virar, T.prefere, 0.5))} />

      {/* Gancho: o voto entra na urna e acende OUTRO lugar no plenário */}
      {protVis ? <Boneco tema={tema} pos={protPos} rotY={protR} escala={0.85} cor={tema.corpo} pose={protPose} /> : null}
      <Urna tema={tema} pos={URNA} rotY={-0.3} escala={0.8 * (entra(t, 0, 0.3) * (1 - rampa(t, T.presidente, T.presidente + 0.5)))} />
      {votoK > 0.02 && votoSai < 0.98 ? (
        <group position={votoSai > 0 ? curva(soma(URNA, [0, 1.0, 0]), [-0.4, 2.0, -9.2], 3, votoSai) : lerp3(soma(PROT, [0.3, 1.3, 0]), soma(URNA, [0, 0.95, 0]), votoK)} rotation={[0.3, 0.4, 0]}>
          <Caixa args={[0.34, 0.02, 0.46]} raio={0.01} cor={tema.objetoClaro} emissivo={0.4 * votoSai} />
        </group>
      ) : null}

      {/* A PEC */}
      <FolhaCarimbo tema={tema} pos={PEC} rotY={-0.3} escala={1.2 * Math.min(1, pecK)} texto={['PEC', 'SISTEMA ELEITORAL']} carimbo={rampa(t, T.texto + 0.5, T.texto + 0.9)} textoCarimbo="AINDA NÃO APRESENTADA" corCarimbo={tema.objeto} />

      {/* Cena 3: a loja de cadeiras */}
      {lojaK > 0.02
        ? CAD.map((c, i) => (
            <group key={i}>
              <Cadeira tema={tema} pos={c} escala={0.9 * lojaK} aceso={cadeiraAcesa(i)} />
              <PlacaPreco tema={tema} pos={soma(c, [0.75, 0, 0.3])} escala={0.9 * precoK * lojaK} texto="100 MIL VOTOS" aceso={cadeiraAcesa(i)} />
            </group>
          ))
        : null}
      {lojaK > 0.02 && t < T.repara + 0.5
        ? dividir < 0.02
          ? <PilhaVotos tema={tema} pos={PILHA} blocos={pilhaTodos} escala={lojaK} />
          : FATIAS.map((p, i) => {
              const doA = i < 3 ? partidoK : 0;
              const destino = i < 3 ? soma(CAD[i], [0, 0, 0.9]) : p;
              const pos = lerp3(lerp3(PILHA, p, dividir), destino, i < 3 ? vaiCadeira : 0);
              return <PilhaVotos key={i} tema={tema} pos={pos} blocos={4} cor={mistura(tema.objetoClaro, corA, doA)} escala={0.8 * lojaK * (1 - rampa(t, T.repara, T.repara + 0.4))} brilho={doA} />;
            })
        : null}
      {filaK > 0.02
        ? FILA.map((p, i) => {
            const sobe = i < 3 ? sobem : 0;
            const pos = i < 3 ? lerp3(p, assento(CAD[i]), sobe) : p;
            return <Boneco key={i} tema={tema} pos={pos} rotY={sobe > 0.95 ? 0 : 0.2} escala={0.6 * filaK} cor={mistura(tema.pessoa, corA, 0.35)} pose={{passo: andar(t, T.os3, T.os3 + 1.2) * (i < 3 ? 1 : 0)}} />;
          })
        : null}

      {/* Cena 4: o puxador */}
      {puxK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={lerp3(PUX, assento(CAD[2]), puxa)} rotY={puxa > 0 ? -2.4 : -0.3} escala={0.95 * puxK} cor={mistura(tema.pessoa, corA, 0.35)} pose={{passo: andar(t, T.levaJunto + 0.5, T.puxador + 0.4), ombroE: [-0.6 * cordaK, 0, -0.3]}} />
          <PilhaVotos tema={tema} pos={soma(PUX, [-0.9, 0, 0.3])} blocos={pilhaPux} cor={corA} escala={0.7 * puxK * (1 - puxa)} />
          {COLEGAS.map((c, i) => (
            <Boneco key={i} tema={tema} pos={lerp3(c, assento(CAD[i]), puxa)} rotY={-2.0} escala={0.5 * puxK} cor={mistura(tema.pessoa, corA, 0.2)} pose={{passo: andar(t, T.levaJunto + 0.5, T.puxador + 0.4)}} />
          ))}
          {COLEGAS.map((c, i) => (
            <Corda key={i} tema={tema} de={soma(lerp3(PUX, assento(CAD[2]), puxa), [0.25, 1.2, 0])} ate={soma(lerp3(c, assento(CAD[i]), puxa), [0, 0.7, 0])} k={cordaK * (1 - rampa(t, T.correio - 0.3, T.correio))} />
          ))}
        </group>
      ) : null}

      {/* Cena 5: os três puxadores (bonecos genéricos com etiqueta) e os 23 */}
      {PUXADORES.map((p, i) => {
        const k = pxK([T.nikolas, T.pavanato, T.erika][i]);
        if (k < 0.02) return null;
        return <Boneco key={i} tema={tema} pos={p} rotY={0} escala={0.9 * k} cor={tema.pessoa} pose={{ombroE: [-0.6 * filaPx, 0, -0.2]}} />;
      })}
      {filaPx > 0.02 && t < T.distrital + 0.5
        ? Array.from({length: 23}).map((_, i) => {
            const linha: V3 = [-3.2 + (i % 12) * 0.58, 0, 3.6 + Math.floor(i / 12) * 0.5];
            const a = T.outros23 + i * 0.05;
            const k = rampa(t, a, a + 1.0);
            const alvo: V3 = [-1.5 + (i % 8) * 0.4, 0.6, -8 - Math.floor(i / 8) * 0.4];
            if (k > 0.99) return null;
            return <Boneco key={i} tema={tema} pos={curva(linha, alvo, 1.2, k)} rotY={Math.PI} escala={0.38 * filaPx * (1 - k * 0.4)} cor={tema.pessoa} pose={{passo: Math.sin((t - a) * 9)}} />;
          })
        : null}
      {barrasK > 0.02 ? (
        <group position={BARRAS}>
          <Caixa args={[0.7, Math.max(0.02, plAlt), 0.7]} raio={0.04} cor={tema.objeto} position={[-0.6, Math.max(0.02, plAlt) / 2, 0]} scale={[barrasK, 1, barrasK]} />
          <Caixa args={[0.7, centraoAlt, 0.7]} raio={0.04} cor={mistura(tema.objeto, tema.objetoEscuro, 0.4)} position={[0.6, centraoAlt / 2, 0]} scale={[barrasK, barrasK, barrasK]} />
        </group>
      ) : null}

      {/* Cena 6: a placa da proposta */}
      <PlacaChao tema={tema} pos={[0, 0, 2.4]} escala={1.6 * placaDM} texto="DISTRITAL MISTO" aceso={1} />

      {/* Cena 7: as duas urnas e a lista */}
      {urnasK > 0.02 ? (
        <group>
          <Urna tema={tema} pos={URNA_D} rotY={0.2} escala={0.75 * Math.min(1, urnasK)} />
          <Urna tema={tema} pos={URNA_P} rotY={-0.2} escala={0.75 * Math.min(1, urnasK)} />
          {[
            {p: URNA_D, txt: 'DISTRITO'},
            {p: URNA_P, txt: 'PARTIDO'},
          ].map(({p, txt}) => (
            <group key={txt} position={soma(p, [0, 1.15, 0.2])} scale={Math.min(1, urnasK)}>
              <Caixa args={[1.1, 0.3, 0.05]} raio={0.03} cor={tema.acento} emissivo={0.3} />
              <Placa tema={tema} pos={[0, 0, 0.03]} larg={1.0} alt={0.22} linhas={[{t: txt, tam: 190, cor: tema.fundo, peso: 900}]} brilho={0.3} />
            </group>
          ))}
        </group>
      ) : null}
      <ListaLei tema={tema} pos={LISTA} escala={0.9 * listaK} titulo="LISTA DO PARTIDO" itens={['1º DA LISTA', '2º DA LISTA', '3º DA LISTA', '4º DA LISTA']} acesos={[0, 1, 2, 3].map((i) => rampa(t, T.lista + 0.2 + i * 0.2, T.lista + 0.5 + i * 0.2))} destaque={[0, 1]} />
      <group position={soma(LISTA, [0.78, 2.05, 0.15])} scale={0.9 * listaK}>
        <Cadeado tema={tema} pos={[0, 0, 0]} k={entra(t, T.ordem - 0.1, 0.4)} fecha={rampa(t, T.ordem + 0.2, T.ordem + 0.5)} />
      </group>

      {/* Cena 8: onde vale e quando */}
      {[
        {txt: 'FEDERAL', a: T.federal, x: -2.4},
        {txt: 'ESTADUAL', a: T.estadual, x: 0},
        {txt: 'VEREADOR', a: T.vereador, x: 2.4},
      ].map((p) => (
        <PlacaChao key={p.txt} tema={tema} pos={[p.x, 0, 2.2]} escala={1.1 * placas(p.a) * (1 - rampa(t, T.votarPec, T.votarPec + 0.4))} texto={p.txt} aceso={0} />
      ))}
      {[
        {txt: '2026', a: T.votarPec, x: -2.4, verde: 0},
        {txt: '2030', a: T.transicao, x: 0, verde: 0},
        {txt: '2034', a: T.n2034, x: 2.4, verde: 1},
      ].map((p) => (
        <PlacaChao key={p.txt} tema={tema} pos={[p.x, 0, 3.4]} escala={1.1 * placas(p.a)} texto={p.txt} aceso={p.verde * rampa(t, p.a, p.a + 0.5)} />
      ))}

      {/* Cena 9: a balança no meio */}
      <Balanca tema={tema} pos={BALANCA} escala={0.65 * balK} inclina={inclina} brilhoEsq={0.3 * janela(t, T.barata, T.contra, 0.4)} brilhoDir={0.3 * janela(t, T.contra, T.virar, 0.4)} />

      {/* Fim: o balão de comentário */}
      <IconeBalao pos={[0.9, 2.4, 3.7]} cor={tema.acento} escala={1.0 * entra(t, T.comentarios, 0.45)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1.2, 1.8], 6, 4.2, [0.15, 0.55, 1])], [T.eleitoOutro, E([0, 1, -3], 12, 7, [0.05, 0.6, 1])], [T.presidente - 0.3, E([0, 1.5, -6], 16, 9, [0, 0.45, 1])]]},
  {ini: T.presidente - 0.2, chaves: [[T.presidente - 0.2, E([0, 2.2, -9], 16, 10, [0, 0.35, 1])], [T.pec, E([1.4, 1.2, 0], 8, 5, [0, 0.3, 1])], [T.hoje - 0.3, E([1.4, 1.2, 0], 7.6, 4.8, [0.05, 0.3, 1])]]},
  {
    ini: T.quemGanha - 0.1,
    arco: 0.05,
    chaves: [
      [T.quemGanha - 0.1, E([0, 1.0, 1.4], 7.4, 4.2, [0, 0.4, 1])],
      [T.preco, E([0, 1.0, 1.2], 6.4, 3.8, [0, 0.35, 1])],
      [T.somou, E([-0.4, 1.0, 1.4], 7.8, 4.2, [0, 0.38, 1])],
      [T.os3, E([-1.2, 1.0, 1.0], 6.6, 4.0, [0, 0.35, 1])],
      [T.repara - 0.3, E([-0.8, 1.0, 1.0], 6.8, 4.0, [0.05, 0.35, 1])],
    ],
  },
  {ini: T.repara - 0.1, chaves: [[T.repara - 0.1, E([2.0, 1.1, 1.8], 5.6, 3.8, [0.1, 0.32, 1])], [T.levaJunto, E([2.2, 1.0, 1.6], 5.4, 3.6, [0.12, 0.32, 1])], [T.correio - 0.3, E([1.2, 1.0, 1.2], 6.6, 4.0, [0.05, 0.32, 1])]]},
  {
    ini: T.correio - 0.1,
    chaves: [
      [T.correio - 0.1, E([0, 1.2, 2.4], 6.4, 4.2, [0, 0.3, 1])],
      [T.outros23 + 0.3, E([0, 1.2, -2], 11, 7, [0, 0.45, 1])],
      [T.plFez + 0.2, E([3.6, 1.6, -0.6], 6, 4.6, [0.1, 0.32, 1])],
      [T.distrital - 0.3, E([3.6, 1.6, -0.6], 5.8, 4.4, [0.12, 0.32, 1])],
    ],
  },
  {ini: T.distrital - 0.1, chaves: [[T.distrital - 0.1, E([0, 1.4, 2.4], 5.4, 3.8, [0, 0.3, 1])], [T.primeira, E([0, 1.4, 2.4], 5.0, 3.6, [0, 0.3, 1])]]},
  {
    ini: T.segunda - 0.1,
    chaves: [
      [T.segunda - 0.1, E([0, 1.0, 3.0], 5.6, 3.6, [0, 0.3, 1])],
      [T.outraMetade, E([0, 1.0, -5], 13, 7, [0, 0.55, 1])],
      [T.lista - 0.2, E([2.2, 1.5, 1.2], 6, 4.4, [0.1, 0.3, 1])],
      [T.federal - 0.3, E([2.4, 1.7, 1.2], 5.4, 4.2, [0.12, 0.3, 1])],
    ],
  },
  {ini: T.federal - 0.1, arco: 0.05, chaves: [[T.federal - 0.1, E([0, 1.0, 2.4], 7.6, 3.8, [0, 0.35, 1])], [T.votarPec, E([0, 1.0, 3.2], 7.6, 3.8, [0, 0.35, 1])], [T.defende - 0.3, E([0.6, 1.0, 3.2], 7.2, 3.6, [0.05, 0.35, 1])]]},
  {ini: T.defende - 0.1, chaves: [[T.defende - 0.1, E([0, 1.7, 2.2], 4.8, 3.6, [0, 0.25, 1])], [T.virar - 0.3, E([0, 1.7, 2.2], 4.6, 3.4, [0.06, 0.25, 1])]]},
  {ini: T.virar - 0.1, chaves: [[T.virar - 0.1, E([0, 0.4, -6], 13, 8, [0, 0.95, 1])], [T.texto, E([1.6, 1.0, 1.8], 5.4, 4.0, [0, 0.3, 1])], [T.prefere - 0.3, E([1.6, 1.0, 1.8], 5.2, 3.8, [0.05, 0.3, 1])]]},
  {ini: T.prefere - 0.1, chaves: [[T.prefere - 0.1, E([0, 1.1, 3.2], 5.4, 3.6, [0, 0.28, 1])], [T.segue, E([0, 1.2, 1], 9, 6, [0, 0.4, 1])], [FIM, E([0, 1, -5], 18, 11, [0, 0.6, 1])]]},
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
type Txt = {a: number; b: number; texto: string; destaque?: boolean; y?: number};
const CHIPS: Txt[] = [
  {a: T.numDeputado, b: T.eleitoOutro, texto: 'SEU VOTO: CANDIDATO X'},
  {a: T.eleitoOutro, b: T.mudar, texto: 'ELEGEU OUTRO', destaque: true},
  {a: T.mudar, b: T.presidente, texto: 'VAI MUDAR?'},
  {a: T.entao, b: T.hoje, texto: 'HOJE × COMO QUEREM'},
  {a: T.partido, b: T.soma, texto: 'A VAGA É DO PARTIDO'},
  {a: T.preco, b: T.mil100, texto: 'VOTOS ÷ VAGAS = PREÇO DA CADEIRA'},
  {a: T.os3, b: T.repara, texto: 'ENTRAM OS 3 MAIS VOTADOS DO PARTIDO'},
  {a: T.levaJunto, b: T.puxador, texto: 'LEVA 2 COLEGAS COM POUCOS VOTOS'},
  {a: T.puxador, b: T.correio, texto: 'PUXADOR DE VOTOS', destaque: true},
  {a: T.outros23, b: T.plFez, texto: '+ 23 DEPUTADOS'},
  {a: T.maior, b: T.encolheu, texto: 'MAIOR BANCADA DESDE 1988'},
  {a: T.encolheu, b: T.distrital, texto: 'O CENTRÃO ENCOLHEU'},
  {a: T.distrital, b: T.duasPartes, texto: 'VOTO DISTRITAL MISTO', destaque: true},
  {a: T.duasPartes, b: T.primeira, texto: 'PARTE 1: DISTRITO · PARTE 2: PARTIDO'},
  {a: T.segundoVoto, b: T.outraMetade, texto: '2º VOTO: NO PARTIDO', destaque: true},
  {a: T.outraMetade, b: T.lista, texto: 'A OUTRA METADE: PELOS VOTOS DOS PARTIDOS'},
  {a: T.ordem, b: T.federal, texto: 'A ORDEM DA LISTA É DEFINIDA ANTES'},
  {a: T.votarPec, b: T.transicao, texto: '2026: VOTAR A PEC'},
  {a: T.transicao, b: T.n2034, texto: '2030: TRANSIÇÃO'},
  {a: T.n2034, b: T.defende, texto: '2034: DISTRITAL MISTO', destaque: true},
  {a: T.barata, b: T.contra, texto: 'A FAVOR: MAIS BARATA E MAIS PERTO'},
  {a: T.contra, b: T.virar, texto: 'CONTRA: PODER DA CÚPULA DOS PARTIDOS'},
  {a: T.texto, b: T.prefere, texto: 'O TEXTO AINDA NÃO FOI APRESENTADO'},
  {a: T.prefere, b: T.segue, texto: 'DISTRITO OU PARTIDO?', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.pec, b: T.entao, texto: 'CONGRESSO EM FOCO E METRÓPOLES · 28 E 31/10/2026'},
  {a: T.hoje + 2.5, b: T.quemGanha, texto: 'BAHIA · 39 DEPUTADOS FEDERAIS', y: 470},
  {a: T.imagina, b: T.repara, texto: 'EXEMPLO COM NÚMEROS REDONDOS · REGRA DO TSE'},
  {a: T.correio, b: T.plFez, texto: 'SEGUNDO O CORREIO BRAZILIENSE · 02/11/2026'},
  {a: T.plFez, b: T.distrital, texto: 'RESULTADO DAS ELEIÇÕES DE 2026'},
  {a: T.primeira + 9.4, b: T.segunda, texto: 'CONTA: METADE DE 39 ≈ 20', y: 470},
  {a: T.n308, b: T.texto, texto: 'CONSTITUIÇÃO · ART. 60 · DOIS TURNOS', y: 470},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '14px 30px 18px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 96, fontWeight: 900, letterSpacing: -4, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean; dy?: number};
const ROTULOS: Rot[] = [
  {a: T.voceVotou, b: T.presidente, p: soma(PROT, [0, 1.75, 0]), texto: 'VOCÊ', acento: true},
  {a: T.presidente, b: T.pec, p: soma(CONGRESSO, [0, 3.0, 0]), texto: 'PRESIDENTE DA CÂMARA · HUGO MOTTA'},
  {a: T.centrao, b: T.entao, p: soma(PLEN, [0, 1.4, -2]), texto: 'PARTIDOS DO CENTRÃO'},
  {a: T.somou, b: T.repara, p: soma(FATIAS[1], [0, 1.0, 0]), texto: 'PARTIDO A · 300 MIL', acento: true, dy: 20},
  {a: T.unico, b: T.correio, p: soma(PUX, [0, 2.0, 0]), texto: 'CANDIDATO COM 300 MIL VOTOS'},
  {a: T.levaJunto + 0.3, b: T.correio, p: soma(COLEGAS[0], [0, 1.1, 0]), texto: 'POUCOS VOTOS', dy: -10},
  {a: T.nikolas, b: T.distrital, p: soma(PUXADORES[0], [0, 1.9, 0]), texto: 'NIKOLAS FERREIRA'},
  {a: T.pavanato, b: T.distrital, p: soma(PUXADORES[1], [0, 1.9, 0]), texto: 'LUCAS PAVANATO', dy: 60},
  {a: T.erika, b: T.distrital, p: soma(PUXADORES[2], [0, 1.9, 0]), texto: 'ERIKA HILTON'},
  {a: T.maior, b: T.distrital, p: soma(BARRAS, [-0.6, 3.4, 0]), texto: 'PL · 121', acento: true},
  {a: T.encolheu, b: T.distrital, p: soma(BARRAS, [0.6, 2.2, 0]), texto: 'CENTRÃO', dy: -40},
  {a: T.outraMetade + 0.6, b: T.lista, p: soma(PLEN, [-2.5, 1.2, -2]), texto: 'PARTIDO A'},
  {a: T.outraMetade + 0.8, b: T.lista, p: soma(PLEN, [2.5, 1.2, -2]), texto: 'PARTIDO B'},
  {a: T.barata, b: T.virar, p: soma(BALANCA, [-1.3, 1.4, 0]), texto: 'A FAVOR', dy: 80},
  {a: T.contra, b: T.virar, p: soma(BALANCA, [1.3, 1.4, 0]), texto: 'CONTRA', dy: 80},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  if (noMapa(t)) {
    // Em cima do mapa só a pílula, a marca e a legenda (o mapa já traz os textos dele)
    const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
    return selo ? (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: selo.y ?? 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
        <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
      </div>
    ) : null;
  }
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  const k300 = entra(t, T.somou, 0.45) * (1 - rampa(t, T.leva3 - 0.3, T.leva3));
  const k3 = entra(t, T.leva3, 0.45) * (1 - rampa(t, T.os3 - 0.3, T.os3));
  const k100 = entra(t, T.mil100, 0.45) * (1 - rampa(t, T.somou - 0.3, T.somou));
  const k121 = entra(t, T.n121, 0.45) * (1 - rampa(t, T.maior - 0.3, T.maior));
  const k308 = entra(t, T.n308, 0.45) * (1 - rampa(t, T.texto - 0.3, T.texto));
  const n308 = Math.round(308 * rampa(t, T.n308, T.n308 + 1.4));
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 170, Math.min(SEGURO.botoesX - 170, x)), top: Math.max(600, Math.min(1180, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 27, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 380 && Math.abs(visRot[a].y - visRot[b].y) < 58) visRot[a].y = visRot[b].y - 62;
  return (
    <>
      {[
        {k: k100, valor: '100 MIL', rotulo: 'VOTOS = 1 CADEIRA (EXEMPLO)'},
        {k: k300, valor: '300 MIL', rotulo: 'VOTOS DO PARTIDO A', cor: tema.acento},
        {k: k3, valor: '3 CADEIRAS', rotulo: '300 MIL ÷ 100 MIL', cor: tema.acento},
        {k: k121, valor: '121', rotulo: 'DEPUTADOS DO PL'},
        {k: k308, valor: `${n308} DE 513`, rotulo: 'NA CÂMARA · E 49 DE 81 NO SENADO', cor: tema.acento},
      ].map((n, i) => (
        <div key={i} style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: i === 4 ? 1090 : 560, display: 'flex', justifyContent: 'center'}}>
          <Numero tema={tema} valor={n.valor} rotulo={n.rotulo} k={n.k} cor={n.cor} />
        </div>
      ))}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 32 ? 23 : chip.texto.length > 24 ? 27 : 32} />
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {selo ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: selo.y ? W - SEGURO.dir : W - SEGURO.botoesX, top: selo.y ?? 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(selo, t))}}>
          <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: selo.texto.length > 40 ? 16 : 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{selo.texto}</div>
        </div>
      ) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>DISTRITO OU PARTIDO?</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8}}>PARA MAIS INFORMAÇÕES</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number}> = ({de, ate, origem}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/bahia.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  [T.hoje, T.quemGanha, T.primeira, T.segunda].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.3}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.16}));
  s.push({t: T.voceVotou + 0.7, f: 'pop', v: 0.24});
  s.push({t: T.eleitoOutro + 0.5, f: 'ding', v: 0.24});
  s.push({t: T.pec, f: 'pop', v: 0.22});
  for (let i = 0; i < 6; i++) s.push({t: T.soma + i * 0.18, f: 'pop', v: 0.08});
  s.push({t: T.mil100, f: 'pop', v: 0.24});
  s.push({t: T.somou, f: 'subida', v: 0.24});
  [0, 1, 2].forEach((i) => s.push({t: T.leva3 + i * 0.25, f: 'pop', v: 0.2}));
  s.push({t: T.fez300, f: 'subida', v: 0.22});
  s.push({t: T.levaJunto + 0.5, f: 'baque', v: 0.24});
  s.push({t: T.puxador, f: 'ding', v: 0.22});
  [T.nikolas, T.pavanato, T.erika].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.n121, f: 'subida', v: 0.24});
  s.push({t: T.distrital, f: 'ding', v: 0.24});
  s.push({t: T.primeira + 6.0, f: 'ding', v: 0.22});
  s.push({t: T.segundoVoto, f: 'pop', v: 0.24});
  s.push({t: T.ordem + 0.3, f: 'tique', v: 0.26});
  [T.federal, T.estadual, T.vereador, T.votarPec, T.transicao].forEach((t) => s.push({t, f: 'pop', v: 0.18}));
  s.push({t: T.n2034, f: 'ding', v: 0.24});
  s.push({t: T.n308, f: 'subida', v: 0.26});
  s.push({t: T.texto + 0.6, f: 'impacto', v: 0.24});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.6, T.eleitoOutro + 0.6, T.presidente + 0.8, T.pec + 0.6, T.hoje + 1.5, T.hoje + 4.5, T.hoje + 7.8, T.quemGanha + 0.8, T.soma + 0.8, T.divide + 0.8, T.mil100 + 0.4,
  T.somou + 0.6, T.leva3 + 0.8, T.os3 + 1.3, T.unico + 0.6, T.levaJunto + 1.0, T.puxador + 0.4, T.nikolas + 0.5, T.erika + 0.5, T.outros23 + 0.8, T.n121 + 0.8,
  T.encolheu + 0.6, T.distrital + 0.6, T.primeira + 2.5, T.primeira + 5.0, T.primeira + 7.0, T.primeira + 12.6, T.segundoVoto + 0.5, T.outraMetade + 0.6, T.votosPartidos + 0.8,
  T.ordem + 0.6, T.vereador + 0.4, T.n2034 + 0.5, T.barata + 0.5, T.cupula + 0.5, T.n308 + 1.0, T.texto + 0.8, T.prefere + 0.8, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const DistritalMisto: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={20} centro={[0, 0, -3]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  const mapas = (
    <>
      <Sequence from={MAPA_A.de} durationInFrames={MAPA_A.ate - MAPA_A.de} layout="none">
        <TrechoMapa {...MAPA_A} />
      </Sequence>
      <Sequence from={MAPA_B.de} durationInFrames={MAPA_B.ate - MAPA_B.de} layout="none">
        <TrechoMapa {...MAPA_B} />
      </Sequence>
    </>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapas}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapas}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Voto distrital misto" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Seu voto', 'vai mudar?', 'Vem aí o', 'distrital.'];
export const CapaDistritalMisto: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · VOTO DISTRITAL MISTO`} t={1} troca={0} y={SEGURO.topo + 160} />
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
