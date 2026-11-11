# Fontes · 051. orçamento de guanambi (checado em 07/11/2026)

Todos os números de dinheiro vêm dos documentos que a Prefeitura e a Câmara de Guanambi enviaram ao TCM-BA (e-TCM, Consulta Pública: https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam; município GUANAMBI, código 143; Prefeitura UJ 747; Câmara UJ 176). Cópias e textos em `~/Documents/RECEITAS-DESPESAS-GUANAMBI/documentos_tcm/`; contas em `saida/`. Cada PDF foi aberto e conferido por dentro (PREFEITURA MUNICIPAL DE GUANAMBI ou Câmara, competência certa). Cada número foi conferido duas vezes: Anexo 9 contra Anexo 6 (2024 e 2025, bateram em todos os setores) e, em 2026, a leitura por ação contra a soma das linhas "Total do Órgão" do PCMGE015.

## Documentos usados
| Arquivo | O que é |
|---|---|
| 2024_PCAGO015 / 2025_PCAGO015 | Balanço Orçamentário (receita realizada e despesa empenhada) |
| 2024_PCAGO007 / 2025_PCAGO007 | Anexo 9, despesa por órgão e função (com a Câmara) |
| 2024_PCAGO004 / 2025_PCAGO004 | Anexo 6, despesa por ação (bate com o Anexo 9) |
| 2024_PCAGO008 / 2025_PCAGO008 | Anexo 10, receita (procura de precatório: nada em 2024 e 2025) |
| 2024-11 / 2025-12 / 2026-09 PCMGE015 | Despesa por ação, com dotação inicial (Prefeitura). O de 12/2024 veio como "Declaração de não existência" (inconsistência no SIGA), por isso o detalhe de 2024 vem do Anexo 6 e do PCMGE015 de 11/2024 |
| 2024-12 / 2025-12 / 2026-09 PCMGE016 | Receita (Prefeitura) |
| 2026-09_CAMARA_PCMGE015 | Despesa da Câmara até set/2026 |
| decisoes/*.pdf | Deliberações do TCM-BA |

## Receita (o que o município declarou que arrecadou)
- 2024: R$ 405.669.813,42 (PCAGO015, "SUBTOTAL DAS RECEITAS"). Confere com o PCMGE016 12/2024: arrecadada R$ 419.851.733,62 menos anuladas R$ 14.181.920,20 = 405.669.813,42 (as deduções do Fundeb não são descontadas no Balanço de Guanambi). Fala: "405 milhões e 700".
- 2025: R$ 456.920.564,11 (PCAGO015), com Operações de Crédito de R$ 15.000.000,00 (empréstimo) dentro. Fala: "456 milhões e 900, contando um empréstimo de 15 milhões".
- 2026 até set: R$ 380.467.222,16 = arrecadada até o mês R$ 381.003.328,96 menos anuladas R$ 536.106,80 (PCMGE016 09/2026, linha TOTAL). Conta própria, no mesmo critério que bateu com o Balanço de 2024. Inclui R$ 12.712.549,47 (precatório Fundef, principal) + R$ 16.210.391,32 ("Outras Receitas Não Arrecadadas e Não Projetadas", que são os juros do precatório, ver abaixo) = R$ 28.922.940,79, e R$ 5 mi de operação de crédito. Fala: "380 milhões e meio, com quase 29 milhões dos precatórios".

## Despesa total
- 2024: R$ 416.541.699,46 empenhado (PCAGO015; Anexo 9 = 416,54). 416,54 − 405,67 = R$ 10,87 mi a mais. Fala: "Gastou 416 e meio. Quase 11 milhões a mais".
- 2025: R$ 474.195.185,55 empenhado (PCAGO015; Anexo 9 = 474,20). 474,20 − 456,92 = R$ 17,27 mi a mais. Fala: "Gastou 474. São 17 milhões a mais". O Balanço 2025 registra superávit financeiro de anos anteriores de R$ 2.322.000,00 usado para abrir crédito.
- 2026 até set: liquidado Prefeitura R$ 354.779.168,15 (soma das linhas "Total do Órgão" do PCMGE015 09/2026; o órgão 1 Câmara aparece nele com R$ 0) + Câmara R$ 10.948.196,84 (PCMGE015 da Câmara 09/2026) = R$ 365.727.364,99. Empenhado: 420.068.161,03 + 12.974.086,94 = R$ 433.042.247,97, ou seja, R$ 67,3 mi além do liquidado (aprendizado do 037). Fala: "Já gastou 365 e 700, e comprometeu mais 67".

## Setores (R$ milhões; 2024 e 2025 empenhado = Anexo 9 e Anexo 6; 2026 liquidado até set no PCMGE015)
| Setor (função) | 2024 | 2025 | 2026 até set | Fala |
|---|---|---|---|---|
| Educação (12) | 138,059 | 163,401 | 134,211 | 138 / 163 / 134 |
| Saúde (10) | 129,018 | 144,937 | 107,013 | 129 / 145 / 107 |
| Administração (04) | 16,557 | 19,980 | 15,394 | 16 e meio / 20 / 15 e 400 |
| Obras e serviços urbanos (15 Urbanismo) | 54,492 | 61,238 | 33,093 | 54 e meio / 61 / 33 |
| Câmara (01) | 10,121 | 12,991 | 10,948 (PCMGE015 Câmara) | 10 e 100 / 13 / 11 |
| Dívidas (28 Encargos especiais) | 21,228 | 25,500 | 21,790 | 21 e 200 / 25 e meio / 21 e 800 |
| Cultura (13, sem a ação de esporte) | 11,134 | 16,453 | 12,500 | 11 e 100 / 16 e meio / 12 e meio |
| Assistência social (08) | 7,665 | 7,423 | 6,686 | 7 e 700 / 7 e 400 / 6 e 700 |
| Água e saneamento (17) | 12,930 | 1,871 | 6,779 | 12 e 900 / 1 e 900 / 6 e 800 |
| Agricultura (20) | 4,297 | 3,283 | 2,615 | 4 e 300 / 3 e 300 / 2 e 600 |
| Esporte (ação "Gestão das ações de esporte e lazer", lançada na função 13 em 2024 e 2025; função 27 em 2026) | 0,559 | 0,259 | 0,138 | 560 mil / 260 mil / 140 mil |
| Meio ambiente (18) | 1,879 | 2,097 | 1,288 | 1 e 900 / 2 e 100 / 1 e 300 |

Fora da fala: Segurança pública/Guarda de Trânsito (06) 2,395 / 3,550 / 2,979 (regra: não entra); Desenvolvimento econômico (22) 2,656 / 2,627 / 2,924; PPP (23) 0 / 4,458 / 3,664; Transporte (26) 1,759 / 1,860 / 1,986; Assessoria jurídica (03) 1,697 / 2,269 / 1,674; Comunicações (24) 0,095 / 0 / 0; Habitação (16) 0 / 0 (reservou R$ 979 mil) / 0,043.

- Água e saneamento 2024: R$ 10,996 mi no Fundo Municipal de Saneamento Básico. A ação "Gestão das ações de saneamento básico" (8.50.17.512.4.2.2031) tinha em 11/2024 R$ 6.036.000,00 empenhados em "Outras despesas de pessoal decorrentes de contratos de terceirização" e R$ 3.209.000,00 em serviços de pessoa jurídica (PCMGE015 11/2024). Essa ação não existe em 2025 (Anexo 6 e PCMGE015 12/2025). Por isso a fala diz "a maior parte em terceirizados e serviços" e "esses contratos saíram dessa conta", sem dizer para onde foram (não está provado). Em 2025 a "Coleta e destinação de resíduos sólidos" foi de R$ 3,489 mi (2024) para R$ 16,987 mi, possível troca de linha: não usado na fala.

## Zeros (investigados)
- Defesa civil: a ação "Gestão dos recursos da COMDEC" (04.182) existe nos três anos com dinheiro reservado (R$ 16 mil ou mais em 11/2024; dotação inicial R$ 69 mil em 2025 e R$ 73 mil em 2026) e R$ 0 empenhado nos três anos (Anexo 6 2024 e 2025, PCMGE015 09/2026). Nenhuma receita com esse nome (PCMGE016 e Anexo 10). Fala: "dinheiro reservado nos três anos e nenhum real gasto".
- Proteção animal: nenhuma ação, subfunção ou receita com "animal", "zoonose", "castração" ou "bem-estar" nos PDFs de 2024, 2025 e 2026 (procurado no Anexo 6, PCMGE015 11/2024 e 09/2026, PCMGE016 e Anexo 10). Fala: "nem aparece no orçamento".
- Esporte não é zero: está dentro da Cultura em 2024 e 2025 (ver tabela).

## Achados
- Festas ("Gestão das ações e promoção de eventos populares", 13.392, ação 2062): 2024 R$ 7,284 mi (Anexo 6). 2025: dotação inicial R$ 5.602 mil, final R$ 13,355 mi, empenhado R$ 13.354 mil (PCMGE015 12/2025; Anexo 6 = 13,354). Assistência social 2025 = 7,423 → 13,354 ÷ 7,423 = 1,8 ("quase o dobro"). 2026: dotação inicial R$ 5,973 mi, final 12,245, liquidado R$ 10,514 mi até set. A dotação cresceu por crédito adicional; não está provado de onde saiu, então a fala não diz "tirou de".
- Drenagem e urbanização do Canal do Belém (15.451, ação 2.2090): dotação inicial e atual R$ 8.750.000,00, R$ 0 empenhado até set/2026 (PCMGE015 09/2026). Fala: "8 milhões e 750 reservados, e zero gasto".
- Fora da fala (para legenda ou plano): estradas e pavimentação (ação 1.1008) 2026 reservou R$ 20,406 mi, liquidou R$ 4,316 mi; rodoviária R$ 2,23 mi e avenida sanitária R$ 1,76 mi reservados, zero gasto.

## Obra do Estado
- Ampliação do Hospital Geral de Guanambi: obra do Governo da Bahia (ordem de serviço em 13/05/2026). Jornal Grande Bahia, maio/2026: https://jornalgrandebahia.com.br/2026/05/governador-jeronimo-amplia-hospital-geral-de-guanambi-e-anuncia-novos-investimentos-em-saude-agua-e-infraestrutura/ e Governo da Bahia (ba.gov.br, comunicação, maio/2026). Os valores divergem (R$ 77,6 mi numa matéria, R$ 82 mi no título de outra): por isso a fala não diz o valor.

## Precatórios do Fundef (pedido do seguidor)
- O que é: diferença que a União deixou de repassar ao Fundef entre 1998 e 2006, reconhecida na Justiça (processo no TRF, acordo com a União em abril de 2025). Agência Sertão, 07/04/2025: https://agenciasertao.com/2025/04/07/prefeitura-de-guanambi-fechou-acordo-para-receber-r-835-milhoes-do-antigo-fundef/ e Fala Você, 07/04/2025: R$ 83.563.939,05 "já corrigido com juros de mora", em três parcelas anuais (2026, 2027 e 2028).
- ATENÇÃO, divergência: a nota da prefeitura (05/11/2026) diz que R$ 28.922.940,79 são "40% do montante total", o que daria R$ 72,3 mi, e não R$ 83,6 mi. Por isso o valor total do acordo NÃO entra na fala.
- Nota oficial da Prefeitura, Secretaria de Administração, 05/11/2026: https://guanambi.ba.gov.br/noticias/informacoes-sobre-o-pagamento-dos-precatorios-do-fundef-30478/ . Recebido R$ 28.922.940,79; principal R$ 12.712.549,47 (60% rateio, 40% educação); juros "de R$ 16.621.391,32", tratados como recurso livre; saldo da conta dos 60% em 29/10/2026 R$ 7.891.141,52; reserva de 3% R$ 236.734,25 por 5 anos; rateio R$ 7.654.407,27; 8.069.499 horas; R$ 0,95 por hora; ativos já pagos, inativos até 17/11, falecidos por depósito judicial.
- Conferência no TCM (PCMGE016 09/2026): "1.7.1.9.56 Transferências decorrentes de decisão judicial (precatórios) relativas ao FUNDEF" = R$ 12.712.549,47 arrecadados, sem previsão no orçamento; "1.9.9.9.99.2 Outras Receitas Não Arrecadadas e Não Projetadas" = R$ 16.210.391,32. 12.712.549,47 + 16.210.391,32 = 28.922.940,79, exatamente o total da nota. Logo, os juros são R$ 16.210.391,32 e o "16.621.391,32" da nota é erro de digitação (a soma da nota não fecha com ele: daria 29.333.940,79). Fala: "16 e 200 de juros".
- Conta própria: 60% do principal = R$ 7.627.529,68 (o rateio de 7.654.407,27 é maior porque somou rendimentos e tirou a reserva de 3%); 7.654.407,27 ÷ 8.069.499 = R$ 0,9486 por hora. 60% dos juros = R$ 9.726.234,79 ("seriam mais 9 milhões e 700 nesta parcela").
- Já gasto da conta do precatório até set/2026 (PCMGE015 09/2026, unidade 4.59 "Precatórios do Fundef", ação 2.6039, fonte 1544): R$ 3.067.922,92 liquidados, dos quais obras em andamento R$ 1.854.085,01, mobiliário R$ 610.601,59, serviços de cópias e reprodução R$ 328.908,04, manutenção de imóveis R$ 55.598,55, outros. Fora da fala (cabe na legenda).
- Lei: EC 114/2021 (art. 5º, parágrafo único, ADCT: pelo menos 60% dos precatórios do Fundef aos profissionais do magistério, como abono, sem incorporar ao salário) e Lei 14.113/2020, art. 47-A (incluído pela Lei 14.325/2022).
- Juros: STF, ADPF 528 (relator Alexandre de Moraes, março de 2022) e RE 1.428.399 (repercussão geral): os juros de mora do precatório do Fundef não ficam presos à educação (podem até pagar honorários). Migalhas/Lex e Conjur (2022). Fala: "O Supremo já decidiu que os juros não ficam presos à educação".
- Projeto: PL 6399/2025 (Câmara dos Deputados) quer incluir principal, correção e juros de mora na base dos 60%. Em análise (Mix Vale, 30/07/2026; Sou Brasília, jul/2026). Fala: "Um projeto na Câmara dos Deputados quer incluir os juros".
- Imprensa confundiu: iGuanambi (27/10/2026, ASCOM) e Blog Vandinho Maracás disseram que a primeira parcela aos professores "soma R$ 12.712.549,47". Pela nota oficial, esse é o principal; o rateio foi de R$ 7.654.407,27.
- O impasse entre professores e prefeitura chegou pelo seguidor; não achei matéria nem posição pública da APLB ou dos professores de Guanambi. A fala não afirma o que os professores alegam além de "o pedido do seguidor".

## Tribunal (TCM-BA › Decisões › Auditoria, Prefeitura de Guanambi, consulta em 07/11/2026)
- 27 processos com número de 2024 a 2026 (denúncias, termos de ocorrência e uma tomada de contas). Julgados (5): 22695e25 (concorrência 007/2025, manutenção predial) procedência parcial com ADVERTÊNCIA, 19/08/2026; 07464e24 (concorrência 09/23) improcedente, 02/06/2026; 19407e25 (postes e luminárias LED) improcedente, 23/07/2026; 18537e24 (cópias e arquivologia, PE 024-24) extinto porque a prefeitura revogou a licitação, 11/06/2025; 16814e24 (computadores) julgado em 17/06/2025. Sem julgamento (22), entre eles 01835e25 (reprografia, PE 004-25), 25103e26 (horas-máquina 2024 a 2026), 31224e26 (contratação de empresa de diversões pela Educação, 2026), 21981e26 (contrato do Fundo de Saúde), 14096e26 (temporários sem seleção). Fala: "22 processos abertos desde 2024 esperam julgamento". Sem nome de gestor.

## Notas para a voz
- "Guanambi" é oxítona: no texto da voz, "Guanambí".
- "Fundef": "fundéfi". "TCM" não aparece na fala.

## Versão 2 do roteiro (07/11/2026, pedido do Magno: mais didático nos precatórios e com as fontes na fala)
- "Precatório é dívida que a Justiça mandou pagar": definição geral (Constituição, art. 100).
- "A União deixou de pagar à educação de Guanambi entre 1998 e 2006" e "Segundo a Agência Sertão, são três parcelas, até 2028": Agência Sertão, 07/04/2025 (link acima).
- "Pela nota da prefeitura, 12 e 700 são a dívida, e 16 e 200, juros pelo atraso": nota oficial de 05/11/2026 + PCMGE016 09/2026 (juros conferidos: 16.210.391,32).
- "O site iGuanambi chegou a falar em 12 e 700 para os professores, mas esse é o valor da dívida": iGuanambi, 27/10/2026 (fonte ASCOM/PMG): "A primeira parcela [...] soma R$ 12.712.549,47". https://www.iguanambi.com.br/noticias/2026/10/27/prefeitura-de-guanambi-iniciara-pagamento-dos-precatorios-do-fundef-na-proxima-semana/
- "Quem decide é a Justiça": a regra dos 60% e a base de cálculo são decididas pelo Judiciário (ADPF 528, RE 1.428.399, ações individuais no TJBA).
- Saiu da fala na v2: o hospital (obra do Estado, sem valor confirmado), para caber o tempo.
