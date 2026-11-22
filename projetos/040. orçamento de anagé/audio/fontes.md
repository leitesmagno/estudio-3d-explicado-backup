# Fontes: 040. orçamento de anagé (checado em 07/11/2026)

Documentos baixados do e-TCM (Consulta Pública, município 13 ANAGÉ, Prefeitura UJ 617, Câmara UJ 47), salvos em `~/Documents/RECEITAS-DESPESAS-ANAGE/documentos_tcm/`. Cada PDF foi aberto e conferido (cabeçalho "ANAGÉ" e competência certa).
Sistema: Fator SIAFIC (anuais e 12/2025, "Modelo 01") e SIGA do TCM (12/2024 e 07/2026). Scripts: `scripts/anexo9b.py` (Anexo IX), `acoes015a.py` (SIGA), `acoes015b.py` (Modelo 01), `obras44.py`, `listar.py`. Tabela de ações em `saida/acoes_listadas.txt`.

## Receita (só o total declarado ao TCM, "arrecadou")
| ano | valor | documento |
|---|---|---|
| 2024 | R$ 98.401.048,30 | PCAGO015 Balanço Orçamentário 2024, "SUBTOTAL DAS RECEITAS (III)", coluna Realizada (= PCMGE016 12/2024 "Total Até Mês" 98.401.129,32) |
| 2025 | R$ 108.494.312,29 | PCAGO015 2025, "SUBTOTAL DAS RECEITAS (III)" (= PCMGE016 12/2025 "TOTAL GERAL DA RECEITA ORÇAMENTÁRIA") |
| 2026 jan–jul | R$ 61.042.997,14 | PCMGE016 07/2026, RESUMO "Totais: Total Até Mês" (as deduções do Fundeb já vêm em linhas negativas, igual a 2024) |

## Despesa
- 2024 e 2025: empenhada, PCAGO007 Anexo IX (Prefeitura + Câmara + fundos). 2024 = R$ 97.712.828,03; 2025 = R$ 114.212.023,12 (batem com o "SUBTOTAL DAS DESPESAS" do Balanço).
- 2026 jan–jul: liquidada, PCMGE015 07/2026 da Prefeitura (R$ 59.782.171,69) + PCMGE015 07/2026 da Câmara (R$ 2.448.625,59, soma das 4 ações) = R$ 62,23 mi.
- Resultado: 2024 sobrou R$ 688.220,27 (linha "Superávit (XIII)" do Balanço); 2025 faltou R$ 5.717.710,83 (linha "Déficit (VI)"); 2026 até julho: 62,23 − 61,04 = R$ 1,19 mi a mais (conta própria).

## Setores (R$ milhões) e como foram agrupados
| setor (fala) | funções somadas | 2024 | 2025 | 2026 até jul (liq.) |
|---|---|---|---|---|
| Educação | 12 | 37,246 | 40,680 | 20,411 |
| Saúde | 10 | 21,753 | 26,219 | 15,817 |
| Administração | 04 + 02 (consórcio/procuradoria, 45 mil) | 9,265 | 11,927 | 7,355 |
| Obras e serviços urbanos | 15 Urbanismo + 25 Energia (iluminação) + 26 Transporte (só 2026: o Depto. de Estradas saiu da 15 para a 26) | 10,141 | 14,210 | 7,750 |
| Câmara | 01 | 3,220 | 3,995 | 2,449 |
| Dívidas e encargos | 28 | 4,857 | 5,838 | 1,528 |
| Cultura, esporte e lazer (secretaria conjunta, função 13 "Cultura, Esporte e Lazer") | 13 | 4,357 | 3,567 | 2,791 |
| Assistência social | 08 | 2,142 | 2,631 | 1,542 |
| Água | 17 (ação "eficientização do sistema de abastecimento de água") | 0,444 | 0,526 | 0,321 |
| Agricultura | 20 | 0,678 | 0,910 | 0,555 |
| Meio ambiente | 18 | 3,608 | 3,709 | 1,714 |
| TOTAL | | 97,711 | 114,212 | 62,233 |
- A limpeza pública (ação 15.542 "Gestão do serviço de limpeza pública", Sec. de Meio Ambiente) está dentro de Obras e serviços urbanos (função 15).
- Transporte escolar (PNATE) está em Educação. Não há função Transporte em 2024 e 2025; em 2026 a função 26 é o Depto. de Estradas e a Sec. de Transportes, somados em Obras.
- Segurança pública ("Gestão da segurança pública", 22 a 27 mil reservados, ~0 gasto): não citada (regra do perfil).

## Zeros (onde procurei)
- **Defesa civil**: ação "Manutenção e operacionalização da defesa civil" (02.061, Gabinete) com dotação inicial 42 mil (2024), 47 mil (2025), 27 mil (2026); empenhado zero nos três (PCMGE015 12/2024, 12/2025, 07/2026). Busquei "defesa civil" em todos os PDFs: só aparece nessa ação e nos Anexos 7/8 (subfunção 182 sem valor). Nenhuma receita com esse nome (PCMGE016 e Anexo 10).
- **Proteção animal**: a palavra "animal" não aparece em nenhum dos 18 PDFs (despesa e receita, 2024 a 2026). Nem a linha existe.
- **Esporte**: não é zero. Fica na secretaria conjunta de Cultura, Esporte e Lazer; a ação de eventos de 2024 e 2025 se chama "eventos culturais, tradicionais e esportivos". Por isso a fala diz "cultura, esporte e lazer, que é uma secretaria só". As ações só de esporte (quadras, incentivo ao esporte, reforma de equipamentos esportivos) tiveram gasto zero, mas isso NÃO foi dito como "esporte zero".

## Achados
1. **Festas x assistência social** (empenhado 2024/2025, liquidado 2026): ação "Promoção e realização de eventos culturais, trad. e esport." (13.392) = 4.144 mil (2024), 3.432 mil (2025), 2.530 mil liquidados até jul/2026 (4.714 mil já empenhados). Assistência social (função 08 inteira) = 2.142 / 2.631 / 1.542 mil. Eventos > assistência nos três anos.
2. **Asfalto**: ação "Pavimentação e recuperação de vias urbanas" (15.451, Sec. de Obras) com dotação inicial de R$ 633.234,72 (2024), R$ 625.958,20 (2025) e R$ 523.000,99 (2026, "Pavimentação, recuperação e manutenção de vias urbanas"); empenhado e liquidado zero nos três anos. Em 2025 a dotação foi reduzida em R$ 605.000. No município inteiro, o elemento 4.4.90.51 (obras e instalações) teve liquidação zero em 2024; 430 mil em 2025 (UBS e prédio da Câmara) e 450 mil até jul/2026 (UBS) (`obras44.py`). A fala só diz o zero da linha do asfalto.
3. **Limpeza pública**: dotação inicial R$ 1.800.257,90 em 2025, acréscimos de R$ 2.740.000, gasto R$ 4.142.297,06 (quase tudo 3.3.90.39, pessoa jurídica). 2024: 894 mil reservados, 1,59 mi gastos. 2026: 4,69 mi reservados, 2,76 mi liquidados até julho. A limpeza fica na Sec. de Meio Ambiente e o asfalto na Sec. de Obras: a fala NÃO diz que o dinheiro de um foi para o outro.
4. **Obras do Estado**: em 12/07/2025 o Governo do Estado inaugurou o Colégio Estadual em Tempo Integral de Anagé (R$ 26 milhões) e entregou sistemas de abastecimento de água da Embasa para 17 comunidades rurais; também autorizou pavimentação no Centro e no bairro São João Batista. Fonte: Jornal do Sudoeste, 14/07/2025, https://jornaldosudoeste.com/em-anage-governador-entrega-obras-e-equipamentos-e-autoriza-novos-investimentos . (A delegacia entregue no mesmo dia não entra: segurança pública.)
5. **Prazo de entrega ao TCM**: e-TCM, lista de prestações da Prefeitura de Anagé: todas as mensais de 01/2024 a 07/2026 com status "Entregue fora do prazo" (ex.: 12/2024 enviada em 12/03/2025; 12/2025 em 30/03/2026; 07/2026 em 23/10/2026). As anuais (Governo 2024 e 2025) foram "no prazo". Até 07/11/2026 não havia 08/2026 nem 09/2026 na lista.

## Tribunal de Contas
- **Decisão de 22/10/2025** (2ª Câmara do TCM-BA, relatora conselheira Aline Peixoto): ressarcimento de cerca de R$ 3,8 milhões (R$ 3.794.286,01) com recursos pessoais do gestor, por pagamentos acima do valor contratual e despesas sem comprovação em 2021 e 2022 (R$ 3,06 mi à FR Transporte; R$ 314 mil a escritórios de advocacia; R$ 224 mil à One Consultoria; diárias sem comprovação), multa de R$ 3 mil e representação ao MP-BA. Cabe recurso. Fontes: Bahia Notícias, 23/10/2025, https://www.bahianoticias.com.br/municipios/noticia/47763-prefeito-de-anage-tera-de-devolver-r-38-milhoes-devido-a-irregularidades-em-contratos ; BNews, 24/10/2025, https://www.bnews.com.br/noticias/politica/nepotismo-e-falhas-contratuais-causam-rombo-milionario-em-prefeitura-baiana-entenda.html . O número do processo não apareceu na consulta de Auditoria; a fala não cita nome (regra) e diz "cabe recurso".
- TCM › Decisões › Auditoria (Prefeitura de Anagé, consultado em 07/11/2026), sem julgamento: 12056e26 (denúncia, gestão de pessoal e financeira em 2022), 14977e26 (denúncia, supostos atos de improbidade em 2022), 29054e26 (termo de ocorrência, indícios de acumulação de dois cargos e servidor ativo com mais de 75 anos, 2025), 09032e26, 11517e23, 30841e23. Câmara: nenhum processo. Não usados na fala (cortados por tempo); podem ir na legenda como "em análise".
- Cautelar de 2022 contra contrato de R$ 8 mi com escritório de advocacia (Fundef): fora do período, não usado.
- Precatório do Fundef: R$ 7 mi previstos em 2025 e R$ 8,5 mi em 2026 na receita e na despesa, mas nada arrecadado nem gasto. Não usado (dinheiro que ainda não chegou).

## Conferência de obras em notícias e no PNCP (07/11/2026, regra nova do item 8 da coordenação)
- **Calçamento**: a Prefeitura de Anagé publicou no PNCP a Concorrência Eletrônica 001/2026 (processo 044-2026, controle 13906409000113-1-000009/2026): "pavimentação em paralelepípedo ... em vias de acesso ao Residencial Campo Verde", valor estimado R$ 838.897,15, propostas até 14/04/2026. Situação no PNCP em 07/11/2026: "Divulgada no PNCP", sem valor homologado. https://pncp.gov.br/app/editais/13906409000113/2026/9
- Contratos da Prefeitura no PNCP (API de consulta, 2025: 158; 2026 até 07/11: 129): nenhum com pavimentação, paralelepípedo, asfalto ou calçamento no objeto.
- Na despesa (PCMGE015 07/2026), a ação de pavimentação tem R$ 0 empenhado e pago. Por isso a fala diz só: "Uma licitação de calçamento foi aberta em abril. Nas contas até julho, nada foi pago." e o fecho virou "por que a linha do asfalto ficou no zero?" (não "fica sempre", para não afirmar o estado de obra futura).
- Pavimentação no Centro e no São João Batista: AUTORIZADA pelo Governo do Estado em 12/07/2025 (Jornal do Sudoeste, 14/07/2025). Não achei ordem de serviço nem entrega; não citado na fala.
- Busca em sites de notícias sobre obras da prefeitura em Anagé (asfalto, calçamento, praças): nada além do acima.

## Conferências da auditoria (13/11/2026, pedidos p114 e p115)
- "meio ambiente 1 milhão e 700" (2026 jan–jul, liquidado, função 18): 156.869,43 + 1.556.715,77 = 1.713.585,20. Parcelas escritas em 2026-07_PCMGE015.pdf (Prefeitura), "Total do Projeto/Atividade" das ações 22016 (p. 55) e 22048 (p. 56), coluna Liquidações Até Mês. Narração certa (1,71 mi → "1 milhão e 700").
- "eventos e festas 3 milhões e 400 em 2025": R$ 3.432.240,37, ação 2020 "Promoção e realização de eventos culturais, trad. e esport." (órgão 1), "TOTAL DA AÇÃO", colunas Empenhado e Liquidado, em 2025-12_PCMGE015.pdf. Narração certa (3,43 mi → "3 milhões e 400").

## Conferências da auditoria (13/11/2026 22h, pedidos p195, p196 e p197)
- "Administração, 9 milhões e 300" (2024, empenhado, funções 04 + 02): 9.220.430,53 + 45.500,00 = 9.265.930,53. Parcelas na linha "Total" do Anexo IX em 2024-13_ANUAL_PCAGO007 (p. 1), colunas 04 Administração e 02 Judiciária. Narração certa (9,27 mi → "9 milhões e 300").
- "Cultura e esporte, 3 milhões e 600" (2025, empenhado, função 13): R$ 3.566.680,57, linha "Total", coluna 13 Cultura, Esporte e Lazer, Anexo IX em 2025-13_ANUAL_PCAGO007 (p. 2). Narração certa (3,57 mi → "3 milhões e 600").
- "Assistência social, 2 milhões e 600" (2025, empenhado, função 08): R$ 2.630.812,05, coluna 08 Assistência Social (Fundo Municipal de Assistência Social, único órgão com valor), Anexo IX em 2025-13_ANUAL_PCAGO007 (p. 1). Narração certa (2,63 mi → "2 milhões e 600").

## Conferências da auditoria (14/11/2026 madrugada, pedidos p273 e p274)
- "Saúde, 21 milhões e 800" (2024, empenhado, função 10): R$ 21.753.062,08, linha "Total", coluna 10 Saúde (Fundo Municipal de Saúde, único órgão com valor), Anexo IX em 2024-13_ANUAL_PCAGO007 (texto em documentos_tcm/2024-13_ANUAL_PCAGO007.txt, linhas 91 e 96). Narração certa (21,75 mi → "21 milhões e 800").
- "Câmara, 2 milhões e 400" (2026 jan–jul, liquidado, PCMGE015 07/2026 da Câmara): 0,00 + 26.447,06 + 1.216.384,34 + 1.205.794,19 = 2.448.625,59. Parcelas na linha "Total do Projeto/Atividade" das 4 ações, coluna Liquidações Até Mês, em 2026-07_CAMARA_PCMGE015 (texto linhas 20, 27, 36 e 114). Narração certa (2,45 mi → "2 milhões e 400").


## Valores da legenda (conferidos 14/11/2026, pedidos p368 a p370 da auditoria)
- "sobraram quase R$ 700 mil" (2024): R$ 688.220,27 = linha "Superávit (XIII)" do Balanço 2024 (PCAGO015 2024); conta: 98.401.048,30 − 97.712.828,03 = 688.220,27.
- "R$ 630 mil (2024), R$ 630 mil (2025) e R$ 520 mil (2026)" reservados para pavimentar: dotação inicial da ação de pavimentação e recuperação de vias urbanas (15.451, Sec. de Obras) = R$ 633.234,72 (2024), R$ 625.958,20 (2025) e R$ 523.000,99 (2026), arredondados; PCMGE015 12/2024, 12/2025 e 07/2026, coluna dotação inicial. Empenhado/liquidado: R$ 0,00 nos três anos.
- "colégio de tempo integral (R$ 26 mi)": valor dito pelo Governo do Estado na inauguração, não é conta do município. Fonte: Jornal do Sudoeste, 14/07/2025 (ver item 4 acima).

## Conferência da auditoria (14/11/2026)
- "4 milhões e 100" (narração): eventos e festas 2024 = R$ 4.144 mil (ação 13.392) e também limpeza pública 2025 = R$ 4.142.297,06. Ambos certos.
- "R$ 40,7 mi" (legenda): Educação 2025 = R$ 40,680 mi (tabela de funções, linha Educação) → 40,7.
