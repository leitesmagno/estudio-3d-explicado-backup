// Configuração do Remotion para `npx remotion studio` e `npx remotion still`.
// A pasta pública é projetos/ (staticFile("001. nome/audio/narracao-norm.wav")).
import {Config} from '@remotion/cli/config';

Config.setEntryPoint('src/index.ts');
Config.setPublicDir('projetos');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(1);
// Se o Remotion não conseguir baixar o navegador, aponte um Chrome instalado:
// Config.setBrowserExecutable('C:/Program Files/Google/Chrome/Application/chrome.exe');
