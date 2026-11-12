#!/bin/zsh
# 136 Condeúba: voz Google Chirp 3 HD Algenib (speakingRate 1,3), um arquivo por parágrafo, junta com 0,35 s de silêncio,
# encurta pausas para 0,28 s, (atempo opcional = $1) e normaliza (loudnorm -15,5), mono 44100 Hz -> narracao-norm.wav. Regra 101: nice e 2 threads.
set -e
source ~/.zshrc >/dev/null 2>&1 || true
A="/Users/magnoleite/Estúdio 3D Explicado/projetos/136. orçamento de condeúba/audio"; cd "$A"
AT=${1:-1.0}
python3 /Users/magnoleite/Documents/RECEITAS-DESPESAS-CONDEUBA/scripts/voz_texto.py roteiro-falado.txt texto-voz-google.txt
sed -i '' -e 's/o FPM/o efe, pê, eme/g' -e 's/IPTU/i, pê, tê, u/g' texto-voz-google.txt
mkdir -p partes-google
[ -f partes-google/p01.wav ] || python3 tts.py texto-voz-google.txt partes-google
nice -n 15 ffmpeg -v error -y -f lavfi -i anullsrc=r=24000:cl=mono -t 0.35 sil.wav
rm -f lista.txt; for f in partes-google/p*.wav; do echo "file '$f'" >> lista.txt; echo "file 'sil.wav'" >> lista.txt; done
nice -n 15 ffmpeg -v error -y -f concat -safe 0 -i lista.txt -threads 2 -ac 1 -ar 24000 junto.wav
nice -n 15 python3 encurtar_pausas.py junto.wav curto.wav 0.28
nice -n 15 ffmpeg -v error -y -i curto.wav -threads 2 -af "atempo=${AT},loudnorm=I=-15.5:TP=-1.5:LRA=11" -ac 1 -ar 44100 narracao-norm.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 narracao-norm.wav
