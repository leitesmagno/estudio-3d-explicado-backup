# Plano de cenas · 130. orçamento de São Francisco do Conde (BA)

Perfil @eumagnoleite · molde 128 Arataca / 093 Ilhéus · código `orcamentosaofranciscodoconde` · Nome `OrcamentoSaoFranciscoDoConde`.
Aprovado no modo autônomo (coordenador, 10/11/2026: pedido urgente do amigo auditor do Magno). Voz 175,3 s, vídeo 176,2 s.

## Ideia do mundo
Abertura no Kit Mapas (voo do Brasil até São Francisco do Conde, no Recôncavo; "PARA ONDE FOI CADA REAL?"; 2024: R$ 679,7 MI e R$ 90 MI de empréstimo).
Depois, a maquete redonda do molde: COFRE no meio e a PILHA DO ANO em volta (1 pilha = R$ 10 mi). Na fala de cada setor, as pilhas voam para a casinha
do setor, na ordem da fala, e a câmera passa de casinha em casinha num sentido só. 13 casinhas na borda (0,11π a 1,79π).

## Mapa do mundo
- Centro: cofre (some no "Agora repara").
- Borda: Educação (escola), Saúde (posto), Assistência social, Aposentadorias e pensões (casinha), Obras e habitação (galpão), Limpeza urbana (rua com gari),
  Transporte (ônibus), Administração (prefeitura), Dívidas (banco), Câmara, Cultura e festas (palco), Agricultura e meio ambiente (trator), Esporte (quadra).
- Miolo, frente esquerda: gaveta "ICMS x SAÚDE" (1 pilha = R$ 10 mi). Frente direita: gaveta "EVENTOS · ÔNIBUS · ASSISTÊNCIA" (1 pilha = R$ 1 mi).
- Atrás do cofre: gaveta "CÂMARA" (1 pilha = R$ 2 mi) e "DÍVIDA COM O INSS" (1 pilha = R$ 20 mi).

## Palavras-chave (tempo vem do palavras.ts por quando())
| Palavra | Objeto | Acontece | Cena |
|---|---|---|---|
| "Eu abri as contas" | mapa | voo até a cidade, contorno acende | mapa A |
| "2024 Arrecadou 679" | mapa | R$ 679,7 MI digitado | mapa B |
| "Disso 90 milhões" | mapa | tag R$ 90 MI DE EMPRÉSTIMO | mapa B |
| "Gastou 847" | cofre | pilha dourada nasce em volta | 2024 |
| "Gastou 167" | torre vermelha | o que gastou a mais | 2024 |
| setor (1ª vez) | casinha | casinha sobe, pilhas voam, plaquinha | 2024 |
| "2025 Arrecadou 534" / "Gastou 593" / "Gastou 58" | cofre | pilha verde, torre vermelha | 2025 |
| setor (2ª vez) | casinha | pilhas verdes, plaquinhas 2024 x 2025 | 2025 |
| "2026 até setembro" / "Disso 117" / "Gastou 480" / "Sobraram 95" | cofre | pilha rosa, chip dos royalties, torre verde da sobra | 2026 |
| setor (3ª vez) | casinha | pilhas rosa | 2026 |
| "A maior receita" / "para 205" | torres ICMS | 2024 e 2025 | ICMS x saúde |
| "No mesmo tempo" / "para 92" | torres saúde | 2024 e 2025 | ICMS x saúde |
| "Os eventos" / "Em 2025 393" | torres | eventos 2024 e 2025 | eventos · ônibus |
| "O subsídio" / "para 19 milhões" / "mais que toda" | torres | ônibus 2024 e 2025, assistência 2025 | eventos · ônibus |
| "A Câmara recebeu" / "e devolveu 15" / "Em 2025 recebeu" / "e devolveu 785" | torres | recebeu e devolveu | Câmara |
| "A dívida parcelada" / "E fechou 2025" | torres | INSS 213,2 → 229,7 | INSS |
| "Gastar não" / "Mas se em 2025" / "por que a Câmara" | torres | assistência 16,7 x Câmara 34,1 | pergunta |
| "Segue o" | selo | selo volta ao centro | fim |

## Câmera
Do molde 128: vista geral → cofre de cada ano → casinha em casinha (segura 0,55 s em cada) → gavetas de par em par → mesa inteira no fim.

## Sons
whoosh nas trocas de cena, pop em cada setor, subida no "Gastou", baque no "a mais", ding na sobra de 2026 e no "Segue o".

## Folhas PDF (tools/lista_pdf)
3 de receita (2024 Anexo 10, 2025 e 2026 PCMGE016 consolidado) + 39 por setor (13 x 3 anos), soma = valor falado. Câmara com recebeu e devolveu.
2024 sem faixa de pessoal (o Anexo 6 não abre por elemento; os PDFs mensais de dez/2024 são escaneados).

## Arquivos e peças
src/videos/orcamentosaofranciscodoconde/ (OrcamentoSaoFranciscoDoConde.tsx, palavras.ts); peças do molde (orcamentoitabuna/pecas, orcamentocanavieiras/pecas,
orcamentoparatinga/pecas BaseGaveta, pecas Onibus/CofreFGTS); Kit Mapas src/videos/orcamento-sfconde → projetos/130.../mapas/sfconde.mp4.

★ Melhoria: a pergunta final põe lado a lado a torre da assistência de 2025 e a torre da Câmara de 2025, na mesma escala (1 pilha = R$ 1 mi).
