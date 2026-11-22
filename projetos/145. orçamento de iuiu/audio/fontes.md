# Fontes do 145. orçamento de iuiu (BA)

Fonte principal: e-TCM (a baixar quando o coordenador liberar a pesquisa). Abaixo, só o CRUZAMENTO feito antes (12/11/2026), por API pública, sem navegador. Nenhum número daqui vai para a tela ou a fala sem o PDF do TCM.

## Município (IBGE)
| Dado | Valor | Fonte |
|---|---|---|
| Código IBGE | 2917334 (microrregião Guanambi) | https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios (consulta 12/11/2026) |
| População (Censo 2022) | 11.118 | https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[2917334] (arquivo siconfi/ibge_censo2022.json) |

## SICONFI (Tesouro Nacional), RREO declarado pelo município · cruzamento
API: https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo?id_ente=2917334 (arquivos em ~/Documents/RECEITAS-DESPESAS-IUIU/siconfi/, consulta 12/11/2026). DCA 2024 e 2025 também baixadas. O 5º bimestre de 2026 ainda está vazio.
| Ano | Receita realizada (Anexo 01, "RECEITAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)", até o bimestre) | Despesa liquidada (Anexo 01, até o bimestre) | Empenhada |
|---|---|---|---|
| 2024 (6º bimestre) | 62.159.377,24 | 77.241.025,87 (déficit declarado 15.081.648,63; operações de crédito 1.900.000,00) | 77.530.156,74 |
| 2025 (6º bimestre) | 66.103.673,32 | 68.981.724,25 | 69.385.125,78 |
| 2026 (4º bimestre, até agosto) | 49.497.243,81 | 46.514.171,28 | 65.839.765,97 |

Despesa liquidada por função (RREO Anexo 02), para guiar a pesquisa no TCM:
| Função | 2024 | 2025 | 2026 até ago |
|---|---|---|---|
| Educação | 30.436.846,19 | 26.618.364,44 | 17.985.897,73 |
| Saúde | 14.118.974,87 | 14.910.438,40 | 10.212.240,67 |
| Administração | 6.663.275,02 | 11.045.134,05 | 7.545.202,02 |
| Urbanismo | 7.599.048,00 | 355.683,18 | 2.268.157,64 |
| Cultura (difusão cultural) | 3.223.250,74 | 3.802.193,00 | 3.002.202,06 |
| Comércio e serviços | 2.532.807,94 | 2.783.195,75 | - |
| Encargos especiais | 1.928.191,96 | 3.180.221,51 | 1.310.770,76 |
| Legislativa (Câmara) | 2.004.240,70 | 2.503.262,40 | 1.774.861,75 |
| Energia | 2.766.952,03 | 313.062,57 | 94.334,42 |
| Transporte | 1.961.078,48 | 956.355,88 | 499.314,43 |
| Desporto e lazer | 1.684.658,87 | 43.702,99 | 18.693,00 |
| Assistência social | 1.289.530,41 | 1.433.191,94 | 1.015.334,71 |
| Agricultura | 885.174,25 | 992.741,58 | 589.000,99 |
| Previdência social | 125.963,08 | - | 174.149,52 |
| Saneamento | 21.033,33 | 44.176,56 | 24.011,58 |
A conferir no TCM: o que há na "difusão cultural" (festas? regras 98 e 99, pelo nome da ação e pelos elementos de bandas e palco) e em "comércio e serviços" (turismo, eventos?); o gasto de 2024 acima da receita (o que pagou a diferença: saldo de anos anteriores, empréstimo de 1,9 mi?); a queda de urbanismo, energia e esporte de 2024 para 2025 (ano eleitoral); benefícios eventuais por ação; repasse e devolução da Câmara.

## Notícias públicas (só conferência interna, nunca fonte de fato no vídeo)
- Jornal Grande Bahia: o TCM rejeitou as contas de 2009 da Prefeitura de Iuiu (notícia de 2010, antiga, fora do período do vídeo). https://jornalgrandebahia.com.br/?p=30314
- Procede Bahia: edital de chamamento público 001/2025 da Secretaria de Desenvolvimento Social (Família Acolhedora). https://www.procedebahia.com.br/publica/documentos/PRGB4NTW5GUTI-20250521-095843--!--EDITAL_DE_CHAMAMENTO_PUBLICO_0012025SEDES_FAMILIA_ACOLHEDORA.pdf
- Buscas por festas, São João, empréstimo, obras, denúncia e multa recentes de Iuiu não trouxeram nada do município (consulta 12/11/2026).
