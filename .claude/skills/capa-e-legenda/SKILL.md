---
name: capa-e-legenda
description: Etapa 8 do Estúdio 3D Explicado. Faz a capa do vídeo (título de 4 linhas sobre um quadro limpo do próprio mundo 3D) e a legenda do post com dados, fontes, chamada de comentário, hashtags e comentário fixado. Use logo depois do vídeo final, sem esperar pedido, ou quando a pessoa pedir só a capa ou só a legenda.
---

# Capa e legenda do post

Esta etapa é feita **sempre**, logo depois do vídeo final, sem perguntar. A entrega do vídeo só está completa com os três arquivos em `edicoes/NNN. nome/`: `video final.mp4`, `capa.jpg` e `legenda do post.txt`.

## Parte 1: a capa

### Como ela é
- **Pílula** no alto: `Série · TEMA` (ex.: "Explicando Direito · ESCALA 6x1"), feita com a `Pilula` da base.
- **Título** de 4 linhas, até 12 caracteres cada, letras grandes. A última linha vai na cor de acento do perfil.
- **Fundo**: um quadro do próprio vídeo, sem interface (composição `<Nome>Limpo`), com o objeto principal na **metade de baixo**. A metade de cima fica escurecida por baixo do título.

### O título
- É o gancho que faz clicar: **pergunta + virada**. Nunca o nome seco do tema ("Escala 6x1" não serve).
- Tem que ser verdadeiro perante as fontes.
- Use o título aprovado junto com o roteiro (está no `andamento.md` ou no `plano.md`). Se não houver, crie seguindo os exemplos:
  - "Aprovaram / o fim da / 6x1. Mas / quando vale?" (a capa real do molde)
  - "Acabou / a 6x1? / Ainda / não."
  - "Quem te deu / as 8 horas? / Ninguém. / Foi luta."
  - "Cadê o / fogo? / Estava a / 3 mil km."
  - "Paga o / privado. / Sonha com / o concurso."
- Linha com mais de 12 caracteres: reescreva ou quebre em 5 linhas.

### Passo a passo
1. **Escolha o quadro do fundo.** Olhe os quadros da revisão e escolha 2 ou 3 candidatos em que o objeto principal (o "herói" do vídeo) está grande e na metade de baixo. A grua final, com o mundo inteiro, costuma funcionar.
2. Gere o quadro limpo (troque `880` pelo número do quadro: segundos × 30):
   ```
   npx remotion still <Nome>Limpo "projetos/NNN. nome/capa/fundo-limpo.jpg" --frame=880
   ```
   (No molde foi o quadro 880, aos 29,3 s: a semana com a cadeira de praia no sábado e a linha do tempo acesa.)
3. Monte a capa copiando a `CapaEscala6x1` do molde (fim de `src/videos/escala6x1/Escala6x1.tsx`) para o `<Nome>.tsx` com o nome `Capa<Nome>`, e registre `<Still id="Capa<Nome>" ... />` no `src/Root.tsx` (já registrada se a etapa cenas-3d fez isso). Ela já tem a pílula, as 4 linhas do título (`linhas`, a última no acento), o fundo (`fundo`, padrão `capa/fundo-limpo.jpg` do projeto) e o escurecimento da metade de cima. Troque o assunto da pílula e o título. Se o objeto principal ficou alto demais, aumente `desce` (em pixels, o molde usa 120); se ainda assim não ficar bom, escolha outro quadro.
4. Gere a capa:
   ```
   npx remotion still Capa<Nome> "edicoes/NNN. nome/capa.jpg"
   ```
5. **Olhe a capa** você mesmo:
   - [ ] título legível no tamanho de miniatura (imagine a capa pequena na grade do perfil);
   - [ ] a última linha no acento não some sobre um objeto da mesma cor (se sumir, troque o quadro ou desça o fundo);
   - [ ] o objeto principal aparece e se entende o assunto;
   - [ ] nada importante no terço de baixo, onde o Instagram corta a capa na grade.

## Parte 2: a legenda do post

Salve em `edicoes/NNN. nome/legenda do post.txt`.

### Estrutura
1. **Primeira linha = gancho**, a mesma pergunta ou virada da capa, com 1 emoji no máximo. É a única linha que aparece antes do "mais".
2. **O essencial em tópicos**, 4 a 8 linhas, cada uma começando com um emoji que tem a ver com o item (📅 prazo, 💰 dinheiro, ⚠️ cuidado, 🏛️ governo). Os números com a fonte entre parênteses quando couber ("(PRF)", "(CTB, art. 320)").
3. **Um aviso ou cuidado**, se houver ("Até o prazo vencer, vale a regra de hoje.").
4. **Chamada de comentário** específica, fácil de responder:
   - pergunta pessoal: "Você trabalha na 6x1? Me conta o que vai fazer com a folga a mais.";
   - palavra-chave: "Comenta CAIU se o seu dinheiro já voltou, ou ESPERANDO se ainda não.";
   - lugar: "Comenta o nome da sua cidade: aí tem mais radar ou mais buraco?"
5. **Compartilhar e salvar**: "Manda esse vídeo pra quem trabalha seis dias por semana e salva pra conferir quando a mudança começar."
6. **Seguir**: "Segue o @perfil para entender o que muda na sua vida." (frase fixa do perfil, em `projetos/_perfis.md`).
7. **Hashtags**: 4 a 8, as do tema mais as fixas do perfil.
8. Separado, no fim: **comentário fixado sugerido**, uma pergunta que puxa conversa ("Se você pudesse escolher: 8 horas em 5 dias ou 10 horas em 4 dias? 👇").

### Exemplo (resumido, de um vídeo nosso)
```
É OFICIAL: o fim da escala 6x1 foi aprovado. ✅ Mas calma, ela ainda não acabou. 👇

🗳️ O Senado aprovou por 75 votos a 1, em dois turnos no mesmo dia.
📜 Agora o Congresso promulga. Não passa pela sanção do presidente.

O que muda e quando:
📅 2 meses depois de publicada: 2 folgas por semana e limite de 42 horas
⏳ Em até 14 meses: 40 horas por semana
💰 Sem redução de salário, nem do piso

Até o prazo vencer, vale a regra de hoje.

💬 Você trabalha na 6x1? Me conta nos comentários o que vai fazer com a folga a mais.
📲 Manda esse vídeo pra quem trabalha seis dias por semana.
👉 Segue o @seuperfil para entender o que muda na sua vida.

#escala6x1 #fimda6x1 #direitotrabalhista #clt #trabalho

---
Comentário fixado sugerido:
Qual dia você escolheria para a segunda folga? 👇
```

### Critérios
- Nada na legenda que não esteja nas fontes do vídeo.
- Frases curtas, sem travessão de aposto, sem jargão.
- Sem promessa ("garanto que...") e sem tom de ameaça.
- Tema político: neutro, igual ao vídeo.

## Entrega

Diga em 3 ou 4 linhas:
- onde estão os três arquivos (`edicoes/NNN. nome/`);
- a duração do vídeo e o título da capa;
- o que conferir antes de publicar (item "Conferir antes de publicar" do `fontes.md`);
- sugestão de melhor horário ou dia, se o tema tiver data (prazo, votação, pagamento).

Atualize o `andamento.md` ("entregue em DD/MM/AAAA") e pergunte se ela quer começar o próximo vídeo ou ver o banco de ideias.
