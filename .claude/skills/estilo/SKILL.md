---
name: estilo
description: Conversa de onboarding para criar o estilo de um perfil (nicho) no Estúdio 3D Explicado. Define nome do perfil, nicho, nome da série, cores, fonte, chamada final e voz, e gera src/estilos/<perfil>.ts e a ficha em projetos/_perfis.md. Use antes do primeiro vídeo, quando a pessoa quiser um perfil novo ou quiser mudar a identidade visual.
---

# Estilo do perfil

O estilo é a identidade fixa de um perfil: todo vídeo dele sai com as mesmas cores, a mesma fonte, o mesmo nome de série e a mesma assinatura. Um Estúdio pode ter vários perfis (ex.: um de direito, outro de finanças). Cada projeto diz no `andamento.md` qual perfil usa.

## Como conduzir

Uma pergunta por vez, sempre com sugestão pronta. Se a pessoa disser "escolhe você", escolha e explique em uma frase.

### Pergunta 1: o perfil
"Qual é o @ do perfil onde os vídeos vão sair, e sobre o que ele fala?"
- Guarde: `@` (ex.: `@seuperfil`), nicho em poucas palavras (ex.: "direito do trabalhador explicado").
- Gere o **id do perfil** para o arquivo: minúsculas, sem espaço nem acento (ex.: `direitotrabalhador`).

### Pergunta 2: o nome da série
"Qual nome aparece no topo de todo vídeo e na assinatura do final?"
- Sugira 3 opções curtas (até 20 letras), no padrão "verbo + assunto": "Explicando Direito", "Bolso Explicado", "Saúde Sem Mistério".
- O nome da série também entra na pílula da capa ("SÉRIE · TEMA") e no "segue o ..." do fim do roteiro, se a pessoa quiser.

### Pergunta 3: as cores
Ofereça 4 paletas e recomende uma pelo nicho. O Estúdio funciona melhor com **fundo escuro e uma cor de destaque só**:

| Paleta | Fundo | Destaque (acento) | Combina com |
|---|---|---|---|
| Escuro + Marsala | escuro | `#C23B2A` | direito, política, notícias |
| Escuro + Azul elétrico | escuro | `#2F7BFF` | tecnologia, finanças |
| Escuro + Verde folha | escuro | `#2FA36B` | saúde, campo, meio ambiente |
| Escuro + Dourado | escuro | `#D9A520` | investimentos, carreira |

Critérios para uma cor própria que a pessoa trouxer:
- O acento precisa aparecer bem sobre o fundo escuro e também com texto branco por cima (contraste parecido com os exemplos acima).
- Nada de neon muito saturado nem vermelho puro `#FF0000`: estoura com o brilho do 3D.
- Uma cor de destaque só. As outras cores de objeto vêm da paleta de apoio da base (veja BASE-API.md).

### Pergunta 4: a fonte
A base já traz **Inter** (títulos, legenda e textos) e **JetBrains Mono** (pílula, chips, rótulos pequenos), as duas com licença livre (OFL) em `projetos/_estudio/fontes/`. Recomende manter as duas. Se a pessoa quiser outra, ela precisa ter licença livre (ex.: Google Fonts, OFL), ficar em `projetos/_estudio/fontes/` e ser carregada pela base; o tema troca pelos campos `fonte` e `fonteMono` (BASE-API.md, seção 5). Critérios: legível em celular, com acentos do português, peso forte para títulos.

### Pergunta 5: a chamada final
"Como você quer fechar os vídeos?" Sugira o padrão do Estúdio:
- pergunta de comentário ligada ao tema (muda a cada vídeo);
- frase fixa de seguir: "E segue o [série] para entender o que muda na sua vida." (adapte ao nicho).
- Hashtags fixas do perfil (2 a 4), que entram em toda legenda.

### Pergunta 6: a voz
"Qual voz do ElevenLabs você vai usar?" A pessoa escolhe na conta dela. Guarde só o **nome da voz** (nunca chave de API nem senha). Lembre a configuração padrão do Estúdio: velocidade 0,95, estabilidade 70, similaridade 90, modelo Eleven v3.

## Gerar os arquivos

1. Leia o BASE-API.md, na parte de estilos, e um estilo que já exista em `src/estilos/` como exemplo de formato.
2. Crie `src/estilos/<id>.ts` copiando `src/estilos/modelo.ts`, herdando o tema base (`ESCURO` ou `CLARO`) e trocando só o que foi escolhido. Formato:
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
3. Registre em `src/estilo.ts`: importe o tema, chame `registrarEstilo('<id>', TEMA)` e troque `export const ATIVO = '<id>'`. Todos os vídeos (inclusive o molde) passam a usar esse estilo, porque leem o tema por `temaPorId(estilo)`.
4. Crie ou atualize `projetos/_perfis.md` com a ficha:
   ```
   ## @seuperfil (id: direitotrabalhador)
   - Nicho: direito do trabalhador explicado
   - Série: Explicando Direito
   - Paleta: Escuro + Marsala (#C23B2A)
   - Fonte: (nome)
   - Chamada final: "E segue o Explicando Direito para entender o que muda na sua vida."
   - Hashtags fixas: #explicandodireito #direitotrabalhista
   - Voz no ElevenLabs: (nome da voz) · velocidade 0,95 · estabilidade 70 · similaridade 90 · Eleven v3
   - Criado em: (data)
   ```
5. Rode `npx tsc --noEmit` para ver se o arquivo não quebrou nada.

## Mostrar a amostra (aprovação)

- Gere um quadro de amostra com o estilo novo, usando a composição de amostra indicada no BASE-API.md. Para funcionar igual no Mac e no Windows, escreva as opções num arquivo JSON (ex.: `projetos/amostra.json` com `{"estilo": "<id>"}`) e passe o arquivo:
  ```
  npx remotion still AmostraEstilo "projetos/amostra do estilo <id>.jpg" --props="projetos/amostra.json"
  ```
  Depois de aprovar, o `amostra.json` pode ficar (é seu, não é da pessoa) ou ser removido. Para ver o estilo em movimento, a pessoa pode abrir o molde `Escala6x1` na prévia (`npm run studio`).
- Olhe a imagem você mesmo antes de mostrar: o acento aparece? O texto está legível? Nada saiu da área segura?
- Mostre à pessoa e pergunte: "Ficou com a cara do seu perfil? Quer trocar alguma coisa?"
- Ajuste até ela aprovar. Registre no `_aprendizados.md` qualquer preferência visual que ela disser ("prefere cores frias", "não gosta de dourado").

## Regras

- Cor nunca vai direto no código de um vídeo. Tudo sai do tema do perfil.
- Mudar o estilo de um perfil muda os vídeos **futuros**. Vídeos já entregues não são refeitos sem pedido.
- Não use logo, marca ou fonte de terceiros com direitos. Se a pessoa tiver um logo próprio, ele pode entrar só na capa ou na assinatura, nunca como objeto 3D de outra marca.
