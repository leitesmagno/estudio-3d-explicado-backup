#!/bin/zsh
# Baixa TUDO do e-TCM (2016 até hoje, todas as unidades) das cidades do lote, uma por vez, direto para o cofre do site.
# Pausa o robô se a memória livre cair abaixo de 20% e retoma acima de 28%. Pode parar e rodar de novo: retoma de onde parou.
R=~/Documents/SITE-EUMAGNOLEITE/build/robo
LOG=~/Documents/SITE-EUMAGNOLEITE/.cache/baixa_tudo.log
CIDADES=("NAZARE" "BUERAREMA" "FLORESTA AZUL" "GUARATINGA" "IBIRATAIA" "ITAGIBA" "ITAJU DO COLONIA" "ITAPEBI" "JUSSARI" "MASCOTE" "SANTA LUZIA" "SAO JOSE DA VITORIA" "UBATA" "PRESIDENTE TANCREDO NEVES" "BARRA DA ESTIVA" "BOTUPORA" "CACULE" "PIATA" "TANHACU" "SANTO AMARO" "CASTRO ALVES" "CATU" "DIAS D AVILA" "POJUCA" "PAULO AFONSO" "XIQUE XIQUE" "IBOTIRAMA" "CARINHANHA" "SERRA DO RAMALHO" "RIACHAO DAS NEVES" "SAO DESIDERIO" "ITABERABA" "IPIRA" "JAGUARARI" "MORRO DO CHAPEU" "RUY BARBOSA" "SENHOR DO BONFIM" "ENTRE RIOS" "RIACHAO DO JACUIPE" "MONTE SANTO")
livre() { memory_pressure | awk -F': ' '/free percentage/{gsub("%","",$2); print $2}'; }
cd "$R" || exit 1
for c in "${CIDADES[@]}"; do
  echo "=== $(date '+%d/%m %H:%M') COMEÇA $c" >> "$LOG"
  nice -n 10 node etcm-ba.mjs --municipio "$c" --tudo --anos 2016-2026 --nuvem >> "$LOG" 2>&1 &
  P=$!; parado=0
  while kill -0 $P 2>/dev/null; do
    l=$(livre)
    if [ $parado = 0 ] && [ "$l" -lt 20 ]; then pkill -STOP -P $P; kill -STOP $P; parado=1; echo "$(date '+%H:%M') pausa (memória livre $l%)" >> "$LOG"; fi
    if [ $parado = 1 ] && [ "$l" -gt 28 ]; then kill -CONT $P; pkill -CONT -P $P; parado=0; echo "$(date '+%H:%M') retoma (memória livre $l%)" >> "$LOG"; fi
    sleep 30
  done
  wait $P; echo "=== $(date '+%d/%m %H:%M') FIM $c (saída $?)" >> "$LOG"
done
echo "=== TODAS AS CIDADES TERMINARAM" >> "$LOG"
