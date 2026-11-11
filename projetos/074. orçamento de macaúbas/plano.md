# Plano · 074. orçamento de Macaúbas (molde Ubaitaba/Gandu) · APROVADO no modo autônomo (09/11/2026)

**Ideia do mundo (das regras):** Kit Mapas abre (voo do Brasil até Macaúbas, centro-sul da Bahia, três receitas) e encaixa no Estúdio 3D até "Gastou 215". Depois a maquete redonda da série: COFRE no meio, pilha do ano em volta (1 pilha = R$ 4 mi; dourado 2024, verde 2025, rosa 2026), 12 casinhas na borda da mesa na ORDEM DA FALA, pilhas voam para cada casinha na palavra do setor, câmera num sentido só, CabecalhoCidade "MACAÚBAS" com selo do @ que viaja, marca d'água quicando, legenda na base.

**Mapa da mesa (ângulo = 0,11π + i·0,152π, raio 7,45):** 0 Educação (escola) · 1 Saúde (posto) · 2 Administração (prefeitura) · 3 Obras, limpeza e iluminação (rua) · 4 Estradas e transportes (estrada rural) · 5 Câmara · 6 Dívidas e encargos (banco) · 7 Cultura, esporte e turismo (palco) · 8 Assistência social · 9 Água e esgoto/SAAE (estação) · 10 Meio ambiente (árvores) · 11 Agricultura (trator). Miolo: esquerda EVENTOS x PREVISTO (z 0,2), direita AGRICULTURA E O ZERO · 2025, atrás DÍVIDA FUNDADA (z −2), Tribunal com 3 pastas.

## Palavras-chave (quando() → evento → cena)
| palavra | tempo | objeto | o que acontece | cena |
|---|---|---|---|---|
| "Macaúbas arrecadou 211…229…183" | 0,0–6,8 | mapa | voo até a cidade, tags das 3 receitas | mapa A |
| "Tribunal de Contas" | 9,9 | mapa | tag TCM-BA | mapa A |
| "2024. A prefeitura arrecadou 211 milhões e 500" | 13,1–16,1 | mapa | R$ 211,5 MI digitado | mapa B |
| "Gastou 215" | 16,6 | cofre + pilhas douradas | cofre sobe, pilha do ano nasce | 2024 cofre |
| "4 milhões e 100" | 18,5 | torre vermelha | A MAIS | 2024 cofre |
| setores 2024 (Educação … Agricultura) | 20,6–45 | 12 casinhas | casinha sobe, pilhas voam, plaquinha | 2024 setores |
| "Gastou 221" / "Desta vez" | ~49 / ~51 | pilha verde, torre verde | SOBRARAM R$ 8 MI | 2025 cofre |
| setores 2025 | 53–79 | casinhas | pilhas verdes + plaquinhas dos anos anteriores | 2025 setores |
| "Já gastou 179" / "já comprometeu" | ~85 / ~87 | pilha rosa, torre vermelha | R$ 30,7 MI comprometidos além do arrecadado | 2026 cofre |
| setores 2026 | 88–112 | casinhas | idem | 2026 setores |
| "Agora repara" … "mais que o ano inteiro" | 112–129 | gaveta esquerda | eventos 2024/2025/2026 x previsto (branco ao lado) | eventos |
| "Enquanto isso" … "gastou zero" (2x) | 129–141 | gaveta direita | agricultura 1,2 mi; usina 854 mil e áreas 13,2 mi reservados (branco) → R$ 0 | agricultura/zero |
| "E tem a dívida" … "105 milhões" | 141–148 | gaveta de trás | 92,5 → 129,9 mi; INSS +42,9 mi; plaquinha 105 mi | dívida |
| "No Tribunal de Contas" … "condenação" | 148–168 | prédio TCM + 3 pastas | carimbo "NO TCM-BA" | tribunal |
| "Gastar não é crime" … "ficou no zero?" | 168–176 | mesa | eventos 2026 e usina R$ 0 em destaque | pergunta |
| "Segue o" | 176,4 | cabeçalho | selo do @ volta ao centro | fim |

## Câmera (início → fim de cada cena; enquadramento automático da base)
- 2024 cofre: geral alta (alvo [0,0,0,8], 11 x 8,4) → cofre (9,6 x 7,6). Setores: OLHA_SETOR de casinha em casinha, sempre no mesmo sentido, segura 0,55 s em cada.
- 2025 e 2026: sobe (DE_CIMA, 13 x 11) → cofre → setores (perto 1,12 e 1,2).
- Eventos: gaveta esquerda (7 x 6,4) → pares de torres da esquerda para a direita (3,4 → 5,4 de largura).
- Agricultura/zero: gaveta direita (6,2 x 6) → agricultura+usina → usina+áreas.
- Dívida: de frente para a gaveta de trás (7,6 x 6,8) → 2023 x 2025 → INSS → abre para a plaquinha de 105 mi.
- Tribunal: alto (10,4 x 7,6) → pasta a pasta (4,0 x 3,9) → as três.
- Pergunta: mesa inteira → eventos 2026 → usina → abre no "Segue o".

## Sons
whoosh nas trocas de cena; tique nas viradas de estado; pop em cada setor e número; subida no "gastou"; baque nas torres de falta e nos zeros; ding no "Segue o".

## Folhas "PDF" (regras 28b, 29, 42, 42b, 45, 47, 48, 71, 73)
3 folhas de receita (uma por ano, soma = total) + 36 folhas por setor (12 x 3), Câmara com duodécimo, a 90 px das laterais (tools/lista_pdf/lista_pdf.py, sem mexer em escala/posição).

## Arquivos
- Novos: src/videos/orcamentomacaubas/OrcamentoMacaubas.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-macaubas/ (+ scripts/dados-orcamento-macaubas.py, satelite/orcamento-macaubas copiado do Caetité + 7 blocos).
- Alterados (só acrescentado): src/Root.tsx do Estúdio e do Kit Mapas.
- Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras, orcamentocabralia (EstradaRural), orcamentoparatinga; comum/CabecalhoCidade.

## Escolhas do diretor (★)
★ Previsto em branco ao lado de cada ano de eventos e a torre de 2026 maior que a de 2025 ("já passou o ano inteiro").
★ Torres brancas vazias da usina e das áreas degradadas viram plaquinha "R$ 0" vermelha na palavra "zero".
