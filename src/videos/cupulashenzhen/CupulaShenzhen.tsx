import React from 'react';
import {Boneco, Caixa, Placa, Predio, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {CalendarioGrande, Carrinho, Casinha, DocumentoGrande, OrgaoPublico, PilhaMoedas, PredioColunas, RelogioMesa} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {Arena, CadeiraMesa, CaixaDeForca, Interrogacao, MesaRedonda, MolduraFoto, Ogiva, PonteQuebrada, SetaSimples, XGrande} from './pecas';
import {PALAVRAS} from './palavras';

// 233. Lula e a cúpula de Shenzhen (perfil @eumagnoleite, série Magno Explica). Vídeo NACIONAL/internacional, NÃO vai para o site.
// Estúdio 3D + Kit Mapas (projetos/233.../mapas/mapa.mp4: mundo, Shenzhen, Brasil fora da APEC). Fontes: projetos/233.../audio/fontes.md.
// Líderes são bonecos sem rosto com etiqueta de nome; nada de bandeira nem logotipo. Lula: os dois lados com o mesmo peso.

const P = '233. lula e a cúpula de shenzhen';
const AUDIO_SEG = 150.8;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  mesa: quando('sentaram na mesma mesa'),
  vez: quando('pela primeira vez'),
  trump: quando('Donald Trump'),
  xi: quando('Xi Jinping'),
  putin: quando('Vladimir Putin'),
  gente: quando('E tem gente dizendo'),
  ideia: quando('a ideia foi do Lula'),
  vem: quando('Vem comigo'),
  mapa: quando('Primeiro, o mapa'),
  porque: quando('Por que esses três'),
  predio: quando('Pensa num prédio'),
  vizinhos: quando('só três vizinhos'),
  chave: quando('a chave da caixa'),
  caixa: quando('caixa de força'),
  eua: quando('Estados Unidos e Rússia têm'),
  mil: quando('mais de 5 mil'),
  china: quando('A China tem cerca'),
  seiscentos: quando('cerca de 600'),
  cadeira: quando('E os três têm cadeira'),
  veto: quando('poder de veto'),
  briga: quando('Cada um tem uma briga'),
  russia: quando('A Rússia está em guerra'),
  quatro: quando('há quatro anos'),
  ucrP: quando('com a Ucrânia'),
  euaIra: quando('Os Estados Unidos estão em guerra'),
  ira: quando('com o Irã'),
  israel: quando('junto com Israel'),
  comercio: quando('E Estados Unidos e China brigam'),
  taxas: quando('as taxas passaram'),
  produto: quando('um produto de 100 reais'),
  taxa: quando('mais de 100 reais de taxa'),
  tregua: quando('Hoje existe uma trégua'),
  janeiro: quando('10 de janeiro'),
  parteLula: quando('Agora, a parte do Lula'),
  agosto: quando('Em agosto'),
  onu: quando('devia aproveitar a ONU'),
  domingo: quando('No domingo'),
  carney: quando('Mark Carney'),
  seguinte: quando('No dia seguinte'),
  foiIdeia: quando('a reunião foi ideia'),
  outro: quando('Só que tem o outro lado'),
  setembro: quando('No começo de setembro'),
  wsj: quando('Segundo o jornal americano'),
  propos: quando('quem propôs a reunião'),
  kremlin: quando('E o Kremlin disse'),
  dona: quando('a dona da casa'),
  resposta: quando('Então, qual é a resposta'),
  lancou: quando('Lula lançou a ideia'),
  marcou: quando('Mas quem marcou'),
  montou: quando('montou a mesa'),
  vozes: quando('Lula foi uma das vozes'),
  organizador: quando('Não foi o organizador'),
  saiu: quando('E o que saiu da mesa'),
  hora: quando('uma hora e meia'),
  assinaram: quando('Os três assinaram'),
  nuclear: quando('guerra nuclear não tem'),
  conversando: quando('vão continuar conversando'),
  reformar: quando('querem reformar'),
  petroleo: quando('prometem produzir'),
  tribunais: quando('Também disseram que tribunais'),
  ucrania: quando('Sobre a Ucrânia, nada'),
  ponte: quando('Putin disse que não negocia'),
  crimeia: quando('ponte da Crimeia'),
  nota: quando('Mesmo assim, Trump'),
  doze: quando('nota 12'),
  escala: quando('escala de zero a 10'),
  brasil: quando('E o Brasil nisso'),
  dezembro: quando('Em dezembro'),
  paz: quando('Se a paz andar'),
  naoAndar: quando('Se não andar'),
  segue: quando('Segue o'),
  arroba: quando('@eumagnoleite'),
};

const ESTADOS: [number, string][] = [
  [0, 'O ENCONTRO'],
  [T.mapa, 'O MAPA'],
  [T.porque, 'POR QUE IMPORTAM'],
  [T.briga, 'AS BRIGAS ABERTAS'],
  [T.parteLula, 'O LADO DO LULA'],
  [T.outro, 'O OUTRO LADO'],
  [T.resposta, 'A RESPOSTA'],
  [T.saiu, 'O QUE SAIU DA MESA'],
  [T.ucrania, 'E A UCRÂNIA?'],
  [T.brasil, 'E O BRASIL?'],
];

// trecho de mapa (Kit Mapas): "Primeiro, o mapa" até "o Lula não estava lá" (mesmos 18,29 s a 32,65 s do roteiro do Kit)
const TR: [number, number][] = [[18.29, 32.65]];
const MAPAS = trechos(TR);
const noMapa = (t: number) => TR.some(([a, b]) => t >= a && t < b);

const org = (i: number): V3 => [14 * i, 0, 0];
const ABRE = org(0);
const PRED = org(2);
const ARSE = org(3);
const BRIG = org(4);
const LADA = org(5);
const LADB = org(6);
const RESP = org(7);
const SAIU = org(8);
const UCRA = org(9);
const BRAS = org(10);

const graus = (g: number) => (g * Math.PI) / 180;
const assento = (o: V3, g: number, R: number): V3 => [o[0] + R * Math.sin(graus(g)), 0, o[2] + R * Math.cos(graus(g))];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const dourado = festa.dourado;
  const cAzul = mistura(festa.azul, tema.objeto, 0.3);
  const cRosa = mistura(festa.rosa, tema.objeto, 0.3);
  const cVerde = mistura(festa.verde, tema.objeto, 0.2);
  const cClaro = tema.objetoClaro;
  const cOuro = mistura(dourado, tema.objeto, 0.4);

  const abK = vis(t, 0, T.porque - 0.3);
  const preK = vis(t, T.porque - 0.3, T.eua + 0.3);
  const arsK = vis(t, T.eua - 0.1, T.briga - 0.3);
  const briK = vis(t, T.briga - 0.3, T.parteLula - 0.3);
  const lAK = vis(t, T.parteLula - 0.3, T.outro - 0.3);
  const lBK = vis(t, T.outro - 0.3, T.resposta - 0.3);
  const resK = vis(t, T.resposta - 0.3, T.saiu - 0.3);
  const saiK = vis(t, T.saiu - 0.3, T.ucrania - 0.3);
  const ucrK = vis(t, T.ucrania - 0.3, T.brasil - 0.3);
  const braK = vis(t, T.brasil - 0.3, 1e9);

  return (
    <group>
      {/* 1. Abertura: a mesa redonda, três líderes e a cadeira vazia */}
      {abK > 0.02 ? (
        <group>
          <MesaRedonda tema={tema} pos={soma(ABRE, [0, 0, 0])} r={1.15} k={abK * entra(t, 0.2, 0.6)} />
          {([[T.trump, 235, cAzul], [T.xi, 180, cRosa], [T.putin, 125, cClaro]] as [number, number, string][]).map(([ti, g, cor], i) => (
            <group key={i}>
              <CadeiraMesa tema={tema} pos={assento(ABRE, g, 2.3)} rotY={graus(g) + Math.PI} k={abK * entra(t, ti - 0.2, 0.5)} />
              <Boneco tema={tema} pos={assento(ABRE, g, 1.7)} rotY={graus(g) + Math.PI} escala={1.0 * abK * entra(t, ti - 0.2, 0.5)} cor={cor} pose={{ombroD: [-0.3, 0, 0.9 * pulso(t, ti + 0.2, 1.4)]}} />
            </group>
          ))}
          <CadeiraMesa tema={tema} pos={assento(ABRE, -38, 2.2)} rotY={graus(-38) + Math.PI} k={abK * entra(t, T.gente, 0.5)} cor={mistura(tema.objetoEscuro, cVerde, 0.45)} brilho={pulso(t, T.ideia, 1.2)} />
          <Interrogacao tema={tema} pos={soma(assento(ABRE, -38, 2.2), [0, 1.9, 0])} k={abK * entra(t, T.ideia - 0.2, 0.5)} />
        </group>
      ) : null}

      {/* 3a. O prédio e a caixa de força (fica até as ogivas) */}
      {preK > 0.02 ? (
        <group>
          <Predio tema={tema} pos={soma(PRED, [-1.5, 0, -1.4])} alt={4.2} larg={2.2} prof={2.0} andares={7} aceso={0.4 + 0.5 * pulso(t, T.predio, 2.0)} />
          <CaixaDeForca tema={tema} pos={soma(PRED, [1.3, 0, -0.4])} k={1.5 * preK * entra(t, T.caixa - 0.3, 0.5)} chaves={[entra(t, T.vizinhos + 0.4, 0.5), entra(t, T.vizinhos + 0.8, 0.5), entra(t, T.vizinhos + 1.2, 0.5)]} />
          {[[0.2, cAzul, T.vizinhos], [1.2, cRosa, T.vizinhos + 0.4], [2.2, cClaro, T.vizinhos + 0.8]].map(([x, cor, ti], i) => (
            <Boneco key={i} tema={tema} pos={soma(PRED, [x as number, 0, 1.3])} rotY={0} escala={0.8 * preK * entra(t, ti as number, 0.5)} cor={cor as string} pose={{ombroD: [-0.8, 0, 0.1], cotoveloD: -0.5}} />
          ))}
        </group>
      ) : null}

      {/* 3b. As ogivas em três fileiras (desenho em proporção aproximada: 8 / 8 / 1) e as três cadeiras do Conselho */}
      {arsK > 0.02 ? (
        <group>
          {[[2.0, T.eua + 0.15, 8], [-0.2, T.eua + 1.2, 8], [-2.4, T.china, 1]].map(([z, ti, n], i) => (
            <group key={i} position={soma(ARSE, [0, 0, z as number])}>
              {Array.from({length: n as number}).map((_, j) => (
                <Ogiva key={j} tema={tema} pos={[n === 1 ? 0 : (j - 3.5) * 0.5, 0, 0]} k={arsK * entra(t, (ti as number) + 0.07 * j, 0.4)} escala={n === 1 ? 0.9 : 0.72} />
              ))}
            </group>
          ))}
          {[-2.0, 0, 2.0].map((x, i) => (
            <CadeiraMesa key={i} tema={tema} pos={soma(ARSE, [x, 0, -4.0])} rotY={0} k={arsK * entra(t, T.cadeira + 0.3 * i, 0.5)} brilho={pulso(t, T.veto + 0.1 * i, 1.2)} />
          ))}
        </group>
      ) : null}

      {/* 4. As três brigas, num quadro só (os focos anteriores ficam visíveis) */}
      {briK > 0.02 ? (
        <group>
          <Arena tema={tema} pos={soma(BRIG, [0, 0, -3.4])} r={1.7} k={briK * entra(t, T.briga + 0.1, 0.6)} />
          <Arena tema={tema} pos={soma(BRIG, [0, 0, -0.1])} r={1.7} k={briK * entra(t, T.briga + 0.6, 0.6)} />
          <Arena tema={tema} pos={soma(BRIG, [0, 0, 3.2])} r={1.7} k={briK * entra(t, T.briga + 1.1, 0.6)} />
          {/* Rússia x Ucrânia */}
          <Boneco tema={tema} pos={soma(BRIG, [-1.2, 0, -3.4])} rotY={Math.PI / 2} escala={0.9 * briK * entra(t, T.russia, 0.5)} cor={cClaro} pose={{ombroD: [-0.7, 0, 0.2]}} />
          <Boneco tema={tema} pos={soma(BRIG, [1.2, 0, -3.4])} rotY={-Math.PI / 2} escala={0.9 * briK * entra(t, T.ucrP, 0.5)} cor={cOuro} pose={{ombroE: [-0.7, 0, -0.2]}} />
          {/* EUA + Israel x Irã */}
          <Boneco tema={tema} pos={soma(BRIG, [-1.9, 0, -0.1])} rotY={Math.PI / 2} escala={0.9 * briK * entra(t, T.euaIra, 0.5)} cor={cAzul} pose={{ombroD: [-0.7, 0, 0.2]}} />
          <Boneco tema={tema} pos={soma(BRIG, [-0.9, 0, -0.1])} rotY={Math.PI / 2} escala={0.9 * briK * entra(t, T.israel, 0.5)} cor={mistura(cAzul, cClaro, 0.55)} pose={{ombroD: [-0.7, 0, 0.2]}} />
          <Boneco tema={tema} pos={soma(BRIG, [1.5, 0, -0.1])} rotY={-Math.PI / 2} escala={0.9 * briK * entra(t, T.ira, 0.5)} cor={cVerde} pose={{ombroE: [-0.7, 0, -0.2]}} />
          {/* EUA x China, com a caixa do produto e a pilha da taxa no meio */}
          <Boneco tema={tema} pos={soma(BRIG, [-1.9, 0, 3.2])} rotY={Math.PI / 2} escala={0.9 * briK * entra(t, T.comercio, 0.5)} cor={cAzul} pose={{ombroD: [-0.7, 0, 0.2]}} />
          <Boneco tema={tema} pos={soma(BRIG, [1.9, 0, 3.2])} rotY={-Math.PI / 2} escala={0.9 * briK * entra(t, T.comercio + 0.7, 0.5)} cor={cRosa} pose={{ombroE: [-0.7, 0, -0.2]}} />
          <group position={soma(BRIG, [-0.6, 0, 3.2])} scale={briK * entra(t, T.produto, 0.5)}>
            <Caixa args={[0.8, 0.8, 0.8]} raio={0.06} cor={mistura(tema.objeto, tema.objetoClaro, 0.35)} position={[0, 0.4, 0]} />
            <Placa tema={tema} pos={[0, 0.4, 0.41]} larg={0.7} alt={0.45} linhas={[{t: 'R$ 100', tam: 260, cor: tema.objetoEscuro, peso: 900}]} brilho={0.05} />
          </group>
          <PilhaMoedas tema={tema} pos={soma(BRIG, [0.7, 0.02, 3.2])} n={Math.max(1, Math.round(16 * rampa(t, T.taxa, T.taxa + 1.6)))} cor={dourado} r={0.42} escala={briK * entra(t, T.taxa - 0.1, 0.4)} brilho={pulso(t, T.taxa + 1.0, 1.2)} />
          <CalendarioGrande tema={tema} pos={soma(BRIG, [0, 0, 6.6])} texto="10/01" sub="FIM DA TRÉGUA" folha={briK} escala={0.9 * briK * entra(t, T.tregua, 0.5)} destaque={pulso(t, T.janeiro, 1.0)} />
        </group>
      ) : null}

      {/* 5. Lado A: o que o Lula disse (boneco à esquerda, objeto à direita) */}
      {lAK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(LADA, [-1.5, 0, 0])} rotY={0.5} escala={1.15 * lAK} cor={cVerde} pose={{ombroD: [-0.3, 0, 0.9 * pulso(t, T.agosto + 0.4, 1.6)], ombroE: [-0.3, 0, -0.9 * pulso(t, T.seguinte + 0.6, 1.6)]}} />
          <PredioColunas tema={tema} pos={soma(LADA, [1.7, 0, -1.8])} aceso={pulso(t, T.onu, 1.4) * 0.9 + 0.2} escala={0.7 * lAK * entra(t, T.agosto + 0.3, 0.5) * (1 - rampa(t, T.domingo - 0.3, T.domingo + 0.2))} />
          <CalendarioGrande tema={tema} pos={soma(LADA, [0.2, 0, -1.7])} texto="15/11" sub="FILIPINAS" folha={lAK} escala={0.85 * lAK * entra(t, T.domingo, 0.5)} destaque={pulso(t, T.domingo + 0.4, 1.0)} />
          <Boneco tema={tema} pos={soma(LADA, [1.7, 0, 0.2])} rotY={-0.6} escala={1.15 * lAK * entra(t, T.carney, 0.5)} cor={mistura(festa.rosa, cClaro, 0.45)} pose={{ombroD: [-1.2, 0, 0.5 * pulso(t, T.seguinte + 0.8, 1.8)]}} />
        </group>
      ) : null}

      {/* 6. Lado B: a mesma composição, com Putin, o jornal e a China */}
      {lBK > 0.02 ? (
        <group>
          <Boneco tema={tema} pos={soma(LADB, [-1.5, 0, 0])} rotY={0.5} escala={1.15 * lBK} cor={cClaro} pose={{ombroD: [-0.3, 0, 0.9 * pulso(t, T.setembro + 0.4, 1.6)], ombroE: [-0.3, 0, -0.9 * pulso(t, T.propos + 0.4, 1.6)]}} />
          <CalendarioGrande tema={tema} pos={soma(LADB, [0.2, 0, -1.7])} texto="SET" sub="RÚSSIA JÁ FALAVA" folha={lBK} escala={0.85 * lBK * entra(t, T.setembro, 0.5) * (1 - rampa(t, T.wsj - 0.3, T.wsj + 0.2))} destaque={pulso(t, T.setembro + 0.6, 1.0)} />
          <DocumentoGrande tema={tema} pos={soma(LADB, [1.5, 0.05, -0.8])} rot={[-1.2, 0.2, 0]} escala={1.5 * lBK * entra(t, T.wsj, 0.5) * (1 - rampa(t, T.kremlin - 0.3, T.kremlin + 0.2))} carimbo={entra(t, T.propos, 0.5)} />
          <Casinha tema={tema} pos={soma(LADB, [1.9, 0, -1.5])} cor={cRosa} escala={2.0 * lBK * entra(t, T.kremlin, 0.5)} />
          <Boneco tema={tema} pos={soma(LADB, [0.5, 0, 0.6])} rotY={-0.5} escala={1.15 * lBK * entra(t, T.kremlin + 0.3, 0.5)} cor={cRosa} pose={{ombroD: [-1.2, 0, 0.5 * pulso(t, T.dona, 1.4)]}} />
        </group>
      ) : null}

      {/* 7. A resposta: o carrinho da ideia (frente) e Rússia e China com a data e a mesa (fundo) */}
      {resK > 0.02 ? (
        <group>
          <Carrinho tema={tema} pos={soma(RESP, [-0.4 + 0.9 * rampa(t, T.vozes, T.vozes + 1.8), 0, 1.6])} rotY={Math.PI / 2} escala={1.8 * resK * entra(t, T.lancou, 0.5)} />
          <Boneco tema={tema} pos={soma(RESP, [-2.0 + 0.9 * rampa(t, T.vozes, T.vozes + 1.8), 0, 1.6])} rotY={Math.PI / 2} escala={1.05 * resK} cor={cVerde} pose={{ombroD: [-1.15, 0, 0.1], ombroE: [-1.15, 0, -0.1], cotoveloD: -0.2, cotoveloE: -0.2, passo: 0.6 * Math.sin(t * 5) * rampa(t, T.vozes, T.vozes + 0.4) * (1 - rampa(t, T.vozes + 1.8, T.vozes + 2.2))}} />
          <CalendarioGrande tema={tema} pos={soma(RESP, [0, 0, -3.1])} texto="DATA" sub="MARCADA" folha={resK} escala={0.8 * resK * entra(t, T.marcou, 0.5)} destaque={pulso(t, T.marcou + 0.6, 1.0)} />
          <MesaRedonda tema={tema} pos={soma(RESP, [0, 0, -1.2])} r={0.75} k={resK * entra(t, T.montou, 0.5)} />
          <Boneco tema={tema} pos={soma(RESP, [-1.7, 0, -1.2])} rotY={0.9} escala={0.95 * resK * entra(t, T.marcou, 0.5)} cor={cClaro} />
          <Boneco tema={tema} pos={soma(RESP, [1.7, 0, -1.2])} rotY={-0.9} escala={0.95 * resK * entra(t, T.marcou + 0.4, 0.5)} cor={cRosa} />
        </group>
      ) : null}

      {/* 8. O que saiu da mesa: a folha da declaração com os 5 itens, todos do mesmo tamanho */}
      {saiK > 0.02 ? (
        <group position={SAIU}>
          <group scale={saiK * entra(t, T.saiu + 0.2, 0.5)}>
            <Caixa args={[4.9, 5.0, 0.12]} raio={0.06} cor={tema.objetoClaro} position={[0.3, 2.7, 0]} />
            <Placa tema={tema} pos={[0.3, 4.85, 0.08]} larg={4.4} alt={0.6} linhas={[{t: 'DECLARAÇÃO DOS 3', tam: 130, cor: tema.objetoEscuro, peso: 900}]} />
          </group>
          {(['GUERRA NUCLEAR: SEM VENCEDOR', 'CONVERSAR SOBRE RISCO', 'REFORMAR A ONU', '+ PETRÓLEO E GÁS', 'TRIBUNAIS: NÃO ABUSAR'] as string[]).map((txt, i) => {
            const ti = [T.nuclear, T.conversando, T.reformar, T.petroleo, T.tribunais][i];
            return (
              <group key={i} position={[0.3, 4.1 - 0.82 * i, 0.1]} scale={saiK * entra(t, ti, 0.45)}>
                <Caixa args={[0.12, 0.12, 0.03]} raio={0.02} cor={tema.acento} emissivo={0.4} position={[-2.05, 0, 0]} sombra={false} />
                <Placa tema={tema} pos={[0.15, 0, 0.02]} larg={4.2} alt={0.7} linhas={[{t: txt, tam: 56, cor: tema.objetoEscuro, peso: 800}]} />
              </group>
            );
          })}
          <RelogioMesa tema={tema} pos={[0, 0, 2.6]} escala={3.0 * saiK * entra(t, T.hora, 0.5)} ang={rampa(t, T.hora, T.assinaram) * 3.0} />
        </group>
      ) : null}

      {/* 9. Ucrânia: nada. A ponte e a nota 12 de 10 (empilhadas, as anteriores seguem à vista) */}
      {ucrK > 0.02 ? (
        <group>
          <group position={soma(UCRA, [0, 0, -2.2])} scale={ucrK * entra(t, T.ucrania, 0.5)}>
            <Caixa args={[3.6, 1.3, 0.14]} raio={0.06} cor={tema.objetoClaro} position={[0, 0.8, 0]} />
            <Placa tema={tema} pos={[0, 0.8, 0.09]} larg={3.3} alt={0.9} linhas={[{t: 'UCRÂNIA', tam: 220, cor: tema.objetoEscuro, peso: 900}]} />
          </group>
          <XGrande tema={tema} pos={soma(UCRA, [2.5, 0.8, -2.2])} k={ucrK * entra(t, T.ucrania + 0.9, 0.5)} escala={1.1} />
          <PonteQuebrada tema={tema} pos={soma(UCRA, [0, 0, 0.2])} k={0.95 * ucrK * entra(t, T.ponte, 0.5)} quebra={rampa(t, T.crimeia, T.crimeia + 1.0)} />
          <group position={soma(UCRA, [0, 0, 2.6])} scale={ucrK * entra(t, T.nota, 0.5)}>
            <Caixa args={[0.9, 1.7, 0.6]} raio={0.04} cor={mistura(tema.objeto, tema.objetoClaro, 0.3)} position={[-0.7, 0.85, 0]} />
            <Caixa args={[0.9, Math.max(0.05, 2.04 * rampa(t, T.doze, T.doze + 1.2)), 0.6]} raio={0.04} cor={tema.acento} emissivo={0.3} position={[0.7, Math.max(0.05, 2.04 * rampa(t, T.doze, T.doze + 1.2)) / 2, 0]} />
            <Caixa args={[2.6, 0.05, 0.06]} raio={0.02} cor={tema.objetoClaro} position={[0, 1.7, 0.33]} sombra={false} />
            <Placa tema={tema} pos={[-0.7, 0.4, 0.31]} larg={0.8} alt={0.5} linhas={[{t: '10', tam: 320, cor: tema.objetoEscuro}]} />
            <Placa tema={tema} pos={[0.7, 0.4, 0.31]} larg={0.8} alt={0.5} linhas={[{t: '12', tam: 320, cor: tema.objetoEscuro}]} />
          </group>
          <Boneco tema={tema} pos={soma(UCRA, [2.3, 0, 2.6])} rotY={-0.5} escala={0.85 * ucrK * entra(t, T.nota, 0.5)} cor={cAzul} />
        </group>
      ) : null}

      {/* 10. O Brasil e o G20: dois caminhos */}
      {braK > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(BRAS, [0, 0, 4.2])} texto="DEZ" sub="G20 · MIAMI" folha={braK} escala={1.0 * braK * entra(t, T.dezembro, 0.5) * (1 - rampa(t, T.segue - 0.2, T.segue + 0.3))} destaque={pulso(t, T.dezembro + 0.6, 1.0)} />
          <Boneco tema={tema} pos={soma(BRAS, [0, 0, 0.6])} rotY={0} escala={1.1 * braK * entra(t, T.dezembro + 1.2, 0.5)} cor={cVerde} pose={{ombroD: [-0.3, 0, 0.5 * pulso(t, T.paz + 0.5, 1.5)]}} />
          <SetaSimples tema={tema} pos={soma(BRAS, [-1.2, 1.0, 0.6])} dir={-1} k={1.2 * braK * entra(t, T.paz, 0.5)} />
          <PilhaMoedas tema={tema} pos={soma(BRAS, [-2.4, 0.02, 0.6])} n={Math.max(1, Math.round(12 * rampa(t, T.paz + 0.6, T.paz + 2.0)))} cor={dourado} r={0.5} escala={braK * entra(t, T.paz + 0.4, 0.5)} brilho={pulso(t, T.paz + 1.8, 1.2)} />
          <SetaSimples tema={tema} pos={soma(BRAS, [1.2, 1.0, 0.6])} dir={1} k={1.2 * braK * entra(t, T.naoAndar, 0.5)} />
          <MolduraFoto tema={tema} pos={soma(BRAS, [2.4, 0, 0.6])} k={1.3 * braK * entra(t, T.naoAndar + 0.5, 0.5)} />
        </group>
      ) : null}
    </group>
  );
};

// câmera por paradas: fica parada em cada alvo e só voa nos 0,9 s antes da próxima parada (nunca "escorrega" no meio da cena)
type Parada = [number, V3, number, number, V3];
const rota = (ini: number, paradas: Parada[]): Cena => {
  const chaves: [number, ReturnType<typeof E>][] = [];
  paradas.forEach(([t, alvo, l, a, d], k) => {
    const c = E(alvo, l, a, d);
    chaves.push([t, c]);
    const prox = paradas[k + 1];
    chaves.push([prox ? prox[0] - 0.9 : t + 40, k === paradas.length - 1 ? E(alvo, l * 0.96, a * 0.96, d) : c]);
  });
  return {ini, chaves};
};
const CENAS: Cena[] = [
  rota(0, [[0, soma(ABRE, [0, 1.0, 0.2]), 5.8, 5.4, [0, 0.75, 1]]]),
  rota(T.porque - 0.3, [[T.porque - 0.3, soma(PRED, [0.2, 1.8, -0.2]), 7.4, 8.4, [0.03, 0.4, 1]]]),
  rota(T.eua + 0.15, [[T.eua + 0.15, soma(ARSE, [0, 0.6, -1.0]), 5.8, 9.4, [0, 0.9, 1]]]),
  rota(T.briga - 0.3, [[T.briga - 0.3, soma(BRIG, [0, 0.5, -2.6]), 6.0, 6.8, [0, 0.8, 1]], [T.euaIra - 0.2, soma(BRIG, [0, 0.5, -0.3]), 6.0, 6.8, [0, 0.8, 1]], [T.comercio - 0.2, soma(BRIG, [0, 0.5, 2.6]), 6.0, 6.8, [0, 0.8, 1]], [T.tregua - 0.2, soma(BRIG, [0, 0.5, 4.0]), 6.0, 6.8, [0, 0.8, 1]]]),
  rota(T.parteLula - 0.3, [[T.parteLula - 0.3, soma(LADA, [0.1, 1.3, -0.4]), 6.2, 7.6, [0.03, 0.36, 1]]]),
  rota(T.outro - 0.3, [[T.outro - 0.3, soma(LADB, [0.1, 1.3, -0.4]), 6.2, 7.6, [0.03, 0.36, 1]]]),
  rota(T.resposta - 0.3, [[T.resposta - 0.3, soma(RESP, [0, 1.0, -0.4]), 6.4, 8.2, [0, 0.62, 1]]]),
  rota(T.saiu - 0.3, [[T.saiu - 0.3, soma(SAIU, [0.1, 2.7, 0]), 7.0, 7.6, [0, 0.15, 1]]]),
  rota(T.ucrania - 0.3, [[T.ucrania - 0.3, soma(UCRA, [0, 0.6, 0.2]), 7.0, 8.4, [0, 0.8, 1]]]),
  rota(T.brasil - 0.3, [[T.brasil - 0.3, soma(BRAS, [0, 1.2, 2.0]), 7.0, 8.6, [0, 0.5, 1]]]),
];

const CHIPS: Txt[] = [
  {a: T.mesa, b: T.trump, texto: 'ENCONTRO EM SHENZHEN · APEC', destaque: false},
  {a: T.ideia, b: T.mapa - 0.2, texto: 'FOI IDEIA DO LULA?', destaque: true},
  {a: T.predio, b: T.eua, texto: 'SÓ 3 VIZINHOS TÊM A CHAVE'},
  {a: T.eua, b: T.cadeira, texto: 'ARSENAL NUCLEAR (DESENHO APROXIMADO)'},
  {a: T.cadeira, b: T.briga, texto: '3 CADEIRAS FIXAS NA ONU, COM VETO', destaque: true},
  {a: T.briga, b: T.euaIra, texto: 'CADA UM TEM UMA BRIGA ABERTA'},
  {a: T.taxas, b: T.produto, texto: 'TAXAS DE MAIS DE 100% EM 2025', destaque: false},
  {a: T.tregua, b: T.parteLula, texto: 'TRÉGUA ATÉ 10/01/2027', destaque: true},
  {a: T.parteLula, b: T.domingo, texto: 'O QUE O LULA DISSE EM AGOSTO'},
  {a: T.domingo, b: T.seguinte, texto: '15/11: LULA CONTA AO PRIMEIRO-MINISTRO'},
  {a: T.outro, b: T.wsj, texto: 'O OUTRO LADO: RÚSSIA E CHINA'},
  {a: T.propos, b: T.kremlin, texto: 'SEGUNDO O WALL STREET JOURNAL'},
  {a: T.kremlin, b: T.resposta, texto: 'SEGUNDO O KREMLIN: A CHINA ORGANIZOU', destaque: true},
  {a: T.lancou, b: T.marcou, texto: 'LULA LANÇOU A IDEIA EM PÚBLICO'},
  {a: T.marcou, b: T.vozes, texto: 'RÚSSIA E CHINA MARCARAM A DATA E MONTARAM A MESA'},
  {a: T.organizador, b: T.saiu, texto: 'EMPURROU, NÃO ORGANIZOU', destaque: true},
  {a: T.assinaram, b: T.nuclear, texto: 'DECLARAÇÃO ASSINADA PELOS 3'},
  {a: T.ucrania, b: T.ponte, texto: 'UCRÂNIA: SEM ACORDO', destaque: true},
  {a: T.ponte, b: T.nota, texto: 'PUTIN: NÃO NEGOCIA APÓS O ATAQUE À PONTE'},
  {a: T.nota, b: T.brasil, texto: 'TRUMP: NOTA 12 NUMA ESCALA DE 0 A 10', destaque: true},
  {a: T.dezembro, b: T.paz, texto: 'G20 EM MIAMI · TRUMP É O ANFITRIÃO'},
  {a: T.paz, b: T.naoAndar, texto: 'SE A PAZ ANDAR: CRÉDITO PARA O LULA', destaque: true},
  {a: T.naoAndar, b: T.segue, texto: 'SE NÃO ANDAR: SÓ A FOTO', destaque: true},
];
const SELOS: Txt[] = [
  {a: T.mesa, b: T.mapa, texto: 'FONTE: CBS NEWS E CNBC · 16 E 19/11/2026'},
  {a: T.eua, b: T.briga, texto: 'FONTE: CBS NEWS · 19/11/2026 · OGIVAS: EUA E RÚSSIA, MAIS DE 5 MIL; CHINA, ~600'},
  {a: T.parteLula, b: T.outro, texto: 'FONTE: DGABC E BRASIL 247 · 17/11/2026'},
  {a: T.outro, b: T.resposta, texto: 'FONTE: REUTERS 01/09 · CNBC 16/11 · MOSCOW TIMES 03/11'},
  {a: T.saiu, b: T.ucrania, texto: 'FONTE: CBS NEWS E KREMLIN · 19/11/2026'},
];
const ROTULOS: Rot[] = [
  {a: T.mesa + 0.6, b: T.gente - 0.1, p: soma(ABRE, [0, 0.9, 0.3]), texto: '19/11/2026 · 1ª VEZ OS 3 JUNTOS', acento: true},
  {a: T.trump + 0.2, b: T.mapa - 0.2, p: soma(assento(ABRE, 235, 1.7), [-0.5, 2.4, 0]), texto: 'TRUMP · EUA'},
  {a: T.xi + 0.2, b: T.mapa - 0.2, p: soma(assento(ABRE, 180, 1.7), [0, 2.2, 0]), texto: 'XI · CHINA'},
  {a: T.putin + 0.2, b: T.mapa - 0.2, p: soma(assento(ABRE, 125, 1.7), [0.5, 2.3, 0]), texto: 'PUTIN · RÚSSIA'},
  {a: T.ideia, b: T.mapa - 0.2, p: soma(assento(ABRE, -38, 2.2), [0, 3.0, 0]), texto: 'LULA?', acento: true},
  {a: T.vizinhos + 1.0, b: T.eua + 0.3, p: soma(PRED, [1.3, 2.4, -0.4]), texto: 'CAIXA DE FORÇA', acento: true},
  {a: T.eua + 0.3, b: T.briga - 0.3, p: soma(ARSE, [0, 0.1, 3.0]), texto: 'EUA: + DE 5 MIL'},
  {a: T.eua + 1.4, b: T.briga - 0.3, p: soma(ARSE, [0, 0.1, 0.8]), texto: 'RÚSSIA: + DE 5 MIL'},
  {a: T.china + 0.3, b: T.briga - 0.3, p: soma(ARSE, [0, 0.1, -1.6]), texto: 'CHINA: ~600', acento: true},
  {a: T.veto, b: T.briga - 0.3, p: soma(ARSE, [0, 2.2, -4.0]), texto: 'VETO NA ONU', acento: true},
  {a: T.ucrP, b: T.euaIra - 0.1, p: soma(BRIG, [0, 2.3, -3.4]), texto: 'RÚSSIA x UCRÂNIA · 4 ANOS'},
  {a: T.ira, b: T.comercio - 0.1, p: soma(BRIG, [1.5, 2.0, -0.1]), texto: 'IRÃ'},
  {a: T.euaIra + 0.4, b: T.comercio - 0.1, p: soma(BRIG, [-0.4, 2.5, -0.1]), texto: 'EUA + ISRAEL x IRÃ'},
  {a: T.produto + 0.6, b: T.tregua - 0.2, p: soma(BRIG, [-0.9, 1.3, 3.2]), texto: 'PRODUTO DE R$ 100'},
  {a: T.taxa, b: T.tregua - 0.2, p: soma(BRIG, [0.9, 2.3, 3.2]), texto: '+ DE R$ 100 DE TAXA', acento: true},
  {a: T.comercio + 0.8, b: T.produto - 0.1, p: soma(BRIG, [0, 3.0, 3.2]), texto: 'EUA x CHINA'},
  {a: T.janeiro - 0.4, b: T.parteLula - 0.3, p: soma(BRIG, [0, 1.8, 6.6]), texto: 'TRÉGUA ATÉ 10/01'},
  {a: T.parteLula + 0.5, b: T.outro - 0.3, p: soma(LADA, [-1.5, 0.0, 1.5]), texto: 'LULA · BRASIL'},
  {a: T.agosto + 0.4, b: T.domingo - 0.2, p: soma(LADA, [0.2, 3.6, 0]), texto: 'AGOSTO: CHAMA XI E PUTIN NA ONU', acento: true},
  {a: T.carney + 0.2, b: T.outro - 0.3, p: soma(LADA, [1.7, 0.0, 1.5]), texto: 'CANADÁ'},
  {a: T.domingo + 0.4, b: T.seguinte - 0.2, p: soma(LADA, [0.2, 3.6, 0]), texto: '15/11 FILIPINAS: CONTA AO CANADÁ', acento: true},
  {a: T.seguinte + 0.2, b: T.outro - 0.3, p: soma(LADA, [0.2, 3.6, 0]), texto: '16/11: CANADÁ DIZ "IDEIA DO LULA"', acento: true},
  {a: T.outro + 0.5, b: T.resposta - 0.3, p: soma(LADB, [-1.5, 0.0, 1.5]), texto: 'PUTIN · RÚSSIA'},
  {a: T.setembro + 0.4, b: T.wsj - 0.2, p: soma(LADB, [0.2, 3.6, 0]), texto: 'SETEMBRO: RÚSSIA JÁ FALAVA DA APEC', acento: true},
  {a: T.propos - 0.4, b: T.kremlin - 0.2, p: soma(LADB, [0.2, 3.6, 0]), texto: 'WSJ: PUTIN PROPÔS', acento: true},
  {a: T.kremlin + 0.4, b: T.resposta - 0.3, p: soma(LADB, [0.2, 3.6, 0]), texto: 'CHINA ORGANIZOU · A DONA DA CASA', acento: true},
  {a: T.kremlin + 0.8, b: T.resposta - 0.3, p: soma(LADB, [0.5, 0.0, 2.0]), texto: 'XI · CHINA'},
  {a: T.resposta + 0.6, b: T.marcou - 0.2, p: soma(RESP, [-2.0, 2.6, 1.6]), texto: 'LULA · LANÇOU A IDEIA', acento: true},
  {a: T.marcou + 0.3, b: T.vozes - 0.2, p: soma(RESP, [0, 2.4, -3.1]), texto: 'MARCARAM A DATA'},
  {a: T.montou, b: T.vozes - 0.2, p: soma(RESP, [0, 1.7, -1.2]), texto: 'MONTARAM A MESA'},
  {a: T.vozes + 0.2, b: T.saiu - 0.3, p: soma(RESP, [0, 0.0, 3.2]), texto: 'LULA EMPURRA O CARRINHO'},
  {a: T.hora + 0.2, b: T.ucrania - 0.3, p: soma(SAIU, [0, 1.4, 2.6]), texto: '1H30 DE CONVERSA', acento: true},
  {a: T.ucrania + 1.0, b: T.ponte - 0.2, p: soma(UCRA, [0, 2.4, -2.2]), texto: 'SEM ACORDO', acento: true},
  {a: T.crimeia, b: T.nota - 0.2, p: soma(UCRA, [0, 1.6, 0.2]), texto: 'PONTE DA CRIMEIA'},
  {a: T.doze, b: T.brasil - 0.3, p: soma(UCRA, [0, 3.0, 2.6]), texto: 'NOTA 12 DE 10', acento: true},
  {a: T.dezembro + 0.6, b: T.segue - 0.2, p: soma(BRAS, [0, 0.0, 5.6]), texto: '14 E 15 DE DEZEMBRO'},
  {a: T.paz + 0.6, b: T.segue - 0.2, p: soma(BRAS, [-2.4, 1.8, 0.6]), texto: 'PAZ ANDA: CRÉDITO', acento: true},
  {a: T.naoAndar + 0.6, b: T.segue - 0.2, p: soma(BRAS, [2.4, 2.6, 0.6]), texto: 'NÃO ANDA: SÓ A FOTO', acento: true},
  {a: T.dezembro + 1.4, b: T.segue - 0.2, p: soma(BRAS, [0, 2.5, 0.6]), texto: 'LULA · BRASIL'},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.mapa, T.porque, T.briga, T.parteLula, T.outro, T.resposta, T.saiu, T.ucrania, T.brasil].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  [T.trump, T.xi, T.putin].forEach((t) => s.push({t: t + 0.05, f: 'pop', v: 0.12}));
  s.push({t: T.ideia, f: 'bip', v: 0.14});
  [T.vizinhos + 0.4, T.vizinhos + 0.8, T.vizinhos + 1.2].forEach((t) => s.push({t, f: 'tique', v: 0.12}));
  s.push({t: T.veto, f: 'baque', v: 0.14});
  s.push({t: T.taxa, f: 'ding', v: 0.14});
  s.push({t: T.janeiro, f: 'tique', v: 0.14});
  [T.nuclear, T.conversando, T.reformar, T.petroleo, T.tribunais].forEach((t) => s.push({t, f: 'pop', v: 0.12}));
  s.push({t: T.ucrania + 0.9, f: 'baque', v: 0.14});
  s.push({t: T.crimeia + 0.3, f: 'baque', v: 0.14});
  s.push({t: T.doze, f: 'ding', v: 0.14});
  s.push({t: T.organizador, f: 'baque', v: 0.14});
  s.push({t: T.segue, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.trump + 1.0, T.xi + 1.0, T.putin + 1.0, T.ideia + 1.0, T.mapa + 3.0, T.mapa + 6.5, T.mapa + 9.5, T.mapa + 12.5,
  T.predio + 1.0, T.chave + 1.4, T.eua + 1.6, T.china + 1.2, T.cadeira + 1.4, T.briga + 1.4, T.euaIra + 1.6, T.comercio + 1.0, T.taxa + 1.4, T.tregua + 1.4,
  T.agosto + 1.6, T.domingo + 1.6, T.seguinte + 1.4, T.setembro + 1.4, T.propos + 1.0, T.kremlin + 1.6, T.dona + 0.6,
  T.lancou + 1.0, T.marcou + 1.8, T.vozes + 1.6, T.organizador + 0.8, T.hora + 1.0, T.nuclear + 1.4, T.petroleo + 1.4, T.tribunais + 2.0,
  T.ucrania + 1.6, T.crimeia + 1.0, T.doze + 1.2, T.dezembro + 1.4, T.paz + 1.8, T.naoAndar + 1.6, T.segue + 0.8, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Cúpula de Shenzhen',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: MAPAS,
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.segue, arroba: T.arroba, noMapa, fecho: 'FATO, FONTE E OS DOIS LADOS', rotuloEscala: 1.6},
  Mundo,
  arrobaFixo: true,
};

export const CupulaShenzhen: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Foi ideia', 'do Lula?'];
export const CapaCupulaShenzhen: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="CÚPULA DE SHENZHEN" acentoDe={1} />
);
