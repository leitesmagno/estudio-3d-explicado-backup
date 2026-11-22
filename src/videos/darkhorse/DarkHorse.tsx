import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {BalancaJustica, Cadeado, CalendarioGrande, CameraTV, CanoMoedas, Congresso, DocumentoGrande, Lupa, Martelo, OrgaoPublico, PastaBets, PilhaMoedas, PredioColunas} from '../../pecas';
import {Claquete} from '../flavioaliados/pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, parado, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 165. dark horse e as emendas (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// CASO EM INVESTIGAÇÃO: só cargos (nenhum nome de investigado), tudo "segundo a PF", defesas citadas, sem condenação.
// Estúdio 3D + Kit Mapas (projetos/165.../mapas/mapa.mp4: estados da 1ª fase; Brasil → Texas). Fontes: projetos/165.../audio/fontes.md.

const P = '165. dark horse e as emendas';
const AUDIO_SEG = 121.46;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  filme: quando('Um filme sobre'),
  duas: quando('São duas investigações'),
  calma: quando('Vou contar com'),
  ninguem: quando('ninguém foi condenado'),
  chama: quando('O filme se chama'),
  gravado: quando('Foi gravado em'),
  primeira: quando('Primeira investigação'),
  dez: quando('Dez de setembro'),
  suspeita: quando('A suspeita, segundo'),
  deputado: quando('um deputado federal indicou'),
  instituto: quando('Esse instituto é'),
  movimentou: quando('E a PF diz'),
  epoca: quando('bem na época'),
  semProva: quando('E, segundo a PF, parte'),
  segunda: quando('Nesta sexta, 13'),
  crimes: quando('Os crimes investigados'),
  negam: quando('O deputado e a sócia'),
  master: quando('Agora, a segunda investigação'),
  delator: quando('Um delator disse'),
  texas: quando('para um fundo com sede'),
  segPF: quando('Segundo a PF, o dinheiro'),
  inquerito: quando('Um ministro do Supremo autorizou'),
  citados: quando('Os citados negam'),
  historia: quando('E aquela história'),
  procurei: quando('Eu procurei'),
  naoDa: quando('Então, por enquanto'),
  resumindo: quando('Resumindo: são suspeitas'),
  semDenuncia: quando('Não tem denúncia'),
  publico: quando('Mas emenda parlamentar'),
  quer: quando('Quer que eu'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'O FILME E A POLÍCIA'],
  [T.chama, 'O FILME'],
  [T.primeira, 'OPERAÇÃO MAKE UP'],
  [T.segunda, 'A 2ª FASE'],
  [T.crimes, 'O QUE SE INVESTIGA'],
  [T.master, 'O FUNDO NO TEXAS'],
  [T.historia, 'BOATO?'],
  [T.resumindo, 'RESUMINDO'],
];

// trechos de mapa: (1) os quatro estados da 1ª fase; (2) Brasil → Texas
const TR: [number, number][] = [
  [T.primeira - 0.05, T.suspeita - 0.05],
  [T.delator - 0.05, T.segPF - 0.05],
];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

const ABRE: V3 = [0, 0, 0];
const FILME: V3 = [12, 0, 0];
const SUSP: V3 = [24, 0, 0];
const FASE2: V3 = [38, 0, 0];
const CRIME: V3 = [50, 0, 0];
const FUNDO: V3 = [62, 0, 0];
const BOATO: V3 = [74, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.chama - 0.3, T.chama)) + entra(t, T.resumindo - 0.3, 0.6);
  const abertura = t < T.chama;
  const filK = vis(t, T.chama - 0.3, T.primeira);
  const susK = vis(t, T.suspeita - 0.3, T.segunda);
  const f2K = vis(t, T.segunda - 0.3, T.crimes);
  const criK = vis(t, T.crimes - 0.3, T.master);
  const funK = vis(t, T.master - 0.3, T.historia);
  const boaK = vis(t, T.historia - 0.3, T.resumindo);

  return (
    <group>
      <Caixa args={[100, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[38, 0.02, 3.8]} sombra={false} />

      {/* Abertura e fecho: o filme, duas pastas de investigação e o Supremo */}
      {abK > 0.02 ? (
        <group>
          <Claquete tema={tema} pos={soma(ABRE, [0, 0, 0.6])} rotY={0} escala={4.0 * Math.min(1, abK)} abre={abertura ? pulso(t, T.filme + 0.4, 1.0) : 0} titulo="DARK HORSE" />
          <PastaBets tema={tema} pos={soma(ABRE, [-2.0, 0.05, 1.2])} rot={[-1.4, 0.3, 0]} escala={0.9 * Math.min(1, abK) * entra(t, abertura ? T.duas : T.resumindo, 0.4)} />
          <PastaBets tema={tema} pos={soma(ABRE, [2.0, 0.05, 1.2])} rot={[-1.4, -0.3, 0]} escala={0.9 * Math.min(1, abK) * entra(t, abertura ? T.duas + 0.3 : T.resumindo, 0.4)} />
          <PredioColunas tema={tema} pos={soma(ABRE, [0, 0, -3.0])} aceso={0.4 + 0.6 * pulso(t, abertura ? T.duas + 0.6 : T.semDenuncia, 1.4)} escala={0.7 * Math.min(1, abK)} />
          {!abertura ? <BalancaJustica tema={tema} pos={soma(ABRE, [3.2, 0, -1.0])} escala={0.6 * entra(t, T.resumindo, 0.5)} inclina={0.08 * Math.sin(t)} /> : null}
        </group>
      ) : null}

      {/* O filme: claquete, câmera e calendário das gravações */}
      {filK > 0.02 ? (
        <group>
          <Claquete tema={tema} pos={soma(FILME, [-1.0, 0, 0.6])} rotY={0.3} escala={3.4 * filK} abre={pulso(t, T.chama + 0.6, 1.0)} titulo="DARK HORSE" />
          <CameraTV tema={tema} pos={soma(FILME, [1.4, 0, 0.2])} rotY={-0.6} escala={2.4 * filK} />
          <CalendarioGrande tema={tema} pos={soma(FILME, [0, 0, -2.2])} texto="OUT–DEZ" sub="2025 · SÃO PAULO" folha={filK} escala={0.6 * filK * entra(t, T.gravado, 0.4)} destaque={pulso(t, T.gravado, 1.0)} />
        </group>
      ) : null}

      {/* A suspeita: emendas → instituto → produtora */}
      {susK > 0.02 ? (
        <group>
          <Congresso tema={tema} pos={soma(SUSP, [-3.6, 0, -2.4])} escala={0.22 * susK} aceso={pulso(t, T.deputado, 1.2)} />
          <CanoMoedas tema={tema} pontos={[soma(SUSP, [-2.8, 1.2, -1.6]), soma(SUSP, [-1.6, 0.9, -0.6]), soma(SUSP, [-0.6, 0.7, -0.4])]} k={susK * entra(t, T.deputado, 0.4)} fluxo={rampa(t, T.deputado + 0.4, T.instituto + 1.0)} brilho={0.2} />
          <OrgaoPublico tema={tema} pos={soma(SUSP, [0, 0, -0.8])} escala={0.55 * susK * entra(t, T.deputado + 0.6, 0.4)} sobe={entra(t, T.deputado + 0.6, 0.6)} letreiro={entra(t, T.deputado + 1.0, 0.5)} texto="INSTITUTO" />
          <OrgaoPublico tema={tema} pos={soma(SUSP, [3.0, 0, -0.8])} escala={0.55 * susK * entra(t, T.instituto, 0.4)} sobe={entra(t, T.instituto, 0.6)} letreiro={entra(t, T.instituto + 0.4, 0.5)} texto="PRODUTORA" />
          <Boneco tema={tema} pos={soma(SUSP, [1.5, 0, 0.8])} rotY={0} escala={0.6 * susK * entra(t, T.instituto, 0.4)} cor={cores[2]} />
          <PilhaMoedas tema={tema} pos={soma(SUSP, [3.0, 0.02, 1.0])} n={Math.max(1, Math.round(12 * rampa(t, T.movimentou, T.movimentou + 1.4)))} cor={dourado} r={0.3} escala={susK * entra(t, T.movimentou, 0.4)} brilho={pulso(t, T.epoca, 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(SUSP, [-0.6, 0.02, 1.0])} n={2} cor={dourado} r={0.24} escala={susK * entra(t, T.deputado + 0.8, 0.4)} />
        </group>
      ) : null}

      {/* A 2ª fase */}
      {f2K > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(FASE2, [-1.4, 0, -0.8])} texto="13/11" sub="2ª FASE" folha={f2K} escala={0.7 * f2K} destaque={pulso(t, T.segunda, 1.0)} />
          <Lupa tema={tema} pos={soma(FASE2, [1.2, 0.6, 0.4])} rot={[0, -0.4, 0.3]} escala={1.1 * f2K * entra(t, T.segunda + 0.6, 0.4)} />
          <PastaBets tema={tema} pos={soma(FASE2, [1.2, 0.05, 0.6])} rot={[-1.4, 0, 0]} escala={0.8 * f2K} />
        </group>
      ) : null}

      {/* O que se investiga e as defesas */}
      {criK > 0.02 ? (
        <group>
          <DocumentoGrande tema={tema} pos={soma(CRIME, [-1.2, 0.05, 0.4])} rot={[-1.3, 0.25, 0]} escala={1.5 * criK} />
          <Boneco tema={tema} pos={soma(CRIME, [1.4, 0, 0.6])} rotY={-0.4} escala={0.6 * criK * entra(t, T.negam - 0.2, 0.4)} cor={cores[1]} pose={{ombroD: [-0.4, 0, 0.9 * pulso(t, T.negam + 0.6, 1.4)]}} />
          <Boneco tema={tema} pos={soma(CRIME, [2.5, 0, 0.6])} rotY={-0.5} escala={0.6 * criK * entra(t, T.negam, 0.4)} cor={cores[2]} pose={{ombroE: [-0.4, 0, -0.9 * pulso(t, T.negam + 0.8, 1.4)]}} />
        </group>
      ) : null}

      {/* O fundo no Texas (o mapa mostra a viagem; aqui o fundo e o sigilo) */}
      {funK > 0.02 ? (
        <group>
          <OrgaoPublico tema={tema} pos={soma(FUNDO, [0.6, 0, -1.2])} escala={0.6 * funK} sobe={funK} letreiro={entra(t, T.master + 0.4, 0.5)} texto="FUNDO" />
          {Array.from({length: 7}).map((_, i) => (
            <PilhaMoedas key={i} tema={tema} pos={soma(FUNDO, [-2.6 + 0.55 * i, 0.02, 1.0])} n={3} cor={dourado} r={0.18} escala={funK * entra(t, T.segPF - 0.6 + 0.08 * i, 0.3)} />
          ))}
          <Cadeado tema={tema} pos={soma(FUNDO, [2.8, 0.4, 0.6])} k={funK * entra(t, T.inquerito, 0.4)} fecha={rampa(t, T.inquerito + 0.8, T.inquerito + 1.4)} />
        </group>
      ) : null}

      {/* O boato do filme não terminado */}
      {boaK > 0.02 ? (
        <group>
          <Claquete tema={tema} pos={soma(BOATO, [-0.8, 0, 0.4])} rotY={0.3} escala={3.4 * boaK} abre={0} titulo="DARK HORSE" />
          <Lupa tema={tema} pos={soma(BOATO, [1.0, 0.8, 0.6])} rot={[0, -0.5, 0.2]} escala={1.2 * boaK * entra(t, T.procurei, 0.4)} />
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 0.9, 0.6]), 5.0, 4.2, [0, 0.3, 1])], [T.duas, E(soma(ABRE, [0, 1.4, -0.6]), 8.4, 6.2, [0.04, 0.32, 1])], [T.calma, E(soma(ABRE, [0, 1.4, -1.0]), 7.8, 6.0, [-0.03, 0.32, 1])], [T.chama, E(soma(ABRE, [0, 1.4, -1.0]), 7.4, 5.8, [-0.05, 0.32, 1])]]},
  {ini: T.chama, chaves: [[T.chama, E(soma(FILME, [-0.6, 0.9, 0.4]), 5.0, 4.0, [0.08, 0.28, 1])], [T.gravado, E(soma(FILME, [0, 1.3, -1.0]), 7.0, 5.2, [0, 0.3, 1])], [T.primeira, E(soma(FILME, [0, 1.3, -1.0]), 6.8, 5.0, [-0.04, 0.3, 1])]]},
  parado(T.primeira, T.suspeita, E(soma(SUSP, [0, 1.4, -0.4]), 9.0, 6.4, [0.05, 0.3, 1])),
  {ini: T.suspeita, chaves: [[T.suspeita, E(soma(SUSP, [-2.2, 1.4, -1.2]), 6.4, 5.0, [0.08, 0.3, 1])], [T.instituto, E(soma(SUSP, [1.0, 1.2, -0.4]), 8.6, 6.0, [0.02, 0.3, 1])], [T.movimentou, E(soma(SUSP, [2.6, 1.2, 0]), 5.8, 4.6, [-0.04, 0.3, 1])], [T.semProva, E(soma(SUSP, [0.2, 1.4, -0.4]), 10.4, 7.0, [-0.02, 0.32, 1])], [T.segunda - 0.1, E(soma(SUSP, [0.2, 1.4, -0.4]), 10.0, 6.8, [-0.05, 0.32, 1])]]},
  {ini: T.segunda, chaves: [[T.segunda, E(soma(FASE2, [-0.6, 1.2, -0.4]), 6.4, 5.0, [0.07, 0.3, 1])], [T.crimes - 0.1, E(soma(FASE2, [0.4, 1.0, 0.2]), 5.6, 4.4, [-0.05, 0.3, 1])]]},
  {ini: T.crimes, chaves: [[T.crimes, E(soma(CRIME, [-1.0, 1.0, 0.4]), 5.6, 4.4, [0.08, 0.34, 1])], [T.negam, E(soma(CRIME, [1.6, 1.1, 0.6]), 5.8, 4.6, [-0.04, 0.3, 1])], [T.master - 0.1, E(soma(CRIME, [1.6, 1.1, 0.6]), 5.6, 4.4, [-0.07, 0.3, 1])]]},
  {ini: T.master, chaves: [[T.master, E(soma(FUNDO, [0.4, 1.4, -0.8]), 7.0, 5.4, [0.06, 0.3, 1])], [T.delator, E(soma(FUNDO, [0.4, 1.4, -0.8]), 6.8, 5.2, [0.04, 0.3, 1])], [T.segPF, E(soma(FUNDO, [-0.8, 1.0, 0.6]), 6.6, 4.8, [0.02, 0.32, 1])], [T.inquerito, E(soma(FUNDO, [2.0, 1.1, 0]), 6.0, 4.6, [-0.05, 0.3, 1])], [T.historia - 0.1, E(soma(FUNDO, [2.0, 1.1, 0]), 5.8, 4.4, [-0.07, 0.3, 1])]]},
  {ini: T.historia, chaves: [[T.historia, E(soma(BOATO, [0, 1.0, 0.4]), 6.0, 4.6, [0.06, 0.3, 1])], [T.procurei, E(soma(BOATO, [0.4, 1.0, 0.6]), 5.0, 4.0, [0, 0.3, 1])], [T.resumindo - 0.1, E(soma(BOATO, [0.4, 1.0, 0.6]), 4.8, 3.8, [-0.04, 0.3, 1])]]},
  {ini: T.resumindo, chaves: [[T.resumindo, E(soma(ABRE, [0, 1.4, -0.8]), 8.6, 6.2, [0.04, 0.34, 1])], [T.semDenuncia, E(soma(ABRE, [0, 1.6, -1.8]), 7.4, 5.6, [0, 0.32, 1])], [T.quer, E(soma(ABRE, [0, 1.4, -0.6]), 9.0, 6.6, [0, 0.36, 1])], [FIM, E(soma(ABRE, [0, 1.4, -0.8]), 9.8, 7.0, [0, 0.4, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.duas, b: T.calma, texto: 'DUAS INVESTIGAÇÕES NO SUPREMO'},
  {a: T.ninguem, b: T.chama, texto: 'ATÉ AGORA, NINGUÉM FOI CONDENADO', destaque: true},
  {a: T.gravado, b: T.primeira, texto: 'GRAVADO EM SÃO PAULO · OUT A DEZ DE 2025'},
  {a: T.suspeita, b: T.instituto, texto: 'SUSPEITA, SEGUNDO A PF'},
  {a: T.deputado + 0.6, b: T.instituto, texto: '2 EMENDAS · R$ 2 MILHÕES', destaque: true},
  {a: T.instituto, b: T.movimentou, texto: 'INSTITUTO PRESIDIDO POR SÓCIA DA PRODUTORA'},
  {a: T.movimentou, b: T.semProva, texto: 'PRODUTORA: R$ 19 MI EM NOV E DEZ DE 2025', destaque: true},
  {a: T.semProva, b: T.segunda, texto: 'PF: PAGAMENTOS SEM PROVA DO SERVIÇO'},
  {a: T.segunda, b: T.crimes, texto: '2ª FASE: 1 MANDADO DE BUSCA EM BRASÍLIA'},
  {a: T.crimes, b: T.negam, texto: 'PECULATO, FALSIDADE, LAVAGEM, ORG. CRIMINOSA, LICITAÇÃO'},
  {a: T.negam, b: T.master, texto: 'OS INVESTIGADOS NEGAM IRREGULARIDADE', destaque: true},
  {a: T.segPF, b: T.inquerito, texto: 'PF: EX-DEPUTADO TERIA ORIENTADO A GESTÃO'},
  {a: T.inquerito, b: T.citados, texto: 'INQUÉRITO AUTORIZADO · EM SIGILO'},
  {a: T.citados, b: T.historia, texto: 'OS CITADOS NEGAM OU NÃO RESPONDERAM', destaque: true},
  {a: T.historia, b: T.procurei, texto: '"O FILME NEM FOI TERMINADO"?'},
  {a: T.procurei, b: T.resumindo, texto: 'NÃO ACHEI EM NENHUM DOCUMENTO OFICIAL', destaque: true},
  {a: T.semDenuncia, b: T.publico, texto: 'SEM DENÚNCIA ACEITA · SEM CONDENAÇÃO', destaque: true},
  {a: T.publico, b: T.quer, texto: 'EMENDA PARLAMENTAR É DINHEIRO PÚBLICO'},
];
const SELOS: Txt[] = [
  {a: T.primeira, b: T.segunda, texto: 'FONTE: PF/STF, VIA GAZETA DO POVO E METRÓPOLES'},
  {a: T.segunda, b: T.master, texto: 'FONTE: GAZETA DO POVO · METRÓPOLES · 13/11/2026'},
  {a: T.delator, b: T.historia, texto: 'FONTE: CNN BRASIL · TERRA · 11/09/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.duas, b: T.chama, p: soma(ABRE, [0, 2.6, -3.0]), texto: 'SUPREMO', acento: true},
  {a: T.deputado, b: T.segunda, p: soma(SUSP, [-3.6, 2.2, -2.4]), texto: 'EMENDA DE DEPUTADO'},
  {a: T.instituto + 0.4, b: T.segunda, p: soma(SUSP, [1.5, 1.8, 0.8]), texto: 'SÓCIA DA PRODUTORA'},
  {a: T.movimentou, b: T.segunda, p: soma(SUSP, [3.0, 2.0, 1.0]), texto: 'R$ 19 MI', acento: true},
  {a: T.segunda + 0.6, b: T.crimes, p: soma(FASE2, [1.2, 1.6, 0.6]), texto: 'EX-ASSESSOR DO DEPUTADO'},
  {a: T.negam, b: T.master, p: soma(CRIME, [2.0, 1.9, 0.6]), texto: 'NEGAM', acento: true},
  {a: T.segPF, b: T.historia, p: soma(FUNDO, [-1.0, 1.2, 1.0]), texto: '7 REPASSES · US$ 12,3 MI', acento: true},
  {a: T.inquerito + 0.8, b: T.historia, p: soma(FUNDO, [2.8, 1.4, 0.6]), texto: 'SIGILO'},
  {a: T.procurei, b: T.resumindo, p: soma(BOATO, [-0.8, 1.8, 0.4]), texto: 'NÃO CONFIRMADO', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.chama, T.suspeita, T.segunda, T.crimes, T.master, T.historia, T.resumindo].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.filme + 0.5, f: 'baque', v: 0.13});
  s.push({t: T.chama + 0.7, f: 'baque', v: 0.13});
  s.push({t: T.deputado + 0.6, f: 'pop', v: 0.13});
  s.push({t: T.movimentou + 1.2, f: 'ding', v: 0.14});
  s.push({t: T.segunda + 0.6, f: 'tique', v: 0.14});
  s.push({t: T.inquerito + 1.2, f: 'baque', v: 0.14});
  s.push({t: T.procurei + 0.4, f: 'bip', v: 0.12});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.duas + 1.0, T.ninguem + 0.6, T.chama + 0.8, T.gravado + 1.0, T.primeira + 1.0, T.dez + 2.0, T.suspeita + 0.6, T.deputado + 1.4,
  T.instituto + 1.0, T.movimentou + 1.6, T.semProva + 1.0, T.segunda + 1.0, T.crimes + 1.0, T.negam + 1.0, T.master + 0.8,
  T.delator + 1.5, T.texas + 1.0, T.segPF + 1.0, T.inquerito + 1.4, T.citados + 0.6, T.historia + 0.6, T.procurei + 1.0,
  T.resumindo + 0.6, T.semDenuncia + 0.8, T.publico + 1.0, T.quer + 0.8, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Dark Horse',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa, fecho: 'FATO, FONTE E O OUTRO LADO'},
  Mundo,
};

export const DarkHorse: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['O filme', 'e as', 'emendas'];
export const CapaDarkHorse: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="DARK HORSE" />
);
