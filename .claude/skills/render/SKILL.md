---
name: render
description: Etapa 7 do Estúdio 3D Explicado. Gera o vídeo final com scripts/render.mjs (imagem em partes, áudio juntado no fim), acompanha o progresso e a memória, retoma de onde parou se travar e confere o resultado (quadros, emendas e volume) com ffprobe e ffmpeg. Use depois da revisão aprovada. Ao terminar, segue direto para capa e legenda.
---

# Vídeo final

Só comece com a revisão **aprovada** (ou com "seguir sem pausas" anotado no `andamento.md`).

## Como o render funciona (para explicar à pessoa em uma frase)

"Vou gerar o vídeo em partes, para não pesar o computador, e no fim juntar as partes com a narração e os efeitos." Diga quanto deve levar: depende muito do computador. Com placa de vídeo, em geral de 1 a 3 minutos por parte de 800 quadros; sem placa de vídeo (renderização por software) pode levar alguns segundos por quadro, ou seja, horas para um vídeo de 85 s. Tire 2 quadros com o `quadros.mjs` antes e cronometre para estimar.

Regras que já nos salvaram:
- **Nunca** gere o vídeo 3D inteiro de uma vez num navegador só, nem com o áudio feito pelo navegador. Isso já travou um computador. Use sempre o `scripts/render.mjs`, que divide em partes e junta o áudio no fim com ffmpeg. Não troque por `npx remotion render` direto.
- **Nunca** recomece um render travado do zero: o `render.mjs` aproveita as partes prontas.

## Passo 1: preparar

1. Feche processos de render que ficaram abertos de antes. **Peça o ok** antes:
   - Mac: `pkill -f chrome-headless-shell`
   - Windows: `taskkill /F /IM chrome-headless-shell.exe`
   (Se não houver nenhum aberto, o comando só avisa que não achou. Tudo bem.)
2. Confira se a narração existe: `projetos/NNN. nome/audio/narracao-norm.wav`.
3. Peça para a pessoa fechar programas pesados, se o computador for mais simples.

## Passo 2: gerar

```
node scripts/render.mjs <Nome> "edicoes/NNN. nome"
```

As partes ficam em `edicoes/NNN. nome/.partes <Nome>/` (`parte 001.mp4`, `parte 002.mp4`...), cada uma com um arquivo `.ok` quando termina. Opções (BASE-API.md, seção 15): `--quadros-por-parte=400` (menos memória), `--parte=K` (refaz só a parte K), `--refazer`, `--so-video`, `--navegador=<caminho>`, `--gl=angle|swangle|egl`.

Enquanto roda:
- **Mostre o progresso.** O script escreve linhas com a porcentagem de cada parte. Não esconda essas linhas; a pessoa costuma gostar de acompanhar. Resuma de tempos em tempos: "Parte 2 de 3: 60%".
- **Vigie a memória.** Se o script mostrar memória acima de 6 GB, ou o computador ficar muito lento, interrompa, apague a pasta `.partes <Nome>` (ou use `--refazer`) e rode de novo com `--quadros-por-parte=400`. Sem mudar o tamanho das partes, rodar de novo continua das partes prontas.
- **Vídeo mudo?** O som sai da prop `faixas` da composição (lista `FAIXAS` do vídeo). Se o script avisar que não há faixas, confira o registro em `src/Root.tsx`.
- Se parar com erro, leia a mensagem. Erro em uma cena específica: corrija o código, gere de novo **só a parte afetada** (veja no BASE-API.md como) e junte.

Saída: `edicoes/NNN. nome/video final.mp4`.

## Passo 3: conferir o vídeo

1. **Quadros certos** (tem que dar o total anotado no `andamento.md`):
   ```
   ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "edicoes/NNN. nome/video final.mp4"
   ```
2. **Duração** (áudio + 0,9 s):
   ```
   ffprobe -v error -show_entries format=duration -of csv=p=0 "edicoes/NNN. nome/video final.mp4"
   ```
3. **Volume**:
   ```
   ffmpeg -hide_banner -i "edicoes/NNN. nome/video final.mp4" -af volumedetect -f null -
   ```
   Procure `mean_volume` e `max_volume` no fim da saída. Bom: média entre -20 e -16 dB e pico abaixo de -1 dB. Os nossos vídeos ficaram por volta de -18 dB de média e -2 a -3 dB de pico. Fora disso, ajuste o volume da trilha ou dos efeitos (BASE-API.md) e junte de novo.
4. **Emendas** entre as partes: ficam a cada 800 quadros (26,67 s, 53,33 s, 80 s com o tamanho padrão). Tire um quadro logo antes e um logo depois de cada emenda e olhe. Não pode haver salto de imagem nem quadro repetido. Exemplo (troque o tempo pelo da emenda):
   ```
   ffmpeg -y -ss 26.63 -i "edicoes/NNN. nome/video final.mp4" -frames:v 1 "projetos/NNN. nome/revisao/emenda 1 antes.jpg"
   ffmpeg -y -ss 26.70 -i "edicoes/NNN. nome/video final.mp4" -frames:v 1 "projetos/NNN. nome/revisao/emenda 1 depois.jpg"
   ```
5. Abra o início (3 s) e o fim (5 s) em quadros e confira o gancho e a assinatura.

## Passo 4: seguir sem perguntar

- Anote no `andamento.md`: "vídeo final pronto", data, partes, tempo por parte, volume médio e pico.
- Registre no `_aprendizados.md` qualquer problema novo de render e a solução.
- **Sem perguntar**, siga para a skill **capa-e-legenda** e entregue tudo junto: vídeo, capa e legenda.
