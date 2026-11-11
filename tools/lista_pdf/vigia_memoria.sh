#!/bin/zsh
# Regra 63 (Magno, 09/11/2026): "quando ver que vai começar a travar, volte atrás para não travar".
# Vigia a memória livre do Mac. Se cair abaixo de 12% (ou swap > 4 GB com menos de 25% livre), SEGURA a trava de render
# (projetos/_render.lock com "PAUSA memória") assim que ela estiver livre: nenhum render novo começa,
# o que está rodando termina. Solta a trava quando a memória livre voltar a 25%.
# Uso: vigia_memoria.sh            (loop infinito)
#      vigia_memoria.sh --alerta   (sai na primeira vez que a memória ficar crítica, para avisar o coordenador)
L=~/"Estúdio 3D Explicado/projetos/_render.lock"
LOG=~/"Estúdio 3D Explicado/projetos/_vigia-memoria.log"
livre() { memory_pressure -Q 2>/dev/null | awk -F': ' '/free percentage/ {gsub("%","",$2); print $2}'; }
swapmb() { sysctl -n vm.swapusage | awk '{gsub("M","",$6); print int($6)}'; }
segurando=0
while true; do
  f=$(livre); s=$(swapmb); [ -z "$f" ] && f=50
  if [ "$1" = "--alerta" ]; then
    if [ "$f" -lt 12 ] || { [ "$s" -gt 4096 ] && [ "$f" -lt 25 ]; }; then echo "$(date +%H:%M) CRÍTICO: memória livre ${f}%, swap ${s} MB"; exit 0; fi
    sleep 60; continue
  fi
  if [ $segurando -eq 0 ] && { [ "$f" -lt 12 ] || { [ "$s" -gt 4096 ] && [ "$f" -lt 25 ]; }; }; then
    if [ ! -f "$L" ]; then
      echo "PAUSA memória (vigia) · $(date +%H:%M)" > "$L"; segurando=1
      echo "$(date +%H:%M) pausa: memória livre ${f}%, swap ${s} MB" >> "$LOG"
    fi
  elif [ $segurando -eq 1 ] && [ "$f" -ge 25 ]; then
    grep -q "PAUSA memória" "$L" 2>/dev/null && rm -f "$L"; segurando=0
    echo "$(date +%H:%M) retomou: memória livre ${f}%, swap ${s} MB" >> "$LOG"
  fi
  sleep 30
done
