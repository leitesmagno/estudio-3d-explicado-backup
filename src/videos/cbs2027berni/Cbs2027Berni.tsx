import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, Particulas, Placa, cinematizar, enquadrar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Legenda} from '../../base/legenda';
import {GuiaReels, SEGURO} from '../../base/reels';
import {Sons, efeito, narracao, type Faixa, type SomEstudio} from '../../base/som';
import {clamp, criarQuando, entra, rampa, sai, sumir} from '../../base/tempo';
import {FONTE, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';
import {temaPorId} from '../../estilo';
import {CalendarioAno} from '../../pecas/carrovoador';
import {Garrafa, MacoCigarro, NotaFiscal} from '../../pecas/imposto';
import {Carro, PilhaMoedas} from '../../pecas/juros';
import {Contrato} from '../../pecas/estadio';
import {FichaImposto} from '../reformatrib/pecas';
import {PALAVRAS} from './palavras';

// 151. cbs 2027 berni: Reel de 30 s para o Berni Advogados (Campinas/SP), no visual do Instagram do escritório
// (preto quente, luz dourada, título fino dourado, rótulo pequeno espaçado, o "B" grande, setas »).
// Estúdio 3D: calendário 2026 → 2027, fichas PIS/COFINS → CBS, IPI → Seletivo, nota e contrato.
// Kit Mapas: o Brasil com os estados (recorte do mapa do 050), tingido de dourado, no trecho do TCU/Senado.

export const FPS = 30;
const AUDIO_SEG = 28.03;
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const W = 1080;
const H = 1920;
const P = '151. cbs 2027 berni';
const FIM = AUDIO_SEG + 0.9;
const SERIF = 'Georgia, "Times New Roman", serif';

// ---------- Tempo pelas palavras ----------
const quando = criarQuando(PALAVRAS);
const T = {
  em: quando('Em'),
  teste: quando('teste'),
  cobrar: quando('cobrar'),
  pis: quando('PIS'),
  acabam: quando('acabam'),
  entra: quando('entra'),
  cbs: quando('CBS'),
  tcu: quando('TCU'),
  p113: quando('11,3%'),
  senado: quando('Senado'),
  ipi: quando('IPI'),
  zera: quando('zera'),
  seletivo: quando('Seletivo'),
  cigarro: quando('cigarro'),
  bebida: quando('bebida'),
  carro: quando('carro'),
  para: quando('Para não'),
  nota: quando('nota'),
  cbsibs: quando('CBS e IBS'),
  contador: quando('contador'),
  precos: quando('preços'),
  contratos: quando('contratos'),
  berni: quando('Berni'),
  estrategia: quando('Estratégia'),
};

// cenas (início em s)
const C = {
  ano: 0,
  troca: T.pis - 0.2,
  mapa: T.tcu - 0.15,
  pecado: T.ipi - 0.15,
  prepara: T.para - 0.15,
  fim: T.berni - 0.25,
};
const CENAS = [C.ano, C.troca, C.mapa, C.pecado, C.prepara, C.fim];
const cenaEm = (t: number) => {
  let i = 0;
  CENAS.forEach((c, k) => {
    if (t >= c) i = k;
  });
  return i;
};

// ---------- Câmera: desliza para a direita entre as estações (o "arrastar" do carrossel) ----------
const XA = 0;
const XB = 5;
const XC = 10;
const XD = 15;
const camA = enquadrar([XA, 2.25, 0], 2.6, 3.4, [0.15, 0.3, 1]);
const camA2 = enquadrar([XA, 2.2, 0], 2.4, 3.2, [0.1, 0.28, 1]);
const camB = enquadrar([XB, 2.4, 0], 3.2, 3.5, [0.12, 0.3, 1]);
const camB2 = enquadrar([XB, 2.35, 0], 2.9, 3.3, [-0.1, 0.3, 1]);
const camC = enquadrar([XC, 2.2, 0.2], 3.7, 3.8, [0.15, 0.32, 1]);
const camC2 = enquadrar([XC, 2.15, 0.2], 3.5, 3.6, [-0.08, 0.3, 1]);
const camD = enquadrar([XD, 2.25, 0.1], 3.6, 3.8, [0.15, 0.32, 1]);
const camD2 = enquadrar([XD, 2.2, 0.1], 3.4, 3.6, [-0.1, 0.3, 1]);
const camFim = enquadrar([7.5, 1.6, 0], 18, 5, [0, 0.45, 1]);
const camEm = (t: number): Cam => {
  const base = trilhoCam(t, [
    [0, camA],
    [C.troca - 0.1, camA2],
    [C.troca + 0.7, camB],
    [C.pecado - 0.1, camB2],
    [C.pecado + 0.7, camC],
    [C.prepara - 0.1, camC2],
    [C.prepara + 0.7, camD],
    [C.fim - 0.1, camD2],
    [C.fim + 1.6, camFim],
  ]);
  return cinematizar(base, t / FIM, {arco: 0.05, grua: 0.02});
};

// ---------- Mundo 3D ----------
const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const ouro = tema.acento;
  // A: calendário vira de 2026 para 2027
  const vira = rampa(t, T.teste - 0.25, T.teste + 0.45);
  const ano = vira > 0.5 ? '2027' : '2026';
  // B: PIS e COFINS afundam, CBS sobe
  const kVelho = entra(t, C.troca + 0.25) * sumir(t, T.acabam + 0.35, 0.6);
  const desce = rampa(t, T.acabam + 0.2, T.acabam + 0.9);
  const kCbs = entra(t, T.cbs - 0.1, 0.55);
  // C: IPI vai a zero, Seletivo nasce, objetos com plaquinhas
  const kIpi = entra(t, C.pecado + 0.3) * sumir(t, T.zera + 0.15, 0.6);
  const kSel = entra(t, T.seletivo - 0.1, 0.55);
  // D: nota fiscal, contrato e preços
  const kNota = entra(t, C.prepara + 0.3);
  const plaquinha = (texto: string, pos: V3, k: number) =>
    k < 0.02 ? null : (
      <group position={pos} scale={k}>
        <Placa tema={tema} pos={[0, 0, 0]} larg={0.62} alt={0.2} linhas={[{t: texto, tam: 150, cor: tema.fundo, peso: 700}]} fundo={ouro} brilho={0.35} />
      </group>
    );
  return (
    <>
      <Particulas t={t} centro={[7.5, 2.4, -1]} raio={13} n={70} cor={mistura(ouro, tema.branco, 0.3)} opacidade={0.35} />
      {/* A */}
      <Caixa args={[1.9, 0.5, 1.2]} raio={0.06} cor={tema.objetoEscuro} position={[XA, 0.25, 0]} />
      <CalendarioAno tema={tema} pos={[XA, 1.35, 0]} escala={1.25 * entra(t, 0.05, 0.6)} ano={ano} vira={vira} destaque={rampa(t, T.teste + 0.2, T.cobrar)} />
      {/* B */}
      <Caixa args={[3.0, 0.5, 1.2]} raio={0.06} cor={tema.objetoEscuro} position={[XB, 0.25, 0]} />
      <FichaImposto tema={tema} pos={[XB - 0.8, 1.15 - 0.9 * desce, 0.1]} k={1.25 * kVelho} texto="PIS" />
      <FichaImposto tema={tema} pos={[XB + 0.8, 1.15 - 0.9 * desce, 0.1]} k={1.25 * kVelho} texto="COFINS" larg={1.2} />
      <FichaImposto tema={tema} pos={[XB, 1.0 + 0.35 * kCbs, 0.15]} k={1.6 * kCbs} texto="CBS" novo brilho={0.6 * rampa(t, T.cbs, T.cbs + 0.5)} />
      {/* C */}
      <Caixa args={[3.6, 0.5, 1.5]} raio={0.06} cor={tema.objetoEscuro} position={[XC, 0.25, 0.2]} />
      <FichaImposto tema={tema} pos={[XC, 1.75, -0.2]} k={1.2 * kIpi} texto="IPI" />
      <FichaImposto tema={tema} pos={[XC, 1.95, -0.2]} k={1.25 * kSel} texto="SELETIVO" novo larg={1.6} brilho={0.4} />
      <MacoCigarro tema={tema} pos={[XC - 1.15, 0.5, 0.45]} escala={1.3 * entra(t, T.cigarro - 0.15)} rotY={0.3} />
      <Garrafa tema={tema} pos={[XC, 0.5, 0.45]} escala={1.15 * entra(t, T.bebida - 0.15)} />
      <Carro tema={tema} pos={[XC + 1.2, 0.5, 0.45]} rotY={-0.6} escala={0.42 * entra(t, T.carro - 0.15)} cor={tema.objeto} />
      {plaquinha('cigarro', [XC - 1.15, 1.35, 0.5], entra(t, T.cigarro))}
      {plaquinha('bebida', [XC, 1.45, 0.5], entra(t, T.bebida))}
      {plaquinha('carro', [XC + 1.2, 1.2, 0.5], entra(t, T.carro))}
      {/* D */}
      <Caixa args={[3.6, 0.5, 1.5]} raio={0.06} cor={tema.objetoEscuro} position={[XD, 0.25, 0.1]} />
      <NotaFiscal tema={tema} pos={[XD - 0.9, 0.5, 0.1]} escala={1.0 * kNota} desenrola={rampa(t, C.prepara + 0.3, T.nota + 0.2)} tributos={rampa(t, T.cbsibs, T.cbsibs + 0.5)} separa={rampa(t, T.cbsibs + 0.2, T.cbsibs + 0.8)} imposto={rampa(t, T.cbsibs + 0.4, T.cbsibs + 0.9)} />
      <Contrato tema={tema} pos={[XD + 0.55, 0.52, 0.25]} rot={[0.35, -0.2, 0]} escala={1.5 * entra(t, T.contratos - 0.2)} />
      <PilhaMoedas tema={tema} pos={[XD + 1.35, 0.5, 0.45]} n={8 * rampa(t, T.precos - 0.1, T.precos + 0.7)} cor={ouro} r={0.2} brilho={0.3} />
    </>
  );
};

// ---------- Interface 2D no estilo Berni ----------
const desliza = (t: number, a: number, b: number) => {
  const e = interpolate(t, [a, a + 0.5], [0, 1], {...clamp, easing: sai});
  const s = b > 0 ? interpolate(t, [b - 0.35, b], [0, 1], clamp) : 0;
  return {opacity: e * (1 - s), transform: `translateX(${(1 - e) * 60 - s * 60}px)`};
};

const Rotulo: React.FC<{tema: Tema; texto: string; t: number; a: number}> = ({tema, texto, t, a}) => (
  <div>
    <div style={{fontFamily: FONTE, fontSize: 26, fontWeight: 500, letterSpacing: 7, color: tema.acento}}>{texto}</div>
    <div style={{width: 70 * rampa(t, a + 0.15, a + 0.7), height: 2, background: tema.acento, marginTop: 14}} />
  </div>
);

const Titulo: React.FC<{tema: Tema; linhas: string[]; tam?: number}> = ({tema, linhas, tam = 86}) => (
  <div style={{marginTop: 26}}>
    {linhas.map((l, k) => (
      <div key={k} style={{fontFamily: FONTE, fontSize: tam, fontWeight: 300, lineHeight: 1.08, letterSpacing: -1, color: tema.acento}}>
        {l}
      </div>
    ))}
  </div>
);

const Corpo: React.FC<{tema: Tema; children: React.ReactNode; op?: number}> = ({tema, children, op = 1}) => (
  <div style={{marginTop: 30, paddingLeft: 24, borderLeft: `3px solid ${tema.acento}`, fontFamily: FONTE, fontSize: 36, fontWeight: 400, lineHeight: 1.3, color: tema.texto, opacity: op, maxWidth: 780}}>
    {children}
  </div>
);

const Bloco: React.FC<{t: number; a: number; b: number; children: React.ReactNode; top?: number}> = ({t, a, b, children, top = 360}) => {
  const st = desliza(t, a, b);
  if (st.opacity <= 0.01) return null;
  return <div style={{position: 'absolute', left: SEGURO.esq + 10, right: W - SEGURO.dir + 40, top, ...st}}>{children}</div>;
};

const Check: React.FC<{tema: Tema; texto: string; k: number}> = ({tema, texto, k}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, opacity: k, transform: `translateX(${(1 - k) * 30}px)`}}>
    <div style={{width: 44, height: 44, borderRadius: 22, border: `2px solid ${tema.acento}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tema.acento, fontFamily: FONTE, fontSize: 26, fontWeight: 600}}>✓</div>
    <div style={{fontFamily: FONTE, fontSize: 36, fontWeight: 400, color: tema.texto}}>{texto}</div>
  </div>
);

// cabeçalho fixo: monograma + nome do escritório
const Cabecalho: React.FC<{tema: Tema; op: number}> = ({tema, op}) => (
  <div style={{position: 'absolute', top: SEGURO.topo + 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '10px 26px', borderRadius: 40, background: 'rgba(16,15,14,0.55)', border: `1px solid ${tema.cartaoBorda}`}}>
      <div style={{fontFamily: SERIF, fontSize: 40, color: tema.acento, lineHeight: 1}}>B</div>
      <div style={{width: 1, height: 30, background: tema.cartaoBorda}} />
      <div style={{fontFamily: FONTE, fontSize: 22, fontWeight: 500, letterSpacing: 6, color: tema.texto}}>BERNI ADVOGADOS</div>
    </div>
  </div>
);

// o "B" grande, cortado na direita (assinatura visual dos posts)
const GrandeB: React.FC<{tema: Tema; t: number; op: number}> = ({tema, t, op}) => (
  <div style={{position: 'absolute', right: -170, top: 470 - t * 4, fontFamily: SERIF, fontSize: 1100, lineHeight: 1, color: tema.acento, opacity: 0.1 * op, pointerEvents: 'none'}}>B</div>
);

const Setas: React.FC<{tema: Tema; t: number; op: number; top?: number; left?: number}> = ({tema, t, op, top = 1440, left = 860}) => (
  <div style={{position: 'absolute', top, left, display: 'flex', gap: 2, opacity: op}}>
    {[0, 1, 2].map((k) => (
      <div key={k} style={{fontFamily: FONTE, fontSize: 64, fontWeight: 200, color: tema.acento, opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 3 - k * 0.7))}}>›</div>
    ))}
  </div>
);

// ---------- Kit Mapas: Brasil tingido de dourado ----------
const TrechoMapa: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 9, dur - 9, dur], [0, 1, 1, 0], clamp);
  const zoom = interpolate(f, [0, dur], [1.04, 1.12], clamp);
  return (
    <AbsoluteFill style={{opacity: op, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: 'grayscale(1) sepia(1) saturate(1.5) hue-rotate(-6deg) brightness(0.6) contrast(1.25)'}}>
        <OffthreadVideo src={staticFile(`${P}/mapas/brasil.mp4`)} muted playbackRate={0.38} style={{width: W, height: H}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,15,14,0.92) 0%, rgba(16,15,14,0.35) 34%, rgba(16,15,14,0.2) 55%, rgba(16,15,14,0.85) 100%)'}} />
    </AbsoluteFill>
  );
};

const Interface: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const barra = interpolate(t, [T.p113 - 0.3, T.p113 + 0.6], [0, 1], {...clamp, easing: sai});
  const pct = (11.3 * barra).toFixed(1).replace('.', ',');
  return (
    <>
      <Bloco t={t} a={0.15} b={C.troca}>
        <Rotulo tema={tema} texto="REFORMA TRIBUTÁRIA" t={t} a={0.15} />
        <Titulo tema={tema} linhas={['2027: o ano', 'da virada']} />
        <Corpo tema={tema} op={rampa(t, T.teste - 0.2, T.teste + 0.3)}>
          Sai o teste. <b>Começa a cobrança.</b>
        </Corpo>
      </Bloco>
      <Bloco t={t} a={C.troca + 0.1} b={C.mapa}>
        <Rotulo tema={tema} texto="O QUE ACABA" t={t} a={C.troca + 0.1} />
        <Titulo tema={tema} linhas={['PIS e Cofins', 'dão lugar à CBS']} />
        <Corpo tema={tema} op={rampa(t, T.entra - 0.2, T.cbs + 0.2)}>
          A <b>CBS</b> é o novo tributo federal sobre o consumo.
        </Corpo>
      </Bloco>
      <Bloco t={t} a={C.mapa + 0.1} b={C.pecado}>
        <Rotulo tema={tema} texto="ALÍQUOTA DE REFERÊNCIA" t={t} a={C.mapa + 0.1} />
        <Titulo tema={tema} linhas={['Quanto vai', 'custar a CBS?']} />
      </Bloco>
      <Bloco t={t} a={T.tcu} b={C.pecado} top={900}>
        <div style={{fontFamily: FONTE, fontSize: 30, letterSpacing: 1, color: tema.texto, opacity: 0.9}}>Calculada pelo TCU para 2027</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 18}}>
          <div style={{width: 560, height: 26, background: 'rgba(255,255,255,0.08)', borderRadius: 3}}>
            <div style={{width: 560 * barra, height: 26, borderRadius: 3, background: `linear-gradient(90deg, ${mistura(tema.acento, tema.fundo, 0.35)}, ${tema.acento})`}} />
          </div>
          <div style={{fontFamily: FONTE, fontSize: 92, fontWeight: 300, color: tema.acento}}>{pct}%</div>
        </div>
        <div
          style={{
            marginTop: 50,
            display: 'inline-block',
            padding: '22px 30px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${tema.cartaoBorda}`,
            opacity: rampa(t, T.senado - 0.15, T.senado + 0.35),
          }}
        >
          <div style={{fontFamily: FONTE, fontSize: 24, letterSpacing: 5, color: tema.acento}}>DECISÃO FINAL</div>
          <div style={{fontFamily: FONTE, fontSize: 44, fontWeight: 300, color: tema.texto, marginTop: 6}}>→ Senado Federal</div>
        </div>
      </Bloco>
      <Bloco t={t} a={C.pecado + 0.1} b={C.prepara}>
        <Rotulo tema={tema} texto="O QUE MUDA" t={t} a={C.pecado + 0.1} />
        <Titulo tema={tema} linhas={['IPI zerado e', 'Imposto Seletivo']} />
        <Corpo tema={tema} op={rampa(t, T.seletivo, T.seletivo + 0.5)}>
          Sobre o que faz mal <b>à saúde</b> ou <b>ao meio ambiente</b>.
        </Corpo>
      </Bloco>
      <Bloco t={t} a={C.prepara + 0.1} b={C.fim}>
        <Rotulo tema={tema} texto="PREPARE-SE" t={t} a={C.prepara + 0.1} />
        <Titulo tema={tema} linhas={['Para não ter', 'surpresa']} />
        <div style={{marginTop: 18}}>
          <Check tema={tema} texto="Nota fiscal com CBS e IBS" k={rampa(t, T.nota - 0.2, T.nota + 0.3)} />
          <Check tema={tema} texto="Preços revistos com o contador" k={rampa(t, T.precos - 0.2, T.precos + 0.3)} />
          <Check tema={tema} texto="Contratos longos revisados" k={rampa(t, T.contratos - 0.2, T.contratos + 0.3)} />
        </div>
      </Bloco>
    </>
  );
};

// ---------- Fecho: assinatura ----------
const Assinatura: React.FC<{t: number; tema: Tema}> = ({t, tema}) => {
  const k = rampa(t, C.fim, C.fim + 0.8);
  if (k <= 0.01) return null;
  const k2 = rampa(t, T.estrategia - 0.2, T.estrategia + 0.5);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, rgba(70,55,32,${0.55 * k}) 0%, rgba(16,15,14,${0.9 * k}) 60%)`}} />
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 30}px)`}}>
        <div style={{fontFamily: SERIF, fontSize: 300, lineHeight: 1, color: tema.acento}}>B</div>
        <div style={{fontFamily: SERIF, fontSize: 92, letterSpacing: 26, color: tema.acento, marginTop: 10, marginLeft: 26}}>BERNI</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 8}}>
          <div style={{width: 90, height: 1, background: tema.acento}} />
          <div style={{fontFamily: FONTE, fontSize: 24, letterSpacing: 10, color: tema.acento}}>ADVOGADOS</div>
          <div style={{width: 90, height: 1, background: tema.acento}} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 1000, left: 80, right: 80, textAlign: 'center', opacity: k2}}>
        <div style={{fontFamily: FONTE, fontSize: 46, fontWeight: 300, color: tema.texto, lineHeight: 1.25}}>Estratégia jurídica para<br />empresas e famílias</div>
        <div style={{fontFamily: FONTE, fontSize: 28, color: tema.textoSuave, marginTop: 26}}>Campinas/SP · Atendemos todo o Estado de São Paulo</div>
        <div style={{fontFamily: FONTE, fontSize: 22, color: tema.textoSuave, marginTop: 18, opacity: 0.8}}>Conteúdo informativo. Não substitui a análise do seu caso.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Sons ----------
type Som = {t: number; f: SomEstudio; v: number};
const SONS: Som[] = [
  {t: 0.1, f: 'subida', v: 0.14},
  {t: T.teste, f: 'whoosh', v: 0.16},
  {t: C.troca, f: 'whoosh', v: 0.18},
  {t: T.acabam + 0.3, f: 'baque', v: 0.14},
  {t: T.cbs, f: 'ding', v: 0.2},
  {t: C.mapa, f: 'whoosh', v: 0.18},
  {t: T.p113, f: 'subida', v: 0.16},
  {t: T.senado, f: 'tique', v: 0.16},
  {t: C.pecado, f: 'whoosh', v: 0.18},
  {t: T.zera + 0.2, f: 'baque', v: 0.13},
  {t: T.seletivo, f: 'pop', v: 0.16},
  {t: T.cigarro, f: 'pop', v: 0.12},
  {t: T.bebida, f: 'pop', v: 0.12},
  {t: T.carro, f: 'pop', v: 0.12},
  {t: C.prepara, f: 'whoosh', v: 0.18},
  {t: T.nota, f: 'tique', v: 0.18},
  {t: T.precos, f: 'tique', v: 0.18},
  {t: T.contratos, f: 'tique', v: 0.18},
  {t: C.fim + 0.1, f: 'ding', v: 0.2},
];
export const FAIXAS: Faixa[] = [{...narracao(P), saida: 0.4}, ...SONS.map((x) => efeito(x.f, x.t, x.v))];

export const REVISAO: number[] = [0.6, T.teste + 0.6, T.cobrar + 0.4, T.pis + 0.3, T.acabam + 0.8, T.cbs + 0.6, T.tcu + 0.4, T.p113 + 0.8, T.senado + 0.6, T.ipi + 0.5, T.zera + 0.7, T.seletivo + 0.5, T.carro + 0.5, T.para + 0.6, T.nota + 0.5, T.precos + 0.5, T.contratos + 0.4, T.berni + 0.6, T.estrategia + 0.8, FIM - 0.3];

type Props = {guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]};
export const Cbs2027Berni: React.FC<Props> = ({guia, semInterface, estilo = 'berni', faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const i = cenaEm(t);
  const cam = camEm(t);
  const dt = t - CENAS[i];
  const zoom = 1 + 0.025 * (1 - interpolate(dt, [0, 0.8], [0, 1], {...clamp, easing: sai}));
  const mundo = (
    <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={24} centro={[7.5, 0, 0]} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema raioAO={0.5} vinheta={0.55} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  const mapaDe = Math.round(C.mapa * FPS);
  const mapaAte = Math.round(C.pecado * FPS);
  const opCab = 1 - rampa(t, C.fim, C.fim + 0.5);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>{mundo}</AbsoluteFill>
      {/* luz quente (filtro dos posts) */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 20% 15%, rgba(190,154,98,0.22) 0%, rgba(190,154,98,0) 55%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,15,14,0.88) 0%, rgba(16,15,14,0.55) 30%, rgba(16,15,14,0) 46%, rgba(16,15,14,0) 78%, rgba(16,15,14,0.6) 100%)'}} />
      <GrandeB tema={tema} t={t} op={1 - rampa(t, C.mapa - 0.3, C.mapa + 0.2) + rampa(t, C.pecado, C.pecado + 0.5) - rampa(t, C.fim - 0.3, C.fim)} />
      <Sequence from={mapaDe} durationInFrames={mapaAte - mapaDe} layout="none">
        <TrechoMapa dur={mapaAte - mapaDe} />
      </Sequence>
      <Interface t={t} tema={tema} />
      <Assinatura t={t} tema={tema} />
      <Cabecalho tema={tema} op={opCab * rampa(t, 0, 0.5)} />
      <Setas tema={tema} t={t} op={opCab * 0.9} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} tam={50} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};

// ---------- Capa (no molde da capa dos carrosséis) ----------
export const CapaCbs2027Berni: React.FC<{estilo?: string; fundo?: string}> = ({estilo = 'berni', fundo = `${P}/capa/fundo-limpo.jpg`}) => {
  const tema = temaPorId(estilo);
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <Img src={staticFile(fundo)} style={{position: 'absolute', left: 0, top: 260, width: W, height: H}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 25% 30%, rgba(190,154,98,0.2) 0%, rgba(190,154,98,0) 55%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(16,15,14,0.97) 0%, rgba(16,15,14,0.85) 38%, rgba(16,15,14,0.1) 62%, rgba(16,15,14,0.7) 100%)'}} />
      <GrandeB tema={tema} t={0} op={1.4} />
      <Cabecalho tema={tema} op={1} />
      <div style={{position: 'absolute', left: SEGURO.esq + 10, right: 120, top: 420}}>
        <Rotulo tema={tema} texto="REFORMA TRIBUTÁRIA" t={5} a={0} />
        <Titulo tema={tema} linhas={['CBS em 2027:', 'o que muda', 'para a sua', 'empresa?']} tam={112} />
        <Corpo tema={tema}>PIS e Cofins acabam. Veja como se preparar.</Corpo>
      </div>
      <Setas tema={tema} t={0.5} op={1} top={1380} />
    </AbsoluteFill>
  );
};
