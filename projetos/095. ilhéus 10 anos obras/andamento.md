# 095. Ilhéus 10 anos · obras e infraestrutura

- Pedido do Magno em 09/11/2026 (aba própria fixada). Série Ilhéus 10 anos (o 036 foi educação).
- Período: 2016 até o último mês entregue de 2026. Duração livre (6 a 7 min).
- Prompt: projetos/_prompt-ilheus-10-anos-obras.md
- Levantamento: ~/Documents/ILHEUS-10-ANOS-TCM/obras/
- e-TCM: município 164 · Prefeitura UJ 768 · Câmara 197 · SUTRAM 1086.
- PARCERIA com @ablogtadeolho: abertura e final iguais ao 094 Paratinga (CabecalhoDuplo com dois selos), foto em projetos/_arte-arroba/ablogtadeolho.jpg. Só o @, sem o nome da dona do perfil.
- Gatilho: Rua Aliança, Alto da Conquista (stories em referencias/). Sem nome do secretário no vídeo.
- Render e vídeo SÓ depois do 094 Paratinga pronto (prioridade total). Pesquisa pode andar antes, com a trava do navegador.

## Etapa atual
1. ROTEIRO APROVADO pelo Magno em 09/11/2026 (v2: gancho pela receita de capital, sem Rua Aliança; 800 palavras). Próximo: voz. audio/roteiro-falado.txt (850 palavras, ~5 min), audio/fontes.md (cópia em ~/Documents/FONTES).
- Título da capa sugerido: "Previu 301 / milhões. / Entraram / só 44."
- Levantamento concluído: ~/Documents/ILHEUS-10-ANOS-TCM/obras/DOSSIE_OBRAS_ILHEUS_2016_2026.md

## Falta
levantamento → lista de pontos para checar → roteiro (aprovação) → voz → sincronia → plano (aprovação) → cenas → revisão → final → capa e legenda.
- 09/11/2026 ~18h (Magno): se o 094 Paratinga pedir para pausar (navegador ou render), o 095 pausa na hora, solta a trava e só volta quando o 094 avisar que terminou.

## 09/11/2026 (noite): produção em modo automático
- Voz Algenib 1,3 pronta (audio/narracao-norm.wav, 270,4 s). Sincronia feita (src/videos/obrasilheus10/palavras.ts).
- Mapa de abertura: Kit Mapas `ObrasIlheus10Mapa` (src/videos/obras-ilheus-10, cópia do 036 com etiquetas novas) → mapas/obrasilheus10.mp4 (13,6 s).
- Código: src/videos/obrasilheus10/ (ObrasIlheus10.tsx, FolhaPdf.tsx, pecas.tsx, CabecalhoDuplo.tsx cópia com @ablogtadeolho). Composições registradas no Root.
- Pedido do Magno: no vídeo, FOLHA DE PDF DESENHADA com documento, página e números reais (28 folhas, ids 2 a 30 do site). O PDF verdadeiro fica no site.
- Site: obras/site_fontes_095/fontes_095.json com minuto e segundo; transcricao_site.md com [mm:ss] e links pdf#page=N.
- Recortes reais (recortes/vNN.png) ficam como apoio para o site, não entram no vídeo.
- Próximo: revisão dos quadros → vídeo final → capa e legenda.

## 09/11/2026 (noite, 2): roteiro v3 e sem parceria
- Magno: vídeo "muito institucional" → roteiro v3 em tom de conversa (audio/roteiro-falado.txt; v1 e v2 guardados). Parceria @ablogtadeolho CANCELADA: só @eumagnoleite (CabecalhoCidade comum + marca d'água simples).
- Voz v3: 253,99 s (v2 em audio/antigos/v2). Sincronia refeita. Mapa refeito ("CHEGARAM R$ 44 MI").
- Revisão: 93 quadros conferidos. Corrigido: página de 5 folhas (4→13, 12→98, 13→97, 18→43, 26→2), folha de 2024 só com o que está no Anexo 11 (créditos autorizados 58.029.629,76 e realizada 55.581.401,12), Tribunal só aparece quando a fala é dele.
- Vídeo final gerando: edicoes/095. ilhéus 10 anos obras/ILHÉUS OBRAS 2016-2026.mp4. Legenda pronta na mesma pasta. Falta: capa.
- ENTREGUE 09/11/2026 ~21h40: edicoes/095. ilhéus 10 anos obras/ (ILHÉUS OBRAS 2016-2026.mp4 4:15, capa.jpg, legenda.txt). Site: ~/Documents/ILHEUS-10-ANOS-TCM/obras/site_fontes_095/ (fontes_095.json/csv com minuto e página, transcricao_site.md, pdf/).
- Aviso técnico: disco com ~9 GB livres e projetos/ com 18 GB; `npx remotion still` falha (copia a pasta inteira). Usar scripts/quadros.mjs para stills.
- 09/11/2026 ~22h20: Magno pediu caber em 3 min → vídeo final acelerado 1,43202x (setpts + atempo, voz sem afinar) = 2:58 (ILHÉUS OBRAS 2016-2026.mp4). Original 4:15 em edicoes/095.../antigos/. Minutos do site recalculados (FATOR no site_minutos.py).
