// Amostra de um estilo (still 1080 × 1920): cena curta + paleta + interface, para aprovar o visual do perfil.
// npx remotion still AmostraEstilo "projetos/amostra do estilo <id>.jpg" --props="projetos/amostra.json"
// amostra.json: {"estilo": "<id>"}
import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill} from 'remotion';
import {AcabamentoCinema, Boneco, Caixa, Camera, Celular, Moeda, Onda, Palco, Particulas, Pilhas, Placa, Predio, enquadrar, focarEm, projetar, type V3} from '../../base/pecas';
import {Barra} from '../../base/graficos';
import {Chip, Contador, Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {CABECALHO, SEGURO} from '../../base/reels';
import {FONTE, MONO} from '../../base/tema';
import {mistura} from '../../base/cores';
import {SERIE, temaPorId} from '../../estilo';

const FALA = [
  {w: 'O', s: 0, e: 0.2},
  {w: 'que', s: 0.2, e: 0.4},
  {w: 'importa', s: 0.4, e: 0.9},
  {w: 'ganha', s: 0.9, e: 1.2},
  {w: 'cor.', s: 1.2, e: 1.6},
];

export const AmostraEstilo: React.FC<{estilo?: string}> = ({estilo}) => {
  const tema = temaPorId(estilo);
  const serie = tema.serie ?? SERIE;
  const cam = enquadrar([0.2, 1.0, 0], 6.2, 3.6, [0.35, 0.42, 1], 1.1, 30, 40);
  const pj = (p: V3) => projetar(p, cam);
  const cores: [string, string][] = [
    ['fundo', tema.fundo],
    ['objeto', tema.objeto],
    ['claro', tema.objetoClaro],
    ['escuro', tema.objetoEscuro],
    ['corpo', tema.corpo],
    ['acento', tema.acento],
  ];
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      <ThreeCanvas width={1080} height={1920} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
        <Palco tema={tema} alcance={120} sombraArea={9} />
        <Camera {...cam} />
        <Particulas t={2} centro={[0, 2, 0]} raio={7} n={40} />
        <group position={[-2.6, 0, -1.8]} scale={0.34}>
          <Predio tema={tema} pos={[0, 0, 0]} aceso={0.5} />
        </group>
        <Boneco tema={tema} pos={[-0.6, 0, 0.3]} rotY={0.3} escala={0.9} cor={tema.pessoa} pose={{passo: 0.4}} />
        <Boneco tema={tema} pos={[0.6, 0, 0.5]} rotY={-0.3} escala={0.95} cor={tema.acento} pose={{ombroD: [-0.75, 0, 0.07], cotoveloD: -1.25, cabeca: [0.3, 0, 0]}}>
          <group position={[0.27, 1.17, 0.42]} rotation={[0.45, Math.PI, 0]} scale={1.7}>
            <Celular tema={tema} pos={[0, 0, 0]} brilho={1} />
          </group>
        </Boneco>
        <Barra pos={[2.3, 0, 0]} alt={1.6} larg={0.6} cor={tema.objeto} />
        <Barra pos={[3.1, 0, 0]} alt={2.4} larg={0.6} cor={tema.acento} emissivo={0.25} />
        <Pilhas tema={tema} pos={[2.6, 0, 1.3]} alturas={[4, 7]} r={0.2} destaque={1} />
        <Moeda tema={tema} pos={[1.6, 0.25, 1.6]} rot={[Math.PI / 2, 0, 0.3]} r={0.25} />
        <Caixa args={[2.6, 0.8, 0.1]} raio={0.05} cor={tema.objetoEscuro} position={[0.4, 2.9, -2]} />
        <Placa tema={tema} pos={[0.4, 2.9, -1.94]} larg={2.5} alt={0.72} linhas={[{t: serie.toUpperCase(), tam: 120, cor: tema.objetoClaro, peso: 850}]} fundo={tema.objetoEscuro} />
        <Onda pos={[0.6, 0, 0.5]} k={0.45} cor={tema.acento} raio={1.6} />
        <AcabamentoCinema foco={focarEm(cam, [0.6, 1, 0.5], 2.5, 3)} raioAO={0.5} />
      </ThreeCanvas>
      <Marca tema={tema} serie={serie} assunto={`estilo ${tema.nome ?? estilo ?? ''}`} />
      <Pilula tema={tema} estado="AMOSTRA" t={1} troca={0} />
      <Contador tema={tema} valor="44 H" rotulo="POR SEMANA" k={1} y={CABECALHO.pilula + 110} />
      <Etiqueta tema={tema} x={SEGURO.esq + 20} y={650} alvo={pj([0.6, 1.7, 0.5])} titulo="Você" sub="O ACENTO VAI NO QUE IMPORTA" destaque aparece={1} />
      <div style={{position: 'absolute', left: SEGURO.esq + 20, top: 1190, display: 'flex', gap: 12}}>
        <Chip tema={tema} texto="MESMO SALÁRIO" k={1} tam={28} />
        <Chip tema={tema} texto="2 FOLGAS" k={1} destaque tam={28} />
      </div>
      <Legenda t={0.95} palavras={FALA} tema={tema} />
      <div style={{position: 'absolute', left: SEGURO.esq, right: 1080 - SEGURO.dir, top: 1580, display: 'flex', justifyContent: 'space-between'}}>
        {cores.map(([n, c]) => (
          <div key={n} style={{textAlign: 'center'}}>
            <div style={{width: 120, height: 60, borderRadius: 14, background: c, border: `2px solid ${mistura(tema.cartaoBorda, tema.texto, 0.2)}`}} />
            <div style={{fontFamily: MONO, fontSize: 18, color: tema.textoSuave, marginTop: 6}}>{n}</div>
            <div style={{fontFamily: MONO, fontSize: 16, color: tema.textoSuave, opacity: 0.7}}>{c.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: SEGURO.esq, top: 1720, fontFamily: FONTE, fontSize: 26, color: tema.textoSuave}}>{tema.chamada ?? ''}</div>
    </AbsoluteFill>
  );
};
