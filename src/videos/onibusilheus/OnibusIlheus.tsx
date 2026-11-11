import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, Placa, cinematizar, enquadrar, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Chip, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';
import {Carro, Lupa, Onibus, Pessoa, PredioColunas} from '../../pecas';
import {CamaraVereadores, PilhasDinheiro, PredioTCM, Prefeitura, type Pilha} from '../orcamentoilheus/pecas';
import {Ampulheta, Avenida, CHAO, CaixaOrcamento, DocumentoPe, Garagem, Interrogacao, Letreiro, PlacaData, PontoOnibus, PredioSutram, ReguaContrato, coresON} from './pecas';
import {PALAVRAS} from './palavras';

// 016. ônibus de ilhéus (perfil @eumagnoleite, série Magno Explica). Feito com os DOIS kits:
// o Estúdio 3D monta a Avenida do Tempo (cada ponto de ônibus é uma data; o ônibus anda no tempo;
// a conta do transporte cresce em pilhas: 1 pilha = R$ 1 milhão) e encaixa três trechos de mapa do
// Kit Mapas Animados (projetos/016.../mapas/onibus.mp4, composição OnibusIlheus do kit):
// O SALTO (quadros 0 a 190), QUEM FICA COM O QUÊ (190 a 396) e SEU BAIRRO (396 a 710).
// Pedidos da pessoa: o cartão da FONTE sempre na tela, bem visível; nada sobreposto (faixas fixas A a E);
// linha do tempo clara (data grande + pílula). Neutro: prefeitura e oposição com o mesmo espaço;
// toda acusação com "segundo quem"; as duas pessoas reais como bonecos cinza, sem rosto.
// Plano: projetos/016. ônibus de ilhéus/plano.md (versão 1, aprovada em 03/11/2026).

export const FPS = 30;
const AUDIO_SEG = 152.19;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '016. ônibus de ilhéus';
const FIM = AUDIO_SEG + 0.9;

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  meses: quando('meses de 2026'),
  dez: quando('dez vezes'),
  de2024: quando('inteiro de 2024'),
  comoChegamos: quando('Como chegamos'),
  anoAno: quando('Ano a ano'),
  documentos: quando('documentos da propria'),
  a2003: quando('2003.'),
  viametro1: quando('A Viametro ganha uma'),
  licitacao1: quando('uma licitacao para'),
  operar: quando('operar onibus'),
  oContrato: quando('O contrato tem'),
  renova: quando('renova sozinho'),
  cincoEm5: quando('de 5 em 5'),
  a2033: quando('2033'),
  semLicNova: quando('sem licitacao nova'),
  a2024: quando('A conta do transporte fecha') - 1.14,
  contaFecha: quando('A conta do transporte fecha'),
  n3: quando('3 milhoes'),
  orgao: quando('orgao de transito'),
  sutram: quando('Sutram'),
  onibusNem: quando('O onibus nem'),
  prefJa: quando('A prefeitura diz que ja'),
  acordo: quando('acordo na Justica'),
  masBalanco: quando('Mas o balanco'),
  naoMostra: quando('nao mostra esse'),
  guarda: quando('Guarda isso'),
  abril25: quando('Abril de 2025'),
  saoMiguel: quando('A Sao Miguel'),
  deixa: quando('deixa a cidade'),
  maio25: quando('Maio de 2025'),
  atlEntra: quando('A Atlantico entra'),
  semLicPor: quando('lugar, sem licitacao'),
  leiSo: quando('A lei so permite'),
  noMesmo: quando('No mesmo mes'),
  aprova: quando('aprova o subsidio'),
  n264: quando('26,4'),
  empresasOnibus: quando('as empresas de onibus'),
  n22: quando('2,2'),
  prefRodar: quando('A prefeitura diz que rodar'),
  semSub: quando('Sem o subsidio'),
  n480: quando('4,80'),
  oposicao: quando('A oposicao'),
  semGarantia: quando('sem garantia'),
  eMais: quando('E mais'),
  segundoSites: quando('segundo os sites'),
  executivo: quando('diretor-executivo da Viametro'),
  cunhado: quando('e cunhado'),
  doPrefeito: quando('do prefeito Valderico'),
  reportagens: quando('As reportagens'),
  resultado: quando('Resultado'),
  conta2025: quando('em 2025, a conta'),
  n12: quando('12 milhoes'),
  maio26: quando('Maio de 2026'),
  emergAtl: quando('emergencia da Atlantico'),
  semLicEla: quando('Sem licitacao, ela'),
  segundoVer: quando('Segundo a vereadora'),
  dadosTcm: quando('com dados do TCM'),
  n35: quando('3,5'),
  jaAtl: quando('Ja a Atlantico'),
  n16: quando('16 milhoes'),
  agosto26: quando('Agosto de 2026'),
  contaChega: quando('A conta chega'),
  n32: quando('32 milhoes'),
  n21: quando('21 sao'),
  ritmo: quando('Acima do ritmo'),
  n14: quando('1,4'),
  outros11: quando('Outros 11'),
  n86: quando('8,6'),
  chegou19: quando('chegou a 19'),
  outubro26: quando('Outubro de 2026'),
  mp: quando('Ministerio Publico'),
  tira: quando('tira a Atlantico'),
  novembro: quando('Em novembro'),
  assume: quando('a Viametro assume'),
  n30: quando('30 onibus'),
  brisa: quando('Brisa'),
  viametroMais: quando('A Viametro ganha mais'),
  maisLinhas: quando('mais linhas'),
  aditivo: quando('aditivo'),
  naquele: quando('Naquele contrato'),
  semLicNova2: quando('Sem licitacao nova', 2),
  ficam: quando('Ficam tres'),
  porQue: quando('Por que o subsidio'),
  ondeFoi: quando('Onde foi parar'),
  quandoSai: quando('E quando sai'),
  onibusSeu: quando('O onibus do seu'),
  seuBairro: quando('seu bairro'),
  meConta: quando('Me conta'),
  segue: quando('E segue'),
  direitos: quando('direitos'),
};

// a pílula do topo: a data de cada parte da história
const ESTADOS: [number, string][] = [
  [0, 'O SALTO'],
  [T.comoChegamos, 'ANO A ANO'],
  [T.a2003, '2003'],
  [T.a2024, '2024'],
  [T.abril25, 'ABRIL DE 2025'],
  [T.maio25, 'MAIO DE 2025'],
  [T.maio26, 'MAIO DE 2026'],
  [T.agosto26, 'AGOSTO DE 2026'],
  [T.outubro26, 'OUTUBRO DE 2026'],
  [T.novembro, 'NOVEMBRO DE 2026'],
  [T.ficam, 'SEM RESPOSTA'],
  [T.onibusSeu, 'E VOCÊ?'],
];

// ---------- Os trechos de mapa (Kit Mapas): quadros de 30 ----------
const q = (s: number) => Math.round(s * FPS);
const KIT_B = 190;
const KIT_C = 396;
const MAPA_A = {de: 0, ate: q(T.comoChegamos), origem: 0, entrada: 0};
const MAPA_B = {de: q(T.novembro) - 6, ate: q(T.viametroMais), origem: KIT_B + (q(T.novembro) - 6 - q(T.novembro - 0.2)), entrada: 6};
const MAPA_C = {de: q(T.onibusSeu) - 6, ate: QUADROS, origem: KIT_C + (q(T.onibusSeu) - 6 - q(T.onibusSeu - 0.2)), entrada: 6};
const noMapa = (t: number) => t < T.comoChegamos || (t >= T.novembro && t < T.viametroMais) || t >= T.onibusSeu;
// enquanto o mapa cobre a tela inteira, o 3D não é desenhado (render mais leve)
const soMapa = (t: number) => t < T.comoChegamos - 0.3 || (t > T.novembro + 0.1 && t < T.viametroMais - 0.3) || t > T.onibusSeu + 0.1;

// ---------- Mapa do mundo (a avenida corre em z, de 6 até −64; a câmera olha de z+ para z−) ----------
const Z0 = 8;
const Z1 = -66;
const PONTOS_Z = [0, -10, -18, -25, -35, -43, -52];
const DATAS_TXT = ['2003', '2024', 'ABR 2025', 'MAI 2025', 'MAI 2026', 'AGO 2026', 'OUT 2026'];
const PONTO_X = 2.4;
const FAIXA_BUS = 0.8;
const G_VIAMETRO: V3 = [-4.6, 0, 1];
const CONTRATO: V3 = [-2.4, CHAO, 2.8];
const REGUA: V3 = [4.2, CHAO, 1.2];
const SUTRAM: V3 = [-4.6, 0, -9];
const BALANCO: V3 = [-2.4, CHAO, -12];
const G_SAOMIGUEL: V3 = [-4.6, 0, -17];
const G_ATLANTICO: V3 = [-4.6, 0, -24];
const AMPULHETA: V3 = [-2.4, CHAO, -22.2];
const PILHA_ATL: V3 = [-2.3, CHAO, -25.8];
const CAMARA: V3 = [-4.8, 0, -28.2];
const LEI: V3 = [-2.4, CHAO, -28.4];
const PREF: V3 = [-4.8, 0, -32.2];
const BONECO_1: V3 = [-2.0, CHAO, -32.6];
const BONECO_2: V3 = [-2.8, CHAO, -32.6];
const TCM: V3 = [-4.9, 0, -37];
const CAIXA_ORC: V3 = [6.4, CHAO, -41.4];
const MP: V3 = [-4.9, 0, -50];
const PERGUNTAS: V3[] = [[-1.9, CHAO, -62], [0, CHAO, -62], [1.9, CHAO, -62]];
// as fileiras de pilhas (ao longo de z, para caber no vertical): dourado = subsídio; cinza-azulado = Sutram e administração
const X_OURO = 4.2;
const X_CINZA = 5.0;
const PASSO = 0.42;
const Z_2024 = -8.8;
const Z_2025 = -22.6;
const Z_2026 = -37.6;
const RITMO_Z = Z_2026 - 17.6 * PASSO + PASSO / 2;

// ---------- Ajudantes ----------
const soma = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vis = (t: number, a: number, b: number) => entra(t, a, 0.45) * (1 - rampa(t, b, b + 0.4));
const fileira = (x: number, z0: number, n: number, corP: string, k: number): Pilha[] =>
  Array.from({length: Math.ceil(n)}).map((_, j) => ({p: [x, 0, z0 - j * PASSO] as V3, n: Math.max(0, Math.min(1, n - j)) * Math.max(0, Math.min(1, k * Math.ceil(n) - j)), cor: corP})).filter((x) => x.n > 0.001);

// o ônibus protagonista: para em cada ponto na data dele
const DATAS_T = [T.a2003, T.a2024, T.abril25, T.maio25, T.maio26, T.agosto26, T.outubro26];
const busZ = (t: number) => {
  let z = Z0 - 2;
  for (let i = 0; i < PONTOS_Z.length; i++) {
    const de = i === 0 ? Z0 - 2 : PONTOS_Z[i - 1] + 1.2;
    const ate = PONTOS_Z[i] + 1.2;
    const k = interpolate(t, [DATAS_T[i] - 0.4, DATAS_T[i] + 1.4], [0, 1], {...clamp, easing: sai});
    if (t >= DATAS_T[i] - 0.4) z = de + (ate - de) * k;
  }
  // depois de outubro, segue até o fim da avenida e some
  return z - rampa(t, T.novembro, T.novembro + 4) * 10;
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const C = coresON(tema);
  const F = tema.festa!;
  const sobe = (a: number, d = 0.7) => rampa(t, a - 0.15, a + d);
  // os pontos e as datas: sobem em "Ano a ano", um a um
  const pontoK = (i: number) => rampa(t, T.anoAno + i * 0.25, T.anoAno + i * 0.25 + 0.6);
  const dataAtual = DATAS_T.filter((d) => t >= d - 0.05).length - 1;
  const destaque = (i: number) => (i === dataAtual && t < T.ficam ? entra(t, DATAS_T[i], 0.5) * (1 - rampa(t, (DATAS_T[i + 1] ?? T.novembro) - 0.4, DATAS_T[i + 1] ?? T.novembro)) : 0);
  // o ônibus
  const bz = busZ(t);
  const busAnda = Math.abs(busZ(t + 0.05) - bz) > 0.01;
  // pilhas
  const p24 = fileira(X_CINZA, Z_2024, 3.02, C.sutram, rampa(t, T.n3 - 0.3, T.n3 + 0.9));
  const k25 = rampa(t, T.conta2025, T.conta2025 + 1.6);
  const p25 = [...fileira(X_OURO, Z_2025, 7.35, C.ouro, k25), ...fileira(X_CINZA, Z_2025, 4.65, C.sutram, k25)];
  const k26 = rampa(t, T.contaChega, T.contaChega + 1.8);
  const p26 = [...fileira(X_OURO, Z_2026, 21.24, C.ouro, k26), ...fileira(X_CINZA, Z_2026, 11.13, C.sutram, k26)];
  // a pilha dos 3,5 milhões que a Atlântico recebeu depois do contrato (segundo a vereadora)
  const p35 = fileira(PILHA_ATL[0], PILHA_ATL[2] + 0.6, 3.5, C.ouro, rampa(t, T.n35 - 0.2, T.n35 + 0.9)).map((x) => ({...x, p: [x.p[0], CHAO, x.p[2]] as V3}));
  // portões
  const portaoSM = rampa(t, T.deixa, T.deixa + 0.7);
  const portaoAtl = rampa(t, T.tira, T.tira + 0.7);
  // os ônibus novos da Viametro saem em fila
  const novosK = rampa(t, T.maisLinhas - 0.3, T.maisLinhas + 0.5);
  // o "?" pequeno do balanço de 2024 (Guarda isso) voa até a 2ª pergunta
  const voo = rampa(t, T.ondeFoi, T.ondeFoi + 1.2);
  const qPos: V3 = [BALANCO[0] + (PERGUNTAS[1][0] - BALANCO[0]) * voo, 1.5 + 1.2 * Math.sin(Math.PI * voo), BALANCO[2] + (PERGUNTAS[1][2] - BALANCO[2]) * voo];
  // carros na outra mão, andando para z+
  const carros = [0, 1, 2, 3].map((i) => {
    const per = 74;
    const z = Z1 + ((t * 2.4 + i * (per / 4)) % per);
    return z;
  });
  const passageiros = (i: number) => vis(t, DATAS_T[i] + 0.6, (DATAS_T[i + 1] ?? T.ficam) + 0.6);
  return (
    <group>
      <Avenida tema={tema} z0={Z0} z1={Z1} />
      {/* pontos de ônibus e datas */}
      {PONTOS_Z.map((z, i) => (
        <group key={z}>
          <PontoOnibus tema={tema} pos={[PONTO_X, CHAO, z]} sobe={pontoK(i)} aceso={destaque(i)} />
          <PlacaData tema={tema} pos={[PONTO_X - 0.1, CHAO, z + 1.7]} texto={DATAS_TXT[i]} sobe={pontoK(i)} destaque={destaque(i)} />
          {passageiros(i) > 0.02
            ? [0, 1].map((j) => <Pessoa key={j} tema={tema} pos={[PONTO_X - 0.2, CHAO, z - 0.5 + j * 0.8]} rotY={-Math.PI / 2} cor={[F.azul, F.rosa, F.turquesa, F.roxo][(i + j) % 4]} escala={0.3 * Math.min(1, passageiros(i))} />)
            : null}
        </group>
      ))}
      {/* o ônibus protagonista (frente para z−) */}
      {t < T.novembro + 4 ? <Onibus tema={tema} pos={[FAIXA_BUS, CHAO, bz]} rotY={-Math.PI / 2} escala={1} farol={busAnda ? 1 : 0.4} /> : null}
      {/* carros na outra mão */}
      {carros.map((z, i) => (
        <Carro key={i} tema={tema} pos={[-0.8, CHAO, z]} rotY={Math.PI / 2} escala={0.75} cor={[F.azul, tema.objetoClaro, F.rosa, F.turquesa][i]} anda={1} />
      ))}
      {/* 2003: a garagem da Viametro, o contrato e a régua */}
      <Garagem tema={tema} pos={G_VIAMETRO} nome="VIAMETRO" sobe={sobe(T.viametro1)} aceso={Math.max(vis(t, T.viametro1, T.a2024), vis(t, T.empresasOnibus, T.prefRodar), vis(t, T.viametroMais, T.ficam))} portao={0} />
      <DocumentoPe tema={tema} pos={CONTRATO} rotY={0.5} titulo="CONTRATO" sub="30/10/2003 · CLÁUSULA 6ª" escala={rampa(t, T.licitacao1 - 0.1, T.licitacao1 + 0.6)} aceso={Math.max(vis(t, T.oContrato, T.a2024), vis(t, T.naquele, T.ficam))} aditivo={rampa(t, T.aditivo - 0.2, T.aditivo + 0.6)} />
      <ReguaContrato tema={tema} pos={REGUA} sobe={rampa(t, T.renova - 0.2, T.renova + 0.5)} acesos={1 + 4 * rampa(t, T.cincoEm5, T.cincoEm5 + 1.2) + rampa(t, T.a2033 - 0.1, T.a2033 + 0.4) - 5 * rampa(t, T.a2024, T.a2024 + 0.6) + 6 * rampa(t, T.naquele, T.naquele + 1.0) * (1 - rampa(t, T.ficam, T.ficam + 0.5))} hoje={rampa(t, T.a2033 + 0.4, T.a2033 + 0.9)} />
      {/* 2024: a Sutram, as 3 pilhas e o balanço */}
      <PredioSutram tema={tema} pos={SUTRAM} sobe={sobe(T.orgao)} aceso={vis(t, T.sutram, T.prefJa)} luz={rampa(t, T.orgao, T.orgao + 0.8)} />
      <PilhasDinheiro pilhas={[...p24, ...p25, ...p26, ...p35]} max={600} />
      <DocumentoPe tema={tema} pos={BALANCO} rotY={0.5} titulo="BALANÇO 2024" sub="PREFEITURA · DCA · P. 38" escala={rampa(t, T.masBalanco - 0.1, T.masBalanco + 0.6)} aceso={vis(t, T.masBalanco, T.abril25)} />
      {t > T.masBalanco + 0.3 && t < T.abril25 ? <Lupa tema={tema} pos={[BALANCO[0] + 0.35 * Math.sin((t - T.masBalanco) * 2.2), 1.2, BALANCO[2] + 0.5]} rot={[0.3, 0.5, 0]} escala={0.5 * vis(t, T.masBalanco + 0.3, T.abril25 - 0.4)} /> : null}
      {t >= T.guarda - 0.1 && t < T.ondeFoi + 1.4 ? <Interrogacao tema={tema} pos={qPos} sobe={rampa(t, T.guarda - 0.1, T.guarda + 0.5) * (1 - rampa(t, T.ondeFoi + 0.8, T.ondeFoi + 1.2))} aceso={1} escala={0.32 + 0.5 * voo} /> : null}
      {/* 2025: as garagens, a ampulheta, a Câmara, a lei, a prefeitura e os dois bonecos */}
      <Garagem tema={tema} pos={G_SAOMIGUEL} nome="SÃO MIGUEL" sobe={sobe(T.saoMiguel)} aceso={0.6 * (1 - portaoSM) * vis(t, T.saoMiguel, T.maio25)} portao={portaoSM} />
      <Garagem tema={tema} pos={G_ATLANTICO} nome="ATLÂNTICO" sobe={sobe(T.atlEntra)} aceso={Math.max(vis(t, T.atlEntra, T.noMesmo), vis(t, T.empresasOnibus, T.prefRodar), vis(t, T.jaAtl, T.agosto26)) * (1 - portaoAtl)} portao={portaoAtl} />
      <Ampulheta tema={tema} pos={AMPULHETA} sobe={rampa(t, T.leiSo - 0.1, T.leiSo + 0.6)} areia={1 - rampa(t, T.leiSo + 0.6, T.maio26) * 0.88 - rampa(t, T.emergAtl, T.emergAtl + 1.2) * 0.12} vencido={rampa(t, T.emergAtl + 0.8, T.emergAtl + 1.4)} />
      <CamaraVereadores tema={tema} pos={CAMARA} rotY={Math.PI / 2} sobe={sobe(T.noMesmo)} aceso={vis(t, T.noMesmo, T.prefRodar)} />
      <DocumentoPe tema={tema} pos={LEI} rotY={0.5} titulo="LEI DO SUBSÍDIO" sub="R$ 26,4 MI POR ANO" escala={rampa(t, T.aprova - 0.1, T.aprova + 0.6)} aceso={vis(t, T.aprova, T.prefRodar)} />
      <Prefeitura tema={tema} pos={PREF} rotY={Math.PI / 2} sobe={sobe(T.prefRodar - 0.3)} aceso={vis(t, T.prefRodar, T.oposicao) + 0.5 * vis(t, T.doPrefeito, T.resultado)} />
      {t > T.executivo - 0.2 && t < T.maio26 + 0.5 ? (
        <>
          <Boneco tema={tema} pos={BONECO_1} rotY={Math.PI / 2 + 0.5} escala={1.0 * rampa(t, T.executivo - 0.15, T.executivo + 0.45)} cor={tema.objeto} />
          <Boneco tema={tema} pos={BONECO_2} rotY={Math.PI / 2 + 0.5} escala={1.0 * rampa(t, T.doPrefeito - 0.15, T.doPrefeito + 0.45)} cor={tema.objeto} />
        </>
      ) : null}
      {/* 2026: o TCM, a caixa do orçamento e a faixa do ritmo da lei */}
      <PredioTCM tema={tema} pos={TCM} sobe={sobe(T.segundoVer)} aceso={vis(t, T.dadosTcm, T.jaAtl)} escala={0.85} />
      <CaixaOrcamento tema={tema} pos={CAIXA_ORC} sobe={rampa(t, T.n14 - 0.6, T.n14)} nivel={1 - 0.938 * rampa(t, T.n14, T.n14 + 1.2)} />
      {t > T.ritmo - 0.2 && t < T.outubro26 + 0.5 ? (
        <group position={[(X_OURO + X_CINZA) / 2, CHAO + 0.02, RITMO_Z]} scale={[1, 1, Math.max(0.02, vis(t, T.ritmo, T.outubro26))]}>
          <mesh>
            <boxGeometry args={[2.0, 0.03, 0.08]} />
            <meshStandardMaterial color={C.alerta} emissive={C.alerta} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ) : null}
      {/* outubro: o Ministério Público */}
      <PredioColunas tema={tema} pos={MP} aceso={vis(t, T.mp, T.novembro)} escala={rampa(t, T.mp - 0.6, T.mp + 0.4)} />
      {rampa(t, T.mp - 0.6, T.mp + 0.4) > 0.02 ? <Letreiro tema={tema} texto="MP-BA" pos={[MP[0] + 2.4, 0.5, MP[2] + 1.4]} larg={1.2} aceso={vis(t, T.mp, T.novembro)} tam={220} rotY={Math.PI / 2} /> : null}
      {/* novembro: os ônibus novos da Viametro saem da garagem em fila */}
      {novosK > 0.02
        ? [0, 1, 2, 3, 4, 5].map((i) => {
            const k = rampa(t, T.maisLinhas - 0.3 + i * 0.25, T.maisLinhas + 1.4 + i * 0.25);
            return <Onibus key={i} tema={tema} pos={[-0.8 + 1.6 * (i % 2), CHAO, -1 - i * 3.6 - 4 * k]} rotY={-Math.PI / 2} escala={0.9 * Math.min(1, k * 2)} farol={1} />;
          })
        : null}
      {/* as três perguntas no fim da avenida */}
      {PERGUNTAS.map((p, i) => (
        <Interrogacao key={i} tema={tema} pos={p} sobe={rampa(t, T.ficam + 0.6 + i * 0.25, T.ficam + 1.2 + i * 0.25)} aceso={rampa(t, [T.porQue, T.ondeFoi, T.quandoSai][i], [T.porQue, T.ondeFoi, T.quandoSai][i] + 0.6)} escala={1.2} />
      ))}
      {/* placa de tarifa no ponto de maio de 2025 */}
      {rampa(t, T.n480 - 0.2, T.n480 + 0.5) > 0.02 && t < T.maio26 ? (
        <Placa tema={tema} pos={[PONTO_X + 0.5, 1.2 * rampa(t, T.n480 - 0.2, T.n480 + 0.5), PONTOS_Z[3] - 1.8]} rot={[0, -0.4, 0]} larg={1.1} alt={0.5} linhas={[{t: 'TARIFA', tam: 120, cor: tema.tinta, peso: 800, mono: true}, {t: 'R$ 4,80', tam: 210, cor: tema.tinta, peso: 900}]} fundo={tema.branco} />
      ) : null}
      {/* árvores baixas na grama, de cada lado (só fundo) */}
      {Array.from({length: 12}).map((_, i) => (
        <mesh key={i} position={[(i % 2 ? 1 : -1) * 7.8, 0.9, 4 - i * 6]} castShadow>
          <sphereGeometry args={[0.9, 14, 10]} />
          <meshStandardMaterial color={mistura(F.verde, tema.objetoEscuro, 0.35)} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- Câmera ----------
const E = (alvo: V3, larg: number, alt: number, dir: V3) => enquadrar(alvo, larg, alt, dir);
type Cena = {ini: number; chaves: [number, Cam][]; arco?: number};
const AVENIDA = E([0, 0, -27], 10, 30, [0, 1.25, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, AVENIDA]]},
  {ini: T.comoChegamos, arco: 0.03, chaves: [[T.comoChegamos, E([0.6, 0, -24], 8, 22, [0.1, 1.05, 1])], [T.a2003 - 0.2, E([0.6, 0, -18], 8, 18, [0.15, 0.95, 1])]]},
  {
    ini: T.a2003,
    chaves: [
      [T.a2003, E([-0.8, 0.8, 0.8], 8, 6.5, [0.25, 0.8, 1])],
      [T.oContrato, E([-1.6, 0.9, 1.6], 6.4, 5.2, [0.45, 0.78, 1])],
      [T.renova - 0.1, E([2.4, 0.6, -1.6], 5.2, 7, [0.75, 0.85, 1])],
      [T.a2033, E([2.6, 0.6, -2.0], 4.8, 7.4, [0.6, 0.85, 1])],
      [T.a2024 - 0.1, E([2.6, 0.6, -2.4], 4.6, 7.6, [0.5, 0.88, 1])],
    ],
  },
  {
    ini: T.a2024,
    chaves: [
      [T.a2024, E([2.6, 0.6, -9.6], 6.6, 6.2, [0.5, 0.85, 1])],
      [T.orgao, E([0.2, 0.8, -9.4], 11, 7.4, [0.1, 0.85, 1])],
      [T.prefJa, E([-2.2, 0.9, -11.6], 5.4, 4.6, [0.45, 0.72, 1])],
      [T.guarda + 0.3, E([-2.3, 1.0, -11.8], 4.6, 4.2, [0.3, 0.72, 1])],
    ],
  },
  {
    ini: T.abril25,
    chaves: [
      [T.abril25, E([-2.8, 0.9, -17.5], 8, 7.6, [0.7, 0.8, 1])],
      [T.maio25, E([-2.8, 0.9, -22.4], 8, 7.6, [0.7, 0.8, 1])],
      [T.leiSo, E([-2.6, 1.0, -22.6], 5.6, 5.2, [0.6, 0.75, 1])],
      [T.noMesmo, E([-3.2, 1.0, -27.8], 7.2, 6.2, [0.7, 0.8, 1])],
      [T.n22, E([-3.0, 1.0, -28.0], 6.8, 6.0, [0.6, 0.8, 1])],
    ],
  },
  {ini: T.prefRodar, arco: 0.03, chaves: [[T.prefRodar, E([-0.8, 0.6, -28.5], 11, 11, [0.25, 1.15, 1])], [T.eMais - 0.2, E([-1.0, 0.6, -29.0], 10.4, 10.4, [0.3, 1.15, 1])]]},
  {ini: T.eMais, chaves: [[T.eMais, E([-2.6, 1.0, -32.2], 5.6, 4.8, [0.65, 0.56, 1])], [T.resultado - 0.2, E([-2.4, 1.0, -32.6], 4.8, 4.4, [0.55, 0.55, 1])]]},
  {ini: T.resultado, chaves: [[T.resultado, E([4.4, 0.4, -19.6], 4, 14, [0.6, 0.95, 1])], [T.maio26 - 0.2, E([4.4, 0.4, -20.0], 3.8, 13.5, [0.5, 0.92, 1])]]},
  {
    ini: T.maio26,
    chaves: [
      [T.maio26, E([-2.6, 0.9, -23.4], 6.4, 6.0, [0.6, 0.75, 1])],
      [T.segundoVer, E([-3.4, 1.0, -30.5], 8.5, 13.5, [0.75, 0.95, 1])],
      [T.n35 - 0.2, E([-2.8, 0.8, -25.2], 6.4, 6.2, [0.6, 0.8, 1])],
      [T.agosto26 - 0.2, E([-3.0, 0.8, -25.0], 7.0, 6.6, [0.55, 0.8, 1])],
    ],
  },
  {
    ini: T.agosto26,
    chaves: [
      [T.agosto26, E([4.6, 0.3, -25.5], 5, 34, [0.35, 1.45, 1])],
      [T.n21 - 0.3, E([4.6, 0.4, -41.6], 4.6, 11, [0.6, 1.0, 1])],
      [T.n14 - 0.4, E([5.4, 0.5, -41.0], 5.4, 9.5, [0.85, 0.95, 1])],
      [T.outros11 - 0.2, E([4.8, 0.4, -42.0], 4.6, 10, [0.7, 1.0, 1])],
      [T.outubro26 - 0.2, E([4.8, 0.4, -42.4], 4.4, 9.6, [0.6, 1.0, 1])],
    ],
  },
  {ini: T.outubro26, chaves: [[T.outubro26, E([-3.0, 1.0, -49.4], 9, 8, [0.65, 0.8, 1])], [T.novembro, E([-3.2, 1.0, -49.8], 8.4, 7.6, [0.55, 0.8, 1])]]},
  {ini: T.novembro, chaves: [[T.novembro, E([-2.4, 0.8, 0.8], 9, 8, [0.7, 0.85, 1])]]},
  {
    ini: T.viametroMais,
    chaves: [
      [T.viametroMais, E([-2.0, 0.8, -2.0], 9.4, 10, [0.55, 0.9, 1])],
      [T.naquele, E([-2.3, 1.0, 2.6], 4.6, 4.2, [0.55, 0.72, 1])],
      [T.semLicNova2, E([0.2, 0.7, 0.0], 9, 8.4, [0.5, 0.88, 1])],
    ],
  },
  {
    ini: T.ficam,
    chaves: [
      [T.ficam, E([0, 0.5, -22], 10, 40, [0, 1.15, 1])],
      [T.porQue - 0.3, E([0, 1.4, -62], 6.6, 4.8, [0, 0.42, 1])],
      [T.onibusSeu, E([0, 1.4, -62], 6.0, 4.5, [0.08, 0.42, 1])],
    ],
  },
  {ini: T.onibusSeu, chaves: [[T.onibusSeu, AVENIDA]]},
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
  return cinematizar(trilhoCam(t, c.chaves), (t - c.ini) / (fim - c.ini), {arco: c.arco ?? 0.05, grua: 0.025});
};

// ---------- Interface: as faixas da tela ----------
// A (286 a 390): marca e pílula · B (404 a 500): cartão da FONTE · C (520 a 630): data grande OU chip OU os dois lados
// D (650 a 1340): o 3D e os rótulos presos aos objetos (no máximo 2) · E (1370 a 1524): legenda
const FAIXA_B = 404;
const FAIXA_C = 520;
const D_TOPO = 650;
const D_BASE = 1330;

type Txt = {a: number; texto: string; destaque?: boolean; alerta?: boolean};
// cartão da fonte: troca junto com a fala e nunca some
const FONTES: Txt[] = [
  {a: 0, texto: 'RREO DA PREFEITURA · DEZ/2024 P. 6 · AGO/2026 P. 8'},
  {a: T.anoAno, texto: 'PORTAL DA TRANSPARÊNCIA DE ILHÉUS · TESOURO NACIONAL (SICONFI)'},
  {a: T.a2003, texto: 'CONTRATO DE CONCESSÃO DE 30/10/2003 · CLÁUSULA 6ª'},
  {a: T.contaFecha, texto: 'RREO DEZ/2024 · P. 6 · LOA 2024 (LEI 4.247) · P. 9'},
  {a: T.prefJa, texto: 'NOTA DA PREFEITURA · PIMENTA, 14/05/2025'},
  {a: T.masBalanco, texto: 'BALANÇO ANUAL 2024 DA PREFEITURA (DCA) · P. 38'},
  {a: T.abril25, texto: 'CLASSE POLÍTICA, 12/04/2025'},
  {a: T.atlEntra, texto: 'PNCP · DISPENSA 014/2025 · LEI 14.133, ART. 75, VIII'},
  {a: T.noMesmo + 0.8, texto: 'PL 034/2025 · A TARDE, 22/05/2025'},
  {a: T.prefRodar, texto: 'NOTA DA PREFEITURA · PIMENTA, 14/05/2025'},
  {a: T.oposicao, texto: 'VEREADOR MAURÍCIO GALVÃO · NOTÍCIAS DA BAHIA, 14/05/2025'},
  {a: T.segundoSites, texto: 'PIMENTA, 14/05/2025 · A TARDE, 15/05/2025'},
  {a: T.resultado, texto: 'RREO DEZ/2025 · P. 4 · BALANÇO ANUAL 2025'},
  {a: T.maio26, texto: 'ILHÉUS NET, 26/05/2026 · LEI 14.133, ART. 75'},
  {a: T.segundoVer, texto: 'VEREADORA ENILDA MENDONÇA · DADOS DO E-TCM · 01/09/2026'},
  {a: T.jaAtl, texto: 'A EMPRESA, VIA ILHÉUS EVENTOS, 21/10/2026'},
  {a: T.agosto26, texto: 'RREO AGO/2026 · P. 8 · SUBFUNÇÃO 453'},
  {a: T.outros11, texto: 'RREO AGO/2026 · P. 8 · LOA 2026 (LEI 4.369) · P. 101'},
  {a: T.outubro26, texto: 'MPBA · ACORDO DE 19/10/2026'},
  {a: T.novembro, texto: 'PREFEITURA DE ILHÉUS · ANÚNCIO DE 01/11/2026'},
  {a: T.viametroMais, texto: 'DIÁRIO OFICIAL DE ILHÉUS, 29/10/2026 · ADITIVO'},
  {a: T.ficam, texto: 'TODOS OS DOCUMENTOS ESTÃO NA LEGENDA DO POST'},
  {a: T.onibusSeu, texto: 'PORTAL DA TRANSPARÊNCIA DE ILHÉUS'},
];

// a data grande (faixa C), por 2,5 s depois de cada data
const DATAS: Txt[] = [
  {a: T.a2003, texto: '2003'},
  {a: T.a2024, texto: '2024'},
  {a: T.abril25, texto: 'ABRIL DE 2025'},
  {a: T.maio25, texto: 'MAIO DE 2025'},
  {a: T.maio26, texto: 'MAIO DE 2026'},
  {a: T.agosto26, texto: 'AGOSTO DE 2026'},
  {a: T.outubro26, texto: 'OUTUBRO DE 2026'},
];
const DUR_DATA = 2.5;

// chips (faixa C): só entram quando não há data na faixa; cada um fica até o próximo ou até `b`
type ChipT = Txt & {b: number};
const CHIPS: ChipT[] = [
  {a: T.documentos, b: T.a2003, texto: 'DOCUMENTOS OFICIAIS DA PREFEITURA'},
  {a: T.licitacao1, b: T.renova, texto: 'VENCEU UMA LICITAÇÃO'},
  {a: T.renova, b: T.semLicNova, texto: 'SE RENOVA SOZINHO, DE 5 EM 5 ANOS'},
  {a: T.semLicNova, b: T.a2024, texto: 'ATÉ 2033 SEM NOVA LICITAÇÃO', destaque: true},
  {a: T.onibusNem, b: T.prefJa, texto: 'ÔNIBUS: R$ 0 NESSA CONTA'},
  {a: T.prefJa, b: T.masBalanco, texto: 'A PREFEITURA DIZ: JÁ PAGAVA, POR ACORDO NA JUSTIÇA'},
  {a: T.guarda, b: T.abril25, texto: 'GUARDA ISSO', alerta: true},
  {a: T.semLicPor, b: T.noMesmo, texto: 'SEM LICITAÇÃO · POR EMERGÊNCIA'},
  {a: T.aprova, b: T.prefRodar, texto: 'A CÂMARA APROVA O SUBSÍDIO'},
  {a: T.segundoSites, b: T.cunhado, texto: 'SEGUNDO OS SITES PIMENTA E A TARDE'},
  {a: T.cunhado, b: T.reportagens, texto: 'CUNHADOS, SEGUNDO PIMENTA E A TARDE'},
  {a: T.reportagens, b: T.resultado, texto: 'AS REPORTAGENS NÃO TRAZEM RESPOSTA DA PREFEITURA', alerta: true},
  {a: T.semLicEla, b: T.segundoVer, texto: 'SEM LICITAÇÃO, SEGUE RODANDO', alerta: true},
  {a: T.dadosTcm, b: T.jaAtl, texto: 'SEGUNDO A VEREADORA ENILDA'},
  {a: T.jaAtl, b: T.agosto26, texto: 'SEGUNDO A EMPRESA'},
  {a: T.tira, b: T.novembro, texto: 'A ATLÂNTICO SAI DA CIDADE · 31/10/2026'},
  {a: T.maisLinhas, b: T.semLicNova2, texto: '30 ÔNIBUS NOVOS (SEGUNDO A PREFEITURA)'},
  {a: T.semLicNova2, b: T.ficam, texto: 'SEM LICITAÇÃO NOVA', destaque: true},
  {a: T.ficam, b: T.porQue, texto: 'TRÊS PERGUNTAS SEM RESPOSTA OFICIAL', alerta: true},
  {a: T.porQue, b: T.ondeFoi, texto: '1. POR QUE O SUBSÍDIO PASSOU DO RITMO DA LEI?', alerta: true},
  {a: T.ondeFoi, b: T.quandoSai, texto: '2. ONDE ESTÁ O DINHEIRO DE 2024 NO BALANÇO?', alerta: true},
  {a: T.quandoSai, b: T.onibusSeu, texto: '3. QUANDO SAI A LICITAÇÃO?', alerta: true},
];

// rótulos presos aos objetos (faixa D)
type Rot = {a: number; b: number; p: V3; valor: string; sub?: string; cor?: 'acento' | 'alerta'};
const ROT_PILHA = (x: number, z: number, n: number): V3 => [x, 0.1 + 0.6, z - ((n - 1) * PASSO) / 2];
const ROTULOS: Rot[] = [
  {a: T.a2033, b: T.a2024, p: soma(REGUA, [0, 0.8, -6]), valor: 'ATÉ 2033', sub: '30 ANOS', cor: 'acento'},
  {a: T.n3, b: T.abril25, p: ROT_PILHA(X_CINZA, Z_2024, 3), valor: '3 MI', sub: 'R$ 3,02 MI · 2024', cor: 'acento'},
  {a: T.sutram, b: T.prefJa, p: soma(SUTRAM, [1, 2.4, 0]), valor: 'ERA SÓ A SUTRAM', sub: 'ÓRGÃO DE TRÂNSITO'},
  {a: T.naoMostra, b: T.abril25, p: soma(BALANCO, [0, 2.0, 0]), valor: 'R$ 0', sub: 'REPASSE A EMPRESA · BALANÇO 2024', cor: 'alerta'},
  {a: T.leiSo, b: T.noMesmo, p: soma(AMPULHETA, [0, 2.2, 0]), valor: 'PRAZO MÁXIMO: 1 ANO', sub: 'LEI 14.133, ART. 75, VIII'},
  {a: T.n264, b: T.prefRodar, p: soma(LEI, [0, 2.0, 0]), valor: 'R$ 26,4 MI POR ANO', sub: 'SUBSÍDIO ÀS EMPRESAS', cor: 'acento'},
  {a: T.n22, b: T.prefRodar, p: soma(CAMARA, [1.4, 3.2, 0]), valor: 'R$ 2,2 MI POR MÊS'},
  {a: T.executivo, b: T.resultado, p: soma(BONECO_1, [0.3, 1.5, 0.3]), valor: 'PAULO CARLETTO', sub: 'DIRETOR-EXECUTIVO DA VIAMETRO'},
  {a: T.doPrefeito, b: T.resultado, p: soma(BONECO_2, [-0.4, 1.5, -0.3]), valor: 'VALDERICO JÚNIOR', sub: 'PREFEITO'},
  {a: T.n12 - 0.4, b: T.maio26, p: ROT_PILHA(X_OURO, Z_2025, 8), valor: '12 MI', sub: '7,35 SUBSÍDIO + 4,65 SUTRAM · 2025', cor: 'acento'},
  {a: T.n12, b: T.maio26, p: ROT_PILHA(X_CINZA, Z_2024, 3), valor: '2024: 3 MI'},
  {a: T.emergAtl + 0.8, b: T.segundoVer, p: soma(AMPULHETA, [0, 2.2, 0]), valor: 'PRAZO VENCIDO', sub: 'MAIO DE 2026', cor: 'alerta'},
  {a: T.n35, b: T.agosto26, p: soma(PILHA_ATL, [0, 1.2, 0]), valor: 'R$ 3,5 MI DEPOIS DO CONTRATO', sub: '29/05 A 31/07/2026 · SEGUNDO A VEREADORA', cor: 'alerta'},
  {a: T.n16, b: T.agosto26, p: soma(G_ATLANTICO, [1.2, 3.0, 0]), valor: 'R$ 16 MI A RECEBER', sub: 'SEGUNDO A EMPRESA', cor: 'alerta'},
  {a: T.n32, b: T.n21, p: ROT_PILHA(X_OURO, Z_2026, 21), valor: '32 MI', sub: 'ATÉ AGO/2026 · R$ 32,36 MI', cor: 'acento'},
  {a: T.n21, b: T.outros11, p: ROT_PILHA(X_OURO, Z_2026, 10), valor: '21 MI · SUBSÍDIO', sub: 'R$ 21,24 MI ATÉ AGOSTO', cor: 'acento'},
  {a: T.ritmo, b: T.outros11, p: [X_OURO, 0.5, RITMO_Z], valor: 'LEI: 17,6 EM 8 MESES', sub: '2,2 × 8', cor: 'alerta'},
  {a: T.n14, b: T.outros11, p: soma(CAIXA_ORC, [0, 2.4, 0]), valor: 'SOBROU R$ 1,4 MI', sub: 'PARA SETEMBRO A DEZEMBRO', cor: 'alerta'},
  {a: T.outros11, b: T.outubro26, p: ROT_PILHA(X_CINZA, Z_2026, 11), valor: '11 MI · ADMINISTRAÇÃO', sub: 'R$ 11,13 MI ATÉ AGOSTO'},
  {a: T.n86, b: T.chegou19, p: soma(ROT_PILHA(X_CINZA, Z_2026, 22), [0, 0.2, 0]), valor: 'ORÇAMENTO: 8,6 MI', sub: 'NO COMEÇO DE 2026'},
  {a: T.chegou19, b: T.outubro26, p: soma(ROT_PILHA(X_CINZA, Z_2026, 22), [0, 0.2, 0]), valor: '8,6 → 19 MI', sub: 'ORÇAMENTO DA ADMINISTRAÇÃO', cor: 'alerta'},
];

const visTxt = (a: number, b: number, t: number) => entra(t, a, 0.45) * (1 - rampa(t, b - 0.35, b - 0.05));
const atual = (lista: Txt[], t: number) => lista.filter((x) => t >= x.a).pop();

const Interface: React.FC<{tema: Tema; t: number; cam: Cam}> = ({tema, t, cam}) => {
  const C = coresON(tema);
  // B: o cartão da fonte (sempre presente)
  const fonte = atual(FONTES, t)!;
  const fonteK = fonte.a === 0 ? 1 : 0.35 + 0.65 * entra(t, fonte.a, 0.45);
  const cartaoFonte = (
    <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: FAIXA_B, height: 92, padding: '10px 18px', borderRadius: 14, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, boxSizing: 'border-box'}}>
      <div style={{fontFamily: MONO, fontSize: 20, fontWeight: 800, letterSpacing: 3, color: tema.acento}}>FONTE</div>
      <div style={{fontFamily: MONO, fontSize: fonte.texto.length > 56 ? 21 : 24, fontWeight: 700, letterSpacing: 1, color: tema.texto, whiteSpace: 'nowrap', overflow: 'hidden', opacity: fonteK, marginTop: 4}}>{fonte.texto}</div>
    </div>
  );
  // C: data grande, ou chip, ou os dois lados
  const data = DATAS.filter((d) => t >= d.a && t < d.a + DUR_DATA).pop();
  const fimData = (a: number) => {
    const d = DATAS.filter((x) => x.a <= a + 0.01 && x.a + DUR_DATA > a).pop();
    return d ? d.a + DUR_DATA : a;
  };
  let faixaC: React.ReactNode = null;
  const ladosK = visTxt(T.prefRodar, T.eMais, t);
  if (data) {
    const k = entra(t, data.a, 0.4) * (1 - rampa(t, data.a + DUR_DATA - 0.4, data.a + DUR_DATA));
    faixaC = (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: FAIXA_C, display: 'flex', justifyContent: 'center', opacity: k, transform: `scale(${0.92 + 0.08 * k})`}}>
        <div style={{fontFamily: FONTE, fontSize: 92, fontWeight: 900, letterSpacing: -2, lineHeight: 1, color: tema.texto, textShadow: `0 4px 22px ${tema.fundo}`}}>{data.texto}</div>
      </div>
    );
  } else if (ladosK > 0.01) {
    const lado = (titulo: string, l1: string, l2: string, a1: number, a2: number) => (
      <div style={{flex: 1, padding: '10px 14px', borderRadius: 14, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, opacity: entra(t, a1, 0.45), minHeight: 104, boxSizing: 'border-box'}}>
        <div style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, letterSpacing: 2.5, color: tema.textoSuave}}>{titulo}</div>
        <div style={{fontFamily: FONTE, fontSize: 21, fontWeight: 800, color: tema.texto, lineHeight: 1.15, marginTop: 4}}>{l1}</div>
        {t >= a2 ? <div style={{fontFamily: FONTE, fontSize: 21, fontWeight: 800, color: tema.texto, lineHeight: 1.15, marginTop: 3, opacity: entra(t, a2, 0.45)}}>{l2}</div> : null}
      </div>
    );
    faixaC = (
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: FAIXA_C, display: 'flex', gap: 16, opacity: Math.min(1, ladosK * 1.2)}}>
        {lado('A PREFEITURA DIZ', 'Rodar custa mais que as passagens.', 'Sem subsídio, a passagem de R$ 4,80 subiria.', T.prefRodar, T.semSub)}
        {lado('A OPOSIÇÃO DIZ', 'Sem planilha de custos.', 'Sem garantia de ônibus melhor.', T.oposicao, T.semGarantia)}
      </div>
    );
  } else {
    const chip = CHIPS.filter((c) => t >= Math.max(c.a, fimData(c.a)) - 0.05 && t < c.b).pop();
    if (chip) {
      const a = Math.max(chip.a, fimData(chip.a));
      const k = entra(t, a, 0.45) * (1 - rampa(t, chip.b - 0.35, chip.b - 0.05));
      if (k > 0.01)
        faixaC = (
          <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: FAIXA_C + 14, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.3)}}>
            <div style={{padding: '12px 22px', borderRadius: 14, background: tema.cartao, border: `2px solid ${chip.alerta ? C.alerta : chip.destaque ? tema.acento : tema.cartaoBorda}`, fontFamily: MONO, fontSize: chip.texto.length > 40 ? 22 : chip.texto.length > 28 ? 26 : 30, fontWeight: 800, letterSpacing: 1.5, color: chip.alerta ? mistura(C.alerta, tema.texto, 0.45) : chip.destaque ? tema.acento : tema.texto, whiteSpace: 'nowrap', transform: `translateY(${(1 - Math.min(1, k)) * 10}px)`}}>{chip.texto}</div>
          </div>
        );
    }
  }
  if (noMapa(t)) {
    const comentaK = vis(t, T.meConta + 0.9, FIM);
    const arrobaK = rampa(t, T.segue, T.segue + 0.4);
    return (
      <>
        {cartaoFonte}
        {comentaK > 0.01 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: FAIXA_C, display: 'flex', justifyContent: 'center'}}>
            <div style={{padding: '14px 34px', borderRadius: 20, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center', opacity: Math.min(1, comentaK)}}>
              <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: tema.texto}}>O ÔNIBUS DO SEU BAIRRO MELHOROU?</div>
              {arrobaK > 0.01 ? <div style={{fontFamily: FONTE, fontSize: 52, fontWeight: 800, color: tema.acento, marginTop: 4, opacity: arrobaK}}>@eumagnoleite</div> : null}
            </div>
          </div>
        ) : null}
      </>
    );
  }
  // D: rótulos (no máximo 2, os mais recentes; um à esquerda e outro à direita se encostarem)
  const placarK = vis(t, T.contaFecha, T.outubro26);
  const topoD = D_TOPO + (placarK > 0.01 ? 60 : 0);
  const visRot = ROTULOS.map((r, i) => {
    const k = entra(t, r.a, 0.45) * (1 - rampa(t, r.b - 0.35, r.b - 0.05));
    if (k <= 0.01) return null;
    const pj = projetar(r.p, cam, W, H);
    if (!pj.visivel) return null;
    return {i, x: Math.max(SEGURO.esq + 230, Math.min(SEGURO.botoesX - 230, pj.x)), y: Math.max(topoD + 96, Math.min(D_BASE, pj.y)), k: Math.min(1, k), r};
  })
    .filter(Boolean)
    .slice(-2) as {i: number; x: number; y: number; k: number; r: Rot}[];
  if (visRot.length === 2 && Math.abs(visRot[0].x - visRot[1].x) < 470 && Math.abs(visRot[0].y - visRot[1].y) < 130) {
    // um embaixo do outro, centrados: o mais antigo em cima, o mais novo logo abaixo
    const [velho, novo] = [visRot[0], visRot[1]];
    velho.x = novo.x = (SEGURO.esq + SEGURO.botoesX) / 2;
    velho.y = Math.min(velho.y, D_BASE - 122);
    novo.y = velho.y + 122;
  }
  const cor = (c?: 'acento' | 'alerta') => (c === 'acento' ? tema.acento : c === 'alerta' ? C.alerta : tema.cartaoBorda);
  return (
    <>
      {cartaoFonte}
      {faixaC}
      {placarK > 0.01 ? (
        <div style={{position: 'absolute', right: W - SEGURO.dir, top: D_TOPO, opacity: Math.min(1, placarK), display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: tema.cartao, border: `1.5px solid ${tema.cartaoBorda}`}}>
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.ouro}} />
          <div style={{width: 18, height: 18, borderRadius: 9, background: C.sutram}} />
          <div style={{fontFamily: MONO, fontSize: 17, fontWeight: 800, letterSpacing: 1.5, color: tema.texto}}>1 PILHA = R$ 1 MILHÃO</div>
        </div>
      ) : null}
      {visRot.map((v) => (
        <div key={v.i} style={{position: 'absolute', left: v.x, top: v.y, transform: `translate(-50%, -100%) translateY(${(1 - v.k) * 12}px)`, opacity: v.k}}>
          <div style={{padding: '8px 18px 9px', borderRadius: 14, background: tema.cartao, border: `2px solid ${cor(v.r.cor)}`, textAlign: 'center', whiteSpace: 'nowrap'}}>
            <div style={{fontFamily: FONTE, fontSize: v.r.valor.length > 18 ? 32 : 40, fontWeight: 900, letterSpacing: -1, color: v.r.cor === 'acento' ? tema.acento : v.r.cor === 'alerta' ? mistura(C.alerta, tema.texto, 0.4) : tema.texto, lineHeight: 1.05}}>{v.r.valor}</div>
            {v.r.sub ? <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, letterSpacing: 1.2, color: tema.textoSuave, marginTop: 3}}>{v.r.sub}</div> : null}
          </div>
        </div>
      ))}
    </>
  );
};

// ---------- Os mapas do Kit Mapas, por cima do 3D ----------
const TrechoMapa: React.FC<{de: number; ate: number; origem: number; entrada: number}> = ({de, ate, origem, entrada}) => {
  const f = useCurrentFrame();
  const dur = ate - de;
  const op = entrada > 0 ? interpolate(f, [0, entrada, dur - 6, dur], [0, 1, 1, 0], clamp) : interpolate(f, [dur - 6, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <OffthreadVideo src={staticFile(`${P}/mapas/onibus.mp4`)} startFrom={origem} muted style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.1, f: 'whoosh', v: 0.2}));
  DATAS.forEach((d) => s.push({t: d.a + 0.05, f: 'tique', v: 0.18}));
  [T.meses, T.n3, T.n264, T.n22, T.n12, T.n35, T.n16, T.n32, T.n21, T.n14, T.outros11, T.n86, T.chegou19, T.assume, T.n30].forEach((t) => s.push({t, f: 'pop', v: 0.2}));
  s.push({t: T.dez, f: 'impacto', v: 0.2});
  [0, 1, 2, 3, 4, 5, 6].forEach((i) => s.push({t: T.anoAno + i * 0.25 + 0.1, f: 'pop', v: 0.09}));
  s.push({t: T.cincoEm5, f: 'subida', v: 0.18});
  s.push({t: T.a2033, f: 'ding', v: 0.16});
  s.push({t: T.naoMostra, f: 'baque', v: 0.22});
  s.push({t: T.deixa + 0.4, f: 'baque', v: 0.2});
  s.push({t: T.aprova + 0.3, f: 'impacto', v: 0.2});
  s.push({t: T.conta2025, f: 'subida', v: 0.18});
  s.push({t: T.emergAtl + 1.0, f: 'bip', v: 0.2});
  s.push({t: T.contaChega, f: 'subida', v: 0.2});
  s.push({t: T.ritmo, f: 'baque', v: 0.18});
  s.push({t: T.tira + 0.4, f: 'baque', v: 0.2});
  s.push({t: T.brisa, f: 'pop', v: 0.16});
  s.push({t: T.aditivo + 0.3, f: 'impacto', v: 0.2});
  [T.porQue, T.ondeFoi, T.quandoSai].forEach((t) => s.push({t, f: 'bip', v: 0.16}));
  s.push({t: T.meConta, f: 'pop', v: 0.2});
  s.push({t: T.segue, f: 'pop', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.0, T.dez + 0.6, T.de2024 + 0.6, T.anoAno + 1.6, T.a2003 + 1.2, T.licitacao1 + 1.0, T.a2033 + 0.8, T.a2024 + 1.0, T.n3 + 1.0, T.sutram + 0.6, T.prefJa + 1.4, T.naoMostra + 0.8, T.guarda + 0.6,
  T.abril25 + 1.0, T.deixa + 0.9, T.maio25 + 1.2, T.semLicPor + 0.8, T.leiSo + 0.8, T.aprova + 0.8, T.n264 + 0.8, T.n22 + 0.6, T.semSub + 1.4, T.semGarantia + 0.8, T.executivo + 0.8,
  T.cunhado + 0.6, T.reportagens + 0.8, T.n12 + 0.8, T.maio26 + 1.2, T.emergAtl + 1.6, T.n35 + 1.0, T.n16 + 0.8, T.agosto26 + 1.2, T.n32 + 0.6, T.n21 + 0.6, T.ritmo + 0.6, T.n14 + 1.0,
  T.outros11 + 0.6, T.chegou19 + 0.5, T.outubro26 + 1.2, T.tira + 0.8, T.assume + 1.0, T.brisa + 0.8, T.maisLinhas + 1.0, T.aditivo + 0.8, T.semLicNova2 + 0.4, T.ficam + 1.6, T.porQue + 0.8,
  T.ondeFoi + 1.0, T.quandoSai + 0.4, T.seuBairro + 1.0, T.segue + 1.2, FIM - 0.4,
];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const OnibusIlheus: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
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
  const mundo = soMapa(t) ? null : (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={240} sombraArea={14} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.4} />
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
      <Sequence from={MAPA_C.de} durationInFrames={MAPA_C.ate - MAPA_C.de} layout="none">
        <TrechoMapa {...MAPA_C} />
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
      <Marca tema={tema} serie={SERIE} assunto="Ônibus de Ilhéus" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa ----------
export const TITULO_CAPA = ['Ilhéus paga', 'o ônibus?', '32 milhões', 'em 8 meses.'];
export const CapaOnibusIlheus: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 300}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ÔNIBUS DE ILHÉUS`} t={1} troca={0} y={SEGURO.topo + 160} />
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
