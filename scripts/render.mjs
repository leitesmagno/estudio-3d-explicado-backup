// Gera o vídeo final em PARTES (cada parte num navegador novo, sem áudio) e no fim junta tudo
// com o som mixado pelo ffmpeg. Se travar, rode de novo: as partes prontas são aproveitadas.
//
// Uso:
//   node scripts/render.mjs <Composicao> "edicoes/NNN. nome" [opções]
// Opções:
//   --quadros-por-parte=800   tamanho de cada parte (menor = menos memória)
//   --partes=N                OU divide em N partes iguais
//   --parte=K                 refaz só a parte K (1, 2, ...) e junta de novo
//   --refazer                 ignora as partes prontas e gera tudo de novo
//   --nome="video final.mp4"  nome do arquivo final
//   --estilo=<id>             outro estilo registrado    --props=arquivo.json  props extras
//   --navegador=<caminho>     Chrome/Chromium a usar     --gl=angle|swangle|egl
//   --concorrencia=N          abas em paralelo por parte (padrão 1, o mais leve)
//   --so-video                não junta o som
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ, PUBLICA, lerArgs, caminho, acharNavegador, opcoesChromium, lerProps, empacotar, rodarFfmpeg, memoria} from './comum.mjs';

const {op, pos} = lerArgs();
const id = pos[0] || 'Exemplo';
const pastaSaida = caminho(pos[1] || 'out');
const nomeFinal = op.nome || (pos[1] ? 'video final.mp4' : `${id}.mp4`);
fs.mkdirSync(pastaSaida, {recursive: true});
const pastaPartes = caminho(op['pasta-partes'] || path.join(pastaSaida, `.partes ${id}`));
fs.mkdirSync(pastaPartes, {recursive: true});

const {renderMedia, selectComposition, openBrowser} = await import('@remotion/renderer');
const navegador = acharNavegador(op);
const chromiumOptions = opcoesChromium(op);
const inputProps = lerProps(op);
const serveUrl = await empacotar(id);

const abrir = () => openBrowser('chrome', {browserExecutable: navegador, chromiumOptions, logLevel: op.log || 'error'});

let browser = await abrir();
const comp = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, browserExecutable: navegador, chromiumOptions, logLevel: op.log || 'error'});
await browser.close({silent: true});
const props = {...comp.props, ...inputProps};
const total = comp.durationInFrames;
const porParte = op.partes ? Math.ceil(total / Number(op.partes)) : Number(op['quadros-por-parte'] || 800);
const nPartes = Math.max(1, Math.ceil(total / porParte));
console.log(`${id}: ${total} quadros (${(total / comp.fps).toFixed(2)} s) em ${nPartes} parte(s) de até ${porParte} quadros.`);

const nomeParte = (k) => path.join(pastaPartes, `parte ${String(k + 1).padStart(3, '0')}.mp4`);
const pronta = (k) => fs.existsSync(nomeParte(k) + '.ok');
const so = op.parte ? Number(op.parte) - 1 : null;

for (let k = 0; k < nPartes; k++) {
  const a = k * porParte;
  const b = Math.min(total - 1, a + porParte - 1);
  const refazer = op.refazer || so === k;
  if (so !== null && so !== k && pronta(k)) continue;
  if (!refazer && pronta(k)) {
    console.log(`Parte ${k + 1} de ${nPartes}: pronta (quadros ${a} a ${b}), aproveitada.`);
    continue;
  }
  fs.rmSync(nomeParte(k) + '.ok', {force: true});
  browser = await abrir();
  let ultimo = -1;
  const t0 = Date.now();
  await renderMedia({
    composition: comp,
    serveUrl,
    codec: 'h264',
    outputLocation: nomeParte(k),
    inputProps: props,
    frameRange: [a, b],
    muted: true,
    imageFormat: 'jpeg',
    jpegQuality: 92,
    crf: Number(op.crf || 18),
    pixelFormat: 'yuv420p',
    concurrency: Number(op.concorrencia || 1),
    puppeteerInstance: browser,
    browserExecutable: navegador,
    chromiumOptions,
    timeoutInMilliseconds: 120000,
    logLevel: op.log || 'error',
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 100);
      if (pct >= ultimo + 5 || pct === 100) {
        ultimo = pct;
        console.log(`Parte ${k + 1} de ${nPartes}: ${pct}%  (${memoria()})`);
      }
    },
  });
  await browser.close({silent: true});
  fs.writeFileSync(nomeParte(k) + '.ok', `quadros ${a}-${b}\n`);
  console.log(`Parte ${k + 1} de ${nPartes}: pronta em ${((Date.now() - t0) / 1000).toFixed(0)} s.`);
}

// ---------- Juntar as partes ----------
const lista = path.join(pastaPartes, 'lista.txt');
fs.writeFileSync(lista, Array.from({length: nPartes}, (_, k) => `file '${nomeParte(k).replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n') + '\n');
const soImagem = path.join(pastaPartes, 'imagem.mp4');
rodarFfmpeg(['-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', soImagem]);
const duracao = total / comp.fps;
const final = path.join(pastaSaida, nomeFinal);

// ---------- Som (mixado pelo ffmpeg, não pelo navegador) ----------
const faixas = Array.isArray(props.faixas) ? props.faixas : [];
if (op['so-video'] || faixas.length === 0) {
  if (!op['so-video']) console.warn('Aviso: a composição não tem a prop `faixas`; o vídeo sai sem som (veja BASE-API.md, seção Som).');
  fs.copyFileSync(soImagem, final);
} else {
  const entradas = [];
  const filtros = [];
  const rotulos = [];
  faixas.forEach((f, i) => {
    const arq = path.join(PUBLICA, f.arquivo);
    if (!fs.existsSync(arq)) throw new Error(`Som não encontrado: projetos/${f.arquivo}`);
    entradas.push('-i', arq);
    const ini = Math.max(0, f.inicio ?? 0);
    const ate = Math.min(duracao, f.ate ?? duracao);
    const dur = Math.max(0.01, ate - ini);
    const cadeia = [`aresample=48000`, `aformat=channel_layouts=stereo`, `atrim=0:${dur.toFixed(3)}`, `volume=${f.volume ?? 1}`];
    if (f.entrada) cadeia.push(`afade=t=in:st=0:d=${f.entrada}`);
    if (f.saida) cadeia.push(`afade=t=out:st=${Math.max(0, dur - f.saida).toFixed(3)}:d=${f.saida}`);
    const ms = Math.round(ini * 1000);
    cadeia.push(`adelay=${ms}|${ms}`);
    filtros.push(`[${i}:a]${cadeia.join(',')}[a${i}]`);
    rotulos.push(`[a${i}]`);
  });
  filtros.push(`${rotulos.join('')}amix=inputs=${rotulos.length}:normalize=0:dropout_transition=0,atrim=0:${duracao.toFixed(3)},apad=whole_dur=${duracao.toFixed(3)}[mix]`);
  const somWav = path.join(pastaPartes, 'som.wav');
  rodarFfmpeg([...entradas, '-filter_complex', filtros.join(';'), '-map', '[mix]', '-ar', '48000', '-ac', '2', somWav]);
  rodarFfmpeg(['-i', soImagem, '-i', somWav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', duracao.toFixed(3), '-movflags', '+faststart', final]);
}
console.log(`Pronto: ${path.relative(RAIZ, final)}`);
