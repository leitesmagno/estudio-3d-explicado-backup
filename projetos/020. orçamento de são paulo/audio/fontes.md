# Fontes do roteiro 020. orçamento de são paulo (checadas em 04/11/2026)

Documentos oficiais em `referencias/pdfs da prefeitura/`, baixados do site da Secretaria Municipal da Fazenda (prefeitura.sp.gov.br, página "Demonstrativos da Lei de Responsabilidade Fiscal 6º Bimestre de 2025 (Dados Definitivos)"; 2024 em capital.sp.gov.br). Conferência com o Siconfi (Tesouro Nacional), em `referencias/*.json`: os números do PDF e do Siconfi são iguais.

| Fato no roteiro | Fonte | Observação |
|---|---|---|
| "gastou 117 bilhões em 2025" | RREO 6º bim. 2025, Anexo 1, p. 2: despesas liquidadas, total (X) R$ 117.009.214.332,57 | inclui intra-orçamentárias, como no 017. Sem elas: R$ 106,09 bi |
| "quase 10 mil reais por morador" | conta própria: 117,0 bi ÷ 12,2 mi (população usada pelo Siconfi, IBGE) = R$ 9.590 | com 11,9 mi dá R$ 9.830: "quase 10 mil" vale nos dois |
| "governo federal, cerca de 5 bilhões" | Anexo 1, p. 1: Transferências correntes da União R$ 4.886.529.002,68 | mais parte das transferências de capital (R$ 481,6 mi no total, sem divisão por origem no Siconfi): "cerca de 5" |
| "o estado, 12" | Anexo 1, p. 1: Transferências dos Estados R$ 12.477.722.240,12 | cota do ICMS 10,1 bi e do IPVA 4,65 bi (Anexo 3), antes da dedução do Fundeb |
| "o Fundeb, mais 8" | Anexo 1, p. 1: Transferências de outras instituições públicas R$ 8.065.660.789,25 | Anexo 3: Transferências do Fundeb R$ 8,18 bi |
| "impostos da cidade, 67 bilhões" | Anexo 1, p. 1: Impostos R$ 67.278.985.460,92 | com taxas: R$ 68,02 bi |
| "6 de cada 10 reais" | conta própria: 67,28 ÷ 112,34 (receitas exceto intra, Anexo 1, p. 1) = 59,9% | |
| "ISS 39 bilhões; IPTU 18" | Anexo 3 (RCL), p. 1: ISS R$ 39,46 bi; IPTU R$ 18,08 bi | 39,46 ÷ 67,28 = 58,7% ("mais da metade"); 39,46 ÷ 18,08 = 2,2 |
| "educação 24 bi; mais da metade na educação infantil" | Anexo 2, p. 2: Educação R$ 23.584.096.338,05; Educação Infantil R$ 12.434.327.076,38 | 52,7% |
| "saúde 23 bi; previstos 22" | Anexo 2, p. 2: Saúde liquidada R$ 23.342.248.911,99; dotação inicial R$ 22.059.421.904,00 | |
| "aposentadorias e pensões: 15 bi, terceira maior conta" | Anexo 2, p. 2: Previdência Social R$ 15.371.382.733,72 (Regime Estatutário R$ 14,04 bi) | ordem: educação 23,58 · saúde 23,34 · previdência 15,37 · transporte 11,54 |
| "transporte 11 bi e meio; quase 10 no coletivo" | Anexo 2, p. 4: Transporte R$ 11.538.044.380,81; Transportes Coletivos Urbanos R$ 9.695.170.693,01 | conferido na imagem da página |
| "ruas e serviços: quase 9 bi" | Anexo 2, p. 3: Urbanismo R$ 8.553.832.129,95; Serviços Urbanos R$ 6.557.889.903,84 | |
| "Câmara e Tribunal de Contas: 1,3 bi" | Anexo 2, p. 1: Legislativa R$ 1.321.502.981,57 (Ação Legislativa R$ 857,0 mi; Controle Externo R$ 406,8 mi) | São Paulo tem Tribunal de Contas do Município próprio |
| "segurança pública 1,7" | Anexo 2, p. 1: Segurança Pública R$ 1.664.780.062,33 | |
| "habitação 3 bi; previstos 5,4; em 2024, 4,8" | Anexo 2 2025, p. 3: R$ 3.234.864.885,76; dotação inicial R$ 5.406.210.971,00 · Anexo 2 2024, p. 3: R$ 4.764.078.593,96 | |
| "assistência 2,6; cultura 1,1; saneamento 1,3; em 2024, 2" | Anexo 2 2025, p. 1 e 3: R$ 2.606.950.631,91 · R$ 1.107.667.067,89 · R$ 1.310.153.129,95 · Anexo 2 2024, p. 3: saneamento R$ 2.033.377.157,72 | |
| "obras e equipamentos: 15 previstos, saíram 8" | Anexo 1, p. 2: Investimentos, dotação inicial R$ 15,39 bi; liquidado R$ 8,39 bi | 54,5% |
| "pessoal 27%, teto 54%" | RGF 3º quadr. 2025, Poder Executivo, Anexo 1 (Siconfi): DTP R$ 26,86 bi = 26,82% da RCL ajustada; limite máximo 54% | PDF do RGF não achado no site; conferir |
| "saúde 24% (mín. 15); educação 25,2% (mín. 25)" | Anexo 14 simplificado, p. 1: saúde 23,85%; MDE 25,17% | a Lei Orgânica de SP (art. 208) tem regra própria para a educação; o roteiro usa o mínimo da Constituição |
| "receitas passaram as despesas em 6 bilhões" | Anexo 1, p. 2: Superávit R$ 6.442,6 mi | |

## Conferir antes de publicar
- PDF do RGF do 3º quadrimestre de 2025 no site da Fazenda (percentual de pessoal).
- Se saiu o RREO do 5º bimestre de 2026.

## Versão 2 do roteiro (04/11/2026)
| Fato | Fonte | Observação |
|---|---|---|
| "terceira maior conta: aposentadorias e pensões, mais do que todo o transporte" | Anexo 2, p. 2 e 4: previdência R$ 15,37 bi > transporte R$ 11,54 bi | |
| "ISS carrega mais da metade" | 39,46 ÷ 67,28 = 58,7% dos impostos | |
| "6 de cada 10 reais vêm de impostos pagos na cidade" | 67,28 ÷ 112,34 = 59,9% | |
| Saúde acima do previsto | 23,34 > 22,06 | a educação também passou (23,58 > 23,08); o roteiro não diz "única" |
| "quase 10 para os ônibus" | Transportes Coletivos Urbanos R$ 9,70 bi (p. 4) | ônibus municipais (SPTrans); o metrô é do estado |
| "os mínimos foram cumpridos" | Anexo 14: saúde 23,85% (mín. 15), MDE 25,17% (mín. 25) | |

## Versão 3 do roteiro (04/11/2026): mais áreas, até 3 minutos
Todas do RREO 6º bim. 2025, Anexo 2 (PDF da prefeitura, despesas liquidadas), salvo indicação.
| Fato | Fonte | Observação |
|---|---|---|
| creches e pré-escolas 12 bi; fundamental quase 7 | p. 2: Educação Infantil R$ 12.434.327.076,38; Ensino Fundamental R$ 6.755.533.134,69 | 12,43 ÷ 6,76 = 1,84 ("quase o dobro") |
| saúde: 9,5 bi postos de saúde; quase 10 hospitais | p. 2: Atenção Básica R$ 9.466.144.312,95; Assistência Hospitalar e Ambulatorial R$ 9.672.666.587,17 | "postos de saúde" = atenção básica (UBS) |
| serviços urbanos, mais de 6,5 bi | p. 3: Serviços Urbanos R$ 6.557.889.903,84 | |
| administração 3 bi | p. 1: Administração R$ 3.067.869.324,74 | |
| dívida 2,3 bi, entre juros e parcelas | Anexo 1, p. 2: juros R$ 692,7 mi + amortização R$ 1.618,7 mi = R$ 2,31 bi | |
| defesa civil 47 mi | p. 1: Defesa Civil R$ 47.331.403,95 | |
| turismo 751 mi; esporte e lazer 734 mi | p. 4: Comércio e Serviços (Turismo) R$ 750.660.794,67; Desporto e Lazer R$ 734.054.788,24 | |
| direitos da cidadania 700 mi | p. 3: R$ 701.504.941,13 | |
| meio ambiente 650 mi | p. 4: Gestão Ambiental R$ 651.796.804,53 | |
| trabalho e emprego quase 500 mi | p. 2: Trabalho R$ 487.526.903,39 | |
| comunicações 353 mi; comunicação social 194 mi | p. 4: Comunicações R$ 353.190.911,53; Comunicação Social R$ 194.250.048,09 | o resto é tecnologia da informação |
| relações exteriores 18 mi | p. 1: R$ 18.226.223,15 | |
| agricultura 9 mi; zona rural | p. 4: Agricultura (Extensão Rural) R$ 9.248.590,59 | a cidade tem zona rural no extremo sul (Parelheiros e Marsilac) |
| ciência e tecnologia 5,7 mi, menos de 50 centavos por morador | p. 4: R$ 5.688.955,95; conta própria: 5,69 mi ÷ 12,2 mi = R$ 0,47 (ou R$ 0,48 com 11,9 mi) | não é a menor: defesa nacional teve R$ 0,2 mi; o roteiro não diz "a menor" |
| habitação 3,2 bi | p. 3: R$ 3.234.864.885,76 | |
| Fora do roteiro | Judiciária R$ 329 mi (p. 1), Defesa Nacional R$ 0,2 mi | nome técnico confuso para o público |
