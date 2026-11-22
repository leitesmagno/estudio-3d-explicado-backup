import React from 'react';
import {Caixa, type V3} from '../../base/pecas';
import {efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {criarQuando, entra, pulso, rampa} from '../../base/tempo';
import {type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {Bateria, Casinha, Engrenagem, PilhaMoedas} from '../../pecas';
import {CapaExplicativa, E, FPS, VideoExplicativo, soma, trechos, vis, type Cena, type Config, type PropsVideo, type Rot, type Txt} from '../comum/Explicativo';
import {Coluna, Fio, Gerador, Inversor, PainelSolar, Senoide, Subestacao, Torre, Turbina} from './pecas';
import {PALAVRAS} from './palavras';

// 234. grid forming não é salvador (19/11/2026). Vídeo técnico de engenharia elétrica, do zero:
// SEM nenhuma marca do perfil (sem série, @, selo, marca d'água nem fecho), pedido de 19/11/2026.
// Estúdio 3D + Kit Mapas (mapa do Brasil de 9,3 a 23,3 s: Kit-Mapas-Animados/src/videos/gridforming-234).
// Fontes: projetos/234.../audio/fontes.md.

const P = '234. grid forming não é salvador';
const AUDIO_SEG = 134.02;
const FIM = AUDIO_SEG + 1.2;
export const QUADROS = Math.round(FIM * FPS);

const quando = criarQuando(PALAVRAS);
const T = {
  abre: 0,
  salvar: quando('vai salvar a rede'),
  mas: quando('Mas será que'),
  hoje: quando('Hoje eu vou'),
  matriz: quando('A nossa matriz'),
  agora: quando('E agora, com as baterias'),
  pergunta: quando('a pergunta é'),
  primeiro: quando('Primeiro, uma coisa'),
  mesmo: quando('usam o mesmo equipamento'),
  cerebro: quando('O que muda é o cérebro'),
  gfl: quando('O grid following segue'),
  mede: quando('Ele mede a tensão'),
  pll: quando('chamado PLL'),
  ritmo: quando('descobre o ritmo'),
  calcula: quando('ele calcula quanta corrente'),
  fonteI: quando('Ele é uma fonte de corrente'),
  semRede: quando('sem uma rede para seguir'),
  gfm: quando('O grid forming faz o contrário'),
  cria: quando('Ele mesmo cria a tensão'),
  gerador: quando('como um gerador síncrono'),
  inercia: quando('Por isso consegue dar inércia'),
  fraca: quando('segurar uma rede fraca'),
  religar: quando('religar o sistema'),
  ilhado: quando('funcionar ilhado'),
  proximo: quando('Existem vários jeitos'),
  ninguem: quando('Agora, o que ninguém fala'),
  instavel: quando('pode ficar instável em rede forte'),
  subest: quando('Perto de uma subestação'),
  curta: quando('tão curta que'),
  variacao: quando('vira uma variação enorme'),
  oscilar: quando('começar a oscilar'),
  espelho: quando('É o espelho do'),
  umSofre: quando('um sofre em rede fraca'),
  curto: quando('Segundo: o curto-circuito'),
  gerAguenta: quando('Um gerador aguenta'),
  inversor: quando('O inversor, só um pouco'),
  limitar: quando('precisa limitar a corrente'),
  deixa: quando('Nesse momento, ele deixa'),
  sincronismo: quando('perder o sincronismo'),
  terceiro: quando('Terceiro: para dar inércia'),
  guardada: quando('ter energia guardada'),
  solar: quando('Na usina solar sem bateria'),
  abaixo: quando('gerar abaixo do máximo'),
  mesa: quando('deixar energia na mesa'),
  bateria: quando('Na bateria, significa'),
  maior: quando('comprar um equipamento maior'),
  fim: quando('Grid forming é importante'),
  magica: quando('não é mágica'),
  nova: quando('É uma tecnologia nova'),
  caminho: quando('O caminho é usar'),
  comenta: quando('Comenta aí'),
};
const MAPA: [number, number] = [9.3, 23.3];

const ESTADOS: [number, string][] = [
  [0, 'O QUE TODO MUNDO DIZ'],
  [T.matriz, 'A MATRIZ MUDOU'],
  [T.agora, 'AS BATERIAS CHEGARAM'],
  [T.primeiro, 'MESMO EQUIPAMENTO'],
  [T.gfl, 'GRID FOLLOWING'],
  [T.gfm, 'GRID FORMING'],
  [T.ninguem, 'PONTO FRACO 1 · REDE FORTE'],
  [T.curto, 'PONTO FRACO 2 · CURTO-CIRCUITO'],
  [T.terceiro, 'PONTO FRACO 3 · ENERGIA GUARDADA'],
  [T.fim, 'CADA UM NO SEU LUGAR'],
];

const ABRE: V3 = [0, 0, 0];
const BAT: V3 = [14, 0, 0];
const COMUM: V3 = [28, 0, 0];
const GFL: V3 = [42, 0, 0];
const GFM: V3 = [56, 0, 0];
const FORTE: V3 = [70, 0, 0];
const CURTO: V3 = [84, 0, 0];
const ENERG: V3 = [98, 0, 0];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const festa = tema.festa!;
  const azul = mistura(festa.azul, tema.objeto, 0.15); // grid following
  const laranja = tema.acento; // grid forming
  const fio = mistura(tema.objeto, tema.objetoEscuro, 0.5);

  const abK = entra(t, 0, 0.6) * (1 - rampa(t, T.agora - 0.3, T.agora)) + entra(t, T.fim - 0.3, 0.6);
  const abertura = t < T.agora;
  const batK = vis(t, T.agora - 0.3, T.primeiro);
  const comK = vis(t, T.primeiro - 0.3, T.gfl);
  const gflK = vis(t, T.gfl - 0.3, T.gfm);
  const gfmK = vis(t, T.gfm - 0.3, T.ninguem);
  const forK = vis(t, T.ninguem - 0.3, T.curto);
  const curK = vis(t, T.curto - 0.3, T.terceiro);
  const eneK = vis(t, T.terceiro - 0.3, T.fim);

  // rede forte: a potência oscila cada vez mais depois de "variação enorme" e acalma no "espelho"
  const amp = rampa(t, T.variacao, T.oscilar + 0.6) * (1 - 0.7 * rampa(t, T.espelho, T.espelho + 1));
  const osc = 1.3 + amp * 0.9 * Math.sin(t * 7.5);
  // curto: gerador sobe até 6x; inversor bate no teto de ~1,2x
  const ger = 6 * rampa(t, T.gerAguenta + 0.3, T.gerAguenta + 1.6);
  const inv = Math.min(1.2, 6 * rampa(t, T.inversor + 0.2, T.inversor + 1.6));
  const desync = rampa(t, T.sincronismo, T.sincronismo + 0.8);

  return (
    <group>
      {/* abertura e fecho: o grid forming no pedestal (o "salvador") ao lado do following */}
      {abK > 0.02 ? (
        <group>
          <Caixa args={[2.2, 0.4 * Math.min(1, abK), 2.2]} raio={0.08} cor={mistura(tema.objeto, tema.objetoEscuro, 0.4)} position={soma(ABRE, [abertura ? 0 : 1.6, 0.2, -0.4])} />
          <Inversor tema={tema} pos={soma(ABRE, [abertura ? 0 : 1.6, 0.4, -0.4])} escala={1.25 * Math.min(1, abK)} cor={laranja} cerebro={abertura ? 0.4 + 0.6 * pulso(t, T.salvar, 1.6) : 1} tela={0.8} />
          {abertura ? null : <Inversor tema={tema} pos={soma(ABRE, [-1.6, 0, -0.4])} escala={1.25 * entra(t, T.fim, 0.6)} cor={azul} cerebro={1} tela={0.8} />}
          {abertura ? null : <Torre tema={tema} pos={soma(ABRE, [-3.6, 0, -1.6])} escala={0.9 * entra(t, T.caminho, 0.6)} />}
          {abertura ? null : <Casinha tema={tema} pos={soma(ABRE, [3.8, 0, -1.4])} cor={mistura(festa.verde, tema.objeto, 0.4)} escala={0.9 * entra(t, T.caminho + 0.3, 0.6)} />}
          {abertura ? <Senoide pos={soma(ABRE, [0, 3.4, -0.4])} larg={3.4} amp={0.3} fase={t * 3} cor={laranja} k={entra(t, 0.4, 1.2) * (1 - 0.6 * rampa(t, T.mas, T.mas + 0.6))} /> : null}
        </group>
      ) : null}

      {/* depois do mapa: as baterias chegam ao sistema e a pergunta fica no ar */}
      {batK > 0.02 ? (
        <group>
          {[0, 1, 2, 3].map((i) => (
            <Caixa key={i} args={[1.1, 1.0, 2.2]} raio={0.06} cor={mistura(tema.objetoClaro, festa.verde, 0.25)} position={soma(BAT, [-2.4 + 1.3 * i, 0.5 * entra(t, T.agora + 0.15 * i, 0.5), -0.6])} scale={[1, Math.max(0.02, entra(t, T.agora + 0.15 * i, 0.5)), 1]} />
          ))}
          <Bateria tema={tema} pos={soma(BAT, [-0.45, 2.2, -0.6])} escala={2.4 * batK * entra(t, T.agora + 0.6, 0.5)} nivel={0.3 + 0.6 * rampa(t, T.agora + 0.8, T.pergunta)} />
          <Inversor tema={tema} pos={soma(BAT, [3.2, 0, -0.2])} escala={0.95 * batK * entra(t, T.pergunta - 0.3, 0.5)} cor={tema.objetoClaro} cerebro={0.6 * pulso(t, T.pergunta + 0.6, 1.4)} />
        </group>
      ) : null}

      {/* mesmo equipamento: dois armários iguais; só o cérebro muda de cor */}
      {comK > 0.02 ? (
        <group>
          <Inversor tema={tema} pos={soma(COMUM, [-1.6, 0, -0.4])} escala={1.25 * comK} cor={azul} cerebro={rampa(t, T.cerebro, T.cerebro + 0.6)} tela={0.5} />
          <Inversor tema={tema} pos={soma(COMUM, [1.6, 0, -0.4])} escala={1.25 * comK} cor={laranja} cerebro={rampa(t, T.cerebro + 0.3, T.cerebro + 0.9)} tela={0.5} />
        </group>
      ) : null}

      {/* grid following: lê a onda da rede, o PLL acerta o ritmo, injeta corrente; sem rede, fica sem referência */}
      {gflK > 0.02 ? (
        <group>
          <Inversor tema={tema} pos={soma(GFL, [-2.2, 0, -0.2])} escala={1.15 * gflK} cor={azul} cerebro={1 - 0.8 * rampa(t, T.semRede + 0.4, T.semRede + 1.2)} tela={0.6} />
          <Torre tema={tema} pos={soma(GFL, [2.0, 0, -0.6])} escala={gflK * (1 - rampa(t, T.semRede, T.semRede + 0.8))} />
          <Senoide pos={soma(GFL, [0.2, 3.5, -0.6])} larg={2.6} amp={0.28} fase={t * 3} cor={tema.objetoClaro} k={entra(t, T.mede, 1.0) * (1 - rampa(t, T.semRede, T.semRede + 0.8))} />
          <Engrenagem tema={tema} pos={soma(GFL, [-2.2, 3.0, -0.2])} r={0.38} giro={t * 1.6} cor={azul} escala={gflK * entra(t, T.pll, 0.5) * (1 - rampa(t, T.semRede + 0.4, T.semRede + 1.0))} />
          <Fio a={soma(GFL, [-1.6, 1.2, -0.2])} b={soma(GFL, [1.4, 2.7, -0.6])} cor={fio} k={gflK * entra(t, T.mede - 0.2, 0.6) * (1 - rampa(t, T.semRede, T.semRede + 0.8))} u={t > T.calcula ? (t - T.calcula) * 0.7 : undefined} bolinha={azul} />
        </group>
      ) : null}

      {/* grid forming: cria a própria onda; como um gerador síncrono; inércia, rede fraca, religar, ilhado */}
      {gfmK > 0.02 ? (
        <group>
          <Inversor tema={tema} pos={soma(GFM, [-1.4, 0, -0.2])} escala={1.15 * gfmK} cor={laranja} cerebro={1} tela={0.8} />
          <Senoide pos={soma(GFM, [-1.4, 3.2, -0.2])} larg={3.0} amp={0.32} fase={t * 3} cor={laranja} k={entra(t, T.cria, 1.2)} />
          <Gerador tema={tema} pos={soma(GFM, [2.0, 0, -0.4])} escala={1.2 * gfmK * entra(t, T.gerador - 0.2, 0.6)} giro={t * 2} rotY={-0.3} />
          <Casinha tema={tema} pos={soma(GFM, [2.4, 0, 2.2])} cor={mistura(festa.verde, tema.objeto, 0.4)} escala={0.7 * gfmK * entra(t, T.ilhado, 0.5)} />
        </group>
      ) : null}

      {/* ponto fraco 1: rede forte. Ligação curtinha com a subestação, a potência balança */}
      {forK > 0.02 ? (
        <group>
          <Subestacao tema={tema} pos={soma(FORTE, [1.6, 0, -1.2])} escala={1.0 * forK * entra(t, T.subest - 0.2, 0.6)} luz={pulso(t, T.subest + 0.4, 1.2)} />
          <Inversor tema={tema} pos={soma(FORTE, [-2.4, 0, 0.4])} escala={1.0 * forK} cor={laranja} cerebro={1} tela={0.8} />
          <Fio a={soma(FORTE, [-1.9, 1.3, 0.4])} b={soma(FORTE, [-0.6, 1.3, 0.4])} cor={laranja} esp={0.09} k={forK * entra(t, T.curta - 0.2, 0.5)} />
          <Coluna pos={soma(FORTE, [-4.0, 0, 0.4])} alt={t > T.variacao ? osc : 1.3 * entra(t, T.curta, 0.6)} larg={0.6} cor={laranja} emissivo={0.25 * amp} />
        </group>
      ) : null}

      {/* ponto fraco 2: curto-circuito. Gerador 5 a 7x; inversor ~1,2x; tampa do limite; perde o passo */}
      {curK > 0.02 ? (
        <group>
          <Gerador tema={tema} pos={soma(CURTO, [-2.8, 0, -1.0])} escala={0.9 * curK} giro={t * 2} />
          <Inversor tema={tema} pos={soma(CURTO, [2.8, 0, -1.0])} escala={0.8 * curK} cor={laranja} cerebro={1} tela={0.6} />
          <Coluna pos={soma(CURTO, [-1.0, 0, -0.6])} alt={0.45 * ger * curK} cor={mistura(tema.objetoClaro, tema.objeto, 0.3)} />
          <Coluna pos={soma(CURTO, [1.0, 0, -0.6])} alt={0.45 * inv * curK} cor={laranja} emissivo={0.2 * pulso(t, T.limitar, 1.2)} />
          <Caixa args={[1.3, 0.08, 1.3]} raio={0.03} cor={tema.objetoEscuro} position={soma(CURTO, [1.0, 0.45 * 1.2 + 0.05, -0.6])} scale={Math.max(0.02, entra(t, T.limitar, 0.5))} />
          <Engrenagem tema={tema} pos={soma(CURTO, [-0.6, 3.9, -1.6])} r={0.4} giro={t * 1.6} escala={curK * entra(t, T.deixa, 0.5)} />
          <Engrenagem tema={tema} pos={soma(CURTO, [0.6, 3.9 - 0.5 * desync, -1.6])} r={0.4} giro={-t * 1.6 + 0.4 + desync * t * 2.5} cor={laranja} escala={curK * entra(t, T.deixa + 0.2, 0.5)} />
        </group>
      ) : null}

      {/* ponto fraco 3: energia guardada. Solar gerando abaixo do máximo; bateria ciclando; equipamento maior e custo */}
      {eneK > 0.02 ? (
        <group>
          {[0, 1, 2].map((i) => (
            <PainelSolar key={i} tema={tema} pos={soma(ENERG, [-3.0 + 1.6 * i, 0, -0.8])} escala={1.0 * eneK * entra(t, T.solar - 0.2 + 0.15 * i, 0.5)} cor={azul} apaga={rampa(t, T.abaixo, T.mesa)} />
          ))}
          <Turbina tema={tema} pos={soma(ENERG, [-0.2, 0, -3.4])} escala={0.75 * eneK} giro={t * 1.4} />
          <Bateria tema={tema} pos={soma(ENERG, [2.6, 1.4, -0.4])} escala={2.6 * eneK * entra(t, T.guardada, 0.5) * (1 + 0.25 * rampa(t, T.maior, T.maior + 0.8))} nivel={t > T.bateria ? 0.5 + 0.45 * Math.sin((t - T.bateria) * 3) : 0.85} />
          <PilhaMoedas tema={tema} pos={soma(ENERG, [3.4, 0.02, 1.2])} n={Math.max(1, Math.round(7 * rampa(t, T.maior, T.maior + 1.0)))} cor={festa.dourado} r={0.28} escala={eneK * entra(t, T.maior, 0.4)} />
        </group>
      ) : null}
    </group>
  );
};

const CENAS: Cena[] = [
  {ini: 0, chaves: [[0, E(soma(ABRE, [0, 1.8, -0.4]), 6.6, 5.6, [0.05, 0.3, 1])], [T.mas, E(soma(ABRE, [0, 1.8, -0.4]), 7.6, 6.2, [-0.05, 0.32, 1])], [T.agora - 0.1, E(soma(ABRE, [0, 1.8, -0.4]), 8.0, 6.4, [-0.08, 0.32, 1])]]},
  {ini: T.agora, chaves: [[T.agora, E(soma(BAT, [-0.4, 1.4, -0.4]), 8.4, 6.0, [0.06, 0.32, 1])], [T.pergunta, E(soma(BAT, [0.6, 1.4, -0.3]), 8.4, 6.0, [-0.05, 0.3, 1])], [T.primeiro - 0.1, E(soma(BAT, [0.6, 1.4, -0.3]), 8.2, 5.8, [-0.07, 0.3, 1])]]},
  {ini: T.primeiro, chaves: [[T.primeiro, E(soma(COMUM, [0, 1.4, -0.4]), 7.6, 5.8, [0.05, 0.3, 1])], [T.cerebro, E(soma(COMUM, [0, 2.2, -0.4]), 6.2, 4.6, [0.02, 0.42, 1])], [T.gfl - 0.1, E(soma(COMUM, [0, 2.2, -0.4]), 6.0, 4.4, [-0.03, 0.42, 1])]]},
  {ini: T.gfl, chaves: [[T.gfl, E(soma(GFL, [0, 1.6, -0.4]), 8.2, 6.2, [0.06, 0.3, 1])], [T.pll, E(soma(GFL, [-1.6, 2.4, -0.2]), 5.8, 4.6, [0.06, 0.3, 1])], [T.calcula, E(soma(GFL, [0.2, 1.8, -0.4]), 7.6, 5.8, [-0.03, 0.3, 1])], [T.semRede, E(soma(GFL, [-1.0, 1.6, -0.2]), 7.0, 5.4, [0.04, 0.3, 1])], [T.gfm - 0.1, E(soma(GFL, [-1.6, 1.6, -0.2]), 6.4, 5.0, [0.06, 0.3, 1])]]},
  {ini: T.gfm, chaves: [[T.gfm, E(soma(GFM, [-1.2, 1.8, -0.2]), 6.6, 5.4, [0.06, 0.3, 1])], [T.gerador, E(soma(GFM, [0.4, 1.6, -0.2]), 7.8, 5.8, [-0.04, 0.3, 1])], [T.ilhado, E(soma(GFM, [0.6, 1.6, 0.6]), 8.2, 6.2, [-0.05, 0.32, 1])], [T.ninguem - 0.1, E(soma(GFM, [0.4, 1.6, 0.4]), 8.0, 6.0, [-0.07, 0.32, 1])]]},
  {ini: T.ninguem, chaves: [[T.ninguem, E(soma(FORTE, [0, 1.6, -0.4]), 8.4, 6.2, [0.05, 0.32, 1])], [T.curta, E(soma(FORTE, [-1.6, 1.4, 0.2]), 7.0, 5.2, [0.07, 0.3, 1])], [T.variacao, E(soma(FORTE, [-2.2, 1.6, 0.2]), 7.2, 5.6, [0.05, 0.3, 1])], [T.espelho, E(soma(FORTE, [-0.6, 1.6, 0]), 8.0, 6.0, [-0.03, 0.32, 1])], [T.curto - 0.1, E(soma(FORTE, [-0.4, 1.6, 0]), 8.0, 6.0, [-0.05, 0.32, 1])]]},
  {ini: T.curto, chaves: [[T.curto, E(soma(CURTO, [0, 1.6, -0.8]), 8.6, 6.4, [0.05, 0.3, 1])], [T.gerAguenta, E(soma(CURTO, [0, 1.8, -0.8]), 8.4, 6.6, [0.03, 0.28, 1])], [T.limitar, E(soma(CURTO, [0.8, 1.4, -0.8]), 7.2, 5.6, [-0.05, 0.3, 1])], [T.deixa, E(soma(CURTO, [0, 2.6, -1.2]), 8.0, 6.4, [0.02, 0.3, 1])], [T.terceiro - 0.1, E(soma(CURTO, [0, 2.6, -1.2]), 7.8, 6.2, [-0.03, 0.3, 1])]]},
  {ini: T.terceiro, chaves: [[T.terceiro, E(soma(ENERG, [0, 1.6, -1.2]), 8.6, 6.6, [0.05, 0.4, 1])], [T.solar, E(soma(ENERG, [-1.4, 1.0, -0.6]), 6.6, 5.0, [0.06, 0.5, 1])], [T.bateria, E(soma(ENERG, [0.8, 1.4, -0.4]), 8.4, 6.0, [-0.06, 0.34, 1])], [T.fim - 0.1, E(soma(ENERG, [0.6, 1.4, -0.4]), 8.6, 6.2, [-0.05, 0.34, 1])]]},
  {ini: T.fim, chaves: [[T.fim, E(soma(ABRE, [0, 1.6, -0.6]), 8.6, 6.4, [0.04, 0.32, 1])], [T.caminho, E(soma(ABRE, [0, 1.6, -0.8]), 9.6, 6.8, [0, 0.32, 1])], [FIM, E(soma(ABRE, [0, 1.6, -0.8]), 10.2, 7.2, [-0.03, 0.34, 1])]]},
];

const CHIPS: Txt[] = [
  {a: 0.3, b: T.mas, texto: 'GRID FORMING: O SALVADOR DA REDE?'},
  {a: T.mas, b: T.matriz, texto: 'O LADO QUE QUASE NINGUÉM CONTA', destaque: true},
  {a: T.agora, b: T.pergunta, texto: 'AS BATERIAS ESTÃO CHEGANDO'},
  {a: T.pergunta, b: T.primeiro, texto: 'COMO O INVERSOR DEVE SE COMPORTAR?', destaque: true},
  {a: T.mesmo, b: T.cerebro, texto: 'MESMA ELETRÔNICA, MESMO FILTRO'},
  {a: T.cerebro, b: T.gfl, texto: 'MUDA SÓ O CONTROLE', destaque: true},
  {a: T.gfl, b: T.pll, texto: 'GRID FOLLOWING: SEGUE A REDE'},
  {a: T.pll, b: T.calcula, texto: 'PLL: ACHA O ÂNGULO E A FREQUÊNCIA'},
  {a: T.calcula, b: T.fonteI, texto: 'CORRENTE CERTA PARA P E Q'},
  {a: T.fonteI, b: T.semRede, texto: 'É UMA FONTE DE CORRENTE', destaque: true},
  {a: T.semRede, b: T.gfm, texto: 'SEM REDE, SEM REFERÊNCIA'},
  {a: T.gfm, b: T.cria, texto: 'GRID FORMING: FORMA A REDE'},
  {a: T.cria, b: T.gerador, texto: 'CRIA A TENSÃO: TAMANHO E ÂNGULO', destaque: true},
  {a: T.gerador, b: T.inercia, texto: 'AGE COMO UM GERADOR SÍNCRONO'},
  {a: T.inercia, b: T.proximo, texto: 'INÉRCIA · REDE FRACA · RELIGAR · ILHADO'},
  {a: T.proximo, b: T.ninguem, texto: 'OS TIPOS DE GRID FORMING: PRÓXIMO VÍDEO'},
  {a: T.ninguem, b: T.subest, texto: 'O QUE NINGUÉM FALA', destaque: true},
  {a: T.subest, b: T.variacao, texto: 'REDE FORTE: LIGAÇÃO MUITO CURTA'},
  {a: T.variacao, b: T.espelho, texto: 'ÂNGULO MÍNIMO = POTÊNCIA ENORME', destaque: true},
  {a: T.espelho, b: T.curto, texto: 'FOLLOWING SOFRE NA FRACA · FORMING NA FORTE'},
  {a: T.curto, b: T.inversor, texto: 'GERADOR: 5 A 7 VEZES A CORRENTE'},
  {a: T.inversor, b: T.limitar, texto: 'INVERSOR: SÓ UM POUCO ACIMA', destaque: true},
  {a: T.limitar, b: T.deixa, texto: 'O CONTROLE LIMITA A CORRENTE'},
  {a: T.deixa, b: T.terceiro, texto: 'PODE PERDER O SINCRONISMO', destaque: true},
  {a: T.terceiro, b: T.solar, texto: 'INÉRCIA PRECISA DE RESERVA'},
  {a: T.solar, b: T.bateria, texto: 'SOLAR SEM BATERIA: GERAR MENOS', destaque: true},
  {a: T.bateria, b: T.fim, texto: 'BATERIA: CICLA MAIS E CUSTA MAIS'},
  {a: T.fim, b: T.nova, texto: 'IMPORTANTE, MAS NÃO É MÁGICA'},
  {a: T.nova, b: T.caminho, texto: 'TECNOLOGIA NOVA, RISCOS EM ESTUDO'},
  {a: T.caminho, b: T.comenta, texto: 'CADA UM NO LUGAR CERTO', destaque: true},
  {a: T.comenta, b: FIM + 1, texto: 'JÁ VIU GRID FORMING EM CAMPO? COMENTA'},
];
const SELOS: Txt[] = []; // fontes vão na legenda e no fontes.md
const ROTULOS: Rot[] = [
  {a: T.salvar, b: T.agora, p: soma(ABRE, [0, 3.0, -0.4]), texto: 'GRID FORMING', acento: true},
  {a: T.pergunta, b: T.primeiro, p: soma(BAT, [3.2, 2.4, -0.2]), texto: 'FOLLOWING OU FORMING?', acento: true},
  {a: T.agora + 0.6, b: T.primeiro, p: soma(BAT, [-0.6, 2.4, -0.6]), texto: 'BATERIAS'},
  {a: T.mesmo, b: T.gfl, p: soma(COMUM, [-1.6, 3.0, -0.4]), texto: 'FOLLOWING'},
  {a: T.mesmo + 0.3, b: T.gfl, p: soma(COMUM, [1.6, 3.0, -0.4]), texto: 'FORMING', acento: true},
  {a: T.pll, b: T.semRede, p: soma(GFL, [-2.2, 3.7, -0.2]), texto: 'PLL', acento: true},
  {a: T.mede, b: T.semRede, p: soma(GFL, [2.0, 3.6, -0.6]), texto: 'A REDE'},
  {a: T.fonteI, b: T.gfm, p: soma(GFL, [-2.2, 0.6, 1.2]), texto: 'FONTE DE CORRENTE'},
  {a: T.semRede + 0.8, b: T.gfm, p: soma(GFL, [-2.2, 3.2, -0.2]), texto: 'E AGORA?', acento: true},
  {a: T.cria, b: T.ninguem, p: soma(GFM, [-1.4, 4.0, -0.2]), texto: 'FONTE DE TENSÃO', acento: true},
  {a: T.gerador, b: T.ninguem, p: soma(GFM, [2.0, 2.2, -0.4]), texto: 'GERADOR SÍNCRONO'},
  {a: T.ilhado, b: T.ninguem, p: soma(GFM, [2.4, 1.4, 2.2]), texto: 'ILHADO'},
  {a: T.subest, b: T.curto, p: soma(FORTE, [1.6, 2.9, -1.2]), texto: 'SUBESTAÇÃO ROBUSTA'},
  {a: T.curta, b: T.espelho, p: soma(FORTE, [-1.2, 1.9, 0.4]), texto: 'LIGAÇÃO CURTA', acento: true},
  {a: T.variacao, b: T.curto, p: soma(FORTE, [-4.0, 3.0, 0.4]), texto: 'POTÊNCIA OSCILANDO', acento: true},
  {a: T.gerAguenta + 0.6, b: T.terceiro, p: soma(CURTO, [-1.0, 3.0, -0.6]), texto: 'GERADOR: ATÉ 7×'},
  {a: T.inversor + 0.6, b: T.terceiro, p: soma(CURTO, [1.0, 1.0, -0.6]), texto: 'INVERSOR: ~1,2×', acento: true},
  {a: T.sincronismo, b: T.terceiro, p: soma(CURTO, [0, 4.8, -1.6]), texto: 'FORA DE SINCRONISMO', acento: true},
  {a: T.mesa, b: T.fim, p: soma(ENERG, [-1.4, 1.8, -0.8]), texto: 'ENERGIA NA MESA', acento: true},
  {a: T.bateria, b: T.fim, p: soma(ENERG, [2.6, 2.4, -0.4]), texto: 'MAIS CICLOS'},
  {a: T.maior, b: T.fim, p: soma(ENERG, [3.4, 1.4, 1.2]), texto: 'MAIS CUSTO', acento: true},
  {a: T.caminho, b: FIM + 1, p: soma(ABRE, [-1.6, 3.0, -0.4]), texto: 'REDE FORTE: FOLLOWING'},
  {a: T.caminho + 0.4, b: FIM + 1, p: soma(ABRE, [1.6, 3.4, -0.4]), texto: 'REDE FRACA: FORMING', acento: true},
];

type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  [T.matriz, T.agora, T.primeiro, T.gfl, T.gfm, T.ninguem, T.curto, T.terceiro, T.fim].forEach((t) => s.push({t: t - 0.1, f: 'whoosh', v: 0.18}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t: t + 0.05, f: 'tique', v: 0.12}));
  s.push({t: T.mas, f: 'baque', v: 0.14});
  s.push({t: T.cerebro + 0.2, f: 'ding', v: 0.14});
  s.push({t: T.pll, f: 'bip', v: 0.12});
  s.push({t: T.cria + 0.2, f: 'subida', v: 0.14});
  [T.inercia, T.fraca, T.religar, T.ilhado].forEach((t) => s.push({t, f: 'pop', v: 0.12}));
  s.push({t: T.oscilar, f: 'baque', v: 0.15});
  s.push({t: T.gerAguenta + 0.3, f: 'subida', v: 0.14});
  s.push({t: T.limitar + 0.1, f: 'impacto', v: 0.14});
  s.push({t: T.sincronismo, f: 'baque', v: 0.14});
  s.push({t: T.mesa, f: 'pop', v: 0.13});
  s.push({t: T.caminho, f: 'ding', v: 0.18});
  return s.filter((x) => x.t >= 0).sort((a, b) => a.t - b.t);
})();
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [
  1.0, T.salvar + 0.8, T.mas + 1.0, 10.5, 12.5, 16.0, 20.0, 22.6, T.agora + 1.2, T.pergunta + 1.0,
  T.mesmo + 1.0, T.cerebro + 1.2, T.gfl + 1.2, T.pll + 1.0, T.calcula + 1.2, T.fonteI + 0.8, T.semRede + 1.4,
  T.cria + 1.4, T.gerador + 1.0, T.inercia + 1.0, T.ilhado + 0.8, T.proximo + 1.0,
  T.ninguem + 1.0, T.subest + 1.2, T.variacao + 1.0, T.oscilar + 0.6, T.espelho + 1.4,
  T.curto + 1.0, T.gerAguenta + 1.8, T.inversor + 1.8, T.limitar + 0.8, T.sincronismo + 1.0,
  T.terceiro + 1.0, T.solar + 1.0, T.mesa + 0.6, T.bateria + 1.0, T.maior + 1.0,
  T.fim + 1.0, T.nova + 1.0, T.caminho + 1.2, T.comenta + 1.0, FIM - 0.4,
];

const CONFIG: Config = {
  pasta: P,
  assunto: '',
  palavras: PALAVRAS,
  cenas: CENAS,
  fim: FIM,
  estados: ESTADOS,
  mapas: trechos([MAPA]),
  interface: {chips: CHIPS, selos: SELOS, rotulos: ROTULOS, segue: FIM + 10, arroba: FIM + 10, noMapa: (t) => t >= MAPA[0] && t < MAPA[1], semFecho: true},
  Mundo,
  semMarca: true,
};

export const GridForming: React.FC<PropsVideo> = (p) => <VideoExplicativo {...p} faixas={p.faixas ?? FAIXAS} c={CONFIG} />;

export const TITULO_CAPA = ['Grid forming', 'não é', 'salvador'];
export const CapaGridForming: React.FC<{estilo?: string; linhas?: string[]}> = ({estilo, linhas = TITULO_CAPA}) => (
  <CapaExplicativa estilo={estilo} linhas={linhas} fundo={`${P}/capa/fundo-limpo.jpg`} pilula="ENGENHARIA ELÉTRICA" semMarca />
);
