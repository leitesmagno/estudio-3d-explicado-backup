---
name: narracao
description: Etapa 2 do Estúdio 3D Explicado. Transforma o roteiro aprovado em texto para o ElevenLabs (tags de emoção do modelo v3, números por extenso, pronúncias), orienta a pessoa a gerar o áudio na conta dela e depois prepara o arquivo com ffmpeg (acelera 1,2x, normaliza o volume, mono 44100 Hz) em audio/narracao-norm.wav. Use logo depois da aprovação do roteiro ou quando a pessoa entregar um áudio novo.
---

# Narração

Só comece com o roteiro **aprovado** (confira no `andamento.md`). A voz é gerada pela pessoa, na conta dela do ElevenLabs. Você prepara o texto e, depois, o arquivo.

## Passo 1: o texto com tags

Crie `projetos/NNN. nome/audio/roteiro-tags.txt` a partir do `roteiro-falado.txt`. **O conteúdo é o mesmo, palavra por palavra.** Só muda a forma:

1. **Números por extenso**, do jeito que se fala:
   - `15 milhões` → `quinze milhões`
   - `44 horas` → `quarenta e quatro horas`
   - `R$ 21 mil` → `vinte e um mil reais`
   - `10%` → `dez por cento`
   - `3/5` → `três quintos`
   - `6x1` → `seis por um`
   - `1º de maio` → `primeiro de maio`
   - `2025` → `dois mil e vinte e cinco`
   - `art. 7º` → `artigo sétimo`
2. **Siglas e nomes difíceis** escritos como se falam, quando a voz costuma errar: `INSS` → `I-ene-esse-esse`, `BR` → `Bê-Érre`. Na dúvida, peça à pessoa para testar só essa frase antes do texto todo.
3. **Tags de emoção** do Eleven v3, entre colchetes, no começo da frase que muda de clima. Use poucas e com intenção:
   - `[intrigued]` para abrir mistério ou detalhe que pouca gente sabe;
   - `[curious]` para perguntas;
   - `[excited]` para a virada boa, a novidade;
   - `[serious]` para exceções e alertas. **No máximo 1 ou 2 por roteiro**: voz grave com muito `[serious]` fica pesada e sem vida;
   - `[warmly]` para o convite final de comentar;
   - `[casual]`, `[amused]`, `[playful]` para storytelling ("Eu tava conversando com um amigo...").
4. **Reticências** nos pontos de virada ajudam o ritmo: `Só que... não é de uma vez.`
5. **Parágrafos curtos**, um por bloco de ideia. Se uma parte sair ruim, a pessoa regera só aquele parágrafo.

Exemplo completo: `projetos/001. escala 6x1/audio/roteiro-tags.txt`. (A narração do molde, `narracao-norm.wav`, foi gerada de uma versão anterior desse texto, com `[serious]` em mais parágrafos. O arquivo de exemplo já está corrigido pela regra de no máximo 1 ou 2 `[serious]`.)

Confira antes de entregar: leia o `roteiro-tags.txt` lado a lado com o `roteiro-falado.txt`. Nenhuma palavra a mais ou a menos, só a escrita dos números e as tags.

## Passo 2: a pessoa gera a voz

Mande o texto do `roteiro-tags.txt` no chat, pronto para copiar, com estas instruções curtas:

1. Abra o ElevenLabs, em **Text to Speech**.
2. Escolha a sua voz (a da ficha do perfil em `projetos/_perfis.md`).
3. Configure: **modelo Eleven v3**, **velocidade 0,95**, **estabilidade 70**, **similaridade 90**. Se o modelo não mostrar algum desses controles, deixe esse no padrão.
4. Cole o texto e gere **uma vez só**. Cada geração gasta créditos (em geral, cerca de 1 crédito por caractere).
5. Ouça. Se uma frase saiu errada, gere de novo **só aquele parágrafo**.
6. Baixe o arquivo e coloque na pasta `projetos/NNN. nome/audio/` (ou me diga onde ele está).

Anote no `andamento.md`: "Etapa atual: 2. esperando a narração".

Se a pessoa tiver o conector do ElevenLabs ligado e preferir que você gere, explique que o conector pode não aplicar velocidade, estabilidade e similaridade, e que o resultado pode soar diferente. Se mesmo assim ela quiser, gere **uma variação só** (nunca várias).

## Passo 3: receber o arquivo

1. Ache o arquivo (na pasta `audio/` ou onde a pessoa disser). Se estiver em Downloads, **copie**, não mova.
2. Salve a cópia como `projetos/NNN. nome/audio/narracao-original.mp3` (ou `.wav`, conforme o arquivo veio). Nunca apague o arquivo da pessoa.
3. Se veio em partes (parágrafo regerado), junte na ordem certa:
   ```
   ffmpeg -y -i "projetos/NNN. nome/audio/parte 1.mp3" -i "projetos/NNN. nome/audio/parte 2.mp3" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" "projetos/NNN. nome/audio/narracao-original.mp3"
   ```
   Para trocar um trecho no meio, corte o original com `-ss` (início) e `-to` (fim) em pedaços, e junte os pedaços com o mesmo `concat` (mude `n=` para o número de partes).

## Passo 4: preparar o áudio

Um comando só, igual no Mac e no Windows:

```
ffmpeg -y -i "projetos/NNN. nome/audio/narracao-original.mp3" -af "atempo=1.2,loudnorm=I=-15:TP=-1.5:LRA=11" -ac 1 -ar 44100 "projetos/NNN. nome/audio/narracao-norm.wav"
```

O que ele faz, em português: deixa a fala 1,2 vez mais rápida sem mudar o tom da voz (`atempo`), iguala o volume no padrão de redes sociais (`loudnorm`, -15), e salva em mono, 44100 Hz.

Confira a duração:
```
ffprobe -v error -show_entries format=duration -of csv=p=0 "projetos/NNN. nome/audio/narracao-norm.wav"
```

## Critérios de qualidade

- Duração final entre 55 e 95 s. Fora disso, avise a pessoa antes de seguir.
- Ouça o começo (3 primeiros segundos): o gancho tem que estar claro e com energia.
- Sem silêncio longo no começo ou no fim (mais de 0,5 s). Se houver, corte com `-ss` e `-to` no mesmo comando do Passo 4.
- Sem palavra trocada ou cortada. Se houver, peça só o parágrafo de novo (Passo 2, item 5).

Pronto: atualize o `andamento.md` ("narração pronta, NN,N s") e siga para a skill **sincronizar**.
