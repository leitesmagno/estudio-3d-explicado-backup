#!/bin/zsh
# uso: render_coord.sh "Comp|pasta destino|nome.mp4" ...
cd ~/"Estúdio 3D Explicado"; L=projetos/_render.lock
for it in "$@"; do
  comp=${it%%|*}; rest=${it#*|}; dest=${rest%%|*}; nome=${rest#*|}
  until [ ! -f "$L" ] && ! pgrep -f "[c]hrome-headless-shell" >/dev/null && ! pgrep -f "[l]ista_pdf.py aplicar" >/dev/null; do sleep 20; done
  echo "coordenador · render $comp · $(date +%H:%M)" > "$L"
  echo "=== $comp $(date +%H:%M)"
  node scripts/render.mjs $comp "$dest" --nome="$nome" > "/private/tmp/claude-501/-Users-magnoleite/4fe2e4ba-8d0e-4666-8ff8-f8a6734859e0/scratchpad/render_$comp.log" 2>&1; st=$?
  rm -f "$L"
  f="$dest/$nome"; [ $st -eq 0 ] && [ -f "$f" ] && echo "OK $comp $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")s" || { echo "ERRO $comp"; tail -5 "/private/tmp/claude-501/-Users-magnoleite/4fe2e4ba-8d0e-4666-8ff8-f8a6734859e0/scratchpad/render_$comp.log"; }
done
echo FIM
