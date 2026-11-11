# Fontes do roteiro 025. orçamento de eunápolis (checadas em 05/11/2026)

Só documentos da Prefeitura Municipal de Eunápolis (IBGE 2910727). Conferência automática: todos os JSON do Siconfi em `referencias/` têm "instituicao" = "Prefeitura Municipal de Eunápolis - BA", e o roteiro não cita nenhuma outra cidade.

**PDFs do portal da transparência** (transparencia.eunapolis.ba.gov.br, menu RREO e RGF; o portal busca os arquivos na API sai2.io.org.br, órgão 1633). Cópias em `referencias/pdfs do portal/`:
- RREO 6º bimestre 2025 (publicado em 29/01/2026, 48 páginas): https://sai2.io.org.br/Handler.ashx?f=f&query=3477c06a-03b9-46ec-aeaf-b866ada6b72d.pdf (arquivo `RREO 6bim 2025 (portal, 29-01-2026).pdf`)
- RREO 6º bimestre 2024 (39 páginas): https://sai2.io.org.br/Handler.ashx?f=f&query=70a57c0f-53a0-46be-ac99-44f8ba0f865f.pdf (arquivo `RREO 6bim 2024 (portal).pdf`)
- RGF 3º quadrimestre 2025 (publicado em 29/01/2026, 13 páginas): https://sai2.io.org.br/Handler.ashx?f=f&query=e858b208-e8d3-4f07-85b8-2880e05cbe8e.pdf (arquivo `RGF 3quadr 2025 (portal, 29-01-2026).pdf`)

"p." é a página do arquivo PDF. Conferência com o Siconfi (Tesouro Nacional): os valores do PDF e do Siconfi são iguais em todos os números abaixo (centavo por centavo), salvo o percentual de pessoal (45,66% no PDF, 45,67% no Siconfi).

| Fato no roteiro | Fonte (arquivo, anexo, página, valor exato) | Observação |
|---|---|---|
| "gastou 539 milhões em 2025" | RREO 2025, Anexo 1, p. 2: total das despesas liquidadas R$ 538.709.655,13 | |
| "arrecadou 550 milhões" | RREO 2025, Anexo 1, p. 1: total das receitas realizadas R$ 549.938.821,38 | |
| "menos de 1 de cada 5 reais dos impostos da cidade" | RREO 2025, Anexo 1, p. 1: Impostos R$ 100.145.486,26 | conta: 100,15 ÷ 549,94 = 18,2%. ISS R$ 51,02 mi e IPTU R$ 12,79 mi (Anexo 3, p. 8) |
| "a União mandou 229 milhões, mais que o dobro dos impostos" | RREO 2025, Anexo 1, p. 1: Transferências da União R$ 228.787.737,79 | conta: 228,79 ÷ 100,15 = 2,28. Estado R$ 86,88 mi; Fundeb (outras instituições públicas) R$ 91,25 mi, p. 1 |
| "educação 189 milhões, a maior fatia" | RREO 2025, Anexo 2, p. 5: Educação R$ 189.399.164,46 | |
| "quase 7 de cada 10 no ensino fundamental" | RREO 2025, Anexo 2, p. 5: Ensino Fundamental R$ 129.179.174,88 | conta: 129,18 ÷ 189,40 = 68% |
| "em 2024, 170" | RREO 2024, Anexo 2, p. 5: Educação R$ 169.869.188,31 | |
| "saúde 166 milhões; previstos 123" | RREO 2025, Anexo 2, p. 5: Saúde liquidado R$ 166.390.321,75; dotação inicial R$ 122.684.716,00 | |
| "6 de cada 10 reais da saúde para hospitais e atendimento especializado" | RREO 2025, Anexo 2, p. 5: Assistência Hospitalar e Ambulatorial R$ 99.914.374,49 | conta: 99,91 ÷ 166,39 = 60%. Previsto para essa linha: R$ 56,90 mi |
| "ruas e serviços 39 milhões" | RREO 2025, Anexo 2, p. 6: Urbanismo R$ 39.425.044,48 | infraestrutura urbana R$ 25,03 mi |
| "saneamento 30" | RREO 2025, Anexo 2, p. 6: Saneamento R$ 30.159.648,40 | previsto R$ 27,36 mi |
| "administração 50 milhões, quase o dobro de assistência, cultura, meio ambiente, agricultura e transporte juntos" | RREO 2025, Anexo 2, p. 4 a 6: Administração R$ 50.202.864,95; Assistência Social R$ 8.840.179,08 (p. 4); Cultura R$ 10.953.220,07 (p. 5); Gestão Ambiental R$ 2.989.399,76, Agricultura R$ 1.361.387,34 e Transporte R$ 1.618.564,24 (p. 6) | conta: 8,84 + 10,95 + 2,99 + 1,36 + 1,62 = 25,76; 50,20 ÷ 25,76 = 1,95 |
| "meio ambiente: 12 milhões previstos, gastou 3" | RREO 2025, Anexo 2, p. 6: Gestão Ambiental, dotação inicial R$ 12.324.059,00; liquidado R$ 2.989.399,76 | |
| "esporte e lazer: previstos 69 mil, gastou 2.761 reais" | RREO 2025, Anexo 2, p. 6: Desporto e Lazer, dotação inicial R$ 69.000,00; liquidado até o bimestre R$ 2.761,08 | coluna conferida na linha: dotação inicial 69.000,00; atualizada 29.300,00; empenhado 2.761,08; liquidado 2.761,08. No Siconfi aparece arredondado como 0,00 mi |
| "a segurança pública nem aparece no relatório" | RREO 2025, Anexo 2, p. 4 a 7: não há a função Segurança Pública (nem no Siconfi, Anexo 2) | o roteiro não diz por quê. Guarda e defesa civil, se existirem, podem estar lançadas em outra função |
| "Câmara de Vereadores 17 milhões" | RREO 2025, Anexo 2, p. 4: Legislativa R$ 17.273.546,33 | |
| "mais da metade para salários e encargos: 274 milhões" | RREO 2025, Anexo 1, p. 2: Pessoal e Encargos Sociais R$ 274.122.972,33 | conta: 274,12 ÷ 538,71 = 50,9% |
| "obras e equipamentos 33 milhões, 6 em cada 100; o orçamento falava em 7" | RREO 2025, Anexo 1, p. 2: Investimentos liquidados R$ 33.162.284,61; dotação inicial R$ 7.402.000,00 | conta: 33,16 ÷ 538,71 = 6,2% |
| "até 54%; Eunápolis está em 45,7%; alerta 48,6%" | RGF 3º quadr. 2025, p. 2: Despesa Total com Pessoal R$ 245.926.031,54 = 45,66% da RCL ajustada; limite máximo 54,00% | Siconfi: 45,67%. LRF, art. 20 e 59 |
| "saúde 30,8% (mínimo 15), o dobro do mínimo" | RREO 2025, Anexo 14 (simplificado), p. 39: 30,78% | conta: 30,78 ÷ 15 = 2,05 |
| "educação 26,3% (mínimo 25)" | RREO 2025, Anexo 14, p. 38: 26,30% | |
| "receitas passaram as despesas em 11 milhões" | RREO 2025, Anexo 1, p. 1 e 2 | conta: 549,94 − 538,71 = 11,23 |
| "a lei obriga 25% na educação e 15% na saúde" | Constituição, art. 212; art. 198 com a LC 141/2012, art. 7º | |

## Conferir antes de publicar
- Se a prefeitura republicou o RREO do 6º bimestre de 2025 no portal.
- A frase da segurança: confirmar com a pessoa se quer manter "nem aparece" (é o que o relatório mostra; não há explicação no documento).
