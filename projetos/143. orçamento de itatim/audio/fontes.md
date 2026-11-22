# 143. orçamento de itatim: fontes

Pesquisa inicial em 12/11/2026, sem navegador (API do IBGE e do SICONFI por curl). Tudo aqui é **CRUZAMENTO**: serve para conferir os números do TCM depois. **Nenhum número daqui vai para a tela ou para a fala.**

## 1. Município (IBGE)
| Dado | Valor | Fonte |
|---|---|---|
| Código IBGE | 2916856 | https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios |
| Microrregião / mesorregião | Feira de Santana / Centro Norte Baiano | mesma API |
| Região imediata / intermediária | Cruz das Almas / Santo Antônio de Jesus | mesma API |
| População, Censo 2022 | 15.737 | agregado 4709, variável 93 |
| Estimativa | 16.375 (2024), 16.454 (2025), 16.526 (2026) | agregado 6579, variável 9324 |

## 2. SICONFI (CRUZAMENTO; JSON em ~/Documents/RECEITAS-DESPESAS-ITATIM/siconfi/)
- Entregas: RREO 1º a 6º bimestre de 2024 e de 2025; 2026 até o 4º bimestre. DCA 2024 (30/04/2025) e DCA 2025 (30/04/2026).

| Ano | Receita (líquida do Fundeb) | Previsão atualizada | Empenhado | Liquidado |
|---|---|---|---|---|
| 2024 | 109.926.507,72 | 107.945.044,53 | 108.615.619,99 | 108.094.644,50 |
| 2025 | 123.465.049,76 | 134.939.982,20 | 126.768.951,75 | 125.772.961,75 |
| 2026 até ago | 95.943.429,35 | 158.855.905,00 | 129.913.423,00 | 91.566.868,27 |

- 2024: sobraram cerca de 1,8 mi no liquidado. 2025: liquidou cerca de 2,3 mi a mais do que arrecadou (conta própria). Conferir no Balanço do TCM.
- Receita de capital: 6,95 mi (2024) e 2,95 mi (2025).
- Complementação da União ao Fundeb muito alta: 19,4 mi (2024) e 28,2 mi (2025). Fundeb (retorno): 22,6 e 25,9 mi. Educação é o maior setor (52,6 e 66,6 mi).
- FPM bruto 32,2 / 35,8 mi; SUS da União 13,2 / 12,5 mi; ICMS bruto 8,0 / 9,2 mi; IPTU 220 mil / 308 mil; impostos e taxas da cidade 7,6 / 7,9 mi; emenda Pix (transferência especial) 150 mil / 742,5 mil.

### Despesa por função (liquidado, RREO Anexo 02)
| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Educação | 52.596.286,70 | 66.576.678,05 | 48.231.023,50 |
| Saúde | 21.488.216,97 | 22.917.587,18 | 17.461.157,26 |
| Administração | 11.072.454,61 | 13.570.846,14 | 7.644.048,99 |
| Urbanismo | 10.114.473,57 | 7.068.204,42 | 4.414.794,03 |
| Cultura | 5.827.484,14 | 8.235.921,18 | 6.422.526,63 |
| Desporto e lazer | 2.478.322,06 | 1.213.612,74 | 5.987,83 |
| Legislativa (Câmara) | 2.320.035,12 | 3.357.558,18 | 2.212.367,69 |
| Assistência social | 1.656.717,39 | 1.913.303,54 | 1.334.474,36 |
| Agricultura | 261.596,34 | 434.264,47 | 562.667,55 |
| Encargos especiais | (não aparece) | (não aparece) | 2.507.287,09 |
| Segurança pública | 68.042,60 | 73.935,85 | 57.207,86 |

Pistas para o TCM (não são achados):
- Cultura com 5,8 mi, 8,2 mi e 6,4 mi até agosto: muito acima da assistência social (1,7 / 1,9 / 1,3) e da agricultura. Provavelmente festas (São João). Separar pelas ações e pela relação de pagamentos (regra 99, molde 137 Cordeiros).
- Encargos especiais zerados em 2024 e 2025 no RREO: conferir onde estão a dívida e o PASEP.
- Câmara: 2,3 mi (2024) contra 3,4 mi (2025). Conferir o duodécimo.

## 3. Notícias: ver referencias/noticias.md (lista interna).
