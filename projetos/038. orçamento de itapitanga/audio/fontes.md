# Fontes do roteiro 038. orçamento de itapitanga (checadas em 07/11/2026)

Documentos baixados do e-TCM (Consulta Pública, município 196, Prefeitura UJ 800, Câmara UJ 228): https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam
Cópias em ~/Documents/RECEITAS-DESPESAS-ITAPITANGA/documentos_tcm/ (conferido dentro de cada PDF: município ITAPITANGA e competência certa).
Pagamentos por credor: Portal da Transparência da Prefeitura (Fator Sistemas), https://transparencia.fatorsistemas.com.br/dados/despesa.php?id=pm_itapitanga, jan/2024 a out/2026 (saida/fator_2024_2026.json). Conferido contra o PCMGE056 do TCM: ENGENHAR dez/2024 = R$ 1.130.086,01 e dez/2025 = R$ 978.099,68 nos dois (bate no centavo).

## Receita (o que a prefeitura declarou ao TCM)
| Fato no roteiro | Fonte | Observação |
|---|---|---|
| 2024 arrecadou 70 milhões | PCAGO015 Balanço Orçamentário 2024, "SUBTOTAL DAS RECEITAS" R$ 70.044.634,40 | = PCMGE016 dez/2024 "Arrecadada até mês" |
| 2025 arrecadou 69 milhões e 500 | PCAGO015 2025, R$ 69.490.148,06 | = PCMGE016 dez/2025 69.521.315,60 − anuladas 31.167,54 |
| 2026 até set arrecadou 53 milhões e 300 | PCMGE016 09/2026: arrecadada 54.112.118,19 − anuladas 807.787,49 = 53.304.330,70 | conta própria, mesmo critério que bate com o Balanço 2025 |

## Despesa (2024 e 2025: empenhada, PCAGO007 Anexo 9, inclui a Câmara; 2026: liquidada até set, PCMGE015 09/2026 da Prefeitura + PCMGE015 09/2026 da Câmara)
| Setor | 2024 | 2025 | 2026 até set | Observação |
|---|---|---|---|---|
| Total gasto | 67.162.727,48 | 71.650.554,93 | 55,909 mi + 1.512.396,71 = 57,42 mi | 2024/2025 = Anexo 9 e Balanço; 2026 = soma das ações (scripts/acoes015s.py) |
| Resultado | sobrou 2,88 mi | 2,16 mi a mais | 4,12 mi a mais | conta própria |
| Educação (12) | 26,633 | 27,837 | 23,382 | inclui transporte escolar e merenda |
| Saúde (10) | 14,458 | 13,718 | 11,677 | |
| Administração (04) | 8,634 | 11,262 | 9,337 | sem a ação 2040 da Sec. de Agricultura (conta própria: função 04 − ação 2040). 2025 inclui 1,604 mi de indenizações de programa de desligamento de servidores |
| Obras e serviços urbanos | 9,443 | 9,490 | 7,017 | Urbanismo (15) 9,110/9,490/5,746 + Habitação (16, reforma de edificações públicas) 0,333/0/0 + Transporte (26, estradas vicinais) 0/0/1,271 |
| Câmara (01) | 1,783 | 2,071 | 1,512 | |
| Dívidas (28) | 1,280 | 2,477 | 1,127 | PASEP, encargos e amortização de dívida com o INSS (1,586 mi em 2025) |
| Cultura (13) | 1,614 | 1,624 | 0,550 | |
| Assistência social (08) | 3,019 | 2,705 | 2,228 | |
| Agricultura e meio ambiente | 0,299 | 0,468 | 0,591 | secretaria conjunta "Agricultura, Meio Ambiente, Turismo e Desenv. Rural", ação 2040, lançada na função 04. Funções 18 e 20 sem gasto |
| Água e saneamento (17) | 0 | 0 | 0 | ver zeros |
| Esporte (27) | 0 | 0 | 0 | ver zeros |
Soma dos setores = total do ano (conferido: 67,163 / 71,650 / 57,421). Segurança (06) não citada (regra).

## Zeros (onde procurei)
- **Água e saneamento**: única ação é "ampliação e manutenção da rede de esgotamento sanitário" (17.512, ação 1017), reservada 8 mil/40 mil/40 mil, gasto zero. Nenhuma outra ação com água ou esgoto. A prefeitura paga contas de água à Embasa como consumidora (cerca de 400 mil por ano, Portal Fator) e amortiza uma dívida com a Embasa (106/94/83 mil). Operador: Embasa (ANA, Atlas Esgotos, ficha de Itapitanga: https://portal1.snirh.gov.br/arquivos/atlas_esgoto/Bahia/Relatorio_Geral/Itapitanga.pdf). Fala: "a água da cidade é da Embasa, do Estado".
- **Esporte**: função 27 com 4 ações (praças esportivas, quadras, liga de desportos/estádio, esporte amador), reservado 389 mil (2024), 490 mil (2025), 997 mil (2026); gasto zero nos 3 anos. Fora da função, achei no Portal: material esportivo para o campeonato interbairro pago pela Sec. de Finanças (53 mil, abr–mai/2024), material esportivo e futmesas pela Administração (cerca de 13 mil em 2026), material de educação física e serviço residual de quadra escolar pela Educação (cerca de 42 mil em 2026). Por isso a fala diz "zero em programas" e "os programas de esporte, nada".
- **Agricultura e meio ambiente**: NÃO é zero (secretaria conjunta na função 04). Dito como "numa secretaria só".

## Achados
| Fato no roteiro | Fonte | Observação |
|---|---|---|
| maior fornecedor é de mão de obra terceirizada | Portal Fator: maiores credores fora de folha e INSS nos 3 anos | ENGENHAR PRESTAÇÕES DE SERVIÇOS EIRELI (CNPJ 20.324.954/0001-67) e GRAAD EMPREENDIMENTOS LTDA (CNPJ 37.791.470/0001-20) |
| 4 milhões e 900 em cinco meses de 2024 | Portal Fator, contrato 102-2024 (pregão eletrônico), "serviços continuados de apoio às atividades operacionais e administrativas", pagamentos ago–dez/2024: R$ 4.853 mil | |
| 8 e 700 em 2025 | idem, contrato 102-2024, 2025: R$ 8.669 mil | |
| 2026, outra empresa, 8 e 700 até setembro | GRAAD, contrato 191/2025 (pregão p/ registro de preços), "terceirização de mão de obra de serviços profissionais municipais", pagamentos jan–set/2026: R$ 8.688 mil (9,62 mi até out) | quase 1 milhão por mês = 8,69 ÷ 9 = 0,97 mi (conta própria). Pago por Educação, Obras, Administração, Saúde e Assistência |
| festas quase 1 milhão e meio (2024) e quase 1 e 600 (2025) | PCMGE015 dez, ação 2008 "Realização de festividades populares": 1.453 mil / 1.577 mil | 2026 até set: 502 mil |
| pavimentação de ruas, 500 mil e quase 1 milhão | PCMGE015 dez, ação 1024 "Pavimentação e recuperação de ruas, avenidas e praças": 504 mil / 975 mil | |
| programas de esporte, nada | ver zeros | |
| 2026: pavimentação previa 1 milhão e 900 e usou 290 mil | PCMGE015 09/2026, ação 1024 "Pavimentação e recuperação de vias públicas": fixada 1.910 mil, liquidado 294 mil | dotação atual foi reduzida para 966 mil |
| estradas vicinais previam 96 mil e já usaram 1 e 300 | PCMGE015 09/2026, ação 1022 "Recuperação e manutenção de estradas vicinais": fixada 96 mil, liquidado 1.271 mil | contratos via consórcio (Trígono Construtora, RP compartilhado 001-2026) e RJF Engenharia (135-2023). "Enquanto isso": não afirmo que o dinheiro saiu de uma ação para a outra |
| 5 milhões de 2026 pagaram contas de anos anteriores | PCMGE015 09/2026, elementos "Despesas de exercícios anteriores" (x.x.9x.92): 5,02 mi liquidados | 2024: 1,64 mi; 2025: zero |
| colégio estadual novo, de 20 milhões, obra do Estado | Jornal Grande Bahia, 22/01/2026: https://jornalgrandebahia.com.br/2026/01/governador-jeronimo-entrega-investimentos-em-saude-educacao-e-infraestrutura-e-autoriza-obras-estruturantes-em-itapitanga/ | "investimento total de R$ 20 milhões", 60% executado em jan/2026 |

## Tribunal de Contas (TCM-BA › Decisões › Auditoria, Prefeitura de Itapitanga, consultado em 07/11/2026)
| Fato no roteiro | Processo | Situação |
|---|---|---|
| vereador denunciou 484 temporários, mais que os 389 concursados | 29089e25 (denúncia com cautelar, exercício 2025): https://www.tcm.ba.gov.br/sistemas/textos/2025/voto/29089e25MC.odt.pdf | números são da denúncia (ago/2025) |
| decisão provisória proibiu novos temporários sem seleção | idem: cautelar deferida em 09/06/2026 (DOE 10/06/2026), ratificada em 19/08/2026 | parcial: não suspendeu os contratos atuais; 60 dias para cronograma de substituição |
| analisa a terceirização | 33848e25 (termo de ocorrência, 2024–2025): "contratações de pessoal, incluindo serviços de terceirização de mão de obra, servidores temporários e cargos comissionados" | não julgado |
| combustível de 4 milhões e meio | 23188e25 (representação do MP de Contas): pregão 003/2025, contrato 037/2025, valor estimado R$ 4.500.359,79. https://www.tcm.ba.gov.br/sistemas/textos/2025/voto/23188e25MC.odt.pdf | cautelar indeferida (01/11/2025); segue em análise |
| limpeza urbana de 2 e 400 | 22138e26 (denúncia): pregão 014/2026, contrato 115/2026, R$ 2.376.000,00. https://www.tcm.ba.gov.br/sistemas/textos/2026/voto/22138e26MC.odt.pdf | cautelar indeferida (26/08/2026); segue em análise |
Outros processos não usados: 16819e25, 24828e25 (royalties, cautelar indeferida), 25629e25 (apensado ao 29089e25), 01538e26, 22870e25, 23544e25, 16948e24 (combustível 2023–2024, procedente em parte, julgado 19/02/2025).

## Conferir antes de publicar
- Se a prefeitura entregou 10/2026 ao TCM até a publicação (os números de 2026 são até setembro).
- Situação dos processos 29089e25, 33848e25, 23188e25 e 22138e26.
