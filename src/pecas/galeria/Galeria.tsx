// Galeria visual da biblioteca de peças: uma página (still 1080 × 1920) por categoria, até 30 peças por página.
// Cada peça é medida depois de montada e encolhida (ou ampliada) para caber na sua célula, então o tamanho
// na galeria NÃO é o tamanho real: confira as medidas no código ou no CATALOGO.md.
import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {AcabamentoCinema, Caixa, Camera, Palco, projetar, type Cam, type V3} from '../../base/pecas';
import {mistura} from '../../base/cores';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {temaPorId} from '../../estilo';
import {ITENS, type ItemGaleria} from './itens';

const W = 1080;
const H = 1920;
const T_GALERIA = 1.5; // instante usado nas peças que animam com o tempo

export type Categoria = {id: string; nome: string; arquivo: string; cols: number; linhas: number};

/** Categorias na ordem do CATALOGO.md. `id` vira o nome da composição (Pecas<Id><n>). */
export const CATEGORIAS: Categoria[] = [
  {id: 'Pessoas', nome: 'Pessoas e bonecos', arquivo: 'pessoas', cols: 5, linhas: 6},
  {id: 'Dinheiro', nome: 'Dinheiro e finanças', arquivo: 'dinheiro', cols: 5, linhas: 6},
  {id: 'Predios', nome: 'Prédios e cidade', arquivo: 'predios', cols: 5, linhas: 6},
  {id: 'Trabalho', nome: 'Trabalho e escritório', arquivo: 'trabalho', cols: 5, linhas: 6},
  {id: 'Justica', nome: 'Justiça e governo', arquivo: 'justica', cols: 5, linhas: 6},
  {id: 'Transporte', nome: 'Transporte', arquivo: 'transporte', cols: 5, linhas: 6},
  {id: 'Saude', nome: 'Saúde', arquivo: 'saude', cols: 5, linhas: 6},
  {id: 'Tecnologia', nome: 'Tecnologia e celulares', arquivo: 'tecnologia', cols: 5, linhas: 6},
  {id: 'Educacao', nome: 'Educação', arquivo: 'educacao', cols: 5, linhas: 6},
  {id: 'Esporte', nome: 'Esporte e jogos', arquivo: 'esporte', cols: 5, linhas: 6},
  {id: 'Natureza', nome: 'Natureza e clima', arquivo: 'natureza', cols: 5, linhas: 6},
  {id: 'Comunicacao', nome: 'Comunicação e mídia', arquivo: 'comunicacao', cols: 5, linhas: 6},
  {id: 'Casa', nome: 'Casa e consumo', arquivo: 'casa', cols: 5, linhas: 6},
  {id: 'Graficos', nome: 'Gráficos e números', arquivo: 'graficos', cols: 5, linhas: 6},
  {id: 'Simbolos', nome: 'Símbolos e ícones', arquivo: 'simbolos', cols: 5, linhas: 6},
  {id: 'Cenarios', nome: 'Cenários (mundos inteiros)', arquivo: 'cenarios', cols: 3, linhas: 4},
];

export type Pagina = {id: string; categoria: Categoria; n: number; total: number; itens: ItemGaleria[]; arquivo: string};

/** Todas as páginas da galeria (uma categoria pode ocupar mais de uma página). */
export const PAGINAS: Pagina[] = CATEGORIAS.flatMap((c) => {
  const lista = ITENS[c.arquivo] ?? [];
  const total = Math.max(1, Math.ceil(lista.length / (c.cols * c.linhas)));
  const por = Math.ceil(lista.length / total); // páginas equilibradas (33 peças: 17 + 16)
  return Array.from({length: total}, (_, k) => ({
    id: `Pecas${c.id}${k + 1}`,
    categoria: c,
    n: k + 1,
    total,
    itens: lista.slice(k * por, (k + 1) * por),
    arquivo: `${c.nome.toLowerCase().replace(/[()]/g, '')} ${k + 1}.jpg`,
  }));
});

// ---------- Grade ----------
// Poucas peças na página: menos colunas e células maiores. A grade fica centrada abaixo do título.
const CEL_L = 3.7; // largura de uma célula (m)
const TOPO = 150; // px reservados para o título
const geometria = (c: Categoria, n: number) => {
  const cols = Math.min(c.cols, n <= 4 ? 2 : n <= 9 ? 3 : n <= 16 ? 4 : 5);
  const linhas = Math.max(1, Math.ceil(n / cols));
  const celL = CEL_L;
  const celA = celL * 1.22;
  const largura = celL * cols;
  const altura = celA * linhas;
  const centroY = altura / 2;
  // câmera longe e fechada: quase sem perspectiva, todas as células do mesmo tamanho
  const fov = 12;
  const util = H - TOPO - 110; // sobra embaixo para os nomes da última linha
  const altVisivel = Math.max((altura * H) / util, ((largura * 1.02) / W) * H);
  const d = altVisivel / (2 * Math.tan((fov * Math.PI) / 360));
  const ang = 0.2;
  // grade encostada embaixo do título (sobe = quantos px o alvo fica acima do meio do quadro)
  const gradePx = (altura / altVisivel) * H;
  const sobe = H / 2 - (TOPO + 20 + gradePx / 2);
  const cam: Cam = {pos: [0, centroY + d * Math.sin(ang), d * Math.cos(ang)], alvo: [0, centroY, 0], fov, sobe};
  const base = (i: number): V3 => {
    const col = i % cols;
    const lin = Math.floor(i / cols);
    return [(col - (cols - 1) / 2) * celL, (linhas - 1 - lin) * celA + 0.08, 0];
  };
  return {celL, celA, cols, largura, altura, centroY, cam, base, d};
};

// Mede cada peça depois de montada e põe dentro da célula: base no chão da célula, centrada em x e z.
const Encaixe: React.FC<{caixas: React.MutableRefObject<(THREE.Group | null)[]>; larg: number; alt: number}> = ({caixas, larg, alt}) => {
  const {advance} = useThree();
  const [espera] = useState(() => delayRender('Encaixando as peças da galeria'));
  useEffect(() => {
    let feito = false;
    const encaixar = () => {
      const caixa = new THREE.Box3();
      const tam = new THREE.Vector3();
      const centro = new THREE.Vector3();
      for (const g of caixas.current) {
        if (!g) continue;
        const dentro = g.children[0];
        if (!dentro) continue;
        dentro.scale.setScalar(1);
        dentro.position.set(0, 0, 0);
        g.updateMatrixWorld(true);
        caixa.makeEmpty();
        dentro.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh && !(o as THREE.Points).isPoints && !(o as THREE.Line).isLine) return;
          if (o.userData.foraDaMedida) return;
          caixa.expandByObject(o, false);
        });
        if (caixa.isEmpty()) continue;
        caixa.getSize(tam);
        caixa.getCenter(centro);
        const gp = new THREE.Vector3();
        g.getWorldPosition(gp);
        const s = Math.min(larg / Math.max(tam.x, tam.z * 0.85, 1e-3), alt / Math.max(tam.y, 1e-3), 60);
        dentro.scale.setScalar(s);
        dentro.position.set(-(centro.x - gp.x) * s, -(caixa.min.y - gp.y) * s, -(centro.z - gp.z) * s);
      }
    };
    // espera um quadro do navegador: algumas peças preenchem instancedMesh no próprio efeito
    const id = requestAnimationFrame(() => {
      encaixar();
      advance(performance.now());
      requestAnimationFrame(() => {
        advance(performance.now());
        feito = true;
        continueRender(espera);
      });
    });
    return () => {
      cancelAnimationFrame(id);
      if (!feito) continueRender(espera);
    };
  }, [advance, caixas, espera, larg, alt]);
  return null;
};

const Mundo: React.FC<{tema: Tema; pagina: Pagina}> = ({tema, pagina}) => {
  const g = geometria(pagina.categoria, pagina.itens.length);
  const caixas = useRef<(THREE.Group | null)[]>([]);
  const prateleira = mistura(tema.chao, tema.objetoEscuro, 0.5);
  return (
    <>
      {pagina.itens.map((it, i) => {
        const p = g.base(i);
        return (
          <group key={it.nome} position={p}>
            <Caixa args={[g.celL - 0.3, 0.1, g.celL * 0.62]} raio={0.04} cor={prateleira} position={[0, -0.05, 0]} castShadow={false} />
            <group ref={(o) => void (caixas.current[i] = o)}>
              <group>{it.peca(tema, T_GALERIA)}</group>
            </group>
          </group>
        );
      })}
      <Encaixe caixas={caixas} larg={g.celL * 0.8} alt={g.celA * 0.66} />
    </>
  );
};

export const PaginaGaleria: React.FC<{estilo?: string; pagina: string; arquivo?: string}> = ({estilo, pagina}) => {
  const tema = temaPorId(estilo);
  const pg = PAGINAS.find((p) => p.id === pagina) ?? PAGINAS[0];
  const g = geometria(pg.categoria, pg.itens.length);
  const tamNome = g.cols >= 5 ? 19 : g.cols === 4 ? 22 : 26;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <ThreeCanvas width={W} height={H} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: g.cam.fov, position: g.cam.pos, far: g.d * 4}}>
        <Palco tema={tema} semChao alcance={g.d * 3} sombraArea={Math.max(g.largura, g.altura) * 0.62} centro={[0, g.centroY, 0]} />
        <Camera {...g.cam} />
        <Mundo tema={tema} pagina={pg} />
        <AcabamentoCinema raioAO={0.25} vinheta={0.2} />
      </ThreeCanvas>
      {pg.itens.map((it, i) => {
        const p = g.base(i);
        const q = projetar([p[0], p[1] - 0.1, g.celL * 0.31], g.cam, W, H);
        const larg = (projetar([g.celL / 2, p[1], 0], g.cam, W, H).x - projetar([-g.celL / 2, p[1], 0], g.cam, W, H).x) * 0.98;
        return (
          <div key={it.nome} style={{position: 'absolute', left: q.x - larg / 2, top: q.y + 4, width: larg, textAlign: 'center', lineHeight: 1.15}}>
            <div style={{fontFamily: FONTE, fontSize: tamNome, fontWeight: 800, color: tema.texto, overflowWrap: 'anywhere'}}>{it.nome}</div>
            <div style={{fontFamily: MONO, fontSize: tamNome * 0.72, color: tema.textoSuave}}>{it.arquivo}.tsx</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 48, right: 48, top: 36, fontFamily: FONTE, fontSize: 46, fontWeight: 850, color: tema.texto}}>{pg.categoria.nome}</div>
      <div style={{position: 'absolute', left: 48, right: 48, top: 104, display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 20, color: tema.textoSuave}}>
        <div>import {'{'}...{'}'} from 'src/pecas'</div>
        <div style={{whiteSpace: 'nowrap'}}>
          {pg.total > 1 ? `página ${pg.n} de ${pg.total} · ` : ''}
          {pg.itens.length} peças · tamanhos fora de escala
        </div>
      </div>
    </AbsoluteFill>
  );
};
