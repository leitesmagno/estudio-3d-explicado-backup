# Fontes: 037. orçamento de itajuípe

Checado em 07/11/2026. Fonte principal: e-TCM, Consulta Pública do TCM-BA (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município ITAJUÍPE (185), Prefeitura (UJ 789), Câmara (UJ 218), SAAE (UJ 1048). Arquivos em `~/Documents/RECEITAS-DESPESAS-ITAJUIPE/documentos_tcm/`.

## Documentos usados
| Arquivo | O que é |
|---|---|
| 2024_TCM_ANUAL__PCAGO015 / 2025_..._PCAGO015 | Balanço Orçamentário (Anexo 12), consolidado (Prefeitura, Câmara, fundos e SAAE) |
| 2024/2025_TCM_ANUAL__PCAGO008 | Anexo 10, receita arrecadada (TOTAL GERAL = mesmo valor do Balanço) |
| 2024/2025_TCM_ANUAL__PCAGO007 | Anexo 9, despesa empenhada por órgão e função |
| 2024/2025_TCM_ANUAL__PCAGO004 | Anexo 6, programa de trabalho por ação (soma bate centavo por centavo com o Anexo 9) |
| 2024-12 / 2025-12 / 2026-09_TCM_MENSAL__PCMGE015 | Despesa por ação, Prefeitura (dotação inicial, atualizada, empenhado, liquidado) |
| 2024-12 / 2025-12 / 2026-09_TCM_MENSAL__PCMGE016 | Receita da Prefeitura |
| 2026-09_TCM_CAMARA__PCMGE015 | Despesa da Câmara até set/2026 |
| 2026-09_TCM_SAAE__PCMGE015 / PCMGE016 | Despesa e receita do SAAE até set/2026 (PDF escaneado, lido na imagem: resumo da p. 5 e totais da receita) |

## Receita (o que o município declarou ao TCM)
- 2024: R$ 126.520.814,78 (PCAGO015 "Receitas realizadas" = PCAGO008 "TOTAL GERAL"). Fala: "126 milhões e meio".
- 2025: R$ 137.939.235,90 (idem). Fala: "137 milhões e 900".
- 2026 até set: R$ 110.575.570,57 = Prefeitura R$ 107.027.995,71 (PCMGE016 09/2026, "Arrecadada até mês", linha TOTAL) + SAAE R$ 3.547.574,86 (PCMGE016 SAAE 09/2026, "Total até mês"). Conta própria: soma das duas unidades para ficar igual aos anos fechados, que já somam o SAAE. Conferido: em 2024 e 2025, Prefeitura (PCMGE016 dez) + SAAE = total do Balanço.

## Despesa (2024 e 2025 empenhada, Anexo 9; 2026 liquidada até set)
Valores em R$ milhões.
| Setor (como é falado) | Origem | 2024 | 2025 | 2026 até set |
|---|---|---|---|---|
| Educação | função 12 | 44,484 | 48,757 | 39,591 |
| Saúde | função 10 | 19,964 | 20,101 | 15,328 |
| Administração da prefeitura | função 04 sem o SAAE + função 02 (Procuradoria) + 22 (2026) | 25,148 | 31,945 | 26,156 |
| Obras e serviços urbanos | função 15 | 6,525 | 10,866 | 5,698 |
| Câmara de Vereadores | função 01 / PCMGE015 Câmara | 3,131 | 3,637 | 2,985 |
| Dívidas e sentenças | função 28 (Encargos gerais: INSS e parcelamentos, sentenças judiciais) | 9,364 | 9,140 | 3,831 |
| Cultura | função 13 | 4,109 | 2,852 | 5,444 |
| Assistência social | função 08 | 3,787 | 4,305 | 2,906 |
| Água e esgoto (SAAE) | órgão 4 SAAE, lançado na função 04 | 3,808 | 4,174 | 3,211 |
| Esporte | função 27 | 0,940 | 0,374 | 0,354 |
| **Total** | | **121,259** | **136,152** | **105,503** |
- 2026: Prefeitura R$ 99.307.304,45 liquidado (PCMGE015 09/2026, "Total do Poder") + Câmara R$ 2.984.625,78 + SAAE R$ 3.211.201,34.
- 2026 empenhado (comprometido): Prefeitura 105.992.180,51 + Câmara 3.500.736,88 + SAAE 4.076.399,51 = 113.569.316,90, acima do arrecadado. Por isso a fala de 2026 NÃO diz "sobrou": diz "gastou 105 e meio e já comprometeu mais 8 milhões" (113,57 − 105,50 = 8,07).
- Sobra: 2024 = 5,262 mi (o próprio Balanço mostra "Superávit" R$ 5.261.987,67); 2025 = 1,788 mi (Balanço: R$ 1.787.715,39); 2026 até set = 5,072 mi (conta própria, liquidado x arrecadado; pode mudar até dezembro, por isso "por enquanto").
- Observação: o PCMGE015 de dez/2024 da Prefeitura soma R$ 108,2 mi empenhados, abaixo do Anexo 9 (Prefeitura sem Câmara e SAAE = 114,3 mi). Valeu o Anexo 9/Anexo 6 do balanço anual. Em 2025 os dois batem (128,34 mi).

## Conferência dos zeros (feedback-conferir-acoes-antes-de-zero)
- **Agricultura (funções 20 e 21)**: as ações "Promoção e desenvolvimento de atividades de agronegócios", "Fomento à assistência técnica rural" e "Organização produtiva dos trabalhadores rurais" existem com dotação pequena (13 a 24 mil) e R$ 0 gasto em 2024, 2025 e 2026. A Secretaria Municipal de Agricultura e Meio Ambiente (unidade 031313, conjunta) só gastou salário e manutenção, lançados em Administração: R$ 97 mil (2024), R$ 159 mil (2025), R$ 121 mil (2026 até set). Busca por AGRIC, RURAL, AGRONEG em despesa e receita: nada além disso (só dedução do ITR na receita).
- **Meio ambiente (função 18)**: nenhuma ação de gestão ambiental nos três anos. O único lançamento com o nome é o elemento "Serviços de controle ambiental" (R$ 410 mil em 2025, R$ 278 mil em 2026) dentro de "Manutenção dos serviços de utilidade pública" (limpeza urbana), que já está em "Obras e serviços urbanos". Secretaria é a mesma da agricultura.
- **Defesa civil e proteção animal**: nenhuma ação, nenhuma subfunção 182, nenhuma linha de receita com esses nomes (busca DEFESA CIVIL, ANIMAL, ZOONO, CASTRA em PCMGE015/016 e Anexo 10). Segurança pública (função 06): fora do vídeo por regra.
- **Transporte**: a ação "Melhoria do acesso à zona rural" (função 26) teve R$ 0, mas o transporte escolar está em Educação (R$ 137 mil, 501 mil, 125 mil). Por isso o roteiro NÃO diz "transporte zero"; diz "estradas da zona rural... receberam zero".
- **Saneamento (função 17)**: "Obras de drenagem, contenção de encostas e saneamento" com dotação de 7 a 9 mil e R$ 0. A água e o esgoto são do SAAE (autarquia), por isso o setor é falado como "Água e esgoto, pelo SAAE".
- **Habitação (16)**: "Construção de unidades habitacionais", dotação de 9 a 12 mil, R$ 0. Não entrou na fala.

## Achados
1. **Festas x assistência social, 2026** (PCMGE015 09/2026, liquidado): "Realização dos festejos do Micapedro" R$ 4.481 mil (dotação inicial 3,029 mi, atualizada 4,607 mi) + "Apoio à festa de São Sebastião" R$ 858 mil (inicial 57 mil) = R$ 5,339 mi. Assistência social (função 08) inteira: R$ 2,906 mi. "Gestão do bloco dos benefícios eventuais": dotação inicial R$ 1.912 mil, atualizada R$ 970 mil (liquidado 899 mil). Benefício eventual = ajuda de emergência da assistência (Lei 8.742/1993, art. 22). Nos anos anteriores: Micapedro 2,862 mi (2024) e 2,146 mi (2025); assistência 3,787 e 4,305.
2. **Obras reservadas x feitas**: "Implantação, ampliação e melhoria de obras de infraestrutura" 2024: dotação inicial R$ 10.948 mil, atualizada 2.553 mil, empenhado 2.064 mil (Anexo 6). A Secretaria de Desenvolvimento Urbano caiu de 18,8 para 12,9 mi no ano: parte foi para manutenção da própria secretaria e limpeza (+2,8 mi), o resto saiu da secretaria. Por isso a fala é só "reservaram quase 11, só 2 viraram obra", sem dizer para onde foi. 2025: 6,99 inicial, 5,55 usado. 2026: 3,57 inicial, 2,10 liquidado.
   "Melhoria do acesso à zona rural": dotação inicial 255 mil (2024), 280 mil (2025), 341 mil (2026); R$ 0 nos três.
3. **Obra do Estado**: Casa Civil da Bahia, 17/04/2026, "Em Itajuípe, Governo da Bahia realiza entregas que somam mais de R$ 14,7 milhões": ampliação do Colégio Estadual de Tempo Integral (antigo Polivalente), R$ 13,9 mi (SEC); cobertura da arquibancada do Estádio Humberto Badaró, R$ 816,4 mil (Sudesb). https://www.ba.gov.br/casacivil/noticias/2026-04/3435/em-itajuipe-governo-da-bahia-realiza-entregas-que-somam-mais-de-r-147-milhoes
4. **Precatório do Fundef** (só legenda): ação "Precatório FUNDEF" em Educação, R$ 5,526 mi (2025) e R$ 5,553 mi (2026 até set); receita "Transferências decorrentes de decisão judicial, precatório Fundef" R$ 7,30 mi em 2025 (Anexo 10).
5. **Entregas ao TCM**: todas as 12 prestações mensais de 2024 e o anual de 2024 da Prefeitura constam "Entregue fora do prazo" no e-TCM (jan/2024 enviado em 24/05/2024, dez/2024 em 09/04/2025).

## Tribunal de Contas (TCM-BA, Decisões › Auditoria, Prefeitura de Itajuípe, consulta 07/11/2026)
- **10920e24** (Representação de vereadores): contas de jan, fev e mar/2024 não entregues no prazo → multa de R$ 1.500 ao prefeito, paga com recursos pessoais (por isso a fala diz "o gestor", não "a prefeitura") (2ª Câmara, 01/07/2026); demais pontos sem multa, com recomendações. Situação no site: "Reconsideração/Recurso Ordinário em fase de apreciação". https://www.tcm.ba.gov.br/sistemas/textos/2024/delib/10920e24.odt.pdf
- **29329e25** (Termo de Ocorrência, 4ª Inspetoria): contrato 019/2025 de manutenção da frota, valor total R$ 44.303,09; pagamentos somaram R$ 67.146,07 (R$ 22.842,98 a mais) → procedente, multa de R$ 1.500 (1ª Câmara, 15/04/2026). https://www.tcm.ba.gov.br/sistemas/textos/2025/delib/29329e25.odt.pdf
- **09163e24** (Denúncia, CCX Construções): Concorrência 001/2024, requalificação da pista de caminhada. Cautelar afastou a exigência de quitação no CREA/CAU (ratificada 24/04/2024); mérito procedente só com recomendação (09/04/2025). https://www.tcm.ba.gov.br/sistemas/textos/2024/delib/09163e24.odt.pdf
- **09230e24** (Denúncia, CCX Construções): Concorrência 002/2024, reforma do Paço Municipal, R$ 584.904,65. Mesma cautelar; processo extinto por perda de objeto, porque a prefeitura corrigiu o edital (09/04/2025). https://www.tcm.ba.gov.br/sistemas/textos/2024/delib/09230e24.odt.pdf
- **10884e26** (não julgado): supostas irregularidades no Pregão 007/2025 e contrato 300/2025 com J Prime Serviços, mão de obra de apoio administrativo e operacional.
- **31562e26** (não julgado): Pregão 026/2023 e contrato 198/2024 com WM Locadora, locação de ônibus do transporte escolar (Fundeb, PNATE, PETE).
- Mais antigos, fora do vídeo: 06450e24 e 06508e24 (tomadas de preços de 2023, não julgados), 31012e23 (acumulação de cargos, 2022), 11537e25 e 26712e24 (2022).
- Contas anuais (parecer prévio): não consultado, a página pede captcha (fica com o Magno, se quiser incluir).

## 2ª conferência (07/11/2026, pedido do Magno)
Tabela frase por frase em `~/Documents/RECEITAS-DESPESAS-ITAJUIPE/saida/CHECAGEM_ROTEIRO.md`. Mudanças: 2026 sem "sobrou" (empenhado passa do arrecadado); multa "ao gestor"; "zero em programas" em agricultura e meio ambiente nos 3 anos; obras e zona rural presas ao nome da ação; "dívidas e encargos"; fecho e capa só com o fato de 2026.
