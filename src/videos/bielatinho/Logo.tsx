import React from 'react';

// Logo da Tinho Auto Peças REDESENHADA em vetor a partir da foto do perfil do Instagram (só existe em 150 px).
// É a marca do próprio cliente, pedida por ele para o fim do vídeo. Trocar pelo arquivo original quando chegar.
const AZUL = '#0E1652';
const VERMELHO = '#D82B2F';
const BRANCO = '#FFFFFF';

const ChaveBoca: React.FC<{x: number; y: number; vira?: boolean}> = ({x, y, vira}) => (
  <g transform={`translate(${x} ${y}) ${vira ? 'scale(-1 1)' : ''}`} fill={VERMELHO}>
    <rect x={0} y={-11} width={110} height={22} rx={8} />
    <path d="M-48 0 a46 46 0 1 1 46 46 l0 -30 a16 16 0 0 0 0 -32 l0 -30 a46 46 0 0 0 -46 46 Z" />
  </g>
);

export const LogoTinho: React.FC<{tam?: number; fundo?: boolean}> = ({tam = 600, fundo = true}) => (
  <svg width={tam} height={tam} viewBox="0 0 600 600">
    <defs>
      <path id="arcoTinho" d="M150 330 A150 150 0 0 0 450 330" />
    </defs>
    {fundo ? <circle cx={300} cy={300} r={298} fill={AZUL} /> : null}
    <circle cx={300} cy={300} r={172} fill="none" stroke={VERMELHO} strokeWidth={9} />
    <path d="M300 178 A122 122 0 0 1 300 422" fill="none" stroke={VERMELHO} strokeWidth={6} />
    <ChaveBoca x={70} y={318} />
    <ChaveBoca x={530} y={290} vira />
    <g transform="translate(300 330) skewX(-12)">
      <text x={0} y={0} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={168} letterSpacing={-8} fill={BRANCO} stroke={AZUL} strokeWidth={10} paintOrder="stroke" transform="scale(0.86 1.12)">
        Tinho
      </text>
    </g>
    <text fontFamily="Inter, sans-serif" fontWeight={800} fontSize={38} letterSpacing={6} fill={BRANCO}>
      <textPath href="#arcoTinho" startOffset="50%" textAnchor="middle">AUTO PEÇAS</textPath>
    </text>
  </svg>
);
