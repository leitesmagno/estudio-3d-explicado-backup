import React from 'react';
import {Boneco, Caixa, Placa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Congresso, PilhaMoedas} from '../../pecas';
import {MOEDAS_POR_PILHA, MesaMaquete, PilhasDinheiro, PostoSaude, PredioAssistencia, Prefeitura, type Pilha} from '../orcamentoitabuna/pecas';
import {PredioTexto} from '../orcamentocanavieiras/pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, parado, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from './Base';
import {PALAVRAS} from './palavras';

// 235. emendas em Ilhéus, versão 4: MAQUETE de Ilhéus no padrão do 093 (MesaMaquete, casinhas das secretarias com placa de nome na frente,
// moedas voando até cada casinha, plaquinhas de valor presas aos objetos, CabecalhoCidade). Estúdio 3D + Kit Mapas (abertura).
// Cor fixa por caminho: saúde = azul do tema, Prefeitura = acento (verde). Dados: FNS, CGU e TCU (audio/fontes.md v4).
// Regras: parlamentar só como texto (verbo "indicou"), sem prefeito/vereador, RP9 sem nome, empresa e fábrica sem nome nem logo.

const P = '235. emendas em ilhéus';
const AUDIO_SEG = 177.0;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  mas: quando('Esse dinheiro chega'),
  soSaude: quando('um só para a saúde'),
  resto: quando('e outro para a Prefeitura'),
  casinha: quando('casinha por casinha'),
  vem: quando('Vem comigo'),
  basico: quando('Primeiro, o básico'),
  indica: quando('Ele indica'),
  recebe: quando('Quem recebe e executa'),
  c1: quando('Caminho um'),
  v54: quando('Foram 54'),
  direto: quando('direto do Fundo Nacional'),
  fundoAFundo: quando('de fundo para fundo'),
  custeio: quando('Quase tudo é custeio'),
  basica: quando('32 milhões'),
  mac: quando('E 20 milhões'),
  secreto: quando('E aqui aparece'),
  v9: quando('Desses 54'),
  relGeral: quando('só como relator-geral'),
  stf: quando('O Supremo derrubou'),
  naSaude: quando('Na saúde também'),
  alex: quando('Alex Santana'),
  leurS: quando('Leur Lomanto Júnior'),
  c2: quando('Caminho dois'),
  v21: quando('Foram 21'),
  conv: quando('A primeira é'),
  pav: quando('pavimentação, drenagem'),
  v1075: quando('Foram 10 milhões e 750'),
  pixS: quando('A segunda é a emenda Pix'),
  v108: quando('Foram 10 milhões e 800'),
  casaPix: quando('Agora, a emenda Pix'),
  infra: quando('Para a Secretaria de Infraestrutura'),
  v729: quando('7 milhões e 290'),
  pracas: quando('Para praças'),
  v309: quando('3 milhões e 90'),
  social: quando('E para a Secretaria de Promoção'),
  v233: quando('233 mil'),
  pod: quando('E quem mais indicou emenda Pix'),
  p1: quando('em primeiro'),
  p2: quando('Em segundo'),
  p3: quando('Em terceiro'),
  entrou: quando('E o dinheiro entrou mesmo'),
  conferi: quando('Conferi no Tribunal'),
  bate: quando('A emenda Pix bate'),
  v25: quando('941 mil') - 0.9,
  v26: quando('538 mil') - 0.9,
  despesas: quando('E nas despesas'),
  tcu: quando('O painel do Tribunal'),
  somando: quando('Somando os dois'),
  detalhe: quando('E atenção'),
  q47: quando('47 milhões'),
  tirei: quando('e ficaram fora'),
  todos: quando('Todos os valores'),
  voce: quando('Você sabia'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'EMENDAS EM ILHÉUS'], [T.basico, 'O BÁSICO'], [T.c1, 'CAMINHO 1 · SAÚDE'], [T.c2, 'CAMINHO 2 · PREFEITURA'], [T.casaPix, 'PIX CASINHA POR CASINHA'],
  [T.pod, 'QUEM MAIS INDICOU PIX'], [T.entrou, 'CONFERÊNCIA'], [T.somando, 'LISTA COMPLETA'], [T.detalhe, 'FORA DA CONTA'], [T.todos, 'OS DOIS CAMINHOS'],
];

// trecho de mapa (Kit Mapas): da abertura até "Mas esse dinheiro chega"
const TR: [number, number][] = [[0, T.mas]];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

// ---------- Lugares: a maquete de Ilhéus (mesa redonda de raio 9) e dois palcos fora dela ----------
const ABRE: V3 = [0, 0, 0];
const CONG: V3 = [0, 0, -7.4];
const PREF: V3 = [0, 0, 0.2];
const FNS: V3 = [-8.0, 0, 1.4];
const SAU: V3 = [-4.8, 0, 1.4];
const INF: V3 = [4.8, 0, 1.4];
const SOC: V3 = [-3.6, 0, 5.0];
const PRA: V3 = [3.6, 0, 5.0];
const RK: V3 = [40, 0, 0];
const FAB: V3 = [60, 0, 0];
const PODIO: V3 = [80, 0, 0];
const FRENTE = (c: V3, dz: number, dx = 0): V3 => [c[0] + dx, 0, c[2] + dz];

// ---------- Dados (iguais ao audio/fontes.md v4) ----------
const MI = (v: number) => `${(Math.round(v / 10000) / 100).toFixed(2).replace('.', ',')} MI`;
const MIL = (v: number) => `${(Math.round(v / 10) / 100).toFixed(2).replace('.', ',')} MIL`;
const fmt = (v: number) => (v >= 1e6 - 5000 ? MI(v) : MIL(v));
// item 20 (saúde, FNS) e item 22 (Prefeitura, CGU); nomes encurtados para a letra ficar grande; "sem informação" fica de fora
const RK_SAUDE: [string, number][] = [
  ['RELATOR-GERAL', 9000000], ['COMISSÃO DE SAÚDE', 4572000], ['ALEX SANTANA', 4000000], ['LEUR LOMANTO JR.', 3870000], ['BACELAR', 3500000],
  ['MÁRCIO MARINHO', 3499991], ['DAYANE PIMENTEL', 3300000], ['RONALDO CARLETTO', 3068449], ['JORGE SOLLA', 2754281], ['BANCADA DA BAHIA', 2554126],
  ['JOÃO LEÃO', 2500000], ['ERIVELTON SANTANA', 2482961], ['ROGÉRIA SANTOS', 1400000], ['BEBETO', 1000000], ['ARTHUR O. MAIA', 1000000],
  ['LÍDICE DA MATA', 999996], ['IGOR KANNÁRIO', 910339], ['IRMÃO LÁZARO', 800000], ['ANTÔNIO BRITO', 700000], ['PAULO MAGALHÃES', 425000],
  ['RAIMUNDO COSTA', 360000], ['CACÁ LEÃO', 320000], ['CLÁUDIO CAJADO', 300000], ['DAL BARRETO', 300000], ['ÂNGELO CORONEL', 300000], ['ALICE PORTUGAL', 299930],
];
const RK_PREF: [string, number][] = [
  ['LEUR LOMANTO JR.', 4834237.53], ['BEBETO', 3765146.47], ['ANTÔNIO BRITO', 2578610.14], ['PAULO MAGALHÃES', 2490009.52], ['JOÃO LEÃO', 1990000],
  ['JORGE SOLLA', 1679000], ['IRMÃO LÁZARO', 1132243.78], ['MÁRCIO MARINHO', 944166.67], ['BACELAR', 698000], ['LÍDICE DA MATA', 400000],
  ['DAYANE PIMENTEL', 364825], ['JOSIAS GOMES', 300000], ['JOSEILDO RAMOS', 200000], ['ERIVELTON SANTANA', 136986.3], ['CLÁUDIO CAJADO', 49170], ['RELATOR-GERAL', 27145.06],
];
// duas telas de rolagem, cada uma com pelo menos 4 s no ar
const TELA = [
  {nome: 'SAÚDE', linhas: RK_SAUDE, a: T.somando, b: T.somando + 4.5, cor: 's'},
  {nome: 'PREFEITURA', linhas: RK_PREF, a: T.somando + 4.5, b: T.detalhe, cor: 'p'},
] as const;
const JANELA = 8;
const PASSO_L = 0.5;
const ET = (n: number) => E(soma(RK, [n * 6, 3.0, 0]), 6.2, 6.0, [0, 0.12, 1]);

// ---------- Dinheiro: pilhas que voam de um lugar a outro (1 pilha = R$ 3,9 mi; as pequenas valem menos) ----------
type Seg = {t0: number; de: V3; para: V3};
type Moeda = {n: number; segs: Seg[]};
const DUR = 1.3;
const slot = (c: V3, j: number): V3 => [c[0] + ((j % 3) - 1) * 0.27, Math.floor(j / 9) * 0.75, c[2] + (Math.floor((j % 9) / 3) - 1) * 0.27];
const curva = (a: V3, b: V3, alto: number, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k + alto * 4 * k * (1 - k), a[2] + (b[2] - a[2]) * k];
const SAU_A = FRENTE(SAU, 3.0, -0.8);
const SAU_B = FRENTE(SAU, 3.0, 0.8);
const PREF_F = FRENTE(PREF, 2.6);
const INF_F = FRENTE(INF, 3.0);
const PRA_F = FRENTE(PRA, 2.9);
const SOC_F = FRENTE(SOC, 2.9);
const MOEDAS: Moeda[] = (() => {
  const m: Moeda[] = [];
  // caminho 1: 8 pilhas de atenção básica (R$ 32,6 mi) e 5 de hospital, exame e cirurgia (R$ 20,5 mi), do Fundo Nacional direto ao Fundo Municipal
  for (let j = 0; j < 13; j++) {
    const g = j < 8 ? SAU_A : SAU_B;
    m.push({n: 1, segs: [{t0: T.direto + 0.5 + j * 0.28, de: [FNS[0] + 0.4, 0.6, FNS[2] + 0.8], para: slot(g, j < 8 ? j : j - 8)}]});
  }
  // caminho 2: 7 pilhas do Congresso para a Prefeitura (3 do convênio, 4 do Pix)
  const ns = [1, 1, 0.76, 1, 0.87, 0.79, 0.12];
  ns.forEach((n, j) => {
    const base: Seg = {t0: T.v21 - 0.2 + j * 0.3, de: [CONG[0], 0.8, CONG[2] + 1.4], para: slot(PREF_F, j)};
    const segs: Seg[] = [base];
    if (j < 3) segs.push({t0: T.v1075 + 0.4 + j * 0.3, de: base.para, para: slot(INF_F, j)}); // convênio: dinheiro carimbado vai para a Infraestrutura
    else if (j < 5) segs.push({t0: T.v729 + 0.2 + (j - 3) * 0.35, de: base.para, para: slot(INF_F, j)}); // Pix: Infraestrutura
    else if (j === 5) segs.push({t0: T.v309 + 0.2, de: base.para, para: slot(PRA_F, 0)}); // Pix: praças, campos e orla
    else segs.push({t0: T.v233 + 0.1, de: base.para, para: slot(SOC_F, 0)}); // Pix: Promoção Social
    m.push({n, segs});
  });
  return m;
})();
const pilhasEm = (t: number, cor: string): Pilha[] => {
  const out: Pilha[] = [];
  MOEDAS.forEach((m) => {
    if (t < m.segs[0].t0) return;
    let s = m.segs[0];
    for (const g of m.segs) if (t >= g.t0) s = g;
    const k = Math.min(1, Math.max(0, (t - s.t0) / DUR));
    const p = k >= 1 ? s.para : curva(s.de, s.para, 1.6, k * k * (3 - 2 * k));
    out.push({p, n: m.n, cor});
  });
  return out;
};

// ---------- Peças locais ----------
const S = (k: number): V3 => [k, k, k];
const Rotulo3D: React.FC<{tema: Tema; pos: V3; larg: number; alt: number; texto: string | string[]; tam: number; k: number; cor?: string; rotY?: number}> = ({tema, pos, larg, alt, texto, tam, k, cor, rotY = 0}) => {
  if (k < 0.02) return null;
  const linhas = (Array.isArray(texto) ? texto : [texto]).map((t) => ({t, tam, cor: tema.branco}));
  return (
    <group position={pos} scale={S(k)} rotation={[0, rotY, 0]}>
      <Placa tema={tema} pos={[0, 0, 0]} larg={larg} alt={alt} fundo={cor ?? tema.objetoEscuro} linhas={linhas} />
    </group>
  );
};
const rotAte = (c: V3) => Math.atan2(-c[0], -c[2]); // frente da casinha voltada para o centro da maquete
const Rota: React.FC<{tema: Tema; a: V3; b: V3; cor: string; k: number}> = ({tema, a, b, cor, k}) => {
  if (k < 0.02) return null;
  const dx = b[0] - a[0];
  const dz = b[2] - a[2];
  const L = Math.hypot(dx, dz) * k;
  const ang = Math.atan2(dx, dz);
  return <Caixa args={[0.55, 0.05, L]} raio={0.02} cor={mistura(tema.objetoEscuro, cor, 0.75)} position={[a[0] + (dx * k) / 2, 0.09, a[2] + (dz * k) / 2]} rotation={[0, ang, 0]} sombra={false} />;
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const CS = festa.azul;
  const CP = tema.acento;
  const CPx = mistura(tema.acento, tema.objetoEscuro, 0.4);

  const mq = vis(t, T.mas - 0.4, T.pod - 0.2) + vis(t, T.entrou - 0.2, T.detalhe - 0.2) + entra(t, T.todos - 0.3, 0.6);
  const mqK = Math.min(1, mq);
  const rkK = vis(t, T.somando - 0.3, T.detalhe);
  const fbK = vis(t, T.detalhe - 0.3, T.todos);
  const pdK = vis(t, T.pod - 0.3, T.entrou);
  const kSau = entra(t, T.mas, 0.6) * mqK;
  const kPref = entra(t, T.mas + 0.3, 0.6) * mqK;
  const kCasas = (a: number) => entra(t, a, 0.6) * mqK;
  const aceso = (a: number, b: number) => Math.max(0, rampa(t, a, a + 0.4) * (1 - rampa(t, b, b + 0.4)));
  const piscaS = aceso(T.c1, T.c2);
  const piscaP = aceso(T.c2, T.somando);
  const kRs = rampa(t, T.mas, T.mas + 1.6) * mqK; // rota 1 (saúde)
  const kRp = rampa(t, T.mas + 0.6, T.mas + 2.2) * mqK; // rota 2 (Prefeitura)
  const dinheiro = pilhasEm(t, dourado);

  return (
    <group>
      {mqK > 0.02 ? (
        <group scale={S(mqK)}>
          <MesaMaquete tema={tema} rio={false} />
          {/* rotas dos dois caminhos, cada uma na sua cor */}
          <Rota tema={tema} a={[FNS[0] + 0.8, 0, FNS[2] + 0.3]} b={[SAU[0] - 0.9, 0, SAU[2] + 0.5]} cor={CS} k={kRs} />
          <Rota tema={tema} a={[CONG[0], 0, CONG[2] + 1.0]} b={[PREF[0], 0, PREF[2] - 1.0]} cor={CP} k={kRp} />
          <Rotulo3D tema={tema} pos={[-6.4, 1.7, 0.2]} larg={2.6} alt={0.75} texto={['CAMINHO 1', 'SAÚDE']} tam={92} k={kRs * entra(t, T.soSaude, 0.4)} cor={CS} />
          <Rotulo3D tema={tema} pos={[1.9, 1.7, -3.6]} larg={2.8} alt={0.75} texto={['CAMINHO 2', 'PREFEITURA']} tam={92} k={kRp * entra(t, T.resto, 0.4)} cor={CP} />

          {/* o Congresso e a Prefeitura */}
          <Congresso tema={tema} pos={CONG} escala={0.3} aceso={Math.max(pulso(t, T.indica, 1.4), piscaP * 0.4)} />
          <Rotulo3D tema={tema} pos={[CONG[0], 0.35, CONG[2] + 1.1]} larg={2.8} alt={0.6} texto={['EMENDAS · UNIÃO']} tam={86} k={kPref * entra(t, T.basico, 0.4)} cor={tema.objetoEscuro} />
          <Prefeitura tema={tema} pos={PREF} sobe={kPref} aceso={Math.max(piscaP, pulso(t, T.recebe, 1.4))} rotY={0} escala={0.8} />
          <Rotulo3D tema={tema} pos={[PREF[0], 0.32, PREF[2] + 1.6]} larg={2.4} alt={0.5} texto="PREFEITURA" tam={110} k={kPref} cor={CP} />

          {/* Fundo Nacional de Saúde (fora do município) e a casinha da Saúde */}
          <Caixa args={[2.2, 1.4, 1.6]} raio={0.06} cor={mistura(tema.objeto, CS, 0.4)} position={[FNS[0], 0.7, FNS[2]]} />
          <Caixa args={[2.4, 0.14, 1.8]} raio={0.03} cor={tema.objetoEscuro} position={[FNS[0], 1.47, FNS[2]]} />
          <Rotulo3D tema={tema} pos={[FNS[0], 0.32, FNS[2] + 1.6]} larg={2.5} alt={0.8} texto={['FUNDO NACIONAL', 'DE SAÚDE']} tam={84} k={kSau} cor={CS} />
          <PostoSaude tema={tema} pos={SAU} sobe={kSau} aceso={Math.max(piscaS, pulso(t, T.v54, 1.4))} rotY={rotAte(SAU)} escala={0.75} />
          <Rotulo3D tema={tema} pos={[SAU[0], 0.32, SAU[2] + 1.6]} larg={2.5} alt={0.8} texto={['SECRETARIA', 'DE SAÚDE']} tam={96} k={kSau} cor={CS} />

          {/* casinhas da Prefeitura: aparecem na hora do "casinha por casinha" */}
          <PredioTexto tema={tema} pos={INF} sobe={kCasas(T.c2)} aceso={aceso(T.conv, T.somando)} texto="INFRA" tipo="galpao" rotY={rotAte(INF)} escala={0.75} cinza={0} />
          <Rotulo3D tema={tema} pos={[INF[0], 0.32, INF[2] + 1.6]} larg={2.5} alt={0.8} texto={['SECRETARIA DE', 'INFRAESTRUTURA']} tam={80} k={kCasas(T.c2)} cor={CP} />
          <PredioAssistencia tema={tema} pos={SOC} sobe={kCasas(T.casinha + 0.5)} aceso={aceso(T.social, T.entrou)} rotY={rotAte(SOC)} escala={0.75} />
          <Rotulo3D tema={tema} pos={[SOC[0], 0.32, SOC[2] + 1.6]} larg={2.5} alt={0.8} texto={['SECRETARIA DE', 'PROMOÇÃO SOCIAL']} tam={80} k={kCasas(T.casinha + 0.5)} cor={CP} />
          <group position={PRA} scale={S(kCasas(T.casinha + 1.0) * 1.3)}>
            <Caixa args={[1.0, 0.05, 0.9]} raio={0.02} cor={tema.objetoClaro} position={[-0.95, 0.03, 0.1]} sombra={false} />
            {[-1.2, -0.7].map((x, i) => (
              <group key={x} position={[x, 0.05, 0.1 + 0.1 * i]}>
                <Caixa args={[0.1, 0.4, 0.1]} raio={0.03} cor={mistura(tema.areia, tema.objetoEscuro, 0.5)} position={[0, 0.2, 0]} />
                <Caixa args={[0.46, 0.46, 0.46]} raio={0.2} cor={mistura(festa.verde, tema.objeto, 0.3)} position={[0, 0.6, 0]} />
              </group>
            ))}
            <Caixa args={[1.3, 0.05, 0.9]} raio={0.02} cor={mistura(festa.verde, tema.objeto, 0.3)} position={[0.45, 0.03, 0.1]} sombra={false} />
            <Caixa args={[0.03, 0.02, 0.9]} raio={0.005} cor={tema.branco} position={[0.45, 0.065, 0.1]} sombra={false} />
            <Caixa args={[2.5, 0.04, 0.4]} raio={0.02} cor={tema.areia} position={[0, 0.025, -0.85]} sombra={false} />
            <Caixa args={[2.5, 0.04, 0.35]} raio={0.02} cor={mistura(festa.azul, tema.objeto, 0.3)} position={[0, 0.02, -1.25]} sombra={false} />
          </group>
          <Rotulo3D tema={tema} pos={[PRA[0], 0.32, PRA[2] + 1.6]} larg={2.5} alt={0.8} texto={['PRAÇAS, CAMPOS', 'E ORLA']} tam={90} k={kCasas(T.casinha + 1.0)} cor={CPx} />

          {/* o dinheiro das emendas, pilha por pilha */}
          <PilhasDinheiro pilhas={dinheiro} max={900} />

          {/* TCM: documento e plaquinha na casinha da Infraestrutura; TCU: empresa de obras perto das ruas */}
          {(() => {
            const k = entra(t, T.conferi, 0.5) * mqK * (1 - rampa(t, T.somando - 0.2, T.somando + 0.4));
            if (k < 0.02) return null;
            return (
              <group position={[7.2, 0, 1.0]} rotation={[0, -0.35, 0]} scale={S(0.72 * k)}>
                <Caixa args={[3.4, 3.6, 0.08]} raio={0.04} cor={tema.branco} position={[0, 1.9, 0]} />
                <Placa tema={tema} pos={[0, 3.35, 0.05]} larg={3.0} alt={0.45} linhas={[{t: 'TCM-BA · RECEITA DA PREFEITURA', tam: 62, cor: tema.tinta}]} />
                <Placa tema={tema} pos={[0, 2.95, 0.05]} larg={3.0} alt={0.3} linhas={[{t: 'Transferência Especial da União (Pix)', tam: 46, cor: tema.tinta, peso: 600}]} />
                {[
                  {a: T.v25, l: '2025', v: 'R$ 2.941.237,53', y: 2.4},
                  {a: T.v26, l: '2026 (até agosto)', v: 'R$ 5.538.071,80', y: 1.7},
                ].map((d) => {
                  const kk = entra(t, d.a, 0.4);
                  if (kk < 0.02) return null;
                  return (
                    <group key={d.l} position={[0, d.y, 0.05]} scale={S(kk)}>
                      <Placa tema={tema} pos={[0, 0.17, 0]} larg={3.0} alt={0.26} linhas={[{t: d.l.toUpperCase(), tam: 50, cor: tema.tinta, peso: 600}]} />
                      <Placa tema={tema} pos={[0, -0.1, 0]} larg={3.0} alt={0.36} linhas={[{t: d.v, tam: 80, cor: tema.tinta}]} />
                    </group>
                  );
                })}
                {(() => {
                  const kk = entra(t, T.bate + 0.2, 0.4);
                  return kk > 0.02 ? (
                    <group position={[0.2, 0.75, 0.1]} rotation={[0, 0, -0.1]} scale={S(kk)}>
                      <Placa tema={tema} pos={[0, 0, 0]} larg={2.8} alt={0.6} fundo={CP} linhas={[{t: 'PIX BATE CENTAVO', tam: 84, cor: tema.branco}, {t: 'POR CENTAVO', tam: 84, cor: tema.branco}]} />
                    </group>
                  ) : null;
                })()}
              </group>
            );
          })()}
          <Rotulo3D tema={tema} pos={[INF[0], 2.9, INF[2] + 0.6]} larg={3.4} alt={1.0} texto={['TCM: R$ 2,59 MI PAGOS', 'PAVIMENTAÇÃO DE VIAS', 'FONTE 1706 (PIX)']} tam={70} k={mqK * entra(t, T.despesas, 0.4) * (1 - rampa(t, T.somando - 0.2, T.somando + 0.4))} cor={CP} />
          {(() => {
            const k = entra(t, T.tcu, 0.4) * mqK * (1 - rampa(t, T.somando - 0.2, T.somando + 0.4));
            if (k < 0.02) return null;
            return (
              <group>
                <Caixa args={[2.6, 0.05, 0.6]} raio={0.02} cor={tema.objetoEscuro} position={[INF[0] + 2.3, 0.1, INF[2] + 2.3]} rotation={[0, 0.5, 0]} sombra={false} />
                <Rotulo3D tema={tema} pos={[INF[0] + 2.3, 1.1, INF[2] + 2.3]} larg={3.0} alt={1.0} texto={['TCU: R$ 3,48 MI PAGOS', 'A UMA EMPRESA', 'DE OBRAS']} tam={70} k={k} cor={tema.objetoEscuro} />
              </group>
            );
          })()}

        </group>
      ) : null}

      {/* Lista completa: duas telas que rolam, uma coluna, letra grande */}
      {rkK > 0.02 ? (
        <group>
          {TELA.map((d, n) => {
            const kT = entra(t, d.a - 0.25, 0.4) * (1 - rampa(t, d.b - 0.1, d.b + 0.25)) * rkK;
            if (kT < 0.02) return null;
            const cor = d.cor === 's' ? CS : CP;
            const rola = rampa(t, d.a + 0.9, d.b - 0.9) * Math.max(0, d.linhas.length - JANELA);
            return (
              <group key={d.nome} position={soma(RK, [n * 6, 0, 0])} scale={S(kT)}>
                <Caixa args={[4.9, 5.0, 0.12]} raio={0.06} cor={mistura(tema.objeto, cor, 0.3)} position={[0, 2.5, -0.1]} />
                <Placa tema={tema} pos={[0, 4.55, 0.03]} larg={4.6} alt={0.5} fundo={cor} linhas={[{t: `${d.nome} · INDICOU · R$`, tam: 54, cor: tema.branco}]} />
                {d.linhas.map(([nome, v], i) => {
                  const u = i - rola;
                  const k = Math.min(Math.max(1 + u, 0), Math.max(Math.min(JANELA - u, 1), 0));
                  if (k < 0.02) return null;
                  return (
                    <group key={nome} position={[0, 4.0 - u * PASSO_L, 0.03]} scale={S(Math.min(1, k))}>
                      <Placa tema={tema} pos={[-0.85, 0, 0]} larg={2.9} alt={0.44} fundo={tema.objetoEscuro} linhas={[{t: nome, tam: 79, cor: tema.branco}]} />
                      <Placa tema={tema} pos={[1.6, 0, 0]} larg={1.6} alt={0.44} fundo={tema.objetoEscuro} linhas={[{t: fmt(v), tam: 130, cor: tema.branco}]} />
                    </group>
                  );
                })}
              </group>
            );
          })}
        </group>
      ) : null}

      {/* Pódio da emenda Pix: informativo, sem medalha nem confete; bonecos genéricos sem rosto */}
      {pdK > 0.02 ? (
        <group>
          <Caixa args={[8.6, 0.06, 6.0]} raio={0.03} cor={mistura(tema.chao, tema.objetoEscuro, 0.3)} position={soma(PODIO, [0, 0.03, 1.2])} sombra={false} />
          <Rotulo3D tema={tema} pos={soma(PODIO, [0, 4.0, -1.2])} larg={6.0} alt={1.0} texto={['QUEM MAIS INDICOU EMENDA PIX', '2021–2026']} tam={86} k={pdK} cor={CP} />
          {[
            {n: 'LEUR LOMANTO JR.', v: 'R$ 4,83 MI', x: 0, h: 1.5, a: T.p1},
            {n: 'JOÃO LEÃO', v: 'R$ 1,99 MI', x: -2.1, h: 1.0, a: T.p2},
            {n: 'JORGE SOLLA', v: 'R$ 1,39 MI', x: 2.1, h: 0.65, a: T.p3},
          ].map((d, i) => {
            const kb = entra(t, T.pod + 0.2 + 0.2 * i, 0.5) * pdK;
            const k = entra(t, d.a - 0.2, 0.5) * pdK;
            if (kb < 0.02) return null;
            const h = d.h * kb;
            return (
              <group key={d.n} position={soma(PODIO, [d.x, 0, 0])}>
                <Caixa args={[1.9, h, 1.2]} raio={0.05} cor={mistura(tema.objeto, CP, 0.4)} position={[0, h / 2, 0]} />
                <Boneco tema={tema} pos={[0, h, 0]} escala={0.8 * k} cor={tema.pessoa} pose={{ombroD: [-0.5 * pulso(t, d.a, 1.2), 0, 0.15]}} />
                <Rotulo3D tema={tema} pos={[0, Math.max(0.3, h / 2), 0.63]} larg={1.85} alt={0.8} texto={[d.n, d.v]} tam={d.n.length > 12 ? 74 : 92} k={k} cor={CP} />
                <Rotulo3D tema={tema} pos={[0, h + 1.7, 0]} larg={0.7} alt={0.45} texto={`${i === 0 ? '1º' : i === 1 ? '2º' : '3º'}`} tam={170} k={k} cor={tema.objetoEscuro} />
              </group>
            );
          })}
          {[
            {n: 'PAULO MAGALHÃES', v: 'R$ 998 MIL', x: -2.1, z: 2.4},
            {n: 'BACELAR', v: 'R$ 698 MIL', x: 0, z: 2.4},
            {n: 'LÍDICE DA MATA', v: 'R$ 400 MIL', x: 2.1, z: 2.4},
            {n: 'JOSIAS GOMES', v: 'R$ 300 MIL', x: -1.05, z: 3.7},
            {n: 'JOSEILDO RAMOS', v: 'R$ 200 MIL', x: 1.05, z: 3.7},
          ].map((d, i) => (
            <Rotulo3D key={d.n} tema={tema} pos={soma(PODIO, [d.x, 0.3, d.z])} larg={2.0} alt={0.75} texto={[d.n, d.v]} tam={66} k={pdK * entra(t, T.p2 + 0.4 + 0.45 * i, 0.4)} cor={CPx} />
          ))}
        </group>
      ) : null}

      {/* Fábrica fora da conta (sem nome nem logo) */}
      {fbK > 0.02 ? (
        <group>
          <group position={soma(FAB, [-2.6, 0, -0.8])} scale={S(fbK)}>
            <Caixa args={[3.0, 1.4, 1.8]} raio={0.05} cor={tema.objeto} position={[0, 0.7, 0]} />
            <Caixa args={[0.4, 1.0, 0.4]} raio={0.04} cor={tema.objetoEscuro} position={[1.0, 1.9, -0.4]} />
            <Caixa args={[0.4, 0.8, 0.4]} raio={0.04} cor={tema.objetoEscuro} position={[0.3, 1.8, -0.4]} />
            {[-1.0, 0, 1.0].map((x) => (
              <Caixa key={x} args={[0.5, 0.35, 0.04]} raio={0.02} cor={tema.objetoClaro} position={[x, 0.9, 0.92]} emissivo={0.2} sombra={false} />
            ))}
            <Rotulo3D tema={tema} pos={[0, 3.0, 0]} larg={3.0} alt={0.8} texto={['FÁBRICA DE', 'COMPUTADORES']} tam={92} k={entra(t, T.detalhe + 1.0, 0.4)} />
          </group>
          <group position={soma(FAB, [2.4 + 6.0 * rampa(t, T.tirei, T.tirei + 1.4), 0, 0.6])} scale={S(fbK * (1 - rampa(t, T.tirei + 0.9, T.tirei + 1.6)))}>
            <PilhaMoedas tema={tema} pos={[0, 0.02, 0]} n={26} cor={mistura(dourado, tema.objetoClaro, 0.5)} r={0.4} escala={entra(t, T.q47 - 0.3, 0.5)} />
            <Rotulo3D tema={tema} pos={[0, 3.9, 0]} larg={2.4} alt={0.5} texto="R$ 47 MI" tam={130} k={entra(t, T.q47, 0.4)} cor={tema.objetoEscuro} />
          </group>
          <Rotulo3D tema={tema} pos={soma(FAB, [2.4, 1.2, 1.2])} larg={3.0} alt={0.8} texto={['FORA DA', 'CONTA']} tam={110} k={fbK * entra(t, T.tirei + 0.3, 0.4)} cor={tema.objetoEscuro} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Câmera ----------
const VISTA = E([0, 0.6, 1.4], 15, 11, [0, 1.0, 1]);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E([0, 0.6, 1.4], 15.5, 11.2, [0, 1.0, 1])], [T.basico - 0.2, E([0, 0.6, 1.4], 14.5, 10.8, [0.04, 1.0, 1])]]},
  {ini: T.basico, chaves: [[T.basico, E([0, 1.2, -3.2], 9.6, 7.0, [0.05, 0.9, 1])], [T.recebe + 1.5, E([0, 1.0, -2.6], 9.2, 6.8, [-0.04, 0.9, 1])], [T.c1 - 0.1, E([0, 1.0, -2.4], 9.2, 6.8, [-0.04, 0.9, 1])]]},
  {ini: T.c1, chaves: [[T.c1, E([-6.2, 1.0, 2.8], 9.4, 6.8, [0.1, 0.95, 1])], [T.basica, E([-5.8, 1.0, 3.6], 8.4, 6.2, [0.04, 0.95, 1])], [T.secreto - 0.1, E([-5.4, 1.0, 3.6], 8.4, 6.2, [-0.02, 0.95, 1])]]},
  {ini: T.secreto, chaves: [[T.secreto, E([-5.4, 1.8, 3.6], 8.6, 6.4, [0, 0.95, 1])], [T.c2 - 0.1, E([-5.2, 1.8, 3.6], 8.6, 6.4, [-0.04, 0.95, 1])]]},
  {ini: T.c2, chaves: [[T.c2, E([0, 1.0, -3.0], 10.5, 7.8, [0.04, 0.95, 1])], [T.conv, E([1.2, 0.9, 0.2], 9.6, 7.0, [0.02, 0.95, 1])], [T.v1075 + 1.2, E([2.8, 0.9, 1.8], 9.0, 6.8, [-0.03, 0.95, 1])], [T.casaPix - 0.1, E([2.4, 0.9, 1.8], 9.2, 6.8, [-0.03, 0.95, 1])]]},
  {ini: T.casaPix, chaves: [[T.casaPix, E([0.2, 0.8, 3.4], 14.0, 10.2, [0, 1.0, 1])], [T.pod - 0.1, E([0.2, 0.8, 3.4], 14.0, 10.2, [0, 1.0, 1])]]},
  {ini: T.pod, chaves: [[T.pod, E(soma(PODIO, [0, 2.7, 1.0]), 7.6, 6.2, [0, 0.4, 1])], [T.entrou - 0.1, E(soma(PODIO, [0, 2.7, 1.2]), 7.6, 6.2, [0, 0.4, 1])]]},
  {ini: T.entrou, chaves: [[T.entrou, E([5.2, 1.4, 1.8], 8.0, 6.2, [0.04, 0.8, 1])], [T.tcu - 0.1, E([5.6, 1.4, 2.4], 8.2, 6.2, [-0.03, 0.8, 1])], [T.somando - 0.1, E([6.0, 1.0, 3.2], 8.2, 6.2, [-0.05, 0.85, 1])]]},
  {ini: T.somando, chaves: [[T.somando, ET(0)], [T.somando + 4.5, ET(0)], [T.somando + 4.55, ET(1)], [T.detalhe - 0.1, ET(1)]]},
  {ini: T.detalhe, chaves: [[T.detalhe, E(soma(FAB, [-0.4, 1.6, 0]), 9.6, 6.6, [0.04, 0.34, 1])], [T.tirei + 1.0, E(soma(FAB, [0.2, 1.6, 0.4]), 9.6, 6.6, [-0.04, 0.34, 1])], [T.todos - 0.1, E(soma(FAB, [0.2, 1.6, 0.4]), 9.6, 6.6, [-0.04, 0.34, 1])]]},
  parado(T.todos, FIM, VISTA),
];

// ---------- Interface ----------
const CHIPS: Txt[] = [
  {a: 0.3, b: T.mas, texto: 'R$ 76 MILHÕES · 2019 A 2026', destaque: true},
  {a: T.mas, b: T.basico, texto: 'DOIS CAMINHOS: SAÚDE E PREFEITURA'},
  {a: T.basico, b: T.indica, texto: 'EMENDA = O PARLAMENTAR ESCOLHE O DESTINO'},
  {a: T.indica, b: T.c1, texto: 'ELE INDICA · A PREFEITURA EXECUTA', destaque: true},
  {a: T.c1, b: T.fundoAFundo, texto: 'CAMINHO 1 · SAÚDE: R$ 54,2 MILHÕES', destaque: true},
  {a: T.fundoAFundo, b: T.custeio, texto: 'FUNDO A FUNDO: SEM PASSAR PELA PREFEITURA'},
  {a: T.custeio, b: T.basica, texto: 'CUSTEIO = DINHEIRO PARA FUNCIONAR'},
  {a: T.basica, b: T.mac, texto: 'ATENÇÃO BÁSICA: R$ 32,6 MILHÕES'},
  {a: T.mac, b: T.secreto, texto: 'HOSPITAL, EXAME, CIRURGIA: R$ 20,5 MI'},
  {a: T.secreto, b: T.stf, texto: 'ORÇAMENTO SECRETO: R$ 9 MI · 2021-2022', destaque: true},
  {a: T.stf, b: T.naSaude, texto: 'STF DERRUBOU ESSE TIPO · DEZ/2022'},
  {a: T.naSaude, b: T.c2, texto: 'SAÚDE: QUEM MAIS INDICOU'},
  {a: T.c2, b: T.conv, texto: 'CAMINHO 2 · PREFEITURA: R$ 21,8 MILHÕES', destaque: true},
  {a: T.conv, b: T.pixS, texto: 'CONVÊNIO: R$ 10,75 MI · DINHEIRO CARIMBADO'},
  {a: T.pixS, b: T.casaPix, texto: 'EMENDA PIX: R$ 10,8 MI · CAI NO CAIXA', destaque: true},
  {a: T.casaPix, b: T.pod, texto: 'PIX CASINHA POR CASINHA · DECLARADO NOS PLANOS', destaque: true},
  {a: T.bate, b: T.despesas, texto: 'PIX: CGU PAGOU = TCM REGISTROU', destaque: true},
  {a: T.despesas, b: T.tcu, texto: 'DESPESA 2026: PAVIMENTAÇÃO DE VIAS'},
  {a: T.tcu, b: T.somando, texto: 'R$ 3,48 MI PAGOS A UMA EMPRESA DE OBRAS', destaque: true},
  {a: T.somando, b: T.detalhe, texto: 'LEUR: R$ 8,70 MI (3,87 SAÚDE + 4,83 PREF.)', destaque: true},
  {a: T.detalhe, b: T.tirei, texto: 'R$ 47 MI: COMPRAS FEDERAIS PARA O PAÍS'},
  {a: T.tirei, b: T.todos, texto: 'FORA DA CONTA DA CIDADE', destaque: true},
  {a: T.todos, b: T.segue, texto: 'SAÚDE R$ 54,2 MI + PREFEITURA R$ 21,8 MI', destaque: true},
];
const SELOS: Txt[] = [
  {a: 0, b: FIM + 5, texto: 'VALORES PAGOS · FNS, CGU E TCU'},
  {a: T.casaPix, b: T.pod, texto: 'DECLARADO NOS PLANOS DE AÇÃO'},
  {a: T.conferi, b: T.tcu, texto: 'TCM-BA · RECEITA E DESPESA (PCMGE016 E 065)'},
  {a: T.tcu, b: T.somando, texto: 'PAINEL DO TCU · DADOS ATÉ 06/11/2026'},
];
// plaquinhas de valor presas aos objetos (2D, no estilo das contas da Prefeitura)
const ROTULOS: Rot[] = [
  {a: T.mas + 1.0, b: T.basico, p: [0, 2.4, 0.4], texto: 'R$ 76 MI', acento: true},
  {a: T.v54, b: T.c2, p: [SAU[0], 2.0, SAU[2]], texto: 'R$ 54,2 MI', acento: true},
  {a: T.basica, b: T.secreto, p: [SAU_A[0], 1.2, SAU_A[2]], texto: 'ATENÇÃO BÁSICA · R$ 32,6 MI'},
  {a: T.mac, b: T.secreto, p: [SAU_B[0] + 1.0, 0.8, SAU_B[2]], texto: 'HOSPITAL · R$ 20,5 MI'},
  {a: T.secreto, b: T.stf, p: [SAU[0] + 1.6, 2.6, SAU[2]], texto: 'ORÇAMENTO SECRETO · R$ 9 MI', acento: true},
  {a: T.relGeral, b: T.naSaude, p: [SAU[0] + 1.6, 1.6, SAU[2]], texto: 'RELATOR-GERAL · NOME NÃO APARECE'},
  {a: T.stf, b: T.naSaude, p: [SAU[0] + 1.6, 0.6, SAU[2]], texto: 'STF DERRUBOU · DEZ/2022'},
  {a: T.naSaude, b: T.alex, p: [SAU[0] - 0.2, 2.6, SAU[2]], texto: 'COMISSÃO DE SAÚDE · R$ 4,6 MI'},
  {a: T.alex, b: T.leurS, p: [SAU[0] - 0.2, 1.8, SAU[2]], texto: 'ALEX SANTANA · R$ 4 MI'},
  {a: T.leurS, b: T.c2, p: [SAU[0] - 0.2, 1.0, SAU[2]], texto: 'LEUR LOMANTO JR. · R$ 3,9 MI'},
  {a: T.v21 + 0.5, b: T.conv, p: [PREF[0], 2.4, PREF[2]], texto: 'R$ 21,8 MI', acento: true},
  {a: T.v1075, b: T.pixS, p: [INF[0], 2.0, INF[2]], texto: 'CONVÊNIO · R$ 10,75 MI', acento: true},
  {a: T.pav, b: T.pixS, p: [INF[0] - 1.6, 0.9, INF[2] + 1.2], texto: 'PAVIMENTAÇÃO · DRENAGEM · ENCOSTAS'},
  {a: T.v108, b: T.casaPix, p: [PREF[0], 2.4, PREF[2]], texto: 'PIX · R$ 10,8 MI', acento: true},
  {a: T.v729, b: T.pod, p: [INF[0], 2.2, INF[2]], texto: 'R$ 7,29 MI · RUAS E ESTRADAS', acento: true},
  {a: T.v309, b: T.pod, p: [PRA[0], 1.8, PRA[2]], texto: 'R$ 3,09 MI · PRAÇAS, CAMPOS, ORLA', acento: true},
  {a: T.v233, b: T.pod, p: [SOC[0], 1.8, SOC[2]], texto: 'R$ 233 MIL · ASSISTÊNCIA', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.basico, T.c1, T.secreto, T.c2, T.casaPix, T.pod, T.entrou, T.somando, T.somando, T.detalhe, T.todos].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  MOEDAS.forEach((m) => s.push({t: m.segs[m.segs.length - 1].t0 + DUR * 0.8, f: 'pop', v: 0.07}));
  s.push({t: T.secreto, f: 'ding', v: 0.14});
  s.push({t: T.bate + 0.3, f: 'baque', v: 0.15});
  s.push({t: T.tirei + 0.6, f: 'subida', v: 0.12});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.0, 3.5, T.mas - 0.3, T.mas + 2.5, T.casinha + 1.2, T.basico + 1.0, T.indica + 1.0, T.recebe + 1.2, T.c1 + 1.0, T.direto + 2.0, T.fundoAFundo + 0.8, T.custeio + 1.5, T.basica + 1.8, T.mac + 1.8,
  T.secreto + 1.0, T.v9 + 1.6, T.relGeral + 1.2, T.stf + 1.2, T.alex + 1.0, T.leurS + 1.2, T.c2 + 1.0, T.v21 + 1.6, T.conv + 1.6, T.pav + 1.8, T.pixS + 1.8, T.casaPix + 1.0,
  T.v729 + 1.4, T.pracas + 1.0, T.v309 + 1.4, T.v233 + 1.4, T.pod + 1.0, T.p1 + 1.4, T.p2 + 1.2, T.p3 + 1.4, T.p3 + 2.2, T.entrou + 1.0, T.v25 + 1.6, T.v26 + 1.6, T.despesas + 1.6, T.tcu + 1.0, T.somando + 0.8,
  T.somando + 0.6, T.somando + 2.5, T.somando + 4.0, T.somando + 5.4, T.somando + 7.5, T.detalhe + 1.0, T.q47 + 0.6, T.tirei + 1.6, T.todos + 1.0, T.voce + 0.6, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Emendas em Ilhéus',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa},
  Mundo,
  arrobaFixo: true,
};
void ABRE;
void MOEDAS_POR_PILHA;

export const EmendasIlheus: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['R$ 76 mi', 'de emendas', 'em Ilhéus'];
export const CapaEmendasIlheus: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="EMENDAS" />
);
