// Renderiza as páginas da galeria de peças (src/pecas/galeria) em "projetos/_estudio/galeria/<categoria> <n>.jpg".
//
// Uso:
//   node scripts/galeria.mjs                 todas as páginas
//   node scripts/galeria.mjs Pessoas Casa    só as páginas cujo id começa com PecasPessoas, PecasCasa...
// Opções: --estilo=<id>  --saida=<pasta>  --navegador=<caminho>  --gl=angle|swangle|egl
import fs from 'node:fs';
import path from 'node:path';
import {RAIZ, PUBLICA, lerArgs, caminho, acharNavegador, opcoesChromium, lerProps, empacotar} from './comum.mjs';

const {op, pos} = lerArgs();
const pasta = op.saida ? caminho(op.saida) : path.join(PUBLICA, '_estudio', 'galeria');
fs.mkdirSync(pasta, {recursive: true});

const {renderStill, getCompositions, openBrowser} = await import('@remotion/renderer');
const navegador = acharNavegador(op);
const chromiumOptions = opcoesChromium(op);
const inputProps = lerProps(op);
const serveUrl = await empacotar();
const browser = await openBrowser('chrome', {browserExecutable: navegador, chromiumOptions, logLevel: op.log || 'error'});
const todas = await getCompositions(serveUrl, {inputProps, puppeteerInstance: browser, chromiumOptions, logLevel: op.log || 'error'});
const paginas = todas.filter((c) => c.id.startsWith('Pecas') && (!pos.length || pos.some((p) => c.id.startsWith(`Pecas${p}`))));
if (!paginas.length) console.log('Nenhuma página encontrada. A galeria está registrada no Root.tsx (<GaleriaPecas />)?');
for (const comp of paginas) {
  const props = {...comp.props, ...inputProps};
  const saida = path.join(pasta, props.arquivo || `${comp.id}.jpg`);
  const t0 = Date.now();
  await renderStill({composition: comp, serveUrl, output: saida, frame: 0, inputProps: props, imageFormat: 'jpeg', jpegQuality: 88, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds: 240000, logLevel: op.log || 'error'});
  console.log(`${comp.id} -> ${path.relative(RAIZ, saida)} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
await browser.close({silent: true});
