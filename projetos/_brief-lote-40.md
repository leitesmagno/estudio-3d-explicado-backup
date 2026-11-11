# Brief do lote de 40 (aba de cada cidade)

Leia antes: `projetos/_coordenacao-sessoes.md` (regras até a 83), `projetos/_brief-molde-ubaitaba.md`, `projetos/_aprendizados.md` e `projetos/093. orçamento de ilhéus/andamento.md`.

- MOLDE ÚNICO = 093 ILHÉUS (regra 83): 2024, 2025 e 2026 até o último mês entregue ao TCM; folha de receita em PDF por ano; despesa com o maior detalhe possível (folha por setor, ações, pessoal, Câmara com duodécimo); sacadas no fim; máx. 3:00; voz Google Algenib. SEM tarifa bancária (só Ilhéus).
- DOWNLOADS SEM JANELA (regra 82): só `fetch` + recebedor `http://127.0.0.1:8778/salva?pasta=<CIDADE>&nome=<ARQ>.pdf`. Nunca `a.download`, nunca clique de download, nunca aba nova. Trava `_navegador.lock`.
- UM POR UM (Magno): só comece quando o coordenador mandar "pode começar". Render com `_render.lock`, um por vez. Memória livre < 20%: espere.
- Sem nome de gestor, sem percentual, sem travessão, tom só informativo, fatos com fonte do TCM conferidos 2x, fontes.md copiado para ~/Documents/FONTES.
- Entrega: mp4 em `~/Documents/VIDEOS PRONTOS - FOLHA POR SETOR/`, capa e legenda em `edicoes/NNN. orçamento de <cidade>/`, hashtags só #Cidade + #MagnoLeiteExplica, ⚖️ AVISO no fim. Avise o coordenador com o caminho e os números.
- Dúvida ou erro que não resolve com segurança: PARE e avise o coordenador. Sempre em português.
- GUARDAR TODOS OS PDFs (Magno, 10/11/2026): todo PDF baixado do TCM fica guardado para sempre em ~/Documents/RECEITAS-DESPESAS-<CIDADE>/documentos_tcm/ (o site usa). Nunca apagar, nem na limpeza depois da entrega; só conferir o município no cabeçalho.
- SITE COM TRANSCRIÇÃO E FONTES (Magno, 10/11/2026): o site eumagnoleite.com.br monta a aba "Transcrição e fontes" de cada vídeo a partir de `projetos/NNN.../transcricao/transcript.md` (frases com minutagem) e de `projetos/NNN.../audio/fontes.md`. Os dois são OBRIGATÓRIOS. No fontes.md, cada número dito na fala aparece com o valor exato, o nome do arquivo PDF em documentos_tcm, a página e a linha/coluna, para o site ligar a frase ao PDF certo. Depois da entrega, o coordenador roda `build/atualiza.py` e confere se o vídeo saiu com as checagens ligadas aos PDFs.

## Regra 87 (10/11/2026 02:25)
Só 2024, 2025 e 2026. Nada de 2016 a 2023 nos vídeos nem no site por enquanto.

## Regra 89
Ao abrir o e-TCM, grave a lista de prestações mensais da Prefeitura pelo recebedor (/prestacoes?cidade=<slug>). Detalhes na regra 89.

## Regra 99 (10/11 19:40): FESTAS SEPARADAS DA CULTURA
Dois setores: "Festas e eventos" e "Cultura". Detalhes na regra 99 do _coordenacao-sessoes.md.
