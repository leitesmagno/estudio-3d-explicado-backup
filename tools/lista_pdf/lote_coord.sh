#!/bin/zsh
# uso: lote_coord.sh CIDADE1 CIDADE2 ...  (pastas RECEITAS-DESPESAS-<CIDADE>)
T=~/"Estúdio 3D Explicado/tools/lista_pdf"; L=~/"Estúdio 3D Explicado/projetos/_render.lock"; AP=~/Documents/"VIDEOS PRONTOS - FOLHA POR SETOR"
for c in "$@"; do
  D=~/Documents/RECEITAS-DESPESAS-$c
  echo "=== $c $(date +%H:%M)"
  python3 -I $T/atualiza_params.py $D > $D/saida/atualiza.log 2>&1 || { echo "ERRO params $c"; continue; }; cat $D/saida/atualiza.log
  python3 -I $T/setor_folhas.py $D/saida/params-setores.json > $D/saida/setor_folhas.log 2>&1 || { echo "ERRO setor_folhas $c"; tail -3 $D/saida/setor_folhas.log; continue; }
  until [ ! -f "$L" ] && ! pgrep -f "[c]hrome-headless-shell" >/dev/null && ! pgrep -f "[l]ista_pdf.py aplicar" >/dev/null; do sleep 20; done
  echo "coordenador · folhas $c · $(date +%H:%M)" > "$L"
  python3 -I $T/lista_pdf.py aplicar $D/saida/folha-pdf/config-setores.json > $D/saida/aplicar.log 2>&1
  rm -f "$L"
  out=$(grep "^ok " $D/saida/aplicar.log | sed -E 's/^ok (.*\.mp4) .*/\1/')
  if [ -n "$out" ] && [ -f "$out" ]; then cp -p "$out" "$AP/"; echo "OK $c -> $(basename "$out") $(grep '^ok' $D/saida/aplicar.log | awk '{print $NF}')"; else echo "ERRO aplicar $c"; tail -3 $D/saida/aplicar.log; fi
done
echo FIM
