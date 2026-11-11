import React from 'react';
import {Caixa, Placa, type V3} from '../../base/pecas';
import type {Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Peças novas do 011 (demissão por voto). Tudo fosco, sem logo e sem rosto; texto fixo por peça.

const k01 = (x: number) => Math.max(0, Math.min(1, x));

// ---------- Parede do meio do palco: vão da porta no centro e um letreiro de cada lado ----------
// Base no chão do palco, centrada em x = 0, espessura em z. A porta (catálogo) entra no vão.
export const PAREDE = {larg: 12, alt: 3.4, esp: 0.3, vao: 1.2, altVao: 2.3};
export const ParedeMeio: React.FC<{tema: Tema; frente: string; fundo: string; luzFrente?: number; luzFundo?: number}> = ({tema, frente, fundo, luzFrente = 0, luzFundo = 0}) => {
  const {larg, alt, esp, vao, altVao} = PAREDE;
  const lado = (larg - vao) / 2;
  const cor = mistura(tema.objetoEscuro, tema.objeto, 0.35);
  return (
    <group>
      {[-1, 1].map((s) => (
        <Caixa key={s} args={[lado, alt, esp]} raio={0.05} cor={cor} position={[s * (vao / 2 + lado / 2), alt / 2, 0]} />
      ))}
      <Caixa args={[vao + 0.02, alt - altVao, esp]} raio={0.04} cor={cor} position={[0, altVao + (alt - altVao) / 2, 0]} />
      {/* Letreiro na parede, em cima da porta: um em cada face */}
      {[
        {lado: 1, texto: frente, luz: luzFrente, tam: 170},
        {lado: -1, texto: fundo, luz: luzFundo, tam: 170},
      ].map(({lado, texto, luz, tam}) => (
        <group key={lado} position={[0, altVao + (alt - altVao) / 2, lado * (esp / 2 + 0.04)]} rotation={[0, lado < 0 ? Math.PI : 0, 0]}>
          <Caixa args={[3.0, 0.7, 0.07]} raio={0.04} cor={tema.objetoEscuro} />
          <Caixa args={[2.84, 0.56, 0.01]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.acento, 0.8 * luz)} emissivo={0.3 * luz} sombra={false} position={[0, 0, 0.04]} />
          <Placa tema={tema} pos={[0, 0, 0.05]} larg={2.74} alt={0.48} linhas={[{t: texto, tam, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
        </group>
      ))}
    </group>
  );
};

// ---------- Telão dos posts, preso na parede (frente z+) ----------
// `k` liga a tela; `topo` mostra a linha do 2º turno; `posts` [k1, k2] fazem cada cartão entrar.
export const TelaoPosts: React.FC<{tema: Tema; pos: V3; k: number; topo: number; posts: [number, number]}> = ({tema, pos, k, topo, posts}) => {
  const tela = mistura(tema.fundo, tema.objetoEscuro, 0.5 + 0.3 * k);
  const cartao = (y: number, kk: number, linhas: string[], tam: number) =>
    kk < 0.02 ? null : (
      <group position={[0, y, 0.09]} scale={[Math.min(1.05, kk), Math.min(1.05, kk), 1]}>
        <Caixa args={[3.0, 0.62, 0.02]} raio={0.06} cor={tema.objeto} sombra={false} />
        <Caixa args={[0.08, 0.5, 0.012]} raio={0.02} cor={tema.objetoClaro} sombra={false} position={[-1.38, 0, 0.012]} />
        <Placa tema={tema} pos={[0.06, 0, 0.016]} larg={2.7} alt={0.54} linhas={linhas.map((t) => ({t, tam, cor: tema.objetoClaro, peso: 900}))} brilho={0.3} />
      </group>
    );
  return (
    <group position={pos}>
      <Caixa args={[3.6, 2.1, 0.12]} raio={0.06} cor={tema.objetoEscuro} />
      <Caixa args={[3.36, 1.86, 0.02]} raio={0.04} cor={tela} emissivo={0.15 * k} sombra={false} position={[0, 0, 0.07]} />
      {topo > 0.02 ? (
        <group position={[0, 0.66, 0.09]} scale={Math.min(1, topo)}>
          <Placa tema={tema} pos={[0, 0, 0]} larg={2.6} alt={0.3} linhas={[{t: '2º TURNO · 25/10', tam: 120, cor: tema.textoSuave, peso: 800, mono: true}]} brilho={0.3} />
        </group>
      ) : null}
      {cartao(0.12, posts[0], ['DEMITA PETISTA'], 170)}
      {cartao(-0.6, posts[1], ['NÃO CONTRATE QUEM', 'VOTOU NO LULA'], 120)}
    </group>
  );
};

// ---------- Lista da lei (folha em pé que sobe do livro, frente z+) ----------
// `acesos[i]` 0..1 faz a linha i entrar e acender; `destaque` marca as linhas que acendem no acento.
export const ListaLei: React.FC<{tema: Tema; pos: V3; escala: number; titulo: string; itens: string[]; acesos: number[]; destaque?: number[]}> = ({tema, pos, escala, titulo, itens, acesos, destaque = []}) => {
  if (escala < 0.02) return null;
  const h = 0.62 + 0.42 * itens.length;
  return (
    <group position={pos} scale={escala}>
      <Caixa args={[2.0, h, 0.05]} raio={0.04} cor={tema.objetoClaro} position={[0, h / 2, 0]} />
      <Placa tema={tema} pos={[0, h - 0.28, 0.03]} larg={1.8} alt={0.3} linhas={[{t: titulo, tam: 120, cor: tema.objetoEscuro, peso: 900, mono: true}]} brilho={0.15} />
      {itens.map((txt, i) => {
        const a = k01(acesos[i] ?? 0);
        const d = destaque.includes(i);
        const y = h - 0.72 - i * 0.42;
        return (
          <group key={i} position={[0, y, 0.03]}>
            <Caixa args={[1.76, 0.34, 0.012]} raio={0.03} cor={mistura(mistura(tema.objetoClaro, tema.objeto, 0.35), d ? tema.acento : tema.objeto, a)} emissivo={d ? 0.3 * a : 0} sombra={false} />
            {a > 0.02 ? (
              <group scale={[Math.min(1, a * 1.4), Math.min(1, a * 1.4), 1]}>
                <Placa tema={tema} pos={[0, 0, 0.012]} larg={1.6} alt={0.28} linhas={[{t: txt, tam: 130, cor: d ? tema.fundo : tema.objetoClaro, peso: 900}]} brilho={0.2} />
              </group>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Plaquinha de pé no chão (VOLTAR, EM DOBRO) ----------
export const PlacaChao: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; texto: string; aceso: number}> = ({tema, pos, rotY = 0, escala, texto, aceso}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.07, 1.0, 0.07]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.5, 0]} />
      <Caixa args={[1.25, 0.44, 0.06]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.acento, aceso)} emissivo={0.3 * aceso} position={[0, 1.1, 0.04]} />
      <Placa tema={tema} pos={[0, 1.1, 0.075]} larg={1.15} alt={0.36} linhas={[{t: texto, tam: 170, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
    </group>
  );

// ---------- Mesa de trabalho pequena com monitor (frente z+) ----------
export const MESA_TOPO = 0.78;
export const MesaTrabalho: React.FC<{tema: Tema; pos: V3; rotY?: number; tela?: number}> = ({tema, pos, rotY = 0, tela = 0.3}) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <Caixa args={[1.5, 0.06, 0.8]} raio={0.02} cor={mistura(tema.areia, tema.objetoEscuro, 0.3)} position={[0, MESA_TOPO - 0.03, 0]} />
    {[-1, 1].map((sx) => [-1, 1].map((sz) => <Caixa key={`${sx}${sz}`} args={[0.06, MESA_TOPO - 0.06, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[sx * 0.68, (MESA_TOPO - 0.06) / 2, sz * 0.33]} />))}
    {/* Monitor virado para quem trabalha (z−), costas para a câmera */}
    <Caixa args={[0.08, 0.26, 0.08]} raio={0.02} cor={tema.objetoEscuro} position={[0.55, MESA_TOPO + 0.13, 0.05]} />
    <Caixa args={[0.5, 0.32, 0.05]} raio={0.03} cor={tema.objetoEscuro} position={[0.55, MESA_TOPO + 0.36, 0.05]} />
    <Caixa args={[0.42, 0.24, 0.01]} raio={0.02} cor={mistura(tema.objetoEscuro, tema.ceuLuz, tela)} emissivo={0.3 * tela} sombra={false} position={[0.55, MESA_TOPO + 0.36, 0.02]} />
    <Caixa args={[0.4, 0.02, 0.16]} raio={0.008} cor={tema.objeto} position={[-0.25, MESA_TOPO + 0.01, 0.18]} />
  </group>
);

// ---------- Folha em pé num suporte, com carimbo (frente z+) ----------
export const FolhaCarimbo: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; texto: string[]; carimbo: number; textoCarimbo: string; corCarimbo: string}> = ({tema, pos, rotY = 0, escala, texto, carimbo, textoCarimbo, corCarimbo}) => {
  if (escala < 0.02) return null;
  const c = k01(carimbo);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.6, 0.08, 0.4]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.04, -0.1]} />
      <group position={[0, 0.85, 0]} rotation={[-0.1, 0, 0]}>
        <Caixa args={[1.0, 1.3, 0.025]} raio={0.01} cor={tema.objetoClaro} />
        <Placa tema={tema} pos={[0, 0.38, 0.016]} larg={0.9} alt={0.36} linhas={texto.map((t) => ({t, tam: 150, cor: tema.objetoEscuro, peso: 900, mono: true}))} brilho={0.2} />
        {[0.0, -0.12, -0.24].map((y) => (
          <Caixa key={y} args={[0.74, 0.035, 0.01]} raio={0.008} cor={tema.objeto} sombra={false} position={[0, y, 0.016]} />
        ))}
        {c > 0.02 && c < 0.999 ? (
          <group position={[0.05, -0.1, 0.25 + 0.9 * (1 - Math.min(1, c * 1.6))]}>
            <Caixa args={[0.5, 0.26, 0.16]} raio={0.03} cor={tema.objetoEscuro} />
          </group>
        ) : null}
        {c > 0.6 ? (
          <group position={[0.02, -0.14, 0.02]} rotation={[0, 0, 0.1]} scale={Math.min(1, (c - 0.6) / 0.15)}>
            <Caixa args={[0.94, 0.26, 0.008]} raio={0.02} cor={corCarimbo} emissivo={0.25} sombra={false} />
            <Placa tema={tema} pos={[0, 0, 0.006]} larg={0.88} alt={0.2} linhas={[{t: textoCarimbo, tam: 150, cor: tema.fundo, peso: 900, mono: true}]} brilho={0.3} />
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Celular grande da denúncia (frente z+) ----------
// `linhas` [prints, áudios, testemunhas] 0..1; `denuncia` 0..1 troca a tela para a do MPT.
export const CelularDenuncia: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; linhas: [number, number, number]; denuncia: number}> = ({tema, pos, rot = [0, 0, 0], escala, linhas, denuncia}) => {
  if (escala < 0.02) return null;
  const a = k01(1 - 2 * denuncia);
  const b = k01(2 * denuncia - 1);
  const nomes = ['PRINTS', 'ÁUDIOS', 'TESTEMUNHAS'];
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.0, 2.0, 0.1]} raio={0.12} cor={mistura(tema.fundo, tema.objetoEscuro, 0.8)} />
      <Caixa args={[0.88, 1.8, 0.02]} raio={0.08} cor={mistura(tema.objetoEscuro, tema.objeto, 0.4)} emissivo={0.08} sombra={false} position={[0, 0, 0.055]} />
      {a > 0.02 ? (
        <group scale={[a, a, 1]}>
          <Placa tema={tema} pos={[0, 0.7, 0.07]} larg={0.8} alt={0.18} linhas={[{t: 'GUARDE AS PROVAS', tam: 110, cor: tema.textoSuave, peso: 800, mono: true}]} brilho={0.25} />
          {nomes.map((n, i) => {
            const k = k01(linhas[i]);
            if (k < 0.02) return null;
            return (
              <group key={n} position={[0, 0.32 - i * 0.36, 0.07]} scale={Math.min(1, k * 1.3)}>
                <Caixa args={[0.76, 0.28, 0.01]} raio={0.04} cor={tema.objetoEscuro} sombra={false} />
                <Caixa args={[0.12, 0.12, 0.012]} raio={0.03} cor={tema.acento} emissivo={0.35} sombra={false} position={[-0.27, 0, 0.008]} />
                <Placa tema={tema} pos={[0.08, 0, 0.01]} larg={0.52} alt={0.2} linhas={[{t: n, tam: 150, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
              </group>
            );
          })}
        </group>
      ) : null}
      {b > 0.02 ? (
        <group scale={[b, b, 1]}>
          <Caixa args={[0.8, 0.5, 0.012]} raio={0.06} cor={tema.acento} emissivo={0.3} sombra={false} position={[0, 0.45, 0.068]} />
          <Placa tema={tema} pos={[0, 0.45, 0.076]} larg={0.72} alt={0.42} linhas={[{t: 'DENÚNCIA', tam: 190, cor: tema.fundo, peso: 900}, {t: 'MPT', tam: 220, cor: tema.fundo, peso: 900}]} brilho={0.3} />
          <Placa tema={tema} pos={[0, -0.05, 0.07]} larg={0.8} alt={0.3} linhas={[{t: 'ASSÉDIO', tam: 150, cor: tema.objetoClaro, peso: 900}, {t: 'ELEITORAL', tam: 150, cor: tema.objetoClaro, peso: 900}]} brilho={0.3} />
          {[-0.36, -0.5].map((y) => (
            <Caixa key={y} args={[0.66, 0.06, 0.01]} raio={0.02} cor={tema.objeto} sombra={false} position={[0, y, 0.07]} />
          ))}
        </group>
      ) : null}
    </group>
  );
};
