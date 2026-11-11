import React from 'react';
import {entra, rampa} from '../../base/tempo';
import {FONTE, MONO, type Tema} from '../../base/tema';
import {mistura} from '../../base/cores';

// 095 (pedido do Magno, 09/11/2026): no vídeo entra uma FOLHA DE PDF desenhada (limpa e legível), mas com o nome do
// documento, a página e os números REAIS, o valor falado marcado de amarelo. No site, a mesma frase leva ao PDF de
// verdade na página exata (obras/site_fontes_095/fontes_095.json, mesmo id).
// A folha fica a 90 px das duas laterais (regra 71) e no mínimo 2,5 s na tela.
export type LinhaFolha = [string, string, boolean?]; // rótulo, valor como está no documento, marcado de amarelo
export type Folha = {id: number; a: number; b: number; doc: string; sub: string; pag: number; linhas: LinhaFolha[]};

export const FolhaPdf: React.FC<{tema: Tema; t: number; f: Folha; top: number}> = ({tema, t, f, top}) => {
  const k = entra(t, f.a, 0.35) * (1 - rampa(t, f.b - 0.3, f.b));
  if (k <= 0.01) return null;
  const kk = Math.min(1, k);
  const papel = '#FBFAF6';
  const tinta = '#1B1F1C';
  const suave = '#5D655F';
  const marca = 'rgba(255,224,0,0.55)';
  return (
    <div style={{position: 'absolute', left: 90, right: 90, top, opacity: kk, transform: `translateY(${(1 - kk) * 16}px) scale(${0.97 + 0.03 * kk})`, transformOrigin: 'top center'}}>
      <div style={{background: papel, borderRadius: 8, boxShadow: '0 18px 50px rgba(0,0,0,0.5)', padding: '16px 26px 14px', borderTop: `9px solid ${mistura(tema.acento, '#2F6B4F', 0.3)}`, position: 'relative', overflow: 'hidden'}}>
        {/* dobra do canto, para ler como folha */}
        <div style={{position: 'absolute', right: 0, top: 0, width: 0, height: 0, borderLeft: '30px solid #E4E1D8', borderBottom: '30px solid #E4E1D8', borderTop: `30px solid ${tema.fundo}`, borderRight: `30px solid ${tema.fundo}`, opacity: 0.9}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 1.2, color: suave}}>
          <div style={{padding: '2px 8px', borderRadius: 4, background: '#C8372D', color: '#FFFFFF', fontWeight: 900}}>PDF</div>
          <div>e-TCM · TCM-BA · PÁG. {f.pag}</div>
        </div>
        <div style={{fontFamily: FONTE, fontSize: f.doc.length > 34 ? 27 : 31, fontWeight: 900, letterSpacing: -0.4, color: tinta, marginTop: 8, lineHeight: 1.1, paddingRight: 40}}>{f.doc}</div>
        <div style={{fontFamily: MONO, fontSize: 15, fontWeight: 700, letterSpacing: 0.8, color: suave, marginTop: 3}}>{f.sub}</div>
        <div style={{height: 2, background: '#D5D9D4', margin: '9px 0 4px'}} />
        {f.linhas.map(([r, v, m], i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, padding: '5px 0', borderBottom: i < f.linhas.length - 1 ? '1px dashed #DADDD8' : undefined}}>
            <div style={{fontFamily: FONTE, fontSize: r.length > 40 ? 20 : 23, fontWeight: 600, color: tinta, lineHeight: 1.15}}>{r}</div>
            <div style={{fontFamily: MONO, fontSize: 25, fontWeight: 800, color: tinta, whiteSpace: 'nowrap', padding: '2px 7px', borderRadius: 4, background: m ? marca : 'transparent', boxShadow: m ? `0 0 0 ${2.5 * Math.min(1, rampa(t, f.a + 0.3, f.a + 0.7))}px rgba(220,160,0,0.95)` : undefined}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
