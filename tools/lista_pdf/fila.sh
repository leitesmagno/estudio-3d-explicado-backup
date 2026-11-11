#!/bin/zsh
# Fila das folhas "PDF": processa ~/Documents/PARA O DRIVE - com folha PDF/_fila/*.json (um por vez),
# respeitando projetos/_render.lock e renders do Chrome. Termina quando existir _fila/FIM e não houver mais nada.
E="/Users/magnoleite/Estúdio 3D Explicado"
Q="$HOME/Documents/PARA O DRIVE - com folha PDF/_fila"
L="$E/projetos/_render.lock"
mkdir -p "$Q/feitos"
while true; do
  next=$(ls "$Q"/*.json 2>/dev/null | head -1)
  if [ -z "$next" ]; then
    [ -f "$Q/FIM" ] && { echo "fila terminada $(date +%H:%M)"; exit 0; }
    sleep 20; continue
  fi
  # espera a trava e qualquer render do Chrome
  while [ -f "$L" ] || [ $(pgrep -f "[c]hrome-headless-shell" | wc -l) -gt 0 ]; do sleep 30; done
  echo "folha PDF · $(basename "$next") · $(date +%H:%M)" > "$L"
  echo ">>> $(basename "$next") $(date +%H:%M)"
  if python3 -I "$E/tools/lista_pdf/lista_pdf.py" aplicar "$next" 2>&1 | grep -v notas; then
    mv "$next" "$Q/feitos/"
  else
    mv "$next" "$Q/feitos/ERRO-$(basename "$next")"
  fi
  rm -f "$L"
done
