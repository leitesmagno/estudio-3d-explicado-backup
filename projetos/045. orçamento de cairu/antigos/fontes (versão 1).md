# Fontes: 045. orçamento de Cairu (o município de Morro de São Paulo)

Pasta dos documentos: `~/Documents/RECEITAS-DESPESAS-CAIRU/documentos_tcm/` (abreviada como `D/`).
Todos baixados da Consulta Pública do e-TCM (https://e.tcm.ba.gov.br/epp/ConsultaPublica/listView.seam) em 07/11/2026.
Códigos e-TCM: município 66 (CAIRU), Prefeitura 671, Câmara 100 ("Camara Municipal de CAIRÚ").
Conferido em cada PDF: cabeçalho "MUNICÍPIO DE CAIRU" / "Unidade: Prefeitura Municipal de CAIRU" ou "Câmara Municipal de CAIRU" e a competência certa.
Morro de São Paulo não é município: é vila do município de Cairu. Quem presta contas ao TCM é a Prefeitura de Cairu.

## 1ª conferência (depois do roteiro, 07/11/2026)

### Receita ("arrecadou"): total que a prefeitura declarou
| ano | valor exato | fala | arquivo e linha |
|---|---|---|---|
| 2024 | R$ 167.885.692,30 | 167 milhões e 900 | D/2024-13_ANUAL_PCAGO015.txt l.42 "SUBTOTAL DAS RECEITAS", coluna Realizadas (bate com PCMGE016 12/2024 l.695: 167.938.852,13 − anuladas 53.159,83) |
| 2025 | R$ 186.938.318,63 | 186 milhões e 900 | D/2025-13_ANUAL_PCAGO015.txt l.42 (já líquido da dedução do Fundeb, como mostra o Anexo 10 l.345) |
| 2026 até set | R$ 145.242.589,53 | 145 milhões e 200 | D/2026-09_PCMGE016.txt l.392 "Totais", coluna Total Até Mês |

### Despesa ("gastou"): 2024 e 2025 empenhada (Anexo 9, com a Câmara); 2026 liquidada até set (Prefeitura + Câmara)
| ano | valor exato | fala | arquivo e linha |
|---|---|---|---|
| 2024 | R$ 164.306.183,60 | 164 e 300 | D/2024-13_ANUAL_PCAGO007.txt l.114 "Total Geral" (= PCAGO015 l.112) |
| 2025 | R$ 183.031.464,22 | 183 (gancho e bloco) | D/2025-13_ANUAL_PCAGO007.txt l.118 (= PCAGO015 l.112) |
| 2026 até set | 158.754.562,44 + 5.032.377,41 = R$ 163.786.939,85 | 163 e 800 | D/2026-09_PCMGE015.txt l.9143 "Total do Poder", coluna Liquidações Até Mês; D/2026-09_CAMARA_PCMGE015.txt l.295 |
| sobra 2024 | R$ 3.579.508,70 | 3 milhões e 600 | PCAGO015 2024 l.123 "SUPERÁVIT" |
| sobra 2025 | R$ 3.906.854,41 | 3 milhões e 900 | PCAGO015 2025 l.123 |
| a mais 2026 | 163.786.939,85 − 145.242.589,53 = R$ 18.544.350,32 | 18 milhões e meio | conta própria (liquidado − arrecadado até setembro) |

### Setores (R$ milhões). 2024/2025: soma da função no Anexo 9 (PCAGO007); 2026: liquidado até set, soma das ações da função no PCMGE015 (script `scripts/acoes015c.py` + `porfuncao_c.py`, saída `saida/acoes_2026-09.json`). Conferido: as somas do PCMGE015 de dez/2024 e dez/2025 batem com o Anexo 9 (158,573 + Câmara 5,733 = 164,306; 176,640 + 6,391 = 183,031).
| setor (função) | 2024 | 2025 | 2026 até set | linhas no Anexo 9 (2024 / 2025) |
|---|---|---|---|---|
| Educação (12) | 59,170 | 77,710 (77.368.690,90 + 341.500,00 da Sec. de Governo) | 69,867 | l.41 / l.25 + l.38 |
| Saúde (10) | 31,406 | 35,300 | 31,481 | l.45 / l.42 |
| Administração (04) | 28,417 | 27,369 | 22,757 | soma das linhas "04 - Administração" |
| Limpeza e saneamento (17) | 13,733 | 12,578 | 10,895 | l.105 / l.115 |
| Obras e serviços urbanos (15) | 8,927 | 3,018 (2.723.787,75 + 293.782,46) | 5,363 | l.62 / l.60 + l.114 |
| Turismo e eventos (23, Sec. de Turismo) | 6,068 | 6,065 | 4,703 | l.55 / l.53 |
| Câmara (01) | 5,733 | 6,391 | 5,032 (PCMGE015 da Câmara) | l.9 / l.9 |
| Dívidas (28) | 4,612 | 7,751 | 5,499 | l.22+35+42 / l.32+39+50 |
| Cultura (13) | 0,760 | 0,622 | 1,280 | l.48 / l.45 |
| Assistência social (08) | 3,060 | 3,756 | 2,744 | l.52 / l.48 |
| Agricultura e pesca (20) | 0,371 | 0,413 | 0,298 | l.109 / l.106 |
| Esporte (27) | 0 | 0 | 1,225 (estádio 1,127) | sem linha / l.49 (0,00) |
| Meio ambiente (18) | 0,0145 | 0,0362 | 0,930 | l.59 / l.57 |
Fora da fala (não citados): Segurança pública/guarda (regra do perfil), Transporte (26: 1,493 / 1,332 / 0), Habitação, Direitos da Cidadania (Juventude), Essencial à Justiça (2026: 0,502).

### Checagem dos zeros e das trocas de conta
- **Esporte zero em 2024 e 2025**: função 27 sem gasto (2025 l.49 = 0,00). Ações "Construção de estádio de futebol" (dot. 184.798 em 2024 e 115.150 em 2025) e "Construção de praças esportivas" (200.000) com empenho zero (D/2024-12_PCMGE015 l.5873; D/2025-12_PCMGE015 l.7350). MAS a Educação construiu quadras escolares: R$ 2.153.307 (2024, l.2952) e R$ 1.098.631 (2025, l.3753). Por isso a fala diz que as quadras de escola saíram pela educação. 2026: estádio R$ 1.127.289 liquidado (l.7393), "quase tudo no estádio".
- **Defesa civil**: 2024 ação "Serviço de proteção em calamidade pública" com dotação 0 (D/2024-12 l.5040); 2025 R$ 619.088,88 (Anexo 9 2025 l.113, aparece como função 06 Segurança Pública, subfunção 182 Defesa Civil, D/2025-12 l.9837); 2026 dotação 0 e liquidado 0 (D/2026-09 l.1018 e l.6849). Fala: "Defesa civil teve 620 mil só em 2025."
- **Proteção animal**: busca por "animal" e "zoonose" em todos os PDFs (receita e despesa, 2024 a 2026): nenhuma linha. Fala: "nem aparece".
- **Meio ambiente 2026 (930 mil)**: não é aumento de ação ambiental; a Sec. de Desenvolvimento Sustentável passou a lançar pessoal (597.659) e manutenção (314.258) na função 18, que em 2024 e 2025 iam para Administração (04). Fala: "agora com o custeio da secretaria".
- **Limpeza e saneamento (17)**: quase tudo é "Serviços de limpeza urbana" (2024 R$ 13.325.683, l.7287; 2025 R$ 12.426.995, l.10065) e "Manutenção dos serviços de limpeza pública e manejo de resíduos sólidos" (2026 R$ 10.512.930 liquidado, l.1347). Água: só R$ 256.336 em 2024 (requalificação do abastecimento).
- **Turismo e eventos (23)**: Sec. Municipal do Turismo inteira. "Realizações de eventos": 2024 R$ 3.285.278 (l.6314; Anexo 7 2024 programa "Experimente Cairu, um arquipélago de emoções"), 2025 R$ 3.199.886 (l.7790), 2026 R$ 2.494.179 liquidado (l.7813). Cultura 2026: "Realizações e apoio de eventos culturais e comemorativos" R$ 732.518 (l.6063).

### Achados
- **Eventos x assistência social**: 2024: eventos 3,285 > assistência 3,060. 2025: 3,200 < 3,756 (por isso a fala diz só 2024 e 2026). 2026 até set: eventos 2,494 + 0,733 = 3,227 > assistência 2,744. Conta própria.
- **Limpeza x assistência 2024**: limpeza urbana 13,326 / assistência 3,060 = 4,35 vezes ("mais de quatro vezes"). Conta própria.
- **TUPA (Tarifa por Uso do Patrimônio do Arquipélago)**: busca por "TUPA", "tarifa" e "arquipélago" em todos os PDFs de receita: não existe linha com esse nome (só o programa de eventos "Experimente Cairu, um arquipélago de emoções" e tarifa bancária da Câmara). A receita mais parecida é "1.6.9.9.99 Outros Serviços" (fonte 1753): 2024 R$ 11.366.051,89 (Anexo 10 2024 l.55); 2025 R$ 12.142.471,90 (Anexo 10 2025 l.54); jan–abr/2026 R$ 7.147.263,51 (D/2026-04_PCMGE016.txt l.106, "7 milhões e 100"); até set/2026 14.040.590,28 − 1.881.704,11 anulados = 12.158.886,17 (D/2026-09_PCMGE016 l.100). O vídeo NÃO afirma que essa linha é a TUPA: diz que é "a mais parecida".
- **TUPA segundo a prefeitura**: jan–abr/2026 R$ 7.690.900 arrecadados (A Tarde, 05/05/2026, "Morro de São Paulo vazio? Taxa mais cara reacende debate...", https://atarde.com.br/bahia/morro-de-sao-paulo-vazio-taxa-mais-cara-reacende-debate-apos-videos-polemicos-1387976). Valor atual R$ 70 e reajuste para R$ 90 suspenso (Bahia Notícias, 09/07/2026, https://www.bahianoticias.com.br/municipios/noticia/51537-cairu-suspende-por-tempo-indeterminado-o-reajuste-da-tupa-valor-segue-congelado-em-r70). Em maio/2026 a TUPA pagou R$ 878.665,91 em serviços, R$ 768.745,87 deles no manejo de resíduos sólidos (mesma notícia): "em maio, a maior parte pagou o lixo" (87%). R$ 50 → R$ 70 aprovado pela Câmara em 10/12/2025 (Bahia Notícias, https://www.bahianoticias.com.br/municipios/noticia/48539-cairu-aumenta-taxa-de-acesso-ao-morro-de-sao-paulo-e-passa-a-aplicar-cobranca-em-boipeba-veja-valores).

### Tribunal (TCM-BA › Decisões › Auditoria, Prefeitura de Cairu, consulta em 07/11/2026; https://www.tcm.ba.gov.br/consulta/legislacao/decisoes/auditoria/)
- **33936e25** (Denúncia): "suposta irregularidade no aumento da TUPA (Tarifa de Uso do Patrimônio do Arquipélago) e falta de transparência sobre a destinação dos recursos da taxa, no exercício financeiro de 2025". Sem data de julgamento nem deliberação na página: "ainda espera julgamento".
- **26269e24** (Termo de Ocorrência, cautelar): contrato por inexigibilidade nº 029/2024 com escritório de advocacia para recuperar royalties; honorários de 15% ad exitum, total estimado R$ 8.760.000,00; cautelar de 14/02/2025 determinou "a sustação imediata dos efeitos financeiros" do contrato; agravo do escritório não conhecido (intempestivo), voto assinado em 02/09/2026. Arquivo: D/decisoes/2024_voto_26269e24AG.txt l.30–32 e l.221–233. https://www.tcm.ba.gov.br/sistemas/textos/2024/voto/26269e24AG.odt.pdf. Fala: "mandou suspender os pagamentos... honorários que podiam chegar a 8 milhões e 760 mil". Também A Tarde, 12/03/2025: https://atarde.com.br/municipios/prefeitura-e-obrigada-a-suspender-pagamentos-para-escritorio-juridico-1310379
- Fora da fala: 07043e25 (concorrência de limpeza de praias e coleta, estimada em R$ 9.993.822,47): não conhecida em 23/04/2025 (a Justiça já tinha reincluído a empresa); 32150e25 (concurso 2025): improcedente em 06/10/2026; 22590e23 e 23002e23 (representações do MP de 2023): não conhecidas em 2026; 25817e24 (medicamentos 2024), 26273e24 (escritório Fundef/Fundeb) e 29999e25 (dispensa emergencial): sem julgamento.
- **Ministério Público (fora do tribunal)**: inquérito da 6ª Promotoria de Valença, desde 03/08/2026, sobre a tramitação do projeto de lei que autorizou empréstimo de R$ 21 milhões; etapa preliminar, sem culpa. A Tarde, 06/08/2026: https://atarde.com.br/politica/emprestimo-de-r-21-milhoes-em-cairu-entra-na-mira-do-mp-ba-1397730. No PCMGE016 09/2026 a receita de capital está zerada (l.333): o empréstimo não entrou no caixa até setembro (não dito no vídeo).

### Notícias de obras (1ª checagem, 07/11/2026), para não atribuir à prefeitura o que é do Estado
- Pavimentação dos acessos de Morro de São Paulo (R$ 18,5 mi, 5,2 km): licitação do Governo do Estado, maio/2026 (Jornal Grande Bahia, 29/05/2026). Não entra no vídeo.
- UBS com Sala de Estabilização em Morro de São Paulo (R$ 4,9 mi, Estado + município), em andamento em nov/2025 (A Tarde, 21/11/2025). Não entra.
- Recuperação do píer de Morro de São Paulo: contrato da Seinfra-BA (Estado), mar/2026. Não entra.
- O vídeo não fala de nenhuma obra como "parada" ou "não começada".

## 2ª conferência (antes do vídeo final, 07/11/2026): fala, tela, capa e legenda
Relidas direto nos .txt dos PDFs (mesmas linhas da 1ª conferência): receitas 2024 (PCAGO015 2024 l.42: 167.885.692,30), 2025 (PCAGO015 2025 l.42: 186.938.318,63), 2026 até set (PCMGE016 09/2026 l.392: 145.242.589,53); despesas 2024 (PCAGO007 2024 l.114: 164.306.183,60), 2025 (PCAGO007 2025 l.118: 183.031.464,22), 2026 (PCMGE015 09/2026 l.9143: 158.754.562,44 + Câmara l.295: 5.032.377,41); "outros serviços" jan–abr/2026 (PCMGE016 04/2026 l.106: 7.147.263,51). Tudo bate.
Números só da tela, refeitos pelas ações (saida/acoes_*.json): quadras de escola 2024 R$ 2.153.307 ("R$ 2,2 MI") e 2025 R$ 1.098.631 ("R$ 1,1 MI"); defesa civil 2025 R$ 619.089 ("R$ 620 MIL"); limpeza urbana 2024 R$ 13.325.683 ("R$ 13,3 MI"); eventos 2024 R$ 3.285.278 ("R$ 3,3 MI"), 2026 R$ 3.226.698 ("R$ 3,2 MI"); assistência 2024 R$ 3.060.465 ("R$ 3,1 MI"), 2026 R$ 2.743.881 ("R$ 2,7 MI"); estádio 2026 R$ 1.127.289. Escritório: honorários estimados R$ 8.760.000,00 (voto 26269e24AG l.221–223). Tudo bate.
Notícias reconferidas antes do final (07/11/2026): TUPA segue em R$ 70 (reajuste suspenso); nenhuma novidade sobre o inquérito do empréstimo; nenhum julgamento novo do 33936e25 na página do TCM.
