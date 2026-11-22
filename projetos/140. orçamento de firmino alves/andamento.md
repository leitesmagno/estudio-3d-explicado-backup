# 140. orçamento de firmino alves
- Perfil: @eumagnoleite (id: eumagnoleite)
- Código: orcamentofirminoalves · Nome: OrcamentoFirminoAlves (composições OrcamentoFirminoAlves, OrcamentoFirminoAlvesGuia, OrcamentoFirminoAlvesLimpo, CapaOrcamentoFirminoAlves). Kit Mapas: orcamento-firmino-alves (IBGE 2910909, conferido na API do IBGE: Firmino Alves, microrregião Ilhéus-Itabuna).
- MODO AUTÔNOMO (Lote LARANJA, L29, pedido do coordenador em 12/11/2026 ~03:10, regras 114 e 118, aba reaproveitada do 136 Condeúba): roteiro revisado vale como aprovado; plano e revisão aprovados por mim; voz Google Algenib. Molde 136 Condeúba / 132 Abaíra. 3 anos (2024, 2025, 2026 até o último mês entregue); receita = total declarado ao TCM, com folhas PDF; despesa 100% por setor, com a Câmara e o duodécimo; festas fora da Cultura (regra 99); sem tarifa bancária; máx. 3:00; sem nome de gestor; legenda com ⚖️ AVISO e #FirminoAlves #MagnoLeiteExplica; regra 111.
- Esteira: TCM só depois do "pode pesquisar" (fila: Cordeiros, Dom Basílio, Feira da Mata, Firmino Alves).
- 12/11 03:12: pastas criadas (projeto, edicoes, ~/Documents/RECEITAS-DESPESAS-FIRMINO-ALVES/{documentos_tcm,scripts,saida,logs}). PESQUISA INICIAL (sem navegador): SICONFI por API (DCA 2024 e 2025, RREO 6º bim 2024 e 2025, RREO 3º e 4º bim 2026) em saida/siconfi_*.json; notícias levantadas (só conferência interna).
- Etapa atual: 1 (levantamento), esperando a vez do TCM.

## PAUSA (12/11 05:40)
- Por ordem do Magno (via coordenador): parada, ele vai fazer outro vídeo.
- Onde parou: pesquisa inicial pronta (IBGE, SICONFI, notícias, esqueleto do roteiro). Era a vez no TCM, mas o e-TCM estava fora do ar; a checagem de 5 em 5 min foi parada. Nenhuma trava pega, nada baixado do TCM.
- Próximo passo quando liberar: conferir se o e-TCM responde, pegar _navegador-app.lock e baixar tudo de uma vez (PCMGE 2024/2025/2026, anuais e PCAGO015 de 2024, 2025 e anteriores, PCMGE056). Depois soltar a trava, avisar "pesquisa de Firmino Alves pronta" (Feira da Mata espera para baixar os PCAGO015 de 2016 a 2020).

## RETOMADA (12/11 10:16)
- Coordenador liberou o TCM. Trava _navegador-app.lock pega 10:17. e-TCM: município 132 FIRMINO ALVES, Prefeitura UJ 737, Câmara UJ 165. Último mês entregue pela Prefeitura: 06/2026 (07 a 10/2026 "Pendente"; Câmara entregou até 09/2026). Lista de prestações gravada (dados/prestacoes-etcm/firmino-alves.json, 22 linhas).
- Downloads (baixa_fa.js): Prefeitura e Câmara 12/2024, 12/2025, 06/2026; anuais 2024 e 2025; PCAGO015 2020 a 2023; PCMGE056 de jan/2024 a jun/2026.

## PAUSA 2 (12/11 11:00, pedido do Magno: Mac livre para o vídeo triplex)
- Baixados (29 PDFs): Prefeitura 12/2024 e 12/2025 completos (PCMGE008/015/016/018/064/065/066); 06/2026 PCMGE008/015/016/018/064/065; Câmara 12/2024 e 12/2025 (PCMGE007/015/018); Câmara 06/2026 PCMGE007 (_2, _3, _4).
- Falharam (refazer): Prefeitura 06/2026 PCMGE066; Câmara 06/2026 PCMGE007 (1º), PCMGE015 e PCMGE018.
- FALTA na fila, na ordem: anuais 2025 e 2024 (PCAGO001-019/041, tipo Governo); PCAGO015 2023, 2022, 2021, 2020; PCMGE056 de 01/2024 a 06/2026 (30 meses); Balanços extras (balx, rotina "antigo" que espera a lista de classificação): Firmino Alves 2019, 2018, 2017, 2016; Piatã 2024; Potiraguá 2025; Dom Basílio 2018 (UJ 724); Feira da Mata 2016, 2017, 2018, 2019, 2020. Depois: extrai_balancos.py, conferir balancos.json, manuais e pendências; avisar o coordenador o que veio e o que não veio.
- Trava _navegador-app.lock solta às 11:00.

## PESQUISA CONCLUÍDA (13/11/2026 11:34 a 12:05, Claude Code, etapas pesquisa_inicial, tcm_download, leitura e fontes)
- Trava _navegador-app.lock pega às 11:34 e solta ao fim; recebedor 8778 e Chrome fechados.
- e-TCM: último mês da Prefeitura continua 06/2026 (07 a 10/2026 "Pendente"). Baixados agora: PCAGO015 2025, 2024, 2023, 2022, 2021, 2020; Prefeitura 06/2026 PCMGE066 (veio o balancete extra-orçamentário, não a receita: pendência); Câmara 06/2026 PCMGE015 e PCMGE018; PCMGE056 de 12/2024, 12/2025 e 06/2026. Nenhuma falha. Todos com .txt.
- Leitores novos (sistema E&L SIAFIC, sem função na ação): scripts/acoes065_el.py (despesa, colunas pelas contas fixas do demonstrativo), scripts/setores_fa.py (setor pela secretaria e pela ação, conferido com o SICONFI por função) e scripts/receita_fa.py. Saídas: saida/c_*_PCMGE065.json, saida/setores.json, saida/receita_2024/2025/2026.json.
- Totais: 2024 arrecadou 48.833.509,46 e gastou 49.847.915,93 (Balanço; 1.014.406,47 a mais); 2025 arrecadou 42.917.931,74 e gastou 42.603.301,52 (sobrou 314.630,22); 2026 até junho arrecadou 20.749.585,93 e gastou 22.123.299,41 (empenhado 25.795.120,99). Setores somam o PCMGE065 centavo a centavo.
- Pistas para o roteiro (no fontes.md, seção Achados): festas e eventos 920.800,00 / 1.644.445,07 / 1.331.015,87 (previsto 469.922,03 em 2025; em 2026 até junho já passou a assistência social em 369 mil); emendas por transferência especial 7,5 mi em 2024, 5,43 mi em 2025, 2,6 mi até jun/2026; pavimentação 4,69 mi em 2024; estradas 2,58 mi → 185 mil; Câmara recebeu x devolveu.
- audio/fontes.md reescrito no formato do 139 (versão antiga em antigos/), cópia em ~/Documents/FONTES. Balanços 2020 a 2025 no balancos.json do site (regra 111).
- AUDITORIA (8º andar, fase pesquisa): APROVADO, zero ❌ (35 de 35 valores achados no PDF; ⚠️ só as 3 pendências anotadas).
- Etapa atual: auditoria aprovada → próximo passo é o ROTEIRO (com o maestro/Senior; esta sessão não escreve roteiro).

## SINCRONIA, CENAS, MAPA, FOLHAS E REVISÃO (13/11/2026 14:20 a 15:05, Claudinho SL, Claude Code)
- Sincronia: a Groq pulou o trecho de 10 a 27 s e inventou um "nada"; ficou o Whisper local (large-v3-turbo, nice 15) + limpa_whisper.py do 139, com o trecho de 50,9 a 95,6 s tirado da Groq (lá o local juntou tudo num bloco só). transcricao/palavras-original.json (local bruto), palavras-groq.json, palavras.json (mesclado). palavras.ts = 422 palavras = roteiro; última "informações." em 176,96 s; áudio 177,41 s; QUADROS = 5349. Tempos sempre crescentes; todas as frases do quando() achadas.
- Código: src/videos/orcamentofirminoalves/OrcamentoFirminoAlves.tsx (molde 139). Gavetas: CÂMARA: RECEBEU x DEVOLVEU (2025: 1,8 mi / 201 reais; até jun/2026: 934 mil / 17 mil; 1 pilha = R$ 100 mil), EMENDAS PARLAMENTARES (7,5 / 4 + 1,4 / 2,6 mi; 1 pilha = R$ 500 mil), FESTAS x ASSISTÊNCIA SOCIAL (previsto x gasto 2024/2025/2026 e assistência 962 mil até jun; 1 pilha = R$ 100 mil). 2024 e 2026 com torre vermelha "A MAIS"; 2025 "SOBRARAM". TITULO_CAPA do audio/titulo-capa.json (fonte menor para linha longa; testado, cabe). Root registrado (apelidos _FIA). npx tsc --noEmit sem erro.
- Kit Mapas: src/videos/orcamento-firminoalves (IBGE 2910909, npm run dados; satélite copiado do orcamento-florestaazul + npm run tiles: 19 compostos, 0 baixados), Root do Kit KITFIRMINOALVES; mapa renderizado (20,17 s) em mapas/firminoalves.mp4 (o azul no voo é o litoral de verdade).
- Folhas: ~/Documents/RECEITAS-DESPESAS-FIRMINO-ALVES/scripts/folhas_fa.py → saida/folha-pdf/config-setores.json, 36 folhas (3 de receita + 33 de setores). Cada setor bate com o setores.json e a soma de cada ano = TOTAL GERAL do PCMGE065 (49.847.911,18 · 42.603.301,52 · 22.123.299,41). Receita: 48.838.777,44 (PCMGE016; rodapé avisa que o Balanço dá 48.833.509,46) · 42.917.931,74 · 20.749.585,93; dedução do Fundeb tirada do FPM, ICMS e IPVA.
- Revisão: 71 quadros (scripts/vez_mq.sh, trava, nice 15, 1 núcleo, 14:52 a 14:56), conferidos em folhas de contato: números = fontes.md, cores dos anos, plaquinhas dentro da margem, nada piscando, cabeçalho e marca. APROVADA (modo autônomo).
- vez_final.sh pronto em ~/Documents/RECEITAS-DESPESAS-FIRMINO-ALVES/scripts/ (cópia do de Salvador: PJ/ED/nome FIRMINO ALVES/composição OrcamentoFirminoAlves; fundo da capa no quadro 4980). O antigo (cópia do Condeúba) foi para scripts/antigos/.
- NÃO renderizado o vídeo final e NÃO entregue (com o maestro).
- Etapa atual: revisão aprovada → próximo: auditoria --fase roteiro e render pelo maestro.
