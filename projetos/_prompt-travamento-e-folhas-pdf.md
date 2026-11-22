# Prompt: vídeo travando + folhas PDF por setor (13/11/2026)

Copie tudo abaixo da linha e cole numa aba nova aberta na pasta `~/Estúdio 3D Explicado`.

---

Você vai trabalhar nos vídeos de orçamento de prefeitura do @eumagnoleite, no Estúdio 3D Explicado (`~/Estúdio 3D Explicado`). Antes de tudo, leia:
- `CLAUDE.md`
- `projetos/_aprendizados.md`
- `projetos/_prompt-orcamento-prefeitura.md` (o molde: 093 Ilhéus / 042 Camacan, anos 2024, 2025 e 2026)
- `projetos/_coordenacao-sessoes.md` (regras de memória, disco e render)
- o código de um vídeo recente que está certo, como `edicoes/139. orçamento de feira da mata` e o código dele em `src/videos/`

Escreva sempre em português do Brasil, sem travessão. São duas tarefas, nesta ordem.

## TAREFA 1: vídeo travando no meio

**O problema:** alguns vídeos prontos travam no meio. A imagem congela por cerca de 1 minuto e depois volta a rodar.

**O que fazer:**
1. **Achar todos os vídeos afetados.** Varra os mp4 de `edicoes/*orçamento*` com o filtro de congelamento do ffmpeg:
   `ffmpeg -i "VIDEO.mp4" -vf "freezedetect=n=-60dB:d=2" -map 0:v -f null - 2>&1 | grep freeze`
   Monte uma tabela com vídeo, início do trecho parado, duração e se o áudio continua.
   Rode com `nice` e um vídeo por vez, para não esquentar o Mac.
2. **Descobrir a causa.** Olhe pelo menos estes pontos:
   - a emenda das partes do render (`scripts/render.mjs` e as pastas `.partes`), procurando parte faltando, repetida ou com duração errada;
   - quadro que demora a carregar no Remotion (delayRender, imagem ou mapa pesado);
   - diferença de fps ou de timestamps entre as partes;
   - áudio mais longo que o vídeo.
   Confirme a causa num vídeo antes de mexer em todos.
3. **Corrigir a causa no script de render** (não só no vídeo) e anotar a regra em `projetos/_aprendizados.md` como `[global]`.
4. **Refazer só o trecho ou o render dos vídeos afetados.** Depois, confira de novo com o freezedetect: nenhum trecho parado acima de 2 s que não seja pausa de propósito.
5. **Colocar a checagem automática** no fim de todo render: se houver congelamento, o vídeo não é entregue.
6. **Republicar no site** os que mudaram (`cd ~/Documents/SITE-EUMAGNOLEITE && nice -n 15 python3 build/atualiza.py`, um por vez).

## TAREFA 2: folha de PDF que acompanha a fala, setor por setor

**A ideia:** a "folha PDF" é uma representação do documento baixado do TCM-BA, uma folha de papel meio transparente na maquete com as linhas do documento (descrição e valor). Ela tem que acompanhar a narração. Sai uma folha e entra a próxima, conforme o assunto falado.

**Como deve funcionar, em cada ano (2024, 2025 e 2026):**
1. **Receita:** quando a fala diz "a Prefeitura de [cidade] arrecadou em [ano] X milhões", aparece a folha da RECEITA daquele ano (PCMGE016 ou Balanço), com os itens da receita e os valores.
2. **Educação:** quando a fala passa para a Educação, a folha da receita SAI (devagar, pelo menos 0,4 s, sem piscar) e entra a folha da DESPESA DA EDUCAÇÃO daquele ano: as ações ou subfunções da Educação no PCMGE015 ou Anexo 9 (por exemplo transporte escolar, merenda, Fundeb e pagamento de professores, creche, manutenção do ensino).
3. **Saúde:** quando a fala passa para a Saúde, a folha da Educação sai e entra a da DESPESA DA SAÚDE.
4. **Os outros setores:** o mesmo vale para cada setor, na ordem da fala: Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura, Festas, Assistência social, Água e saneamento, Agricultura, Esporte, Meio ambiente e os zerados.
5. **Fim do ano:** a última folha sai e o próximo ano começa de novo pela folha da receita.

**Regras da folha:**
- **No mínimo 6 linhas de descrição por folha** (6 itens com nome e valor), tirados do PDF do TCM. Se o setor tiver menos de 6 itens no documento, mostre todos os que existirem. Se tiver muitos, mostre os 6 a 10 maiores e uma linha "outros" com a soma do resto.
- **A soma das linhas bate com o valor falado do setor.** Todo valor sai do PDF e tem linha no `audio/fontes.md` (arquivo, página, linha).
- **Cabeçalho da folha:** documento, órgão e período, por exemplo "PCMGE015 · Despesa por ação · Educação · dez/2025 · TCM-BA".
- **Valores em R$ por extenso numérico** (R$ 1.234.567,89), sem porcentagem.
- **Posição:** fica num canto livre (y ≥ 600), sem tapar plaquinhas, casinhas nem a legenda, e dentro da área segura do Reels.
- **Timing:** só uma folha na tela por vez. Ela entra na palavra do setor (use `quando()` sobre o `palavras.ts`, nunca segundos escritos à mão) e sai quando o próximo setor é falado.
- **A folha não é falada.** É só apoio visual para quem quiser ler.
- **Ferramenta:** use e melhore `tools/lista_pdf/lista_pdf.py` para gerar os dados de cada folha a partir dos PDFs do município (receita do ano + despesa por setor), num arquivo `folhas.json` por vídeo.

**Ordem de trabalho:**
1. Faça primeiro num vídeo de teste (sugestão: o próximo da fila) e mostre 6 quadros ao Magno: a receita, a Educação, a Saúde, a Câmara, um setor com menos de 6 itens e a virada de ano.
2. Com a aprovação do Magno, vira regra `[global]` em `_aprendizados.md` e no `_prompt-orcamento-prefeitura.md`, e passa a valer para todos os vídeos novos.
3. Vídeos já entregues só são refeitos se o Magno pedir.

## Regras que sempre valem
- Nunca citar nome de prefeito, ex-prefeito ou vereador. Tom informativo, sem acusar.
- Um render por vez no Mac, com `nice` e metade dos núcleos. Deixar 15 a 20% de memória livre e no mínimo 3,5 GB de disco para o vídeo final.
- Não apagar arquivo do Magno. Partes de render e quadros temporários de vídeo entregue podem ser apagados.
- Ao terminar, avise com uma tabela: vídeo, o que foi corrigido e o status.
