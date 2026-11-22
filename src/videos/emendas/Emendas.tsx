import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {ArvoreRedonda, Balanca, Cadeado, CalendarioGrande, CanoMoedas, Casinha, Congresso, Contracheque, DocumentoGrande, EscolaSimples, Guindaste, MarcoAno, PilhaMoedas, Plenario, PlacarVotos} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, parado, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 162. emendas parlamentares (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/162.../mapas/mapa.mp4: Brasília espalhando dinheiro para o país).
// Sem nomes de autoridades: só cargo e partido. Contas próprias marcadas. Fontes: projetos/162.../audio/fontes.md.

const P = '162. emendas parlamentares';
const AUDIO_SEG = 128.49;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  em2015: quando('Em 2015, as emendas'),
  previsao: quando('Para 2026, a previsão'),
  dezessete: quando('Mais de dezessete'),
  bate: quando('E foi esse número'),
  primeiro: quando('Primeiro, o que é'),
  pedaco: quando('É um pedaço'),
  vira: quando('Vira obra'),
  cidade: quando('quase sempre na cidade'),
  escada: quando('Agora, a escada'),
  emp: quando('foram três bilhões'),
  mudanca: quando('Naquele mesmo ano'),
  em2019: quando('Em 2019, vieram'),
  comissao: quando('E ainda tem'),
  resultado: quando('Resultado: o Orçamento'),
  recorde: quando('Recorde.'),
  ideia: quando('Pra ter uma ideia'),
  dividindo: quando('dividindo pelos'),
  pessoa: quando('cerca de 288'),
  quinta: quando('Quinta-feira, 12'),
  senadorPT: quando('Um senador do PT'),
  desafiou: quando('e desafiou'),
  senadorPL: quando('Um senador do PL'),
  topou: quando('E o senador do PT topou'),
  conta: quando('Agora, a conta'),
  salario: quando('O salário de senador'),
  metade: quando('Metade disso'),
  milhoes24: quando('dá cerca de 24'),
  parece: quando('Parece muito'),
  perto: quando('Mas, perto dos'),
  decimo: quando('menos de um décimo'),
  diferenca: quando('A diferença de tamanho'),
  facil: quando('E cortar emenda'),
  obrigatoria: quando('Boa parte delas'),
  tresQuintos: quando('três quintos'),
  turnos: quando('em dois turnos'),
  quemVota: quando('E quem vota'),
  agora: quando('Até agora, nenhuma'),
  placar: quando('por 45 votos'),
  destaques: quando('Faltam quatro'),
  camara: quando('Depois, o projeto vai'),
  importa: quando('E por que isso importa'),
  prefeitura: quando('Muita prefeitura'),
  mostro: quando('Por isso eu mostro'),
  voce: quando('E você: cortaria'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'EMENDAS PARLAMENTARES'],
  [T.primeiro, 'O QUE É EMENDA'],
  [T.escada, 'A ESCADA'],
  [T.ideia, 'O TAMANHO'],
  [T.quinta, 'O DESAFIO NO SENADO'],
  [T.conta, 'A CONTA'],
  [T.facil, 'DÁ PARA CORTAR?'],
  [T.agora, 'ONDE ESTÁ AGORA'],
  [T.importa, 'E A SUA CIDADE?'],
];

// trecho de mapa: de "Vira obra" até "Agora, a escada"
const TR: [number, number][] = [[T.vira - 0.1, T.escada - 0.05]];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

// ---------- Lugares do mundo ----------
const ABRE: V3 = [0, 0, 0];
const OQUE: V3 = [12, 0, 0];
const ESC: V3 = [24, 0, 0];
const POVO: V3 = [36, 0, 0];
const SEN: V3 = [48, 0, 0];
const CONTA: V3 = [60, 0, 0];
const CONST: V3 = [72, 0, 0];
const AGORA: V3 = [84, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];

  // Cena 1 (abertura) e 9 (fecho): o Congresso e as duas pilhas
  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.primeiro - 0.3, T.primeiro));
  const cresce = rampa(t, T.previsao, T.dezessete + 0.6);
  // Cena 2: o que é (Congresso mandando moedas pelo cano até as obras)
  const oqK = vis(t, T.primeiro - 0.3, T.vira);
  // Cena 3: a escada
  const escK = vis(t, T.escada - 0.3, T.ideia);
  const degrau = (a: number) => rampa(t, a - 0.2, a + 0.6);
  // Cena 4: por pessoa
  const povoK = vis(t, T.ideia - 0.3, T.quinta);
  const moedasPovo = rampa(t, T.pessoa - 0.2, T.pessoa + 0.8);
  // Cena 5: o desafio no Senado
  const senK = vis(t, T.quinta - 0.3, T.conta);
  // Cena 6: a conta (balança)
  const contaK = vis(t, T.conta - 0.3, T.facil);
  const pesa = rampa(t, T.perto, T.perto + 1.2);
  // Cena 7: a Constituição
  const conK = vis(t, T.facil - 0.3, T.agora);
  // Cena 8: onde está agora
  const agK = vis(t, T.agora - 0.3, T.importa);
  // Cena 9: a sua cidade (volta ao Congresso com o cano para as cidades)
  const fimK = entra(t, T.importa - 0.3, 0.6);

  const cano = (base: V3, k: number, fluxo: number) => (
    <CanoMoedas tema={tema} pontos={[soma(base, [-2.6, 1.6, -1.6]), soma(base, [-1.2, 1.2, -0.4]), soma(base, [0.6, 0.6, 0.4]), soma(base, [2.6, 0.2, 0.8])]} k={k} fluxo={fluxo} brilho={0.2} />
  );
  const obras = (base: V3, k: number) => (
    <group>
      <Casinha tema={tema} pos={soma(base, [2.4, 0, 1.8])} cor={mistura(festa.rosa, tema.objeto, 0.5)} escala={0.8 * k} />
      <EscolaSimples tema={tema} pos={soma(base, [3.8, 0, 0.6])} luz={k} />
      <group position={soma(base, [4.6, 0, -1.6])} scale={[0.32, 0.32, 0.32]}><Guindaste tema={tema} pos={[0, 0, 0]} rotY={-0.6} k={k} cabo={0.5} braco={6} /></group>
    </group>
  );

  return (
    <group>
      <Caixa args={[100, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[42, 0.02, 3.8]} sombra={false} />

      {/* Cena 1: duas pilhas, 2015 e 2026 */}
      {abK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(ABRE, [0, 0, -3.4])} escala={0.32 * abK} aceso={pulso(t, T.bate, 1.4)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [-1.6, 0.02, 0.6])} n={2} cor={dourado} r={0.34} escala={abK * entra(t, T.em2015, 0.4)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [1.4, 0.02, 0.6])} n={Math.max(1, Math.round(2 + 32 * cresce))} cor={dourado} r={0.34} escala={abK * entra(t, T.previsao, 0.4)} brilho={pulso(t, T.dezessete, 1.2)} />
          <MarcoAno tema={tema} pos={soma(ABRE, [-1.6, 0, 1.6])} ano="2015" k={abK * entra(t, T.em2015, 0.4)} aceso={pulso(t, T.em2015, 1.0)} />
          <MarcoAno tema={tema} pos={soma(ABRE, [1.4, 0, 1.6])} ano="2026" k={abK * entra(t, T.previsao, 0.4)} aceso={pulso(t, T.previsao, 1.0)} />
        </group>
      ) : null}

      {/* Cena 2: o que é emenda */}
      {oqK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(OQUE, [-3.0, 0, -2.2])} escala={0.26 * oqK} aceso={0.5} />
          <Boneco tema={tema} pos={soma(OQUE, [-1.2, 0, 0.8])} rotY={0.5} escala={0.65 * oqK * entra(t, T.pedaco + 0.6, 0.4)} cor={cores[1]} pose={{ombroD: [-0.9, 0, 0.3]}} />
          {cano(OQUE, oqK, rampa(t, T.pedaco + 1.0, T.vira))}
          {obras(OQUE, oqK * entra(t, T.pedaco + 1.4, 0.5))}
        </group>
      ) : null}

      {/* Cena 3: a escada 2015, 2019, 2026 */}
      {escK > 0.02 ? (
        <group>
          {[
            {a: T.emp, ano: '2015', alt: 0.25, x: -2.6},
            {a: T.em2019, ano: '2019', alt: 0.9, x: -0.4},
            {a: T.resultado, ano: '2026', alt: 2.2, x: 2.0},
          ].map((d, i) => (
            <group key={i}>
              <Caixa args={[1.8, d.alt * degrau(d.a), 1.4]} raio={0.05} cor={mistura(tema.objeto, tema.acento, i === 2 ? 0.55 : 0.12)} position={soma(ESC, [d.x, (d.alt * degrau(d.a)) / 2, -0.6])} scale={[escK, escK, escK]} />
              <PilhaMoedas tema={tema} pos={soma(ESC, [d.x, d.alt * degrau(d.a) + 0.02, -0.6])} n={[2, 5, 12][i]} cor={dourado} r={0.28} escala={escK * degrau(d.a)} brilho={i === 2 ? pulso(t, T.recorde, 1.2) : 0} />
              <MarcoAno tema={tema} pos={soma(ESC, [d.x, 0, 0.9])} ano={d.ano} k={escK * degrau(d.a)} aceso={pulso(t, d.a, 1.0)} />
            </group>
          ))}
          <DocumentoGrande tema={tema} pos={soma(ESC, [-2.6, 0.05, 2.0])} rot={[-1.3, 0.2, 0]} escala={0.55 * escK * entra(t, T.mudanca, 0.4)} carimbo={rampa(t, T.mudanca + 0.8, T.mudanca + 1.2)} />
          <DocumentoGrande tema={tema} pos={soma(ESC, [-0.4, 0.05, 2.0])} rot={[-1.3, -0.1, 0]} escala={0.55 * escK * entra(t, T.em2019, 0.4)} carimbo={rampa(t, T.em2019 + 0.8, T.em2019 + 1.2)} />
        </group>
      ) : null}

      {/* Cena 4: R$ 288 por pessoa */}
      {povoK > 0.02 ? (
        <group>
          {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
            <group key={i}>
              <Boneco tema={tema} pos={soma(POVO, [x, 0, 0.4])} rotY={0.06 * (i - 2)} escala={0.6 * povoK} cor={cores[i % cores.length]} />
              <PilhaMoedas tema={tema} pos={soma(POVO, [x, 0.02, 1.1])} n={Math.max(1, Math.round(3 * moedasPovo))} cor={dourado} r={0.14} escala={povoK * Math.min(1, moedasPovo * 1.5)} />
            </group>
          ))}
          <ArvoreRedonda tema={tema} pos={soma(POVO, [-3.8, 0, -1.8])} r={0.5} cresce={povoK} />
          <ArvoreRedonda tema={tema} pos={soma(POVO, [3.8, 0, -2.0])} r={0.5} cresce={povoK} />
        </group>
      ) : null}

      {/* Cena 5: o desafio no Senado */}
      {senK > 0.02 ? (
        <group>
          <Plenario tema={tema} pos={soma(SEN, [0, 0, -1.6])} escala={0.75 * senK} acesos={rampa(t, T.quinta, T.quinta + 1.2)} />
          <Boneco tema={tema} pos={soma(SEN, [-1.4, 0, 1.2])} rotY={0.4} escala={0.65 * senK * entra(t, T.senadorPT - 0.2, 0.4)} cor={mistura(festa.rosa, tema.objeto, 0.3)} pose={{ombroD: [-1.2 * pulso(t, T.desafiou, 1.4), 0, 0.2]}} />
          <Boneco tema={tema} pos={soma(SEN, [1.4, 0, 1.2])} rotY={-0.4} escala={0.65 * senK * entra(t, T.senadorPL - 0.2, 0.4)} cor={mistura(festa.azul, tema.objeto, 0.3)} pose={{ombroE: [-1.2 * pulso(t, T.senadorPL + 0.6, 1.4), 0, -0.2]}} />
        </group>
      ) : null}

      {/* Cena 6: a conta, salário x emendas */}
      {contaK > 0.02 ? (
        <group>
          <Contracheque tema={tema} pos={soma(CONTA, [-2.6, 0, 0.4])} rotY={0.35} escala={0.8 * contaK * entra(t, T.salario - 0.2, 0.4)} salario={46366} piso={23183} />
          <Balanca
            tema={tema}
            pos={soma(CONTA, [1.0, 0, -0.6])}
            escala={0.9 * contaK * entra(t, T.parece - 0.4, 0.5)}
            inclina={-0.32 * pesa}
            esq={<PilhaMoedas tema={tema} pos={[0, 0.02, 0]} n={1} cor={dourado} r={0.12} escala={entra(t, T.milhoes24, 0.4)} />}
            dir={<PilhaMoedas tema={tema} pos={[0, 0.02, 0]} n={Math.max(1, Math.round(14 * pesa))} cor={dourado} r={0.3} escala={entra(t, T.perto, 0.4)} />}
            brilhoEsq={pulso(t, T.milhoes24, 1.2)}
            brilhoDir={pulso(t, T.decimo, 1.4)}
          />
        </group>
      ) : null}

      {/* Cena 7: mudar a Constituição */}
      {conK > 0.02 ? (
        <group>
          <DocumentoGrande tema={tema} pos={soma(CONST, [-1.2, 0.05, 0.4])} rot={[-1.25, 0.25, 0]} escala={1.5 * conK} />
          <Cadeado tema={tema} pos={soma(CONST, [-1.2, 0.6, 0.6])} k={conK * entra(t, T.obrigatoria, 0.4)} fecha={rampa(t, T.obrigatoria + 0.4, T.obrigatoria + 1.0)} />
          <PlacarVotos tema={tema} pos={soma(CONST, [1.8, 0, -1.0])} escala={2.2 * conK * entra(t, T.tresQuintos - 0.2, 0.4)} acesos={Math.min(3, 3 * rampa(t, T.tresQuintos, T.tresQuintos + 1.0))} />
          {[-0.6, 0.6].map((x, i) => (
            <Boneco key={i} tema={tema} pos={soma(CONST, [1.8 + x, 0, 1.2])} rotY={0} escala={0.55 * conK * entra(t, T.quemVota - 0.2 + 0.2 * i, 0.4)} cor={cores[i + 1]} />
          ))}
        </group>
      ) : null}

      {/* Cena 8: onde está agora */}
      {agK > 0.02 ? (
        <group>
          <Plenario tema={tema} pos={soma(AGORA, [-1.6, 0, -1.4])} escala={0.6 * agK} acesos={1} />
          <PlacarVotos tema={tema} pos={soma(AGORA, [-1.6, 0, 1.0])} escala={1.8 * agK * entra(t, T.placar - 0.2, 0.4)} acesos={Math.min(5, 5 * rampa(t, T.placar, T.placar + 0.8))} />
          <CalendarioGrande tema={tema} pos={soma(AGORA, [1.2, 0, -0.2])} texto="17/11" sub="DESTAQUES" folha={agK} escala={0.6 * agK * entra(t, T.destaques - 0.2, 0.4)} destaque={pulso(t, T.destaques, 1.0)} />
          <Congresso tema={tema} pos={soma(AGORA, [3.4, 0, -2.4])} escala={0.22 * agK * entra(t, T.camara - 0.2, 0.5)} aceso={pulso(t, T.camara + 0.4, 1.2)} />
        </group>
      ) : null}

      {/* Cena 9: a sua cidade */}
      {fimK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(ABRE, [-3.0, 0, -2.2])} escala={0.26 * fimK} aceso={0.5} />
          {cano(ABRE, fimK, rampa(t, T.importa, T.segue))}
          {obras(ABRE, fimK)}
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 1.6, -1.6]), 9.4, 6.8, [0, 0.36, 1])], [T.previsao, E(soma(ABRE, [0, 1.6, -0.6]), 7.6, 5.8, [0.05, 0.34, 1])], [T.bate, E(soma(ABRE, [0.4, 1.8, -0.4]), 7.0, 5.6, [-0.04, 0.34, 1])], [T.primeiro, E(soma(ABRE, [0.4, 1.8, -0.4]), 6.8, 5.4, [-0.06, 0.34, 1])]]},
  {ini: T.primeiro, chaves: [[T.primeiro, E(soma(OQUE, [-1.8, 1.4, -1.0]), 7.6, 5.6, [0.08, 0.3, 1])], [T.pedaco + 1.0, E(soma(OQUE, [0.6, 1.0, 0]), 9.6, 6.4, [0.02, 0.34, 1])], [T.vira, E(soma(OQUE, [1.6, 1.0, 0.2]), 8.4, 6.0, [-0.04, 0.34, 1])]]},
  parado(T.vira, T.escada, E(soma(ESC, [0, 1.4, 0]), 8.8, 6.2, [0.05, 0.3, 1])),
  {ini: T.escada, chaves: [[T.escada, E(soma(ESC, [-2.0, 1.0, 0.4]), 6.4, 4.8, [0.08, 0.3, 1])], [T.em2019, E(soma(ESC, [-1.2, 1.2, 0.4]), 6.8, 5.0, [0.04, 0.3, 1])], [T.resultado, E(soma(ESC, [-0.2, 1.4, 0]), 8.6, 6.0, [-0.03, 0.3, 1])], [T.ideia - 0.1, E(soma(ESC, [0.2, 1.6, -0.2]), 8.0, 5.8, [-0.07, 0.32, 1])]]},
  {ini: T.ideia, chaves: [[T.ideia, E(soma(POVO, [0, 0.9, 0.4]), 6.4, 4.4, [0.04, 0.32, 1])], [T.pessoa, E(soma(POVO, [0, 0.7, 0.8]), 5.6, 3.8, [0, 0.36, 1])], [T.quinta - 0.1, E(soma(POVO, [0, 0.7, 0.8]), 5.4, 3.7, [-0.04, 0.36, 1])]]},
  {ini: T.quinta, chaves: [[T.quinta, E(soma(SEN, [0, 1.6, -1.2]), 8.4, 6.0, [0.06, 0.3, 1])], [T.senadorPT, E(soma(SEN, [-1.2, 1.1, 0.8]), 5.4, 4.4, [0.08, 0.28, 1])], [T.senadorPL, E(soma(SEN, [1.2, 1.1, 0.8]), 5.4, 4.4, [-0.08, 0.28, 1])], [T.topou, E(soma(SEN, [0, 1.2, 0.6]), 7.0, 5.0, [0, 0.3, 1])], [T.conta - 0.1, E(soma(SEN, [0, 1.2, 0.6]), 6.8, 4.8, [-0.03, 0.3, 1])]]},
  {ini: T.conta, chaves: [[T.conta, E(soma(CONTA, [-2.2, 1.2, 0.4]), 5.2, 4.4, [0.1, 0.28, 1])], [T.metade, E(soma(CONTA, [-2.2, 1.2, 0.4]), 4.8, 4.0, [0.06, 0.28, 1])], [T.parece, E(soma(CONTA, [-0.4, 1.4, -0.2]), 8.6, 6.0, [0.02, 0.3, 1])], [T.diferenca, E(soma(CONTA, [1.0, 1.4, -0.4]), 6.6, 5.2, [-0.05, 0.3, 1])], [T.facil - 0.1, E(soma(CONTA, [1.0, 1.4, -0.4]), 6.4, 5.0, [-0.07, 0.3, 1])]]},
  {ini: T.facil, chaves: [[T.facil, E(soma(CONST, [-1.0, 1.0, 0.4]), 5.6, 4.4, [0.08, 0.34, 1])], [T.tresQuintos, E(soma(CONST, [1.4, 1.4, -0.4]), 6.0, 4.8, [-0.02, 0.3, 1])], [T.quemVota, E(soma(CONST, [1.6, 1.1, 0.6]), 5.8, 4.6, [-0.06, 0.3, 1])], [T.agora - 0.1, E(soma(CONST, [1.6, 1.1, 0.6]), 5.6, 4.4, [-0.08, 0.3, 1])]]},
  {ini: T.agora, chaves: [[T.agora, E(soma(AGORA, [-1.0, 1.2, -0.4]), 8.2, 5.8, [0.06, 0.3, 1])], [T.placar, E(soma(AGORA, [-1.6, 1.0, 0.8]), 5.2, 4.2, [0.04, 0.3, 1])], [T.destaques, E(soma(AGORA, [1.0, 1.1, -0.2]), 5.6, 4.4, [-0.02, 0.3, 1])], [T.camara, E(soma(AGORA, [2.4, 1.4, -1.6]), 6.6, 5.0, [-0.06, 0.3, 1])], [T.importa - 0.1, E(soma(AGORA, [2.4, 1.4, -1.6]), 6.4, 4.8, [-0.08, 0.3, 1])]]},
  {ini: T.importa, chaves: [[T.importa, E(soma(ABRE, [0.6, 1.0, 0]), 9.4, 6.4, [0.04, 0.34, 1])], [T.mostro, E(soma(ABRE, [2.4, 1.0, 0.4]), 7.6, 5.6, [-0.04, 0.34, 1])], [T.voce, E(soma(ABRE, [0.6, 1.2, -0.2]), 9.6, 6.8, [0, 0.38, 1])], [FIM, E(soma(ABRE, [0.6, 1.3, -0.4]), 10.2, 7.2, [0, 0.4, 1])]]},
];

// ---------- Interface ----------
const CHIPS: Txt[] = [
  {a: T.em2015, b: T.previsao, texto: '2015: R$ 3,5 BILHÕES'},
  {a: T.previsao, b: T.dezessete, texto: '2026: R$ 61 BILHÕES PREVISTOS', destaque: true},
  {a: T.dezessete, b: T.primeiro, texto: 'MAIS DE 17 VEZES (CONTA MINHA)', destaque: true},
  {a: T.pedaco, b: T.vira, texto: 'O PARLAMENTAR ESCOLHE O DESTINO'},
  {a: T.mudanca, b: T.em2019, texto: '2015: EMENDA INDIVIDUAL VIRA OBRIGATÓRIA'},
  {a: T.em2019, b: T.comissao, texto: '2019: EMENDA DE BANCADA TAMBÉM'},
  {a: T.resultado, b: T.ideia, texto: 'ORÇAMENTO 2026: R$ 61,4 BI EM EMENDAS · RECORDE', destaque: true},
  {a: T.pessoa, b: T.quinta, texto: 'CONTA MINHA: R$ 61,4 BI ÷ 213,4 MI ≈ R$ 288', destaque: true},
  {a: T.desafiou, b: T.senadorPL, texto: '"CORTAR AS PRÓPRIAS EMENDAS"'},
  {a: T.senadorPL, b: T.topou, texto: 'PROPOSTA: SALÁRIO DE SENADOR PELA METADE'},
  {a: T.topou, b: T.conta, texto: 'O SENADOR DO PT TOPOU OS DOIS CORTES'},
  {a: T.milhoes24, b: T.perto, texto: 'CONTA MINHA: 81 × R$ 23.183 × 13 ≈ R$ 24 MI', destaque: true},
  {a: T.decimo, b: T.facil, texto: 'MENOS DE 0,1% DAS EMENDAS', destaque: true},
  {a: T.tresQuintos, b: T.quemVota, texto: '3/5 DOS VOTOS · CÂMARA E SENADO · 2 TURNOS'},
  {a: T.agora, b: T.placar, texto: 'CORTE DAS EMENDAS: NENHUMA VOTAÇÃO ATÉ AGORA', destaque: true},
  {a: T.placar, b: T.destaques, texto: 'AJUSTE FISCAL: 45 A 31 NO SENADO'},
  {a: T.destaques, b: T.importa, texto: 'DESTAQUES: TERÇA, 17 · DEPOIS A CÂMARA'},
];
const SELOS: Txt[] = [
  {a: T.em2015, b: T.primeiro, texto: 'FONTE: AGÊNCIA SENADO · 12/11/2026'},
  {a: T.mudanca, b: T.ideia, texto: 'FONTE: EC 86/2015 · EC 100/2019 · LOA 2026'},
  {a: T.ideia, b: T.quinta, texto: 'FONTE DA POPULAÇÃO: IBGE · ESTIMATIVA 2025'},
  {a: T.salario, b: T.facil, texto: 'FONTE DO SALÁRIO: SENADO FEDERAL · DESDE 02/2025'},
  {a: T.tresQuintos, b: T.agora, texto: 'FONTE: CONSTITUIÇÃO, ART. 60'},
  {a: T.placar, b: T.importa, texto: 'FONTE: AGÊNCIA SENADO · PLP 299/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.vira - 1.2, b: T.vira, p: soma(OQUE, [3.8, 2.2, 0.6]), texto: 'OBRA, POSTO, ASFALTO', acento: true},
  {a: T.emp, b: T.ideia, p: soma(ESC, [-2.6, 1.6, -0.6]), texto: 'R$ 3,5 BI'},
  {a: T.resultado, b: T.ideia, p: soma(ESC, [2.0, 3.6, -0.6]), texto: 'R$ 61,4 BI', acento: true},
  {a: T.pessoa, b: T.quinta, p: soma(POVO, [0, 2.0, 0.4]), texto: '≈ R$ 288 POR BRASILEIRO', acento: true},
  {a: T.senadorPT, b: T.conta, p: soma(SEN, [-1.4, 1.9, 1.2]), texto: 'SENADOR DO PT'},
  {a: T.senadorPL, b: T.conta, p: soma(SEN, [1.4, 1.9, 1.2]), texto: 'SENADOR DO PL'},
  {a: T.salario, b: T.parece, p: soma(CONTA, [-2.6, 2.2, 0.4]), texto: 'R$ 46.366 POR MÊS'},
  {a: T.milhoes24, b: T.facil, p: soma(CONTA, [-0.4, 2.4, -0.6]), texto: 'METADE DO SALÁRIO: R$ 24 MI/ANO'},
  {a: T.perto, b: T.facil, p: soma(CONTA, [2.4, 2.8, -0.6]), texto: 'EMENDAS: R$ 61 BI/ANO', acento: true},
  {a: T.obrigatoria, b: T.agora, p: soma(CONST, [-1.2, 1.6, 0.4]), texto: 'CONSTITUIÇÃO', acento: true},
  {a: T.quemVota, b: T.agora, p: soma(CONST, [1.8, 2.0, 1.2]), texto: 'OS PRÓPRIOS PARLAMENTARES'},
  {a: T.camara, b: T.importa, p: soma(AGORA, [3.6, 2.6, -2.4]), texto: 'CÂMARA'},
  {a: T.prefeitura, b: T.voce, p: soma(ABRE, [3.6, 2.0, 0.6]), texto: 'A SUA CIDADE', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.primeiro, T.escada, T.ideia, T.quinta, T.conta, T.facil, T.agora, T.importa].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.previsao + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.dezessete, f: 'ding', v: 0.14});
  [T.emp, T.em2019, T.resultado].forEach((t) => s.push({t, f: 'pop', v: 0.13}));
  s.push({t: T.recorde, f: 'ding', v: 0.15});
  s.push({t: T.pessoa + 0.3, f: 'pop', v: 0.13});
  s.push({t: T.obrigatoria + 0.9, f: 'baque', v: 0.15});
  s.push({t: T.decimo, f: 'ding', v: 0.16});
  s.push({t: T.placar + 0.4, f: 'tique', v: 0.14});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.previsao + 1.2, T.dezessete + 0.8, T.primeiro + 0.6, T.pedaco + 1.6, T.vira + 1.0, T.cidade + 1.0, T.escada + 0.6, T.emp + 0.8,
  T.mudanca + 1.2, T.em2019 + 1.0, T.resultado + 1.2, T.recorde + 0.4, T.ideia + 0.6, T.pessoa + 0.8, T.quinta + 0.6, T.senadorPT + 0.8,
  T.desafiou + 0.8, T.senadorPL + 1.0, T.topou + 0.8, T.conta + 0.6, T.salario + 1.0, T.milhoes24 + 0.8, T.perto + 1.2, T.decimo + 0.8,
  T.facil + 0.6, T.obrigatoria + 1.0, T.tresQuintos + 1.0, T.quemVota + 0.6, T.agora + 0.6, T.placar + 0.8, T.destaques + 0.8,
  T.camara + 0.8, T.importa + 0.6, T.prefeitura + 1.0, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Emendas',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa},
  Mundo,
};

export const Emendas: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['De R$ 3,5 bi', 'para', 'R$ 61 bi'];
export const CapaEmendas: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="EMENDAS" />
);
