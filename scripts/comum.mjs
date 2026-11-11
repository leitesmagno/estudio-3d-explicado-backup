// Funções comuns dos scripts de render (Mac, Windows e Linux; caminhos com espaço e acento).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PUBLICA = path.join(RAIZ, 'projetos');
export const ENTRADA = path.join(RAIZ, 'src', 'index.ts');

/** Lê "--chave=valor" e "--chave valor"; o resto vira posicional. */
export const lerArgs = (argv = process.argv.slice(2)) => {
  const op = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, ...v] = a.slice(2).split('=');
      if (v.length) op[k] = v.join('=');
      else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) op[k] = argv[++i];
      else op[k] = true;
    } else pos.push(a);
  }
  return {op, pos};
};

/** Caminho do usuário (relativo à raiz do Estúdio ou absoluto). */
export const caminho = (p) => (path.isAbsolute(p) ? p : path.resolve(RAIZ, p));

/** Acha um Chrome/Chromium para o render. Ordem: --navegador, NAVEGADOR, REMOTION_BROWSER, Playwright no Linux. */
export const acharNavegador = (op = {}) => {
  const pedido = op.navegador || process.env.NAVEGADOR || process.env.REMOTION_BROWSER;
  if (pedido) {
    if (!fs.existsSync(pedido)) throw new Error(`Navegador não encontrado em "${pedido}".`);
    return pedido;
  }
  if (process.platform === 'linux') {
    for (const raiz of ['/opt/pw-browsers', path.join(os.homedir(), '.cache', 'ms-playwright')]) {
      if (!fs.existsSync(raiz)) continue;
      // o Remotion precisa do modo headless antigo: prefira o headless_shell
      const dirs = fs.readdirSync(raiz).sort().reverse();
      for (const d of dirs) {
        for (const rel of ['chrome-linux/headless_shell', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
          const c = path.join(raiz, d, rel);
          if (fs.existsSync(c)) return c;
        }
      }
    }
  }
  return null; // o Remotion baixa e usa o próprio navegador
};

/** Opções do Chromium. gl: angle (padrão no Mac/Windows), swangle (sem placa de vídeo), egl, swiftshader, vulkan. */
export const opcoesChromium = (op = {}) => {
  const gl = op.gl || process.env.ESTUDIO_GL || (process.platform === 'linux' ? 'swangle' : 'angle');
  return {gl, enableMultiProcessOnLinux: true};
};

export const lerProps = (op = {}) => {
  let props = {};
  if (op.props) {
    const p = caminho(op.props);
    props = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : JSON.parse(op.props);
  }
  if (op.estilo) props.estilo = op.estilo;
  return props;
};

// Regra 56 (coordenador, 09/11/2026): cada render empacota SÓ o vídeo pedido, com uma entrada própria gerada a partir
// do Root.tsx. Assim um vídeo de outra sessão pela metade (palavras.ts trocado, import faltando) não derruba os outros.
// Se não conseguir montar a entrada isolada, usa o Root inteiro como antes.
export const entradaIsolada = (comp) => {
  try {
    const raiz = fs.readFileSync(path.join(RAIZ, 'src', 'Root.tsx'), 'utf8').split('\n');
    const b = String(comp).replace(/^Capa/, '').replace(/(Guia|Limpo)$/, '');
    const ids = new Set([b, b + 'Guia', b + 'Limpo', 'Capa' + b]);
    const comps = raiz.filter((l) => { const m = l.match(/<(Composition|Still)\s+id="([^"]+)"/); return m && ids.has(m[2]); });
    if (!comps.some((l) => l.includes(`id="${comp}"`))) return null;
    const usados = new Set(comps.join(' ').match(/[A-Za-z_][A-Za-z0-9_]*/g));
    const imps = raiz.filter((l) => /^import .*'\.\/videos\//.test(l)).filter((l) => {
      const nomes = (l.match(/\{([^}]*)\}/) || ['', ''])[1].split(',').map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean);
      return nomes.some((n) => usados.has(n));
    });
    if (!imps.length) return null;
    const txt = [
      "// GERADO por scripts/comum.mjs (regra 56): entrada só deste vídeo. Não editar.",
      "import React from 'react';", "import {Composition, Still, registerRoot} from 'remotion';",
      "import {ALTURA, FPS, LARGURA} from './base/reels';", "import {ATIVO} from './estilo';",
      ...imps, '', 'const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;',
      'const Raiz: React.FC = () => (', '  <>', ...comps, '  </>', ');', 'registerRoot(Raiz);', ''].join('\n');
    const arq = path.join(RAIZ, 'src', `_entrada_${b}.tsx`);
    fs.writeFileSync(arq, txt);
    return arq;
  } catch (e) {
    return null;
  }
};

export const empacotar = async (comp) => {
  const {bundle} = await import('@remotion/bundler');
  const entrada = (comp && entradaIsolada(comp)) || ENTRADA;
  process.stdout.write(`Preparando o projeto (bundle${entrada === ENTRADA ? '' : ', só ' + comp})... `);
  // regra 65: a pasta pública vai por ATALHOS (symlinks), não cópia de ~9 GB por render (o disco enchia)
  const links = path.join(RAIZ, '.publica-links');
  try {
    fs.mkdirSync(links, {recursive: true});
    // tira atalhos quebrados (travas que sumiram etc.) e nunca cria atalho para trava, log ou arquivo oculto
    for (const n of fs.readdirSync(links)) {
      const a = path.join(links, n);
      if (!fs.existsSync(a) || n.startsWith('.') || n.includes('.lock') || n.endsWith('.log')) fs.rmSync(a, {force: true});
    }
    for (const n of fs.readdirSync(PUBLICA)) {
      if (n.startsWith('.') || n.includes('.lock') || n.endsWith('.log') || n.endsWith('.md')) continue;
      const alvo = path.join(links, n);
      if (!fs.existsSync(alvo)) fs.symlinkSync(path.join(PUBLICA, n), alvo);
    }
  } catch (e) {}
  const pub = fs.existsSync(links) ? links : PUBLICA;
  const url = await bundle({entryPoint: entrada, publicDir: pub, onProgress: () => undefined, onSymlinkDetected: () => undefined});
  console.log('ok');
  return url;
};

/** ffmpeg do sistema; se não houver, o que vem com o Remotion. Devolve [comando, ...prefixo]. */
export const ffmpeg = () => {
  const r = spawnSync('ffmpeg', ['-version'], {stdio: 'ignore', shell: false});
  if (r.status === 0) return ['ffmpeg'];
  return [process.execPath, path.join(RAIZ, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), 'ffmpeg'];
};

export const rodarFfmpeg = (args) => {
  const [cmd, ...pre] = ffmpeg();
  const r = spawnSync(cmd, [...pre, '-hide_banner', '-loglevel', 'error', '-y', ...args], {stdio: 'inherit'});
  if (r.status !== 0) throw new Error(`ffmpeg falhou (${r.status}).`);
};

export const memoria = () => {
  const usado = (os.totalmem() - os.freemem()) / 1024 ** 3;
  return `memória do computador em uso: ${usado.toFixed(1)} de ${(os.totalmem() / 1024 ** 3).toFixed(1)} GB`;
};
