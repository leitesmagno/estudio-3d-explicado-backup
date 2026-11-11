# Fontes do roteiro 023. orçamento de salvador (checadas em 04/11/2026)

Documentos oficiais em `referencias/pdfs do portal/`, baixados do **Portal da Transparência de Salvador** (transparencia.salvador.ba.gov.br, menu Contas Públicas > Lei de Responsabilidade Fiscal; os arquivos saem da API do portal, apitmptransparencia.salvador.ba.gov.br). Cada link abaixo abre o PDF direto. Conferência com o Siconfi (Tesouro Nacional), em `referencias/*.json`: **os valores do PDF e do Siconfi são iguais** (todos os números da tabela foram achados, centavo por centavo, nos dois).

PDFs usados:
- RREO 6º bim. 2025, Anexo 1 (Balanço Orçamentário): [RREO 6bim 2025 anexo 1 - Balanço Orçamentário](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/1-%20Balan%C3%A7o%20Or%C3%A7ament%C3%A1rio.pdf)
- RREO 6º bim. 2025, Anexo 2 (Despesas por Função e Subfunção): [RREO 6bim 2025 anexo 2 - Execução das Despesas por Função e Subfunção](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/2-%20Execu%C3%A7%C3%A3o%20das%20Despesas%20por%20Fun%C3%A7%C3%A3o%20e%20Subfun%C3%A7%C3%A3o.pdf)
- RREO 6º bim. 2025, Anexo 3 (Receita Corrente Líquida): [RREO 6bim 2025 anexo 3 - Receita Corrente Líquida](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/3-%20Receita%20Corrente%20L%C3%ADquida.pdf)
- RREO 6º bim. 2025, Anexo 8 (Educação): [RREO 6bim 2025 anexo 8 - Receitas e Despesas com Manutenção e Desenvolvimento do Ensino](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/8-%20Receitas%20e%20Despesas%20com%20Manuten%C3%A7%C3%A3o%20e%20Desenvolvimento%20do%20Ensino.pdf)
- RREO 6º bim. 2025, Anexo 12 (Saúde): [RREO 6bim 2025 anexo 12 - Receita e Despesas com Ações e Serviços Públicos de Saúde](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/12-%20Receita%20e%20Despesas%20com%20A%C3%A7%C3%B5es%20e%20Servi%C3%A7os%20P%C3%BAblicos%20de%20Sa%C3%BAde.pdf)
- RREO 6º bim. 2025, Anexo 14 (Simplificado): [RREO 6bim 2025 anexo 14 - Simplificado do RREO](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2025/6%C2%BA%20BIMESTRE/14-%20Simplificado%20do%20RREO.pdf)
- RREO 6º bim. 2024, Anexo 1: [RREO 6bim 2024 anexo 1 - Balanço Orçamentário](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2024/6%C2%BA%20BIMESTRE/1-%20Balan%C3%A7o%20Or%C3%A7ament%C3%A1rio.pdf) · Anexo 2: [RREO 6bim 2024 anexo 2 - Execução das Despesas por Função e Subfunção](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rreo/2024/6%C2%BA%20BIMESTRE/2-%20Execu%C3%A7%C3%A3o%20das%20Despesas%20por%20Fun%C3%A7%C3%A3o%20e%20Subfun%C3%A7%C3%A3o.pdf)
- RGF 3º quadr. 2025, Anexo 1 (Despesa com Pessoal, Poder Executivo): [RGF 3quadr 2025 - Demonstrativo da Despesa com Pessoal](https://apitmptransparencia.salvador.ba.gov.br/api/arquivo?referencia=/contaspublicas/rgf/2025/3%C2%BA%20quadrimestre/1-%20Demonstrativo%20da%20Despesa%20com%20Pessoal.pdf)

| Fato no roteiro | Fonte (arquivo, página, valor exato) | Observação |
|---|---|---|
| "gastou 11,9 bilhões em 2025" | Anexo 1 2025, p. 2: Total das despesas liquidadas (XII) R$ 11.899.037.498,75 | inclui intra-orçamentárias (R$ 498,6 mi), como nos vídeos 017 e 020. Sem elas: R$ 11,40 bi |
| "quase 4.600 reais por morador" | conta própria: 11.899,0 mi ÷ 2.610.987 moradores (população usada pelo Siconfi, IBGE) = R$ 4.557 | |
| "governo federal mandou 3,3 bilhões" | Anexo 1 2025, p. 1: Transferências da União R$ 3.286.985.938,36 | correntes; as transferências de capital (R$ 30,8 mi no total, p. 2) não mudam o arredondamento. Inclui o FPM, R$ 1,87 bi (Anexo 3, p. 1) |
| "o estado, 1,2" | Anexo 1 2025, p. 1: Transferências dos Estados R$ 1.204.896.648,56 | cota do ICMS R$ 1,07 bi e do IPVA R$ 0,40 bi (Anexo 3) |
| "Fundeb, quase 900 milhões" | Anexo 1 2025, p. 1: Transferências de outras instituições públicas R$ 863.265.482,68 | é o retorno do fundo do Fundeb. Com a complementação da União, Anexo 3 mostra R$ 1,17 bi |
| "impostos da cidade, 4,3 bilhões; pouco mais de 1 de cada 3 reais" | Anexo 1 2025, p. 1: Impostos R$ 4.261.171.505,11; receitas exceto intra R$ 11.886.715.756,51 | conta: 4.261,2 ÷ 11.886,7 = 35,8% |
| "ISS 2,2 bi; quase o dobro do IPTU (1,2)" | Anexo 3 2025, p. 1: ISS R$ 2.155.158.960,61; IPTU R$ 1.194.995.216,50 | 2.155,2 ÷ 1.195,0 = 1,8 |
| "saúde 2,9 bi, a maior fatia" | Anexo 2 2025, p. 1: Saúde R$ 2.881.440.964,62 | educação vem depois, R$ 2,44 bi |
| "hospitais 1,5 bi; postos de saúde 144 mi; dez vezes menos" | Anexo 2 2025, p. 1: Assistência Hospitalar e Ambulatorial R$ 1.486.530.135,08; Atenção Básica R$ 144.102.523,64 | 1.486,5 ÷ 144,1 = 10,3. "Postos de saúde" = atenção básica. Atenção: R$ 1,13 bi da saúde está em "Administração Geral", que pode incluir pessoal da rede básica |
| "educação 2,4 bi; 76 mi a menos que em 2024" | Anexo 2 2025, p. 2: R$ 2.438.587.342,31 · Anexo 2 2024, p. 2: R$ 2.514.744.295,80 | 2.514,7 − 2.438,6 = 76,2 |
| "fundamental 1,7 bi; creches e pré-escolas 747 mi" | Anexo 2 2025, p. 2: Ensino Fundamental R$ 1.652.986.507,21; Educação Infantil R$ 747.446.703,14 | |
| "ruas e serviços 2 bi; em 2024, 2,6" | Anexo 2 2025, p. 2: Urbanismo R$ 1.955.250.429,27 · Anexo 2 2024, p. 2: R$ 2.629.103.683,34 | |
| "obras de infraestrutura 479 mi; menos da metade do ano anterior" | Anexo 2 2025, p. 2: Infra-Estrutura Urbana (Urbanismo) R$ 478.794.781,05 · 2024, p. 2: R$ 1.064.606.938,58 | 45%. Foi a maior queda dentro de urbanismo (−586 mi; serviços urbanos caiu 90 mi) |
| "aposentadorias e pensões 798 mi" | Anexo 2 2025, p. 1: Previdência Social R$ 798.180.308,69 | |
| "dívida 479 mi, entre juros e parcelas" | Anexo 1 2025, p. 2: Juros R$ 233.013.382,37 + Amortização R$ 245.776.301,17 = R$ 478,79 mi · Anexo 2, p. 3: Serviço da Dívida Interna R$ 478.789.683,54 | |
| "administração 555 mi" | Anexo 2 2025, p. 1: R$ 555.296.120,70 | previstos R$ 825,4 mi |
| "assistência social 304 mi" | Anexo 2 2025, p. 1: R$ 303.868.707,43 | |
| "Câmara de Vereadores 284 mi; mais que o dobro da segurança (125)" | Anexo 2 2025, p. 1: Legislativa (Ação Legislativa) R$ 283.855.234,93; Segurança Pública R$ 124.923.531,14 | 283,9 ÷ 124,9 = 2,27. Em Salvador, a função Legislativa é só a Câmara (o Tribunal de Contas dos Municípios é do estado) |
| "turismo 202 mi; em 2024, 273" | Anexo 2 2025, p. 2: Turismo R$ 202.164.449,87 · 2024, p. 2: R$ 273.463.982,82 | |
| "comunicações 136 mi; previstos 85" | Anexo 2 2025, p. 2: Comunicações R$ 135.658.102,79; dotação inicial R$ 85.028.000,00 | |
| "ciência e tecnologia 129 mi" | Anexo 2 2025, p. 2: R$ 129.373.331,97 | |
| "esporte e lazer: previstos 29 mi, saíram 91; mais que o triplo" | Anexo 2 2025, p. 2: Desporto e Lazer, dotação inicial R$ 28.795.000,00; liquidado R$ 91.497.566,30 | 91,5 ÷ 28,8 = 3,18. A dotação foi atualizada para R$ 108,1 mi ao longo do ano; R$ 58,3 mi foram obras (infraestrutura urbana dentro de esporte) |
| "cultura 82 mi" | Anexo 2 2025, p. 2: R$ 82.407.500,80 | |
| "cidadania 44; meio ambiente 38; trabalho 31" | Anexo 2 2025: Direitos da Cidadania R$ 44.254.853,98 (p. 2); Gestão Ambiental R$ 38.124.551,19 (p. 2); Trabalho R$ 31.466.170,11 (p. 1) | |
| "agricultura 86 mil; 3 centavos por morador" | Anexo 2 2025, p. 2: Agricultura R$ 85.760,00 | conta: 85.760 ÷ 2.610.987 = R$ 0,033 |
| "transporte: previstos 617 mi, saíram 201" | Anexo 2 2025, p. 2: Transporte, dotação inicial R$ 616.609.000,00; liquidado R$ 201.486.352,96 | |
| "ônibus: previsão 491 mi, saíram 128; nem 1 de cada 3" | Anexo 2 2025, p. 2: Transportes Coletivos Urbanos, dotação inicial R$ 490.568.000,00; liquidado R$ 128.324.266,48 | 26% |
| "habitação: previstos 142, saíram 88; em 2024, 114" | Anexo 2 2025, p. 2: dotação R$ 141.798.000,00; liquidado R$ 88.204.786,33 · 2024, p. 2: R$ 114.355.727,06 | |
| "saneamento: previstos 34, saíram 13; no ano anterior, 23" | Anexo 2 2025, p. 2: dotação R$ 34.117.000,00; liquidado R$ 13.317.302,56 · 2024, p. 2: R$ 23.085.648,30 | |
| "obras e equipamentos: 1,6 bi previsto, saíram 930 mi" | Anexo 1 2025, p. 2: Investimentos, dotação inicial R$ 1.598.923.000,00; liquidado R$ 930.410.620,19 | 58% |
| "empréstimos: previstos 907 mi, entraram 232" | Anexo 1 2025, p. 1: Operações de crédito, previsão inicial R$ 907.116.000,00; realizado R$ 232.428.420,55 | maior parte prevista era externa (R$ 815,9 mi previstos, R$ 170,3 mi entraram) |
| "salários: até 54%; Salvador gastou 29,5%" | RGF 3º quadr. 2025, Anexo 1, p. 1: DTP R$ 3.235.208.891,96 = 29,48% da RCL ajustada (R$ 10.973.533.183,52); limite máximo 54,00%, prudencial 51,30% | LRF, art. 20 |
| "mínimos de saúde e educação cumpridos" | Anexo 14 2025: saúde 23,21% dos impostos (mín. 15%), p. 3; educação 25,73% (mín. 25%), p. 2 | detalhes nos Anexos 12 e 8 |
| "receitas passaram as despesas em 486 mi" | Anexo 1 2025, p. 2: Superávit (XIII) R$ 486.237.597,62 | |

## Diferenças entre o PDF e o Tesouro
- Nenhuma nos números usados: todos aparecem iguais no PDF do portal e no Siconfi.
- O rodapé da p. 3 do Anexo 2 de 2025 traz "Emissão: 23/01/2025", provavelmente erro de digitação (o relatório é de jan/2026). Não muda os números.

## Conferir antes de publicar
- Se saiu o RREO do 5º bimestre de 2026 (até outubro), caso queira atualizar.
- Ouvir as falas com números com vírgula (1,2; 2,4; 29,5%).

## Versão 2 do roteiro (04/11/2026, mais didática)
| Frase nova | Fonte | Observação |
|---|---|---|
| "A lei obriga: pelo menos 25% dos impostos na educação e 15% na saúde" | Constituição, art. 212 (educação) e art. 198 com a LC 141/2012, art. 7º (saúde, municípios) | os percentuais aplicados estão no Anexo 14 do RREO (ver tabela acima) |
| "IPTU, das casas e terrenos" | CTN, art. 32 (imposto sobre a propriedade predial e territorial urbana) | explicação simplificada |
| "O orçamento diz quanto pretende gastar; o relatório mostra quanto saiu" | RREO, Anexo 2: colunas "Dotação inicial" × "Despesas liquidadas" | é a comparação usada em todo o "previsto × saiu" |

## Versão 3 do roteiro (04/11/2026, linha de raciocínio do 014): só dados de Salvador
Conferência automática: todos os JSON usados são da "Prefeitura Municipal de Salvador - BA" (id 2927408). Nenhuma outra cidade é citada no roteiro.
| Frase nova | Fonte | Conta |
|---|---|---|
| "arrecadou 12,4 bilhões" | RREO 6º bim. 2025, Anexo 1: total das receitas R$ 12.385,3 mi (com intra, como o total gasto de 11,9) | |
| "pouco mais de 1 de cada 3 reais dos impostos" | Anexo 1: impostos R$ 4.261,2 mi | 4.261,2 ÷ 12.385,3 = 34,4% |
| "metade da saúde para hospitais" | Anexo 2: Assist. Hospitalar R$ 1.486,5 mi de R$ 2.881,4 mi | 52% |
| "administração 555, mais que assistência, cultura e meio ambiente juntos" | Anexo 2 | 304 + 82 + 38 = 424 < 555 |
| "de cada 10 reais, 3 para salários: 3,7 bi" | Anexo 1: pessoal e encargos R$ 3.740,0 mi | 3.740 ÷ 11.899 = 31,4% |
| "obras e equipamentos 930 mi; 8 em cada 100; previstos 1,6 bi" | Anexo 1: investimentos | 930,4 ÷ 11.899 = 7,8% |
| "saúde 23,2%; educação 25,7%" | Anexo 14: 23,21% e 25,73% | |
| "Câmara 284, mais que o dobro da segurança (125)" | Anexo 2 | 283,9 ÷ 124,9 = 2,3 |
