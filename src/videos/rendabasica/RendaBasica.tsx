import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {ArvoreRedonda, BalancaJustica, CalendarioGrande, DocumentoGrande, LivroLei, Lojinha, MarcoAno, Martelo, PilhaMoedas, PredioColunas, Robo} from '../../pecas';
import {Fabrica} from '../../pecas/oitohoras';
import {SeloArroba} from '../comum/SeloArroba';
import {PALAVRAS} from './palavras';

// 152. renda básica universal (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL de notícia, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/152.../mapas/renda.mp4, composição RendaBasica do kit: Maricá e o mundo).
// Neutro: a favor e contra com o mesmo espaço; a conta dos R$ 256 bi é marcada como conta própria.
// Pessoas só como bonecos genéricos com etiqueta, sem rosto. Fontes: projetos/152.../audio/fontes.md.

export const FPS = 30;
const AUDIO_SEG = 142.68;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '152. renda básica universal';
const FIM = AUDIO_SEG + 0.9;

const quando = criarQuando(PALAVRAS);
const T = {
  receber: quando('Receber dinheiro'),
  sem: quando('Sem provar'),
  nome: quando('Isso tem nome'),
  renda: quando('renda básica universal', 1),
  brasil: quando('E o Brasil tem'),
  vem: quando('Vem comigo'),
  primeiro: quando('Primeiro, o que'),
  universal: quando('Universal: vale'),
  incond: quando('Incondicional'),
  dinheiro: quando('Em dinheiro, todo'),
  diferente: quando('É diferente'),
  jan04: quando('Janeiro de 2004'),
  lei: quando('A Lei'),
  suplicy: quando('uma ideia do'),
  criou: quando('criou a renda'),
  mas: quando('Mas a lei'),
  etapas: quando('por etapas'),
  governo: quando('quando o governo'),
  papel: quando('E até hoje'),
  stf21: quando('Em 2021'),
  morador: quando('caso de um morador'),
  mandou: quando('O Supremo mandou'),
  bf: quando('E a lei do Bolsa'),
  etapa: quando('é uma etapa'),
  outubro: quando('Em outubro, o piso'),
  milhoes19: quando('para cerca de 19'),
  marica: quando('Agora, Maricá'),
  mumbuca: quando('A mumbuca é'),
  comercio: quando('só vale no'),
  repara: quando('Mas repara'),
  tres: quando('até três salários'),
  naoUniv: quando('Então ainda'),
  mundo: quando('E no mundo'),
  voltou: quando('E por que o assunto'),
  ia: quando('Por causa da inteligência'),
  maquinas: quando('Se máquinas'),
  lados: quando('Os dois lados'),
  defende: quando('Quem defende'),
  burocracia: quando('menos burocracia'),
  ninguemFora: quando('ninguém fica de fora'),
  liberdade: quando('mais liberdade'),
  critica: quando('Quem critica'),
  conta: quando('Fiz a conta'),
  bilhoes: quando('dá cerca de'),
  inflacao: quando('Os críticos também'),
  testes: quando('E os testes'),
  ninguemSabe: quando('Ninguém sabe'),
  fato: quando('O fato é'),
  existe: quando('Existe uma lei'),
  decisao: quando('uma decisão do'),
  programas: quando('e programas para'),
  voce: quando('E você, seria'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'RENDA BÁSICA UNIVERSAL'],
  [T.primeiro, 'O QUE É'],
  [T.jan04, 'A LEI DE 2004'],
  [T.stf21, 'O SUPREMO'],
  [T.bf, 'BOLSA FAMÍLIA'],
  [T.marica, 'MARICÁ'],
  [T.mundo, 'TESTES PELO MUNDO'],
  [T.voltou, 'POR QUE VOLTOU'],
  [T.lados, 'OS DOIS LADOS'],
  [T.fato, 'O FATO'],
];

// ---------- Os trechos de mapa (Kit Mapas): mesmos tempos do roteiro.ts do kit ----------
const q = (s: number) => Math.round(s * FPS);
const TR: [number, number][] = [
  [57.52, 62.08],
  [70.22, 101.0],
];
const MAPAS = TR.map(([a, b], i) => ({de: q(a), ate: q(b), origem: TR.slice(0, i).reduce((s, [x, y]) => s + q(y) - q(x), 0)}));
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

// ---------- Mapa do mundo ----------
const PRACA: V3 = [0, 0, 0];
const OQUE: V3 = [12, 0, 0];
const LEI: V3 = [24, 0, 0];
const STF: V3 = [36, 0, 0];
const BF: V3 = [48, 0, 0];
const MAR: V3 = [60, 0, 0];
const IA: V3 = [72, 0, 0];
const LADOS: V3 = [84, 0, 0];

const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

// fila de bonecos, cada um com a sua pilhinha de moedas na frente
const Fila: React.FC<{tema: Tema; pos: V3; n: number; k: number; t: number; moedas: (i: number) => number; cores: string[]; dourado: string; abre?: number}> = ({tema, pos, n, k, t, moedas, cores, dourado, abre = 0.7}) =>
  k < 0.02 ? null : (
    <group position={pos}>
      {Array.from({length: n}, (_, i) => {
        const x = (i - (n - 1) / 2) * abre;
        const m = moedas(i);
        return (
          <group key={i}>
            <Boneco tema={tema} pos={[x, 0, 0]} rotY={0.06 * ((i % 3) - 1)} escala={0.55 * k} cor={cores[i % cores.length]} pose={{passo: 0.12 * Math.sin(t * 2 + i)}} />
            {m > 0.02 ? <PilhaMoedas tema={tema} pos={[x, 0.02, 0.45]} n={Math.max(1, Math.round(3 * m))} cor={dourado} r={0.13} escala={k * Math.min(1, m * 1.5)} /> : null}
          </group>
        );
      })}
    </group>
  );

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];

  // ----- Cena 1: a praça, todo mundo recebe (abertura e fecho) -----
  const pracaK = entra(t, 0, 0.6) * (1 - rampa(t, T.primeiro - 0.3, T.primeiro)) + entra(t, T.fato - 0.3, 0.6);
  const abertura = t < T.primeiro + 0.2;
  const chuva = rampa(t, T.receber + 0.2, T.nome);
  const livroK = abertura ? entra(t, T.brasil - 0.2, 0.5) : 0;

  // ----- Cena 2: o que é -----
  const oqK = vis(t, T.primeiro - 0.3, T.jan04);
  const difK = rampa(t, T.diferente - 0.2, T.diferente + 0.6);

  // ----- Cena 3: a lei de 2004 -----
  const leiK = vis(t, T.jan04 - 0.3, T.stf21);
  const degraus = rampa(t, T.etapas - 0.3, T.governo);
  const papel = rampa(t, T.papel - 0.2, T.papel + 0.8);

  // ----- Cena 4: o Supremo -----
  const stfK = vis(t, T.stf21 - 0.3, T.bf);
  const bate = rampa(t, T.mandou + 0.2, T.mandou + 0.5) * (1 - rampa(t, T.mandou + 0.7, T.mandou + 1.1));

  // ----- Cena 5: Bolsa Família -----
  const bfK = vis(t, T.bf - 0.3, T.marica);
  const sobe = rampa(t, T.outubro + 0.4, T.outubro + 2.2);

  // ----- Cena 6: Maricá (depois do mapa) -----
  const marK = vis(t, T.mumbuca - 0.3, T.mundo);
  const corte = rampa(t, T.tres - 0.2, T.tres + 0.6);

  // ----- Cena 7: inteligência artificial -----
  const iaK = vis(t, T.voltou - 0.3, T.lados);

  // ----- Cena 8: os dois lados -----
  const ladK = vis(t, T.lados - 0.3, T.fato);
  const defK = entra(t, T.defende - 0.2, 0.5);
  const criK = entra(t, T.critica - 0.2, 0.5);
  const contaK = rampa(t, T.conta, T.bilhoes + 0.8);

  // ----- Cena 9: o fato -----
  const fatoK = entra(t, T.fato - 0.3, 0.6);

  return (
    <group>
      <Caixa args={[100, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[42, 0.02, 3.8]} sombra={false} />

      {/* Cena 1 e 9: a praça */}
      {pracaK > 0.02 ? (
        <group>
          <Caixa args={[12, 0.04, 5.2]} raio={0.02} cor={mistura(festa.loiro, tema.chao, 0.6)} position={soma(PRACA, [0, 0.02, -0.6])} sombra={false} />
          {[-5.0, -3.6, 3.6, 5.0].map((x, i) => (
            <ArvoreRedonda key={i} tema={tema} pos={soma(PRACA, [x, 0, -2.6 - 0.3 * (i % 2)])} r={0.5} cresce={Math.min(1, pracaK)} />
          ))}
          <Fila tema={tema} pos={soma(PRACA, [0, 0, 0.6])} n={7} k={Math.min(1, pracaK)} t={t} moedas={() => (abertura ? chuva : 0)} cores={cores} dourado={dourado} />
          {abertura ? <LivroLei tema={tema} pos={soma(PRACA, [0, 0.02, -1.6])} escala={1.1 * livroK} abre={rampa(t, T.brasil, T.brasil + 0.8)} /> : null}
          {t > T.fato - 0.5 ? (
            ['LEI', 'DECISÃO DO STF', 'PROGRAMAS'].map((n, i) => (
              <MarcoAno key={n} tema={tema} pos={soma(PRACA, [-2.6 + 2.6 * i, 0, -1.8])} ano={n} k={fatoK * entra(t, [T.existe, T.decisao, T.programas][i] - 0.2, 0.4)} aceso={pulso(t, [T.existe, T.decisao, T.programas][i], 1.2)} />
            ))
          ) : null}
        </group>
      ) : null}

      {/* Cena 2: o que é */}
      {oqK > 0.02 ? (
        <group>
          <Fila tema={tema} pos={soma(OQUE, [0, 0, 1.0])} n={6} k={oqK} t={t} moedas={(i) => (difK > 0 ? (i < 2 ? 1 : 1 - difK) : rampa(t, T.dinheiro, T.dinheiro + 0.8))} cores={cores} dourado={dourado} abre={0.8} />
        </group>
      ) : null}

      {/* Cena 3: a lei de 2004 */}
      {leiK > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(LEI, [-2.4, 0, -1.4])} texto="2004" sub="LEI 10.835" folha={leiK} escala={0.7 * leiK} destaque={pulso(t, T.jan04, 1.0)} />
          <LivroLei tema={tema} pos={soma(LEI, [0, 0.02, 0.4])} escala={1.0 * leiK * entra(t, T.lei - 0.2, 0.4)} abre={rampa(t, T.lei, T.lei + 0.8) * (1 - papel)} />
          <Boneco tema={tema} pos={soma(LEI, [-1.4, 0, 1.0])} rotY={0.4} escala={0.65 * leiK * entra(t, T.suplicy - 0.2, 0.4)} cor={tema.pessoa} />
          {[0, 1, 2, 3].map((i) => (
            <Caixa key={i} args={[0.7, 0.3 * (i + 1) * degraus, 0.8]} raio={0.04} cor={mistura(tema.objeto, tema.acento, i === 0 ? 0.6 : 0.1)} position={soma(LEI, [1.6 + 0.72 * i, 0.15 * (i + 1) * degraus, -1.2])} scale={[leiK, leiK, leiK]} />
          ))}
          <DocumentoGrande tema={tema} pos={soma(LEI, [2.4, 0.05, 1.0])} rot={[-1.3, -0.3, 0]} escala={0.7 * leiK * papel} />
        </group>
      ) : null}

      {/* Cena 4: o Supremo */}
      {stfK > 0.02 ? (
        <group>
          <PredioColunas tema={tema} pos={soma(STF, [0, 0, -2.2])} aceso={0.4 + 0.6 * pulso(t, T.mandou, 1.4)} escala={0.75 * stfK} />
          <Boneco tema={tema} pos={soma(STF, [-1.6, 0, 1.0])} rotY={0.5} escala={0.65 * stfK * entra(t, T.morador - 0.2, 0.4)} cor={mistura(tema.pessoa, tema.objetoEscuro, 0.3)} pose={{ombroD: [-0.3, 0, 0.2]}} />
          <Caixa args={[1.0, 0.08, 0.6]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} position={soma(STF, [-1.6, 0.04, 1.6])} scale={[stfK, stfK, stfK]} sombra={false} />
          <Martelo tema={tema} pos={soma(STF, [1.6, 0, 0.6])} escala={0.8 * stfK * entra(t, T.mandou - 0.2, 0.4)} bate={bate} rotY={-0.4} />
        </group>
      ) : null}

      {/* Cena 5: Bolsa Família */}
      {bfK > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(BF, [-2.2, 0, -0.8])} texto="2023" sub="LEI 14.601" folha={bfK} escala={0.7 * bfK} destaque={pulso(t, T.etapa, 1.0)} />
          <PilhaMoedas tema={tema} pos={soma(BF, [0.4, 0.02, 0.4])} n={6} cor={mistura(dourado, tema.objeto, 0.4)} r={0.3} escala={bfK * entra(t, T.outubro, 0.4)} />
          <PilhaMoedas tema={tema} pos={soma(BF, [1.8, 0.02, 0.4])} n={6 + Math.round(1 * sobe)} cor={dourado} r={0.3} escala={bfK * entra(t, T.outubro + 0.4, 0.4)} brilho={pulso(t, T.outubro + 2.0, 1.0)} />
          <Fila tema={tema} pos={soma(BF, [0.8, 0, 2.0])} n={5} k={bfK * entra(t, T.milhoes19 - 0.2, 0.5)} t={t} moedas={() => 0} cores={cores} dourado={dourado} />
        </group>
      ) : null}

      {/* Cena 6: Maricá */}
      {marK > 0.02 ? (
        <group>
          <Lojinha tema={tema} pos={soma(MAR, [-2.0, 0, -1.4])} escala={1.0 * marK} toldo={marK} />
          <Lojinha tema={tema} pos={soma(MAR, [0.2, 0, -1.6])} escala={0.9 * marK} toldo={marK} />
          <PilhaMoedas tema={tema} pos={soma(MAR, [-0.8, 0.02, 0.4])} n={5} cor={mistura(festa.turquesa, dourado, 0.3)} r={0.26} escala={marK} brilho={pulso(t, T.comercio, 1.0)} />
          <Fila tema={tema} pos={soma(MAR, [0.4, 0, 1.6])} n={6} k={marK} t={t} moedas={(i) => (i < 4 ? 1 : 1 - corte)} cores={cores} dourado={mistura(festa.turquesa, dourado, 0.3)} />
          <Caixa args={[0.06, 0.9 * corte, 1.4]} raio={0.02} cor={tema.acento} emissivo={0.3} position={soma(MAR, [1.45, 0.45 * corte, 1.6])} sombra={false} />
        </group>
      ) : null}

      {/* Cena 7: inteligência artificial */}
      {iaK > 0.02 ? (
        <group>
          <Fabrica tema={tema} pos={soma(IA, [0, 0, -3.0])} escala={0.42 * iaK} janelas={iaK} />
          <Robo tema={tema} pos={soma(IA, [-1.2, 0, 0.8])} rotY={0.4} escala={1.4 * iaK * entra(t, T.ia - 0.2, 0.5)} />
          <Boneco tema={tema} pos={soma(IA, [1.2, 0, 0.8])} rotY={-0.4} escala={0.65 * iaK * entra(t, T.maquinas - 0.2, 0.5)} cor={tema.pessoa} />
        </group>
      ) : null}

      {/* Cena 8: os dois lados */}
      {ladK > 0.02 ? (
        <group>
          <BalancaJustica tema={tema} pos={soma(LADOS, [0, 0, -1.6])} escala={0.85 * ladK} inclina={0.15 * Math.sin(t * 1.1)} brilhoEsq={pulso(t, T.defende, 1.2)} brilhoDir={pulso(t, T.critica, 1.2)} />
          <Fila tema={tema} pos={soma(LADOS, [-2.4, 0, 0.8])} n={3} k={ladK * defK} t={t} moedas={() => 0} cores={[mistura(festa.verde, tema.objeto, 0.4)]} dourado={dourado} abre={0.6} />
          <Fila tema={tema} pos={soma(LADOS, [2.4, 0, 0.8])} n={3} k={ladK * criK} t={t} moedas={() => 0} cores={[mistura(festa.azul, tema.objeto, 0.4)]} dourado={dourado} abre={0.6} />
          {[0, 1, 2, 3, 4].map((i) => (
            <PilhaMoedas key={i} tema={tema} pos={soma(LADOS, [1.4 + 0.5 * i, 0.02, 2.2])} n={Math.max(1, Math.round(10 * contaK * (0.6 + 0.1 * i)))} cor={dourado} r={0.2} escala={ladK * entra(t, T.conta, 0.4)} brilho={pulso(t, T.bilhoes + 0.6, 1.0)} />
          ))}
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar([alvo[0], alvo[1] - 0.25, alvo[2]], larg * 0.78, alt * 0.78, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const parado = (ini: number, fim: number, c: Cam): Cena => ({ini, chaves: [[ini, c], [fim, c]]});
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(PRACA, [0, 1.2, -0.4]), 9.0, 6.6, [0, 0.42, 1])], [T.nome, E(soma(PRACA, [0, 1.0, 0.4]), 7.6, 5.6, [0.06, 0.38, 1])], [T.brasil, E(soma(PRACA, [0, 1.0, -0.6]), 6.8, 5.2, [0, 0.42, 1])], [T.primeiro, E(soma(PRACA, [0, 1.0, -0.8]), 6.4, 5.0, [-0.05, 0.42, 1])]]},
  {ini: T.primeiro, chaves: [[T.primeiro, E(soma(OQUE, [0, 1.3, -0.4]), 10.0, 6.6, [0.04, 0.3, 1])], [T.diferente, E(soma(OQUE, [0, 1.0, 0.4]), 8.4, 5.8, [0, 0.32, 1])], [T.jan04 - 0.1, E(soma(OQUE, [0, 1.0, 0.8]), 7.0, 5.0, [-0.05, 0.32, 1])]]},
  {ini: T.jan04, chaves: [[T.jan04, E(soma(LEI, [-2.0, 1.4, -1.0]), 5.6, 4.6, [0.1, 0.28, 1])], [T.lei, E(soma(LEI, [-0.6, 1.0, 0.4]), 6.0, 4.6, [0.04, 0.32, 1])], [T.etapas, E(soma(LEI, [1.6, 1.0, -0.6]), 6.0, 4.6, [-0.03, 0.3, 1])], [T.papel, E(soma(LEI, [1.4, 0.9, 0.2]), 6.4, 4.8, [-0.06, 0.32, 1])], [T.stf21 - 0.1, E(soma(LEI, [1.4, 0.9, 0.2]), 6.2, 4.6, [-0.08, 0.32, 1])]]},
  {ini: T.stf21, chaves: [[T.stf21, E(soma(STF, [0, 1.6, -1.4]), 7.0, 5.4, [0.08, 0.28, 1])], [T.morador, E(soma(STF, [-1.0, 1.0, 0.6]), 6.0, 4.6, [0.06, 0.3, 1])], [T.mandou, E(soma(STF, [0.4, 1.3, -0.4]), 7.4, 5.4, [-0.04, 0.3, 1])], [T.bf - 0.1, E(soma(STF, [0.4, 1.3, -0.4]), 7.0, 5.2, [-0.07, 0.3, 1])]]},
  {ini: T.bf, chaves: [[T.bf, E(soma(BF, [-2.2, 1.0, -0.4]), 4.8, 4.0, [0.1, 0.3, 1])], [T.etapa + 0.8, E(soma(BF, [-1.8, 1.0, -0.2]), 5.2, 4.2, [0.06, 0.3, 1])], [T.outubro, E(soma(BF, [1.0, 1.1, 0.4]), 5.6, 4.4, [0.02, 0.32, 1])], [T.milhoes19, E(soma(BF, [0.8, 1.1, 1.0]), 7.4, 5.2, [-0.03, 0.34, 1])], [T.marica, E(soma(BF, [0.8, 1.1, 1.0]), 7.2, 5.0, [-0.06, 0.34, 1])]]},
  parado(T.marica, T.mumbuca, E(soma(MAR, [-0.6, 1.2, -0.4]), 7.0, 5.2, [0.1, 0.3, 1])),
  {ini: T.mumbuca, chaves: [[T.mumbuca, E(soma(MAR, [-0.6, 1.2, -0.4]), 7.0, 5.2, [0.1, 0.3, 1])], [T.repara, E(soma(MAR, [0.4, 1.0, 1.0]), 7.0, 5.0, [0.02, 0.34, 1])], [T.tres, E(soma(MAR, [1.0, 1.0, 1.4]), 5.6, 4.4, [-0.04, 0.34, 1])], [T.mundo, E(soma(MAR, [1.0, 1.0, 1.4]), 5.4, 4.2, [-0.07, 0.34, 1])]]},
  parado(T.mundo, T.voltou, E(soma(IA, [0, 1.6, -0.8]), 7.4, 5.6, [0.08, 0.3, 1])),
  {ini: T.voltou, chaves: [[T.voltou, E(soma(IA, [0, 1.6, -0.8]), 7.4, 5.6, [0.08, 0.3, 1])], [T.ia, E(soma(IA, [-0.6, 1.2, 0.4]), 6.0, 4.6, [0.04, 0.3, 1])], [T.maquinas, E(soma(IA, [0.4, 1.1, 0.6]), 5.8, 4.4, [-0.04, 0.3, 1])], [T.lados - 0.1, E(soma(IA, [0.4, 1.1, 0.6]), 5.6, 4.4, [-0.07, 0.3, 1])]]},
  {ini: T.lados, chaves: [[T.lados, E(soma(LADOS, [0, 1.4, -0.6]), 8.6, 5.8, [0.06, 0.3, 1])], [T.defende, E(soma(LADOS, [-2.0, 1.0, 0.6]), 5.8, 4.6, [0.08, 0.3, 1])], [T.liberdade + 0.8, E(soma(LADOS, [-1.8, 1.0, 0.6]), 6.0, 4.6, [0.05, 0.3, 1])], [T.critica, E(soma(LADOS, [2.0, 1.0, 0.6]), 5.8, 4.6, [-0.06, 0.3, 1])], [T.conta, E(soma(LADOS, [2.4, 0.9, 1.6]), 5.0, 4.0, [-0.04, 0.4, 1])], [T.inflacao, E(soma(LADOS, [1.6, 1.1, 0.6]), 6.8, 5.0, [-0.06, 0.32, 1])], [T.testes, E(soma(LADOS, [0, 1.3, -0.4]), 8.6, 5.8, [0, 0.3, 1])], [T.fato - 0.1, E(soma(LADOS, [0, 1.3, -0.4]), 8.2, 5.6, [-0.04, 0.3, 1])]]},
  {ini: T.fato, chaves: [[T.fato, E(soma(PRACA, [0, 1.4, -0.6]), 9.4, 6.8, [0, 0.42, 1])], [T.existe, E(soma(PRACA, [0, 1.2, -1.2]), 8.0, 6.0, [0.04, 0.38, 1])], [T.voce, E(soma(PRACA, [0, 1.2, -0.4]), 9.0, 6.6, [0, 0.42, 1])], [FIM, E(soma(PRACA, [0, 1.3, -0.6]), 9.8, 7.2, [0, 0.45, 1])]]},
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
  {a: T.renda, b: T.brasil, texto: 'RENDA BÁSICA UNIVERSAL', destaque: true},
  {a: T.brasil, b: T.primeiro, texto: 'UMA LEI DE 2004 · HÁ 22 ANOS'},
  {a: T.diferente, b: T.jan04, texto: 'BOLSA FAMÍLIA: SÓ PARA RENDA BAIXA, COM REGRAS'},
  {a: T.criou, b: T.mas, texto: 'TODOS OS BRASILEIROS + ESTRANGEIROS HÁ 5 ANOS NO PAÍS'},
  {a: T.papel, b: T.stf21, texto: 'NUNCA REGULAMENTADA', destaque: true},
  {a: T.mandou, b: T.bf, texto: 'STF: FIXAR VALOR PARA A EXTREMA POBREZA'},
  {a: T.etapa, b: T.outubro, texto: 'LEI 14.601/2023: "ETAPA" RUMO À RENDA BÁSICA'},
  {a: T.milhoes19, b: T.marica, texto: '≈ 19 MILHÕES DE FAMÍLIAS', destaque: true},
  {a: T.tres, b: T.mundo, texto: 'ATÉ 3 SALÁRIOS MÍNIMOS · AINDA NÃO É UNIVERSAL', destaque: true},
  {a: T.conta, b: T.inflacao, texto: 'CONTA MINHA: R$ 100 × 213,4 MI × 12 = R$ 256 BI POR ANO', destaque: true},
  {a: T.testes, b: T.fato, texto: 'TESTES PEQUENOS E COM PRAZO PARA ACABAR'},
  {a: T.fato, b: T.voce, texto: 'HOJE: NÃO EXISTE RENDA BÁSICA UNIVERSAL NO BRASIL', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.jan04, b: T.stf21, texto: 'FONTE: LEI 10.835/2004 · SENADO FEDERAL'},
  {a: T.stf21, b: T.bf, texto: 'FONTE: STF · MI 7.300/DF · 2021'},
  {a: T.bf, b: T.marica, texto: 'FONTE: LEI 14.601/2023 · MDS · 09/2026'},
  {a: T.mumbuca, b: T.mundo, texto: 'FONTE: PREFEITURA DE MARICÁ, VIA BRASIL DE FATO'},
  {a: T.conta, b: T.inflacao, texto: 'FONTE DA POPULAÇÃO: IBGE · ESTIMATIVA 2025'},
];
const visivel = (x: {a: number; b: number}, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

type Rot = {a: number; b: number; p: V3; texto: string; acento?: boolean};
const ROTULOS: Rot[] = [
  {a: T.sem, b: T.brasil, p: soma(PRACA, [0, 2.2, 0.6]), texto: 'SEM PROVAR QUE É POBRE', acento: true},
  {a: T.universal, b: T.diferente, p: soma(OQUE, [0, 2.2, 1.0]), texto: 'TODO MUNDO, RICO OU POBRE'},
  {a: T.incond, b: T.diferente, p: soma(OQUE, [0, 1.7, 1.0]), texto: 'NÃO EXIGE NADA EM TROCA'},
  {a: T.dinheiro, b: T.diferente, p: soma(OQUE, [0, 1.2, 1.0]), texto: 'EM DINHEIRO, TODO MÊS', acento: true},
  {a: T.suplicy, b: T.mas, p: soma(LEI, [-1.4, 1.7, 1.0]), texto: 'EDUARDO SUPLICY'},
  {a: T.etapas, b: T.papel, p: soma(LEI, [2.7, 2.0, -1.2]), texto: 'POR ETAPAS, A CRITÉRIO DO GOVERNO', acento: true},
  {a: T.morador, b: T.mandou, p: soma(STF, [-1.6, 1.8, 1.0]), texto: 'DEFENSORIA · MORADOR DE RUA'},
  {a: T.outubro, b: T.milhoes19, p: soma(BF, [0.4, 1.6, 0.4]), texto: 'R$ 600'},
  {a: T.outubro + 0.4, b: T.milhoes19, p: soma(BF, [1.8, 1.8, 0.4]), texto: 'R$ 691', acento: true},
  {a: T.mumbuca, b: T.repara, p: soma(MAR, [-0.8, 1.6, 0.4]), texto: 'MUMBUCA: MOEDA DA CIDADE', acento: true},
  {a: T.comercio, b: T.repara, p: soma(MAR, [-1.0, 2.6, -1.4]), texto: 'SÓ VALE NO COMÉRCIO DE MARICÁ'},
  {a: T.ia, b: T.lados, p: soma(IA, [-1.2, 2.2, 0.8]), texto: 'INTELIGÊNCIA ARTIFICIAL', acento: true},
  {a: T.maquinas, b: T.lados, p: soma(IA, [1.2, 1.8, 0.8]), texto: 'E A RENDA DAS PESSOAS?'},
  {a: T.burocracia, b: T.critica, p: soma(LADOS, [-2.4, 2.4, 0.8]), texto: 'MENOS BUROCRACIA', acento: true},
  {a: T.ninguemFora, b: T.critica, p: soma(LADOS, [-2.4, 1.9, 0.8]), texto: 'NINGUÉM FICA DE FORA'},
  {a: T.liberdade, b: T.critica, p: soma(LADOS, [-2.4, 1.4, 0.8]), texto: 'LIBERDADE PARA ESCOLHER TRABALHO'},
  {a: T.critica, b: T.conta, p: soma(LADOS, [2.4, 2.4, 0.8]), texto: 'O CUSTO', acento: true},
  {a: T.bilhoes, b: T.testes, p: soma(LADOS, [2.4, 1.2, 2.2]), texto: '≈ R$ 256 BILHÕES POR ANO', acento: true},
  {a: T.inflacao, b: T.testes, p: soma(LADOS, [2.4, 2.4, 0.8]), texto: 'INFLAÇÃO E MENOS VONTADE DE TRABALHAR'},
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
      <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 40 ? 19 : chip.texto.length > 30 ? 22 : 30} />
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
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 230, Math.min(SEGURO.botoesX - 230, x)), top: Math.max(640, Math.min(1300, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '6px 14px 7px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: txt.length > 34 ? 17 : txt.length > 26 ? 20 : 25, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
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
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 460 && Math.abs(visRot[a].y - visRot[b].y) < 56) visRot[a].y = visRot[b].y + 58;
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
      <OffthreadVideo src={staticFile(`${P}/mapas/renda.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.primeiro, T.jan04, T.stf21, T.bf, T.mumbuca, T.voltou, T.lados, T.fato].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.receber + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.renda, f: 'ding', v: 0.14});
  [T.universal, T.incond, T.dinheiro].forEach((t) => s.push({t, f: 'pop', v: 0.13}));
  s.push({t: T.papel + 0.4, f: 'baque', v: 0.14});
  s.push({t: T.mandou + 0.5, f: 'baque', v: 0.16});
  s.push({t: T.outubro + 2.0, f: 'ding', v: 0.14});
  s.push({t: T.tres + 0.3, f: 'tique', v: 0.14});
  s.push({t: T.ia, f: 'bip', v: 0.12});
  s.push({t: T.bilhoes + 0.6, f: 'ding', v: 0.16});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.sem + 0.6, T.nome + 0.8, T.brasil + 1.0, T.universal + 0.6, T.incond + 0.8, T.diferente + 1.2, T.jan04 + 0.4,
  T.lei + 1.0, T.suplicy + 0.8, T.etapas + 0.8, T.papel + 0.8, T.stf21 + 0.4, T.morador + 0.6, T.mandou + 1.0, T.bf + 0.6,
  T.etapa + 0.6, T.outubro + 2.2, T.milhoes19 + 0.6, 59.5, T.mumbuca + 0.6, T.comercio + 0.6, T.tres + 0.8, T.naoUniv + 0.4,
  74, 82, 89, 97, T.voltou + 0.4, T.ia + 0.8, T.maquinas + 1.0, T.lados + 0.4, T.burocracia + 0.6, T.liberdade + 0.6,
  T.critica + 0.4, T.conta + 0.6, T.bilhoes + 1.2, T.inflacao + 0.8, T.testes + 0.8, T.ninguemSabe + 0.8, T.fato + 0.6,
  T.existe + 0.4, T.decisao + 0.4, T.programas + 0.8, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const RendaBasica: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={220} sombraArea={24} centro={[cam.alvo[0], 0, cam.alvo[2]]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {MAPAS.map((m, k) => (
        <Sequence key={k} from={m.de} durationInFrames={m.ate - m.de} layout="none">
          <TrechoMapa {...m} />
        </Sequence>
      ))}
      <Interface t={t} tema={tema} cam={cam} />
      <Marca tema={tema} serie={SERIE} assunto="Renda básica" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      <SeloArroba t={t} frase="siga para entender a notícia" y={600} />
      <MarcaDagua tema={tema} t={t} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

export const TITULO_CAPA = ['Dinheiro', 'só por', 'existir?'];
export const CapaRendaBasica: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  const tam = 132;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · RENDA BÁSICA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 850, letterSpacing: -4, lineHeight: 1.0, color: k >= 2 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
