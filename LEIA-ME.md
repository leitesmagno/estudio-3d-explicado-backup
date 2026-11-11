# Estúdio 3D Explicado

Bem-vindo. Esta pasta é o seu estúdio de vídeos curtos explicativos em 3D, no formato vertical do Reels, TikTok e Shorts (1080 × 1920, 30 quadros por segundo).

Você não precisa saber programar. Quem pesquisa o tema, escreve o roteiro, monta as cenas em 3D, confere e gera o vídeo final é o **Claude Code**, trabalhando dentro desta pasta. Você aprova cada etapa, gera a narração na sua conta do ElevenLabs e publica.

Cada vídeo sai com três arquivos prontos para postar: o vídeo final, a capa e a legenda do post.

## Como começar (3 passos)

1. **Instale os programas** seguindo o guia do seu computador: "guia 2. instalação no mac" ou "guia 3. instalação no windows". Antes, leia o "guia 1. antes de começar" para saber o que você precisa ter e quanto custa cada coisa.
2. **Abra esta pasta no Claude Code.** No terminal, entre na pasta do Estúdio e digite `claude` (o guia de instalação mostra o caminho exato).
3. **Diga "oi".** O Claude cumprimenta, confere se está tudo instalado (e resolve com você o que faltar), ajuda a criar o estilo do seu perfil e pergunta qual vídeo vamos fazer.

Daí em diante é conversa. O "guia 4. seu primeiro vídeo" mostra o caminho completo, do tema ao vídeo postado.

## O vídeo molde

O Estúdio já vem com um vídeo real pronto, do perfil Explicando Direito: **001. escala 6x1** ("Aprovaram o fim da 6x1. Mas quando vale?").

- Projeto completo em `projetos/001. escala 6x1/` (roteiro, fontes, texto para a voz, narração, sincronia, plano de cenas).
- Código das cenas em `src/videos/escala6x1/`.
- Entrega em `edicoes/001. escala 6x1/` (video final.mp4, capa.jpg e legenda do post.txt).

Ele serve de exemplo do nível de qualidade esperado. Para ver o vídeo andando dentro do Estúdio, peça ao Claude: "abre a prévia do molde".

## Mapa das pastas

| Pasta ou arquivo | O que tem |
|---|---|
| `LEIA-ME.md` | este arquivo |
| `CLAUDE.md` e `.claude/skills/` | as instruções do Claude: o passo a passo de cada etapa do vídeo |
| `BASE-API.md` | o manual técnico da base 3D (o Claude lê antes de programar) |
| `AVISOS.md` | licenças e créditos das bibliotecas e fontes |
| `projetos/` | um projeto por vídeo (`NNN. nome`), com roteiro, áudio, plano e quadros de revisão; também as regras de qualidade (`_aprendizados.md`), os perfis (`_perfis.md`) e os arquivos do Estúdio (`_estudio/`: fontes, efeitos sonoros e galeria de peças) |
| `edicoes/` | os vídeos prontos para postar, com capa e legenda |
| `src/base/` | a base técnica: palco, câmera, legenda, som, área segura |
| `src/pecas/` | a biblioteca de peças 3D prontas (índice em `src/pecas/CATALOGO.md`) |
| `src/estilos/` | o estilo de cada perfil (cores, nome da série, assinatura) |
| `src/videos/` | o código de cada vídeo |
| `scripts/` | gerar o vídeo final e os quadros de revisão |
| `tools/` | transcrever a narração e alinhar ao roteiro |

Não apague nem mova as pastas `src/`, `scripts/`, `tools/` e `projetos/_estudio/`.

## Licença (resumo)

- **Licença pessoal.** Sua compra dá direito de usar o Estúdio para produzir vídeos para os **seus próprios perfis**, inclusive perfis que vendem, divulgam serviço ou são monetizados.
- **Licença comercial vendida à parte.** Para produzir vídeos para outras pessoas ou empresas e cobrar por isso (agência, freelancer, cliente), é preciso a Licença Comercial do Estúdio 3D Explicado.
- **Não redistribua.** Não é permitido revender, compartilhar, publicar ou entregar a terceiros esta pasta, o código, as instruções, as peças ou os guias, no todo ou em parte, de graça ou pago.
- Os vídeos que você faz são seus.
- Serviços de terceiros têm regras próprias: o ElevenLabs exige plano pago para uso comercial da voz, e o Remotion é gratuito para pessoa física e para empresas com até 3 pessoas (empresas maiores precisam da licença de empresa do Remotion). Detalhes no guia 1 e no guia 7.

## Créditos

O código da base, os scripts, as ferramentas e os efeitos sonoros foram feitos do zero para o Estúdio. O Estúdio usa Remotion, three.js, React, @react-three/fiber, postprocessing e faster-whisper, e traz as fontes Inter e JetBrains Mono (SIL Open Font License). A lista completa, com as licenças de cada um, está em `AVISOS.md`.
