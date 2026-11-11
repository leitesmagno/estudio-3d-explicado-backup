# Fontes: 064. orçamento de Teixeira de Freitas (BA)

Consulta: 08/11/2026. Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-TEIXEIRA-DE-FREITAS/documentos_tcm/` (abaixo, DOC/).
Todos baixados do e-TCM (Consulta Pública, https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam), município 388 "TEIXEIRA DE FREITAS", Prefeitura (UJ 992) e Câmara (UJ 421). Sem autarquia, instituto de previdência ou empresa com conta própria no e-TCM (o Anexo 9 só lista Câmara, secretarias e fundos; "Reserva do RPPS" zerada no Balanço).
Conferência automática: `scripts/conferir.py` (51 de 51 valores achados no texto dos PDFs, 08/11/2026).

## Documentos
- DOC/2024-13_ANUAL_PCAGO015.pdf: Balanço Orçamentário 2024 (prestação anual, processo 09815e25).
- DOC/2024-13_ANUAL_PCAGO007.pdf: Anexo 9 de 2024 (despesa por órgão e função, com a Câmara). DOC/2024-13_ANUAL_PCAGO004.pdf (Anexo 6) e PCAGO008 (Anexo 10).
- DOC/2025-13_ANUAL_PCAGO015.pdf, PCAGO007, PCAGO004, PCAGO008: os mesmos de 2025.
- DOC/2024-12_PCMGE015.pdf e PCMGE016 (Prefeitura, dez/2024, SIGA), DOC/2025-12_PCMGE015.pdf e PCMGE016 (dez/2025).
- DOC/2026-09_PCMGE015.pdf e PCMGE016 (Prefeitura, set/2026, último mês entregue, enviado em 03/11/2026); DOC/2026-09_PCMGE015_CONSOLIDADO.pdf e PCMGE016_CONSOLIDADO (consolidados do município, com Câmara e fundos).
- DOC/2024-12_CAMARA_PCMGE015.pdf, 2025-12_CAMARA_PCMGE015.pdf, 2026-09_CAMARA_PCMGE015.pdf (Câmara; PDFs digitalizados, totais lidos no texto do OCR).
- Conferido: PCMGE015 da Prefeitura (soma das ações) + Câmara = Balanço, centavo a centavo (2024: 621.236.976,04 + 19.876.197,44 = 641.113.173,48; 2025: 664.612.186,55 + 22.708.857,49 = 687.321.044,04). 2026: Prefeitura 514.753.794,02 + Câmara 19.330.116,11 = 534.083.910,13 (= TOTAL do consolidado).

## Totais (fala e tela)
- 2024 arrecadou 666.600.513,40 → DOC/2024-13_ANUAL_PCAGO015, "SUBTOTAL DAS RECEITAS (III)", receitas realizadas → fala "666 milhões e 600", tela, mapa.
- 2024 gastou 641.113.173,48 → mesmo Balanço, "SUBTOTAL DAS DESPESAS (XI)", empenhadas → fala "641 milhões e 100".
- 2024 sobra 25.487.339,92 → mesmo Balanço, "Superávit (XIV)" → fala "Sobrou 25 milhões e 500".
- 2025 arrecadou 706.300.709,19 → DOC/2025-13_ANUAL_PCAGO015, "SUBTOTAL DAS RECEITAS (III)" → fala "706 milhões e 300".
- 2025 gastou 687.321.044,04 → mesmo Balanço, despesas liquidadas (empenhadas iguais; a coluna empenhada sai com caracteres duplicados no texto do PDF) → fala "687 milhões e 300".
- 2025 sobra 18.979.665,15 → mesmo Balanço, "Superávit (XIV)" (texto do PDF: "1188..997799..666655,,1155") → fala "quase 19 milhões".
- 2026 até set. arrecadou 644.695.595,18 → DOC/2026-09_PCMGE016_CONSOLIDADO, RESUMO, "Totais: ... Total até Mês" (arrecadada 651.100.463,22 menos anuladas 6.404.868,04) → fala "644 milhões e 700". Receita é o total declarado, sem descontar Fundeb ("Dedução da Receita: R$ 0,00").
- 2026 empréstimo 99.000.000,00 → mesmo PDF, linha 21000000 "Operações de Crédito", arrecadação até o mês (previsão 50.000.000,00) → fala "99 milhões são empréstimo", gancho, tela.
- 2026 gastou 534.083.910,13 → DOC/2026-09_PCMGE015_CONSOLIDADO, linha "TOTAL", 2ª linha (até o mês), coluna Liquidada → fala "534 milhões e 100".
- 2026 empenhou 690.386.106,46 → mesma linha, coluna Empenhada → fala "690 milhões e 400", "mais do que entrou" (690,4 > 644,7).

## Setores (função; 2024 e 2025 = Anexo 9, empenhado; 2026 = soma das ações do PCMGE015 set/2026, liquidado, + Câmara)
Conta própria: `scripts/setores.py` (soma das funções = total de cada ano, centavo a centavo). Agricultura saiu da fala por tamanho (1,44 / 1,33 / 1,09 mi). Fora da fala: Segurança e Transportes (função 06: salários da secretaria de trânsito e guarda; regra do perfil: não falar de segurança pública), Habitação (16), Desenvolvimento econômico e turismo (22/23).
- Educação (12): 190.535.578,27 / 226.866.799,45 / 170.533.xxx (2026: soma das ações) → "190 milhões e 500" / "226 e 900" / "170 e 500".
- Saúde (10): 183.218.287,22 / 159.517.731,26 / 100.131.xxx → "183 e 200" / "159 e 500" / "100 milhões e 100".
- Administração (04 + 03 Procuradoria): 45.994.879,24 + 6.171.944,66 = 52.166.823,90 / 60.840.788,80 + 8.324.364,94 = 69.165.153,74 / 60.387.xxx → "52 e 200" / "69 e 200" / "60 e 400".
- Obras e serviços urbanos (15 Urbanismo + 17 Saneamento/drenagem da Sec. de Infraestrutura + 25 Energia = iluminação pública): 103.659.553,53 + 2.523.730,12 + 7.197.962,62 = 113.381.246,27 / 105.757.108,08 + 7.251.476,73 + 6.618.511,44 = 119.627.096,25 / 108.222.xxx → "113 e 400" / "119 e 600" / "108 e 200".
- Câmara (01): 19.876.197,44 / 22.708.857,49 / 19.330.116,11 → "19 e 900" / "22 e 700" / "19 e 300".
- Dívidas e encargos (28: amortização da dívida, sentenças, PIS/PASEP e outras obrigações): 49.205.181,56 / 56.365.099,34 / 49.564.xxx → "49 e 200" / "56 e 400" / "49 e 600".
- Cultura e festas (13; em 2026 + ação 2036 "Festejos culturais, cívicos e religiosos", função 23, 1.323.974,08): 2.079.352,75 / 3.345.600,29 / 3.635.xxx → "2 milhões e 100" / "3 e 300" / "3 e 600". Festas: 2024 sem gasto na ação "Realização de festas populares e religiosas"; 2025 336 mil nessa ação (função 13).
- Assistência social (08): 9.925.463,45 / 9.226.410,00 / 6.812.xxx → "9 e 900" / "9 e 200" / "6 e 800".
- Esporte (27): 1.441.437,65 / 1.738.304,49 / 1.497.xxx → "1 milhão e 400" / "1 e 700" / "1 e 500".
- Meio ambiente (18): 2.884.846,69 / 2.244.399,66 / 2.195.xxx → "2 milhões e 900" / "2 e 200" / "2 e 200".
- Valores exatos de 2026 por setor em `saida/setores.json`.

## Empréstimos (achado principal)
- 2024: Operações de crédito 32.500.000,00 → DOC/2024-13_ANUAL_PCAGO015 (receitas realizadas) e Anexo 10 (DOC/2024-13_ANUAL_PCAGO008, l. 1312–1358: 7.500.000,00 "Operação de Crédito Finisa - Construção Hospitalar" + 25.000.000,00 "Outras Operações de Crédito") → fala "Em 2024, entraram 32 milhões e 500".
- 2025: 1.000.000,00 (Anexo 10 2025, l. 568) → não dito.
- Leis da Câmara: Lei Municipal nº 1.360, de 11/04/2025 (Banco do Brasil, até R$ 50.000.000,00, "projetos de Infraestrutura e Mobilidade Urbana") e nº 1.361, de 11/04/2025 (Caixa, até R$ 50.000.000,00, "projetos de Infraestrutura Viária e Mobilidade Urbana"), Programa Eficiência Municipal, com ou sem garantia da União. Fonte: Portal da Transparência da Câmara, https://transparencia.camaratf.ba.gov.br/temas/credito-especial/ (PDFs salvos em DOC/leis_camara/). → fala "Em abril de 2025, a Câmara autorizou mais dois. Até 50 milhões com a Caixa, e até 50 milhões com o Banco do Brasil, para vias e mobilidade."
- 2026: 99.000.000,00 (PCMGE016 consolidado, linha 211201010200 "Operações de Crédito Contratuais - Mercado Interno - Principal"). O documento NÃO diz o banco → fala "As contas não dizem de qual banco veio cada parte". Não ligamos os 99 mi às duas leis por conta própria.
- Fonte de recurso 1754 = "Recursos de Operações de Crédito" (Anexo 10 2024, l. 1358). Gasto com essa fonte: 2024 38.728.465,73 (ação "Infraestrutura urbana"); 2025 11.739.312,21; 2026 até set. 46.706.549,52 liquidado (conta própria, `saida/acoes_*.json`).
- Pavimentação 2026: ação 2.7000.15.451.5.1.1005 "PAVIMENTAÇÃO, CALÇAMENTO E RECUPERAÇÃO DE VIAS PÚBLICAS" → DOC/2026-09_PCMGE015, l. 2816 "Total do Projeto/Atividade": dotação inicial 40.109.000,00, dotação atual 92.086.700,00, liquidada até o mês 58.276.730,04 → fala "começou 2026 com 40 milhões previstos. Subiu para 92. Até setembro, gastou 58 milhões e 300".
- Dessa ação, fonte 1754: 2.295.397,88 (4.4.90.51.91 obras em andamento, l. 2808) + 43.912.165,23 (4.4.90.51.99 outras obras, l. 2814) = 46.207.563,11 → fala "46 milhões e 200 saíram de dinheiro de empréstimo" (conta própria, soma de duas linhas).
- Notícias (08/11/2026): nenhuma notícia sobre o empréstimo de 2026 achada (buscas: "Teixeira de Freitas empréstimo", "operação de crédito Caixa Finisa"). Obras do Estado na cidade: pavimentação BR-101 ao presídio, R$ 3 mi (Jornal Grande Bahia, 07/2025, https://jornalgrandebahia.com.br/2025/07/governador-jeronimo-autoriza-obras-de-pavimentacao-e-recuperacao-viaria-em-teixeira-de-freitas/) → não usada na fala; a fala só fala da ação municipal. Licitações municipais de 2026 de microdrenagem e pavimentação (CE-013 e CE-014/2026, alertalicitacao.com.br) → contexto, não dito.

## Parcelas de dívidas
- 2024: 41.965.465,21 → DOC/2024-13_ANUAL_PCAGO015, "Amortização da Dívida", despesas pagas → fala "quase 42 milhões em parcelas".
- 2025: 48.463.365,12 → DOC/2025-13_ANUAL_PCAGO015, "Amortização da Dívida", pagas → fala "48 milhões e 500". Em 2025 aparece também "Variação cambial da dívida contratual" 614 mil (PCMGE015 dez/2025, ação 905) → não dito.
- 2026 até set.: 42.160.949,22 (4.6.90.71.01) + 1.323.719,74 (4.6.90.71.99) = 43.484.668,96 → DOC/2026-09_PCMGE015, l. 2168–2169, liquidado = pago → fala "43 milhões e 500".
- "Mais de cinco vezes toda a assistência social" (2025): 48.463.365,12 ÷ 9.226.410,00 = 5,25 (conta própria).
- Gancho e fecho "mais de 40 milhões por ano": 41,97 / 48,46 / 43,48 (até set.).
- "Parcelas" = amortização do principal das dívidas contratuais (pode incluir parcelamentos, não só bancos): a fala não diz "aos bancos".

## Tribunal de Contas
TCM-BA › Decisões › Auditoria, município TEIXEIRA DE FREITAS (https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/, consulta 08/11/2026 14:34, 210 processos listados).
- Concorrência Eletrônica nº 012/2026 (limpeza urbana e manejo de resíduos sólidos): cinco denúncias (20784e26, 22316e26, 23609e26, 26267e26, 26416e26), todas "Denúncias", sem data de julgamento no detalhe → fala "recebeu cinco denúncias ... ainda não têm julgamento".
- Decisão no 20784e26 (DOC/decisoes/2026_voto_20784e26AG.odt.pdf, https://www.tcm.ba.gov.br/sistemas/textos/2026/voto/20784e26AG.odt.pdf): a relatora deferiu cautelar em 30/07/2026 suspendendo a concorrência; em 10/08/2026 deu provimento ao agravo do gestor e REVOGOU a cautelar, "diante do término iminente do contrato vigente" (vigência até 29/08/2026), "sem prejuízo da continuidade da instrução processual" → fala "Em julho, a relatora suspendeu. Em agosto, liberou de novo, para a coleta não parar."
- Outros processos de 2024 a 2026 (pregões, contratações temporárias, concurso, contrato de gestão da saúde de R$ 97,4 mi/ano, estrutura de eventos): em análise, não ditos. 08645e24 (pregão 08/2024): "Provimento Parcial" em 30/07/2025 → não dito. Sem nomes no vídeo.

## 2ª conferência (antes do vídeo final, 08/11/2026)
- Texto dos PDFs extraído de novo: 51 de 51 valores achados (scripts/conferir.py); ações de 2026 idênticas (saida/conf2/); setores = total de cada ano, centavo a centavo; leis 1.360 e 1.361 (R$ 50.000.000,00 cada) e a decisão de 10/08/2026 no 20784e26 conferidas no texto.
- Notícias de novo (08/11/2026): nenhuma notícia sobre a concorrência 012/2026 de Teixeira nem sobre o empréstimo de 2026; o caso "pregão 012/2026 de limpeza urbana" que aparece no A Tarde é de Amélia Rodrigues (outro município, não usado).

## Saúde (checado, não usado como achado)
- Queda de 183,2 (2024) para 159,5 mi (2025): a maior parte na ação "Bloco de média e alta complexidade" (77,45 → 52,90). Repasse federal do SUS também caiu: 109.948.422,52 (Anexo 10 2024, l. 657) → 95.344.237,78 (Anexo 10 2025, l. 278). A ortopedia de alta complexidade passou para o Hospital Regional Costa das Baleias (Estado) pela Resolução CIB nº 486/2025 (DOE-BA, jul/2025, transferência de R$ 1,1 mi/ano; DOC/noticias/DOE-BA-2025-07-retorno.pdf). Como a queda tem causas misturadas, a fala só diz os valores, sem comentar.

## Escala da maquete
- 1 moeda = R$ 1 mi, 1 pilha (10 moedas) = R$ 10 mi (cidade grande, orçamento de R$ 0,5 a 0,7 bilhão). Só muda o desenho; o placar diz a escala.

## Folha da Câmara: duodécimo e para onde foi (regras 33 e 33b, 08/11/2026, só tela; a fala não muda)
- 2024: recebeu da prefeitura (duodécimo) R$ 19.936.265,09 e devolveu R$ 128.520,65 → ~/Documents/RECEITAS-DESPESAS-TEIXEIRA-DE-FREITAS/documentos_tcm/2024-13_CAMARA_PCAGE062.pdf (PCAGE062 Demonstrativo do Fluxo Financeiro, prestação anual 2024 da Câmara, e-TCM UJ 421) → linhas "Recebimento do Duodécimo" e "Devolução do Duodécimo" → consulta 08/11/2026 → folha da Câmara 2024.
- 2025: recebeu R$ 22.709.298,24 e devolveu R$ 398.476,23 → documentos_tcm/2025-13_CAMARA_PCAGE062.pdf (mesmo demonstrativo, prestação anual 2025) → consulta 08/11/2026 → folha da Câmara 2025.
- 2026 até setembro: repasse recebido R$ 19.209.326,13 (conta própria: saldo anterior credor até agosto 17.074.956,56 + creditado em setembro 2.134.369,57; o PDF escaneado corta a coluna "creditado até o mês"; 9 repasses iguais de 2.134.369,57) → documentos_tcm/2026-09_CAMARA_PCMGE018.pdf (razão da Câmara, pág. 5, conta 4.5.1.1.2.02.00 "Repasse recebido") → consulta 08/11/2026 → folha da Câmara 2026.
- Para onde foi (elementos): PCMGE015 da Câmara de dez/2024, dez/2025 e set/2026 (PDFs escaneados, lidos na imagem; somas conferidas com "Total do Órgão": 2024 empenhado 19.876.197,44 e liquidado 19.478.161,96; 2025 22.708.857,49; 2026 empenhado 24.465.993,13 e liquidado 19.330.116,11, diferença 5.135.877,02 = "Despesa a Pagar").
