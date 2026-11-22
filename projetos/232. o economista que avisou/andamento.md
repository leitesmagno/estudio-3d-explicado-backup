# 232. o economista que avisou
- Perfil: @eumagnoleite · Código: economistaavisou · Nome: EconomistaAvisou
- Vídeo NACIONAL explicativo, NÃO é prefeitura: NÃO vai para o site. Autoridades só pelo cargo (como no 163); o único nome é o do economista, que é o assunto.
- Complementa o 163 (ajuste fiscal 2027). Base: dossiê em ~/Documents/DOSSIE-PEDRO-PAULO-BASTOS/.
- Pedido do Magno em 18/11/2026: dossiê, roteiro e depois "Pode prosseguir a produção. Pode renderizar Braniac". Roteiro aprovado com isso (modo autônomo: seguir até o fim; Claude confere todos os quadros antes do render).

## Etapas
- 18/11 Roteiro: 575 palavras, 10 blocos, aprovado. Números 🔎 conferidos (ver audio/fontes.md).
- 18/11 Narração: voz Google Algenib, rate 1,3, sem atempo (igual ao 163), pausas 0,28 s, loudnorm -15. Duração 171,91 s.
- 18/11 Sincronia: a Groq perdeu cerca de 70 palavras no bloco do gasto primário, então foi refeita com o Whisper local.
- Próximo: plano de cenas → cenas → revisão → render no Braniac → capa e legenda.
- 18/11 Plano de cenas escrito (plano.md) e cenas programadas em src/videos/economistaavisou/ (Root.tsx registrado; tsc ok; 56 gatilhos conferidos na fala).
- 18/11 Revisão: 43 quadros + 3 do Guia. Corrigido: saúde e escola gigantes na cena do primário (miniaturas em grupo 0,3), rótulos de 2015 empilhados, placa 2036 tapando a caixa do resto do governo, câmera do "Inviável", degraus das propostas aparecendo antes da hora. Revisão aprovada pelo Claude (modo autônomo).
- 18/11 O Magno escolheu render no Mac ("Fac no mac aq msm"). Render 12:14–12:29, 13 partes de 400 quadros, nice 15: 1080x1920, 5184 quadros, 172,8 s, 35,6 MB, sem tela preta.
- 18/11 Capa (frame 2240, teto de vidro) e legenda feitas. ENTREGUE em edicoes/232. o economista que avisou/. Fontes copiadas para ~/Documents/FONTES. NÃO postado. Fora do site (nacional).
- Antes de postar: ver audio/fontes.md, seção 'Antes de postar' (destaques do PLP 299 de 18/11 e áudio original de 2016/2023).

## Versão 2 didática (18/11/2026)
- Magno: "não gostei muito do vídeo, seja mais didático... como se uma pessoa de 8 anos estivesse escutando" + acrescentar o debate de Jones Manoel sobre o PLP 299 (youtu.be/k4V29MXBcG0). Roteiro v2 (512 palavras) aprovado: "Aprovado, refaz".
- v1 inteira guardada em projetos/232.../antigos/v1 e edicoes/232.../antigos/v1 (vídeo, capa, legenda, código).
- Voz v2: Algenib 1,3, 149,38 s. Sincronia: Whisper local, 512 = 512 palavras.
- Cenas v2: casa, dois cofrinhos (cadeado só no primário, cano de moedas no dos juros), Teto de vidro, mesada (3 caixas encostando no limite), PLP 299 (medidor do limite + barris do petróleo), feira (10 → 9 moedas, dois bonecos), pilha dos juros 20x, 5 degraus.
- Obs.: roteiro.json e roteiro_carlao.py nesta pasta são de outra sessão (motor Carlão, sobre a v1); não mexidos.
- 18/11 Revisão v2: 37 quadros. Corrigido: cofrinhos pequenos (escala 3,2), medidores que viravam cúpula escura (2015: 3 bonecos do apoio; 299: colunas 2,5% x 2%), Congresso do impeachment só 0,9 s. Aprovada pelo Claude. Render no Mac (pedido do Magno vale para a refação).
- 18/11 v2 ENTREGUE: video final.mp4 (150,3 s, 4508 quadros, 29 MB, sem tela preta), capa (feira, 'Crescer menos é corte? Explico fácil'), legenda nova. v1 em edicoes/232.../antigos/v1. NÃO postado. quadro-rs-50.png na pasta é da sessão do motor Carlão.
- 18/11 Ajustes do Magno: % na tela em reais (R$ 100 vira R$ 102,50; MÍNIMO + R$ 0,60 / MÁXIMO + R$ 2,50; R$ 100 só vira R$ 102; de cada R$ 100 sumiram R$ 3,50), @ fixo com foto no topo (arrobaFixo) e fim só com o selo da foto (sem cartão SEGUE). Vídeo refeito 14:30 (150,3 s, 29 MB, sem tela preta). Versão anterior em antigos/v2a.
