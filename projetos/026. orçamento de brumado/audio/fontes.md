# Fontes do roteiro 026. orçamento de brumado (checadas em 05/11/2026)

**Só dados da Prefeitura Municipal de Brumado - BA (IBGE 2904605).** Conferência automática: todos os JSON do Siconfi em `referencias/` têm "instituicao" = Prefeitura Municipal de Brumado - BA, e o roteiro não cita nenhuma outra cidade.

**Documentos (para conferir):**
- O portal da Sudoeste Informática que a pessoa mandou é um aplicativo em JavaScript e não abre os relatórios pela linha de comando. Os mesmos relatórios estão publicados no Diário Oficial do Município (portal oficial de publicações, assinado digitalmente).
- **RREO 6º bim. 2025 e RGF 3º quadr. 2025:** Diário Oficial de Brumado, edição nº 333, 29/01/2026 (116 páginas): https://portalgov.srv.br/diariooficial/uploads/edt_1769718343.pdf (página da edição: https://portalgov.srv.br/diariooficial/detalhes.php?cod=MTMzOTA%3D). Arquivo: `referencias/pdfs do portal/RREO 6bim 2025 e RGF 3q 2025 (DOM 29-01-2026).pdf`.
- **RREO 6º bim. 2024:** Diário Oficial de Brumado, edição nº 17, 30/01/2025: https://portalgov.srv.br/diariooficial/uploads/edt_1738272008.pdf. Arquivo: `referencias/pdfs do portal/RREO 6bim 2024 (DOM 30-01-2025).pdf`.
- **Conferência:** Siconfi (Tesouro Nacional), em `referencias/*.json`.

"p." é a página do arquivo PDF da edição do Diário Oficial.

| Fato no roteiro | Fonte (arquivo, anexo, página, valor exato) | Observação |
|---|---|---|
| "gastou 398 milhões em 2025" | DOM 29/01/2026, Anexo 1 (Balanço Orçamentário), p. 7: despesas liquidadas R$ 398.157.547,65 | Siconfi: R$ 398.177.214,34 |
| "arrecadou 433 milhões" | Anexo 1, p. 6: receitas realizadas até o bimestre R$ 432.584.562,73 | Siconfi: R$ 431.715.834,95 |
| "pouco mais de 1 de cada 10 reais dos impostos da cidade" | Anexo 1, p. 6: Impostos R$ 49.128.506,36 | conta própria: 49,13 ÷ 432,58 = 11,4% (Siconfi: 51,96 ÷ 431,72 = 12,0%); vale nas duas |
| "a União mandou 192 milhões, quase 4 vezes os impostos" | Anexo 1, p. 6: Transferências da União R$ 191.951.204,21 | 191,95 ÷ 49,13 = 3,9 (Siconfi 3,7) |
| "o estado e o Fundeb" | Anexo 1, p. 6: Transferências dos Estados R$ 74.416.722,26; Outras Instituições Públicas (Fundeb) R$ 66.462.555,45 | sem número no roteiro |
| "educação 162 milhões; 4 de cada 10 reais; em 2024, 133" | Anexo 2, p. 8: Educação R$ 161.608.904,89 · RREO 2024 (DOM 30/01/2025), Anexo 2, p. 7: R$ 132.751.421,93 | 161,61 ÷ 398,16 = 40,6% |
| "saúde 123 milhões; 2 de cada 3 para hospitais" | Anexo 2, p. 8: Saúde R$ 123.383.353,73; Assistência Hospitalar e Ambulatorial R$ 82.194.922,40 | 82,19 ÷ 123,38 = 66,6% |
| "transporte nas estradas 13 milhões, quase o dobro do previsto" | Anexo 2, p. 9: Transporte liquidado R$ 13.345.094,92; dotação inicial R$ 7.450.539,25 (Transporte Rodoviário R$ 13.311.094,92) | 13,35 ÷ 7,45 = 1,79 |
| "cultura 7 milhões, mais que o triplo do previsto" | Anexo 2, p. 9: Cultura R$ 7.213.849,71; dotação inicial R$ 2.196.713,38 | 7,21 ÷ 2,20 = 3,3 |
| "assistência social: previstos 10,6, gastou 3,3, menos de 1 terço" | Anexo 2, p. 8: dotação inicial R$ 10.628.000,00; liquidado R$ 3.293.259,81 | 3,29 ÷ 10,63 = 31% |
| "meio ambiente, habitação e saneamento: previsto, não gastaram nada" | Anexo 2, p. 9: Gestão Ambiental dotação inicial R$ 1.539.886,20, liquidado "-"; Habitação R$ 921.700,00, "-"; Saneamento R$ 242.443,96, "-" | |
| "segurança pública 3,4 milhões" | Anexo 2, p. 8: Segurança Pública R$ 3.414.852,70 | |
| "defesa civil: 1,6 milhão previsto, gastou zero" | Anexo 2, p. 8: Defesa Civil dotação inicial R$ 1.586.600,00; liquidado "-" | o gasto da segurança está em "Demais Subfunções" |
| "Câmara 10,9 milhões, mais de 3 vezes a segurança" | Anexo 2, p. 8: Legislativa R$ 10.925.023,30 | 10,93 ÷ 3,41 = 3,2 |
| "quase o mesmo que a administração, 12,8" | Anexo 2, p. 8: Administração R$ 12.831.572,18 | 10,93 ÷ 12,83 = 85% |
| "4 de cada 10 reais para salários e encargos: 155 milhões" | Anexo 1, p. 7: Pessoal e Encargos Sociais liquidado R$ 155.483.423,23 | 155,48 ÷ 398,16 = 39,1% |
| "obras e equipamentos 18 milhões; previstos 35" | Anexo 1, p. 7: Investimentos liquidado R$ 18.198.048,71; dotação inicial R$ 34.970.034,78 | |
| "a dívida levou quase o mesmo: 18 milhões, entre juros e parcelas" | Anexo 1, p. 7: Juros e Encargos R$ 8.893.485,94 + Amortização R$ 8.884.861,55 = R$ 17.778.347,49 | 17,78 × 18,20 (98%) |
| "Brumado está em 45,4%; alerta 48,6%; teto 54%" | RGF 3º quadr. 2025 (mesma edição), Anexo 1, p. 30: DTP R$ 183.357.759,34 ÷ RCL ajustada R$ 404.041.901,38 = 45,38%; limites 54,00 / 51,30 / 48,60 | Siconfi: 45,07% (RCL ajustada R$ 406,87 mi); "abaixo do alerta" vale nas duas |
| "saúde 33,4% (mín. 15%), mais que o dobro" | Anexo 14 (Simplificado), p. 29: ASPS com recursos de impostos R$ 66.127.776,61 = 33,43% | Siconfi: 32,97% |
| "educação 28,5% (mín. 25%)" | Anexo 14, p. 29: MDE R$ 61.236.985,58 = 28,48% | Siconfi: 28,11% |
| "receitas passaram as despesas em 34 milhões" | Anexo 1, p. 7: Superávit R$ 34.427.015,08 | Siconfi: 431,72 − 398,18 = 33,5 |
| "Quem analisa essas contas é o TCM" | Tribunal de Contas dos Municípios do Estado da Bahia (TCM-BA) | |

## Diferenças entre o PDF e o Siconfi
O Siconfi traz outra versão do mesmo relatório (diferenças pequenas): receitas 431,72 × 432,58 (PDF); impostos 51,96 × 49,13; despesas 398,18 × 398,16; administração 12,84 × 12,83; Câmara 10,92 × 10,93; pessoal 45,07% × 45,38%; saúde 32,97% × 33,43%; educação 28,11% × 28,48%; operação de crédito 7,0 × 10,7. O roteiro usa o PDF e números arredondados que valem nas duas versões.

## Conferir antes de publicar
- Se a prefeitura republicou o RREO do 6º bimestre de 2025 (o Siconfi traz valores um pouco diferentes).
- Por que meio ambiente, habitação, saneamento e defesa civil ficaram em zero: o relatório não diz; o roteiro só mostra o número.

## Versão 2 do roteiro (05/11/2026)
- "publica no Diário Oficial" e "conferir no Diário Oficial da cidade": os PDFs usados são do Diário Oficial de Brumado (o portal da Sudoeste não abriu os relatórios fora do navegador).
- "A Câmara (10,9) não fica longe da administração (12,8)": 10,9 ÷ 12,8 = 85%; troquei "quase o mesmo" por "não fica longe".

## Ajuste de 05/11/2026
| Frase | Fonte | Conta |
|---|---|---|
| "quase 8 de cada 10 reais da educação no ensino fundamental" | RREO 2025 (DOM 29/01/2026), Anexo 2, p. 8: Ensino Fundamental R$ 125.422.072,67 | 125,42 ÷ 161,61 = 77,6% |
