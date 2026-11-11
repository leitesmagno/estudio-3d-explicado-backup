---
name: cenas-3d
description: Etapa 5 do Estúdio 3D Explicado. Programa as cenas 3D do vídeo em Remotion e three.js a partir do plano.md aprovado, usando a base (src/base) e a biblioteca de peças (src/pecas), com cada evento disparado na hora exata da palavra por quando(). Registra as composições do vídeo (normal, Guia, Limpo e Capa). Use depois da aprovação do plano.
---

# Cenas 3D

Só comece com o `plano.md` **aprovado** (confira no `andamento.md`).

## Leitura obrigatória antes da primeira linha de código

1. `BASE-API.md` inteiro: como montar a composição, a câmera, o enquadramento automático, o `quando()`, a legenda, a pílula, os chips, os sons, a área segura e o registro das composições. **Os nomes de funções e peças deste arquivo são exemplos; os nomes reais são os do BASE-API.md.**
2. `src/pecas/CATALOGO.md`: procure cada objeto do plano no catálogo antes de criar um novo.
3. As imagens da galeria em `projetos/_estudio/galeria/`: veja as peças antes de escolher.
4. `projetos/_aprendizados.md`: principalmente Nunca fazer, Câmera e Visual por tema.
5. O `plano.md` do projeto.
6. O molde `src/videos/escala6x1/Escala6x1.tsx` (vídeo real completo) e o exemplo comentado `src/videos/exemplo/Exemplo.tsx`. Copie a estrutura deles.

## Onde fica cada coisa

```
src/videos/<codigo>/
  palavras.ts     (já pronto, feito na etapa sincronizar; não editar à mão)
  <Nome>.tsx      (a composição: tempos, câmeras, mundo, interface, sons)
  pecas.tsx       (só as peças novas deste vídeo)
```

Peças da biblioteca: importe de `src/pecas/` como o `CATALOGO.md` mostra (de dentro de `src/videos/<codigo>/` o caminho começa com `../../pecas/`). Primitivas da base: `../../base/pecas`, `../../base/interface`, `../../base/tempo` etc. Estilo: `import {SERIE, temaPorId} from '../../estilo'` e `const tema = temaPorId(estilo)` dentro do componente.

Registre as composições em `src/Root.tsx`, copiando o bloco do molde (BASE-API.md, seção 3):
- `<Nome>`: o vídeo com tudo (legenda, pílula, chips, sons);
- `<Nome>Guia`: igual, com a moldura da área segura por cima, para conferir;
- `<Nome>Limpo`: só o mundo 3D, sem interface (fundo da capa);
- `Capa<Nome>`: a capa (feita na etapa **capa-e-legenda**, pode deixar registrada já).

Todas com 1080 × 1920, 30 fps e a duração em quadros anotada no `andamento.md`. As três primeiras recebem `defaultProps={{estilo: ATIVO, faixas: FAIXAS, revisao: REVISAO}}` (mais `guia: true` ou `semInterface: true`). Sem `faixas` o vídeo final sai **mudo**.

### Som
- O som é a lista `FAIXAS` exportada pelo `<Nome>.tsx`: `narracao(P)` (a narração do projeto), `efeito('pop', T.algo, 0.3)` para cada efeito (`pop`, `tique`, `whoosh`, `ding`, `baque`, `subida`, `impacto`, `bip`) e, se a pessoa tiver uma trilha própria sem direitos, `{arquivo: `${P}/sfx/trilha.wav`, volume: 0.13, entrada: 0.4, saida: 1.3}`. O Estúdio não traz trilha musical.
- Dentro do vídeo, `<Sons faixas={faixas} />` toca a lista na prévia; o `render.mjs` mistura a mesma lista com ffmpeg no vídeo final. Não use `<Audio>` solto.

## Como programar

### 1. Tempo: tudo pela fala
- Monte primeiro uma tabela de tempos no topo do `<Nome>.tsx`, com um nome para cada linha do mapa de palavras-chave do plano. O `quando` vem da base: `const quando = criarQuando(PALAVRAS);` (`import {criarQuando} from '../../base/tempo'`). As curvas também (`rampa`, `entra`, `sumir`, `pulso`):
  ```ts
  const T = {
    oficial: quando('É oficial'),
    aprovou: quando('Congresso aprovou'),
    seisXum: quando('6x1'),
    seisXum2: quando('6x1', 2),   // a 2ª vez que "6x1" é falado
    // ...
  };
  ```
- Nunca escreva segundos soltos (`if (t > 12.4)`). Sempre `T.algo` ou `T.algo + 0.3` (pequeno atraso a partir da palavra).
- Se `quando()` não achar um trecho, o código para com erro. Isso é bom: corrija o trecho, não esconda o erro.
- Conferir os trechos repetidos da lista do plano: `quando()` pega a primeira vez.

### 2. Mundo
- Um componente de mundo que recebe o tempo `t` e desenha tudo. Cada peça calcula a própria entrada, estado e saída a partir de `T`.
- Entradas com mola suave, saídas de pelo menos 0,4 s. Nada aparece ou some de um quadro para o outro.
- Posições vêm do mapa do mundo do plano. Guarde-as em constantes com nome (`SEMANA`, `CAMARA`, `PILHA`), não números espalhados.
- Peças das alas laterais ou de uma cena só aparecem na cena delas e somem depois.
- Multidões grandes (pessoas, lojas, carros) com instâncias (uma malha repetida), como o BASE-API.md mostra, para não pesar.

### 3. Câmera
- Uma câmera por cena (ou por plano dentro da cena), com o enquadramento automático da base: alvo, tamanho do que precisa caber e direção. A distância do plano é só referência.
- Transição suave entre câmeras, e a câmera sempre se movendo um pouco (arco, grua leve).
- Confira no `<Nome>Guia` que o assunto está dentro da área segura.

### 4. Interface (o que é 2D, por cima)
- Legenda (`Legenda`), pílula (`Pilula`), marca da série (`Marca`), chips (`Chip`), contador (`Contador`) e rótulos com linha (`Etiqueta`) vêm prontos da base. Não reinvente.
- Chips e rótulos: textos curtos em maiúsculas, que entram na palavra. Texto que muda (contador, placar) é HTML que troca de texto, não textura redesenhada.
- Selo de fonte quando o plano pedir: um por dado, na hora em que é dito.

### 5. Estilo
- Todas as cores do tema do perfil (`src/estilos/<perfil>.ts`), passadas como a base pede. Nenhuma cor `#xxxxxx` no código do vídeo.
- O acento só no que o plano marcou.

### 6. Peças novas (`pecas.tsx`)
- Só crie uma peça se ela não existir no `CATALOGO.md`, nem algo que adaptado sirva.
- Peça reconhecível e com detalhe (ônibus com rodas, janelas e faróis).
- Sem textura de imagem de terceiros, logo ou rosto. Texto escrito com a fonte do perfil.
- Peça útil para outros vídeos: avise no fim da etapa e sugira acrescentar ao catálogo (a pessoa decide).

## Regras técnicas que evitam defeito (do nosso histórico)

- **Nunca** criar textura que muda a cada quadro. Toda textura criada no código precisa de `useMemo` + `useDescartar` (BASE-API.md, seção 10). Textura que vaza memória trava o render. Texto com a fonte do perfil numa textura: espere as fontes com `useFontesProntas()` (de `base/fontes`), como faz a `Placa`.
- **Sem chuvisco**: duas superfícies no mesmo plano brigam e piscam de longe. Piso ou tapete próprio pelo menos 0,03 acima do chão; nenhuma superfície própria a menos de 0,01 de outra; texto ou tela sobre caixa afastado de 0,003 a 0,01 da face (BASE-API.md, seção 17).
- Peça fina sobre outra (linhas num caderno) fica acima da face de cima da peça de baixo, não só do centro dela.
- Caixa arredondada: cada medida maior que 2 vezes o raio do arredondado, senão a peça some.
- Disco ou mostrador de frente para a câmera: cilindro precisa girar 90° no eixo x; anel (torus) já nasce de frente.
- Texto em placa: palavra longa com letra grande sai cortada. Conta rápida: letras × tamanho × 0,62 < 1000 (largura da textura de 1024).
- Letreiro de prédio só com palavra curta (até ~7 letras: "SAÚDE", "PÚBLICO", "INSS").
- Superfície grande e clara no tema escuro estoura no brilho e vira branco: use um tom médio, misturado com o escuro.
- Água ou chão próprio fosco (pouco reflexo), senão fica cinza-claro com câmera baixa.
- Mundo comprido: só desenhe o que está perto do alvo da câmera, e aumente o alcance das sombras e da névoa como o BASE-API.md indica.
- Peça que recua não deita junto (parece cair). Peça que sai por baixo gira para longe antes de afundar, para não atravessar o close.
- Cenário alto no meio do mundo (telão, parede) afunda enquanto a câmera visita o que está atrás.

## Conferir antes de passar para a revisão

1. Tipos sem erro:
   ```
   npx tsc --noEmit
   ```
2. Abra a prévia e veja o vídeo andando, pelo menos o começo e as trocas de cena:
   ```
   npm run studio
   ```
   Diga à pessoa que ela pode olhar também, se quiser (abre no navegador).
3. Tire 2 ou 3 quadros soltos para ver se o 3D aparece (tempos em segundos):
   ```
   node scripts/quadros.mjs <Nome> "projetos/NNN. nome" 3 20 45
   ```
   Olhe a imagem você mesmo.

Não rode `prettier` nem formatadores sem opção nos arquivos da base: o padrão deles muda as aspas e quebra as linhas de tudo.

Pronto: anote no `andamento.md` ("cenas programadas") e siga para a skill **revisao**.
