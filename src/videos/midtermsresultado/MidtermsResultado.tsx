import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Caixa, Palco, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, pulso, rampa, sai} from '../../base/tempo';
import {ESCURO, FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {curva} from '../../base/cidade';
import {SERIE, temaPorId} from '../../estilo';
import {Balanca, CalendarioGrande, CameraTV, Cartaz, DocumentoGrande, IconeBalao, Lua, Lupa, PastaIntimacao, PilhaMoedas, RelogioMesa} from '../../pecas';
import {PlacaChao} from '../demissaovoto/pecas';
import {Capitolio, N_CAMARA, PlacarCasa, PlenarioEua, UrnaPapel} from '../eleicaoeua/pecas';
import {CarimboVeto, LinhaPlenario, MarcaVetado, N_SENADO, PlenarioSenado, cadeiraSenado} from './pecas';
import {PALAVRAS} from './palavras';

// 019. resultado midterms eua (perfil @eumagnoleite, série Magno Explica). Continuação do 015, com os DOIS kits:
// a "noite da apuração" na frente do Capitólio (Câmara com 435 cadeiras à esquerda, Senado com 100 à direita),
// uma linha do tempo no chão com 7 marcos, e um trecho do Kit Mapas Animados (projetos/019.../mapas/viradas.mp4,
// composição MidtermsResultado do kit) com as 7 cadeiras viradas.
// Ninguém real com rosto: TRUMP e DEMOCRATAS são bonecos genéricos com etiqueta, no mesmo tamanho e tempo de tela;
// os partidos aparecem só pelo nome, em dois tons. Plano: projetos/019. resultado midterms eua/plano.md (v1, aprovado em 04/11/2026).

export const FPS = 30;
const AUDIO_SEG = 96.61;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '019. resultado midterms eua';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  perdeu: quando('perdeu'),
  partidoTrump: quando('partido do Trump perdeu'),
  controle: quando('controle do Congresso'),
  euTe: quando('Eu te conto'),
  naOrdem: quando('na ordem'),
  muda: quando('que muda agora'),
  primeiro: quando('Primeiro'),
  republicanos: quando('Os republicanos'),
  partidoTrump2: quando('o partido do Trump mandavam'),
  nasDuas: quando('nas duas casas'),
  noSenado: quando('No Senado eram'),
  n53: quando('53'),
  n47: quando('47'),
  democratas1: quando('democratas'),
  terca: quando('Terca-feira'),
  diaVotar: quando('dia de votar'),
  americanos: quando('Os americanos'),
  camaraInteira: quando('a Camara inteira'),
  n435: quando('435'),
  n35: quando('35 das 100'),
  cadeirasSenado: quando('cadeiras do Senado'),
  aindaNoite: quando('Ainda na noite'),
  primeiraNoticia: quando('a primeira noticia'),
  redes: quando('grandes redes'),
  projetaram: quando('projetaram'),
  viraramCamara: quando('viraram a Camara'),
  umaHora: quando('Uma hora depois'),
  segunda: quando('a segunda'),
  tambemSenado: quando('tambem o Senado'),
  n51: quando('51 votos'),
  manda: quando('manda'),
  madrugada: quando('De madrugada'),
  fazConta: quando('Faz a conta'),
  de47: quando('de 47'),
  n54: quando('pelo menos 54'),
  senadores: quando('senadores'),
  faltam: quando('faltam 2'),
  reacoes: quando('Depois as reacoes'),
  trumpDisse: quando('O Trump disse'),
  trabalhem: quando('trabalhem com ele'),
  senao: quando('Senao vai vetar'),
  demProm: quando('Os democratas prometeram'),
  custo: quando('custo de vida'),
  eAgora: quando('E agora'),
  novoCongresso: quando('novo Congresso'),
  posse: quando('toma posse'),
  jan3: quando('3 de janeiro'),
  tresCoisas: quando('mudam tres coisas'),
  um: quando('Um Nenhuma'),
  leiPassa: quando('lei passa'),
  semDem: quando('sem os democratas'),
  camaraSenado: quando('da Camara e do Senado'),
  orcamento: quando('inclui o orcamento'),
  dois: quando('Dois Ministros'),
  ministros: quando('Ministros'),
  embaixadores: quando('embaixadores'),
  juizes: quando('juizes da Suprema'),
  peloTrump: quando('pelo Trump'),
  simSenado: quando('sim do Senado'),
  tres: quando('Tres A Camara'),
  investigacoes: quando('investigacoes'),
  masTrump: quando('Mas o Trump'),
  arma: quando('uma arma'),
  veto: quando('o veto'),
  ate2029: quando('ate 2029'),
  barrar: quando('barrar as leis'),
  derrubar: quando('derrubar um veto'),
  doisTercos: quando('2 tercos'),
  duasCasas2: quando('das duas casas'),
  naoChegaram: quando('nao chegaram nisso'),
  ouSeja: quando('Ou seja'),
  naoGoverna: quando('o Trump nao governa'),
  sozinho: quando('sozinho'),
  congressoTambem: quando('E o Congresso tambem nao'),
  voceAcha: quando('Voce acha'),
  brasil: quando('para o Brasil'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'O RESULTADO'],
  [T.primeiro, 'ANTES'],
  [T.terca, 'TERÇA, A VOTAÇÃO'],
  [T.aindaNoite, 'A NOITE'],
  [T.madrugada, 'A MADRUGADA'],
  [T.fazConta, 'A CONTA'],
  [T.reacoes, 'AS REAÇÕES'],
  [T.eAgora, 'E AGORA?'],
  [T.um, 'O QUE MUDA · 1/3'],
  [T.dois, 'O QUE MUDA · 2/3'],
  [T.tres, 'O QUE MUDA · 3/3'],
  [T.masTrump, 'O VETO'],
  [T.derrubar, 'O LIMITE'],
  [T.ouSeja, 'O EQUILÍBRIO'],
  [T.voceAcha, 'E VOCÊ?'],
];

// ---------- O trecho de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA = {de: q(T.madrugada), ate: q(T.fazConta)};
const noMapa = (t: number) => t >= T.madrugada && t < T.fazConta;

// ---------- Mapa do mundo (chão em y = 0; frente em z+) ----------
const CAPITOLIO: V3 = [0, 0, -12];
const CAMARA: V3 = [-5, 0, -3];
const ESC_CAMARA = 0.8;
const SENADO: V3 = [5, 0, -3];
const PLACAR: V3 = [2.3, 0, -0.6];
const LINHA_Z = 5.2;
const MARCOS_X = [-9, -6, -3, 0, 3, 6, 9];
const URNA: V3 = [-6, 0, 2.4];
const CAMERA_TV: V3 = [-3.4, 0, 2.2];
const RELOGIO: V3 = [1.6, 0, 1.2];
const TRUMP_REACAO: V3 = [1.8, 0, 2.6];
const DEM_REACAO: V3 = [4.2, 0, 2.6];
const CALENDARIO: V3 = [6, 0, 2.4];
const DOC_CAMARA: V3 = [-2.8, 0.02, -0.6];
const DOC_SENADO: V3 = [2.8, 0.02, -0.6];
const FILA: V3[] = [[2.2, 0, 0.3], [3.1, 0, 0.3], [4.0, 0, 0.3]];
const TRUMP_FILA: V3 = [1.1, 0, 0.6];
const PLACA_SIM: V3 = [5.4, 0, 0.3];
const PASTA: V3 = [-3.6, 0, 0.6];
const TRUMP_VETO: V3 = [8.1, 0, 2.8];
const MESA_VETO: V3 = [9.5, 0, 2.6];
const BALANCA: V3 = [0, 0, 2.4];
const ESC_BAL = 0.95;

// Câmara: antes, republicanos nas cadeiras 0 a 219 (esquerda); depois da projeção, democratas da 190 em diante (sem número na tela)
const R_ANTES_CAM = 220;
const D_DEPOIS_CAM = 190;
const DOIS_TERCOS_CAM = N_CAMARA - 290; // os democratas precisariam das cadeiras 145 em diante
// Senado: antes, republicanos nas cadeiras 0 a 52 (53) e democratas 53 a 99 (47).
// Em jogo: 31 a 65 (35). Viradas: 46 a 52 (7). Sem projeção: 44 e 45 (Alasca e Mississippi). Depois: 54 democratas (46 a 99).
const R_ANTES_SEN = 53;
const JOGO_SEN = [31, 65];
const VIRA_SEN = [46, 52];
const ABERTAS = [44, 45];
const MAIORIA_SEN = N_SENADO - 51; // linha entre a 48 e a 49
const DOIS_TERCOS_SEN = N_SENADO - 67; // linha entre a 32 e a 33

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const onda = (t: number, a: number, o: number, n: number, dur = 0.9, d = 0.25) => rampa(t, a + (o / n) * dur, a + (o / n) * dur + d);
const noSenado = (o: number) => SENADO_ANG(o);
const SENADO_ANG = (o: number): V3 => soma(SENADO, cadeiraSenado(o));
// ângulo aproximado da divisa da cadeira `o` na Câmara (mesmo desenho do PlenarioEua do 015)
const angCamara = (o: number) => Math.PI * (0.04 + (0.92 * o) / N_CAMARA);

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const corR = F.dourado;
  const corD = F.azul;
  const base = tema.objetoEscuro;
  const jogo = mistura(tema.objeto, tema.objetoClaro, 0.6);
  const brilhoDem = pulso(t, T.semDem, 1.2);

  // --- Câmara ---
  const corCamara = (o: number): string => {
    const ehR = o < R_ANTES_CAM;
    const rVis = ehR ? Math.max(0, 1 - onda(t, T.perdeu, o, R_ANTES_CAM, 0.5) + onda(t, T.nasDuas, o, R_ANTES_CAM, 0.6)) : 1;
    let c = ehR ? mistura(base, corR, 0.8 * Math.min(1, rVis)) : mistura(base, corD, 0.8);
    c = mistura(c, jogo, onda(t, T.n435, o, N_CAMARA, 1.0));
    const fim = o >= D_DEPOIS_CAM ? mistura(base, corD, 0.85) : mistura(base, corR, 0.8);
    c = mistura(c, fim, onda(t, T.viraramCamara, N_CAMARA - 1 - o, N_CAMARA, 1.0));
    if (o >= D_DEPOIS_CAM && t > T.viraramCamara) c = mistura(c, tema.objetoClaro, 0.35 * brilhoDem);
    return c;
  };
  const sobeCamara = (o: number) =>
    pulso(t, T.n435 + (o / N_CAMARA) * 1.0, 0.6) * (t < T.n35 ? 1 : 0) + (o >= D_DEPOIS_CAM ? 1.6 * janela(t, T.duasCasas2, T.ouSeja, 0.8) : 0);

  // --- Senado ---
  const ehJogo = (o: number) => o >= JOGO_SEN[0] && o <= JOGO_SEN[1];
  const ehVira = (o: number) => o >= VIRA_SEN[0] && o <= VIRA_SEN[1];
  const ehAberta = (o: number) => ABERTAS.includes(o);
  const corSenado = (o: number): string => {
    const ehR = o < R_ANTES_SEN;
    const rVis = ehR ? Math.max(0, 1 - onda(t, T.perdeu, o, R_ANTES_SEN, 0.5) + onda(t, T.n53, o, R_ANTES_SEN, 0.6)) : 1;
    const dVis = ehR ? 1 : onda(t, T.n47, o - R_ANTES_SEN, N_SENADO - R_ANTES_SEN, 0.5) + (t < T.primeiro ? 1 : 0);
    let c = ehR ? mistura(base, corR, 0.8 * Math.min(1, rVis)) : mistura(base, corD, 0.8 * Math.min(1, dVis));
    // em "47": as cadeiras azuis brilham um instante
    if (!ehR) c = mistura(c, tema.objetoClaro, 0.3 * pulso(t, T.n47, 0.9) + 0.3 * pulso(t, T.de47, 1.0));
    if (ehJogo(o)) c = mistura(c, jogo, onda(t, T.n35, o - JOGO_SEN[0], 35, 0.8));
    // a projeção do Senado: o que estava em jogo se resolve (as 7 viradas já azuis, Alasca e Mississippi ainda abertas)
    if (ehJogo(o) && !ehAberta(o)) {
      const fim = ehVira(o) || o >= R_ANTES_SEN ? mistura(base, corD, 0.85) : mistura(base, corR, 0.8);
      c = mistura(c, fim, onda(t, T.tambemSenado, N_SENADO - o, 60, 0.8));
    }
    // a conta: as 7 viradas voltam ao dourado e viram azuis uma a uma
    if (ehVira(o)) {
      const i = o - VIRA_SEN[0];
      const volta = rampa(t, T.fazConta, T.fazConta + 0.4) * (1 - rampa(t, T.n54 + 0.2 + i * 0.14, T.n54 + 0.45 + i * 0.14));
      c = mistura(c, mistura(base, corR, 0.8), volta);
    }
    if (ehAberta(o)) c = mistura(c, tema.objeto, rampa(t, T.faltam, T.faltam + 0.5));
    if ((o >= VIRA_SEN[0] || o >= R_ANTES_SEN) && t > T.reacoes) c = mistura(c, tema.objetoClaro, 0.35 * brilhoDem);
    return c;
  };
  const sobeSenado = (o: number) =>
    (ehJogo(o) ? pulso(t, T.n35 + ((o - JOGO_SEN[0]) / 35) * 0.8, 0.6) : 0) + (ehVira(o) ? pulso(t, T.n54 + 0.2 + (o - VIRA_SEN[0]) * 0.14, 0.5) : 0) + (o >= VIRA_SEN[0] ? 1.6 * janela(t, T.duasCasas2, T.ouSeja, 0.8) : 0);
  const linha51 = janela(t, T.n51, T.reacoes, 0.5);
  const linha23 = janela(t, T.doisTercos, T.ouSeja, 0.5);

  // --- Objetos por cena ---
  const capAceso = 0.15 + 0.45 * rampa(t, T.controle, T.controle + 0.8) + 0.4 * rampa(t, T.novoCongresso, T.novoCongresso + 0.8);
  const luaK = vis(t, 0, T.fazConta);
  // o Capitólio fica nos planos abertos e afunda nos fechados (senão invade o cabeçalho)
  const capSobe = Math.max(janela(t, -1, T.noSenado + 0.1, 0.6), janela(t, T.eAgora - 0.3, T.dois - 0.2, 0.6), janela(t, T.derrubar, T.ouSeja - 0.2, 0.6), rampa(t, T.voceAcha - 0.2, T.voceAcha + 0.8));
  const urnaK = vis(t, T.diaVotar - 0.2, T.aindaNoite);
  const cheia = rampa(t, T.diaVotar, T.diaVotar + 1.6);
  const tvK = vis(t, T.primeiraNoticia, T.madrugada);
  const relK = vis(t, T.umaHora - 0.2, T.madrugada);
  const placarK = Math.max(vis(t, T.n53 - 0.2, T.terca), vis(t, T.fazConta, T.reacoes));
  const senR = t < T.fazConta ? 53 : 53 - 7 * rampa(t, T.n54, T.n54 + 1.1) - 2 * rampa(t, T.faltam, T.faltam + 0.5);
  const senD = t < T.fazConta ? 47 * rampa(t, T.n47 - 0.2, T.n47 + 0.4) : 47 + 7 * rampa(t, T.n54, T.n54 + 1.1);

  // TRUMP (mesmo boneco do 015): onde está em cada cena
  const trump: {k: number; p: V3; rotY: number}[] = [
    {k: vis(t, T.partidoTrump, T.primeiro - 0.1), p: [0, 0, 1.4], rotY: 0},
    {k: vis(t, T.partidoTrump2, T.terca), p: [0, 0, -1.2 + 2.6 * (1 - rampa(t, T.partidoTrump2, T.nasDuas, sai))], rotY: 0},
    {k: vis(t, T.trumpDisse - 0.2, T.eAgora), p: TRUMP_REACAO, rotY: 0.15},
    {k: vis(t, T.peloTrump - 0.2, T.tres), p: TRUMP_FILA, rotY: 0.6},
    {k: vis(t, T.masTrump, T.ouSeja), p: TRUMP_VETO, rotY: 0.45},
  ];
  const demK = vis(t, T.demProm - 0.2, T.eAgora);
  const ergue = rampa(t, T.arma, T.arma + 0.5) * (1 - rampa(t, T.ouSeja, T.ouSeja + 0.4));
  // carimbo: sobe na mão do TRUMP em "uma arma", bate no projeto em "barrar as leis" e volta
  const bate = rampa(t, T.barrar, T.barrar + 0.3, (x) => x * x) * (1 - rampa(t, T.barrar + 0.7, T.barrar + 1.2));
  const carimboP: V3 = curva([8.55, 0.72, 3.2], soma(MESA_VETO, [-0.05, 0.9, 0.1]), 0.5, bate);
  const carimboK = 0.6 * vis(t, T.arma - 0.1, T.ouSeja);
  const docVetoK = vis(t, T.barrar - 0.4, T.ouSeja);

  // O projeto de lei: nasce na Câmara e viaja ao Senado
  const docK = vis(t, T.leiPassa - 0.1, T.dois - 0.1);
  const viaja = rampa(t, T.camaraSenado, T.camaraSenado + 1.3);
  const docP = curva(DOC_CAMARA, DOC_SENADO, 1.6, viaja);
  const moedasK = vis(t, T.orcamento - 0.1, T.dois - 0.1);

  const filaTempos = [T.ministros, T.embaixadores, T.juizes];
  const balK = vis(t, T.ouSeja - 0.1, T.voceAcha + 0.4);
  const inclina = -0.8 * rampa(t, T.naoGoverna, T.naoGoverna + 0.6) + 0.8 * rampa(t, T.sozinho + 0.1, T.sozinho + 0.8);
  const congressoCai = rampa(t, T.sozinho, T.sozinho + 0.45, (x) => x * x);

  // linha do tempo: o marco da vez acende no acento e volta ao neutro depois
  const ini = [T.primeiro, T.terca, T.aindaNoite, T.madrugada, T.reacoes, T.eAgora, T.masTrump];
  const fimMarco = [...ini.slice(1), T.ouSeja];
  const textos = ['ANTES', 'TERÇA', 'NOITE', 'MADRUGADA', 'REAÇÕES', '3 JAN 2027', 'ATÉ 2029'];

  return (
    <group>
      {/* Fundo: o Capitólio e a Lua */}
      <Capitolio tema={tema} pos={soma(CAPITOLIO, [0, -8 * (1 - capSobe), 0])} escala={1.1} aceso={capAceso} />
      <Lua tema={tema} pos={[8, 8.5, -15]} escala={1.8 * luaK} />

      {/* As duas casas */}
      <PlenarioEua tema={tema} pos={CAMARA} escala={ESC_CAMARA} cor={corCamara} sobe={sobeCamara} />
      <group position={CAMARA} scale={ESC_CAMARA}>
        <LinhaPlenario ang={angCamara(DOIS_TERCOS_CAM)} r0={2.0} r1={5.9} y={1.0} k={linha23} cor={tema.objetoClaro} />
      </group>
      <PlenarioSenado
        tema={tema}
        pos={SENADO}
        escala={1}
        cor={corSenado}
        sobe={sobeSenado}
        linhas={[
          {ordem: MAIORIA_SEN, k: linha51, cor: tema.acento},
          {ordem: DOIS_TERCOS_SEN, k: linha23, cor: tema.objetoClaro},
        ]}
      />
      <PlacarCasa tema={tema} pos={PLACAR} escala={0.9 * placarK} casa="SENADO" a={senR * 0.022} b={senD * 0.022} corA={corR} corB={corD} />

      {/* A linha do tempo no chão */}
      <Caixa args={[19.4 * rampa(t, T.euTe, T.naOrdem + 0.6), 0.04, 0.12]} raio={0.015} cor={tema.objeto} emissivo={0.15} position={[0, 0.04, LINHA_Z]} />
      {MARCOS_X.map((x, i) => {
        const k = entra(t, T.naOrdem + i * 0.12, 0.4);
        const aceso = Math.max(janela(t, ini[i], fimMarco[i], 0.4), i === 5 ? 0.7 * pulso(t, T.muda, 0.8) : 0, 0.45 * rampa(t, T.voceAcha, T.voceAcha + 1.0));
        return <PlacaChao key={i} tema={tema} pos={[x, 0, LINHA_Z]} escala={0.85 * k} texto={textos[i]} aceso={aceso} />;
      })}

      {/* Cena 3: a urna, as cédulas e a fila de eleitores */}
      <UrnaPapel tema={tema} pos={URNA} rotY={0.15} escala={1.2 * urnaK} cheia={cheia} />
      {urnaK > 0.5
        ? [0, 1, 2, 3].map((i) => {
            const k = rampa(t, T.diaVotar + i * 0.35, T.diaVotar + i * 0.35 + 0.6);
            if (k <= 0 || k >= 1) return null;
            return (
              <group key={i} position={curva([-7.4 + i * 0.4, 2.6, 3.6], soma(URNA, [0, 1.25, 0]), 0.5, k)} rotation={[0.4, i, 0.2]}>
                <Caixa args={[0.34, 0.01, 0.24]} raio={0.004} cor={tema.objetoClaro} sombra={false} />
              </group>
            );
          })
        : null}
      {Array.from({length: 8}).map((_, i) => {
        const k = vis(t, T.americanos + i * 0.08, T.aindaNoite);
        if (k < 0.02) return null;
        const anda = rampa(t, T.americanos + i * 0.08, T.americanos + 1.8 + i * 0.08);
        const x = -11.2 - i * 0.55 + 3.4 * anda;
        return <Boneco key={i} tema={tema} pos={[x, 0, 3.3 + (i % 2) * 0.25]} rotY={Math.PI / 2} escala={0.55 * k} cor={tema.pessoa} pose={{passo: anda < 1 ? Math.sin((t - T.americanos) * 9 + i) : 0}} />;
      })}

      {/* Cena 4: a câmera de TV e o relógio */}
      {tvK > 0.02 ? <CameraTV tema={tema} pos={CAMERA_TV} rotY={Math.PI + 0.3} escala={1.2 * tvK} /> : null}
      <RelogioMesa tema={tema} pos={RELOGIO} escala={5 * relK} ang={Math.PI * 2 * rampa(t, T.umaHora, T.umaHora + 0.9)} />

      {/* TRUMP e DEMOCRATAS (bonecos genéricos sem rosto, mesmo tamanho) */}
      {trump.map((b, i) =>
        b.k > 0.02 ? (
          <Boneco key={i} tema={tema} pos={b.p} rotY={b.rotY} escala={0.85 * b.k} cor={tema.objeto} pose={i === 4 ? {ombroD: [-1.45 * ergue * (1 - bate), 0, 0.1], cotoveloD: -0.15 * ergue} : i === 3 ? {ombroD: [-1.2, 0, 0.1]} : {ombroD: [0, 0, 0.3], ombroE: [0, 0, -0.3]}} />
        ) : null,
      )}
      {demK > 0.02 ? <Boneco tema={tema} pos={DEM_REACAO} rotY={-0.15} escala={0.85 * demK} cor={tema.objeto} pose={{ombroD: [0, 0, 0.3], ombroE: [0, 0, -0.3]}} /> : null}
      {/* Cartazes com as falas (mesmo tamanho para os dois lados) */}
      {[
        {k: vis(t, T.trabalhem - 0.3, T.eAgora), p: TRUMP_REACAO, linhas: t < T.senao ? ['ESPERO QUE TRABALHEM', 'COMIGO.', ' '] : ['ESPERO QUE TRABALHEM', 'COMIGO. SENÃO,', 'VETO TUDO.'], credito: 'TRUMP À CBS · 04/11'},
        {k: vis(t, T.custo - 0.3, T.eAgora), p: DEM_REACAO, linhas: ['FOCO NO', 'CUSTO DE VIDA', ' '], credito: 'DEMOCRATAS · NBC E CNBC'},
      ].map((c, i) =>
        c.k > 0.02 ? (
          <group key={i} position={soma(c.p, [0, 1.95 + 0.3 * (1 - Math.min(1, c.k)), 0.05])} scale={1.0 * c.k}>
            <Cartaz
              tema={tema}
              larg={2.2}
              alt={1.05}
              moldura={tema.objeto}
              fundo={tema.objetoClaro}
              linhas={[...c.linhas.map((l) => ({t: l, tam: 112, cor: tema.objetoEscuro, peso: 900})), {t: c.credito, tam: 64, cor: tema.objeto, peso: 700}]}
            />
          </group>
        ) : null,
      )}

      {/* Cena 7: a posse */}
      <CalendarioGrande tema={tema} pos={CALENDARIO} rotY={-0.2} texto="3 JAN" sub="2027" folha={rampa(t, T.posse, T.posse + 0.6)} escala={1.15 * vis(t, T.posse - 0.3, T.um)} destaque={rampa(t, T.jan3, T.jan3 + 0.4) * (1 - rampa(t, T.tresCoisas, T.tresCoisas + 0.4))} />
      {[0, 1, 2].map((i) => {
        const a = [T.um, T.dois, T.tres][i];
        const b = [T.dois, T.tres, T.masTrump][i];
        return <PlacaChao key={`n${i}`} tema={tema} pos={[-1.6 + i * 1.6, 0, 2.0]} escala={1.05 * vis(t, T.tresCoisas + i * 0.25, T.masTrump)} texto={`${i + 1}`} aceso={janela(t, a, b, 0.35)} />;
      })}

      {/* Cena 8: a lei e o orçamento passam pelas duas casas */}
      <DocumentoGrande tema={tema} pos={docP} rot={[0, 0.1, 0]} escala={1.6 * docK} />
      <PilhaMoedas tema={tema} pos={soma(docP, [1.6, 0, 0.1])} n={10} cor={tema.objetoClaro} r={0.3} escala={1.4 * moedasK} />

      {/* Cena 9: a fila das indicações até o Senado */}
      {FILA.map((p, i) => {
        const k = vis(t, filaTempos[i] - 0.15, T.tres);
        if (k < 0.02) return null;
        const chega = rampa(t, filaTempos[i] - 0.15, filaTempos[i] + 0.6, sai);
        return <Boneco key={`f${i}`} tema={tema} pos={[p[0] - 1.2 * (1 - chega), 0, p[2]]} rotY={Math.PI / 2} escala={0.72 * k} cor={tema.pessoa} pose={{passo: chega < 1 ? Math.sin(t * 9 + i) : 0}} />;
      })}
      <PlacaChao tema={tema} pos={PLACA_SIM} rotY={-0.5} escala={0.8 * vis(t, T.simSenado - 0.1, T.tres)} texto="SIM?" aceso={0} />

      {/* Cena 10: a lupa sobre a pasta do governo */}
      {(() => {
        const k = vis(t, T.investigacoes - 0.3, T.masTrump);
        if (k < 0.02) return null;
        const passa = rampa(t, T.investigacoes, T.masTrump, (x) => x);
        return (
          <>
            <Caixa args={[1.4, 0.8, 1.1]} raio={0.05} cor={tema.objetoEscuro} position={soma(PASTA, [0, 0.4, 0])} scale={k} />
            <PastaIntimacao tema={tema} pos={soma(PASTA, [0, 0.8, 0])} escala={4.0 * k} />
            <Lupa tema={tema} pos={soma(PASTA, [-0.4 + 0.8 * passa, 1.7, 0.45])} rot={[-0.6, 0, 0.3]} escala={1.1 * k} />
          </>
        );
      })()}

      {/* Cena 11: o veto */}
      {docVetoK > 0.02 || carimboK > 0.02 ? (
        <group>
          {[-1, 1].flatMap((x) => [-1, 1].map((z) => <Caixa key={`${x}${z}`} args={[0.07, 0.8, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={soma(MESA_VETO, [0.6 * x, 0.4, 0.4 * z])} scale={Math.min(1, Math.max(docVetoK, carimboK * 1.6))} />))}
          <Caixa args={[1.5, 0.07, 1.0]} raio={0.03} cor={tema.objeto} position={soma(MESA_VETO, [0, 0.82, 0])} scale={Math.min(1, Math.max(docVetoK, carimboK * 1.6))} />
        </group>
      ) : null}
      <DocumentoGrande tema={tema} pos={soma(MESA_VETO, [0, 0.85, 0])} rot={[0, -0.1, 0]} escala={0.85 * docVetoK} />
      <MarcaVetado tema={tema} pos={soma(MESA_VETO, [0.05, 0.93, 0.2])} k={entra(t, T.barrar + 0.35, 0.4) * docVetoK} />
      <CarimboVeto tema={tema} pos={carimboP} rot={[0, -0.35, 0]} escala={carimboK} texto={rampa(t, T.veto, T.veto + 0.4)} />

      {/* Cena 12: a balança no meio */}
      <Balanca
        tema={tema}
        pos={BALANCA}
        escala={ESC_BAL * balK}
        inclina={inclina}
        esq={<Boneco tema={tema} pos={[0, 0, 0]} escala={0.4 * rampa(t, T.naoGoverna - 0.1, T.naoGoverna + 0.3)} cor={tema.objeto} />}
        dir={congressoCai > 0.01 ? <Capitolio tema={tema} pos={[0, 1.6 * (1 - congressoCai), 0]} escala={0.075} aceso={0.4} /> : null}
      />

      {/* Fim */}
      <IconeBalao pos={[0, 2.6, 4.0]} cor={tema.acento} escala={1.1 * entra(t, T.comentarios, 0.45)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 1.4, -5.5], 16, 10, [0, 1.25, 1])], [T.controle, E([0, 1.6, -6.5], 15, 9.5, [0, 0.85, 1])], [T.euTe - 0.1, E([0, 1.4, -5], 16, 10, [0, 0.85, 1])], [T.naOrdem, E([0, 0.4, 0.8], 19.5, 10.5, [0, 0.8, 1])], [T.primeiro - 0.2, E([0, 0.4, 1.0], 19, 10.2, [0, 0.78, 1])]]},
  {ini: T.primeiro, chaves: [[T.primeiro, E([-1, 0.8, -3], 17, 9, [0.15, 0.62, 1])], [T.noSenado - 0.3, E([0, 0.8, -3], 16, 8.6, [0.05, 0.6, 1])], [T.noSenado + 0.4, E([4.3, 1.5, -2.4], 8.2, 5.6, [-0.1, 1.0, 1])], [T.terca - 0.2, E([4.3, 1.5, -2.4], 7.8, 5.4, [-0.18, 1.0, 1])]]},
  {ini: T.terca, chaves: [[T.terca, E([-6.3, 0.9, 2.8], 5.4, 3.6, [0.12, 0.42, 1])], [T.camaraInteira - 0.2, E([-6.6, 0.9, 2.8], 5.0, 3.4, [0.05, 0.4, 1])], [T.camaraInteira + 0.3, E([-5, 0, -5.2], 9.4, 7, [0.1, 1.2, 0.6])], [T.n35 - 0.3, E([-5, 0, -5.2], 9, 6.8, [0.15, 1.2, 0.6])], [T.n35 + 0.3, E([5, 0, -4.4], 7, 5.6, [-0.1, 1.2, 0.6])], [T.aindaNoite - 0.2, E([5, 0, -4.4], 6.8, 5.4, [-0.15, 1.2, 0.6])]]},
  {ini: T.aindaNoite, chaves: [[T.aindaNoite, E([-4, 0.9, -0.8], 10, 6.4, [0.25, 0.62, 1])], [T.umaHora - 0.3, E([-4.3, 0.9, -1.2], 9.2, 6, [0.15, 0.62, 1])], [T.umaHora + 0.3, E([3.6, 1.4, -1.6], 8.8, 6, [-0.15, 0.7, 1])], [T.madrugada, E([4.2, 1.4, -2.2], 7.6, 5.4, [-0.12, 0.8, 1])]]},
  {ini: T.madrugada, chaves: [[T.madrugada, E([4.6, 1.4, -2.0], 7.4, 5.4, [-0.1, 0.72, 1])], [T.fazConta, E([4.8, 1.4, -2.0], 7.4, 5.4, [-0.1, 0.72, 1])]]},
  {ini: T.fazConta, chaves: [[T.fazConta, E([4.3, 1.5, -2.2], 8.2, 5.6, [-0.12, 1.0, 1])], [T.reacoes - 0.2, E([4.4, 1.5, -2.3], 7.6, 5.3, [-0.04, 0.98, 1])]]},
  {ini: T.reacoes, chaves: [[T.reacoes, E([3, 1.6, 2.6], 5.0, 3.8, [-0.1, 0.48, 1])], [T.eAgora - 0.2, E([3, 1.6, 2.6], 4.7, 3.6, [0.1, 0.48, 1])]]},
  {ini: T.eAgora, chaves: [[T.eAgora, E([3.6, 1.6, -0.5], 10, 7, [-0.1, 0.4, 1])], [T.jan3, E([5.4, 1.1, 1.8], 6.4, 4.4, [-0.12, 0.36, 1])], [T.tresCoisas, E([5.2, 1.1, 1.8], 6.2, 4.3, [-0.18, 0.36, 1])], [T.um - 0.1, E([0, 0.6, -2.6], 15, 9, [0, 0.62, 1])]]},
  {ini: T.um, chaves: [[T.um, E([0, 0.6, -2.6], 15, 9, [0, 0.62, 1])], [T.dois - 0.2, E([0, 0.6, -2.4], 14, 8.4, [0.05, 0.62, 1])]]},
  {ini: T.dois, chaves: [[T.dois, E([3.4, 1.9, -0.6], 7.6, 5.4, [-0.1, 0.45, 1])], [T.tres - 0.2, E([3.4, 1.9, -0.6], 7.2, 5.2, [0.05, 0.45, 1])]]},
  {ini: T.tres, chaves: [[T.tres, E([-4.2, 0.9, -0.8], 7.4, 5.2, [0.12, 0.55, 1])], [T.masTrump - 0.2, E([-4.0, 0.9, -0.4], 6.4, 4.6, [0.05, 0.52, 1])]]},
  {ini: T.masTrump, chaves: [[T.masTrump, E([8.8, 1.3, 2.7], 5.2, 3.8, [-0.18, 0.32, 1])], [T.derrubar - 0.2, E([8.9, 1.2, 2.7], 4.8, 3.5, [-0.08, 0.34, 1])], [T.derrubar + 0.4, E([0, 0.2, -4.4], 19, 10, [0, 1.35, 0.7])], [T.ouSeja - 0.1, E([0, 0.2, -4.4], 18, 9.6, [0.05, 1.35, 0.7])]]},
  {ini: T.ouSeja, chaves: [[T.ouSeja, E([0, 1.9, 2.4], 6.4, 4.4, [0, 0.36, 1])], [T.voceAcha - 0.1, E([0, 1.9, 2.4], 6.0, 4.2, [0, 0.36, 1])]]},
  {ini: T.voceAcha, chaves: [[T.voceAcha, E([0, 0.8, 1.6], 20, 11, [0, 0.55, 1])], [T.segue, E([0, 0.4, -0.5], 22, 13, [0, 0.95, 1])], [FIM, E([0, 0, -1.5], 24, 15, [0, 1.3, 0.8])]]},
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
  {a: T.nasDuas, b: T.noSenado, texto: 'MAIORIA NAS DUAS CASAS'},
  {a: T.projetaram, b: T.viraramCamara, texto: 'PROJEÇÃO 1 · CÂMARA'},
  {a: T.viraramCamara, b: T.umaHora, texto: 'CÂMARA: DEMOCRATAS', destaque: true},
  {a: T.segunda, b: T.tambemSenado, texto: 'PROJEÇÃO 2 · SENADO'},
  {a: T.tambemSenado, b: T.n51, texto: 'SENADO: DEMOCRATAS', destaque: true},
  {a: T.senadores, b: T.faltam, texto: 'PELO MENOS 54 DE 100', destaque: true},
  {a: T.faltam, b: T.reacoes, texto: 'FALTAM ALASCA E MISSISSIPPI'},
  {a: T.posse, b: T.tresCoisas, texto: 'POSSE DO NOVO CONGRESSO'},
  {a: T.tresCoisas, b: T.um, texto: 'MUDAM 3 COISAS'},
  {a: T.um, b: T.dois, texto: '1 · LEIS E ORÇAMENTO', destaque: true},
  {a: T.dois, b: T.tres, texto: '2 · INDICAÇÕES', destaque: true},
  {a: T.tres, b: T.masTrump, texto: '3 · INVESTIGAÇÕES', destaque: true},
  {a: T.veto, b: T.ate2029, texto: 'O VETO', destaque: true},
  {a: T.ate2029, b: T.derrubar, texto: 'MANDATO ATÉ 2029'},
  {a: T.derrubar, b: T.naoChegaram, texto: 'DERRUBAR O VETO: 2/3 DAS DUAS CASAS'},
  {a: T.congressoTambem, b: T.voceAcha, texto: 'NINGUÉM GOVERNA SOZINHO', destaque: true},
  {a: T.brasil, b: T.segue, texto: 'E NO BRASIL?', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.n53, b: T.terca, texto: 'SENADO ANTES: 53 × 47 (OS 47 INCLUEM 2 INDEPENDENTES)'},
  {a: T.redes, b: T.madrugada, texto: 'PROJEÇÃO DAS REDES (CBS, NBC, ABC, CNN), NÃO É O RESULTADO OFICIAL'},
  {a: T.madrugada + 0.3, b: T.fazConta, texto: 'SEGUNDO A CBS, 04/11/2026'},
  {a: T.n54, b: T.faltam, texto: 'CONTA DO VÍDEO: 47 + 7 = 54'},
  {a: T.faltam, b: T.reacoes, texto: 'ALASCA E MISSISSIPPI SEM PROJEÇÃO (4H DE 04/11, HORA DE WASHINGTON)'},
  {a: T.trumpDisse, b: T.eAgora, texto: 'TRUMP À CBS, 04/11/2026 · DEMOCRATAS: NBC E CNBC'},
  {a: T.jan3, b: T.tresCoisas, texto: 'CONSTITUIÇÃO DOS EUA, 20ª EMENDA'},
  {a: T.um, b: T.dois, texto: 'CONSTITUIÇÃO DOS EUA, ART. I, SEÇÃO 7'},
  {a: T.dois, b: T.tres, texto: 'CONSTITUIÇÃO DOS EUA, ART. II, SEÇÃO 2'},
  {a: T.investigacoes, b: T.masTrump, texto: 'INVESTIGAÇÕES PROMETIDAS NA CÂMARA · CNBC'},
  {a: T.doisTercos, b: T.ouSeja, texto: 'CONSTITUIÇÃO DOS EUA, ART. I, SEÇÃO 7 · 290 E 67: CONTA DO VÍDEO'},
];
const visivel = (x: Txt, t: number) => entra(t, x.a, 0.45) * (1 - rampa(t, x.b - 0.35, x.b - 0.05));

const Numero: React.FC<{tema: Tema; valor: string; rotulo: string; k: number; cor?: string}> = ({tema, valor, rotulo, k, cor}) =>
  k <= 0.01 ? null : (
    <div style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - Math.min(k, 1)) * 24}px)`, padding: '12px 30px 16px', borderRadius: 24, background: tema.cartao, border: `2px solid ${cor ?? tema.cartaoBorda}`, textAlign: 'center'}}>
      <div style={{fontFamily: FONTE, fontSize: 88, fontWeight: 900, letterSpacing: -3, lineHeight: 1.0, color: cor ?? tema.texto, whiteSpace: 'nowrap'}}>{valor}</div>
      <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: 3, color: tema.textoSuave, marginTop: 6}}>{rotulo}</div>
    </div>
  );

type Rot = {a: number; b: number; p: V3 | ((t: number) => V3); texto: string; acento?: boolean; dy?: number};
const SEN_TOPO = (o: number): V3 => soma(noSenado(o), [0, 0.6, 0]);
const ROTULOS: Rot[] = [
  {a: T.partidoTrump, b: T.primeiro - 0.1, p: [0, 1.9, 1.4], texto: 'TRUMP'},
  {a: T.controle, b: T.euTe, p: soma(CAPITOLIO, [0, 6.6, 0]), texto: 'CONGRESSO DOS EUA'},
  {a: T.partidoTrump2, b: T.nasDuas + 0.3, p: (t) => [0, 1.9, -1.2 + 2.6 * (1 - rampa(t, T.partidoTrump2, T.nasDuas, sai))], texto: 'TRUMP'},
  {a: T.nasDuas, b: T.terca, p: soma(CAMARA, [0, 1.4, -4.6]), texto: 'CÂMARA'},
  {a: T.nasDuas + 0.15, b: T.noSenado + 0.3, p: soma(SENADO, [0, 1.4, -3]), texto: 'SENADO'},
  {a: T.primeiraNoticia + 0.3, b: T.viraramCamara, p: soma(CAMERA_TV, [0, 2.1, 0]), texto: 'AS REDES DE TV'},
  {a: T.faltam + 0.2, b: T.reacoes, p: SEN_TOPO(ABERTAS[0]), texto: 'ALASCA ?', dy: 30},
  {a: T.faltam + 0.4, b: T.reacoes, p: SEN_TOPO(ABERTAS[1]), texto: 'MISSISSIPPI ?', dy: -90},
  {a: T.trumpDisse, b: T.eAgora, p: soma(TRUMP_REACAO, [0, 0.4, 0.6]), texto: 'TRUMP', dy: -60},
  {a: T.demProm, b: T.eAgora, p: soma(DEM_REACAO, [0, 0.4, 0.6]), texto: 'DEMOCRATAS', dy: -60},
  {a: T.leiPassa, b: T.dois - 0.1, p: (t) => soma(curva(DOC_CAMARA, DOC_SENADO, 1.6, rampa(t, T.camaraSenado, T.camaraSenado + 1.3)), [0, 0.5, 0]), texto: 'PROJETO DE LEI'},
  {a: T.orcamento, b: T.dois - 0.1, p: (t) => soma(curva(DOC_CAMARA, DOC_SENADO, 1.6, rampa(t, T.camaraSenado, T.camaraSenado + 1.3)), [1.6, 1.8, 0]), texto: 'ORÇAMENTO', dy: 60},
  {a: T.ministros, b: T.tres, p: soma(FILA[0], [0, 1.6, 0]), texto: 'MINISTRO'},
  {a: T.embaixadores, b: T.tres, p: soma(FILA[1], [0, 1.6, 0]), texto: 'EMBAIXADOR'},
  {a: T.juizes, b: T.tres, p: soma(FILA[2], [0, 1.6, 0]), texto: 'JUIZ DA SUPREMA CORTE'},
  {a: T.peloTrump, b: T.tres, p: soma(TRUMP_FILA, [0, 1.7, 0]), texto: 'TRUMP'},
  {a: T.investigacoes, b: T.masTrump, p: soma(PASTA, [0, 1.0, 0.7]), texto: 'GOVERNO', dy: -40},
  {a: T.masTrump, b: T.derrubar, p: soma(TRUMP_VETO, [0, 0.3, 0.4]), texto: 'TRUMP', dy: -40},
  {a: T.barrar, b: T.derrubar, p: soma(MESA_VETO, [0, 0.9, 0.3]), texto: 'PROJETO DE LEI', dy: -40},
  {a: T.doisTercos, b: T.ouSeja, p: soma(CAMARA, [-2.6, 0.9, -3.4]), texto: '2/3 = 290 DE 435'},
  {a: T.doisTercos + 0.2, b: T.ouSeja, p: soma(SENADO, [1.4, 0.9, -2.6]), texto: '2/3 = 67 DE 100'},
  {a: T.naoGoverna, b: T.voceAcha, p: soma(BALANCA, [-2.2 * ESC_BAL, 2.2 * ESC_BAL, 0]), texto: 'TRUMP', dy: 40},
  {a: T.sozinho, b: T.voceAcha, p: soma(BALANCA, [2.2 * ESC_BAL, 2.2 * ESC_BAL, 0]), texto: 'CONGRESSO', dy: 40},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '7px 16px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 48 ? 15 : s.texto.length > 34 ? 17 : 19, letterSpacing: 1.5, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  if (noMapa(t)) return selo ? seloDe(selo) : null;
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const numeros = [
    {k: vis(t, T.n53, T.terca - 0.3), valor: t < T.n47 ? '53' : '53 × 47', rotulo: 'SENADO ANTES', cor: undefined},
    {k: vis(t, T.n435, T.n35 - 0.3), valor: `${Math.round(435 * rampa(t, T.n435, T.n435 + 1.0))}`, rotulo: 'CADEIRAS EM JOGO NA CÂMARA', cor: undefined},
    {k: vis(t, T.n35, T.aindaNoite - 0.3), valor: '35 / 100', rotulo: 'EM JOGO NO SENADO', cor: undefined},
    {k: vis(t, T.n51, T.madrugada - 0.2), valor: '51', rotulo: 'VOTOS: MAIORIA NO SENADO', cor: tema.acento},
    {k: vis(t, T.de47, T.reacoes - 0.3), valor: t < T.n54 + 0.2 ? '47' : `${47 + Math.round(7 * rampa(t, T.n54 + 0.2, T.n54 + 1.2))}`, rotulo: t < T.n54 ? 'DEMOCRATAS NO SENADO' : 'PELO MENOS, NO SENADO', cor: F.azul},
    {k: vis(t, T.naoChegaram, T.ouSeja - 0.2), valor: '54 < 67', rotulo: 'NÃO CHEGA A 2/3 NO SENADO', cor: undefined},
  ];
  const legendaK = Math.max(vis(t, T.republicanos, T.aindaNoite - 0.2), vis(t, T.fazConta, T.reacoes - 0.2));
  const rotulo = (x: number, y: number, txt: string, k: number, cor: string, key: string) => (
    <div key={key} style={{position: 'absolute', left: Math.max(SEGURO.esq + 160, Math.min(SEGURO.botoesX - 160, x)), top: Math.max(790, Math.min(1170, y)), transform: `translate(-50%, -100%) translateY(${(1 - k) * 10}px)`, opacity: k}}>
      <div style={{padding: '7px 16px 8px', borderRadius: 12, background: tema.cartao, border: `2px solid ${cor}`, fontFamily: FONTE, fontSize: 27, fontWeight: 800, color: tema.texto, whiteSpace: 'nowrap'}}>{txt}</div>
    </div>
  );
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const p = typeof r.p === 'function' ? r.p(t) : r.p;
    const pj = projetar(p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: pj.x, y: pj.y - (r.dy ?? 0), k: Math.min(1, k), txt: r.texto, cor: r.acento ? tema.acento : tema.cartaoBorda};
  }).filter(Boolean) as {i: number; x: number; y: number; k: number; txt: string; cor: string}[];
  for (let a = 0; a < visRot.length; a++) for (let b = 0; b < a; b++) if (Math.abs(visRot[a].x - visRot[b].x) < 360 && Math.abs(visRot[a].y - visRot[b].y) < 58) visRot[a].y = visRot[b].y - 62;
  return (
    <>
      {numeros.map((n, i) => (
        <div key={i} style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 590, display: 'flex', justifyContent: 'center'}}>
          <Numero tema={tema} valor={n.valor} rotulo={n.rotulo} k={n.k} cor={n.cor} />
        </div>
      ))}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 524, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 30 ? 23 : chip.texto.length > 22 ? 27 : 31} />
        </div>
      ) : null}
      {legendaK > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1196, display: 'flex', justifyContent: 'center', gap: 24, opacity: legendaK}}>
          {[
            {c: F.dourado, n: 'REPUBLICANOS'},
            {c: F.azul, n: 'DEMOCRATAS'},
          ].map((x) => (
            <div key={x.n} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 12, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`}}>
              <div style={{width: 20, height: 20, borderRadius: 5, background: x.c}} />
              <div style={{fontFamily: MONO, fontSize: 21, fontWeight: 800, letterSpacing: 2, color: tema.texto}}>{x.n}</div>
            </div>
          ))}
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {selo ? seloDe(selo) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>E NO BRASIL?</div>
            <div style={{fontFamily: FONTE, fontSize: 60, fontWeight: 800, color: tema.acento, marginTop: 8, opacity: 0.5 + 0.5 * rampa(t, T.arroba, T.arroba + 0.4)}}>@eumagnoleite</div>
            <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: tema.textoSuave, marginTop: 8}}>PARA TER MAIS INFORMAÇÕES</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- O mapa do Kit Mapas, por cima do 3D (num OffthreadVideo só) ----------
const TrechoMapa: React.FC<{de: number; ate: number}> = ({de, ate}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/viradas.mp4`)} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.16}));
  s.push({t: T.madrugada - 0.1, f: 'whoosh', v: 0.26});
  s.push({t: T.fazConta - 0.1, f: 'whoosh', v: 0.26});
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.14}));
  s.push({t: T.partidoTrump, f: 'pop', v: 0.2});
  s.push({t: T.perdeu, f: 'baque', v: 0.24});
  s.push({t: T.controle, f: 'subida', v: 0.16});
  for (let i = 0; i < 7; i++) s.push({t: T.naOrdem + i * 0.12, f: 'tique', v: 0.1});
  s.push({t: T.nasDuas, f: 'subida', v: 0.2});
  s.push({t: T.n53, f: 'pop', v: 0.22});
  s.push({t: T.n47, f: 'pop', v: 0.22});
  for (let i = 0; i < 4; i++) s.push({t: T.diaVotar + i * 0.35 + 0.5, f: 'pop', v: 0.1});
  s.push({t: T.n435, f: 'subida', v: 0.24});
  s.push({t: T.n35, f: 'pop', v: 0.2});
  s.push({t: T.primeiraNoticia, f: 'pop', v: 0.18});
  s.push({t: T.viraramCamara, f: 'subida', v: 0.24});
  s.push({t: T.umaHora + 0.1, f: 'tique', v: 0.2});
  s.push({t: T.tambemSenado, f: 'subida', v: 0.24});
  s.push({t: T.n51, f: 'pop', v: 0.22});
  s.push({t: T.n54 + 0.2, f: 'subida', v: 0.24});
  s.push({t: T.faltam, f: 'pop', v: 0.18});
  s.push({t: T.trumpDisse, f: 'pop', v: 0.18});
  s.push({t: T.senao, f: 'baque', v: 0.2});
  s.push({t: T.demProm, f: 'pop', v: 0.18});
  s.push({t: T.jan3, f: 'pop', v: 0.22});
  for (let i = 0; i < 3; i++) s.push({t: T.tresCoisas + i * 0.25, f: 'tique', v: 0.16});
  s.push({t: T.leiPassa, f: 'pop', v: 0.18});
  s.push({t: T.camaraSenado, f: 'whoosh', v: 0.16});
  s.push({t: T.orcamento, f: 'pop', v: 0.18});
  [T.ministros, T.embaixadores, T.juizes].forEach((x) => s.push({t: x, f: 'pop', v: 0.16}));
  s.push({t: T.simSenado, f: 'tique', v: 0.18});
  s.push({t: T.investigacoes, f: 'pop', v: 0.16});
  s.push({t: T.veto, f: 'impacto', v: 0.24});
  s.push({t: T.barrar + 0.3, f: 'baque', v: 0.26});
  s.push({t: T.doisTercos, f: 'subida', v: 0.18});
  s.push({t: T.naoChegaram, f: 'baque', v: 0.22});
  s.push({t: T.sozinho + 0.45, f: 'pop', v: 0.18});
  s.push({t: T.congressoTambem, f: 'ding', v: 0.22});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.6, T.perdeu + 0.6, T.controle + 0.8, T.naOrdem + 0.8, T.nasDuas + 0.7, T.n47 + 0.6, T.diaVotar + 0.8, T.n435 + 1.0, T.n35 + 0.8,
  T.redes + 0.5, T.viraramCamara + 0.9, T.umaHora + 0.6, T.n51 + 0.5, T.madrugada + 3.0, T.madrugada + 6.6, T.fazConta + 0.6, T.n54 + 1.2, T.faltam + 0.7,
  T.trumpDisse + 0.5, T.senao + 0.8, T.custo + 0.5, T.jan3 + 0.5, T.tresCoisas + 0.8, T.camaraSenado + 0.7, T.orcamento + 0.6, T.juizes + 0.6, T.simSenado + 0.4,
  T.investigacoes + 0.6, T.veto + 0.4, T.barrar + 0.7, T.doisTercos + 0.6, T.naoChegaram + 0.5, T.naoGoverna + 0.6, T.congressoTambem + 0.5, T.brasil + 0.3, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const MidtermsResultado: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={24} centro={[0, 0, -2]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} />
    </ThreeCanvas>
  );
  const mapa = (
    <Sequence from={MAPA.de} durationInFrames={MAPA.ate - MAPA.de} layout="none">
      <TrechoMapa {...MAPA} />
    </Sequence>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}{mapa}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      {mapa}
      <Interface t={t} tema={tema} cam={cam} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Resultado nos EUA" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Trump perdeu', 'o Congresso.', 'O que muda', 'agora?'];
export const CapaMidtermsResultado: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 470}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · RESULTADO NOS EUA`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 126, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
