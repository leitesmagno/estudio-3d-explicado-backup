import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Barraquinha, Barril, CalendarioGrande, CanoMoedas, Cadeado, Casinha, Cofrinho, Colunas, Congresso, DocumentoGrande, Engrenagem, EscolaSimples, MapaBrasil, MarcoAno, OrgaoPublico, PilhaMoedas, PredioColunas, TetoVidro} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 232. o economista que avisou, VERSÃO 2 DIDÁTICA (18/11/2026, pedido do Magno: "como se uma pessoa de 8 anos estivesse escutando").
// A v1 está em projetos/232.../antigos/v1/. Vídeo NACIONAL, NÃO vai para o site. Molde 163 sobre comum/Explicativo.tsx.
// Imagens do dia a dia: a casa, os dois bolsos (cadeado só no primário), a mesada, a feira (R$ 5 x R$ 4,50), a pilha dos juros.
// Opiniões atribuídas (o professor; Jones Manoel); o outro lado (governo, jornalista) entra. Fontes: projetos/232.../audio/fontes.md.

const P = '232. o economista que avisou';
const AUDIO_SEG = 149.38;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  imagine: quando('Imagine que o governo'),
  entra: quando('Tem dinheiro que entra'),
  nov: quando('em novembro de 2026'),
  cinto: quando('apertar o cinto'),
  professor: quando('Um professor já'),
  vem: quando('Vem comigo, que'),
  bolsos: quando('O governo gasta de dois'),
  primeiro: quando('O primeiro é'),
  segundo: quando('O segundo é'),
  aluguel: quando('como um aluguel'),
  atencao: quando('Agora presta atenção'),
  cadeado: quando('a regra põe cadeado'),
  aberto: quando('O bolso dos juros fica'),
  quem: quando('Quem fala disso'),
  a2015: quando('Em 2015, o governo'),
  cortar: quando('se cortar agora'),
  ibge: quando('O IBGE confirmou'),
  leitura: quando('Na leitura dele'),
  caminho: quando('abrir o caminho'),
  teto: quando('Em 2016 veio'),
  senado: quando('No Senado, o professor'),
  resto: quando('o resto do governo ia'),
  aguentou: quando('O Teto não aguentou'),
  regra: quando('A regra nova'),
  mesada: quando('Pensa numa mesada'),
  minimo: quando('no mínimo 0,6'),
  maximo: quando('e no máximo'),
  a2023: quando('Em 2023, o professor'),
  alguem: quando('Um dia, alguém'),
  chegou: quando('Esse dia chegou'),
  plp: quando('O projeto 299 deixa'),
  petroleo: quando('E tira o dinheiro extra'),
  briga: quando('Aí começa a briga'),
  jornalista: quando('Uma jornalista disse'),
  jones: quando('O comunicador Jones'),
  cinco: quando('Se você podia gastar'),
  quatro: quando('agora só pode gastar'),
  ninguem: quando('ninguém tirou dinheiro'),
  compra: quando('mas você vai comprar'),
  corte: quando('Para ele, crescer menos'),
  governo: quando('O governo diz que'),
  bolsoJuros: quando('E o bolso dos juros'),
  meses: quando('Em 12 meses'),
  trilhao: quando('cerca de 1 trilhão'),
  vinte: quando('É 20 vezes'),
  custo: quando('Por isso o professor'),
  saida: quando('E qual é a saída'),
  p1: quando('O professor propõe deixar'),
  p2: quando('tirar o investimento'),
  p3: quando('cobrar mais imposto'),
  p4: quando('e baixar os juros'),
  p5: quando('Jones Manoel acrescenta'),
  voce: quando('crescer menos é corte ou'),
  comenta: quando('Comenta aqui'),
  segue: quando('Eu sou Magno'),
  arroba: quando('aqui eu te explico'),
};

const ESTADOS: [number, string][] = [
  [0, 'O GOVERNO É UMA CASA'],
  [T.bolsos, 'OS DOIS BOLSOS'],
  [T.quem, 'QUEM AVISOU'],
  [T.a2015, '2015 · O CORTE'],
  [T.teto, '2016 · O TETO'],
  [T.regra, '2023 · A MESADA'],
  [T.chegou, '2026 · O PROJETO 299'],
  [T.briga, 'É CORTE OU NÃO É?'],
  [T.bolsoJuros, 'O BOLSO ABERTO'],
  [T.saida, 'O QUE ELES PROPÕEM'],
  [T.voce, 'E VOCÊ?'],
];

const ABRE: V3 = [0, 0, 0];
const BOLSO: V3 = [12, 0, 0];
const QUEM: V3 = [24, 0, 0];
const A15: V3 = [36, 0, 0];
const TETO: V3 = [48, 0, 0];
const MES: V3 = [60, 0, 0];
const PLP: V3 = [72, 0, 0];
const FEIRA: V3 = [84, 0, 0];
const JUROS: V3 = [96, 0, 0];
const PROP: V3 = [108, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];
  const escuro = mistura(tema.objeto, tema.objetoEscuro, 0.3);

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.bolsos - 0.3, T.bolsos)) + entra(t, T.voce - 0.3, 0.6);
  const abertura = t < T.bolsos;
  const bolK = vis(t, T.bolsos - 0.3, T.quem);
  const quemK = vis(t, T.quem - 0.3, T.a2015);
  const a15K = vis(t, T.a2015 - 0.3, T.teto);
  const tetoK = vis(t, T.teto - 0.3, T.regra);
  const mesK = vis(t, T.regra - 0.3, T.chegou);
  const plpK = vis(t, T.chegou - 0.3, T.briga);
  const feiK = vis(t, T.briga - 0.3, T.bolsoJuros);
  const jurK = vis(t, T.bolsoJuros - 0.3, T.saida);
  const propK = vis(t, T.saida - 0.3, T.voce);

  const cai15 = rampa(t, T.cortar + 1.0, T.ibge + 1.2);
  const apoio = rampa(t, T.leitura, T.caminho + 0.8);
  const encolhe = rampa(t, T.resto, T.aguentou);
  // mesada: as três caixas crescem mais rápido que o limite e encostam nele
  const sobe = rampa(t, T.a2023 + 0.4, T.alguem + 1.0);
  const desce = rampa(t, T.plp + 0.8, T.plp + 2.2);
  const leva = rampa(t, T.petroleo + 0.6, T.petroleo + 2.0);
  const pilhaJuros = rampa(t, T.trilhao, T.vinte + 0.4);
  const props = [T.p1, T.p2, T.p3, T.p4, T.p5];
  const pilhaFeira = t < T.quatro + 0.3 ? 10 : 9; // R$ 5,00 = 10 moedas; R$ 4,50 = 9

  return (
    <group>
      <Caixa args={[132, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[54, 0.02, 3.8]} sombra={false} />

      {/* 1 e fecho: o governo é uma casa; dinheiro entra e sai */}
      {abK > 0.02 ? (
        <group>
          <Casinha tema={tema} pos={soma(ABRE, [0, 0, -1.4])} cor={cores[1]} escala={1.5 * Math.min(1, abK)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [-2.4, 0.02, 0.8])} n={abertura ? Math.max(1, Math.round(8 * entra(t, T.entra, 0.8))) : 8} cor={dourado} r={0.3} escala={Math.min(1, abK)} brilho={pulso(t, T.entra + 0.4, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [2.4, 0.02, 0.8])} n={abertura ? Math.max(1, Math.round(8 - 4 * rampa(t, T.cinto, T.cinto + 1.0))) : 4} cor={mistura(dourado, tema.objetoEscuro, 0.3)} r={0.3} escala={Math.min(1, abK) * entra(t, T.entra + 0.6, 0.5)} brilho={pulso(t, T.cinto + 0.6, 1.2)} />
          <CalendarioGrande tema={tema} pos={soma(ABRE, [3.0, 0, -1.8])} rotY={-0.35} texto={t < T.professor ? '2026' : '2016'} sub={t < T.professor ? 'AJUSTE' : 'O AVISO'} folha={rampa(t, T.professor, T.professor + 0.8)} escala={0.6 * Math.min(1, abK) * entra(t, T.nov - 0.2, 0.5)} destaque={pulso(t, T.professor + 0.4, 1.2)} />
          {abertura ? null : <MapaBrasil tema={tema} pos={soma(ABRE, [-2.6, 0.03, -1.6])} tam={2.0} k={entra(t, T.voce, 0.8)} acende={0.4 + 0.3 * pulso(t, T.comenta, 1.6)} />}
        </group>
      ) : null}

      {/* 2: os dois bolsos. Cadeado só no primário; o dos juros fica aberto e as moedas escorrem */}
      {bolK > 0.02 ? (
        <group>
          <Cofrinho tema={tema} pos={soma(BOLSO, [-1.8, 0, -0.4])} escala={3.2 * bolK * entra(t, T.primeiro - 0.2, 0.5)} nivel={0.6} destaque={pulso(t, T.primeiro + 0.3, 1.4)} />
          <group position={soma(BOLSO, [-1.9, 0, 1.9])} scale={0.2 * bolK * entra(t, T.primeiro + 0.4, 0.5)}>
            <OrgaoPublico tema={tema} pos={[-2.4, 0, 0]} escala={0.7} sobe={1} letreiro={1} texto="SAÚDE" />
            <EscolaSimples tema={tema} pos={[2.4, 0, 0]} luz={1} />
          </group>
          <Cofrinho tema={tema} pos={soma(BOLSO, [1.8, 0, -0.4])} escala={3.2 * bolK * entra(t, T.segundo - 0.2, 0.5)} nivel={0.9} destaque={pulso(t, T.segundo + 0.3, 1.4)} />
          <Cadeado tema={tema} pos={soma(BOLSO, [-1.8, 1.4, 0.8])} k={1.4 * bolK * entra(t, T.cadeado, 0.4)} fecha={rampa(t, T.cadeado + 0.4, T.cadeado + 1.0)} />
          <CanoMoedas tema={tema} pontos={[soma(BOLSO, [1.8, 1.0, 0.2]), soma(BOLSO, [2.8, 0.8, 0.8]), soma(BOLSO, [3.4, 0.2, 1.4])]} k={bolK * entra(t, T.aberto, 0.5)} fluxo={t * 0.6} brilho={pulso(t, T.aberto + 0.4, 1.4)} />
        </group>
      ) : null}

      {/* 3: quem avisou */}
      {quemK > 0.02 ? (
        <group>
          <PredioColunas tema={tema} pos={soma(QUEM, [0, 0, -2.2])} aceso={entra(t, T.quem + 0.3, 0.6)} escala={0.9 * quemK} />
          <Boneco tema={tema} pos={soma(QUEM, [0, 0, 0.6])} escala={0.7 * quemK} cor={cores[1]} pose={{ombroD: [-0.6, 0, 0.2]}} />
        </group>
      ) : null}

      {/* 4: 2015. Corte com a economia fraca: PIB cai, arrecadação cai, apoio cai */}
      {a15K > 0.02 ? (
        <group>
          <Colunas tema={tema} pos={soma(A15, [-1.2, 0, -0.6])} a={0.7} b={0.7 - 0.36 * cai15} altMax={2.4} corA={escuro} corB={tema.acento} brilhoB={pulso(t, T.ibge + 0.6, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(A15, [1.4, 0.02, 0.9])} n={Math.max(2, Math.round(10 - 6 * rampa(t, T.cortar, T.ibge)))} cor={dourado} r={0.28} escala={a15K} />
          {[0, 1, 2].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(A15, [2.0 + 0.7 * i + 1.2 * apoio * (i === 0 ? 0 : 1), 0, -1.2 - 0.3 * i])} rotY={-0.3} escala={0.5 * a15K * entra(t, T.leitura - 0.3, 0.4) * (i === 0 ? 1 : Math.max(0.02, 1 - rampa(t, T.leitura + 0.3 * i, T.leitura + 0.8 + 0.3 * i)))} cor={cores[(i % 3) + 1]} />
          ))}
          <Congresso tema={tema} pos={soma(A15, [0.6, 0, -4.8])} escala={0.24 * a15K * entra(t, T.leitura + 1.0, 0.6)} aceso={pulso(t, T.leitura + 1.6, 1.4)} />
        </group>
      ) : null}

      {/* 5: 2016. O Teto congela; o resto do governo encolhe; o vidro racha */}
      {tetoK > 0.02 ? (
        <group>
          <TetoVidro tema={tema} centro={soma(TETO, [0, 0, -0.4])} larg={5.4} prof={3.0} y={2.6 - 0.7 * rampa(t, T.teto, T.teto + 1.4)} vida={tetoK} gelo={rampa(t, T.teto + 0.6, T.teto + 1.6)} racha={rampa(t, T.aguentou, T.aguentou + 1.0)} t={t} />
          <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={cores[1]} position={soma(TETO, [-1.7, 0.7, -0.4])} />
          <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={cores[3]} position={soma(TETO, [0, 0.7, -0.4])} />
          <group position={soma(TETO, [1.7, 0, -0.4])} scale={[1, Math.max(0.06, 1 - 0.94 * encolhe), 1]}>
            <Caixa args={[1.3, 1.4, 1.3]} raio={0.06} cor={tema.acento} position={[0, 0.7, 0]} />
          </group>
          <MarcoAno tema={tema} pos={soma(TETO, [2.9, 0, -0.2])} ano="2036" k={tetoK * entra(t, T.resto, 0.4)} aceso={pulso(t, T.resto + 0.6, 1.4)} />
        </group>
      ) : null}

      {/* 6: 2023. A mesada: o limite sobe pouco; saúde, educação e aposentadoria sobem mais e encostam */}
      {mesK > 0.02 ? (
        <group>
          {['SAÚDE', 'EDUCAÇÃO', 'APOSENTADORIA'].map((_, i) => {
            const alt = 0.7 + 0.55 * sobe;
            return <Caixa key={i} args={[1.2, alt, 1.1]} raio={0.05} cor={cores[1 + i]} position={soma(MES, [-1.6 + 1.6 * i, alt / 2, 0.4])} />;
          })}
          <Caixa args={[5.4, 0.08, 1.5]} raio={0.02} cor={tema.acento} emissivo={0.25 * pulso(t, T.alguem, 1.2)} position={soma(MES, [0, 1.35 + 0.08 * entra(t, T.minimo, 0.8), 0.4])} />
          <PilhaMoedas tema={tema} pos={soma(MES, [-3.4, 0.02, 1.4])} n={Math.max(1, Math.round(3 + 2 * entra(t, T.mesada, 0.8)))} cor={dourado} r={0.26} escala={mesK * entra(t, T.mesada - 0.2, 0.4)} brilho={pulso(t, T.mesada + 0.4, 1.2)} />
        </group>
      ) : null}

      {/* 7: o projeto 299. O limite máximo desce de 2,5% para 2%; o dinheiro do petróleo sai da conta da saúde */}
      {plpK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(PLP, [0, 0, -3.6])} escala={0.26 * plpK} aceso={pulso(t, T.chegou + 0.4, 1.4)} />
          <DocumentoGrande tema={tema} pos={soma(PLP, [-2.2, 0.05, 0.9])} rot={[-1.3, 0.2, 0]} escala={0.55 * plpK * entra(t, T.plp - 0.2, 0.4)} carimbo={rampa(t, T.plp + 0.4, T.plp + 1.0)} />
          <Colunas tema={tema} pos={soma(PLP, [-0.2, 0, -0.6])} a={0.83} b={0.83 - 0.16 * desce} altMax={2.4} corA={escuro} corB={tema.acento} brilhoB={pulso(t, T.plp + 1.6, 1.2)} />
          <OrgaoPublico tema={tema} pos={soma(PLP, [2.8, 0, -1.4])} escala={0.32 * plpK * entra(t, T.petroleo - 0.2, 0.4)} sobe={entra(t, T.petroleo, 0.6)} letreiro={entra(t, T.petroleo + 0.3, 0.5)} texto="SAÚDE" />
          {[0, 1].map((i) => (
            <Barril key={i} tema={tema} pos={soma(PLP, [1.6 + 0.7 * i - 1.6 * leva, 0, 1.0 + 0.6 * leva])} escala={0.7 * plpK * entra(t, T.petroleo + 0.1 * i, 0.4)} />
          ))}
        </group>
      ) : null}

      {/* 8: é corte ou não é? A feira: R$ 5,00 vira R$ 4,50 e a sacola fica menor */}
      {feiK > 0.02 ? (
        <group>
          <Barraquinha tema={tema} pos={soma(FEIRA, [0, 0, -1.8])} escala={1.1 * feiK} toldo={feiK} />
          <PilhaMoedas tema={tema} pos={soma(FEIRA, [-0.6, 0.02, 0.9])} n={pilhaFeira} cor={dourado} r={0.3} escala={feiK * entra(t, T.cinco, 0.4)} brilho={pulso(t, T.quatro + 0.4, 1.2)} />
          <Boneco tema={tema} pos={soma(FEIRA, [-2.6, 0, 0.8])} rotY={0.4} escala={0.62 * feiK * entra(t, T.jornalista - 0.2, 0.4)} cor={cores[2]} />
          <Boneco tema={tema} pos={soma(FEIRA, [2.6, 0, 0.8])} rotY={-0.4} escala={0.62 * feiK * entra(t, T.jones - 0.2, 0.4)} cor={cores[3]} />
          {[0, 1, 2, 3].map((i) => (
            <Caixa key={i} args={[0.32, 0.32, 0.32]} raio={0.05} cor={cores[(i % 3) + 1]} position={soma(FEIRA, [0.6 + 0.4 * i, 0.16, 1.0])} scale={t > T.compra + 0.4 && i === 3 ? Math.max(0.02, 1 - rampa(t, T.compra + 0.4, T.compra + 1.0)) : entra(t, T.cinco + 0.4 + 0.15 * i, 0.4)} />
          ))}
        </group>
      ) : null}

      {/* 9: o bolso aberto. Pilha dos juros 20 vezes a do ajuste */}
      {jurK > 0.02 ? (
        <group>
          <PilhaMoedas tema={tema} pos={soma(JUROS, [-0.8, 0.02, 0.4])} n={Math.max(1, Math.round(40 * pilhaJuros))} cor={dourado} r={0.4} escala={jurK} brilho={pulso(t, T.vinte, 1.4)} />
          <PilhaMoedas tema={tema} pos={soma(JUROS, [1.4, 0.02, 0.6])} n={2} cor={cores[3]} r={0.4} escala={jurK * entra(t, T.vinte - 0.2, 0.4)} brilho={pulso(t, T.vinte + 0.4, 1.2)} />
        </group>
      ) : null}

      {/* 10: as cinco propostas em degraus; a engrenagem da indústria no último */}
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
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 1.4, -0.6]), 8.6, 6.4, [0, 0.36, 1])], [T.entra, E(soma(ABRE, [0, 1.2, 0]), 7.6, 5.8, [0.04, 0.34, 1])], [T.nov, E(soma(ABRE, [1.2, 1.2, -0.6]), 7.0, 5.4, [-0.06, 0.34, 1])], [T.bolsos - 0.1, E(soma(ABRE, [0.6, 1.2, -0.4]), 7.4, 5.6, [-0.04, 0.34, 1])]]},
  {ini: T.bolsos, chaves: [[T.bolsos, E(soma(BOLSO, [0, 1.2, -0.2]), 8.0, 6.0, [0.04, 0.32, 1])], [T.primeiro, E(soma(BOLSO, [-1.6, 1.0, 0.4]), 5.8, 4.6, [0.07, 0.3, 1])], [T.segundo, E(soma(BOLSO, [1.8, 1.0, 0.2]), 5.8, 4.6, [-0.06, 0.3, 1])], [T.atencao, E(soma(BOLSO, [0.4, 1.2, 0.2]), 8.0, 5.8, [0.02, 0.32, 1])], [T.quem - 0.1, E(soma(BOLSO, [0.6, 1.2, 0.4]), 7.8, 5.6, [-0.03, 0.32, 1])]]},
  {ini: T.quem, chaves: [[T.quem, E(soma(QUEM, [0, 1.6, -1.2]), 7.6, 5.8, [0.05, 0.3, 1])], [T.a2015 - 0.1, E(soma(QUEM, [0, 1.4, -0.6]), 6.8, 5.2, [-0.04, 0.3, 1])]]},
  {ini: T.a2015, chaves: [[T.a2015, E(soma(A15, [0, 1.4, -0.6]), 8.0, 6.0, [0.06, 0.3, 1])], [T.ibge, E(soma(A15, [-1.2, 1.3, -0.4]), 6.0, 5.0, [0.04, 0.28, 1])], [T.leitura, E(soma(A15, [1.6, 1.2, -0.6]), 6.2, 4.8, [-0.05, 0.3, 1])], [T.leitura + 1.2, E(soma(A15, [0.4, 1.6, -2.4]), 8.6, 6.4, [0.02, 0.32, 1])], [T.teto - 0.1, E(soma(A15, [0.4, 1.6, -2.2]), 8.4, 6.2, [-0.03, 0.32, 1])]]},
  {ini: T.teto, chaves: [[T.teto, E(soma(TETO, [0, 1.6, -0.4]), 8.0, 6.0, [0.06, 0.34, 1])], [T.resto, E(soma(TETO, [1.4, 1.1, 0.2]), 6.4, 4.8, [-0.05, 0.3, 1])], [T.aguentou, E(soma(TETO, [0.4, 1.6, -0.4]), 8.0, 5.8, [0.02, 0.36, 1])], [T.regra - 0.1, E(soma(TETO, [0.4, 1.6, -0.4]), 7.8, 5.6, [-0.03, 0.36, 1])]]},
  {ini: T.regra, chaves: [[T.regra, E(soma(MES, [0, 1.3, 0.2]), 8.0, 6.0, [0.05, 0.32, 1])], [T.mesada, E(soma(MES, [-1.4, 1.0, 0.8]), 6.6, 5.0, [0.07, 0.3, 1])], [T.a2023, E(soma(MES, [0, 1.2, 0.4]), 7.4, 5.6, [0, 0.32, 1])], [T.alguem, E(soma(MES, [0, 1.4, 0.4]), 6.8, 5.2, [-0.04, 0.34, 1])], [T.chegou - 0.1, E(soma(MES, [0, 1.4, 0.4]), 6.6, 5.0, [-0.06, 0.34, 1])]]},
  {ini: T.chegou, chaves: [[T.chegou, E(soma(PLP, [0, 1.6, -1.6]), 8.0, 6.0, [0.06, 0.3, 1])], [T.plp, E(soma(PLP, [-1.0, 1.2, 0]), 6.6, 5.0, [0.05, 0.3, 1])], [T.petroleo, E(soma(PLP, [1.8, 1.0, 0]), 6.4, 4.8, [-0.06, 0.3, 1])], [T.briga - 0.1, E(soma(PLP, [1.6, 1.0, 0.2]), 6.2, 4.6, [-0.08, 0.3, 1])]]},
  {ini: T.briga, chaves: [[T.briga, E(soma(FEIRA, [0, 1.4, -0.8]), 8.6, 6.2, [0.04, 0.32, 1])], [T.cinco, E(soma(FEIRA, [0, 1.0, 0.8]), 5.8, 4.6, [0.03, 0.32, 1])], [T.compra, E(soma(FEIRA, [0.6, 0.9, 1.0]), 5.4, 4.2, [-0.03, 0.34, 1])], [T.governo, E(soma(FEIRA, [0, 1.4, -0.4]), 8.6, 6.0, [-0.02, 0.32, 1])], [T.bolsoJuros - 0.1, E(soma(FEIRA, [0, 1.4, -0.4]), 8.4, 5.8, [-0.04, 0.32, 1])]]},
  {ini: T.bolsoJuros, chaves: [[T.bolsoJuros, E(soma(JUROS, [0, 1.2, 0.4]), 6.6, 5.0, [0.05, 0.28, 1])], [T.trilhao, E(soma(JUROS, [0, 2.4, 0.4]), 7.4, 6.6, [0.03, 0.26, 1])], [T.vinte, E(soma(JUROS, [0.2, 2.8, 0.4]), 7.8, 7.4, [-0.03, 0.26, 1])], [T.saida - 0.1, E(soma(JUROS, [0.2, 2.8, 0.4]), 7.6, 7.2, [-0.05, 0.26, 1])]]},
  {ini: T.saida, chaves: [[T.saida, E(soma(PROP, [0, 1.4, -0.6]), 8.0, 6.0, [0.05, 0.32, 1])], [T.p1, E(soma(PROP, [-2.0, 1.0, -0.4]), 5.6, 4.4, [0.07, 0.3, 1])], [T.p3, E(soma(PROP, [0, 1.3, -0.4]), 6.4, 4.8, [0.02, 0.3, 1])], [T.p5, E(soma(PROP, [1.8, 1.8, -0.4]), 6.6, 5.2, [-0.05, 0.3, 1])], [T.voce - 0.1, E(soma(PROP, [0.6, 1.6, -0.4]), 8.0, 6.0, [-0.04, 0.32, 1])]]},
  {ini: T.voce, chaves: [[T.voce, E(soma(ABRE, [0, 1.4, -0.2]), 8.6, 6.2, [0.04, 0.36, 1])], [T.comenta, E(soma(ABRE, [0, 1.3, 0]), 7.6, 5.6, [0, 0.36, 1])], [FIM, E(soma(ABRE, [0, 1.4, -0.2]), 9.4, 7.0, [0, 0.4, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.imagine, b: T.nov, texto: 'O GOVERNO É UMA CASA'},
  {a: T.cinto, b: T.professor, texto: 'APERTAR O CINTO EM R$ 60 BILHÕES', destaque: true},
  {a: T.professor, b: T.bolsos, texto: 'UM PROFESSOR AVISOU EM 2016'},
  {a: T.primeiro, b: T.segundo, texto: 'BOLSO 1 · PRIMÁRIO: HOSPITAL, ESCOLA, APOSENTADORIA'},
  {a: T.segundo, b: T.atencao, texto: 'BOLSO 2 · FINANCEIRO: OS JUROS'},
  {a: T.cadeado, b: T.quem, texto: 'CADEADO SÓ NO BOLSO 1', destaque: true},
  {a: T.quem, b: T.a2015, texto: 'PEDRO PAULO ZAHLUTH BASTOS · UNICAMP'},
  {a: T.cortar, b: T.ibge, texto: 'CORTAR AGORA = VENDER MENOS E ARRECADAR MENOS'},
  {a: T.ibge, b: T.ibge + 1.8, texto: 'IBGE: PIB DE 2015 CAIU 3,5%', destaque: true},
  {a: T.ibge + 1.8, b: T.leitura, texto: 'DE CADA R$ 100, SUMIRAM R$ 3,50'},
  {a: T.leitura, b: T.teto, texto: 'NA LEITURA DELE: ABRIU O CAMINHO DO IMPEACHMENT'},
  {a: T.teto, b: T.senado, texto: 'TETO: CONGELADO POR 20 ANOS'},
  {a: T.resto, b: T.aguentou, texto: 'O RESTO DO GOVERNO ESPREMIDO', destaque: true},
  {a: T.aguentou, b: T.regra, texto: 'TROCADO EM 2023'},
  {a: T.mesada, b: T.minimo, texto: 'UMA MESADA QUE CRESCE POUCO'},
  {a: T.minimo, b: T.a2023, texto: 'R$ 100 SOBE DE R$ 0,60 A R$ 2,50 POR ANO', destaque: true},
  {a: T.a2023, b: T.alguem, texto: 'SAÚDE, EDUCAÇÃO E APOSENTADORIA CRESCEM MAIS'},
  {a: T.alguem, b: T.chegou, texto: 'ALGUÉM IA FICAR SEM ESPAÇO'},
  {a: T.plp, b: T.plp + 3.2, texto: 'PROJETO 299: MÁXIMO DE 2,5% PARA 2%', destaque: true},
  {a: T.plp + 3.2, b: T.petroleo, texto: 'R$ 100 SÓ VIRA R$ 102 (ANTES: R$ 102,50)'},
  {a: T.petroleo, b: T.briga, texto: 'PETRÓLEO EXTRA FORA DA CONTA DA SAÚDE'},
  {a: T.jornalista, b: T.jones, texto: 'UMA JORNALISTA: NÃO TEM CORTE SOCIAL'},
  {a: T.jones, b: T.cinco, texto: 'JONES MANOEL: TEM, SIM'},
  {a: T.cinco, b: T.quatro, texto: 'PODIA GASTAR R$ 5,00'},
  {a: T.quatro, b: T.corte, texto: 'AGORA SÓ PODE R$ 4,50', destaque: true},
  {a: T.corte, b: T.governo, texto: 'PARA ELE: CRESCER MENOS TAMBÉM É CORTE'},
  {a: T.governo, b: T.bolsoJuros, texto: 'GOVERNO: NÃO É CHOQUE FISCAL'},
  {a: T.trilhao, b: T.vinte, texto: 'JUROS EM 12 MESES: ≈ R$ 1,2 TRILHÃO'},
  {a: T.vinte, b: T.custo, texto: '20 VEZES O AJUSTE INTEIRO', destaque: true},
  {a: T.custo, b: T.saida, texto: 'O PROBLEMA É O CUSTO DA DÍVIDA'},
  {a: T.p1, b: T.p2, texto: '1 · SAÚDE E EDUCAÇÃO SEM APERTO'},
  {a: T.p2, b: T.p3, texto: '2 · INVESTIMENTO FORA DA REGRA'},
  {a: T.p3, b: T.p4, texto: '3 · MAIS IMPOSTO PARA QUEM GANHA MUITO'},
  {a: T.p4, b: T.p5, texto: '4 · BAIXAR OS JUROS'},
  {a: T.p5, b: T.voce, texto: '5 · MUDAR A LEI KANDIR (JONES MANOEL)', destaque: true},
  {a: T.voce, b: T.segue, texto: 'CRESCER MENOS É CORTE? COMENTA'},
];
const SELOS: Txt[] = [
  {a: T.cinto, b: T.bolsos, texto: 'FONTE: AGÊNCIA SENADO · PLP 299/2026'},
  {a: T.quem, b: T.a2015, texto: 'FONTE: PORTAL DE DOCENTES DA UNICAMP'},
  {a: T.cortar, b: T.ibge, texto: 'FONTE: ENTREVISTA AO EL PAÍS, VIA IHU · 20/10/2015'},
  {a: T.ibge, b: T.leitura, texto: 'FONTE: IBGE, CONTAS NACIONAIS'},
  {a: T.leitura, b: T.teto, texto: 'FONTE: REV. ECONOMIA CONTEMPORÂNEA · 2017'},
  {a: T.teto, b: T.regra, texto: 'FONTE: EC 95/2016 · SENADO, PEC 55 · 08/11/2016'},
  {a: T.regra, b: T.a2023, texto: 'FONTE: LEI COMPLEMENTAR 200/2023'},
  {a: T.a2023, b: T.chegou, texto: 'FONTE: ENTREVISTA À TV 247 · 01/05/2023'},
  {a: T.chegou, b: T.briga, texto: 'FONTE: AGÊNCIA SENADO · PLP 299/2026'},
  {a: T.jones, b: T.governo, texto: 'FONTE: CANAL JONES MANOEL · 18/11/2026'},
  {a: T.trilhao, b: T.saida, texto: 'FONTE: BANCO CENTRAL · SET/2026'},
  {a: T.saida, b: T.p5, texto: 'FONTE: OUTRAS PALAVRAS · 12/11/2026'},
  {a: T.p5, b: T.voce, texto: 'FONTE: CANAL JONES MANOEL · 18/11/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.entra + 0.2, b: T.bolsos, p: soma(ABRE, [-2.4, 1.6, 0.8]), texto: 'ENTRA', acento: true},
  {a: T.entra + 0.8, b: T.bolsos, p: soma(ABRE, [2.4, 1.4, 0.8]), texto: 'SAI'},
  {a: T.primeiro, b: T.quem, p: soma(BOLSO, [-1.8, 2.3, -0.4]), texto: 'PRIMÁRIO', acento: true},
  {a: T.segundo, b: T.quem, p: soma(BOLSO, [1.8, 2.3, -0.4]), texto: 'JUROS'},
  {a: T.aberto, b: T.quem, p: soma(BOLSO, [3.2, 1.1, 1.4]), texto: 'ABERTO', acento: true},
  {a: T.ibge, b: T.leitura + 1.2, p: soma(A15, [-1.2, 2.8, -0.6]), texto: 'PIB 2014 X 2015'},
  {a: T.leitura, b: T.teto, p: soma(A15, [2.6, 1.6, -1.4]), texto: 'APOIO AO GOVERNO', acento: true},
  {a: T.leitura + 1.4, b: T.teto, p: soma(A15, [0.6, 2.4, -4.8]), texto: 'IMPEACHMENT · 2016'},
  {a: T.resto, b: T.aguentou, p: soma(TETO, [1.7, 2.0, -0.4]), texto: 'RESTO DO GOVERNO', acento: true},
  {a: T.a2023, b: T.chegou, p: soma(MES, [-1.6, 2.2, 0.4]), texto: 'SAÚDE'},
  {a: T.a2023 + 0.3, b: T.chegou, p: soma(MES, [0, 2.6, 0.4]), texto: 'EDUCAÇÃO'},
  {a: T.a2023 + 0.6, b: T.chegou, p: soma(MES, [1.6, 2.2, 0.4]), texto: 'APOSENTADORIA'},
  {a: T.mesada, b: T.minimo, p: soma(MES, [0, 1.9, 1.2]), texto: 'O LIMITE', acento: true},
  {a: T.minimo, b: T.chegou, p: soma(MES, [-3.4, 1.3, 1.4]), texto: 'MÍNIMO: + R$ 0,60'},
  {a: T.maximo, b: T.chegou, p: soma(MES, [0, 1.9, 1.2]), texto: 'MÁXIMO: + R$ 2,50', acento: true},
  {a: T.plp + 0.4, b: T.petroleo, p: soma(PLP, [-0.2, 2.9, -0.6]), texto: 'R$ 102,50 → R$ 102', acento: true},
  {a: T.petroleo + 0.4, b: T.briga, p: soma(PLP, [1.4, 1.4, 1.2]), texto: 'PETRÓLEO EXTRA'},
  {a: T.jornalista, b: T.governo, p: soma(FEIRA, [-2.6, 1.6, 0.8]), texto: 'NÃO É CORTE'},
  {a: T.jones, b: T.governo, p: soma(FEIRA, [2.6, 1.6, 0.8]), texto: 'É CORTE', acento: true},
  {a: T.cinco + 0.3, b: T.quatro, p: soma(FEIRA, [-0.6, 1.6, 0.9]), texto: 'R$ 5,00'},
  {a: T.quatro + 0.3, b: T.governo, p: soma(FEIRA, [-0.6, 1.5, 0.9]), texto: 'R$ 4,50', acento: true},
  {a: T.trilhao, b: T.saida, p: soma(JUROS, [-0.8, 5.0, 0.4]), texto: 'JUROS: ≈ R$ 1,2 TRI', acento: true},
  {a: T.vinte, b: T.saida, p: soma(JUROS, [1.4, 1.0, 0.6]), texto: 'AJUSTE: R$ 60 BI'},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.bolsos, T.quem, T.a2015, T.teto, T.regra, T.chegou, T.briga, T.bolsoJuros, T.saida, T.voce].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.cinto + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.cadeado + 0.8, f: 'baque', v: 0.15});
  s.push({t: T.ibge + 0.3, f: 'ding', v: 0.15});
  s.push({t: T.aguentou + 0.3, f: 'baque', v: 0.15});
  s.push({t: T.alguem + 0.3, f: 'baque', v: 0.14});
  s.push({t: T.quatro + 0.3, f: 'pop', v: 0.14});
  s.push({t: T.vinte, f: 'subida', v: 0.15});
  [T.p1, T.p2, T.p3, T.p4, T.p5].forEach((t) => s.push({t, f: 'pop', v: 0.13}));
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.entra + 1.0, T.cinto + 1.0, T.professor + 1.0, T.primeiro + 1.4, T.segundo + 1.2, T.cadeado + 1.4, T.aberto + 1.0,
  T.quem + 1.2, T.cortar + 1.0, T.ibge + 1.0, T.leitura + 1.4, T.caminho + 1.0, T.teto + 1.4, T.resto + 1.6, T.aguentou + 1.0,
  T.mesada + 1.0, T.minimo + 1.0, T.a2023 + 1.4, T.alguem + 1.0, T.plp + 1.6, T.petroleo + 1.6, T.jornalista + 1.0, T.jones + 1.0,
  T.cinco + 1.0, T.quatro + 1.0, T.compra + 1.2, T.governo + 1.0, T.trilhao + 1.2, T.vinte + 1.0, T.custo + 1.0,
  T.p1 + 1.0, T.p3 + 1.0, T.p5 + 1.2, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
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
  arrobaFixo: true,
};

export const EconomistaAvisou: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Crescer menos', 'é corte?', 'Explico fácil'];
export const CapaEconomistaAvisou: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="AJUSTE FISCAL" />
);
