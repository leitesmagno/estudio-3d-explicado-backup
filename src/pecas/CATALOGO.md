# Catálogo da biblioteca de peças

Biblioteca de peças 3D prontas para os vídeos do Estúdio: **354 peças** em 16 categorias, vindas de 23 vídeos já publicados.
Todas seguem as regras da base (BASE-API.md): formas foscas e arredondadas, cores do tema, frente virada para z+, sem marca e sem rosto.

## Sumário

1. Como importar
2. Como achar uma peça
3. Galeria visual
4. Nomes trocados (peças com o mesmo nome em dois arquivos)
5. Como criar uma peça nova
6. Pessoas e bonecos
7. Dinheiro e finanças
8. Prédios e cidade
9. Trabalho e escritório
10. Justiça e governo
11. Transporte
12. Saúde
13. Tecnologia e celulares
14. Educação
15. Esporte e jogos
16. Natureza e clima
17. Comunicação e mídia
18. Casa e consumo
19. Gráficos e números
20. Símbolos e ícones
21. Cenários (mundos inteiros)
22. Ajudantes, medidas e tipos (não são peças)

## 1. Como importar

De dentro de `src/videos/<codigo>/<Nome>.tsx`:

```tsx
import {Geladeira, Onibus, CofreFGTS, AmigoEstadio} from '../../pecas';
```

Também dá para importar direto do arquivo de origem, com o nome original (sem sufixo):

```tsx
import {Amigo, Estadio} from '../../pecas/estadio';
```

Toda peça recebe `tema` (o estilo ativo). O resto das props está na tabela de cada categoria. Regras que valem para quase todas:

- `pos: V3` é onde a peça fica, com a base no chão (y = 0) na maioria. `rotY` gira em volta do eixo vertical; `rot: V3` gira nos três eixos.
- `escala` (ou `k`, ou `sobe`) de 0 a 1 faz a peça nascer; abaixo de 0,02 ela nem é desenhada. Use `entra(t, T.algo)` da base.
- Props como `brilho`, `aceso`, `luz`, `destaque` vão de 0 a 1 e acendem no acento do tema. Anime com `rampa()` ou `pulso()`, nunca de um quadro para o outro.
- Props com `t` recebem o tempo do vídeo em segundos (para ondas, fumaça, bandeiras).
- O tamanho real de cada peça está no comentário em cima dela no arquivo. Na galeria tudo foi redimensionado para caber.

## 2. Como achar uma peça

- Pela galeria: abra as imagens em `projetos/_estudio/galeria/` (seção 3) e procure pelo desenho.
- Por palavra, neste catálogo: `grep -i "cadeira" src/pecas/CATALOGO.md`
- Pelo código: `grep -n "export const Cadeira" src/pecas/*.tsx` mostra o arquivo e a linha. O comentário logo acima explica as props.
- Todas as peças de um arquivo: `grep -n "^export const" src/pecas/juros.tsx`
- Quem usa uma peça: `grep -rn "Geladeira" src/videos/`
- No Windows (PowerShell): `Select-String -Path src\pecas\*.tsx -Pattern "export const Cadeira"`

## 3. Galeria visual

Cada categoria tem uma ou mais páginas de galeria (imagem 1080 × 1920, até 30 peças por página, com o nome e o arquivo embaixo de cada uma).
As imagens prontas ficam em `projetos/_estudio/galeria/`. No `npx remotion studio` elas aparecem na pasta **GaleriaPecas** (composições `Pecas<Categoria><n>`).

Para refazer as imagens (por exemplo, depois de trocar o estilo ativo ou criar peças):

```
node scripts/galeria.mjs                  todas as páginas
node scripts/galeria.mjs Casa Transporte   só essas categorias
node scripts/galeria.mjs --estilo=claro    com outro estilo
```

| Categoria | Imagens |
|---|---|
| Pessoas e bonecos | [pessoas e bonecos 1.jpg](<../../projetos/_estudio/galeria/pessoas e bonecos 1.jpg>) |
| Dinheiro e finanças | [dinheiro e finanças 1.jpg](<../../projetos/_estudio/galeria/dinheiro e finanças 1.jpg>) |
| Prédios e cidade | [prédios e cidade 1.jpg](<../../projetos/_estudio/galeria/prédios e cidade 1.jpg>) |
| Trabalho e escritório | [trabalho e escritório 1.jpg](<../../projetos/_estudio/galeria/trabalho e escritório 1.jpg>), [trabalho e escritório 2.jpg](<../../projetos/_estudio/galeria/trabalho e escritório 2.jpg>) |
| Justiça e governo | [justiça e governo 1.jpg](<../../projetos/_estudio/galeria/justiça e governo 1.jpg>) |
| Transporte | [transporte 1.jpg](<../../projetos/_estudio/galeria/transporte 1.jpg>), [transporte 2.jpg](<../../projetos/_estudio/galeria/transporte 2.jpg>) |
| Saúde | [saúde 1.jpg](<../../projetos/_estudio/galeria/saúde 1.jpg>) |
| Tecnologia e celulares | [tecnologia e celulares 1.jpg](<../../projetos/_estudio/galeria/tecnologia e celulares 1.jpg>) |
| Educação | [educação 1.jpg](<../../projetos/_estudio/galeria/educação 1.jpg>) |
| Esporte e jogos | [esporte e jogos 1.jpg](<../../projetos/_estudio/galeria/esporte e jogos 1.jpg>) |
| Natureza e clima | [natureza e clima 1.jpg](<../../projetos/_estudio/galeria/natureza e clima 1.jpg>) |
| Comunicação e mídia | [comunicação e mídia 1.jpg](<../../projetos/_estudio/galeria/comunicação e mídia 1.jpg>) |
| Casa e consumo | [casa e consumo 1.jpg](<../../projetos/_estudio/galeria/casa e consumo 1.jpg>) |
| Gráficos e números | [gráficos e números 1.jpg](<../../projetos/_estudio/galeria/gráficos e números 1.jpg>) |
| Símbolos e ícones | [símbolos e ícones 1.jpg](<../../projetos/_estudio/galeria/símbolos e ícones 1.jpg>), [símbolos e ícones 2.jpg](<../../projetos/_estudio/galeria/símbolos e ícones 2.jpg>) |
| Cenários (mundos inteiros) | [cenários mundos inteiros 1.jpg](<../../projetos/_estudio/galeria/cenários mundos inteiros 1.jpg>), [cenários mundos inteiros 2.jpg](<../../projetos/_estudio/galeria/cenários mundos inteiros 2.jpg>) |

## 4. Nomes trocados

Alguns arquivos têm peças com o mesmo nome (dois `Amigo`, dois `Calendario`...). No `index.ts` cada uma ganhou o sufixo do arquivo de origem.
Dentro do arquivo de origem o nome continua o original.

| Arquivo | Nome no arquivo | Nome no index |
|---|---|---|
| algoritmo.tsx | `Cartao` | `CartaoAlgoritmo` |
| algoritmo.tsx | `Cracha` | `CrachaAlgoritmo` |
| algoritmo.tsx | `MESA_Y` | `MESA_Y_ALGORITMO` |
| bets.tsx | `Pasta` | `PastaBets` |
| bets.tsx | `Carimbo3D` | `Carimbo3DBets` |
| bolsafamilia.tsx | `Holofote` | `HolofoteBolsaFamilia` |
| candidato.tsx | `Rampa` | `RampaCandidato` |
| carrovoador.tsx | `Rampa` | `RampaCarroVoador` |
| carrovoador.tsx | `Nuvem` | `NuvemCarroVoador` |
| carrovoador.tsx | `Fabrica` | `FabricaCarroVoador` |
| concurso.tsx | `Cartao` | `CartaoConcurso` |
| cruzeiro.tsx | `Esteira` | `EsteiraCruzeiro` |
| cruzeiro.tsx | `Tracejado` | `TracejadoCruzeiro` |
| cruzeiro.tsx | `Regua` | `ReguaCruzeiro` |
| cruzeiro.tsx | `Mala` | `MalaCruzeiro` |
| debate.tsx | `TELAO` | `TELAO_DEBATE` |
| escala6x1.tsx | `Cracha` | `CrachaEscala6x1` |
| escala6x1.tsx | `Marco` | `MarcoEscala6x1` |
| escala6x1.tsx | `Tracejado` | `TracejadoEscala6x1` |
| estadio.tsx | `TELAO` | `TELAO_ESTADIO` |
| estadio.tsx | `Amigo` | `AmigoEstadio` |
| estadio.tsx | `Bairro` | `BairroEstadio` |
| fumaca.tsx | `Prediozinho` | `PrediozinhoFumaca` |
| fumaca.tsx | `Amigo` | `AmigoFumaca` |
| gasolina.tsx | `Calendario` | `CalendarioGasolina` |
| hediondo.tsx | `Pacote` | `PacoteHediondo` |
| hediondo.tsx | `Bone` | `BoneHediondo` |
| hediondo.tsx | `Nuvem` | `NuvemHediondo` |
| imposto.tsx | `Bairro` | `BairroImposto` |
| imposto.tsx | `Regua` | `ReguaImposto` |
| imposto.tsx | `Pacote` | `PacoteImposto` |
| intimacao.tsx | `MESA_Y` | `MESA_Y_INTIMACAO` |
| intimacao.tsx | `Carimbo3D` | `Carimbo3DIntimacao` |
| intimacao.tsx | `Marco` | `MarcoIntimacao` |
| intimacao.tsx | `Pasta` | `PastaIntimacao` |
| intimacao.tsx | `Folha` | `FolhaIntimacao` |
| intimacao.tsx | `Calendario` | `CalendarioIntimacao` |
| intimacao.tsx | `Mala` | `MalaIntimacao` |
| juros.tsx | `Holofote` | `HolofoteJuros` |
| juros.tsx | `Folha` | `FolhaJuros` |
| mansao.tsx | `Envelope` | `EnvelopeMansao` |
| mansao.tsx | `Prediozinho` | `PrediozinhoMansao` |
| oitohoras.tsx | `Fabrica` | `FabricaOitoHoras` |
| oitohoras.tsx | `Bone` | `BoneOitoHoras` |
| oitohoras.tsx | `Esteira` | `EsteiraOitoHoras` |

`mistura` (misturar duas cores) existe em `bets.tsx` e `intimacao.tsx`, mas não sai pelo index: use a da base, `import {mistura} from '../../base/cores'`.

## 5. Como criar uma peça nova

1. Escolha o arquivo: uma peça nova de um vídeo vai primeiro no `src/videos/<codigo>/pecas.tsx`. Quando ela servir para outros vídeos, copie para `src/pecas/` (num arquivo existente do mesmo assunto ou num arquivo novo, ex.: `src/pecas/escola.tsx`).
2. Siga o molde abaixo. Ele usa só o que a base oferece (`Caixa`, `Fosco`, `geoCaixa`, `useDescartar`, cores do tema).
3. Exporte no `src/pecas/index.ts`: `export {MinhaPeca} from './escola';`. Se o nome já existir, use um sufixo (ex.: `MesaEscola`).
4. Ponha na galeria: acrescente uma linha na categoria certa em `src/pecas/galeria/itens.tsx` e rode `node scripts/galeria.mjs <Categoria>`. Olhe a imagem.
5. Acrescente a linha da peça na tabela da categoria aqui no CATALOGO.md.
6. Rode `npx tsc --noEmit` (tem de sair sem erro).

Molde:

```tsx
import React from 'react';
import {Caixa, Fosco, geoCaixa, type V3} from '../base/pecas';
import {mistura} from '../base/cores';
import type {Tema} from '../base/tema';

// Geometria repetida: crie uma vez, no topo do arquivo (não precisa descartar).
const G_TAMPO = geoCaixa(1.2, 0.06, 0.7, 0.02);

// ---------- Carteira escolar (1,2 × 0,76 × 0,7; frente em z+) ----------
// `aceso` 0..1: o tampo acende no acento. `escala` 0..1: nasce (abaixo de 0,02 some).
export const CarteiraEscolar: React.FC<{tema: Tema; pos: V3; rotY?: number; escala?: number; aceso?: number}> = ({tema, pos, rotY = 0, escala = 1, aceso = 0}) => {
  if (escala < 0.02) return null;
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={escala}>
      <mesh geometry={G_TAMPO} position={[0, 0.73, 0]} castShadow receiveShadow>
        <Fosco cor={mistura(tema.objetoClaro, tema.acento, aceso)} emissivo={0.3 * aceso} />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <Caixa key={x} args={[0.05, 0.7, 0.6]} raio={0.02} cor={tema.objetoEscuro} position={[x, 0.35, 0]} />
      ))}
    </group>
  );
};
```

Regras (as mesmas da BASE-API.md, seções 1, 10 e 17):

- 1 unidade = 1 metro, y para cima, frente em z+, base no chão. Escreva as medidas no comentário de cima.
- Cores só do tema (`tema.objeto`, `tema.objetoClaro`, `tema.objetoEscuro`, `tema.acento`...). Mais de uma cor (times, partidos, festa): `tema.festa ?? ESCURO.festa!`. Nada de `#xxxxxx` solto.
- Um único acento por cena. Nada pisca: tudo que acende recebe um número de 0 a 1 e a cena anima com `rampa()` ou `pulso()`.
- A peça não anima sozinha: ela recebe números (`abre`, `gira`, `t`) e a cena decide o tempo.
- Texto fixo em 3D só com `Placa`. Texto que muda a cada quadro vai na interface 2D.
- Geometria ou textura criada dentro do componente: `useMemo` + `useDescartar`. Mais de 30 cópias: `instancedMesh`.
- Detalhe colado numa superfície: afaste 0,003 a 0,01 para não "chuviscar".
- Sem marca, logo, escudo ou rosto de gente real. Nome de empresa, time ou pessoa vira texto genérico ou prop.

## 6. Pessoas e bonecos

18 peças. Galeria: `projetos/_estudio/galeria/pessoas e bonecos 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Adivinhador` | algoritmo.tsx | Figura do adivinhador de manto com bola de cristal que acende | `k: number`, `t: number`, `olhar: [number, number]`, `abre: number`, `brilho: number`, `placa?: number = 0` |
| `BolhaGrupo` | algoritmo.tsx | Bolha transparente com um grupinho de pessoas dentro (a bolha do algoritmo) | `cor: string`, `pos: V3`, `k: number`, `r?: number = 1.3`, `gente?: number = 1`, `brilho?: number = 0`, `t: number`, `agentes?: Agente[] = []`, `icone?: Assunto \| null = null`, `chao?: boolean = true`, `some?: number = 1` |
| `Plateia` | bolsafamilia.tsx | Plateia de bonecos presa à câmera (aparece num canto da tela) | `cam: Cam`, `px: number`, `py: number`, `d?: number = 2.4`, `n: number`, `larg: number`, `k: number`, `cor: string`, `t: number`, `olhaCima?: number = 0`, `cracha?: string`, `braco?: number = 0`, `sombra?: number = 0` |
| `Fantasma` | candidato.tsx | Embrulho que deixa transparente tudo o que está dentro (o boneco que "apaga") | `op: number`, `children: React.ReactNode` |
| `Multidao` | concurso.tsx | Multidão leve (instancedMesh) com mochilas | `agentes: Agente[]`, `corCorpo?: string`, `corMochila?: string`, `mochila?: boolean = true` |
| `Pessoa` | cruzeiro.tsx | Boneco colorido genérico (cores da paleta festa) | `pos: V3`, `rotY?: number = 0`, `cor: string`, `escala?: number = 0.3`, `pose?: Pose`, `children?: React.ReactNode` |
| `Candidato` | debate.tsx | Candidato: boneco sem rosto com cor da campanha e gravata | `pos: V3`, `cor: string`, `gravata: string`, `pose?: Pose`, `rotY?: number = 0`, `escala?: number = 1` |
| `MaoEmpurra` | debate.tsx | Mão de luva genérica empurrando para cima | `pos: V3`, `escala: number` |
| `AmigoEstadio` | estadio.tsx | Torcedor de camisa listrada, sem escudo | `pos: V3`, `rotY?: number = 0`, `pose?: Pose`, `escala?: number = 1` |
| `Torcida` | estadio.tsx | Torcida de muitos bonecos (você dá a lista de lugares) | `gente: Torcedor[]`, `t: number`, `s: number`, `agita: number`, `luz: number` |
| `AmigoFumaca` | fumaca.tsx | Boneco de casaco dourado (o amigo do amigo) | `pos: V3`, `rotY?: number = 0`, `pose?: Pose`, `escala: number` |
| `BoneHediondo` | hediondo.tsx | Boné de aba reta (filho do Boneco) | `cor: string` |
| `Boneca` | mansao.tsx | Boneca de festa com vestido e cabelo, que dança | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `vestido: string`, `danca?: number = 0`, `t?: number = 0`, `fase?: number = 0`, `braco?: number = 0` |
| `CabeloLambido` | mansao.tsx | Cabelo penteado para trás (filho do Boneco) | `brilho?: number = 0` |
| `Cartola` | oitohoras.tsx | Cartola (filho do Boneco) | (só `tema`) |
| `Chapeu` | oitohoras.tsx | Chapéu de aba (filho do Boneco) | (só `tema`) |
| `BoneOitoHoras` | oitohoras.tsx | Boné de operário (filho do Boneco) | `cor?: string` |
| `Quepe` | oitohoras.tsx | Quepe de comandante ou policial (filho do Boneco) | (só `tema`) |

Exemplos de uso:

```tsx
// Candidato: boneco sem rosto com cor da campanha e gravata
<Candidato tema={tema} pos={[0, 0, 0]} cor={festa(tema).azul} gravata={tema.acento} />
// Boneca de festa com vestido e cabelo, que dança
<Boneca tema={tema} pos={[0, 0, 0]} vestido={tema.acento} danca={1} />
// Multidão leve (instancedMesh) com mochilas
<Multidao tema={tema} agentes={agentesBolha(40, 2.2, 3)} mochila />
```

## 7. Dinheiro e finanças

15 peças. Galeria: `projetos/_estudio/galeria/dinheiro e finanças 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `MoedaCor` | bets.tsx | Moeda deitada com cor livre (a da base é sempre do acento) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `r?: number = 0.2`, `cor?: string`, `brilho?: number = 0`, `escala?: number = 1` |
| `Cofrinho` | bets.tsx | Caixinha aberta (uma conta) com pilha de moedas dentro | `pos: V3`, `escala: number`, `destaque?: number = 0`, `nivel?: number = 0`, `lasca?: number = 0` |
| `CartaoBeneficio` | bolsafamilia.tsx | Cartão de benefício social genérico, sem logo | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `brilho: number` |
| `Recibo` | escala6x1b.tsx | Recibo (a conta) que desenrola para baixo | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `desenrola: number`, `destaque?: number = 0` |
| `Contracheque` | escala6x1c.tsx | Contracheque em pé num suporte | `pos: V3`, `rotY?: number = 0`, `escala: number`, `salario: number`, `piso: number` |
| `TrilhoMoedas` | estadio.tsx | Canaleta com moedas correndo ao longo de um trajeto | `tr: Trajeto`, `k: number`, `t: number`, `fluxo: number`, `vazao: number`, `brilho?: number = 0` |
| `Torneira` | estadio.tsx | Torneira grande que pinga moedas (os juros) | `pos: V3`, `abre: number`, `k: number`, `brilho?: number = 0` |
| `CofreFGTS` | fgts.tsx | Cofre com porta redonda e cadeado na frente | `pos: V3`, `escala?: number = 1`, `abre: number`, `trava: number`, `brilho?: number = 0` |
| `MoedaPilha` | gasolina.tsx | Pilha de moedas que cresce | `pos: V3`, `rotY?: number = 0`, `altura?: number = 1`, `nMoedas?: number = 6`, `escala?: number = 1` |
| `NotaFiscal` | imposto.tsx | Nota fiscal em pé com a linha dos tributos | `pos: V3`, `rotY?: number = 0`, `escala: number`, `desenrola: number`, `tributos?: number = 0`, `separa?: number = 0`, `preco?: number = 0`, `imposto?: number = 0` |
| `CartaoCredito` | juros.tsx | Cartão de crédito com faixa que acende | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `faixa?: number = 0`, `reflexo?: number = -1` |
| `TagPorcento` | juros.tsx | Etiqueta de preço com "%" pendurada por fio | `pos: V3`, `escala: number`, `balanca?: number = 0`, `destaque?: number = 0` |
| `PilhaMoedas` | juros.tsx | Pilha de moedas com cor livre | `pos: V3`, `n: number`, `cor: string`, `r?: number = 0.3`, `brilho?: number = 0`, `escala?: number = 1` |
| `EtiquetaPreco` | mei.tsx | Etiqueta de preço (inflação) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `destaque?: number = 0` |
| `CanoMoedas` | multas.tsx | Cano por onde correm moedas | `pontos: V3[]`, `k: number`, `fluxo: number`, `n?: number = 14`, `brilho?: number = 0` |

Exemplos de uso:

```tsx
// Cofre com porta redonda e cadeado na frente
<CofreFGTS tema={tema} pos={[0, 0, 0]} abre={0.3} trava={1} />
// Cartão de crédito com faixa que acende
<CartaoCredito tema={tema} pos={[0, 0, 0]} escala={2} faixa={1} />
// Pilha de moedas com cor livre
<PilhaMoedas tema={tema} pos={[0, 0, 0]} n={12} cor={tema.acento} r={0.4} />
```

## 8. Prédios e cidade

17 peças. Galeria: `projetos/_estudio/galeria/prédios e cidade 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `CasaMini` | bets.tsx | Casinha com janela acesa e porta | `pos: V3`, `rotY?: number = 0`, `luz: number`, `fechada?: number = 0`, `escala?: number = 1` |
| `Piso` | concurso.tsx | Piso plano com o contorno que você passar (praça, caminho) | `pts: [number, number][]`, `y: number`, `cor: string` |
| `TorreVidro` | concurso.tsx | Torre de vidro de escritórios | `pos: V3`, `onda: number` |
| `Portico` | concurso.tsx | Pórtico com dois pilares e placa em cima | `pos: V3`, `texto: string`, `luz: number`, `rotY?: number = 0` |
| `Lojinha` | escala6x1c.tsx | Lojinha com vitrine, porta e toldo listrado | `pos: V3`, `rotY?: number = 0`, `escala: number`, `larg?: number = 1.6`, `toldo?: number = 0` |
| `Ruazinha` | fumaca.tsx | Ruazinha em miniatura com casas e porta | `pos: V3`, `escala: number`, `porta: number`, `luz?: number = 0`, `children?: React.ReactNode` |
| `PrediozinhoFumaca` | fumaca.tsx | Prediozinho com janelas que acendem | `pos: V3`, `alt: number`, `larg?: number = 0.5`, `luz: number`, `cor?: string` |
| `Posto` | gasolina.tsx | Posto de combustível completo: cobertura, colunas, bombas e placa | `pos: V3`, `rotY?: number = 0`, `preco?: string = '6`, `visora?: number = 1`, `escala?: number = 1` |
| `PortaNome` | hediondo.tsx | Porta com nome escrito que abre e acende por dentro | `nome: string`, `abre: number`, `luz: number`, `cor: string`, `trancada?: number = 0` |
| `Casinha` | hediondo.tsx | Casinha simples de bairro | `pos: V3`, `cor: string`, `escala?: number = 1` |
| `Poste` | imposto.tsx | Poste de luz de rua | `pos: V3`, `luz?: number = 0.4` |
| `Porta` | intimacao.tsx | Porta com batente e luz atrás | `pos: V3`, `rotY?: number = 0`, `abertura: number`, `luz?: number = 1` |
| `Igreja` | mansao.tsx | Igreja genérica sem nome | `pos: V3`, `rotY?: number = 0`, `escala: number`, `aceso: number` |
| `Escritorio` | mei.tsx | Prédio de escritórios de uma empresa | `pos: V3`, `rotY?: number = 0`, `escala: number`, `luz?: number = 0` |
| `Sobrado` | oitohoras.tsx | Prédio de tijolo antigo | `pos: V3`, `larg: number`, `alt: number`, `prof?: number = 2.4`, `sobe: number`, `luz?: number = 0`, `cor?: string` |
| `PosteLampada` | oitohoras.tsx | Poste com lâmpada antiga | `pos: V3`, `escala?: number = 1`, `acesa: number` |
| `PortaGiratoria` | oitohoras.tsx | Porta giratória num pedaço de parede | `pos: V3`, `giro: number`, `escala?: number = 1` |

Exemplos de uso:

```tsx
// Lojinha com vitrine, porta e toldo listrado
<Lojinha tema={tema} pos={[0, 0, 0]} escala={1} toldo={1} />
// Posto de combustível completo: cobertura, colunas, bombas e placa
<Posto tema={tema} pos={[0, 0, 0]} preco="6,10" visora={1} />
// Prédio de escritórios de uma empresa
<Escritorio tema={tema} pos={[0, 0, 0]} escala={1} luz={1} />
```

## 9. Trabalho e escritório

33 peças. Galeria: `projetos/_estudio/galeria/trabalho e escritório 1.jpg`, `projetos/_estudio/galeria/trabalho e escritório 2.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `CrachaAlgoritmo` | algoritmo.tsx | Crachá com "???" (identidade desconhecida) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `PastaBets` | bets.tsx | Pasta de processo com elástico | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `Carimbo3DBets` | bets.tsx | Carimbo de mão | `pos: V3`, `escala?: number = 1` |
| `CarteiraTrabalho` | bolsafamilia.tsx | Carteira de trabalho (livreto) que abre, com carimbo na página | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `abre: number`, `carimbo: number`, `treme?: number = 0` |
| `FabricaCarroVoador` | carrovoador.tsx | Fábrica moderna com painéis solares e letreiro | `pos: V3`, `sobe: number`, `paineis: number`, `janelas: number`, `letreiro: string`, `acesoLetreiro: number` |
| `MesaAcordo` | debate.tsx | Sala de reunião: mesa comprida com cadeiras | `pos: V3`, `k: number` |
| `Prancheta` | debate.tsx | Prancheta de pesquisa com carimbo "REGISTRADA" | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `carimbo: number`, `corCarimbo: string`, `linhas?: number = 1` |
| `CrachaEscala6x1` | escala6x1.tsx | Crachá pendurado no peito (filho do Boneco) | `pos: V3`, `k: number` |
| `Barraquinha` | escala6x1b.tsx | Barraquinha de pequeno negócio com toldo listrado | `pos: V3`, `rotY?: number = 0`, `escala: number`, `toldo?: number = 0` |
| `PostoVaga` | escala6x1b.tsx | Posto de trabalho vazio: mesinha e banquinho | `pos: V3`, `rotY?: number = 0`, `escala: number`, `ocupado?: number = 0` |
| `RelogioPonto` | escala6x1c.tsx | Relógio de ponto num poste, com visor e cartão | `pos: V3`, `rotY?: number = 0`, `escala: number`, `visor: number` |
| `Guindaste` | estadio.tsx | Guindaste de torre de obra | `pos: V3`, `rotY: number`, `k: number`, `cabo: number`, `braco?: number = 13`, `carga?: React.ReactNode` |
| `ApertoMao` | estadio.tsx | Aperto de mão (o negócio fechado) | `pos: V3`, `rotY?: number = 0`, `escala: number`, `balanca?: number = 0` |
| `Balcao` | imposto.tsx | Balcão de loja | `pos: V3`, `rotY?: number = 0`, `larg?: number = 2.6`, `escala: number` |
| `Mesa` | intimacao.tsx | Mesa de trabalho com gaveta na frente | `gaveta: number` |
| `SalaMini` | intimacao.tsx | Sala de escritório em miniatura (mesa, papel, carimbo) | `pos: V3`, `escala: number`, `vazia: number`, `papel: number`, `carimbo: number` |
| `Carimbo3DIntimacao` | intimacao.tsx | Carimbo de mão (outro modelo) | `pos: V3`, `escala?: number = 1` |
| `PastaIntimacao` | intimacao.tsx | Pasta de processo (outro modelo) | `pos: V3`, `escala?: number = 1` |
| `FolhaIntimacao` | intimacao.tsx | Folha de papel com marca opcional | `pos: V3`, `escala: number`, `marca?: boolean` |
| `Documento` | intimacao.tsx | Documento (folha com linhas) | `pos: V3`, `escala: number` |
| `Caneta` | juros.tsx | Caneta | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `FolhaJuros` | juros.tsx | Folha de papel voando | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `Gaveteiro` | mansao.tsx | Gaveteiro com gaveta que abre | `pos: V3`, `rotY?: number = 0`, `escala: number`, `abre: number`, `brilho: number` |
| `PilhaPapeis` | multas.tsx | Pilha de papéis | `pos: V3`, `n: number` |
| `RoloCompactador` | multas.tsx | Rolo compactador de obra | `pos: V3`, `rotY?: number = 0`, `escala: number`, `giro: number` |
| `FabricaOitoHoras` | oitohoras.tsx | Fábrica antiga com chaminé e relógio | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `janelas?: number = 0`, `relogio?: number = 0`, `cinza?: number = 0` |
| `Chamine` | oitohoras.tsx | Chaminé solta soltando fumaça | `pos: V3`, `alt: number`, `sobe: number` |
| `MaquinaVapor` | oitohoras.tsx | Máquina a vapor: caldeira, volante e pistão | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `giro: number`, `cinza?: number = 0` |
| `Tear` | oitohoras.tsx | Tear com fios, rolo e tecido saindo | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `giro: number`, `tecido: number` |
| `Engrenagem` | oitohoras.tsx | Engrenagem | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `r?: number = 0.5`, `giro: number`, `cor?: string`, `emissivo?: number = 0`, `escala?: number = 1` |
| `PlacaGreve` | oitohoras.tsx | Placa de greve "8 HORAS" num cabo | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1` |
| `EsteiraOitoHoras` | oitohoras.tsx | Esteira de linha de montagem | `pos: V3`, `comp: number`, `anda: number` |
| `Barril` | oitohoras.tsx | Barril de petróleo | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1` |

Exemplos de uso:

```tsx
// Relógio de ponto num poste, com visor e cartão
<RelogioPonto tema={tema} pos={[0, 0, 0]} escala={1} visor={1} />
// Carteira de trabalho (livreto) que abre, com carimbo na página
<CarteiraTrabalho tema={tema} pos={[0, 0, 0]} escala={1} abre={1} carimbo={1} />
// Fábrica antiga com chaminé e relógio
<FabricaOitoHoras tema={tema} pos={[0, 0, 0]} janelas={1} relogio={1} />
```

## 10. Justiça e governo

30 peças. Galeria: `projetos/_estudio/galeria/justiça e governo 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `PredioColunas` | bets.tsx | Prédio público com colunas na frente | `pos: V3`, `aceso: number`, `escala?: number = 1` |
| `PredioLargo` | bets.tsx | Prédio largo com duas cúpulas (sede de governo genérica) | `pos: V3`, `aceso: number`, `escala?: number = 1` |
| `DocumentoGrande` | bets.tsx | Documento grande com carimbo (lei, medida provisória) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `carimbo?: number = 0` |
| `Martelo` | candidato.tsx | Martelo da Justiça sobre o bloco | `pos: V3`, `escala: number`, `bate: number`, `rotY?: number = 0` |
| `RampaCandidato` | candidato.tsx | Rampa da posse (rampa larga que sobe) | `sobe: number`, `aceso?: number = 0` |
| `Cadeira` | candidato.tsx | Cadeira de encosto alto com braços (cadeira do poder) | `pos: V3`, `escala: number`, `aceso?: number = 0` |
| `FaixaPosse` | candidato.tsx | Faixa presidencial genérica sem brasão (vai como filho do Boneco) | `k: number`, `desce?: number = 1`, `pos?: V3 = [0, 0, 0]` |
| `FaixaDobrada` | candidato.tsx | Faixa presidencial dobrada, pousada | `pos: V3`, `k: number`, `brilho?: number = 0` |
| `Congresso` | candidato.tsx | Congresso genérico: base, cúpula, cuia e duas torres | `pos: V3`, `escala?: number = 1`, `aceso?: number = 0` |
| `LivroCDC` | cruzeiro.tsx | Livro do Código de Defesa do Consumidor | `pos: V3`, `rotY?: number = 0`, `k: number`, `brilho: number` |
| `Urninha` | debate.tsx | Urna pequena de sorteio | `pos: V3`, `escala: number` |
| `LivroRegras` | debate.tsx | Livro de regras com cadeado | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `abre: number` |
| `LivroLei` | escala6x1.tsx | Livro da lei que abre, com fitas marcadoras | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `abre: number`, `folha?: number = 0`, `capa?: number = 0`, `fitas?: [number, number][] = []` |
| `MesaSancao` | escala6x1.tsx | Mesa pequena da sanção com caneta | `pos: V3`, `escala?: number = 1`, `caneta: number` |
| `Balanca` | escala6x1b.tsx | Balança de dois pratos que inclina; aceita objetos em cada prato | `pos: V3`, `escala: number`, `inclina: number`, `esq?: React.ReactNode`, `dir?: React.ReactNode`, `brilhoEsq?: number = 0`, `brilhoDir?: number = 0` |
| `DiarioOficial` | escala6x1c.tsx | Diário Oficial (jornal dobrado, deitado) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `destaque?: number = 0` |
| `MesaCongresso` | escala6x1c.tsx | Mesa do Congresso com duas cadeiras de espaldar alto | `pos: V3`, `escala: number`, `brilho?: number = 0` |
| `Contrato` | estadio.tsx | Contrato: folha com linhas e espaço da assinatura vazio | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `abre?: number = 1` |
| `Urna` | gasolina.tsx | Urna eletrônica genérica (cubo com fenda) | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1` |
| `Arma` | hediondo.tsx | Revólver fosco de perfil, como um recorte | `pos?: V3 = [0, 0, 0]`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1` |
| `PacoteHediondo` | hediondo.tsx | Pacote embrulhado com fita e etiqueta (droga apreendida) | `pos?: V3 = [0, 0, 0]`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1` |
| `Estante` | hediondo.tsx | Estante de livros com lombadas que acendem | `acesas: number[]`, `cor: string` |
| `Diario` | intimacao.tsx | Tira comprida de diário oficial deitada no chão (o texto rola com `rola`) | `pos: V3`, `rotY?: number = 0`, `comp: number`, `rola: number`, `destaque: number` |
| `OrgaoPublico` | juros.tsx | Prédio de órgão público com letreiro (texto livre) | `pos: V3`, `escala: number`, `sobe: number`, `letreiro: number`, `porta?: number = 0`, `texto: string` |
| `BalancaJustica` | juros.tsx | Balança da Justiça com ponteiro | `pos: V3`, `escala: number`, `inclina: number`, `esq?: React.ReactNode`, `dir?: React.ReactNode`, `brilhoEsq?: number = 0`, `brilhoDir?: number = 0`, `ponteiro?: number = 0` |
| `Grades` | mansao.tsx | Grades de cela que descem | `pos: V3`, `larg: number`, `alt: number`, `desce: number` |
| `PrediozinhoMansao` | mansao.tsx | Prediozinho genérico dos Três Poderes (3 modelos) | `pos: V3`, `tipo: 0 \| 1 \| 2`, `k: number`, `cor: string` |
| `Plenario` | mei.tsx | Plenário com as cadeiras dos senadores em semicírculo | `pos: V3`, `escala: number`, `acesos: number` |
| `GavetasLei` | multas.tsx | Coluna de gavetas da lei (destinos do dinheiro) | `pos: V3`, `rotY?: number = 0`, `k: number`, `abre: number[]`, `luz: number[]` |
| `ListaContran` | multas.tsx | Lista de regras com itens que acendem | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `titulo: number`, `linhas: number`, `itens: number[]` |

Exemplos de uso:

```tsx
// Balança da Justiça com ponteiro
<BalancaJustica tema={tema} pos={[0, 0, 0]} escala={0.8} inclina={0.2} />
// Martelo da Justiça sobre o bloco
<Martelo tema={tema} pos={[0, 0, 0]} escala={1} bate={1} />
// Prédio de órgão público com letreiro (texto livre)
<OrgaoPublico tema={tema} pos={[0, 0, 0]} escala={1} sobe={1} letreiro={1} texto="ÓRGÃO" />
```

## 11. Transporte

33 peças. Galeria: `projetos/_estudio/galeria/transporte 1.jpg`, `projetos/_estudio/galeria/transporte 2.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Cancela` | candidato.tsx | Cancela listrada que baixa o braço | `pos: V3`, `escala: number`, `desce: number`, `lado?: 1 \| -1 = 1` |
| `Jatinho` | candidato.tsx | Jatinho particular pequeno | `pos: V3`, `rumo?: number = 0`, `pique?: number = 0`, `escala?: number = 1` |
| `Roadster` | carrovoador.tsx | Carro esportivo baixo e elétrico, com faróis em fita | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1`, `cor?: string`, `farol?: number = 0`, `anda?: number = 0`, `amortece?: number = 0`, `emblema?: string = 'ELÉTRICO'` |
| `RampaCarroVoador` | carrovoador.tsx | Rampa curva de salto | `pos: V3`, `sobe: number`, `aceso?: number = 0` |
| `CarroRua` | carrovoador.tsx | Sedã de rua com placa; vira elétrico com raio no capô | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `eletrico?: number = 0`, `anda?: number = 0`, `farol?: number = 0.3`, `fumaca?: number = 0`, `t?: number = 0` |
| `EVTOL` | carrovoador.tsx | Carro voador elétrico com asa alta e 8 rotores | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1`, `gira: number`, `luz?: number = 0`, `cor?: string`, `nome?: string = 'eVTOL'` |
| `Heliponto` | carrovoador.tsx | Heliponto redondo com H e luzes | `pos: V3`, `k: number`, `luz: number` |
| `EsteiraCruzeiro` | cruzeiro.tsx | Rastro de espuma na água atrás de um navio | `popa: V3`, `proa: V3`, `larg: number`, `k: number`, `t: number`, `comp?: number = 9` |
| `NavioCruzeiro` | cruzeiro.tsx | Navio de cruzeiro grande com andares e cabines | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `t: number`, `b?: Bordo = {}`, `interior?: boolean` |
| `NavioMini` | cruzeiro.tsx | Navio pequeno: casco, bloco e chaminé | `pos: V3`, `rumo: number`, `escala: number`, `t: number` |
| `Cais` | cruzeiro.tsx | Cais de porto | `t: number` |
| `Boia` | cruzeiro.tsx | Boia de sinalização no mar | `pos: V3`, `k: number`, `acende: number`, `t: number` |
| `Bilhete` | cruzeiro.tsx | Bilhete de passagem | `pos: V3`, `rotY?: number = 0`, `k: number` |
| `MalaCruzeiro` | cruzeiro.tsx | Mala de viagem que pode quebrar | `pos: V3`, `k: number`, `quebra: number` |
| `Onibus` | escala6x1c.tsx | Ônibus urbano | `pos: V3`, `rotY?: number = 0`, `escala: number`, `farol?: number = 0` |
| `Bomba` | gasolina.tsx | Bomba de combustível com visor de preço | `pos: V3`, `rotY?: number = 0`, `preco?: string = '5`, `visora?: number = 1`, `escala?: number = 1` |
| `Tanque` | gasolina.tsx | Tanque subterrâneo de combustível visto em raio-X | `pos: V3`, `rotY?: number = 0`, `label: string`, `nivelAtual: number`, `labelAparece?: number = 1`, `etiquetaFlip?: boolean`, `etiquetaK?: number = 0`, `escala?: number = 1` |
| `Van` | imposto.tsx | Van de entrega | `pos: V3`, `rotY?: number = 0`, `escala: number` |
| `MalaIntimacao` | intimacao.tsx | Mala de viagem com alça (outro modelo) | `pos: V3`, `rotY?: number = 0`, `escala: number` |
| `Carro` | juros.tsx | Carro sedã genérico | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `cor?: string`, `brilho?: number = 0`, `anda?: number = 0`, `farol?: number = 0`, `quica?: number = 0` |
| `Chave` | juros.tsx | Chave de carro | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `HeliCobertura` | mansao.tsx | Heliponto na cobertura de um prédio | `pos: V3`, `luz: number` |
| `RadarPoste` | multas.tsx | Radar de velocidade em poste | `pos: V3`, `rotY: number`, `k: number`, `lente: number`, `abre?: number = 0`, `escala?: number = 0.85` |
| `Buraco` | multas.tsx | Buraco no asfalto que pode ser tapado | `pos: V3`, `rotY?: number = 0`, `r?: number = 0.5`, `k: number`, `tapa?: number = 0`, `treme?: number = 0` |
| `PlacaRodovia` | multas.tsx | Placa de beira de estrada | `pos: V3`, `rotY: number`, `k: number` |
| `EscudoBR` | multas.tsx | Escudo de rodovia federal | `pos: V3`, `rotY: number`, `k: number` |
| `Cone` | multas.tsx | Cone de trânsito | `pos: V3`, `k: number` |
| `PapelMulta` | multas.tsx | Papel de multa com texto | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `texto?: string = 'MULTA'` |
| `PlacaPare` | multas.tsx | Placa de PARE octogonal | `pos: V3`, `rotY?: number = 0`, `escala: number`, `cor?: string` |
| `Navio` | oitohoras.tsx | Navio a vapor antigo com vela de três faixas | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `t: number` |
| `PlacaAno` | oitohoras.tsx | Placa de ano à beira da estrada | `pos: V3`, `ano: string`, `sobe: number`, `destaque?: number = 0`, `rotY?: number = 0` |
| `CarroAntigo` | oitohoras.tsx | Carro antigo dos anos 1910 | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `monta?: number = 1`, `anda?: number = 0`, `cor?: string` |
| `Estrada` | oitohoras.tsx | Estrada do tempo: faixa no chão com tracejado e trechos que acendem | `trechos: [number, number][]`, `z: number`, `larg?: number = 1.8`, `acesa?: [number, number, number][] = []` |

Exemplos de uso:

```tsx
// Ônibus urbano
<Onibus tema={tema} pos={[0, 0, 0]} escala={1} farol={1} />
// Carro sedã genérico
<Carro tema={tema} pos={[0, 0, 0]} />
// Placa de PARE octogonal
<PlacaPare tema={tema} pos={[0, 0, 0]} escala={1} />
```

## 12. Saúde

5 peças. Galeria: `projetos/_estudio/galeria/saúde 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Bengala` | candidato.tsx | Bengala (vai como filho do Boneco) | `k: number` |
| `MedidorAr` | fumaca.tsx | Medidor de qualidade do ar (arco verde até marsala, com ponteiro) | `pos: V3`, `rotY?: number = 0`, `escala: number`, `valor: number` |
| `Pulmao` | fumaca.tsx | Pulmão com dois lobos e traqueia | `pos: V3`, `escala: number`, `cinza: number`, `t: number` |
| `MascaraPFF2` | fumaca.tsx | Máscara PFF2 com elásticos | `pos: V3`, `escala: number` |
| `MacoCigarro` | imposto.tsx | Maço de cigarro genérico | `pos: V3`, `rotY?: number = 0`, `escala: number` |

Exemplos de uso:

```tsx
// Pulmão com dois lobos e traqueia
<Pulmao tema={tema} pos={[0, 0, 0]} escala={1} cinza={0.3} t={1.5} />
// Medidor de qualidade do ar (arco verde até marsala, com ponteiro)
<MedidorAr tema={tema} pos={[0, 0, 0]} escala={1} valor={0.7} />
```

## 13. Tecnologia e celulares

14 peças. Galeria: `projetos/_estudio/galeria/tecnologia e celulares 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `CartaoAlgoritmo` | algoritmo.tsx | Cartão de post ou vídeo de rede social com o ícone do assunto no meio | `assunto: Assunto`, `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1`, `larg?: number = 1.0`, `alt?: number = 0.82`, `apagado?: number = 0`, `destaque?: number = 0`, `brilho?: number = 0`, `anima?: number = 1`, `t?: number = 0` |
| `TorreFeed` | algoritmo.tsx | Tela de celular gigante em pé (o feed); os 10 posts são `CartaoAlgoritmo` nas posições `slotTorre(i)` | `k: number`, `brilho: number`, `sepia?: number = 0` |
| `CelularMao` | algoritmo.tsx | Celular para pôr na mão do boneco, com tela colorida e ícone do assunto | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `cor: string`, `brilho?: number = 1`, `assunto?: Assunto \| null = null`, `progresso?: number = -1`, `t?: number = 0`, `anima?: number = 1` |
| `Robo` | algoritmo.tsx | Robô genérico de binóculo | `pos: V3`, `rotY?: number = 0`, `escala: number`, `afunda?: number = 0` |
| `DezenasIA` | algoritmo.tsx | Dezenas de cartõezinhos de IA girando em volta de um centro | `centro: V3`, `t: number`, `k: (i: number) => number; n?: number` |
| `TagHora` | algoritmo.tsx | Etiqueta de horário presa a um post | `pos: V3`, `hora: string`, `escala: number` |
| `Bateria` | carrovoador.tsx | Bateria com nível de carga | `pos: V3`, `escala: number`, `nivel: number`, `yaw?: number = 0` |
| `Carregador` | carrovoador.tsx | Carregador de carro elétrico com cabo | `pos: V3`, `rotY?: number = 0`, `escala: number`, `luz: number`, `cabo?: number = 0` |
| `CelularEnquete` | debate.tsx | Celular gigante com enquete de story (A e B) | `pos: V3`, `rotY?: number = 0`, `sobe: number`, `luz: number`, `valores: [number, number]`, `barras: number`, `toque: number`, `cores: [string, string]` |
| `Notebook` | intimacao.tsx | Notebook com tela genérica | `pos: V3`, `rotY?: number = 0`, `escala: number`, `abre: number`, `tela: number` |
| `CelularGigante` | mansao.tsx | Celular gigante com mensagens borradas e faixa SIGILO | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `tela: number`, `baloes: number`, `tarja: number`, `vaza?: number = 0` |
| `NotebookPortal` | multas.tsx | Notebook com portal de transparência na tela | `pos: V3`, `rotY?: number = 0`, `escala: number`, `abre: number`, `tela: TelaPortal`, `luz: number` |
| `Cabo` | multas.tsx | Cabo de internet com bolinha de luz que corre | `a: V3`, `b: V3`, `k: number`, `u: number` |
| `Notificacao` | oitohoras.tsx | Notificação de celular (cartãozinho) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1` |

Exemplos de uso:

```tsx
// Notebook com tela genérica
<Notebook tema={tema} pos={[0, 0, 0]} escala={2} abre={1} tela={1} />
// Celular gigante com enquete de story (A e B)
<CelularEnquete tema={tema} pos={[0, 0, 0]} sobe={1} luz={1} valores={[0.6, 0.4]} barras={1} toque={0} cores={[festa(tema).azul, festa(tema).verde]} />
```

## 14. Educação

6 peças. Galeria: `projetos/_estudio/galeria/educação 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Caderno` | algoritmo.tsx | Caderno grande que abre e vai ganhando linhas escritas | `k: number`, `abre: number`, `linhas: number`, `final: number`, `brilho?: number = 0` |
| `EscolaTorre` | concurso.tsx | Escola particular com torre e relógio | `pos: V3`, `horas: number`, `porta: number`, `luz: number`, `placa: number` |
| `EscolaSimples` | concurso.tsx | Escola pública pequena | `pos: V3`, `luz: number` |
| `Diploma` | escala6x1.tsx | Diploma enrolado com fita | `pos: V3`, `rot?: V3 = [0, 0, Math.PI / 2]`, `k: number` |
| `FolhaVirando` | hediondo.tsx | Folha de livro virando da direita para a esquerda | `k: number`, `cor: string` |
| `Cartilha` | multas.tsx | Cartilha (livreto educativo) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |

Exemplos de uso:

```tsx
// Escola particular com torre e relógio
<EscolaTorre tema={tema} pos={[0, 0, 0]} horas={0.3} porta={1} luz={1} placa={1} />
// Diploma enrolado com fita
<Diploma tema={tema} pos={[0, 0, 0]} k={1} />
```

## 15. Esporte e jogos

16 peças. Galeria: `projetos/_estudio/galeria/esporte e jogos 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Dado` | algoritmo.tsx | Dado de jogo com bolinhas | `pos: V3`, `rot: V3`, `escala: number` |
| `MesaApostas` | algoritmo.tsx | Mesa de apostas com feltro, cartas e fichas | `k: number` |
| `PilhaFichas` | algoritmo.tsx | Pilha de fichas de aposta com cor livre | `pos: V3`, `n: number`, `cor: string`, `escala?: number = 1` |
| `TorreAposta` | bets.tsx | Torre de aposta: coluna com tela acesa no topo | `pos: V3`, `tela: number`, `afunda?: number = 0`, `escala?: number = 1`, `cinza?: boolean` |
| `HolofoteBolsaFamilia` | bolsafamilia.tsx | Holofote em poste com cone de luz suave apontado para um alvo | `pos: V3`, `alvo: V3`, `luz: number` |
| `ArcoLinha` | candidato.tsx | Arco de largada ou chegada: linha no chão, dois postes e faixa no alto | `z: number`, `sobe: number`, `aceso?: number = 0`, `xadrez?: boolean`, `semArco?: boolean` |
| `Bastao` | candidato.tsx | Bastão de revezamento | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `k: number`, `brilho?: number = 1` |
| `FotoChegada` | candidato.tsx | Moldura da foto de chegada, em pé | `pos: V3`, `k: number`, `aceso?: number = 0` |
| `Podio` | carrovoador.tsx | Pódio de três degraus | `pos: V3`, `sobe1: number`, `sobe2: number`, `aceso2: number`, `barras: number` |
| `Arquibancada` | debate.tsx | Arquibancada pequena de 3 degraus | `pos: V3`, `rotY: number`, `k: number` |
| `Campo` | estadio.tsx | Campo de futebol com gramado e linhas | `obra: number`, `meio?: number = 0` |
| `PlacasCampo` | estadio.tsx | Placas de publicidade em volta do campo | `luz: number`, `caixa: number`, `patrocinador?: string = 'BANCO'` |
| `Telao` | estadio.tsx | Telão de estádio com placar ou conta (pegou, pagou, deve) | `modo: 'conta' \| 'jogo'`, `pegou: number`, `pagou: number`, `deve: number`, `linhas: number`, `deveTexto?: string`, `brilho?: number = 0.5`, `sobe?: number = 0` |
| `Letreiro` | estadio.tsx | Letreiro de fachada "ARENA" com espaço para um nome | `dy: number`, `brilho: number`, `vazio: number` |
| `Flamula` | estadio.tsx | Bandeirinha de torcida sem escudo | `pos: V3`, `rotY: number`, `cor: string`, `k: number`, `t: number`, `fase: number` |
| `Fichas` | imposto.tsx | Fichas de aposta empilhadas e um dado | `pos: V3`, `escala: number` |

Exemplos de uso:

```tsx
// Pódio de três degraus
<Podio tema={tema} pos={[0, 0, 0]} sobe1={1} sobe2={1} aceso2={1} barras={1} />
// Dado de jogo com bolinhas
<Dado tema={tema} pos={[0, 0, 0]} rot={[0.4, 0.6, 0]} escala={1} />
```

## 16. Natureza e clima

21 peças. Galeria: `projetos/_estudio/galeria/natureza e clima 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Morro` | candidato.tsx | Morro baixo e arredondado | `pos: V3`, `raios: V3` |
| `Fumaca` | candidato.tsx | Fumaça feita de bolas paradas (você dá a lista) | `bolas: {p: V3; r: number; o: number}[]` |
| `NuvemCarroVoador` | carrovoador.tsx | Nuvem de vapor saindo de pontos numa direção (jato, poeira) | `origens: V3[]`, `dir: V3`, `t: number`, `k: number`, `alcance?: number = 1.2`, `tam?: number = 0.22` |
| `Poeira` | carrovoador.tsx | Anel de poeira que se espalha uma vez (pouso) | `pos: V3`, `k: number` |
| `ArvoreRedonda` | concurso.tsx | Árvore de copa redonda e escura | `pos: V3`, `r?: number = 1.1`, `cresce?: number = 1` |
| `Praia` | cruzeiro.tsx | Faixa de praia com areia e guarda-sóis | `t: number` |
| `Gaivota` | cruzeiro.tsx | Gaivota planando (um V) | `pos: V3`, `rumo: number`, `t: number`, `escala?: number = 1` |
| `Chamas` | fumaca.tsx | Chamas de fogo estáveis | `pos: V3`, `k: number`, `t: number`, `tam?: number = 0.22`, `n?: number = 5`, `semente?: number = 0` |
| `ColunaFumaca` | fumaca.tsx | Coluna de fumaça subindo | `pos: V3`, `k: number`, `t: number`, `alt?: number = 3`, `tam?: number = 0.35`, `escura?: number = 0`, `vento?: V3 = [0, 0, 0]` |
| `Nevoa` | fumaca.tsx | Névoa de bolas grandes paradas | `bolas: {p: V3; r: number; o: number}[]`, `t: number`, `escura?: number = 0` |
| `RioVoador` | fumaca.tsx | Rio voador: faixa de umidade que segue uma curva no céu | `curva: THREE.CatmullRomCurve3`, `k: number`, `t: number`, `cinza: number`, `n?: number = 150`, `larg?: number = 0.45` |
| `SetasVento` | fumaca.tsx | Setas de vento ao longo de uma curva | `curva: THREE.CatmullRomCurve3`, `k: number`, `t: number`, `anda: number`, `n?: number = 6`, `acima?: number = 1.1` |
| `NuvemChuva` | fumaca.tsx | Nuvem com chuva (gotas ou fumacinha) | `pos: V3`, `k: number`, `t: number`, `cor: string`, `chuva: number`, `corGota: string`, `tam?: number = 1`, `queda?: number = 2.2` |
| `GloboWireframe` | gasolina.tsx | Globo terrestre de linhas (mercado mundial) | `pos: V3`, `rotY?: number = 0`, `cor?: string = '#5F6977'`, `escala?: number = 1`, `t?: number = 0` |
| `NuvemHediondo` | hediondo.tsx | Nuvem cinza com chuva fina e lenta | `k: number`, `t: number` |
| `Arvore` | imposto.tsx | Árvore simples | `pos: V3`, `escala?: number = 1` |
| `Jabuti` | imposto.tsx | Jabuti com casco de placas | `pos: V3`, `rotY?: number = 0`, `escala: number`, `anda?: number = 0`, `cabeca?: number = 1` |
| `Mar` | oitohoras.tsx | Mar: placa com ondas lentas | `x0: number`, `x1: number`, `z0: number`, `z1: number`, `t: number` |
| `Sol` | oitohoras.tsx | Sol | `pos: V3`, `escala?: number = 1` |
| `Lua` | oitohoras.tsx | Lua | `pos: V3`, `escala?: number = 1` |
| `Flor` | oitohoras.tsx | Flor | `pos: V3`, `escala?: number = 1` |

Exemplos de uso:

```tsx
// Nuvem com chuva (gotas ou fumacinha)
<NuvemChuva tema={tema} pos={[0, 2, 0]} k={1} t={1.5} cor={tema.objetoClaro} chuva={1} corGota={festa(tema).azul} />
// Árvore de copa redonda e escura
<ArvoreRedonda tema={tema} pos={[0, 0, 0]} />
```

## 17. Comunicação e mídia

16 peças. Galeria: `projetos/_estudio/galeria/comunicação e mídia 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Folheto` | cruzeiro.tsx | Folheto de propaganda de viagem | `pos: V3`, `k: number` |
| `CameraTV` | debate.tsx | Câmera de TV em tripé | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1` |
| `Bancada` | debate.tsx | Bancada de debate com dois púlpitos e faixas | `cores: [string, string]`, `faixas: [string, string]`, `luz: [number, number]`, `textos: [[string, string], [string, string]]`, `vira: [number, number]`, `afunda?: [number, number] = [0, 0]` |
| `TelaoDebate` | debate.tsx | Telão do debate com texto, ponteiro e medidor | `texto: string`, `cor: string`, `vira: number`, `ponteiro: number`, `cores: [string, string]`, `luz: number`, `medidor: number` |
| `PlacaTorcida` | debate.tsx | Placa de torcida num cabo, com texto | `pos: V3`, `texto: string`, `cor: string`, `letra: string`, `k: number`, `inclina: number`, `rotY?: number = 0` |
| `CameraFoto` | debate.tsx | Câmera fotográfica com a foto saindo | `pos: V3`, `rotY?: number = 0`, `escala: number` |
| `Polaroid` | debate.tsx | Foto instantânea com gráfico de barras dentro | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `alturas: number[]`, `banda: number`, `cor: string` |
| `PlacaNome` | estadio.tsx | Placa com um nome escrito (texto fixo) | `pos: V3`, `rotY?: number = 0`, `texto: string`, `brilho: number`, `escala?: number = 1` |
| `Megafone` | estadio.tsx | Megafone (propaganda, aviso) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `Manchete` | estadio.tsx | Jornal com manchete escrita | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `titulo: string` |
| `Jornal` | gasolina.tsx | Jornal 3D com manchete que abre como folha | `pos: V3`, `rotY?: number = 0`, `titulo?: string = 'PETRÓLEO CAI'`, `abre?: number = 0`, `escala?: number = 1` |
| `Cartaz` | hediondo.tsx | Cartaz com texto e moldura | `larg: number`, `alt: number`, `linhas: {t: string; tam: number; cor: string;...`, `moldura: string`, `fundo: string`, `brilho?: number = 0` |
| `Carta` | intimacao.tsx | Carta: envelope com faixa e selo | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1`, `brilho?: number = 0`, `apagada?: boolean`, `carimbo?: number = 0` |
| `CaixaCorreio` | intimacao.tsx | Caixa de correio com bandeirinha | `pos: V3`, `rotY?: number = 0`, `escala: number`, `bandeira: number` |
| `PredioTV` | mansao.tsx | Prédio de emissora de TV com antena e letreiro | `pos: V3`, `rotY?: number = 0`, `escala: number`, `aceso: number`, `letreiro: string` |
| `EnvelopeMansao` | mansao.tsx | Envelope fechado (proposta, carta) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `brilho: number` |

Exemplos de uso:

```tsx
// Jornal 3D com manchete que abre como folha
<Jornal tema={tema} pos={[0, 0, 0]} titulo="PREÇO SOBE" abre={1} />
// Megafone (propaganda, aviso)
<Megafone tema={tema} pos={[0, 0, 0]} rot={[0, 1.1, 0]} escala={1} />
```

## 18. Casa e consumo

29 peças. Galeria: `projetos/_estudio/galeria/casa e consumo 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Geladeira` | bolsafamilia.tsx | Geladeira de porta aberta com prateleiras e comida | `pos: V3`, `rotY?: number = 0`, `escala: number`, `cheia: number` |
| `Lancheira` | bolsafamilia.tsx | Lancheira escolar | `pos: V3`, `escala: number` |
| `Taca` | candidato.tsx | Taça de brinde | `pos: V3`, `k: number` |
| `PoltronaTV` | debate.tsx | Poltrona de entrevista | `pos: V3`, `rotY?: number = 0`, `escala: number`, `cor: string` |
| `Prateleira` | escala6x1b.tsx | Prateleira com produtos e etiqueta de preço | `pos: V3`, `rotY?: number = 0`, `escala: number`, `preco: number` |
| `CadeiraPraia` | escala6x1c.tsx | Cadeira de praia que abre | `pos: V3`, `rotY?: number = 0`, `escala: number`, `abre: number` |
| `Confete` | estadio.tsx | Chuva de confete | `centro: V3`, `t: number`, `t0: number`, `dur: number`, `raio?: number = 2.2`, `n?: number = 70` |
| `Presente` | fgts.tsx | Caixa de presente com laço e etiqueta | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `tam?: number = 1`, `laco?: number = 0`, `cinza?: number = 0`, `preco?: number = 0`, `fantasma?: boolean` |
| `Balde` | fumaca.tsx | Balde com líquido | `pos: V3`, `escala: number`, `nivel: number` |
| `Fosforo` | fumaca.tsx | Fósforo gigante aceso | `pos: V3`, `escala: number`, `fogo: number`, `t: number`, `rotZ?: number = 0` |
| `CaixaRegistradora` | imposto.tsx | Caixa registradora de mercado | `pos: V3`, `rotY?: number = 0`, `escala: number`, `gaveta?: number = 0`, `tela?: number = 0` |
| `Carrinho` | imposto.tsx | Carrinho de supermercado | `pos: V3`, `rotY?: number = 0`, `escala: number` |
| `Cesta` | imposto.tsx | Cesta de compras | `pos: V3`, `rotY?: number = 0`, `escala: number` |
| `PacoteImposto` | imposto.tsx | Pacote de compra com etiqueta | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `etiqueta?: number = 0` |
| `Blusa` | imposto.tsx | Blusa (roupa) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `cor?: string` |
| `Garrafa` | imposto.tsx | Garrafa | `pos: V3`, `escala: number` |
| `Lata` | imposto.tsx | Lata de bebida | `pos: V3`, `escala: number` |
| `Luminaria` | intimacao.tsx | Luminária pendente: fio comprido, cúpula a 2,4 m de altura e uma luz spot de verdade | `peca?: boolean = true` |
| `Caneca` | intimacao.tsx | Caneca | `pos: V3`, `escala?: number = 1` |
| `Chaves` | intimacao.tsx | Molho de chaves | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1` |
| `RelogioMesa` | intimacao.tsx | Relógio de mesa com ponteiro | `pos: V3`, `escala: number`, `ang: number` |
| `RelogioPulso` | intimacao.tsx | Relógio de pulso | `pos: V3`, `escala: number`, `ang: number` |
| `GloboEspelhado` | mansao.tsx | Globo espelhado de festa | `pos: V3`, `gira: number`, `k: number` |
| `TorreTacas` | mansao.tsx | Torre de taças em pirâmide | `pos: V3`, `k: number` |
| `BalaoFesta` | mansao.tsx | Balão de festa | `pos: V3`, `cor: string`, `k: number` |
| `Ratoeira` | mei.tsx | Ratoeira de madeira com isca | `pos: V3`, `rotY?: number = 0`, `escala: number`, `fecha: number`, `brilho?: number = 0` |
| `Cama` | oitohoras.tsx | Cama | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1` |
| `Poltrona` | oitohoras.tsx | Poltrona | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1` |
| `Prato` | oitohoras.tsx | Prato de comida | `pos: V3`, `escala?: number = 1` |

Exemplos de uso:

```tsx
// Geladeira de porta aberta com prateleiras e comida
<Geladeira tema={tema} pos={[0, 0, 0]} escala={1} cheia={1} />
// Carrinho de supermercado
<Carrinho tema={tema} pos={[0, 0, 0]} escala={1} />
// Caixa de presente com laço e etiqueta
<Presente tema={tema} pos={[0, 0, 0]} escala={1} laco={1} preco={1} />
```

## 19. Gráficos e números

28 peças. Galeria: `projetos/_estudio/galeria/gráficos e números 1.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `PainelAposta` | algoritmo.tsx | Painel deitado com 4 linhas de ícone e barra que enche | `pos: V3`, `valores: number[]`, `ks: number[]`, `escala: number`, `vence?: number = 0` |
| `Mostrador` | algoritmo.tsx | Mostrador em arco com ponteiro, escrito "VOCÊ" | `pos: V3`, `rotY?: number = 0`, `valor: number`, `escala: number` |
| `Placar` | bolsafamilia.tsx | Placar de estádio antigo com dois lados, barras e lâmpadas | `pos: V3`, `desce: number`, `esq: number`, `dir: number`, `meio: number`, `barras: number`, `lampadas: number`, `pulsoEsq?: number = 0`, `brilhoMeio?: number = 0` |
| `ContadorVagas` | bolsafamilia.tsx | Painel em pé com barra que enche (contador de vagas) | `pos: V3`, `rotY?: number = 0`, `escala: number`, `enche: number`, `destaque: number` |
| `ReguaCruzeiro` | cruzeiro.tsx | Régua deitada medindo distância (da costa até a linha) | `x0: number`, `x1: number`, `z: number`, `k: number` |
| `GraficoMargem` | debate.tsx | Gráfico de barras com a faixa da margem de erro | `pos: V3`, `rotY?: number = 0`, `alturas: number[]`, `k: number`, `banda: number`, `cor: string`, `corFalsa?: string`, `falsa?: number = -1`, `escala?: number = 1` |
| `DiaBloco` | escala6x1.tsx | Bloco de um dia da semana (trabalho em grafite, folga no acento) | `pos: V3`, `aceso: number`, `descanso: number`, `escala?: number = 1` |
| `CuboHora` | escala6x1.tsx | Cubinho de uma hora de trabalho | `pos: V3`, `escala?: number = 1`, `claro?: number = 0` |
| `PlacarVotos` | escala6x1.tsx | Placar de votos com 5 gomos que acendem | `pos: V3`, `escala: number`, `acesos: number` |
| `LinhaChao` | escala6x1.tsx | Linha do tempo no chão com marcos | `x0: number`, `x1: number`, `z: number`, `k: number`, `acesa: number`, `marcos: Marco[]` |
| `BarraTurno` | escala6x1c.tsx | Barra do plantão 12x36 (12 h de trabalho, 36 h de descanso) | `pos: V3`, `rotY?: number = 0`, `escala?: number = 1`, `k: number`, `descanso: number` |
| `MesFolgas` | escala6x1c.tsx | Calendário do mês com as folgas acesas | `pos: V3`, `rotY?: number = 0`, `escala: number`, `acesas: number`, `troca: number` |
| `MarcoAno` | estadio.tsx | Marco de ano na linha do tempo: poste com placa | `pos: V3`, `ano: string`, `k: number`, `aceso: number` |
| `Meses` | fgts.tsx | Trilha de blocos no chão que acendem um a um (meses) | `x0: number`, `passo: number`, `z: number`, `n: number`, `k: number`, `acesos: number`, `ultimo: number` |
| `Colunas` | fumaca.tsx | Placar 3D com duas colunas de alturas diferentes | `pos: V3`, `rotY?: number = 0`, `a: number`, `b: number`, `altMax: number`, `corA: string`, `corB: string`, `brilhoB?: number = 0` |
| `CuboFatias` | gasolina.tsx | Cubo empilhado em fatias com nome (composição de um preço) | `pos: V3`, `rotY?: number = 0`, `fatias: FatiaInfo[]`, `altTotal?: number = 3.2`, `larg?: number = 1.6`, `aparece?: number = 1`, `apareceCada?: number[]`, `destaqueIdx?: number = -1`, `destaqueK?: number = 0` |
| `Medidor` | gasolina.tsx | Mostrador circular com agulha e cadeado opcional | `pos: V3`, `rotY?: number = 0`, `label: string`, `valor: number`, `bloqueado?: boolean`, `bloqueioK?: number = 0`, `acento?: boolean`, `escala?: number = 1` |
| `BarrasDuplas` | gasolina.tsx | Gráfico de duas barras: alta e queda | `pos: V3`, `rotY?: number = 0`, `altaK?: number = 1`, `quedaK?: number = 1`, `escala?: number = 1` |
| `PilhaAnos` | hediondo.tsx | Pilha de blocos (1 bloco = 1 ano) | `pos: V3`, `n: number`, `cor: string`, `passo?: number = 0.12`, `larg?: number = 0.9`, `brilho?: number = 0` |
| `EscadaIdade` | hediondo.tsx | Escada de três degraus das idades (18, 17, 16) | `cor: string` |
| `BarraPreco` | imposto.tsx | Barra do preço com a fatia do imposto que se separa | `pos: V3`, `rotY?: number = 0`, `alt: number`, `fatia?: number = 0.18`, `larg?: number = 0.9`, `abre: number`, `fora?: number = 0`, `lado?: number = 1`, `escala: number` |
| `ReguaImposto` | imposto.tsx | Régua vertical com tracinhos | `pos: V3`, `rotY?: number = 0`, `alt: number`, `k: number`, `destaque?: number = 0` |
| `BarraFixa` | imposto.tsx | Barra simples de gráfico | `pos: V3`, `alt: number`, `larg?: number = 0.5`, `cor: string`, `emissivo?: number = 0` |
| `LinhaTempo` | intimacao.tsx | Linha do tempo no chão com marcos e cabeça que anda | `x0: number`, `x1: number`, `z: number`, `k: number`, `vida: number`, `acesa?: number = 0`, `marcos: Marco[]`, `cabeca?: number` |
| `Parcelas` | juros.tsx | Grade de parcelas: blocos que acendem | `pos: V3`, `n: number`, `cols: number`, `passo?: number = 0.26`, `k: number`, `acesos: number`, `destaque?: number = 0` |
| `Regua3D` | juros.tsx | Régua em pé com marca da média e do contrato | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `alt: number`, `marca: number`, `aceso: number`, `contrato?: number = 0`, `kContrato?: number = 0`, `brilho?: number = 0` |
| `BarraPena` | mansao.tsx | Barra que encolhe (pena reduzida) | `pos: V3`, `rotY?: number = 0`, `nivel: number`, `k: number`, `cor: string` |
| `RelogioDia` | oitohoras.tsx | Relógio de 24 h dividido em gomos coloridos (8-8-8) | `pos: V3`, `raio?: number = 5`, `gomos: Gomo[]`, `ponteiro?: number`, `escala?: number = 1`, `giro?: number = 0` |

Exemplos de uso:

```tsx
// Gráfico de barras com a faixa da margem de erro
<GraficoMargem tema={tema} pos={[0, 0, 0]} alturas={[1.2, 0.9, 0.5]} k={1} banda={0.3} cor={tema.acento} />
// Grade de parcelas: blocos que acendem
<Parcelas tema={tema} pos={[0, 0, 0]} n={12} cols={4} k={1} acesos={7} />
// Cubo empilhado em fatias com nome (composição de um preço)
<CuboFatias tema={tema} pos={[0, 0, 0]} fatias={FATIAS_GASOLINA} aparece={1} />
```

## 20. Símbolos e ícones

57 peças. Galeria: `projetos/_estudio/galeria/símbolos e ícones 1.jpg`, `projetos/_estudio/galeria/símbolos e ícones 2.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `Icone` | algoritmo.tsx | Ícone 3D de um assunto do feed: bola no gol, barras, chip de IA, sol, cruz, livro de receita ou púlpito | `assunto: Assunto`, `pos?: V3 = [0, 0, 0]`, `rot?: V3 = [0, 0, 0]`, `escala?: number = 1`, `anima?: number = 1`, `cinza?: number = 0`, `t?: number = 0` |
| `XMarca` | algoritmo.tsx | X grande em 3D para riscar alguma coisa | `pos: V3`, `escala: number` |
| `Coracao` | algoritmo.tsx | Coração 3D (curtida) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `cor?: string`, `brilho?: number = 0.3` |
| `IconeMedida` | algoritmo.tsx | Ícone de reação: fim do vídeo, curtir, comentar ou mandar | `tipo: Medida`, `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `cor: string` |
| `Cronometro` | algoritmo.tsx | Cronômetro em anel que vai fechando em volta | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `k: number`, `escala: number` |
| `Feixe` | algoritmo.tsx | Feixe de luz em cone ligando dois pontos | `a: V3`, `b: V3`, `k: number`, `cor: string`, `raio?: number = 0.5` |
| `Selinho` | bets.tsx | Etiqueta pendurada (sem texto) | `pos: V3`, `escala: number` |
| `LinhaLimite` | bets.tsx | Retângulo no chão desenhado aos poucos (o limite) | `x0: number`, `x1: number`, `z0: number`, `z1: number`, `k: number`, `vida?: number = 1` |
| `CorrenteFantasma` | bolsafamilia.tsx | Corrente de elos quase transparentes em retângulo (uma regra invisível) | `centro: V3`, `larg: number`, `prof: number`, `y: number`, `k: number`, `vida: number` |
| `Cadeado` | candidato.tsx | Cadeado que fecha | `pos: V3`, `k: number`, `fecha: number` |
| `Parede` | candidato.tsx | Parede de vidro que barra a passagem | `pos: V3`, `larg: number`, `alt: number`, `k: number`, `rotY?: number = 0` |
| `Ficha` | candidato.tsx | Cartãozinho em pé (o texto vai na interface) | `pos: V3`, `k: number`, `destaque?: number = 0` |
| `Raio` | carrovoador.tsx | Raio 3D (energia elétrica) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number`, `cor?: string`, `brilho?: number = 0.5` |
| `Gota` | carrovoador.tsx | Gota (combustível, água) | `pos: V3`, `escala: number`, `cor?: string` |
| `Bandeira` | carrovoador.tsx | Bandeirinha com nome escrito (cores só do tema) | `pos: V3`, `escala: number`, `texto: string`, `t: number`, `destaque?: boolean` |
| `CalendarioAno` | carrovoador.tsx | Calendário com o ano escrito que troca a folha girando | `pos: V3`, `rotY?: number = 0`, `escala: number`, `ano: string`, `vira: number`, `destaque?: number = 0` |
| `Estrela` | concurso.tsx | Estrela 3D | `pos: V3`, `escala: number`, `giro?: number = 0`, `brilho?: number = 0.4` |
| `SetasTroca` | concurso.tsx | Duas setas circulares (troca) | `pos: V3`, `escala: number`, `giro: number` |
| `CartaoConcurso` | concurso.tsx | Cartão em pé com linhas de texto fixo | `pos: V3`, `rotY?: number = 0`, `k: number`, `larg: number`, `alt: number`, `linhas: {t: string; tam: number; cor?: string}[]`, `destaque?: number = 0` |
| `Pano` | cruzeiro.tsx | Pano de bandeira que balança (cores simples do país) | `pais: Pais`, `t: number`, `brilho?: number = 0` |
| `Mastro` | cruzeiro.tsx | Mastro com bandeira que sobe | `pos: V3`, `alt: number`, `pais: Pais`, `k: number`, `t: number`, `escala?: number = 1`, `brilho?: number = 0` |
| `BandeiraGira` | cruzeiro.tsx | Bandeirinha solta girando | `pos: V3`, `pais: Pais`, `k: number`, `t: number` |
| `TracejadoCruzeiro` | cruzeiro.tsx | Tracejado na água ligando boias | `x: number`, `z0: number`, `z1: number`, `k: number`, `acende: number` |
| `Relogio` | debate.tsx | Cronômetro de mesa com ponteiro e botão | `pos: V3`, `rotY?: number = 0`, `escala: number`, `giro: number`, `cor: string` |
| `FichaOrdem` | debate.tsx | Ficha numerada em disco de pé | `pos: V3`, `n: string`, `cor: string`, `escala: number` |
| `SetaArco` | debate.tsx | Seta em arco ligando dois pontos | `a: V3`, `b: V3`, `k: number`, `cor: string`, `alt?: number = 0.6` |
| `CartaoVeredito` | debate.tsx | Cartão de veredito em pé, com palavra grande e subtítulo | `pos: V3`, `rotY?: number = 0`, `escala: number`, `texto: string`, `sub: string`, `cor: string`, `letra: string`, `brilho?: number = 0` |
| `Contorno` | escala6x1.tsx | Contorno no chão em volta de alguns blocos | `x0: number`, `x1: number`, `z: number`, `prof: number`, `k: number`, `cor: string` |
| `TracejadoEscala6x1` | escala6x1.tsx | Linha tracejada no chão (separa quem fica de fora) | `a: V3`, `b: V3`, `k: number` |
| `Racha` | escala6x1b.tsx | Racha no chão que se abre | `a: V3`, `b: V3`, `k: number` |
| `CalendarioGrande` | estadio.tsx | Calendário grande de mesa com data ou ano | `pos: V3`, `rotY?: number = 0`, `texto: string`, `sub?: string`, `folha: number`, `escala?: number = 1`, `destaque?: number = 0` |
| `Vitrine` | estadio.tsx | Caixa de vidro em volta de alguma coisa (vitrine) | `k: number`, `larg: number`, `prof: number`, `alt: number`, `y?: number = 0` |
| `Corrente` | fgts.tsx | Corrente de elos ao longo de uma linha (garantia, prisão) | `a: V3`, `b: V3`, `k: number`, `vida?: number = 1`, `elo?: number = 0.16`, `cor?: string` |
| `Pino` | fumaca.tsx | Pino de mapa (cidade) | `pos: V3`, `k: number`, `cor: string`, `brilho?: number = 0` |
| `Foguete` | gasolina.tsx | Foguete subindo (alta rápida) | `pos: V3`, `subida?: number = 0`, `cor?: string = '#C9D0D9'`, `escala?: number = 1` |
| `PenaQueda` | gasolina.tsx | Pena caindo devagar (queda lenta) | `pos: V3`, `descida?: number = 0`, `cor?: string = '#C9D0D9'`, `t?: number = 0` |
| `IconeBookmark` | gasolina.tsx | Ícone de salvar (marcador) | `pos: V3`, `cor: string`, `escala?: number = 1` |
| `IconeSeta` | gasolina.tsx | Ícone de compartilhar (seta) | `pos: V3`, `cor: string`, `escala?: number = 1`, `t?: number = 0` |
| `IconeBalao` | gasolina.tsx | Ícone de comentário (balão) | `pos: V3`, `cor: string`, `escala?: number = 1` |
| `CalendarioGasolina` | gasolina.tsx | Calendário com folhas que viram e trava opcional | `pos: V3`, `rotY?: number = 0`, `mes?: string = 'JAN'`, `ano?: string = '2023'`, `folhasViradas?: number = 0`, `totalFolhas?: number = 3`, `trava?: boolean = false`, `travaK?: number = 0`, `escala?: number = 1` |
| `PopUp` | hediondo.tsx | Dobradiça de pop-up: levanta da folha o que estiver dentro | `pos: V3`, `k: number`, `rotY?: number = 0`, `children: React.ReactNode` |
| `Aba` | hediondo.tsx | Base de papelão de um pop-up | `larg: number`, `cor?: string` |
| `SetaLaco` | imposto.tsx | Seta em laço (volta para o mesmo lugar) | `pos: V3`, `rotY?: number = 0`, `raio?: number = 0.55`, `k: number` |
| `Lupa` | imposto.tsx | Lupa (busca, olhar de perto) | `pos: V3`, `rot?: V3 = [0, 0, 0]`, `escala: number` |
| `Exclama` | imposto.tsx | Ponto de exclamação 3D | `pos: V3`, `escala: number` |
| `Ampulheta` | intimacao.tsx | Ampulheta com areia caindo (prazo) | `pos: V3`, `escala?: number = 1`, `areia: number`, `virar?: number = 0`, `fio?: boolean` |
| `CalendarioIntimacao` | intimacao.tsx | Calendário de mesa com folhas | `pos: V3`, `escala: number`, `folhas?: number = 0` |
| `CartaoPe` | intimacao.tsx | Cartão em pé com texto que tomba | `pos: V3`, `texto: string`, `escala: number`, `tomba: number` |
| `Pedestal` | juros.tsx | Pedestal de vitrine com friso que acende | `pos: V3`, `sobe: number`, `luz?: number = 0` |
| `Teto` | juros.tsx | Teto translúcido que desce e pode quebrar (o limite) | `centro: V3`, `larg: number`, `prof: number`, `y: number`, `vida: number`, `quebra?: number = 0`, `pulso?: number = 0` |
| `Escudo` | juros.tsx | Escudo (proteção) | `pos: V3`, `rotY?: number = 0`, `escala: number`, `acende?: number = 0` |
| `Seta` | juros.tsx | Seta grossa (pressão, direção) | `pos: V3`, `rotY?: number = 0`, `escala: number`, `cor?: string` |
| `Redoma` | juros.tsx | Redoma de vidro que desce e protege | `pos: V3`, `escala: number`, `desce: number`, `brilho?: number = 0` |
| `HolofoteJuros` | juros.tsx | Cone de luz suave vindo de cima | `pos: V3`, `k: number`, `alt?: number = 4.5`, `raio?: number = 0.9` |
| `Fio` | mansao.tsx | Fio colorido em arco entre dois pontos | `a: V3`, `b: V3`, `k: number`, `cor: string`, `altura?: number = 2`, `n?: number = 26` |
| `TetoVidro` | mei.tsx | Teto de vidro (limite) que congela, racha ou vira novo | `centro: V3`, `larg: number`, `prof: number`, `y: number`, `vida: number`, `gelo?: number = 0`, `racha?: number = 0`, `novo?: number = 0`, `t?: number = 0` |
| `ArcoPontos` | multas.tsx | Tracejado em arco de bolinhas entre dois pontos | `a: V3`, `b: V3`, `k: number`, `cor: string`, `alt?: number = 2`, `n?: number = 22` |

Exemplos de uso:

```tsx
// Ampulheta com areia caindo (prazo)
<Ampulheta tema={tema} pos={[0, 0, 0]} escala={2} areia={0.6} fio />
// Cadeado que fecha
<Cadeado tema={tema} pos={[0, 0, 0]} k={1} fecha={1} />
// Seta grossa (pressão, direção)
<Seta tema={tema} pos={[0, 0, 0]} escala={1} cor={tema.acento} />
```

## 21. Cenários (mundos inteiros)

16 peças. Galeria: `projetos/_estudio/galeria/cenários mundos inteiros 1.jpg`, `projetos/_estudio/galeria/cenários mundos inteiros 2.jpg`.

| Peça | Arquivo | Como é | Props principais |
|---|---|---|---|
| `CampoCelulares` | algoritmo.tsx | Planície com centenas de celulares deitados no chão, cada tela de uma cor | `luz: (c: Cel) => number; ergue: number; tr...` |
| `Pista` | candidato.tsx | Pista de corrida com 5 raias (corrida eleitoral) | `raias?: number[] = []`, `trecho?: {z0: number; z1: number; k: number}`, `todas?: number = 0` |
| `MapaBrasil` | carrovoador.tsx | Mapa do Brasil em relevo (contorno simplificado) | `pos: V3`, `tam: number`, `k: number`, `acende: number`, `cor?: string` |
| `CidadeNoite` | concurso.tsx | Cidade inteira à noite em tons de cinza | `luz: number` |
| `MarZonas` | cruzeiro.tsx | Mar visto como mapa: praia, faixas coloridas das zonas e espuma | `t: number`, `territorial: number`, `alto: number` |
| `EstudioTV` | debate.tsx | Estúdio de TV redondo com parede curva e anel de luz no piso | `luz: number`, `t: number` |
| `Estadio` | estadio.tsx | Estádio de futebol inteiro (24 gomos que sobem), com refletores | `obra: number`, `corte: number`, `luz: number` |
| `BairroEstadio` | estadio.tsx | Bairro de casinhas em volta do estádio | `luz: number` |
| `Tabuleiro` | fumaca.tsx | Mapa do Brasil deitado como tabuleiro, com focos de queimada | `queimadas: Queimada[]`, `seca?: number = 0` |
| `LivroPopUp` | hediondo.tsx | Livro da lei gigante aberto, estilo pop-up | `corPag: string`, `fechaDir?: number = 0`, `children?: React.ReactNode`, `dir?: React.ReactNode` |
| `Praca` | imposto.tsx | Praça redonda com avenida em anel e avenidas saindo | `avenidas: {ang: number; ate: number}[]`, `centro?: number = 0` |
| `BairroImposto` | imposto.tsx | Bairro em volta da praça, com casas entre as avenidas | `livres: {p: V3; r: number}[]`, `angulos: number[]` |
| `PalcoGiratorio` | mansao.tsx | Palco giratório redondo com aro de luz | `raio: number`, `aro: number` |
| `CasaCorte` | mansao.tsx | Mansão cortada (casa de bonecas) com 4 andares abertos | `luz: {cela: number; banco: number; escrito...`, `sobe?: number = 1` |
| `BairroLojinhas` | mei.tsx | Bairro de lojinhas (instanciado, leve) | `lojas: LojaMini[]` |
| `AnelViario` | multas.tsx | Anel viário inteiro em três trechos (cidade, estado, União) | `luz: [number, number, number]`, `corte: number` |

Exemplos de uso:

```tsx
// Estádio de futebol inteiro (24 gomos que sobem), com refletores
<group rotation={[0.4, 0, 0]}><Estadio tema={tema} obra={1} corte={0} luz={1} /></group>
// Cidade inteira à noite em tons de cinza
<group rotation={[0.3, 0, 0]}><CidadeNoite tema={tema} luz={1} /></group>
```

## 22. Ajudantes, medidas e tipos (não são peças)

Constantes de medida, posições de cena, funções e tipos que os arquivos exportam. Servem para encaixar uma peça na outra (ex.: `MESA_Y_INTIMACAO` é a altura do tampo da `Mesa`).

| Nome no index | Arquivo | O que é |
|---|---|---|
| `Assunto` | algoritmo.tsx | tipo TypeScript · Assuntos: uma cor e um ícone fixos do começo ao fim |
| `ASSUNTOS` | algoritmo.tsx | constante `: Assunto[] = ['politica', 'futebol', 'invest', 'ia', 'sol', 'fe', 're...` |
| `NOME_ASSUNTO` | algoritmo.tsx | constante `: Record<Assunto, string> = {politica: 'POLÍTICA', futebol: 'FUTEBOL',...` |
| `corAssunto` | algoritmo.tsx | função `= (tema: Tema, a: Assunto) => {` |
| `TORRE` | algoritmo.tsx | constante `: V3 = [3.0, 0, -1.3];` · Torre do feed: a tela do celular aumentada e de pé, com 10 posts (2 colunas × 5) |
| `TORRE_BASE` | algoritmo.tsx | constante `= 0.35;` |
| `TORRE_ALT` | algoritmo.tsx | constante `= 5.3;` |
| `CARD_L` | algoritmo.tsx | constante `= 1.0;` |
| `CARD_A` | algoritmo.tsx | constante `= 0.82;` |
| `slotTorre` | algoritmo.tsx | função `= (i: number): V3 => [TORRE[0] + ((i % 2) - 0.5) * 1.06, TORRE_BASE + ...` |
| `Cel` | algoritmo.tsx | tipo TypeScript · Planície de celulares (instancedMesh: corpo e tela) |
| `CELULARES` | algoritmo.tsx | função `: Cel[] = (() => {` |
| `ADIV` | algoritmo.tsx | constante `: V3 = [-3.0, 0, -1.3];` · O Adivinhador: pedestal, bola de cristal com posts girando, anel e o olho |
| `ADIV_BOLA` | algoritmo.tsx | constante `: V3 = [ADIV[0], 2.15, ADIV[2]];` |
| `CADERNO` | algoritmo.tsx | constante `: V3 = [-1.75, 0, 0.9];` · O caderno que anota tudo |
| `CADERNO_ROT` | algoritmo.tsx | constante `= 0.42;` |
| `agentesBolha` | algoritmo.tsx | função `= (n: number, raio: number, semente: number): Agente[] => {` · Bolha de um assunto: esfera de vidro com um grupo de pessoas da mesma cor |
| `MESA` | algoritmo.tsx | constante `: V3 = [0, 0, 2.55];` · Mesa de apostas (feltro escuro) |
| `MESA_Y_ALGORITMO` | algoritmo.tsx | constante `= 0.82;` |
| `Medida` | algoritmo.tsx | tipo TypeScript |
| `MEDIDAS` | algoritmo.tsx | constante `: Medida[] = ['fim', 'curtir', 'comentar', 'mandar'];` |
| `LARG_PLACAR` | bolsafamilia.tsx | constante `= 6.4;` |
| `ALT_PLACAR` | bolsafamilia.tsx | constante `= 3.0;` |
| `naTela` | bolsafamilia.tsx | constante `= (cam: Cam, px: number, py: number, d: number): {p: V3; yaw: number} ...` |
| `RAIAS` | candidato.tsx | constante `= [-2.8, -1.4, 0, 1.4, 2.8];` |
| `PISTA` | candidato.tsx | constante `= {x: 3.8, z0: 9, z1: -16};` |
| `RAMPA` | candidato.tsx | constante `= {zPe: -16, comp: 4, alt: 1.6, larg: 5.6, fundo: 3.6};` · Rampa da posse Sobe de z = zPe (y 0) até z = zPe - comp (y alt), plataforma no topo com colunas lisas ao fundo. |
| `yRampa` | candidato.tsx | função `= (z: number) => (z >= RAMPA.zPe ? 0 : z <= RAMPA.zPe - RAMPA.comp ? R...` |
| `COMP_RAMPA` | carrovoador.tsx | constante `= 3.2;` |
| `ALT_RAMPA` | carrovoador.tsx | constante `= 1.5;` |
| `pontoRampa` | carrovoador.tsx | função `= (u: number): {x: number; y: number; ang: number} => {` |
| `ALT_D1` | carrovoador.tsx | constante `= 1.0;` |
| `ALT_D2` | carrovoador.tsx | constante `= 0.65;` |
| `LARG_FAB` | carrovoador.tsx | constante `= 6.0;` |
| `cinzas` | concurso.tsx | função `= (tema: Tema) => ({` · Cinzas do mundo (todos tirados do tema) |
| `PRACA` | concurso.tsx | constante `: [number, number][] = [` · Praça em leque: da porta da escola particular (z 6) até longe (z 26) |
| `CAMINHO_PUB` | concurso.tsx | constante `: [number, number][] = [` · Caminho até a escola pública |
| `GARFO` | concurso.tsx | constante `: V3 = [0, 0, -11];` · Caminho em Y atrás da escola: haste dos fundos (z 1) até a bifurcação (z -11), braços até os portões (z -22) |
| `PORTAO_PRIV` | concurso.tsx | constante `: V3 = [-8, 0, -22];` |
| `PORTAO_PUB` | concurso.tsx | constante `: V3 = [8, 0, -22];` |
| `CAMINHO_Y` | concurso.tsx | constante `: [number, number][] = [` |
| `ESCOLA` | concurso.tsx | constante `= {x: -2.5, z: 4, larg: 9, alt: 3.6, prof: 4};` |
| `ESCOLA_PUB` | concurso.tsx | constante `= {x: 6.8, z: 4.2};` · Escola pública: um andar, porta pequena, placa num poste |
| `CIDADE_FUNDO` | concurso.tsx | função `: PredioFundo[] = (() => {` |
| `Agente` | concurso.tsx | tipo TypeScript |
| `AGUA_Y` | cruzeiro.tsx | constante `= 0.04;` |
| `LINHA_X` | cruzeiro.tsx | constante `= 14;` |
| `BEIRA_X` | cruzeiro.tsx | constante `= -8;` |
| `Pais` | cruzeiro.tsx | tipo TypeScript · Bandeiras (cores simples do país + nome escrito na interface; sem brasão) |
| `NAVIO` | cruzeiro.tsx | constante `= {comp: 9.2, larg: 2, popa: -4.6, proa: 4.6, D1: 1.16, D2: 1.86, D3: ...` |
| `Bordo` | cruzeiro.tsx | tipo TypeScript |
| `PORTAS_X` | cruzeiro.tsx | constante `= [-2.7, -2.0, -1.3, -0.6, 0.1, 0.8];` · Corredor das cabines no D2: portas no fundo (−z); a 204 abre e fecha |
| `PORTA_204` | cruzeiro.tsx | constante `= 0.1;` |
| `CAIS` | cruzeiro.tsx | constante `= {x0: -8.5, x1: -3.6, z0: 1.25, z1: 3.3, y: 0.5};` · Cais com guindastes |
| `PISO` | debate.tsx | constante `= 0.14; // topo do palco (o chão do Palco fica em 0; o palco sobe 0,04...` · Estúdio: palco redondo, parede curva atrás, anel de luz no piso, câmeras de TV |
| `R_ESTUDIO` | debate.tsx | constante `= 4.6;` |
| `LUGAR_X` | debate.tsx | constante `= 1.15;` |
| `BANCADA_Z` | debate.tsx | constante `= -0.2;` |
| `TELAO_DEBATE` | debate.tsx | constante `: V3 = [0, 3.95, -4.15];` · Telão: texto em cima e um ponteiro de balança (lado A ← meio → lado B) |
| `DEGRAU` | debate.tsx | constante `= {larg: 3.4, prof: 0.62, alt: 0.32};` · Arquibancadinha com 3 degraus (a torcida vai em cima, pela Torcida de estadio.tsx) |
| `CEL` | debate.tsx | constante `= {w: 1.7, h: 3.3};` · Celular gigante com enquete de story (genérica: "A" e "B") |
| `MarcoEscala6x1` | escala6x1.tsx | tipo TypeScript |
| `ALT_BALANCA` | escala6x1b.tsx | constante `= 2.6;` |
| `BRACO` | escala6x1b.tsx | constante `= 2.2;` |
| `OVAL` | estadio.tsx | constante `= 0.72; // achatamento em z (oval de 27,4 × 19,7)` · Medidas do estádio (em volta da origem; o eixo comprido é x) |
| `R_IN` | estadio.tsx | constante `= 9.2; // começo da arquibancada` |
| `R_TOP` | estadio.tsx | constante `= 13.2; // fim do último degrau` |
| `R_WALL` | estadio.tsx | constante `= 13.7; // fachada` |
| `Y0` | estadio.tsx | constante `= 0.3;` |
| `DEGRAUS` | estadio.tsx | constante `= 12;` |
| `Y_TOP` | estadio.tsx | constante `= 5.4;` |
| `Y_WALL` | estadio.tsx | constante `= 6.2;` |
| `GOMOS` | estadio.tsx | constante `= 24;` |
| `CAMPO` | estadio.tsx | constante `= {x: 6.6, z: 4.3}; // meio comprimento e meia largura do campo` |
| `Y_GRAMA` | estadio.tsx | constante `= 0.06;` |
| `Z_FACHADA` | estadio.tsx | constante `= R_WALL * OVAL;` · Fachada da frente (z+) e o telão no alto da arquibancada do fundo |
| `TELAO_ESTADIO` | estadio.tsx | constante `: V3 = [0, 8.7, -9.0];` |
| `LETREIRO` | estadio.tsx | constante `: V3 = [0, 4.6, Z_FACHADA + 0.25];` |
| `naArquibancada` | estadio.tsx | função `= (j: number, phi: number, frente = 0.14): V3 => {` · Ponto do degrau j (0 = mais baixo), no ângulo phi (0 = frente, +z), já no oval do mundo |
| `coresEstadio` | estadio.tsx | função `= (tema: Tema) => ({` |
| `REFLETORES` | estadio.tsx | constante `: V3[] = [` |
| `LUGAR_NOME` | estadio.tsx | constante `: V3 = [LETREIRO[0] + 2.1, LETREIRO[1], LETREIRO[2] + 0.02];` · A placa do nome (solta: voa até o banco, volta, troca de texto) |
| `Trajeto` | estadio.tsx | tipo TypeScript · Trilho do dinheiro: canaleta no chão com moedas correndo |
| `trajeto` | estadio.tsx | função `= (pts: [number, number][]): Trajeto => {` |
| `noTrajeto` | estadio.tsx | função `= (tr: Trajeto, d: number): [number, number, number] => {` |
| `BICA` | estadio.tsx | constante `: V3 = [0, 3.1, 0.95]; // ponta da bica, relativa à torneira` · Torneira dos juros (cano, registro, bica) |
| `Torcedor` | estadio.tsx | tipo TypeScript · Torcida: bonecos simples em instancedMesh, com cor por pessoa e braços que sobem |
| `CASAS` | estadio.tsx | função `: {x: number; z: number; rot: number; e: number}[] = (() => {` · Bairro atrás do estádio (casinhas em instancedMesh) |
| `geo` | fumaca.tsx | função `= (lon: number, lat: number, y = 0): V3 => [(lon + 54) * ESC, y, -(lat...` |
| `MAPA_Y` | fumaca.tsx | constante `= 0.36;` · Topo do mapa (o "tabuleiro"): tudo que fica em cima do Brasil apoia aqui. |
| `Queimada` | fumaca.tsx | tipo TypeScript |
| `RUA_PORTA` | fumaca.tsx | constante `: V3 = [-0.6 + 0.4, 0.34, -1.6 + 1.6]; // na frente da porta (coordena...` |
| `BOCA_PULMAO` | fumaca.tsx | constante `: V3 = [0, 2.45, 0];` · Topo da traqueia (onde a máscara encaixa), em coordenadas do pulmão |
| `FatiaInfo` | gasolina.tsx | tipo TypeScript |
| `FATIAS_GASOLINA` | gasolina.tsx | constante `: FatiaInfo[] = [` |
| `FATIAS_ELEICAO` | gasolina.tsx | constante `: FatiaInfo[] = [` · Fatias para cena da eleição (inclui impostos federais zeráveis: índice 5) |
| `LIVRO` | hediondo.tsx | constante `= {meia: 9.2, prof: 12.4, capa: 0.12, bloco: 0.42};` |
| `YP` | hediondo.tsx | constante `= 0.06 + LIVRO.capa + LIVRO.bloco;` · Altura da superfície das folhas. O livro todo fica acima do chão do Palco (regra do chão piscando). |
| `papel` | hediondo.tsx | função `= (tema: Tema) => mistura(tema.branco, tema.areia, 0.38);` · Papel envelhecido, em tom médio: papel claro no tema escuro estoura com o bloom |
| `CRIMES` | hediondo.tsx | constante `= ['LATROCÍNIO', 'ESTUPRO', 'SEQUESTRO', 'HOMICÍDIO QUALIF.', 'TRÁFICO...` · Estante dos crimes hediondos: 5 gavetas que acendem |
| `ALT_ESTANTE` | hediondo.tsx | constante `= 4.6;` |
| `coresPaginas` | hediondo.tsx | função `= (tema: Tema) => {` · Cores das 7 páginas (plano.md, seção 2) |
| `R_PRACA` | imposto.tsx | constante `= 6.6;` · Cidade: praça, avenida em anel e avenidas que saem dela |
| `R_ANEL` | imposto.tsx | constante `= 13.4; // meio da avenida em anel` |
| `LARG_ANEL` | imposto.tsx | constante `= 2.0;` |
| `MESA_Y_INTIMACAO` | intimacao.tsx | constante `= 0.78;` |
| `MarcoIntimacao` | intimacao.tsx | tipo TypeScript |
| `ALT_PED` | juros.tsx | constante `= 0.5;` · Pedestal de vitrine `sobe` 0..1: nasce do chão. `luz` 0..1: o friso acende. |
| `PASSO_MOEDA` | juros.tsx | constante `= 0.07;` |
| `ALT_BJ` | juros.tsx | constante `= 2.7;` |
| `BRACO_BJ` | juros.tsx | constante `= 2.0;` |
| `festa` | mansao.tsx | função `= (tema: Tema): Festa => tema.festa ?? ESCURO.festa!;` |
| `CASA` | mansao.tsx | constante `= {meia: 7, fundo: -5, laje: 0.25};` · Medidas da casa |
| `ANDAR` | mansao.tsx | constante `= {cela: 0, banco: 3.6, escritorio: 7.2, festa: 10.8, teto: 15.2};` · Base de cada andar (y do piso) e altura livre |
| `ALT_ANDAR` | mansao.tsx | constante `= {cela: 3.6, banco: 3.6, escritorio: 3.6, festa: 4.4};` |
| `LojaMini` | mei.tsx | tipo TypeScript · Bairro de lojinhas (os 3,6 milhões): instanciado, poucas chamadas de desenho |
| `ANEL` | multas.tsx | constante `= {` |
| `FAIXA_DENTRO` | multas.tsx | constante `= 8.65;` |
| `FAIXA_FORA` | multas.tsx | constante `= 10.2;` |
| `ponto` | multas.tsx | função `= (th: number, r: number, y: number): V3 => [r * Math.sin(th), y, r * ...` |
| `TRECHOS` | multas.tsx | constante `= [0, (-2 * Math.PI) / 3, (2 * Math.PI) / 3];` · Os três donos: CIDADE na frente, ESTADO à esquerda, UNIÃO à direita |
| `GAVETAS` | multas.tsx | constante `= ['SINALIZAÇÃO', 'FISCALIZAÇÃO', 'EDUCAÇÃO', 'OBRAS NA PISTA'];` · Central do destino: móvel de 4 gavetas em cima de uma coluna |
| `ALT_COLUNA` | multas.tsx | constante `= 3.0;` |
| `ITENS_CONTRAN` | multas.tsx | constante `= ['PAVIMENTAÇÃO', 'RECAPEAMENTO', 'TAPA-BURACO'];` · Lista do Contran (documento com 3 itens que acendem) |
| `TelaPortal` | multas.tsx | tipo TypeScript · Notebook grande do Portal da Transparência (tela troca por estado, sem redesenhar a cada quadro) |
| `Gomo` | oitohoras.tsx | tipo TypeScript |
| `dirHora` | oitohoras.tsx | função `= (h: number): [number, number] => {` |
| `FAB` | oitohoras.tsx | constante `= {larg: 8, prof: 4, alt: 3.4, chamine: [2.9, 7.6, -1.1] as V3, apito:...` |
| `ALT_ESTEIRA` | oitohoras.tsx | constante `= 0.8;` · Esteira da linha de montagem (comprimento em x) |

