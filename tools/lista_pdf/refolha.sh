#!/bin/zsh
# Regra 71: reaplica SÓ a camada das folhas (margem lateral 90 px, escala 0,58) num vídeo pronto, sem mexer em voz/3D.
# uso: refolha.sh "NOME|caminho/config-setores.json" ...
# Guarda a versão anterior em "VIDEOS PRONTOS - versões antigas (não usar)/NOME (folha cortada).mp4",
# troca o mp4 em VIDEOS PRONTOS e as cópias nas pastas 1/2 de Documentos.
cd ~/"Estúdio 3D Explicado"; L=projetos/_render.lock
V=~/Documents/"VIDEOS PRONTOS - FOLHA POR SETOR"; ANT=~/Documents/"VIDEOS PRONTOS - versões antigas (não usar)"
P1=~/Documents/"1 - SUBSTITUIR NO DRIVE (vídeos refeitos)"; P2=~/Documents/"2 - NOVOS PRONTOS PARA PUBLICAR"
TMPD=/private/tmp/claude-501/-Users-magnoleite/4fe2e4ba-8d0e-4666-8ff8-f8a6734859e0/scratchpad/refolha; mkdir -p "$TMPD" "$ANT"
for it in "$@"; do
  n=${it%%|*}; cfg=${it#*|}
  until [ ! -f "$L" ] && ! pgrep -f "[c]hrome-headless-shell" >/dev/null && ! pgrep -f "[l]ista_pdf.py aplicar" >/dev/null; do sleep 20; done
  echo "coordenador · refolha $n · $(date +%H:%M)" > "$L"; echo "=== $n $(date +%H:%M)"
  novo="$TMPD/$n.mp4"; c2="$TMPD/$n.config.json"
  python3 -I -c "
import json,sys
c=json.load(open(sys.argv[1])); c['saida']=sys.argv[2]; c.pop('escala',None); c['pasta_tmp']=sys.argv[3]
json.dump(c,open(sys.argv[4],'w'),ensure_ascii=False,indent=1)" "$cfg" "$novo" "$TMPD/tmp-$n" "$c2"
  python3 -I tools/lista_pdf/lista_pdf.py aplicar "$c2" > "$TMPD/$n.log" 2>&1; st=$?
  rm -f "$L"
  if [ $st -ne 0 ] || [ ! -f "$novo" ]; then echo "ERRO $n"; tail -3 "$TMPD/$n.log"; continue; fi
  [ -f "$V/$n.mp4" ] && [ ! -f "$ANT/$n (folha cortada).mp4" ] && mv "$V/$n.mp4" "$ANT/$n (folha cortada).mp4"
  mv "$novo" "$V/$n.mp4"
  [ -f "$P1/$n.mp4" ] && rm -f "$P1/$n.mp4" && cp -c "$V/$n.mp4" "$P1/$n.mp4"
  [ -d "$P2/$n" ] && rm -f "$P2/$n/$n.mp4" && cp -c "$V/$n.mp4" "$P2/$n/$n.mp4"
  PP=~/Documents/"$n - vídeo, capa e legenda"; [ -d "$PP" ] && rm -f "$PP/$n.mp4" && cp -c "$V/$n.mp4" "$PP/$n.mp4"
  echo "OK $n $(date +%H:%M)"
  sleep ${PAUSA:-150}   # regra 64: dá a vez às sessões (PAUSA=0 quando só há correção)
done
echo FIM
