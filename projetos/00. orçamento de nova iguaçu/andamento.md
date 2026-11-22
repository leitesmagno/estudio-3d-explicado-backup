# 00. orçamento de nova iguaçu
- Perfil: @eumagnoleite · Código: orcamentonovaiguacu (Estúdio) · Kit Mapas: orcamento-novaiguacu (OrcamentoNovaIguacu)
- Pedido direto do Magno, 15/11/2026: 1º município fora da Bahia (RJ), com os guias do auditor (~/Documents/GUIAS-METODO/auditor-2026-11-15). Molde 150 Salvador / 093 Ilhéus. Feito no Mac (sob demanda).
- Regra nova do Magno: pesquisa e PDFs DE DENTRO do tribunal do estado (TCE-RJ), pelo Google Chrome. SICONFI e notícias só conferem.
- IBGE 3303500. Dados em ~/Documents/RECEITAS-DESPESAS-NOVA-IGUACU/ (siconfi/, documentos_tce/, scripts/).
- TCE-RJ Dados Abertos (dados.tcerj.tc.br/api/v1): receitas_municipio bate centavo a centavo com o RREO EXCETO intraorçamentárias (2.638.186.154,77 / 2.585.985.159,35 / 1.835.274.589,82 até ago/2026). Por isso receita e despesa SEM intra. prestacao_contas_municipio: 2024 FAVORÁVEL (213803-5/2025), 2025 EM ANÁLISE (218353-7/2026). Download de empenho_municipio (muito grande) não terminou.
- Despesa (RREO anexo 2, exceto intra; 2024/2025 empenhada, 2026 liquidada até ago): scripts/setores.py → setores.json. 2024 gastou 2.772,51 mi (134 a mais), 2025 2.726,53 (141 a mais), 2026 1.831,96 (sobraram 3,3).
- Achados: Obras e serviços urbanos 482 mi (2024) → 272 (2025). Tribunal: contas 2025 em análise; técnicos e MP de Contas apontaram MDE 198.570.960,54 = 22,22% (mínimo 25% ≈ 223 mi, faltam ≈ 25 mi, conta própria); Prefeitura notificada (10 dias) — fontes: Agenda do Poder 30/10/2026, Elizeu Pires 31/10/2026, TCE-RJ prestação de contas.
- Zeros: Água e esgoto = concessão Águas do Rio desde 01/11/2021 (contrato do Governo do RJ; cedae.com.br). Agricultura fica junto com Meio Ambiente (SEMAM, Secretaria de Agricultura e Meio Ambiente). Segurança (guarda) fora da fala.
- Roteiro (modo autônomo, revisado = aprovado): audio/roteiro-falado.txt, 360 palavras. Voz Google Algenib 1,3 + atempo 1,06 + loudnorm -15,5 = 171,11 s. Sincronia: Whisper small local + alinhar_roteiro → src/videos/orcamentonovaiguacu/palavras.ts (3 avisos: "590", "730", "@").
- Kit Mapas: src/videos/orcamento-novaiguacu copiado de orcamento-salvadortcm, textos trocados, registrado no Root; satélite em public/satelite/orcamento-novaiguacu (cópia do tinho-nova-iguacu, só até zoom 10; falta npm run tiles e acertar tempos A/B pelo palavras.ts).
- FALTA: PDF do processo 218353-7/26 no TCE-RJ (tem reCAPTCHA: Magno marca); código da maquete (copiar orcamentosalvadortcm e trocar setores/valores/achados); fontes.md; revisão; render; capa e legenda.

## Atualização 15/11/2026 (tarde)
- Magno marcou o captcha; processo 218.353-7/26 aberto no Chrome. DESCOBERTA: as peças do TCE-RJ baixam direto, sem captcha nem cookie: https://www.tcerj.tc.br/consulta-processo/VisualizarPDF/VisualizarPDF?url=documento/processo/<nº>/<dígito>/<ano>/documento/<peça − 1>. Assim veio também o processo de 2024 (213.803-5/2025: acórdão 4392/2026-PLEN, parecer favorável com ressalvas).
- O relatório técnico do TCE-RJ usa o Balanço CONSOLIDADO (com intraorçamentárias): 2025 = 2.767.597.032,00 / 2.899.688.859,30. Por isso o vídeo voltou ao critério com intra (bate com o RREO "TOTAL"). Roteiro v2 (365 palavras; v1 em audio/antigos), voz v2 169,26 s, palavras.ts refeito.
- Educação (MDE, só impostos): 2024 = 220.141.588,66 (25,75%); 2025 = 198.570.960,54 (22,22%), base 893.763.382,00.
- Código: src/videos/orcamentonovaiguacu/OrcamentoNovaIguacu.tsx gerado por ~/Documents/RECEITAS-DESPESAS-NOVA-IGUACU/scripts/gera_tsx.py (a partir do 150), Root registrado, tsc ok. Mapa renderizado (mapas/novaiguacu.mp4, 19,3 s).
- Revisão (70 quadros): corrigidos esporte "596/188 mil" → arredonda como a voz; barras da educação afastadas. REVISÃO APROVADA (modo autônomo).
- Folhas PDF: 39 (3 de receita + 36 de setor), saida/folha-pdf/config-setores.json (scripts/folhas.py), cada uma fecha com o total.
- fontes.md pronto (cópia em ~/Documents/FONTES). Legenda pronta (edicoes/202.../NOVA IGUAÇU - legenda.txt).
- Render final: scripts/vez_final.sh 4950 (trava, nice, 1 núcleo) rodando.
- 16:37 VÍDEO FINAL PRONTO: edicoes/202.../NOVA IGUAÇU.mp4 (1080x1920, 170,17 s, 82,9 MB, -19,0 dB médio, pico -3,6), 39 folhas, capa 'Educação: faltaram 25 mi para o mínimo.' Conferido (folha de contato). Não postado nem no site (esperando o Magno).
- 15/11 noite: PUBLICADO no site: /rj/ (estado No ar), /rj/nova-iguacu/ e /rj/nova-iguacu/00-nova-iguacu-orcamento/ (30 trechos, 56 checagens, 5 PDFs do TCE-RJ com página). Site ampliado para RJ: descobre.py (projetos NN.), site.py (IBGE RJ, POP 2026, /uf/, TCE-RJ), dados_videos.py (arquivo.pdf#página nos manuais), manuais/00-nova-iguacu-orcamento.json. Cópias .antes-rj.py.
