# Prompt padrão: vídeo de orçamento de prefeitura (molde 035 Paratinga)

Copie, troque [MUNICÍPIO] e cole numa sessão nova do Estúdio 3D Explicado.

---

Bora fazer o vídeo de orçamento de [MUNICÍPIO] (BA), no mesmo padrão do 035 Paratinga, que é o molde aprovado. Antes de começar, leia `projetos/_aprendizados.md`, o `andamento.md`, o `plano.md` e o código do 035 (`src/videos/orcamentoparatinga/`), o roteiro dele (`projetos/035. orçamento de paratinga/audio/roteiro-falado.txt`) e a legenda (`edicoes/035. orçamento de paratinga/PARATINGA - legenda.txt`). Siga as etapas do Estúdio, com as minhas aprovações no roteiro, no plano e na revisão.

**1. Levantamento (fonte ÚNICA desde 08/11/2026: o método e as fontes do ~/Downloads/Guia Completo TCM-BA - Receita e Despesa.pdf; tudo salvo em PDF na pasta do município; notícia só para conferência interna)**
- Baixe sem me pedir: Balanço Orçamentário e Anexo 9 de 2024 e 2025 (despesa por função, com a Câmara), e o PCMGE015 (despesa por ação) e o PCMGE016 (receita) de dez/2024, dez/2025 e do último mês entregue de 2026, da Prefeitura e da Câmara. Arquivos em ordem cronológica, numa pasta `~/Documents/RECEITAS-DESPESAS-[MUNICÍPIO]/`.
- Se o layout do sistema do município for diferente, adapte os scripts (anexo9b.py, acoes015b.py) e confira se o total bate com o Anexo 9.
- Receita (atualizado 08/11/2026, do 066 em diante; guia em ~/Downloads/Guia Completo TCM-BA - Receita e Despesa.pdf, Parte 2): o total de cada ano continua sendo o que o município declarou ao TCM ("arrecadou"). AGORA também detalhar a receita pelo PCMGE016 do último mês de 2026 (e dez/2025): montar `receita-resumo.csv` (código e descrição · previsto na LOA · arrecadado até o mês) agrupado em Próprias (IPTU, ITBI, IRRF, ISS, taxas, iluminação, rendimentos), União (FPM, FPM extra, SUS, FNDE, Fundeb VAAT/VAAF/VAAR/ETI, FNAS, outras), Estado (ICMS, IPVA/IPI/CIDE, SUS, convênios, programas), Fundeb principal (1.7.5), Diversas (linha de diferença) e Capital; a soma tem que fechar com o total do PDF (diferença 0,00). Usar "Arrecadada até Mês" (dizer se é antes ou depois das anulações). FPM, ITR, ICMS, IPVA e IPI vêm LÍQUIDOS (20% do Fundeb nas colunas Deduções; bruto = arrecadada + deduções). Não somar linha mãe com filha.
- Conferir na fonte, com linha no fontes.md: FPM/ICMS/Fundeb no Banco do Brasil (demonstrativos.apps.bb.com.br/arrecadacao-federal), SUS no FNS (consultafns.saude.gov.br/#/detalhada), FNDE (fnde.gov.br/pls/simad/internet_fnde.liberacoes_01_pc), MDS (aplicacoes.mds.gov.br/suaswebcons), emendas no painel do TCU (sites.tcu.gov.br/painel-de-acompanhamento-da-execucao-de-emendas/) e FNS proposta, convênios no Portal da Transparência. Duodécimo da Câmara em tcm.ba.gov.br/portal-do-gestor/duodecimo/. Diferença entre TCM e site federal vira PERGUNTA, nunca acusação (pode ser data, código ou bruto x líquido).
- Prioridade do bloco de receita (o que a sociedade quer saber): SUS da União e do Estado (saúde; a prefeitura costuma dizer que não recebe), IPTU e iluminação pública. Conferir o SUS do PCMGE016 no Fundo Nacional de Saúde no mesmo período, com os dois valores no fontes.md.
- Achados de receita para escolher (no máximo 1 no vídeo): receita muito acima ou abaixo do previsto para o mês (régua = mês ÷ 12; dizer em reais "previu X, arrecadou Y", nunca %), VAAR zerado, transferência especial (emenda Pix) anulada, convênio previsto que não entrou, divergência com o site federal.
- Despesa: 2024 e 2025 empenhada (Anexo 9), 2026 liquidada até o último mês entregue (Prefeitura + Câmara).
- Abra as ações por secretaria para achar dinheiro que mudou de linha (reservado x usado), obras paradas e contratos grandes. Antes de dizer "X vezes o previsto", confira se o dinheiro só mudou de lugar dentro da secretaria.
- TCM › Decisões › Auditoria: denúncias, cautelares, processos julgados e em análise. Dispensas e inexigibilidades grandes.
- Notícias (Bahia Notícias, A Tarde, sites locais): obras do Estado ou da União no município, para não atribuir à prefeitura o que não é dela.
- Todo ZERO: duvide, faça 2 ou 3 buscas (ação, subfunção, outro nome, outra secretaria, e também no lado da RECEITA), entenda o porquê e explique na fala.

**2. Roteiro (no máximo 3 minutos de narração final, cerca de 460 palavras)**
- Gancho pela RECEITA (desde 08/11/2026): quanto o município arrecadou nos anos do vídeo e a pergunta "de onde veio esse dinheiro, e para onde foi?". Nunca abrir com achado de gasto. O vídeo conta uma história em ordem: receita → 2024 → 2025 → 2026 → achados → Tribunal → pergunta, sem voltar no tempo e sem adiantar setor ou achado.
- Para cada ano (2024, 2025, 2026 até o mês): arrecadou, gastou e quanto gastou a mais ou a menos. Depois, os setores sempre na MESMA ordem (Educação, Saúde, Administração, Obras e serviços urbanos, Câmara, Dívidas, Cultura, Assistência social, Água e saneamento, Agricultura, Esporte, Meio ambiente, e por fim os zeros com o motivo).
- Só valores, nunca porcentagem. Nunca nome de prefeito ou gestor: só o ano. Não falar de segurança pública.
- DE ONDE VEIO O DINHEIRO (desde 08/11/2026): logo depois do "arrecadou" de 2026, um bloco curto (50 a 70 palavras, uma vez só no vídeo) com o ano mais recente: quanto o município arrecadou com os próprios impostos, quanto veio da União, quanto do Estado e quanto voltou do Fundeb (valores em reais arredondados, sem %). Se citar FPM ou ICMS, explicar uma vez que chegam com 20% já descontado para o Fundeb. Para caber nos 3 min, enxugar introdução e transições; os setores obrigatórios não saem.
- Depois dos anos, 2 ou 3 achados que se comparam (um deles pode ser o achado de receita) (ex.: festas x assistência social; limpeza x asfalto, reservado x usado), uma obra do Estado se houver, e o que está no Tribunal (com o resultado: suspensa, cancelada, em análise).
- Fecho com uma pergunta curta que resume o vídeo ("Gastar não é crime. Mas se falta dinheiro todo ano, por que a festa cresce e o asfalto não sai?") e o CTA "Segue o @eumagnoleite para mais informações."
- Nada tecnicamente certo que engane. Linguagem didática, frases curtas.
- Entregue junto o título da capa em 4 linhas (pergunta ou virada).

**3. Vídeo (Kit Mapas + Estúdio 3D, igual ao 035)**
- Abertura com o Kit Mapas voando até o município e a etiqueta do valor arrecadado em 2024.
- Maquete: cofre no centro, casinhas dos setores em volta da mesa na ordem da fala. A pilha de cada ano nasce em volta do cofre na palavra "gastou" (dourado 2024, verde 2025, rosa 2026), e a cada setor falado as pilhas voam do cofre para a casinha. 1 pilha = R$ 2 mi.
- Câmera andando sempre para o mesmo lado, sem ficar indo e voltando entre as casas; na virada de ano sobe e recomeça.
- Torre vermelha "A MAIS" ao lado do cofre quando faltar dinheiro.
- Bloco "de onde veio" (desde 08/11/2026): quatro entradas chegando ao cofre (MUNICÍPIO, UNIÃO, ESTADO, FUNDEB), uma de cada vez na palavra falada, cada uma com plaquinha do valor presa à entrada. RITMO DIDÁTICO (pedido do Magno): rápido, mas dá para ler e entender de primeira; cada plaquinha nova fica pelo menos 2,5 s parada e legível antes da próxima; no máximo 2 informações novas na tela ao mesmo tempo; texto grande; nada some antes de a fala terminar de citar.
- Plaquinhas pequenas presas aos objetos, em TODOS os setores falados, por menor que seja o valor; ao falar um setor, aparecem também as plaquinhas dos anos anteriores daquele setor, cada uma na sua cor. Nunca cartão grande tapando a maquete.
- Setor zerado: casinha cinza com a explicação do zero.
- Cenas dos achados (gavetas reservado x usado, rua da obra do Estado, pastas do Tribunal com carimbos).
- Marca d'água @eumagnoleite pequena e sutil quicando pela tela o vídeo todo.
- Sem rio na mesa fora de Itabuna; nada tapando o setor do final.
- Folha "PDF" de receita e despesa em todo ano (desde 08/11/2026, regra 28): folha de papel meio transparente num canto livre (y≥600, sem tapar plaquinha; reservar o espaço na câmera), com a receita do ano item a item (valor exato do PCMGE016/Balanço, somando o total falado) e, nos setores, a despesa do ano por setor. Não é falada. Ferramenta tools/lista_pdf/lista_pdf.py.
- Casinhas e prédios nunca afundados no tampo: base um pouco acima da mesa, corpo inteiro visível (principalmente na borda).

**4. Entrega (em `edicoes/NNN. orçamento de [município]/`)**
- `[MUNICÍPIO].mp4`, `[MUNICÍPIO] - capa.jpg` (fundo de um quadro com o achado principal, título legível sem sumir sobre objeto da mesma cor) e `[MUNICÍPIO] - legenda.txt` com até 2.200 caracteres.
- Legenda: gancho, um tópico por ano só com valores, uma linha "De onde veio o dinheiro" (próprio / União / Estado / Fundeb), os achados, o Tribunal, os zeros com asterisco, o bloco ⚖️ AVISO jurídico, a pergunta do fecho, o CTA e as hashtags. Separado, o comentário fixado com a lista de documentos para conferir.
- Atualize o `andamento.md`, a fila de municípios e o `_aprendizados.md` com tudo que eu pedir de diferente.

Regras que não mudam: Instagram só para ler e anotar, nunca interagir; captcha e login ficam comigo; não apagar arquivo meu; todo número com fonte em `audio/fontes.md`.
