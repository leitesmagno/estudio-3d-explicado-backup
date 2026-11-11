---
name: tema-e-roteiro
description: Etapa 1 do Estúdio 3D Explicado. Escolhe o tema, cria as pastas do projeto, pesquisa em fontes oficiais e escreve o roteiro falado com gancho nos 3 primeiros segundos, mais o arquivo de fontes e a sugestão de título da capa. Termina com a aprovação da pessoa. Use quando a pessoa quiser começar um vídeo novo ou refazer o roteiro de um projeto.
---

# Tema e roteiro

Leia antes: `projetos/_aprendizados.md` (seções Roteiro e Nunca fazer), `projetos/_perfis.md` (perfil do vídeo) e o molde `projetos/001. escala 6x1/audio/`.

## Passo 1: o tema

- Se a pessoa trouxe o tema, siga com ele.
- Se não trouxe, consulte primeiro `projetos/banco de ideias.md`. Depois, se precisar, faça uma busca rápida de notícias do nicho da semana. Ofereça **3 temas**, cada um com uma linha de por que funciona (afeta o bolso, prazo perto, todo mundo fala, mito comum). Recomende um.
- Bom tema para o Estúdio: tem uma **regra ou um número** que dá para mostrar com objetos (dias, horas, dinheiro, prazo, quem paga, para onde vai), afeta muita gente e tem uma **virada** (algo que quase ninguém sabe).
- Se a pessoa gostar de um tema mas quiser deixar para depois, guarde no `banco de ideias.md`: gancho, por que funciona, melhor época, pontos para pesquisar, fonte inicial e data.

## Passo 2: criar o projeto (logo que o tema for escolhido)

1. Descubra o próximo número livre em `projetos/` (3 dígitos).
2. Crie, antes de qualquer outra coisa:
   ```
   projetos/NNN. nome/
   projetos/NNN. nome/audio/
   projetos/NNN. nome/transcricao/
   projetos/NNN. nome/revisao/
   projetos/NNN. nome/capa/
   projetos/NNN. nome/referencias/
   projetos/NNN. nome/plano.md          (vazio por enquanto)
   projetos/NNN. nome/andamento.md
   edicoes/NNN. nome/
   ```
   O nome é curto e legível, com espaços e acentos ("013. 13º salário"). Crie as pastas com o node para funcionar igual no Mac e no Windows:
   ```
   node -e "const p='projetos/013. 13º salário';for(const d of ['audio','transcricao','revisao','capa','referencias'])require('fs').mkdirSync(p+'/'+d,{recursive:true});require('fs').mkdirSync('edicoes/013. 13º salário',{recursive:true})"
   ```
3. Escolha o **código** do vídeo (minúsculas e números, sem espaço: `decimoterceiro`) e escreva o `andamento.md`:
   ```
   # 013. 13º salário
   - Perfil: @seuperfil (id: direitotrabalhador)
   - Código: decimoterceiro · Nome: Decimoterceiro
   - Etapa atual: 1. roteiro (pesquisando)
   - Aprovações: (nenhuma ainda)
   - Seguir sem pausas: não
   ```

## Passo 3: pesquisa

- Use busca na web. Ordem de preferência das fontes:
  1. o texto da lei, decreto, portaria ou resolução no site oficial (Planalto, Diário Oficial, órgão que editou);
  2. agências oficiais de notícia (Agência Senado, Agência Câmara, Agência Brasil, sites gov.br, tribunais);
  3. órgãos de dados (IBGE, Banco Central, Dieese, Ipea) e grandes veículos de imprensa, para contexto.
- Cada número precisa de uma fonte; os números principais, de duas. Se duas fontes discordam, use a oficial e anote a diferença.
- Separe o que **já vale** do que **ainda é proposta**. Isso muda o roteiro inteiro ("aprovou, mas ainda não vale").
- Anote a data de hoje como data da checagem.
- Tema polêmico: pesquise os dois lados, com quem calculou cada número.

## Passo 4: o gancho

O gancho são as palavras dos **3 primeiros segundos** (cerca de 8 a 10 palavras). Ele decide se a pessoa assiste.

- Ofereça 3 ganchos de tipos diferentes e recomende um. Se a pessoa quiser mais opções, use a skill **ganchos** (10 opções).
- O gancho tem que ser verdadeiro perante as fontes, sem ameaça e sem promessa que o vídeo não cumpre.
- Exemplos do nosso material que funcionaram:
  - número que pesa: "Quase 15 milhões de brasileiros trabalham seis dias para descansar um."
  - notícia com virada: "É oficial: o Congresso aprovou o fim da escala 6x1. Mas ela ainda não acabou."
  - pergunta com "você": "Aí onde você mora tem mais radar ou mais buraco?"
  - frase que provoca: "Suas 8 horas de trabalho não caíram do céu."
  - cena do dia a dia: "Você foi abastecer. A gasolina subiu de novo."

## Passo 5: escrever o roteiro

**Estrutura que funciona:**

1. **Gancho** (0 a 3 s).
2. **A pergunta do vídeo** (até uns 8 s): o que a pessoa vai entender ("Mas o que muda de verdade no seu contrato?").
3. **Explicação em camadas**, do básico ao surpreendente. Cada camada é uma ideia que vira uma cena.
4. **Virada no meio**, com uma frase de atenção: "Agora repara.", "E tem a parte que quase ninguém percebe.", "Agora segura essa:".
5. **Exceções e cuidados** (quem fica de fora, prazo, quando começa a valer).
6. **Fecho curto** que amarra a ideia ("Até lá, vale a regra de hoje.").
7. **Chamada**: uma pergunta de comentário ligada ao tema ("Você trabalha na 6x1? Me conta nos comentários.") e a frase fixa de seguir do perfil.

**Critérios:**

- Duração falada de 60 a 90 s: de 170 a 280 palavras. Mais que isso, corte.
- Frases curtas (até 15 palavras), de conversa, falando com "você".
- Uma ideia por frase. Palavras concretas que viram objeto na tela: "dias", "horas", "salário", "prazo", "Câmara", "carteira".
- Números como a pessoa escreveria no texto do roteiro falado (15 milhões, 44 horas, R$ 21 mil, 10%): é este texto que vira legenda. O texto por extenso para a voz é feito na etapa **narracao**.
- Nada de tom de ameaça (bloqueio, penhora, "você vai perder tudo"). Linguagem de quem ajuda.
- Polêmico: mesmo espaço para os dois lados, "segundo quem" em cada número, e o vídeo não dá a opinião final.
- Lei ou regra que ainda não vale: diga com clareza ("a proposta", "quando for publicada", "até lá, vale a regra de hoje").
- Storytelling ("Eu tava conversando com um amigo...") funciona bem, se for verdade e servir ao tema.

## Passo 6: fontes.md

Crie `projetos/NNN. nome/audio/fontes.md` no formato do molde:

```
# Fontes do roteiro NNN. nome (checadas em DD/MM/AAAA)

| Fato no roteiro | Fonte | Observação |
|---|---|---|
| "quase 15 milhões" na 6x1 | Dieese, via CUT (link) | o número é 14,8 milhões; o roteiro arredonda com "quase" |
| ...
```
- Conta própria entra com a conta escrita (ex.: 44 ÷ 40 = 1,1, cerca de 10%).
- No fim, uma seção **"Conferir antes de publicar"** com o que pode mudar (votação marcada, prazo, valor reajustado).

## Passo 7: título da capa

Sugira já o título da capa: **4 linhas de até 12 caracteres cada**, pergunta mais virada, a última linha vai no acento. Exemplos nossos (a barra separa as linhas):

- "Quem te deu / as 8 horas? / Ninguém. / Foi luta."
- "Roubar / celular? / Com arma, / é hediondo."
- "Cadê o / fogo? / Estava a / 3 mil km."
- "Paga o / privado. / Sonha com / o concurso."

Se uma linha passar de 12 caracteres, quebre em 5 linhas ou reescreva ("Sua multa / pode tapar / buraco. / Por que / não tapa?").

## Passo 8: aprovação

1. Salve o texto limpo, num parágrafo só ou em parágrafos curtos, em `projetos/NNN. nome/audio/roteiro-falado.txt`.
2. Mostre à pessoa: o roteiro, a duração estimada (palavras ÷ 3 = segundos, aproximado), o título da capa e um resumo das fontes (2 a 4 linhas).
3. Pergunte: "Aprova o roteiro ou quer mudar alguma coisa?"
4. Ajuste até aprovar. Cada pedido de mudança que valha para outros vídeos vai para o `_aprendizados.md`.
5. Aprovado: anote no `andamento.md` a data, "roteiro aprovado" e o título da capa aprovado (linha "Título da capa"), e siga para a skill **narracao**.

Nunca peça a voz antes da aprovação.
