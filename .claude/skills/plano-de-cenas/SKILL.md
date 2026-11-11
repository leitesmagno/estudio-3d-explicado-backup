---
name: plano-de-cenas
description: Etapa 4 do Estúdio 3D Explicado. Escreve o plano.md do vídeo, com a ideia do mundo 3D, o mapa do mundo, o mapa de todas as palavras-chave (palavra, tempo, objeto 3D, o que acontece, cena), a câmera de cada cena no início e no fim, as fontes, os sons e a lista de arquivos e peças. Termina com a aprovação da pessoa. Use depois da sincronia e antes de qualquer código de cena.
---

# Plano de cenas

O plano é o roteiro visual. Ele diz o que aparece, quando, onde e como a câmera filma. **Nenhuma linha de código de cena antes do plano aprovado.**

Leia antes, nesta ordem:
1. `projetos/_aprendizados.md` (todas as categorias);
2. `BASE-API.md` (câmera, `quando()`, enquadramento, área segura);
3. `src/pecas/CATALOGO.md` (o que já existe pronto) e as imagens da galeria em `projetos/_estudio/galeria/`;
4. o plano molde `projetos/001. escala 6x1/plano.md`, para o nível de detalhe;
5. os planos dos 2 ou 3 últimos projetos, para **não repetir o mesmo mundo** em vídeos seguidos;
6. as fotos em `referencias/` do projeto, se houver. Foto de referência manda no visual, mesmo contra as regras gerais de cor. Use a ideia e o clima, sem copiar quadro a quadro.

## 1. Escolher o mundo

O vídeo inteiro acontece **num mundo só**, contínuo. As cenas são câmeras diferentes passeando por ele, sem trocar de cenário. Isso dá a sensação de "maquete viva" e deixa o vídeo reconhecível.

- O mundo nasce de uma **metáfora do tema**: a semana como 7 blocos no chão e as horas como cubinhos; o dinheiro das multas correndo em canos por dentro de um anel viário; uma lei como um livro pop-up que abre uma página por capítulo.
- Mundos que já funcionaram (para inspirar e para variar): semana em blocos; estrada do tempo; cidade vista do alto com multidão; casa de bonecas cortada (um andar por assunto); palco giratório (frente e fundo); livro pop-up; mapa do país deitado como tabuleiro; mar com navios e boias; estádio no meio da cidade; planície de celulares; estúdio de TV com bastidores; anel viário em maquete.
- Se o gancho fala com "você", crie um **protagonista**: um boneco na cor de acento, visto de cima no meio da multidão no primeiro quadro, que conduz o vídeo inteiro.
- Tema de cidade ou trânsito: o mundo tem que parecer vivo (gente andando, carros rodando) e ter um personagem-exemplo que passa pelo problema na frente da câmera.
- Tema polêmico: "plateia" fixa nos cantos da tela, um grupo de cada lado com balão de pensamento; os dois lados com o mesmo tempo.
- Proponha a ideia do mundo em 3 ou 4 frases antes de escrever o plano inteiro, se a pessoa costuma opinar nisso. Se ela já autorizou seguir, escreva direto.

## 2. Estrutura obrigatória do plano.md

Plano sem as seções 2.1 a 2.8 não vai para aprovação.

### 2.1 Narração
- Arquivo, duração, total de quadros (a 30 fps, com 0,9 s de folga), número de palavras, tempo da última.
- Ajustes da sincronia.
- Lista das palavras repetidas com o `quando()` certo para cada ocorrência.

### 2.2 Ideia e mundo
- A metáfora em um parágrafo.
- Quem é o protagonista (se houver).
- Placar fixo e selos de fonte (se houver): tabela com selo, palavra em que entra e texto.
- **Paleta**: tabela "uso → campo do tema do perfil" (fundo, chão, objeto, objetoEscuro, acento...). Nenhuma cor fixa.
- **Mapa do mundo**: tabela com cada lugar ou peça, a posição [x, y, z] (chão em y = 0) e a observação (peça do catálogo ou peça nova, tamanho, quando aparece e quando some).
- **Regras visuais** do vídeo (tom, o que vai no acento, o que nunca aparece).

### 2.3 Mapa de palavras-chave
Tabela com **todas** as palavras que disparam algo:

| # | Palavra (quando) | Tempo | Objeto 3D | O que acontece | Cena |
|---|---|---|---|---|---|
| 12 | `75` | 10,24 | Placar | Gomos acendem contando até 75 | 2 |
| 13 | `votos a 1` | 11,72 | Placar | 1 gomo apagado do outro lado; "75 × 1" | 2 |

- A palavra é escrita como vai no código (`quando('votos a 1')`); o tempo vem do `palavras.ts`.
- **Uma animação por palavra-chave.** Não agrupe palavras diferentes numa animação genérica. Densidade: pelo menos 1 evento a cada 1,5 s de fala; mire em 1 por segundo. Os nossos vídeos que mais funcionaram tinham de 70 a 200 eventos em 80 a 90 s.
- Extras que você sugere além do roteiro levam ★.
- Todo número dito tem o seu objeto ou o seu texto na tela, na hora em que é dito.

### 2.4 Cenas com câmera
Uma seção por cena:
```
### CENA 4: A CONTAGEM (18,16 a 32,50 s)
Abre em: quando('Aí começa') · Sai em: quando('Na transição') · Eventos 19 a 31
- Câmera, em três planos:
  - 4a (18,16 a 24,10): pos [0,4, 16,6, 29,9] · alvo [0,4, 0,6, 2,2] · dist 32 · ângulo 30°
  - 4b ...
- Texto: os chips e rótulos da cena
- Pílula: A CONTAGEM
- Aha: a frase que resume o que a pessoa entende nesta cena
```
- Para cada câmera: **posição, alvo, distância e ângulo** no início e no fim.
- O vídeo é vertical e estreito (o campo horizontal é pequeno). A distância do plano é só referência: no código, a câmera usa o **enquadramento automático** da base (alvo + tamanho do que precisa caber + direção, veja BASE-API.md). Planeje pensando no que precisa caber.
- A câmera **nunca fica parada**: sempre um arco, uma grua ou um avanço lento.
- Cada cena tem um estado na **pílula** do topo (2 ou 3 palavras em maiúsculas).

### 2.5 Fatos e fontes
Resumo do `audio/fontes.md` e o que vai escrito na tela de cada fato (arredondado como na fala). Item "Conferir antes de publicar".

### 2.6 Trilha e sons
Quais efeitos em quais eventos (passagem de cena, número, carimbo, virada), escolhidos entre os do Estúdio: `whoosh` (troca de cena), `tique` (pílula muda), `pop` (número ou objeto entra), `ding` (virada boa), `baque` (algo cai ou é negado), `impacto` (carimbo), `subida` (contagem), `bip` (tela, relógio). Trilha de fundo é opcional: o Estúdio não traz música; se a pessoa tiver uma sem direitos autorais, vai em `projetos/NNN. nome/sfx/trilha.wav` (BASE-API.md, seção 13). Nada de música com direitos.

### 2.7 Arquivos
- **Novos**: `src/videos/<codigo>/<Nome>.tsx`, `src/videos/<codigo>/pecas.tsx` (lista das peças novas, com uma linha de descrição cada), `palavras.ts` (já pronto).
- **Alterados**: registro das composições (`<Nome>`, `<Nome>Guia`, `<Nome>Limpo`, `Capa<Nome>`), conforme o BASE-API.md.
- **Reaproveitados**: as peças do `CATALOGO.md`, com o nome exato.
- Total de quadros e divisão do render em partes (o `render.mjs` decide, mas anote).

### 2.8 Origem das escolhas
O que veio das regras do `_aprendizados.md` (liste as regras que se aplicam a este vídeo) e o que é escolha sua como diretor. A pessoa costuma perguntar "de onde veio isso?".

## 3. Critérios de qualidade do plano

- Objetos **reconhecíveis e detalhados**: carro com rodas, vidros e faróis; cartão com chip; prédio público com o nome do órgão escrito em cima; balança da Justiça quando o assunto é decisão judicial. Nada de bloquinho abstrato quando dá para ser a coisa.
- Coisa de época é de época (carro de 1914 não é carro moderno).
- Números e pilhas **ao lado** do objeto principal, nunca atrás.
- Objeto grande na frente de objeto pequeno tapa o assunto: o grande vai atrás, como fundo.
- Objeto claro na frente de fundo claro some. Acento sobre acento some.
- Multidão de objetos (lojas, pessoas, carros) só nasce na palavra dela.
- Tudo que se acende numa cena volta ao neutro quando ela termina.
- Dois nomes ditos a menos de 1 s um do outro: um plano que mostre os dois, não um close para cada.
- Sem marca, logo, rosto real ou personagem protegido. Pessoa real: boneco genérico com etiqueta de nome. Símbolos protegidos (como a cruz vermelha) também ficam de fora.
- Sem flash, explosão, fogo piscando ou clarão. Acidente histórico pode aparecer de forma suave, sem explosão.

## 4. Aprovação

1. Salve em `projetos/NNN. nome/plano.md` com o título `# Plano de cenas: NNN. nome (versão 1, para aprovação)`.
2. Mostre à pessoa um **resumo curto** (não o plano inteiro): o mundo em 3 frases, as cenas em uma linha cada, os extras ★, e diga onde está o arquivo completo.
3. Pergunte: "Aprova o plano? Quer mais alguma coisa na tela?"
4. Pedido de mudança: faça a versão 2 no mesmo arquivo, renomeando a antiga para `plano (versão 1).md`. Registre os pedidos que valem para o futuro no `_aprendizados.md`.
5. Aprovado: mude o título para "(versão N, aprovada em DD/MM/AAAA)", anote no `andamento.md` e siga para a skill **cenas-3d**.
