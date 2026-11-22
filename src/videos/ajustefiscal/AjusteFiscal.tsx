import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Ampulheta, BalancaJustica, Barril, CalendarioGrande, Colunas, Congresso, Contracheque, DocumentoGrande, EscolaSimples, Escudo, Lojinha, MarcoAno, Medidor, OrgaoPublico, PilhaMoedas, Plenario, PlacarVotos} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, parado, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 163. ajuste fiscal 2027 (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/163.../mapas/mapa.mp4: Brasília e a Câmara; municípios na crítica da CNM).
// Neutro: governo x críticos com o mesmo espaço. Só cargos, sem nomes. Fontes: projetos/163.../audio/fontes.md.

const P = '163. ajuste fiscal 2027';
const AUDIO_SEG = 138.37;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  sessenta: quando('Sessenta bilhões'),
  tamanho: quando('É o tamanho'),
  gente: quando('E já tem muita'),
  corta: quando('Corta ou não'),
  quarta: quando('Quarta-feira, 11'),
  ministro: quando('O ministro do Planejamento'),
  virou: quando('No mesmo dia'),
  onde: quando('Onde estão os 60'),
  quatro: quando('Vou abrir em'),
  p1: quando('Peça um'),
  furar: quando('Se as contas'),
  cai: quando('o limite de crescimento'),
  ligado: quando('E, uma vez ligado'),
  p2: quando('Peça dois'),
  sobe20: quando('O corte, que hoje'),
  fora: quando('Ficam de fora'),
  p3: quando('Peça três'),
  dias120: quando('O Congresso ganha 120'),
  tres: quando('A economia prevista'),
  p4: quando('Peça quatro'),
  petroleo: quando('o petróleo'),
  calculado: quando('O piso da saúde é calculado'),
  extra: quando('Quando o petróleo dá'),
  tira: quando('O plano tira'),
  menos: quando('Então o piso cresce'),
  diminui: quando('Mas diminui'),
  p2027: quando('Pelos números do ministro'),
  comparar: quando('Para comparar'),
  sobe: quando('Então sobe'),
  naoTanto: quando('Só não sobe'),
  educacao: quando('E a educação fica'),
  protege: quando('O que o texto protege'),
  lados: quando('Agora, os dois lados'),
  governo: quando('O governo diz'),
  juros: quando('Defensores do plano'),
  criticos: quando('Do outro lado, críticos'),
  cnm: quando('E a Confederação'),
  estaAgora: quando('Onde está agora'),
  placar: quando('por 45 votos'),
  destaques: quando('Os quatro destaques'),
  camara: quando('Depois, vai para'),
  resumindo: quando('Resumindo: não é'),
  devagar: quando('É um piso que cresce'),
  prudencia: quando('Se isso é prudência'),
  conta: quando('Me conta nos'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'AJUSTE FISCAL 2027'],
  [T.quarta, 'O PLANO'],
  [T.p1, 'PEÇA 1 · GATILHO'],
  [T.p2, 'PEÇA 2 · ISENÇÕES'],
  [T.p3, 'PEÇA 3 · SUPERSALÁRIOS'],
  [T.p4, 'PEÇA 4 · PETRÓLEO'],
  [T.diminui, 'A SAÚDE DIMINUI?'],
  [T.protege, 'O QUE FICA PROTEGIDO'],
  [T.lados, 'OS DOIS LADOS'],
  [T.estaAgora, 'ONDE ESTÁ AGORA'],
  [T.resumindo, 'RESUMINDO'],
];

// trecho de mapa: a votação e o caminho Senado → Câmara
const TR: [number, number][] = [[T.estaAgora - 0.05, T.resumindo - 0.05]];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

const ABRE: V3 = [0, 0, 0];
const PLANO: V3 = [12, 0, 0];
const GAT: V3 = [24, 0, 0];
const ISE: V3 = [36, 0, 0];
const SUP: V3 = [48, 0, 0];
const PET: V3 = [60, 0, 0];
const PISO: V3 = [72, 0, 0];
const PROT: V3 = [84, 0, 0];
const LADOS: V3 = [96, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.quarta - 0.3, T.quarta)) + entra(t, T.resumindo - 0.3, 0.6);
  const abertura = t < T.quarta;
  const plK = vis(t, T.quarta - 0.3, T.p1);
  const gatK = vis(t, T.p1 - 0.3, T.p2);
  const desce = rampa(t, T.cai + 0.6, T.cai + 2.0);
  const iseK = vis(t, T.p2 - 0.3, T.p3);
  const supK = vis(t, T.p3 - 0.3, T.p4);
  const petK = vis(t, T.p4 - 0.3, T.diminui);
  const tira = rampa(t, T.tira, T.tira + 1.2);
  const pisoK = vis(t, T.diminui - 0.3, T.protege);
  const protK = vis(t, T.protege - 0.3, T.lados);
  const ladK = vis(t, T.lados - 0.3, T.estaAgora);

  return (
    <group>
      <Caixa args={[120, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[48, 0.02, 3.8]} sombra={false} />

      {/* Cena 1 e fecho: R$ 60 bi entre a saúde e a escola */}
      {abK > 0.02 ? (
        <group>
          <OrgaoPublico tema={tema} pos={soma(ABRE, [-2.4, 0, -2.0])} escala={0.7 * Math.min(1, abK)} sobe={Math.min(1, abK)} letreiro={entra(t, T.gente, 0.5)} texto="SAÚDE" />
          <EscolaSimples tema={tema} pos={soma(ABRE, [2.4, 0, -1.8])} luz={Math.min(1, abK) * entra(t, T.gente + 0.4, 0.5)} />
          <PilhaMoedas tema={tema} pos={soma(ABRE, [0, 0.02, 0.6])} n={abertura ? Math.max(1, Math.round(18 * rampa(t, T.sessenta, T.tamanho + 0.6))) : 18} cor={dourado} r={0.36} escala={Math.min(1, abK)} brilho={pulso(t, T.tamanho, 1.2)} />
          {abertura ? null : (
            <Colunas tema={tema} pos={soma(ABRE, [0, 0, 2.0])} a={0.55} b={0.55 + 0.3 * rampa(t, T.devagar, T.devagar + 1.2)} altMax={2.4} corA={mistura(tema.objeto, tema.objetoEscuro, 0.3)} corB={tema.acento} brilhoB={pulso(t, T.devagar + 0.6, 1.2)} />
          )}
        </group>
      ) : null}

      {/* Cena 2: o ministro leva o plano ao Congresso */}
      {plK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(PLANO, [0, 0, -3.0])} escala={0.3 * plK} aceso={pulso(t, T.virou, 1.4)} />
          <Boneco tema={tema} pos={soma(PLANO, [-1.0, 0, 0.8])} rotY={0.3} escala={0.65 * plK * entra(t, T.ministro - 0.2, 0.4)} cor={cores[1]} pose={{ombroD: [-0.8, 0, 0.3]}} />
          <DocumentoGrande tema={tema} pos={soma(PLANO, [0.6, 0.05, 0.9])} rot={[-1.3, -0.2, 0]} escala={0.6 * plK * entra(t, T.virou, 0.4)} carimbo={rampa(t, T.virou + 0.6, T.virou + 1.0)} />
          {[0, 1, 2, 3].map((i) => (
            <MarcoAno key={i} tema={tema} pos={soma(PLANO, [-2.1 + 1.4 * i, 0, 2.2])} ano={`${i + 1}`} k={plK * entra(t, T.quatro + 0.25 * i, 0.4)} aceso={pulso(t, T.quatro + 0.25 * i, 1.0)} />
          ))}
        </group>
      ) : null}

      {/* Peça 1: gatilho dos gastos */}
      {gatK > 0.02 ? (
        <group>
          <Medidor tema={tema} pos={soma(GAT, [0, 0, -0.6])} label="GASTOS" valor={0.62 - 0.12 * desce} bloqueado={t > T.ligado} bloqueioK={rampa(t, T.ligado, T.ligado + 0.8)} acento escala={2.2 * gatK} />
          <PilhaMoedas tema={tema} pos={soma(GAT, [-2.4, 0.02, 0.8])} n={6} cor={dourado} r={0.26} escala={gatK * entra(t, T.furar, 0.4)} brilho={pulso(t, T.furar + 0.6, 1.0)} />
        </group>
      ) : null}

      {/* Peça 2: isenções de impostos */}
      {iseK > 0.02 ? (
        <group>
          <Lojinha tema={tema} pos={soma(ISE, [-1.8, 0, -1.4])} escala={1.0 * iseK} toldo={iseK} />
          <Lojinha tema={tema} pos={soma(ISE, [0.6, 0, -1.6])} escala={0.9 * iseK} toldo={iseK} />
          <PilhaMoedas tema={tema} pos={soma(ISE, [-0.6, 0.02, 0.8])} n={Math.max(1, Math.round(2 + 4 * rampa(t, T.sobe20, T.sobe20 + 1.4)))} cor={dourado} r={0.26} escala={iseK} brilho={pulso(t, T.sobe20 + 1.2, 1.0)} />
          <Escudo tema={tema} pos={soma(ISE, [2.6, 0, 0.4])} rotY={-0.4} escala={0.9 * iseK * entra(t, T.fora - 0.2, 0.4)} acende={pulso(t, T.fora + 0.4, 1.4)} />
        </group>
      ) : null}

      {/* Peça 3: supersalários */}
      {supK > 0.02 ? (
        <group>
          <Contracheque tema={tema} pos={soma(SUP, [-1.4, 0, 0])} rotY={0.3} escala={1.6 * supK} salario={60000} piso={46366} />
          <Ampulheta tema={tema} pos={soma(SUP, [1.6, 0, 0.2])} escala={2.6 * supK * entra(t, T.dias120 - 0.2, 0.4)} areia={rampa(t, T.dias120, T.p4)} fio />
        </group>
      ) : null}

      {/* Peça 4: petróleo e a conta do piso */}
      {petK > 0.02 ? (
        <group>
          {[-2.6, -1.9, -2.25].map((x, i) => (
            <Barril key={i} tema={tema} pos={soma(PET, [x, i === 2 ? 1.0 : 0, i === 2 ? -0.2 : -0.2])} escala={0.9 * petK * entra(t, T.petroleo + 0.15 * i, 0.4)} />
          ))}
          <OrgaoPublico tema={tema} pos={soma(PET, [2.2, 0, -2.0])} escala={0.6 * petK} sobe={petK} letreiro={entra(t, T.calculado, 0.5)} texto="SAÚDE" />
          <PilhaMoedas tema={tema} pos={soma(PET, [0.2, 0.02, 0.6])} n={8} cor={dourado} r={0.3} escala={petK * entra(t, T.calculado, 0.4)} />
          <PilhaMoedas tema={tema} pos={soma(PET, [-0.8, 0.02 + 0.6 * tira, 0.6 - 1.4 * tira])} n={4} cor={mistura(dourado, tema.objetoEscuro, 0.35)} r={0.24} escala={petK * entra(t, T.extra, 0.4) * (1 - 0.6 * tira)} brilho={pulso(t, T.extra + 0.6, 1.0)} />
        </group>
      ) : null}

      {/* A saúde diminui? 2026 x 2027 */}
      {pisoK > 0.02 ? (
        <group>
          <Colunas tema={tema} pos={soma(PISO, [-0.8, 0, -0.4])} a={0.812 * entra(t, T.comparar, 0.6)} b={0.9 * entra(t, T.p2027, 0.6)} altMax={2.6} corA={mistura(tema.objeto, tema.objetoEscuro, 0.3)} corB={tema.acento} brilhoB={pulso(t, T.sobe, 1.2)} />
          <EscolaSimples tema={tema} pos={soma(PISO, [2.6, 0, -0.6])} luz={pisoK * entra(t, T.educacao, 0.5)} />
        </group>
      ) : null}

      {/* O que fica protegido */}
      {protK > 0.02 ? (
        <group>
          <Escudo tema={tema} pos={soma(PROT, [0, 0, -1.8])} escala={1.4 * protK} acende={0.6 + 0.4 * pulso(t, T.protege + 0.8, 1.6)} />
          {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
            <Boneco key={i} tema={tema} pos={soma(PROT, [x, 0, 0.9])} rotY={0.06 * (i - 2)} escala={0.58 * protK * entra(t, T.protege + 0.5 + 0.2 * i, 0.4)} cor={cores[i % cores.length]} />
          ))}
        </group>
      ) : null}

      {/* Os dois lados */}
      {ladK > 0.02 ? (
        <group>
          <BalancaJustica tema={tema} pos={soma(LADOS, [0, 0, -1.6])} escala={0.85 * ladK} inclina={0.15 * Math.sin(t * 1.1)} brilhoEsq={pulso(t, T.governo, 1.2)} brilhoDir={pulso(t, T.criticos, 1.2)} />
          <Boneco tema={tema} pos={soma(LADOS, [-2.4, 0, 0.8])} rotY={0.4} escala={0.62 * ladK * entra(t, T.governo - 0.2, 0.4)} cor={cores[1]} />
          <Boneco tema={tema} pos={soma(LADOS, [2.4, 0, 0.8])} rotY={-0.4} escala={0.62 * ladK * entra(t, T.criticos - 0.2, 0.4)} cor={cores[2]} />
          <OrgaoPublico tema={tema} pos={soma(LADOS, [3.4, 0, -1.4])} escala={0.45 * ladK * entra(t, T.cnm - 0.2, 0.4)} sobe={entra(t, T.cnm - 0.2, 0.6)} letreiro={entra(t, T.cnm, 0.5)} texto="MUNICÍPIOS" />
        </group>
      ) : null}

      {/* fundo da votação (o mapa cobre quase tudo; fica para o corte de saída) */}
      {t > T.estaAgora - 0.3 && t < T.resumindo + 0.2 ? (
        <group>
          <Plenario tema={tema} pos={soma(LADOS, [12, 0, -1.4])} escala={0.6} acesos={1} />
          <PlacarVotos tema={tema} pos={soma(LADOS, [12, 0, 1.0])} escala={0.7} acesos={5} />
          <CalendarioGrande tema={tema} pos={soma(LADOS, [14.4, 0, -0.2])} texto="17/11" sub="DESTAQUES" folha={1} escala={0.6} />
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 1.4, -0.8]), 9.0, 6.6, [0, 0.36, 1])], [T.gente, E(soma(ABRE, [0, 1.4, -1.0]), 8.4, 6.2, [0.04, 0.34, 1])], [T.corta, E(soma(ABRE, [0, 1.2, 0]), 7.0, 5.4, [-0.03, 0.34, 1])], [T.quarta, E(soma(ABRE, [0, 1.2, 0]), 6.8, 5.2, [-0.05, 0.34, 1])]]},
  {ini: T.quarta, chaves: [[T.quarta, E(soma(PLANO, [0, 1.6, -1.6]), 8.0, 6.0, [0.06, 0.3, 1])], [T.ministro, E(soma(PLANO, [-0.4, 1.0, 0.6]), 6.0, 4.6, [0.06, 0.3, 1])], [T.onde, E(soma(PLANO, [0, 0.9, 1.6]), 7.0, 5.0, [0, 0.34, 1])], [T.p1 - 0.1, E(soma(PLANO, [0, 0.9, 1.8]), 6.6, 4.8, [-0.04, 0.34, 1])]]},
  {ini: T.p1, chaves: [[T.p1, E(soma(GAT, [0, 1.2, -0.4]), 6.6, 5.0, [0.06, 0.12, 1])], [T.cai, E(soma(GAT, [0, 1.1, -0.4]), 5.2, 4.2, [0.02, 0.12, 1])], [T.ligado, E(soma(GAT, [-0.6, 1.1, 0]), 6.4, 4.8, [-0.04, 0.3, 1])], [T.p2 - 0.1, E(soma(GAT, [-0.6, 1.1, 0]), 6.2, 4.6, [-0.06, 0.3, 1])]]},
  {ini: T.p2, chaves: [[T.p2, E(soma(ISE, [-0.6, 1.2, -0.6]), 7.0, 5.2, [0.07, 0.3, 1])], [T.sobe20, E(soma(ISE, [-0.6, 1.0, 0.4]), 5.6, 4.4, [0.03, 0.32, 1])], [T.fora, E(soma(ISE, [1.6, 1.1, 0]), 6.4, 4.8, [-0.05, 0.3, 1])], [T.p3 - 0.1, E(soma(ISE, [1.6, 1.1, 0]), 6.2, 4.6, [-0.07, 0.3, 1])]]},
  {ini: T.p3, chaves: [[T.p3, E(soma(SUP, [0, 1.2, 0]), 6.6, 5.0, [0.06, 0.3, 1])], [T.dias120, E(soma(SUP, [0.8, 1.1, 0.2]), 5.6, 4.4, [-0.02, 0.3, 1])], [T.p4 - 0.1, E(soma(SUP, [0.2, 1.1, 0.2]), 6.0, 4.6, [-0.06, 0.3, 1])]]},
  {ini: T.p4, chaves: [[T.p4, E(soma(PET, [-1.4, 1.0, 0]), 6.6, 5.0, [0.08, 0.3, 1])], [T.calculado, E(soma(PET, [0.6, 1.4, -0.6]), 7.4, 5.4, [0.03, 0.3, 1])], [T.tira, E(soma(PET, [-0.2, 1.1, 0.2]), 6.4, 4.8, [-0.02, 0.32, 1])], [T.diminui - 0.1, E(soma(PET, [-0.2, 1.1, 0.2]), 6.2, 4.6, [-0.05, 0.32, 1])]]},
  {ini: T.diminui, chaves: [[T.diminui, E(soma(PISO, [-0.6, 1.6, -0.4]), 6.6, 5.4, [0.06, 0.28, 1])], [T.sobe, E(soma(PISO, [-0.6, 1.8, -0.4]), 6.0, 5.2, [0.02, 0.28, 1])], [T.educacao, E(soma(PISO, [1.6, 1.2, -0.4]), 6.4, 4.8, [-0.05, 0.3, 1])], [T.protege - 0.1, E(soma(PISO, [1.6, 1.2, -0.4]), 6.2, 4.6, [-0.07, 0.3, 1])]]},
  {ini: T.protege, chaves: [[T.protege, E(soma(PROT, [0, 1.4, -0.6]), 8.0, 5.8, [0.05, 0.3, 1])], [T.lados - 0.1, E(soma(PROT, [0, 1.2, 0.2]), 7.4, 5.4, [-0.04, 0.32, 1])]]},
  {ini: T.lados, chaves: [[T.lados, E(soma(LADOS, [0, 1.4, -0.6]), 8.6, 5.8, [0.06, 0.3, 1])], [T.governo, E(soma(LADOS, [-2.0, 1.0, 0.6]), 5.8, 4.6, [0.08, 0.3, 1])], [T.criticos, E(soma(LADOS, [2.0, 1.0, 0.6]), 5.8, 4.6, [-0.06, 0.3, 1])], [T.cnm, E(soma(LADOS, [2.8, 1.2, -0.4]), 6.2, 4.8, [-0.08, 0.3, 1])], [T.estaAgora - 0.1, E(soma(LADOS, [2.8, 1.2, -0.4]), 6.0, 4.6, [-0.09, 0.3, 1])]]},
  parado(T.estaAgora, T.resumindo, E(soma(LADOS, [12.8, 1.2, -0.2]), 7.0, 5.2, [0.04, 0.3, 1])),
  {ini: T.resumindo, chaves: [[T.resumindo, E(soma(ABRE, [0, 1.4, 0.6]), 8.6, 6.2, [0.04, 0.34, 1])], [T.devagar, E(soma(ABRE, [0, 1.3, 1.4]), 6.8, 5.2, [0, 0.34, 1])], [T.conta, E(soma(ABRE, [0, 1.4, 0.2]), 9.0, 6.6, [0, 0.38, 1])], [FIM, E(soma(ABRE, [0, 1.4, 0]), 9.8, 7.0, [0, 0.4, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.sessenta, b: T.gente, texto: 'AJUSTE DE R$ 60 BILHÕES EM 2027', destaque: true},
  {a: T.gente, b: T.quarta, texto: 'CORTA A SAÚDE E A EDUCAÇÃO?'},
  {a: T.virou, b: T.onde, texto: 'PROJETO DE LEI COMPLEMENTAR 299/2026'},
  {a: T.cai, b: T.ligado, texto: 'LIMITE: DE 2,5% PARA 2% ACIMA DA INFLAÇÃO', destaque: true},
  {a: T.ligado, b: T.p2, texto: 'LIGOU, NÃO DESLIGA NO MESMO ANO'},
  {a: T.sobe20, b: T.fora, texto: 'CORTE NAS ISENÇÕES: DE 10% PARA 20%', destaque: true},
  {a: T.fora, b: T.p3, texto: 'FORA: ZONA FRANCA, CESTA BÁSICA, MICRO E PEQUENAS, MCMV, PROUNI'},
  {a: T.dias120, b: T.tres, texto: '120 DIAS PARA REGULAMENTAR OS PENDURICALHOS'},
  {a: T.tres, b: T.p4, texto: 'ECONOMIA: ≈ R$ 3 BILHÕES EM 2027', destaque: true},
  {a: T.tira, b: T.menos, texto: 'RECEITA EXTRA DO PETRÓLEO FORA DA CONTA ATÉ 2030', destaque: true},
  {a: T.menos, b: T.diminui, texto: 'O PISO CRESCE MENOS DO QUE CRESCERIA'},
  {a: T.p2027, b: T.comparar, texto: 'PISO DA SAÚDE 2027: R$ 272,2 BI', destaque: true},
  {a: T.comparar, b: T.sobe, texto: 'PROJETO DO ORÇAMENTO 2026: R$ 245,6 BI'},
  {a: T.sobe, b: T.educacao, texto: 'SOBE, MAS MENOS DO QUE SUBIRIA', destaque: true},
  {a: T.educacao, b: T.protege, texto: 'EDUCAÇÃO: R$ 141,2 BI · R$ 2,4 BI ACIMA DO MÍNIMO'},
  {a: T.protege, b: T.lados, texto: 'FORA DO CONTINGENCIAMENTO', destaque: true},
  {a: T.cnm, b: T.estaAgora, texto: 'CNM: ≈ R$ 2 BI A MENOS NA MÉDIA E ALTA COMPLEXIDADE'},
  {a: T.devagar, b: T.prudencia, texto: 'NÃO É CORTE: É UM PISO QUE CRESCE MAIS DEVAGAR', destaque: true},
  {a: T.prudencia, b: T.conta, texto: 'PRUDÊNCIA OU APERTO? VOCÊ DECIDE'},
];
const SELOS: Txt[] = [
  {a: T.sessenta, b: T.quarta, texto: 'FONTE: AGÊNCIA SENADO · 11/11/2026'},
  {a: T.p1, b: T.p4, texto: 'FONTE: PLP 299/2026, VIA JORNAL DE BRASÍLIA E INVESTNEWS'},
  {a: T.p2027, b: T.protege, texto: 'FONTE: MINISTRO DO PLANEJAMENTO NA CMO · PLOA 2026'},
  {a: T.cnm, b: T.estaAgora, texto: 'FONTE: CNM, VIA BRASIL 61 · 05/11/2026'},
  {a: T.estaAgora, b: T.resumindo, texto: 'FONTE: AGÊNCIA SENADO · 12/11/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.p1 + 0.3, b: T.p2, p: soma(GAT, [0, 2.6, -0.6]), texto: 'O GATILHO', acento: true},
  {a: T.p2 + 0.3, b: T.sobe20, p: soma(ISE, [-0.6, 2.4, -1.4]), texto: 'IMPOSTO QUE AS EMPRESAS NÃO PAGAM'},
  {a: T.fora, b: T.p3, p: soma(ISE, [2.6, 1.9, 0.4]), texto: 'PROTEGIDOS', acento: true},
  {a: T.p3 + 0.3, b: T.p4, p: soma(SUP, [-1.4, 2.3, 0]), texto: 'ACIMA DO TETO'},
  {a: T.petroleo, b: T.diminui, p: soma(PET, [-2.2, 2.2, -0.2]), texto: 'RECEITA EXTRA DO PETRÓLEO', acento: true},
  {a: T.calculado, b: T.diminui, p: soma(PET, [2.2, 2.6, -2.0]), texto: 'PISO = 15% DA RECEITA'},
  {a: T.comparar, b: T.protege, p: soma(PISO, [-1.3, 2.5, -0.4]), texto: '2026: R$ 245,6 BI'},
  {a: T.p2027, b: T.protege, p: soma(PISO, [-0.3, 2.8, -0.4]), texto: '2027: R$ 272,2 BI', acento: true},
  {a: T.protege + 0.5, b: T.lados, p: soma(PROT, [0, 1.9, 0.9]), texto: 'APOSENTADORIAS · BENEFÍCIOS · SERVIDORES · PISOS'},
  {a: T.governo, b: T.estaAgora, p: soma(LADOS, [-2.4, 2.0, 0.8]), texto: 'GOVERNO: NÃO É CHOQUE FISCAL', acento: true},
  {a: T.juros, b: T.estaAgora, p: soma(LADOS, [-2.4, 1.5, 0.8]), texto: 'DEFENSORES: AJUDA A BAIXAR JUROS'},
  {a: T.criticos, b: T.estaAgora, p: soma(LADOS, [2.4, 2.0, 0.8]), texto: 'CRÍTICOS: SAÚDE CRESCE MENOS', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.quarta, T.p1, T.p2, T.p3, T.p4, T.diminui, T.protege, T.lados, T.resumindo].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.sessenta + 0.2, f: 'subida', v: 0.14});
  s.push({t: T.virou + 0.7, f: 'baque', v: 0.14});
  [0, 1, 2, 3].forEach((i) => s.push({t: T.quatro + 0.25 * i, f: 'pop', v: 0.12}));
  s.push({t: T.ligado + 0.5, f: 'baque', v: 0.15});
  s.push({t: T.tira + 0.6, f: 'whoosh', v: 0.14});
  s.push({t: T.sobe, f: 'ding', v: 0.15});
  s.push({t: T.protege + 0.8, f: 'ding', v: 0.14});
  s.push({t: T.devagar + 0.6, f: 'ding', v: 0.15});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.tamanho + 1.0, T.gente + 1.0, T.quarta + 0.6, T.ministro + 0.8, T.virou + 1.0, T.quatro + 1.2, T.p1 + 0.6, T.cai + 1.6,
  T.ligado + 1.0, T.p2 + 0.6, T.sobe20 + 1.4, T.fora + 1.0, T.p3 + 0.6, T.dias120 + 1.0, T.tres + 0.6, T.p4 + 0.8, T.calculado + 1.0,
  T.extra + 1.0, T.tira + 1.4, T.menos + 0.6, T.diminui + 0.4, T.p2027 + 1.0, T.comparar + 1.0, T.sobe + 0.6, T.educacao + 1.0,
  T.protege + 1.2, T.lados + 0.6, T.governo + 1.0, T.juros + 1.0, T.criticos + 1.0, T.cnm + 1.2, T.estaAgora + 1.0, T.destaques + 0.8,
  T.resumindo + 0.6, T.devagar + 1.4, T.prudencia + 0.6, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Ajuste fiscal',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa},
  Mundo,
};

export const AjusteFiscal: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Vão cortar', 'a saúde?', 'Os números'];
export const CapaAjusteFiscal: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="AJUSTE FISCAL" />
);
