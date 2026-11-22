import React from 'react';
import {Boneco, Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Arvore, ArvoreRedonda, CalendarioGrande, Casinha, Corrente, DocumentoGrande, Estrela, Igreja, LivroLei, Lupa, MapaBrasil, Mar, MarcoAno, Morro, Navio, PilhaPapeis} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
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

const ABRE: V3 = [0, 0, 0];
const COL: V3 = [12, 0, 0];
const QUI: V3 = [24, 0, 0];
const PAL: V3 = [36, 0, 0];
const ZUM: V3 = [48, 0, 0];
const ACO: V3 = [60, 0, 0];
const GUE: V3 = [72, 0, 0];
const MEM: V3 = [84, 0, 0];
const FEC: V3 = [96, 0, 0];

const VILAS: V3[] = [[-1.6, 0, -0.6], [0.2, 0, -1.2], [1.8, 0, -0.4], [-0.6, 0, 0.8], [1.0, 0, 1.0]];
const ROCAS: V3[] = [[-2.4, 0, 1.4], [-1.7, 0, 1.4], [2.2, 0, 1.2], [2.7, 0, 0.5]];
const CERCO = 10;

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const cores = [tema.pessoa, mistura(festa.azul, tema.objeto, 0.4), mistura(festa.rosa, tema.objeto, 0.4), mistura(festa.verde, tema.objeto, 0.4), tema.objetoClaro];
  const verde = mistura(festa.verde, tema.objeto, 0.25);
  const escuro = mistura(tema.objeto, tema.objetoEscuro, 0.5);

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.colonia - 0.3, T.colonia)) + entra(t, T.aprendeu - 0.3, 0.6);
  const abertura = t < T.colonia;
  const colK = vis(t, T.colonia - 0.3, T.quilombo);
  const quiK = vis(t, T.quilombo - 0.3, T.maior);
  const palK = vis(t, T.maior - 0.3, T.nasceu);
  const zumK = vis(t, T.nasceu - 0.3, T.a1678);
  const acoK = vis(t, T.a1678 - 0.3, T.guerra);
  const gueK = vis(t, T.guerra - 0.3, T.depois);
  const memK = vis(t, T.depois - 0.3, T.ultima);
  const fecK = vis(t, T.ultima - 0.3, T.aprendeu);

  // colônia: o navio atravessa o mar até a praia
  const navega = rampa(t, T.cana, T.escravizadas);
  // quilombo: o boneco corre para a mata e as casas aparecem
  const corre = rampa(t, T.fugia + 0.2, T.mata + 1.2);
  // Zumbi: criança levada à igreja; aos 15 volta para Palmares
  const levado = rampa(t, T.crianca + 0.3, T.padre + 0.8);
  const volta = rampa(t, T.fugiu, T.guerreiro + 0.4);
  const cresce = rampa(t, T.fugiu, T.guerreiro + 0.8);
  const zx = -2.4 + 4.6 * levado - 4.6 * volta;
  // proposta: o quilombo se divide
  const separa = rampa(t, T.dividiu, T.dividiu + 1.2);
  // guerra: o cerco fecha
  const fecha = rampa(t, T.a1694, T.caiu + 0.6);
  const apaga = rampa(t, T.caiu, T.caiu + 1.0);

  return (
    <group>
      <Caixa args={[116, 0.04, 1.6]} raio={0.015} cor={mistura(tema.chao, tema.objetoEscuro, 0.45)} position={[48, 0.02, 3.8]} sombra={false} />

      {/* 1 e fecho: o calendário do feriado e o mapa do Brasil inteiro */}
      {abK > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(ABRE, [-1.4, 0, -0.6])} rotY={0.25} texto="20 NOV" sub="FERIADO" folha={0} escala={0.85 * Math.min(1, abK)} destaque={pulso(t, T.feriado + 0.3, 1.4)} />
          <MapaBrasil tema={tema} pos={soma(ABRE, [1.9, 0.03, -0.4])} tam={2.6} k={Math.min(1, abK) * entra(t, T.feriado, 0.8)} acende={abertura ? 0.3 + 0.5 * entra(t, T.feriado + 0.4, 0.8) : 0.8} />
          <Boneco tema={tema} pos={soma(ABRE, [0.2, 0, 1.4])} escala={0.62 * Math.min(1, abK) * entra(t, T.zumbi - 0.2, 0.5)} cor={cores[3]} pose={{ombroD: [-2.6, 0, 0.2]}} />
          {abertura ? null : <Estrela tema={tema} pos={soma(ABRE, [0.2, 2.3, 1.4])} escala={0.35 * entra(t, T.aprendeu, 0.6)} giro={t * 0.6} brilho={0.3 + 0.3 * pulso(t, T.manda, 1.6)} />}
        </group>
      ) : null}

      {/* 2: colônia. O navio atravessa o mar; as pessoas presas por corrente */}
      {colK > 0.02 ? (
        <group>
          <Mar tema={tema} x0={COL[0] - 6} x1={COL[0] + 6} z0={-6} z1={-1.2} t={t} />
          <Navio tema={tema} pos={soma(COL, [2.2 - 3.6 * navega, 0, -3.0])} rotY={Math.PI / 2} escala={0.55 * colK * entra(t, T.portugal, 0.6)} t={t} />
          {[0, 1, 2].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(COL, [-0.9 + 0.9 * i, 0, 0.6])} escala={0.55 * colK * entra(t, T.escravizadas - 0.3 + 0.15 * i, 0.4)} cor={cores[(i % 3) + 1]} />
          ))}
          <Corrente tema={tema} a={soma(COL, [-1.1, 0.45, 0.85])} b={soma(COL, [1.1, 0.45, 0.85])} k={rampa(t, T.escravizadas + 0.4, T.escravizadas + 1.4)} vida={colK} />
          {[0, 1, 2].map((i) => (
            <Caixa key={i} args={[0.18, 1.2, 0.18]} raio={0.04} cor={verde} position={soma(COL, [1.7 + 0.35 * i, 0.6 * entra(t, T.cana + 0.2 * i, 0.5), 1.2])} scale={[1, Math.max(0.02, colK * entra(t, T.cana + 0.2 * i, 0.5)), 1]} />
          ))}
        </group>
      ) : null}

      {/* 3: quilombo. Quem fugiu corre para a mata e monta a comunidade livre */}
      {quiK > 0.02 ? (
        <group>
          {[[-2.6, -1.6], [-1.4, -2.4], [0, -2.0], [1.4, -2.6], [2.6, -1.6], [3.2, -0.2]].map(([x, z], i) => (
            <ArvoreRedonda key={i} tema={tema} pos={soma(QUI, [x, 0, z])} r={0.8} cresce={quiK} />
          ))}
          <Boneco tema={tema} pos={soma(QUI, [-3.4 + 4.4 * corre, 0, 1.4 - 1.4 * corre])} rotY={0.9} escala={0.55 * quiK * entra(t, T.fugia - 0.2, 0.4)} cor={cores[1]} />
          {[0, 1, 2].map((i) => (
            <Casinha key={i} tema={tema} pos={soma(QUI, [0.2 + 1.1 * i, 0, -0.4 + 0.3 * i])} cor={cores[(i % 3) + 1]} escala={0.55 * quiK * entra(t, T.isso + 0.25 * i, 0.5)} />
          ))}
        </group>
      ) : null}

      {/* 4: Palmares. A serra, as palmeiras, as vilas (mocambos), as roças e milhares de pessoas */}
      {palK > 0.02 ? (
        <group>
          <Morro tema={tema} pos={soma(PAL, [0, 0, -0.2])} raios={[3.6, 0.5 * palK * entra(t, T.serra - 0.2, 0.8), 2.6]} />
          {[[-2.6, -1.8], [-1.8, -2.4], [2.4, -2.2], [2.8, -1.2], [-2.9, -0.6]].map(([x, z], i) => (
            <Arvore key={i} tema={tema} pos={soma(PAL, [x, 0, z])} escala={0.9 * palK * entra(t, T.palmeiras + 0.15 * i, 0.4)} />
          ))}
          {VILAS.map((v, i) => (
            <Casinha key={i} tema={tema} pos={soma(PAL, [v[0], 0.45, v[2]])} cor={cores[(i % 3) + 1]} escala={0.42 * palK * entra(t, T.vilas + 0.2 * i, 0.5)} />
          ))}
          {ROCAS.map((r, i) => (
            <Caixa key={i} args={[0.6, 0.12, 0.6]} raio={0.03} cor={verde} position={soma(PAL, [r[0], 0.06, r[2]])} scale={Math.max(0.02, palK * entra(t, T.roca + 0.15 * i, 0.4))} />
          ))}
          <Boneco tema={tema} pos={soma(PAL, [0.2, 0.45, 0.0])} escala={0.42 * palK * entra(t, T.rei - 0.1, 0.4)} cor={tema.acento} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(PAL, [-1.8 + 0.75 * i, 0, 2.2 + 0.2 * (i % 2)])} rotY={Math.PI} escala={0.32 * palK * entra(t, T.milhares + 0.12 * i, 0.4)} cor={cores[(i % 3) + 1]} />
          ))}
        </group>
      ) : null}

      {/* 5: quem foi Zumbi. Criança levada à igreja de Porto Calvo, aprende a ler e volta aos 15 anos */}
      {zumK > 0.02 ? (
        <group>
          <Casinha tema={tema} pos={soma(ZUM, [-3.0, 0, -1.2])} cor={cores[3]} escala={0.7 * zumK} />
          <Igreja tema={tema} pos={soma(ZUM, [2.8, 0, -1.4])} rotY={-0.3} escala={0.5 * zumK * entra(t, T.padre - 0.2, 0.5)} aceso={pulso(t, T.padre + 0.3, 1.4)} />
          <Boneco tema={tema} pos={soma(ZUM, [zx, 0, 0.4])} rotY={volta > 0.01 && volta < 0.99 ? -1.2 : levado > 0.01 && levado < 0.99 ? 1.2 : 0} escala={zumK * (0.32 + 0.3 * cresce)} cor={tema.acento} pose={t > T.guerreiro + 0.6 ? {ombroD: [-2.4, 0, 0.2]} : {}} />
          <LivroLei tema={tema} pos={soma(ZUM, [2.6, 0.05, 1.2])} rot={[-0.9, -0.3, 0]} escala={0.45 * zumK * entra(t, T.ler - 0.1, 0.4) * (1 - rampa(t, T.fugiu, T.fugiu + 0.5))} abre={rampa(t, T.ler, T.ler + 0.8)} />
        </group>
      ) : null}

      {/* 6: 1678. A proposta: um fica livre, o vizinho volta preso. Ganga Zumba aceita, Zumbi recusa, o quilombo se divide */}
      {acoK > 0.02 ? (
        <group>
          <DocumentoGrande tema={tema} pos={soma(ACO, [0, 0.05, -1.6])} rot={[-1.2, 0, 0]} escala={0.6 * acoK * entra(t, T.a1678, 0.5)} carimbo={rampa(t, T.aceitou, T.aceitou + 0.6)} />
          <Boneco tema={tema} pos={soma(ACO, [-1.6 - 0.8 * separa, 0, 0.6])} rotY={0.4} escala={0.6 * acoK * entra(t, T.ganga - 0.2, 0.4)} cor={cores[1]} />
          <Boneco tema={tema} pos={soma(ACO, [1.6 + 0.8 * separa, 0, 0.6])} rotY={-0.4} escala={0.6 * acoK * entra(t, T.nao - 0.3, 0.4)} cor={tema.acento} pose={t > T.nao ? {ombroD: [-2.4, 0, 0.2]} : {}} />
          {/* o vizinho: dois bonecos pequenos no meio, um com corrente */}
          {t > T.imagina - 0.3 && t < T.aceitou + 0.4 ? (
            <group>
              <Boneco tema={tema} pos={soma(ACO, [-0.5, 0, 1.6])} escala={0.42 * entra(t, T.imagina, 0.4) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} cor={cores[3]} />
              <Boneco tema={tema} pos={soma(ACO, [0.5, 0, 1.6])} escala={0.42 * entra(t, T.vizinho - 0.2, 0.4) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} cor={cores[2]} />
              <Corrente tema={tema} a={soma(ACO, [0.3, 0.3, 1.8])} b={soma(ACO, [0.8, 0.3, 1.8])} k={rampa(t, T.vizinho + 0.3, T.vizinho + 1.0) * (1 - rampa(t, T.aceitou, T.aceitou + 0.4))} />
            </group>
          ) : null}
          <Caixa args={[0.06, 0.02, 3.2 * separa + 0.01]} raio={0.01} cor={tema.acento} position={soma(ACO, [0, 0.03, 0.6])} />
        </group>
      ) : null}

      {/* 7: a guerra. O cerco fecha na vila do Macaco; depois o calendário de 20 de novembro de 1695 */}
      {gueK > 0.02 ? (
        <group>
          <Morro tema={tema} pos={soma(GUE, [0, 0, -0.4])} raios={[2.8, 0.45 * gueK, 2.0]} />
          {[[-0.8, -0.8], [0.6, -0.6], [0, 0.4]].map(([x, z], i) => (
            <Casinha key={i} tema={tema} pos={soma(GUE, [x, 0.4, z])} cor={mistura(cores[(i % 3) + 1], escuro, 0.5 * apaga)} escala={0.4 * gueK} />
          ))}
          {Array.from({length: CERCO}).map((_, i) => {
            const a = (i / CERCO) * Math.PI * 2;
            const r = 3.4 - 0.9 * fecha;
            return <Boneco key={i} tema={tema} pos={soma(GUE, [Math.cos(a) * r, 0, -0.4 + Math.sin(a) * r * 0.7])} rotY={-a - Math.PI / 2} escala={0.4 * gueK * entra(t, T.bandeirante + 0.08 * i, 0.4)} cor={escuro} />;
          })}
          <CalendarioGrande tema={tema} pos={soma(GUE, [1.6, 0, 1.4])} rotY={-0.3} texto="20 NOV" sub="1695" folha={0} escala={0.6 * gueK * entra(t, T.morte, 0.6)} destaque={pulso(t, T.morte + 0.4, 1.6)} />
        </group>
      ) : null}

      {/* 8: como virou feriado. Linha do tempo de marcos: 1971, 1996, 2011, 2023; 13 de maio x 20 de novembro */}
      {memK > 0.02 ? (
        <group>
          <CalendarioGrande tema={tema} pos={soma(MEM, [-1.5, 0, -2.4])} rotY={0.25} texto="13 MAIO" sub="1888" folha={0} escala={0.75 * memK * entra(t, T.maio - 0.1, 0.5) * (1 - rampa(t, T.cresceu, T.cresceu + 0.5))} />
          <CalendarioGrande tema={tema} pos={soma(MEM, [1.5, 0, -2.4])} rotY={-0.25} texto="20 NOV" sub="1695" folha={0} escala={0.75 * memK * entra(t, T.nov - 0.1, 0.5) * (1 - rampa(t, T.cresceu, T.cresceu + 0.5))} destaque={pulso(t, T.nov + 0.4, 1.6)} />
          {[[T.grupo, '1971'], [T.a1996, '1996'], [T.a2011, '2011'], [T.a2023, '2023']].map(([tt, ano], i) => (
            <MarcoAno key={i} tema={tema} pos={soma(MEM, [-2.4 + 1.6 * i, 0, 1.4])} ano={ano as string} k={memK * entra(t, (tt as number) - 0.1, 0.4)} aceso={pulso(t, (tt as number) + 0.3, 1.4)} />
          ))}
          <LivroLei tema={tema} pos={soma(MEM, [-0.7, 0.05, 2.3])} rot={[-0.9, 0.2, 0]} escala={0.35 * memK * entra(t, T.a1996, 0.4)} abre={rampa(t, T.a1996 + 0.3, T.a1996 + 1.0)} />
          <MapaBrasil tema={tema} pos={soma(MEM, [1.6, 0.03, 2.5])} tam={1.4} k={memK * entra(t, T.a2023, 0.6)} acende={0.3 + 0.5 * entra(t, T.a2023 + 0.4, 0.8)} />
        </group>
      ) : null}

      {/* 9: o que fica. Papéis antigos de quem atacava (lupa); depois a serra com a estrela: resistiu quase um século */}
      {fecK > 0.02 ? (
        <group>
          <PilhaPapeis tema={tema} pos={soma(FEC, [-1.0, 0, 0.4])} n={Math.max(1, Math.round(8 * fecK))} />
          <Lupa tema={tema} pos={soma(FEC, [-0.5, 0.9, 1.0])} rot={[0, 0, 0.4]} escala={0.6 * fecK * entra(t, T.livros - 0.1, 0.4)} />
          <Morro tema={tema} pos={soma(FEC, [1.6, 0, -0.8])} raios={[2.0, 0.8 * fecK * entra(t, T.certa - 0.2, 0.6), 1.5]} />
          <Estrela tema={tema} pos={soma(FEC, [1.6, 1.6, -0.8])} escala={0.4 * fecK * entra(t, T.seculo, 0.6)} giro={t * 0.6} brilho={0.3 + 0.3 * pulso(t, T.seculo + 0.4, 1.6)} />
          {[0, 1, 2].map((i) => (
            <Boneco key={i} tema={tema} pos={soma(FEC, [0.8 + 0.8 * i, 0, 1.4])} rotY={Math.PI} escala={0.4 * fecK * entra(t, T.racismo + 0.15 * i, 0.4)} cor={cores[(i % 3) + 1]} />
          ))}
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0.2, 1.2, -0.2]), 7.6, 5.8, [0.04, 0.34, 1])], [T.feriado, E(soma(ABRE, [0.6, 1.0, -0.2]), 7.0, 5.4, [-0.04, 0.34, 1])], [T.zumbi, E(soma(ABRE, [0.2, 1.0, 0.6]), 5.8, 4.6, [0.03, 0.3, 1])], [T.colonia - 0.1, E(soma(ABRE, [0.2, 1.1, 0.4]), 6.4, 5.0, [0.05, 0.3, 1])]]},
  {ini: T.colonia, chaves: [[T.colonia, E(soma(COL, [0, 1.2, -1.2]), 8.0, 6.0, [0.05, 0.34, 1])], [T.portugal, E(soma(COL, [0, 1.2, -1.2]), 7.6, 5.8, [0.06, 0.34, 1])], [T.navios, E(soma(COL, [0, 1.0, -2.4]), 7.0, 5.4, [-0.04, 0.32, 1])], [T.escravizadas, E(soma(COL, [0, 1.0, 0.6]), 6.0, 4.6, [0.03, 0.3, 1])], [T.quilombo - 0.1, E(soma(COL, [0.3, 1.0, 0.6]), 6.2, 4.8, [-0.03, 0.3, 1])]]},
  {ini: T.quilombo, chaves: [[T.quilombo, E(soma(QUI, [0, 1.2, -0.6]), 8.4, 6.2, [0.05, 0.34, 1])], [T.fugia, E(soma(QUI, [-1.4, 1.0, 0.4]), 7.0, 5.4, [0.06, 0.32, 1])], [T.isso, E(soma(QUI, [0.8, 1.0, -0.4]), 6.6, 5.0, [-0.04, 0.32, 1])], [T.maior - 0.1, E(soma(QUI, [0.6, 1.1, -0.4]), 7.0, 5.2, [-0.05, 0.32, 1])]]},
  {ini: T.maior, chaves: [[T.maior, E(soma(PAL, [0, 1.2, -0.4]), 9.4, 6.8, [0.04, 0.4, 1])], [T.vilas, E(soma(PAL, [0, 1.0, -0.2]), 8.0, 6.0, [0.06, 0.42, 1])], [T.rei, E(soma(PAL, [0.2, 1.1, 0]), 5.4, 4.2, [0.03, 0.36, 1])], [T.milhares, E(soma(PAL, [0, 1.1, 0.8]), 8.4, 6.2, [-0.04, 0.4, 1])], [T.nasceu - 0.1, E(soma(PAL, [0, 1.1, 0.8]), 8.6, 6.4, [-0.06, 0.4, 1])]]},
  {ini: T.nasceu, chaves: [[T.nasceu, E(soma(ZUM, [-2.4, 1.0, -0.2]), 5.6, 4.4, [0.06, 0.3, 1])], [T.crianca, E(soma(ZUM, [0, 1.1, -0.4]), 8.4, 6.2, [0.03, 0.32, 1])], [T.francisco, E(soma(ZUM, [2.4, 1.0, 0.2]), 5.6, 4.4, [-0.06, 0.3, 1])], [T.fugiu, E(soma(ZUM, [0, 1.1, -0.4]), 8.4, 6.2, [0.02, 0.32, 1])], [T.guerreiro, E(soma(ZUM, [-2.4, 1.1, 0.2]), 5.6, 4.4, [0.05, 0.3, 1])], [T.a1678 - 0.1, E(soma(ZUM, [-2.4, 1.1, 0.2]), 5.4, 4.2, [0.07, 0.3, 1])]]},
  {ini: T.a1678, chaves: [[T.a1678, E(soma(ACO, [0, 1.2, -0.6]), 8.0, 6.0, [0.04, 0.34, 1])], [T.imagina, E(soma(ACO, [0, 0.9, 1.4]), 4.6, 3.8, [0.03, 0.3, 1])], [T.aceitou, E(soma(ACO, [-1.0, 1.1, 0.4]), 6.6, 5.0, [0.06, 0.32, 1])], [T.nao, E(soma(ACO, [1.2, 1.1, 0.4]), 6.0, 4.6, [-0.06, 0.32, 1])], [T.dividiu, E(soma(ACO, [0, 1.2, 0.4]), 8.6, 6.2, [0.02, 0.36, 1])], [T.guerra - 0.1, E(soma(ACO, [0, 1.2, 0.4]), 8.8, 6.4, [-0.02, 0.36, 1])]]},
  {ini: T.guerra, chaves: [[T.guerra, E(soma(GUE, [0, 1.2, -0.2]), 8.6, 6.6, [0.04, 0.5, 1])], [T.a1694, E(soma(GUE, [0, 1.0, 0.2]), 7.6, 5.8, [0.05, 0.46, 1])], [T.ferido, E(soma(GUE, [0, 1.0, 0]), 7.4, 5.6, [-0.04, 0.42, 1])], [T.morte, E(soma(GUE, [1.4, 1.0, 1.2]), 5.4, 4.2, [-0.05, 0.3, 1])], [T.depois - 0.1, E(soma(GUE, [1.4, 1.0, 1.2]), 5.2, 4.0, [-0.07, 0.3, 1])]]},
  {ini: T.depois, chaves: [[T.depois, E(soma(MEM, [-0.6, 1.1, 0.4]), 8.4, 6.2, [0.04, 0.34, 1])], [T.maio, E(soma(MEM, [-0.2, 1.1, -0.6]), 8.2, 6.2, [0.02, 0.32, 1])], [T.cresceu, E(soma(MEM, [0, 1.0, 1.4]), 8.4, 6.2, [0.03, 0.4, 1])], [T.a2023, E(soma(MEM, [0.6, 1.0, 1.8]), 8.0, 6.0, [-0.05, 0.4, 1])], [T.ultima - 0.1, E(soma(MEM, [0.6, 1.0, 1.8]), 8.2, 6.2, [-0.06, 0.4, 1])]]},
  {ini: T.ultima, chaves: [[T.ultima, E(soma(FEC, [-0.8, 1.0, 0.6]), 5.8, 4.6, [0.06, 0.32, 1])], [T.certa, E(soma(FEC, [0.6, 1.2, 0]), 8.0, 6.0, [0.02, 0.34, 1])], [T.racismo, E(soma(FEC, [1.4, 1.1, 0.6]), 7.0, 5.4, [-0.04, 0.34, 1])], [T.aprendeu - 0.1, E(soma(FEC, [1.4, 1.1, 0.6]), 7.2, 5.6, [-0.05, 0.34, 1])]]},
  {ini: T.aprendeu, chaves: [[T.aprendeu, E(soma(ABRE, [0.2, 1.3, -0.2]), 8.0, 6.0, [0.04, 0.36, 1])], [FIM, E(soma(ABRE, [0.2, 1.4, -0.2]), 9.4, 7.0, [0, 0.4, 1])]]},
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
  {a: T.zumbi, b: T.colonia, p: soma(ABRE, [0.2, 1.6, 1.4]), texto: 'ZUMBI', acento: true},
  {a: T.portugal, b: T.navios, p: soma(COL, [0.6, 1.6, -3.0]), texto: 'NAVIO DE PORTUGAL', acento: true},
  {a: T.navios, b: T.quilombo, p: soma(COL, [-0.4, 1.6, -3.0]), texto: 'NAVIO'},
  {a: T.cana, b: T.escravizadas, p: soma(COL, [2.05, 1.7, 1.2]), texto: 'CANA'},
  {a: T.escravizadas + 0.6, b: T.quilombo, p: soma(COL, [0, 1.3, 0.6]), texto: 'ESCRAVIZADOS', acento: true},
  {a: T.mata, b: T.maior, p: soma(QUI, [-1.4, 2.0, -2.2]), texto: 'MATA'},
  {a: T.isso + 0.4, b: T.maior, p: soma(QUI, [1.3, 1.4, -0.1]), texto: 'QUILOMBO', acento: true},
  {a: T.serra, b: T.nasceu, p: soma(PAL, [-2.4, 1.2, -0.8]), texto: 'SERRA DA BARRIGA'},
  {a: T.vilas + 0.4, b: T.nasceu, p: soma(PAL, [1.8, 1.4, -0.4]), texto: 'MOCAMBOS'},
  {a: T.roca, b: T.nasceu, p: soma(PAL, [2.5, 0.7, 0.8]), texto: 'ROÇAS'},
  {a: T.rei, b: T.nasceu, p: soma(PAL, [0.2, 1.4, 0]), texto: 'REI', acento: true},
  {a: T.nasceu, b: T.fugiu, p: soma(ZUM, [-3.0, 1.6, -1.2]), texto: 'PALMARES'},
  {a: T.padre, b: T.a1678, p: soma(ZUM, [2.8, 2.4, -1.4]), texto: 'PORTO CALVO'},
  {a: T.francisco, b: T.fugiu, p: soma(ZUM, [2.2, 1.2, 0.4]), texto: 'FRANCISCO'},
  {a: T.guerreiro, b: T.a1678, p: soma(ZUM, [-0.4, 1.4, 0.4]), texto: 'ZUMBI', acento: true},
  {a: T.ganga, b: T.guerra, p: soma(ACO, [-1.8, 1.4, 0.6]), texto: 'GANGA ZUMBA'},
  {a: T.nao, b: T.guerra, p: soma(ACO, [1.8, 1.4, 0.6]), texto: 'ZUMBI', acento: true},
  {a: T.imagina + 0.3, b: T.aceitou, p: soma(ACO, [-0.5, 1.1, 1.6]), texto: 'LIVRE'},
  {a: T.vizinho + 0.3, b: T.aceitou, p: soma(ACO, [0.5, 1.1, 1.6]), texto: 'PRESO', acento: true},
  {a: T.a1694 + 0.3, b: T.morte, p: soma(GUE, [0, 1.4, -0.4]), texto: 'MACACO', acento: true},
  {a: T.bandeirante + 0.6, b: T.a1694, p: soma(GUE, [0, 1.3, 2.2]), texto: 'TROPAS DO BANDEIRANTE'},
  {a: T.a1996 + 0.4, b: T.ultima, p: soma(MEM, [-0.7, 1.0, 2.3]), texto: 'HERÓIS DA PÁTRIA'},
  {a: T.livros, b: T.certa, p: soma(FEC, [-1.0, 1.6, 0.4]), texto: 'PAPÉIS DA ÉPOCA'},
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
  mapas: [],
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: T.aprendeu, arroba: T.manda, noMapa: () => false},
  Mundo,
  arrobaFixo: true,
};

export const ZumbiPalmares: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Por que hoje', 'é feriado?', 'Explico fácil'];
export const CapaZumbiPalmares: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="CONSCIÊNCIA NEGRA" />
);
