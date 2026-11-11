# Prompt: Paratinga 2018–2024 (pedido do @eugeniodmr), enquadrado no molde atual

Rascunho de 09/11/2026. Base: o texto que o @eugeniodmr escreveu (a partir do prompt antigo do 035) + as regras que valem hoje (brief do molde Ubaitaba, `_coordenacao-sessoes.md` até a regra 80, `_aprendizados.md`).
Decisões do Magno (09/11/2026): um vídeo só, com setores resumidos; Gênesis só por fonte oficial; os dois @ em tudo (selo e cabeçalho também); gancho pelo gasto, como o @eugeniodmr pediu.

O 035 (Paratinga 2024–2026) já está pronto e NÃO se refaz (regra 58). Este é um vídeo NOVO, com número próprio, olhando para trás: 2018 a 2024.

---

## PROMPT

Bora fazer o vídeo de orçamento de **PARATINGA (BA), 2018 a 2024**, pedido em parceria com o @eugeniodmr. É um vídeo novo (não mexa no 035).

Leia antes: `projetos/_brief-molde-ubaitaba.md`, `projetos/_coordenacao-sessoes.md`, `projetos/_aprendizados.md`, o `andamento.md` e o código do 035 (`src/videos/orcamentoparatinga/`) e do 092 Ubaitaba (`src/videos/orcamentoubaitaba/`). O molde visual é o do Ubaitaba (092), com Camacan (042), Dário Meira (056) e Mata de São João (072) como referência. Aproveite o levantamento que já existe em `~/Documents/RECEITAS-DESPESAS-PARATINGA/` (2024 já está baixado lá).
Siga as etapas do Estúdio com as aprovações do Magno no roteiro, no plano e na revisão (este vídeo NÃO é modo autônomo).

### 1. Levantamento (fonte principal: e-TCM, Consulta Pública do TCM-BA)

Baixar sem pedir, em ordem cronológica, na mesma pasta `~/Documents/RECEITAS-DESPESAS-PARATINGA/` (subpasta `2018-2024/`):
- Balanço Orçamentário e Anexo 9 de 2018 a 2024, com a Câmara;
- PCMGE015 (despesa por ação) e PCMGE016 (receita) de dezembro de cada ano, 2018 a 2024, da Prefeitura e da Câmara;
- duodécimo da Câmara de cada ano (portal do gestor do TCM).
- Conferir o nome do município e o mês DENTRO de cada PDF (regra 41). PDF que não baixar vira linha em `projetos/_pendencias-tcm.md` e o trabalho segue. Usar a trava `_navegador.lock`.
- Layout diferente entre os anos (o sistema muda de 2018 para 2024): adaptar `anexo9b.py` e `acoes015b.py` e conferir se o total bate com o Anexo 9.

Regras dos números:
- **Receita:** na fala só o total declarado ao TCM ("arrecadou"), sem dividir por União, Estado ou Fundeb. O detalhe vai só na folha de receita do ano.
- **Despesa: "gastou" = LIQUIDADO em todos os anos** (regra 32; o prompt antigo dizia empenhado, isso mudou). 2024 já está fechado: ano inteiro.
- Cada número conferido duas vezes no PDF e registrado em `audio/fontes.md`, com cópia em `~/Documents/FONTES`.

Ações por secretaria: abrir todas para achar dinheiro que mudou de linha (reservado x usado), obra parada e contrato grande. Antes de dizer "2 vezes o previsto", conferir se o dinheiro só mudou de lugar dentro da secretaria.

TCM › Decisões › Auditoria: denúncias, cautelares, processos julgados e em análise, dispensas e inexigibilidades grandes, de 2018 a 2024.

Foco pedido pelo @eugeniodmr:
- **Transporte escolar e merenda:** quanto foi gasto por ano (ações do PCMGE015, inclusive dentro de Educação) e o que existe no TCM, no MP ou na Justiça sobre esses contratos, com o status exato de cada caso.
- **Gênesis Inovações Empresariais Ltda:** quanto a prefeitura pagou a essa empresa em cada ano de 2018 a 2024, e por qual serviço. Fonte: só oficial (e-TCM: pagamentos/empenhos por credor e processos; portal de transparência da prefeitura; decisões do TCM e do MP). Só valores pagos e status oficial; nunca chamar de "suspeito".
- Notícias: só para conferência interna e para achar obra do Estado ou da União no município (não atribuir à prefeitura o que não é dela).

Todo zero: duvidar e fazer 2 ou 3 buscas (ação, subfunção, outro nome, outra secretaria e o lado da receita), entender o porquê e explicar na fala. Dizer o que a secretaria gastou com ela mesma.

### 2. Roteiro

- **Duração:** um vídeo só, no máximo 3:00. Com 7 anos não cabe falar 12 setores por ano: em cada ano a voz diz arrecadou, gastou e quanto foi a mais ou a menos, e fala só os 4 ou 5 setores maiores daquele ano (sempre na ordem abaixo). Os outros setores aparecem sem fala, com plaquinha e folha, na mesma ordem. Os zeros com motivo entram na fala.
- **Gancho pelo gasto** (exceção só deste vídeo, pedido do @eugeniodmr e aprovado pelo Magno; a regra 24 continua valendo para os outros): "Paratinga gastou X milhões em 2024. Eu abri as contas...". Depois a história anda em ordem: 2018 → ... → 2024 → achados → Tribunal → pergunta, sem voltar no tempo (cuidado com o `quando()` repetido, ver aprendizado do 035).
- Cada ano: arrecadou, gastou e quanto foi a mais ou a menos; depois os setores falados, sempre na mesma ordem: Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura, Assistência social, Água e saneamento, Agricultura, Esporte, Meio ambiente; por fim os zeros com o motivo.
- **Proibido:** porcentagem (só valores), nome de prefeito ou gestor (só o ano), segurança pública, travessão, palavras de acusação ("crime", "desvio", "irregular", "suspeito", "má gestão").
- **Sacadas no final:** 2 ou 3 que se comparam (festas x assistência social e ajuda às famílias; limpeza x asfalto; reservado x usado; Câmara x setores carentes; pessoal; dívidas), o bloco transporte escolar / merenda / Gênesis, a obra do Estado se houver e o Tribunal com o resultado de cada caso. Sem tarifa bancária (só Ilhéus).
- **Fecho:** "Gastar não é crime. Mas se..., por que...?" e depois "Sigam o @eumagnoleite e o @eugeniodmr para mais informações." Essa frase TEM que ser falada na voz: no texto para a voz escrever "Sigam o arroba eu magno leite e o arroba eugênio dê eme érre para mais informações" e, depois de gerar o áudio, conferir na transcrição (palavras.json) que as duas partes foram ditas e soam certas; se o Google ler errado, ajustar a grafia e gerar de novo. Avisar o Magno no fim com o trecho transcrito.
- Didático, frases curtas, nada tecnicamente certo que engane.
- Entregar junto o título da capa em 4 linhas.

### 3. Vídeo (Kit Mapas + Estúdio 3D, molde Ubaitaba)

- Vertical 1080 × 1920, voz Google Algenib (chave no Chaveiro; nunca mostrar nem gravar).
- Abertura: o mapa voa até Paratinga com a etiqueta do total arrecadado de 2018 a 2024.
- Cabeçalho `CabecalhoCidade` com "PARATINGA" e os DOIS selos, cada um com a sua foto e o seu @ (pedido do Magno, 09/11/2026):
  - Abertura: os dois selos GRANDES aparecem juntos no meio da tela, um em cima do outro (@eumagnoleite em cima, @eugeniodmr embaixo), com a frase "Siga para ver a sua cidade" embaixo dos dois.
  - Depois de ~3,5 s os dois diminuem e vão juntos para o cabeçalho, ao lado da pílula "PARATINGA", e ficam EMPILHADOS: @eumagnoleite em cima, @eugeniodmr embaixo, cada um com a foto à esquerda e o @ à direita, os dois do mesmo tamanho. Ficam assim o vídeo todo, a pelo menos 90 px da lateral direita.
  - Final ("Sigam o @eumagnoleite e o @eugeniodmr"): os dois saem do cabeçalho e crescem de volta para o meio, empilhados como na abertura.
  - Fazer como variação só deste vídeo (não mudar o `CabecalhoCidade` dos outros). Fotos: `projetos/_arte-arroba/foto-perfil.jpg` e `projetos/_arte-arroba/eugeniodmr.jpg`. Mostrar um quadro de teste do cabeçalho ao Magno antes de seguir com as cenas.
- Maquete: cofre no centro, casinhas dos setores em volta na ordem da fala, base acima do tampo (nada afundado).
- A pilha de cada ano nasce em volta do cofre na palavra "gastou": dourado 2018, verde 2019, rosa 2020, cinza 2021, preto 2022, laranja 2023, vermelho 2024. A cada setor falado, as pilhas voam do cofre para a casinha. Escala da pilha: 1 pilha = R$ 4 mi (com 7 anos, R$ 2 mi daria pilha demais na mesa e pesaria o Mac; o 035 usou R$ 2 mi para 3 anos).
- Câmera sempre para o mesmo lado; na virada de ano sobe e recomeça.
- Faltou dinheiro: torre vermelha "A MAIS" ao lado do cofre.
- Plaquinhas pequenas, presas aos objetos, em todos os setores (mesmo zerados); ao falar um setor, aparecem também as dos anos anteriores, cada uma na sua cor. Nunca cartão grande tapando a maquete.
- Folhas "PDF": uma de receita por ano e uma por setor (até 2 ações: por tipo de despesa; 3 ou mais: nome das ações; máx. 6 a 7 linhas + "Outras"; faixa "Pessoal (salários e encargos) · diárias"; Câmara com "Recebeu da prefeitura (duodécimo) · sobrou e devolveu"; setor zerado com "gasto R$ 0,00"). Soma = valor falado; dinheiro sempre em número.
- Setor zerado: casinha cinza com a explicação do zero.
- Cenas dos achados: gavetas reservado x usado, rua da obra do Estado, pastas do Tribunal com carimbos, e uma cena para a Gênesis (pilhas por ano saindo para uma pasta com o nome da empresa).
- Marca d'água: @eumagnoleite e @eugeniodmr juntos, pequena, sutil e quicando o vídeo todo.
- Mesa sem rio fora de Paratinga; nada tapando o setor do final.
- Tudo a pelo menos 90 px das laterais. Render um por vez (`_render.lock`); depois de mudar o código, `--refazer`.

### 4. Entrega

- Pasta `edicoes/NNN. orçamento de paratinga 2018-2024/` (número novo, o próximo livre).
- `PARATINGA 2018-2024.mp4`, `PARATINGA 2018-2024 - capa.jpg` (fundo do achado principal, título legível) e `PARATINGA 2018-2024 - legenda.txt` (até 2.200 caracteres).
- Legenda, nesta ordem: gancho, um tópico por ano só com valores, achados, Tribunal, zeros com asterisco, bloco ⚖️ AVISO, pergunta do fecho, CTA e hashtags. Depois do `---`, o comentário fixado com a lista de documentos.
- Cópia em `~/Documents/NOVO LOTE/PARATINGA 2018-2024/` (vídeo, capa e legenda).
- Atualizar o `andamento.md`, a fila (`projetos/_status-municipios.md`) e o `_aprendizados.md`. Tudo em português do Brasil.
