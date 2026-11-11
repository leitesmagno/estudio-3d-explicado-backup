---
name: revisao
description: Etapa 6 do Estúdio 3D Explicado. Gera os quadros de revisão do vídeo com scripts/quadros.mjs, olha cada quadro com uma lista de conferência (área segura, tempo pela fala, nada tapado, nada piscando, textos certos), corrige o que precisar e mostra à pessoa para aprovação antes do vídeo final. Use depois de programar as cenas.
---

# Revisão por quadros

Gerar o vídeo final demora. Antes disso, conferimos fotos de momentos-chave. É mais rápido achar e corrigir problema aqui.

## Passo 1: gerar os quadros

```
node scripts/quadros.mjs <Nome> "projetos/NNN. nome"
```

Os quadros vão para `projetos/NNN. nome/revisao/` com o nome `<Nome> 012.40s.jpg`. Sem segundos no comando, o script usa a lista `REVISAO` do vídeo (a prop `revisao` da composição): monte essa lista com o começo e o meio de cada cena e os eventos principais, como no molde. Sem a lista, ele tira 10 quadros espalhados. Para tempos escolhidos, ponha os segundos no fim: `node scripts/quadros.mjs <Nome> "projetos/NNN. nome" 3.2 15 41.5`.

Gere também alguns quadros do `<Nome>Guia`, com a moldura da área segura:
```
node scripts/quadros.mjs <Nome>Guia "projetos/NNN. nome" 3 30 60
```

## Passo 2: você olha tudo primeiro

Abra **cada** imagem (leia o arquivo de imagem) e confira esta lista. Anote cada problema com o número do quadro.

**Tempo**
- [ ] Cada cena começa no lugar certo da fala (a pílula do topo denuncia: se ela mostra o estado errado, o `quando()` pegou a ocorrência errada da palavra).
- [ ] O objeto do número aparece quando o número é dito, não antes.

**Enquadramento e área segura**
- [ ] O assunto da cena está inteiro no quadro, sem corte nas bordas.
- [ ] Nenhum texto ou objeto importante embaixo dos botões (direita) ou da descrição (embaixo) do Reels. Confira no `<Nome>Guia`.
- [ ] A legenda não cobre o assunto.

**Nada tapado**
- [ ] Nenhum objeto grande na frente do assunto. Pilhas e números ao lado, não atrás.
- [ ] Chips e rótulos não brigam entre si nem com a pílula do topo.
- [ ] Balões de plateia (se houver) não cobrem o assunto.
- [ ] Objeto claro não some em fundo claro; acento não some sobre acento.

**Qualidade da imagem**
- [ ] Sem chuvisco, pontinhos ou faixas piscando em superfícies (sinal de duas superfícies coladas).
- [ ] Nada estourado em branco (superfície clara grande).
- [ ] Nenhuma peça "saindo" de dentro de outra, deitada errado ou faltando.

**Conteúdo**
- [ ] Textos na tela sem erro de português e iguais às fontes (mesmo arredondamento da fala).
- [ ] Nenhuma marca, logo, rosto real ou personagem protegido.
- [ ] Objetos reconhecíveis (dá para saber o que é sem a legenda).

## Passo 3: corrigir

- Corrija no código, gere de novo só os quadros afetados e olhe outra vez.
- Ajuste que mudou o plano (câmera mais alta, peça trocada) vai numa seção "Ajustes feitos na programação" no fim do `plano.md`, com a data.
- Problema que pode voltar em outros vídeos vira regra no `_aprendizados.md`.

## Passo 4: mostrar à pessoa (aprovação)

1. Escolha de 8 a 12 quadros que contam o vídeo (gancho, cada cena, final) e diga onde estão: `projetos/NNN. nome/revisao/`.
2. Ofereça também a prévia andando: `npm run studio`.
3. Escreva em poucas linhas o que você já corrigiu ("subi a câmera da cena 1 para o Congresso não pesar no gancho").
4. Pergunte: "Posso gerar o vídeo final, ou quer mudar alguma coisa?"
5. Mudança pedida: corrija, gere os quadros de novo e mostre só o que mudou.

Se a pessoa autorizou seguir sem pausas (anotado no `andamento.md`), faça os passos 1 a 3 com o mesmo cuidado e siga direto para o vídeo final, avisando em uma linha.

Aprovado: anote no `andamento.md` e siga para a skill **render**.
