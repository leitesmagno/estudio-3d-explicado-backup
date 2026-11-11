# 033. orçamento de inhambupé
- Perfil: @eumagnoleite (id: eumagnoleite)
- Código: orcamentoinhambupe · Nome: OrcamentoInhambupe
- Etapa atual: EM STAND-BY desde 06/11/2026, a pedido da pessoa: ela vai conversar com um auditor fiscal no fim de semana e deve trazer mudanças de condução do vídeo (e aprendizados novos para registrar). Não retomar sem ela.
- Pedido da pessoa: foco em combustível, locação de veículos e limpeza pública, que dobraram de 2024 para 2025/2026. Dados só do TCM-BA (levantamento em ~/Documents/RECEITAS-DESPESAS-INHAMBUPE, relatório RELATORIO_TCM_INHAMBUPE_2024_2026.md).
- Formato: igual a Belmonte versão 2 (032): Kit Mapas + Estúdio 3D, maquete redonda com cofre no meio, narração 1,15x, plaquinha de comparação no topo para cada número, valor exato embaixo, empurrão de câmera, legenda padrão da série, marca d'água @eumagnoleite quicando.
- Narração: voz Mário (ElevenLabs, escolha da pessoa; Belmonte usou Roger), arquivo original de 157,96 s. narracao-norm-1x.wav (silêncio cortado) = 157,76 s; narracao-norm.wav a 1,15x = 137,20 s. AUDIO_SEG 137.2, QUADROS = 4143.
- Sincronia: 315 palavras, última ("informações.") termina em 136,90 s. Sem ajustes no palavras.json.
- Repetidas: "Entrou:" 12,18 / 32,82 / 51,64; "Saiu:" 21,74 / 41,56 / 59,88; "2024," 9,86; "2025," 29,30; "2026," 49,60; "Agora repara." ~65,7; "Combustível:" ~69,0; "Aluguel" ~85; "Limpeza pública:" ~97,4; "Somando" 106,0; "zero" 119,42; "improcedente." 127,06; "@eumagnoleite" 135,10.

## Onde parou (06/11/2026, versão 4 em andamento)
- Feito na v4: roteiro sem União/Estado/Fundeb ("Arrecadou" = total do PDF do TCM: 2024 R$ 190,1 mi, 2025 R$ 189,7 mi, 2026 jan–set R$ 177,1 mi = linha "Totais" do PCMGE016; "13 a mais do que arrecadou"); sem segurança pública; nome Inhambupe (voz: "Inhambupi"). Narração v4 montada (audio/narracao-v4-final.wav → narracao-norm.wav = 141,91 s) e sincronizada (321 palavras). Código 3D ajustado (AUDIO_SEG 141.91) e compila. Kit Mapas: roteiro.ts/index.tsx do trecho B simplificados (só "R$ 190 MI · ARRECADOU EM 2024", sem setas) e compilam.
- Falta: gerar o mapa v4 de novo (npm run tiles/render -- OrcamentoInhambupe no Kit Mapas e copiar para mapas/inhambupe.mp4; o arquivo atual ainda é o da v3, 22,2 s), quadros de revisão, vídeo final, capa (a capa.jpg em edicoes é da v3) e legenda (tirar as origens e trocar 2026 para R$ 177,1 mi / 13 a mais).
- Versões entregues antes: edicoes/033.../antigos (v1 e v2).
