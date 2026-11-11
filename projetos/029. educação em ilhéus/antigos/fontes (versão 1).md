# Fontes do roteiro 029. educação em ilhéus (checadas em 05/11/2026)

Regra deste vídeo: só os documentos e dados reunidos no projeto `~/Documents/EDUCACAO-ILHEUS` (pasta abaixo chamada de **EI**). Nenhum número de outra cidade. Valores nominais, salvo a correção pelo IPCA.

| Fato no roteiro | Fonte | Observação |
|---|---|---|
| "em 18 anos, 2 bilhões" e "2 bilhões e 90 milhões" | SIOPE/FNDE, despesa da função Educação empenhada, 2008 a 2025 (EI `dados_brutos/siope/Dados_Gerais_Siope_<ano>.json`) | conta própria: soma de 2008 a 2025 = R$ 2,087 bi. 18 anos = 2008 a 2025 |
| "documentos de 2006 a 2026" | EI `documentos_prefeitura/` (RREO 2013–2026, LOAs 2004–2026, balanços, pareceres do TCM-BA) | baixados pela pessoa do portal da transparência |
| mínimo de 25% dos impostos | RREO, Anexo 8 ("Aplicação em MDE sobre a receita resultante de impostos", mínimo 25%) e parecer TCM 2019, item 7 (art. 212 da Constituição) | EI `documentos_prefeitura/rreo_mde/2023.txt`; `texto/balancos/Prestacao_de_Contas_2019.PDF.txt` |
| Fundeb: 20% de repasses como FPM e ICMS | RREO 2023, Anexo 8, linha 4 ("Total destinado ao FUNDEB, 20% de FPM, ICMS, IPI, ITR, IPVA") | |
| 613 milhões para o fundo, 1 bilhão e 360 milhões de volta, 2008 a 2025 | SIOPE (deduções para o FUNDEB e receitas do FUNDEB + complementação da União) | conta própria: 612,9 e 1.359,4. 1.359,4 ÷ 612,9 = 2,2 ("mais que o dobro"). 2014 usa estimativa de 20%, porque o SIOPE traz uma dedução de R$ 14,5 mi com rótulo errado |
| 2008: 43 milhões | SIOPE 2008 (R$ 42,66 mi) | |
| 2024: 269 milhões, recorde | SIOPE 2024 e Balanço Anual 2024, função 12 (R$ 269,27 mi) | maior valor da série 2008–2025 |
| 2025: 231 milhões | SIOPE 2025 e Balanço Anual 2025, função 12 (R$ 231,19 mi) | |
| 3 bilhões e 190 milhões corrigidos | conta própria: IPCA do Banco Central (série 433) até set/2026, média do ano de cada despesa | EI `dados_brutos/ipca_mensal_bcb433.json` |
| SIOPE abaixo de 25%: 2012 (22,8%), 2016 (22,1%), 2021 (22,3%) | SIOPE, indicador 1.1 de cada ano (22,79 · 22,10 · 22,32) | |
| emenda que livrou 2021 de punição pela pandemia | EC 119/2022, citada no parecer do TCM 2023 ("Do cumprimento à Emenda Constitucional n.º 119/2022") | |
| 2019: relatório da prefeitura 26,8% | RREO 6º bim. 2019, Anexo 14 (26,77%) | EI `documentos_prefeitura/rreo_mde/2019.txt` |
| 2019: TCM chegou a 24% | Parecer prévio TCM-BA, processo 06442e20, item 7 ("alcançou o percentual de 24,03%") | |
| TCM recomendou rejeitar 2018, 2019 e 2020 | Pareceres 04894e19 (2018) e 06442e20 (2019); tabela do parecer 07666e24 (2023) para 2020 | 2018: MDE cumprido após a defesa (25,60%), rejeição por outros motivos |
| 2025: SIOPE 26,2% | SIOPE 2025, indicador 1.1 (26,23%) | |
| 2025: relatório da prefeitura 24,2% | RREO 6º bim. 2025, Anexo 8 linha 29 e Anexo 14 (24,18%) | arquivo `RELATORIO_RESUMIDO_DE_EXECUCAO_ORCAMENTARIA_355_6_Bimestre_2025 (1).PDF` |
| 2025: gasto 231 (balanço), 249 (planilha do portal), 300 (relatório) | Balanço Anual 2025 (231,19); `despesas.csv` do portal, programas de educação (248,95); RREO 6º bim. 2025, linha 33 (300,23) | conta própria na planilha: soma das ações de educação, sem Criança Feliz e Educação Ambiental |
| sem parecer do TCM de 2025 nos documentos | lista de pareceres baixados (2018, 2019, 2022, 2023) | dizer "nos documentos", não "o TCM não analisou" |
| 2006 e 2007: 33 milhões de Fundef e Fundeb | Tesouro Nacional, transferências constitucionais (14,09 em 2006 e 19,14 em 2007), confirmado no `Transferencias_Constitucionais.XLS` | conta própria: 33,23 |
| gasto de 2006 e 2007 não achado em dado aberto | SIOPE aberto começa em 2008 | |

## Conferir antes de publicar
- Se sair o parecer do TCM sobre 2024 ou 2025, atualizar a frase de 2025.
- O 2,09 bi é empenhado. Pago foi R$ 1,98 bi (citar só se a pessoa pedir).
