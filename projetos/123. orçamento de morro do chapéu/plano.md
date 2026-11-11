# Plano de cenas · 123. orçamento de morro do chapéu

Aprovado no modo autônomo (lote LARANJA, regra 103). Molde: 120 Riachão das Neves (mesmo mundo, mesmas peças, mesma câmera).
Áudio: 176,91 s · QUADROS = 5334 · 453 palavras (última "informações." termina em 176,52 s).

## Mundo
Maquete redonda (MesaMaquete) com o COFRE no meio. 11 casinhas na borda, na ordem da fala: Educação (escola), Saúde (posto), Obras e serviços urbanos (rua), Administração (prefeitura), Dívidas e encargos (banco), Previdência dos servidores (galpão "PREVIDÊNCIA"), Assistência social, Câmara, Cultura (colunas), Agricultura e meio ambiente (trator), Esporte (quadra).
Escala: 1 pilha = R$ 3 mi (dourado 2024, verde 2025, rosa 2026). Torre verde do que sobrou na frente do cofre em cada ano.
Miolo, depois dos setores: atrás, a gaveta "CÂMARA: O QUE RECEBEU" (1 pilha = R$ 500 mil); na frente, a gaveta "EMPRÉSTIMOS · PAVIMENTAÇÃO · CULTURA" (1 pilha = R$ 1 mi, tudo na mesma escala).

## Cenas (gatilho pela palavra, quando())
| Trecho | Palavra | O que acontece | Câmera |
|---|---|---|---|
| Abertura (mapa do Kit) | 0 s a "Gastou 251" | voo até Morro do Chapéu; 259 / 293 / 214 mi; Prefeitura e Câmara, TCM-BA; receita 2025: ICMS 48,4, FPM 47, SUS 44,3, Fundeb 41,4, complementação 34,6; "2024 · R$ 259,2 MI ARRECADOU" | mapa |
| 2024 | "Gastou 251" | cofre sobe com a pilha dourada; "Sobraram 7" torre verde | vista do cofre |
| setores 2024 | "Educação" ... "Esporte" (1ª vez) | pilhas voam para cada casinha | casinha a casinha |
| 2025 | "2025 Arrecadou 293" / "Gastou 266" / "Sobraram 26" | pilha verde, torre verde | de cima → cofre |
| setores 2025 | 2ª vez de cada nome | idem | casinha a casinha |
| 2026 | "2026 até setembro" / "Gastou 209" / "Sobraram 5" / "E já comprometeu" (chip) | pilha rosa | de cima → cofre |
| setores 2026 | 3ª vez de cada nome | idem | casinha a casinha |
| Câmara | "Agora a Câmara" / "recebeu 8 milhões e 150" / "Em 2025 8 milhões e 960" / "devolveu 6 mil" / "já recebeu 8" | torres recebeu 2024, 2025 (+devolveu), 2026 | gaveta de trás |
| Empréstimos | "E os empréstimos" / "previa pegar 7" / "Pegou 19" / "No mesmo ano a pavimentação" / "gastou 34" / "pegou mais 1" / "E o orçamento de 2026" | previsto (claro) x pego (vermelho); pavimentação prevista x gasta; 2025; previsão 2026 | gaveta da frente, par a par |
| Cultura | "E a cultura" / "a ação de atividades culturais" / "gastou 473" | previsto 7 mi x gasto 473 mil | gaveta da frente |
| Pergunta | "Pegar empréstimo não" / "Mas se as dívidas" / "quando chegarem as parcelas" | casinha das dívidas (3 anos) e a torre dos 43,7 mi previstos | mesa → dívidas → previsão 2026 |
| Fim | "Segue o" | mesa inteira, assinatura | abre |

## Palavras repetidas (ocorrência usada)
Câmara: 1ª na abertura; setores = 2ª, 3ª, 4ª; "Agora a Câmara" = trecho único. Educação/Saúde/...: 1ª = 2024, 2ª = 2025, 3ª = 2026. Cultura: 4ª vez = "E a cultura" (trecho único). Gastou/Sobraram: sempre com o número ("Gastou 251", "Sobraram 26").

## Folhas "PDF" (regra 28/28b): 36
Receita 2025 (na fala da receita), receita 2024, receita 2026; uma folha por setor em cada ano (33). Soma das linhas = valor falado (scripts/folhas.py → saida/folha-pdf/config-setores.json).

## Sons
whoosh nas viradas de cena, pop nos números, subida no "Gastou", ding no "Sobraram", baque nos achados (Pegou 19, gastou 34, 43,7 mi, 473 mil).

## Arquivos
src/videos/orcamentomorrodochapeu/ (OrcamentoMorroDoChapeu.tsx, palavras.ts) · Root: OrcamentoMorroDoChapeu, …Guia, …Limpo, CapaOrcamentoMorroDoChapeu · Kit Mapas: src/videos/orcamento-morro-do-chapeu (IBGE 2921708), Root KITMORROCHAPEU · mapa em projetos/123.../mapas/morrodochapeu.mp4.
