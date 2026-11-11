# Fontes do roteiro 022. orçamento de vitória da conquista (checadas em 04/11/2026)

Documentos oficiais baixados do portal da transparência de Vitória da Conquista (https://vitoriadaconquista-ba.portaltp.com.br/consultas/documentos.aspx?id=4 para RREO e ?id=5 para RGF) e guardados em `referencias/pdfs do portal/`. Os relatórios saem no Diário Oficial do Município: cada PDF é um trecho do DOM, com as tabelas em imagem (lidas por OCR e conferidas na imagem da página quando havia dúvida).

Links diretos para conferir:
- RREO 6º bim. 2025 (com o RGF 3º quadr. 2025 no fim), DOM nº 4.152 de 30/01/2026: https://vitoriadaconquista-ba.portaltp.com.br/common/DocumentoS3.ashx?id=1736320 (arquivo `RREO 6bim 2025.pdf`)
- RGF 3º quadr. 2025, Executivo (mesma edição do DOM): https://vitoriadaconquista-ba.portaltp.com.br/common/DocumentoS3.ashx?id=1736326 (arquivo `RGF 3quadr 2025.pdf`)
- RGF 3º quadr. 2025 consolidado (com a Câmara), DOM de 27/02/2026: https://vitoriadaconquista-ba.portaltp.com.br/common/DocumentoS3.ashx?id=1756953
- RREO 6º bim. 2024, DOM nº 3.898 de 30/01/2025: https://vitoriadaconquista-ba.portaltp.com.br/common/DocumentoS3.ashx?id=1498526 (arquivo `RREO 6bim 2024.pdf`)
- RREO 4º bim. 2026 e RGF 2º quadr. 2026 (só para o "conferir antes de publicar"): ids 1990098 e 1990100

Páginas: "p." é a página do arquivo PDF; entre parênteses, a página do Diário Oficial. No RREO 2025, página do DOM = p. + 48. No RREO 2024, página do DOM = p. + 89.

Conferência: Siconfi (Tesouro Nacional), id_ente 2933307, JSON em `referencias/`. Todos os valores abaixo aparecem iguais no PDF e no Siconfi.

| Fato no roteiro | Fonte (arquivo, anexo, página, valor exato) | Observação |
|---|---|---|
| "gastou 1 bilhão e 480 milhões em 2025" | RREO 6º bim. 2025, Anexo 1, p. 3 (DOM 51): despesas liquidadas R$ 1.481.451.467,98 | não há despesa intra-orçamentária |
| "mais de 3.800 reais por morador" | conta própria: 1.481,45 mi ÷ 387.524 moradores (população usada pelo Siconfi, IBGE) = R$ 3.823 | |
| "governo federal mandou 587 milhões" | Anexo 1, p. 2 (DOM 50): Transferências da União R$ 587.402.790,39 | inclui FPM (R$ 214,1 mi, Anexo 3, p. 13), SUS e a complementação da União ao Fundeb |
| "o estado, 245" | Anexo 1, p. 2: Transferências dos Estados R$ 245.007.689,92 | cota do ICMS R$ 226,3 mi (Anexo 3, p. 13) |
| "o Fundeb, mais 246" | Anexo 1, p. 2: Transferências de outras instituições públicas R$ 246.199.063,26 | retorno do fundo estadual do Fundeb |
| "impostos da cidade: 328 milhões" | Anexo 1, p. 2: Impostos R$ 327.971.341,28 | com taxas: R$ 355,2 mi |
| "só 1 de cada 5 reais" | conta própria: 327,97 ÷ 1.519,84 (receitas totais, Anexo 1, p. 2) = 21,6% | |
| "a União manda quase o dobro" | conta própria: 587,4 ÷ 328,0 = 1,79 | |
| "ISS 157; quase o dobro do IPTU, 80" | RREO 6º bim. 2025, Anexo 3, p. 13 (DOM 61): ISS R$ 157,22 mi; IPTU R$ 80,43 mi (12 meses) | 157,22 ÷ 80,43 = 1,95 |
| "educação 520 milhões; quase 8 de cada 10 no fundamental; creches 78" | Anexo 2, p. 6 (DOM 54): Educação R$ 519.947.637,45; Ensino Fundamental R$ 400.951.739,90; Educação Infantil R$ 77.722.190,74 | 400,95 ÷ 519,95 = 77% |
| "saúde 368; metade hospitais 185; postos 106; em 2024, 84" | Anexo 2 2025, p. 6: Saúde R$ 367.929.722,93; Assist. Hospitalar e Ambulatorial R$ 185.160.568,02; Atenção Básica R$ 105.741.245,67 · Anexo 2 2024, p. 7 (DOM 96): Atenção Básica R$ 83.656.071,42 | 185,16 ÷ 367,93 = 50,3%. "Postos de saúde" = atenção básica |
| "urbanismo 240; ônibus 103; limpeza, iluminação e manutenção 93" | Anexo 2 2025, p. 7 (DOM 55): Urbanismo R$ 239.739.694,57; Transportes Coletivos Urbanos R$ 102.686.245,66; Serviços Urbanos R$ 92.534.534,64 | conferido na imagem da página |
| "administração 116" | Anexo 2, p. 6: R$ 116.279.934,78 | 2024: R$ 96,38 mi |
| "dívida 78 milhões; juros previstos 25, saíram 41" | Anexo 1, p. 3: Juros e encargos, dotação inicial R$ 25.000.000,00, liquidado R$ 41.261.438,20; Amortização R$ 36.842.958,30 | 41,26 + 36,84 = 78,10 |
| "Câmara 37 milhões e meio" | Anexo 2, p. 6: Legislativa R$ 37.484.721,10 | |
| "assistência 34; em 2024, 23" | Anexo 2 2025, p. 6: R$ 34.019.879,55 · 2024, p. 6 (DOM 95): R$ 23.149.381,67 | |
| "agricultura 26; previstos 71" | Anexo 2 2025, p. 7: dotação inicial R$ 71.144.554,51; liquidado R$ 25.788.846,55 | extensão rural R$ 20,19 mi |
| "cultura 18; mais que o dobro de 2024" | Anexo 2 2025, p. 7: R$ 17.796.338,26 · 2024, p. 7: R$ 8.071.396,36 | ×2,2 |
| "meio ambiente 8; estradas 7; trabalho 3,4" | Anexo 2 2025, p. 7: Gestão Ambiental R$ 8.308.935,06 · p. 8 (DOM 56): Transporte Rodoviário R$ 7.061.944,05 · p. 6: Trabalho R$ 3.400.626,86 | "estradas" = transporte rodoviário |
| "esporte: 11 previstos, saíram 850 mil" | Anexo 2 2025, p. 8: dotação inicial R$ 11.227.415,49; liquidado R$ 853.103,14 | |
| "habitação 600 mil" | Anexo 2 2025, p. 7: R$ 605.653,40 | |
| "segurança: só a defesa civil, 290 mil" | Anexo 2 2025, p. 6: Segurança Pública = Defesa Civil R$ 287.815,29 | a função só tem a subfunção defesa civil |
| "saneamento: 10 mil previstos, gasto nada; em 2024, 30 milhões" | Anexo 2 2025, p. 7: Saneamento, dotação inicial R$ 10.000,00, liquidado em branco · Anexo 2 2024, p. 7 e 8: Saneamento R$ 29.847.712,86 | conferido na imagem da página 7 de 2025. O roteiro não fala de água e esgoto (que podem ser de empresa estadual, a confirmar); fala só da função "saneamento" da prefeitura |
| "ciência e tecnologia também no zero" | Anexo 2 2025, p. 7: dotação inicial R$ 350.000,00, liquidado em branco | |
| "obras e equipamentos: 234 previstos, 67; menos de 3 em 10" | Anexo 1, p. 3: Investimentos, dotação inicial R$ 233.902.775,94; liquidado R$ 67.130.198,14 | 28,7% |
| "infraestrutura das ruas: 149 previstos, 44; em 2024, 144" | Anexo 2 2025, p. 7: Infra-Estrutura Urbana, dotação inicial R$ 148.570.253,03; liquidado R$ 43.987.698,82 · 2024, p. 7: R$ 144.164.185,51 | |
| "dívida 78 > obras 67" | conta própria com os valores acima | |
| "pessoal 46,7%; alerta 48,6" | RGF 3º quadr. 2025, Anexo 6 (simplificado), p. 36 do arquivo do RREO (DOM 84): DTP R$ 685.496.138,44; RCL ajustada R$ 1.467.209.096,91 | 46,72%. Siconfi igual. Limites: 54% máximo, 51,3% prudencial, 48,6% alerta |
| "saúde 16,4% (mín. 15); educação 25,1% (mín. 25)" | RREO 6º bim. 2025, Anexo 14 (simplificado), p. 32 (DOM 80): saúde 16,43%; MDE 25,08% | |
| "receitas passaram as despesas em 38 milhões" | Anexo 1, p. 3: Superávit R$ 38.385.829,30 | receitas R$ 1.519,84 mi − despesas R$ 1.481,45 mi |

## Fora do roteiro (contexto)
- Não há função Previdência no Anexo 2, embora o RREO traga o Anexo 4 do regime próprio (p. 15).
- Turismo (Comércio e Serviços) não aparece no Anexo 2 de 2025; em 2024 tinha R$ 60 mil previstos.
- O Anexo 3 mostra "Transferências do Fundeb" R$ 389,17 mi (conta diferente da linha do Anexo 1, que separa a complementação da União).
- Encargos especiais R$ 95,37 mi: dívida interna R$ 26,88 mi + "demais subfunções" R$ 68,49 mi (o relatório não detalha).

## Conferir antes de publicar
- Se saiu o RREO do 5º bimestre de 2026 ou o RGF do 3º quadrimestre de 2026 (mudaria só contexto; o vídeo é de 2025).
- Quem opera água e esgoto na cidade (se quiser citar no vídeo).

## Versão 2 do roteiro (04/11/2026, mais didática)
| Frase nova | Fonte | Observação |
|---|---|---|
| "A lei obriga: pelo menos 25% dos impostos na educação e 15% na saúde" | Constituição, art. 212 (educação) e art. 198 com a LC 141/2012, art. 7º (saúde, municípios) | os percentuais aplicados estão no Anexo 14 do RREO (ver tabela acima) |
| "IPTU, das casas e terrenos" | CTN, art. 32 (imposto sobre a propriedade predial e territorial urbana) | explicação simplificada |
| "O orçamento diz quanto pretende gastar; o relatório mostra quanto saiu" | RREO, Anexo 2: colunas "Dotação inicial" × "Despesas liquidadas" | é a comparação usada em todo o "previsto × saiu" |

## Versão 3 do roteiro (04/11/2026, linha de raciocínio do 014): só dados de Vitória da Conquista
Conferência automática: todos os JSON usados são da "Prefeitura Municipal de Vitória da Conquista - BA" (id 2933307). Nenhuma outra cidade é citada no roteiro.
| Frase nova | Fonte | Conta |
|---|---|---|
| "arrecadou 1 bilhão e 520 milhões" | RREO 6º bim. 2025, Anexo 1 (receitas realizadas) · Siconfi R$ 1.519,8 mi | |
| "só 1 de cada 5 reais dos impostos da cidade" | Anexo 1: impostos R$ 328,0 mi | 328,0 ÷ 1.519,8 = 21,6% |
| "a União mandou 587, quase o dobro dos impostos" | Anexo 1: transferências da União R$ 587,4 mi | 587,4 ÷ 328,0 = 1,79 |
| "administração 116, quase o dobro de assistência, cultura, meio ambiente e esporte juntos" | Anexo 2 | 34,0 + 17,8 + 8,3 + 0,85 = 61,0; 116,3 ÷ 61,0 = 1,9 |
| "Câmara mais de 100 vezes a segurança" | Anexo 2: Legislativa R$ 37,48 mi; Segurança (defesa civil) R$ 0,29 mi | 37,48 ÷ 0,29 = 129 |
| "quase metade para salários e encargos: 713" | Anexo 1: pessoal e encargos liquidados R$ 712,9 mi (Siconfi; conferir no PDF, p. do Anexo 1) | 712,9 ÷ 1.481,5 = 48,1% |
| "obras e equipamentos 67; menos de 5 em cada 100; previstos 234" | Anexo 1: investimentos | 67,1 ÷ 1.481,5 = 4,5% |
| "quase 8 de cada 10 da educação no fundamental" | Anexo 2: Ensino Fundamental R$ 401,0 mi de R$ 519,9 mi | 77% |
