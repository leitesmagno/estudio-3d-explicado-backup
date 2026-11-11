# Fontes do roteiro 027. orçamento de feira de santana (checadas em 05/11/2026)

Todos os números são da **Prefeitura Municipal de Feira de Santana** (IBGE 2910800). Nenhum dado de outra cidade.

**Documentos (portal da transparência, página "Prestação de contas", exercício 2025; PDFs em `referencias/pdfs do portal/`):**
- RREO 6º bim. 2025, Anexo 1 (Balanço Orçamentário): https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2025/Anexo%20I%206bim2025.pdf
- RREO 6º bim. 2025, Anexo 2 (Despesas por Função): https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2025/Anexo%20II%206bim2025.pdf
- RREO 6º bim. 2025, Anexo 3 (RCL): https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2025/Anexo%20III%206bim2025.pdf
- RREO 6º bim. 2025, Anexo 14 (Simplificado; no portal com o nome "Anexo XIV"): https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2025/Anexo%20XIV%206bim2025.pdf
- RREO 6º bim. 2024, Anexo 2: https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2024/Anexo%20II%206bim2024.pdf
- RGF 3º quadr. 2025, Anexo 1 (Despesa com Pessoal, Executivo): https://transparencia.feiradesantana.ba.gov.br/contaspublicas/2025/AnexoI%203qua25.pdf
- Lista dos documentos: https://transparencia.feiradesantana.ba.gov.br/index.php?view=prestacaodecontas (POST em controller/contaspublicas.php, ano 2025)

Conferência com o Siconfi (Tesouro Nacional) em `referencias/*.json`; todos com "instituicao" = Prefeitura Municipal de Feira de Santana - BA. O PDF e o Siconfi trazem versões um pouco diferentes; o roteiro usa sempre o PDF.

| Fato no roteiro | Fonte (arquivo, anexo, página, valor exato) | Observação |
|---|---|---|
| "gastou 2 bilhões e 320 milhões em 2025" | RREO 2025, Anexo 1, p. 3: total das despesas liquidadas R$ 2.321.208.759,67 (igual no Anexo 14, p. 1) | Siconfi: R$ 2.320,92 mi |
| "arrecadou 2 bilhões e 430 milhões" | Anexo 1, p. 2: total das receitas R$ 2.428.097.162,38 | Siconfi: R$ 2.430,55 mi |
| "menos de 1 de cada 4 reais dos impostos" | Anexo 1, p. 1: Impostos R$ 561.409.482,90 | 561,4 ÷ 2.428,1 = 23,1% |
| "a União mandou 661 milhões, mais que todos os impostos" | Anexo 1, p. 1: Transferências da União R$ 660.597.253,37 | 660,6 > 561,4 (e > 595,9 com taxas). Siconfi: R$ 692,2 mi |
| "saúde 686 milhões, a maior fatia" | Anexo 2, p. 1: Saúde liquidada R$ 685.513.576,59 | maior função (educação 587) |
| "6 de cada 10 da saúde para hospitais" | Anexo 2, p. 2: Assistência Hospitalar e Ambulatorial R$ 404.641.244,96 | 404,6 ÷ 685,5 = 59% |
| "educação 587; em 2024, 601; caiu 14" | Anexo 2 2025, p. 2: R$ 587.243.479,05 · Anexo 2 2024, p. 2: R$ 600.850.491,30 | 600,85 − 587,24 = 13,6 |
| "urbanismo 295" | Anexo 2 2025, p. 2: R$ 294.510.915,63 | |
| "ônibus 50 milhões; previstos 27; quase o dobro" | Anexo 2 2025, p. 2: Transportes Coletivos Urbanos, dotação inicial R$ 27.008.575,00; liquidado R$ 50.400.000,00 | 50,4 ÷ 27,0 = 1,87 |
| "administração 126, quase o dobro de assistência, cultura, meio ambiente e esporte juntos" | Anexo 2: Administração R$ 125.598.618,82 (p. 1); Assistência R$ 31.671.096,95 (p. 1); Cultura R$ 6.759.108,09 (p. 2); Gestão Ambiental R$ 1.062.105,17 (p. 3); Desporto e Lazer R$ 28.342.029,90 (p. 4) | 31,67 + 6,76 + 1,06 + 28,34 = 67,83; 125,6 ÷ 67,83 = 1,85 |
| "trabalho: 4,3 milhões previstos, gastou 16 mil" | Anexo 2, p. 2: Trabalho, dotação inicial R$ 4.326.450,00; liquidado R$ 15.958,80 | |
| "habitação: 3 milhões previstos, gastou 90 mil" | Anexo 2, p. 3: Habitação, dotação inicial R$ 3.026.772,00; liquidado R$ 89.824,32 | |
| "segurança pública 337 mil" | Anexo 2, p. 1: Segurança Pública (policiamento) R$ 336.864,63 | |
| "Câmara 51 milhões, mais de 150 vezes a segurança" | Anexo 2, p. 1: Legislativa R$ 51.065.499,01 | 51,07 ÷ 0,337 = 151,6 |
| "de cada 10 reais, 3 para salários: 735 milhões" | Anexo 1, p. 3: Pessoal e encargos sociais liquidados R$ 735.050.126,58 | 735,05 ÷ 2.321,2 = 31,7%. Siconfi: R$ 735,83 mi |
| "obras e equipamentos 65; menos de 3 em cada 100; previstos 284" | Anexo 1, p. 3: Investimentos, dotação inicial R$ 284.232.629,00; liquidado R$ 65.039.777,08 | 65,04 ÷ 2.321,2 = 2,8% |
| "a dívida levou 86 milhões, mais que todas as obras" | Anexo 2, p. 4: Encargos Especiais, Serviço da Dívida Interna R$ 86.233.465,68 | 86,2 > 65,0 |
| "51,9%; passou do limite prudencial (51,3%)" | RGF 3º quadr. 2025, Anexo 1, p. 2: DTP R$ 1.075.613.950,68 = 51,94% da RCL ajustada; máximo 54%, prudencial 51,30%, alerta 48,60% | Siconfi: 52,03%. Nas duas versões passa do prudencial |
| "a lei proíbe dar aumento, criar cargo e contratar, com algumas exceções" | LRF (LC 101/2000), art. 22, parágrafo único | |
| "saúde 34,9% (mín. 15); educação 25,8% (mín. 25)" | Anexo 14, p. 3: MDE 25,78%; p. 4: saúde 34,93% | Siconfi: 25,78% e 34,95% |
| "receitas passaram as despesas em 107 milhões" | Anexo 1, p. 3: Superávit R$ 106.888.402,71 (Anexo 14, p. 1) | Siconfi: R$ 109,64 mi |

## Diferenças PDF × Siconfi
- Total gasto: PDF 2.321,21 · Siconfi 2.320,92. Receitas: 2.428,10 × 2.430,55. Superávit: 106,89 × 109,64.
- União: PDF 660,60 · Siconfi 692,21 (diferença maior; o roteiro usa o PDF).
- Saúde: PDF 685,51 (dot. inicial 698,73) · Siconfi 686,20 (698,53). Educação: 587,24 × 584,84. Administração: 125,60 × 126,30.
- Pessoal (RGF): 51,94% × 52,03%.

## Conferir antes de publicar
- Se a prefeitura republicou o RREO do 6º bimestre de 2025 (o Siconfi traz outra versão).
- O RGF do 1º e do 2º quadrimestre de 2026, para saber se o gasto com pessoal voltou para baixo do prudencial.

## Ajuste de 05/11/2026
| Frase | Fonte | Conta |
|---|---|---|
| "ensino fundamental 307; creches e pré-escolas 158; mais da metade" | RREO 2025, Anexo 2, p. 2: Ensino Fundamental R$ 307.088.479,08; Educação Infantil R$ 157.711.637,39 | 307,09 ÷ 587,24 = 52,3% |
| "Salários e encargos levaram 735 milhões" (sem a fração) | ver a linha de pessoal acima | a fração "3 de cada 10" saiu a pedido da pessoa, para não confundir com os 51,9% da lei |
