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
import {Balanca, CaixaCorreio, CalendarioGrande, Carta, IconeBalao, Lua, OrgaoPublico, Prancheta, RelogioPonto, Urna} from '../../pecas';
import {PlacaChao} from '../demissaovoto/pecas';
import {PilhaVotos} from '../distritalmisto/pecas';
import {Capitolio, CedulaGrande, N_CAMARA, PlacarCasa, PlaquinhaRegra, PlenarioEua, UrnaPapel} from './pecas';
import {PALAVRAS} from './palavras';

// 015. eleição nos eua (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta o vídeo numa "mesa da comparação" (lado esquerdo LÁ · EUA, lado direito AQUI · BRASIL)
// e encaixa três trechos de mapa do Kit Mapas Animados (projetos/015.../mapas/eua.mp4, composição
// EleicaoEua do kit): o que está em jogo (Senado e governadores), os 435 distritos e o Brasil proporcional.
// Ninguém real com rosto: o Trump é um boneco genérico com etiqueta; os partidos aparecem só pelo nome,
// em dois tons neutros. Plano: projetos/015. eleição nos eua/plano.md (versão 1, aprovada em 02/11/2026).

export const FPS = 30;
const AUDIO_SEG = 101.17;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '015. eleição nos eua';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  hoje: quando('Hoje os Estados'),
  urnas: quando('as urnas'),
  trumpNem: quando('o Trump nem'),
  cedula: quando('na cedula'),
  laPres: quando('La, o presidente'),
  quatro: quando('fica quatro'),
  meio: quando('bem no meio'),
  midterms: quando('midterms'),
  congresso1: quando('manda no Congresso'),
  naCamara: quando('Na Camara'),
  n435: quando('as 435'),
  doisAnos: quando('so dois anos'),
  senado: quando('No Senado, sao'),
  ateAgora: quando('Ate agora'),
  republicanos: quando('republicanos'),
  partidoTrump: quando('partido do Trump'),
  maioria: quando('maioria nas'),
  n53: quando('53'),
  n47: quando('47'),
  democratas: quando('os democratas'),
  trumpPassa: quando('o Trump passa'),
  dividido: quando('Congresso dividido'),
  comoElege: quando('E como se elege'),
  repara: quando('Agora repara'),
  naoPara: quando('E nao para'),
  laEleicao: quando('La, a eleicao'),
  diaNormal: quando('dia normal'),
  aquiSempre: quando('Aqui, e sempre'),
  domingo: quando('domingo'),
  laVoto: quando('La, o voto'),
  naoObrig: quando('nao e obrigatorio'),
  registrar: quando('se registrar'),
  aquiDos: quando('Aqui, dos'),
  n18: quando('18'),
  n70: quando('70'),
  obrigacao: quando('obrigacao'),
  laCada: quando('La, cada'),
  suaRegra: quando('faz a sua regra'),
  correio: quando('pelo correio'),
  antes: quando('antes do dia'),
  papel: quando('cedula de papel'),
  dias: quando('levar dias'),
  aquiRegra: quando('Aqui, a regra'),
  umaSo: quando('e uma so'),
  tse: quando('o TSE'),
  urnaEl: quando('urna e eletronica'),
  noite: quando('mesma noite'),
  brNaoTem: quando('o Brasil nao tem'),
  aCada: quando('A cada quatro'),
  presidente2: quando('de presidente'),
  umaVez: quando('de uma vez'),
  doisDepois: quando('Dois anos depois'),
  prefeito: quando('prefeito'),
  vereador: quando('vereador'),
  entao: quando('Entao, hoje'),
  naoEscolhem: quando('nao escolhem'),
  umCongresso: quando('um Congresso'),
  favor: quando('a favor'),
  contra: quando('ou contra'),
  proximos: quando('proximos dois'),
  qual: quando('Qual sistema'),
  deles: quando('o deles'),
  nosso: quando('o nosso'),
  comentarios: quando('comentarios'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};
// a terça-feira: a palavra vem logo depois de "numa"
const TERCA = quando('numa', 1) + 0.12;

const ESTADOS: [number, string][] = [
  [0, 'HOJE NOS EUA'],
  [T.laPres, 'MIDTERMS'],
  [T.naCamara, '435 CADEIRAS'],
  [T.senado, 'SENADO E GOVERNOS'],
  [T.ateAgora, 'QUEM MANDA'],
  [T.comoElege, 'COMO SE ELEGE LÁ'],
  [T.repara, 'COMO SE ELEGE AQUI'],
  [T.naoPara, 'LÁ × AQUI'],
  [T.laCada, 'A CONTAGEM'],
  [T.brNaoTem, 'NO BRASIL'],
  [T.entao, 'O QUE DECIDEM'],
  [T.qual, 'E VOCÊ?'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const MAPA_A = {de: q(T.senado), ate: q(T.ateAgora), origem: 0};
const MAPA_BC = {de: q(T.comoElege), ate: q(T.naoPara), origem: 157};
const noMapa = (t: number) => (t >= T.senado && t < T.ateAgora) || (t >= T.comoElege && t < T.naoPara);

// ---------- Mapa do mundo (esquerda = EUA, direita = Brasil) ----------
const CONGRESSO: V3 = [-6, 0, -14];
const PLEN: V3 = [-3, 0, -5.5];
const URNA_EUA: V3 = [-3, 0, 2.2];
const TRUMP: V3 = [-1.7, 0, 2.6];
const CEDULA: V3 = [-4.5, 0, 2.0];
const LINHA_EUA: number[] = [-5.4, -4.0, -2.6, -1.2];
const CASA: V3 = [-4.0, 0, 1.8];
const SENADO: V3 = [-2.2, 0, 1.8];
const CAL_EUA: V3 = [-3.2, 0, 1.6];
const PONTO: V3 = [-4.9, 0, 1.4];
const CAL_BR: V3 = [3.2, 0, 1.6];
const CORREIO: V3 = [-4.7, 0, 1.6];
const PILHA: V3 = [-3.1, 0, 2.0];
const CONTA: V3 = [-1.6, 0, 1.4];
const URNA_BR: V3 = [3.0, 0, 2.0];
const TSE: V3 = [5.6, 0, -2.6];
const BALANCA: V3 = [-3.0, 0, 1.9];
const PLACA_EUA: V3 = [-5.9, 0, 0.2];
const PLACA_BR: V3 = [5.9, 0, 0.2];

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const janela = (t: number, a: number, b: number, d = 0.4) => rampa(t, a, a + d) * (1 - rampa(t, b, b + d));
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const corR = F.dourado;
  const corD = F.azul;
  // Plenário: as 435 cadeiras acendem em onda em "435"; no placar, viram as duas cores
  const corCadeira = (o: number): string => {
    const base = tema.objetoEscuro;
    const onda = rampa(t, T.n435 + (o / N_CAMARA) * 1.0, T.n435 + (o / N_CAMARA) * 1.0 + 0.25) * (1 - rampa(t, T.senado, T.senado + 0.4));
    const partido = janela(t, T.republicanos, T.comoElege, 0.6);
    const vira = rampa(t, T.democratas, T.democratas + 1.2);
    const limite = Math.round(N_CAMARA * (0.51 - 0.04 * vira));
    const lado = o < limite ? corR : corD;
    return mistura(mistura(base, tema.acento, onda), lado, 0.75 * partido);
  };
  const sobe = (o: number) => pulso(t, T.n435 + (o / N_CAMARA) * 1.0, 0.6) * (t < T.senado ? 1 : 0);
  // Cena 1
  const c1 = vis(t, 0, T.laPres + 0.2);
  const cheia = rampa(t, T.urnas, T.urnas + 1.2);
  const trumpK = Math.max(vis(t, T.trumpNem, T.laPres + 0.2), vis(t, T.partidoTrump, T.dividido + 0.4), vis(t, T.entao + 0.3, T.qual));
  const cedK = Math.max(vis(t, T.cedula - 0.3, T.laPres + 0.2), vis(t, T.entao, T.qual));
  const xK = Math.max(rampa(t, T.cedula + 0.3, T.cedula + 0.7) * (t < T.laPres + 0.6 ? 1 : 0), rampa(t, T.naoEscolhem, T.naoEscolhem + 0.4) * (t > T.entao ? 1 : 0));
  // Cena 2
  const linhaK = (i: number) => entra(t, T.quatro + i * 0.16, 0.4) * (1 - rampa(t, T.naCamara, T.naCamara + 0.4));
  // Cena 4
  const placarK = vis(t, T.ateAgora, T.comoElege - 0.2);
  const altR = 1.0 + 0.3 * rampa(t, T.republicanos, T.republicanos + 0.8);
  const vira = rampa(t, T.democratas, T.democratas + 1.0);
  const casaR = altR - 0.3 * vira;
  const casaD = 1.0 + 0.2 * rampa(t, T.maioria, T.maioria + 0.6) + 0.35 * vira;
  const senR = 1.0 + 0.27 * rampa(t, T.n53, T.n53 + 0.6);
  const senD = 1.0 + 0.13 * rampa(t, T.n47, T.n47 + 0.6);
  // Cena 5
  const c5 = vis(t, T.naoPara, T.laCada);
  const calEua = entra(t, TERCA, 0.45) * c5;
  const pontoK = entra(t, T.diaNormal, 0.45) * c5;
  const calBr = entra(t, T.domingo - 0.2, 0.45) * c5;
  const opcional = entra(t, T.naoObrig, 0.45) * c5;
  const pranchaK = entra(t, T.registrar - 0.2, 0.45) * c5;
  const obrigK = entra(t, T.aquiDos, 0.45) * c5;
  // Cena 6
  const c6 = vis(t, T.laCada, T.brNaoTem);
  const regras = ['A', 'B', 'C', 'D', 'E', 'F'];
  const regrasK = (i: number) => entra(t, T.suaRegra + i * 0.12, 0.4) * (1 - rampa(t, T.correio, T.correio + 0.4));
  const correioK = entra(t, T.correio - 0.2, 0.45) * c6;
  const pilhaK = rampa(t, T.papel - 0.2, T.papel + 1.0);
  const contaTxt = t < T.dias + 0.5 ? '1 DIA' : t < T.dias + 1.0 ? '2 DIAS' : '3 DIAS';
  const contaK = entra(t, T.dias - 0.1, 0.45) * c6;
  const urnaBr = entra(t, T.urnaEl - 0.1, 0.45) * c6;
  const unica = entra(t, T.umaSo, 0.45) * c6;
  const tseSobe = rampa(t, T.tse - 0.2, T.tse + 0.6) * (1 - rampa(t, T.entao, T.entao + 0.5)) + rampa(t, T.qual, T.qual + 0.6);
  const luaK = entra(t, T.noite - 0.1, 0.5) * c6;
  // Cena 7
  const c7 = vis(t, T.brNaoTem, T.entao);
  const cargos = [
    {txt: 'PRESIDENTE', x: 0.9},
    {txt: 'GOVERNADOR', x: 1.8},
    {txt: 'SENADOR', x: 2.7},
    {txt: 'DEPUTADO', x: 3.6},
  ];
  const junta = rampa(t, T.umaVez, T.umaVez + 0.6);
  // Cena 8
  const balK = vis(t, T.umCongresso - 0.2, T.qual);
  const inclina = 0.3 * rampa(t, T.favor, T.favor + 0.4) - 0.6 * rampa(t, T.contra, T.contra + 0.5) + 0.3 * rampa(t, T.proximos, T.proximos + 0.6);
  // Placas LÁ / AQUI acendem no lado que está sendo falado
  const ladoEua = Math.max(janela(t, 0, T.repara), janela(t, T.laEleicao, T.aquiSempre - 0.1), janela(t, T.laVoto, T.aquiDos - 0.1), janela(t, T.laCada, T.aquiRegra - 0.1), janela(t, T.entao, T.qual), janela(t, T.deles, T.nosso - 0.1));
  const ladoBr = Math.max(janela(t, T.repara, T.naoPara), janela(t, T.aquiSempre, T.laVoto - 0.1), janela(t, T.aquiDos, T.laCada - 0.1), janela(t, T.aquiRegra, T.entao), janela(t, T.nosso, FIM));

  return (
    <group>
      {/* A mesa: faixa do meio e as duas placas */}
      <Caixa args={[0.1, 0.03, 22]} raio={0.012} cor={tema.objeto} emissivo={0.1} position={[0, 0.03, -3]} />
      <PlacaChao tema={tema} pos={PLACA_EUA} escala={1.3} texto="EUA" aceso={ladoEua} />
      <PlacaChao tema={tema} pos={PLACA_BR} escala={1.3} texto="BRASIL" aceso={ladoBr} />

      {/* Fundo: Congresso dos EUA e a Câmara */}
      <Capitolio tema={tema} pos={CONGRESSO} escala={1.15} aceso={Math.max(janela(t, T.congresso1, T.naCamara, 0.5), janela(t, T.trumpPassa, T.comoElege, 0.5), janela(t, T.umCongresso, T.qual, 0.5))} />
      <PlenarioEua tema={tema} pos={PLEN} escala={1} cor={corCadeira} sobe={sobe} />
      <OrgaoPublico tema={tema} pos={TSE} escala={1.0} sobe={Math.min(1, tseSobe)} letreiro={rampa(t, T.tse, T.tse + 0.5)} texto="TSE" />

      {/* Cena 1: a urna de papel, o boneco TRUMP e a cédula sem presidente */}
      <UrnaPapel tema={tema} pos={URNA_EUA} rotY={-0.2} escala={1.1 * entra(t, T.urnas - 0.4, 0.5) * c1} cheia={cheia} />
      {cheia > 0.02 && cheia < 0.98 && c1 > 0.5
        ? [0, 1, 2].map((i) => {
            const k = rampa(t, T.urnas + i * 0.35, T.urnas + i * 0.35 + 0.6);
            if (k <= 0 || k >= 1) return null;
            return (
              <group key={i} position={curva([-3.6 + i * 0.5, 2.4, 3.6], soma(URNA_EUA, [0, 1.2, 0]), 0.5, k)} rotation={[0.4, i, 0.2]}>
                <Caixa args={[0.34, 0.01, 0.24]} raio={0.004} cor={tema.objetoClaro} sombra={false} />
              </group>
            );
          })
        : null}
      {trumpK > 0.02 ? <Boneco tema={tema} pos={t > T.entao ? [-1.4, 0, 2.7] : t > T.ateAgora ? [-0.8, 0, 2.3] : TRUMP} rotY={t > T.ateAgora && t < T.comoElege ? -0.7 : -0.5} escala={0.85 * trumpK} cor={tema.pessoa} pose={{ombroD: [0, 0, 0.3], ombroE: [0, 0, -0.3]}} /> : null}
      <CedulaGrande tema={tema} pos={t > T.entao ? [-4.6, 0, 2.2] : CEDULA} rotY={0.35} escala={1.0 * cedK} linhas={['CÂMARA', 'SENADO', 'GOVERNADOR', 'PRESIDENTE']} vazia={3} x={xK} marcadas={t > T.entao ? 0 : 3 * rampa(t, T.cedula - 0.2, T.cedula + 0.4)} />

      {/* Cena 2: o mandato de 4 anos, com 2026 no meio */}
      {['2025', '2026', '2027', '2028'].map((ano, i) => (
        <PlacaChao key={ano} tema={tema} pos={[LINHA_EUA[i], 0, 3.6]} escala={0.95 * linhaK(i)} texto={ano} aceso={i === 1 ? rampa(t, T.meio, T.meio + 0.5) : 0} />
      ))}

      {/* Cena 4: o placar das duas casas */}
      <PlacarCasa tema={tema} pos={CASA} escala={1.0 * placarK} casa="CÂMARA" a={casaR} b={casaD} corA={corR} corB={corD} />
      <PlacarCasa tema={tema} pos={SENADO} escala={1.0 * placarK} casa="SENADO" a={senR} b={senD} corA={corR} corB={corD} />

      {/* Cena 5: terça × domingo, opcional × obrigatório */}
      <CalendarioGrande tema={tema} pos={CAL_EUA} rotY={0.15} texto="TERÇA" sub="3 DE NOVEMBRO" folha={rampa(t, TERCA, TERCA + 0.5)} escala={1.0 * calEua} />
      <RelogioPonto tema={tema} pos={PONTO} rotY={0.4} escala={1.0 * pontoK} visor={rampa(t, T.diaNormal, T.diaNormal + 0.5)} />
      {pontoK > 0.02
        ? [0, 1, 2].map((i) => {
            const a = T.diaNormal + i * 0.35;
            const k = rampa(t, a, a + 2.4, (x) => x);
            if (k <= 0 || k >= 1) return null;
            return <Boneco key={i} tema={tema} pos={[-6.2 + 5.0 * k, 0, 3.4 + i * 0.35]} rotY={Math.PI / 2} escala={0.55 * c5} cor={tema.pessoa} pose={{passo: Math.sin((t - a) * 9)}} />;
          })
        : null}
      <CalendarioGrande tema={tema} pos={CAL_BR} rotY={-0.15} texto="DOMINGO" sub="DIA DE ELEIÇÃO" folha={rampa(t, T.domingo - 0.2, T.domingo + 0.3)} escala={1.0 * calBr} destaque={rampa(t, T.domingo, T.domingo + 0.4)} />
      <PlacaChao tema={tema} pos={[-1.6, 0, 2.9]} escala={1.0 * opcional} texto="OPCIONAL" aceso={0} />
      <group position={[-4.3, 0.95, 2.8]}>
        <Caixa args={[0.9, 0.06, 0.6]} raio={0.02} cor={tema.objeto} position={[0, -0.03, 0]} scale={pranchaK > 0.02 ? 1 : 0.01} />
        {pranchaK > 0.02 ? <Caixa args={[0.08, 0.92, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0, -0.5, 0]} /> : null}
        <Prancheta tema={tema} pos={[0, 0.02, 0]} rot={[-Math.PI / 2 + 0.2, 0, 0]} escala={0.9 * pranchaK} carimbo={rampa(t, T.registrar + 0.3, T.registrar + 0.6)} corCarimbo={tema.acento} linhas={1} />
      </group>
      <PlacaChao tema={tema} pos={[1.7, 0, 2.9]} escala={1.0 * obrigK} texto="OBRIGATÓRIO" aceso={rampa(t, T.obrigacao, T.obrigacao + 0.4)} />

      {/* Cena 6: cada estado com a sua regra, correio, papel e dias × regra única, urna eletrônica, mesma noite */}
      {regras.map((r, i) => {
        const ang = -0.9 + i * 0.36;
        return <PlaquinhaRegra key={r} tema={tema} pos={[-3 + Math.sin(ang) * 1.9, 0, 2.2 + Math.cos(ang) * 0.9]} rotY={ang * 0.5} escala={1.25 * regrasK(i) * c6} texto={`REGRA ${r}`} />;
      })}
      <CaixaCorreio tema={tema} pos={CORREIO} rotY={0.5} escala={1.5 * correioK} bandeira={rampa(t, T.correio + 0.6, T.correio + 1.0)} />
      {correioK > 0.5
        ? [0, 1, 2].map((i) => {
            const k = rampa(t, T.correio + i * 0.3, T.correio + i * 0.3 + 0.9);
            if (k <= 0 || k >= 1) return null;
            return <Carta key={i} tema={tema} pos={curva([-6.4 + i * 0.3, 2.6, 4.2], soma(CORREIO, [0, 1.1, 0]), 0.6, k)} rot={[0.3, 0.6 + i, 0.2]} escala={0.7} />;
          })
        : null}
      <PilhaVotos tema={tema} pos={PILHA} blocos={9 * pilhaK} escala={1.2 * c6 * (pilhaK > 0 ? 1 : 0)} />
      <CalendarioGrande tema={tema} pos={CONTA} rotY={-0.25} texto={contaTxt} sub="CONTAGEM" folha={1} escala={0.9 * contaK} />
      <PlacaChao tema={tema} pos={[1.9, 0, 2.7]} escala={1.1 * unica} texto="REGRA ÚNICA" aceso={rampa(t, T.umaSo, T.umaSo + 0.4)} />
      <Urna tema={tema} pos={URNA_BR} rotY={-0.25} escala={1.0 * urnaBr} />
      <Lua tema={tema} pos={[2.6, 3.4, -0.6]} escala={0.9 * luaK} />

      {/* Cena 7: no Brasil, de 4 em 4 anos */}
      <PlacaChao tema={tema} pos={[2.25, 0, 1.2]} escala={1.0 * entra(t, T.aCada, 0.45) * c7} texto="2026" aceso={rampa(t, T.umaVez, T.umaVez + 0.4)} />
      <PlacaChao tema={tema} pos={[5.4, 0, 1.2]} escala={1.0 * entra(t, T.doisDepois, 0.45) * c7} texto="2028" aceso={0} />
      {cargos.map((c, i) => {
        const k = entra(t, T.presidente2 + i * 0.2, 0.4) * c7;
        const x = c.x + (2.25 - c.x) * 0.12 * junta;
        return <PlaquinhaRegra key={c.txt} tema={tema} pos={[x, 0, 2.9 - 0.4 * junta]} escala={1.35 * k} texto={c.txt} />;
      })}
      <PlaquinhaRegra tema={tema} pos={[5.0, 0, 2.9]} escala={1.35 * entra(t, T.prefeito, 0.4) * c7} texto="PREFEITO" />
      <PlaquinhaRegra tema={tema} pos={[5.9, 0, 2.9]} escala={1.35 * entra(t, T.vereador, 0.4) * c7} texto="VEREADOR" />

      {/* Cena 8: a favor ou contra, sem tomar lado */}
      <Balanca tema={tema} pos={BALANCA} escala={0.62 * balK} inclina={inclina} brilhoEsq={0.3 * janela(t, T.favor, T.contra, 0.3)} brilhoDir={0.3 * janela(t, T.contra, T.proximos, 0.3)} />

      {/* Fim */}
      <IconeBalao pos={[0, 2.6, 4.4]} cor={tema.acento} escala={1.0 * entra(t, T.comentarios, 0.45)} />
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
const LA = (z = 0) => E([-3.2, 0.9, 2.0 + z], 4.6, 3.2, [0.05, 0.3, 1]);
const AQUI = (z = 0) => E([2.6, 0.9, 2.0 + z], 4.4, 3.2, [-0.05, 0.3, 1]);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([-3.0, 1.1, 2.4], 6.4, 4.4, [0.2, 0.6, 1])], [T.cedula, E([-3.3, 1.1, 2.3], 5.2, 3.8, [0.1, 0.35, 1])], [T.laPres - 0.2, E([-3.3, 1.1, 2.3], 5.0, 3.6, [0.12, 0.33, 1])]]},
  {ini: T.laPres - 0.1, chaves: [[T.laPres - 0.1, E([-3.3, 1.0, 3.6], 6.4, 3.6, [0, 0.35, 1])], [T.midterms, E([-3.6, 1.0, 3.6], 5.8, 3.4, [0.05, 0.33, 1])], [T.congresso1, E([-6, 3.0, -14], 12.5, 7.2, [0.1, 0.25, 1])], [T.naCamara - 0.3, E([-6, 3.0, -14], 12, 7, [0.14, 0.25, 1])]]},
  {ini: T.naCamara - 0.1, chaves: [[T.naCamara - 0.1, E([-3, 0.6, -6.2], 8.6, 5.2, [0, 0.85, 0.8])], [T.senado - 0.3, E([-3, 0.6, -6.2], 8.0, 5.0, [0.15, 0.8, 0.9])]]},
  {ini: T.senado, chaves: [[T.senado, E([-3, 0.6, -6.2], 8.0, 5.0, [0.15, 0.8, 0.9])], [T.ateAgora - 0.2, E([-3, 0.6, -6.2], 8.0, 5.0, [0.15, 0.8, 0.9])]]},
  {
    ini: T.ateAgora - 0.1,
    chaves: [
      [T.ateAgora - 0.1, E([-2.6, 1.2, 2.0], 5.8, 3.8, [0.05, 0.3, 1])],
      [T.democratas, E([-2.9, 1.2, 2.0], 5.2, 3.6, [0.08, 0.3, 1])],
      [T.dividido, E([-3.4, 1.8, -2], 9.5, 6.5, [0.05, 0.4, 1])],
      [T.comoElege - 0.3, E([-3.4, 1.8, -2], 9.2, 6.3, [0.07, 0.4, 1])],
    ],
  },
  {ini: T.comoElege, chaves: [[T.comoElege, E([0, 1, 1.6], 11, 5, [0, 0.45, 1])], [T.naoPara - 0.2, E([0, 1, 1.6], 11, 5, [0, 0.45, 1])]]},
  {
    ini: T.naoPara - 0.1,
    arco: 0.03,
    chaves: [
      [T.naoPara - 0.1, E([0, 1, 2.0], 11.5, 5.2, [0, 0.45, 1])],
      [TERCA - 0.2, LA()],
      [T.aquiSempre - 0.3, LA(0.2)],
      [T.aquiSempre + 0.3, AQUI()],
      [T.laVoto - 0.2, AQUI(0.2)],
      [T.laVoto + 0.3, LA(0.4)],
      [T.aquiDos - 0.2, LA(0.6)],
      [T.aquiDos + 0.3, AQUI(0.4)],
      [T.laCada - 0.3, AQUI(0.6)],
    ],
  },
  {
    ini: T.laCada - 0.1,
    arco: 0.03,
    chaves: [
      [T.laCada - 0.1, LA(0.2)],
      [T.aquiRegra - 0.3, LA(0)],
      [T.aquiRegra + 0.3, AQUI(0.2)],
      [T.tse + 0.1, E([3.8, 1.5, 0.6], 6.4, 5.0, [-0.05, 0.3, 1])],
      [T.brNaoTem - 0.3, E([3.8, 1.6, 0.6], 6.2, 5.0, [-0.08, 0.3, 1])],
    ],
  },
  {ini: T.brNaoTem - 0.1, chaves: [[T.brNaoTem - 0.1, E([2.6, 1.0, 2.4], 5.0, 3.4, [0, 0.32, 1])], [T.umaVez, E([2.5, 1.0, 2.4], 4.8, 3.3, [0, 0.32, 1])], [T.doisDepois, E([4.4, 1.0, 2.4], 5.4, 3.4, [0, 0.32, 1])], [T.entao - 0.3, E([4.4, 1.0, 2.4], 5.2, 3.3, [0.05, 0.32, 1])]]},
  {ini: T.entao - 0.1, chaves: [[T.entao - 0.1, E([-3.0, 1.4, 1.2], 6.4, 4.6, [0, 0.3, 1])], [T.umCongresso, E([-3.0, 1.5, 1.6], 5.2, 4.0, [0, 0.28, 1])], [T.qual - 0.3, E([-3.0, 1.5, 1.6], 5.0, 3.8, [0.07, 0.28, 1])]]},
  {ini: T.qual - 0.1, chaves: [[T.qual - 0.1, E([0, 1.2, 3.0], 11, 6, [0, 0.45, 1])], [T.segue, E([0, 1.2, 1.0], 13, 8, [0, 0.5, 1])], [FIM, E([0, 1, -3], 17, 11, [0, 0.6, 1])]]},
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
  {a: T.trumpNem, b: T.laPres, texto: 'NÃO É PARA PRESIDENTE'},
  {a: T.quatro, b: T.midterms, texto: 'MANDATO DO PRESIDENTE: 4 ANOS'},
  {a: T.midterms, b: T.congresso1, texto: 'MIDTERMS: MEIO DE MANDATO', destaque: true},
  {a: T.congresso1, b: T.naCamara, texto: 'DECIDE O CONGRESSO'},
  {a: T.doisAnos, b: T.senado, texto: 'DEPUTADO: MANDATO DE 2 ANOS', destaque: true},
  {a: T.maioria, b: T.n53, texto: 'MAIORIA NAS DUAS CASAS'},
  {a: T.democratas, b: T.dividido, texto: 'SE OS DEMOCRATAS VIRAREM UMA'},
  {a: T.dividido, b: T.comoElege, texto: 'CONGRESSO DIVIDIDO', destaque: true},
  {a: TERCA, b: T.aquiSempre, texto: 'LÁ: TERÇA, DIA DE TRABALHO'},
  {a: T.aquiSempre, b: T.laVoto, texto: 'AQUI: SEMPRE NO DOMINGO', destaque: true},
  {a: T.naoObrig, b: T.registrar, texto: 'LÁ: VOTA QUEM QUER'},
  {a: T.registrar, b: T.aquiDos, texto: 'PRECISA SE REGISTRAR ANTES'},
  {a: T.obrigacao, b: T.laCada, texto: 'AQUI: VOTO OBRIGATÓRIO', destaque: true},
  {a: T.suaRegra, b: T.correio, texto: 'CADA ESTADO, UMA REGRA'},
  {a: T.correio, b: T.papel, texto: 'PELO CORREIO OU ANTES DO DIA'},
  {a: T.papel, b: T.dias, texto: 'CÉDULA DE PAPEL'},
  {a: T.dias, b: T.aquiRegra, texto: 'CONTAGEM PODE LEVAR DIAS'},
  {a: T.umaSo, b: T.tse, texto: 'AQUI: UMA REGRA SÓ'},
  {a: T.tse, b: T.urnaEl, texto: 'O TSE ORGANIZA TUDO'},
  {a: T.urnaEl, b: T.noite, texto: 'URNA ELETRÔNICA'},
  {a: T.noite, b: T.brNaoTem, texto: 'RESULTADO NA MESMA NOITE', destaque: true},
  {a: T.brNaoTem, b: T.aCada, texto: 'AQUI NÃO TEM MIDTERM'},
  {a: T.aCada, b: T.umaVez, texto: 'DE 4 EM 4 ANOS'},
  {a: T.umaVez, b: T.doisDepois, texto: '2026: TUDO DE UMA VEZ', destaque: true},
  {a: T.doisDepois, b: T.entao, texto: '2028: PREFEITO E VEREADOR'},
  {a: T.naoEscolhem, b: T.umCongresso, texto: 'NÃO É PARA PRESIDENTE'},
  {a: T.umCongresso, b: T.qual, texto: 'CONGRESSO A FAVOR OU CONTRA?', destaque: true},
  {a: T.qual, b: T.segue, texto: 'O DELES OU O NOSSO?', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.hoje + 0.3, b: T.trumpNem, texto: '3 DE NOVEMBRO DE 2026'},
  {a: T.senado + 0.6, b: T.ateAgora, texto: '35 VAGAS: 33 REGULARES E 2 ESPECIAIS', y: 470},
  {a: T.n53, b: T.democratas, texto: 'OS 47 INCLUEM 2 INDEPENDENTES · FOX NEWS E KALSHI'},
  {a: T.democratas + 0.3, b: T.comoElege, texto: 'SIMULAÇÃO'},
  {a: T.comoElege + 2.4, b: T.repara, texto: 'DISTRITOS DO CENSO DOS EUA · 119º CONGRESSO', y: 470},
  {a: T.repara + 2.0, b: T.naoPara, texto: 'BAHIA · 39 DEPUTADOS FEDERAIS', y: 470},
  {a: T.aquiDos, b: T.laCada, texto: 'CONSTITUIÇÃO · ART. 14'},
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
  {a: T.trumpNem, b: T.laPres, p: soma(TRUMP, [0, 1.8, 0]), texto: 'TRUMP'},
  {a: T.congresso1, b: T.naCamara, p: soma(CONGRESSO, [0, 6.8, 0]), texto: 'CONGRESSO DOS EUA'},
  {a: T.partidoTrump, b: T.democratas, p: [-0.8, 1.8, 2.3], texto: 'TRUMP'},
  {a: T.entao + 0.3, b: T.qual, p: [-1.4, 1.8, 2.7], texto: 'TRUMP', dy: 30},
  {a: T.favor, b: T.qual, p: soma(BALANCA, [-1.2, 1.4, 0]), texto: 'A FAVOR', dy: 80},
  {a: T.contra, b: T.qual, p: soma(BALANCA, [1.2, 1.4, 0]), texto: 'CONTRA', dy: 80},
];

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const F = tema.festa ?? ESCURO.festa!;
  const seloDe = (s: Txt) => (
    <div style={{position: 'absolute', left: SEGURO.esq, right: s.y ? W - SEGURO.dir : W - SEGURO.botoesX, top: s.y ?? 1250, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(s, t))}}>
      <div style={{padding: '8px 18px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`, fontFamily: MONO, fontSize: s.texto.length > 40 ? 16 : 19, letterSpacing: 2, color: tema.textoSuave, whiteSpace: 'nowrap'}}>{s.texto}</div>
    </div>
  );
  const selo = SELOS.filter((s) => t >= s.a && visivel(s, t) > 0.01).pop();
  if (noMapa(t)) return selo ? seloDe(selo) : null;
  const chip = CHIPS.filter((c) => t >= c.a - 0.05 && visivel(c, t) > 0.01).pop();
  const k435 = entra(t, T.n435, 0.45) * (1 - rampa(t, T.doisAnos - 0.3, T.doisAnos));
  const n435 = Math.round(435 * rampa(t, T.n435, T.n435 + 1.0));
  const k53 = entra(t, T.n53, 0.45) * (1 - rampa(t, T.democratas - 0.3, T.democratas));
  const k18 = entra(t, T.n18, 0.45) * (1 - rampa(t, T.obrigacao - 0.3, T.obrigacao));
  const legendaK = vis(t, T.republicanos, T.comoElege - 0.3);
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
        {k: k435, valor: `${n435}`, rotulo: 'CADEIRAS EM JOGO', cor: tema.acento},
        {k: k53, valor: '53 × 47', rotulo: 'SENADO HOJE'},
        {k: k18, valor: t < T.n70 ? '18' : '18 A 70', rotulo: 'ANOS: VOTO OBRIGATÓRIO', cor: tema.acento},
      ].map((n, i) => (
        <div key={i} style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 560, display: 'flex', justifyContent: 'center'}}>
          <Numero tema={tema} valor={n.valor} rotulo={n.rotulo} k={n.k} cor={n.cor} />
        </div>
      ))}
      {chip ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: 470, display: 'flex', justifyContent: 'center', opacity: Math.min(1, visivel(chip, t) * 1.3)}}>
          <Chip tema={tema} texto={chip.texto} k={entra(t, chip.a, 0.45)} destaque={chip.destaque} tam={chip.texto.length > 32 ? 23 : chip.texto.length > 24 ? 27 : 32} />
        </div>
      ) : null}
      {legendaK > 0.01 ? (
        <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.botoesX, top: 1180, display: 'flex', justifyContent: 'center', gap: 28, opacity: legendaK}}>
          {[
            {c: F.dourado, n: 'REPUBLICANOS'},
            {c: F.azul, n: 'DEMOCRATAS'},
          ].map((x) => (
            <div key={x.n} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 12, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`}}>
              <div style={{width: 22, height: 22, borderRadius: 5, background: x.c}} />
              <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: 2, color: tema.texto}}>{x.n}</div>
            </div>
          ))}
        </div>
      ) : null}
      {visRot.map((v) => rotulo(v.x, v.y, v.txt, v.k, v.cor, `r${v.i}`))}
      {selo ? seloDe(selo) : null}
      {t > T.segue - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4)}}>
          <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>O DELES OU O NOSSO?</div>
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
      <OffthreadVideo src={staticFile(`${P}/mapas/eua.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  [T.aquiSempre, T.laVoto, T.aquiDos, T.aquiRegra].forEach((t) => s.push({t, f: 'whoosh', v: 0.1}));
  [T.repara].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.3}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.16}));
  for (let i = 0; i < 4; i++) s.push({t: T.urnas + i * 0.3, f: 'pop', v: 0.1});
  s.push({t: T.trumpNem, f: 'pop', v: 0.2});
  s.push({t: T.cedula + 0.4, f: 'baque', v: 0.24});
  [0, 1, 2, 3].forEach((i) => s.push({t: T.quatro + i * 0.16, f: 'pop', v: 0.14}));
  s.push({t: T.meio, f: 'ding', v: 0.2});
  s.push({t: T.n435, f: 'subida', v: 0.26});
  s.push({t: T.senado + 0.9, f: 'pop', v: 0.2});
  s.push({t: T.senado + 2.8, f: 'pop', v: 0.2});
  s.push({t: T.republicanos, f: 'subida', v: 0.2});
  s.push({t: T.n53, f: 'pop', v: 0.22});
  s.push({t: T.democratas, f: 'subida', v: 0.2});
  s.push({t: T.dividido, f: 'ding', v: 0.2});
  s.push({t: T.comoElege + 2.6, f: 'subida', v: 0.22});
  s.push({t: T.comoElege + 8.2, f: 'ding', v: 0.22});
  s.push({t: T.repara + 6.3, f: 'pop', v: 0.2});
  s.push({t: TERCA, f: 'pop', v: 0.22});
  s.push({t: T.diaNormal + 0.4, f: 'bip', v: 0.16});
  s.push({t: T.domingo, f: 'pop', v: 0.22});
  s.push({t: T.naoObrig, f: 'pop', v: 0.2});
  s.push({t: T.registrar + 0.4, f: 'impacto', v: 0.16});
  s.push({t: T.n18, f: 'pop', v: 0.2});
  s.push({t: T.n70, f: 'pop', v: 0.2});
  s.push({t: T.obrigacao, f: 'impacto', v: 0.24});
  [0, 1, 2, 3, 4, 5].forEach((i) => s.push({t: T.suaRegra + i * 0.12, f: 'pop', v: 0.1}));
  s.push({t: T.correio, f: 'whoosh', v: 0.14});
  s.push({t: T.papel, f: 'subida', v: 0.16});
  [0, 0.5, 1.0].forEach((d) => s.push({t: T.dias + d, f: 'tique', v: 0.2}));
  s.push({t: T.umaSo, f: 'pop', v: 0.2});
  s.push({t: T.tse, f: 'subida', v: 0.18});
  s.push({t: T.urnaEl, f: 'bip', v: 0.22});
  s.push({t: T.noite, f: 'ding', v: 0.24});
  [0, 1, 2, 3].forEach((i) => s.push({t: T.presidente2 + i * 0.2, f: 'pop', v: 0.14}));
  s.push({t: T.umaVez, f: 'ding', v: 0.2});
  s.push({t: T.prefeito, f: 'pop', v: 0.18});
  s.push({t: T.vereador, f: 'pop', v: 0.18});
  s.push({t: T.naoEscolhem + 0.1, f: 'baque', v: 0.2});
  s.push({t: T.umCongresso, f: 'pop', v: 0.2});
  s.push({t: T.comentarios, f: 'pop', v: 0.22});
  s.push({t: T.segue, f: 'ding', v: 0.22});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.6, T.trumpNem + 0.4, T.cedula + 0.6, T.quatro + 0.8, T.midterms + 0.4, T.congresso1 + 0.8, T.n435 + 1.0, T.doisAnos + 0.4, T.senado + 1.4, T.senado + 4.0,
  T.republicanos + 0.8, T.n53 + 0.8, T.democratas + 1.0, T.dividido + 0.4, T.comoElege + 3.2, T.comoElege + 7.6, T.repara + 2.6, T.repara + 7.0, T.naoPara + 0.6,
  TERCA + 0.6, T.diaNormal + 0.8, T.domingo + 0.4, T.naoObrig + 0.4, T.registrar + 0.6, T.n70 + 0.4, T.obrigacao + 0.4, T.suaRegra + 0.5, T.correio + 0.6,
  T.papel + 0.6, T.dias + 1.2, T.umaSo + 0.4, T.tse + 0.6, T.urnaEl + 0.4, T.noite + 0.4, T.aCada + 0.4, T.umaVez + 0.5, T.vereador + 0.4, T.naoEscolhem + 0.5,
  T.contra + 0.4, T.qual + 0.6, T.nosso + 0.3, T.comentarios + 0.4, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const EleicaoEua: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
      <Palco tema={tema} alcance={230} sombraArea={22} centro={[0, 0, -3]} />
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
      <Sequence from={MAPA_BC.de} durationInFrames={MAPA_BC.ate - MAPA_BC.de} layout="none">
        <TrechoMapa {...MAPA_BC} />
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
      <Marca tema={tema} serie={SERIE} assunto="Eleição nos EUA" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['EUA votam', 'hoje.', 'Mas não pra', 'presidente.'];
export const CapaEleicaoEua: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ELEIÇÃO NOS EUA`} t={1} troca={0} y={SEGURO.topo + 160} />
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
