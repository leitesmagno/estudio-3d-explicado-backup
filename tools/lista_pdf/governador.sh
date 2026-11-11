#!/bin/zsh
# Governador de memória do lote (regra 93). A cada 60 s mede a memória livre, o swap e quanto cada grupo usa
# (abas do Claude, Chrome, render/Remotion, Python) e grava em projetos/_memoria.md.
# Sai (e assim avisa o coordenador) quando:
#   ALERTA   -> memória livre < 20%, ou swap livre < 700 MB junto com livre < 30%, por 3 medições seguidas
#               (o macOS cria e apaga arquivos de swap sozinho; swap baixo com muita memória livre não é problema);
#   FOLGA    -> memória livre >= 38% e swap livre >= 1000 MB, por 5 medições seguidas (dá para liberar mais uma cidade).
# Uso: governador.sh [alerta|folga|ambos]   (padrão: ambos)
P=~/"Estúdio 3D Explicado/projetos"; OUT="$P/_memoria.md"; MODO=${1:-ambos}
ruim=0; bom=0
while true; do
  livre=$(memory_pressure | awk -F': ' '/free percentage/{gsub("%","",$2); print $2}')
  swapl=$(sysctl -n vm.swapusage | sed -E 's/.*free = ([0-9.]+)M.*/\1/' | cut -d. -f1)
  grupos=$(ps -axo rss=,args= | awk '{
      a=$0; r=$1; k="outros";
      if (a ~ /Claude\.app|claude-code|\/claude /) k="abas do Claude";
      else if (a ~ /Google Chrome|chrome-headless|Chromium/) k="Chrome (e-TCM e render)";
      else if (a ~ /remotion|render\.mjs|quadros\.mjs|node /) k="render/Remotion (node)";
      else if (a ~ /[Pp]ython/) k="Python (site, leitores)";
      s[k]+=r } END { for (k in s) printf "%s: %.0f MB; ", k, s[k]/1024 }')
  render=$([ -e "$P/_render.lock" ] && head -c 60 "$P/_render.lock" | tr '\n' ' ' || echo "livre")
  printf "# Memória do Mac (atualizado %s)\n\n- Livre: %s%%\n- Swap livre: %s MB\n- Render: %s\n- Por grupo: %s\n" \
    "$(date '+%d/%m %H:%M:%S')" "$livre" "$swapl" "$render" "$grupos" > "$OUT"
  echo "$(date '+%H:%M') livre=$livre% swap_livre=${swapl}MB render=$render | $grupos" >> "$P/_memoria.log"
  if [ "$livre" -lt 20 ] || { [ "$swapl" -lt 700 ] && [ "$livre" -lt 30 ]; }; then ruim=$((ruim+1)); else ruim=0; fi
  if [ "$livre" -ge 38 ] && [ "$swapl" -ge 1000 ]; then bom=$((bom+1)); else bom=0; fi
  if [ "$MODO" != folga ] && [ $ruim -ge 3 ]; then echo "ALERTA: memória livre $livre%, swap livre ${swapl} MB. $grupos"; exit 0; fi
  if [ "$MODO" != alerta ] && [ $bom -ge 5 ]; then echo "FOLGA: memória livre $livre%, swap livre ${swapl} MB. Dá para liberar mais uma cidade."; exit 0; fi
  sleep 60
done
