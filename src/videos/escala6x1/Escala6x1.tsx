import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Onda, Palco, Particulas, cinematizar, distancia, focarEm, projetar, trilhoCam, type Cam, type Foco, type V3} from '../../base/pecas';
import {Chip, Contador as ContadorBase, Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {cai, clamp, criarQuando, entra, k01, mola, pulso, rampa, sai, sumir} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {SERIE, temaPorId} from '../../estilo';
import {
  Ampulheta, BarraTurno, Barraquinha, CadeiraPraia, Calendario, Carimbo3D, Contracheque, Cracha, CuboHora, DiaBloco, DiarioOficial, Diploma, DocumentoGrande,
  Escudo, Folha, LinhaChao, LivroLei, Lojinha, MesaCongresso, MesaSancao, MesFolgas, MoedaCor, Onibus, OrgaoPublico, PlacarVotos, PredioColunas, PredioLargo, RelogioPonto, Tracejado,
} from './pecas';
import {PALAVRAS} from './palavras';

// Molde 001. escala 6x1: o vídeo real "Escala 6x1 aprovada" do perfil Explicando Direito, refeito nesta base.
// O Congresso aprovou, mas a semana só muda quando o prazo vencer.
// Mundo único: a semana em 7 blocos com cubinhos de hora, a pilha do salário, a linha do tempo no chão,
// o Congresso ao fundo, a ala dos essenciais à direita, quem fica de fora à esquerda e a rua do pequeno negócio na frente.
// Tudo entra na hora da palavra: tabela T logo abaixo (plano: projetos/001. escala 6x1/plano.md).
// Cores: só do tema (src/estilos/). Som: lista FAIXAS no fim do arquivo (narração + efeitos do Estúdio).

export const FPS = 30;
const AUDIO_SEG = 83.78; // duração medida de projetos/001. escala 6x1/audio/narracao-norm.wav
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '001. escala 6x1'; // pasta do projeto em projetos/

// ---------- Tempo pelas palavras ----------
// quando('trecho') devolve o segundo em que o trecho começa na fala (quando('6x1', 2) = 2ª vez).
const quando = criarQuando(PALAVRAS);

const T = {
  oficial: quando('É oficial'),
  aprovou: quando('Congresso aprovou'),
  fim: quando('fim da escala'),
  seis1: quando('6x1'),
  mas: quando('Mas ela ainda'),
  acabou: quando('acabou'),
  calma: quando('Calma'),
  quarta: quando('quarta'),
  senado: quando('Senado'),
  doisTurnos: quando('dois turnos'),
  mesmoDia: quando('mesmo dia'),
  v75: quando('75'),
  um: quando('1'),
  eComo: quando('E como'),
  constituicao: quando('Constituição'),
  sancao: quando('sanção'),
  presidente: quando('presidente'),
  congresso2: quando('próprio Congresso'),
  promulga: quando('promulga'),
  ai: quando('Aí começa'),
  contagem: quando('contagem'),
  doisMeses: quando('Dois meses'),
  publicada: quando('publicada'),
  doisDiasFolga: quando('dois dias de folga'),
  semana: quando('semana'),
  limite: quando('limite'),
  h44: quando('44'),
  h42: quando('42'),
  m14: quando('14'),
  chega40: quando('chega a 40'),
  semReducao: quando('Sem redução'),
  salario: quando('salário'),
  piso: quando('piso'),
  transicao: quando('Na transição'),
  acordo: quando('acordo coletivo'),
  esticar: quando('esticar'),
  oito: quando('8'),
  fechar: quando('fechar as 42'),
  mas2: quando('Mas as duas'),
  duasFicam: quando('duas folgas ficam'),
  preferencia: quando('preferência'),
  domingo: quando('domingo'),
  quemJa: quando('Quem já trabalha'),
  h40menos: quando('40 horas ou menos'),
  naoPerde: quando('não perde nada'),
  tambemGanha: quando('também ganha'),
  escala12: quando('Escala 12x36'),
  x1236: quando('12x36'),
  essenciais: quando('serviços essenciais'),
  saude: quando('saúde'),
  transporte: quando('transporte'),
  compensar: quando('compensar'),
  desdeQue: quando('Desde que'),
  media: quando('média do mês'),
  duasSemana: quando('duas folgas por semana'),
  servidor: quando('Servidor'),
  empregado: quando('empregado público'),
  deFora: quando('de fora'),
  quemTem: quando('Quem tem diploma'),
  diploma: quando('diploma'),
  r21: quando('R$ 21'),
  controle: quando('controle de horas'),
  mantem: quando('mantém'),
  pequeno: quando('E o pequeno'),
  lei: quando('lei complementar'),
  mei: quando('MEI'),
  micro: quando('micro'),
  pequenas: quando('pequenas empresas'),
  ateLa: quando('Até lá'),
  regra: quando('regra de hoje'),
  soMuda: quando('só muda'),
  prazo: quando('prazo vencer'),
  voce: quando('Você trabalha'),
  seis2: quando('6x1', 2),
  folgaMais: quando('folga a mais'),
  comentarios: quando('comentários'),
  segue: quando('segue'),
  explicando: quando('Explicando Direito'),
};

const ESTADOS: [number, string][] = [
  [0, 'APROVADO'],
  [T.calma, 'SENADO'],
  [T.eComo, 'PROMULGAÇÃO'],
  [T.ai, 'A CONTAGEM'],
  [T.transicao, 'TRANSIÇÃO'],
  [T.quemJa, '40 H OU MENOS'],
  [T.escala12, 'ESSENCIAIS'],
  [T.servidor, 'EXCEÇÕES'],
  [T.pequeno, 'PEQUENO NEGÓCIO'],
  [T.voce, 'E VOCÊ?'],
];

// ---------- Câmera ----------
const FOV = 30;
const pj = (p: V3, cam: Cam) => projetar(p, cam, W, H);
const SOBE = 60;
// Enquadramento deste vídeo (o original; a base tem enquadrar(), com medidas parecidas).
// Enquadra uma caixa (larg × alt) em volta do alvo, olhando na direção `dir`, dentro da faixa útil do Reels.
const enq = (alvo: V3, larg: number, alt: number, dir: V3 = [0, 0.5, 1], folga = 1.08): Cam => {
  const visivel = Math.max(alt / 0.48, larg / 0.47) * folga;
  const d = visivel / (2 * Math.tan((FOV * Math.PI) / 360));
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  return {pos: [alvo[0] + (dir[0] / n) * d, alvo[1] + (dir[1] / n) * d, alvo[2] + (dir[2] / n) * d], alvo, fov: FOV, sobe: SOBE};
};
// Direção pela órbita (graus): `az` 0 = de frente (z+), positivo = pela direita; `el` = ângulo acima do chão.
const D = (az: number, el: number): V3 => {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)];
};
// A câmera nunca para: arco lento e leve subida ao longo da cena.
const vivo = (c: Cam, k: number, sentido = 1) => cinematizar(c, k, {lente: 1, arco: 0.07, grua: 0.025, sentido});

// ---------- Mapa do mundo (plano.md, seção 2) ----------
const DIA = (d: number): V3 => [-3 + d, 0, 0];
const PASSO = 0.22;
const Y_CUBO = (h: number) => 0.15 + 0.11 + h * PASSO;
// Hoje: 8 h de SEG a SEX e 4 h no SÁB = 44 h.
const HORAS = [8, 8, 8, 8, 8, 4];
const CUBOS: {d: number; h: number}[] = HORAS.flatMap((n, d) => Array.from({length: n}, (_, h) => ({d, h})));
const SALARIO: V3 = [4.6, 0, 0];
const N_MOEDAS = 12;
const CONTRACHEQUE: V3 = [6.2, 0, 0.5];
const LT = {x0: -4, x1: 4, z: 3};
const MARCOS_X = [-3.5, -0.5, 3.5];
const fracLT = (x: number) => (x - LT.x0) / (LT.x1 - LT.x0);
const DIARIO: V3 = [-3.5, 0, 3.95];
const ACORDO: V3 = [-5.1, 1.55, 1.3];
const CAMARA: V3 = [-4, 0, -16];
const SENADO: V3 = [4, 0, -16];
const CALENDARIO: V3 = [7.4, 0, -12.2];
const PLACAR: V3 = [3.4, 0, -11.6];
const MESA_SANCAO: V3 = [-4, 0, -11];
const MESA_CONGRESSO: V3 = [0, 0, -13];
const QUARENTA = {boneco: [5.0, 0, 4.0] as V3, centro: [5.9, 0, 5.3] as V3, esc: 0.35, passo: 0.32};
const HOSPITAL: V3 = [10, 0, -2];
const ONIBUS: V3 = [12.6, 0, 2];
const BARRA: V3 = [9.4, 0, 4.2];
const MES: V3 = [13.8, 0, -1.6];
const PUBLICO: V3 = [-11, 0, -2];
const SERVIDOR: V3 = [-10.2, 0, 1.4];
const EMPREGADO: V3 = [-11.6, 0, 1.6];
const PROFISSIONAL: V3 = [-14.6, 0, 2.6];
const RELOGIO: V3 = [-15.9, 0, 1.4];
const MINI_PROF: V3 = [-14.2, 0, 3.7];
const LOJAS: {pos: V3; nome: string}[] = [
  {pos: [-3.2, 0, 9], nome: 'MEI'},
  {pos: [0, 0, 9], nome: 'ME'},
  {pos: [3.2, 0, 9], nome: 'EPP'},
];
const LEI: V3 = [0, 3.0, 7.6];
const AMPULHETA: V3 = [5.3, 0, 8.4];
const miniDia = (c: V3, d: number, passo: number): V3 => [c[0] + (d - 3) * passo, 0, c[2]];
const lerp = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const arco = (a: V3, b: V3, k: number, alt = 1): V3 => {
  const p = lerp(a, b, k);
  return [p[0], p[1] + alt * Math.sin(Math.PI * k), p[2]];
};

// Sábado: tenta acender em "Mas ela ainda" e volta; vira folga em "dois dias de folga";
// volta a ser dia de trabalho em "na 6x1?" e acende de novo em "folga a mais".
const sabado = (t: number) => k01(0.55 * pulso(t, T.mas, 1.5) + rampa(t, T.doisDiasFolga, T.doisDiasFolga + 0.5) - rampa(t, T.seis2, T.seis2 + 0.5) + rampa(t, T.folgaMais, T.folgaMais + 0.5));

// Uma mini-semana (7 blocos pequenos) com o sábado `sab` 0..1 de folga.
const MiniSemana: React.FC<{tema: Tema; c: V3; esc: number; passo: number; k: number; sab: number}> = ({tema, c, esc, passo, k, sab}) =>
  k < 0.02 ? null : (
    <>
      {Array.from({length: 7}).map((_, d) => (
        <DiaBloco key={d} tema={tema} pos={miniDia(c, d, passo)} aceso={1} descanso={d === 6 ? 1 : d === 5 ? sab : 0} escala={esc * k} />
      ))}
    </>
  );

// ---------- O mundo inteiro, animado pelo tempo ----------
const Mundo: React.FC<{tema: Tema; t: number; centro: V3}> = ({tema, t, centro}) => {
  const sab = sabado(t);
  const descanso = (d: number) => (d === 6 ? 1 : d === 5 ? sab : 0);

  // Carimbo APROVADO: desce sobre a semana, encosta e sobe de novo
  const desce = rampa(t, T.aprovou - 0.1, T.aprovou + 0.35, cai);
  const volta = rampa(t, T.aprovou + 0.6, T.aprovou + 1.3, sai);
  const carimbo = sumir(t, T.calma, 0.5);
  const yCarimbo = 0.62 + 3.4 * (1 - desce) + 2.6 * volta;

  // Congresso, votação e promulgação
  const senado = Math.max(0.25, rampa(t, T.senado, T.senado + 0.5), rampa(t, T.congresso2, T.congresso2 + 0.5));
  const camara = Math.max(0.25, rampa(t, T.congresso2, T.congresso2 + 0.5));
  const cal = entra(t, T.quarta - 0.3, 0.5);
  const folhas = 6 + rampa(t, T.quarta, T.quarta + 0.6);
  const docs = entra(t, T.doisTurnos - 0.1, 0.5) * sumir(t, T.eComo, 0.5);
  const giro = rampa(t, T.doisTurnos, T.mesmoDia, Easing.inOut(Easing.quad));
  const pousa = rampa(t, T.mesmoDia, T.mesmoDia + 0.8, Easing.inOut(Easing.quad));
  const placar = entra(t, T.v75 - 0.2, 0.5);
  const votos = 5 * rampa(t, T.v75, T.v75 + 1.3, Easing.linear);
  const contra = entra(t, T.um, 0.4);
  const mesa = entra(t, T.eComo, 0.6);
  const caneta = rampa(t, T.sancao, T.sancao + 0.3) * (1 - rampa(t, T.presidente + 0.1, T.presidente + 0.6));
  const livro = entra(t, T.constituicao - 0.1, 0.6);
  const abre = rampa(t, T.constituicao + 0.3, T.constituicao + 1.0);
  const folhaNova = rampa(t, T.promulga, T.promulga + 0.8);
  const mesaCong = entra(t, T.congresso2, 0.6);
  const sobeMesa = rampa(t, T.congresso2 - 0.1, T.congresso2 + 0.6, sai);
  const brilhoMesa = rampa(t, T.promulga, T.promulga + 0.5);

  // Linha do tempo e Diário Oficial
  const lt = rampa(t, T.contagem - 0.1, T.contagem + 0.6);
  const ltAcesa = interpolate(t, [T.publicada, T.doisDiasFolga, T.m14, T.chega40 + 0.3], [0, fracLT(MARCOS_X[1]), fracLT(MARCOS_X[1]), fracLT(MARCOS_X[2])], clamp);
  const marcos = [
    {x: MARCOS_X[0], k: entra(t, T.publicada - 0.1), aceso: rampa(t, T.publicada, T.publicada + 0.4)},
    {x: MARCOS_X[1], k: entra(t, T.doisMeses), aceso: rampa(t, T.doisDiasFolga - 0.3, T.doisDiasFolga + 0.2)},
    {x: MARCOS_X[2], k: entra(t, T.m14), aceso: rampa(t, T.chega40, T.chega40 + 0.4)},
  ];
  const diario = rampa(t, T.publicada - 0.15, T.publicada + 0.35, cai);
  const cadeira = entra(t, T.doisDiasFolga + 0.3, 0.6) * sumir(t, T.seis2, 0.4) + entra(t, T.folgaMais + 0.2, 0.6) * (t > T.folgaMais ? 1 : 0);
  const abreCadeira = t < T.seis2 ? rampa(t, T.doisDiasFolga + 0.4, T.doisDiasFolga + 1.1) : rampa(t, T.folgaMais + 0.3, T.folgaMais + 1.0);

  // Salário, piso e contracheque
  const brilhoSal = 0.6 * pulso(t, T.salario, 1.1) + 0.4 * pulso(t, T.semReducao, 1.1);
  const brilhoPiso = 0.9 * pulso(t, T.piso, 1.4);
  const cheque = entra(t, T.semReducao + 0.2, 0.6);

  // Transição: acordo coletivo, dia esticado, escudo nas folgas
  const acordo = entra(t, T.acordo - 0.1, 0.6) * sumir(t, T.quemJa, 0.5);
  const assina = rampa(t, T.acordo + 0.5, T.acordo + 1.1);
  const extra = (a: number) => entra(t, a, 0.5) * sumir(t, T.quemJa, 0.4);
  const marca8 = rampa(t, T.oito - 0.1, T.oito + 0.4) * sumir(t, T.quemJa, 0.4);
  const escudo = entra(t, T.duasFicam, 0.7) * sumir(t, T.quemJa, 0.5);
  const domingo = pulso(t, T.domingo, 1.6);

  // Quem já faz 40 h
  const quarenta = entra(t, T.h40menos - 0.1, 0.6);
  const ganha = rampa(t, T.tambemGanha, T.tambemGanha + 0.6);
  const braco = rampa(t, T.tambemGanha + 0.2, T.tambemGanha + 0.7, mola);

  // Ala dos essenciais
  const barra = rampa(t, T.x1236 - 0.1, T.x1236 + 0.9);
  const barraDesc = rampa(t, T.x1236 + 0.6, T.x1236 + 1.2);
  const hospital = rampa(t, T.saude - 0.2, T.saude + 0.6, sai);
  const letreiro = rampa(t, T.saude + 0.2, T.saude + 0.7);
  const onibus = rampa(t, T.transporte - 0.2, T.transporte + 0.9, sai);
  const mes = entra(t, T.compensar - 0.4, 0.6);
  const acesas = rampa(t, T.compensar - 0.2, T.compensar + 0.4);
  const troca = rampa(t, T.compensar + 0.2, T.compensar + 1.2, Easing.inOut(Easing.quad));
  const brilhoMes = pulso(t, T.media, 1.4);

  // Quem fica de fora
  const publico = rampa(t, T.servidor - 0.2, T.servidor + 0.6, sai);
  const servidor = entra(t, T.servidor + 0.1, 0.5);
  const empregado = entra(t, T.empregado, 0.5);
  const fora = rampa(t, T.deFora, T.deFora + 0.6);
  const profissional = entra(t, T.quemTem, 0.5);
  const relogio = entra(t, T.r21 + 0.3, 0.5);
  const visor = 1 - rampa(t, T.controle + 0.2, T.controle + 1.0);
  const miniProf = entra(t, T.mantem - 0.2, 0.5);
  const miniProfSab = rampa(t, T.mantem + 0.2, T.mantem + 0.7);

  // Pequeno negócio
  const loja = (i: number) => entra(t, i === 0 ? T.pequeno + 0.1 : i === 1 ? T.micro : T.pequenas, 0.6);
  const toldo = (i: number) => rampa(t, [T.mei, T.micro, T.pequenas][i], [T.mei, T.micro, T.pequenas][i] + 0.4);
  const lei = entra(t, T.lei - 0.1, 0.6) * sumir(t, T.voce, 0.5);
  const ampulheta = entra(t, T.ateLa - 0.1, 0.5);
  const areia = 1 - rampa(t, T.ateLa + 0.2, T.prazo + 0.3, Easing.linear);
  const lojaSab = rampa(t, T.prazo + 0.3, T.prazo + 0.9);

  return (
    <>
      <Particulas t={t} centro={[centro[0], 2.5, centro[2]]} raio={9} n={50} />

      {/* Semana */}
      {Array.from({length: 7}).map((_, d) => (
        <DiaBloco key={d} tema={tema} pos={DIA(d)} aceso={1} descanso={descanso(d)} />
      ))}
      <Onda pos={DIA(5)} k={rampa(t, T.doisDiasFolga, T.doisDiasFolga + 1.0, Easing.linear)} cor={tema.acento} raio={0.9} />
      <Onda pos={DIA(6)} k={rampa(t, T.domingo, T.domingo + 1.0, Easing.linear)} cor={tema.acento} raio={0.9} />
      <Onda pos={DIA(5)} k={rampa(t, T.folgaMais, T.folgaMais + 1.0, Easing.linear)} cor={tema.acento} raio={0.9} />
      {CUBOS.map((c, i) => {
        const a = (i / CUBOS.length) * 1.1;
        if (t < a) return null;
        const queda = rampa(t, a, a + 0.35, cai);
        const p = DIA(c.d);
        if (c.d !== 5) return <CuboHora key={i} tema={tema} pos={[p[0], Y_CUBO(c.h) + 2.5 * (1 - queda), p[2]]} />;
        // Sábado: as 4 horas vão para o topo de SEG..QUI em "dois dias de folga"; somem 2 em "42" e 2 em "chega a 40"
        const voa = rampa(t, T.doisDiasFolga + c.h * 0.08, T.doisDiasFolga + 0.7 + c.h * 0.08, Easing.inOut(Easing.quad));
        const pos = arco([p[0], Y_CUBO(c.h) + 2.5 * (1 - queda), p[2]], [DIA(c.h)[0], Y_CUBO(8), 0], voa, 1.2);
        const some = c.h < 2 ? sumir(t, T.h42 + c.h * 0.1, 0.4) : sumir(t, T.chega40 + (c.h - 2) * 0.1, 0.4);
        return <CuboHora key={i} tema={tema} pos={pos} escala={some} />;
      })}
      {/* "Você trabalha na 6x1?": as 4 horas do sábado voltam; em "folga a mais" afundam */}
      {t > T.seis2 - 0.1
        ? Array.from({length: 4}).map((_, h) => {
            const k = entra(t, T.seis2 + h * 0.06, 0.4) * sumir(t, T.folgaMais + h * 0.05, 0.4);
            return <CuboHora key={`v${h}`} tema={tema} pos={[DIA(5)[0], Y_CUBO(h) + 1.5 * (1 - k), 0]} escala={k} />;
          })
        : null}
      {/* Transição: a segunda e a terça passam de 8 h (cubinhos em acento) */}
      {[
        [0, T.esticar],
        [1, T.fechar],
      ].map(([d, a]) => {
        const k = extra(a);
        return k < 0.02 ? null : <Caixa key={`x${d}`} args={[0.2 * k, 0.2 * k, 0.2 * k]} raio={0.035 * k} cor={tema.acento} emissivo={0.35} position={[DIA(d)[0], Y_CUBO(8) + 0.8 * (1 - k), 0]} />;
      })}
      {marca8 > 0.02 ? <Caixa args={[1.6 * marca8, 0.02, 0.34]} raio={0.008} cor={tema.tinta} emissivo={0.3} sombra={false} position={[DIA(0)[0] + 0.5, Y_CUBO(7) + 0.115, 0]} /> : null}
      <Escudo tema={tema} pos={[2.5, 0, -0.75]} escala={0.85 * escudo} acende={0.6 + 0.4 * domingo} />

      {/* Carimbo APROVADO */}
      {carimbo > 0.02 && t < T.calma + 0.6 ? <Carimbo3D tema={tema} pos={[0, yCarimbo, 0]} escala={2.6 * carimbo} /> : null}
      <Onda pos={[0, 0, 0]} k={rampa(t, T.aprovou + 0.3, T.aprovou + 1.6, Easing.linear)} cor={tema.acento} raio={4.2} />

      {/* Salário, piso e contracheque */}
      {Array.from({length: N_MOEDAS}).map((_, k) => (
        <MoedaCor key={k} tema={tema} pos={[SALARIO[0], 0.04 + k * 0.083, SALARIO[2]]} rot={[0, k * 0.7, 0]} r={k === 0 ? 0.4 : 0.32} brilho={k === 0 ? Math.max(brilhoSal, brilhoPiso) : brilhoSal} />
      ))}
      <Contracheque tema={tema} pos={CONTRACHEQUE} rotY={-0.35} escala={1.15 * cheque} salario={rampa(t, T.salario, T.salario + 0.4)} piso={rampa(t, T.piso, T.piso + 0.4)} />

      {/* Linha do tempo e Diário Oficial */}
      {lt > 0.02 ? <LinhaChao tema={tema} x0={LT.x0} x1={LT.x1} z={LT.z} k={lt} acesa={ltAcesa} marcos={marcos} /> : null}
      {t > T.publicada - 0.15 ? <DiarioOficial tema={tema} pos={[DIARIO[0], 2.6 * (1 - diario), DIARIO[2]]} rot={[0.5 * (1 - diario), 0.25 + 0.8 * (1 - diario), 0]} escala={1.4} destaque={rampa(t, T.publicada + 0.2, T.publicada + 0.6)} /> : null}
      <CadeiraPraia tema={tema} pos={[DIA(5)[0], 0.15, 0.05]} rotY={-0.25} escala={1.25 * k01(cadeira)} abre={abreCadeira} />

      {/* Congresso ao fundo */}
      <PredioLargo tema={tema} pos={CAMARA} aceso={camara} />
      <PredioColunas tema={tema} pos={SENADO} aceso={senado} />
      <Calendario tema={tema} pos={CALENDARIO} escala={9 * cal} folhas={folhas} />
      {docs > 0.02
        ? [0, 1].map((i) => {
            const de: V3 = [SENADO[0] - 0.8 + i * 1.6, 3.6, SENADO[2] + 1.6];
            const para: V3 = [CALENDARIO[0] - 0.25 + i * 0.5, 2.3 + i * 0.05, CALENDARIO[2] + 0.6];
            const giroI = rampa(t, T.doisTurnos + i * 0.45, T.doisTurnos + i * 0.45 + 0.7, Easing.inOut(Easing.quad));
            return <DocumentoGrande key={i} tema={tema} pos={arco(de, para, pousa, 0.8)} rot={[1.3 - 0.2 * pousa, giroI * Math.PI * 2 + giro * 0.2, 0]} escala={(0.8 - 0.45 * pousa) * docs} carimbo={rampa(t, T.doisTurnos + i * 0.45 + 0.5, T.doisTurnos + i * 0.45 + 0.8)} />;
          })
        : null}
      {placar > 0.02 ? (
        <group>
          <Caixa args={[0.12, 1.6 * placar, 0.12]} raio={0.03} cor={tema.objetoEscuro} position={[PLACAR[0], 0.8 * placar, PLACAR[2] - 0.1]} />
          <PlacarVotos tema={tema} pos={[PLACAR[0], 1.95, PLACAR[2]]} escala={placar} acesos={votos} />
          {contra > 0.02 ? <Caixa args={[0.3 * contra, 0.3 * contra, 0.08]} raio={0.04} cor={tema.objetoEscuro} position={[PLACAR[0] + 1.35, 1.95, PLACAR[2]]} /> : null}
        </group>
      ) : null}
      <MesaSancao tema={tema} pos={MESA_SANCAO} escala={mesa} caneta={caneta} />
      <LivroLei tema={tema} pos={[MESA_SANCAO[0] - 0.75, 1.65, MESA_SANCAO[2] + 0.35]} rot={[-0.1, 0.35, 0]} escala={0.85 * livro} abre={abre} folha={folhaNova} capa={1} />
      <MesaCongresso tema={tema} pos={[MESA_CONGRESSO[0], -1.2 * (1 - sobeMesa), MESA_CONGRESSO[2]]} escala={mesaCong} brilho={brilhoMesa} />
      <Onda pos={MESA_CONGRESSO} k={rampa(t, T.promulga, T.promulga + 1.4, Easing.linear)} cor={tema.acento} raio={3.2} />

      {/* Acordo coletivo */}
      <DocumentoGrande tema={tema} pos={[ACORDO[0], ACORDO[1] + 1.2 * (1 - acordo), ACORDO[2]]} rot={[1.15, 0.55, 0]} escala={0.95 * acordo} carimbo={assina} />

      {/* Quem já faz 40 h: boneco e mini-semana de 40 h */}
      {quarenta > 0.02 ? (
        <Boneco tema={tema} pos={QUARENTA.boneco} rotY={0.5} escala={0.5 * quarenta} cor={tema.pessoa} pose={{ombroD: [-2.6 * braco, 0, 0.25 * braco], cotoveloD: -0.3}} />
      ) : null}
      <MiniSemana tema={tema} c={QUARENTA.centro} esc={QUARENTA.esc} passo={QUARENTA.passo} k={quarenta} sab={ganha} />
      {quarenta > 0.02
        ? Array.from({length: 40}).map((_, i) => {
            const d = Math.floor(i / 8);
            const h = i % 8;
            const s = QUARENTA.esc;
            return <CuboHora key={`q${i}`} tema={tema} pos={[miniDia(QUARENTA.centro, d, QUARENTA.passo)[0], s * Y_CUBO(h), QUARENTA.centro[2]]} escala={s * entra(t, T.h40menos + i * 0.012, 0.4)} />;
          })
        : null}

      {/* Ala dos essenciais (direita) */}
      <BarraTurno tema={tema} pos={BARRA} rotY={-0.2} k={barra} descanso={barraDesc} />
      <OrgaoPublico tema={tema} pos={HOSPITAL} escala={0.8} sobe={hospital} letreiro={letreiro} texto="SAÚDE" />
      {onibus > 0.01 ? <Onibus tema={tema} pos={[ONIBUS[0] + 7 * (1 - onibus), 0, ONIBUS[2]]} rotY={-0.15} escala={1} farol={rampa(t, T.transporte + 0.5, T.transporte + 1.0)} /> : null}
      <MesFolgas tema={tema} pos={MES} rotY={-0.25} escala={1.1 * mes} acesas={k01(acesas + 0.4 * brilhoMes)} troca={troca} />

      {/* Quem fica de fora (esquerda) */}
      <OrgaoPublico tema={tema} pos={PUBLICO} escala={0.8} sobe={publico} letreiro={rampa(t, T.servidor + 0.3, T.servidor + 0.8)} texto="PÚBLICO" />
      {servidor > 0.02 ? (
        <Boneco tema={tema} pos={SERVIDOR} rotY={0.4} escala={0.5 * servidor} cor={tema.pessoa}>
          <Cracha tema={tema} pos={[0, 1.32, 0.2]} k={entra(t, T.servidor + 0.4, 0.4)} />
        </Boneco>
      ) : null}
      {empregado > 0.02 ? (
        <Boneco tema={tema} pos={EMPREGADO} rotY={0.3} escala={0.5 * empregado} cor={tema.pessoa}>
          <Cracha tema={tema} pos={[0, 1.32, 0.2]} k={entra(t, T.empregado + 0.3, 0.4)} />
        </Boneco>
      ) : null}
      <Tracejado tema={tema} a={[-8.9, 0, -0.6]} b={[-8.9, 0, 3.6]} k={fora} />
      {profissional > 0.02 ? (
        <Boneco tema={tema} pos={PROFISSIONAL} rotY={0.35} escala={0.5 * profissional} cor={tema.pessoa} pose={{ombroD: [-0.55, 0, 0.1], cotoveloD: -0.9}}>
          <Diploma tema={tema} pos={[0.36, 1.02, 0.42]} rot={[0, 0, Math.PI / 2]} k={entra(t, T.diploma, 0.45)} />
        </Boneco>
      ) : null}
      <RelogioPonto tema={tema} pos={RELOGIO} rotY={0.5} escala={1.0 * relogio} visor={visor} />
      <MiniSemana tema={tema} c={MINI_PROF} esc={0.3} passo={0.28} k={miniProf} sab={miniProfSab} />

      {/* Rua do pequeno negócio (frente) */}
      <Barraquinha tema={tema} pos={LOJAS[0].pos} escala={0.75 * loja(0)} toldo={toldo(0)} />
      <Lojinha tema={tema} pos={LOJAS[1].pos} escala={loja(1)} larg={1.5} toldo={toldo(1)} />
      <Lojinha tema={tema} pos={LOJAS[2].pos} escala={loja(2)} larg={2.1} toldo={toldo(2)} />
      {LOJAS.map((l, i) => (
        <MiniSemana tema={tema} key={l.nome} c={[l.pos[0], 0, l.pos[2] + 1.2]} esc={0.32} passo={0.32} k={entra(t, T.regra + i * 0.1, 0.5)} sab={lojaSab} />
      ))}
      <Folha tema={tema} pos={[LEI[0], LEI[1] + 1.2 * (1 - lei), LEI[2]]} rot={[Math.PI / 2 - 0.15, 0, 0.04 * Math.sin(t * 1.3)]} escala={4.2 * lei} />
      <Ampulheta tema={tema} pos={AMPULHETA} escala={3.4 * ampulheta} areia={areia} fio />
      <Onda pos={[0, 0, 10.2]} k={rampa(t, T.prazo + 0.3, T.prazo + 1.5, Easing.linear)} cor={tema.acento} raio={4.5} />
    </>
  );
};

// ---------- Câmeras de cada cena (plano.md, seção 4) ----------
type Cena = {ini: number; cam: (t: number, ini: number, fim: number) => Cam; foco?: (t: number, cam: Cam) => Foco};
const C_SEMANA = enq([0.6, 0.9, 0], 8.6, 3.4, D(0, 30));
const C_CONGRESSO = enq([0, 2.0, -14.2], 11.5, 5, D(0, 22));
const C_RUA = enq([0, 1.0, 9.2], 9.4, 3.6, D(0, 26));
const FIM = AUDIO_SEG + 0.9;
const CENAS: Cena[] = [
  // 1. Aprovado: aproxima e gira para a esquerda
  {ini: 0, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([0.6, 1.1, 0], 9.2, 4.2, D(0, 27))], [b, enq([0.6, 0.9, 0], 8.6, 3.6, D(-12, 31))]]), rampa(t, a, b)), foco: (t, cam) => focarEm(cam, [0.6, 0.9, 0], 5, 4)},
  // 2. A votação: grua até o Senado, depois calendário e placar
  {
    ini: T.calma,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0.6, 0.9, -1], 10, 4, D(-8, 28))],
          [T.quarta - 0.2, enq([3.0, 2.0, -13.5], 10, 5, D(8, 22))],
          [T.doisTurnos + 0.3, enq([4.6, 2.0, -13.6], 8, 4.6, D(14, 20))],
          [T.v75 - 0.2, enq([5.2, 1.8, -12.6], 6.6, 4.0, D(20, 18))],
          [b, enq([5.2, 1.8, -12.4], 6.2, 3.8, D(26, 18))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 5, 3.5),
  },
  // 3. Sem sanção: mesa da sanção, depois Câmara e Senado com a mesa do Congresso
  {
    ini: T.eComo,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-4.4, 1.3, -11], 4.4, 3.4, D(-25, 22))],
          [T.congresso2 - 0.3, enq([-4.2, 1.3, -11], 3.9, 3.1, D(-18, 22))],
          [T.congresso2 + 0.5, C_CONGRESSO],
          [b, enq([0, 1.9, -14], 10.8, 4.8, D(6, 24))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 5, 3.5),
  },
  // 4. A contagem: linha do tempo e semana, semana pela esquerda, pilha do salário
  {
    ini: T.ai,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0.2, 0.6, 2.0], 9.6, 4.6, D(0, 32))],
          [T.limite - 0.3, enq([0.3, 0.6, 1.8], 9.2, 4.4, D(-6, 32))],
          [T.limite + 0.6, enq([0.6, 0.9, 0], 8.6, 3.6, D(-28, 37))],
          [T.semReducao - 0.3, enq([0.8, 0.9, 0], 8.4, 3.6, D(-20, 37))],
          [T.semReducao + 0.6, enq([5.3, 0.9, 0.3], 3.6, 2.6, D(30, 22))],
          [b, enq([5.4, 0.9, 0.3], 3.3, 2.4, D(38, 22))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 4, 3.5),
  },
  // 5. Transição: acordo e segunda-feira; depois as duas folgas, aproximando do domingo
  {
    ini: T.transicao,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-3.8, 1.3, 0.8], 4.8, 3.6, D(-30, 24))],
          [T.esticar, enq([-3.5, 1.4, 0.5], 4.4, 3.6, D(-24, 22))],
          [T.mas2 - 0.2, enq([-3.2, 1.4, 0.4], 4.4, 3.6, D(-18, 22))],
          [T.mas2 + 0.7, enq([1.6, 0.9, 0.3], 6.2, 3.4, D(15, 37))],
          [T.preferencia, enq([2.6, 0.9, 0.4], 3.8, 2.8, D(15, 30))],
          [b, enq([3.0, 0.8, 0.4], 3.0, 2.3, D(18, 28))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 3.5, 4),
  },
  // 6. Quem já faz 40 h: por cima do ombro, travelling lento para a esquerda
  {ini: T.quemJa, cam: (t, a, b) => vivo(trilhoCam(t, [[a, enq([5.6, 0.8, 4.6], 3.8, 2.5, D(25, 24))], [b, enq([5.4, 0.8, 4.6], 3.5, 2.3, D(12, 24))]]), rampa(t, a, b)), foco: (t, cam) => focarEm(cam, cam.alvo, 3, 4)},
  // 7. 12x36 e essenciais: barra, ala inteira, calendário do mês
  {
    ini: T.escala12,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([9.4, 0.5, 4.2], 5.8, 2.4, D(18, 26))],
          [T.essenciais - 0.1, enq([9.6, 0.5, 4.2], 5.6, 2.4, D(24, 26))],
          [T.essenciais + 0.8, enq([11.4, 1.4, 1.0], 8.2, 4.4, D(26, 24))],
          [T.desdeQue - 0.3, enq([11.8, 1.4, 0.8], 7.8, 4.2, D(30, 24))],
          [T.desdeQue + 0.6, enq([13.6, 1.9, -1.4], 3.4, 2.6, D(12, 18))],
          [b, enq([13.6, 1.9, -1.4], 3.1, 2.4, D(4, 18))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 4, 3.5),
  },
  // 8. Quem fica de fora: prédio público e servidores; profissional com diploma e relógio de ponto
  {
    ini: T.servidor,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([-10.6, 1.4, 0.2], 5.8, 3.8, D(-30, 24))],
          [T.quemTem - 0.2, enq([-10.8, 1.3, 0.6], 5.2, 3.6, D(-22, 24))],
          [T.quemTem + 0.6, enq([-15.0, 0.9, 2.8], 4.2, 2.8, D(-12, 22))],
          [b, enq([-15.0, 0.9, 2.9], 3.9, 2.6, D(-2, 22))],
        ]),
        rampa(t, a, b),
        -1,
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 3.5, 4),
  },
  // 9. Pequeno negócio: a rua; ampulheta e lojas; recua em "só muda"
  {
    ini: T.pequeno,
    cam: (t, a, b) =>
      vivo(
        trilhoCam(t, [
          [a, enq([0, 1.1, 9.4], 8.8, 3.8, D(0, 28))],
          [T.ateLa - 0.2, enq([0, 1.1, 9.4], 8.5, 3.7, D(-6, 26))],
          [T.ateLa + 0.6, enq([3.0, 1.0, 9.0], 5.6, 3.0, D(-15, 20))],
          [T.soMuda - 0.1, enq([2.8, 1.0, 9.0], 5.4, 2.9, D(-10, 20))],
          [T.soMuda + 0.8, C_RUA],
          [b, enq([0.4, 1.0, 9.2], 9.2, 3.5, D(4, 24))],
        ]),
        rampa(t, a, b),
      ),
    foco: (t, cam) => focarEm(cam, cam.alvo, 5, 3.5),
  },
  // 10. E você? Semana, depois grua sobre o mundo inteiro
  {
    ini: T.voce,
    cam: (t, a) => trilhoCam(t, [[a, C_SEMANA], [T.segue, enq([0.6, 0.9, 0], 9.6, 3.8, D(0, 34))], [FIM, enq([-1, 0, -2], 34, 30, D(0, 50))]]),
    foco: (t, cam) => (t < T.segue ? focarEm(cam, cam.alvo, 4, 3.5) : focarEm(cam, cam.alvo, distancia(cam.pos, cam.alvo) * 0.4, 3)),
  },
];

// ---------- Interface por cima do 3D ----------
const X = SEGURO.esq + 20;
const Carimbo: React.FC<{tema: Tema; texto: string; k: number; y: number; tam?: number}> = ({tema, texto, k, y, tam = 64}) =>
  k <= 0 ? null : (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: Math.min(1, k * 1.5), transform: `scale(${2 - Math.min(k, 1)}) rotate(-5deg)`}}>
      <div style={{padding: '14px 40px', borderRadius: 18, border: `6px solid ${tema.acento}`, background: tema.cartao, fontFamily: FONTE, fontWeight: 850, fontSize: tam, color: tema.acento, whiteSpace: 'nowrap', letterSpacing: 2}}>{texto}</div>
    </div>
  );
const Rotulo: React.FC<{tema: Tema; cam: Cam; p: V3; x: number; y: number; titulo: string; sub?: string; aparece: number; some?: number; destaque?: boolean}> = ({tema, cam, p, x, y, titulo, sub, aparece, some = 1, destaque}) =>
  aparece <= 0 || some <= 0 ? null : (
    <div style={{position: 'absolute', inset: 0, opacity: some}}>
      <Etiqueta tema={tema} x={x} y={y} alvo={pj(p, cam)} titulo={titulo} sub={sub} aparece={aparece} destaque={destaque} />
    </div>
  );
// Número grande (Contador da base) que também sabe sumir (`some` 1 a 0).
const Contador: React.FC<{tema: Tema; k: number; valor: string; rotulo: string; y?: number; some?: number}> = ({tema, k, valor, rotulo, y = 430, some = 1}) =>
  k <= 0 || some <= 0 ? null : (
    <div style={{position: 'absolute', inset: 0, opacity: some}}>
      <ContadorBase tema={tema} valor={valor} rotulo={rotulo} k={k} y={y} />
    </div>
  );
const Centro: React.FC<{y: number; children: React.ReactNode; some?: number}> = ({y, children, some = 1}) =>
  some <= 0 ? null : <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: some}}>{children}</div>;
const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
// Rótulos dos dias, presos à frente de cada bloco (texto 2D, sem textura).
const RotulosDias: React.FC<{tema: Tema; cam: Cam; k: number; t: number}> = ({tema, cam, k, t}) =>
  k <= 0 ? null : (
    <>
      {DIAS.map((d, i) => {
        const p = pj([DIA(i)[0], 0.02, 0.62], cam);
        const folga = i === 6 || (i === 5 && sabado(t) > 0.5);
        return (
          <div key={d} style={{position: 'absolute', left: p.x - 50, top: p.y - 4, width: 100, textAlign: 'center', fontFamily: MONO, fontSize: 24, fontWeight: 700, letterSpacing: 2, color: folga ? tema.acento : tema.textoSuave, opacity: k}}>
            {d}
          </div>
        );
      })}
    </>
  );
// Rótulo pequeno sobre um objeto (nome da loja etc.).
const Marquinha: React.FC<{tema: Tema; cam: Cam; p: V3; texto: string; k: number; destaque?: boolean}> = ({tema, cam, p, texto, k, destaque}) => {
  if (k <= 0) return null;
  const q = pj(p, cam);
  return (
    <div style={{position: 'absolute', left: q.x - 100, top: q.y - 30, width: 200, display: 'flex', justifyContent: 'center'}}>
      <Chip tema={tema} texto={texto} k={k} destaque={destaque} tam={28} />
    </div>
  );
};

const Interface: React.FC<{tema: Tema; t: number; cam: Cam; cena: number}> = ({tema, t, cam, cena}) => {
  const ap = (a: number) => rampa(t, a - 0.05, a + 0.5, Easing.linear);
  const fora = (a: number) => 1 - rampa(t, a - 0.35, a - 0.05, Easing.linear);
  if (cena === 0)
    return (
      <>
        <Centro y={430}>
          <Chip tema={tema} texto="FIM DA 6x1" k={entra(t, T.fim)} tam={40} />
        </Centro>
        <Carimbo tema={tema} texto="APROVADO" k={rampa(t, T.aprovou + 0.3, T.aprovou + 0.65, mola)} y={540} tam={76} />
        <Centro y={1090}>
          <Chip tema={tema} texto="AINDA NÃO VALE" k={entra(t, T.acabou - 0.2)} destaque tam={40} />
        </Centro>
        <RotulosDias tema={tema} cam={cam} k={1} t={t} />
      </>
    );
  if (cena === 1) {
    const n = Math.round(75 * rampa(t, T.v75, T.v75 + 1.3, sai));
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[CALENDARIO[0], 2.0, CALENDARIO[2]]} x={X + 360} y={470} titulo="Quarta" sub="VOTAÇÃO NO SENADO" aparece={ap(T.quarta)} some={fora(T.doisTurnos)} />
        <Rotulo tema={tema} cam={cam} p={[SENADO[0], 2.4, SENADO[2]]} x={X} y={470} titulo="Senado" sub="DOIS TURNOS" destaque aparece={ap(T.senado)} some={fora(T.doisTurnos)} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', gap: 14, opacity: fora(T.v75)}}>
          <Chip tema={tema} texto="1º TURNO" k={entra(t, T.doisTurnos)} />
          <Chip tema={tema} texto="2º TURNO" k={entra(t, T.doisTurnos + 0.45)} />
        </div>
        <Centro y={545} some={fora(T.v75)}>
          <Chip tema={tema} texto="NO MESMO DIA" k={entra(t, T.mesmoDia)} destaque tam={36} />
        </Centro>
        <Contador tema={tema} k={entra(t, T.v75, 0.4)} valor={`${n} × ${t > T.um ? 1 : 0}`} rotulo="VOTOS NO SENADO" y={440} />
      </>
    );
  }
  if (cena === 2)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[MESA_SANCAO[0] - 0.75, 2.2, MESA_SANCAO[2] + 0.35]} x={X} y={470} titulo="Constituição" sub="MUDANÇA NELA" aparece={ap(T.constituicao)} some={fora(T.sancao)} />
        <Rotulo tema={tema} cam={cam} p={[MESA_SANCAO[0] + 0.45, 0.9, MESA_SANCAO[2]]} x={X} y={470} titulo="Sanção do presidente" sub={t > T.presidente + 0.3 ? 'NÃO PASSA POR ELA' : 'ASSINATURA'} destaque={t > T.presidente + 0.3} aparece={ap(T.sancao)} some={fora(T.congresso2 + 0.2)} />
        <Rotulo tema={tema} cam={cam} p={[CAMARA[0], 2.4, CAMARA[2]]} x={X} y={470} titulo="Câmara" sub="E SENADO" aparece={ap(T.congresso2 + 0.3)} />
        <Rotulo tema={tema} cam={cam} p={[MESA_CONGRESSO[0], 1.0, MESA_CONGRESSO[2] + 0.4]} x={X + 330} y={640} titulo="O próprio Congresso" sub="PROMULGA" aparece={ap(T.promulga - 0.2)} />
        <Carimbo tema={tema} texto="PROMULGADA" k={rampa(t, T.promulga + 0.1, T.promulga + 0.45, mola)} y={1125} tam={60} />
      </>
    );
  if (cena === 3) {
    const horas = t < T.h44 ? 44 : t < T.h42 ? 44 : t < T.chega40 ? Math.round(44 - 2 * rampa(t, T.h42, T.h42 + 0.5)) : Math.round(42 - 2 * rampa(t, T.chega40, T.chega40 + 0.5));
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[DIARIO[0], 0.15, DIARIO[2]]} x={X} y={1120} titulo="Diário Oficial" sub="PUBLICAÇÃO" aparece={ap(T.publicada + 0.1)} some={fora(T.semana)} />
        <Rotulo tema={tema} cam={cam} p={[MARCOS_X[1], 0.8, LT.z]} x={X + 300} y={470} titulo="+2 meses" sub={t > T.doisDiasFolga ? '2 FOLGAS · 42 H' : 'DEPOIS DA PUBLICAÇÃO'} destaque={t > T.doisDiasFolga} aparece={ap(T.doisMeses)} some={fora(T.limite)} />
        <Centro y={1120} some={fora(T.limite)}>
          <Chip tema={tema} texto="5 × 2" k={entra(t, T.semana)} destaque tam={46} />
        </Centro>
        <Contador tema={tema} k={entra(t, T.h44, 0.4)} valor={`${horas} H`} rotulo={t > T.chega40 ? 'EM ATÉ 14 MESES' : 'LIMITE POR SEMANA'} some={fora(T.semReducao)} />
        <Centro y={1090} some={fora(T.semReducao)}>
          <Chip tema={tema} texto="ATÉ 14 MESES: 40 H" k={entra(t, T.m14)} tam={32} />
        </Centro>
        <Rotulo tema={tema} cam={cam} p={[SALARIO[0], 1.1, SALARIO[2]]} x={X} y={470} titulo="Salário" sub="SEM REDUÇÃO" destaque aparece={ap(T.salario - 0.3)} />
        <Centro y={1090}>
          <Chip tema={tema} texto="NEM O PISO" k={entra(t, T.piso)} destaque tam={36} />
        </Centro>
        <RotulosDias tema={tema} cam={cam} k={sumir(t, T.semReducao, 0.4)} t={t} />
      </>
    );
  }
  if (cena === 4)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[ACORDO[0], ACORDO[1] + 0.3, ACORDO[2]]} x={X} y={640} titulo="Acordo coletivo" sub={t > T.acordo + 0.7 ? 'ASSINADO' : 'SINDICATO E EMPRESA'} aparece={ap(T.acordo)} some={fora(T.mas2)} />
        <Centro y={1090} some={fora(T.mas2)}>
          <Chip tema={tema} texto="+ DE 8 H NO DIA" k={entra(t, T.oito)} tam={36} />
        </Centro>
        <Contador tema={tema} k={entra(t, T.fechar, 0.4)} valor="42 H" rotulo="NA SEMANA" y={420} some={fora(T.mas2)} />
        <Centro y={440}>
          <Chip tema={tema} texto="AS 2 FOLGAS FICAM" k={entra(t, T.duasFicam)} destaque tam={40} />
        </Centro>
        <Centro y={540}>
          <Chip tema={tema} texto="DE PREFERÊNCIA NO DOMINGO" k={entra(t, T.domingo - 0.3)} tam={32} />
        </Centro>
        <RotulosDias tema={tema} cam={cam} k={rampa(t, T.mas2, T.mas2 + 0.5)} t={t} />
      </>
    );
  if (cena === 5)
    return (
      <>
        <Contador tema={tema} k={entra(t, T.h40menos, 0.4)} valor="40 H" rotulo="OU MENOS POR SEMANA" />
        <Rotulo tema={tema} cam={cam} p={[QUARENTA.boneco[0], 1.0, QUARENTA.boneco[2]]} x={X} y={700} titulo="Não perde nada" sub="SALÁRIO E HORAS IGUAIS" aparece={ap(T.naoPerde)} some={fora(T.tambemGanha)} />
        <Centro y={700}>
          <Chip tema={tema} texto="+ 2 FOLGAS" k={entra(t, T.tambemGanha)} destaque tam={42} />
        </Centro>
      </>
    );
  if (cena === 6)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[BARRA[0], 0.5, BARRA[2]]} x={X} y={470} titulo="Escala 12x36" sub="12 H TRABALHO · 36 H DESCANSO" aparece={ap(T.x1236)} some={fora(T.essenciais + 0.4)} />
        <Rotulo tema={tema} cam={cam} p={[HOSPITAL[0], 2.2, HOSPITAL[2]]} x={X} y={470} titulo="Saúde" sub="SERVIÇO ESSENCIAL" aparece={ap(T.saude)} some={fora(T.desdeQue)} />
        <Rotulo tema={tema} cam={cam} p={[ONIBUS[0], 1.3, ONIBUS[2]]} x={X + 330} y={1130} titulo="Transporte" sub="SERVIÇO ESSENCIAL" aparece={ap(T.transporte + 0.3)} some={fora(T.desdeQue)} />
        <Centro y={1090} some={fora(T.desdeQue)}>
          <Chip tema={tema} texto="COMPENSA POR ACORDO" k={entra(t, T.compensar)} tam={34} />
        </Centro>
        <Contador tema={tema} k={entra(t, T.media, 0.4)} valor="8 FOLGAS" rotulo="NA MÉDIA DO MÊS" />
        <Centro y={1090}>
          <Chip tema={tema} texto="= 2 POR SEMANA" k={entra(t, T.duasSemana)} destaque tam={40} />
        </Centro>
      </>
    );
  if (cena === 7)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[SERVIDOR[0] - 0.6, 1.1, SERVIDOR[2]]} x={X} y={470} titulo="Servidor e empregado público" sub={t > T.deFora ? 'FICAM DE FORA' : 'REGRA PRÓPRIA'} destaque={t > T.deFora} aparece={ap(T.servidor + 0.2)} some={fora(T.quemTem)} />
        <Rotulo tema={tema} cam={cam} p={[PROFISSIONAL[0], 1.0, PROFISSIONAL[2]]} x={X} y={470} titulo="Diploma" sub="+ DE R$ 21 MIL POR MÊS" aparece={ap(T.diploma)} some={fora(T.controle)} />
        <Rotulo tema={tema} cam={cam} p={[RELOGIO[0], 1.7, RELOGIO[2]]} x={X} y={470} titulo="Controle de horas" sub="PODE FICAR DE FORA" aparece={ap(T.controle)} some={fora(T.mantem)} />
        <Centro y={440}>
          <Chip tema={tema} texto="MAS MANTÉM 2 FOLGAS" k={entra(t, T.mantem)} destaque tam={36} />
        </Centro>
      </>
    );
  if (cena === 8)
    return (
      <>
        <Rotulo tema={tema} cam={cam} p={[LEI[0], LEI[1] + 0.5, LEI[2]]} x={X} y={470} titulo="Lei complementar" sub="AINDA VAI SER FEITA" destaque aparece={ap(T.lei)} some={fora(T.ateLa)} />
        {LOJAS.map((l, i) => (
          <Marquinha tema={tema} key={l.nome} cam={cam} p={[l.pos[0], i === 0 ? 2.1 : i === 1 ? 2.0 : 2.2, l.pos[2]]} texto={l.nome} k={entra(t, [T.mei, T.micro, T.pequenas][i]) * fora(T.ateLa + 0.6)} />
        ))}
        <Centro y={440}>
          <Chip tema={tema} texto="ATÉ LÁ: REGRA DE HOJE" k={entra(t, T.regra - 0.6)} tam={34} />
        </Centro>
        <Centro y={540}>
          <Chip tema={tema} texto="SÓ MUDA NO PRAZO" k={entra(t, T.prazo)} destaque tam={38} />
        </Centro>
      </>
    );
  if (cena === 9)
    return (
      <>
        <Centro y={440}>
          <Chip tema={tema} texto={t > T.folgaMais ? '+1 FOLGA' : 'NA 6x1?'} k={entra(t, T.seis2 - 0.2)} destaque={t > T.folgaMais} tam={42} />
        </Centro>
        <Centro y={540}>
          <Chip tema={tema} texto="ME CONTA NOS COMENTÁRIOS" k={entra(t, T.comentarios - 0.3)} tam={28} />
        </Centro>
        {t > T.segue - 0.05 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 660, display: 'flex', justifyContent: 'center', opacity: rampa(t, T.segue, T.segue + 0.4), transform: `translateY(${(1 - rampa(t, T.segue, T.segue + 0.5, mola)) * 30}px)`}}>
            <div style={{padding: '26px 44px', borderRadius: 22, background: tema.cartao, border: `2px solid ${tema.cartaoBorda}`, textAlign: 'center'}}>
              <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: tema.textoSuave}}>SEGUE O PERFIL</div>
              <div style={{fontFamily: FONTE, fontSize: 56, fontWeight: 800, color: tema.texto, marginTop: 6, opacity: 0.5 + 0.5 * rampa(t, T.explicando, T.explicando + 0.4)}}>{SERIE}</div>
            </div>
          </div>
        ) : null}
        <RotulosDias tema={tema} cam={cam} k={sumir(t, T.segue, 0.4)} t={t} />
      </>
    );
  return null;
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = (() => {
  const s: Som[] = [];
  CENAS.slice(1).forEach((c) => s.push({t: c.ini - 0.12, f: 'whoosh', v: 0.28}));
  ESTADOS.slice(1).forEach(([t]) => s.push({t, f: 'tique', v: 0.3}));
  [T.fim, T.quarta, T.senado, T.doisTurnos, T.mesmoDia, T.constituicao, T.contagem, T.doisMeses, T.publicada, T.h44, T.m14, T.salario, T.acordo, T.oito, T.h40menos, T.x1236, T.saude, T.transporte, T.media, T.servidor, T.empregado, T.diploma, T.r21, T.lei, T.mei, T.micro, T.pequenas, T.comentarios].forEach((t) => s.push({t, f: 'pop', v: 0.32}));
  s.push({t: T.aprovou + 0.35, f: 'impacto', v: 0.45});
  s.push({t: T.acabou, f: 'baque', v: 0.3});
  s.push({t: T.v75, f: 'subida', v: 0.3});
  s.push({t: T.um, f: 'bip', v: 0.28});
  s.push({t: T.presidente, f: 'baque', v: 0.3});
  s.push({t: T.promulga + 0.1, f: 'impacto', v: 0.4});
  s.push({t: T.doisDiasFolga, f: 'ding', v: 0.4});
  s.push({t: T.h42, f: 'baque', v: 0.26});
  s.push({t: T.chega40, f: 'baque', v: 0.26});
  s.push({t: T.piso, f: 'ding', v: 0.35});
  s.push({t: T.duasFicam, f: 'ding', v: 0.4});
  s.push({t: T.tambemGanha, f: 'ding', v: 0.38});
  s.push({t: T.compensar, f: 'subida', v: 0.28});
  s.push({t: T.deFora, f: 'baque', v: 0.3});
  s.push({t: T.controle, f: 'bip', v: 0.26});
  s.push({t: T.mantem, f: 'ding', v: 0.36});
  s.push({t: T.prazo + 0.3, f: 'ding', v: 0.4});
  s.push({t: T.folgaMais, f: 'ding', v: 0.4});
  s.push({t: T.segue, f: 'ding', v: 0.35});
  return s.filter((x) => x.t >= 0);
})();

// Som do vídeo: narração + efeitos do Estúdio (projetos/_estudio/sons/). Toca na prévia com <Sons /> e é mixado pelo render.mjs.
// Para pôr uma trilha de fundo sua (sem direitos autorais): {arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1.3}.
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((s) => efeito(s.f, s.t, s.v))];

// Segundos dos quadros de revisão padrão (scripts/quadros.mjs): começo e meio de cada cena.
export const REVISAO: number[] = [0.6, T.aprovou + 0.8, T.v75 + 1.0, T.promulga + 0.6, T.h44 + 0.5, T.doisDiasFolga + 1.2, T.semReducao + 0.8, T.duasFicam + 0.6, T.tambemGanha + 0.6, T.saude + 0.8, T.media + 0.5, T.diploma + 0.6, T.mei + 0.5, T.prazo + 0.8, T.segue + 1.2];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};

export const Escala6x1: React.FC<Props> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  let i = 0;
  for (let k = 0; k < CENAS.length; k++) if (CENAS[k].ini <= t) i = k;
  const ini = CENAS[i].ini;
  const fim = i + 1 < CENAS.length ? CENAS[i + 1].ini : durationInFrames / fps;
  let e = 0;
  for (let k = 0; k < ESTADOS.length; k++) if (ESTADOS[k][0] <= t) e = k;
  const cam = CENAS[i].cam(t, ini, fim);
  const foco = CENAS[i].foco ? CENAS[i].foco!(t, cam) : focarEm(cam, cam.alvo, Math.max(0.4, distancia(cam.pos, cam.alvo) * 0.3), 4);
  // Troca de cena: leve zoom e desfoque que somem em 0,35 a 0,7 s. Fim: escurece no último meio segundo.
  const dt = t - ini;
  const zoom = 1 + 0.03 * (1 - interpolate(dt, [0, 0.7], [0, 1], {...clamp, easing: sai}));
  const desfoque = i > 0 ? interpolate(dt, [0, 0.35], [10, 0], clamp) : 0;
  const preto = interpolate(frame, [durationInFrames - 15, durationInFrames - 1], [0, 1], clamp);
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={22} />
      <Camera {...cam} />
      <Mundo t={t} centro={cam.alvo} tema={tema} />
      <AcabamentoCinema foco={foco} raioAO={0.6} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined}}>{mundo}</AbsoluteFill>
      <Interface t={t} cam={cam} cena={i} tema={tema} />
      {preto > 0 ? <AbsoluteFill style={{backgroundColor: tema.fundo, opacity: preto, pointerEvents: 'none'}} /> : null}
      <Marca tema={tema} serie={SERIE} assunto="Escala 6x1" />
      <Pilula tema={tema} estado={ESTADOS[e][1]} t={t} troca={ESTADOS[e][0]} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa (still 1080 × 1920) ----------
// Fundo: um quadro limpo do próprio mundo, gerado com
//   npx remotion still Escala6x1Limpo "projetos/001. escala 6x1/capa/fundo-limpo.jpg" --frame=NNN
// Título: 4 linhas de até 12 caracteres, a última no acento. `desce` (px) abaixa o fundo se o objeto principal ficou alto.
export const TITULO_CAPA = ['Aprovaram', 'o fim da', '6x1. Mas', 'quando vale?'];

export const CapaEscala6x1: React.FC<{estilo?: string; linhas?: string[]; fundo?: string; desce?: number}> = ({estilo, linhas = TITULO_CAPA, fundo = `${P}/capa/fundo-limpo.jpg`, desce = 120}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: desce, width: W, height: H}} />
      {/* metade de cima escurecida para o título */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${tema.fundo}F2 0%, ${tema.fundo}D9 30%, ${tema.fundo}00 52%)`}} />
      <Pilula tema={tema} estado={`${SERIE} · ESCALA 6x1`} t={1} troca={0} y={SEGURO.topo + 160} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: W - SEGURO.dir, top: SEGURO.topo + 250}}>
        {linhas.map((l, k) => (
          <div key={k} style={{fontFamily: FONTE, fontSize: 132, fontWeight: 850, letterSpacing: -5, lineHeight: 1.0, color: k === linhas.length - 1 ? tema.acento : tema.texto, whiteSpace: 'nowrap'}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
