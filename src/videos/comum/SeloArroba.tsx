import React from 'react';
import {Img, staticFile} from 'remotion';
import {entra, rampa} from '../../base/tempo';

// Selo do @eumagnoleite na abertura (ARTE APROVADA pelo Magno em 08/11/2026: OPÇÃO B de projetos/_arte-arroba/opcao_B.jpg;
// regra 15c de projetos/_coordenacao-sessoes.md). Fundo escuro arredondado com sombra suave, foto de perfil circular com
// anel em gradiente do Instagram, "@eumagnoleite" branco em negrito e "siga para ver a sua cidade" verde-claro embaixo.
// Centralizado em y ~455 (entre o chip da cidade e a faixa verde do gancho). Entra com pop, fica ~3,5 s e sai suave.
// Uso: <SeloArroba t={t} /> por cima de tudo, nos primeiros segundos. A marca d'água quicando continua à parte.

const ANEL = 'linear-gradient(45deg, rgb(254,218,117) 0%, rgb(250,126,30) 25%, rgb(214,41,118) 50%, rgb(150,47,191) 75%, rgb(79,91,213) 100%)';

export const SeloArroba: React.FC<{t: number; ini?: number; fim?: number; y?: number; arroba?: string; frase?: string; foto?: string}> = ({
  t,
  ini = 0.15,
  fim = 3.9,
  y = 445,
  arroba = '@eumagnoleite',
  frase = 'siga para ver a sua cidade',
  foto = '_arte-arroba/foto-perfil.jpg',
}) => {
  const k = entra(t, ini, 0.55); // curva "mola" da base: dá o pop
  const sai = rampa(t, fim, fim + 0.5);
  const op = Math.min(1, k * 1.4) * (1 - sai);
  if (op <= 0.01) return null;
  const escala = (0.7 + 0.3 * k) * (1 - 0.06 * sai);
  const D = 104; // foto
  const R = D + 16; // anel
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', pointerEvents: 'none', opacity: op}}>
      <div
        style={{
          transform: `translateY(${(1 - k) * 18 - sai * 10}px) scale(${escala})`,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          height: R + 20,
          padding: '0 40px 0 10px',
          borderRadius: (R + 20) / 2,
          background: 'rgba(14,20,17,0.88)',
          boxShadow: '0 10px 36px rgba(0,0,0,0.55)',
        }}
      >
        <div style={{width: R, height: R, borderRadius: R / 2, background: ANEL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <div style={{width: R - 12, height: R - 12, borderRadius: (R - 12) / 2, background: 'rgb(14,20,17)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile(foto)} style={{width: D, height: D, borderRadius: D / 2, objectFit: 'cover'}} />
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 44, fontWeight: 800, color: '#FFFFFF', lineHeight: 1, whiteSpace: 'nowrap'}}>{arroba}</div>
          <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 24, fontWeight: 400, color: 'rgb(150,220,180)', lineHeight: 1, whiteSpace: 'nowrap'}}>{frase}</div>
        </div>
      </div>
    </div>
  );
};
