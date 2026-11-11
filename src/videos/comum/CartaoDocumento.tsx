import React from 'react';
import {entra, rampa} from '../../base/tempo';
import {FONTE, MONO} from '../../base/tema';

// Cartão DOCUMENTO estilo PDF (regras 25, 28 e 28b de projetos/_coordenacao-sessoes.md; modelo aprovado pelo Magno em
// projetos/_arte-arroba/mock_documento.jpg). Papel branco meio transparente, cabeçalho escuro com o título ("RECEITA 2025 · o que
// entrou" / "DESPESA 2025 · para onde foi") e a fonte ("PCMGE016 dez/2025 · TCM-BA"), linhas com pontilhado e valor, e a faixa
// verde do TOTAL em destaque (dá para ler mesmo no relance). O conteúdo vem SEMPRE do documento do TCM: a soma das linhas tem que
// dar o total (diferença até R$ 0,05; o componente mostra um aviso vermelho se não bater, para a revisão pegar).
// Regra 28c: a folha é menor (escala 0,62 ≈ 300 px de largura na tela) e NUNCA cobre plaquinha, chip, selo ou texto: reserve o canto.
// Tempo: entra em 0,2 s, fica PARADO de `a` até `b` e sai em 0,2 s. Com a regra 25 (1,8 s) use b = a + 1,8; com a 28b (folha
// do ano) use b = fim do trecho do ano. Lado: 'esq' ou 'dir' (o oposto do setor falado); `top` em px (abaixo do chip, y >= 600).
// Uso: <CartaoDocumento t={t} a={...} b={...} titulo="RECEITA 2025" sub="o que entrou" fonte="PCMGE016 dez/2025 · TCM-BA"
//        linhas={[['IPTU', 19367783.42], ...]} total={962960334.52} rotuloTotal="TOTAL ARRECADADO" />

export const ENTRA_DOC = 0.2;
export const SAI_DOC = 0.2;
export const reaisDoc = (v: number, curto = false) => {
  if (curto) {
    const mi = v / 1e6;
    if (Math.abs(mi) >= 1000) return `R$ ${(mi / 1000).toLocaleString('pt-BR', {minimumFractionDigits: 3, maximumFractionDigits: 3})} bi`;
    if (Math.abs(mi) >= 1) return `R$ ${mi.toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1})} mi`;
    return `R$ ${Math.round(v / 1000).toLocaleString('pt-BR')} mil`;
  }
  return `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

export const CartaoDocumento: React.FC<{
  t: number;
  a: number;
  b: number;
  titulo: string;
  sub?: string;
  fonte: string;
  linhas: [string, number][];
  total: number;
  rotuloTotal?: string;
  rodape?: string;
  lado?: 'esq' | 'dir';
  top?: number;
  largura?: number;
  opacidade?: number;
  curto?: boolean;
  escala?: number;
}> = ({t, a, b, titulo, sub, fonte, linhas, total, rotuloTotal = 'TOTAL', rodape, lado = 'esq', top = 610, largura = 440, opacidade = 0.9, curto = false, escala = 1}) => {
  const k = entra(t, a, ENTRA_DOC) * (1 - rampa(t, b, b + SAI_DOC));
  if (k <= 0.01) return null;
  const kk = Math.min(1, k);
  const soma = linhas.reduce((s, [, v]) => s + v, 0);
  const fecha = Math.abs(soma - total) <= 0.05;
  const n = linhas.length;
  // com muitas linhas (folha do ano inteiro, regra 28b) a letra diminui para caber sem tapar a cena
  const fs = n > 14 ? 15 : n > 10 ? 17 : 20;
  const lh = n > 14 ? 21 : n > 10 ? 25 : 32;
  const papel = `rgba(250,249,245,${0.93 * opacidade})`;
  const tinta = '#262826';
  return (
    <div
      style={{
        position: 'absolute',
        top,
        [lado === 'esq' ? 'left' : 'right']: lado === 'esq' ? 46 : 170,
        width: largura,
        opacity: kk,
        transform: `translateY(${(1 - kk) * 14}px) rotate(${lado === 'esq' ? -1.2 : 1.2}deg) scale(${escala * (0.97 + 0.03 * kk)})`,
        transformOrigin: lado === 'esq' ? 'top left' : 'top right',
        pointerEvents: 'none',
      }}
    >
      <div style={{background: papel, borderRadius: 12, overflow: 'hidden', boxShadow: '0 14px 40px rgba(0,0,0,0.45)'}}>
        <div style={{background: 'rgba(30,40,35,0.97)', padding: '11px 18px 9px'}}>
          <div style={{fontFamily: FONTE, fontSize: (titulo + (sub ? ` · ${sub}` : '')).length > 32 ? 18 : 21, fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: -0.2}}>
            {titulo}
            {sub ? <span style={{fontWeight: 500, opacity: 0.85}}>{` · ${sub}`}</span> : null}
          </div>
          <div style={{fontFamily: FONTE, fontSize: 14, fontWeight: 500, color: 'rgb(150,220,180)', marginTop: 3, whiteSpace: 'nowrap'}}>{fonte}</div>
        </div>
        <div style={{padding: '8px 16px 4px'}}>
          {linhas.map(([nome, v], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'baseline', height: lh}}>
              <div style={{fontFamily: FONTE, fontSize: fs, fontWeight: 500, color: tinta, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flexShrink: 1}}>{nome}</div>
              <div style={{flex: 1, minWidth: 10, borderBottom: '2px dotted rgba(150,150,150,0.75)', margin: '0 6px', transform: 'translateY(-4px)'}} />
              <div style={{fontFamily: MONO, fontSize: fs - 1, fontWeight: 600, color: tinta, whiteSpace: 'nowrap', flexShrink: 0}}>{reaisDoc(v, curto)}</div>
            </div>
          ))}
          <div style={{height: 2, background: 'rgba(30,40,35,0.9)', margin: '5px 0 7px'}} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: fecha ? 'rgb(47,163,107)' : 'rgb(200,40,40)', borderRadius: 9, padding: '8px 12px'}}>
            <div style={{fontFamily: FONTE, fontSize: 19, fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{fecha ? rotuloTotal : 'SOMA NÃO FECHA'}</div>
            <div style={{fontFamily: MONO, fontSize: 19, fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap'}}>{reaisDoc(total, curto)}</div>
          </div>
          {rodape ? <div style={{fontFamily: FONTE, fontSize: 12, fontWeight: 500, color: '#777', margin: '7px 2px 8px', whiteSpace: 'nowrap'}}>{rodape}</div> : <div style={{height: 8}} />}
        </div>
      </div>
    </div>
  );
};
