# Fontes do roteiro 024. orçamento de porto seguro (checadas em 04/11/2026)

**Onde a pessoa confere:** o site da prefeitura (https://portoseguro.ba.gov.br/transparencia) leva, no botão "Responsabilidade Fiscal", ao portal https://www.acessoinformacao.com.br/ba/portoseguro/documentos/?tipo=relatorio-da-responsabilidade-fiscal. Lá estão os PDFs usados (cópias em `referencias/pdfs do portal/`):

- **PDF 2025:** "RREO 6º bimestre 2025 e RGF 3º quadrimestre 2025" (Diário Oficial, edição 10.524, de 30/01/2026), em https://lai.acessoinformacao.com.br/arquivos/download/019d2648-52d7-719f-91bd-040862dcc117-3PdHa8k6SeC14JWJ.pdf
- **PDF 2024:** "RREO 6º bimestre de 2024 e RGF 3º quadrimestre de 2024" (republicação de 12/05/2025), em https://lai.acessoinformacao.com.br/arquivos/download/9ec293f0260eaf23a2f6e5f6cfaffb20eaea816b.pdf

Página = página do arquivo PDF (o número que o leitor de PDF mostra). Conferência com o Siconfi (Tesouro Nacional) em `referencias/*.json`.

| Fato no roteiro | Fonte (arquivo, anexo, página, valor exato) | Observação |
|---|---|---|
| "gastou 1 bilhão e 150 milhões em 2025" | PDF 2025, RREO Anexo 1, p. 2: total das despesas liquidadas R$ 1.149.986.469,29 | Siconfi traz R$ 1.146.207.400,12 (outra versão). As duas arredondam para 1,15 bi |
| "mais de 6 mil reais por morador" | conta própria: 1.149,99 mi ÷ 182.630 moradores (IBGE, estimativa 2025, `referencias/ibge-populacao-estimada-2025.json`) = R$ 6.297 | o Siconfi usa outra população (158.736) e daria R$ 7.245; com o Censo 2022 (168.326), R$ 6.832. "Mais de 6 mil" vale nos três |
| "governo federal mandou 410 milhões" | PDF 2025, Anexo 1, p. 1: Transferências da União R$ 410.188.284,73 | transferências correntes; inclui FPM R$ 214,12 mi (Anexo 3, p. 10) |
| "o estado, 96" | PDF 2025, Anexo 1, p. 1: Transferências dos Estados R$ 96.049.403,13 | |
| "o Fundeb, mais 174" | PDF 2025, Anexo 1, p. 1: Transferências de outras instituições públicas R$ 173.868.597,14 | é o retorno do Fundeb. Com a complementação da União, o Fundeb total foi R$ 281,90 mi (Anexo 3, p. 10) |
| "impostos da cidade: 285 milhões" | PDF 2025, Anexo 1, p. 1: Impostos R$ 285.249.922,55 | com taxas e contribuição de melhoria: R$ 312,70 mi |
| "ISS 138 milhões; IPTU 60" | PDF 2025, Anexo 3 (RCL), p. 10: ISS R$ 137.775.699,80; IPTU R$ 59.968.655,45 | 137,78 ÷ 59,97 = 2,3 ("mais que o dobro") |
| "pegou 100 milhões emprestados; o orçamento previa 30" | PDF 2025, Anexo 1, p. 1: Operações de crédito, previsão inicial R$ 30.000.000,00; realizado R$ 100.000.000,00 | o relatório não diz de quem é o empréstimo |
| "educação quase 400 milhões; 1 de cada 3 reais" | PDF 2025, Anexo 2, p. 6: Educação R$ 399.482.594,96 | 399,48 ÷ 1.149,99 = 34,7% |
| "ensino fundamental 248; creches e pré-escolas 70" | p. 6: Ensino Fundamental R$ 247.653.750,20; Educação Infantil R$ 70.212.035,89 | |
| "saúde 195 milhões; previstos 150" | PDF 2025, Anexo 2, p. 5: Saúde liquidada R$ 194.933.911,47; dotação inicial R$ 150.466.276,00 | |
| "66 para os postos de saúde e 67 para hospitais" | p. 5: Atenção Básica R$ 66.052.090,83; Assistência Hospitalar e Ambulatorial R$ 66.988.465,60 | "postos de saúde" = atenção básica |
| "administração 128 milhões" | p. 4: Administração R$ 127.531.877,23 | |
| "ruas e obras da cidade 121; infraestrutura urbana 83; em 2024, 50" | PDF 2025, p. 6: Urbanismo R$ 120.548.995,07; p. 7: Infraestrutura Urbana R$ 83.004.681,91 · PDF 2024, p. 20: Infraestrutura Urbana R$ 49.961.569,52 | Siconfi 2024: R$ 51,21 mi |
| "saneamento 85 milhões; previa 39; mais que o dobro" | PDF 2025, p. 7: Saneamento liquidado R$ 84.848.296,80; dotação inicial R$ 38.661.411,00 | 84,85 ÷ 38,66 = 2,2. Em 2024: R$ 85,65 mi (PDF 2024, p. 21) |
| "dívida: entre juros e parcelas, 67 milhões; em 2024, 24; quase o triplo" | PDF 2025, p. 8: Serviço da Dívida Interna R$ 67.176.861,00 (= Anexo 1, p. 2: juros R$ 30.355.088,17 + amortização R$ 36.821.772,83) · PDF 2024, p. 22: Serviço da Dívida Interna R$ 24.058.774,59 | 67,18 ÷ 24,06 = 2,8. Siconfi 2025: R$ 62,92 mi (outra versão) |
| "turismo: previstos 15, saíram 44, quase o triplo; em 2024, 26" | PDF 2025, p. 8: Turismo dotação inicial R$ 15.178.541,00; liquidado R$ 43.682.172,79 · PDF 2024, p. 21: Turismo R$ 25.698.304,44 | 43,68 ÷ 15,18 = 2,9 |
| "Câmara 26 milhões; o orçamento previa 44" | PDF 2025, p. 4: Legislativa (Ação Legislativa) dotação inicial R$ 43.632.491,35; liquidado R$ 26.191.665,66 | em 2024: R$ 19,48 mi (PDF 2024, p. 18) |
| "10 vezes a cultura (2,6)" | p. 6: Cultura R$ 2.571.144,27 | 26,19 ÷ 2,57 = 10,2 |
| "assistência social 23" | p. 4: Assistência Social liquidado R$ 22.623.956,37 | Siconfi: R$ 23,11 mi |
| "transporte 12; previa 18" | p. 8: Transporte dotação inicial R$ 17.962.538,00; liquidado R$ 12.157.237,16 | |
| "meio ambiente 11" | p. 7: Gestão Ambiental R$ 10.885.079,96 | |
| "esporte 8 e meio; em 2024, 20; menos da metade" | PDF 2025, p. 8: Desporto e Lazer R$ 8.542.849,66 · PDF 2024, p. 22: R$ 20.394.508,96 | 8,54 ÷ 20,39 = 0,42 |
| "agricultura 3 milhões" | p. 7: Agricultura R$ 3.161.179,65 | |
| "habitação 261 mil" | p. 7: Habitação R$ 260.958,19 | |
| "defesa civil 17 mil" | p. 4: subfunção 182 Defesa Civil (dentro da função Administração) R$ 17.067,07 | |
| "segurança pública: zero" | p. 4: função 06 Segurança Pública, dotação inicial R$ 50.000,00, liquidado R$ 0,00 | é a classificação contábil: a função está zerada |
| "policiamento dentro da administração: 808 mil" | p. 4: subfunção 181 Policiamento, dentro da função 04 Administração, R$ 807.830,10 | conferido na sequência das linhas da p. 4 |
| "comunicação social: 5 milhões previstos, gastou zero" | p. 4: subfunção 131 Comunicação Social (função Administração), dotação inicial R$ 5.025.000,00; liquidado R$ 0,00 | em outra área (Gestão Ambiental, p. 7) há R$ 216.600,00 de comunicação social; o roteiro fala só da linha da administração ("da prefeitura") |
| "obras e equipamentos: previam 112, saíram 138" | PDF 2025, Anexo 1, p. 2: Investimentos, dotação inicial R$ 111.687.090,36; liquidado R$ 138.343.265,58 | |
| "salários 48%; teto 54%" | PDF 2025, RGF Anexo I (Poder Executivo), p. 44: DTP R$ 498.512.559,33 = 48,16% da RCL ajustada; limite máximo 54% | **diferença:** o Siconfi traz 49,76% (DTP R$ 515,65 mi), acima do limite de alerta (48,6%). O roteiro diz só "48%" e "abaixo do teto", que vale nas duas versões para o teto |
| "educação 26% dos impostos (mín. 25)" | PDF 2025, p. 41: MDE 26,05% | Siconfi: 26,05% |
| "saúde 15,8% (mín. 15); passou por pouco" | PDF 2025, p. 42: 15,79% | Siconfi: 15,79% |
| "receitas passaram as despesas em 5 milhões" | PDF 2025, Anexo 1, p. 1: receitas realizadas R$ 1.154.977.196,81; p. 2: superávit (liquidadas) R$ 4.990.727,52 | **diferença:** no Siconfi, receitas R$ 1.160,69 mi e superávit R$ 14,49 mi |

## Diferenças entre o PDF do portal e o Siconfi
- Total gasto: PDF R$ 1.149,99 mi · Siconfi R$ 1.146,21 mi.
- Superávit: PDF R$ 4,99 mi · Siconfi R$ 14,49 mi.
- Salários: PDF 48,16% · Siconfi 49,76%.
- Dívida (serviço da dívida interna): PDF R$ 67,18 mi · Siconfi R$ 62,92 mi.
- O roteiro usa o PDF do portal (o que a pessoa consegue abrir) e números arredondados.

## Fora do roteiro (contexto)
- 2026: no portal, os arquivos "RREO 4º bimestre 2026" e "RGF 2º quadrimestre 2026" são o MESMO arquivo (md5 igual), baixados em `referencias/pdfs do portal/`. Não usados.
- Pessoal e encargos (Anexo 1, p. 2): R$ 554,02 mi liquidados em 2025.

## Conferir antes de publicar
- Se a prefeitura republicou o RREO do 6º bimestre de 2025 (o Siconfi traz outra versão com total, superávit e pessoal diferentes).
- O percentual de pessoal: 48,16% no PDF × 49,76% no Siconfi.

## Versão 2 do roteiro (04/11/2026, mais didática)
| Frase nova | Fonte | Observação |
|---|---|---|
| "A lei obriga: pelo menos 25% dos impostos na educação e 15% na saúde" | Constituição, art. 212 (educação) e art. 198 com a LC 141/2012, art. 7º (saúde, municípios) | os percentuais aplicados estão no Anexo 14 do RREO (ver tabela acima) |
| "IPTU, das casas e terrenos" | CTN, art. 32 (imposto sobre a propriedade predial e territorial urbana) | explicação simplificada |
| "O orçamento diz quanto pretende gastar; o relatório mostra quanto saiu" | RREO, Anexo 2: colunas "Dotação inicial" × "Despesas liquidadas" | é a comparação usada em todo o "previsto × saiu" |
| "o dinheiro de fora é mais que o dobro dos impostos da cidade" | conta própria: (410 + 96 + 174) ÷ 285 = 2,4 | mesmos valores do Anexo 1 citados acima |

## Versão 3 do roteiro (04/11/2026, linha de raciocínio do 014): só dados de Porto Seguro
Conferência automática: todos os JSON usados são da "Prefeitura Municipal de Porto Seguro - BA" (id 2925303). Nenhuma outra cidade é citada no roteiro.
| Frase nova | Fonte | Conta |
|---|---|---|
| "arrecadou 1 bilhão e 155 milhões" | PDF 2025, Anexo 1, p. 1: receitas realizadas R$ 1.154.977.196,81 | Siconfi: R$ 1.160,7 mi |
| "só 1 de cada 4 reais dos impostos" | Anexo 1: impostos R$ 285,2 mi | 285,2 ÷ 1.155,0 = 24,7% |
| "1 de cada 3 reais na educação" | Anexo 2: R$ 399,5 mi de R$ 1.150 mi | 34,7% |
| "administração 128, mais que assistência, cultura, esporte e meio ambiente juntos" | Anexo 2 | 23 + 2,6 + 8,5 + 11 = 45,1 < 127,5 |
| "quase metade para salários e encargos: 554" | PDF 2025, Anexo 1, p. 2: R$ 554,02 mi | 554 ÷ 1.150 = 48,2% |
| "obras e equipamentos 138; 12 em cada 100" | PDF 2025, Anexo 1, p. 2: R$ 138,34 mi | 138,3 ÷ 1.150 = 12,0% |
| "48%, perto do limite de alerta (48,6%)" | PDF: 48,16% | atenção: no Siconfi, 49,76%, acima do alerta; a frase "perto do limite de alerta" vale nas duas |
