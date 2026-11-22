import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {Banco} from '../../base/cidade';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Ampulheta, BalancaJustica, Cadeado, CalendarioGrande, Colunas, DocumentoGrande, Martelo, Medidor, PilhaMoedas, Torneira} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, parado, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 164. agro e banco do brasil (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/164.../mapas/mapa.mp4: o Centro-Oeste em destaque).
// Neutro: banco x associação dos produtores com o mesmo espaço; "calote" só na fala de quem nega. Fontes: projetos/164.../audio/fontes.md.

const P = '164. agro e banco do brasil';
const AUDIO_SEG = 116.9;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  agro: quando('O agro cresceu'),
  puxou: quando('Puxou a economia'),
  mas: quando('Mas o Banco do Brasil acaba'),
  como: quando('Como as duas'),
  tamanho: quando('Primeiro, o tamanho'),
  maior: quando('é o maior banco'),
  clientes: quando('Tem mais de dois'),
  ativo: quando('e 566 mil'),
  safra: quando('E boa parte desse'),
  bi610: quando('O deste ano'),
  juros: quando('e em boa parte dele'),
  tesouro: quando('Quem cobre essa'),
  problema: quando('Agora, o problema'),
  setembro: quando('Em setembro, as dívidas'),
  antes: quando('Um ano antes'),
  lucro: quando('E o lucro do banco'),
  detalhe: quando('Mas olha o detalhe'),
  dia90: quando('Cerca de 90'),
  mil31: quando('Os atrasados são'),
  grosso: quando('Segundo o banco, o grosso'),
  julho: quando('Em julho, o governo'),
  bi13: quando('No Banco do Brasil, 13'),
  quinze: quando('Mas só 15'),
  porque: quando('E por quê'),
  risco: quando('A presidente do banco'),
  explica: quando('Risco moral é quando'),
  vice: quando('O vice-presidente'),
  outro: quando('Agora, o outro lado'),
  entrada: quando('Diz que a renegociação'),
  credito: quando('E que o crédito rural'),
  eBanco: quando('E o banco? Vai'),
  portas: quando('Mas disse que continua'),
  resumindo: quando('Resumindo: a maioria'),
  grupo: quando('Um grupo menor'),
  imposto: quando('E, como o crédito'),
  voce: quando('E você, acha'),
  segue: quando('E segue'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'AGRO E BANCO DO BRASIL'],
  [T.tamanho, 'O TAMANHO'],
  [T.problema, 'O PROBLEMA'],
  [T.detalhe, 'QUEM ESTÁ ATRASADO'],
  [T.julho, 'A RENEGOCIAÇÃO'],
  [T.porque, 'RISCO MORAL'],
  [T.outro, 'O OUTRO LADO'],
  [T.eBanco, 'O QUE O BANCO FAZ'],
  [T.resumindo, 'RESUMINDO'],
];

// trecho de mapa: o Centro-Oeste (de "Segundo o banco, o grosso" até "Em julho")
const TR: [number, number][] = [[T.grosso - 0.1, T.julho - 0.05]];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

const ABRE: V3 = [0, 0, 0];
const TAM: V3 = [14, 0, 0];
const PROB: V3 = [26, 0, 0];
const DET: V3 = [38, 0, 0];
const RENEG: V3 = [50, 0, 0];
const RISCO: V3 = [62, 0, 0];
const OUTRO: V3 = [74, 0, 0];
const COBRA: V3 = [86, 0, 0];

// lavoura: fileiras de plantinhas que crescem
const Lavoura: React.FC<{tema: Tema; pos: V3; k: number; cresce: number; fileiras?: number; larg?: number}> = ({tema, pos, k, cresce, fileiras = 7, larg = 6}) => {
  const festa = tema.festa!;
  const terra = mistura(festa.loiro, tema.objetoEscuro, 0.35);
  const folha = mistura(festa.verde, tema.objeto, 0.25);
  if (k < 0.02) return null;
  return (
    <group position={pos} scale={[k, k, k]}>
      <Caixa args={[larg + 0.4, 0.06, fileiras * 0.5 + 0.3]} raio={0.02} cor={terra} position={[0, 0.03, 0]} sombra={false} />
      {Array.from({length: fileiras}).map((_, f) =>
        Array.from({length: Math.round(larg / 0.5)}).map((__, i) => {
          const h = 0.12 + 0.28 * cresce * (0.8 + 0.2 * Math.sin(i * 1.7 + f));
          return <Caixa key={`${f}-${i}`} args={[0.18, h, 0.18]} raio={0.06} cor={folha} position={[-larg / 2 + 0.25 + i * 0.5, 0.06 + h / 2, -((fileiras - 1) * 0.5) / 2 + f * 0.5]} sombra={false} />;
        }),
      )}
    </group>
  );
};

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.tamanho - 0.3, T.tamanho)) + entra(t, T.resumindo - 0.3, 0.6);
  const abertura = t < T.tamanho;
  const tamK = vis(t, T.tamanho - 0.3, T.problema);
  const probK = vis(t, T.problema - 0.3, T.detalhe);
  const detK = vis(t, T.detalhe - 0.3, T.grosso);
  const renK = vis(t, T.julho - 0.3, T.porque);
  const riscoK = vis(t, T.porque - 0.3, T.outro);
  const outK = vis(t, T.outro - 0.3, T.eBanco);
  const cobK = vis(t, T.eBanco - 0.3, T.resumindo);

  return (
    <group>
      <Caixa args={[110, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[44, 0.02, 4.2]} sombra={false} />

      {/* Abertura e fecho: lavoura crescendo e o banco */}
      {abK > 0.02 ? (
        <group>
          <Lavoura tema={tema} pos={soma(ABRE, [0, 0, 0.4])} k={Math.min(1, abK)} cresce={abertura ? rampa(t, T.agro, T.puxou + 0.8) : 1} />
          <Banco tema={tema} pos={soma(ABRE, [0, 0, -3.4])} sobe={Math.min(1, abK) * (abertura ? entra(t, T.mas - 0.2, 0.5) : 1)} pulso={pulso(t, T.mas + 0.6, 1.4)} />
          {!abertura ? <Torneira tema={tema} pos={soma(ABRE, [3.4, 0, -1.6])} abre={rampa(t, T.imposto, T.imposto + 0.8)} k={entra(t, T.imposto - 0.2, 0.5)} brilho={pulso(t, T.imposto + 0.8, 1.2)} /> : null}
        </group>
      ) : null}

      {/* O tamanho: banco, clientes, Plano Safra e Tesouro */}
      {tamK > 0.02 ? (
        <group>
          <Banco tema={tema} pos={soma(TAM, [-2.2, 0, -2.4])} sobe={tamK} pulso={pulso(t, T.maior, 1.2)} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(TAM, [-3.6 + 0.7 * i, 0, 0.6 + 0.25 * (i % 2)])} rotY={0.1 * (i - 3)} escala={0.42 * tamK * entra(t, T.clientes + 0.12 * i, 0.4)} cor={cores[i % cores.length]} />
          ))}
          <PilhaMoedas tema={tema} pos={soma(TAM, [1.6, 0.02, 0.6])} n={Math.max(1, Math.round(14 * rampa(t, T.bi610, T.bi610 + 1.2)))} cor={dourado} r={0.34} escala={tamK * entra(t, T.safra, 0.4)} brilho={pulso(t, T.bi610 + 1.0, 1.0)} />
          <Torneira tema={tema} pos={soma(TAM, [3.2, 0, -1.6])} abre={rampa(t, T.tesouro, T.tesouro + 0.8)} k={tamK * entra(t, T.tesouro - 0.2, 0.5)} brilho={pulso(t, T.tesouro + 0.8, 1.2)} />
        </group>
      ) : null}

      {/* O problema: atraso acima de 90 dias e o lucro */}
      {probK > 0.02 ? (
        <group>
          <Medidor tema={tema} pos={soma(PROB, [-1.4, 0, -0.4])} label="ATRASO +90 DIAS" valor={0.3 + 0.18 * rampa(t, T.setembro + 0.4, T.setembro + 1.8) - 0.18 * rampa(t, T.antes, T.antes + 0.6) * (1 - rampa(t, T.antes + 1.4, T.antes + 2.2))} acento escala={2.0 * probK} />
          <Colunas tema={tema} pos={soma(PROB, [2.0, 0, -0.4])} a={0.9 * entra(t, T.lucro - 0.2, 0.5)} b={0.9 * entra(t, T.lucro - 0.2, 0.5) * (1 - 0.665 * rampa(t, T.lucro + 0.6, T.lucro + 1.8))} altMax={2.4} corA={mistura(tema.objeto, tema.objetoEscuro, 0.3)} corB={tema.acento} brilhoB={pulso(t, T.lucro + 1.8, 1.0)} />
        </group>
      ) : null}

      {/* O detalhe: 9 em cada 10 em dia */}
      {detK > 0.02 ? (
        <group>
          {Array.from({length: 10}).map((_, i) => (
            <Boneco key={i} tema={tema} pos={soma(DET, [-2.7 + 0.6 * i, 0, 0.4])} rotY={0} escala={0.5 * detK * entra(t, T.dia90 - 0.2 + 0.05 * i, 0.4)} cor={i === 9 ? mistura(tema.acento, tema.objeto, 0.2 * (1 - pulso(t, T.mil31, 1.6))) : mistura(festa.verde, tema.objeto, 0.4)} />
          ))}
          <Lavoura tema={tema} pos={soma(DET, [0, 0, -2.4])} k={detK} cresce={1} fileiras={4} larg={6} />
        </group>
      ) : null}

      {/* A renegociação */}
      {renK > 0.02 ? (
        <group>
          <DocumentoGrande tema={tema} pos={soma(RENEG, [-1.8, 0.05, 0.4])} rot={[-1.3, 0.25, 0]} escala={1.4 * renK} carimbo={rampa(t, T.julho + 0.8, T.julho + 1.2)} />
          <PilhaMoedas tema={tema} pos={soma(RENEG, [0.6, 0.02, 0.4])} n={Math.max(1, Math.round(6 * rampa(t, T.bi13, T.bi13 + 1.0)))} cor={dourado} r={0.3} escala={renK * entra(t, T.bi13, 0.4)} brilho={pulso(t, T.bi13 + 0.9, 1.0)} />
          <Colunas tema={tema} pos={soma(RENEG, [2.6, 0, -0.4])} a={0.9 * entra(t, T.quinze - 0.2, 0.5)} b={0.135 * entra(t, T.quinze, 0.6)} altMax={2.4} corA={mistura(tema.objeto, tema.objetoEscuro, 0.3)} corB={tema.acento} brilhoB={pulso(t, T.quinze + 0.6, 1.2)} />
        </group>
      ) : null}

      {/* Risco moral: quem espera uma condição melhor */}
      {riscoK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(RISCO, [-1.2, 0, 0.6])} rotY={0.5} escala={0.65 * riscoK} cor={cores[1]} />
          <Ampulheta tema={tema} pos={soma(RISCO, [0.4, 0, 0.6])} escala={2.6 * riscoK * entra(t, T.explica, 0.4)} areia={rampa(t, T.explica, T.outro)} fio />
          <CalendarioGrande tema={tema} pos={soma(RISCO, [2.2, 0, -0.8])} texto="DEPOIS?" sub="CONDIÇÃO MELHOR" folha={riscoK} escala={0.6 * riscoK * entra(t, T.explica + 1.0, 0.4)} destaque={pulso(t, T.vice, 1.2)} />
        </group>
      ) : null}

      {/* O outro lado: os produtores */}
      {outK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(OUTRO, [-2.0, 0, 0.6])} rotY={0.4} escala={0.65 * outK} cor={mistura(festa.verde, tema.objeto, 0.4)} pose={{ombroD: [-0.9, 0, 0.3]}} />
          <Cadeado tema={tema} pos={soma(OUTRO, [-0.4, 0.4, 0.6])} k={outK * entra(t, T.entrada, 0.4)} fecha={rampa(t, T.entrada + 0.6, T.entrada + 1.2)} />
          <Colunas tema={tema} pos={soma(OUTRO, [2.0, 0, -0.4])} a={0.9 * entra(t, T.credito - 0.2, 0.5)} b={0.9 * entra(t, T.credito - 0.2, 0.5) * (1 - 0.257 * rampa(t, T.credito + 0.6, T.credito + 1.6))} altMax={2.4} corA={mistura(tema.objeto, tema.objetoEscuro, 0.3)} corB={tema.acento} brilhoB={pulso(t, T.credito + 1.6, 1.0)} />
          <Lavoura tema={tema} pos={soma(OUTRO, [0, 0, -2.6])} k={outK} cresce={0.8} fileiras={3} larg={6} />
        </group>
      ) : null}

      {/* O que o banco faz */}
      {cobK > 0.02 ? (
        <group>
          <Banco tema={tema} pos={soma(COBRA, [-0.8, 0, -1.8])} sobe={cobK} pulso={pulso(t, T.portas, 1.4)} />
          <Martelo tema={tema} pos={soma(COBRA, [1.8, 0, 0.6])} escala={0.8 * cobK} bate={rampa(t, T.eBanco + 1.0, T.eBanco + 1.3) * (1 - rampa(t, T.eBanco + 1.5, T.eBanco + 1.9))} rotY={-0.4} />
          <BalancaJustica tema={tema} pos={soma(COBRA, [-2.8, 0, 0.6])} escala={0.5 * cobK} inclina={0.1 * Math.sin(t)} />
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 0.8, 0.4]), 7.4, 5.6, [0, 0.42, 1])], [T.puxou, E(soma(ABRE, [0, 1.0, -0.4]), 8.2, 6.2, [0.04, 0.38, 1])], [T.mas, E(soma(ABRE, [0, 1.4, -2.0]), 6.8, 5.4, [0, 0.32, 1])], [T.tamanho, E(soma(ABRE, [0, 1.4, -2.0]), 6.4, 5.2, [-0.05, 0.32, 1])]]},
  {ini: T.tamanho, chaves: [[T.tamanho, E(soma(TAM, [-2.0, 1.4, -1.6]), 6.8, 5.2, [0.08, 0.3, 1])], [T.clientes, E(soma(TAM, [-2.0, 0.9, 0.4]), 6.0, 4.6, [0.04, 0.32, 1])], [T.safra, E(soma(TAM, [1.4, 1.2, 0.2]), 6.0, 4.8, [0, 0.32, 1])], [T.tesouro, E(soma(TAM, [2.6, 1.4, -0.6]), 6.0, 4.8, [-0.06, 0.3, 1])], [T.problema - 0.1, E(soma(TAM, [2.6, 1.4, -0.6]), 5.8, 4.6, [-0.08, 0.3, 1])]]},
  {ini: T.problema, chaves: [[T.problema, E(soma(PROB, [-1.2, 1.2, -0.4]), 5.6, 4.6, [0.08, 0.12, 1])], [T.antes + 0.6, E(soma(PROB, [-1.2, 1.2, -0.4]), 5.2, 4.4, [0.04, 0.12, 1])], [T.lucro, E(soma(PROB, [1.8, 1.3, -0.4]), 5.4, 4.6, [-0.04, 0.3, 1])], [T.detalhe - 0.1, E(soma(PROB, [1.8, 1.3, -0.4]), 5.2, 4.4, [-0.07, 0.3, 1])]]},
  {ini: T.detalhe, chaves: [[T.detalhe, E(soma(DET, [0, 1.2, -0.6]), 8.0, 5.6, [0.05, 0.32, 1])], [T.mil31, E(soma(DET, [2.2, 0.8, 0.4]), 5.0, 4.0, [-0.04, 0.32, 1])], [T.grosso, E(soma(DET, [2.2, 0.8, 0.4]), 4.8, 3.8, [-0.06, 0.32, 1])]]},
  parado(T.grosso, T.julho, E(soma(RENEG, [0, 1.2, 0]), 7.0, 5.2, [0.06, 0.3, 1])),
  {ini: T.julho, chaves: [[T.julho, E(soma(RENEG, [-1.4, 1.0, 0.4]), 5.6, 4.4, [0.08, 0.32, 1])], [T.bi13, E(soma(RENEG, [0.4, 1.0, 0.4]), 5.6, 4.4, [0.02, 0.32, 1])], [T.quinze, E(soma(RENEG, [2.2, 1.3, -0.2]), 5.4, 4.4, [-0.05, 0.3, 1])], [T.porque - 0.1, E(soma(RENEG, [2.2, 1.3, -0.2]), 5.2, 4.2, [-0.07, 0.3, 1])]]},
  {ini: T.porque, chaves: [[T.porque, E(soma(RISCO, [0, 1.2, 0]), 7.0, 5.2, [0.06, 0.3, 1])], [T.explica, E(soma(RISCO, [-0.2, 1.0, 0.6]), 5.6, 4.4, [0.03, 0.32, 1])], [T.vice, E(soma(RISCO, [1.4, 1.1, -0.2]), 6.0, 4.6, [-0.05, 0.3, 1])], [T.outro - 0.1, E(soma(RISCO, [1.4, 1.1, -0.2]), 5.8, 4.4, [-0.07, 0.3, 1])]]},
  {ini: T.outro, chaves: [[T.outro, E(soma(OUTRO, [-1.4, 1.0, 0.4]), 5.8, 4.6, [0.08, 0.32, 1])], [T.entrada, E(soma(OUTRO, [-1.0, 0.9, 0.6]), 5.0, 4.0, [0.04, 0.32, 1])], [T.credito, E(soma(OUTRO, [1.8, 1.3, -0.4]), 5.4, 4.4, [-0.04, 0.3, 1])], [T.eBanco - 0.1, E(soma(OUTRO, [1.8, 1.3, -0.4]), 5.2, 4.2, [-0.07, 0.3, 1])]]},
  {ini: T.eBanco, chaves: [[T.eBanco, E(soma(COBRA, [0, 1.2, -0.4]), 7.4, 5.4, [0.06, 0.3, 1])], [T.portas, E(soma(COBRA, [-0.8, 1.2, -1.0]), 6.0, 4.8, [0, 0.3, 1])], [T.resumindo - 0.1, E(soma(COBRA, [-0.8, 1.2, -1.0]), 5.8, 4.6, [-0.04, 0.3, 1])]]},
  {ini: T.resumindo, chaves: [[T.resumindo, E(soma(ABRE, [0, 1.0, 0]), 8.6, 6.2, [0.04, 0.38, 1])], [T.imposto, E(soma(ABRE, [1.6, 1.4, -1.6]), 7.6, 5.8, [-0.04, 0.34, 1])], [T.voce, E(soma(ABRE, [0.6, 1.2, -0.6]), 9.0, 6.6, [0, 0.38, 1])], [FIM, E(soma(ABRE, [0.6, 1.3, -0.8]), 9.8, 7.0, [0, 0.4, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.agro, b: T.mas, texto: 'AGROPECUÁRIA: +11,7% EM 2025', destaque: true},
  {a: T.mas, b: T.tamanho, texto: 'UM GRUPO NÃO ESTÁ PAGANDO, DIZ O BANCO'},
  {a: T.maior, b: T.clientes, texto: 'MAIOR FINANCIADOR DO AGRO'},
  {a: T.clientes, b: T.safra, texto: '2,5 MILHÕES DE PRODUTORES · 566 MIL COM EMPRÉSTIMO'},
  {a: T.bi610, b: T.tesouro, texto: 'PLANO SAFRA 2026/27: R$ 610 BILHÕES', destaque: true},
  {a: T.tesouro, b: T.problema, texto: 'O TESOURO COBRE PARTE DOS JUROS'},
  {a: T.setembro, b: T.lucro, texto: 'ATRASO +90 DIAS: 4,84% → 6,92%', destaque: true},
  {a: T.lucro, b: T.detalhe, texto: 'LUCRO DO TRIMESTRE: −66,5%', destaque: true},
  {a: T.dia90, b: T.mil31, texto: '≈ 90% DOS CLIENTES RURAIS EM DIA', destaque: true},
  {a: T.mil31, b: T.grosso, texto: '≈ 31 MIL ATRASADOS'},
  {a: T.julho, b: T.bi13, texto: 'MEDIDA PROVISÓRIA 1.376 · JULHO DE 2026'},
  {a: T.bi13, b: T.quinze, texto: 'NO BB: R$ 13,4 BI RENEGOCIADOS'},
  {a: T.quinze, b: T.porque, texto: 'SÓ 15% DOS ATRASADOS ADERIRAM', destaque: true},
  {a: T.explica, b: T.vice, texto: 'RISCO MORAL: ADIAR ESPERANDO CONDIÇÃO MELHOR'},
  {a: T.outro, b: T.entrada, texto: 'APROSOJA: "NÃO É CALOTEIRO"'},
  {a: T.entrada, b: T.credito, texto: 'EXIGIRAM ENTRADA E MAIS GARANTIAS'},
  {a: T.credito, b: T.eBanco, texto: 'CRÉDITO RURAL: −25,7% NO INÍCIO DA SAFRA', destaque: true},
  {a: T.eBanco, b: T.portas, texto: 'MAIS COBRANÇA, MAIS GARANTIA, JUSTIÇA'},
  {a: T.portas, b: T.resumindo, texto: '"PORTAS ABERTAS PARA RENEGOCIAR"'},
  {a: T.resumindo, b: T.grupo, texto: 'A MAIORIA PAGA EM DIA', destaque: true},
  {a: T.imposto, b: T.voce, texto: 'JURO BANCADO PELO TESOURO: INTERESSA A TODOS'},
];
const SELOS: Txt[] = [
  {a: T.agro, b: T.tamanho, texto: 'FONTE: IBGE · PIB 2025'},
  {a: T.clientes, b: T.problema, texto: 'FONTE: BANCO DO BRASIL · MAPA · PLANO SAFRA 2026/27'},
  {a: T.setembro, b: T.julho, texto: 'FONTE: BANCO DO BRASIL · RESULTADO 3º TRI 2026'},
  {a: T.julho, b: T.outro, texto: 'FONTE: BANCO DO BRASIL, VIA AGÊNCIA BRASIL · 12/11/2026'},
  {a: T.outro, b: T.eBanco, texto: 'FONTE: APROSOJA BRASIL, VIA INFOMONEY · 13/11/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.mas, b: T.tamanho, p: soma(ABRE, [0, 2.4, -3.4]), texto: 'BANCO DO BRASIL', acento: true},
  {a: T.bi610, b: T.problema, p: soma(TAM, [1.6, 2.0, 0.6]), texto: 'R$ 610 BI', acento: true},
  {a: T.tesouro, b: T.problema, p: soma(TAM, [3.2, 2.8, -1.6]), texto: 'TESOURO (DINHEIRO PÚBLICO)'},
  {a: T.lucro, b: T.detalhe, p: soma(PROB, [2.0, 2.9, -0.4]), texto: 'LUCRO'},
  {a: T.dia90, b: T.grosso, p: soma(DET, [-0.6, 1.6, 0.4]), texto: '9 EM CADA 10 EM DIA'},
  {a: T.mil31, b: T.grosso, p: soma(DET, [2.7, 1.6, 0.4]), texto: '31 MIL', acento: true},
  {a: T.quinze, b: T.porque, p: soma(RENEG, [2.6, 2.9, -0.4]), texto: '15% ADERIRAM', acento: true},
  {a: T.risco, b: T.outro, p: soma(RISCO, [-1.2, 1.8, 0.6]), texto: 'RISCO MORAL', acento: true},
  {a: T.outro + 0.3, b: T.eBanco, p: soma(OUTRO, [-2.0, 1.8, 0.6]), texto: 'PRODUTORES (APROSOJA)', acento: true},
  {a: T.credito + 0.6, b: T.eBanco, p: soma(OUTRO, [2.0, 2.9, -0.4]), texto: 'CRÉDITO RURAL'},
  {a: T.portas, b: T.resumindo, p: soma(COBRA, [-0.8, 2.6, -1.8]), texto: 'PORTAS ABERTAS', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.tamanho, T.problema, T.detalhe, T.julho, T.porque, T.outro, T.eBanco, T.resumindo].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.agro + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.mas + 0.6, f: 'bip', v: 0.12});
  s.push({t: T.bi610 + 1.0, f: 'ding', v: 0.14});
  s.push({t: T.setembro + 1.6, f: 'baque', v: 0.14});
  s.push({t: T.lucro + 1.6, f: 'baque', v: 0.15});
  s.push({t: T.mil31 + 0.2, f: 'pop', v: 0.13});
  s.push({t: T.julho + 1.0, f: 'baque', v: 0.13});
  s.push({t: T.quinze + 0.5, f: 'ding', v: 0.15});
  s.push({t: T.entrada + 1.0, f: 'tique', v: 0.14});
  s.push({t: T.eBanco + 1.25, f: 'baque', v: 0.15});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.puxou + 0.8, T.mas + 1.0, T.como + 0.6, T.tamanho + 0.6, T.clientes + 1.2, T.bi610 + 1.4, T.tesouro + 1.2, T.problema + 0.4,
  T.setembro + 2.0, T.antes + 1.0, T.lucro + 2.0, T.detalhe + 0.6, T.dia90 + 1.0, T.mil31 + 0.8, T.grosso + 1.0, T.julho + 1.4,
  T.bi13 + 1.2, T.quinze + 1.0, T.porque + 0.4, T.explica + 1.4, T.vice + 1.0, T.outro + 0.6, T.entrada + 1.4, T.credito + 1.8,
  T.eBanco + 1.4, T.portas + 0.8, T.resumindo + 0.6, T.grupo + 0.8, T.imposto + 1.2, T.voce + 1.0, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Agro e BB',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa},
  Mundo,
};

export const AgroBb: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['O agro cresce', 'e a dívida', 'atrasa'];
export const CapaAgroBb: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="AGRO E BB" />
);
