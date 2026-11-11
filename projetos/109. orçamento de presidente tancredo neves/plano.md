# Plano de cenas · 109. orçamento de presidente tancredo neves
- Perfil @eumagnoleite · código orcamentotancredoneves · molde 108 Ubatã / 106 Santa Luzia / 093 Ilhéus · 167,45 s de voz (Google Chirp 3 HD Algenib).
- Abertura: Kit Mapas (~/Kit-Mapas-Animados/src/videos/orcamento-tancredoneves, IBGE 2925758, satélite copiado do Valença + npm run tiles) voa do Brasil até Presidente Tancredo Neves, com as três receitas (R$ 148,4 MI · 2024 / R$ 155,8 MI · 2025 / R$ 122,7 MI · 2026 ATÉ SETEMBRO), "PREFEITURA DE PRESIDENTE TANCREDO NEVES" e "TCM-BA". Trecho B: 2024 e "R$ 148,4 MI ARRECADOU EM 2024". O mapa sai em "Gastou 152".
- Mundo: a maquete redonda do molde. Cofre no meio; em cada ano a pilha do ano em volta (1 pilha = R$ 2 mi; dourado 2024, verde 2025, rosa 2026). Em "Gastou" as pilhas voam para as 10 casinhas na ordem da fala (Educação, Saúde, Obras e serviços urbanos, Administração, Dívidas, Assistência social, Câmara, Cultura e festas, Agricultura e meio ambiente, Esporte).
- Os três anos: torre VERMELHA na frente do cofre no que gastou a mais (R$ 4,4 MI, R$ 6,6 MI, R$ 8 MI) e o chip do empenhado de 2026 (R$ 140,6 MI).
- Miolo (câmera de gaveta em gaveta, um sentido só):
  1. FESTAS (frente, à esquerda; 1 pilha = R$ 200 mil): 3,3 mi (2024), 4,6 mi (2025) com o previsto de 2,3 mi em fantasma ao lado, 3 mi (2026 até set); chip "QUASE R$ 11 MI EM TRÊS ANOS". A câmera passa de torre em torre na palavra.
  2. ESPORTE (frente, à direita): três lajinhas vermelhas "R$ 0" (2024, 2025, 2026); chips de quadras, estádio e esporte amador e do apoio à agricultura familiar R$ 0.
  3. CÂMARA (atrás, à esquerda; 1 pilha = R$ 200 mil): recebeu 3,9 mi (2024) e 4,8 mi (2025); consultoria 679 mil (2025) em vermelho.
  4. DÍVIDA DO INSS (atrás, à direita; 1 pilha = R$ 10 mi): 132,7 mi no fim de 2024, a arrecadação de 2024 (148,4 mi) em fantasma ao lado em "Quase tudo", 129,5 mi no fim de 2025.
  5. Pergunta: mesa inteira, o esporte com R$ 0 e as festas (QUASE R$ 11 MI · FESTAS · 3 ANOS). Final em "Segue o".
- Tempo de tudo por quando() sobre palavras.ts (tabela T no código). Selos de fonte em cada bloco (TCM-BA). Sons do molde (whoosh nas cenas, pop nos números, baque nos achados, ding no fim).
- Palavras repetidas: "Esporte" (49,64 / 80,92 / 115,16 nos anos; "E o esporte" 130,02; "Mas se o esporte" 160,50), "Câmara" (41,96 / 74,06 / 108,24; "A Câmara de Vereadores recebeu" 136,90), "Quase" (123,64 dobro / 128,28 onze / 152,92 tudo / 163,52 final): o código usa trechos únicos.
- Folhas "PDF": 3 de receita (Anexo 10 de 2024 e 2025, PCMGE066 de set/2026) + 30 por setor (scripts/folhas_ptn.py → saida/folha-pdf/config-setores.json), Câmara com repasse e devolução.
- Capa: "Festas: / R$ 10,9 mi. / Esporte: / R$ 0." sobre um quadro limpo do miolo.
- Aprovado no modo autônomo (coordenador do lote de 40, 10/11/2026).
