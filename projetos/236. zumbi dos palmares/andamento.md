# 236. zumbi dos palmares
- Perfil: @eumagnoleite · Código: zumbipalmares · Nome: ZumbiPalmares
- Vídeo NACIONAL explicativo e didático (feriado de 20/11), NÃO é prefeitura, NÃO vai ao site. Motor original (Estúdio 3D + Kit Mapas), escolhido pelo Magno em 20/11/2026.
- Molde: 232 (Explicativo.tsx, arrobaFixo: true, % em reais se houver).

## Etapas
- 20/11 Roteiro escrito (audio/roteiro-falado.txt) e fontes (audio/fontes.md). Aguardando aprovação do Magno.
- 20/11 Magno: "seja ainda mais didático, educativo. E depois disso eu aprovo automaticamente, pode seguir". Roteiro v2 (542 palavras, explica colônia, escravizado, quilombo, bandeirante) = aprovado; modo autônomo até o fim. v1 em antigos/roteiro-v1.txt.
- 20/11 Voz: Algenib 1,3, pausas 0,28, loudnorm -15: 166,92 s. Sincronia: Whisper local, 542 = 542 (a Groq trocou palavras).
- 20/11 Cenas: src/videos/zumbipalmares/ZumbiPalmares.tsx (molde 232, arrobaFixo). 9 cenas: feriado, colônia (navio, corrente), quilombo (mata), Palmares (serra, mocambos, roças, rei), Zumbi (igreja de Porto Calvo, livro, volta), proposta 1678 (livre x preso, divisão), guerra (cerco do Macaco, calendário 1695, sem violência), memória (1971/1996/2011/2023, 13 maio x 20 nov), fecho (papéis + lupa, serra com estrela).
- 20/11 Revisão: 39 quadros + 3 do Guia. Corrigido: navio, cana e placa da colônia cortados (placa trocada por rótulo NAVIO DE PORTUGAL), árvores e roças de Palmares nas bordas, cerco e placa MACACO fora do quadro (placa virou rótulo), linha do tempo com 1971 cortado e calendários tapando os anos (calendários saem em "A ideia cresceu"). Aprovada pelo Claude (modo autônomo).
- 20/11 Render no Mac (nice 15), 7 partes: 1080x1920, 5035 quadros, 167,8 s, 31 MB, sem tela preta.
- 20/11 Capa: 'npx remotion still' estourou o disco (copia 8 GB de projetos/); feita com scripts/quadros.mjs --saida. Fundo 56,13 s (vila de Palmares), título 'Por que hoje / é feriado? / Explico fácil'. Legenda pronta.
- ENTREGUE em edicoes/236. zumbi dos palmares/ (video final.mp4, capa.jpg, legenda do post.txt). NÃO postado. Fora do site (nacional).

## Versão 2: maquete + Kit Mapas (20/11/2026)
- Magno: "melhore... coloque numa maquete... traga também o kit mapas 3D quando falar de Portugal, Colônia". Mesma narração (roteiro v2 aprovado); só o visual mudou. v1 (código, vídeo, capa e legenda como o Magno renomeou) em antigos/v1 e edicoes/.../antigos/v1.
- Maquete única sobre base de mesa: mar e navio, porto do Recife, engenho (casa-grande, chaminé, canavial, escravizados com corrente), mata, Porto Calvo (igreja, livro), Serra da Barriga verde com Palmares montado aos poucos (paliçada, mocambos, roças, palmeiras, moradores, rei), cerco das tropas, linha do tempo na beira da mesa.
- Kit Mapas: Kit-Mapas-Animados/src/videos/zumbipalmares-236, composição MapaZumbiPalmares, 4 trechos (9,8–21,7 rota Portugal/África → Brasil; 39–47,75 Brasil → Serra da Barriga em AL; 119,5–126,6 Porto Alegre 1971; 145,3–149 Brasil inteiro) → mapas/mapa.mp4 (944 quadros). Tag sem `sai` quebra o render (Infinity): usar sai={99999}.
- 20/11 v2 ENTREGUE 17:49: video final.mp4 (167,8 s, 5035 quadros, 86 MB, sem tela preta), capa nova (fundo 58 s, Palmares na serra), legenda igual à v1. Arquivos *palmares* da pasta são a v1 renomeada pelo Magno.
