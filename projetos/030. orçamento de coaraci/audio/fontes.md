# FONTES E CHECAGEM — Roteiro Coaraci (não ler no vídeo)

**Fontes:** SICONFI/Tesouro Nacional (DCA = balanço anual; RREO = relatório bimestral; RGF = relatório de gestão fiscal), SIOPE/FNDE, PDFs do portal da prefeitura (pasta `documentos_prefeitura/`) e IBGE. Coaraci tem código IBGE 2908002 e 17.557 habitantes (estimativa de 2025).
Despesas = valor **liquidado** (serviço ou bem efetivamente entregue).

| # | Afirmação | Valor exato | Fonte | Conferido em PDF da prefeitura? |
|---|---|---|---|---|
| 1 | Receita 2024 | R$ 91.356.380,66 | DCA/RREO 2024 | ✅ RREO 6º bim/2024 (PDF 3701DC9F…) mostra o mesmo valor |
| 2 | Orçamento 2024 | R$ 86.501.000 | LOA 2024 (Lei 1.273) | ✅ Lei 1.273, art. 1º |
| 3 | FPM 2024 | R$ 38,65 mi | DCA 2024 I-C | — |
| 4 | Educação 2024 (FUNDEB + complementação) | 15,26 + 9,06 = R$ 24,32 mi | DCA 2024 I-C | ✅ RREO PDF: "Transferências do FUNDEB 24.314.903,26" |
| 5 | SUS 2024 / ICMS 2024 | R$ 13,05 mi / R$ 6,02 mi | DCA 2024 I-C | — |
| 6 | Própria 2024 / IPTU 2024 | R$ 4,85 mi / R$ 360 mil | DCA 2024 I-C (impostos + taxas) | — |
| 7 | Despesa 2024 (≈ R$ 947 mil acima da receita) | R$ 92.303.525,98 | DCA/RREO 2024 | ✅ RREO 6º bim/2024 PDF |
| 8 | Despesas por área 2024 | Educ 31,10; Saúde 28,82; Adm 8,92; Urb 7,94; Leg 2,66; Cult 1,71; AS 1,68 | DCA 2024 I-E | — |
| 9 | Combustível 2024 | R$ 5.619.262 pagos a COARACI COMERCIO DE COMBUSTIVEIS LTDA (CNPJ 44.713.557/0001-45) | 12 PDFs da Ordem Cronológica de Pagamentos 2024 → `saida/pagamentos_2024_prefeitura.csv` | ✅ (fonte é o próprio PDF) |
| 10 | Investimentos 2024 | R$ 4,51 mi | DCA 2024 I-D (grupo 4.4) | — |
| 11 | Pessoal, 1º quadrimestre/2024 | 54,90% | RGF 1º quad/2024 | ✅ PDF BF635281… |
| 12 | Pessoal, 3º quadrimestre/2024 | 49,78% | RGF 3º quad/2024 | ✅ PDF 47DABADF… |
| 13 | Receita 2025 líquida | 107.172.108,55 − 9.148.544,77 = R$ 98.023.563,78 | RREO/DCA 2025 + SIOPE 2025 (Deduções FUNDEB) | ⚠️ o RREO/DCA 2025 veio sem a dedução; a dedução vem do SIOPE |
| 14 | Orçamento 2025 / 2026 | R$ 104.309.000 / R$ 111.686.000 | RREO | ✅ portal Fator, "Demonstrativo da Receita" (Total Previsto) |
| 15 | FPM 2025 (43,8% da receita líquida) | R$ 42,92 mi | DCA 2025 I-C | — |
| 16 | Educação 2025 (FUNDEB + complementação) | 15,53 + 11,28 = R$ 26,81 mi | DCA 2025 I-C | — |
| 17 | SUS 2025 / ICMS 2025 | R$ 15,72 mi / R$ 6,53 mi | DCA 2025 I-C | — |
| 18 | IPTU 2025 (R$ 29/hab.) / ISS 2024→2025 | R$ 502.440 / 1.259.757 → 733.042 | DCA I-C | — |
| 19 | "Mais de 9 em cada 10 reais vêm de fora" | receita própria total 2025 (impostos, taxas, COSIP, rendimentos etc.) ≈ R$ 6,8 mi = 6,9% da receita líquida | DCA 2025 I-C | — |
| 20 | Despesa 2025 / sobra | R$ 91.647.945 / ≈ R$ 6,38 mi | DCA 2025 | — |
| 21 | Despesas por área 2025 | Educ 32,07; Saúde 26,73; Adm 13,03 (+46%); Urb 3,23 (−59%); Leg 3,28; AS 2,18; Cult 1,09 | DCA 2025 I-E | — |
| 22 | Pessoal 2025 / temporários | R$ 56,80 mi (62%) / 1,59 → 5,98 mi | DCA I-D (3.1 e 3.1.90.04) | — |
| 23 | Investimentos 2025 | R$ 2,83 mi | DCA 2025 I-D | — |
| 24 | Sentenças judiciais | 2024: R$ 3,84 mi (lançadas em pessoal) / 2025: R$ 4,00 mi (lançadas em custeio) | DCA I-D | ✅ PDFs de 2024 (elemento 31909100000 = R$ 3,84 mi) |
| 25 | Amortização da dívida | 2024: R$ 3,75 mi / 2025: R$ 4,11 mi | DCA I-D | — |
| 26 | Jan–ago: receita 2025 → 2026 | 66,43 → 66,64 mi | RREO 4º bim 2025 e 2026 | — (o portal antigo não tem 2025/26; o Fator bloqueia acesso automático) |
| 27 | Jan–ago: despesa / pessoal / custeio | 55,38 → 66,87 / 34,95 → 40,41 / 17,01 → 23,58 | RREO 4º bim | — |
| 28 | Jan–ago por área | Saúde 16,33 → 21,76; Educ 18,36 → 22,87; Cult 0,84 → 1,88; investimentos 0,80 → 1,27 | RREO 4º bim (Anexo 2) | — |
| 29 | Pessoal, 1º e 2º quadrimestres/2026 | 52,17% → 57,11% (DTP R$ 55,33 mi / RCL ajustada R$ 96,88 mi) | RGF 2026 (Poder Executivo) | PDF não obtido (o SICONFI pede captcha). Valor lido dos dados abertos do Tesouro, a partir do mesmo relatório entregue pela prefeitura. Em 2023 e 2024, PDF e dados abertos bateram exatamente. **Citar no vídeo:** "Relatório de Gestão Fiscal, 2º quadrimestre de 2026, entregue ao Tesouro Nacional (SICONFI)" |
| 30 | Regras da LRF | art. 23 (corrigir nos 2 quadrimestres seguintes, set–dez/2026 e jan–abr/2027, com 1/3 no primeiro; §3º: sem transferências voluntárias, garantias nem operações de crédito); art. 22, parágrafo único, incisos I a V (proibições; inciso IV: só repor aposentadoria ou falecimento em educação, saúde e segurança) | Lei Complementar 101/2000 | — |

**Série completa de pessoal ÷ receita corrente líquida (Poder Executivo, limite de 54%):**
2023: 58,14% · 58,16% · 53,53% | 2024: 54,90% · 53,62% · 49,78% | 2025: 48,96% · 50,09% · 50,64% | 2026: 52,17% · 57,11%

**Cuidados de veracidade:**
- "Mandato anterior" e "novo mandato" se referem aos mandatos 2021–2024 e 2025–2028. O roteiro **não** diz se o prefeito mudou nem cita nomes.
- O roteiro não acusa irregularidade. O combustível e os temporários aparecem como fatos, comparados com outros gastos.
- 2023 também teve a folha acima de 54% (58%). Se quiser mostrar que o problema é antigo, a série acima tem os números.

## Áreas adicionadas na versão de 3 minutos
| Afirmação | Valor | Fonte |
|---|---|---|
| Transporte (função 26) | 2024: R$ 340 mil; 2025: R$ 220 mil; 2026 jan–ago: R$ 110 mil | DCA I-E 2024/2025; RREO 4º bim 2026 |
| Cultura 2026 jan–ago maior que 2025 inteiro | R$ 1,88 mi × R$ 1,09 mi | RREO 4º bim 2026; DCA 2025 |
| Câmara (função Legislativa) | 2,66 / 3,28 / 2,12 (jan–ago 2026) | DCA I-E; RREO |
| "Segurança sem verba própria" | Não há nenhum gasto na função 06 (Segurança Pública) em 2024, 2025 nem 2026 | DCA I-E 2024/2025; RREO Anexo 2 2026 |
| Guarda Municipal 2024 | ≈ R$ 1,66 mi (soma de 48 pagamentos com "GUARDA" no credor ou no histórico; folha + 1/3 de férias) | Ordem Cronológica de Pagamentos 2024 (PDFs) — 2025/2026 sem detalhe |
| Transporte escolar 2024 (não citado no vídeo) | ≈ R$ 1,64 mi, pago pela Educação | Ordem Cronológica 2024 |

## Checagem do roteiro 030 (05/11/2026)
Dados: SICONFI (apidatalake.tesouro.gov.br/ords/siconfi/tt), Coaraci id 2908002, consulta em 05/11/2026. JSONs em `referencias/` e em ~/Documents/RECEITAS-DESPESAS-COARACI/dados_brutos.
- "Gastou 91,6 mi em 2025": DCA 2025 I-D, despesa liquidada 91.647.945.
- "Arrecadou 98 mi": DCA 2025 bruta 107.172.108,55 − dedução FUNDEB 9.148.544,77 (SIOPE/FNDE 2025) = 98.023.563,78. Conta própria.
- "5 de cada 100 reais dos impostos": impostos+taxas 5,05 mi ÷ 98,02 mi = 5,2%. Conta própria.
- "FPM 42,9 mi, mais de 8 vezes os impostos": 42,92 ÷ 5,05 = 8,5. Conta própria.
- Educação 32,07 / Saúde 26,73 (2024: 28,82) / Administração 8,92 → 13,03 / Urbanismo 7,94 → 3,23 / Cultura 1,09 / Transporte 0,22 / Câmara 3,28: DCA I-E.
- "Câmara mais de 6 vezes o IPTU": 3,28 ÷ 0,502 = 6,5. Conta própria.
- Segurança sem verba própria: nenhuma despesa na função 06 em 2024, 2025 e 2026 (DCA I-E e RREO Anexo 2).
- Pessoal 56,80 (62% de 91,65); temporários 1,59 → 5,98; investimentos 2,83; amortização da dívida 4,11: DCA I-D 2024/2025.
- Combustível 2024: 5.619.262 a COARACI COMERCIO DE COMBUSTIVEIS LTDA (Ordem cronológica de pagamentos 2024, PDFs do portal); investimentos 2024 = 4,51 mi (DCA I-D).
- 2026 jan–ago: receita 66,43 → 66,64; despesa liquidada 55,38 → 66,87 (+20,7%): RREO 4º bim 2025 e 2026.
- Pessoal/RCL: 49,78% (RGF 3º quad 2024, conferido no PDF), 50,64% (RGF 3º quad 2025), 57,11% (RGF 2º quad 2026, só pela API). Limites LRF art. 20 e 22; prazo e proibições: LRF arts. 22 e 23.
- Sentenças judiciais 2025: DCA 2025 I-D 3.3.90.91 = 4,00 mi (> investimentos 2,83). Dívida 4,11.
