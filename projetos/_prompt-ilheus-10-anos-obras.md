# Prompt: Ilhéus 10 anos · OBRAS E INFRAESTRUTURA (2016 → último mês entregue de 2026)

Pedido do Magno em 09/11/2026. Começa DEPOIS do 094 Paratinga 2018–2024 (parceria, prioridade).
Segue `projetos/_coordenacao-sessoes.md` (trava de navegador e de render, um render por vez, no máximo 3 a 4 sessões ativas).

---

Bora fazer o vídeo da série **Ilhéus 10 anos**, tema **OBRAS E INFRAESTRUTURA**, de 2016 até o último mês entregue de 2026. Fonte principal: e-TCM (município 164, Prefeitura UJ 768, Câmara UJ 197, SUTRAM UJ 1086), menu Decisões do TCM e sites oficiais abertos a qualquer cidadão (Lei de Acesso à Informação, Lei 12.527/2011, e Lei da Transparência, LC 131/2009). Reaproveite o que já está em `~/Documents/ILHEUS-10-ANOS-TCM` (056/015/016 de 2020-01 a 2026-08, leitores le056*.py, títulos de 2016–2019) e em `~/Documents/RECEITAS-DESPESAS-ILHEUS`. Pasta nova do levantamento: `~/Documents/ILHEUS-10-ANOS-TCM/obras/`.

## 1. A pergunta do vídeo
"Em 10 anos, quanto Ilhéus previu, quanto arrecadou e quanto gastou de fato com obras e infraestrutura? Com quem, com que dinheiro e o que ficou pronto na rua?"

O que conta como obras e infraestrutura (sempre pela classificação oficial, nunca por achismo):
- Funções 15 Urbanismo (infraestrutura urbana, pavimentação, iluminação pública, serviços urbanos), 17 Saneamento (drenagem), 26 Transporte (estradas vicinais, pontes), 06.182 Defesa Civil (contenção de encostas) e 16 Habitação.
- Obras dentro de outras secretarias (escola, posto de saúde, quadra): entram num bloco à parte "obras em outras secretarias", achadas pelo elemento 4.4.90.51 (Obras e instalações) no PCMGE015.
- Conferir as ações por secretaria antes de dizer "zero" (Belmonte: turismo estava em Cultura).

## 2. Funil do levantamento (cada etapa dá a pista da próxima)
MÉTODO = ~/Downloads/Guia Completo TCM-BA - Receita e Despesa.pdf (passos 1 a 21 e o checklist da última página), conferido item por item (Magno, 09/11/2026). Acréscimos do guia a este vídeo:
- Passo 2: status de CADA mês 2016–2026 (no prazo / fora do prazo / faltando) → `obras/status_prazo.csv`. Já visto: 2020 teve 01, 02, 03, 11 e 12 fora do prazo.
- Passo 11: despesa consolidada pelo PCMGE065 (dotação fixada x atual, empenhado, liquidado, pago, por secretaria e ação); ação que dobrou = procurar o decreto; dotação com zero empenhado = obra prometida que não saiu.
- Passos 12 e 13: elemento (4.4.90.51 obras, 3.3.90.39 serviços, 3.3.90.33/39 locação de máquinas, 3.3.90.92 exercícios anteriores) e FONTE (1751 COSIP x iluminação pública; 1750 CIDE; 1700/1701 convênios União/Estado; 1706 emenda Pix; 1500 próprio). Cruzar com a receita: COSIP arrecadada (1.2.4.1) x gasto com fonte 1751; convênios 2.4.1.4/2.4.2.2 x obras com fonte 1700/1701.
- Passo 16: mês do contrato pelo Google "contrato administrativo NNN/AAAA Ilhéus" e regras do edital (prazo, preço, idade das máquinas).
- Passos 17 a 19: contas anuais, auditoria E termo de ocorrência.
- Cuidado ao publicar (p. 17): dado não prova crime sozinho; diferença vira pergunta.

**2.1 Previsão x realidade, ano a ano (2016–2026)**
- LOA de cada ano (PCAGO055/anual): quanto foi PREVISTO para cada função de obras.
- Balanço Orçamentário (PCAGO015) e Anexo 9 de dezembro: dotação atualizada, empenhado, liquidado e pago por função. "Gastou" = LIQUIDADO (regra 32). 2026 = liquidado até o último mês entregue.
- Tabela-mãe `obras/previsto_x_executado.csv`: ano · previsto LOA · dotação atualizada · empenhado · liquidado · pago · diferença previsto x liquidado.

**2.2 Receita: quanto entrou, de onde veio e se bate com quem mandou (PCMGE016)**
- Total arrecadado de cada ano (previsto x arrecadado).
- Dinheiro CARIMBADO para obras: transferências de capital (2.4: convênios da União e do Estado, PAC, emendas parlamentares, Caixa), operações de crédito (2.1: FINISA, empréstimos), CIDE, contribuição de iluminação pública (COSIP) e royalties, se houver.
- Conferência na fonte, com os dois valores no `fontes.md`: Portal da Transparência (convênios e transferências), Transferegov, painel de emendas do TCU, Caixa (PAC), Banco do Brasil (FPM/CIDE/royalties) e Tesouro Transparente (operações de crédito). Diferença = pergunta, nunca acusação.

**2.3 Despesa consolidada: o que foi reservado, gasto e pago por secretaria (PCMGE015 / 065)**
- Por secretaria de obras e por ação: reservado (dotação), empenhado, liquidado e pago. O que comprou (elemento: obras, serviços de terceiros, material, locação de máquinas) e com que dinheiro (fonte de recurso: próprio, convênio, operação de crédito).
- Achar dinheiro que mudou de linha: ação com previsão grande e execução zero, ou o contrário.

**2.4 Relação de pagamentos: para quem o dinheiro saiu (PCMGE056)**
- Todos os credores das secretarias de obras, 2016 → 2026. Anotar SEMPRE: data, nº do PROCESSO DE PAGAMENTO, histórico, valor.
- Saída: `obras/pag056_OBRAS_todos.csv` e `obras/OBRAS_ranking_empresas.csv` (empresa, CNPJ, total por ano, total dos 10 anos, serviço).
- 2016–2019: o e-TCM só tem processos individuais; usar `saida/titulos_2016_2019` e abrir um a um.

**2.5 Processo de pagamento: nota fiscal, anexos, medições e placa (PCMGE049)**
- Para as maiores empresas e as maiores obras: abrir o processo, ler nota fiscal, boletim de medição, atestado, fotos e placa da obra. Anotar o nº do CONTRATO e o nº da LICITAÇÃO.

**2.6 Contrato, licitação e dispensa (pastas 009, 051 e 020)**
- 009: contrato e aditivos (valor inicial, aditivos de prazo e valor, quanto o contrato cresceu).
- 051: licitação homologada (modalidade, quantos concorreram, quem ganhou, valor).
- 020: dispensa e inexigibilidade: POR QUE não teve licitação (emergência, calamidade, valor baixo) e o que foi combinado.
- Planilha `obras/contratos.csv`: nº contrato · nº licitação ou dispensa · motivo · empresa · objeto · valor contratado · aditivos · total pago no 056 · processos de pagamento · situação na rua.

**2.7 Tribunal (menu Decisões)**
- Contas anuais 2016–2025 (já levantadas: 2016 e 2018–2020 rejeitadas, 2017 e 2021–2023 com ressalvas, 2024 não julgada): ler no parecer o que fala de obras, licitação e contratos.
- Auditoria, denúncias, termo de ocorrência e cautelares sobre obras, licitação e empresas da lista. Status exato da fonte.

**2.8 Realidade: o que foi pago x o que está na rua**
- Para cada obra grande: está pronta, parada ou nunca começou? Conferir em notícias e fotos, cruzando com o que foi pago.
- Caso-gatilho: Rua Aliança, Alto da Conquista (story do perfil ablogtadeolho, 09/11/2026). A resposta do secretário de Infraestrutura e Defesa Civil diz que a obra começou em 20/09/2026, a drenagem está pronta e a pavimentação em concreto espera o tempo firmar. Procurar o contrato e o pagamento dessa rua no 056/049/009/051 (meses entregues) e anotar o que os documentos mostram.
- MAPA DE RUAS E OBRAS PROMETIDAS (Magno, 09/11/2026): não ficar só na Rua Aliança. Listar TODAS as ruas, bairros e obras que os documentos da prefeitura citam (LOA/PPA com ação por obra, histórico do 056, objeto de contrato 009, licitação 051, dispensa 020, medição no 049, Diário Oficial, portal da transparência, ordens de serviço e "operação tapa-buraco"/máquinas enviadas). Planilha `obras/ruas_e_obras.csv`: rua/bairro · o que o documento diz (previsto, contratado, pago, máquina enviada) · ano · valor · nº processo/contrato · o que a notícia mostra · situação (pronta, parada, não começou, sem informação) · fonte da notícia com data. Depois conferir cada uma na realidade (notícias de cada ano, fotos datadas, reclamações de moradores) e trazer tudo de forma imparcial: o que foi entregue também entra.
- Obras do Estado (CONDER, SEINFRA) e da União (PAC, DNIT) na cidade: marcar como "não é da prefeitura" para não atribuir errado.

**2.9 Notícias e pesquisas complementares, por ano e por obra**
- Bahia Notícias, A Tarde, Bocão News, sites locais (O Tabuleiro, Ilhéus Net, Jornal do Radialista), Diário Oficial do município, PNCP.
- Notícia só serve para conferir e para achar a pergunta. Fato dito no vídeo precisa estar num documento oficial salvo em PDF.

## 3. Lista de suspeitas e irregularidades (arquivo interno, só para o Magno, NUNCA vai para o vídeo)
`obras/SUSPEITAS_E_IRREGULARIDADES.md`: tudo que parece suspeito ou irregular, cada item com o documento (pasta, página, nº do processo), a lei ou norma que pode ter sido descumprida (Lei 14.133/2021, Lei 8.666/1993 até 2023, LRF, Lei 4.320/1964, resoluções do TCM) e a pergunta. Exemplos: pagamento sem contrato achado, aditivo acima de 25%, dispensa repetida para a mesma empresa, empresa nova que ganha muito, obra paga e não entregue, pagamento maior que o contrato, a mesma rua paga duas vezes. Para cada ponto, dizer o que confirmaria ou derrubaria a dúvida e onde checar na rua.
No vídeo continua o tom informativo: fatos, valores e o status exato da fonte, sem a palavra suspeito, irregular ou crime.

## 3b. Imparcialidade
- De 2016 a 2026 o período pega gestões diferentes: mesma profundidade de busca em cada ano, mesma régua de comparação. Nenhum nome de prefeito ou secretário no vídeo (nem o secretário que respondeu no story).
- Interpretar cada documento antes de usar (o que é, por que aquele valor, se o dinheiro só mudou de linha). Tudo conferido 2 vezes.

## 4. Roteiro (de 6 a 7 minutos, cerca de 950 a 1.050 palavras)
- Gancho pela receita e pela pergunta do vídeo, com a rua de hoje (Rua Aliança) como imagem de abertura do problema.
- Ordem fixa: previsão x realidade nos 10 anos → de onde veio o dinheiro de obras → para onde foi (secretarias, o que comprou) → as empresas que mais receberam e para quê → contratos, licitações e dispensas → o que o Tribunal disse → o que está na rua → pergunta final.
- Só valores, nunca porcentagem. Sem nome de prefeito ou secretário: só o ano e o cargo quando for indispensável. Ressalva "dados que a própria prefeitura enviou ao TCM" uma vez só.
- CTA de parceria (ver item 5).

## 5. Vídeo (Kit Mapas + Estúdio 3D, molde 092 Ubaitaba / 074 Macaúbas)
- Abertura e final de PARCERIA, iguais ao 094 Paratinga: CabecalhoDuplo com dois selos (@eumagnoleite e @ablogtadeolho, foto em `projetos/_arte-arroba/ablogtadeolho.jpg`), só o @, sem o nome da dona do perfil. CTA: "Sigam o @eumagnoleite e o @ablogtadeolho para mais informações." Kit Mapas voando até Ilhéus e marca d'água quicando dupla, como no 094.
- Maquete com os bonequinhos: cofre, pilhas por ano (10 cores ou uma linha do tempo de 2016 a 2026), casinhas das secretarias de obras, máquinas e ruas.
- FOLHAS DE PDF NA TELA (novidade): quando a voz cita um contrato, uma licitação, uma nota fiscal ou um pagamento, aparece o RECORTE do PDF de verdade (página reduzida, trecho com marca-texto, nº do documento e "e-TCM · TCM-BA") por cerca de 3 s, a 90 px das laterais, sem tapar plaquinha. Abaixo, a transcrição curta do que está ali (empresa, objeto, valor, data). CPF de pessoa física e assinatura sempre borrados. ENQUADRAMENTO (Magno, 09/11/2026, regra 71 da coordenação): o recorte do PDF fica INTEIRO dentro do quadro, a no mínimo 90 px de cada lateral (o Instagram corta ~60-70 px no celular), nunca cortado; aparece junto de cada número falado. Conferir nos quadros de revisão em todas as viradas de fala.
- Folha de receita e folhas por setor como nos vídeos atuais (regras 28 e 29).
- Final: pergunta + CTA, igual aos vídeos aprovados.

## 6. Entrega
`edicoes/NNN. ilhéus 10 anos · obras/`: `ILHEUS OBRAS.mp4`, capa, legenda (até 2.200 caracteres com o bloco ⚖️ AVISO) e comentário fixado com a lista de documentos. `fontes.md` com uma linha por número (arquivo, página, linha e coluna), copiado para `~/Documents/FONTES`.
