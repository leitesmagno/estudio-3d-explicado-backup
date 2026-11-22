# 137. orçamento de cordeiros: fontes

Pesquisa inicial em 12/11/2026, sem navegador (API do IBGE e do SICONFI por curl). Tudo neste arquivo, por enquanto, é **CRUZAMENTO**: serve para conferir os números do TCM depois. **Nenhum número daqui vai para a tela ou para a fala.** A fonte dos números do vídeo é o e-TCM (regra do molde 093).

## 1. Município (IBGE)

| Dado | Valor | Fonte | Checado em |
|---|---|---|---|
| Código IBGE | 2909000 | https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios | 12/11/2026 |
| Microrregião / mesorregião | Brumado / Centro Sul Baiano | mesma API | 12/11/2026 |
| Região imediata e intermediária | Vitória da Conquista | mesma API | 12/11/2026 |
| População, Censo 2022 | 7.546 pessoas | https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[2909000] | 12/11/2026 |
| População estimada | 7.763 (2024), 7.748 (2025), 7.735 (2026) | https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-3/variaveis/9324?localidades=N6[2909000] | 12/11/2026 |

Cidade pequena, na divisa com Minas Gerais (BA-148). Vizinhas para o satélite do Kit Mapas: Condeúba (136, em produção) fica ao lado; dá para copiar os tiles de lá.

## 2. SICONFI (Tesouro Nacional): CRUZAMENTO

Arquivos JSON guardados em `~/Documents/RECEITAS-DESPESAS-CORDEIROS/siconfi/`.
API: `https://apidatalake.tesouro.gov.br/ords/siconfi/tt/` (rreo, dca, extrato_entregas), id_ente=2909000.

### Entregas (extrato_entregas)
- Prefeitura: RREO de todos os bimestres de 2024 e 2025; 2026 até o 4º bimestre (entregue em 24/09/2026). DCA 2024 (06/05/2025) e DCA 2025 (30/04/2026). MSC até 09/2026.
- Câmara: RGF e MSC próprios; a DCA e o RREO saem só pela Prefeitura (consolidado).

### Totais

| Ano | Receita realizada (líquida do Fundeb) | Despesa empenhada | Despesa liquidada | Despesa paga | Fonte |
|---|---|---|---|---|---|
| 2024 | R$ 44.096.473,27 | R$ 46.511.977,68 (DCA) / 46.371.977,68 (RREO) | R$ 46.371.977,68 | R$ 46.371.977,68 | RREO 6º bim 2024, Anexo 01; DCA 2024, Anexos I-C e I-D |
| 2025 | R$ 45.926.522,56 | R$ 45.747.757,31 | R$ 45.743.757,31 | R$ 44.517.621,04 | RREO 6º bim 2025, Anexo 01; DCA 2025 |
| 2026 até ago (4º bim) | R$ 35.755.017,81 | R$ 48.237.731,40 | R$ 30.004.456,93 | R$ 29.704.497,05 | RREO 4º bim 2026, Anexo 01 |

- Conferência DCA x RREO: 2024 bruto 48.406.107,99 menos Fundeb 4.309.634,72 = 44.096.473,27 (bate). 2025 bruto 50.626.107,43 menos Fundeb 4.699.584,87 = 45.926.522,56 (bate).
- Previsão atualizada da receita: 50,1 mi (2024), 65,84 mi (2025), 62,5 mi (2026). Em 2025 arrecadou cerca de 19,9 mi a menos que o previsto (conta própria: 65.840.000,00 menos 45.926.522,56). Conferir no Balanço do TCM: pode ser só orçamento inflado.
- 2024: liquidou cerca de 2,28 mi a mais do que arrecadou (conta própria). Conferir no TCM (superávit de anos anteriores? restos a pagar?).
- 2024 no RREO: empenhado = liquidado = pago. Na DCA, empenhado tem 140 mil a mais (restos a pagar não processados). Estranho; anotar e conferir no Balanço.
- 2026: empenhado 48,2 mi até agosto, contra 35,8 mi arrecadados. Normal empenhar o ano todo no começo; usar o liquidado.

### Receita 2025 (DCA I-C, bruto antes do Fundeb), para o bloco "de onde veio"
- IPTU 80.276,10 · ISS 348.439,97 · IRRF 494.965,02 · taxas 263.729,40 (impostos e taxas da cidade: 1.209.121,49)
- FPM 21.458.799,24 (dedução Fundeb 3.820.732,12)
- SUS da União 5.813.337,20 (2024: 7.588.805,45, caiu cerca de 1,78 mi; conferir no FNS)
- Complementação da União ao Fundeb 5.444.004,52 (2024: 3.626.827,91)
- FNDE 1.069.296,56 · FNAS 272.423,24 · convênios da União 1.134.990,59
- ICMS 4.021.754,44 (dedução 804.350,63) · IPVA 371.017,47 · convênios do Estado 1.218.900,87 (2024: 3.584.623,30)
- Fundeb (1.7.5.1) 6.959.118,00
- Receita de capital: zero em 2024 e 2025 no SICONFI; 350 mil até ago/2026.
- IPTU 2024: 70.818,96. Iluminação pública (CIP): não aparece com valor acima de 50 mil; procurar no PCMGE016.

### Despesa por função (liquidado, RREO Anexo 02)

| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Educação | 15.494.375,24 | 16.485.574,39 | 12.257.194,06 |
| Saúde | 11.233.074,46 | 10.797.244,50 | 7.188.297,17 |
| Administração | 10.697.622,56 | 9.940.793,83 | 5.253.634,22 |
| Encargos especiais (dívidas) | 2.176.438,93 | 2.617.044,53 | 534.212,50 |
| Urbanismo | 1.517.023,06 | 332.242,28 | 451.297,18 |
| Desporto e lazer | 1.492.184,28 (Lazer 1.198.180,97) | 408.087,32 | 95.476,62 |
| Assistência social | 1.163.781,74 | 1.123.882,30 | 932.711,38 |
| Cultura (difusão cultural) | 75.163,36 | 1.163.182,26 | 1.060.408,29 |
| Legislativa (Câmara) | 872.150,86 | 1.643.007,37 | 1.019.072,69 |
| Transporte | 772.959,98 | 594.737,16 | 510.817,82 |
| Saneamento | 477.166,81 | zero | 14.708,40 |
| Essencial à Justiça | 156.000,00 | 385.500,00 | 374.805,91 |
| Agricultura | 244.036,40 | 252.461,37 | 311.820,69 |

Pistas para o TCM (não são achados ainda):
- Lazer 2024 com 1,20 mi e Cultura 2025/2026 com mais de 1 mi: provavelmente festas (São João, aniversário). Separar festas de Cultura pelas ações do PCMGE015 (regra 99).
- Câmara 2024 só 872 mil no RREO contra 1,64 mi em 2025: conferir duodécimo no TCM e no portal do gestor.
- Saneamento zero em 2025: conferir se existe SAAE ou EMBASA (zero precisa de motivo).
- Urbanismo caiu de 1,52 mi (2024) para 332 mil (2025).
- Meio ambiente, habitação, indústria, comércio, segurança: sem valor nos 3 anos.

## 3. Notícias (lista interna, sem acusação; nada disso vai para o vídeo sem conferência no TCM)

Ver `../referencias/noticias.md`.

## 4. TCM-BA (a fazer, depois do "pode pesquisar")
- e-TCM: código do município, UJ da Prefeitura e da Câmara, último mês entregue.
- Balanço e Anexo 9 de 2024 e 2025; PCMGE015/016 de 12/2024, 12/2025 e último mês de 2026 (Prefeitura e Câmara); PCAGO015 anual de todos os anos (regra 111).
- Decisões e auditorias; duodécimo no portal do gestor.
