#!/bin/zsh
# uso: refaz5.sh "CIDADE|Comp|pasta projeto|NOME.mp4" ...  -> render com cabeçalho novo + folhas + cópia para VIDEOS PRONTOS
cd ~/"Estúdio 3D Explicado"; L=projetos/_render.lock; T=tools/lista_pdf
for it in "$@"; do
  c=${it%%|*}; r=${it#*|}; comp=${r%%|*}; r=${r#*|}; proj=${r%%|*}; nome=${r#*|}
  dest="projetos/$proj/render-cabecalho"; mkdir -p "$dest"
  for tent in 1 2 3 4 5 6; do
    until [ ! -f "$L" ] && ! pgrep -f "[c]hrome-headless-shell" >/dev/null && ! pgrep -f "[l]ista_pdf.py aplicar" >/dev/null; do sleep 20; done
    echo "coordenador · render cabeçalho $c · $(date +%H:%M)" > "$L"; echo "=== $c render $(date +%H:%M) (tentativa $tent)"
    node scripts/render.mjs $comp "$dest" --nome="$nome" > "$dest/render.log" 2>&1; st=$?
    rm -f "$L"
    [ $st -eq 0 ] && break
    # erro de empacotamento (outra sessão com código pela metade no Root.tsx): espera 5 min e tenta de novo
    grep -q "empacotar\|runWebpack" "$dest/render.log" || break
    echo "   empacotamento falhou (código de outra sessão); nova tentativa em 5 min"; sleep 300
  done
  [ $st -eq 0 ] && [ -f "$dest/$nome" ] || { echo "ERRO render $c"; tail -4 "$dest/render.log"; continue; }
  python3 -I -c "
import json,sys
P=json.load(open(sys.argv[1])); cb=json.load(open(P['config_base'])); cb['entrada']=sys.argv[2]; json.dump(cb,open(P['config_base'],'w'),ensure_ascii=False,indent=1)" ~/Documents/RECEITAS-DESPESAS-$c/saida/params-setores.json "$PWD/$dest/$nome"
  $T/lote_coord.sh $c
  find "$TMPDIR" -maxdepth 1 -name 'remotion-webpack-bundle-*' -type d -mmin +1 -exec rm -rf {} + 2>/dev/null
  # regra 64: dá a vez às sessões que esperam a trava (Ilhéus, Itamaraju...) antes de pegar de novo
  sleep 150
done
echo FIM
