# Plano · 061. orçamento de Uruçuca

APROVADO no modo autônomo em 08/11/2026 (projetos/_coordenacao-sessoes.md, Lote 2).
- Código: `src/videos/orcamentourucuca/OrcamentoUrucuca.tsx` (copiado do 059 Jequié, molde 035 Paratinga). Composições: OrcamentoUrucuca, OrcamentoUrucucaGuia, OrcamentoUrucucaLimpo, CapaOrcamentoUrucuca.
- Narração: Google Chirp 3 HD Algenib, speakingRate 1,3, 17 partes (14 refeita: "da sede até Serra Grande") unidas com 0,35 s, pausas 0,28 s, atempo 1,099, -15 LUFS → 174,40 s. AUDIO_SEG = 174.4.
- Mapa: `~/Kit-Mapas-Animados/src/videos/orcamento-urucuca` (IBGE 2932705, conferido na API: "Uruçuca"; o 2932507 é Una) → `mapas/urucuca.mp4`. Satélite reaproveitado do 058 Itacaré (Uruçuca fica dentro da área de perto dele).

## Ideia do mundo (regras do molde; o que mudou está marcado)
Maquete redonda (sem rio). Cofre no meio. A cada "gastou", a pilha do ano nasce em volta do cofre (dourado 2024, verde 2025, rosa 2026). 1 MOEDA = R$ 200 MIL e 1 PILHA = R$ 2 MI (como o 035). A cada setor falado, as pilhas voam para a casinha. 12 casinhas na borda, na ordem da fala: Educação, Saúde, Administração, Obras e serviços urbanos (rua; toda a Secretaria de Infraestrutura), Câmara, Dívidas, precatórios e encargos, Cultura e festas (palco), Assistência social, Água e saneamento (cinza, zero: Embasa), Agricultura (trator cinza, zero), Esporte (campo), Meio ambiente (casinha cinza, zero).
- Torre VERMELHA na frente do cofre nos três anos: 2024 "R$ 718 MIL A MAIS"; 2025 "DÉFICIT: R$ 12 MI" (o Balanço chama assim); 2026 "R$ 6,9 MI A MAIS" (liquidado 85,5 x arrecadado 78,6; o empenhado 112,1 vai no chip).
- Esporte 2026: só a plaquinha "R$ 44 MIL · QUADRAS DAS ESCOLAS" (o dinheiro já está na Educação; nenhuma pilha voa).
- Miolo (1 pilha = R$ 1 mi), da esquerda para a direita na ordem da fala: gaveta TURISMO (fantasma de 6,95 que ENCOLHE para 2,1 quando a voz diz "4 milhões e 800 foram tirados"; moedinha verde de R$ 1.314,50; moedinha rosa de R$ 29,4 mil de 2026), gaveta SERRA GRANDE (fantasma 6,5 x gasto 0,3), gaveta FESTAS 2024 (fantasma 1,04 x dourado 2,05).
- Obra do Estado: placa de rua "BA-653 · GOVERNO DO ESTADO · R$ 50,1 MI" no miolo (Jornal Grande Bahia).
- Tribunal: prédio do TCM aceso, chip "NENHUMA DECISÃO DE AUDITORIA SOBRE 2024, 2025 OU 2026".
- Pergunta: volta à gaveta do turismo (previsto x R$ 1.314,50).
- ★ Melhorias de atenção (regra 14): no gancho, "2025: GASTOU R$ 124,9 MI" e "TURISMO EM 2025: R$ 1.314,50" entram no mapa junto da fala, com baque leve; a torre-fantasma do turismo encolhe na frase "foram tirados dela" (o seguidor vê o dinheiro sair); impacto no gasto da subprefeitura e no "quase o dobro".

## Mapa de palavras (quando() → s → evento → cena)
| palavra | s | evento | cena |
|---|---|---|---|
| (início) / "gastou 124" / "A secretaria de turismo 1.314" | 0,0 / 0,4 / 3,2 | mapa Brasil → Uruçuca; chips do gancho | mapa A |
| "Eu abri" / "Tribunal" | 5,9 / 7,6 | PREFEITURA DE URUÇUCA; TCM-BA | mapa A |
| "2024 A prefeitura" / "arrecadou 107" | 8,6 / 10,2 | 2024; R$ 107,9 MI ARRECADOU EM 2024 | mapa B |
| "Gastou 108" / "Faltaram 718" | 12,3 / 14,5 | sai o mapa; cofre e pilha dourada; torre vermelha | 2024 |
| setores 2024 | 16,3–42,2 | pilhas voam; plaquinhas; câmera de casinha em casinha | 2024 |
| "2025 Arrecadou" / "Gastou 124" (2ª) / "O próprio balanço" / "déficit 12" | 43,6 / 46,7 / 48,7 / 50,5 | sobe; pilha verde; torre vermelha 12 | 2025 |
| setores 2025 | 52,3–76,2 | idem, com plaquinhas de 2024 juntas | 2025 |
| "2026 até agosto" / "Arrecadou 78" / "Gastou 85" / "São 6" / "já empenhou" / "Uma parte" | 77,7 / 79,4 / 81,4 / 83,4 / 85,5 / 89,0 | pilha rosa; torre vermelha 6,9; chips | 2026 |
| setores 2026 | 90,8–113,0 | idem | 2026 |
| "Agora repara" / "Uruçuca tem as praias" / "Em 2025 a secretaria" (2ª) / "Mais da metade" / "Durante o ano" / "Gasto 1.314" / "Em 2026 até agosto 29" | 114,9 / 116,1 / 117,9 / 122,3 / 125,3 / 128,1 / 130,7 | gaveta turismo; fantasma 6,95; encolhe; moedinhas | turismo |
| "A subprefeitura" / "Gastou 303" / "188 mil no carnaval" | 133,4 / 137,7 / 139,8 | gaveta Serra Grande | Serra Grande |
| "E as festas" / "carnaval e festas juninas" / "Gasto pouco mais de 2" / "Quase o dobro" | 142,5 / 144,7 / 147,5 / 149,3 | gaveta festas 2024 | festas |
| "A estrada da sede" / "50 milhões e 100" / "com ordem de serviço" | 150,1 / 154,0 / 156,3 | placa BA-653 | Estado |
| "Nas decisões de auditoria" | 158,8 | prédio do TCM | tribunal |
| "Gastar com festa" / "Mas numa cidade" / "por que o turismo" / "Segue o" | 165,1 / 166,6 / 168,5 / 171,7 | pergunta; @eumagnoleite | pergunta |

## Câmera (enquadramento automático da base)
- Anos: entra alto no cofre → COFRE → OLHA_SETOR de cada casinha (segura 0,55 s antes da próxima).
- Achados: geral do miolo → turismo (previsto, moedinhas) → Serra Grande → festas, sempre para a direita.
- Estado: placa BA-653 de frente. Tribunal: prédio do TCM. Pergunta: mesa → turismo → abre no fim.

## Fontes e sons
Fontes: audio/fontes.md (selos: Balanço e Anexo 9 2024/2025; SIGA ago/2026 Prefeitura e Câmara; despesa por ação e Anexo 6; Jornal Grande Bahia; TCM-BA Decisões). Sons: whoosh nas trocas de cena, tique nas trocas de pílula, pop em cada setor e achado, baque nos "a mais" e nos "1.314 reais", impacto no gasto da subprefeitura e no "quase o dobro", ding no "Segue".

## Arquivos
Novos: src/videos/orcamentourucuca/OrcamentoUrucuca.tsx, palavras.ts; ~/Kit-Mapas-Animados/src/videos/orcamento-urucuca/ (index.tsx, roteiro.ts, dados/), scripts/dados-orcamento-urucuca.py. Alterados (só acréscimo): src/Root.tsx do Estúdio e do Kit Mapas. Reaproveitados: peças de orcamentoitabuna, orcamentocanavieiras (PredioTexto), orcamentoparatinga (BaseGaveta, RuaPlaca) e src/pecas.
