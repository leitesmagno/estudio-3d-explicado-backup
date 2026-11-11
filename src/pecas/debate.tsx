import React from 'react';
import * as THREE from 'three';
import {Boneco, Caixa, Fosco, Placa, type Pose, type V3} from '../base/pecas';
import type {Tema} from '../base/tema';
import {mistura} from './bets';
import {festa} from './mansao';

// Peças (debate e pesquisas): estúdio de TV redondo com a bancada dos dois candidatos e o telão,
// a sala do acordo, os celulares das enquetes, a prancheta da pesquisa, o gráfico com a margem de erro
// e a câmera fotográfica. Tudo parado; quem anima é a cena.

// ---------- Estúdio: palco redondo, parede curva atrás, anel de luz no piso, câmeras de TV ----------
export const PISO = 0.14; // topo do palco (o chão do Palco fica em 0; o palco sobe 0,04 + 0,1)
export const R_ESTUDIO = 4.6;

export const CameraTV: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number}> = ({tema, pos, rotY = 0, escala = 1}) => (
  <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
    {/* Tripé */}
    {[0, 1, 2].map((i) => {
      const a = (i / 3) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.sin(a) * 0.22, 0.55, Math.cos(a) * 0.22]} rotation={[Math.cos(a) * 0.38, 0, -Math.sin(a) * 0.38]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 1.15, 8]} />
          <Fosco cor={tema.objetoEscuro} />
        </mesh>
      );
    })}
    <mesh position={[0, 1.15, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    {/* Corpo, lente e visor */}
    <Caixa args={[0.34, 0.36, 0.62]} raio={0.06} cor={mistura(tema.objetoEscuro, tema.objeto, 0.25)} position={[0, 1.42, 0]} />
    <mesh position={[0, 1.42, 0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.14, 0.26, 24]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
    <mesh position={[0, 1.42, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
      <meshStandardMaterial color={tema.objetoClaro} roughness={0.15} metalness={0.4} />
    </mesh>
    <Caixa args={[0.26, 0.2, 0.06]} raio={0.03} cor={tema.objetoEscuro} position={[0, 1.48, -0.34]} />
    {/* Alça de mão */}
    <mesh position={[0, 1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.12, 0.022, 8, 20, Math.PI]} />
      <Fosco cor={tema.objetoEscuro} />
    </mesh>
  </group>
);

export const EstudioTV: React.FC<{tema: Tema; luz: number; t: number}> = ({tema, luz, t}) => {
  const F = festa(tema);
  const parede = mistura(tema.fundo, tema.objetoEscuro, 0.55);
  return (
    <group>
      {/* Degrau e palco */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[R_ESTUDIO + 0.35, R_ESTUDIO + 0.4, 0.04, 64]} />
        <Fosco cor={mistura(tema.fundo, tema.objetoEscuro, 0.4)} />
      </mesh>
      <mesh position={[0, 0.09, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[R_ESTUDIO, R_ESTUDIO, 0.1, 64]} />
        <Fosco cor={mistura(tema.fundo, tema.objetoEscuro, 0.75)} />
      </mesh>
      {/* Anel de luz no piso (pulso lento, sem piscar) */}
      <mesh position={[0, PISO + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R_ESTUDIO - 0.3, 0.045, 8, 96]} />
        <meshStandardMaterial color={F.azul} emissive={F.azul} emissiveIntensity={0.25 + 0.9 * luz * (0.85 + 0.15 * Math.sin(t * 1.4))} />
      </mesh>
      <mesh position={[0, PISO + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.03, 8, 64]} />
        <meshStandardMaterial color={F.azul} emissive={F.azul} emissiveIntensity={0.15 + 0.5 * luz} />
      </mesh>
      {/* Parede curva atrás, com frisos de luz */}
      <mesh position={[0, PISO + 1.7, 0]}>
        <cylinderGeometry args={[R_ESTUDIO + 0.2, R_ESTUDIO + 0.2, 3.4, 64, 1, true, Math.PI - 1.15, 2.3]} />
        <meshStandardMaterial color={parede} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({length: 9}).map((_, i) => {
        const a = Math.PI - 1.05 + (i * 2.1) / 8;
        const r = R_ESTUDIO + 0.12;
        return (
          <mesh key={i} position={[Math.sin(a) * r, PISO + 1.7, Math.cos(a) * r]} rotation={[0, a, 0]}>
            <boxGeometry args={[0.06, 3.0, 0.02]} />
            <meshStandardMaterial color={F.azul} emissive={F.azul} emissiveIntensity={0.15 + 0.55 * luz} />
          </mesh>
        );
      })}
      {/* Câmeras de TV nas laterais da frente e uma atrás, de lado */}
      <CameraTV tema={tema} pos={[-2.5, PISO, 3.5]} rotY={Math.PI + 0.6} escala={0.95} />
      <CameraTV tema={tema} pos={[2.5, PISO, 3.5]} rotY={Math.PI - 0.6} escala={0.95} />
      <CameraTV tema={tema} pos={[-3.7, PISO, -0.6]} rotY={Math.PI / 2 + 0.3} escala={0.9} />
    </group>
  );
};

// ---------- Candidato: boneco genérico, sem rosto, com a cor da campanha e uma gravata ----------
export const Candidato: React.FC<{tema: Tema; pos: V3; cor: string; gravata: string; pose?: Pose; rotY?: number; escala?: number}> = ({tema, pos, cor, gravata, pose, rotY = 0, escala = 1}) => {
  if (escala < 0.02) return null;
  return (
    <Boneco tema={tema} pos={pos} rotY={rotY} cor={cor} escala={escala} pose={pose}>
      <group rotation={[pose?.tronco ?? 0, 0, 0]} position={[0, 0.93, 0]}>
        <group position={[0, -0.93, 0]}>
          {/* Gravata: faixa na frente do peito */}
          <Caixa args={[0.075, 0.34, 0.03]} raio={0.012} cor={gravata} position={[0, 1.34, 0.185]} sombra={false} />
          <Caixa args={[0.1, 0.06, 0.035]} raio={0.012} cor={gravata} position={[0, 1.53, 0.17]} sombra={false} />
        </group>
      </group>
    </Boneco>
  );
};

// ---------- Bancada do debate: dois lugares iguais, lado a lado, de frente para a câmera ----------
// `cores`: painel da frente de cada lugar; `faixas`: faixa de cima do painel (verde e amarelo do lugar B).
// `textos`/`vira`: a etiqueta gira em torno do eixo x e troca de texto no meio do giro.
export const LUGAR_X = 1.15;
export const BANCADA_Z = -0.2;
export const Bancada: React.FC<{
  tema: Tema;
  cores: [string, string];
  faixas: [string, string];
  luz: [number, number];
  textos: [[string, string], [string, string]];
  vira: [number, number];
  afunda?: [number, number];
}> = ({tema, cores, faixas, luz, textos, vira, afunda = [0, 0]}) => {
  const corpo = mistura(tema.objetoEscuro, tema.fundo, 0.25);
  const tampo = mistura(tema.objeto, tema.objetoEscuro, 0.45);
  return (
    <group position={[0, PISO, BANCADA_Z]}>
      {[0, 1].map((i) => {
        const l = i === 0 ? -1 : 1;
        const desce = afunda[i];
        if (desce > 0.98) return null;
        const v = vira[i];
        const txt = v < 0.5 ? textos[i][0] : textos[i][1];
        const giro = Math.abs(Math.cos(Math.PI * v));
        return (
          <group key={i} position={[l * LUGAR_X, -1.1 * desce, 0]}>
            {/* Móvel de cada lugar */}
            <Caixa args={[2.1, 1.0, 0.7]} raio={0.06} cor={corpo} position={[0, 0.5, 0]} />
            <Caixa args={[2.24, 0.08, 0.84]} raio={0.03} cor={tampo} position={[0, 1.04, 0.02]} />
            {/* Painel da frente, na cor da campanha */}
            <Caixa args={[1.9, 0.68, 0.04]} raio={0.02} cor={cores[i]} emissivo={0.12 + 0.35 * luz[i]} position={[0, 0.5, 0.37]} sombra={false} />
            <Caixa args={[1.9, 0.12, 0.05]} raio={0.02} cor={faixas[i]} emissivo={0.15 + 0.35 * luz[i]} position={[0, 0.81, 0.375]} sombra={false} />
            {/* Etiqueta com o nome */}
            <group position={[0, 0.47, 0.415]} scale={[1, Math.max(0.02, giro), 1]}>
              <Placa tema={tema} pos={[0, 0, 0]} larg={1.7} alt={0.34} linhas={[{t: txt, tam: txt.length > 12 ? 92 : 120, cor: tema.texto, peso: 850}]} fundo={mistura(tema.fundo, tema.objetoEscuro, 0.4)} />
            </group>
            {/* Microfone de haste */}
            <mesh position={[0.35, 1.2, 0.05]} rotation={[0.5, 0, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.34, 8]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
            <mesh position={[0.35, 1.36, 0.14]} castShadow>
              <sphereGeometry args={[0.05, 14, 12]} />
              <Fosco cor={tema.objetoClaro} />
            </mesh>
            <Caixa args={[0.16, 0.03, 0.12]} raio={0.012} cor={tema.objetoEscuro} position={[0.35, 1.09, -0.02]} />
            {/* Luminária de mesa na cor da campanha */}
            <mesh position={[-0.7, 1.2, -0.12]} castShadow>
              <cylinderGeometry args={[0.015, 0.02, 0.26, 8]} />
              <Fosco cor={tema.objetoEscuro} />
            </mesh>
            <mesh position={[-0.7, 1.36, -0.12]}>
              <sphereGeometry args={[0.06, 14, 12]} />
              <meshStandardMaterial color={cores[i]} emissive={cores[i]} emissiveIntensity={0.3 + 1.2 * luz[i]} />
            </mesh>
            {/* Copo d'água */}
            <mesh position={[-0.35, 1.15, 0.1]}>
              <cylinderGeometry args={[0.04, 0.035, 0.12, 14]} />
              <meshStandardMaterial color={tema.objetoClaro} transparent opacity={0.45} roughness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ---------- Telão: texto em cima e um ponteiro de balança (lado A ← meio → lado B) ----------
export const TELAO: V3 = [0, 3.95, -4.15];
export const TelaoDebate: React.FC<{tema: Tema; texto: string; cor: string; vira: number; ponteiro: number; cores: [string, string]; luz: number; medidor: number}> = ({
  tema,
  texto,
  cor,
  vira,
  ponteiro,
  cores,
  luz,
  medidor,
}) => {
  const tela = mistura(tema.fundo, '#000000', 0.35);
  const temaTela = {...tema, tinta: tela};
  const giro = Math.max(0.02, Math.abs(Math.cos(Math.PI * vira)));
  const ang = Math.PI / 2 - ponteiro * (Math.PI / 2) * 0.86;
  return (
    <group position={TELAO}>
      {/* Postes */}
      {[-1.9, 1.9].map((x) => (
        <Caixa key={x} args={[0.14, TELAO[1], 0.14]} raio={0.04} cor={tema.objetoEscuro} position={[x, -TELAO[1] / 2, -0.12]} />
      ))}
      <Caixa args={[4.5, 2.6, 0.2]} raio={0.08} cor={mistura(tema.objetoEscuro, tema.fundo, 0.3)} position={[0, 0, -0.06]} />
      <Caixa args={[4.2, 2.32, 0.04]} raio={0.03} cor={tela} emissivo={0.1 * luz} position={[0, 0, 0.06]} sombra={false} />
      <group position={[0, 0.62, 0.1]} scale={[1, giro, 1]}>
        <Placa tema={temaTela} pos={[0, 0, 0]} larg={3.9} alt={0.85} linhas={[{t: texto, tam: texto.length > 12 ? 100 : 112, cor, peso: 900}]} fundo={tela} />
      </group>
      {/* Medidor: meio arco com as duas cores e o ponteiro */}
      {medidor > 0.02 ? (
        <group position={[0, -0.82, 0.12]} scale={medidor}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.95, 0.08, 8, 40, Math.PI / 2]} />
            <meshStandardMaterial color={cores[0]} emissive={cores[0]} emissiveIntensity={0.35 + 0.5 * luz} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.95, 0.08, 8, 40, Math.PI / 2]} />
            <meshStandardMaterial color={cores[1]} emissive={cores[1]} emissiveIntensity={0.35 + 0.5 * luz} />
          </mesh>
          <group rotation={[0, 0, ang]}>
            <Caixa args={[0.86, 0.05, 0.04]} raio={0.02} cor={tema.objetoClaro} emissivo={0.5} position={[0.43, 0, 0.06]} sombra={false} />
          </group>
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 20]} />
            <Fosco cor={tema.objetoClaro} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};

// ---------- Arquibancadinha com 3 degraus (a torcida vai em cima, pela Torcida de estadio.tsx) ----------
export const DEGRAU = {larg: 3.4, prof: 0.62, alt: 0.32};
export const Arquibancada: React.FC<{tema: Tema; pos: V3; rotY: number; k: number}> = ({tema, pos, rotY, k}) => {
  if (k < 0.02) return null;
  return (
    <group position={[pos[0], pos[1] - 1.2 * (1 - k), pos[2]]} rotation={[0, rotY, 0]}>
      {[0, 1, 2].map((i) => (
        <Caixa key={i} args={[DEGRAU.larg, DEGRAU.alt * (i + 1), DEGRAU.prof]} raio={0.04} cor={mistura(tema.objetoEscuro, tema.fundo, 0.15 + 0.1 * i)} position={[0, (DEGRAU.alt * (i + 1)) / 2 + 0.04, -i * DEGRAU.prof]} />
      ))}
    </group>
  );
};

// Placa de torcida: cabo + cartaz com o texto, inclinada para o lado do candidato
export const PlacaTorcida: React.FC<{tema: Tema; pos: V3; texto: string; cor: string; letra: string; k: number; inclina: number; rotY?: number}> = ({tema, pos, texto, cor, letra, k, inclina, rotY = 0}) => {
  if (k < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, inclina]} scale={k}>
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <Fosco cor={mistura(tema.areia, tema.objetoEscuro, 0.4)} />
      </mesh>
      <Placa tema={{...tema, tinta: cor}} pos={[0, 0.12, 0]} larg={0.95} alt={0.42} linhas={[{t: texto, tam: 150, cor: letra, peso: 900}]} fundo={cor} />
    </group>
  );
};

// ---------- Sala do acordo: mesa comprida, cadeiras, a emissora na cabeceira ----------
export const MesaAcordo: React.FC<{tema: Tema; pos: V3; k: number}> = ({tema, pos, k}) => {
  if (k < 0.02) return null;
  const tampo = mistura(tema.areia, tema.objetoEscuro, 0.6);
  const cadeira = mistura(tema.objetoEscuro, tema.fundo, 0.2);
  return (
    <group position={[pos[0], pos[1] - 1.4 * (1 - k), pos[2]]}>
      <Caixa args={[3.8, 0.1, 1.5]} raio={0.04} cor={tampo} position={[0, 0.82, 0]} />
      {[-1.6, 1.6].map((x) => [-0.55, 0.55].map((z) => <Caixa key={`${x}${z}`} args={[0.1, 0.78, 0.1]} raio={0.03} cor={tema.objetoEscuro} position={[x, 0.4, z]} />))}
      {/* Uma cadeira em cada ponta (as campanhas), viradas para a mesa */}
      {[-1, 1].map((l) => (
        <group key={l} position={[l * 2.3, 0, 0]} rotation={[0, -l * Math.PI / 2, 0]}>
          <Caixa args={[0.55, 0.08, 0.5]} raio={0.03} cor={cadeira} position={[0, 0.48, 0]} />
          <Caixa args={[0.55, 0.6, 0.07]} raio={0.03} cor={cadeira} position={[0, 0.8, -0.25]} />
          <Caixa args={[0.06, 0.46, 0.06]} raio={0.02} cor={tema.objetoEscuro} position={[0, 0.23, 0]} />
        </group>
      ))}
      {/* No meio, do outro lado da mesa: a emissora (câmera de TV pequena), virada para quem assiste */}
      <CameraTV tema={tema} pos={[0, 0, -1.25]} rotY={0} escala={0.75} />
    </group>
  );
};

// Cronômetro de mesa: mostrador de frente, ponteiro que gira, botão em cima
export const Relogio: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; giro: number; cor: string}> = ({tema, pos, rotY = 0, escala, giro, cor}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 40]} />
        <Fosco cor={cor} emissivo={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.085]}>
        <circleGeometry args={[0.42, 40]} />
        <meshStandardMaterial color={tema.objetoClaro} roughness={0.6} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <Caixa key={i} args={[0.025, 0.07, 0.01]} raio={0.004} cor={tema.objetoEscuro} position={[Math.sin(a) * 0.35, Math.cos(a) * 0.35, 0.095]} rotation={[0, 0, -a]} sombra={false} />;
      })}
      <group position={[0, 0, 0.1]} rotation={[0, 0, -giro]}>
        <Caixa args={[0.035, 0.34, 0.015]} raio={0.007} cor={tema.acento} position={[0, 0.15, 0]} sombra={false} />
      </group>
      <Caixa args={[0.12, 0.14, 0.12]} raio={0.03} cor={cor} position={[0, 0.58, 0]} />
      <Caixa args={[0.22, 0.06, 0.12]} raio={0.025} cor={tema.objetoEscuro} position={[0, 0.68, 0]} />
    </group>
  );

// Ficha numerada da ordem das perguntas (disco de pé)
export const FichaOrdem: React.FC<{tema: Tema; pos: V3; n: string; cor: string; escala: number}> = ({tema, pos, n, cor, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 32]} />
        <Fosco cor={cor} emissivo={0.12} />
      </mesh>
      <Placa tema={{...tema, tinta: cor}} pos={[0, 0, 0.02]} larg={0.3} alt={0.3} linhas={[{t: n, tam: 640, cor: tema.fundo, peso: 900}]} fundo={cor} />
    </group>
  );

// Urna pequena de sorteio
export const Urninha: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala}>
      <Caixa args={[0.5, 0.42, 0.42]} raio={0.05} cor={tema.objeto} position={[0, 0.21, 0]} />
      <Caixa args={[0.26, 0.02, 0.05]} raio={0.01} cor={tema.objetoEscuro} position={[0, 0.43, 0]} sombra={false} />
    </group>
  );

// Seta em arco de `a` até `b` (o confronto)
const UP = new THREE.Vector3(0, 1, 0);
export const SetaArco: React.FC<{a: V3; b: V3; k: number; cor: string; alt?: number}> = ({a, b, k, cor, alt = 0.6}) => {
  if (k < 0.02) return null;
  const n = 14;
  const ponto = (u: number): THREE.Vector3 => new THREE.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * alt, a[2] + (b[2] - a[2]) * u);
  const fim = Math.max(1, Math.round(n * k));
  const pedacos = [];
  for (let i = 0; i < fim; i++) {
    const p0 = ponto(i / n);
    const p1 = ponto((i + 1) / n);
    const d = p1.clone().sub(p0);
    const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
    const m = p0.clone().lerp(p1, 0.5);
    pedacos.push(
      <mesh key={i} position={[m.x, m.y, m.z]} quaternion={q}>
        <cylinderGeometry args={[0.035, 0.035, d.length() * 1.05, 8]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.5} />
      </mesh>,
    );
  }
  const u = fim / n;
  const pf = ponto(u);
  const dir = ponto(Math.min(1, u + 0.01)).sub(ponto(Math.max(0, u - 0.05))).normalize();
  const qf = new THREE.Quaternion().setFromUnitVectors(UP, dir);
  return (
    <group>
      {pedacos}
      <mesh position={[pf.x, pf.y, pf.z]} quaternion={qf}>
        <coneGeometry args={[0.1, 0.22, 16]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// ---------- Livro "REGRAS" com cadeado ----------
export const LivroRegras: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; abre: number}> = ({tema, pos, rot = [0, 0, 0], escala, abre}) => {
  if (escala < 0.02) return null;
  const F = festa(tema);
  const capa = mistura(tema.objetoEscuro, F.azulNoite, 0.5);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.3, 1.75, 0.34]} raio={0.06} cor={capa} position={[0, 0.875, 0]} />
      <Caixa args={[1.2, 1.65, 0.3]} raio={0.02} cor={mistura(tema.objetoClaro, tema.areia, 0.3)} position={[0.04, 0.875, 0]} sombra={false} />
      <Caixa args={[1.32, 1.77, 0.05]} raio={0.03} cor={capa} position={[0, 0.875, 0.16]} />
      <Placa tema={{...tema, tinta: capa}} pos={[0, 1.25, 0.2]} larg={1.0} alt={0.3} linhas={[{t: 'REGRAS', tam: 200, cor: F.loiro, peso: 900}]} fundo={capa} />
      {/* Cadeado */}
      <group position={[0, 0.7, 0.24]}>
        <Caixa args={[0.36, 0.3, 0.12]} raio={0.04} cor={F.dourado} emissivo={0.15} />
        <group position={[0, 0.15 + 0.12 * abre, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.11, 0.025, 8, 20, Math.PI]} />
            <meshStandardMaterial color={tema.objeto} roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
        <mesh position={[0, -0.02, 0.065]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color={tema.objetoEscuro} />
        </mesh>
      </group>
    </group>
  );
};

// ---------- Celular gigante com enquete de story (genérica: "A" e "B") ----------
export const CEL = {w: 1.7, h: 3.3};
export const CelularEnquete: React.FC<{
  tema: Tema;
  pos: V3;
  rotY?: number;
  sobe: number;
  luz: number;
  valores: [number, number];
  barras: number;
  toque: number;
  cores: [string, string];
}> = ({tema, pos, rotY = 0, sobe, luz, valores, barras, toque, cores}) => {
  if (sobe < 0.02) return null;
  const tela = mistura(tema.fundo, tema.objetoEscuro, 0.35);
  const temaTela = {...tema, tinta: tela};
  const yb = [-0.15, -0.6];
  return (
    <group position={[pos[0], pos[1] - CEL.h * 1.05 * (1 - sobe), pos[2]]} rotation={[0, rotY, 0]}>
      <group position={[0, CEL.h / 2 + 0.25, 0]}>
        <Caixa args={[CEL.w + 0.16, CEL.h + 0.16, 0.16]} raio={0.16} cor={mistura(tema.objetoEscuro, tema.tinta, 0.12)} />
        <Caixa args={[CEL.w, CEL.h, 0.02]} raio={0.1} cor={tela} emissivo={0.08 * luz} position={[0, 0, 0.08]} sombra={false} />
        {/* Barrinhas do story no topo */}
        {[0, 1, 2, 3].map((i) => (
          <Caixa key={i} args={[0.34, 0.025, 0.012]} raio={0.006} cor={tema.objetoClaro} emissivo={0.4 * luz} position={[-0.6 + i * 0.4, CEL.h / 2 - 0.12, 0.1]} sombra={false} />
        ))}
        <Placa tema={temaTela} pos={[0, 0.85, 0.09]} larg={1.5} alt={0.55} linhas={[{t: 'QUEM GANHOU', tam: 120, cor: tema.texto, peso: 900}, {t: 'O DEBATE?', tam: 120, cor: tema.texto, peso: 900}]} fundo={tela} />
        {/* Opções A e B com as barras */}
        {[0, 1].map((i) => (
          <group key={i} position={[0, yb[i], 0.1]}>
            <Caixa args={[1.42, 0.34, 0.02]} raio={0.06} cor={mistura(tela, tema.objetoClaro, 0.08)} sombra={false} />
            {barras > 0.01 ? <Caixa args={[Math.max(0.13, 1.4 * valores[i] * barras), 0.32, 0.024]} raio={0.06} cor={cores[i]} emissivo={0.3 + 0.4 * luz} position={[-0.7 + (Math.max(0.13, 1.4 * valores[i] * barras)) / 2, 0, 0.006]} sombra={false} /> : null}
            <Placa tema={{...tema, tinta: tela}} pos={[-0.5, 0, 0.03]} larg={0.26} alt={0.26} linhas={[{t: i === 0 ? 'A' : 'B', tam: 600, cor: tema.texto, peso: 900}]} fundo={mistura(tela, tema.objetoClaro, 0.08)} />
          </group>
        ))}
        {/* Botão "vota aqui" e o toque */}
        <Caixa args={[0.9, 0.22, 0.02]} raio={0.1} cor={tema.objetoClaro} emissivo={0.3 * luz} position={[0, -1.2, 0.1]} sombra={false} />
        {toque > 0.01 && toque < 0.99 ? (
          <mesh position={[0.3, yb[0], 0.13]}>
            <ringGeometry args={[0.06 + 0.3 * toque, 0.1 + 0.3 * toque, 32]} />
            <meshBasicMaterial color={tema.objetoClaro} transparent opacity={0.7 * (1 - toque)} depthWrite={false} />
          </mesh>
        ) : null}
        {/* Véu que apaga a tela (tirar do ar) */}
        {luz < 0.99 ? (
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[CEL.w + 0.02, CEL.h + 0.02]} />
            <meshBasicMaterial color={'#000000'} transparent opacity={0.9 * (1 - luz)} depthWrite={false} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Prancheta da pesquisa (papel em tom médio) e o carimbo "REGISTRADA" ----------
export const Prancheta: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; carimbo: number; corCarimbo: string; linhas?: number}> = ({tema, pos, rot = [0, 0, 0], escala, carimbo, corCarimbo, linhas = 1}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.branco, tema.areia, 0.38);
  const prancha = mistura(tema.areia, tema.objetoEscuro, 0.45);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.0, 1.36, 0.05]} raio={0.04} cor={prancha} />
      <Caixa args={[0.88, 1.2, 0.02]} raio={0.01} cor={papel} position={[0, -0.04, 0.035]} sombra={false} />
      <Caixa args={[0.36, 0.12, 0.06]} raio={0.03} cor={tema.objeto} position={[0, 0.64, 0.05]} />
      <Placa tema={{...tema, tinta: papel}} pos={[0, 0.38, 0.06]} larg={0.8} alt={0.2} linhas={[{t: 'PESQUISA', tam: 150, cor: tema.fundo, peso: 900}]} fundo={papel} />
      {Array.from({length: 6}).map((_, i) =>
        i / 6 < linhas ? (
          <group key={i} position={[0, 0.16 - i * 0.12, 0.062]}>
            <Caixa args={[0.08, 0.08, 0.01]} raio={0.01} cor={tema.objetoEscuro} position={[-0.32, 0, 0]} sombra={false} />
            <Caixa args={[0.5 - (i % 3) * 0.08, 0.025, 0.01]} raio={0.005} cor={mistura(tema.objetoEscuro, papel, 0.3)} position={[0.02 - (i % 3) * 0.04, 0, 0]} sombra={false} />
          </group>
        ) : null,
      )}
      {carimbo > 0.02 ? (
        <group position={[0.05, -0.45, 0.08]} rotation={[0, 0, 0.18]} scale={1 + 0.7 * (1 - Math.min(1, carimbo))}>
          <Placa tema={{...tema, tinta: corCarimbo}} pos={[0, 0, 0]} larg={0.82} alt={0.22} linhas={[{t: 'REGISTRADA', tam: 150, cor: corCarimbo, peso: 900}]} fundo={papel} />
        </group>
      ) : null}
    </group>
  );
};

// ---------- Gráfico da pesquisa com a faixa da margem de erro ----------
export const GraficoMargem: React.FC<{tema: Tema; pos: V3; rotY?: number; alturas: number[]; k: number; banda: number; cor: string; corFalsa?: string; falsa?: number; escala?: number}> = ({
  tema,
  pos,
  rotY = 0,
  alturas,
  k,
  banda,
  cor,
  corFalsa,
  falsa = -1,
  escala = 1,
}) => {
  if (k < 0.01) return null;
  const passo = 0.9;
  const x0 = (-(alturas.length - 1) * passo) / 2;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[alturas.length * passo + 0.4, 0.06, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.03, 0]} />
      {alturas.map((h0, i) => {
        const h = Math.max(0.05, h0 * k);
        const c = i === falsa && corFalsa ? corFalsa : mistura(cor, tema.objetoClaro, 0.12 * i);
        return (
          <group key={i} position={[x0 + i * passo, 0.06, 0]}>
            <Caixa args={[0.56, h, 0.56]} raio={Math.min(0.08, h / 2.2)} cor={c} emissivo={0.12} position={[0, h / 2, 0]} />
            {banda > 0.02 && i !== falsa ? (
              <mesh position={[0, h, 0]} scale={[1, banda, 1]}>
                <boxGeometry args={[0.74, 0.5, 0.74]} />
                <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={0.3} transparent opacity={0.28} depthWrite={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

// Mão (luva genérica) que empurra para cima: antebraço + mão, vindo de baixo e de lado
export const MaoEmpurra: React.FC<{tema: Tema; pos: V3; escala: number}> = ({tema, pos, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} scale={escala} rotation={[0, 0, -0.5]}>
      <mesh position={[0, -0.45, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.6, 8, 14]} />
        <Fosco cor={tema.corpo} />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[1.1, 0.8, 0.7]} castShadow>
        <sphereGeometry args={[0.15, 18, 14]} />
        <Fosco cor={tema.corpo} />
      </mesh>
    </group>
  );

// ---------- Câmera fotográfica e a foto que sai dela (sem flash: regra de não piscar) ----------
export const CameraFoto: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number}> = ({tema, pos, rotY = 0, escala}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.3, 0.85, 0.55]} raio={0.1} cor={mistura(tema.objetoEscuro, tema.objeto, 0.2)} />
      <Caixa args={[1.32, 0.18, 0.57]} raio={0.06} cor={tema.objetoEscuro} position={[0, -0.25, 0]} />
      <mesh position={[0, 0.02, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.22, 32]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
      <mesh position={[0, 0.02, 0.475]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
        <meshStandardMaterial color={mistura(tema.fundo, festa(tema).azul, 0.3)} roughness={0.1} metalness={0.5} />
      </mesh>
      <Caixa args={[0.26, 0.14, 0.04]} raio={0.03} cor={tema.objetoClaro} position={[-0.38, 0.27, 0.27]} />
      <mesh position={[0.42, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <Fosco cor={tema.objeto} />
      </mesh>
    </group>
  );

export const Polaroid: React.FC<{tema: Tema; pos: V3; rot?: V3; escala: number; alturas: number[]; banda: number; cor: string}> = ({tema, pos, rot = [0, 0, 0], escala, alturas, banda, cor}) => {
  if (escala < 0.02) return null;
  const papel = mistura(tema.branco, tema.areia, 0.38);
  const foto = mistura(tema.fundo, tema.objetoEscuro, 0.4);
  return (
    <group position={pos} rotation={rot} scale={escala}>
      <Caixa args={[1.0, 1.18, 0.03]} raio={0.02} cor={papel} />
      <mesh position={[0, 0.08, 0.026]}>
        <planeGeometry args={[0.86, 0.82]} />
        <meshStandardMaterial color={foto} roughness={0.7} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} />
      </mesh>
      {alturas.map((h, i) => {
        const x = -0.26 + i * 0.26;
        const hh = 0.6 * h;
        return (
          <group key={i}>
            <Caixa args={[0.16, hh, 0.02]} raio={0.01} cor={mistura(cor, tema.objetoClaro, 0.12 * i)} emissivo={0.2} position={[x, -0.3 + hh / 2, 0.045]} sombra={false} />
            {banda > 0.02 ? (
              <mesh position={[x, -0.3 + hh, 0.06]}>
                <planeGeometry args={[0.22, 0.14 * banda]} />
                <meshBasicMaterial color={cor} transparent opacity={0.4} depthWrite={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Poltrona de entrevista (sem detalhe em acento) ----------
export const PoltronaTV: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; cor: string}> = ({tema, pos, rotY = 0, escala, cor}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[0.95, 0.4, 0.85]} raio={0.1} cor={cor} position={[0, 0.3, 0]} />
      <Caixa args={[0.95, 0.75, 0.22]} raio={0.1} cor={cor} position={[0, 0.72, -0.33]} />
      {[-1, 1].map((l) => (
        <Caixa key={l} args={[0.18, 0.55, 0.85]} raio={0.08} cor={cor} position={[0.43 * l, 0.47, 0]} />
      ))}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.1, 24]} />
        <Fosco cor={tema.objetoEscuro} />
      </mesh>
    </group>
  );

// ---------- Cartão de veredito (ERRAR × MENTIR), de pé ----------
export const CartaoVeredito: React.FC<{tema: Tema; pos: V3; rotY?: number; escala: number; texto: string; sub: string; cor: string; letra: string; brilho?: number}> = ({tema, pos, rotY = 0, escala, texto, sub, cor, letra, brilho = 0}) =>
  escala < 0.02 ? null : (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <Caixa args={[1.9, 1.1, 0.12]} raio={0.08} cor={cor} emissivo={0.12 + 0.35 * brilho} />
      <Placa tema={{...tema, tinta: cor}} pos={[0, 0, 0.065]} larg={1.7} alt={0.92} linhas={[{t: texto, tam: 210, cor: letra, peso: 900}, {t: sub, tam: 120, cor: letra, peso: 700}]} fundo={cor} />
    </group>
  );
