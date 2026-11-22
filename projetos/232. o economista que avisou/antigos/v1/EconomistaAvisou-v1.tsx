import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {BalancaJustica, CalendarioGrande, CanoMoedas, Cadeado, Casinha, Colunas, Congresso, DocumentoGrande, Engrenagem, EscolaSimples, MapaBrasil, MarcoAno, Medidor, OrgaoPublico, PilhaMoedas, Plenario, PredioColunas, TetoVidro} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 232. o economista que avisou (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// Estúdio 3D (molde 163 sobre comum/Explicativo.tsx). Sem trecho de Kit Mapas: o assunto é regra fiscal, sem lugar a mostrar.
// As opiniões são do economista; tem o outro lado. Autoridades só pelo cargo. Fontes: projetos/232.../audio/fontes.md.

const P = '232. o economista que avisou';
const AUDIO_SEG = 171.91;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  nov2016: quando('Novembro de 2016'),
  senado: quando('Um economista vai'),
  dezAnos: quando('Dez anos depois'),
  sessenta: quando('mais um ajuste'),
  avisado: quando('Ele tinha avisado'),
  quem: quando('Pedro Paulo Zahluth'),
  desenv: quando('Ele é desenvolvimentista'),
  austeridade: quando('E há mais de'),
  duas: quando('Primeiro, duas palavras'),
  primario: quando('Gasto primário é'),
  financeiro: quando('Gasto financeiro é'),
  limitam: quando('As regras fiscais'),
  fora: quando('Os juros ficam'),
  critica: quando('E a crítica dele'),
  a2015: quando('O governo recém-reeleito'),
  outubro: quando('Em outubro, o professor'),
  pib3: quando('e o PIB deve'),
  ibge: quando('O IBGE fechou'),
  artigo: quando('Num artigo de 2017'),
  popular: quando('a recessão tirou'),
  semApoio: quando('Sem apoio nas'),
  leitura: quando('Essa é a leitura'),
  teto: quando('Aí veio o Teto'),
  noSenado: quando('No Senado, ele mostrou'),
  resto: quando('todo o resto do governo'),
  inviavel: quando('Inviável'),
  ipea: quando('E levou números'),
  social: quando('cada real de gasto social'),
  jurosReal: quando('Cada real de juros'),
  furado: quando('O Teto foi furado'),
  arcabouco: quando('No lugar dele'),
  regra70: quando('o gasto só cresce'),
  faixa: quando('entre 0,6 e'),
  maio: quando('Em maio de 2023'),
  saude: quando('Saúde e educação crescem'),
  aposent: quando('Aposentadoria cresce'),
  espremido: quando('alguém vai ser'),
  previsao: quando('A previsão: um dia'),
  nov2026: quando('Novembro de 2026'),
  piso: quando('O piso da saúde'),
  de2015: quando('Para ele, é 2015'),
  juros: quando('E ele volta aos juros'),
  trilhao: quando('foram cerca de 1'),
  ajuste60: quando('O ajuste inteiro'),
  defende: quando('Quem defende a regra'),
  governo: quando('O governo diz que'),
  discorda: quando('O professor discorda'),
  custo: quando('vive uma crise do custo'),
  propoe: quando('E o que ele propõe'),
  p1: quando('o limite de gasto crescer'),
  p2: quando('tirar o investimento público'),
  p3: quando('cobrar mais imposto'),
  p4: quando('uma meta de inflação'),
  p5: quando('reindustrializar o país'),
  acertou: quando('Ele acertou ou'),
  comenta: quando('Comenta aqui'),
  segue: quando('Eu sou Magno'),
  arroba: quando('aqui eu te explico'),
};

const ESTADOS: [number, string][] = [
  [0, 'O ECONOMISTA QUE AVISOU'],
  [T.quem, 'QUEM É'],
  [T.duas, 'PRIMÁRIO X FINANCEIRO'],
  [T.a2015, '2015 · O AJUSTE'],
  [T.teto, '2016 · O TETO'],
  [T.arcabouco, '2023 · O ARCABOUÇO'],
  [T.nov2026, '2026 · O PACOTE'],
  [T.defende, 'O OUTRO LADO'],
  [T.propoe, 'O QUE ELE PROPÕE'],
  [T.acertou, 'E AGORA?'],
];

const ABRE: V3 = [0, 0, 0];
const QUEM: V3 = [12, 0, 0];
const GASTO: V3 = [24, 0, 0];
const A15: V3 = [36, 0, 0];
const TETO: V3 = [48, 0, 0];
const ARC: V3 = [60, 0, 0];
const HOJE: V3 = [72, 0, 0];
const LADOS: V3 = [84, 0, 0];
const PROP: V3 = [96, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];
  const escuro = mistura(tema.objeto, tema.objetoEscuro, 0.3);

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.quem - 0.3, T.quem)) + entra(t, T.acertou - 0.3, 0.6);
  const abertura = t < T.quem;
  const quemK = vis(t, T.quem - 0.3, T.duas);
  const gasK = vis(t, T.duas - 0.3, T.a2015);
  const a15K = vis(t, T.a2015 - 0.3, T.teto);
  const tetoK = vis(t, T.teto - 0.3, T.arcabouco);
  const arcK = vis(t, T.arcabouco - 0.3, T.nov2026);
  const hojeK = vis(t, T.nov2026 - 0.3, T.defende);
  const ladK = vis(t, T.defende - 0.3, T.propoe);
  const propK = vis(t, T.propoe - 0.3, T.acertou);

  // 2015: PIB, arrecadação e popularidade descendo
  const cai15 = rampa(t, T.pib3, T.ibge + 1.2);
  const popCai = rampa(t, T.popular, T.semApoio + 1.0);
  // Teto: o vidro desce e o "resto do governo" encolhe até 2036
  const encolhe = rampa(t, T.resto, T.inviavel + 0.6);
  // Arcabouço: as três caixas apertam sob o limite
  const aperta = rampa(t, T.espremido - 0.4, T.espremido + 1.0);
  // Juros: pilha que cresce muito além do ajuste
  const sobeJuros = rampa(t, T.trilhao, T.trilhao + 1.6);
  const props = [T.p1, T.p2, T.p3, T.p4, T.p5];

  return (
    <group>
      <Caixa args={[120, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[48, 0.02, 3.8]} sombra={false} />

      {/* Abertura e fecho: o Senado em 2016 e o ajuste de 60 bi em 2026 */}
      {abK > 0.02 ? (
        <group>
          <Plenario tema={tema} pos={soma(ABRE, [-1.6, 0, -2.2])} escala={0.55 * Math.min(1, abK)} acesos={abertura ? entra(t, T.senado, 0.6) : 1} />
          <CalendarioGrande tema={tema} pos={soma(ABRE, [2.4, 0, -1.4])} rotY={-0.3} texto={abertura && t < T.dezAnos ? '2016' : '2026'} sub={abertura && t < T.dezAnos ? 'SENADO' : 'AJUSTE'} folha={rampa(t, T.dezAnos, T.dezAnos + 0.8)} escala={0.75 * Math.min(1, abK)} destaque={pulso(t, T.dezAnos + 0.4, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [0.4, 0.02, 0.9])} n={abertura ? Math.max(1, Math.round(16 * rampa(t, T.sessenta, T.sessenta + 1.2))) : 16} cor={dourado} r={0.34} escala={Math.min(1, abK) * (abertura ? entra(t, T.sessenta - 0.2, 0.4) : 1)} brilho={pulso(t, T.sessenta + 0.8, 1.2)} />
          {abertura ? null : <MapaBrasil tema={tema} pos={soma(ABRE, [0, 0.03, -0.4])} tam={2.6} k={entra(t, T.acertou, 0.8)} acende={0.4 + 0.3 * pulso(t, T.comenta, 1.6)} />}
        </group>
      ) : null}

      {/* Quem é: a universidade e o professor (boneco genérico, sem rosto) */}
      {quemK > 0.02 ? (
        <group>
          <PredioColunas tema={tema} pos={soma(QUEM, [0, 0, -2.4])} aceso={entra(t, T.quem + 0.3, 0.6)} escala={0.9 * quemK} />
          <Boneco tema={tema} pos={soma(QUEM, [-0.2, 0, 0.6])} rotY={0.15} escala={0.7 * quemK * entra(t, T.quem - 0.2, 0.4)} cor={cores[1]} pose={{ombroD: [-0.6, 0, 0.2]}} />
          <Engrenagem tema={tema} pos={soma(QUEM, [2.2, 1.0, -0.6])} r={0.5} giro={t * 0.6} escala={quemK * entra(t, T.desenv, 0.5)} emissivo={0.2 * pulso(t, T.desenv + 0.4, 1.2)} />
        </group>
      ) : null}

      {/* Primário x financeiro: a balança e o cadeado só do lado do primário */}
      {gasK > 0.02 ? (
        <group>
          <BalancaJustica tema={tema} pos={soma(GASTO, [0, 0, -1.6])} escala={0.85 * gasK} inclina={-0.12 * rampa(t, T.fora, T.fora + 1.0) + 0.05 * Math.sin(t * 0.9)} brilhoEsq={pulso(t, T.primario, 1.4)} brilhoDir={pulso(t, T.financeiro, 1.4)} />
          {/* o que o primário paga: miniaturas à esquerda da balança, pequenas para não tapar */}
          <group position={soma(GASTO, [-3.0, 0, 0.9])} scale={0.3 * gasK * entra(t, T.primario, 0.5)}>
            <OrgaoPublico tema={tema} pos={[-2.2, 0, -1.0]} escala={0.7} sobe={1} letreiro={entra(t, T.primario + 0.3, 0.5)} texto="SAÚDE" />
            <EscolaSimples tema={tema} pos={[2.4, 0, -1.0]} luz={entra(t, T.primario + 0.5, 0.5)} />
          </group>
          <Casinha tema={tema} pos={soma(GASTO, [-2.2, 0, 1.9])} cor={cores[2]} escala={0.45 * gasK * entra(t, T.primario + 0.8, 0.4)} />
          <PilhaMoedas tema={tema} pos={soma(GASTO, [2.6, 0.02, 0.8])} n={12} cor={dourado} r={0.32} escala={gasK * entra(t, T.financeiro, 0.4)} brilho={pulso(t, T.fora + 0.4, 1.4)} />
          <Cadeado tema={tema} pos={soma(GASTO, [-2.6, 1.6, 0.6])} k={gasK * entra(t, T.limitam, 0.4)} fecha={rampa(t, T.limitam + 0.4, T.limitam + 1.0)} />
        </group>
      ) : null}

      {/* 2015: PIB caindo, arrecadação menor, popularidade baixando, Congresso ao fundo */}
      {a15K > 0.02 ? (
        <group>
          <Colunas tema={tema} pos={soma(A15, [-1.0, 0, -0.6])} a={0.7} b={0.7 - 0.38 * cai15} altMax={2.4} corA={escuro} corB={tema.acento} brilhoB={pulso(t, T.ibge + 0.6, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(A15, [1.8, 0.02, 0.8])} n={Math.max(2, Math.round(10 - 6 * rampa(t, T.outubro + 0.6, T.pib3)))} cor={dourado} r={0.28} escala={a15K} />
          <Medidor tema={tema} pos={soma(A15, [2.6, 0, -1.4])} label="APOIO" valor={0.7 - 0.5 * popCai} escala={1.6 * a15K * entra(t, T.popular - 0.3, 0.4)} />
          <Congresso tema={tema} pos={soma(A15, [0.8, 0, -4.6])} escala={0.24 * a15K * entra(t, T.semApoio - 0.2, 0.6)} aceso={pulso(t, T.semApoio + 0.6, 1.4)} />
        </group>
      ) : null}

      {/* 2016: o Teto de vidro e o resto do governo encolhendo */}
      {tetoK > 0.02 ? (
        <group>
          <TetoVidro tema={tema} centro={soma(TETO, [0, 0, -0.4])} larg={5.4} prof={3.0} y={2.6 - 0.7 * rampa(t, T.teto, T.teto + 1.4)} vida={tetoK} racha={rampa(t, T.furado, T.furado + 1.0)} t={t} />
          <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={cores[1]} position={soma(TETO, [-1.7, 0.7, -0.4])} />
          <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={cores[3]} position={soma(TETO, [0, 0.7, -0.4])} />
          <group position={soma(TETO, [1.7, 0, -0.4])} scale={[1, Math.max(0.06, 1 - 0.94 * encolhe), 1]}>
            <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={tema.acento} emissivo={0.2 * pulso(t, T.inviavel, 1.2)} position={[0, 0.7, 0]} />
          </group>
          <MarcoAno tema={tema} pos={soma(TETO, [2.9, 0, -0.2])} ano="2036" k={tetoK * entra(t, T.resto, 0.4)} aceso={pulso(t, T.inviavel, 1.4)} />
          <PilhaMoedas tema={tema} pos={soma(TETO, [-2.8, 0.02, 1.6])} n={Math.round(3 + 4 * entra(t, T.social, 0.6))} cor={cores[3]} r={0.26} escala={tetoK * entra(t, T.social - 0.2, 0.4)} brilho={pulso(t, T.social + 0.4, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(TETO, [-1.6, 0.02, 1.9])} n={Math.round(1 + 2 * entra(t, T.jurosReal, 0.6))} cor={dourado} r={0.26} escala={tetoK * entra(t, T.jurosReal - 0.2, 0.4)} />
        </group>
      ) : null}

      {/* 2023: o arcabouço. A receita entra, só 70% vira gasto, três caixas apertadas */}
      {arcK > 0.02 ? (
        <group>
          <CanoMoedas tema={tema} pontos={[soma(ARC, [-3.4, 1.8, -1.6]), soma(ARC, [-1.6, 1.8, -1.6]), soma(ARC, [-1.0, 1.0, -1.0])]} k={arcK * entra(t, T.regra70 - 0.2, 0.5)} fluxo={t * 0.5} />
          <Medidor tema={tema} pos={soma(ARC, [0.4, 0, -1.6])} label="GASTOS" valor={0.45 + 0.1 * entra(t, T.regra70, 0.8)} escala={1.8 * arcK} />
          {['SALÁRIO MÍNIMO', 'SAÚDE E EDUCAÇÃO', 'RESTO'].map((_, i) => {
            const x = -1.7 + 1.7 * i;
            const larg = i === 2 ? 1.3 - 0.7 * aperta : 1.3 + 0.1 * aperta;
            return <Caixa key={i} args={[larg, 0.9, 1.0]} raio={0.05} cor={i === 2 ? tema.acento : cores[1 + i]} position={soma(ARC, [x + (i === 2 ? 0.35 * aperta : 0), 0.45, 1.2])} />;
          })}
          <Caixa args={[5.6, 0.06, 1.4]} raio={0.02} cor={tema.acento} emissivo={0.25 * pulso(t, T.espremido, 1.2)} position={soma(ARC, [0, 1.05 - 0.08 * aperta, 1.2])} />
        </group>
      ) : null}

      {/* 2026: o projeto 299 no Congresso e a pilha dos juros muito maior que a do ajuste */}
      {hojeK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(HOJE, [0, 0, -3.4])} escala={0.28 * hojeK} aceso={pulso(t, T.nov2026 + 0.4, 1.4)} />
          <DocumentoGrande tema={tema} pos={soma(HOJE, [-1.6, 0.05, 0.6])} rot={[-1.3, 0.2, 0]} escala={0.6 * hojeK * entra(t, T.nov2026 + 0.3, 0.4)} carimbo={rampa(t, T.de2015, T.de2015 + 0.6)} />
          <PilhaMoedas tema={tema} pos={soma(HOJE, [1.0, 0.02, 0.8])} n={Math.max(1, Math.round(3 + 22 * sobeJuros))} cor={dourado} r={0.36} escala={hojeK * entra(t, T.juros, 0.4)} brilho={pulso(t, T.trilhao + 1.2, 1.4)} />
          <PilhaMoedas tema={tema} pos={soma(HOJE, [2.4, 0.02, 0.8])} n={2} cor={cores[3]} r={0.36} escala={hojeK * entra(t, T.ajuste60, 0.4)} brilho={pulso(t, T.ajuste60 + 0.4, 1.2)} />
        </group>
      ) : null}

      {/* O outro lado */}
      {ladK > 0.02 ? (
        <group>
          <BalancaJustica tema={tema} pos={soma(LADOS, [0, 0, -1.6])} escala={0.85 * ladK} inclina={0.15 * Math.sin(t * 1.1)} brilhoEsq={pulso(t, T.defende, 1.2)} brilhoDir={pulso(t, T.discorda, 1.2)} />
          <Boneco tema={tema} pos={soma(LADOS, [-2.4, 0, 0.8])} rotY={0.4} escala={0.62 * ladK * entra(t, T.defende - 0.2, 0.4)} cor={cores[1]} />
          <Boneco tema={tema} pos={soma(LADOS, [2.4, 0, 0.8])} rotY={-0.4} escala={0.62 * ladK * entra(t, T.discorda - 0.2, 0.4)} cor={cores[2]} />
        </group>
      ) : null}

      {/* As 5 propostas: degraus que sobem um a um, a engrenagem da indústria no topo */}
      {propK > 0.02 ? (
        <group>
          {props.map((p, i) => (t < p - 0.05 ? null :
            <Caixa key={i} args={[1.0, 0.3 + 0.35 * i, 1.0]} raio={0.05} cor={i === 4 ? tema.acento : cores[(i % 4) + 1]} emissivo={0.15 * pulso(t, p + 0.2, 1.2)} position={soma(PROP, [-2.6 + 1.3 * i, (0.3 + 0.35 * i) / 2 * entra(t, p, 0.5), -0.6])} scale={[1, Math.max(0.02, entra(t, p, 0.5)), 1]} />
          ))}
          <Engrenagem tema={tema} pos={soma(PROP, [2.6, 2.4, -0.6])} r={0.45} giro={t * 0.8} escala={propK * entra(t, T.p5, 0.5)} />
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 1.4, -0.8]), 9.0, 6.6, [0, 0.36, 1])], [T.dezAnos, E(soma(ABRE, [0.6, 1.3, -0.6]), 8.0, 6.0, [-0.06, 0.34, 1])], [T.sessenta, E(soma(ABRE, [0.4, 1.0, 0.6]), 6.2, 5.0, [0.02, 0.34, 1])], [T.quem - 0.1, E(soma(ABRE, [0.4, 1.0, 0.6]), 6.0, 4.8, [0.04, 0.34, 1])]]},
  {ini: T.quem, chaves: [[T.quem, E(soma(QUEM, [0, 1.6, -1.4]), 8.0, 6.0, [0.06, 0.3, 1])], [T.desenv, E(soma(QUEM, [0.8, 1.2, 0]), 6.4, 4.8, [-0.04, 0.3, 1])], [T.duas - 0.1, E(soma(QUEM, [0.4, 1.2, 0.2]), 6.2, 4.6, [-0.06, 0.3, 1])]]},
  {ini: T.duas, chaves: [[T.duas, E(soma(GASTO, [0, 1.4, -0.6]), 8.6, 6.0, [0.05, 0.3, 1])], [T.primario, E(soma(GASTO, [-2.4, 1.0, 0.6]), 5.8, 4.6, [0.08, 0.3, 1])], [T.financeiro, E(soma(GASTO, [2.2, 1.0, 0.6]), 5.8, 4.6, [-0.06, 0.3, 1])], [T.limitam, E(soma(GASTO, [0, 1.4, -0.2]), 8.4, 6.0, [0.02, 0.32, 1])], [T.a2015 - 0.1, E(soma(GASTO, [0, 1.4, -0.2]), 8.2, 5.8, [-0.03, 0.32, 1])]]},
  {ini: T.a2015, chaves: [[T.a2015, E(soma(A15, [0, 1.4, -0.6]), 8.0, 6.0, [0.06, 0.3, 1])], [T.pib3, E(soma(A15, [-1.0, 1.3, -0.4]), 6.0, 5.0, [0.04, 0.28, 1])], [T.popular, E(soma(A15, [1.8, 1.2, -0.6]), 6.2, 4.8, [-0.05, 0.3, 1])], [T.semApoio, E(soma(A15, [0, 1.6, -2.4]), 8.6, 6.4, [0.02, 0.32, 1])], [T.teto - 0.1, E(soma(A15, [0, 1.6, -2.2]), 8.4, 6.2, [-0.03, 0.32, 1])]]},
  {ini: T.teto, chaves: [[T.teto, E(soma(TETO, [0, 1.6, -0.4]), 8.0, 6.0, [0.06, 0.34, 1])], [T.resto, E(soma(TETO, [1.4, 1.1, 0.2]), 6.4, 4.8, [-0.05, 0.3, 1])], [T.inviavel + 0.5, E(soma(TETO, [1.4, 1.1, 0.2]), 6.2, 4.6, [-0.07, 0.3, 1])], [T.ipea + 0.4, E(soma(TETO, [-2.2, 1.0, 1.2]), 5.6, 4.4, [0.06, 0.3, 1])], [T.furado, E(soma(TETO, [0, 1.8, -0.4]), 8.2, 6.0, [0.02, 0.36, 1])], [T.arcabouco - 0.1, E(soma(TETO, [0, 1.8, -0.4]), 8.0, 5.8, [-0.03, 0.36, 1])]]},
  {ini: T.arcabouco, chaves: [[T.arcabouco, E(soma(ARC, [-1.0, 1.4, -1.0]), 8.0, 6.0, [0.06, 0.3, 1])], [T.regra70, E(soma(ARC, [-0.6, 1.2, -1.2]), 6.8, 5.2, [0.03, 0.3, 1])], [T.maio, E(soma(ARC, [0, 1.0, 1.0]), 7.2, 5.2, [0, 0.34, 1])], [T.espremido, E(soma(ARC, [0.6, 0.9, 1.2]), 6.4, 4.8, [-0.04, 0.34, 1])], [T.nov2026 - 0.1, E(soma(ARC, [0.4, 0.9, 1.0]), 6.6, 5.0, [-0.06, 0.34, 1])]]},
  {ini: T.nov2026, chaves: [[T.nov2026, E(soma(HOJE, [0, 1.6, -1.6]), 8.0, 6.0, [0.06, 0.3, 1])], [T.piso, E(soma(HOJE, [-1.2, 1.0, 0.6]), 6.0, 4.6, [0.06, 0.3, 1])], [T.juros, E(soma(HOJE, [1.4, 1.4, 0.6]), 6.4, 5.4, [-0.04, 0.28, 1])], [T.ajuste60, E(soma(HOJE, [1.6, 1.6, 0.6]), 6.6, 5.6, [-0.06, 0.28, 1])], [T.defende - 0.1, E(soma(HOJE, [1.6, 1.6, 0.6]), 6.4, 5.4, [-0.07, 0.28, 1])]]},
  {ini: T.defende, chaves: [[T.defende, E(soma(LADOS, [-1.6, 1.2, 0.2]), 6.4, 4.8, [0.08, 0.3, 1])], [T.governo, E(soma(LADOS, [0, 1.4, -0.6]), 8.6, 5.8, [0.03, 0.3, 1])], [T.discorda, E(soma(LADOS, [1.8, 1.0, 0.6]), 6.0, 4.6, [-0.06, 0.3, 1])], [T.propoe - 0.1, E(soma(LADOS, [1.8, 1.0, 0.6]), 5.8, 4.4, [-0.08, 0.3, 1])]]},
  {ini: T.propoe, chaves: [[T.propoe, E(soma(PROP, [0, 1.4, -0.6]), 8.0, 6.0, [0.05, 0.32, 1])], [T.p1, E(soma(PROP, [-2.0, 1.0, -0.4]), 5.6, 4.4, [0.07, 0.3, 1])], [T.p3, E(soma(PROP, [0, 1.3, -0.4]), 6.4, 4.8, [0.02, 0.3, 1])], [T.p5, E(soma(PROP, [1.8, 1.8, -0.4]), 6.6, 5.2, [-0.05, 0.3, 1])], [T.acertou - 0.1, E(soma(PROP, [0.6, 1.6, -0.4]), 8.0, 6.0, [-0.04, 0.32, 1])]]},
  {ini: T.acertou, chaves: [[T.acertou, E(soma(ABRE, [0, 1.4, 0.2]), 8.6, 6.2, [0.04, 0.36, 1])], [T.comenta, E(soma(ABRE, [0, 1.3, 0.4]), 7.6, 5.6, [0, 0.36, 1])], [FIM, E(soma(ABRE, [0, 1.4, 0]), 9.6, 7.0, [0, 0.4, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.senado, b: T.dezAnos, texto: 'NOV/2016: "A CONTA DO TETO NÃO FECHA"'},
  {a: T.sessenta, b: T.avisado, texto: '2026: AJUSTE DE R$ 60 BILHÕES', destaque: true},
  {a: T.avisado, b: T.quem, texto: 'ELE TINHA AVISADO?'},
  {a: T.desenv, b: T.duas, texto: 'DESENVOLVIMENTISTA: ESTADO INVESTINDO PARA CRESCER'},
  {a: T.primario, b: T.financeiro, texto: 'PRIMÁRIO: SAÚDE, ESCOLA, APOSENTADORIA, OBRA'},
  {a: T.financeiro, b: T.limitam, texto: 'FINANCEIRO: JUROS DA DÍVIDA'},
  {a: T.limitam, b: T.a2015, texto: 'O PRIMÁRIO TEM LIMITE. OS JUROS, NÃO', destaque: true},
  {a: T.outubro, b: T.ibge, texto: 'PREVISÃO DELE (OUT/2015): PIB CAI ~3%'},
  {a: T.ibge, b: T.artigo, texto: 'IBGE: 2015 CAIU 3,5%', destaque: true},
  {a: T.artigo, b: T.teto, texto: 'A LEITURA DELE (ARTIGO DE 2017)'},
  {a: T.teto, b: T.noSenado, texto: 'TETO: 20 ANOS, CORRIGIDO SÓ PELA INFLAÇÃO'},
  {a: T.resto, b: T.ipea, texto: 'RESTO DO GOVERNO: < 1% DO PIB EM 2036', destaque: true},
  {a: T.social, b: T.furado, texto: 'SOCIAL: R$ 1,70 · JUROS: R$ 0,70 (CITADO POR ELE)'},
  {a: T.furado, b: T.arcabouco, texto: 'TETO SUBSTITUÍDO EM 2023'},
  {a: T.regra70, b: T.faixa, texto: 'GASTO CRESCE 70% DO QUE A RECEITA CRESCER', destaque: true},
  {a: T.faixa, b: T.maio, texto: 'ENTRE 0,6% E 2,5% ACIMA DA INFLAÇÃO'},
  {a: T.maio, b: T.previsao, texto: 'A CONTA DELE EM MAIO DE 2023'},
  {a: T.previsao, b: T.nov2026, texto: 'PREVISÃO: SALÁRIO MÍNIMO, PISOS OU O RESTO', destaque: true},
  {a: T.nov2026, b: T.piso, texto: 'PLP 299/2026: AJUSTE DE 2027'},
  {a: T.piso, b: T.de2015, texto: 'PISO DA SAÚDE CRESCE MENOS DO QUE CRESCERIA'},
  {a: T.de2015, b: T.juros, texto: 'PARA ELE: É 2015 DE NOVO'},
  {a: T.trilhao, b: T.ajuste60, texto: 'JUROS EM 12 MESES: ≈ R$ 1,2 TRI (≈ 9% DO PIB)', destaque: true},
  {a: T.ajuste60, b: T.defende, texto: 'O AJUSTE: R$ 60 BI'},
  {a: T.custo, b: T.propoe, texto: 'NÃO É CRISE DE DÍVIDA, É DO CUSTO DA DÍVIDA', destaque: true},
  {a: T.propoe, b: T.p1, texto: 'CINCO PROPOSTAS'},
  {a: T.p1, b: T.p2, texto: '1 · LIMITE ACOMPANHA SAÚDE E EDUCAÇÃO'},
  {a: T.p2, b: T.p3, texto: '2 · INVESTIMENTO PÚBLICO FORA DA REGRA'},
  {a: T.p3, b: T.p4, texto: '3 · MAIS IMPOSTO PARA QUEM GANHA MUITO'},
  {a: T.p4, b: T.p5, texto: '4 · META DE INFLAÇÃO DE 4,5%'},
  {a: T.p5, b: T.acertou, texto: '5 · REINDUSTRIALIZAR O PAÍS', destaque: true},
  {a: T.acertou, b: T.segue, texto: 'ACERTOU OU EXAGEROU? COMENTA'},
];
const SELOS: Txt[] = [
  {a: T.senado, b: T.quem, texto: 'FONTE: SENADO, AUDIÊNCIA DA PEC 55 · 08/11/2016'},
  {a: T.quem, b: T.duas, texto: 'FONTE: PORTAL DE DOCENTES DA UNICAMP'},
  {a: T.outubro, b: T.ibge, texto: 'FONTE: ENTREVISTA AO EL PAÍS, VIA IHU · 20/10/2015'},
  {a: T.ibge, b: T.artigo, texto: 'FONTE: IBGE, CONTAS NACIONAIS'},
  {a: T.artigo, b: T.teto, texto: 'FONTE: REV. ECONOMIA CONTEMPORÂNEA · 2017'},
  {a: T.teto, b: T.noSenado, texto: 'FONTE: EMENDA CONSTITUCIONAL 95/2016'},
  {a: T.noSenado, b: T.furado, texto: 'FONTE: SENADO, AUDIÊNCIA DA PEC 55 · 08/11/2016'},
  {a: T.arcabouco, b: T.maio, texto: 'FONTE: LEI COMPLEMENTAR 200/2023'},
  {a: T.maio, b: T.nov2026, texto: 'FONTE: ENTREVISTA À TV 247 · 01/05/2023'},
  {a: T.nov2026, b: T.juros, texto: 'FONTE: AGÊNCIA SENADO · PLP 299/2026'},
  {a: T.trilhao, b: T.defende, texto: 'FONTE: BANCO CENTRAL · SET/2026'},
  {a: T.discorda, b: T.propoe, texto: 'FONTE: OUTRAS PALAVRAS · 06/10/2026'},
  {a: T.propoe, b: T.acertou, texto: 'FONTE: OUTRAS PALAVRAS · 12/11/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.senado + 0.3, b: T.dezAnos, p: soma(ABRE, [-1.6, 2.2, -2.2]), texto: 'SENADO', acento: true},
  {a: T.quem + 0.3, b: T.duas, p: soma(QUEM, [0, 3.2, -2.4]), texto: 'UNICAMP'},
  {a: T.quem + 0.5, b: T.duas, p: soma(QUEM, [-0.2, 1.7, 0.6]), texto: 'PEDRO PAULO ZAHLUTH BASTOS', acento: true},
  {a: T.primario, b: T.a2015, p: soma(GASTO, [-2.6, 2.4, 0.6]), texto: 'GASTO PRIMÁRIO', acento: true},
  {a: T.financeiro, b: T.a2015, p: soma(GASTO, [2.6, 2.0, 0.8]), texto: 'JUROS DA DÍVIDA'},
  {a: T.pib3, b: T.semApoio, p: soma(A15, [-1.0, 2.8, -0.6]), texto: 'PIB 2014 X 2015'},
  {a: T.outubro + 0.4, b: T.artigo, p: soma(A15, [1.8, 1.4, 0.8]), texto: 'ARRECADAÇÃO'},
  {a: T.popular, b: T.teto, p: soma(A15, [2.6, 2.3, -1.4]), texto: 'POPULARIDADE', acento: true},
  {a: T.semApoio + 0.3, b: T.teto, p: soma(A15, [0.8, 2.4, -4.6]), texto: 'IMPEACHMENT · 2016'},
  {a: T.resto, b: T.ipea, p: soma(TETO, [1.7, 2.0, -0.4]), texto: 'RESTO DO GOVERNO', acento: true},
  {a: T.social, b: T.furado, p: soma(TETO, [-2.8, 1.6, 1.6]), texto: 'SOCIAL: R$ 1,70'},
  {a: T.jurosReal, b: T.furado, p: soma(TETO, [-1.6, 1.0, 1.9]), texto: 'JUROS: R$ 0,70'},
  {a: T.regra70 + 0.3, b: T.maio, p: soma(ARC, [-2.4, 2.4, -1.6]), texto: 'RECEITA: 100%'},
  {a: T.regra70 + 0.6, b: T.maio, p: soma(ARC, [0.4, 2.6, -1.6]), texto: 'GASTO: 70%', acento: true},
  {a: T.aposent, b: T.nov2026, p: soma(ARC, [-1.7, 1.5, 1.2]), texto: 'SALÁRIO MÍNIMO'},
  {a: T.saude, b: T.nov2026, p: soma(ARC, [0, 2.0, 1.2]), texto: 'SAÚDE E EDUCAÇÃO'},
  {a: T.espremido, b: T.nov2026, p: soma(ARC, [1.9, 1.5, 1.2]), texto: 'O RESTO', acento: true},
  {a: T.trilhao, b: T.defende, p: soma(HOJE, [1.0, 3.4, 0.8]), texto: 'JUROS: ≈ R$ 1,2 TRI', acento: true},
  {a: T.ajuste60, b: T.defende, p: soma(HOJE, [2.4, 1.2, 0.8]), texto: 'AJUSTE: R$ 60 BI'},
  {a: T.defende, b: T.propoe, p: soma(LADOS, [-2.4, 2.0, 0.8]), texto: 'DEFENSORES: PREVISIBILIDADE', acento: true},
  {a: T.governo, b: T.propoe, p: soma(LADOS, [-2.4, 1.5, 0.8]), texto: 'GOVERNO: NÃO É CHOQUE FISCAL'},
  {a: T.discorda, b: T.propoe, p: soma(LADOS, [2.4, 2.0, 0.8]), texto: 'ELE: O PROBLEMA SÃO OS JUROS', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.quem, T.duas, T.a2015, T.teto, T.arcabouco, T.nov2026, T.defende, T.propoe, T.acertou].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.sessenta + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.dezAnos + 0.3, f: 'pop', v: 0.12});
  s.push({t: T.limitam + 0.6, f: 'baque', v: 0.14});
  s.push({t: T.ibge + 0.3, f: 'ding', v: 0.15});
  s.push({t: T.inviavel, f: 'baque', v: 0.15});
  s.push({t: T.espremido + 0.3, f: 'baque', v: 0.14});
  s.push({t: T.trilhao + 0.4, f: 'subida', v: 0.14});
  [T.p1, T.p2, T.p3, T.p4, T.p5].forEach((t) => s.push({t, f: 'pop', v: 0.13}));
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.senado + 1.0, T.dezAnos + 1.0, T.sessenta + 1.2, T.quem + 1.0, T.desenv + 1.0, T.primario + 1.2, T.financeiro + 1.0, T.limitam + 1.4,
  T.a2015 + 0.8, T.outubro + 1.2, T.ibge + 1.0, T.popular + 1.2, T.semApoio + 1.2, T.teto + 1.4, T.resto + 1.4, T.inviavel + 0.6, T.social + 1.0,
  T.furado + 1.2, T.arcabouco + 0.8, T.regra70 + 1.2, T.faixa + 1.0, T.saude + 1.0, T.espremido + 1.2, T.previsao + 1.4, T.nov2026 + 1.0,
  T.piso + 1.2, T.de2015 + 0.8, T.trilhao + 1.8, T.ajuste60 + 0.8, T.defende + 1.0, T.governo + 1.0, T.discorda + 1.0, T.custo + 1.0,
  T.p1 + 1.0, T.p2 + 1.0, T.p3 + 1.0, T.p4 + 1.0, T.p5 + 1.2, T.acertou + 1.0, T.comenta + 0.6, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Ajuste fiscal',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: [],
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa: () => false},
  Mundo,
};

export const EconomistaAvisou: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Ele avisou', 'em 2016.', 'E agora?'];
export const CapaEconomistaAvisou: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="AJUSTE FISCAL" />
);
