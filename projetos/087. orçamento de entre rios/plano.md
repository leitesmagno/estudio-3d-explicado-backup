# Plano de cenas · 087. orçamento de Entre Rios

Aprovado no modo autônomo (coordenador, 11/11/2026). Molde 125 Senhor do Bonfim / 093 Ilhéus. Voz Google Algenib (178,2 s), sincronia por quando() sobre palavras.ts.

## Mundo
Mesa-maquete redonda (MesaMaquete), cofre no meio e 11 casinhas na borda, na ordem da fala: Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas e encargos, Assistência social, Câmara de Vereadores, Festas e eventos, Cultura, Agricultura e meio ambiente, Esporte. 1 pilha = R$ 3 mi. Cores: dourado 2024, verde 2025, rosa 2026. 2024 e 2025 gastaram mais do que arrecadaram (torre vermelha "A MAIS"); 2026 até junho sobrou (torre verde, só na tela).

## Cenas
| Trecho | Palavra-chave (quando) | O que acontece |
|---|---|---|
| 0 a 30,0 s | abertura | Kit Mapas (mapas/entrerios.mp4): voo do Brasil até Entre Rios; as três receitas (196,3 · 215,3 · 117,8 até jun); Prefeitura e Câmara no TCM-BA; receita de 2025 (FPM 52,9 · Fundeb 35,8 · União no Fundeb 22,6 · SUS 28,8 · royalties do petróleo 12,2). Selo do @ grande no meio, viaja para o cabeçalho. Folha "PDF" da receita de 2025. |
| "2024 Arrecadou 196" | 2024 | mapa: R$ 196,3 MI arrecadou em 2024; folha da receita 2024 |
| "Gastou 203" | 2024 | cofre abre, pilha dourada; torre vermelha "R$ 7,2 MI A MAIS"; pilhas voam para cada casinha na palavra do setor; folha do setor troca a cada setor |
| "2025 Arrecadou 215" | 2025 | câmera de cima, pilha verde, torre vermelha "R$ 6,4 MI A MAIS", setores; Esporte "R$ 0 · os R$ 172 mil previstos foram cancelados" |
| "2026 ate junho o ultimo" | 2026 | pilha rosa, torre verde "R$ 5 MI SOBRARAM" (só tela), setores; folha da receita 2026 |
| "Na secretaria de Obras" | Obras 2025 | gaveta na frente do cofre: três torres (1 pilha = R$ 3 mi): ação de manutenção 29,1 · combustível 11,8 · aluguel de máquinas 8,2 |
| "Agora a Camara" | gaveta atrás (1 pilha = R$ 500 mil) | 2024 recebeu 6,4 / gastou 5,6 / devolveu 853 mil; 2025 recebeu 7,3 / gastou 7,3 / devolveu R$ 215 |
| "E as festas" | gaveta da frente (1 pilha = R$ 500 mil) | ação de eventos e festas culturais 2025: previsto 2,1 x gasto 5,8; bandas 5,4 |
| "Gastar nao" | pergunta | mesa inteira; assistência social 2025 (3,7) ao lado das festas 2025 (5,8), mesma gaveta e escala |
| "Segue o" | fim | selo volta para o meio; câmera abre |

Câmera de cada cena: VISTA_GERAL/DE_CIMA/COFRE na virada de cada ano, OLHA_SETOR de casinha em casinha (0,55 s em cada), enquadramentos das gavetas no código (CENAS em OrcamentoEntreRios.tsx), sempre com arco e grua leves.

## Fontes, sons e peças
Fontes: audio/fontes.md (cópia em ~/Documents/FONTES). Sons: whoosh nas cenas, pop nos setores, baque no "a mais" e nos achados, ding na sobra e no fim. Peças: as do molde 125 (Escola, PostoSaude, RuaServicos, Prefeitura, BancoDivida, PredioAssistencia, CamaraVereadores, PredioTexto palco/colunas/trator/quadra, BaseGaveta, CofreFGTS, PilhasDinheiro), CabecalhoCidade, folhas via tools/lista_pdf (36 folhas: 3 de receita + 33 por setor).
★ Melhoria: a gaveta das Obras (escolha do diretor) mostra, na escala da mesa, que só o combustível de uma ação de manutenção (11,8) passou três vezes a assistência social do ano inteiro (3,7), sem dizer isso na fala.
