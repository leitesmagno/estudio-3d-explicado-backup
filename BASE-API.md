# BASE-API do Estúdio 3D Explicado

Este arquivo descreve tudo o que a base (`src/base/`) oferece para montar vídeos verticais 3D narrados.
Os nomes aqui são os nomes reais do código. Se algum outro guia mostrar um nome diferente, vale este arquivo.

Sumário:
1. Regras gerais
2. Pastas e comandos
3. Composições: como registrar um vídeo
4. Esqueleto de um vídeo
5. Tema e estilos (`base/tema`, `src/estilos/`, `src/estilo.ts`)
6. Tempo e `quando()` (`base/tempo`)
7. Legenda (`base/legenda`)
8. Área segura (`base/reels`)
9. Interface 2D (`base/interface`)
10. Peças 3D (`base/pecas`)
11. Gráficos (`base/graficos`)
12. Cidade, caminhos e trilhas (`base/cidade`)
13. Som (`base/som`)
14. Cores (`base/cores`)
15. Scripts: render, quadros de revisão, capa, amostra
16. Ferramentas Python: transcrever e alinhar
17. Desempenho, memória e fotossensibilidade
18. Trazendo peças de vídeos antigos

---

## 1. Regras gerais

- Quadro: 1080 × 1920, 30 fps. Constantes `LARGURA`, `ALTURA`, `FPS` em `base/reels`.
- **Tempo é sempre em segundos** dentro do vídeo: `const t = frame / fps`. Toda função de tempo da base recebe e devolve segundos.
- Unidade 3D: 1 unidade ≈ 1 metro. `y` aponta para cima. A **frente** de toda peça é `z+`.
- Ângulos em radianos.
- Cores 3D sempre vêm do tema (`tema.objeto`, `tema.acento`...). Nenhuma cor `#xxxxxx` escrita no código do vídeo.
- **Um único acento** (`tema.acento`) por cena, só no que importa.
- Nada pisca. Brilho sobe e desce com `pulso()` ou `rampa()`, nunca liga e desliga de um quadro para o outro.
- Peças que recebem `escala` (ou `k`) somem sozinhas abaixo de 0,02. Pode passar 0 sem medo.
- O texto que muda com o tempo fica na interface 2D (HTML), não em textura 3D.

## 2. Pastas e comandos

```
projetos/                 pasta pública do Remotion (staticFile("001. nome/audio/narracao-norm.wav"))
  _estudio/fontes/        Inter e JetBrains Mono (licença OFL)
  _estudio/sons/          efeitos sonoros do Estúdio (gerados por tools/gerar_sons.py)
  NNN. nome/audio/        narracao-norm.wav, roteiro-falado.txt
  NNN. nome/transcricao/  palavras.json, transcript.md
  NNN. nome/revisao/      quadros de revisão (.jpg)
edicoes/NNN. nome/        video final.mp4, capa.jpg, legenda do post.txt
src/base/                 a base (não editar por vídeo)
src/estilos/<id>.ts       um arquivo por perfil
src/estilo.ts             registra os estilos e escolhe o ativo
src/videos/<codigo>/      <Nome>.tsx, pecas.tsx, palavras.ts
src/Root.tsx              registro das composições
scripts/                  render.mjs, quadros.mjs
tools/                    transcrever.py, alinhar_roteiro.py, gerar_sons.py, requirements.txt
```

Comandos (na raiz do Estúdio):

| O que | Comando |
|---|---|
| Prévia andando | `npx remotion studio` |
| Conferir o código | `npx tsc --noEmit` (ou `npm run typecheck`) |
| Quadros de revisão | `node scripts/quadros.mjs <Nome> "projetos/NNN. nome"` |
| Vídeo final | `node scripts/render.mjs <Nome> "edicoes/NNN. nome"` |
| Capa | `npx remotion still Capa<Nome> "edicoes/NNN. nome/capa.jpg"` |
| Fundo limpo para capa | `npx remotion still <Nome>Limpo "projetos/NNN. nome/capa/fundo-limpo.jpg" --frame=1418` |
| Amostra de estilo | `npx remotion still AmostraEstilo "projetos/amostra do estilo <id>.jpg" --props="projetos/amostra.json"` |
| Transcrever | `.venv/bin/python tools/transcrever.py "projetos/NNN. nome"` |
| Alinhar | `.venv/bin/python tools/alinhar_roteiro.py "projetos/NNN. nome" <codigo>` |

No Windows o Python é `.venv\Scripts\python`. O `remotion.config.ts` já aponta a pasta pública (`projetos`) e o ponto de entrada (`src/index.ts`).

## 3. Composições: como registrar um vídeo

Código do vídeo: minúsculas e números (`juroscartao`). Nome: o mesmo em formato de título (`JurosCartao`).
Registre **quatro** composições em `src/Root.tsx`:

| id | O que é | props |
|---|---|---|
| `<Nome>` | vídeo normal | `{estilo: ATIVO, faixas: FAIXAS, revisao: REVISAO}` |
| `<Nome>Guia` | igual, com a moldura da área segura | `{..., guia: true}` |
| `<Nome>Limpo` | só o 3D, sem interface (fundo para a capa) | `{..., semInterface: true}` |
| `Capa<Nome>` | capa, `<Still>` 1080 × 1920 | `{estilo: ATIVO}` |

Composições fixas do Estúdio: `AmostraEstilo` (still, prop `estilo`), `Catalogo` (galeria de todas as peças) e `Exemplo` (+ `ExemploGuia`, `ExemploLimpo`, `CapaExemplo`).

Props que os scripts leem da composição:
- `faixas: Faixa[]`: o som do vídeo, mixado pelo `render.mjs` no fim (seção 13). Sem `faixas` o vídeo sai mudo (com aviso).
- `revisao: number[]`: segundos dos quadros de revisão padrão do `quadros.mjs`.
- `estilo?: string`: id de outro estilo registrado (teste de visual).

Exemplo de registro (copie de `src/Root.tsx`):

```tsx
import {JurosCartao, CapaJurosCartao, FAIXAS as FAIXAS_JC, QUADROS as QUADROS_JC, REVISAO as REVISAO_JC} from './videos/juroscartao/JurosCartao';

<Composition id="JurosCartao" component={JurosCartao} durationInFrames={QUADROS_JC} {...base} defaultProps={{estilo: ATIVO, faixas: FAIXAS_JC, revisao: REVISAO_JC}} />
<Composition id="JurosCartaoGuia" component={JurosCartao} durationInFrames={QUADROS_JC} {...base} defaultProps={{estilo: ATIVO, guia: true, faixas: FAIXAS_JC, revisao: REVISAO_JC}} />
<Composition id="JurosCartaoLimpo" component={JurosCartao} durationInFrames={QUADROS_JC} {...base} defaultProps={{estilo: ATIVO, semInterface: true, faixas: FAIXAS_JC, revisao: REVISAO_JC}} />
<Still id="CapaJurosCartao" component={CapaJurosCartao} width={LARGURA} height={ALTURA} defaultProps={{estilo: ATIVO}} />
```

`const base = {fps: FPS, width: LARGURA, height: ALTURA} as const;` já existe no Root. O componente do vídeo precisa aceitar as props `{guia?, semInterface?, estilo?, faixas?, revisao?}`.

Total de quadros: `QUADROS = Math.round((duração do áudio + 0.9) * FPS)`. Com a fala alinhada, `duracaoFala(PALAVRAS)` dá o fim da última palavra; prefira a duração medida do arquivo de áudio quando houver.

## 4. Esqueleto de um vídeo

O modelo completo e comentado é `src/videos/exemplo/Exemplo.tsx`. A forma é sempre esta:

```tsx
import React from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AcabamentoCinema, Boneco, Camera, Palco, Particulas, cinematizar, enquadrar, focarEm, projetar, trilhoCam, type Cam, type V3} from '../../base/pecas';
import {Etiqueta, Marca, Pilula} from '../../base/interface';
import {Legenda} from '../../base/legenda';
import {GuiaReels} from '../../base/reels';
import {Sons, narracao, efeito, type Faixa} from '../../base/som';
import {criarQuando, entra, rampa} from '../../base/tempo';
import type {Tema} from '../../base/tema';
import {SERIE, temaPorId} from '../../estilo';
import {PALAVRAS} from './palavras';

export const FPS = 30;
const AUDIO_SEG = 74.72;                       // duração medida da narração
export const QUADROS = Math.round((AUDIO_SEG + 0.9) * FPS);
const P = '001. escala 6x1';                   // pasta do projeto em projetos/
const quando = criarQuando(PALAVRAS);
const T = {gancho: quando('Quase'), regra: quando('Constituição'), segunda: quando('seis dias', 2)};
export const FAIXAS: Faixa[] = [narracao(P), {arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1}, efeito('pop', T.regra)];
export const REVISAO = [0.5, T.regra + 0.4, T.segunda + 0.4];

const Mundo: React.FC<{t: number; tema: Tema}> = ({t, tema}) => (
  <>
    <Particulas t={t} centro={[0, 2.5, 0]} raio={9} n={50} />
    <Boneco tema={tema} pos={[0, 0, 0]} escala={entra(t, T.gancho)} cor={tema.corpo} />
  </>
);

export const MeuVideo: React.FC<{guia?: boolean; semInterface?: boolean; estilo?: string; faixas?: Faixa[]; revisao?: number[]}> = ({guia, semInterface, estilo, faixas = FAIXAS}) => {
  const tema = temaPorId(estilo);
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cam = cinematizar(trilhoCam(t, [[0, enquadrar([0, 1, 0], 4, 3)], [T.regra, enquadrar([0, 1, 0], 3, 2.4, [0.4, 0.3, 1])]]), t / (QUADROS / FPS));
  const mundo = (
    <ThreeCanvas width={1080} height={1920} resize={{offsetSize: true}} shadows="soft" gl={{antialias: false, toneMapping: THREE.NoToneMapping}} camera={{fov: cam.fov, position: cam.pos}}>
      <Palco tema={tema} alcance={230} sombraArea={17} />
      <Camera {...cam} />
      <Mundo t={t} tema={tema} />
      <AcabamentoCinema foco={focarEm(cam, [0, 1, 0], 2, 4)} raioAO={0.6} />
    </ThreeCanvas>
  );
  if (semInterface) return <AbsoluteFill style={{backgroundColor: tema.fundo}}>{mundo}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{backgroundColor: tema.fundo}}>
      {mundo}
      <Marca tema={tema} serie={SERIE} assunto="Escala 6x1" />
      <Pilula tema={tema} estado="HOJE" t={t} troca={0} />
      <Legenda t={t} palavras={PALAVRAS} tema={tema} />
      {guia ? <GuiaReels /> : null}
      <Sons faixas={faixas} />
    </AbsoluteFill>
  );
};
```

Ordem dentro do `ThreeCanvas`: `Palco` primeiro, `Camera`, o mundo, `AcabamentoCinema` por último.
Ordem por cima do 3D: interface, escurecimento final, `Marca`, `Pilula`, `Legenda`, `GuiaReels`, `Sons`.

## 5. Tema e estilos

### `base/tema`

`import {ESTILOS, FONTE, MONO, ESCURO, CLARO, registrarEstilo, derivarTema, type Tema, type Festa} from '../../base/tema';`

**`Tema`** (todas as cores em `"#RRGGBB"`, menos `legendaFundo`, que aceita `rgba()`):

| Campo | Uso |
|---|---|
| `nome?`, `serie?`, `chamada?` | id do estilo, nome da série, frase da chamada final |
| `fundo` | fundo do vídeo e da névoa |
| `chao` | chão do palco |
| `ceu` | cor de cima da luz ambiente |
| `ceuLuz` | tom frio e claro (vidro, gelo, telas) |
| `luzCor` | cor da luz principal |
| `luz?` | força geral da luz (padrão 1) |
| `objeto` | cinza médio dos objetos |
| `objetoClaro` | claro (creme no estilo explicando) |
| `objetoEscuro` | grafite |
| `corpo` | protagonista ("você") |
| `pessoa` | pessoas comuns, multidão |
| `branco` | branco quente |
| `tinta` | traços e texto escuro em 3D; cor padrão do texto da `Placa` |
| `areia` | tom de areia |
| `acento` | o único destaque |
| `texto`, `textoSuave` | texto 2D principal e secundário |
| `cartao`, `cartaoBorda` | fundo e borda dos cartões 2D |
| `pilulaFundo`, `pilulaTexto` | pílula e chips |
| `marca` | marca d'água do topo |
| `legendaFundo`, `legendaAceso`, `legendaApagado` | legenda |
| `fonte?`, `fonteMono?` | troca as fontes só neste estilo (CSS `font-family`) |
| `festa?` | cores extras (tipo `Festa`) |

**`Festa`**: `azul, azulNoite, dourado, loiro, pele, rosa, roxo, roxoEscuro, turquesa, verde`. Use só quando a cena pede mais de uma cor (festa, partidos, times). Leia com `tema.festa ?? ESCURO.festa!`.

- `ESCURO`: tema base escuro (grafite, creme, acento laranja `#E07A3C`).
- `CLARO`: tema base claro (fundo creme `#F0EBE1`).
- `ESTILOS: Record<string, Tema>`: todos os estilos registrados por id (`escuro`, `claro`, e os de `src/estilo.ts`). O vídeo faz `ESTILOS[estilo] || MEU_ESTILO`, ou simplesmente `temaPorId(estilo)`.
- `registrarEstilo(id, tema)`: põe o tema em `ESTILOS`.
- `derivarTema(base, troca)`: copia um tema trocando só alguns campos.
- `FONTE` (Inter) e `MONO` (JetBrains Mono): strings de `font-family` para o HTML. As fontes já vêm em `projetos/_estudio/fontes/` e carregam sozinhas.

### `src/estilos/<id>.ts`

Formato (veja `src/estilos/explicando.ts` e o modelo `src/estilos/modelo.ts`):

```ts
import {ESCURO, type Tema} from '../base/tema';

// Perfil: @seuperfil · Nicho: direito do trabalhador
export const SERIE = 'Explicando Direito';

export const DIREITOTRABALHADOR: Tema = {
  ...ESCURO,
  nome: 'direitotrabalhador',
  serie: SERIE,
  chamada: 'E segue o Explicando Direito para entender o que muda na sua vida.',
  acento: '#C23B2A',
};
```

### `src/estilo.ts` (registro e estilo ativo)

```ts
import {EXPLICANDO} from './estilos/explicando';
import {DIREITOTRABALHADOR} from './estilos/direitotrabalhador';
registrarEstilo('explicando', EXPLICANDO);
registrarEstilo('direitotrabalhador', DIREITOTRABALHADOR);
export const ATIVO = 'direitotrabalhador';
```

Exporta: `ATIVO` (id), `MEU_ESTILO` (tema ativo), `SERIE` (nome da série do ativo), `temaPorId(id?)` (tema pelo id, cai no ativo).
O estilo padrão de fábrica é `explicando`: escuro, creme `#F0EBE1`, acento marsala `#C23B2A`.

Teste de um estilo: `projetos/amostra.json` com `{"estilo": "<id>"}` e
`npx remotion still AmostraEstilo "projetos/amostra do estilo <id>.jpg" --props="projetos/amostra.json"`.

## 6. Tempo e `quando()`

`import {criarQuando, quandoEm, normalizar, duracaoFala, emQuadros, emSegundos, rampa, entra, sumir, pulso, k01, suave, sai, mola, cai, clamp, type Palavra, type Palavras} from '../../base/tempo';`

- `type Palavra = {w: string; s: number; e: number}`: palavra, início e fim em **segundos**. `type Palavras = Palavra[]` (alias antigo: `PALAVRAS`).
- `criarQuando(palavras)` devolve `quando(trecho, n = 1, fim = false): number` (segundos).
  - Compara sem acento, sem pontuação e sem maiúsculas: `quando('constituicao')` acha "Constituição,".
  - `n`: qual ocorrência (`quando('seis dias', 2)`). `fim = true`: devolve o fim da última palavra do trecho.
  - Se não achar, **lança erro** com o trecho e quantas ocorrências existem. O vídeo nem abre: corrija o trecho.
- `quandoEm(palavras, trecho, n, fim)`: o mesmo, sem criar a função.
- `duracaoFala(palavras)`: fim da última palavra (s).
- `emQuadros(s, fps = 30)` / `emSegundos(q, fps = 30)`.
- Curvas (todas devolvem 0 a 1, com t em segundos):
  - `rampa(t, a, b, easing = suave)`: 0 antes de a, 1 depois de b.
  - `entra(t, a, d = 0.45)`: nasce com mola (passa de 1 um pouco e volta). Ideal para `escala`.
  - `sumir(t, a, d = 0.4)`: 1 até a, depois cai a 0.
  - `pulso(t, a, dur = 0.9)`: sobe e desce uma vez (seno). Para brilhos.
  - `k01(x)`: limita entre 0 e 1.
  - Easings: `suave`, `sai`, `mola`, `cai`. `clamp` para `interpolate` do Remotion.

## 7. Legenda

`import {Legenda, montarBlocos, type BlocoLegenda} from '../../base/legenda';`

`<Legenda t={t} palavras={PALAVRAS} tema={tema} />`

| Prop | Padrão | O que faz |
|---|---|---|
| `t` | | tempo atual (s) |
| `palavras` | | lista do `palavras.ts` |
| `tema` | | estilo |
| `tam` | 56 | tamanho da letra |
| `max` | 6 | máximo de palavras por bloco |
| `baixo` | `LEGENDA_BAIXO` | y (px) da base da caixa |
| `somePausa` | 1.2 | em pausa maior que isso (s) a legenda sai suave |

Blocos quebram em `. ? !` sempre, em `, ; :` com 3 ou mais palavras, e no máximo `max` palavras sem terminar em palavra fraca ("de", "o", "que"...). A palavra dita fica `legendaAceso` e dá um pulinho de 6 px; as próximas ficam `legendaApagado`. Largura entre `SEGURO.esq` e `SEGURO.botoesX`.
`montarBlocos(palavras, max)` devolve os blocos, se você quiser outra aparência.

## 8. Área segura

`import {SEGURO, LEGENDA_BAIXO, FAIXA_3D, GuiaReels, LARGURA, ALTURA, FPS} from '../../base/reels';`

- `SEGURO = {topo: 132, baixo: 1560, esq: 60, dir: 1015, botoesX: 930}` (px).
  `topo`: abaixo do cabeçalho do app. `baixo`: acima do nome e da descrição. `botoesX`: começo da coluna de botões (da altura 980 para baixo). Textos ficam entre `esq` e `dir`; perto da legenda, entre `esq` e `botoesX`.
- `LEGENDA_BAIXO = 1524`: base da caixa da legenda.
- `CABECALHO = {marca: 286, pilula: 330}`: topo da marca d'água e da pílula de estado.
- `FAIXA_3D = {cima: 380, baixo: 1180}`: onde deve ficar o assunto do 3D.
- Posições usuais: marca em `CABECALHO.marca`, pílula em `CABECALHO.pilula`, conteúdo 2D a partir de y 440.
- `<GuiaReels />`: pinta as zonas cobertas pelo app (só para `<Nome>Guia`). Prop `opacidade?` (0.35).

## 9. Interface 2D

`import {Etiqueta, Pilula, Chip, Contador, Marca} from '../../base/interface';`

### `Etiqueta`: rótulo com linha guia até um ponto do 3D
`<Etiqueta tema={tema} x={80} y={480} alvo={projetar(p, cam, 1080, 1920)} titulo="Seu contrato" sub="O QUE MUDA" aparece={ap} destaque />`

| Prop | O que é |
|---|---|
| `x`, `y` | canto de cima à esquerda do cartão (px) |
| `alvo` | `{x, y}` em px (use `projetar`) |
| `titulo` | texto grande (46 px) |
| `sub?` | linha mono pequena (MAIÚSCULAS) |
| `aparece` | 0 a 1 (0 esconde; a linha se desenha depois do cartão) |
| `destaque?` | borda, marcador e linha no acento (fundo continua o do cartão) |
| `largura?` | largura máxima (padrão: até `SEGURO.dir`) |

Para sumir aos poucos, embrulhe: `<div style={{position: 'absolute', inset: 0, opacity: some}}>...</div>`.

### `Pilula`: estado do vídeo no topo
`<Pilula tema={tema} estado="A PROPOSTA" t={t} troca={T.proposta} y={CABECALHO.pilula} />`
`estado` (texto), `t` (s), `troca` (s em que este estado começou; o texto assenta em 0,35 s), `y?` (padrão `CABECALHO.pilula`), `x?` (padrão `SEGURO.esq`).
Padrão de uso: lista `ESTADOS: [number, string][]` e pegar o último com tempo ≤ t.

### `Chip`: frase curta em mono
`<Chip tema={tema} texto="MESMO SALÁRIO" k={entra(t, T.mesmo)} destaque tam={32} risco={0} apagado={0} />`
`k` 0 a 1 (aceita passar de 1), `destaque?`, `tam?` (34), `risco?` 0 a 1 (risca o texto), `apagado?` 0 a 1. É `inline-block`: posicione num `div` absoluto.

### `Contador`: número grande num cartão, centrado
`<Contador tema={tema} valor="44 H" rotulo="POR SEMANA" k={entra(t, T.h44)} y={430} destaque={false} />`

### `Marca`: marca d'água da série
`<Marca tema={tema} serie={SERIE} assunto="Escala 6x1" />` escreve "EXPLICANDO DIREITO · ESCALA 6X1" em `CABECALHO.marca` (prop `y?`).

## 10. Peças 3D (`base/pecas`)

`import {...} from '../../base/pecas';`

### Tipos
- `V3 = [number, number, number]`.
- `Cam = {pos: V3; alvo: V3; fov: number; sobe?: number; rolo?: number}`.
  `sobe`: quantos **pixels** o alvo aparece acima do centro do quadro (deixa espaço para a legenda; 40 a 80 é o normal). `rolo`: inclinação (rad).
- `Foco = {dist: number; faixa: number; bokeh: number}`: distância nítida, tamanho da faixa nítida, força do desfoque (0 desliga; 3 a 6).
- `Pose = {ombroD?: V3; ombroE?: V3; cotoveloD?: number; cotoveloE?: number; cabeca?: V3; tronco?: number; passo?: number}` (veja `Boneco`).
- `Linha = {t: string; tam: number; cor: string; peso?: number; mono?: boolean}` (veja `Placa`).

### Palco, câmera e acabamento

**`Palco`**: fundo, névoa, chão infinito, luz de cinema (principal com sombra macia, preenchimento frio, contraluz).
`<Palco tema={tema} alcance={230} sombraArea={17} />`
`alcance?` (230): até onde o mundo some na névoa. `sombraArea?` (20): meia largura da área com sombra em volta de `centro?` ([0,0,0]); aumente se o mundo for grande (30 a 52). `semChao?`, `luz?` (multiplica a luz).

**`Camera`**: `<Camera {...cam} />` aplica um `Cam` à câmera da cena (posição, alvo, fov, `sobe`, `rolo`).

**`AcabamentoCinema`**: por último no `ThreeCanvas`.
`<AcabamentoCinema foco={foco} raioAO={0.6} />`
`foco?` (Foco; sem foco, sem desfoque), `raioAO?` (0.6, oclusão de contato em unidades do mundo), `intensidadeAO?` (2.2), `vinheta?` (0.42), `simples?` (desliga oclusão e desfoque para prévias rápidas). Tem curva de tons neutra e antisserrilhado. Sem grão animado.

**`projetar(p, cam, W = 1080, H = 1920)`** → `{x, y, z, visivel}`: ponto 3D para pixels do quadro (já conta o `sobe`). `z` é a distância à frente da câmera.

**`enquadrar(alvo, larg, alt, dir = [0, 0.35, 1], folga = 1.1, fov = 30, sobe = 60)`** → `Cam`: enquadra uma caixa larg × alt em volta do alvo, olhando da direção `dir`, com o assunto na faixa útil do Reels.

**`cinematizar(cam, k, {lente = 1, arco = 0.08, grua = 0.025, sentido = 1})`** → `Cam`: "a câmera nunca para". `k` vai de 0 a 1 ao longo da cena; acrescenta arco em volta do alvo (`arco` rad no total), subida (`grua` × distância) e aproximação de lente (3,5% × `lente`). No meio da cena (k = 0.5) a câmera é a original.

**`trilhoCam(t, [[t0, cam0], [t1, cam1], ...])`** → `Cam`: passa pelas câmeras-chave com aceleração suave.
**`misturarCam(a, b, k)`**, **`distancia(a, b)`**.
**`focoAuto(cam, faixa = 0.3, bokeh = 4)`** → `Foco` no alvo (faixa = fração da distância).
**`focarEm(cam, p, faixa, bokeh = 4.5)`** → `Foco` num ponto.

### Materiais e blocos

**`Fosco`**: material fosco para `<mesh>`.
`<mesh><cylinderGeometry args={[0.2, 0.2, 1, 32]} /><Fosco cor={tema.objeto} emissivo={0.3} /></mesh>`
`cor`, `emissivo?` (0; 0 a 1 acende na própria cor), `opacidade?` (1), `aspereza?` (0.82), `dupla?` (dois lados).

**`Caixa`**: bloco arredondado fosco, a peça mais usada.
`<Caixa args={[1.6, 0.08, 0.9]} raio={0.03} cor={tema.objetoEscuro} position={[0, 0.78, 0]} />`
`args` [larg, alt, prof] centrado em `position`, `raio?` (0.05, limitado à metade da menor medida), `cor`, `emissivo?`, `opacidade?`, `sombra?` (true; use false em detalhes finos e coisas que brilham), `position?`, `rotation?`, `scale?`, filhos, e qualquer prop de `<mesh>` (ex.: `castShadow={false}`). A geometria é reaproveitada entre caixas iguais.

**`geoCaixa(larg, alt, prof, raio = 0.05)`** → `BufferGeometry` arredondada guardada para sempre. Use em constantes no topo do arquivo: `const G_CORPO = geoCaixa(1.3, 1.1, 1.0, 0.06);` e `<mesh geometry={G_CORPO}>`. Não descarte.

**`useDescartar(...objetos)`**: libera da GPU o que você criou com `useMemo` (geometria, textura, material) quando muda ou sai da tela.
```tsx
const tex = useMemo(() => new THREE.CanvasTexture(cv), [texto]);
useDescartar(tex);
```

### Efeitos

**`Particulas`**: poeira de luz flutuando (malha instanciada).
`<Particulas t={t} centro={[0, 2.5, 0]} raio={9} n={50} cor={...} />`
`t`, `centro`, `raio`, `n?` (50), `cor?` (claro do tema), `opacidade?` (0.4), `tamanho?` (1).

**`Onda`**: anel no chão que se abre e some.
`<Onda pos={p} k={rampa(t, a, a + 1.2, Easing.linear)} cor={tema.acento} raio={1.4} />`
`k` 0 a 1 (fora disso não aparece), `raio` final. Dois anéis e um disco claro, tudo suave.

**`Vapor`**: fumacinha subindo em ciclo. `<Vapor pos={p} t={t} cor? escala? n? />`. Some um valor a `t` para desencontrar duas saídas.

### Pessoas e objetos

**`Boneco`**: pessoa genérica, fosca, sem rosto, frente em z+, altura 1,84 na escala 1.
`<Boneco tema={tema} pos={p} rotY={0.3} escala={0.5} cor={tema.pessoa} pose={{passo: Math.sin(t * 6)}}>{filhos}</Boneco>`
- `cor?` (padrão `tema.pessoa`; protagonista `tema.corpo`; destaque `tema.acento`).
- `pose`:
  - `ombroD` / `ombroE`: [x, y, z]. x negativo = braço para a frente (−0.75 segura algo à frente). z positivo abre o braço D (`[0, 0, 2.4]` = acenar); no E use z negativo.
  - `cotoveloD` / `cotoveloE`: negativo dobra para a frente (−1.25 com ombro −0.75 = segurando celular).
  - `cabeca`: [x, y, z]; x positivo olha para baixo.
  - `tronco`: inclinação para a frente (0.3 = cansado).
  - `passo`: −1 a 1, fase da caminhada (pernas; braços também, se você não der ombros).
- Filhos ficam no espaço do boneco (escala 1): peito em `[0, 1.32, 0.2]`; mão direita à frente em `[0.27, 1.17, 0.42]` com `ombroD [-0.75, 0, 0.07]` e `cotoveloD -1.25`; mão direita estendida de lado com `ombroD [-0.55, 0, 0.1]`, `cotoveloD -0.9` fica perto de `[0.36, 1.02, 0.42]`.
- `MEDIDAS_BONECO` traz as medidas (altura, ombroY, braco...).

**`Placa`**: texto fixo em 3D (letreiro, tela, crachá). Frente z+.
`<Placa tema={tema} pos={[0, 0.3, 0.81]} rot={[0, 0, 0]} larg={1.8} alt={0.5} linhas={[{t: 'BANCO', tam: 220, cor: tema.objetoClaro, peso: 900}]} fundo={tema.objetoEscuro} />`
- `tam` é medido numa textura de **1024 px de largura**: cabem cerca de 1024 / (0,6 × tam) letras por linha. Texto que não cabe encolhe sozinho.
- Linhas empilhadas e centradas. `cor` da linha (padrão `tema.tinta`), `peso?` (800), `mono?`.
- `fundo?`: cor de fundo; sem fundo, só as letras. `brilho?` (0.18): luz própria (telas: 0.5 a 1). `dupla?`.
- Texto fixo por cena. Se o texto mudar a cada quadro a textura é refeita a cada quadro (evite: use a interface 2D).

**`Celular`**: celular genérico pequeno (0,085 × 0,17), tela em z+.
`<Celular tema={tema} pos={[0, 0, 0]} rot? brilho={0.6} corTela? />`. `brilho` 0 a 1,6. Na mão do boneco: `<group position={[0.27, 1.17, 0.42]} rotation={[0.45, Math.PI, 0]} scale={1.7}>`. Sozinho na cena: `<group scale={9}>`.

**`Predio`**: prédio de escritórios, base no chão. Escala 1: 3 × 3 × 8 (use `<group scale={0.35}>`).
`<Predio tema={tema} pos={[0, 0, 0]} rotY? alt? larg? prof? andares? cor? aceso? />` (`aceso` 0 a 1 acende as janelas).

**`Moeda`**: moeda na cor do acento, deitada (eixo y). `rot={[Math.PI / 2, 0, 0]}` deixa de pé.
`<Moeda tema={tema} pos={p} rot? r={0.2} brilho? escala? cor? />`. Espessura 0,26 × r; para empilhar, passo vertical 0,27 × r.

**`Pilhas`**: fileira de pilhas de moedas (uma malha instanciada).
`<Pilhas tema={tema} pos={p} alturas={[3, 5.5, 8]} r={0.2} espaco? cor? destaque={2} rotY? />`. `alturas` aceita fração (a moeda de cima nasce aos poucos). Com `destaque`, só aquela pilha fica no acento.

**`Cofre`**: cofre fosco 1,2 × 1,0 × 1,0, porta redonda na frente.
`<Cofre tema={tema} pos={p} rotY? abre={0} brilho={0} />` (`abre` 0 a 1 gira a porta; `brilho` acende o volante).

## 11. Gráficos

`import {Barra, Barras} from '../../base/graficos';`

- **`Barra`**: cresce do chão (base em `pos`). `<Barra pos={p} alt={1.8 * k} larg={0.6} cor={tema.acento} prof? emissivo? raio? />`. `alt` ≤ 0,005 some.
- **`Barras`**: gráfico pronto, centrado em `pos`, com base. `<Barras tema={tema} pos={p} valores={[0.8, 1.3, 1.9]} destaque={2} k={rampa(...)} larg? espaco? />`.

## 12. Cidade, caminhos e trilhas

`import {curva, Trilha, Envelope, Banco, Cidade, usePredios, SEU, TOPO_SEU, OUTRO, BC, type PredioCidade} from '../../base/cidade';`

- **`curva(a, b, alto, s)`** → `V3`: ponto do arco de a até b (s de 0 a 1), subindo `alto` no meio. Moeda voando: `pos={curva(DE, ATE, 1.2, k)}`.
- **`Trilha`**: pontinhos ao longo de um caminho. `<Trilha f={(s) => curva(A, B, 1, s)} prog={k} cor={tema.acento} n={20} raio={0.04} opacidade={1} />`.
- **`Envelope`**: envelope fechado com selo. `<Envelope tema={tema} pos={p} rotY={0.4} giro={2 * k} />` ou `rot={[x, y, z]}`; `escala?` (1 = 0,5 × 0,32), `brilho?` (acende o selo).
- **`Banco`**: prédio com colunas e frontão, 2,4 × 1,9 × 1,6. `<Banco tema={tema} pos={p} rotY? sobe={1} pulso={0} cor? />`.
- **`Cidade`**: cidade pronta: chão, avenida em z = 2, prédios comuns instanciados, seu banco, outro banco e Banco Central.
  `<Cidade tema={tema} t={t} sobe={1} bcSobe={1} bancosSobem={[1, 1]} pulsoSeu={0} />`
  `sobe` 0 a 1 cresce os prédios comuns (0 não desenha; para escolher quais aparecem, desenhe você mesmo com `usePredios()`), `bcSobe` Banco Central, `bancosSobem` [seu, outro], `pulsoSeu` acende o seu banco e solta ondas.
- **`usePredios()`** → `{p: V3; w; h; d}[]`: lista fixa dos prédios comuns.
- Pontos: `SEU = [1.2, 0, 0]`, `TOPO_SEU = [1.2, 1.9, 0]` (chegada de moedas), `OUTRO = [-3.4, 0, 0]`, `BC = [-1, 0, -4.4]`.

## 13. Som

`import {Sons, efeito, narracao, SONS_ESTUDIO, type Faixa, type SomEstudio} from '../../base/som';`

O som do vídeo é uma lista de faixas. A **mesma lista** toca na prévia (`<Sons faixas={faixas} />`) e é mixada pelo `render.mjs` com ffmpeg no fim (o navegador não faz o áudio do vídeo final). Passe a lista na prop `faixas` da composição.

- `Faixa = {arquivo: string; inicio?: number; volume?: number; entrada?: number; saida?: number; ate?: number}`.
  `arquivo` é relativo a `projetos/`. `inicio` (s, padrão 0), `volume` (0 a 1), `entrada`/`saida` (fade em s), `ate` (s do vídeo em que corta).
- `narracao(pasta, volume = 1)`: `"<pasta>/audio/narracao-norm.wav"` a partir de 0.
- `efeito(nome, inicio, volume = 0.3)`: efeitos do Estúdio em `projetos/_estudio/sons/`: `pop`, `tique`, `whoosh`, `ding`, `baque`, `subida`, `impacto`, `bip`.
- Trilha de fundo: `{arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1.3}`.
- Volume alvo do vídeo final: média por volta de −18 dB, pico abaixo de −1 dB. Narração em 1, trilha 0,10 a 0,15, efeitos 0,25 a 0,45.
- Os efeitos são gerados por `python tools/gerar_sons.py` (já vêm prontos).

## 14. Cores

`import {mistura, tom} from '../../base/cores';` (`mistura` também sai de `base/pecas`).
- `mistura(a, b, k)` → hex: k = 0 dá a, k = 1 dá b. Para acender no acento: `mistura(tema.objeto, tema.acento, k)`.
- `tom(cor, k)`: clareia (k > 0) ou escurece (k < 0).

## 15. Scripts

### `scripts/render.mjs`: vídeo final em partes
```
node scripts/render.mjs <Nome> "edicoes/NNN. nome"
```
- Gera a imagem em partes de até 800 quadros, cada parte num navegador novo e **sem áudio**, guardadas em `edicoes/NNN. nome/.partes <Nome>/parte 001.mp4`, `parte 002.mp4`... Cada parte pronta ganha um arquivo `.ok`.
- Junta as partes (ffmpeg, sem recomprimir) e mixa as `faixas` (ffmpeg). Saída: `edicoes/NNN. nome/video final.mp4`.
- Mostra "Parte 2 de 3: 60% (memória do computador em uso: ...)" a cada 5%.
- **Travou? Rode o mesmo comando de novo**: partes com `.ok` são aproveitadas.
- Opções:
  - `--quadros-por-parte=400` partes menores (menos memória) ou `--partes=N`.
  - `--parte=K` refaz só a parte K (depois de corrigir uma cena) e junta de novo.
  - `--refazer` ignora as partes prontas.
  - `--nome="outro nome.mp4"`, `--estilo=<id>`, `--props=arquivo.json`.
  - `--so-video` não junta o som.
  - `--navegador=<caminho do Chrome>`, `--gl=angle|swangle|egl` (padrão: `angle` no Mac/Windows, `swangle` no Linux), `--concorrencia=N` (padrão 1), `--crf=18`, `--log=verbose`.
- Se mudar o tamanho das partes, apague a pasta `.partes <Nome>` antes (ou use `--refazer`).

### `scripts/quadros.mjs`: quadros de revisão
```
node scripts/quadros.mjs <Nome> "projetos/NNN. nome" [segundos...]
```
- Grava `projetos/NNN. nome/revisao/<Nome> 012.40s.jpg`.
- Sem segundos: usa a prop `revisao` da composição; sem ela, 10 quadros espalhados.
- Exemplos: `node scripts/quadros.mjs JurosCartaoGuia "projetos/013. juros" 3.2 15 41.5`.
- Opções: `--saida=<pasta>` (grava direto nela), `--estilo`, `--props`, `--png`, `--navegador`, `--gl`.

### Stills pelo Remotion
`npx remotion still Capa<Nome> "edicoes/NNN. nome/capa.jpg"` e `npx remotion still <Nome>Limpo "...jpg" --frame=N`. Props por arquivo JSON: `--props="projetos/arquivo.json"` (funciona igual no Mac e no Windows).

## 16. Ferramentas Python

Ambiente: `.venv` na raiz do Estúdio, criado com `python3 -m venv .venv` e `.venv/bin/pip install -r tools/requirements.txt` (Windows: `.venv\Scripts\pip`).

### `tools/transcrever.py`
```
.venv/bin/python tools/transcrever.py "projetos/NNN. nome" [--modelo large-v3-turbo] [--idioma pt] [--dispositivo auto]
```
Lê `audio/narracao-norm.wav` (ou `--audio`), grava `transcricao/palavras.json` (lista `{"w", "s", "e"}`) e `transcricao/transcript.md` (`[mm:ss.mmm] frase`). Usa o `roteiro-falado.txt` como dica de vocabulário (desligue com `--sem-dica`). Se já houver `palavras.json`, guarda o antigo como `palavras-anterior.json`. Computador simples: `--modelo small`.

### `tools/alinhar_roteiro.py`
```
.venv/bin/python tools/alinhar_roteiro.py "projetos/NNN. nome" <codigo> ["falado=>legenda" ...]
```
Lê `transcricao/palavras.json` e `audio/roteiro-falado.txt` e grava `src/videos/<codigo>/palavras.ts` com **as palavras exatas do roteiro** e o tempo do Whisper. Casa 1 palavra do roteiro com até 3 da transcrição e vice-versa ("6x1" com "6 por 1", "R$ 21 mil" com "21 mil reais"); números por extenso contam como algarismos. Palavras sem par recebem tempo por interpolação. Mostra contagem, última palavra, pausas maiores que 1,5 s e avisos de trechos duvidosos.
Pares `"falado=>legenda"` trocam, na legenda, a grafia escrita para a voz pela certa: `"Píquis=>Pix"`. O tempo do trecho é dividido entre as palavras novas (o total de palavras pode mudar).

### `tools/gerar_sons.py`
Recria os efeitos de `projetos/_estudio/sons/`. Só biblioteca padrão.

## 17. Desempenho, memória e fotossensibilidade

- Multidão (mais de 30 cópias da mesma peça): use `instancedMesh` (como `Particulas`, `Pilhas`, `Trilha` e `Cidade` fazem) ou `geoCaixa` em constante.
- Geometria ou textura criada no componente: sempre `useMemo` + `useDescartar`.
- Nunca crie textura que muda a cada quadro.
- Pare de desenhar o que não está na cena: `{k > 0.02 ? <Peca .../> : null}`.
- Render: partes de 800 quadros. Se a memória passar de 6 GB, use `--quadros-por-parte=400`.
- Nada pisca: proibido alternar cor ou visibilidade de um quadro para o outro, flashes brancos e luzes estroboscópicas. Use `pulso()` de no mínimo 0,5 s. Ondas e brilhos sempre suaves.
- Detalhe colado em superfície (faixa, adesivo): afaste 0,003 a 0,01 para não "chuviscar".
- A base força `preserveDrawingBuffer` em todo WebGL e redesenha depois do pós-processamento; não é preciso fazer nada no vídeo.

## 18. Trazendo peças de vídeos antigos

Os arquivos `pecas.tsx` e `<Nome>.tsx` dos vídeos antigos funcionam com esta base **sem mudar nada**, inclusive os caminhos `'../../base/pecas'`, `'../../base/tema'`, `'../../base/reels'`, `'../../base/interface'`, `'../../base/graficos'`, `'../../base/cidade'` e `'../../estilo'`. Testado: `escala6x1c` (vídeo inteiro), `escala6x1/pecas.tsx`, `bets/pecas.tsx`, `escala6x1b/pecas.tsx`, `juros/pecas.tsx`, `intimacao/pecas.tsx` compilam sem erro.

Diferenças a saber ao portar:
- Vídeos antigos tocam o som com `<Audio>` dentro do componente. Para o `render.mjs` mixar o som, crie a lista `FAIXAS` (narração, trilha e a lista `SONS` convertida com `{arquivo: `${P}/sfx/${s.f}.wav`, inicio: s.t, volume: s.v}`) e passe em `defaultProps.faixas`. Pode manter o `<Audio>` para a prévia ou trocar por `<Sons faixas={faixas} />`.
- Dependência entre vídeos: muitas peças importam de outras pastas (`mistura` de `../bets/pecas`). Copie também essas pastas, ou troque por `import {mistura} from '../../base/cores'`.
- As funções locais dos vídeos antigos (`quando`, `rampa`, `entra`, `trilho`, `enq`, `vivo`, `focar`, `misturar`) continuam valendo; a base oferece as mesmas ideias prontas (`criarQuando`, `rampa`, `entra`, `trilhoCam`, `enquadrar`, `cinematizar`, `focarEm`, `misturarCam`) para vídeos novos.
- A legenda local dos vídeos antigos pode ser trocada por `<Legenda t={t} palavras={PALAVRAS} tema={tema} />` (mesma posição e mesmo comportamento).
- Medidas que mudaram de aparência (o nome e as props são os mesmos): `Predio`, `Cofre`, `Celular`, `Envelope` (da cidade) e `Cidade` foram redesenhados; confira o enquadramento nos quadros de revisão.
