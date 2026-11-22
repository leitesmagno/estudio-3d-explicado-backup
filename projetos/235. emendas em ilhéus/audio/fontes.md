# 235. emendas em ilhéus: fontes (versão 3, dois caminhos: saúde x Prefeitura, checada em 20/11/2026)

Método: parte 10 do "Guia Completo TCM-BA - Receita e Despesa" do Magno (emendas da saúde no FNS, todas as emendas no painel do TCU, convênios no Portal da Transparência) + PCMGE016/PCMGE065 do e-TCM. A versão 1 está em `antigos/`.
Regras: nomear parlamentar só com "indicou"; prefeito e vereador sem nome; RP9 sem nome; empresa sem nome (aguarda ok do Magno).
Dados locais: `~/Documents/EMENDAS-ILHEUS/` (fns/, ranking_consolidado.csv, painel_tcu_beneficiarios.md, scripts/).

## Saúde: Fundo Nacional de Saúde (consultafns.saude.gov.br/#/proposta)
API aberta: `https://consultafns.saude.gov.br/recursos/proposta/consultar?ano=AAAA&coMunicipioIbge=291360&sgUf=BA` e `.../obter-proposta?nuProposta=N` (parlamentar, portaria, ordens bancárias). Cópia: `fns/AAAA.json`, `fns/detalhe.json` (69 propostas de emenda).
1. Emendas pagas ao Fundo Municipal de Saúde de Ilhéus, por ano da proposta: 2019: 4.782.891; 2020: 720.000; 2021: 10.285.000; 2022: 6.054.281; 2023: 8.378.788; 2024: 5.399.996; 2025: 9.226.117; 2026: 9.370.000. Total: R$ 54.217.073,00 → "54 milhões e 200 mil". Só "EMENDA" (individual, bancada, comissão, relatoria); "PROGRAMA" fica de fora.
2. "Quase tudo é custeio": equipamento R$ 799.917 e covid R$ 300.000; o resto são "Incremento" PAB/PAP (atenção básica) e MAC (média e alta complexidade, atendimento hospitalar).
3. Orçamento secreto (EMENDA RELATORIA, autor "RELATOR GERAL", sem partido): 2021: 700.000 (MAC) + 300.000 + 850.000 + 2.650.000 (PAB); 2022: 800.000 + 700.000 + 3.000.000 (PAP). Total: R$ 9.000.000. Propostas 36000409419202100, 36000388797202100, 36000412529202100, 36000423106202100, 36000460669202200, 36000467088202200 e 36000470745202200. Mais R$ 27.145,06 de RP9 ao Município (CGU, out./2021), não citado na fala.
4. O STF declarou as emendas de relator inconstitucionais em 19/12/2022 (ADPF 850, 851, 854 e 1014) → "no fim de 2022".

## Prefeitura: CGU, Portal da Transparência (EmendasParlamentares_PorFavorecido.csv, base de 19/11/2026)
5. Pago ao Município de Ilhéus (CNPJ 13.672.597/0001-62), de 2019 a 2026 (ano do pagamento): R$ 21.773.862,39 → "21 milhões e 800 mil". A base da CGU traz o Fundo de Saúde só a partir de dez./2024, e por isso a saúde vem do FNS.
6. Pix (Transferências Especiais) pago: R$ 10.812.237,53 → "10 milhões e 800 mil", "metade disso" (49,7%, conta própria). Conferido com o Transferegov: 18 planos, R$ 11.045.356,79, sendo 1 IMPEDIDO e não pago (R$ 233.119).
7. Destinos declarados nos planos de ação Pix (Transferegov): ruas (Bela Vista/Hernani Sá, Boa Vista/Nelson Costa, vias urbanas), Praça da Maramata, quadra e praça, campo do Hernani Sá, estrada vicinal de Olivença a Sapucaeira/Santaninha, orla da Praia do Cristo (09032026-095395/2026).

## TOTAL (conta própria)
8. 54.217.073,00 (saúde, FNS) + 21.773.862,39 (Prefeitura, CGU) = R$ 75.990.935,39 → "76 milhões". As bases não se sobrepõem: saúde só no FNS, Prefeitura só pelo CNPJ do Município. Atenção: a saúde está por ano da proposta e a Prefeitura por ano do pagamento, e por isso o vídeo não mostra barras por ano.

## Conferência no TCM-BA (PCMGE016 e PCMGE065, texto local em ~/Documents/RECEITAS-DESPESAS-ILHEUS/documentos_tcm/)
9. 2025-12_PCMGE016, p. 13, "Transferência Especial da União - Principal" (2.4.1.9.51.0.1), R$ 2.941.237,53 = Pix CGU 2025. Bate centavo por centavo.
10. 2026-08_PCMGE016, p. 7, "Transferência Especial da União - Principal" (241951010000), acumulado R$ 5.538.071,80 = Pix CGU de jan. a ago./2026 (5.771.000,00 − 232.928,20 de nov.). Bate centavo por centavo.
11. 2026-08_PCMGE065, p. 50, Secretaria de Infraestrutura (2101), ação 1088 "PAVIMENTAÇÃO DE VIAS", fonte 17063110 (1706 = Transferência especial da União, emenda Pix, pelo guia): Obras e Instalações, empenhado R$ 1.806.670,42 e pago R$ 1.621.159,69; Despesas de Exercícios Anteriores, R$ 970.603,70 pagos → "nas despesas, esse dinheiro aparece na pavimentação de vias".
12. Extra (fora da fala): saúde 2025, PCMGE016 p. 6, "Incremento Temporário ... Atenção Primária" R$ 3.900.000 = FNS; convênio de infraestrutura 2024, PCMGE016 p. 7, R$ 2.972.473,16 = CGU.

## Painel do TCU (sites.tcu.gov.br/painel-de-acompanhamento-da-execucao-de-emendas → Versão Cidadão, dados até 06/11/2026)
13. Ilhéus 2025 no painel: R$ 10.613.234 (igual à CGU, que dá R$ 10.613.233,53).
14. "3 milhões e 480 mil pagos a uma empresa de obras": a Companhia Ambiental Rockefeller Ltda (CNPJ 22.851.371/0001-10) recebeu R$ 1.147.860,38 (Pix Leur 2025) + R$ 1.848.147,84 (Pix Leur 2026) + R$ 484.376,92 (Pix Solla 2026) = R$ 3.480.385,14 (conta própria). Planos de ação: pavimentação. O NOME NÃO ENTRA no vídeo sem o ok do Magno.

## Ranking (saúde FNS + Prefeitura CGU), `ranking_consolidado.csv`
15. Leur Lomanto Júnior 8.704.237,53; Bebeto 4.765.146,47 ("4 milhões e 800 mil"); João Leão 4.490.000; Márcio Marinho 4.444.157,67; Jorge Solla 4.433.281 ("perto de 4 milhões e meio cada"); Bacelar 4.198.000; Alex Santana 4.000.000; Professora Dayane Pimentel 3.664.825; Antônio Brito 3.278.610,14; Ronaldo Carletto 3.068.449; Paulo Magalhães 2.915.009,52; Erivelton Santana 2.619.947,30; Irmão Lázaro 1.932.243,78; Rogéria Santos 1.400.000; Lídice da Mata 1.399.996; Arthur Oliveira Maia 1.000.000; Igor Kannário 910.339; Raimundo Costa 360.000; Cláudio Cajado 349.170; Cacá Leão 320.000; Ângelo Coronel 300.000; Josias Gomes 300.000; Dal Barreto 300.000; Alice Portugal 299.930; Joseildo Ramos 200.000. São 25 nomes, MAIS Relator Geral 9.027.145,06, Comissão de Saúde 4.572.000 e Bancada da Bahia 2.554.134,78.
   - CORREÇÃO: são 25 parlamentares com nome, não 26 (a fala precisa dizer 25).
   - No FNS, o valor do parlamentar = parte dele na proposta × (pago ÷ valor da proposta).

## Fábrica de computadores
16. R$ 47.014.329,03 em emendas pagas à unidade de Ilhéus de uma fabricante de computadores (compras federais nacionais, CGU PorFavorecido). Fica fora da conta, e o nome não entra no vídeo.

## Fecho
17. "O parlamentar indica, a Prefeitura executa": CF, art. 166-A (EC 105/2019), transferências executadas pelo ente que recebe.

Antes de postar: reconferir FNS e CGU do mês (2026 ainda muda).

## Versão 3: dois caminhos (pedido do Magno: separar saúde e demais, didático)
18. Saúde por tipo (FNS, pago): atenção básica = INCREMENTO PAB 13.635.000 + INCREMENTO PAP 18.970.000 = R$ 32.605.000 ("32 milhões e 600 mil"); média e alta complexidade = INCREMENTO MAC R$ 20.512.156 ("20 milhões e 500 mil"); equipamento 799.917; covid 300.000. A soma dá 54.217.073.
19. Saúde por tipo de emenda: individual 38.090.947; relator 9.000.000; comissão 4.572.000; bancada 2.554.126.
20. Ranking saúde (FNS): Relator Geral 9.000.000; Comissão de Saúde 4.572.000 ("4 milhões e 600 mil"); Alex Santana 4.000.000; Leur Lomanto Júnior 3.870.000 ("3 milhões e 900 mil"); Bacelar 3.500.000; Márcio Marinho 3.499.991; Professora Dayane Pimentel 3.300.000; Ronaldo Carletto 3.068.449; Jorge Solla 2.754.281; Bancada da Bahia 2.554.126; João Leão 2.500.000; Erivelton Santana 2.482.961; Rogéria Santos 1.400.000; Bebeto 1.000.000; Arthur Oliveira Maia 1.000.000; Lídice da Mata 999.996; Igor Kannário 910.339; Irmão Lázaro 800.000; Antônio Brito 700.000; Paulo Magalhães 425.000; Raimundo Costa 360.000; Cacá Leão 320.000; Cláudio Cajado 300.000; Dal Barreto 300.000; Ângelo Coronel 300.000; Alice Portugal 299.930.
21. Prefeitura por forma (CGU, pago ao Município): finalidade definida (convênio ou contrato de repasse) R$ 10.750.157,88 ("10 milhões e 750 mil"); Pix 10.812.237,53; bancada 184.300,91; relator 27.166,07. Soma: 21.773.862,39. "A maior parte em pavimentação, drenagem e contenção de encostas": função Urbanismo R$ 9.165.461,15 (85% de 10,75 mi), em ações de apoio a obras de desenvolvimento urbano e de redução de riscos de encostas. Os objetos dos convênios (EmendasParlamentares_Convenios.csv) são pavimentação e drenagem em ruas, contenção de encostas (Alto do Nerival, Alto do Coqueiro), mirantes e praça.
22. Ranking Prefeitura (CGU): Leur Lomanto Júnior 4.834.237,53 ("4 milhões e 800 mil", tudo Pix); Bebeto 3.765.146,47 ("3 milhões e 800 mil"); Antônio Brito 2.578.610,14 ("2 milhões e 600 mil"); Paulo Magalhães 2.490.009,52 ("2 milhões e 500 mil"); João Leão 1.990.000; Jorge Solla 1.679.000; Irmão Lázaro 1.132.243,78; Márcio Marinho 944.166,67; Bacelar 698.000; Lídice da Mata 400.000; Professora Dayane Pimentel 364.825; Josias Gomes 300.000; Joseildo Ramos 200.000; Erivelton Santana 136.986,30; Cláudio Cajado 49.170; Relator Geral 27.145,06; sem informação (bancada de 2019) 184.313,14.
23. "Fundo a fundo" e "custeio": modalidade do FNS (transferência fundo a fundo para o Fundo Municipal de Saúde); o tipo "Incremento Temporário ao Custeio" é custeio, não investimento.

## Versão 4: maquete com casinhas das secretarias (pedido do Magno, 20/11)
24. Pix por destino declarado nos planos de ação (Transferegov/CGU, só planos pagos; soma = 10.812.237,53):
   - Secretaria de Infraestrutura (pavimentação de ruas e estradas): 2021 Bacelar 300.000; 2022 Paulo Magalhães 500.000; 2023 Josias Gomes 300.000, Lídice da Mata 200.000, Jorge Solla 400.000; 2025 Jorge Solla 495.000, Leur 1.980.000, Leur 233.118 (estrada vicinal Olivença–Sapucaeira/Santaninha); 2026 Jorge Solla 497.500, Leur 2.388.000. Total: R$ 7.293.618 ("7 milhões e 290 mil"). A Infraestrutura é a secretaria confirmada no PCMGE065 (item 11).
   - Praças, campos e orla: 2021 Lídice 200.000 (Praça da Maramata); 2026 Bacelar 398.000 (campo do Hernani Sá), João Leão 995.000 (praça e campo), João Leão 995.000 (orla da Praia do Cristo), Paulo Magalhães 497.500 (quadra e praça). Total: R$ 3.085.500 ("3 milhões e 90 mil"). A secretaria que executa NÃO está confirmada no TCM, e por isso a casinha leva o nome do destino, não o de uma secretaria.
   - Secretaria de Promoção Social: 2025 Leur, plano 09032025-2-086693, "custear os serviços socioassistenciais da proteção social básica", R$ 233.119 (pago em dez./2025, R$ 233.119,26). Secretaria do município: "12 - SECRETARIA MUNICIPAL DE PROMOÇÃO SOCIAL E ..." (PCMGE065 2026).
   - Plano com vários objetos: 2021 Joseildo Ramos 200.000 (fica fora das casinhas).
25. Despesa com fonte 1706 (Pix) no TCM: 2026-08_PCMGE065, Secretaria Municipal de Infraestrutura (2101), ação 1088 Pavimentação de Vias: pago R$ 1.621.159,69 (obras) + R$ 970.603,70 (exercícios anteriores) = R$ 2.591.763,39 ("2 milhões e 590 mil") até agosto de 2026. Em 2025 (PCMGE015 dez./2025) não há despesa com fonte 1706. Script: ~/Documents/EMENDAS-ILHEUS/scripts/pix_secretarias.py.
26. Saúde: casinha "Secretaria de Saúde / Fundo Municipal de Saúde" (11 - SECRETARIA DE SAÚDE no PCMGE065). Convênios (R$ 10,75 mi): casinha Infraestrutura, porque a fonte 1700 (convênios da União) aparece em Pavimentação de Vias, com dotação de R$ 481.104 igual ao convênio de Antônio Brito (PCMGE065 2026, p. 50).
27. Pódio da emenda Pix (CGU, Transferências Especiais pagas ao Município, 2021–2026): 1º Leur Lomanto Júnior R$ 4.834.237,53 ("4 milhões e 830 mil"); 2º João Leão R$ 1.990.000 ("1 milhão e 990 mil"); 3º Jorge Solla R$ 1.392.500 ("1 milhão e 390 mil"); depois Paulo Magalhães 997.500; Bacelar 698.000; Lídice da Mata 400.000; Josias Gomes 300.000; Joseildo Ramos 200.000. Soma: 10.812.237,53.
