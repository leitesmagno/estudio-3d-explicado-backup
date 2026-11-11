// Estúdio 3D Explicado · Palco (luz, chão, névoa) e AcabamentoCinema (pós-processamento)
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {EffectComposer, DepthOfField, N8AO, Vignette, ToneMapping, SMAA} from '@react-three/postprocessing';
import {ToneMappingMode, type DepthOfFieldEffect} from 'postprocessing';
import type {Tema} from '../tema';
import {ESCURO} from '../tema';
import type {Foco, V3} from './tipos';

// O pós-processamento desenha o quadro numa segunda passada. Sem preserveDrawingBuffer o navegador
// pode entregar ao Remotion um quadro vazio. Forçamos a opção em todo contexto WebGL criado na página,
// assim os vídeos não precisam lembrar de passar gl={{preserveDrawingBuffer: true}}.
if (typeof window !== 'undefined' && typeof HTMLCanvasElement !== 'undefined') {
  const marca = '__estudioPreserva';
  const proto = HTMLCanvasElement.prototype as unknown as Record<string, unknown>;
  if (!proto[marca]) {
    proto[marca] = true;
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, tipo: string, opcoes?: Record<string, unknown>) {
      if (tipo === 'webgl2' || tipo === 'webgl' || tipo === 'experimental-webgl') opcoes = {...(opcoes ?? {}), preserveDrawingBuffer: true};
      return (original as (t: string, o?: unknown) => RenderingContext | null).call(this, tipo, opcoes);
    } as typeof HTMLCanvasElement.prototype.getContext;
  }
}

// Tema do último Palco desenhado. Peças sem prop `tema` (Particulas, Onda, Vapor) usam este.
let temaAtivo: Tema = ESCURO;
export const usarTemaAtivo = (): Tema => temaAtivo;

/**
 * O estúdio: fundo, névoa, chão infinito e luz suave de cinema (principal com sombra macia,
 * preenchimento e contraluz). Coloque UM por ThreeCanvas, antes do resto.
 * - tema: paleta. alcance: até onde o mundo vai antes de sumir na névoa (padrão 230).
 * - sombraArea: meia largura da área com sombra em volta de `centro` (padrão 20). Mundo grande, valor maior.
 * - centro: centro da área de sombra (padrão [0, 0, 0]). semChao: esconde o chão.
 */
export const Palco: React.FC<{tema: Tema; alcance?: number; sombraArea?: number; centro?: V3; semChao?: boolean; luz?: number}> = ({tema, alcance = 230, sombraArea = 20, centro = [0, 0, 0], semChao, luz}) => {
  temaAtivo = tema;
  const f = luz ?? tema.luz ?? 1;
  const s = sombraArea;
  const alvo: V3 = centro;
  const sol: V3 = [centro[0] - s * 0.55, centro[1] + s * 1.3, centro[2] + s * 0.75];
  return (
    <>
      <color attach="background" args={[tema.fundo]} />
      <fog attach="fog" args={[tema.fundo, alcance * 0.22, alcance]} />
      <hemisphereLight args={[tema.ceu, tema.chao, 1.45 * f]} />
      <ambientLight color={tema.luzCor} intensity={0.18 * f} />
      {/* Luz principal: alta, à esquerda e à frente, sombra macia */}
      <directionalLight
        position={sol}
        color={tema.luzCor}
        intensity={2.6 * f}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-s}
        shadow-camera-right={s}
        shadow-camera-top={s}
        shadow-camera-bottom={-s}
        shadow-camera-near={0.5}
        shadow-camera-far={s * 5}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02 * Math.max(1, s / 20)}
        shadow-radius={6}
      >
        <object3D attach="target" position={alvo} />
      </directionalLight>
      {/* Preenchimento: lado oposto, fraco e frio */}
      <directionalLight position={[centro[0] + s, centro[1] + s * 0.5, centro[2] + s * 0.6]} color={tema.ceuLuz} intensity={0.45 * f} />
      {/* Contraluz: recorta as silhuetas do fundo */}
      <directionalLight position={[centro[0] + s * 0.2, centro[1] + s * 0.8, centro[2] - s * 1.2]} color={tema.luzCor} intensity={0.9 * f} />
      {semChao ? null : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centro[0], -0.001, centro[2]]} receiveShadow>
          <circleGeometry args={[alcance * 1.2, 96]} />
          <meshStandardMaterial color={tema.chao} roughness={0.95} metalness={0} />
        </mesh>
      )}
    </>
  );
};

// O Remotion pede o desenho do quadro antes de o pós-processamento ficar pronto.
// Este componente vem depois do EffectComposer e pede o desenho de novo, já com os efeitos.
const RenderDepoisDoComposer: React.FC<{assinatura: string}> = ({assinatura}) => {
  // Redesenha só quando o estado da cena muda (montagem, composer pronto) ou os efeitos mudam.
  // Nos quadros comuns o Remotion já desenha com os efeitos prontos: não gastamos o dobro.
  const estado = useThree();
  useEffect(() => {
    estado.advance(performance.now());
  }, [estado, assinatura]);
  return null;
};

/**
 * Acabamento de cinema: oclusão de ambiente (contato macio entre objetos), desfoque de lente,
 * vinheta leve, curva de tons neutra e antisserrilhado. Coloque por ÚLTIMO dentro do ThreeCanvas.
 * - foco: {dist, faixa, bokeh} (veja Foco; use focoAuto(cam) se não quiser pensar).
 * - raioAO: raio da oclusão em unidades do mundo (padrão 0.6). intensidadeAO: padrão 2.2.
 * - simples: desliga oclusão e desfoque (prévia rápida).
 * Sem grão animado e sem flash: seguro para fotossensibilidade.
 */
export const AcabamentoCinema: React.FC<{foco?: Foco; raioAO?: number; intensidadeAO?: number; vinheta?: number; simples?: boolean}> = ({foco, raioAO = 0.6, intensidadeAO = 2.2, vinheta = 0.42, simples}) => {
  const temFoco = !simples && foco && foco.bokeh > 0.05;
  // O efeito de desfoque é criado UMA vez (com o primeiro foco) e o foco é atualizado a cada quadro.
  // Passar a distância como prop recriaria o efeito e todos os passes em todo quadro (lento e vaza memória).
  const [inicial] = useState(() => ({dist: foco?.dist ?? 10, faixa: Math.max(0.05, foco?.faixa ?? 3)}));
  const dof = useRef<DepthOfFieldEffect>(null);
  useLayoutEffect(() => {
    const coc = dof.current?.cocMaterial as unknown as {worldFocusDistance: number; worldFocusRange: number} | undefined;
    if (!coc || !foco) return;
    coc.worldFocusDistance = foco.dist;
    coc.worldFocusRange = Math.max(0.05, foco.faixa);
  });
  return (
    <>
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <>{simples ? null : <N8AO aoRadius={raioAO} intensity={intensidadeAO} distanceFalloff={1} quality="medium" halfRes depthAwareUpsampling />}</>
      <>{temFoco ? <DepthOfField ref={dof} worldFocusDistance={inicial.dist} worldFocusRange={inicial.faixa} bokehScale={foco!.bokeh} resolutionScale={0.5} /> : null}</>
      <Vignette offset={0.32} darkness={vinheta} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <SMAA />
    </EffectComposer>
    <RenderDepoisDoComposer assinatura={`${simples ? 1 : 0}${temFoco ? 1 : 0}`} />
    </>
  );
};
