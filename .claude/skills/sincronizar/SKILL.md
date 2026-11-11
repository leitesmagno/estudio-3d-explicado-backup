---
name: sincronizar
description: Etapa 3 do Estúdio 3D Explicado. Transcreve a narração palavra por palavra com tools/transcrever.py (faster_whisper), corrige o que o Whisper ouviu errado e alinha ao roteiro com tools/alinhar_roteiro.py, gerando src/videos/<codigo>/palavras.ts com o tempo exato de cada palavra. Use logo depois de preparar audio/narracao-norm.wav.
---

# Sincronizar fala e texto

É esta etapa que faz cada objeto entrar na hora exata da palavra. O `palavras.ts` é o relógio do vídeo: as cenas leem dele com `quando()`.

Precisa de: `projetos/NNN. nome/audio/narracao-norm.wav` e `projetos/NNN. nome/audio/roteiro-falado.txt` (aprovado).

**Python do Estúdio:** no Mac `.venv/bin/python`, no Windows `.venv/Scripts/python`. Os exemplos abaixo usam o do Mac; no Windows troque só esse começo. Os argumentos mostrados são o formato padrão; se o BASE-API.md mostrar outro, vale o BASE-API.md.

## Passo 1: transcrever

```
.venv/bin/python tools/transcrever.py "projetos/NNN. nome"
```

O script usa o `roteiro-falado.txt` como dica de vocabulário. Opções úteis: `--modelo small` em computador mais simples, `--idioma pt` (padrão). Se já existir um `palavras.json`, ele guarda o antigo como `palavras-anterior.json`.

Saída em `projetos/NNN. nome/transcricao/`:
- `palavras.json`: cada palavra com início e fim em segundos;
- `transcript.md`: o texto por frases, com o tempo de cada uma (bom para ler rápido).

Avise a pessoa: leva de 1 a 5 minutos, dependendo do computador. Na primeira vez também baixa o modelo.

## Passo 2: conferir a transcrição

Leia o `transcript.md` ao lado do `roteiro-falado.txt`. Problemas que já vimos e como tratar:

| O Whisper fez | Exemplo | O que fazer |
|---|---|---|
| Escreveu o número do jeito falado | "6 por 1", "12 por 36", "três quintos", "21 mil reais" | normal; o alinhamento troca pela escrita do roteiro (`6x1`, `12x36`, `3/5`, `R$ 21 mil`) |
| Pôs "R$" onde não é dinheiro | "R$ 3,6 milhões de MEIs" | corrigir no `palavras.json` |
| Quebrou um valor em pedaços | "R", "$", "3", ",6" | juntar os pedaços numa palavra só, com o início do primeiro e o fim do último |
| Errou a grafia | "recapiamento", "tapa buraco" | normal; a legenda segue o roteiro |
| Inventou fala no fim | repetiu uma frase no último meio segundo | apagar essas palavras falsas do `palavras.json` |
| Palavra com duração zero | início = fim | aceitável; se for gatilho de cena, use a palavra vizinha no `quando()` |
| A voz pulou ou trocou uma palavra | falta uma frase inteira | parar e voltar para a skill **narracao** (regerar só aquele parágrafo) |

Antes de mexer no `palavras.json`, **guarde uma cópia** como `transcricao/palavras-original.json`. Nunca edite sem a cópia.

## Passo 3: alinhar ao roteiro

```
.venv/bin/python tools/alinhar_roteiro.py "projetos/NNN. nome" <codigo>
```

Ele junta o tempo do Whisper com as palavras exatas do roteiro e escreve `src/videos/<codigo>/palavras.ts` (cria a pasta se não existir). Esse arquivo não se edita à mão: se precisar mudar, corrija o `palavras.json` ou o roteiro e rode de novo.

Se o roteiro tiver uma grafia feita para a voz que não deve ir para a legenda, passe pares `"falado=>legenda"` no fim do comando (ex.: `"Píquis=>Pix"`). O script mostra no fim: número de palavras do roteiro, da transcrição e do `palavras.ts`, a última palavra com o tempo, as pausas maiores que 1,5 s e os trechos duvidosos.

Exemplo real (o molde): `.venv/bin/python tools/alinhar_roteiro.py "projetos/001. escala 6x1" escala6x1` dá 252 palavras, a última ("vida.") termina em 83,54 s, para um áudio de 83,78 s.

## Passo 4: conferir o resultado

Critérios para aprovar a sincronia (você mesmo confere, a pessoa não precisa):

1. O número de palavras do `palavras.ts` é igual ao do `roteiro-falado.txt` (o script mostra; se não mostrar, conte).
2. A última palavra termina perto do fim do áudio (diferença de até 0,5 s da duração medida na etapa **narracao**).
3. Os tempos sempre sobem: nenhuma palavra começa antes da anterior.
4. Nenhum buraco maior que 1,5 s entre palavras, a não ser pausa de verdade na fala.
5. Abra 3 pontos ao acaso (começo, meio, fim) e compare o tempo com o `transcript.md`.

Se o alinhador avisar que não achou trechos, leia o aviso: quase sempre é palavra do roteiro que a voz falou diferente. Corrija o `palavras.json` (Passo 2) e rode de novo.

## Passo 5: anotar para o plano

Calcule e anote no `andamento.md`:
- duração do áudio (s) e **total de quadros** = arredondar((duração + 0,9) × 30). Os 0,9 s são a folga do final. No código, isso vira `AUDIO_SEG` e `QUADROS` no topo do `<Nome>.tsx`, como no molde.
- número de palavras e o tempo da última.
- ajustes feitos (o que foi corrigido no `palavras.json`).
- **palavras repetidas**: liste as palavras-chave que aparecem mais de uma vez e o tempo de cada ocorrência. O `quando()` pega a primeira vez que o trecho aparece; para as outras, use um trecho único (`quando('E você já')`) ou a ocorrência (`quando('6x1', 2)`). Essa lista entra no plano.

Pronto: siga para a skill **plano-de-cenas**.
