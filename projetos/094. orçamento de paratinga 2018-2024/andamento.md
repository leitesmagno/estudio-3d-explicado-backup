# 094. orçamento de paratinga 2018-2024
- Perfil: @eumagnoleite (id: eumagnoleite), parceria com @eugeniodmr (pedido dele)
- Código: orcamentoparatinga1824 · Nome: OrcamentoParatinga1824
- Prompt: projetos/_prompt-paratinga-2018-2024.md (molde Ubaitaba 092). NÃO é modo autônomo: aprovação do Magno em roteiro + capa, plano, quadro de teste do cabeçalho (dois selos) e revisão.
- NÃO mexer no 035 (Paratinga 2024–2026, pronto).
- e-TCM: município 291 · Prefeitura UJ 895 · Câmara UJ 324 · IBGE 2923704.
- Levantamento: ~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/

## Etapa atual
8. ENTREGUE em 09/11/2026 ~15h15: edicoes/094.../PARATINGA 2018-2024.mp4 (179,9 s, 5397 quadros, 42 folhas), capa ("7 anos / gastando / mais do que / arrecadou.", fundo das torres da Gênesis) e legenda (2.006 caracteres + comentário fixado). Cópia em ~/Documents/NOVO LOTE/PARATINGA 2018-2024/. REVISÃO APROVADA pelo Magno ("Aprovado, gera").
- Depois da aprovação, o Magno confirmou: encaixar a Overclean "de acordo com os números que você tem". Roteiro v4: emendas Pix nas contas da prefeitura (Anexo 10: R$ 2 mi em 2021 + R$ 1,9 mi em 2024 = R$ 3,9 mi); saiu da fala a frase dos precatórios do Fundef (fica na tela e na legenda). Voz v4: atempo 1,1323, 179,01 s; 519 palavras, última em 178,64 s; CTA conferido na transcrição.
- Selos pequenos do cabeçalho com opacidade 0,85 e grandes 100% (pedido do Magno via coordenador).
- Conferência 2 dos números feita (fontes.md). Legenda pronta (2.006 caracteres): edicoes/094.../PARATINGA 2018-2024 - legenda.txt.
- Plano e cabeçalho com dois selos APROVADOS pelo Magno (09/11/2026), com pedido extra: uma notícia forte confirmada 2–3 vezes, site na tela e não na fala. Entrou a Operação Overclean (PF, 27/06/2025), confirmada em 7 veículos; roteiro v3 e voz v3 (179,01 s; QUADROS 5397).
- Mapa: ~/Kit-Mapas-Animados/src/videos/orcamento-paratinga1824 → mapas/paratinga1824.mp4.
- Código: src/videos/orcamentoparatinga1824/OrcamentoParatinga1824.tsx (registrado no Root.tsx; tsc ok).
- Folhas: 42 (receita por categoria do Balanço, despesa do ano com os 12 setores, Educação/Saúde/Obras/Câmara por ações ou subfunções), config em ~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/saida/folha-pdf/config.json. Câmara sem a faixa do duodécimo (só a parcela de dezembro está nos comprovantes; Balanço Financeiro escaneado/girado).
- Roteiro e capa APROVADOS pelo Magno em 09/11/2026 ("Aprovado, segue"). Capa: "7 anos / gastando / mais do que / arrecadou."
- Narração: Algenib 1,3, atempo 1,0786, -15 LUFS = 178,51 s (QUADROS 5382). Parágrafos 2023/2024 regravados ("três milhões e quatrocentos/quinhentos"; v1 em audio/antigos/).
- CTA FALADO conferido na transcrição do trecho (beam 5): "Sigam o arroba Eumagnoleite e o arroba Eugênio DMR para mais informações." (174,50 s).
- Sincronia: 497 palavras, última em 178,10 s; src/videos/orcamentoparatinga1824/palavras.ts.
- Levantamento e-TCM concluído (160 PDFs em ~/Documents/RECEITAS-DESPESAS-PARATINGA/2018-2024/documentos_tcm); OCR de 2019/2020 com 2018-2024/scripts/ocr.swift; Decisões em .../decisoes.
- Cabeçalho com dois selos: src/videos/orcamentoparatinga1824/CabecalhoDuplo.tsx (+ MarcaDaguaDupla); quadros em revisao/teste-cabecalho-3quadros.jpg.

## Falta
revisão (aprovação) → render sem folhas → lista_pdf aplicar (42 folhas) → conferência 2 dos números → capa e legenda → cópia em ~/Documents/NOVO LOTE/PARATINGA 2018-2024/ → status e aprendizados.

## 09/11/2026 (tarde): folhas com 6 a 7 linhas
Pedido do Magno: Câmara aberta por tipo de despesa (folha, INSS, consultoria, empresas, combustível, aluguel de carros, equipamentos) e todas as folhas com 6 a 7 linhas. Feito com scripts/folhas_extra.py; as 42 folhas fecham com o total. Vídeo reaplicado (179,9 s) e recopiado para NOVO LOTE. Versão anterior em edicoes/094.../antigos/.
