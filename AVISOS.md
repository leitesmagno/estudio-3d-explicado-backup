# Avisos e licenças

## Código do Estúdio
Todo o código de `src/base/`, `scripts/` e `tools/` foi escrito do zero para o Estúdio 3D Explicado.
As ferramentas `tools/transcrever.py` e `tools/alinhar_roteiro.py` são implementações próprias
(o alinhamento usa programação dinâmica sobre a biblioteca padrão do Python; a transcrição usa a
biblioteca faster-whisper). Nenhum trecho de código de terceiros foi copiado para esses arquivos.

Os efeitos sonoros de `projetos/_estudio/sons/` são sintetizados por `tools/gerar_sons.py` e não
vêm de bancos de áudio de terceiros.

## Bibliotecas usadas (instaladas pelo npm e pelo pip, não incluídas aqui)
- **Remotion** (`remotion`, `@remotion/*`): licença própria. É gratuito para pessoas físicas e para
  empresas pequenas (até 3 pessoas); empresas maiores precisam de uma licença de empresa.
  Leia https://remotion.dev/license antes de usar comercialmente.
- **three.js**: licença MIT.
- **@react-three/fiber**, **@react-three/postprocessing**, **postprocessing**, **n8ao**: licença MIT.
- **React**: licença MIT.
- **faster-whisper**: licença MIT. Os modelos Whisper (OpenAI) também são MIT.

## Fontes (incluídas)
- **Inter** (The Inter Project Authors) e **JetBrains Mono** (The JetBrains Mono Project Authors),
  ambas sob a SIL Open Font License 1.1. Os arquivos de licença estão em `projetos/_estudio/fontes/`.
  Os arquivos .woff2 vêm dos pacotes `@fontsource-variable/inter` e `@fontsource-variable/jetbrains-mono`.
