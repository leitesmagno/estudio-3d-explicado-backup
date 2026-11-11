---
name: instalar
description: Prepara o computador para o Estúdio 3D Explicado (Mac ou Windows). Instala ou confere Node.js, npm, Python, ffmpeg, as dependências do projeto (node_modules) e o faster_whisper num ambiente Python próprio (.venv). Use na primeira vez que a pessoa abre o Estúdio ou quando a checagem do início da sessão acusar que falta algo.
---

# Instalar

Objetivo: deixar tudo pronto sem a pessoa precisar entender nada de programação. Você conduz, ela só autoriza.

## Antes de começar

- Diga em uma frase o que vai fazer: "Vou conferir e instalar os programas que o Estúdio usa. Leva de 5 a 20 minutos, dependendo da internet."
- Descubra o sistema: `node -e "console.log(process.platform)"` (`darwin` = Mac, `win32` = Windows). Se o node ainda não existir, pergunte: "Seu computador é Mac ou Windows?"
- Peça o ok antes de instalar cada programa do sistema (Node, Python, ffmpeg). Dependências dentro da pasta do Estúdio (`npm install`, `.venv`) podem ser instaladas direto, avisando.

## Passo 1: conferir o que já existe

Rode e anote o resultado de cada um:

```
node -v
npm -v
python3 --version          (Windows: python --version)
ffmpeg -version
```

Critérios: macOS 15 (Sequoia) ou mais novo no Mac (exigência do Remotion; em versão mais antiga, avise a pessoa com calma que o render não é suportado), Windows 10 ou 11. Node 18 ou mais novo (de preferência a versão LTS mais recente). Python 3.10 a 3.14 (a 3.15 ainda não funciona com o faster_whisper; prefira a 3.12). ffmpeg qualquer versão recente com `loudnorm` e `atempo` (as versões oficiais têm).

## Passo 2: instalar o que falta

### Mac

1. Confira se o Homebrew existe: `brew -v`. Se não existir, explique que é o "instalador de programas" do Mac e peça para a pessoa colar no Terminal o comando oficial do site https://brew.sh (ele pede a senha do computador; você não deve pedir nem ver a senha).
2. Instale o que faltar:
   ```
   brew install node
   brew install python@3.12
   brew install ffmpeg
   ```

### Windows

1. Use o `winget` (já vem no Windows 10 e 11):
   ```
   winget install OpenJS.NodeJS.LTS
   winget install Python.Python.3.12
   winget install Gyan.FFmpeg
   ```
2. Depois de instalar, o Windows só reconhece os programas novos num terminal novo. Peça para a pessoa **fechar e abrir de novo** o Claude Code nesta pasta e rode a checagem do Passo 1 outra vez.
3. Se o `python` abrir a Microsoft Store em vez de rodar, a instalação do Python não entrou no PATH: rode `winget install Python.Python.3.12` de novo ou peça para a pessoa marcar "Add python.exe to PATH" no instalador do site python.org.

## Passo 3: dependências do projeto

Na pasta do Estúdio:

```
npm install
```

Pode levar alguns minutos na primeira vez. Confira no fim: `node -e "console.log(require('fs').existsSync('node_modules'))"` tem que dar `true`.

## Passo 4: Python do Estúdio com faster_whisper

O faster_whisper (que transcreve a narração palavra por palavra) fica num ambiente só do Estúdio, a pasta `.venv`, para não mexer no Python do sistema.

### Mac
Use `python3.12` (o `python3` do Mac costuma ser o 3.9 da Apple). Se `python3.12` não existir, use a versão instalada pelo Homebrew (`ls /opt/homebrew/bin/python3.*`).
```
python3.12 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r tools/requirements.txt
.venv/bin/python -c "import faster_whisper; print('ok')"
```

### Windows
```
python -m venv .venv
.venv/Scripts/python -m pip install --upgrade pip
.venv/Scripts/python -m pip install -r tools/requirements.txt
.venv/Scripts/python -c "import faster_whisper; print('ok')"
```

Avise: na **primeira transcrição** o faster_whisper baixa o modelo de voz da internet. Isso acontece uma vez só e pode levar alguns minutos.

O `tools/requirements.txt` traz o faster-whisper na versão testada com o Estúdio. Os outros scripts Python (`alinhar_roteiro.py`, `gerar_sons.py`) só usam a biblioteca padrão.

## Passo 5: teste rápido

1. `npx remotion versions` mostra as versões do Remotion sem erro.
2. `npx tsc --noEmit` termina sem erro (se der erro em `src/videos/`, não é problema de instalação; anote e siga).
3. Abra a prévia para a pessoa ver que funciona: `npm run studio` (é o mesmo que `npx remotion studio`). Diga que abre no navegador e que ela pode fechar quando quiser (no terminal, Ctrl+C). Na lista da esquerda aparecem as composições: `Exemplo`, `Catalogo`, `AmostraEstilo` e o molde `Escala6x1`.
4. Na primeira vez, o Remotion baixa um navegador próprio para gerar imagens. Se a internet bloquear esse download, aponte um Chrome instalado (veja a última linha do `remotion.config.ts` e a opção `--navegador=` dos scripts no BASE-API.md).

## Passo 6: fechar

- Diga em uma ou duas frases o que foi instalado e que está tudo pronto.
- Se ainda não houver perfil em `projetos/_perfis.md`, ofereça a skill **estilo**.
- Se nada mais faltar, volte ao início da sessão: "Vamos fazer um vídeo novo ou continuar um projeto?"

## Problemas comuns

| Sintoma | O que fazer |
|---|---|
| `npm install` falha com erro de permissão no Mac | não use `sudo`; confira se a pasta do Estúdio está dentro da pasta do usuário (Documentos, Mesa) e não num disco protegido |
| `pip install faster-whisper` falha no Windows | confira se o Python é 3.10 a 3.12 (`python --version`); versões muito novas às vezes ainda não têm os pacotes prontos |
| `ffmpeg` não encontrado logo depois de instalar no Windows | terminal antigo: feche e abra o Claude Code de novo |
| Mac reclama de "desenvolvedor não identificado" | peça para a pessoa liberar em Ajustes do Sistema, Privacidade e Segurança; nunca desligue a proteção do sistema |

Nunca peça, leia ou salve senha do computador. Quem digita senha é a pessoa, direto no terminal ou na janela do sistema.
