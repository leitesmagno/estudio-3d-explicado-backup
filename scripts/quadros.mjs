// Quadros de revisão (imagens .jpg) de uma composição em segundos escolhidos.
//
// Uso:
//   node scripts/quadros.mjs <Composicao> "projetos/NNN. nome" [segundos...] [opções]
// Saída: "projetos/NNN. nome/revisao/<Composicao> 012.40s.jpg"
// Sem segundos: usa a prop `revisao` da composição (lista de segundos registrada no Root.tsx);
// sem ela, tira 10 quadros espalhados do começo ao fim.
// Opções: --saida=<pasta> (grava direto nela)  --estilo=<id>  --props=arquivo.json
//         --png  --navegador=<caminho>  --gl=angle|swangle|egl
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ, lerArgs, caminho, acharNavegador, opcoesChromium, lerProps, empacotar} from './comum.mjs';

const {op, pos} = lerArgs();
const id = pos[0];
if (!id) {
  console.error('Uso: node scripts/quadros.mjs <Composicao> "projetos/NNN. nome" [segundos...]');
  process.exit(1);
}
const pasta = op.saida ? caminho(op.saida) : path.join(caminho(pos[1] || 'out'), 'revisao');
fs.mkdirSync(pasta, {recursive: true});
const pedidos = pos.slice(2).map((s) => Number(String(s).replace(',', '.'))).filter((n) => Number.isFinite(n));

const {renderStill, selectComposition, openBrowser} = await import('@remotion/renderer');
const navegador = acharNavegador(op);
const chromiumOptions = opcoesChromium(op);
const inputProps = lerProps(op);
const serveUrl = await empacotar(id);
const browser = await openBrowser('chrome', {browserExecutable: navegador, chromiumOptions, logLevel: op.log || 'error'});
const comp = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser, chromiumOptions, logLevel: op.log || 'error'});
const props = {...comp.props, ...inputProps};
const ultimo = comp.durationInFrames - 1;

let segundos = pedidos;
if (!segundos.length && Array.isArray(props.revisao) && props.revisao.length) segundos = props.revisao;
if (!segundos.length) segundos = ultimo === 0 ? [0] : Array.from({length: 10}, (_, i) => ((ultimo / comp.fps) * (i + 0.5)) / 10);

const ext = op.png ? 'png' : 'jpeg';
for (const s of segundos) {
  const frame = Math.max(0, Math.min(ultimo, Math.round(s * comp.fps)));
  const nome = ultimo === 0 ? `${id}.${ext === 'png' ? 'png' : 'jpg'}` : `${id} ${(frame / comp.fps).toFixed(2).padStart(6, '0')}s.${ext === 'png' ? 'png' : 'jpg'}`;
  const saida = path.join(pasta, nome);
  await renderStill({composition: comp, serveUrl, output: saida, frame, inputProps: props, imageFormat: ext, jpegQuality: 90, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 120000, logLevel: op.log || 'error'});
  console.log(`quadro ${frame} (${(frame / comp.fps).toFixed(2)} s) -> ${path.relative(RAIZ, saida)}`);
}
await browser.close({silent: true});
