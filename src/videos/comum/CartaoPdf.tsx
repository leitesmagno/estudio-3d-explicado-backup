import React from 'react';
import {entra, rampa} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// Cartão "PDF" (regra 25b, 08/11/2026): no "arrecadou" de cada ano, a receita por imposto e taxa com o total;
// no "gastou", os setores com o total. Fica 1,8 s parado (entra em 0,25 s e sai em 0,3 s), no máximo 10 linhas,
// valores exatos do documento do TCM (o arquivo e a linha de cada um ficam no fontes.md).
// Uso: <CartaoPdf tema={tema} t={t} a={T.arrec24} titulo="RECEITA 2024" fonte="PCMGE016 DEZ/2024 · TCM-BA" linhas={[...]} total={65231350.91} />
export const DURACAO_CARTAO = 1.8;
export const reais = (v: number) => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

export const CartaoPdf: React.FC<{
  tema: Tema;
  t: number;
  a: number;
  titulo: string;
  fonte: string;
  linhas: [string, number][];
  total: number;
  rotuloTotal?: string;
  top?: number;
}> = ({tema, t, a, titulo, fonte, linhas, total, rotuloTotal = 'TOTAL', top = 600}) => {
  const k = entra(t, a, 0.25) * (1 - rampa(t, a + DURACAO_CARTAO, a + DURACAO_CARTAO + 0.3));
  if (k <= 0.01) return null;
  const papel = mistura('#FFFFFF', tema.fundo, 0.06);
  const tinta = '#1B1F1C';
  const suave = '#5D655F';
  const L = linhas.slice(0, 9);
  return (
    <div style={{position: 'absolute', left: 90, right: 150, top, opacity: Math.min(1, k), transform: `translateY(${(1 - Math.min(1, k)) * 18}px) scale(${0.96 + 0.04 * Math.min(1, k)})`, transformOrigin: 'top center'}}>
      <div style={{background: papel, borderRadius: 10, boxShadow: '0 18px 50px rgba(0,0,0,0.45)', padding: '22px 30px 18px', borderTop: `10px solid ${tema.acento}`}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12}}>
          <div style={{fontFamily: FONTE, fontSize: 34, fontWeight: 900, letterSpacing: -0.5, color: tinta}}>{titulo}</div>
          <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 1, color: suave, textAlign: 'right'}}>{fonte}</div>
        </div>
        <div style={{height: 2, background: '#D5D9D4', margin: '12px 0 8px'}} />
        {L.map(([n, v], i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < L.length - 1 ? '1px dashed #DADDD8' : undefined}}>
            <div style={{fontFamily: FONTE, fontSize: 25, fontWeight: 600, color: tinta}}>{n}</div>
            <div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: tinta}}>{reais(v)}</div>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `3px solid ${tinta}`}}>
          <div style={{fontFamily: FONTE, fontSize: 28, fontWeight: 900, color: tinta}}>{rotuloTotal}</div>
          <div style={{fontFamily: MONO, fontSize: 27, fontWeight: 800, color: tinta}}>{reais(total)}</div>
        </div>
      </div>
    </div>
  );
};
