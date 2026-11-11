// Estúdio 3D Explicado · base/fontes
// Carrega Inter e JetBrains Mono de projetos/_estudio/fontes/ (licença SIL OFL, arquivos de licença na mesma pasta).
// O render espera as fontes (delayRender). Se algum arquivo faltar, usa a fonte do sistema e segue.

import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const LATIM = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIM_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const ARQUIVOS: {familia: string; arquivo: string; pesos: string; faixa: string}[] = [
  {familia: 'Inter', arquivo: '_estudio/fontes/Inter-latin.woff2', pesos: '100 900', faixa: LATIM},
  {familia: 'Inter', arquivo: '_estudio/fontes/Inter-latin-ext.woff2', pesos: '100 900', faixa: LATIM_EXT},
  {familia: 'JetBrains Mono', arquivo: '_estudio/fontes/JetBrainsMono-latin.woff2', pesos: '100 800', faixa: LATIM},
  {familia: 'JetBrains Mono', arquivo: '_estudio/fontes/JetBrainsMono-latin-ext.woff2', pesos: '100 800', faixa: LATIM_EXT},
];

let pronto = false;
const ouvintes = new Set<() => void>();

if (typeof window !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Carregando fontes', {timeoutInMilliseconds: 60000});
  Promise.all(
    ARQUIVOS.map(async (a) => {
      try {
        const face = new FontFace(a.familia, `url("${staticFile(a.arquivo)}") format("woff2")`, {weight: a.pesos, unicodeRange: a.faixa, display: 'block'});
        await face.load();
        (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
      } catch (e) {
        console.warn(`[fontes] não carregou ${a.arquivo}; usando fonte do sistema.`, e);
      }
    }),
  ).finally(() => {
    pronto = true;
    ouvintes.forEach((o) => o());
    ouvintes.clear();
    continueRender(handle);
    // Se o Remotion zerou a lista de pendências depois desta chamada (acontece em render de vídeo),
    // o cronômetro de tempo limite fica órfão: limpamos à mão.
    const w = window as unknown as {remotion_delayRenderTimeouts?: Record<string, {timeout: ReturnType<typeof setTimeout>}>};
    const pend = w.remotion_delayRenderTimeouts?.[String(handle)];
    if (pend) {
      clearTimeout(pend.timeout);
      delete w.remotion_delayRenderTimeouts![String(handle)];
    }
  });
} else {
  pronto = true;
}

/** true quando as fontes já carregaram. Use antes de desenhar texto em canvas (Placa). */
export const useFontesProntas = (): boolean => {
  const [ok, setOk] = useState(pronto);
  useEffect(() => {
    if (pronto) {
      setOk(true);
      return;
    }
    const o = () => setOk(true);
    ouvintes.add(o);
    return () => {
      ouvintes.delete(o);
    };
  }, []);
  return ok;
};
