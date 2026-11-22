import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Arvore, ArvoreRedonda, CalendarioGrande, Casinha, Chamine, Corrente, Estrela, Igreja, LivroLei, Lupa, Mar, MarcoAno, Morro, Navio, PilhaPapeis, Sobrado} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, vis, type Cena, type Config, type PropsVideo, trechos, type Rot, type Txt} from '../comum/Explicativo';
import {PALAVRAS} from './palavras';

// 236. zumbi dos palmares (20/11/2026, feriado). Vídeo NACIONAL didático, NÃO vai para o site. Molde 232 sobre comum/Explicativo.tsx.
// Pessoas reais só como boneco genérico com etiqueta. Morte e guerra sem violência na tela (cerco de bonecos, calendário).
// Fontes: projetos/236. zumbi dos palmares/audio/fontes.md.

const P = '236. zumbi dos palmares';
const AUDIO_SEG = 166.92;
const FIM = AUDIO_SEG + 0.9;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  hoje: quando('Hoje, 20 de novembro'),
  feriado: quando('é feriado no Brasil'),
  porque: quando('Mas por que justo'),
  zumbi: quando('Zumbi dos Palmares. Vem'),
  vem: quando('Vem comigo, que'),
  colonia: quando('Primeiro, uma palavra'),
  portugal: quando('Quem mandava era Portugal'),
  cana: quando('E para plantar cana'),
  navios: quando('presos em navios'),
  escravizadas: quando('Essas pessoas eram escravizadas'),
  quilombo: quando('Agora, a segunda palavra'),
  fugia: quando('Muita gente fugia'),
  mata: quando('se escondia no meio'),
  isso: quando('Isso é um quilombo'),
  maior: quando('O maior quilombo do'),
  serra: quando('Serra da Barriga'),
  alagoas: quando('onde hoje é Alagoas'),
  palmeiras: quando('por causa das muitas'),
  a1600: quando('Começou por volta de 1600'),
  cem: quando('durou quase 100 anos'),
  vilas: quando('Pensa num conjunto'),
  roca: quando('roças de milho'),
  rei: quando('e um rei que'),
  milhares: quando('Os historiadores estimam'),
  nasceu: quando('Zumbi nasceu em Palmares'),
  crianca: quando('Ainda criança, foi pego'),
  padre: quando('entregue a um padre'),
  francisco: quando('ganhou o nome de Francisco'),
  ler: quando('e aprendeu a ler'),
  fugiu: quando('ele fugiu e voltou'),
  guerreiro: quando('Lá virou guerreiro'),
  a1678: quando('Em 1678, o governo'),
  ganga: quando('Ganga Zumba. Era'),
  livre: quando('quem nasceu no quilombo'),
  devolvido: quando('mas quem fugir depois'),
  imagina: quando('Imagina: você fica'),
  vizinho: quando('o seu vizinho volta'),
  aceitou: quando('Ganga Zumba aceitou'),
  nao: quando('Zumbi disse não'),
  todos: quando('ou todo mundo era'),
  dividiu: quando('O quilombo se dividiu'),
  guerra: quando('Aí começou uma guerra'),
  bandeirante: quando('O governo pagou um'),
  jorge: quando('Domingos Jorge Velho'),
  a1694: quando('Em 1694, as tropas'),
  caiu: quando('e ela caiu'),
  ferido: quando('Zumbi escapou ferido'),
  contou: quando('alguém contou onde'),
  morte: quando('E em 20 de novembro de 1695'),
  depois: quando('Quase 300 anos depois'),
  grupo: quando('o Grupo Palmares'),
  maio: quando('O 13 de maio'),
  nov: quando('Eles quiseram lembrar'),
  cresceu: quando('A ideia cresceu'),
  a1996: quando('Em 1996, Zumbi'),
  a2011: quando('Em 2011, a data'),
  a2023: quando('E uma lei de 2023'),
  ultima: quando('Uma última coisa'),
  livros: quando('Por isso alguns detalhes'),
  certa: quando('Mas uma coisa é certa'),
  seculo: quando('resistiu quase um século'),
  racismo: quando('e de pensar no racismo'),
  aprendeu: quando('Aprendeu algo novo'),
  manda: quando('Manda para alguém'),
};

const ESTADOS: [number, string][] = [
  [0, 'POR QUE HOJE É FERIADO?'],
  [T.colonia, 'PALAVRA 1 · COLÔNIA'],
  [T.quilombo, 'PALAVRA 2 · QUILOMBO'],
  [T.maior, 'O QUILOMBO DOS PALMARES'],
  [T.nasceu, 'QUEM FOI ZUMBI'],
  [T.a1678, '1678 · A PROPOSTA'],
  [T.guerra, 'A GUERRA'],
  [T.depois, 'COMO VIROU FERIADO'],
  [T.ultima, 'O QUE FICA'],
];

// A MAQUETE: uma base só, como uma maquete em cima da mesa. Mar e porto (Recife) à direita, engenho de cana,
// mata, Porto Calvo na frente e a Serra da Barriga à esquerda, onde Palmares vai sendo montado no alto.
// Os trechos de mapa (Kit Mapas, mapas/mapa.mp4) cobrem a colônia, a ida até Alagoas, Porto Alegre e o Brasil inteiro.
const BASE = 0.6;
const W = (x: number, y: number, zz: number): V3 => [x, y + BASE, zz];
const MAPA: [number, number][] = [[9.8, 21.7], [39.0, 47.75], [119.5, 126.6], [145.3, 149.0]];
const noMapa = (t: number) => MAPA.some(([a, b]) => t >= a && t < b);

// Serra da Barriga: meia-esfera achatada; yTop dá a altura do chão em cima dela
const SX = -8, SZ = -1.4, RX = 4.2, RY = 1.8, RZ = 3.6;
const yTop = (x: number, z: number) => RY * Math.sqrt(Math.max(0, 1 - ((x - SX) / RX) ** 2 - ((z - SZ) / RZ) ** 2));
const NA = (dx: number, dz: number): V3 => [SX + dx, yTop(SX + dx, SZ + dz), SZ + dz];
const ANEL = (f: number, n: number, fase = 0): V3[] => Array.from({length: n}, (_, i) => {
  const a = fase + (i / n) * Math.PI * 2;
  return NA(f * RX * Math.cos(a), f * RZ * Math.sin(a));
});
const VILAS: [number, number][] = [[-1.4, -0.9], [0.2, -1.5], [1.5, -0.6], [-1.0, 0.8], [1.0, 1.0]];
const CERCA = ANEL(0.62, 24);
const PALMEIRAS = ANEL(0.84, 8, 0.3);
const ROCAS = ANEL(0.42, 4, 0.8);
const MORADORES = ANEL(0.26, 6, 0.2);
const TOPO = NA(0.6, 0.2); // onde Zumbi fica no alto da serra
const PORTO_CALVO: V3 = [-1.2, 0, 3.0];
const MATA: [number, number][] = [[-1.6, -4.6], [0.2, -5.2], [1.8, -4.2], [-0.6, -2.8], [1.2, -2.2], [-1.8, -1.0], [0.4, -0.6], [2.4, -0.4], [-0.2, 1.0], [1.6, 1.2]];
const CANA: V3[] = Array.from({length: 24}, (_, i) => [3.4 + 0.55 * (i % 6), 0, 1.0 + 0.6 * Math.floor(i / 6)]);
// caminho de quem foge: engenho → mata → pé da serra → alto
const FUGA: V3[] = [[4.4, 0, 3.6], [0.8, 0, 0.2], [-3.8, 0, -0.4], [TOPO[0] + 1.0, TOPO[1], TOPO[2] - 0.6]];
const naLinha = (pts: V3[], u: number): V3 => {
  const k = Math.min(pts.length - 1.0001, Math.max(0, u) * (pts.length - 1));
  const i = Math.floor(k), f = k - i;
  const a = pts[i], b = pts[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
};
const mix3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const MARCOS: [number, string][] = [[-9.4, '1971'], [-7.4, '1996'], [-5.4, '2011'], [-3.4, '2023']];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];
  const verde = mistura(festa.verde, tema.objeto, 0.25);
  const grama = mistura(festa.verde, tema.chao, 0.82);
  const madeira = mistura(tema.areia, tema.objetoEscuro, 0.62);
  const escuro = mistura(tema.objeto, tema.objetoEscuro, 0.5);
  const fim = t >= T.aprendeu - 0.3;

  // Palmares sendo montado
  const cerca = (i: number) => entra(t, T.isso + 0.04 * i, 0.4);
  const vila = (i: number) => (i < 2 ? entra(t, T.isso + 0.6 + 0.3 * i, 0.5) : entra(t, T.vilas + 0.25 * i, 0.5));
  const apaga = rampa(t, T.caiu, T.caiu + 1.0) * (1 - rampa(t, T.depois, T.depois + 0.4));
  // Zumbi: criança no alto, levado a Porto Calvo, volta aos 15
  const levado = rampa(t, T.crianca + 0.3, T.padre + 0.8);
  const volta = rampa(t, T.fugiu, T.guerreiro + 0.4);
  const cresce = rampa(t, T.fugiu, T.guerreiro + 0.8);
  const zPos = t < T.fugiu ? mix3(TOPO, PORTO_CALVO, levado) : mix3(PORTO_CALVO, TOPO, volta);
  const separa = rampa(t, T.dividiu, T.dividiu + 1.2);
  const zVis = (t < T.colonia ? entra(t, T.zumbi - 0.2, 0.5) : entra(t, T.nasceu - 0.2, 0.5)) * (1 - rampa(t, T.morte + 0.6, T.morte + 1.6)) + (fim ? entra(t, T.aprendeu, 0.6) : 0);
  const zPose = t < T.colonia || fim || (t > T.guerreiro + 0.6 && t < T.morte) ? {ombroD: [-2.5, 0, 0.2] as V3} : {};
  const zEsc = t < T.colonia || fim ? 0.5 : 0.28 + 0.16 * cresce;
  const zXY: V3 = t < T.colonia || fim ? TOPO : t >= T.a1678 ? [TOPO[0] + 0.9 * separa, TOPO[1], TOPO[2]] : zPos;
  // quem foge
  const corre = rampa(t, T.fugia + 0.1, T.isso + 0.4);
  // guerra: o cerco fecha em volta da serra
  const tropa = (i: number) => entra(t, T.bandeirante + 0.06 * i, 0.4) * (1 - rampa(t, T.depois - 0.4, T.depois));
  const fecha = rampa(t, T.a1694, T.caiu + 0.6);

  return (
    <group>
      {/* a mesa e a base da maquete */}
      <Caixa args={[27.2, 0.5, 13.2]} raio={0.06} cor={mistura(madeira, tema.objetoEscuro, 0.4)} position={[0, 0.25, -1]} />
      <Caixa args={[26.4, 0.12, 12.4]} raio={0.03} cor={madeira} position={[0, 0.55, -1]} />
      <Caixa args={[21.0, 0.04, 12.0]} raio={0.01} cor={grama} position={[-2.4, BASE + 0.0, -1]} sombra={false} />
      <group position={[0, BASE - 0.01, 0]}>
        <Mar tema={tema} x0={8.1} x1={13.1} z0={-7} z1={5} t={t} />
        <Navio tema={tema} pos={[11.6 - 1.4 * rampa(t, 0, T.escravizadas), 0, -4.6 + 1.2 * rampa(t, 0, T.escravizadas)]} rotY={-Math.PI / 2} escala={0.42} t={t} />
        {/* porto do Recife */}
        <Sobrado tema={tema} pos={[6.9, 0, -4.8]} larg={1.6} alt={1.1} prof={1.2} sobe={1} luz={0.2} />
        <Caixa args={[0.9, 0.12, 2.2]} raio={0.02} cor={madeira} position={[8.5, 0.06, -3.6]} />
        {/* engenho: casa-grande, chaminé e canavial */}
        <Sobrado tema={tema} pos={[4.6, 0, -1.4]} larg={2.0} alt={0.9} prof={1.1} sobe={1} />
        <Chamine tema={tema} pos={[6.3, 0, -0.9]} alt={1.7} sobe={1} />
        {CANA.map((c, i) => (
          <Caixa key={i} args={[0.1, 0.75, 0.1]} raio={0.03} cor={verde} position={[c[0], 0.38, c[2]]} />
        ))}
        {[0, 1, 2].map((i) => (
          <Boneco key={i} tema={tema} pos={[4.0 + 0.8 * i, 0, 3.8]} escala={0.42 * entra(t, T.escravizadas - 0.2 + 0.15 * i, 0.4)} cor={cores[(i % 3) + 1]} />
        ))}
        <Corrente tema={tema} a={[3.8, 0.34, 4.0]} b={[5.8, 0.34, 4.0]} k={rampa(t, T.escravizadas + 0.4, T.escravizadas + 1.4)} />
        {/* mata */}
        {MATA.map(([x, z], i) => (
          <ArvoreRedonda key={i} tema={tema} pos={[x, 0, z]} r={0.55} />
        ))}
        {/* Porto Calvo */}
        <Igreja tema={tema} pos={[PORTO_CALVO[0] + 0.9, 0, PORTO_CALVO[2] - 0.2]} rotY={-0.3} escala={0.42} aceso={pulso(t, T.padre + 0.3, 1.4)} />
        <Casinha tema={tema} pos={[PORTO_CALVO[0] - 0.6, 0, PORTO_CALVO[2] + 0.4]} cor={cores[4]} escala={0.3} />
        <LivroLei tema={tema} pos={[PORTO_CALVO[0] + 0.5, 0.05, PORTO_CALVO[2] + 0.9]} rot={[-0.9, -0.3, 0]} escala={0.3 * entra(t, T.ler - 0.1, 0.4) * (1 - rampa(t, T.fugiu, T.fugiu + 0.5))} abre={rampa(t, T.ler, T.ler + 0.8)} />

        {/* Serra da Barriga e Palmares no alto */}
        <mesh position={[SX, 0, SZ]} scale={[RX, RY, RZ]} receiveShadow castShadow>
          <sphereGeometry args={[1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={mistura(festa.verde, tema.objetoEscuro, 0.62)} roughness={1} />
        </mesh>
        {PALMEIRAS.map((p, i) => (
          <Arvore key={i} tema={tema} pos={p} escala={0.55 * entra(t, T.a1600 - 0.4 + 0.08 * i, 0.4)} />
        ))}
        {CERCA.map((p, i) => (cerca(i) < 0.02 ? null :
          <Caixa key={i} args={[0.09, 0.5, 0.09]} raio={0.02} cor={madeira} position={[p[0], p[1] + 0.25 * cerca(i) - 0.05, p[2]]} scale={[1, Math.max(0.05, cerca(i)), 1]} />
        ))}
        {VILAS.map(([dx, dz], i) => (
          <Casinha key={i} tema={tema} pos={NA(dx, dz)} cor={mistura(cores[(i % 3) + 1], escuro, 0.6 * apaga)} escala={0.36 * vila(i)} />
        ))}
        {ROCAS.map((p, i) => (
          <Caixa key={i} args={[0.55, 0.06, 0.55]} raio={0.02} cor={verde} position={[p[0], p[1] + 0.03, p[2]]} scale={Math.max(0.02, entra(t, T.roca + 0.15 * i, 0.4))} />
        ))}
        {MORADORES.map((p, i) => (
          <Boneco key={i} tema={tema} pos={p} rotY={i} escala={0.24 * entra(t, T.milhares + 0.12 * i, 0.4) * (1 - apaga)} cor={cores[(i % 3) + 1]} />
        ))}
        {/* o rei (Ganga Zumba) */}
        <Boneco tema={tema} pos={[TOPO[0] - 0.9 - 0.9 * separa, TOPO[1], TOPO[2]]} rotY={0.4} escala={0.4 * entra(t, T.rei - 0.1, 0.4) * (1 - apaga)} cor={cores[1]} />
        {/* Zumbi */}
        {zVis > 0.02 ? <Boneco tema={tema} pos={zXY} rotY={t >= T.a1678 && t < T.guerra ? -0.4 : 0} escala={zEsc * Math.min(1, zVis)} cor={tema.acento} pose={zPose} /> : null}
        {/* a proposta: um livre, o vizinho preso */}
        {t > T.imagina - 0.3 && t < T.aceitou + 0.5 ? (
          <group>
            <Boneco tema={tema} pos={NA(0.0, 1.6)} escala={0.3 * entra(t, T.imagina, 0.4) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} cor={cores[3]} />
            <Boneco tema={tema} pos={NA(0.8, 1.6)} escala={0.3 * entra(t, T.vizinho - 0.2, 0.4) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} cor={cores[2]} />
            <Corrente tema={tema} a={[SX + 0.6, NA(0.6, 1.8)[1] + 0.22, SZ + 1.8]} b={[SX + 1.1, NA(1.1, 1.8)[1] + 0.22, SZ + 1.8]} k={rampa(t, T.vizinho + 0.3, T.vizinho + 1.0) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} />
          </group>
        ) : null}
        {/* quem foge do engenho */}
        {t > T.fugia - 0.3 && t < T.maior ? <Boneco tema={tema} pos={naLinha(FUGA, corre)} rotY={1.6} escala={0.4 * entra(t, T.fugia - 0.2, 0.4)} cor={cores[2]} /> : null}
        {/* a guerra: tropas cercam a serra */}
        {t > T.bandeirante - 0.3 && t < T.depois ? Array.from({length: 14}).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const k = 1.25 - 0.22 * fecha;
          return <Boneco key={i} tema={tema} pos={[SX + Math.cos(a) * RX * k, 0, SZ + Math.sin(a) * RZ * k]} rotY={-a - Math.PI / 2} escala={0.3 * tropa(i)} cor={escuro} />;
        }) : null}
        <CalendarioGrande tema={tema} pos={[-5.0, 0, 3.4]} rotY={-0.3} texto="20 NOV" sub="1695" folha={0} escala={0.45 * entra(t, T.morte, 0.6) * (1 - rampa(t, T.depois - 0.4, T.depois))} destaque={pulso(t, T.morte + 0.4, 1.6)} />

        {/* a linha do tempo na beira da mesa */}
        {MARCOS.map(([x, ano], i) => {
          const tt = [T.grupo, T.a1996, T.a2011, T.a2023][i];
          return <MarcoAno key={i} tema={tema} pos={[x, 0, 4.6]} ano={ano} k={entra(t, tt - 0.1, 0.4) * (1 - rampa(t, T.ultima, T.ultima + 0.4))} aceso={pulso(t, tt + 0.3, 1.4)} />;
        })}
        <CalendarioGrande tema={tema} pos={[-8.0, 0, 3.2]} rotY={0.25} texto="13 MAIO" sub="1888" folha={0} escala={0.6 * entra(t, T.maio - 0.1, 0.5) * (1 - rampa(t, T.cresceu, T.cresceu + 0.5))} />
        <CalendarioGrande tema={tema} pos={[-4.8, 0, 3.2]} rotY={-0.25} texto="20 NOV" sub="1695" folha={0} escala={0.6 * entra(t, T.nov - 0.1, 0.5) * (1 - rampa(t, T.cresceu, T.cresceu + 0.5))} destaque={pulso(t, T.nov + 0.4, 1.6)} />
        <LivroLei tema={tema} pos={[-6.4, 0.05, 3.5]} rot={[-0.9, 0.2, 0]} escala={0.28 * entra(t, T.a1996, 0.4) * (1 - rampa(t, T.ultima, T.ultima + 0.4))} abre={rampa(t, T.a1996 + 0.3, T.a1996 + 1.0)} />

        {/* abertura e fecho: o calendário do feriado na frente da maquete */}
        <CalendarioGrande tema={tema} pos={[3.4, 0, 4.0]} rotY={-0.2} texto="20 NOV" sub="FERIADO" folha={0} escala={0.55 * (t < T.colonia ? entra(t, 0.2, 0.6) : entra(t, T.aprendeu, 0.6))} destaque={pulso(t, T.feriado + 0.3, 1.4)} />
        {/* o que fica: papéis de quem atacava, a lupa e a estrela sobre a serra */}
        <PilhaPapeis tema={tema} pos={[0.6, 0, 4.2]} n={Math.max(1, Math.round(7 * entra(t, T.ultima - 0.2, 0.5)))} />
        {t > T.ultima - 0.4 ? <Lupa tema={tema} pos={[1.1, 0.8, 4.6]} rot={[0, 0, 0.4]} escala={0.45 * entra(t, T.livros - 0.1, 0.4)} /> : null}
        <Estrela tema={tema} pos={[SX, RY + 1.4, SZ]} escala={0.45 * entra(t, T.seculo, 0.6)} giro={t * 0.6} brilho={0.3 + 0.3 * pulso(t, T.seculo + 0.4, 1.6)} />
      </group>
    </group>
  );
};

const TOP = W(TOPO[0], TOPO[1], TOPO[2]);
const SERRA = W(SX, RY * 0.7, SZ);
const TUDO = W(-1.2, 0.4, -1.0);
const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(TUDO, 24, 13, [0.12, 0.62, 1])], [T.feriado, E(W(0, 0.6, 1.0), 16, 9, [0.1, 0.55, 1])], [T.zumbi - 1.2, E(W(-3, 0.6, 0), 13, 8, [0.1, 0.55, 1])], [T.zumbi, E(TOP, 6.4, 5.0, [0.08, 0.45, 1])], [T.colonia - 0.1, E(TOP, 6.0, 4.8, [0.1, 0.45, 1])]]},
  {ini: T.colonia, chaves: [[T.colonia, E(W(4.6, 0.6, 1.6), 9, 6, [0.2, 0.5, 1])], [T.escravizadas, E(W(4.8, 0.4, 3.2), 5.2, 4.0, [0.12, 0.35, 1])], [T.quilombo - 0.1, E(W(4.8, 0.4, 3.2), 5.0, 3.8, [0.1, 0.35, 1])]]},
  {ini: T.quilombo, chaves: [[T.quilombo, E(W(3.4, 0.5, 2.0), 8, 5.6, [0.2, 0.45, 1])], [T.mata, E(W(0.2, 0.6, 0.0), 9, 6.2, [0.15, 0.5, 1])], [T.isso, E(W(SX + 0.6, RY * 0.7, SZ + 0.4), 8.6, 6.2, [0.15, 0.5, 1])], [T.maior - 0.1, E(SERRA, 9.4, 6.6, [0.1, 0.5, 1])]]},
  {ini: T.maior, chaves: [[T.maior, E(SERRA, 10, 7, [0.1, 0.55, 1])], [T.a1600, E(SERRA, 10, 7, [0.12, 0.6, 1])], [T.vilas, E(SERRA, 8.4, 6, [0.05, 0.55, 1])], [T.rei, E(W(TOPO[0] - 0.5, TOPO[1], TOPO[2]), 4.2, 3.4, [0.05, 0.4, 1])], [T.milhares, E(SERRA, 8.6, 6.2, [-0.06, 0.55, 1])], [T.nasceu - 0.1, E(SERRA, 8.4, 6.0, [-0.08, 0.55, 1])]]},
  {ini: T.nasceu, chaves: [[T.nasceu, E(TOP, 4.4, 3.6, [0.06, 0.4, 1])], [T.crianca, E(W(-4.6, 0.8, 0.8), 13, 7.6, [0.05, 0.55, 1])], [T.francisco, E(W(PORTO_CALVO[0] + 0.4, 0.5, PORTO_CALVO[2]), 4.6, 3.6, [0.1, 0.32, 1])], [T.fugiu, E(W(-4.6, 0.8, 0.8), 13, 7.6, [0.02, 0.55, 1])], [T.guerreiro, E(TOP, 4.4, 3.6, [0.06, 0.4, 1])], [T.a1678 - 0.1, E(TOP, 4.2, 3.4, [0.08, 0.4, 1])]]},
  {ini: T.a1678, chaves: [[T.a1678, E(TOP, 5.6, 4.4, [0.05, 0.45, 1])], [T.imagina, E(W(SX + 0.4, NA(0.4, 1.6)[1], SZ + 1.6), 3.4, 2.8, [0.04, 0.35, 1])], [T.aceitou, E(W(TOPO[0] - 0.9, TOPO[1], TOPO[2]), 4.4, 3.6, [0.08, 0.4, 1])], [T.nao, E(TOP, 4.4, 3.6, [-0.08, 0.4, 1])], [T.dividiu, E(TOP, 6.6, 5.0, [0.02, 0.5, 1])], [T.guerra - 0.1, E(TOP, 6.8, 5.2, [-0.02, 0.5, 1])]]},
  {ini: T.guerra, chaves: [[T.guerra, E(SERRA, 12.6, 8.2, [0.05, 0.7, 1])], [T.a1694, E(SERRA, 11, 7.4, [0.08, 0.66, 1])], [T.ferido, E(SERRA, 10, 6.8, [-0.06, 0.6, 1])], [T.morte, E(W(-5.0, 0.6, 3.4), 4.4, 3.6, [-0.08, 0.32, 1])], [T.depois - 0.1, E(W(-5.0, 0.6, 3.4), 4.2, 3.4, [-0.1, 0.32, 1])]]},
  {ini: T.depois, chaves: [[T.depois, E(W(-6.4, 0.6, 4.0), 10.6, 6.2, [0.0, 0.4, 1])], [T.maio, E(W(-6.4, 0.7, 3.8), 10.4, 6.0, [0.0, 0.38, 1])], [T.cresceu, E(W(-6.4, 0.6, 4.3), 10.6, 6.2, [0.0, 0.4, 1])], [T.a2023, E(W(-6.4, 0.6, 4.3), 10.6, 6.2, [0.0, 0.4, 1])], [T.ultima - 0.1, E(W(-6.4, 0.6, 4.3), 10.6, 6.2, [0.0, 0.4, 1])]]},
  {ini: T.ultima, chaves: [[T.ultima, E(W(0.8, 0.5, 4.3), 4.4, 3.4, [0.1, 0.35, 1])], [T.certa, E(W(SX, RY + 0.4, SZ), 9.6, 7.2, [0.1, 0.55, 1])], [T.racismo, E(TUDO, 20, 11, [0.06, 0.6, 1])], [T.aprendeu - 0.1, E(TUDO, 21, 11.6, [0.04, 0.6, 1])]]},
  {ini: T.aprendeu, chaves: [[T.aprendeu, E(TUDO, 21, 11.6, [0.04, 0.6, 1])], [FIM, E(TUDO, 23, 12.6, [0, 0.62, 1])]]},
];

const CHIPS: Txt[] = [
  {a: T.hoje, b: T.porque, texto: '20 DE NOVEMBRO: FERIADO NACIONAL', destaque: true},
  {a: T.porque, b: T.colonia, texto: 'POR CAUSA DE ZUMBI DOS PALMARES'},
  {a: T.colonia, b: T.cana, texto: 'COLÔNIA: QUEM MANDAVA ERA PORTUGAL'},
  {a: T.cana, b: T.escravizadas, texto: 'MILHÕES DE AFRICANOS TRAZIDOS À FORÇA'},
  {a: T.escravizadas, b: T.quilombo, texto: 'ESCRAVIZADO: SEM SALÁRIO E SEM LIBERDADE', destaque: true},
  {a: T.quilombo, b: T.isso, texto: 'QUEM FUGIA SE ESCONDIA NA MATA'},
  {a: T.isso, b: T.maior, texto: 'QUILOMBO: COMUNIDADE LIVRE DE QUEM FUGIU', destaque: true},
  {a: T.maior, b: T.a1600, texto: 'SERRA DA BARRIGA · HOJE ALAGOAS'},
  {a: T.a1600, b: T.vilas, texto: 'DE ≈ 1600 ATÉ 1695: QUASE 100 ANOS', destaque: true},
  {a: T.vilas, b: T.milhares, texto: 'VÁRIAS VILAS, ROÇAS E UM REI'},
  {a: T.milhares, b: T.nasceu, texto: 'MILHARES DE MORADORES (ESTIMATIVA)'},
  {a: T.nasceu, b: T.crianca, texto: 'ZUMBI NASCE EM PALMARES · ≈ 1655'},
  {a: T.crianca, b: T.fugiu, texto: 'CRIANÇA, É LEVADO A UM PADRE'},
  {a: T.fugiu, b: T.a1678, texto: 'AOS ≈ 15 ANOS, FOGE E VOLTA', destaque: true},
  {a: T.a1678, b: T.imagina, texto: 'A PROPOSTA DO GOVERNO · 1678'},
  {a: T.imagina, b: T.aceitou, texto: 'VOCÊ LIVRE, O VIZINHO PRESO?'},
  {a: T.aceitou, b: T.nao, texto: 'GANGA ZUMBA ACEITOU'},
  {a: T.nao, b: T.dividiu, texto: 'ZUMBI DISSE NÃO: OU TODOS, OU NINGUÉM', destaque: true},
  {a: T.dividiu, b: T.guerra, texto: 'ZUMBI VIRA O LÍDER'},
  {a: T.guerra, b: T.bandeirante, texto: 'UMA GUERRA DE MAIS DE 15 ANOS'},
  {a: T.bandeirante, b: T.a1694, texto: 'BANDEIRANTE: CHEFE DE TROPA CONTRATADO'},
  {a: T.a1694, b: T.ferido, texto: '1694 · CAI A VILA DO MACACO'},
  {a: T.ferido, b: T.morte, texto: 'ZUMBI ESCAPA FERIDO'},
  {a: T.morte, b: T.depois, texto: '20 DE NOVEMBRO DE 1695', destaque: true},
  {a: T.depois, b: T.maio, texto: '1971 · GRUPO PALMARES, PORTO ALEGRE'},
  {a: T.maio, b: T.nov, texto: '13 DE MAIO: A ABOLIÇÃO ASSINADA'},
  {a: T.nov, b: T.cresceu, texto: '20 DE NOVEMBRO: QUEM LUTOU', destaque: true},
  {a: T.a1996, b: T.a2011, texto: '1996 · LIVRO DOS HERÓIS DA PÁTRIA'},
  {a: T.a2011, b: T.a2023, texto: '2011 · DIA DE ZUMBI E DA CONSCIÊNCIA NEGRA'},
  {a: T.a2023, b: T.ultima, texto: '2023 · VIRA FERIADO NACIONAL', destaque: true},
  {a: T.ultima, b: T.certa, texto: 'QUEM ESCREVEU FOI QUEM ATACAVA'},
  {a: T.certa, b: T.racismo, texto: 'PALMARES RESISTIU QUASE UM SÉCULO', destaque: true},
  {a: T.racismo, b: T.aprendeu, texto: 'LEMBRAR E PENSAR NO RACISMO DE HOJE'},
  {a: T.aprendeu, b: FIM, texto: 'MANDA PARA QUEM NÃO SABE'},
];
const SELOS: Txt[] = [
  {a: T.feriado, b: T.colonia, texto: 'FONTE: LEI 14.759/2023'},
  {a: T.maior, b: T.nasceu, texto: 'FONTE: CÂMARA DOS DEPUTADOS · FUNDAÇÃO PALMARES'},
  {a: T.nasceu, b: T.a1678, texto: 'FONTE: HISTORIADORES (DATAS APROXIMADAS)'},
  {a: T.a1678, b: T.guerra, texto: 'FONTE: CÂMARA DOS DEPUTADOS'},
  {a: T.depois, b: T.a1996, texto: 'FONTE: AGÊNCIA SENADO · UFRGS'},
  {a: T.a1996, b: T.a2011, texto: 'FONTE: LEI 9.315/1996'},
  {a: T.a2011, b: T.a2023, texto: 'FONTE: LEI 12.519/2011'},
  {a: T.a2023, b: T.ultima, texto: 'FONTE: LEI 14.759/2023'},
];
const ROTULOS: Rot[] = [
  {a: T.zumbi, b: T.colonia, p: W(TOPO[0], TOPO[1] + 1.1, TOPO[2]), texto: 'ZUMBI', acento: true},
  {a: T.escravizadas + 0.6, b: T.quilombo, p: W(4.8, 1.0, 3.8), texto: 'ESCRAVIZADOS', acento: true},
  {a: T.escravizadas + 0.3, b: T.quilombo, p: W(4.6, 1.6, -1.4), texto: 'ENGENHO'},
  {a: T.mata, b: T.isso, p: W(0.4, 1.4, -1.0), texto: 'MATA'},
  {a: T.isso + 0.4, b: T.maior, p: W(SX, RY + 0.9, SZ), texto: 'QUILOMBO', acento: true},
  {a: T.a1600, b: T.nasceu, p: W(SX - 3.4, 1.2, SZ + 2.0), texto: 'SERRA DA BARRIGA'},
  {a: T.vilas + 0.4, b: T.nasceu, p: W(SX + 1.5, NA(1.5, -0.6)[1] + 0.8, SZ - 0.6), texto: 'MOCAMBOS'},
  {a: T.roca, b: T.nasceu, p: W(ROCAS[0][0], ROCAS[0][1] + 0.6, ROCAS[0][2]), texto: 'ROÇAS'},
  {a: T.rei, b: T.nasceu, p: W(TOPO[0] - 0.9, TOPO[1] + 0.9, TOPO[2]), texto: 'REI', acento: true},
  {a: T.padre, b: T.fugiu, p: W(PORTO_CALVO[0] + 0.9, 1.5, PORTO_CALVO[2] - 0.2), texto: 'PORTO CALVO'},
  {a: T.francisco, b: T.fugiu, p: W(PORTO_CALVO[0], 0.9, PORTO_CALVO[2] + 0.3), texto: 'FRANCISCO'},
  {a: T.guerreiro, b: T.a1678, p: W(TOPO[0], TOPO[1] + 1.1, TOPO[2]), texto: 'ZUMBI', acento: true},
  {a: T.ganga, b: T.guerra, p: W(TOPO[0] - 1.2, TOPO[1] + 0.9, TOPO[2]), texto: 'GANGA ZUMBA'},
  {a: T.nao, b: T.guerra, p: W(TOPO[0] + 1.2, TOPO[1] + 1.0, TOPO[2]), texto: 'ZUMBI', acento: true},
  {a: T.imagina + 0.3, b: T.aceitou, p: W(SX, NA(0, 1.6)[1] + 0.7, SZ + 1.6), texto: 'LIVRE'},
  {a: T.vizinho + 0.3, b: T.aceitou, p: W(SX + 0.8, NA(0.8, 1.6)[1] + 0.7, SZ + 1.6), texto: 'PRESO', acento: true},
  {a: T.bandeirante + 0.6, b: T.a1694, p: W(SX, 0.9, SZ + RZ * 1.25), texto: 'TROPAS DO BANDEIRANTE'},
  {a: T.a1694 + 0.3, b: T.morte, p: W(SX, RY + 0.9, SZ), texto: 'MACACO', acento: true},
  {a: T.a1996 + 0.4, b: T.ultima, p: W(-6.4, 0.5, 3.5), texto: 'HERÓIS DA PÁTRIA'},
  {a: T.livros, b: T.certa, p: W(0.6, 1.0, 4.2), texto: 'PAPÉIS DA ÉPOCA'},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  s.push({t: T.feriado + 0.3, f: 'ding', v: 0.15});
  s.push({t: T.escravizadas + 0.8, f: 'baque', v: 0.13});
  s.push({t: T.isso + 0.3, f: 'pop', v: 0.13});
  s.push({t: T.a1600, f: 'tique', v: 0.12});
  s.push({t: T.fugiu + 0.3, f: 'subida', v: 0.13});
  s.push({t: T.nao, f: 'baque', v: 0.14});
  s.push({t: T.caiu + 0.2, f: 'baque', v: 0.13});
  [T.grupo, T.a1996, T.a2011, T.a2023].forEach((t) => s.push({t: t + 0.3, f: 'pop', v: 0.13}));
  s.push({t: T.seculo + 0.3, f: 'ding', v: 0.15});
  s.push({t: T.aprendeu, f: 'ding', v: 0.2});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  0.8, T.feriado + 1.0, T.zumbi + 1.0, T.portugal + 1.0, T.navios + 0.6, T.escravizadas + 1.6, T.fugia + 1.0, T.isso + 1.2,
  T.serra + 1.0, T.a1600 + 1.0, T.roca + 1.0, T.rei + 0.6, T.milhares + 1.2, T.nasceu + 1.0, T.padre + 1.0, T.ler + 1.0,
  T.guerreiro + 1.0, T.ganga + 1.0, T.vizinho + 1.2, T.aceitou + 0.6, T.nao + 1.0, T.dividiu + 1.2, T.bandeirante + 1.4,
  T.a1694 + 1.6, T.ferido + 1.0, T.morte + 1.2, T.grupo + 1.0, T.maio + 1.0, T.nov + 1.0, T.a1996 + 1.0, T.a2023 + 1.2,
  T.livros + 1.0, T.seculo + 1.0, T.racismo + 1.2, T.aprendeu + 1.0, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: 'Consciência Negra',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: trechos(MAPA),
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.aprendeu, arroba: T.manda, noMapa},
  Mundo,
  arrobaFixo: true,
};

export const ZumbiPalmares: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Por que hoje', 'é feriado?', 'Explico fácil'];
export const CapaZumbiPalmares: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="CONSCIÊNCIA NEGRA" />
);
